---
url: https://docs.composio.dev/toolkits/meta-tools/multi_execute_tool
title: Multi Execute Tool | Composio
description: Fast and parallel tool executor for tools discovered through COMPOSIO_SEARCH_TOOLS
status: 200
---

[← All Toolkits](https://docs.composio.dev/toolkits)

# Multi Execute Tool

Copy page

`COMPOSIO_MULTI_EXECUTE_TOOL`ExternalDestructiveImportant

Executes up to 50 tools in parallel and returns structured outputs ready for immediate analysis.

## When to use it

Use \`COMPOSIO\_MULTI\_EXECUTE\_TOOL\` to run tools that \`COMPOSIO\_SEARCH\_TOOLS\` discovered. Batch tools into one call only when they are logically independent, with no ordering or output-to-input dependencies between them.

Pass strictly schema-compliant arguments and make sure each toolkit has an active connection first. Set \`sync\_response\_to\_workbench\` to true when a response may be large or needed for later scripting; otherwise process small responses inline.

## Input parameters

`tools`arrayRequired

List of logically independent tools to execute in parallel.

Show 2 item properties

`thought`string

One-sentence, concise, high-level rationale (no step-by-step).

`sync_response_to_workbench`booleanRequired

Predictively set true when the response may be large or needed for later scripting. Saves the full response to the workbench while returning an inline preview. If the result is small, keep it inline. Default false.

`current_step`string

Short enum for current step of the workflow execution. Eg FETCHING\_EMAILS, GENERATING\_REPLIES. Always include to keep execution aligned with the workflow.

`current_step_metric`string

Progress metrics for the current step - use to track how far execution has advanced. Format as a string "done/total units" - example "10/100 emails", "0/n messages", "3/10 pages".

`session_id`string

Pass the session\_id if you received one from a prior COMPOSIO\_SEARCH\_TOOLS call.

## Response

`data`object

Data from the action execution

Show 7 properties

`error`string

Error if any occurred during the execution of the action

`successful`boolean

Whether or not the action execution was successful or not

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/toolkits/meta-tools/multi_execute_tool.mdx)
