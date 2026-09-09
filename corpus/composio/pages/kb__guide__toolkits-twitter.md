---
url: https://docs.composio.dev/kb/guide/toolkits-twitter
title: Twitter (/kb/guide/toolkits-twitter)
description: 
status: 200
---

# Twitter (/kb/guide/toolkits-twitter)

Use this guide to configure Twitter/X authentication, choose the credentials each action needs, and troubleshoot developer-app or toolkit-version errors.

## Configure Twitter/X authentication [#configure-twitterx-authentication]

**Use a customer-owned OAuth app.** Composio-managed credentials are not available for the Twitter toolkit. Create an app in the X Developer Portal, then create a custom Composio auth config with that app's credentials before connecting an account. This has been required since managed Twitter credentials were removed in February 2026.

* [Twitter toolkit authentication details](https://docs.composio.dev/toolkits/twitter)
* [Managed Twitter credentials removal](https://docs.composio.dev/docs/changelog/2026/02/12)

**Match the current Composio callback exactly.** For Twitter OAuth callback mismatch errors, configure the Twitter/X developer app with the exact callback shown by the current Composio auth-config flow. Do not use a legacy v1 callback from older examples.

## Publish and search with the correct credentials [#publish-and-search-with-the-correct-credentials]

**Follow X's post-length rules.** Twitter/X enforces strict post length limits. For normal posts, keep the content under 280 characters and follow X's official character-counting behavior, since URLs, Unicode, and special characters may be counted by provider-specific rules.

**Use the Application Bearer Token for app-only actions.** Several X actions—including recent or full-archive search and counts, post lookup by IDs, post usage, label-stream, and compliance-job actions—use app-only authentication. They read the `Application Bearer Token` from the Twitter auth config, not the connected user's OAuth access token.

If user-token actions succeed but these actions return 401, verify that the bearer token comes from the same X Developer App as the OAuth client credentials and that the app's X API plan allows the endpoint. Adding user OAuth scopes does not repair an invalid app bearer token. Reconnect only when the user grant also needs to change.

## Troubleshoot developer-app and toolkit-version errors [#troubleshoot-developer-app-and-toolkit-version-errors]

**Fix `client-not-enrolled` and `App not linked to project` in the X developer app.** These errors usually mean the Twitter/X developer app is not correctly connected to a Twitter developer project, or the OAuth app configuration is stale after X's API model changes. Verify the app is linked to a project, configured according to the Twitter setup guide, and aligned with current X API requirements. If the connected account is already `EXPIRED`, recreate the connection after fixing the app configuration.

**Update older toolkit versions for X v2 support.** The current Twitter/X toolkit uses v2 endpoints. If behavior looks like an older endpoint, check the toolkit version and retry on the latest available version.

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
