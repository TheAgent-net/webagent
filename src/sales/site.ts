/**
 * Serve the captured corgi.insure homepage snapshot.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { Buffer } from "node:buffer";
import { extname, join, normalize } from "node:path";

export const CORGI_SITE_ROOT = join(import.meta.dir, "../../site/corgi");

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8",
};

const TRACKER =
  /(?:https?:)?\/\/(?:www\.googletagmanager\.com|googletagmanager\.com|js-na2\.hs-[a-z.-]+|js\.hs-scripts\.com|sc\.lfeeder\.com|app\.factors\.ai|connect\.facebook\.net|www\.google-analytics\.com)/i;

type Cached = { raw: Buffer; gzip?: Buffer; type: string; immutable: boolean };
const files = new Map<string, Cached>();
let indexHtml: string | undefined;

function sniff(buf: Uint8Array): string | undefined {
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 12 && buf[0] === 0x52 && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
    return "image/webp";
  }
  const head = new TextDecoder().decode(buf.slice(0, 64)).trimStart();
  if (head.startsWith("<svg") || head.startsWith("<?xml")) return "image/svg+xml";
  return undefined;
}

function candidates(url: URL): string[] {
  let rel = decodeURIComponent(url.pathname);
  if (rel.startsWith("/")) rel = rel.slice(1);
  if (!rel || rel.endsWith("/")) rel += "index.html";
  const out: string[] = [];
  if (url.search && url.search.length > 1) out.push(rel + "__q_" + encodeURIComponent(url.search.slice(1)));
  out.push(rel);
  return out;
}

function safeJoin(rel: string): string | null {
  const abs = normalize(join(CORGI_SITE_ROOT, rel));
  if (!abs.startsWith(CORGI_SITE_ROOT)) return null;
  return abs;
}

export function corgiSitePath(url: URL): { file: string; rel: string } | null {
  for (const rel of candidates(url)) {
    const abs = safeJoin(rel);
    if (abs && existsSync(abs) && statSync(abs).isFile()) return { file: abs, rel };
  }
  return null;
}

/** Collapse Next image optimizer URLs and drop third-party trackers so the clone loads in fewer round-trips. */
export function speedCorgiHtml(html: string): string {
  html = html.replace(/\/_next\/image\?url=([^"'&\s]+)(?:&(?:amp;)?[^"'>\s]*)*/g, (full, enc: string) => {
    try {
      const path = decodeURIComponent(enc.replace(/&amp;/g, "&"));
      return path.startsWith("/") ? path : full;
    } catch {
      return full;
    }
  });
  html = html.replace(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>\s*<\/script>/gi, (full, src: string) =>
    TRACKER.test(src) ? "" : full,
  );
  html = html.replace(/<link\b[^>]*>/gi, (full) => (TRACKER.test(full) ? "" : full));
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (full) => {
    if (/\ssrc=/i.test(full)) return full;
    if (/googletagmanager|gtag\(|fbq\(|factors\.ai|_hsq|hs-script/i.test(full)) return "";
    return full;
  });
  return html;
}

export function corgiSiteResponse(url: URL, req?: Request): Response | null {
  const hit = corgiSitePath(url);
  if (hit) return fileRes(hit, req);
  if (url.pathname === "/_next/image") {
    const src = url.searchParams.get("url");
    if (src && src.startsWith("/")) {
      const inner = corgiSitePath(new URL("http://local" + src));
      if (inner) return fileRes(inner, req);
    }
    const encoded = corgiSitePath(url);
    if (encoded) return fileRes(encoded, req);
  }
  return null;
}

function load(hit: { file: string; rel: string }): Cached {
  const prev = files.get(hit.file);
  if (prev) return prev;
  const raw = Buffer.from(readFileSync(hit.file));
  const logical = hit.rel.split("__q_")[0] || hit.rel;
  const type = MIME[extname(logical).toLowerCase()] || sniff(raw) || "application/octet-stream";
  const immutable = logical.includes("_next/static") || logical.includes("/images/");
  const entry: Cached = { raw, type, immutable };
  if (compressible(type) && raw.byteLength > 256) {
    try {
      entry.gzip = gzipSync(raw);
    } catch {
      /* leave uncompressed */
    }
  }
  files.set(hit.file, entry);
  return entry;
}

function compressible(type: string): boolean {
  return /text\/|javascript|json|svg\+xml|xml/.test(type);
}

function wantsGzip(req?: Request): boolean {
  return (req?.headers.get("accept-encoding") ?? "").includes("gzip");
}

function fileRes(hit: { file: string; rel: string }, req?: Request): Response {
  const entry = load(hit);
  const headers: Record<string, string> = {
    "Content-Type": entry.type,
    "Cache-Control": entry.immutable ? "public, max-age=31536000, immutable" : "public, max-age=86400",
  };
  if (entry.gzip && wantsGzip(req)) {
    headers["Content-Encoding"] = "gzip";
    headers.Vary = "Accept-Encoding";
    return new Response(entry.gzip as BodyInit, { headers });
  }
  return new Response(entry.raw as BodyInit, { headers });
}

export function hasCorgiSnapshot(): boolean {
  return existsSync(join(CORGI_SITE_ROOT, "index.html"));
}

export function readCorgiIndex(): string {
  if (indexHtml !== undefined) return indexHtml;
  indexHtml = speedCorgiHtml(readFileSync(join(CORGI_SITE_ROOT, "index.html"), "utf8"));
  return indexHtml;
}

export function gzipBody(text: string, req?: Request): { body: string | Buffer; encoding?: string } {
  if (!req || !wantsGzip(req) || text.length < 512) return { body: text };
  return { body: gzipSync(text), encoding: "gzip" };
}
