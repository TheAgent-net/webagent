---
url: https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccountsLink.md
title: https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccountsLink.md
description: 
status: 200
---

\# Create a new auth link session

\*\*Documentation:\*\* /reference/api-reference/connected-accounts/postConnectedAccountsLink

\> \*\*API version:\*\* This page documents Composio REST API v3.1, the current version, at \`https://backend.composio.dev/api/v3.1\`. \`https://backend.composio.dev/api/v3\` is the previous version and remains supported.

Creates a new authentication link session that users can use to connect their accounts

\-\-\-

\## POST \`/api/v3.1/connected\_accounts/link\`

\*\*Endpoint:\*\* \`https://backend.composio.dev/api/v3.1/connected\_accounts/link\`

\*\*Summary:\*\* Create a new auth link session

Creates a new authentication link session that users can use to connect their accounts

\### Authentication

\*\*ApiKeyAuth\*\* - API Key in \`header\` header \`x-api-key\` OR \*\*UserApiKeyAuth\*\* - API Key in \`header\` header \`x-user-api-key\`

\### Request Body

\*\*Schema:\*\*

\- \`auth\_config\_id\` (string (authConfigId)) \*(required)\*: The auth config id to create a link for
\- \`user\_id\` (string) \*(required)\*: The user id to create a link for
\- \`alias\` (string): A human-readable alias for this connected account. Must be unique per entity and toolkit within the project.
\- \`callback\_url\` (string): The callback url to create a link for
\- \`connection\_data\` (object): Optional data to pre-fill connection fields with default values
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
 \- \`state\_prefix\` (string): The oauth2 state prefix for the connection
 \- \`long\_redirect\_url\` (boolean): Whether to return the redirect url without shortening
 \- \`code\_verifier\` (string)
 \- \`finalRedirectUri\` (string)
 \- \`webhook\_signature\` (string)
 \- \`access\_token\` (string)
 \- \`id\_token\` (string)
 \- \`token\_type\` (string)
 \- \`refresh\_token\` (string,null)
 \- \`expires\_in\` (any)
 \- \`scope\` (any)
 \- \`authed\_user\` (object): for slack user scopes
 \- \`access\_token\` (string)
 \- \`scope\` (string)
 \- \`extra\_token\_data\` (object)
 \- \`\[key: string\]\` (any)
 \- \`revoked\_at\` (string)
 \- \`generic\_api\_key\` (string)
 \- \`api\_key\` (string)
 \- \`bearer\_token\` (string)
 \- \`basic\_encoded\` (string)
 \- \`username\` (string)
 \- \`password\` (string)
 \- \`token\` (string)
 \- \`composio\_link\_redirect\_url\` (string)
 \- \`credentials\_json\` (string)
 \- \`sessionId\` (string)
 \- \`devKey\` (string)
 \- \`application\_id\` (string)
 \- \`installation\_id\` (string)
 \- \`private\_key\` (string)
 \- \`client\_id\` (string): Dynamically registered client ID
 \- \`client\_secret\` (string): Dynamically registered client secret
 \- \`client\_id\_issued\_at\` (number)
 \- \`client\_secret\_expires\_at\` (number)
 \- \`expires\_at\` (string)
\- \`experimental\` (object): Experimental features - not stable, may be modified or removed in future versions.
 \- \`account\_type\` (enum: "PRIVATE" \| "SHARED"): Sharing model for this connected account. PRIVATE (default) is usable only by the owning user\_id. SHARED is reachable from a tool-router session ONLY when explicitly pinned in the session config — at most one SHARED connection per toolkit per session. Sessions never use a SHARED connection implicitly.
 \- \`acl\_config\_for\_shared\` (object): Access control for SHARED connections. Resolution rule (only fires when caller != creator): user in not\_allowed\_user\_ids → DENY; allow\_all\_users=true → ALLOW; user in allowed\_user\_ids → ALLOW; else DENY. Default state (omitted or {}) is deny-by-default — only the creator can use.
 \- \`allow\_all\_users\` (boolean): Wildcard "any user\_id in the project" allow toggle. Only valid on SHARED connections.
 \- \`allowed\_user\_ids\` (array): Explicit allow list of user\_ids who can use this SHARED connection.
 \- \`not\_allowed\_user\_ids\` (array): Explicit deny list. Wins on conflict with allow\_all\_users and allowed\_user\_ids.

\*\*Example:\*\*

\`\`\`json
{
 "auth\_config\_id": "string",
 "user\_id": "string",
 "alias": "string",
 "callback\_url": "string",
 "connection\_data": {
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
 "oauth\_token": "string",
 "authUri": "string",
 "oauth\_token\_secret": "string",
 "redirectUrl": "string",
 "callbackUrl": "string",
 "oauth\_verifier": "string",
 "consumer\_key": "string",
 "callback\_url": "string",
 "error": "string",
 "error\_description": "string",
 "expired\_at": "string",
 "state\_prefix": "string",
 "long\_redirect\_url": true,
 "code\_verifier": "string",
 "finalRedirectUri": "string",
 "webhook\_signature": "string",
 "access\_token": "string",
 "id\_token": "string",
 "token\_type": "string",
 "refresh\_token": null,
 "expires\_in": null,
 "scope": null,
 "authed\_user": {
 "access\_token": "string",
 "scope": "string"
 },
 "extra\_token\_data": {
 "key": null
 },
 "revoked\_at": "string",
 "generic\_api\_key": "string",
 "api\_key": "string",
 "bearer\_token": "string",
 "basic\_encoded": "string",
 "username": "string",
 "password": "string",
 "token": "string",
 "composio\_link\_redirect\_url": "string",
 "credentials\_json": "string",
 "sessionId": "string",
 "devKey": "string",
 "application\_id": "string",
 "installation\_id": "string",
 "private\_key": "string",
 "client\_id": "string",
 "client\_secret": "string",
 "client\_id\_issued\_at": 1,
 "client\_secret\_expires\_at": 1,
 "expires\_at": "string"
 },
 "experimental": {
 "account\_type": "PRIVATE",
 "acl\_config\_for\_shared": {
 "allow\_all\_users": true,
 "allowed\_user\_ids": \[\
 "..."\
 \],
 "not\_allowed\_user\_ids": \[\
 "..."\
 \]
 }
 }
}
\`\`\`

\### Responses

\#### 201 - Successfully created auth link

\*\*Response Schema:\*\*

\- \`link\_token\` (string) \*(required)\*: The generated link token for the auth session
\- \`redirect\_url\` (string) \*(required)\*: The redirect URI to send users to for authentication
\- \`expires\_at\` (string) \*(required)\*: ISO timestamp when the link expires
\- \`connected\_account\_id\` (string (connectedAccountId)) \*(required)\*: The connected account ID that was created
\- \`experimental\` (object): Experimental features - not stable, may be modified or removed in future versions.
 \- \`account\_type\` (enum: "PRIVATE" \| "SHARED") \*(required)\*: Sharing model for this connected account. PRIVATE is usable only by the owning user\_id. SHARED is reachable from a tool-router session only when explicitly pinned in the session config.
 \- \`acl\_config\_for\_shared\` (object): Access control for SHARED connections. Visible only to the connection creator and project/org API key callers; non-creator cookie callers receive the response without this block.
 \- \`allow\_all\_users\` (boolean) \*(required)\*
 \- \`allowed\_user\_ids\` (array) \*(required)\*
 \- \`not\_allowed\_user\_ids\` (array) \*(required)\*

\*\*Example Response:\*\*

\`\`\`json
{
 "link\_token": "string",
 "redirect\_url": "string",
 "expires\_at": "string",
 "connected\_account\_id": "string",
 "experimental": {
 "account\_type": "PRIVATE",
 "acl\_config\_for\_shared": {
 "allow\_all\_users": true,
 "allowed\_user\_ids": \[\
 "..."\
 \],
 "not\_allowed\_user\_ids": \[\
 "..."\
 \]
 }
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

\#### 404 - Auth config not found

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

\### Example cURL Request

\`\`\`bash
curl -X POST "https://backend.composio.dev/api/v3.1/connected\_accounts/link" \
 -H "x-api-key: YOUR\_API\_KEY" \
 -H "Content-Type: application/json" \
 -d '{
 "auth\_config\_id": "string",
 "user\_id": "string",
 "alias": "string",
 "callback\_url": "string",
 "connection\_data": {
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
 "oauth\_token": "string",
 "authUri": "string",
 "oauth\_token\_secret": "string",
 "redirectUrl": "string",
 "callbackUrl": "string",
 "oauth\_verifier": "string",
 "consumer\_key": "string",
 "callback\_url": "string",
 "error": "string",
 "error\_description": "string",
 "expired\_at": "string",
 "state\_prefix": "string",
 "long\_redirect\_url": true,
 "code\_verifier": "string",
 "finalRedirectUri": "string",
 "webhook\_signature": "string",
 "access\_token": "string",
 "id\_token": "string",
 "token\_type": "string",
 "refresh\_token": null,
 "expires\_in": null,
 "scope": null,
 "authed\_user": {
 "access\_token": "string",
 "scope": "string"
 },
 "extra\_token\_data": {
 "key": null
 },
 "revoked\_at": "string",
 "generic\_api\_key": "string",
 "api\_key": "string",
 "bearer\_token": "string",
 "basic\_encoded": "string",
 "username": "string",
 "password": "string",
 "token": "string",
 "composio\_link\_redirect\_url": "string",
 "credentials\_json": "string",
 "sessionId": "string",
 "devKey": "string",
 "application\_id": "string",
 "installation\_id": "string",
 "private\_key": "string",
 "client\_id": "string",
 "client\_secret": "string",
 "client\_id\_issued\_at": 1,
 "client\_secret\_expires\_at": 1,
 "expires\_at": "string"
 },
 "experimental": {
 "account\_type": "PRIVATE",
 "acl\_config\_for\_shared": {
 "allow\_all\_users": true,
 "allowed\_user\_ids": \[\
 "..."\
 \],
 "not\_allowed\_user\_ids": \[\
 "..."\
 \]
 }
 }
 }'
\`\`\`

\-\-\-

\## REST API version

The current REST API version is \*\*v3.1\*\*, served at \`https://backend.composio.dev/api/v3.1\`. Prefer it for new code and new examples.

\`https://backend.composio.dev/api/v3\` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.
