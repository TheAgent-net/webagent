#!/usr/bin/env bun
/**
 * Slim the puppeteer dump of corgi.insure to the homepage + assets
 * the rendered HTML actually references. Output: site/corgi
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";

const SRC = join(import.meta.dir, "../site/corgi");
const OUT = join(import.meta.dir, "../site/corgi");
const htmlPath = join(SRC, "index.html");
if (!existsSync(htmlPath)) {
  console.error("missing", htmlPath, "— run bun experiment/mirror-corgi.ts first");
  process.exit(1);
}

let html = readFileSync(htmlPath, "utf8");
html = html.replaceAll("https://www.corgi.insure", "");
html = html.replaceAll("https://corgi.insure", "");
html = html.replace(/<script[^>]+src="https?:\/\/[^"]*googletagmanager[^"]*"[^>]*><\/script>/gi, "");
html = html.replace(/<script[^>]+src="https?:\/\/[^"]*hs-scripts[^"]*"[^>]*><\/script>/gi, "");
html = html.replace(/<link[^>]+href="https?:\/\/[^"]*(googletagmanager|hs-scripts|hotjar|segment|sentry)[^"]*"[^>]*>/gi, "");

const refs = new Set<string>();
const re = /(?:src|href)=["']([^"']+)["']/g;
let m: RegExpExecArray | null;
while ((m = re.exec(html))) refs.add(m[1]);
const imgRe = /url\((['"]?)([^'")]+)\1\)/g;
while ((m = imgRe.exec(html))) refs.add(m[2]);

function localRel(raw: string): string | null {
  let u = raw.trim();
  if (!u || u.startsWith("data:") || u.startsWith("mailto:") || u.startsWith("javascript:")) return null;
  if (u.startsWith("//")) u = "https:" + u;
  try {
    if (u.startsWith("http")) {
      const parsed = new URL(u);
      if (!/corgi\.insure$/.test(parsed.hostname.replace(/^www\./, ""))) return null;
      u = parsed.pathname + parsed.search;
    }
  } catch {
    return null;
  }
  if (u.startsWith("/_next/image")) {
    const q = u.includes("?") ? u.slice(u.indexOf("?") + 1) : "";
    return "_next/image__q_" + encodeURIComponent(q);
  }
  let path = decodeURIComponent(u.split("?")[0] || "");
  if (path.endsWith("/")) path += "index.html";
  if (u.includes("?")) path += "__q_" + encodeURIComponent(u.slice(u.indexOf("?") + 1));
  return path.replace(/^\//, "");
}

let copied = 0;
let missing = 0;
for (const ref of refs) {
  const rel = localRel(ref);
  if (!rel) continue;
  const from = join(SRC, rel);
  if (!existsSync(from)) {
    missing++;
    continue;
  }
  const to = join(OUT, rel);
  mkdirSync(dirname(to), { recursive: true });
  if (normalize(from) !== normalize(to)) copyFileSync(from, to);
  copied++;
}

writeFileSync(join(OUT, "index.html"), html);
console.error("kept", copied, "assets,", missing, "missing refs");
