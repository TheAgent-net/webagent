---
url: https://docs.composio.dev/kb/guide/toolkits-github
title: GitHub (/kb/guide/toolkits-github)
description: 
status: 200
---

# GitHub (/kb/guide/toolkits-github)

## GitHub V2 triggers do not require creating a webhook endpoint first [#github-v2-triggers-do-not-require-creating-a-webhook-endpoint-first]

GitHub V2 trigger setup does not require a separate webhook endpoint creation step. The webhook URL is automatically provisioned when the trigger instance is created. Skip the `/webhook_endpoints` call and create or update the trigger directly through `/trigger_instances/{slug}/upsert`.

## List GitHub organizations and repositories for the authenticated user [#list-github-organizations-and-repositories-for-the-authenticated-user]

Use `GITHUB_LIST_ORGANIZATIONS_FOR_THE_AUTHENTICATED_USER` to list organizations available to the authenticated GitHub user. Then use `GITHUB_LIST_ORGANIZATION_REPOSITORIES` to list repositories for a selected organization. During connection, the user should be able to choose the organization they want to grant access to.

## GitHub connected-account tokens are redacted from API responses [#github-connected-account-tokens-are-redacted-from-api-responses]

Provider tokens are redacted from connected-account API responses for both Composio-managed and customer-owned auth configs. Use Composio tool execution or Proxy Execute when a workflow needs to call GitHub; do not build a flow that reads the OAuth token from connected-account data.

## GitHub organization access can require approval from an organization owner [#github-organization-access-can-require-approval-from-an-organization-owner]

If a GitHub connection works for personal repositories but cannot access an
organization, check whether that organization restricts OAuth app access. The
user can open GitHub **Settings → Applications → Authorized OAuth Apps**, select
the OAuth app, and request access for the organization. An organization owner
must approve the request in GitHub; reconnecting in Composio does not bypass the
organization's policy.

