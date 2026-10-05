/**
 * Page: HTML shell, styles, and small parts for the admin pages.
 * Escape every value with `esc` before you put it in HTML.
 */
import type { Store, Tenant } from "../store/store.ts";
import { icon } from "./icon.ts";

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escape text for HTML text and attribute values. */
export function esc(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]!);
}

/** Tagged template that escapes every value. Wrap safe HTML with `raw`. */
export function html(parts: TemplateStringsArray, ...values: unknown[]): Raw {
  let out = parts[0]!;
  for (let i = 0; i < values.length; i++) out += show(values[i]) + parts[i + 1]!;
  return new Raw(out);
}

export class Raw {
  constructor(readonly text: string) {}
  toString(): string {
    return this.text;
  }
}

/** Mark trusted HTML. Use only on text that this module or `html` made. */
export function raw(text: string): Raw {
  return new Raw(text);
}

function show(value: unknown): string {
  if (value instanceof Raw) return value.text;
  if (Array.isArray(value)) return value.map(show).join("");
  if (value === undefined || value === null || value === false) return "";
  return esc(value);
}

export interface Tab {
  href: string;
  label: string;
  /** Icon name. See `icon.ts`. */
  icon: string;
  active: boolean;
}

export interface Shell {
  title: string;
  nonce: string;
  /** Tenant name in the top bar. */
  tenant?: string;
  tabs?: Tab[];
  /** CSRF token for the logout form. Empty on the login page. */
  csrf?: string;
  /** Link to the tenant list (super admin only). */
  home?: string;
  body: Raw;
}

/** Full HTML page. */
export function page(s: Shell): string {
  const tabs = s.tabs?.length
    ? html`<nav class="tabs" aria-label="Sections">${s.tabs.map(
        (t) => html`<a href="${t.href}"${t.active ? raw(' aria-current="page"') : ""}>${icon(t.icon)}<span>${t.label}</span></a>`,
      )}</nav>`
    : "";
  const bar = s.csrf
    ? html`<header class="bar"><div class="wrap bar-row">
        <a class="brand" href="${s.home || "/admin"}">${raw(MARK)}agentnet</a>
        ${s.tenant ? html`<span class="crumb">${s.tenant}</span>` : ""}
        <form method="post" action="/admin/logout" class="end"><input type="hidden" name="csrf" value="${s.csrf}"><button class="bare">${icon("signout")}<span>Sign out</span></button></form>
      </div>${tabs ? html`<div class="wrap">${tabs}</div>` : ""}</header>`
    : "";
  return (
    "<!doctype html>" +
    html`<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><meta name="color-scheme" content="light dark">
<title>${s.title} · agentnet</title>
<style>${raw(CSS)}</style></head>
<body>${bar}<main class="wrap" id="main">${s.body}</main>
<script nonce="${s.nonce}">${raw(SCRIPT)}</script></body></html>`.text
  );
}

/** Brand mark: one node that links to a second node. */
export const MARK =
  '<svg class="mark" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="5" cy="9" r="3.2" fill="currentColor"/><circle cx="13.5" cy="9" r="2.3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8.2 9h3" stroke="currentColor" stroke-width="1.6"/></svg>';

/**
 * Small client script.
 * - Copy a snippet.
 * - Send a filter form when a select changes.
 * - Sort a table when its header button is clicked.
 * - Show a busy state on a form while it sends.
 */
