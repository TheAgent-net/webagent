# Webagent dashboard API (contract v1)

The Agent-net admin dashboard (`agentnet-frontend`, `apps/admin-dashboard`) reads webagent data through this JSON API. The webagent service serves it. In production, nginx on `app.agentnet.market` proxies `/webagent/` to the webagent container, so the Agent-net session cookie reaches the service.

- **Base path:** `/webagent/api`
- **Format:** JSON in and out. Times are epoch milliseconds. Days are `YYYY-MM-DD` in UTC.

## Auth

- The browser sends the `agentnet_session` cookie (`credentials: "include"`).
- The service forwards the `Cookie` header to the platform: `GET {AGENTNET_PLATFORM_URL}/auth/me`. The default URL is `http://platform:8000`.
- The service caches each answer for 30 s, keyed by a hash of the cookie.
- **Read:** the user has an `active` membership in `{orgId}`.
- **Write** (settings, reload, create site): the user's role is `owner` or `admin`.
- **Errors:** `401 {"error":"login"}` with no valid session. `403 {"error":"role"}` when the user is not a member or the role is too low. `404 {"error":"site"}` for an unknown site, or a site in another org.
- **Super admin:** a request with `Authorization: Bearer <WEBAGENT_ADMIN_KEY>` may read every org. It is for operations only.

## Sites

A site is one tenant (one customer website). Each site belongs to one org (`tenant.org`).

### `GET /orgs/{orgId}/sites`
```json
{ "items": [ { "id": "acme", "name": "Acme Docs", "domains": [], "origins": ["https://acme.dev"],
  "widgetUrl": "https://agentnet.it.com/t/acme/widget.js", "paused": false, "created": 1760000000000 } ] }
```

### `POST /orgs/{orgId}/sites` (write)
- Body: `{"url": "https://acme.dev", "id"?: "acme", "name"?: "Acme Docs"}`
- Starts onboarding (crawl, pack, visuals) in the background.
- Reply `202 {"id": "acme", "status": "building"}`.
- `id` is `^[a-z0-9][a-z0-9_-]{0,62}$`. It is derived from the host when missing. An `id` that is already taken returns `409`.

### `GET /orgs/{orgId}/sites/{siteId}/status`
`{"status": "building" | "ready" | "failed", "error"?: "..."}`

## Overview

### `GET /orgs/{orgId}/sites/{siteId}/overview?days=7|30|90`
```json
{
  "range": { "days": 30, "since": 1760000000000 },
  "kpis": { "human": 85, "agent": 69, "agentVerifiedShare": 0.38, "intelligent": 41,
            "agentsSeen": 129, "handoffs": 8, "thumbsDownRate": 0.38, "votes": 39 },
  "funnel": [
    { "step": "seen", "label": "Agents seen", "n": 129 },
    { "step": "found", "label": "Read llms.txt or the agent card", "n": 77 },
    { "step": "talked", "label": "Talked on chat or MCP", "n": 69 },
    { "step": "intelligent", "label": "Intelligent, two turns or more", "n": 32 }
  ],
  "days": [ { "day": "2026-10-01", "human": 3, "agent": 4 } ],
  "families": [ { "family": "chatgpt", "requests": 50, "verifiedShare": 0.28, "conversations": 15 } ],
  "checklist": [ { "id": "script", "label": "Script tag seen", "done": true, "hint": "..." } ]
}
```
Checklist ids: `script`, `csp`, `handoff`, `conversation`, `cdn`.

## Conversations

### `GET /orgs/{orgId}/sites/{siteId}/conversations`
- Query: `kind`, `label`, `channel`, `handoff` (`true`|`false`), `q`, `days`, `limit` (≤ 100, default 25), `offset`.
- Reply:
```json
{ "total": 154, "items": [ { "session": "w1a2b3", "channel": "widget", "kind": "human", "family": null,
  "verified": false, "score": null, "label": "human", "page": "https://acme.dev/pricing", "handoff": false,
  "started": 1760000000000, "updated": 1760000300000, "turns": 3, "firstQuestion": "Which plan fits..." } ] }
```

### `GET /orgs/{orgId}/sites/{siteId}/conversations/{session}`
```json
{ "conversation": { "...": "same fields as a list item" },
  "turns": [ { "id": 1, "at": 1760000000000, "from": "human", "said": "...", "reply": "...",
               "visual": "plans", "ms": 1400 } ],
  "feedback": [ { "turn": 1, "vote": -1, "note": "...", "at": 1760000000000 } ],
  "handoffs": [ { "email": "maya@acme.dev", "note": "...", "at": 1760000000000 } ] }
```
`reply` is plain text with `[[show:id]]` markers. The UI shows a marker as a "visual: id" chip, and it must escape all text.

## Agent traffic

### `GET /orgs/{orgId}/sites/{siteId}/traffic?days=`
```json
{ "byDay": [ { "day": "2026-10-01", "key": "assistant", "n": 12 } ],
  "families": [ { "family": "chatgpt", "kind": "assistant", "requests": 50, "verifiedShare": 0.28 } ],
  "paths": [ { "path": "/llms.txt", "n": 40, "verified": 12 } ],
  "browserPages": [ { "page": "https://acme.dev/pricing", "n": 6 } ],
  "cdn": { "connected": false, "rows": [ { "key": "chatgpt", "n": 300 } ] } }
```

## Questions

### `GET /orgs/{orgId}/sites/{siteId}/questions?days=`
```json
{ "top": [ { "text": "which plan fits a team", "n": 12, "lastAt": 1760000000000, "session": "w1a2b3" } ],
  "gaps": [ { "session": "w9", "said": "Do you have SOC 2?", "reason": "handoff", "at": 1760000000000 } ] }
```
`reason` is `handoff` or `thumbs_down`.

## Install and settings

### `GET /orgs/{orgId}/sites/{siteId}/settings`
```json
{ "install": { "scriptTag": "<script src=\"https://agentnet.it.com/t/acme/widget.js\" async></script>",
               "llmsLine": "- [Talk to the Acme Docs agent](https://agentnet.it.com/t/acme/chat): POST JSON {text, session}",
               "csp": [ "script-src https://agentnet.it.com", "connect-src https://agentnet.it.com",
                        "img-src https://agentnet.it.com", "font-src https://agentnet.it.com",
                        "style-src 'unsafe-inline'" ] },
  "domains": [], "origins": ["https://acme.dev"],
  "handoff": { "email": "", "webhook": "", "slack": "" },
  "cap": 0, "paused": false }
```

### `PUT /orgs/{orgId}/sites/{siteId}/settings` (write)
- Body: any subset of `domains`, `origins`, `handoff`, `cap`, `paused`.
- The service validates every field and returns the new settings.
- The webhook and Slack URLs must be `https`.

### `POST /orgs/{orgId}/sites/{siteId}/reload` (write)
`204`. The next request reopens the site's agent.

### `GET /orgs/{orgId}/sites/{siteId}/export.csv?what=conversations|turns&days=`
- Returns `text/csv`.
- Cells that start with `= + - @` get a leading `'`.

## Errors

- **Shape:** `{"error": "<code>", "reason": "<plain sentence>"}`.
- **Codes:** `login`, `role`, `site`, `bad_request`, `conflict`, `rate`, `server`.
