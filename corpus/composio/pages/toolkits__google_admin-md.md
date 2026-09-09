---
url: https://docs.composio.dev/toolkits/google_admin.md
title: https://docs.composio.dev/toolkits/google_admin.md
description: 
status: 200
---

\# Google Admin

Google Admin Console for managing Google Workspace users, groups, and organizational units.

\- \*\*Category:\*\* security & identity tools
\- \*\*Auth:\*\* OAUTH2
\- \*\*Composio-managed OAuth available?\*\* No
\- \*\*Tools:\*\* 14
\- \*\*Triggers:\*\* 0
\- \*\*Slug:\*\* \`GOOGLE\_ADMIN\`
\- \*\*Version:\*\* 20260721\_00

\## Frequently Asked Questions

\### How do I set up custom Google OAuth credentials for Google Admin?

For a step-by-step guide on creating and configuring your own Google OAuth credentials with Composio, see \[How to create OAuth2 credentials for Google Apps\](https://composio.dev/auth/googleapps).

\## Tools

\### Add Alias to Google Workspace User

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_ADD\_USER\_ALIAS\`

Adds an email alias to a Google Workspace user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alias\` \| string \| Yes \| Alias email address to add to the user Must be unique across the entire domain; adding a duplicate alias already assigned to any user will fail. \|
\| \`user\_key\` \| string \| Yes \| User's primary email address or unique user ID \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add User to Google Workspace Group

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_ADD\_USER\_TO\_GROUP\`

Adds a user to a Google Workspace group with the specified role.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`role\` \| string \| No \| Role of the user in the group (MEMBER, MANAGER, OWNER) \|
\| \`user\_key\` \| string \| Yes \| User's primary email address or unique user ID to add to the group \|
\| \`group\_key\` \| string \| Yes \| Group's email address or unique group ID \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Google Workspace Group

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_CREATE\_GROUP\`

Creates a new Google Workspace group with the specified details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Display name for the group \|
\| \`email\` \| string \| Yes \| Group's email address (will be the group ID) \|
\| \`description\` \| string \| No \| Description of the group's purpose \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Google Workspace User

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_CREATE\_USER\`

Creates a new Google Workspace user with the specified details. Fails if \`primary\_email\` already exists; cannot update existing accounts.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`password\` \| string \| Yes \| User's password (must meet domain password requirements) \|
\| \`suspended\` \| boolean \| No \| Whether the user account is suspended \|
\| \`given\_name\` \| string \| Yes \| User's first name \|
\| \`family\_name\` \| string \| Yes \| User's last name \|
\| \`org\_unit\_path\` \| string \| No \| Organizational unit path for the user Defaults to root OU ('/'), which applies domain-wide policies; set explicitly if per-OU policies differ. \|
\| \`primary\_email\` \| string \| Yes \| User's primary email address \|
\| \`recovery\_email\` \| string \| No \| Recovery email address \|
\| \`recovery\_phone\` \| string \| No \| Recovery phone number \|
\| \`change\_password\_at\_next\_login\` \| boolean \| No \| Whether user must change password at next login \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Google Workspace User

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_DELETE\_USER\`

Deletes a Google Workspace user permanently. This action cannot be undone.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_key\` \| string \| Yes \| User's primary email address or unique user ID \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Google Workspace Group Details

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_GET\_GROUP\`

Retrieves detailed information about a Google Workspace group.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`group\_key\` \| string \| Yes \| Group's email address or unique group ID \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Google Workspace User Details

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_GET\_USER\`

Retrieves detailed information about a Google Workspace user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_key\` \| string \| Yes \| User's primary email address or unique user ID \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Google Workspace Group Members

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_LIST\_GROUP\_MEMBERS\`

Lists all members of a Google Workspace group with optional filtering and pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`roles\` \| string \| No \| Comma-separated list of roles to filter by (OWNER, MANAGER, MEMBER) \|
\| \`group\_key\` \| string \| Yes \| Group's email address or unique group ID \|
\| \`page\_token\` \| string \| No \| Token for retrieving next page of results \|
\| \`max\_results\` \| integer \| No \| Maximum number of results to return (1-200) \|
\| \`include\_derived\_membership\` \| boolean \| No \| Whether to include indirect memberships from nested groups \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Google Workspace Groups

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_LIST\_GROUPS\`

Lists Google Workspace groups with optional filtering and pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| No \| Query string for filtering groups (e.g., 'name=Engineering\*') \|
\| \`domain\` \| string \| No \| Domain name to list groups from \|
\| \`customer\` \| string \| No \| Customer ID or 'my\_customer' for the authenticated user's customer \|
\| \`order\_by\` \| string \| No \| Property to order results by (email) \|
\| \`page\_token\` \| string \| No \| Token for retrieving next page of results \|
\| \`sort\_order\` \| string \| No \| Sort order (ASCENDING or DESCENDING) \|
\| \`max\_results\` \| integer \| No \| Maximum number of results to return (1-200) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Google Workspace Users

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_LIST\_USERS\`

Lists Google Workspace users with optional filtering and pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| No \| Query string for filtering users (e.g., 'orgName=Engineering') \|
\| \`domain\` \| string \| No \| Domain name to list users from (if not specified, uses the authenticated user's domain) \|
\| \`customer\` \| string \| No \| Customer ID or 'my\_customer' for the authenticated user's customer \|
\| \`order\_by\` \| string \| No \| Property to order results by (email, givenName, familyName) \|
\| \`page\_token\` \| string \| No \| Token for retrieving next page of results \|
\| \`sort\_order\` \| string \| No \| Sort order (ASCENDING or DESCENDING) \|
\| \`max\_results\` \| integer \| No \| Maximum number of results to return (1-500) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove Alias from Google Workspace User

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_REMOVE\_USER\_ALIAS\`

Removes an email alias from a Google Workspace user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`alias\` \| string \| Yes \| Alias email address to remove from the user \|
\| \`user\_key\` \| string \| Yes \| User's primary email address or unique user ID \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove User from Google Workspace Group

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_REMOVE\_USER\_FROM\_GROUP\`

Removes a user from a Google Workspace group, revoking their group access.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_key\` \| string \| Yes \| User's primary email address or unique user ID to remove from the group \|
\| \`group\_key\` \| string \| Yes \| Group's email address or unique group ID \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Suspend/Unsuspend Google Workspace User

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_SUSPEND\_USER\`

Suspends or unsuspends a Google Workspace user account.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_key\` \| string \| Yes \| User's primary email address or unique user ID \|
\| \`suspended\` \| boolean \| No \| Whether to suspend (True) or unsuspend (False) the user \|
\| \`suspension\_reason\` \| string \| No \| Reason for suspension (optional) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Google Workspace Group Settings

\*\*Slug:\*\* \`GOOGLE\_ADMIN\_UPDATE\_GROUP\_SETTINGS\`

Updates settings for a Google Workspace group.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| Updated display name for the group \|
\| \`group\_key\` \| string \| Yes \| Group's email address or unique group ID \|
\| \`description\` \| string \| No \| Updated group description \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|
