# Regenerate Skin & Hair Clinic — Implementation & Deliverables

Phase-one foundation. This document is the written companion to the code: strategy,
design system, motion, information architecture, component inventory, the logo asset
plan, and the outstanding **client-dependent** content + compliance items.

---

## 1. Strategy summary

Regenerate must read as a **medical clinic with luxury restraint** — calm, scientific,
elegant — never a beauty-salon or a cold hospital. The foundation optimises for four
things, in order: **medical trust, luxury restraint, booking conversion, concern-led
education.**

Guiding decisions:

- **Concern-led IA, not device-led.** Real visitors think "I have acne / my hair is
  thinning", not "I want RF + EMS". Technology is explained *inside* Skin/Hair pages and
  previewed on Home — never a front-door nav item. (Confirmed by the competitor analysis
  in the brief: The Skin House, LUME, Forme et al. all translate devices into concerns.)
- **Booking is pervasive, not buried.** Persistent header CTA, hero CTA, per-package CTA,
  mid-page CTA blocks, a tasteful sticky mobile bar, and footer — matching the aggressive
  booking visibility competitors use, done with restraint.
- **Trust is structural.** A practitioner module (specialties, qualifications, AHPRA
  registration slot), a trust strip, and a strong location/access block — because for a
  new clinic, credibility + local proof *are* conversion.
- **Compliance-first copy.** Everything is framed as supportive and consultation-led. No
  guarantees, no before/after, no named injectables. Review markers are everywhere.
- **Foundation, not feature-bloat.** No ecommerce, testimonials, FAQ, before/after, or
  3D in phase one — but the architecture leaves clean seams for all of them.

## 2. Tech stack & why

| Choice | Why |
| --- | --- |
| **Next.js 16 App Router + RSC** | Static-first premium marketing site; per-route metadata; fast Core Web Vitals; room for future MDX/CMS. Pages are prerendered static. |
| **TypeScript** | Typed content models (`Package`, `Concern`, `Practitioner`) make content swaps safe. |
| **Tailwind v4 (`@theme`)** | Token-driven utilities generated from CSS variables — one palette source, no config sprawl, no bloated component lib. |
| **next/font** | Self-hosted Cormorant Garamond + Manrope, zero layout shift, no external requests. |
| **GSAP + ScrollTrigger** | Precise hero/ambient choreography, industry-standard, tree-shakeable. |
| **Lenis** | Premium smooth-scroll pacing, cleanly disabled under reduced-motion. |
| **IntersectionObserver `Reveal`** | Cheap, reliable section reveals on mobile — GSAP reserved for the hero. |

Custom primitives only — no MUI/Chakra/shadcn. Keeps the aesthetic bespoke and the bundle lean.

## 3. Design system

**Palette (semantic tokens in `globals.css`)** — derived from the logo language:

| Token | Value | Role |
| --- | --- | --- |
| `--background` | `#fbf8f1` | warm ivory ground |
| `--surface` | `#ffffff` | crisp white cards |
| `--surface-elevated` | `#f6f1e6` | alternating tint panels |
| `--text-primary` | `#2c2717` | deep olive-brown type & lines |
| `--text-secondary` | `#6b6250` | warm taupe body |
| `--accent` | `#8c7a45` | muted olive-gold (primary) |
| `--accent-contrast` | `#5c4f2c` | accent text on ivory (AA-safe) |
| `--secondary` | `#d3ac6b` | warm amber (glows/highlights) |
| `--border` | `#e6ddc9` | hairlines |
| `--success` | `#5f7358` | muted sage validation |
| `--overlay` `--shadow-tint` `--glow-gold` | warm-tinted | scrims, soft shadows, ambient glow |

Full token set also covers radii, warm soft shadows (`--shadow-xs…lg`), layout rhythm
(`--container-max`, `--gutter`, `--section-y`), and motion timing (`--ease-soft`, durations).
No glossy gradients, no harsh yellow gold, no black-heavy contrast, no pink.

