---
url: https://docs.composio.dev/reference/api-reference/mcp/postMcpServers
title: Create a new MCP server | Composio
description: Creates a new Model Control Protocol (MCP) server instance for the authenticated project. An MCP server provides a connection point for AI assistants to access your applications and services. The server is configured with specific authentication and tool permissions that determine what actions the connected assistants can perform.
status: 200
---

API Reference [MCP](https://docs.composio.dev/reference/api-reference/mcp)

# Create a new MCP serverv3.1Legacy

Copy page

Deprecated

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`mcp`/`servers`

Send

Authorization

Body

Creates a new Model Control Protocol (MCP) server instance for the authenticated project. An MCP server provides a connection point for AI assistants to access your applications and services. The server is configured with specific authentication and tool permissions that determine what actions the connected assistants can perform.

## [Authorization](https://docs.composio.dev/reference/api-reference/mcp/postMcpServers\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/api-reference/mcp/postMcpServers\#request-body)

`application/json`

namestringRequired

Human-readable name to identify this MCP server instance (4-30 characters, alphanumeric, spaces, and hyphens only)

auth\_config\_idsarray of stringRequired

ID references to existing authentication configurations

no\_auth\_appsarray of string

List of NO\_AUTH apps to enable for this MCP server

allowed\_toolsarray of string

List of tool slugs that should be allowed for this server. If not provided, all available tools for the authentication configuration will be enabled.

managed\_auth\_via\_composioboolean

Whether the MCP server is managed by Composio

## [Response Body](https://docs.composio.dev/reference/api-reference/mcp/postMcpServers\#response-body)

### 201  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

### 409  `application/json`

### 500  `application/json`

Basic MCP Server

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X POST "https://backend.composio.dev/api/v3.1/mcp/servers" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "name": "GitHub Integration Server",
    "auth_config_ids": [\
      "ac_1a2b3c4d5e6f"\
    ]
  }'
```

201400401403404409500

```
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "GitHub Integration Server",
  "auth_config_ids": [\
    "ac_1a2b3c4d5e6f",\
    "ac_7g8h9i0j1k2l"\
  ],
  "allowed_tools": [\
    "GITHUB_CREATE_AN_ISSUE",\
    "GITHUB_GET_A_REPOSITORY",\
    "GITHUB_LIST_PULL_REQUESTS"\
  ],
  "mcp_url": "https://backend.composio.dev/v3/mcp/550e8400-e29b-41d4-a716-446655440000?user_id=john",
  "toolkits": [\
    "github",\
    "jira",\
    "slack"\
  ],
  "toolkit_icons": {
    "github": "https://assets.composio.dev/logos/github.png",
    "jira": "https://assets.composio.dev/logos/jira.png",
    "slack": "https://assets.composio.dev/logos/slack.png"
  },
  "commands": {
    "cursor": "npx @composio/mcp@latest setup \"https://backend.composio.dev/v3/mcp/550e8400-e29b-41d4-a716-446655440000?user_id=john\" --client cursor",
    "claude": "npx @composio/mcp@latest setup \"https://backend.composio.dev/v3/mcp/550e8400-e29b-41d4-a716-446655440000?user_id=john\" --client claude",
    "windsurf": "npx @composio/mcp@latest setup \"https://backend.composio.dev/v3/mcp/550e8400-e29b-41d4-a716-446655440000?user_id=john\" --client windsurf"
  },
  "updated_at": "2023-06-15T14:30:00.000Z",
  "created_at": "2023-06-10T09:15:00.000Z",
  "server_instance_count": 5,
  "managed_auth_via_composio": true
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/mcp/postMcpServers.mdx)
