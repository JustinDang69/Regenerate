/* =============================================================================
   Bookings — unit tests for the rules that protect customers and capacity.
   -----------------------------------------------------------------------------
   Run with `npm test`. Pure logic only: no network, no Microsoft Graph, no
   credentials. Each test names the production behaviour it locks in.
   ========================================================================== */
import test from "node:test";
import assert from "node:assert/strict";

import {
  candidateStartsFrom,
  selectSlots,
  SLOT_MINUTES,
  MIN_LEAD_MINUTES,
} from "@/lib/bookings/availability";
import { orderForCustomers, mergeRanges, type BookingService } from "@/lib/bookings/graph";
import {
  melbourneHM,
  melbourneToUtcMs,
  parseGraphDateTime,
  toGraphDateTime,
  isoDurationToMinutes,
  parseGraphClock,
  melbourneWeekday,
  type LocalDate,
} from "@/lib/bookings/time";

const MS = 60_000;
/* Thursday 24 September 2026 — AEST (UTC+10). */
const DATE: LocalDate = { y: 2026, m: 9, d: 24 };
const WEEKDAY_HOURS = [
  { day: "thursday", timeSlots: [{ startTime: "09:30:00.0000000", endTime: "20:30:00.0000000" }] },
];
const STAFF = ["staff-a-id", "staff-b-id"];

/** Graph-style "available all day" range for both practitioners. */
function allDayAvailable(ids: string[]) {
  const start = melbourneToUtcMs(DATE, 0, 0);
  const end = start + 24 * 60 * MS;
  return new Map(ids.map((id) => [id, [{ start, end }]]));
}

function at(hour: number, minute: number) {
  return melbourneToUtcMs(DATE, hour, minute);
}

/** An appointment occupying one 50-minute block for the given staff. */
function appointmentAt(hour: number, minute: number, staffMemberIds: string[]) {
  const start = at(hour, minute);
  return { id: "appt", start, end: start + SLOT_MINUTES * MS, staffMemberIds };
}

/** Far enough before the day that lead time never interferes. */
const NOW = at(0, 0) - 24 * 60 * MS;

function slotsFor(appointments: ReturnType<typeof appointmentAt>[] = [], staffIds = STAFF) {
  return selectSlots({
    staffIds,
    candidates: candidateStartsFrom(WEEKDAY_HOURS, DATE),
    availability: allDayAvailable(staffIds),
    appointments,
    nowUtc: NOW,
  });
}

/* --- 4. Business-hour slot rhythm ------------------------------------------ */

test("09:30-20:30 produces the full 50-minute rhythm, ending at 19:30", () => {
  const times = candidateStartsFrom(WEEKDAY_HOURS, DATE).map(melbourneHM);
  assert.deepEqual(times, [
    "09:30", "10:20", "11:10", "12:00", "12:50", "13:40", "14:30",
    "15:20", "16:10", "17:00", "17:50", "18:40", "19:30",
  ]);
  // 19:30 + 50 = 20:20, inside the 20:30 close; 20:20 would end at 21:10.
  assert.equal(times.length, 13);
});

test("closing time is never hard-coded — different hours give a different rhythm", () => {
  // 10:00-14:00: 12:30 is the last start (ends 13:20); 13:20 would end 14:10.
  const shortDay = [{ day: "thursday", timeSlots: [{ startTime: "10:00:00", endTime: "14:00:00" }] }];
  assert.deepEqual(candidateStartsFrom(shortDay, DATE).map(melbourneHM), [
    "10:00", "10:50", "11:40", "12:30",
  ]);
});

test("a day the clinic is closed offers nothing", () => {
  assert.deepEqual(candidateStartsFrom([{ day: "sunday", timeSlots: [] }], DATE), []);
  assert.deepEqual(candidateStartsFrom(undefined, DATE), []);
});

/* --- 2. Two-practitioner capacity ------------------------------------------ */

test("both practitioners free — 10:20 is offered", () => {
  const times = slotsFor().map((s) => s.time);
  assert.ok(times.includes("10:20"), "10:20 should be offered when both are free");
});

test("ONE practitioner booked at 10:20 — the slot remains available", () => {
  const slots = slotsFor([appointmentAt(10, 20, [STAFF[0]])]);
  const slot = slots.find((s) => s.time === "10:20");
  assert.ok(slot, "10:20 must still be offered while one practitioner is free");
  assert.deepEqual(slot.freeStaffIds, [STAFF[1]], "only the free practitioner may be assigned");
});