**Typography** — serif display + neutral sans, fluid `clamp()` scale exposed as Tailwind
`text-*` utilities: `display · h1 · h2 · h3 · lead · body · small · eyebrow`. Serif for
headings (spacious, editorial), Manrope for UI/body, uppercase tracked `.eyebrow` overline.

**Layout language** — generous whitespace, modular `--section-y` rhythm, asymmetric but
controlled split compositions, hairline `rule`/dandelion dividers, light elevated cards,
arched image masks, almost-invisible `texture-noise` + ambient `glow`.

## 4. Motion system

- **`SmoothScroll`** (Lenis) adds `.js` to `<html>`, syncs Lenis ⇄ ScrollTrigger, and is
  **entirely skipped under `prefers-reduced-motion: reduce`**.
- **`Reveal`** — IntersectionObserver toggles `.is-visible`; CSS does the fade/translate.
  Content is visible immediately if JS is off or motion is reduced. Supports `delay` stagger.
- **`Hero`** — GSAP timeline: layered fade/translate stagger on copy, soft scale-in on
  media, endless gentle drift on the decorative motif. Reverts cleanly; no-op under reduced-motion.
- Principles applied: soft section reveals, subtle parallax only, tasteful text stagger,
  elegant CTA hover (lift + arrow nudge), premium pacing, no scroll-jacking, light on mobile.

Per-section usage matches the brief (hero ambient, header wipes/stagger, gentle card lift,
practitioner reveal, location stagger, quiet footer).

## 5. Information architecture

```
Home
Skin      (concern-led: acne · scarring · hydration · rejuvenation → technology explained)
Hair      (concern-led: thinning · scalp · recovery · grey pathways → technology explained)
Pricing   (#packages · #single)
About     (#clinic · #practitioners)
Contact / Book   (#enquire · #book · #location)
Products  (info only — secondary)
Legal     (privacy · terms · cancellation — placeholders)
[Phase two] Journal/Articles — placeholder only, not wired up
```

Nav is concern/trust-led (Home · Skin · Hair · Pricing · About · Book). Journey:
**concern → pathway → package/single → practitioner trust → booking.**

## 6. Page-by-page wireframe logic

- **Home** — Hero → Trust strip → Skin/Hair pathways → Concerns overview → Featured
  programs → Science-led split → Practitioners preview → Clinic experience gallery →
  Location & access → Final CTA. (Strongest conversion + strategic summary page.)
- **Skin / Hair** — PageHero → alternating `ConcernSection`s (problem → approach →
  benefits → tech chips → related program + CTA) → technology grid → CTA.
- **Pricing** — PageHero → sticky in-page nav → Skin packages → Hair packages → Single
  treatments → CTA. Cards show price, sessions, inclusions, concern, positioning, CTA.
- **About** — PageHero → clinic story → dandelion meaning → values → practitioner cards → CTA.
- **Contact** — PageHero → booking column (phone/email/hours + booking-platform seam) +
  enquiry form → location block (map, parking, transport, accessibility).
- **Products** — info-only grid, clearly secondary, no cart/checkout.

## 7. Reusable component inventory

Brand: `Logo` · `DandelionMark` · `Divider` · `MotifLayer`
UI: `Container` · `Section` · `Button` · `SectionHeader` · `ImageFrame` · `Prose`
Layout: `Header` (+ mobile drawer) · `Footer` · `StickyCTA`
Sections: `Hero` · `PageHero` · `SplitEditorial` · `ConcernSection` · `CTABlock` ·
`TrustStrip` · `LocationBlock` · `PricingNav`
Cards: `ConcernCard` · `PackageCard` · `TreatmentCard` · `PractitionerCard` · `TechBlock`
Forms: `ContactForm`
Motion: `SmoothScroll` · `Reveal`

All are brand-consistent, token-driven, and content-agnostic.

## 8. Logo asset package

> ⚠️ **No original logo image was provided in the project.** The current mark is a
> faithful, restrained **placeholder** interpretation of the brief (dandelion motif +
> elegant serif, ivory/olive-gold). **It must be replaced with the client's exact traced
> logo before launch** — do not restyle the brand; swap the vector and re-run the scripts.

