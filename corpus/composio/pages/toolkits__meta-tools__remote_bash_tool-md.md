---
url: https://docs.composio.dev/toolkits/meta-tools/remote_bash_tool.md
title: https://docs.composio.dev/toolkits/meta-tools/remote_bash_tool.md
description: 
status: 200
---

# Remote Bash Tool

**Slug:** `COMPOSIO_REMOTE_BASH_TOOL`
**Tags:** destructiveHint, openWorldHint

## Input Parameters

- `command` (string) *(required)*: The bash command to execute. Hard 3-minute (180s) execution limit — break large tasks into smaller commands.
- `session_id` (string): Pass the session_id if you received one from a prior COMPOSIO_SEARCH_TOOLS call.

## Response

- `data` (object) *(required)*: Data from the action execution
  - `session` (object): Session info echoed back to reinforce reuse: { id: string, instructions: string }
    - `id` (string) *(required)*
    - `instructions` (string) *(required)*
  - `stderr` (string) *(required)*: The standard error output from the command, possibly truncated for brevity.
  - `stderrLines` (integer) *(required)*: Total number of lines in original stderr, even if truncated
  - `stderr_file_path` (string): Path to file containing full stderr if output was truncated
  - `stdout` (string) *(required)*: The standard output from the command, possibly truncated for brevity.
  - `stdoutLines` (integer) *(required)*: Total number of lines in original stdout, even if truncated
  - `stdout_file_path` (string): Path to file containing full stdout if output was truncated
  - `sandbox_id_suffix` (string): Last 4 digits of the sandbox ID for easier reference
- `error` (string): Error if any occurred during the execution of the action
- `successful` (boolean) *(required)*: Whether or not the action execution was successful or not


---

📚 **More documentation:** [View all docs](https://docs.composio.dev/llms.txt) | [Glossary](https://docs.composio.dev/llms.mdx/reference/glossary) | [Examples](https://docs.composio.dev/llms.mdx/examples) | [API Reference](https://docs.composio.dev/llms.mdx/reference)
