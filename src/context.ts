import type { ToolCall } from "./assembler.ts";

/** Copy-on-write message log. Forks share the spine until a write. */

export interface Message {
  role: "system" | "user" | "assistant" | "tool" | "pin";
  content: string;
  toolCallId?: string;
  toolCalls?: ToolCall[];
}

export class Context {
  private frames: Message[];
  private shared: boolean;

  constructor(frames: Message[] = [], shared = false) {
    this.frames = frames;
    this.shared = shared;
  }

  get length(): number {
    return this.frames.length;
  }

  /** Zero-copy view. Do not mutate the returned array. */
  view(): readonly Message[] {
    return this.frames;
  }

  append(m: Message): void {
    if (this.shared) {
      this.frames = this.frames.slice();
      this.shared = false;
    }
    this.frames.push(m);
  }

  appendMany(ms: Message[]): void {
    if (ms.length === 0) return;
    if (this.shared) {
      this.frames = this.frames.slice();
      this.shared = false;
    }
    for (let i = 0; i < ms.length; i++) this.frames.push(ms[i]!);
  }

  /** Child shares the same array until either side writes. */
  fork(): Context {
    this.shared = true;
    return new Context(this.frames, true);
  }

  /** Append only frames this context does not already hold by identity. */
  absorb(other: Context): void {
    const mine = this.frames;
    const theirs = other.frames;
    let i = 0;
    const n = mine.length < theirs.length ? mine.length : theirs.length;
    while (i < n && mine[i] === theirs[i]) i++;
    if (i >= theirs.length) return;
    const have = new Set<Message>(mine);
    const extra: Message[] = [];
    for (; i < theirs.length; i++) {
      const frame = theirs[i]!;
      if (have.has(frame)) continue;
      extra.push(frame);
      have.add(frame);
    }
    if (extra.length) this.appendMany(extra);
  }
}
