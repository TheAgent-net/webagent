---
url: https://docs.composio.dev/reference/v3/api-reference/organization-management/getOrgList
title: List organizations | Composio
description: Retrieves a list of organizations that the authenticated user has access to. This includes organizations where the user is a member with any role.
status: 200
---

API Reference [Organization Management](https://docs.composio.dev/reference/v3/api-reference/organization-management)

# List organizationsv3.0

Copy page

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3`/`org`/`list`

Send

Authorization

Query

Retrieves a list of organizations that the authenticated user has access to. This includes organizations where the user is a member with any role.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/organization-management/getOrgList\#authorization)

`UserApiKeyAuth`

x-user-api-key<token>

User API key authentication

In: `header`

## [Query Parameters](https://docs.composio.dev/reference/v3/api-reference/organization-management/getOrgList\#parameters-query)

limitinteger

Number of items per page, max allowed is 50

cursorstring

Cursor for pagination. The cursor is a base64 encoded string of the page and limit. The page is the page number and the limit is the number of items per page. The cursor is used to paginate through the items. The cursor is not required for the first page.

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/organization-management/getOrgList\#response-body)

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
curl -X GET "https://backend.composio.dev/api/v3/org/list" \
  -H "x-user-api-key: "
```

200400401404500

```
{
  "organizations": [\
    {\
      "id": "string",\
      "name": "string",\
      "created_at": "string",\
      "updated_at": "string"\
    }\
  ],
  "next_cursor": "string",
  "total_pages": 0,
  "current_page": 0,
  "total_items": 0
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/organization-management/getOrgList.mdx)
