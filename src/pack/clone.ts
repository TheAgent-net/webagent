import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";

export const TRACKER =
  /google-analytics|googletagmanager|gtag\/|facebook\.net|hotjar|segment\.io|sentry\.io|intercom|doubleclick|adsystem|clarity\.ms|cloudflareinsights|hs-scripts|lfeeder|factors\.ai|redditstatic\.com\/ads|dubcdn\.com\/analytics|snap\.licdn|ads-twitter|posthog\.com|promptwatch|snitcher\.com|pixel-config\.reddit|cdn-cgi\/challenge|cdn-cgi\/speculation|\/orange\/array|\/orange\/static|\/orange\/flags/i;

const TEXT_EXT = new Set([".html", ".css", ".js", ".mjs", ".cjs", ".json", ".svg", ".xml", ".txt", ".webmanifest", ".map"]);
const ASSET_EXT = /\.(css|js|mjs|cjs|json|svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|map|txt|xml|webmanifest|md|html|htm|mp4|webm|mp3|pdf|wasm)$/i;
const MIN_HTML = 8 * 1024;
const MIN_FILES = 5;
const MAX_ASSET = 8 * 1024 * 1024;
const WIDGET_HOOK = '<script src="{{WIDGET_JS}}"></script>';

const CHROME_CANDIDATES = [
  process.env.CHROME,
  "/usr/bin/google-chrome",
  "/usr/local/bin/google-chrome",
  "/opt/google/chrome/chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter((p): p is string => !!p);

export interface CloneManifest {
  origin: string;
  landed?: string;
  captured: string;
  pixel: true;
  files: [string, string][];
}

export interface CloneResult {
  origin: string;
  landed: string;
  out: string;
  files: number;
  bytes: number;
  htmlBytes: number;
  fresh: boolean;
}

export interface PixelCheck {
  ok: boolean;
  reason?: string;
  files?: number;
  htmlBytes?: number;
}

export interface CloneOpts {
  origin: string;
  out: string;
  chrome?: string;
  keepHosts?: string[];
}

export interface EnsureCloneOpts {
  origin: string;
  out: string;
  refresh?: boolean;
  chrome?: string | false;
}

export function findChrome(explicit?: string): string | undefined {
  const list = explicit ? [explicit, ...CHROME_CANDIDATES] : CHROME_CANDIDATES;
  for (const p of list) {
    if (p && existsSync(p)) return p;
  }
  return undefined;
}

export function originHosts(origin: string): string[] {
  let host = "";
  try {
    host = new URL(origin).hostname.replace(/^www\./, "");
  } catch {
    return [];
  }
  if (!host) return [];
  return [host, "www." + host];
}

export function localAssetPath(urlStr: string, origin: string, extraOrigins: string[] = []): string | null {
  let u: URL;
  try {
    u = new URL(urlStr);
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  if (TRACKER.test(u.href)) return null;
  if (/\.(mp4|webm|mov)(?:$|\?)/i.test(u.pathname)) return null;
  if (u.pathname.startsWith("/edit")) return null;
  let path: string;
  try {
    path = decodeURIComponent(u.pathname);
  } catch {
    path = u.pathname;
  }
  if (path.endsWith("/")) path += "index.html";
  if (!path) path = "/index.html";
  if (!ASSET_EXT.test(path) && !path.endsWith("/index.html")) path = path.replace(/\/?$/, "/index.html");
  if (u.search) {
    const q = encodeURIComponent(u.search.slice(1));
    const hash = Bun.hash(u.search).toString(16);
    path += "__q_" + (q.length > 80 ? hash : q);
  }
  const host = u.hostname.replace(/^www\./, "");
  const homes = new Set([...originHosts(origin), ...extraOrigins.flatMap(originHosts)].map((h) => h.replace(/^www\./, "")));
  if (homes.has(host)) return path.replace(/^\//, "");
  return ["_ext", host, path.replace(/^\//, "")].join("/");
}

export function rewriteCaptured(src: string, origin: string, extraOrigins: string[] = [], capturedHosts: string[] = []): string {
  const homes = unique([...originHosts(origin), ...extraOrigins.flatMap(originHosts)]).map((h) => h.replace(/^www\./, ""));
  const cdn = unique(capturedHosts.map((h) => h.replace(/^www\./, ""))).filter((h) => !homes.includes(h));
  const hosts = unique([...homes, ...cdn]);
  hosts.sort((a, b) => b.length - a.length);
  let out = src;
  for (const host of hosts) {
    const bare = host.replace(/^www\./, "");
    const local = homes.includes(bare) ? "" : "/_ext/" + bare;
    for (const form of hostForms(host)) {
      out = out.split(form).join(local);
      out = out.split(form.replace(/\//g, "\\/")).join(local ? local.replace(/\//g, "\\/") : "");
    }
  }
  return out
    .replace(/<script[^>]+src="[^"]*(googletagmanager|gtag\/|facebook\.net|hotjar|segment|sentry|clarity|cloudflareinsights|redditstatic|dubcdn\.com\/analytics|snap\.licdn|ads-twitter|posthog)[^"]*"[^>]*><\/script>/gi, "")
    .replace(/<link[^>]+href="[^"]*(googletagmanager|hotjar|segment|sentry)[^"]*"[^>]*>/gi, "")
    .replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "")
    .replace(/\s+integrity=(["']).*?\1/gi, "");
}

export function injectWidget(html: string): string {
  if (html.includes("{{WIDGET_JS}}")) return html;
  const cleaned = html.replace(/<script[^>]+src="[^"]*widget\.js[^"]*"[^>]*><\/script>/gi, "");
  if (/<\/body>/i.test(cleaned)) return cleaned.replace(/<\/body>/i, "  " + WIDGET_HOOK + "\n</body>");
  return cleaned + "\n" + WIDGET_HOOK + "\n";
}

export function isPixelClone(dir: string): PixelCheck {
  const index = join(dir, "index.html");
  if (!existsSync(index) || !statSync(index).isFile()) return { ok: false, reason: "missing index.html" };
  const htmlBytes = statSync(index).size;
  if (htmlBytes < MIN_HTML) return { ok: false, reason: "index.html is a stub (" + htmlBytes + " bytes)", htmlBytes };
  const html = readFileSync(index, "utf8");
  if (!html.includes("{{WIDGET_JS}}")) return { ok: false, reason: "cloned page is missing the widget hook", htmlBytes };
  if (/this is a demo site/i.test(html) && htmlBytes < 20_000) {
    return { ok: false, reason: "index.html looks like a hand-written stub", htmlBytes };
  }
  const manifestPath = join(dir, "manifest.json");
  if (!existsSync(manifestPath)) return { ok: false, reason: "missing manifest.json", htmlBytes };
  let files = 0;
  try {
    const man = JSON.parse(readFileSync(manifestPath, "utf8")) as Partial<CloneManifest>;
    files = Array.isArray(man.files) ? man.files.length : 0;
    if (man.pixel !== true && files < MIN_FILES) return { ok: false, reason: "manifest is not a pixel clone", files, htmlBytes };
  } catch {
    return { ok: false, reason: "manifest.json is not valid JSON", htmlBytes };
  }
  const onDisk = countFiles(dir);
  if (onDisk < MIN_FILES || files < MIN_FILES) {
    return { ok: false, reason: "too few captured files (" + onDisk + ")", files: onDisk, htmlBytes };
  }
  return { ok: true, files: onDisk, htmlBytes };
}

export async function ensureDemoClone(opts: EnsureCloneOpts): Promise<CloneResult> {
  const origin = opts.origin.replace(/\/+$/, "");
  if (!origin) throw new Error("pixel clone needs pack.origin");
  if (!opts.refresh) {
    const have = isPixelClone(opts.out);
    if (have.ok) {
      return {
        origin,
        landed: readLanded(opts.out) || origin,
        out: opts.out,
        files: have.files || 0,
        bytes: dirBytes(opts.out),
        htmlBytes: have.htmlBytes || 0,
        fresh: false,
      };
    }
  }
  if (opts.chrome === false) {
    throw new Error(
      "pixel clone requires Chrome. Install Google Chrome or set CHROME. webagent demo will not serve a stub page.",
    );
  }
  const chrome = findChrome(opts.chrome === undefined ? undefined : opts.chrome);
  if (!chrome) {
    throw new Error(
      "pixel clone requires Chrome. Install Google Chrome or set CHROME=/path/to/chrome. webagent demo will not serve a stub page.",
    );
  }
  const tmp = opts.out.replace(/\/+$/, "") + ".cloning";
  rmSync(tmp, { recursive: true, force: true });
  try {
    const got = await cloneOrigin({ origin, out: tmp, chrome });
    const check = isPixelClone(tmp);
    if (!check.ok) {
      throw new Error("clone of " + origin + " is not a pixel snapshot: " + (check.reason || "unknown"));
    }
    mkdirSync(dirname(opts.out), { recursive: true });
    rmSync(opts.out, { recursive: true, force: true });
    renameSync(tmp, opts.out);
    return { ...got, out: opts.out, fresh: true };
  } catch (err) {
    rmSync(tmp, { recursive: true, force: true });
    throw err;
  }
}

export async function resolveLanded(origin: string): Promise<string> {
  try {
    const res = await fetch(origin.replace(/\/+$/, "") + "/", { redirect: "follow" });
    return res.url || origin;
  } catch {
    return origin;
  }
}

export async function cloneOrigin(opts: CloneOpts): Promise<CloneResult> {
  const chrome = opts.chrome || findChrome();
  if (!chrome) {
    throw new Error("pixel clone requires Chrome. Install Google Chrome or set CHROME=/path/to/chrome.");
  }
  const puppeteer = await import("puppeteer-core");
  const start = opts.origin.replace(/\/+$/, "") + "/";
  let landed = await resolveLanded(opts.origin);
  mkdirSync(opts.out, { recursive: true });

  const browser = await puppeteer.default.launch({
    executablePath: chrome,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--window-size=1440,900"],
  });

  const saved = new Map<string, string>();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    );
    page.on("response", async (res) => {
      const url = res.url();
      if (saved.has(url)) return;
      if (res.status() >= 400) return;
      let dest = localAssetPath(url, opts.origin, [landed]);
      if (!dest) return;
      const buf = await res.buffer().catch(() => null);
      if (!buf || buf.byteLength === 0 || buf.byteLength > MAX_ASSET) return;
      dest = writeAsset(opts.out, dest, buf);
      saved.set(url, dest);
    });

    await page.goto(start, { waitUntil: "networkidle2", timeout: 120_000 });
    landed = page.url() || landed;
    await page.waitForSelector("h1, [data-framer-name], main, [data-astro-cid], body", { timeout: 30_000 }).catch(() => {});
    await page.evaluate(() => (document as { fonts?: { ready?: Promise<unknown> } }).fonts?.ready).catch(() => {});
    await sleep(3000);
    await page.evaluate(async () => {
      const step = window.innerHeight || 800;
      const max = Math.min(document.body?.scrollHeight || 0, 10_000);
      for (let y = 0; y <= max; y += step) {
        window.scrollTo(0, y);
        await new Promise((ok) => setTimeout(ok, 220));
      }
      window.scrollTo(0, 0);
    });
    await sleep(2000);

    let html = await page.content();
    const extras = unique([opts.origin, landed, ...(opts.keepHosts || [])]);
    const capturedHosts = hostsFromSaved(saved);
    html = injectWidget(rewriteCaptured(html, opts.origin, extras, capturedHosts));
    writeFileSync(join(opts.out, "index.html"), html);
    await harvestMissing(html, opts.origin, extras, opts.out, saved);
    hoistOriginExt(opts.out, opts.origin, landed, saved);
    rewriteTree(opts.out, opts.origin, extras, hostsFromSaved(saved));
    const index = join(opts.out, "index.html");
    writeFileSync(index, injectWidget(readFileSync(index, "utf8")));

    const files = [...saved.entries()] as [string, string][];
    const manifest: CloneManifest = {
      origin: opts.origin,
      landed,
      captured: new Date().toISOString(),
      pixel: true,
      files,
    };
    writeFileSync(join(opts.out, "manifest.json"), JSON.stringify(manifest, null, 2));
    return {
      origin: opts.origin,
      landed,
      out: opts.out,
      files: files.length,
      bytes: dirBytes(opts.out),
      htmlBytes: statSync(index).size,
      fresh: true,
    };
  } finally {
    await browser.close().catch(() => {});
  }
}

async function harvestMissing(
  html: string,
  origin: string,
  extras: string[],
  out: string,
  saved: Map<string, string>,
): Promise<void> {
  const base = extras[1] || origin;
  const urls = extractUrls(html, base);
  for (const url of urls) {
    if (saved.has(url)) continue;
    let dest = localAssetPath(url, origin, extras);
    if (!dest) continue;
    if (dest.startsWith("_ext/") && !ASSET_EXT.test(dest)) continue;
    if (dest.endsWith("/index.html") && dest !== "index.html") continue;
    const buf = await fetch(url)
      .then((r) => (r.ok ? r.arrayBuffer() : null))
      .catch(() => null);
    if (!buf || buf.byteLength === 0 || buf.byteLength > MAX_ASSET) continue;
    dest = writeAsset(out, dest, Buffer.from(buf));
    saved.set(url, dest);
  }
}

function rewriteTree(root: string, origin: string, extras: string[], capturedHosts: string[]): void {
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop()!;
    for (const name of readdirSync(dir)) {
      const abs = join(dir, name);
      const st = statSync(abs);
      if (st.isDirectory()) {
        stack.push(abs);
        continue;
      }
      if (name === "manifest.json") continue;
      if (!TEXT_EXT.has(extname(name).toLowerCase()) && !name.endsWith(".webmanifest")) continue;
      if (st.size > MAX_ASSET) continue;
      const raw = readFileSync(abs, "utf8");
      const next = rewriteCaptured(raw, origin, extras, capturedHosts);
      if (next !== raw) writeFileSync(abs, next);
    }
  }
}

function hoistOriginExt(out: string, origin: string, landed: string, saved: Map<string, string>): void {
  const hosts = unique([...originHosts(origin), ...originHosts(landed)].map((h) => h.replace(/^www\./, "")));
  for (const host of hosts) {
    const ext = join(out, "_ext", host);
    if (!existsSync(ext) || !statSync(ext).isDirectory()) continue;
    moveTree(ext, out);
    rmSync(ext, { recursive: true, force: true });
    const prefix = "_ext/" + host + "/";
    for (const [url, dest] of saved) {
      if (dest.startsWith(prefix)) saved.set(url, dest.slice(prefix.length));
      else if (dest === "_ext/" + host) saved.set(url, "index.html");
    }
  }
}

function moveTree(src: string, dest: string): void {
  for (const name of readdirSync(src)) {
    const from = join(src, name);
    const to = join(dest, name);
    const st = statSync(from);
    if (st.isDirectory()) {
      mkdirSync(to, { recursive: true });
      moveTree(from, to);
      continue;
    }
    if (name === "index.html" && existsSync(to) && statSync(to).size > MIN_HTML) continue;
    mkdirSync(dirname(to), { recursive: true });
    writeFileSync(to, readFileSync(from));
  }
}

function writeAsset(out: string, dest: string, buf: Buffer | Uint8Array): string {
  dest = dest.replace(/^\/+/, "");
  let file = join(out, dest);
  if (existsSync(file) && statSync(file).isDirectory()) {
    dest = dest.replace(/\/?$/, "") + "/index.html";
    file = join(out, dest);
  }
  const parent = dirname(file);
  if (existsSync(parent) && statSync(parent).isFile()) {
    const tmp = parent + ".asset";
    renameSync(parent, tmp);
    mkdirSync(parent, { recursive: true });
    renameSync(tmp, join(parent, "index.html"));
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, buf);
  return dest;
}

function hostsFromSaved(saved: Map<string, string>): string[] {
  const hosts: string[] = [];
  for (const url of saved.keys()) {
    try {
      hosts.push(new URL(url).hostname);
    } catch {
      /* skip */
    }
  }
  return unique(hosts);
}

function extractUrls(src: string, base: string): string[] {
  const found = new Set<string>();
  const re = /(?:url\(|src=|href=|srcset=)["']?([^"')\s,]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const raw = m[1];
    if (!raw || raw.startsWith("data:") || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("javascript:")) continue;
    try {
      found.add(new URL(raw, base).href);
    } catch {
      /* skip */
    }
  }
  return [...found];
}

function hostForms(host: string): string[] {
  const bare = host.replace(/^www\./, "");
  const names = unique([host, bare, "www." + bare]);
  const out: string[] = [];
  for (const n of names) {
    out.push("https://" + n, "http://" + n, "//" + n);
  }
  return unique(out);
}

function readLanded(dir: string): string | undefined {
  try {
    const man = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8")) as CloneManifest;
    return man.landed || man.origin;
  } catch {
    return undefined;
  }
}

function countFiles(dir: string): number {
  let n = 0;
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop()!;
    if (!existsSync(cur)) continue;
    for (const name of readdirSync(cur)) {
      const abs = join(cur, name);
      try {
        const st = statSync(abs);
        if (st.isDirectory()) stack.push(abs);
        else n++;
      } catch {
        /* skip */
      }
    }
  }
  return n;
}

function dirBytes(dir: string): number {
  let n = 0;
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop()!;
    if (!existsSync(cur)) continue;
    for (const name of readdirSync(cur)) {
      const abs = join(cur, name);
      try {
        const st = statSync(abs);
        if (st.isDirectory()) stack.push(abs);
        else n += st.size;
      } catch {
        /* skip */
      }
    }
  }
  return n;
}

function unique(xs: string[]): string[] {
  return [...new Set(xs.filter(Boolean))];
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