test("the second booking is assigned to the REMAINING free practitioner", () => {
  // Booking 1 landed on staff A; booking 2 must not also land on staff A.
  const slot = slotsFor([appointmentAt(10, 20, [STAFF[0]])]).find((s) => s.time === "10:20");
  assert.ok(slot);
  const assigned = slot.freeStaffIds[0]; // what the create route picks
  assert.equal(assigned, STAFF[1]);
  assert.notEqual(assigned, STAFF[0], "must not double-book the same practitioner");
});

test("BOTH practitioners booked at 10:20 — the slot disappears", () => {
  const slots = slotsFor([
    appointmentAt(10, 20, [STAFF[0]]),
    appointmentAt(10, 20, [STAFF[1]]),
  ]);
  assert.equal(slots.find((s) => s.time === "10:20"), undefined);
  // The rest of the day is untouched.
  assert.ok(slots.some((s) => s.time === "11:10"));
});

test("a fully occupied slot yields no assignable practitioner (the 409 path)", () => {
  // POST /api/bookings/create looks the slot up in exactly this list; a miss
  // is what produces HTTP 409 "That time has just been booked".
  const slots = slotsFor([appointmentAt(10, 20, STAFF)]); // one appointment, both staff
  assert.equal(slots.find((s) => s.time === "10:20"), undefined);
});

test("an overlapping appointment blocks the practitioner, not just an exact match", () => {
  // 10:00-10:50 overlaps the 10:20 block even though no start time matches.
  const start = at(10, 0);
  const overlapping = { id: "x", start, end: start + 50 * MS, staffMemberIds: [STAFF[0]] };
  const slot = slotsFor([overlapping]).find((s) => s.time === "10:20");
  assert.deepEqual(slot?.freeStaffIds, [STAFF[1]]);
});

test("an adjacent appointment does NOT block the next block", () => {
  // 09:30-10:20 ends exactly when 10:20 starts — touching is not overlapping.
  const slot = slotsFor([appointmentAt(9, 30, STAFF)]).find((s) => s.time === "10:20");
  assert.equal(slot?.freeStaffIds.length, 2);
});

test("Graph availability still applies — a practitioner off that block is excluded", () => {
  const availability = allDayAvailable(STAFF);
  // Staff A available only from 12:00 (time off in the morning).
  availability.set(STAFF[0], [{ start: at(12, 0), end: at(20, 30) }]);
  const slots = selectSlots({
    staffIds: STAFF,
    candidates: candidateStartsFrom(WEEKDAY_HOURS, DATE),
    availability,
    appointments: [],
    nowUtc: NOW,
  });
  assert.deepEqual(slots.find((s) => s.time === "10:20")?.freeStaffIds, [STAFF[1]]);
  assert.equal(slots.find((s) => s.time === "12:00")?.freeStaffIds.length, 2);
});

test("time off AND a booking together remove the slot", () => {
  const availability = allDayAvailable(STAFF);
  availability.set(STAFF[0], [{ start: at(12, 0), end: at(20, 30) }]); // A: morning off
  const slots = selectSlots({
    staffIds: STAFF,
    candidates: candidateStartsFrom(WEEKDAY_HOURS, DATE),
    availability,
    appointments: [appointmentAt(10, 20, [STAFF[1]])], // B: booked
    nowUtc: NOW,
  });
  assert.equal(slots.find((s) => s.time === "10:20"), undefined);
});

test("a service with no assigned staff offers nothing", () => {
  assert.deepEqual(slotsFor([], []), []);
});

/* --- Lead time -------------------------------------------------------------- */

test("the 30-minute lead time hides imminent slots", () => {
  // "Now" is 10:00 on the day: 10:20 is 20 minutes away, inside the lead.
  const slots = selectSlots({
    staffIds: STAFF,
    candidates: candidateStartsFrom(WEEKDAY_HOURS, DATE),
    availability: allDayAvailable(STAFF),
    appointments: [],
    nowUtc: at(10, 0),
  });
  const times = slots.map((s) => s.time);
  assert.equal(MIN_LEAD_MINUTES, 30);
  assert.ok(!times.includes("10:20"), "10:20 is only 20 minutes away");
  assert.ok(times.includes("11:10"), "11:10 is beyond the lead time");
});

/* --- 1. Confirmation timezone ---------------------------------------------- */

test("selected 10:20 confirms as 10:20-11:10, with no double conversion", () => {
  const slot = slotsFor().find((s) => s.time === "10:20");
  assert.ok(slot);
  // These two lines are exactly what POST /api/bookings/create returns.
  assert.equal(slot.time, "10:20");
  assert.equal(melbourneHM(slot.endUtc), "11:10");
  assert.equal(slot.endUtc - slot.startUtc, SLOT_MINUTES * MS);
});

