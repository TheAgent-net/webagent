---
url: https://docs.composio.dev/reference/api-reference/projects/postOrgOwnerProjectNew
title: Create a new project | Composio
description: Creates a new project within the authenticated user's organization using the specified name. Projects are isolated environments within your organization, each with their own API keys, webhook configurations, and resources. Use this endpoint to create additional projects for different environments (e.g., development, staging, production) or for separate applications.
status: 200
---

API Reference [Projects](https://docs.composio.dev/reference/api-reference/projects)

# Create a new projectv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`org`/`owner`/`project`/`new`

Send

Authorization

Body

Creates a new project within the authenticated user's organization using the specified name. Projects are isolated environments within your organization, each with their own API keys, webhook configurations, and resources. Use this endpoint to create additional projects for different environments (e.g., development, staging, production) or for separate applications.

## [Authorization](https://docs.composio.dev/reference/api-reference/projects/postOrgOwnerProjectNew\#authorization)

`OrgApiKeyAuth`

x-org-api-key<token>

Organization API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/api-reference/projects/postOrgOwnerProjectNew\#request-body)

`application/json`

namestringRequired

A unique name for your project that follows the required format rules

should\_create\_api\_keyboolean

Whether to create an API key for the project. If true, the API key will be created and returned in the response.

Default:`false`

configobject

Configuration for the project

Show 10 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/projects/postOrgOwnerProjectNew\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

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
curl -X POST "https://backend.composio.dev/api/v3.1/org/owner/project/new" \
  -H "x-org-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my_production_api"
  }'
```

200400401409500

```
{
  "id": "pr_1a2b3c4d5e6f",
  "name": "My Awesome Project",
  "api_key": "ak_a1b2c3d4e5f6g7h8i9j0"
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/projects/postOrgOwnerProjectNew.mdx)
