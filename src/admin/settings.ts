/**
 * Settings: the install snippets and the tenant settings form.
 */
import type { Store, Tenant } from "../store/store.ts";
import { listKeys } from "./auth.ts";
import { icon } from "./icon.ts";
import { empty, html, note, raw, table, when, type Raw, type View } from "./page.ts";

export interface Handoff {
  email?: string;
  webhook?: string;
  slack?: string;
}

const HOST_NAME = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{0,61}[a-z0-9]$/;
const EMAIL = /^[^\s@<>"']{1,64}@[a-z0-9.-]{1,253}\.[a-z]{2,}$/i;

function lines(text: string): string[] {
  return [...new Set(text.split(/[\s,]+/).map((x) => x.trim()).filter(Boolean))];
}

function httpsUrl(text: string): boolean {
  try {
    const u = new URL(text);
    return u.protocol === "https:" && !u.username && !u.password;
  } catch {
    return false;
  }
}

/** Check the form and make the new tenant. Errors keep the old tenant. */
export function readSettings(store: Store, tenant: Tenant, form: FormData): { tenant: Tenant; errors: string[] } {
  const errors: string[] = [];
  const get = (k: string) => String(form.get(k) ?? "").trim();

  const name = get("name").slice(0, 120) || tenant.name;
  const origins: string[] = [];
  for (const o of lines(get("origins"))) {
    try {
      const u = new URL(o);
      if ((u.protocol !== "https:" && u.protocol !== "http:") || u.origin !== o.toLowerCase().replace(/\/+$/, "")) throw new Error();
      origins.push(u.origin);
    } catch {
      errors.push("Origin is not valid: " + o + ". Use the form https://www.example.com.");
    }
  }
  const domains: string[] = [];
  for (const d of lines(get("domains").toLowerCase())) {
    if (!HOST_NAME.test(d)) errors.push("Domain is not valid: " + d + ".");
    else {
      const owner = store.findTenant(d);
      if (owner && owner.id !== tenant.id) errors.push("Domain " + d + " belongs to a different site.");
      else domains.push(d);
    }
  }
  const handoff: Handoff = {};
  const email = get("handoff_email");
  if (email && EMAIL.test(email)) handoff.email = email;
  else if (email) errors.push("Handoff email is not valid.");
  const webhook = get("handoff_webhook");
  if (webhook && httpsUrl(webhook)) handoff.webhook = webhook;
  else if (webhook) errors.push("Handoff webhook must be an https URL.");
  const slack = get("handoff_slack");
  if (slack) {
    if (httpsUrl(slack) || /^#[a-z0-9_-]{1,80}$/.test(slack)) handoff.slack = slack;
    else errors.push("Slack target must be an https webhook URL or a #channel name.");
  }
  const capText = get("cap");
  let cap: number | undefined;
  if (capText) {
    cap = Number(capText);
    if (!Number.isInteger(cap) || cap < 0 || cap > 100_000_000) errors.push("Monthly cap must be a whole number of 0 or more.");
  }
  const paused = form.get("paused") === "on";

  if (errors.length) return { tenant, errors };
  const settings: Record<string, unknown> = { ...tenant.settings, paused };
  if (Object.keys(handoff).length) settings.handoff = handoff;
  else delete settings.handoff;
  if (cap !== undefined) settings.cap = cap;
  else delete settings.cap;
  return { tenant: { ...tenant, name, origins, domains, settings }, errors };
}

export function settingsPage(view: View, notice?: { ok?: string; errors?: string[] }): Raw {
  const { tenant, ours, base, csrf } = view;
  const handoff = (tenant.settings.handoff ?? {}) as Handoff;
  const cap = typeof tenant.settings.cap === "number" ? String(tenant.settings.cap) : "";
  const tag = `<script src="${ours}/t/${tenant.id}/widget.js" async></script>`;
  const llms = `- [Talk to our agent](${ours}/t/${tenant.id}/chat): POST {"text": "your question"} and get a reply. MCP: ${ours}/t/${tenant.id}/mcp`;
  const csp = [
    `script-src ${ours}`,
    `connect-src ${ours}`,
    `img-src ${ours} data:`,
    `font-src ${ours}`,
    `style-src ${ours} 'unsafe-inline'`,
  ].join("\n");
  const keys = listKeys(tenant);

  return html`
<div class="head"><div><h1>Install and settings</h1><p class="sub">${tenant.name} · <span class="mono">${tenant.id}</span></p></div>
  <form method="post" action="${base}/reload" data-busy><input type="hidden" name="csrf" value="${csrf}"><button class="ghost" data-busy-text="Reloading">${icon("reload")}<span>Reload agent</span></button></form></div>
${notice?.ok ? note(notice.ok, "good") : ""}
${notice?.errors?.length ? note(html`Nothing was saved. Fix these values and save again.${notice.errors.map((e) => html`<br>${e}`)}`, "bad") : ""}
<div class="grid">
<section class="card" aria-labelledby="tag-h"><h2 id="tag-h">1. Add the script tag</h2>
  <p class="small">Put this line before <span class="mono">&lt;/body&gt;</span> on every page.</p>
  <pre class="code" id="snip-tag">${tag}</pre><button class="ghost" type="button" data-copy="snip-tag">${icon("copy")}<span>Copy script tag</span></button>
  <h2 style="margin-top:20px">2. Add these CSP lines</h2>
  <p class="small">Add our origin to each directive of your Content-Security-Policy. Skip this step if your site has no CSP.</p>
  <pre class="code" id="snip-csp">${csp}</pre><button class="ghost" type="button" data-copy="snip-csp">${icon("copy")}<span>Copy CSP lines</span></button>
  <h2 style="margin-top:20px">3. Optional: point agents to your agent</h2>
  <p class="small">Add this line to <span class="mono">/llms.txt</span> on your site.</p>
  <pre class="code" id="snip-llms">${llms}</pre><button class="ghost" type="button" data-copy="snip-llms">${icon("copy")}<span>Copy llms.txt line</span></button>
</section>
<section class="card" aria-labelledby="set-h"><h2 id="set-h">Settings</h2>
<form method="post" action="${base}/settings" data-busy>
  <input type="hidden" name="csrf" value="${csrf}">
  <div class="field"><label for="s-name">Name</label><input id="s-name" type="text" name="name" value="${tenant.name}" maxlength="120"></div>
  <div class="field"><label for="s-origins">Allowed origins (one for each line)</label>
    <textarea id="s-origins" name="origins" placeholder="https://www.example.com">${tenant.origins.join("\n")}</textarea>
    <span class="small muted">Pages on these origins can show the widget. Empty means any origin.</span></div>
  <div class="field"><label for="s-domains">Custom domains (one for each line)</label>
    <textarea id="s-domains" name="domains" placeholder="agent.example.com">${tenant.domains.join("\n")}</textarea></div>
  <div class="field"><label for="s-email">Handoff email</label><input id="s-email" type="email" name="handoff_email" value="${handoff.email ?? ""}"></div>
  <div class="field"><label for="s-webhook">Handoff webhook (https)</label><input id="s-webhook" type="url" name="handoff_webhook" value="${handoff.webhook ?? ""}"></div>
  <div class="field"><label for="s-slack">Handoff Slack (webhook URL or #channel)</label><input id="s-slack" type="text" name="handoff_slack" value="${handoff.slack ?? ""}"></div>
  <div class="field"><label for="s-cap">Monthly cap (conversations)</label><input id="s-cap" type="number" min="0" step="1" name="cap" value="${cap}" placeholder="No cap"></div>
  <div class="field"><label class="check"><input type="checkbox" name="paused"${tenant.settings.paused ? raw(" checked") : ""}> Pause the agent</label></div>
  <button data-busy-text="Saving">${icon("done")}<span>Save settings</span></button>
</form>
</section>
</div>
<section class="card" aria-labelledby="key-h"><h2 id="key-h">Admin keys</h2>
  <p class="lead">Make a key with <span class="mono">webagent tenant key ${tenant.id}</span>. We keep only a hash.</p>
  ${keys.length ? table(["Label", "Made"], keys.map((k) => [k.label, html`<span class="num small">${when(k.created)}</span>`])) : empty("No tenant keys yet.")}
</section>`;
}
