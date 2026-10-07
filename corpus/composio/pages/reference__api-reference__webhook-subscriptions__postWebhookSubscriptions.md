---
url: https://docs.composio.dev/reference/api-reference/webhook-subscriptions/postWebhookSubscriptions
title: Create webhook subscription | Composio
description: Creates a webhook subscription for the authenticated project. Only one subscription is allowed per project. The signing secret is returned in subscription responses.
status: 200
---

API Reference [Webhook Subscriptions](https://docs.composio.dev/reference/api-reference/webhook-subscriptions)

# Create webhook subscriptionv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`webhook_subscriptions`

Send

Authorization

Body

Creates a webhook subscription for the authenticated project. Only one subscription is allowed per project. The signing secret is returned in subscription responses.

## [Authorization](https://docs.composio.dev/reference/api-reference/webhook-subscriptions/postWebhookSubscriptions\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/api-reference/webhook-subscriptions/postWebhookSubscriptions\#request-body)

`application/json`

webhook\_urlstringRequired

HTTPS URL to receive webhook events

Format:`uri`

enabled\_eventsarray of stringRequired

Array of event types to subscribe to

versionenum

Webhook payload version

Default:`"V3"`

Possible values:

`V1``V2``V3`

## [Response Body](https://docs.composio.dev/reference/api-reference/webhook-subscriptions/postWebhookSubscriptions\#response-body)

### 201  `application/json`

### 400  `application/json`

### 401  `application/json`

### 409  `application/json`

### 500  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X POST "https://backend.composio.dev/api/v3.1/webhook_subscriptions" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_url": "http://example.com",
    "enabled_events": [\
      "string"\
    ]
  }'
```

201400401409500

```
{
  "id": "string",
  "webhook_url": "string",
  "version": "V1",
  "enabled_events": [\
    "string"\
  ],
  "secret": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/webhook-subscriptions/postWebhookSubscriptions.mdx)
