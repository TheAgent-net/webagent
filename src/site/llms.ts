import type { PageShot } from "./types.ts";

export interface DocLink {
  title: string;
  url: string;
  mdUrl: string;
  description: string;
}

/** Parse a public llms.txt markdown index into page links. */
export function parseLlmsIndex(text: string): DocLink[] {
  const out: DocLink[] = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)(?::\s*(.*))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const title = m[1]!.trim();
    let url = m[2]!.trim();
    const description = (m[3] || "").trim();
    if (/llms(-full)?\.txt$/i.test(url) || /\/openapi/i.test(url)) continue;
    const mdUrl = url.endsWith(".md") ? url : url.replace(/\/?$/, "") + ".md";
    url = mdUrl.replace(/\.md$/, "");
    out.push({ title, url, mdUrl, description });
  }
  return dedupe(out);
}

export function rankDocLinks(links: DocLink[], priority: string[]): DocLink[] {
  const score = (l: DocLink) => {
    const path = pathOf(l.mdUrl);
    const i = priority.findIndex((p) => path.includes(p));
    return i >= 0 ? i : 1000 + path.length;
  };
  return links.slice().sort((a, b) => score(a) - score(b));
}

export function pageFromMarkdown(url: string, md: string, status = 200): PageShot {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const headings: string[] = [];
  const texts: string[] = [];
  const links: string[] = [];
  let title = "";
  for (const line of lines) {
    const h = /^(#{1,3})\s+(.+)$/.exec(line);
    if (h) {
      const t = stripMd(h[2]!);
      headings.push(t);
      if (!title && h[1] === "#") title = t;
      continue;
    }
    for (const lm of line.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)) links.push(lm[2]!);
    const plain = stripMd(line).trim();
    if (plain) texts.push(plain);
  }
  const htmlUrl = url.endsWith(".md") ? url.slice(0, -3) : url;
  return {
    url: htmlUrl,
    status,
    title: title || headings[0] || htmlUrl,
    description: texts.find((t) => t.length > 40 && !t.startsWith(">")) || texts[0] || "",
    headings: headings.slice(0, 24),
    text: texts.join(" ").replace(/\s+/g, " ").slice(0, 5000),
    links,
    forms: [],
    gated: status === 401 || status === 403,
  };
}

function stripMd(s: string): string {
  return s
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~#>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pathOf(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function dedupe(links: DocLink[]): DocLink[] {
  const seen = new Set<string>();
  const out: DocLink[] = [];
  for (const l of links) {
    if (seen.has(l.mdUrl)) continue;
    seen.add(l.mdUrl);
    out.push(l);
  }
  return out;
}
