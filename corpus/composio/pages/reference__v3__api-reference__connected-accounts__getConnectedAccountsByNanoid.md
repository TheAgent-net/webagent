---
url: https://docs.composio.dev/reference/v3/api-reference/connected-accounts/getConnectedAccountsByNanoid
title: Get connected account details by ID | Composio
description: Retrieves comprehensive details of a connected account, including authentication configuration, connection status, and all parameters needed for API requests.
status: 200
---

API Reference [Connected Accounts](https://docs.composio.dev/reference/v3/api-reference/connected-accounts)

# Get connected account details by IDv3.0

Copy page

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3`/`connected_accounts`/`{nanoid}`

Send

Authorization

Path

Retrieves comprehensive details of a connected account, including authentication configuration, connection status, and all parameters needed for API requests.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/connected-accounts/getConnectedAccountsByNanoid\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/v3/api-reference/connected-accounts/getConnectedAccountsByNanoid\#parameters-path)

nanoidstringRequired

The unique identifier (nanoid) of the connected account

Format:`connectedAccountId`

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/connected-accounts/getConnectedAccountsByNanoid\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

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
curl -X GET "https://backend.composio.dev/api/v3/connected_accounts/ca_1a2b3c4d5e6f" \  -H "x-api-key: "
```

200400401403404500501

```
{  "toolkit": {    "slug": "string"  },  "auth_config": {    "id": "string",    "auth_scheme": "OAUTH2",    "is_composio_managed": true,    "is_disabled": true  },  "id": "string",  "authScheme": "OAUTH2",  "word_id": "string",  "alias": "string",  "user_id": "string",  "status": "INITIALIZING",  "experimental": {    "account_type": "PRIVATE",    "acl_config_for_shared": {      "allow_all_users": true,      "allowed_user_ids": [        "string"      ],      "not_allowed_user_ids": [        "string"      ]    }  },  "created_at": "string",  "updated_at": "string",  "state": {    "authScheme": "OAUTH1",    "val": {      "subdomain": "string",      "your-domain": "string",      "region": "string",      "shop": "string",      "account_url": "string",      "COMPANYDOMAIN": "string",      "extension": "string",      "form_api_base_url": "string",      "instanceEndpoint": "string",      "api_url": "string",      "borneo_dashboard_url": "string",      "proxy_username": "string",      "proxy_password": "string",      "domain": "string",      "version": "string",      "dc": "string",      "site_name": "string",      "instanceName": "string",      "account_id": "string",      "your_server": "string",      "server_location": "string",      "base_url": "string",      "status": "INITIALIZING",      "oauth_token": "string",      "authUri": "string",      "oauth_token_secret": "string",      "redirectUrl": "string",      "callbackUrl": "string",      "oauth_verifier": "string",      "consumer_key": "string",      "callback_url": "string",      "error": "string",      "error_description": "string",      "expired_at": "string"    }  },  "data": {    "property1": null,    "property2": null  },  "status_reason": "string",  "is_disabled": true,  "test_request_endpoint": "string",  "params": {    "property1": null,    "property2": null  },  "requested_scopes": [    "string"  ],  "requested_user_scopes": [    "string"  ]}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/connected-accounts/getConnectedAccountsByNanoid.mdx)
