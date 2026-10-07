---
url: https://docs.composio.dev/reference/api-reference/mcp.md
title: https://docs.composio.dev/reference/api-reference/mcp.md
description: 
status: 200
---

\# MCP (/reference/api-reference/mcp)

\> \*\*API version:\*\* This page documents Composio REST API v3.1, the current version, at \`https://backend.composio.dev/api/v3.1\`. \`https://backend.composio.dev/api/v3\` is the previous version and remains supported.

{/\\* Auto-generated from OpenAPI spec. Edit the overview at api-overviews/mcp.mdx, not this file. \*/}

\> This API is deprecated. Use a session's MCP endpoint instead. Create a session with \`composio.create(userId, { mcp: true })\`, then read the hosted URL off \`session.mcp.url\`. See \[Using sessions via MCP\](/docs/sessions-via-mcp) and \[migrating MCP servers to sessions\](/docs/migration-guide/mcp-servers-to-sessions).

The MCP API is the standalone, hosted \[Model Context Protocol\](https://modelcontextprotocol.io) server-management surface. It let you stand up and manage a separate server config per toolkit, then mint a per-user MCP URL that any MCP-compatible client could connect to.

These endpoints create, list, update, and delete MCP servers, including custom servers spanning multiple apps, generate per-user MCP URLs, and manage per-user server instances and their connected accounts.

Sessions replace this. A single \`composio.create(...)\` gives you the same MCP URL pattern, keyed by \`user\_id\`, while handling tool discovery, authentication, context, and versioning for you. Your existing tools, auth configs (\`ac\_…\`), and connected accounts carry over with no re-authentication. To pin a session to a fixed tool list the way a server did, use the direct-tools preset described in \[Configuring sessions\](/docs/configuring-sessions).

\## Endpoints \[#endpoints\]

\| Method \| Path \| Endpoint \|
\| \-\-\- \| \-\-\- \| \-\-\- \|
\| \`GET\` \| \`/api/v3.1/mcp/servers\` \| \[List MCP servers with optional filters and pagination (Legacy)\](/reference/api-reference/mcp/getMcpServers) \|
\| \`POST\` \| \`/api/v3.1/mcp/servers\` \| \[Create a new MCP server (Legacy)\](/reference/api-reference/mcp/postMcpServers) \|
\| \`POST\` \| \`/api/v3.1/mcp/servers/custom\` \| \[Create a new custom MCP server with multiple apps (Legacy)\](/reference/api-reference/mcp/postMcpServersCustom) \|
\| \`POST\` \| \`/api/v3.1/mcp/servers/generate\` \| \[Generate MCP URL with custom parameters (Legacy)\](/reference/api-reference/mcp/postMcpServersGenerate) \|
\| \`GET\` \| \`/api/v3.1/mcp/{id}\` \| \[Get MCP server details by ID (Legacy)\](/reference/api-reference/mcp/getMcpById) \|
\| \`PATCH\` \| \`/api/v3.1/mcp/{id}\` \| \[Update MCP server configuration (Legacy)\](/reference/api-reference/mcp/patchMcpById) \|
\| \`DELETE\` \| \`/api/v3.1/mcp/{id}\` \| \[Delete an MCP server (Legacy)\](/reference/api-reference/mcp/deleteMcpById) \|
\| \`GET\` \| \`/api/v3.1/mcp/app/{appKey}\` \| \[List MCP servers for a specific app (Legacy)\](/reference/api-reference/mcp/getMcpAppByAppKey) \|
\| \`GET\` \| \`/api/v3.1/mcp/servers/{serverId}/instances\` \| \[List all instances for an MCP server (Legacy)\](/reference/api-reference/mcp/getMcpServersByServerIdInstances) \|
\| \`POST\` \| \`/api/v3.1/mcp/servers/{serverId}/instances\` \| \[Create a new MCP server instance (Legacy)\](/reference/api-reference/mcp/postMcpServersByServerIdInstances) \|
\| \`DELETE\` \| \`/api/v3.1/mcp/servers/{serverId}/instances/{instanceId}\` \| \[Delete an MCP server instance and associated connected accounts (Legacy)\](/reference/api-reference/mcp/deleteMcpServersByServerIdInstancesByInstanceId) \|

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
