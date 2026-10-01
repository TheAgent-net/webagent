import type { Harness } from "../../src/harness.ts";
import type { Run } from "../../src/run.ts";
import type { PackRuntime } from "../../src/pack/types.ts";
import { captureIntentTool, docsLookupTool, recommendSettingsTool } from "../../src/smallest/attach.ts";
import type { SmallestPack } from "../../src/smallest/types.ts";

export function attach(h: Harness, run: Run, runtime: PackRuntime): void {
  const pack = asSmallest(runtime);
  const capture = captureIntentTool();
  const rec = recommendSettingsTool();
  const docs = docsLookupTool(pack);
  h.addTool(capture);
  h.addTool(rec);
  h.addTool(docs);
  run.useTool(capture);
  run.useTool(rec);
  run.useTool(docs);
  run.inject({
    vars: [
      "You are the Smallest assistant. Lead with Smallest's own agent stack (Atoms).",
      "If they asked about Smallest, answer it. Do not start a use-case interview on a product question.",
      "Explore the visitor first when they want a setup. Do not dump products or a company brief.",
      "Greeting only: two short sentences on how you can help, then one open question about them.",
      "If they mention Pipecat or LiveKit, do not start there. Atoms first. That stack is only if they must keep it.",
      "Docs at " + pack.docsOrigin + ". Retrieval: " + (pack.retrieval?.mode ?? "lexical") + ", " + (pack.chunks?.length ?? 0) + " chunks. docs_lookup Atoms/platform first.",
    ].join("\n"),
  });
}

function asSmallest(runtime: PackRuntime): SmallestPack {
  const docs = runtime.pages.filter((p) => /docs\./i.test(p.url) || p.url.includes("/llms.txt"));
  const marketing = runtime.pages.filter((p) => !docs.includes(p));
  return {
    origin: runtime.config.origin,
    docsOrigin: runtime.config.docs?.origin || runtime.config.origin,
    site: runtime.site,
    pages: runtime.pages,
    marketing,
    docs,
    chunks: runtime.chunks,
    retrieval: runtime.retrieval,
    embedQuery: runtime.embedQuery,
    facts: runtime.site.facts,
    starterQuestions: runtime.config.widget.chips,
  };
}
