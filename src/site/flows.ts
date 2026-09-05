import type { PageShot, SiteFlow } from "./types.ts";

const KINDS: { id: string; name: string; purpose: string; match: RegExp; hint: string }[] = [
  { id: "search", name: "Search", purpose: "Find items or pages on the site", match: /search|find|query|flights?|book/i, hint: "Enter what you are looking for" },
  { id: "browse", name: "Browse", purpose: "Move from home into categories and detail pages", match: /catalog|product|item|dest|route|offer/i, hint: "Open a category, then a detail page" },
  { id: "account", name: "Account", purpose: "Sign in and manage a personal account", match: /login|signin|account|profile|sso/i, hint: "Sign in if asked" },
  { id: "checkout", name: "Checkout", purpose: "Cart, payment, or booking confirmation", match: /cart|checkout|pay|booking|confirm|order/i, hint: "Review the cart, then confirm" },
  { id: "change", name: "Change or cancel", purpose: "Change dates, cancel, or manage an existing booking", match: /change|cancel|manage|pnr|itinerary|modify/i, hint: "Look up the booking, then pick a change" },
  { id: "support", name: "Help", purpose: "Help, FAQ, contact, or policy", match: /help|faq|support|contact|policy|terms|privacy/i, hint: "Read the article or send a question" },
  { id: "quote", name: "Quote", purpose: "Get a price or start coverage", match: /quote|insure|premium|coverage|polic(y|ies)|demo/i, hint: "Open the quote or coverage page" },
];

export function inferFlows(pages: PageShot[]): SiteFlow[] {
  const byKind = new Map<string, PageShot[]>();
  for (const k of KINDS) byKind.set(k.id, []);

  for (const p of pages) {
    const hay = p.url + " " + p.title + " " + p.headings.join(" ");
    let hit = false;
    for (const k of KINDS) {
      if (k.match.test(hay) || p.forms.some((f) => k.match.test(f.action + f.fields.map((x) => x.name).join(" ")))) {
        byKind.get(k.id)!.push(p);
        hit = true;
      }
    }
    if (!hit && p.forms.length) byKind.get("search")!.push(p);
  }

  const home = pages[0];
  const flows: SiteFlow[] = [];
  for (const k of KINDS) {
    const group = byKind.get(k.id)!;
    if (!group.length) continue;
    const steps: SiteFlow["steps"] = [];
    if (home && !group.includes(home)) steps.push({ url: home.url, title: home.title || "Home", hint: "Start here" });
    const uniq = unique(group).slice(0, 6);
    for (const p of uniq) {
      steps.push({ url: p.url, title: p.title || pathTitle(p.url), hint: k.hint });
    }
    flows.push({ id: k.id, name: k.name, purpose: k.purpose, steps });
  }

  if (flows.length === 0 && pages.length) {
    flows.push({
      id: "browse",
      name: "Browse",
      purpose: "Read the public pages we found",
      steps: unique(pages).slice(0, 8).map((p) => ({ url: p.url, title: p.title || pathTitle(p.url), hint: "Open this page" })),
    });
  }
  return flows;
}

function unique(pages: PageShot[]): PageShot[] {
  const seen = new Set<string>();
  const out: PageShot[] = [];
  for (const p of pages) {
    if (seen.has(p.url)) continue;
    seen.add(p.url);
    out.push(p);
  }
  return out;
}

function pathTitle(url: string): string {
  try {
    const p = new URL(url).pathname.replace(/\/+$/, "");
    const last = p.split("/").filter(Boolean).pop();
    return last ? last.replace(/[-_]/g, " ") : "Home";
  } catch {
    return url;
  }
}
