---
url: https://docs.composio.dev/kb/guide/toolkits-googlesheets
title: Google Sheets (/kb/guide/toolkits-googlesheets)
description: 
status: 200
---

# Google Sheets (/kb/guide/toolkits-googlesheets)

Use this guide to connect Google Sheets, discover and run the current tools, and configure Google authentication and quotas.

## Connect Google Sheets and discover tools [#connect-google-sheets-and-discover-tools]

**Connect separately through Platform and Connect MCP.** Connections made on the Platform side (`dashboard.composio.dev`) are isolated from the For You / `connect.composio.dev/mcp` flow. A Google Sheets connection created on Platform will not automatically appear in Connect MCP. To use Sheets through Connect MCP, ask the MCP server from the client to connect Google Sheets, complete the surfaced auth link, then retry discovery/execution.

**Increase the tool-list limit when needed.** `get_raw_composio_tools` returns 20 tools by default. Pass a larger `limit` to fetch the full Google Sheets tool set, for example `.get_raw_composio_tools(toolkits=["GOOGLESHEETS"], limit=1000)`.

**Use the spreadsheet ID for MCP operations.** The Google Sheets MCP flow does not search through spreadsheets by name. Provide the spreadsheet ID directly in the chat/tool call when asking for operations such as getting sheet names.

## Update and populate spreadsheets [#update-and-populate-spreadsheets]

**Choose the current values tool for the operation.** Use `GOOGLESHEETS_VALUES_UPDATE` for one range, `GOOGLESHEETS_UPDATE_VALUES_BATCH` for multiple ranges, or `GOOGLESHEETS_SPREADSHEETS_VALUES_APPEND` to append rows. To create and populate a new spreadsheet, call `GOOGLESHEETS_CREATE_GOOGLE_SHEET1` and then one of the current values-update actions. `GOOGLESHEETS_BATCH_UPDATE` and `GOOGLESHEETS_SHEET_FROM_JSON` are deprecated.

**Execute tools with the exact current slug.** When executing Google Sheets tools, pass the exact current slug directly as the tool identifier, for example `composio.tools.execute("GOOGLESHEETS_GET_SHEET_NAMES", executePayload)`. If a wrapper parameter like `params.toolIdentifier` is used, verify it resolves to the exact tool slug. The older `GOOGLESHEETS_LIST_TABLES` action is deprecated.

## Configure Google authentication, versions, and quotas [#configure-google-authentication-versions-and-quotas]

**Update old placeholder toolkit versions.** If Google Sheets actions fail with permission errors and logs show the base version `00000000_00`, switch to the latest Google Sheets toolkit version and check the toolkit versioning documentation.

**Use Google Super for one shared Google connection.** For the canonical guidance on using one connection across Google Workspace services, see [Google Super is a unified Google Workspace toolkit](/kb/guide/toolkits-googlesuper).

**Enter complete Google OAuth scope URLs.** When configuring Google scopes manually, use the full scope URL. For Drive access, use `https://www.googleapis.com/auth/drive` rather than shorthand values like `/drive`.

**Treat Google provider quotas separately from Composio plan limits.** A Google Sheets 429 can come from Google's API quotas even when the Composio
account has remaining tool calls. Google currently documents 300 read requests
and 300 write requests per minute per project, plus 60 reads and 60 writes per
minute per user per project. Apply exponential backoff and check
[Google's current Sheets API limits](https://developers.google.com/workspace/sheets/api/limits)
before relying on those numbers.

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
