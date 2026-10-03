import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** One visual block on a site page: an image, a figure, a table, or a section. */
export interface Visual {
  id: string;
  kind: "image" | "figure" | "table" | "section";
  label: string;
  text: string;
  /** Search words: the kind plus the heading of the section that holds it. */
  tags?: string[];
  page: string;
  selector: string;
  image: string;
  width: number;
  height: number;
}

export interface CaptureOpts {
  out: string;
  chrome?: string;
  /** Paths on `base`, or full URLs on other sites. A full URL becomes the visual's page. */
  pages?: string[];
  maxPages?: number;
  maxVisuals?: number;
  /** Fetch every page request through Bun. Use behind a TLS proxy that Chromium does not trust. */
  relay?: boolean;
}

/** Raw block from the page before the picture is saved. */
interface Block {
  kind: Visual["kind"];
  tags: string[];
  label: string;
  text: string;
  selector: string;
  src: string;
  shown: boolean;
  width: number;
  height: number;
}

const SHOT_HEIGHT = 1100;

/** Open each page in Chromium, find visual blocks, save one picture per block. */
export async function captureVisuals(base: string, opts: CaptureOpts): Promise<Visual[]> {
  const { default: puppeteer } = await import("puppeteer-core");
  const root = base.replace(/\/+$/, "");
  const dir = join(opts.out, "visuals");
  mkdirSync(dir, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: getChrome(opts.chrome),
    args: ["--no-sandbox", "--hide-scrollbars"],
    headless: true,
  });
  const visuals: Visual[] = [];
  const used = new Set<string>();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
    if (opts.relay ?? !!process.env.HTTPS_PROXY) await relayRequests(page);
    const queue = opts.pages?.length ? [...opts.pages] : ["/"];
    const seen = new Set<string>();
    const maxPages = opts.maxPages ?? 8;
    const maxVisuals = opts.maxVisuals ?? 40;
    while (queue.length && seen.size < maxPages && visuals.length < maxVisuals) {
      const path = queue.shift()!;
      if (seen.has(path)) continue;
      seen.add(path);
      const target = /^https?:\/\//.test(path) ? path : root + path;
      const res = await page.goto(target, { waitUntil: "networkidle2", timeout: 45000 }).catch(() => null);
      if (!res || res.status() >= 400) continue;
      if (!opts.pages?.length) {
        const links = await page.evaluate(listLinks);
        for (const link of links) if (!seen.has(link)) queue.push(link);
      }
      const blocks = await page.evaluate(listBlocks);
      for (const block of blocks) {
        if (visuals.length >= maxVisuals) break;
        const id = uniqueId(block.label, used);
        const image = await savePicture(page, target, block, join(dir, id));
        if (!image) {
          used.delete(id);
          continue;
        }
        visuals.push({
          id,
          kind: block.kind,
          label: block.label,
          text: block.text,
          tags: block.tags,
          page: path,
          selector: block.selector,
          image: "visuals/" + image,
          width: block.width,
          height: block.height,
        });
      }
    }
  } finally {
    await browser.close();
  }
  writeFileSync(join(opts.out, "visuals.json"), JSON.stringify(visuals, null, 2) + "\n");
  return visuals;
}

