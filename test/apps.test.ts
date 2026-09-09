import { describe, expect, test } from "bun:test";
import { askApps } from "../src/apps/ask.ts";
import { attachApps } from "../src/apps/attach.ts";
import { chunkPages } from "../src/apps/clean.ts";
import { buildGraph } from "../src/apps/graph.ts";
import { kindOf, useFromTool } from "../src/apps/kind.ts";
import { parseCatalog, parseAppPage } from "../src/apps/parse.ts";
import { appsInstruction } from "../src/apps/prompt.ts";
import { queryGraph } from "../src/apps/query.ts";
import { searchChunks } from "../src/apps/rag.ts";
import { rerankDocs } from "../src/apps/rerank.ts";
import { Harness } from "../src/harness.ts";
import { saveCorpus, type CorpusPage } from "../src/site/corpus.ts";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CATALOG = `
# Toolkits
## All Toolkits
| Toolkit | Slug | Tools | Triggers | Auth | Managed App |
| --- | --- | --- | --- | --- | --- |
| Gmail | \`GMAIL\` | 63 | 2 | OAUTH2 | Yes |
| GitHub | \`GITHUB\` | 80 | 10 | OAUTH2 | Yes |
| Slack | \`SLACK\` | 40 | 4 | OAUTH2 | Yes |
`;

const GMAIL: CorpusPage = {
  url: "https://docs.composio.dev/toolkits/gmail",
  title: "Gmail",
  description: "Gmail email toolkit",
  headings: ["Gmail", "Frequently Asked Questions", "Why am I getting 401 errors on tool calls?"],
  text: [
    "Gmail is Google’s email service for agents.",
    "",
    "- Category: email",
    "- Auth: OAUTH2",
    "- Tools: 63",
    "- Triggers: 2",
    "- Slug: `GMAIL`",
    "",
    "## Frequently Asked Questions",
    "",
    "### Why am I getting 401 errors on tool calls?",
    "",
    "The user's access token is no longer valid. Re-authenticating the user typically resolves this.",
    "",
    "## Tools",
    "",
    "Use `GMAIL_SEND_EMAIL` to send mail. Use `GMAIL_FETCH_EMAILS` to read the inbox.",
  ].join("\n"),
  status: 200,
};

const AUTH: CorpusPage = {
  url: "https://docs.composio.dev/docs/authentication.md",
  title: "Authentication",
  description: "OAuth and API keys",
  headings: ["Authentication"],
  text: "Composio-managed auth is the default. Agents connect accounts at runtime. OAuth2 and API_KEY are supported.",
  status: 200,
};

function pages(): CorpusPage[] {
  return [
    {
      url: "https://docs.composio.dev/toolkits.md",
      title: "Toolkits",
      description: "Catalog",
      headings: ["All Toolkits"],
      text: CATALOG,
      status: 200,
    },
    GMAIL,
    AUTH,
  ];
}

