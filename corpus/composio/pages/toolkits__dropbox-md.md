---
url: https://docs.composio.dev/toolkits/dropbox.md
title: https://docs.composio.dev/toolkits/dropbox.md
description: 
status: 200
---

\# Dropbox

Dropbox is a cloud storage service offering file syncing, sharing, and collaboration across devices with version control and robust integrations

\- \*\*Category:\*\* file management & storage
\- \*\*Auth:\*\* OAUTH2
\- \*\*Composio-managed OAuth available?\*\* Yes
\- \*\*Tools:\*\* 177
\- \*\*Triggers:\*\* 0
\- \*\*Slug:\*\* \`DROPBOX\`
\- \*\*Version:\*\* 20260819\_00

\## Frequently Asked Questions

\### How do I set up custom OAuth credentials for Dropbox?

For a step-by-step guide on creating and configuring your own Dropbox OAuth credentials with Composio, see \[How to create OAuth credentials for Dropbox\](https://composio.dev/auth/dropbox).

\## Tools

\### Activate team folder

\*\*Slug:\*\* \`DROPBOX\_ACTIVATE\_TEAM\_FOLDER\`

Tool to activate an archived team folder. Use when you need to restore access to a previously archived team folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\_folder\_id\` \| string \| Yes \| The ID of the team folder to activate. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add file member

\*\*Slug:\*\* \`DROPBOX\_ADD\_FILE\_MEMBER\`

Tool to add specified members to a Dropbox file with configurable access levels. Use when sharing a file with specific users by email or Dropbox ID. Supports custom invitation messages and notification controls. Note: This endpoint does not support apps with the app folder permission, and members will receive invitations unless quiet mode is enabled.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\` \| string \| Yes \| File to which to add members. Use the file ID format (e.g., 'id:7bh4zBmgZoAAAAAAAAABCQ') or file path. \|
\| \`quiet\` \| boolean \| No \| Whether to suppress device notifications for added members. If false (default), members will be notified of their invitation. \|
\| \`members\` \| array \| Yes \| List of members to add to the file. Each member is identified by email or Dropbox ID. Note: If an email is provided and it's the user's main account email, they may be directly added to the membership. \|
\| \`access\_level\` \| object \| No \| Defines the access level for the new member. \|
\| \`custom\_message\` \| string \| No \| Custom message to include in the invitation email sent to added members. \|
\| \`add\_message\_as\_comment\` \| boolean \| No \| If true and a custom\_message is provided, the message will be added as a comment on the file. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add file properties

\*\*Slug:\*\* \`DROPBOX\_ADD\_FILE\_PROPERTIES\`

Tool to add custom properties to a Dropbox file using a filled property template. Use when you need to tag files with structured metadata like project info, status, or categories.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| A unique identifier for the file or folder. Can be a file path (e.g., '/test.txt') or a file ID (e.g., 'id:a4ayc\_80\_OEAAAAAAAAAXw'). \|
\| \`property\_groups\` \| array \| Yes \| The property groups to be added to the Dropbox file. Each group must reference a valid template that the file doesn't already have. \|
\| \`Dropbox-API-Select-User\` \| string \| No \| Team member ID (format: dbmid:...) required when using team tokens. Specifies which team member's account to operate on. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add tag to file or folder

\*\*Slug:\*\* \`DROPBOX\_ADD\_FILE\_TAGS\`

Tool to add a tag to a file or folder in Dropbox. Use when you need to tag items for organization. Tags are automatically converted to lowercase.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| Path to the file or folder to tag. Must be a valid path in the user's Dropbox. \|
\| \`tag\_text\` \| string \| Yes \| The tag text to add. Will be automatically converted to lowercase letters by Dropbox. \|
\| \`Dropbox-API-Select-User\` \| string \| No \| Team member ID (format: dbmid:...) required when using team tokens. Specifies which team member's account to operate on. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add folder member

\*\*Slug:\*\* \`DROPBOX\_ADD\_FOLDER\_MEMBER\_ACTION\`

Tool to add members to a shared folder with specified access levels. Use when an owner or editor needs to invite new members to a shared folder. Members receive invites and must be mounted via mount\_folder for full access. Requires appropriate ACL permissions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`quiet\` \| boolean \| No \| Whether to suppress email and device notifications for the added members. If true, members are added silently without notification. Default is false \|
\| \`members\` \| array \| Yes \| List of members to add to the shared folder. Each member will receive an invitation to join the folder \|
\| \`custom\_message\` \| string \| No \| Optional custom message to include in the invitation email sent to added members \|
\| \`shared\_folder\_id\` \| string \| Yes \| The ID of the shared folder to add members to. You can get this from list\_shared\_folders action \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add users to space limits exclusion list

\*\*Slug:\*\* \`DROPBOX\_ADD\_MEMBER\_SPACE\_LIMITS\_EXCLUDED\_USERS\`

Tool to add users to the team's space limits exclusion list in Dropbox. Users on this list are exempt from space limit restrictions. Use when you need to exclude specific team members from storage quota enforcement. Requires team admin authentication.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`users\` \| array \| Yes \| List of users to be added to the space limits exclusion list. Each user can be specified by team\_member\_id, external\_id, or email. Maximum size of the list is 1000 users. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add sharing allowlist

\*\*Slug:\*\* \`DROPBOX\_ADD\_SHARING\_ALLOWLIST\`

Tool to add domains or email addresses to the team sharing allowlist. Use when team admins need to approve specific domains or emails for sharing. Requires team admin authentication. At least one of 'domains' or 'emails' must be provided, with a maximum of 100 entries per call.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`emails\` \| array \| No \| List of email addresses to add to the allowlist. Each email must be a valid string representation following RFC-5322/822 (e.g., 'user@example.com'). Maximum 100 entries per call. At least one of 'domains' or 'emails' must be provided \|
\| \`domains\` \| array \| No \| List of domains to add to the allowlist. Each domain must be a valid string representation following RFC-1034/5 (e.g., 'example.com', 'subdomain.example.org'). Maximum 100 entries per call. At least one of 'domains' or 'emails' must be provided \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add members to team group

\*\*Slug:\*\* \`DROPBOX\_ADD\_TEAM\_GROUP\_MEMBERS\`

Tool to add members to a team group with specified access levels. Use when you need to add users to an existing team group. Requires team admin credentials with group management permissions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`group\` \| object \| Yes \| The group to add members to. Use group\_id obtained from list\_team\_groups or create\_team\_group actions \|
\| \`members\` \| array \| Yes \| List of members to add to the group with their respective access levels \|
\| \`return\_members\` \| boolean \| No \| Whether to return the list of members in the group after adding. Default is true \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add team members

\*\*Slug:\*\* \`DROPBOX\_ADD\_TEAM\_MEMBERS\`

Tool to add new members to a Dropbox team. Use when you need to invite users to join the team with specified roles and settings. Maximum of 20 members per request. Requires team admin credentials.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`force\_async\` \| boolean \| No \| Whether to force the operation to happen asynchronously. If true, returns an async\_job\_id to poll for completion. Default is false \|
\| \`new\_members\` \| array \| Yes \| List of new members to add to the team. Maximum of 20 members per request \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add secondary emails to team members

\*\*Slug:\*\* \`DROPBOX\_ADD\_TEAM\_MEMBERS\_SECONDARY\_EMAILS\`

Tool to add secondary email addresses to Dropbox team members. Use when you need to associate additional email addresses with team member accounts. Requires team admin credentials.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`new\_secondary\_emails\` \| array \| Yes \| List of users and their secondary emails to add. Each entry specifies a user (by ID or email) and the secondary emails to add for them \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add property template for team

\*\*Slug:\*\* \`DROPBOX\_ADD\_TEAM\_PROPERTIES\_TEMPLATE\`

Tool to add a property template for a team in Dropbox. Use when you need to create a standardized set of custom properties that can be applied to files and folders. Requires team admin permissions and a Dropbox Business account.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Display name for the template. Template names can be up to 256 bytes. \|
\| \`fields\` \| array \| Yes \| Definitions of the property fields associated with this template. There can be up to 32 properties in a single template. \|
\| \`description\` \| string \| Yes \| Description for the template. Template descriptions can be up to 1024 bytes. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Alpha Upload File

\*\*Slug:\*\* \`DROPBOX\_ALPHA\_UPLOAD\_FILE\`

Tool to upload a new file to Dropbox using the alpha upload endpoint. Use when uploading files up to 150 MiB. Note that the behavior of this alpha endpoint is unstable and subject to change.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mode\` \| string ("add" \| "overwrite") \| No \| Selects what to do if the file already exists. \|
\| \`mute\` \| boolean \| No \| If true, this tells the clients that this modification shouldn't result in a user notification. \|
\| \`path\` \| string \| Yes \| Path in the user's Dropbox to save the file. Must start with '/' and include the filename. \|
\| \`content\` \| object \| Yes \| File to be uploaded. Supports various formats including text, images, and PDFs. \|
\| \`autorename\` \| boolean \| No \| If there's a conflict as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. \|
\| \`client\_modified\` \| string \| No \| The value to store as the client\_modified timestamp in ISO 8601 format (e.g., '2015-05-12T15:50:38Z'). Dropbox automatically records the time at which the file was written to the Dropbox servers. \|
\| \`property\_groups\` \| array \| No \| List of custom properties to add to file. \|
\| \`dropbox\_api\_select\_user\` \| string \| No \| Optional. For team accounts: Dropbox account ID or team member ID to operate on. Required when using a Dropbox Business team token. Format: 'dbid:...' or team\_member\_id. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Append data to upload session

\*\*Slug:\*\* \`DROPBOX\_APPEND\_UPLOAD\_SESSION\`

Tool to append more data to an existing upload session. Use when uploading large files in chunks. When the 'close' parameter is set to true, this call will close the session. A single request should not upload more than 150 MiB.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`close\` \| boolean \| No \| If true, the upload session will be closed after appending this data. Once closed, no more data can be appended to the session. \|
\| \`cursor\` \| object \| Yes \| Cursor information containing the session\_id and current offset in bytes. \|
\| \`content\` \| object \| Yes \| File data to append to the upload session. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Append to multiple upload sessions

\*\*Slug:\*\* \`DROPBOX\_APPEND\_UPLOAD\_SESSION\_BATCH\`

Tool to append data to multiple upload sessions in a single request. Use when you need to upload data to multiple ongoing upload sessions efficiently. The file content for each session should be concatenated in the request body in the order specified by entries. A single request should not upload more than 150 MiB. The maximum size of a file one can upload to an upload session is 2^41 - 2^22 (2,199,019,061,248) bytes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Concatenated binary data for all upload sessions. The data for each session should be concatenated in the order specified in the entries list. Each chunk's length must match the corresponding entry's length field. \|
\| \`entries\` \| array \| Yes \| List of upload session entries to append data to. Each entry specifies the session, how many bytes to read from the request body, and whether to close the session. The data for each entry should be concatenated in the request body in the same order as this list. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Archive team folder

\*\*Slug:\*\* \`DROPBOX\_ARCHIVE\_TEAM\_FOLDER\`

Tool to archive an active team folder in Dropbox. Sets the team folder's status to archived and removes all folder and file members. Use when you need to archive a team folder that is no longer in active use. The folder must be active before it can be archived.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\_folder\_id\` \| string \| Yes \| The ID of the team folder to archive. You can get this from list team folders action. The team folder must be active to be archived. \|
\| \`force\_async\_off\` \| boolean \| No \| Whether to force the operation to run synchronously. If true, the operation will complete synchronously and return metadata immediately. If false or not specified, large operations may complete asynchronously. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check copy batch job status

\*\*Slug:\*\* \`DROPBOX\_CHECK\_COPY\_BATCH\`

Tool to check the status of an asynchronous copy batch job in Dropbox. Use when you have an async\_job\_id from a previous copy\_batch operation and need to poll its status. Returns 'in\_progress', 'complete' with results for each entry, or 'failed' with error details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`async\_job\_id\` \| string \| Yes \| Id of the asynchronous job. This is the value of a response returned from the method that launched the job. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check delete batch status

\*\*Slug:\*\* \`DROPBOX\_CHECK\_DELETE\_BATCH\`

Tool to check the status of an asynchronous delete batch job in Dropbox. Use when you need to poll the status of a batch delete operation initiated by delete\_batch. Returns 'in\_progress', 'complete' with per-entry results, 'failed', or error status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`async\_job\_id\` \| string \| Yes \| Id of the asynchronous job. This is the value of a response returned from the method that launched the job. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check folder batch status

\*\*Slug:\*\* \`DROPBOX\_CHECK\_FOLDER\_BATCH\`

Tool to check the status of an asynchronous folder batch creation job. Use when you need to poll the status of a create\_folder\_batch operation. Returns 'in\_progress', 'complete' with results, or 'failed' with error details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`async\_job\_id\` \| string \| Yes \| ID of the asynchronous job. This is the value returned from the create\_folder\_batch method. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check sharing job status

\*\*Slug:\*\* \`DROPBOX\_CHECK\_JOB\_STATUS\`

Tool to check the status of an asynchronous sharing job in Dropbox. Use when you have an async\_job\_id from a previous sharing operation (like unshare\_folder, remove\_folder\_member) and need to poll its status. Returns 'in\_progress', 'complete', 'failed' with error details, or polling errors.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`async\_job\_id\` \| string \| Yes \| Id of the asynchronous job. This is the value of a response returned from the method that launched the job. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check move batch job status

\*\*Slug:\*\* \`DROPBOX\_CHECK\_MOVE\_BATCH\`

Tool to check the status of an asynchronous move batch job. Use when you need to poll the status of a batch move operation started with move\_batch\_v2. Returns a list of results for each entry when complete.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`async\_job\_id\` \| string \| Yes \| Id of the asynchronous job. This is the value of a response returned from the method that launched the job. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check move former member files job status

\*\*Slug:\*\* \`DROPBOX\_CHECK\_MOVE\_FORMER\_MEMBER\_FILES\_JOB\_STATUS\`

Tool to check the status of an asynchronous move former member files job. Use when you have an async\_job\_id from a previous team/members/move\_former\_member\_files operation and need to poll its completion status. Returns 'in\_progress', 'complete', 'failed' with error details, or error states like 'invalid\_async\_job\_id'.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`async\_job\_id\` \| string \| Yes \| Id of the asynchronous job returned from team/members/move\_former\_member\_files. This is used to poll the status of the file move operation. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check remove member job status

\*\*Slug:\*\* \`DROPBOX\_CHECK\_REMOVE\_MEMBER\`

Tool to check the status of an asynchronous remove folder member job in Dropbox. Use when you have an async\_job\_id from a previous remove\_folder\_member operation and need to poll its status. Returns 'in\_progress', 'complete' with access level info, or 'failed' with error details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`async\_job\_id\` \| string \| Yes \| Id of the asynchronous job. This is the value of a response returned from the method that launched the job. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check save URL job status

\*\*Slug:\*\* \`DROPBOX\_CHECK\_SAVE\_URL\_STATUS\`

Tool to check the status of a save\_url job in Dropbox. Use when you have an async\_job\_id from a save\_url operation and need to poll its completion status. Returns 'in\_progress', 'complete' with file metadata, or 'failed' with error details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`async\_job\_id\` \| string \| Yes \| The async job ID returned from a previous save\_url operation. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check share job status

\*\*Slug:\*\* \`DROPBOX\_CHECK\_SHARE\_JOB\_STATUS\`

Tool to check the status of an asynchronous folder sharing job in Dropbox. Use when you need to poll the status of a folder share operation that was initiated asynchronously. Returns 'in\_progress', 'complete' with folder metadata, 'failed' with error details, or polling error status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`async\_job\_id\` \| string \| Yes \| Id of the asynchronous job. This is the value of a response returned from the method that launched the job. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check team folder archive status

\*\*Slug:\*\* \`DROPBOX\_CHECK\_TEAM\_FOLDER\_ARCHIVE\`

Tool to check the status of an asynchronous team folder archive job in Dropbox. Use when you have an async\_job\_id from a previous team\_folder/archive operation and need to poll its status. Returns 'in\_progress' while archiving, 'complete' with team folder metadata when done, or error states like 'invalid\_async\_job\_id'.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`async\_job\_id\` \| string \| Yes \| Id of the asynchronous job returned from the team\_folder/archive method that launched the archive operation. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check upload batch status

\*\*Slug:\*\* \`DROPBOX\_CHECK\_UPLOAD\_BATCH\`

Tool to check the status of an asynchronous upload batch job in Dropbox. Use when you need to poll the status of a batch upload operation initiated by upload\_session/finish\_batch. Returns 'in\_progress', 'complete' with per-entry results, or error status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`async\_job\_id\` \| string \| Yes \| Id of the asynchronous job. This is the value of a response returned from the method that launched the job. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check user

\*\*Slug:\*\* \`DROPBOX\_CHECK\_USER\`

Tool to test Dropbox API connection and validate access token by echoing back a supplied string. Use when you need to verify that the Dropbox API is accessible and the access token is valid.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| No \| The string that you'd like to be echoed back to you. Maximum length is 500 characters. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Copy multiple files or folders

\*\*Slug:\*\* \`DROPBOX\_COPY\_BATCH\`

Tool to copy multiple files or folders to different locations at once in Dropbox. Use when you need to duplicate multiple items efficiently. This operation may complete synchronously or return a job ID for async processing. Use copy\_batch/check:2 to check async job status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`entries\` \| array \| Yes \| List of entries to be copied. Each entry is a RelocationPath with from\_path and to\_path. \|
\| \`autorename\` \| boolean \| No \| If there's a conflict with any file, have the Dropbox server try to autorename that file to avoid the conflict. The default is false. \|
\| \`dropbox\_api\_select\_user\` \| string \| No \| Team member ID (format: dbmid:...) required when using team tokens. Specifies which team member's account to operate on. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Copy file or folder

\*\*Slug:\*\* \`DROPBOX\_COPY\_FILE\_OR\_FOLDER\`

Tool to copy a file or folder to a different location in Dropbox. Use when you need to duplicate content without removing the original. If the source path is a folder, all its contents will be copied.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`to\_path\` \| string \| Yes \| Path in the user's Dropbox that is the destination. This path is case-sensitive. \|
\| \`from\_path\` \| string \| Yes \| Path in the user's Dropbox to be copied. This path is case-sensitive. \|
\| \`autorename\` \| boolean \| No \| If there's a conflict (e.g., a file with the same name already exists at the destination), have the Dropbox server try to auto-rename the file to avoid the conflict. The default is false. \|
\| \`allow\_shared\_folder\` \| boolean \| No \| If true, allows copying of shared folders. Note: This flag has no effect in current API version. The default is false. \|
\| \`dropbox\_api\_select\_user\` \| string \| No \| Team member ID (format: dbmid:...) required when using team tokens. Specifies which team member's account to operate on. \|
\| \`allow\_ownership\_transfer\` \| boolean \| No \| Allow moves by owner even if it would result in an ownership transfer for the content being moved. Note: This does not apply to copies. The default is false. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Count file requests

\*\*Slug:\*\* \`DROPBOX\_COUNT\_FILE\_REQUESTS\`

Tool to get the total number of file requests owned by the authenticated user. Use when you need to count how many file requests (both open and closed) exist.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create file request

\*\*Slug:\*\* \`DROPBOX\_CREATE\_FILE\_REQUEST\`

Tool to create a new file request in Dropbox. Use when you need to request files from others by generating a unique link for uploads to a specified Dropbox folder, optionally with a deadline.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`open\` \| boolean \| No \| Whether the file request should be open by default. If true, the file request will start accepting files immediately. \|
\| \`title\` \| string \| Yes \| The title of the new file request. Must be 1 character or more. \|
\| \`deadline\` \| object \| No \| Represents the deadline parameters for a file request. \|
\| \`destination\` \| string \| Yes \| The path in the user's Dropbox where uploaded files will be saved. Must be a path starting with '/'. Example: '/Homework/math' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create folder

\*\*Slug:\*\* \`DROPBOX\_CREATE\_FOLDER\`

Tool to create a new folder at a specified path in Dropbox. Use when you need to organize files by creating a new directory.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| Path in the user's Dropbox to create the folder. Must start with a slash. May use 'id:' prefix for namespace-based paths. Must not end with '/' or whitespace. Paths are case-insensitive but must be correctly formatted to avoid validation errors. \|
\| \`autorename\` \| boolean \| No \| If there's a conflict, have the Dropbox server try to autorename the folder to avoid the conflict. Default is False. Without autorename, a conflict returns a \`path\_conflict\` error. For idempotent folder creation, set autorename=true or treat \`path\_conflict\` as non-fatal. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create multiple folders

\*\*Slug:\*\* \`DROPBOX\_CREATE\_FOLDER\_BATCH\`

Tool to create multiple folders at once in Dropbox. Use when you need to create several folders efficiently in a single request. For large batches, returns a job ID immediately and runs asynchronously; for smaller inputs, creates folders and returns results synchronously.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`paths\` \| array \| Yes \| List of paths to be created in the user's Dropbox. Each path must start with a slash. Duplicate path arguments in the batch are considered only once. Maximum 10,000 paths. \|
\| \`autorename\` \| boolean \| No \| If there's a conflict, have the Dropbox server try to autorename the folder to avoid the conflict. Default is False. \|
\| \`force\_async\` \| boolean \| No \| Whether to force the create to happen asynchronously. For large batches, the operation will be asynchronous automatically. Default is False. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create paper document

\*\*Slug:\*\* \`DROPBOX\_CREATE\_PAPER\_DOCUMENT\`

Creates a new Dropbox Paper document at the specified path using HTML or Markdown content.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| The fully qualified path in Dropbox where the Paper document will be created. MUST include the .paper extension at the end (e.g., '/My Documents/Notes.paper'). \|
\| \`content\` \| string \| Yes \| Content of the paper document \|
\| \`import\_format\` \| string \| No \| Format of the provided content \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Paper folder

\*\*Slug:\*\* \`DROPBOX\_CREATE\_PAPER\_FOLDER\`

Tool to create a new Paper folder with the provided info. Use when you need to organize Paper documents by creating a new folder. Note: This endpoint works for content created by users on the older version of Paper.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| The name of the new Paper folder. \|
\| \`is\_team\_folder\` \| boolean \| No \| Whether the folder to be created should be a team folder. If not specified, defaults to false. \|
\| \`parent\_folder\_id\` \| string \| No \| The encrypted Paper folder Id where the new Paper folder should be created. If not provided, the folder will be created at the root level. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create shared link

\*\*Slug:\*\* \`DROPBOX\_CREATE\_SHARED\_LINK\`

Tool to create a stable, long-lived shared link for a Dropbox file or folder. Use when the user needs a permanent URL suitable for embedding or long-term sharing (as opposed to temporary links that expire in hours). Supports optional settings like expiration, password protection, and visibility controls. Note: If a shared link already exists for the path, the API will return an error; in that case, use a separate list\_shared\_links endpoint to retrieve existing links.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| The path or file identifier to be shared by the shared link. Supports Dropbox path (e.g., '/folder/file.txt'), id:..., rev:..., or ns:... notation. \|
\| \`settings\` \| object \| No \| Settings for the shared link configuration. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create simple shared link (Deprecated)

\*\*Slug:\*\* \`DROPBOX\_CREATE\_SHARED\_LINK\_SIMPLE\`

DEPRECATED: Use CreateSharedLinkV2 instead. Tool to create a basic shared link for a Dropbox file or folder. If a shared link already exists for the given path, that link is returned. Use when you need a simple shared link without advanced settings like password protection or custom expiration. For links with advanced settings, use the create\_shared\_link action instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| The path to share. This can be a file or folder path in Dropbox (e.g., '/folder/file.txt'). If a shared link already exists for this path, that link will be returned instead of creating a new one. \|
\| \`short\_url\` \| boolean \| No \| Whether to return a shortened URL. If true, the returned URL will be shorter and easier to share. \|
\| \`pending\_upload\` \| object \| No \| Mode for pending upload indicating file or folder type. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create team folder

\*\*Slug:\*\* \`DROPBOX\_CREATE\_TEAM\_FOLDER\`

Tool to create a new, active team folder with no members in Dropbox. Use when you need to set up a new team folder for collaboration. The folder is created without any members initially.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Name for the new team folder. The name must be unique within the team. \|
\| \`sync\_setting\` \| string ("default" \| "not\_synced") \| No \| Sync setting enum for the team folder. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create team group

\*\*Slug:\*\* \`DROPBOX\_CREATE\_TEAM\_GROUP\`

Tool to create a new, empty team group in Dropbox with a specified name. Use when you need to create a new group for organizing team members. Requires team admin credentials with team member management permissions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`group\_name\` \| string \| Yes \| The name for the new group. Must not be empty. \|
\| \`group\_external\_id\` \| string \| No \| An arbitrary external ID that the creator of the team can associate with the group for organizational purposes. \|
\| \`group\_management\_type\` \| string ("user\_managed" \| "company\_managed" \| "system\_managed" \| "other") \| No \| The type of group management for the team group. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete all closed file requests

\*\*Slug:\*\* \`DROPBOX\_DELETE\_ALL\_CLOSED\_FILE\_REQUESTS\`

Tool to delete all closed file requests owned by the current user. Use when you need to clean up closed file requests in bulk.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete multiple files/folders

\*\*Slug:\*\* \`DROPBOX\_DELETE\_BATCH\`

Tool to delete multiple files or folders at once in Dropbox. Use when you need to delete several items simultaneously. This route is asynchronous and returns a job ID immediately for large batches. Use delete\_batch/check to verify completion status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`entries\` \| array \| Yes \| List of files or folders to delete. Maximum 1000 entries per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete file or folder

\*\*Slug:\*\* \`DROPBOX\_DELETE\_FILE\`

Tool to delete a file or folder at the specified path in Dropbox. Use when you need to permanently remove a file or folder and all its contents.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| Path in the user's Dropbox to delete. The path must start with a slash. \|
\| \`parent\_rev\` \| string \| No \| Perform delete if given 'rev' matches the existing file's latest 'rev'. This field does not support deleting a folder. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete file or folder (Deprecated)

\*\*Slug:\*\* \`DROPBOX\_DELETE\_FILE\_OR\_FOLDER\`

DEPRECATED: Use DeleteFile instead. Permanently and irreversibly deletes the file or folder at the specified path in Dropbox. Folder deletion is recursive — all nested contents are removed. Always obtain explicit user confirmation before calling, especially for folders. Requires the \`files.content.write\` scope.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| The path to the file or folder to delete \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete file requests

\*\*Slug:\*\* \`DROPBOX\_DELETE\_FILE\_REQUESTS\`

Tool to delete a batch of closed file requests in Dropbox. Use when you need to remove multiple file requests that are no longer needed. Only closed file requests can be deleted; attempting to delete open file requests will fail.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| array \| Yes \| List of file request IDs to delete. Only closed file requests can be deleted. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete manual contacts batch

\*\*Slug:\*\* \`DROPBOX\_DELETE\_MANUAL\_CONTACTS\_BATCH\`

Tool to delete specific manually added contacts from Dropbox by their email addresses. Use when you need to remove contacts that were manually added to a user's Dropbox account.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`email\_addresses\` \| array \| Yes \| List of email addresses of manually added contacts to delete. Must be valid email addresses. \|
\| \`dropbox\_api\_select\_user\` \| string \| No \| Team member ID (format: dbmid:...) to specify which team member's contacts to delete. Required when using team OAuth tokens. Optional for individual accounts. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Permanently delete archived team folder

\*\*Slug:\*\* \`DROPBOX\_DELETE\_TEAM\_FOLDER\_PERMANENTLY\`

Tool to permanently delete an archived team folder in Dropbox. Use when you need to permanently remove an archived team folder and all its contents. The team folder must be archived before it can be permanently deleted.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\_folder\_id\` \| string \| Yes \| The ID of the team folder to permanently delete. The team folder must be archived before it can be permanently deleted. You can get this from list team folders action. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete team group

\*\*Slug:\*\* \`DROPBOX\_DELETE\_TEAM\_GROUP\`

Tool to delete a Dropbox team group. Use when you need to remove a team group. Note that this requires team admin permissions and the group cannot be system-managed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`group\_id\` \| string \| No \| The Dropbox group ID. Required when selector\_type is 'group\_id'. Example: 'g:e18cdeb8c1e9c0280000000000000053' \|
\| \`selector\_type\` \| string ("group\_id" \| "group\_external\_id") \| Yes \| The type of selector to use for identifying the group. 'group\_id' - Select group by Dropbox group ID. 'group\_external\_id' - Select group by external ID. \|
\| \`group\_external\_id\` \| string \| No \| The external ID of the group. Required when selector\_type is 'group\_external\_id'. This is the ID from an external system that has been associated with the Dropbox group. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete team member profile photo

\*\*Slug:\*\* \`DROPBOX\_DELETE\_TEAM\_MEMBER\_PROFILE\_PHOTO\`

Tool to delete a team member's profile photo. Use when you need to remove the profile picture of a team member. Requires team admin permissions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| object \| Yes \| The team member whose profile photo should be deleted. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete team members secondary emails

\*\*Slug:\*\* \`DROPBOX\_DELETE\_TEAM\_MEMBERS\_SECONDARY\_EMAILS\`

Tool to delete secondary email addresses from Dropbox team members. Use when you need to remove secondary emails from one or more team members. Requires team member management permissions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`emails\_to\_delete\` \| array \| Yes \| List of users and their secondary emails to delete. Each entry specifies a user and which secondary emails to remove from that user \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Download Folder as Zip

\*\*Slug:\*\* \`DROPBOX\_DOWNLOAD\_ZIP\`

Tool to download a folder from Dropbox as a zip file. Use when you need to download an entire folder structure with multiple files. The folder must be less than 20 GB in size with any single file less than 4 GB, and the resulting zip must have fewer than 10,000 total entries.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| The path to the folder to download as a zip file. Must be a folder path, not a single file. The folder must be less than 20 GB in size with any single file less than 4 GB. The resulting zip must have fewer than 10,000 total file and folder entries. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Export File

\*\*Slug:\*\* \`DROPBOX\_EXPORT\_FILE\`

Tool to export non-downloadable Dropbox files (especially Dropbox Paper) to Markdown/HTML/plain text and return usable content. Use when you need to access content from files that cannot be downloaded directly, such as Dropbox Paper documents or Google Docs stored in Dropbox. Requires files.content.read scope.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mode\` \| string ("return\_text" \| "store\_and\_link") \| No \| 'return\_text': return exported text directly (truncated safely if very large). 'store\_and\_link': create a temporary Dropbox download link to the original file. \|
\| \`path\` \| string \| Yes \| The path of the file to be exported. Supports Dropbox path (e.g., '/folder/file.paper'), id:..., rev:..., or ns:... notation. Use this for non-downloadable files like Dropbox Paper documents. \|
\| \`export\_format\` \| string \| No \| The file format to export to. Common values: 'markdown', 'html', 'plain\_text'. If not specified, the default format for the file type will be used. For Dropbox Paper, default is 'markdown'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search files and folders

\*\*Slug:\*\* \`DROPBOX\_FILES\_SEARCH\`

Tool to search for files and folders in Dropbox by name or content. Use when you need to find items matching a search query within a specific path or across the entire Dropbox.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mode\` \| string ("filename" \| "filename\_and\_content" \| "deleted\_filename") \| No \| Search mode for Dropbox files search. \|
\| \`path\` \| string \| No \| The path in the user's Dropbox to search. Should probably be a folder. Use empty string to search the entire Dropbox. \|
\| \`query\` \| string \| Yes \| The string to search for. The search string is split on spaces into multiple tokens. For file name searching, the last token is used for prefix matching (e.g., 'bat c' matches 'bat cave' but not 'batman car'). \|
\| \`start\` \| integer \| No \| The starting index within the search results (used for paging). Default is 0. \|
\| \`max\_results\` \| integer \| No \| The maximum number of search results to return. Default is 100, max is 1000. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Finish upload session

\*\*Slug:\*\* \`DROPBOX\_FINISH\_UPLOAD\_SESSION\`

Tool to finish an upload session and save the uploaded data to the given file path. Use when completing a multi-part upload after using upload\_session/start and upload\_session/append. A single request should not upload more than 150 MiB. The maximum size of a file one can upload to an upload session is 2,199,019,061,248 bytes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`commit\` \| object \| Yes \| Contains the path and other optional modifiers for the commit. \|
\| \`cursor\` \| object \| Yes \| Cursor information containing the session\_id and current offset in bytes. \|
\| \`content\` \| object \| No \| Final file data to append before finishing the session. Can be omitted if no additional data needs to be appended. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Finish batch upload sessions

\*\*Slug:\*\* \`DROPBOX\_FINISH\_UPLOAD\_SESSION\_BATCH\`

Tool to commit many files at once into a user's Dropbox after uploading file contents via upload\_session/start and upload\_session/append. Use when you need to finish multiple upload sessions in a single request. Returns an async\_job\_id which can be used with upload\_session/finish\_batch/check to poll for completion. Maximum 1000 entries per request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`entries\` \| array \| Yes \| List of upload sessions to finish. Each entry contains cursor information and commit parameters. Maximum 1000 entries per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get about me

\*\*Slug:\*\* \`DROPBOX\_GET\_ABOUT\_ME\`

Tool to get information about the current user's Dropbox account. Use when you need to retrieve account details like email, name, or account type. Useful for verifying authenticated account identity before destructive operations in multi-account setups. Note: successful response does not imply access to all shared or team folders; path-specific permission errors from other tools indicate missing folder-level permissions, not empty results.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get account

\*\*Slug:\*\* \`DROPBOX\_GET\_ACCOUNT\`

Tool to get information about a user's Dropbox account using their account ID. Use when you need to retrieve account details for a specific user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`account\_id\` \| string \| Yes \| A user's account identifier. Can be obtained from get\_current\_account endpoint. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get account batch

\*\*Slug:\*\* \`DROPBOX\_GET\_ACCOUNT\_BATCH\`

Tool to get information about multiple user accounts in a single request. At most 300 accounts may be queried per request. Use when you need to retrieve details for multiple Dropbox users efficiently.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`account\_ids\` \| array \| Yes \| List of user account identifiers. Should not contain any duplicate account IDs. Maximum 300 accounts per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get available team member roles

\*\*Slug:\*\* \`DROPBOX\_GET\_AVAILABLE\_TEAM\_MEMBER\_ROLES\`

Tool to retrieve all available team member roles for the connected Dropbox team. Use when you need to discover what roles can be assigned to team members (e.g., Team, Billing, Report, Content, Security, User management, Support).

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get copy reference

\*\*Slug:\*\* \`DROPBOX\_GET\_COPY\_REFERENCE\`

Tool to get a copy reference to a file or folder. Use when you need to generate a reference string that can be used to copy the file or folder to another user's Dropbox via copy\_reference/save.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| The path to the file or folder you want to get a copy reference to. This path is case-sensitive. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get file lock batch

\*\*Slug:\*\* \`DROPBOX\_GET\_FILE\_LOCK\_BATCH\`

Tool to return lock metadata for multiple files in a single batch request. Use when you need to check the lock status of up to 1000 files at once.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`entries\` \| array \| Yes \| List of files to check lock status for. Maximum 1000 entries per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get shared file metadata batch

\*\*Slug:\*\* \`DROPBOX\_GET\_FILE\_METADATA\_BATCH\`

Tool to retrieve metadata for multiple shared files in a single batch request. Use when you need to get information about shared file permissions, access levels, owners, and sharing policies for multiple files at once.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`files\` \| array \| Yes \| List of files to query. Each can be a file ID (e.g., 'id:7bh4zBmgZoAAAAAAAAAAFg') or a path (e.g., '/path/to/file.txt'). Maximum 100 files per request. \|
\| \`actions\` \| array \| No \| A list of FileActions corresponding to FilePermissions that should appear in the response's permissions field describing the actions the authenticated user can perform on the files. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get file preview

\*\*Slug:\*\* \`DROPBOX\_GET\_FILE\_PREVIEW\`

Tool to get a preview for a file. PDF previews are generated for document formats (.ai, .doc, .docx, .eps, .ppt, .pptx, etc.), and HTML previews are generated for spreadsheet formats (.csv, .xls, .xlsx, etc.). Use when you need to view file content without downloading the original file. Returns error for unsupported file types.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| The path of the file to preview. Supported preview formats: PDF previews (.ai, .doc, .docm, .docx, .eps, .gdoc, .gslides, .odp, .odt, .pps, .ppsm, .ppsx, .ppt, .pptm, .pptx, .rtf); HTML previews (.csv, .ods, .xls, .xlsm, .gsheet, .xlsx). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get file request details

\*\*Slug:\*\* \`DROPBOX\_GET\_FILE\_REQUEST\`

Tool to retrieve details of an existing file request by ID. Use when you need to check the status, URL, deadline, or other details of a specific file request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The ID of the file request to retrieve. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get file or folder tags

\*\*Slug:\*\* \`DROPBOX\_GET\_FILE\_TAGS\`

Tool to get list of tags assigned to files or folders in Dropbox. Use when you need to retrieve tags for one or more items. This endpoint does not support apps with the app folder permission.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`paths\` \| array \| Yes \| List of file or folder paths to get tags for (e.g., \["/Documents/report.pdf", "/Photos/image.jpg"\]). Maximum of 1000 paths per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get folder state cursor

\*\*Slug:\*\* \`DROPBOX\_GET\_FOLDER\_CURSOR\`

Tool to get a cursor representing the current state of a folder without listing its contents. Use when you only need to track future changes to a folder, not retrieve existing files. This is more efficient than list\_folder for setting up change monitoring or sync functionality.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| No \| The path to the folder. Use "" (empty string) for the root folder, or a path like "/folder/subfolder". Also accepts folder IDs (e.g., "id:abc123xyz"). \|
\| \`limit\` \| integer \| No \| The maximum number of results to return per request when using this cursor with list\_folder/continue. If not specified, the API uses a default. \|
\| \`recursive\` \| boolean \| No \| If true, the cursor will include all subfolders and their contents recursively. If false, only the immediate contents are tracked. \|
\| \`shared\_link\` \| object \| No \| Shared link information for listing folder contents. \|
\| \`include\_deleted\` \| boolean \| No \| If true, deleted files and folders will be included when using this cursor to track changes. \|
\| \`include\_media\_info\` \| boolean \| No \| If true, media metadata (dimensions, location, etc.) will be included for photo and video files when using this cursor. \|
\| \`include\_mounted\_folders\` \| boolean \| No \| If true, results will include entries under mounted folders (app folders, shared folders, team folders). \|
\| \`include\_property\_groups\` \| object \| No \| Template filter for property groups. \|
\| \`include\_has\_explicit\_shared\_members\` \| boolean \| No \| If true, results will include a flag indicating whether each file or folder has explicit shared members. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get JWKS

\*\*Slug:\*\* \`DROPBOX\_GET\_JWKS\`

Tool to retrieve JSON Web Key Set containing public verification keys for Dropbox signed ID tokens. Use when you need to verify JWT signatures from Dropbox OpenID Connect authentication.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get file or folder metadata

\*\*Slug:\*\* \`DROPBOX\_GET\_METADATA\`

Tool to fetch metadata for a file or folder by path. Use when you need to verify existence, get canonical identifiers (id, path\_display), determine type (.tag), or retrieve detailed attributes without enumerating folder contents.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| The path of a file or folder on Dropbox (e.g., "/Documents/report.pdf"). Note: The root folder ("" or "/") is not supported by this endpoint. \|
\| \`include\_deleted\` \| boolean \| No \| If true, DeletedMetadata will be returned for deleted files or folders. Otherwise, deleted items will return an error. \|
\| \`include\_media\_info\` \| boolean \| No \| If true, FileMetadata.media\_info is set for photo and video files, providing additional metadata like dimensions and location. \|
\| \`include\_has\_explicit\_shared\_members\` \| boolean \| No \| If true, the result will include a flag indicating whether the file has any explicit shared members. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get file or folder metadata (alpha)

\*\*Slug:\*\* \`DROPBOX\_GET\_METADATA\_ALPHA\`

Tool to fetch metadata for a file or folder using the alpha endpoint. Use when you need metadata with advanced property filtering or custom property template support.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| The path of a file or folder on Dropbox (e.g., "/Documents/report.pdf"). Use "" or "/" for the root folder. \|
\| \`include\_deleted\` \| boolean \| No \| If true, DeletedMetadata will be returned for deleted files or folders. Otherwise, deleted items will return an error. \|
\| \`include\_media\_info\` \| boolean \| No \| If true, FileMetadata.media\_info is set for photo and video files, providing additional metadata like dimensions and location. \|
\| \`include\_property\_groups\` \| object \| No \| Filter for property template IDs. \|
\| \`include\_has\_explicit\_shared\_members\` \| boolean \| No \| If true, the result will include a flag indicating whether the file has any explicit shared members. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get OpenID config

\*\*Slug:\*\* \`DROPBOX\_GET\_OPENID\_CONFIG\`

Tool to retrieve Dropbox's OpenID Connect discovery document describing supported OAuth 2.0 and OIDC parameters. Use when you need to discover Dropbox's OAuth configuration endpoints and capabilities.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get shared file metadata

\*\*Slug:\*\* \`DROPBOX\_GET\_SHARED\_FILE\_METADATA\`

Tool to retrieve metadata for a shared file in Dropbox. Use when you need to get information about a shared file's permissions, access levels, owner, and sharing policies.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\` \| string \| Yes \| The file to query. Can be a file ID (e.g., 'id:7bh4zBmgZoAAAAAAAAAAFg') or a path. \|
\| \`actions\` \| array \| No \| A list of FileActions corresponding to FilePermissions that should appear in the response's permissions field describing the actions the authenticated user can perform on the file. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get shared folder metadata

\*\*Slug:\*\* \`DROPBOX\_GET\_SHARED\_FOLDER\_METADATA\`

Tool to retrieve metadata for a specific shared folder by its ID. Use when you need detailed information about a shared folder including access level, policies, owner, paths, and permissions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`actions\` \| array \| No \| A list of FolderActions corresponding to FolderPermissions that should appear in the response's permissions field describing the actions the authenticated user can perform on the folder \|
\| \`shared\_folder\_id\` \| string \| Yes \| The ID for the shared folder \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Download file from shared link

\*\*Slug:\*\* \`DROPBOX\_GET\_SHARED\_LINK\_FILE\`

Tool to download a file from a Dropbox shared link. Use when you have a shared link URL and need to retrieve the actual file content. This endpoint works with shared links to files; for shared links to folders, use the path parameter to specify which file within the folder to download.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| Yes \| URL of the shared link to download the file from. \|
\| \`path\` \| string \| No \| If the shared link is to a folder, this parameter can be used to retrieve a specific file or sub-folder in this folder. Path must start with '/'. \|
\| \`link\_password\` \| string \| No \| If the shared link has a password, this parameter can be used to provide it. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get shared link metadata

\*\*Slug:\*\* \`DROPBOX\_GET\_SHARED\_LINK\_METADATA\`

Tool to resolve a Dropbox shared link URL into structured metadata. Use when the user provides a shared link and you need to determine what it points to (file vs folder) and obtain canonical identifiers (id, path) to enable follow-on operations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| Yes \| The shared link URL to retrieve metadata for. \|
\| \`path\` \| string \| No \| If the shared link is to a folder, this parameter can be used to retrieve metadata for a specific file or sub-folder in this folder. A relative path should be used. \|
\| \`link\_password\` \| string \| No \| If the shared link has a password, this parameter can be used to provide it. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get space usage

\*\*Slug:\*\* \`DROPBOX\_GET\_SPACE\_USAGE\`

Tool to get space usage information for the current user's Dropbox account. Use when you need to check storage usage, available space, or quota information.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get team feature values

\*\*Slug:\*\* \`DROPBOX\_GET\_TEAM\_FEATURE\_VALUES\`

Tool to get values for one or more team features. Use when you need to check team capabilities like upload rate limits, shared team root availability, file events, or selective sync status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`features\` \| array \| Yes \| A list of features to get values for. At least one feature must be included. Available features: 'upload\_api\_rate\_limit', 'has\_team\_shared\_dropbox', 'has\_team\_file\_events', 'has\_team\_selective\_sync'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get team folder info

\*\*Slug:\*\* \`DROPBOX\_GET\_TEAM\_FOLDER\_INFO\`

Tool to retrieve metadata for team folders. Returns information about folder status, sync settings, and properties for the specified team folder IDs. Use when you need to check the status or configuration of one or more team folders.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\_folder\_ids\` \| array \| Yes \| The list of team folder IDs to retrieve metadata for. Must contain at least one ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get team groups info

\*\*Slug:\*\* \`DROPBOX\_GET\_TEAM\_GROUPS\_INFO\`

Tool to retrieve information about one or more team groups by their IDs or external IDs. Use when you need to get details about specific groups including name, member count, management type, and creation time.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`group\_ids\` \| array \| No \| List of Dropbox group IDs. Required when selector\_type is 'group\_ids'. Example: \['g:e18cdeb8c1e9c0280000000000000053', 'g:e18cdeb8c1e9c0280000000000000054'\] \|
\| \`selector\_type\` \| string ("group\_ids" \| "group\_external\_ids") \| Yes \| The type of selector to use for identifying groups. 'group\_ids' - Select groups by Dropbox group IDs. 'group\_external\_ids' - Select groups by external IDs. \|
\| \`group\_external\_ids\` \| array \| No \| List of external group IDs. Required when selector\_type is 'group\_external\_ids'. These are IDs from an external system that have been associated with Dropbox groups. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get team groups job status

\*\*Slug:\*\* \`DROPBOX\_GET\_TEAM\_GROUPS\_JOB\_STATUS\`

Tool to check the status of an asynchronous team groups job in Dropbox. Use when you have an async\_job\_id from a previous team groups operation (like groups\_delete) and need to poll its completion status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`async\_job\_id\` \| string \| Yes \| Id of the asynchronous job. This is the value of a response returned from the method that launched the job (e.g., from team\_groups\_delete). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get team info

\*\*Slug:\*\* \`DROPBOX\_GET\_TEAM\_INFO\`

Tool to retrieve information about a Dropbox team. Use when you need to get team details such as team name, ID, licensed user counts, or team policies.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get team audit log events

\*\*Slug:\*\* \`DROPBOX\_GET\_TEAM\_LOG\_EVENTS\`

Tool to retrieve team audit log events from Dropbox. Use when you need to access team activity logs, audit trails, or monitor team events. Supports filtering by time range and event category, with pagination for large result sets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`time\` \| object \| No \| Time range filter for events. \|
\| \`limit\` \| integer \| No \| Maximum number of events to return per request. Default is 1000, maximum is 1000. \|
\| \`cursor\` \| string \| No \| Cursor for pagination, obtained from a previous response. Use this to retrieve the next page of results. \|
\| \`category\` \| string \| No \| Event category filter to limit results (e.g., 'apps', 'devices', 'domains', 'file\_operations', 'file\_requests', 'groups', 'logins', 'members', 'paper', 'passwords', 'sharing', 'team\_folders', 'team\_policies'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get team log events (continue)

\*\*Slug:\*\* \`DROPBOX\_GET\_TEAM\_LOG\_EVENTS\_CONTINUE\`

Tool to paginate through team audit log events using a cursor from team\_log/get\_events. Use when you have a cursor from a previous call and need to retrieve the next batch of team events.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor returned by a previous call to team\_log/get\_events or team\_log/get\_events/continue. This cursor is used to paginate through all team events. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get team member custom quota

\*\*Slug:\*\* \`DROPBOX\_GET\_TEAM\_MEMBER\_CUSTOM\_QUOTA\`

Tool to retrieve custom storage quotas for team members. Use when you need to check which team members have custom quota allocations and their quota amounts. Requires team admin credentials.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`users\` \| array \| No \| List of team member identifiers to retrieve custom quota for. Each member must be identified by exactly one of: team\_member\_id, external\_id, or email. Maximum of 1000 users per request. An empty list returns all users with custom quotas. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get team members add job status v2

\*\*Slug:\*\* \`DROPBOX\_GET\_TEAM\_MEMBERS\_ADD\_JOB\_STATUS\`

Tool to poll the status of an asynchronous team member addition job. Use when you have an async\_job\_id from team/members/add\_v2 and need to check if the member addition has completed. Returns 'in\_progress', 'complete' with per-member results, or 'failed' with error details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`async\_job\_id\` \| string \| Yes \| Id of the asynchronous job returned from team/members/add\_v2. This is used to poll the status of the asynchronous request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get team members info

\*\*Slug:\*\* \`DROPBOX\_GET\_TEAM\_MEMBERS\_INFO\`

Tool to retrieve information about multiple team members in a single request. Use when you need to get details like email, name, status, role, and account information for one or more team members. Requires team admin credentials.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`members\` \| array \| Yes \| List of team member identifiers to retrieve information for. Each member must be identified by exactly one of: team\_member\_id, external\_id, or email. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get property template for team

\*\*Slug:\*\* \`DROPBOX\_GET\_TEAM\_PROPERTIES\_TEMPLATE\`

Tool to get the schema for a specified property template for a team. Use when you need to retrieve the structure and field definitions of a team property template.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`template\_id\` \| string \| Yes \| An identifier for a template added by route templates/add\_for\_user or templates/add\_for\_team. Typically in the format 'ptid:XXXXX'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get temporary link

\*\*Slug:\*\* \`DROPBOX\_GET\_TEMPORARY\_LINK\`

Tool to get a one-click temporary (expiring) download link. Use when you need to share a Dropbox file directly without proxying content through this service. Only works for files, not folders. Returned URLs expire within hours and must be regenerated for future use; never treat them as permanent links. Requires \`files.content.read\` scope.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| The path or identifier of the file to get a temporary link for. Supports Dropbox path (e.g., '/folder/file.txt'), id:..., rev:..., or ns:... notation. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get temporary upload link

\*\*Slug:\*\* \`DROPBOX\_GET\_TEMPORARY\_UPLOAD\_LINK\`

Tool to get a one-time use temporary upload link to upload a file to Dropbox. Use when you need to perform a delayed upload where the file will be uploaded to the returned link via POST with Content-Type: application/octet-stream. The upload link is valid for up to 4 hours.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`duration\` \| integer \| No \| Link validity period in seconds. Maximum is 4 hours (14400 seconds). \|
\| \`commit\_info\` \| object \| Yes \| Upload configuration specifying destination path and upload behavior. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get thumbnail

\*\*Slug:\*\* \`DROPBOX\_GET\_THUMBNAIL\`

Tool to get a thumbnail for an image file. Use when you need to generate a thumbnail preview of an image. Supports jpg, jpeg, png, tiff, tif, gif, webp, ppm, and bmp files under 20MB.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mode\` \| string ("strict" \| "bestfit" \| "fitone\_bestfit") \| No \| How to resize and crop the image. 'strict': scale down to fit within the given size. 'bestfit': scale down to fit within size or its transpose. 'fitone\_bestfit': scale down to completely cover size or its transpose. \|
\| \`path\` \| string \| Yes \| The path to the image file you want to thumbnail. Must start with '/'. \|
\| \`size\` \| string ("w32h32" \| "w64h64" \| "w128h128" \| "w256h256" \| "w480h320" \| "w640h480" \| "w960h640" \| "w1024h768" \| "w2048h1536") \| No \| The size for the thumbnail image. Options range from 32x32 pixels to 2048x1536 pixels. \|
\| \`format\` \| string ("jpeg" \| "png") \| No \| The format for the thumbnail image. Use 'jpeg' for photos (default), 'png' for screenshots and digital arts. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get thumbnail batch

\*\*Slug:\*\* \`DROPBOX\_GET\_THUMBNAIL\_BATCH\`

Tool to get thumbnails for multiple image files in a single batch request. Use when you need to generate thumbnail previews for up to 25 images at once. Supports jpg, jpeg, png, tiff, tif, gif, webp, ppm, and bmp files under 20MB.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`entries\` \| array \| Yes \| List of files to get thumbnails for. Maximum 25 entries per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get thumbnail v2

\*\*Slug:\*\* \`DROPBOX\_GET\_THUMBNAIL\_V2\`

Tool to get a thumbnail for an image file. Use when you need to generate a thumbnail preview of an image. Supports jpg, jpeg, png, tiff, tif, gif, webp, ppm, and bmp files under 20MB. Can access files via direct path or shared link.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| No \| The shared link URL (required when resource\_type is 'link'). \|
\| \`mode\` \| string ("strict" \| "bestfit" \| "fitone\_bestfit") \| No \| How to resize and crop the image. 'strict': scale down to fit within the given size. 'bestfit': scale down to fit within size or its transpose. 'fitone\_bestfit': scale down to completely cover size or its transpose. \|
\| \`path\` \| string \| No \| The path to the image file (required when resource\_type is 'path'). Must start with '/'. \|
\| \`size\` \| string ("w32h32" \| "w64h64" \| "w128h128" \| "w256h256" \| "w480h320" \| "w640h480" \| "w960h640" \| "w1024h768" \| "w2048h1536") \| No \| The size for the thumbnail image. Options range from 32x32 pixels to 2048x1536 pixels. \|
\| \`format\` \| string ("jpeg" \| "png") \| No \| The format for the thumbnail image. Use 'jpeg' for photos, 'png' for screenshots and digital arts. \|
\| \`link\_path\` \| string \| No \| Optional relative path within shared folder (only used with resource\_type='link' when link points to a folder). \|
\| \`resource\_type\` \| string ("path" \| "link") \| Yes \| Type of resource: 'path' for direct file path or 'link' for shared link. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get user features

\*\*Slug:\*\* \`DROPBOX\_GET\_USER\_FEATURES\`

Tool to get a list of feature values configured for the current Dropbox account. Use when you need to check which features are enabled, such as paper\_as\_files or file\_locking.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`features\` \| array \| Yes \| A list of features to get values for. Available features: 'paper\_as\_files' (information about how Paper files are stored), 'file\_locking' (whether users can lock files in shared directories). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List member space limits excluded users (continue)

\*\*Slug:\*\* \`DROPBOX\_LIST\_EXCLUDED\_USERS\_CONTINUE\`

Tool to paginate through team members excluded from space limits using a cursor from a previous list call. Use when you have a cursor from the initial excluded users list endpoint and need to retrieve the next batch of excluded team members.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor returned by a previous call to list member space limits excluded users. This cursor is used to paginate through all excluded users. Must come from a previous call to /2/team/member\_space\_limits/excluded\_users/list or /2/team/member\_space\_limits/excluded\_users/list/continue. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List file members

\*\*Slug:\*\* \`DROPBOX\_LIST\_FILE\_MEMBERS\`

Tool to obtain the members who have been invited to a file, both inherited and uninherited members. Use when you need to retrieve detailed information about users, groups, and invitees with access to a specific file, including their access levels and permissions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\` \| string \| Yes \| The file for which you want to see members. Can be a file ID (starting with 'id:') or a file path (starting with '/'). \|
\| \`limit\` \| integer \| No \| Number of members to return max per query. Must be between 1 and 300. \|
\| \`actions\` \| array \| No \| The actions for which to return permissions on a member. Valid values: 'leave\_a\_copy', 'make\_editor', 'make\_owner', 'make\_viewer', 'make\_viewer\_no\_comment', 'remove'. \|
\| \`include\_inherited\` \| boolean \| No \| Whether to include members who only have access from a parent shared folder. Defaults to true. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List file members batch

\*\*Slug:\*\* \`DROPBOX\_LIST\_FILE\_MEMBERS\_BATCH\`

Tool to get members of multiple files at once. Use when you need to retrieve sharing information for multiple files in a single request. Returns users, groups, and invitees with access to each file, but does not include inherited members or detailed permissions. For more detailed results, use the individual file member endpoint.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`files\` \| array \| Yes \| Files for which to return members. Can be file IDs (starting with 'id:') or paths (starting with '/'). Maximum 100 files per request. \|
\| \`limit\` \| integer \| No \| Number of members to return max per query per file. Defaults to 10 if not specified. Maximum 20. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List file requests

\*\*Slug:\*\* \`DROPBOX\_LIST\_FILE\_REQUESTS\`

Tool to list all file requests owned by the current user. Use when you need to see existing file requests, their status, and details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of file requests to return. Default: 1000. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List file requests (continue)

\*\*Slug:\*\* \`DROPBOX\_LIST\_FILE\_REQUESTS\_CONTINUE\`

Tool to paginate through file requests using a cursor from a previous list call. Use when you have a cursor from /2/file\_requests/list or /2/file\_requests/list/continue and need to retrieve the next batch of file requests.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor returned by a previous call to list file requests. This cursor is used to paginate through all file requests. Must come from a previous call to /2/file\_requests/list or /2/file\_requests/list/continue. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List file revisions

\*\*Slug:\*\* \`DROPBOX\_LIST\_FILE\_REVISIONS\`

Tool to retrieve the revision history for a file. Use when you need to see past versions of a file, restore a previous version, or track changes over time.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mode\` \| object \| No \| Mode for listing revisions. \|
\| \`path\` \| string \| Yes \| The path to the file you want to see the revisions of (e.g., "/Documents/report.pdf"). Must be a valid file path in Dropbox. \|
\| \`limit\` \| integer \| No \| The maximum number of revision entries returned. Default is 10, minimum is 1, maximum is 100. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List files in folder

\*\*Slug:\*\* \`DROPBOX\_LIST\_FILES\_IN\_FOLDER\`

Tool to list files and folders in a specified Dropbox directory. Use when you need to see the contents of a folder, including subfolders if recursive is true. When the response contains \`has\_more=true\`, continue fetching with the returned cursor until \`has\_more=false\` — stopping early misses entries in large folders. Response entries include both files and folders; use the \`.tag\` field on each entry to distinguish item types.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| No \| The folder path (e.g., "/europe/invoices") or folder ID (e.g., "id:aBcDeFgH123") to list contents from. Use "" (empty string) for the root folder. No trailing slashes or whitespace allowed — malformed paths can silently produce empty results. Prefer paths from \`path\_display\` or \`path\_lower\` fields in prior API responses over manually constructed paths. \|
\| \`limit\` \| integer \| No \| The maximum number of results to return per request. Default is 2000. Max is 2000. \|
\| \`recursive\` \| boolean \| No \| If true, recursively lists contents of nested subfolders; otherwise, lists only immediate contents. Large or broad folder trees with recursive=true can produce very large responses and high latency; use only when full hierarchy is explicitly needed. \|
\| \`include\_deleted\` \| boolean \| No \| If true, includes deleted (but potentially recoverable) files and folders in the listing. \|
\| \`include\_media\_info\` \| boolean \| No \| If true, includes media metadata (e.g., dimensions, location) for photo and video files. \|
\| \`include\_non\_downloadable\_files\` \| boolean \| No \| If true, includes non-downloadable files (e.g., Google Docs, Dropbox Paper) in the listing. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List folder continue

\*\*Slug:\*\* \`DROPBOX\_LIST\_FOLDER\_CONTINUE\`

Tool to continue paginating through folder contents using a cursor from list\_folder. Use when has\_more is true to retrieve remaining entries.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor returned by your last call to list\_folder or list\_folder/continue. Use this to paginate through all files and retrieve updates to the folder. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List folder members

\*\*Slug:\*\* \`DROPBOX\_LIST\_FOLDER\_MEMBERS\`

Tool to list members of a shared folder, including users, groups, and invitees. Use when you need to retrieve information about who has access to a specific shared folder and their permission levels.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The maximum number of results that include members, groups and invitees to return per request \|
\| \`actions\` \| array \| No \| List indicating whether each returned member will include a boolean value showing if the current user can perform the MemberAction on the member. Valid values: 'leave\_a\_copy', 'make\_editor', 'make\_owner', 'make\_viewer', 'make\_viewer\_no\_comment', 'remove' \|
\| \`shared\_folder\_id\` \| string \| Yes \| The ID for the shared folder \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List folder members continue

\*\*Slug:\*\* \`DROPBOX\_LIST\_FOLDER\_MEMBERS\_CONTINUE\`

Tool to continue paginating through shared folder members using a cursor from list\_folder\_members. Use when cursor is present in list\_folder\_members response to retrieve remaining member entries.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor returned by your last call to list\_folder\_members or list\_folder\_members/continue. Use this to paginate through all shared folder members. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List folder contents (Deprecated)

\*\*Slug:\*\* \`DROPBOX\_LIST\_FOLDERS\`

DEPRECATED: Use ListFilesInFolder instead. Retrieves a list of folders, files, and deleted entries from a specified Dropbox path.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| No \| Path to the folder (e.g., "" for root, "/folder/subfolder", or "id:abc123xyz"). If a path string, it must start with / and not end with / or whitespace. \|
\| \`limit\` \| integer \| No \| Maximum number of folder entries to return per request; an approximate upper bound. \|
\| \`recursive\` \| boolean \| No \| Whether to include folders in nested subfolders (True) or only immediate subfolders (False) Combining with a high \`limit\` or broad \`path\` can yield very large responses; scope \`path\` narrowly to keep result sets manageable. \|
\| \`include\_deleted\` \| boolean \| No \| Whether to include folders that have been deleted but may be recoverable \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List shared folders continue

\*\*Slug:\*\* \`DROPBOX\_LIST\_FOLDERS\_CONTINUE\`

Tool to continue paginating through shared folders using a cursor from list\_folders. Use when the cursor is present in list\_folders response to retrieve remaining shared folder entries.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor returned by the previous call to list\_folders or list\_folders/continue. Use this to paginate through all shared folders. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List member linked apps

\*\*Slug:\*\* \`DROPBOX\_LIST\_MEMBER\_LINKED\_APPS\`

Tool to list all applications linked to a specific team member's account. Use when you need to audit or review which third-party applications have been authorized by a particular team member.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\_member\_id\` \| string \| Yes \| The team member ID. Can be obtained from team/members/list endpoint. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List excluded users from space limits

\*\*Slug:\*\* \`DROPBOX\_LIST\_MEMBER\_SPACE\_LIMITS\_EXCLUDED\_USERS\`

Tool to list team members excluded from space limits. Use when you need to view which users are exempt from storage quotas. This is a team-level operation requiring team admin authentication.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of results to return per call. If not specified, all excluded users will be returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List mountable folders

\*\*Slug:\*\* \`DROPBOX\_LIST\_MOUNTABLE\_FOLDERS\`

Tool to list all shared folders the current user can mount or unmount. Use when discovering mountable shared folders (unmounted folders can be identified by absence of path\_lower field). This endpoint does not support apps with the app folder permission.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of mountable folders to return per request. If not specified, the API will use its default limit. \|
\| \`actions\` \| array \| No \| List of FolderActions corresponding to FolderPermissions that should appear in the response's SharedFolderMetadata.permissions field, describing the actions the authenticated user can perform on the folder. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List mountable folders continue

\*\*Slug:\*\* \`DROPBOX\_LIST\_MOUNTABLE\_FOLDERS\_CONTINUE\`

Tool to paginate through mountable shared folders using a cursor. Use when you have a cursor from a previous call to list\_mountable\_folders or list\_mountable\_folders/continue and need to retrieve the next batch of folders.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor returned by a previous call to list\_mountable\_folders or list\_mountable\_folders/continue. Use this to paginate through all mountable shared folders. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Paper docs

\*\*Slug:\*\* \`DROPBOX\_LIST\_PAPER\_DOCS\`

Tool to return the list of all Paper docs according to filter and sort specifications. Use when you need to retrieve Paper document IDs for further operations. To iterate through full pagination, pass the cursor to docs/list/continue.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Size limit per batch. The maximum number of docs that can be retrieved per batch is 1000. Higher value results in invalid arguments error. \|
\| \`sort\_by\` \| string ("accessed" \| "modified" \| "created") \| No \| Allows user to specify how the Paper docs should be sorted. 'accessed' sorts by last accessed time, 'modified' sorts by last modified time, 'created' sorts by creation time. \|
\| \`filter\_by\` \| string ("docs\_accessed" \| "docs\_created") \| No \| Allows user to specify how the Paper docs should be filtered. 'docs\_accessed' fetches all Paper doc IDs that the user has ever accessed. 'docs\_created' fetches only the Paper doc IDs that the user has created. \|
\| \`sort\_order\` \| string ("ascending" \| "descending") \| No \| Allows user to specify the sort order of the result. 'ascending' sorts in ascending order, 'descending' sorts in descending order. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Paper documents (continue)

\*\*Slug:\*\* \`DROPBOX\_LIST\_PAPER\_DOCS\_CONTINUE\`

Tool to continue paginating through Paper documents using a cursor from paper/docs/list. Use when has\_more is true to retrieve remaining Paper documents. Note: This endpoint continues to work for older Paper content; check user features to determine Paper version.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor obtained from paper/docs/list or paper/docs/list/continue. Allows for pagination through all Paper documents. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List received files

\*\*Slug:\*\* \`DROPBOX\_LIST\_RECEIVED\_FILES\`

Tool to list all files shared with the current user. Returns files directly shared with the user but does not include files received via shared folders or unclaimed invitations. Use when discovering files that have been shared with the authenticated user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of files to return max per query. Defaults to 100 if no limit is specified. Must be between 1 and 300. \|
\| \`actions\` \| array \| No \| A list of FileActions corresponding to FilePermissions that should appear in the response's SharedFileMetadata.permissions field describing the actions the authenticated user can perform on the file. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List shared folders

\*\*Slug:\*\* \`DROPBOX\_LIST\_SHARED\_FOLDERS\`

Tool to list all shared folders the authenticated user has access to. Use when discovering shared or team-mounted folders that may not appear in a standard path listing. Returns metadata including folder name, ID, access level, and paths (if mounted).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of shared folders to return per request \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List shared links

\*\*Slug:\*\* \`DROPBOX\_LIST\_SHARED\_LINKS\`

Tool to list existing shared links for the current user, optionally filtered by path. Use when you need to discover or reuse existing shared links to avoid creating duplicates or to check what links already exist for a file or folder. Supports pagination via cursor for large result sets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| No \| The path to the file or folder to list shared links for. If omitted, returns all shared links for the current user. If provided, returns links that grant access to the specified path (including parent folder links unless direct\_only is true). Supports Dropbox path notation (e.g., '/folder/file.txt'). \|
\| \`cursor\` \| string \| No \| The cursor returned by a previous call to this endpoint. Use this to retrieve additional results when 'has\_more' is true. The API returns a maximum of ~200 links per call. \|
\| \`direct\_only\` \| boolean \| No \| If true, only return direct links to the specified path. If false or omitted, also include links to parent folders. Only relevant when 'path' is specified. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team sharing allowlist

\*\*Slug:\*\* \`DROPBOX\_LIST\_SHARING\_ALLOWLIST\`

Tool to list Approve List entries for a team from newest to oldest. Use when you need to retrieve allowed domains and emails for team sharing.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The number of entries to fetch at one time. Maximum and default is 1000. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team devices

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_DEVICES\`

Tool to list all device sessions of a team including web sessions, desktop clients, and mobile clients. Use when you need to audit team devices, view active sessions, or monitor device activity across the team. Supports pagination via cursor for large result sets. Requires team admin credentials.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| No \| Pagination cursor for retrieving additional results. At the first call to list\_team\_devices, the cursor shouldn't be passed. Then, if the result includes a cursor, subsequent requests should include the received cursor to retrieve the next sub-list of team devices. \|
\| \`include\_web\_sessions\` \| boolean \| No \| Whether to list web sessions of the team members. If omitted, defaults to the API's default behavior. \|
\| \`include\_mobile\_clients\` \| boolean \| No \| Whether to list mobile clients of the team members. If omitted, defaults to the API's default behavior. \|
\| \`include\_desktop\_clients\` \| boolean \| No \| Whether to list desktop clients of the team members. If omitted, defaults to the API's default behavior. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team folders

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_FOLDERS\`

Tool to list all team folders for a Dropbox Business team. Use when you need to discover team-wide folders or manage team folder access.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of team folders to return per request \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team folders continue

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_FOLDERS\_CONTINUE\`

Tool to continue paginating through team folders using a cursor from team\_folder/list. Use when the cursor is present in list\_team\_folders response to retrieve remaining team folder entries.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor returned by the previous call to team\_folder/list or team\_folder/list/continue. Use this to paginate through all team folders. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team group members

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_GROUP\_MEMBERS\`

Tool to list members of a Dropbox team group. Use when you need to retrieve the list of team members who belong to a specific group. Returns member profiles with email, status, and access information.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of members to return per request. Must be between 1 and 1000. \|
\| \`group\_id\` \| string \| No \| The Dropbox group ID. Required when selector\_type is 'group\_id'. Example: 'g:e18cdeb8c1e9c0280000000000000003' \|
\| \`selector\_type\` \| string ("group\_id" \| "group\_external\_id") \| Yes \| The type of selector to use for identifying the group. 'group\_id' - Select group by Dropbox group ID. 'group\_external\_id' - Select group by external ID. \|
\| \`group\_external\_id\` \| string \| No \| The external ID of the group. Required when selector\_type is 'group\_external\_id'. This is the ID from an external system that has been associated with the Dropbox group. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team groups

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_GROUPS\`

Tool to list all groups on a Dropbox team. Use when you need to see all team groups with their metadata including group ID, name, and member count.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of groups to return per call. If not specified, all groups are returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team groups continue

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_GROUPS\_CONTINUE\`

Tool to continue listing team groups using a cursor from team/groups/list. Use when you have a cursor from a previous team groups list call and need to retrieve the next batch of groups.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor returned by team/groups/list. Indicates from what point to get the next set of groups. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team group members continue

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_GROUPS\_MEMBERS\_CONTINUE\`

Tool to continue listing team group members using a cursor from team/groups/members/list. Use when you have a cursor from a previous group members list call and need to retrieve the next batch of members.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor returned by team/groups/members/list. Indicates from what point to get the next set of group members. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List members linked apps

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_LINKED\_APPS\`

Tool to list all applications linked to team members' accounts. Use when you need to audit or review which third-party applications have been authorized by team members. Supports pagination for large teams.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| No \| At the first call, the cursor shouldn't be passed. Then, if the result includes a cursor, subsequent requests should include the received cursor to receive the next sub-list of team applications. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team member devices

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_MEMBER\_DEVICES\`

Tool to list all device sessions of a team's member, including web sessions, desktop clients, and mobile clients. Use when you need to retrieve information about a team member's active devices and sessions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\_member\_id\` \| string \| Yes \| The team's member id. Can be obtained from team/members/list endpoint. \|
\| \`include\_web\_sessions\` \| boolean \| No \| Whether to list web sessions of the team's member. Defaults to true. \|
\| \`include\_mobile\_clients\` \| boolean \| No \| Whether to list linked mobile devices of the team's member. Defaults to true. \|
\| \`include\_desktop\_clients\` \| boolean \| No \| Whether to list linked desktop devices of the team's member. Defaults to true. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team members

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_MEMBERS\`

Tool to list members of a Dropbox team. Use when you need to retrieve information about team members, including their status, roles, and contact details. Supports pagination for teams with many members.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of results to return per call. Maximum is 1000. If not specified, the server will use a default value. \|
\| \`include\_removed\` \| boolean \| No \| Whether to return members who have been removed from the team. If true, includes removed members in the results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team members continue (v2)

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_MEMBERS\_CONTINUE\`

Tool to continue listing team members using a cursor from team/members/list or team/members/list/continue\_v2. Use when you have a cursor from a previous team members list call and need to retrieve the next batch of members.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor returned by team/members/list or team/members/list/continue\_v2. Indicates from what point to get the next set of members. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team namespaces

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_NAMESPACES\`

Tool to list all team-accessible namespaces in a Dropbox Business team. Use when you need to discover team folders, shared folders, member home namespaces, or app folders accessible to the team.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Specifying a value here has no effect. The parameter is included for API compatibility but is not functional. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team namespaces continue

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_NAMESPACES\_CONTINUE\`

Tool to continue paginating through team-accessible namespaces using a cursor from team/namespaces/list. Use when you have a cursor and need to retrieve the next batch of team namespaces.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| Cursor returned by a previous call to team/namespaces/list or team/namespaces/list/continue. Use this to paginate through all team-accessible namespaces. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List team sharing allowlist continue

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEAM\_SHARING\_ALLOWLIST\_CONTINUE\`

Tool to continue paginating through team sharing allowlist entries using a cursor. Use when you have a cursor from a previous sharing\_allowlist/list or sharing\_allowlist/list/continue call and need to retrieve the next batch of allowed domains and emails.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor returned by a previous call to sharing\_allowlist/list or sharing\_allowlist/list/continue. Use this to paginate through all allowlist entries. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List property templates for team

\*\*Slug:\*\* \`DROPBOX\_LIST\_TEMPLATES\_FOR\_TEAM\`

Tool to list all property templates for a team. Use when you need to retrieve available custom file property templates at the team level. Requires a Dropbox Business account with team-level authentication.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List user templates

\*\*Slug:\*\* \`DROPBOX\_LIST\_USER\_TEMPLATES\`

Tool to get the template identifiers for a user. Use when you need to retrieve available custom file property templates that can be applied to files.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Modify shared link settings

\*\*Slug:\*\* \`DROPBOX\_MODIFY\_SHARED\_LINK\_SETTINGS\`

Tool to modify settings of an existing Dropbox shared link. Use when the user needs to change visibility, access permissions, expiration, or password settings for a shared link. Supports changing audience (public/team/private), access level (viewer/editor), expiration dates, and password protection.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| Yes \| The URL of the shared link to modify. This must be a valid Dropbox shared link URL. \|
\| \`settings\` \| object \| Yes \| The new settings to apply to the shared link. Only the specified fields will be updated; unspecified fields remain unchanged. \|
\| \`remove\_expiration\` \| boolean \| No \| If set to true, removes the expiration date from the shared link. This overrides any 'expires' value in settings. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mount shared folder

\*\*Slug:\*\* \`DROPBOX\_MOUNT\_FOLDER\`

Tool to mount a shared folder for the current user after they have been added as a member. Once mounted, the shared folder will appear in their Dropbox. Use when a user needs to access a shared folder that has been shared with them but not yet mounted.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`shared\_folder\_id\` \| string \| Yes \| The ID of the shared folder to mount. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Move multiple files or folders in batch

\*\*Slug:\*\* \`DROPBOX\_MOVE\_BATCH\`

Tool to move multiple files or folders to different locations at once in Dropbox. Use when you need to relocate several items in a single operation. Note that case-only renaming is not supported. The operation may complete synchronously (returning status for each entry) or asynchronously (returning a job ID to check later with move\_batch/check:2).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`entries\` \| array \| Yes \| List of entries to be moved. Each entry specifies a from\_path and to\_path. Minimum 1 entry, maximum 1000 entries. \|
\| \`autorename\` \| boolean \| No \| If there's a conflict with any file, have the Dropbox server try to autorename that file to avoid the conflict. The default is false. \|
\| \`allow\_ownership\_transfer\` \| boolean \| No \| Allow moves by owner even if it would result in an ownership transfer for the content being moved. The default is false. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Move file or folder

\*\*Slug:\*\* \`DROPBOX\_MOVE\_FILE\_OR\_FOLDER\`

Move file or folder

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`to\_path\` \| string \| Yes \| Path in the user's Dropbox that is the destination. This path is case-sensitive. \|
\| \`from\_path\` \| string \| Yes \| Path in the user's Dropbox to be moved. This path is case-sensitive. Use canonical paths from metadata (path\_display or path\_lower) rather than manually constructed strings to avoid path/not\_found errors. \|
\| \`autorename\` \| boolean \| No \| If there's a conflict (e.g., a file with the same name already exists at the destination), have the Dropbox server try to auto-rename the file to avoid the conflict. The default is false. Leaving this false will cause the call to fail outright when a name conflict exists at the destination. \|
\| \`allow\_shared\_folder\` \| boolean \| No \| If true, allows moving shared folders. The default is false. \|
\| \`allow\_ownership\_transfer\` \| boolean \| No \| Allow moves by owner even if it would result in an ownership transfer for the content being moved. This does not apply to copies. The default is false. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Overwrite file properties

\*\*Slug:\*\* \`DROPBOX\_OVERWRITE\_FILE\_PROPERTIES\`

Tool to overwrite property groups associated with a file or folder. Use when you need to force apply or replace custom property values for specific templates on a file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| A unique identifier for the file or folder. Can be a path (e.g., '/test\_file.txt') or a file ID. \|
\| \`property\_groups\` \| array \| Yes \| The property groups to force apply. This operation will overwrite existing property groups for the specified templates. \|
\| \`Dropbox-API-Select-User\` \| string \| No \| Team member ID (format: dbmid:...) required when using team tokens. Specifies which team member's account to operate on. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Read a file

\*\*Slug:\*\* \`DROPBOX\_READ\_FILE\`

Downloads a file from the specified Dropbox path, requiring \`files.content.read\` scope. Response field \`file\_content\_bytes\` is base64-encoded binary; decode before saving or passing to libraries. Bursty reads may trigger HTTP 429; honor the \`Retry-After\` header.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| The path to search in Must be a canonical Dropbox path from \`path\_display\` or \`path\_lower\` in API results — hand-typed paths frequently cause not-found or 409 errors. Paths in shared/team folders may become invalid if items are moved or access is revoked. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove file member

\*\*Slug:\*\* \`DROPBOX\_REMOVE\_FILE\_MEMBER\`

Tool to remove a specified member from a file's sharing permissions. Use when you need to revoke a member's access to a shared file. Note: This does not support apps with the app folder permission.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\` \| string \| Yes \| File from which to remove members. Use the file ID in the format 'id:...' or the file path. \|
\| \`member\` \| object \| Yes \| Member to remove from this file. Specify either by email or dropbox\_id. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove File Properties

\*\*Slug:\*\* \`DROPBOX\_REMOVE\_FILE\_PROPERTIES\`

Tool to permanently remove specified property groups from a file or folder. Use when you need to delete custom properties associated with a file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| A unique identifier for the file or folder. This can be a path (e.g., '/test\_properties\_file.txt') or a file ID. \|
\| \`property\_template\_ids\` \| array \| Yes \| A list of identifiers for property templates to remove from the file. These are template IDs created by templates/add\_for\_user or templates/add\_for\_team. Use an empty list to remove all property groups. \|
\| \`Dropbox-API-Select-User\` \| string \| No \| Team member ID (format: dbmid:...) required when using team tokens. Specifies which team member's account to operate on. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove file properties template for team

\*\*Slug:\*\* \`DROPBOX\_REMOVE\_FILE\_PROPERTIES\_TEMPLATE\_FOR\_TEAM\`

Tool to remove a property template from a team. Use when you need to delete a file properties template that was previously added to the team.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`template\_id\` \| string \| Yes \| An identifier for a template created by templates/add\_for\_user or templates/add\_for\_team. Format: ptid:XXXX \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove tag from file or folder

\*\*Slug:\*\* \`DROPBOX\_REMOVE\_FILE\_TAG\`

Tool to remove a tag from a file or folder in Dropbox. Use when you need to delete or untag an existing tag from an item. The tag will be removed only if it exists on the specified path.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| Path to the file or folder to remove the tag from. Must start with a slash. \|
\| \`tag\_text\` \| string \| Yes \| The tag to remove. Will be automatically converted to lowercase letters by Dropbox. \|
\| \`Dropbox-API-Select-User\` \| string \| No \| Team member ID (format: dbmid:...) required when using team tokens. Specifies which team member's account to operate on. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove folder member

\*\*Slug:\*\* \`DROPBOX\_REMOVE\_FOLDER\_MEMBER\`

Tool to remove a member from a shared folder. Use when an owner or editor needs to revoke access for a user or group. The member can be identified by email or Dropbox ID. On success, the response is empty; on error, contains detailed error information.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`member\` \| object \| Yes \| The member to remove from the shared folder. Can be identified by email address or Dropbox ID \|
\| \`leave\_a\_copy\` \| boolean \| No \| If true, the removed user will keep their copy of the folder after it's unshared (if mounted). Otherwise, it will be removed from their Dropbox. Must be false when kicking a group \|
\| \`shared\_folder\_id\` \| string \| Yes \| The ID for the shared folder from which to remove the member \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove group members

\*\*Slug:\*\* \`DROPBOX\_REMOVE\_GROUP\_MEMBERS\`

Tool to remove members from a Dropbox team group. Use when you need to remove one or more users from a team group. Requires team admin permissions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`group\` \| object \| Yes \| The group from which users will be removed. Specify either by group\_id or group\_external\_id \|
\| \`users\` \| array \| Yes \| List of users to be removed from the group. Each user can be identified by team\_member\_id, external\_id, or email \|
\| \`return\_members\` \| boolean \| No \| Whether to return the list of members in the group after removal. Note that setting this to true may take a long time for large groups. Default is false \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove sharing allowlist

\*\*Slug:\*\* \`DROPBOX\_REMOVE\_SHARING\_ALLOWLIST\`

Tool to remove domains or email addresses from the team sharing allowlist. Use when team admins need to revoke approval for specific domains or emails. Requires team admin authentication. At least one of 'domains' or 'emails' must be provided, with a maximum of 1000 entries per call. Entries must already exist on the allowlist.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`emails\` \| array \| No \| List of email addresses to remove from the allowlist. Each email must be a valid string representation following RFC-5322/822 (e.g., 'user@example.com'). Entries must already exist on the allowlist. Maximum 1000 entries per call. At least one of 'domains' or 'emails' must be provided \|
\| \`domains\` \| array \| No \| List of domains to remove from the allowlist. Each domain must be a valid string representation following RFC-1034/5 (e.g., 'example.com', 'subdomain.example.org'). Entries must already exist on the allowlist. Maximum 1000 entries per call. At least one of 'domains' or 'emails' must be provided \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove team member custom quota

\*\*Slug:\*\* \`DROPBOX\_REMOVE\_TEAM\_MEMBER\_CUSTOM\_QUOTA\`

Tool to remove custom storage quota for team members, reverting them to the team's default quota. Use when you need to reset storage limits for specific team members. Requires team admin credentials.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`users\` \| array \| Yes \| List of users to remove custom quota from. Each user must be identified by exactly one of: team\_member\_id, external\_id, or email. Maximum of 1000 users per request \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove member space limits excluded users

\*\*Slug:\*\* \`DROPBOX\_REMOVE\_TEAM\_MEMBER\_SPACE\_LIMITS\_EXCLUDED\_USERS\`

Tool to remove users from the member space limits excluded users list. Use when you need to re-enable space limits for specific team members. Maximum of 1000 users per request. Requires team admin credentials.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`users\` \| array \| Yes \| List of users to be removed from the excluded users list. Maximum of 1000 users per request \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Rename team folder

\*\*Slug:\*\* \`DROPBOX\_RENAME\_TEAM\_FOLDER\`

Tool to rename an existing team folder in Dropbox. Use when you need to update the name of a team folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| New name for the team folder. \|
\| \`team\_folder\_id\` \| string \| Yes \| The ID of the team folder to rename. You can get this from list team folders action. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Resend secondary email verification

\*\*Slug:\*\* \`DROPBOX\_RESEND\_SECONDARY\_EMAIL\_VERIFICATION\`

Tool to resend secondary email verification emails to team members. Use when team members need verification emails resent for their secondary email addresses. Requires team admin credentials.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`emails\_to\_resend\` \| array \| Yes \| Collection of users paired with secondary emails needing verification resent. Each item contains the user identifier and list of secondary email addresses \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Restore file to specific revision

\*\*Slug:\*\* \`DROPBOX\_RESTORE\_FILE\`

Tool to restore a specific revision of a file to the given path in Dropbox. Use when you need to revert a file to a previous version using its revision identifier.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The revision to restore for the file. This is a unique identifier for a specific version of the file. \|
\| \`path\` \| string \| Yes \| The path to the file you want to restore in the user's Dropbox. Path is case-sensitive. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Revoke shared link

\*\*Slug:\*\* \`DROPBOX\_REVOKE\_SHARED\_LINK\`

Tool to revoke a Dropbox shared link. Use when you need to remove access to a file or folder by disabling its shared link. Note that revoking a direct link to a file may not fully prevent access if parent folders have active shared links.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| Yes \| The URL of the shared link to revoke. Can be any valid Dropbox shared link URL. Note: After revoking a link, the file may still be accessible if there are shared links to parent folders. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Save copy reference

\*\*Slug:\*\* \`DROPBOX\_SAVE\_COPY\_REFERENCE\`

Tool to save a copy reference to the user's Dropbox. Use when you have a copy reference (obtained from copy\_reference/get) and need to save it to a specific destination path.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| Path in the user's Dropbox that is the destination where the referenced file or folder will be saved. This path is case-sensitive and must start with '/'. \|
\| \`copy\_reference\` \| string \| Yes \| A copy reference returned by copy\_reference/get. This is an opaque string that can be used to save a file or folder to the user's Dropbox. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Save file from URL

\*\*Slug:\*\* \`DROPBOX\_SAVE\_URL\`

Tool to save a file to Dropbox directly from a public URL via server-side fetch. Use when you have a temporary or public link and want Dropbox to download it directly without local staging. The operation is asynchronous and may take up to 15 minutes for large files.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| Yes \| The URL to be saved. Must be a valid, publicly accessible URL. \|
\| \`path\` \| string \| Yes \| The path in Dropbox where the URL will be saved to (including filename). Must start with a slash. \|
\| \`wait\` \| boolean \| No \| If true, poll the job status until completion or timeout. If false, return the async\_job\_id immediately. \|
\| \`timeout\_seconds\` \| integer \| No \| Maximum time in seconds to wait for job completion when wait=true. Ignored if wait=false. \|
\| \`Dropbox-API-Select-User\` \| string \| No \| Team member ID (format: dbmid:...) required when using team tokens. Specifies which team member's account to operate on. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Continue Dropbox Search

\*\*Slug:\*\* \`DROPBOX\_SEARCH\_CONTINUE\`

Tool to fetch the next page of search results from a previous Dropbox search. Use when you have a cursor from a search operation and need to retrieve additional results. Note: search along with search\_continue can only retrieve a maximum of 10,000 matches total.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| Yes \| The cursor returned by your last call to search or search\_continue. Used to fetch the next page of results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search File or Folder

\*\*Slug:\*\* \`DROPBOX\_SEARCH\_FILE\_OR\_FOLDER\`

Tool to search for files and folders in Dropbox by name or content, optionally scoped to a path, with pagination support. Results paginate via cursor (up to 100 per page); check \`has\_more\` in the response and re-fetch with the cursor until \`has\_more\` is false. Newly indexed items may have a brief delay before appearing. Verify \`path\_display\` and \`.tag\` (file vs folder) on each result before acting, as multiple similar-named items may match. Results are limited to items visible to the authenticated user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| No \| The search string. Must be 1 or more non-whitespace characters. Queries are case-insensitive. Required unless cursor is provided. \|
\| \`cursor\` \| string \| No \| Cursor from a previous search response for fetching the next page of results. When provided, all other parameters are ignored and the continue endpoint is called. \|
\| \`options\` \| object \| No \| Additional options for the search. If not provided, default search options will be used. Key sub-fields: \`path\` (must start with '/' or use 'id:...' format; omit to search entire account, narrow to reduce noise); \`file\_categories\` and \`file\_extensions\` to filter by type; no native date-range filter — apply date logic client-side using \`server\_modified\` (UTC). Prefer reusing \`path\_display\` values from prior results rather than manually composing paths. \|
\| \`match\_field\_options\` \| object \| No \| Options for match field highlighting. If not provided, default options will be used. \|
\| \`Dropbox-API-Select-User\` \| string \| No \| Team member ID (format: dbmid:...) required when using team tokens. Specifies which team member's account to operate on. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search File Properties

\*\*Slug:\*\* \`DROPBOX\_SEARCH\_FILE\_PROPERTIES\`

Tool to search across property templates for particular property field values. Use when you need to find files or folders that have specific custom property values (e.g., find all files with priority='high'). Note: This endpoint does not support apps with the app folder permission.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| No \| Cursor returned by a previous properties/search response. When provided, the action calls properties/search/continue and ignores queries/template\_filter. \|
\| \`queries\` \| array \| No \| List of queries to search. Required unless cursor is provided. Each query specifies a property field value to search for and the field name to search within. \|
\| \`template\_filter\` \| object \| No \| Filter results to contain only properties associated with specific template IDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Send team member welcome email

\*\*Slug:\*\* \`DROPBOX\_SEND\_TEAM\_MEMBER\_WELCOME\_EMAIL\`

Tool to send a welcome email to a pending team member. Use when a team admin needs to resend or send a welcome email to a user who has been invited to the team.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`.tag\` \| string ("team\_member\_id" \| "external\_id" \| "email") \| Yes \| Type of identifier to use: 'team\_member\_id' for team member ID, 'external\_id' for external ID, or 'email' for email address \|
\| \`email\` \| string \| No \| Email address of the user. Required when tag is 'email' \|
\| \`external\_id\` \| string \| No \| External ID of the user. Required when tag is 'external\_id' \|
\| \`team\_member\_id\` \| string \| No \| The team member ID of the user. Required when tag is 'team\_member\_id' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Set profile photo

\*\*Slug:\*\* \`DROPBOX\_SET\_PROFILE\_PHOTO\`

Tool to set the profile photo for the current user's Dropbox account. Use when you need to update or change the user's profile picture. Requires a base64-encoded JPEG image.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`photo\` \| object \| Yes \| Photo data to set as the profile photo. Must be a base64-encoded JPEG image. \|
\| \`Dropbox-API-Select-User\` \| string \| No \| Team member ID (format: dbmid:...) required when using team tokens. Specifies which team member's account to operate on. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Set team member custom quota

\*\*Slug:\*\* \`DROPBOX\_SET\_TEAM\_MEMBER\_CUSTOM\_QUOTA\`

Tool to set custom storage quotas for team members in Dropbox. Use when you need to assign specific storage limits to individual team members. Maximum of 1000 users per request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`users\_and\_quotas\` \| array \| Yes \| List of users and their custom quotas to set. Maximum of 1000 users per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Share folder

\*\*Slug:\*\* \`DROPBOX\_SHARE\_FOLDER\`

Tool to share a folder with collaborators in Dropbox. Most sharing will be completed synchronously, but large folders will be completed asynchronously. If an async\_job\_id is returned, you'll need to call check\_share\_job\_status until the action completes to get the folder metadata. Use when you need to create a shared folder or convert an existing folder to a shared folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| The path to the folder to share. If it does not exist, then a new one is created. Must be a valid Dropbox path (e.g., '/TestSharedFolder'). \|
\| \`actions\` \| array \| No \| A list of FolderActions corresponding to FolderPermissions that should appear in the response's SharedFolderMetadata.permissions field describing the actions the authenticated user can perform on the folder. \|
\| \`force\_async\` \| boolean \| No \| Whether to force the share to happen asynchronously. Large folders will be completed asynchronously anyway. Set to true to make testing the async case repeatable. \|
\| \`link\_settings\` \| object \| No \| Settings that apply to a link. \|
\| \`member\_policy\` \| object \| No \| Policy governing who can be a member of a shared folder. \|
\| \`acl\_update\_policy\` \| object \| No \| Who can change a shared folder's access control list. \|
\| \`shared\_link\_policy\` \| object \| No \| Who can view shared links in this folder. \|
\| \`viewer\_info\_policy\` \| object \| No \| Who can enable/disable viewer info for this shared folder. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Start upload session

\*\*Slug:\*\* \`DROPBOX\_START\_UPLOAD\_SESSION\`

Tool to start a new upload session with the given data. Use when uploading large files in multiple requests. This call starts the session and you can then use upload\_session/append\_v2 to add more data and upload\_session/finish to complete the upload. A single request should not upload more than 150 MiB.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`close\` \| boolean \| No \| If true, the current session will be closed after uploading this data, at which point you won't be able to call upload\_session/append\_v2 anymore with the current session. Set to false to keep the session open for appending more data. \|
\| \`content\` \| object \| Yes \| File data to upload in this initial session. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Start batch of upload sessions

\*\*Slug:\*\* \`DROPBOX\_START\_UPLOAD\_SESSION\_BATCH\`

Tool to start a batch of upload sessions. Use when you need to upload multiple large files and want to initialize multiple upload sessions at once. Each session can then be used with upload\_session/append\_v2 to upload file chunks and upload\_session/finish\_batch to complete the uploads.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`num\_sessions\` \| integer \| Yes \| The number of upload sessions to start. Must be between 1 and 1000. \|
\| \`session\_type\` \| string ("sequential" \| "concurrent") \| No \| Type of upload session. 'sequential' means pieces of data are uploaded sequentially one after another (default). 'concurrent' means pieces of data can be uploaded in concurrent RPCs in any order. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Unlock multiple files

\*\*Slug:\*\* \`DROPBOX\_UNLOCK\_FILE\_BATCH\`

Tool to unlock multiple files at specified paths in a single batch operation. Locked files can only be unlocked by the lock holder or a team admin (for business accounts). Returns metadata for each unlocked file or error details for failures.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`entries\` \| array \| Yes \| List of files to unlock. Each entry contains a path or file ID. Duplicate paths are processed only once. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Unmount shared folder

\*\*Slug:\*\* \`DROPBOX\_UNMOUNT\_FOLDER\`

Tool to unmount a shared folder for the current user. Once unmounted, the shared folder will be removed from the user's Dropbox. Use when a user wants to remove a shared folder from their Dropbox while remaining a member of the folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`shared\_folder\_id\` \| string \| Yes \| The ID of the shared folder to unmount. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Unshare file

\*\*Slug:\*\* \`DROPBOX\_UNSHARE\_FILE\`

Tool to remove all members from a Dropbox file. Use when you need to revoke access for all collaborators on a file. Note: This does not remove inherited members from parent folders and does not support apps with the app folder permission.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\` \| string \| Yes \| The file to unshare. Use the file ID format (e.g., 'id:7bh4zBmgZoAAAAAAAAABJA') or a path to the file. This action removes all members from the file, but does not remove inherited members from parent folders. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Unshare folder

\*\*Slug:\*\* \`DROPBOX\_UNSHARE\_FOLDER\`

Tool to allow a shared folder owner to unshare the folder. Use when you need to stop sharing a folder with all members. Unshare will not work if: the shared folder contains shared folders OR the shared folder is inside another shared folder. You must call check\_job\_status with the returned async\_job\_id to determine if the action completed successfully. Requires sharing.write scope.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`leave\_a\_copy\` \| boolean \| No \| If true, members of this shared folder will get a copy of this folder after it's unshared. Otherwise, it will be removed from their Dropbox. The current user, who is an owner, will always retain their copy. Default is false \|
\| \`shared\_folder\_id\` \| string \| Yes \| The ID for the shared folder to unshare. You can get this from list\_shared\_folders action \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update file member

\*\*Slug:\*\* \`DROPBOX\_UPDATE\_FILE\_MEMBER\`

Tool to change a member's access level on a shared file. Use when you need to update permissions for an existing file member (e.g., change from editor to viewer or vice versa). Note: This endpoint does not support apps with the app folder permission.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\` \| string \| Yes \| File for which to update the member's access. Can be a file path (e.g., '/test\_read\_file\_basic.txt') or file ID (e.g., 'id:xxxxx'). \|
\| \`member\` \| object \| Yes \| The member whose access to update. Identify by email or Dropbox ID. \|
\| \`access\_level\` \| string ("viewer" \| "editor") \| Yes \| The new access level for the member. 'viewer' - The member can only view the file. 'editor' - The member can edit the file. Note: Editor access may fail with no\_permission for certain file types. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update file properties

\*\*Slug:\*\* \`DROPBOX\_UPDATE\_FILE\_PROPERTIES\`

Tool to update custom properties on a file or folder in Dropbox. Use when you need to modify metadata fields associated with a property template, such as updating status, priority, or other custom attributes. Requires the files.metadata.write scope.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| A unique identifier for the file or folder. Can be a path (e.g., '/test.txt') or file ID (e.g., 'id:a4ayc\_80\_OEAAAAAAAAAXz'). \|
\| \`update\_property\_groups\` \| array \| Yes \| The property groups 'delta' updates to apply. Each update specifies a template ID and the fields to add/update or remove. \|
\| \`Dropbox-API-Select-User\` \| string \| No \| Team member ID (format: dbmid:...) required when using team tokens. Specifies which team member's account to operate on. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update file request

\*\*Slug:\*\* \`DROPBOX\_UPDATE\_FILE\_REQUEST\`

Tool to update an existing file request in Dropbox. Use when you need to modify the title, destination, deadline, open/closed status, or description of a file request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The ID of the file request to update. Example: 'oaCAVmEyrqYnkZX9955Y' \|
\| \`open\` \| boolean \| No \| Whether to set this file request as open or closed. If true, the file request will accept files. If false, it will be closed. \|
\| \`title\` \| string \| No \| The new title of the file request. Must not be empty if provided. \|
\| \`deadline\` \| object \| No \| Represents the deadline parameters when updating a file request deadline. \|
\| \`description\` \| string \| No \| The new description of the file request. \|
\| \`destination\` \| string \| No \| The new path in the user's Dropbox where uploaded files will be saved. Must be a path starting with '/'. Example: '/Homework/math' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update folder member

\*\*Slug:\*\* \`DROPBOX\_UPDATE\_FOLDER\_MEMBER\`

Tool to update another member's permissions in a shared folder. Use when an owner or editor needs to change access levels for existing members. This endpoint does not support apps with the app folder permission.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`member\` \| object \| Yes \| The member of the shared folder to update. Note: Only the dropbox\_id may be used for updates according to API docs, but email is also supported by the endpoint \|
\| \`access\_level\` \| object \| Yes \| The new access level for the member. Note: Cannot set access level to 'owner' through this endpoint \|
\| \`shared\_folder\_id\` \| string \| Yes \| The ID of the shared folder containing the member to update. You can get this from list\_shared\_folders action \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update folder policy

\*\*Slug:\*\* \`DROPBOX\_UPDATE\_FOLDER\_POLICY\`

Tool to update the sharing policies for a shared folder. Use when you need to change who can be members, who can update the ACL, viewer info settings, shared link policies, or link settings. User must have AccessLevel.owner access to the shared folder.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`actions\` \| array \| No \| A list of FolderActions corresponding to FolderPermissions that should appear in the response's SharedFolderMetadata.permissions field describing the actions the authenticated user can perform on the folder \|
\| \`link\_settings\` \| object \| No \| Settings that apply to a link. \|
\| \`member\_policy\` \| object \| No \| Policy governing who can be a member of a shared folder. \|
\| \`shared\_folder\_id\` \| string \| Yes \| The ID for the shared folder. You must have AccessLevel.owner access to update its policies \|
\| \`acl\_update\_policy\` \| object \| No \| Who can change a shared folder's access control list (ACL). \|
\| \`shared\_link\_policy\` \| object \| No \| Policy governing who can view shared links. \|
\| \`viewer\_info\_policy\` \| object \| No \| Policy governing who can view viewer information. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Set group member access type

\*\*Slug:\*\* \`DROPBOX\_UPDATE\_GROUP\_MEMBER\_ACCESS\_TYPE\`

Tool to change a member's access type in a team group. Use when you need to promote a member to owner or demote an owner to regular member. Requires team admin permissions with group management capabilities.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| object \| Yes \| The user whose access type will be changed. Must be an existing member of the group. Can be identified by team\_member\_id, external\_id, or email \|
\| \`group\` \| object \| Yes \| The group containing the member whose access type will be changed. Specify either by group\_id or group\_external\_id \|
\| \`access\_type\` \| object \| Yes \| The new access type to assign to the user in the group \|
\| \`return\_members\` \| boolean \| No \| Whether to return the list of members in the group after updating. Note that the default value will cause all group members to be returned, which may take a long time for large groups \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Paper Document

\*\*Slug:\*\* \`DROPBOX\_UPDATE\_PAPER\_DOCUMENT\`

Tool to update an existing Dropbox Paper document with new content in Markdown, HTML, or plain text format. Use when you need to modify, append, prepend, or overwrite content in an existing Paper doc. This endpoint does not support apps with the app folder permission.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| Path to the existing Paper doc in Dropbox to update. MUST include the .paper extension at the end (e.g., '/My Documents/Notes.paper'). \|
\| \`content\` \| string \| Yes \| Content to add or replace in the Paper document based on the update policy. \|
\| \`import\_format\` \| string ("plain\_text" \| "markdown" \| "html") \| Yes \| Format of the provided content: plain\_text, markdown, or html. \|
\| \`paper\_revision\` \| integer \| No \| The paper revision number. Required when doc\_update\_policy is 'update'. This value must match the current revision of the doc or an error will be returned. \|
\| \`doc\_update\_policy\` \| string ("append" \| "prepend" \| "overwrite" \| "update") \| Yes \| Policy for updating the document: 'append' adds content to the end, 'prepend' adds content to the beginning, 'overwrite' replaces all content, 'update' merges content intelligently (requires paper\_revision). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update property template for team

\*\*Slug:\*\* \`DROPBOX\_UPDATE\_PROPERTY\_TEMPLATE\_FOR\_TEAM\`

Tool to update a property template for a team in Dropbox. Use when you need to modify an existing template's name, description, or add new property fields. Requires team admin permissions and a Dropbox Business account.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| A display name for the template. Template names can be up to 256 bytes. If not provided, the name will not be changed. \|
\| \`add\_fields\` \| array \| No \| Property field templates to be added to the group template. There can be up to 32 properties in a single template. \|
\| \`description\` \| string \| No \| Description for the template. Template descriptions can be up to 1024 bytes. If not provided, the description will not be changed. \|
\| \`template\_id\` \| string \| Yes \| An identifier for template added by templates/add\_for\_user or templates/add\_for\_team. Typically in the format 'ptid:XXXXX'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update team folder sync settings

\*\*Slug:\*\* \`DROPBOX\_UPDATE\_TEAM\_FOLDER\_SYNC\_SETTINGS\`

Tool to update the sync settings on a team folder or its contents in Dropbox. Use when you need to control whether a team folder or specific content within it is synchronized to members' devices. This is useful for managing storage space and controlling access to sensitive content.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sync\_setting\` \| string \| Yes \| The sync setting to apply to the team folder. Possible values: 'default' (sync normally), 'not\_synced' (do not sync) \|
\| \`team\_folder\_id\` \| string \| Yes \| The ID of the team folder to update sync settings for. You can get this from list\_team\_folders or other team folder operations \|
\| \`content\_sync\_settings\` \| array \| No \| Optional list of content-specific sync settings within the team folder. Each entry specifies a file or folder ID and its desired sync setting \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update team group

\*\*Slug:\*\* \`DROPBOX\_UPDATE\_TEAM\_GROUP\`

Tool to update a team group's name, external ID, and/or management type. Use when you need to modify group properties such as renaming a group or changing how it's managed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`group\` \| object \| Yes \| Specify the group to update by either group\_id or group\_external\_id. \|
\| \`new\_group\_name\` \| string \| No \| The new name for the group. If not provided, the group name remains unchanged. \|
\| \`return\_members\` \| boolean \| No \| Whether to return the list of members in the response. Note that the default will cause all group members to be returned, which may take a long time for large groups. \|
\| \`new\_group\_external\_id\` \| string \| No \| The new external ID for the group. If not provided, the external ID remains unchanged. Set to empty string to clear the external ID. \|
\| \`new\_group\_management\_type\` \| object \| No \| The management type for the group. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Set team member admin permissions

\*\*Slug:\*\* \`DROPBOX\_UPDATE\_TEAM\_MEMBER\_ADMIN\_PERMISSIONS\`

Tool to update a team member's admin permissions. Use when you need to grant or revoke admin privileges for team members. Requires team admin permissions to execute.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| object \| Yes \| Identity of the team member whose admin permissions will be set. Use exactly one of team\_member\_id, email, or external\_id to identify the user \|
\| \`new\_role\` \| object \| Yes \| The new admin permissions role to assign to the team member \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Set team member profile

\*\*Slug:\*\* \`DROPBOX\_UPDATE\_TEAM\_MEMBER\_PROFILE\`

Tool to update a team member's profile information. Use when you need to change a team member's email, name, external ID, or directory restrictions. At least one profile field must be provided for update.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| object \| Yes \| Identity of user whose profile will be set. Exactly one of team\_member\_id, email, or external\_id must be provided to identify the user account \|
\| \`new\_email\` \| string \| No \| New email for member \|
\| \`new\_surname\` \| string \| No \| New surname for member \|
\| \`new\_given\_name\` \| string \| No \| New given name for member \|
\| \`new\_external\_id\` \| string \| No \| New external ID for member \|
\| \`new\_persistent\_id\` \| string \| No \| New persistent ID. This field only available to teams using persistent ID SAML configuration \|
\| \`new\_is\_directory\_restricted\` \| boolean \| No \| New value for whether the user is a directory restricted user \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Set team member profile photo

\*\*Slug:\*\* \`DROPBOX\_UPDATE\_TEAM\_MEMBER\_PROFILE\_PHOTO\`

Tool to update a team member's profile photo. Use when you need to set or change the profile picture of a team member. Requires team admin permissions and a JPEG image (minimum 128x128 pixels) in base64 format.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| object \| Yes \| The team member whose profile photo should be updated. \|
\| \`photo\` \| object \| Yes \| The photo data to be set as the team member's profile photo. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upload File

\*\*Slug:\*\* \`DROPBOX\_UPLOAD\_FILE\`

Uploads a file (up to ~150 MB) to a specified path in the user's Dropbox, with options for handling existing files. Files larger than 150 MB require a chunked upload approach.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mode\` \| string \| No \| Specifies how to handle the upload if a file already exists at the specified path. \|
\| \`mute\` \| boolean \| No \| If true, the user will not be notified of the new file via desktop or mobile notifications. \|
\| \`path\` \| string \| Yes \| Path in the user's Dropbox to save the file. \|
\| \`content\` \| object \| Yes \| File to be uploaded; supports various formats including images, PDFs, and text files. Ensure the content is the intended file and not an HTML/XML error page from the source server. \|
\| \`autorename\` \| boolean \| No \| If true and a file already exists at the path, the new file will be renamed to avoid conflict. \|
\| \`strict\_conflict\` \| boolean \| No \| If true, the upload will be rejected if the file already exists, regardless of the autorename setting. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|
