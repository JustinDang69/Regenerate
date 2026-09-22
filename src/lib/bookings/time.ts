/* =============================================================================
   Bookings — Melbourne time helpers.
   -----------------------------------------------------------------------------
   Everything customer-facing is in Australia/Melbourne (AEST/AEDT). Internally
   we work in UTC epoch milliseconds and convert at the edges with Intl, which
   knows the DST rules — no timezone library needed.

   Microsoft Graph's dateTimeTimeZone uses WINDOWS zone names, so requests go
   out as "AUS Eastern Standard Time" and responses may come back either in
   that zone or in UTC; parseGraphDateTime handles both.
   ========================================================================== */
export const MELBOURNE_TZ = "Australia/Melbourne";
/** Windows time-zone id Graph expects for Melbourne (DST-aware). */
export const GRAPH_TZ = "AUS Eastern Standard Time";

export type LocalDate = { y: number; m: number; d: number };

const partsCache = new Map<string, Intl.DateTimeFormat>();
function formatter(tz: string) {
  let f = partsCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-AU", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    partsCache.set(tz, f);
  }
  return f;
}

function zonedParts(utcMs: number, tz: string) {
  const out: Record<string, number> = {};
  for (const p of formatter(tz).formatToParts(new Date(utcMs))) {
    if (p.type !== "literal") out[p.type] = Number(p.value);
  }
  return out as { year: number; month: number; day: number; hour: number; minute: number; second: number };
}

/** Offset of `tz` from UTC, in minutes, at the given instant. */
function offsetMinutes(utcMs: number, tz: string) {
  const p = zonedParts(utcMs, tz);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - utcMs) / 60_000);
}

/** Wall-clock time in `tz` → UTC ms. Handles DST by a two-pass offset lookup. */
function zonedToUtcMs(y: number, m: number, d: number, h: number, mi: number, s: number, tz: string) {
  const naive = Date.UTC(y, m - 1, d, h, mi, s);
  const first = offsetMinutes(naive, tz);
  let utc = naive - first * 60_000;
  const second = offsetMinutes(utc, tz);
  if (second !== first) utc = naive - second * 60_000;
  return utc;
}

export function melbourneToUtcMs(date: LocalDate, hour: number, minute: number) {
  return zonedToUtcMs(date.y, date.m, date.d, hour, minute, 0, MELBOURNE_TZ);
}

/** "HH:MM" in Melbourne for a UTC instant. */
export function melbourneHM(utcMs: number) {
  const p = zonedParts(utcMs, MELBOURNE_TZ);
  return `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
}

/** "YYYY-MM-DD" in Melbourne for a UTC instant. */
export function melbourneDate(utcMs: number): LocalDate {
  const p = zonedParts(utcMs, MELBOURNE_TZ);
  return { y: p.year, m: p.month, d: p.day };
}

export function localDateString({ y, m, d }: LocalDate) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Weekday name as Graph's bookingWorkHours.day uses it ("monday" …). */
export function melbourneWeekday(date: LocalDate) {
  const names = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  // Noon UTC on that calendar date is safely the same weekday in Melbourne.
  return names[new Date(Date.UTC(date.y, date.m - 1, date.d, 12)).getUTCDay()];
}

/** Graph wants "YYYY-MM-DDTHH:MM:SS" wall-clock text in the named zone. */
export function toGraphDateTime(utcMs: number) {
  const p = zonedParts(utcMs, MELBOURNE_TZ);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    dateTime: `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}`,
    timeZone: GRAPH_TZ,
  };
}

export type GraphDateTimeTimeZone = { dateTime?: string; timeZone?: string };

const MELBOURNE_ALIASES = /^(AUS Eastern Standard Time|Australia\/(Melbourne|Sydney|Canberra|Hobart|ACT|NSW|Victoria))$/i;
const UTC_ALIASES = /^(UTC|GMT|Etc\/UTC|Coordinated Universal Time|tzone:\/\/Microsoft\/Utc)?$/i;

/**
 * Graph dateTimeTimeZone → UTC ms, or null when unparseable.
 * A trailing "Z" or explicit offset in dateTime wins over timeZone.
 */
export function parseGraphDateTime(v: GraphDateTimeTimeZone | undefined): number | null {
  const raw = v?.dateTime;
  if (!raw) return null;
  if (/(Z|[+-]\d{2}:?\d{2})$/i.test(raw)) {
    const t = Date.parse(raw);
    return Number.isNaN(t) ? null : t;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec(raw);
  if (!m) return null;
  const [y, mo, d, h, mi, s] = [m[1], m[2], m[3], m[4], m[5], m[6] ?? "0"].map(Number);
  const tz = (v?.timeZone ?? "").trim();

  if (UTC_ALIASES.test(tz)) return Date.UTC(y, mo - 1, d, h, mi, s);
  if (MELBOURNE_ALIASES.test(tz)) return zonedToUtcMs(y, mo, d, h, mi, s, MELBOURNE_TZ);
  // Some other IANA zone — honour it if Intl knows it; otherwise treat as UTC.
  try {
    formatter(tz);
    return zonedToUtcMs(y, mo, d, h, mi, s, tz);
  } catch {
    console.warn("bookings: unknown Graph timeZone, assuming UTC", { timeZone: tz });
    return Date.UTC(y, mo - 1, d, h, mi, s);
  }
}

/** "09:00:00.0000000" (Graph bookingWorkTimeSlot) → minutes since midnight. */
export function parseGraphClock(t: string | undefined): number | null {
  const m = /^(\d{1,2}):(\d{2})/.exec(t ?? "");
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

/** ISO-8601 duration ("PT50M", "PT1H", "P1D") → minutes, or null. */
export function isoDurationToMinutes(iso: string | undefined): number | null {
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/i.exec(iso ?? "");
  if (!m) return null;
  const [d, h, mi, s] = [m[1], m[2], m[3], m[4]].map((x) => (x ? Number(x) : 0));
  return d * 1440 + h * 60 + mi + Math.round(s / 60);
}
