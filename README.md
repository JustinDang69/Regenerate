# Regenerate Skin & Hair Clinic — Website (Phase One Foundation)

A premium, medically-credible marketing website for a Melbourne skin & hair clinic.
Built as a **bespoke foundation** — clarity, trust, conversion and visual excellence
first — structured to grow into an award-level site without rebuilding the base.

> **Positioning:** medical clinic + luxury aesthetic. Calm, scientific, elegant, modern.
> Concern-led journeys → treatment pathway → package/single treatment → practitioner
> trust → booking.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (token-driven, `@theme` in `globals.css`)
- **next/font** — Cormorant Garamond (display serif) + Manrope (UI sans)
- **GSAP + ScrollTrigger** (hero/ambient motion) + **Lenis** (smooth scroll)
- Zero heavyweight UI libraries — all primitives are custom & brand-specific
- Reduced-motion respected everywhere; SEO metadata + JSON-LD + sitemap/robots/manifest

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (type-checks + lints)
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```

### Brand / logo assets

```bash
node scripts/generate-logo-assets.mjs   # SVG masters → public/brand
node scripts/export-raster-assets.mjs   # PNG/WebP/favicons/OG (needs sharp)
```

## Project structure

```
src/
  app/                     # routes (App Router)
    page.tsx               # Home
    skin/ hair/            # concern-led treatment pages
    pricing/               # packages + single treatments
    about/ contact/        # about (clinic + practitioners), contact/book
    products/              # product info (no ecommerce)
    legal/                 # privacy · terms · cancellation (placeholders)
    journal/README.md      # PHASE-TWO blog placeholder (not wired up)
    layout.tsx             # fonts, metadata, JSON-LD, chrome
    globals.css            # ← DESIGN TOKENS + type scale + motion primitives
    sitemap.ts robots.ts manifest.ts not-found.tsx
  components/
    brand/                 # Logo, DandelionMark, Divider, MotifLayer
    ui/                    # Container, Section, Button, SectionHeader, ImageFrame, Prose
    layout/                # Header (+ mobile drawer), Footer, StickyCTA
    sections/              # Hero, PageHero, SplitEditorial, ConcernSection,
                           # CTABlock, TrustStrip, LocationBlock, PricingNav
    cards/                 # ConcernCard, PackageCard, TreatmentCard,
                           # PractitionerCard, TechBlock
    forms/                 # ContactForm (foundation — wire to real handler)
    motion/                # SmoothScroll (Lenis), Reveal (IntersectionObserver)
  content/                 # ← SWAPPABLE CONTENT: packages, concerns,
                           #    technologies, practitioners
  lib/                     # site config (nav/NAP/CTA), motion/gsap singleton
public/brand/              # logo asset package (SVG/PNG/WebP/favicon/OG) + README
scripts/                  # logo asset generators
docs/IMPLEMENTATION.md     # full deliverables write-up + content dependencies
```

## Key principles baked in

- **Everything is data-driven.** Prices, concerns, technologies, practitioners, nav and
  NAP details live in `src/content/*` and `src/lib/site.ts`. Swap content without touching UI.
- **Design tokens are the single source of truth** (`globals.css`). Change a colour once.
- **Compliance-safe copy.** Supportive framing only ("supports / designed to address /
  results vary / confirmed in consultation"). No guarantees, no before/after, no
  named injectables. Search the codebase for `COMPLIANCE`, `TODO(client)` and
  `reviewFlag` for every item needing review.
- **Booking is everywhere** (header, hero, cards, mid-page, sticky mobile, footer) —
  never buried.

## Before launch — see `docs/IMPLEMENTATION.md`

Unresolved content dependencies (logo source, practitioner details, phone number,
photography, legal copy) and all compliance review markers are catalogued there.
