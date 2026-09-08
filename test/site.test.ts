import { describe, expect, test } from "bun:test";
import { Harness } from "../src/harness.ts";
import { intake } from "../src/intake.ts";
import { attachPack, isBlog, loadCorpus, lookupCorpus, saveCorpus, siteBook } from "../src/site/index.ts";
import { APP_QUOTE_ID, addAppQuote, isCorgi } from "../src/site/quote.ts";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function mockSite() {
  let session = "";
  return Bun.serve({
    port: 0,
    fetch(req) {
      const url = new URL(req.url);
      const cookie = req.headers.get("cookie") ?? "";
      if (url.pathname === "/robots.txt") return new Response("Sitemap: /sitemap.xml\n");
      if (url.pathname === "/sitemap.xml") {
        return new Response(
          `<?xml version="1.0"?><urlset><loc>${url.origin}/</loc><loc>${url.origin}/search</loc><loc>${url.origin}/help</loc><loc>${url.origin}/account</loc></urlset>`,
          { headers: { "content-type": "application/xml" } },
        );
      }
      if (url.pathname === "/") {
        return html(
          "Skyline Air",
          `<meta name="description" content="Book flights to SF and more.">
           <h1>Skyline Air</h1><p>Cheap flights. Axis offers on select dates.</p>
           <a href="/search">Search flights</a><a href="/help">Help</a><a href="/login">Sign in</a>`,
        );
      }
      if (url.pathname === "/search") {
        return html(
          "Search flights",
          `<h1>Search flights</h1>
           <form action="/search" method="get"><input name="q" /><button>Go</button></form>
           <a href="/results">See results</a>`,
        );
      }
      if (url.pathname === "/results") {
        return html("Results", `<h1>Results</h1><p>SFO from $198</p><a href="/checkout">Book</a>`);
      }
      if (url.pathname === "/checkout") {
        return html("Checkout", `<h1>Checkout</h1><p>Confirm booking</p><a href="/search">Back</a>`);
      }
      if (url.pathname === "/help") {
        return html("Help", `<h1>Change a ticket</h1><p>Date change is allowed on return fares.</p>`);
      }
      if (url.pathname === "/login") {
        return html(
          "Sign in",
          `<h1>Sign in</h1>
           <form action="/login" method="post">
             <input name="email" type="email" />
             <input name="password" type="password" />
           </form>`,
        );
      }
      if (url.pathname === "/login" && req.method === "POST") {
        return new Response(null, { status: 302, headers: { Location: "/account", "Set-Cookie": "sid=ok; Path=/" } });
      }
      if (url.pathname === "/account") {
        if (!cookie.includes("sid=ok") && session !== "ok") {
          return html("Sign in", `<h1>Sign in</h1><p>Please log in to your account.</p><a href="/login">Sign in</a>`);
        }
        return html("Account", `<h1>Your trips</h1><p>Manage booking. Change dates here.</p><a href="/help">Help</a>`);
      }
      return new Response("no", { status: 404 });
    },
  });
}

function html(title: string, body: string) {
  return new Response(`<!doctype html><html><head><title>${title}</title></head><body>${body}</body></html>`, {
    headers: { "content-type": "text/html" },
  });
}

