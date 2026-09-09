---
url: https://docs.composio.dev/reference/api-reference/mcp/postMcpServersCustom
title: Create a new custom MCP server with multiple apps | Composio
description: Creates a new Model Control Protocol (MCP) server instance that can integrate with multiple applications or toolkits simultaneously. This endpoint allows you to create a server that can access tools from different applications, making it suitable for complex workflows that span multiple services.
status: 200
---

API Reference [MCP](https://docs.composio.dev/reference/api-reference/mcp)

# Create a new custom MCP server with multiple appsv3.1Legacy

Copy page

Deprecated

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`mcp`/`servers`/`custom`

Send

Authorization

Body

Creates a new Model Control Protocol (MCP) server instance that can integrate with multiple applications or toolkits simultaneously. This endpoint allows you to create a server that can access tools from different applications, making it suitable for complex workflows that span multiple services.

## [Authorization](https://docs.composio.dev/reference/api-reference/mcp/postMcpServersCustom\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/api-reference/mcp/postMcpServersCustom\#request-body)

`application/json`

namestringRequired

Human-readable name to identify this custom MCP server (4-30 characters, alphanumeric, spaces, and hyphens only)

auth\_config\_idsarray of string

ID references to existing authentication configurations

toolkitsarray of string

List of application/toolkit identifiers to enable for this server

allowed\_toolsarray of string

Tool identifiers to enable that aren't part of standard toolkits

custom\_toolsarray of string

DEPRECATED: Use allowed\_tools instead. Tool identifiers to enable that aren't part of standard toolkits

managed\_auth\_via\_composioboolean

Whether to manage authentication via Composio

## [Response Body](https://docs.composio.dev/reference/api-reference/mcp/postMcpServersCustom\#response-body)

### 201  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

### 409  `application/json`

### 500  `application/json`

Basic Multi-App Server

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X POST "https://backend.composio.dev/api/v3.1/mcp/servers/custom" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Development Integration Server",
    "toolkits": [\
      "github",\
      "jira"\
    ]
  }'
```

201400401403404409500

```
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Multi-App Integration Server",
  "auth_config_ids": [\
    "ac_1a2b3c4d5e6f",\
    "ac_7g8h9i0j1k2l"\
  ],
  "allowed_tools": [\
    "GITHUB_CREATE_AN_ISSUE",\
    "JIRA_GET_ISSUE",\
    "SLACK_SEND_MESSAGE",\
    "GMAIL_SEND_EMAIL"\
  ],
  "mcp_url": "https://backend.composio.dev/v3/mcp/550e8410-e29b-41d4-a716-446655440000?user_id=john",
  "commands": {
    "cursor": "npx @composio/mcp@latest setup \"https://backend.composio.dev/v3/mcp/550e8410-e29b-41d4-a716-446655440000?user_id=john\" --client cursor",
    "claude": "npx @composio/mcp@latest setup \"https://backend.composio.dev/v3/mcp/550e8410-e29b-41d4-a716-446655440000?user_id=john\" --client claude",
    "windsurf": "npx @composio/mcp@latest setup \"https://backend.composio.dev/v3/mcp/550e8410-e29b-41d4-a716-446655440000?user_id=john\" --client windsurf"
  }
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/mcp/postMcpServersCustom.mdx)
