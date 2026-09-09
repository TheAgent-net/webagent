---
url: https://docs.composio.dev/toolkits/linkedin.md
title: https://docs.composio.dev/toolkits/linkedin.md
description: 
status: 200
---

\# LinkedIn

LinkedIn is a professional networking platform enabling job seekers, companies, and thought leaders to connect, share content, and discover business opportunities

\- \*\*Category:\*\* social media accounts
\- \*\*Auth:\*\* OAUTH2
\- \*\*Composio-managed OAuth available?\*\* Yes
\- \*\*Tools:\*\* 24
\- \*\*Triggers:\*\* 0
\- \*\*Slug:\*\* \`LINKEDIN\`
\- \*\*Version:\*\* 20260826\_00

\## Frequently Asked Questions

\### How do I set up custom OAuth credentials for LinkedIn?

For a step-by-step guide on creating and configuring your own LinkedIn OAuth credentials with Composio, see \[How to create OAuth credentials for LinkedIn\](https://composio.dev/auth/linkedin).

\### Why am I getting 429 rate limit errors on LinkedIn?

The default OAuth app is shared across users and has strict rate limits. Use your own OAuth app for production to avoid shared quotas.

\### Why can't I use certain LinkedIn scope combinations?

LinkedIn restricts certain scope combinations. For example, \`w\_member\_social\` and \`r\_organization\_admin\` cannot be used together. If you need conflicting scopes, create your own OAuth app with the required permissions.

\## Tools

\### Create article or URL share

\*\*Slug:\*\* \`LINKEDIN\_CREATE\_ARTICLE\_OR\_URL\_SHARE\`

Tool to create an article or URL share on LinkedIn using the UGC Posts API. Use when you need to share a link with optional commentary on LinkedIn. Supports sharing URLs as articles with customizable visibility settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`author\` \| string \| Yes \| URN of the author (person or organization). For a person: 'urn:li:person:{id}'. For an organization: 'urn:li:organization:{id}'. Use GET\_MY\_INFO action to get your person ID. \|
\| \`visibility\` \| object \| Yes \| Visibility settings for the post. Controls who can see the shared content. \|
\| \`lifecycleState\` \| string ("PUBLISHED" \| "DRAFT") \| No \| State of the post. Use 'PUBLISHED' to post immediately or 'DRAFT' to save as draft. \|
\| \`specificContent\` \| object \| Yes \| Container for the share content including URL, commentary, and media category. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create comment on LinkedIn post

\*\*Slug:\*\* \`LINKEDIN\_CREATE\_COMMENT\_ON\_POST\`

Tool to create a first-level or nested comment on a LinkedIn share, UGC post, or parent comment via the Social Actions Comments API. Use when you need to engage with posts by adding comments or replying to existing comments. Supports text comments with optional @-mentions and image attachments.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`actor\` \| string \| Yes \| Entity which authored the comment. For personal comments: 'urn:li:person:{id}'. For organization comments: 'urn:li:organization:{id}'. Use the GET\_USER\_INFO action to retrieve the 'id' field. \|
\| \`object\` \| string \| Yes \| The URN of the share or ugcPost that contains the comment. Typically the same as target\_urn for first-level comments, or the root post URN for nested comments. Must be 'urn:li:share:{id}' or 'urn:li:ugcPost:{id}'. Activity URNs ('urn:li:activity:{id}') are NOT supported. \|
\| \`content\` \| array \| No \| Array of content entities such as images to include in the comment. Each entity should contain an image URN or other content type. \|
\| \`message\` \| object \| Yes \| The comment message content including text and optional @-mentions. \|
\| \`target\_urn\` \| string \| Yes \| The URN of the share, UGC post, or parent comment where the comment will be created. Must be 'urn:li:share:{id}', 'urn:li:ugcPost:{id}', or 'urn:li:comment:({parentUrn},{commentId})'. Activity URNs ('urn:li:activity:{id}') are NOT supported. \|
\| \`parent\_comment\` \| string \| No \| For nested comments (replies), the URN of the parent comment being replied to. Format: 'urn:li:comment:({parentUrn},{commentId})'. Leave empty for first-level comments on the post. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create a LinkedIn post

\*\*Slug:\*\* \`LINKEDIN\_CREATE\_LINKED\_IN\_POST\`

Creates a new post on LinkedIn for the authenticated user or an organization they manage. Requires w\_member\_social scope for posting as a person, and w\_organization\_social scope for posting as an organization (with ADMINISTRATOR, DIRECT\_SPONSORED\_CONTENT\_POSTER, or CONTENT\_ADMIN role).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`author\` \| string \| Yes \| The URN of the LinkedIn member or organization creating the post. IMPORTANT: Replace placeholder text with actual ID values. For a person: use 'urn:li:person:' (e.g., 'urn:li:person:F6kGF1Uduq' or 'urn:li:person:123456789'). Requires w\_member\_social scope. For an organization: use 'urn:li:organization:' (e.g., 'urn:li:organization:987654321'). Requires w\_organization\_social scope and you must have ADMINISTRATOR, DIRECT\_SPONSORED\_CONTENT\_POSTER, or CONTENT\_ADMIN role for the organization. Get your person ID using the GET\_MY\_INFO action, or get organization IDs from GET\_COMPANY\_INFO. Do NOT pass literal placeholder text like '{id}' or '{organization\_id}'. \|
\| \`images\` \| array \| No \| Array of images to upload and attach to the post. Each element is a Supports 1-20 images. For a single image, use a list with one element. LinkedIn will automatically use the appropriate content type (media for single image, multiImage for 2+ images). \|
\| \`container\` \| string \| No \| Container entity URN for posting within a specific container (e.g., 'urn:li:group:123456' for group posts). Use this field when posting to a group or other container entity. \|
\| \`commentary\` \| string \| Yes \| The main text content of the post. This field supports plain text and @-mentions (e.g., @\[LinkedIn Member\](urn:li:person:xxxx)). Maximum length: 3000 characters. \|
\| \`visibility\` \| string ("PUBLIC" \| "CONNECTIONS" \| "LOGGED\_IN" \| "CONTAINER") \| No \| Controls who can see the post. 'PUBLIC' makes it visible to everyone, 'CONNECTIONS' to connections only, 'LOGGED\_IN' to signed-in LinkedIn members, and 'CONTAINER' for specific group/event posts. \|
\| \`distribution\` \| object \| No \| Specifies distribution rules for the post, including feed distribution and targeting. \|
\| \`lifecycleState\` \| string \| No \| The state of the post. Use 'PUBLISHED' to post directly, 'DRAFT' to save as a draft, or 'PUBLISH\_REQUESTED' if the post requires review before publishing. \|
\| \`reshareContext\` \| object \| No \| Context for resharing another post. \|
\| \`contentLandingPage\` \| string \| No \| URL of the landing page that opens when the call-to-action button is clicked. Optional even when contentCallToActionLabel is set. \|
\| \`contentCallToActionLabel\` \| string ("APPLY" \| "DOWNLOAD" \| "VIEW\_QUOTE" \| "LEARN\_MORE" \| "SIGN\_UP" \| "SUBSCRIBE" \| "REGISTER" \| "JOIN" \| "ATTEND" \| "REQUEST\_DEMO" \| "SEE\_MORE" \| "BUY\_NOW" \| "SHOP\_NOW") \| No \| Call-to-action button labels for posts. \|
\| \`isReshareDisabledByAuthor\` \| boolean \| No \| Set to true to prevent others from resharing this post. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create video post

\*\*Slug:\*\* \`LINKEDIN\_CREATE\_VIDEO\_POST\`

Publish an available member-owned LinkedIn video as a personal native video post.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| No \| Optional title displayed with the video. \|
\| \`video\_urn\` \| string \| Yes \| URN of an uploaded LinkedIn video that is ready to publish. \|
\| \`commentary\` \| string \| Yes \| Text to publish with the video. LinkedIn mentions and hashtags may use Little Text Format. \|
\| \`visibility\` \| string ("PUBLIC" \| "CONNECTIONS" \| "LOGGED\_IN") \| No \| Who can see the personal video post: everyone, the member's connections, or signed-in LinkedIn members. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete LinkedIn Post

\*\*Slug:\*\* \`LINKEDIN\_DELETE\_LINKED\_IN\_POST\`

Deletes a specific LinkedIn post (share) by its unique \`share\_id\`, which must correspond to an existing share.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`share\_id\` \| string \| Yes \| Unique identifier of the LinkedIn share (post) to be deleted. Accepts either numeric ID (e.g., '7245341016004718592') or URN format (e.g., 'urn:li:share:7245341016004718592'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Post

\*\*Slug:\*\* \`LINKEDIN\_DELETE\_POST\`

Delete a LinkedIn post using the Posts API REST endpoint. Supports both ugcPost and share URN formats. This action is idempotent - deleting an already-deleted post returns success. Note: LinkedIn's own live /rest/posts DELETE endpoint does NOT actually honor this on its own (a repeat delete 404s rather than returning 204 as LinkedIn's docs claim); this action compensates by treating a 404 as a successful deletion.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`post\_urn\` \| string \| Yes \| The URN of the post to delete. Accepts either ugcPost or share URN formats (e.g., 'urn:li:ugcPost:7890123456' or 'urn:li:share:7245341016004718592'). The URN will be URL-encoded automatically. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete UGC Post (Legacy)

\*\*Slug:\*\* \`LINKEDIN\_DELETE\_UGC\_POST\`

Delete a UGC post using the legacy UGC Post API endpoint. Use when you need to delete a post using the v2/ugcPosts endpoint. Deletion is idempotent - previously deleted posts also return success.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ugc\_post\_urn\` \| string \| Yes \| The URN of the UGC post or share to delete. Format: 'urn:li:ugcPost:{id}' or 'urn:li:share:{id}'. Will be URL-encoded automatically by the action. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get ad targeting facets

\*\*Slug:\*\* \`LINKEDIN\_GET\_AD\_TARGETING\_FACETS\`

Tool to retrieve available ad targeting facets from LinkedIn Marketing API. Use when you need to discover what targeting options are available for ad campaigns (e.g., locations, industries, job functions).

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get audience counts

\*\*Slug:\*\* \`LINKEDIN\_GET\_AUDIENCE\_COUNTS\`

Retrieves audience size counts for specified targeting criteria. Use when estimating reach for LinkedIn ad campaigns or targeted content.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`q\` \| string ("targetingCriteriaV2") \| No \| Query type parameter. Must be 'targetingCriteriaV2' for targeting criteria queries. \|
\| \`targetingCriteria\` \| string \| Yes \| Targeting criteria with URL-encoded URNs. Format: (include:(and:List((or:(urn%3Ali%3AadTargetingFacet%3AFACET:List(urn%3Ali%3ATYPE%3AID)))))). IMPORTANT: Only the URN colons should be encoded as %3A, keep the structure syntax (parentheses, colons in 'and:' and 'or:') unencoded. Example for locations: (include:(and:List((or:(urn%3Ali%3AadTargetingFacet%3Alocations:List(urn%3Ali%3Ageo%3A102221843)))))) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get company info

\*\*Slug:\*\* \`LINKEDIN\_GET\_COMPANY\_INFO\`

Retrieves organizations where the authenticated user has specific roles (ACLs), to determine their management or content posting capabilities for LinkedIn company pages.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`role\` \| string ("ADMINISTRATOR" \| "DIRECT\_SPONSORED\_CONTENT\_POSTER") \| No \| The specific role to filter organization ACLs by. \|
\| \`count\` \| integer \| No \| The number of organization ACLs to return per page. \|
\| \`start\` \| integer \| No \| The starting index for pagination, representing the number of initial ACLs to skip. \|
\| \`state\` \| string ("APPROVED" \| "REQUESTED") \| No \| The approval state of the role to filter by. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get image details

\*\*Slug:\*\* \`LINKEDIN\_GET\_IMAGE\`

Tool to retrieve details of a LinkedIn image using its URN. Use when you need to check image status, get download URLs, or access image metadata for a single image.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`image\_urn\` \| string \| Yes \| The image URN identifier. Can be provided as 'urn:li:image:XXX' or just the ID 'XXX'. The URN will be URL-encoded automatically when making the API request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get images

\*\*Slug:\*\* \`LINKEDIN\_GET\_IMAGES\`

Tool to retrieve image metadata including download URLs, status, and dimensions from LinkedIn's Images API. Use when you need to access image details for posts, profiles, or media library assets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| array \| Yes \| List of image URNs to retrieve. Each URN should be in the format 'urn:li:image:{ID}' (e.g., 'urn:li:image:C4E10AQFn10iWtKexVA'). Maximum recommended batch size depends on LinkedIn's API limits. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get my info

\*\*Slug:\*\* \`LINKEDIN\_GET\_MY\_INFO\`

Fetches the authenticated LinkedIn user's profile information including name, headline, profile picture, and other profile details.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get network size

\*\*Slug:\*\* \`LINKEDIN\_GET\_NETWORK\_SIZE\`

Tool to retrieve the follower count for a LinkedIn organization. Use when you need to get the number of members following a specific company or organization on LinkedIn.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`edgeType\` \| string ("COMPANY\_FOLLOWED\_BY\_MEMBER") \| No \| The type of network relationship to count. Use COMPANY\_FOLLOWED\_BY\_MEMBER to get follower count. \|
\| \`organization\_id\` \| string \| Yes \| The unique identifier for the LinkedIn organization. This is the numeric ID from the organization URN (e.g., for 'urn:li:organization:3803', use '3803'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get organization page statistics

\*\*Slug:\*\* \`LINKEDIN\_GET\_ORG\_PAGE\_STATS\`

Tool to retrieve page statistics for a LinkedIn organization page. Use when you need engagement metrics like page views and custom button clicks. Supports both lifetime statistics (all-time data segmented by demographics) and time-bound statistics (aggregate data for specific time ranges). Requires rw\_organization\_admin permission with ADMINISTRATOR role for the organization.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`organization\` \| string \| Yes \| Organization URN in format urn:li:organization:{id}. Example: urn:li:organization:2414183 \|
\| \`timeRangeEnd\` \| integer \| No \| Inclusive ending timestamp in milliseconds since epoch. Only required for time-bound statistics. Omit for lifetime statistics. \|
\| \`timeRangeStart\` \| integer \| No \| Exclusive starting timestamp in milliseconds since epoch. Only required for time-bound statistics. Omit for lifetime statistics. \|
\| \`timeGranularityType\` \| string ("DAY" \| "MONTH") \| No \| Granularity of the statistics. Use DAY for daily statistics or MONTH for monthly statistics. Only required for time-bound statistics. Omit for lifetime statistics. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get person profile

\*\*Slug:\*\* \`LINKEDIN\_GET\_PERSON\`

Retrieves a LinkedIn member's profile information by their person ID. Returns lite profile fields (name, profile picture) by default, or basic profile fields (including headline and vanity name) with appropriate permissions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`person\_id\` \| string \| Yes \| The unique identifier of the LinkedIn member. Note: Each member id is unique to the context of your application only. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get post content

\*\*Slug:\*\* \`LINKEDIN\_GET\_POST\_CONTENT\`

Tool to retrieve detailed post content including text, images, videos, and metadata from LinkedIn by post URN. Use when you need to fetch the full content and details of a specific LinkedIn post.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`post\_id\` \| string \| Yes \| Post URN identifier in the format 'urn:li:ugcPost:{id}' or 'urn:li:share:{id}'. Can also be URL-encoded. Example: 'urn:li:ugcPost:7428263313739988992' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get share statistics

\*\*Slug:\*\* \`LINKEDIN\_GET\_SHARE\_STATS\`

Retrieves share statistics for a LinkedIn organization, including impressions, clicks, likes, comments, and shares. Use to analyze content performance for an organization page. Optionally filter by time intervals to get time-bound statistics.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`time\_intervals\` \| string \| No \| Time-bound statistics filter in RestLi 2.0 complex object format. Specify time range and granularity as: '(timeRange:(start:,end:),timeGranularityType:)' where timestamps are in milliseconds since epoch and GRANULARITY is one of: DAY, WEEK, MONTH. Example: '(timeRange:(start:1634018799000,end:1634623599000),timeGranularityType:DAY)'. If omitted, returns lifetime statistics. \|
\| \`organizational\_entity\` \| string \| Yes \| The URN of the organization to retrieve share statistics for. Must be in the format 'urn:li:organization:' where  is the organization ID (e.g., 'urn:li:organization:2414183'). Get organization IDs using the GET\_COMPANY\_INFO action. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get videos

\*\*Slug:\*\* \`LINKEDIN\_GET\_VIDEOS\`

Retrieves video metadata from LinkedIn for a video owned by a person or organization. Supports single video retrieval and batch retrieval (multiple videos). Use when you need to get video details including duration, dimensions, status, download URLs, and media library information. Note: this does not support finding videos by a LinkedIn Ads sponsored account - that's an ads/Campaign-Manager-specific capability outside this toolkit's organic-posting scope.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`video\_ids\` \| array \| No \| List of video URNs for batch retrieval (e.g., \['urn:li:video:C4D10AQE9WE5n4uJKUg', 'urn:li:video:C5F10AQElP1fVH1Ke6g'\]). Use this for batch retrieval. Mutually exclusive with 'video\_urn'. \|
\| \`video\_urn\` \| string \| No \| Single video URN to retrieve (e.g., 'urn:li:video:C4E10AQGUkQY7trgh-Q'). Use this for single video retrieval. Mutually exclusive with 'video\_ids'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Initialize image upload

\*\*Slug:\*\* \`LINKEDIN\_INITIALIZE\_IMAGE\_UPLOAD\`

Tool to initialize an image upload to LinkedIn and return a presigned upload URL plus the resulting image URN. Use when you need to prepare an image upload for LinkedIn posts. After calling this tool, upload the image bytes to the returned upload\_url via PUT request, then use the image URN in CREATE\_LINKED\_IN\_POST action.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`owner\` \| string \| Yes \| Owner URN (person or organization) that will own the uploaded image. Must be in the format 'urn:li:person:{id}' for personal posts or 'urn:li:organization:{id}' for organization posts. Use the GET\_MY\_INFO action to retrieve the person ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List reactions on entity

\*\*Slug:\*\* \`LINKEDIN\_LIST\_REACTIONS\`

Retrieves reactions (likes, celebrations, etc.) on a LinkedIn entity such as a share, post, or comment. Use when you need to see who reacted to content and what type of reactions were used.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sort\` \| string ("CHRONOLOGICAL" \| "REVERSE\_CHRONOLOGICAL" \| "RELEVANCE") \| No \| Sort order for reactions. CHRONOLOGICAL sorts by created date ascending, REVERSE\_CHRONOLOGICAL sorts by created date descending (default), RELEVANCE sorts by relevance to the viewer. \|
\| \`count\` \| integer \| No \| Number of reactions to return per page. \|
\| \`start\` \| integer \| No \| Starting index for pagination (number of reactions to skip). \|
\| \`entity\` \| string \| Yes \| The URN of the entity (share, post, or comment) to get reactions for. Format: 'urn:li:share:{id}', 'urn:li:ugcPost:{id}', 'urn:li:activity:{id}', or 'urn:li:comment:(activity:{activityId},{commentId})'. Do not URL-encode this value. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Register image upload

\*\*Slug:\*\* \`LINKEDIN\_REGISTER\_IMAGE\_UPLOAD\`

Tool to initialize a native LinkedIn image upload for feed shares and return a presigned upload URL plus the resulting digital media asset URN. Use when you need to upload an image to attach to a LinkedIn post. After calling this tool, upload the image bytes to the returned upload\_url, then use the asset\_urn in LINKEDIN\_CREATE\_LINKED\_IN\_POST.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`recipe\` \| string \| No \| The digital media recipe URN specifying the processing recipe for the image. Default is 'urn:li:digitalmediaRecipe:feedshare-image' for feed share images (works with a person or organization owner). Other recipes like 'companyUpdate-article-image' are for ads/campaign content and require an Ad Account or Organization owner, not a person - using them with a person owner returns 403 Forbidden. \|
\| \`owner\_urn\` \| string \| Yes \| URN of the owner entity that will own the uploaded image. Must be in the format 'urn:li:person:{id}' for personal posts or 'urn:li:organization:{id}' for organization posts. Use the GET\_USER\_INFO action to retrieve the person ID. \|
\| \`supported\_upload\_mechanism\` \| array \| No \| Array of supported upload mechanisms. If not specified, LinkedIn will return the default mechanism (typically SYNCHRONOUS\_UPLOAD). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search ad targeting entities

\*\*Slug:\*\* \`LINKEDIN\_SEARCH\_AD\_TARGETING\_ENTITIES\`

Search for ad targeting entities using typeahead search. Use when you need to find targeting entities like geographic locations, job titles, industries, or other targeting criteria for LinkedIn ad campaigns.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`count\` \| integer \| No \| Maximum number of results to return per page. \|
\| \`facet\` \| string \| Yes \| Ad targeting facet URN to specify the entity type to search (e.g., 'urn:li:adTargetingFacet:locations' for geographic locations, 'urn:li:adTargetingFacet:titles' for job titles, 'urn:li:adTargetingFacet:industries' for industries). \|
\| \`query\` \| string \| Yes \| Search query string to find targeting entities (e.g., 'united states', 'software engineer', 'technology'). \|
\| \`start\` \| integer \| No \| Starting index for pagination, representing the number of initial results to skip. \|
\| \`queryVersion\` \| string ("QUERY\_USES\_URNS") \| No \| Query version for the search request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upload video

\*\*Slug:\*\* \`LINKEDIN\_UPLOAD\_VIDEO\`

Upload an MP4 video for a native post by the authenticated LinkedIn member and wait until it is ready.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\` \| object \| No \| A file the caller hands IN. \`\`s3key\`\` is an S3/R2 reference (production) or a base64 \`\`data:\`\` URL (self-hosted \`\`FILE\_BACKEND=base64\`\`) — the \`\`FileStore\`\` knows which. Mirrors \`\`mercury/tools/files.py\`\` field-for-field. \|
\| \`video\_url\` \| string \| No \| Public HTTP or HTTPS URL of an MP4 video. Provide this or file, but not both. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|