The in-app React `DandelionMark` and the exported SVGs share identical geometry, so they
never drift. `scripts/generate-logo-assets.mjs` emits SVG masters; `export-raster-assets.mjs`
(uses `sharp`) emits the raster set. Delivered in `public/brand/`:

- SVG: lockup, lockup-reversed, mark, mark-accent, mark-mono-dark, mark-reversed, favicon
- PNG + WebP mark at 64/128/256/512/1024
- favicons 16/32/48, `favicon.ico`, `favicon.svg`, apple-touch-icon (180)
- PWA icons 192/512, `og-image.png` (1200×630)

See `public/brand/README.md` for the swap procedure, clear-space and minimum-size rules.

**When the real logo arrives:** replace `logo-lockup.svg` / `logo-mark.svg` with the
client's vector (or a faithful trace of the raster), update `DandelionMark.tsx` to match,
re-run both scripts. Everything else (favicons, OG, PWA icons) regenerates automatically.

---

## 9. Unresolved content dependencies (client-provided)

| # | Item | Where | Status |
| --- | --- | --- | --- |
| 1 | **Exact logo vector** (or high-res raster to trace) | `public/brand/*`, `DandelionMark.tsx` | Placeholder in use |
| 2 | **Practitioner details** — names, portraits, qualifications, **AHPRA registration**, languages, specialties, bios (1 dermal therapist + 2 dermal specialists) | `src/content/practitioners.ts` | Elegant placeholders |
| 3 | **Public phone number** | `src/lib/site.ts` (`contact.phone`) | Placeholder `(03) 0000 0000` |
| 4 | **Real photography** — hero, treatment rooms, practitioners, space, close-ups | `ImageFrame` placeholders sitewide | On-brand placeholders |
| 5 | **Final domain** + OG image sign-off | `src/lib/site.ts` (`url`), `layout.tsx` | Assumed domain |
| 6 | **Legal copy** — Privacy (APP/Privacy Act), Terms, Cancellation window/deposit terms | `src/app/legal/*` | Draft placeholders (noindex) |
| 7 | **Session durations / GST display rules** for treatments | `src/content/packages.ts` | Approx. durations |
| 8 | **Booking platform** integration (or form → email/CRM handler) | `ContactForm`, Contact page seam | Simulated submit |
| 9 | **Geo coordinates** for LocalBusiness schema | `layout.tsx` StructuredData | Address only |
| 10 | **Social handles** (only render when provided) | `src/lib/site.ts` (`social`) | Empty |

## 10. Compliance / copy review markers

Grep the codebase for these tags before any public/regulated advertising:

- **`COMPLIANCE`** — inline notes wherever wording is advertising-sensitive.
- **`TODO(client)` / `TODO(content)` / `TODO(dev)`** — outstanding inputs & wiring.
- **`reviewFlag`** (in `packages.ts`) — package-level items needing sign-off, specifically:
  - **"Forever Twenty" / "Forever in your 20s"** — client likes this line. It is
    **OPTIONAL and configurable**, *not* used as a global hero claim. **Must be legal/
    compliance reviewed before any public regulated advertising use.**
  - **Grey-hair pathways** (Return of A Hero, Happy Hair Happy Life) — claims must be
    clinically/legally confirmed.

Copy guardrails already enforced throughout: supportive verbs only ("supports", "targets",
"designed to address", "may help improve"); "results vary by individual"; "suitability
confirmed in consultation"; no guaranteed outcomes; no "fixes ageing"; no
person-is-unattractive implications; no testimonials/before-after hardcoded; no
prescription-only substances or named injectables.

## 11. Deliberately excluded (phase one) — with seams left in

Online payment · FAQ · testimonial carousel · before/after gallery · full ecommerce ·
prominent newsletter · gimmicky AI visuals · intrusive popups · required 3D/WebGL.

Seams provided: MDX `pageExtensions` stub in `next.config.ts`; `journal/README.md`
phase-two plan; product data array ready to extend; `ImageFrame` ready for real `src`;
`ContactForm` ready for a real handler; `MotifLayer` structured so a future 3D hero can
drop into the hero's decorative layer without touching content.
