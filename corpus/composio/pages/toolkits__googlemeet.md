---
url: https://docs.composio.dev/toolkits/googlemeet
title: Google Meet
description: 
status: 200
---

# Google Meet

Google Meet is a secure video conferencing platform that integrates with Google Workspace, facilitating remote meetings, screen sharing, and chat

- **Category:** video conferencing
- **Auth:** OAUTH2
- **Composio-managed OAuth available?** Yes
- **Tools:** 15
- **Triggers:** 0
- **Slug:** `GOOGLEMEET`
- **Version:** 20260811_00

## Frequently Asked Questions

### How do I set up custom Google OAuth credentials for Google Meet?

For a step-by-step guide on creating and configuring your own Google OAuth credentials with Composio, see [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

### Why am I seeing "App is blocked" when connecting Google Meet?

The OAuth client is requesting scopes that Google hasn't verified for that client. This usually happens when you add extra scopes beyond the defaults.

Remove the additional scopes from your auth config, or create your own OAuth app and submit the scopes for verification. See [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

### Why am I getting "Google Meet API has not been used in project" error?

When using custom OAuth credentials, the Google Meet API must be enabled in the Google Cloud project that owns those credentials. Enable it in Google Cloud Console under APIs & Services, wait a few minutes, and retry.

### Why am I getting "Error 400: invalid_scope"?

The requested scopes are invalid or incorrectly formatted in the authorization URL. Verify your scope values against the [Google OAuth scopes docs](https://developers.google.com/identity/protocols/oauth2). If you're creating auth configs programmatically, see the [programmatic auth config guide](/docs/authentication/programmatic-auth-configs).

### Why does the OAuth consent screen show "Composio" instead of my app?

By default, the consent screen uses Composio's OAuth app. To show your own app name and logo, create your own OAuth app and set a custom redirect URL. See [White-labeling authentication](/docs/authentication/white-labeling-authentication#using-your-own-oauth-apps).

### Why am I getting 401 errors on tool calls?

The user's access token is no longer valid. Common causes: the user revoked access, changed their password or 2FA, a Workspace admin policy changed, or Google's refresh token limit (~50 per account) was exceeded. Re-authenticating the user typically resolves this.

### Why am I getting "Quota Exhausted" or "rate limit exhausted"?

Google enforces per-minute and daily request quotas. If you're using Composio's default OAuth app, you share that quota with other users, which can cause limits to be hit faster. Use your own OAuth app credentials to get a dedicated quota, and add exponential backoff and retries to handle transient rate limits.

### Why do Google Meet calls return 403 on conference records or artifacts?

Google Meet conference records and artifacts are provider-side resources. If a tool returns an error such as "Permission denied on resource Conference (or it might not exist)", verify that the conference record exists, the connected Google account can access that meeting or artifact, and the workspace edition supports the artifact being requested.

For recordings specifically, Google only makes recording available on supported Google Workspace editions such as Business Standard/Plus, Enterprise Standard/Plus, Education Plus, Essentials, Enterprise Essentials, and Enterprise Essentials Plus. Recording also has to be enabled by the Workspace admin, and artifacts are saved to the meeting organizer's Drive.

## Tools

- `GOOGLEMEET_CREATE_MEET`
- `GOOGLEMEET_END_ACTIVE_CONFERENCE`
- `GOOGLEMEET_GET_CONFERENCE_RECORD_BY_NAME`
- `GOOGLEMEET_GET_MEET`
- `GOOGLEMEET_GET_PARTICIPANT_SESSION`
- `GOOGLEMEET_GET_RECORDINGS_BY_CONFERENCE_RECORD_ID`
- `GOOGLEMEET_GET_TRANSCRIPT`
- `GOOGLEMEET_GET_TRANSCRIPT_ENTRY`
- `GOOGLEMEET_GET_TRANSCRIPTS_BY_CONFERENCE_RECORD_ID`
- `GOOGLEMEET_LIST_CONFERENCE_RECORDS`
- `GOOGLEMEET_LIST_PARTICIPANTS`
- `GOOGLEMEET_LIST_PARTICIPANT_SESSIONS`
- `GOOGLEMEET_LIST_RECORDINGS`
- `GOOGLEMEET_LIST_TRANSCRIPT_ENTRIES`
- `GOOGLEMEET_UPDATE_SPACE`
