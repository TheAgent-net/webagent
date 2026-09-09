import { describe, expect, test } from "bun:test";
import { Harness } from "../src/harness.ts";
import { clientKind } from "../src/host/detect.ts";
import { host } from "../src/host/host.ts";
import { listen } from "../src/host/listen.ts";
import { Room } from "../src/host/room.ts";

delete process.env.WEBAGENT_PUBLIC_URL;

const HUMAN_TAB = {
  Accept: "text/html,application/xhtml+xml",
  "User-Agent": "Mozilla/5.0 Chrome/120",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-User": "?1",
};

describe("host detect", () => {
  test("real browser tab is human", () => {
    expect(clientKind(new Request("http://t/", { headers: HUMAN_TAB }))).toBe("human");
  });

  test("Safari / iPhone document navigation without Sec-Fetch-User is human", () => {
    expect(
      clientKind(
        new Request("http://t/", {
          headers: {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "User-Agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
          },
        }),
      ),
    ).toBe("human");
    expect(
      clientKind(
        new Request("http://t/", {
          headers: {
            Accept: "text/html,application/xhtml+xml",
            "User-Agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
          },
        }),
      ),
    ).toBe("human");
  });

  test("Cursor / Playwright / headless look like a tab but are machine", () => {
    expect(
      clientKind(
        new Request("http://t/", {
          headers: {
            ...HUMAN_TAB,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Cursor/1.0 Chrome/120 Electron/32.0",
          },
        }),
      ),
    ).toBe("machine");
    expect(
      clientKind(
        new Request("http://t/", {
          headers: { ...HUMAN_TAB, "User-Agent": "Mozilla/5.0 HeadlessChrome/120" },
        }),
      ),
    ).toBe("machine");
    expect(
      clientKind(
        new Request("http://t/", {
          headers: { Accept: "text/html", "User-Agent": "Playwright", "Sec-Fetch-Dest": "document" },
        }),
      ),
    ).toBe("machine");
  });

  test("MCP and bots are machine", () => {
    expect(clientKind(new Request("http://t/", { headers: { "MCP-Protocol-Version": "2025-06-18" } }))).toBe("machine");
    expect(clientKind(new Request("http://t/", { headers: { Accept: "application/json", "User-Agent": "curl/8.0" } }))).toBe(
      "machine",
    );
    expect(clientKind(new Request("http://t/", { headers: { "User-Agent": "ClaudeBot/1.0" } }))).toBe("machine");
    expect(clientKind(new Request("http://t/", { headers: { "A2A-Version": "0.3" } }))).toBe("machine");
    expect(clientKind(new Request("http://t/", { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } }))).toBe(
      "machine",
    );
    expect(clientKind(new Request("http://t/", { headers: { Accept: "*/*", "User-Agent": "curl/8.0" } }))).toBe("machine");
  });
});

