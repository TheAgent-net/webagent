---
url: https://docs.composio.dev/reference/api-reference/connected-accounts/getConnectedAccounts.md
title: https://docs.composio.dev/reference/api-reference/connected-accounts/getConnectedAccounts.md
description: 
status: 200
---

\# List connected accounts with optional filters

\*\*Documentation:\*\* /reference/api-reference/connected-accounts/getConnectedAccounts

\> \*\*API version:\*\* This page documents Composio REST API v3.1, the current version, at \`https://backend.composio.dev/api/v3.1\`. \`https://backend.composio.dev/api/v3\` is the previous version and remains supported.

Retrieves all connected accounts for your project. Connected accounts represent authenticated user connections to external services (e.g., a user's Gmail account, Slack workspace). Filter by toolkit, status, user ID, or auth config to find specific connections.

\-\-\-

\## GET \`/api/v3.1/connected\_accounts\`

\*\*Endpoint:\*\* \`https://backend.composio.dev/api/v3.1/connected\_accounts\`

\*\*Summary:\*\* List connected accounts with optional filters

Retrieves all connected accounts for your project. Connected accounts represent authenticated user connections to external services (e.g., a user's Gmail account, Slack workspace). Filter by toolkit, status, user ID, or auth config to find specific connections.

\### Authentication

\*\*ApiKeyAuth\*\* - API Key in \`header\` header \`x-api-key\` OR \*\*UserApiKeyAuth\*\* - API Key in \`header\` header \`x-user-api-key\`

\### Query Parameters

\- \`toolkit\_slugs\` (array,null): The toolkit slugs of the connected accounts
\- \`statuses\` (array,null): The status of the connected account
\- \`cursor\` (string,null): The cursor to paginate through the connected accounts
\- \`limit\` (number,null): The limit of the connected accounts to return
\- \`user\_ids\` (array,null): The user ids of the connected accounts
\- \`auth\_config\_ids\` (array,null): The auth config ids of the connected accounts
\- \`connected\_account\_ids\` (array,null): The connected account ids to filter by
\- \`order\_by\` (enum: "created\_at" \| "updated\_at"): The order by of the connected accounts
\- \`order\_direction\` (enum: "asc" \| "desc"): The order direction of the connected accounts
\- \`account\_type\` (enum: "PRIVATE" \| "SHARED" \| "ALL"): \[Experimental\] Filter by sharing model. Default (omitted) returns PRIVATE only — shared accounts must be requested explicitly. Pass SHARED for only shared accounts, or ALL for PRIVATE + SHARED.

\### Responses

\#### 200 - Successfully retrieved connected accounts

\*\*Response Schema:\*\*

\- \`items\` (array) \*(required)\*
 \- Array items:
 \- \`toolkit\` (object) \*(required)\*
 \- \`slug\` (string) \*(required)\*: The slug of the toolkit
 \- \`auth\_config\` (object) \*(required)\*
 \- \`id\` (string (authConfigId)) \*(required)\*: The id of the auth config
 \- \`auth\_scheme\` (enum: "OAUTH2" \| "OAUTH1" \| "API\_KEY" \| ...) \*(required)\*: the authScheme is part of the connection state use it there
 \- \`is\_composio\_managed\` (boolean) \*(required)\*: Whether the auth config is managed by Composio
 \- \`is\_disabled\` (boolean) \*(required)\*: Whether the auth config is disabled
 \- \`id\` (string (connectedAccountId)) \*(required)\*: The id of the connection
 \- \`authScheme\` (enum: "OAUTH2" \| "OAUTH1" \| "API\_KEY" \| ...): Duplicates state.authScheme. Kept for backward compatibility with existing readers; use state.authScheme instead.
 \- \`word\_id\` (string,null) \*(required)\*: A short, token-friendly identifier for multi-account disambiguation, typically toolkit-prefixed with 1-2 words (e.g., "gmail\_red-castle")
 \- \`alias\` (string,null) \*(required)\*: A user-defined alias for the connected account
 \- \`user\_id\` (string) \*(required)\*: This is deprecated, we will not be providing userId from this api anymore, you will only be able to read via userId not get it back
 \- \`status\` (enum: "INITIALIZING" \| "INITIATED" \| "ACTIVE" \| ...) \*(required)\*: The status of the connection
 \- \`experimental\` (object): Experimental features - not stable, may be modified or removed in future versions.
 \- \`account\_type\` (enum: "PRIVATE" \| "SHARED") \*(required)\*: Sharing model for this connected account. PRIVATE is usable only by the owning user\_id. SHARED is reachable from a tool-router session only when explicitly pinned in the session config.
 \- \`acl\_config\_for\_shared\` (object): Access control for SHARED connections. Visible only to the connection creator and project/org API key callers; non-creator cookie callers receive the response without this block.
 \- \`allow\_all\_users\` (boolean) \*(required)\*
 \- \`allowed\_user\_ids\` (array) \*(required)\*
 \- \`not\_allowed\_user\_ids\` (array) \*(required)\*
 \- \`created\_at\` (string) \*(required)\*: The created at of the connection
 \- \`updated\_at\` (string) \*(required)\*: The updated at of the connection
 \- \`state\` (object) \*(required)\*: The state of the connection
 \- \`authScheme\` (enum: "OAUTH1" \| "OAUTH2" \| "API\_KEY" \| ...) \*(required)\*
 \- \`val\` (object) \*(required)\*
 \- \`subdomain\` (string)
 \- \`your-domain\` (string)
 \- \`region\` (string)
 \- \`shop\` (string)
 \- \`account\_url\` (string)
 \- \`COMPANYDOMAIN\` (string)
 \- \`extension\` (string)
 \- \`form\_api\_base\_url\` (string)
 \- \`instanceEndpoint\` (string)
 \- \`api\_url\` (string)
 \- \`borneo\_dashboard\_url\` (string)
 \- \`proxy\_username\` (string)
 \- \`proxy\_password\` (string)
 \- \`domain\` (string)
 \- \`version\` (string)
 \- \`dc\` (string)
 \- \`site\_name\` (string)
 \- \`instanceName\` (string)
 \- \`account\_id\` (string)
 \- \`your\_server\` (string)
 \- \`server\_location\` (string)
 \- \`base\_url\` (string)
 \- \`status\` (enum: "INITIALIZING" \| "INITIATED" \| "ACTIVE" \| ...) \*(required)\*
 \- \`oauth\_token\` (string)
 \- \`authUri\` (string)
 \- \`oauth\_token\_secret\` (string)
 \- \`redirectUrl\` (string)
 \- \`callbackUrl\` (string)
 \- \`oauth\_verifier\` (string)
 \- \`consumer\_key\` (string)
 \- \`callback\_url\` (string)
 \- \`error\` (string)
 \- \`error\_description\` (string)
 \- \`expired\_at\` (string)
 \- \`data\` (object) \*(required)\*: This is deprecated, use \`state\` instead
 \- \`\[key: string\]\` (any)
 \- \`status\_reason\` (string,null) \*(required)\*: The reason the connection status changed.
 \- \`is\_disabled\` (boolean) \*(required)\*: Whether the connection is disabled
 \- \`test\_request\_endpoint\` (string): The endpoint to make test request for verification
\- \`next\_cursor\` (string,null)
\- \`total\_pages\` (number) \*(required)\*
\- \`current\_page\` (number) \*(required)\*
\- \`total\_items\` (number) \*(required)\*

\*\*Example Response:\*\*

\`\`\`json
{
 "items": \[\
 {\
 "toolkit": {\
 "slug": "..."\
 },\
 "auth\_config": {\
 "id": "...",\
 "auth\_scheme": "...",\
 "is\_composio\_managed": "...",\
 "is\_disabled": "..."\
 },\
 "id": "string",\
 "authScheme": "OAUTH2",\
 "word\_id": null,\
 "alias": null,\
 "user\_id": "string",\
 "status": "INITIALIZING",\
 "experimental": {\
 "account\_type": "...",\
 "acl\_config\_for\_shared": "..."\
 },\
 "created\_at": "string",\
 "updated\_at": "string",\
 "state": {\
 "authScheme": "...",\
 "val": "..."\
 },\
 "data": {\
 "key": "..."\
 },\
 "status\_reason": null,\
 "is\_disabled": true,\
 "test\_request\_endpoint": "string"\
 }\
 \],
 "next\_cursor": null,
 "total\_pages": 1,
 "current\_page": 1,
 "total\_items": 1
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

\#### 422 - Unprocessable entity

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

\### Example cURL Request

\`\`\`bash
curl -X GET "https://backend.composio.dev/api/v3.1/connected\_accounts" \
 -H "x-api-key: YOUR\_API\_KEY"
\`\`\`

\-\-\-

\## REST API version

The current REST API version is \*\*v3.1\*\*, served at \`https://backend.composio.dev/api/v3.1\`. Prefer it for new code and new examples.

\`https://backend.composio.dev/api/v3\` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.
