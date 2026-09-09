---
url: https://docs.composio.dev/docs/single-toolkit-mcp
title: Single Toolkit MCP | Composio
description: Create MCP servers for specific toolkits
status: 200
---

# Single Toolkit MCP

Copy page

For most use cases, use a regular [session](https://docs.composio.dev/docs/configuring-sessions) instead. Sessions provide dynamic tool access and a much better MCP experience with context management handled by us.

## [Install the SDK](https://docs.composio.dev/docs/single-toolkit-mcp\#install-the-sdk)

PythonTypeScript

```
uv add composio
```

## [Create an MCP server](https://docs.composio.dev/docs/single-toolkit-mcp\#create-an-mcp-server)

### [Initialize Composio](https://docs.composio.dev/docs/single-toolkit-mcp\#initialize-composio)

PythonTypeScript

```
from composio import Composio

composio = Composio(api_key="YOUR_API_KEY")
```

### [Create server configuration](https://docs.composio.dev/docs/single-toolkit-mcp\#create-server-configuration)

**Before you begin:** [Create an auth configuration](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs) for your toolkit.

PythonTypeScript

```
server = composio.mcp.create(
    name="my-gmail-server",
    toolkits=[{\
        "toolkit": "gmail",\
        "auth_config": "ac_xyz123"\
    }],
    allowed_tools=["GMAIL_FETCH_EMAILS", "GMAIL_SEND_EMAIL"]
)

print(f"Server created: {server.id}")
```

You can also create and manage MCP configs from the [Composio dashboard](https://dashboard.composio.dev/~/org/connect/clients?utm_source=docs&utm_medium=content&utm_campaign=docs-single-toolkit-mcp).

### [Generate user URLs](https://docs.composio.dev/docs/single-toolkit-mcp\#generate-user-urls)

Users must authenticate with the toolkits configured in your MCP server first. See [authentication](https://docs.composio.dev/docs/authentication) for details.

PythonTypeScript

```
instance = composio.mcp.generate(user_id="user-123", mcp_config_id=server.id)

print(f"MCP Server URL: {instance['url']}")
```

### [Use with AI providers](https://docs.composio.dev/docs/single-toolkit-mcp\#use-with-ai-providers)

Pass an `x-api-key` header when connecting to Composio MCP. This is required when `require_mcp_api_key` is enabled (default for newly created organizations).

OpenAI (Python)Anthropic (Python)Mastra (TypeScript)

```
from openai import OpenAI

client = OpenAI(api_key="your-openai-api-key")

mcp_server_url = "https://backend.composio.dev/v3/mcp/YOUR_SERVER_ID?user_id=YOUR_USER_ID"
mcp_headers = {"x-api-key": "YOUR_COMPOSIO_API_KEY"}

response = client.responses.create(
    model="gpt-5",
    tools=[{\
        "type": "mcp",\
        "server_label": "composio-server",\
        "server_url": mcp_server_url,\
        "headers": mcp_headers,\
        "require_approval": "never",\
    }],
    input="What are my latest emails?",
)

print(response.output_text)
```

## [Server management](https://docs.composio.dev/docs/single-toolkit-mcp\#server-management)

### [List servers](https://docs.composio.dev/docs/single-toolkit-mcp\#list-servers)

PythonTypeScript

```
servers = composio.mcp.list()
print(f"Found {len(servers['items'])} servers")

# Filter by toolkit
gmail_servers = composio.mcp.list(toolkits="gmail", limit=20)
```

### [Get server details](https://docs.composio.dev/docs/single-toolkit-mcp\#get-server-details)

PythonTypeScript

```
server = composio.mcp.get("mcp_server_id")
print(f"Server: {server.name}")
```

### [Update a server](https://docs.composio.dev/docs/single-toolkit-mcp\#update-a-server)

PythonTypeScript

```
updated = composio.mcp.update(
    server_id="mcp_server_id",
    name="updated-name",
    allowed_tools=["GMAIL_FETCH_EMAILS", "GMAIL_SEARCH_EMAILS"]
)
```

### [Delete a server](https://docs.composio.dev/docs/single-toolkit-mcp\#delete-a-server)

PythonTypeScript

```
result = composio.mcp.delete("mcp_server_id")
if result['deleted']:
    print("Server deleted")
```

## [Next](https://docs.composio.dev/docs/single-toolkit-mcp\#next)

[**Providers** \\
\\
Use with Anthropic, OpenAI, and other frameworks](https://docs.composio.dev/docs/providers)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/single-toolkit-mcp.mdx)

### On this page

[Install the SDK](https://docs.composio.dev/docs/single-toolkit-mcp#install-the-sdk) [Create an MCP server](https://docs.composio.dev/docs/single-toolkit-mcp#create-an-mcp-server) [Initialize Composio](https://docs.composio.dev/docs/single-toolkit-mcp#initialize-composio) [Create server configuration](https://docs.composio.dev/docs/single-toolkit-mcp#create-server-configuration) [Generate user URLs](https://docs.composio.dev/docs/single-toolkit-mcp#generate-user-urls) [Use with AI providers](https://docs.composio.dev/docs/single-toolkit-mcp#use-with-ai-providers) [Server management](https://docs.composio.dev/docs/single-toolkit-mcp#server-management) [List servers](https://docs.composio.dev/docs/single-toolkit-mcp#list-servers) [Get server details](https://docs.composio.dev/docs/single-toolkit-mcp#get-server-details) [Update a server](https://docs.composio.dev/docs/single-toolkit-mcp#update-a-server) [Delete a server](https://docs.composio.dev/docs/single-toolkit-mcp#delete-a-server) [Next](https://docs.composio.dev/docs/single-toolkit-mcp#next)
