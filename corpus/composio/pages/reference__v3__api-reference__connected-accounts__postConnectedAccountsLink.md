---
url: https://docs.composio.dev/reference/v3/api-reference/connected-accounts/postConnectedAccountsLink
title: Create a new auth link session | Composio
description: Creates a new authentication link session that users can use to connect their accounts
status: 200
---

API Reference [Connected Accounts](https://docs.composio.dev/reference/v3/api-reference/connected-accounts)

# Create a new auth link sessionv3.0

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3`/`connected_accounts`/`link`

Send

Authorization

Body

Creates a new authentication link session that users can use to connect their accounts

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/connected-accounts/postConnectedAccountsLink\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/v3/api-reference/connected-accounts/postConnectedAccountsLink\#request-body)

`application/json`

auth\_config\_idstringRequired

The auth config id to create a link for

Format:`authConfigId`

user\_idstringRequired

The user id to create a link for

aliasstring

A human-readable alias for this connected account. Must be unique per entity and toolkit within the project.

callback\_urlstring

The callback url to create a link for

connection\_dataobject

Optional data to pre-fill connection fields with default values

Show 66 child attributes

experimentalobjectExperimental

Experimental features - not stable, may be modified or removed in future versions.

Show 2 child attributes

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/connected-accounts/postConnectedAccountsLink\#response-body)

### 201  `application/json`

### 400  `application/json`

### 401  `application/json`

### 404  `application/json`

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
curl -X POST "https://backend.composio.dev/api/v3/connected_accounts/link" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "auth_config_id": "string",
    "user_id": "string"
  }'
```

201400401404422429500501

```
{
  "link_token": "string",
  "redirect_url": "string",
  "expires_at": "string",
  "connected_account_id": "string",
  "experimental": {
    "account_type": "PRIVATE",
    "acl_config_for_shared": {
      "allow_all_users": true,
      "allowed_user_ids": [\
        "string"\
      ],
      "not_allowed_user_ids": [\
        "string"\
      ]
    }
  }
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/connected-accounts/postConnectedAccountsLink.mdx)
