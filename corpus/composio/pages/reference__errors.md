---
url: https://docs.composio.dev/reference/errors
title: Errors (/reference/errors)
description: 
status: 200
---

# Errors (/reference/errors)

> **API version:** This page documents Composio REST API v3.1, the current version, at `https://backend.composio.dev/api/v3.1`. `https://backend.composio.dev/api/v3` is the previous version and remains supported.

Composio uses conventional HTTP response codes to indicate the success or failure of an API request. In general: codes in the `2xx` range indicate success, codes in the `4xx` range indicate an error with the information provided, and codes in the `5xx` range indicate an error with Composio's servers.

## The error object [#the-error-object]

```json
{
  "error": {
    "message": "No connected account found for this user and toolkit",
    "status": 400,
    "request_id": "req_abc123def456",
    "suggested_fix": "Connect the user to the toolkit first"
  }
}
```

### Attributes [#attributes]

| Attribute       | Description                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `message`       | A human-readable message providing details about the error.                 |
| `status`        | The HTTP status code.                                                       |
| `request_id`    | A unique identifier for this request. Include this when contacting support. |
| `suggested_fix` | When available, guidance on how to resolve the error.                       |

## HTTP status codes [#http-status-codes]

| Code               | Status               | Description                                                                                      |
| ------------------ | -------------------- | ------------------------------------------------------------------------------------------------ |
| 200                | OK                   | Everything worked as expected.                                                                   |
| 400                | Bad Request          | The request was unacceptable, often due to missing a required parameter.                         |
| 401                | Unauthorized         | No valid API key provided.                                                                       |
| 403                | Forbidden            | The API key doesn't have permissions to perform the request.                                     |
| 404                | Not Found            | The requested resource doesn't exist.                                                            |
| 409                | Conflict             | The request conflicts with another request (perhaps due to using the same idempotent key).       |
| 422                | Unprocessable Entity | The request was valid but cannot be processed.                                                   |
| 429                | Too Many Requests    | Too many requests hit the API too quickly. We recommend an exponential backoff of your requests. |
| 500, 502, 503, 504 | Server Errors        | Something went wrong on Composio's end.                                                          |

## Error types [#error-types]

### Authentication errors [#authentication-errors]

Composio uses two types of API keys:

* **Project API key** (`x-api-key`) — For project-level operations
* **Organization API key** (`x-org-api-key`) — For organization-level access across projects

