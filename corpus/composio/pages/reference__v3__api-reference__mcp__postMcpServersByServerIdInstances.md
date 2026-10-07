---
url: https://docs.composio.dev/reference/v3/api-reference/mcp/postMcpServersByServerIdInstances
title: Create a new MCP server instance | Composio
description: Creates a new instance for a Model Control Protocol (MCP) server. This endpoint validates that the user has connected accounts for all auth configurations associated with the MCP server before creating the instance.
status: 200
---

API Reference [MCP](https://docs.composio.dev/reference/v3/api-reference/mcp)

# Create a new MCP server instancev3.0Legacy

Copy page

Deprecated

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3`/`mcp`/`servers`/`{serverId}`/`instances`

Send

Authorization

Path

Body

Creates a new instance for a Model Control Protocol (MCP) server. This endpoint validates that the user has connected accounts for all auth configurations associated with the MCP server before creating the instance.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/mcp/postMcpServersByServerIdInstances\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/v3/api-reference/mcp/postMcpServersByServerIdInstances\#parameters-path)

serverIdstringRequired

The ID of the MCP server

## [Request Body](https://docs.composio.dev/reference/v3/api-reference/mcp/postMcpServersByServerIdInstances\#request-body)

`application/json`

user\_idstringRequired

The user ID (entity ID) that will be used as both the user identifier and instance ID

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/mcp/postMcpServersByServerIdInstances\#response-body)

### 201  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

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
curl -X POST "https://backend.composio.dev/api/v3/mcp/servers/550e8400-e29b-41d4-a716-446655440000/instances" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123456"
  }'
```

201400401403404409500

```
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "instance_id": "user_123456",
  "mcp_server_id": "660e8400-e29b-41d4-a716-446655440001",
  "created_at": "2023-06-10T09:15:00.000Z",
  "updated_at": "2023-06-15T14:30:00.000Z"
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/mcp/postMcpServersByServerIdInstances.mdx)
