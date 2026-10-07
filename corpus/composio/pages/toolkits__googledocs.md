---
url: https://docs.composio.dev/toolkits/googledocs
title: Google Docs
description: 
status: 200
---

# Google Docs

Google Docs is a cloud-based word processor with real-time collaboration, version history, and integration with other Google Workspace apps

- **Category:** documents
- **Auth:** OAUTH2
- **Composio-managed OAuth available?** Yes
- **Tools:** 43
- **Triggers:** 10
- **Slug:** `GOOGLEDOCS`
- **Version:** 20260826_00

## Frequently Asked Questions

### How do I set up custom Google OAuth credentials for Google Docs?

For a step-by-step guide on creating and configuring your own Google OAuth credentials with Composio, see [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

### Why am I seeing "App is blocked" when connecting Google Docs?

The OAuth client is requesting scopes that Google hasn't verified for that client. This usually happens when you add extra scopes beyond the defaults.

Remove the additional scopes from your auth config, or create your own OAuth app and submit the scopes for verification. See [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

### Why am I getting "Google Docs API has not been used in project" error?

When using custom OAuth credentials, the Google Docs API must be enabled in the Google Cloud project that owns those credentials. Enable it in Google Cloud Console under APIs & Services, wait a few minutes, and retry.

### Why am I getting "Error 400: invalid_scope"?

The requested scopes are invalid or incorrectly formatted in the authorization URL. Verify your scope values against the [Google OAuth scopes docs](https://developers.google.com/identity/protocols/oauth2). If you're creating auth configs programmatically, see the [programmatic auth config guide](/docs/authentication/programmatic-auth-configs).

### Why does the OAuth consent screen show "Composio" instead of my app?

By default, the consent screen uses Composio's OAuth app. To show your own app name and logo, create your own OAuth app and set a custom redirect URL. See [White-labeling authentication](/docs/authentication/white-labeling-authentication#using-your-own-oauth-apps).

### Why am I getting 401 errors on tool calls?

The user's access token is no longer valid. Common causes: the user revoked access, changed their password or 2FA, a Workspace admin policy changed, or Google's refresh token limit was exceeded. Re-authenticating the user typically resolves this.

### Why am I getting "Quota Exhausted" or "rate limit exhausted"?

Google enforces per-minute and daily request quotas. If you're using Composio's default OAuth app, you share that quota with other users, which can cause limits to be hit faster. Use your own OAuth app credentials to get a dedicated quota, and add exponential backoff and retries to handle transient rate limits.

## Tools

- `GOOGLEDOCS_COPY_DOCUMENT`
- `GOOGLEDOCS_CREATE_AND_POPULATE_TABLE`
- `GOOGLEDOCS_CREATE_DOCUMENT`
- `GOOGLEDOCS_CREATE_DOCUMENT2`
- `GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN`
- `GOOGLEDOCS_CREATE_FOOTER`
- `GOOGLEDOCS_CREATE_FOOTNOTE`
- `GOOGLEDOCS_CREATE_HEADER`
- `GOOGLEDOCS_CREATE_NAMED_RANGE`
- `GOOGLEDOCS_CREATE_PARAGRAPH_BULLETS`
- `GOOGLEDOCS_CREATE_TAB`
- `GOOGLEDOCS_DELETE_CONTENT_RANGE`
- `GOOGLEDOCS_DELETE_FOOTER`
- `GOOGLEDOCS_DELETE_HEADER`
- `GOOGLEDOCS_DELETE_NAMED_RANGE`
- `GOOGLEDOCS_DELETE_PARAGRAPH_BULLETS`
- `GOOGLEDOCS_DELETE_TAB`
- `GOOGLEDOCS_DELETE_TABLE_COLUMN`
- `GOOGLEDOCS_DELETE_TABLE_ROW`
- `GOOGLEDOCS_EXPORT_DOCUMENT_AS_PDF`
- `GOOGLEDOCS_GET_DOCUMENT_BY_ID`
- `GOOGLEDOCS_GET_DOCUMENT_END_INDEX`
- `GOOGLEDOCS_GET_DOCUMENT_PLAINTEXT`
- `GOOGLEDOCS_INSERT_IMAGE_IN_TABLE_CELL`
- `GOOGLEDOCS_INSERT_INLINE_IMAGE`
- `GOOGLEDOCS_INSERT_PAGE_BREAK`
- `GOOGLEDOCS_INSERT_TABLE_ACTION`
- `GOOGLEDOCS_INSERT_TABLE_COLUMN`
- `GOOGLEDOCS_INSERT_TABLE_ROW`
- `GOOGLEDOCS_INSERT_TEXT_ACTION`
- `GOOGLEDOCS_INSERT_TEXT_IN_TABLE_CELL`
- `GOOGLEDOCS_LIST_SPREADSHEET_CHARTS`
- `GOOGLEDOCS_REPLACE_ALL_TEXT`
- `GOOGLEDOCS_REPLACE_IMAGE`
- `GOOGLEDOCS_SEARCH_DOCUMENTS`
- `GOOGLEDOCS_UNMERGE_TABLE_CELLS`
- `GOOGLEDOCS_UPDATE_DOCUMENT_BATCH`
- `GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN`
- `GOOGLEDOCS_UPDATE_DOCUMENT_SECTION_MARKDOWN`
- `GOOGLEDOCS_UPDATE_DOCUMENT_STYLE`
- `GOOGLEDOCS_UPDATE_EXISTING_DOCUMENT`
- `GOOGLEDOCS_UPDATE_TABLE_ROW_STYLE`
- `GOOGLEDOCS_UPDATE_TAB_PROPERTIES`
- `GOOGLEDOCS_DOCUMENT_CREATED_TRIGGER`
- `GOOGLEDOCS_DOCUMENT_DELETED_TRIGGER`
- `GOOGLEDOCS_DOCUMENT_PLACEHOLDER_FILLED_TRIGGER`
- `GOOGLEDOCS_DOCUMENT_SEARCH_UPDATE_TRIGGER`
- `GOOGLEDOCS_DOCUMENT_STRUCTURE_CHANGED_TRIGGER`
- `GOOGLEDOCS_DOCUMENT_UPDATED_TRIGGER`
- `GOOGLEDOCS_DOCUMENT_WORD_COUNT_THRESHOLD_TRIGGER`
- `GOOGLEDOCS_FOLDER_CREATED_TRIGGER`
- `GOOGLEDOCS_KEYWORD_DETECTED_TRIGGER`
- `GOOGLEDOCS_PAGE_ADDED_TRIGGER`
