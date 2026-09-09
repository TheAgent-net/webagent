---
url: https://docs.composio.dev/reference/api-reference/tool-router/getToolRouterSessionBySessionIdConfigHistory
title: List a tool router session config history | Composio
description: Returns the session config history ordered by version DESC (newest first). The live (current) config appears once, on the first page only, with `is_current: true`; archived versions have `is_current: false`.
status: 200
---

API Reference [Sessions (prev Tool Router)](https://docs.composio.dev/reference/api-reference/tool-router)

# List a tool router session config historyv3.1

Copy page

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3.1`/`tool_router`/`session`/`{session_id}`/`config_history`

Send

Authorization

Path

Query

Returns the session config history ordered by version DESC (newest first). The live (current) config appears once, on the first page only, with `is_current: true`; archived versions have `is_current: false`.

## [Authorization](https://docs.composio.dev/reference/api-reference/tool-router/getToolRouterSessionBySessionIdConfigHistory\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/tool-router/getToolRouterSessionBySessionIdConfigHistory\#parameters-path)

session\_idstringRequired

The unique identifier of the tool router session

Format:`toolRouterSessionId`

## [Query Parameters](https://docs.composio.dev/reference/api-reference/tool-router/getToolRouterSessionBySessionIdConfigHistory\#parameters-query)

limitinteger

Number of items per page, max allowed is 100

cursorstring

Cursor for pagination. The cursor is a base64 encoded string of the page and limit. The page is the page number and the limit is the number of items per page. The cursor is used to paginate through the items. The cursor is not required for the first page.

## [Response Body](https://docs.composio.dev/reference/api-reference/tool-router/getToolRouterSessionBySessionIdConfigHistory\#response-body)

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
curl -X GET "https://backend.composio.dev/api/v3.1/tool_router/session/trs_1a2b3c4d5e6f/config_history" \  -H "x-api-key: "
```

200400401404500

```
{  "items": [    {      "version": 0,      "created_at": "2019-08-24T14:15:22Z",      "config": {        "user_id": "string",        "toolkits": {          "enabled": [            "string"          ]        },        "auth_configs": {          "property1": "string",          "property2": "string"        },        "manage_connections": {          "enabled": true,          "callback_url": "http://example.com",          "enable_wait_for_connections": false,          "enable_connection_removal": true        },        "tools": {          "property1": {            "enabled": [              "string"            ]          },          "property2": {            "enabled": [              "string"            ]          }        },        "tags": {          "enabled": [            "readOnlyHint"          ],          "disabled": [            "readOnlyHint"          ]        },        "workbench": {          "enable": true,          "proxy_execution_enabled": true        },        "multi_account": {          "enable": true,          "max_accounts_per_toolkit": 0,          "require_explicit_selection": true        },        "preload": {          "tools": [            "string"          ]        },        "connected_accounts": {          "property1": [            "string"          ],          "property2": [            "string"          ]        },        "search": {          "enable": true        },        "execute": {          "enable_multi_execute": true        }      },      "is_current": true    }  ],  "next_cursor": "string",  "total_pages": 0,  "current_page": 0,  "total_items": 0}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/tool-router/getToolRouterSessionBySessionIdConfigHistory.mdx)
