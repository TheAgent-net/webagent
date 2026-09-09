---
url: https://docs.composio.dev/toolkits/meta-tools/remote_workbench
title: Remote Workbench | Composio
description: Process REMOTE FILES or script BULK TOOL EXECUTIONS using Python code IN A REMOTE SANDBOX
status: 200
---

[← All Toolkits](https://docs.composio.dev/toolkits)

# Remote Workbench

Copy page

`COMPOSIO_REMOTE_WORKBENCH`DestructiveExternal

Runs Python in a persistent remote sandbox to process large remote files and script bulk or repeated tool executions.

## When to use it

Reach for \`COMPOSIO\_REMOTE\_WORKBENCH\` when data lives in a remote file rather than inline in the chat, when you need to run a known tool in bulk (for example, label 100 emails), or when you want to call an API via \`proxy\_execute\` because no Composio tool exists for it.

State persists across calls like a Jupyter notebook, and helper functions such as \`run\_composio\_tool\` and \`invoke\_llm\` are preloaded. There is a hard 3-minute execution limit per cell, so split work into steps and checkpoint intermediate results to \`/mnt/files/\`. Do not use it for data you can already see inline.

## Input parameters

`code_to_execute`stringRequired

Python to run inside the persistent remote Jupyter sandbox. State (imports, variables, files) is preserved across executions. Keep code concise. Avoid unnecessary comments. Hard 3-minute (180s) execution limit — break large tasks into smaller cells.

`thought`string

Brief objective for this step.

`current_step`string

Short enum for current step of the workflow execution. Eg FETCHING\_EMAILS, GENERATING\_REPLIES. Always include to keep execution aligned with the workflow.

`current_step_metric`string

Progress metrics for the current step - use to track how far execution has advanced. Format as a string "done/total units" - example "10/100 emails", "0/n messages", "3/10 pages".

`session_id`string

Pass the session\_id if you received one from a prior COMPOSIO\_SEARCH\_TOOLS call.

## Response

`data`object

Data from the action execution

Show 9 properties

`error`string

Error if any occurred during the execution of the action

`successful`boolean

Whether or not the action execution was successful or not

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/toolkits/meta-tools/remote_workbench.mdx)
