/* =============================================================================
   Booking rules — dates and prices (client brief, 30 Sep 2026).
   Every boundary in the brief is asserted here, against the exact figures.
   ========================================================================== */
import test from "node:test";
import assert from "node:assert/strict";

import {
  APPOINTMENTS_OPEN_FROM,
  addCalendarMonthsClamped,
  bookingWindow,
  checkAppointmentDate,
  melbourneTodayIso,
} from "@/lib/bookings/booking-calendar";
import { CONSULTATION_PRICE_CENTS, formatAud, normalPriceCents, quotePrice, toPublicPrice } from "@/lib/bookings/booking-pricing";

/** A UTC instant that is the given Melbourne wall-clock time (AEST +10 before 4 Oct 2026, AEDT +11 after). */
function melbourne(iso: string, hh = 12, mm = 0) {
  const [y, m, d] = iso.split("-").map(Number);
  const probe = Date.UTC(y, m - 1, d, hh, mm);
  // Find the offset Melbourne has at that moment, then shift.
  const parts = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Melbourne", timeZoneName: "shortOffset" })
    .formatToParts(new Date(probe))
    .find((p) => p.type === "timeZoneName")!.value; // e.g. "GMT+10"
  const offsetH = Number(parts.replace("GMT", "") || 0);
  return probe - offsetH * 3_600_000;
}

const TODAY = melbourne("2026-09-30"); // the date the rules were confirmed

/* --- Opening date ----------------------------------------------------------- */

test("opening: 25 Oct 2026 is not bookable, 26 Oct 2026 is", () => {
  assert.equal(APPOINTMENTS_OPEN_FROM, "2026-10-26");
  const before = checkAppointmentDate("2026-10-25", TODAY);
  assert.equal(before.ok, false);
  assert.equal(!before.ok && before.code, "date_before_opening");
  assert.deepEqual(checkAppointmentDate("2026-10-26", TODAY), { ok: true });
});

test("opening: every date from today to 25 Oct is blocked", () => {
  for (const d of ["2026-09-30", "2026-10-01", "2026-10-15", "2026-10-25"]) {
    assert.equal(checkAppointmentDate(d, TODAY).ok, false, d);
  }
});

test("the earliest selectable date is the opening date until the clinic opens, then today", () => {
  assert.equal(bookingWindow(TODAY).earliest, "2026-10-26");
  assert.equal(bookingWindow(melbourne("2026-11-03")).earliest, "2026-11-03");
});

test("past dates are rejected", () => {
  const r = checkAppointmentDate("2026-11-01", melbourne("2026-11-05"));
  assert.equal(!r.ok && r.code, "date_past");
});

/* --- Rolling two-calendar-month window -------------------------------------- */

test("window: 30 Sep 2026 → latest appointment 30 Nov 2026 (not end of next month)", () => {
  assert.equal(bookingWindow(TODAY).latest, "2026-11-30");
  assert.deepEqual(checkAppointmentDate("2026-11-30", TODAY), { ok: true });
  const beyond = checkAppointmentDate("2026-12-01", TODAY);
  assert.equal(!beyond.ok && beyond.code, "date_beyond_window");
});

test("window: clamps to the last day when the target day does not exist", () => {
  assert.equal(addCalendarMonthsClamped("2026-12-31", 2), "2027-02-28");
  assert.equal(addCalendarMonthsClamped("2027-12-31", 2), "2028-02-29"); // leap year
  assert.equal(addCalendarMonthsClamped("2026-08-31", 2), "2026-10-31");
  assert.equal(addCalendarMonthsClamped("2026-10-31", 2), "2026-12-31");
  assert.equal(addCalendarMonthsClamped("2026-12-30", 2), "2027-02-28");
  assert.equal(addCalendarMonthsClamped("2026-11-30", 2), "2027-01-30"); // year rollover
});

