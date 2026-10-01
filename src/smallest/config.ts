import { join } from "node:path";
import { loadPackConfig } from "../pack/load.ts";
import type { AgentPackConfig } from "../pack/types.ts";
import type { SmallestPack } from "./types.ts";

const PACK_DIR = join(import.meta.dir, "../../packs/smallest");

export function smallestPackDir(): string {
  return PACK_DIR;
}

export function smallestAgentConfig(pack?: SmallestPack): AgentPackConfig {
  const config = loadPackConfig(PACK_DIR);
  if (pack?.starterQuestions?.length) config.widget.chips = pack.starterQuestions;
  return config;
}
