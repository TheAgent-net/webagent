---
url: https://docs.composio.dev/reference/v3/api-reference/tools/postToolsExecuteByToolSlug
title: Execute tool | Composio
description: Execute a specific tool operation with provided arguments and authentication. This is the primary endpoint for integrating with third-party services and executing tools. You can provide structured arguments or use natural language processing by providing a text description of what you want to accomplish.
status: 200
---

API Reference [Tools](https://docs.composio.dev/reference/v3/api-reference/tools)

# Execute toolv3.0

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3`/`tools`/`execute`/`{tool_slug}`

Send

Authorization

Path

Header

Body

Execute a specific tool operation with provided arguments and authentication. This is the primary endpoint for integrating with third-party services and executing tools. You can provide structured arguments or use natural language processing by providing a text description of what you want to accomplish.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/tools/postToolsExecuteByToolSlug\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/v3/api-reference/tools/postToolsExecuteByToolSlug\#parameters-path)

tool\_slugstringRequired

The tool slug to execute

## [Header Parameters](https://docs.composio.dev/reference/v3/api-reference/tools/postToolsExecuteByToolSlug\#parameters-header)

x-llm-gateway-headersstring

JSON object containing custom headers to pass to LLM providers (OpenAI, Bedrock, etc.)

## [Request Body](https://docs.composio.dev/reference/v3/api-reference/tools/postToolsExecuteByToolSlug\#request-body)

`application/json`

connected\_account\_idstring

Unique identifier for the connected account to use for authentication

entity\_idstringDeprecated

Deprecated: please use user\_id instead. Entity identifier for multi-entity connected accounts (e.g. multiple repositories, organizations)

user\_idstring

User id for multi-user connected accounts (e.g. multiple users, organizations)

versionstring

Tool version to execute. Defaults to the pinned version ("00000000\_00") when omitted.

custom\_auth\_paramsobject

Custom authentication parameters for tools that support parameterized authentication

Show 3 child attributes

custom\_connection\_dataobject

Custom connection data for tools that support custom connection data

Show 3 child attributes

argumentsobject

Key-value pairs of arguments required by the tool (mutually exclusive with text)

Show 1 child attributes

textstring

Natural language description of the task to perform (mutually exclusive with arguments)

allow\_tracingnullable booleanDeprecated

Deprecated. Enable debug tracing for tool execution (useful for debugging)

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/tools/postToolsExecuteByToolSlug\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

### 408  `application/json`

### 410  `application/json`

### 413  `application/json`

### 422  `application/json`

### 429  `application/json`

### 500  `application/json`

### 501  `application/json`

### 502  `application/json`

### 503  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X POST "https://backend.composio.dev/api/v3/tools/execute/string" \  -H "x-api-key: " \  -H "Content-Type: application/json" \  -d '{}'
```

200400401403404408410413422429500501502503

```
{  "data": {    "run_id": 12345678,    "status": "queued",    "created_at": "2023-01-01T12:00:00Z",    "html_url": "https://github.com/octocat/Hello-World/actions/runs/12345678"  },  "error": "string",  "successful": true,  "session_info": {    "session_id": "session-12345",    "expires_at": "2023-01-01T13:00:00Z"  },  "log_id": "log_1a2b3c4d5e6f"}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/tools/postToolsExecuteByToolSlug.mdx)
