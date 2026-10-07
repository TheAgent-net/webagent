/**
 * Dual-level Graph RAG query.
 * High: kind + use. Low: app name/slug + FAQ/error text.
 * Walk one hop to collect apps and debug pages.
 */
import { leadSlugs } from "./kind.ts";
import type { AppGraph, AppHit, GraphAsk, GraphNode, PageHit } from "./types.ts";

const STOP = new Set([
  "the", "and", "for", "you", "are", "what", "does", "can", "how", "from", "with", "this", "that",
  "need", "get", "our", "your", "want", "using", "composio", "please", "help", "into", "my",
  "an", "to", "of", "in", "on", "or", "is", "it", "we", "i", "a",
]);

const GENERIC = new Set([
  "send", "create", "list", "read", "write", "update", "delete", "search", "post", "store",
  "rows", "data", "file", "files", "page", "tool", "tools", "error", "errors",
]);

const KIND_ALIAS: Record<string, string[]> = {
  sheet: ["spreadsheet", "spreadsheets", "sheets"],
  email: ["mail", "inbox"],
  docs: ["document", "documents", "wiki"],
  tickets: ["ticket", "tickets"],
};

export function queryGraph(graph: AppGraph, question: string, limit = 6): GraphAsk {
  const q = question.toLowerCase();
  const words = tokens(question);
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const seed = new Map<string, number>();

  for (const n of graph.nodes) {
    let score = 0;
    if (n.kind === "use") {
      const label = n.label.toLowerCase();
      const parts = label.split(/\s+/).filter((w) => w && !STOP.has(w));
      if (parts.length >= 2 && (hasPhrase(words, label) || q.includes(label))) score += 16;
      else if (overlap(words, label) >= 2) score += 8;
    } else if (n.kind === "kind") {
      const aliases = KIND_ALIAS[n.label] ?? [];
      if (words.includes(n.label) || hasWord(q, n.label) || aliases.some((a) => words.includes(a) || hasWord(q, a))) {
        score += 12;
      }
    } else if (n.kind === "app") {
      const slug = (n.meta.slug || "").toLowerCase();
      const name = n.label.toLowerCase();
      for (const w of words) {
        if (GENERIC.has(w)) continue;
        if (slug === w || name === w) score += 14;
        else if (w.length >= 5 && (slug.includes(w) || hasWord(name, w))) score += 10;
      }
    } else if (n.kind === "page") {
      const hay = (n.label + " " + (n.meta.snippet || "")).toLowerCase();
      for (const w of words) if (hay.includes(w)) score += n.meta.role === "faq" ? 7 : 3;
    }
    if (score) seed.set(n.id, score);
  }

  const appScore = new Map<string, { score: number; why: string[] }>();
  const pageScore = new Map<string, number>();
  const kinds = new Set<string>();
  const uses = new Set<string>();

  const bumpApp = (id: string, add: number, why: string) => {
    const n = byId.get(id);
    if (!n || n.kind !== "app") return;
    const cur = appScore.get(id) ?? { score: 0, why: [] };
    cur.score += add;
    if (why && !cur.why.includes(why)) cur.why.push(why);
    appScore.set(id, cur);
  };

  const rankApp = (n: GraphNode, base: number): number => {
    const slug = (n.meta.slug || "").toUpperCase();
    const kind = n.meta.kind || "";
    const tools = Number(n.meta.tools || 0);
    let extra = Math.min(tools, 80) / 20;
    if (leadSlugs(kind).includes(slug)) extra += 6;
    return base + extra;
  };

  for (const [id, s] of seed) {
    const n = byId.get(id)!;
    if (n.kind === "app") bumpApp(id, s, "name match");
    if (n.kind === "kind") kinds.add(n.label);
    if (n.kind === "use") uses.add(n.label);
    if (n.kind === "page") pageScore.set(id, (pageScore.get(id) ?? 0) + s);
  }

  const bestUse = new Map<string, { add: number; why: string }>();
  for (const e of graph.edges) {
    if (e.rel === "in_kind" && seed.has(e.to)) {
      const kind = byId.get(e.to)?.label || "kind";
      kinds.add(kind);
      bumpApp(e.from, (seed.get(e.to) ?? 0) + 4, "kind: " + kind);
    }
    if (e.rel === "solves" && seed.has(e.to)) {
      const use = byId.get(e.to)?.label || "use";
      uses.add(use);
      const add = (seed.get(e.to) ?? 0) + 6;
      const cur = bestUse.get(e.from);
      if (!cur || add > cur.add) bestUse.set(e.from, { add, why: "use: " + use });
    }
    if (e.rel === "faq" && seed.has(e.to)) {
      pageScore.set(e.to, (pageScore.get(e.to) ?? 0) + 5);
      if (appScore.has(e.from) || seed.has(e.from)) bumpApp(e.from, 3, "faq");
    }
    if (e.rel === "docs" && (seed.has(e.from) || appScore.has(e.from))) {
      pageScore.set(e.to, (pageScore.get(e.to) ?? 0) + 4);
    }
  }
  for (const [id, v] of bestUse) bumpApp(id, v.add, v.why);

  const apps: AppHit[] = [...appScore.entries()]
    .map(([id, v]) => {
      const n = byId.get(id)!;
      return hitFrom(n, rankApp(n, v.score), v.why);
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const topApps = new Set(apps.map((a) => a.slug.toLowerCase()));
  for (const e of graph.edges) {
    if ((e.rel === "faq" || e.rel === "docs") && topApps.has(e.from.replace(/^app:/, ""))) {
      pageScore.set(e.to, (pageScore.get(e.to) ?? 0) + 2);
    }
  }

  const pages: PageHit[] = [...pageScore.entries()]
    .map(([id, score]) => pageFrom(byId.get(id)!, score))
    .filter((p) => p.url)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return { apps, pages, kinds: [...kinds], uses: [...uses] };
}

function hitFrom(n: GraphNode, score: number, why: string[]): AppHit {
  return {
    slug: n.meta.slug || n.id.replace(/^app:/, "").toUpperCase(),
    name: n.label,
    kind: n.meta.kind || "",
    auth: n.meta.auth || "",
    tools: Number(n.meta.tools || 0),
    score,
    why,
    url: n.meta.url || "",
  };
}

function pageFrom(n: GraphNode, score: number): PageHit {
  return {
    url: n.meta.url || "",
    title: n.label,
    role: n.meta.role || "guide",
    score,
    snippet: (n.meta.snippet || "").replace(/\s+/g, " ").trim().slice(0, 280),
  };
}

function tokens(q: string): string[] {
  return q
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

function hasPhrase(words: string[], phrase: string): boolean {
  const pw = phrase.split(/\s+/).filter((w) => w && !STOP.has(w));
  if (!pw.length) return false;
  let i = 0;
  for (const w of words) {
    if (w === pw[i]) i++;
    if (i === pw.length) return true;
  }
  return false;
}

function overlap(words: string[], phrase: string): number {
  const pw = new Set(phrase.split(/\s+/).filter((w) => w && !STOP.has(w)));
  return words.filter((w) => pw.has(w)).length;
}

function hasWord(text: string, word: string): boolean {
  return new RegExp("(^|[^a-z0-9])" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z0-9]|$)", "i").test(text);
}
