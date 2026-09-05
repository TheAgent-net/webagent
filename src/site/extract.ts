import type { FormShot, PageShot } from "./types.ts";

const SKIP = /\.(png|jpe?g|gif|webp|svg|ico|pdf|zip|mp4|mp3|woff2?|css|js)(\?|$)/i;
const AUTH_PATH = /\/(login|signin|sign-in|auth|account\/login|sso)\b/i;

export function sameOrigin(href: string, origin: string): string | null {
  try {
    const u = new URL(href, origin);
    if (u.origin !== new URL(origin).origin) return null;
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (SKIP.test(u.pathname)) return null;
    if (u.pathname.startsWith("/logout") || u.pathname.includes("sign-out")) return null;
    u.hash = "";
    let path = u.pathname;
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    return u.origin + path + u.search;
  } catch {
    return null;
  }
}

export function looksLikeAuth(page: Pick<PageShot, "url" | "status" | "title" | "forms" | "text">): boolean {
  if (page.status === 401 || page.status === 403) return true;
  if (AUTH_PATH.test(page.url)) return true;
  if (page.forms.some((f) => f.fields.some((x) => x.type === "password"))) return true;
  const t = (page.title + " " + page.text.slice(0, 400)).toLowerCase();
  return /\bsign in\b|\blog in\b|\bpassword\b/.test(t) && /\bemail\b|\busername\b|\baccount\b/.test(t);
}

export async function extractPage(html: string, url: string, status: number): Promise<PageShot> {
  const title: string[] = [];
  const description: string[] = [];
  const headings: string[] = [];
  const texts: string[] = [];
  const links: string[] = [];
  const forms: FormShot[] = [];
  let form: FormShot | null = null;
  let buf = "";

  const flush = (into: string[]) => {
    const s = buf.replace(/\s+/g, " ").trim();
    buf = "";
    if (s) into.push(s);
  };

  const rw = new HTMLRewriter()
    .on("title", {
      text(t) {
        buf += t.text;
        if (t.lastInTextNode) flush(title);
      },
    })
    .on("meta", {
      element(el) {
        const name = (el.getAttribute("name") || el.getAttribute("property") || "").toLowerCase();
        if (name === "description" || name === "og:description") {
          const c = el.getAttribute("content");
          if (c) description.push(c.trim());
        }
      },
    })
    .on("h1, h2, h3", {
      text(t) {
        buf += t.text;
        if (t.lastInTextNode) flush(headings);
      },
    })
    .on("p, li, label, button, a", {
      text(t) {
        buf += t.text;
        if (t.lastInTextNode) flush(texts);
      },
    })
    .on("a[href]", {
      element(el) {
        const href = el.getAttribute("href");
        if (href) links.push(href);
      },
    })
    .on("form", {
      element(el) {
        form = {
          action: el.getAttribute("action") || url,
          method: (el.getAttribute("method") || "get").toLowerCase(),
          fields: [],
        };
        forms.push(form);
      },
    })
    .on("form input, form select, form textarea", {
      element(el) {
        if (!form) return;
        const name = el.getAttribute("name") || el.getAttribute("id") || "";
        const type = (el.getAttribute("type") || "text").toLowerCase();
        if (name) form.fields.push({ name, type });
      },
    });

  await rw.transform(new Response(html)).text();

  const origin = new URL(url).origin;
  const abs: string[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < links.length; i++) {
    const n = sameOrigin(links[i]!, origin);
    if (n && !seen.has(n)) {
      seen.add(n);
      abs.push(n);
    }
  }

  const shot: PageShot = {
    url,
    status,
    title: title[0] || "",
    description: description[0] || "",
    headings: headings.slice(0, 24),
    text: texts.join(" ").slice(0, 4000),
    links: abs,
    forms,
    gated: false,
  };
  shot.gated = looksLikeAuth(shot);
  return shot;
}

export function parseSitemap(xml: string, origin: string): string[] {
  const out: string[] = [];
  const re = /<loc>\s*([^<]+)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const n = sameOrigin(m[1]!.trim(), origin);
    if (n) out.push(n);
  }
  return out;
}

export function parseRobots(txt: string, origin: string): string[] {
  const out: string[] = [];
  for (const line of txt.split(/\r?\n/)) {
    const m = /^\s*sitemap:\s*(\S+)/i.exec(line);
    if (m) {
      const n = sameOrigin(m[1]!, origin);
      if (n) out.push(n);
    }
  }
  return out;
}
