---
url: https://docs.composio.dev/reference/sdk-reference/typescript/mcp
title: MCP | Composio
description: MCP (Model Control Protocol) class Handles MCP server operations. When `config.experimental.mcp` is enabled, this class augments the features of `composio.mcp`.
status: 200
---

SDK Reference [TypeScript SDK](https://docs.composio.dev/reference/sdk-reference/typescript)

# MCP

Copy page

Deprecated

Use a session's MCP endpoint instead: `composio.create(userId, \{ mcp: true \})`
returns a session that exposes `session.mcp.url` / `session.mcp.headers`. MCP is now
opt-in per session; the standalone `composio.mcp` server-management API is kept only for
backwards compatibility. Prefer the session MCP endpoint; do not generate new code against
`composio.mcp`. See [https://docs.composio.dev/docs/sessions-via-mcp](https://docs.composio.dev/docs/sessions-via-mcp)

## [Usage](https://docs.composio.dev/reference/sdk-reference/typescript/mcp\#usage)

Access this class through the `composio.mcp` property:

```
const composio = new Composio({ apiKey: 'your-api-key' });
const result = await composio.mcp.list();
```

## [Properties](https://docs.composio.dev/reference/sdk-reference/typescript/mcp\#properties)

| Name | Type |
| --- | --- |
| `client` | `Composio` |

## [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/mcp\#methods)

### [create()](https://docs.composio.dev/reference/sdk-reference/typescript/mcp\#create)

Create a new MCP configuration.

```
async create(name: string, mcpConfig: MCPConfigCreationParams, requestOptions?: ComposioRequestOptions): Promise<MCPConfigCreateResponse>
```

**Parameters**

| Name | Type |
| --- | --- |
| `name` | `string` |
| `mcpConfig` | `MCPConfigCreationParams` |
| `requestOptions?` | `ComposioRequestOptions` |

**Returns**

`Promise<MCPConfigCreateResponse>` — Created server details with instance getter

**Example**

```
const server = await composio.mcpConfig.create("personal-mcp-server", {
  toolkits: ["github", "slack"],
  allowedTools: ["GMAIL_FETCH_EMAILS", "SLACK_SEND_MESSAGE"],
  manuallyManageConnections: false
 }
});

const server = await composio.mcpConfig.create("personal-mcp-server", {
  toolkits: [{ toolkit: "gmail", authConfigId: "ac_243434343" }],
  allowedTools: ["GMAIL_FETCH_EMAILS"],
  manuallyManageConnections: false
 }
});
```

* * *

### [delete()](https://docs.composio.dev/reference/sdk-reference/typescript/mcp\#delete)

Delete an MCP server configuration permanently

```
async delete(serverId: string, requestOptions?: ComposioRequestOptions): Promise<{ id: string; deleted: boolean }>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `serverId` | `string` | The unique identifier of the MCP server to delete |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<\{ id: string; deleted: boolean \}>` — Confirmation object with server ID and deletion status

**Example**

```
// Delete an MCP server by ID
const result = await composio.experimental.mcp.delete("mcp_12345");

if (result.deleted) {
  console.log(`Server ${result.id} has been successfully deleted`);
} else {
  console.log(`Failed to delete server ${result.id}`);
}

// Example with error handling
try {
  const result = await composio.experimental.mcp.delete("mcp_12345");
  console.log("Deletion successful:", result);
} catch (error) {
  console.error("Failed to delete MCP server:", error.message);
}

// Delete and verify from list
await composio.experimental.mcp.delete("mcp_12345");
const servers = await composio.experimental.mcp.list({});
const serverExists = servers.items.some(server => server.id === "mcp_12345");
console.log("Server still exists:", serverExists); // Should be false
```

* * *

### [generate()](https://docs.composio.dev/reference/sdk-reference/typescript/mcp\#generate)

Get server URLs for an existing MCP server.
The response is wrapped according to the provider's specifications.

```
async generate(userId: string, mcpConfigId: string, options?: MCPGetInstanceParams, requestOptions?: ComposioRequestOptions): Promise<MCPServerInstance>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `userId` | `string` | {string} external user id from your database for whom you want the server for |
| `mcpConfigId` | `string` | {string} config id of the MCPConfig for which you want to create a server for |
| `options?` | `MCPGetInstanceParams` | {object} additional options |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<MCPServerInstance>`

**Example**

```
import { Composio } from "@composio/code";

const composio = new Composio();
const mcp = await composio.experimental.mcp.generate("default", "<mcp_config_id>");
```

* * *

### [get()](https://docs.composio.dev/reference/sdk-reference/typescript/mcp\#get)

Retrieve detailed information about a specific MCP server by its ID

```
async get(serverId: string, requestOptions?: ComposioRequestOptions): Promise<MCPItem>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `serverId` | `string` | The unique identifier of the MCP server to retrieve |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<MCPItem>` — Complete MCP server details including configuration, tools, and metadata

**Example**

```
// Get a specific MCP server by ID
const server = await composio.experimental.mcp.get("mcp_12345");

console.log(server.name); // "My Personal MCP Server"
console.log(server.allowedTools); // ["GITHUB_CREATE_ISSUE", "SLACK_SEND_MESSAGE"]
console.log(server.toolkits); // ["github", "slack"]
console.log(server.serverInstanceCount); // 3

// Access setup commands for different clients
console.log(server.commands.claude); // Claude setup command
console.log(server.commands.cursor); // Cursor setup command
console.log(server.commands.windsurf); // Windsurf setup command

// Use the MCP URL for direct connections
const mcpUrl = server.MCPUrl;
```

* * *

### [list()](https://docs.composio.dev/reference/sdk-reference/typescript/mcp\#list)

List the MCP servers with optional filtering and pagination

```
async list(options: MCPListParams, requestOptions?: ComposioRequestOptions): Promise<MCPListResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `MCPListParams` | Filtering and pagination options |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<MCPListResponse>` — Paginated list of MCP servers with metadata

**Example**

```
// List all MCP servers
const allServers = await composio.experimental.mcp.list({});

// List with pagination
const pagedServers = await composio.experimental.mcp.list({
  page: 2,
  limit: 5
});

// Filter by toolkit
const githubServers = await composio.experimental.mcp.list({
  toolkits: ['github', 'slack']
});

// Filter by name
const namedServers = await composio.experimental.mcp.list({
  name: 'personal'
});
```

* * *

### [update()](https://docs.composio.dev/reference/sdk-reference/typescript/mcp\#update)

Update an existing MCP server configuration with new settings

```
async update(serverId: string, config: MCPUpdateParams, requestOptions?: ComposioRequestOptions): Promise<MCPItem>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `serverId` | `string` | The unique identifier of the MCP server to update |
| `config` | `MCPUpdateParams` | Update configuration parameters |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<MCPItem>` — Updated MCP server configuration with all details

**Example**

```
// Update server name only
const updatedServer = await composio.experimental.mcp.update("mcp_12345", {
  name: "My Updated MCP Server"
});

// Update toolkits and tools
const serverWithNewTools = await composio.experimental.mcp.update("mcp_12345", {
  toolkits: [\
    {\
      toolkit: "github",\
      authConfigId: "auth_abc123",\
      allowedTools: ["GITHUB_CREATE_ISSUE", "GITHUB_LIST_REPOS"]\
    },\
    {\
      toolkit: "slack",\
      authConfigId: "auth_xyz789",\
      allowedTools: ["SLACK_SEND_MESSAGE", "SLACK_LIST_CHANNELS"]\
    }\
  ]
});

// Update connection management setting
const serverWithManualAuth = await composio.experimental.mcp.update("mcp_12345", {
  name: "Manual Auth Server",
  manuallyManageConnections: true
});

// Complete update example
const fullyUpdatedServer = await composio.experimental.mcp.update("mcp_12345", {
  name: "Production MCP Server",
  toolkits: [\
    {\
      toolkit: "gmail",\
      authConfigId: "auth_gmail_prod",\
    }\
  ],
  allowedTools: ["GMAIL_SEND_EMAIL", "GMAIL_FETCH_EMAILS"]
  manuallyManageConnections: false
});

console.log("Updated server:", fullyUpdatedServer.name);
console.log("New tools:", fullyUpdatedServer.allowedTools);
```

* * *

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/sdk-reference/typescript/mcp.mdx)

### On this page

[Usage](https://docs.composio.dev/reference/sdk-reference/typescript/mcp#usage) [Properties](https://docs.composio.dev/reference/sdk-reference/typescript/mcp#properties) [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/mcp#methods) [create()](https://docs.composio.dev/reference/sdk-reference/typescript/mcp#create) [delete()](https://docs.composio.dev/reference/sdk-reference/typescript/mcp#delete) [generate()](https://docs.composio.dev/reference/sdk-reference/typescript/mcp#generate) [get()](https://docs.composio.dev/reference/sdk-reference/typescript/mcp#get) [list()](https://docs.composio.dev/reference/sdk-reference/typescript/mcp#list) [update()](https://docs.composio.dev/reference/sdk-reference/typescript/mcp#update)
