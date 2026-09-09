/**
 * Pull apps, kinds, uses, FAQs, and docs out of Firecrawl markdown.
 */
import type { CorpusPage } from "../site/corpus.ts";
import { kindOf, usesFor } from "./kind.ts";

export interface AppRow {
  name: string;
  slug: string;
  tools: number;
  triggers: number;
  auth: string;
  managed: string;
  kind: string;
  uses: string[];
  faqs: { q: string; a: string }[];
  toolSlugs: string[];
  url: string;
  blurb: string;
}

export function parseCatalog(text: string): AppRow[] {
  const rows: AppRow[] = [];
  for (const line of text.split("\n")) {
    const m = /^\|\s*(.+?)\s*\|\s*`([^`]+)`\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|/.exec(line);
    if (!m) continue;
    const name = m[1]!.trim();
    if (/^toolkit$/i.test(name) || /^-{3,}$/.test(name)) continue;
    const slug = m[2]!.trim();
    const kind = kindOf(slug, name);
    rows.push({
      name,
      slug,
      tools: Number(m[3]),
      triggers: Number(m[4]),
      auth: m[5]!.trim(),
      managed: m[6]!.trim().replace(/—/g, "-"),
      kind,
      uses: usesFor(kind),
      faqs: [],
      toolSlugs: [],
      url: "https://docs.composio.dev/toolkits/" + slug.toLowerCase(),
      blurb: "",
    });
  }
  return rows;
}

export function parseAppPage(p: CorpusPage): Partial<AppRow> | null {
  if (/\/kb\//i.test(p.url)) return null;
  const slug = slugFromUrl(p.url);
  if (!slug) return null;
  const cat = field(p.text, "Category") || field(p.text, "category");
  const auth = field(p.text, "Auth") || "";
  const tools = Number(field(p.text, "Tools") || 0);
  const triggers = Number(field(p.text, "Triggers") || 0);
  const managed = field(p.text, "Composio-managed OAuth available?") || "";
  const kind = kindOf(slug, cat || "");
  const toolSlugs = toolSlugsFrom(p.text);
  const uses = usesFor(kind, toolSlugs);
  const blurb = firstParagraph(p.text);
  return {
    name: cleanName(p.title) || slug,
    slug: slug.toUpperCase(),
    tools: tools || toolSlugs.length,
    triggers,
    auth,
    managed,
    kind,
    uses,
    faqs: faqsFrom(p.text),
    toolSlugs,
    url: p.url.replace(/\.md$/, ""),
    blurb,
  };
}

export function pageRole(url: string): string {
  const u = url.toLowerCase();
  if (/\/kb\/toolkit\/[^/]+/.test(u) || /\/kb\/guide\/toolkits-/.test(u)) return "app";
  if (/\/toolkits\/[^/]+/.test(u) && !/toolkits\.md|\/toolkits\/?$/.test(u)) return "app";
  if (/toolkits/.test(u)) return "catalog";
  if (/\/authentication|oauth|connected-account/.test(u)) return "auth";
  if (/\/errors|debug|troubleshoot|faq/.test(u)) return "debug";
  if (/\/kb\//.test(u)) return "debug";
  if (/\/examples\//.test(u)) return "guide";
  if (/\/docs\//.test(u)) return "guide";
  return "guide";
}

export function appSlugFromUrl(url: string): string {
  return slugFromUrl(url);
}

export function mergeApps(catalog: AppRow[], pages: CorpusPage[]): AppRow[] {
  const bySlug = new Map<string, AppRow>();
  for (const row of catalog) bySlug.set(row.slug.toUpperCase(), row);
  for (const p of pages) {
    const parsed = parseAppPage(p);
    if (!parsed?.slug) continue;
    const key = parsed.slug.toUpperCase();
    const prev = bySlug.get(key);
    if (!prev) {
      bySlug.set(key, {
        name: parsed.name || key,
        slug: key,
        tools: parsed.tools || 0,
        triggers: parsed.triggers || 0,
        auth: parsed.auth || "",
        managed: parsed.managed || "",
        kind: parsed.kind || "other",
        uses: parsed.uses || [],
        faqs: parsed.faqs || [],
        toolSlugs: parsed.toolSlugs || [],
        url: parsed.url || p.url,
        blurb: parsed.blurb || "",
      });
      continue;
    }
    if (parsed.kind && parsed.kind !== "other" && prev.kind === "other") prev.kind = parsed.kind;
    if (parsed.auth) prev.auth = parsed.auth;
    if ((parsed.tools || 0) > prev.tools) prev.tools = parsed.tools || 0;
    if (parsed.faqs?.length) prev.faqs = parsed.faqs;
    if (parsed.toolSlugs?.length) {
      prev.toolSlugs = uniqueSlugs([...prev.toolSlugs, ...parsed.toolSlugs]);
      prev.uses = usesFor(prev.kind, prev.toolSlugs);
    }
    if (parsed.blurb && parsed.blurb.length > (prev.blurb || "").length) prev.blurb = parsed.blurb;
    if (parsed.url && /\/toolkits\/[^/]+$/.test(parsed.url) && !/\/kb\//.test(parsed.url)) prev.url = parsed.url;
    if (parsed.name && !/\[|\(http/.test(parsed.name)) prev.name = parsed.name;
  }
  return [...bySlug.values()];
}

function uniqueSlugs(xs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of xs) {
    if (seen.has(x)) continue;
    seen.add(x);
    out.push(x);
  }
  return out.slice(0, 80);
}

function cleanName(title: string): string {
  const t = title.replace(/\s+\|.*$/, "").trim();
  const m = /^\[([^\]]+)\]/.exec(t);
  return (m ? m[1]! : t).replace(/[-–]\s*Composio Toolkit.*$/i, "").trim();
}

function slugFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/\.md$/, "").replace(/\/+$/, "");
    const m =
      /\/toolkits\/([^/]+)$/.exec(path) ||
      /\/kb\/toolkit\/([^/]+)$/.exec(path) ||
      /\/kb\/guide\/toolkits-([^/]+)$/.exec(path);
    return m ? m[1]!.replace(/-/g, "_").toUpperCase() : "";
  } catch {
    return "";
  }
}

function field(text: string, label: string): string {
  const re = new RegExp("[-*]\\s*" + label + "\\s*:\\s*(.+)", "i");
  const m = re.exec(text);
  return m ? m[1]!.replace(/[`*]/g, "").trim() : "";
}

