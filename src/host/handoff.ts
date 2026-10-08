/**
 * Handoff: pass a chat to the human team.
 *
 * - `offersTeam` finds a reply that offers the team or a person.
 * - `asksHuman` finds a visitor who asks for a person.
 * - `sendHandoff` tells the tenant target: webhook, Slack, or email through `WEBAGENT_MAIL_WEBHOOK`.
 *
 * Every outbound call has a timeout. A failed call logs a warning and never throws.
 * Logs never contain the email or the note.
 */
import { listOrigins } from "../admin/auth.ts";

/** Phrases where the agent offers the team. */
const OFFER = [
  /\b(connect|put|get|introduce)\s+you\s+(in\s+touch\s+)?(with|to)\s+(our|the|a|an|one\s+of\s+our|someone\s+(from|on|in))\b[^.?!\n]{0,40}\b(team|person|human|specialist|expert|rep|representative|colleague|staff)s?\b/i,
  /\b(talk|speak|chat|meet)\s+(to|with)\s+(our|the|a|an|one\s+of\s+our|someone\s+(from|on|in))\b[^.?!\n]{0,30}\b(team|human|person|sales|specialist|expert|rep|representative)s?\b/i,
  /\b(our|the)\s+([a-z]+\s+)?team\s+(can|will|would\s+be\s+happy\s+to|is\s+happy\s+to)\s+(reach\s+out|contact\s+you|follow\s+up|get\s+in\s+touch|call\s+you|email\s+you)\b/i,
  /\bhave\s+(someone|a\s+person|a\s+human|our\s+team|the\s+team)\s+(reach\s+out|contact\s+you|follow\s+up|get\s+in\s+touch)\b/i,
];

/** Phrases where the visitor asks for a person. */
const ASK = [
  /\b(talk|speak|chat|connect)\s+(to|with)\s+(a\s+|an\s+|the\s+|your\s+|some\s*one\s+(from|in|on)\s+(the\s+|your\s+)?)?(real\s+)?(human|person|people|sales|support|team|someone|somebody|representative|rep|live\s+agent|real\s+agent)\b/i,
  /\b(contact|call|reach)\s+(sales|support|the\s+team|your\s+team|a\s+human|a\s+person)\b/i,
  /^\s*(human|real\s+person|live\s+agent|agent)\s*(please)?\s*[.!?]*\s*$/i,
];

export function offersTeam(reply: string): boolean {
  return OFFER.some((p) => p.test(reply));
}

export function asksHuman(said: string): boolean {
  return ASK.some((p) => p.test(said));
}

const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,63}$/;

/** Most characters kept from a visitor note. */
export const NOTE_CAP = 1000;

export function isEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && EMAIL.test(value);
}

/** Trim a note and cut it to `NOTE_CAP` characters. */
export function cutNote(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const note = value.replace(/\s+/g, " ").trim().slice(0, NOTE_CAP);
  return note || undefined;
}

/** Tenant setting `settings.handoff`. */
export interface Target {
  email?: string;
  webhook?: string;
  slack?: string;
}

export function getTarget(settings: Record<string, unknown> | undefined): Target {
  const raw = settings?.handoff;
  if (!raw || typeof raw !== "object") return {};
  const t = raw as Record<string, unknown>;
  return {
    email: isEmail(t.email) ? t.email : undefined,
    webhook: isWeb(t.webhook) ? t.webhook : undefined,
    slack: isWeb(t.slack) ? t.slack : undefined,
  };
}

function isWeb(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** What the team gets. */
export interface Notice {
  tenant: string;
  /** Tenant display name. */
  brand: string;
  conversation: string;
  email: string;
  note?: string;
  /** Dashboard link to the full chat. */
  transcript: string;
  at: number;
}

/** Most time for one outbound call. */
const TIMEOUT_MS = 5000;

/**
 * Dashboard link for one conversation.
 * - The base is the first origin in `WEBAGENT_DASHBOARD_ORIGINS`.
 * - With an org: `{dashboard}/app/<org>/webagent/sites/<tenant>/conversations/<session>`.
 * - With no org: the dashboard home.
 * `conversation` is `<tenant>:<session>`.
 */
export function getTranscriptUrl(tenant: string, conversation: string, org?: string): string {
  const dashboard = listOrigins()[0] ?? "https://app.agentnet.market";
  if (!org) return dashboard + "/";
  const session = conversation.startsWith(tenant + ":") ? conversation.slice(tenant.length + 1) : conversation;
  return (
    dashboard +
    "/app/" +
    encodeURIComponent(org) +
    "/webagent/sites/" +
    encodeURIComponent(tenant) +
    "/conversations/" +
    encodeURIComponent(session)
  );
}

/**
 * Send the notice to each target. Return the names of the targets that took it.
 * Never throws. Call it without `await` so the reply does not wait.
 */
export async function sendHandoff(target: Target, notice: Notice, outbound: typeof fetch = fetch): Promise<string[]> {
  const jobs: Promise<string | undefined>[] = [];
  if (target.webhook) {
    jobs.push(post(outbound, target.webhook, { type: "handoff", ...notice }, "webhook"));
  }
  if (target.slack) {
    const lines = [
      `*New handoff for ${notice.brand}*`,
      `Email: ${notice.email}`,
      notice.note ? `Note: ${notice.note}` : "",
      `Chat: ${notice.transcript}`,
    ].filter(Boolean);
    jobs.push(post(outbound, target.slack, { text: lines.join("\n") }, "slack"));
  }
  if (target.email) {
    const mail = process.env.WEBAGENT_MAIL_WEBHOOK;
    if (mail) {
      const text = [
        `A visitor asks the ${notice.brand} team to follow up.`,
        `Email: ${notice.email}`,
        notice.note ? `Note: ${notice.note}` : "",
        `Chat: ${notice.transcript}`,
      ]
        .filter(Boolean)
        .join("\n");
      jobs.push(
        post(
          outbound,
          mail,
          { to: target.email, replyTo: notice.email, subject: `New handoff from the ${notice.brand} agent`, text },
          "email",
        ),
      );
    } else {
      console.warn("handoff email skipped for tenant " + notice.tenant + ": set WEBAGENT_MAIL_WEBHOOK to send email.");
    }
  }
  const done = await Promise.all(jobs);
  return done.filter((x): x is string => !!x);
}

async function post(outbound: typeof fetch, url: string, body: object, name: string): Promise<string | undefined> {
  try {
    const res = await outbound(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn("handoff " + name + " failed: HTTP " + res.status);
      return undefined;
    }
    return name;
  } catch (err) {
    console.warn("handoff " + name + " failed: " + (err instanceof Error ? err.name : "error"));
    return undefined;
  }
}
