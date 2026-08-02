/* =============================================================================
   generate-logo-assets.mjs
   -----------------------------------------------------------------------------
   Derives the full web asset set from the CLIENT'S ORIGINAL LOGO PNG.

   The original is the ONLY source of truth. This script never redraws, traces or
   reinterprets the artwork — it only trims transparent padding, resizes and
   re-encodes. Run it whenever the client supplies an updated logo.

   Usage:
     1. Save the client's original PNG to:
          public/brand/source/regenerate-logo-original.png
     2. node scripts/generate-logo-assets.mjs
     3. Set LOGO_READY = true in src/lib/brand.ts

   Outputs (all in public/brand/):
     logo-header.png / .webp      optimised header lockup
     logo-footer.png / .webp      optimised footer lockup
     logo-full.png  / .webp       high-res transparent master
     favicon.ico, favicon-16/32/48.png, favicon.svg-free
     apple-touch-icon.png (180)   icon-192.png, icon-512.png
     og-image.png (1200x630)      social preview on brand ivory
   ========================================================================== */
import sharp from "sharp";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = join(__dirname, "..", "public");
const BRAND = join(PUB, "brand");
const SOURCE = join(BRAND, "source", "regenerate-logo-original.png");

const IVORY = "#fbf8f1";

if (!existsSync(SOURCE)) {
  console.error(
    `\n✖ Client logo not found at:\n    ${SOURCE}\n\n` +
      `Save the client's ORIGINAL logo PNG there, then re-run this script.\n` +
      `Do not substitute a recreated or traced version.\n`
  );
  process.exit(1);
}

mkdirSync(BRAND, { recursive: true });

/* --- 1. White background → true transparency -------------------------------
   The client's original is supplied as flattened artwork on a solid white
   background. Placed on the site's cream surfaces that would render as a white
   box, so we recover an alpha channel.

   The artwork is a single olive ink colour, so every non-white pixel is exactly
   `alpha × ink + (1 - alpha) × white`. That makes the inverse exact: derive
   alpha from how far each pixel sits from white, then restore the pure ink
   colour. Anti-aliased edges stay smooth and NOTHING about the artwork's shape,
   proportions or colour is altered — this is a format conversion, not a redraw. */
const src = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { data: px, info } = src;
const CH = info.channels;

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

// Measure the solid-ink colour from the darkest pixels rather than assuming it.
let ir = 0, ig = 0, ib = 0, n = 0;
for (let i = 0; i < px.length; i += CH) {
  if (lum(px[i], px[i + 1], px[i + 2]) < 95) {
    ir += px[i]; ig += px[i + 1]; ib += px[i + 2]; n++;
  }
}
if (!n) {
  console.error("✖ Could not detect logo ink — is the source blank?");
  process.exit(1);
}
const ink = [Math.round(ir / n), Math.round(ig / n), Math.round(ib / n)];
const inkLum = lum(...ink);
console.log(`Detected ink colour rgb(${ink.join(", ")}) from ${n} solid pixels`);

const out = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, o = 0; i < px.length; i += CH, o += 4) {
  const l = lum(px[i], px[i + 1], px[i + 2]);
  // 255 (white) → alpha 0; inkLum or darker → alpha 255.
  const a = Math.max(0, Math.min(255, Math.round(((255 - l) / (255 - inkLum)) * 255)));
  out[o] = ink[0];
  out[o + 1] = ink[1];
  out[o + 2] = ink[2];
  out[o + 3] = a;
}

/* --- 2. Trim surrounding empty space so the logo positions precisely -------- */
const trimmed = await sharp(out, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .trim({ threshold: 1 })
  .png()
  .toBuffer();

const meta = await sharp(trimmed).metadata();
console.log(`Source trimmed to ${meta.width}×${meta.height}`);

/* --- Full-resolution transparent master ---------------------------------- */
await sharp(trimmed).png().toFile(join(BRAND, "logo-full.png"));
await sharp(trimmed).webp({ quality: 92 }).toFile(join(BRAND, "logo-full.webp"));

/* --- Header / footer optimised versions ----------------------------------
   Height-constrained. The UI caps rendered height at 64px (header) and 96px
   (footer), so these are sized for ~3x displays without shipping the full master. */
for (const [name, height] of [
  ["logo-header", 200],
  ["logo-footer", 300],
]) {
  await sharp(trimmed).resize({ height }).png().toFile(join(BRAND, `${name}.png`));
  await sharp(trimmed)
    .resize({ height })
    .webp({ quality: 92 })
    .toFile(join(BRAND, `${name}.webp`));
}

/* --- Square icon base -----------------------------------------------------
   Icons must be square; pad the trimmed logo onto a square ivory tile so the
   artwork is never cropped or distorted. */
const iconBase = async (size, background) => {
  // Inner artwork box, leaving ~10% clear space on each edge.
  const inner = Math.round(size * 0.8);
  // NOTE: sharp only honours the LAST .resize() in a pipeline and applies it
  // BEFORE .extend(), so padding must happen in its own pass — otherwise the
  // output ends up `size * 1.2` instead of `size`.
  const padded = await sharp(trimmed)
    .resize({
      width: inner,
      height: inner,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const padL = Math.floor((size - inner) / 2);
  const padT = Math.floor((size - inner) / 2);
  return sharp(padded)
    .extend({
      top: padT,
      bottom: size - inner - padT,
      left: padL,
      right: size - inner - padL,
      background,
    })
    .png()
    .toBuffer();
};

const opaque = { r: 251, g: 248, b: 241, alpha: 1 }; // ivory tile
const clear = { r: 0, g: 0, b: 0, alpha: 0 };

for (const s of [16, 32, 48]) {
  writeFileSync(join(BRAND, `favicon-${s}.png`), await iconBase(s, opaque));
}
writeFileSync(join(BRAND, "apple-touch-icon.png"), await iconBase(180, opaque));
writeFileSync(join(BRAND, "icon-192.png"), await iconBase(192, opaque));
writeFileSync(join(BRAND, "icon-512.png"), await iconBase(512, opaque));
writeFileSync(join(BRAND, "icon-512-transparent.png"), await iconBase(512, clear));

/* --- favicon.ico (PNG-in-ICO wrapper around the 32px icon) ---------------- */
function pngToIco(pngBuf) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuf.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, pngBuf]);
}
writeFileSync(
  join(PUB, "favicon.ico"),
  pngToIco(readFileSync(join(BRAND, "favicon-32.png")))
);

/* --- Social preview / OG image (1200×630) --------------------------------- */
const ogBg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
     <rect width="1200" height="630" fill="${IVORY}"/>
   </svg>`
);
const ogLogo = await sharp(trimmed).resize({ height: 380 }).png().toBuffer();
await sharp(ogBg)
  .composite([{ input: ogLogo, gravity: "center" }])
  .png()
  .toFile(join(BRAND, "og-image.png"));

console.log(
  "\n✓ Logo assets generated from the client original.\n" +
    "  Next: set LOGO_READY = true in src/lib/brand.ts\n"
);
