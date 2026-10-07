---
url: https://docs.composio.dev/reference/api-reference/tools/postToolsScopesRequired.md
title: https://docs.composio.dev/reference/api-reference/tools/postToolsScopesRequired.md
description: 
status: 200
---

\# Get required scopes for tools

\*\*Documentation:\*\* /reference/api-reference/tools/postToolsScopesRequired

\> \*\*API version:\*\* This page documents Composio REST API v3.1, the current version, at \`https://backend.composio.dev/api/v3.1\`. \`https://backend.composio.dev/api/v3\` is the previous version and remains supported.

Resolves required scopes for the specified tools at a given toolkit version. All requested tools must belong to the same toolkit. Returns the flat scope union plus per-tool structured scope requirements when available.

\-\-\-

\## POST \`/api/v3.1/tools/scopes/required\`

\*\*Endpoint:\*\* \`https://backend.composio.dev/api/v3.1/tools/scopes/required\`

\*\*Summary:\*\* Get required scopes for tools

Resolves required scopes for the specified tools at a given toolkit version. All requested tools must belong to the same toolkit. Returns the flat scope union plus per-tool structured scope requirements when available.

\### Authentication

\*\*ApiKeyAuth\*\* - API Key in \`header\` header \`x-api-key\`

\### Request Body

\*\*Schema:\*\*

\- \`tools\` (array) \*(required)\*: Tool slugs to resolve scopes for. All tools must belong to the same toolkit.
\- \`version\` (string): Toolkit version to resolve scopes against for the requested toolkit. Defaults to \`latest\` when omitted on REST API v3.1.

\*\*Example:\*\*

\`\`\`json
{
 "tools": \[\
 "string"\
 \],
 "version": "string"
}
\`\`\`

\### Responses

\#### 200 - Successfully retrieved scopes for the specified tools

\*\*Response Schema:\*\*

\- \`scopes\_required\` (array) \*(required)\*: A combined list of all unique scopes required by the specified tools
\- \`per\_tool\_requirements\` (array) \*(required)\*: Per-tool structured scope requirements. Null scope\_requirements marks unmigrated legacy tools.
 \- Array items:
 \- \`tool\` (string) \*(required)\*
 \- \`scope\_requirements\` (object,null) \*(required)\*

\*\*Example Response:\*\*

\`\`\`json
{
 "scopes\_required": \[\
 "string"\
 \],
 "per\_tool\_requirements": \[\
 {\
 "tool": "string",\
 "scope\_requirements": null\
 }\
 \]
}
\`\`\`

\#### 400 - Bad request - Invalid body parameters or tools from different toolkits

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

\#### 404 - Not found - One or more tools could not be resolved for the requested version

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

\### Example cURL Request

\`\`\`bash
curl -X POST "https://backend.composio.dev/api/v3.1/tools/scopes/required" \
 -H "x-api-key: YOUR\_API\_KEY" \
 -H "Content-Type: application/json" \
 -d '{
 "tools": \[\
 "string"\
 \],
 "version": "string"
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
