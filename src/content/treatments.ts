/* =============================================================================
   TREATMENT GUIDE CONTENT — single source of truth for /treatments.
   -----------------------------------------------------------------------------
   Wording is taken from the client's Treatment Guide (and, for MedicalSCALP, the
   client's supplied source content, round-4 production brief). Card previews
   are shortened, but shortening only removes words — it never strengthens a
   claim, softens a caution, or adds anything the source does not say.

   HIERARCHY (client-approved, round 4/5):
     A. Skin Treatments        — bookable
     B. Hair Treatments (public label; group "scalp") — bookable
     C. Skin and Scalp Technologies — NOT bookable; applied within treatments
     D. Advanced Compounds & Medicinal Cosmetics — reference only, not bookable
     E. Shared Treatment / Clinic Information — written once, referenced everywhere

   LED is a technology only (group C). It does not appear in `treatments`.

   No price field: none of this content carries confirmed per-treatment
   pricing. Do not invent one — detail pages link to /pricing instead.
   ========================================================================== */

export type TreatmentGroup = "skin" | "scalp";

export type ProcessStep = { title: string; body: string };

/** A multi-step treatment process. `rail` suits a short sequence of described
 *  steps; `accordion` suits a long one (MedicalFACIAL/MedicalSCALP: 17) so the page
 *  never renders many always-open cards at once. */
export type Process = { display: "rail" | "accordion"; steps: ProcessStep[] };

export type Treatment = {
  slug: string;
  group: TreatmentGroup;
  name: string;
  /** Marks a clinic signature offering. Surfaces a restrained "Signature
   *  Treatment" designation on the index card and detail page. It does NOT
   *  change the treatment's group — a signature treatment still sits inside
   *  its normal Skin or Hair section. */
  signature?: boolean;
  /** Client-confirmed session length (e.g. "50 minutes"). Only present where
   *  the client has stated it. */
  duration?: string;
  /* ------------------------------------------------------------------------
     Clinical sections. ALL optional: a "basic" treatment such as UltraFACIAL or
     UltraSCALP, where the client supplied only a name, a step list, a duration
     and a price, must render ONLY that. The detail template omits any section
     whose source content does not exist — nothing is filled in to satisfy
     the type. Do not add placeholder text here to make a section appear.
     ---------------------------------------------------------------------- */
  tagline?: string;
  /** Shortened card-preview copy. */
  summary?: string;
  overview?: string;
  /** Simple treatments describe mechanism in prose; multi-step ones use `process`. */
  howItWorks?: string;
  process?: Process;
  benefits?: string[];
  preProcedure?: string;
  during?: string;
  postProcedure?: string;
  aftercare?: string[];
  recommendation?: string;
};

/** Source-grounded one-line meta for cards and heroes, e.g. "12 steps · 50 minutes".
 *  Built only from confirmed facts, so it is safe for basic treatments. */
export function treatmentMeta(t: Treatment): string | undefined {
  const parts: string[] = [];
  if (t.process) parts.push(`${t.process.steps.length} steps`);
  if (t.duration) parts.push(t.duration);
  return parts.length ? parts.join(" · ") : undefined;
}

