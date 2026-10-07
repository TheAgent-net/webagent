---
url: https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app.md
title: https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app.md
description: 
status: 200
---

\# Managed vs custom auth (/docs/authentication/custom-app-vs-managed-app)

Composio supports two ways to authenticate users with toolkits.

\\* \*\*\[Composio managed apps\](/toolkits/managed-auth)\*\*: Composio registers and maintains OAuth apps for popular toolkits such as GitHub, Gmail, and Slack. You do not need to register your own OAuth app.
\\* \*\*Custom auth configs\*\*: You provide your own OAuth app, API key, bearer token, or other credentials and tell Composio to use them for a toolkit.

This page covers when to use each, how to create a custom auth config, and how to wire it into a session.

\## When to use Composio managed apps \[#when-to-use-composio-managed-apps\]

Managed apps are the default when they are available. Use them when:

\\* \*\*You're building and iterating.\*\* No OAuth app registration, no credentials to manage. Create a session and start testing immediately.
\\* \*\*Default scopes cover your needs.\*\* Composio requests sensible defaults for each toolkit.
\\* \*\*Branding on consent screens doesn't matter yet.\*\* Users will see "Composio wants to access your account" during OAuth. Fine for internal tools, prototypes, and development. You can still \[white-label the Connect Link page\](/docs/authentication/white-labeling-authentication#customizing-the-connect-link) with your logo and app title without needing your own OAuth app.

\## When to use a custom auth config \[#when-to-use-a-custom-auth-config\]

Bring your own credentials when any of these apply:

\\* \*\*Your users see OAuth consent screens.\*\* In production, users should see your app name, not "Composio." This is the most common reason to switch.
\\* \*\*You need custom scopes.\*\* Composio's default scopes may not include everything you need (e.g., write access to a specific Google API).
\\* \*\*You're hitting rate limits.\*\* Managed apps share quota across all Composio users. Your own app gets a dedicated quota.
\\* \*\*You need faster polling triggers.\*\* Managed auth enforces a 15-minute minimum polling interval; your own app can use shorter polling intervals where supported.
\\* \*\*You're connecting to a custom instance.\*\* Self-hosted or regional variants (e.g., a private Salesforce subdomain) need their own OAuth app.
\\* \*\*Enterprise customers require your branding end-to-end.\*\*

\## Create a custom auth config \[#create-a-custom-auth-config\]

To check whether Composio provides the OAuth app for a toolkit, see \[Managed OAuth apps\](/toolkits/managed-auth). You can still create a custom auth config for branding, scopes, rate limits, polling intervals, or custom instances.

The steps below use the dashboard. To create auth configs in code instead, for example one per customer, see \[Programmatic auth configs\](/docs/authentication/programmatic-auth-configs).

\#### Create the auth config in the Composio dashboard

In the \[Composio dashboard\](https://dashboard.composio.dev/~/project/auth-configs?utm\_source=docs\\&utm\_medium=content\\&utm\_campaign=docs-custom-app-vs-managed-app):

 1\. Click \*\*Create Auth Config\*\*
 2\. Select the toolkit
 3\. Choose the auth scheme (OAuth2, API Key, Bearer Token, etc.)
 4\. Follow the dashboard instructions for the required credential fields

For OAuth toolkits, the dashboard shows the redirect URI to add in the provider's developer portal.

\#### Collect credentials from the provider

For OAuth toolkits, register an app in the provider's developer portal and add the redirect URI from the dashboard. Then copy the \*\*Client ID\*\* and \*\*Client Secret\*\* back into Composio.

For API key, bearer token, basic auth, or other auth schemes, collect the credential fields the toolkit requires and enter them in the dashboard.

Step-by-step OAuth guides: \[Google\](https://composio.dev/auth/googleapps) \| \[GitHub\](https://composio.dev/auth/github) \| \[Slack\](https://composio.dev/auth/slack) \| \[HubSpot\](https://composio.dev/auth/hubspot) \| \[All toolkits\](https://composio.dev/auth)

\#### Save and copy the auth config ID

After you enter the required credentials, click \*\*Create\*\* and copy the auth config ID (for example, \`ac\_1234abcd\`).

\#### Pass the auth config ID in your session

Creating the auth config isn't enough on its own. A session uses your config only when you pass its ID to \`authConfigs\`, keyed by toolkit. Toolkits you leave out keep using Composio managed auth.

\*\*Python:\*\*

\`\`\`python
from composio import Composio

composio = Composio()
session = composio.create(
 user\_id="user\_123",
 auth\_configs={
 "github": "ac\_your\_github\_config",
 # toolkits not listed here still use Composio managed auth
 },
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';

const composio = new Composio();
const session = await composio.create("user\_123", {
 authConfigs: {
 github: "ac\_your\_github\_config",
 // toolkits not listed here still use Composio managed auth
 },
});
\`\`\`

\## Mixing per toolkit \[#mixing-per-toolkit\]

You don't have to pick one approach for all toolkits. Use your own credentials for toolkits where users see consent screens (GitHub, Google, Slack) and Composio managed auth for the rest. Each toolkit gets its own auth config independently.

\*\*Python:\*\*

\`\`\`python
session = composio.create(
 user\_id="user\_123",
 auth\_configs={
 "github": "ac\_your\_github\_config",
 "google": "ac\_your\_google\_config",
 # everything else uses Composio managed auth automatically
 },
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio();
const session = await composio.create("user\_123", {
 authConfigs: {
 github: "ac\_your\_github\_config",
 google: "ac\_your\_google\_config",
 // everything else uses Composio managed auth automatically
 },
});
\`\`\`

\### Toolkits without managed auth \[#toolkits-without-managed-auth\]

Some OAuth toolkits do not have a Composio-managed OAuth app. Check \[Managed OAuth apps\](/toolkits/managed-auth) to find them. For API keys, instance details, and other authentication methods, check the individual pages in the \[toolkit catalog\](/toolkits).

\## Next \[#next\]

\- \[Programmatic auth configs\](/docs/authentication/programmatic-auth-configs): Create auth configs in code and pass them to a session

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
