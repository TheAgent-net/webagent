---
url: https://docs.composio.dev/docs/agent-plugins.md
title: https://docs.composio.dev/docs/agent-plugins.md
description: 
status: 200
---

\# Agent plugins (/docs/agent-plugins)

Agent plugins let Codex and Claude Code use Composio from your current conversation. The plugin teaches your agent how to find tools, connect accounts, and run actions through the Composio CLI.

\## Install the plugin \[#install-the-plugin\]

Install the Composio CLI:

\`\`\`bash
curl -fsSL https://composio.dev/install \| sh
\`\`\`

Open a new terminal, sign in, and configure every supported agent on your machine:

\`\`\`bash
composio login
composio setup --target auto
\`\`\`

\`auto\` detects Codex and Claude Code. If both are installed, it configures both.

\> \*\*Running setup from an agent or script?\*\*: Setup asks before changing local files. Add \`--yes\` in a non-interactive shell: \`composio setup --target auto --yes\`.

\## Try a task \[#try-a-task\]

Ask Codex or Claude Code to work with one of your apps:

\\* \`List the open GitHub issues assigned to me.\`
\\* \`Summarize the unread Gmail messages I received today.\`
\\* \`Create a Linear issue from these release notes: ...\`

You do not need to know a tool slug or connection ID. The agent searches by task and selects a matching tool. If the toolkit is not connected, the agent starts \`composio link\` and gives you a Connect Link. Approve the connection, then ask the agent to continue.

\## Configure one agent \[#configure-one-agent\]

Use an explicit target when you only want to configure one agent.

\### Codex \[#codex\]

\`\`\`bash
composio setup --target codex
\`\`\`

The Codex plugin bundles the Composio CLI skill. You can also install the plugin with Codex directly:

\`\`\`bash
codex plugin marketplace add https://github.com/ComposioHQ/composio-plugin-openai.git --json
codex plugin add composio@composio --json
\`\`\`

The plugin source is available in \[\`ComposioHQ/composio-plugin-openai\`\](https://github.com/ComposioHQ/composio-plugin-openai).

\### Claude Code \[#claude-code\]

\`\`\`bash
composio setup --target claude
\`\`\`

You can also install the plugin from Claude Code:

\`\`\`bash
/plugin marketplace add ComposioHQ/composio-plugin-cc
/plugin install composio@composio
\`\`\`

See the \[Claude Code plugin guide\](/docs/claude-code-plugin) for team installation, updates, and troubleshooting.

\## What the plugin uses \[#what-the-plugin-uses\]

Both plugins run the Composio CLI underneath. The agent uses \`composio search\` to find an unknown tool, \`composio link\` to connect an account, and \`composio execute\` to run a known tool. The same connections are available when you use the \[CLI directly\](/docs/cli).

\## Install only the CLI skill \[#install-only-the-cli-skill\]

The plugin includes a Composio CLI skill that teaches your agent how to search for and run tools. Codex receives it with the plugin, while \`composio login\` installs it for Claude Code by default.

If you want the skill without the plugin, install it for your agent directly:

\`\`\`bash
composio --install-skill composio-cli claude
composio --install-skill composio-cli codex
\`\`\`

\## Choose another setup \[#choose-another-setup\]

\- \[Build an agent\](/docs/quickstart): Add Composio tools and authentication to your application.

\- \[Use the CLI\](/docs/cli): Search, connect, and run tools from your terminal.

\- \[Connect over MCP\](/docs/composio-connect): Add Composio to an existing MCP client.

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
