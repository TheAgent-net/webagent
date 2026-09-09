---
url: https://docs.composio.dev/reference/api-reference/webhook-endpoints/getWebhookEndpoints
title: List webhook endpoints | Composio
description: Lists webhook endpoints for the authenticated project, optionally filtered by toolkit.
status: 200
---

API Reference [Webhook Endpoints](https://docs.composio.dev/reference/api-reference/webhook-endpoints)

# List webhook endpointsv3.1

Copy page

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3.1`/`webhook_endpoints`

Send

Authorization

Query

Lists webhook endpoints for the authenticated project, optionally filtered by toolkit.

## [Authorization](https://docs.composio.dev/reference/api-reference/webhook-endpoints/getWebhookEndpoints\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Query Parameters](https://docs.composio.dev/reference/api-reference/webhook-endpoints/getWebhookEndpoints\#parameters-query)

toolkit\_slugstring

Filter by toolkit slug

## [Response Body](https://docs.composio.dev/reference/api-reference/webhook-endpoints/getWebhookEndpoints\#response-body)

### 200  `application/json`

### 401  `application/json`

### 500  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X GET "https://backend.composio.dev/api/v3.1/webhook_endpoints" \
  -H "x-api-key: "
```

200401500

```
{
  "items": [\
    {\
      "id": "string",\
      "toolkit_slug": "string",\
      "client_id": "string"\
    }\
  ]
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/webhook-endpoints/getWebhookEndpoints.mdx)
