---
url: https://docs.composio.dev/docs/configuring-sessions.md
title: https://docs.composio.dev/docs/configuring-sessions.md
description: 
status: 200
---

\# Configuring Sessions (/docs/configuring-sessions)

\## Creating a session \[#creating-a-session\]

\*\*Python:\*\*

\`\`\`python
session = composio.sessions.create(user\_id="user\_123")
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123");
\`\`\`

By default, a session has access to every toolkit in the Composio catalog. Your agent can discover and use any of them through \`COMPOSIO\_SEARCH\_TOOLS\`. Use the options below to restrict or customize what's available.

You can also attach local custom tools and custom toolkits that run in-process alongside Composio tools. See \[Custom tools and toolkits\](/docs/extending-sessions/custom-tools-and-toolkits).

\## Enabling toolkits \[#enabling-toolkits\]

To limit a session to specific toolkits, pass an array of toolkit slugs. The agent can only discover and use tools from these toolkits.

\*\*Python:\*\*

\`\`\`python
\# Using array format
session = composio.sessions.create(
 user\_id="user\_123",
 toolkits=\["github", "gmail", "slack"\]
)

\# Using object format with enable key
session = composio.sessions.create(
 user\_id="user\_123",
 toolkits={"enable": \["github", "gmail", "slack"\]}
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
// Using array format
const session = await composio.create("user\_123", {
 toolkits: \["github", "gmail", "slack"\],
});

// Using object format with enable key
const session2 = await composio.create("user\_123", {
 toolkits: { enable: \["github", "gmail", "slack"\] },
});
\`\`\`

\## Disabling toolkits \[#disabling-toolkits\]

To keep every toolkit discoverable except a few, use the \`disable\` syntax. This is useful when you want broad access but need to exclude specific toolkits.

\*\*Python:\*\*

\`\`\`python
session = composio.sessions.create(
 user\_id="user\_123",
 toolkits={"disable": \["exa", "firecrawl"\]}
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123", {
 toolkits: { disable: \["exa", "firecrawl"\] },
});
\`\`\`

\## Direct tools preset \[#direct-tools-preset\]

The direct tools preset preloads every tool allowed by session filters into the session's tool list and disables session meta tools by default. Use it for specialized agents with a narrow tool set that don't need dynamic tool discovery, in-chat auth, or workbench helpers.

This is not the default mode for broad agents. The default session behavior keeps meta tools available so the agent can search for relevant tools and avoid context bloat.

\*\*Python:\*\*

\`\`\`python
from composio import Composio, SESSION\_PRESET\_DIRECT\_TOOLS
from composio\_openai\_agents import OpenAIAgentsProvider

composio = Composio(
 api\_key="your\_api\_key",
 provider=OpenAIAgentsProvider(),
)

session = composio.sessions.create(
 user\_id="user\_123",
 toolkits=\["gmail"\],
 tools={
 "gmail": {
 "enable": \[\
 "GMAIL\_FETCH\_EMAILS",\
 "GMAIL\_CREATE\_EMAIL\_DRAFT",\
 \],
 },
 },
 session\_preset=SESSION\_PRESET\_DIRECT\_TOOLS,
)

tools = session.tools()
print(\[tool.name for tool in tools\])
\# GMAIL\_FETCH\_EMAILS
\# GMAIL\_CREATE\_EMAIL\_DRAFT
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio, SessionPreset } from '@composio/core';
import { OpenAIAgentsProvider } from '@composio/openai-agents';

const composio = new Composio({
 apiKey: 'your\_api\_key',
 provider: new OpenAIAgentsProvider(),
});
const session = await composio.create("user\_123", {
 toolkits: \["gmail"\],
 tools: {
 gmail: {
 enable: \["GMAIL\_FETCH\_EMAILS", "GMAIL\_CREATE\_EMAIL\_DRAFT"\],
 },
 },
 sessionPreset: SessionPreset.DIRECT\_TOOLS,
});

const tools = await session.tools();
console.log(tools.map((tool) => tool.name));
// GMAIL\_FETCH\_EMAILS
// GMAIL\_CREATE\_EMAIL\_DRAFT
\`\`\`

\### Enable selected meta tools \[#enable-selected-meta-tools\]

With the direct tools preset, you can re-enable supported meta tool groups that your agent still needs. This session loads Gmail tools upfront while keeping connection management and workbench support available:

\*\*Python:\*\*

\`\`\`python
from composio import Composio, SESSION\_PRESET\_DIRECT\_TOOLS
from composio\_openai\_agents import OpenAIAgentsProvider

composio = Composio(
 api\_key="your\_api\_key",
 provider=OpenAIAgentsProvider(),
)

session = composio.sessions.create(
 user\_id="user\_123",
 toolkits=\["gmail"\],
 tools={
 "gmail": {
 "enable": \[\
 "GMAIL\_FETCH\_EMAILS",\
 "GMAIL\_CREATE\_EMAIL\_DRAFT",\
 \],
 },
 },
 session\_preset=SESSION\_PRESET\_DIRECT\_TOOLS,
 manage\_connections={
 "enable": True,
 },
 sandbox={
 "enable": True,
 },
)

tools = session.tools()
print(\[tool.name for tool in tools\])
\# GMAIL\_FETCH\_EMAILS
\# GMAIL\_CREATE\_EMAIL\_DRAFT
\# COMPOSIO\_MANAGE\_CONNECTIONS
\# COMPOSIO\_REMOTE\_WORKBENCH
\# COMPOSIO\_REMOTE\_BASH\_TOOL
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio, SessionPreset } from '@composio/core';
import { OpenAIAgentsProvider } from '@composio/openai-agents';

const composio = new Composio({
 apiKey: 'your\_api\_key',
 provider: new OpenAIAgentsProvider(),
});
const session = await composio.create("user\_123", {
 toolkits: \["gmail"\],
 tools: {
 gmail: {
 enable: \["GMAIL\_FETCH\_EMAILS", "GMAIL\_CREATE\_EMAIL\_DRAFT"\],
 },
 },
 sessionPreset: SessionPreset.DIRECT\_TOOLS,
 manageConnections: {
 enable: true,
 },
 sandbox: {
 enable: true,
 },
});

const tools = await session.tools();
console.log(tools.map((tool) => tool.name));
// GMAIL\_FETCH\_EMAILS
// GMAIL\_CREATE\_EMAIL\_DRAFT
// COMPOSIO\_MANAGE\_CONNECTIONS
// COMPOSIO\_REMOTE\_WORKBENCH
// COMPOSIO\_REMOTE\_BASH\_TOOL
\`\`\`

\## Enabling or disabling specific tools \[#enabling-or-disabling-specific-tools\]

To control which individual tools are available within a toolkit, use the \`tools\` configuration. The key is the toolkit slug and the value specifies which tools to enable or disable.

To enable only specific tools, pass an \`enable\` list per toolkit:

\*\*Python:\*\*

\`\`\`python
session = composio.sessions.create(
 user\_id="user\_123",
 tools={
 # Only these Gmail tools will be available
 "gmail": {"enable": \["GMAIL\_SEND\_EMAIL", "GMAIL\_FETCH\_EMAILS"\]},
 # Only issue-related GitHub tools
 "github": {"enable": \["GITHUB\_CREATE\_ISSUE", "GITHUB\_GET\_ISSUE"\]}
 }
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123", {
 tools: {
 // Only these Gmail tools will be available
 gmail: { enable: \["GMAIL\_SEND\_EMAIL", "GMAIL\_FETCH\_EMAILS"\] },
 // Only issue-related GitHub tools
 github: { enable: \["GITHUB\_CREATE\_ISSUE", "GITHUB\_GET\_ISSUE"\] }
 }
});
\`\`\`

The shorthand array syntax is equivalent to \`enable\`:

\*\*Python:\*\*

\`\`\`python
session = composio.sessions.create(
 user\_id="user\_123",
 tools={
 "gmail": \["GMAIL\_SEND\_EMAIL", "GMAIL\_FETCH\_EMAILS"\],
 "github": \["GITHUB\_CREATE\_ISSUE", "GITHUB\_GET\_ISSUE"\]
 }
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123", {
 tools: {
 gmail: \["GMAIL\_SEND\_EMAIL", "GMAIL\_FETCH\_EMAILS"\],
 github: \["GITHUB\_CREATE\_ISSUE", "GITHUB\_GET\_ISSUE"\]
 }
});
\`\`\`

To keep every tool in a toolkit except a few, use \`disable\`:

\*\*Python:\*\*

\`\`\`python
session = composio.sessions.create(
 user\_id="user\_123",
 tools={
 # All Slack tools except delete
 "slack": {"disable": \["SLACK\_DELETE\_MESSAGE"\]},
 # All GitHub tools except destructive ones
 "github": {"disable": \["GITHUB\_DELETE\_REPO", "GITHUB\_DELETE\_BRANCH"\]}
 }
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123", {
 tools: {
 // All Slack tools except delete
 slack: { disable: \["SLACK\_DELETE\_MESSAGE"\] },
 // All GitHub tools except destructive ones
 github: { disable: \["GITHUB\_DELETE\_REPO", "GITHUB\_DELETE\_BRANCH"\] }
 }
});
\`\`\`

\## Filtering tools by tags \[#filtering-tools-by-tags\]

Tools carry behavior tags that you can filter on. The available tags are:

\| Tag \| Description \|
\| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`readOnlyHint\` \| Tools that only read data \|
\| \`destructiveHint\` \| Tools that modify or delete data \|
\| \`idempotentHint\` \| Tools that can be safely retried \|
\| \`openWorldHint\` \| Tools that operate in an open world context \|

To apply tag filters across all toolkits, pass \`tags\` at the session level:

\*\*Python:\*\*

\`\`\`python
\# Only include read-only and idempotent tools
session = composio.sessions.create(
 user\_id="user\_123",
 tags=\["readOnlyHint", "idempotentHint"\]
)

\# Enable some tags, disable others
session = composio.sessions.create(
 user\_id="user\_123",
 tags={
 "enable": \["readOnlyHint"\],
 "disable": \["destructiveHint"\]
 }
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
// Only include read-only and idempotent tools
const session = await composio.create("user\_123", {
 tags: \["readOnlyHint", "idempotentHint"\]
});

// Enable some tags, disable others
const sessionWithTagConfig = await composio.create("user\_123", {
 tags: {
 enable: \["readOnlyHint"\],
 disable: \["destructiveHint"\]
 }
});
\`\`\`

To override the global tags for a specific toolkit, set \`tags\` inside that toolkit's \`tools\` config:

\*\*Python:\*\*

\`\`\`python
session = composio.sessions.create(
 user\_id="user\_123",
 # Global: only read-only tools
 tags=\["readOnlyHint"\],
 tools={
 # Override for GitHub: allow all tools except destructive
 "github": {"tags": {"disable": \["destructiveHint"\]}},
 # Override for Gmail: only read-only tools (explicit)
 "gmail": {"tags": \["readOnlyHint"\]}
 }
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123", {
 // Global: only read-only tools
 tags: \["readOnlyHint"\],
 tools: {
 // Override for GitHub: allow all tools except destructive
 github: { tags: { disable: \["destructiveHint"\] } },
 // Override for Gmail: only read-only tools (explicit)
 gmail: { tags: \["readOnlyHint"\] }
 }
});
\`\`\`

\## Preloading tools \[#preloading-tools\]

Return a known set of tools directly from \`session.tools()\` and the session MCP tool list, without the agent searching for them first.

By default, sessions expose \[meta tools\](/toolkits/meta-tools) that let the agent discover app tools at runtime. Use \`preload.tools\` when you already know which tools the agent needs, so it can call them without going through search each time.

Keep the preloaded set small, generally fewer than 20 tools, to avoid context bloat.

\> Requires \`@composio/core\` ≥ \`0.9.0\` (TypeScript) or \`composio\` ≥ \`0.13.0\`
(Python). Older SDKs do not support \`preload.tools\`,
\`sessionPreset\` / \`session\_preset\`, or custom-tool \`preload\`.

\> \`preload.tools\` is not supported when \`multiAccount.enable\` is true. See
\[Managing multiple connected accounts\](/docs/authentication/managing-multiple-connected-accounts).

\*\*Python:\*\*

\`\`\`python
from composio import Composio
from composio\_openai\_agents import OpenAIAgentsProvider

composio = Composio(
 api\_key="your\_api\_key",
 provider=OpenAIAgentsProvider(),
)

session = composio.sessions.create(
 user\_id="user\_123",
 toolkits=\["gmail"\],
 preload={
 "tools": \[\
 "GMAIL\_FETCH\_EMAILS",\
 "GMAIL\_CREATE\_EMAIL\_DRAFT",\
 \],
 },
)

tools = session.tools()
print(\[tool.name for tool in tools\])
\# GMAIL\_FETCH\_EMAILS
\# GMAIL\_CREATE\_EMAIL\_DRAFT
\# COMPOSIO\_SEARCH\_TOOLS
\# ... other default meta tools
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
import { OpenAIAgentsProvider } from '@composio/openai-agents';

const composio = new Composio({
 apiKey: 'your\_api\_key',
 provider: new OpenAIAgentsProvider(),
});
const session = await composio.create("user\_123", {
 toolkits: \["gmail"\],
 preload: {
 tools: \["GMAIL\_FETCH\_EMAILS", "GMAIL\_CREATE\_EMAIL\_DRAFT"\],
 },
});

const tools = await session.tools();
console.log(tools.map((tool) => tool.name));
// GMAIL\_FETCH\_EMAILS
// GMAIL\_CREATE\_EMAIL\_DRAFT
// COMPOSIO\_SEARCH\_TOOLS
// ... other default meta tools
\`\`\`

For SDK custom tools, set \`preload: true\` on the custom tool or custom toolkit. See \[Preloading custom tools\](/docs/extending-sessions/custom-tools-and-toolkits#preloading-custom-tools).

To preload every tool allowed by the session filters, use the \`preload.tools = "all"\` shortcut (\`preload={"tools": "all"}\` in Python, \`preload: { tools: "all" }\` in TypeScript). The \`all\` shorthand works for both Composio tools and SDK custom tools.

\## Custom auth configs \[#custom-auth-configs\]

Use your own OAuth credentials instead of Composio's defaults. Pass an auth config ID per toolkit:

\*\*Python:\*\*

\`\`\`python
session = composio.sessions.create(
 user\_id="user\_123",
 auth\_configs={
 "github": "ac\_your\_github\_config",
 "slack": "ac\_your\_slack\_config"
 }
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123", {
 authConfigs: {
 github: "ac\_your\_github\_config",
 slack: "ac\_your\_slack\_config",
 },
});
\`\`\`

See \[White-labeling authentication\](/docs/authentication/white-labeling-authentication) for branding, or \[Managed vs custom auth\](/docs/authentication/custom-app-vs-managed-app) for toolkits that require your own credentials.

\## Account selection \[#account-selection\]

When a user has multiple connected accounts for the same toolkit, specify which one the session uses:

\*\*Python:\*\*

\`\`\`python
session = composio.sessions.create(
 user\_id="user\_123",
 connected\_accounts={
 "gmail": \["ca\_work\_gmail"\],
 "github": \["ca\_personal\_github"\],
 }
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123", {
 connectedAccounts: {
 gmail: \["ca\_work\_gmail"\],
 github: \["ca\_personal\_github"\],
 },
});
\`\`\`

\> Arrays are the preferred format for \`connectedAccounts\`. A single string (e.g. \`"ca\_work\_gmail"\`) is still accepted for backwards compatibility and is automatically coerced to a single-element array. Only one account per toolkit is allowed when \[multi-account mode\](/docs/authentication/managing-multiple-connected-accounts) is disabled.

\### Precedence \[#precedence\]

When executing a tool, the session selects the connected account in this order:

1\. The \`connectedAccounts\` override, if provided in the session config.
2\. The \`authConfigs\` override, which finds or creates a connection on that config.
3\. An auth config previously created for this toolkit.
4\. A new auth config created using Composio managed auth.
5\. Otherwise, an error if no Composio managed auth scheme exists for the toolkit.

When a user has multiple connected accounts for a toolkit, the session uses the most recently connected one.

\## Disabling the sandbox \[#disabling-the-sandbox\]

By default, sessions include the \[sandbox\](/docs/sandbox/remote), a persistent environment that provides \`COMPOSIO\_REMOTE\_WORKBENCH\` and \`COMPOSIO\_REMOTE\_BASH\_TOOL\`. If your use case doesn't need code execution, disable it:

\*\*Python:\*\*

\`\`\`python
session = composio.sessions.create(
 user\_id="user\_123",
 sandbox={
 "enable": False
 }
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123", {
 sandbox: {
 enable: false,
 },
});
\`\`\`

When disabled:

\\* \`COMPOSIO\_REMOTE\_WORKBENCH\` and \`COMPOSIO\_REMOTE\_BASH\_TOOL\` are excluded from the session
\\* Sandbox-related system prompt lines are stripped
\\* Direct sandbox calls are rejected with a 400 error

\> \`sandbox\` is the preferred config key. \`workbench\` still works as a fully supported alias and isn't deprecated, so existing code keeps running unchanged.

\## Sandbox compute tier \[#sandbox-compute-tier\]

The sandbox runs per session. Pick a compute tier to match the workload: heavier code execution or larger in-memory data benefits from a bigger sandbox. Pass the tier via \`sandbox.sandbox\_size\` (snake\\\_case on the wire, \`sandboxSize\` in the TypeScript SDK).

\> Requires \`@composio/core\` ≥ \`0.8.1\` (TypeScript) or \`composio\` ≥ \`0.12.1\` (Python). Older SDKs reject \`sandboxSize\` (TypeScript) or silently drop \`sandbox\_size\` (Python). See the \[release notes\](/docs/changelog/2026/04/28).

\| Tier \| vCPU \| RAM \|
\| \-\-\-\-\-\-\-\-\-\- \| \-\-\-\- \| \-\-\-\- \|
\| \`standard\` \| 1 \| 1 GB \|
\| \`medium\` \| 2 \| 2 GB \|
\| \`large\` \| 4 \| 4 GB \|
\| \`xlarge\` \| 8 \| 8 GB \|

Defaults to \`standard\` when omitted.

\*\*Python:\*\*

\`\`\`python
session = composio.sessions.create(
 user\_id="user\_123",
 sandbox={
 "sandbox\_size": "large",
 },
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123", {
 sandbox: {
 enable: true,
 sandboxSize: "large",
 },
});
\`\`\`

\> \*\*Pricing:\*\* Sandboxes are not billed today. Composio plans to begin billing for sandbox usage soon (metered by tier and runtime). Pick a tier that matches your workload, but expect future pricing to track actual usage.

Changing \`sandbox\_size\` on an existing session recreates the sandbox on the next access. The sandbox's in-memory filesystem state is lost, but the persistent \[\`/mnt/files/\` mount\](/docs/sandbox/remote#files-and-mounts) survives the restart.

\## Session methods \[#session-methods\]

For framework examples, see provider-specific documentation like \[OpenAI\](/docs/providers/openai) or \[Vercel AI SDK\](/docs/providers/vercel). To connect over MCP instead, see \[Using sessions via MCP\](/docs/sessions-via-mcp).

\### tools() \[#tools\]

Get the tools the session exposes for your AI framework. By default these are the session's \[meta tools\](/toolkits/meta-tools), formatted for your configured provider.

\*\*Python:\*\*

\`\`\`python
tools = session.tools()
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123");
const tools = await session.tools();
\`\`\`

\### authorize() \[#authorize\]

Manually authenticate a user to a toolkit outside of the chat flow.

\*\*Python:\*\*

\`\`\`python
connection\_request = session.authorize("github")

print(connection\_request.redirect\_url)

connected\_account = connection\_request.wait\_for\_connection()
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123");
const connectionRequest = await session.authorize("github", {
 callbackUrl: "https://myapp.com/callback",
});

console.log(connectionRequest.redirectUrl);

const connectedAccount = await connectionRequest.waitForConnection();
\`\`\`

For more details, see \[Manually authenticating users\](/docs/authentication/manually-authenticating).

\### toolkits() \[#toolkits\]

List the toolkits enabled for the session and their connection status, sorted by popularity. Use it to build a UI showing which apps are connected. Each toolkit includes its \`slug\`, \`name\`, \`logo\`, and connection status, and the call returns the first 20 by default.

\*\*Python:\*\*

\`\`\`python
toolkits = session.toolkits()

for toolkit in toolkits.items:
 status = toolkit.connection.connected\_account.id if toolkit.connection.is\_active else "Not connected"
 print(f"{toolkit.name}: {status}")
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123");
const toolkits = await session.toolkits();

toolkits.items.forEach((toolkit) => {
 console.log(\`${toolkit.name}: ${toolkit.connection?.connectedAccount?.id ?? "Not connected"}\`);
});
\`\`\`

Filter to only connected toolkits:

\*\*Python:\*\*

\`\`\`python
connected = session.toolkits(is\_connected=True)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123");
const connected = await session.toolkits({ isConnected: true });
\`\`\`

Paginate through every toolkit with \`limit\` and the returned cursor:

\*\*Python:\*\*

\`\`\`python
all\_toolkits = \[\]
cursor = None

while True:
 result = session.toolkits(limit=20, next\_cursor=cursor)
 all\_toolkits.extend(result.items)
 cursor = result.next\_cursor
 if not cursor:
 break
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create("user\_123");
const allToolkits: any\[\] = \[\];
let cursor: string \| undefined;

do {
 const { items, cursor: nextCursor } = await session.toolkits({ limit: 20, cursor });
 allToolkits.push(...items);
 cursor = nextCursor;
} while (cursor);
\`\`\`

\### delete() \[#delete\]

Delete a session when you're done with it. Deleted sessions immediately stop being retrievable or executable, and the call returns the deleted \`session\_id\`. Deleting a missing or already-deleted session surfaces the backend \`404\`.

\> Requires \`@composio/core\` ≥ \`0.13.1\` (TypeScript) or \`composio\` ≥ \`0.17.1\` (Python).

\*\*Python:\*\*

\`\`\`python
result = session.delete()
print(result\["session\_id"\], result\["deleted"\])
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const session = await composio.create('user\_123');
const result = await session.delete();
console.log(result.sessionId, result.deleted);
\`\`\`

\## Browsing the catalog \[#browsing-the-catalog\]

Before configuring a session, explore the toolkits and tools available. Browse them visually at \[dashboard.composio.dev\](https://dashboard.composio.dev?utm\_source=docs\\&utm\_medium=content\\&utm\_campaign=docs-configuring-sessions) or in the \[docs catalog\](/toolkits), or fetch them programmatically:

\*\*Python:\*\*

\`\`\`python
\# List toolkits
toolkits = composio.toolkits.get()

\# List tools within a toolkit (top 20 by default)
tools = composio.tools.get("user\_123", toolkits=\["GITHUB"\])
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const userId = 'user\_123';
// List toolkits
const toolkits = await composio.toolkits.get();

// List tools within a toolkit (top 20 by default)
const tools = await composio.tools.get(userId, { toolkits: \["GITHUB"\] });
\`\`\`

Inspect a tool's input and output schema without a user context with \`getRawComposioToolBySlug\`:

\*\*Python:\*\*

\`\`\`python
tool = composio.tools.get\_raw\_composio\_tool\_by\_slug("GMAIL\_SEND\_EMAIL")
print(tool.name)
print(tool.description)
print(tool.input\_parameters)
print(tool.output\_parameters)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const tool = await composio.tools.getRawComposioToolBySlug("GMAIL\_SEND\_EMAIL");
console.log(tool.name);
console.log(tool.description);
console.log(tool.inputParameters);
console.log(tool.outputParameters);
\`\`\`

\## Next \[#next\]

\- \[Sandbox\](/docs/sandbox/remote): Give sessions a persistent compute environment with COMPOSIO\_REMOTE\_WORKBENCH and COMPOSIO\_REMOTE\_BASH\_TOOL

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
