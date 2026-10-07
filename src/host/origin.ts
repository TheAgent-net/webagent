/**
 * Origin: the allowlist of page origins that may call a tenant from a browser.
 *
 * - An empty list allows any origin.
 * - Our own base origin is always allowed.
 * - A request with no `Origin` header is a machine client. Allow it.
 */

/** Normalize one origin, for example `https://Acme.com/` to `https://acme.com`. */
export function normalizeOrigin(value: string): string {
  try {
    return new URL(value).origin.toLowerCase();
  } catch {
    return value.trim().replace(/\/+$/, "").toLowerCase();
  }
}

/** True when `origin` may call us. `base` is our own public URL. */
export function isAllowed(origin: string | null | undefined, origins: readonly string[], base: string): boolean {
  if (!origin) return true;
  if (!origins.length) return true;
  const seen = normalizeOrigin(origin);
  if (seen === normalizeOrigin(base)) return true;
  return origins.some((o) => normalizeOrigin(o) === seen);
}

/** The 403 reply for a page origin that is not on the list. */
export function refuseOrigin(): Response {
  return Response.json(
    { error: "origin_not_allowed", reason: "This page origin may not use this agent." },
    { status: 403 },
  );
}
