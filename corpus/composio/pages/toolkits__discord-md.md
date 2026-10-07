---
url: https://docs.composio.dev/toolkits/discord.md
title: https://docs.composio.dev/toolkits/discord.md
description: 
status: 200
---

\# Discord

An instant messaging and VoIP social platform.

\- \*\*Category:\*\* team chat
\- \*\*Auth:\*\* OAUTH2
\- \*\*Composio-managed OAuth available?\*\* Yes
\- \*\*Tools:\*\* 28
\- \*\*Triggers:\*\* 1
\- \*\*Slug:\*\* \`DISCORD\`
\- \*\*Version:\*\* 20260826\_00

\## Tools

\### Consume Entitlement (Deprecated)

\*\*Slug:\*\* \`DISCORD\_CONSUME\_ENTITLEMENT\`

DEPRECATED: This Discord endpoint requires a bot token and cannot be used by an OAuth2 user connection. This legacy action is retained for existing Discord bearer-token connections until an equivalent Discord Bot action is available.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`application\_id\` \| string \| Yes \| The ID of the application that owns the entitlement. \|
\| \`entitlement\_id\` \| string \| Yes \| The ID of the entitlement to mark as consumed. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Test Entitlement (Deprecated)

\*\*Slug:\*\* \`DISCORD\_DELETE\_TEST\_ENTITLEMENT\`

DEPRECATED: This Discord endpoint requires a bot token and cannot be used by an OAuth2 user connection. This legacy action is retained for existing Discord bearer-token connections until an equivalent Discord Bot action is available.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`application\_id\` \| string \| Yes \| The ID of the application that owns the test entitlement. \|
\| \`entitlement\_id\` \| string \| Yes \| The ID of the test entitlement to delete. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete User Application Role Connection

\*\*Slug:\*\* \`DISCORD\_DELETE\_USER\_APPLICATION\_ROLE\_CONNECTION\`

Deletes the current user's application role connection for the specified application. Removes the platform metadata and linked role connection.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`application\_id\` \| string \| Yes \| The ID of the application to delete the role connection for. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Edit Application Command Permissions

\*\*Slug:\*\* \`DISCORD\_EDIT\_APPLICATION\_COMMAND\_PERMISSIONS\`

Edits the permissions for a specific application command in a guild. Requires OAuth2 Bearer token (bot tokens will error). The authorizing user must have MANAGE\_GUILD and MANAGE\_ROLES permissions in the target guild.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`guild\_id\` \| string \| Yes \| The unique identifier (snowflake ID) of the guild. \|
\| \`command\_id\` \| string \| Yes \| The unique identifier (snowflake ID) of the application command. \|
\| \`permissions\` \| array \| Yes \| List of permission overrides to set for the command in the guild. \|
\| \`application\_id\` \| string \| Yes \| The unique identifier (snowflake ID) of the application. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Application Command Permissions

\*\*Slug:\*\* \`DISCORD\_GET\_APPLICATION\_COMMAND\_PERMISSIONS\`

Retrieves the permissions for a specific application command in a guild. Requires OAuth2 Bearer token (bot tokens will error). The authorizing user must have MANAGE\_GUILD and MANAGE\_ROLES permissions in the target guild.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`guild\_id\` \| string \| Yes \| The unique identifier (snowflake ID) of the guild. \|
\| \`command\_id\` \| string \| Yes \| The unique identifier (snowflake ID) of the application command. \|
\| \`application\_id\` \| string \| Yes \| The unique identifier (snowflake ID) of the application. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Batch Application Command Permissions

\*\*Slug:\*\* \`DISCORD\_GET\_BATCH\_APPLICATION\_COMMAND\_PERMISSIONS\`

Retrieves permissions for all commands of an application in a guild. Returns a list of permission objects for each command. Requires OAuth2 Bearer token (Bot tokens will error).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`guild\_id\` \| string \| Yes \| The ID of the guild. \|
\| \`application\_id\` \| string \| Yes \| The ID of the application. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Current User Application Entitlements

\*\*Slug:\*\* \`DISCORD\_GET\_CURRENT\_USER\_APPLICATION\_ENTITLEMENTS\`

Retrieves entitlements for the current user and application. The optional guild\_id filter is enforced locally because Discord does not expose that filter on this current-user route.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Retrieve entitlements after this entitlement ID (snowflake). Used for forward pagination. \|
\| \`limit\` \| integer \| No \| Maximum number of entitlements to return (1-100, default 100). \|
\| \`before\` \| string \| No \| Retrieve entitlements before this entitlement ID (snowflake). Used for backward pagination. \|
\| \`sku\_ids\` \| array \| No \| Optional list of SKU IDs to filter entitlements by. \|
\| \`guild\_id\` \| string \| No \| Optional guild ID to filter entitlements by; only returns entitlements granted for that guild. \|
\| \`exclude\_ended\` \| boolean \| No \| Whether ended entitlements should be omitted. Defaults to false. \|
\| \`application\_id\` \| string \| Yes \| The ID of the application to retrieve entitlements for. \|
\| \`exclude\_deleted\` \| boolean \| No \| Whether deleted entitlements should be omitted. Defaults to true. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Gateway

\*\*Slug:\*\* \`DISCORD\_GET\_GATEWAY\`

Tool to retrieve a valid WebSocket (wss) URL for establishing a Gateway connection to Discord. Use when you need to connect to the Discord Gateway for real-time events.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Guild Template

\*\*Slug:\*\* \`DISCORD\_GET\_GUILD\_TEMPLATE\`

Tool to retrieve information about a Discord guild template using its unique template code. Use when you need to get details about a guild template for creating new servers.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`code\` \| string \| Yes \| The unique template code identifier for the guild template to retrieve. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Guild Widget

\*\*Slug:\*\* \`DISCORD\_GET\_GUILD\_WIDGET\`

Tool to retrieve the guild widget in JSON format. Use when you need to get public information about a Discord guild's widget that can be displayed on external websites. The widget must be enabled in the guild's server settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`guild\_id\` \| string \| Yes \| The unique identifier of the guild (snowflake ID). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Guild Widget PNG

\*\*Slug:\*\* \`DISCORD\_GET\_GUILD\_WIDGET\_PNG\`

Tool to retrieve a PNG image widget for a Discord guild. Use when you need a visual representation of the guild widget that can be displayed on external websites. The widget must be enabled in the guild's server settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`style\` \| string ("shield" \| "banner1" \| "banner2" \| "banner3" \| "banner4") \| No \| Customizes the visual appearance of the widget image. Options: 'shield' (compact badge-style), 'banner1', 'banner2', 'banner3', 'banner4' (various horizontal banner formats). \|
\| \`guild\_id\` \| string \| Yes \| The unique identifier of the guild (snowflake ID). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Invite (Deprecated)

\*\*Slug:\*\* \`DISCORD\_GET\_INVITE\`

DEPRECATED: Use DISCORD\_INVITE\_RESOLVE instead. Tool to retrieve information about a specific invite code. Use when you need to get details about a guild or channel associated with an invite. Response may be null or partial for expired, revoked, or inaccessible invites; do not infer guild membership or channel access from the response.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`invite\_code\` \| string \| Yes \| A single Discord invite code (e.g., "0vCdhLbwjZZTWZLD"). Can be provided as a bare code or as a full URL like "https://discord.gg/0vCdhLbwjZZTWZLD". Only one invite code should be provided. If multiple codes or URLs are present, only the first one will be used. \|
\| \`with\_counts\` \| boolean \| No \| Whether to include approximate member and presence counts in the response (approximate\_member\_count and approximate\_presence\_count fields). \|
\| \`with\_expiration\` \| boolean \| No \| Whether to include the expiration date (expires\_at field) in the response. Note: expires\_at is typically returned regardless of this parameter. \|
\| \`guild\_scheduled\_event\_id\` \| string \| No \| The ID of a guild scheduled event to include with the invite. When provided, the response will include guild\_scheduled\_event details. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get my guild member

\*\*Slug:\*\* \`DISCORD\_GET\_MY\_GUILD\_MEMBER\`

Retrieves the guild member object for the currently authenticated user within a specified guild, including roles, nickname, join date, and permissions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`guild\_id\` \| string \| Yes \| The unique identifier (snowflake ID) of the Discord guild (server) from which to fetch the member object. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get my OAuth2 authorization

\*\*Slug:\*\* \`DISCORD\_GET\_MY\_OAUTH2\_AUTHORIZATION\`

Retrieves current OAuth2 authorization details for the application, including app info, scopes, token expiration, and user data (contingent on scopes like 'identify').

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get My User

\*\*Slug:\*\* \`DISCORD\_GET\_MY\_USER\`

Fetches comprehensive profile information for the currently authenticated Discord user, including email if the 'email' scope is granted.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get OpenID Connect userinfo

\*\*Slug:\*\* \`DISCORD\_GET\_OPENID\_CONNECT\_USERINFO\`

Retrieve OpenID Connect compliant user information for the authenticated user. Returns standardized OIDC user claims (sub, email, nickname, picture, locale, etc.) following the OpenID Connect specification. Requires OAuth2 access token with 'openid' scope; additional fields require 'identify' and 'email' scopes.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Public Keys

\*\*Slug:\*\* \`DISCORD\_GET\_PUBLIC\_KEYS\`

Tool to retrieve Discord OAuth2 public keys. Use when you need to verify OAuth2 tokens or access public keys for cryptographic operations.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get SKU Subscription

\*\*Slug:\*\* \`DISCORD\_GET\_SKU\_SUBSCRIPTION\`

Retrieves a specific subscription by ID for a given SKU. Use to check details of a single user subscription.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sku\_id\` \| string \| Yes \| The ID of the SKU the subscription belongs to. \|
\| \`subscription\_id\` \| string \| Yes \| The ID of the subscription to retrieve. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User

\*\*Slug:\*\* \`DISCORD\_GET\_USER\`

Retrieve information about a Discord user. With OAuth Bearer token authentication, this returns the authenticated user's information (use '@me'). With Bot token authentication, you can query any user by their ID. Use this when you need user details like username, avatar, email (if email scope is granted), locale, premium status, or other profile information.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| Yes \| The ID of the user to retrieve. Use '@me' to get the current authenticated user. Note: With OAuth Bearer token authentication, only '@me' is supported. With Bot token authentication, you can query any user ID (snowflake format). If you're unsure, start with '@me'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User Application Role Connection

\*\*Slug:\*\* \`DISCORD\_GET\_USER\_APPLICATION\_ROLE\_CONNECTION\`

Retrieves the application role connection for the currently authenticated user for a specified application. Requires the role\_connections.write OAuth2 scope.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`application\_id\` \| string \| Yes \| The unique identifier (snowflake ID) of the application to get the role connection for. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Resolve Invite

\*\*Slug:\*\* \`DISCORD\_INVITE\_RESOLVE\`

Tool to resolve and retrieve information about a Discord invite code. Use when you need to get details about a guild, channel, or event associated with an invite code.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`code\` \| string \| Yes \| The invite code to resolve (e.g., "discord-api" for vanity URLs, "abc123xyz" for regular invite codes, or a full URL like "https://discord.gg/abc123xyz"). \|
\| \`with\_counts\` \| boolean \| No \| Whether to include approximate member counts (approximate\_member\_count and approximate\_presence\_count) in the response. \|
\| \`with\_expiration\` \| boolean \| No \| Whether to include the expiration date (expires\_at) in the response. Note: This parameter is deprecated as expires\_at is now always returned. \|
\| \`guild\_scheduled\_event\_id\` \| string \| No \| The guild scheduled event ID to include with the invite. When provided with a valid event ID, returns guild\_scheduled\_event data in the response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Leave Guild (Deprecated)

\*\*Slug:\*\* \`DISCORD\_LEAVE\_GUILD\`

DEPRECATED: This endpoint requires a bot token. Use DISCORDBOT\_LEAVE\_GUILD with a Discord Bot connection instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`guild\_id\` \| string \| Yes \| The unique identifier (snowflake ID) of the guild to leave. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List My Connections

\*\*Slug:\*\* \`DISCORD\_LIST\_MY\_CONNECTIONS\`

Retrieves a list of the authenticated user's connected third-party accounts on Discord.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List My Guilds

\*\*Slug:\*\* \`DISCORD\_LIST\_MY\_GUILDS\`

Lists the current user's guilds, returning partial data for each; primarily used for displaying server lists or verifying memberships.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Get guilds after this guild ID. \|
\| \`limit\` \| integer \| No \| Max number of guilds to return (1-200, default 200). \|
\| \`before\` \| string \| No \| Get guilds before this guild ID. \|
\| \`with\_counts\` \| boolean \| No \| Include approximate member and presence counts for each guild. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List SKU Subscriptions

\*\*Slug:\*\* \`DISCORD\_LIST\_SKU\_SUBSCRIPTIONS\`

Lists all subscriptions for a given SKU. When using a Bot token, the user\_id query parameter is required. Returns paginated subscription objects.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Retrieve subscriptions after this subscription ID for forward pagination. \|
\| \`limit\` \| integer \| No \| Maximum number of subscriptions to return (1-100, default 100). \|
\| \`before\` \| string \| No \| Retrieve subscriptions before this subscription ID for backward pagination. \|
\| \`sku\_id\` \| string \| Yes \| The ID of the SKU to list subscriptions for. \|
\| \`user\_id\` \| string \| No \| The user ID to filter subscriptions for. Required when using a Bot token; not needed for OAuth2. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Sticker Packs

\*\*Slug:\*\* \`DISCORD\_LIST\_STICKER\_PACKS\`

Tool to retrieve all available Discord Nitro sticker packs. Use when you need to list or browse official Discord sticker packs.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Modify Current User (Deprecated)

\*\*Slug:\*\* \`DISCORD\_MODIFY\_CURRENT\_USER\`

DEPRECATED: This endpoint requires a bot token. Use DISCORDBOT\_UPDATE\_MY\_USER with a Discord Bot connection instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`avatar\` \| string \| No \| New avatar as a base64-encoded image data URI (e.g., 'data:image/png;base64,...'). \|
\| \`username\` \| string \| No \| New username for the user. Limited to 2 changes per hour by Discord. \|
\| \`remove\_avatar\` \| boolean \| No \| Set to true to remove the user's avatar (sends null to Discord API). Cannot be used together with avatar. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update User Application Role Connection

\*\*Slug:\*\* \`DISCORD\_UPDATE\_USER\_APPLICATION\_ROLE\_CONNECTION\`

Updates the application role connection for the currently authenticated user for a specified application. Requires the role\_connections.write OAuth2 scope.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`metadata\` \| object \| No \| Object mapping application role connection metadata keys to their string-ified values. \|
\| \`platform\_name\` \| string \| No \| The vanity name of the platform a bot has connected (max 50 characters). \|
\| \`application\_id\` \| string \| Yes \| The unique identifier (snowflake ID) of the application to update the role connection for. \|
\| \`platform\_username\` \| string \| No \| The username on the platform a bot has connected (max 100 characters). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\## Triggers

\### New Discord Message Trigger

\*\*Slug:\*\* \`DISCORD\_NEW\_MESSAGE\_TRIGGER\`

\*\*Type:\*\* poll

Polls a specific Discord channel for new messages.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`channel\_id\` \| string \| Yes \| The ID of the Discord channel to monitor for new messages. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`limit\` \| integer \| No \| The number of messages to fetch per poll. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| No \| Type of Discord message event \|
\| \`message\` \| object \| Yes \| The Discord message that was created \|
