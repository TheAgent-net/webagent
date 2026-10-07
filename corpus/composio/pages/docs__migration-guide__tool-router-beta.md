---
url: https://docs.composio.dev/docs/migration-guide/tool-router-beta
title: Migrating from Experimental Tool Router | Composio
description: Migrate from the experimental tool router to Composio sessions
status: 200
---

[Migration guides](https://docs.composio.dev/docs/migration-guide)

LegacyWritten January 2026

# Migrating from Experimental Tool Router

Copy page

This guide is for users who adopted the **experimental tool router** (`composio.experimental.tool_router`) during its beta period. The tool router has now graduated to a stable, first-class feature called **sessions** — with a simpler API, better auth handling, and full framework support.

If you never used `composio.experimental.tool_router`, you can skip this guide and start with [Configuring Sessions](https://docs.composio.dev/docs/configuring-sessions).

## [The basics](https://docs.composio.dev/docs/migration-guide/tool-router-beta\#the-basics)

Upgrade composio package

Upgrade to the latest stable version:

PythonTypeScript

```
pip install --upgrade composio
```

Update session creation

PythonTypeScript

```
# Beta (before)
session = composio.experimental.tool_router.create_session(
    user_id="user@example.com"
)

# Stable (after)
session = composio.create(
    user_id="user@example.com"
)
```

Moving users (optional)

If you have existing users on tool router and you don't want them to authenticate again:

- Tool Router will auto-detect auth configs and connected accounts it created (from the beta version).
- If you have custom auth configs (not created by Tool Router):
  - Search for the Auth config for that connected account. See [Connected Accounts](https://docs.composio.dev/docs/auth-configuration/connected-accounts) to fetch existing accounts programmatically.
  - While creating a session configure to use this Auth config.
  - You need to repeat this for each toolkit you want to enable for that session.

PythonTypeScript

```
session = composio.create(
    user_id="user_123",
    auth_configs={
        "github": "ac_your_github_config",
        "slack": "ac_your_slack_config"
    }
)
```

## [Next](https://docs.composio.dev/docs/migration-guide/tool-router-beta\#next)

[**Configuring Sessions** \\
Restrict toolkits, set auth configs, and select connected accounts](https://docs.composio.dev/docs/configuring-sessions)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/migration-guide/tool-router-beta.mdx)

### On this page

[The basics](https://docs.composio.dev/docs/migration-guide/tool-router-beta#the-basics) [Next](https://docs.composio.dev/docs/migration-guide/tool-router-beta#next)
