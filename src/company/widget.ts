import { companyCopyPrompt } from "./card.ts";
import type { CompanyPack } from "./types.ts";

export function companyWidget(publicUrl: string, runId: string, pack: CompanyPack): string {
  const prompt = companyCopyPrompt(publicUrl, pack.profile.name);
  const markup = widgetMarkup(publicUrl, runId, pack);
  return `
<link rel="alternate" type="text/plain" href="/llms.txt" title="How a peer agent should connect"/>
<link rel="alternate" type="application/json" href="/agent.json"/>
<link rel="describedby" href="/.well-known/agent-card.json"/>
<script>
(() => {
  const MARKUP = ${JSON.stringify(markup)};
  const PROMPT = ${JSON.stringify(prompt)};
  const bind = () => {
    if (window.__waBound) return;
    const fab = document.getElementById("wa-fab");
    const panel = document.getElementById("wa-panel");
    if (!fab || !panel) return;
    window.__waBound = true;
    const setOpen = (open) => {
      panel.classList.toggle("open", open);
      fab.textContent = open ? "Close" : "Ask ${esc(pack.profile.name)}";
    };
    fab.onclick = () => setOpen(!panel.classList.contains("open"));
    const closeBtn = document.getElementById("wa-close");
    if (closeBtn) closeBtn.onclick = () => setOpen(false);
    const copyBtn = document.getElementById("wa-copy-prompt");
    if (copyBtn) copyBtn.onclick = async () => {
      try { await navigator.clipboard.writeText(PROMPT); } catch {}
      const prev = copyBtn.textContent; copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = prev; }, 1200);
    };
    const log = document.getElementById("wa-log");
    const add = (cls, text) => {
      const welcome = document.getElementById("wa-welcome");
      if (welcome) welcome.remove();
      const d = document.createElement("div");
      d.className = "wa-msg " + cls;
      d.textContent = text;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
    };
    let lastAgent = "";
    if (!window.__waSession) window.__waSession = "c" + Date.now();
    const session = window.__waSession;
    if (!window.__waEs) window.__waEs = new EventSource("/live?session=" + encodeURIComponent(session));
    window.__waEs.onmessage = (e) => {
      const ev = JSON.parse(e.data);
      if (ev.t === "reply" && ev.text && ev.text !== lastAgent) { lastAgent = ev.text; add("agent", ev.text); }
    };
    const form = document.getElementById("wa-form");
    const input = document.getElementById("wa-text");
    const send = async () => {
      const text = input.value.trim();
      if (!text) return;
      add("human", text);
      input.value = "";
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, session }),
      });
      const body = await res.json().catch(() => ({}));
      if (body.lastText && body.lastText !== lastAgent) { lastAgent = body.lastText; add("agent", body.lastText); }
    };
    form.onsubmit = (e) => { e.preventDefault(); send(); };
    document.querySelectorAll(".wa-chip").forEach((chip) => {
      chip.onclick = () => { input.value = chip.dataset.q || chip.textContent; send(); };
    });
  };
  const mount = () => {
    if (!document.getElementById("wa-fab")) {
      window.__waBound = false;
      const wrap = document.createElement("div");
      wrap.innerHTML = MARKUP;
      document.body.appendChild(wrap);
    }
    bind();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
</script>`;
}

function widgetMarkup(publicUrl: string, runId: string, pack: CompanyPack): string {
  const name = esc(pack.profile.name);
  const chips = pack.site.starterQuestions
    .slice(0, 4)
    .map((q) => `<button class="wa-chip" type="button" data-q="${esc(q)}">${esc(q)}</button>`)
    .join("");
  return `
<style>
  #wa-fab { position:fixed; right:18px; bottom:18px; z-index:99999; border:0; border-radius:999px;
    background:#191919; color:#fff; padding:12px 18px; font:600 14px/1 system-ui; cursor:pointer; }
  #wa-panel { display:none; position:fixed; right:18px; bottom:72px; z-index:99999; width:min(420px,94vw);
    height:min(640px,80vh); background:#FDFBF6; color:#191919; border:1px solid #e1e1e1;
    border-radius:16px; box-shadow:0 12px 40px rgba(0,0,0,.18); flex-direction:column; overflow:hidden;
    font:14px/1.45 system-ui; }
  #wa-panel.open { display:flex; }
  .wa-hdr { display:flex; justify-content:space-between; align-items:center; padding:12px 14px; background:#191919; color:#fff; }
  .wa-a2a { padding:10px 14px; background:#fff; border-bottom:1px solid #eee; font-size:12px; }
  .wa-a2a-row { display:flex; gap:8px; align-items:center; margin-top:6px; }
  #wa-url { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  #wa-copy-prompt, .wa-chip, .wa-send { border:0; border-radius:10px; background:#ff5c00; color:#fff; padding:8px 10px; cursor:pointer; font:600 12px system-ui; }
  .wa-chip { background:#fff; color:#191919; border:1px solid #e1e1e1; }
  #wa-log { flex:1; overflow:auto; padding:12px; }
  .wa-msg { margin:8px 0; padding:8px 10px; border-radius:10px; white-space:pre-wrap; }
  .wa-msg.human { background:#191919; color:#fff; margin-left:24px; }
  .wa-msg.agent { background:#fff; border:1px solid #eee; margin-right:24px; }
  .wa-welcome h4 { margin:0 0 6px; }
  #wa-chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
  .wa-form { display:flex; gap:8px; padding:10px; border-top:1px solid #eee; background:#fff; }
  #wa-text { flex:1; border:1px solid #e1e1e1; border-radius:10px; padding:8px 10px; font:inherit; }
  .wa-run-id { display:none; }
</style>
<button id="wa-fab" type="button">Ask ${name}</button>
<div id="wa-panel" role="dialog" aria-label="${name} agent">
  <div class="wa-hdr"><strong>${name}</strong><button id="wa-close" type="button" style="background:none;border:0;color:#fff;cursor:pointer">×</button></div>
  <div class="wa-a2a">
    <div>Let your agent talk to <em>${name}</em>:</div>
    <div class="wa-a2a-row">
      <span id="wa-url">${esc(publicUrl)}</span>
      <button type="button" id="wa-copy-prompt">Copy prompt</button>
    </div>
  </div>
  <div id="wa-log">
    <div class="wa-welcome" id="wa-welcome">
      <h4>${name}</h4>
      <p>${esc(pack.profile.tagline)}</p>
      <div id="wa-chips">${chips}</div>
    </div>
  </div>
  <form class="wa-form" id="wa-form">
    <input id="wa-text" type="text" placeholder="What do you need?" autocomplete="off"/>
    <button class="wa-send" type="submit">Send</button>
  </form>
  <span class="wa-run-id">${esc(runId)}</span>
</div>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