const SCRIPT = `
document.querySelectorAll("[data-copy]").forEach(function (b) {
  b.addEventListener("click", function () {
    var el = document.getElementById(b.getAttribute("data-copy"));
    var label = b.querySelector("span");
    if (!el || !navigator.clipboard || !label) return;
    navigator.clipboard.writeText(el.textContent || "").then(function () {
      var old = label.textContent; label.textContent = "Copied";
      setTimeout(function () { label.textContent = old; }, 1400);
    }, function () { label.textContent = "Copy failed. Select the text."; });
  });
});
document.querySelectorAll("select[data-send]").forEach(function (s) {
  s.addEventListener("change", function () { if (s.form) s.form.submit(); });
});
document.querySelectorAll("form[data-busy]").forEach(function (f) {
  f.addEventListener("submit", function () {
    f.setAttribute("aria-busy", "true");
    f.querySelectorAll("button[data-busy-text]").forEach(function (b) {
      b.disabled = true; var label = b.querySelector("span"); if (label) label.textContent = b.getAttribute("data-busy-text");
    });
  });
});
function cellValue(row, i) {
  var c = row.children[i]; if (!c) return "";
  return (c.textContent || "").trim();
}
document.querySelectorAll("table.sort").forEach(function (t) {
  var heads = t.querySelectorAll("thead th");
  heads.forEach(function (th, i) {
    var b = th.querySelector("button"); if (!b) return;
    b.addEventListener("click", function () {
      var dir = th.getAttribute("aria-sort") === "descending" ? "ascending" : "descending";
      heads.forEach(function (h) { h.removeAttribute("aria-sort"); });
      th.setAttribute("aria-sort", dir);
      var body = t.tBodies[0]; var rows = Array.prototype.slice.call(body.rows);
      rows.sort(function (a, z) {
        var x = cellValue(a, i), y = cellValue(z, i);
        var nx = parseFloat(x.replace(/[,%]/g, "")), ny = parseFloat(y.replace(/[,%]/g, ""));
        var r = !isNaN(nx) && !isNaN(ny) && /^[0-9.,%–-]+$/.test(x) && /^[0-9.,%–-]+$/.test(y) ? nx - ny : x.localeCompare(y);
        return dir === "ascending" ? r : -r;
      });
      rows.forEach(function (r) { body.appendChild(r); });
    });
  });
});
`;

