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

/* Trim surrounding transparent/white padding so the logo can be positioned
   precisely in the UI, then keep a transparent background throughout. */
const trimmed = await sharp(SOURCE)
  .trim({ threshold: 10 })
  .png()
  .toBuffer();

const meta = await sharp(trimmed).metadata();
console.log(`Source trimmed to ${meta.width}×${meta.height}`);

/* --- Full-resolution transparent master ---------------------------------- */
await sharp(trimmed).png().toFile(join(BRAND, "logo-full.png"));
await sharp(trimmed).webp({ quality: 92 }).toFile(join(BRAND, "logo-full.webp"));

/* --- Header / footer optimised versions ----------------------------------
   Height-constrained: the UI caps rendered height, so ~2x for crisp retina. */
for (const [name, height] of [
  ["logo-header", 220],
  ["logo-footer", 260],
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
const iconBase = async (size, background) =>
  sharp(trimmed)
    .resize({
      width: Math.round(size * 0.8),
      height: Math.round(size * 0.8),
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: Math.round(size * 0.1),
      bottom: Math.round(size * 0.1),
      left: Math.round(size * 0.1),
      right: Math.round(size * 0.1),
      background,
    })
    .resize(size, size)
    .png()
    .toBuffer();

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
