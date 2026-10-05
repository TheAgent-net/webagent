/**
 * Traffic: requests by kind over time, families, paths that agents read, beacon detections, and CDN rows.
 */
import type { VisitorKind } from "../store/store.ts";
import { barChart, listDays, type Series } from "./chart.ts";
import { empty, html, num, pct, rangePicker, stats, table, tile, type Raw, type View } from "./page.ts";
import { MACHINE_KINDS, READ_PATHS } from "./stats.ts";

/** Fixed color order. A kind keeps its color on every page. */
const KIND_SERIES: Series[] = [
  { key: "human", label: "Human", color: "var(--s1)" },
  { key: "assistant", label: "Assistant", color: "var(--s2)" },
  { key: "browser", label: "Agent browser", color: "var(--s3)" },
  { key: "crawler", label: "Crawler", color: "var(--s4)" },
  { key: "script", label: "Script", color: "var(--s5)" },
];

export function trafficPage(view: View): Raw {
  const { store, tenant, since, now, base } = view;
  const id = tenant.id;
  const days = listDays(since, now);
  const cells = store.listEventDays(id, "kind", { since, type: "request" });
  const machine = { since, type: "request", kinds: MACHINE_KINDS };
  const total = store.sumEvents(id, machine);
  const families = store.groupEvents(id, "family", machine).filter((c) => c.key);
  const verified = families.reduce((s, c) => s + c.verified, 0);
  const paths = store.groupEvents(id, "path", machine).slice(0, 15);
  const reads = store.sumEvents(id, { ...machine, paths: READ_PATHS });
  const beacons = store.groupEvents(id, "page", { since, type: "beacon", kinds: ["browser"] as VisitorKind[] });
  const cdnFamilies = store.groupEvents(id, "family", { since, type: "cdn" });
  const cdnPaths = store.groupEvents(id, "path", { since, type: "cdn", kinds: MACHINE_KINDS }).slice(0, 15);
  const cdnTotal = cdnFamilies.reduce((s, c) => s + c.n, 0);

  return html`
<div class="head"><div><h1>Agent traffic</h1><p class="sub">Last ${view.days} days</p></div>${rangePicker(view, base + "/traffic")}</div>
${stats([
  tile("Machine requests", num(total), "Assistants, agent browsers, crawlers, scripts"),
  tile("Verified share", pct(verified, families.reduce((s, c) => s + c.n, 0)), "Signature or IP range"),
  tile("Reads of llms.txt and cards", num(reads)),
  tile("Agent browser detections", num(beacons.reduce((s, c) => s + c.n, 0)), "Beacon on your pages"),
  tile("CDN agent hits", num(cdnTotal)),
])}
<section class="card" aria-labelledby="req-h"><h2 id="req-h">Requests by kind</h2>
  ${barChart(days, cells, KIND_SERIES, "Requests per day by visitor kind")}
</section>
<div class="grid">
  <section class="card" aria-labelledby="fam-h"><h2 id="fam-h">Families</h2>
    ${families.length
      ? table(["Family", "Requests", "Verified"], families.map((c) => [c.key, num(c.n), pct(c.verified, c.n)]), [1, 2])
      : empty("No agent family seen in this range.")}
  </section>
  <section class="card" aria-labelledby="path-h"><h2 id="path-h">Top paths agents read</h2>
    ${paths.length
      ? table(["Path", "Requests"], paths.map((c) => [html`<span class="mono">${c.key || "/"}</span>`, num(c.n)]), [1])
      : empty("No machine requests in this range.")}
  </section>
</div>
<section class="card" aria-labelledby="beacon-h"><h2 id="beacon-h">Agent browsers on your pages</h2>
  <p class="lead">The widget sends a beacon when it finds an agent browser on a page of your site.</p>
  ${beacons.length
    ? table(["Page", "Detections"], beacons.map((c) => [html`<div class="clip mono">${c.key || "unknown"}</div>`, num(c.n)]), [1])
    : empty("No agent browser detected in this range.")}
</section>
${cdnTotal
  ? html`<div class="grid">
  <section class="card" aria-labelledby="cdn-h"><h2 id="cdn-h">CDN: agents by family</h2>
    ${table(["Family", "Hits", "Verified"], cdnFamilies.map((c) => [c.key || "unknown", num(c.n), pct(c.verified, c.n)]), [1, 2])}
  </section>
  <section class="card" aria-labelledby="cdnp-h"><h2 id="cdnp-h">CDN: top paths</h2>
    ${table(["Path", "Hits"], cdnPaths.map((c) => [html`<span class="mono">${c.key || "/"}</span>`, num(c.n)]), [1])}
  </section></div>`
  : html`<section class="card" aria-labelledby="cf-h"><h2 id="cf-h">Connect Cloudflare (read-only)</h2>
  <p class="lead">Our host sees only the requests that come to us. Your CDN sees every agent on every page of your site.</p>
  <ol class="small">
    <li>In Cloudflare, make an API token with the permissions <span class="mono">Zone Analytics: Read</span> and <span class="mono">Logs: Read</span>.</li>
    <li>Send the token and the zone id to your agentnet contact.</li>
    <li>We read agent hits once per hour. We do not change any setting in your account.</li>
  </ol>
  <p class="small muted">CDN rows show here after the first import.</p>
</section>`}`;
}
