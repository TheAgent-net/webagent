import type { Room } from "../host/room.ts";
import { companyWidget } from "./widget.ts";
import type { CompanyPack } from "./types.ts";

export function companyPage(room: Room, publicUrl: string, pack: CompanyPack): Response {
  const p = pack.profile;
  const offers = p.offers
    .slice(0, 6)
    .map((o) => `<li>${esc(o)}</li>`)
    .join("");
  const forms = pack.forms
    .slice(0, 6)
    .map((f) => `<li><strong>${esc(f.name)}</strong> — ${esc(f.purpose)}</li>`)
    .join("");
  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(p.name)} agent</title>
<style>
  :root { --ink:#191919; --cream:#FDFBF6; --orange:#ff5c00; }
  html,body { margin:0; background:var(--cream); color:var(--ink); font:16px/1.5 system-ui,sans-serif; }
  main { max-width:720px; margin:0 auto; padding:48px 20px 120px; }
  h1 { font-size:2rem; margin:0 0 8px; }
  .tag { color:#444; }
  ul { padding-left:1.2rem; }
  a { color:var(--orange); }
</style>
</head><body>
<main>
  <h1>${esc(p.name)}</h1>
  <p class="tag">${esc(p.tagline)}</p>
  <p>This webagent was built from <a href="${esc(p.website || p.origin)}">${esc(p.website || p.origin)}</a>${
    p.github ? ` and <a href="${esc(p.github)}">${esc(p.github)}</a>` : ""
  }.</p>
  <h2>What we found</h2>
  <ul>${offers || "<li>Public pages from the crawl</li>"}</ul>
  <h2>Forms the agent can walk</h2>
  <ul>${forms || "<li>No public forms on the crawled pages</li>"}</ul>
</main>
${companyWidget(publicUrl, room.run.id, pack)}
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
