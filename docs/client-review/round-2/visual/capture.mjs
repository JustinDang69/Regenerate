/* =============================================================================
   ROUND-2 CLIENT REVIEW — screenshot capture (ARTIFACT PHASE ONLY)
   -----------------------------------------------------------------------------
   Renders visual/mockup.html for each palette at the breakpoints named in the
   brief, then writes PNG + WebP plus a side-by-side comparison sheet.

   Uses the locally installed Chrome via puppeteer-core (no Chromium download).
   Requires the review server:  node docs/client-review/round-2/.server.mjs

   Run:  node docs/client-review/round-2/visual/capture.mjs
   ========================================================================== */
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = dirname(fileURLToPath(import.meta.url));
const BASE = "http://localhost:4321/visual/mockup.html";

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);
if (!CHROME) {
  console.error("✖ No Chrome/Edge found.");
  process.exit(1);
}

const PALETTES = [
  ["a", "Clinical White"],
  ["b", "White + Warm Islands"],
  ["c", "Gallery White"],
];
const VIEWS = [
  ["mobile", 390, 900],
  ["tablet", 768, 1100],
  ["desktop", 1440, 1000],
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars", "--force-device-scale-factor=2"],
});

const shots = {};
for (const [key] of PALETTES) {
  for (const [view, w, h] of VIEWS) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
    await page.goto(`${BASE}?p=${key}`, { waitUntil: "networkidle0" });
    // Let webfonts settle so the serif renders, not a fallback.
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 400));

    const name = `palette-${key}-${view}`;
    const png = join(OUT, `${name}.png`);
    await page.screenshot({ path: png, fullPage: true });
    await sharp(png).webp({ quality: 88 }).toFile(join(OUT, `${name}.webp`));
    const m = await sharp(png).metadata();
    shots[name] = { path: png, w: m.width, h: m.height };
    console.log(`captured ${name}  ${m.width}×${m.height}`);
    await page.close();
  }
}
await browser.close();

/* --- Side-by-side comparison sheets ---------------------------------------
   Same viewport, same scroll position, three palettes — so the client compares
   like-for-like rather than flicking between separate files. */
async function comparison(view, targetW) {
  const cols = [];
  for (const [key, label] of PALETTES) {
    const s = shots[`palette-${key}-${view}`];
    const scaled = await sharp(s.path).resize({ width: targetW }).png().toBuffer();
    const m = await sharp(scaled).metadata();
    cols.push({ buf: scaled, w: m.width, h: m.height, label: `${key.toUpperCase()} — ${label}` });
  }
  const PAD = 28, HEAD = 54;
  const H = Math.max(...cols.map((c) => c.h)) + HEAD + PAD * 2;
  const W = cols.reduce((a, c) => a + c.w, 0) + PAD * (cols.length + 1);
  const parts = [];
  let x = PAD;
  for (const c of cols) {
    parts.push({
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${c.w}" height="${HEAD}">
           <text x="0" y="30" font-family="Manrope, Arial, sans-serif" font-size="21"
                 font-weight="700" fill="#241f11">${c.label}</text>
         </svg>`
      ),
      left: x,
      top: PAD,
    });
    parts.push({ input: c.buf, left: x, top: PAD + HEAD });
    x += c.w + PAD;
  }
  const file = join(OUT, `palette-comparison-${view}.png`);
  await sharp({ create: { width: W, height: H, channels: 4, background: { r: 236, g: 234, b: 230, alpha: 1 } } })
    .composite(parts)
    .png()
    .toFile(file);
  await sharp(file).webp({ quality: 88 }).toFile(file.replace(/\.png$/, ".webp"));
  console.log(`comparison sheet: ${view}  ${W}×${H}`);
}

await comparison("desktop", 620);
await comparison("mobile", 330);

console.log("\n✓ Visual artifacts written.");
