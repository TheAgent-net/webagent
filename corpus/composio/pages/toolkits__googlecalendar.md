---
url: https://docs.composio.dev/toolkits/googlecalendar
title: Google Calendar
description: 
status: 200
---

# Google Calendar

Google Calendar is a time management tool providing scheduling features, event reminders, and integration with email and other apps for streamlined organization

- **Category:** scheduling & booking
- **Auth:** OAUTH2
- **Composio-managed OAuth available?** Yes
- **Tools:** 49
- **Triggers:** 7
- **Slug:** `GOOGLECALENDAR`
- **Version:** 20260902_00

## Frequently Asked Questions

### How do I set up custom Google OAuth credentials for Google Calendar?

For a step-by-step guide on creating and configuring your own Google OAuth credentials with Composio, see [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

### Why am I seeing "App is blocked" when connecting Google Calendar?

The OAuth client is requesting scopes that Google hasn't verified for that client. This usually happens when you add extra scopes beyond the defaults.

Remove the additional scopes from your auth config, or create your own OAuth app and submit the scopes for verification. See [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

### Why am I getting "Google Calendar API has not been used in project" error?

When using custom OAuth credentials, the Google Calendar API must be enabled in the Google Cloud project that owns those credentials. Enable it in Google Cloud Console under APIs & Services, wait a few minutes, and retry.

### Why am I getting "Error 400: invalid_scope"?

The requested scopes are invalid or incorrectly formatted in the authorization URL. Verify your scope values against the [Google OAuth scopes docs](https://developers.google.com/identity/protocols/oauth2). If you're creating auth configs programmatically, see the [programmatic auth config guide](/docs/authentication/programmatic-auth-configs).

### Why does the OAuth consent screen show "Composio" instead of my app?

By default, the consent screen uses Composio's OAuth app. To show your own app name and logo, create your own OAuth app and set a custom redirect URL. See [White-labeling authentication](/docs/authentication/white-labeling-authentication#using-your-own-oauth-apps).

### Why am I getting 401 errors on tool calls?

The user's access token is no longer valid. Common causes: the user revoked access, changed their password or 2FA, a Workspace admin policy changed, or Google's refresh token limit (~50 per account) was exceeded. Re-authenticating the user typically resolves this.

## Tools

- `GOOGLECALENDAR_ACL_DELETE`
- `GOOGLECALENDAR_ACL_GET`
- `GOOGLECALENDAR_ACL_INSERT`
- `GOOGLECALENDAR_ACL_LIST`
- `GOOGLECALENDAR_ACL_PATCH`
- `GOOGLECALENDAR_ACL_UPDATE`
- `GOOGLECALENDAR_ACL_WATCH`
- `GOOGLECALENDAR_BATCH_EVENTS`
- `GOOGLECALENDAR_CALENDAR_LIST_DELETE`
- `GOOGLECALENDAR_CALENDAR_LIST_GET`
- `GOOGLECALENDAR_CALENDAR_LIST_INSERT`
- `GOOGLECALENDAR_CALENDAR_LIST_PATCH`
- `GOOGLECALENDAR_CALENDAR_LIST_UPDATE`
- `GOOGLECALENDAR_CALENDAR_LIST_WATCH`
- `GOOGLECALENDAR_CALENDARS_DELETE`
- `GOOGLECALENDAR_CALENDARS_UPDATE`
- `GOOGLECALENDAR_CHANNELS_STOP`
- `GOOGLECALENDAR_CLEAR_CALENDAR`
- `GOOGLECALENDAR_COLORS_GET`
- `GOOGLECALENDAR_CREATE_CALENDAR`
- `GOOGLECALENDAR_CREATE_EVENT`
- `GOOGLECALENDAR_DELETE_EVENT`
- `GOOGLECALENDAR_DUPLICATE_CALENDAR`
- `GOOGLECALENDAR_EVENTS_GET`
- `GOOGLECALENDAR_EVENTS_IMPORT`
- `GOOGLECALENDAR_EVENTS_INSTANCES`
- `GOOGLECALENDAR_EVENTS_LIST`
- `GOOGLECALENDAR_EVENTS_LIST_ALL_CALENDARS`
- `GOOGLECALENDAR_EVENTS_MOVE`
- `GOOGLECALENDAR_EVENTS_WATCH`
- `GOOGLECALENDAR_FIND_EVENT`
- `GOOGLECALENDAR_FIND_FREE_SLOTS`
- `GOOGLECALENDAR_FREE_BUSY_QUERY`
- `GOOGLECALENDAR_GET_CALENDAR`
- `GOOGLECALENDAR_GET_CALENDAR_PROFILE`
- `GOOGLECALENDAR_GET_CURRENT_DATE_TIME`
- `GOOGLECALENDAR_LIST_BUILDINGS`
- `GOOGLECALENDAR_LIST_CALENDAR_RESOURCES`
- `GOOGLECALENDAR_LIST_CALENDARS`
- `GOOGLECALENDAR_LIST_SETTINGS`
- `GOOGLECALENDAR_PATCH_CALENDAR`
- `GOOGLECALENDAR_PATCH_EVENT`
- `GOOGLECALENDAR_QUICK_ADD`
- `GOOGLECALENDAR_REMOVE_ATTENDEE`
- `GOOGLECALENDAR_SETTINGS_GET`
- `GOOGLECALENDAR_SETTINGS_LIST`
- `GOOGLECALENDAR_SETTINGS_WATCH`
- `GOOGLECALENDAR_SYNC_EVENTS`
- `GOOGLECALENDAR_UPDATE_EVENT`
- `GOOGLECALENDAR_ATTENDEE_RESPONSE_CHANGED_TRIGGER`
- `GOOGLECALENDAR_EVENT_CANCELED_DELETED_TRIGGER`
- `GOOGLECALENDAR_EVENT_STARTING_SOON_TRIGGER`
- `GOOGLECALENDAR_GOOGLE_CALENDAR_EVENT_CHANGE_TRIGGER`
- `GOOGLECALENDAR_GOOGLE_CALENDAR_EVENT_CREATED_TRIGGER`
- `GOOGLECALENDAR_GOOGLE_CALENDAR_EVENT_SYNC_TRIGGER`
- `GOOGLECALENDAR_GOOGLE_CALENDAR_EVENT_UPDATED_TRIGGER`
