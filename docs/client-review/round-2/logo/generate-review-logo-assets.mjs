/* =============================================================================
   ROUND-2 CLIENT REVIEW — logo asset derivation (ARTIFACT PHASE ONLY)
   -----------------------------------------------------------------------------
   Derives a review brand system from the TWO client-supplied logo files:

     source/regenerate-circle-original.jpg   → primary circular logo
     source/regenerate-lockup-original.jpg   → secondary stacked lockup

   Nothing here is wired into the production app. Outputs stay inside
   docs/client-review/round-2/logo/ for client review only.

   The artwork is never redrawn — only background-removed, cropped along
   detected bands, scaled and re-encoded.

   Run:  node docs/client-review/round-2/logo/generate-review-logo-assets.mjs
   ========================================================================== */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "source");
const OUT = HERE;
mkdirSync(OUT, { recursive: true });

const IVORY = { r: 251, g: 248, b: 241, alpha: 1 };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

/* -----------------------------------------------------------------------------
   1. White-background removal that preserves ORIGINAL ink colours.

   Both files are flattened JPEGs on white. Unlike round one, the circular file
   carries more than one ink (a darker ring around the olive artwork), so we
   cannot repaint every pixel a single colour.

   Alpha comes from how far a pixel sits from white, normalised against the
   luminance of SOLID ink (2nd percentile, not the absolute minimum — a single
   stray dark pixel would otherwise skew the whole image). Original RGB is kept
   as-is.

   Note we deliberately do NOT un-premultiply. Doing so assumes a pixel's
   lightness is purely partial coverage, but here it is mostly just the ink's own
   colour — un-premultiplying crushed the olive to near-black. Keeping the source
   RGB preserves both inks exactly; solid areas reach alpha 1 and only the thin
   anti-aliased edge keeps a trace of white, which is invisible against the
   white/near-white grounds these palettes propose.
--------------------------------------------------------------------------------*/
async function removeWhite(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Luminance histogram of non-white pixels → 2nd-percentile "solid ink" level.
  const hist = new Uint32Array(256);
  let inked = 0;
  for (let i = 0; i < data.length; i += C) {
    const l = Math.round(lum(data[i], data[i + 1], data[i + 2]));
    if (l < 245) { hist[l]++; inked++; }
  }
  let acc = 0, lSolid = 0;
  const target = inked * 0.02;
  for (let l = 0; l < 256; l++) {
    acc += hist[l];
    if (acc >= target) { lSolid = l; break; }
  }
  // Guard against a near-white image producing a divide-by-zero.
  const span = Math.max(40, 255 - lSolid);

  const out = Buffer.alloc(W * H * 4);
  for (let i = 0, o = 0; i < data.length; i += C, o += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const a = Math.min(1, Math.max(0, (255 - lum(r, g, b)) / span));
    if (a < 0.02) {
      out[o] = out[o + 1] = out[o + 2] = out[o + 3] = 0;
      continue;
    }
    out[o] = r;
    out[o + 1] = g;
    out[o + 2] = b;
    out[o + 3] = Math.round(a * 255);
  }
  return { buf: out, W, H, lSolid };
}

/* -----------------------------------------------------------------------------
   2. Horizontal band detection — splits a stacked lockup into its rows
      (mark / "regenerate" / "SKIN & HAIR CLINIC") by finding blank rows.
--------------------------------------------------------------------------------*/
function detectBands(raw, W, H, { threshold = 25, mergeGap = 6 } = {}) {
  const rowHas = [];
  for (let y = 0; y < H; y++) {
    let hit = 0;
    for (let x = 0; x < W; x++) {
      if (raw[(y * W + x) * 4 + 3] > threshold) { hit = 1; break; }
    }
    rowHas.push(hit);
  }
  const bands = [];
  for (let y = 0, s = null; y <= H; y++) {
    if (y < H && rowHas[y] && s === null) s = y;
    if ((y === H || !rowHas[y]) && s !== null) { bands.push([s, y - 1]); s = null; }
  }
  const merged = [];
  for (const b of bands) {
    const last = merged[merged.length - 1];
    if (last && b[0] - last[1] <= mergeGap) last[1] = b[1];
    else merged.push([...b]);
  }
  // Drop hairline noise bands.
  return merged.filter((b) => b[1] - b[0] >= 4);
}

/** Column extent of a row range, so crops hug the artwork. */
function colExtent(raw, W, y0, y1, threshold = 25) {
  let x0 = W, x1 = -1;
  for (let y = y0; y <= y1; y++)
    for (let x = 0; x < W; x++)
      if (raw[(y * W + x) * 4 + 3] > threshold) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
      }
  return [x0, x1];
}

