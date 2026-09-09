---
url: https://docs.composio.dev/toolkits/gmail
title: Gmail
description: 
status: 200
---

# Gmail

Gmail is Google’s email service, featuring spam protection, search functions, and seamless integration with other G Suite apps for productivity

- **Category:** email
- **Auth:** OAUTH2
- **Composio-managed OAuth available?** Yes
- **Tools:** 63
- **Triggers:** 2
- **Slug:** `GMAIL`
- **Version:** 20260903_00

## Frequently Asked Questions

### How do I set up custom Google OAuth credentials for Gmail?

For a step-by-step guide on creating and configuring your own Google OAuth credentials with Composio, see [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

### Why am I seeing "App is blocked" when connecting Gmail?

The OAuth client is requesting scopes that Google hasn't verified for that client. This usually happens when you add extra scopes beyond the defaults.

Remove the additional scopes from your auth config, or create your own OAuth app and submit the scopes for verification. See [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

### Why am I getting "Gmail API has not been used in project" error?

When using custom OAuth credentials, the Gmail API must be enabled in the Google Cloud project that owns those credentials. Enable it in Google Cloud Console under APIs & Services, wait a few minutes, and retry.

### Why am I getting "Error 400: invalid_scope"?

The requested scopes are invalid or incorrectly formatted in the authorization URL. Verify your scope values against the [Google OAuth scopes docs](https://developers.google.com/identity/protocols/oauth2). If you're creating auth configs programmatically, see the [programmatic auth config guide](/docs/authentication/programmatic-auth-configs).

### Why does the OAuth consent screen show "Composio" instead of my app?

By default, the consent screen uses Composio's OAuth app. To show your own app name and logo, create your own OAuth app and set a custom redirect URL. See [White-labeling authentication](/docs/authentication/white-labeling-authentication#using-your-own-oauth-apps).

### Why am I getting 401 errors on tool calls?

The user's access token is no longer valid. Common causes: the user revoked access, changed their password or 2FA, a Workspace admin policy changed, or Google's refresh token limit (~50 per account) was exceeded. Re-authenticating the user typically resolves this.

### Why is my Gmail trigger slow?

Gmail triggers poll roughly every minute by default. If you need lower latency, consider using webhooks or Google Pub/Sub integrations.

### Why am I getting "Quota Exhausted" or "rate limit exhausted"?

Google enforces per-minute and daily request quotas. If you're using Composio's default OAuth app, you share that quota with other users, which can cause limits to be hit faster. Use your own OAuth app credentials to get a dedicated quota, and add exponential backoff and retries to handle transient rate limits.

### How do I send an email with an attachment?

When using the Composio SDK, pass a local file path or a public URL directly as a string to the `attachment` field. The SDK's auto-upload feature (enabled by default) handles uploading the file and converting it to the required format. You do not need to construct the `{ s3key, name, mimetype }` object manually.

```python
result = composio.tools.execute(
    slug="GMAIL_SEND_EMAIL",
    user_id="user-123",
    arguments={
        "recipient_email": "recipient@example.com",
        "subject": "Report attached",
        "body": "See attached.",
        "attachment": "https://example.com/report.pdf",
    },
)
```

This approach works for any tool whose parameters accept file uploads. See [Automatic File Handling](/docs/tools-direct/executing-tools#automatic-file-handling) for more details.

### Why can Gmail filter setup show an app-blocked error?

If a user on Composio-managed Gmail auth hits Google's "app is blocked" / unverified-app screen after adding `gmail.settings.basic`, use your own Google OAuth app verified for `https://www.googleapis.com/auth/gmail.settings.basic`, then reconnect.

### When should I avoid `gmail.metadata` when fetching full Gmail email content?

Use `https://www.googleapis.com/auth/gmail.metadata` only when the app needs message metadata such as labels and headers, not message bodies or payload content. Gmail treats `gmail.metadata` as a restricted metadata-only scope, and it is not compatible with broader content-access scopes such as `gmail.readonly`, `gmail.modify`, or `mail.google.com` in the same OAuth request.

If a tool needs full email content, remove `gmail.metadata` from the auth config and request a Gmail scope that allows message content access. Then reconnect the account so the new scope set is granted.

## Tools

- `GMAIL_ADD_LABEL_TO_EMAIL`
- `GMAIL_BATCH_DELETE_MESSAGES`
- `GMAIL_BATCH_MODIFY_MESSAGES`
- `GMAIL_CREATE_EMAIL_DRAFT`
- `GMAIL_CREATE_FILTER`
- `GMAIL_CREATE_LABEL`
- `GMAIL_CREATE_PROMPT_POST`
- `GMAIL_DELETE_DRAFT`
- `GMAIL_DELETE_FILTER`
- `GMAIL_DELETE_LABEL`
- `GMAIL_DELETE_MESSAGE`
- `GMAIL_DELETE_THREAD`
- `GMAIL_FETCH_EMAILS`
- `GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID`
- `GMAIL_FETCH_MESSAGE_BY_THREAD_ID`
- `GMAIL_FORWARD_MESSAGE`
- `GMAIL_GET_ATTACHMENT`
- `GMAIL_GET_AUTO_FORWARDING`
- `GMAIL_GET_CONTACTS`
- `GMAIL_GET_DRAFT`
- `GMAIL_GET_FILTER`
- `GMAIL_GET_LABEL`
- `GMAIL_GET_LANGUAGE_SETTINGS`
- `GMAIL_GET_PEOPLE`
- `GMAIL_GET_PROFILE`
- `GMAIL_GET_VACATION_SETTINGS`
- `GMAIL_IMPORT_MESSAGE`
- `GMAIL_INSERT_MESSAGE`
- `GMAIL_LIST_CSE_IDENTITIES`
- `GMAIL_LIST_CSE_KEYPAIRS`
- `GMAIL_LIST_DRAFTS`
- `GMAIL_LIST_FILTERS`
- `GMAIL_LIST_FORWARDING_ADDRESSES`
- `GMAIL_LIST_HISTORY`
- `GMAIL_LIST_LABELS`
- `GMAIL_LIST_MESSAGES`
- `GMAIL_LIST_SEND_AS`
- `GMAIL_LIST_SMIME_INFO`
- `GMAIL_LIST_THREADS`
- `GMAIL_MODIFY_THREAD_LABELS`
- `GMAIL_MOVE_THREAD_TO_TRASH`
- `GMAIL_MOVE_TO_TRASH`
- `GMAIL_PATCH_LABEL`
- `GMAIL_PATCH_SEND_AS`
- `GMAIL_REMOVE_LABEL`
- `GMAIL_REPLY_TO_THREAD`
- `GMAIL_SEARCH_PEOPLE`
- `GMAIL_SEND_DRAFT`
- `GMAIL_SEND_EMAIL`
- `GMAIL_SETTINGS_GET_IMAP`
- `GMAIL_SETTINGS_GET_POP`
- `GMAIL_SETTINGS_SEND_AS_GET`
- `GMAIL_STOP_WATCH`
- `GMAIL_UNTRASH_MESSAGE`
- `GMAIL_UNTRASH_THREAD`
- `GMAIL_UPDATE_DRAFT`
- `GMAIL_UPDATE_IMAP_SETTINGS`
- `GMAIL_UPDATE_LABEL`
- `GMAIL_UPDATE_LANGUAGE_SETTINGS`
- `GMAIL_UPDATE_POP_SETTINGS`
- `GMAIL_UPDATE_SEND_AS`
- `GMAIL_UPDATE_USER_ATTRIBUTES_VALUES`
- `GMAIL_UPDATE_VACATION_SETTINGS`
- `GMAIL_EMAIL_SENT_TRIGGER`
- `GMAIL_NEW_GMAIL_MESSAGE`
