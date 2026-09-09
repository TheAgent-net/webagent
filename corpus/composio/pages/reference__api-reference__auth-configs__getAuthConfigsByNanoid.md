---
url: https://docs.composio.dev/reference/api-reference/auth-configs/getAuthConfigsByNanoid
title: Get single authentication configuration by ID | Composio
description: Retrieves detailed information about a specific authentication configuration using its unique identifier.
status: 200
---

API Reference [Auth Configs](https://docs.composio.dev/reference/api-reference/auth-configs)

# Get single authentication configuration by IDv3.1

Copy page

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3.1`/`auth_configs`/`{nanoid}`

Send

Authorization

Path

Retrieves detailed information about a specific authentication configuration using its unique identifier.

## [Authorization](https://docs.composio.dev/reference/api-reference/auth-configs/getAuthConfigsByNanoid\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/auth-configs/getAuthConfigsByNanoid\#parameters-path)

nanoidstringRequired

The unique identifier of the authentication configuration to retrieve

Format:`authConfigId`

## [Response Body](https://docs.composio.dev/reference/api-reference/auth-configs/getAuthConfigsByNanoid\#response-body)

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
curl -X GET "https://backend.composio.dev/api/v3.1/auth_configs/string" \
  -H "x-api-key: "
```

200400401404500

```
{
  "id": "string",
  "uuid": "string",
  "type": "default",
  "toolkit": {
    "slug": "string",
    "logo": "string",
    "auth_guide_url": "string",
    "auth_hint_url": "string"
  },
  "name": "string",
  "auth_scheme": "OAUTH2",
  "is_composio_managed": true,
  "credentials": {
    "property1": null,
    "property2": null
  },
  "proxy_config": {
    "proxy_url": "http://example.com",
    "proxy_auth_key": "string"
  },
  "status": "ENABLED",
  "created_by": "string",
  "created_at": "string",
  "last_updated_at": "string",
  "no_of_connections": 0,
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
  ],
  "restrict_to_following_tools": [\
    "string"\
  ],
  "tool_access_config": {
    "tools_for_connected_account_creation": [],
    "tools_available_for_execution": []
  },
  "shared_credentials": {
    "property1": null,
    "property2": null
  },
  "is_enabled_for_tool_router": true
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/auth-configs/getAuthConfigsByNanoid.mdx)
