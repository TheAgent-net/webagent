/**
 * Build a typed graph from corpus pages.
 * Dual-level Graph RAG: kinds/uses (high) and apps/FAQs (low).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { CorpusPage } from "../site/corpus.ts";
import { appSlugFromUrl, mergeApps, pageRole, parseCatalog } from "./parse.ts";
import type { AppGraph, GraphEdge, GraphNode } from "./types.ts";

export function buildGraph(origin: string, pages: CorpusPage[]): AppGraph {
  const catalogText = pages
    .filter((p) => /\/toolkits(\.md)?$/i.test(p.url.replace(/\/$/, "")) || /All Toolkits/.test(p.text))
    .map((p) => p.text)
    .join("\n");
  const apps = mergeApps(parseCatalog(catalogText), pages);
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const have = new Set<string>();

  const addNode = (n: GraphNode) => {
    if (have.has(n.id)) return;
    have.add(n.id);
    nodes.push(n);
  };
  const addEdge = (e: GraphEdge) => {
    const k = e.from + "|" + e.rel + "|" + e.to;
    if (have.has(k)) return;
    have.add(k);
    edges.push(e);
  };

  for (const app of apps) {
    const appId = "app:" + app.slug.toLowerCase();
    const kindId = "kind:" + app.kind;
    addNode({
      id: appId,
      kind: "app",
      label: app.name,
      meta: {
        slug: app.slug,
        kind: app.kind,
        auth: app.auth,
        tools: String(app.tools),
        url: app.url,
        blurb: app.blurb,
      },
    });
    addNode({ id: kindId, kind: "kind", label: app.kind, meta: {} });
    addEdge({ from: appId, rel: "in_kind", to: kindId });
    for (const use of app.uses) {
      const useId = "use:" + slugUse(use);
      addNode({ id: useId, kind: "use", label: use, meta: { kind: app.kind } });
      addEdge({ from: appId, rel: "solves", to: useId });
    }
    for (const faq of app.faqs) {
      const pageId = "page:faq:" + app.slug.toLowerCase() + ":" + slugUse(faq.q);
      addNode({
        id: pageId,
        kind: "page",
        label: faq.q,
        meta: { url: app.url, role: "faq", snippet: faq.a, app: app.slug },
      });
      addEdge({ from: appId, rel: "faq", to: pageId });
    }
  }

  for (const p of pages) {
    const role = pageRole(p.url);
    const pageId = "page:" + slugUse(p.url);
    addNode({
      id: pageId,
      kind: "page",
      label: p.title || p.url,
      meta: { url: p.url, role, snippet: p.text.slice(0, 400) },
    });
    if (role === "app") {
      const slug = appSlugFromUrl(p.url);
      if (slug) addEdge({ from: "app:" + slug.toLowerCase(), rel: "docs", to: pageId });
    }
    if (role === "auth" || role === "debug" || role === "guide") {
      const hay = (p.title + " " + p.url + " " + p.text.slice(0, 800)).toLowerCase();
      for (const kind of new Set(apps.map((a) => a.kind))) {
        if (kind !== "other" && hay.includes(kind)) addEdge({ from: "kind:" + kind, rel: "docs", to: pageId });
      }
    }
  }

  return { origin, builtAt: new Date().toISOString(), nodes, edges };
}

export function saveGraph(dir: string, graph: AppGraph): void {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "graph.json"), JSON.stringify(graph, null, 2));
  const kinds = graph.nodes.filter((n) => n.kind === "kind").length;
  const apps = graph.nodes.filter((n) => n.kind === "app").length;
  const uses = graph.nodes.filter((n) => n.kind === "use").length;
  const pages = graph.nodes.filter((n) => n.kind === "page").length;
  writeFileSync(
    join(dir, "GRAPH.md"),
    [
      "# Composio app graph",
      "",
      "Typed Graph RAG. Dual-level retrieval: kind/use (high) and app/FAQ (low).",
      "",
      "- Apps: " + apps,
      "- Kinds: " + kinds,
      "- Uses: " + uses,
      "- Pages: " + pages,
      "- Edges: " + graph.edges.length,
      "- Built: " + graph.builtAt,
      "",
      "Query with `recommend_app` then `debug_docs`. No scrape API at run time.",
    ].join("\n"),
  );
}

export function loadGraph(dir: string): AppGraph {
  return JSON.parse(readFileSync(join(dir, "graph.json"), "utf8")) as AppGraph;
}

export function graphPath(corpusDir: string): string {
  return join(corpusDir, "graph.json");
}

function slugUse(s: string): string {
  return s
    .toLowerCase()
    .replace(/https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}
