/** Copy-on-write message log. Forks share the spine until a write. */

export interface AssistantToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface Message {
  role: "system" | "user" | "assistant" | "tool" | "pin";
  content: string;
  toolCallId?: string;
  /** Present on assistant frames that requested tools. Required for OpenAI follow-up. */
  toolCalls?: AssistantToolCall[];
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

  /** Append source frames into this context (merge). */
  absorb(other: Context): void {
    this.appendMany(other.frames);
  }
}
