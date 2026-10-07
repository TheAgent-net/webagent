---
url: https://docs.composio.dev/docs/composio-connect
title: Composio Connect | Composio
description: Connect Composio to an existing MCP client without using the SDK
status: 200
---

# Composio Connect

Copy page

Use Composio Connect when you already have an MCP-compatible client and want the shared Composio MCP URL, without creating an SDK session. Connect it to `https://connect.composio.dev/mcp`.

If you use Codex or Claude Code and did not explicitly choose MCP, install the native [Composio agent plugin](https://docs.composio.dev/docs/agent-plugins) instead. The plugin uses the Composio CLI and is the shortest path for those agents.

If you are building an application, start with the [SDK Quickstart](https://docs.composio.dev/docs/quickstart) or create a [session MCP endpoint](https://docs.composio.dev/docs/sessions-via-mcp) instead.

## [How Composio Connect works](https://docs.composio.dev/docs/composio-connect\#how-composio-connect-works)

Composio Connect is an MCP server at `https://connect.composio.dev/mcp` that gives your AI agent access to 1000+ apps, including Gmail, Notion, Slack, GitHub, Linear, HubSpot, and Strava, through a single connection.

Rather than exposing every app tool directly, Composio exposes **7 meta-tools** that let the agent discover what's available, authorize apps on demand, and execute tools across apps in parallel. The first time your agent needs an app, Composio generates an OAuth link you approve in your browser; after that the connection persists across sessions. See [Available MCP tools](https://docs.composio.dev/docs/composio-connect#available-mcp-tools) for the full list.

To get started, pick your client below.

![Claude Code logo](https://docs.composio.dev/images/clients/claude.svg?dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)Claude Code![Claude Cowork (Claude Desktop) logo](https://docs.composio.dev/images/clients/claude.svg?dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)Claude Cowork (Claude Desktop)![ChatGPT logo](https://docs.composio.dev/_next/image?url=%2Fimages%2Fclients%2Fchatgpt.png&w=32&q=75&dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)ChatGPT![Cursor logo](https://docs.composio.dev/images/clients/cursor.svg?dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)Cursor

More clients

## Claude Code

Ask Claude Code to install Composio

Paste this prompt into Claude Code:

```
Install the Composio CLI: curl -fsSL https://composio.dev/install | sh, then run composio login.
```

## [Connect your apps](https://docs.composio.dev/docs/composio-connect\#connect-your-apps)

Your agent will prompt you to connect apps when needed. If you want to connect an app ahead of time, ask your agent to start the connection and complete the OAuth flow it opens.

## [Available MCP tools](https://docs.composio.dev/docs/composio-connect\#available-mcp-tools)

Composio Connect exposes 7 meta-tools that orchestrate access to all supported apps. Your agent uses these to discover, connect, and execute upstream tools — you don't need to call them directly.

- **`COMPOSIO_SEARCH_TOOLS`** — Search the Composio catalog and return relevant tools for a user request, along with a suggested execution plan.
- **`COMPOSIO_GET_TOOL_SCHEMAS`** — Fetch full input schemas for tool slugs returned by search.
- **`COMPOSIO_MULTI_EXECUTE_TOOL`** — Execute one or more discovered tools in parallel across connected apps (up to 50 per call).
- **`COMPOSIO_MANAGE_CONNECTIONS`** — Create, list, rename, or remove OAuth connections to upstream apps.
- **`COMPOSIO_WAIT_FOR_CONNECTIONS`** — Wait for a user to complete an OAuth flow before the agent continues.
- **`COMPOSIO_REMOTE_WORKBENCH`** — Run Python in a remote sandbox for bulk operations or processing large tool responses.
- **`COMPOSIO_REMOTE_BASH_TOOL`** — Run bash in a remote sandbox for file processing and large data handling.

## [Troubleshooting](https://docs.composio.dev/docs/composio-connect\#troubleshooting)

### [Tools aren't appearing in my agent](https://docs.composio.dev/docs/composio-connect\#tools-arent-appearing-in-my-agent)

1. Confirm the MCP server is connected. In Claude Desktop, go to **Settings > Connectors** and check that Composio shows a `CUSTOM` badge. In Claude Code, run `/mcp` and confirm Composio is enabled.
2. Clear the connector cache. In Claude Desktop: click the **⋮** next to Composio and select **Clear cache**.
3. If the issue persists, disconnect and re-add the connector:
   - **Claude Desktop** — click **⋮ \> Disconnect**, then **Remove**. Re-add via **Add custom connector**.
   - **Claude Code** — re-run the setup command from the Claude Code section above.

### [The OAuth link expired or didn't open](https://docs.composio.dev/docs/composio-connect\#the-oauth-link-expired-or-didnt-open)

OAuth links are short-lived. If the browser window doesn't open or the link has expired, ask your agent to retry the action — Composio will generate a fresh link.

### [An app action is failing with an auth error](https://docs.composio.dev/docs/composio-connect\#an-app-action-is-failing-with-an-auth-error)

1. Ask your agent to inspect the app connection.
2. If the connection is unhealthy, disconnect and reconnect it when prompted.
3. Retry the action.

### [I want to remove or reconnect an app](https://docs.composio.dev/docs/composio-connect\#i-want-to-remove-or-reconnect-an-app)

Ask your agent to manage the connection. It can prompt you to disconnect, delete, or re-authorize an app.

### [I still need help](https://docs.composio.dev/docs/composio-connect\#i-still-need-help)

Reach out at [support@composio.dev](mailto:support@composio.dev) or join the [Composio Discord](https://discord.com/invite/cNruWaAhQk).

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/composio-connect.mdx)

### On this page

[How Composio Connect works](https://docs.composio.dev/docs/composio-connect#how-composio-connect-works) [Connect your apps](https://docs.composio.dev/docs/composio-connect#connect-your-apps) [Available MCP tools](https://docs.composio.dev/docs/composio-connect#available-mcp-tools) [Troubleshooting](https://docs.composio.dev/docs/composio-connect#troubleshooting) [Tools aren't appearing in my agent](https://docs.composio.dev/docs/composio-connect#tools-arent-appearing-in-my-agent) [The OAuth link expired or didn't open](https://docs.composio.dev/docs/composio-connect#the-oauth-link-expired-or-didnt-open) [An app action is failing with an auth error](https://docs.composio.dev/docs/composio-connect#an-app-action-is-failing-with-an-auth-error) [I want to remove or reconnect an app](https://docs.composio.dev/docs/composio-connect#i-want-to-remove-or-reconnect-an-app) [I still need help](https://docs.composio.dev/docs/composio-connect#i-still-need-help)
