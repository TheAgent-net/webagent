/**
 * Route: the admin dashboard under `/admin`. Plug it into `cloud(tenants, { routes })`.
 *
 * - `/admin/login` takes a key. A good key sets a signed session cookie.
 * - The super admin sees every tenant. A tenant admin sees only its own tenant. Other tenants are 404.
 * - Every POST needs the CSRF token of the session and a same-origin request.
 */
import type { Route } from "../host/cloud.ts";
import { publicUrl } from "../host/host.ts";
import type { Tenants } from "../host/tenant.ts";
import { hashIp } from "../host/visitor.ts";
import type { Tenant } from "../store/store.ts";
import {
  csrfToken,
  getCookie,
  hashKey,
  isSecure,
  listKeys,
  makeCookie,
  matchKey,
  randomToken,
  readSession,
  sameText,
  SESSION_TTL,
  signSession,
  superMark,
  type Session,
} from "./auth.ts";
import { conversationsPage, transcriptPage } from "./conversation.ts";
import { conversationsCsv, turnsCsv } from "./csv.ts";
import { overviewPage } from "./overview.ts";
import { empty, html, MARK, note, num, page, raw, table, type Raw, type Tab, type View } from "./page.ts";
import { questionsPage } from "./question.ts";
import { readSettings, settingsPage } from "./settings.ts";
import { trafficPage } from "./traffic.ts";

export interface AdminOpts {
  /** Super admin key. Default: `WEBAGENT_ADMIN_KEY`. Empty turns super login off. */
  key?: string;
  /** HMAC secret for sessions. Default: `WEBAGENT_SESSION_SECRET`, else a random value at start. */
  secret?: string;
  /** Public URL for install snippets. Default: `WEBAGENT_PUBLIC_URL`, else the request origin. */
  publicUrl?: string;
  /** Clock. Tests set it. */
  now?: () => number;
}

const SESSION_COOKIE = "wa_admin";
const LOGIN_COOKIE = "wa_login";
const DAY_MS = 86_400_000;
const TENANT_PATH = /^\/admin\/t\/([a-z0-9][a-z0-9_-]{0,62})(\/.*)?$/;
/** Most failed logins from one client in one window. */
const LOGIN_TRIES = 10;
const LOGIN_WINDOW = 15 * 60 * 1000;

