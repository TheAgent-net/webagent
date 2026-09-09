---
url: https://docs.composio.dev/reference/v3/api-reference/tools/postToolsExecuteByToolSlugInput
title: Generate tool inputs from natural language | Composio
description: Uses AI to translate a natural language description into structured arguments for a specific tool. This endpoint is useful when you want to let users describe what they want to do in plain language instead of providing structured parameters.
status: 200
---

API Reference [Tools](https://docs.composio.dev/reference/v3/api-reference/tools)

# Generate tool inputs from natural languagev3.0

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3`/`tools`/`execute`/`{tool_slug}`/`input`

Send

Authorization

Path

Body

Uses AI to translate a natural language description into structured arguments for a specific tool. This endpoint is useful when you want to let users describe what they want to do in plain language instead of providing structured parameters.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/tools/postToolsExecuteByToolSlugInput\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/v3/api-reference/tools/postToolsExecuteByToolSlugInput\#parameters-path)

tool\_slugstringRequired

The tool slug to generate inputs for

## [Request Body](https://docs.composio.dev/reference/v3/api-reference/tools/postToolsExecuteByToolSlugInput\#request-body)

`application/json`

textstringRequired

Natural language description of what you want to accomplish with this tool

custom\_descriptionstring

Custom description of the tool to help guide the LLM in generating more accurate inputs

system\_promptstring

System prompt to control and guide the behavior of the LLM when generating inputs

versionstring

Tool version to use when generating inputs. Defaults to the pinned version ("00000000\_00") when omitted.

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/tools/postToolsExecuteByToolSlugInput\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 404  `application/json`

### 422  `application/json`

### 429  `application/json`

### 500  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X POST "https://backend.composio.dev/api/v3/tools/execute/string/input" \  -H "x-api-key: " \  -H "Content-Type: application/json" \  -d '{    "text": "I need to trigger the main workflow in the octocat/Hello-World repository to deploy to production"  }'
```

200400401404422429500

```
{  "arguments": {    "repository": "octocat/Hello-World",    "workflow_id": "main.yml",    "ref": "main",    "inputs": {      "environment": "production"    }  },  "error": "Unable to determine the repository name from the provided description"}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/tools/postToolsExecuteByToolSlugInput.mdx)
