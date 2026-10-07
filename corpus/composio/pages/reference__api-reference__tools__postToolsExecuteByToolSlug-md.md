---
url: https://docs.composio.dev/reference/api-reference/tools/postToolsExecuteByToolSlug.md
title: https://docs.composio.dev/reference/api-reference/tools/postToolsExecuteByToolSlug.md
description: 
status: 200
---

\# Execute tool

\*\*Documentation:\*\* /reference/api-reference/tools/postToolsExecuteByToolSlug

\> \*\*API version:\*\* This page documents Composio REST API v3.1, the current version, at \`https://backend.composio.dev/api/v3.1\`. \`https://backend.composio.dev/api/v3\` is the previous version and remains supported.

Execute a specific tool operation with provided arguments and authentication. This is the primary endpoint for integrating with third-party services and executing tools. You can provide structured arguments or use natural language processing by providing a text description of what you want to accomplish.

\-\-\-

\## POST \`/api/v3.1/tools/execute/{tool\_slug}\`

\*\*Endpoint:\*\* \`https://backend.composio.dev/api/v3.1/tools/execute/{tool\_slug}\`

\*\*Summary:\*\* Execute tool

Execute a specific tool operation with provided arguments and authentication. This is the primary endpoint for integrating with third-party services and executing tools. You can provide structured arguments or use natural language processing by providing a text description of what you want to accomplish.

\### Authentication

\*\*ApiKeyAuth\*\* - API Key in \`header\` header \`x-api-key\` OR \*\*UserApiKeyAuth\*\* - API Key in \`header\` header \`x-user-api-key\`

\### Path Parameters

\- \`tool\_slug\` (string) \*(required)\*: The tool slug to execute

\### Request Body

\*\*Schema:\*\*

\- \`connected\_account\_id\` (string): Unique identifier for the connected account to use for authentication
\- \`entity\_id\` (string): Deprecated: please use user\_id instead. Entity identifier for multi-entity connected accounts (e.g. multiple repositories, organizations)
\- \`user\_id\` (string): User id for multi-user connected accounts (e.g. multiple users, organizations)
\- \`version\` (string): Tool version to execute. Defaults to \`latest\` when omitted on REST API v3.1.
\- \`custom\_auth\_params\` (object): Custom authentication parameters for tools that support parameterized authentication
 \- \`base\_url\` (string): The base URL (root address) what you should use while making http requests to the connected account. For example, for gmail, it would be 'https://gmail.googleapis.com'
 \- \`parameters\` (array)
 \- Array items:
 \- \`name\` (string) \*(required)\*: The name of the parameter. For example, 'x-api-key', 'Content-Type', etc.
 \- \`in\` (enum: "query" \| "header") \*(required)\*: The location of the parameter. Can be 'query' or 'header'.
 \- \`value\` (any) \*(required)\*: The value of the parameter. For example, '1234567890', 'application/json', etc.
 \- \`body\` (object): The body to be sent to the endpoint for authentication. This is a JSON object. Note: This is very rarely needed and is only required by very few apps.
 \- \`\[key: string\]\` (any)
\- \`custom\_connection\_data\` (object): Custom connection data for tools that support custom connection data
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
\- \`arguments\` (object): Key-value pairs of arguments required by the tool (mutually exclusive with text)
 \- \`\[key: string\]\` (any)
\- \`text\` (string): Natural language description of the task to perform (mutually exclusive with arguments)
\- \`allow\_tracing\` (boolean,null): Deprecated. Enable debug tracing for tool execution (useful for debugging)

\*\*Example:\*\*

\`\`\`json
{
 "connected\_account\_id": "string",
 "entity\_id": "string",
 "user\_id": "string",
 "version": "string",
 "custom\_auth\_params": {
 "base\_url": "string",
 "parameters": \[\
 {\
 "name": "...",\
 "in": "...",\
 "value": "..."\
 }\
 \],
 "body": {
 "key": null
 }
 },
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
 },
 "arguments": {
 "key": null
 },
 "text": "string",
 "allow\_tracing": null
}
\`\`\`

\### Responses

\#### 200 - Successfully executed action and received response

\*\*Response Schema:\*\*

\- \`data\` (object) \*(required)\*: Tool execution output data that varies based on the specific tool
 \- \`\[key: string\]\` (any)
\- \`error\` (string,null) \*(required)\*: Error message if the tool execution was not successful (null if successful)
\- \`successful\` (boolean) \*(required)\*: Indicates if the tool execution was successful
\- \`session\_info\` (object,null): Optional session information for tools that return session context
\- \`log\_id\` (string): Unique identifier for the execution log (useful for debugging and support)

\*\*Example Response:\*\*

\`\`\`json
{
 "data": {
 "key": null
 },
 "error": null,
 "successful": true,
 "session\_info": null,
 "log\_id": "string"
}
\`\`\`

\#### 400 - Bad request - Invalid request parameters, missing required arguments, or conflicting parameters

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 401 - Unauthorized - Authentication credentials are missing or invalid

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 403 - Forbidden - Connected account does not have permission to execute this tool or access the requested resource

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 404 - Not found - Tool or connected account not found

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 408 - Request timeout - Tool execution exceeded the maximum allowed time

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 410 - Gone - Tool has been deprecated and is no longer available

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 413 - Payload too large - Request or response payload exceeds size limits

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 422 - Unprocessable entity - Invalid state of the connected account

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 429 - Rate limit exceeded - Too many requests to the tool or underlying API

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 500 - Internal server error - Something went wrong on the server

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 501 - Not implemented

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 502 - Bad gateway - Error communicating with the tool provider API

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 503 - Upstream service unavailable - Tool provider API is currently down or unavailable

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
curl -X POST "https://backend.composio.dev/api/v3.1/tools/execute/string" \
 -H "x-api-key: YOUR\_API\_KEY" \
 -H "Content-Type: application/json" \
 -d '{
 "connected\_account\_id": "string",
 "entity\_id": "string",
 "user\_id": "string",
 "version": "string",
 "custom\_auth\_params": {
 "base\_url": "string",
 "parameters": \[\
 {\
 "name": "...",\
 "in": "...",\
 "value": "..."\
 }\
 \],
 "body": {
 "key": null
 }
 },
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
 },
 "arguments": {
 "key": null
 },
 "text": "string",
 "allow\_tracing": null
 }'
\`\`\`

\-\-\-

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
