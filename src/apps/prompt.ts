/** Instruction for the Composio public agent. Winner of apps GEPA. */

import { runAppsGepa } from "./gepa.ts";
import { APPS_CATALOG_V1, APPS_CONSULTANT_V2, APPS_LIBRARIAN, appsSeedPrompts } from "./seeds.ts";

const GEPA = runAppsGepa(appsSeedPrompts());

export const APPS_PROMPT_ID = GEPA.winner.id;
export const APPS_PROMPT_MEAN = GEPA.winner.mean;
export const APPS_GEPA = GEPA;

export function appsInstruction(): string {
  return GEPA.winner.text.trim();
}

export { APPS_CATALOG_V1, APPS_CONSULTANT_V2, APPS_LIBRARIAN, appsSeedPrompts };
