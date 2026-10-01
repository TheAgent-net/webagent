import type { Room } from "../host/room.ts";
import { agentPage } from "../widget/page.ts";
import { smallestAgentConfig } from "./config.ts";
import type { SmallestPack } from "./types.ts";

export function smallestPage(room: Room, publicUrl: string, pack: SmallestPack): Response {
  return agentPage(room, publicUrl, smallestAgentConfig(pack));
}