export function adminRoute(tenants: Tenants, opts: AdminOpts = {}): Route {
  const adminKey = opts.key ?? process.env.WEBAGENT_ADMIN_KEY ?? "";
  let secret = opts.secret ?? process.env.WEBAGENT_SESSION_SECRET ?? "";
  if (!secret) {
    secret = randomToken() + randomToken();
    console.warn("admin: WEBAGENT_SESSION_SECRET is not set. Sessions end when the service stops.");
  }
  const now = opts.now ?? Date.now;
  const store = tenants.store;
  const failures = new Map<string, { n: number; until: number }>();

  /** The session of the request, if it is valid and its key still exists. */
  function getSession(req: Request): Session | undefined {
    const s = readSession(secret, getCookie(req, SESSION_COOKIE), now());
    if (!s) return undefined;
    if (s.role === "super") return adminKey && s.key === superMark(adminKey) ? s : undefined;
    const tenant = store.getTenant(s.tenant!);
    return tenant && listKeys(tenant).some((k) => k.hash.slice(0, 16) === s.key) ? s : undefined;
  }

  /** Check a key. Return the new session, or undefined. */
  function checkKey(key: string): Session | undefined {
    const base = { nonce: randomToken(), exp: now() + SESSION_TTL };
    if (adminKey && sameText(key, adminKey)) return { role: "super", key: superMark(adminKey), ...base };
    const dot = key.indexOf(".");
    const tenant = dot > 0 ? store.getTenant(key.slice(0, dot)) : undefined;
    if (!tenant) {
      hashKey(key, "pad"); // Spend the same time as a real check.
      return undefined;
    }
    const hit = matchKey(listKeys(tenant), key);
    return hit ? { role: "tenant", tenant: tenant.id, key: hit.hash.slice(0, 16), ...base } : undefined;
  }

  function isBlocked(client: string): boolean {
    const f = failures.get(client);
    if (!f) return false;
    if (f.until < now()) {
      failures.delete(client);
      return false;
    }
    return f.n >= LOGIN_TRIES;
  }

  function addFailure(client: string): void {
    const f = failures.get(client);
    if (!f || f.until < now()) failures.set(client, { n: 1, until: now() + LOGIN_WINDOW });
    else f.n++;
    if (failures.size > 10_000) failures.clear();
  }

  async function handle(req: Request, url: URL, nonce: string): Promise<Response> {
    const path = url.pathname.length > 6 ? url.pathname.replace(/\/+$/, "") : url.pathname;
    const ours = (opts.publicUrl ?? publicUrl(req, url.origin)).replace(/\/+$/, "");

    if (path === "/admin/login") return login(req, url, nonce, ours);

    const session = getSession(req);
    if (!session) {
      if (req.method === "GET" && !path.endsWith(".csv")) {
        return redirect("/admin/login?next=" + encodeURIComponent(path + url.search));
      }
      return text("Sign in first.", 401);
    }
    const csrf = csrfToken(secret, session.nonce);

    let form: FormData | undefined;
    if (req.method === "POST") {
      if (!isSameOrigin(req, url, ours)) return text("Cross-site request blocked.", 403);
      try {
        form = await req.formData();
      } catch {
        return text("Bad form.", 400);
      }
      if (!sameText(String(form.get("csrf") ?? ""), csrf)) return text("CSRF token is missing or wrong.", 403);
    } else if (req.method !== "GET" && req.method !== "HEAD") {
      return text("Method not allowed.", 405);
    }

    if (path === "/admin/logout") {
      if (!form) return text("Method not allowed.", 405);
      return redirect("/admin/login", [makeCookie(SESSION_COOKIE, "", { secure: isSecure(req), maxAge: 0 })]);
    }

    if (path === "/admin") {
      if (session.role === "tenant") return redirect("/admin/t/" + session.tenant);
      return htmlPage(page({ title: "Sites", nonce, csrf, body: tenantList(tenants.list()) }));
    }

    const hit = TENANT_PATH.exec(path);
    const tenant = hit ? store.getTenant(hit[1]!) : undefined;
    if (!hit || !tenant || (session.role === "tenant" && session.tenant !== tenant.id)) return notFound(nonce, csrf);
    const rest = hit[2] ?? "";
    const base = "/admin/t/" + tenant.id;
    const days = [7, 30, 90].includes(Number(url.searchParams.get("days"))) ? Number(url.searchParams.get("days")) : 30;
    const t = now();
    const view: View = {
      store,
      tenant,
      base,
      days,
      since: Math.floor(t / DAY_MS) * DAY_MS - (days - 1) * DAY_MS,
      now: t,
      query: url.searchParams,
      csrf,
      ours,
    };
    const shell = (title: string, active: string, body: Raw) =>
      htmlPage(
        page({
          title,
          nonce,
          csrf,
          tenant: tenant.name,
          home: session.role === "super" ? "/admin" : base,
          tabs: tabs(base, active, days),
          body,
        }),
      );

    if (rest === "/reload" && form) {
      tenants.reload(tenant.id);
      return redirect(base + "/settings?ok=reloaded");
    }
    if (rest === "/settings" && form) {
      const result = readSettings(store, tenant, form);
      if (result.errors.length) {
        return shell("Settings", "settings", settingsPage(view, { errors: result.errors }));
      }
      store.putTenant(result.tenant);
      tenants.reload(tenant.id);
      return redirect(base + "/settings?ok=saved");
    }
    if (form) return text("Method not allowed.", 405);

    if (rest === "") return shell("Overview", "overview", overviewPage(view));
    if (rest === "/conversations") return shell("Conversations", "conversations", conversationsPage(view));
    if (rest.startsWith("/c/")) {
      let name = "";
      try {
        name = decodeURIComponent(rest.slice(3));
      } catch {
        return notFound(nonce, csrf);
      }
      const body = transcriptPage(view, name);
      return body ? shell("Transcript", "conversations", body) : notFound(nonce, csrf);
    }
    if (rest === "/traffic") return shell("Agent traffic", "traffic", trafficPage(view));
    if (rest === "/questions") return shell("Questions", "questions", questionsPage(view));
    if (rest === "/settings") {
      const ok = url.searchParams.get("ok");
      const notice = ok === "saved" ? "Settings saved. The agent reloads on the next request." : ok === "reloaded" ? "The agent reloads on the next request." : undefined;
      return shell("Settings", "settings", settingsPage(view, { ok: notice }));
    }
    if (rest === "/export.csv") {
      const what = url.searchParams.get("what") === "turns" ? "turns" : "conversations";
      const body = what === "turns" ? turnsCsv(store, tenant.id, view.since) : conversationsCsv(store, tenant.id, view.since);
      const name = `${tenant.id}-${what}-${days}d.csv`;
      return new Response(body, {
        headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${name}"` },
      });
    }
    return notFound(nonce, csrf);
  }

  async function login(req: Request, url: URL, nonce: string, ours: string): Promise<Response> {
    const next = safeNext(url.searchParams.get("next"));
    if (req.method === "GET") {
      if (getSession(req)) return redirect(next);
      const token = randomToken();
      return htmlPage(page({ title: "Sign in", nonce, body: loginForm(token, next) }), 200, [
        makeCookie(LOGIN_COOKIE, token, { secure: isSecure(req), maxAge: 3600 }),
      ]);
    }
    if (req.method !== "POST") return text("Method not allowed.", 405);
    if (!isSameOrigin(req, url, ours)) return text("Cross-site request blocked.", 403);
    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return text("Bad form.", 400);
    }
    const cookie = getCookie(req, LOGIN_COOKIE) ?? "";
    const sent = String(form.get("csrf") ?? "");
    if (!cookie || !sameText(cookie, sent)) return text("CSRF token is missing or wrong. Open the sign-in page again.", 403);
    const target = safeNext(String(form.get("next") ?? "")) || next;
    const client = hashIp(req) ?? "local";
    if (isBlocked(client)) return text("Too many failed sign-ins. Try again later.", 429);
    const key = String(form.get("key") ?? "").trim();
    const session = key ? checkKey(key) : undefined;
    if (!session) {
      addFailure(client);
      const token = randomToken();
      return htmlPage(page({ title: "Sign in", nonce, body: loginForm(token, target, "This key is not valid.") }), 401, [
        makeCookie(LOGIN_COOKIE, token, { secure: isSecure(req), maxAge: 3600 }),
      ]);
    }
    failures.delete(client);
    const home = target === "/admin" && session.role === "tenant" ? "/admin/t/" + session.tenant : target;
    return redirect(home, [
      makeCookie(SESSION_COOKIE, signSession(secret, session), { secure: isSecure(req), maxAge: SESSION_TTL / 1000 }),
      makeCookie(LOGIN_COOKIE, "", { secure: isSecure(req), maxAge: 0 }),
    ]);
  }

  function tenantList(list: Tenant[]): Raw {
    const since = Math.floor(now() / DAY_MS) * DAY_MS - 29 * DAY_MS;
    return html`<div class="head"><div><h1>Sites</h1><p class="sub">${list.length} tenants · last 30 days</p></div></div>
<section class="card">${list.length
      ? table(
          ["Site", "Id", "Human", "Agent", "Handoffs", "State"],
          list.map((t) => {
            const s = store.sumConversations(t.id, since);
            return [
              html`<a href="/admin/t/${t.id}">${t.name}</a>`,
              html`<code>${t.id}</code>`,
              num(s.human),
              num(s.agent),
              num(s.handoff),
              t.settings.paused ? html`<span class="badge warn">paused</span>` : html`<span class="badge good">live</span>`,
            ];
          }),
          [2, 3, 4],
        )
      : empty("No tenants yet. Add one with: webagent tenant add <id> --pack <dir>")}</section>`;
  }

  return async (req, url) => {
    if (url.pathname !== "/admin" && !url.pathname.startsWith("/admin/")) return null;
    const nonce = randomToken();
    let res: Response;
    try {
      res = await handle(req, url, nonce);
    } catch (err) {
      console.error("admin failed:", err instanceof Error ? err.message : err);
      res = htmlPage(
        page({
          title: "Error",
          nonce,
          body: html`<h1>This page failed to load</h1><p class="sub">The server had an error. Load the page again. If it fails again, read the service log.</p>`,
        }),
        500,
      );
    }
    return secure(res, nonce);
  };
}

