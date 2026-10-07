---
url: https://docs.composio.dev/reference/api-reference/tool-router/patchToolRouterSessionBySessionId
title: Patch a tool router session config (v3.1) | Composio
description: Partially updates the configuration of an existing tool router session. Only the fields provided in the request body will be updated. Uses optimistic concurrency control to prevent lost updates. The previous config is stored in config history.
status: 200
---

API Reference [Sessions (prev Tool Router)](https://docs.composio.dev/reference/api-reference/tool-router)

# Patch a tool router session config (v3.1)v3.1

Copy page

Server URL`https://backend.composio.dev/`

PATCH

``/`api`/`v3.1`/`tool_router`/`session`/`{session_id}`

Send

Authorization

Path

Body

Partially updates the configuration of an existing tool router session. Only the fields provided in the request body will be updated. Uses optimistic concurrency control to prevent lost updates. The previous config is stored in config history.

## [Authorization](https://docs.composio.dev/reference/api-reference/tool-router/patchToolRouterSessionBySessionId\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/tool-router/patchToolRouterSessionBySessionId\#parameters-path)

session\_idstringRequired

The unique identifier of the tool router session

Format:`toolRouterSessionId`

## [Request Body](https://docs.composio.dev/reference/api-reference/tool-router/patchToolRouterSessionBySessionId\#request-body)

`application/json`

toolkitsobject \| object

Toolkit configuration - specify either enable toolkits (allowlist) or disable toolkits (denylist). Mutually exclusive.

Show 2 child attributes

auth\_configsobject

The auth configs to use for the session. This will override the default behavior and use the given auth config when specific toolkits are being executed

Show 1 child attributes

connected\_accountsnullable object

The connected accounts to use for the session, as an array of nano-IDs per toolkit. This overrides the default behaviour and pins specific connected accounts when toolkits are executed. Each account must exist (not deleted or disabled) and belong to the same `user_id` as the session. Multi-account sessions can pin multiple; non-multi-account sessions are capped at length 1.

manage\_connectionsnullable object

Show 4 child attributes

toolsobject

Tool-level configuration per toolkit. Allows you to enable, disable, or filter by tags for specific tools within each toolkit. Every slug passed in `enable` / `disable` must be a valid Composio tool slug for that toolkit — invalid or typo'd slugs fail session creation with a clear error listing which ones didn't match.

Show 1 child attributes

tagsenum\[\] \| object

Global MCP tool annotation hints for filtering. Array format is treated as enabled list. Object format supports both enabled (tool must have at least one) and disabled (tool must NOT have any) lists. Toolkit-level tags override this. Toolkit enabled/disabled lists take precedence over tag filtering.

Show 2 child attributes

workbenchnullable object

Show 4 child attributes

multi\_accountnullable object

Show 3 child attributes

preloadobject

Preload configuration. Use an explicit list for frequently used tool slugs, or "all" to dynamically expose every app tool allowed by positive toolkits/tools/tags filters.

Show 1 child attributes

searchobject

Show 1 child attributes

executeobject

Show 1 child attributes

experimentalnullable object

Show 3 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/tool-router/patchToolRouterSessionBySessionId\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 404  `application/json`

### 408  `application/json`

### 409  `application/json`

### 500  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X PATCH "https://backend.composio.dev/api/v3.1/tool_router/session/trs_1a2b3c4d5e6f" \  -H "x-api-key: " \  -H "Content-Type: application/json" \  -d '{}'
```

200400401404408409500

```
{  "session_id": "trs_1a2b3c4d5e6f",  "mcp": {    "type": "http",    "url": "https://app.composio.dev/tool_router/v3/trs_1a2b3c4d5e6f/mcp"  },  "tool_router_tools": [    "string"  ],  "config": {    "user_id": "string",    "toolkits": {      "enabled": [        "string"      ]    },    "auth_configs": {      "property1": "string",      "property2": "string"    },    "manage_connections": {      "enabled": true,      "callback_url": "http://example.com",      "enable_wait_for_connections": false,      "enable_connection_removal": true    },    "tools": {      "property1": {        "enabled": [          "string"        ]      },      "property2": {        "enabled": [          "string"        ]      }    },    "tags": {      "enabled": [        "readOnlyHint"      ],      "disabled": [        "readOnlyHint"      ]    },    "workbench": {      "enable": true,      "proxy_execution_enabled": true    },    "multi_account": {      "enable": true,      "max_accounts_per_toolkit": 0,      "require_explicit_selection": true    },    "preload": {      "tools": [        "string"      ]    },    "connected_accounts": {      "property1": [        "string"      ],      "property2": [        "string"      ]    },    "search": {      "enable": true    },    "execute": {      "enable_multi_execute": true    }  },  "config_version": 0,  "experimental": {    "assistive_prompt": "string",    "custom_toolkits": [      {        "slug": "string",        "name": "string",        "description": "string",        "tools": [          {            "slug": "string",            "name": "string",            "description": "string",            "input_schema": {              "property1": null,              "property2": null            },            "output_schema": {              "property1": null,              "property2": null            },            "original_slug": "string",            "preload": true          }        ],        "preload": true      }    ],    "custom_tools": [      {        "slug": "string",        "name": "string",        "description": "string",        "input_schema": {          "property1": null,          "property2": null        },        "output_schema": {          "property1": null,          "property2": null        },        "extends_toolkit": "string",        "original_slug": "string",        "preload": true      }    ]  },  "warnings": [    {      "code": "PRELOAD_TOOLS_HIGH_CONTEXT_USAGE",      "message": "Session preloads 25 tools; each preloaded tool adds to the agent context window. Consider keeping the list at or under ~20 tools."    }  ]}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/tool-router/patchToolRouterSessionBySessionId.mdx)
