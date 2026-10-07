/**
 * Bind the Composio pack as an apps agent. Public controls only.
 */
import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";
import { attachPack } from "../site/attach.ts";
import { hasCorpus, loadCorpus } from "../site/corpus.ts";
import type { SitePack } from "../site/types.ts";
import type { Tool } from "../tools.ts";
import { askApps, chunksFromPack } from "./ask.ts";
import type { TextChunk } from "./clean.ts";
import { loadGraph } from "./graph.ts";
import { appsInstruction } from "./prompt.ts";
import { CORPUS_COMPOSIO, type AppGraph } from "./types.ts";

export function attachApps(
  h: Harness,
  pack: SitePack,
  opts?: { model?: string; graph?: AppGraph; chunks?: TextChunk[] },
): Run {
  const graph = opts?.graph ?? (pack.corpusDir ? loadGraph(pack.corpusDir) : undefined);
  const chunks = opts?.chunks ?? chunksFromPack(pack);
  const run = attachPack(h, pack, { model: opts?.model, instruction: appsInstruction() });
  if (graph) {
    const rec = recommendTool(graph, chunks);
    const dbg = debugTool(graph, chunks);
    h.addTool(rec);
    h.addTool(dbg);
    run.useTool(rec);
    run.useTool(dbg);
  }
  return run;
}

export function loadAppsPack(dir = CORPUS_COMPOSIO): SitePack {
  if (!hasCorpus(dir)) throw new Error("missing Composio corpus at " + dir + ". Run bun experiment/scrape-composio.ts");
  return loadCorpus(dir);
}

function recommendTool(graph: AppGraph, chunks: TextChunk[]): Tool {
  return {
    name: "recommend_app",
    description: "Hybrid Graph RAG: rank Composio apps by kind/use, then rerank cleaned docs.",
    schema: { type: "object", properties: { request: { type: "string" } }, required: ["request"] },
    async call(args) {
      const request = String(args.request ?? "");
      const hit = askApps(graph, chunks, request, 6);
      return {
        request,
        kinds: hit.kinds,
        uses: hit.uses,
        apps: hit.apps.map((a) => ({
          slug: a.slug,
          name: a.name,
          kind: a.kind,
          auth: a.auth,
          tools: a.tools,
          why: a.why,
          url: a.url,
        })),
        docs: hit.pages.slice(0, 4).map((p) => ({
          title: p.title,
          url: p.url,
          role: p.role,
          snippet: p.snippet,
        })),
      };
    },
  };
}

function debugTool(graph: AppGraph, chunks: TextChunk[]): Tool {
  return {
    name: "debug_docs",
    description: "Hybrid Graph RAG: FAQ and cleaned snippets for an error or app slug, reranked.",
    schema: {
      type: "object",
      properties: { error: { type: "string" }, app: { type: "string" } },
      required: ["error"],
    },
    async call(args) {
      const error = String(args.error ?? "");
      const app = String(args.app ?? "");
      const q = [error, app].filter(Boolean).join(" ");
      const hit = askApps(graph, chunks, q, 8);
      const faqs = hit.pages.filter((p) => p.role === "faq" || p.role === "debug" || p.role === "auth");
      return {
        error,
        app,
        faqs: (faqs.length ? faqs : hit.pages).slice(0, 5),
        docs: hit.pages.slice(0, 4).map((p) => ({ title: p.title, url: p.url, role: p.role, snippet: p.snippet })),
      };
    },
  };
}
