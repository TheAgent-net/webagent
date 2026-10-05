/**
 * Overview: KPI strip, the agent funnel, the onboarding checklist, conversations per day, and agent families.
 */
import { barChart, listDays } from "./chart.ts";
import { icon } from "./icon.ts";
import { empty, esc, html, note, num, pct, raw, rangePicker, stats, table, tile, type Raw, type View } from "./page.ts";
import { getOverview, listFamilies, listSteps, type Funnel } from "./stats.ts";

export function overviewPage(view: View): Raw {
  const { store, tenant, since, now } = view;
  const o = getOverview(store, tenant.id, since);
  const steps = listSteps(store, tenant, view.ours);
  const families = listFamilies(store, tenant.id, since);
  const days = listDays(since, now);
  const cells = store.listConversationDays(tenant.id, since);
  const range = "days=" + view.days;
  const done = steps.filter((s) => s.done).length;

  return html`
<div class="head"><div><h1>Overview</h1><p class="sub">${tenant.name} · last ${view.days} days (UTC)</p></div>${rangePicker(view, view.base)}</div>
${tenant.settings.paused ? note(html`This agent is paused. Visitors get no replies. <a href="${view.base}/settings">Open settings</a> to start it again.`, "warn") : ""}
${stats([
  tile("Human conversations", num(o.sum.human)),
  tile("Agent conversations", num(o.sum.agent), pct(o.sum.verified, o.sum.agent) + " verified"),
  tile("Intelligent agent conversations", num(o.sum.intelligent)),
  tile("Agents seen on site", num(o.seen), "Beacon, CDN, and requests"),
  tile("Handoffs", num(o.sum.handoff)),
  tile("Thumbs-down rate", pct(o.down, o.votes), num(o.votes) + " votes"),
])}
<div class="grid">
  <section class="card" aria-labelledby="funnel-h"><h2 id="funnel-h">Agent funnel</h2>
    <p class="lead">From the first visit to a real conversation. Each step shows its share of the step before.</p>
    ${funnelFlow(o.funnel)}
  </section>
  <section class="card" aria-labelledby="steps-h"><h2 id="steps-h">Get started: ${done} of ${steps.length} done</h2>
    <ul class="steps">${steps.map(
      (s) =>
        html`<li><span class="${s.done ? "done" : "pending"}">${icon(s.done ? "done" : "pending")}</span><span><span class="sr">${s.done ? "Done: " : "Not done: "}</span>${s.label}${
          s.done ? "" : html`<span class="hint">${s.hint}</span>`
        }</span></li>`,
    )}</ul>
    ${done < steps.length ? html`<p class="small" style="margin:12px 0 0"><a href="${view.base}/settings">Open install and settings</a></p>` : ""}
  </section>
</div>
<section class="card" aria-labelledby="days-h"><h2 id="days-h">Conversations per day</h2>
  ${o.sum.total
    ? html`${barChart(days, cells, [
        { key: "human", label: "Human", color: "var(--human)" },
        { key: "agent", label: "Agent", color: "var(--agent)" },
      ], "Conversations per day, human and agent")}
  <details><summary>Show as a table</summary>${table(
    ["Day", "Human", "Agent"],
    days
      .map((d) => [d, cellOf(cells, d, "human"), cellOf(cells, d, "agent")])
      .filter((r) => r[1] || r[2])
      .reverse(),
    [1, 2],
  )}</details>`
    : empty("No conversations in this range. Conversations show here after the first question on the widget, POST /chat, or MCP.")}
</section>
<section class="card" aria-labelledby="fam-h"><h2 id="fam-h">Agent families</h2>
  ${families.length
    ? table(
        ["Family", "Requests", "Verified", "Conversations"],
        families.map((f) => [f.family, num(f.requests), pct(f.verified, f.requests), num(f.conversations)]),
        [1, 2, 3],
      )
    : empty("No agent traffic in this range.")}
  <p class="small" style="margin:12px 0 0"><a href="${view.base}/traffic?${range}">Open agent traffic</a> · <a href="${view.base}/conversations?${range}">Open conversations</a></p>
</section>`;
}

/**
 * The signature move: the funnel as a stepped flow.
 * Each step is a column. Its height is its count. A line steps down from column to column.
 */
function funnelFlow(f: Funnel): Raw {
  const steps: [string, number][] = [
    ["Agents seen", f.seen],
    ["Read llms.txt or the agent card", f.read],
    ["Talked on chat or MCP", f.talked],
    ["Intelligent, two turns or more", f.deep],
  ];
  const width = 640;
  const height = 120;
  const col = width / steps.length;
  const top = Math.max(1, ...steps.map((s) => s[1]));
  const h = (n: number) => (n ? Math.max(3, (n / top) * (height - 4)) : 0);
  let bars = "";
  let line = "";
  steps.forEach(([label, n], i) => {
    const x = i * col;
    const y = height - h(n);
    const w = col - 6;
    bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h(n).toFixed(1)}" rx="3" fill="var(--agent)" opacity="${(1 - i * 0.18).toFixed(2)}"><title>${esc(label + ": " + num(n))}</title></rect>`;
    line += (i ? `L${x.toFixed(1)} ${y.toFixed(1)}` : `M0 ${y.toFixed(1)}`) + `L${(x + w).toFixed(1)} ${y.toFixed(1)}`;
  });
  const svg = `<svg viewBox="0 -2 ${width} ${height + 3}" aria-hidden="true" focusable="false">
<line x1="0" x2="${width}" y1="${height}" y2="${height}" stroke="var(--line-strong)"/>${bars}
<path d="${line}" fill="none" stroke="var(--fg)" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  return html`<div class="flow" role="list" aria-label="Agent funnel">${raw(svg)}${steps.map(
    ([label, n], i) =>
      html`<div class="step" role="listitem"><div class="v">${num(n)}</div><div class="l">${label}</div><div class="r">${
        i === 0 ? "All agents" : pct(n, steps[i - 1]![1]) + " of the step before"
      }</div></div>`,
  )}</div>`;
}

function cellOf(cells: { day: string; key: string; n: number }[], day: string, key: string): number {
  return cells.find((c) => c.day === day && c.key === key)?.n ?? 0;
}
