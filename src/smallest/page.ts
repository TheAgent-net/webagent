import type { Room } from "../host/room.ts";
import { smallestWidget } from "./widget.ts";
import type { SmallestPack } from "./types.ts";

export function smallestPage(room: Room, publicUrl: string, pack: SmallestPack): Response {
  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Smallest AI agent</title>
<style>
  :root { --ink:#F4F7F5; --bg:#07080A; --card:#101218; --mint:#7CFFB2; --mute:#8A938C; }
  html,body { margin:0; background:var(--bg); color:var(--ink); font:16px/1.5 system-ui,sans-serif; }
  main { max-width:720px; margin:0 auto; padding:48px 20px 140px; }
  h1 { font-size:2rem; margin:0 0 8px; }
  .tag { color:var(--mute); }
  ul { padding-left:1.2rem; }
  a { color:var(--mint); }
  .stat { display:flex; gap:16px; color:var(--mute); font-size:13px; margin:16px 0 28px; }
</style>
</head><body>
<main>
  <h1>Smallest AI</h1>
  <p class="tag">Realtime voice agents. Say what you are building — we pick the path and the settings.</p>
  <div class="stat">
    <span>${pack.marketing.length} marketing pages</span>
    <span>${pack.docs.length} docs pages</span>
    <span><a href="${esc(pack.origin)}">${esc(pack.origin)}</a></span>
  </div>
  <h2>This agent will</h2>
  <ul>
    <li>Learn your use case with one question at a time</li>
    <li>Choose Atoms (standard or crew), your own stack, or models-only</li>
    <li>Set model, voice, language, speech, telephony, KB, and tools for that case</li>
  </ul>
  <p>Docs: <a href="${esc(pack.docsOrigin)}">${esc(pack.docsOrigin)}</a></p>
</main>
${smallestWidget(publicUrl, room.run.id, pack)}
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
