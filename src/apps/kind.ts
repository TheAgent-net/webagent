/** Map a Composio app slug or page category onto a short kind and default uses. */

export interface KindRule {
  kind: string;
  match: RegExp;
  uses: string[];
  /** Well-known slugs that should win a tie for this kind. */
  lead: string[];
}

export const KIND_RULES: KindRule[] = [
  { kind: "email", match: /gmail|outlook|mailchimp|sendgrid|mailgun|postmark|zoho.?mail|yahoo|imap|smtp|resend|mailjet/i, uses: ["send email", "read inbox", "search mail"], lead: ["GMAIL", "OUTLOOK", "RESEND"] },
  { kind: "chat", match: /slack|discord|teams|telegram|whatsapp|mattermost|rocketchat|guild/i, uses: ["post message", "read channel"], lead: ["SLACK", "DISCORD", "MICROSOFT_TEAMS"] },
  { kind: "git", match: /github|gitlab|bitbucket|gitea|gogs/i, uses: ["create issue", "open pull request", "list repos"], lead: ["GITHUB", "GITLAB"] },
  { kind: "calendar", match: /calendar|calendly|cal_com|calcom/i, uses: ["create event", "list events"], lead: ["GOOGLECALENDAR", "OUTLOOK", "CALENDLY"] },
  { kind: "crm", match: /salesforce|hubspot|pipedrive|attio|affinity|close.?io|zoho.?crm|copper/i, uses: ["create contact", "update deal"], lead: ["HUBSPOT", "SALESFORCE"] },
  { kind: "tickets", match: /jira|linear|asana|clickup|trello|monday|zendesk|freshdesk|pagerduty|servicenow|shortcut/i, uses: ["create ticket", "list issues"], lead: ["LINEAR", "JIRA", "ASANA"] },
  { kind: "docs", match: /notion|confluence|googledocs|coda|outline|wiki/i, uses: ["create page", "search docs"], lead: ["NOTION", "GOOGLEDOCS"] },
  { kind: "files", match: /drive|dropbox|box\b|onedrive|one_drive|s3|share.?point|gcs/i, uses: ["upload file", "list files"], lead: ["GOOGLEDRIVE", "DROPBOX"] },
  { kind: "pay", match: /stripe|paypal|square|braintree|razorpay|chargebee/i, uses: ["create charge", "list invoices"], lead: ["STRIPE"] },
  { kind: "sheet", match: /\bsheets?\b|airtable|excel|googlesheets/i, uses: ["read rows", "write rows"], lead: ["GOOGLESHEETS", "AIRTABLE"] },
  { kind: "social", match: /twitter|x_|linkedin|instagram|facebook|tiktok|reddit|youtube|threads/i, uses: ["post update", "read feed"], lead: ["TWITTER", "LINKEDIN"] },
  { kind: "meet", match: /zoom|googlemeet|google.?meet|webex/i, uses: ["create meeting"], lead: ["ZOOM", "GOOGLEMEET"] },
  { kind: "search", match: /serpapi|tavily|perplexity|algolia|\bexa\b/i, uses: ["web search"], lead: ["TAVILY", "PERPLEXITYAI"] },
  { kind: "code", match: /supabase|vercel|netlify|heroku|digital.?ocean|aws|cloudflare|firebase/i, uses: ["deploy", "query database"], lead: ["SUPABASE", "VERCEL"] },
];

export function leadSlugs(kind: string): string[] {
  return KIND_RULES.find((r) => r.kind === kind)?.lead ?? [];
}

export function kindOf(slug: string, category = ""): string {
  const hay = slug + " " + category;
  if (category && /^[a-z][a-z0-9_-]{1,24}$/i.test(category.trim())) {
    const cat = category.trim().toLowerCase().replace(/\s+/g, "_");
    if (KIND_RULES.some((r) => r.kind === cat)) return cat;
    if (cat === "communication") return "chat";
    if (cat === "developer_tools" || cat === "developer") return "git";
    if (cat === "productivity" && /sheet/i.test(hay)) return "sheet";
  }
  for (const r of KIND_RULES) if (r.match.test(hay)) return r.kind;
  return "other";
}

export function usesFor(kind: string, tools: string[] = []): string[] {
  const rule = KIND_RULES.find((r) => r.kind === kind);
  const fromKind = rule?.uses ?? [];
  const fromTools = tools.map(useFromTool).filter((u) => keepUse(u, fromKind));
  return unique([...fromKind, ...fromTools]).slice(0, 8);
}

/** GMAIL_SEND_EMAIL → "send email". */
export function useFromTool(slug: string): string {
  const parts = slug.toLowerCase().split("_").filter((p) => p && !SKIP.has(p));
  if (parts.length < 2) return "";
  const verb = parts[0]!;
  const rest = parts.slice(1).join(" ");
  if (!VERBS.has(verb)) return rest || slug.toLowerCase().replace(/_/g, " ");
  return (verb + " " + rest).trim();
}

function keepUse(use: string, kindUses: string[]): boolean {
  if (!use) return false;
  const u = use.toLowerCase();
  if (kindUses.some((k) => k === u || u.includes(k) || k.includes(u))) return true;
  if (u.split(/\s+/).length > 3) return false;
  if (NOISE.test(u)) return false;
  return CORE.test(u);
}

const NOISE = /api key|webhook|template|version|ip |pool|batch|folder|property|feedback|cart|domain|prompt|filter|label|draft|oauth|scope|token/;
const CORE = /\b(email|mail|inbox|issue|ticket|pull request|repo|message|channel|event|contact|deal|page|file|charge|invoice|row|sheet|meeting|search|deploy)\b/;

const VERBS = new Set([
  "send", "create", "list", "get", "read", "write", "update", "delete", "search",
  "post", "upload", "download", "open", "close", "fetch", "add", "remove", "set",
]);

const SKIP = new Set(["gmail", "github", "slack", "google", "microsoft", "the", "a"]);

function unique(xs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of xs) {
    const k = x.toLowerCase();
    if (seen.has(k) || k.length < 3) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}
