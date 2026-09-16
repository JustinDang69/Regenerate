/* =============================================================================
   PRICING DATA — packages + single treatments.
   -----------------------------------------------------------------------------
   SOURCE OF TRUTH: the client's corrected FINAL price menu, supplied 16 Sep
   2026. Prices, session counts and inclusions below are the client's exact
   figures and wording — do not recalculate, round or "improve" them. This menu
   supersedes the earlier 21-07 brief entirely.

   Superseded terminology: "Recovery" and "Head spa" inclusions and the
   "Hair Recovery" / "Head Spa" singles are gone. The client's names are
   HydraScalp and ScalpSpa.

   COMPLIANCE NOTE: "concern" labels describe what a program is *designed to
   support*, never a guaranteed outcome. Suitability is confirmed in
   consultation. GST status, expiry, transferability and refund terms have
   NOT been supplied — none are stated.
   ========================================================================== */

export type Category = "skin" | "hair";

export type Package = {
  slug: string;
  name: string;
  price: number;
  category: Category;
  concern: string;            // supportive concern label
  positioning: string;        // one short premium line
  sessions: string;           // human-readable session summary
  includes: string[];         // itemised inclusions — client wording, verbatim
  featured?: boolean;         // emphasised on /pricing
};

export type SingleTreatment = {
  slug: string;
  /** Concise price-menu name, exactly as the client wrote it (e.g. "Face
   *  Micro"). The Treatment Guide keeps the longer clinical name. */
  name: string;
  price: number;
  category: Category;
  /** Slug of the corresponding /treatments/[slug] page, so the price card can
   *  link to the full clinical detail rather than duplicating it. */
  detailSlug?: string;
  /** Client-confirmed duration. Omitted where the client has not supplied
   *  one — no approximations are shown. */
  duration?: string;
};

/* --------------------------------------------------------------------------
   SKIN PACKAGES
   -------------------------------------------------------------------------- */
export const skinPackages: Package[] = [
  {
    slug: "skin-reclaim",
    name: "Skin Reclaim",
    price: 1290,
    category: "skin",
    concern: "Scarring & uneven texture",
    positioning: "A focused course designed to support smoother, more refined-looking skin.",
    sessions: "6 sessions",
    includes: ["Microneedling 6 sessions", "Skin scar treatment"],
    featured: true,
  },
  {
    slug: "clear-skin-ground-zero",
    name: "Clear Skin Ground Zero",
    price: 759,
    category: "skin",
    concern: "Acne & congestion",
    positioning: "A reset-style program targeting congestion and everyday breakouts.",
    sessions: "6 sessions",
    includes: ["HydraFacial 6 sessions", "Skin acne treatment"],
    featured: true,
  },
  {
    slug: "forever-twenty",
    name: "Forever Twenty",
    price: 1690,
    category: "skin",
    // The package name draws on the same idea as the confirmed hero tagline
    // (site.heroTagline, "Forever Celebrating Your 20s").
    concern: "Rejuvenation & vitality",
    positioning: "A layered rejuvenation program designed to support radiance and skin vitality.",
    sessions: "7 sessions across 3 treatments",
    includes: [
      "Microneedling 3 sessions",
      "Mesotherapy 3 sessions",
      "HydraFacial 1 session",
      "Skin rejuvenation treatment",
    ],
    featured: true,
  },
];

/* --------------------------------------------------------------------------
   HAIR PACKAGES
   -------------------------------------------------------------------------- */
export const hairPackages: Package[] = [
  {
    slug: "lift-camp-2",
    name: "Lift Camp 2.0",
    price: 1690,
    category: "hair",
    concern: "Hair-growth support",
    positioning: "An extended support program combining mesotherapy with HydraScalp.",
    sessions: "8 sessions",
    includes: ["Mesotherapy 4 sessions", "HydraScalp 4 sessions", "Hair growth treatment"],
    featured: true,
  },
  {
    slug: "lift-camp-1",
    name: "Lift Camp 1.0",
    price: 1290,
    category: "hair",
    concern: "Hair-growth support",
    positioning: "A foundational course for those beginning a hair-support journey.",
    sessions: "6 sessions",
    includes: ["Mesotherapy 3 sessions", "HydraScalp 3 sessions", "Hair growth treatment"],
  },
  {
    slug: "ultimate-warrior",
    name: "Ultimate Warrior",
    price: 690,
    category: "hair",
    concern: "Scalp condition & vitality",
    positioning: "A HydraScalp-led program to support scalp condition and hair vitality.",
    sessions: "6 sessions",
    includes: ["HydraScalp 6 sessions", "Hair growth treatment"],
  },
  {
    slug: "return-of-a-hero",
    name: "Return of A Hero",
    price: 1590,
    category: "hair",
    concern: "Grey-hair pathway support",
    positioning: "A considered program pairing mesotherapy and HydraScalp with the ScalpSpa ritual.",
    sessions: "8 sessions across 3 treatments",
    includes: [
      "Mesotherapy 3 sessions",
      "HydraScalp 3 sessions",
      "ScalpSpa 2 sessions",
      "Grey hair treatment",
    ],
    featured: true,
  },
  {
    slug: "happy-hair-happy-life",
    name: "Happy Hair Happy Life",
    price: 490,
    category: "hair",
    concern: "Grey-hair pathway support",
    positioning: "A gentle, ritual-led entry point centred on the ScalpSpa experience.",
    sessions: "5 sessions",
    includes: ["ScalpSpa 5 sessions", "Grey hair treatment"],
  },
];

/* --------------------------------------------------------------------------
   SINGLE TREATMENTS — the client's eight-item menu, verbatim names and prices.
   -------------------------------------------------------------------------- */
export const singleTreatments: SingleTreatment[] = [
  // SKIN / FACE
  { slug: "face-micro", name: "Face Micro", price: 259, category: "skin", detailSlug: "facial-microneedling" },
  { slug: "face-meso", name: "Face Meso", price: 319, category: "skin", detailSlug: "facial-mesotherapy" },
  { slug: "hydrafacial", name: "HydraFacial", price: 139, category: "skin", detailSlug: "hydrafacial" },
  { slug: "facespa", name: "FaceSpa", price: 109, category: "skin", detailSlug: "facespa", duration: "50 minutes" },
  // HAIR / SCALP
  { slug: "scalp-micro", name: "Scalp Micro", price: 259, category: "hair", detailSlug: "scalp-microneedling" },
  { slug: "scalp-meso", name: "Scalp Meso", price: 329, category: "hair", detailSlug: "scalp-mesotherapy" },
  { slug: "hydrascalp", name: "HydraScalp", price: 139, category: "hair", detailSlug: "hydrascalp-therapy" },
  { slug: "scalpspa", name: "ScalpSpa", price: 109, category: "hair", detailSlug: "scalpspa", duration: "50 minutes" },
];

export const allPackages = [...skinPackages, ...hairPackages];

export function formatPrice(value: number): string {
  return "$" + value.toLocaleString("en-AU");
}
