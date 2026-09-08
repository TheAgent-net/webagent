import { appQuoteText, isCorgi } from "../site/quote.ts";
import type { SitePack } from "../site/types.ts";
import { LIBRARIAN, SALES_V1, SALES_V2, SALES_V3, SALES_V4, seedPrompts } from "./seeds.ts";
import { runGepa } from "./gepa.ts";

/** Run GEPA on the seed prompts. Winner is the live sales instruction body. */
const GEPA = runGepa(seedPrompts());

export const SALES_PROMPT_ID = GEPA.winner.id;
export const SALES_PROMPT_MEAN = GEPA.winner.mean;
export const SALES_GEPA = GEPA;

export function salesInstruction(pack: SitePack): string {
  const lines = [
    GEPA.winner.text.trim(),
    "",
    "Origin: " + pack.origin,
    pack.corpusDir
      ? "Read local files with site_lookup. Do not call a scrape API."
      : "Use site_lookup or map_risks.",
    "Flows on this pack: " + pack.flows.map((f) => f.id).join(", "),
    "Starter questions (do not read these as the script): " + pack.starterQuestions.slice(0, 4).join(" | "),
  ];
  if (isCorgi(pack.origin) || pack.flows.some((f) => f.id === "app_quote")) {
    lines.push("", appQuoteText());
  }
  return lines.join("\n");
}

export { LIBRARIAN, SALES_V1, SALES_V2, SALES_V3, SALES_V4 };
