/**
 * GEPA prompt tuning for a pack agent.
 * - Run the real agent (pack model, pack tools) on visitor cases.
 * - Score each final reply with hard checks and a judge model.
 * - Reflect on the failures and write a new instruction.
 * - Keep candidates on a Pareto front across cases. Return the best.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Harness } from "../harness.ts";
import { openaiModel } from "../models.ts";
import { attachAgent, attachPackTools, REPLY_SHAPE, VISUAL_RULE } from "./attach.ts";
import type { PackRuntime } from "./types.ts";

/** One visitor scenario. The last turn's reply is scored. */
export interface TuneCase {
  id: string;
  turns: string[];
  /** What a good final reply does. The judge reads this. */
  goal: string;
  expect?: {
    visual?: boolean;
    calls?: string[];
    avoid?: string[];
    say?: string[];
    never?: string[];
    maxWords?: number;
    question?: boolean;
  };
}

export interface Trace {
  replies: string[];
  calls: string[];
}

export interface CaseScore {
  id: string;
  score: number;
  checks: number;
  judge: number;
  failed: string[];
  note: string;
  reply: string;
  calls: string[];
}

export interface Candidate {
  id: string;
  parent?: string;
  text: string;
  cases: CaseScore[];
  mean: number;
}

export interface TuneOpts {
  budget?: number;
  batch?: number;
  /** Model for the judge and the reflection. Default: the pack model. */
  model?: string;
  apiBase?: string;
  apiKeyEnv?: string;
  log?: (line: string) => void;
}

const TOOL_WORDS = /\b(docs_lookup|capture_intent|recommend_path|site_lookup|tool call|json)\b/i;

export function loadCases(dir: string): TuneCase[] {
  return JSON.parse(readFileSync(join(dir, "evals.json"), "utf8")) as TuneCase[];
}

