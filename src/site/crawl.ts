import { extractPage, parseRobots, parseSitemap, sameOrigin } from "./extract.ts";
import type { AuthAsk, AuthGrant, IngestOpts, PageShot } from "./types.ts";

const UA = "webagent-ingest/0.4";

export interface CrawlState {
  origin: string;
  pages: PageShot[];
  pending: string[];
  seen: Set<string>;
  cookies: string;
  authAsk?: AuthAsk;
}

export async function crawlSite(start: string, opts: IngestOpts = {}): Promise<CrawlState> {
  const origin = new URL(start).origin;
  const max = opts.maxPages ?? 80;
  const fetchFn = opts.fetch ?? fetch;
  const seen = new Set<string>();
  const pending: string[] = [];
  const pages: PageShot[] = [];
  let cookies = opts.auth?.cookies ?? "";

  const enqueue = (href: string) => {
    const n = sameOrigin(href, origin);
    if (!n || seen.has(n)) return;
    seen.add(n);
    pending.push(n);
  };

  enqueue(start);
  await seedMaps(origin, fetchFn, enqueue);

  while (pending.length && pages.length < max) {
    const url = pending.shift()!;
    const page = await getPage(url, fetchFn, cookies);
    pages.push(page);
    for (let i = 0; i < page.links.length; i++) enqueue(page.links[i]!);

    if (page.gated && !cookies) {
      const ask = askFrom(page);
      if (opts.onAuth) {
        const grant = await opts.onAuth(ask);
        if (grant) {
          cookies = await applyGrant(page, grant, fetchFn, cookies);
          enqueue(url);
          continue;
        }
      }
      // Keep walking public pages; ask at the end so the owner can unlock the rest.
      continue;
    }
  }

  const gate = pages.find((p) => p.gated);
  return { origin, pages, pending, seen, cookies, authAsk: cookies ? undefined : gate ? askFrom(gate) : undefined };
}

export async function resumeCrawl(state: CrawlState, grant: AuthGrant, opts: IngestOpts = {}): Promise<CrawlState> {
  const fetchFn = opts.fetch ?? fetch;
  const max = opts.maxPages ?? 80;
  let cookies = await applyGrant(state.pages[state.pages.length - 1], grant, fetchFn, state.cookies);
  const pending = state.pending.slice();
  const seen = state.seen;
  const pages = state.pages.slice();
  const origin = state.origin;

  const enqueue = (href: string) => {
    const n = sameOrigin(href, origin);
    if (!n || seen.has(n)) return;
    seen.add(n);
    pending.push(n);
  };

  const gate = pages.find((p) => p.gated);
  if (gate) enqueue(gate.url);

  while (pending.length && pages.length < max) {
    const url = pending.shift()!;
    const page = await getPage(url, fetchFn, cookies);
    pages.push(page);
    for (let i = 0; i < page.links.length; i++) enqueue(page.links[i]!);
  }

  return { origin, pages, pending, seen, cookies };
}

async function seedMaps(origin: string, fetchFn: typeof fetch, enqueue: (h: string) => void): Promise<void> {
  try {
    const robots = await fetchFn(origin + "/robots.txt", { headers: { "User-Agent": UA } });
    if (robots.ok) {
      const maps = parseRobots(await robots.text(), origin);
      for (const m of maps) {
        const xml = await fetchFn(m, { headers: { "User-Agent": UA } });
        if (xml.ok) for (const loc of parseSitemap(await xml.text(), origin)) enqueue(loc);
      }
    }
  } catch {
    /* optional */
  }
  try {
    const sm = await fetchFn(origin + "/sitemap.xml", { headers: { "User-Agent": UA } });
    if (sm.ok) for (const loc of parseSitemap(await sm.text(), origin)) enqueue(loc);
  } catch {
    /* optional */
  }
}

async function getPage(url: string, fetchFn: typeof fetch, cookies: string): Promise<PageShot> {
  const headers: Record<string, string> = { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" };
  if (cookies) headers.Cookie = cookies;
  try {
    const res = await fetchFn(url, { headers, redirect: "follow" });
    const ctype = res.headers.get("content-type") ?? "";
    if (!ctype.includes("html") && !ctype.includes("xml") && ctype !== "") {
      return emptyPage(url, res.status);
    }
    const html = await res.text();
    return extractPage(html, finalUrl(res, url), res.status);
  } catch (e) {
    const p = emptyPage(url, 0);
    p.text = e instanceof Error ? e.message : String(e);
    return p;
  }
}

function finalUrl(res: Response, fallback: string): string {
  try {
    return res.url || fallback;
  } catch {
    return fallback;
  }
}

function emptyPage(url: string, status: number): PageShot {
  return { url, status, title: "", description: "", headings: [], text: "", links: [], forms: [], gated: status === 401 || status === 403 };
}

function askFrom(page: PageShot): AuthAsk {
  const login = page.forms.find((f) => f.fields.some((x) => x.type === "password"));
  return {
    url: page.url,
    reason: page.status === 401 || page.status === 403 ? "status" : login ? "login_form" : "challenge",
    message: "This part of the site needs a sign-in. Send cookies or username/password to keep crawling.",
    fields: login?.fields ?? [{ name: "cookies", type: "text" }],
  };
}

async function applyGrant(page: PageShot | undefined, grant: AuthGrant, fetchFn: typeof fetch, cookies: string): Promise<string> {
  if (grant.cookies) return mergeCookies(cookies, grant.cookies);
  if (grant.user && grant.password && page) {
    const form = page.forms.find((f) => f.fields.some((x) => x.type === "password"));
    if (form) {
      const body = new URLSearchParams();
      for (const f of form.fields) {
        if (f.type === "password") body.set(f.name, grant.password);
        else if (f.type === "email" || /user|login|email/i.test(f.name)) body.set(f.name, grant.user);
      }
      const action = sameOrigin(form.action, page.url) ?? page.url;
      const res = await fetchFn(action, {
        method: form.method === "get" ? "GET" : "POST",
        headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded", Cookie: cookies },
        body: form.method === "get" ? undefined : body,
        redirect: "manual",
      });
      const set = res.headers.getSetCookie?.() ?? [];
      for (const c of set) cookies = mergeCookies(cookies, c.split(";")[0]!);
    }
  }
  return cookies;
}

function mergeCookies(a: string, b: string): string {
  const map = new Map<string, string>();
  for (const part of (a + "; " + b).split(";")) {
    const s = part.trim();
    const i = s.indexOf("=");
    if (i > 0) map.set(s.slice(0, i), s.slice(i + 1));
  }
  return [...map].map(([k, v]) => k + "=" + v).join("; ");
}
