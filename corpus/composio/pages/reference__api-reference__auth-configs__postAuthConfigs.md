---
url: https://docs.composio.dev/reference/api-reference/auth-configs/postAuthConfigs
title: Create new authentication configuration | Composio
description: Creates a new auth config for a toolkit, allowing you to use your own OAuth credentials or API keys instead of Composio-managed authentication. This is required when you want to use custom OAuth apps (bring your own client ID/secret) or configure specific authentication parameters for a toolkit.
status: 200
---

API Reference [Auth Configs](https://docs.composio.dev/reference/api-reference/auth-configs)

# Create new authentication configurationv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`auth_configs`

Send

Authorization

Body

Creates a new auth config for a toolkit, allowing you to use your own OAuth credentials or API keys instead of Composio-managed authentication. This is required when you want to use custom OAuth apps (bring your own client ID/secret) or configure specific authentication parameters for a toolkit.

## [Authorization](https://docs.composio.dev/reference/api-reference/auth-configs/postAuthConfigs\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/api-reference/auth-configs/postAuthConfigs\#request-body)

`application/json`

toolkitobjectRequired

Show 1 child attributes

auth\_configComposioManagedAuthConfigCreate \| CustomAuthConfigCreate

Default:`{"type":"use_composio_managed_auth","credentials":{},"restrict_to_following_tools":[]}`

Show 2 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/auth-configs/postAuthConfigs\#response-body)

### 201  `application/json`

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
curl -X POST "https://backend.composio.dev/api/v3.1/auth_configs" \  -H "x-api-key: " \  -H "Content-Type: application/json" \  -d '{    "toolkit": {      "slug": "string"    }  }'
```

201400401404500

```
{  "toolkit": {    "slug": "string"  },  "auth_config": {    "id": "string",    "auth_scheme": "string",    "is_composio_managed": true,    "restrict_to_following_tools": []  }}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/auth-configs/postAuthConfigs.mdx)