describe("composio graph rag", () => {
  test("catalog parse keeps slug and auth", () => {
    const rows = parseCatalog(CATALOG);
    expect(rows.some((r) => r.slug === "GMAIL")).toBe(true);
    expect(kindOf("GMAIL", "email")).toBe("email");
    expect(useFromTool("GMAIL_SEND_EMAIL")).toMatch(/send email/);
  });

  test("app page yields FAQ and send-email use", () => {
    const parsed = parseAppPage(GMAIL)!;
    expect(parsed.kind).toBe("email");
    expect(parsed.faqs?.some((f) => /401/.test(f.q))).toBe(true);
    expect(parsed.uses?.some((u) => /send email/i.test(u))).toBe(true);
  });

  test("query send email ranks Gmail and not a catalog dump", () => {
    const graph = buildGraph("https://docs.composio.dev", pages());
    const hit = queryGraph(graph, "I need to send an email to a customer");
    expect(hit.kinds).toContain("email");
    expect(hit.apps[0]?.slug).toBe("GMAIL");
    expect(hit.apps[0]?.why.some((w) => /use:|kind:/i.test(w))).toBe(true);
    expect(hit.apps.length).toBeLessThanOrEqual(6);
  });

  test("send email prefers Gmail over another email app", () => {
    const extra = pages();
    extra[0] = {
      ...extra[0]!,
      text: CATALOG + "| SendGrid | `SENDGRID` | 12 | 0 | API_KEY | — |\n",
    };
    extra.push({
      url: "https://docs.composio.dev/toolkits/sendgrid",
      title: "SendGrid",
      description: "email API",
      headings: ["SendGrid"],
      text: "- Category: email\n- Auth: API_KEY\nUse `SENDGRID_SEND_EMAIL` to send mail.",
      status: 200,
    });
    const hit = queryGraph(buildGraph("https://docs.composio.dev", extra), "send an email");
    expect(hit.apps[0]?.slug).toBe("GMAIL");
    expect(hit.apps.some((a) => a.slug === "SENDGRID")).toBe(true);
  });

  test("spreadsheet request ranks Google Sheets", () => {
    const extra = pages();
    extra[0] = {
      ...extra[0]!,
      text: extra[0]!.text + "| Google Sheets | `GOOGLESHEETS` | 40 | 0 | OAUTH2 | Yes |\n",
    };
    const hit = queryGraph(buildGraph("https://docs.composio.dev", extra), "store rows in a spreadsheet");
    expect(hit.kinds).toContain("sheet");
    expect(hit.apps[0]?.slug).toBe("GOOGLESHEETS");
  });

  test("create a github issue ranks GitHub", () => {
    const extra = pages();
    extra[0] = {
      ...extra[0]!,
      text: extra[0]!.text + "| SendGrid | `SENDGRID` | 12 | 0 | API_KEY | — |\n",
    };
    extra.push({
      url: "https://docs.composio.dev/toolkits/github",
      title: "GitHub",
      description: "git",
      headings: ["GitHub"],
      text: "- Category: developer_tools\n- Auth: OAUTH2\nUse `GITHUB_CREATE_ISSUE` to open an issue.",
      status: 200,
    });
    const hit = queryGraph(buildGraph("https://docs.composio.dev", extra), "create a github issue");
    expect(hit.apps[0]?.slug).toBe("GITHUB");
    expect(hit.uses.some((u) => /issue/i.test(u))).toBe(true);
  });

  test("query 401 on gmail hits the FAQ page", () => {
    const graph = buildGraph("https://docs.composio.dev", pages());
    const hit = queryGraph(graph, "gmail 401 errors on tool calls");
    expect(hit.pages.some((p) => /401/.test(p.title + p.snippet))).toBe(true);
  });

  test("cleaned RAG keeps FAQ answers and drops tables", () => {
    const chunks = chunkPages(pages());
    expect(chunks.some((c) => /401/.test(c.title) && /access token/i.test(c.text))).toBe(true);
    expect(chunks.every((c) => !/^\|/.test(c.text))).toBe(true);
    const lex = searchChunks(chunks, "gmail 401 errors on tool calls");
    expect(lex[0]?.title).toMatch(/401/);
  });

  test("reranker puts the 401 FAQ above a generic graph page", () => {
    const chunks = chunkPages(pages());
    const lex = searchChunks(chunks, "gmail 401");
    const graphPages = [
      { url: "https://docs.composio.dev/docs/authentication", title: "Authentication", role: "auth", score: 9, snippet: "OAuth and API keys" },
      { url: "https://docs.composio.dev/toolkits/gmail", title: "Gmail", role: "guide", score: 8, snippet: "Gmail is Google’s email service" },
    ];
    const ranked = rerankDocs("gmail 401 errors", graphPages, lex, 4, [{ slug: "GMAIL" }]);
    expect(ranked[0]?.title).toMatch(/401/);
    expect(ranked[0]?.snippet).toMatch(/access token/i);
  });

  test("hybrid ask still ranks Gmail for send email", () => {
    const graph = buildGraph("https://docs.composio.dev", pages());
    const hit = askApps(graph, chunkPages(pages()), "I need to send an email to a customer");
    expect(hit.apps[0]?.slug).toBe("GMAIL");
    expect(hit.pages.length).toBeGreaterThan(0);
  });

  test("reranker prefers docs of the top graph app", () => {
    const ranked = rerankDocs(
      "create a github issue",
      [
        { url: "https://docs.composio.dev/toolkits/jira", title: "What is JQL?", role: "faq", score: 12, snippet: "JQL searches Jira issues" },
        { url: "https://docs.composio.dev/toolkits/github", title: "How do I create an issue?", role: "faq", score: 4, snippet: "Use GITHUB_CREATE_ISSUE" },
      ],
      [],
      2,
      [{ slug: "GITHUB" }, { slug: "JIRA" }],
    );
    expect(ranked[0]?.url).toMatch(/github/i);
  });

  test("attachApps binds recommend_app and debug_docs", async () => {
    const dir = mkdtempSync(join(tmpdir(), "composio-"));
    try {
      saveCorpus(dir, "https://docs.composio.dev", pages());
      const graph = buildGraph("https://docs.composio.dev", pages());
      const h = new Harness();
      const { loadCorpus } = await import("../src/site/corpus.ts");
      const pack = loadCorpus(dir);
      const run = attachApps(h, pack, { model: "echo", graph });
      expect(run.listTools().some((t) => t.name === "recommend_app")).toBe(true);
      expect(run.listTools().some((t) => t.name === "debug_docs")).toBe(true);
      expect(appsInstruction()).toMatch(/recommend_app/);
      const rec = run.tools.find((t) => t.name === "recommend_app")!;
      const out = await rec.call({ request: "create a github issue" });
      expect(JSON.stringify(out)).toMatch(/GITHUB|git/i);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
