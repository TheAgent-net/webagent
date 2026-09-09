import { connectPrompt } from "./card.ts";

/** Floating chat + A2A copy. Mounts after Next.js hydration so it is not wiped. */
export function floatingWidget(publicUrl: string, runId: string): string {
  const prompt = connectPrompt(publicUrl);
  const markup = widgetMarkup(publicUrl, runId);
  return `
<link rel="alternate" type="application/json" href="/agent.json"/>
<link rel="describedby" href="/.well-known/agent-card.json"/>
<script>
(() => {
  const MARKUP = ${JSON.stringify(markup)};
  const PROMPT = ${JSON.stringify(prompt)};
  const URL_TEXT = ${JSON.stringify(publicUrl)};
  const bind = () => {
    if (window.__waBound) return;
    const fab = document.getElementById("wa-fab");
    const panel = document.getElementById("wa-panel");
    if (!fab || !panel) return;
    window.__waBound = true;
    fab.onclick = () => panel.classList.toggle("open");
    const toast = (m) => {
      const el = document.getElementById("wa-toast");
      if (!el) return;
      el.textContent = m; el.classList.add("on");
      setTimeout(() => el.classList.remove("on"), 1400);
    };
    const fallbackCopy = (text) => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.left = "-9999px";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand("copy"); ta.remove();
      if (!ok) throw new Error("copy");
    };
    const copy = async (text, ok) => {
      try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
        else fallbackCopy(text);
        toast(ok);
      } catch {
        try { fallbackCopy(text); toast(ok); } catch { toast("Copy failed"); }
      }
    };
    const flash = (btn, label) => {
      const prev = btn.textContent; btn.textContent = label;
      setTimeout(() => { btn.textContent = prev; }, 1600);
    };
    document.getElementById("wa-copy-url").onclick = async (ev) => {
      await copy(URL_TEXT, "Link copied"); flash(ev.currentTarget, "Copied");
    };
    document.getElementById("wa-copy-prompt").onclick = async (ev) => {
      await copy(PROMPT, "Prompt copied"); flash(ev.currentTarget, "Copied");
    };
    const log = document.getElementById("wa-log");
    const add = (cls, text) => {
      const d = document.createElement("div");
      d.className = "wa-row " + cls; d.textContent = text;
      log.appendChild(d); log.scrollTop = log.scrollHeight;
    };
    const es = new EventSource("/live");
    es.onmessage = (e) => {
      const ev = JSON.parse(e.data);
      if (ev.t === "say") add(ev.from || "human", (ev.from || "") + ": " + ev.text);
      if (ev.t === "reply") add("agent", ev.text || "");
    };
    document.getElementById("wa-form").onsubmit = async (e) => {
      e.preventDefault();
      const input = document.getElementById("wa-text");
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      await fetch("/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
    };
  };
  const mount = () => {
    if (!document.getElementById("wa-fab")) {
      window.__waBound = false;
      const wrap = document.createElement("div");
      wrap.id = "wa-root";
      wrap.innerHTML = MARKUP;
      document.body.appendChild(wrap);
    }
    bind();
  };
  const start = () => { mount(); setInterval(mount, 1200); };
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
</script>`;
}

function widgetMarkup(publicUrl: string, runId: string): string {
  return `
<style>
  .wa-fab, .wa-panel, .wa-toast { font-family: ui-sans-serif, system-ui, sans-serif; }
  .wa-fab {
    position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 2147483000;
    width: 3.4rem; height: 3.4rem; border-radius: 50%; border: 0; cursor: pointer;
    background: #00b8d4; color: #001018; box-shadow: 0 8px 28px rgba(0,184,212,.35);
    font-size: 1.35rem;
  }
  .wa-panel {
    position: fixed; right: 1.25rem; bottom: 5.2rem; z-index: 2147483000;
    width: min(24.5rem, calc(100vw - 1.5rem)); height: min(34rem, calc(100vh - 7rem));
    background: #0a1929; color: #fff; border: 1px solid rgba(255,255,255,.12);
    border-radius: 16px; display: none; flex-direction: column; overflow: hidden;
    box-shadow: 0 18px 50px rgba(0,0,0,.45);
  }
  .wa-panel.open { display: flex; }
  .wa-h { padding: .85rem 1rem .7rem; border-bottom: 1px solid rgba(255,255,255,.1); }
  .wa-h strong { display: block; font-size: .92rem; }
  .wa-h p { margin: .35rem 0 0; color: #9aa3ad; font-size: .78rem; line-height: 1.4; }
  .wa-paste { display: flex; gap: .35rem; margin-top: .65rem; flex-wrap: wrap; }
  .wa-paste code {
    flex: 1; min-width: 8rem; font-size: .68rem; background: #050a14; color: #00d4ff;
    padding: .4rem .5rem; overflow: auto; border: 1px solid rgba(255,255,255,.08);
  }
  .wa-btn {
    font-family: ui-monospace, Menlo, monospace; font-size: .62rem; letter-spacing: .06em;
    text-transform: uppercase; border: 1px solid #fff; background: transparent; color: #fff;
    padding: .4rem .55rem; cursor: pointer;
  }
  .wa-btn.solid { background: #fff; color: #000; }
  .wa-status { font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; color: #9ad8b0; padding: .45rem 1rem 0; }
  .wa-status i { display: inline-block; width: .45rem; height: .45rem; border-radius: 50%; background: #00cc66; margin-right: .35rem; }
  #wa-log { flex: 1; overflow: auto; padding: .75rem 1rem; font-size: .88rem; line-height: 1.45; }
  .wa-row { margin: .45rem 0; white-space: pre-wrap; }
  .wa-row.human { color: #9ad8ff; }
  .wa-row.agent { color: #e8eef5; }
  .wa-form { display: flex; gap: .45rem; padding: .75rem; border-top: 1px solid rgba(255,255,255,.1); }
  .wa-form input {
    flex: 1; background: #050a14; border: 1px solid rgba(255,255,255,.14); color: #fff;
    padding: .65rem .8rem; border-radius: 999px; outline: none; font: inherit;
  }
  .wa-form button {
    width: 2.3rem; height: 2.3rem; border-radius: 50%; border: 0; background: #00b8d4; color: #001018; cursor: pointer;
  }
  .wa-toast {
    position: fixed; bottom: 5.4rem; right: 1.4rem; z-index: 2147483001;
    background: #fff; color: #000; padding: .4rem .7rem; font-size: .75rem; opacity: 0; transition: opacity .2s;
  }
  .wa-toast.on { opacity: 1; }
</style>
<button class="wa-fab" id="wa-fab" type="button" aria-label="Open agent chat">✦</button>
<div class="wa-panel" id="wa-panel" role="dialog" aria-label="Composio apps agent">
  <div class="wa-h">
    <strong>Let your agent talk to our agent directly</strong>
    <p>Paste this link into your agent. Or copy the connect prompt (card, MCP initialize, then chat). Run ${esc(runId)}.</p>
    <div class="wa-paste">
      <code id="wa-url">${esc(publicUrl)}</code>
      <button class="wa-btn" type="button" id="wa-copy-url">Copy link</button>
      <button class="wa-btn solid" type="button" id="wa-copy-prompt">Copy connect prompt</button>
    </div>
  </div>
  <div class="wa-status"><i></i>connected · Ask this agent which Composio app fits</div>
  <div id="wa-log"></div>
  <form class="wa-form" id="wa-form">
    <input id="wa-text" autocomplete="off" placeholder="Ask your agent something..."/>
    <button type="submit" aria-label="Send">➤</button>
  </form>
</div>
<div class="wa-toast" id="wa-toast">Copied</div>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