export const treatments: Treatment[] = [
  {
    slug: "facial-microneedling",
    group: "skin",
    name: "Facial Microneedling",
    tagline: "Collagen induction for smoother, firmer-looking skin",
    summary:
      "A minimally invasive collagen-induction procedure that improves skin texture and supports natural renewal.",
    overview:
      "Facial microneedling is a minimally invasive collagen-induction procedure that improves skin texture and supports natural renewal.",
    howItWorks:
      "A sterile, single-use needle cartridge creates controlled microchannels at a depth selected for the treatment area and concern. This activates the skin's wound-repair response and supports remodelling of collagen and elastin. The channels also allow selected sterile products that are suitable for microneedling to be applied during the procedure.",
    benefits: [
      "Smoother and more refined skin texture",
      "Reduced appearance of fine lines",
      "Improved appearance of enlarged pores and selected acne scars",
      "Brighter, more even-looking skin",
      "Progressive collagen remodelling over a course of treatments",
    ],
    preProcedure:
      "Arrive with clean skin and avoid strong exfoliants, retinol and irritating treatments for the period advised. We perform a skin scan and analysis, review your goals and treatment history, and prepare the skin for the selected protocol. Professional facial steam is included at the beginning of selected cleansing, hydration and infusion treatments.",
    during:
      "Following cleansing and preparation, the practitioner treats the face systematically. A topical anaesthetic is used when appropriate. The skin usually appears red and feels warm or tight afterwards. Mild dryness or flaking can follow over several days.",
    postProcedure:
      "Temporary redness, warmth, tightness, tenderness, swelling or small treatment marks can occur. Use gentle skincare, protect the skin from sun and follow the personalised activity and product instructions provided by your practitioner.",
    aftercare: [
      "For 24–48 hours: avoid makeup, strenuous exercise, swimming, saunas, steam rooms, direct heat and unnecessary touching.",
      "Use a gentle cleanser, bland moisturiser and broad-spectrum SPF 30+ or higher.",
      "Do not apply retinoids, strong acids, scrubs or other irritating actives until the skin barrier has recovered.",
      "Do not pick flaking skin. Contact the clinic if redness, swelling, pain or discharge worsens rather than settles.",
    ],
    recommendation:
      "A course of treatments spaced approximately 4–6 weeks apart produces progressive results, followed by maintenance according to your response and goals.",
  },
  {
    slug: "facial-mesotherapy",
    group: "skin",
    name: "Facial Mesotherapy",
    tagline: "Micro-infusion treatment for hydration and skin vitality",
    summary:
      "Delivers small amounts of an individually selected, legally supplied formulation into superficial layers of the skin to improve hydration, radiance and overall skin quality.",
    overview:
      "Facial mesotherapy delivers small amounts of an individually selected, legally supplied formulation into superficial layers of the skin to improve hydration, radiance and overall skin quality.",
    howItWorks:
      "A series of fine, shallow injections distributes the selected formulation across the treatment area. The ingredients and injection protocol determine the purpose of treatment. Common cosmetic programs focus on hydration, skin conditioning and refreshed appearance.",
    benefits: [
      "Improved hydration and softness",
      "Fresher, more radiant-looking skin",
      "Improved appearance of fine surface lines",
      "Support for overall skin quality and elasticity",
      "Customised treatment for specific cosmetic goals",
    ],
    preProcedure:
      "Arrive with clean skin and avoid strong exfoliants, retinol and irritating treatments for the period advised. We perform a skin scan and analysis, review your goals and treatment history, and prepare the skin for the selected protocol. Professional facial steam is included at the beginning of selected cleansing, hydration and infusion treatments.",
    during:
      "After cleansing and preparation, small injections are placed in a planned pattern. Temporary pinpoint marks, small bumps, redness, tenderness, swelling or bruising are expected and usually settle progressively.",
    postProcedure:
      "Temporary redness, warmth, tightness, tenderness, swelling or small treatment marks can occur. Use gentle skincare, protect the skin from sun and follow the personalised activity and product instructions provided by your practitioner.",
    aftercare: [
      "Avoid touching, rubbing or applying makeup for the period advised.",
      "Avoid intense exercise, alcohol, swimming, saunas, steam and excessive heat for 24–48 hours.",
      "Use gentle skincare and daily broad-spectrum sunscreen.",
      "Delay retinoids, exfoliating acids and harsh treatments until tenderness and irritation have resolved.",
    ],
    recommendation:
      "A personalised series is recommended for cumulative results. Session number and spacing are selected according to the formulation, treatment area, response and goals.",
  },
  {
    slug: "hydrafacial",
    group: "skin",
    name: "MedicalFACIAL",
    tagline: "Cleansing, exfoliation, extraction and hydration in one treatment",
    summary:
      "A multi-step, non-invasive facial treatment that combines cleansing, exfoliation, vacuum-assisted extraction and topical hydration.",
    overview:
      "MedicalFACIAL is a multi-step, non-invasive facial treatment that combines cleansing, exfoliation, vacuum-assisted extraction and topical hydration.",
    /* Steps and duration: the client's list of 28 Sep 2026 (Treatments.pdf),
       exact wording, titles only — do not "correct" or expand them. */
    duration: "65 minutes",
    process: {
      display: "accordion",
      steps: [
        { title: "Scan & Consultation", body: "Reviews the treatment area, goals and relevant history before the practitioner selects the appropriate treatment settings and products." },
        { title: "Makeup/ sunscreen/ debris Removal", body: "Gently removes makeup, sunscreen and surface debris to prepare the skin for the treatment." },
        { title: "Toner Exfoliation", body: "Applies an exfoliating toner to loosen surface buildup and prepare the treatment area for the next steps." },
        { title: "Steam", body: "Uses gentle steam to soften surface buildup and prepare the treatment area for cleansing." },
        { title: "Oxygenated Essence Water", body: "Applies oxygenated essence water to refresh and lightly hydrate the treatment area before the next steps." },
        { title: "Deep-cleanse", body: "Provides a thorough cleanse to remove residual oil, impurities and loosened surface debris." },
        { title: "Face & Neck Massage", body: "A relaxing face and neck massage supports a comfortable treatment experience and helps distribute applied products." },
        { title: "Ultrasonic Exfoliation & Extraction", body: "Uses ultrasonic exfoliation together with targeted extraction to remove loosened surface buildup and visible congestion where appropriate." },
        { title: "Toner Neutralisation", body: "Applies toner to rebalance and prepare the treatment area after exfoliation." },
        { title: "Hydrodermabrasion Treatment", body: "Combines fluid-based exfoliation and suction as part of the cleansing and resurfacing stage." },
        { title: "Serum Highfrequency Treatment", body: "Applies selected serum while high-frequency technology is used as part of the treatment protocol." },
        { title: "Serum Electroporosis (Electrical Microneedling) Treatment", body: "Uses the clinic's electroporation and electrical treatment step with selected serum as part of the treatment protocol." },
        { title: "Serum Ultrasound Treatment", body: "Uses ultrasound with selected serum to support even application across the treated area." },
        { title: "Serum Radiofrequency Treatment", body: "Applies selected serum and uses radiofrequency as part of the treatment protocol, with settings adjusted for the treatment area and comfort." },
        { title: "Moisturiser Pore Miniature Treatment", body: "Finishes with moisturiser and a pore-focused treatment step to condition the treated skin." },
        { title: "Light Therapy Treatment", body: "Uses light therapy as a finishing step selected for the treatment area and overall treatment plan." },
        { title: "Sun Protection", body: "Finishes with sun protection to help protect the treated skin before leaving the clinic." },
      ],
    },
    benefits: [
      "Deep cleansing and removal of surface debris",
      "Smoother, softer skin texture",
      "Improved hydration and visible radiance",
      "Reduced appearance of congestion and blackheads",
      "Customisable treatment for dry, oily, dull or congested skin",
      "Little to no downtime for most clients",
    ],
    preProcedure:
      "We begin with a detailed skin scan and analysis. Professional facial steam softens surface buildup and prepares congested areas for cleansing and extraction. We then select the exfoliation tip, suction level and hydrating solutions for the skin's needs.",
    during:
      "The practitioner moves the treatment handpiece systematically across the skin through cleansing, exfoliation, extraction and hydration stages. Suction and solution strength are adjusted for comfort and the condition of each area.",
    postProcedure:
      "The skin feels clean, smooth and hydrated. Use gentle skincare and daily sunscreen, and avoid strong exfoliation, excessive heat and intense exercise for 24–48 hours if the skin feels sensitive.",
    aftercare: [
      "Use gentle skincare and broad-spectrum SPF 30+ or higher.",
      "Avoid excessive heat, steam, intense exercise and harsh exfoliation for 24–48 hours if the skin is sensitive.",
      "Do not pick, scrub or layer strong actives onto irritated skin.",
      "A maintenance treatment every 4–6 weeks suits many clients; frequency is adjusted for sensitivity, congestion, dryness, treatment strength and other procedures.",
    ],
    recommendation:
      "A maintenance treatment every 4–6 weeks suits many clients. Your practitioner adjusts the frequency for congestion, dryness, sensitivity, treatment strength and other procedures.",
  },
  {
    slug: "scalp-microneedling",
    group: "scalp",
    name: "Scalp Microneedling",
    tagline: "Targeted scalp stimulation for thinning-hair programs",
    summary:
      "Creates controlled microchannels across selected thinning areas as part of an individualised hair and scalp program.",
    overview:
      "Scalp microneedling creates controlled microchannels across selected thinning areas and is used as part of an individualised hair and scalp program.",
    howItWorks:
      "Controlled needling activates local wound-healing signals around the treated scalp. This targeted stimulation supports the scalp environment and complements a personalised program for stronger, fuller-looking hair.",
    benefits: [
      "Supports a healthier scalp treatment environment",
      "Complements suitable evidence-based hair-loss management",
      "Targets areas of visible thinning",
      "Allows a structured course with photographic progress review",
    ],
    preProcedure:
      "Arrive with a clean, dry scalp and avoid heavy styling products. We perform a scalp scan and analysis, review the hair-loss pattern and treatment history, and prepare the scalp for the selected protocol. Professional scalp steam is included at the beginning of selected cleansing and scalp-care treatments.",
    during:
      "The scalp is cleaned and sectioned before treatment. The practitioner adjusts depth and intensity to the area and scalp condition. Temporary redness, tenderness, pinpoint bleeding or a tight sensation can occur.",
    postProcedure:
      "Temporary redness, tenderness, small bumps or pinpoint marks can occur. Keep the scalp clean, avoid scratching and follow the product, washing, exercise, heat and sun instructions provided by your practitioner.",
    aftercare: [
      "Keep the scalp clean and avoid scratching or rubbing.",
      "Follow the practitioner's direction on when to wash the hair and restart topical products.",
      "Avoid hair dye, chemical straightening, heavy styling products, swimming, excessive sweating and direct sun until the scalp settles.",
      "Use a clean pillowcase and avoid sharing hats, towels or hair tools during early recovery.",
    ],
    recommendation:
      "A course of treatments spaced approximately 4–6 weeks apart produces progressive results, followed by maintenance according to your response and goals.",
  },
  {
    slug: "scalp-mesotherapy",
    group: "scalp",
    name: "Scalp Mesotherapy",
    tagline: "Precision micro-injections for personalised scalp programs",
    summary:
      "Places small amounts of a selected formulation into the superficial scalp as part of a practitioner-directed program for scalp quality and hair-thinning concerns.",
    overview:
      "Scalp mesotherapy places small amounts of a selected formulation into the superficial scalp as part of a practitioner-directed program for scalp quality and hair-thinning concerns.",
    howItWorks:
      "Multiple shallow injections distribute the selected ingredients across the target area. The practitioner selects a targeted formulation and treatment pattern to support scalp vitality and fuller, healthier-looking hair.",
    benefits: [
      "Direct treatment of selected scalp areas",
      "Personalised protocols based on scalp and hair assessment",
      "Structured treatment series with progress monitoring",
      "Combination with appropriate home care or medical referral",
    ],
    preProcedure:
      "Arrive with a clean, dry scalp and avoid heavy styling products. We perform a scalp scan and analysis, review the hair-loss pattern and treatment history, and prepare the scalp for the selected protocol. Professional scalp steam is included at the beginning of selected cleansing and scalp-care treatments.",
    during:
      "The scalp is cleaned, sectioned and treated with multiple fine injections. Temporary bumps, redness, tenderness, bruising or pinpoint bleeding can occur.",
    postProcedure:
      "Temporary redness, tenderness, small bumps or pinpoint marks can occur. Keep the scalp clean, avoid scratching and follow the product, washing, exercise, heat and sun instructions provided by your practitioner.",
    aftercare: [
      "Do not wash the hair for the period specified by your practitioner.",
      "Avoid scratching, massage, firm pressure and unapproved scalp products.",
      "Avoid hair dye and chemical treatments for approximately one week or as directed.",
      "Use a clean pillowcase and protect the scalp from sun and excessive heat.",
    ],
    recommendation:
      "A personalised series is recommended for cumulative results. Session number and spacing are selected according to the formulation, treatment area, response and goals.",
  },
  {
    /* NOTE: the slug intentionally still reads "hydrascalp-therapy". The
       PUBLIC NAME dropped "Therapy" (client request), but the route is kept so
       existing internal links and any indexed URLs continue to resolve. */
    slug: "hydrascalp-therapy",
    group: "scalp",
    name: "MedicalSCALP",
    signature: true,
    tagline: "A multi-step scalp ritual combining cleansing, technology and relaxation",
    summary:
      "A comprehensive, multi-step scalp treatment combining deep cleansing, scalp conditioning, massage, professional topical ingredients and selected device-based technologies.",
    overview:
      "MedicalSCALP is a comprehensive, multi-step scalp treatment that combines deep cleansing, scalp conditioning, massage, professional topical ingredients and selected device-based technologies. The treatment removes excess oil, product residue and surface buildup; improves scalp hydration; supports a balanced scalp environment; stimulates the scalp and hair follicles; addresses common scalp concerns and promotes ultimate relaxation eliminating stress.",
    /* Steps and duration: the client's list of 28 Sep 2026 (Treatments.pdf),
       exact wording, titles only — do not "correct" or expand them. */
    duration: "65 minutes",
    process: {
      display: "accordion",
      steps: [
        { title: "Scan & Consultation", body: "Reviews the treatment area, goals and relevant history before the practitioner selects the appropriate treatment settings and products." },
        { title: "Toner Exfoliation", body: "Applies an exfoliating toner to loosen surface buildup and prepare the treatment area for the next steps." },
        { title: "Steam", body: "Uses gentle steam to soften surface buildup and prepare the treatment area for cleansing." },
        { title: "Natural oils Exfoliation", body: "Uses selected natural oils as part of the exfoliation step to help loosen surface buildup before cleansing." },
        { title: "Oxygenated Essence Water", body: "Applies oxygenated essence water to refresh and lightly hydrate the treatment area before the next steps." },
        { title: "Deep-cleanse", body: "Provides a thorough cleanse to remove residual oil, impurities and loosened surface debris." },
        { title: "Scalp Massage", body: "A focused scalp massage forms part of the treatment experience and helps distribute applied products across the scalp." },
        { title: "Neck Massage", body: "A relaxing neck massage complements the scalp treatment and overall treatment experience." },
        { title: "Ultrasonic Exfoliation & Extraction", body: "Uses ultrasonic exfoliation together with targeted extraction to remove loosened surface buildup and visible congestion where appropriate." },
        { title: "Toner Neutralisation", body: "Applies toner to rebalance and prepare the treatment area after exfoliation." },
        { title: "Hydrodermabrasion Treatment", body: "Combines fluid-based exfoliation and suction as part of the cleansing and resurfacing stage." },
        { title: "Serum Highfrequency Treatment", body: "Applies selected serum while high-frequency technology is used as part of the treatment protocol." },
        { title: "Serum Electroporosis (Electrical Microneedling) Treatment", body: "Uses the clinic's electroporation and electrical treatment step with selected serum as part of the treatment protocol." },
        { title: "Serum Ultrasound Treatment", body: "Uses ultrasound with selected serum to support even application across the treated area." },
        { title: "Serum Radiofrequency Treatment", body: "Applies selected serum and uses radiofrequency as part of the treatment protocol, with settings adjusted for the treatment area and comfort." },
        { title: "Moisturiser Pore Miniature Treatment", body: "Finishes with moisturiser and a pore-focused treatment step to condition the treated skin." },
        { title: "Light Therapy Treatment", body: "Uses light therapy as a finishing step selected for the treatment area and overall treatment plan." },
      ],
    },
    benefits: [
      "Deep cleansing without a conventional hair wash",
      "Removal of excess oil, loose flakes and styling-product buildup",
      "Cleaner and less congested follicular openings",
      "Improved scalp hydration and conditioning",
      "Support for dry, oily, flaky or congested scalp conditions",
      "Calming of scalp discomfort and visible irritation",
      "Stimulation of the scalp and local microcirculation",
      "Support for a healthier environment around the hair follicles",
      "Improved delivery of selected topical active ingredients",
      "Support for stronger-looking, healthier hair",
      "Complementary support for hair-growth and hair-loss treatment programs",
      "Relief of scalp tension and a deeply relaxing spa experience",
      "Customisable treatment according to scalp analysis and individual needs",
      "No needles and little to no downtime for most clients",
    ],
    preProcedure:
      "MedicalSCALP is a specialist scalp treatment. Clients should attend with clean and dry hair and scalp because MedicalSCALP does not include hair wash. Hair should be free from styling products, dry shampoo, hair fibres, oils, serums, sprays, gels and other leave-in products.\n\nThe scalp must not have open wounds, cuts, broken or actively inflamed skin, recent bruising, bleeding, active infection, weeping lesions or significant sunburn. Clients must inform the practitioner about allergies, sensitivities, diagnosed scalp conditions, recent hair or scalp procedures, pregnancy, implanted electrical or medical devices, relevant medical history and any topical or oral medications being used.\n\nIf the scalp is suitable for treatment, the practitioner selects the appropriate treatment stages, device settings, topical active compounds and essential oils according to the client's scalp condition, comfort and treatment goals.",
    during:
      "The practitioner divides the hair into sections and treats the scalp systematically to ensure consistent coverage. Products, device settings and treatment time are adjusted according to oiliness, dryness, sensitivity, visible flaking, buildup and the client's comfort. Clients may experience gentle warmth, cooling, vibration or mild tingling during different stages.",
    postProcedure:
      "The scalp feels clean, conditioned, refreshed and hydrated. Because MedicalSCALP includes leave-on active ingredients, clients should avoid washing the hair immediately after treatment. Unless otherwise directed, allow the applied ingredients to remain on the scalp for approximately 6–12 hours.\n\nAvoid scratching, vigorous brushing, strong exfoliating scalp products, hair dye, bleaching, excessive heat, sauna use and intense exercise for 24–48 hours if the scalp feels sensitive. Use gentle scalp and hair products and follow the personalised home-care advice provided by the practitioner.",
    aftercare: [
      "Do not wash the hair for approximately 6–12 hours after treatment unless advised otherwise.",
      "Use a gentle shampoo and avoid harsh scalp scrubs or strong exfoliating products for 24–48 hours.",
      "Avoid hair dye, bleaching and other chemical scalp treatments for at least 48 hours or as directed.",
      "Avoid excessive heat, steam, sauna use and intense exercise for 24 hours if the scalp is sensitive.",
      "Do not scratch, pick or aggressively massage areas of irritation.",
      "Introduce only the recommended leave-on scalp products after treatment.",
      "Continue prescribed hair-loss medication only in accordance with the prescriber's directions.",
      "A maintenance treatment every 4–6 weeks suits many clients; a customised initial course may be recommended for particular scalp concerns.",
    ],
    recommendation:
      "For general scalp maintenance and relaxation, a MedicalSCALP treatment every 4–6 weeks suits many clients. A more frequent initial course may be recommended for significant oiliness, buildup, dryness, flaking or as part of a structured hair-support program. Treatment frequency is adjusted according to the scalp analysis, sensitivity, response to treatment, home-care routine and any medical or professional hair-loss treatment being used.",
  },

  /* ==========================================================================
     BASIC TREATMENTS — UltraFACIAL and UltraSCALP (client price menu, 16 Sep 2026).
     The client supplied ONLY: the name, twelve step titles, a 50-minute
     duration and a price. No benefits, contraindications, pre/during/post
     wording, aftercare, frequency or claims were supplied, and none are
     written here. Step titles are the client's exact wording, including
     spacing and capitalisation — do not "correct" them.
     ======================================================================== */
  {
    slug: "facespa",
    group: "skin",
    name: "UltraFACIAL",
    duration: "50 minutes",
    process: {
      display: "accordion",
      steps: [
        { title: "Makeup/ sunscreen/ debris Removal", body: "Gently removes makeup, sunscreen and surface debris to prepare the skin for the treatment." },
        { title: "Toner Exfoliation", body: "Applies an exfoliating toner to loosen surface buildup and prepare the treatment area for the next steps." },
        { title: "Steam", body: "Uses gentle steam to soften surface buildup and prepare the treatment area for cleansing." },
        { title: "Oxygenated Essence Water", body: "Applies oxygenated essence water to refresh and lightly hydrate the treatment area before the next steps." },
        { title: "Deep-cleanse", body: "Provides a thorough cleanse to remove residual oil, impurities and loosened surface debris." },
        { title: "Face & Neck Massage", body: "A relaxing face and neck massage supports a comfortable treatment experience and helps distribute applied products." },
        { title: "Ultrasonic Exfoliation", body: "Uses ultrasonic exfoliation to lift loosened surface debris and refine the treated area." },
        { title: "Toner Neutralisation", body: "Applies toner to rebalance and prepare the treatment area after exfoliation." },
        { title: "Hydrodermabrasion Treatment", body: "Combines fluid-based exfoliation and suction as part of the cleansing and resurfacing stage." },
        { title: "Serum Highfrequency Treatment", body: "Applies selected serum while high-frequency technology is used as part of the treatment protocol." },
        { title: "Serum Ultrasound Treatment", body: "Uses ultrasound with selected serum to support even application across the treated area." },
        { title: "Moisturiser Pore Miniature Treatment", body: "Finishes with moisturiser and a pore-focused treatment step to condition the treated skin." },
      ],
    },
  },
  {
    slug: "scalpspa",
    group: "scalp",
    name: "UltraSCALP",
    duration: "50 minutes",
    process: {
      display: "accordion",
      steps: [
        { title: "Toner Exfoliation", body: "Applies an exfoliating toner to loosen surface buildup and prepare the treatment area for the next steps." },
        { title: "Steam", body: "Uses gentle steam to soften surface buildup and prepare the treatment area for cleansing." },
        { title: "Oxygenated Essence Water", body: "Applies oxygenated essence water to refresh and lightly hydrate the treatment area before the next steps." },
        { title: "Cleansing", body: "Cleanses the scalp to remove loosened oil, residue and surface impurities." },
        { title: "Scalp & Neck Massage", body: "A relaxing scalp and neck massage complements the cleansing stages and overall treatment experience." },
        { title: "Ultrasonic Exfoliation", body: "Uses ultrasonic exfoliation to lift loosened surface debris and refine the treated area." },
        { title: "Toner Neutralisation", body: "Applies toner to rebalance and prepare the treatment area after exfoliation." },
        { title: "Hydrodermabrasion Treatment", body: "Combines fluid-based exfoliation and suction as part of the cleansing and resurfacing stage." },
        { title: "Serum Highfrequency Treatment", body: "Applies selected serum while high-frequency technology is used as part of the treatment protocol." },
        { title: "Serum Ultrasound Treatment", body: "Uses ultrasound with selected serum to support even application across the treated area." },
        { title: "Serum Pore Miniature Treatment", body: "Applies selected serum as part of a pore-focused finishing step for the scalp." },
        { title: "LED Light Treatment", body: "Finishes with LED light as part of the clinic's scalp treatment protocol." },
      ],
    },
  },
];

