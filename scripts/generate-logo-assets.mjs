/* =============================================================================
   generate-logo-assets.mjs
   Emits the Regenerate dandelion logo as standalone SVG assets that match the
   in-app React <DandelionMark/> exactly. Run: `node scripts/generate-logo-assets.mjs`
   -----------------------------------------------------------------------------
   IMPORTANT: This is a faithful PLACEHOLDER interpretation — no original logo
   image was supplied. Replace these with the client's exact traced logo before
   launch (see public/brand/README.md). Do not restyle the brand.
   ========================================================================== */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "brand");
mkdirSync(OUT, { recursive: true });

const INK = "#2c2717";      // deep olive-brown
const ACCENT = "#8c7a45";   // muted olive-gold
const IVORY = "#fbf8f1";

// Match DandelionMark.tsx geometry (12 filaments around head at 32,26).
function seeds() {
  const out = [];
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
    const cx = 32, cy = 26, r1 = 3.2, r2 = 15;
    out.push({
      x1: (cx + Math.cos(a) * r1).toFixed(2),
      y1: (cy + Math.sin(a) * r1).toFixed(2),
      x2: (cx + Math.cos(a) * r2).toFixed(2),
      y2: (cy + Math.sin(a) * r2).toFixed(2),
      px: (cx + Math.cos(a) * (r2 + 1.4)).toFixed(2),
      py: (cy + Math.sin(a) * (r2 + 1.4)).toFixed(2),
    });
  }
  return out;
}

function markPaths(color, sw = 1.1) {
  const s = seeds()
    .map(
      (p) =>
        `<line x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}" opacity="0.9"/>` +
        `<circle cx="${p.px}" cy="${p.py}" r="1.15" opacity="0.85"/>`
    )
    .join("");
  return `
  <g fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
    ${s}
    <circle cx="32" cy="26" r="2.1" fill="${color}" stroke="none"/>
    <path d="M32 28 C 32 40, 30.5 48, 33 58" opacity="0.9"/>
    <path d="M32.4 41 C 27 40, 24.5 43.5, 24 47 C 28.5 47, 31.4 45, 32.4 41 Z" opacity="0.75"/>
    <g opacity="0.7">
      <line x1="50" y1="16" x2="54" y2="12"/><circle cx="55.2" cy="10.6" r="1"/>
      <line x1="50" y1="16" x2="49" y2="11"/><circle cx="48.6" cy="9.6" r="1"/>
    </g>
    <g opacity="0.55"><line x1="12" y1="12" x2="9" y2="8"/><circle cx="7.9" cy="6.7" r="0.9"/></g>
  </g>`;
}

const markSVG = (color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Regenerate dandelion mark">${markPaths(color)}</svg>\n`;

// Full horizontal lockup: mark + serif wordmark.
const lockupSVG = (ink, accent) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 72" width="340" height="72" role="img" aria-label="Regenerate Skin &amp; Hair Clinic">
  <g transform="translate(0,4)">${markPaths(ink)}</g>
  <g font-family="'Cormorant Garamond', Georgia, serif" fill="${ink}">
    <text x="78" y="38" font-size="30" letter-spacing="0.5">Regenerate</text>
  </g>
  <text x="79" y="56" font-family="'Manrope','Segoe UI',sans-serif" font-size="9" letter-spacing="3.4" fill="${accent}">SKIN &amp; HAIR CLINIC</text>
</svg>\n`;

// Favicon: mark on ivory rounded tile.
const faviconSVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="${IVORY}"/>
  ${markPaths(ACCENT, 1.4)}
</svg>\n`;

const files = {
  "logo-mark.svg": markSVG(INK),
  "logo-mark-accent.svg": markSVG(ACCENT),
  "logo-mark-mono-dark.svg": markSVG("#000000"),
  "logo-mark-reversed.svg": markSVG(IVORY), // for dark surfaces
  "logo-lockup.svg": lockupSVG(INK, ACCENT),
  "logo-lockup-reversed.svg": lockupSVG(IVORY, "#d3ac6b"),
  "favicon.svg": faviconSVG,
};

for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT, name), content);
  console.log("wrote", name);
}
// Favicon at the app root too.
writeFileSync(join(__dirname, "..", "public", "favicon.svg"), faviconSVG);
console.log("wrote public/favicon.svg");
console.log("\nDone. See public/brand/README.md for raster/favicon export steps.");
