---
url: https://docs.composio.dev/kb/guide/mcp-tool-router-sessions.md
title: https://docs.composio.dev/kb/guide/mcp-tool-router-sessions.md
description: 
status: 200
---

\# Tool Router Sessions (/kb/guide/mcp-tool-router-sessions)

\## Create Tool Router sessions through the SDK or API \[#create-tool-router-sessions-through-the-sdk-or-api\]

There is no normal dashboard toggle required to enable Tool Router. Create a session through the SDK or the REST API.

\\* \[Quickstart\](https://docs.composio.dev/docs/quickstart)
\\* \[Configuring sessions\](https://docs.composio.dev/docs/configuring-sessions)
\\* \[Create a Tool Router session API\](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSession)

If you receive an actual 403 or an error saying Tool Router is not enabled for the account, do not keep repeating the setup steps. Contact Composio support for account-level checking and include the exact error body plus the request or code snippet.

\## Session lifetime and deletion \[#session-lifetime-and-deletion\]

Tool Router sessions are long-lived records and do not currently have a time-based expiration. This is separate from temporary workbench files, live sandbox retention, and short response-cache lifetimes.

Reuse an existing TypeScript session with \`composio.use(sessionId)\`. Delete a session either from the instance or by ID:

\`\`\`text
await session.delete();
await composio.sessions.delete(sessionId);
\`\`\`

Deletion takes effect immediately. A deleted, missing, or inaccessible session returns 404 when retrieved; deleting a session does not delete its users, auth configs, or connected accounts.

\## Select among multiple accounts with an alias or account ID \[#select-among-multiple-accounts-with-an-alias-or-account-id\]

When a toolkit has multiple connected accounts, assign clear aliases such as \`work\`, \`personal\`, or \`primary\`, then pass the alias as the execution \`account\`. Without an alias, use the generated account ID returned by connection discovery.

Do not rely on fuzzy phrases such as “office email” unless a matching alias exists. If explicit account selection is disabled and no \`account\` is supplied, the session can fall back to its first/default account.

\## The session user must match the connected-account user \[#the-session-user-must-match-the-connected-account-user\]

An account can be active in the dashboard but unavailable to Tool Router when the session uses a different \`user\_id\`. Private accounts resolve for their owning user; explicitly shared or pinned accounts follow the session configuration.

Create the session and connection with the same stable user ID. If a particular account must be used, pass its allowed connected-account override in the session configuration.

\## Connected-account selection is live unless pinned \[#connected-account-selection-is-live-unless-pinned\]

When \`connectedAccounts\` is omitted, Tool Router resolves currently active accounts for the session user at execution time, including accounts connected after session creation. When \`connectedAccounts\` is supplied, it is an exact toolkit override and Tool Router does not fall back to another active account for that toolkit.

Adding another account later does not change an explicit pin. Update or recreate the session when the pinned account should change; omit the override when you want live account discovery.

\## Toolkit allowlists are enforced before connection lookup \[#toolkit-allowlists-are-enforced-before-connection-lookup\]

When a session has a non-empty \`toolkits.enabled\` list, every other toolkit is blocked. A \`toolkits.disabled\` list does the inverse: listed toolkits are blocked while the rest remain eligible. This restriction is checked before auth configs and connected accounts.

If Tool Router reports \`\[Session Restriction\] Toolkit '' is not allowed\`, update or recreate the session's toolkit configuration first. Only then debug whether that toolkit has an auth config and connection.

\## A fresh task context is a new session runtime, not model memory \[#a-fresh-task-context-is-a-new-session-runtime-not-model-memory\]

Every \`create()\` call returns a new session ID. A session scopes the user,
toolkit and tool access, auth and account selection, and session runtime
resources such as sandbox files. It is not the model's conversation memory.

Reuse a stored session with \`composio.use(sessionId)\` when a conversation or
workflow should retain the same session configuration and runtime context.
Create a new session for a different user or materially different setup. A new
session for the same user can still resolve that user's eligible connected
accounts, but it does not inherit the old session's sandbox state.

\## Auth links create project- and user-scoped connected accounts \[#auth-links-create-project--and-user-scoped-connected-accounts\]

\`session.authorize()\` and \`COMPOSIO\_MANAGE\_CONNECTIONS\` create a Connect Link
for the session user and selected auth config. After authentication, the
connected account belongs to that project/user rather than only to the session
that produced the link. Later unpinned sessions for the same stable user can
resolve it; an explicit connected-account pin remains unchanged until the
session is updated or recreated.

\## Toolkit filters do not preload every matching tool \[#toolkit-filters-do-not-preload-every-matching-tool\]

By default, a session exposes meta tools that discover and load app tools at
runtime. Enabling a toolkit limits what the session can discover and execute;
it does not put every tool from that toolkit into the initial schema set.

Use an explicit \`preload.tools\` list when the agent must receive known tools
directly. Use the direct-tools preset or \`preload.tools = "all"\` only with a
narrow positive filter; broad preload sets are capped and increase agent
context.

\## SDK custom tools and Custom MCP toolkits have different runtimes \[#sdk-custom-tools-and-custom-mcp-toolkits-have-different-runtimes\]

An SDK-defined custom tool runs inside the customer's application process. Its
function body is not uploaded into Composio and is not automatically callable
from a remote session MCP URL or Remote Workbench.

To expose customer-owned functionality remotely, host it as an MCP server and
register it as a Custom MCP toolkit. The resulting remote tools remain subject
to the session's toolkit and connection restrictions.

\## Enhanced Control requires client support for MCP elicitation \[#enhanced-control-requires-client-support-for-mcp-elicitation\]

For You's Enhanced Control approval flow relies on MCP elicitation. It works
only with clients that advertise and implement that capability. If a client
does not support elicitation, use a supported client, set an applicable
\*\*Always Allow\*\* policy, or disable Enhanced Control under \*\*For You → Settings
→ General\*\* and reconnect the client.

\## Pin the intended auth config when a toolkit has multiple auth schemes \[#pin-the-intended-auth-config-when-a-toolkit-has-multiple-auth-schemes\]

Tool Router first uses the auth config explicitly mapped in the session. When
the toolkit supports multiple schemes, map the intended \`ac\_...\` ID rather than
depending on automatic selection. The selected config must belong to the same
project and be enabled for Tool Router. An explicit connected-account override
is an exact toolkit selection and does not fall back to another active account.

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
