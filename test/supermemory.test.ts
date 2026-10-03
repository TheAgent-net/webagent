import { describe, expect, test } from "bun:test";
import { Harness } from "../src/harness.ts";
import { host } from "../src/host/host.ts";
import { Room } from "../src/host/room.ts";
import { Sessions } from "../src/host/sessions.ts";
import { loadInstruction, loadPackConfig, packPolicy, renderCopyPrompt } from "../src/pack/index.ts";
import { hashedEmbed, searchHits, searchHitsHybrid } from "../src/retrieve/index.ts";
import { parseLlmsIndex, rankDocLinks } from "../src/site/llms.ts";
import { packWidget } from "../src/widget/widget.ts";
import { build } from "../packs/supermemory/build.ts";
import { captureIntentTool, recommendPathTool } from "../packs/supermemory/tools.ts";
import { inferIntent, isInfoQuestion, nextQuestion } from "../packs/supermemory/intent.ts";
import { recommendPath } from "../packs/supermemory/recommend.ts";

const LLMS = `
# supermemory docs
- [Quickstart](https://supermemory.ai/docs/quickstart.md): Ingest, retrieve three ways.
- [Memory vs RAG](https://supermemory.ai/docs/concepts/memory-vs-rag.md): Why nearest-neighbor is not memory.
- [User profiles](https://supermemory.ai/docs/concepts/user-profiles.md): Static + dynamic facts.
- [Self-hosting](https://supermemory.ai/docs/self-hosting/overview.md): Local binary.
- [Pipecat](https://supermemory.ai/docs/integrations/pipecat.md): Voice memory plugin.
- [Cursor](https://supermemory.ai/docs/integrations/cursor.md): cursor-supermemory: persistent memory across your Cursor chats.
- [MCP](https://supermemory.ai/docs/supermemory-mcp/mcp.md): Give every MCP-compatible assistant shared memory.
`;

const QUICK = `# Quickstart
Ingest a conversation and a document, retrieve them three ways, then wire it into a chat harness.
Same containerTag for everything. One engine, three ways out.
Use client.add, wait until status is done, then search or profile.
`;

const MVR = `# Memory vs RAG
RAG answers what do I know. Memory answers what do I remember about you.
Documents are raw knowledge. Memories are extracted facts with time and relations.
Use document search for policies. Use memory + profile for the user.
`;

const PROFILE = `# User profiles
Profiles are the always-on summary, static plus recent dynamic, of a containerTag.
Inject a profile every turn without re-searching the world.
`;

function html(title: string, body: string): Response {
  return new Response(
    `<!doctype html><html><head><title>${title}</title><meta name="description" content="Memory and continual learning for agents"/></head><body>${body}</body></html>`,
    { headers: { "content-type": "text/html" } },
  );
}

function mockFetch(): typeof fetch {
  return (async (input: string | URL | Request) => {
    const url = String(input);
    if (url.includes("/docs/llms.txt")) return new Response(LLMS, { headers: { "content-type": "text/plain" } });
    if (url.includes("quickstart")) return new Response(QUICK, { headers: { "content-type": "text/markdown" } });
    if (url.includes("memory-vs-rag")) return new Response(MVR, { headers: { "content-type": "text/markdown" } });
    if (url.includes("user-profiles")) return new Response(PROFILE, { headers: { "content-type": "text/markdown" } });
    if (url.includes("self-hosting")) {
      return new Response("# Supermemory local\nOne binary, zero config. Same API on localhost:6767.", {
        headers: { "content-type": "text/markdown" },
      });
    }
    if (url.includes("pipecat")) {
      return new Response("# Pipecat\nConversational memory plugin for a voice pipeline.", {
        headers: { "content-type": "text/markdown" },
      });
    }
    if (url.includes("/integrations/cursor")) {
      return new Response("# Cursor\nInstall with /add-plugin cursor-supermemory so Cursor chats keep memory.", {
        headers: { "content-type": "text/markdown" },
      });
    }
    if (url.includes("supermemory-mcp") || url.includes("/mcp")) {
      return new Response("# SuperMemory MCP\nConnect Claude Code, Cursor, and Codex with the SuperMemory MCP plugin.", {
        headers: { "content-type": "text/markdown" },
      });
    }
    if (url.includes("robots.txt")) return new Response("User-agent: *\n");
    if (url.includes("sitemap")) return new Response("no", { status: 404 });
    if (url.includes("supermemory.com") || url.includes("supermemory.ai")) {
      return html(
        "supermemory",
        `<h1>Memory and continual learning for agents</h1>
         <p>learner-1 extracts and dreams. API, plugins, and MCP.</p>`,
      );
    }
    return new Response("no", { status: 404 });
  }) as typeof fetch;
}

