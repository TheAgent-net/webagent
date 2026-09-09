---
url: https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccountsCompleteAuth
title: Complete a deferred OAuth connection after identity verification | Composio
description: Redeems a single-use `session_uri` handed to a project's OAuth callback verifier. Composio validates that the caller's project owns the pending connection and that `user_id` matches the connection owner, then completes the token exchange and returns the now-ACTIVE connected account. The session is single-use.
status: 200
---

API Reference [Connected Accounts](https://docs.composio.dev/reference/api-reference/connected-accounts)

# Complete a deferred OAuth connection after identity verificationv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`connected_accounts`/`complete_auth`

Send

Authorization

Body

Redeems a single-use `session_uri` handed to a project's OAuth callback verifier. Composio validates that the caller's project owns the pending connection and that `user_id` matches the connection owner, then completes the token exchange and returns the now-ACTIVE connected account. The session is single-use.

## [Authorization](https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccountsCompleteAuth\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccountsCompleteAuth\#request-body)

`application/json`

session\_uristringRequired

The opaque session URI received on the verifier redirect.

user\_idstringRequired

The user this connection was initiated for.

## [Response Body](https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccountsCompleteAuth\#response-body)

### 200  `application/json`

### 400  `application/json`

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
curl -X POST "https://backend.composio.dev/api/v3.1/connected_accounts/complete_auth" \  -H "x-api-key: " \  -H "Content-Type: application/json" \  -d '{    "session_uri": "string",    "user_id": "string"  }'
```

200400401404500

```
{  "connected_account_id": "string",  "toolkit_slug": "string"}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/connected-accounts/postConnectedAccountsCompleteAuth.mdx)
