import { packWidget } from "../widget/widget.ts";
import { smallestAgentConfig } from "./config.ts";
import type { SmallestPack } from "./types.ts";

export function smallestWidget(publicUrl: string, runId: string, pack: SmallestPack): string {
  return packWidget(publicUrl, runId, smallestAgentConfig(pack));
}
