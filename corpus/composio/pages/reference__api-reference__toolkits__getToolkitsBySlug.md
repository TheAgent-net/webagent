---
url: https://docs.composio.dev/reference/api-reference/toolkits/getToolkitsBySlug
title: Get toolkit by slug | Composio
description: Retrieves comprehensive information about a specific toolkit using its unique slug identifier. This endpoint provides detailed metadata, authentication configuration options, and feature counts for the requested toolkit.
status: 200
---

API Reference [Toolkits](https://docs.composio.dev/reference/api-reference/toolkits)

# Get toolkit by slugv3.1

Copy page

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3.1`/`toolkits`/`{slug}`

Send

Authorization

Path

Query

Retrieves comprehensive information about a specific toolkit using its unique slug identifier. This endpoint provides detailed metadata, authentication configuration options, and feature counts for the requested toolkit.

## [Authorization](https://docs.composio.dev/reference/api-reference/toolkits/getToolkitsBySlug\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/toolkits/getToolkitsBySlug\#parameters-path)

slugstringRequired

Toolkit slug identifier

## [Query Parameters](https://docs.composio.dev/reference/api-reference/toolkits/getToolkitsBySlug\#parameters-query)

versionstring

Version of the toolkit

Default:`"latest"`

## [Response Body](https://docs.composio.dev/reference/api-reference/toolkits/getToolkitsBySlug\#response-body)

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
curl -X GET "https://backend.composio.dev/api/v3.1/toolkits/github" \
  -H "x-api-key: "
```

200400401404500

```
{
  "slug": "github",
  "name": "GitHub",
  "type": "native",
  "enabled": true,
  "composio_managed_auth_schemes": [\
    "oauth2"\
  ],
  "composio_managed_auth": [\
    {\
      "mode": "OAUTH2",\
      "scopes": {\
        "available": [\
          "read",\
          "write"\
        ]\
      },\
      "user_scopes": {\
        "available": [\
          "search:read",\
          "users:read"\
        ]\
      }\
    }\
  ],
  "is_local_toolkit": false,
  "auth_config_details": [\
    {\
      "mode": "oauth2",\
      "required_scopes": [\
        "offline_access",\
        "User.Read"\
      ],\
      "fields": {\
        "auth_config_creation": {\
          "required": [\
            {\
              "name": "string",\
              "displayName": "string",\
              "default": "string",\
              "type": "string",\
              "description": "string",\
              "required": true,\
              "is_secret": true,\
              "legacy_template_name": "string",\
              "user_visible": true\
            }\
          ],\
          "optional": [\
            {\
              "name": "string",\
              "displayName": "string",\
              "default": "string",\
              "type": "string",\
              "description": "string",\
              "required": true,\
              "is_secret": true,\
              "legacy_template_name": "string",\
              "user_visible": true\
            }\
          ]\
        },\
        "connected_account_initiation": {\
          "required": [\
            {\
              "name": "string",\
              "displayName": "string",\
              "default": "string",\
              "type": "string",\
              "description": "string",\
              "required": true,\
              "is_secret": true,\
              "legacy_template_name": "string",\
              "user_visible": true\
            }\
          ],\
          "optional": [\
            {\
              "name": "string",\
              "displayName": "string",\
              "default": "string",\
              "type": "string",\
              "description": "string",\
              "required": true,\
              "is_secret": true,\
              "legacy_template_name": "string",\
              "user_visible": true\
            }\
          ]\
        }\
      },\
      "proxy": {\
        "base_url": "https://auth.example.com/proxy"\
      },\
      "name": "OAuth 2.0",\
      "auth_hint_url": "https://github.com/settings/tokens",\
      "deprecated_auth_provider_details": {\
        "authorization_url": "string",\
        "token_url": "string"\
      }\
    }\
  ],
  "auth_guide_url": "https://composio.dev/auth/github",
  "base_url": "https://api.github.com",
  "meta": {
    "created_at": "2023-01-15T09:30:00.000Z",
    "updated_at": "2023-05-20T14:45:00.000Z",
    "description": "Integrate with GitHub repositories, issues, pull requests, and more.",
    "logo": "https://assets.composio.dev/logos/github.png",
    "app_url": "https://github.com",
    "categories": [\
      {\
        "name": "Developer Tools",\
        "slug": "developer-tools"\
      },\
      {\
        "name": "Productivity",\
        "slug": "productivity"\
      }\
    ],
    "triggers_count": 5,
    "tools_count": 12,
    "version": "20250905_00",
    "available_versions": [\
      "20250905_00",\
      "20250906_00"\
    ]
  },
  "get_current_user_endpoint": "string",
  "get_current_user_endpoint_method": "GET",
  "deprecated": {
    "toolkitId": "string",
    "getCurrentUserEndpoint": "string",
    "rawProxyInfoByAuthSchemes": [\
      {\
        "property1": null,\
        "property2": null\
      }\
    ]
  }
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/toolkits/getToolkitsBySlug.mdx)
