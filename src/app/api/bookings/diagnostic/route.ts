/* =============================================================================
   GET /api/bookings/diagnostic — *** TEMPORARY *** inspection endpoint.
   -----------------------------------------------------------------------------
   TODO(remove): delete this route once the booking flow is settled. It exists
   to answer "why is Microsoft Graph filtering these times?" without anyone
   having to read the practitioners' calendars.

   Two modes:

     /api/bookings/diagnostic
       Connectivity only: can we authenticate, which Bookings business is
       visible, what opening hours are configured, and what 50-minute rhythm
       those hours produce.

     /api/bookings/diagnostic?date=2026-09-25&service=Consultation
       Full trace for one service on one date: the business candidate slots,
       each practitioner's scheduling CONFIGURATION, the free ranges Graph
       returns, the real appointments from calendarView, and a per-slot,
       per-practitioner accept/reject with a reason.

   PRIVACY — this endpoint is publicly reachable, so it is built to leak
   nothing even if indexed. Practitioners appear ONLY as positional aliases
   (staff-1, staff-2). Their names and email addresses are never requested
   from Graph at all (see getStaffScheduleConfig's $select). Customer details,
   appointment subjects, tokens, credentials, tenant/client ids and every
   environment variable are excluded; error text is scrubbed of GUIDs and
   token-like strings.

   It reads only. It never creates, changes or cancels anything.
   ========================================================================== */
import { NextResponse } from "next/server";
import { GraphAuthError, isGraphConfigured, scrubSensitive } from "@/lib/graph/auth";
import { graphRequest, GraphRequestError } from "@/lib/graph/client";
import {
  bookingsBusinessId,
  getAppointments,
  getBookableServices,
  getBusiness,
  getStaffAvailability,
  getStaffScheduleConfig,
  type BusinessHours,
} from "@/lib/bookings/graph";
import {
  candidateStartsFrom,
  covers,
  overlaps,
  MIN_LEAD_MINUTES,
  SLOT_MINUTES,
} from "@/lib/bookings/availability";
import { resolveServiceId } from "@/lib/bookings/service-map";
import { melbourneDate, melbourneHM, melbourneToUtcMs, melbourneWeekday, type LocalDate } from "@/lib/bookings/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Never index or cache a diagnostic endpoint. */
const HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

const MS = 60_000;

type BookingBusiness = { id?: string; displayName?: string };

function fail(status: number, stage: string, code: string, message: string) {
  return NextResponse.json(
    { success: false, stage, status, error: { code, message: scrubSensitive(message) } },
    { status, headers: HEADERS }
  );
}

/** Graph stores clock values as "09:30:00.0000000" — show "09:30". */
function hhmm(t: string | undefined) {
  return /^(\d{2}:\d{2})/.exec(t ?? "")?.[1] ?? String(t ?? "");
}

function formatHours(hours: BusinessHours[] | undefined) {
  return (hours ?? []).map((h) => ({
    day: h.day,
    timeSlots: (h.timeSlots ?? []).map((t) => `${hhmm(t.startTime)}–${hhmm(t.endTime)}`),
  }));
}

/** A UTC range as Melbourne local text, with the date when it is not `on`. */
function melbourneRange(start: number, end: number, on: LocalDate) {
  const label = (utc: number) => {
    const d = melbourneDate(utc);
    const sameDay = d.y === on.y && d.m === on.m && d.d === on.d;
    const time = melbourneHM(utc);
    return sameDay ? time : `${d.y}-${String(d.m).padStart(2, "0")}-${String(d.d).padStart(2, "0")} ${time}`;
  };
  return `${label(start)}–${label(end)}`;
}

function parseDateParam(v: string | null): LocalDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((v ?? "").trim());
  if (!m) return null;
  const [y, mo, d] = [m[1], m[2], m[3]].map(Number);
  const probe = new Date(Date.UTC(y, mo - 1, d));
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) return null;
  return { y, m: mo, d };
}

