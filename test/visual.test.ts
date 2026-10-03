import { describe, expect, test } from "bun:test";
import { cpSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Harness } from "../src/harness.ts";
import { host } from "../src/host/host.ts";
import { Room } from "../src/host/room.ts";
import { Sessions } from "../src/host/sessions.ts";
import { REPLY_SHAPE, VISUAL_RULE } from "../src/pack/attach.ts";
import { iconHref } from "../src/pack/brand.ts";
import { docsLookupTool } from "../src/pack/docs.ts";
import { loadPackConfig, packPolicy } from "../src/pack/index.ts";
import { findVisuals, type Visual } from "../src/site/visual.ts";
import { packWidget } from "../src/widget/widget.ts";

const chart: Visual = {
  id: "token-cost",
  kind: "figure",
  label: "Per-question token cost",
  text: "Cost versus corpus size",
  tags: ["figure", "production"],
  page: "/",
  selector: "#production > figure",
  image: "visuals/token-cost.jpg",
  html: "visuals/token-cost.html",
  width: 600,
  height: 370,
};

function packWithVisuals(): string {
  const dir = mkdtempSync(join(tmpdir(), "wa-visual-"));
  cpSync("packs/smallest/pack.json", join(dir, "pack.json"));
  writeFileSync(join(dir, "visuals.json"), JSON.stringify([chart]));
  mkdirSync(join(dir, "visuals"));
  writeFileSync(join(dir, "visuals", "token-cost.jpg"), "jpg-bytes");
  writeFileSync(join(dir, "visuals", "token-cost.html"), "<style>.w0{color:red}</style><figure class=w0>chart</figure>");
  return dir;
}

describe("visuals", () => {
  test("pack loader reads visuals.json", () => {
    const dir = packWithVisuals();
    const config = loadPackConfig(dir);
    expect(config.dir).toBe(dir);
    expect(config.visuals?.[0]?.id).toBe("token-cost");
  });

  test("ranking finds a visual by label, tags, and text", () => {
    const deploy: Visual = { ...chart, id: "deploy", label: "Runs everywhere", text: "Air-gapped", tags: ["section", "security"] };
    expect(findVisuals([chart, deploy], "token cost").map((v) => v.id)).toEqual(["token-cost"]);
    expect(findVisuals([chart, deploy], "security review").map((v) => v.id)).toEqual(["deploy"]);
    expect(findVisuals([chart, deploy], "pricing")).toEqual([]);
  });

  test("docs_lookup returns matching visuals; the prompt holds only the rule", async () => {
    const config = loadPackConfig(packWithVisuals());
    const runtime = { config, dir: config.dir!, instruction: "", policy: packPolicy(config), site: {} as never, pages: [], chunks: [] };
    const out = (await docsLookupTool(runtime).call({ query: "token cost per question" })) as { visuals?: { id: string }[] };
    expect(out.visuals?.map((v) => v.id)).toEqual(["token-cost"]);
    expect(VISUAL_RULE).toContain("[[show:ID]]");
    expect(VISUAL_RULE).not.toContain("token-cost");
    expect(REPLY_SHAPE).toContain("first paragraph");
  });

  test("site icon becomes the brand logo", () => {
    const html = '<link rel="icon" href="/favicon.ico"><link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2">';
    expect(iconHref(html, "https://site.test")).toBe("https://site.test/favicon.svg?v=2");
    expect(iconHref("<p>no icon</p>", "https://site.test")).toBeUndefined();
  });

  test("widget embeds visuals with absolute picture urls", () => {
    const config = loadPackConfig(packWithVisuals());
    const html = packWidget("https://agent.test/", "run-1", config);
    expect(html).toContain('"image":"https://agent.test/visuals/token-cost.jpg"');
    expect(html).toContain('"html":"https://agent.test/visuals/token-cost.html"');
    expect(html).toContain("attachShadow");
    expect(html).toContain("Show on page");
    expect(html).toContain("#wa-root.hints #wa-chips");
    expect(html).toContain("typeHint");
    const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1] ?? "";
    expect(() => new Function(script)).not.toThrow();
  });

  test("host serves a visual picture and blocks other files", async () => {
    const config = loadPackConfig(packWithVisuals());
    const h = new Harness();
    const room = new Room(h);
    const fetchFn = host(h, room, "https://agent.test", { name: config.brand.name }, new Sessions(h, room), config);
    const hit = await fetchFn(new Request("https://agent.test/visuals/token-cost.jpg"));
    expect(hit.status).toBe(200);
    expect(hit.headers.get("content-type")).toBe("image/jpeg");
    const saved = await fetchFn(new Request("https://agent.test/visuals/token-cost.html"));
    expect(saved.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(await saved.text()).toContain("<figure class=w0>");
    const escape = await fetchFn(new Request("https://agent.test/visuals/..%2Fpack.json"));
    expect(await escape.text()).not.toContain('"brand"');
  });
});

describe("show markers", () => {
  test("machine reply drops markers and lists the visual", async () => {
    const { splitShows } = await import("../src/site/visual.ts");
    const got = splitShows("Fewer tokens.\n\n[[show:token-cost]]\n\n- detail\n[[show:missing]]", [chart]);
    expect(got.text).toBe("Fewer tokens.\n\n- detail");
    expect(got.shown.map((v) => v.id)).toEqual(["token-cost"]);
  });
});

describe("starter hints", () => {
  const page = (url: string, headings: string[] = []) =>
    ({ url, status: 200, title: "", description: "", headings, text: "", links: [], forms: [], gated: false });

  test("from-url builds three short bubbles and adds page topics to typed hints", async () => {
    const { starterHints } = await import("../src/pack/from-url.ts");
    const got = starterHints("Acme", [page("https://acme.test/", ["Fast deploys", "A very long heading that should not become a hint"]), page("https://acme.test/pricing")]);
    expect(got.chips).toEqual(["What does Acme do?", "How do I get started?", "How much does it cost?"]);
    expect(got.hints).toContain("Tell me about Fast deploys");
    expect(got.hints.some((h) => h.includes("very long"))).toBe(false);
  });

  test("widget types widget.hints and shows at most three bubbles", () => {
    const config = loadPackConfig("packs/smallest");
    config.widget.hints = ["Typed one", "Typed two"];
    config.widget.chips = ["A?", "B?", "C?", "D?"];
    const html = packWidget("https://agent.test", "run-1", config);
    expect(html).toContain('const HINTS = ["Typed one","Typed two"]');
    expect(html).not.toContain('data-q=\\"D?\\"');
    expect(html).toContain('data-q=\\"C?\\"');
  });
});
