---
url: https://docs.composio.dev/reference/api-reference/toolkits/postCustomToolkitsSync
title: Sync a custom toolkit | Composio
description: Experimental: custom toolkits are in pilot and this contract may change. Re-fetches tool definitions from the remote MCP server for the custom toolkit with the provided slug. Call it when automatic sync fails or the remote tool definitions change.
status: 200
---

API Reference [Toolkits](https://docs.composio.dev/reference/api-reference/toolkits)

# Sync a custom toolkitv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`custom`/`toolkits`/`sync`

Send

Authorization

Body

Experimental: custom toolkits are in pilot and this contract may change. Re-fetches tool definitions from the remote MCP server for the custom toolkit with the provided slug. Call it when automatic sync fails or the remote tool definitions change.

## [Authorization](https://docs.composio.dev/reference/api-reference/toolkits/postCustomToolkitsSync\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/api-reference/toolkits/postCustomToolkitsSync\#request-body)

`application/json`

Toolkit sync data

slugstringRequired

Toolkit slug to sync

connected\_account\_idstring

The unique identifier for the connected account

Format:`connectedAccountId`

## [Response Body](https://docs.composio.dev/reference/api-reference/toolkits/postCustomToolkitsSync\#response-body)

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
curl -X POST "https://backend.composio.dev/api/v3.1/custom/toolkits/sync" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "CUSTOM_MY_TOOLKIT"
  }'
```

200400401404408409500

```
{
  "slug": "CUSTOM_MY_TOOLKIT",
  "version": "00000000_00",
  "synced_count": 1
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/toolkits/postCustomToolkitsSync.mdx)
