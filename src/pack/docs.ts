import { join } from "node:path";
import { cosine, defaultQueryEmbed, fillVectors, type EmbedFn } from "../retrieve/embed.ts";
import { expandQuery, searchHits, searchHitsHybrid } from "../retrieve/search.ts";
import type { RetrievePolicy } from "../retrieve/types.ts";
import { describeVisual, findVisuals, type Visual } from "../site/visual.ts";
import type { Tool } from "../tools.ts";
import type { PackRuntime } from "./types.ts";

export function docsLookupTool(runtime: PackRuntime, hint?: string): Tool {
  const policy: RetrievePolicy = runtime.policy;
  return {
    name: "docs_lookup",
    description:
      "Hybrid search over crawled pages (BM25 + embeddings when available). Returns the best sections with URLs. Use for a quote or an implementation detail.",
    schema: {
      type: "object",
      properties: {
        query: { type: "string" },
        focus: { type: "string" },
      },
      required: ["query"],
    },
    async call(args) {
      const query = String(args.query ?? "").trim();
      const focus = typeof args.focus === "string" ? args.focus : undefined;
      const hybrid = runtime.chunks.some((c) => c.vector?.length);
      const embed = packEmbedder(runtime);
      const corpus = { origin: runtime.config.origin, pages: runtime.pages, chunks: runtime.chunks };
      const hits = hybrid
        ? await searchHitsHybrid(corpus, query, embed, policy, { focus, limit: 4 })
        : searchHits(corpus, query, policy, { focus, limit: 4 });
      const expanded = expandQuery(query, policy);
      return {
        query,
        expanded,
        hits,
        source: hybrid ? "hybrid" : "lexical",
        model: runtime.retrieval?.model,
        hint:
          hint ??
          (hits.length
            ? "Quote only the snippets. Cite one URL."
            : "No matching page in the pack. Do not invent a URL or setting."),
      };
    },
  };
}

/** Cosine floor for a visual to be a candidate. A judge makes the final call. */
export const VISUAL_FLOOR = 0.25;

/**
 * Find visuals by meaning: embed the question and compare it with each visual's description.
 * Without embeddings, fall back to word ranking. Each candidate carries what it shows, so the model can judge.
 */
export async function relevantVisuals(
  runtime: PackRuntime,
  topic: string,
  expanded: string[],
  embed?: EmbedFn,
): Promise<{ id: string; kind: string; label: string; shows: string; page: string; relevance?: number }[]> {
  const visuals = runtime.config.visuals ?? [];
  if (!visuals.length || !topic.trim()) return [];
  const shape = (v: Visual, relevance?: number) => ({
    id: v.id,
    kind: v.kind,
    label: v.label,
    shows: describeVisual(v, runtime.config.dir, 240),
    page: v.page,
    ...(relevance === undefined ? {} : { relevance: Math.round(relevance * 100) / 100 }),
  });
  const vectors = runtime.visualVectors;
  if (vectors?.size && embed) {
    try {
      const [q] = await embed([topic]);
      if (q?.length) {
        return visuals
          .map((v) => ({ v, score: vectors.has(v.id) ? cosine(q, vectors.get(v.id)!) : 0 }))
          .filter((x) => x.score >= VISUAL_FLOOR)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((x) => shape(x.v, x.score));
      }
    } catch {
      /* fall through to word ranking */
    }
  }
  return findVisuals(visuals, topic, expanded).map((v) => shape(v));
}

/** Embed every visual description once at start. Reuse the cache across restarts. */
export async function embedVisuals(runtime: PackRuntime, embed?: EmbedFn | false): Promise<number> {
  const visuals = runtime.config.visuals ?? [];
  if (!visuals.length || embed === false) return 0;
  const items = visuals.map((v) => ({
    id: "visual:" + v.id,
    kind: "visual",
    title: v.label,
    section: v.label,
    url: new URL(v.page, runtime.config.origin + "/").href,
    text: describeVisual(v, runtime.config.dir),
    vector: undefined as number[] | undefined,
  }));
  const got = await fillVectors(items as never, {
    embed: embed || undefined,
    cachePath: join(process.cwd(), `.retrieve-cache-visuals-${runtime.config.id}.json`),
  });
  if (!got.embedded) return 0;
  runtime.visualVectors = new Map(items.filter((x) => x.vector?.length).map((x) => [x.id.slice(7), x.vector!]));
  return runtime.visualVectors.size;
}

