# Regenerate — Brand Asset Package

## The client's original logo files are the ONLY source of truth

The logo is **never** recreated, traced, redrawn or reinterpreted. Everything here is
**derived** from the client's originals by a script that only removes the flat white
background, crops along bands detected in the artwork, resizes and re-encodes.

```
public/brand/source/regenerate-circle-original.jpg   circular lockup — MAIN logo
public/brand/source/regenerate-lockup-original.jpg   stacked lockup — emblem source
```

## Round-3 brand rules

| Rule | Where |
| --- | --- |
| The **circular logo** is the main brand identity | Header (`Logo placement="header"`) |
| The decorative mark is the **FULL EMBLEM** — R + curved stems + dandelions together | `Motif.tsx` |
| **A dandelion on its own is never used anywhere** | — |
| The emblem appears **behind text only**, never beneath an image or placeholder | `MotifLayer`, `CTABlock`, `HealthcareStatement`, `Footer` |
| The **footer** uses an emblem + brand-name lockup as the clinic identity | `Logo placement="footer"` |

The emblem is deliberately faint (4–7% opacity), never repeated on a page, and never
competing with reading.

## Regenerating

```bash
node scripts/generate-logo-assets.mjs
```
Re-run whenever the client supplies new artwork. Update `LOGO_SIZES` in
`src/lib/brand.ts` if the script reports different dimensions.

## Outputs

| File | Use |
| --- | --- |
| `logo-primary-circle.png` / `.webp` | Full-resolution circular logo |
| `logo-header.png` / `.webp` | Header-optimised circular logo |
| `logo-secondary-lockup.png` / `.webp` | Stacked lockup |
| `logo-emblem.png` / `.webp` | **The emblem** — background artwork |
| `logo-emblem-wordmark.png` / `.webp` | Emblem + "regenerate" |
| `logo-emblem-wordmark-full.png` / `.webp` | Emblem + regenerate + SKIN & HAIR CLINIC |
| `logo-footer.png` / `.webp` | Footer identity lockup |
| `favicon-16/32/48.png`, `../favicon.ico` | Favicons |
| `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | App icons |
| `og-image.png` | 1200×630 social preview |

### Why icons step down in detail

The full circular lockup carries small type that turns to mush at icon sizes, so:

- **180 / 192 / 512** — the full emblem on an ivory tile.
- **16 / 32 / 48** — the **R alone**, reversed out of an olive chip. The dandelion's
  hairline filaments anti-alias into pale beige at those sizes and the icon reads as an
  empty box.

Both the emblem band and the R glyph are **detected by measuring the artwork**, not
hard-coded, so a re-exported logo still works.

> Browsers cache favicons aggressively. After a change, hard-refresh (Ctrl+F5) or
> reopen the tab.

## Usage rules

- Clear space ≥ the height of the dandelion head on all sides.
- Minimum size: 24 px digital.
- Never recolour, rotate, stretch, or add effects.
- Do **not** auto-trace a raster and present it as an exact vector. An SVG should only
  come from a genuine vector supplied by the client.
