---
url: https://docs.composio.dev/toolkits/facebook.md
title: https://docs.composio.dev/toolkits/facebook.md
description: 
status: 200
---

\# Facebook

Facebook is a social media and advertising platform used by individuals and businesses to connect, share content, and promote products or services. Only supports Facebook Pages, not Facebook Personal accounts.

\- \*\*Category:\*\* social media accounts
\- \*\*Auth:\*\* OAUTH2
\- \*\*Composio-managed OAuth available?\*\* Yes
\- \*\*Tools:\*\* 43
\- \*\*Triggers:\*\* 0
\- \*\*Slug:\*\* \`FACEBOOK\`
\- \*\*Version:\*\* 20260721\_00

\## Frequently Asked Questions

\### How do I set up custom OAuth credentials for Meta (Facebook)?

For a step-by-step guide on creating and configuring your own Meta (Facebook) OAuth credentials with Composio, see \[How to create OAuth credentials for Meta (Facebook)\](https://composio.dev/auth/facebook).

\## Tools

\### Assign Page Task

\*\*Slug:\*\* \`FACEBOOK\_ASSIGN\_PAGE\_TASK\`

Assigns tasks/roles to a business-scoped user or system user for a specific Facebook Page. Important: This action requires a business-scoped user ID or system user ID from Facebook Business Manager. Regular Facebook user IDs cannot be used. The page must also be managed through Facebook Business Manager for this action to work. Required permissions: business\_management, pages\_manage\_metadata

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| string \| Yes \| The business-scoped user ID or system user ID to assign tasks to. Note: Regular Facebook user IDs are not accepted - only business-scoped IDs (from Business Manager) or system user IDs can be used with this endpoint. \|
\| \`tasks\` \| array \| Yes \| List of tasks to assign. Valid values include: 'MANAGE', 'CREATE\_CONTENT', 'MODERATE', 'ADVERTISE', 'ANALYZE', 'MESSAGING'. Example: \['MANAGE', 'CREATE\_CONTENT'\] \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Comment

\*\*Slug:\*\* \`FACEBOOK\_CREATE\_COMMENT\`

Creates a comment on a Facebook post or replies to an existing comment.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`message\` \| string \| Yes \| The text content of the comment \|
\| \`object\_id\` \| string \| Yes \| The ID of the post or comment to comment on. Must be a numeric ID (e.g., '3071372469667482') or compound format 'pageId\_postId' (e.g., '678465505624869\_3071372469667482'). Do not include prefixes like 'post\_', 'id\_', or 'p'. \|
\| \`attachment\_id\` \| string \| No \| ID of an unpublished photo to attach to the comment \|
\| \`attachment\_url\` \| string \| No \| URL of a photo to attach to the comment \|
\| \`attachment\_share\_url\` \| string \| No \| URL of a GIF to attach to the comment \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Multi-Photo Post

\*\*Slug:\*\* \`FACEBOOK\_CREATE\_MULTI\_PHOTO\_POST\`

Publish one Facebook Page feed post containing one or more photos from public URLs. The action first uploads every photo with published=false, then creates one /feed post with those photo IDs as attached\_media. If any upload fails, the feed post is not created; earlier uploads can remain unpublished on Facebook temporarily. This action publishes immediately and does not add photos to an existing album.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`message\` \| string \| No \| Optional text to publish with the photo post. \|
\| \`page\_id\` \| string \| Yes \| Numeric ID of the Facebook Page that will publish the post. \|
\| \`photo\_urls\` \| array \| Yes \| One or more direct, publicly accessible HTTPS image URLs. Facebook must be able to fetch each URL without authentication. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Photo Album

\*\*Slug:\*\* \`FACEBOOK\_CREATE\_PHOTO\_ALBUM\`

Creates a new photo album on a Facebook Page. Note: This endpoint requires the 'pages\_manage\_posts' permission or equivalent permissions to be granted to your Facebook application. This action is publicly visible on the Page; confirm with the user before calling.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Name of the photo album \|
\| \`message\` \| string \| No \| Description of the album \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page Must be a Facebook Page ID — personal profile or user timeline IDs are invalid. \|
\| \`privacy\` \| object \| No \| Privacy settings for the album (e.g., {'value': 'EVERYONE'}) \|
\| \`location\` \| string \| No \| Location associated with the album \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Photo Post

\*\*Slug:\*\* \`FACEBOOK\_CREATE\_PHOTO\_POST\`

Creates a photo post on a Facebook Page. Requires an image to be provided via either 'url' (publicly accessible image URL) or 'photo' (local image file upload). This action is specifically for posting images with optional captions, not text-only posts. Returns a composite post\_id (PageID\_PostID); use this for follow-up operations, not the photo/media id alone.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| No \| URL of a publicly accessible image to upload. Supports direct image links with or without file extensions (e.g., https://example.com/image.jpg or hash-based URLs from services like Imgur, Gyazo, Postimages). The image host must not block requests from Facebook. Cannot be a Facebook URL. At least one of 'url', 'photo', or 'media' is required. The URL must return an image MIME type directly — redirects or HTML pages cause upload failures. \|
\| \`media\` \| object \| No \| Alias for 'photo'. for uploading a local image file (e.g..jpg.png.gif). At least one of 'media', 'photo', or 'url' is required. \|
\| \`photo\` \| object \| No \| for uploading a local image file (e.g..jpg.png.gif). At least one of 'photo', 'url', or 'media' is required. \|
\| \`message\` \| string \| No \| Caption text for the photo. Can also be provided as 'caption'. \|
\| \`page\_id\` \| string \| Yes \| The numeric ID of the Facebook Page to post to. Can be provided as a string or number. \|
\| \`published\` \| boolean \| No \| Set to true to publish immediately, false to save as unpublished \|
\| \`backdated\_time\` \| integer \| No \| Unix timestamp to backdate the post \|
\| \`scheduled\_publish\_time\` \| integer \| No \| Unix timestamp for scheduled posts (required if published=false) Must be a future UTC epoch timestamp. Providing this with published=true triggers a 400 validation error. \|
\| \`backdated\_time\_granularity\` \| string \| No \| Granularity of backdated time: year, month, day, hour, or min \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Post

\*\*Slug:\*\* \`FACEBOOK\_CREATE\_POST\`

Creates a new text or link post on a Facebook Page. Requires \`pages\_manage\_posts\` permission and manage-level Page role on the target Page. For image posts use FACEBOOK\_CREATE\_PHOTO\_POST; for video posts use FACEBOOK\_CREATE\_VIDEO\_POST — media fields are not supported here. Returns a composite post ID in \`PageID\_PostID\` format, required for FACEBOOK\_GET\_POST retrieval.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`link\` \| string \| No \| URL to include in the post \|
\| \`message\` \| string \| Yes \| The text content of the post At least one of \`message\` or \`link\` must be non-empty; omitting both causes a validation error. \|
\| \`page\_id\` \| string \| Yes \| The numeric ID of the Facebook Page to post to. This is a numeric string (e.g., '123456789012345'). To obtain a valid page\_id, use the 'Get User Pages' or 'List Managed Pages' action which returns page IDs for pages you have access to manage. \|
\| \`published\` \| boolean \| No \| Set to true to publish immediately, false to save as draft or schedule \|
\| \`targeting\` \| object \| No \| Audience targeting specifications \|
\| \`scheduled\_publish\_time\` \| integer \| No \| Unix timestamp for when the post should be published. Must be at least 10 minutes in the future. When provided, published must be false (will be auto-set to false if true). Must be Unix UTC epoch (not local time); timezone mismatches cause validation failures. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Video Post

\*\*Slug:\*\* \`FACEBOOK\_CREATE\_VIDEO\_POST\`

Creates a video post on a Facebook Page. Requires a Page access token with \`pages\_manage\_posts\` scope and manage-level permissions on the target page.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| No \| Title of the video \|
\| \`video\` \| object \| No \| Local video file to upload. At least one of 'video' or 'file\_url' must be provided. \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page Must be a Facebook Page ID (not a personal profile ID); the authenticated token must have manage-level access. \|
\| \`file\_url\` \| string \| No \| URL of the video file to upload. At least one of 'file\_url' or 'video' must be provided. Must be a direct download URL (e.g., direct MP4 link), not a watch/share URL. Use MP4 with H.264/AAC encoding; unsupported formats or very large files may fail. \|
\| \`published\` \| boolean \| No \| Whether to publish immediately \|
\| \`targeting\` \| object \| No \| Audience targeting specifications \|
\| \`description\` \| string \| No \| Description of the video \|
\| \`scheduled\_publish\_time\` \| integer \| No \| Unix timestamp to schedule the video post Requires \`published=false\`; must be a UTC Unix epoch at least ~10 minutes in the future. Combining with \`published=true\` or omitting when \`published=false\` causes 400 errors. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Comment

\*\*Slug:\*\* \`FACEBOOK\_DELETE\_COMMENT\`

Deletes a Facebook comment. Requires a Page Access Token with appropriate permissions for comments on Page-owned content. The page\_id parameter helps ensure the correct page token is used for authentication.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_id\` \| string \| No \| Optional: The ID of the Facebook Page that owns the post containing this comment. If not provided, the action will use the first available managed page. Providing the correct page\_id ensures proper authentication. \|
\| \`comment\_id\` \| string \| Yes \| The ID of the comment to delete. Can be in format 'parentId\_commentId' (e.g., '122157027176937815\_1371138271476143') or just the comment ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Post

\*\*Slug:\*\* \`FACEBOOK\_DELETE\_POST\`

Permanently deletes a Facebook Page post. Deletion is irreversible — deleted posts cannot be recovered. For bulk deletions, keep throughput to ~1 delete/second to avoid Graph API rate limits.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`post\_id\` \| string \| Yes \| The ID of the post to delete The token must have Page-level delete permissions for this post. Posts created by other users or requiring elevated Page roles may not be deletable. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Comment

\*\*Slug:\*\* \`FACEBOOK\_GET\_COMMENT\`

Retrieves details of a specific Facebook comment.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return \|
\| \`comment\_id\` \| string \| Yes \| The ID of the comment to retrieve \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Comments

\*\*Slug:\*\* \`FACEBOOK\_GET\_COMMENTS\`

Retrieves comments from a Facebook post or comment (for replies). This endpoint requires appropriate permissions: - For page-owned posts: A Page Access Token with 'pages\_read\_engagement' permission - The API automatically swaps user tokens for page tokens when available API Version: Uses v23.0 which was released May 2025.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of comments to return (max 100) \|
\| \`order\` \| string \| No \| Order of comments: 'chronological' (oldest first) or 'reverse\_chronological' (newest first, default). \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for each comment. Available fields: id, message, created\_time, from, attachment, comment\_count, like\_count, is\_hidden, user\_likes, can\_comment, can\_remove, can\_hide, permalink\_url, parent, comments (for nested replies). Note: 'from' field requires a Page Token to access user information (since Graph API v2.11). \|
\| \`filter\` \| string \| No \| Filter comments by type: 'stream' returns all comments including replies in flat list (default), 'toplevel' returns only top-level comments without replies. \|
\| \`object\_id\` \| string \| Yes \| The ID of the post or comment to get comments from. Must be in full format 'pageId\_postId' for posts (e.g., '123456789\_987654321'). For comments, use the comment ID directly. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Conversation Messages

\*\*Slug:\*\* \`FACEBOOK\_GET\_CONVERSATION\_MESSAGES\`

Retrieves messages from a specific conversation.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of messages to return (max 25) To retrieve full histories, paginate using \`paging.cursors.after\` or the \`next\` URL from the response. \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for each message. Available fields include: id, created\_time, from, to, message, attachments, sticker, shares, tags. \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page that owns the conversation. Required to obtain the correct page access token. Get this from the List Managed Pages action. \|
\| \`conversation\_id\` \| string \| Yes \| The ID of the conversation in the format 't\_' followed by a numeric ID (e.g., 't\_3638640842939952'). Obtain valid conversation IDs from the Get Page Conversations action. If a numeric-only ID is provided, the 't\_' prefix will be added automatically. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Current User

\*\*Slug:\*\* \`FACEBOOK\_GET\_CURRENT\_USER\`

Validates the access token and retrieves the authenticated user's own profile via /me. Cannot fetch arbitrary users by name or ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for the current user Fields are silently omitted or return null if the access token lacks the required Facebook permissions — including defaults like \`email\`. Handle missing fields defensively. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Message Details

\*\*Slug:\*\* \`FACEBOOK\_GET\_MESSAGE\_DETAILS\`

Retrieves details of a specific message sent or received by the Page.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return \|
\| \`message\_id\` \| string \| Yes \| The ID of the message to retrieve details for \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Page Conversations

\*\*Slug:\*\* \`FACEBOOK\_GET\_PAGE\_CONVERSATIONS\`

Retrieves a list of conversations between users and the Page.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of conversations to return (max 25) Use \`paging.cursors.after\` or \`paging.next\` from the response to paginate beyond the first page. \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for each conversation Avoid requesting heavy nested fields (e.g., embedded messages) to prevent large payloads. \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page. Numeric IDs are accepted and will be converted to strings. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Page Details

\*\*Slug:\*\* \`FACEBOOK\_GET\_PAGE\_DETAILS\`

Fetches details about a specific Facebook Page.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for the Page. Common valid fields include: id, name, about, category, description, fan\_count, followers\_count, website, link, username, is\_published, access\_token, emails, phone, location, hours, cover, picture, engagement, verification\_status, and many more. IMPORTANT: The following fields are NOT valid for direct Page queries and will be automatically filtered out: 'tasks' (only available via /me/accounts endpoint - use FACEBOOK\_LIST\_MANAGED\_PAGES to get page tasks), 'created\_time' (not supported on all page node types such as ProfileDelegatePage). For a complete list of valid Page fields, refer to the Facebook Graph API Page reference. \|
\| \`page\_id\` \| string \| Yes \| The unique numeric ID of the Facebook Page to get details for. This must be a valid Facebook Page ID that the authenticated user has access to view. Facebook Page IDs are numeric strings typically 15-16 digits long (e.g., '678594635343968'). To find valid page IDs you have access to, first use the FACEBOOK\_LIST\_MANAGED\_PAGES or FACEBOOK\_GET\_USER\_PAGES actions to retrieve a list of pages you manage, which will include their IDs. You can also find a page's ID in its Facebook URL (e.g., https://www.facebook.com/123456789012345) or in the Page's 'About' section. Do not use arbitrary numbers, timestamps, bank account numbers, or other non-Facebook identifiers. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Page Insights

\*\*Slug:\*\* \`FACEBOOK\_GET\_PAGE\_INSIGHTS\`

Retrieves analytics and insights for a Facebook Page. Returns metrics like impressions, page views, fan counts, and engagement data. Empty objects (\`{}\`) in results indicate missing data, not zero values. High-volume calls risk Graph API rate limits (error codes 4/613).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`since\` \| string \| No \| Start of date range as Unix timestamp (e.g., '1704067200'), ISO 8601 datetime (e.g., '2024-10-01T00:00:00+0000', '2024-10-01'), or strtotime-compatible string (e.g., 'yesterday', '-7 days'). Maximum range is 90 days when combined with 'until'. \|
\| \`until\` \| string \| No \| End of date range as Unix timestamp (e.g., '1704672000'), ISO 8601 datetime (e.g., '2025-01-29T05:12:31+0000', '2025-01-29'), or strtotime-compatible string (e.g., 'now', '-1 day'). Maximum range is 90 days when combined with 'since'. \|
\| \`period\` \| string \| No \| Period for the metrics: day, week, days\_28, month, lifetime Using \`lifetime\` with bounded \`since\`/\`until\` ranges produces misleading or empty results. Standardize all date inputs to UTC. \|
\| \`metrics\` \| string \| No \| Comma-separated list of metrics to retrieve. VALID METRICS: page\_follows (total followers), page\_daily\_follows\_unique (new follows), page\_daily\_unfollows\_unique (unfollows), page\_media\_view (content views), page\_post\_engagements (engagement count), page\_video\_views (video views), page\_total\_actions (CTA clicks), page\_actions\_post\_reactions\_total (reactions breakdown). DEPRECATED (will be auto-replaced): page\_impressions -> page\_media\_view, page\_fans -> page\_follows, page\_engaged\_users -> page\_post\_engagements, page\_fan\_adds -> page\_daily\_follows\_unique. Individual reaction metrics (page\_actions\_post\_reactions\_like\_total, etc.) are deprecated; use page\_actions\_post\_reactions\_total instead. Not all metric/period combinations are valid; incompatible combinations return empty data — reduce metrics list or adjust period if this occurs. \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page Must be a numeric Page ID; page names, URLs, and personal profile IDs are invalid. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Page Photos

\*\*Slug:\*\* \`FACEBOOK\_GET\_PAGE\_PHOTOS\`

Retrieves photos from a Facebook Page. CDN-based URLs (including \`source\`) are time-limited and expire; download and persist images promptly if long-term access is needed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string \| No \| Filter by photo type: uploaded, tagged \|
\| \`limit\` \| integer \| No \| Number of photos to return (max 100) Use paging cursors from the response to iterate through all available photos in large libraries; limit=100 does not guarantee all photos are returned in one call. \|
\| \`fields\` \| string \| No \| Comma-separated list of valid Photo fields to return. Valid fields include: id, created\_time, updated\_time, name, images, height, width, picture, link, icon, from, album, backdated\_time, place, page\_story\_id, target, event, can\_delete, can\_tag, webp\_images. NOTE: 'reactions' and 'comments' are NOT valid fields - they are edges that must be accessed via separate API calls (e.g., /{photo-id}/reactions, /{photo-id}/comments). \|
\| \`page\_id\` \| string \| Yes \| The numeric ID of the Facebook Page (e.g., '678594635343968'). You can obtain page IDs using the FACEBOOK\_LIST\_MANAGED\_PAGES action. Do NOT pass datetime strings, timestamps, or date values - only valid Facebook page IDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Page Posts

\*\*Slug:\*\* \`FACEBOOK\_GET\_PAGE\_POSTS\`

Retrieves posts from a Facebook Page. Endpoint choice: Uses /{page\_id}/feed instead of /posts or /published\_posts because: - /feed returns all content on page timeline (page's posts + visitor posts + tagged posts) - /posts returns only posts created by the page itself - /published\_posts returns only published posts by the page (excludes scheduled/unpublished) The /feed endpoint provides the most comprehensive view of page activity. Pagination: follow paging.cursors.after or paging.next across multiple calls until no next cursor exists. Throttling: high-volume pagination can trigger Graph API errors 4 and 613; use backoff between requests. API Version: Uses v23.0 (released May 2025). v20.0 and earlier will be deprecated by Meta. See: https://developers.facebook.com/docs/graph-api/changelog

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of posts to return (max 100) \|
\| \`since\` \| string \| No \| Filter posts updated after this time. Accepts: Unix timestamp (e.g., '1705320000'), strtotime values (e.g., 'yesterday', '7 days ago', 'last week'), or datetime strings (e.g., '2024-01-15', '2024-01-15T12:00:00'). Datetime strings are automatically converted to Unix timestamps. \|
\| \`until\` \| string \| No \| Filter posts updated before this time. Accepts: Unix timestamp (e.g., '1705320000'), strtotime values (e.g., 'yesterday', '7 days ago', 'last week'), or datetime strings (e.g., '2024-01-15', '2024-01-15T12:00:00'). Datetime strings are automatically converted to Unix timestamps. \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for each post. Supported fields include: id, message, created\_time, updated\_time, permalink\_url, attachments, story, from, status\_type, full\_picture, shares, reactions, comments, is\_hidden, is\_published. For summary counts, use '.summary(true)' syntax (e.g., 'reactions.summary(true)', 'comments.summary(true)', 'likes.summary(true)'). Note: 'type', 'link', 'source', 'picture', 'name', 'caption', 'description', and 'icon' are deprecated since Graph API v3.3 and will be automatically removed if requested. Response nests engagement data: extract reactions.summary.total\_count, comments.summary.total\_count, and shares.count; treat missing keys as zero. \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page. Can be provided as a string or number. Must be a Facebook Page ID, not a personal profile or user ID — use FACEBOOK\_GET\_USER\_PAGES to obtain a valid Page ID. \|
\| \`removed\_deprecated\_fields\` \| array \| No \| Internal field to track deprecated fields that were automatically removed. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Page Roles

\*\*Slug:\*\* \`FACEBOOK\_GET\_PAGE\_ROLES\`

Retrieves a list of people and their tasks/roles on a Facebook Page. The connected account must have management access to the target Page; otherwise the response may be empty or incomplete. Returned role types include MANAGE and CREATE\_CONTENT — verify these before calling tools like FACEBOOK\_UPDATE\_PAGE\_SETTINGS. Recently changed roles may take time to propagate; retry if role data appears stale after an update.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor string for forward pagination. Use the 'after' cursor from a previous response's paging.cursors.after field to retrieve the next page of results. \|
\| \`limit\` \| integer \| No \| Maximum number of roles to return per request. \|
\| \`before\` \| string \| No \| Cursor string for backward pagination. Use the 'before' cursor from a previous response's paging.cursors.before field to retrieve the previous page of results. \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Page Tagged Posts

\*\*Slug:\*\* \`FACEBOOK\_GET\_PAGE\_TAGGED\_POSTS\`

Retrieves posts where a Facebook Page is tagged or mentioned. Use when monitoring brand mentions or tracking posts that tag your Page but don't appear on your Page's own feed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of posts to return (max 100) \|
\| \`since\` \| string \| No \| Filter posts updated after this time. Accepts: Unix timestamp (e.g., '1705320000'), strtotime values (e.g., 'yesterday', '7 days ago', 'last week'), or datetime strings (e.g., '2024-01-15', '2024-01-15T12:00:00'). Datetime strings are automatically converted to Unix timestamps. \|
\| \`until\` \| string \| No \| Filter posts updated before this time. Accepts: Unix timestamp (e.g., '1705320000'), strtotime values (e.g., 'yesterday', '7 days ago', 'last week'), or datetime strings (e.g., '2024-01-15', '2024-01-15T12:00:00'). Datetime strings are automatically converted to Unix timestamps. \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for each post \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page. Can be provided as a string or number. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Page Videos

\*\*Slug:\*\* \`FACEBOOK\_GET\_PAGE\_VIDEOS\`

Retrieves videos from a Facebook Page.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string \| No \| Filter by video type: uploaded, tagged \|
\| \`limit\` \| integer \| No \| Number of videos to return (max 100) Controls only the first batch; iterate through paging cursors (\`paging.cursors.after\`) until no \`next\` page is returned to retrieve all videos. \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for each video The \`source\` field returns time-limited URLs; download or process promptly rather than storing for later use. \|
\| \`page\_id\` \| string \| Yes \| The numeric ID of the Facebook Page. This is a numeric string (e.g., '123456789012345'). To obtain a valid page\_id, use the 'Get User Pages' or 'List Managed Pages' action which returns page IDs for pages you have access to manage. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Post

\*\*Slug:\*\* \`FACEBOOK\_GET\_POST\`

Retrieves details of a specific Facebook post.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return. Common fields: id, message, created\_time, updated\_time, permalink\_url, from, attachments, shares, story, picture, full\_picture, place, privacy, status\_type. For engagement metrics with counts, use edge.summary(true) syntax. CORRECT: likes.summary(true), comments.summary(true), reactions.summary(true). WRONG: likes.summary(total\_count) - using 'total\_count' as parameter causes API syntax errors. The 'true' parameter enables the summary, and total\_count is returned in the response automatically. Note: Legacy post fields (name, link, description, type) are deprecated; use 'attachments' edge instead. \|
\| \`post\_id\` \| string \| Yes \| The ID of the post to retrieve. Must be in full format: 'pageId\_postId' where both pageId and postId are numeric (e.g., '123456789\_987654321'). Page-scoped IDs (alphanumeric strings like '1ANtnBaCHX' or '17GandZR1N') are not supported. Use FACEBOOK\_GET\_PAGE\_POSTS to obtain valid full-format post IDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Post Insights

\*\*Slug:\*\* \`FACEBOOK\_GET\_POST\_INSIGHTS\`

Retrieves analytics and insights for a specific Facebook post. Returns metrics like impressions, clicks, and engagement data. Very new posts may return empty metric values; allow a short delay before querying and treat absent fields as partial data.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`period\` \| string \| No \| Period for the metrics (only applicable for some metrics): lifetime Supports since/until parameters in UTC; convert from user timezone to avoid misleading aggregates when comparing posts across time windows. \|
\| \`metrics\` \| string \| No \| Comma-separated list of metrics to retrieve. Valid metric: post\_media\_view (the number of times the post entered a person's screen). Note: Older metrics like post\_impressions, post\_impressions\_unique, post\_clicks, post\_engagements, post\_engaged\_users, post\_reactions\_by\_type\_total were deprecated by Facebook as of November 15, 2025 and are no longer supported. Request only needed metrics to reduce payload size and avoid rate limit errors (error codes 4/613) when iterating over many posts. \|
\| \`post\_id\` \| string \| Yes \| The ID of the post to get insights for \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Post Reactions

\*\*Slug:\*\* \`FACEBOOK\_GET\_POST\_REACTIONS\`

Retrieves reactions (like, love, wow, etc.) for a Facebook post. Very recent posts may return empty or partial reactions data; treat missing fields as incomplete coverage, not an error.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string \| No \| Filter by reaction type: LIKE, LOVE, WOW, HAHA, SAD, ANGRY, THANKFUL \|
\| \`limit\` \| integer \| No \| Number of reactions to return (max 100) \|
\| \`post\_id\` \| string \| Yes \| The ID of the post to get reactions for \|
\| \`summary\` \| boolean \| No \| Include summary with total count per reaction type \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Scheduled Posts

\*\*Slug:\*\* \`FACEBOOK\_GET\_SCHEDULED\_POSTS\`

Retrieves scheduled and unpublished posts for a Facebook Page. Results are cursor-paginated; follow pagination cursors to retrieve all results beyond the limit. When searching for posts near a specific time, filter to a narrow (~±5 minutes) window. Use this tool to check for existing entries before scheduling new posts to avoid duplicates.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of posts to return (max 100) \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for each post \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User Pages (Deprecated)

\*\*Slug:\*\* \`FACEBOOK\_GET\_USER\_PAGES\`

DEPRECATED: Use FACEBOOK\_LIST\_MANAGED\_PAGES instead. Retrieves Facebook Pages the user manages (excludes personal profiles, groups, and non-Page entities); an empty \`data\` array means no manageable Pages exist. Requires \`pages\_show\_list\` scope; missing scopes yield empty \`data\` or OAuthException code 200. Results paginate ~100 items per page — follow \`paging.cursors.after\` or \`next\` until exhausted.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor string for pagination. Use the 'after' cursor from a previous response's paging.cursors.after field to retrieve the next page of results. \|
\| \`limit\` \| integer \| No \| Maximum number of pages to return per request. \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for each page. Supported fields include: id, name, access\_token, tasks, category, category\_list, picture, link, fan\_count, followers\_count, is\_published, global\_brand\_page\_name, instagram\_business\_account, verification\_status, is\_webhooks\_subscribed. Always include \`id\` and \`name\` to avoid extra identity-resolution calls. Check \`tasks\` values before write actions — Page inclusion does not guarantee publish/manage permissions. \|
\| \`user\_id\` \| string \| No \| The ID of the user whose pages to retrieve. Defaults to 'me' for current user. \|
\| \`composio\_execution\_message\` \| string \| No \| Execution message from preprocessing. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add Reaction

\*\*Slug:\*\* \`FACEBOOK\_LIKE\_POST\_OR\_COMMENT\`

Adds a LIKE reaction to a Facebook post or comment. Note: Due to API limitations, only LIKE reactions can be added programmatically. This action is user-visible and irreversible — confirm with the user before calling.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string \| No \| Reaction type: Currently only LIKE is supported via API. Other reactions (LOVE, WOW, HAHA, SAD, ANGRY, THANKFUL) cannot be added programmatically \|
\| \`object\_id\` \| string \| Yes \| The ID of the post or comment to react to. Facebook IDs are numeric strings (typically 15-20 digits). Must belong to a Page post or comment, not a personal profile timeline.IMPORTANT: Always pass IDs as strings to preserve precision. Integer values will be converted to strings, but float values (including scientific notation like 5.3e+32) are rejected because they lose precision. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Managed Pages

\*\*Slug:\*\* \`FACEBOOK\_LIST\_MANAGED\_PAGES\`

Retrieves a list of Facebook Pages that the user manages (not personal profiles), including page details, access tokens, and tasks. Requires \`pages\_show\_list\` or \`pages\_read\_engagement\` OAuth scopes; missing scopes silently return empty results rather than an error. An empty \`data\` array means the user manages no Pages. Results are paginated via \`paging.cursors\`; follow \`paging.next\` until absent to retrieve all Pages when count exceeds \`limit\`. Graph API throttling (error codes 4, 17, 613) can occur during pagination — use exponential backoff.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor string for forward pagination. Use the 'after' cursor from a previous response's paging.cursors.after field to retrieve the next page of results. \|
\| \`limit\` \| integer \| No \| Maximum number of pages to retrieve per request. \|
\| \`before\` \| string \| No \| Cursor string for backward pagination. Use the 'before' cursor from a previous response's paging.cursors.before field to retrieve the previous page of results. \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for each managed page. \|
\| \`user\_id\` \| string \| No \| The ID of the user whose managed pages to retrieve. Defaults to 'me' for current user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mark Message Seen

\*\*Slug:\*\* \`FACEBOOK\_MARK\_MESSAGE\_SEEN\`

Marks a user's message as seen by the Page, visibly updating the read status in the user's conversation. Note: This action requires an active messaging session with the user. Facebook's messaging policy requires that users have messaged the Page within the last 24 hours for sender actions to work.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page \|
\| \`recipient\_id\` \| string \| Yes \| The ID of the user whose message to mark as seen \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Publish Scheduled Post

\*\*Slug:\*\* \`FACEBOOK\_PUBLISH\_SCHEDULED\_POST\`

Publishes a previously scheduled or unpublished Facebook post immediately. This action takes a scheduled or unpublished post and publishes it immediately by setting is\_published to true. The post must have been previously created with published=false or with a scheduled\_publish\_time. Requirements: - The post must exist and be in an unpublished/scheduled state - The user must have admin access to the page that owns the post - The app must have pages\_manage\_posts permission

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_id\` \| string \| No \| Optional: The ID of the Facebook Page that owns the post. If not provided, it will be extracted from the post\_id (the part before the underscore). \|
\| \`post\_id\` \| string \| Yes \| The ID of the scheduled/unpublished post to publish. Format is typically 'pageId\_postId' (e.g., '123456789\_987654321'). Use 'Get Scheduled Posts' action to find scheduled post IDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove Page Task

\*\*Slug:\*\* \`FACEBOOK\_REMOVE\_PAGE\_TASK\`

Removes a user's tasks/access from a specific Facebook Page. Caller must have admin-level rights on the Page. Operates on one page\_id at a time; repeat for each page if removing from multiple pages. Partial access may remain if only some tasks are revoked.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| string \| Yes \| The ID or username of the user to remove Verify this matches the intended collaborator before calling; a mismatch revokes access for the wrong account. \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Reschedule Post

\*\*Slug:\*\* \`FACEBOOK\_RESCHEDULE\_POST\`

Changes the scheduled publish time of an unpublished Facebook post. This action updates the scheduled\_publish\_time of a previously scheduled post. The post must have been created with published=false and a scheduled\_publish\_time.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`post\_id\` \| string \| Yes \| The ID of the scheduled post to reschedule. Format is typically 'pageId\_postId' (e.g., '123456789\_987654321'). \|
\| \`scheduled\_publish\_time\` \| integer \| Yes \| New Unix timestamp for when to publish the post. Must be at least 10 minutes in the future and no more than 6 months ahead. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search Pages

\*\*Slug:\*\* \`FACEBOOK\_SEARCH\_PAGES\`

Searches for Facebook Pages based on a query string. Returns pages matching the search criteria with requested fields. DEPRECATION WARNING: The /pages/search endpoint was deprecated by Facebook in 2019 and is now ONLY available to Workplace by Meta apps. Standard Facebook apps will receive Error #10 (permission error) regardless of which permissions or features have been granted. For Workplace apps only - requires one of: - 'pages\_read\_engagement' permission - 'Page Public Content Access' feature - 'Page Public Metadata Access' feature Standard Facebook apps should use alternative methods to discover pages, such as: - Direct page ID lookup via /{page-id} endpoint - User's managed pages via /me/accounts endpoint Reference: https://developers.facebook.com/docs/apps/review/feature#reference-PAGES\_ACCESS. Results include only Facebook Pages; personal profiles, groups, and other entity types are excluded.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of results to return (max 100) A specific target page may not appear in a single response; refine the query string if the desired page is missing. \|
\| \`query\` \| string \| Yes \| Search query for finding pages (e.g., business name, topic, etc.) \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to retrieve for each page Returned field data (e.g., fan\_count, location) can be sparse or outdated; avoid relying on a single field for selection logic. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Send Media Message

\*\*Slug:\*\* \`FACEBOOK\_SEND\_MEDIA\_MESSAGE\`

Sends a media message (image, video, audio, or file) from the Page to a user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tag\` \| string \| No \| Message tag required when messaging\_type is MESSAGE\_TAG. Valid tags include: CONFIRMED\_EVENT\_UPDATE, POST\_PURCHASE\_UPDATE, ACCOUNT\_UPDATE, HUMAN\_AGENT \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page sending the message \|
\| \`media\_url\` \| string \| Yes \| URL of the media to send \|
\| \`media\_type\` \| string \| Yes \| Type of media: image, video, audio, or file \|
\| \`is\_reusable\` \| boolean \| No \| Whether the attachment is reusable \|
\| \`recipient\_id\` \| string \| Yes \| The ID of the message recipient (user ID or PSID) \|
\| \`messaging\_type\` \| string \| No \| The messaging type - RESPONSE, UPDATE, or MESSAGE\_TAG \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Send Message

\*\*Slug:\*\* \`FACEBOOK\_SEND\_MESSAGE\`

Sends a text message from a Facebook Page (not personal profiles) to a user via Messenger. Requires explicit user confirmation before calling, as this action delivers a message to a real end user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tag\` \| string \| No \| Required when messaging\_type is MESSAGE\_TAG. Valid tags: HUMAN\_AGENT (within 7 days of last user message for human agent responses), CONFIRMED\_EVENT\_UPDATE (for registered event updates), POST\_PURCHASE\_UPDATE (for purchase-related updates), ACCOUNT\_UPDATE (for non-recurring account changes). \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page sending the message Must be a numeric page ID, not a username or alias. \|
\| \`message\_text\` \| string \| Yes \| The text content of the message to send \|
\| \`recipient\_id\` \| string \| Yes \| The ID of the message recipient (user ID or PSID) Must be a numeric PSID, not a username or display name. \|
\| \`messaging\_type\` \| string \| No \| The messaging type - RESPONSE, UPDATE, or MESSAGE\_TAG. Use RESPONSE within 24 hours of user's last message. Use MESSAGE\_TAG with a tag parameter to send outside the 24-hour window. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Toggle Typing Indicator

\*\*Slug:\*\* \`FACEBOOK\_TOGGLE\_TYPING\_INDICATOR\`

Shows or hides the typing indicator for a user in Messenger.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page \|
\| \`typing\_on\` \| boolean \| Yes \| True to show typing indicator, False to hide it \|
\| \`recipient\_id\` \| string \| Yes \| The Page-Scoped ID (PSID) of the user to show/hide typing indicator for \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Unlike Post or Comment

\*\*Slug:\*\* \`FACEBOOK\_UNLIKE\_POST\_OR\_COMMENT\`

Removes a like from a Facebook post or comment.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`object\_id\` \| string \| Yes \| The ID of the post or comment to unlike. Facebook IDs are numeric strings (typically 15-20 digits). IMPORTANT: Always pass IDs as strings to preserve precision. Integer values will be converted to strings, but float values (including scientific notation like 5.3e+32) are rejected because they lose precision. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Comment

\*\*Slug:\*\* \`FACEBOOK\_UPDATE\_COMMENT\`

Updates an existing Facebook comment. IMPORTANT: This action requires a Page Access Token. The comment must belong to a post on a Page that you manage. Use the page\_id parameter to ensure the correct page token is used, especially if you manage multiple pages.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`message\` \| string \| Yes \| The new text content of the comment \|
\| \`page\_id\` \| string \| No \| The ID of the Facebook Page that owns the comment. Required to ensure the correct page access token is used. If not provided, the action will attempt to use the first available page's token, which may fail if you manage multiple pages. \|
\| \`is\_hidden\` \| boolean \| No \| Whether to hide or unhide the comment \|
\| \`comment\_id\` \| string \| Yes \| The ID of the comment to update. Format is typically 'objectId\_commentId' (e.g., '122157027176937815\_1371138271476143'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Page Settings

\*\*Slug:\*\* \`FACEBOOK\_UPDATE\_PAGE\_SETTINGS\`

Updates settings for a specific Facebook Page. Requires the authenticated user to have MANAGE and CREATE\_CONTENT tasks for the target page; verify roles via FACEBOOK\_GET\_PAGE\_ROLES. Not all fields (about, description, general\_info, etc.) are available for every Page category.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`about\` \| string \| No \| Updated about section for the page \|
\| \`phone\` \| string \| No \| Updated phone number \|
\| \`emails\` \| array \| No \| Updated email addresses \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page to update \|
\| \`website\` \| string \| No \| Updated website URL \|
\| \`description\` \| string \| No \| Updated description for the page \|
\| \`general\_info\` \| string \| No \| Updated general information \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Post

\*\*Slug:\*\* \`FACEBOOK\_UPDATE\_POST\`

Updates an existing Facebook Page post.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`message\` \| string \| No \| Updated text content of the post \|
\| \`post\_id\` \| string \| Yes \| The ID of the post to update \|
\| \`og\_phrase\` \| string \| No \| Open Graph phrase \|
\| \`og\_icon\_id\` \| string \| No \| Open Graph icon ID \|
\| \`og\_object\_id\` \| string \| No \| Open Graph object ID \|
\| \`og\_action\_type\_id\` \| string \| No \| Open Graph action type ID \|
\| \`og\_suggestion\_mechanism\` \| string \| No \| Open Graph suggestion mechanism \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upload Photo

\*\*Slug:\*\* \`FACEBOOK\_UPLOAD\_PHOTO\`

DEPRECATED: Use FACEBOOK\_CREATE\_PHOTO\_POST instead. Uploads a photo file directly to a Facebook Page. Supports local file upload up to 10MB.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| No \| Public URL of the photo (must be accessible by Facebook servers). Alternative to 'photo'. Use this for images hosted on external servers. Must be a direct HTTPS endpoint returning an image MIME type; redirects, HTML pages, and non-HTTPS URLs fail validation. \|
\| \`tags\` \| array \| No \| List of user tags with format \[{'tag\_uid': 'USER\_ID', 'x': 50, 'y': 50}\] \|
\| \`photo\` \| object \| No \| Photo file to upload (max 10MB). Alternative to 'url'. If a URL string is mistakenly passed here, it will be auto-converted to use the 'url' parameter. \|
\| \`caption\` \| string \| No \| Caption for the photo \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page. Can be provided as a string or number. Must be a Page ID; personal profile/user timeline IDs are not valid. \|
\| \`published\` \| boolean \| No \| Whether to publish the photo immediately \|
\| \`targeting\` \| object \| No \| Audience targeting specifications \|
\| \`scheduled\_publish\_time\` \| integer \| No \| Unix timestamp to schedule the post Requires \`published=false\`; value must be a future UTC epoch in seconds. Using \`published=true\` with this field causes validation errors. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upload Photos Batch

\*\*Slug:\*\* \`FACEBOOK\_UPLOAD\_PHOTOS\_BATCH\`

Uploads up to 50 independent photos to a Facebook Page or Album using the Graph batch API. With published=true, each page photo may create its own feed story; this action does not create one post containing all photos. Use FACEBOOK\_CREATE\_MULTI\_PHOTO\_POST for one multi-photo feed post.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`photos\` \| array \| No \| List of photo files to upload (max 50 photos) \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page \|
\| \`album\_id\` \| string \| No \| ID of album to add photos to. If not provided, photos will be uploaded to timeline \|
\| \`published\` \| boolean \| No \| Whether to publish the photos immediately To schedule, set to false and include \`scheduled\_publish\_time\` as a Unix UTC epoch timestamp; mismatched combinations trigger 400 errors. \|
\| \`photo\_urls\` \| array \| No \| List of photo URLs to upload (alternative to 'photos') Must be direct, publicly accessible HTTPS URLs — no redirects, private URLs, or HTTP. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upload Video (Deprecated)

\*\*Slug:\*\* \`FACEBOOK\_UPLOAD\_VIDEO\`

DEPRECATED: Use CreateVideoPost instead. Uploads a video file directly to a Facebook Page. Supports local file upload. For large videos (>100MB), uses resumable upload. After upload completes, the video enters a processing/pending state; do not reference or schedule it until processing finishes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| No \| Title of the video \|
\| \`video\` \| object \| No \| Video file to upload (max 10GB, recommended under 1GB). Either 'video' or 'file\_url' must be provided. Use MP4 with H.264 video and AAC audio to avoid upload failures. \|
\| \`page\_id\` \| string \| Yes \| The ID of the Facebook Page \|
\| \`file\_url\` \| string \| No \| URL of a publicly accessible video file to upload. Either 'file\_url' or 'video' must be provided. This is an alternative to uploading a local file. \|
\| \`published\` \| boolean \| No \| Whether to publish immediately \|
\| \`targeting\` \| object \| No \| Audience targeting specifications \|
\| \`description\` \| string \| No \| Description of the video \|
\| \`content\_tags\` \| array \| No \| List of content tags \|
\| \`custom\_labels\` \| array \| No \| Custom labels for the video \|
\| \`scheduled\_publish\_time\` \| integer \| No \| Unix timestamp to schedule the video post Requires \`published=false\`; combining with \`published=true\` triggers a 400 validation error. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|
