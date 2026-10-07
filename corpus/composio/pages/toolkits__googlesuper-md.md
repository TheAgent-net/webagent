---
url: https://docs.composio.dev/toolkits/googlesuper.md
title: https://docs.composio.dev/toolkits/googlesuper.md
description: 
status: 200
---

\# Google Super

Google Super App combines all Google services including Drive, Calendar, Gmail, Sheets, Analytics, Ads, and more, providing a unified platform for seamless integration and management of your digital life.

\- \*\*Category:\*\* file management & storage
\- \*\*Auth:\*\* OAUTH2, API\_KEY
\- \*\*Composio-managed OAuth available?\*\* Yes
\- \*\*Tools:\*\* 467
\- \*\*Triggers:\*\* 20
\- \*\*Slug:\*\* \`GOOGLESUPER\`
\- \*\*Version:\*\* 20260828\_00

\## Frequently Asked Questions

\### How do I set up custom Google OAuth credentials for Google Super?

For a step-by-step guide on creating and configuring your own Google OAuth credentials with Composio, see \[How to create OAuth2 credentials for Google Apps\](https://composio.dev/auth/googleapps).

\### Why am I seeing "App is blocked" when connecting Google Super?

Google Super requires broad Google Workspace scopes for some cross-product workflows, and some of those scopes are not available on Composio-managed Google Super auth today. If users see Google's "App is blocked" or unverified-app screen with managed Google Super auth, use your own verified Google OAuth app and reconnect through a custom auth config.

Composio is working on getting the managed Google Super app approved for the needed scopes, but until that is complete, custom Google OAuth is the workaround for production usage. See \[How to create OAuth2 credentials for Google Apps\](https://composio.dev/auth/googleapps).

\### Why am I getting the "API has not been used in project" error?

When using custom OAuth credentials, the required Google API must be enabled in the Google Cloud project that owns those credentials. Enable it in Google Cloud Console under APIs & Services, wait a few minutes, and retry.

\### Why am I getting "Error 400: invalid\_scope"?

The requested scopes are invalid or incorrectly formatted in the authorization URL. Verify your scope values against the \[Google OAuth scopes docs\](https://developers.google.com/identity/protocols/oauth2). If you're creating auth configs programmatically, see the \[programmatic auth config guide\](/docs/authentication/programmatic-auth-configs).

\### Why does the OAuth consent screen show "Composio" instead of my app?

By default, the consent screen uses Composio's OAuth app. To show your own app name and logo, create your own OAuth app and set a custom redirect URL. See \[White-labeling authentication\](/docs/authentication/white-labeling-authentication#using-your-own-oauth-apps).

\## Tools

\### Delete ACL Rule

\*\*Slug:\*\* \`GOOGLESUPER\_ACL\_DELETE\`

Deletes an access control rule from a Google Calendar. Use when you need to remove sharing permissions for a user, group, or domain.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rule\_id\` \| string \| Yes \| ACL rule identifier. \|
\| \`calendar\_id\` \| string \| Yes \| Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get ACL Rule

\*\*Slug:\*\* \`GOOGLESUPER\_ACL\_GET\`

Retrieves a specific access control rule for a calendar. Use when you need to check permissions for a specific user, group, or domain.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rule\_id\` \| string \| Yes \| ACL rule identifier. Format: 'scope\_type:scope\_value' or 'default'. Valid scope types: 'user' (email), 'group' (group email), 'domain' (domain name), 'default' (public access). Examples: 'user:john@example.com', 'group:team@example.com', 'domain:example.com', 'default'. Note: 'me' is NOT valid; use actual email/domain. The rule must exist - use GOOGLECALENDAR\_LIST\_ACL\_RULES to find valid IDs. \|
\| \`calendar\_id\` \| string \| Yes \| Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create ACL Rule

\*\*Slug:\*\* \`GOOGLESUPER\_ACL\_INSERT\`

Creates an access control rule for a calendar. Use when you need to grant sharing permissions to a user, group, or domain.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`role\` \| string ("none" \| "freeBusyReader" \| "reader" \| "writer" \| "owner") \| Yes \| The role assigned to the scope. Possible values: "none" - Provides no access; "freeBusyReader" - Provides read access to free/busy information; "reader" - Provides read access to the calendar; "writer" - Provides read and write access to the calendar; "owner" - Provides ownership of the calendar. \|
\| \`scope\` \| object \| Yes \| The extent to which calendar access is granted by this ACL rule. Specifies who gets the access (user, group, domain, or default). \|
\| \`calendar\_id\` \| string \| Yes \| Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. \|
\| \`send\_notifications\` \| boolean \| No \| Whether to send notifications about the calendar sharing change. Optional. The default is true. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List ACL Rules

\*\*Slug:\*\* \`GOOGLESUPER\_ACL\_LIST\`

Retrieves the list of access control rules (ACLs) for a specified calendar, providing the necessary 'rule\_id' values required for updating specific ACL rules.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageToken\` \| string \| No \| Token specifying which result page to return. Optional. \|
\| \`syncToken\` \| string \| No \| Token obtained from the nextSyncToken field returned on the last page of a previous list operation. It makes the result of this list operation contain only entries that have changed since then. Optional. The default is to retrieve all entries. \|
\| \`calendarId\` \| string \| Yes \| Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. \|
\| \`maxResults\` \| integer \| No \| Maximum number of entries returned on one result page. Optional. The default is 100. \|
\| \`showDeleted\` \| boolean \| No \| Whether to include deleted ACLs in the result. Optional. The default is False. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Patch ACL Rule

\*\*Slug:\*\* \`GOOGLESUPER\_ACL\_PATCH\`

Updates an existing access control rule for a calendar using patch semantics (partial update). This allows modifying specific fields without affecting other properties. IMPORTANT: The ACL rule must already exist on the calendar. This action cannot create new rules. If you receive a 404 Not Found error, the rule does not exist - use ACL insert to create it first, or use ACL list to verify available rules. Each patch request consumes three quota units. For domain-type ACL rules, if PATCH fails with 500 error, this action will automatically fallback to UPDATE method.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`role\` \| string \| No \| The role assigned to the scope. Possible values are: "none" - Provides no access; "freeBusyReader" - Provides read access to free/busy information; "reader" - Provides read access to the calendar (private events appear but details are hidden); "writer" - Provides read and write access to the calendar (private events and details are visible); "owner" - Provides ownership of the calendar (all permissions of writer plus ability to see and manipulate ACLs). \|
\| \`scope\` \| object \| No \| The extent to which calendar access is granted by this ACL rule. Optional for patch operations. Must include \`type\` (one of: 'user', 'group', 'domain', 'default') and \`value\` (email address or domain name) for all types except 'default'. \|
\| \`rule\_id\` \| string \| Yes \| ACL rule identifier of an existing rule. IMPORTANT: The rule must already exist on the calendar - this action cannot create new rules, only modify existing ones. Use the ACL list action to find existing rule IDs, or use the ACL insert action to create a new rule first. Format: 'type:value', such as 'user:email@example.com' or 'group:group@example.com'. \|
\| \`calendar\_id\` \| string \| Yes \| Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. \|
\| \`send\_notifications\` \| boolean \| No \| Whether to send notifications about the calendar sharing change. Note that there are no notifications on access removal. Optional. The default is True. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update ACL Rule

\*\*Slug:\*\* \`GOOGLESUPER\_ACL\_UPDATE\`

Updates an access control rule for the specified calendar.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`role\` \| string \| Yes \| The role assigned to the scope. Possible values are: - "none" - Provides no access. - "freeBusyReader" - Provides read access to free/busy information. - "reader" - Provides read access to the calendar. Private events will appear to users with reader access, but event details will be hidden. - "writer" - Provides read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible. - "owner" - Provides ownership of the calendar. This role has all of the permissions of the writer role with the additional ability to see and manipulate ACLs. \|
\| \`rule\_id\` \| string \| Yes \| ACL rule identifier. \|
\| \`calendar\_id\` \| string \| Yes \| Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. \|
\| \`send\_notifications\` \| boolean \| No \| Whether to send notifications about the calendar sharing change. Note that there are no notifications on access removal. Optional. The default is True. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Watch ACL Changes

\*\*Slug:\*\* \`GOOGLESUPER\_ACL\_WATCH\`

Tool to watch for changes to ACL resources. Use when you need to set up real-time notifications for access control list modifications on a calendar.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| A UUID or similar unique string that identifies this channel. \|
\| \`type\` \| string \| No \| The type of delivery mechanism used for this channel. Valid values are "web\_hook" or "webhook". \|
\| \`token\` \| string \| No \| An arbitrary string delivered to the target address with each notification delivered over this channel. Optional. \|
\| \`params\` \| object \| No \| Additional parameters controlling delivery channel behavior. Optional. \|
\| \`address\` \| string \| Yes \| The address where notifications are delivered for this channel. \|
\| \`calendarId\` \| string \| Yes \| Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add Enrichment

\*\*Slug:\*\* \`GOOGLESUPER\_ADD\_ENRICHMENT\`

Adds an enrichment at a specified position in a defined album.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`albumId\` \| string \| Yes \| Identifier of the album where the enrichment is to be added \|
\| \`albumPosition\` \| object \| Yes \| Position in the album where the enrichment is to be inserted. Required field with valid position types: FIRST\_IN\_ALBUM, LAST\_IN\_ALBUM, AFTER\_MEDIA\_ITEM (requires relativeMediaItemId), AFTER\_ENRICHMENT\_ITEM (requires relativeEnrichmentItemId) \|
\| \`newEnrichmentItem\` \| object \| Yes \| The enrichment to be added, can be a text, location, or map enrichment \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add file sharing preference (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_ADD\_FILE\_SHARING\_PREFERENCE\`

DEPRECATED: Use GOOGLEDRIVE\_CREATE\_PERMISSION instead; use GOOGLEDRIVE\_UPDATE\_PERMISSION to modify existing permissions (avoids duplicate entries). Modifies sharing permissions for an existing Google Drive file, granting a specified role to a user, group, domain, or 'anyone'. Bulk calls may trigger 403 rateLimitExceeded (~100 req/100s/user); use jittered exponential backoff.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`role\` \| string ("owner" \| "organizer" \| "fileOrganizer" \| "writer" \| "commenter" \| "reader") \| Yes \| Permission role to grant. Accepted values: 'reader', 'commenter', 'writer', 'fileOrganizer', 'organizer', 'owner'. Invalid strings cause validation failures. \|
\| \`type\` \| string ("user" \| "group" \| "domain" \| "anyone") \| Yes \| Type of grantee for the permission. Using 'anyone' with 'writer' or 'owner' broadly exposes the document — confirm before applying. Admin policies may block 'anyone' or domain-wide sharing. For type='anyone' with role='reader', the link must be explicitly shared; files are not publicly searchable. \|
\| \`domain\` \| string \| No \| Domain to grant permission to (e.g., 'example.com'). Required if 'type' is 'domain'. \|
\| \`file\_id\` \| string \| Yes \| Unique identifier of the file to update sharing settings for. Must be an alphanumeric string containing only letters, numbers, hyphens, and underscores (no slashes, spaces, or other special characters). Use GOOGLEDRIVE\_FIND\_FILE or GOOGLEDRIVE\_LIST\_FILES to get valid file IDs from your Google Drive. For shared drive membership, supply the shared drive ID, not an individual document ID. \|
\| \`email\_address\` \| string \| No \| Email address of the user or group. Required if 'type' is 'user' or 'group'. \|
\| \`transfer\_ownership\` \| boolean \| No \| Whether to transfer ownership to the specified user. Required when role is 'owner'. Only a single user can be specified in the request when transferring ownership. Ownership transfer is difficult to reverse — obtain explicit confirmation before setting true. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Modify email labels

\*\*Slug:\*\* \`GOOGLESUPER\_ADD\_LABEL\_TO\_EMAIL\`

Adds and/or removes specified Gmail labels for a message; ensure \`message\_id\` and all \`label\_ids\` are valid (use 'listLabels' for custom label IDs).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| User's email address or 'me' for the authenticated user. \|
\| \`message\_id\` \| string \| Yes \| Immutable ID of the message to modify. Gmail message IDs are hexadecimal strings (e.g., '1a2b3c4d5e6f7890'). IMPORTANT: Do NOT use UUIDs (32-character strings like '093ca4662b214d5eba8f4ceeaad63433'), thread IDs, or internal system IDs - these will cause 'Invalid id value' errors. Obtain valid message IDs from: (1) 'GMAIL\_FETCH\_EMAILS' response 'messageId' field, (2) 'GMAIL\_FETCH\_MESSAGE\_BY\_THREAD\_ID' response, or (3) 'GMAIL\_LIST\_THREADS' and then fetching thread messages. \|
\| \`add\_label\_ids\` \| array \| No \| Label IDs to add (IDs, not display names). System labels: INBOX, SPAM, TRASH, UNREAD, STARRED, IMPORTANT, CATEGORY\_PERSONAL, CATEGORY\_SOCIAL, CATEGORY\_PROMOTIONS, CATEGORY\_UPDATES, CATEGORY\_FORUMS. Use full CATEGORY\_ prefix (e.g., 'CATEGORY\_UPDATES' not 'UPDATES'). Custom labels: call 'listLabels' first to get the ID (format: 'Label\_'). Do NOT use the label display name; the API requires the ID. SENT, DRAFT, CHAT are immutable and cannot be added or removed. A label cannot appear in both add\_label\_ids and remove\_label\_ids. \|
\| \`remove\_label\_ids\` \| array \| No \| Label IDs to remove (IDs, not display names). System labels: INBOX, SPAM, TRASH, UNREAD, STARRED, IMPORTANT, CATEGORY\_PERSONAL, CATEGORY\_SOCIAL, CATEGORY\_PROMOTIONS, CATEGORY\_UPDATES, CATEGORY\_FORUMS. Use full CATEGORY\_ prefix (e.g., 'CATEGORY\_UPDATES' not 'UPDATES'). Custom labels: call 'listLabels' first to get the ID (format: 'Label\_'). SENT, DRAFT, CHAT are immutable and cannot be removed. Common operations: to mark as read, remove 'UNREAD'; to archive, remove 'INBOX'. A label cannot appear in both add\_label\_ids and remove\_label\_ids. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add or remove to customer list

\*\*Slug:\*\* \`GOOGLESUPER\_ADD\_OR\_REMOVE\_TO\_CUSTOMER\_LIST\`

Adds or removes contacts from a Google Ads customer list (UserList/audience/remarketing list), not a Google Ads customer account. Note: It takes 6 to 12 hours for changes to be reflected in the customer list. Email addresses must comply with Google Ads policies and applicable privacy/consent laws.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`emails\` \| array \| Yes \| Array of emails of contacts to add to or remove from the customer list. Emails must be valid, normalized strings (lowercase, trimmed); malformed addresses reduce match rates. \|
\| \`operation\` \| string ("create" \| "remove") \| No \| Operation to perform on the customer list (UserList/audience list). Either create or remove. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`resource\_name\` \| string \| Yes \| Resource name of the customer list (UserList/audience list), not an account. For example: customers/1234567890/userLists/1234567890. For account-owned resources, use the same customer ID as the tool call's customer\_id; in MCC workflows, this is the child/sub-account ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert File Parent (v2)

\*\*Slug:\*\* \`GOOGLESUPER\_ADD\_PARENT\`

Tool to add a parent folder for a file using Google Drive API v2. Use when you need to add a file to an additional folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The ID of the parent folder to add. This is the folder that will become a parent of the file. \|
\| \`fileId\` \| string \| Yes \| The ID of the file to add a parent folder to. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Default is false. \|
\| \`supportsTeamDrives\` \| boolean \| No \| Deprecated: Use supportsAllDrives instead. \|
\| \`enforceSingleParent\` \| boolean \| No \| Deprecated: Adding files to multiple folders is no longer supported. Use shortcuts instead. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert Property (v2 API)

\*\*Slug:\*\* \`GOOGLESUPER\_ADD\_PROPERTY\`

Tool to add a property to a file, or update it if it already exists (v2 API). Use when you need to attach custom key-value metadata to a Google Drive file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format values. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`fileId\` \| string \| Yes \| The ID of the file. \|
\| \`callback\` \| string \| No \| JSONP callback function name. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`visibility\` \| string ("PRIVATE" \| "PUBLIC") \| No \| Property visibility values. \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`property\_key\` \| string \| Yes \| The key of this property. \|
\| \`property\_value\` \| string \| Yes \| The value of this property. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add Sheet to Existing Spreadsheet

\*\*Slug:\*\* \`GOOGLESUPER\_ADD\_SHEET\`

Adds a new sheet to a spreadsheet. Supports three sheet types: GRID, OBJECT, and DATA\_SOURCE. SHEET TYPES: - GRID (default): Standard spreadsheet with rows/columns. Use properties to set dimensions, tab color, etc. - OBJECT: Sheet containing a chart. Requires objectSheetConfig with chartSpec (basicChart or pieChart). - DATA\_SOURCE: Sheet connected to BigQuery. Requires dataSourceConfig with bigQuery spec and bigquery.readonly OAuth scope. OTHER NOTES: - Sheet names must be unique; use forceUnique=true to auto-append suffix (\_2, \_3) if name exists - For tab colors, use EITHER rgbColor OR themeColor, not both - Avoid 'index' when creating sheets in parallel (causes errors) - OBJECT sheets are created via addChart with position.newSheet=true - DATA\_SOURCE sheets require bigquery.readonly OAuth scope Use cases: Add standard grid sheet, create chart on dedicated sheet, connect to BigQuery data source.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| No \| The name for the new sheet tab. Must be unique within the spreadsheet. Example: "Q3 Report", "Sales Data 2025". This is a convenience parameter - alternatively, you can set this via properties.title. Note: sheet\_name is also accepted as an alias for title. \|
\| \`properties\` \| object \| No \| Advanced sheet properties (grid dimensions, tab color, position, etc.). For simple cases, just use the 'title' parameter directly. Use this for additional customization. \|
\| \`force\_unique\` \| boolean \| No \| When True (default), automatically ensures the sheet name is unique by appending a numeric suffix (e.g., '\_2', '\_3') if the requested name already exists. This makes the action resilient to retries and parallel workflows. When False, the action fails with an error if a sheet with the same name already exists. \|
\| \`spreadsheet\_id\` \| string \| Yes \| REQUIRED. Cannot be empty. The ID of the target spreadsheet where the new sheet will be added. This is the long alphanumeric string in the Google Sheet URL (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'). Use 'Search Spreadsheets' action to find the spreadsheet ID by name if you don't have it. \|
\| \`data\_source\_config\` \| object \| No \| Configuration for creating a DATA\_SOURCE sheet. DATA\_SOURCE sheets connect to external data sources like BigQuery. The API uses addDataSource request which automatically creates the associated sheet. IMPORTANT: Requires additional OAuth scope: bigquery.readonly \|
\| \`object\_sheet\_config\` \| object \| No \| Configuration for creating an OBJECT sheet (a sheet containing a chart). To create an OBJECT sheet, you must provide chart configuration. The API uses addChart with position.newSheet=true to create the chart on its own sheet. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Aggregate Column Data

\*\*Slug:\*\* \`GOOGLESUPER\_AGGREGATE\_COLUMN\_DATA\`

Searches for rows where a specific column matches a value and performs mathematical operations on data from another column.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operation\` \| string ("sum" \| "average" \| "count" \| "min" \| "max" \| "percentage") \| Yes \| The mathematical operation to perform on the target column values. \|
\| \`sheet\_name\` \| string \| Yes \| The name of the specific sheet within the spreadsheet. Matching is case-insensitive. If no exact match is found, partial matches will be attempted (e.g., 'overview' will match 'Overview 2025'). \|
\| \`search\_value\` \| string \| No \| The exact value to search for in the search column. Case-sensitive by default. If not provided (or if search\_column is not provided), all rows in the target column will be aggregated without filtering. \|
\| \`search\_column\` \| string \| No \| The column to search in for filtering rows. Can be a letter (e.g., 'A', 'B') or column name from header row (e.g., 'Region', 'Department'). If not provided, all rows in the target column will be aggregated without filtering. \|
\| \`target\_column\` \| string \| Yes \| The column to aggregate data from. Can be a letter (e.g., 'C', 'D') or column name from header row (e.g., 'Sales', 'Revenue'). \|
\| \`case\_sensitive\` \| boolean \| No \| Whether the search should be case-sensitive. \|
\| \`has\_header\_row\` \| boolean \| No \| Whether the first row contains column headers. If True, column names can be used for search\_column and target\_column. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Sheets spreadsheet. \|
\| \`percentage\_total\` \| number \| No \| For percentage operation, the total value to calculate percentage against. If not provided, uses sum of all values in target column. \|
\| \`additional\_filters\` \| array \| No \| Extra column=value conditions applied with AND logic on top of search\_column/search\_value. Use this to filter on multiple columns simultaneously. Example: \[{"column": "Region", "value": "APAC"}\] combined with search\_column=Product/search\_value=Beacon returns only rows where Product=Beacon AND Region=APAC. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Append Dimension

\*\*Slug:\*\* \`GOOGLESUPER\_APPEND\_DIMENSION\`

Tool to append new rows or columns to a sheet, increasing its size. Use when you need to add empty rows or columns to an existing sheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`length\` \| integer \| Yes \| The number of rows or columns to append. \|
\| \`sheet\_id\` \| integer \| Yes \| The numeric ID of the sheet (not the sheet name). This is a non-negative integer found in the sheet's URL as the 'gid' parameter (e.g., gid=0) or in the sheet properties. The first sheet in a spreadsheet typically has sheet\_id=0. \|
\| \`dimension\` \| string ("ROWS" \| "COLUMNS") \| Yes \| Specifies whether to append rows or columns. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The ID of the spreadsheet. \|
\| \`response\_ranges\` \| array \| No \| Limits the ranges of the spreadsheet to include in the response. \|
\| \`response\_include\_grid\_data\` \| boolean \| No \| True if grid data should be included in the response (if includeSpreadsheetInResponse is true). \|
\| \`include\_spreadsheet\_in\_response\` \| boolean \| No \| True if the updated spreadsheet should be included in the response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Archive Custom Dimension

\*\*Slug:\*\* \`GOOGLESUPER\_ARCHIVE\_CUSTOM\_DIMENSION\`

Tool to archive a CustomDimension on a property. Use when you need to remove a custom dimension from active use without permanently deleting it. Archived dimensions cannot be used in new reports.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. The resource name of the CustomDimension to archive. Must be in the exact format: properties/{property\_id}/customDimensions/{dimension\_id} where property\_id and dimension\_id are numeric identifiers. IMPORTANT: Must start with 'properties/' prefix, contain '/customDimensions/' in the middle, have no trailing slashes, and no additional path segments. Valid example: 'properties/489591273/customDimensions/13661259421'. Invalid examples: '489591273/13661259421' (missing prefix), 'properties/489591273/customDimensions/13661259421/' (trailing slash), 'properties/489591273/customDimensions/13661259421/extra' (extra segments) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Autocomplete Place Predictions

\*\*Slug:\*\* \`GOOGLESUPER\_AUTOCOMPLETE\`

Returns place and query predictions for text input. Use when implementing as-you-type autocomplete functionality for place searches. Returns up to five predictions ordered by relevance.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`input\` \| string \| Yes \| Text string to search for place predictions. Can be full words, substrings, place names, addresses, or plus codes. Must be non-empty. \|
\| \`origin\` \| object \| No \| Latitude/longitude point for distance calculations. \|
\| \`regionCode\` \| string \| No \| Region code in ccTLD format for formatting responses (e.g., 'us', 'br'). \|
\| \`inputOffset\` \| integer \| No \| Zero-based Unicode character offset of cursor position in the input string. \|
\| \`languageCode\` \| string \| No \| Preferred language for results using IETF BCP-47 language codes (e.g., 'en-US', 'es-ES'). \|
\| \`locationBias\` \| object \| No \| Area to bias search results toward. \|
\| \`sessionToken\` \| string \| No \| User-generated string grouping calls into sessions for billing purposes. \|
\| \`includedRegionCodes\` \| array \| No \| Up to 15 two-character country codes (ISO 3166-1 Alpha-2) to restrict results. Query predictions unavailable when this is set. \|
\| \`locationRestriction\` \| object \| No \| Area to restrict search results within. \|
\| \`includedPrimaryTypes\` \| array \| No \| Restricts results to up to five specified primary types (e.g., 'restaurant', 'cafe'). \|
\| \`includeQueryPredictions\` \| boolean \| No \| Includes query predictions in response for text searches (default: false). \|
\| \`includePureServiceAreaBusinesses\` \| boolean \| No \| Includes businesses without physical locations (default: false). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Auto-Resize Rows or Columns

\*\*Slug:\*\* \`GOOGLESUPER\_AUTO\_RESIZE\_DIMENSIONS\`

Auto-fit column widths or row heights for a dimension range using batchUpdate.autoResizeDimensions. Use when you need to automatically adjust row heights or column widths to fit content after writing data.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sheet\_id\` \| integer \| No \| The numeric ID of the sheet to resize. Either sheet\_id or sheet\_name must be provided. If both are provided, sheet\_name takes precedence and will be resolved to sheet\_id. \|
\| \`dimension\` \| string ("ROWS" \| "COLUMNS") \| Yes \| The dimension to auto-resize. Use 'ROWS' to auto-fit row heights or 'COLUMNS' to auto-fit column widths. \|
\| \`end\_index\` \| integer \| Yes \| The zero-based end index of the dimension range to resize (exclusive). Must be greater than start\_index. For example, to resize columns A-C, use start\_index=0 and end\_index=3. \|
\| \`sheet\_name\` \| string \| No \| The name of the sheet to resize. Either sheet\_id or sheet\_name must be provided. Using sheet\_name is recommended as it's more intuitive. If both sheet\_id and sheet\_name are provided, sheet\_name takes precedence. \|
\| \`start\_index\` \| integer \| Yes \| The zero-based start index of the dimension range to resize (inclusive). For columns, 0 = column A. For rows, 0 = row 1. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The ID of the spreadsheet containing the sheet to resize. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch Add Media Items

\*\*Slug:\*\* \`GOOGLESUPER\_BATCH\_ADD\_MEDIA\_ITEMS\`

Adds one or more media items to an album in Google Photos.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`albumId\` \| string \| Yes \| Identifier of the Album that the media items are added to. Must be an album created by this application. \|
\| \`mediaItemIds\` \| array \| Yes \| Identifiers of the MediaItems to be added. Maximum 50 items. Media items must be created by this application. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch Clear Values By Data Filter

\*\*Slug:\*\* \`GOOGLESUPER\_BATCH\_CLEAR\_VALUES\_BY\_DATA\_FILTER\`

Clears one or more ranges of values from a spreadsheet using data filters. The caller must specify the spreadsheet ID and one or more DataFilters. Ranges matching any of the specified data filters will be cleared. Only values are cleared -- all other properties of the cell (such as formatting, data validation, etc..) are kept.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`dataFilters\` \| array \| Yes \| The DataFilters used to determine which ranges to clear. \|
\| \`spreadsheetId\` \| string \| Yes \| The ID of the spreadsheet to update. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch Create Media Items

\*\*Slug:\*\* \`GOOGLESUPER\_BATCH\_CREATE\_MEDIA\_ITEMS\`

Batch upload and create media items in Google Photos. Supports three input methods: 1. 'urls': Simple list of public URLs (file names extracted automatically) 2. 'media\_files': List of objects with url/file, file\_name, and description 3. 'files': List of uploaded files Media items can optionally be added to an album at a specific position. Maximum 50 items per request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`urls\` \| array \| No \| Simplified input: List of public URLs of media files to upload. File names will be extracted from URLs automatically. Use 'media\_files' for more control over file names and descriptions. \|
\| \`files\` \| array \| No \| List of files to upload to Google Photos. \|
\| \`albumId\` \| string \| No \| Optional identifier of the album where the media items are to be added. If not specified, media items are added to the user's library only. \|
\| \`media\_files\` \| array \| No \| List of media files to upload. Each item can specify either a 'url' (public URL) or a 'file' (FileUploadable object). Maximum 50 items per request. \|
\| \`albumPosition\` \| object \| No \| Position in the album to add the media items. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch delete Gmail messages

\*\*Slug:\*\* \`GOOGLESUPER\_BATCH\_DELETE\_MESSAGES\`

Tool to permanently delete multiple Gmail messages in bulk, bypassing Trash with no recovery possible. Use when you need to efficiently remove large numbers of emails (e.g., retention enforcement, mailbox hygiene). Use GMAIL\_MOVE\_TO\_TRASH instead when reversibility may be needed. Always obtain explicit user confirmation and verify a sample of message IDs before executing. High-volume calls may trigger 429 rateLimitExceeded or 403 userRateLimitExceeded errors; apply exponential backoff.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`userId\` \| string \| No \| User's email address or 'me' for the authenticated user. \|
\| \`messageIds\` \| array \| Yes \| List of Gmail message IDs to delete. Each ID must be a hexadecimal string (e.g., '18c5f5d1a2b3c4d5'). Obtain IDs from actions like GMAIL\_FETCH\_EMAILS or GMAIL\_LIST\_THREADS - do not use human-readable descriptions. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch Events

\*\*Slug:\*\* \`GOOGLESUPER\_BATCH\_EVENTS\`

Execute up to 1000 event mutations (create/patch/delete) in one Google Calendar HTTP batch request with per-item status/results. Use this to materially reduce round-trips for bulk operations like migrations, cleanup, or large-scale updates.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fail\_fast\` \| boolean \| No \| If true, stop processing after the first batch containing any 4xx error (except 404 on DELETE). Default is false. \|
\| \`operations\` \| array \| Yes \| List of batch operations to execute. Maximum 1000 operations per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch Execute Google Tasks Operations

\*\*Slug:\*\* \`GOOGLESUPER\_BATCH\_EXECUTE\`

Executes multiple Google Tasks API operations in a single HTTP batch request and returns structured per-item results. Use this to reduce LLM tool invocations when performing bulk operations like updating many tasks, moving tasks, or deleting multiple items. Note: Each sub-request still counts toward API quota; batching primarily reduces HTTP overhead and tool call count.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`requests\` \| array \| Yes \| Array of sub-requests to execute in this batch. Each sub-request is independent and will return its own result. \|
\| \`max\_requests\` \| integer \| No \| Maximum number of sub-requests allowed in a single batch. Google's typical cap is 1000. Lower values can control response size. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch get spreadsheet

\*\*Slug:\*\* \`GOOGLESUPER\_BATCH\_GET\`

Retrieves data from specified cell ranges in a Google Spreadsheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ranges\` \| array \| No \| A list of cell ranges in A1 notation from which to retrieve data. If this list is omitted, empty, or contains only empty strings, all data from the first sheet of the spreadsheet will be fetched. Empty strings in the list are automatically filtered out. Supported formats: (1) Bare sheet name like 'Sheet1' to get all data from that sheet, (2) Sheet with range like 'Sheet1!A1:B2', (3) Just cell reference like 'A1:B2' (uses first sheet). For sheet names with spaces or special characters, enclose in single quotes (e.g., "'My Sheet'" or "'My Sheet'!A1:B2"). IMPORTANT: For large sheets, always use bounded ranges with explicit row limits (e.g., 'Sheet1!A1:Z10000' instead of 'Sheet1!A:Z'). Unbounded column ranges like 'A:Z' on sheets with >10,000 rows may cause timeouts or errors. If you need all data from a large sheet, fetch in chunks of 10,000 rows at a time. \|
\| \`majorDimension\` \| string ("DIMENSION\_UNSPECIFIED" \| "ROWS" \| "COLUMNS") \| No \| The major dimension for organizing data in results. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet from which data will be retrieved. This is the ID found in the spreadsheet URL after /d/. You can provide either the spreadsheet ID directly or a full Google Sheets URL (the ID will be extracted automatically). \|
\| \`valueRenderOption\` \| string ("FORMATTED\_VALUE" \| "UNFORMATTED\_VALUE" \| "FORMULA") \| No \| How values should be rendered in the output. FORMATTED\_VALUE: Values are calculated and formatted (default). UNFORMATTED\_VALUE: Values are calculated but not formatted. FORMULA: Values are not calculated; the formula is returned instead. \|
\| \`dateTimeRenderOption\` \| string ("SERIAL\_NUMBER" \| "FORMATTED\_STRING") \| No \| How dates and times should be rendered in the output. SERIAL\_NUMBER: Dates are returned as serial numbers (default). FORMATTED\_STRING: Dates returned as formatted strings. \|
\| \`empty\_strings\_filtered\` \| boolean \| No \| Indicates whether empty strings were filtered from the response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch Get Media Items

\*\*Slug:\*\* \`GOOGLESUPER\_BATCH\_GET\_MEDIA\_ITEMS\`

Returns the list of media items for the specified media item identifiers.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mediaItemIds\` \| array \| Yes \| Identifiers of the media items to be requested. Must not contain duplicates. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch modify Gmail messages

\*\*Slug:\*\* \`GOOGLESUPER\_BATCH\_MODIFY\_MESSAGES\`

Modify labels on multiple Gmail messages in one efficient API call. Supports up to 1,000 messages per request for bulk operations like archiving, marking as read/unread, or applying custom labels. High-volume calls may return 429 rateLimitExceeded or 403 userRateLimitExceeded; apply exponential backoff.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`userId\` \| string \| No \| User's email address or 'me' for the authenticated user. \|
\| \`messageIds\` \| array \| Yes \| List of message IDs to modify. Maximum 1,000 message IDs per request. Get message IDs from GMAIL\_FETCH\_EMAILS or GMAIL\_LIST\_THREADS actions. Accepts 'messageIds', 'ids', or 'message\_ids' as the parameter name. \|
\| \`addLabelIds\` \| array \| No \| List of label IDs to add to the messages. IMPORTANT: Use label IDs, NOT label display names. System labels use their name as ID: INBOX, STARRED, IMPORTANT, SENT, DRAFT, SPAM, TRASH, UNREAD, CATEGORY\_PERSONAL, CATEGORY\_SOCIAL, CATEGORY\_PROMOTIONS, CATEGORY\_UPDATES, CATEGORY\_FORUMS. Custom labels MUST use their ID (format: 'Label\_XXX', e.g., 'Label\_1', 'Label\_25'), NOT the display name (e.g., do NOT use 'Work' or 'Projects'). Call GMAIL\_LIST\_LABELS first to get the 'id' field for custom labels. At least one of add\_label\_ids or remove\_label\_ids must be provided. CONSTRAINT: Label IDs must NOT overlap with remove\_label\_ids - cannot add and remove the same label. \|
\| \`removeLabelIds\` \| array \| No \| List of label IDs to remove from the messages. IMPORTANT: Use label IDs, NOT label display names. System labels use their name as ID: INBOX, STARRED, IMPORTANT, SENT, SPAM, TRASH, UNREAD. Custom labels MUST use their ID (format: 'Label\_XXX', e.g., 'Label\_1', 'Label\_25'), NOT the display name (e.g., do NOT use 'Work' or 'Projects'). Call GMAIL\_LIST\_LABELS first to get the 'id' field for custom labels. Common use cases: Remove 'UNREAD' to mark as read, remove 'INBOX' to archive. Note: 'DRAFT' cannot be removed - use GMAIL\_DELETE\_DRAFT instead. At least one of add\_label\_ids or remove\_label\_ids must be provided. CONSTRAINT: Label IDs must NOT overlap with add\_label\_ids - cannot add and remove the same label. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch Run Pivot Reports

\*\*Slug:\*\* \`GOOGLESUPER\_BATCH\_RUN\_PIVOT\_REPORTS\`

Tool to return multiple pivot reports in a batch for a GA4 property. Use when you need to fetch multiple pivot table reports with multi-dimensional analysis in a single request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`property\` \| string \| Yes \| Required. The GA4 property resource name. Format: properties/{property\_id} \|
\| \`requests\` \| array \| Yes \| Required. Up to 5 individual RunPivotReportRequest objects. Each request can have dimensions, metrics, dateRanges, pivots, dimensionFilter, metricFilter, currencyCode, cohortSpec, keepEmptyRows, returnPropertyQuota, and comparisons fields. CRITICAL CONSTRAINT: Every dimension defined in 'dimensions' MUST be used in at least one of: pivots (fieldNames), dimensionFilter, or orderBys. Dimensions not used anywhere will cause a 400 error. The only exception is 'dateRange' dimensions. Additionally, all fieldNames in pivots must reference dimensions defined in the request's 'dimensions' array, and no two pivots can share the same dimension. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch Run Reports

\*\*Slug:\*\* \`GOOGLESUPER\_BATCH\_RUN\_REPORTS\`

Tool to return multiple analytics data reports in a batch. Use when you need to fetch multiple reports for one GA4 property in a single request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`property\` \| string \| Yes \| Required. The property resource name. Format: properties/{property\_id} \|
\| \`requests\` \| array \| Yes \| Required. Up to 5 individual RunReportRequest objects (minimum 1, maximum 5). CRITICAL: Non-cohort requests MUST contain 'dateRanges' (list of {startDate, endDate}); cohort requests (containing 'cohortSpec') must NOT include 'dateRanges'. Key fields per request: dateRanges, dimensions (list of {name}), metrics (list of {name}), dimensionFilter/metricFilter (FilterExpression: use andGroup/orGroup/notExpression/filter at top level), cohortSpec, offset, limit, orderBys, keepEmptyRows. NOTE: Do NOT include 'pivots' field - use batchRunPivotReports action for pivot reports. \|
\| \`unwrapped\_filters\` \| array \| No \| Internal field to track which filters were unwrapped during validation \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch update spreadsheet (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_BATCH\_UPDATE\`

DEPRECATED: Use GOOGLESHEETS\_VALUES\_UPDATE instead. Write values to ONE range in a Google Sheet, or append as new rows if no start cell is given. IMPORTANT - This tool does NOT accept the Google Sheets API's native batch format: - WRONG: {"data": \[{"range": "...", "values": \[\[...\]\]}\], ...} - CORRECT: {"sheet\_name": "...", "values": \[\[...\]\], "first\_cell\_location": "...", ...} To update MULTIPLE ranges, make SEPARATE CALLS to this tool for each range. Features: - Auto-expands grid for large datasets (prevents range errors) - Set first\_cell\_location to write at a specific position (e.g., "A1", "B5") - Omit first\_cell\_location to append values as new rows at the end Requirements: Target sheet must exist and spreadsheet must contain at least one worksheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`values\` \| array \| Yes \| A 2D array of cell values where each inner array represents a row. Values can be strings, numbers, booleans, or None/null for empty cells. Ensure columns are properly aligned across rows. \|
\| \`sheet\_name\` \| string \| Yes \| The name of the specific sheet (tab) within the spreadsheet to update (required, separate from cell reference). Case-insensitive matching is supported (e.g., 'sheet1' will match 'Sheet1'). Note: Default sheet names are locale-dependent (e.g., 'Sheet1' in English, 'Foglio1' in Italian, 'Hoja 1' in Spanish, '시트1' in Korean, 'Feuille 1' in French). If you specify a common default name like 'Sheet1' and it doesn't exist, the action will automatically use the first sheet in the spreadsheet. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Sheets spreadsheet to be updated. Must be an alphanumeric string (with hyphens and underscores allowed) typically 44 characters long. Can be found in the spreadsheet URL between '/d/' and '/edit'. Example: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit' has ID '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'. \|
\| \`value\_input\_option\` \| string ("RAW" \| "USER\_ENTERED") \| No \| How input data should be interpreted. 'USER\_ENTERED': Values are parsed as if typed by a user (e.g., strings may become numbers/dates, formulas are calculated). 'RAW': Values are stored exactly as provided without parsing (e.g., '123' stays as string, '=SUM(A1:B1)' is not calculated). \|
\| \`first\_cell\_location\` \| string \| No \| The starting cell for the update range, specified as a single cell in A1 notation WITHOUT sheet prefix (e.g., 'A1', 'B2', 'AA931'). The update will extend from this cell to the right and down based on the provided values. Sheet name must be provided separately in the 'sheet\_name' field. If omitted or set to null, values are appended as new rows to the sheet. Note: Use only a single cell reference (e.g., 'AA931'), NOT a range (e.g., 'AA931:AF931') or sheet-prefixed notation (e.g., 'Sheet1!A1'). \|
\| \`include\_values\_in\_response\` \| boolean \| No \| If set to True, the response will include the updated values in the 'spreadsheet.responses\[\].updatedData' field. The updatedData object contains 'range' (A1 notation), 'majorDimension' (ROWS), and 'values' (2D array of the actual cell values after the update). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch Update Values by Data Filter

\*\*Slug:\*\* \`GOOGLESUPER\_BATCH\_UPDATE\_VALUES\_BY\_DATA\_FILTER\`

Tool to update values in ranges matching data filters. Use when you need to update specific data in a Google Sheet based on criteria rather than fixed cell ranges.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| array \| Yes \| The new values to apply to the spreadsheet. If more than one range is matched by the specified DataFilter the specified values are applied to all of those ranges. Can be provided as a JSON string or as a list of DataFilterValueRange objects. \|
\| \`spreadsheetId\` \| string \| Yes \| The ID of the spreadsheet to update. \|
\| \`valueInputOption\` \| string ("INPUT\_VALUE\_OPTION\_UNSPECIFIED" \| "RAW" \| "USER\_ENTERED") \| Yes \| How the input data should be interpreted. RAW: Values are stored exactly as entered, without parsing. USER\_ENTERED: Values are parsed as if typed by a user (numbers stay numbers, strings prefixed with '=' become formulas, etc.). INPUT\_VALUE\_OPTION\_UNSPECIFIED: Default input value option is not specified. \|
\| \`includeValuesInResponse\` \| boolean \| No \| Determines if the update response should include the values of the cells that were updated. By default, responses do not include the updated values. \|
\| \`responseValueRenderOption\` \| string ("FORMATTED\_VALUE" \| "UNFORMATTED\_VALUE" \| "FORMULA") \| No \| Determines how values in the response should be rendered. The default render option is FORMATTED\_VALUE. \|
\| \`responseDateTimeRenderOption\` \| string ("SERIAL\_NUMBER" \| "FORMATTED\_STRING") \| No \| Determines how dates, times, and durations in the response should be rendered. This is ignored if responseValueRenderOption is FORMATTED\_VALUE. The default dateTime render option is SERIAL\_NUMBER. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Bulk Insert Tasks (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_BULK\_INSERT\_TASKS\`

DEPRECATED: Use BatchExecute instead. Creates multiple tasks in a Google Tasks list in a single operation using HTTP batching. Use when you need to create many tasks efficiently (reducing round-trips compared to individual insert calls).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tasks\` \| array \| Yes \| Array of tasks to create. Each task requires at least a title. \|
\| \`batch\_size\` \| integer \| No \| Maximum number of tasks per batch request. Default: 50. Tasks exceeding this will be split into multiple batch calls. \|
\| \`tasklist\_id\` \| string \| Yes \| Identifier for the Google Task list where tasks will be created. Use actual task list IDs, not '@default'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove Calendar from List

\*\*Slug:\*\* \`GOOGLESUPER\_CALENDAR\_LIST\_DELETE\`

Tool to remove a calendar from the user's calendar list. Use when you need to unsubscribe from or hide a calendar from the user's list.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendar\_id\` \| string \| Yes \| Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the 'primary' keyword. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Single Calendar by ID

\*\*Slug:\*\* \`GOOGLESUPER\_CALENDAR\_LIST\_GET\`

Retrieves metadata for a SINGLE specific calendar from the user's calendar list by its calendar ID. This action requires a calendarId parameter and returns details about that one calendar only. NOTE: This does NOT list all calendars. To list all calendars in the user's calendar list, use GOOGLECALENDAR\_CALENDAR\_LIST\_LIST instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendarId\` \| string \| Yes \| Required. The calendar identifier for the single calendar to retrieve. Use 'primary' for the primary calendar of the authenticated user, or provide a specific calendar ID (e.g., an email address or group calendar ID). To find calendar IDs, first use GOOGLECALENDAR\_CALENDAR\_LIST\_LIST to list all calendars. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert Calendar into List

\*\*Slug:\*\* \`GOOGLESUPER\_CALENDAR\_LIST\_INSERT\`

Inserts an existing calendar into the user's calendar list, making it visible in the UI. Calendars (e.g., newly created ones) won't appear in the list or UI until explicitly inserted.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The identifier of the calendar to insert. Must be a valid calendar ID in email format (e.g., ‘user@example.com’ for a user’s calendar or ‘calendarid@group.calendar.google.com’ for a shared calendar). Note: The ‘primary’ keyword is not supported for this operation - use the actual email address of the primary calendar instead. The calendar must exist and you must have appropriate access permissions. \|
\| \`hidden\` \| boolean \| No \| Whether the calendar has been hidden from the list. Accepts only boolean values: true or false. If not specified, the API defaults to false. \|
\| \`colorId\` \| string \| No \| The color of the calendar. This is an ID referring to an entry in the calendarCore color palette. \|
\| \`selected\` \| boolean \| No \| Whether the calendar is selected and visible in the calendar list. Accepts only boolean values: true or false. If not specified, the API defaults to false. \|
\| \`backgroundColor\` \| string \| No \| The background color of the calendar in the Web UI. (Hexadecimal color code) \|
\| \`foregroundColor\` \| string \| No \| The foreground color of the calendar in the Web UI. (Hexadecimal color code) \|
\| \`summaryOverride\` \| string \| No \| The summary that the authenticated user has set for this calendar. \|
\| \`color\_rgb\_format\` \| boolean \| No \| Whether to use the foregroundColor and backgroundColor fields to write the calendar colors (RGB). If this feature is used, the index-based colorId field will be set to the best matching option automatically. Optional. The default is False. \|
\| \`defaultReminders\` \| array \| No \| The default reminders that the authenticated user has for this calendar. \|
\| \`notificationSettings\` \| object \| No \| The notifications that the authenticated user is receiving for this calendar. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Patch Calendar List Entry

\*\*Slug:\*\* \`GOOGLESUPER\_CALENDAR\_LIST\_PATCH\`

Updates an existing calendar on the user's calendar list using patch semantics. This method allows partial updates, modifying only the specified fields.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`hidden\` \| boolean \| No \| Whether calendar is hidden. \|
\| \`colorId\` \| string \| No \| ID for calendar color from colors endpoint. \|
\| \`selected\` \| boolean \| No \| Whether calendar content shows in UI. \|
\| \`calendar\_id\` \| string \| Yes \| Calendar identifier. To retrieve calendar IDs call the calendarList.list method. Use "primary" keyword for the currently logged in user's primary calendar. \|
\| \`colorRgbFormat\` \| boolean \| No \| Whether to use RGB for foreground/background colors. \|
\| \`backgroundColor\` \| string \| No \| Hex color for calendar background. \|
\| \`foregroundColor\` \| string \| No \| Hex color for calendar foreground. \|
\| \`summaryOverride\` \| string \| No \| User-set summary for the calendar. \|
\| \`defaultReminders\` \| array \| No \| List of default reminders. \|
\| \`notificationSettings\` \| object \| No \| Notification settings for the calendar. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Calendar List Entry

\*\*Slug:\*\* \`GOOGLESUPER\_CALENDAR\_LIST\_UPDATE\`

Updates a calendar list entry's display/subscription settings (color, visibility, reminders, selection) for the authenticated user — does not modify the underlying calendar resource (title, timezone, etc.). To modify the calendar itself, use GOOGLECALENDAR\_CALENDARS\_UPDATE.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`hidden\` \| boolean \| No \| Whether calendar is hidden. \|
\| \`colorId\` \| string \| No \| ID for calendar color from colors endpoint. \|
\| \`selected\` \| boolean \| No \| Whether calendar content shows in UI. \|
\| \`calendar\_id\` \| string \| Yes \| Calendar identifier. Must be an actual calendar ID (e.g., "examplecalendar@group.calendar.google.com" or "c\_abc123...@group.calendar.google.com"). To retrieve valid calendar IDs, use the GOOGLECALENDAR\_LIST\_CALENDARS action first. The "primary" alias is not valid for calendarList.update. \|
\| \`colorRgbFormat\` \| boolean \| No \| Whether to use RGB for foreground/background colors. \|
\| \`backgroundColor\` \| string \| No \| Hex color for calendar background. \|
\| \`foregroundColor\` \| string \| No \| Hex color for calendar foreground. \|
\| \`summaryOverride\` \| string \| No \| User-set summary for the calendar. \|
\| \`defaultReminders\` \| array \| No \| List of default reminders. \|
\| \`notificationSettings\` \| object \| No \| Notification settings for the calendar. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Watch Calendar List

\*\*Slug:\*\* \`GOOGLESUPER\_CALENDAR\_LIST\_WATCH\`

Watch for changes to CalendarList resources using push notifications. Use this to receive real-time updates when calendar list entries are modified.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| A UUID or similar unique string that identifies this channel. Maximum 64 characters. \|
\| \`type\` \| string \| Yes \| The type of delivery mechanism used for this channel. Must be "web\_hook" or "webhook". \|
\| \`token\` \| string \| No \| An arbitrary string delivered to the target address with each notification. Maximum 256 characters. Used for channel verification and message routing. \|
\| \`params\` \| object \| No \| Additional parameters controlling delivery channel behavior. \|
\| \`address\` \| string \| Yes \| The HTTPS URL where notifications are delivered for this channel. Must have a valid SSL certificate. \|
\| \`expiration\` \| integer \| No \| Unix timestamp in milliseconds indicating when the API should stop sending notifications. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Calendar

\*\*Slug:\*\* \`GOOGLESUPER\_CALENDARS\_DELETE\`

Deletes a secondary calendar that you own or have delete permissions on. Deletion is permanent and irreversible — verify the correct calendar\_id before calling. You cannot delete your primary calendar or calendars you only have read/write access to. Use calendarList.list to find calendars with owner accessRole. For primary calendars, use calendars.clear instead. Parallel calls may trigger userRateLimitExceeded; sequence bulk deletions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendar\_id\` \| string \| Yes \| Calendar identifier for a secondary calendar you own or have delete permissions on. Use calendarList.list to find deletable calendar IDs (look for accessRole "owner"). Primary calendars cannot be deleted; use the Clear Calendar action instead. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Calendar

\*\*Slug:\*\* \`GOOGLESUPER\_CALENDARS\_UPDATE\`

Full PUT-style update that overwrites all calendar metadata fields; unspecified optional fields are cleared. Use GOOGLECALENDAR\_PATCH\_CALENDAR to update only a subset of fields. Mutates the underlying calendar resource (title, description, timeZone, etc.); use GOOGLECALENDAR\_CALENDAR\_LIST\_UPDATE to change per-user display properties like color.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`summary\` \| string \| Yes \| Title of the calendar. Must be a non-empty string; passing an empty string clears the calendar title. \|
\| \`location\` \| string \| No \| Geographic location of the calendar as free-form text. Optional. \|
\| \`timeZone\` \| string \| No \| The time zone of the calendar. (Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".) Optional. \|
\| \`calendarId\` \| string \| Yes \| Calendar identifier. Use 'primary' to update the primary calendar of the currently logged in user, or provide a specific calendar ID (typically in email format like 'abc123@group.calendar.google.com'). To retrieve calendar IDs call the calendarList.list method. IMPORTANT: This is NOT the calendar's display name/title. NOTE: For better performance, prefer providing the actual calendar ID instead of 'primary', as the 'primary' alias requires an additional API call to resolve. \|
\| \`description\` \| string \| No \| Description of the calendar. Optional. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Stop Channel

\*\*Slug:\*\* \`GOOGLESUPER\_CHANNELS\_STOP\`

Tool to stop watching resources through a notification channel. Use when you need to discontinue push notifications for a specific channel subscription.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| A UUID or similar unique string that identifies this channel. \|
\| \`token\` \| string \| No \| An arbitrary string delivered to the target address with each notification delivered over this channel. Optional. \|
\| \`resourceId\` \| string \| Yes \| An opaque ID that identifies the resource being watched on this channel. Stable across different API versions. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check Compatibility

\*\*Slug:\*\* \`GOOGLESUPER\_CHECK\_COMPATIBILITY\`

Tool to list dimensions and metrics compatible with a GA4 report request. Use when you need to validate compatibility of chosen dimensions or metrics before running a report.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`metrics\` \| array \| No \| Optional. List of metrics to check compatibility for. Maximum of 10 metrics allowed per request. \|
\| \`property\` \| string \| Yes \| Required. GA4 property resource name. Format: properties/{property\_id}. \|
\| \`dimensions\` \| array \| No \| Optional. List of dimensions to check compatibility for. \|
\| \`metricFilter\` \| object \| No \| Optional. A FilterExpression for metrics; must follow GA4 FilterExpression JSON schema. \|
\| \`dimensionFilter\` \| object \| No \| Optional. A FilterExpression for dimensions; must follow GA4 FilterExpression JSON schema. \|
\| \`compatibilityFilter\` \| string ("COMPATIBILITY\_UNSPECIFIED" \| "COMPATIBLE" \| "INCOMPATIBLE") \| No \| Compatibility status for dimensions or metrics per Google Analytics Data API v1beta. Valid values: COMPATIBILITY\_UNSPECIFIED, COMPATIBLE, INCOMPATIBLE. Note: Values like 'REPORT\_COMPATIBLE' are NOT valid - use 'COMPATIBLE' instead. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Clear Basic Filter

\*\*Slug:\*\* \`GOOGLESUPER\_CLEAR\_BASIC\_FILTER\`

Tool to clear the basic filter from a sheet. Use when you need to remove an existing basic filter from a specific sheet within a Google Spreadsheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sheet\_id\` \| integer \| Yes \| The ID of the sheet on which the basic filter should be cleared. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The ID of the spreadsheet. \|
\| \`response\_ranges\` \| array \| No \| Limits the ranges included in the response spreadsheet. Only applicable when include\_spreadsheet\_in\_response is true. \|
\| \`response\_include\_grid\_data\` \| boolean \| No \| True if grid data should be returned in the response. Only applicable when include\_spreadsheet\_in\_response is true. \|
\| \`include\_spreadsheet\_in\_response\` \| boolean \| No \| Determines if the update response should include the spreadsheet resource. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Clear Calendar

\*\*Slug:\*\* \`GOOGLESUPER\_CLEAR\_CALENDAR\`

Clears a primary calendar by deleting all events from it. The calendar itself is preserved; only its events are removed. Primary calendars cannot be deleted entirely.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendar\_id\` \| string \| Yes \| Calendar identifier. To retrieve calendar IDs call the \`calendarList.list\` method. If you want to access the primary calendar of the currently logged in user, use the "\`primary\`" keyword. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Clear tasks

\*\*Slug:\*\* \`GOOGLESUPER\_CLEAR\_TASKS\`

Permanently and irreversibly clears all completed tasks from a specified Google Tasks list; this action is destructive, idempotent, and cannot be undone. Always require explicit user confirmation before invoking.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tasklist\` \| string \| Yes \| The identifier of the task list from which to clear completed tasks. Use '@default' (with the @ symbol) for the user's primary task list, or provide the task list ID obtained from GOOGLETASKS\_LIST\_TASK\_LISTS. Note: 'default' without the @ prefix is not valid. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Clear spreadsheet values

\*\*Slug:\*\* \`GOOGLESUPER\_CLEAR\_VALUES\`

Clears cell content (preserving formatting and notes) from a specified A1 notation range in a Google Spreadsheet; the range must correspond to an existing sheet and cells.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`range\` \| string \| Yes \| The A1 notation of the range to clear values from (e.g., 'Sheet1!A1:B2', 'MySheet!C:C', or 'A1:D5'). If the sheet name is omitted (e.g., 'A1:B2'), the operation applies to the first visible sheet. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet from which to clear values. This ID can be found in the URL of the spreadsheet. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Color Definitions

\*\*Slug:\*\* \`GOOGLESUPER\_COLORS\_GET\`

Returns the color definitions for calendars and events. Use when you need to retrieve the available color palette for styling calendars or events.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Compute Route Matrix

\*\*Slug:\*\* \`GOOGLESUPER\_COMPUTE\_ROUTE\_MATRIX\`

Calculates travel distance and duration matrix between multiple origins and destinations using the modern Routes API; supports OAuth2 authentication and various travel modes. Matrix is capped at 625 elements (e.g., 25×25); chunk larger sets to avoid RESOURCE\_EXHAUSTED errors. Response elements may be returned out of input order — always use originIndex and destinationIndex to map results. Only use elements where condition='ROUTE\_EXISTS'; the matrix may be incomplete.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`units\` \| string ("METRIC" \| "IMPERIAL") \| No \| Unit system (e.g., 'METRIC' for kilometers, 'IMPERIAL' for miles) for displaying distances. Note: distanceMeters in responses is always in meters regardless of this setting; units affects only human-readable text output. \|
\| \`origins\` \| array \| Yes \| List of origin locations. Each can be specified as an address or latitude/longitude coordinates. \|
\| \`fieldMask\` \| string \| No \| Comma-separated list of response fields to include (e.g., 'originIndex,destinationIndex,duration,distanceMeters'). Use '\*' for all fields. \|
\| \`travelMode\` \| string ("DRIVE" \| "BICYCLE" \| "WALK" \| "TWO\_WHEELER" \| "TRANSIT") \| No \| Mode of transportation for the route matrix calculation. \|
\| \`destinations\` \| array \| Yes \| List of destination locations. Each can be specified as an address or latitude/longitude coordinates. \|
\| \`languageCode\` \| string \| No \| BCP-47 language code (e.g., 'en-US', 'es') for textual information. \|
\| \`routingPreference\` \| string ("ROUTING\_PREFERENCE\_UNSPECIFIED" \| "TRAFFIC\_UNAWARE" \| "TRAFFIC\_AWARE" \| "TRAFFIC\_AWARE\_OPTIMAL") \| No \| Specifies factors to consider when calculating the route. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Copy Google Document

\*\*Slug:\*\* \`GOOGLESUPER\_COPY\_DOCUMENT\`

Tool to create a copy of an existing Google Document. Use this to duplicate a document, for example, when using an existing document as a template. The copied document will have a default title (e.g., 'Copy of \[original title\]') if no new title is provided, and will be placed in the user's root Google Drive folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| No \| The title for the new copied document. If not provided, the title will be 'Copy of \[original document's title\]'. \|
\| \`document\_id\` \| string \| Yes \| The ID of the Google Document to be copied. \|
\| \`include\_shared\_drives\` \| boolean \| No \| Whether to support copying documents from shared drives. Defaults to True. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Copy file (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_COPY\_FILE\`

DEPRECATED: Use GOOGLEDRIVE\_COPY\_FILE\_ADVANCED instead. Duplicates an existing file (not folders) in Google Drive by \`file\_id\`; copy lands in same folder as original — use GOOGLEDRIVE\_MOVE\_FILE afterward for precise placement. Copy receives a new \`file\_id\`; update stored references accordingly. For shared drives, requires organizer/manager rights.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The unique identifier for the file on Google Drive that you want to copy. This ID can be retrieved from the file's shareable link or via other Google Drive API calls. Pass only the raw ID, not a full URL. Name-based searches may return multiple files — confirm the correct \`file\_id\` before calling. \|
\| \`new\_title\` \| string \| No \| The title to assign to the new copy of the file. If not provided, the copied file will have the same title as the original, prefixed with 'Copy of '. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Copy file with advanced options

\*\*Slug:\*\* \`GOOGLESUPER\_COPY\_FILE\_ADVANCED\`

Creates a copy of a file and applies any requested updates with patch semantics. Use when you need to duplicate a file with advanced options like label inclusion, visibility settings, or custom metadata.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`name\` \| string \| No \| The name of the copied file. If not provided, the copied file will have the same name as the original, prefixed with 'Copy of '. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format options. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. Use comma-separated field paths. \|
\| \`fileId\` \| string \| Yes \| The ID of the file to copy. This is the unique identifier for the file on Google Drive. \|
\| \`parents\` \| array \| No \| The IDs of the parent folders which contain the file. If not specified as part of a copy request, the file inherits any discoverable parents of the source file. \|
\| \`starred\` \| boolean \| No \| Whether the user has starred the file. \|
\| \`trashed\` \| boolean \| No \| Whether the file has been trashed. \|
\| \`callback\` \| string \| No \| JSONP callback parameter. \|
\| \`mimeType\` \| string \| No \| The MIME type of the file. Google Drive attempts to automatically detect an appropriate value from uploaded content, if no value is provided. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`properties\` \| object \| No \| A collection of arbitrary key-value pairs which are visible to all apps. Entries with null values are cleared in update and copy requests. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`createdTime\` \| string \| No \| The time at which the file was created (RFC 3339 date-time). \|
\| \`description\` \| string \| No \| A short description of the copied file. \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`ocrLanguage\` \| string \| No \| A language hint for OCR processing during image import (ISO 639-1 code). \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks for improved readability. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`modifiedTime\` \| string \| No \| The last time the file was modified by anyone (RFC 3339 date-time). Note that setting modifiedTime will also update modifiedByMeTime for the user. \|
\| \`appProperties\` \| object \| No \| A collection of arbitrary key-value pairs which are private to the requesting app. Entries with null values are cleared in update and copy requests. These properties can only be retrieved using an authenticated request with an OAuth 2 client ID. \|
\| \`includeLabels\` \| string \| No \| A comma-separated list of IDs of labels to include in the labelInfo part of the response. \|
\| \`folderColorRgb\` \| string \| No \| The color for a folder or a shortcut to a folder as an RGB hex string. The supported colors are published in the folderColorPalette field of the About resource. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|
\| \`writersCanShare\` \| boolean \| No \| Whether users with only writer permission can modify the file's permissions. Not populated for items in shared drives. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. \|
\| \`supportsTeamDrives\` \| boolean \| No \| Deprecated: Use supportsAllDrives instead. \|
\| \`enforceSingleParent\` \| boolean \| No \| Deprecated. Copying files into multiple folders is no longer supported. Use shortcuts instead. \|
\| \`keepRevisionForever\` \| boolean \| No \| Whether to set the 'keepForever' field in the new head revision. This is only applicable to files with binary content in Google Drive. Only 200 revisions for the file can be kept forever. If the limit is reached, try deleting pinned revisions. \|
\| \`ignoreDefaultVisibility\` \| boolean \| No \| Whether to ignore the domain's default visibility settings for the created file. Domain administrators can choose to make all uploaded files visible to the domain by default; this parameter bypasses that behavior for the request. Permissions are still inherited from parent folders. \|
\| \`includePermissionsForView\` \| string \| No \| Specifies which additional view's permissions to include in the response. Only 'published' is supported. \|
\| \`copyRequiresWriterPermission\` \| boolean \| No \| Whether the options to copy, print, or download this file should be disabled for readers and commenters. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Album

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_ALBUM\`

Creates a new album in Google Photos.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| Yes \| Name of the album to be created in Google Photos. Maximum 500 characters. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create and Populate Table in Google Doc

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_AND\_POPULATE\_TABLE\`

Creates a new table in a Google Document and populates its cells with provided text data in a single operation. Use this action when you need to insert a structured table with predefined content into a document. The action handles both table creation and cell population automatically, eliminating the need for separate operations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rows\` \| integer \| Yes \| The number of rows in the table. Must be between 1 and 20. \|
\| \`index\` \| integer \| No \| The zero-based index where the table will be inserted, in UTF-16 code units. The index must be strictly less than the segment's end index. To insert at the end of a segment, omit this parameter and set 'insertAtEndOfSegment' to true instead. \|
\| \`tabId\` \| string \| No \| The tab that the location is in. When omitted, the request is applied to the first tab. \|
\| \`columns\` \| integer \| Yes \| The number of columns in the table. Must be between 1 and 20. \|
\| \`cellData\` \| array \| Yes \| A 2D array (list of lists) containing the text content for each cell. The outer list represents rows, and each inner list represents columns. Must match the dimensions specified by 'rows' and 'columns'. Empty strings are allowed for empty cells. \|
\| \`segmentId\` \| string \| No \| The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body. \|
\| \`documentId\` \| string \| Yes \| The ID of the document to update. \|
\| \`insertAtEndOfSegment\` \| boolean \| No \| If true, inserts the table at the end of the segment (document body, header, or footer specified by segment\_id). If false or omitted, and 'index' is not provided, it defaults to inserting at the end of the document body. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Audience Export

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_AUDIENCE\_EXPORT\`

Tool to create an audience export for Google Analytics. Use when you need to export a snapshot of users in an audience at a specific point in time. This initiates a long-running asynchronous request that returns an operation resource name immediately. The export begins in CREATING state with rowCount=0; the operation must complete before export data is accessible for querying.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Parent property resource name where the audience export will be created. Format: properties/{property\_id}. \|
\| \`audience\` \| string \| Yes \| Audience resource name identifying the audience to export. Format: properties/{property\_id}/audiences/{audience\_id}. \|
\| \`dimensions\` \| array \| No \| Optional list of dimensions requested and displayed in the export. Each dimension is specified by dimensionName. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Audience List

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_AUDIENCE\_LIST\`

Tool to create an audience list for later retrieval by initiating a long-running asynchronous request. Use when you need to create a snapshot of users currently in an audience. The method returns quickly with an Operation resource while processing occurs in the background.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The parent property resource name. Format: 'properties/{property\_id}'. Example: 'properties/489591273' \|
\| \`audience\` \| string \| Yes \| Required. The audience resource name identifying the audience being listed. Format: 'properties/{property\_id}/audiences/{audience\_id}'. Example: 'properties/489591273/audiences/11228260226' \|
\| \`dimensions\` \| array \| Yes \| Required. The dimensions requested and displayed in the query response. At least one dimension is required. Each entry must be an object with a \`dimensionName\` key (e.g., \`\[{'dimensionName': 'deviceId'}\]\`). Only dimensions supported for audience lists on that property are valid; unsupported values return a 400 INVALID\_ARGUMENT error. Use GOOGLE\_ANALYTICS\_GET\_METADATA to retrieve valid dimension names. \|
\| \`webhookNotification\` \| object \| No \| Webhook notification configuration for audience list operation updates. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create a new calendar

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_CALENDAR\`

Creates a new secondary Google Calendar with the specified title and optional settings. Use this action when you need to create a new calendar for organizing events separately from the primary calendar. The authenticated user becomes the owner of the newly created calendar. Optional parameters include description, location, and timezone.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`summary\` \| string \| Yes \| Title of the calendar. This is the name that will be displayed in Google Calendar. \|
\| \`location\` \| string \| No \| Geographic location of the calendar as free-form text. \|
\| \`timezone\` \| string \| No \| The time zone of the calendar, specified as an IANA Time Zone Database name (e.g., 'America/New\_York', 'Europe/London', 'Asia/Tokyo'). If not specified, defaults to UTC. \|
\| \`description\` \| string \| No \| Description of the calendar. Provides additional context about the calendar's purpose. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Callout Asset

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_CALLOUT\_ASSET\`

Create an immutable account asset containing a validated callout. Associate the returned resource using Mutate Customer Assets with field\_type CALLOUT. Cleanup removes that association; Google does not allow deleting the asset.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| Optional internal name for the immutable callout asset. \|
\| \`callout\` \| object \| Yes \| Validated callout content and optional schedule. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Chart in Google Sheets

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_CHART\`

Create a chart in a Google Sheets spreadsheet using the specified data range and chart type. Conditional requirements: - Provide either a simple chart via chart\_type + data\_range (basicChart), OR supply a full chart\_spec supporting all chart types. Exactly one approach should be used. - When using chart\_spec, set exactly one of the union fields (basicChart \| pieChart \| bubbleChart \| candlestickChart \| histogramChart \| waterfallChart \| treemapChart \| orgChart \| scorecardChart).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| No \| Optional title for the chart. \|
\| \`sheet\_id\` \| integer \| Yes \| The numeric sheetId (not the sheet name/title) of the worksheet where the chart will be created. This is a unique integer identifier for the sheet within the spreadsheet. The first/default sheet typically has sheetId=0. IMPORTANT: Use 'Get Spreadsheet Info' action to retrieve valid sheetIds - look for sheets\[\].properties.sheetId in the response. The sheetId must exist in the target spreadsheet; using an ID from a different spreadsheet will fail. \|
\| \`subtitle\` \| string \| No \| Optional subtitle for the chart. \|
\| \`chart\_spec\` \| object \| No \| Optional full ChartSpec object to send to the Google Sheets API. Use this to support ALL chart types and advanced options. Must set exactly one of: basicChart, pieChart, bubbleChart, candlestickChart, histogramChart, treemapChart, waterfallChart, orgChart, scorecardChart. See https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#ChartSpec. \|
\| \`chart\_type\` \| string \| Yes \| Type of chart to create. Supported types: BAR, LINE, AREA, COLUMN, SCATTER, COMBO, STEPPED\_AREA, PIE, HISTOGRAM, BUBBLE, CANDLESTICK, TREEMAP, WATERFALL, ORG, SCORECARD. Case-insensitive and whitespace-tolerant. \|
\| \`data\_range\` \| string \| Yes \| A single contiguous range of data for the chart in A1 notation (e.g., 'A1:C10' or 'Sheet1!B2:D20'). Must be a single continuous range - comma-separated multi-ranges (e.g., 'A1:A10,C1:C10') are not supported. When chart\_spec is not provided, the first column is used as the domain/labels and the remaining columns as series. IMPORTANT: PIE charts require at least 2 columns - the first column for category labels (domain) and the second column for numeric values (series). Single-column ranges are not supported for PIE charts. \|
\| \`x\_axis\_title\` \| string \| No \| Optional title for the X-axis. \|
\| \`y\_axis\_title\` \| string \| No \| Optional title for the Y-axis. \|
\| \`background\_red\` \| number \| No \| Red component of chart background color (0.0-1.0). If not specified, uses default. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Sheets spreadsheet where the chart will be created. Must be the actual spreadsheet ID from the URL (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'), NOT the spreadsheet name or title. Find it in the URL: https://docs.google.com/spreadsheets/d/SPREADSHEET\_ID/edit \|
\| \`background\_blue\` \| number \| No \| Blue component of chart background color (0.0-1.0). If not specified, uses default. \|
\| \`legend\_position\` \| string \| No \| Position of the chart legend. Options: BOTTOM\_LEGEND, TOP\_LEGEND, LEFT\_LEGEND, RIGHT\_LEGEND, NO\_LEGEND. \|
\| \`background\_green\` \| number \| No \| Green component of chart background color (0.0-1.0). If not specified, uses default. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Comment

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_COMMENT\`

Tool to create a comment on a file in Google Drive. Returns a nested \`data\` object; extract \`data.id\` for the resulting comment identifier. Omit \`anchor\` and \`quoted\_file\_content\_\*\` for general file-level comments.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`anchor\` \| string \| No \| A JSON string defining the region of the document to which the comment is anchored. Format: {"region": {"kind": "drive#commentRegion", "": , "rev": "head"}}. Supported classifiers: (1) "line" for text lines (e.g., "line": 12), (2) "page" for page numbers (e.g., "page": {"p": 0}), (3) "txt" for text ranges (e.g., "txt": {"o": 100, "l": 50}), (4) "rect" for rectangles in images (e.g., "rect": {"x": 10, "y": 20, "w": 100, "h": 50}), (5) "time" for video timestamps (e.g., "time": {"t": "00:01:30"}), (6) "matrix" for spreadsheet cells (e.g., "matrix": {"c": 2, "r": 5}). Note: On blob files, only unanchored comments are supported. Google Workspace editors may treat API-set anchors as unanchored. \|
\| \`content\` \| string \| Yes \| The plain text content of the comment. \|
\| \`file\_id\` \| string \| Yes \| The ID of the file. The \`id\` field from GOOGLEDOCS\_SEARCH\_DOCUMENTS results can be used directly without conversion. \|
\| \`quoted\_file\_content\_value\` \| string \| No \| The quoted content itself. \|
\| \`quoted\_file\_content\_mime\_type\` \| string \| No \| The MIME type of the quoted content. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Custom Dimension

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_CUSTOM\_DIMENSION\`

Tool to create a CustomDimension for a Google Analytics property. Use when you need to add a new custom dimension to track specific user properties, event parameters, or eCommerce item parameters.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`scope\` \| string ("DIMENSION\_SCOPE\_UNSPECIFIED" \| "EVENT" \| "USER" \| "ITEM") \| Yes \| Required. Immutable. The scope of this dimension. Must be one of: EVENT, USER, or ITEM \|
\| \`parent\` \| string \| Yes \| Required. The property in which to create the CustomDimension. Format: properties/{property\_id} \|
\| \`description\` \| string \| No \| Optional. Description for this custom dimension. Max length of 150 characters \|
\| \`displayName\` \| string \| Yes \| Required. Display name for this custom dimension as shown in the Analytics UI. Max length of 82 characters, alphanumeric plus space and underscore starting with a letter \|
\| \`parameterName\` \| string \| Yes \| Required. Immutable. Tagging parameter name for this custom dimension. For user-scoped dimensions, this is the user property name. For event-scoped dimensions, this is the event parameter name. For item-scoped dimensions, this is the parameter name in the eCommerce items array. May only contain alphanumeric and underscore characters, starting with a letter. Max length of 24 characters for user-scoped dimensions, 40 characters for event-scoped dimensions \|
\| \`disallowAdsPersonalization\` \| boolean \| No \| Optional. If set to true, sets this dimension as NPA and excludes it from ads personalization. This is currently only supported by user-scoped custom dimensions \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create customer list

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_CUSTOMER\_LIST\`

Creates a Google Ads customer list (UserList/audience/remarketing list), not a Google Ads customer account. Note: Requires an authenticated Google Ads connection with customer\_id configured. Email-based lists must comply with Google Ads policies and applicable privacy/consent laws. Membership updates can take many hours to propagate; targeting eligibility is not immediate after creation.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Name of the Google Ads customer list (UserList/audience list), not an account. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`description\` \| string \| No \| Description of the Google Ads customer list (UserList/audience list), not an account. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Custom Metric

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_CUSTOM\_METRIC\`

Tool to create a custom metric in Google Analytics. Use when you need to define a new custom metric for tracking specific event parameters.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`scope\` \| string ("METRIC\_SCOPE\_UNSPECIFIED" \| "EVENT") \| Yes \| Required. Immutable. The scope of this custom metric. \|
\| \`parent\` \| string \| Yes \| Required. The property where the custom metric will be created. Format: properties/{property\_id} \|
\| \`description\` \| string \| No \| Optional. Description for this custom metric. Max length of 150 characters. \|
\| \`displayName\` \| string \| Yes \| Required. Display name for this custom metric as shown in the Analytics UI. Max length of 82 characters, alphanumeric plus space and underscore starting with a letter. \|
\| \`parameterName\` \| string \| Yes \| Required. Immutable. Tagging name for this custom metric. If this is an event-scoped metric, then this is the event parameter name. May only contain alphanumeric and underscore characters, starting with a letter. Max length of 40 characters for event-scoped metrics. \|
\| \`measurementUnit\` \| string ("MEASUREMENT\_UNIT\_UNSPECIFIED" \| "STANDARD" \| "CURRENCY" \| "FEET" \| "METERS" \| "KILOMETERS" \| "MILES" \| "MILLISECONDS" \| "SECONDS" \| "MINUTES" \| "HOURS") \| Yes \| Required. The type for the custom metric's value. \|
\| \`restrictedMetricType\` \| array \| No \| Optional. Types of restricted data that this metric may contain. Required for metrics with CURRENCY measurement unit. Must be empty for metrics with a non-CURRENCY measurement unit. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create a document

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_DOCUMENT\`

Creates a new Google Docs document using the provided title as filename and inserts the initial text at the beginning if non-empty, returning the document's ID and metadata (excluding body content).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`text\` \| string \| No \| Optional initial text content to insert at the beginning of the new document. If not provided, an empty document will be created. For very large text (over 50,000 characters), the text will be inserted in chunks to avoid API limits. \|
\| \`title\` \| string \| Yes \| Title for the new document, used as its filename in Google Drive. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create blank document (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_DOCUMENT2\`

DEPRECATED: Use GOOGLEDOCS\_CREATE\_DOCUMENT instead. Tool to create a blank Google Docs document with a specified title. Use when you need to create a new, empty document.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| Yes \| The title of the document to create. This will be used as the document name in Google Drive. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Document Markdown

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_DOCUMENT\_MARKDOWN\`

Creates a new Google Docs document, optionally initializing it with a title and content provided as Markdown text.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| Yes \| The title for the new Google Docs document. \|
\| \`image\_assets\` \| array \| No \| Optional uploaded images that Markdown can reference by name. Use Markdown image syntax like !\[Alt\](attachment://diagram). Public HTTPS image URLs in markdown do not need image\_assets. \|
\| \`markdown\_text\` \| string \| No \| The initial content for the document, formatted as Markdown. Also accepts 'content' as an alias. Supports headings, real Google Docs lists including nested lists, multiple Markdown tables, task-list markers, images via publicly accessible URLs or matching image\_assets uploads (max 2KB URL length after resolution; formats: JPEG, PNG, GIF; SVG not supported), blockquotes, code blocks, hyperlinks (e.g., \[text\](url)), and text formatting (bold, italic, etc.). If empty or omitted, creates document with title only. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Shared Drive

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_DRIVE\`

Tool to create a new shared drive. Use when you need to programmatically create a new shared drive for collaboration or storage.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| The name of this shared drive. \|
\| \`hidden\` \| boolean \| No \| Whether the shared drive is hidden from default view. \|
\| \`themeId\` \| string \| No \| The ID of the theme from which the background image and color will be set. The set of possible driveThemes can be retrieved from a drive.about.get response. When not specified on a drive.drives.create request, a random theme is chosen from which the background image and color are set. This is a write-only field; it can only be set on requests that don't set colorRgb or backgroundImageFile. \|
\| \`colorRgb\` \| string \| No \| The color of this shared drive as an RGB hex string. It can only be set on a drive.drives.update request that does not set themeId. \|
\| \`requestId\` \| string \| No \| Optional. An ID for idempotent creation of a shared drive. If not provided, a UUID will be auto-generated. Each requestId can only be used ONCE to successfully create a drive. If retrying a request that succeeded previously with the same requestId, the existing drive will be returned. \|
\| \`backgroundImageFile\` \| object \| No \| An image file and cropping parameters from which a background image for this shared drive is set. This is a write only field; it can only be set on drive.drives.update requests that don't set themeId. When specified, all fields of the backgroundImageFile must be set. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create email draft

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_EMAIL\_DRAFT\`

Creates a Gmail email draft. While all fields are optional per the Gmail API, practical validation requires at least one of recipient\_email, cc, or bcc and at least one of subject or body. Supports To/Cc/Bcc recipients, subject, plain/HTML body (ensure \`is\_html=True\` for HTML), attachments, and threading. Returns a draft\_id that must be used as-is with GMAIL\_SEND\_DRAFT — synthetic or stale IDs will fail. When creating a draft reply to an existing thread (thread\_id provided), leave subject empty to stay in the same thread; setting a subject will create a NEW thread instead. HTTP 429 may occur on rapid creation/send sequences; apply exponential backoff.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cc\` \| array \| No \| Carbon Copy (CC) recipients' email addresses. Each must be a valid email address (e.g., 'user@example.com') or display name format (e.g., 'John Doe '). Plain names without email addresses are NOT valid. Optional for drafts (recipients can be added later before sending). \|
\| \`bcc\` \| array \| No \| Blind Carbon Copy (BCC) recipients' email addresses. Each must be a valid email address (e.g., 'user@example.com') or display name format (e.g., 'Bob Jones '). Plain names without email addresses are NOT valid. Optional for drafts (recipients can be added later before sending). \|
\| \`body\` \| string \| No \| Email body content (plain text or HTML); \`is\_html\` must be True if HTML. Optional - drafts can be created without a body and edited later before sending. Can also be provided as 'message\_body'. \|
\| \`is\_html\` \| boolean \| No \| Set to True if \`body\` is already formatted HTML. When False, plain text newlines are auto-converted to

 tags. Both modes result in HTML email; this flag controls whether the body content is treated as raw HTML or plain text that gets HTML formatting applied. \|
\| \`subject\` \| string \| No \| Email subject line. Optional - drafts can be created without a subject and edited later before sending. When creating a draft reply to an existing thread (thread\_id provided), leave this empty to stay in the same thread. Setting a subject will create a NEW thread instead. \|
\| \`user\_id\` \| string \| No \| User's email address or 'me' for the authenticated user. \|
\| \`thread\_id\` \| string \| No \| ID of an existing Gmail thread to reply to; omit for new thread. If the thread ID is invalid or inaccessible, the draft will be created as a new thread instead of failing. \|
\| \`attachment\` \| string \| No \| File(s) to attach to the email. Accepts a single file or a list of files. Total message size including base64-encoded attachments must be under 25 MB; use shareable links (e.g., Google Drive) for larger files. \|
\| \`recipient\_email\` \| string \| No \| Primary recipient's email address. Must be a valid email address (e.g., 'user@example.com') or display name format (e.g., 'John Doe '). A plain name without an email address (e.g., 'John Doe') is NOT valid - the '@' symbol and domain are required. Optional for drafts (recipients can be added later before sending). Use extra\_recipients if you want to send to multiple recipients. \|
\| \`extra\_recipients\` \| array \| No \| Additional 'To' recipients' email addresses (not Cc or Bcc). Each must be a valid email address (e.g., 'user@example.com'), display name format (e.g., 'Jane Doe '), or 'me' for the authenticated user. Plain names without email addresses are NOT valid. Should only be used if recipient\_email is also provided. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Event

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_EVENT\`

Create a Google Calendar event using start\_datetime plus duration fields. The organizer is added as an attendee unless exclude\_organizer is True. By default adds Google Meet link (works for Workspace, gracefully falls back for personal Gmail). Attendees can be email strings (required) or objects with email and optional fields. No conflict checking is performed; use GOOGLECALENDAR\_FREE\_BUSY\_QUERY to detect overlaps before creating. Returns event id and htmlLink nested under data.response\_data. Example: { "start\_datetime": "2025-01-16T13:00:00", "timezone": "America/New\_York", "event\_duration\_hour": 1, "event\_duration\_minutes": 30, "summary": "Client sync", "attendees": \["required@example.com", {"email": "optional@example.com", "optional": true}\] }

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`summary\` \| string \| No \| Summary (title) of the event. \|
\| \`location\` \| string \| No \| Geographic location of the event as free-form text. \|
\| \`timezone\` \| string \| No \| IANA timezone name from the timezone database (e.g., 'America/New\_York', 'Europe/London', 'Asia/Jerusalem', 'UTC'). Required if datetime is naive. For recurring events, start and end must include a timeZone. If not provided, UTC is used. If datetime includes timezone info (Z or offset), this field is optional and defaults to UTC. IMPORTANT: Must be a valid IANA timezone identifier. Values like 'EST', 'PST', 'ISRAEL TIME', or other abbreviations are NOT valid IANA timezone names. \|
\| \`attendees\` \| array \| No \| List of attendees. Each attendee can be either: (1) A string email address (e.g., 'user@example.com'), or (2) An object with 'email' (required), 'optional' (boolean, default false), 'displayName' (string), 'comment' (string), 'additionalGuests' (integer), and 'resource' (boolean). To mark an attendee as optional (not required), use object format: {'email': 'user@example.com', 'optional': true}. IMPORTANT: Only valid email addresses are accepted. Plain names cannot be used. \|
\| \`eventType\` \| string ("birthday" \| "default" \| "focusTime" \| "outOfOffice" \| "workingLocation") \| No \| Type of the event, immutable post-creation. 'workingLocation' (REQUIRES Google Workspace Enterprise). Note: 'fromGmail' events cannot be created via API. \|
\| \`recurrence\` \| array \| No \| List of RRULE, EXRULE, RDATE, EXDATE lines for recurring events. Supported frequencies: DAILY, WEEKLY, MONTHLY, YEARLY. For recurring events, start.timeZone and end.timeZone must be present. UNTIL values follow RFC 5545: date-only (YYYYMMDD) for all-day events, or UTC datetime with Z suffix (YYYYMMDDTHHMMSSZ) for timed events. UNTIL values with time but missing Z suffix are auto-corrected. Provide an empty list to remove recurrence so the event becomes non-recurring. \|
\| \`visibility\` \| string ("default" \| "public" \| "private" \| "confidential") \| No \| Event visibility: 'default', 'public', 'private', or 'confidential'. \|
\| \`calendar\_id\` \| string \| No \| Calendar identifier. Use 'primary' (recommended) for the user's main calendar. Alternatively, use a calendar ID from the user's accessible calendar list. Calendar IDs look like email addresses (e.g., 'xyz@group.calendar.google.com' for shared calendars). Important: Arbitrary email addresses will NOT work - the calendar must exist in the user's calendar list with appropriate access permissions. Use GOOGLECALENDAR\_LIST\_CALENDARS to retrieve valid calendar IDs. \|
\| \`description\` \| string \| No \| Description of the event. Can contain HTML. Optional. Must be omitted for 'birthday' event type. \|
\| \`end\_datetime\` \| string \| No \| Event end time in ISO 8601 format: YYYY-MM-DDTHH:MM:SS. When provided, this parameter takes precedence over event\_duration\_hour and event\_duration\_minutes. If not provided, the end time is calculated using start\_datetime + duration. Must be after start\_datetime. Fractional seconds and timezone info will be automatically stripped if provided. Examples: '2025-01-16T14:30:00', '2025-01-16T14:30'. \|
\| \`send\_updates\` \| string ("all" \| "externalOnly" \| "none") \| No \| Options for who should receive notifications about event changes. \|
\| \`transparency\` \| string ("opaque" \| "transparent") \| No \| 'opaque' (busy) or 'transparent' (available). \|
\| \`start\_datetime\` \| string \| Yes \| REQUIRED. Event start time in ISO 8601 format: YYYY-MM-DDTHH:MM:SS. IMPORTANT: Natural language expressions like 'tomorrow', 'next Monday', '2pm tomorrow' are NOT supported and will be rejected. You must provide the exact date and time in ISO format. Fractional seconds (e.g., .000) and timezone info (Z, +, -) will be automatically stripped if provided. Examples: '2025-01-16T13:00:00', '2025-01-16T13:00'. \|
\| \`guestsCanModify\` \| boolean \| No \| If True, guests can modify the event. \|
\| \`exclude\_organizer\` \| boolean \| No \| If True, the organizer will NOT be added as an attendee. Default is False (organizer is included). \|
\| \`birthdayProperties\` \| object \| No \| Properties for birthday events. \|
\| \`create\_meeting\_room\` \| boolean \| No \| Defaults to True. When True, for CREATE operations creates a Google Meet link; for UPDATE operations preserves existing conference data if present, or adds a new Meet link if none exists. Google Workspace accounts will successfully receive a Meet link. Personal Gmail accounts and other unsupported accounts will gracefully fallback to creating an event without a Meet link when conference creation fails. Set to False to skip Meet link operations (won't create new or modify existing conference data). The fallback ensures event creation succeeds even when conference features are unavailable due to account limitations. \|
\| \`event\_duration\_hour\` \| integer \| No \| Number of hours for the event duration. Supports multi-day events (e.g., 240 hours = 10 days). For durations under 1 hour, use event\_duration\_minutes instead. Ignored if end\_datetime is provided. \|
\| \`extended\_properties\` \| object \| No \| Extended properties of the event for storing custom metadata. Contains 'private' (visible only on this calendar) and/or 'shared' (visible to all attendees) dictionaries mapping string keys to string values. Example: {'private': {'key1': 'value1'}, 'shared': {'key2': 'value2'}} \|
\| \`focusTimeProperties\` \| object \| No \| Properties for focusTime events. REQUIRES Google Workspace Enterprise account with Focus Time feature enabled. \|
\| \`guestsCanInviteOthers\` \| boolean \| No \| Whether attendees other than the organizer can invite others to the event. \|
\| \`outOfOfficeProperties\` \| object \| No \| Properties for outOfOffice events. \|
\| \`event\_duration\_minutes\` \| integer \| No \| Duration in minutes (0-59 ONLY). NEVER use 60+ minutes - use event\_duration\_hour=1 instead. Maximum value is 59. Combined duration (hours + minutes) must be greater than 0. Ignored if end\_datetime is provided. \|
\| \`guestsCanSeeOtherGuests\` \| boolean \| No \| Whether attendees other than the organizer can see who the event's attendees are. \|
\| \`workingLocationProperties\` \| object \| No \| Properties for workingLocation events. REQUIRES Google Workspace Enterprise. Constraints discovered from testing: - Must set transparency='transparent' and visibility='public' - Description must be omitted - Depending on 'type', include one of 'homeOffice', 'officeLocation', or 'customLocation' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Expanded Data Set

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_EXPANDED\_DATA\_SET\`

Tool to create an expanded data set for a property. Use when you need to combine specific dimensions and metrics into a custom dataset after property creation.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Parent property resource name. Format: properties/{propertyId} \|
\| \`expandedDataSet\` \| object \| Yes \| Definition of the ExpandedDataSet to create. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create File or Folder

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_FILE\`

Creates a new file or folder in Google Drive. Supports both metadata-only creation (for folders and empty documents) and file upload with content. When file\_to\_upload is provided, uploads the actual file bytes; otherwise creates an empty file. Native Google file types (Docs, Sheets, Forms, etc.) and folders are created as empty shells when no content is provided; content must be added manually afterward. Newly created files are private by default — set sharing permissions afterward for collaboration. For shared-drive folders, use this tool with the target folder ID in \`parents\` rather than GOOGLEDRIVE\_CREATE\_FOLDER.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| The name of the file. While optional, providing a meaningful name is strongly recommended. If not specified, Google Drive will create the file with name 'Untitled'. \|
\| \`fields\` \| string \| No \| A comma-separated list of fields to include in the response. \|
\| \`parents\` \| array \| No \| Google Drive folder ID (not folder name) where the file will be created. Must be a list with exactly one folder ID (e.g., \['1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs07X8ygaR'\]). Folder IDs are long alphanumeric strings, not human-readable names. Use GOOGLEDRIVE\_FIND\_FOLDER or GOOGLEDRIVE\_LIST\_FILES to look up folder IDs by name. If omitted, the file is created in My Drive root. \|
\| \`starred\` \| boolean \| No \| Whether the user has starred the file. \|
\| \`mimeType\` \| string ("application/vnd.google-apps.folder" \| "application/vnd.google-apps.document" \| "application/vnd.google-apps.spreadsheet" \| "application/vnd.google-apps.presentation" \| "application/vnd.google-apps.drawing" \| "application/vnd.google-apps.form" \| "application/vnd.google-apps.script" \| "application/vnd.google-apps.shortcut" \| "application/vnd.google-apps.site" \| "application/vnd.google-apps.map" \| "application/vnd.google-apps.jam" \| "application/pdf" \| "application/vnd.openxmlformats-officedocument.wordprocessingml.document" \| "application/vnd.oasis.opendocument.text" \| "application/rtf" \| "text/plain" \| "text/html" \| "text/markdown" \| "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" \| "application/vnd.oasis.opendocument.spreadsheet" \| "text/csv" \| "text/tab-separated-values" \| "application/vnd.openxmlformats-officedocument.presentationml.presentation" \| "application/vnd.oasis.opendocument.presentation" \| "image/jpeg" \| "image/png" \| "image/gif" \| "image/bmp" \| "image/webp" \| "image/svg+xml" \| "image/tiff" \| "video/mp4" \| "video/x-msvideo" \| "video/quicktime" \| "video/x-ms-wmv" \| "video/webm" \| "audio/mpeg" \| "audio/wav" \| "audio/ogg" \| "application/zip" \| "application/vnd.rar" \| "application/x-tar" \| "application/gzip" \| "application/x-7z-compressed" \| "application/json" \| "application/xml" \| "application/x-yaml" \| "application/epub+zip" \| "application/octet-stream") \| No \| Common MIME types for Google Drive file creation. \|
\| \`description\` \| string \| No \| A short description of the file. \|
\| \`file\_to\_upload\` \| object \| No \| Optional file content to upload. If provided, the file will be created with the actual content from this upload. If omitted, creates an empty file (for folders) or empty Google Workspace document. Use this when you need to upload actual file bytes (images, PDFs, documents, etc.). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create a File from Text

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_FILE\_FROM\_TEXT\`

Creates a new file in Google Drive from provided text content (up to 10MB), supporting various formats including automatic conversion to Google Workspace types. Returns flat metadata fields (\`id\`, \`mimeType\`, \`name\`) at the top level — not nested under a \`file\` object. Created files are private by default; use a sharing tool afterward for collaborative access. Rapid successive calls may trigger \`403 rateLimitExceeded\` or \`429 userRateLimitExceeded\`; apply exponential backoff between retries. Does not support shared-drive targets in all cases.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_name\` \| string \| Yes \| Required. Desired name for the new file on Google Drive. Also accepts 'title' or 'name' as aliases. \|
\| \`mime\_type\` \| string \| No \| MIME type for the new file, determining how Google Drive interprets its content. Must exactly match the content type — a mismatched value (e.g., \`text/plain\` for HTML) breaks Drive previews and downstream conversion. \|
\| \`parent\_id\` \| string \| No \| IMPORTANT: Must be a valid Google Drive folder ID that exists and you have access to. Do NOT pass folder names - only folder IDs work. If omitted, the file is created in the root of 'My Drive'. To get a folder ID from a folder name, use GOOGLEDRIVE\_FIND\_FOLDER first. Also accepts 'folder\_id' or 'parent\_folder\_id' as aliases. \|
\| \`text\_content\` \| string \| Yes \| Required. Plain text content to be written into the new file. Also accepts 'content', 'body', or 'text' as aliases. Only the documented aliases (\`content\`, \`body\`, \`text\`) are accepted; undocumented keys like \`file\_content\` cause an 'Invalid request data' error. Must be UTF-8 encoded. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Gmail filter

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_FILTER\`

Tool to create a new Gmail filter with specified criteria and actions. Use when the user wants to automatically organize incoming messages based on sender, subject, size, or other criteria. Note: you can only create a maximum of 1,000 filters per account.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`action\` \| object \| Yes \| REQUIRED. Action that the filter will perform on messages matching the criteria. At least one action field must be specified. \|
\| \`user\_id\` \| string \| No \| The user's email address or the special value 'me' to indicate the authenticated user for whom the filter will be created. \|
\| \`criteria\` \| object \| Yes \| REQUIRED. Message matching criteria that determines which messages the filter will apply to. At least one criteria field must be specified. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create a folder

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_FOLDER\`

Creates a new folder in Google Drive, optionally within an EXISTING parent folder specified by its ID or name. The parent folder MUST already exist - use GOOGLEDRIVE\_FIND\_FOLDER first to verify the parent exists or find its ID. Google Drive permits duplicate folder names, so always store and reuse the folder ID returned by this action rather than relying on names for future lookups.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Name for the new folder. This is a required field. \|
\| \`parent\_id\` \| string \| No \| ID or exact name of an EXISTING parent folder. IMPORTANT: The parent folder MUST already exist - this action will NOT create parent folders automatically. If you need to create nested folders, first use GOOGLEDRIVE\_FIND\_FOLDER to verify the parent exists, or create it with a separate call. If a name is provided, the action searches for a folder with that exact name. If omitted, the folder is created in the Drive root. Must be non-trashed, accessible, and an actual folder (not a file) — shared drive root IDs are not valid. Use GOOGLEDRIVE\_FIND\_FOLDER to verify before calling. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Footer

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_FOOTER\`

Tool to create a new footer in a Google Document. Use when you need to add a footer, optionally specifying its type and the section it applies to.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string ("DEFAULT") \| Yes \| The type of footer to create. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document to create the footer in. \|
\| \`section\_break\_location\` \| object \| No \| The location of the SectionBreak immediately preceding the section whose SectionStyle this footer should belong to. If this is unset or refers to the first section break in the document, the footer applies to the document style. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Footnote

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_FOOTNOTE\`

Tool to create a new footnote in a Google Document. Use this when you need to add a footnote at a specific location or at the end of the document body.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`location\` \| object \| No \| Inserts the footnote reference at a specific index in the document. The segmentId within this Location object must be empty as footnotes can only be inserted in the document body. \|
\| \`documentId\` \| string \| Yes \| The ID of the document to create the footnote in. \|
\| \`endOfSegmentLocation\` \| object \| No \| Inserts the footnote reference at the end of the document body. The segmentId within this EndOfSegmentLocation object must be empty. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create a Google Sheet

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_GOOGLE\_SHEET1\`

Creates a new Google Spreadsheet in Google Drive. If a title is provided, the spreadsheet will be created with that name. If no title is provided, Google will create a spreadsheet with a default name like 'Untitled spreadsheet'. Optionally create the spreadsheet in a specific folder by providing either: - folder\_id: The Google Drive folder ID (preferred, unambiguous) - folder\_name: The folder name (searches for exact match; if multiple folders match, returns choices) If neither folder\_id nor folder\_name is provided, the spreadsheet is created in the root Drive folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| No \| The title for the new Google Sheet. If omitted, Google will create a spreadsheet with a default name like 'Untitled spreadsheet'. \|
\| \`folder\_id\` \| string \| No \| Google Drive folder ID where the spreadsheet should be created. If provided, the spreadsheet will be moved to this folder after creation. Takes precedence over folder\_name. \|
\| \`folder\_name\` \| string \| No \| Google Drive folder name where the spreadsheet should be created. If provided and folder\_id is not provided, the action will search for a folder with this exact name. If multiple folders match, you'll receive a list to choose from. If no folder matches, an error is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Header

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_HEADER\`

Tool to create a new header in a Google Document, optionally with text content. Use this tool when you need to add a header to a document. You can provide: - document\_id: The ID of the document (required) - type: The header type (DEFAULT is the standard header) - text: Optional text content to add to the header - section\_break\_location: Optional location for section-specific headers

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`text\` \| string \| No \| Optional text content to add to the header after creation. If provided, the text will be inserted into the header at index 0. \|
\| \`type\` \| string ("HEADER\_FOOTER\_TYPE\_UNSPECIFIED" \| "DEFAULT") \| No \| The type of header to create. Use 'DEFAULT' for the standard document header. Only one DEFAULT header can exist per document; if one already exists, the existing header ID will be returned. \|
\| \`documentId\` \| string \| Yes \| The ID of the document to create the header in. \|
\| \`sectionBreakLocation\` \| object \| No \| The location of the SectionBreak which begins the section this header should belong to. Only needed for section-specific headers. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create label

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_LABEL\`

Creates a new label with a unique name in the specified user's Gmail account. Returns a labelId (e.g., 'Label\_123') required for downstream tools like GMAIL\_ADD\_LABEL\_TO\_EMAIL, GMAIL\_BATCH\_MODIFY\_MESSAGES, and GMAIL\_MODIFY\_THREAD\_LABELS — those tools do not accept display names.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The email address of the user in whose account the label will be created. \|
\| \`label\_name\` \| string \| Yes \| REQUIRED. The name for the new label. Must be unique within the account, non-blank, maximum length 225 characters, cannot contain commas (','), not only whitespace, and must not be a reserved system label. Reserved English system labels include: Inbox, Starred, Important, Sent, Draft, Drafts, Spam, Trash, etc. Forward slashes ('/') are allowed and used to create hierarchical nested labels (e.g., 'Work/Projects', 'Personal/Finance'). When creating nested labels, any missing parent labels will be automatically created (similar to 'mkdir -p'). Periods ('.') are allowed and commonly used for numbering schemes (e.g., '1. Action Items', '2. Projects'). Note: 'name' is also accepted as an alias for this field. If a label with this name already exists, returns a 409 conflict; use GMAIL\_LIST\_LABELS to check existing labels and reuse the existing labelId, or use GMAIL\_PATCH\_LABEL to update it. \|
\| \`text\_color\` \| string ("#000000" \| "#434343" \| "#666666" \| "#999999" \| "#cccccc" \| "#efefef" \| "#f3f3f3" \| "#ffffff" \| "#fb4c2f" \| "#ffad47" \| "#fad165" \| "#16a766" \| "#43d692" \| "#4a86e8" \| "#a479e2" \| "#f691b3" \| "#f6c5be" \| "#ffe6c7" \| "#fef1d1" \| "#b9e4d0" \| "#c6f3de" \| "#c9daf8" \| "#e4d7f5" \| "#fcdee8" \| "#efa093" \| "#ffd6a2" \| "#fce8b3" \| "#89d3b2" \| "#a0eac9" \| "#a4c2f4" \| "#d0bcf1" \| "#fbc8d9" \| "#e66550" \| "#ffbc6b" \| "#fcda83" \| "#44b984" \| "#68dfa9" \| "#6d9eeb" \| "#b694e8" \| "#f7a7c0" \| "#cc3a21" \| "#eaa041" \| "#f2c960" \| "#149e60" \| "#3dc789" \| "#3c78d8" \| "#8e63ce" \| "#e07798" \| "#ac2b16" \| "#cf8933" \| "#d5ae49" \| "#0b804b" \| "#2a9c68" \| "#285bac" \| "#653e9b" \| "#b65775" \| "#464646" \| "#e7e7e7" \| "#0d3472" \| "#b6cff5" \| "#0d3b44" \| "#98d7e4" \| "#3d188e" \| "#e3d7ff" \| "#711a36" \| "#fbd3e0" \| "#8a1c0a" \| "#f2b2a8" \| "#7a2e0b" \| "#ffc8af" \| "#7a4706" \| "#ffdeb5" \| "#594c05" \| "#fbe983" \| "#684e07" \| "#fdedc1" \| "#0b4f30" \| "#b3efd3" \| "#04502e" \| "#a2dcc1" \| "#c2c2c2" \| "#4986e7" \| "#2da2bb" \| "#b99aff" \| "#994a64" \| "#f691b2" \| "#ff7537" \| "#ffad46" \| "#662e37" \| "#cca6ac" \| "#094228" \| "#42d692" \| "#076239" \| "#16a765" \| "#1a764d" \| "#1c4587" \| "#41236d" \| "#822111" \| "#83334c" \| "#a46a21" \| "#aa8831" \| "#ebdbde") \| No \| Text color for the label. Gmail only accepts colors from a predefined palette of 102 specific hex values. Common color names like 'YELLOW', 'RED', 'BLUE', 'GREEN', 'ORANGE', 'PURPLE', 'PINK' are automatically mapped to the closest Gmail palette color. Provide either a common color name, a Gmail palette color name (e.g., 'BLACK', 'ROYAL\_BLUE'), or exact hex value (e.g., '#000000', '#4a86e8'). If only text\_color is provided without background\_color, a complementary background color (white or black) will be auto-selected for optimal contrast. Full palette: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels#Color Must be supplied together with background\_color — providing only one will cause a 400 error. The auto-selected complementary color behavior does not apply; both colors are required. \|
\| \`background\_color\` \| string ("#000000" \| "#434343" \| "#666666" \| "#999999" \| "#cccccc" \| "#efefef" \| "#f3f3f3" \| "#ffffff" \| "#fb4c2f" \| "#ffad47" \| "#fad165" \| "#16a766" \| "#43d692" \| "#4a86e8" \| "#a479e2" \| "#f691b3" \| "#f6c5be" \| "#ffe6c7" \| "#fef1d1" \| "#b9e4d0" \| "#c6f3de" \| "#c9daf8" \| "#e4d7f5" \| "#fcdee8" \| "#efa093" \| "#ffd6a2" \| "#fce8b3" \| "#89d3b2" \| "#a0eac9" \| "#a4c2f4" \| "#d0bcf1" \| "#fbc8d9" \| "#e66550" \| "#ffbc6b" \| "#fcda83" \| "#44b984" \| "#68dfa9" \| "#6d9eeb" \| "#b694e8" \| "#f7a7c0" \| "#cc3a21" \| "#eaa041" \| "#f2c960" \| "#149e60" \| "#3dc789" \| "#3c78d8" \| "#8e63ce" \| "#e07798" \| "#ac2b16" \| "#cf8933" \| "#d5ae49" \| "#0b804b" \| "#2a9c68" \| "#285bac" \| "#653e9b" \| "#b65775" \| "#464646" \| "#e7e7e7" \| "#0d3472" \| "#b6cff5" \| "#0d3b44" \| "#98d7e4" \| "#3d188e" \| "#e3d7ff" \| "#711a36" \| "#fbd3e0" \| "#8a1c0a" \| "#f2b2a8" \| "#7a2e0b" \| "#ffc8af" \| "#7a4706" \| "#ffdeb5" \| "#594c05" \| "#fbe983" \| "#684e07" \| "#fdedc1" \| "#0b4f30" \| "#b3efd3" \| "#04502e" \| "#a2dcc1" \| "#c2c2c2" \| "#4986e7" \| "#2da2bb" \| "#b99aff" \| "#994a64" \| "#f691b2" \| "#ff7537" \| "#ffad46" \| "#662e37" \| "#cca6ac" \| "#094228" \| "#42d692" \| "#076239" \| "#16a765" \| "#1a764d" \| "#1c4587" \| "#41236d" \| "#822111" \| "#83334c" \| "#a46a21" \| "#aa8831" \| "#ebdbde") \| No \| Background color for the label. Gmail only accepts colors from a predefined palette of 102 specific hex values. Common color names like 'YELLOW', 'RED', 'BLUE', 'GREEN', 'ORANGE', 'PURPLE', 'PINK' are automatically mapped to the closest Gmail palette color. Provide either a common color name, a Gmail palette color name (e.g., 'ROYAL\_BLUE', 'CARIBBEAN\_GREEN'), or exact hex value (e.g., '#4a86e8', '#43d692'). If only background\_color is provided without text\_color, a complementary text color (white or black) will be auto-selected for optimal contrast. Full palette: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels#Color Must be supplied together with text\_color — providing only one will cause a 400 error. The auto-selected complementary color behavior does not apply; both colors are required. \|
\| \`label\_list\_visibility\` \| string ("labelShow" \| "labelShowIfUnread" \| "labelHide") \| No \| Controls how the label is displayed in the label list in the Gmail sidebar. Valid values: 'labelShow' (always show), 'labelShowIfUnread' (show only if unread messages), 'labelHide' (hide from list). \|
\| \`message\_list\_visibility\` \| string ("show" \| "hide") \| No \| Controls how messages with this label are displayed in the message list. Valid values: 'show' or 'hide'. Note: These values are different from label\_list\_visibility - do NOT use 'labelShow' or 'labelHide' here. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Google Meet Space

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_MEET\`

Creates a new Google Meet space with optional configuration. Does not attach to any calendar event — calendar linking requires a separate Calendar tool call. Capture \`meetingUri\`, \`meetingCode\`, and \`space.name\` from the response immediately for downstream lookups. Requires \`meetings.space.created\` OAuth scope. Returns HTTP 429 under rapid calls; apply exponential backoff. Use when you need a meeting space with specific access controls, moderation, recording, or transcription settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`config\` \| object \| No \| Optional configuration for the meeting space. If not provided, default settings will be used. Key sub-fields: \`accessType\` and \`entryPointAccess\` default to permissive values — set explicitly when audience or access level is known, as permissive defaults may conflict with organizational policies. Invalid combinations of these fields or moderation settings may be rejected based on domain/account policies. Recording and transcription features require a Workspace edition that supports cloud recording; personal accounts may not support these options. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Named Range

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_NAMED\_RANGE\`

Tool to create a new named range in a Google Document. Use this to assign a name to a specific part of the document for easier reference or programmatic manipulation.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| The name for the new named range. Must be 1-256 characters. \|
\| \`tabId\` \| string \| No \| Optional. The ID of the document tab containing this range. When omitted, Google Docs applies the request to the first tab. \|
\| \`documentId\` \| string \| Yes \| The ID of the document where the named range will be created. \|
\| \`rangeEndIndex\` \| integer \| Yes \| The zero-based end index of the range. \|
\| \`rangeSegmentId\` \| string \| No \| Optional. The ID of the header, footer, or footnote. Empty for document body. \|
\| \`rangeStartIndex\` \| integer \| Yes \| The zero-based start index of the range. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Paragraph Bullets

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_PARAGRAPH\_BULLETS\`

Tool to add bullets to paragraphs within a specified range in a Google Document. Use when you need to format a list or a set of paragraphs as bullet points.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tabId\` \| string \| No \| Optional tab ID to apply to createParagraphBullets.range.tabId. When omitted, Google Docs applies the request to the first tab. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document to update. \|
\| \`createParagraphBullets\` \| object \| Yes \| The request body for creating paragraph bullets in the document. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Permission

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_PERMISSION\`

Tool to create a permission for a file or shared drive. Use when you need to share a file or folder with users, groups, domains, or make it publicly accessible. \*\*Warning:\*\* Concurrent permissions operations on the same file are not supported; only the last update is applied.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`role\` \| string ("owner" \| "organizer" \| "fileOrganizer" \| "writer" \| "commenter" \| "reader") \| Yes \| The role granted by this permission. Valid values are: owner, organizer, fileOrganizer, writer, commenter, reader. \|
\| \`type\` \| string ("user" \| "group" \| "domain" \| "anyone") \| Yes \| The type of the grantee. When creating a permission, if type is 'user' or 'group', you must provide an emailAddress. When type is 'domain', you must provide a domain. There isn't extra information required for 'anyone' type. \|
\| \`domain\` \| string \| No \| The domain to which this permission refers. Required when type is 'domain'. \|
\| \`file\_id\` \| string \| Yes \| The ID of the file or shared drive. \|
\| \`email\_address\` \| string \| No \| The email address of the user or group to which this permission refers. Required when type is 'user' or 'group'. \|
\| \`email\_message\` \| string \| No \| A plain text custom message to include in the notification email. \|
\| \`expiration\_time\` \| string \| No \| The time at which this permission will expire (RFC 3339 date-time). Expiration times can only be set on user and group permissions, must be in the future, and cannot be more than a year in the future. \|
\| \`transfer\_ownership\` \| boolean \| No \| Whether to transfer ownership to the specified user and downgrade the current owner to a writer. This parameter is required as an acknowledgement of the side effect. \|
\| \`supports\_all\_drives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. \|
\| \`allow\_file\_discovery\` \| boolean \| No \| Whether the permission allows the file to be discovered through search. This is only applicable for permissions of type 'domain' or 'anyone'. \|
\| \`move\_to\_new\_owners\_root\` \| boolean \| No \| This parameter will only take effect if the item is not in a shared drive and the request is attempting to transfer the ownership of the item. If set to true, the item will be moved to the new owner's My Drive root folder and all prior parents removed. If set to false, parents are not changed. \|
\| \`send\_notification\_email\` \| boolean \| No \| Whether to send a notification email when sharing to users or groups. This defaults to true for users and groups, and is not allowed for other requests. It must not be disabled for ownership transfers. \|
\| \`use\_domain\_admin\_access\` \| boolean \| No \| Issue the request as a domain administrator; if set to true, then the requester will be granted access if the file ID parameter refers to a shared drive and the requester is an administrator of the domain to which the shared drive belongs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Permissions Batch

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_PERMISSIONS\_BATCH\`

Creates multiple permissions for files or shared drives in a single batch request. Use this action when you need to share multiple files with users, or share a single file with multiple users or groups simultaneously. Each permission in the batch can target a different file and specify different access levels. Batch operations are more efficient than creating permissions individually, with a maximum of 100 permissions per batch.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`permissions\` \| array \| Yes \| A list of permissions to create. Each permission specifies the file\_id, type, role, and other details. Maximum 100 permissions per batch request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Google Slides Presentation

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_PRESENTATION\`

Tool to create a blank Google Slides presentation. Use when you need to initialize a new presentation with a specific title, locale, or page size.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| No \| The title of the presentation. If omitted, the API uses a default title. \|
\| \`locale\` \| string \| No \| The locale of the presentation, as an IETF BCP 47 language tag (e.g., 'en-US', 'fr-FR', 'ja-JP'). If omitted, the API uses a default locale. \|
\| \`pageSize\` \| object \| No \| The size of a page in the presentation. \|
\| \`presentationId\` \| string \| No \| The ID to use for the new presentation. If provided, it is used as the ID of the new presentation. Otherwise, a new ID is automatically generated. Must be a valid Google Drive/Slides ID format (long alphanumeric string). Note: Human-readable IDs (e.g., 'my-presentation') are not valid and will cause API errors. Only provide this if you have a valid Google Drive/Slides ID format; otherwise omit to let the API generate one. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Prompt Post

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_PROMPT\_POST\`

Send a one-shot prompt to the Sanity Content Agent. Stateless one-shot prompt endpoint. No thread management or message persistence. Ideal for simple, single-turn interactions. Use when you need to send a single prompt and receive a response without maintaining conversation context.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`config\` \| object \| No \| Agent configuration. Controls behavior, capabilities, and document access. \|
\| \`format\` \| string ("markdown" \| "directives") \| No \| Controls how directives in the response are formatted. \|
\| \`message\` \| string \| Yes \| The prompt message to send to the agent \|
\| \`instructions\` \| string \| No \| Custom instructions for the agent \|
\| \`organizationId\` \| string \| Yes \| Your Sanity organization ID \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Recurring Audience List

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_RECURRING\_AUDIENCE\_LIST\`

Tool to create a recurring audience list that automatically generates new audience lists daily based on the latest data. Use when you need to automate audience list creation and reduce quota token consumption.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Parent property resource name where the recurring audience list will be created. Format: properties/{property\_id}. \|
\| \`audience\` \| string \| Yes \| Audience resource name identifying the audience being listed. Format: properties/{property\_id}/audiences/{audience\_id}. \|
\| \`dimensions\` \| array \| Yes \| List of dimensions requested and displayed in the audience list response. \|
\| \`activeDaysRemaining\` \| integer \| No \| Counter decreasing daily. Defaults to 180 days for Analytics 360 properties (max 365) and 14 days for standard properties (max 30). \|
\| \`webhookNotification\` \| object \| No \| Configuration for receiving webhook notifications about recurring audience list status. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Reply

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_REPLY\`

Tool to create a reply to a comment in Google Drive. Use when you need to respond to an existing comment on a file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`action\` \| string ("resolve" \| "reopen") \| No \| The action the reply performed to the parent comment. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`content\` \| string \| Yes \| The plain text content of the reply. HTML content is not supported. \|
\| \`file\_id\` \| string \| Yes \| The ID of the file. \|
\| \`comment\_id\` \| string \| Yes \| The ID of the comment. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Report Task

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_REPORT\_TASK\`

Tool to create a report task as a long-running asynchronous request for customized Google Analytics event data reports. Use when you need to generate large or complex reports that process asynchronously.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. Property identifier in format 'properties/{propertyId}'. The Google Analytics property for which to create the report task. \|
\| \`reportDefinition\` \| object \| No \| Defines how the report executes. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Rollup Property

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_ROLLUP\_PROPERTY\`

Tool to create a roll-up property. Use when consolidating multiple GA4 properties into one aggregated view.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`account\` \| string \| Yes \| Required. Parent account resource. Format: accounts/{account\_id} \|
\| \`timeZone\` \| string \| Yes \| Required. IANA time zone for the roll-up property. \|
\| \`displayName\` \| string \| Yes \| Required. Display name for the roll-up property. \|
\| \`sourceProperties\` \| array \| No \| Optional. List of source property resource names to link. Format: properties/{property\_id}. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Shortcut to File/Folder

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_SHORTCUT\_TO\_FILE\`

Tool to create a shortcut to a file or folder in Google Drive. Use when you need to link to an existing Drive item from another location without duplicating it. The shortcut receives its own distinct file ID (capture from response). No parent folder parameter exists; use GOOGLEDRIVE\_MOVE\_FILE after creation to place the shortcut in the desired location.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| The name of the shortcut. \|
\| \`target\_id\` \| string \| Yes \| The ID of the file or folder that this shortcut points to. \|
\| \`includeLabels\` \| string \| No \| A comma-separated list of IDs of labels to include in the labelInfo part of the response. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Recommended to set to true if interacting with shared drives. \|
\| \`keepRevisionForever\` \| boolean \| No \| Whether to set the 'keepForever' field in the new head revision. \|
\| \`ignoreDefaultVisibility\` \| boolean \| No \| Whether to ignore the domain's default visibility settings for the created file. \|
\| \`includePermissionsForView\` \| string ("published") \| No \| Enum for includePermissionsForView parameter. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Slides from Markdown

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_SLIDES\_MARKDOWN\`

Creates a new Google Slides presentation from Markdown text. Automatically splits content into slides using '---' separators and applies appropriate templates based on content structure.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| Yes \| The title for the new Google Slides presentation. \|
\| \`markdown\_text\` \| string \| Yes \| The content for the slides, formatted as Markdown. THEME SELECTION: Add \`Theme: \` at the start of your markdown. Available themes: default, corporate\_blue, modern\_dark, professional\_gray, creative\_purple, warm\_orange, forest\_green, minimal\_beige. SLIDE SEPARATION: Use ' --- ' (on its own line) to separate slides. Each slide auto-detects its type. SLIDE TYPES: 1. Title Slide (first slide): \`# Title Subtitle text\` 2. Bullet Slides: Use \`-\`, \`\*\`, or bullet characters for bullets 3. Table Slides: Standard markdown tables 4. Quote Slides: \`> Quote text\` 5. Text Slides: Regular paragraphs 6. Image Slides: \`!\[description\](URL)\` 7. Two-Column Slides: Use \`\|\|\|\` on its own line to split left/right IMAGE REQUIREMENTS: Images must be publicly accessible PNG/JPEG/GIF under 50MB. No auth-requiring URLs. FORMATTING: Use \`\*\*text\*\*\` for bold. Emojis supported. Line breaks preserved. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create spreadsheet column

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_SPREADSHEET\_COLUMN\`

Creates a new column in a Google Spreadsheet. Specify the target sheet using sheet\_id (numeric) or sheet\_name (text). If neither is provided, defaults to the first sheet (sheet\_id=0).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sheet\_id\` \| integer \| No \| The numeric identifier of the specific sheet (tab) within the spreadsheet. Defaults to 0 (the first sheet) if neither sheet\_id nor sheet\_name is provided. Use GOOGLESHEETS\_GET\_SHEET\_NAMES or GOOGLESHEETS\_FIND\_WORKSHEET\_BY\_TITLE to obtain the sheet\_id from a sheet name. \|
\| \`sheet\_name\` \| string \| No \| The name (title) of the sheet/tab where the column will be added. If provided, the action will look up the sheet\_id automatically. If both sheet\_id and sheet\_name are provided, sheet\_id takes precedence. \|
\| \`insert\_index\` \| integer \| No \| The 0-based index at which the new column will be inserted. For example, an index of 0 inserts the column before the current first column (A), and an index of 1 inserts it between the current columns A and B. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet where the column will be created. \|
\| \`response\_ranges\` \| array \| No \| Limits the ranges of the spreadsheet to include in the response. Only used if includeSpreadsheetInResponse is true. \|
\| \`inherit\_from\_before\` \| boolean \| No \| If true, the new column inherits properties (e.g., formatting, width) from the column immediately to its left (the preceding column). If false (default), it inherits from the column immediately to its right (the succeeding column). This is ignored if there is no respective preceding or succeeding column. \|
\| \`response\_include\_grid\_data\` \| boolean \| No \| If true, grid data will be included in the response (only used if includeSpreadsheetInResponse is true). \|
\| \`include\_spreadsheet\_in\_response\` \| boolean \| No \| If true, the updated spreadsheet will be included in the response. Defaults to true if not specified. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create spreadsheet row

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_SPREADSHEET\_ROW\`

Inserts a new, empty row into a specified sheet of a Google Spreadsheet at a given index, optionally inheriting formatting from the row above.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sheet\_id\` \| integer \| No \| The numeric identifier of the sheet (tab) within the spreadsheet where the row will be inserted. This ID (gid) is found in the URL of the spreadsheet (e.g., '0' for the first sheet). Either sheet\_id or sheet\_name must be provided. \|
\| \`sheet\_name\` \| string \| No \| The human-readable name of the sheet (tab) within the spreadsheet where the row will be inserted (e.g., 'Sheet1'). Either sheet\_id or sheet\_name must be provided. If both are provided, sheet\_id takes precedence. \|
\| \`insert\_index\` \| integer \| No \| The 0-based index at which the new row should be inserted. For example, an index of 0 inserts the row at the beginning of the sheet. If the index is greater than the current number of rows, the row is appended. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet. Can be provided as the ID (e.g., '1qpyC0XzHc\_-\_d824s2VfopkHh7D0jW4aXCS1D\_AlGA') or as a full URL (the ID will be extracted automatically). \|
\| \`response\_ranges\` \| array \| No \| Limits the ranges included in the response spreadsheet. Only meaningful when include\_spreadsheet\_in\_response is True. Use A1 notation (e.g., \['Sheet1!A1:D10'\]). \|
\| \`inherit\_from\_before\` \| boolean \| No \| If True, the newly inserted row will inherit formatting and properties from the row immediately preceding its insertion point. If False, it will have default formatting. \|
\| \`response\_include\_grid\_data\` \| boolean \| No \| If True, grid data will be included in the response spreadsheet. Only meaningful when include\_spreadsheet\_in\_response is True. Default is False. \|
\| \`include\_spreadsheet\_in\_response\` \| boolean \| No \| If True, the response will include the full updated Spreadsheet resource. Default behavior includes the spreadsheet when this parameter is not specified. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Document Tab

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_TAB\`

Creates a new tab in a Google Docs document. Tabs allow you to organize document content into separate sections within a single document. Use this action when you need to add a new organizational tab to a document. When a tab is added at a specified index, all subsequent tabs' indexes are automatically incremented.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`document\_id\` \| string \| Yes \| The unique identifier of the Google Docs document where the tab will be created. This ID can be found in the document's URL. \|
\| \`tab\_properties\` \| object \| No \| Properties of a tab to be created. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create a task list

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_TASK\_LIST\`

Creates a new task list with the specified title and returns a tasklist\_id. Use the returned tasklist\_id (not the title) when calling GOOGLETASKS\_INSERT\_TASK or other task operations. Duplicate titles are permitted by the API, so verify existing lists before creating to avoid unintended duplicates.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tasklist\_title\` \| string \| Yes \| Title for the new task list. The maximum allowed length is 1024 characters. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Team Drive (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_CREATE\_TEAM\_DRIVE\`

Tool to create a Team Drive. Deprecated: Use drives.create instead. Use when you need to create a Team Drive for collaboration.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| The name of this Team Drive. This is a required field. \|
\| \`themeId\` \| string \| No \| The ID of the theme from which the background image and color will be set. The set of possible teamDriveThemes can be retrieved from a drive.about.get response. When not specified on a drive.teamdrives.create request, a random theme is chosen from which the background image and color are set. This is a write-only field; it can only be set on requests that don't set colorRgb or backgroundImageFile. \|
\| \`colorRgb\` \| string \| No \| The color of this Team Drive as an RGB hex string. It can only be set on a drive.teamdrives.update request that does not set themeId. \|
\| \`requestId\` \| string \| No \| Optional. An ID for idempotent creation of a Team Drive. If not provided, a UUID will be auto-generated. Each requestId can only be used ONCE to successfully create a Team Drive. If retrying a request that succeeded previously with the same requestId, the existing Team Drive will be returned or a 409 error will occur. \|
\| \`backgroundImageFile\` \| object \| No \| An image file and cropping parameters from which a background image for this Team Drive is set. This is a write only field; it can only be set on drive.teamdrives.update requests that don't set themeId. When specified, all fields of the backgroundImageFile must be set. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Chart from Google Sheets

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_CHART\`

Delete an existing chart from a Google Sheets spreadsheet. Use this action when you need to remove a chart that is no longer needed or needs to be replaced. This action is irreversible — once a chart is deleted, it cannot be recovered. The chart data source (the cells containing the data) remains unchanged; only the chart visualization is removed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`chart\_id\` \| integer \| Yes \| The unique numeric identifier of the chart to delete (also known as objectId or chartId). This is the chart's ID within the spreadsheet, not the sheet ID. You can retrieve chart IDs using the 'Get Spreadsheet Info' action - look for sheets\[\].charts\[\].chartId in the response. Each chart has a unique ID that persists until the chart is deleted. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Sheets spreadsheet containing the chart to delete. Must be the actual spreadsheet ID from the URL (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'), NOT the spreadsheet name or title. Find it in the URL: https://docs.google.com/spreadsheets/d/SPREADSHEET\_ID/edit \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Child (v2)

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_CHILD\`

Tool to remove a child from a folder using Google Drive API v2. Use when you need to remove a file from a specific folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format enum. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`childId\` \| string \| Yes \| The ID of the child. \|
\| \`callback\` \| string \| No \| JSONP \|
\| \`folderId\` \| string \| Yes \| The ID of the folder. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. "media", "multipart"). \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. "raw", "multipart"). \|
\| \`enforceSingleParent\` \| boolean \| No \| Deprecated: If an item is not in a shared drive and its last parent is removed, the item is placed under its owner's root. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Comment

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_COMMENT\`

Permanently deletes a comment thread (and all its replies) from a Google Drive file — this action is irreversible. To remove only a single reply within a thread, use GOOGLEDRIVE\_DELETE\_REPLY instead. Verify the exact comment content and comment\_id before calling.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The ID of the file. \|
\| \`comment\_id\` \| string \| Yes \| The ID of the comment. Comment IDs are different from file IDs and have a distinct format (e.g., 'AAAByC37kko'). You must obtain the comment ID from the LIST\_COMMENTS or CREATE\_COMMENT actions. Do NOT use the file ID here. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Content Range in Document

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_CONTENT\_RANGE\`

Tool to delete a range of content from a Google Document. Use when you need to remove a specific portion of text or other structural elements within a document. Note: Every segment (body, header, footer, footnote) in Google Docs ends with a final newline character that cannot be deleted. Ensure the endIndex does not include this trailing newline.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`range\` \| object \| Yes \| The range of content to delete. Deleting text across paragraph boundaries may merge paragraphs and affect styles. Certain deletions can invalidate document structure (e.g., part of a surrogate pair, last newline of critical elements, incomplete deletion of tables/equations). IMPORTANT: The endIndex must not include the final newline character at the end of a segment (body, header, footer, footnote), as this newline cannot be deleted. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document from which to delete content. This ID can be found in the URL of the Google Doc. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Dimension (Rows/Columns)

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_DIMENSION\`

Tool to delete specified rows or columns from a sheet in a Google Spreadsheet. Use when you need to remove a range of rows or columns.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sheet\_id\` \| integer \| No \| The unique numeric ID of the sheet (not the index/position). This ID is assigned by Google Sheets and does not change when sheets are reordered. Use GOOGLESHEETS\_GET\_SPREADSHEET\_INFO to find the sheet ID, or use sheet\_name instead. Either sheet\_id or sheet\_name must be provided. \|
\| \`dimension\` \| string ("ROWS" \| "COLUMNS") \| No \| The dimension to delete (ROWS or COLUMNS). \|
\| \`end\_index\` \| integer \| No \| The zero-based end index of the range to delete, exclusive. Must be greater than start\_index and at most equal to the sheet's current row/column count. Note: Cannot delete all rows or columns from a sheet - at least one row and one column must remain. \|
\| \`sheet\_name\` \| string \| No \| The name/title of the sheet from which to delete the dimension. Using sheet\_name is recommended as it's more intuitive than sheet\_id. Either sheet\_id or sheet\_name must be provided. \|
\| \`start\_index\` \| integer \| No \| The zero-based start index of the range to delete, inclusive. Must be less than end\_index and within the sheet's current row/column count. Note: Cannot delete all rows or columns from a sheet - at least one row and one column must remain. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The ID of the spreadsheet. \|
\| \`response\_ranges\` \| array \| No \| Limits the ranges of cells included in the response spreadsheet. \|
\| \`delete\_dimension\_request\` \| object \| No \| The details for the delete dimension request object. \|
\| \`response\_include\_grid\_data\` \| boolean \| No \| True if grid data should be returned. This parameter is ignored if a field mask was set in the request. \|
\| \`include\_spreadsheet\_in\_response\` \| boolean \| No \| Determines if the update response should include the spreadsheet resource. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Draft

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_DRAFT\`

Permanently deletes a specific Gmail draft using its ID with no recovery possible; verify the correct \`draft\_id\` and obtain explicit user confirmation before calling. Ensure the draft exists and the user has necessary permissions for the given \`user\_id\`.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| User's email address or 'me' for the authenticated user; 'me' is recommended. \|
\| \`draft\_id\` \| string \| Yes \| Immutable ID of the draft to delete. Must be obtained from GMAIL\_LIST\_DRAFTS or GMAIL\_CREATE\_EMAIL\_DRAFT actions. Draft IDs typically have an 'r' prefix (e.g., 'r-1234567890' or 'r1234567890'). Draft IDs differ from message IDs used in GMAIL\_BATCH\_DELETE\_MESSAGES — do not interchange. When multiple similar drafts exist, confirm the exact ID via GMAIL\_LIST\_DRAFTS before deleting. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Shared Drive

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_DRIVE\`

Tool to permanently delete a shared drive. Use when you need to remove a shared drive and its contents (if specified).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`driveId\` \| string \| Yes \| The ID of the shared drive. \|
\| \`allowItemDeletion\` \| boolean \| No \| Whether any items inside the shared drive should also be deleted. This option is only supported when \`useDomainAdminAccess\` is also set to \`true\`. \|
\| \`useDomainAdminAccess\` \| boolean \| No \| Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the shared drive belongs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete event

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_EVENT\`

Deletes a specified event by \`event\_id\` from a Google Calendar (\`calendar\_id\`); idempotent — a 404 for an already-deleted event is a no-op. Bulk deletions may trigger \`rateLimitExceeded\` or \`userRateLimitExceeded\`; cap concurrency to 5–10 requests and apply exponential backoff.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_id\` \| string \| Yes \| Unique identifier of the event to delete. For standalone events, use the base event ID (e.g., 'abc123def456'). For recurring event instances, use the instance ID format 'baseEventId\_YYYYMMDDTHHMMSSZ' (e.g., 'abc123def456\_20260522T093000Z') where the timestamp suffix represents the instance's original start time in UTC. Instance IDs can be obtained from the EVENTS\_INSTANCES action. To delete ALL occurrences of a recurring event, use the base event ID without the timestamp suffix. Must be the internal API identifier from a prior API response — UI-visible identifiers, URL-encoded variants, or shortened IDs are invalid and cause 404/validation errors. \|
\| \`calendar\_id\` \| string \| No \| Identifier of the Google Calendar (e.g., email address, specific ID, or 'primary' for the authenticated user's main calendar) from which the event will be deleted. Read-only or subscribed calendars (calendars not owned by the authenticated user) return 403 on deletion attempts. \|
\| \`send\_updates\` \| string ("all" \| "externalOnly" \| "none") \| No \| Options for who should receive notifications about event changes. \|
\| \`send\_notifications\` \| boolean \| No \| Deprecated. Whether to send notifications about the deletion of the event. Note that some emails might still be sent. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete file

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_FILE\`

DEPRECATED: Use GOOGLEDRIVE\_GOOGLE\_DRIVE\_DELETE\_FOLDER\_OR\_FILE\_ACTION instead. Tool to permanently delete a file owned by the user without moving it to trash. Use when permanent deletion is required. If the file belongs to a shared drive, the user must be an organizer on the parent folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The ID of the file to delete. This permanently removes the file without moving it to trash. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Set to true if the file might be in a shared drive. \|
\| \`enforceSingleParent\` \| boolean \| No \| Deprecated parameter. If an item is not in a shared drive and its last parent is deleted but the item itself is not, the item is placed under its owner's root. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Gmail filter

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_FILTER\`

Tool to permanently delete a Gmail filter by its ID. Use when you need to remove an existing email filtering rule.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| User's email address or 'me' for the authenticated user. \|
\| \`filter\_id\` \| string \| Yes \| The ID of the filter to be deleted. Filter IDs can be obtained from GMAIL\_LIST\_FILTERS action. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Footer

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_FOOTER\`

Tool to delete a footer from a Google Document. Use when you need to remove a footer from a specific section or the default footer.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tab\_id\` \| string \| No \| The tab that contains the footer to delete. When omitted, the request is applied to the first tab. \|
\| \`footer\_id\` \| string \| Yes \| The ID of the footer to delete. Footer IDs are system-generated strings created by Google Docs. Obtain a valid footer ID from: (1) GOOGLEDOCS\_CREATE\_FOOTER response (footer\_id field), or (2) GOOGLEDOCS\_GET\_DOCUMENT\_BY\_ID (footers dictionary keys). Do not use made-up or placeholder values. If this footer is defined on DocumentStyle, the reference to this footer is removed, resulting in no footer of that type for the first section of the document. If this footer is defined on a SectionStyle, the reference to this footer is removed and the footer of that type is now continued from the previous section. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document to delete the footer from. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Header

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_HEADER\`

Deletes the header from the specified section or the default header if no section is specified. Use this tool to remove a header from a Google Document.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tab\_id\` \| string \| No \| The tab containing the header to delete. When omitted, the request is applied to the first tab. \|
\| \`header\_id\` \| string \| Yes \| The ID of the header to delete. If this header is defined on \`DocumentStyle\`, the reference to this header is removed, resulting in no header of that type for the first section of the document. If this header is defined on a \`SectionStyle\`, the reference to this header is removed and the header of that type is now continued from the previous section. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document from which to delete the header. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete label from account (permanent)

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_LABEL\`

Permanently DELETES a user-created Gmail label from the account (not from a message). WARNING: This action DELETES the label definition itself, removing it from all messages. System labels (INBOX, SENT, UNREAD, etc.) cannot be deleted. To add/remove labels from specific messages, use GMAIL\_ADD\_LABEL\_TO\_EMAIL action instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| User's email address or 'me' for the authenticated user. \|
\| \`label\_id\` \| string \| Yes \| ID of the user-created label to be permanently DELETED from the account. Must be a custom label ID (format: 'Label\_' e.g., 'Label\_1', 'Label\_42'). System labels (INBOX, SENT, DRAFT, UNREAD, STARRED, IMPORTANT, SPAM, TRASH, CATEGORY\_\*, etc.) cannot be deleted. WARNING: This action permanently DELETES the label definition from your account - it does NOT remove a label from a message. To add/remove labels from messages, use GMAIL\_ADD\_LABEL\_TO\_EMAIL instead. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete message

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_MESSAGE\`

Permanently deletes a specific email message by its ID from a Gmail mailbox; for \`user\_id\`, use 'me' for the authenticated user or an email address to which the authenticated user has delegated access.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| User's email address. The special value 'me' refers to the authenticated user. \|
\| \`message\_id\` \| string \| Yes \| Identifier of the email message to delete. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Named Range

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_NAMED\_RANGE\`

Tool to delete a named range from a Google Document. Use when you need to remove a previously defined named range by its ID or name.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`document\_id\` \| string \| Yes \| The ID of the document. \|
\| \`deleteNamedRange\` \| object \| Yes \| Specifies the named range to delete. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Paragraph Bullets

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_PARAGRAPH\_BULLETS\`

Tool to remove bullets from paragraphs within a specified range in a Google Document. Use when you need to clear bullet formatting from a section of a document.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`range\` \| object \| Yes \| The range of the document from which to delete paragraph bullets. The range is applied to the document body by default. To specify a different segment (e.g. header, footer), include segment\_id in the range object. \|
\| \`tab\_id\` \| string \| No \| The ID of the tab the range is in. If omitted, it applies to the first tab or the singular tab in a single-tab document. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document to update. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Parent (v2)

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_PARENT\`

Tool to remove a parent from a file using Google Drive API v2. Use when you need to remove a file from a specific folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format enum. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`fileId\` \| string \| Yes \| The ID of the file. \|
\| \`callback\` \| string \| No \| JSONP \|
\| \`parentId\` \| string \| Yes \| The ID of the parent. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. "media", "multipart"). \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. "raw", "multipart"). \|
\| \`enforceSingleParent\` \| boolean \| No \| Deprecated: If an item is not in a shared drive and its last parent is removed, the item is placed under its owner's root. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Permission

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_PERMISSION\`

Deletes a permission from a file by permission ID. Deletion is irreversible — confirm the target user, group, or permission type before executing. IMPORTANT: You must first call GOOGLEDRIVE\_LIST\_PERMISSIONS to get valid permission IDs. To fully revoke public access, the type='anyone' (link-sharing) permission must be explicitly deleted; revoking other permissions leaves the file publicly accessible via link. Use when you need to revoke access for a specific user or group from a file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The ID of the file or shared drive. \|
\| \`permission\_id\` \| string \| Yes \| The unique ID of the permission to delete. IMPORTANT: You MUST first call GOOGLEDRIVE\_LIST\_PERMISSIONS with the file\_id to retrieve valid permission IDs. Permission IDs are opaque identifiers assigned by Google (e.g., '18394857362947583', 'anyoneWithLink') and cannot be guessed. Do NOT use placeholder values like 'any' or '1234'. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. \|
\| \`useDomainAdminAccess\` \| boolean \| No \| Issue the request as a domain administrator; if set to true, then the requester will be granted access if the file ID parameter refers to a shared drive and the requester is an administrator of the domain to which the shared drive belongs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Property (v2 API)

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_PROPERTY\`

Tool to delete a property from a file using Google Drive API v2. Use when you need to remove custom key-value metadata from a file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format values. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`fileId\` \| string \| Yes \| The ID of the file. \|
\| \`callback\` \| string \| No \| JSONP callback function name. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`visibility\` \| string \| No \| The visibility of the property. If specified, only deletes the property if it has this visibility level. \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`propertyKey\` \| string \| Yes \| The key of the property to delete. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Reply

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_REPLY\`

Tool to delete a specific reply by reply ID. Deletion is irreversible; obtain explicit user confirmation before calling. Removes only the targeted reply, not the full comment thread — use GOOGLEDRIVE\_DELETE\_COMMENT to remove the entire thread.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The ID of the file. \|
\| \`reply\_id\` \| string \| Yes \| The ID of the reply. Confirm correct target using createdTime and author alongside reply\_id, as multiple similar replies may exist on the same comment. \|
\| \`comment\_id\` \| string \| Yes \| The ID of the comment. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Revision

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_REVISION\`

Tool to permanently delete a file revision. Use when you need to remove a specific version of a binary file (images, videos, etc.). Cannot delete revisions for Google Docs/Sheets or the last remaining revision.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The ID of the file. \|
\| \`revision\_id\` \| string \| Yes \| The ID of the revision to delete. You can obtain revision IDs by calling GOOGLEDRIVE\_LIST\_REVISIONS. Important: You can only delete revisions for files with binary content (images, videos, etc.), not Google Docs or Sheets. You cannot delete the last remaining revision of a file. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Sheet

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_SHEET\`

Tool to delete a sheet (worksheet) from a spreadsheet. Use when you need to remove a specific sheet from a Google Sheet document.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sheetId\` \| integer \| Yes \| The ID of the sheet to delete. Note: A spreadsheet must contain at least one sheet, so you cannot delete the last remaining sheet. If the sheet is of DATA\_SOURCE type, the associated DataSource is also deleted. \|
\| \`spreadsheetId\` \| string \| Yes \| The ID of the spreadsheet from which to delete the sheet. \|
\| \`responseRanges\` \| array \| No \| Limits which ranges are returned when includeSpreadsheetInResponse is true. Only meaningful if includeSpreadsheetInResponse is set to true. Ranges should be in A1 notation (e.g., 'Sheet1!A1:B10'). \|
\| \`responseIncludeGridData\` \| boolean \| No \| True if grid data should be returned in the response spreadsheet. Only meaningful when includeSpreadsheetInResponse is true and no field mask is set on the request. \|
\| \`includeSpreadsheetInResponse\` \| boolean \| No \| Determines if the spreadsheet resource should be returned in the response. If true, the response includes the updated spreadsheet resource with all its sheets, properties, and metadata. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Tab

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_TAB\`

Deletes a tab from a Google Document. This action is irreversible — the tab cannot be recovered once removed. Use when you need to remove a tab and all its child tabs from a document's tab structure.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tab\_id\` \| string \| Yes \| The ID of the tab to delete. If the tab has child tabs, they will also be deleted. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document containing the tab to delete. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Table Column

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_TABLE\_COLUMN\`

Tool to delete a column from a table in a Google Document. Use this tool when you need to remove a specific column from an existing table within a document.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`requests\` \| array \| Yes \| A list of requests to be applied to the document. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document to delete the table column from. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Table Row

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_TABLE\_ROW\`

Tool to delete a row from a table in a Google Document. Use when you need to remove a specific row from an existing table.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`documentId\` \| string \| Yes \| The ID of the document. \|
\| \`tableCellLocation\` \| object \| Yes \| The reference table cell location from which the row will be deleted. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete task

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_TASK\`

Deletes a specified task from a Google Tasks list. Deletion is permanent and irreversible — confirm with the user before executing, and consider GOOGLETASKS\_UPDATE\_TASK or GOOGLETASKS\_MOVE\_TASK as non-destructive alternatives. Both tasklist\_id and task\_id are required parameters. The Google Tasks API does not support deleting tasks by task\_id alone — you must specify which task list contains the task. Use 'List Task Lists' to get available list IDs, then 'List Tasks' to find the task\_id within that list.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`task\_id\` \| string \| Yes \| The unique identifier of the Google Task to delete. Required - must be a task that exists within the specified tasklist\_id. Obtain this ID by using the 'List Tasks' action with the corresponding tasklist\_id. Multiple tasks may share the same title — verify against additional fields (e.g., due date, notes) before selecting the task\_id to avoid deleting the wrong task. \|
\| \`tasklist\_id\` \| string \| Yes \| The unique identifier of the Google Task list containing the task to delete. Required - tasks cannot be deleted by task\_id alone; the API requires specifying which list contains the task. Obtain this ID by using the 'List Task Lists' action. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete task list

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_TASK\_LIST\`

Permanently deletes an existing Google Task list, identified by \`tasklist\_id\`, along with all its tasks; this operation is irreversible. Require explicit user confirmation before calling; do not invoke in read-only or exploratory flows.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tasklist\_id\` \| string \| Yes \| Unique identifier of the Google Task list to be deleted. This field is required and cannot be empty. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Team Drive (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_TEAM\_DRIVE\`

Tool to permanently delete a Team Drive. Deprecated: Use drives.delete instead. Use when you need to remove a Team Drive using the legacy endpoint.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`teamDriveId\` \| string \| Yes \| The ID of the Team Drive to delete. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete thread

\*\*Slug:\*\* \`GOOGLESUPER\_DELETE\_THREAD\`

Tool to immediately and permanently delete a specified thread and all its messages. This operation cannot be undone. Use threads.trash instead for reversible deletion.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| ID of the Thread to delete. \|
\| \`user\_id\` \| string \| No \| User's email address. The special value 'me' refers to the authenticated user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Distance Matrix (Legacy)

\*\*Slug:\*\* \`GOOGLESUPER\_DISTANCE\_MATRIX\_API\`

DEPRECATED: Legacy API that calculates travel distance and time for a matrix of origins and destinations. This API only works with API keys (no OAuth2 support). Use the modern 'Compute Route Matrix' action instead, which supports OAuth2 authentication. Supports different modes of transportation and options like departure/arrival times. Capped at 100 elements per request (elements = origins × destinations count); split large sets into batches.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`key\` \| string \| No \| Your application's API key. This key identifies your application for purposes of quota management. \|
\| \`mode\` \| string ("driving" \| "walking" \| "bicycling" \| "transit") \| No \| Specifies the mode of transport to use. \|
\| \`avoid\` \| string ("tolls" \| "highways" \| "ferries" \| "indoor") \| No \| Indicates that the calculated route should avoid the specified features. Multiple values can be pipe-separated e.g. 'tolls\|highways'. \|
\| \`units\` \| string ("metric" \| "imperial") \| No \| Specifies the unit system to use when displaying results. The default is metric. \|
\| \`region\` \| string \| No \| The region code, specified as a ccTLD ('top-level domain') two-character value. This helps influence results based on the region. \|
\| \`origins\` \| string \| Yes \| The starting point for calculating travel distance and time. You can supply one or more locations separated by the pipe character (\|), in the form of a place ID (prefixed with place\_id:), an address, latitude/longitude coordinates (e.g., '40.7128,-74.0060'), a plus code, or an encoded polyline (prefixed with enc: and a colon). \|
\| \`language\` \| string \| No \| The language in which to return results. See the list of supported languages: https://developers.google.com/maps/faq#languagesupport \|
\| \`arrival\_time\` \| integer \| No \| Specifies the desired time of arrival for transit directions, in seconds since midnight, January 1, 1970 UTC. You can specify either departure\_time or arrival\_time, but not both. \|
\| \`destinations\` \| string \| Yes \| One or more locations to use as the finishing point for calculating travel distance and time. Accepts the same formats as origins. \|
\| \`transit\_mode\` \| string ("bus" \| "subway" \| "train" \| "tram" \| "rail") \| No \| Specifies one or more preferred modes of transit. This parameter may only be specified for transit directions. Multiple values can be pipe-separated e.g. 'bus\|train'. \|
\| \`traffic\_model\` \| string ("best\_guess" \| "pessimistic" \| "optimistic") \| No \| Specifies the assumptions to use when calculating time in traffic. This parameter is only used if the request includes a departure\_time and mode is 'driving'. \|
\| \`departure\_time\` \| string \| No \| Specifies the desired time of departure. You can specify the time as an integer in seconds since midnight, January 1, 1970 UTC, or as the string 'now'. Required for duration\_in\_traffic. \|
\| \`transit\_routing\_preference\` \| string ("less\_walking" \| "fewer\_transfers") \| No \| Specifies preferences for transit routes. This parameter may only be specified for transit directions. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Download a file from Google Drive

\*\*Slug:\*\* \`GOOGLESUPER\_DOWNLOAD\_FILE\`

Downloads a file from Google Drive by its ID. For Google Workspace documents (Docs, Sheets, Slides), optionally exports to a specified \`mime\_type\`. For other file types, downloads in their native format regardless of mime\_type. Examples: Export a Google Doc to plain text: {"file\_id": "1N2o5xQWmAbCdEfGhIJKlmnOPq", "mime\_type": "text/plain"} Download a Google Sheet as CSV: {"file\_id": "1ZyXwVuTsRqPoNmLkJiHgFeDcB", "mime\_type": "text/csv"}

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The unique identifier of the file to be downloaded from Google Drive. Must be a valid Google Drive file ID containing only alphanumeric characters, hyphens, and underscores. File paths with slashes (/) are not valid. This ID can typically be found in the file's URL in Google Drive or obtained from API calls that list files. \|
\| \`mime\_type\` \| string ("application/vnd.openxmlformats-officedocument.wordprocessingml.document" \| "application/vnd.oasis.opendocument.text" \| "application/rtf" \| "application/pdf" \| "text/plain" \| "application/zip" \| "application/epub+zip" \| "text/html" \| "text/markdown" \| "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" \| "application/vnd.oasis.opendocument.spreadsheet" \| "text/csv" \| "text/tab-separated-values" \| "application/vnd.openxmlformats-officedocument.presentationml.presentation" \| "application/vnd.oasis.opendocument.presentation" \| "image/jpeg" \| "image/png" \| "image/svg+xml" \| "application/vnd.google-apps.script+json" \| "application/vnd.google-apps.vid") \| No \| ONLY for Google Workspace documents (Docs, Sheets, Slides, Drawings). Specifies the export format. Has NO effect on regular files (PDFs, images, videos, Office documents, etc.) - they are always downloaded in their native format. Google Forms and Maps cannot be downloaded as they do not support exports through the Drive API. If omitted for Google Workspace files, defaults to PDF. Different Workspace types support different formats. Use application/pdf for universal compatibility. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Download file content (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_DOWNLOAD\_FILE2\`

DEPRECATED: Use GOOGLEDRIVE\_DOWNLOAD\_FILE\_OPERATION instead. Tool to download file content as a long-running operation. Use when you need to download files from Google Drive. Operations are valid for 24 hours from the time of creation.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The ID of the file to download \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Download file via operation

\*\*Slug:\*\* \`GOOGLESUPER\_DOWNLOAD\_FILE\_OPERATION\`

Tool to download file content using long-running operations. Use when you need to download Google Vids files or export Google Workspace documents as part of a long-running operation. Operations are valid for 24 hours from creation. Returns a response containing \`downloaded\_file\_content.s3url\` — a short-lived S3 URL; fetch the actual file bytes from that URL promptly after the call.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The ID of the file to download. This is a required parameter. The file\_id can be found in the file's Google Drive URL or obtained from API calls that list files. \|
\| \`mime\_type\` \| string \| No \| The MIME type for exporting Google Workspace documents (Google Docs, Sheets, Slides, etc.) to different formats. Only applicable to Google Workspace documents (not blob files like PDFs, images, videos). If provided for a non-Google Workspace file, this parameter will be ignored to prevent API errors. Common export formats: 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' (Word), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' (Excel). \|
\| \`revision\_id\` \| string \| No \| The ID of the revision to download. If not specified, the current head revision will be downloaded. This field can only be set when downloading blob files, Google Docs, and Google Sheets. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create a calendar

\*\*Slug:\*\* \`GOOGLESUPER\_DUPLICATE\_CALENDAR\`

Creates a new, empty Google Calendar with the specified title (summary). Newly created calendars default to UTC timezone; use GOOGLECALENDAR\_PATCH\_CALENDAR afterward to set the desired timeZone if needed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`summary\` \| string \| Yes \| Title for the new Google Calendar to be created. Required and must be a non-empty string. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Edit File

\*\*Slug:\*\* \`GOOGLESUPER\_EDIT\_FILE\`

Updates an existing Google Drive file with binary content by overwriting its entire content with new text (max 10MB). IMPORTANT: This action only works with files that have binary content (text files, PDFs, images, etc.). It does NOT support editing Google Workspace native files (Google Docs, Sheets, Slides, etc.). For Google Workspace files, use the Google Docs API, Google Sheets API, or Google Slides API directly. Preserves the original file\_id (unlike GOOGLEDRIVE\_UPLOAD\_FILE which creates a new ID).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`content\` \| string \| Yes \| New textual content to overwrite the existing file; will be UTF-8 encoded for upload. Overwrites the entire file body — partial edits are not possible, so reconstruct the full desired content before calling. Back up with GOOGLEDRIVE\_COPY\_FILE before irreversible edits. \|
\| \`file\_id\` \| string \| Yes \| ID of the Google Drive file to update. Only works with files that have binary content (e.g., .txt, .json, .pdf, .jpg files uploaded to Drive). Does NOT support Google Workspace native files (Docs, Sheets, Slides) even if they appear as spreadsheets or documents - those must be edited via Google Docs/Sheets/Slides APIs. Use GOOGLEDRIVE\_FIND\_FILE to retrieve an existing file's ID; using an upload action instead would create a duplicate with a different ID. \|
\| \`mime\_type\` \| string \| No \| MIME type of the content being uploaded. Must match the actual format of the content being uploaded (not the existing file type). Cannot be a Google Workspace MIME type (application/vnd.google-apps.\*). Valid examples: text/plain, text/html, application/json, application/pdf, image/jpeg. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Empty Trash

\*\*Slug:\*\* \`GOOGLESUPER\_EMPTY\_TRASH\`

Tool to permanently and irreversibly delete ALL trashed files in the user's Google Drive or a specified shared drive. Recovery is impossible after execution — no Drive tool can restore items once trash is emptied. Affects every item in trash across the entire account or shared drive, not just files from the current workflow. Always obtain explicit user confirmation and clarify that recovery is impossible before executing. Provide driveId to target a specific shared drive's trash; omit to empty the user's root trash.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`driveId\` \| string \| No \| If set, empties the trash of the provided shared drive. This parameter is ignored if the item is not in a shared drive. \|
\| \`enforceSingleParent\` \| boolean \| No \| Deprecated: If an item is not in a shared drive and its last parent is deleted but the item itself is not, the item will be placed under its owner's root. This parameter is ignored if the item is not in a shared drive. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### End active conference

\*\*Slug:\*\* \`GOOGLESUPER\_END\_ACTIVE\_CONFERENCE\`

Ends an active conference in a Google Meet space. REQUIRES 'space\_name' parameter (e.g., 'spaces/jQCFfuBOdN5z' or just 'jQCFfuBOdN5z'). Use when you need to terminate an ongoing conference in a specified space. This operation only succeeds if a conference is actively running in the space. You must always provide the space\_name to identify which space's conference to end. Immediately drops all active participants — obtain explicit user confirmation before calling.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`space\_name\` \| string \| Yes \| REQUIRED. Resource name of the space in the format 'spaces/{space}' where {space} is a unique, case-sensitive server-generated ID. Example: 'spaces/jQCFfuBOdN5z'. This can be the full resource name including the 'spaces/' prefix or just the space ID. You must always provide this parameter. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Event

\*\*Slug:\*\* \`GOOGLESUPER\_EVENTS\_GET\`

Retrieves a SINGLE event by its unique event\_id (REQUIRED). This action does NOT list or search events - it fetches ONE specific event when you already know its ID. If you want to list events within a time range, search for events, or filter by criteria like time\_min/time\_max, use GOOGLECALENDAR\_EVENTS\_LIST instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_id\` \| string \| Yes \| REQUIRED. The unique identifier of the specific event to retrieve. You must already know this ID (e.g., from a previous EVENTS\_LIST call or event creation response). This action fetches ONE event by ID - it cannot list or search events. To find events by time range or search criteria, use GOOGLECALENDAR\_EVENTS\_LIST instead. \|
\| \`time\_zone\` \| string \| No \| Time zone used in the response. If not specified, the calendar's time zone is used. \|
\| \`calendar\_id\` \| string \| No \| Identifier of the Google Calendar (e.g., email address, specific ID, or 'primary' for the authenticated user's main calendar) from which to retrieve the event. \|
\| \`max\_attendees\` \| integer \| No \| Maximum number of attendees to include in the response. If there are more than the specified number, only the participant is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Import Event

\*\*Slug:\*\* \`GOOGLESUPER\_EVENTS\_IMPORT\`

Tool to import an event as a private copy to a calendar. Use when you need to add an existing event to a calendar using its iCalUID. Only events with eventType='default' can be imported.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`end\` \| object \| Yes \| The (exclusive) end time of the event. For all-day events, use 'date' field; for timed events, use 'dateTime' and 'timeZone' fields. \|
\| \`start\` \| object \| Yes \| The (inclusive) start time of the event. For all-day events, use 'date' field; for timed events, use 'dateTime' and 'timeZone' fields. \`dateTime\` must be ISO 8601 format (e.g., \`'2024-01-15T10:00:00'\`); \`timeZone\` should match the calendar's timezone to avoid shifted times. \|
\| \`source\` \| object \| No \| Source from which the event was created. \|
\| \`status\` \| string \| No \| Status of the event. Possible values: 'confirmed', 'tentative', 'cancelled'. \|
\| \`colorId\` \| string \| No \| The color of the event. This is an ID referring to an entry in the event colors definition. \|
\| \`iCalUID\` \| string \| Yes \| Event unique identifier as defined in RFC5545. This is required to identify the event being imported. \|
\| \`summary\` \| string \| No \| Title of the event. \|
\| \`location\` \| string \| No \| Geographic location of the event as free-form text. \|
\| \`sequence\` \| integer \| No \| Sequence number as per iCalendar. \|
\| \`attendees\` \| array \| No \| The attendees of the event. \|
\| \`reminders\` \| object \| No \| Information about the event's reminders for the authenticated user. \|
\| \`recurrence\` \| array \| No \| List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in RFC5545. Each string must include the full prefix (e.g., \`'RRULE:FREQ=WEEKLY;BYDAY=MO'\`); omitting the prefix causes a 400 error. \|
\| \`visibility\` \| string \| No \| Visibility of the event. Possible values: 'default', 'public', 'private', 'confidential'. Default: 'default'. \|
\| \`attachments\` \| array \| No \| File attachments for the event. \|
\| \`calendar\_id\` \| string \| No \| Calendar identifier. Use 'primary' for the logged-in user's primary calendar or the calendar's email address. \|
\| \`description\` \| string \| No \| Description of the event. Can contain HTML. \|
\| \`transparency\` \| string \| No \| Whether the event blocks time on the calendar. Possible values: 'opaque' (blocks time), 'transparent' (does not block time). Default: 'opaque'. \|
\| \`guestsCanModify\` \| boolean \| No \| Whether attendees other than the organizer can modify the event. Default: False. \|
\| \`extendedProperties\` \| object \| No \| Extended properties of the event. \|
\| \`supportsAttachments\` \| boolean \| No \| Whether API client performing operation supports event attachments. Default: False. \|
\| \`conferenceDataVersion\` \| integer \| No \| Version number of conference data supported by the API client. Version 0 assumes no conference data support and ignores conference data in the event's body. Version 1 enables copying of ConferenceData as well as for creating new conferences using the createRequest field of conferenceData. Default: 0. \|
\| \`guestsCanInviteOthers\` \| boolean \| No \| Whether attendees other than the organizer can invite others to the event. Default: True. \|
\| \`guestsCanSeeOtherGuests\` \| boolean \| No \| Whether attendees other than the organizer can see who the event's attendees are. Default: True. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Event Instances

\*\*Slug:\*\* \`GOOGLESUPER\_EVENTS\_INSTANCES\`

Returns instances of the specified recurring event. Use timeMin/timeMax to constrain the window; omitting bounds can return large result sets and is quota-heavy. On high-volume calls, 403 rateLimitExceeded or 429 too\_many\_requests may occur; apply exponential backoff (1s, 2s, 4s) before retrying.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`eventId\` \| string \| Yes \| REQUIRED. The ID of the recurring event whose instances you want to retrieve. You must first use GOOGLECALENDAR\_FIND\_EVENT or GOOGLECALENDAR\_EVENTS\_LIST to find recurring events and get their IDs. This action only works with recurring events that have a recurrence rule. \|
\| \`timeMax\` \| string \| No \| Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset. \|
\| \`timeMin\` \| string \| No \| Lower bound (inclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset. \|
\| \`timeZone\` \| string \| No \| Time zone used in the response. Optional. The default is the time zone of the calendar. \|
\| \`pageToken\` \| string \| No \| Token specifying which result page to return. Optional. \|
\| \`calendarId\` \| string \| Yes \| Calendar identifier. To retrieve calendar IDs call the \`calendarList.list\` method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. \|
\| \`maxResults\` \| integer \| No \| Maximum number of events returned on one result page. By default the value is 250 events. The page size can never be larger than 2500 events. Optional. \|
\| \`showDeleted\` \| boolean \| No \| Whether to include deleted events (with status equals "cancelled") in the result. Cancelled instances of recurring events will still be included if \`singleEvents\` is False. Optional. The default is False. \|
\| \`maxAttendees\` \| integer \| No \| The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional. \|
\| \`originalStart\` \| string \| No \| The original start time of the instance in the result. Optional. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Events

\*\*Slug:\*\* \`GOOGLESUPER\_EVENTS\_LIST\`

Returns events on the specified calendar. TIMEZONE WARNING: When using timeMin/timeMax with UTC timestamps (ending in 'Z'), the time window is interpreted in UTC regardless of the calendar's timezone. For example, querying '2026-01-19T00:00:00Z' to '2026-01-20T00:00:00Z' on a calendar in America/Los\_Angeles (UTC-8) covers 2026-01-18 4pm to 2026-01-19 4pm local time, potentially missing events on the intended local date. To query for a specific local date, use timestamps with the appropriate timezone offset in timeMin/timeMax (e.g., '2026-01-19T00:00:00-08:00' for PST).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`q\` \| string \| No \| Free text search terms to find events that match these terms in various fields. Optional. \|
\| \`iCalUID\` \| string \| No \| Specifies an event ID in the iCalendar format to be provided in the response. Optional. Use this if you want to search for an event by its iCalendar ID. \|
\| \`orderBy\` \| string \| No \| The order of the events returned in the result. Optional. The default is an unspecified, stable order. Acceptable values are: "startTime", "updated". When set to "startTime", singleEvents must be true. The action automatically sets singleEvents=true when orderBy='startTime'. \|
\| \`timeMax\` \| string \| No \| Upper bound (exclusive) for an event's start time to filter by. Optional. If unset, no start-time upper bound is applied. Must be an RFC3339 timestamp with mandatory time zone offset (e.g., 2011-06-03T10:00:00-07:00 or 2011-06-03T10:00:00Z). Milliseconds may be provided but are ignored. If timeMin is set, timeMax must be greater than timeMin. TIMEZONE WARNING: If using UTC times (ending in 'Z') but the calendar is in a different timezone, the time window may not align with local calendar dates. For example, '2026-01-19T00:00:00Z' to '2026-01-20T00:00:00Z' covers 2026-01-18 4pm to 2026-01-19 4pm in America/Los\_Angeles (UTC-8). To query a specific local date, use timestamps with the appropriate local timezone offset (e.g., '2026-01-19T00:00:00-08:00' for PST). NOTE: Natural language expressions like 'today', 'tomorrow', 'next week' are NOT supported. \|
\| \`timeMin\` \| string \| No \| Lower bound (exclusive) for an event's end time to filter by. Optional. If unset, no end-time lower bound is applied. Must be an RFC3339 timestamp with mandatory time zone offset (e.g., 2011-06-03T10:00:00-07:00 or 2011-06-03T10:00:00Z). Milliseconds may be provided but are ignored. If timeMax is set, timeMin must be smaller than timeMax. TIMEZONE WARNING: If using UTC times (ending in 'Z') but the calendar is in a different timezone, the time window may not align with local calendar dates. For example, '2026-01-19T00:00:00Z' to '2026-01-20T00:00:00Z' covers 2026-01-18 4pm to 2026-01-19 4pm in America/Los\_Angeles (UTC-8). To query a specific local date, use timestamps with the appropriate local timezone offset (e.g., '2026-01-19T00:00:00-08:00' for PST). NOTE: Natural language expressions like 'today', 'tomorrow', 'next week' are NOT supported. \|
\| \`timeZone\` \| string \| No \| Time zone used in the response for formatting event times. Optional. Use an IANA time zone identifier (e.g., America/Los\_Angeles). Defaults to the user's primary time zone. Offsets (e.g., '-03:00', 'UTC+0') and abbreviations (e.g., 'IST', 'PST') are invalid. NOTE: This parameter only affects how event times are displayed in the response. It does NOT change how timeMin/timeMax filtering is interpreted. To query a specific local date, use timestamps with the appropriate timezone offset directly in timeMin/timeMax (e.g., '2026-01-19T00:00:00-08:00'). \|
\| \`pageToken\` \| string \| No \| Opaque pagination token from a previous response's nextPageToken field. Must be the exact string returned by the API - do not use placeholder values like 'NEXT', 'next', '1', '2', etc. Omit this parameter entirely for the first page of results. Optional. \|
\| \`syncToken\` \| string \| No \| Token from nextSyncToken to return only entries changed since the last list. Cannot be combined with iCalUID, orderBy, privateExtendedProperty, q, sharedExtendedProperty, timeMin, timeMax, or updatedMin. Deletions since the previous list are always included; showDeleted cannot be false in this mode. The action automatically removes conflicting parameters when syncToken is provided. \|
\| \`calendarId\` \| string \| No \| Calendar identifier. Use "primary" for the user's main calendar, or a calendar ID from the user's accessible calendar list. Arbitrary email addresses will NOT work - the calendar must exist in the user's calendar list. Use GOOGLECALENDAR\_LIST\_CALENDARS to retrieve valid calendar IDs. Defaults to "primary". Empty strings will be treated as "primary". Do NOT use Composio internal IDs like connectedAccountId (which start with "ca\_") - these will be automatically replaced with "primary". \|
\| \`eventTypes\` \| string \| No \| Event types to return. Optional. Pass a single value only. If unset, returns all event types. Acceptable values are: "birthday", "default", "focusTime", "fromGmail", "outOfOffice", "workingLocation". \|
\| \`maxResults\` \| integer \| No \| Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional. Must be >= 1 if provided. \|
\| \`updatedMin\` \| string \| No \| Lower bound for an event's last modification time (RFC3339). When specified, entries deleted since this time are always included regardless of showDeleted. Optional. \|
\| \`showDeleted\` \| boolean \| No \| Include cancelled events (status="cancelled"). Optional; default is false. This surfaces cancelled (soft-deleted) events, not items in the Trash. When syncToken or updatedMin is used, deletions since those markers are included regardless of showDeleted. Recurring interaction: if singleEvents=false and showDeleted=false, cancelled instances of a recurring series may still be included; if showDeleted=true and singleEvents=true, only single deleted instances (not parent series) are returned. \|
\| \`maxAttendees\` \| integer \| No \| The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional. Must be >= 1 if provided. \|
\| \`singleEvents\` \| boolean \| No \| Whether to expand recurring events into instances and only return single one-off events and instances of recurring events. Optional. The default is False. \|
\| \`alwaysIncludeEmail\` \| boolean \| No \| Deprecated and ignored. \|
\| \`showHiddenInvitations\` \| boolean \| No \| Whether to include hidden invitations in the result. Optional. The default is False. Hidden invitations are events where your attendee entry has responseStatus='needsAction' and attendees\[\].self==true. When true, such invitations are included. \|
\| \`sharedExtendedProperty\` \| string \| No \| Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints. \|
\| \`privateExtendedProperty\` \| string \| No \| Extended properties constraint specified as propertyName=value. Matches only private properties. This parameter might be repeated multiple times to return events that match all given constraints. \|
\| \`composio\_replaced\_calendar\_id\` \| string \| No \| Internal field to track if calendarId was replaced \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Events from All Calendars

\*\*Slug:\*\* \`GOOGLESUPER\_EVENTS\_LIST\_ALL\_CALENDARS\`

Return a unified event list across all calendars in the user's calendar list for a given time range. Use when you need a single view of all events across multiple calendars. An inverted or incorrect time range silently returns empty results rather than an error. An empty \`items\` list means no events matched the filters—adjust \`time\_min\`, \`time\_max\`, or \`q\` before concluding no events exist.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`q\` \| string \| No \| Free text search terms to find events that match these terms in any field, except for extended properties. Optional. \|
\| \`time\_max\` \| string \| Yes \| Upper bound (exclusive) for an event's start time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset (e.g., 2011-06-03T10:00:00-07:00 or 2011-06-03T10:00:00Z). If timezone offset is missing, UTC (Z) will be automatically appended. Required. \|
\| \`time\_min\` \| string \| Yes \| Lower bound (inclusive) for an event's end time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset (e.g., 2011-06-03T10:00:00-07:00 or 2011-06-03T10:00:00Z). If timezone offset is missing, UTC (Z) will be automatically appended. Required. \|
\| \`event\_types\` \| array \| No \| Event types to return. Optional. \|
\| \`calendar\_ids\` \| array \| No \| Optional list of specific calendar IDs to query. If not provided, all calendars from the user's calendar list will be queried. \|
\| \`show\_deleted\` \| boolean \| No \| Whether to include deleted events (with status equals 'cancelled') in the result. Optional. The default is False. \|
\| \`single\_events\` \| boolean \| No \| Whether to expand recurring events into instances and only return single one-off events and instances of recurring events. Optional. The default is True. \|
\| \`response\_detail\` \| string ("minimal" \| "full") \| No \| Level of detail in the response. 'minimal' (default) returns only the compact summary\_view, omitting the large events array to reduce token usage. 'full' returns both summary\_view and the full detailed events array. \|
\| \`max\_results\_per\_calendar\` \| integer \| No \| Maximum number of events returned per calendar. Optional. If not provided, defaults to the API's default (250). Results may be paginated; follow \`nextPageToken\` in the response until absent to retrieve the complete event list. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Move Event

\*\*Slug:\*\* \`GOOGLESUPER\_EVENTS\_MOVE\`

Moves an event to another calendar, i.e., changes an event's organizer.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_id\` \| string \| Yes \| Event identifier. To retrieve event identifiers call the events.list method. \|
\| \`calendar\_id\` \| string \| Yes \| Calendar identifier of the source calendar. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. \|
\| \`destination\` \| string \| Yes \| Calendar identifier of the destination calendar. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. \|
\| \`send\_updates\` \| string ("all" \| "externalOnly" \| "none") \| No \| Options for who should receive notifications about event changes. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Watch Events

\*\*Slug:\*\* \`GOOGLESUPER\_EVENTS\_WATCH\`

Watch for changes to Events resources. Watch channels expire; persist the channel \`id\` per \`calendarId\` to re-establish watches after expiration or restarts.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| A UUID or similar unique string that identifies this channel. \|
\| \`type\` \| string \| No \| The type of delivery mechanism used for this channel. \|
\| \`token\` \| string \| No \| An arbitrary string delivered to the target address with each notification delivered over this channel. Optional. \|
\| \`params\` \| object \| No \| Additional parameters controlling delivery channel behavior. Optional. \|
\| \`address\` \| string \| Yes \| The address where notifications are delivered for this channel. Must be a publicly accessible HTTPS URL; http:// or localhost URLs will not receive notifications. \|
\| \`payload\` \| boolean \| No \| A Boolean value to indicate whether payload is wanted. Optional. \|
\| \`calendarId\` \| string \| Yes \| Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Execute SQL on Spreadsheet

\*\*Slug:\*\* \`GOOGLESUPER\_EXECUTE\_SQL\`

DEPRECATED: Use direct Google Sheets actions instead: - GOOGLESHEETS\_VALUES\_GET / GOOGLESHEETS\_BATCH\_GET for reads - GOOGLESHEETS\_VALUES\_UPDATE / GOOGLESHEETS\_UPDATE\_VALUES\_BATCH / GOOGLESHEETS\_SPREADSHEETS\_VALUES\_APPEND for writes Execute SQL queries against Google Sheets tables. Supports SELECT, INSERT, UPDATE, DELETE operations and WITH clauses (CTEs) with familiar SQL syntax. Tables are automatically detected and mapped from the spreadsheet structure.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sql\` \| string \| Yes \| Complete SQL query to execute. Must begin with SELECT, INSERT, UPDATE, DELETE, or WITH. Supports Common Table Expressions (CTEs) using WITH clause for complex queries. Note: WITH clauses require the sqlglot library for full support; simple SELECT/INSERT/UPDATE/DELETE operations work without it. Use table names (sheet names) in FROM/INTO clauses, not A1 range notation. The query must include proper SQL clauses (e.g., SELECT columns FROM table, not just a column name or condition). Example: SELECT \* FROM "Sheet1" WHERE A = 'value' (correct) instead of just A = 'value' (incorrect). \|
\| \`dry\_run\` \| boolean \| No \| Preview changes without applying them (for write operations) \|
\| \`delete\_method\` \| string ("clear" \| "remove\_rows") \| No \| For DELETE operations: 'clear' preserves row structure, 'remove\_rows' shifts data up \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique alphanumeric ID of the Google Spreadsheet extracted from the URL. Format: A long string of letters, numbers, hyphens, and underscores (typically 44 characters). Find it in the URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET\_ID}/edit. Must be a valid ID - values like 'auto' are NOT valid and will fail. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Export Google Doc as PDF

\*\*Slug:\*\* \`GOOGLESUPER\_EXPORT\_DOCUMENT\_AS\_PDF\`

Tool to export a Google Docs file as PDF using the Google Drive API. Use when you need to generate a PDF version of a Google Docs document for download or distribution. Note: Google Drive enforces a 10MB limit on export content.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The ID of the Google Docs file to export as PDF. This is the same as the document ID for Google Docs files - typically a 44-character alphanumeric string. Extract it from a Google Docs URL: https://docs.google.com/document/d/{FILE\_ID}/edit \|
\| \`filename\` \| string \| No \| Optional suggested filename for the exported PDF (e.g., 'report.pdf'). If not provided, a default filename will be generated. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Export Google Workspace file

\*\*Slug:\*\* \`GOOGLESUPER\_EXPORT\_GOOGLE\_WORKSPACE\_FILE\`

Exports a Google Workspace document to the requested MIME type and returns exported file content. Use when you need to export Google Docs, Sheets, Slides, Drawings, or Apps Script files to a specific format. Note: The exported content is limited to 10MB by Google Drive API.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The ID of the Google Workspace file to export. Must be a valid file ID for a Google Docs, Sheets, Slides, Drawings, or Apps Script file. \|
\| \`mimeType\` \| string ("application/vnd.openxmlformats-officedocument.wordprocessingml.document" \| "application/vnd.oasis.opendocument.text" \| "application/rtf" \| "application/pdf" \| "text/plain" \| "application/zip" \| "application/epub+zip" \| "text/markdown" \| "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" \| "application/vnd.oasis.opendocument.spreadsheet" \| "text/csv" \| "text/tab-separated-values" \| "application/vnd.openxmlformats-officedocument.presentationml.presentation" \| "application/vnd.oasis.opendocument.presentation" \| "image/jpeg" \| "image/png" \| "image/svg+xml" \| "application/vnd.google-apps.script+json") \| Yes \| The MIME type of the format requested for this export. Supported formats depend on the source file type: Google Docs -> DOCX, ODT, RTF, PDF, TXT, HTML (ZIP), EPUB, Markdown; Google Sheets -> XLSX, ODS, PDF, CSV, TSV, HTML (ZIP); Google Slides -> PPTX, ODP, PDF, TXT, JPG, PNG, SVG; Google Drawings -> PDF, JPG, PNG, SVG; Apps Script -> JSON. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Fetch emails

\*\*Slug:\*\* \`GOOGLESUPER\_FETCH\_EMAILS\`

Fetches a list of email messages from a Gmail account, supporting filtering, pagination, and optional full content retrieval. Results are NOT sorted by recency; sort by internalDate client-side. The messages field may be absent or empty (valid no-results state); always null-check before accessing messageId or threadId. Null-check subject and header fields before string operations. For large result sets, prefer ids\_only=true or metadata-only listing, then hydrate via GMAIL\_FETCH\_MESSAGE\_BY\_MESSAGE\_ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| No \| Gmail advanced search query (e.g., 'from:user subject:meeting'). Supported operators: 'from:', 'to:', 'subject:', 'label:', 'has:', 'is:', 'in:', 'category:', 'after:YYYY/MM/DD', 'before:YYYY/MM/DD', AND/OR/NOT. IMPORTANT - 'is:' vs 'label:' usage: Use 'is:' for special mail states: is:snoozed, is:unread, is:read, is:starred, is:important. Use 'label:' ONLY for user-created labels (e.g., 'label:work', 'label:projects'). Note: 'muted' may work with both 'is:muted' and 'label:muted' based on community reports. Common mistake: 'label:snoozed' is WRONG - use 'is:snoozed' instead. Use quotes for exact phrases. Omit for no query filter. after:/before: evaluate whole calendar days in UTC; before: is exclusive — adjust for local timezone to avoid off-by-one-day gaps. \|
\| \`user\_id\` \| string \| No \| User's email address or 'me' for the authenticated user. Non-'me' addresses require domain-level delegation; without it, authentication or not-found errors result. \|
\| \`verbose\` \| boolean \| No \| If false, uses optimized concurrent metadata fetching for faster performance (~75% improvement). If true, uses standard detailed message fetching. When false, only essential fields (subject, sender, recipient, time, labels) are guaranteed. Body content and attachment details require verbose=true even when include\_payload=true. \|
\| \`ids\_only\` \| boolean \| No \| If true, only returns message IDs from the list API without fetching individual message details. Fastest option for getting just message IDs and thread IDs. \|
\| \`label\_ids\` \| array \| No \| Filter by label IDs; only messages with all specified labels are returned (AND logic). Optional - omit or use empty list to fetch all messages without label filtering. System label IDs: 'INBOX', 'SPAM', 'TRASH', 'UNREAD', 'STARRED', 'IMPORTANT', 'CATEGORY\_PRIMARY' (alias 'CATEGORY\_PERSONAL'), 'CATEGORY\_SOCIAL', 'CATEGORY\_PROMOTIONS', 'CATEGORY\_UPDATES', 'CATEGORY\_FORUMS'. For custom/user-created labels, you MUST use the label ID (e.g., 'Label\_123456'), NOT the display name. Use the 'listLabels' action to find label IDs for custom labels. Combining label\_ids with label: in query applies AND logic across both, which can silently over-restrict results; use one strategy consistently. \|
\| \`page\_token\` \| string \| No \| Token for retrieving a specific page, obtained from a previous response's \`nextPageToken\`. Must be a valid opaque token string from a previous API response. Do not pass arbitrary values. Omit for the first page. Loop calls using nextPageToken until it is absent to avoid silently missing messages. resultSizeEstimate is approximate — do not use as a stopping condition. \|
\| \`max\_results\` \| integer \| No \| Maximum number of messages to retrieve per page. Default of 1 retrieves only a single message; set higher for practical use. Hard cap is 500 per page. \|
\| \`include\_payload\` \| boolean \| No \| Set to true to include full message payload (headers, body, attachments); false for metadata only. payload may still be null even when true; use GMAIL\_FETCH\_MESSAGE\_BY\_MESSAGE\_ID for guaranteed complete content. When payload is present, bodies are base64url-encoded in payload.parts; replace '-'→'+' and '\_'→'/' and fix padding before decoding, and check both text/plain and text/html parts. \|
\| \`include\_spam\_trash\` \| boolean \| No \| Set to true to include messages from 'SPAM' and 'TRASH'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Fetch message by message ID

\*\*Slug:\*\* \`GOOGLESUPER\_FETCH\_MESSAGE\_BY\_MESSAGE\_ID\`

Fetches a specific email message by its ID, provided the \`message\_id\` exists and is accessible to the authenticated \`user\_id\`. Spam/trash messages are excluded unless upstream list/search calls used \`include\_spam\_trash=true\`. Use \`internalDate\` (milliseconds since epoch) rather than header \`Date\` for recency checks.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`format\` \| string \| No \| Format for message content. 'minimal': lightest (ID, thread ID, labels only). 'metadata': headers and message metadata without body content - ideal for summarization, analysis, or when you only need subject/sender/timestamp (recommended for most use cases). 'full': complete MIME structure with 50+ headers, nested parts, and base64url-encoded body data - heavy payload, only use when you need the complete raw MIME structure for parsing attachments or body content. 'raw': entire RFC 2822 formatted message as base64url string. \|
\| \`user\_id\` \| string \| No \| User's email address or 'me' for the authenticated user. \|
\| \`message\_id\` \| string \| Yes \| The Gmail API message ID (hexadecimal string, typically 15-16 characters like '19b11732c1b578fd'). Must be obtained from Gmail API responses (e.g., List Messages, Search Messages). Do NOT use email subjects, dates, sender names, or custom identifiers. Do NOT use \`threadId\` (use GMAIL\_FETCH\_MESSAGE\_BY\_THREAD\_ID for threads), the Message-ID email header, or any fabricated value — only IDs from Gmail API list/search responses. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Fetch Message by Thread ID

\*\*Slug:\*\* \`GOOGLESUPER\_FETCH\_MESSAGE\_BY\_THREAD\_ID\`

Retrieves messages from a Gmail thread using its \`thread\_id\`, where the thread must be accessible by the specified \`user\_id\`. Returns a \`messages\` array; \`thread\_id\` is not echoed in the response. Message order is not guaranteed — sort by \`internalDate\` to find oldest/newest. Check \`labelIds\` per message to filter drafts. Concurrent bulk calls may trigger 403 \`userRateLimitExceeded\` or 429; cap concurrency ~10 and use exponential backoff.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The email address of the user. \|
\| \`thread\_id\` \| string \| Yes \| Hexadecimal thread ID from Gmail API (e.g., '19bf77729bcb3a44'). Obtain from GMAIL\_LIST\_THREADS or GMAIL\_FETCH\_EMAILS. Prefixes like 'msg-f:' or 'thread-f:' are auto-stripped. Legacy Gmail web UI IDs (e.g., 'FMfcgzQfBZdVqKZcSVBhqwWLKWCtDdWQ') are NOT supported - use the API thread ID instead. Deduplicate thread\_ids before calling when multiple listed messages share the same threadId to avoid redundant calls. \|
\| \`page\_token\` \| string \| No \| Opaque page token for fetching a specific page of messages if results are paginated. Iterate calls by passing the returned \`nextPageToken\` until it is absent; stopping early will miss messages in long threads. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Find event

\*\*Slug:\*\* \`GOOGLESUPER\_FIND\_EVENT\`

Finds events in a specified Google Calendar using text query, time ranges (event start/end, last modification), and event types. Ensure \`timeMin\` is not chronologically after \`timeMax\` if both are provided. Results may span multiple pages; always follow \`nextPageToken\` until absent to avoid silently missing events. Validate the correct match from results by checking summary, start.dateTime, and organizer.email before using event\_id for mutations. An empty \`items\` array means no events matched — widen filters rather than treating it as an error.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| No \| Free-text search terms to find events. This query is matched against various event fields including summary, description, location, attendees' details (displayName, email), and organizer's details. Cannot search by event\_id. Performs full-text match (not exact); broad terms may return unrelated events. For person-based matching, prefer attendees\[\].email over display names. If results appear incomplete, use GOOGLECALENDAR\_EVENTS\_LIST with client-side filtering. \|
\| \`order\_by\` \| string \| No \| Order of events: 'startTime' (ascending by start time) or 'updated' (ascending by last modification time). Note: 'startTime' requires single\_events=true. Use 'updated' if you need to include recurring masters (e.g., cancelled series). \|
\| \`time\_max\` \| string \| No \| Upper bound (exclusive) for an event's start time to filter by. Only events starting before this time are included. Accepts multiple formats: 1. RFC3339 timestamp (e.g., '2024-12-06T13:00:00Z') 2. Comma-separated date/time parts (e.g., '2024,12,06,13,00,00') 3. Simple datetime string (e.g., '2024-12-06 13:00:00') Set to the first instant after the desired period to avoid missing boundary events, especially all-day events (date-only fields). Overly wide ranges expand many recurring instances, causing large payloads and high latency — constrain to the minimum required window. \|
\| \`time\_min\` \| string \| No \| Lower bound (exclusive) for an event's end time to filter by. Only events ending after this time are included. Accepts multiple formats: 1. RFC3339 timestamp (e.g., '2024-12-06T13:00:00Z') 2. Comma-separated date/time parts (e.g., '2024,12,06,13,00,00') 3. Simple datetime string (e.g., '2024-12-06 13:00:00') RFC3339 timestamps must include explicit timezone offsets; missing or mismatched offsets can silently exclude matching events. To align with the calendar's timezone, retrieve it via GOOGLECALENDAR\_GET\_CALENDAR. \|
\| \`page\_token\` \| string \| No \| Token from a previous response's \`nextPageToken\` to fetch the subsequent page of results. Always follow every \`nextPageToken\` until absent; skipping pagination silently omits events on busy calendars. \|
\| \`calendar\_id\` \| string \| No \| Identifier of the Google Calendar to query. IMPORTANT: This must be a valid calendar identifier, NOT a calendar name/title. Valid formats are: 'primary' (the authenticated user's primary calendar), an email address (e.g., 'user@example.com'), or a calendar ID (e.g., 'abc123xyz@group.calendar.google.com'). To find the calendar ID for a named calendar, first use the List Calendars action (GOOGLECALENDAR\_LIST\_CALENDARS) to retrieve all available calendars with their IDs. 'primary' searches only the authenticated user's primary calendar; to search all calendars, retrieve each ID via GOOGLECALENDAR\_LIST\_CALENDARS and query separately. \|
\| \`event\_types\` \| array \| No \| Event types to include. Supported values: 'birthday', 'default', 'focusTime', 'outOfOffice', 'workingLocation'. \|
\| \`max\_results\` \| integer \| No \| Maximum number of events per page (1-2500). \|
\| \`updated\_min\` \| string \| No \| Lower bound (exclusive) for an event's last modification time to filter by. Only events updated after this time are included. When specified, events deleted since this time are also included, regardless of the \`show\_deleted\` parameter. Accepts multiple formats: 1. RFC3339 timestamp (e.g., '2024-12-06T13:00:00Z') 2. Comma-separated date/time parts (e.g., '2024,12,06,13,00,00') 3. Simple datetime string (e.g., '2024-12-06 13:00:00') \|
\| \`show\_deleted\` \| boolean \| No \| Include events whose status is 'cancelled'. This surfaces cancelled/deleted events, not a separate 'trash' view. Behavior with recurring events: when single\_events=true, only individual cancelled instances are returned (the recurring master is omitted); to include cancelled recurring masters, set single\_events=false. If updated\_min is provided, events deleted since that time are included regardless of this flag. \|
\| \`single\_events\` \| boolean \| No \| When true, recurring event series are expanded into their individual instances. When false, only the recurring master events are returned. Note: Ordering by 'startTime' requires singleEvents=true. For large calendars, it is strongly recommended to specify both timeMin and timeMax to limit the expansion window and improve performance. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Find file

\*\*Slug:\*\* \`GOOGLESUPER\_FIND\_FILE\`

The comprehensive Google Drive search tool that handles all file and folder discovery needs. Use this for any file finding task - from simple name searches to complex queries with date filters, MIME types, permissions, custom properties, folder scoping, and more. Searches across My Drive and shared drives with full metadata support. Examples: - Find PDFs: q="mimeType = 'application/pdf'" - Find recent files: q="modifiedTime > '2024-01-01T00:00:00'" - Search by name: q="name contains 'report'" - Files in folder: folderId="abc123" or q="'FOLDER\_ID' in parents"

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`q\` \| string \| No \| Query string to filter file results. Accepts both simple text searches and full Google Drive query syntax. \*\*Simple Text Search:\*\* Bare text (e.g., "SAM RFP") is auto-converted to fullText search. Bare email addresses are auto-converted to owner search. \*\*Full Query Syntax:\*\* 'field operator value' combined with 'and', 'or', 'not' \*\*Operators:\*\* =, !=, <, >, <=, >=, contains, in \*\*Common Fields:\*\* - \`name\` - File name (exact match with = or partial match with contains) - \`fullText\` - File content search - \`mimeType\` - File type (e.g., 'application/pdf', 'application/vnd.google-apps.folder') - \`modifiedTime\`, \`createdTime\` - Dates (RFC 3339: '2024-01-01T00:00:00') - \`parents\` - Folder IDs containing the file - \`owners\`, \`writers\` - User email addresses (MUST use 'in' operator, NOT colon syntax) - \`properties\`, \`appProperties\` - Custom metadata \*\*Boolean Filter Fields (sharedWithMe, trashed, starred):\*\* These fields require explicit \`= true\` or \`= false\` syntax: - \`sharedWithMe = true\` - Find files shared with you by others - \`sharedWithMe = false\` - Find files NOT shared with you (your own files) - \`trashed = true\` - Find files in trash - \`trashed = false\` - Exclude trashed files from results - \`starred = true\` - Find starred/favorited files - \`starred = false\` - Find non-starred files Combine with other conditions using 'and': - "sharedWithMe = true and name contains 'report'" - Find shared files with 'report' in name - "sharedWithMe = true and mimeType = 'application/pdf'" - Find shared PDF files - "starred = true and modifiedTime > '2024-01-01T00:00:00'" - Find recently modified starred files \*\*Query Complexity Limits:\*\* Queries with many OR clauses (typically >5-10) may fail with 'The query is too complex' error. \*\*Name Field Usage:\*\* Wildcards (\*) are NOT supported. Use 'contains' operator for partial matching. \*\*User Email Searches:\*\* - CORRECT: "'user@example.com' in owners" or "'user@example.com' in writers" or "'user@example.com' in readers" - INCORRECT: "owner:user@example.com" (colon syntax is NOT supported and will cause errors) - Always use the 'in' operator with quoted email addresses for user-based searches \*\*Special Syntax:\*\* - Dates: RFC 3339 format (time zone defaults to UTC) - Apostrophes/quotes in values: Automatically escaped. You can write "name = 'Jan'26'" or "name = 'Valentine's Day'" without manual escaping. - Grouping: Use parentheses for OR: "(mimeType contains 'image/' or mimeType contains 'video/')" - Custom properties: "properties has { key='department' and value='sales' }" \*\*IMPORTANT - Root Folder ('My Drive'):\*\* 'My Drive' is NOT a searchable folder name. To work with the root folder, use the 'root' alias: folder\_id='root' or "'root' in parents" in your query. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. Use '\*' for all fields. \*\*Default Behavior (Recommended for Discovery):\*\* When omitted, returns essential file discovery fields: id, name, mimeType, size, modifiedTime, createdTime, parents, webViewLink, trashed, starred. This lightweight default is optimized for file search/discovery use cases without verbose permission or capability metadata. \*\*Format:\*\* For file fields, use 'files(field1,field2,...)' format. For example: 'files(id,name,mimeType)'. Top-level response fields (kind, nextPageToken, incompleteSearch) can be used directly. \*\*Note:\*\* Bare field names like 'id,name,mimeType' will be automatically wrapped in 'files()' for convenience. The 'editors' field is not valid in Drive API v3; use 'permissions' instead for access control information. \|
\| \`spaces\` \| string \| No \| A comma-separated list of spaces to query. Supported values are 'drive', 'appDataFolder' and 'photos'. \|
\| \`corpora\` \| string ("user" \| "drive" \| "domain" \| "allDrives") \| No \| Specifies which collections of files to search. Defaults to 'allDrives' (searches My Drive + all accessible shared drives). \*\*Values:\*\* - \`user\` - Search only user's personal My Drive - \`domain\` - Search all files shared within Google Workspace domain - \`drive\` - Search specific shared drive (requires 'driveId' parameter and 'includeItemsFromAllDrives' must be true) - \`allDrives\` - Search My Drive + all accessible shared drives (DEFAULT, requires 'includeItemsFromAllDrives' to be true) \*\*When to Use:\*\* - Personal files only: Use 'user' - Organization-wide: Use 'domain' - Specific shared drive: Use 'drive' with 'driveId' - Maximum coverage: Use 'allDrives' (auto-enables supportsAllDrives and includeItemsFromAllDrives) \|
\| \`driveId\` \| string \| No \| ID of the shared drive to search. When provided, 'corpora' will automatically be set to 'drive' (mutually exclusive with corpora='allDrives'). Required if 'corpora' is 'drive'. \|
\| \`orderBy\` \| string \| No \| Comma-separated sort keys. Ascending by default; add 'desc' for descending. Cannot be used when query (q) contains fullText search terms. \*\*Valid Keys:\*\* - \`createdTime\`, \`modifiedTime\`, \`modifiedByMeTime\` - Dates - \`viewedByMeTime\`, \`sharedWithMeTime\` - Activity dates - \`name\`, \`name\_natural\` - File name (natural: file1, file2, file10) - \`folder\` - Folder hierarchy - \`quotaBytesUsed\` - Storage size (NOTE: 'size' is NOT valid, use 'quotaBytesUsed') - \`starred\` - Starred status - \`recency\` - Recent activity (combines view time and modification time for relevance-based sorting) \*\*Important:\*\* 'size' is NOT a valid sort key. Use 'quotaBytesUsed' to sort by file size. \*\*Restriction:\*\* Sorting is not supported when the query contains fullText searches (e.g., "fullText contains 'keyword'"). Omit orderBy when using fullText queries. \|
\| \`pageSize\` \| integer \| No \| The maximum number of files to return per page. \|
\| \`folder\_id\` \| string \| No \| ID of a specific folder to search within. This automatically adds "'folder\_id' in parents" to the query. Can be combined with the 'q' parameter to further filter results within the folder. Use 'root' to search within the user's root folder (My Drive). Note: 'My Drive' is not a searchable folder name - use 'root' alias instead. \|
\| \`pageToken\` \| string \| No \| The token for continuing a previous list request on the next page. IMPORTANT: This must be the exact opaque string from a previous response's 'nextPageToken' field - do not modify, truncate, URL-encode, or construct tokens manually. Invalid or corrupted tokens will result in API errors. \|
\| \`include\_labels\` \| string \| No \| A comma-separated list of label IDs to include in the \`labelInfo\` part of the response for each file. Empty strings are automatically treated as omitted. \|
\| \`pagetoken\_dropped\` \| boolean \| No \| Indicates whether the page token was dropped from the request. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. If 'includeItemsFromAllDrives' is true, this must also be true. \|
\| \`original\_email\_query\` \| string \| No \| The original email query before transformation. \|
\| \`editors\_field\_removed\` \| boolean \| No \| Indicates whether the editors field was removed from the request. \|
\| \`email\_query\_transformed\` \| boolean \| No \| Indicates whether an email query was transformed into a search filter. \|
\| \`orderby\_size\_transformed\` \| boolean \| No \| Indicates whether the orderBy size value was transformed. \|
\| \`original\_bare\_text\_query\` \| string \| No \| The original bare text query before transformation. \|
\| \`includeItemsFromAllDrives\` \| boolean \| No \| Whether both My Drive and shared drive items should be included in results. Must be true when corpora is 'drive' or 'allDrives'. If true, 'supportsAllDrives' should also be true. \|
\| \`emailaddress\_field\_removed\` \| boolean \| No \| Indicates whether the email address field was removed from the request. \|
\| \`original\_invalid\_pagetoken\` \| string \| No \| The original invalid page token that was dropped. \|
\| \`bare\_text\_query\_transformed\` \| boolean \| No \| Indicates whether a bare text query was transformed into a search filter. \|
\| \`include\_permissions\_for\_view\` \| string \| No \| Specifies which additional view's permissions to include in the response. Must be either omitted entirely or set to 'published'. Empty strings are automatically treated as omitted. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Find folder

\*\*Slug:\*\* \`GOOGLESUPER\_FIND\_FOLDER\`

Finds one page of Google Drive folders by name and optional parent. Use nextPageToken with page\_token to retrieve additional pages.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`starred\` \| boolean \| No \| Set to true to search for folders that are starred, or false for those that are not. \|
\| \`page\_size\` \| integer \| No \| The maximum number of folders to return in this call (1-1000). This action returns one page per call; use the response's nextPageToken to retrieve additional pages. \|
\| \`name\_exact\` \| string \| No \| The exact name of the folder to search for as a string. This search is case-sensitive. Do not pass numbers - convert to string if needed. \|
\| \`page\_token\` \| string \| No \| Opaque token for the next page. Omit for the first page, then pass the previous response's nextPageToken unchanged to continue the same search. \|
\| \`name\_contains\` \| string \| No \| A substring to search for within folder names as a string. This search is case-insensitive. \|
\| \`modified\_after\` \| string \| No \| Search for folders modified after a specific date and time. The timestamp must be in RFC 3339 format (e.g., '2023-01-15T10:00:00Z' or '2023-01-15T10:00:00.000Z'). \|
\| \`parent\_folder\_id\` \| string \| No \| The ID of the parent folder to search within. Only folders directly inside this parent folder will be returned. You can find parent folder IDs by first searching for the parent folder by name. Supports folders in both My Drive and Shared Drives. \|
\| \`name\_not\_contains\` \| string \| No \| A substring to exclude from folder names as a string. Folders with names containing this substring will not be returned. This search is case-insensitive. \|
\| \`full\_text\_contains\` \| string \| No \| A string to search for within the folder's name or description (NOT the content of files inside the folder). This search is case-insensitive. Note: Google Drive's fullText search on folders only matches the folder's own metadata, not files contained within. \|
\| \`full\_text\_not\_contains\` \| string \| No \| A string to exclude from the folder's name or description (NOT the content of files inside the folder). This search is case-insensitive. Note: Google Drive's fullText search on folders only matches the folder's own metadata, not files contained within. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Find free slots

\*\*Slug:\*\* \`GOOGLESUPER\_FIND\_FREE\_SLOTS\`

Finds both free and busy time slots in Google Calendars for specified calendars within a defined time range. If \`time\_min\` is not provided, defaults to the current timestamp in the specified timezone. If \`time\_max\` is not provided, defaults to 23:59:59 of the day specified in \`time\_min\` (if provided), otherwise defaults to 23:59:59 of the current day in the specified timezone. Returns busy intervals and calculates free slots by finding gaps between busy periods; \`time\_min\` must precede \`time\_max\` if both are provided. This action retrieves free and busy time slots for the specified calendars over a given time period. It analyzes the busy intervals from the calendars and provides calculated free slots based on the gaps in the busy periods. Returned free slots are unfiltered by duration; callers must filter intervals to those fully containing the required meeting length. No event metadata (titles, descriptions, links) is returned; use GOOGLECALENDAR\_EVENTS\_LIST for event details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`items\` \| array \| No \| List of calendar identifiers to query for free/busy information. Pass as a simple list of strings, e.g., \['primary'\] or \['primary', 'user@example.com'\]. Valid values include: 'primary' (authenticated user's main calendar), calendar IDs from the user's calendar list (typically ending in @group.calendar.google.com), or email addresses of users whose free/busy information you want to query. The FreeBusy API will return error information for any calendars that are not accessible or invalid in the response under the 'errors' key for each calendar. Calendars omitted from \`items\` or inaccessible are treated as free (not unknown), which can silently produce incorrect availability results. \|
\| \`time\_max\` \| string \| No \| End datetime for the query interval. Accepts ISO, comma-separated, or simple datetime formats. If provided without an explicit timezone, it is interpreted in the specified \`timezone\`. If not provided, defaults to 23:59:59 of the day specified in \`time\_min\` (if provided), otherwise defaults to 23:59:59 of the current day in the specified \`timezone\`. Maximum span between time\_min and time\_max is approximately 90 days per Google Calendar freeBusy API limit. \`time\_max\` is exclusive; to cover a full day, set \`time\_max\` to 00:00:00 of the following day in the target timezone rather than 23:59:59. \|
\| \`time\_min\` \| string \| No \| Start datetime for the query interval. Accepts ISO, comma-separated, or simple datetime formats. If provided without an explicit timezone, it is interpreted in the specified \`timezone\`. If not provided, defaults to the current timestamp in the specified \`timezone\` to ensure only future/bookable slots are returned. Maximum span between time\_min and time\_max is approximately 90 days per Google Calendar freeBusy API limit. \|
\| \`timezone\` \| string \| No \| IANA timezone identifier (e.g., 'America/New\_York', 'Europe/London', 'Asia/Tokyo'). Determines how naive \`time\_min\`/\`time\_max\` are interpreted and the timezone used in the response for \`timeMin\`, \`timeMax\`, busy periods, and calculated free slots. Note: 'local' is not supported; use a specific IANA timezone name. \|
\| \`group\_expansion\_max\` \| integer \| No \| Maximum calendar identifiers to return for a single group. Must be between 1 and 100 (inclusive). Values exceeding 100 will be rejected. \|
\| \`calendar\_expansion\_max\` \| integer \| No \| Maximum calendars for which FreeBusy information is provided. Must be between 1 and 50 (inclusive). Values exceeding 50 will be rejected. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Find and Replace in Spreadsheet

\*\*Slug:\*\* \`GOOGLESUPER\_FIND\_REPLACE\`

Tool to find and replace text in a Google Spreadsheet. Use when you need to fix formula errors, update values, or perform bulk text replacements across cells. Common use cases: - Fix #ERROR! cells by replacing with empty string or correct formula - Update old values with new ones across multiple cells - Fix formula references or patterns - Clean up data formatting issues

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`find\` \| string \| Yes \| The text to find. Can be a literal string or a regular expression pattern. \|
\| \`range\` \| string \| No \| A1 notation range string to search within (e.g., 'A1:B10', 'Sheet1!A1:B10'). When using A1 notation with a sheet name, you must also provide range\_sheet\_id to specify the numeric sheet ID (the API requires numeric IDs). Alternatively, use the GridRange parameters (range\_sheet\_id with optional row/column indices) for explicit numeric control. Mutually exclusive with sheet\_id and all\_sheets. \|
\| \`replace\` \| string \| Yes \| The text to replace the found instances with. \|
\| \`sheetId\` \| integer \| No \| The numeric ID of the sheet to search the entire sheet (e.g., 0 for the first sheet). Mutually exclusive with sheet\_name, range/range\_sheet\_id parameters, and all\_sheets. You must specify exactly one scope: either sheet\_id (entire sheet), sheet\_name, range/range\_sheet\_id (specific range), or all\_sheets. \|
\| \`allSheets\` \| boolean \| No \| Whether to search across all sheets in the spreadsheet. Mutually exclusive with sheet\_id and range parameters. \|
\| \`matchCase\` \| boolean \| No \| Whether the search should be case-sensitive. \|
\| \`sheetName\` \| string \| No \| The name/title of the sheet (tab) to search within (e.g., 'Sheet1', 'Sales Data'). The sheet name will be resolved to its numeric sheet ID. Mutually exclusive with sheet\_id, range/range\_sheet\_id parameters, and all\_sheets. \|
\| \`endRowIndex\` \| integer \| No \| The end row (0-indexed, exclusive) of the range. Only used when range\_sheet\_id is provided without a 'range' parameter. \|
\| \`rangeSheetId\` \| integer \| No \| The numeric sheet ID for a GridRange-based search. Required when using the 'range' parameter with A1 notation. Can also be used alone or with row/column index parameters to define a specific range. Mutually exclusive with sheet\_id and all\_sheets. \|
\| \`searchByRegex\` \| boolean \| No \| Whether to treat the find text as a regular expression. \|
\| \`spreadsheetId\` \| string \| Yes \| The ID of the spreadsheet to update. \|
\| \`startRowIndex\` \| integer \| No \| The start row (0-indexed, inclusive) of the range. Only used when range\_sheet\_id is provided without a 'range' parameter. \|
\| \`endColumnIndex\` \| integer \| No \| The end column (0-indexed, exclusive) of the range. Column A = 0, B = 1, etc. Only used when range\_sheet\_id is provided without a 'range' parameter. \|
\| \`includeFormulas\` \| boolean \| No \| Whether to include cells with formulas in the search. If true, formulas are searched and can be replaced. If false, only cell values (not formulas) are searched. If not specified, the default API behavior applies (both formulas and values are searched). \|
\| \`matchEntireCell\` \| boolean \| No \| Whether to match only cells that contain the entire search term. \|
\| \`startColumnIndex\` \| integer \| No \| The start column (0-indexed, inclusive) of the range. Column A = 0, B = 1, etc. Only used when range\_sheet\_id is provided without a 'range' parameter. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Find worksheet by title (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_FIND\_WORKSHEET\_BY\_TITLE\`

DEPRECATED: Use GetSpreadsheetInfo instead. Finds a worksheet by its exact, case-sensitive title within a Google Spreadsheet; returns a boolean indicating if found and the matched worksheet's metadata when found, or None when not found.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet from the URL (e.g., https://docs.google.com/spreadsheets/d/{spreadsheet\_id}/edit). Important: This is NOT the spreadsheet's display name/title. It is the long alphanumeric string (typically 40-45 characters) from the URL containing only letters, numbers, hyphens, and underscores. \|
\| \`worksheet\_title\` \| string \| Yes \| The exact, case-sensitive title of the worksheet (tab name) to find. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Format cell

\*\*Slug:\*\* \`GOOGLESUPER\_FORMAT\_CELL\`

Applies text and background cell formatting to a specified range in a Google Sheets worksheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`red\` \| number \| No \| Red component of the background color (0.0-1.0). \|
\| \`blue\` \| number \| No \| Blue component of the background color (0.0-1.0). \|
\| \`bold\` \| boolean \| No \| Apply bold formatting. \|
\| \`green\` \| number \| No \| Green component of the background color (0.0-1.0). \|
\| \`range\` \| string \| No \| OPTION 1: Cell range in A1 notation (RECOMMENDED). Supports: single cells ('A1', 'F9'), cell ranges ('A1:B5'), entire columns ('A', 'I:J'), entire rows ('1', '1:5'). Also accepts sheet-prefixed ranges ('Sheet1!A1', 'Instagram Calendar!A1:E1') for convenience - if provided, the sheet prefix is stripped and ignored. The actual sheet used is determined by the sheet\_name or worksheet\_id parameter. Provide EITHER this field OR all four index fields below, not both. \|
\| \`italic\` \| boolean \| No \| Apply italic formatting. \|
\| \`fontSize\` \| integer \| No \| Font size in points. \|
\| \`text\_link\` \| string \| No \| Cell-level text link URI. Must include a URI scheme, such as 'https://' or 'mailto:'. \|
\| \`underline\` \| boolean \| No \| Apply underline formatting. \|
\| \`sheet\_name\` \| string \| No \| The worksheet name/title (e.g., 'Sheet1', 'Q3 Report'). Provide either this field OR worksheet\_id, not both. If both are provided, sheet\_name takes precedence and will be resolved to worksheet\_id. \|
\| \`text\_color\` \| string \| No \| Text color as 6-digit hex. \|
\| \`font\_family\` \| string \| No \| Font family. \|
\| \`padding\_top\` \| integer \| No \| Top padding in pixels. \|
\| \`border\_color\` \| string \| No \| Border color as 6-digit hex. \|
\| \`border\_style\` \| string ("DOTTED" \| "DASHED" \| "SOLID" \| "SOLID\_MEDIUM" \| "SOLID\_THICK" \| "NONE" \| "DOUBLE") \| No \| Border styles supported by Google Sheets. \|
\| \`padding\_left\` \| integer \| No \| Left padding in pixels. \|
\| \`worksheet\_id\` \| integer \| No \| The worksheet identifier. Accepts EITHER: (1) The sheetId from the Google Sheets API (a large number like 1534097477, obtainable via GOOGLESHEETS\_GET\_SPREADSHEET\_INFO), OR (2) The 0-based positional index of the worksheet (0 for first sheet, 1 for second, etc.). The action will first try to match by sheetId, then fall back to matching by index. Defaults to 0 (first sheet). Provide either this field OR sheet\_name, not both. \|
\| \`end\_row\_index\` \| integer \| No \| OPTION 2: 0-based index of the row AFTER the last row (exclusive). Required if 'range' is not provided. Must provide ALL four index fields together. \|
\| \`padding\_right\` \| integer \| No \| Right padding in pixels. \|
\| \`strikethrough\` \| boolean \| No \| Apply strikethrough formatting. \|
\| \`wrap\_strategy\` \| string ("OVERFLOW\_CELL" \| "LEGACY\_WRAP" \| "CLIP" \| "WRAP") \| No \| How text wraps within cells. \|
\| \`padding\_bottom\` \| integer \| No \| Bottom padding in pixels. \|
\| \`spreadsheet\_id\` \| string \| Yes \| Identifier of the Google Sheets spreadsheet. \|
\| \`text\_direction\` \| string ("LEFT\_TO\_RIGHT" \| "RIGHT\_TO\_LEFT") \| No \| Text direction in a cell. \|
\| \`start\_row\_index\` \| integer \| No \| OPTION 2: 0-based row index (row 1 = index 0, row 9 = index 8). Required if 'range' is not provided. Must provide ALL four index fields together. \|
\| \`background\_alpha\` \| number \| No \| Background alpha from 0.0 to 1.0. \|
\| \`background\_color\` \| string \| No \| Background color as 6-digit hex. \|
\| \`end\_column\_index\` \| integer \| No \| OPTION 2: 0-based index of the column AFTER the last column (exclusive). Required if 'range' is not provided. Must provide ALL four index fields together. \|
\| \`number\_format\_type\` \| string ("TEXT" \| "NUMBER" \| "PERCENT" \| "CURRENCY" \| "DATE" \| "TIME" \| "DATE\_TIME" \| "SCIENTIFIC") \| No \| How number values should be represented to the user. \|
\| \`start\_column\_index\` \| integer \| No \| OPTION 2: 0-based column index (A = 0, B = 1, F = 5). Required if 'range' is not provided. Must provide ALL four index fields together. \|
\| \`vertical\_alignment\` \| string ("TOP" \| "MIDDLE" \| "BOTTOM") \| No \| Vertical alignment of text in a cell. \|
\| \`text\_rotation\_angle\` \| integer \| No \| Text rotation angle from -90 to 90. \|
\| \`horizontal\_alignment\` \| string ("LEFT" \| "CENTER" \| "RIGHT") \| No \| Horizontal alignment of text in a cell. \|
\| \`number\_format\_pattern\` \| string \| No \| Optional number/date pattern. \|
\| \`hyperlink\_display\_type\` \| string ("LINKED" \| "PLAIN\_TEXT") \| No \| How a hyperlink should be displayed in a cell. \|
\| \`text\_rotation\_vertical\` \| boolean \| No \| Make text read top to bottom. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Forward email message

\*\*Slug:\*\* \`GOOGLESUPER\_FORWARD\_MESSAGE\`

Forward an existing Gmail message to specified recipients, preserving original body and attachments. Verify recipients and content before forwarding to avoid unintended exposure. Bulk forwarding may trigger 429/5xx rate limits; keep concurrency to 5–10 and apply backoff. Messages near Gmail's size limits may fail; reconstruct a smaller draft if needed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cc\` \| array \| No \| List of email addresses to CC. \|
\| \`bcc\` \| array \| No \| List of email addresses to BCC. \|
\| \`user\_id\` \| string \| No \| User's email address or 'me' for the authenticated user. \|
\| \`message\_id\` \| string \| Yes \| Gmail message ID (hexadecimal string, e.g., '17f45ec49a9c3f1b'). Must contain only hex characters \[0-9a-fA-F\]. Obtain this from actions like 'List Messages' or 'Fetch Emails'. \|
\| \`recipients\` \| array \| Yes \| List of email addresses to forward the message to. \|
\| \`additional\_text\` \| string \| No \| Optional additional text to include before the forwarded content. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Query Free/Busy Information (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_FREE\_BUSY\_QUERY\`

DEPRECATED: Use GOOGLECALENDAR\_FIND\_FREE\_SLOTS instead (though this tool provides wider secondary/shared calendar coverage). Returns opaque busy intervals only—no event titles or details; use GOOGLECALENDAR\_EVENTS\_LIST when event details are needed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`items\` \| array \| Yes \| List of calendars and/or groups to query. Accepts either strings (e.g., \['primary', 'user@example.com'\]) or objects with an 'id' field (e.g., \[{'id': 'primary'}\]). String values are automatically converted to the proper format. Only calendars with at least freeBusyReader-level access are queried; omitting shared/secondary calendars can hide real conflicts. Batch all attendees into one call to avoid 403 rateLimitExceeded or 429 tooManyRequests errors. \|
\| \`timeMax\` \| string \| Yes \| The end of the interval for the query formatted as per RFC3339. Exclusive bound; must be greater than timeMin. Keep the timeMin–timeMax window within ~90 days; larger spans may return empty or degraded results. \|
\| \`timeMin\` \| string \| Yes \| The start of the interval for the query formatted as per RFC3339. Must be strictly less than timeMax. For full-day windows, use local 00:00 in the target timezone to avoid DST/off-by-one errors. \|
\| \`timeZone\` \| string \| No \| Time zone used in the response. Optional. The default is UTC. Defaults to UTC, which skews working-hours analysis for users in other timezones; always supply a valid IANA timezone (e.g., 'America/New\_York'). \|
\| \`groupExpansionMax\` \| integer \| No \| Maximal number of calendar identifiers to be provided for a single group. Optional. An error is returned for a group with more members than this value. Maximum value is 100. \|
\| \`calendarExpansionMax\` \| integer \| No \| Maximal number of calendars for which FreeBusy information is to be provided. Optional. Maximum value is 50. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Generate File IDs

\*\*Slug:\*\* \`GOOGLESUPER\_GENERATE\_IDS\`

Generates a set of file IDs which can be provided in create or copy requests. Use when you need to pre-allocate IDs for new files or copies.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string \| No \| The type of items for which the IDs can be used. For example, 'files' or 'shortcuts'. \|
\| \`count\` \| integer \| No \| The number of IDs to return. Value must be between 1 and 1000, inclusive. \|
\| \`space\` \| string \| No \| The space in which the IDs can be used. Supported values are 'drive' and 'appDataFolder'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Geocode Address

\*\*Slug:\*\* \`GOOGLESUPER\_GEOCODE\_ADDRESS\`

DEPRECATED: Legacy API to convert street addresses into geographic coordinates (latitude and longitude). This API works best with API key authentication. For OAuth connections without an API key, you may need to provide the 'key' parameter or use the newer 'Text Search' action instead. Use when you need to geocode an address or location to get its precise latitude/longitude coordinates.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`key\` \| string \| No \| Your application's API key. This parameter is required when using API key authentication. If not provided, will attempt to use OAuth authentication (requires X-Goog-User-Project header with project ID). \|
\| \`bounds\` \| string \| No \| Bounding box of the viewport within which to bias geocode results more prominently. Format: southwest\_lat,southwest\_lng\|northeast\_lat,northeast\_lng. This parameter will only influence, not fully restrict, results from the geocoder. \|
\| \`region\` \| string \| No \| Region code specified as a ccTLD (country code top-level domain) two-character value. This parameter will only influence, not fully restrict, results from the geocoder. \|
\| \`address\` \| string \| No \| The street address that you want to geocode, in the format used by the national postal service of the country concerned. Additional address elements such as business names and unit, suite or floor numbers should be avoided. Street address elements should be delimited by spaces (shown here as url-escaped to %20). If both address and components are provided, address takes precedence. \|
\| \`language\` \| string \| No \| Language in which to return results. If not supplied, the geocoder attempts to use the preferred language as specified in the Accept-Language header, or the native language of the domain from which the request is sent. \|
\| \`components\` \| string \| No \| Component filters separated by a pipe (\|). Each component filter consists of component:value pair and fully restricts results from the geocoder. Examples: components=country:US or components=postal\_code:94043\|country:US. If both address and components are provided, address takes precedence. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Geocode Address With Query

\*\*Slug:\*\* \`GOOGLESUPER\_GEOCODE\_ADDRESS\_WITH\_QUERY\`

Tool to map addresses to geographic coordinates with query parameter. Use when you need to convert a textual address into latitude/longitude coordinates using the modern v4beta API. Results may match multiple places — always verify \`formattedAddress\`, \`region\`, and \`addressComponents\` in the response before using returned coordinates.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`region\_code\` \| string \| No \| Region code, specified as a ccTLD two-character value (e.g., 'US', 'FR'). This parameter affects results based on applicable law. \|
\| \`address\_query\` \| string \| Yes \| The unstructured address to geocode. This should be a single string containing the full address (e.g., '1600 Amphitheatre Parkway Mountain View CA'). Include city, state/region, and country where possible — incomplete or ambiguous strings may return zero results or incorrect matches. \|
\| \`language\_code\` \| string \| No \| Language in which the results should be returned (e.g., 'en', 'es', 'fr'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Geocode Destinations

\*\*Slug:\*\* \`GOOGLESUPER\_GEOCODE\_DESTINATIONS\`

Tool to perform destination lookup and return detailed destination information including primary place, containing places, sub-destinations, landmarks, entrances, and navigation points. Use when you need comprehensive destination data for an address, place ID, or geographic coordinates.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`place\` \| string \| No \| Resource name in format 'places/{placeId}' to retrieve destination by Place ID \|
\| \`regionCode\` \| string \| No \| Two-character ccTLD region code for formatting/filtering (e.g., 'US', 'UK') \|
\| \`travelModes\` \| array \| No \| Filter navigation points by travel mode. Supported values: DRIVE, WALK \|
\| \`addressQuery\` \| object \| No \| Address query in unstructured or structured format \|
\| \`languageCode\` \| string \| No \| Preferred language code for results (e.g., 'en', 'es', 'fr') \|
\| \`locationQuery\` \| object \| No \| Location query using geographic coordinates \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Reverse Geocode Location

\*\*Slug:\*\* \`GOOGLESUPER\_GEOCODE\_LOCATION\`

Tool to convert geographic coordinates (latitude and longitude) to human-readable addresses using reverse geocoding. Use when you need to find the address or place name for a given set of coordinates. A single coordinate pair may return multiple results; verify formattedAddress, region, and addressComponents before committing to a result.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`types\` \| array \| No \| Set of type tags to restrict results; results without specified types are removed \|
\| \`latitude\` \| number \| Yes \| Latitude coordinate in degrees, range \[-90.0, +90.0\] \|
\| \`longitude\` \| number \| Yes \| Longitude coordinate in degrees, range \[-180.0, +180.0\] \|
\| \`regionCode\` \| string \| No \| Region code specified as a ccTLD two-character value, affecting results based on applicable law \|
\| \`languageCode\` \| string \| No \| Language code in which the results should be returned (BCP-47 format) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Geocode Place by ID

\*\*Slug:\*\* \`GOOGLESUPER\_GEOCODE\_PLACE\`

Tool to perform geocode lookup using a place identifier to retrieve address and coordinates. Use when you need to get detailed geographic information for a specific Google Place ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`place\_id\` \| string \| Yes \| Place identifier to geocode. Must be in the format 'places/{placeId}' or just the place ID (e.g., 'ChIJj61dQgK6j4AR4GeTYWZsKWw'). The unique identifier for a place in the Google Places database. \|
\| \`regionCode\` \| string \| No \| Region code specified as a ccTLD two-character value, affecting results based on applicable law and address formatting. \|
\| \`languageCode\` \| string \| No \| Language code in which the results should be returned (BCP-47 format). Defaults to 'en' if not specified. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Geocoding API

\*\*Slug:\*\* \`GOOGLESUPER\_GEOCODING\_API\`

Convert addresses into geographic coordinates (latitude and longitude) and vice versa (reverse geocoding), or get an address for a Place ID. Uses the Geocoding API v4 (v4beta) which supports OAuth2 authentication. Exactly one of \`address\`, \`latlng\`, or \`place\_id\` must be provided per request; omitting all three or mixing incompatible combinations yields no useful results.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`key\` \| string \| No \| Your application's API key. If not provided, will be extracted from connection metadata. \|
\| \`bounds\` \| string \| No \| The bounding box of the viewport within which to bias geocode results more prominently (e.g., '34.172684,-118.604794\|34.236144,-118.500938'). This parameter will only influence, not fully restrict, results. \|
\| \`latlng\` \| string \| No \| The latitude and longitude coordinates specifying the location for which you want the closest, human-readable address (e.g., '40.714224,-73.961452'). Provide for reverse geocoding. \|
\| \`region\` \| string \| No \| The region code, specified as a ccTLD ('top-level domain') two-character value. This parameter will only influence, not fully restrict, results from the geocoder. \|
\| \`address\` \| string \| No \| The street address or plus code that you want to geocode. Provide for geocoding (address to coordinates). \|
\| \`language\` \| string \| No \| The language in which to return results. If language is not supplied, the geocoder attempts to use the preferred language as specified in the Accept-Language header, or the native language of the domain from which the request is sent. \|
\| \`place\_id\` \| string \| No \| The place ID of the place for which you wish to obtain the human-readable address. Provide for place ID geocoding. \|
\| \`components\` \| string \| No \| A components filter with elements separated by a pipe (\|). E.g., 'postal\_code:94043\|country:US'. Used for geocoding, can be restrictive or biasing. Supplying only \`components\` without \`address\` may return ZERO\_RESULTS for some queries. \|
\| \`result\_type\` \| string \| No \| A filter of one or more address types, separated by a pipe (\|) (e.g., 'street\_address\|locality'). Used for reverse geocoding and place ID geocoding. \|
\| \`location\_type\` \| string \| No \| A filter of one or more location types, separated by a pipe (\|) (e.g., 'ROOFTOP\|RANGE\_INTERPOLATED'). Used for reverse geocoding and place ID geocoding. \|
\| \`extra\_computations\` \| array \| No \| Use this parameter to specify additional features in the response. Can select multiple values. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Geolocate Device

\*\*Slug:\*\* \`GOOGLESUPER\_GEOLOCATE\`

Tool to determine location based on cell towers and WiFi access points. Use when you need to find the geographic location of a device using network infrastructure data.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`carrier\` \| string \| No \| Carrier name. \|
\| \`radioType\` \| string ("gsm" \| "cdma" \| "wcdma" \| "lte" \| "nr") \| No \| Radio type. Defaults to 'gsm'. \|
\| \`cellTowers\` \| array \| No \| Array of cell tower objects. \|
\| \`considerIp\` \| boolean \| No \| Whether to fall back to IP geolocation if WiFi and cell tower signals are missing. Defaults to true. \|
\| \`wifiAccessPoints\` \| array \| No \| Array of WiFi access point objects (minimum 2 required for success). \|
\| \`homeMobileCountryCode\` \| integer \| No \| Mobile country code for device's home network. Range: 0-999. \|
\| \`homeMobileNetworkCode\` \| integer \| No \| MNC for GSM/WCDMA/LTE/NR (0-999); SID for CDMA (0-32767). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get 2D Map Tile

\*\*Slug:\*\* \`GOOGLESUPER\_GET2D\_TILE\`

Tool to retrieve a 2D map tile image at specified coordinates for building custom map visualizations. Use when you need to download individual map tile images for roadmap, satellite, or terrain views. Requires a valid session token from the createSession endpoint.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`x\` \| integer \| Yes \| Tile column coordinate. Valid range: \[0, (2^zoom)-1\]. \|
\| \`y\` \| integer \| Yes \| Tile row coordinate. Valid range: \[0, (2^(zoom-1))-1\]. Valid range: \[0, (2^zoom)-1\], same as \`x\`. \|
\| \`z\` \| integer \| Yes \| Zoom level ranging from 0 (entire world) to 22 (highly detailed). \|
\| \`key\` \| string \| No \| Google API key for authentication. If not provided, will be extracted from connection metadata. Required if not using Bearer token authentication. \|
\| \`session\` \| string \| Yes \| Session token UUID obtained from /v1/createSession endpoint. Valid for approximately two weeks. Required for all 2D tile requests. Reuse across multiple tile requests; each createSession call consumes quota. \|
\| \`orientation\` \| integer \| No \| Rotation parameter in degrees counter-clockwise. Valid values: 0, 90, 180, or 270. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get 3D Tiles Root

\*\*Slug:\*\* \`GOOGLESUPER\_GET3D\_TILES\_ROOT\`

Tool to retrieve the 3D Tiles tileset root configuration for photorealistic 3D map rendering. Use when you need to initialize a 3D renderer with Google's photorealistic tiles following the OGC 3D Tiles specification. The Map Tiles API is billable per request; cache the root response client-side and avoid repeated calls.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`key\` \| string \| No \| Your Google Maps API key with Map Tiles API enabled. If not provided, will be extracted from connection metadata. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get about

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_ABOUT\`

Tool to retrieve information about the user, the user's Drive, and system capabilities. Use when you need to check storage quotas, user details, or supported import/export formats. Note: storageQuota reflects My Drive (personal) storage only — it does not cover shared drives; use GOOGLEDRIVE\_LIST\_SHARED\_DRIVES and GOOGLEDRIVE\_GET\_DRIVE for shared drive quotas. A successful response confirms base Drive read access only; write access and shared drive access must be verified separately.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| A comma-separated list of fields to include in the response. Use \`\*\` to include all fields. Supported fields in Drive API v3: kind, user, storageQuota, importFormats, exportFormats, maxImportSizes, maxUploadSize, appInstalled, canCreateDrives, canCreateTeamDrives (deprecated), driveThemes, teamDriveThemes (deprecated), folderColorPalette. Note: rootFolderId was removed in v3 and is not supported. Note: storageQuota sub-fields (limit, usage, usageInDrive, usageInDriveTrash) are returned as strings representing bytes — convert to numeric types before arithmetic. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Account

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_ACCOUNT\`

Tool to retrieve a single Account by its resource name. Use when you need detailed account info after confirming the account resource name (e.g., accounts/100).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. The resource name of the Account to retrieve. Must be in the exact format: accounts/{account\_id} where account\_id is a numeric identifier. IMPORTANT: Must start with 'accounts/' prefix, contain no forward slashes in the account\_id, have no trailing slashes, and no additional path segments. Valid example: 'accounts/100'. Invalid examples: '100' (missing prefix), 'accounts/100/' (trailing slash), 'accounts/100/extra' (extra segments) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Album

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_ALBUM\`

Returns the album based on the specified albumId.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`albumId\` \| string \| Yes \| Identifier of the album to be requested. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get App

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_APP\`

Tool to get information about a specific Drive app by ID. Use 'self' as the app ID to get information about the calling app.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`appId\` \| string \| Yes \| The ID of the app. Use 'self' to refer to the calling app. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Gmail attachment

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_ATTACHMENT\`

Retrieves a specific attachment by ID from a message in a user's Gmail mailbox, requiring valid message and attachment IDs. Returns the downloaded file with its MIME type and filename. Attachments exceeding ~25 MB may be exposed as Google Drive links — use GOOGLEDRIVE\_DOWNLOAD\_FILE when a Drive file\_id is present instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| User's email address ('me' for authenticated user). \|
\| \`file\_name\` \| string \| Yes \| Desired filename for the downloaded attachment. This is a required string field - do not pass null. \|
\| \`message\_id\` \| string \| Yes \| Immutable ID of the message containing the attachment. This is a required string field - do not pass null. Obtain the message\_id from Gmail API responses (e.g., fetchEmails, listThreads). \|
\| \`attachment\_id\` \| string \| Yes \| The internal Gmail attachment ID (NOT the filename). This is a system-generated token string like 'ANGjdJ8s...'. Obtain this ID from the 'attachmentId' field in the 'attachmentList' array returned by fetchEmails or fetchMessageByMessageId actions. Do NOT pass the filename (e.g., 'report.pdf'). Requires a fully hydrated message payload: call GMAIL\_FETCH\_MESSAGE\_BY\_MESSAGE\_ID with format='full' to obtain valid attachment IDs — lightweight fetch modes may omit attachmentList entirely. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Attribution Settings

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_ATTRIBUTION\_SETTINGS\`

Tool to retrieve attribution configuration for a Google Analytics property. Use when you need to check attribution models, lookback windows, and conversion export settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. The resource name of the attribution settings to retrieve. Must be in the exact format: properties/{property\_id}/attributionSettings where property\_id is a numeric identifier. IMPORTANT: Must start with 'properties/' prefix, contain no forward slashes in the property\_id, have no trailing slashes, and must end with '/attributionSettings'. Valid example: 'properties/489591273/attributionSettings'. Invalid examples: '489591273' (missing prefix), 'properties/489591273' (missing suffix), 'properties/489591273/attributionSettings/' (trailing slash) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Audience

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_AUDIENCE\`

Tool to retrieve a single Audience configuration from a Google Analytics property. Use when you need detailed audience information including membership criteria and filter clauses.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`audienceId\` \| string \| Yes \| Required. The audience identifier to retrieve. Provide the numeric audience ID (e.g., '11228260226'). \|
\| \`propertyId\` \| string \| Yes \| Required. The Google Analytics property identifier. Can be provided as just the numeric ID (e.g., '123456789') or as full resource name (e.g., 'properties/123456789'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Audience Export

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_AUDIENCE\_EXPORT\`

Tool to get configuration metadata about a specific audience export. Use when you need to understand an audience export after it has been created or check its status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. The audience export resource name. Format: properties/{property}/audienceExports/{audience\_export}. Example: properties/489591273/audienceExports/19298228 \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Audience List

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_AUDIENCE\_LIST\`

Tool to get configuration metadata about a specific audience list. Use after confirming the audience list resource name.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. The resource name of the Audience List to retrieve. Format: properties/{property}/audienceLists/{audienceList}. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Auto-Forwarding Settings

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_AUTO\_FORWARDING\`

Tool to get the auto-forwarding setting for the specified account. Use when you need to retrieve the current auto-forwarding configuration including enabled status, forwarding email address, and message disposition.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address. The special value 'me' can be used to indicate the authenticated user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch Get Spreadsheet Values (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_BATCH\_VALUES\`

DEPRECATED: Use GOOGLESHEETS\_BATCH\_GET instead. Tool to return one or more ranges of values from a spreadsheet. Use when you need to retrieve data from multiple ranges in a single request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ranges\` \| array \| Yes \| The A1 notation or R1C1 notation of the ranges to retrieve values from. Specify one or more ranges (e.g., \['Sheet1!A1:B10', 'Sheet2!C1:D5'\]). For sheet names with spaces or special characters, wrap in single quotes (e.g., "'My Sheet'!A1:B10"). \|
\| \`spreadsheet\_id\` \| string \| Yes \| The ID of the spreadsheet to retrieve data from. This is the unique identifier found in the spreadsheet URL between '/d/' and '/edit' (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'). \|
\| \`major\_dimension\` \| string ("DIMENSION\_UNSPECIFIED" \| "ROWS" \| "COLUMNS") \| No \| The major dimension for results. \|
\| \`value\_render\_option\` \| string ("FORMATTED\_VALUE" \| "UNFORMATTED\_VALUE" \| "FORMULA") \| No \| How values should be rendered in the output. \|
\| \`date\_time\_render\_option\` \| string ("SERIAL\_NUMBER" \| "FORMATTED\_STRING") \| No \| How dates, times, and durations should be represented in the output. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Google Calendar

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CALENDAR\`

Retrieves a specific Google Calendar, identified by \`calendar\_id\`, to which the authenticated user has access. Response includes \`timeZone\` (IANA format, e.g., 'America/Los\_Angeles') — use it directly when constructing \`timeMin\`/\`timeMax\` in other tools to avoid DST errors. An empty \`defaultReminders\` list is valid (no defaults configured). Insufficient \`accessRole\` may omit fields like \`defaultReminders\` and \`colorId\`.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendar\_id\` \| string \| No \| Identifier of the Google Calendar to retrieve. Must be 'primary' (the default) for the user's main calendar, or an email-like identifier (e.g., 'user@example.com' or 'en.usa#holiday@group.v.calendar.google.com'). IMPORTANT: Calendar display names/titles (e.g., 'Work', 'Vacation') are NOT valid identifiers and will result in errors. To find a calendar's ID, use the LIST\_CALENDARS action which returns the 'id' field for each calendar. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Calendar Profile (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CALENDAR\_PROFILE\`

DEPRECATED: Use CalendarListGet instead. Tool to retrieve the authenticated user's primary calendar profile. Use when you need to get information about the user's main calendar, including timezone, settings, and preferences.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Campaign By Id

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CAMPAIGN\_BY\_ID\`

GetCampaignById Tool returns details of a campaign in Google Ads. Requires an active Google Ads OAuth connection with the correct customer\_id configured; missing or mismatched customer\_id will cause empty results.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| id of the campaign to search on GoogleAds. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get campaign by name

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CAMPAIGN\_BY\_NAME\`

Queries Google Ads via SQL to retrieve a campaign by its exact name. Requires an active Google Ads connection with valid customer\_id and appropriate OAuth scopes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Name of the campaign to search on Google Ads. Matched using exact GAQL equality. Unicode and punctuation are supported except quotes, backslashes, NUL, and line breaks, which cannot be safely embedded in the query literal. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Change (v2 - Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CHANGE\`

Tool to get a specific change by ID from Google Drive v2 API. Deprecated: Use changes.getStartPageToken and changes.list to retrieve recent changes instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`driveId\` \| string \| No \| The shared drive from which the change will be returned. \|
\| \`callback\` \| string \| No \| JSONP \|
\| \`changeId\` \| string \| Yes \| The ID of the change. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`teamDriveId\` \| string \| No \| Deprecated: Use \`driveId\` instead. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. \|
\| \`supportsTeamDrives\` \| boolean \| No \| Deprecated: Use \`supportsAllDrives\` instead. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Changes Start Page Token

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CHANGES\_START\_PAGE\_TOKEN\`

Tool to get the starting pageToken for listing future changes in Google Drive. Returns only a token — pass it to GOOGLEDRIVE\_LIST\_CHANGES to retrieve actual changes. Persist this token; losing it requires a full rescan. The token is forward-looking: GOOGLEDRIVE\_LIST\_CHANGES may return no results if no changes have occurred since issuance. For simple recent-file lookups, prefer GOOGLEDRIVE\_FIND\_FILE; use this tool only for incremental change-feed workflows.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`driveId\` \| string \| No \| The ID of the shared drive for which the starting pageToken for listing future changes from that shared drive will be returned. \|
\| \`teamDriveId\` \| string \| No \| Deprecated: Use driveId instead. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Defaults to false. \|
\| \`supportsTeamDrives\` \| boolean \| No \| Deprecated: Use supportsAllDrives instead. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Child Reference (v2)

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CHILD\`

Tool to get a specific child reference for a folder using Drive API v2. Use when you need to verify a specific file exists as a child of a folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format options. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`childId\` \| string \| Yes \| The ID of the child. \|
\| \`callback\` \| string \| No \| JSONP callback parameter. \|
\| \`folderId\` \| string \| Yes \| The ID of the folder. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Comment

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_COMMENT\`

Tool to get a comment by ID. Use when you need to retrieve a specific comment from a Google Drive file and have both the file ID and comment ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The ID of the file. \|
\| \`commentId\` \| string \| Yes \| The ID of the comment. \|
\| \`includeDeleted\` \| boolean \| No \| Whether to return deleted comments. Deleted comments will not include their original content. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get conditional format rules

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CONDITIONAL\_FORMAT\_RULES\`

List conditional formatting rules for each sheet (or a selected sheet) in a normalized, easy-to-edit form. Use when you need to view, audit, or prepare to modify conditional format rules.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sheet\_id\` \| integer \| No \| Optional filter: return rules only for the sheet with this exact numeric sheetId. If not provided, returns rules for all sheets. If both sheet\_title and sheet\_id are provided, sheet\_id takes precedence. \|
\| \`sheet\_title\` \| string \| No \| Optional filter: return rules only for the sheet with this exact title. If not provided, returns rules for all sheets. \|
\| \`spreadsheet\_id\` \| string \| Yes \| Unique identifier of the Google Spreadsheet, typically found in its URL. \|
\| \`exclude\_tables\_in\_banded\_ranges\` \| boolean \| No \| True if tables should be excluded in the banded ranges. False if not set. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get conference record by name

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CONFERENCE\_RECORD\_BY\_NAME\`

Tool to get a specific conference record by its resource name. Use when you have the conference record ID and need to retrieve detailed information about a single meeting instance.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. Resource name of the conference record. Format: 'conferenceRecords/{conference\_record}' where {conference\_record} is a unique ID for each instance of a call within a space. Example: 'conferenceRecords/GLkPdCDLsjSXet2-QH9dDxIPOAIIigIgABgECA' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get contacts

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CONTACTS\`

Fetches contacts (connections) for the authenticated Google account, allowing selection of specific data fields and pagination. Only covers saved contacts and 'Other Contacts'; email-header-only senders are out of scope. Contact records may have sparse data — handle missing fields gracefully. People API shares a per-user QPS quota; HTTP 429 requires exponential backoff (1s, 2s, 4s).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_token\` \| string \| No \| Token to retrieve a specific page of results, obtained from 'nextPageToken' in a previous response. Repeat calls with each successive \`nextPageToken\` until it is absent — stopping early silently omits contacts. \|
\| \`person\_fields\` \| string \| No \| Comma-separated person fields to retrieve for each contact (e.g., 'names,emailAddresses'). \|
\| \`resource\_name\` \| string \| No \| Identifier for the person resource whose connections are listed; use 'people/me' for the authenticated user. \|
\| \`include\_other\_contacts\` \| boolean \| No \| Include 'Other Contacts' (interacted with but not explicitly saved) in addition to regular contacts. WARNING: 'Other Contacts' often have incomplete data - they may lack names, phone numbers, and other fields even when requested. These auto-generated contacts are created from email interactions and typically only have email addresses. Set to False if you need contacts with complete name information. When True, each contact will have a 'contactSource' field indicating its origin. When True, \`person\_fields\` is restricted to \`emailAddresses\`, \`names\`, \`phoneNumbers\`, and \`metadata\` only — requesting other fields (e.g., \`organizations\`, \`birthdays\`) causes validation errors or silent omissions. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Conversion Action Tag Snippets

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CONVERSION\_ACTION\_TAG\_SNIPPETS\`

Retrieve provider-generated website or call conversion tag snippets after creating a conversion action. Markup is returned exactly as Google provides it.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`conversion\_action\_id\` \| string \| Yes \| Numeric Google Ads conversion action ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get current date and time

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CURRENT\_DATE\_TIME\`

Gets the current date and time, allowing for a specific timezone offset. Call this tool first before computing relative dates (e.g., 'tomorrow', 'next Monday') to avoid off-by-one-day errors across timezones.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`timezone\` \| string \| No \| Timezone specification. Accepts: (1) IANA timezone identifier (e.g., 'America/New\_York', 'Asia/Kolkata', 'Europe/London') - RECOMMENDED, (2) Common timezone abbreviations (e.g., 'PST', 'EST', 'CST', 'GMT', 'UTC') - will be auto-converted to IANA, or (3) Numeric UTC offset in hours (e.g., -5, 5.5). Use positive values for east of UTC, negative for west. Default 0 is UTC. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Custom Dimension

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CUSTOM\_DIMENSION\`

Tool to retrieve a single CustomDimension by its resource name. Use when you need detailed information about a specific custom dimension including its display name, scope, and parameter name.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. The resource name of the CustomDimension to retrieve. Must be in the exact format: properties/{property\_id}/customDimensions/{customDimension\_id} where both property\_id and customDimension\_id are numeric identifiers. IMPORTANT: Must start with 'properties/' prefix, contain exactly one '/customDimensions/' segment, have no trailing slashes, and no additional path segments. Valid example: 'properties/489591273/customDimensions/13661238280'. Invalid examples: '489591273/13661238280' (missing prefix), 'properties/489591273/customDimensions/13661238280/' (trailing slash), 'properties/489591273/customDimensions/13661238280/extra' (extra segments) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get customer lists

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_CUSTOMER\_LISTS\`

GetCustomerLists Tool lists all customer lists (audience/remarketing lists) in Google Ads. These are user segments for targeting, not Google Ads accounts — list IDs are distinct from account IDs. When multiple lists share similar names, review all returned results before selecting one for downstream operations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_token\` \| string \| No \| Pagination token from a previous response's next\_page\_token. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Data Retention Settings

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_DATA\_RETENTION\_SETTINGS\`

Tool to retrieve data retention configuration for a Google Analytics property. Use when you need to check event-level and user-level data retention durations and reset settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. The resource name of the data retention settings to retrieve. Must be in the exact format: properties/{property\_id}/dataRetentionSettings where property\_id is a numeric identifier. IMPORTANT: Must start with 'properties/' prefix, contain no forward slashes in the property\_id, have no trailing slashes, and must end with '/dataRetentionSettings'. Valid example: 'properties/489591273/dataRetentionSettings'. Invalid examples: '489591273' (missing prefix), 'properties/489591273' (missing suffix), 'properties/489591273/dataRetentionSettings/' (trailing slash) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Data Sharing Settings

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_DATA\_SHARING\_SETTINGS\`

Tool to retrieve data sharing configuration for a Google Analytics account. Use when you need to check which data sharing settings are enabled for an account, including sharing with Google support, sales teams, products, and benchmarking.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. The resource name of the data sharing settings to retrieve. Must be in the exact format: accounts/{account\_id}/dataSharingSettings where account\_id is a numeric identifier. IMPORTANT: Must start with 'accounts/' prefix, contain no forward slashes in the account\_id, have no trailing slashes, and must end with '/dataSharingSettings'. Valid example: 'accounts/1000/dataSharingSettings'. Invalid examples: '1000' (missing prefix), 'accounts/1000' (missing suffix), 'accounts/1000/dataSharingSettings/' (trailing slash) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Data Validation Rules

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_DATA\_VALIDATION\_RULES\`

Tool to extract data validation rules from a Google Sheets spreadsheet. Use when you need to understand dropdown lists, allowed values, custom formulas, or other validation constraints for cells.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ranges\` \| array \| No \| Optional list of A1 ranges to scan. If omitted, the entire sheet(s) will be scanned. WARNING: Scanning entire large sheets may be slow. \|
\| \`sheetId\` \| integer \| No \| Optional sheet ID to filter by. If omitted, all sheets will be scanned. \|
\| \`sheetTitle\` \| string \| No \| Optional sheet title to filter by. If omitted, all sheets will be scanned. \|
\| \`includeEmpty\` \| boolean \| No \| If true, include cells without validation rules in the output. Default is false. \|
\| \`spreadsheetId\` \| string \| Yes \| The ID of the spreadsheet to request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Directions

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_DIRECTION\`

Fetches detailed directions between an origin and a destination, supporting intermediate waypoints and various travel modes. Automatically uses the modern Routes API with OAuth2 when available, falling back to legacy API with API key if provided.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mode\` \| string ("driving" \| "walking" \| "bicycling" \| "transit") \| No \| The mode of transportation for which to calculate directions. \|
\| \`avoid\` \| string \| No \| Specifies features to avoid in the generated route. Multiple values can be combined using a pipe delimiter (e.g., 'tolls\|highways'). Valid options include 'tolls', 'highways', and 'ferries'. \|
\| \`units\` \| string ("metric" \| "imperial") \| No \| The unit system for displaying distances. Defaults to 'imperial'. \|
\| \`origin\` \| string \| Yes \| The starting point for the directions. This can be a textual address (e.g., '123 Main St, Los Angeles, CA'), a place name (e.g., 'Disneyland'), or latitude/longitude coordinates (e.g., '34.0522,-118.2437'). \|
\| \`language\` \| string \| No \| The language code for returning results, e.g., 'en' for English, 'es' for Spanish. Defaults to 'en'. \|
\| \`waypoints\` \| string \| No \| A pipe-separated (\|) string of intermediate locations (addresses, place names, or coordinates) to visit between the origin and destination. For example: 'Anaheim, CA\|Long Beach, CA' or 'Hollywood Bowl\|Getty Center'. \|
\| \`destination\` \| string \| Yes \| The ending point for the directions. This can be a textual address (e.g., '456 Park Ave, New York, NY'), a place name (e.g., 'Universal Studios Hollywood'), or latitude/longitude coordinates (e.g., '40.7128,-74.0060'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get document by id

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_DOCUMENT\_BY\_ID\`

Retrieves an existing Google Document by its ID; will error if the document is not found.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier for a native Google Docs document (typically a 44-character alphanumeric string). Accepts either a document ID or a full Google Docs URL (e.g., https://docs.google.com/document/d/{DOCUMENT\_ID}/edit). When a URL is provided, the document ID will be automatically extracted. IMPORTANT: This tool only works with native Google Docs documents (mimeType application/vnd.google-apps.document), not uploaded Office files (DOCX, XLSX, etc.) stored in Google Drive. Use GOOGLEDOCS\_SEARCH\_DOCUMENTS to find available documents. \|
\| \`includeTabsContent\` \| boolean \| No \| When true, request includeTabsContent=true so the response includes document.tabs with content for all tabs. When false, Google Docs returns the legacy first-tab content fields. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Document End Index

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_DOCUMENT\_END\_INDEX\`

Retrieves the end index and paragraph structure of a Google Document or specific segment. Use this action when you need to determine valid insertion points for text operations, especially before using insertText requests. The end index represents the maximum boundary of the document body or specified segment (header, footer, footnote, or tab).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tab\_id\` \| string \| No \| The ID of the document tab to get the end index from. When omitted, the request is applied to the first tab. \|
\| \`segment\_id\` \| string \| No \| The ID of the header, footer, or footnote segment to get the end index for. Leave empty or omit to get the end index of the document body. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document to retrieve the end index from. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get document plain text

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_DOCUMENT\_PLAINTEXT\`

Retrieve a Google Doc by ID and return a best-effort plain-text rendering. Converts document structure into plain text including paragraphs, lists, and tables without requiring clients to traverse complex Docs API JSON.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tab\_ids\` \| array \| No \| Optional tab IDs to include when include\_tabs\_content=true. Nested child tabs are searched recursively. \|
\| \`document\_id\` \| string \| Yes \| The unique identifier for the Google Document. Accepts either a document ID (typically a 44-character alphanumeric string) or a full Google Docs URL. When a URL is provided, the document ID will be automatically extracted. Note: This parameter also accepts 'id' as an alias for consistency with other GOOGLEDOCS tools. \|
\| \`include\_tables\` \| boolean \| No \| Whether to include table content in the plain text output. Tables are rendered with configurable cell and row delimiters. \|
\| \`include\_footers\` \| boolean \| No \| Whether to include footer text in the plain text output. Footers are appended with a clear section separator. \|
\| \`include\_headers\` \| boolean \| No \| Whether to include header text in the plain text output. Headers are appended with a clear section separator. \|
\| \`include\_footnotes\` \| boolean \| No \| Whether to include footnote text in the plain text output. Footnotes are appended with a clear section separator. \|
\| \`table\_row\_delimiter\` \| string \| No \| The delimiter to use between table rows (default: newline character). \|
\| \`include\_tabs\_content\` \| boolean \| No \| When true, fetch the document using includeTabsContent=true query parameter to render all tabs. When false, only the main body content is rendered. \|
\| \`table\_cell\_delimiter\` \| string \| No \| The delimiter to use between table cells (default: tab character). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Draft

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_DRAFT\`

Retrieves a single Gmail draft by its ID. Use this to fetch and inspect draft content before sending via GMAIL\_SEND\_DRAFT. The format parameter controls the level of detail returned.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`format\` \| string \| No \| Format for the draft message: 'minimal' (ID/labels only), 'full' (complete data with parsed payload), 'raw' (base64url-encoded RFC 2822 format), 'metadata' (ID/labels/headers only). \|
\| \`user\_id\` \| string \| No \| The user's email address. The special value \`me\` can be used to indicate the authenticated user. \|
\| \`draft\_id\` \| string \| Yes \| The ID of the draft to retrieve. Draft IDs are typically alphanumeric strings (e.g., 'r99885592323229922'). Use GMAIL\_LIST\_DRAFTS to retrieve valid draft IDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Shared Drive

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_DRIVE\`

Tool to get a shared drive by ID. Use when you need to retrieve information about a specific shared drive. To discover drive\_ids, use GOOGLEDRIVE\_LIST\_SHARED\_DRIVES first; GOOGLEDRIVE\_GET\_ABOUT reflects overall user storage, not individual shared drive details. Permission changes may have a brief propagation delay before appearing in results.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`drive\_id\` \| string \| Yes \| The ID of the shared drive. \|
\| \`use\_domain\_admin\_access\` \| boolean \| No \| Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the shared drive belongs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get File Metadata

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_FILE\_METADATA\`

Tool to get a file's metadata by ID. Use to verify \`mimeType\`, \`parents\`, and \`trashed\` status before destructive operations (delete/move/export), or to confirm \`mimeType='application/vnd.google-apps.document'\` before calling GOOGLEDOCS\_\* tools (non-native files require GOOGLEDRIVE\_DOWNLOAD\_FILE). Only returns metadata visible to the connected account; public access requires GOOGLEDRIVE\_ADD\_FILE\_SHARING\_PREFERENCE. High-frequency calls risk \`403 rateLimitExceeded\`; apply exponential backoff.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Comma-separated list of fields to include in the response. Use this for partial responses to request only specific metadata fields. Common fields: id, name, mimeType, webViewLink, webContentLink, createdTime, modifiedTime, size, quotaBytesUsed, parents, owners, permissions. Use '\*' to return all available fields. Note: The deprecated v2 field 'alternateLink' is automatically migrated to 'webViewLink'. Example: 'id,name,mimeType,webViewLink,createdTime,modifiedTime'. Most fields (webViewLink, parents, owners, size, modifiedTime, etc.) are omitted by default — explicitly list required fields or use '\*' (increases latency). \`md5Checksum\` is null for native Google Workspace files (Docs/Sheets/Slides); use \`mimeType\` to classify items — folders use \`mimeType='application/vnd.google-apps.folder'\` and Workspace files return \`size=null\`. \`modifiedTime\` is RFC 3339 UTC format. \|
\| \`fileId\` \| string \| Yes \| The Google Drive file ID (an opaque alphanumeric string like '1a2b3c4d5e6f7g8h9i0j'), NOT a file name. If you only have a file name, use GOOGLEDRIVE\_FIND\_FILE or GOOGLEDRIVE\_LIST\_FILES to get the file ID first. \|
\| \`includeLabels\` \| string \| No \| A comma-separated list of IDs of labels to include in the labelInfo part of the response. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Defaults to true to ensure files in shared drives are accessible. \|
\| \`includePermissionsForView\` \| string \| No \| Specifies which additional view's permissions to include in the response. Only 'published' is supported. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Property (v2)

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_FILE\_PROPERTY\`

Tool to get a property by its key using Google Drive API v2. Use when you need to retrieve a specific custom property attached to a file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The ID of the file. \|
\| \`visibility\` \| string \| No \| The visibility of the property. Allowed values are PRIVATE (default) and PUBLIC. Private properties can only be retrieved using an authenticated request. \|
\| \`propertyKey\` \| string \| Yes \| The key of the property. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get File (v2 API) (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_FILE\_V2\`

DEPRECATED: Use GetFileMetadata instead. Tool to get a file's metadata or content by ID from Google Drive API v2. Use when you need file metadata with alt=json, or file content with alt=media.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format values. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`fileId\` \| string \| Yes \| The ID for the file in question. This is a required parameter and cannot be empty. \|
\| \`callback\` \| string \| No \| JSONP callback function name. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`projection\` \| string ("BASIC" \| "FULL") \| No \| Projection parameter values (deprecated). \|
\| \`revisionId\` \| string \| No \| Specifies the Revision ID that should be downloaded. Ignored unless alt=media is specified. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`includeLabels\` \| string \| No \| A comma-separated list of IDs of labels to include in the labelInfo part of the response. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|
\| \`acknowledgeAbuse\` \| boolean \| No \| Whether the user is acknowledging the risk of downloading known malware or other abusive files. \|
\| \`updateViewedDate\` \| boolean \| No \| Deprecated: Use files.update with modifiedDateBehavior=noChange, updateViewedDate=true and an empty request body. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. \|
\| \`supportsTeamDrives\` \| boolean \| No \| Deprecated: Use supportsAllDrives instead. \|
\| \`includePermissionsForView\` \| string \| No \| Specifies which additional view's permissions to include in the response. Only 'published' is supported. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Gmail filter

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_FILTER\`

Tool to retrieve a specific Gmail filter by its ID. Use when you need to inspect the criteria and actions of an existing filter.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The ID of the filter to be fetched. \|
\| \`user\_id\` \| string \| No \| The user's email address or the special value 'me' to indicate the authenticated user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Google Signals Settings

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_GOOGLE\_SIGNALS\_SETTINGS\`

Tool to retrieve Google Signals configuration settings for a GA4 property. Use when you need to check whether Google Signals is enabled and the consent status for a property.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. The resource name of the Google Signals settings to retrieve. Must be in the exact format: properties/{property\_id}/googleSignalsSettings where property\_id is a numeric identifier. IMPORTANT: Must start with 'properties/' prefix, contain no forward slashes in the property\_id, have no trailing slashes, and must end with '/googleSignalsSettings'. Valid example: 'properties/1000/googleSignalsSettings'. Invalid examples: '1000' (missing prefix), 'properties/1000' (missing suffix), 'properties/1000/googleSignalsSettings/' (trailing slash) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Key Event

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_KEY\_EVENT\`

Tool to retrieve a Key Event. Use after confirming the key event resource name. Read-only; create, update, or delete operations require the Google Analytics UI.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. Resource name of the Key Event to retrieve. Format: properties/{property}/keyEvents/{keyEvent}. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get label details

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_LABEL\`

Gets details for a specified Gmail label. Use this to retrieve label information including name, type, visibility settings, message/thread counts, and color.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The ID of the label to retrieve. Can be a system label (e.g., INBOX, SENT, DRAFT, UNREAD, STARRED, SPAM, TRASH) or a user-created label ID (e.g., Label\_1, Label\_42). \|
\| \`user\_id\` \| string \| No \| The user's email address. The special value 'me' can be used to indicate the authenticated user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Language Settings

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_LANGUAGE\_SETTINGS\`

Tool to retrieve the language settings for a Gmail user. Use when you need to determine the display language preference for the authenticated user or a specific Gmail account.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The email address of the Gmail user whose language settings are to be retrieved, or the special value 'me' to indicate the currently authenticated user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Download Photos Media Item

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_MEDIA\_ITEM\_DOWNLOAD\`

Downloads a media item from Google Photos and returns it as a file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mediaItemId\` \| string \| Yes \| ID of the media item to download \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Meet details

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_MEET\`

Retrieve details of a Google Meet space using its unique identifier. Newly created spaces may return incomplete data; retry after 1–3 seconds if needed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`space\_name\` \| string \| Yes \| The unique identifier (space ID) for the Google Meet space. Provide only the raw space ID without the 'spaces/' prefix. Example: 'mV63iV9-KxoB'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Metadata

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_METADATA\`

Tool to get metadata for dimensions, metrics, and comparisons for a GA4 property. Use to discover available fields before building a report — always derive dimension/metric apiNames from this output rather than hardcoding from GA4 UI labels, which differ. Available fields vary per property; skip validation and downstream report tools like GOOGLE\_ANALYTICS\_RUN\_REPORT return 400 INVALID\_ARGUMENT on incompatible or invalid field combinations. Response can contain hundreds of fields; filter to relevant subset before passing to downstream logic.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Resource name of the metadata to retrieve. Format: properties/{property\_id}/metadata. Use property\_id=0 to return only universal (non-custom) metadata. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Page Thumbnail v2

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_PAGE\_THUMBNAIL2\`

Tool to generate a thumbnail of the latest version of a specified page. Use when you need a preview image URL for a slide page. This request counts as an expensive read request for quota purposes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageObjectId\` \| string \| Yes \| The object ID of the page whose thumbnail to retrieve. \|
\| \`presentationId\` \| string \| Yes \| The ID of the presentation to retrieve. \|
\| \`thumbnailProperties.mimeType\` \| string \| No \| The optional mime type of the thumbnail image. Defaults to PNG if not specified. \|
\| \`thumbnailProperties.thumbnailSize\` \| string ("THUMBNAIL\_SIZE\_UNSPECIFIED" \| "LARGE" \| "MEDIUM" \| "SMALL") \| No \| The optional thumbnail image size. LARGE = 1600px, MEDIUM = 800px, SMALL = 200px. Defaults to LARGE if not specified. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Parent Reference (v2)

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_PARENT\`

Tool to get a specific parent reference for a file using Drive API v2. Use when you need to retrieve information about a specific parent folder of a file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format options. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`fileId\` \| string \| Yes \| The ID of the file. \|
\| \`callback\` \| string \| No \| JSONP callback parameter. \|
\| \`parentId\` \| string \| Yes \| The ID of the parent. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Participant Details

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_PARTICIPANT\_SESSION\`

Retrieves detailed information about a specific participant session from a Google Meet conference record. Returns session details including start time and end time for a single join/leave session. A participant session represents each unique join or leave session when a user joins a conference from a device. If a user joins multiple times from the same device, each join creates a new session. PREREQUISITE: You must first obtain the participant session resource name. Use LIST\_PARTICIPANT\_SESSIONS with a conference record ID and participant ID to get available sessions and their resource names. The 'name' parameter is REQUIRED and must be in the format: 'conferenceRecords/{conference\_record}/participants/{participant}/participantSessions/{participant\_session}'

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. Full resource name of the participant session to retrieve. Format: 'conferenceRecords/{conference\_record}/participants/{participant}/participantSessions/{participant\_session}'. You can obtain this value from the 'name' field returned by the LIST\_PARTICIPANT\_SESSIONS action. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get People

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_PEOPLE\`

Retrieves either a specific person's details (using \`resource\_name\`) or lists 'Other Contacts' (if \`other\_contacts\` is true), with \`person\_fields\` specifying the data to return. Scope is limited to the authenticated user's own contacts and 'Other Contacts' history only.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sources\` \| array \| No \| Source types to include when retrieving other contacts. READ\_SOURCE\_TYPE\_CONTACT supports basic fields (emailAddresses, metadata, names, phoneNumbers, photos). READ\_SOURCE\_TYPE\_PROFILE supports extended fields (birthdays, genders, organizations, etc.) but requires READ\_SOURCE\_TYPE\_CONTACT to also be included. Applicable only when \`other\_contacts\` is true. \|
\| \`page\_size\` \| integer \| No \| The number of 'Other Contacts' to return per page. Applicable only when \`other\_contacts\` is true. \|
\| \`page\_token\` \| string \| No \| An opaque token from a previous response to retrieve the next page of 'Other Contacts' results. Applicable only when \`other\_contacts\` is true and paginating. \|
\| \`sync\_token\` \| string \| No \| A token from a previous 'Other Contacts' list call to retrieve only changes since the last sync; leave empty for an initial full sync. Applicable only when \`other\_contacts\` is true. \|
\| \`person\_fields\` \| string \| No \| A comma-separated field mask to restrict which fields on the person (or persons) are returned. Consult the Google People API documentation for a comprehensive list of valid fields. Omitted fields are silently absent from the response — no error is raised. When \`other\_contacts\` is true, only a restricted subset is valid (\`emailAddresses\`, \`names\`, \`phoneNumbers\`, \`metadata\`); extended fields like \`organizations\` or \`birthdays\` may cause validation errors or silent omissions in that mode. \|
\| \`resource\_name\` \| string \| No \| Resource name identifying the person for whom to retrieve information (like the authenticated user or a specific contact). Used only when \`other\_contacts\` is false. Deleted or stale resource\_names may return partial records with missing \`emailAddresses\`, \`names\`, or other fields. \|
\| \`other\_contacts\` \| boolean \| No \| If true, retrieves 'Other Contacts' (people interacted with but not explicitly saved), ignoring \`resource\_name\` and enabling pagination/sync. If false, retrieves information for the single person specified by \`resource\_name\`. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Permission

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_PERMISSION\`

Gets a permission by ID. Use this tool to retrieve a specific permission for a file or shared drive. Newly created or updated permissions on shared drives may have a brief propagation delay before appearing.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. Use 'fields=\*' to return all available fields for the permission resource. \|
\| \`file\_id\` \| string \| Yes \| The ID of the file. \|
\| \`permission\_id\` \| string \| Yes \| The numeric ID of the permission. Note: The 'me' alias is NOT supported by the Google Drive permissions API. You must provide an actual numeric permission ID (e.g., '12345678901234567890'). Use the LIST\_PERMISSIONS action to get permission IDs for a file. \|
\| \`supports\_all\_drives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. \|
\| \`use\_domain\_admin\_access\` \| boolean \| No \| Issue the request as a domain administrator; if set to true, then the requester will be granted access if the file ID parameter refers to a shared drive and the requester is an administrator of the domain to which the shared drive belongs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Permission ID for Email

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_PERMISSION\_ID\_FOR\_EMAIL\`

Tool to get the permission ID for an email address using the Drive API v2. Use when you need to convert an email address to its corresponding permission ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`email\` \| string \| Yes \| The email address for which to return a permission ID \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format options. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`callback\` \| string \| No \| JSONP callback parameter. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Place Details

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_PLACE\_DETAILS\`

Retrieves comprehensive details for a place using its resource name (places/{place\_id} format). Use when you need detailed information about a specific place.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Google Place ID ONLY - an alphanumeric code (NOT a business name, address, or search query). Accepts 'places/{place\_id}' or just the place\_id. Place IDs typically start with 'ChIJ' followed by alphanumeric characters. To find a place ID from a business name, first use TEXT\_SEARCH or NEARBY\_SEARCH. \|
\| \`fieldMask\` \| string \| No \| Comma-separated list of place fields to return (no spaces allowed). Use '\*' for all fields (not recommended for performance/cost). Common fields: id, displayName, formattedAddress, location, types, rating, photos, reviews, regularOpeningHours, nationalPhoneNumber, internationalPhoneNumber, websiteUri, googleMapsUri. Note: 'emailAddress' and 'phoneNumber' are NOT valid fields - use 'nationalPhoneNumber' or 'internationalPhoneNumber' instead. \|
\| \`regionCode\` \| string \| No \| Unicode country/region code (CLDR format) for region-specific display names. Examples: 'US', 'GB', 'FR', 'JP'. This affects how place names and addresses are formatted. \|
\| \`languageCode\` \| string \| No \| Preferred language code for place details (BCP-47 format). Examples: 'en' (English), 'es' (Spanish), 'fr' (French), 'ja' (Japanese). If not specified, defaults to the language of the request location. \|
\| \`sessionToken\` \| string \| No \| URL-safe base64 string (max 36 characters) for Autocomplete session billing. Used to group this request with previous Autocomplete requests for billing purposes. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Profile

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_PROFILE\`

Retrieves Gmail profile information (email address, aggregate messagesTotal/threadsTotal, historyId) for a user. messagesTotal counts individual emails; threadsTotal counts conversations; neither is per-label — use GMAIL\_FETCH\_EMAILS with label filters for label-specific counts. The returned historyId seeds incremental sync via GMAIL\_LIST\_HISTORY; if historyIdTooOld is returned, rescan with GMAIL\_FETCH\_EMAILS before resuming. Response may be wrapped under a top-level data field; unwrap before reading fields. A successful call confirms mailbox connectivity but not full mailbox access if granted scopes are narrow. Use the returned email address to dynamically identify the authenticated account rather than hard-coding it.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The email address of the Gmail user whose profile is to be retrieved, or the special value 'me' to indicate the currently authenticated user. Prefer 'me' unless explicitly targeting another account; passing a raw email address that does not match the connected account may fail or access the wrong mailbox. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Property

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_PROPERTY\`

Tool to retrieve a single GA4 Property by its resource name. Use when you need detailed property configuration including display name, time zone, currency, and other settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. The resource name of the Property to retrieve. Must be in the exact format: properties/{property\_id} where property\_id is a numeric identifier. IMPORTANT: Must start with 'properties/' prefix, contain no forward slashes in the property\_id, have no trailing slashes, and no additional path segments. Valid example: 'properties/489591273'. Invalid examples: '489591273' (missing prefix), 'properties/489591273/' (trailing slash), 'properties/489591273/extra' (extra segments) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Property Quotas Snapshot

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_PROPERTY\_QUOTAS\_SNAPSHOT\`

Tool to retrieve all property quotas organized by category (corePropertyQuota, funnelPropertyQuota, realtimePropertyQuota) for a given GA4 property. Use when you need to check current quota usage. Snapshot data can lag real consumption by several minutes; treat reported values as approximate and avoid scheduling high-volume jobs at full apparent capacity.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`property\` \| string \| Yes \| Required. The property resource. Format: properties/{property\_id}. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get recordings by conference record ID

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_RECORDINGS\_BY\_CONFERENCE\_RECORD\_ID\`

Retrieves recordings from Google Meet for a given conference record ID. Only returns recordings if recording was enabled and permitted by the organizer's domain policies; a valid conference\_record\_id does not guarantee recordings exist. After a meeting ends, recordings may take several minutes to process — an empty result may be temporary, not permanent.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`conference\_record\_id\` \| string \| Yes \| Unique identifier for the conference record. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Recurring Audience List

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_RECURRING\_AUDIENCE\_LIST\`

Tool to get configuration metadata about a specific recurring audience list. Use when you need to understand a recurring audience list's state after it has been created or to get the resource name of the most recent audience list instance.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. The recurring audience list resource name. Format: properties/{property}/recurringAudienceLists/{recurring\_audience\_list} \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Reply

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_REPLY\`

Tool to get a specific reply to a comment on a file. Use when you need to retrieve the details of a particular reply.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The ID of the file. \|
\| \`replyId\` \| string \| Yes \| The ID of the reply. \|
\| \`commentId\` \| string \| Yes \| The ID of the comment. \|
\| \`includeDeleted\` \| boolean \| No \| Whether to return deleted replies. Deleted replies will not include their original content. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Report Task

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_REPORT\_TASK\`

Tool to get report metadata about a specific report task. Use after creating a report task to check its processing state or inspect its report definition.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. The report task resource name. Format: properties/{property}/reportTasks/{reportTask} \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Revision

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_REVISION\`

Tool to get a specific revision's metadata (name, modifiedTime, keepForever, etc.) by revision ID. Returns metadata only — not file content. Use a separate download tool to retrieve file content or restore a revision.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The ID of the file. \|
\| \`revision\_id\` \| string \| Yes \| The ID of the revision. \|
\| \`acknowledge\_abuse\` \| boolean \| No \| Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when the alt parameter is set to media and the user is the owner of the file or an organizer of the shared drive in which the file resides. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Required Google Ads Report

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_RMF\_REPORT\`

Run a prominent, bounded Google Ads report template for Customer, Campaign, Ad, Keyword, Search Term, Dynamic Search Ads Search Term, or Bidding Strategy. Official required columns are always selected; dates default to LAST\_30\_DAYS.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`report\` \| string ("CUSTOMER" \| "CAMPAIGN" \| "AD\_GROUP\_AD" \| "KEYWORD" \| "SEARCH\_TERM" \| "DYNAMIC\_SEARCH\_AD\_SEARCH\_TERM" \| "BIDDING\_STRATEGY") \| Yes \| Required Google Ads report template. Each template always includes its official RMF columns plus useful identity columns. \|
\| \`end\_date\` \| string \| No \| Optional inclusive report end date in YYYY-MM-DD format. \|
\| \`max\_rows\` \| integer \| No \| Maximum rows returned. The action queries one extra row and reports truncated=true instead of silently dropping results. \|
\| \`start\_date\` \| string \| No \| Optional inclusive report start date in YYYY-MM-DD format. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`optional\_metrics\` \| array \| No \| Additional v23 metrics compatible with the selected report, such as metrics.ctr. Required columns cannot be removed. Google validates resource compatibility. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Route

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_ROUTE\`

Calculates one or more routes between two specified locations. Uses various travel modes and preferences; addresses must be resolvable by Google Maps. Response \`duration\` is a string with 's' suffix (e.g., \`"4557s"\`); parse before displaying.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`units\` \| string ("METRIC" \| "IMPERIAL") \| No \| Unit system (e.g., 'METRIC' for kilometers, 'IMPERIAL' for miles) for displaying distances. Note: \`routes.distanceMeters\` in the response is always in meters regardless of this setting; \`units\` only affects human-readable distance formatting in other fields. \|
\| \`field\_mask\` \| string \| No \| Comma-separated list of \`Route\` object fields to include in the response (e.g., 'routes.distanceMeters,routes.duration'). If not specified, a default fieldMask is used based on travelMode: for TRANSIT mode, transit-specific fields (transitDetails, steps, etc.) are included; for other modes, basic route fields (distanceMeters, duration, polyline) are included. Fields not listed are absent from the response; explicitly include all needed fields such as \`routes.legs.steps\` and \`routes.polyline.encodedPolyline\`. \|
\| \`avoid\_tolls\` \| boolean \| No \| Attempts to avoid toll roads if true. \|
\| \`travel\_mode\` \| string ("DRIVE" \| "BICYCLE" \| "WALK" \| "TWO\_WHEELER" \| "TRANSIT") \| No \| Mode of transportation for the route. \|
\| \`avoid\_ferries\` \| boolean \| No \| Attempts to avoid ferries if true. \|
\| \`language\_code\` \| string \| No \| BCP-47 language code (e.g., 'en-US', 'es') for textual information like navigation instructions. \|
\| \`avoid\_highways\` \| boolean \| No \| Attempts to avoid highways if true. \|
\| \`origin\_address\` \| string \| Yes \| Starting point for the route calculation. Can be an address (e.g., '1600 Amphitheatre Parkway, Mountain View, CA') or coordinates as 'latitude,longitude' (e.g., '48.8566,2.3522'). \|
\| \`routing\_preference\` \| string ("ROUTING\_PREFERENCE\_UNSPECIFIED" \| "TRAFFIC\_UNAWARE" \| "TRAFFIC\_AWARE" \| "TRAFFIC\_AWARE\_OPTIMAL") \| No \| Specifies factors to consider when calculating the route. \|
\| \`destination\_address\` \| string \| Yes \| Destination point for the route calculation. Can be an address (e.g., '85 10th Ave, New York, NY') or coordinates as 'latitude,longitude' (e.g., '40.7484,-73.9967'). \|
\| \`compute\_alternative\_routes\` \| boolean \| No \| Computes and returns alternative routes if true. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get sheet names

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_SHEET\_NAMES\`

Lists all worksheet names from a specified Google Spreadsheet (which must exist), useful for discovering sheets before further operations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`exclude\_hidden\` \| boolean \| No \| When True, hidden sheets will be excluded from the results. When False (default), all sheets including hidden ones are returned. Hidden sheets are sheets that have been hidden via the 'Hide sheet' option in Google Sheets UI. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet (alphanumeric string, typically 44 characters). Extract only the ID portion from URLs - do not include leading/trailing slashes, '/edit' suffixes, query parameters, or URL fragments. From 'https://docs.google.com/spreadsheets/d/1qpyC0XzvTcKT6EISywY/edit#gid=0', use only '1qpyC0XzvTcKT6EISywY'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Spreadsheet by Data Filter

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_SPREADSHEET\_BY\_DATA\_FILTER\`

Returns the spreadsheet at the given ID, filtered by the specified data filters. Use this tool when you need to retrieve specific subsets of data from a Google Sheet based on criteria like A1 notation, developer metadata, or grid ranges. Important: This action is designed for filtered data retrieval. While it accepts empty filters and returns full metadata in that case, GOOGLESHEETS\_GET\_SPREADSHEET\_INFO is the recommended action for unfiltered spreadsheet retrieval.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`dataFilters\` \| array \| No \| The DataFilters used to select which ranges to retrieve. Supports A1 notation (e.g., 'Sheet1!A1:B2'), developer metadata lookup, or grid range filters. If empty or omitted, returns full spreadsheet metadata. Recommended: Use GOOGLESHEETS\_GET\_SPREADSHEET\_INFO for unfiltered retrieval as it is the dedicated action for that purpose. \|
\| \`spreadsheetId\` \| string \| Yes \| The ID of the spreadsheet to request. \|
\| \`includeGridData\` \| boolean \| No \| True if grid data should be returned. Ignored if a field mask is set. \|
\| \`excludeTablesInBandedRanges\` \| boolean \| No \| True if tables should be excluded in the banded ranges. False if not set. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get spreadsheet info

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_SPREADSHEET\_INFO\`

Retrieves metadata for a Google Spreadsheet using its ID. By default, returns essential information (ID, title, sheet properties) to avoid payload size issues. Use the fields parameter for comprehensive metadata or specific fields.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Optional. Field mask specifying which fields to return. Uses Google's field mask syntax (comma-separated, dot-notation for nested fields). If not specified, a default mask returning common fields (spreadsheet ID, title, sheet properties) is applied to avoid payload size issues. For full metadata, use '\*' (not recommended for large spreadsheets). When set, includeGridData is ignored. Examples: 'sheets.properties(sheetId,title)', 'properties.title,sheets.properties.sheetId'. \|
\| \`ranges\` \| array \| No \| Optional. The ranges to retrieve from the spreadsheet, specified using A1 notation (e.g., 'Sheet1!A1:D5', 'Sheet2!A1:C4'). Multiple ranges can be requested simultaneously. If not specified, metadata for the entire spreadsheet is returned without grid data. \|
\| \`spreadsheet\_id\` \| string \| No \| Required. The Google Sheets spreadsheet ID or full URL. Accepts either the ID alone (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms') or a full Google Sheets URL (e.g., 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit'). The ID will be automatically extracted from URLs. Note: Published/embedded URLs (containing '/d/e/2PACX-...') are not supported. \|
\| \`include\_grid\_data\` \| boolean \| No \| Optional. If true, grid data will be returned. This parameter is ignored if a field mask was set in the request. When false or not specified, only metadata is returned without cell values. \|
\| \`exclude\_tables\_in\_banded\_ranges\` \| boolean \| No \| Optional. If true, tables within banded ranges will be omitted from the response. Default is false when not specified. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Table Schema

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_TABLE\_SCHEMA\`

DEPRECATED: Use GOOGLESHEETS\_GET\_SHEET\_NAMES and GOOGLESHEETS\_GET\_SPREADSHEET\_INFO for sheet structure metadata, and GOOGLESHEETS\_VALUES\_GET for direct range inspection. This action is used to get the schema of a table in a Google Spreadsheet, call this action to get the schema of a table in a spreadsheet BEFORE YOU QUERY THE TABLE. Analyze table structure and infer column names, types, and constraints. Uses statistical analysis of sample data to determine the most likely data type for each column. Call this action after calling the LIST\_TABLES action to get the schema of a table in a spreadsheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sheet\_name\` \| string \| No \| Sheet/tab name if table\_name is ambiguous across multiple sheets \|
\| \`table\_name\` \| string \| Yes \| Table name from LIST\_TABLES response OR the visible Google Sheets tab name (e.g., 'Sales Data', 'Projections'). Use 'auto' to analyze the largest/most prominent table. \|
\| \`sample\_size\` \| integer \| No \| Number of rows to sample for type inference \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet. Must be a valid Google Sheets ID (typically a 44-character alphanumeric string). Do NOT use 'auto' - only 'table\_name' supports auto-detection. You can get this ID from the spreadsheet URL or from SEARCH\_SPREADSHEETS action. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Task

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_TASK\`

Retrieve a specific Google Task. REQUIRES both \`tasklist\_id\` and \`task\_id\`. Tasks cannot be retrieved by ID alone - you must always specify which task list contains the task. Use this to refresh task details before display or edits rather than relying on potentially stale results from GOOGLETASKS\_LIST\_TASKS.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`task\_id\` \| string \| Yes \| REQUIRED. Unique identifier of the Google Task to retrieve. Must be used together with tasklist\_id. \|
\| \`tasklist\_id\` \| string \| Yes \| REQUIRED. Unique identifier of the Google Tasks list containing the task. You must always provide this parameter - tasks cannot be retrieved by task\_id alone. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get task list

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_TASK\_LIST\`

Retrieves a specific task list from the user's Google Tasks if the \`tasklist\_id\` exists for the authenticated user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tasklist\_id\` \| string \| Yes \| The unique identifier of the task list to retrieve, assigned by Google Tasks when the list is created. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Team Drive (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_TEAM\_DRIVE\`

Tool to get metadata about a Team Drive by ID. Deprecated: Use the drives.get endpoint instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`teamDriveId\` \| string \| Yes \| The ID of the Team Drive \|
\| \`useDomainAdminAccess\` \| boolean \| No \| Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the Team Drive belongs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Time Zone

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_TIME\_ZONE\`

Retrieves time zone information for a specific geographic location and timestamp. Use this action when you need to determine the time zone ID, UTC offset, daylight savings offset, or localized time zone name for any point on Earth. The API considers the provided timestamp to accurately determine whether daylight savings is in effect at that moment.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`language\` \| string ("ar" \| "bg" \| "bn" \| "ca" \| "cs" \| "da" \| "de" \| "el" \| "en" \| "en-AU" \| "en-GB" \| "es" \| "eu" \| "fa" \| "fi" \| "fil" \| "fr" \| "gl" \| "gu" \| "hi" \| "hr" \| "hu" \| "id" \| "it" \| "iw" \| "ja" \| "kn" \| "ko" \| "lt" \| "lv" \| "ml" \| "mr" \| "nl" \| "no" \| "pl" \| "pt" \| "pt-BR" \| "pt-PT" \| "ro" \| "ru" \| "sk" \| "sl" \| "sr" \| "sv" \| "ta" \| "te" \| "th" \| "tl" \| "tr" \| "uk" \| "vi" \| "zh-CN" \| "zh-TW") \| No \| Supported language codes for Google Maps API. \|
\| \`location\` \| string \| Yes \| A comma-separated latitude,longitude tuple representing the location to look up. For example: '39.6034810,-119.6822510'. \|
\| \`timestamp\` \| integer \| Yes \| The desired time as seconds since midnight, January 1, 1970 UTC (Unix epoch time). The API uses this timestamp to determine whether Daylight Savings should be applied for the location's time zone. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Transcript

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_TRANSCRIPT\`

Retrieves a specific transcript by its resource name. Returns transcript details including state (STARTED, ENDED, FILE\_GENERATED), start/end times, and Google Docs destination. PREREQUISITE: Obtain the transcript resource name first by using GET\_TRANSCRIPTS\_BY\_CONFERENCE\_RECORD\_ID or construct it from known IDs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. Resource name of the transcript. Format: 'conferenceRecords/{conferenceRecord}/transcripts/{transcript}'. You can obtain this from the 'Get Transcripts by Conference Record ID' action or construct it using known conference record and transcript IDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Transcript Entry

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_TRANSCRIPT\_ENTRY\`

Fetches a single transcript entry by resource name for targeted inspection or incremental processing. Use when you have a specific transcript entry resource name and need to retrieve its details (text, speaker, timestamps, language). PREREQUISITE: Obtain the transcript entry resource name first by using LIST\_TRANSCRIPT\_ENTRIES or construct it from known IDs. The 'name' parameter is REQUIRED and must follow the format: 'conferenceRecords/{conferenceRecordId}/transcripts/{transcriptId}/entries/{entryId}'

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. Full resource name of the transcript entry. Format: 'conferenceRecords/{conferenceRecordId}/transcripts/{transcriptId}/entries/{entryId}'. You can obtain this from the LIST\_TRANSCRIPT\_ENTRIES action or construct it using known conference record, transcript, and entry IDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get transcripts by conference record ID

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_TRANSCRIPTS\_BY\_CONFERENCE\_RECORD\_ID\`

Retrieves all transcripts for a specific Google Meet conference using its conference\_record\_id. Transcripts require processing time after a meeting ends — empty results may be transient; retry after a delay before concluding no transcripts exist. Returns results only if transcription was enabled during the meeting and permitted by the organizer's domain policies; an empty list may also indicate transcription was never generated.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_size\` \| integer \| No \| Maximum number of transcripts to return. The service might return fewer than this value. If unspecified, at most 10 transcripts are returned. The maximum value is 100; values above 100 are coerced to 100. \|
\| \`page\_token\` \| string \| No \| Page token returned from a previous list call, used to retrieve the next page of results. \|
\| \`conference\_record\_id\` \| string \| Yes \| Unique identifier of the conference record. This is the ID portion from the conference record resource name (format: 'conferenceRecords/{id}'). You can obtain valid conference record IDs by using the 'List Conference Records' action or from the 'name' field in conference record responses. Example ID: 'kRyYx8b7vNDsLpR1tG\_cNjFUQBoBRhHIMoGJAJkBCQ'. Do NOT pass the full resource name - only the ID portion after 'conferenceRecords/'. A single meeting code can map to multiple conference\_record\_id values across rejoin sessions; verify the correct record using UTC time or metadata from 'List Conference Records' before calling. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Vacation Settings

\*\*Slug:\*\* \`GOOGLESUPER\_GET\_VACATION\_SETTINGS\`

Tool to retrieve vacation responder settings for a Gmail user. Use when you need to check if out-of-office auto-replies are configured and view their content.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The email address of the Gmail user whose vacation settings are to be retrieved, or the special value 'me' to indicate the currently authenticated user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete folder or file

\*\*Slug:\*\* \`GOOGLESUPER\_GOOGLE\_DRIVE\_DELETE\_FOLDER\_OR\_FILE\_ACTION\`

Tool to delete a file or folder in Google Drive. Use when you need to permanently remove a specific file or folder using its ID. Note: This action is irreversible. Deleting a folder permanently removes all nested files and subfolders.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The ID of the file or folder to delete. This is a required field. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the application supports both My Drives and shared drives. If false or unspecified, the file is attempted to be deleted from the user's My Drive. If true, the item will be deleted from shared drives as well if necessary. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Hide Shared Drive

\*\*Slug:\*\* \`GOOGLESUPER\_HIDE\_DRIVE\`

Tool to hide a shared drive from the default view. Use when you want to remove a shared drive from the user's main Google Drive interface without deleting it.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`drive\_id\` \| string \| Yes \| The ID of the shared drive. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Import message

\*\*Slug:\*\* \`GOOGLESUPER\_IMPORT\_MESSAGE\`

Tool to import a message into the user's mailbox with standard email delivery scanning and classification. Use when you need to add an existing email to a Gmail account without sending it through SMTP. This method doesn't perform SPF checks, so it might not work for some spam messages.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`raw\` \| string \| Yes \| The entire email message in RFC 2822 format, base64url-encoded. This is the raw email message to import into the mailbox. \|
\| \`deleted\` \| boolean \| No \| Mark the email as permanently deleted (not TRASH) and only visible in Google Vault to a Vault administrator. Only used for Google Workspace accounts. \|
\| \`user\_id\` \| string \| No \| The user's email address. The special value 'me' can be used to indicate the authenticated user. \|
\| \`never\_mark\_spam\` \| boolean \| No \| Ignore the Gmail spam classifier decision and never mark this email as SPAM in the mailbox. \|
\| \`internal\_date\_source\` \| string ("receivedTime" \| "dateHeader") \| No \| Source for Gmail's internal date of the message. \|
\| \`process\_for\_calendar\` \| boolean \| No \| Process calendar invites in the email and add any extracted meetings to the Google Calendar for this user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert Child Into Folder (v2)

\*\*Slug:\*\* \`GOOGLESUPER\_INSERT\_CHILD\`

Tool to insert a file into a folder using Drive API v2. Use when you need to add an existing file to a folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The ID of the child file to insert into the folder. \|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format options. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`callback\` \| string \| No \| JSONP callback parameter. \|
\| \`folderId\` \| string \| Yes \| The ID of the folder. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. \|
\| \`supportsTeamDrives\` \| boolean \| No \| Deprecated: Use supportsAllDrives instead. \|
\| \`enforceSingleParent\` \| boolean \| No \| Deprecated: Adding files to multiple folders is no longer supported. Use shortcuts instead. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert Dimension in Google Sheet

\*\*Slug:\*\* \`GOOGLESUPER\_INSERT\_DIMENSION\`

Tool to insert new rows or columns into a sheet at a specified location. Use when you need to add empty rows or columns within an existing Google Sheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`spreadsheet\_id\` \| string \| Yes \| The ID of the spreadsheet to update. \|
\| \`response\_ranges\` \| array \| No \| Limits the ranges of the spreadsheet to include in the response. \|
\| \`insert\_dimension\` \| object \| Yes \| The details for the insert dimension request. \|
\| \`response\_include\_grid\_data\` \| boolean \| No \| True if grid data should be included in the response (if includeSpreadsheetInResponse is true). \|
\| \`include\_spreadsheet\_in\_response\` \| boolean \| No \| True if the updated spreadsheet should be included in the response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert Image in Table Cell

\*\*Slug:\*\* \`GOOGLESUPER\_INSERT\_IMAGE\_IN\_TABLE\_CELL\`

Inserts an image from a given URI into a specific table cell in a Google Document. Use this action when you need to add an image to a particular cell within a table. The action identifies the target cell by table start index, row index, and column index, then inserts the image at the specified position within that cell's content.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uri\` \| string \| Yes \| The URI of the image to insert. Must be a publicly accessible direct image URL (no redirects or viewer links). Images must be less than 50MB, not exceed 25 megapixels, and be in PNG, JPEG, or GIF format (SVG not supported). The URI can be at most 2 kB in length. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document containing the table. \|
\| \`object\_size\` \| object \| No \| The size of the image. If not specified, the image is rendered at its intrinsic size. \|
\| \`cell\_content\_index\` \| integer \| No \| The zero-based offset within the table cell's content where the image should be inserted. Each table cell contains a paragraph, and this index specifies the position within that paragraph. Use 0 to insert at the beginning of the cell, or a higher value to insert after existing content. If omitted, the image is inserted at the beginning of the cell (index 0). \|
\| \`table\_cell\_location\` \| object \| Yes \| The location of the table cell where the image should be inserted. Specify the table's start index, row index, and column index to identify the target cell. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert Inline Image

\*\*Slug:\*\* \`GOOGLESUPER\_INSERT\_INLINE\_IMAGE\`

Tool to insert an image from a given URI at a specified location in a Google Document as an inline image. Use when you need to add an image to a document programmatically.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uri\` \| string \| Yes \| The URI of the image. Must be a publicly accessible direct image URL (no redirects or viewer links like Google Drive preview pages). Images must be less than 50MB, not exceed 25 megapixels, and be in PNG, JPEG, or GIF format (SVG not supported). The URI can be at most 2 kB in length. \|
\| \`location\` \| object \| Yes \| The location in the document to insert the image. The index field is required to specify the insertion point. \|
\| \`documentId\` \| string \| Yes \| The ID of the document to update. \|
\| \`objectSize\` \| object \| No \| The size of the image. If not specified, the image is rendered at its intrinsic size. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert message into mailbox

\*\*Slug:\*\* \`GOOGLESUPER\_INSERT\_MESSAGE\`

Tool to insert a message into the user's mailbox similar to IMAP APPEND. Use when you need to add an email directly to a mailbox bypassing most scanning and classification. This does not send a message.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`raw\` \| string \| Yes \| The entire email message in RFC 2822 formatted and base64url encoded string. This is the raw message content that will be inserted into the mailbox. \|
\| \`deleted\` \| boolean \| No \| Mark the email as permanently deleted (not TRASH) and only visible in Google Vault to a Vault administrator. Only used for Google Workspace accounts. \|
\| \`user\_id\` \| string \| No \| The user's email address. The special value 'me' can be used to indicate the authenticated user. \|
\| \`internalDateSource\` \| string ("receivedTime" \| "dateHeader") \| No \| Source for Gmail's internal date of the message. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert Page Break

\*\*Slug:\*\* \`GOOGLESUPER\_INSERT\_PAGE\_BREAK\`

Tool to insert a page break into a Google Document. Use when you need to start new content on a fresh page, such as at the end of a chapter or section.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`documentId\` \| string \| Yes \| The ID of the document to update. \|
\| \`insertPageBreak\` \| string \| Yes \| The details for the insertPageBreak request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert Table in Google Doc

\*\*Slug:\*\* \`GOOGLESUPER\_INSERT\_TABLE\_ACTION\`

Tool to insert a table into a Google Document. Use when you need to add a new table at a specific location or at the end of a segment (like document body, header, or footer) in a document.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rows\` \| integer \| Yes \| The number of rows in the table. \|
\| \`index\` \| integer \| No \| The zero-based index where the table will be inserted, in UTF-16 code units. IMPORTANT: The index must be strictly less than the segment's end index (you cannot insert at the exact end position using an index). To insert at the end of a segment, omit this parameter and set 'insertAtEndOfSegment' to true instead. If provided, 'location' will be used. If omitted and 'insertAtEndOfSegment' is false or omitted, 'endOfSegmentLocation' will be used for the document body. \|
\| \`tabId\` \| string \| No \| The tab that the location is in. When omitted, the request is applied to the first tab. \|
\| \`columns\` \| integer \| Yes \| The number of columns in the table. \|
\| \`segmentId\` \| string \| No \| The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body. \|
\| \`documentId\` \| string \| Yes \| The ID of the document to update. \|
\| \`insertAtEndOfSegment\` \| boolean \| No \| If true, inserts the table at the end of the segment (document body, header, or footer specified by segment\_id). This is the recommended way to append content to the end of a segment, as using an index equal to the segment's end position will fail. If false or omitted, and 'index' is not provided, it defaults to inserting at the end of the document body. If 'index' is provided, this field is ignored. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert Table Column

\*\*Slug:\*\* \`GOOGLESUPER\_INSERT\_TABLE\_COLUMN\`

Tool to insert a new column into a table in a Google Document. Use this tool when you need to add a column to an existing table at a specific location.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`requests\` \| array \| Yes \| A list of insert table column requests. Multiple requests can be sent in a single call to insert columns at different locations in the document. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document to update. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert Table Row

\*\*Slug:\*\* \`GOOGLESUPER\_INSERT\_TABLE\_ROW\`

Inserts a new row into a table in a Google Document at a specified location. Use this action when you need to add a row to an existing table, either above or below a reference cell location.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`requests\` \| array \| Yes \| A list of insert table row requests. Multiple requests can be sent in a single call to insert rows at different locations in the document. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document to update. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert Task

\*\*Slug:\*\* \`GOOGLESUPER\_INSERT\_TASK\`

Creates a new task in a given \`tasklist\_id\`, optionally as a subtask of an existing \`task\_parent\` or positioned after an existing \`task\_previous\` sibling, where both \`task\_parent\` and \`task\_previous\` must belong to the same \`tasklist\_id\` if specified. IMPORTANT: Date fields (due, completed) accept various formats like '28 Sep 2025', '11:59 PM, 22 Sep 2025', or ISO format '2025-09-21T15:30:00Z' and will automatically convert them to RFC3339 format required by the API. Not idempotent — repeated calls with identical parameters create duplicate tasks; track returned task IDs to avoid duplication. High-volume inserts may trigger 403 rateLimitExceeded or 429; apply exponential backoff.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| No \| Unique identifier for the task. Generated by Google Tasks API when creating a task. Used for updating or deleting existing tasks. \|
\| \`due\` \| string \| No \| Due date for the task (optional). NOTE: Google Tasks only stores the date portion (YYYY-MM-DD) - any time component provided will be automatically stripped before sending to the API. Google Tasks API requires dates in RFC3339 format (e.g., 2025-09-22T13:48:27Z). We automatically convert various human-readable formats to RFC3339: Accepted formats: • 2025-09-28T23:59:00Z → RFC3339/ISO-8601 format (preferred) - September 28, 2025 at 11:59 PM UTC • 28 Sep 2025 → Simple date format - Will be converted to midnight UTC on that date • 11:59 PM, 22 Sep 2025 → Time with date - Assumes UTC timezone if not specified • 1:00 PM, 21 Sep 2025 → 12-hour format with date - Converted to 13:00 UTC • UTC-5:30, 6:50 PM → With timezone offset - Converted to UTC automatically • UTC+1, 11:59 PM, 31 Dec → Timezone with date - Next occurrence of Dec 31 • 2025-09-21T15:30:00+02:00 → RFC3339 with timezone offset Note: If no timezone is specified, UTC is assumed. Dates without times default to midnight UTC. \|
\| \`etag\` \| string \| No \| ETag of the resource for concurrency control. Prevents accidental overwrites when multiple clients modify the same task. Auto-generated by the API. \|
\| \`notes\` \| string \| No \| Additional details or description for the task. Supports plain text only (no HTML/markdown). Maximum 8192 characters. Example: 'Include Q3 sales data and projections' \|
\| \`title\` \| string \| Yes \| Title/name of the task (REQUIRED). This is the main text displayed for the task. Maximum 1024 characters. Example: 'Complete quarterly report' \|
\| \`hidden\` \| boolean \| No \| Whether the task is hidden from the default view. Hidden tasks can still be accessed via API but won't show in UI. Default: false \|
\| \`status\` \| string ("needsAction" \| "completed") \| No \| Status of the task. Must be either 'needsAction' (task is pending) or 'completed' (task is done). Defaults to 'needsAction' if not provided. \|
\| \`deleted\` \| boolean \| No \| Whether the task has been deleted. Deleted tasks are marked but not immediately removed, allowing for recovery. Default: false \|
\| \`completed\` \| string \| No \| Date/time when the task was marked as completed. Only applicable when status='completed'. Unlike 'due', this field preserves the time component. Google Tasks API requires dates in RFC3339 format (e.g., 2025-09-22T13:48:27Z). We automatically convert various human-readable formats to RFC3339: Accepted formats: • 2025-09-28T23:59:00Z → RFC3339/ISO-8601 format (preferred) - September 28, 2025 at 11:59 PM UTC • 28 Sep 2025 → Simple date format - Will be converted to midnight UTC on that date • 11:59 PM, 22 Sep 2025 → Time with date - Assumes UTC timezone if not specified • 1:00 PM, 21 Sep 2025 → 12-hour format with date - Converted to 13:00 UTC • UTC-5:30, 6:50 PM → With timezone offset - Converted to UTC automatically • UTC+1, 11:59 PM, 31 Dec → Timezone with date - Next occurrence of Dec 31 • 2025-09-21T15:30:00+02:00 → RFC3339 with timezone offset Note: If no timezone is specified, UTC is assumed. Dates without times default to midnight UTC. \|
\| \`task\_parent\` \| string \| No \| Identifier of an existing task to serve as parent; if provided, creates a subtask, otherwise a top-level task in the specified list. \|
\| \`tasklist\_id\` \| string \| Yes \| Task list identifier where the new task will be created. Valid values: (1) '@default' - special identifier that references the user's default/primary task list, or (2) an actual task list ID obtained from the 'List Task Lists' action (GOOGLETASKS\_LIST\_TASK\_LISTS). Task list IDs are opaque strings generated by Google (typically base64-encoded, e.g., 'MDQ1NTEzMjc4OTM5MzM0NTY4NzE6MDow'). \|
\| \`task\_previous\` \| string \| No \| Identifier of an existing task after which the new task will be placed, at the same hierarchical level (as a sibling). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert Text into Document

\*\*Slug:\*\* \`GOOGLESUPER\_INSERT\_TEXT\_ACTION\`

Tool to insert a string of text at a specified location within a Google Document. Use when you need to add new text content to an existing document. IMPORTANT: Two ways to specify insertion location: 1. Use 'insertion\_index' to insert at a specific position (index 1 is safe for document start) 2. Use 'append\_to\_end=true' to append text to the end of the document (recommended for appending) CRITICAL CONSTRAINT: When using insertion\_index, the index MUST fall within the bounds of an EXISTING paragraph. You cannot insert text at arbitrary indices or at structural boundaries (e.g., table starts). The index must also be strictly less than the document's end index. To safely append text without index concerns, use append\_to\_end=true.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tab\_id\` \| string \| No \| The ID of the document tab to insert text into. When omitted, Google Docs applies the request to the first tab. \|
\| \`segment\_id\` \| string \| No \| The ID of the header, footer or footnote to insert text into. Leave empty or omit to insert into the document body. Works with both append\_to\_end and insertion\_index modes. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document to insert text into. \|
\| \`append\_to\_end\` \| boolean \| No \| Set to true to append text to the end of the document body. When true, the 'insertion\_index' parameter is ignored. This is the recommended way to add text at the end of a document as it avoids index boundary issues. \|
\| \`text\_to\_insert\` \| string \| Yes \| The string of text to insert. Alternatively, you can provide this as 'text'. \|
\| \`insertion\_index\` \| integer \| No \| The zero-based UTF-16 code unit index where text will be inserted. Alternatively, you can provide this as 'index'. CRITICAL CONSTRAINTS: (1) The index MUST fall within the bounds of an EXISTING paragraph - you cannot insert at arbitrary indices or at structural boundaries like table starts. (2) The index MUST be strictly less than the document's end index. Index 1 is the minimum valid index and is safe for inserting at the document start. To determine valid indices, first retrieve the document structure using GOOGLEDOCS\_GET\_DOCUMENT\_BY\_ID to identify paragraph boundaries. For safely adding text without index concerns, set 'append\_to\_end' to true instead. Either 'insertion\_index' or 'append\_to\_end' must be provided. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Insert Text in Table Cell

\*\*Slug:\*\* \`GOOGLESUPER\_INSERT\_TEXT\_IN\_TABLE\_CELL\`

Inserts text into a specific cell of a table in a Google Document by row and column position. Use this action when you need to add or update text content in a table cell at a known row and column index. To use this action, you must first retrieve the document structure using GOOGLEDOCS\_GET\_DOCUMENT\_BY\_ID to find the table's start index. Then specify the target cell by its zero-based row and column indices (e.g., row\_index=0, column\_index=0 for the top-left cell).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`text\` \| string \| Yes \| The text to insert into the table cell. \|
\| \`tabId\` \| string \| No \| The ID of the document tab containing the table. When omitted, the request is applied to the first tab. \|
\| \`row\_index\` \| integer \| Yes \| The zero-based row index of the target cell (0 for first row, 1 for second row, etc.). \|
\| \`document\_id\` \| string \| Yes \| The ID of the document containing the table. \|
\| \`column\_index\` \| integer \| Yes \| The zero-based column index of the target cell (0 for first column, 1 for second column, etc.). \|
\| \`table\_start\_index\` \| integer \| Yes \| The zero-based index where the target table starts in the document, in UTF-16 code units. To find this index, use GOOGLEDOCS\_GET\_DOCUMENT\_BY\_ID to retrieve the document structure and locate the table's startIndex. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Accessible Customers

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_ACCESSIBLE\_CUSTOMERS\`

List Google Ads customer resource names directly accessible to the authenticated OAuth user. Google determines the complete result from the OAuth credentials and ignores customer\_id and login-customer-id; this action does not filter the response. For MCC child account names, status, and direct hierarchy, use List Sub Accounts.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`customer\_id\` \| string \| No \| Deprecated compatibility parameter. Google ignores this value and returns customer resource names directly accessible with the current OAuth credentials; it does not filter by this customer ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Access Proposals

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_ACCESS\_PROPOSALS\`

Tool to list pending access proposals on a file. Use when you need to retrieve access proposals for a specific file. Note: Only approvers can list access proposals; non-approvers will receive a 403 error.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The ID of the file to list access proposals for \|
\| \`pageSize\` \| integer \| No \| The number of results per page \|
\| \`pageToken\` \| string \| No \| The continuation token on the list of access requests \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Accounts (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_ACCOUNTS\`

DEPRECATED: Use ListAccountsV1Beta instead. Tool to list all Accounts accessible by the caller. Use when you need to enumerate all Google Analytics accounts your credentials can access. Empty or partial results may indicate a permissions issue rather than no resources existing. Returned resource names follow the format accounts/{account\_id}; use these in subsequent calls.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of accounts to return. Must be ≥1. \|
\| \`pageToken\` \| string \| No \| Optional. Token for retrieving the next page of results. \|
\| \`showDeleted\` \| boolean \| No \| Optional. Whether to include soft-deleted (trashed) Accounts. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Account Summaries

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_ACCOUNT\_SUMMARIES\`

Tool to retrieve summaries of all Google Analytics accounts accessible by the caller. Use when you need a high-level overview of accounts and their properties without fetching full account details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageSize\` \| integer \| No \| Maximum number of account summaries to return. The service may return fewer than this value. If unspecified, at most 50 resources will be returned. Maximum value is 200; higher values will be coerced to the maximum. \|
\| \`pageToken\` \| string \| No \| Page token received from a previous ListAccountSummaries call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to ListAccountSummaries must match the call that provided the page token. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Accounts (v1beta)

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_ACCOUNTS\_V1\_BETA\`

Tool to list all Google Analytics accounts accessible by the caller using v1beta API. Use when you need to enumerate accounts. Note that these accounts might not have GA properties yet. Soft-deleted accounts are excluded by default.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageSize\` \| integer \| No \| The maximum number of resources to return. The service may return fewer than this value, even if there are additional pages. If unspecified, at most 50 resources will be returned. The maximum value is 200; higher values will be coerced to the maximum. \|
\| \`pageToken\` \| string \| No \| A page token, received from a previous \`ListAccounts\` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to \`ListAccounts\` must match the call that provided the page token. \|
\| \`showDeleted\` \| boolean \| No \| Whether to include soft-deleted (ie: 'trashed') Accounts in the results. Accounts can be inspected to determine whether they are deleted or not. Defaults to false (soft-deleted accounts are excluded). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List AdSense Links

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_ADSENSE\_LINKS\`

Tool to list all AdSenseLinks on a property. Use when you need to fetch all AdSense links for a given Google Analytics property.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. Resource name of the property. Format: properties/{propertyId} (e.g., properties/1234). \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of results to return. Must be between 1 and 200. Defaults to 50. \|
\| \`pageToken\` \| string \| No \| Optional. Token for retrieving the next page of results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Albums

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_ALBUMS\`

Lists all albums shown to a user in the Albums tab of Google Photos.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageSize\` \| integer \| No \| Maximum number of albums to return. Default 20, maximum 50. \|
\| \`pageToken\` \| string \| No \| Continuation token for getting the next page of results \|
\| \`excludeNonAppCreatedData\` \| boolean \| No \| If true, excludes media items not created by this app \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List All Tasks Across All Lists

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_ALL\_TASKS\`

Tool to list all tasks across all of the user's task lists with optional filters. Use when the agent needs to see all tasks without knowing which list to query first. Each returned task is annotated with its tasklist\_id and tasklist\_title for context.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`dueMax\` \| string \| No \| Only include tasks due on or before this date. Google Tasks API requires dates in RFC3339 format (e.g., 2025-09-22T13:48:27Z). We automatically convert various human-readable formats to RFC3339: Accepted formats: • 2025-09-28T23:59:00Z → RFC3339/ISO-8601 format (preferred) - September 28, 2025 at 11:59 PM UTC • 28 Sep 2025 → Simple date format - Will be converted to midnight UTC on that date • 11:59 PM, 22 Sep 2025 → Time with date - Assumes UTC timezone if not specified • 1:00 PM, 21 Sep 2025 → 12-hour format with date - Converted to 13:00 UTC • UTC-5:30, 6:50 PM → With timezone offset - Converted to UTC automatically • UTC+1, 11:59 PM, 31 Dec → Timezone with date - Next occurrence of Dec 31 • 2025-09-21T15:30:00+02:00 → RFC3339 with timezone offset Note: If no timezone is specified, UTC is assumed. Dates without times default to midnight UTC. \|
\| \`dueMin\` \| string \| No \| Only include tasks due on or after this date. Google Tasks API requires dates in RFC3339 format (e.g., 2025-09-22T13:48:27Z). We automatically convert various human-readable formats to RFC3339: Accepted formats: • 2025-09-28T23:59:00Z → RFC3339/ISO-8601 format (preferred) - September 28, 2025 at 11:59 PM UTC • 28 Sep 2025 → Simple date format - Will be converted to midnight UTC on that date • 11:59 PM, 22 Sep 2025 → Time with date - Assumes UTC timezone if not specified • 1:00 PM, 21 Sep 2025 → 12-hour format with date - Converted to 13:00 UTC • UTC-5:30, 6:50 PM → With timezone offset - Converted to UTC automatically • UTC+1, 11:59 PM, 31 Dec → Timezone with date - Next occurrence of Dec 31 • 2025-09-21T15:30:00+02:00 → RFC3339 with timezone offset Note: If no timezone is specified, UTC is assumed. Dates without times default to midnight UTC. \|
\| \`showHidden\` \| boolean \| No \| Include hidden tasks in results. Defaults to false. \|
\| \`updatedMin\` \| string \| No \| Only include tasks updated on or after this date. Google Tasks API requires dates in RFC3339 format (e.g., 2025-09-22T13:48:27Z). We automatically convert various human-readable formats to RFC3339: Accepted formats: • 2025-09-28T23:59:00Z → RFC3339/ISO-8601 format (preferred) - September 28, 2025 at 11:59 PM UTC • 28 Sep 2025 → Simple date format - Will be converted to midnight UTC on that date • 11:59 PM, 22 Sep 2025 → Time with date - Assumes UTC timezone if not specified • 1:00 PM, 21 Sep 2025 → 12-hour format with date - Converted to 13:00 UTC • UTC-5:30, 6:50 PM → With timezone offset - Converted to UTC automatically • UTC+1, 11:59 PM, 31 Dec → Timezone with date - Next occurrence of Dec 31 • 2025-09-21T15:30:00+02:00 → RFC3339 with timezone offset Note: If no timezone is specified, UTC is assumed. Dates without times default to midnight UTC. \|
\| \`showDeleted\` \| boolean \| No \| Include deleted tasks in results. Defaults to false. \|
\| \`completedMax\` \| string \| No \| Only include tasks completed on or before this date. Google Tasks API requires dates in RFC3339 format (e.g., 2025-09-22T13:48:27Z). We automatically convert various human-readable formats to RFC3339: Accepted formats: • 2025-09-28T23:59:00Z → RFC3339/ISO-8601 format (preferred) - September 28, 2025 at 11:59 PM UTC • 28 Sep 2025 → Simple date format - Will be converted to midnight UTC on that date • 11:59 PM, 22 Sep 2025 → Time with date - Assumes UTC timezone if not specified • 1:00 PM, 21 Sep 2025 → 12-hour format with date - Converted to 13:00 UTC • UTC-5:30, 6:50 PM → With timezone offset - Converted to UTC automatically • UTC+1, 11:59 PM, 31 Dec → Timezone with date - Next occurrence of Dec 31 • 2025-09-21T15:30:00+02:00 → RFC3339 with timezone offset Note: If no timezone is specified, UTC is assumed. Dates without times default to midnight UTC. \|
\| \`completedMin\` \| string \| No \| Only include tasks completed on or after this date. Google Tasks API requires dates in RFC3339 format (e.g., 2025-09-22T13:48:27Z). We automatically convert various human-readable formats to RFC3339: Accepted formats: • 2025-09-28T23:59:00Z → RFC3339/ISO-8601 format (preferred) - September 28, 2025 at 11:59 PM UTC • 28 Sep 2025 → Simple date format - Will be converted to midnight UTC on that date • 11:59 PM, 22 Sep 2025 → Time with date - Assumes UTC timezone if not specified • 1:00 PM, 21 Sep 2025 → 12-hour format with date - Converted to 13:00 UTC • UTC-5:30, 6:50 PM → With timezone offset - Converted to UTC automatically • UTC+1, 11:59 PM, 31 Dec → Timezone with date - Next occurrence of Dec 31 • 2025-09-21T15:30:00+02:00 → RFC3339 with timezone offset Note: If no timezone is specified, UTC is assumed. Dates without times default to midnight UTC. \|
\| \`showAssigned\` \| boolean \| No \| Include tasks assigned to the current user in results. Defaults to false. \|
\| \`showCompleted\` \| boolean \| No \| Include completed tasks in results. Defaults to true. \|
\| \`max\_tasks\_total\` \| integer \| No \| Hard limit on total number of tasks returned across all lists to prevent large payloads. Defaults to 1000. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Approvals

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_APPROVALS\`

Tool to list approvals on a file for workflow-based access control. Use when you need to retrieve all approvals associated with a specific file in Google Drive.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The ID of the file to list approvals for \|
\| \`pageSize\` \| integer \| No \| The maximum number of approvals to return per page \|
\| \`pageToken\` \| string \| No \| A pagination token returned as 'nextPageToken' from a previous list approvals response. Must be an exact, unmodified token from a prior API call - do not construct, encode, or guess token values. Only provide this parameter when paginating through results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Audience Exports

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_AUDIENCE\_EXPORTS\`

Tool to list all audience exports for a property. Use when you need to find and reuse existing audience exports rather than creating new ones.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. Property identifier in format 'properties/{propertyId}'. Example: 'properties/489591273' \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of audience exports to return. Default: 200, Maximum: 1000 \|
\| \`pageToken\` \| string \| No \| Optional. Token from a previous response for pagination to retrieve the next page of results \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Audience Lists

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_AUDIENCE\_LISTS\`

Tool to list all audience lists for a specified property to help find and reuse existing lists. Use when you need to retrieve a property's configured audience lists after confirming the property ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. Resource name of the parent property. Format: properties/{property\_id} \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of audience lists to return. Defaults to 200; maximum is 1000. \|
\| \`pageToken\` \| string \| No \| Optional. Token for retrieving the next page of results. All other parameters must match original request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Audiences

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_AUDIENCES\`

Tool to list Audiences on a property. Use when you need to retrieve audience configurations for a Google Analytics property. Audiences created before 2020 may not be supported.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The property for which to list Audiences. Format: properties/{propertyId} Scoped to a single property per call; invoke separately for each property to list audiences across multiple GA4 properties. \|
\| \`pageSize\` \| integer \| No \| Optional. The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous ListAudiences call. Provide this to retrieve the subsequent page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List BigQuery Links

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_BIGQUERY\_LINKS\`

Tool to list BigQuery Links on a property. Use when you need to retrieve BigQuery link resources associated with a Google Analytics property. Results support pagination for large datasets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The name of the property to list BigQuery links under. Format: properties/{property\_id} (e.g., properties/1234). \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of resources to return. The service may return fewer than this value. If unspecified, at most 50 resources will be returned. The maximum value is 200; higher values will be coerced to the maximum. \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous ListBigQueryLinks call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to ListBigQueryLinks must match the call that provided the page token. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Buildings

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_BUILDINGS\`

Lists all buildings for a Google Workspace customer account with full details including addresses, coordinates, and floor names. Use this action when you need to retrieve the complete list of physical building locations configured in Google Workspace Calendar resources. This is useful for workspace administrators managing conference room and resource scheduling across multiple office buildings. Requires Google Workspace administrator privileges with Directory API access.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`customer\` \| string \| No \| The unique ID for the customer's Google Workspace account. Use 'my\_customer' alias to represent your account's customer ID. As an account administrator, this alias represents your account's customer ID. \|
\| \`pageToken\` \| string \| No \| Token to specify the next page in the list. Obtained from nextPageToken in a previous response. Omit for the first page. \|
\| \`maxResults\` \| integer \| No \| Maximum number of buildings to return per page. Defaults to 25 for optimal performance. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Calculated Metrics

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_CALCULATED\_METRICS\`

List Calculated Metrics

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. Property identifier in format 'properties/{propertyId}'. Example: 'properties/1234' \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of results to return per request. Default: 50, Maximum: 200 \|
\| \`pageToken\` \| string \| No \| Optional. Token from a previous response for pagination to retrieve the next page of results \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Calendar Resources

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_CALENDAR\_RESOURCES\`

Retrieves calendar resources (such as conference rooms) from a Google Workspace domain using the Admin SDK Directory API. Use this action when you need to list available meeting rooms, conference spaces, or other bookable calendar resources in an organization. The action supports filtering by resource category, capacity, building location, and other criteria. IMPORTANT: This requires Admin SDK Directory API access and appropriate admin permissions - it is NOT available for personal Gmail accounts, only Google Workspace domains.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| No \| Search query to filter calendar resources. Each clause is 'field operator value'. Supported operators: '=' (exact match), '!=' (mismatch), ':' (prefix/HAS match — for prefix match, follow the value with '\*'). Supported logical operators: AND, NOT (in that order of precedence). IMPORTANT: Numeric comparison operators (>, <, >=, <=) are NOT supported by the Google Admin Directory API for this endpoint and will cause a 400 Bad Request — 'capacity' can only be filtered by exact equality (e.g., 'capacity=10'). Supported fields: generatedResourceName, name, buildingId, floor\_name, capacity, featureInstances.feature.name, resourceEmail, resourceCategory. \|
\| \`orderBy\` \| string \| No \| Specifies sorting order for results. Use field names like 'resourceId', 'resourceName', 'capacity', 'buildingId', 'floorName' optionally followed by ' desc' for descending order. Multiple fields can be separated by commas (e.g., 'buildingId, capacity desc'). \|
\| \`customer\` \| string \| No \| The unique ID for the customer's Google Workspace account. Use 'my\_customer' as an alias for the account's customer ID. \|
\| \`pageToken\` \| string \| No \| Token for retrieving subsequent pages in paginated results. Use the nextPageToken from a previous response. \|
\| \`maxResults\` \| integer \| No \| Maximum number of results to return per page. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Google Calendars

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_CALENDARS\`

Retrieves calendars from the user's Google Calendar list, with options for pagination and filtering. Loop through all pages using nextPageToken until absent to avoid missing calendars. Use the primary flag and accessRole field from the response to identify calendars — display names are not valid calendar\_id values. Read access (listing) does not imply write OAuth scopes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_token\` \| string \| No \| Token for the page of results to return, from a previous response. \|
\| \`sync\_token\` \| string \| No \| Sync token from a previous list request to get only changed entries; showDeleted, showHidden, and pageToken are ignored if provided. Also ignores minAccessRole. An HTTP 410 Gone response means the token has expired; perform a full resync by omitting sync\_token. \|
\| \`max\_results\` \| integer \| No \| Maximum number of calendars to return per page. Max 250. \|
\| \`show\_hidden\` \| boolean \| No \| Include calendars not typically shown in the UI. \|
\| \`show\_deleted\` \| boolean \| No \| Include deleted calendars in the result. \|
\| \`min\_access\_role\` \| string \| No \| Minimum access role for calendars returned. Valid values are 'freeBusyReader', 'owner', 'reader', 'writer'. freeBusyReader calendars expose only free/busy slots — no event details and writes fail with 403. Omit this filter to include read-only calendars. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Changes

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_CHANGES\`

Tool to list the changes for a user or shared drive. Use when a full incremental change feed is needed (for simple recent-file lookups, prefer GOOGLEDRIVE\_FIND\_FILE instead). Tracks modifications such as creations, deletions, or permission changes. The pageToken is optional - if not provided, the current start page token will be automatically fetched; an empty result is valid if no recent activity has occurred. Example usage: \`\`\`json { "pageToken": "22633", "pageSize": 100, "includeRemoved": true } \`\`\` Returns changes with timestamps, file IDs, and modification details. Paginate by following \`nextPageToken\` until it is absent — stopping early will silently omit changes. Save \`newStartPageToken\` to monitor future changes efficiently.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`spaces\` \| string \| No \| A comma-separated list of spaces to query within the corpora. Supported values are 'drive' and 'appDataFolder'. \|
\| \`driveId\` \| string \| No \| The shared drive from which changes will be returned. If specified the change IDs will be reflective of the shared drive; use the combined drive ID and change ID as an identifier. When driveId is provided, supportsAllDrives is automatically set to true. \|
\| \`pageSize\` \| integer \| No \| The maximum number of changes to return per page. \|
\| \`pageToken\` \| string \| No \| The token for continuing a previous list request on the next page. Must be a valid token from a previous LIST\_CHANGES response's 'nextPageToken' field or from the get\_changes\_start\_page\_token action. If not provided, the current start page token will be automatically fetched and used. Tokens can become stale — always use a fresh token from GOOGLEDRIVE\_GET\_CHANGES\_START\_PAGE\_TOKEN or the most recent prior response to avoid missed or duplicate changes. Paginate until nextPageToken is absent; stopping early silently omits changes. \|
\| \`includeLabels\` \| string \| No \| A comma-separated list of IDs of labels to include in the \`labelInfo\` part of the response. \|
\| \`includeRemoved\` \| boolean \| No \| Whether to include changes indicating that items have been removed from the list of changes, for example by deletion or loss of access. \|
\| \`restrictToMyDrive\` \| boolean \| No \| Whether to restrict the results to changes inside the My Drive hierarchy. This omits changes to files such as those in the Application Data folder or shared files which have not been added to My Drive. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Must be true when driveId is specified (will be automatically set to true when driveId is provided). \|
\| \`includeCorpusRemovals\` \| boolean \| No \| Whether changes should include the file resource if the file is still accessible by the user at the time of the request, even when a file was removed from the list of changes and there will be no further change entries for this file. Note: When set to true, includeRemoved must also be true (will be automatically set). \|
\| \`includeItemsFromAllDrives\` \| boolean \| No \| Whether both My Drive and shared drive items should be included in results. Must be true when driveId is specified (will be automatically set to true when driveId is provided). \|
\| \`includePermissionsForView\` \| string \| No \| Specifies which additional view's permissions to include in the response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Channel Groups

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_CHANNEL\_GROUPS\`

Tool to list ChannelGroups on a property. Use when you need to retrieve channel groups that categorize traffic sources in Analytics reports.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The property for which to list ChannelGroups. Format: properties/{property\_id} \|
\| \`pageSize\` \| integer \| No \| Optional. The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous ListChannelGroups call. Provide this to retrieve the subsequent page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Charts in Google Sheets

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_CHARTS\`

Lists all charts in a Google Sheets spreadsheet across all sheets, returning chart\_id, sheet metadata, chart type, title, and position. Use this action when you need to discover what charts exist in a spreadsheet, retrieve chart IDs for update or delete operations, or inspect chart configurations. The default field mask in GOOGLESHEETS\_GET\_SPREADSHEET\_INFO omits chart data, making this dedicated action necessary for chart discovery.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`chart\_id\` \| integer \| No \| Optional. Filter to a specific chart by its numeric chart ID. When provided, returns only the matching chart if it exists in the spreadsheet. \|
\| \`sheet\_id\` \| integer \| No \| Optional. Filter results to a single sheet's charts by providing the numeric sheet ID (not the sheet name). When omitted, returns charts from all sheets in the spreadsheet. \|
\| \`include\_spec\` \| boolean \| No \| When true, include the full ChartSpec dictionary for each chart (contains all chart configuration details including series, axes, colors, etc.). When false (default), return only a compact summary with chart\_id, type, title, and position. Set to false to keep responses small. \|
\| \`spreadsheet\_id\` \| string \| Yes \| Required. The Google Sheets spreadsheet ID or full URL. Accepts either the ID alone (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms') or a full Google Sheets URL (e.g., 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit'). The ID will be automatically extracted from URLs. Note: Published/embedded URLs (containing '/d/e/2PACX-...') are not supported. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Folder Children (v2)

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_CHILDREN\_V2\`

Tool to list a folder's children using Google Drive API v2. Use when you need to retrieve all files and folders within a specific folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`q\` \| string \| No \| Query string for searching children. \|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response enum. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format enum. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. This endpoint returns ChildReference objects, NOT full File objects. Valid ChildReference fields are: 'id' (child ID), 'selfLink' (link to this reference), 'kind' (resource type), 'childLink' (link to the child). File-level fields like 'title', 'modifiedDate', 'fileSize', 'alternateLink', 'mimeType' are NOT valid. Example: 'items(id,childLink),nextPageToken' \|
\| \`orderBy\` \| string \| No \| A comma-separated list of sort keys. Valid keys are 'createdDate', 'folder', 'lastViewedByMeDate', 'modifiedByMeDate', 'modifiedDate', 'quotaBytesUsed', 'recency', 'sharedWithMeDate', 'starred', and 'title'. Each key sorts ascending by default, but may be reversed with the 'desc' modifier. Example usage: ?orderBy=folder,modifiedDate desc,title. \|
\| \`callback\` \| string \| No \| JSONP callback parameter. \|
\| \`folderId\` \| string \| Yes \| The ID of the folder. \|
\| \`pageToken\` \| string \| No \| Page token for children. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`maxResults\` \| integer \| No \| Maximum number of children to return. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Comments

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_COMMENTS\`

Tool to list all comments for a file in Google Drive. Results are paginated; iterate using nextPageToken until absent to retrieve all comments. Filtering by author, content, or other criteria must be done client-side. Use commentId, createdTime, and author from results to uniquely identify comments before acting on them.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| A comma-separated list of fields to include in the response. Use \`\*\` to include all fields. Prefer selective field masks (e.g., 'comments(id,content,author)') over '\*' to reduce payload size and latency. \|
\| \`fileId\` \| string \| Yes \| The ID of the file. Equivalent to the Google Docs document\_id; pass it here under the fileId parameter name. \|
\| \`pageSize\` \| integer \| No \| The maximum number of comments to return per page. \|
\| \`pageToken\` \| string \| No \| The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response. Comments may be added or modified during pagination on active files; use startModifiedTime to bound the window if consistency is required. \|
\| \`includeDeleted\` \| boolean \| No \| Whether to include deleted comments. Deleted comments will not include their original content. \|
\| \`startModifiedTime\` \| string \| No \| The minimum value of 'modifiedTime' for the result comments (RFC 3339 date-time). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Conference Records

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_CONFERENCE\_RECORDS\`

Tool to list conference records. Use when you need to retrieve a list of past conferences, optionally filtering them by criteria like meeting code, space name, or time range.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`filter\` \| string \| No \| Optional. User specified filtering condition in EBNF format. Filterable fields: \`space.meeting\_code\`, \`space.name\`, \`start\_time\`, \`end\_time\`. Examples: \`space.name = "spaces/NAME"\`, \`space.meeting\_code = "abc-mnop-xyz"\`, \`start\_time>="2024-01-01T00:00:00.000Z" AND start\_time<="2024-01-02T00:00:00.000Z"\`, \`end\_time IS NULL\` Time values must be RFC3339 UTC (e.g., \`2024-01-01T00:00:00.000Z\`); non-UTC timezones or reversed bounds silently omit records. Unsupported fields or malformed expressions silently return empty or over-narrowed results. A single \`space.meeting\_code\` may match multiple records if the code was reused; combine with time filters to isolate the target record. \|
\| \`page\_size\` \| integer \| No \| Maximum number of conference records to return. The service might return fewer than this value. If unspecified, at most 25 conference records are returned. The maximum value is 100; values above 100 are coerced to 100. \|
\| \`page\_token\` \| string \| No \| Page token returned from previous List Call. Loop using the returned \`page\_token\` until no token is returned to retrieve the complete result set. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Conversion Events

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_CONVERSION\_EVENTS\`

Tool to list conversion events on a property. Use when you need to retrieve conversion events configured for a given property.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The resource name of the parent property. Format: 'properties/{propertyId}' \|
\| \`pageSize\` \| integer \| No \| Optional. The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous ListConversionEvents call. Provide this to retrieve the subsequent page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List CSE identities

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_CSE\_IDENTITIES\`

Tool to list client-side encrypted identities for an authenticated user. Use when you need to retrieve CSE identity configurations including key pair associations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The requester's primary email address. Use 'me' to indicate the authenticated user. \|
\| \`page\_size\` \| integer \| No \| The number of identities to return. If not provided, the page size will default to 20 entries. \|
\| \`page\_token\` \| string \| No \| Pagination token indicating which page of identities to return. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List CSE key pairs

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_CSE\_KEYPAIRS\`

Tool to list client-side encryption key pairs for an authenticated user. Use when you need to retrieve CSE keypair configurations including public keys and enablement states. Supports pagination for large result sets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The requester's primary email address. Use 'me' to indicate the authenticated user. \|
\| \`page\_size\` \| integer \| No \| The number of key pairs to return per page. If not provided, the page size will default to 20 entries. \|
\| \`page\_token\` \| string \| No \| Pagination token indicating which page of key pairs to return. Omit to return the first page. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Custom Dimensions

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_CUSTOM\_DIMENSIONS\`

List Custom Dimensions

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The property for which to list CustomDimensions. Format: properties/{property\_id} \|
\| \`pageSize\` \| integer \| No \| Optional. The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous ListCustomDimensions call. Provide this to retrieve the subsequent page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Custom Metrics

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_CUSTOM\_METRICS\`

Tool to list CustomMetrics on a property. Use when you need to retrieve all custom metrics configured for a given property.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. Property identifier in format 'properties/{propertyId}'. Example: 'properties/1234' \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of resources to return. If unspecified, at most 50 resources will be returned. Maximum value is 200 \|
\| \`pageToken\` \| string \| No \| Optional. Token from a previous ListCustomMetrics call for pagination to retrieve the next page of results \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List DataStreams

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_DATA\_STREAMS\`

Tool to list DataStreams on a property. Use when you need to retrieve data stream configurations for a Google Analytics property.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The Google Analytics property identifier. Must be in format 'properties/NUMERIC\_ID' where NUMERIC\_ID is your actual property ID (e.g., 'properties/489591273'). Do NOT use placeholder syntax like 'properties/{propertyId}' - replace the placeholder with a real numeric property ID. \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous ListDataStreams call. Provide this to retrieve the subsequent page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Drafts

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_DRAFTS\`

Retrieves a paginated list of email drafts from a user's Gmail account. Use verbose=true to get full draft details including subject, body, sender, and timestamp. Draft ordering is non-guaranteed; iterate using page\_token until it is absent to retrieve all drafts. Newly created drafts may not appear immediately. Rapid calls may trigger 403 userRateLimitExceeded or 429 errors; apply exponential backoff (1s, 2s, 4s) before retrying.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| User's mailbox ID; use 'me' for the authenticated user. \|
\| \`verbose\` \| boolean \| No \| If true, fetches full draft details including subject, sender, recipient, body, and timestamp. If false, returns only draft IDs (faster). Increases response payload size; tune max\_results accordingly. Use verbose=true before destructive operations to confirm draft identity by subject, recipient, and timestamp. \|
\| \`page\_token\` \| string \| No \| Token from a previous response to retrieve a specific page of drafts. Ordering is non-guaranteed; continue paginating until page\_token is absent in the response to retrieve all drafts. \|
\| \`max\_results\` \| integer \| No \| Maximum number of drafts to return per page. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Display & Video 360 Advertiser Links

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_DV360\_AD\_LINKS\`

Tool to list Display & Video 360 advertiser links on a property. Use when you need to retrieve DisplayVideo360AdvertiserLink resources associated with a Google Analytics property. Results support pagination for large datasets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The name of the property to list DisplayVideo360AdvertiserLinks under. Format: properties/{property\_id} (e.g., properties/1234). \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of resources to return. The service may return fewer than this value. If unspecified, at most 50 resources will be returned. The maximum value is 200; higher values will be coerced to the maximum. \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous ListDisplayVideo360AdvertiserLinks call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided must match the call that provided the page token. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List DisplayVideo360 Advertiser Link Proposals

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_DV360\_LINK\_PROPOSALS\`

Tool to list DisplayVideo360AdvertiserLinkProposals on a property. Use when you need to retrieve Display & Video 360 advertiser link proposals associated with a Google Analytics property. Results support pagination for large datasets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The name of the property to list DisplayVideo360AdvertiserLinkProposals under. Format: properties/{property\_id} (e.g., properties/489591273). \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200; higher values will be coerced to the maximum. \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous ListDisplayVideo360AdvertiserLinkProposals call. Provide this to retrieve the subsequent page. When paginating, all other parameters must match the call that provided the page token. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Event Create Rules

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_EVENT\_CREATE\_RULES\`

Tool to list EventCreateRules configured on a web data stream. Use when you need to retrieve event create rules for a specific GA4 property data stream.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. Resource name of the parent data stream. Format: properties/{propertyId}/dataStreams/{dataStreamId}. \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of event create rules to return. Default is 50, maximum allowed is 200. \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous list call. Provide this to retrieve the next page of results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Expanded Data Sets

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_EXPANDED\_DATA\_SETS\`

Tool to list ExpandedDataSets on a property. Use when you need to retrieve expanded data set configurations for a Google Analytics 360 property.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The name of the property to list ExpandedDataSets for. Format: properties/{property\_id} \|
\| \`pageSize\` \| integer \| No \| Optional. The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous ListExpandedDataSets call. Provide this to retrieve the subsequent page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List File Labels

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_FILE\_LABELS\`

Tool to list the labels already applied to a file in Google Drive. An empty labels array is a valid response indicating no labels are applied, not an error. This tool shows only applied labels; label\_id and field\_id values required by other Drive label tools must be obtained from admin configuration.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The ID of the file. \|
\| \`page\_token\` \| string \| No \| Token to retrieve a specific page of results. \|
\| \`max\_results\` \| integer \| No \| The maximum number of labels to return per page. Default is 100. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Properties (v2 API)

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_FILE\_PROPERTIES\`

Tool to list a file's properties in Google Drive API v2. Use when you need to retrieve custom properties (key-value pairs) attached to a file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format values. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`fileId\` \| string \| Yes \| The ID of the file. This is a required parameter and cannot be empty. \|
\| \`callback\` \| string \| No \| JSONP callback function name. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Files and Folders (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_FILES\`

DEPRECATED: Use GOOGLEDRIVE\_FIND\_FILE instead. Tool to list a user's files and folders in Google Drive. Use this to search or browse for files and folders based on various criteria.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`q\` \| string \| No \| A query string for filtering the file results. Supports operators 'and', 'or', 'not'. VALID query terms: 'name' (contains, =, !=), 'fullText' (contains), 'mimeType' (contains, =, !=), 'modifiedTime' (<=, <, =, !=, >, >=), 'viewedByMeTime' (<=, <, =, !=, >, >=), 'trashed' (=, !=), 'starred' (=, !=), 'parents' (in), 'owners' (in), 'writers' (in), 'readers' (in), 'sharedWithMe' (=, !=), 'createdTime' (<=, <, =, !=, >, >=), 'properties' (has), 'appProperties' (has), 'visibility' (=, !=), 'shortcutDetails.targetId' (=, !=). IMPORTANT: 'id' is NOT a valid query term - you cannot search by file ID using this parameter. To get a specific file by ID, use the 'Get File Metadata' action instead. Example: "name contains 'important' and mimeType = 'application/vnd.google-apps.folder'". \|
\| \`fields\` \| string \| No \| Selector specifying which file fields to include in the response. Provide a comma-separated list of file field names (e.g., 'id,name,mimeType,webViewLink'). The action will automatically format this into the proper API format 'files(field1,field2,...)'. Common file fields include: id, name, description, mimeType, webViewLink, webContentLink, size, createdTime, modifiedTime, parents, owners, permissions. To also include the pagination token, add 'nextPageToken' to the list. NOTE: Google Drive API v2 field names are automatically converted to v3 equivalents (e.g., alternateLink→webViewLink, downloadUrl→webContentLink, title→name, createdDate→createdTime, modifiedDate→modifiedTime). \|
\| \`spaces\` \| string \| No \| A comma-separated list of spaces to query within the corpora. Supported values are 'drive' and 'appDataFolder'. 'drive' represents files in My Drive and shared drives, while 'appDataFolder' represents the application's private data folder. \|
\| \`corpora\` \| string \| No \| Specifies the bodies of items (files/documents) to which the query applies. Supported values are 'user', 'domain', 'drive', and 'allDrives'. It's generally more efficient to use 'user' or 'drive' instead of 'allDrives'. Defaults to 'user'. \|
\| \`driveId\` \| string \| No \| The ID of the shared drive to search. This is used when \`corpora\` is set to 'drive'. \|
\| \`orderBy\` \| string \| No \| A comma-separated list of sort keys. Valid keys are: 'createdTime', 'folder', 'modifiedByMeTime', 'modifiedTime', 'name', 'name\_natural', 'quotaBytesUsed', 'recency', 'sharedWithMeTime', 'starred', 'viewedByMeTime'. IMPORTANT: Use 'quotaBytesUsed' to sort by file size (do NOT use 'size' - it is not a valid key). Each key sorts in ascending order by default, but can be reversed with the 'desc' modifier (e.g., 'modifiedTime desc'). \|
\| \`folderId\` \| string \| No \| ID of a specific folder to list files from. This is a convenience parameter that automatically adds "'folder\_id' in parents" to the query. Cannot be used together with a custom 'q' parameter. \|
\| \`pageSize\` \| integer \| No \| The maximum number of files to return per page. The value must be between 1 and 1000, inclusive. Defaults to 100. \|
\| \`pageToken\` \| string \| No \| The token for continuing a previous list request on the next page. This MUST be set to the value of 'nextPageToken' from the previous response. Do not manually construct or modify pageToken values as they are opaque tokens generated by the API. If the token is rejected, pagination should be restarted from the first page. \|
\| \`includeLabels\` \| string \| No \| A comma-separated list of label IDs to include in the \`labelInfo\` part of the response for each file. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Defaults to false. If true, then \`includeItemsFromAllDrives\` can be used to extend the search to all drives. \|
\| \`includeItemsFromAllDrives\` \| boolean \| No \| Whether to include items from both My Drive and shared drives. This is relevant when \`corpora\` is 'user' or 'domain'. Defaults to false. \|
\| \`includePermissionsForView\` \| string \| No \| Include additional permissions for a specific view. The only valid value is 'published', which includes permissions for files with published content. Omit this parameter if you don't need published view permissions. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Gmail filters

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_FILTERS\`

Tool to list all Gmail filters (rules) in the mailbox. Use for security audits to detect malicious filter rules or before creating new filters to avoid duplicates.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address or the special value 'me' to indicate the authenticated user whose filters will be retrieved. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Firebase Links

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_FIREBASE\_LINKS\`

Tool to list FirebaseLinks on a property. Use when you need to retrieve Firebase connections associated with a Google Analytics property. Each property can have at most one FirebaseLink.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The property for which to list FirebaseLinks. Format: properties/{property\_id} (e.g., properties/1234). \|
\| \`pageSize\` \| integer \| No \| Optional. The maximum number of resources to return. The service may return fewer than this value, even if there are additional pages. If unspecified, at most 50 resources will be returned. The maximum value is 200; higher values will be coerced to the maximum. \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous ListFirebaseLinks call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to ListFirebaseLinks must match the call that provided the page token. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List forwarding addresses

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_FORWARDING\_ADDRESSES\`

Tool to list all forwarding addresses for the specified Gmail account. Use when you need to retrieve the email addresses that are allowed to be used for forwarding messages.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address or the special value 'me' to indicate the authenticated user whose forwarding addresses will be retrieved. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Google Ads Links

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_GOOGLE\_ADS\_LINKS\`

Tool to list GoogleAdsLinks on a property. Use when you need to retrieve Google Ads account links configured for a Google Analytics property. Supports pagination for large result sets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The property resource name. Format: properties/{propertyId} (e.g., properties/1234). \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200; higher values will be coerced to the maximum. \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous ListGoogleAdsLinks call. Provide this to retrieve the subsequent page. When paginating, all other parameters must match the call that provided the page token. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Gmail history

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_HISTORY\`

Tool to list Gmail mailbox change history since a known startHistoryId. Use for incremental mailbox syncs. Persist the latest historyId as a checkpoint across sessions; without it, incremental sync is unreliable. An empty history list in the response is valid and means no new changes occurred.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address. Use 'me' to specify the authenticated user. \|
\| \`label\_id\` \| string \| No \| Only return history records involving messages with this label ID. \|
\| \`page\_token\` \| string \| No \| Token to retrieve a specific page of results. If the response includes nextPageToken, loop requests using this parameter until no nextPageToken is returned; failing to paginate will silently miss changes. \|
\| \`max\_results\` \| integer \| No \| Maximum number of history records to return. Default is 100; max is 500. \|
\| \`history\_types\` \| array \| No \| Filter by specific history types. Allowed values: messageAdded, messageDeleted, labelAdded, labelRemoved. \|
\| \`start\_history\_id\` \| string \| Yes \| Required. Returns history records after this ID. If the ID is invalid or too old, the API returns 404. Perform a full sync in that case. Should be a numeric string. On 404 (historyIdTooOld) or 400 (invalidArgument), recover by fetching a fresh historyId via GMAIL\_GET\_PROFILE, then perform a one-time full sync via GMAIL\_FETCH\_EMAILS before resuming incremental calls. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Key Events

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_KEY\_EVENTS\`

Tool to list Key Events. Use when you need to retrieve all key event definitions for a given property. Key events are read-only via API; creation, updates, and deletion require the Google Analytics UI. An empty results list means no key events are configured, not a failure. Do not infer key-event status from report data (e.g., eventCount); use this tool to confirm.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. Resource name of the parent property. Format: properties/{property\_id}. \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of results to return. Must be between 1 and 200. If not specified or 0, the API uses its default page size. \|
\| \`pageToken\` \| string \| No \| Optional. Token for retrieving the next page of results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Gmail labels

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_LABELS\`

Retrieves all system and user-created labels for a Gmail account in a single unpaginated response. Primary use: obtain internal label IDs (e.g., 'Label\_123') required by other Gmail tools — display names cannot be used as label identifiers and cause silent failures or errors. System labels (INBOX, UNREAD, SPAM, TRASH, etc.) are case-sensitive and must be used exactly as returned; INBOX, SPAM, and TRASH are read-only and cannot be added/removed via label modification tools. The Gmail search 'label:' operator accepts display names, but label\_ids parameters in tools like GMAIL\_FETCH\_EMAILS require internal IDs from this tool — mixing conventions yields zero results silently. Do not hardcode label IDs across sessions; refresh via this tool on conflict errors.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| Identifies the Gmail account (owner's email or 'me' for authenticated user) for which labels will be listed. \|
\| \`include\_details\` \| boolean \| No \| If true, fetches detailed info for each label including message/thread counts (messagesTotal, messagesUnread, threadsTotal, threadsUnread). This requires additional API calls and may be slower for accounts with many labels. If false (default), returns basic label info (id, name, type) which is faster. Counts are eventually consistent and may lag real-time mailbox state by a few seconds. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Measurement Protocol Secrets

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_MEASUREMENT\_PROTOCOL\_SECRETS\`

Tool to list MeasurementProtocolSecrets under a data stream. Use when you need to retrieve measurement protocol secrets for server-side event tracking.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The resource name of the parent data stream. Format: properties/{property}/dataStreams/{dataStream} \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of resources to return. If unspecified, at most 10 resources will be returned. The maximum value is 10 \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous ListMeasurementProtocolSecrets call. Provide this to retrieve the subsequent page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Media Items (App-Created Only)

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_MEDIA\_ITEMS\`

Lists media items created by this application from Google Photos. DEPRECATION NOTICE: As of March 31, 2025, the Google Photos Library API ONLY returns media items that were uploaded/created by your application. This action CANNOT access the user's full photo library. Use cases this action SUPPORTS: - Listing photos/videos your app previously uploaded to the user's library - Managing app-created content in Google Photos Use cases this action DOES NOT SUPPORT: - Accessing photos taken by the user's camera - Viewing photos from other apps or web uploads - Listing the user's entire photo library For accessing a user's full library, use the Google Photos Picker API instead: https://developers.google.com/photos/picker

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageSize\` \| integer \| No \| Maximum number of items to return. Default 25, maximum 100. \|
\| \`pageToken\` \| string \| No \| Token for getting the next page of results \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Gmail messages (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_MESSAGES\`

DEPRECATED: Use GMAIL\_FETCH\_EMAILS instead. Lists the messages in the user's mailbox. Use when you need to retrieve a list of email messages with optional filtering by labels or search query.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`q\` \| string \| No \| Only return messages matching the specified query. Supports the same query format as the Gmail search box. For example, 'from:someuser@example.com is:unread'. Cannot be used when accessing the API using the gmail.metadata scope. \|
\| \`user\_id\` \| string \| No \| The user's email address or 'me' to specify the authenticated user. \|
\| \`label\_ids\` \| array \| No \| Only return messages with labels that match all of the specified label IDs. Messages in a thread might have labels that other messages in the same thread don't have. \|
\| \`page\_token\` \| string \| No \| Page token to retrieve a specific page of results in the list. \|
\| \`max\_results\` \| integer \| No \| Maximum number of messages to return. Defaults to 100. The maximum allowed value is 500. \|
\| \`include\_spam\_trash\` \| boolean \| No \| Include messages from SPAM and TRASH in the results. Default is false. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Participants

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_PARTICIPANTS\`

Lists the participants in a conference record. By default, ordered by join time descending. Use to retrieve all participants who joined a specific Google Meet conference, with support for filtering active participants (where \`latest\_end\_time IS NULL\`).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`filter\` \| string \| No \| Optional. User-specified filtering condition in EBNF format. Filterable fields: \`earliest\_start\_time\`, \`latest\_end\_time\`. Example: \`latest\_end\_time IS NULL\` returns active participants in the conference. \|
\| \`parent\` \| string \| Yes \| Required. Format: conferenceRecords/{conference\_record}. The conference record ID can be obtained from the LIST\_CONFERENCE\_RECORDS action. \|
\| \`page\_size\` \| integer \| No \| Optional. Maximum number of participants to return. The service might return fewer than this value. If unspecified, at most 100 participants are returned. The maximum value is 250; values above 250 are coerced to 250. \|
\| \`page\_token\` \| string \| No \| Optional. Page token returned from a previous list call, used to retrieve the next page of results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Participant Sessions

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_PARTICIPANT\_SESSIONS\`

Lists all participant sessions for a specific participant in a Google Meet conference. A participant session represents each unique join or leave session when a user joins a conference from a device. If a user joins multiple times from the same device, each join creates a new session. Returns session details including start time and end time for each session.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`filter\` \| string \| No \| Optional. User-specified filtering condition in EBNF format. Filterable fields include \`start\_time\` and \`end\_time\`. Time values must use RFC3339 UTC format (e.g., \`start\_time >= '2024-01-01T00:00:00Z'\`). Unsupported field names or malformed expressions may silently narrow or drop results rather than raising errors. Reversed bounds or incorrect timezone conversion will produce empty results. \|
\| \`page\_size\` \| integer \| No \| Optional. Maximum number of participant sessions to return. The service might return fewer than this value. If unspecified, at most 100 participant sessions are returned. The maximum value is 250; values above 250 are coerced to 250. \|
\| \`page\_token\` \| string \| No \| Optional. Page token returned from a previous list call, used to retrieve the next page of results. Iterate using successive \`page\_token\` values until the response omits \`page\_token\` to avoid silently missing sessions. \|
\| \`participant\_id\` \| string \| Yes \| Required. The unique identifier of the participant within the conference. Example: 'xyz-456'. \|
\| \`conference\_record\_id\` \| string \| Yes \| Required. The unique identifier of the conference record. Example: 'abc-123-def'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Permissions

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_PERMISSIONS\`

Tool to list a file's permissions. Use when you need to retrieve all permissions associated with a specific file or shared drive.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The ID of the file or shared drive. Must be a non-empty string. \|
\| \`pageSize\` \| integer \| No \| The maximum number of permissions to return per page. When not set for files in a shared drive, at most 100 results will be returned. When not set for files that are not in a shared drive, the entire list will be returned. \|
\| \`pageToken\` \| string \| No \| The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Default: false \|
\| \`useDomainAdminAccess\` \| boolean \| No \| Issue the request as a domain administrator; if set to true, then theRequester will be granted access if the file ID parameter refers to a shared drive and the requester is an administrator of the domain to which the shared drive belongs. \|
\| \`includePermissionsForView\` \| string \| No \| Specifies which additional view's permissions to include in the response. Only 'published' is supported. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Properties (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_PROPERTIES\`

DEPRECATED: Use ListPropertiesV1Beta instead. Tool to list GA4 properties under a specific account. Use after obtaining an account ID; supports pagination and including soft-deleted properties. Results may include legacy Universal Analytics properties; verify property type before use.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`account\` \| string \| Yes \| Required. Google Analytics account resource name in format accounts/{account\_id} where account\_id is a Google Analytics account ID (typically 6-10 digits). Use GOOGLE\_ANALYTICS\_LIST\_ACCOUNTS to get valid account IDs. Note: Do not use Google Account IDs (long numeric IDs from OAuth user info) - only Google Analytics account IDs are valid. \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of properties to return; must be between 1 and 200. \|
\| \`pageToken\` \| string \| No \| Optional. Token returned from a previous call to retrieve the next page of results. \|
\| \`showDeleted\` \| boolean \| No \| Optional. Whether to include soft-deleted (trashed) properties. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Property

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_PROPERTIES\_FILTERED\`

Tool to list GA4 properties based on filter criteria. Use when you need to find properties under a specific parent account or with specific firebase projects. Supports pagination and including soft-deleted properties.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`filter\` \| string \| Yes \| Required. Expression for filtering the results. Fields eligible for filtering: \`parent:\` (resource name of parent account/property), \`ancestor:\` (resource name of parent account), or \`firebase\_project:\` (id or number of linked firebase project). Examples: 'parent:accounts/123' (account with id 123), 'parent:properties/123' (property with id 123), 'ancestor:accounts/123' (account with id 123), 'firebase\_project:project-id' (firebase project with id project-id), 'firebase\_project:123' (firebase project with number 123). \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of properties to return (1-200). Default is 50. \|
\| \`pageToken\` \| string \| No \| Optional. Token from previous ListProperties call to retrieve the next page. \|
\| \`showDeleted\` \| boolean \| No \| Optional. Whether to include soft-deleted (trashed) properties. Default is false. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Recordings

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_RECORDINGS\`

Tool to list recording resources from a conference record. Use when you need to retrieve recordings from a specific Google Meet conference. Recordings are created when meeting recording is enabled and saved to Google Drive as MP4 files.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The conference record to list recordings for. Format: conferenceRecords/{conference\_record} \|
\| \`page\_size\` \| integer \| No \| Maximum number of recordings to return. The service may return fewer than this value. If unspecified, at most 10 recordings are returned. The maximum value is 100; values above 100 are coerced to 100. \|
\| \`page\_token\` \| string \| No \| Page token returned from a previous list call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to the list call must match the call that provided the page token. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Recurring Audience Lists

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_RECURRING\_AUDIENCE\_LISTS\`

Tool to list all recurring audience lists for a GA4 property. Use when you need to find and reuse existing recurring audience lists.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. Resource name of the parent property. Format: properties/{property\_id} \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of recurring audience lists to return. Defaults to 200; maximum is 1000. \|
\| \`pageToken\` \| string \| No \| Optional. Token for retrieving the next page of results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Replies to Comment

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_REPLIES\`

Tool to list replies to a comment in Google Drive. Use this when you need to retrieve all replies associated with a specific comment on a file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. Use '\*' for all fields or e.g. 'replies(id,content),nextPageToken' \|
\| \`file\_id\` \| string \| Yes \| The ID of the file. \|
\| \`page\_size\` \| integer \| No \| The maximum number of replies to return per page. \|
\| \`comment\_id\` \| string \| Yes \| The ID of the comment. \|
\| \`page\_token\` \| string \| No \| The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response. \|
\| \`include\_deleted\` \| boolean \| No \| Whether to include deleted replies. Deleted replies will not include their original content. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Reporting Data Annotations

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_REPORTING\_DATA\_ANNOTATIONS\`

Tool to list all Reporting Data Annotations for a specific property. Use when you need to retrieve annotations that document important events or periods in GA4 reporting data.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`filter\` \| string \| No \| Optional. Expression to refine results. Supported fields: name, title, description, annotationDate, annotationDateRange, color. Helper functions: annotation\_duration(), is\_annotation\_in\_range(). Operators: =, !=, <, >, <=, >=, :, =~, !~, NOT, AND, OR. \|
\| \`parent\` \| string \| Yes \| Required. Resource name of the property. Format: properties/{property\_id}. Example: properties/123456789 \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of resources per response. Default: 50, Max: 200. \|
\| \`pageToken\` \| string \| No \| Optional. Pagination token from previous response to retrieve next page. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Report Tasks

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_REPORT\_TASKS\`

Tool to list all report tasks for a Google Analytics property. Use when you need to retrieve report task definitions and their execution status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. Property identifier in format 'properties/{propertyId}'. The Google Analytics property whose report tasks should be listed. \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of report tasks to return per page. If unspecified, server determines page size. \|
\| \`pageToken\` \| string \| No \| Optional. Pagination token from previous list response for retrieving next page of results. Omit for first page. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List File Revisions

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_REVISIONS\`

Tool to list a file's revision metadata (not content) in Google Drive. Drive may prune old revisions, so history may be incomplete for frequently edited files. Filter client-side for specific revisionIds; do not assume the last entry is the active version.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The ID of the file. \|
\| \`pageSize\` \| integer \| No \| The maximum number of revisions to return per page. \|
\| \`pageToken\` \| string \| No \| The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response. Continue paginating until \`nextPageToken\` is absent; stopping early silently omits revisions. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Defaults to false. Must be set to \`true\` for shared drive files; omitting it causes \`fileId\` resolution failures on shared drives. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Search Ads 360 Links

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_SEARCH\_ADS360\_LINKS\`

Tool to list all SearchAds360Links on a property. Use when you need to retrieve all Search Ads 360 links for a given Google Analytics property. Supports pagination for large result sets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The property resource name. Format: properties/{propertyId} (e.g., properties/1234). \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of resources to return. Default is 50, maximum is 200. Values exceeding 200 are capped at maximum. \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous list call. Use this to retrieve the next page. All other parameters must match the original request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List send-as aliases

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_SEND\_AS\`

Lists the send-as aliases for a Gmail account, including the primary address and custom 'from' aliases. Use when you need to retrieve available sending addresses for composing emails.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address or the special value 'me' to indicate the authenticated user whose send-as aliases will be retrieved. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Calendar Settings (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_SETTINGS\`

DEPRECATED: Use GOOGLECALENDAR\_SETTINGS\_LIST instead. Tool to return all user settings for the authenticated user. Use when you need to retrieve calendar settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageToken\` \| string \| No \| Token for pagination to retrieve subsequent result pages \|
\| \`maxResults\` \| integer \| No \| Maximum number of settings to return \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Shared Albums (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_SHARED\_ALBUMS\`

\[DEPRECATED - sunset March 31, 2025\] Lists all shared albums available in the Sharing tab of the user's Google Photos app. Use when you need to retrieve shared albums that are visible to the user in their Sharing tab.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageSize\` \| integer \| No \| Maximum number of albums to return. Default 20, maximum 50. \|
\| \`pageToken\` \| string \| No \| Continuation token for getting the next page of results. Use the value returned in nextPageToken from the previous response. \|
\| \`excludeNonAppCreatedData\` \| boolean \| No \| If true, excludes media items not created by this app. Defaults to false (all albums are returned). This field is ignored if the photoslibrary.readonly.appcreateddata scope is used. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Shared Drives

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_SHARED\_DRIVES\`

Tool to list the user's shared drives. Use when you need to get a list of all shared drives accessible to the authenticated user. Results may differ from the web UI due to admin policies; listing a drive does not guarantee access to its contents. Paginated calls may trigger 403 rateLimitExceeded or 429 tooManyRequests; apply exponential backoff when iterating many pages.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`q\` \| string \| No \| Query string for searching shared drives using Google Drive query syntax (e.g., "name contains 'ProjectX'" or "createdTime > '2023-01-01T00:00:00'"). Query format: query\_term operator values. Common query terms: name, createdTime, memberCount, organizerCount, hidden. Common operators: contains, =, >, <, >=, !=. String values must be enclosed in single quotes. Special characters (apostrophes, backslashes) must be escaped. Multiple terms can be combined with 'and'/'or' operators and parentheses for grouping. \|
\| \`pageSize\` \| integer \| No \| Maximum number of shared drives to return per page. Maximum allowed value is 1000. Paginate by passing the returned nextPageToken back as pageToken until no nextPageToken is returned to avoid silently missing drives. \|
\| \`pageToken\` \| string \| No \| Page token for shared drives. \|
\| \`useDomainAdminAccess\` \| boolean \| No \| Issue the request as a domain administrator. If set to true, then all shared drives of the domain in which the requester is an administrator are returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List SKAdNetwork Conversion Value Schemas

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_SK\_AD\_NETWORK\_CONVERSION\_VALUE\_SCHEMAS\`

Tool to list SKAdNetworkConversionValueSchema configurations for an iOS data stream. Use when you need to retrieve conversion value schemas for iOS app tracking. Maximum one schema per property is supported.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. The DataStream resource to list schemas for. Format: properties/{property\_id}/dataStreams/{dataStream}. Example: 'properties/123456789/dataStreams/1234567890' \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of resources per response. Default: 50, Maximum: 200. \|
\| \`pageToken\` \| string \| No \| Optional. Token from previous call for pagination to retrieve next page of results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List S/MIME configs

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_SMIME\_INFO\`

Lists S/MIME configs for the specified send-as alias. Use when you need to retrieve all S/MIME certificate configurations associated with a specific send-as email address.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address. The special value 'me' can be used to indicate the authenticated user. \|
\| \`send\_as\_email\` \| string \| Yes \| The email address that appears in the 'From:' header for mail sent using this alias. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Charts from Spreadsheet

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_SPREADSHEET\_CHARTS\`

Tool to retrieve a list of all charts from a specified Google Sheets spreadsheet. Use when you need to get chart IDs and their specifications for embedding or referencing elsewhere, such as in Google Docs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`spreadsheet\_id\` \| string \| Yes \| The ID of the Google Sheets spreadsheet from which to retrieve charts. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Sub Accounts

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_SUB\_ACCOUNTS\`

List direct child/sub-accounts under a Google Ads manager (MCC) account. Use this before account-scoped read or mutate calls when a user needs to choose which child account to target. The returned customer\_id values can be passed to other Google Ads tools as their customer\_id.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_token\` \| string \| No \| Pagination token from a previous response's next\_page\_token. \|
\| \`customer\_id\` \| string \| No \| Manager/MCC Google Ads customer ID whose direct sub-accounts should be listed; hyphens and spaces are stripped. Defaults to the connection customer\_id. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Subproperty Event Filters

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_SUBPROPERTY\_EVENT\_FILTERS\`

Tool to list all subproperty event filters on a property. Use when you need to retrieve event filters that route events to subproperties.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. Resource name of the ordinary property. Format: properties/{property\_id} \|
\| \`pageSize\` \| integer \| No \| Optional. Maximum number of resources to return; at most 50 by default, maximum 200. \|
\| \`pageToken\` \| string \| No \| Optional. Page token received from a previous call to retrieve the next page. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Subproperty Sync Configs

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_SUBPROPERTY\_SYNC\_CONFIGS\`

Tool to list SubpropertySyncConfig resources for managing subproperty synchronization configurations. Use when you need to fetch subproperty sync configs for a GA4 property.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`parent\` \| string \| Yes \| Required. Resource name of the property. Format: properties/{property\_id}. Example: properties/123 \|
\| \`pageSize\` \| integer \| No \| Optional. The maximum number of resources to return. May return fewer. If unspecified, at most 50 resources will be returned. Maximum value is 200. \|
\| \`pageToken\` \| string \| No \| Optional. A page token received from a previous ListSubpropertySyncConfig call. Provide this to retrieve the subsequent page. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Tables in Spreadsheet

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_TABLES\`

DEPRECATED: Use GOOGLESHEETS\_GET\_SHEET\_NAMES for tab discovery and GOOGLESHEETS\_GET\_SPREADSHEET\_INFO for full sheet metadata. This action is used to list all tables in a Google Spreadsheet, call this action to get the list of tables in a spreadsheet. Discover all tables in a Google Spreadsheet by analyzing sheet structure and detecting data patterns. Uses heuristic analysis to find header rows, data boundaries, and table structures.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`min\_rows\` \| integer \| No \| Minimum number of data rows to consider a valid table \|
\| \`min\_columns\` \| integer \| No \| Minimum number of columns to consider a valid table \|
\| \`min\_confidence\` \| number \| No \| Minimum confidence score (0.0-1.0) to consider a valid table \|
\| \`spreadsheet\_id\` \| string \| Yes \| The actual Google Spreadsheet ID (not a placeholder or spreadsheet name). Find it in the spreadsheet URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET\_ID}/edit. It is the alphanumeric string between '/d/' and '/edit' (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'). IMPORTANT: Do NOT pass the spreadsheet name - only pass the alphanumeric ID from the URL. Do NOT pass template placeholders like '{{spreadsheet\_id}}', '', or 'your-spreadsheet-id-here'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List task lists

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_TASK\_LISTS\`

Fetches the authenticated user's task lists from Google Tasks; results may be paginated. Response contains task lists under the \`items\` key. Multiple lists may share similar names — confirm the correct list by ID before passing to other tools.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageToken\` \| string \| No \| Token for the page of results to return; omit for the first page, use \`nextPageToken\` from a previous response for subsequent pages. \|
\| \`maxResults\` \| integer \| No \| Maximum number of task lists to return per page. Capped at 100; values above 100 are silently truncated to 100. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Tasks

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_TASKS\`

Retrieves tasks from a Google Tasks list; all date/time strings must be RFC3339 UTC, and \`showCompleted\` must be true if \`completedMin\` or \`completedMax\` are specified. Response key for tasks is \`tasks\` (not \`items\`). No full-text search; filter client-side by title/notes. Results ordered by position, not by date.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`dueMax\` \| string \| No \| Exclude tasks due after this date. Google Tasks API requires dates in RFC3339 format (e.g., 2025-09-22T13:48:27Z). We automatically convert various human-readable formats to RFC3339: Accepted formats: • 2025-09-28T23:59:00Z → RFC3339/ISO-8601 format (preferred) - September 28, 2025 at 11:59 PM UTC • 28 Sep 2025 → Simple date format - Will be converted to midnight UTC on that date • 11:59 PM, 22 Sep 2025 → Time with date - Assumes UTC timezone if not specified • 1:00 PM, 21 Sep 2025 → 12-hour format with date - Converted to 13:00 UTC • UTC-5:30, 6:50 PM → With timezone offset - Converted to UTC automatically • UTC+1, 11:59 PM, 31 Dec → Timezone with date - Next occurrence of Dec 31 • 2025-09-21T15:30:00+02:00 → RFC3339 with timezone offset Note: If no timezone is specified, UTC is assumed. Dates without times default to midnight UTC. \|
\| \`dueMin\` \| string \| No \| Exclude tasks due before this date. Google Tasks API requires dates in RFC3339 format (e.g., 2025-09-22T13:48:27Z). We automatically convert various human-readable formats to RFC3339: Accepted formats: • 2025-09-28T23:59:00Z → RFC3339/ISO-8601 format (preferred) - September 28, 2025 at 11:59 PM UTC • 28 Sep 2025 → Simple date format - Will be converted to midnight UTC on that date • 11:59 PM, 22 Sep 2025 → Time with date - Assumes UTC timezone if not specified • 1:00 PM, 21 Sep 2025 → 12-hour format with date - Converted to 13:00 UTC • UTC-5:30, 6:50 PM → With timezone offset - Converted to UTC automatically • UTC+1, 11:59 PM, 31 Dec → Timezone with date - Next occurrence of Dec 31 • 2025-09-21T15:30:00+02:00 → RFC3339 with timezone offset Note: If no timezone is specified, UTC is assumed. Dates without times default to midnight UTC. \|
\| \`pageToken\` \| string \| No \| Token from a previous list operation for fetching a specific page; if omitted, retrieves the first page. \|
\| \`maxResults\` \| integer \| No \| Maximum number of tasks to return. API default: 20, maximum: 100. Use \`nextPageToken\` from the response in successive calls until absent to avoid missing tasks beyond the first page. \|
\| \`showHidden\` \| boolean \| No \| Include hidden tasks. Defaults to false. \|
\| \`tasklistId\` \| string \| Yes \| Identifier of the task list. IMPORTANT: For the user's primary/default task list, you MUST use the literal string '@default' (NOT 'primary', 'default', or any other variation). The value 'primary' is NOT valid and will be rejected by the API. Either use '@default' for the primary list or provide a valid task list ID obtained from list\_task\_lists. \|
\| \`updatedMin\` \| string \| No \| Lower bound for task's last modification time (for syncing). Google Tasks API requires dates in RFC3339 format (e.g., 2025-09-22T13:48:27Z). We automatically convert various human-readable formats to RFC3339: Accepted formats: • 2025-09-28T23:59:00Z → RFC3339/ISO-8601 format (preferred) - September 28, 2025 at 11:59 PM UTC • 28 Sep 2025 → Simple date format - Will be converted to midnight UTC on that date • 11:59 PM, 22 Sep 2025 → Time with date - Assumes UTC timezone if not specified • 1:00 PM, 21 Sep 2025 → 12-hour format with date - Converted to 13:00 UTC • UTC-5:30, 6:50 PM → With timezone offset - Converted to UTC automatically • UTC+1, 11:59 PM, 31 Dec → Timezone with date - Next occurrence of Dec 31 • 2025-09-21T15:30:00+02:00 → RFC3339 with timezone offset Note: If no timezone is specified, UTC is assumed. Dates without times default to midnight UTC. \|
\| \`showDeleted\` \| boolean \| No \| Include deleted tasks. Defaults to false. \|
\| \`completedMax\` \| string \| No \| Exclude tasks completed after this date. Google Tasks API requires dates in RFC3339 format (e.g., 2025-09-22T13:48:27Z). We automatically convert various human-readable formats to RFC3339: Accepted formats: • 2025-09-28T23:59:00Z → RFC3339/ISO-8601 format (preferred) - September 28, 2025 at 11:59 PM UTC • 28 Sep 2025 → Simple date format - Will be converted to midnight UTC on that date • 11:59 PM, 22 Sep 2025 → Time with date - Assumes UTC timezone if not specified • 1:00 PM, 21 Sep 2025 → 12-hour format with date - Converted to 13:00 UTC • UTC-5:30, 6:50 PM → With timezone offset - Converted to UTC automatically • UTC+1, 11:59 PM, 31 Dec → Timezone with date - Next occurrence of Dec 31 • 2025-09-21T15:30:00+02:00 → RFC3339 with timezone offset Note: If no timezone is specified, UTC is assumed. Dates without times default to midnight UTC. \|
\| \`completedMin\` \| string \| No \| Exclude tasks completed before this date. Google Tasks API requires dates in RFC3339 format (e.g., 2025-09-22T13:48:27Z). We automatically convert various human-readable formats to RFC3339: Accepted formats: • 2025-09-28T23:59:00Z → RFC3339/ISO-8601 format (preferred) - September 28, 2025 at 11:59 PM UTC • 28 Sep 2025 → Simple date format - Will be converted to midnight UTC on that date • 11:59 PM, 22 Sep 2025 → Time with date - Assumes UTC timezone if not specified • 1:00 PM, 21 Sep 2025 → 12-hour format with date - Converted to 13:00 UTC • UTC-5:30, 6:50 PM → With timezone offset - Converted to UTC automatically • UTC+1, 11:59 PM, 31 Dec → Timezone with date - Next occurrence of Dec 31 • 2025-09-21T15:30:00+02:00 → RFC3339 with timezone offset Note: If no timezone is specified, UTC is assumed. Dates without times default to midnight UTC. \|
\| \`showCompleted\` \| boolean \| No \| Include completed tasks. Defaults to true. (See action docstring for interaction with \`completedMin\`/\`Max\`). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Team Drives (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_TEAM\_DRIVES\`

Tool to list Team Drives (deprecated, use List Shared Drives instead). Use when you need to retrieve Team Drives using the legacy endpoint.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`q\` \| string \| No \| Query string for searching Team Drives. \|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format values. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`callback\` \| string \| No \| JSONP callback. \|
\| \`pageSize\` \| integer \| No \| Maximum number of Team Drives to return per page. \|
\| \`pageToken\` \| string \| No \| Page token for Team Drives. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|
\| \`useDomainAdminAccess\` \| boolean \| No \| Issue the request as a domain administrator; if set to true, then all Team Drives of the domain in which the requester is an administrator are returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List threads

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_THREADS\`

Retrieves a list of email threads from a Gmail account, identified by \`user\_id\` (email address or 'me'), supporting filtering and pagination. Spam and trash are excluded by default unless explicitly targeted via \`label:spam\` or \`label:trash\` in the query.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| No \| Filter for threads, using Gmail search query syntax (e.g., 'from:user@example.com is:unread'). Supported operators include \`from:\`, \`to:\`, \`subject:\`, \`label:\`, \`is:unread\`, \`has:attachment\`, \`after:\`, \`before:\`. Dates must use \`YYYY/MM/DD\` format; date operators are UTC-based. Exact subject phrases require quotes (e.g., \`subject:'meeting notes'\`). \|
\| \`user\_id\` \| string \| No \| The user's email address or 'me' to specify the authenticated Gmail account. \|
\| \`verbose\` \| boolean \| No \| If false, returns threads with basic fields (id, snippet, historyId). If true, returns threads with complete message details including headers, body, attachments, and metadata for each message in the thread. Combining \`verbose=true\` with large \`max\_results\` produces very large responses; keep \`max\_results\` modest when verbose is enabled. \|
\| \`page\_token\` \| string \| No \| Token from a previous response to retrieve a specific page of results; omit for the first page. \|
\| \`max\_results\` \| integer \| No \| Maximum number of threads to return. Hard cap is ~500 per call. For full mailbox coverage, loop using \`nextPageToken\` via \`page\_token\` until absent. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Transcript Entries

\*\*Slug:\*\* \`GOOGLESUPER\_LIST\_TRANSCRIPT\_ENTRIES\`

Tool to list structured transcript entries (speaker/time/text segments) for a specific Google Meet transcript. Use when you need to access the detailed content of a transcript, including individual spoken segments with timestamps and speaker information. Note: The transcript entries returned by the API might not match the transcription in Google Docs due to interleaved speakers or post-generation modifications.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_size\` \| integer \| No \| Maximum number of transcript entries to return. The service might return fewer than this value. If unspecified, at most 10 entries are returned. The maximum value is 100; values above 100 are coerced to 100. \|
\| \`page\_token\` \| string \| No \| Page token returned from a previous list call, used to retrieve the next page of results. \|
\| \`transcript\_id\` \| string \| Yes \| The unique identifier of the transcript within the conference record. \|
\| \`conference\_record\_id\` \| string \| Yes \| The unique identifier of the conference record. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Lookup Aerial Video

\*\*Slug:\*\* \`GOOGLESUPER\_LOOKUP\_AERIAL\_VIDEO\`

Tool to look up an aerial view video by address or video ID. Returns video metadata including state and URIs for playback. Use when you need to retrieve a previously rendered aerial video or check the status of a video render request. Note that receiving a video is a billable event.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`address\` \| string \| No \| A US postal address. Either videoId or address must be provided, but not both. \|
\| \`videoId\` \| string \| No \| An ID returned from videos.renderVideo. Either videoId or address must be provided, but not both. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Look up spreadsheet row

\*\*Slug:\*\* \`GOOGLESUPER\_LOOKUP\_SPREADSHEET\_ROW\`

Finds the first row in a Google Spreadsheet where a cell's entire content exactly matches the query string, searching within a specified A1 notation range or the first sheet by default.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| Yes \| Exact text value to find; matches the entire content of a cell in a row. \|
\| \`range\` \| string \| No \| A1 notation range to search within. Supports cell ranges (e.g., 'Sheet1!A1:D5'), column-only ranges (e.g., 'Sheet1!A:Z'), and row-only ranges (e.g., 'Sheet1!1:1'). Defaults to the first sheet if omitted. IMPORTANT: Sheet names with spaces must be single-quoted (e.g., "'My Sheet'!A1:Z"). Bare sheet names without ranges (e.g., 'Sheet1') are not supported - always specify a range. \|
\| \`case\_sensitive\` \| boolean \| No \| If \`True\`, the query string search is case-sensitive. \|
\| \`spreadsheet\_id\` \| string \| Yes \| Identifier of the Google Spreadsheet to search. \|
\| \`value\_render\_option\` \| string ("FORMATTED\_VALUE" \| "UNFORMATTED\_VALUE" \| "FORMULA") \| No \| How cell values are rendered in the returned row data. unformatted: raw values without display formatting — dates appear as serial numbers, e.g. 46009.47 (default, keeps consistency with UPSERT). formatted: display-formatted values — dates appear as strings, e.g. '2025-12-18'. formula: raw formulas instead of computed values. \|
\| \`normalize\_whitespace\` \| boolean \| No \| If \`True\`, strips leading and trailing whitespace from cell values before matching. This helps match cells like ' TOTAL ' or 'TOTAL ' when searching for 'TOTAL'. \|
\| \`date\_time\_render\_option\` \| string \| No \| How dates and times are represented. FORMATTED\_STRING: human-readable strings (e.g. '2025-12-18 11:17'). SERIAL\_NUMBER: Excel-style serial numbers. Works with all value\_render\_option settings. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Embed Google Map

\*\*Slug:\*\* \`GOOGLESUPER\_MAPS\_EMBED\_API\`

Tool to generate an embeddable Google Map URL and HTML iframe code. Use when you need to display a map (place, view, directions, street view, search) on a webpage without JavaScript. Note: This API only works with API keys (no OAuth2 support). It generates embed URLs and does not make direct API calls. Generated embed URLs are publicly accessible; avoid passing sensitive or internal location queries.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mode\` \| string ("place" \| "view" \| "directions" \| "streetview" \| "search") \| Yes \| The mode of the embedded map. \|
\| \`api\_key\` \| string \| No \| Google Maps API key. Required if not provided via connection metadata. The Maps Embed API only supports API key authentication, not OAuth. \|
\| \`view\_params\` \| object \| No \| Parameters for 'view' mode. \|
\| \`place\_params\` \| object \| No \| Parameters for 'place' mode. \|
\| \`search\_params\` \| object \| No \| Parameters for 'search' mode. \|
\| \`directions\_params\` \| object \| No \| Parameters for 'directions' mode. \|
\| \`streetview\_params\` \| object \| No \| Parameters for 'streetview' mode. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Modify File Labels

\*\*Slug:\*\* \`GOOGLESUPER\_MODIFY\_FILE\_LABELS\`

Modifies the set of labels applied to a file. Returns a list of the labels that were added or modified. Use when you need to programmatically change labels on a Google Drive file, such as adding, updating, or removing them.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`kind\` \| string \| No \| This is always drive#modifyLabelsRequest. \|
\| \`file\_id\` \| string \| Yes \| The ID of the file. \|
\| \`label\_modifications\` \| array \| Yes \| The list of modifications to apply to the labels on the file. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Modify thread labels

\*\*Slug:\*\* \`GOOGLESUPER\_MODIFY\_THREAD\_LABELS\`

Adds or removes specified existing label IDs from a Gmail thread, affecting all its messages; ensure the thread ID is valid. To modify a single message only, use a message-level tool instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| User's email address or 'me' for the authenticated user. \|
\| \`thread\_id\` \| string \| Yes \| Immutable ID of the thread to modify. \|
\| \`add\_label\_ids\` \| array \| No \| List of label IDs to add to the thread. Must be valid label IDs that exist in the user's account. System labels use uppercase names (e.g., 'INBOX', 'STARRED', 'IMPORTANT', 'UNREAD', 'SPAM', 'TRASH', 'SENT', 'DRAFT', 'CATEGORY\_PERSONAL', 'CATEGORY\_SOCIAL', 'CATEGORY\_PROMOTIONS', 'CATEGORY\_UPDATES', 'CATEGORY\_FORUMS'). Custom labels use the format 'Label\_N' (e.g., 'Label\_1', 'Label\_42'). Use GMAIL\_LIST\_LABELS to discover available label IDs. Accepts either a list or a JSON-encoded string. Note: If a label appears in both add\_label\_ids and remove\_label\_ids, the add operation takes priority. Use GMAIL\_CREATE\_LABEL first if the label does not yet exist, then supply its returned ID here. \|
\| \`remove\_label\_ids\` \| array \| No \| List of label IDs to remove from the thread. Must be valid label IDs that exist in the user's account. System labels use uppercase names (e.g., 'INBOX', 'STARRED', 'IMPORTANT', 'UNREAD', 'SPAM', 'TRASH', 'SENT', 'DRAFT', 'CATEGORY\_PERSONAL', 'CATEGORY\_SOCIAL', 'CATEGORY\_PROMOTIONS', 'CATEGORY\_UPDATES', 'CATEGORY\_FORUMS'). Custom labels use the format 'Label\_N' (e.g., 'Label\_1', 'Label\_42'). Use GMAIL\_LIST\_LABELS to discover available label IDs. Accepts either a list or a JSON-encoded string. Note: Labels that appear in both add\_label\_ids and remove\_label\_ids will be automatically removed from this list (add takes priority). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Move or Resize Chart in Google Sheets

\*\*Slug:\*\* \`GOOGLESUPER\_MOVE\_CHART\`

Move or resize an existing chart on a Google Sheets spreadsheet. Use this action when you need to reposition a chart to a different location on the same or different sheet, move it to a brand-new sheet, or change its size. This action wraps the updateEmbeddedObjectPosition batchUpdate request type and supports three positioning modes: moving to a new sheet, moving to an existing sheet, or repositioning via pixel-perfect overlay coordinates.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`chart\_id\` \| integer \| Yes \| The unique numeric identifier of the chart to move within the spreadsheet. This is the chartId value (also known as objectId) returned when the chart was created or can be retrieved using GOOGLESHEETS\_LIST\_CHARTS or 'Get Spreadsheet Info' action (look for sheets\[\].charts\[\].chartId in the response). The chart must already exist in the specified spreadsheet. \|
\| \`new\_sheet\` \| boolean \| No \| Set to true to move the chart to a brand-new sheet. Google Sheets will automatically create and name the new sheet. This is mutually exclusive with target\_sheet\_id and anchor\_sheet\_id. \|
\| \`width\_pixels\` \| integer \| No \| Width of the chart in pixels. Only valid when anchor\_sheet\_id is provided. If omitted, Google Sheets preserves the existing width. \|
\| \`height\_pixels\` \| integer \| No \| Height of the chart in pixels. Only valid when anchor\_sheet\_id is provided. If omitted, Google Sheets preserves the existing height. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Sheets spreadsheet containing the chart to move. Must be the actual spreadsheet ID from the URL (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'), NOT the spreadsheet name or title. Find it in the URL: https://docs.google.com/spreadsheets/d/SPREADSHEET\_ID/edit \|
\| \`anchor\_sheet\_id\` \| integer \| No \| The numeric sheetId of the sheet to anchor the chart onto when repositioning via overlay coordinates. Required if any of anchor\_row\_index, anchor\_column\_index, offset\_x\_pixels, offset\_y\_pixels, width\_pixels, or height\_pixels is provided. This is mutually exclusive with new\_sheet and target\_sheet\_id. \|
\| \`offset\_x\_pixels\` \| integer \| No \| Horizontal pixel offset from the anchor cell. Only valid when anchor\_sheet\_id is provided. If omitted, Google Sheets preserves the existing horizontal offset. \|
\| \`offset\_y\_pixels\` \| integer \| No \| Vertical pixel offset from the anchor cell. Only valid when anchor\_sheet\_id is provided. If omitted, Google Sheets preserves the existing vertical offset. \|
\| \`target\_sheet\_id\` \| integer \| No \| The numeric sheetId of an existing sheet to move the chart to. The chart's anchor position on that sheet will remain unchanged. This is mutually exclusive with new\_sheet and anchor\_sheet\_id. Use 'Get Spreadsheet Info' to retrieve valid sheetIds. \|
\| \`anchor\_row\_index\` \| integer \| No \| The 0-based row index of the anchor cell for overlay positioning. Required if anchor\_sheet\_id is set. Must be used together with anchor\_column\_index. \|
\| \`anchor\_column\_index\` \| integer \| No \| The 0-based column index of the anchor cell for overlay positioning. Required if anchor\_sheet\_id is set. Must be used together with anchor\_row\_index. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Move File

\*\*Slug:\*\* \`GOOGLESUPER\_MOVE\_FILE\`

Tool to move a file from one folder to another in Google Drive. To truly move (not just copy the parent), always provide both \`add\_parents\` (destination folder ID) and \`remove\_parents\` (source folder ID); omitting \`remove\_parents\` leaves the file in multiple folders. Useful for reorganizing files, including newly created Google Docs/Sheets that default to Drive root.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The ID of the file to move. Must be a non-empty string. \|
\| \`add\_parents\` \| string \| No \| The ID of the single destination folder (e.g., '1FmTIJYwTENUDXOKyNJp7OmcRBvP\_6DmT'). Must be a valid Google Drive folder ID consisting of alphanumeric characters, hyphens, and underscores. Folder names are not accepted. \|
\| \`ocr\_language\` \| string \| No \| A language hint for OCR processing during image import (ISO 639-1 code). \|
\| \`include\_labels\` \| string \| No \| A comma-separated list of IDs of labels to include in the \`labelInfo\` part of the response. \|
\| \`remove\_parents\` \| string \| No \| A comma-separated list of parent folder IDs to remove the file from. Use this to specify the source folder. \|
\| \`supports\_all\_drives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Set to true if moving files to or from a shared drive. \|
\| \`keep\_revision\_forever\` \| boolean \| No \| Whether to set the 'keepForever' field in the new head revision. This is only applicable to files with binary content in Google Drive. \|
\| \`include\_permissions\_for\_view\` \| string \| No \| Specifies which additional view's permissions to include in the response. Only 'published' is supported. \|
\| \`use\_content\_as\_indexable\_text\` \| boolean \| No \| Whether to use the uploaded content as indexable text. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Move Task

\*\*Slug:\*\* \`GOOGLESUPER\_MOVE\_TASK\`

Moves the specified task to another position in the task list or to a different task list. Use cases: - Reorder tasks within a list (use 'previous' parameter) - Create subtasks by moving a task under a parent (use 'parent' parameter) - Move tasks between different task lists (use 'destinationTasklist' parameter) - Move a subtask back to top-level (omit 'parent' parameter)

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`task\` \| string \| Yes \| Task identifier of the task to move. Must be a valid task ID from the source tasklist. Obtain this from 'List Tasks' or 'Insert Task' actions. \|
\| \`parent\` \| string \| No \| New parent task identifier. If provided, the task becomes a subtask of this parent. The parent must exist in the destination list (or source list if no destinationTasklist is specified). Omit to move task to top level. \|
\| \`previous\` \| string \| No \| New previous sibling task identifier. The task will be positioned immediately after this sibling. Omit to position the task first among its siblings. Must exist in the same list as the task's destination (destinationTasklist if specified, otherwise source tasklist). Cross-list sibling references are unsupported. \|
\| \`tasklist\` \| string \| Yes \| Source task list identifier where the task currently exists. Use '@default' for the user's primary task list, or provide a specific task list ID obtained from 'List Task Lists'. The task must exist in this list. \|
\| \`destinationTasklist\` \| string \| No \| Destination task list identifier. If set, the task is moved from the source tasklist to this list. Omit to reorder within the same list. Note: Recurrent tasks cannot be moved between lists. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Trash thread

\*\*Slug:\*\* \`GOOGLESUPER\_MOVE\_THREAD\_TO\_TRASH\`

Moves the specified thread to the trash. Any messages that belong to the thread are also moved to the trash.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address. The special value 'me' can be used to indicate the authenticated user. \|
\| \`thread\_id\` \| string \| Yes \| Required. The ID of the thread to trash. This moves all messages in the thread to trash. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Move to Trash

\*\*Slug:\*\* \`GOOGLESUPER\_MOVE\_TO\_TRASH\`

Moves an existing, non-deleted email message to the trash for the specified user. Trashed messages are recoverable and still count toward storage quota until purged. Prefer this over GMAIL\_BATCH\_DELETE\_MESSAGES when recovery may be needed. For bulk operations, use GMAIL\_BATCH\_MODIFY\_MESSAGES or GMAIL\_BATCH\_DELETE\_MESSAGES instead of repeated calls to this tool.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| User's email address or 'me' for the authenticated user. \|
\| \`message\_id\` \| string \| Yes \| Required. The unique identifier of the email message to move to trash. This is a hexadecimal string that can be obtained from listing or fetching emails. Verify the correct message via subject/snippet before trashing to avoid affecting unrelated conversations. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Ad Group Ads

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_AD\_GROUP\_ADS\`

Create, update, or remove ads in Google Ads ad groups, including responsive search ads. Use this after creating campaigns, budgets, ad groups, and keywords so the ad group has creative that can serve.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| AdGroupAd operations. For responsive search ads, create payloads usually include ad\_group, status, and ad.responsive\_search\_ad with headlines/descriptions, plus ad.final\_urls. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Ad Group Assets

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_AD\_GROUP\_ASSETS\`

Create, update, or remove links between assets and ad groups. Use this after creating assets to attach sitelinks, callouts, snippets, images, and other asset types at ad group level.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| AdGroupAsset operations for linking assets to ad groups. Create payloads commonly include ad\_group, asset, field\_type, and status. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Ad Group Bid Modifiers

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_AD\_GROUP\_BID\_MODIFIERS\`

Create, update, or remove ad group bid modifiers, such as device bid adjustments or hotel-specific bid modifier criteria.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| AdGroupBidModifier operations. Common create fields include ad\_group, bid\_modifier, and exactly one criterion such as device or hotel-specific bid modifier criteria. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Ad Group Criteria

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_AD\_GROUP\_CRITERIA\`

Create, update, or remove criteria attached to a Google Ads ad group in a single batch request. Supports keywords (positive and negative), audience targeting (user lists, custom audiences, combined audiences, in-market/affinity), demographics (age range, gender, parental status, income range), placements (websites, mobile apps, YouTube channels/videos), topics, webpages (for Dynamic Search Ads), and listing groups (for Shopping). Use this to programmatically manage keyword bids and match types, build audience targeting, or prune underperforming criteria. Remove operations are irreversible — deleted criteria cannot be recovered. For testing, set validate\_only=true to dry-run without committing changes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| List of ad group criterion operations to apply atomically (unless partial\_failure=true). Each operation MUST contain exactly one of: create, update, or remove. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, the request is validated but no changes are applied. Useful for dry runs. Mutually exclusive with partial\_failure (cannot both be true). \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when others in the batch fail. Errors are returned in partial\_failure\_error. If false, the entire batch is atomic — any failure rolls back all changes. \|
\| \`response\_content\_type\` \| string ("UNSPECIFIED" \| "RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of the mutated resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Ad Groups

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_AD\_GROUPS\`

Create, update, or remove ad groups within Google Ads campaigns. Supports batch operations with multiple ad group changes in a single request. Use when you need to manage ad groups programmatically, such as creating new ad groups for campaigns, updating ad group settings or status, or removing ad groups that are no longer needed. This action is irreversible for remove operations — deleted ad groups cannot be recovered once removed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| List of ad group operations (create, update, or remove). At least one operation is required. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without executing. Useful for testing before making actual changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even if other operations fail. Defaults to false. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Assets

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_ASSETS\`

Create or update supported Google Ads assets such as sitelinks, structured snippets, text assets, lead forms, promotions, calls, price assets, and media assets. Use Create Callout Asset for validated immutable callouts. Google Ads does not allow removing assets; cleanup removes their resource associations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| Asset operations. Supported asset payloads include text\_asset, callout\_asset, structured\_snippet\_asset, sitelink\_asset, lead\_form\_asset, promotion\_asset, call\_asset, price\_asset, youtube\_video\_asset, media\_bundle\_asset, and other Google Ads Asset fields. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Bidding Strategies

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_BIDDING\_STRATEGIES\`

Create, update, or remove portfolio bidding strategies such as Target CPA, Target ROAS, Target Spend, Maximize Conversions, Maximize Conversion Value, and Target Impression Share.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| BiddingStrategy operations. Create payloads include name and one bidding scheme such as target\_cpa, target\_roas, target\_spend, maximize\_conversions, maximize\_conversion\_value, or target\_impression\_share. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Campaign Assets

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_CAMPAIGN\_ASSETS\`

Create, update, or remove links between assets and campaigns. Use this after creating assets to attach sitelinks, callouts, snippets, and other asset types at campaign level.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| CampaignAsset operations for linking assets to campaigns. Create payloads commonly include campaign, asset, field\_type, and status. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Campaign Budgets

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_CAMPAIGN\_BUDGETS\`

Create, update, or remove Google Ads campaign budgets. Use this before creating campaigns because campaign creation requires an existing campaign\_budget resource name.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| CampaignBudget operations. Common create/update fields include name, amount\_micros, total\_amount\_micros, delivery\_method, explicitly\_shared, period, type, and resource\_name for updates. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Campaign Criteria

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_CAMPAIGN\_CRITERIA\`

Create, update, or remove campaign-level targeting criteria such as locations, languages, campaign-level negative keywords, devices, schedules, audiences, and IP exclusions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| CampaignCriterion operations for campaign-level targeting or exclusions. Common create fields include campaign, negative, status, bid\_modifier, and exactly one criterion field such as location, language, keyword, device, ad\_schedule, or ip\_block. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Campaign Labels

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_CAMPAIGN\_LABELS\`

Create or remove relationships between campaigns and labels. Use this after creating labels to organize campaigns for filtering and reporting.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| CampaignLabel operations. Create payloads include campaign and label resource names. Remove uses customers/{customer\_id}/campaignLabels/{campaign\_id}~{label\_id}. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Campaigns

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_CAMPAIGNS\`

Create, update, or remove Google Ads campaigns in batch. Supports multiple operations (create, update, remove) in a single request. Use when managing campaign lifecycle, applying bulk changes, or automating campaign management workflows. This action is irreversible for remove operations — deleted campaigns cannot be recovered. Plan accordingly and consider using validate\_only=true to test changes before applying them.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| List of campaign operations to perform. Each operation can be create, update, or remove. At least one operation is required. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without executing. Useful for testing before making actual changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even if others fail. Partial failures will be reported in the response. \|
\| \`response\_content\_type\` \| string \| No \| Whether to return full resource or just resource name. Options: 'RESOURCE\_NAME\_ONLY' or 'MUTABLE\_RESOURCE'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Campaigns V2

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_CAMPAIGNS\_V2\`

Create, update, or remove Google Ads campaigns in batch. Supports multiple operations (create, update, remove) in a single request. Use when managing campaign lifecycle, applying bulk changes, or automating campaign management workflows. This action is irreversible for remove operations — deleted campaigns cannot be recovered. Plan accordingly and consider using validate\_only=true to test changes before applying them.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| List of campaign operations to perform. Each operation can be create, update, or remove. At least one operation is required. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without executing. Useful for testing before making actual changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even if others fail. Partial failures will be reported in the response. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate conditional format rules

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_CONDITIONAL\_FORMAT\_RULES\`

Add, update, delete, or reorder conditional format rules on a Google Sheet. Use when you need to create, modify, or remove conditional formatting without manually building batchUpdate requests. Supports four operations: ADD (create new rule), UPDATE (replace existing rule), DELETE (remove rule), MOVE (reorder rules by changing index).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rule\` \| object \| No \| Conditional format rule specification. \|
\| \`index\` \| integer \| No \| Zero-based index for the operation. Required for UPDATE, DELETE, MOVE. Optional for ADD (defaults to end of list). \|
\| \`sheet\_id\` \| integer \| Yes \| The unique numeric identifier of the sheet/tab to modify (NOT a zero-based index). This is a specific ID assigned by Google Sheets when the sheet is created, not the position of the sheet. You MUST first call GOOGLESHEETS\_GET\_SPREADSHEET\_INFO to retrieve the actual sheetId values from the 'sheets' array in the response. Common mistake: Do not assume sheet\_id=0 exists - while some spreadsheets may have a sheet with ID 0, many do not. \|
\| \`new\_index\` \| integer \| No \| Destination index for MOVE operation. Required when operation is MOVE. \|
\| \`operation\` \| string ("ADD" \| "UPDATE" \| "DELETE" \| "MOVE") \| Yes \| Operation type: ADD (add new rule), UPDATE (replace rule), DELETE (remove rule), MOVE (change rule order/index). \|
\| \`spreadsheet\_id\` \| string \| Yes \| The ID of the spreadsheet containing the sheet to modify. Found in the Google Sheets URL between '/d/' and '/edit'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Conversion Actions

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_CONVERSION\_ACTIONS\`

Create, update, or remove Google Ads conversion actions for conversion tracking configuration. This manages Google Ads conversion action resources; installing website/app tags remains outside this action.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| ConversionAction operations. Common fields include name, status, type, category, primary\_for\_goal, lookback windows, value\_settings, counting\_type, and attribution\_model\_settings. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Customer Assets

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_CUSTOMER\_ASSETS\`

Create or remove customer-level asset associations. Removal irreversibly removes the current association; recreate it to restore the link. Use this after creating assets to attach callouts, sitelinks, snippets, and other asset types across a Google Ads customer account.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| CustomerAsset operations for associating assets with a customer or removing existing customer-level associations. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Labels

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_LABELS\`

Create, update, or remove Google Ads labels. Pair this with campaign label mutations to organize campaigns and support filtering.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| Label operations. Common fields include name and text\_label with background\_color and description. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Portfolio Bidding Strategies

\*\*Slug:\*\* \`GOOGLESUPER\_MUTATE\_PORTFOLIO\_BIDDING\_STRATEGIES\`

Create, edit, or remove typed Target CPA and Target ROAS portfolio strategies. Attach with Mutate Campaigns, read with Get Required Google Ads Report, and transition all campaigns before removal. Budget alignment is not exposed because Google requires the bidding strategy and campaign budget to be changed atomically with GoogleAdsService.Mutate, while this action uses the resource-specific mutate endpoint. currency\_code can be set on create only for manager-account strategies.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| Typed Target CPA or Target ROAS portfolio strategy operations. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Nearby search

\*\*Slug:\*\* \`GOOGLESUPER\_NEARBY\_SEARCH\`

Searches for places (e.g., restaurants, parks) within a specified circular area, with options to filter by place types and customize the returned fields and number of results.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`radius\` \| number \| Yes \| Radius of the circular search area in meters. \|
\| \`latitude\` \| number \| Yes \| Latitude coordinate of the search center in decimal degrees. \|
\| \`fieldMask\` \| string \| No \| Comma-separated list of place fields for the response. Fields are automatically prefixed with 'places.' if missing. Common fields: displayName, formattedAddress, id, types, rating, userRatingCount, location, businessStatus, regularOpeningHours, photos, reviews. Use '\*' for all fields (not recommended for production). Valid field names include: displayName, formattedAddress, shortFormattedAddress, id, types, primaryType, primaryTypeDisplayName, location, viewport, plusCode, rating, userRatingCount, reviews, regularOpeningHours, currentOpeningHours, photos, websiteUri, googleMapsUri, businessStatus, priceLevel, priceRange, addressComponents, utcOffsetMinutes, internationalPhoneNumber, nationalPhoneNumber, editorialSummary, accessibilityOptions, parkingOptions, paymentOptions, delivery, dineIn, takeout, reservable, servesBreakfast, servesLunch, servesDinner, servesBeer, servesWine, allowsDogs, outdoorSeating, liveMusic, goodForChildren, goodForGroups. \|
\| \`longitude\` \| number \| Yes \| Longitude coordinate of the search center in decimal degrees. \|
\| \`excludedTypes\` \| array \| No \| List of place types to exclude from Table A. Results matching any of these types are omitted. Up to 50 types allowed. Must be provided as a list, e.g., \['cafe'\] for a single type or \['cafe', 'store'\] for multiple types. Must use valid Table A types only. \|
\| \`includedTypes\` \| array \| No \| List of place types to include from Table A. Results will match at least one of these types. Up to 50 types allowed. Must be provided as a list, e.g., \['restaurant'\] for a single type or \['atm', 'bank'\] for multiple types. Common types: restaurant, cafe, bank, atm, hospital, pharmacy, school, park, gym, hotel, airport, gas\_station. IMPORTANT: 'food' is NOT a valid type (it's in Table B); use specific types like restaurant, cafe, bakery, fast\_food\_restaurant instead. Note: 'locality' is valid, but 'city', 'town', 'sublocality', 'landmark', and 'point\_of\_interest' are NOT valid for filtering. \|
\| \`maxResultCount\` \| integer \| No \| Maximum number of search results to return. Valid range: 1-20. The actual count may be lower based on available places. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Export or download a file

\*\*Slug:\*\* \`GOOGLESUPER\_PARSE\_FILE\`

DEPRECATED: Exports Google Workspace files (max 10MB) to a specified format using \`mime\_type\`, or downloads other file types; use \`GOOGLEDRIVE\_DOWNLOAD\_FILE\` instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The unique ID of the file stored in Google Drive that you want to export or download. \|
\| \`mime\_type\` \| string ("application/vnd.openxmlformats-officedocument.wordprocessingml.document" \| "application/vnd.oasis.opendocument.text" \| "application/rtf" \| "application/pdf" \| "text/plain" \| "application/zip" \| "application/epub+zip" \| "text/markdown" \| "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" \| "application/vnd.oasis.opendocument.spreadsheet" \| "text/csv" \| "text/tab-separated-values" \| "application/vnd.openxmlformats-officedocument.presentationml.presentation" \| "application/vnd.oasis.opendocument.presentation" \| "image/jpeg" \| "image/png" \| "image/svg+xml" \| "application/vnd.google-apps.script+json" \| "video/mp4") \| No \| Target MIME type for exporting Google Workspace files only. Supported exports by source type: Google Docs -> DOCX, ODT, RTF, PDF, TXT, ZIP (HTML), EPUB, MD; Google Sheets -> XLSX, ODS, PDF, ZIP (HTML), CSV, TSV; Google Slides -> PPTX, ODP, PDF, TXT, JPG, PNG, SVG; Google Drawings -> PDF, JPG, PNG, SVG; Apps Script -> JSON. If omitted, a default format is used: Docs->PDF, Sheets->XLSX, Slides->PDF, Drawings->PDF. For non-Workspace files (PDFs, images, text files, etc.), this parameter is ignored and the file is downloaded in its native format. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Patch Calendar

\*\*Slug:\*\* \`GOOGLESUPER\_PATCH\_CALENDAR\`

Partially updates (PATCHes) an existing Google Calendar, modifying only the fields provided. At least one of summary, description, location, or timezone must be provided. Empty strings for \`description\` or \`location\` clear them.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`summary\` \| string \| No \| New title for the calendar; cannot be an empty string when provided. At least one of summary, description, location, or timezone must be provided. \|
\| \`location\` \| string \| No \| New geographic location of the calendar (e.g., 'Paris, France'). \|
\| \`timezone\` \| string \| No \| New IANA Time Zone Database name for the calendar (e.g., 'Europe/Zurich', 'America/New\_York'). Calendars duplicated via GOOGLECALENDAR\_DUPLICATE\_CALENDAR may default to UTC; set the correct timezone explicitly after duplication. \|
\| \`calendar\_id\` \| string \| Yes \| The unique identifier of the Google Calendar to update. Use 'primary' for the main calendar, or a calendar's unique ID (typically in email format like 'abc123@group.calendar.google.com'). IMPORTANT: This is NOT the calendar's display name/title - use GOOGLECALENDAR\_LIST\_CALENDARS to find the 'id' field for a calendar. \|
\| \`description\` \| string \| No \| New description for the calendar. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Patch Event

\*\*Slug:\*\* \`GOOGLESUPER\_PATCH\_EVENT\`

Update specified fields of an existing event in a Google Calendar using patch semantics (array fields like \`attendees\` are fully replaced if provided); ensure the \`calendar\_id\` and \`event\_id\` are valid and the user has write access to the calendar.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`source\` \| object \| No \| Input model for event source. \|
\| \`status\` \| string ("confirmed" \| "tentative" \| "cancelled") \| No \| Status of the event. \|
\| \`summary\` \| string \| No \| New title for the event. \|
\| \`color\_id\` \| string \| No \| Color ID for the event (1-11). Use GOOGLECALENDAR\_COLORS\_GET to retrieve available colors. \|
\| \`end\_time\` \| string \| No \| New end time (RFC3339 timestamp, e.g., '2024-07-01T11:00:00-07:00'). Uses \`timezone\` if provided, otherwise UTC. For all-day events, use YYYY-MM-DD format (exclusive end date). Optional when updating start\_time - the original event duration will be preserved if end\_time is not specified. Must be strictly after \`start\_time\`; mismatched or mixed formats cause HTTP 400 \`timeRangeEmpty\`. \|
\| \`event\_id\` \| string \| Yes \| The unique technical identifier of the event to update. IMPORTANT: This is NOT the event title/name. Event IDs are opaque strings typically base32hex encoded (5-1024 characters using lowercase a-v and digits 0-9). For recurring event instances, the ID format is 'baseEventId\_YYYYMMDDTHHMMSSZ' with an underscore separator (e.g., 'abc123def456\_20260115T100000Z'). To get an event ID, first use GOOGLECALENDAR\_FIND\_EVENT or GOOGLECALENDAR\_EVENTS\_LIST to search for events and retrieve their IDs. Use master event ID to update the entire recurring series; use instance ID to update only that occurrence — confirm scope before patching. \|
\| \`location\` \| string \| No \| New geographic location (physical address or virtual meeting link). \|
\| \`sequence\` \| integer \| No \| Sequence number as per iCalendar specification. Incremented on each event update. \|
\| \`timezone\` \| string \| No \| IANA Time Zone Database name for start/end times (e.g., 'America/Los\_Angeles'). Used if \`start\_time\` and \`end\_time\` are provided and not all-day dates; defaults to UTC if unset. Mismatched or missing timezone with offset timestamps silently shifts event to unintended wall-clock time. \|
\| \`attendees\` \| array \| No \| List of valid email addresses for attendees (e.g., 'user@example.com'). Replaces existing attendees. Provide an empty list to remove all. \|
\| \`reminders\` \| object \| No \| Input model for reminders. \|
\| \`recurrence\` \| array \| No \| RRULE, EXRULE, RDATE and EXDATE lines per RFC5545 for recurring events. Replaces existing recurrence rules if provided. \|
\| \`start\_time\` \| string \| No \| New start time (RFC3339 timestamp, e.g., '2024-07-01T10:00:00-07:00'). Uses \`timezone\` if provided, otherwise UTC. For all-day events, use YYYY-MM-DD format. When only start\_time is provided without end\_time, the event's original duration is preserved automatically. \|
\| \`visibility\` \| string ("default" \| "public" \| "private" \| "confidential") \| No \| Visibility of the event. \|
\| \`attachments\` \| array \| No \| File attachments (max 25). Each with 'fileUrl' (required) and optional 'title', 'mimeType'. Requires supportsAttachments=true. \|
\| \`calendar\_id\` \| string \| Yes \| Identifier of the calendar. Use 'primary' for the primary calendar of the logged-in user. To find other calendar IDs, use the \`calendarList.list\` method. Must be provided in snake\_case format. \|
\| \`description\` \| string \| No \| New description for the event; can include HTML. \|
\| \`send\_updates\` \| string ("all" \| "externalOnly" \| "none") \| No \| Whether to send update notifications to attendees. Uses default user behavior if unspecified. Set explicitly to avoid unintended notifications when removing attendees or making bulk updates. \|
\| \`transparency\` \| string ("opaque" \| "transparent") \| No \| Whether the event blocks time on the calendar. 'opaque' (default) blocks time, 'transparent' does not. \|
\| \`max\_attendees\` \| integer \| No \| Maximum attendees in response; does not affect invited count. If more, response includes organizer only. Must be positive. \|
\| \`rsvp\_response\` \| string ("needsAction" \| "declined" \| "tentative" \| "accepted") \| No \| RSVP response status for the authenticated user. Updates only the current user's response status without affecting other attendees. Note: RSVP is only supported for regular calendar events (eventType='default'); attempting to RSVP to focusTime, outOfOffice, birthday, or workingLocation events will result in an error. \|
\| \`conference\_data\` \| object \| No \| Input model for conference data. \|
\| \`attendees\_omitted\` \| boolean \| No \| Whether attendees may have been omitted from the event's representation. \|
\| \`guests\_can\_modify\` \| boolean \| No \| Whether attendees other than the organizer can modify the event (default: false). \|
\| \`anyone\_can\_add\_self\` \| boolean \| No \| Whether anyone can invite themselves to the event (default: false). \|
\| \`extended\_properties\` \| object \| No \| Input model for extended properties. \|
\| \`supports\_attachments\` \| boolean \| No \| Client application supports event attachments. Set to \`True\` if so. \|
\| \`focus\_time\_properties\` \| object \| No \| Input model for focus time properties. \|
\| \`conference\_data\_version\` \| integer \| No \| API client's conference data support version. Set to 1 to manage conference details (e.g., Google Meet links); 0 (default) ignores conference data. Setting to 1 enables reading/preserving conference data but does not generate a new Meet link — use GOOGLECALENDAR\_UPDATE\_EVENT with \`create\_meeting\_room=true\` to create one. \|
\| \`guests\_can\_invite\_others\` \| boolean \| No \| Whether attendees other than the organizer can invite others (default: true). \|
\| \`out\_of\_office\_properties\` \| object \| No \| Input model for out-of-office properties. \|
\| \`guests\_can\_see\_other\_guests\` \| boolean \| No \| Whether attendees can see who the event's attendees are (default: true). \|
\| \`working\_location\_properties\` \| object \| No \| Input model for working location properties. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Patch Label

\*\*Slug:\*\* \`GOOGLESUPER\_PATCH\_LABEL\`

Patches the specified user-created label. System labels (e.g., INBOX, SENT, SPAM) cannot be modified and will be rejected.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The ID of the label to update. \|
\| \`name\` \| string \| No \| The display name of the label. At least one of 'name', 'messageListVisibility', 'labelListVisibility', or 'color' must be provided. Must be non-empty, unique among user labels, and must not contain \`,\`, \`/\`, or \`.\`. \|
\| \`color\` \| object \| No \| The color to assign to the label. Color is only available for labels that have their \`type\` set to \`user\`. At least one of 'name', 'messageListVisibility', 'labelListVisibility', or 'color' must be provided. Must include both \`backgroundColor\` and \`textColor\` subfields; both values must come from Gmail's predefined color palette — arbitrary hex values or omitting either field causes a 400 error. \|
\| \`userId\` \| string \| Yes \| The user's email address. The special value \`me\` can be used to indicate the authenticated user. \|
\| \`labelListVisibility\` \| string ("labelShow" \| "labelShowIfUnread" \| "labelHide") \| No \| The visibility of the label in the label list in the Gmail web interface. At least one of 'name', 'messageListVisibility', 'labelListVisibility', or 'color' must be provided. \|
\| \`messageListVisibility\` \| string ("show" \| "hide") \| No \| The visibility of messages with this label in the message list in the Gmail web interface. At least one of 'name', 'messageListVisibility', 'labelListVisibility', or 'color' must be provided. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Patch Permission

\*\*Slug:\*\* \`GOOGLESUPER\_PATCH\_PERMISSION\`

Tool to update a permission using patch semantics. Use when you need to modify specific fields of an existing permission without affecting other fields. \*\*Warning:\*\* Concurrent permissions operations on the same file are not supported; only the last update is applied.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`role\` \| string ("owner" \| "organizer" \| "fileOrganizer" \| "writer" \| "reader") \| No \| Permission roles that can be granted in Google Drive. \|
\| \`file\_id\` \| string \| Yes \| The ID for the file or shared drive. \|
\| \`with\_link\` \| boolean \| No \| Whether the link is required for this permission. Set to true for 'anyone with the link' access (not publicly discoverable), or false for publicly discoverable access. \|
\| \`permission\_id\` \| string \| Yes \| The ID for the permission. Use 'anyone' for public link permissions, or specific permission IDs for user/group/domain permissions. You can get permission IDs by calling GOOGLEDRIVE\_LIST\_PERMISSIONS. \|
\| \`expiration\_date\` \| string \| No \| The time at which this permission will expire (RFC 3339 date-time). Can only be set on user and group permissions. The date must be in the future and cannot be more than a year in the future. \|
\| \`additional\_roles\` \| array \| No \| Additional roles for this user. Only 'commenter' is currently allowed. \|
\| \`remove\_expiration\` \| boolean \| No \| Whether to remove the expiration date. Set to true to make the permission permanent. \|
\| \`transfer\_ownership\` \| boolean \| No \| Whether changing a role to 'owner' downgrades the current owners to writers. Does nothing if the specified role is not 'owner'. Required as an acknowledgement when transferring ownership. \|
\| \`supports\_all\_drives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. \|
\| \`use\_domain\_admin\_access\` \| boolean \| No \| Issue the request as a domain administrator; if set to true, then the requester will be granted access if the file ID parameter refers to a shared drive and the requester is an administrator of the domain to which the shared drive belongs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Patch Property (v2 API)

\*\*Slug:\*\* \`GOOGLESUPER\_PATCH\_PROPERTY\`

Tool to update a property on a file using PATCH semantics (v2 API). Use when you need to partially update custom key-value metadata attached to a Google Drive file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`value\` \| string \| No \| The value of this property. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format values. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`fileId\` \| string \| Yes \| The ID of the file. \|
\| \`callback\` \| string \| No \| JSONP callback function name. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`visibility\` \| string ("PRIVATE" \| "PUBLIC") \| No \| Property visibility values. \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`propertyKey\` \| string \| Yes \| The key of the property to update. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Patch send-as alias

\*\*Slug:\*\* \`GOOGLESUPER\_PATCH\_SEND\_AS\`

Tool to patch the specified send-as alias for a Gmail user. Use when you need to update properties of an existing send-as email address such as display name, reply-to address, signature, default status, or SMTP configuration.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address or the special value 'me' to indicate the authenticated user. \|
\| \`smtp\_msa\` \| object \| No \| Configuration for SMTP relay service. \|
\| \`signature\` \| string \| No \| An optional HTML signature that is included in messages composed with this alias in the Gmail web UI. This signature is added to new emails only. \|
\| \`is\_default\` \| boolean \| No \| Whether this address is selected as the default 'From:' address in situations such as composing a new message or sending a vacation auto-reply. Setting this to true will make other send-as addresses non-default. Only true can be written to this field. \|
\| \`display\_name\` \| string \| No \| A name that appears in the 'From:' header for mail sent using this alias. For custom 'from' addresses, when empty, Gmail will populate the 'From:' header with the name used for the primary address. If the admin has disabled name updates, requests to update this field for the primary login will silently fail. \|
\| \`send\_as\_email\` \| string \| Yes \| The send-as alias email address to update. This is the email address that appears in the 'From:' header. \|
\| \`treat\_as\_alias\` \| boolean \| No \| Whether Gmail should treat this address as an alias for the user's primary email address. This setting only applies to custom 'from' aliases. \|
\| \`reply\_to\_address\` \| string \| No \| An optional email address that is included in a 'Reply-To:' header for mail sent using this alias. If empty, Gmail will not generate a 'Reply-To:' header. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Patch Task

\*\*Slug:\*\* \`GOOGLESUPER\_PATCH\_TASK\`

Partially updates an existing task (identified by \`task\_id\`) within a specific Google Task list (identified by \`tasklist\_id\`), modifying only the provided attributes from \`TaskInput\` (e.g., \`title\`, \`notes\`, \`due\` date, \`status\`) and requiring both the task and list to exist.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| No \| Unique identifier for the task. Generated by Google Tasks API when creating a task. Used for updating or deleting existing tasks. \|
\| \`due\` \| string \| No \| Due date for the task (optional). NOTE: Google Tasks only stores the date portion (YYYY-MM-DD) - any time component provided will be automatically stripped before sending to the API. Accepts RFC3339 format (e.g., '2025-09-28T23:59:00Z') or various human-readable formats like '28 Sep 2025', '11:59 PM, 22 Sep 2025'. Normalized to midnight UTC — naive local dates without timezone offset may shift ±1 day. Time-based reminders are not supported via this field. \|
\| \`etag\` \| string \| No \| ETag of the resource for concurrency control. Prevents accidental overwrites when multiple clients modify the same task. Auto-generated by the API. \|
\| \`notes\` \| string \| No \| Additional details or description for the task. Supports plain text only (no HTML/markdown). Maximum 8192 characters. Example: 'Include Q3 sales data and projections' \|
\| \`title\` \| string \| No \| Title/name of the task. This is the main text displayed for the task. Maximum 1024 characters. Example: 'Complete quarterly report' \|
\| \`hidden\` \| boolean \| No \| Whether the task is hidden from the default view. Hidden tasks can still be accessed via API but won't show in UI. Default: false \|
\| \`status\` \| string ("needsAction" \| "completed") \| No \| Current status of the task. Must be either 'needsAction' (task is pending) or 'completed' (task is done). \|
\| \`deleted\` \| boolean \| No \| Whether the task has been deleted. Deleted tasks are marked but not immediately removed, allowing for recovery. Default: false \|
\| \`task\_id\` \| string \| Yes \| Identifier of the Google Task to be updated within the specified task list. \|
\| \`completed\` \| string \| No \| Date/time when the task was marked as completed. Only applicable when status='completed'. Unlike 'due', this field preserves the time component. Accepts RFC3339 format or human-readable date formats. Malformed or non-RFC3339 values will be rejected. \|
\| \`tasklist\_id\` \| string \| Yes \| Identifier of the Google Task list that contains the task to be updated. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Patch task list

\*\*Slug:\*\* \`GOOGLESUPER\_PATCH\_TASK\_LIST\`

Updates the title of an existing Google Tasks task list.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tasklist\_id\` \| string \| Yes \| The unique identifier of the task list to be updated. \|
\| \`updated\_title\` \| string \| No \| The new title for the task list. Optional for PATCH semantics - only include if you want to update the title. Maximum length: 1024 characters. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Place Photo

\*\*Slug:\*\* \`GOOGLESUPER\_PLACE\_PHOTO\`

Retrieves high quality photographic content from the Google Maps Places database. Use when you need to download a place photo using a photo\_reference obtained from Place Details, Nearby Search, or Text Search requests. Images are scaled proportionally to fit within specified dimensions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`maxwidth\` \| integer \| No \| Maximum desired width of the image in pixels (1-1600). Image will be scaled proportionally. You must specify either maxwidth, maxheight, or both. \|
\| \`maxheight\` \| integer \| No \| Maximum desired height of the image in pixels (1-1600). Image will be scaled proportionally. You must specify either maxwidth, maxheight, or both. \|
\| \`photo\_reference\` \| string \| Yes \| A string identifier that uniquely identifies a photo. Can be either: (1) A full photo resource name in format 'places/{place\_id}/photos/{photo}' from the new Places API, or (2) Just the photo reference string from legacy API. Obtained from Place Details, Nearby Search, or Text Search requests. Note: Photo references cannot be cached and may expire over time. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Presentation (Batch/Markdown)

\*\*Slug:\*\* \`GOOGLESUPER\_PRESENTATIONS\_BATCH\_UPDATE\`

Update Google Slides presentations using markdown content or raw API text. Supports professional themes, auto-formatting, and multiple slide types (title, bullet, table, quote, image, two-column).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`requests\` \| array \| No \| List of update requests, each a dict with one of these valid Slides API request types: \*\*Common requests:\*\* createSlide, createShape, createTable, createImage, insertText, updateTextStyle, updateShapeProperties, updatePageProperties, updateParagraphStyle, deleteObject, updateTableCellProperties, updateTableColumnProperties, replaceAllText \*\*IMPORTANT:\*\* To update slide backgrounds, use \`updatePageProperties\` (NOT \`updateSlideProperties\`). The field \`pageBackgroundFill\` exists in PageProperties, not SlideProperties. Required if markdown\_text is not provided. \|
\| \`writeControl\` \| object \| No \| Options that control how write requests are executed. \|
\| \`markdown\_text\` \| string \| No \| Markdown content to add as new slides to an existing presentation. Separate slides with '\\n---\\n'. Each slide auto-detects its type from content. Slide types: title ('# Title\\nSubtitle'), bullets ('-'/'+'/'\*'), tables (markdown tables), quotes ('> text'), images ('!\[alt\](URL)'), two-column ('\|\|\|' separator), plain text. Add 'Theme: ' as the first line to apply a theme. Available themes: default, corporate\_blue, modern\_dark, professional\_gray, creative\_purple, warm\_orange, forest\_green, minimal\_beige. Font sizes auto-scale based on content length (28pt down to 8pt). Supports \*\*bold\*\*, emoji, and auto-centering of tables. Images must be publicly accessible URLs (PNG/JPEG/GIF, <50MB). \|
\| \`presentationId\` \| string \| Yes \| The ID of the presentation to apply the updates to. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Copy Google Slides from Template

\*\*Slug:\*\* \`GOOGLESUPER\_PRESENTATIONS\_COPY\_FROM\_TEMPLATE\`

Tool to create a new Google Slides presentation by duplicating an existing template deck via Drive file copy. Use when you need to preserve themes, masters, and layouts exactly as they appear in the template. After copying, use GOOGLESLIDES\_PRESENTATIONS\_BATCH\_UPDATE to replace placeholder text or images.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`new\_title\` \| string \| No \| The name/title for the copied presentation. If omitted, a default name like 'Copy of \[original\]' is used. \|
\| \`parent\_folder\_id\` \| string \| No \| The ID of the destination folder in Google Drive. If provided, the copied presentation will be placed in this folder. If omitted, the copy is placed in the user's root folder. \|
\| \`template\_presentation\_id\` \| string \| Yes \| The Drive file ID of the Slides template to copy. This is the presentationId of the existing deck you want to duplicate. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Presentation

\*\*Slug:\*\* \`GOOGLESUPER\_PRESENTATIONS\_GET\`

Tool to retrieve the latest version of a presentation. Use after obtaining the presentation ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Comma-separated selector specifying which fields to include in a partial response. Nested fields use parentheses that must be properly balanced. Top-level fields: presentationId, title, locale, revisionId, pageSize, slides, masters, layouts, notesMaster. For slides/masters/layouts, valid Page fields: objectId, pageType, pageElements, pageProperties, revisionId. For pageElements, valid fields: objectId, size, transform, title, description, shape, image, video, line, table, wordArt, elementGroup, sheetsChart, speakerSpotlight. For shape, valid fields: shapeType, text, shapeProperties, placeholder. Note: 'autofit' is under shapeProperties, not directly under shape. Use shape(shapeProperties(autofit)), not shape(autofit). Examples: 'presentationId,title', 'slides(objectId,pageElements(objectId,size))', 'slides(objectId,pageElements(objectId,shape(shapeType,text,shapeProperties(autofit))))' \|
\| \`presentationId\` \| string \| No \| The ID of the presentation to retrieve. Either presentation\_id or presentation\_name must be provided. \|
\| \`presentationName\` \| string \| No \| The name of the presentation to search for and retrieve. If provided, the action will search Google Drive for a presentation with this name. Either presentation\_id or presentation\_name must be provided. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Presentation Page

\*\*Slug:\*\* \`GOOGLESUPER\_PRESENTATIONS\_PAGES\_GET\`

Tool to get the latest version of a specific page in a presentation. Use when you need to inspect slide, layout, master, or notes page details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageObjectId\` \| string \| Yes \| The object ID of the page to retrieve. \|
\| \`presentationId\` \| string \| Yes \| The ID of the presentation from which to fetch the page. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Page Thumbnail (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_PRESENTATIONS\_PAGES\_GET\_THUMBNAIL\`

DEPRECATED: Use GOOGLESLIDES\_GET\_PAGE\_THUMBNAIL2 instead. Tool to generate and return a thumbnail image URL for a specific page. Use when you need a quick preview of a slide page after loading it.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageObjectId\` \| string \| Yes \| The object ID of the page whose thumbnail to retrieve. \|
\| \`presentationId\` \| string \| Yes \| The ID of the presentation containing the page. \|
\| \`thumbnailProperties.mimeType\` \| string \| No \| Optional thumbnail image MIME type. Currently only 'PNG' is supported by the API. Defaults to 'PNG' if omitted. \|
\| \`thumbnailProperties.thumbnailSize\` \| string ("THUMBNAIL\_SIZE\_UNSPECIFIED" \| "LARGE" \| "MEDIUM" \| "SMALL") \| No \| Optional thumbnail size. One of 'LARGE', 'MEDIUM', 'SMALL', or 'THUMBNAIL\_SIZE\_UNSPECIFIED'. Defaults to 'LARGE' if omitted. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Provision Account Ticket

\*\*Slug:\*\* \`GOOGLESUPER\_PROVISION\_ACCOUNT\_TICKET\`

Tool to request a ticket for creating a Google Analytics account. Use when you need to initiate the account creation flow that requires user acceptance of Terms of Service.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`account\` \| object \| Yes \| Required. Account details including display name and region code. \|
\| \`redirectUri\` \| string \| Yes \| Required. Redirect URI where the user will be sent after accepting Terms of Service. Must be configured in Cloud Console as a Redirect URI. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Query Audience Export

\*\*Slug:\*\* \`GOOGLESUPER\_QUERY\_AUDIENCE\_EXPORT\`

Tool to query a completed audience export. Use when you need to fetch user rows with pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. Resource name of the audience export. Format: properties/{property}/audienceExports/{audienceExport}, where {property} and {audienceExport} must be integers. \|
\| \`limit\` \| integer \| No \| Optional. Number of rows to return. Must be between 1 and 250000. Defaults to 10000. \|
\| \`offset\` \| integer \| No \| Optional. Zero-based start row index for pagination. Defaults to 0. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Query Audience List

\*\*Slug:\*\* \`GOOGLESUPER\_QUERY\_AUDIENCE\_LIST\`

Tool to query an audience list. Use when you need to retrieve user rows from a GA4 audience list with pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. Audience list resource to query. Format: properties/{property}/audienceLists/{audienceList}. \|
\| \`limit\` \| integer \| No \| Optional. Number of rows to return; default 10,000; maximum 250,000. \|
\| \`offset\` \| integer \| No \| Optional. Zero-based row offset for pagination. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Query Report Task

\*\*Slug:\*\* \`GOOGLESUPER\_QUERY\_REPORT\_TASK\`

Tool to retrieve a report task's content. Use this after creating a report task with CreateReportTask and confirming it is in ACTIVE state. This method returns an error if the report task's state is not ACTIVE.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. Report task name in format 'properties/{propertyId}/reportTasks/{reportTaskId}'. The report task must be in ACTIVE state. \|
\| \`limit\` \| integer \| No \| Optional. Number of rows to return (max 250,000). If unspecified, 10,000 rows are returned. Must be positive. Limited by the ReportTask's own limit. \|
\| \`offset\` \| integer \| No \| Optional. Row offset for pagination (0-indexed). First request omits offset or sets to 0. For subsequent pages, set to the previous limit value. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Query Spreadsheet Table

\*\*Slug:\*\* \`GOOGLESUPER\_QUERY\_TABLE\`

DEPRECATED: Use GOOGLESHEETS\_VALUES\_GET / GOOGLESHEETS\_BATCH\_GET for table reads and GOOGLESHEETS\_LOOKUP\_SPREADSHEET\_ROW for row lookup/filter workflows. Execute SQL-like SELECT queries against Google Spreadsheet tables. Table names correspond to sheet/tab names visible at the bottom of the spreadsheet. Use GOOGLESHEETS\_LIST\_TABLES first to discover available table names if unknown. Supports WHERE conditions, ORDER BY, LIMIT clauses.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sql\` \| string \| Yes \| SQL SELECT query. The table name is the Google Sheets tab/sheet name (visible at the bottom of the spreadsheet). Use GOOGLESHEETS\_LIST\_TABLES to discover available table names if unknown. Supported: SELECT cols FROM table WHERE conditions ORDER BY col LIMIT n. Table names must be quoted with double quotes if they contain spaces or are numeric-only (e.g., SELECT \* FROM "My Sheet" or SELECT \* FROM "415"). \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of a native Google Sheets file. Found in the spreadsheet URL after /d/ (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'). Only native Google Sheets files (MIME type: application/vnd.google-apps.spreadsheet) are supported. Files uploaded to Google Drive that are not native Google Sheets (such as Excel .xlsx files, PDFs, or Google Docs) will not work even if they can be viewed in Google Sheets. \|
\| \`include\_formulas\` \| boolean \| No \| Whether to return formula text instead of calculated values for formula columns \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Quick Add Event

\*\*Slug:\*\* \`GOOGLESUPER\_QUICK\_ADD\`

Parses natural language text to quickly create a basic Google Calendar event with its title, date, and time, suitable for simple scheduling; does not support direct attendee addition or recurring events, and \`calendar\_id\` must be valid if not 'primary'.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`text\` \| string \| No \| Natural language input describing the event; Google Calendar parses this for event details like title, date, and time. \|
\| \`calendar\_id\` \| string \| No \| Identifier of the calendar for the event. Use 'primary' for the main calendar, or provide a specific calendar ID (e.g., email address). \|
\| \`send\_updates\` \| string ("all" \| "externalOnly" \| "none") \| No \| Controls whether email notifications about the event creation are sent to attendees. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove attendee from event

\*\*Slug:\*\* \`GOOGLESUPER\_REMOVE\_ATTENDEE\`

Removes an attendee from a specified event in a Google Calendar; the calendar and event must exist. Concurrent calls on the same event can overwrite attendee lists — apply changes sequentially per event.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_id\` \| string \| Yes \| Unique identifier of the event. For recurring events, target the master series ID or a specific instance ID; removing an attendee from one instance does not affect other instances in the series. \|
\| \`calendar\_id\` \| string \| No \| Identifier of the Google Calendar to which the event belongs; 'primary' signifies the user's main calendar. \|
\| \`attendee\_email\` \| string \| Yes \| Email address of the attendee to remove. Must match an attendee email present on the event. If no match is found, the attendee was already removed or was never on the event. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove label (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_REMOVE\_LABEL\`

DEPRECATED: Use GMAIL\_DELETE\_LABEL instead. Permanently deletes a specific, existing user-created Gmail label by its ID for a user; cannot delete system labels.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| User's email address or 'me' for the authenticated user. \|
\| \`label\_id\` \| string \| Yes \| ID of the user-created label to be permanently deleted; must exist and not be a system label. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Render Aerial Video

\*\*Slug:\*\* \`GOOGLESUPER\_RENDER\_AERIAL\_VIDEO\`

Starts rendering an aerial view video for a US postal address. Returns a video ID that can be used with lookupVideo to retrieve the video once rendering completes. Rendering typically takes up to a few hours.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`address\` \| string \| Yes \| US postal address for which to render aerial video. Must be a valid US address with street, city, state, and postal code. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Replace All Text in Document

\*\*Slug:\*\* \`GOOGLESUPER\_REPLACE\_ALL\_TEXT\`

Tool to replace all occurrences of a specified text string with another text string throughout a Google Document. Use when you need to perform a global find and replace operation within a document.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tab\_ids\` \| array \| No \| Optional. A list of specific tab IDs to perform the replacement on. If not provided, replacement occurs on all tabs. \|
\| \`find\_text\` \| string \| Yes \| The text to search for in the document. Cannot be empty. \|
\| \`match\_case\` \| boolean \| No \| Indicates whether the search should be case sensitive. Defaults to False (case insensitive). \|
\| \`document\_id\` \| string \| Yes \| The ID of the document to update. \|
\| \`replace\_text\` \| string \| Yes \| The text that will replace the matched text. \|
\| \`search\_by\_regex\` \| boolean \| No \| Optional. If True, the find\_text is treated as a regular expression. Defaults to False. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Replace Image in Document

\*\*Slug:\*\* \`GOOGLESUPER\_REPLACE\_IMAGE\`

Tool to replace a specific image in a document with a new image from a URI. Use when you need to update an existing image within a Google Doc.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`document\_id\` \| string \| Yes \| The ID of the document containing the image to replace. \|
\| \`replace\_image\` \| object \| Yes \| The details of the image replacement request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Reply to email thread

\*\*Slug:\*\* \`GOOGLESUPER\_REPLY\_TO\_THREAD\`

Sends a reply within a specific Gmail thread using the original thread's subject; do not provide a custom subject as it will start a new conversation instead of replying in-thread. Requires a valid \`thread\_id\` and at least one of \`recipient\_email\`, \`cc\`, or \`bcc\`. Supports optional file attachments.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cc\` \| array \| No \| Carbon Copy (CC) recipients' email addresses in format 'user@domain.com'. Each address must include both username and domain separated by '@'. At least one of cc, bcc, or recipient\_email must be provided. \|
\| \`bcc\` \| array \| No \| Blind Carbon Copy (BCC) recipients' email addresses in format 'user@domain.com'. Each address must include both username and domain separated by '@'. At least one of cc, bcc, or recipient\_email must be provided. \|
\| \`is\_html\` \| boolean \| No \| Indicates if \`message\_body\` is HTML; if True, body must be valid HTML, if False, body should not contain HTML tags. Mismatch causes recipients to see raw HTML tags as plain text. \|
\| \`user\_id\` \| string \| No \| Identifier for the user sending the reply; 'me' refers to the authenticated user. \|
\| \`thread\_id\` \| string \| Yes \| Identifier of the Gmail thread for the reply. Must be a valid hexadecimal string, typically 15-16 characters long (e.g., '169eefc8138e68ca'). Prefixes like 'msg-f:' or 'thread-f:' are automatically stripped. Note: Format validation only checks the ID structure; the thread must also exist and be accessible in your Gmail account. Use GMAIL\_LIST\_THREADS or GMAIL\_FETCH\_EMAILS to retrieve valid thread IDs. Must be a threadId, not a messageId; passing a messageId can cause the reply to fail or start an unintended new thread. \|
\| \`attachment\` \| string \| No \| File(s) to attach to the reply. Accepts a single file or a list of files. Total message size including attachments must stay under 25 MB (400 badRequest if exceeded); use Drive links for large files. \|
\| \`message\_body\` \| string \| No \| Content of the reply message, either plain text or HTML. \|
\| \`recipient\_email\` \| string \| No \| Primary recipient's email address in format 'user@domain.com'. Must include both username and domain separated by '@'. Required if cc and bcc is not provided, else can be optional. Use extra\_recipients if you want to send to multiple recipients. \|
\| \`extra\_recipients\` \| array \| No \| Additional 'To' recipients' email addresses in format 'user@domain.com' (not Cc or Bcc). Each address must include both username and domain separated by '@'. Should only be used if recipient\_email is also provided. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Resumable Upload

\*\*Slug:\*\* \`GOOGLESUPER\_RESUMABLE\_UPLOAD\`

Tool to start and complete a Google Drive resumable upload session. Use for files larger than ~5 MB to avoid timeouts or size-limit failures. HTTP 308 means continue the session from the correct byte offset; HTTP 410 means the session expired and a full restart with a new session is required.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| No \| Optional file ID if updating an existing file instead of creating a new one. \|
\| \`metadata\` \| object \| No \| JSON metadata for the Drive File resource (e.g., {'name': 'photo.jpg', 'parents': \['folderId'\]}). To convert to a Google Docs MIME type, set metadata.mimeType to the target Docs type but send the real file MIME type as the upload content type — using the Docs MIME type as upload content type causes invalidContentType errors. \|
\| \`chunkSize\` \| integer \| No \| Chunk size in bytes; must be a multiple of 256 KB. \|
\| \`queryParams\` \| object \| No \| Optional Drive query parameters. \|
\| \`file\_to\_upload\` \| object \| Yes \| File to upload to Google Drive via resumable upload. \|
\| \`folder\_to\_upload\_to\` \| string \| No \| Optional folder ID where NEW files should be uploaded. Only used during file creation, not updates. Will be added to metadata.parents. Must reference a valid, non-trashed folder ID; invalid or trashed IDs silently place files at root. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Run Funnel Report

\*\*Slug:\*\* \`GOOGLESUPER\_RUN\_FUNNEL\_REPORT\`

Tool to run a GA4 funnel report. Use when you need a customized funnel analysis report for a given property. Funnel step sequence is determined by step attributes in the response, not row order.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of rows to return. Default 10000; max 250000. \|
\| \`funnel\` \| object \| Yes \| Funnel configuration object. Must include a 'steps' key with at least one step. Each step requires a 'name' and optionally a 'filterExpression'. Use 'funnelEventFilter' for event filters and 'funnelFieldFilter' for field filters. Filter expressions with 'fieldName' + 'stringFilter' are auto-wrapped in 'funnelFieldFilter'. Example: {"steps": \[{"name": "First visit", "filterExpression": {"funnelEventFilter": {"eventName": "first\_visit"}}}\]} \|
\| \`property\` \| string \| Yes \| GA4 property resource name, format: properties/{property\_id}. \|
\| \`segments\` \| array \| No \| Up to 4 segments; each yields its own row in the report. \|
\| \`dateRanges\` \| array \| No \| List of date ranges to read; overlapping ranges duplicate days across ranges. \|
\| \`dimensionFilter\` \| object \| No \| Dimension-only filter expression. \|
\| \`funnelBreakdown\` \| object \| No \| Breakdown dimension configuration for the funnel table sub-report. The 'breakdownDimension' is a GA4 Dimension object whose field is 'name' (NOT 'dimensionName'). Example: {"breakdownDimension": {"name": "deviceCategory"}, "limit": "5"}. \|
\| \`funnelNextAction\` \| object \| No \| Next-action dimension configuration for the funnel visualization sub-report. The 'nextActionDimension' is a GA4 Dimension object whose field is 'name' (NOT 'dimensionName'). Example: {"nextActionDimension": {"name": "eventName"}, "limit": "5"}. \|
\| \`returnPropertyQuota\` \| boolean \| No \| If true, includes the property's current quota state. \|
\| \`funnelVisualizationType\` \| string ("STANDARD\_FUNNEL" \| "TRENDED\_FUNNEL") \| No \| Visualization type: STANDARD\_FUNNEL (default) or TRENDED\_FUNNEL. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Run Pivot Report

\*\*Slug:\*\* \`GOOGLESUPER\_RUN\_PIVOT\_REPORT\`

Tool to run a customized pivot report of Google Analytics event data. Use when you need a pivot table view with advanced segmentation and multi-dimensional analysis of GA4 data.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pivots\` \| array \| No \| Optional. Visual format configuration for dimensions. Each pivot has 'fieldNames' (required string array), 'limit' (required), optional 'orderBys', 'offset', and 'metricAggregations'. \|
\| \`metrics\` \| array \| Yes \| Required. At least one metric is required. Each metric has a 'name' field, optional 'expression', and optional 'invisible' boolean. \|
\| \`property\` \| string \| Yes \| Required. The GA4 property resource name. Format: properties/{property\_id} \|
\| \`cohortSpec\` \| object \| No \| Optional. Cohort configuration with 'cohorts' (required), optional 'cohortsRange' and 'cohortReportSettings'. \|
\| \`dateRanges\` \| array \| No \| Optional. Date ranges for event data retrieval. Each range has 'startDate' and 'endDate' (YYYY-MM-DD format or relative like 'NdaysAgo', 'yesterday', 'today'), and optional 'name'. \|
\| \`dimensions\` \| array \| No \| Optional. Dimensions to request. Each dimension has a 'name' field and optional 'dimensionExpression'. Dimensions must be used in pivots, filters, or orderBys. \|
\| \`comparisons\` \| array \| No \| Optional. Comparison configurations. Each comparison has optional 'name' and required 'dimensionFilter' or 'comparison'. \|
\| \`currencyCode\` \| string \| No \| Optional. ISO4217 currency code (e.g., 'USD', 'EUR'). \|
\| \`metricFilter\` \| object \| No \| Optional. Post-aggregation filter (SQL HAVING clause equivalent). \|
\| \`keepEmptyRows\` \| boolean \| No \| Optional. If true, includes rows where all metrics equal 0. \|
\| \`dimensionFilter\` \| object \| No \| Optional. Filter clause for dimensions only. Can use andGroup, orGroup, notExpression, or filter. \|
\| \`returnPropertyQuota\` \| boolean \| No \| Optional. If true, returns current quota state in PropertyQuota. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Run Realtime Report

\*\*Slug:\*\* \`GOOGLESUPER\_RUN\_REALTIME\_REPORT\`

Tool to run a customized realtime report of Google Analytics event data. Use when you need realtime data (last 30-60 minutes) with dimensions and metrics for a GA4 property.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Max rows to return (default 10000, max 250000). \|
\| \`metrics\` \| array \| No \| Metrics to measure (max 10). At least one dimension or metric is required. Valid names: activeUsers, eventCount, keyEvents, screenPageViews. \|
\| \`orderBys\` \| array \| No \| Sorting specification. Example: \[{'metric': {'metricName': 'activeUsers'}, 'desc': true}\] or \[{'dimension': {'dimensionName': 'country'}}\]. \|
\| \`property\` \| string \| Yes \| Required. The GA4 property resource name. Format: properties/{property\_id}. Get property IDs from GOOGLE\_ANALYTICS\_LIST\_PROPERTIES. \|
\| \`dimensions\` \| array \| No \| Dimensions to group by (max 9). At least one dimension or metric is required. Valid names: appVersion, audienceId, audienceName, city, cityId, country, countryId, deviceCategory, eventName, minutesAgo, platform, streamId, streamName, unifiedScreenName. Custom: 'customUser:param\_name'. \|
\| \`metricFilter\` \| object \| No \| Post-aggregation filter on metric values. Applied after row aggregation. \|
\| \`minuteRanges\` \| array \| No \| Time ranges to report on. Default is last 30 minutes. Each range has startMinutesAgo (default 29) and endMinutesAgo (default 0). \|
\| \`dimensionFilter\` \| object \| No \| Filter to restrict data by dimension values. Structure: {'filter': {'fieldName': 'country', 'stringFilter': {'value': 'United States'}}} or use andGroup/orGroup/notExpression for complex filters. \|
\| \`metricAggregations\` \| array \| No \| Request aggregated metric values. Values: 'TOTAL', 'MINIMUM', 'MAXIMUM', 'COUNT'. \|
\| \`returnPropertyQuota\` \| boolean \| No \| If true, includes API quota usage info in the response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Run Report

\*\*Slug:\*\* \`GOOGLESUPER\_RUN\_REPORT\`

Tool to run a customized GA4 data report. Use when you need event data after specifying dimensions, metrics, and date ranges. IMPORTANT - DIMENSION/METRIC COMPATIBILITY: The Google Analytics Data API has strict compatibility rules between dimensions and metrics. Not all combinations are valid. If you receive a 400 error with a message about incompatible dimensions/metrics, use the GOOGLE\_ANALYTICS\_CHECK\_COMPATIBILITY action first to validate your dimension/metric combinations before running reports. Common incompatibilities include: - Demographic dimensions (userAgeBracket, userGender) with session-scoped dimensions/filters (sessionCampaignName, sessionSource) - Certain user-scoped dimensions with event-scoped metrics For complex queries, consider starting with simpler dimension/metric combinations or use CHECK\_COMPATIBILITY to pre-validate your request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Optional. Number of rows to return. Must be between 1 and 250000. \|
\| \`offset\` \| integer \| No \| Optional. 0-based start row for pagination. Must be >= 0. \|
\| \`metrics\` \| array \| No \| Optional. The metrics to request and display. Maximum 10 metrics per request. Each metric MUST be an object with a required non-empty 'name' field. Common valid metric names: activeUsers, totalUsers, newUsers, sessions, engagedSessions, screenPageViews, eventCount, conversions, userEngagementDuration, engagementRate, bounceRate, averageSessionDuration, sessionsPerUser, screenPageViewsPerSession, purchaseRevenue, totalRevenue, transactions, ecommercePurchases, publisherAdClicks, publisherAdImpressions, totalAdRevenue. Custom metrics use format 'customEvent:parameter\_name'. CRITICAL: 'averageEngagementTime' is NOT a valid metric - use 'userEngagementDuration' or 'averageSessionDuration' instead. 'exits' is NOT a valid metric in GA4. \|
\| \`orderBys\` \| array \| No \| Optional. Specify how rows are ordered. Each OrderBy object must have 'desc' (boolean) at the top level and exactly one of: 'metric' (with 'metricName' string), 'dimension' (with 'dimensionName' or 'name' string and optional 'orderType': 'ALPHANUMERIC', 'CASE\_INSENSITIVE\_ALPHANUMERIC', or 'NUMERIC'), or 'pivot'. Note: For dimension ordering, you can use either 'dimensionName' or 'name' field - both are accepted and normalized. Example for metric ordering: {'desc': true, 'metric': {'metricName': 'activeUsers'}}. Example for dimension ordering: {'desc': false, 'dimension': {'dimensionName': 'country', 'orderType': 'ALPHANUMERIC'}}. \|
\| \`property\` \| string \| Yes \| Required. The property resource on which to run the report. Format: properties/{property\_id} where property\_id must be a numeric ID (e.g., 'properties/123456789'). \|
\| \`cohortSpec\` \| object \| No \| Optional. Cohort specification. Requires requesting the cohort dimension. \|
\| \`dateRanges\` \| array \| No \| The date ranges to read. Required for standard reports. Each range MUST be an object with required 'startDate' and 'endDate' fields (both must be non-empty). Dates can be in YYYY-MM-DD format or special values like 'today', 'yesterday', '7daysAgo', '30daysAgo'. IMPORTANT: For cohort requests (when cohortSpec is provided), dateRanges must be omitted. \|
\| \`dimensions\` \| array \| No \| Optional. The dimensions to request and display. Maximum 9 dimensions per request. Each dimension MUST be an object with a required non-empty 'name' field. Common valid dimension names: date, dateHour, dateHourMinute, year, month, week, day, dayOfWeek, hour, city, cityId, country, countryId, continent, continentId, region, subContinent, deviceCategory, browser, operatingSystem, platform, platformDeviceCategory, screenResolution, sessionSource, sessionMedium, sessionSourceMedium, sessionCampaignName, sessionDefaultChannelGroup, firstUserSource, firstUserMedium, firstUserCampaignName, firstUserDefaultChannelGroup, pagePath, pagePathPlusQueryString, pageTitle, landingPage, hostname, eventName, streamName, userAgeBracket, userGender, language, newVsReturning. Custom dimensions: 'customEvent:parameter\_name' or 'customUser:parameter\_name'. 'dateRange' is NOT a valid dimension — use date dimensions (date, dateHour, year, month, etc.) instead. 'exits' is NOT a valid dimension in GA4. COMPATIBILITY: Not all dimensions can be combined with each other or with certain metrics/filters. If you receive a compatibility error, use GOOGLE\_ANALYTICS\_CHECK\_COMPATIBILITY to validate combinations, or see https://developers.google.com/analytics/devguides/reporting/data/v1/compatibility \|
\| \`comparisons\` \| array \| No \| Optional. The comparison configuration. Adds a comparison column to the response. \|
\| \`currencyCode\` \| string \| No \| Optional. The currency code to apply, in ISO 4217 format. Defaults to property currency. \|
\| \`metricFilter\` \| object \| No \| Optional. Filter expression to restrict rows by metric values. Applied after aggregation. IMPORTANT: Only use metric field names here (e.g., 'activeUsers', 'sessions', 'ecommercePurchases', 'purchaseRevenue'). Do NOT use dimension names in metricFilter - if you need to filter by a dimension (e.g., 'country', 'city', 'pagePath'), use dimensionFilter instead. The action validates that only metric names are used in metricFilter and will reject dimension names with a clear error. Structure: {'filter': {'fieldName': '', 'numericFilter': {'operation': 'GREATER\_THAN', 'value': {'int64Value': '0'}}}} or use 'andGroup'/'orGroup' for multiple conditions. \|
\| \`keepEmptyRows\` \| boolean \| No \| Optional. If true, rows with all zero metrics will be returned; otherwise omitted. \|
\| \`dimensionFilter\` \| object \| No \| Optional. Filter expression to restrict rows by dimension values. IMPORTANT: Only use dimension field names here (e.g., 'country', 'city', 'date', 'deviceCategory', 'pagePath'). Do NOT use metric names in dimensionFilter - if you need to filter by a metric (e.g., 'activeUsers', 'sessions', 'ecommercePurchases'), use metricFilter instead. Structure: {'filter': {'fieldName': '', 'stringFilter': {...}}} or use 'andGroup'/'orGroup' for multiple conditions. COMPATIBILITY WARNING: Dimension filters must be compatible with the dimensions in your request. For example, filtering on 'sessionCampaignName' while using demographic dimensions (userAgeBracket, userGender) will fail. The filter field creates an implicit dimension that must be compatible with all other dimensions and metrics. Use GOOGLE\_ANALYTICS\_CHECK\_COMPATIBILITY to verify your filter dimensions work with your requested dimensions/metrics. \|
\| \`metricAggregations\` \| array \| No \| Optional. Aggregation types to include over metrics, e.g., 'TOTAL', 'MINIMUM', 'MAXIMUM'. \|
\| \`returnPropertyQuota\` \| boolean \| No \| Optional. If true, include the property's current quota state in the response. \|
\| \`removed\_dimensions\_internal\` \| array \| No \| Internal field to store filtered dimension names for execution message. Not sent to API. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search Developer Metadata

\*\*Slug:\*\* \`GOOGLESUPER\_SEARCH\_DEVELOPER\_METADATA\`

Tool to search for developer metadata in a spreadsheet. Use when you need to find specific metadata entries based on filters.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`dataFilters\` \| array \| Yes \| The data filters describing the criteria used to determine which DeveloperMetadata entries to return. \|
\| \`spreadsheetId\` \| string \| Yes \| The ID of the spreadsheet to retrieve metadata from. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search Documents

\*\*Slug:\*\* \`GOOGLESUPER\_SEARCH\_DOCUMENTS\`

Search for Google Documents using various filters including name, content, date ranges, and more.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| No \| Search query to filter documents. Provide either: (1) Plain text to search in document content (e.g., 'quarterly report'), which will search fullText, or (2) Drive API query syntax with operators like 'name contains', 'fullText contains', combined with 'and', 'or', 'not'. Leave empty to get all documents. \|
\| \`order\_by\` \| string \| No \| Order results by field. Common options: 'modifiedTime desc', 'modifiedTime asc', 'name', 'createdTime desc' \|
\| \`page\_token\` \| string \| No \| Token for continuing a previous search request on the next page. Use the next\_page\_token from the previous response to retrieve additional results. \|
\| \`max\_results\` \| integer \| No \| Maximum number of documents to return per page (1-100). Defaults to 10. Use page\_token for pagination when more results are available. \|
\| \`starred\_only\` \| boolean \| No \| Whether to return only starred documents. Defaults to False. \|
\| \`created\_after\` \| string \| No \| Return documents created after this date. Use RFC 3339 format like '2024-01-01T00:00:00Z'. \|
\| \`modified\_after\` \| string \| No \| Return documents modified after this date. Use RFC 3339 format like '2024-01-01T00:00:00Z'. \|
\| \`shared\_with\_me\` \| boolean \| No \| Whether to return only documents shared with the current user. Defaults to False. \|
\| \`include\_trashed\` \| boolean \| No \| Whether to include documents in trash. Defaults to False. \|
\| \`response\_detail\` \| string ("minimal" \| "full") \| No \| Level of detail in the response. 'minimal' returns only essential fields (id, name, modifiedTime, webViewLink) for efficient token usage. 'full' returns comprehensive metadata including permissions, owners, timestamps, and other detailed information. \|
\| \`include\_shared\_drives\` \| boolean \| No \| Whether to include documents from shared drives you have access to. Defaults to True. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search Media Items

\*\*Slug:\*\* \`GOOGLESUPER\_SEARCH\_MEDIA\_ITEMS\`

Searches for media items in a user's Google Photos library.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`albumId\` \| string \| No \| Album to search within \|
\| \`filters\` \| object \| No \| Search filters \|
\| \`orderBy\` \| string \| No \| Sort order for results, e.g. 'MediaMetadata.creation\_time desc' \|
\| \`pageSize\` \| integer \| No \| Maximum number of items to return. Default 25, maximum 100. \|
\| \`pageToken\` \| string \| No \| Token for getting the next page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search People

\*\*Slug:\*\* \`GOOGLESUPER\_SEARCH\_PEOPLE\`

Searches contacts by matching the query against names, nicknames, emails, phone numbers, and organizations, optionally including 'Other Contacts'. Only searches the authenticated user's contact directory — people existing solely in message headers won't appear; use GMAIL\_FETCH\_EMAILS for those. Results may be zero or multiple; never auto-select from ambiguous results. Results paginate via next\_page\_token; follow until empty and deduplicate by email. Many records lack emailAddresses or names even when requested — handle missing keys. Directory/organization policies may suppress entries.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| Yes \| Matches contact names, nicknames, email addresses, phone numbers, and organization fields. \|
\| \`page\_size\` \| integer \| No \| Maximum results to return; values >30 are capped to 30 by the API. \|
\| \`person\_fields\` \| string \| No \| Comma-separated fields to return (e.g., 'names,emailAddresses'). When 'other\_contacts' is true, only 'emailAddresses', 'metadata', 'names', 'phoneNumbers' are allowed. For full field access including 'organizations', set 'other\_contacts' to false. \|
\| \`other\_contacts\` \| boolean \| No \| When True, searches both saved contacts and 'Other Contacts' (people you've interacted with but not explicitly saved). Note: This restricts person\_fields to only 'emailAddresses', 'metadata', 'names', 'phoneNumbers'. When False, searches only saved contacts but allows all person\_fields including 'organizations', 'addresses', etc. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search Spreadsheets

\*\*Slug:\*\* \`GOOGLESUPER\_SEARCH\_SPREADSHEETS\`

Search for Google Spreadsheets using various filters including name, content, date ranges, and more.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| No \| Search query to filter spreadsheets. Behavior depends on the 'search\_type' parameter. For advanced searches, use Google Drive query syntax with fields like 'name contains', 'fullText contains', or boolean filters like 'sharedWithMe = true'. DO NOT use spreadsheet IDs as search terms. Leave empty to get all spreadsheets. \|
\| \`order\_by\` \| string \| No \| Sort order (comma-separated list for multi-field sorting). Valid fields: createdTime, folder, modifiedByMeTime, modifiedTime, name, name\_natural, quotaBytesUsed, recency, sharedWithMeTime, starred, viewedByMeTime. Append ' desc' for descending order (default is ascending). Examples: 'modifiedTime desc', 'folder,name', 'starred,modifiedTime desc'. \|
\| \`page\_token\` \| string \| No \| Token for retrieving the next page of results. Use the 'next\_page\_token' value from a previous response to get subsequent pages. Leave empty to get the first page. \|
\| \`max\_results\` \| integer \| No \| Maximum number of spreadsheets to return (1-1000). Defaults to 10. \|
\| \`search\_type\` \| string ("name" \| "content" \| "both") \| No \| How to search: 'name' searches filenames only (prefix matching from the START of filenames), 'content' uses fullText search which searches file content, name, description, and metadata (Google Drive API limitation: cannot search content exclusively without also matching filenames), 'both' explicitly searches both name OR content with an OR condition. Note: 'name' search only matches from the START of filenames (e.g., 'Budget' finds 'Budget 2024' but NOT 'Q1 Budget'). \|
\| \`starred\_only\` \| boolean \| No \| Whether to return only starred spreadsheets. Defaults to False. \|
\| \`created\_after\` \| string \| No \| Return spreadsheets created after this date. Use RFC 3339 format like '2024-01-01T00:00:00Z'. \|
\| \`modified\_after\` \| string \| No \| Return spreadsheets modified after this date. Use RFC 3339 format like '2024-01-01T00:00:00Z'. \|
\| \`shared\_with\_me\` \| boolean \| No \| Whether to return only spreadsheets shared with the current user. Defaults to False. \|
\| \`include\_trashed\` \| boolean \| No \| Whether to include spreadsheets in trash. Defaults to False. \|
\| \`include\_shared\_drives\` \| boolean \| No \| Whether to include spreadsheets from shared drives you have access to. Defaults to True. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search Stream GAQL

\*\*Slug:\*\* \`GOOGLESUPER\_SEARCH\_STREAM\_GAQL\`

Execute a Google Ads Query Language (GAQL) query and aggregate every streamed response batch in order. For very large reports, select only needed fields and use WHERE and LIMIT because action responses are returned inline and are not automatically offloaded.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| Yes \| The Google Ads Query Language (GAQL) query string. Must follow SELECT ... FROM ... WHERE ... format. Example: SELECT campaign.name, campaign.id, metrics.impressions FROM campaign WHERE campaign.status = 'ENABLED' \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`summary\_row\_setting\` \| string ("UNSPECIFIED" \| "NO\_SUMMARY\_ROW" \| "SUMMARY\_ROW\_ONLY" \| "SUMMARY\_ROW\_WITH\_RESULTS") \| No \| Whether to include a summary row with aggregated metrics. Valid values are 'UNSPECIFIED', 'NO\_SUMMARY\_ROW', 'SUMMARY\_ROW\_ONLY', and 'SUMMARY\_ROW\_WITH\_RESULTS'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Send Draft

\*\*Slug:\*\* \`GOOGLESUPER\_SEND\_DRAFT\`

Sends an existing draft email AS-IS to recipients already defined within the draft. IMPORTANT: This action does NOT accept recipient parameters (to, cc, bcc). The Gmail API's drafts/send endpoint sends drafts to whatever recipients are already set in the draft's To, Cc, and Bcc headers - it cannot add or override recipients. If the draft has no recipients, you must either: 1. Create a new draft with recipients using GMAIL\_CREATE\_EMAIL\_DRAFT, then send it 2. Use GMAIL\_SEND\_EMAIL to send a new email directly with recipients. Send is immediate and irreversible — confirm recipients and content before calling. No scheduling support; trigger at the desired UTC time externally. Gmail enforces ~25 MB message size limit and daily send caps (~500 recipients/day personal, ~2,000/day Workspace).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address. The special value \`me\` can be used to indicate the authenticated user. \|
\| \`draft\_id\` \| string \| Yes \| The ID of the draft to send. Draft IDs are typically alphanumeric strings (e.g., 'r99885592323229922'). Important: Do not confuse draft\_id with message\_id - they are different identifiers. Use GMAIL\_LIST\_DRAFTS to retrieve valid draft IDs, or GMAIL\_CREATE\_EMAIL\_DRAFT to create a new draft and get its ID. IMPORTANT: The draft MUST already have recipients (To, Cc, or Bcc) set - this action cannot add or override recipients. If the draft has no recipients, first create a new draft with recipients using GMAIL\_CREATE\_EMAIL\_DRAFT, or use GMAIL\_SEND\_EMAIL to send a new email directly. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Send Email

\*\*Slug:\*\* \`GOOGLESUPER\_SEND\_EMAIL\`

Sends an email via Gmail API using the authenticated user's Google profile display name. Sends immediately and is irreversible — confirm recipients, subject, body, and attachments before calling. At least one of 'to' (or 'recipient\_email'), 'cc', or 'bcc' must be provided. At least one of subject or body must be provided. Requires \`is\_html=True\` if the body contains HTML. All common file types including PNG, JPG, PDF, MP4, etc. are supported as attachments. Gmail API limits total message size to ~25 MB after base64 encoding. To reply in an existing thread, use GMAIL\_REPLY\_TO\_THREAD instead. No scheduled send support; enforce timing externally.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cc\` \| array \| No \| Carbon Copy (CC) recipients' email addresses. At least one of 'to'/'recipient\_email', 'cc', or 'bcc' must be provided. \|
\| \`bcc\` \| array \| No \| Blind Carbon Copy (BCC) recipients' email addresses. At least one of 'to'/'recipient\_email', 'cc', or 'bcc' must be provided. \|
\| \`body\` \| string \| No \| Email content (plain text or HTML). Either subject or body must be provided for the email to be sent. If HTML, \`is\_html\` must be \`True\`. \|
\| \`is\_html\` \| boolean \| No \| Set to \`True\` if the email body contains HTML tags. \|
\| \`subject\` \| string \| No \| Subject line of the email. Either subject or body must be provided for the email to be sent. \|
\| \`user\_id\` \| string \| No \| User's email address; the literal 'me' refers to the authenticated user. \|
\| \`attachment\` \| string \| No \| File(s) to attach. Accepts a single file or a list of files. IMPORTANT: mimetype MUST contain a '/' separator - single words like 'pdf' or 'new' are invalid. Gmail API limits: total message size must not exceed ~25 MB after base64 encoding. Omit or set to null for no attachment. Empty attachment objects (with all fields empty/whitespace) are treated as no attachment. \|
\| \`from\_email\` \| string \| No \| Sender email address for the 'From' header. Provide the connected account's primary email address or a verified alias configured in Gmail's 'Send mail as' settings. When omitted, the action attempts to resolve the primary email address from the authenticated Gmail profile. \|
\| \`recipient\_email\` \| string \| No \| Primary recipient's email address. You can also use 'to' as an alias for this parameter. At least one of 'to'/'recipient\_email', 'cc', or 'bcc' must be provided. Use extra\_recipients if you want to send to multiple recipients. Use the special value 'me' to send to your own authenticated email address. Must be a full user@domain address; 'me' is not valid here and will fail. \|
\| \`extra\_recipients\` \| array \| No \| Additional 'To' recipients' email addresses (not Cc or Bcc). Should only be used if recipient\_email is also provided. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Send Events

\*\*Slug:\*\* \`GOOGLESUPER\_SEND\_EVENTS\`

Tool to send event data to Google Analytics 4 using the Measurement Protocol. Use when you need to track server-side events that supplement client-side gtag.js or Firebase tracking. The Measurement Protocol allows sending event data directly to GA4 from servers, applications, or other devices. Events are processed asynchronously and typically appear in reports within 24-48 hours. For validation, use the validation server endpoint first (mp/collect/validate).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`events\` \| array \| Yes \| Required. Array of event objects to send. Maximum 25 events per request. Each event must have a 'name' and can optionally include 'params'. \|
\| \`consent\` \| object \| No \| Consent settings for Google Analytics 4. \|
\| \`user\_id\` \| string \| No \| Optional. A unique identifier for a logged-in user. This should be a non-PII identifier that you use internally to identify a user. Maximum 256 characters. \|
\| \`client\_id\` \| string \| Yes \| Required. A unique identifier for a user/client. This should be a UUID or similar unique string that identifies a specific user across sessions. Maximum 256 characters. \|
\| \`api\_secret\` \| string \| Yes \| Required. The API secret generated in the Google Analytics UI under Admin > Data Streams > Measurement Protocol API secrets. Used to authenticate requests. \|
\| \`measurement\_id\` \| string \| Yes \| Required. The measurement ID for the web stream in the format G-XXXXXXX. This is found in the Google Analytics UI under Admin > Data Streams > Web Stream Details. \|
\| \`user\_properties\` \| object \| No \| Optional. User properties to set for this measurement. Each property must have a 'value' field. User properties persist across events. \|
\| \`timestamp\_micros\` \| integer \| No \| Optional. Unix timestamp in microseconds for when the event occurred. If not provided, the current time is used. Can be up to 72 hours in the past. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Set Basic Filter

\*\*Slug:\*\* \`GOOGLESUPER\_SET\_BASIC\_FILTER\`

Tool to set a basic filter on a sheet in a Google Spreadsheet. Use when you need to filter or sort data within a specific range on a sheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`filter\` \| object \| Yes \| The filter to set. \|
\| \`spreadsheetId\` \| string \| Yes \| The ID of the spreadsheet. \|
\| \`responseRanges\` \| array \| No \| Limits the ranges included in the response spreadsheet. Meaningful only if includeSpreadsheetInResponse is true. \|
\| \`responseIncludeGridData\` \| boolean \| No \| True if grid data should be returned. Meaningful only if includeSpreadsheetInResponse is true. Ignored if a field mask was set in the request. \|
\| \`includeSpreadsheetInResponse\` \| boolean \| No \| Determines if the updated spreadsheet resource appears in the response. Default is false. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Set Data Validation Rule

\*\*Slug:\*\* \`GOOGLESUPER\_SET\_DATA\_VALIDATION\_RULE\`

Tool to set or clear data validation rules (including dropdowns) on a range in Google Sheets. Use when you need to apply dropdown lists, range-based dropdowns, or custom formula validation to cells.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mode\` \| string ("SET" \| "CLEAR") \| Yes \| Operation mode: 'SET' applies a validation rule to the range, 'CLEAR' removes any existing validation from the range. \|
\| \`strict\` \| boolean \| No \| Whether to reject invalid data (true) or show a warning (false). Default is true. \|
\| \`values\` \| array \| No \| List of allowed values for dropdown. Required when validation\_type='ONE\_OF\_LIST'. Each item becomes a dropdown option. \|
\| \`formula\` \| string \| No \| Custom formula for validation. Required when validation\_type='CUSTOM\_FORMULA'. Formula should evaluate to TRUE/FALSE. Example: '=A1>10'. \|
\| \`sheet\_id\` \| integer \| Yes \| The unique sheet ID (numeric identifier) where the validation rule will be applied. The first sheet created in a spreadsheet typically has ID 0, while additional sheets get unique IDs (e.g., 1534097477). If a sheet is deleted, its ID is never reused - so if the original first sheet (ID 0) was deleted, attempting to use 0 will fail. Always verify the actual sheet ID exists using GOOGLESHEETS\_GET\_SPREADSHEET\_INFO action (check 'sheets\[\].properties.sheetId' field). \|
\| \`end\_row\_index\` \| integer \| Yes \| Ending row index (0-based, exclusive) for the validation range. To apply to row 1 only, use start\_row\_index=0 and end\_row\_index=1. \|
\| \`input\_message\` \| string \| No \| Optional message shown to the user when they select the cell. Helpful hint about what values are expected. \|
\| \`show\_custom\_ui\` \| boolean \| No \| Whether to show a dropdown UI for list-based validation. Default is true. Set to true for dropdown lists. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Sheets spreadsheet. Can be found in the spreadsheet URL between '/d/' and '/edit'. \|
\| \`source\_range\_a1\` \| string \| No \| Source range in A1 notation for dropdown values. Required when validation\_type='ONE\_OF\_RANGE'. Example: 'Sheet1!A1:A10' or 'A1:A10'. \|
\| \`start\_row\_index\` \| integer \| Yes \| Starting row index (0-based, inclusive) for the validation range. Row 1 is index 0. \|
\| \`validation\_type\` \| string ("ONE\_OF\_LIST" \| "ONE\_OF\_RANGE" \| "CUSTOM\_FORMULA" \| "NUMBER\_GREATER" \| "NUMBER\_GREATER\_THAN\_EQ" \| "NUMBER\_LESS" \| "NUMBER\_LESS\_THAN\_EQ" \| "NUMBER\_EQ" \| "NUMBER\_NOT\_EQ" \| "NUMBER\_BETWEEN" \| "NUMBER\_NOT\_BETWEEN" \| "TEXT\_CONTAINS" \| "TEXT\_NOT\_CONTAINS" \| "TEXT\_EQ" \| "TEXT\_NOT\_EQ" \| "TEXT\_IS\_EMAIL" \| "TEXT\_IS\_URL" \| "DATE\_EQ" \| "DATE\_BEFORE" \| "DATE\_AFTER" \| "DATE\_ON\_OR\_BEFORE" \| "DATE\_ON\_OR\_AFTER" \| "DATE\_BETWEEN" \| "DATE\_NOT\_BETWEEN" \| "DATE\_NOT\_EQ" \| "DATE\_IS\_VALID" \| "BLANK" \| "NOT\_BLANK" \| "BOOLEAN") \| No \| Type of validation rule to apply. Required when mode='SET'. Dropdown types: 'ONE\_OF\_LIST' (dropdown from list), 'ONE\_OF\_RANGE' (dropdown from range). Number validations: 'NUMBER\_GREATER', 'NUMBER\_GREATER\_THAN\_EQ', 'NUMBER\_LESS', 'NUMBER\_LESS\_THAN\_EQ', 'NUMBER\_EQ', 'NUMBER\_NOT\_EQ', 'NUMBER\_BETWEEN', 'NUMBER\_NOT\_BETWEEN'. Text validations: 'TEXT\_CONTAINS', 'TEXT\_NOT\_CONTAINS', 'TEXT\_EQ', 'TEXT\_NOT\_EQ', 'TEXT\_IS\_EMAIL', 'TEXT\_IS\_URL' (Note: TEXT\_STARTS\_WITH and TEXT\_ENDS\_WITH are only for conditional formatting, not data validation). Date validations: 'DATE\_EQ', 'DATE\_BEFORE', 'DATE\_AFTER', 'DATE\_ON\_OR\_BEFORE', 'DATE\_ON\_OR\_AFTER', 'DATE\_BETWEEN', 'DATE\_NOT\_BETWEEN', 'DATE\_NOT\_EQ', 'DATE\_IS\_VALID'. Other: 'BLANK', 'NOT\_BLANK', 'BOOLEAN', 'CUSTOM\_FORMULA'. \|
\| \`condition\_values\` \| array \| No \| Generic list of condition values for validation types that require specific values (e.g., NUMBER\_GREATER requires one value, NUMBER\_BETWEEN requires two values, TEXT\_CONTAINS requires one value). For simple validations like TEXT\_IS\_EMAIL, BLANK, NOT\_BLANK, BOOLEAN, DATE\_IS\_VALID, this can be omitted. Each value should be a string that will be parsed by Google Sheets. \|
\| \`end\_column\_index\` \| integer \| Yes \| Ending column index (0-based, exclusive) for the validation range. To apply to column A only, use start\_column\_index=0 and end\_column\_index=1. \|
\| \`start\_column\_index\` \| integer \| Yes \| Starting column index (0-based, inclusive) for the validation range. Column A is index 0. \|
\| \`filtered\_rows\_included\` \| boolean \| No \| Whether to apply validation to rows hidden by filters. Default is false. Set to true to ensure validation applies to both visible and filtered rows. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Calendar Setting

\*\*Slug:\*\* \`GOOGLESUPER\_SETTINGS\_GET\`

Tool to return a single user setting for the authenticated user. Use when you need to retrieve a specific calendar setting value.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`setting\` \| string \| Yes \| The identifier of the user setting to retrieve. Valid values include: autoAddHangouts, dateFieldOrder, defaultEventLength, format24HourTime, hideInvitations, hideWeekends, locale, remindOnRespondedEventsOnly, showDeclinedEvents, timezone, useKeyboardShortcuts, weekStart \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IMAP Settings

\*\*Slug:\*\* \`GOOGLESUPER\_SETTINGS\_GET\_IMAP\`

Retrieves the IMAP settings for a Gmail user account, including whether IMAP is enabled, auto-expunge behavior, expunge behavior, and maximum folder size.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address or the special value 'me' to indicate the authenticated user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get POP settings

\*\*Slug:\*\* \`GOOGLESUPER\_SETTINGS\_GET\_POP\`

Tool to retrieve POP settings for a Gmail account. Use when you need to check the current POP configuration including access window and message disposition.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address. The special value 'me' can be used to indicate the authenticated user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Settings

\*\*Slug:\*\* \`GOOGLESUPER\_SETTINGS\_LIST\`

Returns all user settings for the authenticated user. Results include multiple settings keyed by id (e.g., \`timeZone\`); locate a specific setting by its \`id\` field. \`timeZone\` values are IANA identifiers (e.g., \`America/New\_York\`) — use directly in datetime and event logic; align with \`timeZone\` from GOOGLECALENDAR\_GET\_CALENDAR for consistent notification times.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageToken\` \| string \| No \| Token specifying which result page to return. \|
\| \`syncToken\` \| string \| No \| Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. If the syncToken expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without any syncToken. \|
\| \`maxResults\` \| integer \| No \| Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get send-as alias

\*\*Slug:\*\* \`GOOGLESUPER\_SETTINGS\_SEND\_AS\_GET\`

Tool to retrieve a specific send-as alias configuration for a Gmail user. Use when you need to get details about a send-as email address including display name, signature, SMTP settings, and verification status. Fails with HTTP 404 if the specified address is not a member of the send-as collection.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The email address of the Gmail user whose send-as alias to retrieve, or the special value 'me' to indicate the authenticated user. \|
\| \`send\_as\_email\` \| string \| Yes \| The send-as alias email address to retrieve. This is the email address that appears in the 'From:' header. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Watch Settings

\*\*Slug:\*\* \`GOOGLESUPER\_SETTINGS\_WATCH\`

Watch for changes to Settings resources.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| A UUID or similar unique string that identifies this channel. \|
\| \`type\` \| string \| Yes \| The type of delivery mechanism used for this channel. Must be "web\_hook". \|
\| \`token\` \| string \| No \| An arbitrary string delivered to the target address with each notification delivered over this channel. \|
\| \`params\` \| object \| No \| Additional parameters controlling delivery channel behavior. \|
\| \`address\` \| string \| Yes \| The address where notifications are delivered for this channel. \|
\| \`expiration\` \| integer \| No \| Unix timestamp in milliseconds specifying when the API should stop sending notifications for this channel. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create sheet from JSON

\*\*Slug:\*\* \`GOOGLESUPER\_SHEET\_FROM\_JSON\`

DEPRECATED: Use GOOGLESHEETS\_CREATE\_GOOGLE\_SHEET1 + GOOGLESHEETS\_UPDATE\_VALUES\_BATCH (or GOOGLESHEETS\_VALUES\_UPDATE / GOOGLESHEETS\_SPREADSHEETS\_VALUES\_APPEND) instead. Creates a new Google Spreadsheet and populates its first worksheet from \`sheet\_json\`. When data is provided, the first item's keys establish the headers. An empty list creates an empty worksheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| Yes \| The desired title for the new Google Spreadsheet. \|
\| \`sheet\_json\` \| array \| Yes \| A list of dictionaries representing the rows of the sheet. Each dictionary must have the same set of keys, which will form the header row. Values can be strings, numbers, booleans, or null (represented as empty cells). An empty list \[\] is allowed and will create a spreadsheet with an empty worksheet. \|
\| \`sheet\_name\` \| string \| Yes \| The name for the first worksheet within the newly created spreadsheet. This name will appear as a tab at the bottom of the sheet. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Sort Range

\*\*Slug:\*\* \`GOOGLESUPER\_SORT\_RANGE\`

Sorts data within a specified range in a Google Sheet based on one or more sort criteria. Use this action when you need to reorder rows in a range by column values, with support for multi-level (cascading) sorts.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`range\` \| object \| Yes \| The range to sort. All cells in this range will be reordered based on the sort specifications. \|
\| \`sortSpecs\` \| array \| Yes \| The sort order per column. Later specifications are used when values are equal in the earlier specifications (cascading sort). At least one sort specification is required. \|
\| \`responseRanges\` \| array \| No \| Limits the ranges included in the response spreadsheet. Meaningful only if includeSpreadsheetInResponse is true. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The ID of the spreadsheet. \|
\| \`responseIncludeGridData\` \| boolean \| No \| True if grid data should be returned. Meaningful only if includeSpreadsheetInResponse is true. \|
\| \`includeSpreadsheetInResponse\` \| boolean \| No \| Determines if the updated spreadsheet resource appears in the response. Default is false. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Copy Sheet to Another Spreadsheet

\*\*Slug:\*\* \`GOOGLESUPER\_SPREADSHEETS\_SHEETS\_COPY\_TO\`

Tool to copy a single sheet from a spreadsheet to another spreadsheet. Use when you need to duplicate a sheet into a different spreadsheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sheet\_id\` \| integer \| Yes \| The ID of the sheet to copy. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The ID of the spreadsheet containing the sheet to copy. \|
\| \`destination\_spreadsheet\_id\` \| string \| Yes \| The ID of the spreadsheet to copy the sheet to. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Append Values to Spreadsheet

\*\*Slug:\*\* \`GOOGLESUPER\_SPREADSHEETS\_VALUES\_APPEND\`

Tool to append values to a spreadsheet. Use when you need to add new data to the end of an existing table in a Google Sheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`range\` \| string \| Yes \| A1 notation range used to locate a logical table. New rows are appended after the last row of that table within this range. First call GOOGLESHEETS\_GET\_SHEET\_NAMES with this exact spreadsheet\_id and use one of the returned sheet names; sheet names are case-sensitive and default names like 'Sheet1' are unsafe guesses. Valid formats: exact sheet name only (e.g., 'Sales Data'), sheet-qualified column range (e.g., 'Sales Data!A:D'), or sheet-qualified cell range (e.g., 'Sales Data!A1:D100'). Do not pass bare ranges like 'A:F' or 'A1:D100' because they omit the sheet name. If the needed sheet is not returned, create it or ask the user instead of inventing a name. Sheet names with spaces need single quotes (auto-added). IMPORTANT: The append may land in different columns than specified due to API table detection. For strict column placement, use GOOGLESHEETS\_SPREADSHEETS\_VALUES\_UPDATE instead. Always check updates.updatedRange in the response to verify where data was actually written. \|
\| \`values\` \| array \| Yes \| 2D array of values to append. Typically, each inner list is a ROW (majorDimension=ROWS). Use null/None for empty cells. \|
\| \`spreadsheetId\` \| string \| Yes \| The spreadsheet ID (typically 44 characters containing letters, numbers, hyphens, and underscores). Found in the URL between /d/ and /edit. NOT the sheet name (tab name) - that belongs in the 'range' parameter. \|
\| \`majorDimension\` \| string ("ROWS" \| "COLUMNS") \| No \| How to interpret the 2D values array. Use ROWS for row-wise data (most common for appends). Use COLUMNS for column-wise data. Example: if A1=1,B1=2,A2=3,B2=4 then majorDimension=ROWS yields \[\[1,2\],\[3,4\]\] and majorDimension=COLUMNS yields \[\[1,3\],\[2,4\]\]. \|
\| \`insertDataOption\` \| string ("OVERWRITE" \| "INSERT\_ROWS") \| No \| How the input data should be inserted. \|
\| \`valueInputOption\` \| string ("RAW" \| "USER\_ENTERED") \| Yes \| How the input data should be interpreted. \|
\| \`includeValuesInResponse\` \| boolean \| No \| Determines if the update response should include the values of the cells that were appended. By default, responses do not include the updated values. \|
\| \`responseValueRenderOption\` \| string ("FORMATTED\_VALUE" \| "UNFORMATTED\_VALUE" \| "FORMULA") \| No \| Determines how values in the response should be rendered. The default render option is FORMATTED\_VALUE. \|
\| \`responseDateTimeRenderOption\` \| string ("SERIAL\_NUMBER" \| "FORMATTED\_STRING") \| No \| Determines how dates, times, and durations in the response should be rendered. This is ignored if responseValueRenderOption is FORMATTED\_VALUE. The default dateTime render option is SERIAL\_NUMBER. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch Clear Spreadsheet Values

\*\*Slug:\*\* \`GOOGLESUPER\_SPREADSHEETS\_VALUES\_BATCH\_CLEAR\`

Tool to clear one or more ranges of values from a spreadsheet. Use when you need to remove data from specific cells or ranges while keeping formatting and other properties intact.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ranges\` \| array \| Yes \| The ranges to clear, in A1 notation (e.g., 'Sheet1!A1:B2') or R1C1 notation. Each range should be a clean string without surrounding brackets or extra quotes. Valid examples: 'Sheet1!A1:B2', 'A1:Z100', 'Sheet1'. Invalid examples: "\['Sheet1!A1:B2'\]", '\[Sheet1!A1\]'. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The ID of the spreadsheet to update. Can be either a spreadsheet ID or a full Google Sheets URL (the ID will be extracted automatically). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch Get Spreadsheet Values by Data Filter

\*\*Slug:\*\* \`GOOGLESUPER\_SPREADSHEETS\_VALUES\_BATCH\_GET\_BY\_DATA\_FILTER\`

Tool to return one or more ranges of values from a spreadsheet that match the specified data filters. Use when you need to retrieve specific data sets based on filtering criteria rather than entire sheets or fixed ranges.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`dataFilters\` \| array \| Yes \| Required. An array of data filter objects used to match ranges of values to retrieve. Each filter can specify either 'a1Range' (e.g., 'Sheet1!A1:B5') or 'gridRange'. Must be provided as a list, e.g., \[{'a1Range': 'Sheet1!A1:B5'}\]. A single filter object will be automatically wrapped in a list. \|
\| \`spreadsheetId\` \| string \| Yes \| The ID of the spreadsheet to retrieve data from. This is the unique identifier found in the spreadsheet URL (e.g., in 'https://docs.google.com/spreadsheets/d/SPREADSHEET\_ID/edit', the ID is the SPREADSHEET\_ID part). Typical Google Sheets IDs are approximately 44 characters long and contain alphanumeric characters, hyphens, and underscores. \|
\| \`majorDimension\` \| string ("ROWS" \| "COLUMNS") \| No \| The major dimension that results should use. For example, if the spreadsheet data is: A1=1,B1=2,A2=3,B2=4, then a request that selects that range and sets majorDimension=ROWS returns \[\[1,2\],\[3,4\]\], whereas a request that sets majorDimension=COLUMNS returns \[\[1,3\],\[2,4\]\]. \|
\| \`valueRenderOption\` \| string ("FORMATTED\_VALUE" \| "UNFORMATTED\_VALUE" \| "FORMULA") \| No \| How values should be represented in the output. The default render option is FORMATTED\_VALUE. \|
\| \`dateTimeRenderOption\` \| string ("SERIAL\_NUMBER" \| "FORMATTED\_STRING") \| No \| How dates, times, and durations should be represented in the output. This is ignored if valueRenderOption is FORMATTED\_VALUE. The default dateTime render option is SERIAL\_NUMBER. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Stop watch notifications

\*\*Slug:\*\* \`GOOGLESUPER\_STOP\_WATCH\`

Tool to stop receiving push notifications for a Gmail mailbox. Use when you need to disable watch notifications previously set up via the watch endpoint.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address. The special value 'me' can be used to indicate the authenticated user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Stop Watch Channel

\*\*Slug:\*\* \`GOOGLESUPER\_STOP\_WATCH\_CHANNEL\`

Tool to stop watching resources through a specified channel. Use this when you want to stop receiving notifications for a previously established watch. Both \`id\` and \`resourceId\` must be saved from the original watch response — they cannot be retrieved after the fact.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The ID of the channel to stop. \|
\| \`kind\` \| string \| No \| Identifies this as a notification channel used to watch for changes to a resource. \|
\| \`token\` \| string \| No \| An arbitrary string delivered to the target address with each notification delivered over this channel. \|
\| \`params\` \| object \| No \| Additional parameters controlling delivery channel behavior. \|
\| \`address\` \| string \| No \| The address where notifications are delivered for this channel. \|
\| \`payload\` \| boolean \| No \| A Boolean value to indicate whether payload is wanted. \|
\| \`expiration\` \| string \| No \| Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds. \|
\| \`resourceId\` \| string \| Yes \| The ID of the resource being watched. \|
\| \`channelType\` \| string ("web\_hook" \| "webhook") \| No \| The type of delivery mechanism used for this channel. \|
\| \`resourceUri\` \| string \| No \| A version-specific identifier for the watched resource. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Sync Events (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_SYNC\_EVENTS\`

DEPRECATED: Use GOOGLECALENDAR\_EVENTS\_LIST instead. EventsList already handles syncToken with automatic param stripping. Synchronizes Google Calendar events, performing a full sync if no \`sync\_token\` is provided or if a 410 GONE error (due to an expired token) necessitates it, otherwise performs an incremental sync for events changed since the \`sync\_token\` was issued.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_token\` \| string \| No \| Token for paginating results, from a previous response's \`nextPageToken\`. Repeat with each returned \`nextPageToken\` until no \`nextPageToken\` is returned; stopping early silently omits remaining events. \|
\| \`sync\_token\` \| string \| No \| Token for incremental sync, retrieving only changes since issued. A 410 GONE response indicates an expired token, requiring a full sync. Cannot be combined with \`timeMin\`, \`timeMax\`, \`orderBy\`, \`query\`, or \`updatedMin\`; mixing these causes the request to fail. \|
\| \`calendar\_id\` \| string \| No \| Google Calendar identifier; 'primary' refers to the authenticated user's main calendar. \|
\| \`event\_types\` \| array \| No \| Filters events by specified types (e.g., 'default', 'focusTime', 'outOfOffice', 'workingLocation'). All types returned if omitted. \|
\| \`max\_results\` \| integer \| No \| Max events per page (max 2500); Google Calendar's default is used if unspecified. \|
\| \`single\_events\` \| boolean \| No \| If True, expands recurring events into individual instances (excluding master event); otherwise, Google's default handling applies. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Text Search

\*\*Slug:\*\* \`GOOGLESUPER\_TEXT\_SEARCH\`

Searches for places on Google Maps using a textual query (e.g., "restaurants in London", "Eiffel Tower"). Results may include CLOSED\_PERMANENTLY or TEMPORARILY\_CLOSED places — filter by businessStatus=OPERATIONAL. Include city/region and business type in textQuery to avoid empty or irrelevant results. Deduplicate using id or formattedAddress, not name alone. Throttle to ~1 req/s; OVER\_QUERY\_LIMIT (HTTP 429) requires exponential backoff.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fieldMask\` \| string \| No \| Comma-separated list of place fields to return. Common fields include: displayName, formattedAddress, types, rating, userRatingCount, priceLevel, websiteUri, nationalPhoneNumber, internationalPhoneNumber, regularOpeningHours, location, photos, googleMapsUri, businessStatus, id. The 'places.' prefix is optional and will be added automatically. Use '\*' for all fields (not recommended for performance/cost). Common aliases are supported: 'name'->displayName, 'address'->formattedAddress, 'url'/'website'->websiteUri, 'type'->types, 'phone'->nationalPhoneNumber. Invalid field names (e.g., places.phoneNumber instead of places.nationalPhoneNumber) cause errors. Many fields (rating, websiteUri, regularOpeningHours, nationalPhoneNumber) may be absent even when requested — handle nulls. \|
\| \`textQuery\` \| string \| Yes \| Text query for searching places. Matched against place name, address, and category. Underspecified queries (missing city, region, or business type) yield empty or irrelevant results. Brand-name-only queries return multiple franchise branches — validate formattedAddress against the intended location. \|
\| \`maxResultCount\` \| integer \| No \| Maximum number of place results to return (must be 1-20). Note: Google prefers \`pageSize\`, but this action uses \`maxResultCount\`. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Tiles Session

\*\*Slug:\*\* \`GOOGLESUPER\_TILES\_CREATE\_SESSION\`

Tool to create a session token required for accessing 2D Tiles and Street View imagery. Use when you need to initialize tile-based map rendering or street view display. The session token is valid for approximately two weeks and must be included in all subsequent tile requests. Each call consumes quota — cache and reuse the returned token across all tile requests within its validity window rather than creating a new session per request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`scale\` \| string ("scaleFactor1x" \| "scaleFactor2x" \| "scaleFactor4x") \| No \| Label scaling factor for high-resolution displays. Valid values: 'scaleFactor1x' (standard), 'scaleFactor2x' (2x resolution), or 'scaleFactor4x' (4x resolution). \|
\| \`region\` \| string \| Yes \| Two-letter CLDR region code representing the user's location (e.g., 'US', 'GB', 'FR'). This helps Google Maps provide region-specific content. \|
\| \`styles\` \| array \| No \| JSON style objects for customizing map appearance (roadmap only). Allows custom styling of map features like roads, buildings, and landmarks. \|
\| \`highDpi\` \| boolean \| No \| Enable high-resolution tiles for high DPI displays. Works only with 2x or 4x scale factors. Set to true for sharper images on high-resolution screens. \|
\| \`mapType\` \| string ("roadmap" \| "satellite" \| "terrain" \| "streetview") \| Yes \| Base map type. Valid values: 'roadmap' for standard road map, 'satellite' for satellite imagery, 'terrain' for terrain maps, or 'streetview' for street view imagery. \|
\| \`overlay\` \| boolean \| No \| Render map layers separately (true) or combined into a single image (false). Set to true if you want individual overlay layers. \|
\| \`language\` \| string \| Yes \| IETF language tag specifying the display language for map labels and information (e.g., 'en-US', 'es-ES', 'fr-FR'). \|
\| \`layerTypes\` \| array \| No \| Overlay options for the map. Valid values: 'layerRoadmap' (road overlay), 'layerStreetview' (street view overlay), 'layerTraffic' (traffic layer). Note: terrain mapType requires layerRoadmap. \|
\| \`imageFormat\` \| string ("jpeg" \| "png") \| No \| Output format for tile images. Valid values: 'jpeg' or 'png'. If omitted, the format will be auto-selected by the API. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Trash File

\*\*Slug:\*\* \`GOOGLESUPER\_TRASH\_FILE\`

Tool to move a file or folder to trash (soft delete). Use when you need to delete a file but want to allow recovery via UNTRASH\_FILE. This action is distinct from permanent deletion and provides a safer cleanup workflow.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Comma-separated list of fields to include in the response. Use to limit the amount of data returned. If omitted, returns basic file metadata. \|
\| \`file\_id\` \| string \| Yes \| The ID of the file to trash. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Defaults to true. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Unhide Shared Drive

\*\*Slug:\*\* \`GOOGLESUPER\_UNHIDE\_DRIVE\`

Tool to unhide a shared drive. Use when you need to restore a shared drive to the default view.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`driveId\` \| string \| Yes \| The ID of the shared drive. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Unmerge Table Cells

\*\*Slug:\*\* \`GOOGLESUPER\_UNMERGE\_TABLE\_CELLS\`

Tool to unmerge previously merged cells in a table. Use this when you need to revert merged cells in a Google Document table back to their individual cell states.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`documentId\` \| string \| Yes \| The ID of the document to unmerge table cells in. \|
\| \`tableRange\` \| object \| Yes \| The table range specifying which cells of the table to unmerge. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Untrash File

\*\*Slug:\*\* \`GOOGLESUPER\_UNTRASH\_FILE\`

Tool to restore a file from the trash. Use when you need to recover a deleted file. This action updates the file's metadata to set the 'trashed' property to false. Only works while the file remains in trash — recovery is impossible after trash is emptied via GOOGLEDRIVE\_EMPTY\_TRASH or auto-purged by policy.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The ID of the file to untrash. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Untrash Message

\*\*Slug:\*\* \`GOOGLESUPER\_UNTRASH\_MESSAGE\`

Tool to remove a message from trash in Gmail. Use when you need to restore a previously trashed email message.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| User's email address or 'me' for the authenticated user. \|
\| \`message\_id\` \| string \| Yes \| Required. The unique identifier of the email message to remove from trash. This is a hexadecimal string that can be obtained from listing or fetching emails. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Untrash thread

\*\*Slug:\*\* \`GOOGLESUPER\_UNTRASH\_THREAD\`

Tool to remove a thread from trash in Gmail. Use when you need to restore a deleted thread and its messages.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address. The special value 'me' can be used to indicate the authenticated user. \|
\| \`thread\_id\` \| string \| Yes \| The ID of the thread to remove from trash. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Album

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_ALBUM\`

Updates an album's title or cover photo in Google Photos.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| No \| New title for the album. Maximum 500 characters. \|
\| \`albumId\` \| string \| Yes \| Identifier of the album to update \|
\| \`coverPhotoMediaItemId\` \| string \| No \| ID of the media item to use as album cover photo \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Chart in Google Sheets

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_CHART\`

Update the specification of an existing chart in a Google Sheets spreadsheet. Use this action when you need to modify an existing chart's properties such as its title, chart type, data ranges, colors, axes, or other visual settings. This action updates the chart's specification but does not change its position or size on the sheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`chart\_id\` \| integer \| Yes \| The unique numeric identifier of the chart to update within the spreadsheet. This is the chartId value returned when the chart was created or can be retrieved using the 'Get Spreadsheet Info' action (look for sheets\[\].charts\[\].chartId in the response). The chart must already exist in the specified spreadsheet. \|
\| \`chart\_spec\` \| object \| Yes \| The complete ChartSpec object defining the updated chart specification. This replaces the chart's existing specification but does not move or resize the chart. Must set exactly one chart type field: basicChart, pieChart, bubbleChart, candlestickChart, histogramChart, treemapChart, waterfallChart, orgChart, or scorecardChart. To change chart position or size, use a separate UpdateEmbeddedObjectPosition request. See https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/charts#ChartSpec \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Sheets spreadsheet containing the chart to update. Must be the actual spreadsheet ID from the URL (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'), NOT the spreadsheet name or title. Find it in the URL: https://docs.google.com/spreadsheets/d/SPREADSHEET\_ID/edit \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Comment

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_COMMENT\`

Tool to update an existing comment on a Google Drive file. Use when you need to change the content of a comment. NOTE: The 'resolved' field is read-only in the Google Drive API. To resolve or reopen a comment, use CREATE\_REPLY with action='resolve' or action='reopen'.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. The API documentation states this is required. If not specified by the user, this action defaults to '\*' to retrieve all fields, ensuring the API requirement is met. Example: 'id,content,resolved'. \|
\| \`content\` \| string \| No \| The plain text content of the comment. This field is used to update the comment's text. If not provided, the existing content will be retained unless 'resolved' is being updated. \|
\| \`file\_id\` \| string \| Yes \| The ID of the file. \|
\| \`resolved\` \| boolean \| No \| NOTE: The 'resolved' field is READ-ONLY in the Google Drive API. To resolve or reopen a comment, use the CREATE\_REPLY action with action='resolve' or action='reopen'. This parameter is kept for backwards compatibility but will be silently ignored by the API. \|
\| \`comment\_id\` \| string \| Yes \| The ID of the comment to update. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Dimension Properties (Hide/Unhide & Resize)

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_DIMENSION\_PROPERTIES\`

Tool to hide/unhide rows or columns and set row heights or column widths. Use when you need to change visibility or pixel sizing of dimensions in a Google Sheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sheet\_id\` \| integer \| No \| The numeric ID of the sheet (tab). Either sheet\_id or sheet\_name must be provided. If both are provided, sheet\_name will be resolved to sheet\_id and override this value. \|
\| \`dimension\` \| string ("ROWS" \| "COLUMNS") \| Yes \| Whether to update rows or columns. \|
\| \`end\_index\` \| integer \| Yes \| The zero-based end index (exclusive) of the dimension range to update. For example, to update rows 5-9, use start\_index=5 and end\_index=10. \|
\| \`pixel\_size\` \| integer \| No \| The height (for rows) or width (for columns) in pixels. Must be a positive integer. At least one of hidden\_by\_user or pixel\_size must be provided. \|
\| \`sheet\_name\` \| string \| No \| The name of the sheet (tab). If provided, this will be resolved to the numeric sheet\_id using GOOGLESHEETS\_GET\_SPREADSHEET\_INFO. Either sheet\_id or sheet\_name must be provided. \|
\| \`start\_index\` \| integer \| Yes \| The zero-based start index (inclusive) of the dimension range to update. For rows, 0 is the first row; for columns, 0 is column A. \|
\| \`hidden\_by\_user\` \| boolean \| No \| Whether to hide (true) or unhide (false) the specified rows/columns. At least one of hidden\_by\_user or pixel\_size must be provided. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The ID of the spreadsheet to update. \|
\| \`response\_ranges\` \| array \| No \| Limits the ranges included in the response spreadsheet (only if includeSpreadsheetInResponse is true). \|
\| \`response\_include\_grid\_data\` \| boolean \| No \| Whether to include grid data in the response (only if includeSpreadsheetInResponse is true). \|
\| \`include\_spreadsheet\_in\_response\` \| boolean \| No \| Whether to include the updated spreadsheet in the response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Document Batch (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_DOCUMENT\_BATCH\`

DEPRECATED: Use UpdateExistingDocument instead. Tool to apply one or more updates to a Google Document. Use when you need to perform batch operations on a document, such as inserting text, updating styles, or modifying document structure. Supports 35+ request types including insertText, replaceAllText, updateTextStyle, createParagraphBullets, insertTable, createHeader/Footer, and more. Each request is validated before being applied. If any request is invalid, the entire operation fails and nothing is applied.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`requests\` \| array \| Yes \| A list of updates to apply to the document. Each request dict must contain exactly one request type key (e.g., insertText, replaceAllText, updateTextStyle, createParagraphBullets). For updateTextStyle, range must be non-empty (startIndex < endIndex). See https://developers.google.com/docs/api/reference/rest/v1/documents/request for all types. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document to update. \|
\| \`write\_control\` \| object \| No \| Provides control over how write requests are executed. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Document Markdown

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_DOCUMENT\_MARKDOWN\`

Replaces the entire content of an existing Google Docs document with new Markdown text; requires edit permissions for the document.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier for the Google Docs document to update. Accepts either a document ID (alphanumeric string, length varies by document age - newer documents typically have 44-character IDs) or a full Google Docs URL (e.g., https://docs.google.com/document/d/{DOCUMENT\_ID}/edit). When a URL is provided, the document ID will be automatically extracted. \|
\| \`tab\_id\` \| string \| No \| Optional tab ID to replace with the rendered Markdown. When omitted, the first tab is updated. \|
\| \`markdown\` \| string \| Yes \| Markdown content that will replace the document's entire existing content. Supports standard Markdown features. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Document Section Markdown

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_DOCUMENT\_SECTION\_MARKDOWN\`

Tool to insert or replace a section of a Google Docs document with Markdown content. Use when you need to update only a section of a document by specifying start and optional end indices. Supports full Markdown formatting.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tab\_id\` \| string \| No \| Optional tab ID to update with the rendered Markdown. When omitted, the first tab is updated. \|
\| \`end\_index\` \| integer \| No \| Optional one-based end index of the content to replace (exclusive); must be greater than or equal to start\_index. If end\_index is not provided, the content is inserted at the start\_index without replacing existing content. Requires start\_index to be provided - if start\_index is omitted (append mode), end\_index is ignored. Important: Use the exact indices from GOOGLEDOCS\_GET\_DOCUMENT\_BY\_ID without modification. The Google Docs API does not allow deleting the last newline character of a document segment (body, header, footer, etc.), so ensure end\_index does not include the final segment newline. \|
\| \`document\_id\` \| string \| Yes \| The unique ID of the Google Docs document to update. This is the alphanumeric string found in the document URL: https://docs.google.com/document/d/{DOCUMENT\_ID}/edit. Valid IDs are typically 44 characters long and contain only letters, numbers, hyphens, and underscores (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'). To get a document ID: create a new document using GOOGLEDOCS\_CREATE\_DOCUMENT, or extract it from an existing document's URL. Also accepts parameter aliases: 'id', 'doc\_id', 'documentId', or 'docId'. \|
\| \`start\_index\` \| integer \| No \| One-based UTF-16 code unit index where to insert or start replacement. If not provided, content will be appended to the end of the document. Use 1 to insert at the very beginning of the document. To insert at a specific position, first use GOOGLEDOCS\_GET\_DOCUMENT\_BY\_ID to retrieve the document structure and find the desired index from the body.content elements' start\_index/end\_index values. If the provided index equals or exceeds the document segment's end index, it will be automatically adjusted to the last valid position (end\_index - 1) and a message will be included in the response. \|
\| \`markdown\_text\` \| string \| Yes \| Markdown content to insert or replace in the document section. Large content is automatically split into smaller batches to avoid API limits. Also accepts 'markdown', 'content', 'text', 'body', 'markdownText', or 'markdown\_content'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Document Style

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_DOCUMENT\_STYLE\`

Tool to update the overall document style, such as page size, margins, and default text direction. Use when you need to modify the global style settings of a Google Document.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| A comma-separated list of fields to update (using camelCase API names like 'marginTop', 'pageSize'). Use '\*' to automatically update only fields that have values set in document\_style. For example: "pageSize,marginTop,marginBottom". When '\*' is specified, the action automatically computes the field mask from the provided document\_style fields. \|
\| \`tab\_id\` \| string \| No \| The ID of the tab to update the style for. If not provided, the first tab is used. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document to update. \|
\| \`document\_style\` \| object \| Yes \| The DocumentStyle object with the new style settings. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update draft

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_DRAFT\`

Updates (replaces) an existing Gmail draft's content in-place by draft ID. This action replaces the entire draft content with the new message - it does not patch individual fields. All fields are optional; if not provided, you should provide complete draft content to avoid data loss.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cc\` \| array \| No \| Carbon Copy (CC) recipients' email addresses. Each must be a valid email address or display name format. \|
\| \`bcc\` \| array \| No \| Blind Carbon Copy (BCC) recipients' email addresses. Each must be a valid email address or display name format. \|
\| \`body\` \| string \| No \| Email body content (plain text or HTML); is\_html must be True if HTML. If not provided, previous body is preserved. Can also be provided as 'message\_body'. \|
\| \`is\_html\` \| boolean \| No \| Set to True if body is already formatted HTML. When False, plain text newlines are auto-converted to

 tags. \|
\| \`subject\` \| string \| No \| Email subject line. If not provided, previous subject is preserved. \|
\| \`user\_id\` \| string \| No \| User's email address or 'me' for the authenticated user. \|
\| \`draft\_id\` \| string \| Yes \| The ID of the draft to update. Must be a valid draft ID from GMAIL\_LIST\_DRAFTS or GMAIL\_CREATE\_EMAIL\_DRAFT. \|
\| \`thread\_id\` \| string \| No \| ID of an existing Gmail thread. If provided, the draft will be part of this thread. \|
\| \`attachment\` \| string \| No \| File(s) to attach to the draft. Accepts a single file or a list of files. Replaces any existing attachments. \|
\| \`recipient\_email\` \| string \| No \| Primary recipient's email address. Must be a valid email address (e.g., 'user@example.com') or display name format (e.g., 'John Doe '). Optional - if not provided, previous recipients are preserved. \|
\| \`extra\_recipients\` \| array \| No \| Additional 'To' recipients' email addresses. Each must be a valid email address or display name format. Should only be used if recipient\_email is also provided. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Shared Drive

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_DRIVE\`

Tool to update the metadata for a shared drive. Use when you need to modify properties like the name, theme, background image, or restrictions of a shared drive.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| The new name for the shared drive. \|
\| \`hidden\` \| boolean \| No \| Whether the shared drive is hidden from the default view. \|
\| \`driveId\` \| string \| Yes \| The ID of the shared drive to update. \|
\| \`themeId\` \| string \| No \| The ID of a theme to apply to the shared drive. Cannot be set if colorRgb or backgroundImageFile are set. \|
\| \`colorRgb\` \| string \| No \| The color of this shared drive as an RGB hex string (e.g., "#FF0000"). Cannot be set if themeId is set. \|
\| \`restrictions\` \| object \| No \| A set of restrictions to apply to the shared drive. \|
\| \`backgroundImageFile\` \| object \| No \| An image file and cropping parameters for the shared drive's background. Cannot be set if themeId is set. \|
\| \`useDomainAdminAccess\` \| boolean \| No \| If set to true, the request is issued as a domain administrator. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Google event

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_EVENT\`

Updates an existing event in Google Calendar. REQUIRES event\_id - you MUST first search for the event using GOOGLECALENDAR\_FIND\_EVENT or GOOGLECALENDAR\_EVENTS\_LIST to obtain the event\_id. This is a full PUT replacement: omitted fields (including attendees, reminders, recurrence, conferencing) are cleared. Always provide the complete desired event state. Use GOOGLECALENDAR\_PATCH\_EVENT instead for partial edits.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`summary\` \| string \| No \| Summary (title) of the event. \|
\| \`event\_id\` \| string \| Yes \| REQUIRED. The unique identifier of the event to update. This parameter is MANDATORY - events cannot be updated by title, date, or other criteria. You MUST first retrieve the event\_id by using GOOGLECALENDAR\_FIND\_EVENT or GOOGLECALENDAR\_EVENTS\_LIST to search for the event, then use the returned 'id' field here. \|
\| \`location\` \| string \| No \| Geographic location of the event as free-form text. \|
\| \`timezone\` \| string \| No \| IANA timezone name from the timezone database (e.g., 'America/New\_York', 'Europe/London', 'Asia/Jerusalem', 'UTC'). Required if datetime is naive. For recurring events, start and end must include a timeZone. If not provided, UTC is used. If datetime includes timezone info (Z or offset), this field is optional and defaults to UTC. IMPORTANT: Must be a valid IANA timezone identifier. Values like 'EST', 'PST', 'ISRAEL TIME', or other abbreviations are NOT valid IANA timezone names. \|
\| \`attendees\` \| array \| No \| List of attendees. Each attendee can be either: (1) A string email address (e.g., 'user@example.com'), or (2) An object with 'email' (required), 'optional' (boolean, default false), 'displayName' (string), 'comment' (string), 'additionalGuests' (integer), and 'resource' (boolean). To mark an attendee as optional (not required), use object format: {'email': 'user@example.com', 'optional': true}. IMPORTANT: Only valid email addresses are accepted. Plain names cannot be used. \|
\| \`eventType\` \| string ("birthday" \| "default" \| "focusTime" \| "outOfOffice" \| "workingLocation") \| No \| Type of the event, immutable post-creation. 'workingLocation' (REQUIRES Google Workspace Enterprise). Note: 'fromGmail' events cannot be created via API. \|
\| \`recurrence\` \| array \| No \| List of RRULE, EXRULE, RDATE, EXDATE lines for recurring events. Supported frequencies: DAILY, WEEKLY, MONTHLY, YEARLY. For recurring events, start.timeZone and end.timeZone must be present. UNTIL values follow RFC 5545: date-only (YYYYMMDD) for all-day events, or UTC datetime with Z suffix (YYYYMMDDTHHMMSSZ) for timed events. UNTIL values with time but missing Z suffix are auto-corrected. Provide an empty list to remove recurrence so the event becomes non-recurring. \|
\| \`visibility\` \| string ("default" \| "public" \| "private" \| "confidential") \| No \| Event visibility: 'default', 'public', 'private', or 'confidential'. \|
\| \`calendar\_id\` \| string \| No \| Identifier of the Google Calendar where the event resides. The value 'primary' targets the user's primary calendar. \|
\| \`description\` \| string \| No \| Description of the event. Can contain HTML. Optional. Must be omitted for 'birthday' event type. \|
\| \`end\_datetime\` \| string \| No \| Event end time in ISO 8601 format: YYYY-MM-DDTHH:MM:SS. When provided, this parameter takes precedence over event\_duration\_hour and event\_duration\_minutes. If not provided, the end time is calculated using start\_datetime + duration. Must be after start\_datetime. Fractional seconds and timezone info will be automatically stripped if provided. Examples: '2025-01-16T14:30:00', '2025-01-16T14:30'. \|
\| \`send\_updates\` \| string ("all" \| "externalOnly" \| "none") \| No \| Options for who should receive notifications about event changes. \|
\| \`transparency\` \| string ("opaque" \| "transparent") \| No \| 'opaque' (busy) or 'transparent' (available). \|
\| \`start\_datetime\` \| string \| Yes \| REQUIRED. Event start time in ISO 8601 format: YYYY-MM-DDTHH:MM:SS. IMPORTANT: Natural language expressions like 'tomorrow', 'next Monday', '2pm tomorrow' are NOT supported and will be rejected. You must provide the exact date and time in ISO format. Fractional seconds (e.g., .000) and timezone info (Z, +, -) will be automatically stripped if provided. Examples: '2025-01-16T13:00:00', '2025-01-16T13:00'. \|
\| \`guestsCanModify\` \| boolean \| No \| If True, guests can modify the event. \|
\| \`birthdayProperties\` \| object \| No \| Properties for birthday events. \|
\| \`create\_meeting\_room\` \| boolean \| No \| Defaults to True. When True, for CREATE operations creates a Google Meet link; for UPDATE operations preserves existing conference data if present, or adds a new Meet link if none exists. Google Workspace accounts will successfully receive a Meet link. Personal Gmail accounts and other unsupported accounts will gracefully fallback to creating an event without a Meet link when conference creation fails. Set to False to skip Meet link operations (won't create new or modify existing conference data). The fallback ensures event creation succeeds even when conference features are unavailable due to account limitations. \|
\| \`event\_duration\_hour\` \| integer \| No \| Number of hours for the event duration. Supports multi-day events (e.g., 240 hours = 10 days). For durations under 1 hour, use event\_duration\_minutes instead. Ignored if end\_datetime is provided. \|
\| \`extended\_properties\` \| object \| No \| Extended properties of the event for storing custom metadata. Contains 'private' (visible only on this calendar) and/or 'shared' (visible to all attendees) dictionaries mapping string keys to string values. Example: {'private': {'key1': 'value1'}, 'shared': {'key2': 'value2'}} \|
\| \`focusTimeProperties\` \| object \| No \| Properties for focusTime events. REQUIRES Google Workspace Enterprise account with Focus Time feature enabled. \|
\| \`guestsCanInviteOthers\` \| boolean \| No \| Whether attendees other than the organizer can invite others to the event. \|
\| \`outOfOfficeProperties\` \| object \| No \| Properties for outOfOffice events. \|
\| \`event\_duration\_minutes\` \| integer \| No \| Duration in minutes (0-59 ONLY). NEVER use 60+ minutes - use event\_duration\_hour=1 instead. Maximum value is 59. Combined duration (hours + minutes) must be greater than 0. Ignored if end\_datetime is provided. \|
\| \`guestsCanSeeOtherGuests\` \| boolean \| No \| Whether attendees other than the organizer can see who the event's attendees are. \|
\| \`workingLocationProperties\` \| object \| No \| Properties for workingLocation events. REQUIRES Google Workspace Enterprise. Constraints discovered from testing: - Must set transparency='transparent' and visibility='public' - Description must be omitted - Depending on 'type', include one of 'homeOffice', 'officeLocation', or 'customLocation' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update existing document

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_EXISTING\_DOCUMENT\`

Applies programmatic edits, such as text insertion, deletion, or formatting, to a specified Google Doc using the \`batchUpdate\` API method.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`edit\_docs\` \| array \| Yes \| (Required) A list of requests to execute on the document. Each request must be a dict containing exactly ONE of the valid request types listed below. Common request types: replaceAllText, insertText, updateTextStyle, createParagraphBullets, deleteParagraphBullets, createNamedRange, deleteNamedRange, updateParagraphStyle, deleteContentRange, insertInlineImage, insertTable, insertTableRow, insertTableColumn, deleteTableRow, deleteTableColumn, insertPageBreak, deletePositionedObject, updateTableColumnProperties, updateTableCellStyle, updateTableRowStyle, replaceImage, updateDocumentStyle, mergeTableCells, unmergeTableCells, createHeader, createFooter, createFootnote, replaceNamedRangeContent, updateSectionStyle, insertSectionBreak, deleteHeader, deleteFooter, pinTableHeaderRows, addDocumentTab, deleteTab, updateDocumentTabProperties, insertPerson. Do NOT use request types from other Google APIs (Slides, Sheets, etc.). For full request schemas, see https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate. SEGMENT IDs: Use empty string "" for document body, or a header/footer/footnote ID from the document. Internal 'kix.' IDs are NOT valid segment IDs and will cause "Segment with ID ... was not found" errors. Call GOOGLEDOCS\_GET\_DOCUMENT\_BY\_ID to get valid IDs. TAB IDs: When omitted, operations target the first tab. Invalid tab IDs cause errors. Get valid tab IDs from GOOGLEDOCS\_GET\_DOCUMENT\_BY\_ID at tabs\[\].tabProperties.tabId. BATCH INSERT OPERATIONS: Operations execute sequentially. Each insertText shifts subsequent indices. For multiple inserts at specific positions, process in REVERSE index order (highest first). For appending, use endOfSegmentLocation for each insert. Auto-correction: insertText without location/endOfSegmentLocation automatically appends to document body. INDEX BOUNDARIES: location.index must be LESS than the segment end index (valid: 1 to N-1). To insert at the end, use endOfSegmentLocation instead. PARAGRAPH BOUNDARIES: Text can only be inserted inside existing paragraphs, not at structural boundaries (e.g., a table's start index). For table cells, add +1 or +2 to the cell's startIndex. deleteContentRange: The range CANNOT include the trailing newline at segment end. If segment ends at N, use endIndex: N-1. deleteTableRow: Requires tableCellLocation object (NOT top-level rowIndex/tableStartLocation). Structure: { tableCellLocation: { tableStartLocation: { index: N }, rowIndex: R, columnIndex: C } }. updateTableCellStyle: Use EITHER tableStartLocation (all cells) OR tableRange (specific cells), not both. Style updates (updateParagraphStyle, updateTextStyle, updateTableCellStyle, updateDocumentStyle): The 'fields' parameter is auto-populated from style keys if omitted. Document title CANNOT be updated via batchUpdate - use Google Drive API instead. updateDocumentStyle valid fields: background, marginTop, marginBottom, marginLeft, marginRight, marginHeader, marginFooter, pageSize, pageNumberStart, useEvenPageHeaderFooter, useFirstPageHeaderFooter, flipPageOrientation (NOT "title"). \|
\| \`document\_id\` \| string \| Yes \| (Required) The unique identifier of the Google Docs document to be updated. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update File Metadata (PATCH v2)

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_FILE\_METADATA\_PATCH\`

Tool to update file metadata using the Drive API v2 PATCH method. Use when you need to modify file properties like title, description, or labels using patch semantics.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ocr\` \| boolean \| No \| Whether to attempt OCR on .jpg, .png, .gif, or .pdf uploads. \|
\| \`title\` \| string \| No \| The title of the file. Used to change the name of the file. \|
\| \`fileId\` \| string \| Yes \| The ID of the file to update. \|
\| \`labels\` \| object \| No \| A group of labels for the file. For example: {'starred': true, 'trashed': false, 'restricted': false, 'viewed': true}. \|
\| \`pinned\` \| boolean \| No \| Whether to pin the new revision. A file can have a maximum of 200 pinned revisions. \|
\| \`mimeType\` \| string \| No \| The MIME type of the file. \|
\| \`addParents\` \| string \| No \| Comma-separated list of parent IDs to add. \|
\| \`properties\` \| array \| No \| The list of properties. \|
\| \`description\` \| string \| No \| A short description of the file. \|
\| \`newRevision\` \| boolean \| No \| Whether a blob upload should create a new revision. If not set, a new revision is created. \|
\| \`ocrLanguage\` \| string \| No \| If ocr is true, hints at the language to use. Valid values are BCP 47 codes. \|
\| \`modifiedDate\` \| string \| No \| Last time this file was modified by anyone (RFC 3339 date-time). Requires setModifiedDate=true. \|
\| \`includeLabels\` \| string \| No \| A comma-separated list of IDs of labels to include in the labelInfo part of the response. \|
\| \`indexableText\` \| object \| No \| Indexable text attributes for the file (can be used to improve fulltext queries). \|
\| \`removeParents\` \| string \| No \| Comma-separated list of parent IDs to remove. \|
\| \`setModifiedDate\` \| boolean \| No \| Whether to set the modified date using the value supplied in the request body. \|
\| \`writersCanShare\` \| boolean \| No \| Whether writers can share the document with other users. \|
\| \`updateViewedDate\` \| boolean \| No \| Whether to update the view date after successfully updating the file. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Defaults to true. \|
\| \`timedTextLanguage\` \| string \| No \| The language of the timed text. \|
\| \`timedTextTrackName\` \| string \| No \| The timed text track name. \|
\| \`includePermissionsForView\` \| string \| No \| Specifies which additional view's permissions to include in the response. Only 'published' is supported. \|
\| \`useContentAsIndexableText\` \| boolean \| No \| Whether to use the content as indexable text. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Property (v2 API)

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_FILE\_PROPERTY\`

Tool to update a property on a file using Google Drive API v2. Use when you need to modify an existing custom property attached to a file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alt\` \| string ("json" \| "media" \| "proto") \| No \| Data format for response. \|
\| \`key\` \| string \| No \| API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. \|
\| \`xgafv\` \| string ("1" \| "2") \| No \| V1 error format values. \|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. \|
\| \`fileId\` \| string \| Yes \| The ID of the file. \|
\| \`callback\` \| string \| No \| JSONP callback function name. \|
\| \`quotaUser\` \| string \| No \| Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. \|
\| \`uploadType\` \| string \| No \| Legacy upload protocol for media (e.g. 'media', 'multipart'). \|
\| \`visibility\` \| string ("PRIVATE" \| "PUBLIC") \| No \| Visibility options for the property. \|
\| \`oauth\_token\` \| string \| No \| OAuth 2.0 token for the current user. \|
\| \`prettyPrint\` \| boolean \| No \| Returns response with indentations and line breaks. \|
\| \`propertyKey\` \| string \| Yes \| The key of the property. \|
\| \`access\_token\` \| string \| No \| OAuth access token. \|
\| \`property\_value\` \| string \| No \| The value of this property. \|
\| \`upload\_protocol\` \| string \| No \| Upload protocol for media (e.g. 'raw', 'multipart'). \|
\| \`property\_visibility\` \| string ("PRIVATE" \| "PUBLIC") \| No \| Visibility options for the property. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update File (Metadata)

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_FILE\_PUT\`

Updates file metadata. Uses PATCH semantics (partial update) as per Google Drive API v3 — only explicitly provided fields are updated, so omit fields you do not intend to overwrite. Use this tool to modify attributes of an existing file like its name, description, or parent folders. To move a file, supply add\_parents and remove\_parents together; omitting remove\_parents creates multiple parents, omitting add\_parents can orphan the file. Bulk updates may trigger 429 Too Many Requests; apply exponential backoff. Note: supports metadata updates only; file content updates are not yet implemented.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| The name of the file. Google Drive does not enforce name uniqueness within a folder; duplicate names are allowed and can cause ambiguous results when searching by name. \|
\| \`fileId\` \| string \| Yes \| The ID of the file to update. \|
\| \`starred\` \| boolean \| No \| Whether the user has starred the file. \|
\| \`mime\_type\` \| string \| No \| The MIME type of the file. Google Drive will attempt to automatically detect an appropriate value from uploaded content if no value is provided. The value cannot be changed unless a new revision is uploaded. \|
\| \`add\_parents\` \| string \| No \| Comma-separated list of folder IDs (not folder names) to add as parents. Folder IDs are alphanumeric strings typically 20+ characters long (e.g., '1A2B3C4D5E6F7G8H9I0J'). Folder names will not work and will cause a 'Parent folder not found' error. Moving a file requires pairing with remove\_parents (source folder ID); omitting remove\_parents results in multiple parents. Reparenting to a shared folder changes collaborator access to that folder's permissions. \|
\| \`description\` \| string \| No \| A short description of the file. \|
\| \`ocr\_language\` \| string \| No \| A language hint for OCR processing during image import (ISO 639-1 code). \|
\| \`remove\_parents\` \| string \| No \| Comma-separated list of folder IDs (not folder names) to remove as parents. Folder IDs are alphanumeric strings typically 20+ characters long (e.g., '1A2B3C4D5E6F7G8H9I0J'). Folder names will not work and will cause a 'Parent folder not found' error. \|
\| \`writers\_can\_share\` \| boolean \| No \| Whether writers can share the document with other users. \|
\| \`supports\_all\_drives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Defaults to true to ensure compatibility with shared drive files. \|
\| \`keep\_revision\_forever\` \| boolean \| No \| Whether to set this revision of the file to be kept forever. This is only applicable to files with binary content in Google Drive. Only 200 revisions for the file can be kept forever. If the limit is reached, try deleting pinned revisions. \|
\| \`use\_domain\_admin\_access\` \| boolean \| No \| Whether the requesting application is using domain-wide delegation to access content belonging to a user in a different domain. This is only applicable to files with binary content in Google Drive. \|
\| \`viewers\_can\_copy\_content\` \| boolean \| No \| Whether viewers are prevented from copying content of the file. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update File Revision Metadata

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_FILE\_REVISION\_METADATA\`

Updates ONLY the metadata properties of a specific file revision (keepForever, published, publishAuto, publishedOutsideDomain). IMPORTANT: This action does NOT update file content. To update file content, use EDIT\_FILE or UPDATE\_FILE\_PUT instead. This action requires BOTH file\_id AND revision\_id parameters. Use LIST\_REVISIONS to get available revision IDs for a file. Valid parameters: file\_id (required), revision\_id (required), keep\_forever, published, publish\_auto, published\_outside\_domain. Invalid parameters (use other actions): file\_contents, mime\_type, content, name - these are NOT supported by this action.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| Required. The ID of the file whose revision metadata you want to update. Use LIST\_FILES or FIND\_FILE to get the file ID. \|
\| \`published\` \| boolean \| No \| Whether this revision is published. This is only applicable to Docs Editors files. \|
\| \`keepForever\` \| boolean \| No \| Whether to keep this revision forever, even if it is no longer the head revision. If not set, the revision will be automatically purged 30 days after newer content is uploaded. This can be set on a maximum of 200 revisions for a file. This field is only applicable to files with binary content in Drive. \|
\| \`publishAuto\` \| boolean \| No \| Whether subsequent revisions will be automatically republished. This is only applicable to Docs Editors files. \|
\| \`revision\_id\` \| string \| Yes \| Required. The ID of the revision to update. Use LIST\_REVISIONS to get available revision IDs for a file. \|
\| \`publishedOutsideDomain\` \| boolean \| No \| Whether this revision is published outside the domain. This is only applicable to Docs Editors files. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update IMAP settings

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_IMAP\_SETTINGS\`

Tool to update IMAP settings for a Gmail account. Use when you need to modify IMAP configuration such as enabling/disabling IMAP, setting auto-expunge behavior, or configuring folder size limits.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`enabled\` \| boolean \| No \| Whether IMAP is enabled for the account. \|
\| \`user\_id\` \| string \| No \| The user's email address. The special value 'me' can be used to indicate the authenticated user. \|
\| \`autoExpunge\` \| boolean \| No \| If this value is true, Gmail will immediately expunge a message when it is marked as deleted in IMAP. Otherwise, Gmail will wait for an update from the client before expunging messages marked as deleted. \|
\| \`maxFolderSize\` \| integer \| No \| An optional limit on the number of messages that an IMAP folder may contain. Legal values are 0, 1000, 2000, 5000 or 10000. A value of zero is interpreted to mean that there is no limit. \|
\| \`expungeBehavior\` \| string ("expungeBehaviorUnspecified" \| "archive" \| "trash" \| "deleteForever") \| No \| The action that will be executed on a message when it is marked as deleted and expunged from the last visible IMAP folder. Possible values: 'expungeBehaviorUnspecified' (Unspecified behavior), 'archive' (Archive messages marked as deleted), 'trash' (Move messages marked as deleted to the trash), 'deleteForever' (Immediately and permanently delete messages marked as deleted). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Label

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_LABEL\`

Tool to update the properties of an existing Gmail label. Use when you need to modify label name, visibility settings, or color.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The ID of the label to update. \|
\| \`name\` \| string \| No \| The display name of the label. \|
\| \`color\` \| object \| No \| Color settings for the label. Both backgroundColor and textColor must be provided together. \|
\| \`userId\` \| string \| No \| The user's email address. The special value \`me\` can be used to indicate the authenticated user. \|
\| \`labelListVisibility\` \| string ("labelShow" \| "labelShowIfUnread" \| "labelHide") \| No \| Visibility of the label in the label list (Gmail sidebar). \|
\| \`messageListVisibility\` \| string ("show" \| "hide") \| No \| Visibility of messages with this label in the message list. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Language Settings

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_LANGUAGE\_SETTINGS\`

Tool to update the language settings for a Gmail user. Use when you need to change the display language preference for the authenticated user or a specific Gmail account. The returned displayLanguage may differ from the requested value if Gmail selects a close variant.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The email address of the Gmail user whose language settings are to be updated, or the special value 'me' to indicate the currently authenticated user. \|
\| \`display\_language\` \| string \| Yes \| The language to display Gmail in, formatted as an RFC 3066 Language Tag (e.g., 'en-GB' for British English, 'fr' for French, 'ja' for Japanese, 'es' for Spanish, 'de' for German, 'en' for English). The set of languages supported by Gmail evolves over time. Note: Gmail may save a close variant if the requested language is not directly supported. For example, if you request a regional variant that's not available, Gmail may save the base language instead. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Media Item

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_MEDIA\_ITEM\`

Updates a media item's description in Google Photos.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`description\` \| string \| Yes \| New description for the media item. Must be shorter than 1000 characters. \|
\| \`mediaItemId\` \| string \| Yes \| Identifier of the media item to update \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Permission

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_PERMISSION\`

Tool to update a permission with patch semantics. Use when you need to modify an existing permission for a file or shared drive. Inherited or domain-managed permissions may not be editable; verify editability with GOOGLEDRIVE\_LIST\_PERMISSIONS before updating.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The ID of the file or shared drive. \|
\| \`permission\` \| object \| Yes \| The permission resource to update. Only 'role' and 'expirationTime' can be updated. Role changes take effect immediately and can be difficult to reverse; confirm intent before applying. \|
\| \`permissionId\` \| string \| Yes \| The ID of the permission. For anyone-type permissions, use 'anyone' as the permission ID. \|
\| \`removeExpiration\` \| boolean \| No \| Whether to remove the expiration date. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Must be set to true when operating on shared drives; omitting this causes the request to fail. \|
\| \`transferOwnership\` \| boolean \| No \| Whether to transfer ownership to the specified user and downgrade the current owner to a writer. This parameter is required as an acknowledgement of the side effect when set to true. \|
\| \`useDomainAdminAccess\` \| boolean \| No \| Issue the request as a domain administrator; if set to true, then the requester will be granted access if the file ID parameter refers to a shared drive and the requester is an administrator of the domain to which the shared drive belongs. \|
\| \`enforceExpansiveAccess\` \| boolean \| No \| Whether the request should enforce expansive access rules. This field is deprecated, it is recommended to use \`permissionDetails\` instead. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update POP settings

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_POP\_SETTINGS\`

Tool to update POP settings for a Gmail account. Use when you need to configure POP access window or message disposition behavior.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The user's email address. The special value 'me' can be used to indicate the authenticated user. \|
\| \`disposition\` \| string ("dispositionUnspecified" \| "leaveInInbox" \| "archive" \| "trash" \| "markRead") \| No \| The action that will be executed on a message after it has been fetched via POP. \|
\| \`access\_window\` \| string ("accessWindowUnspecified" \| "disabled" \| "fromNowOn" \| "allMail") \| No \| The range of messages which are accessible via POP. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Property

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_PROPERTY\`

Tool to update an existing GA4 Property. Use when you need to modify property settings such as display name, time zone, currency code, or industry category.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Required. The resource name of the Property to update. Must be in the exact format: properties/{property\_id} where property\_id is a numeric identifier. IMPORTANT: Must start with 'properties/' prefix, contain no forward slashes in the property\_id, have no trailing slashes, and no additional path segments. Valid example: 'properties/489591273'. Invalid examples: '489591273' (missing prefix), 'properties/489591273/' (trailing slash), 'properties/489591273/extra' (extra segments) \|
\| \`parent\` \| string \| No \| Immutable. Resource name of this property's logical parent. Format: accounts/{account}, properties/{property}. Example: 'accounts/100', 'properties/101' \|
\| \`timeZone\` \| string \| No \| Required. Reporting Time Zone, used as the day boundary for reports. Format: IANA time zone. Example: 'America/Los\_Angeles' \|
\| \`updateMask\` \| string \| Yes \| Required. The list of fields to be updated. Field names must be in snake case (e.g., 'display\_name', 'time\_zone', 'currency\_code'). Omitted fields will not be updated. To replace the entire entity, use one path with the string '\*' to match all fields. Common fields: 'display\_name', 'time\_zone', 'currency\_code', 'industry\_category' \|
\| \`displayName\` \| string \| No \| Human-readable display name for this property. The max allowed display name length is 100 UTF-16 code units. \|
\| \`currencyCode\` \| string \| No \| The currency type used in reports involving monetary values. Format: ISO 4217. Examples: 'USD', 'EUR', 'JPY' \|
\| \`propertyType\` \| string ("PROPERTY\_TYPE\_UNSPECIFIED" \| "PROPERTY\_TYPE\_ORDINARY" \| "PROPERTY\_TYPE\_SUBPROPERTY" \| "PROPERTY\_TYPE\_ROLLUP") \| No \| Property type for a property. \|
\| \`industryCategory\` \| string ("INDUSTRY\_CATEGORY\_UNSPECIFIED" \| "AUTOMOTIVE" \| "BUSINESS\_AND\_INDUSTRIAL\_MARKETS" \| "FINANCE" \| "HEALTHCARE" \| "TECHNOLOGY" \| "TRAVEL" \| "OTHER" \| "ARTS\_AND\_ENTERTAINMENT" \| "BEAUTY\_AND\_FITNESS" \| "BOOKS\_AND\_LITERATURE" \| "FOOD\_AND\_DRINK" \| "GAMES" \| "HOBBIES\_AND\_LEISURE" \| "HOME\_AND\_GARDEN" \| "INTERNET\_AND\_TELECOM" \| "LAW\_AND\_GOVERNMENT" \| "NEWS" \| "ONLINE\_COMMUNITIES" \| "PEOPLE\_AND\_SOCIETY" \| "PETS\_AND\_ANIMALS" \| "REAL\_ESTATE" \| "REFERENCE" \| "SCIENCE" \| "SPORTS" \| "JOBS\_AND\_EDUCATION" \| "SHOPPING") \| No \| Industry category for a property. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Reply

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_REPLY\`

Tool to update a reply to a comment on a Google Drive file. Use when you need to modify the content of an existing reply.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Selector specifying which fields to include in a partial response. If not provided, defaults to '\*' to return all fields. \|
\| \`content\` \| string \| Yes \| The new plain text content of the reply. \|
\| \`file\_id\` \| string \| Yes \| The ID of the file. \|
\| \`reply\_id\` \| string \| Yes \| The ID of the reply. \|
\| \`comment\_id\` \| string \| Yes \| The ID of the comment. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update send-as alias

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_SEND\_AS\`

Tool to update a send-as alias for a Gmail user. Use when you need to modify display name, signature, reply-to address, or SMTP settings for a send-as email address. Gmail sanitizes HTML signatures before saving. Addresses other than the primary can only be updated by service accounts with domain-wide authority.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The email address of the Gmail user whose send-as alias to update, or the special value 'me' to indicate the authenticated user. \|
\| \`smtp\_msa\` \| object \| No \| SMTP relay configuration for the send-as alias. \|
\| \`signature\` \| string \| No \| Optional HTML signature for messages composed with this alias in Gmail web UI. Gmail sanitizes HTML before saving. Only added to new emails. \|
\| \`is\_default\` \| boolean \| No \| Set to true to make this the default 'From:' address for composing messages and vacation auto-replies. Setting true makes the previous default false. Only legal writable value is true. \|
\| \`display\_name\` \| string \| No \| Name to appear in 'From:' header. For custom from addresses, Gmail populates with primary account name if empty. Admin restrictions may silently fail updates to primary login name. \|
\| \`send\_as\_email\` \| string \| Yes \| The send-as alias email address to update. This is the email address that appears in the 'From:' header. \|
\| \`treat\_as\_alias\` \| boolean \| No \| Whether Gmail treats this address as an alias for the user's primary email. Only applies to custom from aliases. \|
\| \`reply\_to\_address\` \| string \| No \| Optional email address for 'Reply-To:' header. Gmail omits header if empty. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Sheet Properties

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_SHEET\_PROPERTIES\`

Tool to update properties of a sheet (worksheet) within a Google Spreadsheet, such as its title, index, visibility, tab color, or grid properties. Use this when you need to modify the metadata or appearance of a specific sheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`spreadsheetId\` \| string \| Yes \| The ID of the spreadsheet containing the sheet to update. \|
\| \`responseRanges\` \| array \| No \| Limits the ranges included in the response spreadsheet. Meaningful only if includeSpreadsheetInResponse is true. Ranges should be in A1 notation (e.g., 'Sheet1!A1:B2'). \|
\| \`updateSheetProperties\` \| object \| Yes \| The details of the sheet properties to update. \|
\| \`responseIncludeGridData\` \| boolean \| No \| True if grid data should be returned. Meaningful only if includeSpreadsheetInResponse is true. When true, the response will include cell data for the specified ranges. \|
\| \`includeSpreadsheetInResponse\` \| boolean \| No \| Determines if the update response should include the spreadsheet resource. When true, the response will include the full updated spreadsheet. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Google Meet Space

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_SPACE\`

Updates the settings of an existing Google Meet space. Requires organizer/host privileges and the meetings.space.created OAuth scope. REQUIRED PARAMETER: - name: The space identifier (e.g., 'spaces/jQCFfuBOdN5z'). This is always required to identify which space to update. OPTIONAL PARAMETERS: - config: The new configuration settings to apply (accessType, entryPointAccess, moderation, etc.) - updateMask: Specify which fields to update. If omitted, all provided config fields are updated. Example: To change access type, provide name='spaces/abc123' and config={'accessType': 'OPEN'}

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| REQUIRED. The unique identifier of the Google Meet space to update. Format: 'spaces/{space}' where {space} is the space ID. \|
\| \`config\` \| object \| No \| Configuration settings to update for the meeting space. Provide the fields you want to modify (e.g., accessType, entryPointAccess, moderation settings). Some settings (moderation modes, attendanceReportGenerationType, artifact generation) require specific Google Workspace editions and admin policies; unsupported settings may apply silently with no effect. Certain combinations of accessType, entryPointAccess, or moderation values may be rejected based on domain or account policies. \|
\| \`updateMask\` \| string \| No \| Field mask specifying which fields to update. Comma-separated list of fully qualified field names (e.g., "config.accessType,config.entryPointAccess"). If not provided, only the fields you explicitly set in config will be updated. WARNING: Using "\*" will attempt to update ALL config fields, which may cause errors if required fields like attendanceReportGenerationType are not provided. Recommend specifying only the fields being updated. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Spreadsheet Properties

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_SPREADSHEET\_PROPERTIES\`

Tool to update SPREADSHEET-LEVEL properties such as the spreadsheet's title, locale, time zone, or auto-recalculation settings. Use when you need to modify the overall configuration of a Google Spreadsheet. NOTE: To update individual SHEET properties (like renaming a specific sheet/tab), use GOOGLESHEETS\_UPDATE\_SHEET\_PROPERTIES instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| Yes \| Field mask specifying which properties to update (comma-separated for multiple fields). Supports nested paths using dot notation (e.g., 'iterativeCalculationSettings.maxIterations') per Protocol Buffers FieldMask specification. The root 'properties' is implied and must not be included. Special case: When updating 'spreadsheetTheme', use the field mask 'spreadsheetTheme' (not nested paths like 'spreadsheetTheme.primaryFontFamily') and provide the complete theme object with all required fields. Wildcard '\*' updates all properties. \|
\| \`properties\` \| object \| Yes \| The spreadsheet-level properties to update (e.g., title, locale, timeZone, autoRecalc). At least one field within properties must be set. NOTE: To update individual sheet/tab properties (like renaming a specific sheet), use GOOGLESHEETS\_UPDATE\_SHEET\_PROPERTIES instead. \|
\| \`spreadsheetId\` \| string \| Yes \| The ID of the spreadsheet to update. \|
\| \`responseRanges\` \| array \| No \| Limits the ranges included in the response spreadsheet. Only meaningful if includeSpreadsheetInResponse is true. Ranges should be in A1 notation (e.g., 'Sheet1!A1:B2'). \|
\| \`responseIncludeGridData\` \| boolean \| No \| Determines if grid data (cell values) should be included in the response. Only meaningful if includeSpreadsheetInResponse is true. When true, the response will include cell data for the specified ranges or entire spreadsheet. \|
\| \`includeSpreadsheetInResponse\` \| boolean \| No \| Determines if the update response should include the full spreadsheet resource. When true, the response will include the entire updated spreadsheet with all sheets, properties, and metadata. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Table Row Style

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_TABLE\_ROW\_STYLE\`

Tool to update the style of a table row in a Google Document. Use when you need to modify the appearance of specific rows within a table, such as setting minimum row height or marking rows as headers.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`documentId\` \| string \| Yes \| The ID of the document to update. \|
\| \`updateTableRowStyle\` \| object \| Yes \| The request body for updating the table row style. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Tab Properties

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_TAB\_PROPERTIES\`

Updates properties of a document tab such as title, parent tab, index, and icon emoji. Use this action when you need to rename a tab, change its emoji icon, move it within the tab hierarchy, or reorganize tab structure.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| A comma-separated list of fields to update (using camelCase API names like 'title', 'parentTabId', 'index', 'iconEmoji'). Use '\*' to automatically update only fields that have values set in tab\_properties. For example: 'title,iconEmoji'. When '\*' is specified, the action automatically computes the field mask from the provided tab\_properties fields. \|
\| \`tab\_id\` \| string \| Yes \| The ID of the tab to update. Get valid tab IDs from GOOGLEDOCS\_GET\_DOCUMENT\_BY\_ID at tabs\[\].tabProperties.tabId. \|
\| \`document\_id\` \| string \| Yes \| The ID of the document containing the tab to update. \|
\| \`tab\_properties\` \| object \| Yes \| The tab properties to update. Only the fields specified in the 'fields' parameter will be updated. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Task (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_TASK\`

DEPRECATED: Use GOOGLETASKS\_PATCH\_TASK instead. Full-update (PUT-style) operation that overwrites unspecified fields with empty/default values, which can cause data loss. Prefer GOOGLETASKS\_PATCH\_TASK unless a complete field replacement is explicitly required.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`due\` \| string \| No \| Due date of the task (RFC 3339 timestamp). \|
\| \`notes\` \| string \| No \| Notes describing the task. \|
\| \`title\` \| string \| No \| Title of the task. \|
\| \`status\` \| string \| No \| Status of the task. Valid values: "needsAction" or "completed". When setting to "completed", the completion date will be auto-set to the current time if not explicitly provided via the completed field. \|
\| \`task\_id\` \| string \| Yes \| Task identifier. \|
\| \`completed\` \| string \| No \| Completion date of the task (RFC 3339 timestamp). \|
\| \`tasklist\_id\` \| string \| Yes \| Task list identifier. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Task (Full Replacement)

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_TASK\_FULL\`

Tool to fully replace an existing Google Task using PUT method. Use when you need to update the entire task resource, not just specific fields. This method requires all required fields (id, title) and replaces the complete task, unlike PATCH which supports partial updates.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| Task identifier (REQUIRED). Must match the task\_id parameter. This field is required by the Google Tasks API for PUT operations. \|
\| \`due\` \| string \| No \| Due date for the task. NOTE: Google Tasks only stores the date portion (YYYY-MM-DD). Accepts RFC3339 format (e.g., '2025-09-28T00:00:00Z') or date strings like '2025-09-28'. \|
\| \`etag\` \| string \| No \| ETag of the resource for concurrency control. Prevents accidental overwrites when multiple clients modify the same task. \|
\| \`links\` \| array \| No \| Collection of links attached to the task. This collection is read-only. \|
\| \`notes\` \| string \| No \| Additional details or description for the task. Supports plain text only. Maximum 8192 characters. \|
\| \`title\` \| string \| Yes \| Title/name of the task (REQUIRED). This is the main text displayed for the task. Maximum 1024 characters. \|
\| \`hidden\` \| boolean \| No \| Whether the task is hidden. This is read-only and set by the API when task list is cleared. Default: false \|
\| \`parent\` \| string \| No \| Parent task identifier for subtasks. This field is read-only. Use the 'move' method to change parent. \|
\| \`status\` \| string ("needsAction" \| "completed") \| No \| Current status of the task. Must be either 'needsAction' (task is pending) or 'completed' (task is done). \|
\| \`deleted\` \| boolean \| No \| Whether the task has been deleted. Deleted tasks are marked but not immediately removed. Default: false \|
\| \`task\_id\` \| string \| Yes \| Identifier of the Google Task to be fully replaced within the specified task list. This must also be included in the 'id' field of the request body. \|
\| \`position\` \| string \| No \| Position of the task among siblings. This field is read-only. Use the 'move' method to change position. \|
\| \`completed\` \| string \| No \| Date/time when the task was marked as completed. Only applicable when status='completed'. Unlike 'due', this field preserves the time component. Accepts RFC3339 format. \|
\| \`tasklist\_id\` \| string \| Yes \| Identifier of the Google Task list that contains the task to be updated. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Task List

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_TASK\_LIST\`

Updates the authenticated user's specified task list.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| Yes \| Title of the task list. Maximum length allowed: 1024 characters. \|
\| \`tasklist\_id\` \| string \| Yes \| Task list identifier. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Team Drive (Deprecated)

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_TEAM\_DRIVE\`

Tool to update a Team Drive's metadata. Deprecated: Use the drives.update endpoint instead. Use when you need to modify Team Drive properties.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| The name of this Team Drive. \|
\| \`themeId\` \| string \| No \| The ID of the theme from which the background image and color will be set. This is a write-only field; it can only be set on requests that don't set colorRgb or backgroundImageFile. \|
\| \`colorRgb\` \| string \| No \| The color of this Team Drive as an RGB hex string. It can only be set on a drive.teamdrives.update request that does not set themeId. \|
\| \`teamDriveId\` \| string \| Yes \| The ID of the Team Drive to update. \|
\| \`restrictions\` \| object \| No \| A set of restrictions that apply to this Team Drive or items inside this Team Drive. \|
\| \`backgroundImageFile\` \| object \| No \| An image file and cropping parameters from which a background image for this Team Drive is set. This is a write only field; it can only be set on drive.teamdrives.update requests that don't set themeId. \|
\| \`useDomainAdminAccess\` \| boolean \| No \| Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the Team Drive belongs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update User Attributes Values

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_USER\_ATTRIBUTES\_VALUES\`

Update user attribute values for a resource. Use this action to set or update custom attributes for a user within an organization or project. When setting a value for an attribute key that also exists in SAML, the Sanity value will take precedence and shadow the SAML value.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`userId\` \| string \| Yes \| The unique identifier of the user whose attributes to update. \|
\| \`attributes\` \| object \| Yes \| A dictionary of attribute key-value pairs to set for the user. Values can be strings, numbers, booleans, arrays, or nested objects. These will shadow any SAML values for the same keys. \|
\| \`resourceId\` \| string \| Yes \| The unique identifier of the resource. For organizations, this is the organization ID. \|
\| \`resourceType\` \| string ("organization" \| "project") \| Yes \| The type of resource that scopes the user attributes (e.g., 'organization' or 'project'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Vacation Settings

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_VACATION\_SETTINGS\`

Tool to update vacation responder settings for a Gmail user. Use when you need to configure out-of-office auto-replies.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`userId\` \| string \| No \| The user's email address. The special value 'me' can be used to indicate the authenticated user. \|
\| \`endTime\` \| string \| No \| An optional end time for sending auto-replies (epoch ms). When this is specified, Gmail will automatically reply only to messages that it receives before the end time. If both startTime and endTime are specified, startTime must precede endTime. \|
\| \`startTime\` \| string \| No \| An optional start time for sending auto-replies (epoch ms). When this is specified, Gmail will automatically reply only to messages that it receives after the start time. If both startTime and endTime are specified, startTime must precede endTime. \|
\| \`enableAutoReply\` \| boolean \| No \| Flag that controls whether Gmail automatically replies to messages. \|
\| \`responseSubject\` \| string \| No \| Optional text to prepend to the subject line in vacation responses. In order to enable auto-replies, either the response subject or the response body must be nonempty. \|
\| \`responseBodyHtml\` \| string \| No \| Response body in HTML format. Gmail will sanitize the HTML before storing it. If both response\_body\_plain\_text and response\_body\_html are specified, response\_body\_html will be used. \|
\| \`restrictToDomain\` \| boolean \| No \| Flag that determines whether responses are sent to recipients who are outside of the user's domain. This feature is only available for Google Workspace users. \|
\| \`restrictToContacts\` \| boolean \| No \| Flag that determines whether responses are sent to recipients who are not in the user's list of contacts. \|
\| \`responseBodyPlainText\` \| string \| No \| Response body in plain text format. If both response\_body\_plain\_text and response\_body\_html are specified, response\_body\_html will be used. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Batch update spreadsheet values

\*\*Slug:\*\* \`GOOGLESUPER\_UPDATE\_VALUES\_BATCH\`

Tool to set values in one or more ranges of a spreadsheet. Use when you need to update multiple ranges in a single operation for better performance.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| array \| Yes \| The new values to apply to the spreadsheet. Each ValueRange specifies a range and the values to write to that range. Multiple ranges can be updated in a single request. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The ID of the spreadsheet to update. This ID can be found in the URL of the spreadsheet (e.g., https://docs.google.com/spreadsheets/d/{spreadsheet\_id}/edit). Must be a valid Google Sheets spreadsheet ID. \|
\| \`valueInputOption\` \| string ("INPUT\_VALUE\_OPTION\_UNSPECIFIED" \| "RAW" \| "USER\_ENTERED") \| Yes \| How the input data should be interpreted. RAW: Values are stored exactly as entered, without parsing. USER\_ENTERED: Values are parsed as if typed by a user (numbers stay numbers, strings prefixed with '=' become formulas, etc.). INPUT\_VALUE\_OPTION\_UNSPECIFIED: Default input value option is not specified. \|
\| \`includeValuesInResponse\` \| boolean \| No \| Determines if the update response should include the values of the cells that were updated. By default, responses do not include the updated values. \|
\| \`responseValueRenderOption\` \| string ("FORMATTED\_VALUE" \| "UNFORMATTED\_VALUE" \| "FORMULA") \| No \| Determines how values in the response should be rendered. Only used if includeValuesInResponse is true. FORMATTED\_VALUE (default): Values are formatted as displayed in the UI. UNFORMATTED\_VALUE: Values are unformatted. FORMULA: Formulas are not evaluated. \|
\| \`responseDateTimeRenderOption\` \| string ("SERIAL\_NUMBER" \| "FORMATTED\_STRING") \| No \| Determines how dates, times, and durations in the response should be rendered. Only used if includeValuesInResponse is true. SERIAL\_NUMBER (default): Dates are returned as numbers. FORMATTED\_STRING: Dates are returned as formatted strings. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upload File

\*\*Slug:\*\* \`GOOGLESUPER\_UPLOAD\_FILE\`

Uploads a file (max 5MB) to Google Drive, placing it in the specified folder or root if no valid folder ID is provided. Always creates a new file (never updates existing); use GOOGLEDRIVE\_EDIT\_FILE to update with a stable file\_id. Uploaded files are private by default; configure sharing via GOOGLEDRIVE\_ADD\_FILE\_SHARING\_PREFERENCE.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_to\_upload\` \| object \| Yes \| File to upload to Google Drive (max 5MB). Use a clear filename and accurate MIME type, for example \`application/pdf\`; incorrect values can cause Drive to convert or misrender the file. \|
\| \`folder\_to\_upload\_to\` \| string \| No \| Optional ID of the target Google Drive folder; can be obtained using 'Find Folder' or similar actions. Invalid or missing IDs silently fall back to Drive root with no error — resolve the correct folder ID first using GOOGLEDRIVE\_FIND\_FILE. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upload File from URL to Drive

\*\*Slug:\*\* \`GOOGLESUPER\_UPLOAD\_FROM\_URL\`

Tool to fetch a file from a provided URL server-side and upload it into Google Drive. Use when you need to reliably persist externally hosted files into Drive without client-side downloads or temporary storage.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Name for the file in Google Drive, including extension (e.g., 'report.pdf', 'image.png'). \|
\| \`mime\_type\` \| string \| No \| Target MIME type for the file in Google Drive. If not specified, Drive auto-detects from content. Google Workspace MIME types (application/vnd.google-apps.\*) trigger automatic conversion from compatible source formats: google-apps.document converts Word/ODT/HTML/RTF/TXT/PDF/images (OCR); google-apps.spreadsheet converts Excel/ODS/CSV/TSV; google-apps.presentation converts PowerPoint/ODP. Conversion requires the source content to be in a compatible format. Incompatible formats will cause upload errors. \|
\| \`source\_url\` \| string \| Yes \| HTTPS URL of the file to download and upload to Google Drive. Must be publicly accessible or include necessary authentication in source\_headers. \|
\| \`verify\_ssl\` \| boolean \| No \| Whether to verify SSL certificates when downloading from HTTPS URLs. Set to false to bypass SSL verification for URLs with certificate issues (expired certificates, hostname mismatches, self-signed certificates). Only disable for trusted sources. \|
\| \`source\_headers\` \| object \| No \| Optional HTTP headers to include when downloading from source\_url. Use for authentication tokens, signed URLs, or CDN-specific headers. \|
\| \`parent\_folder\_id\` \| string \| No \| ID of the parent folder in Google Drive. If not specified, the file will be uploaded to the root of My Drive. \|
\| \`supports\_all\_drives\` \| boolean \| No \| Whether the request supports both My Drives and shared drives. Defaults to true for broader compatibility. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upload Media

\*\*Slug:\*\* \`GOOGLESUPER\_UPLOAD\_MEDIA\`

Upload a media file to Google Photos. Supports images (up to 200MB) and videos (up to 20GB).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| No \| Public URL of the media file to upload (must be directly accessible). The action will download the file from this URL and upload it to Google Photos. Alternative to 'file\_to\_upload'. Supported formats: images (JPEG, PNG, GIF, HEIC, etc.) and videos (MP4, MOV, etc.). \|
\| \`file\_name\` \| string \| No \| File name for the uploaded media. Required when using 'url' parameter. Should include the file extension (e.g., 'photo.jpg', 'video.mp4'). \|
\| \`description\` \| string \| No \| Optional description for the media item \|
\| \`file\_to\_upload\` \| object \| No \| The media file to upload to Google Photos. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upload/Update File Content

\*\*Slug:\*\* \`GOOGLESUPER\_UPLOAD\_UPDATE\_FILE\`

Tool to update file content in Google Drive by uploading new binary content. Use when you need to replace the contents of an existing file with new file data.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The ID of the file to update with new content. \|
\| \`addParents\` \| string \| No \| Comma-separated list of parent folder IDs to add. \|
\| \`uploadType\` \| string \| No \| The type of upload request. 'media' for simple upload (content only), 'multipart' for metadata + content, 'resumable' for large files. \|
\| \`ocrLanguage\` \| string \| No \| Language hint for OCR processing (ISO 639-1 code, e.g., 'en'). \|
\| \`removeParents\` \| string \| No \| Comma-separated list of parent folder IDs to remove. \|
\| \`file\_to\_upload\` \| object \| Yes \| The file content to upload. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the app supports both My Drives and shared drives. Defaults to true. \|
\| \`keepRevisionForever\` \| boolean \| No \| Whether to set the 'keepForever' field in the new head revision. \|
\| \`useContentAsIndexableText\` \| boolean \| No \| Whether to use the uploaded content as indexable text for search. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upsert Rows (Smart Update/Insert)

\*\*Slug:\*\* \`GOOGLESUPER\_UPSERT\_ROWS\`

Upsert rows - update existing rows by key, append new ones. Automatically handles column mapping and partial updates. Use for: CRM syncs (match Lead ID), transaction imports (match Transaction ID), inventory updates (match SKU), calendar syncs (match Event ID). Features: - Auto-adds missing columns to sheet - Partial column updates (only update Phone + Status, preserve other columns) - Column order doesn't matter (auto-maps by header name) - Prevents duplicates by matching key column Example inputs: - Contact update: keyColumn='Email', headers=\['Email','Phone','Status'\], data=\[\['john@ex.com','555-0101','Active'\]\] - Inventory sync: keyColumn='SKU', headers=\['SKU','Stock','Price'\], data=\[\['WIDGET-001',50,9.99\],\['GADGET-002',30,19.99\]\] - CRM lead update: keyColumn='Lead ID', headers=\['Lead ID','Score','Status'\], data=\[\['L-12345',85,'Hot'\]\] - Partial update: keyColumn='Email', headers=\['Email','Phone'\] (only updates Phone, preserves Name/Address/etc)

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rows\` \| array \| Yes \| 2D array of data rows to upsert. IMPORTANT: If 'headers' is NOT provided, the FIRST row is treated as column headers and remaining rows as data - so you need at least 2 rows (1 header + 1 data). If 'headers' IS provided separately, then ALL rows in this array are treated as data rows. Each row should have the same number of values as headers. If a row has MORE values than headers: with strict\_mode=true (default), an error is returned showing which rows are affected; with strict\_mode=false, extra values are silently truncated. If a row has FEWER values than headers, an error is returned during execution. Cell values can be strings, numbers, booleans, or null. Example with headers provided: headers=\['Email','Status'\], rows=\[\['john@ex.com','Active'\]\] (1 data row). Example without headers: rows=\[\['Email','Status'\],\['john@ex.com','Active'\]\] (row 1 = headers, row 2 = data). \|
\| \`headers\` \| array \| No \| List of column names for the data. These will be matched against sheet headers. If a column doesn't exist in the sheet, it will be added automatically. Order doesn't need to match sheet order. Can be auto-derived from the first row in 'rows' if not provided. Example inputs: \['Email', 'Phone', 'Status'\] for contact updates, \['Lead ID', 'Name', 'Score'\] for CRM, \['SKU', 'Stock', 'Price'\] for inventory. \|
\| \`keyColumn\` \| string \| No \| The column NAME (header text) to use as unique identifier for matching rows. Must be an actual header name from the sheet (e.g., 'Email', 'Lead ID', 'SKU'), NOT a column letter (e.g., 'A', 'B', 'C'). If you provide a column letter like 'A', it will be automatically converted to the header name at that column position. If neither 'key\_column' nor 'key\_column\_index' is provided, defaults to the first column (index 0). \|
\| \`sheetName\` \| string \| Yes \| The name of the sheet/tab within the spreadsheet. Note: Google Sheets creates default sheets with localized names based on account language (e.g., 'Sheet1' for English, '工作表1' for Chinese, 'Hoja1' for Spanish, 'Feuille1' for French, 'Planilha1' for Portuguese, 'Лист1' for Russian). If you specify a common default name and the sheet is not found, the action will automatically use the first sheet if only one exists. \|
\| \`strictMode\` \| boolean \| No \| Controls how rows with mismatched column counts are handled. When True (default), an error is returned if any row has more values than headers - the error message shows exactly which rows are affected and what values would need to be removed. When False, extra values are silently truncated to match the header count. Set to False only if you explicitly want automatic truncation of extra values. \|
\| \`tableStart\` \| string \| No \| Cell where the table starts (where headers are located). Defaults to 'A1'. Use this if your table is offset (e.g., 'C5', 'D10'). \|
\| \`spreadsheetId\` \| string \| Yes \| The ID of the spreadsheet. Must be a non-empty string, typically a 44-character alphanumeric string found in the spreadsheet URL. \|
\| \`key\_column\_index\` \| string \| No \| The 0-based column index to use as unique identifier for matching rows. Alternative to 'key\_column' - will be converted to column name using headers. If neither 'key\_column' nor 'key\_column\_index' is provided, defaults to 0 (first column). Example: 0 for first column, 1 for second column. \|
\| \`normalization\_message\` \| string \| No \| Internal field to track input normalization (e.g., row truncation). Not part of API. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Validate Events

\*\*Slug:\*\* \`GOOGLESUPER\_VALIDATE\_EVENTS\`

Tool to validate Measurement Protocol events before sending them to production. Use when you need to verify event structure and parameters are correct before sending real data.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`events\` \| array \| Yes \| Required. Array of events to validate. Each event must have a 'name' field and optional 'params' object. \|
\| \`consent\` \| object \| No \| Optional. The consent state for the user. \|
\| \`user\_id\` \| string \| No \| Optional. A unique identifier for a user. \|
\| \`client\_id\` \| string \| Yes \| Required. Unique client identifier. This uniquely identifies a user instance of a web client. \|
\| \`api\_secret\` \| string \| Yes \| Required. The API secret from Google Analytics for the Measurement Protocol. \|
\| \`measurement\_id\` \| string \| Yes \| Required. The measurement ID for web streams. Format: G-XXXXXXXXXX where X is alphanumeric. \|
\| \`user\_properties\` \| object \| No \| Optional. The user properties for the measurement. \|
\| \`timestamp\_micros\` \| string \| No \| Optional. A Unix timestamp (in microseconds) for the time to associate with the event. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get spreadsheet values

\*\*Slug:\*\* \`GOOGLESUPER\_VALUES\_GET\`

Returns a range of values from a spreadsheet. Use when you need to read data from specific cells or ranges in a Google Sheet.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`range\` \| string \| Yes \| The A1 notation or R1C1 notation of the range to retrieve values from. If the sheet name contains spaces or special characters, wrap the sheet name in single quotes (e.g., "'My Sheet'!A1:B2"). Without single quotes, the API will return a 400 error for sheet names with spaces. Examples: 'Sheet1!A1:B3', "'Sheet With Spaces'!A1:D5", 'A1:D5' (no sheet name uses first visible sheet), 'Sheet1!A:A' (entire column), 'SheetName' (entire sheet). \|
\| \`end\_row\` \| integer \| No \| 1-based row number to stop reading at (inclusive). Use with start\_row for pagination to avoid large response errors. Example: start\_row=501, end\_row=1000 fetches rows 501-1000. \|
\| \`start\_row\` \| integer \| No \| 1-based row number to start reading from (inclusive). Use with end\_row for pagination to avoid large response errors. Example: start\_row=1, end\_row=500 fetches the first 500 rows. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet from which to retrieve values. This is the long alphanumeric string found in the spreadsheet URL between '/d/' and '/edit' (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'). WARNING: Do NOT use the spreadsheet name or title (e.g., 'My Sales Report'); you must use the actual ID from the URL. \|
\| \`major\_dimension\` \| string ("DIMENSION\_UNSPECIFIED" \| "ROWS" \| "COLUMNS") \| No \| The major dimension for results. \|
\| \`value\_render\_option\` \| string ("FORMATTED\_VALUE" \| "UNFORMATTED\_VALUE" \| "FORMULA") \| No \| How values should be rendered in the output. FORMATTED\_VALUE: Values are calculated and formatted (default). UNFORMATTED\_VALUE: Values are calculated but not formatted. FORMULA: Values are not calculated; the formula is returned instead. \|
\| \`date\_time\_render\_option\` \| string ("SERIAL\_NUMBER" \| "FORMATTED\_STRING") \| No \| How dates, times, and durations should be represented in the output. SERIAL\_NUMBER: Dates are returned as serial numbers (default). FORMATTED\_STRING: Dates returned as formatted strings. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update spreadsheet values

\*\*Slug:\*\* \`GOOGLESUPER\_VALUES\_UPDATE\`

Tool to set values in a range of a Google Spreadsheet. Use when you need to update or overwrite existing cell values in a specific range.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`range\` \| string \| Yes \| The A1 notation of the range to update values in (e.g., 'Sheet1!A1:C2', 'MySheet!C:C', or 'A1:D5'). Must be actual cell references, not placeholder values. If the sheet name is omitted (e.g., 'A1:B2'), the operation applies to the first visible sheet. IMPORTANT: The range must not exceed the sheet's grid dimensions. By default, new sheets have 1000 rows and 26 columns (A-Z). If you need to write to columns beyond Z (e.g., AA, AB), first expand the sheet using GOOGLESHEETS\_APPEND\_DIMENSION or check the current dimensions using GOOGLESHEETS\_GET\_SPREADSHEET\_INFO. \|
\| \`values\` \| array \| Yes \| The data to write. This is an array of arrays, the outer array representing all the data and each inner array representing a major dimension. Each item in the inner array corresponds with one cell. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet to update. This ID can be found in the URL of the spreadsheet (e.g., https://docs.google.com/spreadsheets/d/{spreadsheet\_id}/edit). Must be a non-empty string. \|
\| \`major\_dimension\` \| string ("ROWS" \| "COLUMNS") \| No \| The major dimension of the values. ROWS (default) means each inner array is a row of values. COLUMNS means each inner array is a column of values. Defaults to ROWS if unspecified. \|
\| \`auto\_expand\_sheet\` \| boolean \| No \| If True (default), automatically expands the sheet's dimensions (adds columns/rows) when the target range exceeds the current grid limits. If False, the operation will fail with an error if the range exceeds grid limits. \|
\| \`value\_input\_option\` \| string ("RAW" \| "USER\_ENTERED") \| Yes \| How the input data should be interpreted. RAW: Values are stored exactly as entered, without parsing (dates, formulas, etc. remain as strings). USER\_ENTERED: Values are parsed as if typed by a user (numbers stay numbers, strings prefixed with '=' become formulas, etc.). \|
\| \`include\_values\_in\_response\` \| boolean \| No \| Determines if the update response should include the values of the cells that were updated. By default, responses do not include the updated values. \|
\| \`response\_value\_render\_option\` \| string ("FORMATTED\_VALUE" \| "UNFORMATTED\_VALUE" \| "FORMULA") \| No \| Determines how values in the response should be rendered. Only used if includeValuesInResponse is true. FORMATTED\_VALUE (default): Values are formatted as displayed in the UI. UNFORMATTED\_VALUE: Values are unformatted (numbers, booleans, formulas). FORMULA: Formulas are not evaluated and remain as text. \|
\| \`response\_datetime\_render\_option\` \| string ("SERIAL\_NUMBER" \| "FORMATTED\_STRING") \| No \| Determines how dates, times, and durations in the response should be rendered. Only used if includeValuesInResponse is true. SERIAL\_NUMBER (default): Dates are returned as numbers. FORMATTED\_STRING: Dates are returned as strings formatted per the cell's locale. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Watch Drive Changes

\*\*Slug:\*\* \`GOOGLESUPER\_WATCH\_CHANGES\`

Tool to subscribe to changes for a user or shared drive in Google Drive. Use when you need to monitor a Google Drive for modifications and receive notifications at a specified webhook URL. Notifications may be batched rather than per-change; design handlers to be idempotent and fetch all changes since the last known page\_token on each notification.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| A unique string that identifies this channel. UUIDs are recommended. Must be unique per active channel; reusing an ID can cause missed, delayed, or duplicate notifications. \|
\| \`type\` \| string \| Yes \| The type of delivery mechanism for notifications. \|
\| \`token\` \| string \| No \| An arbitrary string that will be delivered with each notification. Can be used for verification. \|
\| \`params\` \| object \| No \| Optional parameters for the notification channel. Example: {"ttl": "3600"} for a 1-hour time-to-live (actual support depends on Google API). \|
\| \`spaces\` \| string \| No \| A comma-separated list of spaces to query within the corpora. Supported values are 'drive' and 'appDataFolder'. \|
\| \`address\` \| string \| Yes \| The URL where notifications are to be delivered. Must be a publicly reachable HTTPS URL with a valid SSL certificate; HTTP, localhost, and private network endpoints are rejected by the API. \|
\| \`drive\_id\` \| string \| No \| The shared drive from which changes will be returned. If specified, change IDs will be specific to the shared drive. \|
\| \`page\_size\` \| integer \| No \| The maximum number of changes to return per page. \|
\| \`expiration\` \| integer \| No \| Timestamp in milliseconds since the epoch for when the channel should expire. If not set, channel may not expire or have a default expiration. Channels are invalidated after expiry; re-establish the watch with a new channel before or after expiration to avoid missed changes. \|
\| \`page\_token\` \| string \| No \| The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response or to the response from the getStartPageToken method. Persist this token per channel so change processing can resume correctly after restarts or interruptions. \|
\| \`include\_labels\` \| string \| No \| A comma-separated list of IDs of labels to include in the labelInfo part of the response. \|
\| \`include\_removed\` \| boolean \| No \| Whether to include changes indicating that items have been removed from the list of changes (e.g., by deletion or loss of access). \|
\| \`supports\_all\_drives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. Recommended to set to true if driveId is used or if interactions with shared drives are expected. \|
\| \`restrict\_to\_my\_drive\` \| boolean \| No \| Whether to restrict the results to changes inside the My Drive hierarchy. This omits changes to files like those in the Application Data folder or shared files not added to My Drive. \|
\| \`include\_corpus\_removals\` \| boolean \| No \| Whether changes should include the file resource if the file is still accessible by the user at the time of the request, even when a file was removed from the list of changes. \|
\| \`include\_permissions\_for\_view\` \| string \| No \| Specifies which additional view's permissions to include in the response. \|
\| \`include\_items\_from\_all\_drives\` \| boolean \| No \| Whether both My Drive and shared drive items should be included in results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Watch File for Changes

\*\*Slug:\*\* \`GOOGLESUPER\_WATCH\_FILE\`

Tool to subscribe to push notifications for changes to a specific file. Use when you need to monitor a file for modifications and receive real-time notifications at a webhook URL.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| A UUID or similar unique string that identifies this notification channel (max 64 characters). \|
\| \`type\` \| string ("web\_hook" \| "webhook") \| Yes \| The type of delivery mechanism used for this channel. \|
\| \`token\` \| string \| No \| An arbitrary string delivered to the target address with each notification for verification (max 256 characters). \|
\| \`fileId\` \| string \| Yes \| The ID of the file to watch for changes. \|
\| \`params\` \| object \| No \| Additional parameters controlling delivery channel behavior. \|
\| \`address\` \| string \| Yes \| The HTTPS address where notifications are delivered for this channel. Must have a valid SSL certificate. \|
\| \`payload\` \| boolean \| No \| Whether payload data should be included in notifications. \|
\| \`expiration\` \| integer \| No \| Date and time of notification channel expiration as Unix timestamp in milliseconds. Default: 3600 seconds, max: 86400 seconds for files. \|
\| \`includeLabels\` \| string \| No \| A comma-separated list of IDs of labels to include in the labelInfo part of the response. \|
\| \`acknowledgeAbuse\` \| boolean \| No \| Whether the user is acknowledging the risk of downloading known malware or other abusive files. Only applicable to file owner/organizer. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. \|
\| \`supportsTeamDrives\` \| boolean \| No \| Deprecated. Use supportsAllDrives instead. \|
\| \`includePermissionsForView\` \| string \| No \| Specifies which additional view's permissions to include in the response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\## Triggers

\### Aggregate Metric Changed

\*\*Slug:\*\* \`GOOGLESUPER\_AGGREGATE\_METRIC\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when an aggregate metric (SUM/COUNT/AVG/MIN/MAX) changes in a Google Sheets spreadsheet.
This trigger monitors an aggregate calculation on a target column (optionally filtered by a search column/value)
and fires when the calculated result changes.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`case\_sensitive\` \| boolean \| No \| Whether the search should be case-sensitive when filtering by search\_column and search\_value. \|
\| \`has\_header\_row\` \| boolean \| No \| Whether the first row contains column headers. If True, column names can be used for search\_column and target\_column. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`operation\` \| string \| Yes \| The mathematical operation to perform on the target column values. Supported operations: sum, average, count, min, max, percentage. \|
\| \`percentage\_total\` \| number \| No \| For percentage operation, the total value to calculate percentage against. If not provided, uses sum of all values in target column. \|
\| \`search\_column\` \| string \| No \| The column to search in for filtering rows. Can be a letter (e.g., 'A', 'B') or column name from header row (e.g., 'Region', 'Department'). If not provided, all rows in the target column will be aggregated without filtering. \|
\| \`search\_value\` \| string \| No \| The exact value to search for in the search column. Case-sensitive by default. If not provided (or if search\_column is not provided), all rows in the target column will be aggregated without filtering. \|
\| \`sheet\_name\` \| string \| Yes \| The name of the specific sheet within the spreadsheet to monitor. Matching is case-insensitive. If no exact match is found, partial matches will be attempted (e.g., 'overview' will match 'Overview 2025'). \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Sheets spreadsheet to monitor. This is the long alphanumeric string found in the spreadsheet URL between '/d/' and '/edit'. \|
\| \`target\_column\` \| string \| Yes \| The column to aggregate data from. Can be a letter (e.g., 'C', 'D') or column name from header row (e.g., 'Sales', 'Revenue'). \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`current\_result\` \| number \| Yes \| The current aggregate metric value \|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the change was detected \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`matching\_rows\_count\` \| integer \| Yes \| Number of rows that matched the search condition \|
\| \`operation\` \| string \| Yes \| The aggregation operation performed \|
\| \`previous\_result\` \| number \| Yes \| The previous aggregate metric value \|
\| \`processed\_values\_count\` \| integer \| Yes \| Number of values that were processed in the aggregation \|
\| \`search\_details\` \| object \| Yes \| Details of the search/filter used to select rows prior to aggregation \|
\| \`sheet\_name\` \| string \| Yes \| The sheet name \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|

\### Attendee Response Changed

\*\*Slug:\*\* \`GOOGLESUPER\_ATTENDEE\_RESPONSE\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Polling trigger that fires when any attendee's RSVP changes to
accepted, declined, or tentative. Returns attendee info and current status.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendarId\` \| string \| No \| The unique identifier for the calendar \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`showDeleted\` \| boolean \| No \| Whether to include deleted events in the results \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`attendee\_email\` \| string \| No \| Email of the attendee whose RSVP changed \|
\| \`attendee\_name\` \| string \| No \| Display name of the attendee \|
\| \`calendar\_id\` \| string \| Yes \| The calendar identifier \|
\| \`event\_html\_link\` \| string \| No \| Link to the event in Google Calendar \|
\| \`event\_id\` \| string \| Yes \| The unique identifier of the event \|
\| \`event\_summary\` \| string \| No \| Event title/summary \|
\| \`previous\_response\_status\` \| string \| No \| Previous RSVP status \|
\| \`response\_status\` \| string \| Yes \| Current RSVP status (accepted, declined, tentative) \|

\### Cell Range Values Changed

\*\*Slug:\*\* \`GOOGLESUPER\_CELL\_RANGE\_VALUES\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when values in a specified A1 range change in Google Sheets.
This trigger monitors a specific cell or range of cells and fires when any values change.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`range\` \| string \| Yes \| The A1 notation of the range to monitor for changes (can be a single cell or multi-cell range). If the sheet name contains spaces or special characters, wrap the sheet name in single quotes. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet to monitor. This is the long alphanumeric string found in the spreadsheet URL between '/d/' and '/edit'. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`current\_values\` \| array \| Yes \| The current values in the range \|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the change was detected \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`previous\_values\` \| array \| Yes \| The previous values in the range \|
\| \`range\` \| string \| Yes \| The A1 notation of the monitored range \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|

\### Comment Added (Docs/Sheets/Slides)

\*\*Slug:\*\* \`GOOGLESUPER\_COMMENT\_ADDED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new comment is added to Google Docs, Sheets, or Slides.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| No \| If provided, monitor comments only for this specific file ID. If omitted, the trigger scans recent Docs/Sheets/Slides files for new comments. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_files\` \| integer \| No \| Maximum number of recent Docs/Sheets/Slides files to inspect in each poll when no file ID is specified. Values above 100 are clamped at runtime to protect Drive quota — comments.list is a per-file fanout. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`comment\_id\` \| string \| Yes \| The ID of the comment \|
\| \`comment\_text\` \| string \| No \| The plain text content of the comment \|
\| \`commenter\` \| object \| No \| Information about the commenter (displayName, permissionId, photoLink, me). \|
\| \`created\_time\` \| string \| No \| The time the comment was created (RFC 3339) \|
\| \`file\_id\` \| string \| Yes \| The ID of the file on which the comment was added \|

\### Conditional Format Rule Changed

\*\*Slug:\*\* \`GOOGLESUPER\_CONDITIONAL\_FORMAT\_RULE\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when conditional formatting rules change in a Google Spreadsheet.
Detects when rules are added, updated, or removed.
Uses snapshot-based diffing to detect changes between polls.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`sheet\_id\` \| integer \| No \| Optional filter: monitor only the sheet with this exact numeric sheetId. If not provided, monitors all sheets. If both sheet\_title and sheet\_id are provided, sheet\_id takes precedence. \|
\| \`sheet\_title\` \| string \| No \| Optional filter: monitor only the sheet with this exact title. If not provided, monitors all sheets. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet to monitor for conditional formatting rule changes \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`change\_type\` \| string \| Yes \| Type of change: 'added', 'updated', or 'removed' \|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the change was detected \|
\| \`rules\` \| array \| Yes \| List of rules that changed \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|

\### Data Validation Rule Changed

\*\*Slug:\*\* \`GOOGLESUPER\_DATA\_VALIDATION\_RULE\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when data validation rules change (added/updated/removed) in a Google Spreadsheet.
Uses snapshot-based diffing to detect changes between polls.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`ranges\` \| array \| No \| Optional list of A1 ranges to monitor. If omitted, the entire sheet(s) will be monitored. \|
\| \`sheet\_id\` \| integer \| No \| Optional sheet ID to filter by. If omitted, all sheets will be monitored. \|
\| \`sheet\_title\` \| string \| No \| Optional sheet title to filter by. If omitted, all sheets will be monitored. \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet to monitor for data validation rule changes. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`change\_type\` \| string \| Yes \| Type of change: 'added', 'updated', or 'removed' \|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the change was detected \|
\| \`rules\` \| array \| Yes \| List of validation rules that changed \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|

\### Developer Metadata Changed

\*\*Slug:\*\* \`GOOGLESUPER\_DEVELOPER\_METADATA\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when developer metadata entries change (new/updated/removed) in a Google Spreadsheet.
Uses snapshot-based diffing to detect changes between polls.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\_filters\` \| array \| No \| The data filters describing the criteria used to determine which DeveloperMetadata entries to monitor. If not specified, monitors all developer metadata. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet to monitor for developer metadata changes. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`change\_type\` \| string \| Yes \| Type of change: 'created', 'updated', or 'removed' \|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the change was detected \|
\| \`metadata\_items\` \| array \| Yes \| List of metadata items that changed \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|

\### New Document Created

\*\*Slug:\*\* \`GOOGLESUPER\_DOCUMENT\_CREATED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new Google Doc is created.
This trigger monitors Google Docs and fires when new documents are detected.
Uses timestamp filtering to efficiently poll for new documents.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_results\` \| integer \| No \| Maximum number of documents to check in each poll (1-1000) \|
\| \`query\` \| string \| No \| Optional search query to filter documents. Can search by name (name contains 'report'), full text content (fullText contains 'important'), or use complex queries with operators like 'and', 'or', 'not'. Leave empty to monitor all documents. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`document\` \| object \| Yes \| The newly created Google document \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|

\### Document Deleted

\*\*Slug:\*\* \`GOOGLESUPER\_DOCUMENT\_DELETED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when an existing Google Doc is deleted (moved to trash).
This trigger monitors Google Docs and fires when documents are trashed.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_results\` \| integer \| No \| Maximum number of documents to check in each poll (1-1000) \|
\| \`query\` \| string \| No \| Optional search query to filter documents. Leave empty to monitor all documents for deletion. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`document\` \| object \| Yes \| The deleted Google document \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|

\### Document Placeholder Filled

\*\*Slug:\*\* \`GOOGLESUPER\_DOCUMENT\_PLACEHOLDER\_FILLED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a Google Doc's plain text changes such that a configured placeholder
token/pattern is no longer present (i.e., the document has been filled in).

This trigger monitors a specific Google Doc and fires when a placeholder pattern
that was previously present is no longer found in the document's plain text.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`case\_sensitive\` \| boolean \| No \| Whether the placeholder pattern matching should be case-sensitive. \|
\| \`document\_id\` \| string \| Yes \| The unique identifier for the Google Document to monitor. Accepts either a document ID (typically a 44-character alphanumeric string) or a full Google Docs URL. \|
\| \`include\_footers\` \| boolean \| No \| Whether to include footer text when checking for placeholders. \|
\| \`include\_footnotes\` \| boolean \| No \| Whether to include footnote text when checking for placeholders. \|
\| \`include\_headers\` \| boolean \| No \| Whether to include header text when checking for placeholders. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`placeholder\_pattern\` \| string \| Yes \| The placeholder token/pattern to monitor (e.g., '{{NAME}}', '\[FILL\_ME\]', 'TODO'). Can be a literal string or a regex pattern if use\_regex is enabled. \|
\| \`use\_regex\` \| boolean \| No \| If true, treat placeholder\_pattern as a regex pattern. If false, treat it as a literal string. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`document\` \| object \| Yes \| The document that was filled in \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`placeholder\_pattern\` \| string \| Yes \| The placeholder pattern that is no longer present \|

\### Document Search Update

\*\*Slug:\*\* \`GOOGLESUPER\_DOCUMENT\_SEARCH\_UPDATE\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a Google Doc matching a user-defined search query is newly created or updated since the last poll.
This trigger uses timestamp filtering to efficiently monitor documents.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`include\_shared\_drives\` \| boolean \| No \| Whether to include documents from shared drives you have access to. Defaults to True. \|
\| \`include\_trashed\` \| boolean \| No \| Whether to include documents in trash. Defaults to False. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_results\` \| integer \| No \| Maximum number of documents to check in each poll (1-100) \|
\| \`query\` \| string \| Yes \| Search query to filter documents. Provide either: (1) Plain text to search in document content (e.g., 'quarterly report'), which will search fullText, or (2) Drive API query syntax with operators like 'name contains', 'fullText contains', combined with 'and', 'or', 'not'. \|
\| \`shared\_with\_me\` \| boolean \| No \| Whether to return only documents shared with the current user. Defaults to False. \|
\| \`starred\_only\` \| boolean \| No \| Whether to return only starred documents. Defaults to False. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`document\` \| object \| Yes \| The document that was created or updated \|
\| \`event\_type\` \| string \| Yes \| Type of event that occurred: 'document\_created' or 'document\_updated' \|

\### Document Structure Changed

\*\*Slug:\*\* \`GOOGLESUPER\_DOCUMENT\_STRUCTURE\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a Google Doc's structure changes (headers/footers added/removed, tables/images count changes).
This trigger monitors a specific document for structural changes like:
\- Headers added or removed
\- Footers added or removed
\- Tables added or removed
\- Images (inline objects) added or removed
\- Positioned objects added or removed
\- Footnotes added or removed

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`document\_id\` \| string \| Yes \| The unique identifier for the Google Docs document to monitor. You can provide either a document ID or a full Google Docs URL. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`changes\` \| array \| Yes \| List of structural changes detected \|
\| \`current\_snapshot\` \| object \| Yes \| Current structural snapshot of the document \|
\| \`document\_id\` \| string \| Yes \| ID of the document that changed \|
\| \`document\_title\` \| string \| Yes \| Title of the document \|
\| \`document\_url\` \| string \| Yes \| URL to view the document \|
\| \`previous\_snapshot\` \| object \| No \| Snapshot of document structural elements. \|

\### Document Updated

\*\*Slug:\*\* \`GOOGLESUPER\_DOCUMENT\_UPDATED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when an existing Google Doc is updated or modified.
This trigger monitors Google Docs and fires when documents are updated.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_results\` \| integer \| No \| Maximum number of documents to check in each poll (1-1000) \|
\| \`query\` \| string \| No \| Optional search query to filter documents. Leave empty to monitor all documents. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`document\` \| object \| Yes \| The updated Google document \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|

\### Document Word Count Threshold

\*\*Slug:\*\* \`GOOGLESUPER\_DOCUMENT\_WORD\_COUNT\_THRESHOLD\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a Google Doc's word/character count crosses a user-defined threshold.
This trigger monitors a specific Google Doc and fires when its word or character count
becomes greater than or equal to the configured threshold value.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`document\_id\` \| string \| Yes \| The unique identifier for the Google Document to monitor. Accepts either a document ID (typically a 44-character alphanumeric string) or a full Google Docs URL. When a URL is provided, the document ID will be automatically extracted. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`use\_character\_count\` \| boolean \| No \| If True, use character count instead of word count for the threshold comparison. \|
\| \`word\_count\_threshold\` \| integer \| No \| The word count threshold. Trigger fires when the document's word count becomes greater than or equal to this value. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`current\_character\_count\` \| integer \| Yes \| The current character count of the document \|
\| \`current\_word\_count\` \| integer \| Yes \| The current word count of the document \|
\| \`document\_id\` \| string \| Yes \| The unique identifier of the document \|
\| \`document\_title\` \| string \| Yes \| The title of the document \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`previous\_character\_count\` \| integer \| Yes \| The previous character count of the document \|
\| \`previous\_word\_count\` \| integer \| Yes \| The previous word count of the document \|
\| \`threshold\` \| integer \| Yes \| The configured threshold value \|
\| \`threshold\_type\` \| string \| Yes \| Whether the threshold is for 'words' or 'characters' \|
\| \`web\_view\_link\` \| string \| Yes \| Link to view the document in browser \|

\### Email Sent

\*\*Slug:\*\* \`GOOGLESUPER\_EMAIL\_SENT\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a Gmail message is sent by the authenticated user. It polls the
'SENT' label and emits metadata including sender, recipients, subject, timestamp,
and thread ID.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`query\` \| string \| No \| Optional additional Gmail search query to further filter sent messages. Uses Gmail search syntax (e.g., to:example@domain.com subject:report). \|
\| \`userId\` \| string \| No \| The user's email address or 'me' for the authenticated user. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`attachment\_list\` \| array \| No \| The list of attachments in the sent message \|
\| \`bcc\` \| string \| No \| Bcc recipients \|
\| \`cc\` \| string \| No \| Cc recipients \|
\| \`message\_id\` \| string \| No \| Gmail message ID \|
\| \`message\_text\` \| string \| No \| The text of the sent message \|
\| \`message\_timestamp\` \| string \| No \| Timestamp of the sent message in ISO format \|
\| \`payload\` \| object \| No \| Raw Gmail payload \|
\| \`recipients\` \| string \| No \| Comma-separated list of all recipients (To, Cc, Bcc) \|
\| \`sender\` \| string \| No \| Sender email \|
\| \`subject\` \| string \| No \| Email subject \|
\| \`thread\_id\` \| string \| No \| Gmail thread ID \|
\| \`to\` \| string \| No \| To recipients \|

\### Event Canceled or Deleted

\*\*Slug:\*\* \`GOOGLESUPER\_EVENT\_CANCELED\_DELETED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a Google Calendar event is cancelled or deleted.
Returns minimal data: event\_id, summary (if available), and cancellation timestamp.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendarId\` \| string \| No \| The unique identifier for the calendar to monitor \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cancelled\_at\` \| string \| No \| Cancellation timestamp (from event.updated) \|
\| \`event\_id\` \| string \| Yes \| The unique identifier of the event \|
\| \`summary\` \| string \| No \| Event title/summary (may be missing for cancelled events) \|

\### Event Starting Soon

\*\*Slug:\*\* \`GOOGLESUPER\_EVENT\_STARTING\_SOON\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a calendar event is within a configured number of minutes from starting.
Returns event details, time remaining, attendees, and join links when available.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendarId\` \| string \| No \| The unique identifier for the calendar to monitor \|
\| \`countdownWindowMinutes\` \| integer \| No \| Look-ahead window (in minutes) for upcoming events to evaluate \|
\| \`includeAllDay\` \| boolean \| No \| Whether to consider all-day events (default False) \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`minutesBeforeStart\` \| integer \| No \| Trigger when an event is within this many minutes from starting \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`attendees\` \| array \| No \| List of attendees \|
\| \`calendar\_id\` \| string \| Yes \| The calendar identifier \|
\| \`countdown\_window\_minutes\` \| integer \| Yes \| Countdown window used for this trigger \|
\| \`creator\_email\` \| string \| No \| Email of the event creator \|
\| \`description\` \| string \| No \| Event description \|
\| \`event\_id\` \| string \| Yes \| The unique identifier of the event \|
\| \`hangout\_link\` \| string \| No \| Google Meet link for the conference, if available \|
\| \`html\_link\` \| string \| No \| Link to the event in Google Calendar \|
\| \`location\` \| string \| No \| Event location \|
\| \`minutes\_until\_start\` \| number \| No \| Minutes remaining until event starts (>= 0) \|
\| \`organizer\_email\` \| string \| No \| Email of the event organizer \|
\| \`start\_time\` \| string \| No \| Event start time in ISO format \|
\| \`start\_timestamp\` \| number \| No \| Event start time as UNIX epoch timestamp (UTC) \|
\| \`summary\` \| string \| No \| Event title/summary \|

\### File Created

\*\*Slug:\*\* \`GOOGLESUPER\_FILE\_CREATED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new file is created in Google Drive.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`folder\_id\` \| string \| No \| If provided, monitor only files within this folder (by folder ID). Adds the filter \`'folder\_id' in parents\` to the query. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_results\` \| integer \| No \| Maximum number of newly-created files to emit in a single poll. Acts as an event cap, not an API page size — the trigger paginates Drive responses internally. \|
\| \`query\` \| string \| No \| Optional Drive search query to filter files. Examples: name contains 'report', mimeType = 'application/pdf', or complex queries like name contains 'project' and mimeType != 'application/vnd.google-apps.folder'. Leave empty to monitor all files. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`creator\` \| object \| No \| Information about the file's creator (derived as first owner if available) \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`file\` \| object \| Yes \| The newly created Google Drive file \|

\### File Deleted or Trashed

\*\*Slug:\*\* \`GOOGLESUPER\_FILE\_DELETED\_OR\_TRASHED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a file is moved to trash or permanently deleted in Drive.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`drive\_id\` \| string \| No \| Optional shared drive ID to monitor. When unset, the trigger monitors My Drive plus shared drives surfaced by \`include\_items\_from\_all\_drives\`. \|
\| \`include\_corpus\_removals\` \| boolean \| No \| Include changes where the user lost access to the file (e.g. permission removal). When false, only true deletions and trash events surface. \|
\| \`include\_items\_from\_all\_drives\` \| boolean \| No \| Whether items from My Drive AND all visible shared drives should appear in results. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`page\_size\` \| integer \| No \| Maximum number of changes per \`changes.list\` page (1-1000). \|
\| \`restrict\_to\_my\_drive\` \| boolean \| No \| If true, restrict results to changes inside the My Drive hierarchy. \|
\| \`spaces\` \| string \| No \| Comma-separated list of spaces to query. Supported values are 'drive' and 'appDataFolder'. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`deletion\_timestamp\` \| string \| Yes \| Timestamp of the delete/trash event in RFC 3339 format \|
\| \`event\_type\` \| string \| Yes \| Type of deletion event. Either 'trashed' (soft-delete, recoverable from the user's trash) or 'removed' (hard-delete or, when include\_corpus\_removals=true, access loss). \|
\| \`file\_id\` \| string \| Yes \| ID of the file that was deleted or trashed \|
\| \`name\` \| string \| No \| Name of the file. May be absent when the file was permanently removed (the file resource is gone, only the change record remains). \|

\### File Shared (Permissions Added)

\*\*Slug:\*\* \`GOOGLESUPER\_FILE\_SHARED\_PERMISSIONS\_ADDED\`

\*\*Type:\*\* poll

Triggers when new sharing permissions are granted to a file or folder.

Uses Drive's \`changes.list\` endpoint with inline \`permissions\` in the
\`fields\` mask so each change carries the file's current permission set
provider-atomically. We diff that against \`seen\_permission\_keys\` to
identify newly added grants. Drive page tokens are the primary cursor;
if Drive rejects a stored token, the trigger raises \`PollingTriggerError\`
without clearing state rather than silently re-baselining and dropping
events.

Limitation: truly ephemeral permissions (added and revoked between two
polls without any other file modification in between) are not detected.
Drive Activity API would catch those but requires an additional OAuth
scope and a different payload contract.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`drive\_id\` \| string \| No \| The shared drive ID to monitor. If omitted, monitors My Drive and any shared drives surfaced via include\_items\_from\_all\_drives. \|
\| \`file\_id\` \| string \| No \| If provided, only emit permission changes for this specific file or folder ID. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`page\_size\` \| integer \| No \| Maximum number of changes to fetch per \`changes.list\` page (1-1000). \|
\| \`supports\_all\_drives\` \| boolean \| No \| Whether to include both My Drive and shared drives when monitoring changes. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`new\_permissions\` \| array \| No \| List of newly detected permissions \|

\### File Updated

\*\*Slug:\*\* \`GOOGLESUPER\_FILE\_UPDATED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a file's metadata or content changes in Google Drive.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`content\_only\` \| boolean \| No \| When true, fire only on content changes (new revision) and suppress metadata-only updates such as rename or move. Relies on \`headRevisionId\`, which Drive only exposes for binary files — Google-native docs (Docs/Sheets/Slides) do not carry \`headRevisionId\` and will not fire this trigger under \`content\_only=true\`. \|
\| \`drive\_id\` \| string \| No \| Optional shared drive ID to monitor. When unset, the trigger monitors My Drive plus shared drives surfaced by \`include\_items\_from\_all\_drives\`. \|
\| \`include\_items\_from\_all\_drives\` \| boolean \| No \| Whether items from My Drive AND all visible shared drives should appear in results. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`page\_size\` \| integer \| No \| Maximum number of changes per \`changes.list\` page (1-1000). \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\_id\` \| string \| Yes \| The ID of the file that changed \|
\| \`last\_modifying\_user\` \| object \| No \| Information about the last user who modified the file \|
\| \`modified\_time\` \| string \| No \| The last time the file was modified (RFC 3339 date-time) \|

\### Filtered Range Values Changed

\*\*Slug:\*\* \`GOOGLESUPER\_FILTERED\_RANGE\_VALUES\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Polling trigger that monitors Google Sheets filtered ranges for value changes.
Uses snapshot-based diffing to detect when values matching a data filter change.
Emits the matched values when changes are detected.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\_filters\` \| array \| Yes \| List of data filters specifying which ranges to monitor for changes. Each filter can specify either 'a1Range' (e.g., 'Sheet1!A1:B10') or 'gridRange'. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`major\_dimension\` \| string ("ROWS" \| "COLUMNS") \| No \| The major dimension that results should use. ROWS returns \[\[1,2\],\[3,4\]\], COLUMNS returns \[\[1,3\],\[2,4\]\] \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet to monitor \|
\| \`value\_render\_option\` \| string ("FORMATTED\_VALUE" \| "UNFORMATTED\_VALUE" \| "FORMULA") \| No \| How values should be represented in the output \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`change\_type\` \| string ("created" \| "updated" \| "deleted") \| Yes \| Type of change detected \|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the change was detected \|
\| \`new\_values\` \| array \| Yes \| Current values in the range \|
\| \`old\_values\` \| array \| No \| Previous values in the range (None if new) \|
\| \`range\_identifier\` \| string \| Yes \| The A1 notation or identifier of the range that changed \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|

\### New Folder Created in Root

\*\*Slug:\*\* \`GOOGLESUPER\_FOLDER\_CREATED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new folder is created in the root folder of Google Drive.
This trigger monitors Google Drive and fires when new folders are detected in the root directory.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_results\` \| integer \| No \| Maximum number of folders to check in each poll (1-1000) \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`folder\` \| object \| Yes \| The newly created Google Drive folder \|

\### Calendar Event Changes

\*\*Slug:\*\* \`GOOGLESUPER\_GOOGLE\_CALENDAR\_EVENT\_CHANGE\_TRIGGER\`

\*\*Type:\*\* webhook

\*\*SOON TO BE DEPRECATED\*\* - Use Calendar Event Sync (polling trigger) instead.
Real-time webhook trigger for calendar event changes. Returns event metadata only.
For full event data, use Calendar Event Sync (polling trigger).

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendar\_id\` \| string \| No \| The unique identifier for the calendar \|
\| \`ttl\` \| integer \| No \| The time-to-live in seconds for the notification channel \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`channel\_id\` \| string \| Yes \| The unique identifier passed to identify this channel \|
\| \`resource\_id\` \| string \| Yes \| The unique identifier of the resource \|
\| \`resource\_state\` \| string \| Yes \| The state of the resource \|
\| \`resource\_url\` \| string \| Yes \| The url for the resource \|

\### Event Created

\*\*Slug:\*\* \`GOOGLESUPER\_GOOGLE\_CALENDAR\_EVENT\_CREATED\_TRIGGER\`

\*\*Type:\*\* poll

Polling trigger that fires when a new calendar event is created.
Returns event ID, summary, start/end times, and organizer info.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendarId\` \| string \| No \| The unique identifier for the calendar \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`showDeleted\` \| boolean \| No \| Whether to include deleted events in the results \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendar\_id\` \| string \| Yes \| The calendar identifier \|
\| \`end\_time\` \| string \| No \| Event end time in ISO format \|
\| \`event\_id\` \| string \| Yes \| The unique identifier of the event \|
\| \`organizer\_email\` \| string \| No \| Email of the event organizer \|
\| \`organizer\_name\` \| string \| No \| Name of the event organizer \|
\| \`start\_time\` \| string \| No \| Event start time in ISO format \|
\| \`summary\` \| string \| No \| Event title/summary \|

\### Calendar Event Sync

\*\*Slug:\*\* \`GOOGLESUPER\_GOOGLE\_CALENDAR\_EVENT\_SYNC\_TRIGGER\`

\*\*Type:\*\* poll

Polling trigger that returns full event data including details, attendees, and metadata.
For real-time notifications with basic info, use Calendar Event Changes (webhook).

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendarId\` \| string \| No \| The unique identifier for the calendar \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`showDeleted\` \| boolean \| No \| Whether to include deleted events in the results \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`attendees\` \| array \| No \| List of attendees \|
\| \`calendar\_id\` \| string \| Yes \| The calendar identifier \|
\| \`conference\_data\` \| object \| No \| Conference data structure containing details about the meeting \|
\| \`created\_at\` \| string \| No \| When the event was created \|
\| \`creator\_email\` \| string \| No \| Email of the event creator \|
\| \`creator\_name\` \| string \| No \| Name of the event creator \|
\| \`description\` \| string \| No \| Event description \|
\| \`end\_time\` \| string \| No \| Event end time in ISO format \|
\| \`event\_id\` \| string \| Yes \| The unique identifier of the event \|
\| \`event\_type\` \| string \| Yes \| Type of change: created, updated, or deleted \|
\| \`hangout\_link\` \| string \| No \| Google Meet link for the conference, if available \|
\| \`html\_link\` \| string \| No \| Link to the event in Google Calendar \|
\| \`location\` \| string \| No \| Event location \|
\| \`organizer\_email\` \| string \| No \| Email of the event organizer \|
\| \`organizer\_name\` \| string \| No \| Name of the event organizer \|
\| \`recurring\_event\_id\` \| string \| No \| ID of recurring event if applicable \|
\| \`start\_time\` \| string \| No \| Event start time in ISO format \|
\| \`status\` \| string \| No \| Event status (confirmed, tentative, cancelled) \|
\| \`summary\` \| string \| No \| Event title/summary \|
\| \`updated\_at\` \| string \| No \| When the event was last updated \|
\| \`visibility\` \| string \| No \| Event visibility \|

\### Event Updated

\*\*Slug:\*\* \`GOOGLESUPER\_GOOGLE\_CALENDAR\_EVENT\_UPDATED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when an existing Google Calendar event is modified. Returns the event ID,
change type, and the specific fields that changed with their previous and new values.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendarId\` \| string \| No \| The unique identifier for the calendar \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`showDeleted\` \| boolean \| No \| Whether to include deleted (cancelled) events in the results \|
\| \`tracked\_fields\` \| array \| No \| List of event fields to track for changes. start and end are compared as RFC3339 strings (preferring dateTime over date). Attendees are compared by email, displayName, responseStatus, and optional flag. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`calendar\_id\` \| string \| Yes \| The calendar identifier \|
\| \`change\_type\` \| string \| No \| Type of change. Always 'updated' for this trigger \|
\| \`event\_id\` \| string \| Yes \| The unique identifier of the event \|
\| \`updated\_at\` \| string \| No \| When the event was last updated (RFC3339) \|
\| \`updated\_fields\` \| object \| Yes \| Dictionary of changed fields with old and new values \|

\### Google Drive Changes

\*\*Slug:\*\* \`GOOGLESUPER\_GOOGLE\_DRIVE\_CHANGES\`

\*\*Type:\*\* poll

Triggers when changes are detected in a Google Drive.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`drive\_id\` \| string \| No \| Optional shared drive ID to monitor. When unset, the trigger monitors the user's My Drive plus any shared drives surfaced by \`include\_items\_from\_all\_drives\`. \|
\| \`include\_items\_from\_all\_drives\` \| boolean \| No \| Whether items from My Drive AND all visible shared drives should appear in results. Required for shared-drive coverage. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`restrict\_to\_my\_drive\` \| boolean \| No \| If true, restrict results to changes inside the My Drive hierarchy even when \`include\_items\_from\_all\_drives\` is true. \|
\| \`spaces\` \| string \| No \| Comma-separated list of spaces to query. Supported values are 'drive' and 'appDataFolder'. \|

\### Keyword Detected in Document

\*\*Slug:\*\* \`GOOGLESUPER\_KEYWORD\_DETECTED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a specific keyword or phrase first appears in a Google Doc.
This trigger monitors a Google Doc and fires once when the specified keyword is detected.
After the keyword is found, the trigger will not fire again until reset.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`case\_sensitive\` \| boolean \| No \| Whether the keyword search should be case-sensitive. Set to False to ignore case when matching. \|
\| \`document\_id\` \| string \| Yes \| The unique identifier for the Google Document to monitor. Accepts either a document ID (typically a 44-character alphanumeric string) or a full Google Docs URL. \|
\| \`include\_footers\` \| boolean \| No \| Whether to include footer text when searching for the keyword. \|
\| \`include\_footnotes\` \| boolean \| No \| Whether to include footnote text when searching for the keyword. \|
\| \`include\_headers\` \| boolean \| No \| Whether to include header text when searching for the keyword. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`keyword\` \| string \| Yes \| The keyword or phrase to detect in the document (case-sensitive). The trigger will fire when this text first appears anywhere in the document's plain text. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`document\_id\` \| string \| Yes \| The ID of the document \|
\| \`document\_title\` \| string \| Yes \| The title of the document \|
\| \`document\_url\` \| string \| Yes \| Web view link to the document in Google Docs \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`keyword\` \| string \| Yes \| The keyword that was detected \|
\| \`plain\_text\_excerpt\` \| string \| Yes \| A short excerpt of the document text around the keyword (max 500 chars) \|

\### New File Matching Query

\*\*Slug:\*\* \`GOOGLESUPER\_NEW\_FILE\_MATCHING\_QUERY\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new Google Drive file matches a provided query.

This is the legacy query-centric trigger: it preserves Drive API query
config such as \`\`corpora\`\` / \`\`driveId\`\` aliases and emits the historical
\`\`file\_matching\_query\`\` event type. \`\`FileCreatedTrigger\`\` covers the
broader "new file" case and emits \`\`file\_created\`\`.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`corpora\` \| string \| No \| Bodies of items to which the query applies. Supported: 'user', 'domain', 'drive', 'allDrives'. \|
\| \`driveId\` \| string \| No \| ID of the shared drive to search (use with corpora='drive'). \|
\| \`includeItemsFromAllDrives\` \| boolean \| No \| Include items from both My Drive and shared drives. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_results\` \| integer \| No \| Maximum number of newly-matching files to emit per poll. The trigger paginates Drive responses internally bounded by an internal page cap; this field caps emitted events, not API pages. \|
\| \`query\` \| string \| No \| Drive query to filter files. Examples: name contains 'report', mimeType = 'application/pdf', (name contains 'Draft' and not trashed). The query is composed with a \`createdTime >= \` boundary plus ID dedup so the trigger only fires for newly created files. \|
\| \`spaces\` \| string \| No \| A comma-separated list of spaces to query within. Supported: 'drive', 'appDataFolder'. \|
\| \`supportsAllDrives\` \| boolean \| No \| Whether the requesting application supports both My Drives and shared drives. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`file\` \| object \| Yes \| The newly matched Drive file \|

\### New Gmail Message Received Trigger

\*\*Slug:\*\* \`GOOGLESUPER\_NEW\_MESSAGE\`

\*\*Type:\*\* poll

Triggers when a new message is received in Gmail.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`labelIds\` \| string \| No \| Filter messages by a single label ID. Labels identify the status or category of messages. Supported labels include 'INBOX', 'SPAM', 'TRASH', 'UNREAD', 'STARRED', 'IMPORTANT', 'CATEGORY\_PERSONAL', 'CATEGORY\_SOCIAL', 'CATEGORY\_PROMOTIONS', 'CATEGORY\_UPDATES', and 'CATEGORY\_FORUMS'. For complex label filtering, use the 'query' parameter instead. \|
\| \`query\` \| string \| No \| Advanced Gmail search using the same syntax as Gmail's search box. Use 'AND' for messages that match all conditions, 'OR' for any condition. Search by sender (from:email@domain.com), labels (label:inbox), status (is:unread), attachments (has:attachment), dates (after:2023/1/1), and more. If specified, this takes precedence over labelIds. \|
\| \`userId\` \| string \| No \| The user's email address or 'me' for the authenticated user. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`attachment\_list\` \| array \| No \| The list of attachments in the message \|
\| \`id\` \| string \| No \| The raw Gmail message ID \|
\| \`label\_ids\` \| array \| No \| The Gmail label IDs applied to the message \|
\| \`message\_id\` \| string \| No \| The message ID of the message \|
\| \`message\_text\` \| string \| No \| The text of the message \|
\| \`message\_timestamp\` \| string \| No \| The timestamp of the message \|
\| \`payload\` \| object \| No \| The payload of the message \|
\| \`preview\` \| object \| No \| The preview payload of the message \|
\| \`sender\` \| string \| No \| The sender of the message \|
\| \`subject\` \| string \| No \| The subject of the message \|
\| \`thread\_id\` \| string \| No \| The thread ID of the message \|
\| \`to\` \| string \| No \| The recipient of the message \|

\### New Rows in Google Sheet

\*\*Slug:\*\* \`GOOGLESUPER\_NEW\_ROWS\_TRIGGER\`

\*\*Type:\*\* poll

Simple polling trigger that monitors Google Sheets for new rows.
Detects when new rows are added and returns the complete row data.
Perfect for triggering any workflow based on new sheet entries.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`sheet\_name\` \| string \| No \| The name of the specific sheet within the spreadsheet to monitor \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet to monitor \|
\| \`start\_row\` \| integer \| No \| The row number to start monitoring from (1-indexed, typically 2 to skip headers) \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the row was detected \|
\| \`row\_data\` \| array \| Yes \| Complete row data as list of strings \|
\| \`row\_number\` \| integer \| Yes \| The row number in the sheet (1-indexed) \|
\| \`sheet\_name\` \| string \| Yes \| The sheet name \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|

\### New Sheet Added in Google Spreadsheet

\*\*Slug:\*\* \`GOOGLESUPER\_NEW\_SHEET\_ADDED\_TRIGGER\`

\*\*Type:\*\* poll

Polling trigger that detects when a new sheet is added to a Google Spreadsheet.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet to monitor \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the new sheet was detected \|
\| \`sheet\_name\` \| string \| Yes \| The name of the new sheet added \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|

\### New Spreadsheet Created

\*\*Slug:\*\* \`GOOGLESUPER\_NEW\_SPREADSHEET\_CREATED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new Google Spreadsheet is created.
This trigger monitors Google Spreadsheets and fires when new spreadsheets are detected.
Uses timestamp filtering to efficiently detect newly created spreadsheets.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`include\_shared\_drives\` \| boolean \| No \| Whether to include spreadsheets from shared drives you have access to. Defaults to True. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_results\` \| integer \| No \| Maximum number of spreadsheets to check in each poll (1-1000) \|
\| \`query\` \| string \| No \| Optional search query to filter spreadsheets. Can search by name (name contains 'Budget'), full text content (fullText contains 'sales'), or use complex queries with operators. Leave empty to monitor all spreadsheets. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`spreadsheet\` \| object \| Yes \| The newly created Google Spreadsheet \|

\### New Task Created

\*\*Slug:\*\* \`GOOGLESUPER\_NEW\_TASK\_CREATED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new task is created in a Google Tasks list.
Uses timestamp filtering (updatedMin) to efficiently detect new tasks.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_results\` \| integer \| No \| Maximum number of tasks to check in each poll (1-100) \|
\| \`tasklist\_id\` \| string \| No \| Identifier of the task list to monitor. Use '@default' for the primary task list or provide a specific task list ID from list\_task\_lists action. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`task\` \| object \| Yes \| The newly created task \|

\### New Task List Created

\*\*Slug:\*\* \`GOOGLESUPER\_NEW\_TASK\_LIST\_CREATED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new Google Tasks task list is created.
This trigger monitors Google Tasks and fires when new task lists are detected.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_results\` \| integer \| No \| Maximum number of task lists to check in each poll (1-100) \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`task\_list\` \| object \| Yes \| The newly created task list \|

\### New Document Added

\*\*Slug:\*\* \`GOOGLESUPER\_PAGE\_ADDED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new Google Doc is added/created.
This trigger monitors Google Docs and fires when new documents are detected.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_results\` \| integer \| No \| Maximum number of documents to check in each poll (1-1000) \|
\| \`query\` \| string \| No \| Optional search query to filter documents. Can search by name (name contains 'report'), full text content (fullText contains 'important'), or use complex queries with operators like 'and', 'or', 'not'. Leave empty to monitor all documents. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`document\` \| object \| Yes \| The newly added Google document \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|

\### New Slide Added

\*\*Slug:\*\* \`GOOGLESUPER\_SLIDE\_ADDED\_TRIGGER\`

\*\*Type:\*\* poll

Fires when a new slide is added to a Google Slides presentation.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`presentation\_id\` \| string \| Yes \| The ID of the presentation to monitor for new slides \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| No \| Type of slide event \|
\| \`slide\` \| object \| Yes \| The slide object that was added \|

\### Spreadsheet Metadata Changed

\*\*Slug:\*\* \`GOOGLESUPER\_SPREADSHEET\_METADATA\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Polling trigger that detects when a Google Spreadsheet's metadata changes.
Uses snapshot-based diffing to detect any changes in spreadsheet properties,
sheets, named ranges, developer metadata, data sources, etc.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet to monitor for metadata changes \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`changes\` \| array \| Yes \| List of metadata changes detected \|
\| \`current\_metadata\` \| object \| Yes \| Current metadata snapshot \|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the change was detected \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|
\| \`spreadsheet\_url\` \| string \| No \| URL to view the spreadsheet \|

\### Spreadsheet Properties Changed

\*\*Slug:\*\* \`GOOGLESUPER\_SPREADSHEET\_PROPERTIES\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Polling trigger that detects when a Google Spreadsheet's top-level properties change.
Monitors properties such as title, locale, timeZone, and autoRecalc settings.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet to monitor for property changes \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`changed\_properties\` \| array \| Yes \| List of properties that changed \|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the change was detected \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|
\| \`spreadsheet\_url\` \| string \| No \| URL to view the spreadsheet \|

\### Spreadsheet Row Changed

\*\*Slug:\*\* \`GOOGLESUPER\_SPREADSHEET\_ROW\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a looked-up spreadsheet row changes.
This trigger monitors a specific row (located by searching for a query value within a user-specified range)
and fires when the row's values change, when the row appears, or when the row disappears.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`case\_sensitive\` \| boolean \| No \| If \`True\`, the query string search is case-sensitive. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`normalize\_whitespace\` \| boolean \| No \| If \`True\`, strips leading and trailing whitespace from cell values before matching. This helps match cells like ' TOTAL ' or 'TOTAL ' when searching for 'TOTAL'. \|
\| \`query\` \| string \| Yes \| Exact text value to find; matches the entire content of a cell in a row. \|
\| \`range\` \| string \| No \| A1 notation range to search within. Supports cell ranges (e.g., 'Sheet1!A1:D5'), column-only ranges (e.g., 'Sheet1!A:Z'), and row-only ranges (e.g., 'Sheet1!1:1'). Defaults to the first sheet if omitted. IMPORTANT: Sheet names with spaces must be single-quoted (e.g., "'My Sheet'!A1:Z"). Bare sheet names without ranges (e.g., 'Sheet1') are not supported - always specify a range. \|
\| \`spreadsheet\_id\` \| string \| Yes \| Identifier of the Google Spreadsheet to monitor. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`change\_type\` \| string \| Yes \| Type of change: 'created' (row appeared), 'updated' (row values changed), or 'deleted' (row disappeared) \|
\| \`current\_row\_data\` \| string \| Yes \| The current row data (empty dict if row is not found now) \|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the change was detected \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`previous\_row\_data\` \| string \| Yes \| The previous row data (empty dict if row was not found before) \|
\| \`query\` \| string \| Yes \| The query used to find the row \|
\| \`range\` \| string \| No \| The A1 notation range that was searched \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|

\### Spreadsheet Search Match

\*\*Slug:\*\* \`GOOGLESUPER\_SPREADSHEET\_SEARCH\_MATCH\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new spreadsheet appears that matches a saved search.
This trigger uses snapshot-based diffing to detect when spreadsheets matching
the search criteria are newly created or become visible to the user.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`created\_after\` \| string \| No \| Return spreadsheets created after this date. Use RFC 3339 format like '2024-01-01T00:00:00Z'. \|
\| \`include\_shared\_drives\` \| boolean \| No \| Whether to include spreadsheets from shared drives you have access to. Defaults to True. \|
\| \`include\_trashed\` \| boolean \| No \| Whether to include spreadsheets in trash. Defaults to False. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_results\` \| integer \| No \| Maximum number of spreadsheets to check in each poll (1-100) \|
\| \`modified\_after\` \| string \| No \| Return spreadsheets modified after this date. Use RFC 3339 format like '2024-01-01T00:00:00Z'. \|
\| \`order\_by\` \| string \| No \| Order results by field. Common options: 'modifiedTime desc', 'modifiedTime asc', 'name', 'createdTime desc' \|
\| \`query\` \| string \| No \| Search query to filter spreadsheets. Behavior depends on the 'search\_type' parameter. For advanced searches, use Google Drive query syntax with fields like 'name contains', 'fullText contains', or boolean filters like 'sharedWithMe = true'. DO NOT use spreadsheet IDs as search terms. Leave empty to get all spreadsheets. \|
\| \`search\_type\` \| string ("name" \| "content" \| "both") \| No \| How to search: 'name' searches filenames only (prefix matching from the START of filenames), 'content' uses fullText search which searches file content, name, description, and metadata, 'both' explicitly searches both name OR content with an OR condition. \|
\| \`shared\_with\_me\` \| boolean \| No \| Whether to return only spreadsheets shared with the current user. Defaults to False. \|
\| \`starred\_only\` \| boolean \| No \| Whether to return only starred spreadsheets. Defaults to False. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`spreadsheet\` \| object \| Yes \| The spreadsheet that matches the search criteria \|

\### Table Query Result Changed

\*\*Slug:\*\* \`GOOGLESUPER\_TABLE\_QUERY\_RESULT\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when the result set of a saved table query changes in Google Sheets.
Detects rows added, removed, or updated in the query output.
This trigger monitors the result of a SQL query against a Google Sheets table
and fires when changes are detected.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`include\_formulas\` \| boolean \| No \| Whether to return formula text instead of calculated values for formula columns \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet to query. This is the long alphanumeric string found in the spreadsheet URL between '/d/' and '/edit'. \|
\| \`sql\` \| string \| Yes \| SQL SELECT query to execute. The table name is the Google Sheets tab/sheet name (visible at the bottom of the spreadsheet). Supported: SELECT cols FROM table WHERE conditions ORDER BY col LIMIT n. Table names must be quoted with double quotes if they contain spaces or are numeric-only (e.g., SELECT \* FROM "My Sheet" or SELECT \* FROM "415"). \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`changes\` \| array \| Yes \| List of detected changes \|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the change was detected \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|
\| \`sql\` \| string \| Yes \| The SQL query that was executed \|
\| \`total\_rows\_after\` \| integer \| Yes \| Total number of rows after the change \|
\| \`total\_rows\_before\` \| integer \| Yes \| Total number of rows before the change \|

\### Table Schema Changed

\*\*Slug:\*\* \`GOOGLESUPER\_TABLE\_SCHEMA\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Polling trigger that detects when a table's schema changes in Google Sheets.
Monitors columns added/removed/renamed and inferred type/format changes.
Uses snapshot-based diffing to compare schemas between polls.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`sample\_size\` \| integer \| No \| Number of rows to sample for type inference \|
\| \`sheet\_name\` \| string \| No \| Sheet/tab name if table\_name is ambiguous across multiple sheets \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet to monitor \|
\| \`table\_name\` \| string \| Yes \| Table name from LIST\_TABLES response OR the visible Google Sheets tab name. Use 'auto' to monitor the largest/most prominent table. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`change\_summary\` \| string \| Yes \| Human-readable summary of the changes \|
\| \`column\_changes\` \| array \| Yes \| List of column changes detected \|
\| \`current\_column\_count\` \| integer \| Yes \| Number of columns in current schema \|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the change was detected \|
\| \`previous\_column\_count\` \| integer \| Yes \| Number of columns in previous schema \|
\| \`sheet\_name\` \| string \| Yes \| Sheet name where table is located \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|
\| \`table\_name\` \| string \| Yes \| Name of the table that changed \|

\### Task Details Changed

\*\*Slug:\*\* \`GOOGLESUPER\_TASK\_DETAILS\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a specific task's details change.
This trigger monitors a single Google Task and fires when any of its details
(title, notes, status, due date, completion, position) are modified.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`task\_id\` \| string \| Yes \| The ID of the specific task to monitor for changes \|
\| \`tasklist\_id\` \| string \| Yes \| The ID of the task list containing the task to monitor \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`changed\_fields\` \| array \| Yes \| List of field names that changed \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`previous\_task\` \| object \| No \| The previous task snapshot (None on first poll) \|
\| \`task\` \| object \| Yes \| The current task with all details \|

\### Task List Changed

\*\*Slug:\*\* \`GOOGLESUPER\_TASK\_LIST\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a task list changes (title or content updates).
This trigger monitors a specific Google Tasks list and fires when changes are detected.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`tasklist\_id\` \| string \| Yes \| The unique identifier of the task list to monitor for changes. Use '@default' for the default task list. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`changed\_fields\` \| array \| No \| List of fields that changed (e.g., 'title', 'updated') \|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`task\_list\` \| object \| Yes \| The task list with changed state \|

\### Task Updated

\*\*Slug:\*\* \`GOOGLESUPER\_TASK\_UPDATED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when an existing task is updated in a Google Tasks list.
This trigger monitors a specific task list and fires when tasks are modified.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`max\_results\` \| integer \| No \| Maximum number of tasks to check in each poll (1-100) \|
\| \`show\_completed\` \| boolean \| No \| Include completed tasks in the monitoring. Defaults to true. \|
\| \`show\_deleted\` \| boolean \| No \| Include deleted tasks in the monitoring. Defaults to false. \|
\| \`tasklist\_id\` \| string \| No \| Identifier of the task list to monitor. Use '@default' for the primary task list, or provide a specific task list ID from list\_task\_lists action. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`task\` \| object \| Yes \| The updated task \|

\### Worksheet Names Changed

\*\*Slug:\*\* \`GOOGLESUPER\_WORKSHEET\_NAMES\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when the set of worksheet/tab names changes in a Google Spreadsheet.
Detects when sheets are added, deleted, or renamed.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`spreadsheet\_id\` \| string \| Yes \| The unique identifier of the Google Spreadsheet to monitor \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`change\_type\` \| string \| Yes \| Type of change: 'added', 'deleted', or 'renamed' \|
\| \`current\_names\` \| array \| Yes \| Current list of all worksheet names after the change \|
\| \`detected\_at\` \| string \| Yes \| ISO timestamp when the change was detected \|
\| \`previous\_name\` \| string \| No \| Previous name if worksheet was renamed (only for renamed events) \|
\| \`spreadsheet\_id\` \| string \| Yes \| The spreadsheet ID \|
\| \`worksheet\_name\` \| string \| Yes \| The name of the worksheet that was added, deleted, or involved in the change \|
