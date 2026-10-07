---
url: https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks
title: Custom OAuth webhooks | Composio
description: Register Composio's ingress URL when you bring your own OAuth app
status: 200
---

Set up triggers

# Custom OAuth webhooks

Copy page

This page is only for **realtime triggers where you bring your own OAuth app**. With Composio-managed OAuth, ingress is already set up and you can skip this entirely. Create the trigger and events flow.

Some providers only deliver events to URLs you've registered on your OAuth app. When you bring your own app, you register Composio's ingress URL there once, so events can reach Composio. You need this only when the trigger type's `requires_webhook_endpoint_setup` flag is `true`.

Each OAuth app you bring gets its own ingress URL within a project:

```
https://backend.composio.dev/api/v3.1/webhook_ingress/{toolkit_slug}/{we_xxx}/trigger_event
```

A single OAuth app can serve at most one Composio project: providers accept only one callback URL per OAuth app, and each ingress URL routes to a single project. In return, every project becomes its own webhook tenant, with:

- **Its own ingress rate limit and backpressure budget**
- **Project-scoped credentials**: the signing secret and app-level token you provide are stored against this project alone, never shared across projects. Repeat verification handshakes are rejected after the endpoint is verified, so the signing secret can't be silently swapped by a forged challenge.
- **Clean fan-out**: events reach only that project's trigger instances
- **Per-project metering**

Every inbound event is signature-checked at ingress before any trigger fires:

- **HMAC-SHA256** for Slack, **Ed25519** or shared-token matching for other providers
- **Timestamp replay protection**: when the provider signs a request timestamp, requests outside the allowed skew window are rejected
- **Unsigned or tampered requests** are rejected with `400` at ingress, so third parties can't spoof events onto your triggers

**Sharing one OAuth app across projects?** Consolidate to a single project or register separate OAuth apps per project before continuing.

