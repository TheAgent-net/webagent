---
url: https://docs.composio.dev/kb/guide/toolkits-salesforce
title: Salesforce (/kb/guide/toolkits-salesforce)
description: 
status: 200
---

# Salesforce (/kb/guide/toolkits-salesforce)

Use this guide to configure Salesforce OAuth and domains, troubleshoot connected-app access, choose current tools, and build UI bridge flows safely.

## Configure Salesforce OAuth and connection flows [#configure-salesforce-oauth-and-connection-flows]

**Use customer-owned credentials for app-level control.** The current Salesforce toolkit supports OAuth2 and server-to-server OAuth2 with
customer-owned credentials. Configure the Salesforce connected app according to
Salesforce's OAuth guidance and use its credentials in a custom Composio auth
config. This gives the customer control over scopes, branding, and provider-side
policy.

**Choose hosted auth or direct initiation based on who supplies required fields.** The Salesforce field collection interface is part of Hosted Authentication / the connection link flow. If you want Composio to collect required fields, use hosted auth. If your app already knows the Salesforce instance/subdomain values, skip that interface and call `.initiate()` directly with the required fields. Use `.refresh()` to regenerate the auth URL for an already initiated connection; `.link()` starts a new connection. If you truly need multiple connections for the same `user_id`, pass `allow_multiple=True` to `.initiate()`.

**Match the redirect URI to the current Composio callback.** Use the callback URL shown by the current Composio auth-config flow as the authorized redirect URI for custom Salesforce OAuth. This provider callback is separate from the post-auth customer redirect passed as `callback_url` / `callbackUrl` during connection initiation.

## Set the Salesforce domain and connection fields [#set-the-salesforce-domain-and-connection-fields]

**Provide the instance endpoint and My Domain subdomain.** Salesforce accepts additional connection initiation fields. Fetch the toolkit by slug (`/api/v3.1/toolkits/salesforce`) to inspect the expected fields, and fetch the connected account to see the same fields after connection. The important Salesforce fields are `My Domain Subdomain` and `Instance endpoint`. If you are initiating directly through the SDK/API, pass these fields through `.initiate()` rather than waiting for the hosted connection UI.

**Use the My Domain or API prefix when `login` is not enough.** For Salesforce, the default subdomain value is `login`, and that works in most cases. If the default or a simple org label fails, Composio needs the Salesforce login/API domain prefix rather than the full browser URL.

Use these formats:

* Default case: keep `login`.

* Standard My Domain URL: for `https://your-company.my.salesforce.com/...`, pass `your-company.my`.

* Developer Edition / Lightning URL: for `https://<org>.develop.lightning.force.com/...`, the matching OAuth/My Domain host is usually `https://<org>.develop.my.salesforce.com/...`, so pass `<org>.develop.my`.

If the customer enters only `<org>`, Composio may generate `<org>.salesforce.com`, which can fail before OAuth with a browser DNS error such as `DNS_PROBE_FINISHED_NXDOMAIN`.

**Recheck the domain when Salesforce returns `URL_NOT_RESET`.** `URL_NOT_RESET` can happen when the Salesforce org requires a specific My Domain value but the connection is using the generic `login` default or an incomplete subdomain. The default `login` value is fine for most Salesforce flows, but for org-specific failures recheck the Salesforce domain/subdomain values on the connection, pass the correct My Domain subdomain, and retry on the latest toolkit version if the issue was seen on an older pinned version.

## Troubleshoot connected-app access and token policies [#troubleshoot-connected-app-access-and-token-policies]

**Ask an org admin to install or approve restricted connected apps.** Salesforce connected app usage restrictions can require an org admin to install or approve the connected app before org users can authenticate. Check whether the error URL includes `error=invalid_client&error_description=app+must+be+installed+into+org`. In Salesforce Setup, go to OAuth Connected App Usage and look for the app with an Install button in the Actions column. After the admin installs/enables the app, users should retry authentication.

**Account for Salesforce's five active refresh-token limit.** Salesforce allows only five active refresh tokens per user per connected app. When the same Salesforce user connects a sixth time, Salesforce can revoke the oldest refresh token, which makes older Composio connected accounts fail with token errors. Also check whether the user changed their password, revoked the app, changed connected app refresh-token policy away from `valid until revoked`, or has org-level session policies that invalidate tokens.

## Discover and use current Salesforce tools [#discover-and-use-current-salesforce-tools]

**Inspect object schemas before querying or updating them.** Use `SALESFORCE_GET_ALL_FIELDS_FOR_OBJECT` when you need to inspect the fields available on a Salesforce object. This is the right tool for schema discovery before building object-specific queries or update flows.

**Replace deprecated retrieve actions with current get and list tools.** Use the current Salesforce tool slugs instead of the deprecated retrieve variants: `SALESFORCE_RETRIEVE_LEAD_BY_ID` -> `SALESFORCE_GET_LEAD`, `SALESFORCE_RETRIEVE_SPECIFIC_CONTACT_BY_ID` -> `SALESFORCE_GET_CONTACT_BY_ID`, and `SALESFORCE_RETRIEVE_OPPORTUNITIES_DATA` -> `SALESFORCE_LIST_OPPORTUNITIES`.

**List contacts before fetching a specific contact by ID.** Use `SALESFORCE_LIST_CONTACTS` to list contacts and capture the IDs with their names. Then call `SALESFORCE_GET_CONTACT_BY_ID` with the desired contact ID to fetch the specific contact details.

## Use Proxy Execute for Salesforce UI bridge flows [#use-proxy-execute-for-salesforce-ui-bridge-flows]

Do not build Salesforce Frontdoor/UI bridge flows by reading access tokens from the connected account API. Use Proxy Execute with the Salesforce connected account instead. Composio injects the OAuth access token server-side into the proxied Salesforce request, such as a call to `/services/oauth2/singleaccess`, and Salesforce returns the frontdoor URI that the application can redirect the user's browser to.

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
