#!/usr/bin/env bun
/** Rebuild the Composio graph from an on-disk corpus. No network. */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildGraph, saveGraph } from "../src/apps/graph.ts";
import { CORPUS_COMPOSIO } from "../src/apps/types.ts";
import type { CorpusPage } from "../src/site/corpus.ts";

const DIR = process.argv[2] || CORPUS_COMPOSIO;
const index = JSON.parse(readFileSync(join(DIR, "index.json"), "utf8")) as {
  origin: string;
  pages: { url: string; title: string; file: string }[];
};
const pages: CorpusPage[] = [];
for (const row of index.pages.length
  ? index.pages
  : readdirSync(join(DIR, "pages")).filter((f) => f.endsWith(".md")).map((file) => ({ url: "", title: "", file }))) {
  const raw = readFileSync(join(DIR, "pages", row.file), "utf8");
  pages.push(pageFrom(raw, row.url, row.title));
}
const graph = buildGraph(index.origin, pages);
saveGraph(DIR, graph);
console.log("graph nodes " + graph.nodes.length + " edges " + graph.edges.length);

function pageFrom(raw: string, url: string, title: string): CorpusPage {
  const meta: Record<string, string> = {};
  let body = raw;
  if (raw.startsWith("---\n")) {
    const end = raw.indexOf("\n---\n", 4);
    if (end > 0) {
      for (const line of raw.slice(4, end).split("\n")) {
        const i = line.indexOf(":");
        if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
      }
      body = raw.slice(end + 5);
    }
  }
  return {
    url: meta.url || url,
    title: meta.title || title,
    description: meta.description || "",
    headings: [],
    text: body.trim(),
    status: 200,
  };
}
