import { describe, expect, test } from "bun:test";
import { Harness } from "../src/harness.ts";
import { Room } from "../src/host/room.ts";
import { Sessions } from "../src/host/sessions.ts";
import {
  attachSmallest,
  buildSmallest,
  captureIntentTool,
  docsLookupTool,
  hashedEmbed,
  inferIntent,
  indexDocs,
  kindOf,
  nextQuestion,
  enoughIntent,
  pageFromMarkdown,
  parseLlmsTxt,
  recommendSettings,
  recommendSettingsTool,
  searchDocs,
  searchDocsHybrid,
  smallestCopyPrompt,
  smallestHost,
  smallestInstruction,
  hasSmallestSnapshot,
  renderChatMarkdown,
} from "../src/smallest/index.ts";
import type { FetchLike } from "../src/smallest/types.ts";

const LLMS = `# Smallest AI Docs
- [Quick start](https://docs.smallest.ai/voice-agents/platform/get-started/quick-start.md): Create and test a working voice agent.
- [Speech settings](https://docs.smallest.ai/voice-agents/platform/create-agent/agent-settings/speech-settings.md): Tune how your agent speaks.
- [Use Case Finder](https://docs.smallest.ai/voice-agents/developer-guide/get-started/use-case-finder.md): Find the canonical doc.
- [Pipecat](https://docs.smallest.ai/models/integrations/agent-framework/pipecat.md): Build pipelines with Lightning and Pulse.
- [Lightning TTS](https://docs.smallest.ai/models/documentation/text-to-speech-lightning/overview.md): Current Waves TTS.
`;

const SPEECH_MD = `# Speech Settings

Tune how your agent speaks and listens.

| Setting | Default |
| Speech Speed | 1.2x |
| Allow Interruptions | On |
| Voicemail Detection | Off |
`;

function html(title: string, body: string) {
  return new Response(`<!doctype html><html><head><title>${title}</title>
<meta name="description" content="Realtime voice AI suite"/></head><body>${body}</body></html>`, {
    headers: { "content-type": "text/html" },
  });
}

function mockSmallestFetch(): FetchLike {
  return async (input: string | URL | Request) => {
    const url = String(input);
    if (url.includes("docs.smallest.ai/llms.txt")) {
      return new Response(LLMS, { headers: { "content-type": "text/plain" } });
    }
    if (url.includes("speech-settings.md") || url.includes("speech-settings")) {
      return new Response(SPEECH_MD, { headers: { "content-type": "text/markdown" } });
    }
    if (url.includes("quick-start.md") || url.includes("quick-start")) {
      return new Response("# Create an Agent\nUse a template. Set call direction, voice, knowledge base.", {
        headers: { "content-type": "text/markdown" },
      });
    }
    if (url.includes("use-case-finder")) {
      return new Response("# Use Case Finder\nPlatform quick start vs Crew CLI vs Pipecat.", {
        headers: { "content-type": "text/markdown" },
      });
    }
    if (url.includes("pipecat")) {
      return new Response("# Pipecat\nInstall pipecat-ai[smallest]. SmallestTTSService and SmallestSTTService.", {
        headers: { "content-type": "text/markdown" },
      });
    }
    if (url.includes("text-to-speech-lightning") || url.includes("lightning")) {
      return new Response("# Lightning v3.1\nCurrent TTS. lightning_v3.1 and lightning_v3.1_pro. Do not use Lightning v2.", {
        headers: { "content-type": "text/markdown" },
      });
    }
    if (url.includes("smallest.ai/robots.txt")) return new Response("User-agent: *\n");
    if (url.includes("smallest.ai/sitemap.xml")) return new Response("no", { status: 404 });
    if (url.includes("smallest.ai")) {
      return html(
        "Smallest AI",
        `<h1>Realtime voice AI suite</h1>
         <p>Lightning TTS, Pulse STT, Electron LLM, Hydra.</p>
         <a href="/pricing">Pricing</a>`,
      );
    }
    return new Response("no", { status: 404 });
  };
}

