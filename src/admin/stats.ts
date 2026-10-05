/**
 * Stats: numbers for the admin pages. Read the store only. Write nothing.
 */
import type { Conversation, ConversationSum, Store, Tenant, VisitorKind } from "../store/store.ts";

/** Paths that an agent reads to learn about the site. */
export const READ_PATHS = ["/llms.txt", "/llms-full.txt", "/.well-known/agent-card.json", "/.well-known/agent.json", "/agent.json"];

/** Kinds that act for a person: assistant fetches and agent browsers. */
export const AGENT_KINDS: VisitorKind[] = ["assistant", "browser"];

/** Every kind that is not a person at a normal browser. */
export const MACHINE_KINDS: VisitorKind[] = ["assistant", "browser", "crawler", "script"];

export interface Funnel {
  seen: number;
  read: number;
  talked: number;
  deep: number;
}

export interface Overview {
  sum: ConversationSum;
  /** Agents seen on the company site and on our host. */
  seen: number;
  funnel: Funnel;
  votes: number;
  down: number;
}

export function getOverview(store: Store, tenant: string, since: number): Overview {
  const sum = store.sumConversations(tenant, since);
  const seen =
    store.sumEvents(tenant, { since, type: "beacon", kinds: ["browser"], distinct: true }) +
    store.sumEvents(tenant, { since, type: "cdn", kinds: ["assistant"] }) +
    store.sumEvents(tenant, { since, type: "request", kinds: ["assistant"], distinct: true });
  const read =
    store.sumEvents(tenant, { since, type: "request", kinds: AGENT_KINDS, paths: READ_PATHS, distinct: true }) +
    store.sumEvents(tenant, { since, type: "cdn", kinds: AGENT_KINDS, paths: READ_PATHS });
  const feedback = store.listFeedback(tenant, since);
  return {
    sum,
    seen,
    funnel: { seen, read, talked: sum.agent, deep: sum.deep },
    votes: feedback.length,
    down: feedback.filter((f) => f.vote < 0).length,
  };
}

export interface FamilyRow {
  family: string;
  requests: number;
  verified: number;
  conversations: number;
}

/** Agent families: requests on our host, verified share, and conversations. */
export function listFamilies(store: Store, tenant: string, since: number): FamilyRow[] {
  const rows = new Map<string, FamilyRow>();
  const row = (family: string) => {
    let r = rows.get(family);
    if (!r) rows.set(family, (r = { family, requests: 0, verified: 0, conversations: 0 }));
    return r;
  };
  for (const c of store.groupEvents(tenant, "family", { since, type: "request", kinds: MACHINE_KINDS })) {
    if (!c.key) continue;
    const r = row(c.key);
    r.requests += c.n;
    r.verified += c.verified;
  }
  for (const c of store.countConversations(tenant, "family", since)) if (c.key) row(c.key).conversations += c.n;
  return [...rows.values()].sort((a, b) => b.requests + b.conversations - (a.requests + a.conversations));
}

export interface Step {
  label: string;
  done: boolean;
  hint: string;
}

/** Onboarding checklist. `ours` is the public origin of this service. */
export function listSteps(store: Store, tenant: Tenant, ours: string): Step[] {
  const beacons = store.sumEvents(tenant.id, { type: "beacon" });
  const loads = store
    .listEvents(tenant.id, { type: "request", limit: 1000 })
    .filter((e) => e.path === "/widget.js")
    .some((e) => {
      const from = String(e.data?.origin ?? e.data?.referer ?? e.data?.page ?? "");
      return !!from && !from.startsWith(ours);
    });
  const handoff = tenant.settings.handoff as Record<string, unknown> | undefined;
  const hasHandoff = !!handoff && ["email", "webhook", "slack"].some((k) => typeof handoff[k] === "string" && handoff[k]);
  const first = store.sumConversations(tenant.id, 0).total > 0;
  const cdn = store.sumEvents(tenant.id, { type: "cdn" }) > 0 || !!tenant.settings.cdn;
  return [
    { label: "Script tag seen", done: beacons > 0 || loads, hint: "Add the script tag to your site." },
    { label: "CSP OK", done: beacons > 0, hint: "A widget beacon reached us. Add the CSP lines if this stays pending." },
    { label: "Handoff set", done: hasHandoff, hint: "Add an email, a webhook, or a Slack target in Settings." },
    { label: "First conversation", done: first, hint: "Ask the widget one question on your site." },
    { label: "CDN connected", done: cdn, hint: "Connect Cloudflare (read-only) to see agents on every page." },
  ];
}

/** Lower case, no punctuation, one space. Two questions with the same text after this are one group. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .replace(/^(hi|hello|hey|please) /, "")
    .replace(/ please$/, "")
    .trim();
}

export interface QuestionGroup {
  text: string;
  n: number;
  last: number;
  conversation: string;
}

/** Group what visitors said. Most asked first. */
export function groupQuestions(items: { conversation: string; said: string; at: number }[], limit = 30): QuestionGroup[] {
  const groups = new Map<string, QuestionGroup & { forms: Map<string, number> }>();
  for (const q of items) {
    const key = normalize(q.said);
    if (!key) continue;
    let g = groups.get(key);
    if (!g) groups.set(key, (g = { text: q.said, n: 0, last: 0, conversation: q.conversation, forms: new Map() }));
    g.n++;
    if (q.at > g.last) (g.last = q.at), (g.conversation = q.conversation);
    const said = q.said.trim();
    g.forms.set(said, (g.forms.get(said) ?? 0) + 1);
  }
  return [...groups.values()]
    .map((g) => ({ text: [...g.forms].sort((a, b) => b[1] - a[1])[0]![0], n: g.n, last: g.last, conversation: g.conversation }))
    .sort((a, b) => b.n - a.n || b.last - a.last)
    .slice(0, limit);
}

export interface Gap {
  conversation: Conversation;
  handoff: boolean;
  down: number;
  first: string;
}

/** Knowledge gaps: conversations with a handoff or a thumbs down. Newest first. */
export function listGaps(store: Store, tenant: string, since: number, limit = 100): Gap[] {
  const out = new Map<string, Gap>();
  for (const c of store.listConversations(tenant, { handoff: true, since, limit })) {
    out.set(c.id, { conversation: c, handoff: true, down: 0, first: "" });
  }
  for (const f of store.listFeedback(tenant, since)) {
    if (f.vote >= 0) continue;
    let g = out.get(f.conversation);
    if (!g) {
      const c = store.getConversation(f.conversation);
      if (!c || c.tenant !== tenant) continue;
      out.set(c.id, (g = { conversation: c, handoff: !!c.handoff, down: 0, first: "" }));
    }
    g.down++;
  }
  const gaps = [...out.values()].sort((a, b) => b.conversation.updated - a.conversation.updated).slice(0, limit);
  for (const g of gaps) g.first = firstQuestion(store, g.conversation.id);
  return gaps;
}

export function firstQuestion(store: Store, conversation: string): string {
  return store.listTurns(conversation)[0]?.said ?? "";
}
