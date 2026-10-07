---
url: https://docs.composio.dev/reference/api-reference/webhook-events/composio_connected_account_expired
title: Connection expired | Composio
description: Fired when a connected account expires and needs re-authentication.
status: 200
---

API Reference [Webhook Events](https://docs.composio.dev/reference/api-reference/webhook-events)

# Connection expired

Copy page

Fired when a connected account expires and needs re-authentication.

## [Header Parameters](https://docs.composio.dev/reference/api-reference/webhook-events/composio_connected_account_expired\#parameters-header)

webhook-idstringRequired

Unique message id, stable across delivery retries. Use it as an idempotency key. Equals the payload `id`.

webhook-timestampstringRequired

Unix timestamp (seconds) of this delivery attempt.

webhook-signaturestringRequired

Base64 HMAC-SHA256 signature, formatted `v1,<signature>`, over `${webhook-id}.${webhook-timestamp}.${raw_body}`.

x-composio-webhook-versionstringRequired

Payload version for this subscription (for example `V3`).

x-composio-delivery-attemptstringRequired

Attempt number for this delivery, starting at `1` and incrementing on each retry. The payload and `webhook-id` are identical across attempts, so use `webhook-id` for idempotency rather than this value.

## [Request Body](https://docs.composio.dev/reference/api-reference/webhook-events/composio_connected_account_expired\#request-body)

`application/json`

idstringRequired

Unique event id (msg\_). Also sent as the `webhook-id` header and stable across delivery retries — use it for idempotency.

timestampstringRequired

ISO 8601 timestamp of when the event was created.

Format:`date-time`

typeenumRequired

Possible values:

`composio.connected_account.expired`

dataobjectRequired

Show 19 child attributes

metadataobjectRequired

Show 2 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/webhook-events/composio_connected_account_expired\#response-body)

### 200

Example Requests

POST`/composio.connected_account.expired`

### Request Body`application/json`

### Header Parameters

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/webhook-events/composio_connected_account_expired.mdx)
