---
url: https://docs.composio.dev/reference/api-reference/mcp/patchMcpById
title: Update MCP server configuration | Composio
description: Updates the configuration of an existing Model Control Protocol (MCP) server. You can modify the server name, associated applications, and enabled tools. Only the fields included in the request will be updated.
status: 200
---

API Reference [MCP](https://docs.composio.dev/reference/api-reference/mcp)

# Update MCP server configurationv3.1Legacy

Copy page

Deprecated

Server URL`https://backend.composio.dev/`

PATCH

``/`api`/`v3.1`/`mcp`/`{id}`

Send

Authorization

Path

Body

Updates the configuration of an existing Model Control Protocol (MCP) server. You can modify the server name, associated applications, and enabled tools. Only the fields included in the request will be updated.

## [Authorization](https://docs.composio.dev/reference/api-reference/mcp/patchMcpById\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/mcp/patchMcpById\#parameters-path)

idstringRequired

The ID of the MCP server

## [Request Body](https://docs.composio.dev/reference/api-reference/mcp/patchMcpById\#request-body)

`application/json`

namestring

Human-readable name to identify this MCP server instance (4-30 characters, alphanumeric, spaces, and hyphens only)

toolkitsarray of string

List of toolkit slugs this server should be configured to work with.

allowed\_toolsarray of string

List of action identifiers that should be enabled for this server

managed\_auth\_via\_composioboolean

Whether the MCP server is managed by Composio

auth\_config\_idsarray of string

List of auth config IDs to use for this MCP server.

## [Response Body](https://docs.composio.dev/reference/api-reference/mcp/patchMcpById\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

### 500  `application/json`

Update Server Name

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X PATCH "https://backend.composio.dev/api/v3.1/mcp/550e8400-e29b-41d4-a716-446655440000" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated GitHub Integration Server"
  }'
```

200400401403404500

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
  "managed_auth_via_composio": true,
  "deleted": true
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/mcp/patchMcpById.mdx)
