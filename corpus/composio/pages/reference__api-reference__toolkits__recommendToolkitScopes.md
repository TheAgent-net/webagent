---
url: https://docs.composio.dev/reference/api-reference/toolkits/recommendToolkitScopes
title: Get required scopes | Composio
description: Experimental: this endpoint is in beta and its contract may change.  Recommends the required scopes to use the given set of tools.
status: 200
---

API Reference [Toolkits](https://docs.composio.dev/reference/api-reference/toolkits)

# Get required scopesv3.1

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3.1`/`toolkits`/`{toolkit_slug}`/`scopes`/`recommended`

Send

Authorization

Path

Body

Experimental: this endpoint is in beta and its contract may change.

Recommends the required scopes to use the given set of tools.

## [Authorization](https://docs.composio.dev/reference/api-reference/toolkits/recommendToolkitScopes\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Path Parameters](https://docs.composio.dev/reference/api-reference/toolkits/recommendToolkitScopes\#parameters-path)

toolkit\_slugstringRequired

Toolkit to recommend scopes for.

## [Request Body](https://docs.composio.dev/reference/api-reference/toolkits/recommendToolkitScopes\#request-body)

`application/json`

toolsarray of stringRequired

Tool slugs to recommend scopes for; an empty list computes the recommendation across all of the toolkit’s tools.

auth\_schemeenum

Auth scheme the connection will use. Defaults to OAUTH2.

Default:`"OAUTH2"`

Possible values:

`OAUTH2``OAUTH1``API_KEY``BASIC``BILLCOM_AUTH``BEARER_TOKEN``GOOGLE_SERVICE_ACCOUNT``NO_AUTH``BASIC_WITH_JWT``CALCOM_AUTH``SERVICE_ACCOUNT``SAML``DCR_OAUTH``CIMD_OAUTH``S2S_OAUTH2`

toolkit\_versionstring

Toolkit version to compute from; defaults to the latest published version. Pass a concrete version to pin.

Default:`"latest"`

grant\_contextobject

Optional context about your OAuth app or the account being connected that can change which scopes are required, e.g. {"account\_type": "Google Workspace"}. Get accepted keys and values from the List grant\_context options endpoint.

Show 1 child attributes

includearray of string

Scopes the recommendation must include, irrespective of usage.

excludearray of string

Scopes the recommendation must not include; the solver picks documented alternatives and fails when none exist.

## [Response Body](https://docs.composio.dev/reference/api-reference/toolkits/recommendToolkitScopes\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 404  `application/json`

### 422  `application/json`

### 500  `application/json`

### 501  `application/json`

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X POST "https://backend.composio.dev/api/v3.1/toolkits/string/scopes/recommended" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "tools": [\
      "string"\
    ]
  }'
```

200400401404422500501

```
{
  "auth_scheme": "string",
  "toolkit_version": "string",
  "grant_context": {
    "property1": "string",
    "property2": "string"
  },
  "scopes": {
    "least_privilege": [\
      "string"\
    ],
    "fewest": [\
      "string"\
    ],
    "conditional": [\
      {\
        "scope": "string",\
        "when": {\
          "property1": [\
            "string"\
          ],\
          "property2": [\
            "string"\
          ]\
        },\
        "for": [\
          "string"\
        ]\
      }\
    ]
  }
}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/toolkits/recommendToolkitScopes.mdx)
