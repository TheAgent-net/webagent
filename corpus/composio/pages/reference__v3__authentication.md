---
url: https://docs.composio.dev/reference/v3/authentication
title: Authentication | Composio
description: How to authenticate with Composio APIs using project and organization API keys
status: 200
---

# Authentication

Copy page

Every Composio API request authenticates with an API key. Send the key in a request header and Composio resolves it to your project or organization.

## [Project API key](https://docs.composio.dev/reference/v3/authentication\#project-api-key)

A project API key authenticates to one project with full access. Send it in the `x-api-key` header.

Get it from the dashboard: sign in to [composio.dev](https://composio.dev/), open **Settings → Project Settings**, and copy the key from the **API Keys** section.

## [Organization API key](https://docs.composio.dev/reference/v3/authentication\#organization-api-key)

An organization API key authenticates across every project in your organization. Send it in the `x-org-api-key` header.

Get it from the dashboard: open **Organization Settings → General Settings** and copy a token under **Organization Access Tokens**.

## [Using the API key](https://docs.composio.dev/reference/v3/authentication\#using-the-api-key)

Include your API key in the request header:

```
curl https://backend.composio.dev/api/v3/tools \
  -H "x-api-key: $COMPOSIO_API_KEY"
```

For organization-level endpoints:

```
curl https://backend.composio.dev/api/v3/org/projects \
  -H "x-org-api-key: $COMPOSIO_ORG_API_KEY"
```

[**Errors** \\
\\
Understanding API error responses](https://docs.composio.dev/reference/v3/errors) [**Rate Limits** \\
\\
API rate limits by plan](https://docs.composio.dev/reference/v3/rate-limits)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/authentication.mdx)

### On this page

[Project API key](https://docs.composio.dev/reference/v3/authentication#project-api-key) [Organization API key](https://docs.composio.dev/reference/v3/authentication#organization-api-key) [Using the API key](https://docs.composio.dev/reference/v3/authentication#using-the-api-key)