The walkthrough below uses Slack as the example and the [Webhook Endpoints API](https://docs.composio.dev/reference/api-reference/webhook-endpoints). For setup notes specific to each toolkit, see its FAQ section, for example [Slack](https://docs.composio.dev/toolkits/slack) or [Notion](https://docs.composio.dev/toolkits/notion).

## [Step 1: Discover what credentials the endpoint needs](https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks\#step-1-discover-what-credentials-the-endpoint-needs)

Call the schema endpoint for the toolkit. The `setup_fields` in the response tell you exactly what to collect from the provider's app dashboard.

```
curl "https://backend.composio.dev/api/v3.1/webhook_endpoints/schema?toolkit_slug=slack" \
  -H "x-api-key: <YOUR_COMPOSIO_API_KEY>"
```

Sample response:

```
{
  "toolkit_slug": "slack",
  "setup_fields": {
    "webhook_signing_secret": {
      "display_name": "Signing Secret",
      "description": "Webhook request signing secret from your Slack app dashboard",
      "is_required": true,
      "is_secret": true
    },
    "app_token": {
      "display_name": "App-Level Token",
      "description": "Slack xapp- token with authorizations:read scope for event authorization",
      "is_required": true,
      "is_secret": true
    }
  }
}
```

## [Step 2: Create the endpoint](https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks\#step-2-create-the-endpoint)

```
curl -X POST "https://backend.composio.dev/api/v3.1/webhook_endpoints" \
  -H "x-api-key: <YOUR_COMPOSIO_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "toolkit_slug": "slack",
    "client_id": "<YOUR_OAUTH_CLIENT_ID>"
  }'
```

Sample response:

```
{
  "id": "we_abc123",
  "toolkit_slug": "slack",
  "client_id": "<YOUR_OAUTH_CLIENT_ID>",
  "webhook_url": "https://backend.composio.dev/api/v3.1/webhook_ingress/slack/we_abc123/trigger_event",
  "data": null,
  "created_at": "2026-04-24T10:00:00.000Z"
}
```

Hold on to two values from the response: `id` (used as `<ENDPOINT_ID>` below) and `webhook_url` (you'll paste this into the provider's app dashboard in step 4). The call is **idempotent per `(toolkit_slug, client_id)` within a project**. Calling it again with the same pair returns the existing endpoint without rotating the URL or wiping the secret.

## [Step 3: Store the credentials returned by the schema](https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks\#step-3-store-the-credentials-returned-by-the-schema)

`PATCH` all the fields the schema returned in a single request. For Slack, that's the signing secret and (when needed) the app-level token together:

```
curl -X PATCH "https://backend.composio.dev/api/v3.1/webhook_endpoints/<ENDPOINT_ID>" \
  -H "x-api-key: <YOUR_COMPOSIO_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "webhook_signing_secret": "<SIGNING_SECRET>",
      "app_token": "xapp-..."
    }
  }'
```

For Slack, the credentials come from:

- **Signing secret**: Slack app → Basic Information → App Credentials → Signing Secret.
- **App-level token**: Slack app → Basic Information → App-Level Tokens, with scope `authorizations:read`. Required for direct messages, private channels, and reactions. Omit it if you only need public-channel events.

**Store the credentials before you switch the provider's callback URL in step 4.** If the provider posts to the URL without a secret on the endpoint, every request fails with `400`, and the provider may auto-disable the endpoint after a window of consecutive failures (Slack: ~36 hours).

## [Step 4: Point the provider's app dashboard at the URL](https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks\#step-4-point-the-providers-app-dashboard-at-the-url)

Paste the `webhook_url` from step 2 into the provider's app dashboard:

- **Slack** → Event Subscriptions → Request URL
- **Notion** → Webhook Endpoints (in the integration's settings)

For providers that issue a verification challenge on save (Slack `url_verification`, Notion's verification token, and so on), Composio responds automatically, with no handshake code on your side. Once the provider accepts the URL, go [create your trigger](https://docs.composio.dev/docs/setting-up-triggers/creating-triggers).

## [Updating an endpoint](https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks\#updating-an-endpoint)

To rotate the signing secret or update any single field, `PATCH` it (other fields are preserved):

```
curl -X PATCH "https://backend.composio.dev/api/v3.1/webhook_endpoints/<ENDPOINT_ID>" \
  -H "x-api-key: <YOUR_COMPOSIO_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{ "data": { "webhook_signing_secret": "<NEW_SECRET>" } }'
```

To **replace**`data` wholesale (any field you don't include is cleared), `POST` to the same URL:

```
curl -X POST "https://backend.composio.dev/api/v3.1/webhook_endpoints/<ENDPOINT_ID>" \
  -H "x-api-key: <YOUR_COMPOSIO_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{ "data": { "webhook_signing_secret": "<NEW_SECRET>", "app_token": "<NEW_APP_TOKEN>" } }'
```

The `webhook_url` is immutable for the lifetime of the endpoint. Rotating the signing secret on the provider side is a `PATCH` on the existing endpoint, not a new one.

To inspect a single endpoint:

```
curl "https://backend.composio.dev/api/v3.1/webhook_endpoints/<ENDPOINT_ID>" \
  -H "x-api-key: <YOUR_COMPOSIO_API_KEY>"
```

To list every endpoint in the current project:

```
curl "https://backend.composio.dev/api/v3.1/webhook_endpoints" \
  -H "x-api-key: <YOUR_COMPOSIO_API_KEY>"
```

## [Next](https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks\#next)

[**Creating triggers** \\
Activate a trigger for a user so events start flowing](https://docs.composio.dev/docs/setting-up-triggers/creating-triggers)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/setting-up-triggers/custom-oauth-webhooks.mdx)

### On this page

[Step 1: Discover what credentials the endpoint needs](https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks#step-1-discover-what-credentials-the-endpoint-needs) [Step 2: Create the endpoint](https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks#step-2-create-the-endpoint) [Step 3: Store the credentials returned by the schema](https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks#step-3-store-the-credentials-returned-by-the-schema) [Step 4: Point the provider's app dashboard at the URL](https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks#step-4-point-the-providers-app-dashboard-at-the-url) [Updating an endpoint](https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks#updating-an-endpoint) [Next](https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks#next)
