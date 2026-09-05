import { clientKind } from "./detect.ts";

export interface Hop {
  t: number;
  method: string;
  path: string;
  status: number;
  ms: number;
  kind: string;
  reqBytes: number;
  resBytes: number;
  req?: string;
  res?: string;
}

const CLIP = 1500;

export function clip(text: string, max = CLIP): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "…";
}

/** Wrap a host fetch so each hop is recorded. Do not read SSE bodies. */
export function tapFetch(
  inner: (req: Request) => Promise<Response>,
  onHop: (hop: Hop) => void,
): (req: Request) => Promise<Response> {
  return async (req) => {
    const t0 = Date.now();
    const url = new URL(req.url);
    let reqText = "";
    if (req.method !== "GET" && req.method !== "HEAD") {
      reqText = await req.clone().text();
    }
    const res = await inner(req);
    const ct = res.headers.get("content-type") ?? "";
    const streamed = ct.includes("event-stream") || ct.includes("octet-stream");
    const resText = streamed ? "[stream]" : await res.clone().text();
    onHop({
      t: Date.now(),
      method: req.method,
      path: url.pathname + url.search,
      status: res.status,
      ms: Date.now() - t0,
      kind: clientKind(req),
      reqBytes: reqText.length,
      resBytes: streamed ? 0 : resText.length,
      req: reqText ? clip(reqText) : undefined,
      res: clip(resText),
    });
    return res;
  };
}
