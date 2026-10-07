---
url: https://docs.composio.dev/reference/api-reference/webhook-events/composio_trigger_disabled
title: Trigger disabled | Composio
description: Fired when Composio automatically disables a trigger (for example, auth expired or the webhook subscription can no longer be refreshed). Not fired when you disable the trigger or its connected account yourself.
status: 200
---

API Reference [Webhook Events](https://docs.composio.dev/reference/api-reference/webhook-events)

# Trigger disabled

Copy page

Fired when Composio automatically disables a trigger (for example, auth expired or the webhook subscription can no longer be refreshed). Not fired when you disable the trigger or its connected account yourself.

## [Header Parameters](https://docs.composio.dev/reference/api-reference/webhook-events/composio_trigger_disabled\#parameters-header)

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

## [Request Body](https://docs.composio.dev/reference/api-reference/webhook-events/composio_trigger_disabled\#request-body)

`application/json`

idstringRequired

Unique event id (msg\_). Also sent as the `webhook-id` header and stable across delivery retries — use it for idempotency.

timestampstringRequired

ISO 8601 timestamp of when the event was created.

Format:`date-time`

typeenumRequired

Possible values:

`composio.trigger.disabled`

dataobjectRequired

Show 7 child attributes

metadataobjectRequired

Show 1 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/webhook-events/composio_trigger_disabled\#response-body)

### 200

Example Requests

POST`/composio.trigger.disabled`

### Request Body`application/json`

### Header Parameters

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/webhook-events/composio_trigger_disabled.mdx)
