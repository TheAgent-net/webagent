import type { Room } from "../host/room.ts";
import { hasSmallestSnapshot, readSmallestIndex } from "./site.ts";
import { smallestWidget } from "./widget.ts";
import type { SmallestPack } from "./types.ts";

export function smallestPage(room: Room, publicUrl: string, pack: SmallestPack): Response {
  const widget = smallestWidget(publicUrl, room.run.id, pack);
  const html = hasSmallestSnapshot()
    ? inject(readSmallestIndex(), widget)
    : fallbackPage(publicUrl, pack, widget);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      Link: `<${publicUrl}/.well-known/agent-card.json>; rel="describedby"; type="application/json"`,
    },
  });
}

function inject(html: string, widget: string): string {
  if (html.includes("</body>")) return html.replace("</body>", widget + "</body>");
  return html + widget;
}

function fallbackPage(publicUrl: string, pack: SmallestPack, widget: string): string {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Smallest AI agent</title>
</head><body>
<p>Missing site/smallest snapshot. Run bun experiment/mirror-smallest.ts</p>
<p>${esc(pack.origin)} · ${pack.pages.length} crawled pages</p>
${widget}
</body></html>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
