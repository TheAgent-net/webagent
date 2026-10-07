import type { Tool } from "./tools.ts";

const DANGER = ["delete_account", "transfer_funds", "wipe", "drop_database"];

export function blockedAction(name: string): string | null {
  const n = name.toLowerCase();
  for (let i = 0; i < DANGER.length; i++) {
    if (n.includes(DANGER[i]!)) return "blocked dangerous action: " + name;
  }
  return null;
}

/** Fail-closed wrap. Guard error or deny → tool never runs. */
export function guardTool(tool: Tool): Tool {
  return {
    name: tool.name,
    description: tool.description,
    schema: tool.schema,
    preview: tool.preview,
    async call(args, signal) {
      const reason = blockedAction(tool.name);
      if (reason) return { error: "blocked_by_policy", reason };
      try {
        return await tool.call(args, signal);
      } catch (e) {
        return { error: "tool_error", reason: e instanceof Error ? e.message : String(e) };
      }
    },
  };
}
