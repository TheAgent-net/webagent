---
url: https://docs.composio.dev/docs/triggers.md
title: https://docs.composio.dev/docs/triggers.md
description: 
status: 200
---

# Triggers (/docs/triggers)

When something happens in a connected app (a new Slack message, a GitHub commit, an incoming email), a **trigger** sends that event to your app as a structured payload. You write the handler. Composio handles the connection to the provider, delivery, retries, and signing.

## Where events arrive [#where-events-arrive]

Composio delivers every event to one destination you control: your webhook URL. You register it once per project, and Composio `POST`s every trigger event there, signed so you can verify it.

## Realtime vs polling [#realtime-vs-polling]

Under the hood, Composio learns about events in one of two ways. You don't configure this. It's a property of the trigger type, and it only affects how quickly an event reaches you.

| Kind         | How Composio learns about the event                              | Latency                                 | Examples                      |
| ------------ | ---------------------------------------------------------------- | --------------------------------------- | ----------------------------- |
| **Realtime** | The provider pushes the event to Composio the moment it happens. | Near-instant                            | Slack, Asana, Notion, Outlook |
| **Polling**  | Composio checks the provider on a schedule.                      | Up to \~15 min on Composio-managed auth | Gmail, Google Calendar        |

Either way, the event lands in the same place: your subscription or webhook URL, in the same payload shape.

> If you **bring your own OAuth app**, some providers only deliver to URLs registered on that app, so you register Composio's ingress URL there once. See [Custom OAuth webhooks](/docs/setting-up-triggers/custom-oauth-webhooks).

## Trigger types and instances [#trigger-types-and-instances]

A **trigger type** is a kind of event you can listen for, like `GITHUB_COMMIT_EVENT` or a new Slack message. Each toolkit has its own set.

A **trigger instance** is a trigger type you've activated for one [user's connected account](/docs/how-composio-works). It has its own `ti_*` ID that you can enable, disable, or delete independently.

## Working with triggers [#working-with-triggers]

0. **Authenticate** the user for the toolkit: an [auth config](/docs/authentication#behind-the-scenes) and a [connected account](/docs/authentication). See [Authentication](/docs/authentication).
1. **Create** a trigger for the user's connected account. See [Creating triggers](/docs/setting-up-triggers/creating-triggers).
2. **Receive** its events: locally with `subscribe()`, or in production at your webhook URL. See [Receiving events](/docs/setting-up-triggers/subscribing-to-events).
3. **Manage** triggers: enable, disable, or delete. See [Managing triggers](/docs/setting-up-triggers/managing-triggers).

## Next [#next]

- [Creating triggers](/docs/setting-up-triggers/creating-triggers): Activate a trigger for a user so events start flowing

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
