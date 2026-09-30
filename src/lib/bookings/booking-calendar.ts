/* =============================================================================
   Booking calendar rules — WHICH DATES a customer may book an appointment on.
   -----------------------------------------------------------------------------
   The single source for the date rules (client brief, 30 Sep 2026). Pure — no
   Next.js, no Graph, no React — so the booking form (date-picker limits), the
   availability and create API routes (enforcement) and the unit tests all
   apply the SAME rules. The browser limits are a convenience only; the API
   routes re-check every date, so a hand-crafted request cannot get around them.

   All dates are Melbourne CALENDAR dates as "YYYY-MM-DD" strings. Strings in
   that format compare correctly with < and >, which keeps the logic obvious.

     1. Opening      — no appointment before 26 October 2026 (bookings may be
                        MADE now; it is the appointment date that is limited).
     2. Rolling window — latest appointment date is the same calendar date two
                        months after today (Melbourne), clamped to month end:
                        30 Sep → 30 Nov, 31 Dec → 28 Feb.
     3. Closures     — 25 Dec 2026 to 3 Jan 2027 inclusive. A one-off closure,
                        deliberately NOT an annual rule.
   ========================================================================== */

export type IsoDate = string; // "YYYY-MM-DD", Melbourne calendar date

export const MELBOURNE_TZ = "Australia/Melbourne";

/** First date an appointment can be held. */
export const APPOINTMENTS_OPEN_FROM: IsoDate = "2026-10-26";

/** Latest appointment date = today + this many CALENDAR months (clamped). */
export const WINDOW_MONTHS = 2;

export type Closure = { from: IsoDate; to: IsoDate; message: string };

/** Confirmed closures, inclusive. Add future ones here explicitly. */
export const CLOSURES: Closure[] = [
  {
    from: "2026-12-25",
    to: "2027-01-03",
    message:
      "The clinic is closed from 25 December 2026 to 3 January 2027. Appointments resume on 4 January 2027 — please choose another date.",
  },
];

/* --- Date helpers ---------------------------------------------------------- */

const pad = (n: number) => String(n).padStart(2, "0");

export function isoFromParts(y: number, m: number, d: number): IsoDate {
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** Today's calendar date in Melbourne, whatever the visitor's own time zone. */
export function melbourneTodayIso(nowUtc: number = Date.now()): IsoDate {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MELBOURNE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(nowUtc));
}

function daysInMonth(y: number, m: number) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate(); // m is 1-based; day 0 = last day of m
}

/** Same calendar date `months` later; clamps to the last day when it does not exist. */
export function addCalendarMonthsClamped(iso: IsoDate, months: number): IsoDate {
  const [y, m, d] = iso.split("-").map(Number);
  const zeroBased = m - 1 + months;
  const ty = y + Math.floor(zeroBased / 12);
  const tm = (((zeroBased % 12) + 12) % 12) + 1;
  return isoFromParts(ty, tm, Math.min(d, daysInMonth(ty, tm)));
}

/** "2026-10-26" → "Monday 26 October 2026" (calendar date, no time zone shift). */
export function longDate(iso: IsoDate): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** "2026-10-26" → "26 Oct 2026" — compact, for the date-picker hint. */
export function shortDate(iso: IsoDate): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-AU", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" }).format(
    new Date(Date.UTC(y, m - 1, d))
  );
}

/* --- Rules ----------------------------------------------------------------- */

export type BookingWindow = {
  today: IsoDate;
  /** Earliest selectable appointment date: max(today, opening date). */
  earliest: IsoDate;
  /** Latest selectable appointment date: today + 2 calendar months. */
  latest: IsoDate;
};

export function bookingWindow(nowUtc: number = Date.now()): BookingWindow {
  const today = melbourneTodayIso(nowUtc);
  const earliest = today > APPOINTMENTS_OPEN_FROM ? today : APPOINTMENTS_OPEN_FROM;
  const latest = addCalendarMonthsClamped(today, WINDOW_MONTHS);
  return { today, earliest, latest };
}

export function closureFor(iso: IsoDate): Closure | null {
  return CLOSURES.find((c) => iso >= c.from && iso <= c.to) ?? null;
}

export type DateCheck =
  | { ok: true }
  | { ok: false; code: "date_past" | "date_before_opening" | "date_beyond_window" | "clinic_closed"; message: string };

/**
 * Whether an appointment may be booked on `iso` as of `nowUtc`. The ONE check
 * both API routes apply before touching Microsoft Bookings.
 */
export function checkAppointmentDate(iso: IsoDate, nowUtc: number = Date.now()): DateCheck {
  const w = bookingWindow(nowUtc);
  if (iso < w.today) {
    return { ok: false, code: "date_past", message: "Please choose a date from today onwards." };
  }
  if (iso < APPOINTMENTS_OPEN_FROM) {
    return {
      ok: false,
      code: "date_before_opening",
      message: `Appointments are available from ${longDate(APPOINTMENTS_OPEN_FROM)}. Please choose that date or later.`,
    };
  }
  if (iso > w.latest) {
    return {
      ok: false,
      code: "date_beyond_window",
      message: `Appointments can currently be booked up to ${longDate(w.latest)}. Please choose an earlier date.`,
    };
  }
  const closure = closureFor(iso);
  if (closure) return { ok: false, code: "clinic_closed", message: closure.message };
  return { ok: true };
}
