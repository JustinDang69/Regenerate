# Palette notes — round 2

Three directions, applied to the **same page composition** so they can be compared
like-for-like. Radii, spacing, typography and motion are deliberately **unchanged** —
this round is about colour only.

---

## Why radii were left alone

The client circled the cream *fills* in the annotated screenshots, not the rounded
shapes themselves. Changing colour and shape at once would make it impossible to tell
which change earned the approval. If the "bubble" roundness is also a problem, that is
worth a separate, isolated round.

---

## What the accent does — unchanged

`--accent: #8c7a45` is **identical in all three palettes.** Buttons stay olive-gold, as
required. What changes is only how much cream surrounds them.

---

## The three directions

### A — Clinical White
Everything white: page, cards, trust strip, editorial band. Cream survives only in the
deepest recess (`--surface-sunken`, used by the footer).

- **Strength:** the most direct answer to "too beauty-oriented".
- **Risk:** the warmth that made the brand feel premium largely disappears. Cards read
  as outlines rather than objects, and the page can feel flat.

### B — White + Warm Islands  ← recommended starting point
White page, white cards, white trust strip — but selected surfaces (image placeholders,
the editorial band, the footer) stay warm cream.

- **Strength:** removes the cream the client actually objected to, while keeping enough
  warmth that the site still reads as a premium clinic rather than a generic template.
- **Risk:** it is a compromise; if the client wanted *everything* white, this will still
  feel too warm.

### C — Gallery White / Outlined Panels
White throughout, with near-white (`#fdfcf9`) panels and stronger borders doing the work
that fills used to do.

- **Strength:** the most gallery-like and restrained. Structure comes from line, not fill.
- **Risk:** the most likely to feel sterile, and the most dependent on real photography
  to carry warmth. With placeholders it looks emptier than it eventually would.

---

## Token values

```css
/* A — Clinical White */
--background:#ffffff; --surface:#ffffff; --surface-elevated:#ffffff; --surface-sunken:#fbf8f1;
--accent:#8c7a45; --accent-soft:#f6f1e6;
--muted-fill:#f8f6f1; --border:#e3ded3; --border-strong:#c9c0ad;

/* B — White + Warm Islands */
--background:#ffffff; --surface:#ffffff; --surface-elevated:#fbf8f1; --surface-sunken:#f6f1e6;
--accent:#8c7a45; --accent-soft:#eee5cf;
--muted-fill:#f5f2eb; --border:#dfd9cc; --border-strong:#c8bda8;

/* C — Gallery White / Outlined Panels */
--background:#ffffff; --surface:#ffffff; --surface-elevated:#fdfcf9; --surface-sunken:#fbf8f1;
--accent:#8c7a45; --accent-soft:#f3ede0;
--muted-fill:#ffffff; --border:#d8d3c9; --border-strong:#bdb4a3;
```

Text tokens are unchanged across all three: `--text-primary:#241f11`,
`--text-secondary:#574f40`, `--text-muted:#7b7259`, `--accent-contrast:#56492a`.

---

## Accessibility — flagged, not silently fixed

**White text on `#8c7a45` measures ≈ 4.21:1.** WCAG 2.2 AA asks for **4.5:1** for
normal-size text (3:1 for large text). Button labels here are ~14–15px semibold, which
counts as normal text — so the primary button is **marginally below AA**.

This is **not** being fixed behind the client's back, because they explicitly asked for the
button colour to be retained. The options:

1. **Keep `#8c7a45` as-is** and accept the shortfall. Defensible — it is close, and the
   buttons are large with generous padding — but it is a documented gap.
2. **Darken slightly to ~`#7d6c3d`**, which reaches 4.5:1 while staying recognisably the
   same olive. This is a brand decision, not a developer one.
3. **Increase button label size/weight** to qualify as large text (≥18.66px bold), which
   lowers the requirement to 3:1.

Body and heading contrast is comfortably fine in every palette: primary text ≈ 16.4:1,
secondary ≈ 8.1:1, muted ≈ 4.8:1 on white.

Keyboard focus rings should also remain clearly visible against the lighter grounds —
worth re-checking once a palette is chosen, since focus indicators were tuned against a
warmer background.

---

## Logo findings from the mockups

- **The circular logo loses its inner text at header size.** At a realistic sticky-header
  height (~56–62px) the words *regenerate* and *SKIN & HAIR CLINIC* inside the circle
  become illegible. This is visible in every palette screenshot and in
  [`../logo/logo-contact-sheet.png`](../logo/logo-contact-sheet.png), where the circle is
  shown at 40 / 56 / 72 / 96px. Worth deciding whether the circle is the *header* logo or
  the *brand* logo used at larger sizes, with the horizontal lockup in the header.
- **The full emblem works well as a watermark** — R, curved stems and dandelions together,
  at ~5% opacity behind the hero and footer. This replaces the lone-dandelion motif the
  client rejected.
- **Favicons:** the emblem becomes a smudge at 16px. See
  [`../logo/favicon-legibility-comparison.png`](../logo/favicon-legibility-comparison.png)
  — the R alone stays legible. Recommendation is emblem at 32px and above, R alone at 16px.

---

## Files

| File | What it shows |
| --- | --- |
| `palette-{a,b,c}-mobile.png` | 390px wide, full page |
| `palette-{a,b,c}-tablet.png` | 768px wide, full page |
| `palette-{a,b,c}-desktop.png` | 1440px wide, full page |
| `palette-comparison-desktop.png` | All three side by side |
| `palette-comparison-mobile.png` | All three side by side |
| `mockup.html` | The live mockup — open with `?p=a`, `?p=b` or `?p=c` |

To view interactively:

```bash
node docs/client-review/round-2/.server.mjs
# then open http://localhost:4321/visual/mockup.html?p=b
```
