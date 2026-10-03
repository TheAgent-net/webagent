import { describe, expect, test } from "bun:test";
import { cpSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Harness } from "../src/harness.ts";
import { host } from "../src/host/host.ts";
import { Room } from "../src/host/room.ts";
import { Sessions } from "../src/host/sessions.ts";
import { REPLY_SHAPE, visualVars } from "../src/pack/attach.ts";
import { loadPackConfig } from "../src/pack/index.ts";
import { listVisualLines, type Visual } from "../src/site/visual.ts";
import { packWidget } from "../src/widget/widget.ts";

const chart: Visual = {
  id: "token-cost",
  kind: "figure",
  label: "Per-question token cost",
  text: "Cost versus corpus size",
  page: "/",
  selector: "#production > figure",
  image: "visuals/token-cost.jpg",
  width: 600,
  height: 370,
};

function packWithVisuals(): string {
  const dir = mkdtempSync(join(tmpdir(), "wa-visual-"));
  cpSync("packs/smallest/pack.json", join(dir, "pack.json"));
  writeFileSync(join(dir, "visuals.json"), JSON.stringify([chart]));
  mkdirSync(join(dir, "visuals"));
  writeFileSync(join(dir, "visuals", "token-cost.jpg"), "jpg-bytes");
  return dir;
}

describe("visuals", () => {
  test("pack loader reads visuals.json", () => {
    const dir = packWithVisuals();
    const config = loadPackConfig(dir);
    expect(config.dir).toBe(dir);
    expect(config.visuals?.[0]?.id).toBe("token-cost");
  });

  test("model sees each visual id and the show marker", () => {
    expect(listVisualLines([chart])).toContain("- token-cost: Per-question token cost — Cost versus corpus size (page /)");
    const vars = visualVars([chart]);
    expect(vars).toContain("[[show:ID]]");
    expect(vars).toContain("at most one");
    expect(REPLY_SHAPE).toContain("first paragraph");
  });

  test("widget embeds visuals with absolute picture urls", () => {
    const config = loadPackConfig(packWithVisuals());
    const html = packWidget("https://agent.test/", "run-1", config);
    expect(html).toContain('"image":"https://agent.test/visuals/token-cost.jpg"');
    expect(html).toContain("Show on page");
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