/** Take `[[show:id]]` markers out of a reply. Return clean text and the named visuals. */
export function splitShows(text: string, visuals: Visual[] = []): { text: string; shown: Visual[] } {
  const shown: Visual[] = [];
  const clean = text
    .replace(/\[\[show:([a-z0-9-]+)\]\]/gi, (_m, id: string) => {
      const hit = visuals.find((v) => v.id === id);
      if (hit && !shown.includes(hit)) shown.push(hit);
      return "";
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { text: clean, shown };
}

/**
 * Rank visuals for a question. Words from the question count fully. Expanded terms count half.
 * A word weighs more when few visuals hold it. A label hit counts most, then tags, then text.
 */
export function findVisuals(visuals: Visual[], query: string, extra: string[] = [], limit = 2): Visual[] {
  const split = (s: string) =>
    s
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !STOP.has(w))
      .map((w) => (w.length > 4 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w));
  const own = new Set(split(query));
  const terms = new Map<string, number>([...own].map((w) => [w, 1]));
  for (const t of extra.flatMap(split)) if (!terms.has(t)) terms.set(t, 0.5);
  if (!terms.size || !visuals.length) return [];
  const docs = visuals.map((v) => ({
    v,
    label: split(v.label),
    tags: split((v.tags ?? []).join(" ")),
    text: split(v.text),
  }));
  const has = (words: string[], t: string) => words.some((w) => w === t || (t.length >= 4 && w.startsWith(t)));
  const n = docs.length;
  const scored = docs.map((d) => {
    let total = 0;
    let mine = false;
    for (const [t, w] of terms) {
      const df = docs.filter((x) => has(x.label, t) || has(x.tags, t) || has(x.text, t)).length;
      if (!df || (n >= 4 && df / n > 0.5)) continue;
      const idf = 1 + Math.log(n / df);
      const hit = (has(d.label, t) ? 3 : 0) + (has(d.tags, t) ? 2 : 0) + (has(d.text, t) ? 1 : 0);
      if (hit && w === 1) mine = true;
      total += w * idf * hit;
    }
    return { v: d.v, total: mine ? total : 0 };
  });
  const ranked = scored.filter((x) => x.total >= 2.5).sort((a, b) => b.total - a.total);
  const top = ranked[0]?.total ?? 0;
  return ranked
    .filter((x) => x.total >= top * 0.6)
    .slice(0, limit)
    .map((x) => x.v);
}

const STOP = new Set(["the", "and", "for", "how", "what", "does", "can", "you", "your", "with", "this", "that", "are", "is", "it", "do", "about", "show", "me", "much", "many", "use", "get", "work", "works"]);

type Page = import("puppeteer-core").Page;

/** Answer each remote request with Bun fetch, which checks TLS against the system trust store. */
async function relayRequests(page: Page): Promise<void> {
  await page.setRequestInterception(true);
  page.on("request", async (req) => {
    const url = req.url();
    const host = /^https?:/.test(url) ? new URL(url).hostname : "";
    if (!host || host === "127.0.0.1" || host === "localhost") return req.continue();
    try {
      const res = await fetch(url, { method: req.method(), headers: req.headers(), body: req.postData() });
      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        if (k !== "content-encoding" && k !== "content-length" && k !== "transfer-encoding") headers[k] = v;
      });
      await req.respond({ status: res.status, headers, body: Buffer.from(await res.arrayBuffer()) });
    } catch {
      await req.abort().catch(() => {});
    }
  });
}

async function savePicture(page: Page, pageUrl: string, block: Block, stem: string): Promise<string> {
  if (block.kind === "image" && block.src) {
    const url = new URL(block.src, pageUrl).href;
    const got = await page.evaluate(fetchBytes, url).catch(() => null);
    if (got && got.data) {
      const ext = extFor(got.type, url);
      writeFileSync(stem + ext, Buffer.from(got.data, "base64"));
      return stem.split("/").pop() + ext;
    }
  }
  if (!block.shown) return "";
  const handle = await page.$(block.selector);
  if (!handle) return "";
  await handle.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await new Promise((r) => setTimeout(r, 700));
  const box = await handle.boundingBox();
  if (!box || box.width < 40 || box.height < 40) return "";
  const scroll = await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }));
  const shot = await page.screenshot({
    type: "jpeg",
    quality: 82,
    captureBeyondViewport: true,
    clip: { x: box.x + scroll.x, y: box.y + scroll.y, width: box.width, height: Math.min(box.height, SHOT_HEIGHT) },
  });
  writeFileSync(stem + ".jpg", shot);
  return stem.split("/").pop() + ".jpg";
}

/** Find a Chrome or Chromium binary. Playwright's Chromium counts. */
export function getChrome(explicit?: string): string {
  const list = [explicit, process.env.WEBAGENT_CHROME, process.env.CHROME];
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (existsSync(pw)) {
    for (const name of readdirSync(pw).filter((n) => n.startsWith("chromium-")).sort().reverse()) {
      list.push(join(pw, name, "chrome-linux", "chrome"));
    }
  }
  list.push(
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  );
  const hit = list.find((p) => p && existsSync(p));
  if (!hit) throw new Error("no Chrome found: set WEBAGENT_CHROME");
  return hit;
}

