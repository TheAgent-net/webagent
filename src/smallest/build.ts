import { join } from "node:path";
import { buildPack } from "../site/pack.ts";
import type { CrawlState } from "../site/crawl.ts";
import { STARTER_QUESTIONS } from "./catalog.ts";
import { crawlSmallest } from "./crawl.ts";
import { defaultQueryEmbed, fillVectors } from "./embed.ts";
import { indexDocs } from "./retrieve.ts";
import type { BuildSmallestOpts, RetrievalInfo, SmallestPack } from "./types.ts";

export async function buildSmallest(opts: BuildSmallestOpts = {}): Promise<SmallestPack> {
  const crawled = await crawlSmallest({ maxPages: opts.maxPages ?? 220, fetch: opts.fetch });
  const state: CrawlState = {
    origin: crawled.origin,
    pages: crawled.pages,
    pending: [],
    seen: new Set(crawled.pages.map((p) => p.url)),
    cookies: "",
  };
  const site = buildPack(state);
  site.starterQuestions = STARTER_QUESTIONS;
  const chunks = indexDocs(crawled.pages);
  const cachePath = opts.cachePath ?? process.env.SMALLEST_RETRIEVE_CACHE ?? join(process.cwd(), ".retrieve-cache.json");
  let retrieval: RetrievalInfo = { mode: "lexical", embedded: 0 };
  try {
    retrieval = await fillVectors(chunks, { embed: opts.embed, cachePath: opts.embed === false ? undefined : cachePath });
  } catch (err) {
    console.error("smallest embeddings failed — lexical fallback:", err instanceof Error ? err.message : err);
  }
  const embedQuery = typeof opts.embed === "function" ? opts.embed : retrieval.mode === "hybrid" ? defaultQueryEmbed() : undefined;
  const facts = [
    "Pocket facts — do not recite on the first turn. Explore the visitor, then spend these only when they match what they said.",
    ...site.facts,
    `Docs origin ${crawled.docsOrigin}. ${crawled.docs.length} doc pages, ${crawled.marketing.length} marketing pages, ${chunks.length} chunks, retrieval ${retrieval.mode}.`,
    "Current models (name only after they match): Lightning v3.1 TTS, Pulse STT, Electron LLM, Hydra S2S (beta). Lightning v2 is deprecated.",
    "First path is always Atoms (Smallest's own agent stack). Pipecat/LiveKit only if they must keep that pipeline.",
  ];
  site.facts = facts;
  return {
    origin: crawled.origin,
    docsOrigin: crawled.docsOrigin,
    site,
    pages: crawled.pages,
    marketing: crawled.marketing,
    docs: crawled.docs,
    chunks,
    retrieval,
    embedQuery,
    facts,
    starterQuestions: STARTER_QUESTIONS,
  };
}