describe("host route + shared room", () => {
  test("human GET / is HTML; machine GET / is a text card", async () => {
    const h = new Harness();
    const room = new Room(h);
    const fetchFn = host(h, room, "https://agent.example");
    const page = await fetchFn(new Request("http://t/", { headers: HUMAN_TAB }));
    expect(page.headers.get("content-type")).toContain("text/html");
    const html = await page.text();
    expect(html).toContain(room.run.id);
    expect(html).toContain("Composio Agent");
    expect(html).toContain("Let your agent talk to");
    expect(html).toContain("Everything your agents");
    expect(html).toContain("wa-fab");
    expect(html).toContain("wa-close");
    expect(html).toContain("shiftKey");
    expect(html).toContain("isComposing");
    expect(html).toContain("enterkeyhint");
    expect(html).toContain("GET STARTED");
    expect(html).toContain("POST /chat");
    expect(html).toContain("/llms.txt");

    const card = await fetchFn(new Request("http://t/", { headers: { Accept: "*/*", "User-Agent": "curl/8" } }));
    expect(card.headers.get("content-type")).toContain("text/plain");
    const text = await card.text();
    expect(text).toContain("POST https://agent.example/chat");
    expect(text).toContain("session");
    expect(text).not.toContain("initialize");
    expect(text).toContain("Do not open /mcp");
    expect(card.headers.get("x-session-id")).toBeNull();
    expect(card.headers.get("set-cookie")).toBeNull();
    expect(card.headers.get("access-control-allow-origin")).toBe("*");
    expect(card.headers.get("link")).toContain("llms.txt");

    const phone = await fetchFn(
      new Request("http://t/", {
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
        },
      }),
    );
    expect(phone.headers.get("content-type")).toContain("text/html");
    expect(await phone.text()).toContain("wa-fab");
  });

  test("JSON card only when asked; howToConnect is POST /chat", async () => {
    const h = new Harness();
    const room = new Room(h);
    const fetchFn = host(h, room, "https://agent.example");
    const card = await fetchFn(
      new Request("http://t/", { headers: { Accept: "application/json", "User-Agent": "curl/8" } }),
    );
    const body = (await card.json()) as {
      mcp: string;
      runId: string;
      type: string;
      name: string;
      howToConnect: string;
      preferredTransport: string;
      skills: { id: string }[];
    };
    expect(body.type).toBe("webagent");
    expect(body.mcp).toBe("https://agent.example/mcp");
    expect(body.runId).toBe(room.run.id);
    expect(body.name).toContain("Composio");
    expect(body.preferredTransport).toBe("HTTP+JSON");
    expect(body.howToConnect).toContain("POST https://agent.example/chat");
    expect(body.howToConnect).not.toContain("initialize");
    expect(body.howToConnect).toMatch(/jobs you already run/i);
    expect(JSON.stringify(body)).not.toMatch(/0\.4\.0/);
    expect(JSON.stringify(body)).not.toMatch(/RAG/i);
    expect(body.skills.some((s) => s.id === "recommend-app")).toBe(true);
  });

  test("serves captured composio.dev CSS and logo assets", async () => {
    const h = new Harness();
    const room = new Room(h);
    const fetchFn = host(h, room, "https://agent.example");
    const css = await fetchFn(
      new Request("http://t/_next/static/css/5f5a377c22b94264.css?dpl=dpl_GUC9Y3CheK2Vra5EdsZWUD2m3To2"),
    );
    expect(css.ok).toBe(true);
    expect(css.headers.get("content-type")).toContain("css");
    const logo = await fetchFn(new Request("http://t/_ext/logos.composio.dev/api/gmail"));
    expect(logo.ok).toBe(true);
    const img = await fetchFn(
      new Request("http://t/_next/image?url=%2Flogos%2Fcomposio-full-white.svg&w=128&q=75"),
    );
    expect(img.ok).toBe(true);
  });

  test("well-known card and OPTIONS preflight", async () => {
    const h = new Harness();
    const room = new Room(h);
    const fetchFn = host(h, room, "https://agent.example");
    const well = await fetchFn(new Request("http://t/.well-known/agent-card.json"));
    expect(well.status).toBe(200);
    const body = (await well.json()) as { runId: string; connectPrompt: string };
    expect(body.runId).toBe(room.run.id);
    expect(body.connectPrompt).toContain("POST");
    expect(body.connectPrompt).not.toContain("initialize");
    const opt = await fetchFn(new Request("http://t/", { method: "OPTIONS", headers: { Origin: "https://ex.com" } }));
    expect(opt.status).toBe(204);
    expect(opt.headers.get("access-control-allow-origin")).toBe("*");
    const forced = await fetchFn(new Request("http://t/?agent=1", { headers: HUMAN_TAB }));
    expect(forced.headers.get("content-type")).toContain("text/plain");
    const jsonForced = await fetchFn(new Request("http://t/?agent=1&format=json", { headers: HUMAN_TAB }));
    expect(jsonForced.headers.get("content-type")).toContain("application/json");
    const forcedHuman = await fetchFn(
      new Request("http://t/?human=1", { headers: { Accept: "*/*", "User-Agent": "curl/8.0" } }),
    );
    expect(forcedHuman.headers.get("content-type")).toContain("text/html");
  });

  test("each chat without a session is a fresh context", async () => {
    const h = new Harness();
    const room = new Room(h);
    const fetchFn = host(h, room);
    const a = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/html", "User-Agent": "Mozilla/5.0" },
        body: JSON.stringify({ text: "hello from human" }),
      }),
    );
    const abody = (await a.json()) as { lastText: string; session: string; runId: string };
    expect(abody.lastText).toContain("hello from human");
    expect(abody.session).toBeTruthy();
    expect(abody.runId).not.toBe(room.run.id);

    const b = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": "curl/8" },
        body: JSON.stringify({ text: "hello from machine" }),
      }),
    );
    const bbody = (await b.json()) as { lastText: string; session: string; runId: string };
    expect(bbody.lastText).toContain("hello from machine");
    expect(bbody.session).not.toBe(abody.session);
    expect(bbody.runId).not.toBe(abody.runId);
    const lobby = room.run.getContext().map((m) => m.content).join("\n");
    expect(lobby).not.toContain("hello from human");
    expect(lobby).not.toContain("hello from machine");
  });

  test("same session keeps turns; a new session is empty", async () => {
    const h = new Harness();
    const room = new Room(h);
    const fetchFn = host(h, room);
    const first = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "my name is Ada", session: "chat-ada-session01" }),
      }),
    );
    const one = (await first.json()) as { session: string; runId: string };
    expect(one.session).toBe("chat-ada-session01");
    const second = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "what is my name?", session: "chat-ada-session01" }),
      }),
    );
    const two = (await second.json()) as { lastText: string; runId: string };
    expect(two.runId).toBe(one.runId);
    expect(two.lastText).toContain("what is my name?");
    const fresh = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "what is my name?", session: "chat-bob-session01" }),
      }),
    );
    const three = (await fresh.json()) as { runId: string };
    expect(three.runId).not.toBe(one.runId);
  });

  test("cookie and X-Session-Id keep the same A2A conversation", async () => {
    const h = new Harness();
    const room = new Room(h);
    const fetchFn = host(h, room, "https://agent.example");
    const hello = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "curl/8" },
        body: JSON.stringify({ text: "my name is Ada" }),
      }),
    );
    const sid = hello.headers.get("x-session-id") ?? "";
    expect(sid).toBeTruthy();
    const cookie = hello.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("wa_session=" + sid);

    const first = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: `wa_session=${sid}` },
        body: JSON.stringify({ text: "what is my name?" }),
      }),
    );
    const one = (await first.json()) as { session: string; runId: string; lastText: string };
    expect(one.session).toBe(sid);
    expect(one.lastText).toContain("what is my name?");

    const second = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid },
        body: JSON.stringify({ text: "say it again" }),
      }),
    );
    const two = (await second.json()) as { session: string; runId: string; lastText: string };
    expect(two.session).toBe(sid);
    expect(two.runId).toBe(one.runId);
    expect(two.lastText).toContain("say it again");
    expect(sid.length).toBeGreaterThan(20);
    expect(sid).not.toMatch(/^c\d+$/);
  });

  test("machine cards do not adopt a caller-chosen ?session=", async () => {
    const h = new Harness();
    const room = new Room(h);
    const fetchFn = host(h, room, "https://agent.example");
    const card = await fetchFn(new Request("http://t/llms.txt?session=attacker-room", { headers: { "User-Agent": "curl/8" } }));
    const text = await card.text();
    expect(text).not.toContain("attacker-room");
    expect(card.headers.get("x-session-id")).toBeNull();

    const home = await fetchFn(
      new Request("http://t/?session=attacker-room", { headers: { Accept: "*/*", "User-Agent": "curl/8" } }),
    );
    expect(await home.text()).not.toContain("attacker-room");
    expect(home.headers.get("x-session-id")).toBeNull();
  });

  test("Mcp-Session-Id and short ids are not chat rooms", async () => {
    const h = new Harness();
    const room = new Room(h);
    const fetchFn = host(h, room);
    const a = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Mcp-Session-Id": "s1" },
        body: JSON.stringify({ text: "one" }),
      }),
    );
    const b = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Mcp-Session-Id": "s1" },
        body: JSON.stringify({ text: "two" }),
      }),
    );
    const one = (await a.json()) as { session: string; runId: string };
    const two = (await b.json()) as { session: string; runId: string };
    expect(one.session).not.toBe("s1");
    expect(two.session).not.toBe("s1");
    expect(one.session).not.toBe(two.session);
    expect(one.runId).not.toBe(two.runId);

    const weak = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "weak", session: "s1" }),
      }),
    );
    const w = (await weak.json()) as { session: string };
    expect(w.session).not.toBe("s1");
    expect(w.session.length).toBeGreaterThan(20);
  });

  test("malformed wa_session cookie is ignored", async () => {
    const h = new Harness();
    const room = new Room(h);
    const fetchFn = host(h, room);
    const res = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: "wa_session=%zz" },
        body: JSON.stringify({ text: "hello" }),
      }),
    );
    expect(res.ok).toBe(true);
    const body = (await res.json()) as { session: string; lastText: string };
    expect(body.session).toBeTruthy();
    expect(body.lastText).toContain("hello");
  });

  test("room can wrap an existing run", async () => {
    const h = new Harness();
    const run = h.create({ model: "echo", instruction: "pack agent" });
    run.inject({ text: "from pack" });
    const room = new Room(h, { run, model: "echo" });
    expect(room.run.id).toBe(run.id);
    const ex = await room.say("human", "ping");
    expect(ex.lastText).toContain("ping");
    expect(room.run.getContext().some((m) => m.content === "from pack")).toBe(true);
  });

  test("listen records hops without reading SSE", async () => {
    const h = new Harness();
    const hops: { path: string; kind: string; status: number }[] = [];
    const hosted = listen(h, {
      port: 0,
      hostname: "127.0.0.1",
      onHop: (hop) => hops.push({ path: hop.path, kind: hop.kind, status: hop.status }),
    });
    try {
      const card = await fetch(hosted.url + "/agent.json", { headers: { accept: "application/json", "user-agent": "curl/8" } });
      expect(card.ok).toBe(true);
      expect(hops.some((x) => x.path === "/agent.json" && x.kind === "machine" && x.status === 200)).toBe(true);
    } finally {
      hosted.stop();
    }
  });

  test("listen prints an http URL and serves the card", async () => {
    const h = new Harness();
    const hosted = listen(h, { port: 0, hostname: "127.0.0.1" });
    try {
      expect(hosted.url).toMatch(/^https?:\/\//);
      const res = await fetch(hosted.url + "/agent.json");
      const card = (await res.json()) as { runId: string };
      expect(card.runId).toBe(hosted.room.run.id);
    } finally {
      hosted.stop();
    }
  });
});
