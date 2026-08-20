/* =============================================================================
   ROUND-3 CLIENT REVIEW — screenshot capture.
   Mobile is the priority this round (client asked for it explicitly), with
   enough desktop to communicate the full composition.

   Requires the review server:  node docs/client-review/.server.mjs   (port 4322)
   Run:  node docs/client-review/round-3/capture.mjs
   ========================================================================== */
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "shots");
mkdirSync(OUT, { recursive: true });
const URL = "http://localhost:4322/round-3/index.html";

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);
if (!CHROME) { console.error("✖ No Chrome/Edge found."); process.exit(1); }

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: "new",
  args: ["--hide-scrollbars", "--force-device-scale-factor=2"],
});

/** Open a page. `still: true` forces reduced-motion so every reveal is settled. */
async function open(w, h, still = true) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
  if (still) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(URL, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 500));
  return page;
}
const save = async (page, name, opts = {}) => {
  const png = join(OUT, `${name}.png`);
  await page.screenshot({ path: png, ...opts });
  await sharp(png).webp({ quality: 88 }).toFile(png.replace(/\.png$/, ".webp"));
  const m = await sharp(png).metadata();
  console.log(`  ${name}  ${m.width}x${m.height}`);
};
/** Scroll a selector to the top of the viewport and capture just that screenful. */
async function section(page, sel, name, offset = 0) {
  await page.evaluate((s, o) => {
    const el = document.querySelector(s);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + o, behavior: "instant" });
  }, sel, offset);
  await new Promise(r => setTimeout(r, 450));
  await save(page, name);
}

/* ---------------------------------------------------------------- MOBILE --- */
console.log("MOBILE 390x844");
{
  const page = await open(390, 844);
  await save(page, "mobile-full", { fullPage: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 350));
  await save(page, "mobile-01-hero");
  await section(page, "#healthcare", "mobile-02-healthcare", -20);
  await section(page, "#pathways", "mobile-03-cards", 220);
  await section(page, ".arch", "mobile-04-architecture", -20);
  await section(page, "footer", "mobile-05-footer", -20);
  // Mobile navigation open — one of the interactions the client asked to see.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click("#burger");
  await new Promise(r => setTimeout(r, 700));
  await save(page, "mobile-06-menu");
  await page.close();
}

/* --------------------------------------------------------------- DESKTOP --- */
console.log("DESKTOP 1440x900");
{
  const page = await open(1440, 900);
  await save(page, "desktop-full", { fullPage: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 350));
  await save(page, "desktop-01-hero");
  await section(page, "#healthcare", "desktop-02-healthcare", -40);
  await section(page, "#pathways", "desktop-03-cards", 120);
  await section(page, "footer", "desktop-04-footer", -60);
  await page.close();
}

/* ------------------------------------------------- HERO MOTION SEQUENCE ---
   Motion cannot be judged from a settled still, so capture the hero reveal at
   three points in its timeline and lay them out left-to-right. */
console.log("HERO MOTION SEQUENCE");
{
  const frames = [];
  for (const [i, ms] of [260, 620, 1500].entries()) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 820, deviceScaleFactor: 2 });
    await page.goto(URL, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, ms));
    const buf = await page.screenshot();
    frames.push({ buf, label: `${(ms / 1000).toFixed(2)}s` });
    console.log(`  frame ${i + 1} @ ${ms}ms`);
    await page.close();
  }
  const W = 560, PAD = 22, HEAD = 44;
  const cols = [];
  for (const f of frames) {
    const img = await sharp(f.buf).resize({ width: W }).png().toBuffer();
    cols.push({ img, h: (await sharp(img).metadata()).height, label: f.label });
  }
  const H = Math.max(...cols.map(c => c.h)) + HEAD + PAD * 2;
  const TOTAL = W * cols.length + PAD * (cols.length + 1);
  const parts = [];
  let x = PAD;
  for (const c of cols) {
    parts.push({
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${HEAD}">
           <text x="0" y="27" font-family="Manrope, Arial, sans-serif" font-size="19"
                 font-weight="700" fill="#241f11">Hero reveal · ${c.label}</text></svg>`),
      left: x, top: PAD,
    });
    parts.push({ input: c.img, left: x, top: PAD + HEAD });
    x += W + PAD;
  }
  const file = join(OUT, "hero-motion-sequence.png");
  await sharp({ create: { width: TOTAL, height: H, channels: 4, background: { r: 236, g: 234, b: 230, alpha: 1 } } })
    .composite(parts).png().toFile(file);
  await sharp(file).webp({ quality: 88 }).toFile(file.replace(/\.png$/, ".webp"));
  console.log(`  hero-motion-sequence  ${TOTAL}x${H}`);
}

await browser.close();
console.log("\n✓ Round-3 shots written to docs/client-review/round-3/shots/");
