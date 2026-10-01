import { renderCopyPrompt } from "../pack/prompt.ts";
import type { AgentPackConfig } from "../pack/types.ts";
import { renderChatMarkdown } from "./md.ts";

export function packWidget(publicUrl: string, runId: string, config: AgentPackConfig): string {
  const prompt = renderCopyPrompt(config, publicUrl);
  const markup = widgetMarkup(publicUrl, runId, config);
  const fabOpen = config.brand.fabLabel;
  const markdown = config.widget.markdown !== false;
  return `
<link rel="alternate" type="text/plain" href="/llms.txt" title="How a peer agent should connect"/>
<link rel="alternate" type="application/json" href="/agent.json"/>
<link rel="describedby" href="/.well-known/agent-card.json"/>
<script>
(() => {
  const MARKUP = ${JSON.stringify(markup)};
  const PROMPT = ${JSON.stringify(prompt)};
  const BASE = ${JSON.stringify(publicUrl.replace(/\/+$/, ""))};
  const FAB_OPEN = ${JSON.stringify(fabOpen)};
  const bind = () => {
    if (window.__waBound) return;
    const fab = document.getElementById("wa-fab");
    const panel = document.getElementById("wa-panel");
    if (!fab || !panel) return;
    window.__waBound = true;
    const setOpen = (open) => {
      panel.classList.toggle("open", open);
      fab.classList.toggle("open", open);
      fab.textContent = open ? "Close" : FAB_OPEN;
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
    const md = ${markdown ? renderChatMarkdown.toString() : "null"};
    const add = (cls, text) => {
      const welcome = document.getElementById("wa-welcome");
      if (welcome) welcome.remove();
      const d = document.createElement("div");
      d.className = "wa-msg " + cls;
      if (cls === "agent" && md) d.innerHTML = md(text);
      else d.textContent = text;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
    };
    let lastAgent = "";
    if (!window.__waSession) window.__waSession = "s" + Date.now();
    const session = window.__waSession;
    if (!window.__waEs) window.__waEs = new EventSource(BASE + "/live?session=" + encodeURIComponent(session));
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
      const res = await fetch(BASE + "/chat", {
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

export function widgetJs(publicUrl: string, runId: string, config: AgentPackConfig): string {
  const html = packWidget(publicUrl, runId, config);
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  return (m?.[1] || html).trim();
}

function widgetMarkup(publicUrl: string, runId: string, config: AgentPackConfig): string {
  const b = config.brand;
  const w = config.widget;
  const c = b.colors;
  const display = b.fonts.display;
  const body = b.fonts.body;
  const google = b.fonts.google
    ? `@import url("${b.fonts.google}");`
    : "";
  const chips = (w.chips.length ? w.chips : config.widget.chips)
    .slice(0, 4)
    .map((q) => `<button class="wa-chip" type="button" data-q="${esc(q)}">${esc(q)}</button>`)
    .join("");
  return `
<style>
  ${google}
  #wa-root, #wa-panel {
    --wa-ink: ${c.ink};
    --wa-paper: ${c.paper};
    --wa-muted: ${c.muted};
    --wa-line: ${c.line};
    --wa-wash: ${c.wash};
    --wa-accent: ${c.accent};
  }
  #wa-fab, #wa-panel, #wa-panel * { box-sizing: border-box; }
  #wa-fab {
    position: fixed; right: 20px; bottom: 20px; z-index: 99999;
    border: 0; border-radius: 999px; cursor: pointer;
    background: ${c.fab}; color: ${c.fabText};
    padding: 12px 20px;
    font-family: ${body};
    font-size: 14px; font-weight: 600; line-height: 1;
    letter-spacing: -0.01em;
    box-shadow: 0 8px 24px rgba(1,1,1,.16);
    transition: transform .15s ease, background .15s ease;
  }
  #wa-fab:hover { transform: translateY(-1px); }
  #wa-fab.open {
    background: ${c.paper}; color: ${c.ink}; border: 1px solid ${c.line};
    box-shadow: 0 8px 24px rgba(1,1,1,.08);
  }
  #wa-panel {
    display: none; position: fixed; right: 20px; bottom: 72px; z-index: 99999;
    width: min(400px, calc(100vw - 24px));
    height: min(640px, calc(100vh - 100px));
    background: ${c.paper}; color: ${c.ink};
    border: 1px solid ${c.line};
    border-radius: 24px;
    box-shadow: 0 24px 64px rgba(1,1,1,.12), 0 2px 8px rgba(1,1,1,.04);
    flex-direction: column; overflow: hidden;
    font-family: ${body};
    font-size: 14px; line-height: 1.5; letter-spacing: -0.01em;
    -webkit-font-smoothing: antialiased;
  }
  #wa-panel.open { display: flex; }
  .wa-hdr {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 16px 14px 18px;
    background: ${c.paper};
    border-bottom: 1px solid ${c.line};
  }
  .wa-brand { display: flex; align-items: center; gap: 10px; }
  .wa-orb {
    width: 10px; height: 10px; border-radius: 999px;
    background: ${c.accent};
    box-shadow: 0 0 0 3px ${c.wash};
    flex-shrink: 0;
  }
  .wa-wordmark {
    font-family: ${display};
    font-size: 16px; font-weight: 600; letter-spacing: -0.03em;
    color: ${c.ink};
  }
  #wa-close {
    width: 32px; height: 32px; border-radius: 999px;
    border: 1px solid ${c.line}; background: ${c.paper}; color: ${c.ink};
    font: 500 18px/1 ${body}; cursor: pointer;
    display: grid; place-items: center;
  }
  #wa-close:hover { background: ${c.wash}; }
  .wa-a2a {
    padding: 12px 16px;
    background: ${c.wash};
    border-bottom: 1px solid ${c.line};
    font-size: 12px; color: ${c.muted};
  }
  .wa-a2a em { font-style: normal; color: ${c.ink}; font-weight: 600; }
  .wa-a2a-row { display: flex; gap: 8px; align-items: center; margin-top: 8px; }
  #wa-url {
    flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    color: ${c.muted}; background: ${c.paper}; border: 1px solid ${c.line};
    border-radius: 999px; padding: 8px 12px; font-size: 12px;
  }
  #wa-copy-prompt, .wa-send {
    border: 0; border-radius: 999px; cursor: pointer;
    background: ${c.fab}; color: ${c.fabText};
    padding: 8px 14px;
    font-family: ${body}; font-size: 12px; font-weight: 600;
    white-space: nowrap;
  }
  .wa-chip {
    border: 1px solid ${c.line}; border-radius: 999px; cursor: pointer;
    background: ${c.paper}; color: ${c.ink};
    padding: 8px 12px;
    font-family: ${body}; font-size: 12px; font-weight: 500;
    text-align: left;
  }
  .wa-chip:hover { background: ${c.wash}; }
  #wa-log { flex: 1; overflow: auto; padding: 16px; background: ${c.paper}; }
  .wa-msg {
    margin: 8px 0; padding: 10px 14px; border-radius: 16px;
    font-size: 14px; line-height: 1.55;
  }
  .wa-msg.human {
    background: ${c.ink}; color: ${c.paper};
    margin-left: 36px; border-bottom-right-radius: 6px;
    white-space: pre-wrap;
  }
  .wa-msg.agent {
    background: ${c.wash}; color: ${c.ink};
    margin-right: 36px; border-bottom-left-radius: 6px;
    white-space: normal;
  }
  .wa-msg.agent p { margin: 0 0 .65em; }
  .wa-msg.agent p:last-child { margin-bottom: 0; }
  .wa-msg.agent strong { font-weight: 600; color: ${c.ink}; }
  .wa-msg.agent em { font-style: italic; }
  .wa-md-h {
    font-family: ${display};
    font-size: 15px; font-weight: 600; letter-spacing: -0.03em;
    margin: .7em 0 .3em; line-height: 1.3; color: ${c.ink};
  }
  .wa-md-h:first-child { margin-top: 0; }
  .wa-md-ul, .wa-md-ol { margin: .2em 0 .7em; padding-left: 1.2em; }
  .wa-md-ul { list-style: disc; }
  .wa-md-ol { list-style: decimal; }
  .wa-md-ul li, .wa-md-ol li { margin: .2em 0; }
  .wa-md-link { color: ${c.ink}; font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
  .wa-inline-code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: .84em; background: ${c.line}; color: ${c.ink};
    padding: .1em .35em; border-radius: 4px;
  }
  .wa-code-wrap {
    margin: .5em 0; border-radius: 10px; background: ${c.ink}; color: ${c.paper};
    overflow: hidden;
  }
  .wa-code-lang {
    font-family: ui-monospace, Menlo, monospace;
    font-size: 10px; letter-spacing: .04em; text-transform: uppercase;
    color: ${c.muted}; padding: 6px 10px; border-bottom: 1px solid ${c.line};
  }
  .wa-code {
    margin: 0; padding: 10px 12px; overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px; line-height: 1.5; color: ${c.paper};
  }
  .wa-code code { font: inherit; color: inherit; }
  .wa-welcome { color: ${c.ink}; }
  .wa-welcome h4 {
    margin: 4px 0 8px;
    font-family: ${display};
    font-size: 22px; font-weight: 600; letter-spacing: -0.04em; line-height: 1.2;
  }
  .wa-welcome p { margin: 0; color: ${c.muted}; font-size: 14px; }
  #wa-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .wa-form {
    display: flex; gap: 8px; align-items: center;
    padding: 12px 14px 14px;
    border-top: 1px solid ${c.line}; background: ${c.paper};
  }
  #wa-text {
    flex: 1; border: 1px solid ${c.line}; border-radius: 999px;
    padding: 10px 14px; font: inherit; background: ${c.wash}; color: ${c.ink};
    outline: none;
  }
  #wa-text:focus { border-color: ${c.ink}; background: ${c.paper}; }
  #wa-text::placeholder { color: ${c.muted}; }
  .wa-run-id { display: none; }
