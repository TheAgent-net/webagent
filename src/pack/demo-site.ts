import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
};

export function serveDemoSite(root: string, port: number, widgetOrigin: string): { stop: () => void } {
  const server = Bun.serve({
    port,
    hostname: "127.0.0.1",
    fetch(req) {
      const url = new URL(req.url);
      let rel = decodeURIComponent(url.pathname);
      if (rel.startsWith("/")) rel = rel.slice(1);
      if (!rel || rel.endsWith("/")) rel += "index.html";
      const abs = normalize(join(root, rel));
      if (!abs.startsWith(normalize(root))) return new Response("no", { status: 403 });
      if (!existsSync(abs) || !statSync(abs).isFile()) return new Response("not found", { status: 404 });
      if (rel.endsWith(".html")) {
        const html = readFileSync(abs, "utf8")
          .replaceAll("{{WIDGET}}", widgetOrigin.replace(/\/+$/, ""))
          .replaceAll("{{WIDGET_JS}}", widgetOrigin.replace(/\/+$/, "") + "/widget.js");
        return new Response(html, { headers: { "Content-Type": MIME[".html"] || "text/html; charset=utf-8" } });
      }
      const buf = readFileSync(abs);
      return new Response(new Uint8Array(buf), { headers: { "Content-Type": MIME[extname(rel)] || "application/octet-stream" } });
    },
  });
  return { stop: () => server.stop(true) };
}
