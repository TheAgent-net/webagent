import { renderCopyPrompt } from "../pack/prompt.ts";
import type { AgentPackConfig } from "../pack/types.ts";
import { renderChatMarkdown } from "./md.ts";

export function packWidget(publicUrl: string, runId: string, config: AgentPackConfig): string {
  const prompt = renderCopyPrompt(config, publicUrl);
  const markup = widgetMarkup(publicUrl, runId, config);
  const fabOpen = config.brand.fabLabel;
  const markdown = config.widget.markdown !== false;
  const hints = (config.widget.chips.length ? config.widget.chips : [config.widget.placeholder || fabOpen]).slice(0, 4);
  const base = publicUrl.replace(/\/+$/, "");
  const visuals = Object.fromEntries(
    (config.visuals ?? []).map((v) => [
      v.id,
      { id: v.id, kind: v.kind, label: v.label, page: v.page, selector: v.selector, image: base + "/" + v.image },
    ]),
  );
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
  const VISUALS = ${JSON.stringify(visuals)};
  const BRAND = ${JSON.stringify(config.brand.wordmark || config.brand.name)};
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
    const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const node = (tag, cls) => { const d = document.createElement(tag); if (cls) d.className = cls; return d; };
    const rich = (t) => (md ? md(t) : "<p>" + esc(t).replace(/\\n/g, "<br>") + "</p>");
    const keep = () => { if (log) log.scrollTop = log.scrollHeight; };
    const path = (p) => (p || "/").replace(/\\/+$/, "") || "/";
    const liveFor = (v) => {
      if (path(location.pathname) !== path(v.page)) return null;
      try {
        const el = document.querySelector(v.selector);
        if (!el || el.closest("#wa-root")) return null;
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) return null;
        if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return null;
        return el;
      } catch { return null; }
    };
    let spotTimer = 0;
    const spot = (el, label) => {
      setOpen(false);
      if (input) input.blur();
      const tall = el.getBoundingClientRect().height > window.innerHeight * 0.8;
      el.scrollIntoView({ behavior: "smooth", block: tall ? "start" : "center" });
      let ring = document.getElementById("wa-spot");
      if (!ring) {
        ring = node("div");
        ring.id = "wa-spot";
        ring.innerHTML = '<span class="wa-spot-tag"></span>';
        document.body.appendChild(ring);
      }
      ring.firstChild.textContent = label;
      ring.classList.add("on");
      const track = () => {
        const r = el.getBoundingClientRect();
        ring.style.top = r.top - 8 + "px";
        ring.style.left = r.left - 8 + "px";
        ring.style.width = r.width + 16 + "px";
        ring.style.height = r.height + 16 + "px";
        ring.classList.toggle("low", r.top < 48);
        if (ring.classList.contains("on")) requestAnimationFrame(track);
      };
      track();
      const off = () => { ring.classList.remove("on"); document.removeEventListener("pointerdown", off, true); };
      clearTimeout(spotTimer);
      spotTimer = setTimeout(off, 5200);
      setTimeout(() => document.addEventListener("pointerdown", off, true), 400);
    };
    const liveCopy = (el, frame) => {
      if (el.querySelector("canvas, video, iframe")) return false;
      const width = Math.max(el.getBoundingClientRect().width, el.scrollWidth);
      const from = [el, ...el.querySelectorAll("*")];
      if (from.length > 2500) return false;
      const copy = el.cloneNode(true);
      const to = [copy, ...copy.querySelectorAll("*")];
      for (let i = 0; i < from.length && i < to.length; i++) {
        const cs = getComputedStyle(from[i]);
        if (cs.overflowX !== "visible" && from[i].scrollWidth > from[i].clientWidth + 4) return false;
        let css = "";
        for (let j = 0; j < cs.length; j++) css += cs[j] + ":" + cs.getPropertyValue(cs[j]) + ";";
        to[i].setAttribute("style", css + "transition:none;animation:none;");
        to[i].removeAttribute("id");
      }
      copy.style.margin = "0";
      copy.setAttribute("aria-hidden", "true");
      copy.querySelectorAll("a, button, input, select, textarea").forEach((c) => c.setAttribute("tabindex", "-1"));
      const inner = node("div", "wa-live-inner");
      const bodyStyle = getComputedStyle(document.body);
      const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
      const clear = (c) => !c || c === "transparent" || c === "rgba(0, 0, 0, 0)";
      inner.style.width = width + "px";
      inner.style.fontFamily = bodyStyle.fontFamily;
      inner.style.fontSize = bodyStyle.fontSize;
      inner.style.lineHeight = bodyStyle.lineHeight;
      inner.style.letterSpacing = bodyStyle.letterSpacing;
      inner.style.color = bodyStyle.color;
      inner.style.background = !clear(bodyStyle.backgroundColor) ? bodyStyle.backgroundColor : !clear(htmlBg) ? htmlBg : "#fff";
      inner.appendChild(copy);
      frame.appendChild(inner);
      const fit = () => {
        const scale = Math.min(1, frame.clientWidth / width);
        inner.style.transform = "scale(" + scale + ")";
        const tall = inner.offsetHeight * scale;
        frame.style.height = Math.min(tall, 360) + "px";
        frame.classList.toggle("cut", tall > 360);
      };
      requestAnimationFrame(fit);
      setTimeout(fit, 400);
      return true;
    };
    const visualNode = (v) => {
      const fig = node("figure", "wa-visual");
      const frame = node("div", "wa-frame");
      const live = liveFor(v);
      const isLive = !!live && v.kind !== "image" && liveCopy(live, frame);
      if (!isLive) {
        const img = node("img");
        img.src = v.image;
        img.alt = v.label;
        img.loading = "lazy";
        img.onload = () => { frame.classList.toggle("cut", img.offsetHeight >= 359); keep(); };
        frame.appendChild(img);
      }
      frame.onclick = () => frame.classList.toggle("full");
      const cap = node("figcaption");
      cap.innerHTML = (isLive ? '<span class="wa-live-tag">Live</span>' : "") + '<span class="wa-vlabel">' + esc(v.label) + "</span>";
      if (live) {
        const go = node("button", "wa-vgo");
        go.type = "button";
        go.innerHTML = "Show on page <span aria-hidden=\\"true\\">→</span>";
        go.onclick = () => spot(live, v.label);
        cap.appendChild(go);
      } else if (path(location.pathname) !== path(v.page)) {
        const go = node("a", "wa-vgo");
        go.href = v.page + "#wa-show=" + encodeURIComponent(v.id);
        go.innerHTML = "Open on site <span aria-hidden=\\"true\\">↗</span>";
        cap.appendChild(go);
      }
      fig.appendChild(frame);
      fig.appendChild(cap);
      return fig;
    };
    const SHOW = /\\[\\[show:([a-z0-9-]+)\\]\\]/gi;
    const fillCard = (card, raw) => {
      let shown = null;
      const text = String(raw || "")
        .replace(SHOW, (_m, id) => { if (!shown && VISUALS[id]) shown = VISUALS[id]; return ""; })
        .replace(/\\n{3,}/g, "\\n\\n")
        .trim();
      const parts = text.split(/\\n[ \\t]*\\n/);
      const first = parts[0] || "";
      const plain = first && !/^(#|[-*] |\\d+\\. )/.test(first) && !/\\x60\\x60\\x60/.test(first);
      const lead = plain ? first : "";
      const rest = plain ? parts.slice(1).join("\\n\\n").trim() : text;
      card.innerHTML = "";
      card.classList.remove("wait");
      if (lead) {
        const d = node("div", "wa-lead");
        d.innerHTML = rich(lead);
        card.appendChild(d);
      }
      if (shown) card.appendChild(visualNode(shown));
      if (rest) {
        const body = node("div", "wa-body");
        body.innerHTML = rich(rest);
        card.appendChild(body);
        requestAnimationFrame(() => {
          if (body.scrollHeight <= 300) return;
          body.classList.add("folded");
          const more = node("button", "wa-more");
          more.type = "button";
          more.textContent = "Show more";
          more.onclick = () => {
            const open = body.classList.toggle("folded");
            more.textContent = open ? "Show more" : "Show less";
          };
          card.appendChild(more);
        });
      }
      card.querySelectorAll("a.wa-md-link").forEach((a) => {
        try {
          const u = new URL(a.href);
          if (u.origin === location.origin) a.removeAttribute("target");
        } catch {}
      });
    };
    let openCard = null;
    const startTurn = (ask) => {
      const welcome = document.getElementById("wa-welcome");
      if (welcome) welcome.remove();
      const turn = node("section", "wa-turn in");
      if (ask) {
        const h = node("h3", "wa-ask");
        h.textContent = ask;
        turn.appendChild(h);
      }
      const card = node("article", "wa-card");
      turn.appendChild(card);
      if (log) log.appendChild(turn);
      return card;
    };
    const thinkOn = () => {
      if (!openCard) return;
      openCard.classList.add("wait");
      openCard.innerHTML = '<div class="wa-status"><span class="wa-spark" aria-hidden="true"></span><span class="wa-status-text">Looking through ' + esc(BRAND) + "</span></div>";
      keep();
    };
    const thinkOff = () => {
      if (openCard && openCard.classList.contains("wait")) {
        openCard.classList.remove("wait");
        openCard.innerHTML = '<div class="wa-lead"><p>Something went wrong. Please try again.</p></div>';
      }
      openCard = null;
    };
    const add = (cls, text) => {
      if (!log) return;
      if (cls === "human") {
        openCard = startTurn(text);
        keep();
        return;
      }
      const card = openCard || startTurn("");
      openCard = null;
      fillCard(card, text);
      const turn = card.parentElement;
      if (turn && log) log.scrollTop = Math.max(0, turn.offsetTop - 8);
    };
    const showHash = () => {
      const m = location.hash.match(/^#wa-show=([\\w-]+)/);
      const v = m && VISUALS[decodeURIComponent(m[1])];
      if (!v) return;
      const el = liveFor(v);
      if (el) setTimeout(() => spot(el, v.label), 500);
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
    showHash();
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
  #wa-spot { --wa-spot: ${c.accent}; }
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
    max-height: min(760px, calc(100vh - 48px));
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
    width: min(620px, calc(100vw - 32px));
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
  #wa-log { flex: 1; overflow: auto; padding: 4px 22px 12px; background: transparent; min-height: 0; overscroll-behavior: contain; scroll-behavior: smooth; }
  .wa-turn { padding: 18px 0 20px; border-top: 1px solid var(--wa-line); }
  .wa-turn:first-child { border-top: 0; padding-top: 6px; }
  .wa-turn.in { animation: wa-in .38s cubic-bezier(.16,1,.3,1); }
  @keyframes wa-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: none; }
  }
  .wa-ask {
    margin: 0 0 12px;
    font-family: ${display};
    font-size: 19px; font-weight: 600; line-height: 1.3; letter-spacing: -0.035em;
    color: var(--wa-ink);
    overflow-wrap: anywhere;
  }
  .wa-card { color: var(--wa-ink); overflow-wrap: anywhere; }
  .wa-lead { font-size: 16.5px; line-height: 1.5; letter-spacing: -0.02em; font-weight: 450; color: var(--wa-ink); }
  .wa-lead p { margin: 0 0 .5em; }
  .wa-lead p:last-child { margin-bottom: 0; }
  .wa-body {
    margin-top: 12px;
    font-size: 14.5px; line-height: 1.6; letter-spacing: -0.01em;
    color: color-mix(in srgb, var(--wa-ink) 82%, var(--wa-paper));
    position: relative;
  }
  .wa-body.folded {
    max-height: 220px; overflow: hidden;
    -webkit-mask-image: linear-gradient(#000 60%, transparent);
            mask-image: linear-gradient(#000 60%, transparent);
  }
  .wa-body p { margin: 0 0 .7em; }
  .wa-body p:last-child { margin-bottom: 0; }
  .wa-more {
    margin-top: 6px; border: 0; background: none; padding: 4px 0; cursor: pointer;
    font: 600 13px/1 ${body}; color: var(--wa-ink); letter-spacing: -0.01em;
  }
  .wa-more:hover { text-decoration: underline; text-underline-offset: 3px; }
  .wa-card strong { font-weight: 600; color: var(--wa-ink); }
  .wa-card em { font-style: italic; }
  .wa-body .wa-md-ul { list-style: none; padding-left: 0; }
  .wa-body .wa-md-ul li { position: relative; padding-left: 18px; margin: .45em 0; }
  .wa-body .wa-md-ul li::before {
    content: ""; position: absolute; left: 4px; top: .68em;
    width: 5px; height: 5px; border-radius: 999px; background: var(--wa-accent);
  }
  .wa-body .wa-md-ol { list-style: none; padding-left: 0; counter-reset: wa-step; }
  .wa-body .wa-md-ol li { position: relative; padding-left: 32px; margin: .6em 0; counter-increment: wa-step; }
  .wa-body .wa-md-ol li::before {
    content: counter(wa-step); position: absolute; left: 0; top: .1em;
    width: 22px; height: 22px; border-radius: 999px;
    display: grid; place-items: center;
    background: var(--wa-wash); border: 1px solid var(--wa-line);
    font: 600 11.5px/1 ${body}; color: var(--wa-ink);
  }
  .wa-status { display: flex; align-items: center; gap: 10px; padding: 4px 0; }
  .wa-spark {
    width: 14px; height: 14px; border-radius: 999px; flex-shrink: 0;
    border: 2px solid var(--wa-line); border-top-color: var(--wa-accent);
    animation: wa-spin .8s linear infinite;
  }
  @keyframes wa-spin { to { transform: rotate(360deg); } }
  .wa-status-text {
    font-size: 14.5px; font-weight: 500; letter-spacing: -0.015em;
    background: linear-gradient(90deg, var(--wa-muted) 0%, var(--wa-muted) 35%, var(--wa-ink) 50%, var(--wa-muted) 65%, var(--wa-muted) 100%);
    background-size: 220% 100%;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: wa-shine 1.8s linear infinite;
  }
  @keyframes wa-shine { from { background-position: 100% 0; } to { background-position: -120% 0; } }
  .wa-visual { margin: 14px 0 4px; }
  .wa-frame {
    position: relative; overflow: hidden; cursor: zoom-in;
    border: 1px solid var(--wa-line); border-radius: 14px;
    background: var(--wa-wash);
  }
  .wa-frame img { display: block; width: 100%; height: auto; max-height: 360px; object-fit: cover; object-position: top center; }
  .wa-frame.cut::after {
    content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 56px;
    background: linear-gradient(transparent, color-mix(in srgb, var(--wa-paper) 92%, transparent));
    pointer-events: none;
  }
  .wa-frame.full { cursor: zoom-out; height: auto !important; }
  .wa-frame.full img { max-height: none; }
  .wa-frame.full::after { display: none; }
  .wa-live-inner { transform-origin: 0 0; pointer-events: none; }
  .wa-live-tag {
    position: relative; flex-shrink: 0;
    padding: 2px 8px 2px 18px; border-radius: 999px;
    background: var(--wa-wash); border: 1px solid var(--wa-line);
    font: 600 10.5px/1.4 ${body}; letter-spacing: .02em; color: var(--wa-ink);
  }
  .wa-live-tag::before {
    content: ""; position: absolute; left: 7px; top: 50%; margin-top: -3px;
    width: 6px; height: 6px; border-radius: 999px; background: #16a34a;
  }
  .wa-visual figcaption {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 8px 2px 0;
    font-size: 12.5px; line-height: 1.4; color: var(--wa-muted);
  }
  .wa-vlabel { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .wa-vgo {
    flex-shrink: 0; border: 1px solid var(--wa-line); border-radius: 999px;
    background: var(--wa-paper); color: var(--wa-ink); cursor: pointer;
    padding: 6px 12px; text-decoration: none;
    font: 600 12.5px/1 ${body}; letter-spacing: -0.01em;
    transition: background .16s ease, transform .16s ease;
  }
  .wa-vgo:hover { background: var(--wa-wash); transform: translateY(-1px); }
  #wa-spot {
    position: fixed; z-index: 99997; pointer-events: none;
    border-radius: 14px;
    box-shadow: 0 0 0 2px var(--wa-spot, #0a0a0a), 0 0 0 9999px rgba(10,10,10,.42);
    opacity: 0; transition: opacity .35s ease;
  }
  #wa-spot.on { opacity: 1; }
  #wa-spot.low .wa-spot-tag { top: 14px; left: auto; right: 14px; }
  .wa-spot-tag {
    position: absolute; left: 8px; top: -34px;
    max-width: min(420px, 80vw); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    padding: 6px 12px; border-radius: 999px;
    background: var(--wa-spot, #0a0a0a); color: #fff;
    font: 600 12.5px/1.2 ${body}; letter-spacing: -0.01em;
  }
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
    .wa-ask { font-size: 17px; }
    .wa-lead { font-size: 16px; }
    #wa-panel.open .wa-panel-inner { min-height: min(360px, calc(100vh - 160px)); }
  }
  @media (prefers-reduced-motion: reduce) {
    #wa-stage, #wa-panel, #wa-backdrop, #wa-hint, .wa-hdr, .wa-welcome, .wa-turn.in, #wa-fab .wa-orb, .wa-spark, .wa-status-text, #wa-spot {
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
