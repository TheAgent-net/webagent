---
url: https://docs.composio.dev/reference/api-reference/tool-router/deleteToolRouterSessionBySessionId
title: Delete a tool router session | Composio
description: Deletes a tool router session. The session immediately stops being retrievable and executable — subsequent requests against it (including its MCP URL) return 404 — and any compute sandboxes attached to the session are shut down. Deleting an already-deleted session returns 404.
status: 200
---

API Reference [Sessions (prev Tool Router)](https://docs.composio.dev/reference/api-reference/tool-router)

# Delete a tool router sessionv3.1

Copy page

Server URL`https://backend.composio.dev/`

DELETE

``/`api`/`v3.1`/`tool_router`/`session`/`{session_id}`

Send

Authorization

Path

Deletes a tool router session. The session immediately stops being retrievable and executable — subsequent requests against it (including its MCP URL) return 404 — and any compute sandboxes attached to the session are shut down. Deleting an already-deleted session returns 404.

## [Authorization](https://docs.composio.dev/reference/api-reference/tool-router/deleteToolRouterSessionBySessionId\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/tool-router/deleteToolRouterSessionBySessionId\#parameters-path)

session\_idstringRequired

The unique identifier of the tool router session

Format:`toolRouterSessionId`

## [Response Body](https://docs.composio.dev/reference/api-reference/tool-router/deleteToolRouterSessionBySessionId\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 404  `application/json`

### 500  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X DELETE "https://backend.composio.dev/api/v3.1/tool_router/session/trs_1a2b3c4d5e6f" \
  -H "x-api-key: "
```

200400401404500

```
{
  "session_id": "trs_1a2b3c4d5e6f",
  "deleted": true
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/tool-router/deleteToolRouterSessionBySessionId.mdx)
