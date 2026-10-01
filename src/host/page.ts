import type { AgentPackConfig } from "../pack/types.ts";
import { defaultBrand, defaultWidget } from "../pack/brand.ts";
import { agentPage } from "../widget/page.ts";
import type { AgentCardMeta } from "./card.ts";
import type { Room } from "./room.ts";

export function chatPage(room: Room, publicUrl: string, meta: AgentCardMeta = {}, pack?: AgentPackConfig): Response {
  return agentPage(room, publicUrl, pack ?? metaPack(meta));
}

function metaPack(meta: AgentCardMeta): AgentPackConfig {
  const name = meta.name || "Webagent";
  const tagline = meta.description || "Public webagent. POST /chat, reuse the session.";
  const brand = defaultBrand(name, tagline);
  return {
    id: "webagent",
    origin: "",
    brand,
    widget: defaultWidget(brand),
    card: { description: meta.description, instructions: meta.instructions },
  };
}
