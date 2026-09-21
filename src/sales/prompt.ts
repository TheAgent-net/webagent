import type { SitePack } from "../site/types.ts";
import { CORGI_PUBLIC_DESCRIPTION, CORGI_PUBLIC_INSTRUCTIONS, LIBRARIAN, SALES_V1, SALES_V2, seedPrompts } from "./seeds.ts";
import { runGepa } from "./gepa.ts";

const GEPA = runGepa(seedPrompts());

export const SALES_PROMPT_ID = GEPA.winner.id;
export const SALES_PROMPT_MEAN = GEPA.winner.mean;
export const SALES_GEPA = GEPA;

export function salesInstruction(pack: SitePack): string {
  return [
    GEPA.winner.text.trim(),
    "",
    "Origin: " + pack.origin,
    "Use site_lookup, map_risks, or quote_guide. Flows on this pack: " + pack.flows.map((f) => f.id).join(", "),
    "Starter questions (do not read these as the script): " + pack.starterQuestions.slice(0, 4).join(" | "),
  ].join("\n");
}

export function corgiPublicDescription(): string {
  return CORGI_PUBLIC_DESCRIPTION;
}

export function corgiPublicInstructions(): string {
  return CORGI_PUBLIC_INSTRUCTIONS;
}

export { LIBRARIAN, SALES_V1, SALES_V2 };
