export type Who = "user" | "tenant" | "project";
export type Persist = "memory" | "docs" | "both";
export type Residency = "hosted" | "must_stay_local";
export type Entry = "api" | "plugin" | "local";

export interface MemoryIntent {
  useCase?: string;
  who?: Who;
  persist?: Persist;
  residency?: Residency;
  entry?: Entry;
  stack?: string;
  notes: string;
}

export function emptyIntent(): MemoryIntent {
  return { notes: "" };
}

export function mergeIntent(base: MemoryIntent, patch: Partial<MemoryIntent>): MemoryIntent {
  return {
    useCase: patch.useCase || base.useCase,
    who: patch.who || base.who,
    persist: patch.persist || base.persist,
    residency: patch.residency || base.residency,
    entry: patch.entry || base.entry,
    stack: patch.stack || base.stack,
    notes: [base.notes, patch.notes].filter(Boolean).join(" ").trim(),
  };
}

export function inferIntent(text: string, prior: MemoryIntent = emptyIntent()): MemoryIntent {
  const t = text.toLowerCase();
  const patch: Partial<MemoryIntent> = { notes: text.trim() };

  const use = useCaseFrom(t);
  if (use) patch.useCase = use;

  const who = whoFrom(t);
  if (who) patch.who = who;

  const persist = persistFrom(t);
  if (persist) patch.persist = persist;

  if (mustStayLocal(t)) patch.residency = "must_stay_local";
  else if (/\b(hosted|cloud|api\.supermemory|console\.supermemory)\b/.test(t)) patch.residency = "hosted";

  if (wantsPlugin(t) && !buildingOwnAgent(t)) patch.entry = "plugin";
  else if (mustStayLocal(t)) patch.entry = "local";
  else if (buildingOwnAgent(t) || /\b(sdk|api|typescript|python|ai sdk)\b/.test(t)) patch.entry = "api";

  const stack = stackFrom(t);
  if (stack) patch.stack = stack;

  return mergeIntent(prior, patch);
}

export function missingFields(intent: MemoryIntent): string[] {
  const miss: string[] = [];
  if (!intent.useCase) miss.push("useCase");
  if (!intent.who && intent.persist !== "docs") miss.push("who");
  if (hintsLocal(intent.notes) && !intent.residency) miss.push("residency");
  return miss;
}

export function enoughIntent(intent: MemoryIntent): boolean {
  if (stillExploring(intent.notes) && !inferIntent(intent.notes).useCase) return false;
  return missingFields(intent).length === 0;
}

export function stillExploring(notes: string): boolean {
  return /\b(not sure|unsure|don'?t know|no idea|still figuring|\bidk\b)\b/i.test(notes);
}

export function isGreeting(text: string): boolean {
  return /^(hi|hey|hello|yo|sup|good (morning|afternoon|evening))\b/i.test(text.trim()) ||
    !text.trim() ||
    /what (can|do) you (do|help)/i.test(text);
}

export function isInfoQuestion(text: string): boolean {
  const t = text.trim();
  if (!t || isGreeting(t)) return false;
  const lower = t.toLowerCase();
  if (/\b(i (want|need)|we (want|need)|set up|setup|build me|our (agent|app|product)|trying to get)\b/.test(lower)) {
    return false;
  }
  if (
    /\b(what is|what's|whats|what are|tell me about|explain|how does|how do (you|they|i)|how is|how to|describe|difference between|compared to|vs\.?)\b/.test(
      lower,
    )
  ) {
    return true;
  }
  return (
    /\b(docs|documentation|pricing|plans?|billing|features|overview|latency|soc ?2|hipaa|gdpr)\b/.test(lower) &&
    /\b(supermemory|memory|rag|profile|mcp|self-?host)\b/.test(lower)
  );
}

export function mentionedOtherStack(notes: string): boolean {
  return /\b(mem0|zep|pinecone|weaviate|chroma|pgvector|langchain|langgraph|mastra|crewai)\b/i.test(notes);
}

export function lockedOwnStack(notes: string): boolean {
  return /\b(must keep|have to keep|already (locked|committed)|cannot leave|won'?t move)\b/i.test(notes);
}

export function nextQuestion(intent: MemoryIntent): string | null {
  const miss = missingFields(intent);
  if (!miss.length) return null;
  const field = miss[0]!;
  if (field === "useCase") {
    if (isGreeting(intent.notes) || !intent.notes.trim()) {
      return "What are you trying to get working?";
    }
    return "What should this agent remember — and who is it for?";
  }
  if (field === "who") {
    return "Is this one user, or many tenants?";
  }
  if (field === "residency") {
    return "Does the data have to stay on your machines, or is the hosted API fine?";
  }
  return null;
}

function useCaseFrom(t: string): string | undefined {
  if (/\b(claude code|cursor|codex|opencode|chatgpt|claude desktop)\b/.test(t) && /\b(plugin|mcp|memory)\b/.test(t)) {
    return "coding_plugin";
  }
  if (/\b(support|help ?desk|customer service|ticket)\b/.test(t)) return "support_agent";
  if (/\b(personal assistant|companion|second brain)\b/.test(t)) return "personal_agent";
  if (/\b(multi[- ]?tenant|saas|per[- ]customer)\b/.test(t)) return "multi_tenant";
  if (/\b(only |just )?(rag|pdf|knowledge base|chat with (docs|pdfs))\b/.test(t) && !/\b(remember|profile|user)\b/.test(t)) {
    return "docs_rag";
  }
  if (/\b(remember|memory|memories|user context|preferences)\b/.test(t)) return "user_memory";
  if (/\b(agent|chatbot|assistant)\b/.test(t)) return "agent_memory";
  return undefined;
}

function whoFrom(t: string): Who | undefined {
  if (/\b(many tenants|multi[- ]?tenant|each (customer|tenant)|per[- ](customer|tenant)|tenants|saas)\b/.test(t)) return "tenant";
  if (/\b(project|workspace|team space)\b/.test(t)) return "project";
  if (/\b(each user|per[- ]user|end users|one user|the user)\b/.test(t)) return "user";
  return undefined;
}

function persistFrom(t: string): Persist | undefined {
  const wantsMem = /\b(remember|memory|preference|profile|conversation)\b/.test(t);
  const wantsDocs = /\b(pdf|docs?|knowledge base|handbook|policy|rag)\b/.test(t);
  if (wantsMem && wantsDocs) return "both";
  if (wantsDocs && !wantsMem) return "docs";
  if (wantsMem) return "memory";
  return undefined;
}

function mustStayLocal(t: string): boolean {
  return /\b(self[- ]?host|on[- ]?prem|air[- ]?gap|vpc|must stay (local|on)|cannot leave|data residency)\b/.test(t);
}

function hintsLocal(notes: string): boolean {
  return /\b(compliance|hipaa|gdpr|air[- ]?gap|on[- ]?prem|self[- ]?host|vpc|cannot leave)\b/i.test(notes);
}

function wantsPlugin(t: string): boolean {
  return /\b(mcp|plugin|claude code|cursor|codex|chatgpt|opencode|claude desktop)\b/.test(t);
}

function buildingOwnAgent(t: string): boolean {
  return /\b(our agent|we (built|are building)|own (agent|harness|orchestrator)|typescript|python sdk|ai sdk)\b/.test(t);
}

function stackFrom(t: string): string | undefined {
  const names = [
    "claude code",
    "cursor",
    "codex",
    "chatgpt",
    "grok",
    "opencode",
    "langchain",
    "langgraph",
    "mastra",
    "pinecone",
    "mem0",
    "zep",
  ];
  for (const n of names) if (t.includes(n)) return n;
  return undefined;
}
