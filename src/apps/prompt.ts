/** Instruction for the Composio public agent. Winner of apps GEPA. */

import { runAppsGepa } from "./gepa.ts";
import {
  APPS_CATALOG_V1,
  APPS_CONSULTANT_V2,
  APPS_LIBRARIAN,
  APPS_PUBLIC_DESCRIPTION,
  APPS_PUBLIC_INSTRUCTIONS,
  appsSeedPrompts,
} from "./seeds.ts";

const GEPA = runAppsGepa(appsSeedPrompts());

export const APPS_PROMPT_ID = GEPA.winner.id;
export const APPS_PROMPT_MEAN = GEPA.winner.mean;
export const APPS_GEPA = GEPA;

export function appsInstruction(): string {
  return GEPA.winner.text.trim();
}

export function appsPublicDescription(): string {
  return APPS_PUBLIC_DESCRIPTION;
}

export function appsPublicInstructions(): string {
  return APPS_PUBLIC_INSTRUCTIONS;
}

export {
  APPS_CATALOG_V1,
  APPS_CONSULTANT_V2,
  APPS_LIBRARIAN,
  APPS_PUBLIC_DESCRIPTION,
  APPS_PUBLIC_INSTRUCTIONS,
  appsSeedPrompts,
};
