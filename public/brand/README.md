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

## Activating / updating the logo

```bash
# 1. Save the client's original PNG here:
#      public/brand/source/regenerate-logo-original.png
# 2. Derive every web asset from it:
node scripts/generate-logo-assets.mjs
# 3. Set LOGO_READY = true in src/lib/brand.ts
```

Re-run steps 1–2 any time the client supplies an updated logo.

### Current status

⚠️ `LOGO_READY` is **false** — the original PNG has not been supplied yet, so the
header/footer temporarily render a placeholder lockup. **This placeholder is not the
client's logo and must not go live.** Complete the three steps above before launch.

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
