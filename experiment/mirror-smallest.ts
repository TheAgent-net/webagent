#!/usr/bin/env bun
/**
 * Capture https://smallest.ai/ after JS render, plus Framer CDN assets.
 * Run: bun experiment/mirror-smallest.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import puppeteer from "puppeteer-core";

const ORIGIN = "https://smallest.ai";
const OUT = join(import.meta.dir, "../site/smallest");
const SKIP =
  /google-analytics|googletagmanager|gtag\/|facebook\.net|hotjar|segment\.io|sentry\.io|intercom|doubleclick|adsystem|clarity\.ms|cloudflareinsights|google-analytics|hs-scripts|lfeeder|factors\.ai/i;
const KEEP_HOST = /^(?:www\.)?(?:smallest\.ai|framerusercontent\.com)$/i;

function localPath(urlStr: string): string | null {
  let u: URL;
  try {
    u = new URL(urlStr);
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  if (SKIP.test(u.href)) return null;
  const host = u.hostname.replace(/^www\./, "");
  if (!KEEP_HOST.test(host)) return null;
  if (u.pathname.startsWith("/edit")) return null;
  let path = decodeURIComponent(u.pathname);
  if (path.endsWith("/")) path += "index.html";
  if (!path || path === "") path = "/index.html";
  if (u.search) {
    const q = encodeURIComponent(u.search.slice(1));
    path += "__q_" + (q.length > 80 ? Bun.hash(u.search).toString(16) : q);
  }
  if (host === "smallest.ai") return path.replace(/^\//, "");
  return join("_ext", host, path.replace(/^\//, ""));
}

const chrome = process.env.CHROME || ["/usr/bin/google-chrome", "/usr/local/bin/google-chrome", "/opt/google/chrome/chrome"].find((p) => {
  try {
    return Bun.file(p).size >= 0;
  } catch {
    return false;
  }
});

const browser = await puppeteer.launch({
  executablePath: chrome || "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--window-size=1440,900"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.setUserAgent(
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
);

const saved = new Map<string, string>();
page.on("response", async (res) => {
  const url = res.url();
  const dest = localPath(url);
  if (!dest || saved.has(url)) return;
  if (res.status() >= 400) return;
  const buf = await res.buffer().catch(() => null);
  if (!buf || buf.byteLength === 0) return;
  saved.set(url, dest);
  const file = join(OUT, dest);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, buf);
});

await page.goto(ORIGIN + "/", { waitUntil: "networkidle2", timeout: 120_000 });
await page.waitForSelector("h1, [data-framer-name], main", { timeout: 30_000 }).catch(() => {});
await new Promise((r) => setTimeout(r, 4000));
await page.evaluate(async () => {
  const step = window.innerHeight;
  const max = Math.min(document.body.scrollHeight, 8000);
  for (let y = 0; y <= max; y += step) {
    window.scrollTo(0, y);
    await new Promise((ok) => setTimeout(ok, 250));
  }
  window.scrollTo(0, 0);
});
await new Promise((r) => setTimeout(r, 2500));

let html = await page.content();
html = rewriteHtml(html);
await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, "index.html"), html);
await writeFile(
  join(OUT, "manifest.json"),
  JSON.stringify({ origin: ORIGIN, captured: new Date().toISOString(), files: [...saved.entries()] }, null, 2),
);

await browser.close();
console.error("saved", saved.size, "assets into", OUT);

function rewriteHtml(src: string): string {
  return src
    .replaceAll("https://www.smallest.ai", "")
    .replaceAll("https://smallest.ai", "")
    .replaceAll("http://smallest.ai", "")
    .replaceAll("https://framerusercontent.com", "/_ext/framerusercontent.com")
    .replaceAll("http://framerusercontent.com", "/_ext/framerusercontent.com")
    .replaceAll("//framerusercontent.com", "/_ext/framerusercontent.com")
    .replace(/<script[^>]+src="[^"]*(googletagmanager|gtag|facebook\.net|hotjar|segment|sentry|clarity)[^"]*"[^>]*><\/script>/gi, "")
    .replace(/<link[^>]+href="[^"]*(googletagmanager|hotjar|segment|sentry)[^"]*"[^>]*>/gi, "");
}
