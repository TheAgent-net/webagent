---
url: https://docs.composio.dev/kb/guide/toolkits-googlemeet
title: Google Meet (/kb/guide/toolkits-googlemeet)
description: 
status: 200
---

# Google Meet (/kb/guide/toolkits-googlemeet)

## Use Google Super tool slugs with a Google Super connected account [#use-google-super-tool-slugs-with-a-google-super-connected-account]

Google Super is a separate toolkit with its own tool slugs. If the connected account was created for Google Super, run the corresponding GOOGLESUPER\_\* tool, such as GOOGLESUPER\_CREATE\_MEET, instead of the GOOGLEMEET\_\* slug. A separate Google Meet auth config or connected account is not required when the workflow is intentionally using Google Super.

## Configure Meet scopes and enable the Google Meet API before creating Meet spaces [#configure-meet-scopes-and-enable-the-google-meet-api-before-creating-meet-spaces]

For Meet space creation/settings through Google Super, include the Meet scopes `https://www.googleapis.com/auth/meetings.space.created` and `https://www.googleapis.com/auth/meetings.space.settings` in the auth config, then initiate a new connection so the new scopes are granted. Also enable the Google Meet API in the Google Cloud Console project backing the OAuth app.

## Fetch transcript entries by first resolving the conference record [#fetch-transcript-entries-by-first-resolving-the-conference-record]

Start with `GOOGLEMEET_LIST_CONFERENCE_RECORDS`. It can filter conference records by meeting code, space name, or time range. Use the resulting conference record ID with `GOOGLEMEET_GET_TRANSCRIPTS_BY_CONFERENCE_RECORD_ID`, then call `GOOGLEMEET_LIST_TRANSCRIPT_ENTRIES` with the transcript resource to retrieve the spoken segments.

## 403 permission errors usually mean the conference resource is inaccessible or missing [#403-permission-errors-usually-mean-the-conference-resource-is-inaccessible-or-missing]

For a Google Meet API error like "Permission denied on resource Conference (or it might not exist)", verify that the signed-in connected account has access to the conference/artifact and that the conference record exists. Compare the provider response through a least-privileged Composio tool or Proxy Execute call; provider tokens are redacted from connected-account responses and should not be copied into a support workflow.

## Recordings and transcripts require an eligible Google Workspace edition and enabled feature [#recordings-and-transcripts-require-an-eligible-google-workspace-edition-and-enabled-feature]

Google Meet recordings and transcripts are available on several eligible Google
Workspace editions, not only Enterprise. The meeting host must have the feature,
the organization's administrator must allow it, and recording or transcription
must have been started for the meeting. Free personal accounts do not provide
the same artifact availability.

Check Google's current [Meet feature matrix](https://support.google.com/meet/answer/10459644)
and [transcript requirements](https://support.google.com/meet/answer/12849897)
when diagnosing a missing recording or transcript.

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
