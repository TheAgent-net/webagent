import type { Harness } from "../harness.ts";
import { host } from "../host/host.ts";
import { Room } from "../host/room.ts";
import { Sessions } from "../host/sessions.ts";
import { smallestAgentConfig } from "./config.ts";
import type { SmallestPack } from "./types.ts";

export function smallestHost(
  harness: Harness,
  room: Room,
  pack: SmallestPack,
  fallbackUrl = "http://127.0.0.1:8787",
  sessions?: Sessions,
): (req: Request) => Promise<Response> {
  const config = smallestAgentConfig(pack);
  return host(
    harness,
    room,
    fallbackUrl,
    {
      name: config.brand.name,
      description: config.card?.description || config.brand.tagline,
      instructions: config.card?.instructions,
    },
    sessions,
    config,
  );
}
