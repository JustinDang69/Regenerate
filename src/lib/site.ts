/* =============================================================================
   SITE CONFIG — single source of truth for brand, navigation, and NAP details.
   Swap values here to update the header, footer, contact page, and metadata.
   ========================================================================== */

export const site = {
  name: "Regenerate Skin & Hair Clinic",
  shortName: "Regenerate",
  /* CLIENT REVISION: the previous "Skin Science · Hair Restoration Support" line
     was removed sitewide. This short descriptor draws on the client's confirmed
     brand note ("Regenerate refers to restoring and reviving beauty") and is kept
     distinct from the hero tagline to avoid repetition. */
  tagline: "Restoring and reviving, with calm confidence.",
  /* CLIENT REVISION (Sep 2026): exact wording from the client's business card.
     Single source of truth for the homepage hero headline — see Hero.tsx.
     Do not rewrite, do not change "Your" to "the", do not append other copy. */
  heroTagline: "Forever Celebrating Your 20s",
  // NOTE(compliance): keep the top-line descriptor supportive, non-guaranteeing.
  description:
    "A Melbourne clinic blending medical credibility with luxury care — concern-led skin and hair programs, guided by qualified practitioners.",
  locale: "en-AU",
  url: "https://www.regenerateskinhairclinic.com.au", // TODO(client): confirm final domain.

  contact: {
    email: "hello@regenerateskinhairclinic.com.au",
    // TODO(client): confirm public phone number. Placeholder shown until provided.
    phone: "+61 3 0000 0000",
    phoneDisplay: "(03) 0000 0000",
    address: {
      line1: "443 Bell St",
      // Displayed as "Pascoe Vale South VIC 3044" — no comma between suburb and state.
      suburb: "Pascoe Vale South",
      state: "VIC",
      postcode: "3044",
      country: "Australia",
      precinct: "Melville Junction commercial precinct",
    },
    // Google Maps embed/lookup uses this formatted string (keeps the comma so the
    // Maps query continues to resolve correctly — display formatting is separate).
    mapQuery: "443 Bell St, Pascoe Vale South VIC 3044",
  },

  /* Opening hours. Format rules: no colon between day and time, lowercase am/pm
     with a preceding space. Keep consistent everywhere hours are rendered. */
  hours: [
    { days: "Monday–Friday", time: "8:30 am–7:00 pm" },
    { days: "Saturday", time: "9:00 am–6:00 pm" },
    { days: "Sunday", time: "Closed" },
  ],

  access: {
    parking: [
      "On-site parking available.",
      "Additional on-street parking on side roads — please check parking signs.",
    ],
    transport: [
      "Nearby tram stop at Melville Junction and nearby bus stops within short walking distance.",
    ],
    accessibility:
      "Please contact the clinic ahead of your visit for specific access needs.",
  },

  social: {
    // TODO(client): add real handles/URLs. Left empty so nothing renders prematurely.
    instagram: "",
    facebook: "",
  },
} as const;

/* --- Primary navigation ---------------------------------------------------
   Concern-led, trust-led ordering. Technology is explained *inside* Skin/Hair,
   never surfaced as a front-door nav item (per brief + competitor analysis). */
export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; hint?: string }[];
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Skin",
    href: "/skin",
    children: [
      { label: "Skin Treatments", href: "/skin", hint: "Concern-led pathways" },
      { label: "Acne & Congestion", href: "/skin#acne" },
      { label: "Scarring & Texture", href: "/skin#scarring" },
      { label: "Rejuvenation & Vitality", href: "/skin#rejuvenation" },
    ],
  },
  {
    label: "Hair",
    href: "/hair",
    children: [
      { label: "Hair Treatments", href: "/hair", hint: "Scalp & hair support" },
      { label: "Thinning Support", href: "/hair#thinning" },
      { label: "Scalp Health", href: "/hair#scalp" },
      { label: "Grey-Hair Pathways", href: "/hair#grey" },
    ],
  },
  {
    label: "Pricing",
    href: "/pricing",
    children: [
      { label: "Packages", href: "/pricing#packages", hint: "Multi-session programs" },
      { label: "Single Treatments", href: "/pricing#single", hint: "Individual sessions" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About the Clinic", href: "/about#clinic" },
      { label: "Practitioners", href: "/about#practitioners" },
    ],
  },
];

/* Address display helpers — single source of truth for address formatting so the
   homepage location section, Contact page and footer never drift apart.
   Format: "443 Bell St" / "Pascoe Vale South VIC 3044" (no comma before state). */
export const addressLines = [
  site.contact.address.line1,
  `${site.contact.address.suburb} ${site.contact.address.state} ${site.contact.address.postcode}`,
] as const;

/** Single-line variant, e.g. for schema.org or inline use. */
export const addressInline = addressLines.join(", ");

/* CTA labels — kept centralised so booking language stays consistent site-wide.
   NOTE: `book` is the BUTTON label only. Body copy that describes the consultation
   process still says "consultation" — do not swap that wording. */
export const cta = {
  book: "Book Now",
  enquire: "Enquire Now",
  exploreSkin: "Explore Skin Treatments",
  exploreHair: "Explore Hair Treatments",
  bookHref: "/contact#book",
  enquireHref: "/contact#enquire",
} as const;

/* Footer link groups. */
export const footerNav = {
  treatments: [
    { label: "Skin Treatments", href: "/skin" },
    { label: "Hair Treatments", href: "/hair" },
    { label: "Treatment Guide", href: "/treatments" },
    { label: "Packages", href: "/pricing#packages" },
    { label: "Single Treatments", href: "/pricing#single" },
    { label: "Products", href: "/products" },
  ],
  clinic: [
    { label: "About the Clinic", href: "/about#clinic" },
    { label: "Our Practitioners", href: "/about#practitioners" },
    { label: "Contact & Book", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Cancellation Policy", href: "/legal/cancellation" },
  ],
};
