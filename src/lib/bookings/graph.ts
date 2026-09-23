/* =============================================================================
   Bookings — Microsoft Graph data access (v1.0 only, server-only).
   -----------------------------------------------------------------------------
   Thin typed wrappers over the four Graph calls the backend needs:

     GET  /solutions/bookingBusinesses/{id}                    (business hours)
     GET  /solutions/bookingBusinesses/{id}/services
     POST /solutions/bookingBusinesses/{id}/getStaffAvailability
     POST /solutions/bookingBusinesses/{id}/appointments

   The business id comes ONLY from BOOKINGS_BUSINESS_ID. Business and service
   metadata change rarely, so they are cached in module memory briefly;
   availability and appointment creation are never cached.
   ========================================================================== */
import "server-only";
import { graphRequest } from "@/lib/graph/client";
import { serviceOrderIndex } from "@/lib/bookings/service-map";
import type { BookingQuestionAnswer } from "@/lib/bookings/custom-questions";
import { isoDurationToMinutes, parseGraphDateTime, toGraphDateTime, type GraphDateTimeTimeZone } from "@/lib/bookings/time";

const METADATA_TTL_MS = 5 * 60_000;

export function bookingsBusinessId(): string | null {
  return process.env.BOOKINGS_BUSINESS_ID || null;
}

function base() {
  const id = bookingsBusinessId();
  if (!id) throw new Error("BOOKINGS_BUSINESS_ID is not configured");
  return `/solutions/bookingBusinesses/${encodeURIComponent(id)}`;
}

/* --- Business (hours) ------------------------------------------------------ */

export type BusinessHours = { day: string; timeSlots: { startTime: string; endTime: string }[] };
type GraphBusiness = { displayName?: string; businessHours?: BusinessHours[] };

let businessCache: { at: number; value: GraphBusiness } | null = null;

export async function getBusiness(): Promise<GraphBusiness> {
  if (businessCache && Date.now() - businessCache.at < METADATA_TTL_MS) return businessCache.value;
  const value = await graphRequest<GraphBusiness>(`${base()}?$select=displayName,businessHours`);
  businessCache = { at: Date.now(), value };
  return value;
}

/* --- Services -------------------------------------------------------------- */

export type BookingService = {
  id: string;
  displayName: string;
  /** ISO-8601 as Graph stores it, e.g. "PT50M". */
  defaultDuration: string | null;
  durationMinutes: number | null;
  price: number | null;
  priceType: string | null;
  staffMemberIds: string[];
  isHiddenFromCustomers: boolean;
};

type GraphService = {
  id?: string;
  displayName?: string;
  defaultDuration?: string;
  defaultPrice?: number;
  defaultPriceType?: string;
  staffMemberIds?: string[];
  isHiddenFromCustomers?: boolean;
};

let servicesCache: { at: number; value: BookingService[] } | null = null;

export async function getServices(): Promise<BookingService[]> {
  if (servicesCache && Date.now() - servicesCache.at < METADATA_TTL_MS) return servicesCache.value;
  const json = await graphRequest<{ value?: GraphService[] }>(`${base()}/services`);
  const value = (json.value ?? [])
    .filter((s): s is GraphService & { id: string } => typeof s.id === "string" && s.id.length > 0)
    .map((s) => ({
      id: s.id,
      displayName: s.displayName ?? "",
      defaultDuration: s.defaultDuration ?? null,
      durationMinutes: isoDurationToMinutes(s.defaultDuration),
      price: typeof s.defaultPrice === "number" ? s.defaultPrice : null,
      priceType: s.defaultPriceType ?? null,
      staffMemberIds: Array.isArray(s.staffMemberIds) ? s.staffMemberIds.filter((x) => typeof x === "string") : [],
      isHiddenFromCustomers: s.isHiddenFromCustomers === true,
    }));
  servicesCache = { at: Date.now(), value };
  return value;
}

/**
 * Services a customer may book, in the clinic's confirmed order:
 * Consultation first, then Microneedling before Mesotherapy, face before
 * scalp. Graph returns them in an arbitrary order (in production Consultation
 * came back LAST), so the order is imposed here rather than relied upon.
 *
 * A service the clinic adds later that is not in the canonical table keeps
 * its relative position at the end — it appears rather than disappearing.
 */
export function orderForCustomers(services: BookingService[]): BookingService[] {
  return [...services]
    .map((s, i) => ({ s, i, order: serviceOrderIndex(s.displayName) }))
    .sort((a, b) => a.order - b.order || a.i - b.i)
    .map((x) => x.s);
}

export async function getBookableServices(): Promise<BookingService[]> {
  return orderForCustomers((await getServices()).filter((s) => !s.isHiddenFromCustomers));
}

