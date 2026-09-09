---
url: https://docs.composio.dev/reference/v3/api-reference/tools/getToolsByToolSlug
title: Get tool by slug | Composio
description: Retrieve detailed information about a specific tool using its slug identifier. This endpoint returns full metadata about a tool including input/output parameters, versions, and toolkit information.
status: 200
---

API Reference [Tools](https://docs.composio.dev/reference/v3/api-reference/tools)

# Get tool by slugv3.0

Copy page

Server URL`https://backend.composio.dev/`

GET

``/`api`/`v3`/`tools`/`{tool_slug}`

Send

Authorization

Path

Query

Retrieve detailed information about a specific tool using its slug identifier. This endpoint returns full metadata about a tool including input/output parameters, versions, and toolkit information.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/tools/getToolsByToolSlug\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/v3/api-reference/tools/getToolsByToolSlug\#parameters-path)

tool\_slugstringRequired

The unique slug identifier of the tool

## [Query Parameters](https://docs.composio.dev/reference/v3/api-reference/tools/getToolsByToolSlug\#parameters-query)

versionstring

Optional version of the tool to retrieve. Takes precedence over toolkit\_versions; when both are omitted the tool resolves to the pinned version ("00000000\_00").

toolkit\_versionsnull \| string \| object

Toolkit version specification. Use "latest" for latest versions or bracket notation for specific versions per toolkit. Read only when version is omitted; when neither is supplied the tool resolves to the pinned version ("00000000\_00").

Show 3 child attributes

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/tools/getToolsByToolSlug\#response-body)

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
curl -X GET "https://backend.composio.dev/api/v3/tools/string?toolkit_versions=latest" \
  -H "x-api-key: "
```

200400401404500

```
{
  "slug": "GITHUB_CREATE_A_WORKFLOW_DISPATCH_EVENT",
  "name": "GitHub Actions",
  "description": "Automate GitHub workflows including CI/CD, issue management, and release processes",
  "toolkit": {
    "slug": "github",
    "name": "GitHub",
    "logo": "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
  },
  "input_parameters": {
    "repo_name": {
      "type": "string",
      "description": "GitHub repository name in owner/repo format",
      "required": true,
      "examples": [\
        "octocat/Hello-World"\
      ]
    },
    "workflow_id": {
      "type": "string",
      "description": "ID or filename of the workflow to trigger",
      "required": true,
      "examples": [\
        "main.yml"\
      ]
    }
  },
  "no_auth": false,
  "available_versions": [\
    "20250905_00",\
    "20250906_00"\
  ],
  "version": "20250905_00",
  "output_parameters": {
    "run_id": {
      "type": "number",
      "description": "ID of the workflow run that was triggered",
      "examples": [\
        12345678\
      ]
    },
    "status": {
      "type": "string",
      "description": "Status of the workflow run",
      "enum": [\
        "queued",\
        "in_progress",\
        "completed",\
        "failed"\
      ],
      "examples": [\
        "completed"\
      ]
    }
  },
  "scopes": [\
    "https://www.googleapis.com/auth/gmail.modify"\
  ],
  "scope_requirements": {
    "all_of": [\
      "read:user",\
      {\
        "any_of": [\
          "repo",\
          "public_repo"\
        ]\
      }\
    ]
  },
  "tags": [\
    "ci-cd",\
    "github",\
    "automation",\
    "devops"\
  ],
  "human_description": "Create a new issue in a GitHub repository",
  "is_deprecated": false,
  "deprecated": {
    "displayName": "GitHub Actions",
    "version": "20250905_00",
    "available_versions": [\
      "20250905_00",\
      "20250906_00"\
    ],
    "is_deprecated": false,
    "toolkit": {
      "logo": "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
    }
  }
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/tools/getToolsByToolSlug.mdx)
