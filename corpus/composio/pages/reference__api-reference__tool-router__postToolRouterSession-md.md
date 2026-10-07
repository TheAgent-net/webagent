---
url: https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSession.md
title: https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSession.md
description: 
status: 200
---

\# Create a new tool router session

\*\*Documentation:\*\* /reference/api-reference/tool-router/postToolRouterSession

\> \*\*API version:\*\* This page documents Composio REST API v3.1, the current version, at \`https://backend.composio.dev/api/v3.1\`. \`https://backend.composio.dev/api/v3\` is the previous version and remains supported.

Creates a new session for the tool router feature. This endpoint initializes a new session with specified toolkits and their authentication configurations. The session provides an isolated environment for testing and managing tool routing logic with scoped MCP server access.

\-\-\-

\## POST \`/api/v3.1/tool\_router/session\`

\*\*Endpoint:\*\* \`https://backend.composio.dev/api/v3.1/tool\_router/session\`

\*\*Summary:\*\* Create a new tool router session

Creates a new session for the tool router feature. This endpoint initializes a new session with specified toolkits and their authentication configurations. The session provides an isolated environment for testing and managing tool routing logic with scoped MCP server access.

\### Authentication

\*\*ApiKeyAuth\*\* - API Key in \`header\` header \`x-api-key\`

\### Request Body

\*\*Schema:\*\*

\- \`user\_id\` (string) \*(required)\*: The identifier of the user who is initiating the session, ideally a unique identifier from your database like a user ID or email address
\- \`toolkits\` (any): Toolkit configuration - specify either enable toolkits (allowlist) or disable toolkits (denylist). Mutually exclusive.
\- \`auth\_configs\` (object): The auth configs to use for the session. This will override the default behavior and use the given auth config when specific toolkits are being executed
 \- \`\[key: string\]\` (string (authConfigId))
\- \`connected\_accounts\` (object): The connected accounts to use for the session, as an array of nano-IDs per toolkit. This overrides the default behaviour and pins specific connected accounts when toolkits are executed. Each account must exist (not deleted or disabled) and belong to the same \`user\_id\` as the session. Multi-account sessions can pin multiple; non-multi-account sessions are capped at length 1.
 \- \`\[key: string\]\` (array)
\- \`manage\_connections\` (object): Configuration for connection management settings
 \- \`enable\` (boolean,null): Whether to enable the connection manager for automatic connection handling. If true, we will provide a tool your agent can use to initiate connections to toolkits if it doesnt exist. If set to false, then you have to manage connections manually.
 \- \`callback\_url\` (string (uri)): The URL to redirect to after a user completes authentication for a connected account. This allows you to handle the auth callback in your own application.
 \- \`enable\_wait\_for\_connections\` (boolean,null): When true, the COMPOSIO\_WAIT\_FOR\_CONNECTIONS tool is available for agents to poll connection status after sharing auth URLs. Default is false (disabled). May not work reliably with GPT models.
 \- \`enable\_connection\_removal\` (boolean,null): Enable the "remove" action in COMPOSIO\_MANAGE\_CONNECTIONS to allow deleting connected accounts. Default true.
\- \`tools\` (object): Tool-level configuration per toolkit. Allows you to enable, disable, or filter by tags for specific tools within each toolkit. Every slug passed in \`enable\` / \`disable\` must be a valid Composio tool slug for that toolkit — invalid or typo'd slugs fail session creation with a clear error listing which ones didn't match.
 \- \`\[key: string\]\` (any)
\- \`tags\` (any): Global MCP tool annotation hints for filtering. Array format is treated as enabled list. Object format supports both enabled (tool must have at least one) and disabled (tool must NOT have any) lists. Toolkit-level tags override this. Toolkit enabled/disabled lists take precedence over tag filtering.
\- \`workbench\` (object): Configuration for workbench behavior
 \- \`enable\` (boolean): Set to false to disable the workbench entirely. When disabled, no code execution tools are available in the session.
 \- \`enable\_proxy\_execution\` (boolean): Whether proxy execution is enabled. When enabled, workbench can call URLs and APIs directly.
 \- \`auto\_offload\_threshold\` (number): Character threshold for automatic offloading. When workbench response exceeds this threshold, it will be automatically offloaded. Default is picked automatically based on the response size.
 \- \`sandbox\_size\` (enum: "standard" \| "medium" \| "large" \| ...): Sandbox compute tier: standard (1 vCPU / 1 GB), medium (2 vCPU / 2 GB), large (4 vCPU / 4 GB), xlarge (8 vCPU / 8 GB). Defaults to standard.
\- \`multi\_account\` (object): Configure multi-account behavior. When enabled, users can connect multiple accounts per toolkit.
 \- \`enable\` (boolean): When true, enables multi-account mode for this session. When not set, falls back to org/project-level configuration.
 \- \`max\_accounts\_per\_toolkit\` (integer): Maximum number of connected accounts allowed per toolkit. Must be between 2 and 10.
 \- \`require\_explicit\_selection\` (boolean): When true, the agent must explicitly select which account to use. When false (default), the first/default account is used automatically.
\- \`experimental\` (object): Experimental features - not stable, may be modified or removed in future versions.
 \- \`assistive\_prompt\_config\` (object): Customize assistive prompt generation (e.g., timezone).
 \- \`user\_timezone\` (string): IANA timezone identifier (e.g., 'America/New\_York', 'Europe/London'). Used to customize the system prompt with timezone-aware instructions.
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
 \- \`permissions\` (object): Per-tool elicitation permission config. Default behavior + per-tool always\_allow/always\_deny overrides. Mutation via PATCH.
 \- \`default\` (enum: "allow\_all" \| "ask\_every\_call" \| "ask\_once\_per\_session") \*(required)\*: Default elicitation behavior when no override matches. \`allow\_all\` runs every tool without prompting; \`ask\_every\_call\` prompts on each invocation; \`ask\_once\_per\_session\` prompts once and remembers the answer for the rest of the session.
 \- \`overrides\` (object): Per-tool overrides keyed by \`${toolSlug}:${connectedAccountId ?? "\_\_none\_\_"}\`, plus account-wide overrides keyed by \`\*:${connectedAccountId ?? "\_\_none\_\_"}\`. Exact tool overrides take precedence over account-wide overrides. \`always\_allow\` skips the prompt and runs the tool; \`always\_deny\` blocks the tool; \`ask\_once\` prompts once per session (allow/deny) and remembers; \`ask\_always\` prompts on every call with allow-once/allow-session/deny, ignoring any cached session allow. Overrides take precedence over \`default\`.
 \- \`\[key: string\]\` (enum: "always\_allow" \| "always\_deny" \| "ask\_once" \| ...)
 \- \`link\_url\_overwrite\` (string (uri)): Experimental base URL override for connection link redirects created from this tool-router session. When set, link creation returns \`${link\_url\_overwrite}/link/{link\_token}\` instead of the default Composio Connect base URL. Use only when your integration needs links to open through a custom Connect host.
 \- \`fast\_mode\` (boolean): Experimental flag to skip the LLM reranker in tool search and serve embeddings/BM25-only results.
\- \`preload\` (object): Preload configuration. Use an explicit list for frequently used tool slugs, or "all" to dynamically expose every app tool allowed by positive toolkits/tools/tags filters.
 \- \`tools\` (any): Explicit tool slugs to preload, or "all" to dynamically expose all current and future app tools allowed by the positive session filters. "all" is capped at 1000 tools and is not supported without a positive allowlist.
\- \`search\` (object)
 \- \`enable\` (boolean)
\- \`execute\` (object)
 \- \`enable\_multi\_execute\` (boolean)

\*\*Example:\*\*

\`\`\`json
{
 "user\_id": "string",
 "toolkits": null,
 "auth\_configs": {
 "key": "string"
 },
 "connected\_accounts": {
 "key": \[\
 "string"\
 \]
 },
 "manage\_connections": {
 "enable": true,
 "enable\_wait\_for\_connections": false,
 "enable\_connection\_removal": true
 },
 "tools": {
 "key": null
 },
 "tags": null,
 "workbench": {
 "enable": true,
 "enable\_proxy\_execution": true
 },
 "multi\_account": {
 "enable": true,
 "max\_accounts\_per\_toolkit": 2,
 "require\_explicit\_selection": true
 },
 "experimental": {
 "assistive\_prompt\_config": {
 "user\_timezone": "string"
 },
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
 \],
 "permissions": {
 "default": "allow\_all",
 "overrides": {
 "key": "..."
 }
 },
 "link\_url\_overwrite": "https://example.com",
 "fast\_mode": true
 },
 "preload": {
 "tools": null
 },
 "search": {
 "enable": true
 },
 "execute": {
 "enable\_multi\_execute": true
 }
}
\`\`\`

\### Responses

\#### 201 - Session successfully created. Returns the session ID and MCP server URL for the created session.

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
\- \`experimental\` (object): Experimental features including the generated system prompt. Only returned on session creation, not on GET.
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

\#### 400 - Bad request. This may occur if the user\_id format is invalid, toolkit names are invalid, or auth\_config\_id IDs are malformed.

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

\#### 403 - Forbidden. The user is not authorized to create a tool router session.

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 408 - Request timeout. The session creation took too long to complete.

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 429 - Too many requests. The upstream service is rate limiting the request; retry after a short backoff.

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
curl -X POST "https://backend.composio.dev/api/v3.1/tool\_router/session" \
 -H "x-api-key: YOUR\_API\_KEY" \
 -H "Content-Type: application/json" \
 -d '{
 "user\_id": "string",
 "toolkits": null,
 "auth\_configs": {
 "key": "string"
 },
 "connected\_accounts": {
 "key": \[\
 "string"\
 \]
 },
 "manage\_connections": {
 "enable": true,
 "enable\_wait\_for\_connections": false,
 "enable\_connection\_removal": true
 },
 "tools": {
 "key": null
 },
 "tags": null,
 "workbench": {
 "enable": true,
 "enable\_proxy\_execution": true
 },
 "multi\_account": {
 "enable": true,
 "max\_accounts\_per\_toolkit": 2,
 "require\_explicit\_selection": true
 },
 "experimental": {
 "assistive\_prompt\_config": {
 "user\_timezone": "string"
 },
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
 \],
 "permissions": {
 "default": "allow\_all",
 "overrides": {
 "key": "..."
 }
 },
 "link\_url\_overwrite": "https://example.com",
 "fast\_mode": true
 },
 "preload": {
 "tools": null
 },
 "search": {
 "enable": true
 },
 "execute": {
 "enable\_multi\_execute": true
 }
 }'
\`\`\`

\-\-\-

\## REST API version

The current REST API version is \*\*v3.1\*\*, served at \`https://backend.composio.dev/api/v3.1\`. Prefer it for new code and new examples.

\`https://backend.composio.dev/api/v3\` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.
