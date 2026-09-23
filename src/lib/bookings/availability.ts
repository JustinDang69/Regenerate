/* =============================================================================
   Bookings — slot computation (the clinic's rules, applied to Graph data).
   -----------------------------------------------------------------------------
   Rules (client brief, Sep 2026):
     • Every appointment reserves a 50-minute block.
     • Customer-facing start times follow a 50-minute rhythm anchored to the
       clinic's opening time for that day, read live from Bookings business
       hours — never hard-coded. 09:30–20:30 therefore yields 09:30 … 19:30,
       the last start that still ends inside the day (19:30 + 50 = 20:20).
     • Minimum 30-minute lead time on the website, regardless of what the
       Bookings UI is configured with.
     • A slot is offered only if at least ONE practitioner assigned to the
       service is free for the ENTIRE block.
     • Practitioner identities are never sent to the browser, and never
       written to a log — diagnostics use positional aliases (staff-1, …).

   CAPACITY (production incident, Sep 2026): getStaffAvailability alone let the
   same 10:20 slot be sold twice, both bookings landing on the same
   practitioner. A practitioner is now free only when Graph's availability
   covers the block AND they have no overlapping appointment in calendarView.
   Neither source is cached.
   ========================================================================== */
import "server-only";
import {
  getAppointments,
  getBusiness,
  getStaffAvailability,
  type BookedAppointment,
  type BookingService,
  type BusinessHours,
  type UtcRange,
} from "@/lib/bookings/graph";
import { logSafe } from "@/lib/bookings/log";
import {
  melbourneDate,
  melbourneHM,
  melbourneToUtcMs,
  melbourneWeekday,
  parseGraphClock,
  type LocalDate,
} from "@/lib/bookings/time";

export const SLOT_MINUTES = 50;
export const MIN_LEAD_MINUTES = 30;
/** How far ahead the website accepts bookings. */
export const MAX_DAYS_AHEAD = 90;

const MS = 60_000;

export type Slot = {
  startUtc: number;
  endUtc: number;
  /** "HH:MM" Melbourne. */
  time: string;
  /** Staff ids free for the whole block — SERVER-SIDE ONLY, never returned. */
  freeStaffIds: string[];
};

/** Why a practitioner was excluded. Logged; never shown to a customer. */
type Reason = "available" | "graph-availability" | "existing-appointment" | "lead-time";

/* --- Pure: candidate start times ------------------------------------------- */

/**
 * The 50-minute rhythm for one day, derived from that day's business hours.
 * Each opening period is walked independently from its own opening time, so a
 * split day (e.g. a lunch break configured as two periods) restarts the
 * rhythm after the break rather than drifting through it.
 */
export function candidateStartsFrom(businessHours: BusinessHours[] | undefined, date: LocalDate): number[] {
  const weekday = melbourneWeekday(date);
  const hours = businessHours?.find((h) => h.day?.toLowerCase() === weekday);
  if (!hours) return [];

  const starts: number[] = [];
  for (const slot of hours.timeSlots ?? []) {
    const open = parseGraphClock(slot.startTime);
    const close = parseGraphClock(slot.endTime);
    if (open === null || close === null || close <= open) continue;
    // A start is valid only when the full block finishes by closing time.
    for (let t = open; t + SLOT_MINUTES <= close; t += SLOT_MINUTES) {
      starts.push(melbourneToUtcMs(date, Math.floor(t / 60), t % 60));
    }
  }
  return [...new Set(starts)].sort((a, b) => a - b);
}

export async function candidateStarts(date: LocalDate): Promise<number[]> {
  const business = await getBusiness();
  return candidateStartsFrom(business.businessHours, date);
}

/* --- Pure: slot selection --------------------------------------------------- */

