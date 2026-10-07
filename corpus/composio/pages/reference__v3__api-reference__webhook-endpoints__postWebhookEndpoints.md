---
url: https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints/postWebhookEndpoints
title: Create webhook endpoint | Composio
description: Creates a shared webhook endpoint for a toolkit + OAuth app + project. Returns the webhook URL that the customer registers in their app dashboard. Idempotent — returns existing endpoint if one already exists for this toolkit + client_id + project.
status: 200
---

API Reference [Webhook Endpoints](https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints)

# Create webhook endpointv3.0

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3`/`webhook_endpoints`

Send

Authorization

Body

Creates a shared webhook endpoint for a toolkit + OAuth app + project. Returns the webhook URL that the customer registers in their app dashboard. Idempotent — returns existing endpoint if one already exists for this toolkit + client\_id + project.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints/postWebhookEndpoints\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints/postWebhookEndpoints\#request-body)

`application/json`

toolkit\_slugstringRequired

Toolkit identifier (e.g., slack, discord)

client\_idstringRequired

OAuth app client ID — identifies which app this endpoint is for

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints/postWebhookEndpoints\#response-body)

### 200  `application/json`

### 201  `application/json`

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
curl -X POST "https://backend.composio.dev/api/v3/webhook_endpoints" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "toolkit_slug": "string",
    "client_id": "string"
  }'
```

200201400401404500

```
{
  "id": "string",
  "toolkit_slug": "string",
  "client_id": "string",
  "webhook_url": "string",
  "data": {
    "property1": "string",
    "property2": "string"
  },
  "created_at": "string"
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/webhook-endpoints/postWebhookEndpoints.mdx)
