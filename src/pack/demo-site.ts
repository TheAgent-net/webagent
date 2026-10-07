import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".cjs": "application/javascript; charset=utf-8",
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
  ".otf": "font/otf",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".md": "text/markdown; charset=utf-8",
};

function sniff(buf: Uint8Array): string | undefined {
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 6 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "image/gif";
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
  if (url.search && url.search.length > 1) {
    const q = encodeURIComponent(url.search.slice(1));
    const hash = Bun.hash(url.search).toString(16);
    out.push(rel + "__q_" + (q.length > 80 ? hash : q));
  }
  out.push(rel);
  if (!rel.endsWith(".html") && !extname(rel)) out.push(rel + ".html");
  return out;
}

function sniffType(rel: string, buf: Uint8Array): string {
  const logical = rel.split("__q_")[0] || rel;
  return MIME[extname(logical).toLowerCase()] || sniff(buf) || "application/octet-stream";
}

export function serveDemoSite(root: string, port: number, widgetOrigin: string): { stop: () => void; port: number } {
  const base = widgetOrigin.replace(/\/+$/, "");
  const rootAbs = normalize(root);
  const server = Bun.serve({
    port,
    hostname: "127.0.0.1",
    fetch(req) {
      const url = new URL(req.url);
      if (url.pathname === "/_next/image") {
        const src = url.searchParams.get("url");
        if (src && src.startsWith("/")) {
          return demoFileResponse(rootAbs, new URL("http://local" + src), base) ?? new Response("not found", { status: 404 });
        }
      }
      return demoFileResponse(rootAbs, url, base) ?? new Response("not found", { status: 404 });
    },
  });
  return { stop: () => server.stop(true), port: server.port ?? port };
}

export function demoFileResponse(root: string, url: URL, widgetOrigin: string): Response | null {
  const rootAbs = normalize(root);
  return fileAt(rootAbs, url, widgetOrigin.replace(/\/+$/, ""));
}

function fileAt(root: string, url: URL, widgetOrigin: string): Response | null {
  for (const rel of candidates(url)) {
    const abs = normalize(join(root, rel));
    if (!abs.startsWith(root)) return new Response("no", { status: 403 });
    if (!existsSync(abs) || !statSync(abs).isFile()) continue;
    if (rel.endsWith(".html") || rel.split("__q_")[0]?.endsWith(".html")) {
      const html = readFileSync(abs, "utf8")
        .replaceAll("{{WIDGET}}", widgetOrigin)
        .replaceAll("{{WIDGET_JS}}", widgetOrigin + "/widget.js");
      return new Response(html, { headers: { "Content-Type": MIME[".html"]! } });
    }
    const buf = readFileSync(abs);
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": sniffType(rel, buf),
        "Cache-Control": "public, max-age=86400",
      },
    });
  }
  return null;
}
