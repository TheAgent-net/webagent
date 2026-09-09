---
url: https://docs.composio.dev/reference/sdk-reference/python/session.md
title: https://docs.composio.dev/reference/sdk-reference/python/session.md
description: 
status: 200
---

\# Session (/reference/sdk-reference/python/session)

\## Properties \[#properties\]

\| Name \| Type \|
\| \-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`session\_id\` \| \`str\` \|
\| \`experimental\` \| \`'ToolRouterSessionExperimental'\` \|
\| \`preload\` \| \`Any\` \|

\## Methods \[#methods\]

\### tools() \[#tools\]

Get provider-wrapped tools for execution with your AI framework. Returns tools configured for this session, wrapped in the format expected by your AI provider (OpenAI, Anthropic, LangChain, etc.). When custom tools are bound to the session, execution of COMPOSIO\\\_MULTI\\\_EXECUTE\\\_TOOL is intercepted: local tools are executed in-process, remote tools are sent to the backend.

\`\`\`python
def tools(modifiers: 'Modifiers' \| None = ...) -> TToolCollection
\`\`\`

\*\*Parameters\*\*

\| Name \| Type \|
\| \-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`modifiers?\` \| \`'Modifiers' \\\| None\` \|

\*\*Returns\*\*

\`TToolCollection\`

\\*\\*\\*

\### authorize() \[#authorize\]

Authorize a toolkit for the user and get a connection request. Initiates the OAuth flow and returns a ConnectionRequest with redirect URL.

\`\`\`python
def authorize(toolkit: str, callback\_url: str \| None = ..., alias: str \| None = ..., experimental: session\_link\_params.Experimental \| None = ...) -> ConnectionRequest
\`\`\`

\*\*Parameters\*\*

\| Name \| Type \|
\| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`toolkit\` \| \`str\` \|
\| \`callback\_url?\` \| \`str \\\| None\` \|
\| \`alias?\` \| \`str \\\| None\` \|
\| \`experimental?\` \| \`session\_link\_params.Experimental \\\| None\` \|

\*\*Returns\*\*

\`ConnectionRequest\`

\\*\\*\\*

\### toolkits() \[#toolkits\]

Get toolkit connection states for the session.

\`\`\`python
def toolkits(toolkits: List\[str \| None\] = ..., next\_cursor: str \| None = ..., limit: int \| None = ..., is\_connected: bool \| None = ..., search: str \| None = ...) -> ToolkitConnectionsDetails
\`\`\`

\*\*Parameters\*\*

\| Name \| Type \|
\| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`toolkits?\` \| \`List\[str \\\| None\]\` \|
\| \`next\_cursor?\` \| \`str \\\| None\` \|
\| \`limit?\` \| \`int \\\| None\` \|
\| \`is\_connected?\` \| \`bool \\\| None\` \|
\| \`search?\` \| \`str \\\| None\` \|

\*\*Returns\*\*

\`ToolkitConnectionsDetails\`

\\*\\*\\*

\### search() \[#search\]

Search for tools by semantic use case. Returns relevant tools for the given query with schemas and guidance.

\`\`\`python
def search(query: str, model: str \| None = ...) -> SessionSearchResponse
\`\`\`

\*\*Parameters\*\*

\| Name \| Type \|
\| \-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`query\` \| \`str\` \|
\| \`model?\` \| \`str \\\| None\` \|

\*\*Returns\*\*

\`SessionSearchResponse\`

\\*\\*\\*

\### execute() \[#execute\]

Execute a tool within the session. For custom tools, accepts the full slug (e.g. "LOCAL\\\_GREP") or the original slug (e.g. "GREP") when that original slug is unique across the session's custom tools and toolkits. Custom tools are executed in-process; remote tools are sent to the Composio backend.

\`\`\`python
def execute(tool\_slug: str, arguments: Dict\[str, Any \| None\] = ..., account: str \| None = ...) -> SessionExecuteResponse
\`\`\`

\*\*Parameters\*\*

\| Name \| Type \|
\| \-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`tool\_slug\` \| \`str\` \|
\| \`arguments?\` \| \`Dict\[str, Any \\\| None\]\` \|
\| \`account?\` \| \`str \\\| None\` \|

\*\*Returns\*\*

\`SessionExecuteResponse\`

\\*\\*\\*

\### custom\\\_tools() \[#custom\_tools\]

List all custom tools registered in this session. Returns tools with their final slugs, schemas, and resolved toolkit.

\`\`\`python
def custom\_tools(toolkit: str \| None = ...) -> List\[RegisteredCustomTool\]
\`\`\`

\*\*Parameters\*\*

\| Name \| Type \|
\| \-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`toolkit?\` \| \`str \\\| None\` \|

\*\*Returns\*\*

\`List\[RegisteredCustomTool\]\` — Array of registered custom tools

\\*\\*\\*

\### custom\\\_toolkits() \[#custom\_toolkits\]

List all custom toolkits registered in this session. Returns toolkits with their tools showing final slugs.

\`\`\`python
def custom\_toolkits() -> List\[RegisteredCustomToolkit\]
\`\`\`

\*\*Returns\*\*

\`List\[RegisteredCustomToolkit\]\`

\\*\\*\\*

\### proxy\\\_execute() \[#proxy\_execute\]

Proxy an API call through Composio's auth layer.

\`\`\`python
def proxy\_execute(toolkit: str, endpoint: str, method: Literal\['GET', 'POST', 'PUT', 'DELETE', 'PATCH'\], body: Any = ..., parameters: List\[Dict\[str, Any \| None\]\] = ...) -> ToolRouterSessionProxyExecuteResponse
\`\`\`

\*\*Parameters\*\*

\| Name \| Type \|
\| \-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`toolkit\` \| \`str\` \|
\| \`endpoint\` \| \`str\` \|
\| \`method\` \| \`Literal\['GET', 'POST', 'PUT', 'DELETE', 'PATCH'\]\` \|
\| \`body?\` \| \`Any\` \|
\| \`parameters?\` \| \`List\[Dict\[str, Any \\\| None\]\]\` \|

\*\*Returns\*\*

\`ToolRouterSessionProxyExecuteResponse\` — Proxied API response

\\*\\*\\*

\### update() \[#update\]

Partially update the session configuration. Only the fields provided will be changed; omitted fields are preserved. Mutates this session's \`preload\` in-place. Pass \`None\` for \`manage\_connections\`, \`sandbox\`/\`workbench\`, or \`multi\_account\` to clear the stored value. \`workbench\` is a backwards-compatible alias for \`sandbox\`. Prefer \`sandbox\` in new code. All parameters use the same types as the Stainless-generated \`client.tool\_router.session.patch()\` method.

\`\`\`python
def update(toolkits: Union\[session\_patch\_params.Toolkits, 'Omit'\] = ..., tools: Union\[Dict\[str, session\_patch\_params.Tools\], 'Omit'\] = ..., tags: Union\[session\_patch\_params.Tags, 'Omit'\] = ..., auth\_configs: Union\[Dict\[str, str\], 'Omit'\] = ..., connected\_accounts: Union\[Dict\[str, SequenceNotStr\[str \| None\]\], 'Omit'\] = ..., manage\_connections: Union\[session\_patch\_params.ManageConnections \| None, 'Omit'\] = ..., sandbox: Union\[session\_patch\_params.Workbench \| None, 'Omit'\] = ..., workbench: Union\[session\_patch\_params.Workbench \| None, 'Omit'\] = ..., multi\_account: Union\[session\_patch\_params.MultiAccount \| None, 'Omit'\] = ..., preload: Union\[session\_patch\_params.Preload, 'Omit'\] = ...) -> None
\`\`\`

\*\*Parameters\*\*

\| Name \| Type \|
\| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`toolkits?\` \| \`Union\[session\_patch\_params.Toolkits, 'Omit'\]\` \|
\| \`tools?\` \| \`Union\[Dict\[str, session\_patch\_params.Tools\], 'Omit'\]\` \|
\| \`tags?\` \| \`Union\[session\_patch\_params.Tags, 'Omit'\]\` \|
\| \`auth\_configs?\` \| \`Union\[Dict\[str, str\], 'Omit'\]\` \|
\| \`connected\_accounts?\` \| \`Union\[Dict\[str, SequenceNotStr\[str \\\| None\]\], 'Omit'\]\` \|
\| \`manage\_connections?\` \| \`Union\[session\_patch\_params.ManageConnections \\\| None, 'Omit'\]\` \|
\| \`sandbox?\` \| \`Union\[session\_patch\_params.Workbench \\\| None, 'Omit'\]\` \|
\| \`workbench?\` \| \`Union\[session\_patch\_params.Workbench \\\| None, 'Omit'\]\` \|
\| \`multi\_account?\` \| \`Union\[session\_patch\_params.MultiAccount \\\| None, 'Omit'\]\` \|
\| \`preload?\` \| \`Union\[session\_patch\_params.Preload, 'Omit'\]\` \|

\\*\\*\\*

\### delete() \[#delete\]

Delete this session. Deleted sessions immediately stop being retrievable or executable. An already-deleted session surfaces the backend 404.

\`\`\`python
def delete() -> ToolRouterSessionDeleteResponse
\`\`\`

\*\*Returns\*\*

\`ToolRouterSessionDeleteResponse\`

\\*\\*\\*

\[View source\](https://github.com/composiohq/composio/blob/next/python/composio/core/models/tool\_router\_session.py#L90)

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
