/**
 * Pull what the founder already said so the model cannot re-ask it.
 */
import type { Message } from "../context.ts";

export interface KnownFacts {
  does?: string;
  stage?: string;
  category?: string;
  whyNow?: string;
  readyForRisks: boolean;
}

const STAGE: [RegExp, string][] = [
  [/\bpre[-\s]?seed\b/i, "pre-seed"],
  [/\bseries\s*c\b/i, "Series C"],
  [/\bseries\s*b\b/i, "Series B"],
  [/\bseries\s*a\b/i, "Series A"],
  [/\bgrowth\b/i, "growth"],
  [/\bseed\b/i, "seed"],
];

const CATEGORY: [RegExp, string][] = [
  [/\b(ai|llm|gpt|machine learning|\bml\b)\b/i, "AI"],
  [/\b(crypto|web3|defi|nft|token)\b/i, "crypto"],
  [/\b(fintech|payment|payments|bank|lending)\b/i, "fintech"],
  [/\b(health[-\s]?tech|hipaa|\bphi\b|clinical|patient data)\b/i, "health-tech"],
  [/\b(marketplace|e-?commerce|retail)\b/i, "marketplace"],
  [/\b(saas|software|b2b|analytics|platform)\b/i, "SaaS"],
];

const WHY: [RegExp, string][] = [
  [/\b(coi|certificate of insurance)\b/i, "customer asked for a COI"],
  [/\b(enterprise|customer contract|security review)\b/i, "enterprise / customer deal"],
  [/\b(investor|board|fundraise)\b/i, "investor or board ask"],
  [/\bsoc\s*2\b/i, "SOC 2"],
  [/\b(lease|office|landlord)\b/i, "office lease"],
  [/\b(first hire|hiring|employees?)\b/i, "hiring"],
];

export function userHay(messages: readonly { role: string; content: string }[]): string {
  return messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.replace(/^\[(?:human|machine)\]\s*/i, ""))
    .join("\n");
}

export function extractKnown(messages: readonly { role: string; content: string }[]): KnownFacts {
  const hay = userHay(messages);
  const category = firstMatch(hay, CATEGORY);
  const stage = firstMatch(hay, STAGE);
  const whyNow = firstMatch(hay, WHY);
  const does = extractDoes(hay);
  const readyForRisks = Boolean(category && (does || hay.trim().length >= 12));
  return { does, stage, category, whyNow, readyForRisks };
}

/** Pin the model sees as system. Updated every turn. */
export function knownPin(messages: readonly Message[] | readonly { role: string; content: string }[]): string {
  const k = extractKnown(messages);
  const lines = ["Already known from this thread — do not re-ask any of this:"];
  if (k.does) lines.push("- product: " + k.does);
  if (k.stage) lines.push("- stage: " + k.stage);
  if (k.category) lines.push("- category: " + k.category);
  if (k.whyNow) lines.push("- why now: " + k.whyNow);
  if (lines.length === 1) {
    lines.push("- (nothing solid yet)");
    lines.push("Ask one question about what they build. Tie it to whatever they just said.");
    return lines.join("\n");
  }
  if (k.readyForRisks) {
    lines.push(
      "You already have what they do and the category. Call map_risks this turn with those values. Do not ask another discovery question.",
    );
  } else {
    lines.push(
      "Ask ONE question about something still missing. The question must mention a specific from their last message. Never ask for a field listed above.",
    );
  }
  return lines.join("\n");
}

function firstMatch(hay: string, rows: [RegExp, string][]): string | undefined {
  for (const [re, label] of rows) {
    if (re.test(hay)) return label;
  }
  return undefined;
}

function extractDoes(hay: string): string | undefined {
  const patterns = [
    /\bbuilding\s+([^.,\n]{6,90})/i,
    /\bmaking\s+([^.,\n]{6,90})/i,
    /\bwe (?:are|run|sell|do)\s+([^.,\n]{6,90})/i,
  ];
  for (const re of patterns) {
    const m = re.exec(hay);
    if (m?.[1]) return clean(m[1]);
  }
  const first = hay.split("\n").map((s) => s.trim()).find((s) => s.length >= 12);
  return first ? clean(first.slice(0, 120)) : undefined;
}

function clean(s: string): string {
  return s.replace(/\s+/g, " ").replace(/[,;:]+\s*$/, "").trim();
}