| Error                      | Cause                                                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Invalid API key            | The API key is incorrect or revoked. Verify in [Settings](https://dashboard.composio.dev/~/project/settings/api-keys). |
| No authentication provided | The request is missing the `x-api-key` or `x-org-api-key` header.                                                      |
| Invalid organization key   | The organization API key is incorrect or revoked. Verify in Organization Settings.                                     |
| Insufficient permissions   | The API key doesn't have access to this resource.                                                                      |

> See [Authenticating users](/docs/authentication) for more help.

### Tool errors [#tool-errors]

Errors that occur when fetching or executing tools.

| Error                 | Cause                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------ |
| Tool not found        | The tool slug doesn't exist. Tool slugs are case-sensitive and use `SCREAMING_SNAKE_CASE`. |
| No connected account  | The user hasn't connected to this toolkit yet.                                             |
| Tool execution failed | The external service returned an error. Check tool parameters and user permissions.        |

> See [Tools and toolkits](/docs/how-composio-works) for more help.

### Connection errors [#connection-errors]

Errors related to connected accounts.

| Error                       | Cause                                                            |
| --------------------------- | ---------------------------------------------------------------- |
| Connected account not found | The `connectedAccountId` doesn't exist or was deleted.           |
| Auth refresh required       | The OAuth token has expired. Prompt the user to re-authenticate. |
| Connected account deleted   | The connection was removed. Create a new connection.             |

### Trigger errors [#trigger-errors]

Errors related to trigger subscriptions.

| Error                    | Cause                                                          |
| ------------------------ | -------------------------------------------------------------- |
| Trigger not found        | The trigger slug doesn't exist for this toolkit.               |
| Trigger instance deleted | The trigger subscription or its connected account was removed. |

> See [Triggers](/docs/triggers) for more help.

## Rate limiting [#rate-limiting]

When you hit rate limits, you'll receive a `429` status code. See [Rate Limits](/reference/rate-limits) for details on limits by plan and best practices for handling rate limit errors.

## Getting help [#getting-help]

When contacting support, include the `request_id` from the error response.

- [Discord](https://discord.com/channels/1170785031560646836/1268871288156323901): 
Community support

- [Email](mailto:support@composio.dev): 
Contact support team

- [GitHub](https://github.com/ComposioHQ/composio/issues/new?labels=bug): 
Report a bug

---

📚 **More documentation:** [View all docs](https://docs.composio.dev/llms.txt) | [Glossary](https://docs.composio.dev/llms.mdx/reference/glossary) | [Examples](https://docs.composio.dev/llms.mdx/examples) | [API Reference](https://docs.composio.dev/llms.mdx/reference)

---

# Composio SDK — Notes for AI Code Generators

**Purpose:** Reference for generating current (v3) [Composio](https://composio.dev/) integration code.
**Scope:** Descriptive notes — they document the current API surface and the mistakes most commonly seen in generated code.

---

## 1. Recommended Integration: Sessions

Composio supports two integration modes: **Native Tools** (with a provider package) and **MCP** (no provider package needed).

### Native Tools

```python
# ✅ CORRECT — Python (defaults to OpenAI)
from composio import Composio

composio = Composio()
session = composio.create(user_id="user_123")
tools = session.tools()
# Pass tools to your agent/LLM framework
```

```typescript
// ✅ CORRECT — TypeScript (defaults to OpenAI)
import { Composio } from "@composio/core";

const composio = new Composio();
const session = await composio.create("user_123");
const tools = await session.tools();
// Pass tools to your agent/LLM framework
```

For other providers, pass the provider explicitly. Provider packages follow the naming convention: `composio_<provider>` for Python, `@composio/<provider>` for TypeScript.

### MCP

Use `session.mcp.url` and `session.mcp.headers` with any MCP-compatible client (Claude Desktop, Cursor, OpenAI Agents, etc.). No provider package needed.

---

## 2. Integration Notes

- `composio.create(user_id)` is the standard entry point for agent integrations. Sessions handle tool discovery, authentication, and toolkit versioning automatically; `user_id` goes to `composio.create()` — individual tool calls in session mode don't take one.
- Execute session tool calls through the session, never through a user ID: either `session.execute(tool_slug, arguments=...)` / `session.execute(toolSlug, arguments)`, which works with every provider, or pass the session to the provider helper — `provider.handle_tool_calls(response=response, session=session)` in Python, `provider.handleToolCalls(session, response)` in TypeScript. Only the OpenAI and Anthropic helpers accept a session; with other providers, use `session.execute()`. Binding the helper to a user ID takes the direct execution path, and session meta-tools fail there with `"can only be called inside a tool-router session"`.
- Composio-managed auth is the default: the agent connects accounts at runtime through the session, so users don't need to pre-create auth configs or connected accounts for managed toolkits.
- Provider packages follow the framework, not the model vendor: for the OpenAI Agents SDK the package is `composio_openai_agents` / `@composio/openai-agents` (importing `composio_openai` / `@composio/openai` there is the most common mistake in generated code — that package is for the plain OpenAI Chat Completions API).
- **Direct execution** (`composio.tools.get()`, `composio.tools.execute()`, `provider.handle_tool_calls()` with a user ID) is a fully supported lower-level interface: your code picks the tool, no runtime discovery. It fits deterministic workflows and scripts; sessions fit agents that decide at runtime. The tradeoffs are documented at https://docs.composio.dev/docs/sessions-vs-direct-execution. Note that direct execution requires a toolkit version (https://docs.composio.dev/docs/tools-direct/toolkit-versioning).

---

# 3. Calling the REST API directly

## REST API version

The current REST API version is **v3.1**, served at `https://backend.composio.dev/api/v3.1`. Prefer it for new code and new examples.

`https://backend.composio.dev/api/v3` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.

## Tool-endpoint version defaults on v3.1

On v3.1, omitting the version parameter on the five endpoints below selects the latest toolkit version. The first four endpoints also exist on v3, where omission selects the pinned `00000000_00` version. `POST /tools/scopes/required` is v3.1-only.

| Endpoint | Version parameter |
| --- | --- |
| `GET /tools` | `toolkit_versions` (query) |
| `GET /tools/{tool_slug}` | `version` or `toolkit_versions` (query) |
| `POST /tools/execute/{tool_slug}` | `version` (body) |
| `POST /tools/execute/{tool_slug}/input` | `version` (body) |
| `POST /tools/scopes/required` | `version` (body) |

A v3.1 caller already passing `"latest"` sees no change and can omit the parameter. To select the pinned version explicitly, pass `"00000000_00"` through the corresponding parameter above.

This version-default change is limited to the five endpoints above.


---

## Terminology Migration (old → current)

If you encounter these terms in error messages, old documentation, or user prompts, translate them to the current equivalents. **Do not use the old terms in generated code or explanations.**

| Old term (v1/v2) | Current term (v3) | In code |
|---|---|---|
| entity ID | user ID | `user_id` parameter |
| actions | tools | e.g., `GITHUB_CREATE_ISSUE` is a *tool* |
| apps / appType | toolkits | e.g., `github` is a *toolkit* |
| integration / integration ID | auth config / auth config ID | `auth_config_id` parameter |
| connection | connected account | `connected_accounts` namespace |
| ComposioToolSet / OpenAIToolSet | `Composio` class with a provider | `Composio(provider=...)` |
| toolset | provider | e.g., `OpenAIProvider` |

If a user says "entity ID", they mean `user_id`. If they say "integration", they mean "auth config". Always respond using the current terminology.
