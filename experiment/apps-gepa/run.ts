#!/usr/bin/env bun
import { writeFileSync } from "node:fs";
import { APPS_GEPA, APPS_PROMPT_ID } from "../../src/apps/prompt.ts";
import { appsSeedPrompts } from "../../src/apps/seeds.ts";

const { winner, all, front } = APPS_GEPA;
const lines = [
  "# GEPA — Composio apps prompt",
  "",
  "Seeds: " + appsSeedPrompts().map((s) => s.id).join(", "),
  "Winner: `" + APPS_PROMPT_ID + "`  mean=" + winner.mean.toFixed(3),
  "",
  "Goals: probe (ask questions back), a2a (peer-agent discovery), usecase (why this fits their work), flow (entire flow + settings), pinpoint (not semantically close apps), grounded (graph only), short (220 words, one next step), personal (extract names; no generic catalog).",
  "",
  "## All",
  "",
  "| id | gen | mean | probe | a2a | usecase | flow | pinpoint | grounded | short | personal |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...all.map((c) =>
    [
      c.id,
      c.gen,
      c.mean.toFixed(2),
      c.score.probe.toFixed(2),
      c.score.a2a.toFixed(2),
      c.score.usecase.toFixed(2),
      c.score.flow.toFixed(2),
      c.score.pinpoint.toFixed(2),
      c.score.grounded.toFixed(2),
      c.score.short.toFixed(2),
      c.score.personal.toFixed(2),
    ]
      .join(" | ")
      .replace(/^/, "| ")
      .concat(" |"),
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
writeFileSync("experiment/apps-gepa/result.md", lines.join("\n"));
if (import.meta.main) console.log(lines.join("\n"));
