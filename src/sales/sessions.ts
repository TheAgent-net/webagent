/**
 * Per-chat sessions for the Corgi sales agent.
 * Each unique session ID gets a fresh Room cloned from the lobby template.
 */
import type { Harness } from "../harness.ts";
import type { Tool } from "../tools.ts";
import { Room } from "../host/room.ts";

const CAP = 64;
const ID_OK = /^[a-zA-Z0-9_-]{1,80}$/;

export class Sessions {
  private readonly rooms = new Map<string, Room>();
  private readonly order: string[] = [];
  last: Room | undefined;
  private seq = 0;

  constructor(
    private readonly harness: Harness,
    readonly lobby: Room,
  ) {}

  open(id?: string | null): { id: string; room: Room } {
    const sid = sanitize(id) || this.nextId();
    let room = this.rooms.get(sid);
    if (!room) {
      room = cloneRoom(this.harness, this.lobby);
      this.rooms.set(sid, room);
      this.order.push(sid);
      this.evict();
    }
    this.last = room;
    return { id: sid, room };
  }

  get(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  private nextId(): string {
    return "c" + ++this.seq;
  }

  private evict(): void {
    while (this.rooms.size > CAP) {
      const old = this.order.shift();
      if (old) this.rooms.delete(old);
    }
  }
}

function cloneRoom(harness: Harness, src: Room): Room {
  const ctx = src.run.getContext();
  const instruction = ctx.find((m) => m.role === "system")?.content;
  const pins = ctx.filter((m) => m.role === "pin");
  const tools: Tool[] = src.run.tools.slice();
  const run = harness.create({
    model: src.run.getModelBinding() ?? undefined,
    instruction,
    tools,
  });
  for (const pin of pins) run.inject({ vars: pin.content });
  return new Room(harness, { run });
}

function sanitize(id?: string | null): string | undefined {
  if (!id) return undefined;
  const s = id.trim();
  return ID_OK.test(s) ? s : undefined;
}
