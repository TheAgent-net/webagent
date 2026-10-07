---
url: https://docs.composio.dev/reference/api-reference/toolkits/getToolkits
title: List available toolkits | Composio
description: Retrieves a comprehensive list of toolkits of their latest versions that are available to the authenticated project. Toolkits represent integration points with external services and applications, each containing a collection of tools and triggers. This endpoint supports filtering by category and management type, as well as different sorting options.
status: 200
---

API Reference [Toolkits](https://docs.composio.dev/reference/api-reference/toolkits)

# List available toolkitsv3.1

Copy page

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3.1`/`toolkits`

Send

Authorization

Query

Retrieves a comprehensive list of toolkits of their latest versions that are available to the authenticated project. Toolkits represent integration points with external services and applications, each containing a collection of tools and triggers. This endpoint supports filtering by category and management type, as well as different sorting options.

## [Authorization](https://docs.composio.dev/reference/api-reference/toolkits/getToolkits\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Query Parameters](https://docs.composio.dev/reference/api-reference/toolkits/getToolkits\#parameters-query)

categorystring

Filter toolkits by category

managed\_byenum

Filter toolkits by who manages them

Possible values:

`composio``all``project`

typeenum

Filter toolkits by provenance (alias over managed\_by)

Possible values:

`native``custom``all`

sort\_byenum

Sort order for returned toolkits

Possible values:

`usage``alphabetically`

include\_deprecatednullable boolean

Include deprecated toolkits in the response

Default:`false`

searchstring

Search query to filter toolkits by name, slug, or description

limitnullable number

Number of items per page, max allowed is 1000

cursorstring

Cursor for pagination. The cursor is a base64 encoded string of the page and limit. The page is the page number and the limit is the number of items per page. The cursor is used to paginate through the items. The cursor is not required for the first page.

## [Response Body](https://docs.composio.dev/reference/api-reference/toolkits/getToolkits\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

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
curl -X GET "https://backend.composio.dev/api/v3.1/toolkits" \
  -H "x-api-key: "
```

200400401404429500

```
{
  "items": [\
    {\
      "slug": "github",\
      "name": "GitHub",\
      "type": "native",\
      "auth_schemes": [\
        "oauth2",\
        "api_key"\
      ],\
      "composio_managed_auth_schemes": [\
        "oauth2"\
      ],\
      "is_local_toolkit": false,\
      "no_auth": false,\
      "auth_guide_url": "https://composio.dev/auth/github",\
      "deprecated": {\
        "toolkitId": "550e8400-e29b-41d4-a716-446655440000"\
      },\
      "meta": {\
        "created_at": "2023-01-15T09:30:00.000Z",\
        "updated_at": "2023-05-20T14:45:00.000Z",\
        "description": "Integrate with GitHub repositories, issues, pull requests, and more.",\
        "logo": "https://assets.composio.dev/logos/github.png",\
        "app_url": "https://github.com",\
        "categories": [\
          {\
            "id": "developer-tools",\
            "name": "Developer Tools"\
          },\
          {\
            "id": "productivity",\
            "name": "Productivity"\
          }\
        ],\
        "triggers_count": 5,\
        "tools_count": 12,\
        "version": "20250905_00"\
      }\
    }\
  ],
  "next_cursor": "string",
  "total_pages": 0,
  "current_page": 0,
  "total_items": 0
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/toolkits/getToolkits.mdx)
