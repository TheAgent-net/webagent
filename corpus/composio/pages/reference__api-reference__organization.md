---
url: https://docs.composio.dev/reference/api-reference/organization
title: Organization | Composio
description: Organization management
status: 200
---

API Reference

# Organization

Copy page

The Usage API returns **aggregated counts** of tool calls and sessions. Use it to power billing dashboards, customer-facing analytics, or internal utilization reports. For individual events, use the [Logs API](https://docs.composio.dev/reference/api-reference/logs).

There are two query shapes:

- **Summary**: totals across one or more entity types in a time window.
- **Breakdown**: one entity type, grouped by a dimension (tool, user, session, etc.).

Each shape comes in an org-scoped and a project-scoped flavor. The org-scoped endpoints are documented below; the project-scoped usage endpoints (`POST /api/v3.1/project/usage/*`) also appear on the [Projects](https://docs.composio.dev/reference/api-reference/projects) reference page.

## [Authentication](https://docs.composio.dev/reference/api-reference/organization\#authentication)

| Endpoint | Header | Scope |
| --- | --- | --- |
| `POST /api/v3.1/org/usage/summary` | `x-org-api-key` _(or org JWT)_ | All projects in your org |
| `POST /api/v3.1/org/usage/{entity_type}` | `x-org-api-key` _(or org JWT)_ | All projects in your org |
| `POST /api/v3.1/project/usage/summary` | `x-api-key` _(or cookie)_ | Single project |
| `POST /api/v3.1/project/usage/{entity_type}` | `x-api-key` _(or cookie)_ | Single project |

The org endpoints accept a `project_id` filter so you can slice by project without rotating keys.

## [Entity types](https://docs.composio.dev/reference/api-reference/organization\#entity-types)

| Entity type | What it counts |
| --- | --- |
| `tool_calls` | Every tool execution (successful or failed) |
| `sessions` | Sessions created |

## [Summary](https://docs.composio.dev/reference/api-reference/organization\#summary)

Totals across entity types for a time window.

```
curl -X POST https://backend.composio.dev/api/v3.1/project/usage/summary \
  -H "x-api-key: YOUR_PROJECT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": 1744848000000,
    "to": 1744934400000,
    "entity_types": ["tool_calls", "sessions"]
  }'
```

Response:

```
{
  "entities": {
    "tool_calls": { "unit": "count", "total_quantity": "142", "event_count": 142 },
    "sessions":  { "unit": "count", "total_quantity": "8",   "event_count": 8 }
  }
}
```

### [Summary parameters](https://docs.composio.dev/reference/api-reference/organization\#summary-parameters)

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `from` | number | 30 days ago | Epoch milliseconds |
| `to` | number | now | Epoch milliseconds |
| `entity_types` | string\[\] | all | Subset of `tool_calls`, `sessions` |
| `filters.user_id` | string \| string\[\] | — | Filter events by initiating user |
| `filters.session_id` | string \| string\[\] | — | Filter events by session |
| `filters.project_id` | string \| string\[\] | — | Only meaningful on org endpoints; ignored on project endpoints |

## [Breakdown](https://docs.composio.dev/reference/api-reference/organization\#breakdown)

One entity type, grouped by a dimension. Useful for answering "top N" questions.

```
curl -X POST https://backend.composio.dev/api/v3.1/project/usage/tool_calls \
  -H "x-api-key: YOUR_PROJECT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": 1744848000000,
    "to": 1744934400000,
    "group_by": "toolkit_slug",
    "order_by": "total_quantity",
    "order_direction": "desc",
    "limit": 10
  }'
```

Response:

```
{
  "entity_type": "tool_calls",
  "unit": "count",
  "total_quantity": "142",
  "event_count": 142,
  "groups": [\
    { "key": "github", "total_quantity": "80", "event_count": 80 },\
    { "key": "slack",  "total_quantity": "62", "event_count": 62 }\
  ]
}
```

### [Breakdown `group_by` options](https://docs.composio.dev/reference/api-reference/organization\#breakdown-group_by-options)

| Entity | Org scope | Project scope | Default |
| --- | --- | --- | --- |
| `tool_calls` | `tool_slug`, `toolkit_slug`, `connected_account_id`, `user_id`, `session_id`, `project_id` | same minus `project_id` | `tool_slug` |
| `sessions` | `user_id`, `project_id` | `user_id` | `user_id` |

### [Breakdown parameters](https://docs.composio.dev/reference/api-reference/organization\#breakdown-parameters)

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `from` | number | 30 days ago | Epoch ms |
| `to` | number | now | Epoch ms |
| `group_by` | string | see table | Dimension to group by |
| `order_by` | string | `total_quantity` | One of `key`, `total_quantity`, `event_count` |
| `order_direction` | `"asc"` \| `"desc"` | `"desc"` |  |
| `limit` | number | 50 | Max groups returned |
| `filters` | object | — | See Filters below |

## [Filters](https://docs.composio.dev/reference/api-reference/organization\#filters)

Filters live in a `filters` object on the request body. Each filter value can be a **single string** or an **array of strings**:

- Within a single field, values are OR-combined (`user_id: ["a", "b"]` matches events for user _a or b_).
- Across fields, filters are AND-combined.

```
{
  "filters": {
    "user_id": ["user_123", "user_456"],
    "session_id": "sess_abc"
  }
}
```

The `project_id` filter is only meaningful on the org-scoped endpoints. Project endpoints accept the field but ignore it (your key already pins the scope to a single project).

## [Time ranges](https://docs.composio.dev/reference/api-reference/organization\#time-ranges)

- `from` and `to` are **epoch milliseconds**.
- `from` defaults to 30 days before `to`.
- `to` defaults to the current time.
- Maximum range: **366 days**. Longer ranges return a 400.

## [Recipes](https://docs.composio.dev/reference/api-reference/organization\#recipes)

### [Top 10 tools my org called last week](https://docs.composio.dev/reference/api-reference/organization\#top-10-tools-my-org-called-last-week)

```
WEEK_AGO=$(( $(date +%s) - 604800 ))000
NOW=$(date +%s)000
curl -X POST https://backend.composio.dev/api/v3.1/org/usage/tool_calls \
  -H "x-org-api-key: YOUR_ORG_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"from\": ${WEEK_AGO},
    \"to\": ${NOW},
    \"group_by\": \"tool_slug\",
    \"limit\": 10
  }"
```

### [Tool call count per user for my project this month](https://docs.composio.dev/reference/api-reference/organization\#tool-call-count-per-user-for-my-project-this-month)

```
MONTH_AGO=$(( $(date +%s) - 2592000 ))000
NOW=$(date +%s)000
curl -X POST https://backend.composio.dev/api/v3.1/project/usage/tool_calls \
  -H "x-api-key: YOUR_PROJECT_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"from\": ${MONTH_AGO},
    \"to\": ${NOW},
    \"group_by\": \"user_id\",
    \"limit\": 50
  }"
```

### [Which toolkits is a specific user using?](https://docs.composio.dev/reference/api-reference/organization\#which-toolkits-is-a-specific-user-using)

```
curl -X POST https://backend.composio.dev/api/v3.1/project/usage/tool_calls \
  -H "x-api-key: YOUR_PROJECT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "group_by": "toolkit_slug",
    "filters": { "user_id": "user_abc123" }
  }'
```

## [Endpoints](https://docs.composio.dev/reference/api-reference/organization\#endpoints)

| Endpoint | Quick Link |
| --- | --- |
| `POST /api/v3.1/org/usage/summary` | [Org usage summary](https://docs.composio.dev/reference/api-reference/organization/postOrgUsageSummary) |
| `POST /api/v3.1/org/usage/{entity_type}` | [Org usage breakdown](https://docs.composio.dev/reference/api-reference/organization/postOrgUsageByEntityType) |

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/organization/index.mdx)

### On this page

[Authentication](https://docs.composio.dev/reference/api-reference/organization#authentication) [Entity types](https://docs.composio.dev/reference/api-reference/organization#entity-types) [Summary](https://docs.composio.dev/reference/api-reference/organization#summary) [Summary parameters](https://docs.composio.dev/reference/api-reference/organization#summary-parameters) [Breakdown](https://docs.composio.dev/reference/api-reference/organization#breakdown) [Breakdown `group_by` options](https://docs.composio.dev/reference/api-reference/organization#breakdown-group_by-options) [Breakdown parameters](https://docs.composio.dev/reference/api-reference/organization#breakdown-parameters) [Filters](https://docs.composio.dev/reference/api-reference/organization#filters) [Time ranges](https://docs.composio.dev/reference/api-reference/organization#time-ranges) [Recipes](https://docs.composio.dev/reference/api-reference/organization#recipes) [Top 10 tools my org called last week](https://docs.composio.dev/reference/api-reference/organization#top-10-tools-my-org-called-last-week) [Tool call count per user for my project this month](https://docs.composio.dev/reference/api-reference/organization#tool-call-count-per-user-for-my-project-this-month) [Which toolkits is a specific user using?](https://docs.composio.dev/reference/api-reference/organization#which-toolkits-is-a-specific-user-using) [Endpoints](https://docs.composio.dev/reference/api-reference/organization#endpoints)
