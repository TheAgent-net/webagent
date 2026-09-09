---
url: https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdExecute
title: Execute a tool within a tool router session | Composio
description: Execute a tool (meta or app) within an existing tool router session.
status: 200
---

API Reference [Sessions (prev Tool Router)](https://docs.composio.dev/reference/api-reference/tool-router)

# Execute a tool within a tool router sessionv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`tool_router`/`session`/`{session_id}`/`execute`

Send

Authorization

Path

Body

Execute a tool (meta or app) within an existing tool router session.

## [Authorization](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdExecute\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdExecute\#parameters-path)

session\_idstring

Tool router session ID (required for public API, optional for internal - injected by middleware)

Format:`toolRouterSessionId`

## [Request Body](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdExecute\#request-body)

`application/json`

tool\_slugstringRequired

The unique slug identifier of the tool to execute. Supports both meta tools and app tools exposed by the session.

argumentsobject

The arguments required by the tool

Show 1 child attributes

accountstring

Account identifier to specify which connected account to use for direct tool execution. Use the account ID (e.g. "coup\_hurricane\_dal\_analytical") or an alias. When omitted with a single account, the default is used. When omitted with multiple accounts, an error lists available accounts. Meta/helper tools either ignore this top-level field or define their own account-selection fields, for example COMPOSIO\_MULTI\_EXECUTE\_TOOL.tools\[\].account.

enable\_auto\_workbench\_offloadboolean

When true, direct non-meta tool execution may return a workbench offload preview if the response exceeds the configured threshold and the session workbench is enabled. When omitted or false, direct tool execution returns the normal inline response. Meta/helper tools are unaffected, and COMPOSIO\_MULTI\_EXECUTE\_TOOL uses session.workbench configuration for its own batch-level offload behavior.

experimentalobject

Inline custom tools and toolkits for this request. v3.1 sessions do not persist customs — pass them on every request that needs them.

Show 2 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdExecute\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

### 413  `application/json`

### 429  `application/json`

### 500  `application/json`

### 502  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X POST "https://backend.composio.dev/api/v3.1/tool_router/session/{session_id}/execute" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "tool_slug": "GITHUB_CREATE_AN_ISSUE"
  }'
```

200400401403404413429500502

```
{
  "data": {
    "message": "Hello, World!",
    "status": "success"
  },
  "error": "string",
  "log_id": "log_abc123xyz"
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/tool-router/postToolRouterSessionBySessionIdExecute.mdx)
