import type { SitePack } from "../site/types.ts";
import type { CompanyProfile, FormWalk, GithubRepo } from "./types.ts";

export function deriveProfile(site: SitePack, github?: GithubRepo, forms: FormWalk[] = []): CompanyProfile {
  const home = site.pages[0];
  const host = hostname(site.origin);
  const name = cleanName(github?.name || home?.title || host);
  const tagline =
    firstSentence(github?.description || home?.description || home?.text || "") || `Public site for ${name}`;
  const website = github?.homepage || site.origin;
  const offers = offersFrom(site, github);
  const ctas = ctasFrom(site, forms, github);
  return {
    name,
    tagline,
    origin: site.origin,
    website,
    github: github?.htmlUrl,
    audience: audienceFrom(tagline + " " + offers.join(" ")),
    offers,
    ctas,
  };
}

function offersFrom(site: SitePack, github?: GithubRepo): string[] {
  const out: string[] = [];
  if (github?.description) out.push(github.description);
  for (const h of (site.pages[0]?.headings ?? []).slice(0, 6)) {
    if (h.length > 4 && h.length < 80) out.push(h);
  }
  for (const f of site.flows) out.push(f.name + ": " + f.purpose);
  for (const t of github?.topics ?? []) out.push(t.replace(/-/g, " "));
  return dedupe(out).slice(0, 10);
}

function ctasFrom(site: SitePack, forms: FormWalk[], github?: GithubRepo): { label: string; url: string }[] {
  const out: { label: string; url: string }[] = [];
  for (const f of forms.slice(0, 6)) out.push({ label: f.name, url: f.url });
  if (github) out.push({ label: "GitHub", url: github.htmlUrl });
  if (!out.length && site.pages[0]) out.push({ label: "Home", url: site.pages[0].url });
  return out;
}

function audienceFrom(hay: string): string {
  const t = hay.toLowerCase();
  if (/developer|api|sdk|open.?source|github/.test(t)) return "developers and technical teams";
  if (/startup|founder|insur/.test(t)) return "startup founders";
  if (/enterprise|b2b|sales/.test(t)) return "business buyers";
  return "people who landed on this site";
}

function cleanName(raw: string): string {
  return raw.replace(/\s*[|\-–—].*$/, "").replace(/\.git$/i, "").trim() || "this company";
}

function firstSentence(s: string): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (!t) return "";
  const cut = t.split(/(?<=[.!?])\s/)[0] || t;
  return cut.slice(0, 180);
}

function hostname(origin: string): string {
  try {
    return new URL(origin).hostname.replace(/^www\./, "");
  } catch {
    return origin;
  }
}

function dedupe(xs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of xs) {
    const k = x.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}