export function treatmentBySlug(slug: string) {
  return treatments.find((t) => t.slug === slug);
}

/* Short intros for the treatment lists (client brief, 28 Sep 2026). Written
   once here and shown both on the dedicated /skin-treatments and
   /hair-treatments pages and under the matching sections of /concerns. */
export const skinTreatmentsIntro =
  "Explore our facial treatments designed to support skin quality, texture, hydration and rejuvenation. Your treatment pathway is selected according to your skin concerns, goals and consultation.";

export const hairTreatmentsIntro =
  "Explore our scalp and hair treatments designed to support scalp health, thinning concerns and overall hair quality. Your treatment pathway is selected according to your assessment, goals and consultation.";

/* =============================================================================
   C. SKIN AND SCALP TECHNOLOGIES
   -----------------------------------------------------------------------------
   Modalities, not bookable treatments — applied WITHIN treatments above.
   LED lives here only; it does not appear in `treatments`.
   ========================================================================== */

export type TechMode = { title: string; body: string };
export type LedLight = { title: string; items: string[] };
export type Wavelength = {
  light: string;
  swatch: string;
  nm: string;
  use: string;
  does: string;
};

export type SkinTechnology = {
  slug: string;
  name: string;
  fullName: string;
  /** Short italic serif line on the showcase card (Artifact B LED-card style). */
  tagline: string;
  /** Concise card-preview copy. The long clinical `overview` stays on the
   *  detail page — showcase cards must not carry a dense paragraph. */
  summary: string;
  overview: string;
  howItWorks: string;
  modes?: TechMode[];
  /** LED only — light colours and who each suits. */
  lights?: LedLight[];
  /** LED only — the wavelength reference table. */
  wavelengths?: Wavelength[];
  bestFor: string[];
  benefits: string[];
  before: string;
  during: string;
  after: string;
  recommendation: string;
};

