---
url: https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdSearch
title: Search for tools using a query | Composio
description: Search for tools matching a use case query within an existing tool router session.
status: 200
---

API Reference [Sessions (prev Tool Router)](https://docs.composio.dev/reference/api-reference/tool-router)

# Search for tools using a queryv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`tool_router`/`session`/`{session_id}`/`search`

Send

Authorization

Path

Body

Search for tools matching a use case query within an existing tool router session.

## [Authorization](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdSearch\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdSearch\#parameters-path)

session\_idstringRequired

Tool router session ID (trs\_\*)

Format:`toolRouterSessionId`

## [Request Body](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdSearch\#request-body)

`application/json`

queriesarray of objectRequired

List of search queries to execute in parallel.

Show item properties

modelstring

Optional model hint for search/planning behavior (e.g., "gpt-4o").

search\_strategyenum

Search path to use. Defaults to auto. Use tool\_search to bypass cached plans and run direct tool search.

Possible values:

`auto``tool_search`

experimentalobject

Inline custom tools and toolkits for this request. v3.1 sessions do not persist customs — pass them on every request that needs them.

Show 2 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSessionBySessionIdSearch\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

### 413  `application/json`

### 429  `application/json`

### 500  `application/json`

### 502  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X POST "https://backend.composio.dev/api/v3.1/tool_router/session/trs_LX9uJKBinWWr/search" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [\
      {\
        "use_case": "Send a slack message to a channel"\
      }\
    ]
  }'
```

200400401403404413429500502

```
{
  "success": true,
  "error": "string",
  "results": [\
    {\
      "index": 0,\
      "use_case": "string",\
      "execution_guidance": "string",\
      "difficulty": "string",\
      "recommended_plan_steps": [\
        "string"\
      ],\
      "known_pitfalls": [\
        "string"\
      ],\
      "reference_workbench_snippets": [\
        {\
          "description": "string",\
          "code": "string"\
        }\
      ],\
      "primary_tool_slugs": [\
        "string"\
      ],\
      "related_tool_slugs": [\
        "string"\
      ],\
      "toolkits": [\
        "string"\
      ],\
      "plan_id": "string",\
      "error": "string",\
      "memory": {\
        "property1": [\
          "string"\
        ],\
        "property2": [\
          "string"\
        ]\
      }\
    }\
  ],
  "toolkit_connection_statuses": [\
    {\
      "toolkit": "string",\
      "description": "string",\
      "has_active_connection": true,\
      "connection_details": {\
        "property1": null,\
        "property2": null\
      },\
      "current_user_info": {\
        "property1": null,\
        "property2": null\
      },\
      "account_type": "PRIVATE",\
      "accounts": [\
        {\
          "id": "string",\
          "alias": "string",\
          "user_info": {\
            "property1": null,\
            "property2": null\
          },\
          "status": "string",\
          "created_at": "string",\
          "is_default": true,\
          "account_type": "PRIVATE"\
        }\
      ],\
      "account_selection": "required",\
      "status_message": "string"\
    }\
  ],
  "tool_schemas": {
    "property1": {
      "toolkit": "string",
      "tool_slug": "string",
      "description": "string",
      "input_schema": {
        "property1": null,
        "property2": null
      },
      "output_schema": {
        "property1": null,
        "property2": null
      },
      "hasFullSchema": true,
      "schemaRef": {
        "tool": "COMPOSIO_GET_TOOL_SCHEMAS",
        "args": {
          "tool_slugs": [\
            "string"\
          ]
        },
        "message": "string"
      }
    },
    "property2": {
      "toolkit": "string",
      "tool_slug": "string",
      "description": "string",
      "input_schema": {
        "property1": null,
        "property2": null
      },
      "output_schema": {
        "property1": null,
        "property2": null
      },
      "hasFullSchema": true,
      "schemaRef": {
        "tool": "COMPOSIO_GET_TOOL_SCHEMAS",
        "args": {
          "tool_slugs": [\
            "string"\
          ]
        },
        "message": "string"
      }
    }
  },
  "time_info": {
    "current_time_utc": "string",
    "current_time_utc_epoch_seconds": 0,
    "message": "string"
  },
  "session": {
    "id": "string",
    "generate_id": true,
    "instructions": "string"
  },
  "next_steps_guidance": [\
    "string"\
  ]
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/tool-router/postToolRouterSessionBySessionIdSearch.mdx)
