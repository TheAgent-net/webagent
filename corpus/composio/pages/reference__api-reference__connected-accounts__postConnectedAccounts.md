---
url: https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccounts
title: Create a new connected account | Composio
description: Initiates a new connection to an external service for a user. For OAuth-based toolkits, this returns a redirect URL to complete authentication. For API key-based toolkits, provide the credentials directly in the request body. Use the `user_id` field to associate the connection with a specific user in your system.  **Deprecated for Composio-managed OAuth:** For Composio-managed auth configs on OAuth1, OAuth2, or DCR_OAUTH schemes, this endpoint is being retired and will start returning `400 BadRequest` on **2026-05-08** for new organizations and **2026-07-03** for all remaining organizations. Migrate those calls to `POST /api/v3/connected_accounts/link`. Custom auth configs and non-OAuth schemes (API key, bearer, basic) continue to be supported here. Responses on the retiring path carry a `Deprecation` header (RFC 9745) and a `Sunset` header (RFC 8594) for client-side detection.  **Credential check:** where the toolkit supports it, submitted API key, basic, and bearer credentials are checked against the provider before the connection is stored — no opt-in required. For toolkits with the check enabled, credentials the provider rejects fail the request with `ConnectedAccount_CredentialValidationRejected`. If the provider is unreachable, times out, or returns an error of its own, the connection is created as normal.
status: 200
---

API Reference [Connected Accounts](https://docs.composio.dev/reference/api-reference/connected-accounts)

# Create a new connected accountv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`connected_accounts`

Send

Authorization

Body

Initiates a new connection to an external service for a user. For OAuth-based toolkits, this returns a redirect URL to complete authentication. For API key-based toolkits, provide the credentials directly in the request body. Use the `user_id` field to associate the connection with a specific user in your system.

**Deprecated for Composio-managed OAuth:** For Composio-managed auth configs on OAuth1, OAuth2, or DCR\_OAUTH schemes, this endpoint is being retired and will start returning `400 BadRequest` on **2026-05-08** for new organizations and **2026-07-03** for all remaining organizations. Migrate those calls to `POST /api/v3/connected_accounts/link`. Custom auth configs and non-OAuth schemes (API key, bearer, basic) continue to be supported here. Responses on the retiring path carry a `Deprecation` header (RFC 9745) and a `Sunset` header (RFC 8594) for client-side detection.

**Credential check:** where the toolkit supports it, submitted API key, basic, and bearer credentials are checked against the provider before the connection is stored — no opt-in required. For toolkits with the check enabled, credentials the provider rejects fail the request with `ConnectedAccount_CredentialValidationRejected`. If the provider is unreachable, times out, or returns an error of its own, the connection is created as normal.

## [Authorization](https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccounts\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccounts\#request-body)

`application/json`

auth\_configobjectRequired

Show 1 child attributes

connectionobjectRequired

Show 8 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/connected-accounts/postConnectedAccounts\#response-body)

### 201  `application/json`

### 400  `application/json`

### 401  `application/json`

### 404  `application/json`

### 422  `application/json`

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
curl -X POST "https://backend.composio.dev/api/v3.1/connected_accounts" \  -H "x-api-key: " \  -H "Content-Type: application/json" \  -d '{    "auth_config": {      "id": "string"    },    "connection": {}  }'
```

201400401404422500501

```
{  "id": "string",  "connectionData": {    "authScheme": "OAUTH1",    "val": {      "subdomain": "string",      "your-domain": "string",      "region": "string",      "shop": "string",      "account_url": "string",      "COMPANYDOMAIN": "string",      "extension": "string",      "form_api_base_url": "string",      "instanceEndpoint": "string",      "api_url": "string",      "borneo_dashboard_url": "string",      "proxy_username": "string",      "proxy_password": "string",      "domain": "string",      "version": "string",      "dc": "string",      "site_name": "string",      "instanceName": "string",      "account_id": "string",      "your_server": "string",      "server_location": "string",      "base_url": "string",      "status": "INITIALIZING",      "oauth_token": "string",      "authUri": "string",      "oauth_token_secret": "string",      "redirectUrl": "string",      "callbackUrl": "string",      "oauth_verifier": "string",      "consumer_key": "string",      "callback_url": "string",      "error": "string",      "error_description": "string",      "expired_at": "string"    }  },  "status": "INITIALIZING",  "redirect_url": "string",  "redirect_uri": "string",  "experimental": {    "account_type": "PRIVATE",    "acl_config_for_shared": {      "allow_all_users": true,      "allowed_user_ids": [        "string"      ],      "not_allowed_user_ids": [        "string"      ]    }  }}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/connected-accounts/postConnectedAccounts.mdx)
