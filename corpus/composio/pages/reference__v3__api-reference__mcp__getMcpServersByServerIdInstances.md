---
url: https://docs.composio.dev/reference/v3/api-reference/mcp/getMcpServersByServerIdInstances
title: List all instances for an MCP server | Composio
description: Retrieves a paginated list of user instances (user IDs) associated with a specific Model Control Protocol (MCP) server. This endpoint supports pagination to handle servers with many instances.
status: 200
---

API Reference [MCP](https://docs.composio.dev/reference/v3/api-reference/mcp)

# List all instances for an MCP serverv3.0Legacy

Copy page

Deprecated

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3`/`mcp`/`servers`/`{serverId}`/`instances`

Send

Authorization

Path

Query

Retrieves a paginated list of user instances (user IDs) associated with a specific Model Control Protocol (MCP) server. This endpoint supports pagination to handle servers with many instances.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/mcp/getMcpServersByServerIdInstances\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/v3/api-reference/mcp/getMcpServersByServerIdInstances\#parameters-path)

serverIdstringRequired

The ID of the MCP server

## [Query Parameters](https://docs.composio.dev/reference/v3/api-reference/mcp/getMcpServersByServerIdInstances\#parameters-query)

page\_nonullable number

Page number for pagination (1-based)

Default:`1`

limitnullable number

Number of items per page (default: 20)

Default:`20`

searchstring

Search instances by user ID/instance ID

order\_byenum

Field to order results by

Default:`"updated_at"`

Possible values:

`created_at``updated_at`

order\_directionenum

Direction of ordering

Default:`"desc"`

Possible values:

`asc``desc`

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/mcp/getMcpServersByServerIdInstances\#response-body)

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
curl -X GET "https://backend.composio.dev/api/v3/mcp/servers/550e8400-e29b-41d4-a716-446655440000/instances" \  -H "x-api-key: "
```

200400401404500

```
{  "instances": [    {      "id": "550e8400-e29b-41d4-a716-446655440000",      "instance_id": "user_123456",      "mcp_server_id": "660e8400-e29b-41d4-a716-446655440001",      "created_at": "2023-06-10T09:15:00.000Z",      "updated_at": "2023-06-15T14:30:00.000Z"    }  ],  "server_id": "550e8400-e29b-41d4-a716-446655440000",  "server_name": "Production GitHub Integration",  "total_pages": 3,  "current_page": 1}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/mcp/getMcpServersByServerIdInstances.mdx)
