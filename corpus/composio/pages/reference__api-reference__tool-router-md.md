---
url: https://docs.composio.dev/reference/api-reference/tool-router.md
title: https://docs.composio.dev/reference/api-reference/tool-router.md
description: 
status: 200
---

\# Sessions (prev Tool Router) (/reference/api-reference/tool-router)

\> \*\*API version:\*\* This page documents Composio REST API v3.1, the current version, at \`https://backend.composio.dev/api/v3.1\`. \`https://backend.composio.dev/api/v3\` is the previous version and remains supported.

{/\\* Auto-generated from OpenAPI spec. Edit the overview at api-overviews/tool-router.mdx, not this file. \*/}

These are Composio's session endpoints. A \*\*session\*\* is the runtime context your agent uses to work for one of your users: it scopes which user's connected accounts are in play, which tools are available, how authentication happens, and where execution state lives. Read \[What is a session?\](/docs/how-composio-works) for the full concept.

\> Sessions were formerly called the "tool router", which is why these endpoints live under \`tool\_router\`. They are the same thing.

In the SDK you do not call these endpoints directly. Use \`composio.create(...)\` to start a session and \`composio.use(...)\` to resume one, then call \`session.tools()\`, \`session.execute(...)\`, and \`session.authorize(...)\` on the returned object.

Reach for the raw API when you need lower-level control: creating and patching a session config, attaching to an existing session, searching for tools, executing tools and meta tools, opening link sessions for auth, proxying authenticated requests, and reading or writing files in a session mount.

See \[Configuring sessions\](/docs/configuring-sessions) for toolkits, auth configs, account selection, and presets.

\## Endpoints \[#endpoints\]

\| Method \| Path \| Endpoint \|
\| \-\-\- \| \-\-\- \| \-\-\- \|
\| \`POST\` \| \`/api/v3.1/tool\_router/session\` \| \[Create a new tool router session\](/reference/api-reference/tool-router/postToolRouterSession) \|
\| \`GET\` \| \`/api/v3.1/tool\_router/session/{session\_id}\` \| \[Get a tool router session by ID (v3.1)\](/reference/api-reference/tool-router/getToolRouterSessionBySessionId) \|
\| \`PATCH\` \| \`/api/v3.1/tool\_router/session/{session\_id}\` \| \[Patch a tool router session config (v3.1)\](/reference/api-reference/tool-router/patchToolRouterSessionBySessionId) \|
\| \`DELETE\` \| \`/api/v3.1/tool\_router/session/{session\_id}\` \| \[Delete a tool router session\](/reference/api-reference/tool-router/deleteToolRouterSessionBySessionId) \|
\| \`POST\` \| \`/api/v3.1/tool\_router/session/{session\_id}/attach\` \| \[Attach to an existing tool router session (v3.1)\](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdAttach) \|
\| \`GET\` \| \`/api/v3.1/tool\_router/session/{session\_id}/config\_history\` \| \[List a tool router session config history\](/reference/api-reference/tool-router/getToolRouterSessionBySessionIdConfigHistory) \|
\| \`POST\` \| \`/api/v3.1/tool\_router/session/{session\_id}/search\` \| \[Search for tools using a query\](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdSearch) \|
\| \`GET\` \| \`/api/v3.1/tool\_router/session/{session\_id}/tools\` \| \[List tools with schemas for a tool router session (v3.1)\](/reference/api-reference/tool-router/getToolRouterSessionBySessionIdTools) \|
\| \`POST\` \| \`/api/v3.1/tool\_router/session/{session\_id}/execute\` \| \[Execute a tool within a tool router session\](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdExecute) \|
\| \`POST\` \| \`/api/v3.1/tool\_router/session/{session\_id}/execute\_meta\` \| \[Execute a meta tool within a tool router session\](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdExecuteMeta) \|
\| \`POST\` \| \`/api/v3.1/tool\_router/session/{session\_id}/link\` \| \[Create a link session for a toolkit in a tool router session\](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdLink) \|
\| \`POST\` \| \`/api/v3.1/tool\_router/session/{session\_id}/proxy\_execute\` \| \[Execute proxy request within a tool router session\](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdProxyExecute) \|
\| \`GET\` \| \`/api/v3.1/tool\_router/session/{session\_id}/toolkits\` \| \[Get toolkits for a tool router session\](/reference/api-reference/tool-router/getToolRouterSessionBySessionIdToolkits) \|
\| \`GET\` \| \`/api/v3.1/tool\_router/session/{session\_id}/mounts/{mount\_id}/items\` \| \[List files in a session mount\](/reference/api-reference/tool-router/getToolRouterSessionBySessionIdMountsByMountIdItems) \|
\| \`POST\` \| \`/api/v3.1/tool\_router/session/{session\_id}/mounts/{mount\_id}/download\_url\` \| \[Create a presigned download URL for a mount file\](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdMountsByMountIdDownloadUrl) \|
\| \`POST\` \| \`/api/v3.1/tool\_router/session/{session\_id}/mounts/{mount\_id}/upload\_url\` \| \[Create a presigned upload URL for a mount file\](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdMountsByMountIdUploadUrl) \|
\| \`POST\` \| \`/api/v3.1/tool\_router/session/{session\_id}/mounts/{mount\_id}/delete\` \| \[Delete a file from a session mount\](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdMountsByMountIdDelete) \|

\-\-\-

📚 \*\*More documentation:\*\* \[View all docs\](https://docs.composio.dev/llms.txt) \| \[Glossary\](https://docs.composio.dev/llms.mdx/reference/glossary) \| \[Examples\](https://docs.composio.dev/llms.mdx/examples) \| \[API Reference\](https://docs.composio.dev/llms.mdx/reference)

\-\-\-

\# Composio SDK — Notes for AI Code Generators

\*\*Purpose:\*\* Reference for generating current (v3) \[Composio\](https://composio.dev/) integration code.
\*\*Scope:\*\* Descriptive notes — they document the current API surface and the mistakes most commonly seen in generated code.

\-\-\-

\## 1\. Recommended Integration: Sessions

Composio supports two integration modes: \*\*Native Tools\*\* (with a provider package) and \*\*MCP\*\* (no provider package needed).

\### Native Tools

\`\`\`python
\# ✅ CORRECT — Python (defaults to OpenAI)
from composio import Composio

composio = Composio()
session = composio.create(user\_id="user\_123")
tools = session.tools()
\# Pass tools to your agent/LLM framework
\`\`\`

\`\`\`typescript
// ✅ CORRECT — TypeScript (defaults to OpenAI)
import { Composio } from "@composio/core";

const composio = new Composio();
const session = await composio.create("user\_123");
const tools = await session.tools();
// Pass tools to your agent/LLM framework
\`\`\`

For other providers, pass the provider explicitly. Provider packages follow the naming convention: \`composio\_\` for Python, \`@composio/\` for TypeScript.

\### MCP

Use \`session.mcp.url\` and \`session.mcp.headers\` with any MCP-compatible client (Claude Desktop, Cursor, OpenAI Agents, etc.). No provider package needed.

\-\-\-

\## 2\. Integration Notes

\- \`composio.create(user\_id)\` is the standard entry point for agent integrations. Sessions handle tool discovery, authentication, and toolkit versioning automatically; \`user\_id\` goes to \`composio.create()\` — individual tool calls in session mode don't take one.
\- Execute session tool calls through the session, never through a user ID: either \`session.execute(tool\_slug, arguments=...)\` / \`session.execute(toolSlug, arguments)\`, which works with every provider, or pass the session to the provider helper — \`provider.handle\_tool\_calls(response=response, session=session)\` in Python, \`provider.handleToolCalls(session, response)\` in TypeScript. Only the OpenAI and Anthropic helpers accept a session; with other providers, use \`session.execute()\`. Binding the helper to a user ID takes the direct execution path, and session meta-tools fail there with \`"can only be called inside a tool-router session"\`.
\- Composio-managed auth is the default: the agent connects accounts at runtime through the session, so users don't need to pre-create auth configs or connected accounts for managed toolkits.
\- Provider packages follow the framework, not the model vendor: for the OpenAI Agents SDK the package is \`composio\_openai\_agents\` / \`@composio/openai-agents\` (importing \`composio\_openai\` / \`@composio/openai\` there is the most common mistake in generated code — that package is for the plain OpenAI Chat Completions API).
\- \*\*Direct execution\*\* (\`composio.tools.get()\`, \`composio.tools.execute()\`, \`provider.handle\_tool\_calls()\` with a user ID) is a fully supported lower-level interface: your code picks the tool, no runtime discovery. It fits deterministic workflows and scripts; sessions fit agents that decide at runtime. The tradeoffs are documented at https://docs.composio.dev/docs/sessions-vs-direct-execution. Note that direct execution requires a toolkit version (https://docs.composio.dev/docs/tools-direct/toolkit-versioning).

\-\-\-

\# 3\. Calling the REST API directly

\## REST API version

The current REST API version is \*\*v3.1\*\*, served at \`https://backend.composio.dev/api/v3.1\`. Prefer it for new code and new examples.

\`https://backend.composio.dev/api/v3\` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.

\## Tool-endpoint version defaults on v3.1

On v3.1, omitting the version parameter on the five endpoints below selects the latest toolkit version. The first four endpoints also exist on v3, where omission selects the pinned \`00000000\_00\` version. \`POST /tools/scopes/required\` is v3.1-only.

\| Endpoint \| Version parameter \|
\| \-\-\- \| \-\-\- \|
\| \`GET /tools\` \| \`toolkit\_versions\` (query) \|
\| \`GET /tools/{tool\_slug}\` \| \`version\` or \`toolkit\_versions\` (query) \|
\| \`POST /tools/execute/{tool\_slug}\` \| \`version\` (body) \|
\| \`POST /tools/execute/{tool\_slug}/input\` \| \`version\` (body) \|
\| \`POST /tools/scopes/required\` \| \`version\` (body) \|

A v3.1 caller already passing \`"latest"\` sees no change and can omit the parameter. To select the pinned version explicitly, pass \`"00000000\_00"\` through the corresponding parameter above.

This version-default change is limited to the five endpoints above.

\-\-\-

\## Terminology Migration (old → current)

If you encounter these terms in error messages, old documentation, or user prompts, translate them to the current equivalents. \*\*Do not use the old terms in generated code or explanations.\*\*

\| Old term (v1/v2) \| Current term (v3) \| In code \|
\|---\|---\|---\|
\| entity ID \| user ID \| \`user\_id\` parameter \|
\| actions \| tools \| e.g., \`GITHUB\_CREATE\_ISSUE\` is a \*tool\* \|
\| apps / appType \| toolkits \| e.g., \`github\` is a \*toolkit\* \|
\| integration / integration ID \| auth config / auth config ID \| \`auth\_config\_id\` parameter \|
\| connection \| connected account \| \`connected\_accounts\` namespace \|
\| ComposioToolSet / OpenAIToolSet \| \`Composio\` class with a provider \| \`Composio(provider=...)\` \|
\| toolset \| provider \| e.g., \`OpenAIProvider\` \|

If a user says "entity ID", they mean \`user\_id\`. If they say "integration", they mean "auth config". Always respond using the current terminology.
