---
url: https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions
title: Scoped Project API Key | Composio
description: Choose which project resources a scoped API key can access.
status: 200
---

Authenticating to Composio

# Scoped Project API Key

Copy page

Project Scoped API Keys - YouTube

Tap to unmute

[Project Scoped API Keys](https://www.youtube.com/watch?v=ySMu9lljkWg) [Composio](https://www.youtube.com/channel/UCEuoGOJFuXUZZhprSAAK85Q)

Composio4.76K subscribers

[Watch on](https://www.youtube.com/watch?v=ySMu9lljkWg)

A scoped project API key lets you choose which project resources the key can access. Reach for one when a key needs only a subset of your project, such as executing tools, reading logs, or managing connected accounts.

You pick a key's permissions when you create it, and they can't be changed afterward. To adjust them, create a new key and rotate your application to use it.

Default project API keys keep full project API key access. Scoped keys use the permission areas and access levels on this page.

## [Create a scoped API key](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#create-a-scoped-api-key)

Create a scoped key from the dashboard:

Go to the [Composio Dashboard](https://dashboard.composio.dev/).

Select **Platform**.

Select your project.

Go to **Settings**.

Open the **API Keys** tab.

Click **Create API Key**, then choose the permission areas and access levels below.

## [Access levels](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#access-levels)

| Access level | What it allows |
| --- | --- |
| No access | The key cannot use routes in that permission area. |
| Read only | The key can use read routes in that permission area. |
| Write only | The key can use write routes in that permission area. |
| Read and write | The key can use both read and write routes in that permission area. |

Some read routes use `POST` because the request body carries filters or lookup input. The access level is based on what the route does, not only the HTTP method.

When v3 and v3.1 expose the same route shape, this page lists one representative version instead of repeating both. Version-specific routes are listed separately.

## [Permission areas](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#permission-areas)

Jump to each permission area to see the routes it covers.

| Permission area | Available levels | Routes |
| --- | --- | --- |
| Auth configs | No access, Read only, Write only, Read and write | [View routes](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#auth-configs) |
| Connected accounts | No access, Read only, Write only, Read and write | [View routes](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#connected-accounts) |
| Tools | No access, Read only | [View routes](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#tools) |
| Tool execution | No access, Write only | [View routes](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#tool-execution) |
| Proxy execute | No access, Write only | [View routes](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#proxy-execute) |
| Toolkits | No access, Read only, Write only, Read and write | [View routes](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#toolkits) |
| Triggers | No access, Read only, Write only, Read and write | [View routes](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#triggers) |
| Webhooks | No access, Read only, Write only, Read and write | [View routes](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#webhooks) |
| Observability | No access, Read only | [View routes](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#observability) |
| Sessions | No access, Read only, Write only, Read and write | [View routes](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#sessions) |

## [Auth configs](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#auth-configs)

View and modify auth configs.

| Access | Method | Endpoint |
| --- | --- | --- |
| Read | `GET` | `/api/v3/auth_configs` |
| Read | `GET` | `/api/v3/auth_configs/{nanoid}` |
| Write | `POST` | `/api/v3/auth_configs` |
| Write | `PATCH` | `/api/v3/auth_configs/{nanoid}` |
| Write | `DELETE` | `/api/v3/auth_configs/{nanoid}` |
| Write | `PATCH` | `/api/v3/auth_configs/{nanoid}/{status}` |

## [Connected accounts](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#connected-accounts)

View and manage connected accounts.

| Access | Method | Endpoint |
| --- | --- | --- |
| Read | `GET` | `/api/v3/connected_accounts` |
| Read | `GET` | `/api/v3/connected_accounts/{nanoid}` |
| Write | `POST` | `/api/v3/connected_accounts` |
| Write | `POST` | `/api/v3/connected_accounts/link` |
| Write | `PATCH` | `/api/v3/connected_accounts/{nanoid}` |
| Write | `PATCH` | `/api/v3/connected_accounts/{nanoid}/status` |
| Write | `POST` | `/api/v3/connected_accounts/{nanoid}/refresh` |
| Write | `DELETE` | `/api/v3/connected_accounts/{nanoid}` |
| Write | `POST` | `/api/v3.1/connected_accounts/{nanoid}/revoke` |

## [Tools](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#tools)

View tool definitions, inputs, scopes, and versions.

| Access | Method | Endpoint |
| --- | --- | --- |
| Read | `GET` | `/api/v3.1/tools` |
| Read | `GET` | `/api/v3.1/tools/enum` |
| Read | `GET` | `/api/v3.1/tools/{tool_slug}` |
| Read | `GET` | `/api/v3/tools/{tool_slug}/get_latest_version` |
| Read | `GET` | `/api/v3.1/tools/scopes/required` |
| Read | `GET` | `/api/v3.1/tools/get_scopes_required` |
| Read | `POST` | `/api/v3.1/tools/execute/{tool_slug}/input` |

## [Tool execution](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#tool-execution)

Execute predefined Composio tools.

| Access | Method | Endpoint |
| --- | --- | --- |
| Write | `POST` | `/api/v3.1/tools/execute/{tool_slug}` |
| Write | `POST` | `/api/v3/files/upload/request` |
| Write | `POST` | `/api/v3/files/upload/response` |
| Write | `GET` | `/api/v3/files/list` |

## [Proxy execute](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#proxy-execute)

Execute raw proxy requests against connected accounts.

Proxy execute is separate from tool execution. Grant it only when your application needs to call a connected account API through the raw proxy path.

| Access | Method | Endpoint |
| --- | --- | --- |
| Write | `POST` | `/api/v3.1/tools/execute/proxy` |
| Write | `POST` | `/api/v3/tool_router/session/{session_id}/proxy_execute` |

## [Toolkits](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#toolkits)

View and install toolkits.

| Access | Method | Endpoint |
| --- | --- | --- |
| Read | `GET` | `/api/v3/toolkits` |
| Read | `GET` | `/api/v3/toolkits/{slug}` |
| Read | `GET` | `/api/v3/toolkits/categories` |
| Read | `GET` | `/api/v3/toolkits/changelog` |
| Write | `POST` | `/api/v3/toolkits/multi` |

## [Triggers](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#triggers)

View trigger types, manage trigger instances, and subscribe to trigger events. The realtime routes are called by the SDK (`triggers.subscribe()`) and the CLI to receive trigger events.

| Access | Method | Endpoint |
| --- | --- | --- |
| Read | `GET` | `/api/v3/triggers_types` |
| Read | `GET` | `/api/v3/triggers_types/{slug}` |
| Read | `GET` | `/api/v3/triggers_types/list/enum` |
| Read | `GET` | `/api/v3/trigger_instances/active` |
| Read | `GET` | `/api/v3/cli/realtime/credentials` |
| Read | `POST` | `/api/v3/cli/realtime/auth` |
| Read | `GET` | `/api/v3/internal/sdk/realtime/credentials` |
| Read | `POST` | `/api/v3/internal/sdk/realtime/auth` |
| Write | `POST` | `/api/v3/trigger_instances/{slug}/upsert` |
| Write | `PATCH` | `/api/v3/trigger_instances/manage/{triggerId}` |
| Write | `DELETE` | `/api/v3/trigger_instances/manage/{triggerId}` |

## [Webhooks](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#webhooks)

View and manage webhook endpoints and subscriptions.

| Access | Method | Endpoint |
| --- | --- | --- |
| Read | `GET` | `/api/v3/webhook_endpoints` |
| Read | `GET` | `/api/v3/webhook_endpoints/{nano_id}` |
| Read | `GET` | `/api/v3/webhook_endpoints/schema` |
| Read | `GET` | `/api/v3/webhook_subscriptions` |
| Read | `GET` | `/api/v3/webhook_subscriptions/{id}` |
| Read | `GET` | `/api/v3/webhook_subscriptions/event_types` |
| Write | `POST` | `/api/v3/webhook_endpoints` |
| Write | `POST` | `/api/v3/webhook_endpoints/{nano_id}` |
| Write | `PATCH` | `/api/v3/webhook_endpoints/{nano_id}` |
| Write | `DELETE` | `/api/v3/webhook_endpoints/{nano_id}` |
| Write | `POST` | `/api/v3/webhook_subscriptions` |
| Write | `PATCH` | `/api/v3/webhook_subscriptions/{id}` |
| Write | `DELETE` | `/api/v3/webhook_subscriptions/{id}` |
| Write | `POST` | `/api/v3/webhook_subscriptions/{id}/rotate_secret` |

## [Observability](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#observability)

View execution logs and project usage summaries.

| Access | Method | Endpoint |
| --- | --- | --- |
| Read | `POST` | `/api/v3.1/logs/tool_execution` |
| Read | `GET` | `/api/v3.1/logs/tool_execution/{id}` |
| Read | `POST` | `/api/v3.1/project/usage/{entity_type}` |
| Read | `POST` | `/api/v3.1/project/usage/summary` |

## [Sessions](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#sessions)

Create and operate sessions and MCP servers. This permission area covers MCP server management, the MCP runtime transport, and the tool router MCP transport.

| Access | Method | Endpoint |
| --- | --- | --- |
| Read | `GET` | `/api/v3/mcp/servers` |
| Read | `GET` | `/api/v3/mcp/{id}` |
| Read | `GET` | `/api/v3/mcp/app/{app_key}` |
| Read | `GET` | `/api/v3/mcp/servers/{server_id}/instances` |
| Read | `GET` | `/tool_router/{session_id}/mcp` |
| Read | `GET` | `/api/v3.1/tool_router/session/{session_id}` |
| Read | `GET` | `/api/v3/tool_router/session/{session_id}/toolkits` |
| Read | `GET` | `/api/v3.1/tool_router/session/{session_id}/tools` |
| Read | `GET` | `/api/v3/tool_router/session/{session_id}/mounts/{mount_id}/items` |
| Read | `GET` | `/api/v3.1/tool_router/session/{session_id}/config_history` |
| Write | `POST` | `/api/v3/mcp/servers` |
| Write | `POST` | `/api/v3/mcp/servers/generate` |
| Write | `POST` | `/api/v3/mcp/servers/custom` |
| Write | `PATCH` | `/api/v3/mcp/{id}` |
| Write | `DELETE` | `/api/v3/mcp/{id}` |
| Write | `POST` | `/api/v3/mcp/servers/{server_id}/instances` |
| Write | `DELETE` | `/api/v3/mcp/servers/{server_id}/instances/{instance_id}` |
| Write | `POST` | `/api/v3/mcp/{server_id}/{transport}` |
| Write | `DELETE` | `/api/v3/mcp/{server_id}/{transport}` |
| Write | `POST` | `/tool_router/{session_id}/mcp` |
| Write | `DELETE` | `/tool_router/{session_id}/mcp` |
| Write | `POST` | `/api/v3.1/tool_router/session` |
| Write | `POST` | `/api/v3.1/tool_router/session/{session_id}/execute` |
| Write | `POST` | `/api/v3.1/tool_router/session/{session_id}/execute_meta` |
| Write | `POST` | `/api/v3/tool_router/session/{session_id}/link` |
| Write | `POST` | `/api/v3.1/tool_router/session/{session_id}/search` |
| Write | `PATCH` | `/api/v3.1/tool_router/session/{session_id}` |
| Write | `POST` | `/api/v3/tool_router/session/{session_id}/mounts/{mount_id}/upload_url` |
| Write | `POST` | `/api/v3/tool_router/session/{session_id}/mounts/{mount_id}/download_url` |
| Write | `POST` | `/api/v3/tool_router/session/{session_id}/mounts/{mount_id}/delete` |
| Write | `POST` | `/api/v3.1/tool_router/session/{session_id}/attach` |

## [What to read next](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions\#what-to-read-next)

[**Authenticating to Composio** \\
Authenticate API requests with project and organization API keys](https://docs.composio.dev/reference/authenticating-to-composio) [**Projects** \\
Understand projects, project API keys, and project-scoped resources](https://docs.composio.dev/reference/api-reference/projects) [**Proxy execute** \\
Call connected account APIs through the raw proxy path](https://docs.composio.dev/reference/api-reference/tools) [**Observability** \\
Inspect tool execution logs and usage summaries](https://docs.composio.dev/reference/api-reference/logs)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/authenticating-to-composio/project-api-key-permissions.mdx)

### On this page

[Create a scoped API key](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#create-a-scoped-api-key) [Access levels](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#access-levels) [Permission areas](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#permission-areas) [Auth configs](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#auth-configs) [Connected accounts](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#connected-accounts) [Tools](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#tools) [Tool execution](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#tool-execution) [Proxy execute](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#proxy-execute) [Toolkits](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#toolkits) [Triggers](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#triggers) [Webhooks](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#webhooks) [Observability](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#observability) [Sessions](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#sessions) [What to read next](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions#what-to-read-next)
