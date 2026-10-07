---
url: https://docs.composio.dev/docs/skills.md
title: https://docs.composio.dev/docs/skills.md
description: 
status: 200
---

\# Skills (/docs/skills)

A \*\*skill\*\* is an execution playbook for one concrete task: "send an email to someone", "post a message to a Slack channel", "query a Notion database". It records the tools the task needs, the order to call them in, and the mistakes that make it fail.

You don't install skills or reference them by ID. When your agent calls \[\`COMPOSIO\_SEARCH\_TOOLS\`\](/toolkits/meta-tools/search\_tools) to find the tools for a task, a skill covering that task comes back in the same response:

\`\`\`json
{
 "primary\_tool\_slugs": \["SLACK\_FIND\_CHANNELS", "SLACK\_SEND\_MESSAGE"\],
 "related\_tool\_slugs": \["SLACK\_FIND\_USERS"\],
 "difficulty": "easy - Simple single-tool operation with known parameters",
 "recommended\_plan\_steps": \[\
 "Resolve the channel ID with SLACK\_FIND\_CHANNELS before posting.",\
 "Send the message with SLACK\_SEND\_MESSAGE using the resolved ID."\
 \],
 "known\_pitfalls": \[\
 "Passing a channel name where the API expects an ID returns channel\_not\_found."\
 \]
}
\`\`\`

What just happened: your agent asked for tools and got a sequence. \`primary\_tool\_slugs\` and \`related\_tool\_slugs\` come back on every search. \`recommended\_plan\_steps\`, \`known\_pitfalls\`, and \`difficulty\` appear only when a skill covers the use case, so treat them as optional in your handling.

Composio derives skills from real usage across the platform rather than writing them by hand, so they reflect how these tasks get completed, not how they ought to work.

\## Why skills matter \[#why-skills-matter\]

Handing an agent a toolkit tells it \*what\* it can call. It doesn't tell it \*how\* the call usually goes wrong, and an agent that works this out on its own pays for it in tokens and retries:

\\* It calls a tool with the wrong identifier, reads the error, and tries again.
\\* It fetches a whole inbox when it needed one search.
\\* It skips a lookup step and posts to a channel that never resolves.

A skill front-loads that knowledge. The sequence is already known and so are the pitfalls, so the work of rediscovering them is never spent. Because the skill arrives inside the search response, it lands in your agent's context before the first execution: the sequence is right the first time, and the known failure modes are avoided rather than discovered from an error.

\> Skills are read-only. Search matches them to the use case your agent describes, so there is nothing to install, enable, or configure. They are part of search results by default, and there is no opt-out today.

\## What a skill contains \[#what-a-skill-contains\]

\*\*Use case.\*\* The task in plain language, for example \*Start a direct message with someone in Slack and send a message\*. This is what search matches against.

\*\*Tools.\*\* The tool slugs the task uses, such as \`SLACK\_FIND\_USERS\`, \`SLACK\_OPEN\_DM\`, and \`SLACK\_SEND\_MESSAGE\`. A skill distinguishes the main tools from the supporting ones.

\*\*Execution plan.\*\* The ordered steps for completing the task, including optional steps and fallback paths for when the primary route is unavailable.

\*\*Pitfalls.\*\* The known failure modes for this task: the wrong-identifier mistakes, the missing lookups, and the assumptions that don't hold.

A skill isn't limited to one app. A task may span Slack and Gmail, and a skill covering several toolkits appears under each of them.

\## How a skill reaches your agent \[#how-a-skill-reaches-your-agent\]

Skills arrive through the search step a \[session\](/docs/how-composio-works) already performs:

1\. You create a session and give your agent its meta tools.
2\. Your agent has something to do, so it calls \`COMPOSIO\_SEARCH\_TOOLS\` with the task in plain language, one \`use\_case\` per query.
3\. Composio searches for tools and for a skill covering that use case at the same time.
4\. The response carries the tool slugs and their schemas. When a skill covers the use case, that same response carries the plan and pitfalls.
5\. Your agent works through the returned steps in order and checks the pitfalls as it goes, instead of inferring a sequence from the tool schemas.

Search matches on the use case, not on a tool name, so the phrasing your agent uses matters. "Start a DM with someone in Slack and send them a message" matches a skill. "slack tools" does not.

Note that skills ride inside the search response, so there is no separate contract to code against and nothing in your application has to ask for them.

\> There is no API for listing or reading skills, so unlike most of Composio there is no cURL equivalent on this page. Your agent still receives them at runtime through search. This page will be updated when that changes.

\## Related \[#related\]

\\* \[How Composio works\](/docs/how-composio-works): sessions, meta tools, and where search fits.
\\* \[\`COMPOSIO\_SEARCH\_TOOLS\`\](/toolkits/meta-tools/search\_tools): the search meta tool and its response fields.
\\* \[Configuring sessions\](/docs/configuring-sessions): how you give an agent access to tools.

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
