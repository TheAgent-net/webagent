import { describe, expect, test } from "bun:test";
import { Harness } from "../src/harness.ts";
import { Room } from "../src/host/room.ts";
import { Sessions } from "../src/host/sessions.ts";
import {
  attachSmallest,
  buildSmallest,
  captureIntentTool,
  inferIntent,
  nextQuestion,
  enoughIntent,
  pageFromMarkdown,
  parseLlmsTxt,
  recommendSettings,
  recommendSettingsTool,
  smallestCopyPrompt,
  smallestHost,
  smallestInstruction,
  hasSmallestSnapshot,
} from "../src/smallest/index.ts";
import type { FetchLike } from "../src/smallest/types.ts";

const LLMS = `# Smallest AI Docs
- [Quick start](https://docs.smallest.ai/voice-agents/platform/get-started/quick-start.md): Create and test a working voice agent.
- [Speech settings](https://docs.smallest.ai/voice-agents/platform/create-agent/agent-settings/speech-settings.md): Tune how your agent speaks.
- [Use Case Finder](https://docs.smallest.ai/voice-agents/developer-guide/get-started/use-case-finder.md): Find the canonical doc.
- [Pipecat](https://docs.smallest.ai/models/integrations/agent-framework/pipecat.md): Build pipelines with Lightning and Pulse.
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

describe("docs crawl helpers", () => {
  test("parseLlmsTxt collects markdown pages", () => {
    const links = parseLlmsTxt(LLMS);
    expect(links.length).toBe(4);
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
    expect(nextQuestion(a)).toMatch(/phone|widget|Pipecat/i);
  });

  test("pipecat + Hindi outbound is enough", () => {
    const a = inferIntent("Lightning TTS inside Pipecat for Hindi outbound sales");
    expect(a.channel).toBe("own_stack");
    expect(a.languages).toContain("hi");
    expect(a.useCase).toBe("outbound_sales");
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

  test("Pipecat does not push a hosted phone agent", () => {
    const plan = recommendSettings({
      useCase: "tts",
      channel: "own_stack",
      direction: "none",
      languages: ["en"],
      tools: [],
      notes: "pipecat lightning",
    });
    expect(plan.path).toBe("own_stack");
    expect(plan.implementation.join(" ")).toMatch(/pipecat/i);
    expect(plan.implementation.join(" ")).not.toMatch(/Create Agent/);
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
  test("capture_intent returns the next question until enough", async () => {
    const tool = captureIntentTool();
    const first = (await tool.call({ said: "collections agent" })) as {
      enough: boolean;
      next_question: string | null;
    };
    expect(first.enough).toBe(false);
    expect(first.next_question).toBeTruthy();
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
});

describe("build + host", () => {
  test("crawls marketing + docs and attaches advisor tools", async () => {
    const pack = await buildSmallest({ maxPages: 20, fetch: mockSmallestFetch() });
    expect(pack.docs.length).toBeGreaterThanOrEqual(2);
    expect(pack.pages.some((p) => /Speech/i.test(p.title) || /1\.2x/.test(p.text))).toBe(true);
    expect(pack.starterQuestions[0]).toMatch(/inbound support/i);

    const h = new Harness();
    const run = attachSmallest(h, pack, { model: "echo" });
    const names = run.listTools().map((t) => t.name);
    expect(names).toContain("site_lookup");
    expect(names).toContain("capture_intent");
    expect(names).toContain("recommend_settings");
    const sys = run.getContext().find((m) => m.role === "system")!.content;
    expect(sys).toContain("ONE question");
    expect(sys).toContain("recommend_settings");
    expect(sys).toContain("Never re-ask");
  });

  test("human GET / is branded HTML; machine GET / is the card; chat keeps a session", async () => {
    const pack = await buildSmallest({ maxPages: 12, fetch: mockSmallestFetch() });
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
    expect(body).toContain("Go talk to the Smallest AI agent");
    expect(body).toContain("Ask Smallest");
    expect(body).toMatch(/Voice AI Platform|Lightning|Pulse/);
    expect(body).toContain("framerusercontent.com");

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
  test("copy prompt is a one-liner", () => {
    expect(smallestCopyPrompt("https://a.test")).toBe("Go talk to the Smallest AI agent at https://a.test and figure out.");
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
    expect(text).toContain("Lightning v3.1");
    expect(text).not.toContain("Lightning v2 (current");
  });
});
