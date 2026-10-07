---
url: https://docs.composio.dev/reference/api-reference/toolkits/postCustomToolkitsUpsert
title: Upsert a custom toolkit | Composio
description: Experimental: custom toolkits are in pilot and this contract may change. Creates a custom toolkit for the project with the provided slug, or updates its display metadata (name, API key field copy) when the project already owns a toolkit with that slug. app_url and auth_schemes cannot be changed on an existing toolkit: re-sending them unchanged is a no-op, changing them returns 409 (delete and re-register the toolkit instead, which revokes its connections).
status: 200
---

API Reference [Toolkits](https://docs.composio.dev/reference/api-reference/toolkits)

# Upsert a custom toolkitv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`custom`/`toolkits`/`upsert`

Send

Authorization

Body

Experimental: custom toolkits are in pilot and this contract may change. Creates a custom toolkit for the project with the provided slug, or updates its display metadata (name, API key field copy) when the project already owns a toolkit with that slug. app\_url and auth\_schemes cannot be changed on an existing toolkit: re-sending them unchanged is a no-op, changing them returns 409 (delete and re-register the toolkit instead, which revokes its connections).

## [Authorization](https://docs.composio.dev/reference/api-reference/toolkits/postCustomToolkitsUpsert\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/api-reference/toolkits/postCustomToolkitsUpsert\#request-body)

`application/json`

Toolkit creation data

slugstringRequired

Unique slug identifier for the toolkit. Your slug will be prefixed with CUSTOM\_ to avoid collision with composio managed toolkits. Spaces will be converted to underscores.

toolkit\_configobjectRequired

Show 4 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/toolkits/postCustomToolkitsUpsert\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 404  `application/json`

### 408  `application/json`

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
curl -X POST "https://backend.composio.dev/api/v3.1/custom/toolkits/upsert" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "MY_TOOLKIT",
    "toolkit_config": {
      "name": "string",
      "app_url": "http://example.com",
      "auth_schemes": [\
        {\
          "mode": "NO_AUTH"\
        }\
      ]
    }
  }'
```

200400401404408409500

```
{
  "slug": "CUSTOM_MY_TOOLKIT"
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/toolkits/postCustomToolkitsUpsert.mdx)
