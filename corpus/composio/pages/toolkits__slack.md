---
url: https://docs.composio.dev/toolkits/slack
title: Slack
description: 
status: 200
---

# Slack

Slack is a channel-based messaging platform. With Slack, people can work together more effectively, connect all their software tools and services, and find the information they need to do their best work - all within a secure, enterprise-grade environment.

- **Category:** team chat
- **Auth:** OAUTH2
- **Composio-managed OAuth available?** Yes
- **Tools:** 167
- **Triggers:** 9
- **Slug:** `SLACK`
- **Version:** 20260826_00

## Frequently Asked Questions

### What does the Composio + Slack integration do?

Composio turns Slack's API into ready-to-use tools that AI agents and automations can call. With the integration you can send and read messages, manage channels, upload files, react to events, search conversations, and more — all through a unified platform. Composio supports two toolkits: **Slack** (authenticate as a user for workspace-level actions) and **Slackbot** (authenticate as a bot for in-channel messaging, app mentions, and slash commands). Developers connect their Slack workspace once and then orchestrate any combination of these actions from their agents or workflows.

### How does Composio handle my Slack data?

Composio executes API calls on behalf of your connected account. All data is encrypted and subject to a 30-day retention policy. Authentication tokens are encrypted at rest and scoped to the permissions you grant during the OAuth flow. For full details on data handling, retention, and third-party data practices, see our [Privacy Policy](https://composio.dev/privacy).

### How do I set up custom OAuth credentials for Slack?

For a step-by-step guide on creating and configuring your own Slack OAuth credentials with Composio, see [How to create OAuth credentials for Slack](https://composio.dev/auth/slack).

### When do users see "This app isn't listed in the Slack Marketplace…"?

When a member of a Slack workspace tries to install a non-Marketplace app.

**How to resolve:** Disable **Require apps from Slack Marketplace** in the workspace's app management settings:

`Settings → Apps & Workflows → App Management Settings`

### Why am I being asked to submit a request during auth?

Because **Require approved apps** is enabled in the workspace's **App Management Settings**. Slack is asking for admin/owner approval before completing the install.

### How can a workspace member complete the connection without asking for permissions or approvals?

Two ways:

- Disable both **Require apps from Slack Marketplace** and **Require approved apps** in the workspace's app management settings.
- Use the workspace's own OAuth app, which is recommended and safest. See [How to create OAuth credentials for Slack](https://composio.dev/auth/slack).

### What is the difference between Slack and Slackbot toolkits?

Slack is for workspace-level API access (channels, files, users) while Slackbot is bot-centric (messaging, interactivity). Slack triggers cover workspace events; Slackbot covers bot entry points like app mentions, DMs, and slash commands. Slack can post as the app; Slackbot posts as the bot user.

### Where can I find Slack's available scopes?

See the [Slack scopes reference](https://docs.slack.dev/reference/scopes/).

### Why am I getting a redirect URI mismatch error?

Update the redirect URL in your Slack App under OAuth & Permissions → Redirect URLs.

### How do I set up Slack event webhooks?

With Composio-managed Slack credentials, the webhook endpoint is already provisioned, so just create the trigger. If you bring your own Slack OAuth app, see [Custom OAuth webhooks](https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks).

### Why am I getting scope errors on Slack?

Either you're missing a bot scope (add one under OAuth & Permissions) or you have "Insufficient scopes" (ensure all scopes from your auth config are configured in the Slack app).

### What does the `as_user` parameter do in Slack tools?

For the Slack toolkit, set `as_user=True` to post as the authenticated user. For Slackbot, leave it blank (defaults to false). A `missing_charset` error usually means invalid `as_user`, wrong channel ID, or missing required fields.

### Why aren't my Slack triggers working?

See [Triggers](/docs/triggers).

### Slack Marketplace warnings during OAuth

Slack may show a Marketplace warning when the OAuth app is not listed or approved in Slack Marketplace. The OAuth flow can still work if the workspace allows non-Marketplace apps, but workspaces with stricter app policies may require admin approval before the connection can complete.

Composio is working on Marketplace review for the managed Slack app. Until that review is complete, use the workspace's own Slack OAuth app or ask a workspace admin to approve the app if the warning blocks users.

![Slack OAuth consent warning stating that the app is not approved by Slack.](/images/kb/toolkits/slack/slack-marketplace-warning.png)

### Do I have to be a Workspace Owner to install the app?

In some cases — yes. For example, when installing non-Marketplace apps, you'll need to be an owner to install directly and complete the connection. As a member, you'd need to either request approval, or ask the owner to disable **Require approved apps**.

## Tools

- `SLACK_ADD_CALL_PARTICIPANTS`
- `SLACK_ADD_EMOJI`
- `SLACK_ADD_EMOJI_ALIAS`
- `SLACK_ADD_ENTERPRISE_USER_TO_WORKSPACE`
- `SLACK_ADD_REACTION_TO_AN_ITEM`
- `SLACK_ADD_REMOTE_FILE`
- `SLACK_ADD_STAR`
- `SLACK_ADMIN_CONVERSATIONS_SEARCH`
- `SLACK_API_TEST`
- `SLACK_ARCHIVE_CONVERSATION`
- `SLACK_ASSISTANT_SEARCH_CONTEXT`
- `SLACK_ASSISTANT_SEARCH_INFO`
- `SLACK_CHAT_POST_MESSAGE`
- `SLACK_SEND_MESSAGE`
- `SLACK_CLOSE_DM`
- `SLACK_CONVERT_CHANNEL_TO_PRIVATE`
- `SLACK_CREATE_A_REMINDER`
- `SLACK_CREATE_CANVAS`
- `SLACK_CREATE_CHANNEL`
- `SLACK_CREATE_CHANNEL_BASED_CONVERSATION`
- `SLACK_CREATE_ENTERPRISE_TEAM`
- `SLACK_CREATE_SLACK_LIST`
- `SLACK_CREATE_SLACK_LIST_ITEM`
- `SLACK_CREATE_USER_GROUP`
- `SLACK_CUSTOMIZE_URL_UNFURL`
- `SLACK_DELETE_CANVAS`
- `SLACK_DELETE_CHANNEL`
- `SLACK_DELETE_FILE`
- `SLACK_DELETE_FILE_COMMENT`
- `SLACK_DELETE_MULTIPLE_SLACK_LIST_ITEMS`
- `SLACK_DELETE_REMINDER`
- `SLACK_DELETES_A_MESSAGE_FROM_A_CHAT`
- `SLACK_DELETE_SCHEDULED_MESSAGE`
- `SLACK_DELETE_SLACK_LIST_ACCESS`
- `SLACK_DELETE_SLACK_LIST_ITEM`
- `SLACK_DELETE_USER_PROFILE_PHOTO`
- `SLACK_DISABLE_USER_GROUP`
- `SLACK_DOWNLOAD_SLACK_FILE`
- `SLACK_EDIT_CANVAS`
- `SLACK_ENABLE_PUBLIC_SHARING_OF_A_FILE`
- `SLACK_ENABLE_USER_GROUP`
- `SLACK_END_CALL`
- `SLACK_END_DND`
- `SLACK_END_SNOOZE`
- `SLACK_FETCH_CONVERSATION_HISTORY`
- `SLACK_FETCH_ITEM_REACTIONS`
- `SLACK_FETCH_MESSAGE_THREAD_FROM_A_CONVERSATION`
- `SLACK_FETCH_TEAM_INFO`
- `SLACK_FIND_CHANNELS`
- `SLACK_FIND_USER_BY_EMAIL_ADDRESS`
- `SLACK_FIND_USERS`
- `SLACK_GET_APP_PERMISSION_SCOPES`
- `SLACK_GET_AUDIT_ACTION_TYPES`
- `SLACK_GET_AUDIT_SCHEMAS`
- `SLACK_GET_BOT_USER`
- `SLACK_GET_CALL_INFO`
- `SLACK_GET_CANVAS`
- `SLACK_GET_CHANNEL_CONVERSATION_PREFERENCES`
- `SLACK_GET_REMINDER`
- `SLACK_GET_REMOTE_FILE`
- `SLACK_GET_SLACK_LIST_ITEM`
- `SLACK_GET_TEAM_PROFILE`
- `SLACK_GET_UNREAD_MESSAGES_FROM_USER`
- `SLACK_GET_USER_DND_STATUS`
- `SLACK_GET_USER_PRESENCE`
- `SLACK_GET_WORKSPACE_CONNECTIONS_FOR_CHANNEL`
- `SLACK_GET_WORKSPACE_SETTINGS`
- `SLACK_INVITE_USERS_TO_A_SLACK_CHANNEL`
- `SLACK_INVITE_USER_TO_CHANNEL`
- `SLACK_INVITE_USER_TO_WORKSPACE`
- `SLACK_JOIN_AN_EXISTING_CONVERSATION`
- `SLACK_LEAVE_A_CONVERSATION`
- `SLACK_LEAVE_CONVERSATION`
- `SLACK_LIST_ADMIN_APPS_APPROVED`
- `SLACK_LIST_ADMIN_APPS_REQUESTS`
- `SLACK_LIST_ADMIN_EMOJI`
- `SLACK_LIST_ALL_CHANNELS`
- `SLACK_LIST_ALL_USERS`
- `SLACK_LIST_APPROVED_WORKSPACE_INVITE_REQUESTS`
- `SLACK_LIST_AUTH_TEAMS`