export async function findBookableService(serviceId: string): Promise<BookingService | null> {
  return (await getBookableServices()).find((s) => s.id === serviceId) ?? null;
}

/* --- Staff availability ---------------------------------------------------- */

export type UtcRange = { start: number; end: number };

type GraphAvailabilityItem = {
  status?: string;
  startDateTime?: GraphDateTimeTimeZone;
  endDateTime?: GraphDateTimeTimeZone;
};
type GraphStaffAvailability = { staffId?: string; availabilityItems?: GraphAvailabilityItem[] };

/**
 * Returns, per staff id, the merged ranges in which Graph reports the person
 * as AVAILABLE within [startUtc, endUtc).
 *
 * NOTE: getStaffAvailability alone has proven insufficient. With
 * "assign any of your selected staff" enabled, Bookings reported a
 * practitioner as available for a slot they already had an appointment in,
 * which let the same 50 minutes be sold twice. Callers must therefore ALSO
 * subtract the real appointments from getAppointments() below.
 * Never cached.
 */
export async function getStaffAvailability(
  staffIds: string[],
  startUtc: number,
  endUtc: number
): Promise<Map<string, UtcRange[]>> {
  const result = new Map<string, UtcRange[]>();
  if (staffIds.length === 0) return result;

  const json = await graphRequest<{ value?: GraphStaffAvailability[] }>(`${base()}/getStaffAvailability`, {
    method: "POST",
    body: {
      staffIds,
      startDateTime: toGraphDateTime(startUtc),
      endDateTime: toGraphDateTime(endUtc),
    },
  });

  for (const staff of json.value ?? []) {
    if (!staff.staffId) continue;
    const free: UtcRange[] = [];
    for (const item of staff.availabilityItems ?? []) {
      if (item.status?.toLowerCase() !== "available") continue;
      const s = parseGraphDateTime(item.startDateTime);
      const e = parseGraphDateTime(item.endDateTime);
      if (s === null || e === null || e <= s) continue;
      free.push({ start: s, end: e });
    }
    result.set(staff.staffId, mergeRanges(free));
  }
  // Staff Graph did not mention at all are unavailable (empty list).
  for (const id of staffIds) if (!result.has(id)) result.set(id, []);
  return result;
}

export function mergeRanges(ranges: UtcRange[]): UtcRange[] {
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const out: UtcRange[] = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    if (last && r.start <= last.end) last.end = Math.max(last.end, r.end);
    else out.push({ ...r });
  }
  return out;
}

/* --- Custom questions ------------------------------------------------------ */

/**
 * The business's custom questions (Age / Height / Weight and anything else
 * the clinic has created).
 *
 *   GET /solutions/bookingBusinesses/{id}/customQuestions
 *
 * Only id and displayName are kept. The ids are opaque GUIDs used to build
 * appointment answers server-side; they are NEVER returned to the browser.
 * Cached briefly like the other metadata — questions change rarely, and a
 * newly created one appears within the TTL.
 */
export type CustomQuestion = { id: string; displayName: string };

type GraphCustomQuestion = { id?: string; displayName?: string };

let customQuestionsCache: { at: number; value: CustomQuestion[] } | null = null;

export async function getCustomQuestions(): Promise<CustomQuestion[]> {
  if (customQuestionsCache && Date.now() - customQuestionsCache.at < METADATA_TTL_MS) {
    return customQuestionsCache.value;
  }
  const json = await graphRequest<{ value?: GraphCustomQuestion[] }>(`${base()}/customQuestions`);
  const value = (json.value ?? [])
    .filter((q): q is GraphCustomQuestion & { id: string } => typeof q.id === "string" && q.id.length > 0)
    .map((q) => ({ id: q.id, displayName: q.displayName ?? "" }));
  customQuestionsCache = { at: Date.now(), value };
  return value;
}

/* --- Booked appointments (calendarView) ------------------------------------ */

export type BookedAppointment = {
  id: string | null;
  start: number;
  end: number;
  staffMemberIds: string[];
};

type GraphCalendarEntry = {
  id?: string;
  startDateTime?: GraphDateTimeTimeZone;
  endDateTime?: GraphDateTimeTimeZone;
  staffMemberIds?: string[];
};

/**
 * Real appointments in the Bookings calendar between two instants.
 *
 *   GET /solutions/bookingBusinesses/{id}/calendarView?start=…&end=…
 *
 * This is the authoritative record of what is actually booked, and it is the
 * capacity guard: an appointment assigned to a practitioner makes that
 * practitioner busy for its whole duration, whatever getStaffAvailability
 * claims. NEVER cached — a slot's capacity can change second to second.
 */
