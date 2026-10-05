import { describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { frontRoute, SITE_TENANT } from "../src/host/front.ts";
import { openStore } from "../src/store/sqlite.ts";

function setup() {
  const dir = mkdtempSync(join(tmpdir(), "front-"));
  writeFileSync(join(dir, "index.html"), "<h1>agentnet</h1>");
  mkdirSync(join(dir, "options", "a"), { recursive: true });
  writeFileSync(join(dir, "options", "a", "index.html"), "<h1>A</h1>");
  writeFileSync(join(dir, "options", "BRIEF.md"), "private");
  const store = openStore(":memory:");
  const route = frontRoute(store, { dir, skip: (req) => req.headers.get("host") === "agent.acme.test" });
  const call = async (path: string, init: RequestInit = {}) => {
    const req = new Request("http://cloud.test" + path, init);
    return route(req, new URL(req.url));
  };
  return { store, call, route };
}

describe("front", () => {
  test("serves the site and option folders, not notes", async () => {
    const { call } = setup();
    expect(await (await call("/"))!.text()).toContain("agentnet");
    expect((await call("/options/a"))!.status).toBe(301);
    expect(await (await call("/options/a/"))!.text()).toContain("A");
    expect(await call("/options/BRIEF.md")).toBeNull();
    expect(await call("/../package.json")).toBeNull();
    expect(await call("/t/acme/widget.js")).toBeNull();
  });

  test("steps aside on a tenant domain", async () => {
    const { route } = setup();
    const req = new Request("http://agent.acme.test/", { headers: { host: "agent.acme.test" } });
    expect(await route(req, new URL(req.url))).toBeNull();
  });

  test("access request is validated and stored", async () => {
    const { store, call } = setup();
    const post = (body: object) =>
      call("/access", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    expect((await post({ site: "", email: "a@b.co" }))!.status).toBe(400);
    expect((await post({ site: "acme.dev", email: "nope" }))!.status).toBe(400);
    const ok = await post({ site: "acme.dev/docs", email: "maya@acme.dev" });
    expect(ok!.status).toBe(200);
    const rows = store.listEvents(SITE_TENANT, { type: "access" });
    expect(rows).toHaveLength(1);
    expect(rows[0]!.data).toEqual({ site: "https://acme.dev", email: "maya@acme.dev" });
  });
});
