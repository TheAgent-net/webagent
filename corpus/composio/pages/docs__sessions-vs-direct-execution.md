---
url: https://docs.composio.dev/docs/sessions-vs-direct-execution
title: Sessions vs Direct Execution | Composio
description: When to use session-based meta tools vs direct tool fetching and execution
status: 200
---

Legacy

# Sessions vs Direct Execution

Copy page

A **session** is the runtime context Composio creates for one of your users with `composio.create(userId)`. It ties together the user, available toolkits, auth, and connected accounts. By default it gives your agent [meta tools](https://docs.composio.dev/docs/how-composio-works#meta-tools) so the agent discovers which app tools to use, authenticates users, and executes tools at runtime.

**Direct execution** skips the session. Your code fetches specific tool schemas, manages auth itself, and calls `tools.execute()` directly.

Use sessions unless you need full control over which tools are available and when they run.

|  | Sessions | Direct execution |
| --- | --- | --- |
| **Discovery** | Agent finds tools at runtime and resolves dependencies automatically (e.g., if a tool needs an ID from another API, the agent finds that tool, runs it, and continues) | You select all tools upfront and need to account for any dependencies between them |
| **Context cost** | Only meta tools in context, app tools loaded on demand | Every tool schema you select is loaded upfront |
| **Guidance** | Search returns recommended steps and common pitfalls alongside schemas | You get tool schemas only |
| **Memory** | Meta tools share context across calls, storing discovered IDs and relationships | You manage state between calls |
| **Auth** | [In-chat](https://docs.composio.dev/docs/authentication#in-chat-authentication): agent prompts the user to connect when needed. Also supports [manual](https://docs.composio.dev/docs/authentication/manually-authenticating) | You build the auth flow with [connect links](https://docs.composio.dev/docs/tools-direct/authenticating-tools) |
| **[Sandbox](https://docs.composio.dev/docs/sandbox/remote)** | Built in, large responses offloaded automatically | Not available |
| **Human approval** | You configure approval rules on the session. Harder to intercept individual calls since tools are discovered dynamically | You intercept before each call in your code |
| **Latency** | Multiple LLM turns (search, then execute) | Single call |

Sessions are configurable. [Restrict toolkits](https://docs.composio.dev/docs/configuring-sessions), set [auth configs](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs) for white-labeled OAuth, and pin [connected accounts](https://docs.composio.dev/docs/configuring-sessions#account-selection). See [Configuring Sessions](https://docs.composio.dev/docs/configuring-sessions) for the full list.

Sessions aren't all-or-nothing. With the [direct tools preset](https://docs.composio.dev/docs/configuring-sessions#direct-tools-preset), a session returns a fixed set of tools directly from `session.tools()` with no search or meta tools, so the agent sees exactly the tools you list while you keep session auth, connected accounts, and the sandbox. It's the middle ground between runtime discovery and direct execution.

## [Sessions](https://docs.composio.dev/docs/sessions-vs-direct-execution\#sessions)

`composio.create()` returns [meta tools](https://docs.composio.dev/docs/how-composio-works#meta-tools):

PythonTypeScript

```
from composio import Composio
from composio_openai import OpenAIProvider

composio = Composio(provider=OpenAIProvider())
session = composio.create(user_id="user_123")
tools = session.tools()
# Returns meta tools like COMPOSIO_SEARCH_TOOLS, COMPOSIO_MANAGE_CONNECTIONS,
# COMPOSIO_MULTI_EXECUTE_TOOL, COMPOSIO_REMOTE_WORKBENCH, etc.
```

The agent discovers app tools through `COMPOSIO_SEARCH_TOOLS`:

```
User: "Create a GitHub issue for the login bug"

> Agent calls COMPOSIO_SEARCH_TOOLS({ query: "create github issue" })
  Returns: GITHUB_CREATE_ISSUE schema + connection status

> Agent calls COMPOSIO_MANAGE_CONNECTIONS({ toolkits: ["github"] })
  Returns: confirms connected (or auth link if not)

> Agent calls COMPOSIO_MULTI_EXECUTE_TOOL({ tool: "GITHUB_CREATE_ISSUE", args: {...} })
  Returns: issue details

Agent: "Created issue #42 on your-org/your-repo"
```

`session.tools()` returns **meta tools** (`COMPOSIO_SEARCH_TOOLS`, etc.), not app tools (`GMAIL_SEND_EMAIL`, etc.). The agent discovers app tools at runtime through search. To work with app tools directly, use direct execution.

### [Configuration](https://docs.composio.dev/docs/sessions-vs-direct-execution\#configuration)

Restrict toolkits, set auth configs, pin connected accounts:

PythonTypeScript

```
session = composio.create(
    user_id="user_123",
    toolkits=["github", "gmail"],
    auth_configs={"github": "ac_my_config"},
    connected_accounts={"gmail": ["ca_work"]},
)
```

See [Configuring Sessions](https://docs.composio.dev/docs/configuring-sessions) for details.

## [Direct execution](https://docs.composio.dev/docs/sessions-vs-direct-execution\#direct-execution)

Fetch tools by slug or toolkit. Pass them to your LLM or call `tools.execute()` without one.

PythonTypeScript

```
from composio import Composio
from composio_openai import OpenAIProvider

composio = Composio(
    provider=OpenAIProvider(),
    toolkit_versions={"github": "latest"},  # required for direct execution
)

# Fetch specific tools
tools = composio.tools.get(
    user_id="user_123",
    tools=["GITHUB_CREATE_ISSUE", "GITHUB_LIST_ISSUES"]
)

# Or by toolkit
tools = composio.tools.get(
    user_id="user_123",
    toolkits=["github"],
    limit=50
)

# Execute without an LLM
result = composio.tools.execute(
    "GITHUB_CREATE_ISSUE",
    user_id="user_123",
    arguments={"owner": "my-org", "repo": "my-repo", "title": "Fix login bug"},
    dangerously_skip_version_check=True,  # required when running "latest"; or pin via version=...
)
```

`tools.get()` returns 20 tools by default. When fetching from multiple toolkits (e.g., `toolkits=["gmail", "github", "tavily"]`), the limit may cut off tools from later toolkits. Increase `limit` or fetch each toolkit separately.

With direct execution, you manage [auth configs](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs), [connect links](https://docs.composio.dev/docs/tools-direct/authenticating-tools), and [toolkit versioning](https://docs.composio.dev/docs/tools-direct/toolkit-versioning) yourself.

## [Migrating](https://docs.composio.dev/docs/sessions-vs-direct-execution\#migrating)

See the [migration guide](https://docs.composio.dev/docs/migration-guide/direct-to-sessions). Auth configs and connected accounts carry over.

## [Next](https://docs.composio.dev/docs/sessions-vs-direct-execution\#next)

[**Configuring Sessions** \\
Toolkits, auth configs, and connected accounts](https://docs.composio.dev/docs/configuring-sessions)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/sessions-vs-direct-execution.mdx)

### On this page

[Sessions](https://docs.composio.dev/docs/sessions-vs-direct-execution#sessions) [Configuration](https://docs.composio.dev/docs/sessions-vs-direct-execution#configuration) [Direct execution](https://docs.composio.dev/docs/sessions-vs-direct-execution#direct-execution) [Migrating](https://docs.composio.dev/docs/sessions-vs-direct-execution#migrating) [Next](https://docs.composio.dev/docs/sessions-vs-direct-execution#next)
