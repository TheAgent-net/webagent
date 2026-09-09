---
url: https://docs.composio.dev/toolkits/googlesheets
title: Google Sheets
description: 
status: 200
---

# Google Sheets

Google Sheets is a cloud-based spreadsheet tool enabling real-time collaboration, data analysis, and integration with other Google Workspace apps

- **Category:** spreadsheets
- **Auth:** OAUTH2
- **Composio-managed OAuth available?** Yes
- **Tools:** 53
- **Triggers:** 16
- **Slug:** `GOOGLESHEETS`
- **Version:** 20260902_00

## Frequently Asked Questions

### How do I set up custom Google OAuth credentials for Google Sheets?

For a step-by-step guide on creating and configuring your own Google OAuth credentials with Composio, see [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

### Why am I seeing "App is blocked" when connecting Google Sheets?

The OAuth client is requesting scopes that Google hasn't verified for that client. This usually happens when you add extra scopes beyond the defaults.

Remove the additional scopes from your auth config, or create your own OAuth app and submit the scopes for verification. See [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

### Why am I getting "Google Sheets API has not been used in project" error?

When using custom OAuth credentials, the Google Sheets API must be enabled in the Google Cloud project that owns those credentials. Enable it in Google Cloud Console under APIs & Services, wait a few minutes, and retry.

### Why am I getting "Error 400: invalid_scope"?

The requested scopes are invalid or incorrectly formatted in the authorization URL. Verify your scope values against the [Google OAuth scopes docs](https://developers.google.com/identity/protocols/oauth2). If you're creating auth configs programmatically, see the [programmatic auth config guide](/docs/authentication/programmatic-auth-configs).

### Why does the OAuth consent screen show "Composio" instead of my app?

By default, the consent screen uses Composio's OAuth app. To show your own app name and logo, create your own OAuth app and set a custom redirect URL. See [White-labeling authentication](/docs/authentication/white-labeling-authentication#using-your-own-oauth-apps).

### Why am I getting 401 errors on tool calls?

The user's access token is no longer valid. Common causes: the user revoked access, changed their password or 2FA, a Workspace admin policy changed, or Google's refresh token limit was exceeded. Re-authenticating the user typically resolves this.

### Why am I getting "Quota Exhausted" or "rate limit exhausted"?

Google enforces per-minute and daily request quotas. These errors may also appear as a 429. If you're using Composio's default OAuth app, you share that quota with other users, which can cause limits to be hit faster. Use your own OAuth app credentials to get a dedicated quota, and add exponential backoff and retries to handle transient rate limits.

## Tools

- `GOOGLESHEETS_ADD_SHEET`
- `GOOGLESHEETS_AGGREGATE_COLUMN_DATA`
- `GOOGLESHEETS_APPEND_DIMENSION`
- `GOOGLESHEETS_AUTO_RESIZE_DIMENSIONS`
- `GOOGLESHEETS_BATCH_CLEAR_VALUES_BY_DATA_FILTER`
- `GOOGLESHEETS_BATCH_GET`
- `GOOGLESHEETS_BATCH_UPDATE`
- `GOOGLESHEETS_BATCH_UPDATE_VALUES_BY_DATA_FILTER`
- `GOOGLESHEETS_CLEAR_BASIC_FILTER`
- `GOOGLESHEETS_CLEAR_VALUES`
- `GOOGLESHEETS_CREATE_CHART`
- `GOOGLESHEETS_CREATE_GOOGLE_SHEET1`
- `GOOGLESHEETS_CREATE_SPREADSHEET_COLUMN`
- `GOOGLESHEETS_CREATE_SPREADSHEET_ROW`
- `GOOGLESHEETS_DELETE_CHART`
- `GOOGLESHEETS_DELETE_DIMENSION`
- `GOOGLESHEETS_DELETE_SHEET`
- `GOOGLESHEETS_EXECUTE_SQL`
- `GOOGLESHEETS_FIND_REPLACE`
- `GOOGLESHEETS_FIND_WORKSHEET_BY_TITLE`
- `GOOGLESHEETS_FORMAT_CELL`
- `GOOGLESHEETS_GET_BATCH_VALUES`
- `GOOGLESHEETS_GET_CONDITIONAL_FORMAT_RULES`
- `GOOGLESHEETS_GET_DATA_VALIDATION_RULES`
- `GOOGLESHEETS_GET_SHEET_NAMES`
- `GOOGLESHEETS_GET_SPREADSHEET_BY_DATA_FILTER`
- `GOOGLESHEETS_GET_SPREADSHEET_INFO`
- `GOOGLESHEETS_GET_TABLE_SCHEMA`
- `GOOGLESHEETS_INSERT_DIMENSION`
- `GOOGLESHEETS_LIST_CHARTS`
- `GOOGLESHEETS_LIST_TABLES`
- `GOOGLESHEETS_LOOKUP_SPREADSHEET_ROW`
- `GOOGLESHEETS_MOVE_CHART`
- `GOOGLESHEETS_MUTATE_CONDITIONAL_FORMAT_RULES`
- `GOOGLESHEETS_QUERY_TABLE`
- `GOOGLESHEETS_SEARCH_DEVELOPER_METADATA`
- `GOOGLESHEETS_SEARCH_SPREADSHEETS`
- `GOOGLESHEETS_SET_BASIC_FILTER`
- `GOOGLESHEETS_SET_DATA_VALIDATION_RULE`
- `GOOGLESHEETS_SHEET_FROM_JSON`
- `GOOGLESHEETS_SORT_RANGE`
- `GOOGLESHEETS_SPREADSHEETS_SHEETS_COPY_TO`
- `GOOGLESHEETS_SPREADSHEETS_VALUES_APPEND`
- `GOOGLESHEETS_SPREADSHEETS_VALUES_BATCH_CLEAR`
- `GOOGLESHEETS_SPREADSHEETS_VALUES_BATCH_GET_BY_DATA_FILTER`
- `GOOGLESHEETS_UPDATE_CHART`
- `GOOGLESHEETS_UPDATE_DIMENSION_PROPERTIES`
- `GOOGLESHEETS_UPDATE_SHEET_PROPERTIES`
- `GOOGLESHEETS_UPDATE_SPREADSHEET_PROPERTIES`
- `GOOGLESHEETS_UPDATE_VALUES_BATCH`
- `GOOGLESHEETS_UPSERT_ROWS`
- `GOOGLESHEETS_VALUES_GET`
- `GOOGLESHEETS_VALUES_UPDATE`
- `GOOGLESHEETS_AGGREGATE_METRIC_CHANGED_TRIGGER`
- `GOOGLESHEETS_CELL_RANGE_VALUES_CHANGED_TRIGGER`
- `GOOGLESHEETS_CONDITIONAL_FORMAT_RULE_CHANGED_TRIGGER`
- `GOOGLESHEETS_DATA_VALIDATION_RULE_CHANGED_TRIGGER`
- `GOOGLESHEETS_DEVELOPER_METADATA_CHANGED_TRIGGER`
- `GOOGLESHEETS_FILTERED_RANGE_VALUES_CHANGED_TRIGGER`
- `GOOGLESHEETS_NEW_ROWS_TRIGGER`
- `GOOGLESHEETS_NEW_SHEET_ADDED_TRIGGER`
- `GOOGLESHEETS_NEW_SPREADSHEET_CREATED_TRIGGER`
- `GOOGLESHEETS_SPREADSHEET_METADATA_CHANGED_TRIGGER`
- `GOOGLESHEETS_SPREADSHEET_PROPERTIES_CHANGED_TRIGGER`
- `GOOGLESHEETS_SPREADSHEET_ROW_CHANGED_TRIGGER`
- `GOOGLESHEETS_SPREADSHEET_SEARCH_MATCH_TRIGGER`
- `GOOGLESHEETS_TABLE_QUERY_RESULT_CHANGED_TRIGGER`
- `GOOGLESHEETS_TABLE_SCHEMA_CHANGED_TRIGGER`
- `GOOGLESHEETS_WORKSHEET_NAMES_CHANGED_TRIGGER`
