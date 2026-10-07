---
url: https://docs.composio.dev/reference/api-reference/triggers/postTriggerInstancesBySlugUpsert
title: Create or update a trigger | Composio
description: Creates a new trigger instance or updates an existing one with the same configuration. Triggers listen for events from external services (webhooks or polling) and can invoke your workflows. If a matching trigger already exists and is disabled, it will be re-enabled. Provide either a connected_account_id to pin a specific user connection, or a user_id to auto-resolve the first active connection for that user and the trigger's toolkit.
status: 200
---

API Reference [Triggers](https://docs.composio.dev/reference/api-reference/triggers)

# Create or update a triggerv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`trigger_instances`/`{slug}`/`upsert`

Send

Authorization

Path

Body

Creates a new trigger instance or updates an existing one with the same configuration. Triggers listen for events from external services (webhooks or polling) and can invoke your workflows. If a matching trigger already exists and is disabled, it will be re-enabled. Provide either a connected\_account\_id to pin a specific user connection, or a user\_id to auto-resolve the first active connection for that user and the trigger's toolkit.

## [Authorization](https://docs.composio.dev/reference/api-reference/triggers/postTriggerInstancesBySlugUpsert\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/triggers/postTriggerInstancesBySlugUpsert\#parameters-path)

slugstringRequired

The slug of the trigger instance. Case-insensitive (internally normalized to uppercase).

## [Request Body](https://docs.composio.dev/reference/api-reference/triggers/postTriggerInstancesBySlugUpsert\#request-body)

`application/json`

connectedAuthIdstringDeprecated

DEPRECATED: This parameter will be removed in a future version. Please use connected\_account\_id instead.

Format:`connectedAccountId`

triggerConfigobjectDeprecated

DEPRECATED: This parameter will be removed in a future version. Please use trigger\_config instead.

Show 1 child attributes

connected\_account\_idstring

Connected account nanoid. Optional when user\_id is provided — the first active connection for that user and the trigger's toolkit is auto-resolved.

Format:`connectedAccountId`

user\_idstring

The user id (entity id) that owns the connection. When connected\_account\_id is omitted, the first active connection for this user and the trigger's toolkit is auto-resolved (same as tool execution). When connected\_account\_id is also provided and the project has 2FA enabled, user\_id is validated against the owner of that connection.

trigger\_configobject

Trigger configuration

Show 1 child attributes

versionstringDeprecated

DEPRECATED: This parameter will be removed in a future version. Please use toolkit\_versions instead.

toolkit\_versionsstring \| object \| nullable object

Toolkit version specification. Supports "latest" string or a record mapping toolkit slugs to specific versions.

Show 3 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/triggers/postTriggerInstancesBySlugUpsert\#response-body)

### 200  `application/json`

### 201  `application/json`

### 204  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

### 408  `application/json`

### 409  `application/json`

### 410  `application/json`

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
curl -X POST "https://backend.composio.dev/api/v3.1/trigger_instances/string/upsert" \  -H "x-api-key: " \  -H "Content-Type: application/json" \  -d '{}'
```

200201204400401403404408409410422429500501

```
{  "trigger_id": "string"}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/triggers/postTriggerInstancesBySlugUpsert.mdx)
