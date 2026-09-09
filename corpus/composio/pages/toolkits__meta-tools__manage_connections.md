---
url: https://docs.composio.dev/toolkits/meta-tools/manage_connections
title: Manage Connections | Composio
description: Create or manage connections to user's apps
status: 200
---

[← All Toolkits](https://docs.composio.dev/toolkits)

# Manage Connections

Copy page

`COMPOSIO_MANAGE_CONNECTIONS`ExternalDestructive

Checks connection status for a toolkit and returns a branded authentication link when the user needs to connect, covering OAuth, API keys, and every other auth type.

## When to use it

Call \`COMPOSIO\_MANAGE\_CONNECTIONS\` when \`COMPOSIO\_SEARCH\_TOOLS\` reports that a toolkit has no active connection. You must have an active connection before you execute any tool from that toolkit.

When the tool returns a \`redirect\_url\`, show it to the user as a formatted markdown link and wait for the connection to go active before executing. Set \`reinitiate\_all\` to force a fresh connection when credentials are stale.

## Input parameters

`toolkits`array<string>Required

Toolkit slugs to check or connect. Must be valid toolkit slugs; never invent. Missing connections initiate auth. Examples: \['gmail', 'github', 'slack', 'googlesheets', 'outlook'\].

`reinitiate_all`booleanDefault: `false`

Force reconnection for all listed toolkits, even if active connections already exist. Use when credentials may be stale, you need fresh credentials/settings, or you are troubleshooting connection issues. This replaces existing active connections with new auth-link flows. Default false.

`session_id`string

Pass the session\_id if you received one from a prior COMPOSIO\_SEARCH\_TOOLS call.

## Response

`data`object

Data from the action execution

Show 4 properties

`error`string

Error if any occurred during the execution of the action

`successful`boolean

Whether or not the action execution was successful or not

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/toolkits/meta-tools/manage_connections.mdx)
