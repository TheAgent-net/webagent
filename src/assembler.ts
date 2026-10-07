/**
 * One assembler per reason step.
 * Tokens are pushed as chunks (no mid-stream parse).
 * Tool JSON is parsed once at end().
 */

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface Assembled {
  text: string;
  toolCalls: ToolCall[];
}

interface Slot {
  id: string;
  name: string;
  /** Raw argument fragments — joined once. */
  args: string[];
  argsLen: number;
}

export class Assembler {
  private readonly textChunks: string[] = [];
  private textLen = 0;
  private readonly slots = new Map<number, Slot>();
  private done = false;

  pushText(chunk: string): void {
    if (this.done || !chunk) return;
    this.textChunks.push(chunk);
    this.textLen += chunk.length;
  }

  pushToolDelta(index: number, id?: string, name?: string, args?: string): void {
    if (this.done) return;
    let s = this.slots.get(index);
    if (!s) {
      s = { id: "", name: "", args: [], argsLen: 0 };
      this.slots.set(index, s);
    }
    if (id) s.id = id;
    if (name) s.name += name;
    if (args) {
      s.args.push(args);
      s.argsLen += args.length;
    }
  }

  /** End of this model step. Only place that JSON.parse's tool arguments. */
  end(): Assembled {
    this.done = true;
    const text = this.textLen ? this.textChunks.join("") : "";
    if (this.slots.size === 0) return { text, toolCalls: [] };

    const keys: number[] = [];
    for (const k of this.slots.keys()) keys.push(k);
    keys.sort((a, b) => a - b);

    const toolCalls: ToolCall[] = new Array(keys.length);
    for (let i = 0; i < keys.length; i++) {
      const s = this.slots.get(keys[i]!)!;
      toolCalls[i] = { id: s.id, name: s.name, arguments: parseOnce(s.args, s.argsLen) };
    }
    return { text, toolCalls };
  }
}

function parseOnce(parts: string[], len: number): Record<string, unknown> {
  if (len === 0) return EMPTY;
  const raw = parts.length === 1 ? parts[0]! : parts.join("");
  const t = raw.trim();
  if (!t) return EMPTY;
  try {
    const v = JSON.parse(t) as unknown;
    return v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : EMPTY;
  } catch {
    return EMPTY;
  }
}

const EMPTY: Record<string, unknown> = Object.freeze({});
