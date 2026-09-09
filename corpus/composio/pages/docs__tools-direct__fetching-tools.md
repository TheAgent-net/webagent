---
url: https://docs.composio.dev/docs/tools-direct/fetching-tools
title: Fetching tools and schemas | Composio
description: Fetch and filter tools, and inspect schemas
status: 200
---

Direct execution

Legacy

# Fetching tools and schemas

Copy page

If you're building an agent, we recommend using [sessions](https://docs.composio.dev/docs/configuring-sessions) instead. See [Tools and toolkits](https://docs.composio.dev/docs/how-composio-works) for how sessions discover and fetch tools automatically.

Fetch specific tools, filter by permissions or search, and inspect schemas for type information. Tools are automatically formatted for your provider.

Not sure which toolkit covers your use case? Browse the [Toolkits catalog](https://docs.composio.dev/toolkits) — each toolkit page lists its tool slugs — or [search by task](https://docs.composio.dev/docs/tools-direct/fetching-tools#by-search-experimental) below.

## [Basic usage](https://docs.composio.dev/docs/tools-direct/fetching-tools\#basic-usage)

PythonTypeScript

```
tools = composio.tools.get(
    user_id,
    toolkits=["GITHUB"]
)
```

Returns top 20 tools by default. Tools require a `user_id` because they're scoped to authenticated accounts. See [User scoping](https://docs.composio.dev/docs/how-composio-works) and [Authentication](https://docs.composio.dev/docs/tools-direct/authenticating-tools).

## [Tool schemas](https://docs.composio.dev/docs/tools-direct/fetching-tools\#tool-schemas)

Inspect tool parameters and types without a user\_id:

PythonTypeScript

```
tool = composio.tools.get_raw_composio_tool_by_slug("GMAIL_SEND_EMAIL")
```

Generate type-safe code for direct SDK execution with [`composio generate`](https://docs.composio.dev/docs/cli#generate-type-definitions). This creates TypeScript or Python types from tool schemas.

View tool parameters and schemas visually in the [Composio platform](https://dashboard.composio.dev/?utm_source=docs&utm_medium=content&utm_campaign=docs-tools-direct-fetching-tools). Navigate to any toolkit and select a tool to see its input/output parameters.

## [Filtering tools](https://docs.composio.dev/docs/tools-direct/fetching-tools\#filtering-tools)

### [By toolkit](https://docs.composio.dev/docs/tools-direct/fetching-tools\#by-toolkit)

Get tools from specific apps. Returns top 20 tools by default.

PythonTypeScript

```
# Fetch with limit for a specific user
tools = composio.tools.get(
    user_id,
    toolkits=["GITHUB"],
    limit=5  # Get top 5 tools
)

# Same filter but without user_id (for schemas)
raw_tools = composio.tools.get_raw_composio_tools(
    toolkits=["GITHUB"],
    limit=5
)
```

### [By name](https://docs.composio.dev/docs/tools-direct/fetching-tools\#by-name)

Fetch specific tools when you know their names.

PythonTypeScript

```
# Fetch specific tools by name
tools = composio.tools.get(
    user_id,
    tools=["GITHUB_CREATE_ISSUE", "GITHUB_CREATE_PULL_REQUEST"]
)

# Get schemas without user_id
raw_tools = composio.tools.get_raw_composio_tools(
    tools=["GITHUB_CREATE_ISSUE", "GITHUB_CREATE_PULL_REQUEST"]
)
```

### [By scopes](https://docs.composio.dev/docs/tools-direct/fetching-tools\#by-scopes)

Filter OAuth tools by permission level. Only works with a single toolkit.

PythonTypeScript

```
# Filter by OAuth scopes (single toolkit only)
tools = composio.tools.get(
    user_id,
    toolkits=["GITHUB"],
    scopes=["write:org"]
)
```

### [By search (experimental)](https://docs.composio.dev/docs/tools-direct/fetching-tools\#by-search-experimental)

Find tools semantically.

PythonTypeScript

```
# Search tools semantically
tools = composio.tools.get(
    user_id,
    search="create calendar event"
)

# Search schemas without user_id
raw_tools = composio.tools.get_raw_composio_tools(
    search="create calendar event"
)

# Search within a specific toolkit
tools = composio.tools.get(
    user_id,
    search="issues",
    toolkits=["GITHUB"],
)

# Search toolkit schemas without user_id
raw_tools = composio.tools.get_raw_composio_tools(
    search="issues",
    toolkits=["GITHUB"]
)
```

These SDK examples use `latest` by default. REST v3 tool endpoints default to `00000000_00`; REST v3.1 tool endpoints default to `latest`. Pin a dated version when application code parses tool output. See [toolkit versioning](https://docs.composio.dev/docs/tools-direct/toolkit-versioning).

## [Next](https://docs.composio.dev/docs/tools-direct/fetching-tools\#next)

[**Executing tools** \\
Run tools with providers, agentic frameworks, or direct execution](https://docs.composio.dev/docs/tools-direct/executing-tools)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/tools-direct/fetching-tools.mdx)

### On this page

[Basic usage](https://docs.composio.dev/docs/tools-direct/fetching-tools#basic-usage) [Tool schemas](https://docs.composio.dev/docs/tools-direct/fetching-tools#tool-schemas) [Filtering tools](https://docs.composio.dev/docs/tools-direct/fetching-tools#filtering-tools) [By toolkit](https://docs.composio.dev/docs/tools-direct/fetching-tools#by-toolkit) [By name](https://docs.composio.dev/docs/tools-direct/fetching-tools#by-name) [By scopes](https://docs.composio.dev/docs/tools-direct/fetching-tools#by-scopes) [By search (experimental)](https://docs.composio.dev/docs/tools-direct/fetching-tools#by-search-experimental) [Next](https://docs.composio.dev/docs/tools-direct/fetching-tools#next)
