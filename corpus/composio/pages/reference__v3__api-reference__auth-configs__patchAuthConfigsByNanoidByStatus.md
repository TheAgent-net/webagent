---
url: https://docs.composio.dev/reference/v3/api-reference/auth-configs/patchAuthConfigsByNanoidByStatus
title: Enable or disable an authentication configuration | Composio
description: Updates the status of an authentication configuration to either enabled or disabled. Disabled configurations cannot be used for new connections.
status: 200
---

API Reference [Auth Configs](https://docs.composio.dev/reference/v3/api-reference/auth-configs)

# Enable or disable an authentication configurationv3.0

Copy page

Server URL`https://backend.composio.dev/`

PATCH

``/`api`/`v3`/`auth_configs`/`{nanoid}`/`{status}`

Send

Authorization

Path

Updates the status of an authentication configuration to either enabled or disabled. Disabled configurations cannot be used for new connections.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/auth-configs/patchAuthConfigsByNanoidByStatus\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/v3/api-reference/auth-configs/patchAuthConfigsByNanoidByStatus\#parameters-path)

nanoidstringRequired

The unique identifier of the authentication configuration to update

Format:`authConfigId`

statusenumRequired

The new status to set for the auth configuration

Possible values:

`ENABLED``DISABLED`

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/auth-configs/patchAuthConfigsByNanoidByStatus\#response-body)

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
curl -X PATCH "https://backend.composio.dev/api/v3/auth_configs/string/ENABLED" \
  -H "x-api-key: "
```

200400401404500

```
{
  "success": true,
  "message": "string"
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/auth-configs/patchAuthConfigsByNanoidByStatus.mdx)
