/* =============================================================================
   SITE CONFIG — single source of truth for brand, navigation, and NAP details.
   Swap values here to update the header, footer, contact page, and metadata.
   ========================================================================== */

export const site = {
  name: "Regenerate Skin & Hair Clinic",
  shortName: "Regenerate",
  tagline: "Skin science and hair restoration support, with calm confidence.",
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
      suburb: "Pascoe Vale South",
      state: "VIC",
      postcode: "3044",
      country: "Australia",
      precinct: "Melville Junction commercial precinct",
    },
    // Google Maps embed/lookup uses this formatted string.
    mapQuery: "443 Bell St, Pascoe Vale South VIC 3044",
  },

  hours: [
    { days: "Monday – Saturday", time: "8:30am – 7:00pm" },
    { days: "Sunday", time: "Closed" },
  ],

  access: {
    parking: [
      "On-site parking available.",
      "Additional on-street parking on side roads — please check parking signs.",
    ],
    transport: [
      "Nearby tram stops along Bell St.",
      "Local bus stops within short walking distance.",
    ],
    // TODO(client): confirm accessibility details (step-free entry, accessible WC, etc.).
    accessibility:
      "Accessibility information to be confirmed. Please contact the clinic ahead of your visit for specific access needs.",
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

/* CTA labels — kept centralised so booking language stays consistent site-wide. */
export const cta = {
  book: "Book Consultation",
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
