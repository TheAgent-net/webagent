---
url: https://docs.composio.dev/docs?cta_placement=footer-docs
title: Welcome | Composio
description: Choose whether to build Composio into an application or use it from an existing agent, then start with the SDK, a native plugin, the CLI, or MCP.
status: 200
---

# Give agents the tools they need.

Use Composio to discover tools, authenticate each user, and run actions across 1,400+ apps.

[**![Composio](https://docs.composio.dev/Composio%20Logo.svg?dpl=dpl_5Fa4ZnHdwLH3so7fdEGNiQ6h7C2a)![Composio](https://docs.composio.dev/Composio%20Logo%20Dark.svg?dpl=dpl_5Fa4ZnHdwLH3so7fdEGNiQ6h7C2a)Platform** \\
\\
Build Composio into your own agent or application — tools, auth, and triggers for every one of your users.\\
\\
import { Composio } from '@composio/core'\\
\\
import { OpenAIAgentsProvider } from '@composio/openai-agents'\\
\\
const composio = new Composio({ provider: new OpenAIAgentsProvider() })\\
\\
const session = await composio.create(userId)\\
\\
const tools = await session.tools()\\
\\
const agent = new Agent({ name, instructions, model, tools })](https://docs.composio.dev/docs/quickstart)

- [QuickstartBuild an agent that discovers tools and works across your apps.](https://docs.composio.dev/docs/quickstart)
- [Framework guidesUse OpenAI, Anthropic, Vercel AI SDK, or another framework.](https://docs.composio.dev/docs/providers)
- [Sessions via MCPExpose a Composio session through a hosted MCP endpoint.](https://docs.composio.dev/docs/sessions-via-mcp)

[**![Composio](https://docs.composio.dev/Composio%20Logo.svg?dpl=dpl_5Fa4ZnHdwLH3so7fdEGNiQ6h7C2a)![Composio](https://docs.composio.dev/Composio%20Logo%20Dark.svg?dpl=dpl_5Fa4ZnHdwLH3so7fdEGNiQ6h7C2a)For You** \\
\\
Use Composio from the agents you already have — Claude Code, Codex, Cursor, or your terminal.\\
\\
![](https://docs.composio.dev/images/clients/claude.svg)![](https://docs.composio.dev/images/clients/codex.png)![](https://docs.composio.dev/images/clients/cursor.svg)![](https://docs.composio.dev/images/clients/openclaw.svg)\\
\\
How can I help?](https://docs.composio.dev/docs/agent-plugins)

- [Agent pluginsInstall the native Composio plugin for Codex or Claude Code.](https://docs.composio.dev/docs/agent-plugins)
- [Composio CLISearch, connect, and run tools from your terminal.](https://docs.composio.dev/docs/cli)
- [Connect over MCPUse Composio with Cursor or another existing MCP client.](https://docs.composio.dev/docs/composio-connect)

## Everything you need to ship production agents.

[**Tools that resolve by intent.** \\
\\
Smart tool search over 1,400+ apps, surfaced just in time with the right scope.\\
\\
![](https://logos.composio.dev/api/gmail)\\
\\
![](https://logos.composio.dev/api/slack)\\
\\
![](https://logos.composio.dev/api/discord)\\
\\
![](https://logos.composio.dev/api/zoom)\\
\\
![](https://logos.composio.dev/api/notion)\\
\\
![](https://logos.composio.dev/api/linear)\\
\\
![](https://logos.composio.dev/api/jira)\\
\\
![](https://logos.composio.dev/api/asana)\\
\\
![](https://logos.composio.dev/api/trello)\\
\\
![](https://logos.composio.dev/api/clickup)\\
\\
![](https://logos.composio.dev/api/github)\\
\\
![](https://logos.composio.dev/api/gitlab)\\
\\
![](https://logos.composio.dev/api/figma)\\
\\
![](https://logos.composio.dev/api/canva)\\
\\
![](https://logos.composio.dev/api/googledrive)\\
\\
![](https://logos.composio.dev/api/dropbox)\\
\\
![](https://logos.composio.dev/api/airtable)\\
\\
![](https://logos.composio.dev/api/confluence)\\
\\
![](https://logos.composio.dev/api/salesforce)\\
\\
![](https://logos.composio.dev/api/hubspot)\\
\\
![](https://logos.composio.dev/api/stripe)\\
\\
![](https://logos.composio.dev/api/shopify)\\
\\
![](https://logos.composio.dev/api/zendesk)\\
\\
![](https://logos.composio.dev/api/sendgrid)\\
\\
![](https://logos.composio.dev/api/mailchimp)\\
\\
![](https://logos.composio.dev/api/calendly)\\
\\
![](https://logos.composio.dev/api/youtube)\\
\\
![](https://logos.composio.dev/api/twitter)\\
\\
![](https://logos.composio.dev/api/linkedin)\\
\\
+1K](https://docs.composio.dev/docs/how-composio-works) [**Auth and context, per end-user.** \\
\\
OAuth, API keys, and tokens scoped to each user and refreshed automatically.\\
\\
Ada Chenusr\_9x2kLm7\\
\\
![](https://logos.composio.dev/api/slack)Slackacme-workspace\\
\\
![](https://logos.composio.dev/api/gmail)Gmailada@acme.com\\
\\
![](https://logos.composio.dev/api/linear)Linearacme](https://docs.composio.dev/docs/authentication) [**Listen to anything, anywhere.** \\
\\
Subscribe to events from any toolkit and route them straight to your agent.\\
\\
- ![](https://logos.composio.dev/api/gmail)gmail.message.new\\
- ![](https://logos.composio.dev/api/stripe)stripe.charge.succeeded\\
- ![](https://logos.composio.dev/api/linear)linear.issue.opened](https://docs.composio.dev/docs/triggers) [**Run arbitrary code, safely.** \\
\\
A sandbox pre-wired with your user's connected accounts and 1,400+ tools.\\
\\
sandbox.py\\
\\
```\\
issues, err = run_composio_tool("LINEAR_LIST_ISSUES", {})\\
summary = invoke_llm(f"Summarize: {issues}")\\
run_composio_tool("SLACK_SEND_MESSAGE", {"text": summary})\\
```](https://docs.composio.dev/docs/sandbox)

[Quickstart\\
\\
A working agent in five steps.](https://docs.composio.dev/docs/quickstart) [API Reference\\
\\
Every endpoint, with cURL.](https://docs.composio.dev/reference) [Examples\\
\\
End-to-end recipes for real agents.](https://docs.composio.dev/examples) [Changelog\\
\\
What shipped this week.](https://docs.composio.dev/docs/changelog) [Toolkits\\
\\
Browse the 1,400+ apps your agent can act on.](https://docs.composio.dev/toolkits) [Platform Dashboard\\
\\
Auth configs, connected accounts, and logs.](https://dashboard.composio.dev/?utm_source=docs&utm_medium=content&utm_campaign=welcome)
