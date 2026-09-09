---
url: https://docs.composio.dev/kb/guide/toolkits-supabase
title: Supabase (/kb/guide/toolkits-supabase)
description: 
status: 200
---

# Supabase (/kb/guide/toolkits-supabase)

Use this guide to connect Supabase, configure its tools and endpoints, and troubleshoot permissions or rate limits.

## Connect Supabase with OAuth or an API key [#connect-supabase-with-oauth-or-an-api-key]

**Confirm the authorized Supabase organization.** Supabase authorization is usually scoped at the organization level. If you have project or account access issues, confirm which Supabase organization/account the connected credentials belong to before treating it as a tool-specific issue.

**Pass the personal token with the required API-key field.** For Supabase API-key auth, create or use an API-key auth config and pass the personal token as `supabase_personal_token` when creating the connected account. The `/api/v3/toolkits/supabase` endpoint can be used to inspect the required connected-account initiation field name.

**Choose either OAuth2 or API\_KEY auth.** Supabase supports OAuth2 and API\_KEY auth, and both can be initiated through Composio APIs. SDKs are wrappers over the same APIs, so anything possible through the SDK should be possible through the API.

**Initiate the connection explicitly in Cursor.** Ask Cursor/the MCP client to initiate a Supabase connection first. The MCP server should provide an OAuth link, the user completes authentication, and then Supabase tools can execute against the connected account.

## Configure Supabase tools and endpoints [#configure-supabase-tools-and-endpoints]

**Add the SQL tool to the MCP server when needed.** `SUPABASE_BETA_RUN_SQL_QUERY` is still supported. Create a Supabase integration/MCP server and explicitly configure the Supabase SQL tool in that MCP server if it is not shown on the simplified Supabase MCP page.

**Use the hosted API base URL for hosted Supabase.** For hosted Supabase, the base URL should be `https://api.supabase.com`. Do not use the project's own Supabase URL unless the customer is self-hosting Supabase. If the wrong base URL was used, delete/recreate the MCP config or connection with the correct base URL.

**Pass a supported custom base URL for self-hosted Supabase.** Supabase tools default to hosted Supabase at `https://api.supabase.com`, while current toolkit versions can accept a base URL for self-hosted instances. If a self-hosted setup fails, verify the toolkit version and that the custom base URL is passed in the supported field.

**Configure Management API scopes on the OAuth app.** Supabase configures Management API OAuth scopes on the OAuth app rather than in
the authorization URL. Set the desired scopes in the customer's Supabase OAuth
app, create the corresponding Composio auth config, and reconnect so the new
grant applies. See Supabase's current [OAuth scope documentation](https://supabase.com/docs/guides/integrations/build-a-supabase-oauth-integration/oauth-scopes).

## Troubleshoot Supabase permissions and rate limits [#troubleshoot-supabase-permissions-and-rate-limits]

**Verify provider-side access for permission errors.** If Supabase returns a permissions/access-control error, verify the connected Supabase account has the required permissions in Supabase. These can be provider-side server permission errors rather than Composio issues.

**Inspect the underlying error for rate limits.** If the customer sees a rate-limit message, capture the underlying Composio/tool/provider error rather than the wrapper agent's message, because the limit may come from the external provider or agent layer rather than a Composio service limit.

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
