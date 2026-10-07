import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";
import { attachPack } from "../site/attach.ts";
import type { SitePack } from "../site/types.ts";
import type { Tool } from "../tools.ts";
import { salesInstruction } from "./prompt.ts";
import { mapRisks, reportText } from "./risks.ts";

/** Bind the Corgi (or any) pack as a sales person. Public controls only. */
export function attachSales(h: Harness, pack: SitePack, opts?: { model?: string }): Run {
  const run = attachPack(h, pack, { model: opts?.model, instruction: salesInstruction(pack) });
  const tool = riskTool();
  h.addTool(tool);
  run.useTool(tool);
  return run;
}

export function riskTool(): Tool {
  return {
    name: "map_risks",
    description: "Given category and what the startup does, return grounded risks, penalties, proof, and a package.",
    schema: {
      type: "object",
      properties: { category: { type: "string" }, does: { type: "string" } },
      required: ["category", "does"],
    },
    async call(args) {
      const note = mapRisks({ category: String(args.category ?? ""), does: String(args.does ?? "") });
      return { ...note, report: reportText(note) };
    },
  };
}