/** Hard checks on the final reply. Each returns a failure name or nothing. */
export function checkReply(c: TuneCase, trace: Trace, visualIds: Set<string>): { pass: number; failed: string[] } {
  const reply = trace.replies[trace.replies.length - 1] ?? "";
  const e = c.expect ?? {};
  const failed: string[] = [];
  const rules: [string, boolean][] = [];
  const plain = reply.replace(/\[\[show:[a-z0-9-]+\]\]/gi, "").trim();
  const lead = plain.split(/\n\s*\n/)[0] ?? "";
  const words = plain.split(/\s+/).filter(Boolean).length;
  const shows = [...reply.matchAll(/\[\[show:([a-z0-9-]+)\]\]/gi)].map((m) => m[1]!);
  rules.push(["has a reply", plain.length > 0]);
  rules.push(["answer first: lead is not a heading and is 45 words or fewer", !/^#/.test(lead) && lead.split(/\s+/).length <= 45]);
  rules.push([`at most ${e.maxWords ?? 170} words`, words <= (e.maxWords ?? 170)]);
  rules.push(["at most one question", (plain.match(/\?/g) ?? []).length <= 1]);
  rules.push(["no tool names or JSON", !TOOL_WORDS.test(plain) && !/^\s*[{[]/.test(plain)]);
  rules.push(["at most one visual, with a real id", shows.length <= 1 && shows.every((id) => visualIds.has(id))]);
  if (e.visual === true) rules.push(["attaches a visual", shows.length === 1]);
  if (e.visual === false) rules.push(["attaches no visual", shows.length === 0]);
  if (e.question === true) rules.push(["asks one question back", (plain.match(/\?/g) ?? []).length === 1]);
  for (const t of e.calls ?? []) rules.push([`calls ${t}`, trace.calls.includes(t)]);
  for (const t of e.avoid ?? []) rules.push([`does not call ${t}`, !trace.calls.includes(t)]);
  for (const r of e.say ?? []) rules.push([`says /${r}/`, new RegExp(r, "i").test(plain)]);
  for (const r of e.never ?? []) rules.push([`does not say /${r}/`, !new RegExp(r, "i").test(plain)]);
  for (const [name, ok] of rules) if (!ok) failed.push(name);
  return { pass: (rules.length - failed.length) / rules.length, failed };
}

/** Candidates that are best (or tied best) on at least one case. */
export function paretoFront(pool: Candidate[]): Candidate[] {
  const ids = pool[0]?.cases.map((c) => c.id) ?? [];
  const front = new Set<Candidate>();
  for (const id of ids) {
    const best = Math.max(...pool.map((p) => p.cases.find((c) => c.id === id)?.score ?? 0));
    for (const p of pool) if ((p.cases.find((c) => c.id === id)?.score ?? 0) >= best - 1e-9) front.add(p);
  }
  return [...front];
}

/** Pick a parent from the front. A candidate that leads on more cases is picked more often. */
export function pickParent(pool: Candidate[], rand = Math.random): Candidate {
  const front = paretoFront(pool);
  const wins = front.map((p) =>
    p.cases.filter((c) => c.score >= Math.max(...pool.map((q) => q.cases.find((x) => x.id === c.id)?.score ?? 0)) - 1e-9).length,
  );
  let r = rand() * wins.reduce((a, b) => a + b, 0);
  for (let i = 0; i < front.length; i++) {
    r -= wins[i]!;
    if (r <= 0) return front[i]!;
  }
  return front[front.length - 1]!;
}

export async function tunePrompt(runtime: PackRuntime, cases: TuneCase[], opts: TuneOpts = {}): Promise<{ best: Candidate; pool: Candidate[] }> {
  const log = opts.log ?? (() => {});
  const keyEnv = opts.apiKeyEnv ?? "OPENAI_API_KEY";
  const key = process.env[keyEnv];
  if (!key) throw new Error(`tune needs ${keyEnv}: it runs the real agent and a judge model`);
  const base = (opts.apiBase || runtime.config.model?.apiBase || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const agentModel = runtime.config.model?.id || "gpt-4o-mini";
  const helper = opts.model || agentModel;
  const visualIds = new Set((runtime.config.visuals ?? []).map((v) => v.id));

  const rollout = async (text: string, c: TuneCase): Promise<Trace> => {
    const h = new Harness();
    h.addModel(
      openaiModel({ id: "tune", baseUrl: base, model: agentModel, apiKeyEnv: keyEnv, reasoningEffort: runtime.config.model?.reasoningEffort }),
    );
    const run = attachAgent(h, runtime, { model: "tune", instruction: text });
    await attachPackTools(h, run, runtime);
    const replies: string[] = [];
    for (const turn of c.turns) {
      run.inject({ text: "[human] " + turn });
      const ex = await run.start();
      replies.push(ex.lastText ?? "");
    }
    const calls = run.getContext().flatMap((m) => (m.toolCalls ?? []).map((t) => t.name));
    return { replies, calls };
  };

  const judge = async (c: TuneCase, trace: Trace): Promise<{ score: number; note: string }> => {
    const thread = c.turns.map((t, i) => `Visitor: ${t}\nAssistant: ${trace.replies[i] ?? ""}`).join("\n\n");
    const out = await complete(base, key, helper, [
      {
        role: "system",
        content: [
          "You grade the last reply of a website assistant for a product company.",
          "Score from 0 to 1. 1 means a visitor gets the main answer in the first two lines, it is correct and grounded, short, plain, and it moves them forward.",
          "Take points off for preamble, padding, sales pressure, invented facts, a wrong or useless visual, more than one question, or ignoring what the visitor said.",
          'Return JSON only: {"score": number, "note": "the biggest flaw in one sentence"}.',
        ].join("\n"),
      },
      { role: "user", content: `GOAL FOR THE LAST REPLY\n${c.goal}\n\nCONVERSATION\n${thread}` },
    ]);
    try {
      const j = JSON.parse(out.replace(/^```(json)?|```$/g, "").trim()) as { score?: number; note?: string };
      return { score: Math.max(0, Math.min(1, Number(j.score) || 0)), note: String(j.note ?? "") };
    } catch {
      return { score: 0, note: "judge returned no JSON" };
    }
  };

  const scoreCase = async (text: string, c: TuneCase): Promise<CaseScore> => {
    try {
      const trace = await rollout(text, c);
      const checks = checkReply(c, trace, visualIds);
      const j = await judge(c, trace);
      return {
        id: c.id,
        score: (checks.pass + j.score) / 2,
        checks: checks.pass,
        judge: j.score,
        failed: checks.failed,
        note: j.note,
        reply: trace.replies[trace.replies.length - 1] ?? "",
        calls: trace.calls,
      };
    } catch (err) {
      return { id: c.id, score: 0, checks: 0, judge: 0, failed: ["run failed"], note: String(err).slice(0, 200), reply: "", calls: [] };
    }
  };

  const scoreAll = (text: string, list: TuneCase[]) => pool4(list, (c) => scoreCase(text, c));
  const mean = (xs: CaseScore[]) => xs.reduce((a, b) => a + b.score, 0) / Math.max(1, xs.length);

  const seed = runtime.instruction;
  const seedCases = await scoreAll(seed, cases);
  const pool: Candidate[] = [{ id: "seed", text: seed, cases: seedCases, mean: mean(seedCases) }];
  log(`seed  mean ${pool[0]!.mean.toFixed(3)}`);

  const budget = opts.budget ?? 8;
  const size = Math.min(opts.batch ?? 4, cases.length);
  for (let i = 1; i <= budget; i++) {
    const parent = pickParent(pool);
    /* Reflect on the parent's weakest cases. */
    const weak = [...parent.cases].sort((a, b) => a.score - b.score).slice(0, size);
    const batch = weak.map((w) => cases.find((c) => c.id === w.id)!);
    const text = await reflect(base, key, helper, parent.text, weak, batch);
    if (!text || text === parent.text) continue;
    const trial = await scoreAll(text, batch);
    const before = mean(weak);
    const after = mean(trial);
    log(`gen ${i}  parent ${parent.id}  batch ${before.toFixed(3)} -> ${after.toFixed(3)}`);
    if (after <= before) continue;
    const rest = await scoreAll(text, cases.filter((c) => !batch.includes(c)));
    const all = cases.map((c) => [...trial, ...rest].find((s) => s.id === c.id)!);
    const child: Candidate = { id: "gen" + i, parent: parent.id, text, cases: all, mean: mean(all) };
    pool.push(child);
    log(`gen ${i}  kept  mean ${child.mean.toFixed(3)}`);
  }
  const best = pool.reduce((a, b) => (b.mean > a.mean ? b : a));
  return { best, pool };
}

async function reflect(base: string, key: string, model: string, text: string, weak: CaseScore[], batch: TuneCase[]): Promise<string> {
  const evidence = weak
    .map((w, i) => {
      const c = batch[i]!;
      return [
        `CASE ${c.id}`,
        `Visitor turns: ${c.turns.map((t) => JSON.stringify(t)).join(" -> ")}`,
        `Goal: ${c.goal}`,
        `Last reply: ${JSON.stringify(w.reply)}`,
        `Tools called: ${w.calls.join(", ") || "none"}`,
        `Failed checks: ${w.failed.join("; ") || "none"}`,
        `Judge (${w.judge.toFixed(2)}): ${w.note}`,
      ].join("\n");
    })
    .join("\n\n");
  const out = await complete(base, key, model, [
    {
      role: "system",
      content: [
        "You improve the instruction (system prompt) of a website assistant. Read the failures, find the rule that caused each one, and fix it.",
        "Keep every product fact that is in the current instruction. Do not invent facts.",
        "Keep behavior that already works. Remove repetition and rules that fight each other.",
        "The platform adds the two blocks below after your instruction. Do not repeat them, and do not contradict them.",
        "Write in short, plain sentences. Use headed sections and lists. Stay under 750 words.",
        "Return only the new instruction text.",
        "",
        REPLY_SHAPE,
        "",
        VISUAL_RULE,
      ].join("\n"),
    },
    { role: "user", content: `CURRENT INSTRUCTION\n<<<\n${text}\n>>>\n\nFAILURES\n${evidence}` },
  ]);
  return out.replace(/^<<<\s*|\s*>>>$/g, "").trim();
}

async function complete(base: string, key: string, model: string, messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch(base + "/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify({ model, messages }),
  });
  if (!res.ok) throw new Error(`model ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content?.trim() ?? "";
}

/** Run up to four jobs at a time. Keep input order. */
async function pool4<T, R>(items: T[], fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const lane = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]!);
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, items.length) }, lane));
  return out;
}

/** A markdown report: score per case for the seed and the best candidate, and the pool. */
export function tuneReport(pool: Candidate[], best: Candidate): string {
  const seed = pool[0]!;
  const rows = seed.cases.map((s) => {
    const b = best.cases.find((c) => c.id === s.id)!;
    return `| ${s.id} | ${s.score.toFixed(2)} | ${b.score.toFixed(2)} | ${b.failed.join("; ") || "—"} | ${b.note.replace(/\|/g, "/")} |`;
  });
  return [
    `# Prompt tuning (GEPA)`,
    ``,
    `Seed mean ${seed.mean.toFixed(3)}. Best (${best.id}) mean ${best.mean.toFixed(3)}. Pool ${pool.length} candidates.`,
    ``,
    `| Case | Seed | Best | Best: failed checks | Best: judge note |`,
    `|---|---|---|---|---|`,
    ...rows,
    ``,
    `## Pool`,
    ...pool.map((p) => `- ${p.id}${p.parent ? ` (from ${p.parent})` : ""}: mean ${p.mean.toFixed(3)}`),
  ].join("\n");
}
