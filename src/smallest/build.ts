import { buildPack } from "../site/pack.ts";
import type { CrawlState } from "../site/crawl.ts";
import { STARTER_QUESTIONS } from "./catalog.ts";
import { crawlSmallest } from "./crawl.ts";
import type { BuildSmallestOpts, SmallestPack } from "./types.ts";

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
  const facts = [
    ...site.facts,
    `Docs origin ${crawled.docsOrigin}. ${crawled.docs.length} doc pages, ${crawled.marketing.length} marketing pages.`,
    "Current models: Lightning v3.1 TTS, Pulse STT, Electron LLM, Hydra S2S (beta). Lightning v2 is deprecated.",
    "Two build paths: hosted Atoms (standard platform LLM vs crew/custom LLM) or own stack (Pipecat/LiveKit) using Waves APIs.",
  ];
  site.facts = facts;
  return {
    origin: crawled.origin,
    docsOrigin: crawled.docsOrigin,
    site,
    pages: crawled.pages,
    marketing: crawled.marketing,
    docs: crawled.docs,
    facts,
    starterQuestions: STARTER_QUESTIONS,
  };
}
