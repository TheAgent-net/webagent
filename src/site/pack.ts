import type { CrawlState } from "./crawl.ts";
import { inferFlows } from "./flows.ts";
import type { PageShot, SitePack } from "./types.ts";

export function buildPack(state: CrawlState): SitePack {
  const pages = state.pages.filter((p) => p.status > 0);
  const flows = inferFlows(pages);
  const facts = factsFrom(pages, flows, state.origin);
  const starterQuestions = questionsFrom(pages, flows);
  const home = pages[0];
  const name = home?.title || new URL(state.origin).hostname;

  const instruction = [
    `You are the public agent for ${name} (${state.origin}).`,
    "Answer from the crawled site facts and flows only. If you do not know, say so. Do not invent prices, seats, or policies.",
    "When a visitor wants to do something, walk them through the matching flow step by step.",
    "",
    "Flows:",
    ...flows.map((f) => `- ${f.name}: ${f.purpose}. Steps: ${f.steps.map((s) => s.title || s.url).join(" → ")}`),
    "",
    "Facts:",
    ...facts.map((x) => `- ${x}`),
  ].join("\n");

  return {
    origin: state.origin,
    crawledAt: new Date().toISOString(),
    complete: !state.authAsk,
    pages,
    flows,
    instruction,
    facts,
    starterQuestions,
    authAsk: state.authAsk,
  };
}

function factsFrom(pages: PageShot[], flows: ReturnType<typeof inferFlows>, origin: string): string[] {
  const out: string[] = [];
  out.push(`Origin ${origin}. Crawled ${pages.length} pages.`);
  const home = pages[0];
  if (home?.description) out.push(home.description);
  for (const h of (home?.headings ?? []).slice(0, 8)) out.push(h);
  for (const f of flows) out.push(`${f.name}: ${f.purpose}`);
  for (const p of pages.slice(0, 20)) {
    if (p.title && p.url !== home?.url) out.push(`${p.title} — ${p.url}`);
  }
  return dedupe(out).slice(0, 40);
}

function questionsFrom(pages: PageShot[], flows: ReturnType<typeof inferFlows>): string[] {
  const qs: string[] = [];
  for (const f of flows) {
    if (f.id === "search") qs.push("How do I search on this site?");
    if (f.id === "browse") qs.push("What can I browse here?");
    if (f.id === "account") qs.push("How do I sign in or manage my account?");
    if (f.id === "checkout") qs.push("How does booking or checkout work?");
    if (f.id === "change") qs.push("How do I change or cancel something I already booked?");
    if (f.id === "support") qs.push("Where do I get help or read the policy?");
    if (f.id === "quote") qs.push("How do I get a quote and what does coverage cost?");
    if (f.id === "signup") qs.push("How do I sign up or start a trial?");
    if (f.id === "demo") qs.push("How do I book a demo or talk to sales?");
  }
  for (const p of pages) {
    for (const h of p.headings.slice(0, 3)) {
      if (h.length > 8 && h.length < 80) qs.push(`What should I know about ${h}?`);
    }
  }
  if (!qs.length) qs.push("What does this site offer?", "Where do I start?");
  return dedupe(qs).slice(0, 12);
}

function dedupe(xs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of xs) {
    const k = x.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}
