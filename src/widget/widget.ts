import { renderCopyPrompt } from "../pack/prompt.ts";
import type { AgentPackConfig } from "../pack/types.ts";
import { renderChatMarkdown } from "./md.ts";

export function packWidget(publicUrl: string, runId: string, config: AgentPackConfig): string {
  const prompt = renderCopyPrompt(config, publicUrl);
  const markup = widgetMarkup(publicUrl, runId, config);
  const fabOpen = config.brand.fabLabel;
  const markdown = config.widget.markdown !== false;
  const typed = config.widget.hints?.length ? config.widget.hints : config.widget.chips;
  const hints = (typed.length ? typed : [config.widget.placeholder || fabOpen]).slice(0, 8);
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
  const PLACEHOLDER = ${JSON.stringify(config.widget.placeholder || "Ask anything…")};
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
    let sending = false;
    let talked = false;
    /* Idle field: type a hint, hold, erase, then the next hint. */
    let hintI = 0;
    let typeTimer = 0;
    const focused = () => !!input && document.activeElement === input;
    const typing = () => !!(hint && HINTS.length && input && !input.value && !focused());
    const paintHint = () => {
      if (!hint) return;
      if (input && input.value) { hint.dataset.on = "0"; return; }
      hint.dataset.on = "1";
      hint.classList.toggle("typing", typing());
      if (!typing()) hint.textContent = PLACEHOLDER;
    };
    const typeHint = () => {
      clearTimeout(typeTimer);
      if (!typing()) { paintHint(); return; }
      const text = HINTS[hintI % HINTS.length];
      hint.classList.add("typing");
      let n = 0;
      const grow = () => {
        if (!typing()) { paintHint(); return; }
        hint.textContent = text.slice(0, ++n);
        typeTimer = setTimeout(n < text.length ? grow : shrink, n < text.length ? 34 + Math.random() * 40 : 1700);
      };
      const shrink = () => {
        if (!typing()) { paintHint(); return; }
        hint.textContent = text.slice(0, --n);
        if (n > 0) typeTimer = setTimeout(shrink, 16);
        else { hintI++; typeTimer = setTimeout(typeHint, 420); }
      };
      grow();
    };
    const startHints = () => { paintHint(); typeHint(); };
    const syncSend = () => {
      const on = !!(input && input.value.trim());
      if (sendBtn) sendBtn.classList.toggle("on", on);
      paintHint();
    };
    const setHints = (on) => { if (root) root.classList.toggle("hints", on && !talked); };
    const setOpen = (open) => {
      if (root) root.classList.toggle("open", open);
      panel.classList.toggle("open", open);
      fab.classList.toggle("open", open);
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) setHints(false);
      paintHint();
    };
    const wake = () => { if (talked) setOpen(true); else setHints(true); };
    const rest = () => {
      setOpen(false);
      setHints(false);
      if (input) input.blur();
      typeHint();
    };
    fab.onclick = (e) => {
      e.preventDefault();
      if (panel.classList.contains("open")) rest();
      else if (input) input.focus();
    };
    const closeBtn = document.getElementById("wa-close");
    if (closeBtn) closeBtn.onclick = rest;
    if (backdrop) backdrop.onclick = rest;
    document.addEventListener("pointerdown", (e) => {
      if (!root || !(panel.classList.contains("open") || root.classList.contains("hints"))) return;
      const t = e.target;
      if (root.contains(t) || (t && t.closest && t.closest("#wa-spot"))) return;
      rest();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && root && (panel.classList.contains("open") || root.classList.contains("hints"))) rest();
    });
    if (form) {
      form.addEventListener("pointerdown", (e) => {
        if (sendBtn && sendBtn.contains(e.target)) return;
        if (input && e.target !== input) { e.preventDefault(); input.focus(); }
      });
    }
    if (input) {
      input.addEventListener("focus", () => { clearTimeout(typeTimer); wake(); paintHint(); });
      input.addEventListener("blur", () => { if (!input.value) typeHint(); });
      input.addEventListener("input", syncSend);
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
    const far = (v) => /^https?:/.test(v.page) && new URL(v.page).origin !== location.origin;
    const pagePath = (v) => (/^https?:/.test(v.page) ? new URL(v.page).pathname : v.page);
    const liveFor = (v) => {
      if (far(v) || path(location.pathname) !== path(pagePath(v))) return null;
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
      } else if (far(v)) {
        const go = node("a", "wa-vgo");
        go.href = v.page;
        go.target = "_blank";
        go.rel = "noopener";
        go.innerHTML = "Open page <span aria-hidden=\\"true\\">↗</span>";
        cap.appendChild(go);
      } else if (path(location.pathname) !== path(pagePath(v))) {
        const go = node("a", "wa-vgo");
        go.href = pagePath(v) + "#wa-show=" + encodeURIComponent(v.id);
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
      card.classList.add("reveal");
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
        const h = node("div", "wa-ask");
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
      openCard.innerHTML = '<div class="wa-status" role="status" aria-label="' + esc(BRAND) + ' is thinking"><span></span><span></span><span></span></div>';
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
      if (turn && log) log.scrollTop += turn.getBoundingClientRect().top - log.getBoundingClientRect().top - 26;
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
      talked = true;
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
  const chipList = w.chips.slice(0, 3);
  const chips = chipList
    .map((q) => `<button class="wa-chip" type="button" data-q="${esc(q)}">${esc(q)}</button>`)
    .join("");
  const firstHint = chipList[0] || w.placeholder || b.fabLabel;
  const arrow = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12h12M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const chevron = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const mark = b.logo
    ? `<img class="wa-logo" src="${esc(b.logo)}" alt="" aria-hidden="true"/>`
    : `<span class="wa-mark" aria-hidden="true"><span class="wa-orb"></span></span>`;
  const glass = c.glass || `color-mix(in srgb, ${c.paper} 88%, transparent)`;
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
    --wa-glass: ${glass};
    --wa-on: var(--wa-ink);
    --wa-soft: var(--wa-muted);
    --wa-tint: color-mix(in srgb, var(--wa-ink) 6%, transparent);
    --wa-edge: var(--wa-line);
    --wa-ease: cubic-bezier(.2, .9, .2, 1);
  }
  #wa-spot { --wa-spot: ${c.accent}; }
  #wa-root, #wa-root *, #wa-fab, #wa-panel, #wa-panel * { box-sizing: border-box; }
  #wa-backdrop { display: none; }
  #wa-stage {
    position: fixed; left: 50%; bottom: 24px; z-index: 99999;
    width: min(680px, calc(100vw - 24px));
    transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    pointer-events: none;
    font-family: ${body};
    -webkit-font-smoothing: antialiased;
  }
  #wa-panel {
    width: 100%;
    height: min(500px, calc(100vh - 140px));
    border-radius: 24px;
    background: var(--wa-glass);
    -webkit-backdrop-filter: blur(22px) saturate(1.4);
            backdrop-filter: blur(22px) saturate(1.4);
    border: 1px solid color-mix(in srgb, var(--wa-line) 80%, transparent);
    box-shadow: 0 24px 64px rgba(0,0,0,.14), 0 2px 8px rgba(0,0,0,.05), inset 0 1px 0 rgba(255,255,255,.6);
    color: var(--wa-on);
    font-size: 15px; line-height: 1.55; letter-spacing: -0.01em;
    overflow: hidden;
    transform-origin: 50% 100%;
    opacity: 0; visibility: hidden; pointer-events: none;
    transform: translateY(28px) scale(.92);
    filter: blur(10px);
    transition:
      opacity .22s ease,
      transform .42s var(--wa-ease),
      filter .32s ease,
      visibility 0s linear .42s;
  }
  #wa-panel.open {
    opacity: 1; visibility: visible; pointer-events: auto;
    transform: none; filter: none;
    transition: opacity .26s ease, transform .5s var(--wa-ease), filter .36s ease, visibility 0s;
  }
  .wa-panel-inner { height: 100%; display: flex; flex-direction: column; min-height: 0; }
  .wa-hdr {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 14px 4px 16px; flex-shrink: 0;
  }
  .wa-brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
  .wa-mark {
    width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
    background: var(--wa-ink);
    display: grid; place-items: center;
  }
  .wa-logo { width: 24px; height: 24px; object-fit: contain; flex-shrink: 0; }
  .wa-orb {
    width: 8px; height: 8px; border-radius: 999px;
    background: var(--wa-paper);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--wa-paper) 22%, transparent);
  }
  .wa-wordmark {
    font-family: ${display};
    font-size: 14.5px; font-weight: 600; letter-spacing: -0.02em;
    color: var(--wa-on);
  }
  .wa-hdr-actions { display: flex; align-items: center; gap: 2px; }
  #wa-close {
    width: 30px; height: 30px; border-radius: 999px;
    border: 0; background: transparent; color: var(--wa-soft);
    cursor: pointer; display: grid; place-items: center; padding: 0;
  }
  #wa-close:hover, #wa-copy-prompt:hover { color: var(--wa-on); background: var(--wa-tint); }
  #wa-url { display: none; }
  #wa-copy-prompt {
    border: 0; background: transparent; cursor: pointer;
    color: var(--wa-soft);
    padding: 6px 10px; border-radius: 999px;
    font: 500 12px/1 ${body}; letter-spacing: -0.01em; white-space: nowrap;
  }
  #wa-log {
    flex: 1; min-height: 0; overflow: auto;
    padding: 18px 20px 20px;
    overscroll-behavior: contain; scroll-behavior: smooth;
    scrollbar-width: thin; scrollbar-color: color-mix(in srgb, var(--wa-ink) 22%, transparent) transparent;
    -webkit-mask-image: linear-gradient(transparent 0, #000 22px, #000 calc(100% - 12px), transparent 100%);
            mask-image: linear-gradient(transparent 0, #000 22px, #000 calc(100% - 12px), transparent 100%);
  }
  .wa-turn { margin: 0 0 22px; }
  .wa-ask {
    display: block; width: fit-content; max-width: 82%;
    margin: 0 0 14px auto; padding: 9px 16px;
    border-radius: 20px;
    background: var(--wa-ink);
    color: var(--wa-paper);
    font-size: 15px; line-height: 1.45; font-weight: 500;
    overflow-wrap: anywhere; white-space: pre-wrap;
    animation: wa-pop .38s var(--wa-ease) both;
  }
  @keyframes wa-pop {
    from { opacity: 0; transform: translateY(10px) scale(.96); }
    to { opacity: 1; transform: none; }
  }
  .wa-card { color: var(--wa-on); overflow-wrap: anywhere; }
  .wa-card.reveal > * { animation: wa-reveal .62s var(--wa-ease) both; }
  .wa-card.reveal > :nth-child(2) { animation-delay: .08s; }
  .wa-card.reveal > :nth-child(3) { animation-delay: .16s; }
  .wa-card.reveal > :nth-child(n+4) { animation-delay: .22s; }
  @keyframes wa-reveal {
    from { opacity: 0; filter: blur(6px); transform: translateY(6px); }
    to { opacity: 1; filter: none; transform: none; }
  }
  .wa-lead { font-size: 16px; line-height: 1.55; letter-spacing: -0.015em; font-weight: 500; }
  .wa-lead p { margin: 0 0 .5em; }
  .wa-lead p:last-child { margin-bottom: 0; }
  .wa-body {
    margin-top: 10px;
    font-size: 14.5px; line-height: 1.6;
    color: color-mix(in srgb, var(--wa-ink) 84%, var(--wa-paper));
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
    font: 600 13px/1 ${body}; color: var(--wa-on);
  }
  .wa-more:hover { text-decoration: underline; text-underline-offset: 3px; }
  .wa-card strong { font-weight: 650; color: var(--wa-on); }
  .wa-card em { font-style: italic; }
  .wa-body .wa-md-ul { list-style: none; padding-left: 0; }
  .wa-body .wa-md-ul li { position: relative; padding-left: 18px; margin: .45em 0; }
  .wa-body .wa-md-ul li::before {
    content: ""; position: absolute; left: 4px; top: .68em;
    width: 5px; height: 5px; border-radius: 999px; background: var(--wa-soft);
  }
  .wa-body .wa-md-ol { list-style: none; padding-left: 0; counter-reset: wa-step; }
  .wa-body .wa-md-ol li { position: relative; padding-left: 32px; margin: .6em 0; counter-increment: wa-step; }
  .wa-body .wa-md-ol li::before {
    content: counter(wa-step); position: absolute; left: 0; top: .1em;
    width: 22px; height: 22px; border-radius: 999px;
    display: grid; place-items: center;
    background: var(--wa-tint); border: 1px solid var(--wa-edge);
    font: 600 11.5px/1 ${body}; color: var(--wa-on);
  }
  .wa-status {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 12px 15px; border-radius: 999px;
    background: var(--wa-tint);
    animation: wa-pop .32s var(--wa-ease) both;
  }
  .wa-status span {
    width: 5px; height: 5px; border-radius: 999px; background: var(--wa-ink);
    animation: wa-dot 1.1s ease-in-out infinite;
  }
  .wa-status span:nth-child(2) { animation-delay: .15s; }
  .wa-status span:nth-child(3) { animation-delay: .3s; }
  @keyframes wa-dot {
    0%, 80%, 100% { opacity: .3; transform: translateY(0); }
    40% { opacity: 1; transform: translateY(-2px); }
  }
  .wa-visual { margin: 14px 0 4px; }
  .wa-frame {
    position: relative; overflow: hidden; cursor: zoom-in;
    border: 1px solid var(--wa-edge); border-radius: 16px;
    background: #fff;
    box-shadow: 0 6px 18px rgba(0,0,0,.06);
  }
  .wa-frame img { display: block; width: 100%; height: auto; max-height: 360px; object-fit: cover; object-position: top center; }
  .wa-frame.cut::after {
    content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 56px;
    background: linear-gradient(transparent, color-mix(in srgb, var(--wa-paper) 94%, transparent));
    pointer-events: none;
  }
  .wa-frame.full { cursor: zoom-out; height: auto !important; }
  .wa-frame.full img { max-height: none; }
  .wa-frame.full::after { display: none; }
  .wa-live-inner { transform-origin: 0 0; pointer-events: none; }
  .wa-live-tag {
    position: relative; flex-shrink: 0;
    padding: 2px 8px 2px 18px; border-radius: 999px;
    background: var(--wa-tint); border: 1px solid var(--wa-edge);
    font: 600 10.5px/1.4 ${body}; letter-spacing: .02em; color: var(--wa-on);
  }
  .wa-live-tag::before {
    content: ""; position: absolute; left: 7px; top: 50%; margin-top: -3px;
    width: 6px; height: 6px; border-radius: 999px; background: #16a34a;
  }
  .wa-visual figcaption {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 8px 2px 0;
    font-size: 12.5px; line-height: 1.4; color: var(--wa-soft);
  }
  .wa-vlabel { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .wa-vgo {
    flex-shrink: 0; border: 1px solid var(--wa-edge); border-radius: 999px;
    background: var(--wa-tint); color: var(--wa-on); cursor: pointer;
    padding: 6px 12px; text-decoration: none;
    font: 600 12.5px/1 ${body}; letter-spacing: -0.01em;
    transition: background .16s ease, transform .16s ease;
  }
  .wa-vgo:hover { background: color-mix(in srgb, var(--wa-ink) 11%, transparent); transform: translateY(-1px); }
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
    font-size: 16px; font-weight: 600; letter-spacing: -0.02em;
    margin: .7em 0 .3em; line-height: 1.3; color: var(--wa-on);
  }
  .wa-md-h:first-child { margin-top: 0; }
  .wa-md-ul, .wa-md-ol { margin: .2em 0 .7em; padding-left: 1.2em; }
  .wa-md-ul { list-style: disc; }
  .wa-md-ol { list-style: decimal; }
  .wa-md-ul li, .wa-md-ol li { margin: .2em 0; }
  .wa-md-link { color: var(--wa-on); font-weight: 600; text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--wa-ink) 35%, transparent); text-underline-offset: 3px; }
  .wa-md-link:hover { text-decoration-color: var(--wa-on); }
  .wa-inline-code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: .84em; background: var(--wa-tint); color: var(--wa-on);
    padding: .1em .38em; border-radius: 5px;
  }
  .wa-code-wrap { margin: .5em 0; border-radius: 12px; background: var(--wa-ink); color: var(--wa-paper); overflow: hidden; }
  .wa-code-lang {
    font-family: ui-monospace, Menlo, monospace;
    font-size: 10px; letter-spacing: .04em; text-transform: uppercase;
    color: color-mix(in srgb, var(--wa-paper) 60%, transparent); padding: 6px 12px; border-bottom: 1px solid color-mix(in srgb, var(--wa-paper) 16%, transparent);
  }
  .wa-code {
    margin: 0; padding: 10px 12px; overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px; line-height: 1.5; color: var(--wa-paper);
  }
  .wa-code code { font: inherit; color: inherit; }
  .wa-welcome { padding: 4px 0 8px; }
  #wa-panel.open .wa-welcome > * { animation: wa-reveal .6s var(--wa-ease) both; }
  #wa-panel.open .wa-welcome > :nth-child(2) { animation-delay: .07s; }
  #wa-panel.open .wa-welcome > :nth-child(3) { animation-delay: .14s; }
  .wa-welcome h4 {
    margin: 0 0 6px;
    font-family: ${display};
    font-size: 22px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.2;
    color: var(--wa-on);
  }
  .wa-welcome p { margin: 0; max-width: 32em; color: var(--wa-soft); font-size: 15px; line-height: 1.5; }
  #wa-chips {
    display: none; width: 100%;
    flex-direction: column; align-items: flex-start; gap: 8px;
    padding: 0 4px;
  }
  #wa-root.hints #wa-chips { display: flex; }
  .wa-chip {
    border: 0; border-radius: 999px; cursor: pointer;
    background: color-mix(in srgb, var(--wa-ink) 48%, transparent);
    -webkit-backdrop-filter: blur(14px) saturate(1.3);
            backdrop-filter: blur(14px) saturate(1.3);
    color: var(--wa-paper);
    padding: 10px 18px; text-align: left; max-width: 100%;
    font: 600 14px/1.35 ${body}; letter-spacing: -0.01em;
    box-shadow: 0 6px 18px rgba(0,0,0,.1);
    pointer-events: auto;
    transition: background .18s ease, transform .18s ease;
  }
  .wa-chip:hover { background: color-mix(in srgb, var(--wa-ink) 72%, transparent); transform: translateY(-1px); }
  #wa-root.hints .wa-chip { animation: wa-rise .46s var(--wa-ease) both; }
  #wa-root.hints .wa-chip:nth-last-child(2) { animation-delay: .05s; }
  #wa-root.hints .wa-chip:nth-last-child(3) { animation-delay: .1s; }
  #wa-root.hints .wa-chip:nth-last-child(4) { animation-delay: .15s; }
  @keyframes wa-rise {
    from { opacity: 0; transform: translateY(14px) scale(.96); filter: blur(4px); }
    to { opacity: 1; transform: none; filter: none; }
  }
  .wa-form {
    width: min(360px, 100%);
    display: flex; gap: 6px; align-items: center;
    padding: 5px 5px 5px 18px;
    border-radius: 999px;
    background: var(--wa-paper);
    box-shadow: 0 10px 30px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.05);
    pointer-events: auto;
    transition: width .5s var(--wa-ease), box-shadow .3s ease;
  }
  #wa-root.open .wa-form, .wa-form:focus-within { width: 100%; }
  .wa-form:focus-within { box-shadow: 0 12px 34px rgba(0,0,0,.14), 0 0 0 1px rgba(0,0,0,.08); }
  #wa-fab { display: none; }
  #wa-fab .wa-fab-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
  .wa-field { position: relative; flex: 1; min-width: 0; }
  #wa-text {
    width: 100%; border: 0; border-radius: 0;
    padding: 10px 0; background: transparent; color: var(--wa-ink);
    outline: none;
    font: 400 15px/1.3 ${body}; letter-spacing: -0.01em;
  }
  #wa-text::placeholder { color: transparent; }
  #wa-hint {
    position: absolute; left: 0; right: 0; top: 50%;
    transform: translateY(-50%);
    color: var(--wa-muted);
    font-size: 15px; letter-spacing: -0.01em; line-height: 1.3;
    pointer-events: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    opacity: 0;
    transition: opacity .26s ease, transform .3s var(--wa-ease);
  }
  #wa-hint[data-on="1"] { opacity: 1; }
  #wa-hint.typing::after {
    content: ""; display: inline-block; width: 1.5px; height: 1.05em;
    margin-left: 2px; vertical-align: -0.16em;
    background: currentColor;
    animation: wa-blink 1s steps(1) infinite;
  }
  @keyframes wa-blink { 50% { opacity: 0; } }
  .wa-send {
    appearance: none; -webkit-appearance: none;
    width: 34px; height: 34px; border: 0; border-radius: 999px; cursor: pointer;
    background: var(--wa-wash); color: var(--wa-muted);
    display: grid; place-items: center; flex-shrink: 0; padding: 0;
    transition: background .2s ease, color .2s ease, transform .18s ease, opacity .2s ease;
  }
  .wa-send svg { transform: rotate(-90deg); }
  .wa-send.on { background: ${c.fab}; color: ${c.fabText}; }
  .wa-send:hover { transform: translateY(-1px); }
  .wa-send.busy { opacity: .55; pointer-events: none; }
  .wa-run-id { display: none; }
  @media (max-width: 640px) {
    #wa-stage { bottom: 12px; width: calc(100vw - 16px); gap: 8px; }
    #wa-panel { height: min(560px, calc(100vh - 110px)); border-radius: 22px; }
    #wa-log { padding: 16px 16px 18px; }
    .wa-lead { font-size: 15.5px; }
  }
  @media (prefers-reduced-motion: reduce) {
    #wa-panel, .wa-form, #wa-hint, #wa-hint::after, .wa-chip, .wa-ask, .wa-card.reveal > *, .wa-welcome > *, .wa-status, .wa-status span, #wa-spot {
      animation: none !important; transition: none !important; filter: none !important;
    }
  }