test("window uses Melbourne time, not UTC", () => {
  // 30 Sep 2026 14:30 UTC is already 1 Oct 00:30 in Melbourne (AEST +10).
  const now = Date.UTC(2026, 8, 30, 14, 30);
  assert.equal(new Date(now).toISOString().slice(0, 10), "2026-09-30");
  assert.equal(melbourneTodayIso(now), "2026-10-01");
  assert.equal(bookingWindow(now).latest, "2026-12-01");
  // And during daylight saving (AEDT +11): 31 Oct 13:30 UTC = 1 Nov 00:30.
  assert.equal(melbourneTodayIso(Date.UTC(2026, 9, 31, 13, 30)), "2026-11-01");
});

/* --- Christmas closure ------------------------------------------------------ */

test("closure: 24 Dec open, 25 Dec – 3 Jan closed, 4 Jan open", () => {
  const now = melbourne("2026-12-01"); // window reaches 1 Feb 2027
  assert.deepEqual(checkAppointmentDate("2026-12-24", now), { ok: true });
  for (const d of ["2026-12-25", "2026-12-26", "2026-12-31", "2027-01-01", "2027-01-03"]) {
    const r = checkAppointmentDate(d, now);
    assert.equal(!r.ok && r.code, "clinic_closed", d);
  }
  assert.deepEqual(checkAppointmentDate("2027-01-04", now), { ok: true });
});

test("closure is the confirmed 2026/27 closure only — not repeated annually", () => {
  const now = melbourne("2027-12-01");
  assert.deepEqual(checkAppointmentDate("2027-12-25", now), { ok: true });
  assert.deepEqual(checkAppointmentDate("2028-01-02", now), { ok: true });
});

/* --- Prices ----------------------------------------------------------------- */

const ALL = [
  "Consultation",
  "Facial Microneedling",
  "Facial Mesotherapy",
  "MedicalFACIAL",
  "UltraFACIAL",
  "Scalp Microneedling",
  "Scalp Mesotherapy",
  "MedicalSCALP",
  "UltraSCALP",
];

const price = (t: string, d: string) => formatAud(quotePrice(t, d)!.priceCents);

test("normal prices match the /pricing page, plus Consultation $39", () => {
  assert.equal(CONSULTATION_PRICE_CENTS, 3900);
  assert.deepEqual(
    Object.fromEntries(ALL.map((t) => [t, normalPriceCents(t)])),
    {
      Consultation: 3900,
      "Facial Microneedling": 26900,
      "Facial Mesotherapy": 37900,
      MedicalFACIAL: 15900,
      UltraFACIAL: 11900,
      "Scalp Microneedling": 26900,
      "Scalp Mesotherapy": 37900,
      MedicalSCALP: 15900,
      UltraSCALP: 11900,
    }
  );
});

const PHASE_1 = {
  Consultation: "$29",
  UltraFACIAL: "$69",
  UltraSCALP: "$69",
  MedicalFACIAL: "$99",
  MedicalSCALP: "$99",
  "Facial Microneedling": "$188.30",
  "Scalp Microneedling": "$188.30",
  "Facial Mesotherapy": "$265.30",
  "Scalp Mesotherapy": "$265.30",
};

const PHASE_2 = {
  Consultation: "$29",
  "Facial Microneedling": "$215.20",
  "Scalp Microneedling": "$215.20",
  "Facial Mesotherapy": "$303.20",
  "Scalp Mesotherapy": "$303.20",
  MedicalFACIAL: "$127.20",
  MedicalSCALP: "$127.20",
  UltraFACIAL: "$95.20",
  UltraSCALP: "$95.20",
};

const NORMAL = {
  Consultation: "$39",
  "Facial Microneedling": "$269",
  "Scalp Microneedling": "$269",
  "Facial Mesotherapy": "$379",
  "Scalp Mesotherapy": "$379",
  MedicalFACIAL: "$159",
  MedicalSCALP: "$159",
  UltraFACIAL: "$119",
  UltraSCALP: "$119",
};

