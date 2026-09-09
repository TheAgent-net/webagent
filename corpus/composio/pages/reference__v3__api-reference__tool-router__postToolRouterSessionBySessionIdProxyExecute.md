---
url: https://docs.composio.dev/reference/v3/api-reference/tool-router/postToolRouterSessionBySessionIdProxyExecute
title: Execute proxy request within a tool router session | Composio
description: Execute any native API call on a toolkit with authentication automatically injected from Composio. This endpoint proxies HTTP requests to third-party APIs using connected account credentials resolved from the session context. Provide the toolkit slug, API endpoint, and HTTP method — Composio handles authentication injection, abstracting away credential management. Supports all HTTP methods, custom headers/query parameters, and binary request/response bodies.
status: 200
---

API Reference [Sessions (prev Tool Router)](https://docs.composio.dev/reference/v3/api-reference/tool-router)

# Execute proxy request within a tool router sessionv3.0

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3`/`tool_router`/`session`/`{session_id}`/`proxy_execute`

Send

Authorization

Path

Body

Execute any native API call on a toolkit with authentication automatically injected from Composio. This endpoint proxies HTTP requests to third-party APIs using connected account credentials resolved from the session context. Provide the toolkit slug, API endpoint, and HTTP method — Composio handles authentication injection, abstracting away credential management. Supports all HTTP methods, custom headers/query parameters, and binary request/response bodies.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/tool-router/postToolRouterSessionBySessionIdProxyExecute\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/v3/api-reference/tool-router/postToolRouterSessionBySessionIdProxyExecute\#parameters-path)

session\_idstring

Tool router session ID (required for public API, optional for internal - injected by middleware)

Format:`toolRouterSessionId`

## [Request Body](https://docs.composio.dev/reference/v3/api-reference/tool-router/postToolRouterSessionBySessionIdProxyExecute\#request-body)

`application/json`

toolkit\_slugstringRequired

The slug of the toolkit to use for the request

endpointstringRequired

The API endpoint to call (absolute URL or path relative to base URL of the connected account)

methodenumRequired

The HTTP method to use for the request

Possible values:

`GET``POST``PUT``DELETE``PATCH``HEAD`

bodynullable object

The request body (for POST, PUT, and PATCH requests)

binary\_bodyobject \| object

Binary body to send. For binary upload via URL: use {url: "https://...", content\_type?: "..."}. For binary upload via base64: use {base64: "...", content\_type?: "..."}.

Show 2 child attributes

parametersarray of object

Additional HTTP headers or query parameters to include in the request

Show item properties

custom\_connection\_dataobject

Show 3 child attributes

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/tool-router/postToolRouterSessionBySessionIdProxyExecute\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

### 413  `application/json`

### 429  `application/json`

### 500  `application/json`

### 502  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X POST "https://backend.composio.dev/api/v3/tool_router/session/{session_id}/proxy_execute" \  -H "x-api-key: " \  -H "Content-Type: application/json" \  -d '{    "toolkit_slug": "gmail",    "endpoint": "/api/v1/resources",    "method": "GET"  }'
```

200400401403404413429500502

```
{  "data": {    "id": "123",    "name": "Resource Name",    "created_at": "2023-01-01T00:00:00Z"  },  "binary_data": {    "url": "string",    "content_type": "string",    "size": 0,    "expires_at": "string"  },  "status": 200,  "headers": {    "content-type": "application/json",    "cache-control": "no-cache"  }}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/tool-router/postToolRouterSessionBySessionIdProxyExecute.mdx)
