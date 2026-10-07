import { clip, type Hop } from "../src/host/hop.ts";
import type { Tool } from "../src/tools.ts";

export function peerTool(peerUrl: string, onHop?: (hop: Hop) => void): Tool {
  const base = peerUrl.replace(/\/+$/, "");
  let session: string | undefined;
  return {
    name: "ask_peer",
    description: "Ask the other public agent. Pass the visitor question as text.",
    schema: { type: "object", properties: { text: { type: "string" } }, required: ["text"] },
    async call(args) {
      const t0 = Date.now();
      const text = String(args.text ?? "");
      const body = JSON.stringify({ text, from: "machine", session });
      const res = await fetch(base + "/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          "user-agent": "webagent-buyer/0.4",
          "x-agent": "buyer",
        },
        body,
      });
      const raw = await res.text();
      onHop?.({
        t: Date.now(),
        method: "POST",
        path: "/chat",
        status: res.status,
        ms: Date.now() - t0,
        kind: "machine",
        reqBytes: body.length,
        resBytes: raw.length,
        req: clip(body),
        res: clip(raw),
      });
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const rec = parsed as Record<string, unknown>;
          if (typeof rec.session === "string") session = rec.session;
          return rec;
        }
        return { value: parsed };
      } catch {
        return { error: "bad_json", status: res.status, raw: raw.slice(0, 400) };
      }
    },
  };
}
