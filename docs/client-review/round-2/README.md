# Regenerate — Round 2 client review package

> **Nothing in this round has been implemented.** The production site is untouched:
> no design tokens, logo wiring, navigation or treatment routes have changed. This
> folder contains **review artifacts only**, so the client can approve a direction
> before any production code moves.

Branch: `client-review/round-2-artifacts`
Checkpoint before this work: **`f1a093a`** — restore with `git reset --hard f1a093a`

---

## What the client asked for

Three separate instructions, deliberately kept apart:

1. **Less cream, more white.** The annotated screenshots circled the cream trust band,
   cream cards and cream image placeholders as what makes the homepage feel
   beauty-oriented rather than clinical.
2. **New logo usage.** The circular logo becomes the main brand logo; the standalone
   dandelion is *out* as the motif; the **full emblem** (R + curved stems + dandelions)
   becomes the background/watermark device; the footer gets an emblem + brand-name
   treatment.
3. **Treatment content** from two Word documents — which turn out to describe services
   the site **already offers**, in much more detail.

---

## Artifact A — Visual, colour and logo

**→ [`visual/palette-notes.md`](./visual/palette-notes.md)**

Three palette directions applied to the same page composition, at three breakpoints,
so they compare like-for-like. Radii and typography are unchanged on purpose — this
round is about colour only, so it stays clear what the client is approving.

| | |
| --- | --- |
| Comparison sheets | `visual/palette-comparison-desktop.png`, `-mobile.png` |
| Full pages | `visual/palette-{a,b,c}-{mobile,tablet,desktop}.png` (+ `.webp`) |
| Live mockup | `visual/mockup.html?p=a|b|c` |

**Recommended starting point: Palette B — White + Warm Islands.** It removes the cream
the client actually objected to, while keeping enough warmth that the site does not
become sterile. Presented as one of three, not as a decision already made.

### Logo system

**→ [`logo/logo-contact-sheet.png`](./logo/logo-contact-sheet.png)**

Derived from the two supplied files by background-removal and band-detected cropping —
never redrawn, and no typography inside either logo was altered.

```
primary-circle-transparent.png / .webp      main brand logo
secondary-lockup-transparent.png / .webp    stacked lockup
brand-emblem.png / .webp                    R + curved stems + dandelions (watermark)
brand-emblem-wordmark.png / .webp           footer option 1
brand-emblem-wordmark-full.png / .webp      footer option 2 (+ SKIN & HAIR CLINIC)
favicon-16/32/48.png · apple-touch-icon.png · icon-192.png · icon-512.png
alt-favicon-R-16/32/48.png                  alternative, more legible at 16px
logo-contact-sheet.png / .webp
favicon-legibility-comparison.png
```

Regenerate with:
```bash
node docs/client-review/round-2/logo/generate-review-logo-assets.mjs
```

**Two honest findings:**

- The **circular logo loses its inner text at header size** (~56–62px). Visible in every
  palette screenshot. Worth deciding whether the circle is the header logo, or the brand
  logo used larger with the horizontal lockup in the header.
- The **emblem becomes a smudge at 16px**. See `logo/favicon-legibility-comparison.png`.
  Recommendation: emblem at 32px+, R alone at 16px.

---

## Artifact B — Treatment content and placement

**→ [`treatments/treatment-content-map.md`](./treatments/treatment-content-map.md)**
**→ [`treatments/treatment-migration-plan.md`](./treatments/treatment-migration-plan.md)**

| | |
| --- | --- |
| Proposed index | `treatments/treatments-index-{mobile,desktop}.png` |
| Detail template | `treatments/treatment-detail-{mobile,desktop}.png` |
| Further patterns | `treatments/treatment-patterns-{mobile,desktop}.png` |
| Sample code | `treatments/treatment-detail-sample.tsx` |
| Live mockup | `treatments/mockup.html?v=index|detail|patterns` |

