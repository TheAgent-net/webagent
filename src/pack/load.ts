import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { compilePolicy, DEFAULT_POLICY } from "../retrieve/policy.ts";
import type { RetrievePolicy } from "../retrieve/types.ts";
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
    `You are the public assistant for ${name}${origin ? " (" + origin + ")" : ""}.`,
    "Help visitors using retrieved docs. Answer from crawled pages only.",
    "If you do not know, say so. Do not invent prices, seats, or policies.",
    "Call docs_lookup when you need a quote or URL. No product-specific interview unless the visitor asks to get set up.",
    "Keep replies short. One link when you cite a page.",
  ].join("\n");
}
