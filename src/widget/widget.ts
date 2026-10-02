import { renderCopyPrompt } from "../pack/prompt.ts";
import type { AgentPackConfig } from "../pack/types.ts";
import { renderChatMarkdown } from "./md.ts";

export function packWidget(publicUrl: string, runId: string, config: AgentPackConfig): string {
  const prompt = renderCopyPrompt(config, publicUrl);
  const markup = widgetMarkup(publicUrl, runId, config);
  const fabOpen = config.brand.fabLabel;
  const markdown = config.widget.markdown !== false;
  const hints = (config.widget.chips.length ? config.widget.chips : [config.widget.placeholder || fabOpen]).slice(0, 4);
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
  const HINTS = ${JSON.stringify(hints)};
  const bind = () => {
    if (window.__waBound) return;
    const fab = document.getElementById("wa-fab");
    const panel = document.getElementById("wa-panel");
    if (!fab || !panel) return;
    window.__waBound = true;
    const root = document.getElementById("wa-root");
    const backdrop = document.getElementById("wa-backdrop");
    const input = document.getElementById("wa-text");
    const hint = document.getElementById("wa-hint");
    const form = document.getElementById("wa-form");
    const sendBtn = document.querySelector(".wa-send");
    let hintI = 0;
    let hintTimer = 0;
    let sending = false;
    const busyHint = () => !!(input && (input.value.trim() || document.activeElement === input));
    const paintHint = () => {
      if (!hint || !HINTS.length) return;
      hint.textContent = HINTS[hintI % HINTS.length];
      hint.dataset.on = busyHint() ? "0" : "1";
    };
    const cycleHint = () => {
      if (busyHint() || !HINTS.length || !hint) return;
      hint.classList.add("swap");
      setTimeout(() => {
        hintI = (hintI + 1) % HINTS.length;
        hint.classList.add("from");
        paintHint();
        hint.classList.remove("swap");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => hint.classList.remove("from"));
        });
      }, 240);
    };
    const startHints = () => {
      paintHint();
      if (hintTimer) clearInterval(hintTimer);
      hintTimer = setInterval(cycleHint, 3000);
    };
    const syncSend = () => {
      const on = !!(input && input.value.trim());
      if (sendBtn) sendBtn.classList.toggle("on", on);
      paintHint();
    };
    const setOpen = (open) => {
      if (root) root.classList.toggle("open", open);
      panel.classList.toggle("open", open);
      fab.classList.toggle("open", open);
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      if (backdrop) backdrop.setAttribute("aria-hidden", open ? "false" : "true");
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      paintHint();
    };
    fab.onclick = (e) => {
      e.preventDefault();
      const next = !panel.classList.contains("open");
      setOpen(next);
      if (next && input) input.focus();
      else if (input) input.blur();
    };
    const closeBtn = document.getElementById("wa-close");
    if (closeBtn) closeBtn.onclick = () => { setOpen(false); if (input) input.blur(); };
    if (backdrop) backdrop.onclick = () => { setOpen(false); if (input) input.blur(); };
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("open")) {
        setOpen(false);
        if (input) input.blur();
      }
    });
    if (form) {
      form.addEventListener("pointerdown", (e) => {
        if (panel.classList.contains("open")) return;
        if (sendBtn && sendBtn.contains(e.target)) return;
        if (input && e.target !== input) input.focus();
      });
    }
    if (input) {
      input.addEventListener("focus", () => setOpen(true));
      input.addEventListener("input", () => {
        if (input.value.trim()) setOpen(true);
        syncSend();
      });
    }
    const copyBtn = document.getElementById("wa-copy-prompt");
    if (copyBtn) copyBtn.onclick = async () => {
      try { await navigator.clipboard.writeText(PROMPT); } catch {}
      const prev = copyBtn.textContent; copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = prev; }, 1200);
    };
    const log = document.getElementById("wa-log");
    const md = ${markdown ? renderChatMarkdown.toString() : "null"};
    const thinkOn = () => {
      if (!log || document.getElementById("wa-thinking")) return;
      const d = document.createElement("div");
      d.className = "wa-msg agent thinking in";
      d.id = "wa-thinking";
      d.innerHTML = "<span></span><span></span><span></span>";
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
    };
    const thinkOff = () => {
      const t = document.getElementById("wa-thinking");
      if (t) t.remove();
    };
    const add = (cls, text) => {
      if (!log) return;
      const welcome = document.getElementById("wa-welcome");
      if (welcome) welcome.remove();
      if (cls === "agent") thinkOff();
      const d = document.createElement("div");
      d.className = "wa-msg " + cls + " in";
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
    const send = async (preset) => {
      const text = (preset || (input && input.value) || "").trim();
      if (!text || sending) return;
      sending = true;
      if (sendBtn) sendBtn.classList.add("busy");
      setOpen(true);
      add("human", text);
      if (input) input.value = "";
      syncSend();
      thinkOn();
      try {
        const res = await fetch(BASE + "/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text, session }),
        });
        const body = await res.json().catch(() => ({}));
        if (body.lastText && body.lastText !== lastAgent) { lastAgent = body.lastText; add("agent", body.lastText); }
        else if (!res.ok) thinkOff();
      } catch {
        thinkOff();
      } finally {
        sending = false;
        if (sendBtn) sendBtn.classList.remove("busy");
        if (input) input.focus();
      }
    };
    if (form) form.onsubmit = (e) => { e.preventDefault(); send(); };
    document.querySelectorAll(".wa-chip").forEach((chip) => {
      chip.onclick = () => send(chip.dataset.q || chip.textContent);
    });
    startHints();
    syncSend();
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
  const google = b.fonts.google ? `@import url("${b.fonts.google}");` : "";
  const chipList = (w.chips.length ? w.chips : config.widget.chips).slice(0, 4);
  const chips = chipList
    .map((q) => `<button class="wa-chip" type="button" data-q="${esc(q)}">${esc(q)}</button>`)
    .join("");
  const firstHint = chipList[0] || w.placeholder || b.fabLabel;
  const arrow = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12h12M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
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
    position: fixed; inset: 0; z-index: 99998;
    background: color-mix(in srgb, var(--wa-ink) 18%, transparent);
    border: 0; padding: 0; margin: 0; cursor: pointer;
    opacity: 0; pointer-events: none;
    transition: opacity .36s ease;
  }
  #wa-root.open #wa-backdrop { opacity: 1; pointer-events: auto; }
  #wa-stage {
    position: fixed; left: 50%; bottom: 28px; z-index: 99999;
    width: min(520px, calc(100vw - 32px));
    transform: translateX(-50%) translateY(6px);
    display: flex; flex-direction: column;
    max-height: min(680px, calc(100vh - 48px));
    border-radius: 999px;
    background: var(--wa-paper);
    box-shadow: 0 10px 36px rgba(1,1,1,.10), 0 1px 3px rgba(1,1,1,.05);
    overflow: hidden;
    transform-origin: 50% 100%;
    transition:
      width .48s cubic-bezier(.16,1,.3,1),
      border-radius .48s cubic-bezier(.16,1,.3,1),
      box-shadow .48s cubic-bezier(.16,1,.3,1),
      transform .48s cubic-bezier(.16,1,.3,1);
  }
  #wa-root.open #wa-stage {
    width: min(560px, calc(100vw - 32px));
    border-radius: 26px;
    box-shadow: 0 28px 80px rgba(1,1,1,.16), 0 2px 10px rgba(1,1,1,.05);
    transform: translateX(-50%) translateY(0);
  }
  #wa-stage:focus-within {
    box-shadow: 0 14px 44px rgba(1,1,1,.12), 0 0 0 3px color-mix(in srgb, var(--wa-ink) 8%, transparent);
  }
  #wa-root.open #wa-stage:focus-within {
    box-shadow: 0 28px 80px rgba(1,1,1,.16), 0 2px 10px rgba(1,1,1,.05);
  }
  #wa-fab {
    display: inline-flex; align-items: center; gap: 8px;
    flex-shrink: 0; border: 0; background: transparent;
    color: var(--wa-muted); cursor: pointer;
    font-family: ${body};
    font-size: 13px; font-weight: 500; line-height: 1;
    letter-spacing: -0.02em;
    padding: 10px 2px 10px 4px;
    min-height: 36px;
  }
  #wa-fab .wa-orb {
    width: 8px; height: 8px; border-radius: 999px;
    background: var(--wa-accent);
    box-shadow: 0 0 0 3px var(--wa-wash);
    flex-shrink: 0;
    animation: wa-pulse 2.6s ease-in-out infinite;
  }
  #wa-root.open #wa-fab .wa-orb { animation: none; }
  @keyframes wa-pulse {
    0%, 100% { box-shadow: 0 0 0 3px var(--wa-wash); }
    50% { box-shadow: 0 0 0 6px var(--wa-wash); }
  }
  #wa-fab .wa-fab-label {
    position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0);
  }
  #wa-panel {
    display: grid;
    grid-template-rows: 0fr;
    color: var(--wa-ink);
    font-family: ${body};
    font-size: 15px; line-height: 1.55; letter-spacing: -0.015em;
    -webkit-font-smoothing: antialiased;
    transition: grid-template-rows .5s cubic-bezier(.16,1,.3,1);
  }
  #wa-panel.open { grid-template-rows: 1fr; }
  .wa-panel-inner { overflow: hidden; min-height: 0; display: flex; flex-direction: column; }
  #wa-panel.open .wa-panel-inner { min-height: min(420px, calc(100vh - 200px)); }
  .wa-hdr {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 18px 10px 20px;
    opacity: 0; transform: translateY(8px);
    transition: opacity .32s ease .08s, transform .4s cubic-bezier(.16,1,.3,1) .08s;
  }
  #wa-panel.open .wa-hdr { opacity: 1; transform: none; }
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
    background: var(--wa-wash); color: var(--wa-muted);
    display: grid; place-items: center; flex-shrink: 0;
    padding: 0;
    transition: background .2s ease, color .2s ease, transform .18s ease, opacity .2s ease;
  }
  .wa-send.on { background: ${c.fab}; color: ${c.fabText}; }
  .wa-send:hover { transform: translateY(-1px); }
  .wa-send.busy { opacity: .55; pointer-events: none; }
  .wa-chip {
    border: 1px solid var(--wa-line); border-radius: 999px; cursor: pointer;
    background: var(--wa-paper); color: var(--wa-ink);
    padding: 8px 14px;
    font-family: ${body}; font-size: 13px; font-weight: 500;
    letter-spacing: -0.015em;
    text-align: center;
    transition: background .16s ease, transform .16s ease, border-color .16s ease;
  }
  .wa-chip:hover { background: var(--wa-wash); transform: translateY(-1px); border-color: color-mix(in srgb, var(--wa-ink) 14%, var(--wa-line)); }
  #wa-log { flex: 1; overflow: auto; padding: 8px 20px 16px; background: transparent; min-height: 0; }
  .wa-msg {
    margin: 10px 0; padding: 10px 14px; border-radius: 18px;
    font-size: 15px; line-height: 1.5;
    width: fit-content; max-width: min(86%, 36em);
    overflow-wrap: anywhere;
  }
  .wa-msg.in { animation: wa-in .34s cubic-bezier(.16,1,.3,1); }
  @keyframes wa-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: none; }
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
  .wa-msg.thinking {
    display: flex; gap: 5px; align-items: center; width: fit-content;
    padding: 14px 18px;
  }
  .wa-msg.thinking span {
    width: 6px; height: 6px; border-radius: 999px;
    background: var(--wa-muted);
    animation: wa-dot 1.1s ease-in-out infinite;
  }
  .wa-msg.thinking span:nth-child(2) { animation-delay: .15s; }
  .wa-msg.thinking span:nth-child(3) { animation-delay: .3s; }
  @keyframes wa-dot {
    0%, 80%, 100% { opacity: .28; transform: translateY(0); }
    40% { opacity: 1; transform: translateY(-3px); }
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
    padding: 28px 12px 16px;
    opacity: 0; transform: translateY(10px);
    transition: opacity .36s ease .12s, transform .46s cubic-bezier(.16,1,.3,1) .12s;
  }
  #wa-panel.open .wa-welcome { opacity: 1; transform: none; }
  .wa-welcome h4 {
    margin: 0 0 10px;
    font-family: ${display};
    font-size: 28px; font-weight: 600; letter-spacing: -0.045em; line-height: 1.15;
  }
  .wa-welcome p { margin: 0 auto; max-width: 28em; color: var(--wa-muted); font-size: 15px; line-height: 1.5; }
  #wa-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; justify-content: center; }
  .wa-form {
    display: flex; gap: 8px; align-items: center;
    padding: 10px 10px 10px 16px;
    background: transparent;
    border: 0;
    border-radius: 0;
  }
  #wa-root.open .wa-form {
    border-top: 1px solid var(--wa-line);
    padding: 12px 14px 14px;
  }
  .wa-field { position: relative; flex: 1; min-width: 0; }
  #wa-text {
    width: 100%; border: 0; border-radius: 0;
    padding: 12px 4px; font: inherit; background: transparent; color: var(--wa-ink);
    outline: none;
    font-size: 15px; letter-spacing: -0.02em;
  }
  #wa-text::placeholder { color: transparent; }
  #wa-hint {
    position: absolute; left: 4px; right: 4px; top: 50%;
    transform: translateY(-50%);
    color: var(--wa-muted);
    font-size: 15px; letter-spacing: -0.02em; line-height: 1.3;
    pointer-events: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    opacity: 0;
    transition: opacity .26s ease, transform .3s cubic-bezier(.16,1,.3,1);
  }
  #wa-hint[data-on="1"] { opacity: 1; }
  #wa-hint.swap { opacity: 0; transform: translateY(-70%); }
  #wa-hint.from { opacity: 0; transform: translateY(-20%); }
  .wa-run-id { display: none; }
  @media (max-width: 640px) {
    #wa-stage { bottom: 16px; }
    #wa-root.open #wa-stage { width: calc(100vw - 20px); }
    .wa-welcome { padding: 20px 4px 12px; }
    .wa-welcome h4 { font-size: 22px; }
    #wa-log { padding: 4px 16px 14px; }
    #wa-panel.open .wa-panel-inner { min-height: min(360px, calc(100vh - 160px)); }
  }
  @media (prefers-reduced-motion: reduce) {
    #wa-stage, #wa-panel, #wa-backdrop, #wa-hint, .wa-hdr, .wa-welcome, .wa-msg.in, #wa-fab .wa-orb {
      animation: none !important; transition: none !important;
    }
  }
</style>
<div id="wa-root">
  <button id="wa-backdrop" type="button" aria-hidden="true" aria-label="Close"></button>
  <div id="wa-stage">
    <div id="wa-panel" role="dialog" aria-label="${esc(b.name)} agent" aria-hidden="true">
      <div class="wa-panel-inner">
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
    </div>
    <form class="wa-form" id="wa-form">
      <button id="wa-fab" type="button" aria-expanded="false" aria-label="${esc(b.fabLabel)}"><span class="wa-orb" aria-hidden="true"></span><span class="wa-fab-label">${esc(b.fabLabel)}</span></button>
      <div class="wa-field">
        <input id="wa-text" type="text" placeholder="${esc(firstHint)}" autocomplete="off"/>
        <span id="wa-hint" data-on="1">${esc(firstHint)}</span>
      </div>
      <button class="wa-send" type="submit" aria-label="Send">${arrow}</button>
    </form>
    <span class="wa-run-id">${esc(runId)}</span>
  </div>
</div>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
