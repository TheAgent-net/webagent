---
url: https://docs.composio.dev/kb/guide/faqs.md
title: https://docs.composio.dev/kb/guide/faqs.md
description: 
status: 200
---

# Current Support FAQs (/kb/guide/faqs)

## Request a toolkit, tool, trigger, or partnership [#request-a-toolkit-tool-trigger-or-partnership]

The same public request board covers all three request types:

* a new toolkit or integration;
* a missing tool or action in an existing toolkit;
* a missing trigger or event in an existing toolkit.

Submit any of these requests at [https://request.composio.dev/boards/tool-requests](https://request.composio.dev/boards/tool-requests). Include the provider or toolkit, the exact tool/action/API endpoint or trigger/event, and your use case. The request board is the source of truth for status; an ETA is not guaranteed.

If your company wants its own product added to Composio, apply with a company
work email and product details at [https://composio.dev/partnerships#apply](https://composio.dev/partnerships#apply). The
public partnership form asks for company, product, and proposed-journey context.

## Security, privacy, data-retention, and compliance information [#security-privacy-data-retention-and-compliance-information]

Use [https://trust.composio.dev/](https://trust.composio.dev/) for general security, privacy, data-retention, audit, and compliance information. If the Trust Center does not answer your question, contact Composio support. Use the documented Dashboard self-service path for ordinary organization deletion. Report potential vulnerabilities privately through the security-reporting channels below; direct legal requests, data-erasure requests beyond the self-service flow, and account-specific access questions to Composio support.

## Security reporting [#security-reporting]

If you believe you have found a potential security vulnerability in Composio,
please report it privately through the channels in our
[security policy](https://github.com/ComposioHQ/composio/security/policy). A
private GitHub Security Advisory is the preferred route, with
`security@composio.dev` available as an email alternative.

Include enough detail to help the team reproduce and assess the finding, but do
not include customer data, credentials, or other secrets.

## Google `access_not_configured` requires a Workspace for Education administrator [#google-access_not_configured-requires-a-workspace-for-education-administrator]

Google documents `400 access_not_configured` as a Workspace for Education app
access-policy error. The institution's Workspace administrator must configure
access for the app; changing Composio scopes or repeatedly reconnecting does not
resolve that policy decision.

If the organization allows users to request access, the user can submit the
request from Google's error page. An administrator with the required Security
settings privilege can review pending requests or configure the exact OAuth
client under **Security → Access and data control → API controls → Manage
App Access**. The administrator should use the access level and organizational
unit appropriate for the institution. Google says policy changes can take up to
24 hours, though they usually apply sooner.

Do not generalize this code to every Google Workspace account. Distinguish it
from `admin_policy_enforced`, `access_denied`, and unverified-app errors before
giving instructions.

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
