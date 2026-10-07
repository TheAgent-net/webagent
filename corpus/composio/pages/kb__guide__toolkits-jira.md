---
url: https://docs.composio.dev/kb/guide/toolkits-jira
title: Jira (/kb/guide/toolkits-jira)
description: 
status: 200
---

# Jira (/kb/guide/toolkits-jira)

## Keep Jira OAuth scopes within Atlassian's supported set [#keep-jira-oauth-scopes-within-atlassians-supported-set]

Jira/Atlassian limits an OAuth app to 50 scopes, and unsupported or mismatched scopes can make consent fail. For a customer-owned app, keep the auth config aligned with the scopes approved on that Atlassian app. Diagnose current managed-auth failures from the current consent error and auth config rather than from previously resolved scope behavior.

## Pin custom Jira authConfig when creating Tool Router sessions [#pin-custom-jira-authconfig-when-creating-tool-router-sessions]

When using a custom Jira OAuth app with Tool Router, pass the custom auth config while creating the session. If the session does not specify the Jira auth config, Tool Router can fall back to an auto-generated/default Jira config and fail to see the customer's active custom-auth connections. Pin the active BYOA config, for example `auth_configs: { jira: "<auth_config_id>" }`, so Tool Router resolves the intended Jira connected accounts.

## Jira custom token execution needs the Atlassian base URL/subdomain [#jira-custom-token-execution-needs-the-atlassian-base-urlsubdomain]

Jira expects the tenant URL in the form `https://<subdomain>.atlassian.net`. Supply the `subdomain` when initiating the connected account for OAuth2, API-key, or S2S OAuth2 auth. `JIRA_GET_SERVER_INFO` can help confirm the base URL. Do not rely on the old SDK workaround that injected a raw access token through `customConnectionData`.

## Jira search pagination tokens returned by current tools preserve search context [#jira-search-pagination-tokens-returned-by-current-tools-preserve-search-context]

Current Jira search tools wrap provider pagination tokens with the original search context. Pass the `next_page_token` returned by the same Composio action directly to its next call. If a caller instead supplies a raw Jira `nextPageToken`, it must also supply the original JQL.

Workaround:

* Do not pass a token returned by one Jira action to a different action.

* Use the token immediately for the next page.

* Do not persist old tokens or retry rejected tokens. If Jira returns `invalid or expired` even with the same original context, discard the token and restart pagination from page 1.

## Jira OAuth redirect URI must match the authConfig and Atlassian app [#jira-oauth-redirect-uri-must-match-the-authconfig-and-atlassian-app]

For Jira/Atlassian OAuth, configure the same redirect URI in both the Composio auth config and the Atlassian OAuth app. Copy the callback shown by the current auth-config flow or documentation and match it exactly. Do not reuse legacy v1 or v3 callback paths from older examples.

## Missing `audience=api.atlassian.com` can prevent Jira refresh tokens [#missing-audienceapiatlassiancom-can-prevent-jira-refresh-tokens]

Atlassian OAuth 2.0 requires `audience=api.atlassian.com` in the authorization URL. Without this parameter, Atlassian may not honor `offline_access`, meaning no refresh token is returned and the access token expires without being refreshable. If Jira credentials expire immediately, check whether the connected account is missing `offline_access` and whether the Jira OAuth config includes the required `audience` parameter. As an urgent workaround, API key auth with Atlassian email + API token can provide stable non-expiring credentials.

## Use `JIRA_GET_CREATE_METADATA_ISSUE_TYPE_FIELDS` instead of deprecated create metadata behavior [#use-jira_get_create_metadata_issue_type_fields-instead-of-deprecated-create-metadata-behavior]

Use `JIRA_GET_CREATE_METADATA_ISSUE_TYPE_FIELDS` for the closest replacement behavior to the deprecated `JIRA_GET_ISSUE_CREATE_METADATA` flow. The replacement was added after Jira deprecated the older create-metadata API behavior.

## Download Jira attachments with `JIRA_GET_ATTACHMENT` [#download-jira-attachments-with-jira_get_attachment]

Use `JIRA_GET_ATTACHMENT` to retrieve the binary content of a Jira attachment by attachment ID. This tool is intended for downloading a specific file attached to a Jira issue.

## Jira tool-call payload retention follows the project log-storage setting [#jira-tool-call-payload-retention-follows-the-project-log-storage-setting]

Composio manages Jira OAuth tokens and returns Jira API responses to the customer's application. Whether request and response payloads are retained in Composio tool logs follows the project's log-storage setting; **Don't store data** omits payload content from new log rows but preserves audit metadata. The customer's own agent or application may retain tool outputs separately.

## Jira service account use requires customer-owned credentials and scopes [#jira-service-account-use-requires-customer-owned-credentials-and-scopes]

For Jira service-account-style usage, customers should use their own credentials with the required Jira and Jira service-account scopes when no dedicated managed auth app is available for that flow.

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
