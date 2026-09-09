---
url: https://docs.composio.dev/kb/guide/toolkits-gmail.md
title: https://docs.composio.dev/kb/guide/toolkits-gmail.md
description: 
status: 200
---

\# Gmail (/kb/guide/toolkits-gmail)

Use this guide to configure Gmail authentication, send and fetch messages, work with attachments and labels, and set up new-message triggers.

\## Configure Gmail OAuth, scopes, and toolkit versions \[#configure-gmail-oauth-scopes-and-toolkit-versions\]

\*\*Use \`latest\` or v3.1 for newer Gmail settings tools.\*\* The v3 execute endpoint can default to base toolkit version \`00000000\_00\` when no version is specified. For newer Gmail tools like \`GMAIL\_PATCH\_SEND\_AS\`, \`GMAIL\_LIST\_SEND\_AS\`, and \`GMAIL\_GET\_VACATION\_SETTINGS\`, pass \`version: "latest"\` in the execute body or use the v3.1 endpoint, which defaults to latest.

\*\*Create the auth config before initiating a connection.\*\* Create the Gmail auth config first with the custom OAuth credentials, then initiate a connected account using that auth config. The callback URL is supplied during connection initiation, while the OAuth client ID/secret and redirect URI live on the auth config.

\*\*Choose scopes based on the actions and data required.\*\* When creating the Gmail auth config, pass the desired Gmail scopes in \`credentials.scopes\`, typically as a comma-joined string. Example scopes include \`gmail.send\`, \`gmail.readonly\`, \`gmail.compose\`, \`gmail.modify\`, and \`gmail.labels\`.

Gmail filter creation maps to the Gmail API \`users.settings.filters.create\` endpoint: \`POST /gmail/v1/users/{userId}/settings/filters\`. Google lists \`https://www.googleapis.com/auth/gmail.settings.basic\` as the required OAuth scope for this endpoint, and the current Composio \`GMAIL\_CREATE\_FILTER\` action declares the same single required scope. Google must approve this scope for the OAuth app used by the connection. If the consent screen blocks an unverified scope, use an OAuth app that is verified for \`gmail.settings.basic\` and reconnect.

\`https://www.googleapis.com/auth/gmail.send\` can send messages, but it is a granular sensitive scope and requires Google verification. The broader \`https://mail.google.com/\` scope gives full mailbox access and can cover send use cases, but it is broader than many customers want.

The Gmail metadata scope cannot be used when requesting full email content. Remove \`https://www.googleapis.com/auth/gmail.metadata\` and use a scope that allows message content access, such as \`https://mail.google.com/\`, when full payload/body data is needed.

\*\*Use Google Super for one Google connection across services.\*\* Google Super owns the canonical multi-service authentication guidance. See \[Google Super is a unified Google Workspace toolkit\](/kb/guide/toolkits-googlesuper).

\## Address and send Gmail messages \[#address-and-send-gmail-messages\]

\*\*Use \`me\` for the authenticated user.\*\* For Gmail tool calls, \`me\` can be used as the \`user\_id\` to refer to the authenticated connected account.

\*\*Provide at least one recipient channel.\*\* \`GMAIL\_SEND\_EMAIL\` no longer needs a single required recipient field. At least one recipient channel such as \`to\` / \`recipient\_email\`, \`cc\`, or \`bcc\` can be supplied, which keeps the tool flexible for different email composition flows.

For hosted MCP / Tool Router calls through \`COMPOSIO\_MULTI\_EXECUTE\_TOOL\`, put recipient fields inside the nested tool \`arguments\` object. Prefer \`recipient\_email\` for the first To recipient and \`extra\_recipients\` for additional To recipients unless the current schema explicitly exposes another shape.

If the connection is active but the action returns \`At least one of 'to' (or 'recipient\_email'), 'cc', or 'bcc' must be provided\`, the tool did not receive a recipient channel and failed before Gmail API execution. Retry with the exact nested \`recipient\_email\` shape; if it still fails, provide a fresh request ID for investigation.

\*\*Select a send-as alias with \`from\_email\`.\*\* Use the \`from\_email\` parameter on \`GMAIL\_SEND\_EMAIL\` to choose the Gmail send-as alias.

\## Send attachments safely \[#send-attachments-safely\]

\*\*Upload files before tool execution.\*\* Temporary S3/file instances are short-lived. Use \`files.upload\` before tool execution via the SDK or MCP flow, then pass the resulting \`FileUploadable\`/uploaded file object to the agent/tool call.

\*\*Verify a timed-out send before retrying.\*\* \`GMAIL\_SEND\_EMAIL\` accepts attachments as uploaded Composio file references, not signed URLs or JSON strings. The action downloads the uploaded file, builds the MIME message, base64-url encodes it, and posts it to Gmail. Attachment sends can therefore take materially longer than small text-only sends.

Current Python and TypeScript SDKs do not automatically retry non-idempotent tool executions. However, a client timeout can still occur after Gmail accepted the message. If \`GMAIL\_SEND\_EMAIL\` hangs or creates duplicate sends with attachments:

\\* If the log is a fast 400 validation error, verify the \`attachment\` argument is an object/list with \`name\`, \`mimetype\`, and \`s3key\`.
\\* If the client timed out, inspect the Composio execution log or Gmail Sent folder before retrying manually.
\\* If the client is older than Python SDK 0.16.0 or TypeScript SDK 0.14.0, upgrade before investigating SDK-level automatic retries.

\## Fetch messages and manage labels \[#fetch-messages-and-manage-labels\]

\*\*Reduce fetch payload size.\*\* For Gmail fetch/list flows, set \`include\_payload=false\` and \`verbose=false\` where supported. For very lightweight flows, use \`only\_ids=true\` and then fetch selected messages separately. Also use \`max\_results\` and Gmail \`query\` filters to keep result sets small.

\*\*Use label IDs for label operations.\*\* For Gmail label operations and trigger label filters that require IDs, pass the label ID rather than the display name. Use \`GMAIL\_LIST\_LABELS\` to retrieve IDs.

\*\*Use accepted Gmail color values when patching labels.\*\* To patch a label color, use the label ID and pass background color as an object field such as \`{ "background\_color": "#FFFF0000" }\`. Gmail only accepts specific label color values from the Gmail API reference.

\## Configure Gmail new-message trigger filters \[#configure-gmail-new-message-trigger-filters\]

Use a Gmail query such as \`label:sent OR label:category\_personal\` to filter matching messages. This avoids depending on label IDs for that trigger path.

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