const toPng = (raw, W, H) =>
  sharp(raw, { raw: { width: W, height: H, channels: 4 } }).png();

/** Write a PNG + WebP pair. */
async function writePair(buffer, name) {
  await sharp(buffer).png().toFile(join(OUT, `${name}.png`));
  await sharp(buffer).webp({ quality: 92 }).toFile(join(OUT, `${name}.webp`));
}

/* =============================================================================
   PRIMARY — circular logo
   ========================================================================== */
const circle = await removeWhite(join(SRC, "regenerate-circle-original.jpg"));
const circleTrimmed = await toPng(circle.buf, circle.W, circle.H)
  .trim({ threshold: 1 })
  .png()
  .toBuffer();
{
  const m = await sharp(circleTrimmed).metadata();
  console.log(`Primary circle: ${m.width}×${m.height}`);
}
await writePair(circleTrimmed, "primary-circle-transparent");

/* =============================================================================
   SECONDARY — stacked lockup, plus the emblem crops taken from it
   ========================================================================== */
const lock = await removeWhite(join(SRC, "regenerate-lockup-original.jpg"));
const lockPng = await toPng(lock.buf, lock.W, lock.H).trim({ threshold: 1 }).png().toBuffer();
await writePair(lockPng, "secondary-lockup-transparent");

// Re-read the trimmed lockup so band coordinates match the exported file.
const lockRaw = await sharp(lockPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const LW = lockRaw.info.width, LH = lockRaw.info.height;
const bands = detectBands(lockRaw.data, LW, LH);
console.log(`Secondary lockup: ${LW}×${LH}, ${bands.length} bands`);
bands.forEach((b, i) => console.log(`  band ${i}: rows ${b[0]}–${b[1]} (h ${b[1] - b[0] + 1})`));

if (bands.length < 2) {
  console.error("✖ Expected at least a mark band and a wordmark band.");
  process.exit(1);
}

/** Crop a band range [from..to] inclusive, hugging its columns. */
async function cropBands(from, to) {
  const y0 = bands[from][0];
  const y1 = bands[to][1];
  const [x0, x1] = colExtent(lockRaw.data, LW, y0, y1);
  return sharp(lockPng)
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .png()
    .toBuffer();
}

/* THE EMBLEM — R + curved stems + dandelions together (band 0 only).
   Deliberately NOT a lone dandelion head: the client asked for the full emblem
   as the background/watermark device. */
const emblem = await cropBands(0, 0);
await writePair(emblem, "brand-emblem");
{
  const m = await sharp(emblem).metadata();
  console.log(`Emblem (R + stems + dandelions): ${m.width}×${m.height}`);
}

/* FOOTER OPTION 1 — emblem + "regenerate" */
const emblemWordmark = await cropBands(0, 1);
await writePair(emblemWordmark, "brand-emblem-wordmark");

/* FOOTER OPTION 2 — emblem + "regenerate" + "SKIN & HAIR CLINIC"
   (only when the lockup actually has a third band). */
if (bands.length >= 3) {
  const full = await cropBands(0, 2);
  await writePair(full, "brand-emblem-wordmark-full");
  console.log("Wrote brand-emblem-wordmark-full (includes SKIN & HAIR CLINIC)");
}

/* =============================================================================
   FAVICONS & APP ICONS — derived from the EMBLEM
   -----------------------------------------------------------------------------
   The full circular logo contains small type that turns to mush at 16–48px, so
   icons use the emblem. Small favicons additionally reverse it out of an olive
   chip, which keeps them visible on both light and dark browser tab bars.
   (Round one established this; the round-2 emblem simply replaces the artwork.)
   ========================================================================== */
async function padSquare(input, size, background, inset = 0.84) {
  const inner = Math.round(size * inset);
  const fitted = await sharp(input)
    .resize({ width: inner, height: inner, fit: "contain", background: CLEAR })
    .png()
    .toBuffer();
  const m = await sharp(fitted).metadata();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([
      { input: fitted, left: Math.floor((size - m.width) / 2), top: Math.floor((size - m.height) / 2) },
    ])
    .png()
    .toBuffer();
}

// Measure the emblem's dominant ink so the favicon chip matches the brand.
const emRaw = await sharp(emblem).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let ir = 0, ig = 0, ib = 0, n = 0;
for (let i = 0; i < emRaw.data.length; i += 4) {
  if (emRaw.data[i + 3] > 200) { ir += emRaw.data[i]; ig += emRaw.data[i + 1]; ib += emRaw.data[i + 2]; n++; }
}
const ink = n ? [Math.round(ir / n), Math.round(ig / n), Math.round(ib / n)] : [92, 79, 19];
console.log(`Emblem ink: rgb(${ink.join(", ")})`);

/** Small favicon: ivory emblem reversed out of an olive chip. */
async function faviconAt(size) {
  const inner = Math.round(size * 0.78);
  const fitted = await sharp(emblem)
    .resize({ width: inner, height: inner, fit: "contain", background: CLEAR })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < fitted.data.length; i += 4) {
    fitted.data[i] = IVORY.r; fitted.data[i + 1] = IVORY.g; fitted.data[i + 2] = IVORY.b;
  }
  const glyph = await sharp(fitted.data, {
    raw: { width: fitted.info.width, height: fitted.info.height, channels: 4 },
  }).png().toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: ink[0], g: ink[1], b: ink[2], alpha: 1 } },
  })
    .composite([
      {
        input: glyph,
        left: Math.floor((size - fitted.info.width) / 2),
        top: Math.floor((size - fitted.info.height) / 2),
      },
    ])
    .png()
    .toBuffer();
}