export const technologiesIntro =
  "Device-based treatments use controlled electrical, electromagnetic, acoustic or light energy. Each technology has a distinct purpose. Treatment settings, contact medium, session length and combination plan are selected after consultation.";

export const skinTechnologies: SkinTechnology[] = [
  {
    slug: "ems",
    name: "EMS",
    fullName: "EMS — Electrical Muscle Stimulation",
    tagline: "Non-invasive facial toning and muscle engagement",
    summary:
      "Controlled low-level electrical impulses activate selected facial muscles for a more lifted, defined appearance.",
    overview:
      "Electrical Muscle Stimulation uses controlled low-level electrical impulses to activate selected facial muscles. It is a non-invasive technology for facial toning, improved muscle engagement and a more lifted, defined appearance.",
    howItWorks:
      "Adhesive electrodes or handheld probes deliver patterned electrical pulses through the skin to motor nerves. These impulses produce repeated, controlled muscle contractions and relaxation. Intensity, pulse width, frequency and treatment time are adjusted to create visible movement while maintaining comfort.",
    modes: [
      { title: "Facial toning mode", body: "Activates selected muscles that support facial expression and contour." },
      { title: "Lifting protocol", body: "Focuses on areas where improved muscle engagement creates a firmer-looking appearance." },
      { title: "Maintenance protocol", body: "Uses regular sessions to preserve the toned appearance achieved during an initial course." },
      { title: "Combination treatment", body: "Pairs well with hydrating facials, LED or other non-invasive skin-conditioning treatments." },
    ],
    bestFor: [
      "Reduced appearance of facial tiredness",
      "A more toned and defined facial contour",
      "Clients seeking a non-invasive lifting effect",
      "Maintenance of facial muscle engagement",
      "Combination rejuvenation programs",
    ],
    benefits: [
      "Produces visible, controlled muscle contractions",
      "Creates a firmer and more energised facial appearance",
      "Customisable intensity for each area",
      "Non-invasive treatment with no skin penetration",
      "Little to no downtime",
    ],
    before:
      "Arrive with clean skin and remove metal jewellery from the treatment area. We complete a skin scan and facial analysis, then select electrode positions, pulse pattern and intensity for your facial structure and goals.",
    during:
      "Electrodes or conductive probes are positioned over selected muscles. The intensity is increased gradually until comfortable, visible contractions occur. Clients usually feel rhythmic pulsing, tightening and release without skin injury.",
    after:
      "The face can feel lightly exercised and appear temporarily flushed. Normal activities can usually resume immediately. Hydrating skincare and sunscreen complete the treatment.",
    recommendation:
      "An initial course of 1–2 treatments weekly for several weeks is commonly used, followed by maintenance sessions according to muscle response and aesthetic goals.",
  },
  {
    slug: "electroporation",
    name: "Electroporation",
    fullName: "Electroporation — Needle-Free Product Infusion",
    tagline: "Needle-free infusion of selected active ingredients",
    summary:
      "Increases movement of selected actives through the outer skin barrier — intensive hydration without injections or mechanical puncture.",
    overview:
      "Electroporation is a needle-free infusion technology that increases the movement of selected active ingredients through the outer skin barrier. It delivers intensive hydration and skin-conditioning actives without injections or mechanical puncture.",
    howItWorks:
      "Short, controlled electrical pulses temporarily reorganise lipid pathways within the stratum corneum, creating reversible aqueous channels. Compatible water-based molecules can then move through the skin barrier more efficiently. Normal barrier structure returns after the electrical pulses stop.",
    modes: [
      { title: "Hydration infusion", body: "Delivers humectants and moisturising ingredients for plumper-looking skin." },
      { title: "Brightening infusion", body: "Supports delivery of compatible antioxidants and tone-refining ingredients." },
      { title: "Calming infusion", body: "Uses selected soothing ingredients for stressed or dehydrated skin." },
      { title: "Scalp infusion", body: "Supports delivery of compatible scalp-conditioning products across selected areas." },
    ],
    bestFor: [
      "Dry or dehydrated skin",
      "Dull or tired-looking skin",
      "Uneven-looking tone",
      "Skin requiring a non-invasive infusion option",
      "Clients who want minimal downtime",
      "Facial or scalp-conditioning programs",
    ],
    benefits: [
      "Enhanced delivery of compatible topical actives",
      "Immediate improvement in hydration and softness",
      "Needle-free and non-ablative",
      "Comfortable treatment with minimal downtime",
      "Customisable serums for different cosmetic goals",
    ],
    before:
      "We begin with a skin or scalp scan and analysis, followed by thorough cleansing. Selected protocols also include professional steam to soften surface buildup and prepare the area. We then select a conductive medium and active ingredients specifically compatible with electroporation.",
    during:
      "A smooth handpiece is moved across the treatment area while controlled pulses are delivered. Clients usually feel light tingling or tapping. Serum is applied progressively so the skin remains evenly coated throughout treatment.",
    after:
      "Skin typically feels hydrated, soft and refreshed. Mild temporary redness or tingling can occur. Gentle skincare and broad-spectrum sunscreen are recommended after facial treatment.",
    recommendation:
      "Electroporation can be performed as a single hydration boost or as a course every 1–2 weeks, followed by monthly maintenance according to the product used and treatment goals.",
  },
  {
    slug: "radiofrequency",
    name: "Radiofrequency",
    fullName: "Radiofrequency (RF) Skin Firming",
    tagline: "Controlled warming for firmer-looking skin",
    summary:
      "Non-surgical skin firming that uses controlled electromagnetic energy to support collagen contraction and gradual remodelling.",
    overview:
      "Radiofrequency is a non-surgical skin-firming technology that uses controlled electromagnetic energy to heat targeted tissue. It supports collagen contraction, new collagen formation and gradual remodelling for smoother, firmer-looking skin.",
    howItWorks:
      "RF energy meets natural resistance within tissue and is converted into heat. Controlled heating within the dermis causes immediate contraction of existing collagen fibres and activates a longer remodelling response. Temperature, energy, electrode configuration, movement and contact time determine the depth and uniformity of heating.",
    modes: [
      { title: "Monopolar RF", body: "Energy passes between the treatment handpiece and a return electrode, allowing broader and deeper volumetric heating." },
      { title: "Bipolar RF", body: "Energy travels between two electrodes positioned close together, concentrating heat more superficially within the treatment area." },
      { title: "Multipolar RF", body: "Several electrodes distribute energy through multiple pathways for controlled, even heating." },
      { title: "Dynamic RF", body: "The handpiece moves continuously while temperature is monitored to create uniform warmth across the area." },
    ],
    bestFor: [
      "Mild skin laxity",
      "Fine lines and wrinkles",
      "Loss of facial firmness",
      "Softening of jawline definition",
      "Crepey-looking skin",
      "Clients seeking progressive, non-surgical rejuvenation",
    ],
    benefits: [
      "Firmer and smoother-looking skin",
      "Progressive collagen and elastin remodelling",
      "Improved appearance of mild laxity",
      "More refined facial contours",
      "Non-invasive treatment with limited downtime",
      "Suitable for a planned rejuvenation course",
    ],
    before:
      "Arrive with clean skin and avoid applying heavy oils. We complete a skin scan and facial analysis, record the treatment baseline and select the RF configuration, energy level and temperature targets for the treatment area.",
    during:
      "A conductive gel or treatment medium is applied. The handpiece is moved across the skin in a controlled pattern while tissue temperature is built and maintained within the device protocol. Clients feel deep, comfortable warmth rather than surface burning.",
    after:
      "Temporary warmth, pinkness or mild tenderness can occur. The skin often feels tighter immediately, while the main remodelling response develops gradually over the following weeks. Hydration and sunscreen are recommended.",
    recommendation:
      "A course of approximately 4–8 sessions at 1–4 week intervals is commonly used. The exact schedule depends on the RF system, treated area, skin condition and desired degree of firming, followed by periodic maintenance.",
  },
  {
    slug: "high-frequency",
    name: "High Frequency",
    fullName: "High Frequency (HF) Facial Therapy",
    tagline: "A traditional finishing step for congested skin",
    summary:
      "Used after cleansing or extraction to refresh, condition and temporarily energise the skin. Popular in oily and blemish-prone protocols.",
    overview:
      "High Frequency facial therapy is a traditional non-invasive technology used after cleansing or extraction to refresh, condition and temporarily energise the skin. It is especially popular in professional protocols for oily, congested and blemish-prone skin.",
    howItWorks:
      "A glass electrode filled with inert gas carries a high-frequency alternating current. When placed on or just above the skin, it creates a mild electrical discharge and a small amount of local warmth. The effect is superficial and is used to complement cleansing and skin-conditioning protocols.",
    modes: [
      { title: "Direct technique", body: "The glass electrode glides across the skin for an even warming and conditioning effect." },
      { title: "Sparking technique", body: "The electrode is briefly lifted over an individual blemish to create a stronger pinpoint surface effect." },
      { title: "Argon/violet electrode", body: "Commonly selected for oily and blemish-prone skin protocols." },
      { title: "Neon/orange electrode", body: "Commonly selected for general revitalising and complexion-focused protocols." },
    ],
    bestFor: [
      "Oily or congested skin",
      "Blemish-prone areas",
      "Post-extraction facial care",
      "Dull-looking skin",
      "Clients seeking a traditional facial finishing technology",
    ],
    benefits: [
      "Complements professional cleansing and extraction",
      "Creates a fresh, energised skin appearance",
      "Provides a gentle warming and tingling sensation",
      "Targets selected blemish-prone areas",
      "Quick treatment with no recovery period",
    ],
    before:
      "We begin with skin scanning and analysis, professional cleansing and, in selected congestion-focused facials, controlled facial steam to soften sebum and surface buildup. The skin is then dried thoroughly and prepared for the selected glass electrode.",
    during:
      "The practitioner places a selected glass electrode on the skin and increases intensity gradually. The electrode glides continuously or is used briefly over selected areas. A mild buzzing, tingling sensation and characteristic scent can be noticed.",
    after:
      "Skin can appear lightly flushed and refreshed. Normal activities resume immediately. Hydrating, calming products and sunscreen are applied according to the facial protocol.",
    recommendation:
      "High Frequency is commonly included within a facial rather than used as a stand-alone course. Frequency is based on oiliness, congestion, skin response and the broader facial plan.",
  },
  {
    slug: "ultrasound",
    name: "Ultrasound / Sonophoresis",
    fullName: "Ultrasound and Sonophoresis",
    tagline: "Sound-wave conditioning and product infusion",
    summary:
      "Uses sound-wave energy to condition the skin and improve delivery of selected topical ingredients.",
    overview:
      "Cosmetic ultrasound uses sound-wave energy to condition the skin and improve delivery of selected topical ingredients. Sonophoresis is the product-infusion application of ultrasound and is used for hydration, radiance and skin-support protocols.",
    howItWorks:
      "An ultrasound handpiece produces rapid mechanical vibrations above the range of human hearing. These vibrations create gentle pressure changes and micro-massage within the contact medium. Sonophoresis temporarily increases skin permeability through mechanical effects, improving movement of compatible ingredients across the outer barrier.",
    modes: [
      { title: "Ultrasound skin conditioning", body: "Provides gentle mechanical stimulation and supports a refreshed appearance." },
      { title: "Sonophoresis infusion", body: "Improves delivery of compatible hydrating, antioxidant or calming ingredients." },
      { title: "Facial application", body: "Treats dry, dull or environmentally stressed skin." },
      { title: "Scalp application", body: "Supports even distribution of compatible scalp-conditioning products." },
    ],
    bestFor: [
      "Dry or dehydrated skin",
      "Dull or rough-looking texture",
      "Skin needing improved topical hydration",
      "Sensitive clients seeking a gentle non-invasive treatment",
      "Facial and scalp-conditioning programs",
    ],
    benefits: [
      "Improved delivery of compatible topical ingredients",
      "Softer and more hydrated skin",
      "Gentle micro-massage effect",
      "Non-invasive and comfortable",
      "Little to no downtime",
      "Easy integration with professional facial protocols",
    ],
    before:
      "We begin with a skin or scalp scan and analysis. Selected hydration and scalp-care protocols include controlled professional steam before cleansing. A compatible conductive gel or serum is then selected and applied evenly for efficient sound-wave transfer.",
    during:
      "The practitioner moves the ultrasound probe continuously across the treatment area. Clients usually feel gentle movement and mild warmth. The handpiece must remain coupled to the skin throughout treatment.",
    after:
      "The skin feels smooth, hydrated and refreshed. Any remaining product is massaged in before moisturiser and sunscreen are applied. Normal activity can resume immediately.",
    recommendation:
      "Ultrasound or sonophoresis can be used weekly during an intensive hydration course or incorporated into regular monthly facials according to the selected ingredients and skin goals.",
  },
  {
    slug: "led",
    name: "LED Light Therapy",
    fullName: "LED Light Therapy for Facial Skin",
    tagline: "Non-invasive photobiomodulation for targeted skin support",
    summary:
      "Selected wavelengths of visible or near-infrared light support biological activity within the skin, with little to no downtime.",
    overview:
      "Light-emitting diode phototherapy, also known as photobiomodulation, is a non-invasive treatment that uses selected wavelengths of visible or near-infrared light to support biological activity within the skin. It does not remove or damage the skin surface and requires little to no downtime.",
    bestFor: ["Acne", "Redness", "Rejuvenation", "Recovery", "Pigmentation", "Skin radiance"],
    howItWorks:
      "Skin cells contain light-sensitive molecules called chromophores. When the selected wavelength reaches its target, light energy influences cellular signalling, mitochondrial activity, inflammatory pathways and repair processes. Wavelength determines penetration depth and biological target; treatment dose depends on irradiance, treatment time and distance from the device.",
    lights: [
      { title: "Blue light — Acne-focused treatment", items: ["Mild inflammatory acne", "Acne-prone and oily skin", "Red or inflamed blemishes", "Congestion-focused facials", "Combination red-and-blue acne protocols"] },
      { title: "Red light — Rejuvenation and repair", items: ["Fine lines and wrinkles", "Dull-looking skin", "Uneven texture", "General rejuvenation", "Post-treatment skin support", "Visible inflammation and redness"] },
      { title: "Amber/Yellow light — Radiance and complexion", items: ["Reduced radiance", "Visible redness", "Uneven-looking complexion", "Signs of photoageing", "Fine surface lines", "Calming and glow-focused protocols"] },
      { title: "Green light — Pigmentation and complexion", items: ["Uneven-looking skin tone", "Visible pigmentation", "General complexion support", "Calming and soothing protocols", "Combination brightening facials"] },
      { title: "Near-infrared light — Deeper photobiomodulation", items: ["Skin recovery and repair support", "Collagen-focused rejuvenation", "Post-procedure protocols", "Scalp and hair-support programs", "Combination red and near-infrared treatments"] },
    ],
    wavelengths: [
      { light: "Blue", swatch: "#3b6fd4", nm: "400–470 nm", use: "Acne-prone skin", does: "Targets acne-associated C. acnes and supports reduction of inflammatory blemishes." },
      { light: "Green", swatch: "#4aa06a", nm: "500–570 nm", use: "Pigmentation and complexion", does: "Used in cosmetic protocols for uneven-looking tone and complexion support." },
      { light: "Amber/Yellow", swatch: "#e0b552", nm: "570–590 nm", use: "Radiance and redness", does: "Used for glow-focused, redness and photoageing protocols." },
      { light: "Red", swatch: "#c8503f", nm: "630–660 nm", use: "Rejuvenation and repair", does: "A well-studied range for photobiomodulation, skin rejuvenation and inflammation support." },
      { light: "Red + Blue", swatch: "#8452c8", nm: "Approx. 415 + 633 nm", use: "Acne combination", does: "Combines acne-focused blue light with the rejuvenating and calming role of red light." },
      { light: "Near-infrared", swatch: "#7d3a3a", nm: "800–850 nm", use: "Deeper photobiomodulation", does: "Penetrates beyond visible red light and supports deeper repair, recovery and rejuvenation pathways." },
    ],
    benefits: [
      "Non-invasive and comfortable",
      "No intentional skin damage",
      "Little to no downtime",
      "Supports acne, redness and rejuvenation protocols",
      "Useful before or after selected procedures",
      "Suitable as a stand-alone treatment or part of a facial program",
      "Can be customised through wavelength and dose selection",
    ],
    before:
      "We begin with skin scanning and analysis, cleanse the skin and remove products that block light. We then select the wavelength, dose, treatment time and eye protection for the client's acne, rejuvenation, redness or recovery goals.",
    during:
      "Protective eyewear is fitted and the LED panel is positioned at the correct distance. The selected light operates for a measured time. Clients usually feel gentle warmth and rest comfortably throughout treatment.",
    after:
      "The skin usually feels calm and comfortable, with no recovery period. Moisturiser and sunscreen are applied as appropriate, and normal activity can resume immediately.",
    recommendation:
      "An intensive course of 1–3 sessions weekly for 4–8 weeks is commonly used, followed by maintenance sessions. Wavelength, dose and frequency are matched to acne, rejuvenation, redness, recovery or scalp goals.",
  },
  /* Added 28 Sep 2026 from the client's note. Copy is exact and deliberately
     restrained — explanatory, not therapeutic. Do not strengthen it into
     claims (penetration, absorption, growth or removal outcomes). */
  {
    /* Rewritten 28 Sep 2026 from the clinic's clarification: controlled heat
       (mild hyperthermia, ~39–45°C) temporarily increases stratum corneum
       permeability to accelerate transdermal delivery. Customer-facing voice.
       Do not add rates, percentages or outcome claims. */
    slug: "hyperthermia-dermal-penetration",
    name: "Hyperthermia Dermal Penetration",
    fullName: "Hyperthermia Dermal Penetration Technology",
    tagline: "Controlled heat for enhanced transdermal delivery",
    summary:
      "Uses mild, controlled hyperthermia to temporarily increase the permeability of your skin barrier and support faster transdermal delivery of selected compounds.",
    overview:
      "Hyperthermia Dermal Penetration Technology uses controlled heat to temporarily increase the permeability of your skin's outer barrier. By raising your skin temperature into a mild hyperthermic range, typically around 39°C to 45°C, the stratum corneum becomes more permeable. This can accelerate the transdermal movement of selected drugs, therapeutic agents or cosmetic compounds across your skin barrier.",
    howItWorks:
      "The stratum corneum normally acts as the primary barrier that limits substances entering through your skin. Controlled hyperthermia temporarily alters this barrier function. As your skin temperature rises within the mild hyperthermic range of approximately 39°C to 45°C, the permeability of the stratum corneum increases, allowing selected compounds to move through your skin more readily. This effect is temporary and is used as part of a controlled transdermal-delivery protocol.",
    modes: [
      { title: "Cosmetic compound delivery", body: "Uses controlled hyperthermia to temporarily increase your skin's permeability and support transdermal delivery of selected cosmetic compounds." },
      { title: "Therapeutic compound delivery", body: "The temporary increase in permeability may be used within an appropriate treatment protocol to support delivery of selected therapeutic compounds through your skin." },
      { title: "Drug-delivery application", body: "Hyperthermia-assisted penetration can be used as a transdermal-delivery approach for selected drugs where this forms part of an appropriate clinical protocol for you." },
      { title: "Controlled hyperthermic protocol", body: "Your skin temperature is raised into a mild hyperthermic range, typically around 39°C to 45°C, to temporarily increase barrier permeability during the delivery phase." },
    ],
    bestFor: [
      "Transdermal-delivery protocols using compatible topical compounds",
      "Cosmetic compound delivery through your skin barrier",
      "Selected therapeutic-delivery applications",
      "Protocols where temporary enhancement of your skin permeability is desired",
      "Controlled hyperthermia-assisted topical delivery",
    ],
    benefits: [
      "Temporarily increases the permeability of your stratum corneum",
      "Supports faster transdermal movement of selected compounds",
      "Uses controlled mild hyperthermia rather than uncontrolled heating",
      "Can support delivery of selected cosmetic or therapeutic compounds",
      "Provides a controlled way to temporarily modify skin-barrier permeability",
    ],
    before:
      "Before your treatment, your practitioner reviews the compound being delivered, your treatment area and whether a hyperthermia-assisted transdermal protocol is suitable for you. Treatment parameters are then selected according to your intended application.",
    during:
      "During your treatment, controlled heat is applied to the selected area of your skin. Your skin temperature is raised into a mild hyperthermic range, typically around 39°C to 45°C. At this temperature, the stratum corneum becomes temporarily more permeable, supporting the transdermal movement of the selected compound.",
    after:
      "After the controlled hyperthermic phase ends, the increase in your skin-barrier permeability is temporary. Your treatment then continues according to the selected transdermal-delivery protocol and any required finishing care.",
    recommendation:
      "Hyperthermia Dermal Penetration is used as part of a selected transdermal-delivery protocol rather than as a stand-alone cosmetic treatment. Whether it is suitable for you depends on the compound being delivered, your treatment area and the intended application.",
  },
  {
    /* The client's source wording was "ion charged pulse polarity
       [iontophoresis] technology"; the public name is simply Iontophoresis. */
    slug: "iontophoresis",
    name: "Iontophoresis",
    fullName: "Iontophoresis — Ion-Driven Product Infusion",
    tagline: "Polarity-assisted application of compatible topical ingredients",
    summary:
      "Uses a mild controlled electrical current to support the movement of compatible ionised topical ingredients during selected skin or scalp treatments.",
    overview:
      "Iontophoresis is a non-invasive technology that uses a mild controlled electrical current and polarity to support the movement of compatible ionised topical ingredients across the treatment area. It can be incorporated into selected facial or scalp protocols when suitable products and treatment goals are identified during consultation.",
    howItWorks:
      "A controlled direct electrical current is applied through suitable electrodes or a treatment handpiece together with a compatible ionised product. Electrical polarity is selected according to the formulation and protocol. Intensity is increased gradually and kept within a comfortable treatment range.",
    modes: [
      { title: "Positive-polarity protocol", body: "Uses positive polarity with a compatible formulation when specified by the treatment protocol." },
      { title: "Negative-polarity protocol", body: "Uses negative polarity with a compatible formulation when specified by the treatment protocol." },
      { title: "Facial application", body: "Can be incorporated into selected facial protocols using compatible topical ingredients." },
      { title: "Scalp application", body: "Can be incorporated into selected scalp-conditioning protocols using compatible topical products." },
    ],
    bestFor: [
      "Selected topical-infusion protocols",
      "Facial skin-conditioning treatments",
      "Scalp-conditioning treatments",
      "Clients seeking a needle-free technology option",
      "Combination treatment programs",
    ],
    benefits: [
      "Non-invasive and needle-free",
      "Controlled electrical intensity",
      "Supports application of compatible ionised topical ingredients",
      "Can be used in facial or scalp protocols",
      "Integrates with selected professional treatments",
    ],
    before:
      "The treatment area is assessed and cleansed, and the practitioner reviews suitability before selecting the formulation, polarity and electrical settings. Only products compatible with the protocol should be used.",
    during:
      "A compatible product is applied and the treatment handpiece or electrodes deliver a mild controlled current. Clients may notice light tingling while intensity is adjusted gradually for comfort.",
    after:
      "The remaining product is incorporated according to the treatment protocol. Mild temporary tingling or redness may occur, and appropriate finishing skincare or scalp care is applied where required.",
    recommendation:
      "Iontophoresis is used within selected professional treatments rather than booked independently. Whether it is included, and how often, is determined according to the treatment area, selected product and consultation.",
  },
];

