---
url: https://docs.composio.dev/reference/api-reference/tools
title: Tools | Composio
description: Tool execution endpoints
status: 200
---

API Reference

# Tools

Copy page

Tools are the individual executable actions inside a toolkit, like `GMAIL_SEND_EMAIL` or `GITHUB_CREATE_ISSUE`. Each tool has an input schema describing its parameters and an output schema describing what it returns. Tool slugs are SCREAMING\_SNAKE\_CASE and follow a `{TOOLKIT}_{ACTION}` pattern.

Reach for these endpoints when you want to:

- List or search the catalog of available tools, optionally scoped to one or more toolkits.
- Fetch a single tool's input and output schema by `tool_slug` before constructing a call.
- Execute a tool on behalf of a user's connected account, or generate the inputs for an execution from natural language.
- Look up the OAuth scopes a set of tools requires, or send an authenticated proxy request to an app's underlying API.

These endpoints authenticate with your project API key in the `x-api-key` header.

Manual tool execution requires an explicit toolkit version. Pass `toolkit_versions=latest` (or pin a dated version like `20251027_00`) so calls resolve to a known tool definition. See the [toolkit versioning migration guide](https://docs.composio.dev/docs/migration-guide/toolkit-versioning).

For the concepts behind tools, schemas, and authentication, see [Tools and toolkits](https://docs.composio.dev/docs/how-composio-works).

## [Proxy execute](https://docs.composio.dev/reference/api-reference/tools\#proxy-execute)

Proxy execute sends an authenticated HTTP request through a toolkit's [connected account](https://docs.composio.dev/docs/auth-configuration/connected-accounts) without a predefined tool, and Composio injects the OAuth token, API key, or other credentials on the server side so your code never touches raw secrets. Reach for it when you need an endpoint that Composio's predefined tools do not cover, when you need a request shape (custom query parameters, field masks, or advanced filters) that a predefined tool cannot express, or when a terminal agent would otherwise hardcode a bearer token in a `curl` call.

Call it with `composio.tools.proxyExecute()` in the TypeScript SDK, `composio.tools.proxy()` in the Python SDK, or `POST /api/v3.1/tools/execute/proxy` over HTTP. The `endpoint` can be an absolute URL (`https://api.example.com/v1/resource`) or a path relative to the toolkit's base URL (`/v1/resource`), `method` is the HTTP verb, `connectedAccountId` selects the account to authenticate as, `body` carries the JSON payload, and `parameters` adds extra headers and query parameters. The response forwards the upstream `status`, `headers`, and parsed `data` verbatim.

```
// @noErrors
import { Composio } from '@composio/core';

const composio = new Composio({ apiKey: 'your_api_key' });

const { status, data } = await composio.tools.proxyExecute({
  endpoint: '/repos/composiohq/composio/issues/1',
  method: 'GET',
  connectedAccountId: 'ca_github_user_123',
  parameters: [{ name: 'Accept', value: 'application/vnd.github.v3+json', in: 'header' }],
});

console.log(status, data);
```

Proxy execute rejects cross-domain requests, so the `endpoint` must resolve to the same domain as the connected account's toolkit, and you should not set the `Authorization` header yourself because Composio injects the correct credential for the account's auth scheme. This is an intentional security boundary, not a quota, so it cannot be bypassed by reshaping the request.

Proxy execute is a form of [direct tool execution](https://docs.composio.dev/docs/sessions-vs-direct-execution): it bypasses session state, tool schemas, and modifiers. If you are building an agent, prefer [sessions](https://docs.composio.dev/docs/configuring-sessions), and use the proxy only for the specific API call that is not available as a tool. The full request and response schema lives in the [`POST /api/v3.1/tools/execute/proxy`](https://docs.composio.dev/reference/api-reference/tools/postToolsExecuteProxy) reference.

## [Endpoints](https://docs.composio.dev/reference/api-reference/tools\#endpoints)

| Endpoint | Quick Link |
| --- | --- |
| `GET /api/v3.1/tools` | [List available tools](https://docs.composio.dev/reference/api-reference/tools/getTools) |
| `GET /api/v3.1/tools/enum` | [Get tool enum list](https://docs.composio.dev/reference/api-reference/tools/getToolsEnum) |
| `GET /api/v3.1/tools/{tool_slug}` | [Get tool by slug](https://docs.composio.dev/reference/api-reference/tools/getToolsByToolSlug) |
| `POST /api/v3.1/tools/execute/{tool_slug}` | [Execute tool](https://docs.composio.dev/reference/api-reference/tools/postToolsExecuteByToolSlug) |
| `POST /api/v3.1/tools/execute/{tool_slug}/input` | [Generate tool inputs from natural language](https://docs.composio.dev/reference/api-reference/tools/postToolsExecuteByToolSlugInput) |
| `POST /api/v3.1/tools/execute/proxy` | [Execute proxy request](https://docs.composio.dev/reference/api-reference/tools/postToolsExecuteProxy) |
| `POST /api/v3.1/tools/scopes/required` | [Get required scopes for tools](https://docs.composio.dev/reference/api-reference/tools/postToolsScopesRequired) Legacy |

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/tools/index.mdx)

### On this page

[Proxy execute](https://docs.composio.dev/reference/api-reference/tools#proxy-execute) [Endpoints](https://docs.composio.dev/reference/api-reference/tools#endpoints)
