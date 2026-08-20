/* Round-2 treatment mockup capture (artifact phase only). Requires .server.mjs. */
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const OUT = dirname(fileURLToPath(import.meta.url));
const BASE = "http://localhost:4321/treatments/mockup.html";
const CHROME = ["C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(existsSync);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new",
  args: ["--hide-scrollbars", "--force-device-scale-factor=2"] });
for (const [view, file] of [["index","treatments-index"],["detail","treatment-detail"],["patterns","treatment-patterns"]]) {
  for (const [label, w, h] of [["mobile",390,900],["desktop",1440,1000]]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
    await page.goto(`${BASE}?v=${view}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 350));
    const png = join(OUT, `${file}-${label}.png`);
    await page.screenshot({ path: png, fullPage: true });
    await sharp(png).webp({ quality: 88 }).toFile(png.replace(/\.png$/, ".webp"));
    const m = await sharp(png).metadata();
    console.log(`captured ${file}-${label}  ${m.width}x${m.height}`);
    await page.close();
  }
}
await browser.close();
console.log("\nTreatment artifacts written.");
