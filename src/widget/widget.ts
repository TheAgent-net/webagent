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
    const root = document.getElementById("wa-root");
    const backdrop = document.getElementById("wa-backdrop");
    const input = document.getElementById("wa-text");
    const setOpen = (open) => {
      if (root) root.classList.toggle("open", open);
      panel.classList.toggle("open", open);
      fab.classList.toggle("open", open);
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      if (backdrop) {
        backdrop.hidden = !open;
        backdrop.setAttribute("aria-hidden", open ? "false" : "true");
      }
      panel.setAttribute("aria-hidden", open ? "false" : "true");
    };
    fab.onclick = () => {
      const next = !panel.classList.contains("open");
      setOpen(next);
      if (next && input) input.focus();
    };
    const closeBtn = document.getElementById("wa-close");
    if (closeBtn) closeBtn.onclick = () => setOpen(false);
    if (backdrop) backdrop.onclick = () => setOpen(false);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("open")) setOpen(false);
    });
    if (input) {
      input.addEventListener("focus", () => setOpen(true));
    }
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
    const send = async () => {
      const text = input.value.trim();
      if (!text) return;
      setOpen(true);
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
    void FAB_OPEN;
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
  const placeholder = w.placeholder || b.fabLabel;
  const arrow = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h12M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return `
<style>
  ${google}
  #wa-root, #wa-panel, #wa-fab {
    --wa-ink: ${c.ink};
    --wa-paper: ${c.paper};
    --wa-muted: ${c.muted};
    --wa-line: ${c.line};
    --wa-wash: ${c.wash};
    --wa-accent: ${c.accent};
  }
  #wa-root, #wa-root *, #wa-fab, #wa-panel, #wa-panel * { box-sizing: border-box; }
  #wa-backdrop {
    display: none; position: fixed; inset: 0; z-index: 99998;
    background: color-mix(in srgb, var(--wa-ink) 18%, transparent);
    border: 0; padding: 0; margin: 0; cursor: pointer;
  }
  #wa-root.open #wa-backdrop { display: block; }
  #wa-stage {
    position: fixed; left: 50%; bottom: 32px; z-index: 99999;
    width: min(560px, calc(100vw - 32px));
    transform: translateX(-50%);
    display: flex; flex-direction: column;
    max-height: min(640px, calc(100vh - 64px));
    pointer-events: none;
  }
  #wa-stage > * { pointer-events: auto; }
  #wa-root.open #wa-stage {
    bottom: 28px;
    max-height: min(640px, calc(100vh - 120px));
    background: var(--wa-paper);
    border-radius: 24px;
    box-shadow: 0 24px 80px rgba(1,1,1,.14), 0 2px 10px rgba(1,1,1,.04);
    overflow: hidden;
  }
  #wa-fab {
    display: inline-flex; align-items: center; gap: 8px;
    flex-shrink: 0; border: 0; background: transparent;
    color: var(--wa-muted); cursor: pointer;
    font-family: ${body};
    font-size: 13px; font-weight: 500; line-height: 1;
    letter-spacing: -0.02em;
    padding: 10px 4px 10px 6px;
    min-height: 36px;
  }
  #wa-fab .wa-orb {
    width: 8px; height: 8px; border-radius: 999px;
    background: var(--wa-accent);
    box-shadow: 0 0 0 3px var(--wa-wash);
    flex-shrink: 0;
  }
  #wa-fab .wa-fab-label {
    position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0);
  }
  #wa-panel {
    display: none;
    flex-direction: column; min-height: 0; flex: 1;
    background: var(--wa-paper); color: var(--wa-ink);
    font-family: ${body};
    font-size: 15px; line-height: 1.55; letter-spacing: -0.015em;
    -webkit-font-smoothing: antialiased;
  }
  #wa-panel.open { display: flex; }
  .wa-hdr {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 18px 12px 20px;
    background: transparent;
  }
  .wa-brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
  .wa-orb {
    width: 8px; height: 8px; border-radius: 999px;
    background: var(--wa-accent);
    box-shadow: 0 0 0 3px var(--wa-wash);
    flex-shrink: 0;
  }
  .wa-wordmark {
    font-family: ${display};
    font-size: 15px; font-weight: 600; letter-spacing: -0.03em;
    color: var(--wa-ink);
  }
  .wa-hdr-actions { display: flex; align-items: center; gap: 4px; }
  #wa-close {
    width: 32px; height: 32px; border-radius: 999px;
    border: 0; background: transparent; color: var(--wa-muted);
    font: 500 22px/1 ${body}; cursor: pointer;
    display: grid; place-items: center;
  }
  #wa-close:hover { color: var(--wa-ink); background: var(--wa-wash); }
  #wa-url { display: none; }
  #wa-copy-prompt {
    border: 0; background: transparent; cursor: pointer;
    color: var(--wa-muted);
    padding: 6px 10px;
    font-family: ${body}; font-size: 12px; font-weight: 500;
    letter-spacing: -0.01em;
    white-space: nowrap;
    border-radius: 999px;
  }
  #wa-copy-prompt:hover { color: var(--wa-ink); background: var(--wa-wash); }
  .wa-send {
    appearance: none; -webkit-appearance: none;
    width: 36px; height: 36px; border: 0; border-radius: 999px; cursor: pointer;
    background: ${c.fab}; color: ${c.fabText};
    display: grid; place-items: center; flex-shrink: 0;
    padding: 0;
  }
  .wa-send:hover { transform: translateY(-1px); }
  .wa-chip {
    border: 1px solid var(--wa-line); border-radius: 999px; cursor: pointer;
    background: var(--wa-paper); color: var(--wa-ink);
    padding: 8px 14px;
    font-family: ${body}; font-size: 13px; font-weight: 500;
    letter-spacing: -0.015em;
    text-align: center;
  }
  .wa-chip:hover { background: var(--wa-wash); }
  #wa-log { flex: 1; overflow: auto; padding: 8px 28px 20px; background: transparent; }
  .wa-msg {
    margin: 12px 0; padding: 12px 16px; border-radius: 18px;
    font-size: 15px; line-height: 1.55; max-width: 86%;
  }
  .wa-msg.human {
    background: var(--wa-ink); color: var(--wa-paper);
    margin-left: auto; border-bottom-right-radius: 6px;
    white-space: pre-wrap;
  }
  .wa-msg.agent {
    background: var(--wa-wash); color: var(--wa-ink);
    margin-right: auto; border-bottom-left-radius: 6px;
    white-space: normal;
  }
  .wa-msg.agent p { margin: 0 0 .65em; }
  .wa-msg.agent p:last-child { margin-bottom: 0; }
  .wa-msg.agent strong { font-weight: 600; color: var(--wa-ink); }
  .wa-msg.agent em { font-style: italic; }
  .wa-md-h {
    font-family: ${display};
    font-size: 16px; font-weight: 600; letter-spacing: -0.03em;
    margin: .7em 0 .3em; line-height: 1.3; color: var(--wa-ink);
  }
  .wa-md-h:first-child { margin-top: 0; }
  .wa-md-ul, .wa-md-ol { margin: .2em 0 .7em; padding-left: 1.2em; }
  .wa-md-ul { list-style: disc; }
  .wa-md-ol { list-style: decimal; }
  .wa-md-ul li, .wa-md-ol li { margin: .2em 0; }
  .wa-md-link { color: var(--wa-ink); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
  .wa-inline-code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: .84em; background: var(--wa-line); color: var(--wa-ink);
    padding: .1em .35em; border-radius: 4px;
  }
  .wa-code-wrap {
    margin: .5em 0; border-radius: 10px; background: var(--wa-ink); color: var(--wa-paper);
    overflow: hidden;
  }
  .wa-code-lang {
    font-family: ui-monospace, Menlo, monospace;
    font-size: 10px; letter-spacing: .04em; text-transform: uppercase;
    color: var(--wa-muted); padding: 6px 10px; border-bottom: 1px solid var(--wa-line);
  }
  .wa-code {
    margin: 0; padding: 10px 12px; overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px; line-height: 1.5; color: var(--wa-paper);
  }
  .wa-code code { font: inherit; color: inherit; }
  .wa-welcome {
    color: var(--wa-ink);
    text-align: center;
    padding: 36px 12px 20px;
  }
  .wa-welcome h4 {
    margin: 0 0 10px;
    font-family: ${display};
    font-size: 28px; font-weight: 600; letter-spacing: -0.045em; line-height: 1.15;
  }
  .wa-welcome p { margin: 0 auto; max-width: 28em; color: var(--wa-muted); font-size: 15px; line-height: 1.5; }
  #wa-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; justify-content: center; }
  .wa-form {
    display: flex; gap: 8px; align-items: center;
    padding: 8px 8px 8px 14px;
    background: var(--wa-paper);
    border: 1px solid var(--wa-line);
    border-radius: 999px;
    box-shadow: 0 10px 40px rgba(1,1,1,.10), 0 1px 3px rgba(1,1,1,.04);
  }
  #wa-root.open .wa-form {
    box-shadow: none;
    border-radius: 0;
    border: 0;
    border-top: 1px solid var(--wa-line);
    padding: 12px 14px 14px;
  }
  #wa-text {
    flex: 1; border: 0; border-radius: 0; min-width: 0;
    padding: 10px 4px; font: inherit; background: transparent; color: var(--wa-ink);
    outline: none;
    font-size: 15px; letter-spacing: -0.02em;
  }
  #wa-text::placeholder { color: var(--wa-muted); }
  .wa-run-id { display: none; }
  @media (max-width: 640px) {
    #wa-stage { bottom: 20px; }
    .wa-welcome { padding: 24px 4px 12px; }
    .wa-welcome h4 { font-size: 22px; }
    #wa-log { padding: 8px 16px 16px; }
  }
</style>
<div id="wa-root">
  <button id="wa-backdrop" type="button" hidden aria-hidden="true" aria-label="Close"></button>
  <div id="wa-stage">
    <div id="wa-panel" role="dialog" aria-label="${esc(b.name)} agent" aria-hidden="true">
      <div class="wa-hdr">
        <div class="wa-brand"><span class="wa-orb" aria-hidden="true"></span><strong class="wa-wordmark">${esc(b.wordmark || b.name)}</strong></div>
        <div class="wa-hdr-actions">
          <button type="button" id="wa-copy-prompt">Copy prompt</button>
          <button id="wa-close" type="button" aria-label="Close">×</button>
        </div>
      </div>
      <span id="wa-url">${esc(publicUrl)}</span>
      <div id="wa-log">
        <div class="wa-welcome" id="wa-welcome">
          <h4>${esc(w.welcomeTitle)}</h4>
          <p>${esc(w.welcomeBody)}</p>
          <div id="wa-chips">${chips}</div>
        </div>
      </div>
    </div>
    <form class="wa-form" id="wa-form">
      <button id="wa-fab" type="button" aria-expanded="false" aria-label="${esc(b.fabLabel)}"><span class="wa-orb" aria-hidden="true"></span><span class="wa-fab-label">${esc(b.fabLabel)}</span></button>
      <input id="wa-text" type="text" placeholder="${esc(placeholder)}" autocomplete="off"/>
      <button class="wa-send" type="submit" aria-label="Send">${arrow}</button>
    </form>
    <span class="wa-run-id">${esc(runId)}</span>
  </div>
</div>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