function tabs(base: string, active: string, days: number): Tab[] {
  const q = days === 30 ? "" : "?days=" + days;
  return [
    { href: base + q, label: "Overview", icon: "overview", active: active === "overview" },
    { href: base + "/conversations" + q, label: "Conversations", icon: "conversations", active: active === "conversations" },
    { href: base + "/traffic" + q, label: "Agent traffic", icon: "traffic", active: active === "traffic" },
    { href: base + "/questions" + q, label: "Questions", icon: "questions", active: active === "questions" },
    { href: base + "/settings", label: "Install and settings", icon: "settings", active: active === "settings" },
  ];
}

function loginForm(token: string, next: string, error?: string): Raw {
  return html`<div class="login"><div class="card" style="padding:24px">
  <p class="brand">${raw(MARK)}agentnet</p>
  <h1>Sign in</h1><p class="sub">Enter the admin key for your site.</p>
  ${error ? html`<div style="margin-top:16px">${note(error, "bad")}</div>` : ""}
  <form method="post" action="/admin/login" style="margin-top:16px">
    <input type="hidden" name="csrf" value="${token}"><input type="hidden" name="next" value="${next}">
    <div class="field"><label for="key">Admin key</label><input id="key" type="password" name="key" autocomplete="current-password" required autofocus></div>
    <button style="width:100%;justify-content:center">Sign in</button>
  </form></div></div>`;
}

