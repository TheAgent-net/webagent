import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";
import { attachPack } from "../site/attach.ts";
import { docsLookupTool } from "./docs.ts";
import { listVisualLines, type Visual } from "../site/visual.ts";
import type { PackRuntime } from "./types.ts";

export function attachAgent(h: Harness, runtime: PackRuntime, opts?: { model?: string }): Run {
  const run = attachPack(h, runtime.site, { model: opts?.model, instruction: runtime.instruction });
  const docs = docsLookupTool(runtime);
  h.addTool(docs);
  run.useTool(docs);
  run.inject({
    vars: [
      "You are the " + runtime.config.brand.name + " assistant.",
      "Docs at " + (runtime.config.docs?.origin || runtime.config.origin) + ".",
      "Retrieval: " + (runtime.retrieval?.mode ?? "lexical") + ", " + runtime.chunks.length + " chunks.",
      "Call docs_lookup for a quote or URL.",
    ].join("\n"),
  });
  run.inject({ vars: REPLY_SHAPE });
  const visuals = runtime.config.visuals ?? [];
  if (visuals.length) run.inject({ vars: visualVars(visuals) });
  return run;
}

export async function attachPackTools(h: Harness, run: Run, runtime: PackRuntime): Promise<void> {
  const names = runtime.config.tools?.length ? runtime.config.tools : existsSync(join(runtime.dir, "tools.ts")) ? ["tools.ts"] : [];
  for (const name of names) {
    const file = name.endsWith(".ts") || name.endsWith(".js") ? name : name + ".ts";
    const path = resolve(runtime.dir, file);
    if (!existsSync(path)) continue;
    const mod = (await import(pathToFileURL(path).href)) as {
      attach?: (h: Harness, run: Run, runtime: PackRuntime) => void | Promise<void>;
    };
    if (typeof mod.attach === "function") await mod.attach(h, run, runtime);
  }
}

/** How a reply must read. The widget shows the first paragraph as the answer. */
export const REPLY_SHAPE = [
  "REPLY SHAPE",
  "- Put the direct answer in the first paragraph: one or two short sentences. No preamble. Do not start with a heading.",
  "- Then add detail only if it helps: at most 3 short bullets, or 3-5 numbered steps for a setup.",
  "- Use plain words. One idea per sentence. Bold only the one key term.",
  "- A greeting or a question back to the visitor is one short paragraph.",
].join("\n");

/** Tell the model which site visuals it can attach, and how. */
export function visualVars(visuals: Visual[]): string {
  return [
    "VISUALS FROM THE SITE",
    "You can attach one visual when it shows the answer better than words: a chart, a diagram, a table, or a section.",
    "To attach it, write [[show:ID]] on its own line after the first paragraph. Use at most one per reply.",
    "Do not attach a visual to a greeting, a question back, or when no visual matches. Never invent an ID.",
    listVisualLines(visuals),
  ].join("\n");
}