**These are not four new services.** Micro-needling, Face Mesotherapy, Scalp Mesotherapy
and Hydra already exist in `src/content/packages.ts`; LED already exists as a technology.
The documents are far richer *detail* for services already offered — which is why the
proposal is a treatment index + detail template rather than stuffing this into pricing cards.

The sample detail page uses **only components already in the repo**, so the architecture
needs no new design system work.

---

## Compliance — flagged, not published

Held out of the public mockups and documented in the content map:

- **Two named prescription medicines** in the scalp-mesotherapy passage. TGA guidance is
  that prescription medicines generally cannot be advertised to the public, and promoting
  a health service by referring to them can itself become prohibited advertising. The
  names are **not reproduced anywhere in these artifacts**.
- **The "300%–500% absorption" figure** — needs evidence and sign-off (Ahpra prohibits
  claims creating unreasonable expectations of benefit).
- **Absolute "safe" / "pain-free" / guaranteed-result phrasing** — softened.
- **No invented price** for LED or HydraFacial; neither document establishes one.
- **No assumption** that existing `Hydra` and `HydraFacial` are the same service.
- Source emojis and "Your Skin. Your Glow." styling removed, since the stated goal is to
  move away from a beauty-salon impression.

**Accessibility, flagged rather than silently fixed:** white on `#8c7a45` is ≈ 4.21:1,
just under the 4.5:1 AA threshold for normal text. The client asked to keep the button
colour, so this is surfaced as a decision (keep / darken to ~`#7d6c3d` / enlarge the
label) rather than changed behind their back.

---

## Questions for the client

**Visual**
1. Which direction — **A** Clinical White, **B** White + Warm Islands, or **C** Gallery White?
2. Only the cream *fills* removed, or should the rounded "bubble" shapes also become less rounded?
3. Footer: **emblem + regenerate**, or **emblem + regenerate + SKIN & HAIR CLINIC**?
4. Is the **circular logo** the header logo, given the legibility finding — or the brand
   logo used larger, with the horizontal lockup in the header?
5. Button contrast: keep `#8c7a45` as-is, or darken slightly to reach AA?

**Treatments**
6. Is current **Hydra** the same service as **HydraFacial**? Should it be renamed?
7. Are **The Collagen Booster** / **The Biorevitalisation** public subtitles, or internal headings?
8. **One** Mesotherapy page with Face + Scalp sections, or **two** pages?
9. Is **LED Light Therapy** standalone bookable, or a modality within other treatments?
10. Are current prices and durations still approved?
11. Which clinical claims and aftercare instructions are **signed off** for publication?
12. Should `/treatments` enter primary navigation, or stay linked from Skin / Hair / Pricing?

*(The earlier question about enlarging the logo's last line is withdrawn and is not
asked again. No logo typography was altered.)*

---

## Isolation and health

- Everything lives under `docs/client-review/round-2/`. Nothing is imported by the app.
- `docs` was added to `tsconfig.json`'s `exclude` so the sample `.tsx` can never break a
  production build. (It was verified to type-check cleanly before being excluded.)
- **Baseline was captured before any artifact work** — typecheck, lint and build all
  passed on `main` at `f1a093a`, and all three still pass now. Any future failure is
  therefore attributable, not pre-existing.

### Viewing the artifacts

```bash
node docs/client-review/round-2/.server.mjs
```
- Palettes → `http://localhost:4321/visual/mockup.html?p=b`
- Treatments → `http://localhost:4321/treatments/mockup.html?v=index`

### If anything needs undoing

```bash
git reset --hard f1a093a
```

---

## Next step after approval

Once the client picks a palette, a footer treatment and the treatment architecture, the
implementation surface is: `globals.css` tokens → `PathwayCard` / `TrustStrip` /
`ImageFrame` / `Section` → `Logo.tsx` / `Motif.tsx` / `MotifLayer.tsx` +
`generate-logo-assets.mjs` → then the treatment routes if approved. Responsive and
accessibility QA, Vercel preview, final approval.
