---
url: https://docs.composio.dev/toolkits/canva.md
title: https://docs.composio.dev/toolkits/canva.md
description: 
status: 200
---

\# Canva

Canva offers a drag-and-drop design suite for creating social media graphics, presentations, and marketing materials with prebuilt templates and a vast element library

\- \*\*Category:\*\* images & design
\- \*\*Auth:\*\* OAUTH2
\- \*\*Composio-managed OAuth available?\*\* Yes
\- \*\*Tools:\*\* 48
\- \*\*Triggers:\*\* 0
\- \*\*Slug:\*\* \`CANVA\`
\- \*\*Version:\*\* 20260826\_00

\## Frequently Asked Questions

\### How do I set up custom OAuth credentials for Canva?

For a step-by-step guide on creating and configuring your own Canva OAuth credentials with Composio, see \[How to create OAuth credentials for Canva\](https://composio.dev/auth/canva).

\## Tools

\### Access user specific brand templates list

\*\*Slug:\*\* \`CANVA\_ACCESS\_USER\_SPECIFIC\_BRAND\_TEMPLATES\_LIST\`

Lists brand templates available to users on plans with brand-template access, such as Canva Pro, Canva Teams, or Canva Enterprise. Returns one page of template metadata, including IDs and titles. Follow the response's continuation token to retrieve additional pages. Dataset definitions are available from CANVA\_RETRIEVE\_BRAND\_TEMPLATE\_DATASET\_DEFINITION.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The number of brand templates to return (1-100, default 25). \|
\| \`query\` \| string \| No \| Lets you search the brand templates available to the user using a search term or terms. \|
\| \`dataset\` \| string ("any" \| "non\_empty") \| No \| Filter the list of brand templates based on the brand templates' dataset definitions. Brand templates with dataset definitions are mainly used with the Autofill APIs. This can be one of the following: - \`any\`: (Default) Brand templates with and without dataset definitions. - \`non\_empty\`: Brand templates with one or more data fields defined. \|
\| \`sort\_by\` \| string ("relevance" \| "modified\_descending" \| "modified\_ascending" \| "title\_descending" \| "title\_ascending") \| No \| Sort the list of brand templates. This can be one of the following: - \`relevance\`: (Default) Sort results using a relevance algorithm. - \`modified\_descending\`: Sort results by the date last modified in descending order. - \`modified\_ascending\`: Sort results by the date last modified in ascending order. - \`title\_descending\`: Sort results by title in descending order. - \`title\_ascending\`: Sort results by title in ascending order. \|
\| \`ownership\` \| string ("any" \| "owned" \| "shared") \| No \| Filter the list of brand templates based on the user"s ownership of the brand templates. This can be one of the following: - \`any\`: (Default) Brand templates owned by and shared with the user. - \`owned\`: Brand templates owned by the user. - \`shared\`: Brand templates shared with the user. \|
\| \`continuation\` \| string \| No \| If the success response contains a continuation token, the user has access to more brand templates you can list. You can use this token as a query parameter and retrieve more templates from the list, for example \`/v1/brand-templates?continuation={continuation}\`. To retrieve all the brand templates available to the user, you might need to make multiple requests. IMPORTANT: This token is an opaque value returned by the API. You must use it exactly as returned from a previous API response. Do not manually construct or modify continuation tokens. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Asset Upload Job

\*\*Slug:\*\* \`CANVA\_CREATE\_ASSET\_UPLOAD\_JOB\`

Uploads an asset file to the user's Canva content library. This endpoint initiates an asynchronous upload job for images or videos. Returns a job ID to track the upload progress. Once complete, the asset can be used in designs, referenced by its asset ID, and managed through other asset endpoints. IMPORTANT: This is an async operation. Use CANVA\_FETCH\_ASSET\_UPLOAD\_JOB\_STATUS to poll the job status until it reaches 'success' or 'failed' status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\` \| object \| Yes \| Image or video file to upload directly to Canva. Direct upload is the path for large files and for videos larger than the URL-upload limit. No duplicate detection: uploading the same file creates a new asset. \|
\| \`name\` \| string \| Yes \| Display name for the asset (maximum 50 characters). The name can be changed later with the Update asset API. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Canva Design Export Job (Deprecated)

\*\*Slug:\*\* \`CANVA\_CREATE\_CANVA\_DESIGN\_EXPORT\_JOB\`

DEPRECATED: Use CANVA\_POST\_EXPORTS instead. Exports a Canva design to various file formats. This endpoint initiates an asynchronous export job for designs. Supports image formats (PNG, JPG, GIF), documents (PDF, PPTX), and video (MP4). Each format has specific configuration options like dimensions, quality, and page selection. IMPORTANT: This is an async operation. Use GET\_DESIGN\_EXPORT\_JOB\_RESULT to poll the job status until completion and retrieve the download URLs for the exported files.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`format\` \| string \| Yes \| Export format configuration. Set 'type' to one of: 'png', 'jpg', 'pdf', 'gif', 'mp4', 'pptx', 'html\_bundle', 'html\_standalone', or 'csv'. \|
\| \`design\_id\` \| string \| Yes \| The design ID to export \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create canva design with optional asset (Deprecated)

\*\*Slug:\*\* \`CANVA\_CREATE\_CANVA\_DESIGN\_WITH\_OPTIONAL\_ASSET\`

DEPRECATED: Use CANVA\_POST\_DESIGNS instead. Creates a new Canva design with specified dimensions or from an asset. This endpoint creates a design using either a preset type (doc, email, presentation, whiteboard), custom dimensions, or by importing an image asset. Returns the design ID, URLs for editing and viewing, owner info, and metadata. The design can be immediately accessed and edited.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| No \| Design title (1-255 chars). Appears in Canva UI and design lists. \|
\| \`asset\_id\` \| string \| No \| Image asset ID to create design from. Optional if design\_type provided. IMPORTANT: Only image assets are supported - video and PDF assets will be rejected by the API with error 'asset\_id must belong to an image asset'. Asset IDs are opaque strings with no guaranteed format. To verify an asset is an image before using it here, call CANVA\_RETRIEVE\_ASSET\_METADATA\_BY\_ID and check that the 'type' field equals 'image'. To upload a new image asset, use CANVA\_CREATE\_URL\_ASSET\_UPLOAD\_JOB or CANVA\_CREATE\_ASSET\_UPLOAD\_JOB. \|
\| \`design\_type\` \| object \| No \| Design dimensions configuration. Optional if asset\_id provided. Must be a dictionary with 'type' field. Two options: 1. Preset: {'type': 'preset', 'name': 'doc'\|'email'\|'whiteboard'\|'presentation'} 2. Custom: {'type': 'custom', 'width': 1080, 'height': 1920} Type must be either 'preset' or 'custom'. For preset, name must be one of: doc, email, whiteboard, presentation. For custom, width and height must be between 40-8000 pixels and their product must not exceed 25,000,000 pixels. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create comment reply in design (Deprecated)

\*\*Slug:\*\* \`CANVA\_CREATE\_COMMENT\_REPLY\_IN\_DESIGN\`

DEPRECATED: Use CANVA\_POST\_DESIGNS\_DESIGNID\_COMMENTS\_THREADID\_REPLIES instead. This preview API allows replying to comments within a design on Canva, with a limit of 100 replies per comment. Users should note potential unannounced changes, and that preview APIs are not eligible for public integrations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`message\` \| string \| No \| Deprecated alias for message\_plaintext. \|
\| \`design\_id\` \| string \| No \| The design ID. Must match pattern ^\[a-zA-Z0-9\_-\]{1,50}$. \|
\| \`comment\_id\` \| string \| No \| The thread ID. Must match pattern ^\[a-zA-Z0-9\_-\]{1,50}$. \|
\| \`attached\_to\` \| object \| No \| The object the comment is attached to. \|
\| \`message\_plaintext\` \| string \| No \| The reply comment message. This is the reply comment body shown in the Canva UI. You can also mention users in your message by specifying their User ID and Team ID using the format \`\[user\_id:team\_id\]\`. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create design comment in preview api (Deprecated)

\*\*Slug:\*\* \`CANVA\_CREATE\_DESIGN\_COMMENT\_IN\_PREVIEW\_API\`

DEPRECATED: Use CANVA\_POST\_DESIGNS\_DESIGNID\_COMMENTS instead. Creates a new comment thread on a Canva design using Canva's deprecated Create comment API. This preview API allows adding text comments to designs for collaboration and feedback. Returns the created comment with ID, author info, and timestamp. Comments can be replied to using the comment reply endpoint.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`message\` \| string \| Yes \| Comment text (1-2048 chars). Mention users with \[user\_id:team\_id\]. No markdown support. Comments appear unpinned - users must view 'All pages' to see them. \|
\| \`design\_id\` \| string \| No \| Design ID to attach comment to \|
\| \`assignee\_id\` \| string \| No \| User ID to assign this comment to. If provided, you must also mention this user in the message text using format \[user\_id:team\_id\]. \|
\| \`attached\_to\` \| object \| No \| Target reference for comment attachment \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Design Import Job

\*\*Slug:\*\* \`CANVA\_CREATE\_DESIGN\_IMPORT\_JOB\`

Imports an external file as a new Canva design. This endpoint converts documents (PDF, Word, PowerPoint, Excel) and design files (PSD, AI) into editable Canva designs. The import runs asynchronously and returns a job ID to track progress and retrieve the created design. IMPORTANT: This is an async operation. Use CANVA\_RETRIEVE\_DESIGN\_IMPORT\_JOB\_STATUS to poll the job status until it reaches 'success' or 'failed' to get the final design ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\` \| object \| Yes \| Document or design file to import. Supported formats: AI, PSD, Affinity (.af, .afdesign, .afphoto, .afpub), Keynote, Numbers, Pages, XLS/XLSX, PPT/PPTX, DOC/DOCX, ODG, ODP, ODS, ODT, and PDF. \|
\| \`title\` \| string \| Yes \| Title for the imported design (maximum 50 characters). Shows in Canva UI and design lists. \|
\| \`mime\_type\` \| string \| No \| Optional MIME type override. It is normalized to a lowercase media type without parameters. If omitted, Canva attempts to detect the file type automatically. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Design Resize Job

\*\*Slug:\*\* \`CANVA\_CREATE\_DESIGN\_RESIZE\_JOB\`

Creates a resized copy of an existing design (Canva Pro/Enterprise only). This endpoint creates a new design with different dimensions from an existing one. The resize operation runs asynchronously and preserves content where possible. Returns a job ID to track progress and retrieve the new design once complete. IMPORTANT: This is an async operation. Use CANVA\_RETRIEVE\_DESIGN\_RESIZE\_JOB\_STATUS to poll the job status until completion to get the resized design ID and access URLs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`design\_id\` \| string \| Yes \| The source design ID \|
\| \`design\_type\` \| string \| Yes \| Target design type configuration \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create URL Asset Upload Job

\*\*Slug:\*\* \`CANVA\_CREATE\_URL\_ASSET\_UPLOAD\_JOB\`

Tool to create an asynchronous Canva asset import job from a public URL. Use when you need to import an asset into Canva directly from a publicly accessible URL without S3 choreography.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| Yes \| Publicly accessible HTTPS URL of the file to import (8-2048 characters). Canva rejects non-HTTPS URLs. \|
\| \`name\` \| string \| Yes \| Asset name (1-255 characters). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete asset by id

\*\*Slug:\*\* \`CANVA\_DELETE\_ASSET\_BY\_ID\`

You can delete an asset by specifying its \`assetId\`. This operation mirrors the behavior in the Canva UI. Deleting an item moves it to the trash. Deleting an asset doesn't remove it from designs that already use it.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`assetId\` \| string \| Yes \| The ID of the asset. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Exchange oauth 2 0 access or refresh token

\*\*Slug:\*\* \`CANVA\_EXCHANGE\_OAUTH20\_ACCESS\_OR\_REFRESH\_TOKEN\`

The OAuth 2.0 endpoint issues time-limited (4-hour) access tokens of up to 4KB for user authorization via codes or refresh tokens. It requires client ID/secret for authentication.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`code\` \| string \| No \| Authorization code received after the user authorizes the integration. \|
\| \`scope\` \| string \| No \| Optional space-separated subset of previously granted scopes. \|
\| \`client\_id\` \| string \| No \| Integration client ID when credentials are supplied in the request body. \|
\| \`grant\_type\` \| string ("authorization\_code" \| "refresh\_token") \| Yes \| OAuth grant type: authorization\_code or refresh\_token. \|
\| \`redirect\_uri\` \| string \| No \| Redirect URI used for the authorization request, when applicable. \|
\| \`client\_secret\` \| string \| No \| Integration client secret when credentials are supplied in the request body. \|
\| \`code\_verifier\` \| string \| No \| PKCE code verifier used for an authorization-code exchange. \|
\| \`refresh\_token\` \| string \| No \| Refresh token to exchange when grant\_type is refresh\_token. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Fetch asset upload job status

\*\*Slug:\*\* \`CANVA\_FETCH\_ASSET\_UPLOAD\_JOB\_STATUS\`

Polls for asset upload job completion status. Use this after CANVA\_CREATE\_ASSET\_UPLOAD\_JOB to check the upload progress. Repeatedly call this endpoint until a 'success' or 'failed' status is received to get the final asset ID and metadata. IMPORTANT: This tool is ONLY for direct file upload jobs (CANVA\_CREATE\_ASSET\_UPLOAD\_JOB). Do NOT use this for URL import jobs created by CANVA\_CREATE\_URL\_ASSET\_UPLOAD\_JOB - those use a different API endpoint. Use CANVA\_GET\_URL\_ASSET\_UPLOADS\_JOBID to poll URL asset upload job status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`jobId\` \| string \| Yes \| The asset upload job ID returned by CANVA\_CREATE\_ASSET\_UPLOAD\_JOB or CANVA\_POST\_ASSET\_UPLOADS. This is the 'id' field from the job object in the response. IMPORTANT: This tool does NOT work for job IDs from CANVA\_CREATE\_URL\_ASSET\_UPLOAD\_JOB (URL import jobs use a different endpoint - use CANVA\_GET\_URL\_ASSET\_UPLOADS\_JOBID instead). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Fetch canva connect signing public keys

\*\*Slug:\*\* \`CANVA\_FETCH\_CANVA\_CONNECT\_SIGNING\_PUBLIC\_KEYS\`

The API for verifying Canva webhooks, 'connect/keys,' is in preview, meaning unstable, not for public integrations, and provides a rotating JWK for signature verification to prevent replay attacks. Cache keys for efficiency.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Fetch current user details

\*\*Slug:\*\* \`CANVA\_FETCH\_CURRENT\_USER\_DETAILS\`

Returns the User ID and Team ID associated with the provided access token. Use CANVA\_RETRIEVE\_USER\_PROFILE\_DATA to retrieve the user's display name.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Fetch design metadata and access information

\*\*Slug:\*\* \`CANVA\_FETCH\_DESIGN\_METADATA\_AND\_ACCESS\_INFORMATION\`

Gets the metadata for a design. This includes owner information, URLs for editing and viewing, and thumbnail information.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`designId\` \| string \| Yes \| The design ID (1-50 letters, numbers, underscores, or hyphens), for example DAFVztcvd9z. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get design comment thread replies

\*\*Slug:\*\* \`CANVA\_GET\_DESIGN\_COMMENT\_REPLIES\`

Retrieves a page of replies for a comment or suggestion thread on a design. Returns up to limit replies (default 50, maximum 100); follow the continuation token to retrieve the rest. This is a preview API. Public integrations that use it cannot pass Canva's review process.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The number of replies to return. Default is 50. Minimum value: 1, Maximum value: 100. \|
\| \`designId\` \| string \| Yes \| The design ID. \|
\| \`threadId\` \| string \| Yes \| The ID of the thread. \|
\| \`continuation\` \| string \| No \| Token for pagination to retrieve more items from the list. If the response contains a continuation token, use it to retrieve more replies. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get specific design comment reply

\*\*Slug:\*\* \`CANVA\_GET\_DESIGN\_COMMENT\_REPLY\`

Retrieves a specific reply to a comment or suggestion thread on a design. Use when you need to view details of a particular reply. This is a preview API. Public integrations that use it cannot pass Canva's review process.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`replyId\` \| string \| Yes \| The reply identifier. Must match pattern ^\[a-zA-Z0-9\_-\]{1,50}$. \|
\| \`designId\` \| string \| Yes \| The design identifier. \|
\| \`threadId\` \| string \| Yes \| The comment thread identifier. Must match pattern ^\[a-zA-Z0-9\_-\]{1,50}$. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get design export job result

\*\*Slug:\*\* \`CANVA\_GET\_DESIGN\_EXPORT\_JOB\_RESULT\`

Polls for design export job completion status. Use this after CANVA\_CREATE\_CANVA\_DESIGN\_EXPORT\_JOB to check the export progress. Call this endpoint repeatedly until the job is complete to receive download links for the exported design pages. Download URLs expire after 24 hours.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`exportId\` \| string \| Yes \| The export job ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get designs designid comments threadid

\*\*Slug:\*\* \`CANVA\_GET\_DESIGNS\_DESIGNID\_COMMENTS\_THREADID\`

Retrieves metadata for a comment or suggestion thread on a design. Use when you need to get details about a specific thread including content, author, timestamps, and status. This is a preview API. Public integrations that use it cannot pass Canva's review process.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`designId\` \| string \| Yes \| The design identifier. \|
\| \`threadId\` \| string \| Yes \| The thread identifier. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get design export formats

\*\*Slug:\*\* \`CANVA\_GET\_DESIGNS\_DESIGNID\_EXPORT\_FORMATS\`

Lists available file formats for exporting a design. Use this to check which export formats (PDF, JPG, PNG, SVG, PPTX, GIF, MP4, HTML bundle, standalone HTML, and CSV) are supported for a specific design.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`designId\` \| string \| Yes \| The design ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get URL asset upload job status

\*\*Slug:\*\* \`CANVA\_GET\_URL\_ASSET\_UPLOADS\_JOBID\`

Tool to retrieve the status and result of a URL-based asset upload job. Use this after creating a URL asset upload job to check progress and retrieve the uploaded asset ID when successful.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`jobId\` \| string \| Yes \| The asset upload job identifier. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get URL import job status

\*\*Slug:\*\* \`CANVA\_GET\_URL\_IMPORTS\_JOBID\`

Polls for URL import job completion status. Use this after creating a URL import job to check the import progress. Repeatedly call this endpoint until a 'success' or 'failed' status is received to get the final imported design ID and metadata.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`jobId\` \| string \| Yes \| The URL import job ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get user capabilities

\*\*Slug:\*\* \`CANVA\_GET\_USERS\_ME\_CAPABILITIES\`

Lists the API capabilities for the user account associated with the provided access token. Use when you need to check what features are available based on the user's Canva plan.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Initiate canva design autofill job

\*\*Slug:\*\* \`CANVA\_INITIATE\_CANVA\_DESIGN\_AUTOFILL\_JOB\`

Creates an asynchronous autofill job from a brand template or existing design, or updates an existing design in place. Canva Enterprise users are eligible; paid-plan users can use a limited development trial. Poll the returned job ID with CANVA\_RETRIEVE\_DESIGN\_AUTOFILL\_JOB\_STATUS.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| object \| Yes \| Data object containing the data fields and values to autofill. Keys are field names from the brand template. Values can be text, image, video, chart, or sheet data fields. \|
\| \`type\` \| string ("create\_from\_brand\_template" \| "create\_from\_design" \| "update\_design") \| No \| Autofill source and behavior. Defaults to create\_from\_brand\_template. \|
\| \`title\` \| string \| No \| Title to use for the autofilled design. Must be less than 256 characters. If no design title is provided, the autofilled design will have the same title as the brand template. \|
\| \`design\_id\` \| string \| No \| Source or target design ID for create\_from\_design or update\_design. \|
\| \`brand\_template\_id\` \| string \| No \| ID of the input brand template. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List design pages with pagination

\*\*Slug:\*\* \`CANVA\_LIST\_DESIGN\_PAGES\_WITH\_PAGINATION\`

Preview API for Canva: subject to unannounced changes and not for public integrations. Lists metadata for design pages with optional \`offset\` and \`limit\`; not applicable to all design types.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The number of pages to return, starting at the page index specified using the \`offset\` parameter. Default is \`50\` pages. Minimum: 1, Maximum: 200. \|
\| \`offset\` \| integer \| No \| The page index to start the range of pages to return. Default is \`1\`. Pages are indexed using one-based numbering, so the first page in a design has the index value \`1\`. Minimum: 1, Maximum: 500. \|
\| \`designId\` \| string \| Yes \| The design ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List folder items by type with sorting

\*\*Slug:\*\* \`CANVA\_LIST\_FOLDER\_ITEMS\_BY\_TYPE\_WITH\_SORTING\`

Lists folder items, including folders, designs, image assets, and brand templates. Brand templates are returned only when explicitly requested in \`item\_types\` and the user's plan supports them. Video assets are currently not returned.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The number of folder items to return (1-100, default 50). \|
\| \`sort\_by\` \| string ("created\_ascending" \| "created\_descending" \| "modified\_ascending" \| "modified\_descending" \| "title\_ascending" \| "title\_descending") \| No \| Sort the list of folder items. This can be one of the following: - \`created\_ascending\`: Sort results by creation date, in ascending order. - \`created\_descending\`: Sort results by creation date, in descending order. - \`modified\_ascending\`: Sort results by the last modified date, in ascending order. - \`modified\_descending\`: (Default) Sort results by the last modified date, in descending order. - \`title\_ascending\`: Sort results by title, in ascending order. The title is either the \`name\` field for a folder or asset, or the \`title\` field for a design. - \`title\_descending\`: Sort results by title, in descending order. The title is either the \`name\` field for a folder or asset, or the \`title\` field for a design. \|
\| \`folderId\` \| string \| Yes \| The folder ID. Must be a non-empty string. Use 'root' to list items in the root folder. \|
\| \`item\_types\` \| array \| No \| Filter the folder items to only return specified types. The available types are: \`brand\_template\`, \`design\`, \`folder\`, and \`image\`. To filter for more than one item type, provide a comma- delimited list. \|
\| \`pin\_status\` \| string ("any" \| "pinned") \| No \| Filter by pinned status: 'any' returns all items and 'pinned' returns only pinned items. \|
\| \`continuation\` \| string \| No \| If the success response contains a continuation token, the folder contains more items you can list. You can use this token as a query parameter and retrieve more items from the list, for example \`/v1/folders/{folderId}/items?continuation={continuation}\`. To retrieve all the items in a folder, you might need to make multiple requests. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List User Designs

\*\*Slug:\*\* \`CANVA\_LIST\_USER\_DESIGNS\`

Provides a summary of Canva user designs, includes search filtering, and allows showing both self-created and shared designs with sorting options.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The number of designs to return. Minimum 1, maximum 100, default 25. \|
\| \`query\` \| string \| No \| Lets you search the user"s designs, and designs shared with the user, using a search term or terms. \|
\| \`sort\_by\` \| string ("relevance" \| "modified\_descending" \| "modified\_ascending" \| "title\_descending" \| "title\_ascending") \| No \| Sort the list of designs. This can be one of the following: - \`relevance\`: (Default) Sort results using a relevance algorithm. - \`modified\_descending\`: Sort results by the date last modified in descending order. - \`modified\_ascending\`: Sort results by the date last modified in ascending order. - \`title\_descending\`: Sort results by title in descending order. - \`title\_ascending\`: Sort results by title in ascending order. \|
\| \`ownership\` \| string ("any" \| "owned" \| "shared") \| No \| Filter the list of designs based on the user"s ownership of the designs. This can be one of the following: - \`owned\`: Designs owned by the user. - \`shared\`: Designs shared with the user. - \`any\`: Designs owned by and shared with the user. \|
\| \`continuation\` \| string \| No \| If the success response contains a continuation token, the list contains more designs you can list. You can use this token as a query parameter and retrieve more designs from the list, for example \`/v1/designs?continuation={continuation}\`. To retrieve all of a user"s designs, you might need to make multiple requests. Pass a valid token or omit this parameter entirely. Empty strings are not accepted by the API. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Move item to specified folder

\*\*Slug:\*\* \`CANVA\_MOVE\_ITEM\_TO\_SPECIFIED\_FOLDER\`

Transfers an item to a different folder by specifying both the destination folder's ID and the item's ID. If the item is in various folders, an error occurs; manual relocation via Canva UI is required.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`item\_id\` \| string \| Yes \| The ID of the item you want to move. Item IDs are alphanumeric strings, 1-50 characters. Design IDs have format like 'DAFVztcvd9z', folder IDs like 'FAF2lZtloor', and asset IDs like 'Msd59349ff'. Obtain item IDs from the List designs, List folder items, or other Canva API endpoints. Note: Video assets are not supported for moving. \|
\| \`to\_folder\_id\` \| string \| Yes \| The ID of the folder you want to move the item to (the destination folder). Folder IDs are alphanumeric strings (e.g., 'FAF2lZtloor'), 1-50 characters. Use the special ID 'root' to move the item to the top level of a Canva user's projects, or 'uploads' for the Uploads folder. Obtain folder IDs from the List folder items or Create folder API endpoints. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create new Canva design

\*\*Slug:\*\* \`CANVA\_POST\_DESIGNS\`

Creates a Canva design with a preset type, custom dimensions, an existing design, or a brand template. Copying designs and using brand templates are Canva preview features. Optionally insert an image asset when using a preset or custom type. Returns design ID, edit/view URLs, and metadata.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string ("type\_and\_asset" \| "design" \| "brand\_template") \| No \| Creation mode. Omit or use 'type\_and\_asset' for a preset/custom design or asset; use 'design' to copy a design; use 'brand\_template' to copy a brand template. The copy modes are Canva preview features. \|
\| \`title\` \| string \| No \| Design name (1-255 characters). Appears in Canva UI and design lists. \|
\| \`asset\_id\` \| string \| No \| Image asset ID to insert into the design. Currently supports image assets only. Must be a valid asset ID from a previously uploaded asset. \|
\| \`design\_id\` \| string \| No \| ID of the existing Canva design to copy when type is 'design' \|
\| \`design\_type\` \| string \| No \| Design type configuration. Can be a preset name string ('doc', 'email', 'whiteboard', 'presentation') which will be auto-converted to the required format, or a nested object for preset (e.g., {'type': 'preset', 'name': 'presentation'}) or custom dimensions (e.g., {'type': 'custom', 'width': 1080, 'height': 1920}) \|
\| \`page\_numbers\` \| array \| No \| One-based page numbers to copy from a design or brand template. If omitted, all pages are copied. \|
\| \`brand\_template\_id\` \| string \| No \| ID of the Canva brand template to copy when type is 'brand\_template' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Post designs designid comments

\*\*Slug:\*\* \`CANVA\_POST\_DESIGNS\_DESIGNID\_COMMENTS\`

Creates a comment thread on a Canva design. Use when you need to add feedback or collaboration comments to a specific design. Rate limited to 100 requests per minute per user. This is a preview API. Public integrations that use it cannot pass Canva's review process.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`designId\` \| string \| Yes \| The design ID where the comment will be created. Must match pattern ^\[a-zA-Z0-9\_-\]{1,50}$ \|
\| \`assignee\_id\` \| string \| No \| Optional user ID for assignment. If specified, the assignee must be mentioned in the message using \[user\_id:team\_id\] format. \|
\| \`message\_plaintext\` \| string \| Yes \| The comment message in plaintext shown in Canva UI. Must be between 1 and 2048 characters. User mentions use format \[user\_id:team\_id\]. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create reply to comment thread

\*\*Slug:\*\* \`CANVA\_POST\_DESIGNS\_DESIGNID\_COMMENTS\_THREADID\_REPLIES\`

Tool to create a reply to a comment or suggestion thread on a Canva design. Use when you need to respond to existing comments or suggestions. Maximum 100 replies per thread allowed. This is a preview API. Public integrations that use it cannot pass Canva's review process.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`design\_id\` \| string \| Yes \| The design identifier. Must match pattern ^\[a-zA-Z0-9\_-\]{1,50}$ \|
\| \`thread\_id\` \| string \| Yes \| The identifier of the thread to reply to. Must match pattern ^\[a-zA-Z0-9\_-\]{1,50}$ \|
\| \`message\_plaintext\` \| string \| Yes \| The reply text content. Must be between 1 and 2048 characters. Users can be mentioned using the format \[user\_id:team\_id\]. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Start design export job

\*\*Slug:\*\* \`CANVA\_POST\_EXPORTS\`

Starts a new asynchronous job to export a Canva design file. Use when exporting designs to various formats (PDF, JPG, PNG, GIF, PPTX, MP4, CSV, and HTML). Returns a job ID that can be used to poll for completion status and download URLs. IMPORTANT: Format compatibility varies by design type. Before exporting, use the CANVA\_GET\_DESIGNS\_DESIGNID\_EXPORT\_FORMATS action to check which formats are supported for the specific design. Attempting to export in an unsupported format will result in a 400 error (e.g., 'png export not supported for this design type').

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`format\` \| string \| Yes \| Export format configuration. Specify the format type and format-specific options. Exported files remain available for download for 24 hours. IMPORTANT: Not all formats are supported for all design types. Use GET /v1/designs/{designId}/export-formats to check which formats are supported for a specific design before exporting. If you request an unsupported format, the API will return a 400 error. \|
\| \`design\_id\` \| string \| Yes \| The identifier of the design to export (e.g., 'DAGz4y3LDFI') \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create folder

\*\*Slug:\*\* \`CANVA\_POST\_FOLDERS\`

Tool to create a folder in Canva. Use when you need to organize designs, assets, or create nested folder structures in a user's projects or uploads folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| The display name for the new folder. Must be 1-255 characters. Duplicate names are allowed. \|
\| \`parent\_folder\_id\` \| string \| Yes \| The ID of the destination location. Use 'root' for top-level projects, 'uploads' for the uploads folder, or a specific folder ID to nest within another folder. Must be 1-50 characters. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create URL Import Job

\*\*Slug:\*\* \`CANVA\_POST\_URL\_IMPORTS\`

Tool to start an asynchronous job to import an external file from a URL as a new design in Canva. Use when you need to import a design from a publicly accessible URL. This is an async operation; poll the job status using the job ID until it reaches 'success' or 'failed'.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| Yes \| The URL of the file to import. This URL must be accessible from the internet and be publicly available (1-2048 characters). \|
\| \`title\` \| string \| Yes \| Name assigned to the imported design (1-255 characters). \|
\| \`mime\_type\` \| string \| No \| Supported design-import MIME type (for example, 'application/pdf' or 'application/vnd.apple.keynote'). It is normalized to a lowercase media type without parameters. Canva attempts automatic detection if omitted or empty (1-100 characters when provided). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove folder and move contents to trash

\*\*Slug:\*\* \`CANVA\_REMOVE\_FOLDER\_AND\_MOVE\_CONTENTS\_TO\_TRASH\`

Deletes a folder by moving the user's content to Trash and reassigning other users' content to their top-level projects.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`folderId\` \| string \| Yes \| The folder ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Retrieve app public key set

\*\*Slug:\*\* \`CANVA\_RETRIEVE\_APP\_PUBLIC\_KEY\_SET\`

Returns the Json Web Key Set (public keys) of an app. These keys are used to verify JWTs sent to app backends.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`appId\` \| string \| Yes \| The app ID. Must be 1-50 alphanumeric characters, underscores, or hyphens. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Retrieve asset metadata by id

\*\*Slug:\*\* \`CANVA\_RETRIEVE\_ASSET\_METADATA\_BY\_ID\`

You can retrieve the metadata of an asset by specifying its \`assetId\`.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`assetId\` \| string \| Yes \| The ID of the asset. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Retrieve brand template dataset definition

\*\*Slug:\*\* \`CANVA\_RETRIEVE\_BRAND\_TEMPLATE\_DATASET\_DEFINITION\`

Gets the dataset definition for a brand template. Available to users on plans with brand-template access, such as Canva Pro, Canva Teams, or Canva Enterprise. Data fields can contain images, text, and charts; chart data is a preview feature.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`brandTemplateId\` \| string \| Yes \| The brand template ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Retrieve brand template metadata

\*\*Slug:\*\* \`CANVA\_RETRIEVE\_CANVA\_ENTERPRISE\_BRAND\_TEMPLATE\_METADATA\`

Retrieves metadata for a brand template. Available to users on plans with brand-template access, such as Canva Pro, Canva Teams, or Canva Enterprise.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`brandTemplateId\` \| string \| Yes \| The brand template ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Retrieve design autofill job status

\*\*Slug:\*\* \`CANVA\_RETRIEVE\_DESIGN\_AUTOFILL\_JOB\_STATUS\`

Retrieves a design autofill job result. Canva Enterprise users are eligible, while paid-plan users can use a limited development trial. Poll until the status is \`success\` or \`failed\`.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`jobId\` \| string \| Yes \| The design autofill job ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Retrieve design import job status

\*\*Slug:\*\* \`CANVA\_RETRIEVE\_DESIGN\_IMPORT\_JOB\_STATUS\`

Polls for design import job completion status. Use this after CANVA\_CREATE\_DESIGN\_IMPORT\_JOB to check the import progress. Repeatedly call this endpoint until a 'success' or 'failed' status is received to get the final imported design ID and metadata.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`jobId\` \| string \| Yes \| The design import job ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Retrieve Design Resize Job Status

\*\*Slug:\*\* \`CANVA\_RETRIEVE\_DESIGN\_RESIZE\_JOB\_STATUS\`

Retrieves the status and results of a design resize job. Polls for design resize job completion status. Use this after CANVA\_CREATE\_DESIGN\_RESIZE\_JOB to check the resize progress. Keep polling until status is 'success' or 'failed'. Successful jobs include the new design ID and temporary access URLs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`job\_id\` \| string \| Yes \| The resize job ID returned from create resize job endpoint \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Retrieve folder details by id

\*\*Slug:\*\* \`CANVA\_RETRIEVE\_FOLDER\_DETAILS\_BY\_ID\`

Gets the name and other details of a folder using a folder's \`folderID\`.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`folderId\` \| string \| Yes \| The folder ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Retrieveuserprofiledata

\*\*Slug:\*\* \`CANVA\_RETRIEVE\_USER\_PROFILE\_DATA\`

Currently, this returns the display name of the user account associated with the provided access token. More user information is expected to be included in the future.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Revoke oauth tokens

\*\*Slug:\*\* \`CANVA\_REVOKE\_OAUTH\_TOKENS\`

Revoke an access token or refresh token. Revoking a refresh token also revokes its lineage and user consent, requiring re-authentication. Authenticate using either basic access with Base64-encoded credentials or body parameters with client ID and secret.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`token\` \| string \| Yes \| The token to revoke. \|
\| \`client\_id\` \| string \| No \| Your integration"s unique ID, for authenticating the request. NOTE: We recommend that you use basic access authentication instead of specifying \`client\_id\` and \`client\_secret\` as body parameters. \|
\| \`client\_secret\` \| string \| No \| Your integration"s client secret, for authenticating the request. Begins with \`cnvca\`. NOTE: We recommend that you use basic access authentication instead of specifying \`client\_id\` and \`client\_secret\` as body parameters. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update asset s name and tags by id

\*\*Slug:\*\* \`CANVA\_UPDATE\_ASSET\_S\_NAME\_AND\_TAGS\_BY\_ID\`

You can update the name and tags of an asset by specifying its \`assetId\`. Updating the tags replaces all existing tags of the asset.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| The name of the asset. This is shown in the Canva UI. When this field is undefined or empty, nothing is updated. Maximum length 50 characters. \|
\| \`tags\` \| array \| No \| The replacement tags for the asset. When this field is undefined, nothing is updated. Maximum length 50 tags. Each tag has a maximum length of 50 characters. \|
\| \`assetId\` \| string \| Yes \| The ID of the asset. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update folder details by id

\*\*Slug:\*\* \`CANVA\_UPDATE\_FOLDER\_DETAILS\_BY\_ID\`

Updates a folder's details using its \`folderID\`. Currently, you can only update a folder's name.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| The folder name, as shown in the Canva UI (1-255 characters). \|
\| \`folderId\` \| string \| Yes \| The folder ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Validate oauth token properties

\*\*Slug:\*\* \`CANVA\_VALIDATE\_OAUTH\_TOKEN\_PROPERTIES\`

Check an access token's validity and properties via introspection, requiring authentication. Use Basic access (Base64 encoded \`client\_id:client\_secret\`) or body parameters for credentialing.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`token\` \| string \| Yes \| The token to introspect. \|
\| \`client\_id\` \| string \| No \| Your integration"s unique ID, for authenticating the request. NOTE: We recommend that you use basic access authentication instead of specifying \`client\_id\` and \`client\_secret\` as body parameters. \|
\| \`client\_secret\` \| string \| No \| Your integration"s client secret, for authenticating the request. Begins with \`cnvca\`. NOTE: We recommend that you use basic access authentication instead of specifying \`client\_id\` and \`client\_secret\` as body parameters. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|
