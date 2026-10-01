import type { MemoryIntent, Persist } from "./intent.ts";
import { mentionedOtherStack } from "./intent.ts";

const DOCS = {
  quickstart: "https://supermemory.ai/docs/quickstart",
  memoryVsRag: "https://supermemory.ai/docs/concepts/memory-vs-rag",
  profiles: "https://supermemory.ai/docs/concepts/user-profiles",
  ingest: "https://supermemory.ai/docs/ingestion/add-memories",
  search: "https://supermemory.ai/docs/recall/search",
  tags: "https://supermemory.ai/docs/concepts/container-tags",
  sdk: "https://supermemory.ai/docs/integrations/supermemory-sdk",
  mcp: "https://supermemory.ai/docs/supermemory-mcp/mcp",
  local: "https://supermemory.ai/docs/self-hosting/overview",
  billing: "https://supermemory.ai/docs/overview/billing",
};

export interface MemoryPlan {
  useCase: string;
  path: string;
  pathWhy: string;
  persist: Persist;
  practices: { name: string; value: string; why: string }[];
  implementation: string[];
  docs: { title: string; url: string }[];
  footnote?: string;
}

export function recommendPath(intent: MemoryIntent): MemoryPlan {
  const persist = intent.persist || (intent.useCase === "docs_rag" ? "docs" : "both");
  const local = intent.residency === "must_stay_local";
  const plugin = intent.entry === "plugin" && !local;
  const docsOnly = persist === "docs" && !/\b(remember|profile|user)\b/i.test(intent.useCase || "");

  let path = "Hosted Memory API";
  let pathWhy = "Same containerTag for memory, profile, and SuperRAG — start at api.supermemory.ai.";
  if (local) {
    path = "Self-host (local binary)";
    pathWhy = "You said the data cannot leave. Same API on localhost:6767.";
  } else if (plugin) {
    path = "Plugin / MCP on hosted SuperMemory";
    pathWhy = "You already have an assistant. Coding plugins are on every plan, including Free.";
  } else if (docsOnly) {
    path = "Hosted SuperRAG";
    pathWhy = "You only need chat-with-docs, not per-user state. SuperRAG is enough — do not oversell the graph.";
  }

  const practices = [
    {
      name: "containerTag",
      value: intent.who === "tenant" ? "one tag per customer/tenant" : intent.who === "project" ? "one tag per project" : "one tag per user",
      why: "Isolation boundary. Memory, profile, and SuperRAG share it.",
    },
    {
      name: "customId",
      value: "stable id per conversation or document",
      why: "Re-add only bills the new token delta.",
    },
    {
      name: "wait",
      value: "poll until document status is done",
      why: "add() returns queued. Search before done misses memories.",
    },
    {
      name: "dreaming",
      value: "dynamic by default",
      why: "instant only when you need memories/profiles immediately — extra operation.",
    },
  ];
  if (!docsOnly) {
    practices.push({
      name: "retrieve",
      value: "profile every turn; search when the question needs it",
      why: "Profile is the cheap always-on summary. Search for the graph or docs.",
    });
  }

  const implementation = local
    ? [
        "Run the local binary and point the SDK at http://localhost:6767.",
        "Add a conversation under a stable customId and one containerTag.",
        "Wait until status is done, then profile + search.",
        "Write each turn back to the same customId.",
      ]
    : plugin
      ? [
          "Open console.supermemory.ai and create a key.",
          "Install the SuperMemory plugin or MCP for " + (intent.stack || "your assistant") + ".",
          "Confirm the same space/container is used across chats.",
          "Reuse that memory on the next session — do not rebuild it.",
        ]
      : [
          "Create a key at console.supermemory.ai.",
          "npm install supermemory (or pip install supermemory).",
          "client.add a conversation and a document on the same containerTag.",
          "Wait until done, then profile every turn and search when needed.",
          "Append the turn back with the same customId.",
        ];

  const docs = local
    ? [{ title: "Self-hosting", url: DOCS.local }]
    : plugin
      ? [{ title: "SuperMemory MCP", url: DOCS.mcp }]
      : docsOnly
        ? [{ title: "Memory vs RAG", url: DOCS.memoryVsRag }]
        : [{ title: "Quickstart", url: DOCS.quickstart }];

  const footnote = mentionedOtherStack(intent.notes)
    ? "You named another stack. SuperMemory still holds memory + profiles for that agent. DIY vectors only if you only need static docs."
    : intent.stack && !plugin
      ? "If you later want " + intent.stack + " as a plugin, that is a footnote — hosted API first."
      : undefined;

  return {
    useCase: intent.useCase || "agent memory",
    path,
    pathWhy,
    persist,
    practices,
    implementation,
    docs,
    footnote,
  };
}

export function planText(plan: MemoryPlan): string {
  const lines = [
    "For you: " + plan.useCase,
    "Path: " + plan.path + " — " + plan.pathWhy,
    "Best practices:",
    ...plan.practices.map((s) => `- ${s.name}: ${s.value} (${s.why})`),
    "Do this next:",
    ...plan.implementation.map((s, i) => `${i + 1}. ${s}`),
    plan.docs[0] ? "Doc: " + plan.docs[0].url : "",
    plan.footnote ? "Note: " + plan.footnote : "",
  ];
  return lines.filter(Boolean).join("\n");
}
