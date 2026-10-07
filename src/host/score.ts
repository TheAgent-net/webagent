/**
 * Score: is the agent on the other side of a conversation intelligent, or a script?
 *
 * Steps for each agent conversation (kind is not `human`):
 * 1. Read the stored turns. Compute features (see `Features`).
 * 2. Get a rule score from the features.
 * 3. Optional: ask an LLM judge. It needs `OPENAI_API_KEY`. Without the key, skip it.
 * 4. Write `score` (0..1) and `label` (`intelligent`, `script`, or `unclear`).
 *
 * Human conversations get the label `human`.
 */
import type { Conversation, Store, Turn } from "../store/store.ts";
import type { Fetch } from "./verify.ts";

export type Label = "intelligent" | "script" | "unclear" | "human";

export interface Features {
  turns: number;
  /** Share of later turns that reuse words from the reply before them. */
  follow: number;
  /** Distinct questions over all questions. */
  distinct: number;
  /** Share of questions that also come in other conversations of the same tenant. */
  repeat: number;
  /** Median gap between a reply and the next question, in milliseconds. -1 when there is no gap. */
  gap: number;
  /** Spread of the gaps (coefficient of variation). Near 0 means exact intervals. */
  gapSpread: number;
  /** Timing class: `none`, `instant` (under 1 s), `exact` (same interval each time), `model` (seconds), `slow`. */
  timing: "none" | "instant" | "exact" | "model" | "slow";
}

/** Short words that carry no meaning for overlap. */
const STOP = new Set(
  "the and for are but not you your with this that what when where which who how can does did have has from into about there their they them then than our out was were will would could should just also more most some any all its it's may might each very".split(
    " ",
  ),
);

/** Content words of a text. Lower case, four letters or more, no stop words. */
export function getWords(text: string): Set<string> {
  const out = new Set<string>();
  for (const w of text.toLowerCase().match(/[\p{L}\p{N}]{4,}/gu) ?? []) {
    if (!STOP.has(w)) out.add(w);
  }
  return out;
}

/** Same text, simple form, for repeat checks. */
export function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").replace(/[^\p{L}\p{N} ]/gu, "").trim();
}

/** True when the question reuses at least two content words of the reply before it, and they are new words. */
function follows(said: string, reply: string, earlier: Set<string>): boolean {
  const asked = getWords(said);
  let shared = 0;
  for (const w of getWords(reply)) {
    if (asked.has(w) && !earlier.has(w)) shared++;
  }
  return shared >= 2 || (shared >= 1 && asked.size <= 4);
}

const median = (xs: number[]) => {
  if (!xs.length) return -1;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
};

function getGapSpread(xs: number[]): number {
  if (xs.length < 2) return 1;
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  if (m <= 0) return 0;
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / xs.length) / m;
}

/**
 * Compute features from the turns of one conversation.
 * @param seen Normalized question → count of other conversations in the tenant that asked it.
 */
export function getFeatures(turns: Turn[], seen: Map<string, number> = new Map()): Features {
  const n = turns.length;
  let followN = 0;
  const asked = new Set<string>();
  for (let i = 1; i < n; i++) {
    for (const w of getWords(turns[i - 1]!.said)) asked.add(w);
    if (follows(turns[i]!.said, turns[i - 1]!.reply, asked)) followN++;
  }
  const questions = turns.map((t) => normalize(t.said));
  const distinct = n ? new Set(questions).size / n : 0;
  const repeat = n ? questions.filter((q) => q && (seen.get(q) ?? 0) > 0).length / n : 0;
  const gaps: number[] = [];
  for (let i = 1; i < n; i++) {
    const prev = turns[i - 1]!;
    gaps.push(Math.max(0, turns[i]!.at - (prev.at + prev.ms)));
  }
  const gap = median(gaps);
  const gapSpread = getGapSpread(gaps);
  let timing: Features["timing"] = "none";
  if (gaps.length) {
    if (gap < 1000) timing = "instant";
    else if (gaps.length >= 3 && gapSpread < 0.05) timing = "exact";
    else if (gap <= 5 * 60 * 1000) timing = "model";
    else timing = "slow";
  }
  return {
    turns: n,
    follow: n > 1 ? followN / (n - 1) : 0,
    distinct,
    repeat,
    gap,
    gapSpread: Math.round(gapSpread * 1000) / 1000,
    timing,
  };
}

/** Rule score, 0..1, from the features alone. */
export function scoreRules(f: Features): number {
  let s = 0.5;
  if (f.turns <= 1) s -= 0.1;
  s += 0.35 * f.follow;
  if (f.turns > 1 && f.distinct < 0.6) s -= 0.3;
  if (f.repeat >= 0.5) s -= 0.25;
  if (f.timing === "instant") s -= 0.25;
  if (f.timing === "exact") s -= 0.25;
  if (f.timing === "model") s += 0.1;
  return Math.max(0, Math.min(1, Math.round(s * 100) / 100));
}

export function getLabel(score: number): Label {
  if (score >= 0.65) return "intelligent";
  if (score <= 0.35) return "script";
  return "unclear";
}

export interface Verdict {
  intelligent: boolean;
  reason: string;
}

export interface JudgeOpts {
  apiKey?: string;
  model?: string;
  fetch?: Fetch;
  timeoutMs?: number;
}

