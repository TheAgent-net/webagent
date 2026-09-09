---
url: https://docs.composio.dev/reference/api-reference/connected-accounts/deleteConnectedAccountsByNanoid.md
title: https://docs.composio.dev/reference/api-reference/connected-accounts/deleteConnectedAccountsByNanoid.md
description: 
status: 200
---

\# Delete a connected account

\*\*Documentation:\*\* /reference/api-reference/connected-accounts/deleteConnectedAccountsByNanoid

\> \*\*API version:\*\* This page documents Composio REST API v3.1, the current version, at \`https://backend.composio.dev/api/v3.1\`. \`https://backend.composio.dev/api/v3\` is the previous version and remains supported.

Deletes a connected account. The account immediately stops working for API calls and cannot be restored through the API. Pass \`?revoke\_on\_delete=true\` to also revoke the account's upstream credentials.

\-\-\-

\## DELETE \`/api/v3.1/connected\_accounts/{nanoid}\`

\*\*Endpoint:\*\* \`https://backend.composio.dev/api/v3.1/connected\_accounts/{nanoid}\`

\*\*Summary:\*\* Delete a connected account

Deletes a connected account. The account immediately stops working for API calls and cannot be restored through the API. Pass \`?revoke\_on\_delete=true\` to also revoke the account's upstream credentials.

\### Authentication

\*\*ApiKeyAuth\*\* - API Key in \`header\` header \`x-api-key\` OR \*\*UserApiKeyAuth\*\* - API Key in \`header\` header \`x-user-api-key\`

\### Path Parameters

\- \`nanoid\` (string (connectedAccountId)) \*(required)\*: The unique identifier (nanoid) of the connected account

\### Query Parameters

\- \`revoke\_on\_delete\` (boolean,null): When \`true\`, the delete also starts a background job that revokes the upstream credentials of every connected account in scope, and the response carries a \`revoke\_job\_id\`. Defaults to \`false\`. Revocation is irreversible — recovering a deleted entity does not restore working credentials.

\### Responses

\#### 200 - Successfully deleted the connected account.

\*\*Response Schema:\*\*

\- \`success\` (boolean) \*(required)\*: Indicates whether the connected account was successfully deleted
\- \`revoke\_job\_id\` (string): Identifier of the background revoke job started for this delete. Present only when \`revoke\_on\_delete=true\`. Track the job and its per-connection results from the Composio dashboard — a programmatic endpoint to poll this job is not yet generally available.

\*\*Example Response:\*\*

\`\`\`json
{
 "success": true,
 "revoke\_job\_id": "string"
}
\`\`\`

\#### 400 - Bad request - Invalid nanoid format or other validation error

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 401 - Unauthorized - Authentication failed

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 403 - Forbidden - Insufficient permissions to delete this connected account

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 404 - Connected account not found - The specified account does not exist or has already been deleted

\*\*Response Schema:\*\*

\- \`error\` (object) \*(required)\*
 \- \`message\` (string) \*(required)\*
 \- \`code\` (number) \*(required)\*
 \- \`slug\` (string) \*(required)\*
 \- \`status\` (number) \*(required)\*
 \- \`request\_id\` (string)
 \- \`suggested\_fix\` (string)
 \- \`errors\` (array)

\#### 500 - Internal server error - Failed to delete the connected account due to a server-side issue

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
curl -X DELETE "https://backend.composio.dev/api/v3.1/connected\_accounts/string" \
 -H "x-api-key: YOUR\_API\_KEY"
\`\`\`

\-\-\-

\## REST API version

The current REST API version is \*\*v3.1\*\*, served at \`https://backend.composio.dev/api/v3.1\`. Prefer it for new code and new examples.

\`https://backend.composio.dev/api/v3\` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.