const CSS = `
:root{color-scheme:light;
--ground:#f6f6f4;--surface:#ffffff;--fg:#121212;--muted:#595955;--faint:#6b6b66;--line:#e3e3df;--line-strong:#cfcfca;--soft:#efefec;
--shell:#121212;--shell-fg:#f4f4f1;--shell-muted:#b4b4ad;--shell-line:#3a3a37;
--ink:#121212;--ink-fg:#ffffff;--focus:#121212;--select:#ffd9c7;
--good:#14692c;--good-bg:#e6f3e8;--warn:#7f4b00;--warn-bg:#fbefd9;--bad:#a8231a;--bad-bg:#fbe7e5;
--agent:#eb6834;--human:#2a78d6;
--s1:#2a78d6;--s2:#eb6834;--s3:#1baf7a;--s4:#eda100;--s5:#e87ba4;
--sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace}
@media (prefers-color-scheme:dark){:root{color-scheme:dark;
--ground:#0c0c0b;--surface:#141413;--fg:#f1f1ee;--muted:#adada6;--faint:#9a9a93;--line:#272725;--line-strong:#3a3a37;--soft:#1c1c1a;
--shell:#000000;--shell-fg:#f4f4f1;--shell-muted:#a9a9a2;--shell-line:#3a3a37;
--ink:#f1f1ee;--ink-fg:#121212;--focus:#f1f1ee;--select:#6b3018;
--good:#6fd58c;--good-bg:#132a19;--warn:#f2b553;--warn-bg:#2d2110;--bad:#ff8a80;--bad-bg:#331513;
--agent:#d95926;--human:#3987e5;
--s1:#3987e5;--s2:#d95926;--s3:#199e70;--s4:#c98500;--s5:#d55181}}
*{box-sizing:border-box}
html{scrollbar-color:var(--line-strong) transparent;-webkit-text-size-adjust:100%}
html,body{margin:0;background:var(--ground);color:var(--fg);font:15px/1.5 var(--sans);-webkit-font-smoothing:antialiased}
::selection{background:var(--select);color:var(--fg)}
input,textarea{caret-color:var(--fg)}
::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:var(--line-strong);border-radius:10px;border:2px solid var(--ground)}::-webkit-scrollbar-track{background:transparent}
a{color:inherit;text-decoration-color:var(--line-strong);text-underline-offset:3px;text-decoration-thickness:1px}
a:hover{text-decoration-color:currentColor}
:focus-visible{outline:2px solid var(--focus);outline-offset:2px;border-radius:4px}
.icon{flex:none;vertical-align:-3px}
.wrap{max-width:1180px;margin:0 auto;padding:0 16px}
main.wrap{padding-top:28px;padding-bottom:72px}
.bar{background:var(--shell);color:var(--shell-fg);position:sticky;top:0;z-index:5}
.bar :focus-visible{outline-color:var(--shell-fg)}
.bar-row{display:flex;align-items:center;gap:14px;height:52px}
.brand{font-weight:600;text-decoration:none;display:flex;align-items:center;gap:8px;letter-spacing:-.01em;font-size:16px}
.crumb{color:var(--shell-muted);font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.crumb:before{content:"/";margin-right:14px;color:var(--shell-line)}
.end{margin-left:auto}
button.bare{background:none;border:0;color:var(--shell-muted);display:inline-flex;gap:6px;align-items:center;padding:6px 8px;font-weight:400}
button.bare:hover{color:var(--shell-fg);opacity:1}
.tabs{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;margin:0 -8px}
.tabs::-webkit-scrollbar{display:none}
.tabs a{display:inline-flex;align-items:center;gap:7px;padding:10px 10px 11px;text-decoration:none;color:var(--shell-muted);border-bottom:2px solid transparent;white-space:nowrap;font-size:14px}
.tabs a:hover{color:var(--shell-fg)}
.tabs a[aria-current]{color:var(--shell-fg);border-bottom-color:var(--agent)}
h1{font-size:26px;line-height:1.2;font-weight:600;letter-spacing:-.02em;margin:0;text-wrap:balance}
h2{font-size:15px;line-height:1.3;font-weight:600;margin:0 0 14px;text-wrap:balance}
h2.gap{margin-top:28px}
.head{display:flex;flex-wrap:wrap;align-items:flex-end;gap:16px;justify-content:space-between;margin-bottom:24px}
.sub{color:var(--muted);font-size:14px;margin:6px 0 0}
.card{border:1px solid var(--line);border-radius:10px;padding:20px;background:var(--surface);margin-bottom:20px;min-width:0}
.lead{color:var(--muted);font-size:13px;margin:-6px 0 14px;max-width:70ch}
.grid{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));margin-bottom:20px}
.grid>.card{margin-bottom:0}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));border:1px solid var(--line);border-radius:10px;background:var(--surface);margin:0 0 20px;overflow:hidden}
.stat{padding:14px 18px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);margin:0 -1px -1px 0}
.stat dt{color:var(--muted);font-size:13px}
.stat dd{margin:4px 0 0;font-size:24px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.stat .h{display:block;color:var(--muted);font-size:12px;font-weight:400;letter-spacing:0;margin-top:2px}
.seg{display:inline-flex;border:1px solid var(--line-strong);border-radius:8px;overflow:hidden;background:var(--surface)}
.seg a{padding:6px 12px;text-decoration:none;font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums}
.seg a+a{border-left:1px solid var(--line)}
.seg a:hover{color:var(--fg)}
.seg a[aria-current]{background:var(--ink);color:var(--ink-fg)}
.scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
table{width:100%;border-collapse:collapse;font-size:14px}
th{font-weight:500;color:var(--muted);text-align:left;font-size:13px;white-space:nowrap}
th button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:2px;border-radius:4px}
th button:focus-visible{outline:2px solid var(--focus);outline-offset:2px}
th button .icon{opacity:.5}
th[aria-sort] button .icon{opacity:1}
th,td{padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:top}
th:first-child,td:first-child{padding-left:0}th:last-child,td:last-child{padding-right:0}
thead th{border-bottom-color:var(--line-strong)}
td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
th.n button{flex-direction:row-reverse}
tr:last-child td{border-bottom:0}
.muted{color:var(--muted)}.small{font-size:13px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.mono,code{font-family:var(--mono);font-size:13px}
.num{font-variant-numeric:tabular-nums;white-space:nowrap}
.clip{max-width:380px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.badge{display:inline-block;border:1px solid var(--line-strong);border-radius:999px;padding:0 8px;font-size:12px;line-height:20px;white-space:nowrap;margin:0 4px 2px 0;color:var(--fg)}
.badge.agent{background:var(--ink);color:var(--ink-fg);border-color:var(--ink)}
.badge.good{color:var(--good);background:var(--good-bg);border-color:transparent}
.badge.bad{color:var(--bad);background:var(--bad-bg);border-color:transparent}
.badge.warn{color:var(--warn);background:var(--warn-bg);border-color:transparent}
.chip{display:inline-block;font-size:12px;border:1px dashed var(--line-strong);border-radius:6px;padding:0 6px;margin:0 2px;color:var(--muted)}
form.filters{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;margin-bottom:20px}
label{font-size:13px;color:var(--muted);display:block}
input,select,textarea,button{font:inherit;color:inherit}
input[type=text],input[type=search],input[type=password],input[type=number],input[type=email],input[type=url],select,textarea{
display:block;width:100%;background:var(--surface);border:1px solid var(--line-strong);border-radius:8px;padding:8px 10px;font-size:14px;margin-top:4px;color:var(--fg)}
input::placeholder,textarea::placeholder{color:var(--faint)}
input[type=checkbox]{accent-color:var(--ink);width:16px;height:16px;margin:0}
textarea{min-height:84px;font-family:var(--mono);font-size:13px;resize:vertical}
form.filters>div{min-width:130px;flex:1 1 130px}
form.filters>div.wide{flex:3 1 240px}
button,a.button{display:inline-flex;align-items:center;gap:7px;background:var(--ink);color:var(--ink-fg);border:1px solid var(--ink);border-radius:8px;padding:8px 14px;font-size:14px;font-weight:500;cursor:pointer;text-decoration:none;line-height:1.3}
button:hover,a.button:hover{opacity:.88}
button:disabled{opacity:.55;cursor:progress}
button.ghost,a.button.ghost{background:var(--surface);color:var(--fg);border-color:var(--line-strong)}
button.ghost:hover,a.button.ghost:hover{opacity:1;border-color:var(--fg)}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.field{margin-bottom:16px}
.field .small{display:block;margin-top:4px}
.check{display:flex;gap:8px;align-items:center;color:var(--fg);font-size:14px}
.note{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--line-strong);padding:10px 14px;background:var(--surface);border-radius:8px;margin-bottom:20px;font-size:14px}
.note.bad{border-color:transparent;background:var(--bad-bg);color:var(--bad)}
.note.warn{border-color:transparent;background:var(--warn-bg);color:var(--warn)}
.note.good{border-color:transparent;background:var(--good-bg);color:var(--good)}
.note .icon{margin-top:3px}
pre.code{background:var(--soft);border:1px solid var(--line);border-radius:8px;padding:12px;overflow-x:auto;font-family:var(--mono);font-size:13px;white-space:pre-wrap;word-break:break-all;margin:8px 0}
.steps{list-style:none;padding:0;margin:0}
.steps li{display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--line);font-size:14px}
.steps li:last-child{border-bottom:0}
.steps .icon{margin-top:3px}
.steps .done{color:var(--good)}.steps .pending{color:var(--faint)}
.steps .hint{display:block;color:var(--muted);font-size:13px}
.flow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
.flow svg{grid-column:1/-1;width:100%;height:auto;display:block;margin-bottom:12px}
.flow .step{padding:0 12px 0 0}
.flow .v{font-size:22px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.flow .l{font-size:13px;line-height:1.35}
.flow .r{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums;margin-top:2px}
.legend{display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--muted);margin-bottom:10px}
.legend i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px}
.plot{position:relative;padding:8px 0 0 40px;--h:200px}
.yaxis{position:absolute;left:0;top:8px;height:var(--h);width:32px}
svg.chart{width:100%;height:var(--h);display:block;overflow:visible}
svg.chart g:hover rect{opacity:.8}
.yaxis span{position:absolute;left:0;width:32px;text-align:right;transform:translateY(-50%);font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
.xaxis{position:relative;height:18px;margin-top:6px}
.xaxis span{position:absolute;transform:translateX(-50%);font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
@media (max-width:640px){.plot{--h:150px}.xaxis span:nth-child(even){display:none}}
.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px 20px;font-size:14px}
.facts>div>div{margin-top:2px}
.turn{padding:16px 0;border-bottom:1px solid var(--line)}
.turn:first-child{padding-top:0}.turn:last-child{border-bottom:0;padding-bottom:0}
.said{font-weight:500;margin-bottom:6px;white-space:pre-wrap;overflow-wrap:anywhere;max-width:75ch}
.reply{white-space:pre-wrap;overflow-wrap:anywhere;max-width:75ch}
.meta{font-size:12px;color:var(--muted);margin-top:8px;font-variant-numeric:tabular-nums}
.pager{display:flex;gap:8px;justify-content:space-between;align-items:center;margin-top:14px;font-size:14px}
.back{display:inline-flex;gap:4px;align-items:center;font-size:14px;color:var(--muted);text-decoration:none;margin-bottom:10px}
.back:hover{color:var(--fg)}
.login{max-width:400px;margin:14vh auto 0}
.login .brand{margin-bottom:20px;color:var(--fg)}
.empty{padding:14px 0;margin:0;color:var(--muted);font-size:14px;max-width:60ch}
details summary{cursor:pointer;color:var(--muted);font-size:13px;margin-top:10px}
details[open] summary{margin-bottom:8px}
@media (max-width:640px){h1{font-size:22px}.stat dd{font-size:20px}.clip{max-width:220px}
.flow{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:14px}.card{padding:16px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;

/** One KPI in the stats strip. */
export function tile(label: string, value: string | number, hint?: string): Raw {
  return html`<div class="stat"><dt>${label}</dt><dd>${value}${hint ? html`<span class="h">${hint}</span>` : ""}</dd></div>`;
}

/** Strip of KPIs. */
export function stats(tiles: Raw[]): Raw {
  return html`<dl class="stats">${tiles}</dl>`;
}

/** Number with thousands marks. */
export function num(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

/** Share as a whole percent, or a dash when the base is zero. */
export function pct(part: number, whole: number): string {
  if (!whole) return "–";
  return Math.round((part / whole) * 100) + "%";
}

/** Time as `YYYY-MM-DD HH:MM` in UTC. */
export function when(ms: number): string {
  return new Date(ms).toISOString().slice(0, 16).replace("T", " ");
}

/** Table with sortable headers. Cells are escaped unless they are `Raw`. Numeric columns align right. */
export function table(head: string[], rows: unknown[][], numeric: number[] = []): Raw {
  const cls = (i: number) => (numeric.includes(i) ? raw(' class="n"') : "");
  const sortable = rows.length > 1;
  return html`<div class="scroll"><table${sortable ? raw(' class="sort"') : ""}><thead><tr>${head.map(
    (h, i) => html`<th scope="col"${cls(i)}>${sortable ? html`<button type="button">${h}${icon("sort")}</button>` : h}</th>`,
  )}</tr></thead>
