---
url: https://docs.composio.dev/kb/guide/consumer-project-boundaries-and-auth-selection.md
title: https://docs.composio.dev/kb/guide/consumer-project-boundaries-and-auth-selection.md
description: 
status: 200
---

\# Consumer and Developer Project Boundaries (/kb/guide/consumer-project-boundaries-and-auth-selection)

Composio organizations have separate developer and consumer project surfaces. The developer dashboard/API shows developer projects. The consumer dashboard and consumer MCP / Composio MCP / Composio For You clients use a separate consumer project that customers usually do not see directly.

Developer-project auth configs and connected accounts are not available in the consumer project. Consumer-project connections are not available in the developer project. If you created an auth config or connected an account in the developer dashboard but cannot use it in Claude, ChatGPT, Codex, Cursor, Composio For You, or another consumer MCP client, connect the account through the consumer flow instead.

Consumer MCP auth has two common paths:

1\. Use the consumer MCP URL directly. If the MCP client supports auth, it can trigger the Composio auth flow, open a popup, let the customer authenticate, and let them select the organization.

2\. Use the consumer API key when the MCP client does not support auth and only supports API keys/headers. Copy the key from the consumer dashboard and pass it as the \`x-consumer-api-key\` header.

Under the hood, a consumer-scoped MCP session is created for the specific user and allowed tools.

The For You connection flow uses the auth config in the consumer project. Its current behavior is:

1\. When a Composio-managed auth app is available, the app uses that managed config and does not expose provider credentials for editing.

2\. When no managed app is available, \*\*Manage Auth\*\* appears for toolkits with editable customer-owned credentials or multiple auth schemes. Enter the provider client ID/secret or other required fields there and register the callback URI shown by the current form.

3\. Provider scopes are determined by the selected auth scheme and its current config. A managed app is limited to its approved scope set; customer-owned apps must configure and verify their scopes with the provider.

\## Rotate the Connect MCP consumer key \[#rotate-the-connect-mcp-consumer-key\]

These steps apply to a Connect consumer key with the \`ck\_\*\` prefix, sent as \`x-consumer-api-key\`. They do not apply to a Platform Project API key with the \`ak\_\*\` prefix. Reconnecting Gmail, Calendar, or another individual app does not rotate the consumer key.

1\. Open For You / Connect.
2\. Select \*\*Settings\*\* in the left sidebar.
3\. Open \*\*Sessions & API Key\*\*.
4\. Select \*\*Regenerate\*\* next to “Your API Key” and confirm.
5\. Update every MCP client that uses \`https://connect.composio.dev/mcp\` with the new \`x-consumer-api-key\` value.

Regeneration immediately invalidates the old consumer key. If the button is missing even though you are in the correct workspace with write access, or you need help investigating suspicious usage, contact Composio support for account-level assistance.

\## Workspace members do not automatically share For You connections \[#workspace-members-do-not-automatically-share-for-you-connections\]

In the normal For You/Connect MCP flow, connected accounts belong to the member who authorized them. Another teammate using their own Connect MCP endpoint or \`ck\_\*\` consumer key resolves to their own connected accounts, not yours.

\\* Admins can manage workspace settings and members, but their own Connect MCP session does not automatically use another member's accounts.
\\* Members can connect and use their own accounts.
\\* Viewers cannot connect or invoke tools from the For You surface.

Raw \`ak\_\*\` Project API keys are different from \`ck\_\*\` consumer keys and must be treated as privileged project secrets. Explicitly shared or pinned connections are also a separate configuration from ordinary member-scoped connections.

\## Shared connections must be explicitly allowed and pinned \[#shared-connections-must-be-explicitly-allowed-and-pinned\]

A normal \`PRIVATE\` connection belongs to the user who created it. A \`SHARED\`
connection can be used by other user IDs only when its ACL allows them and the
connection is explicitly pinned into the session by connected-account ID.
Shared connections are deny-by-default and are never selected implicitly.

Follow the \[Shared Connections guide\](https://docs.composio.dev/docs/shared-connections#shared-vs-private)
for the current ACL and session configuration.

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
