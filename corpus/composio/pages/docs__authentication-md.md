---
url: https://docs.composio.dev/docs/authentication.md
title: https://docs.composio.dev/docs/authentication.md
description: 
status: 200
---

# Authentication (/docs/authentication)

Composio organizes everything around your **users**. A user is whoever your agent acts on behalf of: a person in your app, identified by a [`userID`](/docs/how-composio-works) you choose. Authentication is always per user. Each user connects their own accounts, their Gmail, their GitHub, their Slack, and Composio stores and refreshes those credentials against that `userID`.

This is the core idea: your agent runs the same tools for many people, and every tool call runs as a specific user against that user's connected accounts. User A's agent never touches user B's data. You pass the `userID` when you create a session, and Composio handles the auth from there.

Because connections are stored under the `userID`, use a stable identifier, like your database ID, never one that can change.

**userID best practices**

    * **Recommended:** database UUID or primary key (`user.id`)
    * **Acceptable:** unique username (`user.username`)
    * **Avoid:** email addresses (they can change)
    * **Never:** `default` in production (it exposes other users' data)

Your users connect their accounts through a secure [Connect Link](/reference/api-reference/connected-accounts/postConnectedAccountsLink), and Composio manages their tokens for you.

## How Composio handles authentication [#how-composio-handles-authentication]

Every session includes the [`COMPOSIO_MANAGE_CONNECTIONS`](/toolkits/meta-tools/manage_connections) meta tool. When a tool needs an account, it reads the toolkit's **auth config** (how that toolkit authenticates: method, scopes, credentials), creates a connection, and returns a secure [Connect Link](/reference/api-reference/connected-accounts/postConnectedAccountsLink). This works for all Composio managed connections, so you don't have to set up any OAuth credentials yourself.

The user signs in on the hosted link and Composio stores the resulting connected account. Credentials never pass through your app or the model, so it's safe to surface the link right in the chat.

You only need a [custom auth config](/docs/authentication/custom-app-vs-managed-app) to bring your own OAuth app, request specific scopes, or use a toolkit without managed auth.

## In-chat authentication [#in-chat-authentication]

You can also call `COMPOSIO_MANAGE_CONNECTIONS` yourself, intercept the Connect Link, and surface it wherever you need: DM it to the user, render it in your own UI, or email it. See [redirect auth links](/examples/general-agent-with-pi#redirect-auth-links) for a worked example.

### Custom callback URL [#custom-callback-url]

To send users back to your app after they connect, pass a `callback_url`:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    manage_connections={"callback_url": "https://yourapp.com/chat"},
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  manageConnections: { callbackUrl: "https://yourapp.com/chat" },
});
```

## Manually triggering authentication [#manually-triggering-authentication]

Don't want to wait for the agent? Call `session.authorize()` to generate a Connect Link on demand, for onboarding, a settings page, or a pre-flight check before a task.

- [Manual auth management](/docs/authentication/manually-authenticating): Generate Connect Links yourself, check connection status, and disable in-chat prompts.

- [Multiple connected accounts](/docs/authentication/managing-multiple-connected-accounts): Let one user choose between work, personal, or other accounts.

- [Shared connections](/docs/extending-sessions/shared-connections): Share one connected account with a controlled set of users.

- [Import existing connections](/docs/authentication/importing-existing-connections): Bring credentials your application already stores into Composio.

- [Managed vs custom auth](/docs/authentication/custom-app-vs-managed-app): Decide whether to use Composio credentials or your own OAuth app.

- [Programmatic auth configs](/docs/authentication/programmatic-auth-configs): Create auth configs in code and attach them to sessions.

- [Control OAuth scopes](/docs/authentication/controlling-scopes): Choose the permissions requested when a user connects.

- [White-label authentication](/docs/authentication/white-labeling-authentication): Use your own OAuth app and remove Composio branding.

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