/* Internal predicates for selectSlots. Behaviour is unchanged. */
function covers(ranges: UtcRange[], start: number, end: number) {
  return ranges.some((r) => r.start <= start && r.end >= end);
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

export type SelectInput = {
  staffIds: string[];
  candidates: number[];
  /** Free ranges per staff id, from getStaffAvailability. */
  availability: Map<string, UtcRange[]>;
  /** Real appointments from calendarView. */
  appointments: BookedAppointment[];
  nowUtc: number;
  /** Set by the caller for logging context; omitted in unit tests. */
  logContext?: { serviceId: string; date: string };
};

/**
 * Applies the clinic's rules to already-fetched data. Pure and synchronous,
 * so the capacity behaviour is unit-testable without touching Graph.
 */
export function selectSlots(input: SelectInput): Slot[] {
  const { staffIds, candidates, availability, appointments, nowUtc } = input;
  if (staffIds.length === 0) return [];

  /* Positional aliases so a diagnostic line can say WHICH practitioner was
     busy without ever naming or identifying them. */
  const alias = new Map(staffIds.map((id, i) => [id, `staff-${i + 1}`]));
  const earliest = nowUtc + MIN_LEAD_MINUTES * MS;

  const slots: Slot[] = [];
  const rejected: { time: string; staff: string; available: false; reason: Reason }[] = [];

  for (const startUtc of candidates) {
    const endUtc = startUtc + SLOT_MINUTES * MS;
    const time = melbourneHM(startUtc);

    if (startUtc < earliest) {
      rejected.push({ time, staff: "*", available: false, reason: "lead-time" });
      continue;
    }

    const freeStaffIds: string[] = [];
    for (const id of staffIds) {
      if (!covers(availability.get(id) ?? [], startUtc, endUtc)) {
        rejected.push({ time, staff: alias.get(id)!, available: false, reason: "graph-availability" });
        continue;
      }
      const booked = appointments.some(
        (a) => a.staffMemberIds.includes(id) && overlaps(startUtc, endUtc, a.start, a.end)
      );
      if (booked) {
        rejected.push({ time, staff: alias.get(id)!, available: false, reason: "existing-appointment" });
        continue;
      }
      freeStaffIds.push(id);
    }

    if (freeStaffIds.length === 0) continue;
    slots.push({ startUtc, endUtc, time, freeStaffIds });
  }

  if (rejected.length > 0 && input.logContext) {
    logSafe("info", "bookings: slots excluded", {
      ...input.logContext,
      staffCount: staffIds.length,
      excluded: rejected,
    });
  }

  return slots;
}

/* --- I/O: fetch everything, then select ------------------------------------ */

/**
 * All bookable slots for a service on a Melbourne date. Reads business hours,
 * staff availability and the real appointment calendar for that day — the
 * latter two uncached and in parallel, so the answer is as fresh as possible.
 */
export async function computeSlots(service: BookingService, date: LocalDate, nowUtc = Date.now()): Promise<Slot[]> {
  if (service.staffMemberIds.length === 0) return [];

  const candidates = await candidateStarts(date);
  if (candidates.length === 0) return [];

  /* Span the whole Melbourne day, plus the tail of the last block, so an
     appointment that starts before midnight still overlaps correctly. */
  const dayStart = melbourneToUtcMs(date, 0, 0);
  const nextDay = melbourneDate(dayStart + 36 * 60 * MS);
  const dayEnd = melbourneToUtcMs(nextDay, 0, 0);

  const [availability, appointments] = await Promise.all([
    getStaffAvailability(service.staffMemberIds, dayStart, dayEnd),
    getAppointments(dayStart, dayEnd),
  ]);

  return selectSlots({
    staffIds: service.staffMemberIds,
    candidates,
    availability,
    appointments,
    nowUtc,
    logContext: { serviceId: service.id, date: `${date.y}-${date.m}-${date.d}` },
  });
}

/* --- Input validation ------------------------------------------------------ */

export function parseLocalDate(input: unknown): LocalDate | null {
  if (typeof input !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
  if (!m) return null;
  const [y, mo, d] = [m[1], m[2], m[3]].map(Number);
  const probe = new Date(Date.UTC(y, mo - 1, d));
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) return null;
  return { y, m: mo, d };
}

export function parseHM(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const m = /^(\d{2}):(\d{2})$/.exec(input.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const mi = Number(m[2]);
  if (h > 23 || mi > 59) return null;
  return `${m[1]}:${m[2]}`;
}

/** Date must be today (Melbourne) or up to MAX_DAYS_AHEAD days later. */
export function isDateInBookingWindow(date: LocalDate, nowUtc = Date.now()) {
  const today = melbourneDate(nowUtc);
  const dayMs = melbourneToUtcMs(date, 12, 0);
  const todayMs = melbourneToUtcMs(today, 12, 0);
  const diffDays = Math.round((dayMs - todayMs) / (24 * 60 * MS));
  return diffDays >= 0 && diffDays <= MAX_DAYS_AHEAD;
}
