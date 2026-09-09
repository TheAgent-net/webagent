---
url: https://docs.composio.dev/toolkits/twitter
title: Twitter
description: 
status: 200
---

# Twitter

Twitter, Inc. was an American social media company based in San Francisco, California, which operated and was named for named for its flagship social media network prior to its rebrand as X.

- **Category:** social media accounts
- **Auth:** OAUTH2
- **Composio-managed OAuth available?** No
- **Tools:** 79
- **Triggers:** 0
- **Slug:** `TWITTER`
- **Version:** 20260812_00

## Frequently Asked Questions

### Why are Composio managed credentials no longer available for Twitter?

As of February 2026, Composio managed credentials for the Twitter toolkit have been removed. You must now bring your own Twitter API credentials. To migrate:

1. Create a Twitter Developer account and obtain API credentials from the [Twitter Developer Portal](https://developer.x.com/en/portal/dashboard).
2. Set up a custom auth configuration with your credentials in Composio.

If you were relying on managed credentials, your Twitter integrations will stop working until you configure your own. See the [changelog entry](/docs/changelog/2026/02/12) for full details.

### Why am I getting rate limit or "UsageCapExceeded" errors on Twitter?

Twitter enforces strict rate limits per app. Use your own OAuth app with appropriate rate limit allocations for production workloads.

### Why can't I access certain Twitter API endpoints?

Twitter enforces plan-based access tiers. Check your project's product and plan for the required permissions at the [Twitter Developer Portal](https://developer.x.com/en/portal/products).

### Why am I getting 403 errors on Twitter API calls?

Your developer account or project may not have the required access level for the endpoint. Check your enrollment and access tier in the Twitter Developer Portal.

### What length limits apply to Twitter/X posts?

Twitter/X enforces strict post length limits. For normal posts, keep the content under 280 characters and follow X's official character-counting behavior, since URLs, Unicode, and special characters may be counted by provider-specific rules.

### `client-not-enrolled` and `App not linked to project` usually point to Twitter developer app/project setup issues

These errors usually mean the Twitter/X developer app is not correctly connected to a Twitter developer project, or the OAuth app configuration is stale after X's API model changes. Verify the app is linked to a project, configured according to the Twitter setup guide, and aligned with the current X API requirements. If the connected account is already `EXPIRED`, recreate the connection after fixing the app configuration.

## Tools

- `TWITTER_ADD_LIST_MEMBER`
- `TWITTER_ADD_POST_TO_BOOKMARKS`
- `TWITTER_APPEND_MEDIA_UPLOAD`
- `TWITTER_BOOKMARKS_BY_USER`
- `TWITTER_CREATE_ACTIVITY_SUBSCRIPTION`
- `TWITTER_CREATE_COMPLIANCE_JOB`
- `TWITTER_CREATE_DM_CONVERSATION`
- `TWITTER_CREATE_LIST`
- `TWITTER_CREATION_OF_A_POST`
- `TWITTER_DELETE_DM`
- `TWITTER_DELETE_LIST`
- `TWITTER_FOLLOWERS_BY_USER_ID`
- `TWITTER_FOLLOWING_BY_USER_ID`
- `TWITTER_FOLLOW_LIST`
- `TWITTER_FOLLOW_USER`
- `TWITTER_FULL_ARCHIVE_SEARCH`
- `TWITTER_GET_BLOCKED_USERS`
- `TWITTER_GET_COMPLIANCE_JOB`
- `TWITTER_GET_COMPLIANCE_JOBS`
- `TWITTER_GET_DM_CONVERSATION_EVENTS`
- `TWITTER_GET_DM_EVENT`
- `TWITTER_GET_LIST`
- `TWITTER_GET_LIST_FOLLOWERS`
- `TWITTER_GET_LIST_MEMBERS`
- `TWITTER_GET_MEDIA_UPLOAD_STATUS`
- `TWITTER_GET_MUTED_USERS`
- `TWITTER_GET_OPENAPI_SPEC`
- `TWITTER_GET_POST_ANALYTICS`
- `TWITTER_GET_POST_RETWEETERS_ACTION`
- `TWITTER_GET_POST_RETWEETS`
- `TWITTER_GET_POST_USAGE`
- `TWITTER_GET_RECENT_DM_EVENTS`
- `TWITTER_GET_SPACE_BY_ID`
- `TWITTER_GET_SPACE_POSTS`
- `TWITTER_GET_SPACES_BY_CREATORS`
- `TWITTER_GET_SPACES_BY_IDS`
- `TWITTER_GET_SPACE_TICKET_BUYERS`
- `TWITTER_GET_USER_BY_ID`
- `TWITTER_GET_USER_FOLLOWED_LISTS`
- `TWITTER_GET_USER_LIST_MEMBERSHIPS`
- `TWITTER_GET_USER_OWNED_LISTS`
- `TWITTER_GET_USER_PINNED_LISTS`
- `TWITTER_GET_USERS_BY_IDS`
- `TWITTER_HIDE_REPLIES`
- `TWITTER_INITIALIZE_MEDIA_UPLOAD`
- `TWITTER_LIST_POST_LIKERS`
- `TWITTER_LIST_POSTS_TIMELINE_BY_LIST_ID`
- `TWITTER_MUTE_USER`
- `TWITTER_PIN_LIST`
- `TWITTER_POST_DELETE_BY_POST_ID`
- `TWITTER_POST_LOOKUP_BY_POST_ID`
- `TWITTER_POST_LOOKUP_BY_POST_IDS`
- `TWITTER_RECENT_SEARCH`
- `TWITTER_REMOVE_LIST_MEMBER`
- `TWITTER_REMOVE_POST_FROM_BOOKMARKS`
- `TWITTER_RETRIEVE_DM_CONVERSATION_EVENTS`
- `TWITTER_RETRIEVE_POSTS_THAT_QUOTE_A_POST`
- `TWITTER_RETURNS_POST_OBJECTS_LIKED_BY_THE_PROVIDED_USER_ID`
- `TWITTER_RETWEET_POST`
- `TWITTER_SEARCH_FULL_ARCHIVE_COUNTS`
- `TWITTER_SEARCH_RECENT_COUNTS`
- `TWITTER_SEARCH_SPACES`
- `TWITTER_SEND_A_NEW_MESSAGE_TO_A_USER`
- `TWITTER_SEND_DM_TO_CONVERSATION`
- `TWITTER_STREAM_POST_LABELS`
- `TWITTER_UNFOLLOW_LIST`
- `TWITTER_UNFOLLOW_USER`
- `TWITTER_UNLIKE_POST`
- `TWITTER_UNMUTE_USER`
- `TWITTER_UNPIN_LIST`
- `TWITTER_UNRETWEET_POST`
- `TWITTER_UPDATE_LIST`
- `TWITTER_UPLOAD_LARGE_MEDIA`
- `TWITTER_UPLOAD_MEDIA`
- `TWITTER_USER_HOME_TIMELINE_BY_USER_ID`
- `TWITTER_USER_LIKE_POST`
- `TWITTER_USER_LOOKUP_BY_USERNAME`
- `TWITTER_USER_LOOKUP_BY_USERNAMES`
- `TWITTER_USER_LOOKUP_ME`
