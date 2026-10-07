---
url: https://docs.composio.dev/reference/api-reference/toolkits
title: Toolkits | Composio
description: Toolkit and tool management
status: 200
---

API Reference

# Toolkits

Copy page

A toolkit is a collection of related tools for a single app, like `gmail`, `github`, or `slack`. Each toolkit groups the actions for that service, its authentication requirements, and the trigger types it exposes.

Reach for these endpoints when you want to:

- List the toolkits in the catalog, sorted by popularity, to browse what is available before configuring a session.
- Fetch a single toolkit by `slug` for its name, logo, categories, and metadata.
- Fetch several toolkits at once with the multi endpoint.
- List the available toolkit categories to filter the catalog by use case.
- Read the toolkits changelog to track when tools or schemas change.

These endpoints authenticate with your project API key in the `x-api-key` header.

Tools within a toolkit are versioned. When you execute a tool, resolve to a known version with `toolkit_versions=latest` or a pinned dated version. See the [toolkit versioning migration guide](https://docs.composio.dev/docs/migration-guide/toolkit-versioning).

To browse toolkits visually, see the [toolkits catalog](https://docs.composio.dev/toolkits). For the concepts and SDK usage, see [Tools and toolkits](https://docs.composio.dev/docs/how-composio-works) and [Configuring sessions](https://docs.composio.dev/docs/configuring-sessions).

## [Endpoints](https://docs.composio.dev/reference/api-reference/toolkits\#endpoints)

| Endpoint | Quick Link |
| --- | --- |
| `DELETE /api/v3.1/custom/toolkits/{slug}` | [Delete a custom toolkit](https://docs.composio.dev/reference/api-reference/toolkits/deleteCustomToolkitsBySlug) |
| `POST /api/v3.1/toolkits/{toolkit_slug}/scopes/recommended` | [Get required scopes](https://docs.composio.dev/reference/api-reference/toolkits/recommendToolkitScopes) |
| `GET /api/v3.1/toolkits/{toolkit_slug}/scopes/grant_context` | [List grant\_context options](https://docs.composio.dev/reference/api-reference/toolkits/recommendToolkitScopesGrantContext) |
| `GET /api/v3.1/toolkits` | [List available toolkits](https://docs.composio.dev/reference/api-reference/toolkits/getToolkits) |
| `GET /api/v3.1/toolkits/categories` | [List toolkit categories](https://docs.composio.dev/reference/api-reference/toolkits/getToolkitsCategories) |
| `POST /api/v3.1/custom/toolkits/upsert` | [Upsert a custom toolkit](https://docs.composio.dev/reference/api-reference/toolkits/postCustomToolkitsUpsert) |
| `POST /api/v3.1/custom/toolkits/sync` | [Sync a custom toolkit](https://docs.composio.dev/reference/api-reference/toolkits/postCustomToolkitsSync) |
| `GET /api/v3.1/toolkits/{slug}` | [Get toolkit by slug](https://docs.composio.dev/reference/api-reference/toolkits/getToolkitsBySlug) |
| `POST /api/v3.1/toolkits/multi` | [Fetch multiple toolkits](https://docs.composio.dev/reference/api-reference/toolkits/postToolkitsMulti) |
| `GET /api/v3.1/toolkits/changelog` | [Get toolkits changelog](https://docs.composio.dev/reference/api-reference/toolkits/getToolkitsChangelog) |

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/toolkits/index.mdx)

### On this page

[Endpoints](https://docs.composio.dev/reference/api-reference/toolkits#endpoints)
