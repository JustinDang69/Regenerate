/* =============================================================================
   Bookings — website treatment slug → Microsoft Bookings service.
   -----------------------------------------------------------------------------
   Shared by the server and the browser. It deliberately maps to the service's
   DISPLAY NAME, not its Microsoft id: ids are resolved at runtime from
   GET /api/bookings/services, so no Bookings GUID is ever hard-coded into the
   client bundle and a service rebuilt in Bookings keeps working.

   A slug that is missing here, or whose name no longer exists in Bookings,
   simply opens the form with nothing preselected — never a wrong treatment.

   ASSUMPTION (flagged to the client): the Bookings services "Medical Facial"
   and "Medical Scalp" are the clinic's HydraFacial and HydraScalp. Every other
   pairing is an exact name match. If the client renames them, change only the
   two lines below.
   ========================================================================== */

/** Website treatment slug → Bookings service displayName. */
export const SERVICE_BY_TREATMENT_SLUG: Record<string, string> = {
  "facial-microneedling": "Facial Microneedling",
  "facial-mesotherapy": "Facial Mesotherapy",
  hydrafacial: "Medical Facial",
  facespa: "Face Spa",
  "scalp-microneedling": "Scalp Microneedling",
  "scalp-mesotherapy": "Scalp Mesotherapy",
  "hydrascalp-therapy": "Medical Scalp",
  scalpspa: "Scalp Spa",
  /* Direct aliases so a CTA may also name the Bookings service itself. */
  consultation: "Consultation",
};

/** Lowercase, collapse spaces/punctuation — "Face Spa" ≈ "facespa". */
function normalise(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export type ServiceLike = { id: string; displayName: string };

/**
 * Resolves a `?service=` value against the live service list.
 * Accepts a website treatment slug, a Bookings display name, or a
 * slugified display name. Returns null when nothing matches confidently.
 */
export function resolveServiceId(param: string | null | undefined, services: ServiceLike[]): string | null {
  if (!param) return null;
  const raw = param.trim();
  if (!raw) return null;

  const mapped = SERVICE_BY_TREATMENT_SLUG[raw.toLowerCase()];
  const targets = [mapped, raw].filter((v): v is string => typeof v === "string" && v.length > 0);

  for (const target of targets) {
    const key = normalise(target);
    const hit = services.find((s) => normalise(s.displayName) === key);
    if (hit) return hit.id;
  }
  return null;
}

/** The `?service=` value a treatment card should link with. */
export function serviceParamForTreatment(slug: string | undefined): string | null {
  if (!slug) return null;
  return slug in SERVICE_BY_TREATMENT_SLUG ? slug : null;
}
