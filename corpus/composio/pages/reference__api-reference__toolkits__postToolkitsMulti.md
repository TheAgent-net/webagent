---
url: https://docs.composio.dev/reference/api-reference/toolkits/postToolkitsMulti
title: Fetch multiple toolkits | Composio
description: Retrieves a comprehensive list of toolkits of their latest versions that are available to the authenticated project. Toolkits represent integration points with external services and applications, each containing a collection of tools and triggers. This endpoint supports filtering by category and management type, as well as different sorting options. You can optionally specify a list of toolkit slugs to fetch specific toolkits.
status: 200
---

API Reference [Toolkits](https://docs.composio.dev/reference/api-reference/toolkits)

# Fetch multiple toolkitsv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`toolkits`/`multi`

Send

Authorization

Body

Retrieves a comprehensive list of toolkits of their latest versions that are available to the authenticated project. Toolkits represent integration points with external services and applications, each containing a collection of tools and triggers. This endpoint supports filtering by category and management type, as well as different sorting options. You can optionally specify a list of toolkit slugs to fetch specific toolkits.

## [Authorization](https://docs.composio.dev/reference/api-reference/toolkits/postToolkitsMulti\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/api-reference/toolkits/postToolkitsMulti\#request-body)

`application/json`

toolkitsarray of string

Array of toolkit slug identifiers to retrieve

categorystring

Category ID or name to filter toolkits by

managed\_byenum

Entity responsible for managing the toolkits

Possible values:

`composio``all``project`

sort\_byenum

Determines how toolkits should be sorted in the response

Possible values:

`usage``alphabetically`

limitnullable number

cursorstring

## [Response Body](https://docs.composio.dev/reference/api-reference/toolkits/postToolkitsMulti\#response-body)

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
curl -X POST "https://backend.composio.dev/api/v3.1/toolkits/multi" \  -H "x-api-key: " \  -H "Content-Type: application/json" \  -d '{}'
```

200400401404429500

```
{  "items": [    {      "slug": "github",      "name": "GitHub",      "type": "native",      "auth_schemes": [        "oauth2",        "api_key"      ],      "composio_managed_auth_schemes": [        "oauth2"      ],      "is_local_toolkit": false,      "no_auth": false,      "auth_guide_url": "https://composio.dev/auth/github",      "deprecated": {        "toolkitId": "550e8400-e29b-41d4-a716-446655440000"      },      "meta": {        "created_at": "2023-01-15T09:30:00.000Z",        "updated_at": "2023-05-20T14:45:00.000Z",        "description": "Integrate with GitHub repositories, issues, pull requests, and more.",        "logo": "https://assets.composio.dev/logos/github.png",        "app_url": "https://github.com",        "categories": [          {            "id": "developer-tools",            "name": "Developer Tools"          },          {            "id": "productivity",            "name": "Productivity"          }        ],        "triggers_count": 5,        "tools_count": 12,        "version": "20250905_00"      }    }  ],  "next_cursor": "string",  "total_pages": 0,  "current_page": 0,  "total_items": 0}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/toolkits/postToolkitsMulti.mdx)
