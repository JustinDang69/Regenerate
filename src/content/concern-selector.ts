/* =============================================================================
   CONCERN SELECTOR — the six concerns the client asked visitors to start from.
   -----------------------------------------------------------------------------
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

   Treatment slugs reference src/content/treatments.ts. The booking CTA uses
   bookHrefFor(slug), so the link preselects the live Bookings service.
   ========================================================================== */

export type SelectableConcern = {
  slug: string;
  /** Exactly the label the client supplied. */
  label: string;
  group: "skin" | "hair";
  /** Two or three sentences, plain language, no diagnosis and no promise. */
  description: string;
  /** Website treatment slugs, in the order to show them. */
  treatmentSlugs: string[];
};

export const selectableConcerns: SelectableConcern[] = [
  {
    slug: "aging",
    label: "Aging",
    group: "skin",
    description:
      "Skin changes with age: firmness and elasticity gradually reduce, fine lines become more visible and texture can look less even. Sun exposure, sleep and everyday stress all play a part alongside time itself.",
    treatmentSlugs: ["facial-microneedling", "facial-mesotherapy", "hydrafacial"],
  },
  {
    slug: "acne-scar",
    label: "Acne Scar",
    group: "skin",
    description:
      "Marks and uneven texture can remain after breakouts have settled, ranging from flat discolouration to indentation. How they look and how they are best approached varies considerably from person to person.",
    treatmentSlugs: ["facial-microneedling", "facial-mesotherapy"],
  },
  {
    slug: "acne",
    label: "Acne",
    group: "skin",
    description:
      "Active breakouts and congestion can affect skin at any age, influenced by oil, build-up and daily environmental stress. Skin may also feel reactive or sensitive while it is congested.",
    treatmentSlugs: ["hydrafacial", "facespa"],
  },
  {
    slug: "skin-brightening",
    label: "Skin Brightening",
    group: "skin",
    description:
      "Skin can look dull, tired or uneven in tone when it is dehydrated or when surface build-up accumulates. Brightness is usually about clarity and evenness rather than changing your natural complexion.",
    treatmentSlugs: ["hydrafacial", "facial-mesotherapy", "facespa"],
  },
  {
    slug: "hair-thinning",
    label: "Hair Thinning",
    group: "hair",
    description:
      "Hair density can reduce over time, and the scalp may become more visible through the hair. Causes are varied and often combined, which is why an individual assessment matters before any plan is made.",
    treatmentSlugs: ["scalp-microneedling", "scalp-mesotherapy", "hydrascalp-therapy"],
  },
  {
    slug: "hair-greying",
    label: "Hair Greying",
    group: "hair",
    description:
      "Greying is a normal part of how hair changes over time. Support in this area is generally focused on scalp condition and the comfort of the hair, rather than on colour itself.",
    treatmentSlugs: ["scalpspa", "hydrascalp-therapy"],
  },
];

export function concernBySlug(slug: string) {
  return selectableConcerns.find((c) => c.slug === slug);
}