GitHub documents the member request flow at
[https://docs.github.com/en/account-and-profile/how-tos/organization-membership/requesting-organization-approval-for-oauth-apps](https://docs.github.com/en/account-and-profile/how-tos/organization-membership/requesting-organization-approval-for-oauth-apps)
and the owner approval flow at
[https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization](https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization).

## Session-level tool allowlists are enforced server-side at execution time [#session-level-tool-allowlists-are-enforced-server-side-at-execution-time]

Session-level restrictions are enforced server-side at execution time. When a session is configured with `toolkits`, `tools`, or `tags`, every execution request is validated against the enabled or disabled toolkit list, per-toolkit tool list, and tag filters. Disabled tools are filtered from search results, and execution is blocked before the provider API call if the tool fails validation.

## Use custom OAuth credentials for branded GitHub consent and redirect flows [#use-custom-oauth-credentials-for-branded-github-consent-and-redirect-flows]

Composio supports white-labeling the hosted auth page by customizing the logo and app name in Project Settings > Auth Screen. For provider OAuth consent screens such as GitHub, use your own OAuth app credentials so the provider consent screen shows your brand instead of Composio's shared OAuth app. Redirect URLs can also be routed through your own domain so users do not see a Composio domain during the redirect path.

---

📚 **More documentation:** [View all docs](https://docs.composio.dev/llms.txt) | [Glossary](https://docs.composio.dev/llms.mdx/reference/glossary) | [Examples](https://docs.composio.dev/llms.mdx/examples) | [API Reference](https://docs.composio.dev/llms.mdx/reference)

---

# Composio SDK — Notes for AI Code Generators

**Purpose:** Reference for generating current (v3) [Composio](https://composio.dev/) integration code.
**Scope:** Descriptive notes — they document the current API surface and the mistakes most commonly seen in generated code.

---

## 1. Recommended Integration: Sessions

Composio supports two integration modes: **Native Tools** (with a provider package) and **MCP** (no provider package needed).

### Native Tools

```python
# ✅ CORRECT — Python (defaults to OpenAI)
from composio import Composio

composio = Composio()
session = composio.create(user_id="user_123")
tools = session.tools()
# Pass tools to your agent/LLM framework
```

```typescript
// ✅ CORRECT — TypeScript (defaults to OpenAI)
import { Composio } from "@composio/core";

const composio = new Composio();
const session = await composio.create("user_123");
const tools = await session.tools();
// Pass tools to your agent/LLM framework
```

For other providers, pass the provider explicitly. Provider packages follow the naming convention: `composio_<provider>` for Python, `@composio/<provider>` for TypeScript.

### MCP

Use `session.mcp.url` and `session.mcp.headers` with any MCP-compatible client (Claude Desktop, Cursor, OpenAI Agents, etc.). No provider package needed.

---

## 2. Integration Notes

- `composio.create(user_id)` is the standard entry point for agent integrations. Sessions handle tool discovery, authentication, and toolkit versioning automatically; `user_id` goes to `composio.create()` — individual tool calls in session mode don't take one.
- Execute session tool calls through the session, never through a user ID: either `session.execute(tool_slug, arguments=...)` / `session.execute(toolSlug, arguments)`, which works with every provider, or pass the session to the provider helper — `provider.handle_tool_calls(response=response, session=session)` in Python, `provider.handleToolCalls(session, response)` in TypeScript. Only the OpenAI and Anthropic helpers accept a session; with other providers, use `session.execute()`. Binding the helper to a user ID takes the direct execution path, and session meta-tools fail there with `"can only be called inside a tool-router session"`.
- Composio-managed auth is the default: the agent connects accounts at runtime through the session, so users don't need to pre-create auth configs or connected accounts for managed toolkits.
- Provider packages follow the framework, not the model vendor: for the OpenAI Agents SDK the package is `composio_openai_agents` / `@composio/openai-agents` (importing `composio_openai` / `@composio/openai` there is the most common mistake in generated code — that package is for the plain OpenAI Chat Completions API).
- **Direct execution** (`composio.tools.get()`, `composio.tools.execute()`, `provider.handle_tool_calls()` with a user ID) is a fully supported lower-level interface: your code picks the tool, no runtime discovery. It fits deterministic workflows and scripts; sessions fit agents that decide at runtime. The tradeoffs are documented at https://docs.composio.dev/docs/sessions-vs-direct-execution. Note that direct execution requires a toolkit version (https://docs.composio.dev/docs/tools-direct/toolkit-versioning).

---

# 3. Calling the REST API directly

## REST API version

The current REST API version is **v3.1**, served at `https://backend.composio.dev/api/v3.1`. Prefer it for new code and new examples.

`https://backend.composio.dev/api/v3` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.

## Tool-endpoint version defaults on v3.1

On v3.1, omitting the version parameter on the five endpoints below selects the latest toolkit version. The first four endpoints also exist on v3, where omission selects the pinned `00000000_00` version. `POST /tools/scopes/required` is v3.1-only.

| Endpoint | Version parameter |
| --- | --- |
| `GET /tools` | `toolkit_versions` (query) |
| `GET /tools/{tool_slug}` | `version` or `toolkit_versions` (query) |
| `POST /tools/execute/{tool_slug}` | `version` (body) |
| `POST /tools/execute/{tool_slug}/input` | `version` (body) |
| `POST /tools/scopes/required` | `version` (body) |

A v3.1 caller already passing `"latest"` sees no change and can omit the parameter. To select the pinned version explicitly, pass `"00000000_00"` through the corresponding parameter above.

This version-default change is limited to the five endpoints above.


---

## Terminology Migration (old → current)

If you encounter these terms in error messages, old documentation, or user prompts, translate them to the current equivalents. **Do not use the old terms in generated code or explanations.**

| Old term (v1/v2) | Current term (v3) | In code |
|---|---|---|
| entity ID | user ID | `user_id` parameter |
| actions | tools | e.g., `GITHUB_CREATE_ISSUE` is a *tool* |
| apps / appType | toolkits | e.g., `github` is a *toolkit* |
| integration / integration ID | auth config / auth config ID | `auth_config_id` parameter |
| connection | connected account | `connected_accounts` namespace |
| ComposioToolSet / OpenAIToolSet | `Composio` class with a provider | `Composio(provider=...)` |
| toolset | provider | e.g., `OpenAIProvider` |

If a user says "entity ID", they mean `user_id`. If they say "integration", they mean "auth config". Always respond using the current terminology.
