# Regenerate — Brand Asset Package

> ⚠️ **SOURCE-OF-TRUTH NOTICE**
> No original logo image was supplied in the project files. The assets here are a
> **faithful, restrained placeholder** built to the brief's description (dandelion
> motif + elegant serif, ivory/olive-gold palette, spacious composition).
>
> **Before launch:** replace these with the client's **exact** traced logo. Do not
> restyle the brand — swap the vector and re-run the export scripts. If the client
> provides a vector (AI/SVG/EPS/PDF), use it directly as `logo-lockup.svg` /
> `logo-mark.svg`; if only a raster is provided, trace it faithfully to SVG first.

## Regenerating assets

```bash
node scripts/generate-logo-assets.mjs   # writes the SVG master files
node scripts/export-raster-assets.mjs   # rasterises PNG/WebP/favicon/OG (needs sharp)
```

The in-app React mark (`src/components/brand/DandelionMark.tsx`) and these SVGs share
the **same geometry**, so they always match.

## What's in this folder

| File | Use |
| --- | --- |
| `logo-lockup.svg` | Primary horizontal lockup (mark + wordmark) |
| `logo-lockup-reversed.svg` | Lockup for dark surfaces |
| `logo-mark.svg` | Dandelion glyph, ink (deep olive-brown) |
| `logo-mark-accent.svg` | Glyph in olive-gold accent |
| `logo-mark-mono-dark.svg` | Pure-black monochrome (print / stamps) |
| `logo-mark-reversed.svg` | Ivory glyph for dark backgrounds |
| `logo-mark-{64,128,256,512,1024}.png` | Transparent PNG mark, multiple sizes |
| `logo-mark-{...}.webp` | Same, WebP (smaller) |
| `favicon.svg` | Vector favicon (ivory tile) |
| `favicon-{16,32,48}.png` | Raster favicons |
| `apple-touch-icon.png` | 180×180 iOS home-screen icon |
| `icon-192.png`, `icon-512.png` | PWA / Android icons (see `manifest.ts`) |
| `og-image.png` | 1200×630 social preview |

Root-level `public/favicon.ico` and `public/favicon.svg` are what the browser tab uses
(wired in `src/app/layout.tsx` + `manifest.ts`).

## Colour reference (from design tokens)

- Ink / typography: `#2c2717` (deep olive-brown)
- Primary accent: `#8c7a45` (muted olive-gold)
- Secondary: `#d3ac6b` (warm amber)
- Ground: `#fbf8f1` (ivory)

## Clear-space & minimum size

- Clear space ≥ the height of the dandelion head on all sides.
- Minimum mark size: 24 px digital. Below 24 px use `favicon.svg`.
- Never recolour outside the palette, rotate, stretch, or add effects/shadows.
