---
url: https://docs.composio.dev/reference/v3/api-reference/auth-configs/deleteAuthConfigsByNanoid
title: Delete an authentication configuration | Composio
description: Deletes an authentication configuration. This operation cannot be undone. Pass `?revoke_on_delete=true` to also revoke the upstream credentials of every connection using this auth config.
status: 200
---

API Reference [Auth Configs](https://docs.composio.dev/reference/v3/api-reference/auth-configs)

# Delete an authentication configurationv3.0

Copy page

Server URL`https://backend.composio.dev/`

DELETE

``/`api`/`v3`/`auth_configs`/`{nanoid}`

Send

Authorization

Path

Query

Deletes an authentication configuration. This operation cannot be undone. Pass `?revoke_on_delete=true` to also revoke the upstream credentials of every connection using this auth config.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/auth-configs/deleteAuthConfigsByNanoid\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/v3/api-reference/auth-configs/deleteAuthConfigsByNanoid\#parameters-path)

nanoidstringRequired

The unique identifier of the authentication configuration to delete

Format:`authConfigId`

## [Query Parameters](https://docs.composio.dev/reference/v3/api-reference/auth-configs/deleteAuthConfigsByNanoid\#parameters-query)

revoke\_on\_deletenullable boolean

When `true`, the delete also starts a background job that revokes the upstream credentials of every connected account in scope, and the response carries a `revoke_job_id`. Defaults to `false`. Revocation is irreversible — recovering a deleted entity does not restore working credentials.

Default:`false`

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/auth-configs/deleteAuthConfigsByNanoid\#response-body)

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
curl -X DELETE "https://backend.composio.dev/api/v3/auth_configs/string" \  -H "x-api-key: "
```

200400401404500

```
{  "success": true,  "message": "string",  "revoke_job_id": "pj_1a2b3c4d5e6f"}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/auth-configs/deleteAuthConfigsByNanoid.mdx)