for (const s of [16, 32, 48]) {
  writeFileSync(join(OUT, `favicon-${s}.png`), await faviconAt(s));
}
writeFileSync(join(OUT, "apple-touch-icon.png"), await padSquare(emblem, 180, IVORY));
writeFileSync(join(OUT, "icon-192.png"), await padSquare(emblem, 192, IVORY));
writeFileSync(join(OUT, "icon-512.png"), await padSquare(emblem, 512, IVORY));

/* =============================================================================
   CONTACT SHEET — every variant, at realistic sizes, on light and dark grounds
   ========================================================================== */
const SHEET_W = 1600;
/** SVG text labels — XML-escape the copy or a bare "&" breaks the parser. */
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const label = (text, size = 20, colour = "#57503f") =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SHEET_W}" height="${size + 12}">
       <text x="0" y="${size}" font-family="Manrope, Arial, sans-serif" font-size="${size}"
             font-weight="600" fill="${colour}" letter-spacing="1.5">${esc(text)}</text>
     </svg>`
  );

const row = async (img, height) =>
  sharp(img).resize({ height }).png().toBuffer();

const parts = [];
let y = 40;
const push = async (input, left, top) => { parts.push({ input, left, top }); };

await push(label("REGENERATE — ROUND 2 LOGO CONTACT SHEET", 30, "#241f11"), 48, y); y += 60;
await push(label("Primary circular logo — header sizes (40 / 56 / 72 / 96px tall)"), 48, y); y += 40;
let x = 48;
for (const h of [40, 56, 72, 96]) {
  await push(await row(circleTrimmed, h), x, y + (96 - h) / 2);
  x += Math.round(h * 1.15) + 48;
}
y += 130;

await push(label("Secondary stacked lockup (56 / 80 / 110px tall)"), 48, y); y += 40;
x = 48;
for (const h of [56, 80, 110]) {
  const b = await row(lockPng, h);
  const m = await sharp(b).metadata();
  await push(b, x, y + (110 - h) / 2);
  x += m.width + 56;
}
y += 150;

await push(label("Brand emblem — for background watermark (60 / 90 / 130px tall)"), 48, y); y += 40;
x = 48;
for (const h of [60, 90, 130]) {
  const b = await row(emblem, h);
  const m = await sharp(b).metadata();
  await push(b, x, y + (130 - h) / 2);
  x += m.width + 56;
}
y += 170;

await push(label("Footer option 1 — emblem + regenerate     |     Footer option 2 — + SKIN & HAIR CLINIC"), 48, y); y += 40;
{
  const a = await row(emblemWordmark, 110);
  const am = await sharp(a).metadata();
  await push(a, 48, y);
  if (bands.length >= 3) {
    const full = await cropBands(0, 2);
    const b = await row(full, 110);
    await push(b, 48 + am.width + 120, y);
  }
}
y += 150;

await push(label("Favicons & app icons (16 / 32 / 48 / 180 / 192)"), 48, y); y += 40;
x = 48;
for (const [file, size] of [["favicon-16.png", 16], ["favicon-32.png", 32], ["favicon-48.png", 48], ["apple-touch-icon.png", 96], ["icon-192.png", 96]]) {
  await push(await sharp(join(OUT, file)).resize(size, size).png().toBuffer(), x, y + (96 - size) / 2);
  x += size + 48;
}
y += 140;

const SHEET_H = y + 40;
await sharp({ create: { width: SHEET_W, height: SHEET_H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
  .composite(parts)
  .png()
  .toFile(join(OUT, "logo-contact-sheet.png"));
await sharp(join(OUT, "logo-contact-sheet.png"))
  .webp({ quality: 92 })
  .toFile(join(OUT, "logo-contact-sheet.webp"));

console.log(`\n✓ Review logo assets written to ${OUT}`);