/** Ask an LLM judge. Undefined without a key, on a timeout, or on bad output. */
export async function judgeTurns(turns: Turn[], opts: JudgeOpts = {}): Promise<Verdict | undefined> {
  const key = opts.apiKey ?? process.env.OPENAI_API_KEY;
  if (!key || !turns.length) return undefined;
  const model = opts.model ?? process.env.WEBAGENT_SCORE_MODEL ?? "gpt-5.6-luna";
  const log = turns
    .slice(0, 20)
    .map((t, i) => `#${i + 1} +${t.at - turns[0]!.at}ms\nVISITOR: ${t.said.slice(0, 600)}\nSITE AGENT: ${t.reply.slice(0, 600)}`)
    .join("\n\n");
  try {
    const res = await (opts.fetch ?? fetch)("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(opts.timeoutMs ?? 15_000),
      headers: { "content-type": "application/json", authorization: "Bearer " + key },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You read a chat between a website agent and a visitor that is software. " +
              "Decide if the visitor is an intelligent agent (an LLM that reads replies and adapts) or a script (fixed payloads, no use of replies). " +
              'Answer only JSON: {"intelligent": true|false, "reason": "<one short sentence>"}.',
          },
          { role: "user", content: log },
        ],
      }),
    });
    if (!res.ok) return undefined;
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const out = JSON.parse(body.choices?.[0]?.message?.content ?? "") as { intelligent?: unknown; reason?: unknown };
    if (typeof out.intelligent !== "boolean") return undefined;
    return { intelligent: out.intelligent, reason: String(out.reason ?? "").slice(0, 300) };
  } catch {
    return undefined;
  }
}

export interface ScoreOpts {
  /** Score a conversation only after it is idle this long. Default 10 minutes. */
  idleMinutes?: number;
  /** Most conversations to score in one pass. Default 100. */
  limit?: number;
  /** `false` skips the judge. An object sets judge options. */
  judge?: JudgeOpts | false;
  now?: number;
}

export interface Scored {
  id: string;
  score: number;
  label: Label;
  features?: Features;
  reason?: string;
}

/** Score one conversation and store the result. */
export async function scoreConversation(
  store: Store,
  c: Conversation,
  seen: Map<string, number> = new Map(),
  judge: JudgeOpts | false = {},
): Promise<Scored> {
  if (c.kind === "human") {
    store.updateConversation(c.id, { score: 0, label: "human" });
    return { id: c.id, score: 0, label: "human" };
  }
  const turns = store.listTurns(c.id);
  const features = getFeatures(turns, seen);
  let score = scoreRules(features);
  const verdict = judge === false ? undefined : await judgeTurns(turns, judge);
  if (verdict) score = Math.round((0.4 * score + 0.6 * (verdict.intelligent ? 1 : 0)) * 100) / 100;
  const label = getLabel(score);
  store.updateConversation(c.id, { score, label });
  return { id: c.id, score, label, features, reason: verdict?.reason };
}

/** Count how many other conversations asked each question. Read the newest conversations of the tenant. */
function indexQuestions(store: Store, recent: Conversation[]): Map<string, Set<string>> {
  const index = new Map<string, Set<string>>();
  for (const c of recent) {
    if (c.kind === "human") continue;
    for (const t of store.listTurns(c.id)) {
      const q = normalize(t.said);
      if (!q) continue;
      const ids = index.get(q) ?? new Set<string>();
      ids.add(c.id);
      index.set(q, ids);
    }
  }
  return index;
}

/** Score the conversations of one tenant that are idle and have no label. */
export async function scoreConversations(store: Store, tenant: string, opts: ScoreOpts = {}): Promise<Scored[]> {
  const now = opts.now ?? Date.now();
  const idle = (opts.idleMinutes ?? 10) * 60 * 1000;
  const recent = store.listConversations(tenant, { limit: 500 });
  const todo = recent.filter((c) => !c.label && c.turns > 0 && c.updated <= now - idle).slice(0, opts.limit ?? 100);
  if (!todo.length) return [];
  const index = indexQuestions(store, recent);
  const out: Scored[] = [];
  for (const c of todo) {
    const seen = new Map<string, number>();
    for (const [q, ids] of index) seen.set(q, ids.size - (ids.has(c.id) ? 1 : 0));
    try {
      out.push(await scoreConversation(store, c, seen, opts.judge ?? {}));
    } catch (err) {
      console.error("score failed:", err instanceof Error ? err.message : err);
    }
  }
  return out;
}

/**
 * Score every tenant in the background, once per `everyMs`. Return a stop function.
 * @param tenants A list of tenant ids, or a function that returns it (for example `() => tenants.list().map((t) => t.id)`).
 */
export function startScoring(
  store: Store,
  tenants: string[] | (() => string[]),
  everyMs = 5 * 60 * 1000,
  opts: ScoreOpts = {},
): () => void {
  let busy = false;
  const run = async () => {
    if (busy) return;
    busy = true;
    try {
      for (const id of typeof tenants === "function" ? tenants() : tenants) {
        await scoreConversations(store, id, opts);
      }
    } catch (err) {
      console.error("scoring failed:", err instanceof Error ? err.message : err);
    } finally {
      busy = false;
    }
  };
  const timer = setInterval(() => void run(), everyMs);
  (timer as { unref?: () => void }).unref?.();
  return () => clearInterval(timer);
}
