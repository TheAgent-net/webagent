---
url: https://docs.composio.dev/toolkits/instagram.md
title: https://docs.composio.dev/toolkits/instagram.md
description: 
status: 200
---

\# Instagram

Instagram is a social media platform for sharing photos, videos, and stories. Only supports Instagram Business and Creator accounts, not Instagram Personal accounts.

\- \*\*Category:\*\* social media accounts
\- \*\*Auth:\*\* OAUTH2
\- \*\*Composio-managed OAuth available?\*\* Yes
\- \*\*Tools:\*\* 36
\- \*\*Triggers:\*\* 0
\- \*\*Slug:\*\* \`INSTAGRAM\`
\- \*\*Version:\*\* 20260819\_00

\## Frequently Asked Questions

\### Instagram requires a Business or Creator account

Instagram toolkit support is for Instagram Business/Creator account flows. If a user is using a personal Instagram account, convert or connect a Business/Creator account linked through Meta/Facebook as required by Instagram's API.

\### Why can Instagram reply-to-comment fail with the managed OAuth app?

Instagram comment tools can require Meta's comment-management permission, such as \`instagram\_manage\_comments\` for Facebook Login or \`instagram\_business\_manage\_comments\` for Instagram Business Login. Those permissions must be configured on the Meta app and approved by Meta before the OAuth flow can grant them.

If a reply-to-comment flow fails because the managed OAuth app does not currently have the required comment permission, use your own Meta OAuth app with that permission configured and approved. Composio is working on managed-app approval for the missing permission, but an owned Meta app is the current unblock path for production usage.

\## Tools

\### Create Carousel Container

\*\*Slug:\*\* \`INSTAGRAM\_CREATE\_CAROUSEL\_CONTAINER\`

Create a draft carousel post with multiple images/videos before publishing. Instagram requires carousels to have between 2 and 10 media items. Container creation\_ids expire in under 24 hours, so publish promptly after creation.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`caption\` \| string \| No \| Caption for the carousel post (maximum 2,200 characters) Maximum 30 hashtags. \|
\| \`children\` \| array \| No \| List of child creation\_ids (image/video items). Total carousel items across all sources must be between 2 and 10. All child containers must be in FINISHED status before use; pending or failed items will block carousel creation. Order of IDs determines slide sequence. \|
\| \`ig\_user\_id\` \| string \| Yes \| Instagram Business Account ID Must be a Business or Creator account; personal accounts are rejected. \|
\| \`location\_id\` \| string \| No \| Facebook Page ID of a location to tag on the carousel. The Page must have latitude/longitude data. \|
\| \`share\_to\_feed\` \| boolean \| No \| Whether the carousel should also appear in the main feed. \|
\| \`child\_image\_urls\` \| array \| No \| List of image URLs to include as carousel children. Images must meet Instagram's requirements: JPEG format, aspect ratio between 4:5 (0.8) and 1.91:1, width between 320-1440px (images below 320px are scaled up, larger images are downscaled), maximum file size 8MB. URLs must be publicly accessible by Instagram's servers. Total carousel items across all sources must be between 2 and 10. Must be direct HTTPS URLs (not HTML pages, redirects, or generic Google Drive share links); use a public direct-download link. \|
\| \`child\_video\_urls\` \| array \| No \| List of video URLs to include as carousel children. Videos must meet Instagram's requirements: MP4 or MOV format, aspect ratio between 4:5 (0.8) and 1.91:1, duration 3-60 seconds, maximum file size 4GB. URLs must be publicly accessible by Instagram's servers. Total carousel items across all sources must be between 2 and 10. Must be direct HTTPS URLs (not HTML pages, redirects, or generic Google Drive share links). \|
\| \`child\_image\_files\` \| array \| No \| List of local image files to include as carousel children. Images must meet Instagram's requirements: JPEG format, aspect ratio between 4:5 (0.8) and 1.91:1, width between 320-1440px (images below 320px are scaled up, larger images are downscaled), maximum file size 8MB. Total carousel items across all sources must be between 2 and 10. \|
\| \`child\_video\_files\` \| array \| No \| List of local video files to include as carousel children. Videos must meet Instagram's requirements: MP4 or MOV format, aspect ratio between 4:5 (0.8) and 1.91:1, duration 3-60 seconds, maximum file size 4GB. Total carousel items across all sources must be between 2 and 10. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Media Container (Deprecated)

\*\*Slug:\*\* \`INSTAGRAM\_CREATE\_MEDIA\_CONTAINER\`

DEPRECATED: Use INSTAGRAM\_POST\_IG\_USER\_MEDIA instead. Creates a draft media container for photos/videos/reels before publishing. Business/Creator accounts only — personal accounts unsupported. Returns a container ID (data.id or data.creation\_id) used as creation\_id for publishing. Containers expire in ~24 hours — recreate stale containers rather than reusing old IDs. Before publishing via INSTAGRAM\_CREATE\_POST, call INSTAGRAM\_GET\_POST\_STATUS and wait for FINISHED status — publishing before FINISHED triggers error 9007. Each creation\_id is one-time-use; if container creation fails (status\_code='ERROR'), fix media params and recreate via this tool rather than retrying publish with the failed ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`caption\` \| string \| No \| Post caption text. Maximum 2,200 characters. Hashtag limit: 30 hashtags maximum per post (Instagram enforces this limit). Mention limit: 20 @mentions maximum. \|
\| \`alt\_text\` \| string \| No \| Custom accessibility alt text for a single image or an image carousel child. Maximum 1,000 characters. Not supported for videos, Reels, Stories, or carousel parent containers. \|
\| \`cover\_url\` \| string \| No \| Cover image URL for videos/Reels. Query parameters, including signed CDN or object-storage URLs, are supported as long as the complete URL remains accessible while Meta processes the container. Optional - if omitted, Instagram generates a cover from the video (or uses thumb\_offset). \|
\| \`image\_url\` \| string \| No \| Public URL of the image. CRITICAL REQUIREMENTS: (1) Must be a DIRECT link to the raw image file - no HTML wrappers or interactive authentication. Query parameters, including signed CDN or object-storage URLs, are supported as long as the complete URL remains accessible while Meta processes the container. (2) Must be accessible by Meta's crawlers without cookies or additional request headers (Google Drive share pages and generated HTML endpoints will NOT work). (3) Must return proper HTTP 200 status with correct Content-Type header (image/jpeg or image/png). (4) Supported formats: JPG, PNG (WebP not supported). Max 8MB, min 320px width, aspect ratio 4:5 to 1.91:1. RECOMMENDED: Use image hosting services like Imgur, Cloudinary, AWS S3, or similar that provide direct or sufficiently long-lived signed download URLs. For videos, a thumbnail is optional — omit it and Instagram generates a cover, or use cover\_url / thumb\_offset. \|
\| \`user\_tags\` \| array \| No \| Array of user tag objects for tagging public Instagram accounts. For images each tag needs username, x and y (0.0-1.0 from top-left); for Reels only username is allowed. \|
\| \`video\_url\` \| string \| No \| Public URL of the video. CRITICAL REQUIREMENTS: (1) Must be a DIRECT link to the raw video file - no HTML wrappers or interactive authentication. Query parameters, including signed CDN or object-storage URLs, are supported as long as the complete URL remains accessible while Meta processes the container. (2) Must be accessible by Meta's crawlers without cookies or additional request headers (Google Drive share pages and generated HTML endpoints will NOT work). (3) Must return proper HTTP 200 status with correct Content-Type header (video/mp4 or video/quicktime). (4) Supported formats: MP4, MOV. Max 100MB for feed videos, max 1GB for IGTV, min 3 seconds duration. RECOMMENDED: Use video hosting services or cloud storage like AWS S3, Cloudinary, or similar with a direct or sufficiently long-lived signed URL. \|
\| \`ig\_user\_id\` \| string \| No \| Instagram Business Account ID (numeric string like '17841400008460056'). Optional - defaults to the current authenticated user. Do NOT pass Composio connection IDs (starting with 'ca\_') or other auth identifiers. \|
\| \`media\_type\` \| string ("REELS" \| "CAROUSEL" \| "STORIES") \| No \| Explicit media type override (REELS, CAROUSEL, or STORIES). For plain image containers, leave this unset - image is the default and media\_type must NOT be sent. REELS requires video\_url. NOTE: VIDEO media\_type was deprecated on November 9, 2023 and, if provided, is automatically converted to REELS. \|
\| \`location\_id\` \| string \| No \| Facebook Page ID of a location to tag. The Page must have latitude/longitude data. \|
\| \`content\_type\` \| string ("photo" \| "video" \| "reel" \| "carousel\_item") \| No \| What you want to post: 'photo', 'video', 'reel', or 'carousel\_item' (for carousel drafts) \|
\| \`thumb\_offset\` \| integer \| No \| For videos/Reels - millisecond offset used to capture the cover thumbnail frame. \|
\| \`share\_to\_feed\` \| boolean \| No \| For Reels - whether to also show the Reel in the main feed. Only applicable to REELS. \|
\| \`is\_carousel\_item\` \| boolean \| No \| Legacy parameter to mark media as a carousel item. Prefer using content\_type='carousel\_item' instead, which automatically sets this flag. When creating carousel items, you must provide either image\_url or video\_url. Carousels support a maximum of 10 items; each item must independently satisfy format, size, and aspect-ratio constraints. \|
\| \`graph\_api\_version\` \| string \| No \| The Facebook Graph API version to use for the request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Post (Deprecated)

\*\*Slug:\*\* \`INSTAGRAM\_CREATE\_POST\`

DEPRECATED: Use INSTAGRAM\_POST\_IG\_USER\_MEDIA\_PUBLISH instead. Publish a draft media container to Instagram (final publishing step). Posts become immediately and publicly visible upon success — confirm intent before calling. Requires Business or Creator account with publish scopes; missing scopes return Graph error code 10. After creating a media container, Instagram may need time to process media before publishing. If called too early, error code 9007 is returned. This action automatically retries with exponential backoff (up to ~44 seconds total). For large videos, use INSTAGRAM\_GET\_POST\_STATUS to poll until status\_code='FINISHED' before calling; for carousels, all child containers must individually reach FINISHED status first. No native scheduling support — use an external scheduler to trigger this call at the desired time.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ig\_user\_id\` \| string \| Yes \| Instagram Business Account ID. Must be a numeric string (e.g., '25162441193410545'). Personal accounts and misconfigured IDs are rejected. \|
\| \`creation\_id\` \| string \| Yes \| The media container ID returned in the 'id' field from INSTAGRAM\_CREATE\_MEDIA\_CONTAINER or INSTAGRAM\_CREATE\_CAROUSEL\_CONTAINER. Typically a long numeric string like '17895695668004550'. IMPORTANT: Do NOT use datetime strings (e.g., '2024-01-15T10:30:00+0000') - those are unrelated fields in Instagram responses. The container ID is found in the response like: {'id': '17895695668004550'}. Containers expire after ~24 hours; recreate via INSTAGRAM\_CREATE\_MEDIA\_CONTAINER if stale. \|
\| \`graph\_api\_version\` \| string \| No \| The Facebook Graph API version to use for the request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Comment

\*\*Slug:\*\* \`INSTAGRAM\_DELETE\_COMMENT\`

Tool to delete a comment on Instagram media. Use when you need to remove a comment that was created by your Instagram Business or Creator Account. Note: You can only delete comments that your account created - you cannot delete other users' comments unless they are on your own media.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ig\_comment\_id\` \| string \| Yes \| The unique identifier of the Instagram comment to delete. This must be a comment created by your Instagram Business or Creator Account. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use. Defaults to v21.0. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Messenger Profile

\*\*Slug:\*\* \`INSTAGRAM\_DELETE\_MESSENGER\_PROFILE\`

Delete ice breakers or a persistent menu from an Instagram messenger profile.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| array \| Yes \| Array of Instagram messenger profile properties to delete. Valid values: ice\_breakers, persistent\_menu. Only the specified fields will be removed. \|
\| \`ig\_user\_id\` \| string \| Yes \| Instagram Business Account ID whose messenger profile settings will be deleted. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use. Defaults to v21.0. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Conversation

\*\*Slug:\*\* \`INSTAGRAM\_GET\_CONVERSATION\`

Get details about a specific Instagram DM conversation (participants, etc). Requires a Business or Creator account with Instagram messaging permissions; personal accounts will return permission errors. Newly sent/received messages may take a few seconds to appear in results.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`conversation\_id\` \| string \| Yes \| The unique identifier for the Instagram conversation thread. The thread must already exist; first-contact DMs cannot be initiated via the API — a manual first message must be sent before a conversation\_id is available.This is typically a base64-encoded string obtained from the list\_conversations or list\_all\_conversations actions. Must not be empty or contain only whitespace. \|
\| \`graph\_api\_version\` \| string \| No \| The Graph API version to use (e.g., 'v21.0'). Defaults to 'v21.0'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IG Comment Replies

\*\*Slug:\*\* \`INSTAGRAM\_GET\_IG\_COMMENT\_REPLIES\`

Get replies to a specific Instagram comment. Returns a list of comment replies with details like text, username, timestamp, and like count. Use when you need to retrieve child comments (replies) for a specific parent comment.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for forward pagination - get replies after this cursor \|
\| \`limit\` \| integer \| No \| Number of replies to return per page (max 100) \|
\| \`before\` \| string \| No \| Cursor for backward pagination - get replies before this cursor \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return. Available fields: id, text, username, timestamp, like\_count, hidden, from, media, parent\_id, replies, legacy\_instagram\_comment\_id \|
\| \`ig\_comment\_id\` \| string \| Yes \| Instagram Comment ID to get replies for \|
\| \`graph\_api\_version\` \| string \| No \| Graph API version to use \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Instagram Media

\*\*Slug:\*\* \`INSTAGRAM\_GET\_IG\_MEDIA\`

Get a published Instagram Media object (photo, video, story, reel, or carousel). Use when you need to retrieve detailed information about a specific Instagram post including engagement metrics, caption, media URLs, and metadata. NOTE: This action is for published media only. For unpublished container IDs (from INSTAGRAM\_CREATE\_MEDIA\_CONTAINER), use INSTAGRAM\_GET\_POST\_STATUS to check status instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return. Supported: id, caption, comments\_count, is\_comment\_enabled, like\_count, media\_type, media\_url, media\_product\_type, legacy\_instagram\_media\_id, owner, permalink, shortcode, thumbnail\_url, timestamp, username, alt\_text, is\_ai\_generated, is\_shared\_to\_feed, media\_audio\_type, view\_count, reposts\_count, saved\_count, shares\_count, total\_like\_count, total\_comments\_count, total\_views\_count, children, comments. For nested fields use 'children{media\_url,media\_type}'. UNSUPPORTED (cause errors): tagged\_users, user\_tags, location, filter\_name, latitude, longitude, text — use 'caption' not 'text'. For insights metrics use INSTAGRAM\_GET\_IG\_MEDIA\_INSIGHTS. Tagged-media retrieval is unavailable through this Instagram Login toolkit. A MediaBuilder error means the ID is an unpublished container — use INSTAGRAM\_GET\_POST\_STATUS. \|
\| \`ig\_media\_id\` \| string \| Yes \| The numeric ID of the Instagram media object from the Graph API (e.g., '17858625294504375'). IMPORTANT: This must be a numeric string, NOT an alphanumeric shortcode from instagram.com/p// URLs (e.g., 'DUTi4n4D9wg' is NOT valid). Obtain numeric IDs from INSTAGRAM\_GET\_IG\_USER\_MEDIA or similar endpoints. For unpublished container IDs, use INSTAGRAM\_GET\_POST\_STATUS instead. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IG Media Children

\*\*Slug:\*\* \`INSTAGRAM\_GET\_IG\_MEDIA\_CHILDREN\`

Tool to get media objects (images/videos) that are children of an Instagram carousel/album post. Use when you need to retrieve individual media items from a carousel album post. Note: Carousel children media do not support insights queries - for analytics, query metrics at the parent carousel level.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for each child media item. Available fields: id, caption, media\_type, media\_url, username, timestamp, permalink, thumbnail\_url, ig\_id, owner, shortcode, is\_comment\_enabled, comments\_count, like\_count \|
\| \`ig\_media\_id\` \| string \| Yes \| The ID of a CAROUSEL\_ALBUM media post (not a user ID). This must be a media ID from a carousel/album post, typically obtained by calling 'Get IG User Media' action first and filtering for media\_type='CAROUSEL\_ALBUM'. Media IDs are numeric strings (17 digits) that identify specific Instagram posts, distinct from user/account IDs. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IG Media Comments

\*\*Slug:\*\* \`INSTAGRAM\_GET\_IG\_MEDIA\_COMMENTS\`

Tool to retrieve comments on an Instagram media object. Use when you need to fetch comments from a specific Instagram post, photo, video, or carousel owned by the connected Business/Creator account. Supports cursor-based pagination for navigating through large comment lists. An empty data array in the response indicates the post has no comments and is not an error. Bulk-fetching across many media objects may trigger API rate limits.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for forward pagination. Use the cursor value from previous response's paging.cursors.after field \|
\| \`limit\` \| integer \| No \| Number of comments to return per page (typically 50-100) \|
\| \`before\` \| string \| No \| Cursor for backward pagination. Use the cursor value from previous response's paging.cursors.before field \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to retrieve for each comment. Available fields: id, text, username, timestamp, like\_count, replies, from, hidden, media, parent\_id, user \|
\| \`ig\_media\_id\` \| string \| Yes \| The ID of the Instagram media object (post/photo/video/album) to retrieve comments from. Must be a Media ID, not a User ID. Media IDs can be obtained from endpoints like GET /ig-user-id/media. Media IDs typically look like '17858625294504375'. The media must belong to the connected Business/Creator account; media from other accounts will return empty data or an error. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IG Media Insights

\*\*Slug:\*\* \`INSTAGRAM\_GET\_IG\_MEDIA\_INSIGHTS\`

Tool to get insights and metrics for Instagram media objects (photos, videos, reels, carousel albums). Use when you need to retrieve performance data such as views, reach, likes, comments, saves, and shares for specific media. Note: Insights data is only available for media published within the last 2 years, and the account must have at least 1,000 followers. Requires a Business or Creator account; personal Instagram profiles are not supported.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`metric\` \| array \| Yes \| List of metrics to retrieve. Must be provided as an array of strings, e.g., \['reach', 'saved', 'likes'\]. COMMONLY SUPPORTED METRICS: views, reach, saved, likes, comments, shares, total\_interactions, reposts. REELS-SPECIFIC METRICS: ig\_reels\_video\_view\_total\_time, ig\_reels\_avg\_watch\_time, reels\_skip\_rate, facebook\_views, crossposted\_views. FEED-AND-STORY METRICS: profile\_activity. STORIES-SPECIFIC METRICS: link\_clicks, replies, navigation, follows, profile\_visits. DEPRECATED METRICS (will be filtered out): 'impressions', 'plays', 'video\_views', 'clips\_replays\_count', 'ig\_reels\_aggregated\_all\_plays\_count' (use 'views' instead); 'taps\_forward', 'taps\_back', 'exits' (Story navigation metrics deprecated in API v18+, use 'navigation' instead). INVALID METRIC NAMES (will be rejected): 'clicks', 'engagement' are NOT valid metric names. \|
\| \`period\` \| string \| No \| The time period for metric aggregation. Instagram media insights automatically use 'lifetime'; other period values are not supported. \|
\| \`breakdown\` \| string ("action\_type" \| "story\_navigation\_action\_type") \| No \| Optional breakdown dimension for supported metrics. Allowed values: 'action\_type' (e.g. for profile\_activity) and 'story\_navigation\_action\_type' (for Story navigation). Only applicable to metrics that support breakdowns. \|
\| \`ig\_media\_id\` \| string \| Yes \| The ID of the Instagram media object (photo, video, reel, carousel album) for which to retrieve insights \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IG User Content Publishing Limit

\*\*Slug:\*\* \`INSTAGRAM\_GET\_IG\_USER\_CONTENT\_PUBLISHING\_LIMIT\`

Get an Instagram Business Account's current content publishing usage. Use this to monitor quota usage before publishing; exceeding the daily cap blocks new posts until the quota resets (no partial failure — new publish calls are rejected until reset). IMPORTANT: This endpoint requires an IG User ID (Instagram Business Account ID), NOT an IGSID (Instagram Scoped ID). IGSID is only used for messaging-related endpoints. Content publishing endpoints require a proper IG User ID. Excessive polling of this endpoint may trigger Graph error 613 (rate limit); space calls several seconds apart.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`since\` \| integer \| No \| Unix timestamp marking the start of the 24-hour window to measure usage from. Must be within the last 24 hours (older values are rejected by Instagram). If omitted, the window ends at the current time. \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return. Available fields: quota\_usage, config. Defaults to 'quota\_usage,config'. \|
\| \`ig\_user\_id\` \| string \| No \| Instagram Business Account ID (IG User ID). Must be a valid IG User ID, NOT an IGSID/scoped ID (used for messaging). Defaults to 'me' for current user. To get your IG User ID, use GET /{facebook-page-id}?fields=instagram\_business\_account. \|
\| \`graph\_api\_version\` \| string \| No \| Facebook Graph API version to use \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IG User Live Media

\*\*Slug:\*\* \`INSTAGRAM\_GET\_IG\_USER\_LIVE\_MEDIA\`

Get live media objects during an active Instagram broadcast. Returns the live video media ID and metadata when a live broadcast is in progress on an Instagram Business or Creator account. Use this to monitor active live streams and access real-time engagement data.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for the live media object. Available fields: id, media\_type, media\_url, timestamp, permalink. Defaults to all available fields. \|
\| \`ig\_user\_id\` \| string \| No \| Instagram Business or Creator Account ID (optional, defaults to 'me' for current user). Must be an account with an active live broadcast. \|
\| \`graph\_api\_version\` \| string \| No \| Facebook Graph API version to use \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IG User Media

\*\*Slug:\*\* \`INSTAGRAM\_GET\_IG\_USER\_MEDIA\`

Get Instagram user's media collection (posts, photos, videos, reels, carousels). Use when you need to retrieve all media published by an Instagram Business or Creator account with support for pagination and time-based filtering.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for forward pagination - retrieve media after this cursor Value comes from paging.cursors.after in the response; stopping at the first page silently omits older posts. \|
\| \`limit\` \| integer \| No \| Number of media items to return per page (default: 25, max: 100) \|
\| \`since\` \| integer \| No \| Unix timestamp - filter results to media created after this time. If both 'since' and 'until' are provided, 'since' must be less than 'until'. \|
\| \`until\` \| integer \| No \| Unix timestamp - filter results to media created before this time. If both 'since' and 'until' are provided, 'since' must be less than 'until'. \|
\| \`before\` \| string \| No \| Cursor for backward pagination - retrieve media before this cursor \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return. Available fields: id, caption, media\_type, media\_url, permalink, thumbnail\_url, timestamp, username, comments\_count, like\_count, legacy\_instagram\_media\_id, is\_comment\_enabled, owner, shortcode, media\_product\_type, alt\_text, is\_ai\_generated, is\_shared\_to\_feed, media\_audio\_type, view\_count, reposts\_count, saved\_count, shares\_count, total\_like\_count, total\_comments\_count, total\_views\_count, children{media\_url,media\_type,thumbnail\_url} Reels appear as media\_type=VIDEO and media\_product\_type=REELS; filter both fields to identify reels. media\_url is a direct file URL; permalink is the user-facing share link. Optional fields like caption and like\_count may be null or absent in the response. \|
\| \`ig\_user\_id\` \| string \| Yes \| Instagram Business or Creator Account ID. Use 'me' for the authenticated user, or provide the numeric IG User ID obtained from the Instagram Graph API (typically 17 digits, e.g., '17841405793187218'). Facebook Page IDs are not supported or automatically converted. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use (e.g., 'v21.0') \|
\| \`auto\_resolve\_fb\_page\_id\` \| boolean \| No \| Deprecated no-op retained for backwards compatibility. On Instagram Login the host follows the token (graph.instagram.com) and Facebook Page IDs are not resolved. Provide an Instagram Business or Creator Account ID directly (or 'me'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IG User Stories

\*\*Slug:\*\* \`INSTAGRAM\_GET\_IG\_USER\_STORIES\`

Get active story media objects for an Instagram Business or Creator account. Stories are retrieved via the /stories endpoint. Returns stories that are currently active within the 24-hour window. Use this to retrieve story content, metadata, and engagement metrics for monitoring or analytics purposes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination to get the next page of results. Use the 'after' cursor from the previous response's paging object. \|
\| \`limit\` \| integer \| No \| Number of stories to return per page for pagination. If not specified, returns all active stories. \|
\| \`before\` \| string \| No \| Cursor for pagination to get the previous page of results. Use the 'before' cursor from the previous response's paging object. \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for each story. Available fields: id, caption, comments\_count, ig\_id, is\_comment\_enabled, like\_count, media\_type, media\_url, owner, permalink, shortcode, thumbnail\_url, timestamp, username. If not specified, defaults to id, media\_type, media\_url, permalink, and timestamp. \|
\| \`ig\_user\_id\` \| string \| No \| Instagram Business or Creator Account ID (optional, defaults to 'me' for current user). Must be an account with active stories within the 24-hour window. Must be a numeric ID; usernames are not accepted. \|
\| \`graph\_api\_version\` \| string \| No \| Facebook Graph API version to use \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IG User Tags (Deprecated)

\*\*Slug:\*\* \`INSTAGRAM\_GET\_IG\_USER\_TAGS\`

Deprecated because the Instagram API with Instagram Login does not support tagging. Use a Facebook Login-based Instagram integration for tagged media.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for forward pagination - retrieve media after this cursor \|
\| \`limit\` \| integer \| No \| Number of tagged media items to return per page (default: 25, max: 100) \|
\| \`before\` \| string \| No \| Cursor for backward pagination - retrieve media before this cursor \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return. Available fields: id, caption, comments\_count, ig\_id, is\_comment\_enabled, like\_count, media\_product\_type, media\_type, media\_url, owner, permalink, shortcode, thumbnail\_url, timestamp, username, video\_title. If not specified, defaults to commonly used fields. \|
\| \`ig\_user\_id\` \| string \| Yes \| Instagram Business or Creator Account ID. Use 'me' for the authenticated user's account. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version (e.g., 'v21.0'). If not specified, uses v21.0 as default. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Messenger Profile

\*\*Slug:\*\* \`INSTAGRAM\_GET\_MESSENGER\_PROFILE\`

Get the messenger profile settings for an Instagram account. Returns ice breakers and other messaging configuration. Use when you need to retrieve messaging settings, ice breaker questions, or messenger configuration for an Instagram Business account.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Comma-separated list of messenger profile fields to retrieve. Available options: ice\_breakers, persistent\_menu. Defaults to both supported fields. \|
\| \`ig\_user\_id\` \| string \| Yes \| The Instagram User ID for which to retrieve messenger profile settings \|
\| \`graph\_api\_version\` \| string \| No \| The Graph API version to use (e.g., 'v21.0'). Defaults to 'v21.0'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Page Conversations

\*\*Slug:\*\* \`INSTAGRAM\_GET\_PAGE\_CONVERSATIONS\`

Get Instagram conversations for a Page connected to an Instagram Business account. Use platform=instagram parameter to filter for Instagram conversations only.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination to get the next page of results. \|
\| \`limit\` \| integer \| No \| Maximum number of conversations to return per page. \|
\| \`platform\` \| string \| No \| Platform to filter conversations. Set to 'instagram' to get Instagram conversations only. \|
\| \`ig\_user\_id\` \| string \| Yes \| Instagram Business Account ID to get conversations for. This is the Instagram Business Account ID that can be obtained from the /me endpoint. On graph.instagram.com this cannot be a Facebook Page ID. \|
\| \`graph\_api\_version\` \| string \| No \| The Graph API version to use (e.g., 'v21.0'). Defaults to 'v21.0'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Post Comments (Deprecated)

\*\*Slug:\*\* \`INSTAGRAM\_GET\_POST\_COMMENTS\`

DEPRECATED: Use INSTAGRAM\_GET\_IG\_MEDIA\_COMMENTS instead. Get comments on an Instagram post. Requires Instagram Business or Creator account. Returns empty \`data\` array (not an error) when no comments exist. Response data is nested under \`data.data\`; unwrap before processing. Timestamps are timezone-aware ISO 8601 strings; use UTC-based comparison.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for forward pagination - get comments after this cursor. Value comes from \`paging.cursors.after\` in the response. \|
\| \`limit\` \| integer \| No \| Number of comments to return (max 100) \|
\| \`before\` \| string \| No \| Cursor for backward pagination - get comments before this cursor. Value comes from \`paging.cursors.before\` in the response. \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return for each comment. Available fields: id, text, timestamp, like\_count, hidden, username, from, replies, media, parent\_id, legacy\_instagram\_comment\_id \|
\| \`ig\_post\_id\` \| string \| Yes \| Instagram Post ID \|
\| \`graph\_api\_version\` \| string \| No \| The Facebook Graph API version to use for the request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Post Insights (Deprecated)

\*\*Slug:\*\* \`INSTAGRAM\_GET\_POST\_INSIGHTS\`

DEPRECATED: Use INSTAGRAM\_GET\_IG\_MEDIA\_INSIGHTS instead. Get Instagram post insights/analytics (impressions, reach, engagement, etc.). Requires a Business or Creator account; personal accounts cannot access insights. Metrics may be unavailable for several minutes after publishing; verify post status is FINISHED before calling.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`metric\` \| string \| No \| Metrics to retrieve for the media. Accepts a comma-separated string (e.g. 'reach,likes,comments') or an array of strings. If not provided and metric\_preset is not set, uses auto\_safe preset. Allowed metrics vary by media\_product\_type: IMAGE/CAROUSEL: reach, likes, comments, saved, shares. VIDEO: reach, views, likes, comments, saved, shares. REELS: reach, likes, comments, saved, shares, total\_interactions, ig\_reels\_video\_view\_total\_time, ig\_reels\_avg\_watch\_time, views, reels\_skip\_rate. Stories: reach, replies. Note: 'engagement' and 'impressions' are NOT valid standalone metrics - use individual metrics like likes, comments, saved, shares instead. 'plays' is dead (removed April 21, 2025) - use 'views' instead. If a metric is unsupported for the post type, API returns 400 error. Some metrics (e.g., shares) may return null even for supported media types; handle missing values before computing ratios. \|
\| \`ig\_post\_id\` \| string \| Yes \| Numeric Instagram Media ID from the Graph API (e.g., '17895695668004196'). This must be the numeric ID, NOT the shortcode from Instagram URLs (e.g., 'DT0ndbTgcLH' from instagram.com/p/DT0ndbTgcLH/ will NOT work). Use INSTAGRAM\_GET\_IG\_USER\_MEDIA to obtain valid numeric media IDs. \|
\| \`metric\_preset\` \| string ("auto\_safe" \| "image\_basic" \| "video\_basic" \| "reel\_basic" \| "carousel\_basic") \| No \| Predefined metric sets for different media types to avoid API errors. \|
\| \`graph\_api\_version\` \| string \| No \| The Facebook Graph API version to use for the request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Post Status (Deprecated)

\*\*Slug:\*\* \`INSTAGRAM\_GET\_POST\_STATUS\`

DEPRECATED: Use GetIgMedia instead. Check the processing status of a draft post container. Poll until status\_code='FINISHED' before calling INSTAGRAM\_CREATE\_POST; publishing early triggers OAuthException 9007 (HTTP 400). If status\_code='ERROR' or remains non-terminal after ~30 attempts, the container is permanently failed — recreate a new container. Poll every 3–5s with exponential backoff to avoid error 613/code 4/HTTP 429. For carousels, all child containers must reach FINISHED before publishing the parent.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`creation\_id\` \| string \| Yes \| The media container ID returned from INSTAGRAM\_CREATE\_MEDIA\_CONTAINER action. This is a numeric string (e.g., '17843131380645284') that uniquely identifies the media container. Use this ID to check the container's publishing status before calling the publish endpoint. Sourced from the data.id field (not data.creation\_id) in the INSTAGRAM\_CREATE\_MEDIA\_CONTAINER response. Containers expire after ~24 hours; do not reuse an expired creation\_id. \|
\| \`graph\_api\_version\` \| string \| No \| The Facebook Graph API version to use for the request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User Info

\*\*Slug:\*\* \`INSTAGRAM\_GET\_USER\_INFO\`

Get Instagram Business Account info including profile details and statistics. Use "me" to query your own authenticated account, or provide the numeric Business Account ID of an account you manage. NOTE: followers\_count and follows\_count are returned for your own profile (ig\_user\_id="me"). For other accounts, follower/follow counts are surfaced through the business\_discovery edge rather than this direct-node action, so they may be null here.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ig\_user\_id\` \| string \| No \| Instagram Business Account ID. IMPORTANT: You can only query Business/Creator accounts that you manage through Facebook Business Manager. Use "me" to query your own authenticated account. To query other accounts you manage, provide their numeric Business Account ID. Arbitrary public accounts cannot be queried. If not provided, defaults to "me". \|
\| \`graph\_api\_version\` \| string \| No \| The Facebook Graph API version to use for the request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User Insights

\*\*Slug:\*\* \`INSTAGRAM\_GET\_USER\_INSIGHTS\`

Get Instagram account-level insights and analytics (profile views, reach, follower count, etc.). Requires a Business or Creator account; personal accounts are not supported. Returned timestamps are in UTC. metric\_type (time\_series or total\_value): When set to total\_value, the API returns a total\_value object instead of values. breakdown: Only applicable when metric\_type=total\_value and only for supported metrics. timeframe: Required for demographics-related metrics and overrides since/until for those metrics.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`since\` \| integer \| No \| Start of time range (inclusive) as a Unix timestamp (seconds). Also accepts date strings (YYYY-MM-DD or ISO 8601 format) which will be converted to timestamps. \|
\| \`until\` \| integer \| No \| End of time range (inclusive) as a Unix timestamp (seconds). Also accepts date strings (YYYY-MM-DD or ISO 8601 format) which will be converted to timestamps. \|
\| \`metric\` \| array \| No \| List or comma-separated metrics. Valid: reach, follower\_count, online\_followers, accounts\_engaged, total\_interactions, likes, comments, shares, saves, replies, follows\_and\_unfollows, profile\_links\_taps, views, profile\_views, website\_clicks, reposts, threads\_likes, threads\_replies, threads\_followers, threads\_views, threads\_clicks, threads\_reposts, quotes, content\_views, and the demographics metrics engaged\_audience\_demographics, reached\_audience\_demographics, follower\_demographics, and threads\_follower\_demographics. All demographics metrics require \`timeframe\`. All metrics in one call must share a period. Empty results are valid when data is unavailable (follower\_count/online\_followers require 100 followers; Threads metrics require a linked Threads profile). Rejected by Meta, do not request: impressions, email\_contacts, phone\_call\_clicks, text\_message\_clicks, get\_directions\_clicks, audience\_\*. \|
\| \`period\` \| string ("day" \| "lifetime") \| No \| Valid period values for Instagram user insights aggregation. Available periods: - day: Daily aggregation (time-series metrics) - lifetime: Lifetime aggregation (for audience/demographics metrics) Note: 'week' and 'days\_28' are no longer supported for IG user insights. \|
\| \`breakdown\` \| string \| No \| Breakdown to use when metric\_type=total\_value. Allowed values: contact\_button\_type, follow\_type, media\_product\_type, age, city, country, gender. \|
\| \`timeframe\` \| string ("this\_month" \| "this\_week") \| No \| Valid timeframe values for demographics-related Instagram user insights. Required for engaged\_audience\_demographics, reached\_audience\_demographics, follower\_demographics, and threads\_follower\_demographics metrics. Overrides since/until parameters when specified. Note: As of 2025, Instagram deprecated the following timeframe values for demographics metrics: last\_14\_days, last\_30\_days, last\_90\_days, and prev\_month. Only this\_week and this\_month are currently supported by the Instagram Graph API. All demographics metrics use period=lifetime and require the timeframe parameter. \|
\| \`ig\_user\_id\` \| string \| No \| Instagram Business Account ID - must be a numeric ID (e.g., '17841400008460056'). Content API IDs with 'ca\_' prefix are not supported. Optional, defaults to current user. \|
\| \`metric\_type\` \| string \| No \| Aggregation type for results. Allowed values: time\_series, total\_value. \|
\| \`graph\_api\_version\` \| string \| No \| The Facebook Graph API version to use for the request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User Media (Deprecated)

\*\*Slug:\*\* \`INSTAGRAM\_GET\_USER\_MEDIA\`

DEPRECATED: Use INSTAGRAM\_GET\_IG\_USER\_MEDIA instead. Get Instagram user's media (posts, photos, videos). Only works for connected Business or Creator accounts; personal accounts return no data. Response data is nested under \`data.data\`; unwrap before processing. Items mix images, videos, carousels, and reels — filter by \`media\_type\` and \`media\_product\_type\`. Use \`media\_url\` for file download, \`permalink\` for share links. Fields like \`caption\`, \`like\_count\` may be null. Timestamps are UTC ISO 8601. HTTP 429 with \`Retry-After\` header indicates rate limiting.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination - get media after this cursor Chain calls using \`paging.cursors.after\` from the response to paginate; set an upper bound (e.g., ~300 posts) to avoid unbounded loops. \|
\| \`limit\` \| integer \| No \| Number of media items to return (max 100) A single call may not return all media; paginate via \`after\` for complete results. \|
\| \`ig\_user\_id\` \| string \| No \| Numeric Instagram Business Account ID (NOT username). Must be a numeric ID like '17841405793187218'. Omit or leave empty to get the current authenticated user's media. To find an account's numeric ID, use the INSTAGRAM\_GET\_USER\_INFO action. \|
\| \`graph\_api\_version\` \| string \| No \| The Facebook Graph API version to use for the request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List All Conversations

\*\*Slug:\*\* \`INSTAGRAM\_LIST\_ALL\_CONVERSATIONS\`

List all Instagram DM conversations for the authenticated user. Requires a Business/Creator account with messaging permissions; personal accounts return empty results. Response conversations are nested under \`data.data\` — accessing top-level \`data\` as the final list returns zero items. An empty \`data\` list is a valid non-error outcome meaning no conversations exist in scope.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination Obtain from \`paging.cursors.after\` in the response; absence of \`paging.cursors.after\` or \`paging.next\` signals end-of-results. \|
\| \`limit\` \| integer \| No \| Maximum number of conversations to return. \|
\| \`user\_id\` \| string \| No \| Optional Instagram-scoped user ID (IGSID) to find the conversation with a specific person. \|
\| \`platform\` \| string \| No \| Platform to filter conversations. Required by the Instagram messaging API; set to 'instagram'. \|
\| \`ig\_user\_id\` \| string \| No \| Instagram Business Account ID (optional for /me/conversations) \|
\| \`graph\_api\_version\` \| string \| No \| The Facebook Graph API version to use for the request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List All Messages

\*\*Slug:\*\* \`INSTAGRAM\_LIST\_ALL\_MESSAGES\`

List all messages from a specific Instagram DM conversation. Requires a Business or Creator account with messaging permissions; personal accounts return empty results. Response data is nested under data.data (double-wrapped); attachment-only messages may have empty text fields.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for paginationPass paging.cursors.after from the previous response to fetch the next page. Stop when paging.cursors.after or paging.next is absent. \|
\| \`limit\` \| integer \| No \| Maximum number of messages to return. \|
\| \`conversation\_id\` \| string \| Yes \| Unique identifier for the Instagram conversation. Obtain this by calling the INSTAGRAM\_LIST\_ALL\_CONVERSATIONS action, which returns conversation IDs in the format 'aWdfZAG06...' (base64-encoded string). \|
\| \`graph\_api\_version\` \| string \| No \| The Facebook Graph API version to use for the request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mark Seen

\*\*Slug:\*\* \`INSTAGRAM\_MARK\_SEEN\`

Mark Instagram DM messages as read/seen for a specific user. Sends a 'mark\_seen' sender action to indicate messages from the specified recipient have been read. Marking as seen is visible to the other party and changes inbox read state — use with explicit user approval in automated or bulk flows. IMPORTANT LIMITATIONS: - The sender\_action API feature may have limited support on Instagram - The recipient must have an active 24-hour messaging window open - Requires instagram\_manage\_messages permission - Only works with Instagram Business or Creator accounts If this action fails with a 500 error, it may indicate that the sender\_action feature is not supported for your Instagram account or the specific recipient.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ig\_user\_id\` \| string \| No \| Instagram Business Account ID. Optional - when not provided, the /me/messages endpoint is used instead of /{ig\_user\_id}/messages. \|
\| \`recipient\_id\` \| string \| Yes \| Instagram-Scoped User ID (IGSID) of the recipient. This is a numeric string obtained from conversation participants (e.g., '17841479358498320'). The recipient must have an existing conversation with your Instagram Business/Creator account. In multi-participant threads, use the individual participant's IGSID, not a group or thread identifier. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use (e.g., 'v21.0'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Post IG Comment Replies

\*\*Slug:\*\* \`INSTAGRAM\_POST\_IG\_COMMENT\_REPLIES\`

Tool to create a reply to an Instagram comment. Use when you need to reply to a specific comment on an Instagram post owned by a Business or Creator account. The reply must be 300 characters or less, contain at most 4 hashtags and 1 URL, and cannot consist entirely of capital letters.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`message\` \| string \| Yes \| The text content of the reply to be posted. Maximum length: 300 characters. Maximum 4 hashtags allowed. Maximum 1 URL allowed. Cannot consist entirely of capital letters. \|
\| \`ig\_comment\_id\` \| string \| Yes \| The unique identifier of the Instagram comment to which you want to reply. This is the ID of the parent comment that will receive the reply. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use. Defaults to v21.0. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Post IG Media Comments

\*\*Slug:\*\* \`INSTAGRAM\_POST\_IG\_MEDIA\_COMMENTS\`

Tool to create a comment on an Instagram media object. Use when you need to post a comment on a specific Instagram post, photo, video, or carousel. The comment must be 300 characters or less, contain at most 4 hashtags and 1 URL, and cannot consist entirely of capital letters.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`message\` \| string \| Yes \| The text content of the comment to be posted on the media object. Maximum length: 300 characters. Maximum 4 hashtags allowed. Maximum 1 URL allowed. Cannot consist entirely of capital letters. \|
\| \`ig\_media\_id\` \| string \| Yes \| The unique identifier of the Instagram media object where the comment will be posted. This is the ID of the Instagram post, photo, video, or carousel. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use. Defaults to v21.0. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Post IG User Media

\*\*Slug:\*\* \`INSTAGRAM\_POST\_IG\_USER\_MEDIA\`

Tool to create a media container for Instagram posts. Use this to create a container for images, videos, Reels, or carousels. This is the first step in Instagram's two-step publishing process - after creating the container, use the media\_publish endpoint to publish it.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`caption\` \| string \| No \| Caption text for the post. Use HTML URL encoding for hashtags (# becomes %23). \|
\| \`alt\_text\` \| string \| No \| Custom accessibility alt text for a single image or an image carousel child. Maximum 1,000 characters. Not supported for videos, Reels, Stories, or carousel parent containers. \|
\| \`children\` \| array \| No \| For carousel posts - array of container IDs (2-10 items) from previously created media containers. \|
\| \`cover\_url\` \| string \| No \| For Reels - MUST be a valid HTTP/HTTPS URL pointing to a custom cover image that Meta can fetch. Query parameters, including signed CDN or object-storage URLs, are supported as long as the complete URL remains accessible while the container is processed. If both cover\_url and thumb\_offset are provided, cover\_url takes precedence. \|
\| \`image\_url\` \| string \| No \| MUST be a valid HTTP/HTTPS URL pointing to a JPEG image file that Meta can fetch. Must start with 'http://' or 'https://' (e.g., 'https://example.com/image.jpg'). Query parameters, including signed CDN or object-storage URLs, are supported as long as the complete URL remains accessible to Meta while the container is processed. DO NOT pass image descriptions or text - only actual URLs are accepted. At least one of: image\_url, image\_file, video\_url, video\_file, or children must be provided. \|
\| \`user\_tags\` \| array \| No \| Array of user tag objects for tagging public Instagram accounts. For images: x and y coordinates (0.0-1.0, from top-left) are REQUIRED. For Reels: only username is allowed; x/y coordinates CANNOT be used. \|
\| \`video\_url\` \| string \| No \| MUST be a valid HTTP/HTTPS URL pointing to a video or Reel MP4 file that Meta can fetch. Must start with 'http://' or 'https://' (e.g., 'https://example.com/video.mp4'). Query parameters, including signed CDN or object-storage URLs, are supported as long as the complete URL remains accessible to Meta while the container is processed. DO NOT pass video descriptions or text - only actual URLs are accepted. At least one of: image\_url, image\_file, video\_url, video\_file, or children must be provided. When using video\_url alone, media\_type will be automatically set to 'REELS' if not specified. \|
\| \`audio\_name\` \| string \| No \| For Reels - custom name for the audio track (default: 'Original Audio'). \|
\| \`ig\_user\_id\` \| string \| Yes \| The unique identifier of the Instagram Business account (IG User ID) to create media for. This must be an Instagram Business account. \|
\| \`image\_file\` \| object \| No \| Image file to upload. The file will be uploaded to a temporary public URL for Instagram to fetch. At least one of: image\_url, image\_file, video\_url, video\_file, or children must be provided. \|
\| \`media\_type\` \| string ("REELS" \| "CAROUSEL" \| "STORIES") \| No \| Media type for the container. Valid values: 'REELS' (for video content), 'CAROUSEL' (for carousel posts with children), 'STORIES' (for story posts). When posting video content with video\_url alone (no image\_url), this will automatically default to 'REELS' if not specified. Note: 'VIDEO' is deprecated and no longer supported - use 'REELS' for all video content. \|
\| \`video\_file\` \| object \| No \| Video file to upload. The file will be uploaded to a temporary public URL for Instagram to fetch. At least one of: image\_url, image\_file, video\_url, video\_file, or children must be provided. \|
\| \`location\_id\` \| string \| No \| Facebook Page ID of a location to tag. The Page must have latitude/longitude data. \|
\| \`thumb\_offset\` \| integer \| No \| For videos/Reels - millisecond offset for thumbnail frame (default: 0). \|
\| \`share\_to\_feed\` \| boolean \| No \| For Reels - whether to share to both Feed and Reels tabs. Only applicable when media\_type is REELS. \|
\| \`is\_carousel\_item\` \| boolean \| No \| Indicates this container is part of a carousel. For carousels: create 2-10 individual containers, then create a parent carousel container with their IDs. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use. Defaults to v21.0. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Publish IG User Media

\*\*Slug:\*\* \`INSTAGRAM\_POST\_IG\_USER\_MEDIA\_PUBLISH\`

Tool to publish a media container to an Instagram Business account. This action automatically waits for the container to finish processing before publishing. Instagram enforces an account-specific content-publishing rate limit over a 24-hour moving window; the exact cap varies by account and should be read live via INSTAGRAM\_GET\_IG\_USER\_CONTENT\_PUBLISHING\_LIMIT before bulk publishing. The publishing process: 1. First, create a media container using INSTAGRAM\_CREATE\_MEDIA\_CONTAINER 2. Call this action with the creation\_id - it will automatically poll for FINISHED status 3. Once ready, the media is published and the published media ID is returned For videos/reels, processing may take 30-120 seconds. Images are typically instant.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ig\_user\_id\` \| string \| Yes \| Instagram Business Account ID (numeric string) or 'me' for the authenticated user. This ID is returned by INSTAGRAM\_GET\_USER\_INFO or similar actions. Do NOT pass bank account numbers, connection IDs, or other non-Instagram identifiers. \|
\| \`creation\_id\` \| string \| Yes \| Container ID returned by INSTAGRAM\_CREATE\_MEDIA\_CONTAINER (numeric string). This is NOT the same as ig\_user\_id. Do NOT pass bank account numbers or other non-Instagram identifiers. \|
\| \`max\_wait\_seconds\` \| integer \| No \| Maximum time in seconds to wait for the container to reach FINISHED status before publishing. Images are typically ready instantly, but videos/reels commonly take 30-120 seconds to process. WARNING: Setting this to 0 skips all status checks and attempts immediate publish, which will fail with error 9007 if the container is still processing (common for videos). Only use 0 if you are certain the container is already in FINISHED status (rare - typically only after manually checking via INSTAGRAM\_GET\_POST\_STATUS). For videos/reels, use at least 60 seconds (default) or higher (up to 300). \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use. Defaults to v21.0. \|
\| \`poll\_interval\_seconds\` \| number \| No \| Interval in seconds between status checks while waiting for the container to be ready. Default is 3 seconds. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Reply to IG User Mentions

\*\*Slug:\*\* \`INSTAGRAM\_POST\_IG\_USER\_MENTIONS\`

Tool to reply to a mention of your Instagram Business or Creator account. Use when you need to respond to comments or media captions where your account has been @mentioned by another Instagram user. This creates a comment on the media or comment containing the mention.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`message\` \| string \| Yes \| The text content of your reply to the mention. This creates a comment on the media or comment where you were mentioned. \|
\| \`media\_id\` \| string \| Yes \| The ID of the Instagram media object (post, photo, video, or carousel) where your account was mentioned. This is the media containing the original mention. \|
\| \`comment\_id\` \| string \| No \| Optional ID of a specific comment where you were mentioned. If provided, your reply will be directed to that comment. If not provided, the reply will be posted on the media itself. \|
\| \`ig\_user\_id\` \| string \| Yes \| The unique identifier of the Instagram Business or Creator account that was mentioned. This is the ID of your Instagram account that received the mention. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use. Defaults to v21.0. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Reply To Comment (Deprecated)

\*\*Slug:\*\* \`INSTAGRAM\_REPLY\_TO\_COMMENT\`

DEPRECATED: Use INSTAGRAM\_POST\_IG\_COMMENT\_REPLIES instead. Reply to a comment on Instagram media. Only usable on comments belonging to media owned by the authenticated account. Creates a public, irreversible reply; invoke only with explicit user confirmation, not for bulk or speculative use.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`message\` \| string \| Yes \| Reply message text Must comply with Instagram content policies; overly long or policy-violating text may be rejected. \|
\| \`ig\_comment\_id\` \| string \| Yes \| Instagram Comment ID to reply to Must belong to media owned by the authenticated Instagram account; replies to other accounts' media are not permitted. \|
\| \`graph\_api\_version\` \| string \| No \| The Facebook Graph API version to use for the request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Send Image

\*\*Slug:\*\* \`INSTAGRAM\_SEND\_IMAGE\`

Send an image via Instagram DM to a specific user. Each send modifies inbox state; avoid bulk or automated sends without explicit user approval.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`image\_url\` \| string \| Yes \| Publicly accessible URL of the image to send. Must be a direct link to an image file (JPEG, PNG, or GIF) that is reachable over HTTPS. The URL must not require authentication to access. \|
\| \`ig\_user\_id\` \| string \| No \| Instagram Business Account ID. Must be a numeric ID string (e.g., '17841400123456789'), not a username. Optional when using /me/messages endpoint. \|
\| \`recipient\_id\` \| string \| Yes \| Recipient's IGSID (Instagram Scoped User ID). Must be a numeric ID string (e.g., '17841479358498320'), NOT a username. IGSIDs are obtained from conversations or webhook events when users message your business first. You can only send messages to users who have initiated a conversation with your business within the past 24 hours (or 7 days with HUMAN\_AGENT tag). \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use (e.g., 'v21.0'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Send Text Message

\*\*Slug:\*\* \`INSTAGRAM\_SEND\_TEXT\_MESSAGE\`

Send a text message to an Instagram user via DM in an existing conversation. Cannot initiate new DM threads — a prior conversation must exist. Requires an Instagram Business or Creator account with messaging permissions. Fails with error\_subcode 2534022 if outside the messaging window; do not retry these failures.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`text\` \| string \| Yes \| Message text to send \|
\| \`ig\_user\_id\` \| string \| No \| Instagram Business Account ID (optional when using /me/messages) \|
\| \`recipient\_id\` \| string \| Yes \| Recipient PSID (Instagram-scoped ID) Must be a real PSID obtained from INSTAGRAM\_LIST\_ALL\_CONVERSATIONS or INSTAGRAM\_LIST\_ALL\_MESSAGES — usernames or fabricated IDs cause HTTP 400 (code 100). \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version \|
\| \`reply\_to\_message\_id\` \| string \| No \| Message ID (mid) to reply to. This creates a visual reply link to the original message in the conversation. The mid can be obtained from webhook events or previous API responses. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Messenger Profile

\*\*Slug:\*\* \`INSTAGRAM\_UPDATE\_MESSENGER\_PROFILE\`

Tool to update the messenger profile settings for an Instagram account. Use when you need to configure ice breakers and messaging options. Ice breakers are suggested questions that help users start conversations with your Instagram Business account.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ig\_user\_id\` \| string \| Yes \| Instagram Business Account ID whose messenger profile will be updated. \|
\| \`ice\_breakers\` \| array \| Yes \| Array of ice breaker objects to configure for the messenger profile. Ice breakers provide suggested questions to help users start conversations. Maximum 4 ice breakers allowed. \|
\| \`graph\_api\_version\` \| string \| No \| Instagram Graph API version to use. Defaults to v21.0. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|
