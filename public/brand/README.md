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
| `logo-full.png` / `.webp` | Full-resolution transparent master |
| `logo-header.png` / `.webp` | Optimised header lockup |
| `logo-footer.png` / `.webp` | Optimised footer lockup |
| `favicon-16/32/48.png` | Raster favicons |
| `../favicon.ico` | Multi-use browser favicon |
| `apple-touch-icon.png` | 180×180 iOS home-screen icon |
| `icon-192.png`, `icon-512.png` | PWA / Android icons (see `src/app/manifest.ts`) |
| `icon-512-transparent.png` | Transparent 512 variant |
| `og-image.png` | 1200×630 social preview on brand ivory |

Icons are padded onto a square ivory tile so the artwork is never cropped or
distorted — only ever scaled proportionally.

## Usage rules

- Clear space ≥ the height of the dandelion head on all sides.
- Minimum size: 24 px digital.
- Never recolour, rotate, stretch, or add effects/shadows.
- An SVG version should only ever be produced from a genuine vector supplied by the
  client — do **not** auto-trace the PNG and present it as the exact logo.
