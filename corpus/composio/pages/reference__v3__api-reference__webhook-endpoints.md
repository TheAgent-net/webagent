---
url: https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints
title: Webhook Endpoints | Composio
description: Per-OAuth-app webhook ingress endpoints. Inbound URLs the provider posts to, plus signing secret storage and verification.
status: 200
---

API Reference

# Webhook Endpoints

Copy page

Webhook endpoints are per-OAuth-app webhook ingress configurations. They define the inbound URL a provider posts events to, along with the signing secret Composio stores and uses to verify those incoming payloads.

Reach for these endpoints when an OAuth app you have configured needs to deliver provider-side events into Composio. You create an endpoint, configure or update it by its `nano_id`, and store the signing secret Composio uses to authenticate inbound requests.

Each endpoint is addressed by its `nano_id`. The `POST` to `/webhook_endpoints/{nano_id}` replaces the full configuration, while `PATCH` updates it in place.

This is distinct from [webhook subscriptions](https://docs.composio.dev/reference/api-reference/webhook-subscriptions), which control where Composio delivers outbound trigger events. To verify the signature on payloads Composio sends you, see [Verifying signatures](https://docs.composio.dev/docs/setting-up-triggers/subscribing-to-events#verifying-signatures). To set up the trigger events those payloads carry, see [Triggers](https://docs.composio.dev/docs/triggers).

## [Endpoints](https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints\#endpoints)

| Endpoint | Quick Link |
| --- | --- |
| `POST /api/v3/webhook_endpoints` | [Create webhook endpoint](https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints/postWebhookEndpoints) |
| `GET /api/v3/webhook_endpoints` | [List webhook endpoints](https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints/getWebhookEndpoints) |
| `GET /api/v3/webhook_endpoints/{nano_id}` | [Get webhook endpoint](https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints/getWebhookEndpointsByNanoId) |
| `POST /api/v3/webhook_endpoints/{nano_id}` | [Put webhook endpoint configuration](https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints/postWebhookEndpointsByNanoId) |
| `PATCH /api/v3/webhook_endpoints/{nano_id}` | [Update webhook endpoint configuration](https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints/patchWebhookEndpointsByNanoId) |

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/webhook-endpoints/index.mdx)

### On this page

[Endpoints](https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints#endpoints)
