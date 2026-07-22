/* =============================================================================
   PRACTITIONERS — premium staff module data structure.
   -----------------------------------------------------------------------------
   The clinic team (per brief): ONE DERMAL THERAPIST + TWO DERMAL SPECIALISTS.
   Exact names, photos, qualifications and AHPRA details are PENDING.
   These are elegant PLACEHOLDERS — swap fields as real details arrive.
   TODO(client): provide names, portraits, qualifications, AHPRA registration.
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
  isPlaceholder: boolean;
};

export const practitioners: Practitioner[] = [
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
    specialties: ["Hydra treatments", "Head spa rituals", "Skin vitality"],
    languages: ["English"],
    bio:
      "A dermal therapist delivering restorative treatments and ritual-led experiences with warmth and precision. Full profile to be added.",
    treatments: ["hydra", "head-spa", "hair-recovery"],
    image: undefined,
    isPlaceholder: true,
  },
];
