---
url: https://docs.composio.dev/reference/api-reference/auth-configs/getAuthConfigs
title: List authentication configurations with optional filters | Composio
description: Retrieves all auth configs for your project. Auth configs define how users authenticate with external services (OAuth, API keys, etc.). Use filters to find configs for specific toolkits or to distinguish between Composio-managed and custom configurations.
status: 200
---

API Reference [Auth Configs](https://docs.composio.dev/reference/api-reference/auth-configs)

# List authentication configurations with optional filtersv3.1

Copy page

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3.1`/`auth_configs`

Send

Authorization

Query

Retrieves all auth configs for your project. Auth configs define how users authenticate with external services (OAuth, API keys, etc.). Use filters to find configs for specific toolkits or to distinguish between Composio-managed and custom configurations.

## [Authorization](https://docs.composio.dev/reference/api-reference/auth-configs/getAuthConfigs\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Query Parameters](https://docs.composio.dev/reference/api-reference/auth-configs/getAuthConfigs\#parameters-query)

is\_composio\_managedstring \| boolean

Whether to filter by composio managed auth configs

toolkit\_slugstring

Comma-separated list of toolkit slugs to filter auth configs by

deprecated\_app\_idstringDeprecated

The app id to filter by

deprecated\_statusstringDeprecated

DEPRECATED: This parameter will be removed in a future version.

show\_disablednullable boolean

Show disabled auth configs

Default:`false`

searchstring

Search auth configs by name or id

limitnullable number

Number of items per page, max allowed is 50

cursorstring

Cursor for pagination. The cursor is a base64 encoded string of the page and limit. The page is the page number and the limit is the number of items per page. The cursor is used to paginate through the items. The cursor is not required for the first page.

## [Response Body](https://docs.composio.dev/reference/api-reference/auth-configs/getAuthConfigs\#response-body)

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
curl -X GET "https://backend.composio.dev/api/v3.1/auth_configs" \
  -H "x-api-key: "
```

200400401404500

```
{
  "items": [\
    {\
      "id": "string",\
      "uuid": "string",\
      "type": "default",\
      "toolkit": {\
        "slug": "string",\
        "logo": "string",\
        "auth_guide_url": "string",\
        "auth_hint_url": "string"\
      },\
      "name": "string",\
      "auth_scheme": "OAUTH2",\
      "is_composio_managed": true,\
      "credentials": {\
        "property1": null,\
        "property2": null\
      },\
      "proxy_config": {\
        "proxy_url": "http://example.com",\
        "proxy_auth_key": "string"\
      },\
      "status": "ENABLED",\
      "created_by": "string",\
      "created_at": "string",\
      "last_updated_at": "string",\
      "no_of_connections": 0,\
      "expected_input_fields": [\
        {\
          "name": "string",\
          "displayName": "string",\
          "default": "string",\
          "type": "string",\
          "description": "string",\
          "required": true,\
          "is_secret": true,\
          "legacy_template_name": "string",\
          "user_visible": true,\
          "is_available_as_shared_credentials": true\
        }\
      ],\
      "restrict_to_following_tools": [\
        "string"\
      ],\
      "tool_access_config": {\
        "tools_for_connected_account_creation": [],\
        "tools_available_for_execution": []\
      },\
      "shared_credentials": {\
        "property1": null,\
        "property2": null\
      },\
      "is_enabled_for_tool_router": true\
    }\
  ],
  "next_cursor": "string",
  "total_pages": 0,
  "current_page": 0,
  "total_items": 0
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/auth-configs/getAuthConfigs.mdx)