export function technologyBySlug(slug: string) {
  return skinTechnologies.find((t) => t.slug === slug);
}

/* =============================================================================
   D. ADVANCED COMPOUNDS & MEDICINAL COSMETICS — reference only, not bookable.
   ========================================================================== */

export type Compound = { slug: string; name: string; body: string };

export const compoundsIntro =
  "Professional skincare combines proven cosmetic ingredients with carefully selected advanced formulations. Product choice depends on skin type, barrier condition, allergies, pregnancy or breastfeeding, other treatments and the intended route of application. Products used on intact skin are not automatically suitable for injection, microneedling channels, electroporation or ultrasound-assisted delivery.";

export const compounds: Compound[] = [
  { slug: "aha-bha", name: "AHA and BHA exfoliants", body: "Alpha-hydroxy acids such as glycolic and lactic acid loosen bonds between surface skin cells to improve brightness, smoothness and visible pigmentation. Salicylic acid is oil-soluble and works within congested pores, making it useful for oily and blemish-prone skin." },
  { slug: "niacinamide", name: "Niacinamide", body: "Niacinamide, a form of vitamin B3, supports the skin barrier, reduces transepidermal water loss, improves uneven-looking tone and helps regulate the appearance of oiliness and redness. It combines well with many treatment plans." },
  { slug: "retinol", name: "Retinol", body: "Retinol is a cosmetic vitamin A derivative that is converted within the skin to active retinoic acid. Consistent use supports cell turnover, collagen-related processes, smoother texture and improvement in fine lines and uneven pigmentation." },
  { slug: "pdrn", name: "PDRN and polynucleotides", body: "Polydeoxyribonucleotide and polynucleotide formulations contain purified DNA fragments. They are promoted for skin conditioning, hydration and repair-related signalling. Early clinical literature reports improvements in selected skin-quality measures, but products and protocols are not interchangeable." },
  { slug: "peptides", name: "Peptides", body: "Cosmetic peptides are short amino-acid chains designed to support signalling, hydration or barrier function. The effect depends on peptide sequence, stability, concentration and delivery system. Well-formulated peptide products support smoother, better-conditioned skin." },
  { slug: "exosome", name: "Exosome-related technology", body: "Exosomes are extracellular vesicles involved in cell-to-cell communication. This promising area of cosmetic science is being developed for skin renewal, repair signalling and support of healthy follicle activity." },
  { slug: "stem-cell", name: "Stem-cell-related cosmetic technology", body: "Cosmetic language such as 'stem-cell technology' usually refers to plant-cell extracts, conditioned media or laboratory-derived ingredients rather than living human stem-cell treatment. These formulations are used for antioxidant, moisturising or skin-conditioning purposes according to their actual ingredients." },
  { slug: "oils", name: "Nutritive and essential oils", body: "Selected plant oils provide emollient lipids that soften dry skin and reduce moisture loss. Essential oils provide aromatic plant compounds and are used only at appropriate dilution for a sensory or conditioning role." },
];

