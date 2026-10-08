/**
 * One fresh Room per chat. The lobby run is a template (instruction, tools, pins).
 * User/assistant/tool turns are not copied.
 */
import type { Message } from "../context.ts";
import type { Harness } from "../harness.ts";
import type { Tool } from "../tools.ts";
import { RUNNING } from "../state.ts";
import { Room } from "./room.ts";

/** Most rooms kept in memory. Set `WEBAGENT_ROOM_CAP` to change it. */
const CAP = 512;
const ID_OK = /^[a-zA-Z0-9_-]{1,80}$/;

export class Sessions {
  /** Map order is use order: the first key is the least recently used room. */
  private readonly rooms = new Map<string, Room>();
  private readonly cap: number;
  last: Room | undefined;
  private seq = 0;

  /**
   * @param restore Earlier messages for a session id that is not in memory (for example after a restart).
   */
  constructor(
    private readonly harness: Harness,
    readonly lobby: Room,
    private readonly restore?: (id: string) => Message[],
    cap?: number,
  ) {
    this.cap = Math.max(1, cap ?? (Number(process.env.WEBAGENT_ROOM_CAP) || CAP));
  }

  /** Reuse id if this chat already exists; otherwise start a new context. */
  open(id?: string | null): { id: string; room: Room } {
    const sid = sanitize(id) || this.nextId();
    let room = this.rooms.get(sid);
    if (room) {
      this.rooms.delete(sid);
      this.rooms.set(sid, room);
    } else {
      room = cloneRoom(this.harness, this.lobby);
      const old = this.restore?.(sid);
      if (old?.length) room.run.inject({ messages: old });
      this.rooms.set(sid, room);
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

  /** Number of rooms in memory. */
  get size(): number {
    return this.rooms.size;
  }

  /** Drop the least recently used rooms past the cap. Remove their runs from the harness. Keep busy rooms. */
  private evict(): void {
    let tries = this.rooms.size;
    while (this.rooms.size > this.cap && tries-- > 0) {
      const [old, room] = this.rooms.entries().next().value as [string, Room];
      this.rooms.delete(old);
      if (room.run.state === RUNNING) {
        this.rooms.set(old, room);
        continue;
      }
      if (this.last === room) this.last = undefined;
      this.harness.remove(room.run.id);
    }
  }
}

export function cloneRoom(harness: Harness, src: Room): Room {
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
  return new Room(harness, { run, finish: src.finish });
}

function sanitize(id?: string | null): string | undefined {
  if (!id) return undefined;
  const s = id.trim();
  return ID_OK.test(s) ? s : undefined;
}
