---
url: https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions
title: Migrating from MCP servers to Sessions | Composio
description: Move from per-toolkit MCP server configs to the sessions paradigm
status: 200
---

[Migration guides](https://docs.composio.dev/docs/migration-guide)

Written June 2026

# Migrating from MCP servers to Sessions

Copy page

This guide is for developers using Composio's **MCP servers** (`composio.mcp.create` /
`composio.mcp.generate`, the "Single Toolkit MCP" flow) who want to migrate to **sessions**.

Sessions are the next generation of the same idea: you still get an MCP URL that any MCP-compatible
client connects to — but instead of standing up and managing a separate server config per toolkit,
you create a session that handles tool discovery, authentication, context, and versioning for you.

Starting fresh? Skip this guide and read [Configuring Sessions](https://docs.composio.dev/docs/configuring-sessions).

Just connecting apps to your own agent for personal use — not building an app? You don't need the
SDK. Use **Composio For You** to connect across 1000+ apps in a few clicks — switch to it from the
product switcher in the top-left of the dashboard. Reserve `session.mcp.url` for programmatic,
in-app use.

## [What carries over (you keep all of this)](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions\#what-carries-over-you-keep-all-of-this)

- **Your tools** — every tool you exposed on a server is available in a session.
- **Your auth configs and connected accounts** — pass the same `ac_…` IDs; your users **do not**
**re-authenticate**.
- **The MCP URL pattern** — you still get a URL (`session.mcp.url`) that plugs into your agent — any
MCP-compatible client — the same way, the same protocol.
- **Per-user isolation** — still keyed by `user_id`.
- **Tool restriction** — you can still pin a session to an exact, fixed tool list (see Step 3).

## [What changes](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions\#what-changes)

|  | MCP servers (today) | Sessions |
| --- | --- | --- |
| **Setup** | Create + manage a server config per toolkit (`composio.mcp.create`) | One `composio.create(user_id)` — no server object to manage |
| **Get a URL** | `composio.mcp.generate(user_id, mcp_config_id)` → `instance.url` | `session.mcp.url` |
| **Tools** | Fixed `allowed_tools` list, baked into the server | Dynamic discovery by default, **or** a fixed list (direct-tools preset) — your choice |
| **Multiple toolkits** | One server per toolkit | One session spans many toolkits |
| **Context** | All allowed tools always loaded | Managed — search/preload keep the agent's context lean |
| **Versioning** | Manual | Handled automatically |
| **Auth** | Pre-authenticate, then generate | Carries over; in-chat auth available, or `session.authorize()` |

The _why_: a session is one managed endpoint that replaces N static server configs, gives the agent
runtime tool discovery, and keeps context small — without losing the fixed-tool-list behavior you
have today if that's what you want.

## [Migrating](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions\#migrating)

Replace the server config + generate with a session

The two-step "create a server, then generate a per-user URL" collapses into a single
`composio.create(...)`. Pass the **same** toolkit, auth config, and tool list you had on the server.

PythonTypeScript

```
from composio import Composio

composio = Composio(api_key="YOUR_API_KEY")

# Before: create a server config, then generate a per-user URL
# server = composio.mcp.create(
#     name="my-gmail-server",
#     toolkits=[{"toolkit": "gmail", "auth_config": "ac_xyz123"}],
#     allowed_tools=["GMAIL_FETCH_EMAILS", "GMAIL_SEND_EMAIL"],
# )
# instance = composio.mcp.generate(user_id="user-123", mcp_config_id=server.id)
# mcp_url = instance["url"]

# After: one session, same toolkit + auth config + tools
session = composio.create(
    user_id="user-123",
    toolkits=["gmail"],
    auth_configs={"gmail": "ac_xyz123"},
    tools={"gmail": {"enable": ["GMAIL_FETCH_EMAILS", "GMAIL_SEND_EMAIL"]}},
    mcp=True,
)
mcp_url = session.mcp.url
```

Same `user_id` \+ same auth config → existing connected accounts are picked up automatically. No
re-auth.

Point your MCP client at the new URL

Swap the generated server URL for `session.mcp.url` wherever your agent connects. Nothing else about
the client changes.

```
# Before: https://backend.composio.dev/v3/mcp/<SERVER_ID>?user_id=<USER_ID>
# After:  session.mcp.url
```

Keep an exact, fixed tool list (optional — closest 1:1 with your server)

By default a session gives the agent **dynamic** tool discovery (meta-tools). If you want the _same_
_static behavior_ as your old server — a fixed set of tools, no discovery — add the **direct-tools**
**preset**. This preloads exactly the tools you enable and turns meta-tools off.

PythonTypeScript

```
from composio import Composio, SESSION_PRESET_DIRECT_TOOLS

session = composio.create(
    user_id="user-123",
    toolkits=["gmail"],
    auth_configs={"gmail": "ac_xyz123"},
    tools={"gmail": {"enable": ["GMAIL_FETCH_EMAILS", "GMAIL_SEND_EMAIL"]}},
    session_preset=SESSION_PRESET_DIRECT_TOOLS,
)
```

Leave the preset off to get the upgrade: the agent discovers and loads tools at runtime, so you can
span many toolkits without bloating context.

## [Beyond the MCP URL](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions\#beyond-the-mcp-url)

A session isn't only an MCP endpoint — it's also a normal SDK object, which is handy for non-agent
code paths.

### [Native tools for your framework](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions\#native-tools-for-your-framework)

`session.tools()` returns provider-wrapped native tools for OpenAI, Anthropic, LangChain, the Vercel
AI SDK, and others, so you skip manual schema wiring. With the direct-tools preset it returns your
exact fixed tool set; by default it returns the meta-tools that drive runtime discovery.

PythonTypeScript

```
tools = session.tools()
```

### [Execute a tool without an LLM](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions\#execute-a-tool-without-an-llm)

For a deterministic, non-agent path, call a tool directly on the session.

PythonTypeScript

```
result = session.execute(
    "GITHUB_CREATE_ISSUE",
    arguments={"owner": "my-org", "repo": "my-repo", "title": "Fix login bug"},
)
```

## [Things to know](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions\#things-to-know)

- **Multiple toolkits on one endpoint** — where you ran several single-toolkit servers, one session
spans them all (`toolkits=["gmail", "slack", "github"]`). Fewer moving parts.
- **Reuse one session — don't create one per request** — sessions persist and are reusable. Create a
session once and keep using it across calls; see [Configuring Sessions](https://docs.composio.dev/docs/configuring-sessions).
- **Sharing one account across users** — sessions support **shared connections**
(`account_type:"SHARED"` \+ an allow/deny ACL), pinned per session. See
[Shared connections](https://docs.composio.dev/docs/extending-sessions/shared-connections).
- **Tenant-specific params** (SharePoint sub-site, Jira subdomain) — prefill them via shared
credentials on the auth config.
- **White-labeling carries over** — pass the same white-labeled auth config IDs; users keep seeing
your branding on consent screens. See [White-labeling authentication](https://docs.composio.dev/docs/authentication/white-labeling-authentication).
- **Triggers** — unchanged; continue using `composio.triggers.*` and webhooks (triggers aren't part
of sessions yet).
- **Dashboard** — sessions are created via the SDK. For no-code, personal app connections, use
**Composio For You** — reachable from the product switcher in the top-left of the dashboard.

## [Next](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions\#next)

[**Configuring Sessions** \\
Toolkits, auth configs, account selection, presets, and session methods](https://docs.composio.dev/docs/configuring-sessions)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/migration-guide/mcp-servers-to-sessions.mdx)

### On this page

[What carries over (you keep all of this)](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions#what-carries-over-you-keep-all-of-this) [What changes](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions#what-changes) [Migrating](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions#migrating) [Beyond the MCP URL](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions#beyond-the-mcp-url) [Native tools for your framework](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions#native-tools-for-your-framework) [Execute a tool without an LLM](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions#execute-a-tool-without-an-llm) [Things to know](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions#things-to-know) [Next](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions#next)
