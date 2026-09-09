import { connectPrompt } from "./card.ts";
import type { Room } from "./room.ts";
import { hasSiteSnapshot, readSiteIndex, rewriteSiteHtml } from "./site.ts";
import { floatingWidget } from "./widget.ts";

/** Human landing page: captured composio.dev snapshot + floating agent chat. */
export function chatPage(room: Room, publicUrl: string): Response {
  const html = hasSiteSnapshot()
    ? inject(rewriteSiteHtml(readSiteIndex()), floatingWidget(publicUrl, room.run.id))
    : fallbackPage(room, publicUrl);
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

function fallbackPage(room: Room, publicUrl: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"/><title>Composio</title></head><body>
  <p>Missing site/composio snapshot. Run bun experiment/mirror-composio.ts</p>
  ${floatingWidget(publicUrl, room.run.id)}
  </body></html>`;
}

export { connectPrompt };