<tbody>${rows.map((r) => html`<tr>${r.map((c, i) => html`<td${cls(i)}>${c}</td>`)}</tr>`)}</tbody></table></div>`;
}

/** Empty state: what is missing and what to do next. */
export function empty(text: string): Raw {
  return html`<p class="empty">${text}</p>`;
}

/** Note above the content. Tone `bad` is an error. */
export function note(text: Raw | string, tone: "" | "good" | "warn" | "bad" = ""): Raw {
  const role = tone === "bad" ? "alert" : "status";
  return html`<div class="note ${tone}" role="${role}">${icon(tone === "good" ? "done" : "alert")}<div>${text}</div></div>`;
}

/** What a page renderer reads. */
export interface View {
  store: Store;
  tenant: Tenant;
  /** `/admin/t/<id>`. */
  base: string;
  /** Range in days: 7, 30, or 90. */
  days: number;
  since: number;
  now: number;
  query: URLSearchParams;
  csrf: string;
  /** Public origin of this service, for example `https://agents.example.com`. */
  ours: string;
}

/** Range picker. Keeps the other query values. */
export function rangePicker(view: View, path: string): Raw {
  return html`<nav class="seg" aria-label="Date range">${[7, 30, 90].map((d) => {
    const q = new URLSearchParams(view.query);
    q.set("days", String(d));
    q.delete("page");
    return html`<a href="${path + "?" + q.toString()}"${d === view.days ? raw(' aria-current="true"') : ""}>${d} days</a>`;
  })}</nav>`;
}
