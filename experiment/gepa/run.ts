#!/usr/bin/env bun
import { writeFileSync } from "node:fs";
import { SALES_GEPA, SALES_PROMPT_ID } from "../../src/sales/prompt.ts";
import { seedPrompts } from "../../src/sales/seeds.ts";

const { winner, all, front } = SALES_GEPA;
const lines = [
  "# GEPA — Corgi sales prompt",
  "",
  "Seeds: " + seedPrompts().map((s) => s.id).join(", "),
  "Winner: `" + SALES_PROMPT_ID + "`  mean=" + winner.mean.toFixed(3),
  "",
  "## All",
  "",
  "| id | gen | mean | discover | risks | penalty | social | report | grounded | short |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...all.map((c) =>
    [
      c.id,
      c.gen,
      c.mean.toFixed(2),
      c.score.discover.toFixed(2),
      c.score.risks.toFixed(2),
      c.score.penalty.toFixed(2),
      c.score.social.toFixed(2),
      c.score.report.toFixed(2),
      c.score.grounded.toFixed(2),
      c.score.short.toFixed(2),
    ].join(" | ").replace(/^/, "| ").concat(" |"),
  ),
  "",
  "## Front",
  "",
  front.map((c) => "- `" + c.id + "` mean=" + c.mean.toFixed(3)).join("\n"),
  "",
  "## Winner text",
  "",
  "```",
  winner.text.trim(),
  "```",
  "",
];
writeFileSync("experiment/gepa/result.md", lines.join("\n"));
if (import.meta.main) console.log(lines.join("\n"));
