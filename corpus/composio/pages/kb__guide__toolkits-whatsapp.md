---
url: https://docs.composio.dev/kb/guide/toolkits-whatsapp
title: WhatsApp (/kb/guide/toolkits-whatsapp)
description: 
status: 200
---

# WhatsApp (/kb/guide/toolkits-whatsapp)

Use this guide to connect a WhatsApp Business account, configure Meta authentication, send messages, receive events, and handle coexistence onboarding.

## Connect a WhatsApp Business account [#connect-a-whatsapp-business-account]

**Use a WABA-backed business account instead of a personal account.** WhatsApp API usage requires a WhatsApp Business Account. Personal WhatsApp accounts are for personal communication and are not supported by the WhatsApp Business API flows used by the toolkit. To send WhatsApp messages through Composio, use a WABA-backed business account.

**Provide the WhatsApp Business Account ID.** The WABA ID, or WhatsApp Business Account ID, is required because the WhatsApp Business API needs it to identify the business account. Customers can find it in Meta Developers under the app's WhatsApp API Setup section, or fetch it programmatically by calling `GET /me/businesses` and then `GET /{business_id}/owned_whatsapp_business_accounts` with an access token.

**Pass the system user token and WABA ID for API-key auth.** For WhatsApp API key auth, pass the system user token as the bearer token and pass the WABA ID as `generic_id`. The required connection fields depend on the auth scheme, so fetch the toolkit/auth-config initiation fields if unsure. Hosted auth links can also collect these values from the user instead of hardcoding them.

**Pass the WABA ID as `generic_id` for OAuth2.** WhatsApp OAuth2 auth still requires `generic_id`, and that value is the WhatsApp Business Account ID. API key auth requires both `bearer_token` and `generic_id`, while OAuth2 only requires `generic_id` for initiation. Differences in required initiation fields usually come from the selected auth scheme.

## Configure Meta OAuth and app access [#configure-meta-oauth-and-app-access]

**Publish a Meta developer app with the Business use case.** For WhatsApp OAuth with a customer-owned Meta app, create a Meta developer app, enable the Business use case, configure the WhatsApp product, and publish the app so users can connect to it. The Meta app/account used during connection should match the account that owns or can access the WhatsApp Business setup.

**Add the Composio redirect URI to the Meta app.** For Meta OAuth apps, add the Composio redirect URI to the correct redirect/callback URI field in the Meta developer app. OAuth failures during callback can happen when the app does not allow the redirect URI used by the Composio auth config.

## Send WhatsApp messages and templates [#send-whatsapp-messages-and-templates]

**Create and approve a template before sending it.** Sending a WhatsApp template message requires a template to already exist in WhatsApp/Meta. The send-template tool sends an existing template by name/language and parameters; it does not remove the need to create and approve the template first.

**Use a current toolkit version for template `components`.** Support for `components` was added to the WhatsApp send-template flow in a newer toolkit version. If you cannot pass template variables/components to `WHATSAPP_SEND_TEMPLATE_MESSAGE`, upgrade to the latest WhatsApp toolkit version and verify the `components` field is available in the tool schema.

**Pass real sender and recipient identifiers.** For WhatsApp send-message actions, make sure the action arguments contain the actual `phone_number_id` and recipient `to_number`. Placeholder values in the tool arguments will fail even if the connected account itself is active.

## Receive events and extend WhatsApp workflows [#receive-events-and-extend-whatsapp-workflows]

**Use triggers or webhooks for replies.** WhatsApp does not expose every reply-reading flow as a normal API action in the toolkit. The better product shape is a trigger/webhook for events such as message or reply received. Where a first-party WhatsApp trigger is not available for the exact use case, TimelinesAI may be an alternative because it includes WhatsApp-related trigger support.

**Use Proxy Execute for direct provider operations.** For provider API operations that are not exposed as first-class WhatsApp tools, Proxy Execute can be used with a scoped Composio API key that allows proxy execution. Use this when you need to call a Meta/WhatsApp endpoint directly while still going through Composio-managed connection context.

## Set up WhatsApp Business app coexistence [#set-up-whatsapp-business-app-coexistence]

Keeping an existing WhatsApp Business app number active while also using the Cloud API is a Meta-side coexistence onboarding flow, not a Composio activation toggle. Follow Meta's [Onboard WhatsApp Business app users](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users) flow through a Solution Partner or Tech Provider that supports it.

After the number is active on Cloud API, connect its WABA in Composio through the normal WhatsApp setup. For API-key auth, use the system user token as `bearer_token` and the WABA ID as `generic_id`.

If the number is shown as `ON_PREMISE`, it may need Meta's On-Premises API to Cloud API migration steps before normal registration or coexistence. Route that onboarding/migration step to Meta or the customer's BSP, then help with the Composio connection once Cloud API is active.

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
