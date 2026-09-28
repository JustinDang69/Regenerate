/* =============================================================================
   SITE CONFIG — single source of truth for brand, navigation, and NAP details.
   Swap values here to update the header, footer, contact page, and metadata.
   ========================================================================== */
import { SERVICE_BY_TREATMENT_SLUG, serviceParamForTreatment } from "@/lib/bookings/service-map";

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
    /* PUBLIC email — shown in the footer, contact page and structured data.
       Not to be replaced with the reception mailbox. */
    email: "hello@regenerateskinhairclinic.com.au",
    /* Enquiry-PROCESSING mailbox — the destination for the website enquiry
       form (and its direct-email fallback). Not displayed as the public
       contact address. Mirrors ENQUIRY_MAILBOX on the server. */
    enquiryEmail: "reception@regenerateskinhairclinic.com.au",
    /* CLIENT-CONFIRMED public number (Sep 2026). `phone` is the tel: href
       value (digits only so every dialler accepts it); `phoneDisplay` is the
       human-readable form. Header, footer, contact page and the JSON-LD
       structured data all read these two values. */
    phone: "1800866888",
    phoneDisplay: "1800 866 888",
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

/* -----------------------------------------------------------------------------
   Treatment links for nav groups 05 and 06.

   An INTENTIONAL duplicate of access, not of data (client brief 28 Sep 2026):
   these are the treatment pages that used to sit under the old Treatments
   menu. Labels come from SERVICE_BY_TREATMENT_SLUG — the same canonical names
   the booking form shows — so a treatment is never named in two places, and
   the slugs are the existing /treatments/[slug] pages.
   -------------------------------------------------------------------------- */
const SKIN_TREATMENT_SLUGS = ["facial-microneedling", "facial-mesotherapy", "hydrafacial", "facespa"];
const HAIR_TREATMENT_SLUGS = ["scalp-microneedling", "scalp-mesotherapy", "hydrascalp-therapy", "scalpspa"];

function treatmentLinks(slugs: string[]) {
  return slugs.map((slug) => ({ label: SERVICE_BY_TREATMENT_SLUG[slug] ?? slug, href: `/treatments/${slug}` }));
}

/* Numbering (01, 02 …) in the menu is derived from array position in the
   Header, so the order below IS the numbering. */
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  /* 02 — formerly "Treatments". The index page moved to /concerns; /treatments
     redirects there (next.config.ts). */
  {
    label: "Concerns",
    href: "/concerns",
    children: [
      { label: "Skin Concerns", href: "/concerns#skin-concerns" },
      { label: "Hair Concerns", href: "/concerns#hair-concerns" },
      {
        label: "Skin and Scalp Technologies",
        href: "/concerns#technologies",
        hint: "Applied within treatments",
      },
    ],
  },
  {
    label: "Skin",
    href: "/skin",
    children: [
      { label: "Skin Treatments", href: "/skin", hint: "Concern-led pathways" },
      { label: "Rejuvenation & Aging", href: "/skin#rejuvenation" },
      { label: "Scarring & Texture", href: "/skin#scarring" },
      { label: "Pigmentation & Brightening", href: "/skin#pigmentation" },
      { label: "Acne & Congestion", href: "/skin#acne" },
    ],
  },
  {
    label: "Hair",
    href: "/hair",
    children: [
      { label: "Hair Treatments", href: "/hair", hint: "Scalp & hair support" },
      { label: "Hair thinning + Hair loss", href: "/hair#thinning" },
      { label: "Scalp health", href: "/hair#scalp" },
      { label: "Hair greying", href: "/hair#grey" },
    ],
  },
  /* 05 / 06 — the individual treatments, by area. */
  {
    label: "Skin Treatments",
    href: "/concerns#skin-treatments",
    children: treatmentLinks(SKIN_TREATMENT_SLUGS),
  },
  {
    label: "Hair Treatments",
    href: "/concerns#hair-scalp-treatments",
    children: treatmentLinks(HAIR_TREATMENT_SLUGS),
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
  /* CLIENT REVISION (Sep 2026): booking CTA wording is "Book Appointment"
     everywhere it appears publicly. Changing it here changes it site-wide —
     header, hero, cards, treatment pages and the mobile drawer all read this. */
  book: "Book Appointment",
  enquire: "Enquire Now",
  exploreSkin: "Explore Skin Treatments",
  exploreHair: "Explore Hair Treatments",
  bookHref: "/contact#book",
  enquireHref: "/contact#enquire",
} as const;

/* -----------------------------------------------------------------------------
   Booking CTA links.

   `cta.bookHref` is the GENERIC booking link — header, hero, footer, sticky
   CTA, packages and 404. It opens the booking form with no treatment chosen.

   `bookHrefFor(slug)` is for a CTA attached to a SPECIFIC treatment. It adds
   `?service=<website slug>`, which BookingForm resolves against the live
   Bookings service list. There is one form, not one per treatment. A slug with
   no Bookings counterpart falls back to the generic link, so a CTA can never
   preselect the wrong treatment.
   -------------------------------------------------------------------------- */
export function bookHrefFor(treatmentSlug: string | undefined | null): string {
  if (!treatmentSlug) return cta.bookHref;
  const param = serviceParamForTreatment(treatmentSlug);
  return param ? `/contact?service=${encodeURIComponent(param)}#book` : cta.bookHref;
}

/* Footer link groups. */
export const footerNav = {
  treatments: [
    { label: "Skin Treatments", href: "/skin" },
    { label: "Hair Treatments", href: "/hair" },
    { label: "Treatment Guide", href: "/concerns" },
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
