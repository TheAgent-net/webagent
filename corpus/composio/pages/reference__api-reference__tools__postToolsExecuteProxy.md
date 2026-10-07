---
url: https://docs.composio.dev/reference/api-reference/tools/postToolsExecuteProxy
title: Execute proxy request | Composio
description: Proxy an HTTP request to a third-party API using connected account credentials. This endpoint allows making authenticated API calls to external services while abstracting away authentication details.
status: 200
---

API Reference [Tools](https://docs.composio.dev/reference/api-reference/tools)

# Execute proxy requestv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`tools`/`execute`/`proxy`

Send

Authorization

Body

Proxy an HTTP request to a third-party API using connected account credentials. This endpoint allows making authenticated API calls to external services while abstracting away authentication details.

## [Authorization](https://docs.composio.dev/reference/api-reference/tools/postToolsExecuteProxy\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/api-reference/tools/postToolsExecuteProxy\#request-body)

`application/json`

connected\_account\_idstring

The ID of the connected account to use for authentication (if not provided, will use the default account for the project)

Format:`connectedAccountId`

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

custom\_connection\_dataobjectDeprecated

Show 3 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/tools/postToolsExecuteProxy\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

### 422  `application/json`

### 429  `application/json`

### 500  `application/json`

### 501  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X POST "https://backend.composio.dev/api/v3.1/tools/execute/proxy" \  -H "x-api-key: " \  -H "Content-Type: application/json" \  -d '{    "endpoint": "/api/v1/resources",    "method": "GET"  }'
```

200400401403404422429500501

```
{  "data": {    "id": "123",    "name": "Resource Name",    "created_at": "2023-01-01T00:00:00Z"  },  "binary_data": {    "url": "string",    "content_type": "string",    "size": 0,    "expires_at": "string"  },  "status": 200,  "headers": {    "content-type": "application/json",    "cache-control": "no-cache",    "host": "api.example.com"  }}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/tools/postToolsExecuteProxy.mdx)
