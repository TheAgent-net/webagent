import type { Harness } from "./harness.ts";
import { mcp, type McpServerInfo } from "./mcp.ts";
import { siteHttp } from "./site/http.ts";

/** Thin HTTP edge: many requests → many runs. No reasoning here. */
export function intake(harness: Harness, mcpInfo?: McpServerInfo): (req: Request) => Promise<Response> {
  const mcpFetch = mcp(harness, mcpInfo);
  const sites = siteHttp(harness);
  return async (req: Request) => {
    const url = new URL(req.url);
    if (url.pathname === "/mcp") return mcpFetch(req);
    const site = await sites(req, url);
    if (site) return site;
    if (req.method === "GET" && url.pathname === "/models") {
      return Response.json(harness.getAvailableModels());
    }
    if (req.method === "GET" && url.pathname === "/health") {
      return Response.json(harness.getHealth());
    }
    if (req.method === "POST" && url.pathname === "/runs") {
      const body = (await req.json().catch(() => ({}))) as { text?: string; model?: string };
      const run = harness.create({ model: body.model ?? "echo" });
      if (body.text) run.inject({ text: body.text });
      const result = await harness.scheduler.run(() => run.start());
      return Response.json(result);
    }
    if (req.method === "GET" && url.pathname.startsWith("/runs/")) {
      const id = url.pathname.slice("/runs/".length);
      const run = harness.get(id);
      if (!run) return new Response("not found", { status: 404 });
      return Response.json(run.explain());
    }
    return new Response("not found", { status: 404 });
  };
}
