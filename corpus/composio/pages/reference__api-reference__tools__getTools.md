---
url: https://docs.composio.dev/reference/api-reference/tools/getTools
title: List available tools | Composio
description: Retrieve a paginated list of available tools with comprehensive filtering, sorting and search capabilities. Use query parameters to narrow down results by toolkit, tags, or search terms.
status: 200
---

API Reference [Tools](https://docs.composio.dev/reference/api-reference/tools)

# List available toolsv3.1

Copy page

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3.1`/`tools`

Send

Authorization

Query

Retrieve a paginated list of available tools with comprehensive filtering, sorting and search capabilities. Use query parameters to narrow down results by toolkit, tags, or search terms.

## [Authorization](https://docs.composio.dev/reference/api-reference/tools/getTools\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Query Parameters](https://docs.composio.dev/reference/api-reference/tools/getTools\#parameters-query)

toolkit\_slugstring

The slug of the toolkit to filter by

tool\_slugsstring

Comma-separated list of specific tool slugs to retrieve (overrides other filters)

auth\_config\_idsstring \| string\[\]

Comma-separated list of auth config IDs to filter tools by

importantenum

Filter to only show important/featured tools (set to "true" to enable)

Possible values:

`true``false`

tagsarray of string

Filter tools by one or more tags (can be specified multiple times)

scopesnullable array

Array of scopes to filter tools by)

querystring

Full-text search query to filter tools by name, slug, or description. Applied as a soft filter on top of other filters.

searchstringDeprecated

Deprecated: use "query" instead. Free-text search query to find tools by name, description, or functionality.

include\_deprecatedboolean

Include deprecated tools in the response

Default:`true`

toolkit\_versionsnull \| string \| object

Toolkit version specification. Use "latest" for latest versions or bracket notation for specific versions per toolkit. Defaults to the latest published version ("latest") when omitted.

Show 3 child attributes

limitnullable number

Number of items per page, max allowed is 1000

cursorstring

Cursor for pagination. The cursor is a base64 encoded string of the page and limit. The page is the page number and the limit is the number of items per page. The cursor is used to paginate through the items. The cursor is not required for the first page.

## [Response Body](https://docs.composio.dev/reference/api-reference/tools/getTools\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

### 429  `application/json`

### 500  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X GET "https://backend.composio.dev/api/v3.1/tools?toolkit_versions=latest" \  -H "x-api-key: "
```

200400401403404429500

```
{  "items": [    {      "slug": "GITHUB_CREATE_A_WORKFLOW_DISPATCH_EVENT",      "name": "GitHub Actions",      "description": "Automate GitHub workflows including CI/CD, issue management, and release processes",      "toolkit": {        "slug": "github",        "name": "GitHub",        "logo": "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"      },      "input_parameters": {        "repo_name": {          "type": "string",          "description": "GitHub repository name in owner/repo format",          "required": true,          "example": "octocat/Hello-World"        },        "workflow_id": {          "type": "string",          "description": "ID or filename of the workflow to trigger",          "required": true,          "example": "main.yml"        }      },      "no_auth": false,      "available_versions": [        "20250905_00",        "20250906_00"      ],      "version": "20250905_00",      "output_parameters": {        "run_id": {          "type": "number",          "description": "ID of the workflow run that was triggered",          "example": 12345678        },        "status": {          "type": "string",          "description": "Status of the workflow run",          "example": "completed",          "enum": [            "queued",            "in_progress",            "completed",            "failed"          ]        }      },      "scopes": [        "https://www.googleapis.com/auth/gmail.modify"      ],      "scope_requirements": {        "all_of": [          "read:user",          {            "any_of": [              "repo",              "public_repo"            ]          }        ]      },      "tags": [        "ci-cd",        "github",        "automation",        "devops"      ],      "human_description": "Create a new issue in a GitHub repository",      "is_deprecated": false,      "deprecated": {        "displayName": "GitHub Actions",        "version": "20250905_00",        "available_versions": [          "20250905_00",          "20250906_00"        ],        "is_deprecated": false,        "toolkit": {          "logo": "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"        }      }    }  ],  "next_cursor": "string",  "total_pages": 0,  "current_page": 0,  "total_items": 0}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/tools/getTools.mdx)
