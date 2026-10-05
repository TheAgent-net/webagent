/**
 * Store: durable record of tenants, conversations, turns, traffic events, and feedback.
 * One interface. SQLite (`sqlite.ts`) is the default. Add other engines behind the same interface.
 */

/** Who sent a request. See `src/host/visitor.ts`. */
export type VisitorKind = "human" | "crawler" | "assistant" | "browser" | "script";

/** Where a conversation came in. */
export type Channel = "widget" | "chat" | "mcp";

/** One company that uses the hosted webagent. */
export interface Tenant {
  /** Short id. Used in `/t/<id>/…` URLs. */
  id: string;
  name: string;
  /** Pack folder on disk. */
  pack: string;
  /** Host names that map straight to this tenant (custom domains). */
  domains: string[];
  /** Page origins that may embed the widget and call `/chat` from a browser. Empty means any. */
  origins: string[];
  /** Free settings: handoff target, caps, and so on. */
  settings: Record<string, unknown>;
  created: number;
}

/** One chat session. Id is `<tenant>:<session>`. */
export interface Conversation {
  id: string;
  tenant: string;
  session: string;
  channel: Channel;
  kind: VisitorKind;
  /** Agent family, for example `chatgpt`, `claude`, `perplexity`. */
  family?: string;
  verified: boolean;
  /** 0..1. How likely the other side is a reasoning agent. Set by the score job. */
  score?: number;
  /** Final verdict, for example `intelligent`, `script`, `human`. */
  label?: string;
  /** Page the visitor was on when the chat started. */
  page?: string;
  /** The agent offered the team or the visitor asked for a person. */
  handoff?: boolean;
  started: number;
  updated: number;
  turns: number;
}

/** One question and its reply. */
export interface Turn {
  id?: number;
  conversation: string;
  at: number;
  from: "human" | "machine";
  said: string;
  reply: string;
  /** Visual id that the reply showed. */
  visual?: string;
  /** Reply time in milliseconds. */
  ms: number;
  tokens?: number;
}

/** One traffic signal: a request to our host, a widget beacon, or a CDN log row. */
export interface TrafficEvent {
  id?: number;
  tenant: string;
  at: number;
  /** `request`, `beacon`, `cdn`, or another short noun. */
  type: string;
  kind: VisitorKind;
  family?: string;
  verified: boolean;
  path?: string;
  session?: string;
  /** Salted hash. Never store a raw IP. */
  ipHash?: string;
  ua?: string;
  data?: Record<string, unknown>;
}

export interface Feedback {
  id?: number;
  tenant: string;
  conversation: string;
  turn?: number;
  vote: 1 | -1;
  note?: string;
  at: number;
}

export interface ConversationFilter {
  kind?: VisitorKind;
  label?: string;
  channel?: Channel;
  handoff?: boolean;
  since?: number;
  /** Text search over said and reply. */
  text?: string;
  limit?: number;
  offset?: number;
}

export interface EventFilter {
  type?: string;
  kind?: VisitorKind;
  since?: number;
  limit?: number;
}

/** One row of a count query. */
export interface Count {
  key: string;
  n: number;
  /** Rows in this group with `verified = true`. */
  verified: number;
}

export type EventGroup = "kind" | "family" | "path" | "day" | "type";
export type ConversationGroup = "kind" | "family" | "label" | "day" | "channel";

export interface Store {
  putTenant(tenant: Tenant): void;
  getTenant(id: string): Tenant | undefined;
  listTenants(): Tenant[];
  findTenant(domain: string): Tenant | undefined;

  /** Create the conversation if it is new. Return the stored row. */
  openConversation(c: Omit<Conversation, "started" | "updated" | "turns"> & { at?: number }): Conversation;
  getConversation(id: string): Conversation | undefined;
  updateConversation(id: string, patch: Partial<Omit<Conversation, "id" | "tenant" | "session">>): void;
  listConversations(tenant: string, filter?: ConversationFilter): Conversation[];
  countConversations(tenant: string, by: ConversationGroup, since?: number): Count[];

  addTurn(turn: Turn): number;
  listTurns(conversation: string): Turn[];

  addEvent(event: TrafficEvent): void;
  listEvents(tenant: string, filter?: EventFilter): TrafficEvent[];
  countEvents(tenant: string, by: EventGroup, since?: number, filter?: { type?: string; kind?: VisitorKind }): Count[];

  addFeedback(feedback: Feedback): void;
  listFeedback(tenant: string, since?: number): Feedback[];

  close(): void;

  /** Add the events that match. A row counts `data.n` (CDN rows) or 1. With `distinct`, count distinct visitors. */
  sumEvents(tenant: string, filter?: EventSum): number;
  /** Group the events that match. `n` adds `data.n` or 1. Group `page` reads `data.page`. */
  groupEvents(tenant: string, by: EventGroup | "page", filter?: EventSum): Count[];
  /** Events per day and per key, oldest day first. */
  listEventDays(tenant: string, by: "kind" | "family", filter?: EventSum): DayCount[];
  /** Conversation totals for the overview. Uses the start time. */
  sumConversations(tenant: string, since?: number): ConversationSum;
  /** Conversations per day. The key is `human` or `agent`. Oldest day first. */
  listConversationDays(tenant: string, since?: number): DayCount[];
  /** What visitors said, newest first. */
  listQuestions(tenant: string, since?: number, limit?: number): Question[];
}

export function conversationId(tenant: string, session: string): string {
  return tenant + ":" + session;
}

/** Filter for `sumEvents`, `groupEvents`, and `listEventDays`. */
export interface EventSum {
  since?: number;
  type?: string;
  /** Keep only these kinds. */
  kinds?: VisitorKind[];
  /** Keep only these paths. */
  paths?: string[];
  /** Count distinct visitors (IP hash, session, or user agent) instead of rows. */
  distinct?: boolean;
}

/** One cell of a per-day count. `day` is `YYYY-MM-DD` in UTC. */
export interface DayCount {
  day: string;
  key: string;
  n: number;
}

export interface ConversationSum {
  total: number;
  human: number;
  /** Every kind that is not `human`. */
  agent: number;
  /** Label `intelligent`. */
  intelligent: number;
  /** Label `intelligent` with two turns or more. */
  deep: number;
  handoff: number;
  verified: number;
}

/** One thing a visitor said. */
export interface Question {
  conversation: string;
  said: string;
  at: number;
}
