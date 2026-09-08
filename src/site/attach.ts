/**
 * Bind a crawled pack onto a Harness using only public controls.
 * Does not touch the loop.
 */
import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";
import type { Tool } from "../tools.ts";
import { hasCorpus, lookupCorpus } from "./corpus.ts";
import type { SiteFlow, SitePack } from "./types.ts";

export function attachPack(h: Harness, pack: SitePack, opts?: { model?: string; instruction?: string }): Run {
  h.addTool(lookupTool(pack));
  for (const flow of pack.flows) h.addTool(flowTool(flow));

  const run = h.create({
    model: opts?.model,
    instruction: opts?.instruction ?? pack.instruction,
    tools: [lookupTool(pack), ...pack.flows.map(flowTool)],
  });
  if (pack.corpusDir) {
    run.inject({
      vars: [
        "Local corpus at " + pack.corpusDir + ". " + pack.pages.length + " page files.",
        "Call site_lookup to read those files. Do not invent prices or customers.",
        "Page catalog:",
        ...pack.pages.slice(0, 30).map((p) => "- " + p.title + " — " + p.url),
      ].join("\n"),
    });
  } else if (pack.facts.length) {
    run.inject({ vars: pack.facts.join("\n") });
  }
  return run;
}

function lookupTool(pack: SitePack): Tool {
  return {
    name: "site_lookup",
    description: "Search local site files and return the most relevant snippets. No web call.",
    schema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
    async call(args) {
      const q = String(args.query ?? "");
      if (pack.corpusDir && hasCorpus(pack.corpusDir)) {
        const hits = lookupCorpus(pack.corpusDir, q, 6);
        return { origin: pack.origin, source: "corpus", hits };
      }
      const words = q.toLowerCase().split(/\W+/).filter((w) => w.length > 2 && !STOP.has(w));
      const scored: { score: number; url: string; title: string; snippet: string }[] = [];
      for (const p of pack.pages) {
        const hay = (p.title + " " + p.headings.join(" ") + " " + p.text).toLowerCase();
        let score = 0;
        for (const w of words) {
          if (hay.includes(w)) score += w.length;
        }
        if (!words.length) score = 1;
        if (score > 0) scored.push({ score, url: p.url, title: p.title, snippet: snippetAround(p.text, words) });
      }
      scored.sort((a, b) => b.score - a.score);
      const hits = scored.slice(0, 6).map(({ url, title, snippet }) => ({ url, title, snippet }));
      return { origin: pack.origin, source: "pack", hits };
    },
  };
}

const STOP = new Set([
  "the", "and", "for", "you", "are", "what", "does", "can", "how", "from", "with", "this", "that",
  "need", "get", "our", "your", "should", "give", "short", "keep", "than", "compared", "about",
]);

function snippetAround(text: string, words: string[]): string {
  const lower = text.toLowerCase();
  let idx = -1;
  for (const w of words) {
    let from = 0;
    while (from < lower.length) {
      const i = lower.indexOf(w, from);
      if (i < 0) break;
      if (idx < 0 || i > 400) {
        idx = i;
        if (i > 400) break;
      }
      from = i + w.length;
    }
  }
  if (idx < 0) idx = 0;
  const start = Math.max(0, idx - 40);
  return text.slice(start, start + 280);
}

function flowTool(flow: SiteFlow): Tool {
  return {
    name: "flow_" + flow.id,
    description: flow.purpose,
    schema: { type: "object", properties: {} },
    async call() {
      return { id: flow.id, name: flow.name, purpose: flow.purpose, steps: flow.steps };
    },
  };
}