function mockBuild(extra?: { embed?: typeof hashedEmbed | false }) {
  return build({
    maxPages: 20,
    fetch: mockFetch(),
    embed: extra?.embed ?? false,
    cachePath: "",
  });
}

describe("supermemory pack", () => {
  test("loads brand, model, retrieve priors, copy prompt, instruction", () => {
    const config = loadPackConfig("packs/supermemory");
    expect(config.id).toBe("supermemory");
    expect(config.origin).toBe("https://supermemory.com");
    expect(config.docs?.llmsTxt).toContain("supermemory.ai/docs/llms.txt");
    expect(config.brand.name).toBe("supermemory");
    expect(config.brand.fabLabel).toBe("Ask supermemory");
    expect(config.model?.id).toBe("gpt-5.6-luna");
    expect(config.model?.reasoningEffort).toBe("medium");
    expect(config.host?.port).toBe(8791);
    expect(config.host?.publicUrl).toContain("supermemory.agentnet.it.com");
    expect(config.retrieve?.preferTerms).toContain("memory");
    expect(config.retrieve?.integrationKind).toBe("plugin");
    expect(config.tools).toContain("tools.ts");
    const copy = renderCopyPrompt(config, "https://sm.test");
    expect(copy).toContain("Talk to the supermemory agents at https://sm.test/chat");
    expect(copy).toContain("never GET, browse, or probe");
    const instruction = loadInstruction("packs/supermemory", config);
    expect(instruction).toContain("ONE question");
    expect(instruction).toContain("THREE WAYS OUT");
    expect(instruction).toContain("docs_lookup");
    expect(instruction).toContain("capture_intent");
    expect(instruction).toContain("recommend_path");
    expect(instruction).toMatch(/FIRST PATH|hosted Memory API/i);
    expect(instruction).toMatch(/self-host/i);
    expect(instruction).toContain("Do not interview");
  });

  test("parseLlmsIndex reads supermemory docs links", () => {
    const links = parseLlmsIndex(LLMS);
    expect(links.length).toBe(7);
    expect(links.some((l) => l.mdUrl.endsWith("quickstart.md"))).toBe(true);
    expect(links.every((l) => l.url.startsWith("https://supermemory.ai/docs/"))).toBe(true);
    const ranked = rankDocLinks(links, ["/docs/quickstart", "/docs/concepts/memory-vs-rag"]);
    expect(ranked[0]?.url).toContain("quickstart");
  });

  test("offline build crawls marketing + docs and indexes kinds", async () => {
    const pack = await mockBuild();
    expect(pack.pages.length).toBeGreaterThan(3);
    expect(pack.chunks.length).toBeGreaterThan(2);
    expect(pack.retrieval?.mode).toBe("lexical");
    const policy = packPolicy(loadPackConfig("packs/supermemory"));
    expect(policy.kindOf("https://supermemory.ai/docs/quickstart")).toBe("guide");
    expect(policy.kindOf("https://supermemory.ai/docs/integrations/pipecat")).toBe("plugin");
    expect(policy.kindOf("https://supermemory.com/")).toBe("marketing");
  });

  test("retrieve prefers memory/profile docs over a plugin page", async () => {
    const pack = await mockBuild({ embed: hashedEmbed });
    const policy = packPolicy(loadPackConfig("packs/supermemory"));
    const hits = await searchHitsHybrid(
      { origin: pack.origin, pages: pack.pages, chunks: pack.chunks },
      "how do I give my agent user memory",
      hashedEmbed,
      policy,
    );
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]!.url).toMatch(/quickstart|memory-vs-rag|user-profiles|what-is/i);
    expect(hits[0]!.url).not.toMatch(/pipecat/i);

    const rag = searchHits(
      { origin: pack.origin, pages: pack.pages, chunks: pack.chunks },
      "what's the difference between memory and RAG",
      policy,
    );
    expect(rag[0]?.url).toMatch(/memory-vs-rag/i);

    const plugin = searchHits(
      { origin: pack.origin, pages: pack.pages, chunks: pack.chunks },
      "how do I connect Claude Code MCP",
      policy,
    );
    expect(plugin[0]?.url).toMatch(/mcp|pipecat/i);

    const cursor = searchHits(
      { origin: pack.origin, pages: pack.pages, chunks: pack.chunks },
      "How do I add SuperMemory memory to Cursor?",
      policy,
    );
    expect(cursor[0]?.url).toMatch(/integrations\/cursor/i);
  });

  test("capture_intent answers product questions and recommend_path leads hosted", async () => {
    const capture = captureIntentTool();
    const rec = recommendPathTool();
    const ask = await capture.call({ said: "what's the difference between memory and RAG" });
    expect((ask as { mode: string }).mode).toBe("answer");
    expect((ask as { next_question: string | null }).next_question).toBeNull();

    const greet = await capture.call({ said: "hi" });
    expect((greet as { mode: string }).mode).toBe("discover");
    expect((greet as { next_question: string }).next_question).toMatch(/trying to get working/i);

    const enough = inferIntent("I am building a support agent that must remember each user across sessions");
    expect(enough.useCase).toBeTruthy();
    expect(enough.who).toBe("user");
    expect(nextQuestion(enough)).toBeNull();
    const plan = recommendPath(enough);
    expect(plan.path).toMatch(/Hosted/i);
    expect(plan.docs[0]?.url).toContain("quickstart");

    const local = recommendPath(inferIntent("We need memory for each tenant and the data cannot leave our VPC"));
    expect(local.path).toMatch(/Self-host/i);
    expect(local.docs[0]?.url).toContain("self-hosting");

    const notYet = await rec.call({ use_case: "" });
    expect((notYet as { enough: boolean }).enough).toBe(false);
  });

  test("info questions skip the interview", () => {
    expect(isInfoQuestion("what is supermemory")).toBe(true);
    expect(isInfoQuestion("I'm building an agent that needs to remember users")).toBe(false);
  });

  test("widget uses pack brand CSS variables", () => {
    const config = loadPackConfig("packs/supermemory");
    const html = packWidget("https://sm.test", "run-1", config);
    expect(html).toContain("--wa-ink: #0a0a0a");
    expect(html).toContain("Ask supermemory");
    expect(html).toContain("Talk to the supermemory agents");
    expect(html).toContain("innerHTML = rich(");
  });

  test("host GET / is the pixel clone + widget; GET /chat how-to; session reuse", async () => {
    const config = loadPackConfig("packs/supermemory");
    const h = new Harness();
    const room = new Room(h);
    const sessions = new Sessions(h, room);
    const fetchFn = host(h, room, "https://sm.test", { name: config.brand.name }, sessions, config);

    const page = await fetchFn(
      new Request("http://t/", {
        headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0", "Sec-Fetch-Dest": "document" },
      }),
    );
    const body = await page.text();
    expect(body).toContain("supermemory is building the default engine");
    expect(body).toContain("https://sm.test/widget.js");
    expect(body).not.toContain("This is a demo site");
    expect(body).not.toContain("{{WIDGET_JS}}");

    const css = await fetchFn(new Request("http://t/_astro/index.BoEtO4jN.css"));
    expect(css.ok).toBe(true);
    expect(css.headers.get("content-type")).toMatch(/text\/css/);

    const widget = await fetchFn(new Request("http://t/widget.js"));
    expect(await widget.text()).toContain("Ask supermemory");

    const how = await fetchFn(new Request("http://t/chat", { headers: { Accept: "application/json", "User-Agent": "curl/8" } }));
    const howto = (await how.json()) as { ok: boolean; hint: string };
    expect(howto.ok).toBe(true);
    expect(howto.hint).toMatch(/Do not GET/i);

    const a = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "what is memory vs rag", session: "s1" }),
      }),
    );
    const one = (await a.json()) as { session: string; runId: string; company: string };
    expect(one.session).toBe("s1");
    expect(one.company).toBe("supermemory");
    const b = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "still that", session: "s1" }),
      }),
    );
    const two = (await b.json()) as { runId: string };
    expect(two.runId).toBe(one.runId);
  });
});