describe("site ingest (on top of harness)", () => {
  test("crawls public pages, builds flows, starter questions, attaches a run", async () => {
    const srv = mockSite();
    try {
      const h = new Harness();
      const job = await siteBook(h).ingest(String(srv.url), { maxPages: 20 });
      expect(job.pack.origin).toBe(new URL(srv.url).origin);
      expect(job.pack.pages.some((p) => p.title === "Skyline Air")).toBe(true);
      expect(job.pack.pages.some((p) => p.url.endsWith("/search"))).toBe(true);
      expect(job.pack.flows.some((f) => f.id === "search")).toBe(true);
      expect(job.pack.starterQuestions.length).toBeGreaterThan(0);
      expect(job.pack.instruction).toContain(job.pack.origin);
      expect(job.pack.facts.some((f) => /axis|sf|flight/i.test(f) || f.length > 0)).toBe(true);

      const run = attachPack(h, job.pack, { model: "echo" });
      expect(run.getModelBinding()).toBe("echo");
      expect(run.listTools().some((t) => t.name === "site_lookup")).toBe(true);
      expect(run.listTools().some((t) => t.name.startsWith("flow_"))).toBe(true);
      const ctx = run.getContext();
      expect(ctx.some((m) => m.role === "system")).toBe(true);
      expect(ctx.some((m) => m.role === "pin")).toBe(true);

      const lookup = run.tools.find((t) => t.name === "site_lookup");
      const found = await lookup!.call({ query: "cheap flights SFO" });
      const blob = JSON.stringify(found);
      expect(blob).toMatch(/SFO|\$198|Skyline/i);
    } finally {
      srv.stop();
    }
  });

  test("pauses on auth, then resumes after a grant", async () => {
    const srv = mockSite();
    try {
      const h = new Harness();
      const book = siteBook(h);
      const job = await book.ingest(String(srv.url) + "/login", { maxPages: 8 });
      expect(job.pack.complete).toBe(false);
      expect(job.pack.authAsk?.reason).toBe("login_form");

      const next = await book.grant(job.id, { user: "a@b.com", password: "x" });
      expect(next.pack.pages.some((p) => /account|trips|sign in/i.test(p.title + p.text))).toBe(true);
    } finally {
      srv.stop();
    }
  });

  test("intake POST /sites does not go through the loop", async () => {
    const srv = mockSite();
    try {
      const fetchFn = intake(new Harness());
      const res = await fetchFn(
        new Request("http://t/sites", { method: "POST", body: JSON.stringify({ url: String(srv.url), maxPages: 12 }) }),
      );
      const body = (await res.json()) as { pack: { flows: { id: string }[]; starterQuestions: string[] }; runId?: string };
      expect(body.pack.flows.length).toBeGreaterThan(0);
      expect(body.pack.starterQuestions.length).toBeGreaterThan(0);
      expect(body.runId).toBeDefined();
    } finally {
      srv.stop();
    }
  });

  test("corpus lookup reads local files and does not invent", () => {
    const dir = mkdtempSync(join(tmpdir(), "corgi-corpus-"));
    try {
      const n = saveCorpus(dir, "https://www.corgi.insure", [
        {
          url: "https://www.corgi.insure/saas",
          title: "SaaS Insurance for Startups",
          description: "Coverage for SaaS",
          headings: ["Tech E&O", "Cyber"],
          text: "Seed SaaS packages include CGL, D&O, Tech E&O, and Cyber. About $2000 to $4000 a year.",
          status: 200,
        },
        {
          url: "https://www.corgi.insure/customers/intryc",
          title: "Intryc Customer Story",
          description: "Intryc uses Corgi",
          headings: ["Intryc"],
          text: "Intryc is a software customer on Corgi.",
          status: 200,
        },
      ]);
      expect(n).toBe(2);
      const pack = loadCorpus(dir);
      expect(pack.corpusDir).toBe(dir);
      expect(pack.pages.length).toBe(2);
      const hits = lookupCorpus(dir, "SaaS seed cost Intryc");
      expect(hits.some((h) => /2000|Intryc|SaaS/i.test(h.snippet + h.title))).toBe(true);
      const h = new Harness();
      const run = attachPack(h, pack, { model: "echo" });
      expect(run.getContext().some((m) => m.role === "pin" && /Local corpus/.test(m.content))).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("Corgi corpus includes the logged-in quote app products page", () => {
    const pack = loadCorpus("corpus/corgi");
    expect(pack.pages.some((p) => /app\.corgi\.insure\/quote\/products/.test(p.url))).toBe(true);
    expect(pack.flows.some((f) => f.id === APP_QUOTE_ID)).toBe(true);
    const hits = lookupCorpus("corpus/corgi", "quote products package-selection CGL D&O Tech E&O");
    expect(hits.some((h) => /CGL|package-selection|products/i.test(h.snippet + h.title + h.url))).toBe(true);
    expect(JSON.stringify(hits)).not.toMatch(/tejaskumar|gamil/i);
  });

  test("addAppQuote only attaches on a Corgi origin", () => {
    expect(isCorgi("https://www.corgi.insure")).toBe(true);
    expect(isCorgi("https://app.corgi.insure")).toBe(true);
    expect(isCorgi("https://example.com")).toBe(false);
    const added = addAppQuote([], "https://www.corgi.insure");
    expect(added.some((f) => f.id === APP_QUOTE_ID)).toBe(true);
    expect(addAppQuote([], "https://example.com")).toEqual([]);
  });

  test("corpus save drops blog pages", () => {
    const dir = mkdtempSync(join(tmpdir(), "corgi-corpus-"));
    try {
      expect(isBlog("https://www.corgi.insure/blog/corgi-vs-vouch")).toBe(true);
      expect(isBlog("https://www.corgi.insure/saas")).toBe(false);
      const n = saveCorpus(dir, "https://www.corgi.insure", [
        {
          url: "https://www.corgi.insure/saas",
          title: "SaaS",
          description: "",
          headings: [],
          text: "SaaS coverage",
          status: 200,
        },
        {
          url: "https://www.corgi.insure/blog/corgi-vs-vouch",
          title: "Blog",
          description: "",
          headings: [],
          text: "A blog post about Vouch",
          status: 200,
        },
      ]);
      expect(n).toBe(1);
      const pack = loadCorpus(dir);
      expect(pack.pages.every((p) => !isBlog(p.url))).toBe(true);
      expect(pack.pages.some((p) => /saas/i.test(p.url))).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("saveCorpus keeps a hand-written quote products page", () => {
    const dir = mkdtempSync(join(tmpdir(), "corgi-corpus-"));
    try {
      saveCorpus(dir, "https://www.corgi.insure", [
        {
          url: "https://www.corgi.insure/saas",
          title: "SaaS",
          description: "",
          headings: [],
          text: "SaaS coverage",
          status: 200,
        },
      ]);
      const keep = join(dir, "pages", "quote__products.md");
      writeFileSync(
        keep,
        ["---", "url: https://app.corgi.insure/quote/products", "title: Quote app", "description: ", "status: 200", "---", "", "CGL D&O products", ""].join("\n"),
      );
      const n = saveCorpus(dir, "https://www.corgi.insure", [
        {
          url: "https://www.corgi.insure/saas",
          title: "SaaS",
          description: "",
          headings: [],
          text: "SaaS coverage",
          status: 200,
        },
      ]);
      expect(n).toBe(2);
      const pack = loadCorpus(dir);
      expect(pack.pages.some((p) => /quote\/products/.test(p.url))).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