</style>
<div id="wa-root">
  <button id="wa-backdrop" type="button" aria-hidden="true" aria-label="Close"></button>
  <div id="wa-stage">
    <div id="wa-panel" role="dialog" aria-label="${esc(b.name)} agent" aria-hidden="true">
      <div class="wa-panel-inner">
        <div class="wa-hdr">
          <div class="wa-brand">${mark}<strong class="wa-wordmark">${esc(b.wordmark || b.name)}</strong></div>
          <div class="wa-hdr-actions">
            <button type="button" id="wa-copy-prompt">Copy prompt</button>
            <button id="wa-close" type="button" aria-label="Minimize">${chevron}</button>
          </div>
        </div>
        <span id="wa-url">${esc(publicUrl)}</span>
        <div id="wa-log">
          <div class="wa-welcome" id="wa-welcome">
            <h4>${esc(w.welcomeTitle)}</h4>
            <p>${esc(w.welcomeBody)}</p>
          </div>
        </div>
      </div>
    </div>
    <div id="wa-chips" role="list">${chips}</div>
    <form class="wa-form" id="wa-form">
      <button id="wa-fab" type="button" aria-expanded="false" aria-label="${esc(b.fabLabel)}"><span class="wa-fab-label">${esc(b.fabLabel)}</span></button>
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
