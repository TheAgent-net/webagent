---
url: https://docs.composio.dev/reference/api-reference/logs/postLogsToolExecution
title: Search and retrieve tool execution logs | Composio
description: Search and retrieve tool execution logs with filtering, pagination, and time range support.
status: 200
---

API Reference [Logs](https://docs.composio.dev/reference/api-reference/logs)

# Search and retrieve tool execution logsv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`logs`/`tool_execution`

Send

Authorization

Body

Search and retrieve tool execution logs with filtering, pagination, and time range support.

## [Authorization](https://docs.composio.dev/reference/api-reference/logs/postLogsToolExecution\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/api-reference/logs/postLogsToolExecution\#request-body)

`application/json`

limitnumber

Default:`20`

cursornullable string

filtersarray of object

Show item properties

time\_rangeobject

Show 2 child attributes

## [Response Body](https://docs.composio.dev/reference/api-reference/logs/postLogsToolExecution\#response-body)

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
curl -X POST "https://backend.composio.dev/api/v3.1/logs/tool_execution" \  -H "x-api-key: " \  -H "Content-Type: application/json" \  -d '{}'
```

200400401500

```
{  "logs": [    {      "id": "string",      "timestamp": "2019-08-24T14:15:22Z",      "type": "string",      "status": "success",      "level": "info",      "message": "string",      "metadata": {        "property1": null,        "property2": null      },      "metrics": {        "property1": null,        "property2": null      },      "parent": {        "log_id": "string",        "tool_slug": "string"      }    }  ],  "next_cursor": "string"}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/logs/postLogsToolExecution.mdx)
