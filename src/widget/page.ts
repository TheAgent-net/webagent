import type { Room } from "../host/room.ts";
import type { AgentPackConfig } from "../pack/types.ts";
import { packWidget } from "./widget.ts";

export function agentPage(room: Room, publicUrl: string, config: AgentPackConfig): Response {
  const b = config.brand;
  const widget = packWidget(publicUrl, room.run.id, config);
  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(b.name)} agent</title>
<style>
  html,body { margin:0; min-height:100%; background:${b.colors.paper}; color:${b.colors.ink};
    font-family:${b.fonts.body}; }
  main { max-width:40rem; margin:0 auto; padding:4rem 1.25rem 8rem; }
  h1 { font-family:${b.fonts.display}; font-size:2rem; letter-spacing:-0.04em; margin:0 0 .4rem; }
  p { color:${b.colors.muted}; line-height:1.55; }
  a { color:${b.colors.ink}; font-weight:600; }
</style>
</head><body>
<main>
  <h1>${esc(b.name)}</h1>
  <p>${esc(b.tagline)}</p>
  <p>Talk here, or <code>POST ${esc(publicUrl.replace(/\/+$/, ""))}/chat</code>. Embed with <code>&lt;script src="${esc(publicUrl.replace(/\/+$/, ""))}/widget.js"&gt;&lt;/script&gt;</code>.</p>
</main>
${widget}
</body></html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      Link: `<${publicUrl}/.well-known/agent-card.json>; rel="describedby"; type="application/json"`,
    },
  });
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
