---
url: https://docs.composio.dev/reference/v3/api-reference/projects/getOrgProjectList
title: List all projects | Composio
description: Retrieves projects belonging to the authenticated organization by default, or all organizations the authenticated user belongs to when list_all_org_projects is true. Projects are returned in descending order of creation date (newest first). This endpoint is useful for displaying project selection in dashboards or for integrations that need to list all available projects.
status: 200
---

API Reference [Projects](https://docs.composio.dev/reference/v3/api-reference/projects)

# List all projectsv3.0

Copy page

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3`/`org`/`project`/`list`

Send

Authorization

Query

Retrieves projects belonging to the authenticated organization by default, or all organizations the authenticated user belongs to when list\_all\_org\_projects is true. Projects are returned in descending order of creation date (newest first). This endpoint is useful for displaying project selection in dashboards or for integrations that need to list all available projects.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/projects/getOrgProjectList\#authorization)

`UserApiKeyAuth`

x-user-api-key<token>

User API key authentication

In: `header`

## [Query Parameters](https://docs.composio.dev/reference/v3/api-reference/projects/getOrgProjectList\#parameters-query)

list\_all\_org\_projectsnullable boolean

List projects from all organizations the authenticated user belongs to

Default:`false`

limitinteger

Number of items per page, max allowed is 50

cursorstring

Cursor for pagination. The cursor is a base64 encoded string of the page and limit. The page is the page number and the limit is the number of items per page. The cursor is used to paginate through the items. The cursor is not required for the first page.

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/projects/getOrgProjectList\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 500  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X GET "https://backend.composio.dev/api/v3/org/project/list" \
  -H "x-user-api-key: "
```

200400401500

```
{
  "data": [\
    {\
      "id": "pr_1a2b3c4d5e6f",\
      "org_id": "ok_1a2b3c4d5e6f",\
      "name": "My Awesome Project",\
      "email": "project-123@composio.dev",\
      "created_at": "2023-05-16T14:30:00.000Z",\
      "updated_at": "2023-05-18T09:15:30.000Z",\
      "webhook_url": "https://example.com/webhook",\
      "event_webhook_url": "https://example.com/events",\
      "webhook_secret": "whsec_abcdef123456789",\
      "triggers_enabled": true,\
      "last_subscribed_at": "2023-05-17T10:00:00.000Z",\
      "is_new_webhook": true,\
      "webhook_version": "V2",\
      "deleted": false\
    }\
  ],
  "next_cursor": "string",
  "total_pages": 0,
  "current_page": 0,
  "total_items": 0
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/projects/getOrgProjectList.mdx)