export async function GET(req: Request) {
  if (!isGraphConfigured()) {
    return fail(503, "config", "not_configured", "Microsoft Graph credentials are not configured in this environment.");
  }

  const url = new URL(req.url);
  const dateParam = url.searchParams.get("date");
  const serviceParam = url.searchParams.get("service");

  try {
    /* --- Mode 2: full trace for one service on one date ------------------- */
    if (dateParam || serviceParam) {
      if (!bookingsBusinessId()) {
        return fail(503, "config", "no_business_id", "BOOKINGS_BUSINESS_ID is not configured in this environment.");
      }

      const date = parseDateParam(dateParam);
      if (!date) return fail(422, "input", "date_invalid", "Pass ?date=YYYY-MM-DD, e.g. ?date=2026-09-25.");

      const services = await getBookableServices();
      const serviceId = resolveServiceId(serviceParam, services);
      if (!serviceId) {
        return fail(422, "input", "service_not_found", `Pass ?service= one of: ${services.map((s) => s.displayName).join(", ")}.`);
      }
      const service = services.find((s) => s.id === serviceId)!;

      const business = await getBusiness();
      const candidates = candidateStartsFrom(business.businessHours, date);

      /* Same window computeSlots uses, so the trace matches the live answer. */
      const dayStart = melbourneToUtcMs(date, 0, 0);
      const nextDay = melbourneDate(dayStart + 36 * 60 * MS);
      const dayEnd = melbourneToUtcMs(nextDay, 0, 0);

      const staffIds = service.staffMemberIds;
      const alias = new Map(staffIds.map((id, i) => [id, `staff-${i + 1}`]));

      const [availability, appointments, staffConfig] = await Promise.all([
        getStaffAvailability(staffIds, dayStart, dayEnd),
        getAppointments(dayStart, dayEnd),
        getStaffScheduleConfig(),
      ]);

      const configById = new Map(staffConfig.map((c) => [c.id, c]));
      const nowUtc = Date.now();
      const leadCutoff = nowUtc + MIN_LEAD_MINUTES * MS;

      /* Per-practitioner: scheduling configuration + what Graph says is free.
         Identity is reduced to the alias here and never recovered below. */
      const staff = staffIds.map((id) => {
        const c = configById.get(id);
        return {
          alias: alias.get(id),
          useBusinessHours: c?.useBusinessHours ?? null,
          availabilityIsAffectedByPersonalCalendar: c?.availabilityIsAffectedByPersonalCalendar ?? null,
          timeZone: c?.timeZone ?? null,
          /* Only meaningful when useBusinessHours is false — this is the usual
             reason live times are narrower than the clinic's opening hours. */
          workingHours: formatHours(c?.workingHours).filter((h) => h.day?.toLowerCase() === melbourneWeekday(date)),
          graphFreeRanges: (availability.get(id) ?? []).map((r) => melbourneRange(r.start, r.end, date)),
        };
      });

      /* calendarView appointments, aliased. No customer or service detail. */
      const bookedRanges = appointments
        .filter((a) => a.staffMemberIds.some((s) => alias.has(s)))
        .map((a) => ({
          range: melbourneRange(a.start, a.end, date),
          staff: a.staffMemberIds.map((s) => alias.get(s)).filter(Boolean),
        }));

      /* Per candidate slot: exactly the predicates selectSlots applies. */
      const slots = candidates.map((startUtc) => {
        const endUtc = startUtc + SLOT_MINUTES * MS;
        const beforeLeadTime = startUtc < leadCutoff;
        const staffResults = staffIds.map((id) => {
          if (!covers(availability.get(id) ?? [], startUtc, endUtc)) {
            return { staff: alias.get(id), accepted: false, reason: "graph-availability" as const };
          }
          if (appointments.some((a) => a.staffMemberIds.includes(id) && overlaps(startUtc, endUtc, a.start, a.end))) {
            return { staff: alias.get(id), accepted: false, reason: "existing-appointment" as const };
          }
          return { staff: alias.get(id), accepted: true, reason: "available" as const };
        });
        return {
          time: melbourneHM(startUtc),
          endTime: melbourneHM(endUtc),
          beforeLeadTime,
          offeredToCustomers: !beforeLeadTime && staffResults.some((r) => r.accepted),
          staff: staffResults,
        };
      });

      return NextResponse.json(
        {
          success: true,
          temporary: true,
          query: { date: dateParam, service: service.displayName },
          timeZone: "Australia/Melbourne",
          slotMinutes: SLOT_MINUTES,
          minLeadMinutes: MIN_LEAD_MINUTES,
          weekday: melbourneWeekday(date),
          businessHoursForDay: formatHours(business.businessHours).filter(
            (h) => h.day?.toLowerCase() === melbourneWeekday(date)
          ),
          businessCandidateSlots: candidates.map(melbourneHM),
          staffCount: staffIds.length,
          staff,
          existingBookings: bookedRanges,
          slots,
          offeredToCustomers: slots.filter((s) => s.offeredToCustomers).map((s) => s.time),
        },
        { headers: HEADERS }
      );
    }

    /* --- Mode 1: connectivity + configured hours -------------------------- */
    const json = await graphRequest<{ value?: BookingBusiness[] }>("/solutions/bookingBusinesses");
    const businesses = (json.value ?? []).map((b) => ({ id: b.id ?? null, displayName: b.displayName ?? null }));

    let schedule: unknown = null;
    if (bookingsBusinessId()) {
      const business = await getBusiness();
      const date = melbourneDate(Date.now());
      schedule = {
        businessHours: formatHours(business.businessHours),
        rhythmToday: {
          date: `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`,
          slotMinutes: SLOT_MINUTES,
          candidateStarts: candidateStartsFrom(business.businessHours, date).map(melbourneHM),
        },
      };
    }

    return NextResponse.json(
      {
        success: true,
        temporary: true,
        count: businesses.length,
        bookingBusinesses: businesses,
        schedule,
        hint: "Add ?date=YYYY-MM-DD&service=<service name> for a full per-slot trace.",
      },
      { headers: HEADERS }
    );
  } catch (err) {
    if (err instanceof GraphAuthError) return fail(err.status, "auth", err.code ?? "token_error", err.message);
    if (err instanceof GraphRequestError) return fail(err.status, "graph", err.code, err.message);
    return fail(500, "graph", "internal", err instanceof Error ? err.message : "Unknown error");
  }
}
