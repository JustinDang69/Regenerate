/* =============================================================================
   generate-logo-assets.mjs
   -----------------------------------------------------------------------------
   Derives the full web asset set from the CLIENT'S ORIGINAL logo files.

   The originals are the ONLY source of truth. This script never redraws, traces
   or reinterprets the artwork — it removes the flat white background, crops along
   bands detected in the artwork itself, resizes and re-encodes.

   Sources (public/brand/source/):
     regenerate-circle-original.jpg   circular lockup — the MAIN brand logo
     regenerate-lockup-original.jpg   stacked lockup — source of the emblem crops

   Usage:  node scripts/generate-logo-assets.mjs

   Round-3 brand rules baked in here:
     · The circular logo is the primary identity (header).
     · The decorative mark is the FULL EMBLEM — R + curved stems + dandelions
       together. A dandelion on its own is never produced or used.
     · The footer uses an emblem + brand-name lockup.
   ========================================================================== */
import sharp from "sharp";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = join(__dirname, "..", "public");
const BRAND = join(PUB, "brand");
const SRC = join(BRAND, "source");
mkdirSync(BRAND, { recursive: true });

const CIRCLE_SRC = join(SRC, "regenerate-circle-original.jpg");
const LOCKUP_SRC = join(SRC, "regenerate-lockup-original.jpg");

for (const [label, file] of [["circular", CIRCLE_SRC], ["lockup", LOCKUP_SRC]]) {
  if (!existsSync(file)) {
    console.error(`\n✖ Missing ${label} source:\n    ${file}\n`);
    process.exit(1);
  }
}

