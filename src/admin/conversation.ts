/**
 * Conversation: the filtered list and the transcript of one conversation.
 */
import type { Channel, Conversation, ConversationFilter, VisitorKind } from "../store/store.ts";
import { empty, esc, html, num, raw, rangePicker, table, when, type Raw, type View } from "./page.ts";
import { icon } from "./icon.ts";
import { firstQuestion } from "./stats.ts";

const PAGE_SIZE = 50;
const KINDS: VisitorKind[] = ["human", "assistant", "browser", "crawler", "script"];
const LABELS = ["intelligent", "script", "unclear", "human"];
const CHANNELS: Channel[] = ["widget", "chat", "mcp"];

/** Read the list filter from the query. Unknown values are dropped. */
export function readFilter(q: URLSearchParams, since: number): ConversationFilter {
  const kind = q.get("kind") as VisitorKind;
  const label = q.get("label") ?? "";
  const channel = q.get("channel") as Channel;
  const handoff = q.get("handoff");
  const text = (q.get("q") ?? "").trim().slice(0, 200);
  return {
    since,
    kind: KINDS.includes(kind) ? kind : undefined,
    label: LABELS.includes(label) ? label : undefined,
    channel: CHANNELS.includes(channel) ? channel : undefined,
    handoff: handoff === "yes" ? true : handoff === "no" ? false : undefined,
    text: text || undefined,
  };
}

/** Link to the transcript of one conversation. */
export function transcriptHref(base: string, c: Conversation): string {
  return base + "/c/" + encodeURIComponent(c.session);
}

export function kindBadges(c: Conversation): Raw {
  return html`<span class="badge${c.kind === "human" ? "" : " agent"}">${c.kind}</span>${c.family ? html`<span class="badge">${c.family}</span>` : ""}${
    c.verified ? html`<span class="badge good">verified</span>` : ""
  }`;
}

function labelBadge(c: Conversation): Raw {
  if (!c.label && c.score === undefined) return html`<span class="muted">–</span>`;
  const tone = c.label === "intelligent" ? " good" : c.label === "script" ? " warn" : "";
  return html`<span class="badge${tone}">${c.label ?? "unscored"}</span>${
    c.score === undefined ? "" : html`<span class="num small">${c.score.toFixed(2)}</span>`
  }`;
}

export function conversationsPage(view: View): Raw {
  const { store, tenant, query, base } = view;
  const filter = readFilter(query, view.since);
  const page = Math.max(1, Math.min(1000, Number(query.get("page")) || 1));
  const rows = store.listConversations(tenant.id, { ...filter, limit: PAGE_SIZE + 1, offset: (page - 1) * PAGE_SIZE });
  const more = rows.length > PAGE_SIZE;
  const shown = rows.slice(0, PAGE_SIZE);
  const select = (name: string, label: string, options: string[], all: string) => {
    const value = query.get(name) ?? "";
    return html`<div><label for="f-${name}">${label}</label><select id="f-${name}" name="${name}" data-send>
      <option value="">${all}</option>${options.map((o) => html`<option${o === value ? raw(" selected") : ""}>${o}</option>`)}</select></div>`;
  };
  const link = (p: number) => {
    const q = new URLSearchParams(query);
    q.set("page", String(p));
    return base + "/conversations?" + q.toString();
  };
  const exportQ = "days=" + view.days;

  return html`
<div class="head"><div><h1>Conversations</h1><p class="sub">Last ${view.days} days</p></div>
  <div class="row">${rangePicker(view, base + "/conversations")}
  <a class="button ghost" href="${base + "/export.csv?what=conversations&" + exportQ}">${icon("download")}Export conversations</a>
  <a class="button ghost" href="${base + "/export.csv?what=turns&" + exportQ}">${icon("download")}Export turns</a></div></div>
<form class="filters" method="get" action="${base}/conversations">
  <input type="hidden" name="days" value="${view.days}">
  ${select("kind", "Kind", KINDS, "Any kind")}
  ${select("label", "Label", LABELS, "Any label")}
  ${select("channel", "Channel", CHANNELS, "Any channel")}
  ${select("handoff", "Handoff", ["yes", "no"], "Any")}
  <div class="wide"><label for="f-q">Search text</label><input id="f-q" type="search" name="q" value="${query.get("q") ?? ""}" placeholder="Words in a question or a reply"></div>
  <div style="flex:0 0 auto"><button>Apply filters</button></div>
</form>
<section class="card">
${shown.length
  ? table(
      ["Time", "Visitor", "Label", "First question", "Turns", "Page"],
      shown.map((c) => [
        html`<a href="${transcriptHref(base, c)}" class="num">${when(c.started)}</a>${c.handoff ? html`<br><span class="badge warn">handoff</span>` : ""}`,
        html`${kindBadges(c)}<br><span class="muted small">${c.channel}</span>`,
        labelBadge(c),
        html`<a href="${transcriptHref(base, c)}"><div class="clip">${firstQuestion(store, c.id) || "–"}</div></a>`,
        num(c.turns),
        c.page ? html`<div class="clip muted small">${c.page}</div>` : "",
      ]),
      [4],
    )
  : empty("No conversations match this filter.")}
<div class="pager"><span>${page > 1 ? html`<a href="${link(page - 1)}">Newer</a>` : ""}</span><span class="muted small">Page ${page}</span><span>${
    more ? html`<a href="${link(page + 1)}">Older</a>` : ""
  }</span></div>
</section>`;
}

