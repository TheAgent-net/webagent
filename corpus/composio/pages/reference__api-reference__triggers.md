---
url: https://docs.composio.dev/reference/api-reference/triggers
title: Triggers | Composio
description: Trigger management and execution
status: 200
---

API Reference

# Triggers

Copy page

Triggers let you subscribe to events from a user's connected app, such as a new Gmail message, a GitHub commit, or a Slack message, and receive the event data as a structured payload at your webhook endpoint.

There are two layers to understand:

- A **trigger type** is a template that defines what event to listen for and what configuration it needs. For example, `GITHUB_COMMIT_EVENT` requires an `owner` and a `repo`. Each toolkit exposes its own trigger types.
- A **trigger instance** is a trigger type scoped to a specific user and connected account. Creating one produces an instance with its own `ti_*` ID that you can enable, disable, or delete independently.

Reach for these endpoints when you want to:

- Discover the trigger types a toolkit offers, or fetch one type by `slug` to inspect its config and payload schema.
- Create or update a trigger instance for a connected account with the upsert endpoint.
- List active trigger instances, or enable, disable, and delete an instance by `triggerId`.

These endpoints authenticate with your project API key in the `x-api-key` header.

Creating a trigger instance only registers it. To actually receive events, set a webhook URL for your project once, then route incoming events on `metadata.trigger_slug`. See [Subscribing to events](https://docs.composio.dev/docs/setting-up-triggers/subscribing-to-events).

For the full concept overview, see [Triggers](https://docs.composio.dev/docs/triggers).

## [Endpoints](https://docs.composio.dev/reference/api-reference/triggers\#endpoints)

| Endpoint | Quick Link |
| --- | --- |
| `POST /api/v3.1/trigger_instances/{slug}/upsert` | [Create or update a trigger](https://docs.composio.dev/reference/api-reference/triggers/postTriggerInstancesBySlugUpsert) |
| `GET /api/v3.1/trigger_instances/active` | [List active triggers](https://docs.composio.dev/reference/api-reference/triggers/getTriggerInstancesActive) |
| `DELETE /api/v3.1/trigger_instances/manage/{triggerId}` | [Delete a trigger](https://docs.composio.dev/reference/api-reference/triggers/deleteTriggerInstancesManageByTriggerId) |
| `PATCH /api/v3.1/trigger_instances/manage/{triggerId}` | [Enable or disable a trigger](https://docs.composio.dev/reference/api-reference/triggers/patchTriggerInstancesManageByTriggerId) |
| `GET /api/v3.1/triggers_types/list/enum` | [List trigger type enums](https://docs.composio.dev/reference/api-reference/triggers/getTriggersTypesListEnum) |
| `GET /api/v3.1/triggers_types/{slug}` | [Get trigger type by slug](https://docs.composio.dev/reference/api-reference/triggers/getTriggersTypesBySlug) |
| `GET /api/v3.1/triggers_types` | [List trigger types](https://docs.composio.dev/reference/api-reference/triggers/getTriggersTypes) |

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/triggers/index.mdx)

### On this page

[Endpoints](https://docs.composio.dev/reference/api-reference/triggers#endpoints)