function mockBuild(extra?: { embed?: typeof hashedEmbed | false; maxPages?: number }) {
  return buildSmallest({
    maxPages: extra?.maxPages ?? 20,
    fetch: mockSmallestFetch(),
    embed: extra?.embed ?? false,
    cachePath: "",
  });
}

describe("docs crawl helpers", () => {
  test("parseLlmsTxt collects markdown pages", () => {
    const links = parseLlmsTxt(LLMS);
    expect(links.length).toBe(5);
    expect(links.some((l) => l.mdUrl.endsWith("speech-settings.md"))).toBe(true);
    expect(links.every((l) => l.url.startsWith("https://docs.smallest.ai/"))).toBe(true);
  });

  test("pageFromMarkdown keeps headings and text", () => {
    const page = pageFromMarkdown("https://docs.smallest.ai/x.md", SPEECH_MD);
    expect(page.title).toBe("Speech Settings");
    expect(page.headings).toContain("Speech Settings");
    expect(page.text).toMatch(/1\.2x/);
    expect(page.url).toBe("https://docs.smallest.ai/x");
  });
});

describe("intent", () => {
  test("infers inbound support and asks only for what's missing", () => {
    const a = inferIntent("I want an inbound support phone agent");
    expect(a.useCase).toBe("support");
    expect(a.channel).toBe("phone");
    expect(a.direction).toBe("inbound");
    expect(enoughIntent(a)).toBe(true);
    expect(nextQuestion(a)).toBeNull();
  });

  test("asks one follow-up when channel is missing", () => {
    const a = inferIntent("we need a collections agent");
    expect(a.useCase).toBe("collections");
    expect(nextQuestion(a)).toMatch(/phone|website/i);
    expect(nextQuestion(a)).not.toMatch(/Pipecat/i);
  });

  test("greeting is not Hindi and asks what they are trying to get working", () => {
    const a = inferIntent("hi");
    expect(a.languages).not.toContain("hi");
    expect(a.useCase).toBeUndefined();
    expect(nextQuestion(a)).toMatch(/trying to get working/i);
    expect(nextQuestion(a)).not.toMatch(/bookings|collections|Atoms|Lightning/i);
  });

  test("unsure visitors stay in exploration", () => {
    const a = inferIntent("not sure yet — I just want people to be able to talk to us");
    expect(enoughIntent(a)).toBe(false);
    expect(nextQuestion(a)).toMatch(/what should this do|trying to get working|who/i);
  });

  test("naming Pipecat does not lock own stack", () => {
    const a = inferIntent("Lightning TTS inside Pipecat for Hindi outbound sales");
    expect(a.channel).not.toBe("own_stack");
    expect(a.channel).toBe("phone");
    expect(a.languages).toContain("hi");
    expect(a.useCase).toBe("outbound_sales");
    expect(recommendSettings({ ...a, tools: a.tools }).path).toBe("atoms_standard");
  });

  test("keep-my-pipeline language locks own stack", () => {
    const a = inferIntent("keep it in my Pipecat pipeline — wire Lightning in");
    expect(a.channel).toBe("own_stack");
  });
});

