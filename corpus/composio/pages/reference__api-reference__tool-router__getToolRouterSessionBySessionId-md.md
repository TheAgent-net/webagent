---
url: https://docs.composio.dev/reference/api-reference/tool-router/getToolRouterSessionBySessionId.md
title: https://docs.composio.dev/reference/api-reference/tool-router/getToolRouterSessionBySessionId.md
description: 
status: 200
---

\# Get a tool router session by ID (v3.1)

\*\*Documentation:\*\* /reference/api-reference/tool-router/getToolRouterSessionBySessionId

\> \*\*API version:\*\* This page documents Composio REST API v3.1, the current version, at \`https://backend.composio.dev/api/v3.1\`. \`https://backend.composio.dev/api/v3\` is the previous version and remains supported.

Retrieves an existing tool router session by its ID. Returns the session configuration, MCP server URL, and available tools.

\-\-\-

\## GET \`/api/v3.1/tool\_router/session/{session\_id}\`

\*\*Endpoint:\*\* \`https://backend.composio.dev/api/v3.1/tool\_router/session/{session\_id}\`

\*\*Summary:\*\* Get a tool router session by ID (v3.1)

Retrieves an existing tool router session by its ID. Returns the session configuration, MCP server URL, and available tools.

\### Authentication

\*\*ApiKeyAuth\*\* - API Key in \`header\` header \`x-api-key\`

\### Path Parameters

\- \`session\_id\` (string (toolRouterSessionId)) \*(required)\*: The unique identifier of the tool router session

\### Responses

\#### 200 - Session successfully retrieved. Returns the session details including configuration.

\*\*Response Schema:\*\*

\- \`session\_id\` (string (toolRouterSessionId)) \*(required)\*: The identifier of the session
\- \`mcp\` (object) \*(required)\*
 \- \`type\` (enum: "http") \*(required)\*: The type of the MCP server. Can be http
 \- \`url\` (string (uri)) \*(required)\*: The URL of the MCP server
\- \`tool\_router\_tools\` (array) \*(required)\*: List of available tools in this session
\- \`config\` (object) \*(required)\*: The configuration used to create this session
 \- \`user\_id\` (string) \*(required)\*: User identifier for this session
 \- \`toolkits\` (any): Toolkit configuration - either enabled list or disabled list
 \- \`auth\_configs\` (object): Auth config overrides per toolkit
 \- \`\[key: string\]\` (string (authConfigId))
 \- \`manage\_connections\` (object): Manage connections configuration
 \- \`enabled\` (boolean): Whether to enable the connection manager for automatic connection handling
 \- \`callback\_url\` (string (uri)): Custom callback URL for connected account auth flows
 \- \`enable\_wait\_for\_connections\` (boolean): Enable the COMPOSIO\_WAIT\_FOR\_CONNECTIONS tool for polling connection status. Default false. May not work reliably with GPT models.
 \- \`enable\_connection\_removal\` (boolean): Enable the "remove" action in COMPOSIO\_MANAGE\_CONNECTIONS. Default true.
 \- \`tools\` (object): Tool-level configuration per toolkit
 \- \`\[key: string\]\` (any)
 \- \`tags\` (object): MCP tool annotation hints for filtering tools with enabled/disabled support. enabled: tags that the tool must have at least one of. disabled: tags that the tool must NOT have any of. Both conditions must be satisfied.
 \- \`enabled\` (array): Tags that the tool must have at least one of
 \- \`disabled\` (array): Tags that the tool must NOT have any of
 \- \`workbench\` (object): Workbench configuration
 \- \`enable\` (boolean): Whether the workbench (code execution sandbox) is enabled. When false, COMPOSIO\_REMOTE\_WORKBENCH and COMPOSIO\_REMOTE\_BASH\_TOOL are not exposed.
 \- \`proxy\_execution\_enabled\` (boolean): Whether proxy execution is enabled in the workbench
 \- \`auto\_offload\_threshold\` (number): Character threshold after which tool execution response are saved to a file in workbench. Default is 20k.
 \- \`sandbox\_size\` (enum: "standard" \| "medium" \| "large" \| ...): Sandbox compute tier: standard (1 vCPU / 1 GB), medium (2 vCPU / 2 GB), large (4 vCPU / 4 GB), xlarge (8 vCPU / 8 GB). Defaults to standard.
 \- \`multi\_account\` (object): Multi-account configuration for this session.
 \- \`enable\` (boolean): When true, enables multi-account mode for this session. When not set, falls back to org/project-level configuration.
 \- \`max\_accounts\_per\_toolkit\` (integer): Maximum number of connected accounts allowed per toolkit. Defaults to 5 when multi-account is enabled.
 \- \`require\_explicit\_selection\` (boolean): When true, require explicit account selection when multiple accounts are connected. When false (default), use the first/default account.
 \- \`preload\` (object) \*(required)\*: Preload configuration. Explicit slugs are returned as an array; dynamic preload is returned as "all".
 \- \`tools\` (any) \*(required)\*: Explicit preloaded tool slugs, or "all" when the session dynamically exposes all app tools allowed by its filters.
 \- \`connected\_accounts\` (object): Per-toolkit connected account overrides (array of nano-IDs). Multi-account sessions can pin more than one account per toolkit; otherwise length is 1.
 \- \`\[key: string\]\` (array)
 \- \`search\` (object) \*(required)\*: Search helper configuration
 \- \`enable\` (boolean)
 \- \`execute\` (object) \*(required)\*: Execute helper configuration
 \- \`enable\_multi\_execute\` (boolean)
\- \`config\_version\` (integer) \*(required)\*: Monotonic version of the config. Incremented on each PATCH. Use for optimistic concurrency control.
\- \`experimental\` (object): Experimental features
 \- \`assistive\_prompt\` (string): The assistive system prompt for the tool router session
 \- \`custom\_toolkits\` (array): User-defined custom toolkits with grouped tools (no-auth)
 \- Array items:
 \- \`slug\` (string) \*(required)\*
 \- \`name\` (string) \*(required)\*
 \- \`description\` (string) \*(required)\*
 \- \`tools\` (array) \*(required)\*
 \- Array items:
 \- ...
 \- \`preload\` (boolean): Echoes the SDK-local preload hint provided for this toolkit
 \- \`custom\_tools\` (array): Custom tools — standalone or extending Composio toolkits
 \- Array items:
 \- \`slug\` (string) \*(required)\*: Prefixed tool slug (e.g. LOCAL\_GMAIL\_GET\_IMPORTANT\_EMAILS)
 \- \`name\` (string) \*(required)\*
 \- \`description\` (string) \*(required)\*
 \- \`input\_schema\` (object) \*(required)\*
 \- \`\[key: string\]\` (any)
 \- \`output\_schema\` (object)
 \- \`\[key: string\]\` (any)
 \- \`extends\_toolkit\` (string)
 \- \`original\_slug\` (string) \*(required)\*: Original tool slug as provided by the user
 \- \`preload\` (boolean): Echoes the SDK-local preload hint provided for this tool
\- \`warnings\` (array): Advisory list — the session exists and is usable, but the listed issues may warrant attention.
 \- Array items:
 \- \`code\` (enum: "PRELOAD\_TOOLS\_HIGH\_CONTEXT\_USAGE") \*(required)\*: Stable machine code identifying the advisory. Safe to switch on in client code.
 \- \`message\` (string) \*(required)\*: Human-readable description of the advisory. Suitable for logging or surfacing to end users.

\*\*Example Response:\*\*

\`\`\`json
{
 "session\_id": "string",
 "mcp": {
 "type": "http",
 "url": "https://example.com"
 },
 "tool\_router\_tools": \[\
 "string"\
 \],
 "config": {
 "user\_id": "string",
 "toolkits": null,
 "auth\_configs": {
 "key": "string"
 },
 "manage\_connections": {
 "enabled": true,
 "callback\_url": "https://example.com",
 "enable\_wait\_for\_connections": false,
 "enable\_connection\_removal": true
 },
 "tools": {
 "key": null
 },
 "tags": {
 "enabled": \[\
 "..."\
 \],
 "disabled": \[\
 "..."\
 \]
 },
 "workbench": {
 "enable": true,
 "proxy\_execution\_enabled": true
 },
 "multi\_account": {
 "enable": true,
 "max\_accounts\_per\_toolkit": 1,
 "require\_explicit\_selection": true
 },
 "preload": {
 "tools": null
 },
 "connected\_accounts": {
 "key": \[\
 "..."\
 \]
 },
 "search": {
 "enable": true
 },
 "execute": {
 "enable\_multi\_execute": true
 }
 },
 "config\_version": 1,
 "experimental": {
 "assistive\_prompt": "string",
 "custom\_toolkits": \[\
 {\
 "slug": "...",\
 "name": "...",\
 "description": "...",\
 "tools": "...",\
 "preload": "..."\
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
 "original\_slug": "...",\
 "preload": "..."\
 }\
 \]
 },
 "warnings": \[\]
}
\`\`\`

\#### 400 - Bad request. This may occur if the session\_id format is invalid, please pass this in trs\_ prefix format

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 401 - Unauthorized. Authentication is required or the provided credentials are invalid.

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 404 - Not found. The session with the provided ID does not exist or has been deleted.

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 500 - Internal server error. An unexpected error occurred while processing the request.

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
curl -X GET "https://backend.composio.dev/api/v3.1/tool\_router/session/string" \
 -H "x-api-key: YOUR\_API\_KEY"
\`\`\`

\-\-\-

\## REST API version

The current REST API version is \*\*v3.1\*\*, served at \`https://backend.composio.dev/api/v3.1\`. Prefer it for new code and new examples.

\`https://backend.composio.dev/api/v3\` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.
