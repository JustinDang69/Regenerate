/* =============================================================================
   Bookings — slot computation (the clinic's rules, applied to Graph data).
   -----------------------------------------------------------------------------
   Rules (client brief, Sep 2026):
     • Every appointment reserves a 50-minute block.
     • Customer-facing start times follow a 50-minute rhythm anchored to the
       clinic's opening time for that day (09:30, 10:20, 11:10 …).
     • Minimum 30-minute lead time on the website, regardless of what the
       Bookings UI is configured with.
     • A slot is offered only if at least ONE practitioner assigned to the
       service is free for the ENTIRE block. Time off and existing
       appointments make a practitioner unavailable (Graph reports this).
     • Practitioner identities are never sent to the browser.
   ========================================================================== */
import "server-only";
import {
  getBusiness,
  getStaffAvailability,
  type BookingService,
  type UtcRange,
} from "@/lib/bookings/graph";
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

/** Candidate start instants for `date`, following the 50-minute rhythm. */
export async function candidateStarts(date: LocalDate): Promise<number[]> {
  const business = await getBusiness();
  const weekday = melbourneWeekday(date);
  const hours = business.businessHours?.find((h) => h.day?.toLowerCase() === weekday);
  if (!hours) return [];

  const starts: number[] = [];
  for (const slot of hours.timeSlots ?? []) {
    const open = parseGraphClock(slot.startTime);
    const close = parseGraphClock(slot.endTime);
    if (open === null || close === null || close <= open) continue;
    for (let t = open; t + SLOT_MINUTES <= close; t += SLOT_MINUTES) {
      starts.push(melbourneToUtcMs(date, Math.floor(t / 60), t % 60));
    }
  }
  return starts.sort((a, b) => a - b);
}

function covers(ranges: UtcRange[], start: number, end: number) {
  return ranges.some((r) => r.start <= start && r.end >= end);
}

/**
 * All bookable slots for a service on a Melbourne date. Uses one Graph
 * availability query spanning the whole local day.
 */
export async function computeSlots(service: BookingService, date: LocalDate, nowUtc = Date.now()): Promise<Slot[]> {
  if (service.staffMemberIds.length === 0) return [];

  const starts = await candidateStarts(date);
  if (starts.length === 0) return [];

  const dayStart = melbourneToUtcMs(date, 0, 0);
  const nextDay = melbourneDate(dayStart + 36 * 60 * MS);
  const dayEnd = melbourneToUtcMs(nextDay, 0, 0);

  const availability = await getStaffAvailability(service.staffMemberIds, dayStart, dayEnd);
  const earliest = nowUtc + MIN_LEAD_MINUTES * MS;

  const slots: Slot[] = [];
  for (const startUtc of starts) {
    if (startUtc < earliest) continue;
    const endUtc = startUtc + SLOT_MINUTES * MS;
    const freeStaffIds = service.staffMemberIds.filter((id) => covers(availability.get(id) ?? [], startUtc, endUtc));
    if (freeStaffIds.length === 0) continue;
    slots.push({ startUtc, endUtc, time: melbourneHM(startUtc), freeStaffIds });
  }
  return slots;
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
