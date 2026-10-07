import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { compilePolicy, DEFAULT_POLICY } from "../retrieve/policy.ts";
import type { RetrievePolicy } from "../retrieve/types.ts";
import type { Visual } from "../site/visual.ts";
import type { AgentPackConfig } from "./types.ts";

export function resolvePackDir(input: string): string {
  const abs = resolve(input);
  if (existsSync(join(abs, "pack.json"))) return abs;
  if (existsSync(abs) && abs.endsWith("pack.json")) return resolve(abs, "..");
  const named = resolve(process.cwd(), "packs", input);
  if (existsSync(join(named, "pack.json"))) return named;
  throw new Error("pack not found: " + input);
}

export function loadPackConfig(dir: string): AgentPackConfig {
  const root = resolvePackDir(dir);
  const raw = JSON.parse(readFileSync(join(root, "pack.json"), "utf8")) as AgentPackConfig;
  if (!raw.id || !raw.origin || !raw.brand) throw new Error("pack.json missing id, origin, or brand");
  raw.dir = root;
  const visuals = join(root, "visuals.json");
  if (existsSync(visuals)) raw.visuals = JSON.parse(readFileSync(visuals, "utf8")) as Visual[];
  return raw;
}

export function loadInstruction(dir: string, config?: AgentPackConfig): string {
  const root = resolvePackDir(dir);
  const md = join(root, "instruction.md");
  if (existsSync(md)) return readFileSync(md, "utf8").trim();
  if (config?.sales?.instruction) return config.sales.instruction;
  return defaultInstruction(config);
}

export function packPolicy(config: AgentPackConfig): RetrievePolicy {
  return config.retrieve ? compilePolicy(config.retrieve) : DEFAULT_POLICY;
}

export function defaultInstruction(config?: AgentPackConfig): string {
  const name = config?.brand.name || "this site";
  const origin = config?.origin || "";
  return [
    `You are the assistant on the ${name} website${origin ? " (" + origin + ")" : ""}. You help one visitor understand ${name} and get started.`,
    "",
    "## How to work",
    "- A question about the product: call docs_lookup, then answer from what it returns. Do not interview.",
    "- A visitor who wants to get set up: ask one question at a time until you know what they need, then give 3-5 numbered steps.",
    "- A greeting with no question: one short sentence on how you help, then one open question about what they want to do.",
    "- Never ask again for something the visitor already said.",
    "",
    "## Grounding",
    "- Use only docs_lookup results. Never guess. Never invent prices, numbers, customers, or features.",
    "- Answer with what is known. If they need an exact fact you do not have, offer to connect them with the team.",
    "- At most one link per reply, and only a link that docs_lookup returned. No tool names, no JSON.",
    "- Keep replies under 170 words.",
  ].join("\n");
}
