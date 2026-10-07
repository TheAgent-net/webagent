import type { Harness } from "../harness.ts";
import { attachPack } from "./attach.ts";
import { siteBook } from "./book.ts";
import type { AuthGrant } from "./types.ts";

/** App-layer HTTP. Composed by intake; does not sit in the loop. */
export function siteHttp(harness: Harness): (req: Request, url: URL) => Promise<Response | null> {
  const book = siteBook(harness);
  return async (req, url) => {
    if (req.method === "POST" && url.pathname === "/sites") {
      const body = (await req.json().catch(() => ({}))) as { url?: string; maxPages?: number; model?: string };
      if (!body.url) return new Response("url required", { status: 400 });
      const job = await book.ingest(body.url, { maxPages: body.maxPages });
      let runId: string | undefined;
      if (job.pack.pages.length) {
        runId = attachPack(harness, job.pack, { model: body.model }).id;
      }
      return Response.json({ id: job.id, runId, pack: job.pack });
    }
    if (req.method === "GET" && url.pathname === "/sites") {
      return Response.json(book.list());
    }
    if (url.pathname.startsWith("/sites/")) {
      const rest = url.pathname.slice("/sites/".length);
      const [id, tail] = rest.split("/");
      const job = id ? book.get(id) : undefined;
      if (!job) return new Response("not found", { status: 404 });
      if (req.method === "GET" && !tail) return Response.json({ id: job.id, pack: job.pack });
      if (req.method === "POST" && tail === "auth") {
        const grant = (await req.json().catch(() => ({}))) as AuthGrant;
        const next = await book.grant(job.id, grant);
        let runId: string | undefined;
        if (next.pack.pages.length) runId = attachPack(harness, next.pack).id;
        return Response.json({ id: next.id, runId, pack: next.pack });
      }
    }
    return null;
  };
}
