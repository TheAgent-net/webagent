---
url: https://docs.composio.dev/toolkits/notion
title: Notion
description: 
status: 200
---

# Notion

Notion centralizes notes, docs, wikis, and tasks in a unified workspace, letting teams build custom workflows for collaboration and knowledge management

- **Category:** notes
- **Auth:** OAUTH2, API_KEY
- **Composio-managed OAuth available?** Yes
- **Tools:** 56
- **Triggers:** 8
- **Slug:** `NOTION`
- **Version:** 20260819_00

## Frequently Asked Questions

### Why do Notion operations show "Composio" instead of the user's name?

Notion attributes actions to the integration itself, not the individual user. The name and logo shown come from the integration configuration. To use a custom name or logo, create your own Notion integration. See [Notion integration docs](https://developers.notion.com/docs/create-a-notion-integration).

### How do I grant access to more Notion pages?

Open Notion, go to Settings & Members, then Connections. Select the integration (Composio or your custom integration), click "Select pages" or "Manage access", and add or remove pages as needed.

### Does Notion use OAuth scopes?

No. Notion controls access by granting integrations access to specific pages and databases, not through scopes. You don't need to pass scopes when creating an auth config.

### How does Notion's access model work?

It depends on the integration type. OAuth apps (public) let users select which pages to share during authorization. Internal integrations (API key) have page access managed in the integration settings.

### Reasons for Notion Connection expiry

- **The user disconnects the integration from Notion.** Notion documents that OAuth-installed public connections appear under `Settings` -> `Connections` and can be disconnected from the workspace. If a user removes the Composio-managed or custom Notion app there, the existing token set should be treated as revoked, and the user should reconnect Notion. See Notion's official guide to [adding and managing workspace connections](https://www.notion.com/help/add-and-manage-connections-with-the-api).

- **The same Notion user connects again through the same Notion app.** When a Notion user connects to a Notion app, Notion issues a new `access_token` and `refresh_token` pair for that connection. If the same user connects to the same Notion app again, whether it is Composio-managed or custom, Notion can issue a new token pair and invalidate the older `refresh_token`. The older `access_token` may continue working for some time, but once it expires, the older connection can no longer refresh and should be treated as expired. To avoid this, keep one active Notion connection per real user for a given Notion app, reuse that existing connection in your product, and avoid asking users to reconnect repeatedly. For production Notion integrations, we strongly recommend using your own Notion app so your users' tokens are isolated to your product. Follow the [Notion OAuth setup guide](https://composio.dev/auth/notion).

### How do I set up the Notion webhook ingress endpoint?

With Composio-managed Notion credentials, the webhook ingress endpoint is already provisioned, so just create the trigger. If you bring your own Notion OAuth app, the verification flow runs in reverse from Slack's: Notion sends a verification token to the ingress endpoint, and you paste that token back into Notion to finalize.

1. **Create the endpoint.**

   ```bash
   curl -X POST "https://backend.composio.dev/api/v3.1/webhook_endpoints" \
     -H "x-api-key: <YOUR_COMPOSIO_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"toolkit_slug": "notion", "client_id": "<YOUR_NOTION_OAUTH_CLIENT_ID>"}'
   ```

   Save the returned `id` and `webhook_url`.

2. **Paste the `webhook_url` into Notion** under your integration's Webhook settings. Notion will POST a verification token to the URL.

3. **Read the token from Composio.**

   ```bash
   curl "https://backend.composio.dev/api/v3.1/webhook_endpoints/<ENDPOINT_ID>" \
     -H "x-api-key: <YOUR_COMPOSIO_API_KEY>"
   ```

   The token is in `data.webhook_signing_secret`.

4. **Paste the token back into Notion's verify field** to complete setup. Continue with [Creating triggers](https://docs.composio.dev/docs/setting-up-triggers/creating-triggers#create-the-trigger).

### Notion database trigger fires for new pages, not updates

In manual testing, the Notion trigger fired when pages were added to the watched database, but not for updates. Test by adding a new page to the target database.

## Tools

- `NOTION_ADD_MULTIPLE_PAGE_CONTENT`
- `NOTION_ADD_PAGE_CONTENT`
- `NOTION_APPEND_BLOCK_CHILDREN`
- `NOTION_APPEND_CODE_BLOCKS`
- `NOTION_APPEND_LAYOUT_BLOCKS`
- `NOTION_APPEND_MEDIA_BLOCKS`
- `NOTION_APPEND_TABLE_BLOCKS`
- `NOTION_APPEND_TASK_BLOCKS`
- `NOTION_APPEND_TEXT_BLOCKS`
- `NOTION_ARCHIVE_NOTION_PAGE`
- `NOTION_CREATE_COMMENT`
- `NOTION_CREATE_DATABASE`
- `NOTION_CREATE_FILE_UPLOAD`
- `NOTION_CREATE_NOTION_PAGE`
- `NOTION_CREATE_VIEW`
- `NOTION_CREATE_VIEW_QUERY`
- `NOTION_DELETE_BLOCK`
- `NOTION_FETCH_DATA`
- `NOTION_DELETE_VIEW`
- `NOTION_DELETE_VIEW_QUERY`
- `NOTION_DUPLICATE_PAGE`
- `NOTION_FETCH_ALL_BLOCK_CONTENTS`
- `NOTION_FETCH_BLOCK_CONTENTS`
- `NOTION_FETCH_BLOCK_METADATA`
- `NOTION_FETCH_COMMENTS`
- `NOTION_SEARCH_NOTION_PAGE`
- `NOTION_FETCH_DATABASE`
- `NOTION_FETCH_ROW`
- `NOTION_GET_ABOUT_ME`
- `NOTION_GET_ABOUT_USER`
- `NOTION_GET_PAGE_MARKDOWN`
- `NOTION_GET_PAGE_PROPERTY_ACTION`
- `NOTION_GET_VIEW_QUERY_RESULTS`
- `NOTION_INSERT_ROW_DATABASE`
- `NOTION_INSERT_ROW_FROM_NL`
- `NOTION_LIST_DATA_SOURCE_TEMPLATES`
- `NOTION_LIST_FILE_UPLOADS`
- `NOTION_LIST_USERS`
- `NOTION_LIST_VIEWS`
- `NOTION_MOVE_PAGE`
- `NOTION_QUERY_DATABASE`
- `NOTION_QUERY_DATABASE_WITH_FILTER`
- `NOTION_QUERY_DATA_SOURCE`
- `NOTION_REPLACE_PAGE_CONTENT`
- `NOTION_RETRIEVE_COMMENT`
- `NOTION_RETRIEVE_DATABASE_PROPERTY`
- `NOTION_RETRIEVE_FILE_UPLOAD`
- `NOTION_RETRIEVE_PAGE`
- `NOTION_RETRIEVE_VIEW`
- `NOTION_SEND_FILE_UPLOAD`
- `NOTION_UPDATE_BLOCK`
- `NOTION_UPDATE_PAGE`
- `NOTION_UPDATE_ROW_DATABASE`
- `NOTION_UPDATE_SCHEMA_DATABASE`
- `NOTION_UPDATE_VIEW`
- `NOTION_UPSERT_ROW_DATABASE`
- `NOTION_COMMENT_CREATED`
- `NOTION_DATABASE_CREATED`
- `NOTION_DATASOURCE_CREATED`
- `NOTION_DATASOURCE_SCHEMA_UPDATED`
- `NOTION_PAGE_CONTENT_UPDATED`
- `NOTION_PAGE_CREATED`
- `NOTION_PAGE_PROPERTIES_UPDATED`
- `NOTION_VIEW_CREATED`
