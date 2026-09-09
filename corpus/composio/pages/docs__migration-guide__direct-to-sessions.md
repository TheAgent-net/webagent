---
url: https://docs.composio.dev/docs/migration-guide/direct-to-sessions
title: Migrating from Direct Tools to Sessions | Composio
description: Move from direct tool execution to the sessions paradigm
status: 200
---

[Migration guides](https://docs.composio.dev/docs/migration-guide)

Written February 2026

# Migrating from Direct Tools to Sessions

Copy page

This guide is for developers who are using Composio's **direct tool execution** pattern and want to migrate to **sessions**. For a comparison of the two patterns, see [Sessions vs Direct Execution](https://docs.composio.dev/docs/sessions-vs-direct-execution).

With sessions, you don't need to manage tool fetching, authentication, or execution yourself. You create a session and it handles everything. Your existing auth configs and connected accounts carry over, so your users don't need to re-authenticate.

If you're starting fresh, use [Configuring Sessions](https://docs.composio.dev/docs/configuring-sessions) instead.

## [What changes](https://docs.composio.dev/docs/migration-guide/direct-to-sessions\#what-changes)

|  | Direct tools | Sessions |
| --- | --- | --- |
| **Tool discovery** | You fetch specific tools by name/toolkit | Agent discovers tools at runtime via meta tools |
| **Authentication** | You manage connect links and wait for connections | In-chat auth prompts users automatically, or use `session.authorize()` |
| **Execution** | You call `tools.execute()` with version pinning | Agent executes tools through `COMPOSIO_MULTI_EXECUTE_TOOL` |
| **Toolkit versions** | You manage versions manually | Handled automatically |

## [Migrating](https://docs.composio.dev/docs/migration-guide/direct-to-sessions\#migrating)

Pass your existing auth configs to the session

You already have auth configs (e.g. `ac_github_config`, `ac_slack_config`). Pass them when creating a session so it uses your existing OAuth credentials and your users' connected accounts carry over.

PythonTypeScript

```
from composio import Composio

composio = Composio()

# Before: manual tool fetching with user_id
# tools = composio.tools.get(user_id="user_123", toolkits=["GITHUB", "SLACK"])

# After: create a session with your existing auth configs
session = composio.create(
    user_id="user_123",
    auth_configs={
        "github": "ac_your_github_config",
        "slack": "ac_your_slack_config"
    }
)
```

Since the session uses the same `user_id` and auth configs, it automatically picks up existing connected accounts. No re-authentication needed.

Replace manual tool fetching with session tools

Instead of fetching specific tools by name, get the session's meta tools. These let the agent discover, authenticate, and execute any tool at runtime.

PythonTypeScript

```
# Before: manually specifying which tools to fetch
# tools = composio.tools.get(user_id="user_123", toolkits=["GITHUB"])

# After: session provides meta tools that handle discovery
tools = session.tools()
```

Remove manual auth flows

If you were manually creating connect links and waiting for connections, sessions handle this automatically. When a tool requires authentication, the agent prompts the user with a connect link in-chat.

PythonTypeScript

```
# Before: manual auth flow
# connection_request = composio.connected_accounts.link(
#     user_id="user_123",
#     auth_config_id="ac_your_github_config",
#     callback_url="https://your-app.com/callback"
# )
# redirect_url = connection_request.redirect_url

# After: auth happens automatically in-chat
# Or if you need to pre-authenticate outside of chat:
connection_request = session.authorize("github")
print(connection_request.redirect_url)
connected_account = connection_request.wait_for_connection()
```

Remove toolkit version management

If you were pinning toolkit versions in your code or environment variables, you can remove that. Sessions handle versioning automatically.

PythonTypeScript

```
# Before: manual version pinning
# composio = Composio(
#     toolkit_versions={
#         "github": "20251027_00",
#         "slack": "20251027_00",
#     }
# )

# After: no version management needed
composio = Composio()
session = composio.create(user_id="user_123")
```

## [Restricting toolkits](https://docs.composio.dev/docs/migration-guide/direct-to-sessions\#restricting-toolkits)

If you were fetching tools from specific toolkits, you can restrict the session to only those toolkits:

PythonTypeScript

```
session = composio.create(
    user_id="user_123",
    toolkits=["github", "gmail", "slack"],
    auth_configs={
        "github": "ac_your_github_config",
        "gmail": "ac_your_gmail_config",
        "slack": "ac_your_slack_config"
    }
)
```

## [Multiple connected accounts](https://docs.composio.dev/docs/migration-guide/direct-to-sessions\#multiple-connected-accounts)

If your users have multiple accounts for the same toolkit (e.g., work and personal Gmail), you can specify which one to use per session:

PythonTypeScript

```
session = composio.create(
    user_id="user_123",
    auth_configs={
        "gmail": "ac_your_gmail_config"
    },
    connected_accounts={
        "gmail": ["ca_work_gmail"]
    }
)
```

If you don't specify, the most recently connected account is used. See [Managing multiple connected accounts](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts) for details.

## [Triggers](https://docs.composio.dev/docs/migration-guide/direct-to-sessions\#triggers)

Triggers don't work with sessions yet. Continue using them the same way you do today with `composio.triggers.create()`, `composio.triggers.enable()`, and webhook subscriptions.

See [Triggers](https://docs.composio.dev/docs/triggers) for setup instructions.

## [White labeling](https://docs.composio.dev/docs/migration-guide/direct-to-sessions\#white-labeling)

If you've set up white-labeled OAuth screens with custom auth configs, those carry over automatically. Just pass the same auth config IDs to your session via `auth_configs` / `authConfigs`. Your users will continue to see your branding on consent screens.

See [White-labeling authentication](https://docs.composio.dev/docs/authentication/white-labeling-authentication) for more.

## [Next](https://docs.composio.dev/docs/migration-guide/direct-to-sessions\#next)

[**Configuring Sessions** \\
Toolkits, auth configs, account selection, and session methods](https://docs.composio.dev/docs/configuring-sessions)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/migration-guide/direct-to-sessions.mdx)

### On this page

[What changes](https://docs.composio.dev/docs/migration-guide/direct-to-sessions#what-changes) [Migrating](https://docs.composio.dev/docs/migration-guide/direct-to-sessions#migrating) [Restricting toolkits](https://docs.composio.dev/docs/migration-guide/direct-to-sessions#restricting-toolkits) [Multiple connected accounts](https://docs.composio.dev/docs/migration-guide/direct-to-sessions#multiple-connected-accounts) [Triggers](https://docs.composio.dev/docs/migration-guide/direct-to-sessions#triggers) [White labeling](https://docs.composio.dev/docs/migration-guide/direct-to-sessions#white-labeling) [Next](https://docs.composio.dev/docs/migration-guide/direct-to-sessions#next)
