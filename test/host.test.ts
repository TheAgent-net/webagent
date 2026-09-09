import { describe, expect, test } from "bun:test";
import { Harness } from "../src/harness.ts";
import { clientKind } from "../src/host/detect.ts";
import { host } from "../src/host/host.ts";
import { listen } from "../src/host/listen.ts";
import { Room } from "../src/host/room.ts";

describe("host detect", () => {
  test("browser HTML is human", () => {
    expect(
      clientKind(
        new Request("http://t/", {
          headers: {
            Accept: "text/html,application/xhtml+xml",
            "User-Agent": "Mozilla/5.0 Chrome/120",
            "Sec-Fetch-Dest": "document",
          },
        }),
      ),
    ).toBe("human");
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
  });
});

describe("host route + shared room", () => {
  test("human GET / is HTML; machine GET / is the agent card", async () => {
    const h = new Harness();
    const room = new Room(h);
    const fetchFn = host(h, room, "https://agent.example");
    const page = await fetchFn(
      new Request("http://t/", { headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0", "Sec-Fetch-Dest": "document" } }),
    );
    expect(page.headers.get("content-type")).toContain("text/html");
    const html = await page.text();
    expect(html).toContain(room.run.id);
    expect(html).toContain("/mcp");
    expect(html).toContain("Composio Agent");
    expect(html).toContain("Let your agent talk to");
    expect(html).toContain("Everything your agents");
    expect(html).toContain("wa-fab");
    expect(html).toContain("GET STARTED");

    const card = await fetchFn(new Request("http://t/", { headers: { Accept: "application/json", "User-Agent": "curl/8" } }));
    const body = (await card.json()) as {
      mcp: string;
      runId: string;
      type: string;
      name: string;
      howToConnect: string;
      skills: { id: string }[];
    };
    expect(body.type).toBe("webagent");
    expect(body.mcp).toBe("https://agent.example/mcp");
    expect(body.runId).toBe(room.run.id);
    expect(body.name).toContain("Composio");
    expect(body.howToConnect).toContain("initialize");
    expect(body.skills.some((s) => s.id === "recommend-app")).toBe(true);
    expect(card.headers.get("access-control-allow-origin")).toBe("*");
    expect(card.headers.get("link")).toContain("agent-card.json");
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
    const opt = await fetchFn(new Request("http://t/", { method: "OPTIONS", headers: { Origin: "https://ex.com" } }));
    expect(opt.status).toBe(204);
    expect(opt.headers.get("access-control-allow-origin")).toBe("*");
    const forced = await fetchFn(
      new Request("http://t/?agent=1", {
        headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0", "Sec-Fetch-Dest": "document" },
      }),
    );
    expect(forced.headers.get("content-type")).toContain("application/json");
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
        body: JSON.stringify({ text: "my name is Ada", session: "chat-ada" }),
      }),
    );
    const one = (await first.json()) as { session: string; runId: string };
    expect(one.session).toBe("chat-ada");
    const second = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "what is my name?", session: "chat-ada" }),
      }),
    );
    const two = (await second.json()) as { lastText: string; runId: string };
    expect(two.runId).toBe(one.runId);
    expect(two.lastText).toContain("what is my name?");
    const fresh = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "what is my name?", session: "chat-bob" }),
      }),
    );
    const three = (await fresh.json()) as { runId: string };
    expect(three.runId).not.toBe(one.runId);
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
