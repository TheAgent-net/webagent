---
url: https://docs.composio.dev/toolkits/meta-tools/search_tools
title: Search Tools | Composio
description: Tool Server Info: Composio connects 500+ apps—Slack, GitHub, Notion, Google Workspace (Gmail, Sheets, Drive, Calendar...
status: 200
---

[← All Toolkits](https://docs.composio.dev/toolkits)

# Search Tools

Copy page

`COMPOSIO_SEARCH_TOOLS`ImportantExternalRead-only

Discovers the right tools across 500+ apps for a task and returns them with an execution plan, connection status, and the \`session\_id\` that ties the rest of the workflow together.

## When to use it

Call \`COMPOSIO\_SEARCH\_TOOLS\` first, at the start of any task that touches an external app or service. Run it again whenever the user pivots to a new use case so you get a fresh \`session\_id\` and a plan scoped to the new work.

Split a request into atomic queries (one query per tool call) and name the app in each query so intent stays scoped. The response tells you which toolkits already have an active connection and which need \`COMPOSIO\_MANAGE\_CONNECTIONS\`.

## Input parameters

`queries`arrayRequired

Structured English search queries to process in parallel. Split independent app/API actions into separate queries, including hidden prerequisites. Each query returns 4-6 tools.

Show 2 item properties

`session`object

Session context for correlating meta tool calls within a workflow. Always pass this parameter. Use {generate\_id: true} for new workflows or {id: "EXISTING\_ID"} to continue existing workflows.

Show 2 properties

`model`string

Client LLM model name (recommended). Used to optimize planning/search behavior. Ignored if omitted or invalid.

`search_strategy`stringDefault: `auto`

Search path to use. Use auto normally. If the returned plan does not match the current request or an expected tool is missing, retry with tool\_search to bypass cached plans and run direct tool search.

Possible values: `auto``tool_search`

## Response

`data`object

Data from the action execution

Show 6 properties

`error`string

Error if any occurred during the execution. Format: "X out of Y searches failed, reasons: <details>"

`successful`boolean

Whether all searches completed successfully. False if any query failed

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/toolkits/meta-tools/search_tools.mdx)
