---
url: https://docs.composio.dev/kb/guide/toolkits-slack
title: Slack (/kb/guide/toolkits-slack)
description: 
status: 200
---

# Slack (/kb/guide/toolkits-slack)

## Use `user_scopes` for Slack user-token permissions [#use-user_scopes-for-slack-user-token-permissions]

For the Slack toolkit, `scopes` refers to bot-user scopes. If the use case is to operate as the actual Slack user, pass the permissions in `user_scopes` on the auth config credentials. Slack is special because it separates bot scopes from user scopes. For user-token tools, set `credentials.user_scopes`; the bot `scopes` field may not matter if the Slack application has no bot-user tools for that use case.

## Download Slack file content using file ID [#download-slack-file-content-using-file-id]

Slack file download is supported through `SLACK_DOWNLOAD_SLACK_FILE`. Pass the Slack file ID, which starts with `F` such as `F123ABCDEF0`. The tool returns downloadable file content plus metadata such as name, mimetype, and size. If the file ID is unknown, first call `SLACK_LIST_FILES_WITH_FILTERS_IN_SLACK` to find file IDs, then pass the selected ID to the download tool.

## Slack `assistant.search.context` requires Agents & AI Apps and Business+ [#slack-assistantsearchcontext-requires-agents--ai-apps-and-business]

Slack's `assistant.search.context` requires the Slack OAuth app to have the Agents & AI Apps feature enabled, and the Slack workspace must be on Business+ or higher. Verify workspace support by calling `assistant.search.info`; if `is_ai_search_enabled` is `false`, the workspace plan or feature enablement is the blocker. A customer can unblock with their own Slack OAuth app that has Agents & AI Apps enabled, but they still need Business+ on the workspace.

## Use Slack V2 trigger slugs for channel and direct messages [#use-slack-v2-trigger-slugs-for-channel-and-direct-messages]

Use the Slack V2 triggers for message events. `SLACK_CHANNEL_MESSAGE_RECEIVED` is intended for channel messages, and `SLACK_DIRECT_MESSAGE_RECEIVED` is intended for DMs. Slack V2 triggers include dedicated endpoints, signature verification, better DM handling, and richer filtering. Older V1 Slack trigger slugs may still work, but V2 is the recommended path for new setups.

## Slack trigger delivery depends on the Slack app event subscription webhook URL [#slack-trigger-delivery-depends-on-the-slack-app-event-subscription-webhook-url]

When Slack trigger events stop unexpectedly, check whether the Slack OAuth app's Event Subscriptions `webhook_url` was changed. If the webhook URL or other Slack app event-subscription settings changed, Slack may stop delivering events to Composio even though the trigger instance was previously working.

## Slack short connect links are not the OAuth redirect URI [#slack-short-connect-links-are-not-the-oauth-redirect-uri]

The short `/api/v3/s/...` URL is not the `redirect_uri` sent to Slack. It is only a shortened link that redirects the browser to Slack's authorization page. The actual Redirect URI is available in the authConfig and must match what is configured in the Slack OAuth app. The static `callbackUrl` / `redirectUri` must be configured consistently on both Composio and the Slack OAuth app, while `redirectUrl` is the per-connection authentication URL used to send the user through the auth flow.

## Slack scheduled-message attachments are not file uploads [#slack-scheduled-message-attachments-are-not-file-uploads]

The `attachments` field on Slack scheduled messages refers to Slack's legacy secondary/rich-formatting attachments, not uploaded files. Slack's `chat.scheduleMessage` API does not natively upload files. Files must be uploaded separately, for example with `files.upload` / `files.upload.v2`, and then linked or embedded into the scheduled message body so they unfurl when the scheduled message is posted.

## `admin.conversations:write` requires Slack Enterprise [#adminconversationswrite-requires-slack-enterprise]

`admin.conversations:write` is an enterprise/admin-level Slack scope. For APIs such as `admin.conversations.delete`, the Slack workspace must be on an Enterprise plan. If you cannot use channel deletion/admin conversation tools, first confirm the Slack workspace plan and whether the app has the required admin scope.

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
