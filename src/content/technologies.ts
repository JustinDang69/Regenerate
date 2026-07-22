/* =============================================================================
   TECHNOLOGY / SCIENCE CONTENT
   Explained *inside* the Skin & Hair pages and previewed on the homepage.
   -----------------------------------------------------------------------------
   COMPLIANCE: describe what each modality IS, where it MAY be used, and what it
   is designed to SUPPORT. Avoid guarantees and pseudo-scientific hype.
   TODO(client): confirm technical descriptions with the clinical team.
   ========================================================================== */

export type Technology = {
  slug: string;
  abbr: string;
  name: string;
  what: string;      // plain-language "what it is"
  where: string;     // "where it may be used"
  supports: string;  // "what it is designed to support"
};

export const technologies: Technology[] = [
  {
    slug: "ems",
    abbr: "EMS",
    name: "Electrical Muscle Stimulation",
    what: "A gentle electrical stimulation modality applied via handpiece.",
    where: "Used selectively within facial and body-support treatments.",
    supports: "Designed to support tone and a lifted, refreshed appearance.",
  },
  {
    slug: "rf",
    abbr: "RF",
    name: "Radio Frequency",
    what: "Controlled radio-frequency energy that warms targeted tissue.",
    where: "Featured across several skin-firming and rejuvenation pathways.",
    supports: "Designed to support firmness and smoother-looking skin.",
  },
  {
    slug: "hf",
    abbr: "HF",
    name: "High Frequency",
    what: "A high-frequency application used as part of clinical facials.",
    where: "May be incorporated into acne-support and clarifying treatments.",
    supports: "Designed to support a clearer, more balanced complexion.",
  },
  {
    slug: "ultrasound",
    abbr: "US",
    name: "Ultrasound",
    what: "Ultrasound-based delivery that works beneath the skin surface.",
    where: "Used within hydration and active-delivery treatments.",
    supports: "Designed to support product absorption and skin comfort.",
  },
  {
    slug: "led",
    abbr: "LED",
    name: "Therapeutic LED",
    what: "Calibrated light in specific wavelengths, applied comfortably.",
    where: "A finishing step across many skin and scalp treatments.",
    supports: "Designed to support calm, conditioned skin and scalp.",
  },
  {
    slug: "actives",
    abbr: "AI",
    name: "Active Ingredients",
    what: "Targeted cosmetic actives selected for each concern.",
    where: "Layered through facials, mesotherapy and recovery steps.",
    supports: "Designed to support hydration, clarity and vitality.",
  },
  {
    slug: "essential-oils",
    abbr: "EO",
    name: "Nutritious Essential Oils",
    what: "Nourishing essential oils — for example, rosemary oil.",
    where: "Used within scalp, recovery and head-spa rituals.",
    supports: "Designed to support scalp comfort and a sense of wellbeing.",
  },
];

/* Short homepage snippet describing the clinic's science-led approach. */
export const scienceIntro = {
  eyebrow: "Science-led approach",
  title: "Considered technology, applied with care",
  body:
    "Our treatments draw on a considered range of modalities — from radio frequency and high frequency to therapeutic LED, ultrasound and nourishing actives. Each is selected to suit your concern and confirmed with you in consultation, never applied by default.",
  // Treatment duration guidance from the client brief.
  durationNote: "Most treatments run for approximately 45–90 minutes.",
};
