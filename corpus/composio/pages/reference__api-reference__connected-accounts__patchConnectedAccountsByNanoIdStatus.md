---
url: https://docs.composio.dev/reference/api-reference/connected-accounts/patchConnectedAccountsByNanoIdStatus
title: Enable or disable a connected account | Composio
description: Updates the status of a connected account to either enabled (active) or disabled (inactive). Disabled accounts cannot be used for API calls but remain in the database.
status: 200
---

API Reference [Connected Accounts](https://docs.composio.dev/reference/api-reference/connected-accounts)

# Enable or disable a connected accountv3.1

Copy page

Server URL`https://backend.composio.dev/`

PATCH

``/`api`/`v3.1`/`connected_accounts`/`{nanoId}`/`status`

Send

Authorization

Path

Body

Updates the status of a connected account to either enabled (active) or disabled (inactive). Disabled accounts cannot be used for API calls but remain in the database.

## [Authorization](https://docs.composio.dev/reference/api-reference/connected-accounts/patchConnectedAccountsByNanoIdStatus\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/connected-accounts/patchConnectedAccountsByNanoIdStatus\#parameters-path)

nanoIdstringRequired

The unique identifier of the connected account

Format:`connectedAccountId`

## [Request Body](https://docs.composio.dev/reference/api-reference/connected-accounts/patchConnectedAccountsByNanoIdStatus\#request-body)

`application/json`

enabledbooleanRequired

Set to true to enable the account or false to disable it

## [Response Body](https://docs.composio.dev/reference/api-reference/connected-accounts/patchConnectedAccountsByNanoIdStatus\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

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
curl -X PATCH "https://backend.composio.dev/api/v3.1/connected_accounts/ca_1a2b3c4d5e6f/status" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true
  }'
```

200400401403404409500

```
{
  "success": true
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/connected-accounts/patchConnectedAccountsByNanoIdStatus.mdx)
