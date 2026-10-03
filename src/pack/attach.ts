import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";
import { docsLookupTool } from "./docs.ts";
import type { PackRuntime } from "./types.ts";

/**
 * Bind a pack agent. The run gets one system prompt in a fixed order:
 * pack instruction, then reply shape. Tools: docs_lookup plus the pack's own tools.
 * Visuals are not the model's job: pickVisual attaches one after the answer.
 * Pass `instruction` to try a different pack instruction (prompt tuning).
 */
export function attachAgent(h: Harness, runtime: PackRuntime, opts?: { model?: string; instruction?: string }): Run {
  const docs = docsLookupTool(runtime);
  h.addTool(docs);
  return h.create({ model: opts?.model, instruction: composePrompt(runtime, opts?.instruction), tools: [docs] });
}

/** The full system prompt for a pack run. */
export function composePrompt(runtime: PackRuntime, instruction = runtime.instruction): string {
  return [instruction.trim(), REPLY_SHAPE].filter(Boolean).join("\n\n");
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
  "- Speak about the product, not about your sources. Never say \"the docs say\", \"the docs do not specify\", \"according to the documentation\", or \"I could not find\".",
  "- State what is true. Leave out what you do not know. If the visitor needs an exact fact you do not have, offer to connect them with the team.",
].join("\n");

