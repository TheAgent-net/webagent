---
url: https://docs.composio.dev/kb/guide/toolkits-googledrive
title: Google Drive (/kb/guide/toolkits-googledrive)
description: 
status: 200
---

# Google Drive (/kb/guide/toolkits-googledrive)

Use this guide to upload and download Google Drive files, choose an execution path, configure OAuth and webhooks, and troubleshoot account or session issues.

## Upload and download Google Drive files [#upload-and-download-google-drive-files]

**Pass local paths or URLs through SDK auto file handling.** For tools that support file-upload parameters such as `s3key`, `mimetype`, and `name`, the SDK can rewrite those parameters automatically. The caller can pass a local file path or URL string, and the SDK reads the file, uploads it to Composio-managed storage, and constructs the provider payload before executing the tool. For `GOOGLEDRIVE_UPLOAD_FILE`, passing `file_to_upload: "/path/to/file.pdf"` is the intended SDK pattern when auto file handling is enabled.

**Plan for temporary download URLs and storage.** Downloaded files are staged in temporary S3-backed storage and exposed through presigned URLs. The default presigned URL TTL is 1 hour, and that URL expiration can be customized in Project Settings -> File TTL. The staged files themselves are short lived and are deleted from Composio storage after about 24 hours / one day.

**Disable auto file handling when raw output is required.** If the SDK is converting downloaded file output into a local path and the application needs the raw URL or file payload, disable automatic file handling for the execution path. Use the documented `auto_upload_download_files=False` / disabling-auto-file-handling option, and make sure the relevant Composio SDK packages are upgraded to a version that supports that behavior.

## Choose MCP or direct execution [#choose-mcp-or-direct-execution]

**Discover less common Connect MCP tools with meta-tools.** Connect MCP exposes a curated direct tool set so the assistant does not load hundreds or thousands of tools into context. Less common or higher-risk Google Drive actions, including `GOOGLEDRIVE_GOOGLE_DRIVE_DELETE_FOLDER_OR_FILE_ACTION`, should be discovered at runtime with `COMPOSIO_SEARCH_TOOLS` and executed with `COMPOSIO_MULTI_EXECUTE_TOOL`.

**Prefer direct execution for a deterministic file-browser UI.** Using Composio MCP for a Google Drive file browser is feasible, but MCP servers are designed primarily for AI assistant integrations. For a product UI or deterministic file browser, prefer Direct Tool Execution through the Composio SDK or APIs so the application controls the tool calls, arguments, and rendering flow directly.

## Configure Google OAuth, scopes, and webhooks [#configure-google-oauth-scopes-and-webhooks]

**Use a public endpoint for watch and change webhooks.** Google Drive webhook payloads need to be delivered to a public domain or publicly reachable endpoint. A private-domain listener is not sufficient for Composio's server to send the webhook payload.

**Use customer-owned OAuth credentials with verified scopes.** Google can block the OAuth flow when the OAuth app is not verified for the requested sensitive or restricted scope. Configure and verify the required scope on the customer's Google Cloud OAuth app, then use those credentials in the Composio auth config. Also verify that the auth config requests only the intended scopes.

**Choose the narrowest scope that supports the workflow.** The `drive.file` scope allows access to files the app creates or that the user
explicitly grants to it. A workflow that needs broader full-drive access may
require the `drive` scope on the customer's Google OAuth app. Configure and
verify only the scopes the product actually needs.

## Troubleshoot account, toolkit, and session execution [#troubleshoot-account-toolkit-and-session-execution]

**Check for an invalid toolkit version when a tool is missing.** If a Google Drive tool appears missing, check whether the request is pinned to a toolkit version that exists. Passing an invalid version such as a non-existent dated version can make tools unavailable. Retry with a valid Google Drive toolkit version, or use the latest version when a pinned version is not required.

**Confirm the connected identity with `GOOGLEDRIVE_GET_ABOUT`.** Run `GOOGLEDRIVE_GET_ABOUT` for the connected account ID to confirm the email address and identity of the Google Drive account being used. This is the quickest check when actions appear to affect a different Drive account than expected.

**Include an `arguments` object in execution requests.** When calling tool execution APIs such as `GOOGLEDRIVE_FIND_FILE`, include the `arguments` object in the request body. If the tool does not need arguments for that call, send an empty object such as `"arguments": {}` along with the connected account, user/entity ID, and version fields.

**Keep every Tool Router v2 account under the same entity.** Tool Router v2 sessions are scoped to a single entity/user ID. Every connected account included in a session must belong to that same entity, otherwise validation can fail with `ToolRouterV2_InvalidConnectedAccountIds`. Reconnect Google Drive under the same user/entity as the Gmail and Calendar accounts before combining them in one session. If needed, specify auth config IDs while creating the session so Manage Connection uses the intended auth config for each toolkit.

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
