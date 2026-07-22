/* =============================================================================
   export-raster-assets.mjs
   Rasterises the brand SVGs into PNG, WebP, favicon and social-preview assets.
   Run AFTER generate-logo-assets.mjs:  `node scripts/export-raster-assets.mjs`
   Requires: sharp (devDependency).
   ========================================================================== */
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = join(__dirname, "..", "public");
const BRAND = join(PUB, "brand");
mkdirSync(BRAND, { recursive: true });

const IVORY = "#fbf8f1";
const ACCENT = "#8c7a45";

const markSvg = readFileSync(join(BRAND, "logo-mark.svg"));
const markAccentSvg = readFileSync(join(BRAND, "logo-mark-accent.svg"));
const faviconSvg = readFileSync(join(BRAND, "favicon.svg"));
const lockupSvg = readFileSync(join(BRAND, "logo-lockup.svg"));

// Transparent PNG mark at multiple sizes + WebP.
const sizes = [64, 128, 256, 512, 1024];
for (const s of sizes) {
  await sharp(markSvg, { density: 400 }).resize(s, s).png().toFile(join(BRAND, `logo-mark-${s}.png`));
  await sharp(markSvg, { density: 400 }).resize(s, s).webp({ quality: 90 }).toFile(join(BRAND, `logo-mark-${s}.webp`));
}

// Favicon PNGs + multi-size .ico
for (const s of [16, 32, 48]) {
  await sharp(faviconSvg, { density: 400 }).resize(s, s).png().toFile(join(BRAND, `favicon-${s}.png`));
}
// .ico (sharp writes single-size ico; 32px is a good default).
await sharp(faviconSvg, { density: 400 }).resize(32, 32).toFormat("png").toFile(join(PUB, "favicon-32.png"));

// Apple touch icon (180×180, ivory tile).
await sharp(faviconSvg, { density: 400 }).resize(180, 180).png().toFile(join(BRAND, "apple-touch-icon.png"));

// Android/PWA icons.
await sharp(faviconSvg, { density: 400 }).resize(192, 192).png().toFile(join(BRAND, "icon-192.png"));
await sharp(faviconSvg, { density: 400 }).resize(512, 512).png().toFile(join(BRAND, "icon-512.png"));

// Social preview / OG image (1200×630) — ivory ground + centred lockup.
const ogBg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
     <rect width="1200" height="630" fill="${IVORY}"/>
     <circle cx="1040" cy="120" r="260" fill="${ACCENT}" opacity="0.06"/>
     <circle cx="180" cy="560" r="200" fill="${ACCENT}" opacity="0.05"/>
   </svg>`
);
const lockupPng = await sharp(lockupSvg, { density: 400 }).resize({ width: 640 }).png().toBuffer();
await sharp(ogBg)
  .composite([{ input: lockupPng, gravity: "center" }])
  .png()
  .toFile(join(BRAND, "og-image.png"));

console.log("Raster assets exported to public/brand/ (PNG, WebP, favicons, apple-touch, OG).");

/* --- favicon.ico (PNG-in-ICO wrapper around the 32px favicon) -------------- */
import { readFileSync as _read } from "node:fs";
function pngToIco(pngBuf) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);    // width (32)
  entry.writeUInt8(32, 1);    // height (32)
  entry.writeUInt8(0, 2);     // palette
  entry.writeUInt8(0, 3);     // reserved
  entry.writeUInt16LE(1, 4);  // planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(pngBuf.length, 8); // size
  entry.writeUInt32LE(22, 12);           // offset
  return Buffer.concat([header, entry, pngBuf]);
}
const png32 = _read(join(BRAND, "favicon-32.png"));
writeFileSync(join(PUB, "favicon.ico"), pngToIco(png32));
console.log("wrote public/favicon.ico");
