---
url: https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts
title: Managing multiple connected accounts | Composio
description: Handle users with multiple accounts for the same toolkit using multi-account mode and aliases
status: 200
---

[Authentication](https://docs.composio.dev/docs/authentication)

# Managing multiple connected accounts

Copy page

Users can connect multiple accounts for the same toolkit (e.g., personal and work Gmail accounts). This guide covers how to enable multi-account mode, label accounts with aliases, and select which account to use.

## [Multi-account mode](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts\#multi-account-mode)

By default, each session uses **one account per toolkit**. Enable multi-account mode to let users connect and use multiple accounts for the same toolkit within a single session.

PythonTypeScript

```
session = composio.create(
    user_id="user_123",
    toolkits=["gmail"],
    multi_account={
        "enable": True,
        "max_accounts_per_toolkit": 3,
    },
)
```

### [Configuration options](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts\#configuration-options)

| Option (TS / Python) | Type | Default | Description |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | Enable multi-account mode for this session |
| `maxAccountsPerToolkit` / `max_accounts_per_toolkit` | `number` | `5` | Maximum connected accounts per toolkit (2-10) |
| `requireExplicitSelection` / `require_explicit_selection` | `boolean` | `false` | When true and a toolkit has multiple active connected accounts, the agent must provide the `account` parameter in the tool execution call to select which account to use. `account` can be either a connected account ID or an alias (see the Aliases section below). When false, the default account (most recently connected active account) is used automatically |

When multi-account mode is disabled (the default), each session uses the most recently connected account for each toolkit.

## [Connecting multiple accounts](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts\#connecting-multiple-accounts)

Call `session.authorize()` multiple times for the same toolkit. Each call creates a separate connected account.

PythonTypeScript

```
session = composio.create(user_id="user_123", multi_account={"enable": True})

# Connect work account
work_auth = session.authorize("gmail", alias="work-gmail")
print(f"Connect work Gmail: {work_auth.redirect_url}")
work_connection = work_auth.wait_for_connection()

# Connect personal account
personal_auth = session.authorize("gmail", alias="personal-gmail")
print(f"Connect personal Gmail: {personal_auth.redirect_url}")
personal_connection = personal_auth.wait_for_connection()
```

## [Aliases](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts\#aliases)

Aliases are human-readable labels for connected accounts (e.g., `"work-gmail"`, `"personal-github"`). They make it easier for agents and users to identify which account is which.

- Must be unique per user and toolkit within a project
- Can be set during connection or updated after

### [Setting an alias during connection](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts\#setting-an-alias-during-connection)

Pass `alias` to `session.authorize()`:

PythonTypeScript

```
session = composio.create(user_id="user_123")

connection_request = session.authorize("gmail", alias="work-gmail")
```

The direct-execution methods `connectedAccounts.initiate()` and `connectedAccounts.link()` accept the same `alias` parameter. To create another active connection for the same user and auth config, also pass `allow_multiple=True` in Python or `allowMultiple: true` in TypeScript.

### [Updating or clearing an alias](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts\#updating-or-clearing-an-alias)

PythonTypeScript

```
# Set or update an alias
composio.connected_accounts.update("ca_abc123", alias="work-gmail")

# Clear an alias
composio.connected_accounts.update("ca_abc123", alias="")
```

## [Selecting a specific account for a session](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts\#selecting-a-specific-account-for-a-session)

Pin a session to specific accounts by passing their IDs in the session config. To retrieve connected account IDs, see [List accounts](https://docs.composio.dev/docs/auth-configuration/connected-accounts#list-accounts).

PythonTypeScript

```
session = composio.create(
    user_id="user_123",
    connected_accounts={
        "gmail": ["ca_work_gmail_id"],
        "github": ["ca_personal_github_id"],
    },
)
```

## [Viewing session's active accounts](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts\#viewing-sessions-active-accounts)

Use `session.toolkits()` to see which accounts are currently active:

PythonTypeScript

```
toolkits = session.toolkits()

for toolkit in toolkits.items:
    if toolkit.connection and toolkit.connection.connected_account:
        print(f"{toolkit.name}: {toolkit.connection.connected_account.id}")
```

## [Next](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts\#next)

[**Shared connections** \\
Make one connected account usable by multiple users with a per-user access control list](https://docs.composio.dev/docs/extending-sessions/shared-connections)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/authentication/managing-multiple-connected-accounts.mdx)

### On this page

[Multi-account mode](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts#multi-account-mode) [Configuration options](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts#configuration-options) [Connecting multiple accounts](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts#connecting-multiple-accounts) [Aliases](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts#aliases) [Setting an alias during connection](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts#setting-an-alias-during-connection) [Updating or clearing an alias](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts#updating-or-clearing-an-alias) [Selecting a specific account for a session](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts#selecting-a-specific-account-for-a-session) [Viewing session's active accounts](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts#viewing-sessions-active-accounts) [Next](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts#next)
