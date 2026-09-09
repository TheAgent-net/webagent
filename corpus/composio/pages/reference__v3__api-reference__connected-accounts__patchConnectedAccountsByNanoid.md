---
url: https://docs.composio.dev/reference/v3/api-reference/connected-accounts/patchConnectedAccountsByNanoid
title: Update a connected account | Composio
description: Update a connected account. Supports updating the alias and/or credentials. Only specified fields will be updated. Set a credential field to null to remove it. Alias must be unique within the same project, entity, and toolkit scope.
status: 200
---

API Reference [Connected Accounts](https://docs.composio.dev/reference/v3/api-reference/connected-accounts)

# Update a connected accountv3.0

Copy page

Server URL`https://backend.composio.dev/`

PATCH

``/`api`/`v3`/`connected_accounts`/`{nanoid}`

Send

Authorization

Path

Body

Update a connected account. Supports updating the alias and/or credentials. Only specified fields will be updated. Set a credential field to null to remove it. Alias must be unique within the same project, entity, and toolkit scope.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/connected-accounts/patchConnectedAccountsByNanoid\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/v3/api-reference/connected-accounts/patchConnectedAccountsByNanoid\#parameters-path)

nanoidstringRequired

The unique identifier (nanoid) of the connected account

Format:`connectedAccountId`

## [Request Body](https://docs.composio.dev/reference/v3/api-reference/connected-accounts/patchConnectedAccountsByNanoid\#request-body)

`application/json`

aliasstring

A human-readable alias for this connected account. Pass an empty string to clear the alias. Must be unique per entity and toolkit within the project.

connectionobject

Show 1 child attributes

experimentalobjectExperimental

Experimental features - not stable, may be modified or removed in future versions.

Show 1 child attributes

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/connected-accounts/patchConnectedAccountsByNanoid\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

### 409  `application/json`

### 500  `application/json`

Update credentials

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X PATCH "https://backend.composio.dev/api/v3/connected_accounts/ca_1a2b3c4d5e6f" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "connection": {
      "state": {
        "authScheme": "BEARER_TOKEN",
        "val": {
          "token": "new_access_token"
        }
      }
    }
  }'
```

200400401403404409500

```
{
  "success": true,
  "id": "ca_1a2b3c4d5e6f",
  "status": "ACTIVE"
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/connected-accounts/patchConnectedAccountsByNanoid.mdx)
