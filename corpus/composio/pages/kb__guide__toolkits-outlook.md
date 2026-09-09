---
url: https://docs.composio.dev/kb/guide/toolkits-outlook
title: Outlook (/kb/guide/toolkits-outlook)
description: 
status: 200
---

# Outlook (/kb/guide/toolkits-outlook)

Use this guide to authorize Outlook, resolve Microsoft tenant consent, and target the correct mailbox or account through MCP and direct execution.

## Connect and authorize Outlook [#connect-and-authorize-outlook]

**Authenticate the cloud Microsoft account in a browser.** Outlook tools authenticate through the Microsoft account/OAuth flow in a browser. Even if you only use Outlook desktop, log into the underlying Microsoft/Outlook account in the browser to complete OAuth. Desktop and cloud use the same account, so once the account is authenticated, the tools can operate against that mailbox.

**Check exact tool scopes, then reconnect after changes.** For Outlook 403s, look up required scopes with `/api/v3/tools/get_scopes_required` using the exact Outlook tool slug, not the toolkit name. For example `OUTLOOK_GET_MAILBOX_SETTINGS` requires `MailboxSettings.ReadWrite`. After adding scopes to the auth config, create a new auth link session and have the user reconnect so the new scopes are granted.

**Complete auth links within about 10 minutes.** If a connected account expires because the initiation flow was not completed, the likely reason is that the authorization link timed out. Users have roughly a 10-minute window to complete the auth flow; otherwise Composio invalidates the link and marks the connected account `EXPIRED`.

## Grant Microsoft tenant admin consent [#grant-microsoft-tenant-admin-consent]

Microsoft/Outlook admin-consent issues are Microsoft 365 tenant-level approval problems, not a Composio-side connection configuration issue. Adding delegated permissions to an Azure app registration is not the same as granting tenant admin consent. Once a tenant admin grants consent for the requested permissions, affected users should start a fresh normal Outlook connection flow with their own accounts; the admin does not need to connect every user individually.

Two concrete ways an admin can approve:

1. **App Registration / OAuth app level:** in Microsoft Entra / Azure Portal, go to **App registrations**, open the OAuth app, go to **API permissions**, click &#x2A;*Grant admin consent for \[Tenant Name]**, then confirm/save.

2. **Enterprise Applications / org level:** in Microsoft Entra / Azure Portal, go to **Enterprise applications**, find the Composio/Outlook app or the customer's own service principal, open **Permissions** / admin-consent controls, then grant admin consent for the organization.

For the Composio-managed Outlook app, Microsoft's in-flow `sign in as an admin` / `Connectez-vous avec ce compte` link is also a real tenant-admin consent path. If the admin signs in through that same OAuth attempt, that attempt may connect the admin's mailbox, not the original user's mailbox; treat that connected account as the admin's and have the original user start a fresh Connect flow afterward. Incomplete/pending Outlook connection attempts expire after about 10 minutes, so an expired non-admin attempt cannot be resumed. Nothing needs to happen on Composio's side between the admin grant and the user's retry: no cache clear, webhook, or manual status change.

Composio does not publish a `client_id` for its managed Outlook app for use in direct Microsoft `adminconsent` URLs. Do not guess this value. For a customer-owned/BYOA Azure app, use your own app's `client_id` and tenant ID in Microsoft's admin-consent URL.

A customer-owned verified-publisher Azure app can improve branding/control and may reduce consent friction in tenants that allow user consent for verified publishers and the requested delegated permissions. It does not guarantee that no admin approval is needed: each Microsoft tenant's user-consent policy and the exact scopes requested still decide whether admin consent is required.

## Use Outlook through MCP and direct execution [#use-outlook-through-mcp-and-direct-execution]

**Expect Tool Router meta-tools on Connect MCP.** `connect.composio.dev/mcp` uses Tool Router architecture, so it intentionally exposes meta-tools such as `COMPOSIO_SEARCH_TOOLS` and `COMPOSIO_MULTI_EXECUTE_TOOL`. The agent discovers and executes Outlook tools at runtime through those meta-tools. If you need specific Outlook tools without meta-tool round trips, use SDK direct execution or create a focused MCP config with selected Outlook tools.

**Remove obsolete slugs from MCP configs.** If an Outlook MCP config fails due to obsolete or invalid tool slugs, update the MCP config to remove them and include only current supported tools in `allowed_tools`. This can be done through the dashboard or the MCP patch endpoint.

**Pass attachment file paths through the SDK.** When using SDK automatic file handling for email attachments, pass the local file path directly in the `attachment`/`attachments` argument. Do not pass only a filename or raw content fields unless the tool schema explicitly asks for them.

## Target shared mailboxes and multiple accounts [#target-shared-mailboxes-and-multiple-accounts]

**Pass the shared mailbox address as `user_id` or the mailbox target.** Delegated access must already be granted in the Microsoft tenant. This applies to delegated and S2S/application auth patterns where the tenant permissions allow shared mailbox access.

**Select an aliased account on every multi-account call.** For multi-account Outlook sessions, every connected account needs a unique non-null alias, the session should set `multi_account.enable=true` and `require_explicit_selection=true`, and the LLM must set the `account` field on each item in `COMPOSIO_MULTI_EXECUTE_TOOL.tools[]`. Without explicit selection, Tool Router cannot disambiguate and may default to one account.

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
