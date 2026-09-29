import { smallestCopyPrompt } from "./card.ts";
import { renderChatMarkdown } from "./md.ts";
import type { SmallestPack } from "./types.ts";

export function smallestWidget(publicUrl: string, runId: string, pack: SmallestPack): string {
  const prompt = smallestCopyPrompt(publicUrl);
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
      fab.classList.toggle("open", open);
      fab.textContent = open ? "Close" : "Ask Smallest";
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
    const md = ${renderChatMarkdown.toString()};
    const add = (cls, text) => {
      const welcome = document.getElementById("wa-welcome");
      if (welcome) welcome.remove();
      const d = document.createElement("div");
      d.className = "wa-msg " + cls;
      if (cls === "agent") d.innerHTML = md(text);
      else d.textContent = text;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
    };
    let lastAgent = "";
    if (!window.__waSession) window.__waSession = "s" + Date.now();
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

function widgetMarkup(publicUrl: string, runId: string, pack: SmallestPack): string {
  const chips = pack.starterQuestions
    .slice(0, 4)
    .map((q) => `<button class="wa-chip" type="button" data-q="${esc(q)}">${esc(q)}</button>`)
    .join("");
  return `
<style>
  @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Geist:wght@400;500;600&display=swap");
  #wa-fab, #wa-panel, #wa-panel * { box-sizing: border-box; }
  #wa-fab {
    position: fixed; right: 20px; bottom: 20px; z-index: 99999;
    border: 0; border-radius: 999px; cursor: pointer;
    background: #191919; color: #fff;
    padding: 12px 20px;
    font-family: Geist, ui-sans-serif, system-ui, sans-serif;
    font-size: 14px; font-weight: 600; line-height: 1;
    letter-spacing: -0.01em;
    box-shadow: 0 8px 24px rgba(1,1,1,.16);
    transition: transform .15s ease, background .15s ease;
  }
  #wa-fab:hover { background: #010101; transform: translateY(-1px); }
  #wa-fab.open {
    background: #fff; color: #191919; border: 1px solid #e5e5e5;
    box-shadow: 0 8px 24px rgba(1,1,1,.08);
  }
  #wa-fab.open:hover { background: #f5f5f5; }
  #wa-panel {
    display: none; position: fixed; right: 20px; bottom: 72px; z-index: 99999;
    width: min(400px, calc(100vw - 24px));
    height: min(640px, calc(100vh - 100px));
    background: #fff; color: #191919;
    border: 1px solid #e5e5e5;
    border-radius: 24px;
    box-shadow: 0 24px 64px rgba(1,1,1,.12), 0 2px 8px rgba(1,1,1,.04);
    flex-direction: column; overflow: hidden;
    font-family: Geist, ui-sans-serif, system-ui, sans-serif;
    font-size: 14px; line-height: 1.5; letter-spacing: -0.01em;
    -webkit-font-smoothing: antialiased;
  }
  #wa-panel.open { display: flex; }
  .wa-hdr {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 16px 14px 18px;
    background: #fff;
    border-bottom: 1px solid #ededed;
  }
  .wa-brand { display: flex; align-items: center; gap: 10px; }
  .wa-orb {
    width: 10px; height: 10px; border-radius: 999px;
    background: radial-gradient(circle at 30% 30%, #ffe27a, #f5c518 55%, #c98912);
    box-shadow: 0 0 0 3px #fff6c8;
    flex-shrink: 0;
  }
  .wa-wordmark {
    font-family: Archivo, Geist, sans-serif;
    font-size: 16px; font-weight: 600; letter-spacing: -0.03em;
    color: #191919;
  }
  #wa-close {
    width: 32px; height: 32px; border-radius: 999px;
    border: 1px solid #e5e5e5; background: #fff; color: #191919;
    font: 500 18px/1 Geist, sans-serif; cursor: pointer;
    display: grid; place-items: center;
  }
  #wa-close:hover { background: #f5f5f5; }
  .wa-a2a {
    padding: 12px 16px;
    background: #f5f5f5;
    border-bottom: 1px solid #ededed;
    font-size: 12px; color: #6f6f6f;
  }
  .wa-a2a em { font-style: normal; color: #191919; font-weight: 600; }
  .wa-a2a-row { display: flex; gap: 8px; align-items: center; margin-top: 8px; }
  #wa-url {
    flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    color: #525252; background: #fff; border: 1px solid #e5e5e5;
    border-radius: 999px; padding: 8px 12px; font-size: 12px;
  }
  #wa-copy-prompt, .wa-send {
    border: 0; border-radius: 999px; cursor: pointer;
    background: #191919; color: #fff;
    padding: 8px 14px;
    font-family: Geist, sans-serif; font-size: 12px; font-weight: 600;
    white-space: nowrap;
  }
  #wa-copy-prompt:hover, .wa-send:hover { background: #010101; }
  .wa-chip {
    border: 1px solid #e5e5e5; border-radius: 999px; cursor: pointer;
    background: #fff; color: #191919;
    padding: 8px 12px;
    font-family: Geist, sans-serif; font-size: 12px; font-weight: 500;
    text-align: left;
  }
  .wa-chip:hover { background: #f5f5f5; border-color: #d4d4d4; }
  #wa-log { flex: 1; overflow: auto; padding: 16px; background: #fff; }
  .wa-msg {
    margin: 8px 0; padding: 10px 14px; border-radius: 16px;
    font-size: 14px; line-height: 1.55;
  }
  .wa-msg.human {
    background: #191919; color: #fff;
    margin-left: 36px; border-bottom-right-radius: 6px;
    white-space: pre-wrap;
  }
  .wa-msg.agent {
    background: #f5f5f5; color: #191919;
    margin-right: 36px; border-bottom-left-radius: 6px;
    white-space: normal;
  }
  .wa-msg.agent p { margin: 0 0 .65em; }
  .wa-msg.agent p:last-child { margin-bottom: 0; }
  .wa-msg.agent strong { font-weight: 600; color: #010101; }
  .wa-msg.agent em { font-style: italic; }
  .wa-md-h {
    font-family: Archivo, Geist, sans-serif;
    font-size: 15px; font-weight: 600; letter-spacing: -0.03em;
    margin: .7em 0 .3em; line-height: 1.3; color: #191919;
  }
  .wa-md-h:first-child { margin-top: 0; }
  .wa-md-ul, .wa-md-ol { margin: .2em 0 .7em; padding-left: 1.2em; }
  .wa-md-ul { list-style: disc; }
  .wa-md-ol { list-style: decimal; }
  .wa-md-ul li, .wa-md-ol li { margin: .2em 0; }
  .wa-md-link { color: #191919; font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
  .wa-md-link:hover { color: #010101; }
  .wa-inline-code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: .84em; background: #ececec; color: #191919;
    padding: .1em .35em; border-radius: 4px;
  }
  .wa-code-wrap {
    margin: .5em 0; border-radius: 10px; background: #191919; color: #f5f5f5;
    overflow: hidden;
  }
  .wa-code-lang {
    font-family: ui-monospace, Menlo, monospace;
    font-size: 10px; letter-spacing: .04em; text-transform: uppercase;
    color: #a1a1a1; padding: 6px 10px; border-bottom: 1px solid #2a2a2a;
  }
  .wa-code {
    margin: 0; padding: 10px 12px; overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px; line-height: 1.5; color: #f5f5f5;
  }
  .wa-code code { font: inherit; color: inherit; }
  .wa-welcome { color: #191919; }
  .wa-welcome h4 {
    margin: 4px 0 8px;
    font-family: Archivo, Geist, sans-serif;
    font-size: 22px; font-weight: 600; letter-spacing: -0.04em; line-height: 1.2;
  }
  .wa-welcome p { margin: 0; color: #6f6f6f; font-size: 14px; }
  #wa-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .wa-form {
    display: flex; gap: 8px; align-items: center;
    padding: 12px 14px 14px;
    border-top: 1px solid #ededed; background: #fff;
  }
  #wa-text {
    flex: 1; border: 1px solid #e5e5e5; border-radius: 999px;
    padding: 10px 14px; font: inherit; background: #f5f5f5; color: #191919;
    outline: none;
  }
  #wa-text:focus { border-color: #191919; background: #fff; }
  #wa-text::placeholder { color: #a1a1a1; }
  .wa-run-id { display: none; }
</style>
<button id="wa-fab" type="button">Ask Smallest</button>
<div id="wa-panel" role="dialog" aria-label="Smallest AI agent">
  <div class="wa-hdr">
    <div class="wa-brand"><span class="wa-orb" aria-hidden="true"></span><strong class="wa-wordmark">smallest.ai</strong></div>
    <button id="wa-close" type="button" aria-label="Close">×</button>
  </div>
  <div class="wa-a2a">
    <div>Talk to Smallest agents</div>
    <div class="wa-a2a-row">
      <span id="wa-url">${esc(publicUrl)}</span>
      <button type="button" id="wa-copy-prompt">Copy prompt</button>
    </div>
  </div>
  <div id="wa-log">
    <div class="wa-welcome" id="wa-welcome">
      <h4>How can I help?</h4>
      <p>Tell me what you are trying to get working. I will ask a little, then point you at the right setup.</p>
      <div id="wa-chips">${chips}</div>
    </div>
  </div>
  <form class="wa-form" id="wa-form">
    <input id="wa-text" type="text" placeholder="What are you trying to get working?" autocomplete="off"/>
    <button class="wa-send" type="submit">Send</button>
  </form>
  <span class="wa-run-id">${esc(runId)}</span>
</div>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