function extFor(type: string, url: string): string {
  if (type.includes("svg")) return ".svg";
  if (type.includes("png")) return ".png";
  if (type.includes("webp")) return ".webp";
  if (type.includes("gif")) return ".gif";
  if (type.includes("jpeg") || type.includes("jpg")) return ".jpg";
  const m = url.match(/\.(png|jpe?g|webp|svg|gif)(?:$|[?#])/i);
  return m ? "." + m[1]!.toLowerCase().replace("jpeg", "jpg") : ".jpg";
}

function uniqueId(label: string, used: Set<string>): string {
  const stem =
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .split("-")
      .slice(0, 4)
      .join("-") || "visual";
  let id = stem;
  for (let i = 2; used.has(id); i++) id = stem + "-" + i;
  used.add(id);
  return id;
}

/* The functions below run inside the page. Keep them self-contained. */

async function fetchBytes(url: string): Promise<{ type: string; data: string } | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  const blob = await res.blob();
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return { type: blob.type, data: btoa(bin) };
}

function listLinks(): string[] {
  const out = new Set<string>();
  for (const a of Array.from(document.querySelectorAll("a[href]"))) {
    const url = new URL((a as HTMLAnchorElement).href, location.href);
    if (url.origin !== location.origin) continue;
    if (/\.(png|jpe?g|webp|svg|gif|pdf|xml|txt|zip)$/i.test(url.pathname)) continue;
    out.add(url.pathname);
  }
  return Array.from(out);
}

function listBlocks(): Block[] {
  const clean = (s: string | null | undefined) => (s || "").replace(/\s+/g, " ").trim();
  const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
  const selectorFor = (el: Element): string => {
    if (el.id && document.querySelectorAll("#" + CSS.escape(el.id)).length === 1) return "#" + CSS.escape(el.id);
    const parts: string[] = [];
    let node: Element | null = el;
    while (node && node !== document.body) {
      if (node.id && document.querySelectorAll("#" + CSS.escape(node.id)).length === 1) {
        parts.unshift("#" + CSS.escape(node.id));
        break;
      }
      const tag = node.tagName.toLowerCase();
      const parent: Element | null = node.parentElement;
      if (!parent) break;
      const same = Array.from(parent.children).filter((c) => c.tagName === node!.tagName);
      parts.unshift(same.length > 1 ? `${tag}:nth-of-type(${same.indexOf(node) + 1})` : tag);
      node = parent;
    }
    return (node === document.body ? "body > " : "") + parts.join(" > ");
  };
  const shown = (el: Element) => {
    const r = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  };
  const inside = (el: Element, taken: Element[]) => taken.some((t) => t === el || t.contains(el));
  const blocks: Block[] = [];
  const taken: Element[] = [];
  const words = (s: string) =>
    Array.from(new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2))).slice(0, 12);
  const push = (el: Element, block: Omit<Block, "selector" | "shown" | "width" | "height" | "tags">) => {
    if (!block.label || blocks.some((b) => b.label === block.label)) return;
    if (/^(other|related|more|recent) (posts|articles|stories)/i.test(block.label)) return;
    const r = el.getBoundingClientRect();
    if (r.height > 0 && r.height < 120) return;
    const head = clean(el.closest("section")?.querySelector("h1, h2, h3")?.textContent);
    blocks.push({
      ...block,
      tags: [block.kind, ...words(head)],
      label: cut(block.label, 90),
      text: cut(block.text, 160),
      selector: selectorFor(el),
      shown: shown(el),
      width: Math.round(r.width),
      height: Math.round(r.height),
    });
    taken.push(el);
  };
  for (const img of Array.from(document.querySelectorAll("img"))) {
    const alt = clean(img.getAttribute("alt"));
    const src = img.getAttribute("data-src") || img.currentSrc || img.getAttribute("src") || "";
    const w = Number(img.getAttribute("width")) || img.naturalWidth;
    if (!alt || !src || w < 240) continue;
    const fig = img.closest("figure");
    const caption = clean(fig?.querySelector("figcaption")?.textContent);
    push(img, { kind: "image", label: alt, text: caption, src });
  }
  for (const fig of Array.from(document.querySelectorAll("figure"))) {
    if (inside(fig, taken) || !shown(fig)) continue;
    const label = clean(fig.getAttribute("aria-label")) || clean(fig.querySelector("figcaption")?.textContent);
    push(fig, { kind: "figure", label, text: "", src: "" });
  }
  for (const table of Array.from(document.querySelectorAll("table"))) {
    if (inside(table, taken) || !shown(table)) continue;
    const section = table.closest("section");
    const label =
      clean(table.querySelector("caption")?.textContent) ||
      clean(section?.querySelector("h2, h3")?.textContent) ||
      "Table";
    const head = Array.from(table.querySelectorAll("th")).map((th) => clean(th.textContent)).filter(Boolean);
    push(table, { kind: "table", label, text: head.slice(0, 6).join(", "), src: "" });
  }
  for (const section of Array.from(document.querySelectorAll("section, [id] > header"))) {
    if (!shown(section)) continue;
    const head = section.querySelector("h1, h2");
    const label = clean(head?.textContent);
    if (!label) continue;
    const para = clean(section.querySelector("p")?.textContent);
    push(section, { kind: "section", label, text: para, src: "" });
  }
  return blocks;
}
