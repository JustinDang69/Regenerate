/* =============================================================================
   CONCERN-LED CONTENT for the Skin and Hair pages.
   Structure per concern: problem (plain language) → approach (technologies /
   methods) → benefits (careful, non-overclaim) → CTA.
   -----------------------------------------------------------------------------
   COMPLIANCE: use "supports / targets / designed to address / may help improve".
   Never imply a person is unattractive without treatment. Results vary; all
   suitability is confirmed in consultation. TODO(client): clinical sign-off.
   ========================================================================== */

export type Concern = {
  slug: string;
  title: string;
  summary: string;        // short intro shown in cards / overview grid
  problem: string;        // plain-language description of the concern
  approach: string;       // technologies / methods that may be used
  benefits: string;       // careful benefit framing
  technologies: string[]; // references skinTechnologies[].slug in content/treatments.ts
  relatedPackages: string[]; // references package slugs
  category: "skin" | "hair";
};

/* --------------------------------------------------------------------------
   SKIN CONCERNS
   -------------------------------------------------------------------------- */
export const skinConcerns: Concern[] = [
  {
    slug: "acne",
    title: "Acne & Congestion",
    category: "skin",
    summary: "Support for active breakouts and congested, reactive skin.",
    problem:
      "Persistent breakouts and congestion can affect skin at any age, influenced by oil, build-up and daily environmental stress.",
    approach:
      "Programs may combine hydra-dermabrasion, high-frequency application and therapeutic LED, layered with targeted active ingredients.",
    benefits:
      "Designed to support a clearer, more balanced complexion over a considered course, with home-care guidance along the way.",
    technologies: ["high-frequency", "led"],
    relatedPackages: ["clear-skin-ground-zero"],
  },
  {
    slug: "scarring",
    title: "Acne Scarring & Texture",
    category: "skin",
    summary: "Refining the look of scarring and uneven surface texture.",
    problem:
      "Once breakouts settle, uneven texture and the appearance of scarring can remain and feel difficult to shift at home.",
    approach:
      "Micro-needling courses may be paired with scar-support protocols and nourishing actives to encourage skin renewal.",
    benefits:
      "Designed to support smoother-looking, more refined skin texture over time. Results vary by individual.",
    technologies: ["led", "electroporation"],
    relatedPackages: ["skin-reclaim"],
  },
  {
    slug: "hydration",
    title: "Hydration & Dullness",
    category: "skin",
    summary: "Reviving tired, dehydrated and lacklustre-looking skin.",
    problem:
      "Dehydration and daily fatigue can leave skin looking flat, dull and lacking its usual freshness.",
    approach:
      "Hydra treatments, ultrasound-assisted delivery and mesotherapy may be used to cleanse, replenish and support hydration.",
    benefits:
      "Designed to support a hydrated, luminous look and a refreshed, healthy-looking glow.",
    technologies: ["ultrasound", "electroporation"],
    relatedPackages: ["forever-twenty"],
  },
  {
    slug: "rejuvenation",
    title: "Rejuvenation & Vitality",
    category: "skin",
    // NOTE(compliance): frame ageing-support carefully. Never "fix ageing".
    summary: "Supportive care for skin vitality and a rested appearance.",
    problem:
      "Over time, skin can lose some of its firmness and bounce, and may benefit from considered, ongoing support.",
    approach:
      "Layered programs may combine micro-needling, mesotherapy, radio frequency and hydra to support renewal.",
    benefits:
      "Designed to support firmer-looking, revitalised skin. Suitability and expectations are confirmed in consultation.",
    technologies: ["radiofrequency", "ems"],
    relatedPackages: ["forever-twenty", "skin-reclaim"],
  },
];

/* --------------------------------------------------------------------------
   HAIR CONCERNS
   -------------------------------------------------------------------------- */
export const hairConcerns: Concern[] = [
  {
    slug: "thinning",
    title: "Thinning Hair Support",
    category: "hair",
    summary: "Consultation-led support for those noticing thinning or reduced density.",
    problem:
      "Noticing thinning or reduced density can be unsettling, and is influenced by many personal and lifestyle factors.",
    approach:
      "A consultation-led plan may combine scalp mesotherapy and restorative recovery sessions, tailored to you.",
    benefits:
      "Designed to support the scalp environment as part of an individualised hair-support plan. Results vary.",
    technologies: ["electroporation", "ultrasound"],
    relatedPackages: ["lift-camp-2", "lift-camp-1"],
  },
  {
    slug: "scalp",
    title: "Scalp Health",
    category: "hair",
    summary: "Restoring comfort and condition to the scalp.",
    problem:
      "Scalp comfort and condition underpin healthy-looking hair, yet are easy to overlook in everyday care.",
    approach:
      "Head-spa rituals and recovery sessions use nourishing essential oils, such as rosemary oil, to cleanse and calm.",
    benefits:
      "Designed to support a comfortable, well-conditioned scalp and a sense of everyday wellbeing.",
    technologies: ["led", "high-frequency"],
    relatedPackages: ["ultimate-warrior", "happy-hair-happy-life"],
  },
  {
    slug: "recovery",
    title: "Recovery & Vitality",
    category: "hair",
    summary: "Restorative recovery pathways to support hair vitality.",
    problem:
      "Hair and scalp benefit from consistent, restorative care — particularly through periods of stress or change.",
    approach:
      "Basic restorative recovery packages provide regular, gentle support, and can complement mesotherapy programs.",
    benefits:
      "Designed to support hair vitality and scalp condition as part of an ongoing routine.",
    technologies: ["ultrasound", "radiofrequency"],
    relatedPackages: ["ultimate-warrior", "lift-camp-1"],
  },
  {
    slug: "grey",
    title: "Grey-Hair Pathways",
    category: "hair",
    // NOTE(compliance): grey-hair claims require clinical/legal confirmation.
    summary: "Considered, ritual-led pathways for those exploring grey-hair support.",
    problem:
      "Some clients wish to explore supportive pathways as their hair changes over time.",
    approach:
      "Programs may pair mesotherapy and recovery with head-spa rituals, planned with you in consultation.",
    benefits:
      "Designed as a considered, supportive experience. Suitability is confirmed in consultation and results vary.",
    technologies: ["ultrasound", "radiofrequency"],
    relatedPackages: ["return-of-a-hero", "happy-hair-happy-life"],
  },
];

/* NOTE: the `featuredConcerns` homepage selection was removed in client revision
   round 1 — the "Concerns We Support" homepage section no longer exists. Concern
   content is presented in full on the dedicated /skin and /hair pages. */
