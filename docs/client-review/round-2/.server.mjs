/* Tiny static server for reviewing round-2 artifacts locally. Isolated from the
   Next.js app — serves this folder only, on port 4321. */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
const ROOT = process.cwd();
const TYPES = { ".html":"text/html", ".png":"image/png", ".webp":"image/webp",
  ".jpg":"image/jpeg", ".svg":"image/svg+xml", ".css":"text/css", ".js":"text/javascript", ".md":"text/plain" };
createServer(async (req, res) => {
  try {
    const url = decodeURIComponent(req.url.split("?")[0]);
    const file = join(ROOT, normalize(url === "/" ? "/visual/mockup.html" : url));
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(body);
  } catch { res.writeHead(404).end("not found"); }
}).listen(4321, () => console.log("review server on http://localhost:4321"));
