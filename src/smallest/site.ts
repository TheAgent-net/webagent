/**
 * Serve the captured smallest.ai homepage snapshot.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

export const SMALLEST_SITE_ROOT = join(import.meta.dir, "../../site/smallest");

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
  const abs = normalize(join(SMALLEST_SITE_ROOT, rel));
  if (!abs.startsWith(SMALLEST_SITE_ROOT)) return null;
  return abs;
}

export function smallestSitePath(url: URL): { file: string; rel: string } | null {
  for (const rel of candidates(url)) {
    const abs = safeJoin(rel);
    if (abs && existsSync(abs) && statSync(abs).isFile()) return { file: abs, rel };
  }
  return null;
}

export function smallestSiteResponse(url: URL): Response | null {
  const hit = smallestSitePath(url);
  if (hit) return fileRes(hit);
  return null;
}

function fileRes(hit: { file: string; rel: string }): Response {
  const buf = readFileSync(hit.file);
  const logical = hit.rel.split("__q_")[0] || hit.rel;
  const type = MIME[extname(logical).toLowerCase()] || sniff(buf) || "application/octet-stream";
  return new Response(buf, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export function hasSmallestSnapshot(): boolean {
  return existsSync(join(SMALLEST_SITE_ROOT, "index.html"));
}

export function readSmallestIndex(): string {
  return rewriteSmallestHtml(readFileSync(join(SMALLEST_SITE_ROOT, "index.html"), "utf8"));
}

/** Point captured CDN URLs at the local mirror. */
export function rewriteSmallestHtml(html: string): string {
  return html
    .replaceAll("https://www.smallest.ai", "")
    .replaceAll("https://smallest.ai", "")
    .replaceAll("http://smallest.ai", "")
    .replaceAll("https://framerusercontent.com", "/_ext/framerusercontent.com")
    .replaceAll("http://framerusercontent.com", "/_ext/framerusercontent.com")
    .replaceAll("//framerusercontent.com", "/_ext/framerusercontent.com");
}
