---
url: https://docs.composio.dev/toolkits/googledrive
title: Google Drive
description: 
status: 200
---

# Google Drive

Google Drive is a cloud storage solution for uploading, sharing, and collaborating on files across devices, with robust search and offline access

- **Category:** file management & storage
- **Auth:** OAUTH2
- **Composio-managed OAuth available?** Yes
- **Tools:** 90
- **Triggers:** 7
- **Slug:** `GOOGLEDRIVE`
- **Version:** 20260902_00

## Frequently Asked Questions

### How do I set up custom Google OAuth credentials for Google Drive?

For a step-by-step guide on creating and configuring your own Google OAuth credentials with Composio, see [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

### Why am I seeing "App is blocked" when connecting Google Drive?

The OAuth client is requesting scopes that Google hasn't verified for that client. This usually happens when you add extra scopes beyond the defaults.

Remove the additional scopes from your auth config, or create your own OAuth app and submit the scopes for verification. See [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

### Why am I getting "Google Drive API has not been used in project" error?

When using custom OAuth credentials, the Google Drive API must be enabled in the Google Cloud project that owns those credentials. Enable it in Google Cloud Console under APIs & Services, wait a few minutes, and retry.

### Why am I getting "Error 400: invalid_scope"?

The requested scopes are invalid or incorrectly formatted in the authorization URL. Verify your scope values against the [Google OAuth scopes docs](https://developers.google.com/identity/protocols/oauth2). If you're creating auth configs programmatically, see the [programmatic auth config guide](/docs/authentication/programmatic-auth-configs).

### Why does the OAuth consent screen show "Composio" instead of my app?

By default, the consent screen uses Composio's OAuth app. To show your own app name and logo, create your own OAuth app and set a custom redirect URL. See [White-labeling authentication](/docs/authentication/white-labeling-authentication#using-your-own-oauth-apps).

### Why am I getting 401 errors on tool calls?

The user's access token is no longer valid. Common causes: the user revoked access, changed their password or 2FA, a Workspace admin policy changed, or Google's refresh token limit (~50 per account) was exceeded. Re-authenticating the user typically resolves this.

## Tools

- `GOOGLEDRIVE_ADD_FILE_SHARING_PREFERENCE`
- `GOOGLEDRIVE_ADD_PARENT`
- `GOOGLEDRIVE_ADD_PROPERTY`
- `GOOGLEDRIVE_COPY_FILE`
- `GOOGLEDRIVE_COPY_FILE_ADVANCED`
- `GOOGLEDRIVE_CREATE_COMMENT`
- `GOOGLEDRIVE_CREATE_DRIVE`
- `GOOGLEDRIVE_CREATE_FILE`
- `GOOGLEDRIVE_CREATE_FILE_FROM_TEXT`
- `GOOGLEDRIVE_CREATE_FOLDER`
- `GOOGLEDRIVE_CREATE_PERMISSION`
- `GOOGLEDRIVE_CREATE_PERMISSIONS_BATCH`
- `GOOGLEDRIVE_CREATE_REPLY`
- `GOOGLEDRIVE_CREATE_SHORTCUT_TO_FILE`
- `GOOGLEDRIVE_CREATE_TEAM_DRIVE`
- `GOOGLEDRIVE_DELETE_CHILD`
- `GOOGLEDRIVE_DELETE_COMMENT`
- `GOOGLEDRIVE_DELETE_DRIVE`
- `GOOGLEDRIVE_DELETE_FILE`
- `GOOGLEDRIVE_DELETE_PARENT`
- `GOOGLEDRIVE_DELETE_PERMISSION`
- `GOOGLEDRIVE_DELETE_PROPERTY`
- `GOOGLEDRIVE_DELETE_REPLY`
- `GOOGLEDRIVE_DELETE_REVISION`
- `GOOGLEDRIVE_DELETE_TEAM_DRIVE`
- `GOOGLEDRIVE_DOWNLOAD_FILE`
- `GOOGLEDRIVE_DOWNLOAD_FILE2`
- `GOOGLEDRIVE_DOWNLOAD_FILE_OPERATION`
- `GOOGLEDRIVE_EDIT_FILE`
- `GOOGLEDRIVE_EMPTY_TRASH`
- `GOOGLEDRIVE_EXPORT_GOOGLE_WORKSPACE_FILE`
- `GOOGLEDRIVE_FIND_FILE`
- `GOOGLEDRIVE_FIND_FOLDER`
- `GOOGLEDRIVE_GENERATE_IDS`
- `GOOGLEDRIVE_GET_ABOUT`
- `GOOGLEDRIVE_GET_APP`
- `GOOGLEDRIVE_GET_CHANGE`
- `GOOGLEDRIVE_GET_CHANGES_START_PAGE_TOKEN`
- `GOOGLEDRIVE_GET_CHILD`
- `GOOGLEDRIVE_GET_COMMENT`
- `GOOGLEDRIVE_GET_DRIVE`
- `GOOGLEDRIVE_GET_FILE_METADATA`
- `GOOGLEDRIVE_GET_FILE_PROPERTY`
- `GOOGLEDRIVE_GET_FILE_V2`
- `GOOGLEDRIVE_GET_PARENT`
- `GOOGLEDRIVE_GET_PERMISSION`
- `GOOGLEDRIVE_GET_PERMISSION_ID_FOR_EMAIL`
- `GOOGLEDRIVE_GET_REPLY`
- `GOOGLEDRIVE_GET_REVISION`
- `GOOGLEDRIVE_GET_TEAM_DRIVE`
- `GOOGLEDRIVE_GOOGLE_DRIVE_DELETE_FOLDER_OR_FILE_ACTION`
- `GOOGLEDRIVE_HIDE_DRIVE`
- `GOOGLEDRIVE_INSERT_CHILD`
- `GOOGLEDRIVE_LIST_ACCESS_PROPOSALS`
- `GOOGLEDRIVE_LIST_APPROVALS`
- `GOOGLEDRIVE_LIST_CHANGES`
- `GOOGLEDRIVE_LIST_CHILDREN_V2`
- `GOOGLEDRIVE_LIST_COMMENTS`
- `GOOGLEDRIVE_LIST_FILE_LABELS`
- `GOOGLEDRIVE_LIST_FILE_PROPERTIES`
- `GOOGLEDRIVE_LIST_FILES`
- `GOOGLEDRIVE_LIST_PERMISSIONS`
- `GOOGLEDRIVE_LIST_REPLIES`
- `GOOGLEDRIVE_LIST_REVISIONS`
- `GOOGLEDRIVE_LIST_SHARED_DRIVES`
- `GOOGLEDRIVE_LIST_TEAM_DRIVES`
- `GOOGLEDRIVE_MODIFY_FILE_LABELS`
- `GOOGLEDRIVE_MOVE_FILE`
- `GOOGLEDRIVE_PARSE_FILE`
- `GOOGLEDRIVE_PATCH_PERMISSION`
- `GOOGLEDRIVE_PATCH_PROPERTY`
- `GOOGLEDRIVE_RESUMABLE_UPLOAD`
- `GOOGLEDRIVE_STOP_WATCH_CHANNEL`
- `GOOGLEDRIVE_TRASH_FILE`
- `GOOGLEDRIVE_UNHIDE_DRIVE`
- `GOOGLEDRIVE_UNTRASH_FILE`
- `GOOGLEDRIVE_UPDATE_COMMENT`
- `GOOGLEDRIVE_UPDATE_DRIVE`
- `GOOGLEDRIVE_UPDATE_FILE_METADATA_PATCH`
- `GOOGLEDRIVE_UPDATE_FILE_PROPERTY`
