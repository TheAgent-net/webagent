import { describe, expect, test } from "bun:test";
import { Harness } from "../src/harness.ts";
import { Room } from "../src/host/room.ts";
import { Sessions } from "../src/host/sessions.ts";
import {
  attachCompany,
  buildCompany,
  companyCopyPrompt,
  companyHost,
  companyInstruction,
  firstExternalUrl,
  inferFormWalks,
  parseGithubInput,
  walkFormTool,
} from "../src/company/index.ts";
import { buildPack } from "../src/site/pack.ts";
import type { CrawlState } from "../src/site/crawl.ts";
import type { PageShot } from "../src/site/types.ts";

function page(partial: Partial<PageShot> & { url: string }): PageShot {
  return {
    status: 200,
    title: "",
    description: "",
    headings: [],
    text: "",
    links: [],
    forms: [],
    gated: false,
    ...partial,
  };
}

function mockCompanySite() {
  return Bun.serve({
    port: 0,
    fetch(req) {
      const url = new URL(req.url);
      if (url.pathname === "/robots.txt") return new Response("User-agent: *\n");
      if (url.pathname === "/sitemap.xml") return new Response("no", { status: 404 });
      if (url.pathname === "/") {
        return html(
          "Northwind Labs",
          `<meta name="description" content="Inventory software for independent grocers.">
           <h1>Northwind Labs</h1>
           <p>Track stock in minutes.</p>
           <a href="/signup">Start free</a>
           <a href="/contact">Talk to us</a>`,
        );
      }
      if (url.pathname === "/signup") {
        return html(
          "Start free",
          `<h1>Start free</h1>
           <form action="/signup" method="post">
             <input name="name" />
             <input name="email" type="email" />
             <input name="company" />
           </form>`,
        );
      }
      if (url.pathname === "/contact") {
        return html(
          "Contact",
          `<h1>Contact</h1>
           <form action="/contact" method="post">
             <input name="email" type="email" />
             <textarea name="message"></textarea>
           </form>`,
        );
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

describe("github input", () => {
  test("parses full and short repo urls", () => {
    expect(parseGithubInput("https://github.com/TheAgent-net/webagent")).toEqual({
      owner: "TheAgent-net",
      name: "webagent",
    });
    expect(parseGithubInput("TheAgent-net/webagent")).toEqual({ owner: "TheAgent-net", name: "webagent" });
    expect(parseGithubInput("https://www.corgi.insure")).toBeUndefined();
  });

  test("picks a homepage URL out of a README", () => {
    const md = "# Hello\nDocs at https://docs.northwind.test/guide and a badge https://img.shields.io/x";
    expect(firstExternalUrl(md)).toBe("https://docs.northwind.test/guide");
  });
});

describe("form walks", () => {
  test("builds field-by-field walks from signup and contact forms", () => {
    const walks = inferFormWalks([
      page({
        url: "https://n.test/signup",
        title: "Start free",
        forms: [
          {
            action: "/signup",
            method: "post",
            fields: [
              { name: "name", type: "text" },
              { name: "email", type: "email" },
              { name: "company", type: "text" },
              { name: "csrf", type: "hidden" },
            ],
          },
        ],
      }),
      page({
        url: "https://n.test/contact",
        title: "Contact",
        forms: [
          {
            action: "/contact",
            method: "post",
            fields: [
              { name: "email", type: "email" },
              { name: "message", type: "text" },
            ],
          },
        ],
      }),
    ]);
    expect(walks.some((w) => w.id === "signup" && w.fields.some((f) => f.name === "email"))).toBe(true);
    expect(walks.some((w) => w.id === "contact")).toBe(true);
    expect(walks.every((w) => !w.fields.some((f) => f.type === "hidden"))).toBe(true);
    const tool = walkFormTool(walks);
    return tool.call({ form_id: "signup" }).then((r) => {
      const rec = r as { steps: { field: string }[] };
      expect(rec.steps.map((s) => s.field)).toEqual(["name", "email", "company"]);
    });
  });
});

describe("buildCompany from a website", () => {
  test("crawls, profiles, and attaches walk_form", async () => {
    const srv = mockCompanySite();
    try {
      const pack = await buildCompany(String(srv.url), { maxPages: 10 });
      expect(pack.profile.name).toMatch(/Northwind/i);
      expect(pack.profile.tagline).toMatch(/grocers|stock|inventory/i);
      expect(pack.pages.length).toBeGreaterThanOrEqual(2);
      expect(pack.forms.some((f) => f.id.startsWith("signup") || f.id.startsWith("contact"))).toBe(true);
      expect(pack.flows.some((f) => f.id === "signup" || f.id === "support")).toBe(true);

      const h = new Harness();
      const run = attachCompany(h, pack, { model: "echo" });
      expect(run.listTools().some((t) => t.name === "site_lookup")).toBe(true);
      expect(run.listTools().some((t) => t.name === "walk_form")).toBe(true);
      expect(run.listTools().some((t) => t.name === "company_brief")).toBe(true);
      const sys = run.getContext().find((m) => m.role === "system")!.content;
      expect(sys).toContain("Northwind");
      expect(sys).toContain("walk_form");
      expect(sys).toContain("Never re-ask");
    } finally {
      srv.stop();
    }
  });
});

describe("buildCompany from GitHub", () => {
  test("uses repo homepage then crawls it", async () => {
    const site = mockCompanySite();
    try {
      const homepage = String(site.url).replace(/\/+$/, "");
      const fetchFn = async (input: string | URL | Request, init?: RequestInit) => {
        const url = String(input);
        if (url.includes("api.github.com/repos/acme/northwind/readme")) {
          return new Response("# Northwind\nSite: " + homepage, { status: 200 });
        }
        if (url.includes("api.github.com/repos/acme/northwind")) {
          return Response.json({
            html_url: "https://github.com/acme/northwind",
            description: "Inventory OS for grocers",
            homepage,
            topics: ["inventory", "retail"],
            language: "TypeScript",
            stargazers_count: 12,
            owner: { login: "acme" },
            name: "northwind",
          });
        }
        return fetch(input, init);
      };
      const pack = await buildCompany("https://github.com/acme/northwind", { maxPages: 10, fetch: fetchFn });
      expect(pack.github?.name).toBe("northwind");
      expect(pack.profile.github).toContain("github.com/acme/northwind");
      expect(pack.pages.some((p) => /Northwind/i.test(p.title))).toBe(true);
      expect(pack.forms.length).toBeGreaterThan(0);
    } finally {
      site.stop();
    }
  });
});

describe("company host", () => {
  test("human GET / is branded HTML; machine GET / is the card; chat keeps a session", async () => {
    const h = new Harness();
    const state: CrawlState = {
      origin: "https://n.test",
      pages: [
        page({
          url: "https://n.test/",
          title: "Northwind Labs",
          description: "Inventory software",
          headings: ["Northwind Labs"],
          text: "Track stock",
        }),
      ],
      pending: [],
      seen: new Set(),
      cookies: "",
    };
    const site = buildPack(state);
    const pack = {
      profile: {
        name: "Northwind Labs",
        tagline: "Inventory software",
        origin: "https://n.test",
        website: "https://n.test",
        audience: "grocers",
        offers: ["Track stock"],
        ctas: [],
      },
      site,
      forms: [],
      pages: site.pages,
      flows: site.flows,
    };
    const run = attachCompany(h, pack, { model: "echo" });
    const room = new Room(h, { run, model: "echo" });
    const sessions = new Sessions(h, room);
    const fetchFn = companyHost(h, room, pack, "https://agent.test", sessions);

    const html = await fetchFn(
      new Request("http://t/", {
        headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0", "Sec-Fetch-Dest": "document" },
      }),
    );
    expect(html.headers.get("content-type")).toContain("text/html");
    const body = await html.text();
    expect(body).toContain("Northwind Labs");
    expect(body).toContain("Go talk to the Northwind Labs agent");
    expect(body).toContain("Ask Northwind Labs");

    const cardRes = await fetchFn(new Request("http://t/", { headers: { Accept: "application/json", "User-Agent": "curl/8" } }));
    const card = (await cardRes.json()) as { name: string; type: string };
    expect(card.type).toBe("webagent");
    expect(card.name).toBe("Northwind Labs");

    const chat = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "I need a demo", session: "c-demo" }),
      }),
    );
    const msg = (await chat.json()) as { lastText: string; session: string };
    expect(msg.session).toBe("c-demo");
    expect(msg.lastText).toContain("demo");
  });
});

describe("copy prompt and instruction", () => {
  test("copy prompt is a one-liner", () => {
    expect(companyCopyPrompt("https://a.test", "Acme")).toBe("Go talk to the Acme agent at https://a.test and figure out.");
  });

  test("instruction tells the model to walk forms and listen", () => {
    const text = companyInstruction({
      profile: {
        name: "Acme",
        tagline: "Does things",
        origin: "https://acme.test",
        audience: "builders",
        offers: ["API"],
        ctas: [],
      },
      site: {
        origin: "https://acme.test",
        crawledAt: "",
        complete: true,
        pages: [],
        flows: [],
        instruction: "",
        facts: [],
        starterQuestions: [],
      },
      forms: [
        {
          id: "contact",
          name: "Contact",
          purpose: "Write in",
          url: "https://acme.test/contact",
          action: "/contact",
          method: "post",
          fields: [{ name: "email", type: "email", why: "reply" }],
        },
      ],
      pages: [],
      flows: [],
    });
    expect(text).toContain("walk_form");
    expect(text).toContain("Never re-ask");
    expect(text).toContain("contact");
  });
});