export async function getAppointments(startUtc: number, endUtc: number): Promise<BookedAppointment[]> {
  const q = new URLSearchParams({
    start: new Date(startUtc).toISOString(),
    end: new Date(endUtc).toISOString(),
  });
  const json = await graphRequest<{ value?: GraphCalendarEntry[] }>(`${base()}/calendarView?${q.toString()}`);

  const out: BookedAppointment[] = [];
  for (const a of json.value ?? []) {
    const start = parseGraphDateTime(a.startDateTime);
    const end = parseGraphDateTime(a.endDateTime);
    if (start === null || end === null || end <= start) continue;
    out.push({
      id: a.id ?? null,
      start,
      end,
      staffMemberIds: Array.isArray(a.staffMemberIds) ? a.staffMemberIds.filter((x) => typeof x === "string") : [],
    });
  }
  return out;
}

/* --- Appointment creation -------------------------------------------------- */

export type CreateAppointmentInput = {
  serviceId: string;
  staffMemberId: string;
  startUtc: number;
  endUtc: number;
  durationMinutes: number;
  customer: { firstName: string; lastName: string; email: string; phone: string; notes?: string };
  /** Answers to the business's custom questions (Age / Height / Weight). */
  customQuestionAnswers?: BookingQuestionAnswer[];
};

export type CreatedAppointment = {
  id: string | null;
  startUtc: number | null;
  endUtc: number | null;
};

type GraphAppointment = {
  id?: string;
  startDateTime?: GraphDateTimeTimeZone;
  endDateTime?: GraphDateTimeTimeZone;
};

/**
 * The exact JSON posted to Graph. Pure and exported so its SHAPE can be
 * asserted in tests without touching the network.
 *
 * ODATA TYPE ANNOTATIONS — do not remove them.
 * Microsoft's documented create-appointment example annotates every nested
 * collection, and this payload previously omitted them. Graph accepted the
 * request and created the appointment either way, but nested values could be
 * dropped in silence. That is the same failure mode as the staffMembers PATCH,
 * which returned 204 while discarding `timeZone` because the body carried no
 * type cast. Annotating the collections is the documented shape:
 *
 *   customers@odata.type              #Collection(microsoft.graph.bookingCustomerInformation)
 *   customQuestionAnswers@odata.type  #Collection(microsoft.graph.bookingQuestionAnswer)
 *   answerInputType@odata.type        #microsoft.graph.answerInputType
 *   staffMemberIds@odata.type         #Collection(String)
 */
export function buildAppointmentBody(input: CreateAppointmentInput): Record<string, unknown> {
  const { customer } = input;
  const timeZone = toGraphDateTime(input.startUtc).timeZone;
  const answers = input.customQuestionAnswers ?? [];

  const customerInformation: Record<string, unknown> = {
    "@odata.type": "#microsoft.graph.bookingCustomerInformation",
    name: `${customer.firstName} ${customer.lastName}`.trim(),
    emailAddress: customer.email,
    phone: customer.phone,
    timeZone,
    /* Always send notes, even when empty: an omitted property and an empty
       one are different things to Graph, and the clinic expects the field. */
    notes: customer.notes ?? "",
  };

  if (answers.length > 0) {
    customerInformation["customQuestionAnswers@odata.type"] =
      "#Collection(microsoft.graph.bookingQuestionAnswer)";
    customerInformation.customQuestionAnswers = answers.map((a) => ({
      ...a,
      "answerInputType@odata.type": "#microsoft.graph.answerInputType",
    }));
  }

  return {
    "@odata.type": "#microsoft.graph.bookingAppointment",
    serviceId: input.serviceId,
    "staffMemberIds@odata.type": "#Collection(String)",
    staffMemberIds: [input.staffMemberId],
    startDateTime: { "@odata.type": "#microsoft.graph.dateTimeTimeZone", ...toGraphDateTime(input.startUtc) },
    endDateTime: { "@odata.type": "#microsoft.graph.dateTimeTimeZone", ...toGraphDateTime(input.endUtc) },
    duration: `PT${input.durationMinutes}M`,
    customerTimeZone: timeZone,
    isLocationOnline: false,
    // Let Bookings send its own confirmation email to the customer.
    optOutOfCustomerEmail: false,
    smsNotificationsEnabled: false,
    "customers@odata.type": "#Collection(microsoft.graph.bookingCustomerInformation)",
    customers: [customerInformation],
  };
}

export async function createAppointment(input: CreateAppointmentInput): Promise<CreatedAppointment> {
  const json = await graphRequest<GraphAppointment>(`${base()}/appointments`, {
    method: "POST",
    body: buildAppointmentBody(input),
  });
  return {
    id: json.id ?? null,
    startUtc: parseGraphDateTime(json.startDateTime),
    endUtc: parseGraphDateTime(json.endDateTime),
  };
}