export function faqsFrom(text: string): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  const parts = text.split(/^### /m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const q = (nl < 0 ? part : part.slice(0, nl)).trim();
    if (!/^(why|how|when|what|error|401|403|quota)/i.test(q)) continue;
    const a = (nl < 0 ? "" : part.slice(nl + 1)).split(/^## /m)[0]!.trim().slice(0, 600);
    out.push({ q: q.replace(/\?+$/, "?"), a });
  }
  return out.slice(0, 16);
}

function toolSlugsFrom(text: string): string[] {
  const out: string[] = [];
  const re = /`([A-Z][A-Z0-9]+(?:_[A-Z0-9]+)+)`/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const slug = m[1]!;
    if (slug.includes("_") && !out.includes(slug)) out.push(slug);
  }
  return out.slice(0, 80);
}

/** Keep metadata, FAQ, and tool slugs. Drop long parameter tables. */
export function clipAppPage(text: string): string {
  if (text.length < 8000) return text;
  const faq = text.split(/^## /m).find((b) => /^frequently/i.test(b)) || "";
  const head = text.split(/^## /m)[0] || text.slice(0, 1200);
  const slugs = toolSlugsFrom(text);
  const slugBlock = slugs.length ? "\n\n## Tools\n\n" + slugs.map((s) => "- `" + s + "`").join("\n") : "";
  const faqBlock = faq ? "## " + faq.trim() : "";
  return (head.trim() + "\n\n" + faqBlock + slugBlock).trim();
}

function firstParagraph(text: string): string {
  const body = text.replace(/^---[\s\S]*?---\n/, "");
  for (const block of body.split(/\n\n+/)) {
    const t = block.replace(/[#*_`]/g, "").trim();
    if (t.length > 40 && !t.startsWith("|") && !t.startsWith("- Category")) return t.slice(0, 280);
  }
  return "";
}
