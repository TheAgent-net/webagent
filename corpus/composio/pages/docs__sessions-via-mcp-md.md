---
url: https://docs.composio.dev/docs/sessions-via-mcp.md
title: https://docs.composio.dev/docs/sessions-via-mcp.md
description: 
status: 200
---

\# Using sessions via MCP (/docs/sessions-via-mcp)

Use this guide when you are building an application with Composio and want to expose one user's session over MCP. The application creates and configures the session, then passes its hosted MCP endpoint to a compatible client.

By default, Composio gives your agent tools it can call directly through a \[provider package\](/docs/providers). That is what the \[Quickstart\](/docs/quickstart) uses. Set \`mcp: true\` when an MCP transport fits your application better. No provider package is required for this route.

\> \*\*Connecting an existing agent instead?\*\*: If you use Codex or Claude Code and did not explicitly choose MCP, install the native \[Composio agent plugin\](/docs/agent-plugins). If you explicitly want MCP in an existing client, use \[Composio Connect\](/docs/composio-connect).

\> Want to bring tools from your own remote MCP server into Composio instead? See \[Custom MCP\](/docs/extending-sessions/custom-mcp).

\## The MCP endpoint \[#the-mcp-endpoint\]

Opt into MCP by passing \`mcp: true\` when you create the session. The session then exposes its hosted MCP server. Read the URL and headers off \`session.mcp\`:

\*\*Python:\*\*

\`\`\`python
from composio import Composio

composio = Composio()
session = composio.sessions.create(user\_id="user\_123", mcp=True)

mcp\_url = session.mcp.url
mcp\_headers = session.mcp.headers
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from "@composio/core";

const composio = new Composio();
const session = await composio.create("user\_123", { mcp: true });

const mcpUrl = session.mcp.url;
const mcpHeaders = session.mcp.headers;
\`\`\`

You don't need a provider package to use the MCP endpoint, so you can drop it from your \`Composio()\` setup if MCP is all you need.

\> Resuming a stored session? Pass the same flag, \`composio.use(sessionId, { mcp: true })\` (TypeScript) or \`composio.use(session\_id, mcp=True)\` (Python), to surface \`session.mcp\` on the reused session.

\> The MCP endpoint and \`session.tools()\` are backed by the same session. Toolkits, auth configs, and connected accounts you set when \[configuring the session\](/docs/configuring-sessions) apply to both.

\## A single URL for a fixed set of tools \[#a-single-url-for-a-fixed-set-of-tools\]

Combine \`mcp: true\` with the \[direct-tools preset\](/docs/configuring-sessions) to get one MCP URL that serves exactly the tools you list, with no search or meta tools in front of them. This is the closest equivalent to a classic hosted MCP server scoped to a handful of tools.

\*\*Python:\*\*

\`\`\`python
from composio import Composio, SESSION\_PRESET\_DIRECT\_TOOLS

composio = Composio()

session = composio.sessions.create(
 user\_id="user\_123",
 toolkits=\["gmail"\],
 tools={"gmail": {"enable": \["GMAIL\_FETCH\_EMAILS", "GMAIL\_CREATE\_EMAIL\_DRAFT"\]}},
 session\_preset=SESSION\_PRESET\_DIRECT\_TOOLS,
 mcp=True,
)

\# A single MCP URL that exposes just these two tools
print(session.mcp.url)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio, SessionPreset } from "@composio/core";

const composio = new Composio();

const session = await composio.create("user\_123", {
 toolkits: \["gmail"\],
 tools: { gmail: { enable: \["GMAIL\_FETCH\_EMAILS", "GMAIL\_CREATE\_EMAIL\_DRAFT"\] } },
 sessionPreset: SessionPreset.DIRECT\_TOOLS,
 mcp: true,
});

// A single MCP URL that exposes just these two tools
console.log(session.mcp.url);
\`\`\`

Any MCP client pointed at that URL sees only \`GMAIL\_FETCH\_EMAILS\` and \`GMAIL\_CREATE\_EMAIL\_DRAFT\`. See \[Configuring Sessions\](/docs/configuring-sessions) for the full set of toolkit, tool, and auth filters.

\## Wire it into your framework \[#wire-it-into-your-framework\]

Pass \`session.mcp.url\` and \`session.mcp.headers\` to your framework's MCP client.

\*\*OpenAI Agents (Python):\*\*

\`\`\`python
from agents import Agent, HostedMCPTool

agent = Agent(
 name="Assistant",
 tools=\[\
 HostedMCPTool(\
 tool\_config={\
 "type": "mcp",\
 "server\_label": "composio",\
 "server\_url": session.mcp.url,\
 "headers": session.mcp.headers,\
 "require\_approval": "never",\
 }\
 )\
 \],
)
\`\`\`

\*\*Claude Agent SDK (Python):\*\*

\`\`\`python
from claude\_agent\_sdk import ClaudeAgentOptions

options = ClaudeAgentOptions(
 mcp\_servers={
 "composio": {
 "type": "http",
 "url": session.mcp.url,
 "headers": session.mcp.headers,
 }
 },
)
\`\`\`

\*\*Vercel AI SDK (TypeScript):\*\*

\`\`\`typescript
import { Composio } from "@composio/core";
import { createMCPClient } from "@ai-sdk/mcp";

const composio = new Composio();
const { mcp } = await composio.create("user\_123", { mcp: true });

const client = await createMCPClient({
 transport: {
 type: "http",
 url: mcp.url,
 headers: mcp.headers,
 },
});
const tools = await client.tools();
\`\`\`

\## Trade-offs \[#trade-offs\]

MCP is the more portable option. Any MCP-compatible client connects with just a URL, and it's supported across more frameworks and apps (Claude Desktop, Cursor, the OpenAI Responses API, and others) without a provider package.

The trade-off is that the MCP client talks to Composio's server directly, so anything the SDK does \*around\* tool execution doesn't apply:

\\* \*\*Tool-call modifiers don't run.\*\* \`beforeExecute\` / \`afterExecute\` hooks and \`modifySchema\` transforms live in the SDK's execution path. Over MCP the client executes tools against the server and bypasses them, so you can't intercept, reshape, log, or gate calls the way you can with tools your agent calls directly.
\\* \*\*Session-bound custom tools and toolkits don't work.\*\* Tools created with \`experimental\_createTool\` / \`experimental\_createToolkit\` in TypeScript, or \`composio.experimental.tool\` / \`composio.experimental.Toolkit\` in Python, run in your process. The MCP server only exposes Composio's hosted tools, so your local custom tools aren't available over the endpoint.

If you need any of those, call tools directly through a \[provider\](/docs/providers) instead of over MCP.

\## Next \[#next\]

\- \[Configuring Sessions\](/docs/configuring-sessions): Restrict toolkits, set custom auth configs, and select connected accounts

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