const IVORY = { r: 251, g: 248, b: 241, alpha: 1 };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };
const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/* -----------------------------------------------------------------------------
   1. Flat white background → true transparency.

   Both originals are flattened JPEGs on white. Alpha is derived from how far a
   pixel sits from white, normalised against the luminance of SOLID ink (2nd
   percentile, so one stray dark pixel cannot skew the whole image). Original RGB
   is preserved.

   We deliberately do NOT un-premultiply: that assumes a pixel's lightness is
   purely partial coverage, when here it is mostly the ink's own colour —
   un-premultiplying crushes the olive toward black. Keeping the source RGB keeps
   every ink exact (the circular file carries more than one), and only the thin
   anti-aliased edge retains a trace of white, invisible on the site's white and
   near-white grounds.
--------------------------------------------------------------------------------*/
async function removeWhite(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  const hist = new Uint32Array(256);
  let inked = 0;
  for (let i = 0; i < data.length; i += C) {
    const l = Math.round(lum(data[i], data[i + 1], data[i + 2]));
    if (l < 245) { hist[l]++; inked++; }
  }
  let acc = 0, lSolid = 0;
  const target = inked * 0.02;
  for (let l = 0; l < 256; l++) { acc += hist[l]; if (acc >= target) { lSolid = l; break; } }
  const span = Math.max(40, 255 - lSolid);

  const out = Buffer.alloc(W * H * 4);
  for (let i = 0, o = 0; i < data.length; i += C, o += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const a = Math.min(1, Math.max(0, (255 - lum(r, g, b)) / span));
    if (a < 0.02) continue; // leave fully transparent
    out[o] = r; out[o + 1] = g; out[o + 2] = b; out[o + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .png().trim({ threshold: 1 }).png().toBuffer();
}

const writePair = async (buf, name, quality = 92) => {
  await sharp(buf).png().toFile(join(BRAND, `${name}.png`));
  await sharp(buf).webp({ quality }).toFile(join(BRAND, `${name}.webp`));
};

/* =============================================================================
   PRIMARY — circular logo (header, and anywhere the complete official logo fits)
   ========================================================================== */
const circle = await removeWhite(CIRCLE_SRC);
{
  const m = await sharp(circle).metadata();
  console.log(`Primary circle: ${m.width}×${m.height}`);
}
await writePair(circle, "logo-primary-circle");
// Header-optimised: capped rendered height is 64px, so ~3x for retina.
await sharp(circle).resize({ height: 200 }).png().toFile(join(BRAND, "logo-header.png"));
await sharp(circle).resize({ height: 200 }).webp({ quality: 92 }).toFile(join(BRAND, "logo-header.webp"));

/* =============================================================================
   SECONDARY — stacked lockup, and the emblem crops taken from it
   ========================================================================== */
const lockup = await removeWhite(LOCKUP_SRC);
await writePair(lockup, "logo-secondary-lockup");

const lockRaw = await sharp(lockup).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const LW = lockRaw.info.width, LH = lockRaw.info.height, LD = lockRaw.data;
const alphaAt = (x, y) => LD[(y * LW + x) * 4 + 3];

/* Detect the horizontal bands: [emblem] / "regenerate" / "SKIN & HAIR CLINIC".
   Measured from the artwork rather than hard-coded, so a re-exported logo still
   works instead of silently producing garbage. */
const rowHas = [];
for (let y = 0; y < LH; y++) {
  let hit = 0;
  for (let x = 0; x < LW; x++) if (alphaAt(x, y) > 25) { hit = 1; break; }
  rowHas.push(hit);
}
const raw = [];
for (let y = 0, s = null; y <= LH; y++) {
  if (y < LH && rowHas[y] && s === null) s = y;
  if ((y === LH || !rowHas[y]) && s !== null) { raw.push([s, y - 1]); s = null; }
}
const bands = [];
for (const b of raw) {
  const last = bands[bands.length - 1];
  if (last && b[0] - last[1] <= 6) last[1] = b[1];
  else bands.push([...b]);
}
const usable = bands.filter((b) => b[1] - b[0] >= 4);
console.log(`Lockup: ${LW}×${LH}, ${usable.length} bands`);
if (usable.length < 2) {
  console.error("✖ Could not identify the emblem and wordmark bands.");
  process.exit(1);
}

async function cropBands(from, to) {
  const y0 = usable[from][0], y1 = usable[to][1];
  let x0 = LW, x1 = -1;
  for (let y = y0; y <= y1; y++)
    for (let x = 0; x < LW; x++)
      if (alphaAt(x, y) > 25) { if (x < x0) x0 = x; if (x > x1) x1 = x; }
  return sharp(lockup).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .png().toBuffer();
}

/* THE EMBLEM — R + curved stems + dandelions TOGETHER. This is the only
   decorative mark the site uses. A lone dandelion is never generated. */
const emblem = await cropBands(0, 0);
await writePair(emblem, "logo-emblem");
{
  const m = await sharp(emblem).metadata();
  console.log(`Emblem (R + stems + dandelions): ${m.width}×${m.height}`);
}

/* Footer identity: emblem + brand name. Full variant includes SKIN & HAIR CLINIC. */
await writePair(await cropBands(0, 1), "logo-emblem-wordmark");
if (usable.length >= 3) {
  const full = await cropBands(0, 2);
  await writePair(full, "logo-emblem-wordmark-full");
  await sharp(full).resize({ height: 320 }).png().toFile(join(BRAND, "logo-footer.png"));
  await sharp(full).resize({ height: 320 }).webp({ quality: 92 }).toFile(join(BRAND, "logo-footer.webp"));
  console.log("Footer lockup: emblem + regenerate + SKIN & HAIR CLINIC");
}

/* =============================================================================
   ICONS
   -----------------------------------------------------------------------------
   Detail has to step down as size drops, or the icon reads as an empty box:
     · 180/192/512 — the full emblem on an ivory tile.
     · 16/32/48    — the R alone, reversed out of an olive chip. The dandelion's
                     hairline filaments anti-alias into pale beige at those sizes.
   ========================================================================== */
const emRaw = await sharp(emblem).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const EW = emRaw.info.width, EH = emRaw.info.height, ED = emRaw.data;
const eAlpha = (x, y) => ED[(y * EW + x) * 4 + 3];

let ir = 0, ig = 0, ib = 0, n = 0;
for (let i = 0; i < ED.length; i += 4) {
  if (ED[i + 3] > 200) { ir += ED[i]; ig += ED[i + 1]; ib += ED[i + 2]; n++; }
}
const ink = n ? [Math.round(ir / n), Math.round(ig / n), Math.round(ib / n)] : [92, 79, 19];
console.log(`Emblem ink: rgb(${ink.join(", ")})`);

async function padSquare(input, size, background, inset = 0.84) {
  const inner = Math.round(size * inset);
  // sharp honours only the LAST .resize() and applies it BEFORE .extend(), so
  // padding must happen in its own pass or the output ends up size * 1.2.
  const fitted = await sharp(input)
    .resize({ width: inner, height: inner, fit: "contain", background: CLEAR })
    .png().toBuffer();
  const m = await sharp(fitted).metadata();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: fitted, left: Math.floor((size - m.width) / 2), top: Math.floor((size - m.height) / 2) }])
    .png().toBuffer();
}