test("the Graph echo that caused the 8:20 PM bug is not trusted", () => {
  const slot = slotsFor().find((s) => s.time === "10:20")!;

  /* Bookings echoes the appointment back as Melbourne WALL-CLOCK text but
     labels the zone "UTC". Parsing that as UTC yields 20:20 — the 8:20 PM the
     customer saw. The route must use slot.time instead, which is unaffected. */
  const graphEcho = parseGraphDateTime({ dateTime: "2026-09-24T10:20:00.0000000", timeZone: "UTC" });
  assert.equal(melbourneHM(graphEcho!), "20:20", "reproduces the reported bug");
  assert.notEqual(melbourneHM(graphEcho!), slot.time);
  assert.equal(slot.time, "10:20", "the validated slot stays correct");
});

test("a correctly-labelled Graph response still parses", () => {
  // 10:20 Melbourne (AEST) = 00:20 UTC the same calendar day.
  const utc = parseGraphDateTime({ dateTime: "2026-09-24T00:20:00.0000000", timeZone: "UTC" });
  assert.equal(melbourneHM(utc!), "10:20");
  const windows = parseGraphDateTime({
    dateTime: "2026-09-24T10:20:00.0000000",
    timeZone: "AUS Eastern Standard Time",
  });
  assert.equal(melbourneHM(windows!), "10:20");
});

/* --- 3. Consultation first -------------------------------------------------- */

function svc(displayName: string): BookingService {
  return {
    id: `id-${displayName}`,
    displayName,
    defaultDuration: "PT50M",
    durationMinutes: 50,
    price: null,
    priceType: null,
    staffMemberIds: STAFF,
    isHiddenFromCustomers: false,
  };
}

test("Consultation is first even when Graph returns it last", () => {
  // This is the real production order: Consultation came back LAST.
  const fromGraph = [
    "Scalp Spa", "Medical Scalp", "Scalp Mesotherapy", "Scalp Microneedling",
    "Face Spa", "Medical Facial", "Facial Mesotherapy", "Facial Microneedling",
    "Consultation",
  ].map(svc);

  const ordered = orderForCustomers(fromGraph).map((s) => s.displayName);
  assert.equal(ordered[0], "Consultation");
  // Every other service keeps its relative order.
  assert.deepEqual(ordered.slice(1), [
    "Scalp Spa", "Medical Scalp", "Scalp Mesotherapy", "Scalp Microneedling",
    "Face Spa", "Medical Facial", "Facial Mesotherapy", "Facial Microneedling",
  ]);
  assert.equal(ordered.length, 9);
});

test("ordering is stable when Consultation is absent or already first", () => {
  const without = ["Face Spa", "Medical Facial"].map(svc);
  assert.deepEqual(orderForCustomers(without).map((s) => s.displayName), ["Face Spa", "Medical Facial"]);

  const already = ["Consultation", "Face Spa"].map(svc);
  assert.deepEqual(orderForCustomers(already).map((s) => s.displayName), ["Consultation", "Face Spa"]);
});

/* --- Supporting helpers ----------------------------------------------------- */

test("Melbourne conversion handles AEST and AEDT", () => {
  assert.equal(melbourneToUtcMs({ y: 2026, m: 7, d: 15 }, 9, 30), Date.UTC(2026, 6, 14, 23, 30)); // AEST +10
  assert.equal(melbourneToUtcMs({ y: 2026, m: 1, d: 15 }, 9, 30), Date.UTC(2026, 0, 14, 22, 30)); // AEDT +11
});

test("Graph request time is sent as Melbourne wall clock in the Windows zone", () => {
  const g = toGraphDateTime(at(10, 20));
  assert.equal(g.dateTime, "2026-09-24T10:20:00");
  assert.equal(g.timeZone, "AUS Eastern Standard Time");
});

test("duration and clock parsing", () => {
  assert.equal(isoDurationToMinutes("PT50M"), 50);
  assert.equal(isoDurationToMinutes("PT1H30M"), 90);
  assert.equal(isoDurationToMinutes("nonsense"), null);
  assert.equal(parseGraphClock("09:30:00.0000000"), 570);
  assert.equal(melbourneWeekday(DATE), "thursday");
});

test("overlapping free ranges merge", () => {
  assert.deepEqual(
    mergeRanges([
      { start: 0, end: 10 },
      { start: 5, end: 20 },
      { start: 30, end: 40 },
    ]),
    [
      { start: 0, end: 20 },
      { start: 30, end: 40 },
    ]
  );
});
