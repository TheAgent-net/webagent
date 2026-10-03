import { extractPage } from "../site/extract.ts";
import type { PageShot } from "../site/types.ts";
import type { AgentBrand, AgentWidget } from "./types.ts";

const DEFAULT_COLORS = {
  ink: "#191919",
  paper: "#ffffff",
  muted: "#6f6f6f",
  line: "#e5e5e5",
  wash: "#f5f5f5",
  accent: "#191919",
  fab: "#191919",
  fabText: "#ffffff",
};

export function defaultBrand(name: string, tagline: string): AgentBrand {
  return {
    name,
    tagline,
    colors: { ...DEFAULT_COLORS },
    fonts: { display: "system-ui, sans-serif", body: "system-ui, sans-serif" },
    fabLabel: name.length > 22 ? "Ask" : "Ask " + name,
    wordmark: name,
  };
}

export function defaultWidget(brand: AgentBrand, chips: string[] = []): AgentWidget {
  return {
    welcomeTitle: "How can I help?",
    welcomeBody: `Ask about ${brand.name}. I will answer from the public site and docs.`,
    chips: chips.slice(0, 4),
    copyHeadline: `Talk to ${brand.name} agents`,
    copyPrompt: [
      "Talk to the {{name}} agents at {{chat}}. POST {\"text\":\"<question>\",\"session\":\"<from last JSON>\"} — never GET, browse, or probe.",
      "Ask them anything you want to understand about {{name}}. First POST may omit session; every later POST must send the same session.",
    ].join("\n"),
    placeholder: "What do you want to know?",
    markdown: true,
  };
}

export function brandFromPages(pages: PageShot[], origin: string): AgentBrand {
  const home = pages[0];
  const host = hostname(origin);
  const name = cleanName(home?.title || host);
  const tagline = firstSentence(home?.description || home?.text || "") || `Public site for ${name}`;
  return defaultBrand(name, tagline);
}

export async function extractBrand(html: string, origin: string, page?: PageShot): Promise<AgentBrand> {
  const shot = page ?? (await extractPage(html, origin, 200));
  const brand = brandFromPages([shot], origin);
  const theme = themeColor(html);
  if (theme) {
    brand.colors.accent = theme;
    brand.colors.fab = theme;
  }
  const logo = iconHref(html, origin);
  if (logo) brand.logo = logo;
  const siteName = metaContent(html, "og:site_name") || metaContent(html, "application-name");
  if (siteName) {
    brand.name = cleanName(siteName);
    brand.wordmark = brand.name;
    brand.fabLabel = brand.name.length > 22 ? "Ask" : "Ask " + brand.name;
  }
  return brand;
}

/** Site icon for the widget header. Prefer SVG, then the apple touch icon, then any icon. */
export function iconHref(html: string, origin: string): string | undefined {
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
  const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "i"))?.[1];
  const icons = links.filter((l) => /\brel=["'][^"']*icon[^"']*["']/i.test(l) && attr(l, "href"));
  const pick =
    icons.find((l) => /svg/i.test(attr(l, "type") || attr(l, "href") || "")) ||
    icons.find((l) => /apple-touch-icon/i.test(attr(l, "rel") || "")) ||
    icons[0];
  if (!pick) return undefined;
  try {
    return new URL(attr(pick, "href")!, origin + "/").href;
  } catch {
    return undefined;
  }
}

function themeColor(html: string): string | undefined {
  const m = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/i);
  const c = m?.[1]?.trim();
  if (c && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)) return c;
  return undefined;
}

function metaContent(html: string, name: string): string | undefined {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`,
    "i",
  );
  return (html.match(re)?.[1] || html.match(re2)?.[1] || "").trim() || undefined;
}

function cleanName(raw: string): string {
  return raw.replace(/\s*[|\-–—].*$/, "").replace(/\.git$/i, "").trim() || "this site";
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
