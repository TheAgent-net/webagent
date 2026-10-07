---
url: https://docs.composio.dev/kb/guide/toolkits-googledocs
title: Google Docs (/kb/guide/toolkits-googledocs)
description: 
status: 200
---

# Google Docs (/kb/guide/toolkits-googledocs)

Use this guide to create and edit Google Docs content, configure Google OAuth, manage accounts and sessions, and connect through the correct Composio surface.

## Create and edit Google Docs content [#create-and-edit-google-docs-content]

**Create documents from Markdown or HTML tables.** `GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN` accepts GitHub-Flavored Markdown. Markdown tables should work, and HTML tables can also be passed in the markdown payload when a table shape is needed.

**Use the tab-aware tools for reading and editing.** Google Docs tab-level access is supported. For reading tabs, use `GOOGLEDOCS_GET_DOCUMENT_BY_ID` or `GOOGLEDOCS_GET_DOCUMENT_PLAINTEXT`. For editing specific tabs, use `GOOGLEDOCS_REPLACE_ALL_TEXT`, `GOOGLEDOCS_REPLACE_IMAGE`, or `GOOGLEDOCS_UPDATE_EXISTING_DOCUMENT`.

## Configure Google OAuth [#configure-google-oauth]

**Choose managed or customer-owned OAuth2.** Use Composio-managed OAuth for the standard connection flow. Create a custom auth config with your Google OAuth app when you need control over scopes, consent-screen branding, or Google Cloud project policy. A Composio Project API key authenticates SDK/API calls to Composio; it is not a replacement for the user's Google OAuth grant.

**Verify sensitive scopes for production use.** Google may block OAuth consent when an app requests unverified sensitive scopes. For production Google Docs or Workspace usage with sensitive scopes, use a verified OAuth app and complete the required Google verification or CASA process where applicable. Without verification, users may see warnings or app-blocked errors.

**Execute through Composio instead of reading provider tokens.** Provider tokens are redacted from connected-account API responses. Use Composio tool execution or Proxy Execute instead of reading access or refresh tokens from connected-account data.

## Manage accounts, sessions, and auth configs [#manage-accounts-sessions-and-auth-configs]

**Select explicitly when a user has multiple Google accounts.** Composio can keep multiple connected accounts for the same toolkit and user. Enable multi-account behavior for the session when needed, give each account a clear alias, and select the intended alias or connected-account ID during execution rather than relying on an implicit default.

**Keep Tool Router v2 accounts under the same user or entity.** Tool Router v2 sessions are scoped to a single `user_id`. Every connected account passed into that session must belong to the same entity, otherwise validation fails with `ToolRouterV2_InvalidConnectedAccountIds`. Reconnect the outlier Google account under the same `user_id` or create a separate session.

**Specify auth config IDs when creating the session.** When creating a Composio session, pass `auth_configs` keyed by toolkit slug, such as `gmail`, `googledrive`, or `googlecalendar`. If specified, Manage Connection uses those auth configs directly instead of picking a default config.

## Connect through Platform or Connect MCP [#connect-through-platform-or-connect-mcp]

**Connect the app separately on each surface.** Connections created on Platform (`dashboard.composio.dev`) are isolated from For You / Connect MCP and do not carry over. To use Google Docs, Sheets, or Workspace through Connect MCP, ask the MCP server to connect the app from the client flow and complete that OAuth flow.

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