// Isolate the R: below the dandelions only the R remains, so its column span
// comes from the lower band, then scan upward for its top edge.
let rx0 = EW, rx1 = -1;
for (let y = Math.round(EH * 0.72); y < EH; y++)
  for (let x = 0; x < EW; x++)
    if (eAlpha(x, y) > 25) { if (x < rx0) rx0 = x; if (x > rx1) rx1 = x; }
let ry0 = EH;
for (let y = 0; y < EH && ry0 === EH; y++)
  for (let x = rx0; x <= rx1; x++) if (eAlpha(x, y) > 25) { ry0 = y; break; }
const rGlyph = await sharp(emblem)
  .extract({ left: rx0, top: ry0, width: rx1 - rx0 + 1, height: EH - ry0 })
  .png().toBuffer();
console.log(`R glyph: ${rx1 - rx0 + 1}×${EH - ry0}`);

async function faviconAt(size) {
  const inner = Math.round(size * 0.72);
  const f = await sharp(rGlyph)
    .resize({ width: inner, height: inner, fit: "contain", background: CLEAR })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < f.data.length; i += 4) {
    f.data[i] = IVORY.r; f.data[i + 1] = IVORY.g; f.data[i + 2] = IVORY.b;
  }
  const glyph = await sharp(f.data, { raw: { width: f.info.width, height: f.info.height, channels: 4 } })
    .png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: ink[0], g: ink[1], b: ink[2], alpha: 1 } } })
    .composite([{ input: glyph, left: Math.floor((size - f.info.width) / 2), top: Math.floor((size - f.info.height) / 2) }])
    .png().toBuffer();
}

for (const s of [16, 32, 48]) writeFileSync(join(BRAND, `favicon-${s}.png`), await faviconAt(s));
writeFileSync(join(BRAND, "apple-touch-icon.png"), await padSquare(emblem, 180, IVORY));
writeFileSync(join(BRAND, "icon-192.png"), await padSquare(emblem, 192, IVORY));
writeFileSync(join(BRAND, "icon-512.png"), await padSquare(emblem, 512, IVORY));
writeFileSync(join(BRAND, "icon-512-transparent.png"), await padSquare(emblem, 512, CLEAR));

/* favicon.ico — PNG-in-ICO wrapper around the 32px icon. */
function pngToIco(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); entry.writeUInt8(32, 1);
  entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8); entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png]);
}
writeFileSync(join(PUB, "favicon.ico"), pngToIco(readFileSync(join(BRAND, "favicon-32.png"))));

/* Social preview — the circular logo centred on brand ivory. */
const ogBg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
     <rect width="1200" height="630" fill="#fbf8f1"/></svg>`
);
await sharp(ogBg)
  .composite([{ input: await sharp(circle).resize({ height: 460 }).png().toBuffer(), gravity: "center" }])
  .png().toFile(join(BRAND, "og-image.png"));

console.log("\n✓ Brand assets generated from the client originals.");
