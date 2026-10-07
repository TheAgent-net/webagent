---
url: https://docs.composio.dev/reference/api-reference/webhook-subscriptions/getWebhookSubscriptionsById
title: Get webhook subscription | Composio
description: Retrieves a webhook subscription by ID.
status: 200
---

API Reference [Webhook Subscriptions](https://docs.composio.dev/reference/api-reference/webhook-subscriptions)

# Get webhook subscriptionv3.1

Copy page

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3.1`/`webhook_subscriptions`/`{id}`

Send

Authorization

Path

Retrieves a webhook subscription by ID.

## [Authorization](https://docs.composio.dev/reference/api-reference/webhook-subscriptions/getWebhookSubscriptionsById\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/webhook-subscriptions/getWebhookSubscriptionsById\#parameters-path)

idstringRequired

Webhook subscription ID

Format:`webhookSubscriptionId`

## [Response Body](https://docs.composio.dev/reference/api-reference/webhook-subscriptions/getWebhookSubscriptionsById\#response-body)

### 200  `application/json`

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
curl -X GET "https://backend.composio.dev/api/v3.1/webhook_subscriptions/string" \  -H "x-api-key: "
```

200401404500

```
{  "id": "string",  "webhook_url": "string",  "version": "V1",  "enabled_events": [    "string"  ],  "secret": "string",  "created_at": "string",  "updated_at": "string"}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/webhook-subscriptions/getWebhookSubscriptionsById.mdx)
