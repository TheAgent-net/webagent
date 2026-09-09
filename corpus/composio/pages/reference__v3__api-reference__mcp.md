---
url: https://docs.composio.dev/reference/v3/api-reference/mcp
title: MCP | Composio
description: MCP server management
status: 200
---

API Reference

# MCP

Copy page

This API is deprecated. Use a session's MCP endpoint instead. Create a session with `composio.create(userId, { mcp: true })`, then read the hosted URL off `session.mcp.url`. See [Using sessions via MCP](https://docs.composio.dev/docs/sessions-via-mcp) and [migrating MCP servers to sessions](https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions).

The MCP API is the standalone, hosted [Model Context Protocol](https://modelcontextprotocol.io/) server-management surface. It let you stand up and manage a separate server config per toolkit, then mint a per-user MCP URL that any MCP-compatible client could connect to.

These endpoints create, list, update, and delete MCP servers, including custom servers spanning multiple apps, generate per-user MCP URLs, and manage per-user server instances and their connected accounts.

Sessions replace this. A single `composio.create(...)` gives you the same MCP URL pattern, keyed by `user_id`, while handling tool discovery, authentication, context, and versioning for you. Your existing tools, auth configs (`ac_…`), and connected accounts carry over with no re-authentication. To pin a session to a fixed tool list the way a server did, use the direct-tools preset described in [Configuring sessions](https://docs.composio.dev/docs/configuring-sessions).

## [Endpoints](https://docs.composio.dev/reference/v3/api-reference/mcp\#endpoints)

| Endpoint | Quick Link |
| --- | --- |
| `GET /api/v3/mcp/servers` | [List MCP servers with optional filters and pagination](https://docs.composio.dev/reference/v3/api-reference/mcp/getMcpServers) Legacy |
| `POST /api/v3/mcp/servers` | [Create a new MCP server](https://docs.composio.dev/reference/v3/api-reference/mcp/postMcpServers) Legacy |
| `POST /api/v3/mcp/servers/custom` | [Create a new custom MCP server with multiple apps](https://docs.composio.dev/reference/v3/api-reference/mcp/postMcpServersCustom) Legacy |
| `POST /api/v3/mcp/servers/generate` | [Generate MCP URL with custom parameters](https://docs.composio.dev/reference/v3/api-reference/mcp/postMcpServersGenerate) Legacy |
| `GET /api/v3/mcp/{id}` | [Get MCP server details by ID](https://docs.composio.dev/reference/v3/api-reference/mcp/getMcpById) Legacy |
| `PATCH /api/v3/mcp/{id}` | [Update MCP server configuration](https://docs.composio.dev/reference/v3/api-reference/mcp/patchMcpById) Legacy |
| `DELETE /api/v3/mcp/{id}` | [Delete an MCP server](https://docs.composio.dev/reference/v3/api-reference/mcp/deleteMcpById) Legacy |
| `GET /api/v3/mcp/app/{appKey}` | [List MCP servers for a specific app](https://docs.composio.dev/reference/v3/api-reference/mcp/getMcpAppByAppKey) Legacy |
| `GET /api/v3/mcp/servers/{serverId}/instances` | [List all instances for an MCP server](https://docs.composio.dev/reference/v3/api-reference/mcp/getMcpServersByServerIdInstances) Legacy |
| `POST /api/v3/mcp/servers/{serverId}/instances` | [Create a new MCP server instance](https://docs.composio.dev/reference/v3/api-reference/mcp/postMcpServersByServerIdInstances) Legacy |
| `DELETE /api/v3/mcp/servers/{serverId}/instances/{instanceId}` | [Delete an MCP server instance and associated connected accounts](https://docs.composio.dev/reference/v3/api-reference/mcp/deleteMcpServersByServerIdInstancesByInstanceId) Legacy |

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/mcp/index.mdx)

### On this page

[Endpoints](https://docs.composio.dev/reference/v3/api-reference/mcp#endpoints)
