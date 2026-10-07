---
url: https://docs.composio.dev/reference/api-reference/webhook-events
title: Webhook Events | Composio
description: Events delivered by Composio to your registered webhook endpoints
status: 200
---

API Reference

# Webhook Events

Copy page

Webhook events delivered by the Composio platform to your registered endpoints.

Configure your webhook subscriptions via the [Webhook Subscriptions API](https://docs.composio.dev/reference/api-reference/webhook-subscriptions/postWebhookSubscriptions), and verify signatures as described in [Verifying signatures](https://docs.composio.dev/docs/setting-up-triggers/subscribing-to-events#verifying-signatures).

## [Events](https://docs.composio.dev/reference/api-reference/webhook-events\#events)

| Event | Description |
| --- | --- |
| `composio.trigger.message` | [Trigger message](https://docs.composio.dev/reference/api-reference/webhook-events/composio_trigger_message) |
| `composio.connected_account.expired` | [Connection expired](https://docs.composio.dev/reference/api-reference/webhook-events/composio_connected_account_expired) |
| `composio.trigger.disabled` | [Trigger disabled](https://docs.composio.dev/reference/api-reference/webhook-events/composio_trigger_disabled) |

## [Legacy payloads (deprecated)](https://docs.composio.dev/reference/api-reference/webhook-events\#legacy-payloads-deprecated)

Older subscriptions may still receive these payload formats. The event type is unchanged — only the payload shape differs, selected by the subscription's version. You can upgrade an existing subscription at any time by updating its `version` — see [Update a webhook subscription](https://docs.composio.dev/reference/api-reference/webhook-subscriptions/patchWebhookSubscriptionsById). New integrations should use the current events above.

| Event | Version | Description |
| --- | --- | --- |
| `composio.trigger.message` | V2 | [Trigger message (V2)](https://docs.composio.dev/reference/api-reference/webhook-events/composio_trigger_message_v2) |
| `composio.trigger.message` | V1 | [Trigger message (V1)](https://docs.composio.dev/reference/api-reference/webhook-events/composio_trigger_message_v1) |

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/webhook-events/index.mdx)

### On this page

[Events](https://docs.composio.dev/reference/api-reference/webhook-events#events) [Legacy payloads (deprecated)](https://docs.composio.dev/reference/api-reference/webhook-events#legacy-payloads-deprecated)
