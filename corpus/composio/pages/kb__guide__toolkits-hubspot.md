---
url: https://docs.composio.dev/kb/guide/toolkits-hubspot
title: HubSpot (/kb/guide/toolkits-hubspot)
description: 
status: 200
---

# HubSpot (/kb/guide/toolkits-hubspot)

Use this guide to configure HubSpot authentication, troubleshoot OAuth connections, call HubSpot APIs, and set up triggers.

## Configure HubSpot OAuth scopes and branding [#configure-hubspot-oauth-scopes-and-branding]

**Choose the required contact scopes.** For HubSpot CRM contacts, the minimum scopes are `crm.objects.contacts.read` and `crm.objects.contacts.write`. Sensitive contact fields require the corresponding sensitive scopes such as `crm.objects.contacts.sensitive.read` and `.write`.

**Map tools to scopes before configuring the app.** Use HubSpot's own scopes documentation and Composio's scopes/tools API to map actions to required scopes. This is better than guessing scopes manually.

**Keep the HubSpot app and Composio auth config aligned.** HubSpot requires scopes to be declared in the app configuration before OAuth. The scope set on the Composio auth config should match the HubSpot app settings; HubSpot will not dynamically adjust scopes at connection time.

**Use customer-owned credentials for white-label OAuth.** Use your own HubSpot OAuth app credentials/custom auth config. That gives control over branding/consent and avoids relying on the Composio managed app for the customer-facing OAuth screen.

## Troubleshoot HubSpot OAuth connections [#troubleshoot-hubspot-oauth-connections]

**For a 400 during token exchange, check the client secret first.** Several reported customer-owned HubSpot OAuth failures were resolved by copying the correct current client secret from the HubSpot app and updating the Composio custom auth config to match. If the secret was rotated or copied from the wrong HubSpot app, HubSpot can fail token exchange with a 400.

Then check scope alignment. HubSpot is strict about required scopes:

* Required scopes configured on the HubSpot app must be present in the OAuth request/install URL `scope` parameter for successful installation.
* If the Composio auth config requests required scopes that do not match the customer-owned HubSpot app's configured required scopes, authorization/token exchange can fail.
* Optional scopes should be requested through HubSpot's `optional_scope` parameter. If the selected HubSpot account/user cannot grant an optional scope, HubSpot can omit it and the resulting token will not include that scope. Do not assume optional scopes were granted; inspect token/granted scopes before relying on optional capabilities.

For Composio-managed HubSpot auth configs, do not change the default scope set. If you need a different required/optional scope configuration, use your own HubSpot OAuth app through a custom Composio auth config.

**For an authorization loop, verify HubSpot's workspace and login state.** If the HubSpot flow loops while Composio works on its side, retry while logged into the correct HubSpot workspace and confirm the OAuth app is public/configured correctly.

**To disconnect HubSpot, delete the connected account.** Deleting the connected account disconnects the HubSpot account from Composio and stops refreshing that access token.

## Use HubSpot APIs and current toolkit versions [#use-hubspot-apis-and-current-toolkit-versions]

**Create custom HubSpot tools through authenticated API requests.** You can create a custom tool that sends authenticated requests to HubSpot API endpoints; Composio handles authentication for the connected account. Alternatively, call the provider directly with connection config/custom headers if needed.

**Handle marketing objects separately from CRM properties.** For HubSpot marketing objects such as campaigns, HubSpot does not expose a properties API in the same way it does for CRM objects. You may need to inspect or configure these from the HubSpot portal.

**Upgrade old HubSpot SDK and toolkit versions.** Older versions used slugs like `HUBSPOT_HUBSPOT_LIST_CONTACTS`; newer versions use slugs like `HUBSPOT_LIST_CONTACTS`. Update the SDK and explicitly use the latest HubSpot toolkit version.

## Configure HubSpot triggers for each customer app [#configure-hubspot-triggers-for-each-customer-app]

HubSpot webhook APIs need the specific HubSpot app that should receive webhook notifications. Get the app ID from HubSpot's webhook app documentation or developer app settings and use it when configuring triggers.

For triggers that use a customer-owned HubSpot app, `app_id` and developer API key are required because each app receives its own webhook delivery.

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
