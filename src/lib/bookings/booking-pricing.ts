/* =============================================================================
   Booking pricing — WHAT an appointment costs, decided by its APPOINTMENT DATE.
   -----------------------------------------------------------------------------
   The single source for the price a customer is quoted, shown on the website
   confirmation, and written onto the Microsoft Bookings appointment (client
   brief, 30 Sep 2026).

   RULES
     • The price depends on the treatment and the APPOINTMENT date only — never
       on when the booking was made. Booked on 1 Oct for 30 Oct → offer price.
     • The server always calculates it. A price sent by the browser is ignored.
     • All money is in integer CENTS, so 30% off $269 is exactly $188.30.

   NORMAL PRICES come from `singleTreatments` in content/packages.ts (the
   /pricing page), matched on the website treatment slug — so the two can never
   disagree. Consultation has no /pricing entry; its price is set here.

   PACKAGES are not bookable online: their Phase 1 offer is handled by the
   clinic after a Consultation, so nothing here prices them.
   ========================================================================== */
import { singleTreatments } from "@/content/packages";
import { CANONICAL_TREATMENTS } from "@/lib/bookings/service-map";
import type { IsoDate } from "@/lib/bookings/booking-calendar";

/** Consultation price. Never discounted. */
export const CONSULTATION_PRICE_CENTS = 3900;

export type Promotion = {
  id: string;
  /** Short label shown beside a discounted price. */
  label: string;
  /** Inclusive appointment-date range. */
  from: IsoDate;
  to: IsoDate;
  /** Default discount for every eligible treatment in the phase. */
  percentOff: number;
  /** Treatment-specific fixed promo prices that override `percentOff`. */
  fixedCents?: Record<string, number>;
};

/* Keyed by the canonical customer-facing treatment name (service-map.ts). */
export const PROMOTIONS: Promotion[] = [
  {
    id: "grand-opening",
    label: "Grand Opening Offer",
    from: "2026-10-26",
    to: "2026-11-15",
    percentOff: 30,
    fixedCents: {
      UltraFACIAL: 6900,
      UltraSCALP: 6900,
      MedicalFACIAL: 9900,
      MedicalSCALP: 9900,
    },
  },
  {
    id: "opening-season",
    // The brief named only Phase 1's label; this one is a short placeholder
    // the clinic may rename here without touching anything else.
    label: "20% Opening Offer",
    from: "2026-11-16",
    to: "2026-12-16",
    percentOff: 20,
  },
];

/** Treatments no promotion ever applies to. */
const NEVER_DISCOUNTED = new Set(["Consultation"]);

/** Normal price in cents for a canonical treatment name, or null if unknown. */
export function normalPriceCents(treatmentName: string): number | null {
  if (treatmentName === "Consultation") return CONSULTATION_PRICE_CENTS;
  const canonical = CANONICAL_TREATMENTS.find((t) => t.displayName === treatmentName);
  if (!canonical?.slug) return null;
  const single = singleTreatments.find((s) => s.detailSlug === canonical.slug);
  return single ? Math.round(single.price * 100) : null;
}

export function promotionOn(iso: IsoDate): Promotion | null {
  return PROMOTIONS.find((p) => iso >= p.from && iso <= p.to) ?? null;
}

export type PriceQuote = {
  treatment: string;
  appointmentDate: IsoDate;
  /** What the customer pays for this appointment. */
  priceCents: number;
  /** The standard price, for the strikethrough when discounted. */
  normalCents: number;
  discounted: boolean;
  /** Present only when a discount actually applies. */
  offer: { id: string; label: string } | null;
};

/**
 * The price of `treatmentName` for an appointment on `appointmentDate`.
 * Returns null for a treatment with no known normal price — the caller then
 * books without a price rather than inventing one.
 */
export function quotePrice(treatmentName: string, appointmentDate: IsoDate): PriceQuote | null {
  const normalCents = normalPriceCents(treatmentName);
  if (normalCents === null) return null;

  const promo = NEVER_DISCOUNTED.has(treatmentName) ? null : promotionOn(appointmentDate);
  let priceCents = normalCents;
  if (promo) {
    priceCents = promo.fixedCents?.[treatmentName] ?? Math.round((normalCents * (100 - promo.percentOff)) / 100);
  }
  const discounted = priceCents < normalCents;

  return {
    treatment: treatmentName,
    appointmentDate,
    priceCents,
    normalCents,
    discounted,
    offer: discounted && promo ? { id: promo.id, label: promo.label } : null,
  };
}

/** $69, $188.30, $1,490 — cents shown only when there are some. */
export function formatAud(cents: number): string {
  const dollars = cents / 100;
  return (
    "$" +
    dollars.toLocaleString("en-AU", {
      minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}

/** What the browser receives: amounts pre-formatted, nothing to recompute. */
export type PublicPrice = {
  price: string;
  normalPrice: string;
  discounted: boolean;
  offerLabel: string | null;
};

export function toPublicPrice(q: PriceQuote): PublicPrice {
  return {
    price: formatAud(q.priceCents),
    normalPrice: formatAud(q.normalCents),
    discounted: q.discounted,
    offerLabel: q.offer?.label ?? null,
  };
}
