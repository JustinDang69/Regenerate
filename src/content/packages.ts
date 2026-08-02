/* =============================================================================
   PRICING DATA — packages + single treatments.
   Prices and inclusions are taken verbatim from the client brief (21-07).
   -----------------------------------------------------------------------------
   COMPLIANCE NOTE: treatment "concern" labels describe what a program is
   *designed to support*, never a guaranteed outcome. Keep supportive framing.
   All pricing is indicative and "confirmed in consultation".
   TODO(client): confirm session durations and any GST-inclusive display rules.
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
  includes: string[];         // itemised inclusions
  featured?: boolean;         // surfaces on the homepage preview
  reviewFlag?: string;        // compliance/marketing review note
};

export type SingleTreatment = {
  slug: string;
  name: string;
  price: number;
  category: Category | "both";
  description: string;
  duration: string;           // TODO(client): confirm precise durations
};

/* --------------------------------------------------------------------------
   SKIN PACKAGES
   -------------------------------------------------------------------------- */
export const skinPackages: Package[] = [
  {
    slug: "skin-reclaim",
    name: "Skin Reclaim",
    price: 990,
    category: "skin",
    concern: "Scarring & uneven texture",
    positioning: "A focused course designed to support smoother, more refined-looking skin.",
    sessions: "6 sessions",
    includes: [
      "Micro-needling × 6 sessions",
      "Skin scar-support treatment",
      "Personalised aftercare guidance",
    ],
    featured: true,
  },
  {
    slug: "clear-skin-ground-zero",
    name: "Clear Skin Ground Zero",
    price: 690,
    category: "skin",
    concern: "Acne & congestion",
    positioning: "A reset-style program targeting congestion and everyday breakouts.",
    sessions: "6 sessions",
    includes: [
      "Hydra-dermabrasion × 6 sessions",
      "Acne-support treatment",
      "Home-care recommendations",
    ],
    featured: true,
  },
  {
    slug: "forever-twenty",
    name: "Forever Twenty",
    price: 1390,
    category: "skin",
    // NOTE(compliance): client likes the line "Forever in your 20s". It is OPTIONAL
    // and must be reviewed before public regulated advertising. See positioning below.
    concern: "Rejuvenation & vitality",
    positioning: "A layered rejuvenation program designed to support radiance and skin vitality.",
    sessions: "7 sessions across 3 modalities",
    includes: [
      "Micro-needling × 3 sessions",
      "Mesotherapy × 3 sessions",
      "Hydra × 1 session",
      "Skin rejuvenation treatment",
    ],
    featured: true,
    reviewFlag:
      'Optional tagline "Forever in your 20s" must be legal/compliance reviewed before any public advertising use.',
  },
];

/* --------------------------------------------------------------------------
   HAIR PACKAGES
   -------------------------------------------------------------------------- */
export const hairPackages: Package[] = [
  {
    slug: "lift-camp-2",
    name: "Lift Camp 2.0",
    price: 1290,
    category: "hair",
    concern: "Hair-growth support",
    positioning: "An extended support program combining mesotherapy with restorative recovery.",
    sessions: "8 sessions",
    includes: [
      "Mesotherapy × 4 sessions",
      "Recovery × 4 sessions",
      "Hair-growth support treatment",
    ],
    featured: true,
  },
  {
    slug: "lift-camp-1",
    name: "Lift Camp 1.0",
    price: 990,
    category: "hair",
    concern: "Hair-growth support",
    positioning: "A foundational course for those beginning a hair-support journey.",
    sessions: "6 sessions",
    includes: [
      "Mesotherapy × 3 sessions",
      "Recovery × 3 sessions",
      "Hair-growth support treatment",
    ],
  },
  {
    slug: "ultimate-warrior",
    name: "Ultimate Warrior",
    price: 690,
    category: "hair",
    concern: "Scalp recovery & vitality",
    positioning: "A restorative recovery-led program to support scalp condition and hair vitality.",
    sessions: "6 sessions",
    includes: [
      "Recovery × 6 sessions",
      "Hair-growth support treatment",
    ],
  },
  {
    slug: "return-of-a-hero",
    name: "Return of A Hero",
    price: 1290,
    category: "hair",
    concern: "Grey-hair pathway support",
    positioning: "A considered program pairing mesotherapy and recovery with a head-spa ritual.",
    sessions: "8 sessions across 3 modalities",
    includes: [
      "Mesotherapy × 3 sessions",
      "Recovery × 3 sessions",
      "Head spa × 2 sessions",
      "Grey-hair support treatment",
    ],
    featured: true,
    reviewFlag:
      "Grey-hair pathway claims should be clinically/legally confirmed before public advertising.",
  },
  {
    slug: "happy-hair-happy-life",
    name: "Happy Hair Happy Life",
    price: 490,
    category: "hair",
    concern: "Grey-hair pathway support",
    positioning: "A gentle, ritual-led entry point centred on the restorative head-spa experience.",
    sessions: "5 sessions",
    includes: [
      "Head spa × 5 sessions",
      "Grey-hair support treatment",
    ],
    reviewFlag:
      "Grey-hair pathway claims should be clinically/legally confirmed before public advertising.",
  },
];

/* --------------------------------------------------------------------------
   SINGLE TREATMENTS
   -------------------------------------------------------------------------- */
export const singleTreatments: SingleTreatment[] = [
  {
    slug: "micro",
    name: "Micro-needling",
    price: 270,
    category: "skin",
    description:
      "A controlled micro-needling session designed to support skin renewal, texture and the appearance of scarring.",
    duration: "≈ 45–60 min", // TODO(client): confirm
  },
  {
    slug: "face-meso",
    name: "Face Mesotherapy",
    price: 290,
    category: "skin",
    description:
      "A facial mesotherapy session that may use both injection and machine-assisted approaches to support hydration and vitality.",
    duration: "≈ 45–75 min",
  },
  {
    slug: "hydra",
    name: "Hydra",
    price: 139,
    category: "skin",
    description:
      "A deep-cleansing hydra treatment designed to refresh, decongest and support a hydrated, luminous look.",
    duration: "≈ 45 min",
  },
  {
    slug: "scalp-meso",
    name: "Scalp Mesotherapy",
    price: 290,
    category: "hair",
    description:
      "A scalp-focused mesotherapy session designed to support the scalp environment as part of a hair-support plan.",
    duration: "≈ 45–60 min",
  },
  {
    slug: "hair-recovery",
    name: "Hair Recovery",
    price: 139,
    category: "hair",
    description:
      "A basic restorative recovery session to support scalp comfort and condition between core treatments.",
    duration: "≈ 45 min",
  },
  {
    slug: "head-spa",
    name: "Head Spa",
    price: 110,
    category: "hair",
    description:
      "A calming head-spa ritual combining cleansing and relaxation to support scalp wellbeing.",
    duration: "≈ 45–60 min",
  },
];

export const allPackages = [...skinPackages, ...hairPackages];
/* NOTE: the derived `featuredPackages` list was removed in client revision round 1
   with the homepage "Featured Programs" section. The `featured` flag itself is
   still used to emphasise signature packages on the /pricing page. */

export function formatPrice(value: number): string {
  return "$" + value.toLocaleString("en-AU");
}
