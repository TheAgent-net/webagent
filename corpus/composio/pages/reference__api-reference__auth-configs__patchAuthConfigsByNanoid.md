---
url: https://docs.composio.dev/reference/api-reference/auth-configs/patchAuthConfigsByNanoid
title: Update an authentication configuration | Composio
description: Modifies an existing authentication configuration with new credentials or other settings. Only specified fields will be updated.
status: 200
---

API Reference [Auth Configs](https://docs.composio.dev/reference/api-reference/auth-configs)

# Update an authentication configurationv3.1

Copy page

Server URL`https://backend.composio.dev/`

PATCH

``/`api`/`v3.1`/`auth_configs`/`{nanoid}`

Send

Authorization

Path

Body

Modifies an existing authentication configuration with new credentials or other settings. Only specified fields will be updated.

## [Authorization](https://docs.composio.dev/reference/api-reference/auth-configs/patchAuthConfigsByNanoid\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/auth-configs/patchAuthConfigsByNanoid\#parameters-path)

nanoidstringRequired

The unique identifier of the authentication configuration to update

Format:`authConfigId`

## [Request Body](https://docs.composio.dev/reference/api-reference/auth-configs/patchAuthConfigsByNanoid\#request-body)

`application/json`

One of:

CustomAuthConfigUpdate

Show 9 child attributes

DefaultAuthConfigUpdate

Show 8 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/auth-configs/patchAuthConfigsByNanoid\#response-body)

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
curl -X PATCH "https://backend.composio.dev/api/v3.1/auth_configs/string" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "auth_config": {
      "credentials": {
        "api_key": "YOUR_NEW_API_KEY",
        "client_secret": "YOUR_NEW_CLIENT_SECRET"
      },
      "restrict_to_following_tools": [\
        "GMAIL_SEND_EMAIL",\
        "GMAIL_FETCH_EMAILS"\
      ]
    }
  }'
```

200400401404500

```
{
  "success": true,
  "message": "string"
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/auth-configs/patchAuthConfigsByNanoid.mdx)
