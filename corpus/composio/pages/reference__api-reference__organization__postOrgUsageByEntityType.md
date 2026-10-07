---
url: https://docs.composio.dev/reference/api-reference/organization/postOrgUsageByEntityType
title: Org usage breakdown | Composio
description: Grouped metering usage breakdown for the authenticated organization. Groups results by a single dimension or column key. By default includes all projects; use `filters.project_id` to restrict.
status: 200
---

API Reference [Organization](https://docs.composio.dev/reference/api-reference/organization)

# Org usage breakdownv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`org`/`usage`/`{entity_type}`

Send

Authorization

Path

Body

Grouped metering usage breakdown for the authenticated organization. Groups results by a single dimension or column key. By default includes all projects; use `filters.project_id` to restrict.

## [Authorization](https://docs.composio.dev/reference/api-reference/organization/postOrgUsageByEntityType\#authorization)

`OrgApiKeyAuth`

x-org-api-key<token>

Organization API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/organization/postOrgUsageByEntityType\#parameters-path)

entity\_typestringRequired

Metering entity type to break down (e.g. `tool_calls`, `sessions`).

## [Request Body](https://docs.composio.dev/reference/api-reference/organization/postOrgUsageByEntityType\#request-body)

`application/json`

fromnumber

Inclusive range start (Unix epoch milliseconds). Defaults to 30 days before `to`.

tonumber

Exclusive range end (Unix epoch milliseconds). Defaults to now.

group\_bystring

Dimension or column to group results by. Defaults to `tool_slug` for tool\_calls and `user_id` for sessions.

order\_byenum

Field to order groups by. Defaults to `total_quantity`.

Possible values:

`key``total_quantity``event_count`

order\_directionenum

Sort direction. Defaults to `desc`.

Possible values:

`asc``desc`

limitinteger

Maximum number of groups to return. Defaults to 100, max 1000.

filtersobject

Show 3 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/organization/postOrgUsageByEntityType\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

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
curl -X POST "https://backend.composio.dev/api/v3.1/org/usage/string" \
  -H "x-org-api-key: " \
  -H "Content-Type: application/json" \
  -d '{}'
```

200400401403404500

```
{
  "entity_type": "string",
  "unit": "string",
  "total_quantity": "string",
  "event_count": 0,
  "groups": [\
    {\
      "key": "string",\
      "total_quantity": "string",\
      "event_count": 0\
    }\
  ]
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/organization/postOrgUsageByEntityType.mdx)
