import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** One visual block on a site page: an image, a figure, a table, or a section. */
export interface Visual {
  id: string;
  kind: "image" | "figure" | "table" | "section";
  label: string;
  text: string;
  page: string;
  selector: string;
  image: string;
  width: number;
  height: number;
}

export interface CaptureOpts {
  out: string;
  chrome?: string;
  pages?: string[];
  maxPages?: number;
  maxVisuals?: number;
}

/** Raw block from the page before the picture is saved. */
interface Block {
  kind: Visual["kind"];
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
    const queue = opts.pages?.length ? [...opts.pages] : ["/"];
    const seen = new Set<string>();
    const maxPages = opts.maxPages ?? 8;
    const maxVisuals = opts.maxVisuals ?? 40;
    while (queue.length && seen.size < maxPages && visuals.length < maxVisuals) {
      const path = queue.shift()!;
      if (seen.has(path)) continue;
      seen.add(path);
      const res = await page.goto(root + path, { waitUntil: "networkidle2", timeout: 45000 }).catch(() => null);
      if (!res || res.status() >= 400) continue;
      if (!opts.pages?.length) {
        const links = await page.evaluate(listLinks);
        for (const link of links) if (!seen.has(link)) queue.push(link);
      }
      const blocks = await page.evaluate(listBlocks);
      for (const block of blocks) {
        if (visuals.length >= maxVisuals) break;
        const id = uniqueId(block.label, used);
        const image = await savePicture(page, root, block, join(dir, id));
        if (!image) {
          used.delete(id);
          continue;
        }
        visuals.push({
          id,
          kind: block.kind,
          label: block.label,
          text: block.text,
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

/** Short catalog line per visual for the model. */
export function listVisualLines(visuals: Visual[]): string {
  return visuals
    .map((v) => `- ${v.id}: ${v.label}${v.text ? " — " + v.text : ""} (page ${v.page})`)
    .join("\n");
}

type Page = import("puppeteer-core").Page;

async function savePicture(page: Page, root: string, block: Block, stem: string): Promise<string> {
  if (block.kind === "image" && block.src) {
    const url = new URL(block.src, root + "/").href;
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
  const push = (el: Element, block: Omit<Block, "selector" | "shown" | "width" | "height">) => {
    if (!block.label || blocks.some((b) => b.label === block.label)) return;
    const r = el.getBoundingClientRect();
    blocks.push({
      ...block,
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