describe("settings", () => {
  test("inbound support gets Atoms standard + interruptions on + KB", () => {
    const plan = recommendSettings({
      useCase: "support",
      channel: "phone",
      direction: "inbound",
      languages: ["en"],
      tools: ["kb"],
      notes: "customer support line",
    });
    expect(plan.path).toBe("atoms_standard");
    expect(plan.speech.find((s) => s.name === "Allow interruptions")?.value).toBe("On");
    expect(plan.speech.find((s) => s.name === "Voicemail detection")?.value).toBe("Off");
    expect(plan.extras.some((s) => /knowledge/i.test(s.name))).toBe(true);
    expect(plan.models.some((s) => /electron/i.test(s.value))).toBe(true);
    expect(plan.implementation.length).toBeGreaterThan(3);
  });

  test("outbound campaign turns voicemail and mute-until-first on", () => {
    const plan = recommendSettings({
      useCase: "outbound_sales",
      channel: "phone",
      direction: "outbound",
      languages: ["en", "hi"],
      scale: "campaign",
      tools: ["voicemail"],
      notes: "bulk outbound Hindi and English",
    });
    expect(plan.speech.find((s) => s.name === "Voicemail detection")?.value).toMatch(/On/);
    expect(plan.speech.find((s) => s.name === "Mute user until first bot response")?.value).toBe("On");
    expect(plan.extras.some((s) => /campaign/i.test(s.name))).toBe(true);
  });

  test("mentioning Pipecat still recommends Atoms first", () => {
    const plan = recommendSettings({
      useCase: "support",
      channel: "phone",
      direction: "inbound",
      languages: ["en"],
      tools: [],
      notes: "I already have Pipecat and need it to speak",
    });
    expect(plan.path).toBe("atoms_standard");
    expect(plan.pathWhy).toMatch(/Atoms/i);
    expect(plan.implementation.join(" ")).toMatch(/Create Agent/i);
    expect(plan.extras.some((s) => /keep your current stack/i.test(s.name))).toBe(true);
  });

  test("locked own stack is the exception path", () => {
    const plan = recommendSettings({
      useCase: "tts",
      channel: "own_stack",
      direction: "none",
      languages: ["en"],
      tools: [],
      notes: "keep it in my Pipecat pipeline lightning",
    });
    expect(plan.path).toBe("own_stack");
    expect(plan.pathWhy).toMatch(/exception|keep/i);
    expect(plan.implementation.join(" ")).toMatch(/Atoms/i);
    expect(plan.implementation.join(" ")).toMatch(/pipecat/i);
  });

  test("custom LLM selects crew", () => {
    const plan = recommendSettings({
      useCase: "support",
      channel: "phone",
      direction: "inbound",
      languages: ["en"],
      customLlm: true,
      tools: [],
      notes: "bring our own groq model",
    });
    expect(plan.path).toBe("atoms_crew");
  });
});

describe("tools", () => {
  test("capture_intent on a greeting does not shove products", async () => {
    const tool = captureIntentTool();
    const first = (await tool.call({ said: "hi" })) as {
      enough: boolean;
      next_question: string | null;
      hint: string;
    };
    expect(first.enough).toBe(false);
    expect(first.next_question).toMatch(/trying to get working/i);
    expect(first.hint).toMatch(/do not name products/i);
    expect(first.next_question).not.toMatch(/Lightning|Atoms|Waves|bookings/i);
  });

  test("capture_intent returns the next question until enough", async () => {
    const tool = captureIntentTool();
    const first = (await tool.call({ said: "collections agent" })) as {
      enough: boolean;
      next_question: string | null;
    };
    expect(first.enough).toBe(false);
    expect(first.next_question).toBeTruthy();
    const named = (await tool.call({ said: "I already have Pipecat. I just need it to speak." })) as {
      hint: string;
      enough: boolean;
    };
    expect(named.enough).toBe(false);
    expect(named.hint).toMatch(/Do not start there|Atoms/i);
    const second = (await tool.call({
      said: "inbound phone line, English, noisy call center",
      use_case: "collections",
      channel: "phone",
      direction: "inbound",
    })) as { enough: boolean };
    expect(second.enough).toBe(true);
  });

  test("recommend_settings tool returns a report", async () => {
    const rec = recommendSettingsTool();
    const out = (await rec.call({ use_case: "support", channel: "phone", direction: "inbound" })) as {
      path: string;
      report: string;
    };
    expect(out.path).toBe("atoms_standard");
    expect(out.report).toMatch(/Path:/);
  });

  test("recommend_settings refuses a guessed plan while they are still exploring", async () => {
    const rec = recommendSettingsTool();
    const out = (await rec.call({
      use_case: "support",
      channel: "phone",
      notes: "not sure yet — I just want people to be able to talk to us",
    })) as { enough?: boolean; next_question?: string; report?: string };
    expect(out.enough).toBe(false);
    expect(out.next_question).toBeTruthy();
    expect(out.report).toBeUndefined();
  });

  test("docs_lookup ranks the matching docs section", async () => {
    const pack = await mockBuild();
    expect(pack.retrieval?.mode).toBe("lexical");
    expect(pack.chunks?.length).toBeGreaterThan(2);
    const speak = searchDocs(pack, "I already have Pipecat and need it to speak");
    expect(speak[0]?.url).not.toMatch(/pipecat/i);
    expect(speak[0]?.url).toMatch(/voice-agents|quick-start|speech-settings|create-agent|platform|lightning|coding-agent/i);
    const keep = searchDocs(pack, "keep it in my Pipecat pipeline — pipecat-ai plugin");
    expect(keep[0]?.url).toMatch(/pipecat/i);
    const speech = searchDocs(pack, "allow interruptions speech speed");
    expect(speech[0]?.url).toMatch(/speech-settings/i);
    const tts = searchDocs(pack, "text to speech lightning");
    expect(tts[0]?.url).toMatch(/lightning|text-to-speech/i);

    const tool = docsLookupTool(pack);
    const out = (await tool.call({ query: "how do I create a Smallest voice agent" })) as {
      hits: { url: string; snippet: string }[];
      hint: string;
    };
    expect(out.hits.length).toBeGreaterThan(0);
    expect(out.hits[0]!.url).not.toMatch(/pipecat/i);
    expect(out.hint).toMatch(/Atoms\/platform|integration URL/i);
  });
});

