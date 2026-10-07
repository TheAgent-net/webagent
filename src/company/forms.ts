import type { FormShot, PageShot } from "../site/types.ts";
import type { FormField, FormWalk } from "./types.ts";

const SKIP_TYPES = new Set(["hidden", "submit", "button", "image", "reset"]);

const KINDS: { id: string; name: string; purpose: string; match: RegExp }[] = [
  { id: "signup", name: "Sign up", purpose: "Create an account or start a trial", match: /sign[-]?up|register|join|trial|create.?account/i },
  { id: "demo", name: "Book a demo", purpose: "Talk to sales or book a walkthrough", match: /demo|book|meeting|calendly|talk.?to.?sales/i },
  { id: "quote", name: "Get a quote", purpose: "Start a quote or pricing request", match: /quote|insure|premium|coverage/i },
  { id: "contact", name: "Contact", purpose: "Send a message to the company", match: /contact|support|help|message|sales/i },
  { id: "search", name: "Search", purpose: "Find something on the site", match: /search|find|query|q\b/i },
  { id: "login", name: "Sign in", purpose: "Sign in to an existing account", match: /login|sign[-]?in|password|auth/i },
  { id: "subscribe", name: "Subscribe", purpose: "Join the mailing list", match: /subscribe|newsletter|email/i },
  { id: "apply", name: "Apply", purpose: "Submit an application", match: /apply|application|careers?|job/i },
];

/** Turn crawled forms into field-by-field walks the agent can run. */
export function inferFormWalks(pages: PageShot[]): FormWalk[] {
  const out: FormWalk[] = [];
  const seen = new Set<string>();
  let n = 0;
  for (const page of pages) {
    for (const form of page.forms) {
      const fields = visibleFields(form);
      if (!fields.length) continue;
      const kind = classify(page, form, fields);
      const id = uniqueId(kind.id, seen, ++n);
      out.push({
        id,
        name: kind.name,
        purpose: kind.purpose,
        url: page.url,
        action: form.action || page.url,
        method: form.method || "get",
        fields,
      });
    }
  }
  return out;
}

function uniqueId(base: string, seen: Set<string>, n: number): string {
  let id = base;
  if (seen.has(id)) id = base + "-" + n;
  seen.add(id);
  return id;
}

function visibleFields(form: FormShot): FormField[] {
  return form.fields
    .filter((f) => f.name && !SKIP_TYPES.has(f.type))
    .map((f) => ({ name: f.name, type: f.type, why: whyField(f.name, f.type) }));
}

function classify(page: PageShot, form: FormShot, fields: FormField[]): (typeof KINDS)[number] {
  const hay = [page.url, page.title, form.action, ...fields.map((f) => f.name)].join(" ");
  for (const k of KINDS) {
    if (k.match.test(hay)) return k;
  }
  if (fields.some((f) => f.type === "password")) return KINDS.find((k) => k.id === "login")!;
  if (fields.length === 1 && /email|mail/i.test(fields[0]!.name)) return KINDS.find((k) => k.id === "subscribe")!;
  return KINDS.find((k) => k.id === "contact")!;
}

function whyField(name: string, type: string): string {
  const n = name.toLowerCase();
  if (type === "password" || /pass/.test(n)) return "Unlocks the account";
  if (type === "email" || /e-?mail/.test(n)) return "Where they send the reply or login";
  if (/first.?name|fname/.test(n)) return "How to greet them";
  if (/last.?name|lname|surname/.test(n)) return "Full name on the account";
  if (/^(name|full.?name|your.?name)$/.test(n)) return "Who is asking";
  if (/company|org|business/.test(n)) return "Which team this is for";
  if (/phone|tel|mobile/.test(n)) return "A number if email is slow";
  if (/message|note|comment|body|details|about/.test(n)) return "What they need, in their words";
  if (/^(q|query|search|s)$/.test(n)) return "What to find on the site";
  if (/url|website|site/.test(n)) return "Their site, so the team can look";
  if (/role|title|job/.test(n)) return "Whether they decide or implement";
  if (/size|employees|seats/.test(n)) return "How big the team is";
  return "Needed to complete this form";
}
