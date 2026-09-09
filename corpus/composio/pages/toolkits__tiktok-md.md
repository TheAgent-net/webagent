---
url: https://docs.composio.dev/toolkits/tiktok.md
title: https://docs.composio.dev/toolkits/tiktok.md
description: 
status: 200
---

\# Tiktok

TikTok short-form video platform + creation tools + social sharing

\- \*\*Category:\*\* social media accounts
\- \*\*Auth:\*\* OAUTH2
\- \*\*Composio-managed OAuth available?\*\* No
\- \*\*Tools:\*\* 9
\- \*\*Triggers:\*\* 0
\- \*\*Slug:\*\* \`TIKTOK\`
\- \*\*Version:\*\* 20260817\_00

\## Tools

\### Fetch publish status

\*\*Slug:\*\* \`TIKTOK\_FETCH\_PUBLISH\_STATUS\`

Check the processing status of a TikTok video or photo post using its publish\_id. Use this action to poll the status of content after initiating an upload or post. The API returns detailed information about processing stages (upload, download, moderation) and any errors that occurred. Non-terminal statuses mean processing is still pending — never re-initiate TIKTOK\_PUBLISH\_VIDEO for the same publish\_id. Use exponential backoff when polling (e.g., 5s→10s→20s) to avoid the 30 requests/minute per access token rate limit.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`publish\_id\` \| string \| Yes \| The unique identifier (max 64 characters) returned from a video upload or photo post initialization. Used to track the posting action and check its processing status. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get user stats

\*\*Slug:\*\* \`TIKTOK\_GET\_USER\_STATS\`

Fetches TikTok user information and statistics for the authenticated user. Retrieves user stats (follower\_count, following\_count, likes\_count, video\_count) and can optionally fetch profile fields (display\_name, username, bio\_description, etc.) and basic info (open\_id, union\_id, avatar URLs). Returns only the fields requested in the fields parameter. Only works for the authenticated account; cannot fetch arbitrary public profiles. Stats may be delayed and not reflect the most recent activity.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| array \| No \| List of fields to retrieve. Available fields: Stats fields (user.info.stats scope): follower\_count, following\_count, likes\_count, video\_count. Profile fields (user.info.profile scope): username, bio\_description, profile\_deep\_link, is\_verified. Basic fields (user.info.basic scope): open\_id, union\_id, avatar\_url, avatar\_url\_100, avatar\_large\_url, display\_name. Defaults to the 4 statistics fields. Requesting fields without the corresponding OAuth scope returns missing or incomplete data for those fields. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List videos

\*\*Slug:\*\* \`TIKTOK\_LIST\_VIDEOS\`

Lists the authenticated user's own \*\*public\*\* TikTok videos, newest first. Only public posts are returned — private/\`SELF\_ONLY\`, friends-only, and draft videos never appear (this is a property of the underlying \`video.list\` scope, not a bug), so on an account with no public posts the list is empty. Cannot list an arbitrary creator's videos, and does not provide a global TikTok-wide feed. Returns a single page (up to \`max\_count\`, capped at 20). It does NOT auto-loop: when \`has\_more\` is true, call again passing the returned \`cursor\` to fetch the next page. Accounts with more than \`max\_count\` public videos are otherwise silently truncated.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| integer \| No \| Pagination cursor (UTC Unix timestamp in milliseconds) returned from previous call's response. Stop pagination when no next cursor is returned. \|
\| \`max\_count\` \| integer \| No \| Maximum number of videos to retrieve per page. Default is 10, maximum is 20. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Post photo

\*\*Slug:\*\* \`TIKTOK\_POST\_PHOTO\`

Create a photo post (1-35 images) on TikTok via Content Posting API. Supports two modes: - MEDIA\_UPLOAD: Uploads photos to user's inbox for review/editing before posting - DIRECT\_POST: Immediately posts photos to user's TikTok account IMPORTANT: Photo URLs must be from your TikTok-verified domain. Unverified domains will return 403 Forbidden. Unaudited apps can only post with privacy='SELF\_ONLY'. Rate limit: 6 requests per minute per user access token. Reference: https://developers.tiktok.com/doc/content-posting-api-reference-photo-post

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| No \| Post title (<= 90 UTF-16 runes) \|
\| \`post\_mode\` \| string ("DIRECT\_POST" \| "MEDIA\_UPLOAD") \| No \| Use DIRECT\_POST to publish immediately (requires video.publish), or MEDIA\_UPLOAD to send to inbox for editing (requires video.upload) \|
\| \`description\` \| string \| No \| Post description (<= 4000 UTF-16 runes) \|
\| \`photo\_images\` \| array \| Yes \| List of 1-35 publicly accessible HTTPS image URLs (JPG, JPEG, or WEBP format). IMPORTANT: URLs must be from your TikTok-verified domain or URL prefix. Random/third-party URLs will be rejected with 403 error. \|
\| \`privacy\_level\` \| string ("PUBLIC\_TO\_EVERYONE" \| "MUTUAL\_FOLLOW\_FRIENDS" \| "FOLLOWER\_OF\_CREATOR" \| "SELF\_ONLY") \| No \| Privacy levels accepted by TikTok's Content Posting API. The valid set for a given account is only discoverable via \`\`/v2/post/publish/creator\_info/query/\`\`. For unaudited apps only \`\`SELF\_ONLY\`\` is permitted. https://developers.tiktok.com/doc/content-posting-api-reference-direct-post \|
\| \`auto\_add\_music\` \| boolean \| No \| DIRECT\_POST only. Auto add recommended music. \|
\| \`disable\_comment\` \| boolean \| No \| DIRECT\_POST only. Disallow comments if true. \|
\| \`photo\_cover\_index\` \| integer \| Yes \| Zero-based index (0 to len(photo\_images)-1) indicating which image to use as the cover/thumbnail \|
\| \`brand\_content\_toggle\` \| boolean \| No \| DIRECT\_POST only. Set true if content is a paid partnership to promote a third-party business. \|
\| \`brand\_organic\_toggle\` \| boolean \| No \| DIRECT\_POST only. Set true if content promotes the creator's own business. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Publish video

\*\*Slug:\*\* \`TIKTOK\_PUBLISH\_VIDEO\`

Publishes a video to TikTok by pulling it from a public URL. TikTok downloads the video from the provided URL and publishes it directly to the creator's profile. Publishing is asynchronous — after calling this action, poll TIKTOK\_FETCH\_PUBLISH\_STATUS with the returned publish\_id to check completion. For uploading video files instead of URLs, use TIKTOK\_UPLOAD\_VIDEO.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`caption\` \| string \| No \| Optional caption/title text for the video post. Maximum length: 2200 UTF-16 characters. \|
\| \`is\_aigc\` \| boolean \| No \| Set true to label the video as AI-generated content. \|
\| \`video\_url\` \| string \| Yes \| A publicly accessible URL of the video to publish. TikTok will pull the video from this URL. Must be HTTP/HTTPS. The video will be downloaded by TikTok's servers, so ensure the URL is accessible and not behind authentication. \|
\| \`disable\_duet\` \| boolean \| No \| Whether to disable duets on the video. \|
\| \`privacy\_level\` \| string ("PUBLIC\_TO\_EVERYONE" \| "MUTUAL\_FOLLOW\_FRIENDS" \| "FOLLOWER\_OF\_CREATOR" \| "SELF\_ONLY") \| Yes \| Privacy level selected by the user for the published video. Must be one drawn from the account's creator\_info/query options. For unaudited apps only SELF\_ONLY is permitted. \|
\| \`disable\_stitch\` \| boolean \| No \| Whether to disable stitches on the video. \|
\| \`disable\_comment\` \| boolean \| No \| Whether to disable comments on the video. \|
\| \`brand\_content\_toggle\` \| boolean \| No \| Set true if the content is a paid partnership promoting a third-party business. \|
\| \`brand\_organic\_toggle\` \| boolean \| No \| Set true if the content promotes the creator's own business. \|
\| \`video\_cover\_timestamp\_ms\` \| integer \| No \| Timestamp in milliseconds to use as video cover/thumbnail. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Query creator info

\*\*Slug:\*\* \`TIKTOK\_QUERY\_CREATOR\_INFO\`

Queries the authenticated creator's info and current posting options. Returns the account's available \`privacy\_level\_options\` and interaction settings (comment/duet/stitch), which the Content Posting API requires you to read before a direct post — the valid \`privacy\_level\` values for an account are only discoverable here. Call this to pick a real privacy level instead of guessing (unaudited apps only ever get SELF\_ONLY).

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Query videos

\*\*Slug:\*\* \`TIKTOK\_QUERY\_VIDEOS\`

Fetches metadata for specific TikTok videos by ID (1-20 per request). Verifies the videos belong to the authenticated user and returns their details, refreshing the cover-image URL's expiration. Unlike List videos, this looks up known video IDs rather than walking recent uploads.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`video\_ids\` \| array \| Yes \| List of TikTok video IDs to fetch metadata for (1-20 per request). Only videos that belong to the authenticated user are returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upload video

\*\*Slug:\*\* \`TIKTOK\_UPLOAD\_VIDEO\`

Uploads a video to TikTok via the Content Posting API. This action initializes an upload session to obtain a presigned upload URL, then uploads the file in one or more sequential PUT requests with TikTok-compatible ranges. Use a subsequent action to publish the post. Ensure the video file is fully generated and available before calling this action.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`caption\` \| string \| No \| Optional caption/title used when publish=true. Max 2200 UTF-16 runes. \|
\| \`is\_aigc\` \| boolean \| No \| Set true to label the video as AI-generated content. \|
\| \`publish\` \| boolean \| No \| If true, attempts to publish after upload using the returned publish\_id. \|
\| \`disable\_duet\` \| boolean \| No \| Whether to disable duets on the video. \|
\| \`privacy\_level\` \| string ("PUBLIC\_TO\_EVERYONE" \| "MUTUAL\_FOLLOW\_FRIENDS" \| "FOLLOWER\_OF\_CREATOR" \| "SELF\_ONLY") \| No \| Privacy levels accepted by TikTok's Content Posting API. The valid set for a given account is only discoverable via \`\`/v2/post/publish/creator\_info/query/\`\`. For unaudited apps only \`\`SELF\_ONLY\`\` is permitted. https://developers.tiktok.com/doc/content-posting-api-reference-direct-post \|
\| \`disable\_stitch\` \| boolean \| No \| Whether to disable stitches on the video. \|
\| \`file\_to\_upload\` \| object \| Yes \| Video file to upload to TikTok. Files are uploaded whole when possible and split into sequential TikTok-compatible chunks for larger videos. Supported formats include MP4, MOV, WEBM. Recommended aspect ratio 9:16. \|
\| \`disable\_comment\` \| boolean \| No \| Whether to disable comments on the video. \|
\| \`chunk\_size\_bytes\` \| integer \| No \| Optional chunk size for multipart uploads. Must be between 5,000,000 and 64,000,000 bytes and must produce a valid TikTok upload plan. Omit this to choose a safe chunk size automatically. \|
\| \`brand\_content\_toggle\` \| boolean \| No \| Set true if the content is a paid partnership promoting a third-party business. \|
\| \`brand\_organic\_toggle\` \| boolean \| No \| Set true if the content promotes the creator's own business. \|
\| \`video\_cover\_timestamp\_ms\` \| integer \| No \| Timestamp in milliseconds to use as video cover/thumbnail (e.g., 1000 for 1 second into video). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upload videos (batch)

\*\*Slug:\*\* \`TIKTOK\_UPLOAD\_VIDEOS\`

Uploads multiple videos to TikTok concurrently.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`caption\` \| string \| No \| Optional caption/title used when publish=true. Max 2200 UTF-16 runes. \|
\| \`is\_aigc\` \| boolean \| No \| Set true to label the videos as AI-generated content. \|
\| \`publish\` \| boolean \| No \| If true, attempts to publish after each upload using direct publish flow. \|
\| \`max\_workers\` \| integer \| No \| Maximum number of parallel uploads \|
\| \`disable\_duet\` \| boolean \| No \| Whether to disable duets on the videos. \|
\| \`privacy\_level\` \| string ("PUBLIC\_TO\_EVERYONE" \| "MUTUAL\_FOLLOW\_FRIENDS" \| "FOLLOWER\_OF\_CREATOR" \| "SELF\_ONLY") \| No \| Privacy levels accepted by TikTok's Content Posting API. The valid set for a given account is only discoverable via \`\`/v2/post/publish/creator\_info/query/\`\`. For unaudited apps only \`\`SELF\_ONLY\`\` is permitted. https://developers.tiktok.com/doc/content-posting-api-reference-direct-post \|
\| \`disable\_stitch\` \| boolean \| No \| Whether to disable stitches on the videos. \|
\| \`disable\_comment\` \| boolean \| No \| Whether to disable comments on the videos. \|
\| \`files\_to\_upload\` \| array \| Yes \| List of video files to upload to TikTok in parallel (at least one). Files are uploaded whole when possible and split into sequential TikTok-compatible chunks for larger videos. Supports common video formats like MP4, MOV, WebM. Too-long or unsupported-codec files are rejected. Caption (via \`caption\`) must also be within TikTok's length limit. \|
\| \`chunk\_size\_bytes\` \| integer \| No \| Optional chunk size for multipart uploads. Must be between 5,000,000 and 64,000,000 bytes and must produce a valid TikTok upload plan for every file. Omit this to choose a safe chunk size automatically. \|
\| \`brand\_content\_toggle\` \| boolean \| No \| Set true if the content is a paid partnership promoting a third-party business. \|
\| \`brand\_organic\_toggle\` \| boolean \| No \| Set true if the content promotes the creator's own business. \|
\| \`video\_cover\_timestamp\_ms\` \| integer \| No \| Timestamp in milliseconds to use as video cover/thumbnail. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|