/** Escape the reply. Show each `[[show:id]]` mark as a visual chip. */
export function replyHtml(reply: string): Raw {
  return raw(esc(reply).replace(/\[\[show:([A-Za-z0-9_.:\/-]{1,120})\]\]/g, '<span class="chip">visual: $1</span>'));
}

export function transcriptPage(view: View, session: string): Raw | undefined {
  const { store, tenant, base } = view;
  const c = store.getConversation(tenant.id + ":" + session);
  if (!c || c.tenant !== tenant.id) return undefined;
  const turns = store.listTurns(c.id);
  const votes = store.listFeedback(tenant.id, c.started).filter((f) => f.conversation === c.id);
  const voteOf = (id?: number) => votes.filter((v) => v.turn !== undefined && v.turn === id);
  const loose = votes.filter((v) => v.turn === undefined || !turns.some((t) => t.id === v.turn));
  const voteBadge = (v: { vote: number; note?: string }) =>
    html`<span class="badge ${v.vote > 0 ? "good" : "bad"}">${v.vote > 0 ? "thumbs up" : "thumbs down"}</span>${v.note ? html`<span class="small">${v.note}</span>` : ""}`;

  return html`
<a class="back" href="${base}/conversations">${icon("back")}All conversations</a>
<div class="head"><div><h1>Transcript</h1><p class="sub mono">${c.id}</p></div></div>
<section class="card">
  <div class="facts">
    <div><span class="muted small">Visitor</span><div>${kindBadges(c)}</div></div>
    <div><span class="muted small">Channel</span><div>${c.channel}</div></div>
    <div><span class="muted small">Label</span><div>${labelBadge(c)}</div></div>
    <div><span class="muted small">Handoff</span><div>${c.handoff ? html`<span class="badge warn">handoff</span>` : "No"}</div></div>
    <div><span class="muted small">Started (UTC)</span><div class="num">${when(c.started)}</div></div>
    <div><span class="muted small">Turns</span><div class="num">${num(c.turns)}</div></div>
  </div>
  ${c.page ? html`<p class="small muted" style="margin:14px 0 0">Page <span class="mono">${c.page}</span></p>` : ""}
  ${loose.length ? html`<div class="row">${loose.map(voteBadge)}</div>` : ""}
</section>
<section class="card">
${turns.length
  ? turns.map(
      (t) => html`<div class="turn">
  <div class="muted small">${t.from === "machine" ? "Agent asked" : "Person asked"}</div>
  <div class="said">${t.said}</div>
  <div class="reply">${replyHtml(t.reply)}</div>
  ${t.visual ? html`<span class="chip">visual: ${t.visual}</span>` : ""}
  <div class="meta">${when(t.at)} UTC · ${num(t.ms)} ms${t.tokens ? " · " + num(t.tokens) + " tokens" : ""} ${voteOf(t.id).map(voteBadge)}</div>
</div>`,
    )
  : empty("This conversation has no turns.")}
</section>`;
}
