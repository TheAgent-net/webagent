---
url: https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccountsByNanoidRevoke
title: Revoke a connected account at the provider | Composio
description: Best-effort upstream revocation. On success, the connection transitions to REVOKED. Returns 400 when the toolkit does not support programmatic revocation, 409 when the connection is not in a revokable state, 500 when every upstream dispatch fails.
status: 200
---

API Reference [Connected Accounts](https://docs.composio.dev/reference/api-reference/connected-accounts)

# Revoke a connected account at the providerv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`connected_accounts`/`{nanoid}`/`revoke`

Send

Authorization

Path

Best-effort upstream revocation. On success, the connection transitions to REVOKED. Returns 400 when the toolkit does not support programmatic revocation, 409 when the connection is not in a revokable state, 500 when every upstream dispatch fails.

## [Authorization](https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccountsByNanoidRevoke\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccountsByNanoidRevoke\#parameters-path)

nanoidstringRequired

The unique identifier of the connected account

Format:`connectedAccountId`

## [Response Body](https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccountsByNanoidRevoke\#response-body)

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
curl -X POST "https://backend.composio.dev/api/v3.1/connected_accounts/ca_1a2b3c4d5e6f/revoke" \
  -H "x-api-key: "
```

200400401403404409500

```
{
  "revoked_tokens": [\
    "access_token",\
    "refresh_token"\
  ],
  "connected_account": {
    "id": "ca_1a2b3c4d5e6f",
    "status": "REVOKED"
  }
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/connected-accounts/postConnectedAccountsByNanoidRevoke.mdx)