</style>
<button id="wa-fab" type="button">${esc(b.fabLabel)}</button>
<div id="wa-panel" role="dialog" aria-label="${esc(b.name)} agent">
  <div class="wa-hdr">
    <div class="wa-brand"><span class="wa-orb" aria-hidden="true"></span><strong class="wa-wordmark">${esc(b.wordmark || b.name)}</strong></div>
    <button id="wa-close" type="button" aria-label="Close">×</button>
  </div>
  <div class="wa-a2a">
    <div>${esc(w.copyHeadline)}</div>
    <div class="wa-a2a-row">
      <span id="wa-url">${esc(publicUrl)}</span>
      <button type="button" id="wa-copy-prompt">Copy prompt</button>
    </div>
  </div>
  <div id="wa-log">
    <div class="wa-welcome" id="wa-welcome">
      <h4>${esc(w.welcomeTitle)}</h4>
      <p>${esc(w.welcomeBody)}</p>
      <div id="wa-chips">${chips}</div>
    </div>
  </div>
  <form class="wa-form" id="wa-form">
    <input id="wa-text" type="text" placeholder="${esc(w.placeholder)}" autocomplete="off"/>
    <button class="wa-send" type="submit">Send</button>
  </form>
  <span class="wa-run-id">${esc(runId)}</span>
</div>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