/** Keep `next` inside `/admin`. */
function safeNext(next: string | null): string {
  if (!next || !/^\/admin(?:[/?]|$)/.test(next) || next.startsWith("//") || next.includes("\\")) return "/admin";
  return next;
}

/** Block cross-site posts. Check `Origin`, then `Sec-Fetch-Site`. */
function isSameOrigin(req: Request, url: URL, ours: string): boolean {
  const origin = req.headers.get("origin");
  if (origin && origin !== "null") return origin === url.origin || origin === ours || origin === publicUrl(req, url.origin);
  if (origin === "null") return false;
  const site = req.headers.get("sec-fetch-site");
  return !site || site === "same-origin" || site === "none";
}

function htmlPage(body: string, status = 200, cookies: string[] = []): Response {
  const headers = new Headers({ "Content-Type": "text/html; charset=utf-8" });
  for (const c of cookies) headers.append("Set-Cookie", c);
  return new Response(body, { status, headers });
}

function redirect(to: string, cookies: string[] = []): Response {
  const headers = new Headers({ Location: to });
  for (const c of cookies) headers.append("Set-Cookie", c);
  return new Response(null, { status: 303, headers });
}

function text(body: string, status: number): Response {
  return new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

function notFound(nonce: string, csrf: string): Response {
  return htmlPage(
    page({ title: "Not found", nonce, csrf, body: html`<h1>Not found</h1><p class="sub">This page does not exist, or your key cannot open it. <a href="/admin">Go to your sites</a>.</p>` }),
    404,
  );
}

/** Add security headers. Scripts run only with the page nonce. */
function secure(res: Response, nonce: string): Response {
  const h = res.headers;
  h.set(
    "Content-Security-Policy",
    [
      "default-src 'none'",
      `script-src 'nonce-${nonce}'`,
      "style-src 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "base-uri 'none'",
    ].join("; "),
  );
  h.set("X-Content-Type-Options", "nosniff");
  h.set("X-Frame-Options", "DENY");
  h.set("Referrer-Policy", "same-origin");
  h.set("Cache-Control", "no-store");
  return res;
}
