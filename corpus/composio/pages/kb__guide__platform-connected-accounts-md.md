---
url: https://docs.composio.dev/kb/guide/platform-connected-accounts.md
title: https://docs.composio.dev/kb/guide/platform-connected-accounts.md
description: 
status: 200
---

\# Connected Accounts (/kb/guide/platform-connected-accounts)

Use this for Composio connected-account status, refresh, and identity debugging.

\## Prefer a new auth link session when a user must reconnect \[#prefer-a-new-auth-link-session-when-a-user-must-reconnect\]

Create a new auth link session when a user must authenticate again. Redirect the user to the returned hosted link and wait for the resulting connected account to become active. The older \`POST /connected\_accounts/{nanoid}/refresh\` re-initiation endpoint is deprecated; it did not perform Composio's internal background token refresh.

If the user completes that auth flow successfully, the connected account can return to \`ACTIVE\`.

Example response:

\`\`\`text
This starts a new authentication flow. For OAuth connections, the user must open the hosted link and complete provider consent. Once the OAuth flow succeeds, use the newly active connected account.
\`\`\`

\## Same user ID does not prove same upstream account \[#same-user-id-does-not-prove-same-upstream-account\]

Do not assume multiple connected accounts under the same \`clientUniqueUserId\` are duplicates of the same upstream account. A single Composio user ID can legitimately connect personal, work, and business accounts.

If the root-cause hypothesis depends on repeated reconnects to the same upstream Google/Microsoft/etc. account, verify the upstream identity first. Use a safe profile/current-user action for each connected account, customer-provided labels, or another non-sensitive identity signal.

\## Hosted connect links expire after 10 minutes \[#hosted-connect-links-expire-after-10-minutes\]

A hosted connect link/session is short-lived. If the initial authentication flow is not completed within 10 minutes, the link can show wording such as “We couldn't verify the session associated with the link” or “Validation error while processing request.” The dashboard may briefly continue to show the connection as initializing.

Generate a fresh connect link for the same user and open it immediately. If the new link also fails immediately, contact Composio support with its generation timestamp and the exact error. Do not keep retrying an older link.

\## Connection status describes a lifecycle, not credential validity \[#connection-status-describes-a-lifecycle-not-credential-validity\]

\\* \`INITIALIZING\`: the connection row and hosted flow were created.
\\* \`INITIATED\`: the user opened or advanced the authentication flow.
\\* \`ACTIVE\`: the connection flow completed and its credential data was stored.
\\* \`EXPIRED\`: the flow timed out or the connection can no longer refresh/use its authorization. Read \`statusReason\` to distinguish those cases.

\`Connection initiation did not complete within 10 minutes\` means the original flow timed out; it is not a background token-refresh failure. Generate a fresh link and wait for \`ACTIVE\` before treating its connected-account ID as usable.

\## OAuth refresh failures have multiple causes \[#oauth-refresh-failures-have-multiple-causes\]

An OAuth connection may expire when the provider rejects its refresh token, the user or admin revokes the app, provider security policy invalidates the grant, a rotating-token chain is interrupted, or customer-owned OAuth credentials change. Reconnecting obtains a new grant. If connections repeatedly expire across users, contact Composio support with redacted connection IDs and timestamps instead of repeatedly reconnecting.

\## Provider tokens are redacted from connected-account responses \[#provider-tokens-are-redacted-from-connected-account-responses\]

Connected-account APIs do not return raw access or refresh tokens. Use Composio
tool execution or \[Proxy Execute\](https://docs.composio.dev/docs/proxy-execute)
when a workflow needs to call a provider API through an existing connection. Do
not build a workflow that depends on reading provider tokens from connected-
account data.

\## Revoke provider credentials before removing a connection when required \[#revoke-provider-credentials-before-removing-a-connection-when-required\]

Use the connected-account revoke operation when the toolkit supports
programmatic provider revocation. When provider-side revocation is unavailable,
remove Composio's access in the provider's connected-app settings or rotate the
API key in the provider dashboard. Never send access tokens, refresh tokens, API
keys, or private-key material to Composio support.

\-\-\-

📚 \*\*More documentation:\*\* \[View all docs\](https://docs.composio.dev/llms.txt) \| \[Glossary\](https://docs.composio.dev/llms.mdx/reference/glossary) \| \[Examples\](https://docs.composio.dev/llms.mdx/examples) \| \[API Reference\](https://docs.composio.dev/llms.mdx/reference)

\-\-\-

\# Composio SDK — Notes for AI Code Generators

\*\*Purpose:\*\* Reference for generating current (v3) \[Composio\](https://composio.dev/) integration code.
\*\*Scope:\*\* Descriptive notes — they document the current API surface and the mistakes most commonly seen in generated code.

\-\-\-

\## 1\. Recommended Integration: Sessions

Composio supports two integration modes: \*\*Native Tools\*\* (with a provider package) and \*\*MCP\*\* (no provider package needed).

\### Native Tools

\`\`\`python
\# ✅ CORRECT — Python (defaults to OpenAI)
from composio import Composio

composio = Composio()
session = composio.create(user\_id="user\_123")
tools = session.tools()
\# Pass tools to your agent/LLM framework
\`\`\`

\`\`\`typescript
// ✅ CORRECT — TypeScript (defaults to OpenAI)
import { Composio } from "@composio/core";

const composio = new Composio();
const session = await composio.create("user\_123");
const tools = await session.tools();
// Pass tools to your agent/LLM framework
\`\`\`

For other providers, pass the provider explicitly. Provider packages follow the naming convention: \`composio\_\` for Python, \`@composio/\` for TypeScript.

\### MCP

Use \`session.mcp.url\` and \`session.mcp.headers\` with any MCP-compatible client (Claude Desktop, Cursor, OpenAI Agents, etc.). No provider package needed.

\-\-\-

\## 2\. Integration Notes

\- \`composio.create(user\_id)\` is the standard entry point for agent integrations. Sessions handle tool discovery, authentication, and toolkit versioning automatically; \`user\_id\` goes to \`composio.create()\` — individual tool calls in session mode don't take one.
\- Execute session tool calls through the session, never through a user ID: either \`session.execute(tool\_slug, arguments=...)\` / \`session.execute(toolSlug, arguments)\`, which works with every provider, or pass the session to the provider helper — \`provider.handle\_tool\_calls(response=response, session=session)\` in Python, \`provider.handleToolCalls(session, response)\` in TypeScript. Only the OpenAI and Anthropic helpers accept a session; with other providers, use \`session.execute()\`. Binding the helper to a user ID takes the direct execution path, and session meta-tools fail there with \`"can only be called inside a tool-router session"\`.
\- Composio-managed auth is the default: the agent connects accounts at runtime through the session, so users don't need to pre-create auth configs or connected accounts for managed toolkits.
\- Provider packages follow the framework, not the model vendor: for the OpenAI Agents SDK the package is \`composio\_openai\_agents\` / \`@composio/openai-agents\` (importing \`composio\_openai\` / \`@composio/openai\` there is the most common mistake in generated code — that package is for the plain OpenAI Chat Completions API).
\- \*\*Direct execution\*\* (\`composio.tools.get()\`, \`composio.tools.execute()\`, \`provider.handle\_tool\_calls()\` with a user ID) is a fully supported lower-level interface: your code picks the tool, no runtime discovery. It fits deterministic workflows and scripts; sessions fit agents that decide at runtime. The tradeoffs are documented at https://docs.composio.dev/docs/sessions-vs-direct-execution. Note that direct execution requires a toolkit version (https://docs.composio.dev/docs/tools-direct/toolkit-versioning).

\-\-\-

\# 3\. Calling the REST API directly

\## REST API version

The current REST API version is \*\*v3.1\*\*, served at \`https://backend.composio.dev/api/v3.1\`. Prefer it for new code and new examples.

\`https://backend.composio.dev/api/v3\` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.

\## Tool-endpoint version defaults on v3.1

On v3.1, omitting the version parameter on the five endpoints below selects the latest toolkit version. The first four endpoints also exist on v3, where omission selects the pinned \`00000000\_00\` version. \`POST /tools/scopes/required\` is v3.1-only.

\| Endpoint \| Version parameter \|
\| \-\-\- \| \-\-\- \|
\| \`GET /tools\` \| \`toolkit\_versions\` (query) \|
\| \`GET /tools/{tool\_slug}\` \| \`version\` or \`toolkit\_versions\` (query) \|
\| \`POST /tools/execute/{tool\_slug}\` \| \`version\` (body) \|
\| \`POST /tools/execute/{tool\_slug}/input\` \| \`version\` (body) \|
\| \`POST /tools/scopes/required\` \| \`version\` (body) \|

A v3.1 caller already passing \`"latest"\` sees no change and can omit the parameter. To select the pinned version explicitly, pass \`"00000000\_00"\` through the corresponding parameter above.

This version-default change is limited to the five endpoints above.

\-\-\-

\## Terminology Migration (old → current)

If you encounter these terms in error messages, old documentation, or user prompts, translate them to the current equivalents. \*\*Do not use the old terms in generated code or explanations.\*\*

\| Old term (v1/v2) \| Current term (v3) \| In code \|
\|---\|---\|---\|
\| entity ID \| user ID \| \`user\_id\` parameter \|
\| actions \| tools \| e.g., \`GITHUB\_CREATE\_ISSUE\` is a \*tool\* \|
\| apps / appType \| toolkits \| e.g., \`github\` is a \*toolkit\* \|
\| integration / integration ID \| auth config / auth config ID \| \`auth\_config\_id\` parameter \|
\| connection \| connected account \| \`connected\_accounts\` namespace \|
\| ComposioToolSet / OpenAIToolSet \| \`Composio\` class with a provider \| \`Composio(provider=...)\` \|
\| toolset \| provider \| e.g., \`OpenAIProvider\` \|

If a user says "entity ID", they mean \`user\_id\`. If they say "integration", they mean "auth config". Always respond using the current terminology.
