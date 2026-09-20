/* =============================================================================
   PRACTITIONERS — premium staff module data structure.
   -----------------------------------------------------------------------------
   PUBLIC RENDERING RULE (client feedback, Sep 2026): only entries with
   `isPlaceholder: false` are shown on the website. The clinic is recruiting
   and prospective practitioners may visit, so unfinished profiles must never
   appear publicly. The placeholder entries below are kept privately as the
   structure for future confirmed people — flip `isPlaceholder` to false ONLY
   once the client has supplied that person's real details.

   The clinic team (per brief): ONE DERMAL THERAPIST + TWO DERMAL SPECIALISTS,
   details PENDING. TODO(client): names, portraits, qualifications, AHPRA.
   ========================================================================== */

export type Practitioner = {
  slug: string;
  name: string;
  role: string;
  qualifications: string[];
  registration?: string;    // e.g. AHPRA number — shown only when provided
  specialties: string[];
  languages: string[];
  bio: string;
  treatments: string[];     // treatment/package slugs offered
  image?: string;           // portrait path; falls back to elegant initial mark
  /** Exact, factual alt text for the portrait. Falls back to "Name, Role". */
  imageAlt?: string;
  isPlaceholder: boolean;
};

export const practitioners: Practitioner[] = [
  /* CLIENT-CONFIRMED (16 Sep 2026): photograph and role supplied by the client.
     Only the name and public role are shown. Qualifications, registration,
     specialties, languages and biography are deliberately empty — none were
     supplied, and none may be invented. PractitionerCard omits empty fields.
     Source: reclinicphotoss/original-148414D9-…jpeg */
  {
    slug: "ken",
    name: "Kenneth Romero",
    role: "Medical Director / Head of Practice",
    qualifications: [],
    registration: undefined,
    specialties: [],
    languages: [],
    bio: "",
    treatments: [],
    image: "/media/clinic/practitioner-ken.jpg",
    imageAlt: "Kenneth Romero, Medical Director and Head of Practice at Regenerate Skin & Hair Clinic",
    isPlaceholder: false,
  },
  /* CLIENT-CONFIRMED (20 Sep 2026): name, role and portrait supplied by the
     client. Only the name and public role are shown. "Facial Surgeon" is a
     professional title — no qualifications, FRACS/surgical credentials, AHPRA
     registration, specialties, biography, languages or experience are
     inferred from it or from the photograph. All such fields are empty until
     the client supplies them. */
  {
    slug: "david-nguyen",
    name: "David Nguyen",
    role: "Clinical Director / Facial Surgeon",
    qualifications: [],
    registration: undefined,
    specialties: [],
    languages: [],
    bio: "",
    treatments: [],
    image: "/media/clinic/practitioner-david-nguyen.jpg",
    imageAlt: "David Nguyen, Clinical Director and Facial Surgeon at Regenerate Skin & Hair Clinic",
    isPlaceholder: false,
  },
  {
    slug: "dermal-specialist-1",
    name: "Dermal Specialist",
    role: "Dermal Specialist",
    qualifications: ["Qualification pending confirmation"],
    registration: undefined, // TODO(client): AHPRA registration number if applicable
    specialties: ["Skin rejuvenation", "Acne & congestion", "Micro-needling"],
    languages: ["English"], // TODO(client): confirm additional languages
    bio:
      "A dedicated dermal specialist focused on concern-led skin programs and considered, individualised care. Full profile to be added.",
    treatments: ["skin-reclaim", "clear-skin-ground-zero", "forever-twenty"],
    image: undefined,
    isPlaceholder: true,
  },
  {
    slug: "dermal-specialist-2",
    name: "Dermal Specialist",
    role: "Dermal Specialist",
    qualifications: ["Qualification pending confirmation"],
    registration: undefined,
    specialties: ["Hair & scalp support", "Mesotherapy", "Recovery pathways"],
    languages: ["English"],
    bio:
      "A dermal specialist supporting hair and scalp pathways with a calm, methodical approach. Full profile to be added.",
    treatments: ["lift-camp-2", "lift-camp-1", "return-of-a-hero"],
    image: undefined,
    isPlaceholder: true,
  },
  {
    slug: "dermal-therapist-1",
    name: "Dermal Therapist",
    role: "Dermal Therapist",
    qualifications: ["Qualification pending confirmation"],
    registration: undefined,
    specialties: ["HydraFacial", "ScalpSpa rituals", "Skin vitality"],
    languages: ["English"],
    bio:
      "A dermal therapist delivering restorative treatments and ritual-led experiences with warmth and precision. Full profile to be added.",
    treatments: ["hydrafacial", "scalpspa", "hydrascalp"],
    image: undefined,
    isPlaceholder: true,
  },
];