describe("build + host", () => {
  test("crawls marketing + docs and attaches advisor tools", async () => {
    const pack = await mockBuild();
    expect(pack.docs.length).toBeGreaterThanOrEqual(2);
    expect(pack.pages.some((p) => /Speech/i.test(p.title) || /1\.2x/.test(p.text))).toBe(true);
    expect(pack.starterQuestions[0]).toMatch(/not sure where to start|trying to get working|call us/i);
    expect(pack.facts[0]).toMatch(/do not recite/i);

    const h = new Harness();
    const run = attachSmallest(h, pack, { model: "echo" });
    const names = run.listTools().map((t) => t.name);
    expect(names).toContain("site_lookup");
    expect(names).toContain("capture_intent");
    expect(names).toContain("recommend_settings");
    expect(names).toContain("docs_lookup");
    const sys = run.getContext().find((m) => m.role === "system")!.content;
    expect(sys).toContain("ONE question");
    expect(sys).toContain("recommend_settings");
    expect(sys).toContain("Never re-ask");
    const pins = run
      .getContext()
      .filter((m) => m.role === "pin")
      .map((m) => m.content)
      .join("\n");
    expect(pins).toMatch(/Smallest assistant|Atoms/i);
    expect(pins).toMatch(/second path|Pipecat/i);
  });

  test("human GET / is branded HTML; machine GET / is the card; chat keeps a session", async () => {
    const pack = await mockBuild({ maxPages: 12 });
    const h = new Harness();
    const run = attachSmallest(h, pack, { model: "echo" });
    const room = new Room(h, { run, model: "echo" });
    const sessions = new Sessions(h, room);
    const fetchFn = smallestHost(h, room, pack, "https://smallest.agent.test", sessions);

    const page = await fetchFn(
      new Request("http://t/", {
        headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0", "Sec-Fetch-Dest": "document" },
      }),
    );
    expect(page.headers.get("content-type")).toContain("text/html");
    const body = await page.text();
    expect(body).toContain("Smallest AI");
    expect(body).toContain("voice use case");
    expect(body).toContain("/chat");
    expect(body).toContain("Ask Smallest");
    expect(body).toContain("smallest.ai");
    expect(body).toContain("font-family: Geist");
    expect(body).toContain("background: #191919");
    expect(body).toContain("background: #f5f5f5");
    expect(body).not.toContain("#7CFFB2");
    expect(body).toMatch(/Voice AI Platform|Lightning|Pulse/);
    expect(body).toContain("framerusercontent.com");
    expect(body).toContain("wa-md-link");
    expect(body).toContain("innerHTML = md");

    const cardRes = await fetchFn(new Request("http://t/", { headers: { Accept: "application/json", "User-Agent": "curl/8" } }));
    const card = (await cardRes.json()) as { name: string; type: string; skills: { id: string }[] };
    expect(card.type).toBe("webagent");
    expect(card.name).toBe("Smallest AI");
    expect(hasSmallestSnapshot()).toBe(true);
    expect(card.skills.some((s) => s.id === "settings")).toBe(true);

    const icon = await fetchFn(new Request("http://t/_ext/framerusercontent.com/images/8aGg1mfHwnBJJYiECyUmneAyRVA.png"));
    expect([200, 404]).toContain(icon.status);
    if (icon.status === 200) expect(icon.headers.get("content-type")).toMatch(/image|octet/);

    const chat = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "inbound support", session: "s-demo" }),
      }),
    );
    const msg = (await chat.json()) as { lastText: string; session: string };
    expect(msg.session).toBe("s-demo");
    expect(msg.lastText).toMatch(/inbound support/i);
  });
});

