---
url: https://docs.composio.dev/kb/guide/toolkits-linkedin
title: LinkedIn (/kb/guide/toolkits-linkedin)
description: 
status: 200
---

# LinkedIn (/kb/guide/toolkits-linkedin)

## Fix LinkedIn 426 NONEXISTENT\_VERSION by using the latest toolkit version [#fix-linkedin-426-nonexistent_version-by-using-the-latest-toolkit-version]

LinkedIn 426 `NONEXISTENT_VERSION` errors usually mean the request is using an older LinkedIn API version header. In Composio, this often happens when calls run on the base toolkit version `00000000_00` or another older pinned version. Specify the latest LinkedIn toolkit version on tool calls, or pin to the current fixed version if needed. If the error persists after switching to the latest version, contact Composio support with a failed call `logId` or request ID so the actual `LinkedIn-Version` header can be verified.

## Fetch modern LinkedIn tools with `toolkit_slug=linkedin` and `toolkit_versions=latest` [#fetch-modern-linkedin-tools-with-toolkit_sluglinkedin-and-toolkit_versionslatest]

The v3 tools-list endpoint defaults to the base toolkit version when no toolkit version is specified, which can return only legacy LinkedIn slugs. Use the singular filter `toolkit_slug=linkedin`; plural or alternate filters such as `toolkit_slugs`, `toolkits`, `app`, or `app_names` may be ignored. Add `toolkit_versions=latest`. Example: `GET /api/v3/tools?toolkit_slug=linkedin&toolkit_versions=latest&limit=100`.

## LinkedIn organization scopes depend on the toolkit and auth config [#linkedin-organization-scopes-depend-on-the-toolkit-and-auth-config]

An active LinkedIn connection can run personal/profile actions while organization actions return 403. Check the actual toolkit and scopes stored on the auth config: the standard LinkedIn flow commonly uses personal scopes, while LinkedIn Ads can request organization and advertising scopes.

For organization ACLs, page statistics, or company-page posting, use an auth config that explicitly requests the required organization scopes and reconnect so LinkedIn issues a new grant. Reconnecting an unchanged config does not add scopes. Do not assume provider approval alone means those scopes were requested by the concrete connection.

## LinkedIn post creation supports image arrays through SDK/API [#linkedin-post-creation-supports-image-arrays-through-sdkapi]

`LINKEDIN_CREATE_LINKED_IN_POST` supports image + text posting, including multiple images when using SDKs or APIs directly. Pass an array of values to the `images` field. If image posting fails, first confirm you are using a recent toolkit version, then contact Composio support with log IDs from failed tool calls if needed.

## Use Connect MCP instead of legacy Platform MCP for consumer LinkedIn connector flows [#use-connect-mcp-instead-of-legacy-platform-mcp-for-consumer-linkedin-connector-flows]

For consumer/client connector flows, use `connect.composio.dev` / Connect MCP rather than the legacy Platform MCP endpoint. The API key does not belong in the URL; configure the `x-consumer-api-key` header shown by the current AI Clients setup. If LinkedIn MCP calls fail with 401 despite an active connection, confirm the endpoint and header type. If the error persists, contact Composio support with the exact error and log ID.

## Fix LinkedIn Ads `redirect_uri` mismatch before debugging scopes [#fix-linkedin-ads-redirect_uri-mismatch-before-debugging-scopes]

If LinkedIn rejects authorization with `The redirect_uri does not match the registered value`, register the exact callback shown by the current Composio auth-config flow in the customer's LinkedIn developer app. Do not guess between legacy v1, v3, and v3.1 callback paths; copy the callback from the current setup UI or auth-config documentation and match it exactly, without adding a trailing slash.

This error occurs before a successful callback and is separate from LinkedIn product or scope approval.

## LinkedIn Ads `unauthorized_scope_error` means a requested scope is unavailable [#linkedin-ads-unauthorized_scope_error-means-a-requested-scope-is-unavailable]

LinkedIn rejects the complete OAuth request when any requested scope is unavailable to the developer app. Compare the exact auth-config scope set with the products and scopes enabled on that same LinkedIn app.

The default LinkedIn Ads flow includes OpenID Connect scopes (`openid`, `profile`, `email`) as well as advertising and organization scopes. Legacy `r_basicprofile` is not a substitute for the OpenID Connect scopes. Enable the relevant LinkedIn products or narrow a custom auth config to scopes the app actually has, then reconnect.

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
