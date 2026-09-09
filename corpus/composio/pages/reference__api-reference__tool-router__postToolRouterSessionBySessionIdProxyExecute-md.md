---
url: https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdProxyExecute.md
title: https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdProxyExecute.md
description: 
status: 200
---

\# Execute proxy request within a tool router session

\*\*Documentation:\*\* /reference/api-reference/tool-router/postToolRouterSessionBySessionIdProxyExecute

\> \*\*API version:\*\* This page documents Composio REST API v3.1, the current version, at \`https://backend.composio.dev/api/v3.1\`. \`https://backend.composio.dev/api/v3\` is the previous version and remains supported.

Execute any native API call on a toolkit with authentication automatically injected from Composio. This endpoint proxies HTTP requests to third-party APIs using connected account credentials resolved from the session context. Provide the toolkit slug, API endpoint, and HTTP method — Composio handles authentication injection, abstracting away credential management. Supports all HTTP methods, custom headers/query parameters, and binary request/response bodies.

\-\-\-

\## POST \`/api/v3.1/tool\_router/session/{session\_id}/proxy\_execute\`

\*\*Endpoint:\*\* \`https://backend.composio.dev/api/v3.1/tool\_router/session/{session\_id}/proxy\_execute\`

\*\*Summary:\*\* Execute proxy request within a tool router session

Execute any native API call on a toolkit with authentication automatically injected from Composio. This endpoint proxies HTTP requests to third-party APIs using connected account credentials resolved from the session context. Provide the toolkit slug, API endpoint, and HTTP method — Composio handles authentication injection, abstracting away credential management. Supports all HTTP methods, custom headers/query parameters, and binary request/response bodies.

\### Authentication

\*\*ApiKeyAuth\*\* - API Key in \`header\` header \`x-api-key\` OR \*\*UserApiKeyAuth\*\* - API Key in \`header\` header \`x-user-api-key\`

\### Path Parameters

\- \`session\_id\` (string (toolRouterSessionId)) \*(required)\*: Tool router session ID (required for public API, optional for internal - injected by middleware)

\### Request Body

\*\*Schema:\*\*

\- \`toolkit\_slug\` (string) \*(required)\*: The slug of the toolkit to use for the request
\- \`endpoint\` (string) \*(required)\*: The API endpoint to call (absolute URL or path relative to base URL of the connected account)
\- \`method\` (enum: "GET" \| "POST" \| "PUT" \| ...) \*(required)\*: The HTTP method to use for the request
\- \`body\` (object,null): The request body (for POST, PUT, and PATCH requests)
\- \`binary\_body\` (any): Binary body to send. For binary upload via URL: use {url: "https://...", content\_type?: "..."}. For binary upload via base64: use {base64: "...", content\_type?: "..."}.
\- \`parameters\` (array): Additional HTTP headers or query parameters to include in the request
 \- Array items:
 \- \`name\` (string) \*(required)\*: Parameter name
 \- \`value\` (string) \*(required)\*: Parameter value
 \- \`type\` (enum: "header" \| "query") \*(required)\*: Parameter type (header or query)
\- \`custom\_connection\_data\` (object)
 \- \`authScheme\` (enum: "OAUTH2" \| "DCR\_OAUTH" \| "API\_KEY" \| ...) \*(required)\*
 \- \`toolkitSlug\` (string) \*(required)\*
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
 \- \`state\_prefix\` (string): The oauth2 state prefix for the connection
 \- \`long\_redirect\_url\` (boolean): Whether to return the redirect url without shortening
 \- \`access\_token\` (string) \*(required)\*
 \- \`id\_token\` (string)
 \- \`token\_type\` (string)
 \- \`refresh\_token\` (string,null)
 \- \`expires\_in\` (any)
 \- \`scope\` (any)
 \- \`webhook\_signature\` (string)
 \- \`authed\_user\` (object): for slack user scopes
 \- \`access\_token\` (string)
 \- \`scope\` (string)
 \- \`extra\_token\_data\` (object)
 \- \`\[key: string\]\` (any)
 \- \`client\_id\` (string): Dynamically registered client ID
 \- \`client\_secret\` (string): Dynamically registered client secret
 \- \`client\_id\_issued\_at\` (number)
 \- \`client\_secret\_expires\_at\` (number)
 \- \`generic\_api\_key\` (string)
 \- \`api\_key\` (string)
 \- \`bearer\_token\` (string)
 \- \`basic\_encoded\` (string)
 \- \`username\` (string)
 \- \`password\` (string)
 \- \`token\` (string)
 \- \`oauth\_token\` (string)
 \- \`oauth\_token\_secret\` (string)
 \- \`oauth\_verifier\` (string)
 \- \`consumer\_key\` (string)
 \- \`redirectUrl\` (string)
 \- \`callback\_url\` (string)
 \- \`application\_id\` (string)
 \- \`installation\_id\` (string)
 \- \`private\_key\` (string)
 \- \`credentials\_json\` (string)
 \- \`expires\_at\` (string)
 \- \`\[key: string\]\` (any)

\*\*Example:\*\*

\`\`\`json
{
 "toolkit\_slug": "string",
 "endpoint": "string",
 "method": "GET",
 "body": null,
 "binary\_body": null,
 "parameters": \[\
 {\
 "name": "string",\
 "value": "string",\
 "type": "header"\
 }\
 \],
 "custom\_connection\_data": {
 "authScheme": "OAUTH2",
 "toolkitSlug": "string",
 "val": {
 "subdomain": "string",
 "your-domain": "string",
 "region": "string",
 "shop": "string",
 "account\_url": "string",
 "COMPANYDOMAIN": "string",
 "extension": "string",
 "form\_api\_base\_url": "string",
 "instanceEndpoint": "string",
 "api\_url": "string",
 "borneo\_dashboard\_url": "string",
 "proxy\_username": "string",
 "proxy\_password": "string",
 "domain": "string",
 "version": "string",
 "dc": "string",
 "site\_name": "string",
 "instanceName": "string",
 "account\_id": "string",
 "your\_server": "string",
 "server\_location": "string",
 "base\_url": "string",
 "state\_prefix": "string",
 "long\_redirect\_url": true,
 "access\_token": "string",
 "id\_token": "string",
 "token\_type": "string",
 "refresh\_token": null,
 "expires\_in": null,
 "scope": null,
 "webhook\_signature": "string",
 "authed\_user": {
 "access\_token": "...",
 "scope": "..."
 },
 "extra\_token\_data": {
 "key": "..."
 },
 "client\_id": "string",
 "client\_secret": "string",
 "client\_id\_issued\_at": 1,
 "client\_secret\_expires\_at": 1,
 "generic\_api\_key": "string",
 "api\_key": "string",
 "bearer\_token": "string",
 "basic\_encoded": "string",
 "username": "string",
 "password": "string",
 "token": "string",
 "oauth\_token": "string",
 "oauth\_token\_secret": "string",
 "oauth\_verifier": "string",
 "consumer\_key": "string",
 "redirectUrl": "string",
 "callback\_url": "string",
 "application\_id": "string",
 "installation\_id": "string",
 "private\_key": "string",
 "credentials\_json": "string",
 "expires\_at": "string",
 "key": null
 }
 }
}
\`\`\`

\### Responses

\#### 200 - Successfully executed proxy request and received response

\*\*Response Schema:\*\*

\- \`data\` (object,null): The response data returned from the proxied API
\- \`binary\_data\` (object): Binary body response data. Present when the response is a binary file.
 \- \`url\` (string) \*(required)\*: URL to download binary content
 \- \`content\_type\` (string) \*(required)\*: Content-Type of the binary data
 \- \`size\` (number) \*(required)\*: File size in bytes
 \- \`expires\_at\` (string): ISO 8601 timestamp when the URL expires
\- \`status\` (number) \*(required)\*: The HTTP status code returned from the proxied API
\- \`headers\` (object): The HTTP headers returned from the proxied API
 \- \`\[key: string\]\` (string)

\*\*Example Response:\*\*

\`\`\`json
{
 "data": null,
 "binary\_data": {
 "url": "string",
 "content\_type": "string",
 "size": 1,
 "expires\_at": "string"
 },
 "status": 1,
 "headers": {
 "key": "string"
 }
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
curl -X POST "https://backend.composio.dev/api/v3.1/tool\_router/session/string/proxy\_execute" \
 -H "x-api-key: YOUR\_API\_KEY" \
 -H "Content-Type: application/json" \
 -d '{
 "toolkit\_slug": "string",
 "endpoint": "string",
 "method": "GET",
 "body": null,
 "binary\_body": null,
 "parameters": \[\
 {\
 "name": "string",\
 "value": "string",\
 "type": "header"\
 }\
 \],
 "custom\_connection\_data": {
 "authScheme": "OAUTH2",
 "toolkitSlug": "string",
 "val": {
 "subdomain": "string",
 "your-domain": "string",
 "region": "string",
 "shop": "string",
 "account\_url": "string",
 "COMPANYDOMAIN": "string",
 "extension": "string",
 "form\_api\_base\_url": "string",
 "instanceEndpoint": "string",
 "api\_url": "string",
 "borneo\_dashboard\_url": "string",
 "proxy\_username": "string",
 "proxy\_password": "string",
 "domain": "string",
 "version": "string",
 "dc": "string",
 "site\_name": "string",
 "instanceName": "string",
 "account\_id": "string",
 "your\_server": "string",
 "server\_location": "string",
 "base\_url": "string",
 "state\_prefix": "string",
 "long\_redirect\_url": true,
 "access\_token": "string",
 "id\_token": "string",
 "token\_type": "string",
 "refresh\_token": null,
 "expires\_in": null,
 "scope": null,
 "webhook\_signature": "string",
 "authed\_user": {
 "access\_token": "...",
 "scope": "..."
 },
 "extra\_token\_data": {
 "key": "..."
 },
 "client\_id": "string",
 "client\_secret": "string",
 "client\_id\_issued\_at": 1,
 "client\_secret\_expires\_at": 1,
 "generic\_api\_key": "string",
 "api\_key": "string",
 "bearer\_token": "string",
 "basic\_encoded": "string",
 "username": "string",
 "password": "string",
 "token": "string",
 "oauth\_token": "string",
 "oauth\_token\_secret": "string",
 "oauth\_verifier": "string",
 "consumer\_key": "string",
 "redirectUrl": "string",
 "callback\_url": "string",
 "application\_id": "string",
 "installation\_id": "string",
 "private\_key": "string",
 "credentials\_json": "string",
 "expires\_at": "string",
 "key": null
 }
 }
 }'
\`\`\`

\-\-\-

\## REST API version

The current REST API version is \*\*v3.1\*\*, served at \`https://backend.composio.dev/api/v3.1\`. Prefer it for new code and new examples.

\`https://backend.composio.dev/api/v3\` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.