function packEmbedder(runtime: PackRuntime): EmbedFn | undefined {
  if (runtime.embedQuery) return runtime.embedQuery;
  if (runtime.retrieval?.mode !== "hybrid") return undefined;
  return defaultQueryEmbed();
}

/** The answer text the visitor sees first: lead paragraph plus the next block, without tags. */
function answerLead(reply: string): string {
  return reply
    .replace(/\[\[show:[a-z0-9-]+\]\]/gi, "")
    .split(/\n\s*\n/)
    .slice(0, 2)
    .join("\n")
    .replace(/[*_`#>]/g, "")
    .slice(0, 600);
}

/** Put a visual tag after the first paragraph. */
export function insertShow(reply: string, id: string): string {
  const parts = reply.split(/\n\s*\n/);
  parts.splice(1, 0, `[[show:${id}]]`);
  return parts.join("\n\n");
}

export interface PickOpts {
  embed?: EmbedFn;
  /** Answers yes or no on candidates. Default: an OpenAI chat model. */
  judge?: (prompt: string) => Promise<string>;
}

/**
 * After the answer is written, attach the one visual that shows what it explains, or none.
 * 1. Find candidates by meaning: the question plus the answer's lead, against each visual's description.
 * 2. A judge reads the question, the answer, and what each candidate shows, and picks one or none.
 */
export async function pickVisual(runtime: PackRuntime, said: string, reply: string, opts: PickOpts = {}): Promise<string> {
  const visuals = runtime.config.visuals ?? [];
  if (!visuals.length || /\[\[show:/i.test(reply)) return reply;
  const lead = answerLead(reply);
  /* A question back or a one-line reply does not need a visual. */
  if (lead.length < 80 || (/\?\s*$/.test(lead.trim()) && lead.length < 240)) return reply;
  const brand = runtime.config.brand.name.replace(/[^a-z0-9]+/gi, " ").trim();
  const strip = (t: string) => (brand ? t.replace(new RegExp(`\\b${brand.split(" ").join("\\s*")}\\b`, "gi"), " ") : t);
  const topic = strip(said + "\n" + lead);
  const candidates = await relevantVisuals(runtime, topic, expandQuery(strip(said), runtime.policy), opts.embed ?? packEmbedder(runtime));
  if (!candidates.length) return reply;
  const list = candidates.map((c, i) => `${i + 1}. id=${c.id} (${c.kind}) "${c.label}" shows: ${c.shows}`).join("\n");
  const prompt = [
    "A visitor asked a website assistant a question. Pick the one site visual that directly shows what the answer explains, so the visitor gets it faster than from text.",
    "Pick none when no candidate shows the same thing as the answer. A shared word is not enough.",
    'Return JSON only: {"id": "<candidate id>"} or {"id": null}.',
    "",
    `QUESTION: ${said}`,
    `ANSWER: ${lead}`,
    "CANDIDATES:",
    list,
  ].join("\n");
  try {
    const judge = opts.judge ?? openaiJudge(runtime);
    if (!judge) return reply;
    const out = await judge(prompt);
    const id = (JSON.parse(out.replace(/^```(json)?|```$/g, "").trim()) as { id?: string | null }).id;
    return id && candidates.some((c) => c.id === id) ? insertShow(reply, id) : reply;
  } catch {
    return reply;
  }
}

/** The pack model checks if a visual fits. Pack model.visualJudge overrides it. */
function openaiJudge(runtime: PackRuntime): ((prompt: string) => Promise<string>) | undefined {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return undefined;
  const base = (runtime.config.model?.apiBase || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = runtime.config.model?.visualJudge || process.env.WEBAGENT_VISUAL_MODEL || runtime.config.model?.id || "gpt-4o-mini";
  return async (prompt) => {
    const res = await fetch(base + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error("judge " + res.status);
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return json.choices?.[0]?.message?.content ?? "";
  };
}
