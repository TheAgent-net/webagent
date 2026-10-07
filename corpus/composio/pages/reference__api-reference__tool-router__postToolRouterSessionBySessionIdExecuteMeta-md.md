---
url: https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdExecuteMeta.md
title: https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdExecuteMeta.md
description: 
status: 200
---

\# Execute a meta tool within a tool router session

\*\*Documentation:\*\* /reference/api-reference/tool-router/postToolRouterSessionBySessionIdExecuteMeta

\> \*\*API version:\*\* This page documents Composio REST API v3.1, the current version, at \`https://backend.composio.dev/api/v3.1\`. \`https://backend.composio.dev/api/v3\` is the previous version and remains supported.

Execute a Composio meta tool (COMPOSIO\_\*) within an existing tool router session.

\-\-\-

\## POST \`/api/v3.1/tool\_router/session/{session\_id}/execute\_meta\`

\*\*Endpoint:\*\* \`https://backend.composio.dev/api/v3.1/tool\_router/session/{session\_id}/execute\_meta\`

\*\*Summary:\*\* Execute a meta tool within a tool router session

Execute a Composio meta tool (COMPOSIO\_\*) within an existing tool router session.

\### Authentication

\*\*ApiKeyAuth\*\* - API Key in \`header\` header \`x-api-key\`

\### Path Parameters

\- \`session\_id\` (string (toolRouterSessionId)) \*(required)\*: Tool router session ID (required for public API, optional for internal - injected by middleware)

\### Request Body

\*\*Schema:\*\*

\- \`slug\` (enum: "COMPOSIO\_SEARCH\_TOOLS" \| "COMPOSIO\_MULTI\_EXECUTE\_TOOL" \| "COMPOSIO\_MANAGE\_CONNECTIONS" \| ...) \*(required)\*: The unique slug identifier of the meta tool to execute
\- \`arguments\` (object): The arguments required by the meta tool
 \- \`\[key: string\]\` (any)
\- \`experimental\` (object): Inline custom tools and toolkits for this request. v3.1 sessions do not persist customs — pass them on every request that needs them.
 \- \`custom\_toolkits\` (array): Custom toolkits with grouped tools. Toolkit slugs must not conflict with existing Composio toolkits. All tools are no-auth.
 \- Array items:
 \- \`slug\` (string) \*(required)\*: Unique slug for the toolkit. Must not conflict with existing Composio toolkit slugs. Alphanumeric, underscores, and hyphens only.
 \- \`name\` (string) \*(required)\*: Display name shown to the LLM and in search results.
 \- \`description\` (string) \*(required)\*: Used for BM25 search matching and shown in toolkit connection statuses.
 \- \`preload\` (boolean): SDK hint for direct custom-tool exposure. Not stored in session config; echoed in create/attach responses for inline custom definitions.
 \- \`tools\` (array) \*(required)\*: Tools in this custom toolkit
 \- Array items:
 \- ...
 \- \`custom\_tools\` (array): Custom tools to include in search. Standalone tools need no auth. Tools with extends\_toolkit inherit the Composio toolkit's connection.
 \- Array items:
 \- \`slug\` (string) \*(required)\*: Tool slug. Forms LOCAL\_ (standalone) or LOCAL\_\_ (extending). Max 60 chars total.
 \- \`name\` (string) \*(required)\*: Human-readable display name
 \- \`description\` (string) \*(required)\*: Used for BM25 search matching and shown to the LLM.
 \- \`input\_schema\` (object) \*(required)\*: Must have type: "object" and a properties field.
 \- \`\[key: string\]\` (any)
 \- \`output\_schema\` (object): JSON Schema describing tool output (optional)
 \- \`\[key: string\]\` (any)
 \- \`extends\_toolkit\` (string): If set, must be a valid Composio toolkit slug. The tool inherits that toolkit's auth/connection status. If omitted, the tool is standalone (no-auth).
 \- \`preload\` (boolean): SDK hint for direct custom-tool exposure. Not stored in session config; echoed in create/attach responses for inline custom definitions.

\*\*Example:\*\*

\`\`\`json
{
 "slug": "COMPOSIO\_SEARCH\_TOOLS",
 "arguments": {},
 "experimental": {
 "custom\_toolkits": \[\
 {\
 "slug": "...",\
 "name": "...",\
 "description": "...",\
 "preload": "...",\
 "tools": "..."\
 }\
 \],
 "custom\_tools": \[\
 {\
 "slug": "...",\
 "name": "...",\
 "description": "...",\
 "input\_schema": "...",\
 "output\_schema": "...",\
 "extends\_toolkit": "...",\
 "preload": "..."\
 }\
 \]
 }
}
\`\`\`

\### Responses

\#### 200 - Successfully executed the meta tool. Returns execution result, logs, and status.

\*\*Response Schema:\*\*

\- \`data\` (object) \*(required)\*: The data returned by the tool execution
 \- \`\[key: string\]\` (any)
\- \`error\` (string,null) \*(required)\*: Error message if the execution failed, null otherwise
\- \`log\_id\` (string) \*(required)\*: Unique identifier for the execution log

\*\*Example Response:\*\*

\`\`\`json
{
 "data": {
 "key": null
 },
 "error": null,
 "log\_id": "string"
}
\`\`\`

\#### 400 - Bad request

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 401 - Unauthorized

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 403 - Forbidden

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 404 - Not found

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 413 - Payload too large

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 429 - Too many requests

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 500 - Internal server error

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 502 - Bad gateway

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\### Example cURL Request

\`\`\`bash
curl -X POST "https://backend.composio.dev/api/v3.1/tool\_router/session/string/execute\_meta" \
 -H "x-api-key: YOUR\_API\_KEY" \
 -H "Content-Type: application/json" \
 -d '{
 "slug": "COMPOSIO\_SEARCH\_TOOLS",
 "arguments": {},
 "experimental": {
 "custom\_toolkits": \[\
 {\
 "slug": "...",\
 "name": "...",\
 "description": "...",\
 "preload": "...",\
 "tools": "..."\
 }\
 \],
 "custom\_tools": \[\
 {\
 "slug": "...",\
 "name": "...",\
 "description": "...",\
 "input\_schema": "...",\
 "output\_schema": "...",\
 "extends\_toolkit": "...",\
 "preload": "..."\
 }\
 \]
 }
 }'
\`\`\`

\-\-\-

\## REST API version

The current REST API version is \*\*v3.1\*\*, served at \`https://backend.composio.dev/api/v3.1\`. Prefer it for new code and new examples.

\`https://backend.composio.dev/api/v3\` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.
