---
url: https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdAttach
title: Attach to an existing tool router session (v3.1) | Composio
description: Fetch an existing tool router session by ID.
status: 200
---

API Reference [Sessions (prev Tool Router)](https://docs.composio.dev/reference/api-reference/tool-router)

# Attach to an existing tool router session (v3.1)v3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`tool_router`/`session`/`{session_id}`/`attach`

Send

Authorization

Path

Body

Fetch an existing tool router session by ID.

## [Authorization](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdAttach\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdAttach\#parameters-path)

session\_idstringRequired

The unique identifier of the tool router session

Format:`toolRouterSessionId`

## [Request Body](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdAttach\#request-body)

`application/json`

experimentalobject

Inline custom tools and toolkits for this request. v3.1 sessions do not persist customs — pass them on every request that needs them.

Show 2 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdAttach\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 404  `application/json`

### 500  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X POST "https://backend.composio.dev/api/v3.1/tool_router/session/trs_1a2b3c4d5e6f/attach" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{}'
```

200400401404500

```
{
  "session_id": "trs_1a2b3c4d5e6f",
  "mcp": {
    "type": "http",
    "url": "https://app.composio.dev/tool_router/v3/trs_1a2b3c4d5e6f/mcp"
  },
  "tool_router_tools": [\
    "string"\
  ],
  "config": {
    "user_id": "string",
    "toolkits": {
      "enabled": [\
        "string"\
      ]
    },
    "auth_configs": {
      "property1": "string",
      "property2": "string"
    },
    "manage_connections": {
      "enabled": true,
      "callback_url": "http://example.com",
      "enable_wait_for_connections": false,
      "enable_connection_removal": true
    },
    "tools": {
      "property1": {
        "enabled": [\
          "string"\
        ]
      },
      "property2": {
        "enabled": [\
          "string"\
        ]
      }
    },
    "tags": {
      "enabled": [\
        "readOnlyHint"\
      ],
      "disabled": [\
        "readOnlyHint"\
      ]
    },
    "workbench": {
      "enable": true,
      "proxy_execution_enabled": true
    },
    "multi_account": {
      "enable": true,
      "max_accounts_per_toolkit": 0,
      "require_explicit_selection": true
    },
    "preload": {
      "tools": [\
        "string"\
      ]
    },
    "connected_accounts": {
      "property1": [\
        "string"\
      ],
      "property2": [\
        "string"\
      ]
    },
    "search": {
      "enable": true
    },
    "execute": {
      "enable_multi_execute": true
    }
  },
  "config_version": 0,
  "experimental": {
    "assistive_prompt": "string",
    "custom_toolkits": [\
      {\
        "slug": "string",\
        "name": "string",\
        "description": "string",\
        "tools": [\
          {\
            "slug": "string",\
            "name": "string",\
            "description": "string",\
            "input_schema": {\
              "property1": null,\
              "property2": null\
            },\
            "output_schema": {\
              "property1": null,\
              "property2": null\
            },\
            "original_slug": "string",\
            "preload": true\
          }\
        ],\
        "preload": true\
      }\
    ],
    "custom_tools": [\
      {\
        "slug": "string",\
        "name": "string",\
        "description": "string",\
        "input_schema": {\
          "property1": null,\
          "property2": null\
        },\
        "output_schema": {\
          "property1": null,\
          "property2": null\
        },\
        "extends_toolkit": "string",\
        "original_slug": "string",\
        "preload": true\
      }\
    ]
  },
  "warnings": [\
    {\
      "code": "PRELOAD_TOOLS_HIGH_CONTEXT_USAGE",\
      "message": "Session preloads 25 tools; each preloaded tool adds to the agent context window. Consider keeping the list at or under ~20 tools."\
    }\
  ]
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/tool-router/postToolRouterSessionBySessionIdAttach.mdx)
