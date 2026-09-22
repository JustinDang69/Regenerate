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
 * Services a customer may book, in the order the website shows them.
 *
 * Consultation is pinned first: it is the clinic's intended first step, and
 * Graph returns services in an arbitrary order (in production it came back
 * LAST). Every other service keeps the order Bookings gave it.
 */
export function orderForCustomers(services: BookingService[]): BookingService[] {
  const isConsultation = (s: BookingService) => s.displayName.trim().toLowerCase() === CONSULTATION_NAME;
  return [...services.filter(isConsultation), ...services.filter((s) => !isConsultation(s))];
}

const CONSULTATION_NAME = "consultation";

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

/**
 * DIAGNOSTIC ONLY — the getStaffAvailability request and response exactly as
 * they go over the wire, so a timezone disagreement can be proven rather than
 * inferred. Returns raw dateTime/timeZone strings; contains no identity.
 * Does not affect booking behaviour.
 */
export async function getStaffAvailabilityRaw(staffIds: string[], startUtc: number, endUtc: number) {
  const request = {
    startDateTime: toGraphDateTime(startUtc),
    endDateTime: toGraphDateTime(endUtc),
  };
  const json = await graphRequest<{ value?: GraphStaffAvailability[] }>(`${base()}/getStaffAvailability`, {
    method: "POST",
    body: { staffIds, ...request },
  });
  return {
    request,
    /* Keyed by staff id; the caller maps to aliases before returning it. */
    byStaffId: new Map(
      (json.value ?? [])
        .filter((s): s is GraphStaffAvailability & { staffId: string } => typeof s.staffId === "string")
        .map((s) => [
          s.staffId,
          (s.availabilityItems ?? []).map((i) => ({
            status: i.status ?? null,
            start: i.startDateTime ?? null,
            end: i.endDateTime ?? null,
          })),
        ])
    ),
  };
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

/* --- Staff scheduling configuration (DIAGNOSTIC ONLY) ---------------------- */

/**
 * Per-practitioner SCHEDULING CONFIGURATION — never identity.
 *
 * `$select` deliberately excludes displayName, emailAddress and role, so the
 * practitioners' names and mailboxes are never fetched, never held in memory
 * and cannot be leaked by a later mistake. `id` is kept only to map a person
 * to a positional alias (staff-1, staff-2) and must not be returned.
 */
export type StaffScheduleConfig = {
  id: string;
  useBusinessHours: boolean | null;
  availabilityIsAffectedByPersonalCalendar: boolean | null;
  timeZone: string | null;
  workingHours: BusinessHours[];
};

type GraphStaffMember = {
  id?: string;
  useBusinessHours?: boolean;
  availabilityIsAffectedByPersonalCalendar?: boolean;
  timeZone?: string;
  workingHours?: BusinessHours[];
};

export async function getStaffScheduleConfig(): Promise<StaffScheduleConfig[]> {
  const select = "id,useBusinessHours,availabilityIsAffectedByPersonalCalendar,timeZone,workingHours";
  /* The collection is typed bookingStaffMemberBase, and these properties live
     on the derived bookingStaffMember — so $select needs an OData type cast.
     If the cast is rejected we fall back to the plain collection: that response
     also carries displayName and emailAddress, which the mapping below simply
     never reads, so they are dropped rather than returned. */
  let json: { value?: GraphStaffMember[] };
  try {
    json = await graphRequest<{ value?: GraphStaffMember[] }>(
      `${base()}/staffMembers/microsoft.graph.bookingStaffMember?$select=${select}`
    );
  } catch {
    json = await graphRequest<{ value?: GraphStaffMember[] }>(`${base()}/staffMembers`);
  }
  return (json.value ?? [])
    .filter((s): s is GraphStaffMember & { id: string } => typeof s.id === "string")
    .map((s) => ({
      id: s.id,
      useBusinessHours: typeof s.useBusinessHours === "boolean" ? s.useBusinessHours : null,
      availabilityIsAffectedByPersonalCalendar:
        typeof s.availabilityIsAffectedByPersonalCalendar === "boolean"
          ? s.availabilityIsAffectedByPersonalCalendar
          : null,
      timeZone: s.timeZone ?? null,
      workingHours: Array.isArray(s.workingHours) ? s.workingHours : [],
    }));
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

export async function createAppointment(input: CreateAppointmentInput): Promise<CreatedAppointment> {
  const { customer } = input;
  const body = {
    "@odata.type": "#microsoft.graph.bookingAppointment",
    serviceId: input.serviceId,
    staffMemberIds: [input.staffMemberId],
    startDateTime: { "@odata.type": "#microsoft.graph.dateTimeTimeZone", ...toGraphDateTime(input.startUtc) },
    endDateTime: { "@odata.type": "#microsoft.graph.dateTimeTimeZone", ...toGraphDateTime(input.endUtc) },
    duration: `PT${input.durationMinutes}M`,
    customerTimeZone: toGraphDateTime(input.startUtc).timeZone,
    isLocationOnline: false,
    // Let Bookings send its own confirmation email to the customer.
    optOutOfCustomerEmail: false,
    smsNotificationsEnabled: false,
    customers: [
      {
        "@odata.type": "#microsoft.graph.bookingCustomerInformation",
        name: `${customer.firstName} ${customer.lastName}`.trim(),
        emailAddress: customer.email,
        phone: customer.phone,
        timeZone: toGraphDateTime(input.startUtc).timeZone,
        ...(customer.notes ? { notes: customer.notes } : {}),
      },
    ],
  };

  const json = await graphRequest<GraphAppointment>(`${base()}/appointments`, { method: "POST", body });
  return {
    id: json.id ?? null,
    startUtc: parseGraphDateTime(json.startDateTime),
    endUtc: parseGraphDateTime(json.endDateTime),
  };
}
