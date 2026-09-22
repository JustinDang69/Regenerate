/* =============================================================================
   Bookings — the clinic's treatment menu: names, order and slug mapping.
   -----------------------------------------------------------------------------
   Shared by the server and the browser, and the single source of truth for:

     1. the EXACT customer-facing name and its casing (MedicalFACIAL, not
        "Medical Facial" and not "MEDICALFACIAL"),
     2. the order the treatments appear in the booking dropdown,
     3. which Microsoft Bookings service a website treatment slug books.

   Mapping is by NAME, never by Microsoft id, so no Bookings GUID is compiled
   into the client bundle and a service rebuilt in Bookings keeps working.

   BACKWARD COMPATIBLE ON PURPOSE. `bookingsNames` lists every spelling a
   service has had, so the website works whether or not the client has
   renamed the services inside Microsoft Bookings yet. Names are compared with
   punctuation and case removed, so "Medical Facial" and "MedicalFACIAL"
   already collapse to the same key; "Face Spa" and "UltraFACIAL" do not, and
   both are therefore listed.

   Website treatment SLUGS are deliberately unchanged by the Sep 2026 rename:
   /treatments/hydrafacial keeps working, so no existing link, share or search
   result breaks. Only the displayed names changed.
   ========================================================================== */

export type CanonicalTreatment = {
  /** Position in the customer-facing dropdown (1 = first). */
  order: number;
  /** Exact customer-facing name, casing included. */
  displayName: string;
  /** Website treatment slug, or null where there is no treatment page. */
  slug: string | null;
  /** Every Bookings displayName that means this treatment, current or legacy. */
  bookingsNames: string[];
};

/* Client-confirmed menu and order (Sep 2026): Consultation first, then each
   pair as Microneedling before Mesotherapy, face before scalp. */
export const CANONICAL_TREATMENTS: CanonicalTreatment[] = [
  { order: 1, displayName: "Consultation", slug: null, bookingsNames: ["Consultation"] },
  { order: 2, displayName: "Facial Microneedling", slug: "facial-microneedling", bookingsNames: ["Facial Microneedling"] },
  { order: 3, displayName: "Facial Mesotherapy", slug: "facial-mesotherapy", bookingsNames: ["Facial Mesotherapy"] },
  { order: 4, displayName: "MedicalFACIAL", slug: "hydrafacial", bookingsNames: ["MedicalFACIAL", "Medical Facial", "HydraFacial"] },
  { order: 5, displayName: "UltraFACIAL", slug: "facespa", bookingsNames: ["UltraFACIAL", "Face Spa", "FaceSpa"] },
  { order: 6, displayName: "Scalp Microneedling", slug: "scalp-microneedling", bookingsNames: ["Scalp Microneedling"] },
  { order: 7, displayName: "Scalp Mesotherapy", slug: "scalp-mesotherapy", bookingsNames: ["Scalp Mesotherapy"] },
  { order: 8, displayName: "MedicalSCALP", slug: "hydrascalp-therapy", bookingsNames: ["MedicalSCALP", "Medical Scalp", "HydraScalp"] },
  { order: 9, displayName: "UltraSCALP", slug: "scalpspa", bookingsNames: ["UltraSCALP", "Scalp Spa", "ScalpSpa"] },
];

/** Lowercase and drop everything but letters and digits. */
function normalise(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/* Lookups built once from the table above. */
const BY_BOOKINGS_NAME = new Map<string, CanonicalTreatment>();
const BY_SLUG = new Map<string, CanonicalTreatment>();
for (const t of CANONICAL_TREATMENTS) {
  for (const name of t.bookingsNames) BY_BOOKINGS_NAME.set(normalise(name), t);
  // The customer-facing name is always accepted too.
  BY_BOOKINGS_NAME.set(normalise(t.displayName), t);
  if (t.slug) BY_SLUG.set(t.slug.toLowerCase(), t);
}

export function canonicalForBookingsName(bookingsDisplayName: string): CanonicalTreatment | null {
  return BY_BOOKINGS_NAME.get(normalise(bookingsDisplayName)) ?? null;
}

/**
 * The name the customer sees. Falls back to whatever Bookings calls it, so a
 * service the clinic adds later still appears rather than vanishing.
 */
export function customerFacingName(bookingsDisplayName: string): string {
  return canonicalForBookingsName(bookingsDisplayName)?.displayName ?? bookingsDisplayName;
}

/** Sort key for the dropdown. Unknown services keep their order, after these. */
export function serviceOrderIndex(bookingsDisplayName: string): number {
  return canonicalForBookingsName(bookingsDisplayName)?.order ?? Number.MAX_SAFE_INTEGER;
}

/** Website treatment slug → Bookings service displayName (for CTA links). */
export const SERVICE_BY_TREATMENT_SLUG: Record<string, string> = Object.fromEntries(
  CANONICAL_TREATMENTS.filter((t) => t.slug).map((t) => [t.slug as string, t.displayName])
);

export type ServiceLike = { id: string; displayName: string };

/**
 * Resolves a `?service=` value against the live service list. Accepts a
 * website treatment slug, the customer-facing name, or any legacy Bookings
 * name. Returns null when nothing matches confidently, so a stale or unknown
 * link opens the form blank rather than preselecting the wrong treatment.
 */
export function resolveServiceId(param: string | null | undefined, services: ServiceLike[]): string | null {
  const raw = (param ?? "").trim();
  if (!raw) return null;

  const canonical = BY_SLUG.get(raw.toLowerCase()) ?? canonicalForBookingsName(raw);
  if (canonical) {
    const hit = services.find((s) => canonicalForBookingsName(s.displayName) === canonical);
    if (hit) return hit.id;
  }
  // Last resort: a plain name match against whatever Bookings currently calls it.
  const key = normalise(raw);
  return services.find((s) => normalise(s.displayName) === key)?.id ?? null;
}

/** The `?service=` value a treatment card should link with. */
export function serviceParamForTreatment(slug: string | undefined): string | null {
  if (!slug) return null;
  return BY_SLUG.has(slug.toLowerCase()) ? slug : null;
}