/* =============================================================================
   E. SHARED TREATMENT / CLINIC INFORMATION
   -----------------------------------------------------------------------------
   Written once and referenced from every treatment, so consultation, scanning
   and general-aftercare paragraphs are never duplicated page to page.
   Treatment-SPECIFIC aftercare stays on the individual treatment.
   ========================================================================== */

export type SharedInfo = { slug: string; name: string; body?: string; list?: string[] };

export const sharedInfo: SharedInfo[] = [
  {
    slug: "approach",
    name: "About our treatment approach",
    body: "Every skin and scalp responds differently. Our treatments begin with a consultation with our medical team to assess your concerns, medical conditions, treatment history, current products and treatment goals. Our practitioners then select an appropriate procedure, device settings and topical medicinal or cosmetics products for your individual needs.",
  },
  {
    slug: "scan",
    name: "Skin and scalp scan and analysis",
    body: "Relevant treatments begin with professional skin or scalp scanning and analysis. Magnified imaging allows us to examine features that are difficult to assess with the unaided eye, including surface texture, hydration patterns, oil distribution, visible congestion, pigmentation, redness, pore appearance, scalp buildup, follicular openings and the pattern of hair thinning. The analysis gives us a clear baseline for selecting products, device settings and treatment priorities and supports consistent photographic progress reviews.",
  },
  {
    slug: "steam",
    name: "Facial and scalp steam preparation",
    body: "Selected facial and scalp treatments begin with controlled professional steam. Warm vapour softens surface buildup, sebum and debris, supports thorough cleansing and prepares the treatment area for extraction, hydration, infusion or scalp care. Steam time and temperature are adjusted to the treatment area and protocol for a comfortable, effective preparation stage.",
  },
  {
    slug: "consultation",
    name: "Your consultation",
    list: [
      "Your goals, skin or scalp condition and treatment history",
      "Relevant medical conditions, allergies, pregnancy or breastfeeding",
      "Prescription and non-prescription medicines and supplements",
      "Recent cosmetic, dental, laser or surgical procedures",
      "Current skincare, scalp products and history of reactions",
      "Baseline photographs with your consent",
    ],
  },
  {
    slug: "results",
    name: "Understanding results",
    body: "Some treatments produce immediate surface improvements in hydration, smoothness or radiance. Collagen remodelling and hair-cycle changes develop gradually. Results vary with diagnosis, baseline condition, age, sun exposure, smoking, hormones, nutrition, medicines, home care and adherence to the recommended course. No cosmetic procedure can guarantee a particular result.",
  },
  {
    slug: "aftercare",
    name: "General aftercare principles",
    list: [
      "Follow the treatment-specific instructions provided by your practitioner.",
      "Protect treated skin from ultraviolet exposure every day.",
      "Keep hands, pillowcases, towels and treatment areas clean.",
      "Restart active skincare only when advised and after the barrier has recovered.",
      "Seek prompt advice for increasing pain, spreading redness, marked swelling, blistering, pus, fever, visual symptoms or any unexpected reaction.",
    ],
  },
];