for (const [label, date, table] of [
  ["Phase 1 first day (26 Oct)", "2026-10-26", PHASE_1],
  ["Phase 1 last day (15 Nov)", "2026-11-15", PHASE_1],
  ["Phase 2 first day (16 Nov)", "2026-11-16", PHASE_2],
  ["Phase 2 last day (16 Dec)", "2026-12-16", PHASE_2],
  ["normal pricing resumes (17 Dec)", "2026-12-17", NORMAL],
  ["normal pricing later (4 Jan 2027)", "2027-01-04", NORMAL],
] as const) {
  test(`prices — ${label}: every treatment exact`, () => {
    assert.deepEqual(Object.fromEntries(ALL.map((t) => [t, price(t, date)])), table);
  });
}

test("a discounted quote carries its offer label; a full-price one does not", () => {
  const p1 = quotePrice("UltraFACIAL", "2026-10-30")!;
  assert.equal(p1.discounted, true);
  assert.equal(p1.offer?.label, "Grand Opening Offer");
  assert.equal(formatAud(p1.normalCents), "$119");

  const p2 = quotePrice("UltraFACIAL", "2026-11-20")!;
  assert.equal(p2.offer?.label, "20% Opening Offer");

  const consult = quotePrice("Consultation", "2027-01-04")!;
  assert.equal(consult.discounted, false);
  assert.equal(consult.offer, null);

  const normal = quotePrice("UltraFACIAL", "2026-12-20")!;
  assert.equal(normal.discounted, false);
  assert.equal(normal.offer, null);
});

/* --- Consultation: fixed $29 from 26 Oct to 16 Dec 2026, else $39 ------------ */

test("Consultation — $29 fixed across both phases, $39 from 17 Dec; date before opening is refused", () => {
  const now = melbourne("2026-09-30");
  // Before the clinic opens: not bookable at all.
  assert.equal(checkAppointmentDate("2026-10-25", now).ok, false);
  const expect = [
    ["2026-10-26", "$29"],
    ["2026-11-15", "$29"],
    ["2026-11-16", "$29"],
    ["2026-12-16", "$29"],
    ["2026-12-17", "$39"],
  ] as const;
  for (const [d, p] of expect) assert.equal(price("Consultation", d), p, d);
  // Fixed price, never a percentage: not 70%/80% of $39 ($27.30 / $31.20).
  for (const d of ["2026-11-02", "2026-12-01"]) assert.equal(quotePrice("Consultation", d)!.priceCents, 2900);
});

test("Consultation quote shows Normally $39, no badge text; $39 after 16 Dec is plain", () => {
  const promo = quotePrice("Consultation", "2026-11-20")!;
  assert.deepEqual(toPublicPrice(promo), { price: "$29", normalPrice: "$39", discounted: true, offerLabel: null });
  const normal = quotePrice("Consultation", "2026-12-17")!;
  assert.deepEqual(toPublicPrice(normal), { price: "$39", normalPrice: "$39", discounted: false, offerLabel: null });
});

test("the APPOINTMENT date decides the price, not the booking date (brief's three examples)", () => {
  // quotePrice takes no 'now' at all — the booking date cannot influence it.
  assert.equal(quotePrice.length, 2);
  assert.equal(price("UltraFACIAL", "2026-10-30"), "$69"); //    booked 1 Oct
  assert.equal(price("UltraFACIAL", "2026-11-20"), "$95.20"); // booked 1 Oct
  assert.equal(price("UltraFACIAL", "2026-12-20"), "$119"); //  booked 1 Nov
});

test("an unknown treatment gets no price rather than an invented one", () => {
  assert.equal(quotePrice("Brand New Treatment", "2026-10-30"), null);
});

test("money formatting", () => {
  assert.equal(formatAud(6900), "$69");
  assert.equal(formatAud(18830), "$188.30");
  assert.equal(formatAud(9520), "$95.20");
  assert.equal(formatAud(149000), "$1,490");
});
