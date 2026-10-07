---
url: https://docs.composio.dev/docs/claude-code-plugin
title: Claude Code Plugin | Composio
description: Act on 1,000+ apps from Claude Code — Slack, GitHub, Gmail, Notion, Linear, and more — with fully managed OAuth. Installs in two commands.
status: 200
---

# Claude Code Plugin

Copy page

The **Composio plugin for Claude Code** lets Claude act on 1,000+ apps — send the Slack message, open the Linear issue, check your calendar, draft the email. Your agent decides what to do; Composio handles the rest: OAuth, permissions, and finding the right tool for each task. No API keys, no config files.

Using Codex? Follow the [Codex setup](https://docs.composio.dev/docs/agent-plugins#configure-one-agent). If you explicitly want MCP in Cursor, Claude Desktop, or another MCP client, use [Composio Connect](https://docs.composio.dev/docs/composio-connect).

## [Install](https://docs.composio.dev/docs/claude-code-plugin\#install)

Add the Composio marketplace

In Claude Code, run:

```
/plugin marketplace add ComposioHQ/composio-plugin-cc
```

Install the plugin

```
/plugin install composio@composio
```

Restart Claude Code (or run `/reload-plugins`) when prompted.

Ask Claude to do something

Try: _"Star `composiohq/composio` on GitHub."_

The first time, Claude installs the Composio CLI if it's missing, signs you in with `composio login`, and gives you an OAuth link for GitHub. Approve it in your browser and Claude runs the action.

Prefer to set things up ahead of time? Run `curl -fsSL https://composio.dev/install | sh` to install the CLI and configure your shell, then open a new terminal and run `composio login`.

## [What you can do](https://docs.composio.dev/docs/claude-code-plugin\#what-you-can-do)

Naming the app in your prompt keeps tool search scoped and the run reliable.

**Act on any connected app:**

```
What's on my Google Calendar for tomorrow? Add an event for lunch at 12PM.
```

**Run cross-app workflows** — reads feed the write:

```
Take the latest merged PR in acme/app, open a Linear issue summarizing it,
and post the issue link to #eng in Slack.
```

**Fan out reads, then summarize:**

```
In parallel, fetch my last 10 Gmail emails, my open Linear issues, and today's
Google Calendar events. Redact personal info, then give me a concise summary.
```

## [Connecting apps](https://docs.composio.dev/docs/claude-code-plugin\#connecting-apps)

Apps connect on demand — the first task that needs one hands you an OAuth link. To connect an app ahead of time:

```
/composio-connect linear
```

Works for any of the 1,000+ supported apps — `slack`, `github`, `gmail`, `notion`, `linear`, `hubspot`, and more.

## [Team setup](https://docs.composio.dev/docs/claude-code-plugin\#team-setup)

To pre-install the plugin for everyone on your team, add this to your project's `.claude/settings.json`:

.claude/settings.json

```
{
  "extraKnownMarketplaces": {
    "composio": {
      "source": {
        "source": "github",
        "repo": "ComposioHQ/composio-plugin-cc"
      }
    }
  },
  "enabledPlugins": {
    "composio@composio": true
  }
}
```

Anyone who clones the repo and opens it in Claude Code will be prompted to enable the plugin. See the Claude Code [plugin scopes](https://docs.claude.com/en/docs/claude-code/plugins-reference#plugin-installation-scopes) reference for `user` vs `project` vs `local` scope behavior.

## [Updating](https://docs.composio.dev/docs/claude-code-plugin\#updating)

To pull the latest plugin release:

```
/plugin marketplace update composio
/reload-plugins
```

New capabilities usually ship in the Composio CLI itself — `composio upgrade` picks them up without touching the plugin.

## [Source code](https://docs.composio.dev/docs/claude-code-plugin\#source-code)

The plugin is open source: [ComposioHQ/composio-plugin-cc](https://github.com/ComposioHQ/composio-plugin-cc). Issues and PRs welcome.

## [Troubleshooting](https://docs.composio.dev/docs/claude-code-plugin\#troubleshooting)

For plugin issues — install errors, marketplace not updating — see the [Claude Code plugin troubleshooting docs](https://docs.claude.com/en/docs/claude-code/plugins-reference#common-issues).

For auth or connection issues, see the [CLI reference](https://docs.composio.dev/docs/cli) or run `composio --help`.

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/claude-code-plugin.mdx)

### On this page

[Install](https://docs.composio.dev/docs/claude-code-plugin#install) [What you can do](https://docs.composio.dev/docs/claude-code-plugin#what-you-can-do) [Connecting apps](https://docs.composio.dev/docs/claude-code-plugin#connecting-apps) [Team setup](https://docs.composio.dev/docs/claude-code-plugin#team-setup) [Updating](https://docs.composio.dev/docs/claude-code-plugin#updating) [Source code](https://docs.composio.dev/docs/claude-code-plugin#source-code) [Troubleshooting](https://docs.composio.dev/docs/claude-code-plugin#troubleshooting)
