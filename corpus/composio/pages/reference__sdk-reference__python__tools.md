---
url: https://docs.composio.dev/reference/sdk-reference/python/tools
title: Tools | Composio
description: Tools class definition  This class is used to manage tools in the Composio SDK. It provides methods to list, get, and execute tools.  Generic Param...
status: 200
---

SDK Reference [Python SDK](https://docs.composio.dev/reference/sdk-reference/python)

# Tools

Copy page

## [Methods](https://docs.composio.dev/reference/sdk-reference/python/tools\#methods)

### [get\_raw\_composio\_tool\_by\_slug()](https://docs.composio.dev/reference/sdk-reference/python/tools\#get_raw_composio_tool_by_slug)

Returns schema for the given tool slug.

```
def get_raw_composio_tool_by_slug(slug: str) -> Tool
```

**Parameters**

| Name | Type |
| --- | --- |
| `slug` | `str` |

**Returns**

`Tool`

* * *

### [get\_raw\_composio\_tools()](https://docs.composio.dev/reference/sdk-reference/python/tools\#get_raw_composio_tools)

Get a list of tool schemas based on the provided filters.

```
def get_raw_composio_tools(tools: list[str | None] = ..., search: str | None = ..., toolkits: list[str | None] = ..., scopes: List[str | None] = ..., limit: int | None = ...) -> list[Tool]
```

**Parameters**

| Name | Type |
| --- | --- |
| `tools?` | `list[str | None]` |
| `search?` | `str | None` |
| `toolkits?` | `list[str | None]` |
| `scopes?` | `List[str | None]` |
| `limit?` | `int | None` |

**Returns**

`list[Tool]`

* * *

### [get\_raw\_tool\_router\_meta\_tools()](https://docs.composio.dev/reference/sdk-reference/python/tools\#get_raw_tool_router_meta_tools)

Fetches the tools exposed by a tool router session. This method fetches helper/meta tools and any preloaded app tools from the Composio API and transforms them to the expected format. It provides access to the underlying tool data without provider-specific wrapping.

```
def get_raw_tool_router_meta_tools(session_id: str, modifiers: 'Modifiers' | None = ...) -> list[Tool]
```

**Parameters**

| Name | Type |
| --- | --- |
| `session_id` | `str` |
| `modifiers?` | `'Modifiers' | None` |

**Returns**

`list[Tool]` — The list of meta tools

**Example**

```
from composio import Composio

composio = Composio()
tools_model = composio.tools

# Get meta tools for a session
meta_tools = tools_model.get_raw_tool_router_meta_tools("session_123")
print(meta_tools)

# Get meta tools with schema modifiers
from composio.core.models import schema_modifier

@schema_modifier
def modify_schema(tool: str, toolkit: str, schema):
    # Customize the schema
    schema.description = f"Modified: {schema.description}"
    return schema

meta_tools = tools_model.get_raw_tool_router_meta_tools(
    "session_123",
    modifiers=[modify_schema]
)
```

* * *

### [get()](https://docs.composio.dev/reference/sdk-reference/python/tools\#get)

Get a tool or list of tools based on the provided arguments. The return type is automatically inferred based on the provider's generic parameters. For example: - OpenAIProvider -> list\[ChatCompletionToolParam\] - AnthropicProvider -> list\[ToolParam\] - CustomProvider\[MyTool, list\[MyTool\]\] -> list\[MyTool\]

```
def get(user_id: str, slug: str | None = ..., tools: list[str | None] = ..., search: str | None = ..., toolkits: list[str | None] = ..., scopes: List[str | None] = ..., modifiers: Modifiers | None = ..., limit: int | None = ...) -> TToolCollection
```

**Parameters**

| Name | Type |
| --- | --- |
| `user_id` | `str` |
| `slug?` | `str | None` |
| `tools?` | `list[str | None]` |
| `search?` | `str | None` |
| `toolkits?` | `list[str | None]` |
| `scopes?` | `List[str | None]` |
| `modifiers?` | `Modifiers | None` |
| `limit?` | `int | None` |

**Returns**

`TToolCollection` — Provider-specific tool collection (TToolCollection).

* * *

### [execute()](https://docs.composio.dev/reference/sdk-reference/python/tools\#execute)

Execute a tool with the provided parameters. This method calls the Composio API to execute the tool and returns the response.

```
def execute(slug: str, arguments: Dict, connected_account_id: str | None = ..., custom_auth_params: tool_execute_params.CustomAuthParams | None = ..., custom_connection_data: tool_execute_params.CustomConnectionData | None = ..., user_id: str | None = ..., text: str | None = ..., version: str | None = ..., dangerously_skip_version_check: bool | None = ..., modifiers: Modifiers | None = ...) -> ToolExecutionResponse
```

**Parameters**

| Name | Type |
| --- | --- |
| `slug` | `str` |
| `arguments` | `Dict` |
| `connected_account_id?` | `str | None` |
| `custom_auth_params?` | `tool_execute_params.CustomAuthParams | None` |
| `custom_connection_data?` | `tool_execute_params.CustomConnectionData | None` |
| `user_id?` | `str | None` |
| `text?` | `str | None` |
| `version?` | `str | None` |
| `dangerously_skip_version_check?` | `bool | None` |
| `modifiers?` | `Modifiers | None` |

**Returns**

`ToolExecutionResponse` — The response from the tool.

* * *

### [proxy()](https://docs.composio.dev/reference/sdk-reference/python/tools\#proxy)

Proxy a tool call to the Composio API

```
def proxy(endpoint: str, method: Literal['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'], body: object | None = ..., connected_account_id: str | None = ..., parameters: List[tool_proxy_params.Parameter | None] = ..., custom_connection_data: tool_proxy_params.CustomConnectionData | None = ...) -> tool_proxy_response.ToolProxyResponse
```

**Parameters**

| Name | Type |
| --- | --- |
| `endpoint` | `str` |
| `method` | `Literal['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']` |
| `body?` | `object | None` |
| `connected_account_id?` | `str | None` |
| `parameters?` | `List[tool_proxy_params.Parameter | None]` |
| `custom_connection_data?` | `tool_proxy_params.CustomConnectionData | None` |

**Returns**

`tool_proxy_response.ToolProxyResponse`

* * *

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/tools.py#L119)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/sdk-reference/python/tools.mdx)

### On this page

[Methods](https://docs.composio.dev/reference/sdk-reference/python/tools#methods) [get\_raw\_composio\_tool\_by\_slug()](https://docs.composio.dev/reference/sdk-reference/python/tools#get_raw_composio_tool_by_slug) [get\_raw\_composio\_tools()](https://docs.composio.dev/reference/sdk-reference/python/tools#get_raw_composio_tools) [get\_raw\_tool\_router\_meta\_tools()](https://docs.composio.dev/reference/sdk-reference/python/tools#get_raw_tool_router_meta_tools) [get()](https://docs.composio.dev/reference/sdk-reference/python/tools#get) [execute()](https://docs.composio.dev/reference/sdk-reference/python/tools#execute) [proxy()](https://docs.composio.dev/reference/sdk-reference/python/tools#proxy)
