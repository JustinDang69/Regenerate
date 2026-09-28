/* =============================================================================
   CONCERN SELECTOR — the concerns visitors can start from on /concerns.
   -----------------------------------------------------------------------------
   Two groups, rendered as two separate sections (client brief, 28 Sep 2026):

     Skin (2 × 2)                         Hair (3 across)
       Rejuvenation & Aging                 Hair thinning + Hair loss
       Scarring & Texture                   Scalp health
       Pigmentation & Brightening           Hair greying
       Acne & Congestion

   Array order IS display order within each group.

   COMPLIANCE, read before editing:
     • These descriptions are INFORMATIONAL. They describe what a concern is in
       plain language. They do not diagnose the reader and do not promise a
       result.
     • The recommendation line is deliberately framed as what is "commonly
       considered at Regenerate", not as what will work. No efficacy claim is
       made for any treatment against any concern.
     • Only treatments Regenerate actually offers may be listed, by their exact
       customer-facing name, and each must reference a real treatment slug so
       the CTA preselects the right service.
     • TODO(client): clinical sign-off on this wording before any paid campaign
       points at it.

   Slugs are internal (tab/panel ids only) and are kept stable where a concern
   already existed, even where its label changed.

   Treatment slugs reference src/content/treatments.ts. The booking CTA uses
   bookHrefFor(slug), so the link preselects the live Bookings service.
   ========================================================================== */

export type ConcernGroup = "skin" | "hair";

export type SelectableConcern = {
  slug: string;
  /** Exactly the label the client supplied. */
  label: string;
  group: ConcernGroup;
  /** Two or three sentences, plain language, no diagnosis and no promise. */
  description: string;
  /** Website treatment slugs, in the order to show them. */
  treatmentSlugs: string[];
};

export const selectableConcerns: SelectableConcern[] = [
  /* --- SKIN ---------------------------------------------------------------- */
  {
    slug: "aging",
    label: "Rejuvenation & Aging",
    group: "skin",
    description:
      "Skin changes with age: firmness and elasticity gradually reduce, fine lines become more visible and texture can look less even. Sun exposure, sleep and everyday stress all play a part alongside time itself.",
    treatmentSlugs: ["facial-microneedling", "facial-mesotherapy", "hydrafacial"],
  },
  {
    slug: "acne-scar",
    label: "Scarring & Texture",
    group: "skin",
    description:
      "Marks and uneven texture can remain after breakouts have settled, ranging from flat discolouration to indentation. How they look and how they are best approached varies considerably from person to person.",
    treatmentSlugs: ["facial-microneedling", "facial-mesotherapy"],
  },
  {
    /* NEW (28 Sep 2026). Written on the client's behalf in the same register as
       the entries around it — describes the concern, promises nothing. It
       replaces the earlier "Skin Brightening" entry, whose treatments it keeps. */
    slug: "skin-brightening",
    label: "Pigmentation & Brightening",
    group: "skin",
    description:
      "Uneven tone, visible pigmentation and dullness can build up gradually, influenced by sun exposure, past breakouts and everyday environmental stress. Support in this area focuses on a clearer, more even-looking complexion, with treatment options selected according to your skin and goals.",
    treatmentSlugs: ["hydrafacial", "facial-mesotherapy", "facespa"],
  },
  {
    slug: "acne",
    label: "Acne & Congestion",
    group: "skin",
    description:
      "Active breakouts and congestion can affect skin at any age, influenced by oil, build-up and daily environmental stress. Skin may also feel reactive or sensitive while it is congested.",
    treatmentSlugs: ["hydrafacial", "facespa"],
  },

  /* --- HAIR ---------------------------------------------------------------- */
  {
    slug: "hair-thinning",
    label: "Hair thinning + Hair loss",
    group: "hair",
    description:
      "Hair density can reduce over time, and some people notice more shedding or the scalp becoming more visible through the hair. Causes are varied and often combined, which is why an individual assessment matters before any plan is made.",
    treatmentSlugs: ["scalp-microneedling", "scalp-mesotherapy", "hydrascalp-therapy"],
  },
  {
    /* NEW to the selector (28 Sep 2026). Content drawn from the existing Scalp
       Health concern on /hair, and the two treatments that concern names. */
    slug: "scalp-health",
    label: "Scalp health",
    group: "hair",
    description:
      "Scalp comfort and condition underpin healthy-looking hair, yet are easy to overlook in everyday care. Build-up, dryness or a scalp that simply feels uncomfortable are all reasons people start here.",
    treatmentSlugs: ["hydrascalp-therapy", "scalpspa"],
  },
  {
    slug: "hair-greying",
    label: "Hair greying",
    group: "hair",
    description:
      "Greying is a normal part of how hair changes over time. Support in this area is generally focused on scalp condition and the comfort of the hair, rather than on colour itself.",
    treatmentSlugs: ["scalpspa", "hydrascalp-therapy"],
  },
];

export function concernsInGroup(group: ConcernGroup): SelectableConcern[] {
  return selectableConcerns.filter((c) => c.group === group);
}

export function concernBySlug(slug: string) {
  return selectableConcerns.find((c) => c.slug === slug);
}
