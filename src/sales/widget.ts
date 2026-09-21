import { corgiCopyPrompt } from "./card.ts";

/** Floating chat widget for the Corgi insurance advisor. */
export function corgiWidget(publicUrl: string, runId: string): string {
  const prompt = corgiCopyPrompt(publicUrl);
  const markup = widgetMarkup(publicUrl, runId);
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
      fab.innerHTML = open ? CLOSE_ICON + "<span>Close</span>" : OPEN_ICON + "<span>Ask Corgi</span>";
      fab.classList.toggle("active", open);
      fab.classList.toggle("wa-btn-black", open);
      fab.classList.toggle("wa-btn-orange", !open);
      const wrap = document.getElementById("wa-fab-wrap");
      if (wrap) {
        wrap.classList.toggle("wa-press-black", open);
        wrap.classList.toggle("wa-press-orange", !open);
      }
      fab.setAttribute("aria-label", open ? "Close chat" : "Open chat");
    };
    fab.onclick = () => setOpen(!panel.classList.contains("open"));
    const closeBtn = document.getElementById("wa-close");
    if (closeBtn) closeBtn.onclick = () => setOpen(false);
    const fallbackCopy = (text) => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.left = "-9999px";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand("copy"); ta.remove();
      if (!ok) throw new Error("copy");
    };
    const copy = async (text) => {
      try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
        else fallbackCopy(text);
      } catch {
        try { fallbackCopy(text); } catch {}
      }
    };
    const flash = (btn) => {
      const prev = btn.textContent; btn.textContent = "Copied!";
      setTimeout(() => { btn.textContent = prev; }, 1400);
    };
    const copyBtn = document.getElementById("wa-copy-prompt");
    if (copyBtn) copyBtn.onclick = async (ev) => {
      await copy(PROMPT); flash(ev.currentTarget);
    };
    const log = document.getElementById("wa-log");
    const md = (raw) => {
      let s = raw;
      s = s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
      const blocks = []; let buf = '', inCode = false, lang = '';
      for (const line of s.split('\\n')) {
        if (!inCode && line.startsWith('\`\`\`')) {
          if (buf.trim()) blocks.push({t:'md',v:buf}); buf = '';
          lang = line.slice(3).trim(); inCode = true; continue;
        }
        if (inCode && line.startsWith('\`\`\`')) {
          blocks.push({t:'code',v:buf,lang}); buf = ''; inCode = false; continue;
        }
        buf += line + '\\n';
      }
      if (buf.trim()) blocks.push(inCode ? {t:'code',v:buf,lang} : {t:'md',v:buf});
      return blocks.map(b => {
        if (b.t === 'code') {
          const header = b.lang ? '<div class="wa-code-lang">' + b.lang + '</div>' : '';
          return '<div class="wa-code-wrap">' + header +
            '<pre class="wa-code"><code>' + b.v.replace(/\\n$/,'') + '</code></pre></div>';
        }
        let h = b.v;
        h = h.replace(/^### (.+)$/gm, '<h5 class="wa-md-h">$1</h5>');
        h = h.replace(/^## (.+)$/gm, '<h4 class="wa-md-h">$1</h4>');
        h = h.replace(/^# (.+)$/gm, '<h3 class="wa-md-h">$1</h3>');
        h = h.replace(/\\*\\*\\[HIGH\\]\\*\\*/g, '<span class="risk-high">HIGH</span>');
        h = h.replace(/\\*\\*\\[MEDIUM\\]\\*\\*/g, '<span class="risk-med">MEDIUM</span>');
        h = h.replace(/\\*\\*\\[LOW\\]\\*\\*/g, '<span class="risk-low">LOW</span>');
        h = h.replace(/\\[HIGH\\]/g, '<span class="risk-high">HIGH</span>');
        h = h.replace(/\\[MEDIUM\\]/g, '<span class="risk-med">MEDIUM</span>');
        h = h.replace(/\\[LOW\\]/g, '<span class="risk-low">LOW</span>');
        h = h.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
        h = h.replace(/(<li>.*<\\/li>\\n?)+/gs, (m) => '<ul class="wa-md-ul">' + m + '</ul>');
        h = h.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
        h = h.replace(/\\*(.+?)\\*/g, '<em>$1</em>');
        h = h.replace(/\`([^\`]+)\`/g, '<code class="wa-inline-code">$1</code>');
        h = h.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" target="_blank" rel="noopener" class="wa-md-link">$1</a>');
        return h;
      }).join('');
    };
    const add = (cls, text) => {
      const welcome = document.getElementById("wa-welcome");
      if (welcome) welcome.remove();
      const d = document.createElement("div");
      d.className = "wa-msg " + cls;
      if (cls === 'agent') { d.innerHTML = md(text); }
      else { d.textContent = text; }
      log.appendChild(d); log.scrollTop = log.scrollHeight;
    };
    let lastUserText = '';
    let lastAgentText = '';
    const showAgent = (text) => {
      if (!text || text === lastAgentText) return;
      lastAgentText = text;
      add("agent", text);
    };
    if (!window.__waSession) {
      window.__waSession = (crypto.randomUUID && crypto.randomUUID()) || ("c" + Date.now());
    }
    const session = window.__waSession;
    if (!window.__waEs) {
      window.__waEs = new EventSource("/live?session=" + encodeURIComponent(session));
    }
    window.__waEs.onmessage = (e) => {
      const ev = JSON.parse(e.data);
      if (ev.t === "say" && ev.from === "human") {
        if (ev.text === lastUserText) return;
      }
      if (ev.t === "say") add(ev.from || "human", ev.text || "");
      if (ev.t === "reply") showAgent(ev.text || "");
    };
    const form = document.getElementById("wa-form");
    const input = document.getElementById("wa-text");
    const chipWrap = document.getElementById("wa-chips");
    const send = async () => {
      const text = input.value.trim();
      if (!text) return;
      lastUserText = text;
      add("human", text);
      input.value = "";
      if (chipWrap) chipWrap.remove();
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, session }),
      });
      const body = await res.json().catch(() => ({}));
      if (body.lastText) showAgent(body.lastText);
    };
    let composing = false;
    input.addEventListener("compositionstart", () => { composing = true; });
    input.addEventListener("compositionend", () => { composing = false; });
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (composing) return;
      await send();
    };
    input.addEventListener("keydown", (e) => {
      if (e.shiftKey || e.isComposing || e.keyCode === 229 || composing) return;
      const enter = e.key === "Enter" || e.key === "Return" || e.code === "Enter" || e.code === "NumpadEnter" || e.keyCode === 13;
      if (!enter) return;
      e.preventDefault();
      send();
    });
    if (chipWrap) {
      chipWrap.querySelectorAll(".wa-chip").forEach(chip => {
        chip.onclick = () => {
          input.value = chip.dataset.q || chip.textContent;
          send();
        };
      });
    }
  };
  const OPEN_ICON = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  const CLOSE_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  const mount = () => {
    if (!document.getElementById("wa-fab")) {
      window.__waBound = false;
      const wrap = document.createElement("div");
      wrap.id = "wa-root";
      wrap.innerHTML = MARKUP;
      document.body.appendChild(wrap);
      const panel = document.getElementById("wa-panel");
      const fab = document.getElementById("wa-fab");
      if (panel && fab) {
        panel.classList.add("open");
        fab.innerHTML = CLOSE_ICON + "<span>Close</span>";
        fab.classList.add("active", "wa-btn-black");
        fab.classList.remove("wa-btn-orange");
        const wrap = document.getElementById("wa-fab-wrap");
        if (wrap) {
          wrap.classList.add("wa-press-black");
          wrap.classList.remove("wa-press-orange");
        }
      }
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
  @keyframes wa-slide-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes wa-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  #wa-root, #wa-root * { box-sizing: border-box; }
  #wa-root {
    --corgi-ink: #191919;
    --corgi-ink-hover: #4a4a4a;
    --corgi-ink-active: #7b7b7b;
    --corgi-muted: #4e4e4e;
    --corgi-dim: #7b7b7b;
    --corgi-orange: #ff5c00;
    --corgi-orange-hover: #ff7d33;
    --corgi-orange-active: #ff9d66;
    --corgi-cream: #FDFBF6;
    --corgi-line: #e1e1e1;
    --corgi-white: #fff;
    font-family: Geist, "f37Bolton", ui-sans-serif, system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    color: var(--corgi-ink);
  }
  #wa-root button {
    font-family: inherit;
    cursor: pointer;
  }
  /* Exact corgi.insure pressable (Duolingo-style raised) buttons */
  #wa-root .wa-press {
    --pressable-depth: 4px;
    display: inline-flex;
    background: #cc4a00;
    padding-bottom: var(--pressable-depth);
    border-radius: 16px;
    corner-shape: superellipse(1.6);
    transition-property: padding, margin;
    transition-duration: 75ms;
    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  #wa-root .wa-press:active {
    margin-top: var(--pressable-depth);
    padding-bottom: 0;
  }
  #wa-root .wa-press-orange { background: #cc4a00; }
  #wa-root .wa-press-black { background: #626262; }
  #wa-root .wa-press-white { background: #e1e1e1; }
  #wa-root .wa-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 100%;
    border: 1px solid transparent;
    border-radius: 16px;
    corner-shape: superellipse(1.6);
    height: 35px; min-width: 96px; padding: 0 16px;
    font-size: 16px; font-weight: 400; line-height: 1.2; letter-spacing: -0.21px;
    white-space: nowrap;
    background: transparent;
    appearance: none; -webkit-appearance: none;
  }
  #wa-root .wa-btn-orange { background: #ff5c00; color: #fff; }
  #wa-root .wa-btn-orange:hover { background: #ff7d33; }
  #wa-root .wa-btn-orange:active { background: #ff9d66; }
  #wa-root .wa-btn-black { background: #191919; color: #fff; }
  #wa-root .wa-btn-black:hover { background: #4a4a4a; }
  #wa-root .wa-btn-black:active { background: #7b7b7b; }
  #wa-root .wa-btn-white {
    background: #fff; color: #191919; border-color: #e1e1e1;
  }
  #wa-root .wa-btn-white:hover { background: #f9f9f9; }
  #wa-root .wa-btn-white:active { background: #ededed; }
  .wa-fab-wrap {
    position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 2147483001;
  }
  .wa-fab {
    gap: .4rem;
    box-shadow: none;
  }
  .wa-fab svg { width: 15px; height: 15px; flex-shrink: 0; }
  .wa-panel {
    position: fixed; right: 1.25rem; bottom: 4.6rem; z-index: 2147483000;
    width: min(42rem, 70vw, calc(100vw - 1.5rem));
    height: min(80vh, calc(100vh - 6.5rem));
    background: var(--corgi-cream);
    color: var(--corgi-ink);
    border: 1px solid var(--corgi-line);
    border-radius: 12px;
    display: none; flex-direction: column; overflow: hidden;
    box-shadow: 0 16px 48px rgba(25,25,25,.10);
  }
  .wa-panel.open { display: flex; animation: wa-slide-up .25s ease both; }
  .wa-hdr {
    display: flex; align-items: center; justify-content: space-between;
    padding: .75rem 1rem;
    border-bottom: 1px solid var(--corgi-line);
    background: var(--corgi-white);
    flex-shrink: 0;
  }
  .wa-hdr-left { display: flex; align-items: center; gap: .55rem; }
  .wa-hdr-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: var(--corgi-white); border: 1px solid var(--corgi-line);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .wa-hdr-icon img { width: 18px; height: 18px; object-fit: contain; }
  .wa-hdr-title { font-size: 16px; font-weight: 400; color: var(--corgi-ink); letter-spacing: -0.21px; }
  .wa-hdr-sub { font-size: 14px; color: #4a4a4a; margin-left: .15rem; letter-spacing: -0.21px; }
  .wa-hdr-actions { display: flex; gap: .25rem; }
  .wa-hdr-btn {
    background: none; border: 0; color: #4a4a4a; cursor: pointer;
    width: 35px; height: 35px; padding: 0; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    transition: color .12s, background .12s;
  }
  .wa-hdr-btn:hover { color: var(--corgi-ink); background: #f9f9f9; }
  .wa-hdr-btn:active { background: #ededed; }
  .wa-hdr-btn svg { width: 16px; height: 16px; }
  .wa-a2a {
    padding: .75rem 1rem;
    border-bottom: 1px solid var(--corgi-line);
    background: var(--corgi-white);
    flex-shrink: 0;
  }
  .wa-a2a-headline {
    font-size: 14px; font-weight: 400; color: var(--corgi-ink); margin: 0 0 .5rem;
    letter-spacing: -0.21px;
  }
  .wa-a2a-headline em { font-style: italic; font-family: georgia, "Times New Roman", serif; color: var(--corgi-orange); }
  .wa-a2a-row { display: flex; align-items: center; gap: .5rem; }
  .wa-a2a-prompt {
    flex: 1; font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: .75rem; color: var(--corgi-muted); background: var(--corgi-cream);
    border: 1px solid var(--corgi-line); border-radius: 10px;
    padding: .45rem .65rem; overflow: hidden; text-overflow: ellipsis;
    white-space: nowrap; user-select: all; cursor: text;
  }
  #wa-log {
    flex: 1; overflow-y: auto; padding: 1.25rem 1rem;
    scroll-behavior: smooth;
    display: flex; flex-direction: column; gap: .75rem;
    background: var(--corgi-cream);
  }
  #wa-log::-webkit-scrollbar { width: 3px; }
  #wa-log::-webkit-scrollbar-track { background: transparent; }
  #wa-log::-webkit-scrollbar-thumb { background: var(--corgi-line); border-radius: 2px; }
  .wa-msg {
    font-size: .9rem; line-height: 1.65; max-width: 92%;
    animation: wa-fade-in .2s ease both;
  }
  .wa-msg.human {
    color: #fff; margin-left: auto;
    background: var(--corgi-ink); padding: .55rem .85rem; border-radius: 10px;
  }
  .wa-msg.agent { color: #1d1d1d; padding: .25rem 0; white-space: normal; }
  .wa-md-h { font-family: georgia, serif; font-size: 1rem; font-weight: 400; color: var(--corgi-ink); margin: .75rem 0 .25rem; }
  .wa-md-h:first-child { margin-top: 0; }
  .wa-md-ul { margin: .25rem 0; padding-left: 1.25rem; list-style: disc; color: var(--corgi-muted); }
  .wa-md-ul li { margin: .1rem 0; line-height: 1.6; color: #1d1d1d; }
  .wa-inline-code {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: .82em; background: #f6f6f6; color: var(--corgi-ink);
    padding: .1rem .35rem; border-radius: 6px;
  }
  .wa-code-wrap {
    position: relative; margin: .5rem 0; border-radius: 10px;
    background: var(--corgi-white); border: 1px solid var(--corgi-line);
    overflow: hidden;
  }
  .wa-code { margin: 0; padding: .6rem .75rem; overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: .8rem; line-height: 1.55; color: #1d1d1d; tab-size: 2;
  }
  .wa-code code { font: inherit; color: inherit; }
  .wa-md-link { color: var(--corgi-orange); text-decoration: underline; text-underline-offset: 2px; }
  .wa-md-link:hover { color: #b84200; }
  .wa-msg.agent strong { color: var(--corgi-ink); }
  .risk-high { color: #cc4a00; font-weight: 700; font-size: .8rem; }
  .risk-med { color: var(--corgi-orange); font-weight: 700; font-size: .8rem; }
  .risk-low { color: #2a7a3a; font-weight: 700; font-size: .8rem; }
  .wa-welcome {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem 1.5rem; text-align: center;
  }
  .wa-welcome-icon {
    width: 48px; height: 48px; margin-bottom: .75rem;
    border-radius: 10px; background: var(--corgi-white);
    border: 1px solid var(--corgi-line);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .wa-welcome-icon img { width: 28px; height: 28px; object-fit: contain; }
  .wa-welcome h4 { font-family: georgia, serif; font-size: 1.15rem; color: var(--corgi-ink); font-weight: 400; margin: 0 0 .35rem; }
  .wa-welcome p {
    font-size: 14px; line-height: 1.55; color: var(--corgi-muted); margin: 0 0 1rem; max-width: 22rem;
  }
  #wa-chips {
    display: flex; flex-wrap: wrap; gap: .5rem; justify-content: center; max-width: 26rem;
  }
  .wa-chip {
    height: 35px; min-width: 0; padding: 0 14px;
    font-size: 14px;
  }
  .wa-input-wrap {
    padding: .75rem; border-top: 1px solid var(--corgi-line); flex-shrink: 0; background: var(--corgi-white);
  }
  .wa-form {
    display: flex; align-items: flex-end; gap: .5rem;
  }
  .wa-input-box {
    flex: 1; display: flex; align-items: center;
    background: var(--corgi-cream); border: 1px solid var(--corgi-line);
    border-radius: 16px; overflow: hidden;
    transition: border-color .12s;
    min-height: 35px;
  }
  .wa-input-box:focus-within { border-color: var(--corgi-ink); }
  .wa-input-box input {
    flex: 1; background: transparent; border: 0; color: var(--corgi-ink);
    padding: .45rem .85rem; outline: none;
    font: inherit; font-size: 16px; line-height: 1.2; letter-spacing: -0.21px;
    min-height: 35px;
  }
  .wa-input-box input::placeholder { color: #9e9e9e; }
  .wa-send-wrap { flex-shrink: 0; }
  #wa-root .wa-send {
    min-width: 35px; width: 35px; height: 35px; padding: 0;
  }
  #wa-root .wa-send svg { width: 14px; height: 14px; }
  .wa-run-id { display: none; }
  @media (max-width: 640px) {
    .wa-panel {
      right: 0; bottom: 0; left: 0; top: 0;
      width: 100%; height: 100%;
      border-radius: 0; border: 0;
    }
    .wa-fab-wrap { right: .75rem; bottom: .75rem; }
  }
</style>
<div class="wa-press wa-press-orange wa-fab-wrap" id="wa-fab-wrap" style="--pressable-depth:4px">
  <button class="wa-fab wa-btn wa-btn-orange" id="wa-fab" type="button" aria-label="Open chat">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <span>Ask Corgi</span>
  </button>
</div>
<div class="wa-panel" id="wa-panel" role="dialog" aria-label="Corgi insurance advisor">
  <div class="wa-hdr">
    <div class="wa-hdr-left">
      <div class="wa-hdr-icon"><img src="/images/corgi logo vector.svg" alt=""/></div>
      <span class="wa-hdr-title">Corgi</span>
      <span class="wa-hdr-sub">Insurance advisor</span>
    </div>
    <div class="wa-hdr-actions">
      <button class="wa-hdr-btn" id="wa-close" type="button" aria-label="Close chat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  </div>
  <div class="wa-a2a">
    <p class="wa-a2a-headline">Let your agent get a <em>short risk pitch</em>:</p>
    <div class="wa-a2a-row">
      <span class="wa-a2a-prompt" id="wa-url">${esc(publicUrl)}</span>
      <div class="wa-press wa-press-orange" style="--pressable-depth:4px">
        <button class="wa-btn wa-btn-orange" type="button" id="wa-copy-prompt">Copy prompt</button>
      </div>
    </div>
  </div>
  <div id="wa-log">
    <div class="wa-welcome" id="wa-welcome">
      <div class="wa-welcome-icon"><img src="/images/corgi logo vector.svg" alt=""/></div>
      <h4>Business insurance, quoted in minutes.</h4>
      <p>Tell me what your startup does. I'll say what's at risk, how often it happens, what it can cost if you are not insured, and how Corgi covers it — then ask for your email so we can send a quote.</p>
      <div id="wa-chips">
        <div class="wa-press wa-press-white" style="--pressable-depth:4px"><button class="wa-btn wa-btn-white wa-chip" data-q="We are a seed-stage SaaS startup building B2B analytics">Seed SaaS startup</button></div>
        <div class="wa-press wa-press-white" style="--pressable-depth:4px"><button class="wa-btn wa-btn-white wa-chip" data-q="We are an AI startup building LLM agents, just raised our seed round">AI / LLM startup</button></div>
        <div class="wa-press wa-press-white" style="--pressable-depth:4px"><button class="wa-btn wa-btn-white wa-chip" data-q="We are a fintech startup processing payments for SMBs">Fintech startup</button></div>
        <div class="wa-press wa-press-white" style="--pressable-depth:4px"><button class="wa-btn wa-btn-white wa-chip" data-q="We are a health-tech startup handling patient data">Health-tech startup</button></div>
        <div class="wa-press wa-press-orange" style="--pressable-depth:4px"><button class="wa-btn wa-btn-orange wa-chip" data-q="What information do I need for a Corgi quote?">How to get a quote</button></div>
      </div>
    </div>
  </div>
  <div class="wa-input-wrap">
    <form class="wa-form" id="wa-form">
      <div class="wa-input-box">
        <input id="wa-text" type="text" placeholder="Tell me about your startup..." autocomplete="off" enterkeyhint="send"/>
      </div>
      <div class="wa-press wa-press-orange wa-send-wrap" style="--pressable-depth:4px">
        <button class="wa-btn wa-btn-orange wa-send" type="submit" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/></svg>
        </button>
      </div>
    </form>
  </div>
  <span class="wa-run-id">${esc(runId)}</span>
</div>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
