---
url: https://docs.composio.dev/reference/api-reference/tool-router/getToolRouterSessionBySessionIdTools.md
title: https://docs.composio.dev/reference/api-reference/tool-router/getToolRouterSessionBySessionIdTools.md
description: 
status: 200
---

\# List tools with schemas for a tool router session (v3.1)

\*\*Documentation:\*\* /reference/api-reference/tool-router/getToolRouterSessionBySessionIdTools

\> \*\*API version:\*\* This page documents Composio REST API v3.1, the current version, at \`https://backend.composio.dev/api/v3.1\`. \`https://backend.composio.dev/api/v3\` is the previous version and remains supported.

Returns tools available in a tool router session with complete schemas. Results are paginated; use \`next\_cursor\` to fetch the next page. Tools are returned in alphabetical order.

\-\-\-

\## GET \`/api/v3.1/tool\_router/session/{session\_id}/tools\`

\*\*Endpoint:\*\* \`https://backend.composio.dev/api/v3.1/tool\_router/session/{session\_id}/tools\`

\*\*Summary:\*\* List tools with schemas for a tool router session (v3.1)

Returns tools available in a tool router session with complete schemas. Results are paginated; use \`next\_cursor\` to fetch the next page. Tools are returned in alphabetical order.

\### Authentication

\*\*ApiKeyAuth\*\* - API Key in \`header\` header \`x-api-key\`

\### Path Parameters

\- \`session\_id\` (string (toolRouterSessionId)) \*(required)\*: Tool router session ID

\### Query Parameters

\- \`limit\` (integer): Number of items per page, max allowed is 500
\- \`cursor\` (string): Cursor for pagination. The cursor is a base64 encoded string of the page and limit. The page is the page number and the limit is the number of items per page. The cursor is used to paginate through the items. The cursor is not required for the first page.

\### Responses

\#### 200 - Successfully retrieved paginated tools with their complete schemas.

\*\*Response Schema:\*\*

\- \`items\` (array) \*(required)\*
 \- Array items:
 \- \`slug\` (string) \*(required)\*: Unique identifier for the tool
 \- \`name\` (string) \*(required)\*: Human-readable display name of the tool
 \- \`description\` (string) \*(required)\*: Detailed explanation of the tool's functionality and purpose
 \- \`toolkit\` (object) \*(required)\*
 \- \`slug\` (string) \*(required)\*: Unique identifier of the parent toolkit
 \- \`name\` (string) \*(required)\*: Human-readable name of the parent toolkit
 \- \`logo\` (string) \*(required)\*: URL to the toolkit logo image
 \- \`input\_parameters\` (object) \*(required)\*: Schema definition of required input parameters for the tool
 \- \`\[key: string\]\` (any)
 \- \`no\_auth\` (boolean) \*(required)\*: Indicates if the tool can be used without authentication
 \- \`available\_versions\` (array) \*(required)\*: List of all available versions for this tool
 \- \`version\` (string) \*(required)\*: Current version of the tool
 \- \`output\_parameters\` (object) \*(required)\*: Schema definition of return values from the tool
 \- \`\[key: string\]\` (any)
 \- \`scopes\` (array) \*(required)\*: List of scopes associated with the tool
 \- \`scope\_requirements\` (object,null) \*(required)\*: Structured scope requirements for the tool. Null means the tool is legacy and only exposes flat scopes.
 \- \`tags\` (array) \*(required)\*: List of tags associated with the tool for categorization and filtering
 \- \`human\_description\` (string): Human-friendly description of the tool, if available
 \- \`is\_deprecated\` (boolean) \*(required)\*: Indicates if this tool is deprecated and may be removed in the future
 \- \`deprecated\` (object) \*(required)\*
 \- \`displayName\` (string) \*(required)\*: The display name of the tool
 \- \`version\` (string) \*(required)\*: Current version identifier of the tool
 \- \`available\_versions\` (array) \*(required)\*: List of all available versions for this tool
 \- \`is\_deprecated\` (boolean) \*(required)\*: Indicates if this tool is deprecated and may be removed in the future
 \- \`toolkit\` (object) \*(required)\*
 \- \`logo\` (string) \*(required)\*: URL to the toolkit logo image
\- \`next\_cursor\` (string,null)
\- \`total\_pages\` (number) \*(required)\*
\- \`current\_page\` (number) \*(required)\*
\- \`total\_items\` (number) \*(required)\*

\*\*Example Response:\*\*

\`\`\`json
{
 "items": \[\
 {\
 "slug": "string",\
 "name": "string",\
 "description": "string",\
 "toolkit": {\
 "slug": "...",\
 "name": "...",\
 "logo": "..."\
 },\
 "input\_parameters": {\
 "key": "..."\
 },\
 "no\_auth": true,\
 "available\_versions": \[\
 "..."\
 \],\
 "version": "string",\
 "output\_parameters": {\
 "key": "..."\
 },\
 "scopes": \[\
 "..."\
 \],\
 "scope\_requirements": null,\
 "tags": \[\
 "..."\
 \],\
 "human\_description": "string",\
 "is\_deprecated": true,\
 "deprecated": {\
 "displayName": "...",\
 "version": "...",\
 "available\_versions": "...",\
 "is\_deprecated": "...",\
 "toolkit": "..."\
 }\
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

\#### 404 - Session not found

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
curl -X GET "https://backend.composio.dev/api/v3.1/tool\_router/session/string/tools" \
 -H "x-api-key: YOUR\_API\_KEY"
\`\`\`

\-\-\-

\## REST API version

The current REST API version is \*\*v3.1\*\*, served at \`https://backend.composio.dev/api/v3.1\`. Prefer it for new code and new examples.

\`https://backend.composio.dev/api/v3\` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.
