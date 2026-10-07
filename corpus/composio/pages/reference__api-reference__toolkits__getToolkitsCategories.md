---
url: https://docs.composio.dev/reference/api-reference/toolkits/getToolkitsCategories
title: List toolkit categories | Composio
description: Retrieves a comprehensive list of all available toolkit categories from their latest versions. These categories can be used to filter toolkits by type or purpose when using the toolkit listing endpoint. Categories help organize toolkits into logical groups based on their functionality or industry focus.
status: 200
---

API Reference [Toolkits](https://docs.composio.dev/reference/api-reference/toolkits)

# List toolkit categoriesv3.1

Copy page

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3.1`/`toolkits`/`categories`

Send

Authorization

Retrieves a comprehensive list of all available toolkit categories from their latest versions. These categories can be used to filter toolkits by type or purpose when using the toolkit listing endpoint. Categories help organize toolkits into logical groups based on their functionality or industry focus.

## [Authorization](https://docs.composio.dev/reference/api-reference/toolkits/getToolkitsCategories\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Response Body](https://docs.composio.dev/reference/api-reference/toolkits/getToolkitsCategories\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 404  `application/json`

### 500  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X GET "https://backend.composio.dev/api/v3.1/toolkits/categories" \  -H "x-api-key: "
```

200400401404500

```
{  "items": [    {      "name": "Developer Tools",      "id": "developer-tools"    }  ],  "next_cursor": "string",  "total_pages": 0,  "current_page": 0,  "total_items": 0}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/toolkits/getToolkitsCategories.mdx)
