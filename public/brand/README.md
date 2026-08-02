# Regenerate — Brand Asset Package

## The client's original logo is the ONLY source of truth

The logo must **never** be recreated, traced, redrawn or reinterpreted in code.
Everything in this folder is **derived** from the client's original PNG by a script
that only trims, resizes and re-encodes — it never redraws the artwork.

Preserved exactly, by definition, because we only ever resize the original:

- the capital **R**
- the dandelion symbol
- the curved line
- the word **regenerate**
- **SKIN & HAIR**
- **CLINIC**
- the logo's own lettering, spacing, proportions, alignment and olive-gold colour

> The website's own fonts (Cormorant Garamond + Manrope) are unrelated to the
> lettering *inside* the logo and remain unchanged.

## Updating the logo

```bash
# 1. Replace the original at:
#      public/brand/source/regenerate-logo-original.png
# 2. Re-derive every web asset from it:
node scripts/generate-logo-assets.mjs
# 3. If the script reports a new trimmed size, update LOGO_ASPECT in src/lib/brand.ts
```

### Current status

✅ **Live** — the client's original logo is in place and is used in the header,
mobile navigation and footer, plus all favicons, app icons and the social preview.

### One production note

The supplied original is a **flattened JPEG on a solid white background** (2000×2000,
no alpha). Because the artwork is a single olive ink colour, the generator recovers a
true alpha channel exactly — every non-white pixel is `alpha × ink + (1−alpha) × white`,
so the inverse is lossless and anti-aliased edges stay smooth. Shape, proportions and
colour are untouched.

If the client can supply a **vector** (AI / EPS / PDF / SVG) or a transparent PNG
master, drop it in and re-run the script — quality at large sizes would improve
further. Not required; current output is clean.

## Generated outputs

| File | Use |
| --- | --- |
| `logo-full.png` / `.webp` | Full-resolution transparent master (whole lockup) |
| `logo-header.png` / `.webp` | Optimised header lockup |
| `logo-footer.png` / `.webp` | Optimised footer lockup |
| `logo-mark.png` / `.webp` | The mark alone — R + curve + dandelions |
| `motif-dandelion.png` / `.webp` | Decorative dandelion head (see below) |
| `favicon-16/32/48.png` | Raster favicons |
| `../favicon.ico` | Multi-use browser favicon |
| `apple-touch-icon.png` | 180×180 iOS home-screen icon |
| `icon-192.png`, `icon-512.png` | PWA / Android icons (see `src/app/manifest.ts`) |
| `icon-512-transparent.png` | Transparent 512 variant |
| `og-image.png` | 1200×630 social preview on brand ivory |

### Icons simplify as they get smaller

The lockup stacks four elements (mark / "regenerate" / "SKIN & HAIR" / "CLINIC"),
which is an illegible smudge at icon sizes — so icons step down in detail:

| Size | Artwork | Why |
| --- | --- | --- |
| 16 / 32 / 48 (favicons) | **R only**, ivory on an olive chip | The dandelion's hairline filaments anti-alias into pale beige at these sizes and the icon reads as an empty box. The R is a solid letterform with real mass, and reversing it out of olive keeps it visible on both light and dark browser tab bars. |
| 180 / 192 / 512 (app icons) | **Full mark** on an ivory tile | Enough resolution for the dandelion detail to survive, so the icon keeps the brand's most distinctive element. |

Both the mark band and the R glyph are **detected by measuring the artwork**, not
hard-coded, so a re-exported logo still works. Nothing is ever cropped mid-shape or
distorted — only scaled proportionally and padded.

> Browsers cache favicons aggressively. After a change, hard-refresh
> (<kbd>Ctrl</kbd>+<kbd>F5</kbd>) or reopen the tab to see it.

### The decorative dandelion

`motif-dandelion.png` is the large seed head lifted from the client's own artwork,
isolated with a circular mask centred on its hub (which cleanly drops the stem and the
smaller head while keeping every filament). It is used site-wide for dividers, section
accents, background flourishes and image placeholders via
`src/components/brand/Motif.tsx`, which renders it as a CSS mask filled with
`currentColor` so it can be tinted — light on the olive CTA band, faint elsewhere.

This replaced an earlier hand-drawn glyph. **Every dandelion on the site now comes
from the real logo**, so decoration and brand mark never diverge.

## Usage rules

- Clear space ≥ the height of the dandelion head on all sides.
- Minimum size: 24 px digital.
- Never recolour, rotate, stretch, or add effects/shadows.
- An SVG version should only ever be produced from a genuine vector supplied by the
  client — do **not** auto-trace the PNG and present it as the exact logo.
