import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";
import { attachPack } from "../site/attach.ts";
import { docsLookupTool } from "./docs.ts";
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