describe("copy prompt and instruction", () => {
  test("copy prompt tells a coding agent to read the project and talk to the webagent", () => {
    const text = smallestCopyPrompt("https://a.test");
    expect(text).toContain("voice use case");
    expect(text).toContain("https://a.test/chat");
    expect(text).toContain("keep the session");
    expect(text).toContain("this repo");
    expect(text.split("\n")).toHaveLength(2);
    expect(text).not.toMatch(/and figure out\.?$/);
  });

  test("instruction tells the model to ask little and recommend settings", () => {
    const text = smallestInstruction({
      origin: "https://smallest.ai",
      docsOrigin: "https://docs.smallest.ai",
      site: {
        origin: "https://smallest.ai",
        crawledAt: "",
        complete: true,
        pages: [],
        flows: [],
        instruction: "",
        facts: [],
        starterQuestions: [],
      },
      pages: [],
      marketing: [],
      docs: [],
      facts: [],
      starterQuestions: [],
    });
    expect(text).toContain("ONE question");
    expect(text).toContain("recommend_settings");
    expect(text).toContain("Never re-ask");
    expect(text).toContain("Lightning v3.1");
    expect(text).toContain("Explore them first");
    expect(text).toContain("how you can help");
    expect(text).toContain("Do not name Lightning");
    expect(text).toMatch(/Do not shove|never recite/i);
    expect(text).toContain("docs_lookup");
    expect(text).toMatch(/FIRST PATH|Atoms/i);
    expect(text).toMatch(/SECOND PATH|must keep/i);
    expect(text).toMatch(/hybrid BM25 \+ embeddings/i);
    expect(text).toMatch(/stay curious|ONLY if capture_intent\.enough/i);
    expect(text).not.toContain("Lightning v2 (current");
  });
});

