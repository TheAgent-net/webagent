/**
 * One fresh Room per chat. The lobby run is a template (instruction, tools, pins).
 * User/assistant/tool turns are not copied.
 */
import type { Harness } from "../harness.ts";
import type { Tool } from "../tools.ts";
import { Room } from "./room.ts";

const CAP = 64;
const ID_OK = /^[a-zA-Z0-9_-]{1,80}$/;
/** New caller-chosen ids must be unguessable. MCP mints s1, s2, … */
const STRONG_ID = /^[a-zA-Z0-9_-]{16,80}$/;
const MCP_SEQ = /^s\d+$/;

export const SESSION_COOKIE = "wa_session";

export class Sessions {
  private readonly rooms = new Map<string, Room>();
  private readonly order: string[] = [];
  last: Room | undefined;

  constructor(
    private readonly harness: Harness,
    readonly lobby: Room,
  ) {}

  /** Reuse a known chat. New rooms get a 128-bit id unless the caller sent a strong one. */
  open(id?: string | null): { id: string; room: Room } {
    const asked = sanitize(id);
    if (asked && this.rooms.has(asked)) {
      const room = this.rooms.get(asked)!;
      this.last = room;
      return { id: asked, room };
    }
    const sid = asked && isStrongId(asked) ? asked : this.nextId();
    const room = cloneRoom(this.harness, this.lobby);
    this.rooms.set(sid, room);
    this.order.push(sid);
    this.evict();
    this.last = room;
    return { id: sid, room };
  }

  /** Card/discovery: resume a known session, never adopt an attacker-chosen new id. */
  knownOrMint(id?: string | null): { id: string; room: Room } {
    const sid = sanitize(id);
    if (sid && this.rooms.has(sid)) return this.open(sid);
    return this.open();
  }

  get(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  private nextId(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    let hex = "";
    for (const b of bytes) hex += b.toString(16).padStart(2, "0");
    return "c" + hex;
  }

  private evict(): void {
    while (this.rooms.size > CAP) {
      const old = this.order.shift();
      if (old) this.rooms.delete(old);
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
  return new Room(harness, { run });
}

export function sanitize(id?: string | null): string | undefined {
  if (!id) return undefined;
  const s = id.trim();
  return ID_OK.test(s) ? s : undefined;
}

function isStrongId(id: string): boolean {
  return STRONG_ID.test(id) && !MCP_SEQ.test(id);
}

/** Body, then query (unless opts.query is false), then X-Session-Id, then wa_session cookie.
 *  MCP session ids are not chat rooms. */
export function readSessionId(
  req: Request,
  bodySession?: string | null,
  opts: { query?: boolean } = {},
): string | undefined {
  const fromBody = sanitize(bodySession);
  if (fromBody) return fromBody;
  if (opts.query !== false) {
    try {
      const fromQuery = sanitize(new URL(req.url).searchParams.get("session"));
      if (fromQuery) return fromQuery;
    } catch {
      /* ignore */
    }
  }
  const fromHeader = sanitize(req.headers.get("x-session-id"));
  if (fromHeader) return fromHeader;
  return sanitize(cookieValue(req, SESSION_COOKIE));
}

export function sessionCookie(id: string): string {
  return `${SESSION_COOKIE}=${id}; Path=/; SameSite=Lax`;
}

function cookieValue(req: Request, name: string): string | undefined {
  const raw = req.headers.get("cookie") ?? "";
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) {
      try {
        return decodeURIComponent(rest.join("="));
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}
