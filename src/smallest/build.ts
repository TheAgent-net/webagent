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
    "Pocket facts — do not recite on the first turn. Explore the visitor, then spend these only when they match what they said.",
    ...site.facts,
    `Docs origin ${crawled.docsOrigin}. ${crawled.docs.length} doc pages, ${crawled.marketing.length} marketing pages.`,
    "Current models (name only after they match): Lightning v3.1 TTS, Pulse STT, Electron LLM, Hydra S2S (beta). Lightning v2 is deprecated.",
    "Paths (name only after they match): hosted Atoms, or own stack (Pipecat/LiveKit) using Waves APIs.",
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