describe("retrieval", () => {
  test("chunks split by heading and tag kinds", () => {
    const chunks = indexDocs([
      {
        url: "https://docs.smallest.ai/voice-agents/platform/create-agent/agent-settings/speech-settings",
        status: 200,
        title: "Speech Settings",
        description: "Tune speech",
        headings: ["Speech Settings", "Allow Interruptions"],
        text:
          "Tune how your agent speaks and listens. Speech Settings Allow Interruptions is on by default so callers can cut in. Voicemail Detection stays off unless this is an outbound campaign. Speech speed is 1.2x for natural pacing. " +
          "x".repeat(200),
        links: [],
        forms: [],
        gated: false,
      },
      {
        url: "https://docs.smallest.ai/models/integrations/agent-framework/pipecat",
        status: 200,
        title: "Pipecat",
        description: "Waves in Pipecat",
        headings: ["Pipecat"],
        text: "Install pipecat-ai[smallest]. SmallestTTSService and SmallestSTTService wire Lightning and Pulse into an existing pipeline.",
        links: [],
        forms: [],
        gated: false,
      },
    ]);
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    expect(kindOf("https://docs.smallest.ai/voice-agents/platform/get-started/quick-start")).toBe("platform");
    expect(chunks.find((c) => c.url.includes("pipecat"))?.kind).toBe("integration");
    expect(chunks.find((c) => c.url.includes("speech-settings"))?.kind).toBe("platform");
  });

  test("offline build stays lexical", async () => {
    const pack = await mockBuild();
    expect(pack.retrieval?.mode).toBe("lexical");
    expect(pack.retrieval?.embedded).toBe(0);
    expect(pack.chunks?.every((c) => !c.vector?.length)).toBe(true);
  });

  test("hybrid hashed embeddings still prefer Atoms and match paraphrases", async () => {
    const pack = await mockBuild({ embed: hashedEmbed });
    expect(pack.retrieval?.mode).toBe("hybrid");
    expect(pack.retrieval?.embedded).toBe(pack.chunks?.length);
    expect(pack.chunks?.every((c) => (c.vector?.length ?? 0) > 0)).toBe(true);

    const speak = await searchDocsHybrid(pack, "I already have Pipecat and need it to speak", hashedEmbed);
    expect(speak[0]?.url).not.toMatch(/pipecat/i);

    const keep = await searchDocsHybrid(pack, "keep it in my Pipecat pipeline — pipecat-ai plugin", hashedEmbed);
    expect(keep[0]?.url).toMatch(/pipecat/i);

    const hosted = await searchDocsHybrid(pack, "how do I stand up a hosted voice agent on the dashboard", hashedEmbed);
    expect(hosted[0]?.url).not.toMatch(/pipecat/i);
    expect(hosted[0]?.url).toMatch(/voice-agents|quick-start|create-agent|platform|speech-settings/i);

    const tool = docsLookupTool(pack);
    const out = (await tool.call({ query: "how do I create a Smallest voice agent" })) as {
      source: string;
      hits: { url: string }[];
    };
    expect(out.source).toBe("hybrid");
    expect(out.hits.length).toBeGreaterThan(0);
    expect(out.hits[0]!.url).not.toMatch(/pipecat/i);
  });
});

describe("chat markdown", () => {
  test("renders bold, lists, and markdown links", () => {
    const html = renderChatMarkdown(
      "The **[Speech Settings](https://docs.smallest.ai/voice-agents/platform/create-agent/agent-settings/speech-settings)** page covers pacing.\n\n- **Speech speed:** 1.2×\n- **Allow interruptions:** On\n",
    );
    expect(html).toContain("<strong>");
    expect(html).toContain('<a class="wa-md-link" href="https://docs.smallest.ai/voice-agents/platform/create-agent/agent-settings/speech-settings"');
    expect(html).toContain("Speech Settings");
    expect(html).toContain('<ul class="wa-md-ul">');
    expect(html).toContain("<strong>Speech speed:</strong>");
    expect(html).not.toContain("**");
  });

  test("autolinks bare https URLs and keeps paragraphs", () => {
    const html = renderChatMarkdown("See https://docs.smallest.ai/voice-agents/platform/get-started/quick-start for the setup.");
    expect(html).toContain('<a class="wa-md-link" href="https://docs.smallest.ai/voice-agents/platform/get-started/quick-start"');
    expect(html).toContain("<p>");
  });

  test("escapes HTML and does not turn javascript: into a link", () => {
    const html = renderChatMarkdown("Hi <script>alert(1)</script> [x](javascript:alert(1))");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain('href="javascript:');
  });

  test("renders fenced code without interpreting markdown inside", () => {
    const html = renderChatMarkdown("Use:\n```js\nconst x = 1;\n**not bold**\n```\n");
    expect(html).toContain('<pre class="wa-code">');
    expect(html).toContain("**not bold**");
    expect(html).toContain('class="wa-code-lang">js');
  });
});
