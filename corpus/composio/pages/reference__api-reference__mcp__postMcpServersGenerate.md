---
url: https://docs.composio.dev/reference/api-reference/mcp/postMcpServersGenerate
title: Generate MCP URL with custom parameters | Composio
description: Generates a Model Control Protocol (MCP) URL for an existing server with custom query parameters. The URL includes user-specific parameters and configuration flags that control the behavior of the MCP connection.
status: 200
---

API Reference [MCP](https://docs.composio.dev/reference/api-reference/mcp)

# Generate MCP URL with custom parametersv3.1Legacy

Copy page

Deprecated

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`mcp`/`servers`/`generate`

Send

Authorization

Body

Generates a Model Control Protocol (MCP) URL for an existing server with custom query parameters. The URL includes user-specific parameters and configuration flags that control the behavior of the MCP connection.

## [Authorization](https://docs.composio.dev/reference/api-reference/mcp/postMcpServersGenerate\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/api-reference/mcp/postMcpServersGenerate\#request-body)

`application/json`

mcp\_server\_idstringRequired

Unique identifier of the MCP server to generate URL for

managed\_auth\_by\_composioboolean

Flag indicating if Composio manages authentication

Default:`false`

user\_idsarray of string

List of user identifiers for whom the URL is generated

connected\_account\_idsarray of string

List of connected account identifiers

## [Response Body](https://docs.composio.dev/reference/api-reference/mcp/postMcpServersGenerate\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

### 500  `application/json`

Basic URL Generation

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X POST "https://backend.composio.dev/api/v3.1/mcp/servers/generate" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "mcp_server_id": "550e8400-e29b-41d4-a716-446655440000",
    "user_ids": [\
      "user_123456"\
    ],
    "connected_account_ids": [\
      "ca_1a2b3c4d5e6f",\
      "ca_7g8h9i0j1k2l"\
    ]
  }'
```

200400401403404500

```
{
  "mcp_url": "https://mcp.composio.dev/composio/server/550e8400-e29b-41d4-a716-446655440000",
  "connected_account_urls": [\
    "https://mcp.composio.dev/composio/server/550e8400-e29b-41d4-a716-446655440000?include_composio_helper_actions=true&connected_account_id=ca_1a2b3c4d5e6f",\
    "https://mcp.composio.dev/composio/server/550e8400-e29b-41d4-a716-446655440000?include_composio_helper_actions=true&connected_account_id=ca_7g8h9i0j1k2l"\
  ],
  "user_ids_url": [\
    "https://mcp.composio.dev/composio/server/550e8400-e29b-41d4-a716-446655440000?include_composio_helper_actions=true&user_id=user_123456",\
    "https://mcp.composio.dev/composio/server/550e8400-e29b-41d4-a716-446655440000?include_composio_helper_actions=true&user_id=user_789012"\
  ]
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/mcp/postMcpServersGenerate.mdx)
