---
url: https://docs.composio.dev/toolkits/linear.md
title: https://docs.composio.dev/toolkits/linear.md
description: 
status: 200
---

\# Linear

Linear is a streamlined issue tracking and project planning tool for modern teams, featuring fast workflows, keyboard shortcuts, and GitHub integrations

\- \*\*Category:\*\* project management
\- \*\*Auth:\*\* OAUTH2, API\_KEY
\- \*\*Composio-managed OAuth available?\*\* Yes
\- \*\*Tools:\*\* 47
\- \*\*Triggers:\*\* 12
\- \*\*Slug:\*\* \`LINEAR\`
\- \*\*Version:\*\* 20260819\_00

\## Tools

\### Archive issue

\*\*Slug:\*\* \`LINEAR\_ARCHIVE\_ISSUE\`

Archives an existing Linear issue by its ID, removing it from active views while preserving its data for future reference. Use this action when you need to remove an issue from active work without permanently deleting it — for example, when an issue is no longer relevant, was created by mistake, or has been superseded by another issue. Archiving is reversible via the unarchive mutation, unlike permanent deletion. This action is irreversible through the API once completed, though issues can be manually unarchived in the Linear UI or via the issueUnarchive mutation.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`issue\_id\` \| string \| Yes \| ID of the Linear issue to be archived. Must be in one of two formats: (1) UUID format: a 36-character string with hyphens (e.g., 'c5748ccf-c67f-4af4-bd74-fe513dc4c054'), or (2) Shorthand identifier: team key (alphanumeric, must start with a letter, 1-10 chars) followed by hyphen and issue number (e.g., 'ENG-123', 'MAN8-456'). Note: Plain numeric IDs are NOT valid Linear issue identifiers. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Archive Project

\*\*Slug:\*\* \`LINEAR\_ARCHIVE\_PROJECT\`

Archives an existing Linear project by its UUID, removing it from active views. Use this action when you need to mark a completed or obsolete project as archived. Archiving is reversible (projects can be unarchived later), but confirm the project name with the user before executing, especially in bulk operations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`project\_id\` \| string \| Yes \| UUID of the Linear project to be archived. Must be a 36-character UUID string with hyphens (e.g., 'a1b2c3d4-e5f6-7890-1234-567890abcdef'). Use LINEAR\_LIST\_LINEAR\_PROJECTS or LINEAR\_GET\_LINEAR\_PROJECT to retrieve valid project UUIDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Archive Project Update

\*\*Slug:\*\* \`LINEAR\_ARCHIVE\_PROJECT\_UPDATE\`

Archives a project update in Linear, hiding it from the default view while preserving its data. Use this action when you need to clean up old or obsolete project status updates without permanently deleting them. Archived updates can be unarchived later if needed. This action is irreversible only in the sense that the project update will be hidden from active views until explicitly unarchived.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`project\_update\_id\` \| string \| Yes \| The unique identifier (UUID) of the project update to archive. Must be a valid Linear project update UUID in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. Once archived, the project update will be hidden from the default view but can still be accessed or unarchived later. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create attachment

\*\*Slug:\*\* \`LINEAR\_CREATE\_ATTACHMENT\`

Creates a new attachment and associates it with a specific, existing Linear issue.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| Yes \| URL of the attachment's content (e.g., file, webpage, online resource). \|
\| \`title\` \| string \| Yes \| Title for the attachment. \|
\| \`issue\_id\` \| string \| Yes \| Identifier of the existing Linear issue to which the attachment will be added. Accepts either UUID format (e.g., '590a1127-f98b-49fc-ba74-2df8751c089e') or issue key format (e.g., 'GHO-300', 'ENG-123'). \|
\| \`subtitle\` \| string \| No \| Optional subtitle or short description for the attachment. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add reaction to comment

\*\*Slug:\*\* \`LINEAR\_CREATE\_COMMENT\_REACTION\`

Tool to add a reaction to an existing Linear comment. Use when you want to programmatically react to a comment on an issue.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`emoji\` \| string \| Yes \| Emoji for the reaction. Supports Unicode emojis or shortcodes like ':thumbsup:'. \|
\| \`comment\_id\` \| string \| Yes \| Identifier of the existing Linear comment to add the reaction to. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create a comment

\*\*Slug:\*\* \`LINEAR\_CREATE\_LINEAR\_COMMENT\`

Creates a new comment on a specified Linear issue. This action modifies shared workspace data and is not reversible — confirm the target issue and comment content before executing.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`body\` \| string \| Yes \| Non-empty comment content, in plain text or Markdown. Must not be whitespace-only. \|
\| \`issueId\` \| string \| Yes \| ID of the Linear issue to add the comment to. Must be in one of two formats: (1) UUID format: a 36-character string with hyphens (e.g., 'c5748ccf-c67f-4af4-bd74-fe513dc4c054'), or (2) Shorthand identifier: team key (alphanumeric, must start with a letter, 1-10 chars) followed by hyphen and issue number (e.g., 'ENG-123', 'PROJ-456'). Use LIST\_LINEAR\_ISSUES action to retrieve valid issue IDs if needed. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create linear issue

\*\*Slug:\*\* \`LINEAR\_CREATE\_LINEAR\_ISSUE\`

Creates a new issue in a specified Linear project and team, requiring team\_id and title, and allowing optional properties like description, assignee, state, priority, cycle, and due date. All UUID parameters (state\_id, assignee\_id, cycle\_id, label\_ids, project\_id) must belong to the same team as team\_id. The created issue's id is returned in data.id — capture it for use as parent\_id in sub-issues or follow-up operations. No template\_id field exists; expand templates manually into title and description before calling.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| Yes \| The title of the new issue. \|
\| \`team\_id\` \| string \| Yes \| UUID of the team responsible for this issue. IMPORTANT: You must use a valid team UUID that exists in your Linear workspace and that the authenticated user has access to. Use the LINEAR\_GET\_ALL\_LINEAR\_TEAMS action to retrieve the list of available teams and their UUIDs. Do not use team keys (like 'INT' or 'ENG') or team names (like 'Backend' or 'Frontend') - only the UUID format is accepted (e.g., '9a7f1e3c-4d5b-6a7f-8e9d-0a1b2c3d4e5f'). \|
\| \`cycle\_id\` \| string \| No \| UUID of the cycle (sprint) to assign this issue to. Cycles are time-bound periods used to organize and prioritize work. Only applicable if the team has cycles feature enabled. Must be a valid UUID format. Must belong to the same team as team\_id. \|
\| \`due\_date\` \| string \| No \| The target completion date for the issue in ISO8601 datetime format or YYYY-MM-DD TimelessDate format (e.g., '2024-12-31' or '2024-12-31T23:59:59Z') \|
\| \`estimate\` \| integer \| No \| The estimated complexity or effort for the issue, represented as a numerical point value (e.g., 1, 2, 3, 5, 8). The specific scale used (e.g., Fibonacci, Linear, T-shirt sizes mapped to numbers) is defined by the team's settings. This field only applies if the estimates feature is enabled for the team. A value of 0 typically means no estimate has been set. \|
\| \`priority\` \| integer \| No \| Priority of the issue. 0 indicates no priority, 1 is Urgent, 2 is High, 3 is Normal, and 4 is Low. \|
\| \`state\_id\` \| string \| No \| UUID of the workflow state to assign to the issue (must be a valid UUID format, not a state name like 'backlog' or 'done') Must belong to the same team as team\_id — cross-team state UUIDs will be rejected. \|
\| \`label\_ids\` \| array \| No \| A list of UUIDs for labels to be added to this issue. EXCLUSIVE GROUP CONSTRAINT: Linear organizes labels into groups where only ONE label per group can be applied. STEP-BY-STEP: (1) Call LINEAR\_LIST\_LINEAR\_LABELS with team\_id to get available labels. (2) FILTER OUT any labels where is\_group=true (these are parent groups, not usable labels). (3) For remaining labels, group them by parent.id - labels with the SAME parent.id are mutually exclusive. (4) From each group with a shared parent.id, select ONLY ONE label. (5) Labels with parent=null can be freely combined. EXAMPLE: If labels A and B both have parent.id='X', you can only use A OR B, not both. Always call LINEAR\_LIST\_LINEAR\_LABELS with team\_id to scope results — omitting team\_id may return workspace-wide label IDs that are rejected for team-scoped issues. \|
\| \`parent\_id\` \| string \| No \| UUID of an existing issue to set as the parent of this new issue, creating a sub-issue relationship (must be a valid UUID format) \|
\| \`project\_id\` \| string \| No \| UUID of the project to associate with this issue. Must be a valid UUID format (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx with 8-4-4-4-12 hex characters). IMPORTANT: The project must belong to the same team specified in team\_id - Linear requires projects and issues to be in the same team. Use the LIST\_LINEAR\_PROJECTS action to find projects, then verify the project belongs to the target team before using it here. \|
\| \`assignee\_id\` \| string \| No \| UUID of the user to assign to this issue (must be a valid UUID format) User must be a member of the team specified in team\_id. \|
\| \`description\` \| string \| No \| A detailed description of the issue, which can include markdown formatting. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create issue relation

\*\*Slug:\*\* \`LINEAR\_CREATE\_LINEAR\_ISSUE\_RELATION\`

Create a relationship between two Linear issues using the issueRelationCreate mutation. Use this to establish connections like 'blocks', 'duplicate', or 'related' between issues.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`issue\_id\` \| string \| Yes \| UUID of the primary issue in the relationship. Must be a valid Linear issue UUID (e.g., 'c5748ccf-c67f-4af4-bd74-fe513dc4c054'). Use LINEAR\_LIST\_LINEAR\_ISSUES or LINEAR\_GET\_LINEAR\_ISSUE to retrieve valid issue UUIDs. \|
\| \`relation\_type\` \| string ("blocks" \| "duplicate" \| "related") \| Yes \| Type of relationship between the two issues. Options: 'blocks' (this issue blocks the related issue), 'duplicate' (this issue is a duplicate of the related issue), 'related' (general relationship between issues). \|
\| \`related\_issue\_id\` \| string \| Yes \| UUID of the related issue. Must be a valid Linear issue UUID (e.g., '71bc4480-3aa1-4c56-b657-827996658662'). Use LINEAR\_LIST\_LINEAR\_ISSUES or LINEAR\_GET\_LINEAR\_ISSUE to retrieve valid issue UUIDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create a label

\*\*Slug:\*\* \`LINEAR\_CREATE\_LINEAR\_LABEL\`

Creates a new label in Linear for a specified team, used to categorize and organize issues. Label names must be unique within each team. If a label with the same name already exists, the existing label will be returned. Both new and existing labels return the same object structure; check the label's \`createdAt\` or compare IDs to determine if creation occurred.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Name of the new label, displayed in the Linear UI. Must be unique within the team. \|
\| \`color\` \| string \| Yes \| Hexadecimal color code (e.g., '#FF0000') for the label's appearance in the UI. \|
\| \`team\_id\` \| string \| Yes \| Identifier of the team for which this label will be created. \|
\| \`description\` \| string \| No \| Optional detailed description for the label, providing context on its use. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Project

\*\*Slug:\*\* \`LINEAR\_CREATE\_LINEAR\_PROJECT\`

Creates a new Linear project with specified name and team associations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`icon\` \| string \| No \| Optional icon for the project. Must be a valid icon name string from Linear's icon set (case-sensitive). Does NOT accept unicode emoji characters. Verified valid icon names include: 'Project', 'Rocket', 'Bug', 'Team', 'Calendar', 'Home'. Linear offers ~70 icon designs; invalid names will cause an INVALID\_INPUT error. \|
\| \`name\` \| string \| Yes \| The name of the project. This is the only required field. Linear permits duplicate project names within a team; uniqueness must be enforced externally if required. \|
\| \`color\` \| string \| No \| Optional color for the project (hex color code). \|
\| \`lead\_id\` \| string \| No \| Optional ID (UUID) of the user who will lead this project. User IDs can be obtained using the LINEAR\_LIST\_LINEAR\_USERS action or from the team members returned by LINEAR\_GET\_ALL\_LINEAR\_TEAMS. Must be a valid UUID in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. \|
\| \`priority\` \| integer \| No \| Priority level of the project. 0 = No priority, 1 = Urgent, 2 = High, 3 = Normal, 4 = Low. \|
\| \`team\_ids\` \| array \| Yes \| List of team IDs (UUIDs) that this project will be associated with. At least one valid team ID is required. Team IDs can be obtained using the LINEAR\_GET\_ALL\_LINEAR\_TEAMS action. Must be valid UUIDs in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. \|
\| \`start\_date\` \| string \| No \| Optional planned start date. Accepts various formats including YYYY-MM-DD, ISO datetime strings (e.g., 2024-01-15T10:30:00Z), or Unix timestamps. Will be normalized to YYYY-MM-DD format for the API. Use YYYY-MM-DD format only; ISO datetime strings and Unix timestamps cause validation failures despite being listed as accepted. \|
\| \`description\` \| string \| No \| Optional description for the project. Supports markdown formatting. Maximum 255 characters (API limit: 255 accepted, 256 rejected). \|
\| \`target\_date\` \| string \| No \| Optional planned completion date. Accepts various formats including YYYY-MM-DD, ISO datetime strings (e.g., 2024-06-30T23:59:59Z), or Unix timestamps. Will be normalized to YYYY-MM-DD format for the API. Use YYYY-MM-DD format only; ISO datetime strings and Unix timestamps cause validation failures despite being listed as accepted. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Project Milestone

\*\*Slug:\*\* \`LINEAR\_CREATE\_PROJECT\_MILESTONE\`

Tool to create a project milestone in Linear with a name and optional target date and sort order. Use when you need to add milestones to track progress within a project.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| The name/title of the milestone. This is a required field. \|
\| \`project\_id\` \| string \| Yes \| UUID of the project to which this milestone belongs. Must be a valid UUID format (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx). Use LINEAR\_LIST\_LINEAR\_PROJECTS or LINEAR\_GET\_LINEAR\_PROJECT to find valid project UUIDs. \|
\| \`sort\_order\` \| number \| No \| Optional sort order number for the milestone. Lower numbers appear first. This determines the display order of milestones within a project. \|
\| \`description\` \| string \| No \| Optional description for the milestone. Supports markdown formatting. \|
\| \`target\_date\` \| string \| No \| Optional target date for the milestone in YYYY-MM-DD format. Accepts date strings in the format YYYY-MM-DD only (e.g., '2024-06-30'). ISO datetime strings or Unix timestamps are not supported by Linear's projectMilestoneCreate mutation. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Project Update

\*\*Slug:\*\* \`LINEAR\_CREATE\_PROJECT\_UPDATE\`

Tool to create a project status update post for a Linear project. Use when you need to post progress updates, status reports, or announcements for a project.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`body\` \| string \| Yes \| The body content of the project update. Supports markdown formatting. This is the main content describing the project status, progress, blockers, and next steps. \|
\| \`health\` \| string ("onTrack" \| "atRisk" \| "offTrack") \| No \| Health status for a project update in Linear. \|
\| \`project\_id\` \| string \| Yes \| The unique identifier (UUID) of the project to create an update for. Must be a valid Linear project UUID in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. Use LINEAR\_LIST\_LINEAR\_PROJECTS or LINEAR\_GET\_LINEAR\_PROJECT to retrieve valid project UUIDs. \|
\| \`is\_diff\_hidden\` \| boolean \| No \| Optional flag to control whether the diff (changes since last update) should be hidden in the update. If true, the diff will not be displayed. If false or not provided, the diff will be shown by default. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Team

\*\*Slug:\*\* \`LINEAR\_CREATE\_TEAM\`

Creates a new team in Linear with the specified name and key. Use this action when you need to create a new organizational unit or work group in a Linear workspace. Teams are fundamental organizational structures in Linear that group issues, projects, and members together. Once created, the team's key becomes the prefix for all issues created within that team (e.g., 'ENG-123'). IMPORTANT: The key must be unique across the workspace and cannot be changed after creation.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`key\` \| string \| Yes \| The unique key/slug for the team. This is used as a short identifier in issue identifiers (e.g., 'ENG-123' for the Engineering team). Must be 2-5 uppercase letters, alphanumeric only. Once set, the key becomes the prefix for all issues in this team. \|
\| \`icon\` \| string \| No \| Optional icon for the team. Must be a valid icon name string from Linear's icon set (case-sensitive). Does NOT accept unicode emoji characters. Common valid icon names include: 'Team', 'Users', 'Bolt', 'Rocket', 'Bug', 'Shield', 'Terminal', 'Chip'. Invalid names will cause an INVALID\_INPUT error. \|
\| \`name\` \| string \| Yes \| The name of the team. This is the primary identifier visible to users in the Linear workspace. Team names should be descriptive and help identify the team's purpose or area of responsibility. \|
\| \`color\` \| string \| No \| Optional color for the team (hex color code without the # prefix, or with the # prefix). Used for visual identification in the Linear interface. \|
\| \`private\` \| boolean \| No \| Whether the team should be private. Private teams are only visible to team members. Default is False (public team visible to all workspace members). \|
\| \`description\` \| string \| No \| Optional description of the team's purpose, responsibilities, or scope. Supports markdown formatting. Helps team members understand the team's role in the organization. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete issue

\*\*Slug:\*\* \`LINEAR\_DELETE\_LINEAR\_ISSUE\`

Archives an existing Linear issue by its ID, which is Linear's standard way of deleting issues; the operation is idempotent. Archiving is permanent with no built-in undo — confirm the issue identifier and title with the user before executing, especially in bulk operations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`issue\_id\` \| string \| Yes \| ID of the Linear issue to be archived. Must be in one of two formats: (1) UUID format: a 36-character string with hyphens (e.g., 'c5748ccf-c67f-4af4-bd74-fe513dc4c054'), or (2) Shorthand identifier: team key (alphanumeric, must start with a letter, 1-10 chars) followed by hyphen and issue number (e.g., 'ENG-123', 'MAN8-456'). Note: Plain numeric IDs are NOT valid Linear issue identifiers. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get all teams (Deprecated)

\*\*Slug:\*\* \`LINEAR\_GET\_ALL\_LINEAR\_TEAMS\`

DEPRECATED: Use ListLinearTeams instead (returns paginated payloads with members and projects); this tool returns simpler id/name-level data for all teams visible to the connected workspace with no server-side filtering. Match teams on stable team id, not display name, as names are not guaranteed unique. Partial results reflect workspace permission scope, not tool failure. Skip this call if team\_id values are already known.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination. Use the \`endCursor\` from the previous response's \`page\_info\` to fetch the next page. \|
\| \`first\` \| integer \| No \| Number of teams to return per page. Use with \`after\` to paginate through all teams. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Download issue attachments

\*\*Slug:\*\* \`LINEAR\_GET\_ATTACHMENT\`

Downloads a specific attachment from a Linear issue; the \`file\_name\` must include the correct file extension.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`issue\_id\` \| string \| Yes \| The unique identifier of the Linear issue from which the attachment will be downloaded. \|
\| \`file\_name\` \| string \| Yes \| The desired name for the downloaded file, including its extension. \|
\| \`attachment\_id\` \| string \| Yes \| The unique identifier of the specific attachment to download. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get a comment

\*\*Slug:\*\* \`LINEAR\_GET\_COMMENT\`

Retrieves a single Linear comment by its unique ID. Returns comprehensive details including the comment body, author, timestamps, associated issue, and thread information. Use this action when you need to fetch details about a specific comment, such as when displaying comment information, checking comment status, or retrieving comment content for processing. The comment ID can be obtained from issue queries, comment lists, or comment creation responses.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| Unique identifier of the comment to retrieve. Must be a valid UUID format comment ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get current user

\*\*Slug:\*\* \`LINEAR\_GET\_CURRENT\_USER\`

Gets the currently authenticated user's ID, name, email, and other profile information — this is the account behind the API token, which may be a bot or service account rather than a human user. Use the returned \`id\` field (nested under \`data.viewer\`) for downstream Linear operations requiring user ID filtering. To search or compare other workspace members, use LINEAR\_LIST\_LINEAR\_USERS instead.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get cycles by team ID

\*\*Slug:\*\* \`LINEAR\_GET\_CYCLES\_BY\_TEAM\_ID\`

Retrieves all cycles for a specified Linear team ID; cycles are time-boxed work periods (like sprints). Results are team-scoped to the given team\_id. To identify the active cycle, check that the current date (in UTC) falls between a cycle's startAt and endAt fields; either field may be null. Results may be paginated — follow page\_info cursors to retrieve all cycles.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination. Use the \`endCursor\` value from the previous response's \`page\_info\` to fetch the next page. \|
\| \`first\` \| integer \| No \| Number of cycles to return per page. Maximum 250. Use with \`after\` to paginate through all cycles. \|
\| \`team\_id\` \| string \| Yes \| The team's unique identifier. Must be a valid UUID (e.g., 'd282d590-8462-4390-8ef9-98f5ac2190b0'), not a human-readable name or slug; use LINEAR\_GET\_ALL\_LINEAR\_TEAMS to resolve if unknown. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get create issue default params

\*\*Slug:\*\* \`LINEAR\_GET\_ISSUE\_DEFAULTS\`

Fetches a Linear team's default issue estimate and state, useful for pre-filling new issue forms.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\_id\` \| string \| Yes \| Identifier of the Linear team. Must be a valid UUID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Linear issue

\*\*Slug:\*\* \`LINEAR\_GET\_LINEAR\_ISSUE\`

Retrieves an existing Linear issue's comprehensive details, including id, identifier, title, description, timestamps, state, team, creator, attachments, comments (with user info and timestamps, use issue.comments.nodes for comment IDs), subscribers, and due date. Does not include parent, milestone, cycle, or relation graphs—use LINEAR\_RUN\_QUERY\_OR\_MUTATION for those. Optional fields (labels, project, state, assignee, cycle) may be null; guard against null when accessing nested properties. Returns null or 'Entity not found' for invalid IDs, cross-workspace IDs, or restricted teams. Rate limit: ~60 req/min; HTTP 429 on excess—apply exponential backoff and respect Retry-After headers.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`issue\_id\` \| string \| Yes \| ID of the Linear issue. Must be in one of two formats: (1) UUID format: a 36-character string with hyphens (e.g., 'c5748ccf-c67f-4af4-bd74-fe513dc4c054'), or (2) Shorthand identifier: team key (alphanumeric, must start with a letter, 1-10 chars) followed by hyphen and issue number (e.g., 'ENG-123', 'MAN8-456'). Note: Plain numeric IDs are NOT valid Linear issue identifiers. Use LIST\_LINEAR\_ISSUES action to retrieve valid issue IDs if needed. Full URLs are also invalid and must be resolved to UUID or shorthand format first. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Linear project

\*\*Slug:\*\* \`LINEAR\_GET\_LINEAR\_PROJECT\`

Retrieves a single Linear project by its unique identifier. Use when verifying a newly created or updated project, or when fetching detailed project information by ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`project\_id\` \| string \| Yes \| The unique identifier (UUID) of the Linear project to retrieve. \|
\| \`include\_teams\` \| boolean \| No \| Whether to include teams associated with the project in the response. \|
\| \`include\_members\` \| boolean \| No \| Whether to include project members in the response. \|
\| \`include\_initiatives\` \| boolean \| No \| Whether to include related initiatives in the response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Project Update

\*\*Slug:\*\* \`LINEAR\_GET\_PROJECT\_UPDATE\`

Retrieves a specific project update by its unique identifier. Use when you need to fetch details about a specific project status update, including the update content, health status, timestamps, and associated project information. This action is useful when verifying a newly created project update or retrieving historical project update information.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier (UUID) of the project update to retrieve. Must be a valid Linear project update UUID in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List comments

\*\*Slug:\*\* \`LINEAR\_LIST\_COMMENTS\`

Lists comments from Linear workspace accessible to the authenticated user. Use this action when you need to retrieve comments for analysis, reporting, or tracking discussions across issues. The response includes comment content, timestamps, author information, and associated issue details. Supports pagination for large result sets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for forward pagination. Use the exact endCursor value from the previous response's page\_info to fetch the next page of comments. Do not modify the cursor value. \|
\| \`first\` \| integer \| No \| Number of comments to return per page. Maximum 250. Use pagination to retrieve more comments by passing page\_info.endCursor as the after parameter in subsequent requests. \|
\| \`before\` \| string \| No \| Cursor for backward pagination. Use the exact startCursor value from the previous response's page\_info to fetch the previous page of comments. \|
\| \`includeArchived\` \| boolean \| No \| Whether to include archived comments in the results. Defaults to false. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List issue drafts

\*\*Slug:\*\* \`LINEAR\_LIST\_ISSUE\_DRAFTS\`

Tool to list issue drafts. Use when you need to fetch draft issues for review or further editing. Check \`pageInfo.hasNextPage\` in the response to determine if additional drafts exist beyond the current page.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination. Use the \`endCursor\` from the previous response's \`pageInfo\` to fetch the next set of drafts. \|
\| \`first\` \| integer \| No \| Number of draft issues to return. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List issues by team ID

\*\*Slug:\*\* \`LINEAR\_LIST\_ISSUES\_BY\_TEAM\_ID\`

Tool to list all issues for a specific Linear team, scoped by team ID. Use when you need to retrieve issues belonging to a particular team without fetching workspace-wide issues. This is more efficient than workspace-wide listing followed by client-side filtering.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Opaque pagination cursor for fetching the next page of results. MUST be the exact \`end\_cursor\` value from a previous response's \`page\_info\`. Cannot use issue IDs, UUIDs, or arbitrary strings. Omit for the first page. \|
\| \`first\` \| integer \| No \| Number of issues to return per page (forward pagination). Must be between 1 and 250. \|
\| \`team\_id\` \| string \| Yes \| The unique identifier (UUID) of the Linear team whose issues you want to list. This is the team's ID, not the team's name or key. \|
\| \`include\_archived\` \| boolean \| No \| Whether to include archived issues in the results. Default is false (only active issues are returned). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get all cycles

\*\*Slug:\*\* \`LINEAR\_LIST\_LINEAR\_CYCLES\`

Retrieves all cycles (time-boxed sprint iterations) org-wide from the Linear account; no filters applied. In large multi-team workspaces this produces heavy responses — filter client-side by team ID and date range using each cycle's startsAt/endsAt fields. Cycles are team-scoped; always group by team ID to avoid mixing sprints across teams. To identify the active sprint, verify the current UTC timestamp falls between startsAt and endsAt, and handle null startsAt/endsAt defensively. Timestamps are UTC. Results may be paginated; follow pageInfo.endCursor and hasNextPage until hasNextPage is false to avoid truncated lists.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination. Use the \`endCursor\` from the previous response's \`page\_info\` to fetch the next page. \|
\| \`first\` \| integer \| No \| Number of cycles to return per page. Use with \`after\` to paginate through all cycles. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Linear issues

\*\*Slug:\*\* \`LINEAR\_LIST\_LINEAR\_ISSUES\`

Lists non-archived Linear issues; if project\_id is not specified, issues from all accessible projects are returned. Can filter by assignee\_id. Only project\_id and assignee\_id server-side filters are supported; label, state, team, cycle, or date filters must be done client-side or via LINEAR\_RUN\_QUERY\_OR\_MUTATION. Response is a flat issues array plus page\_info object (not GraphQL nodes/pageInfo). Fields like cycle membership, dueDate, completedAt, comments, and attachments are absent; use LINEAR\_GET\_LINEAR\_ISSUE for enrichment. state and labels are nested objects (labels as labels.nodes array). Response order is not guaranteed; sort client-side after collecting all pages. No team\_id filter; scope by project\_id or use LINEAR\_RUN\_QUERY\_OR\_MUTATION.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination (opaque string). Use the exact \`endCursor\` value from the previous response's \`page\_info\` to fetch the next set of issues. Do not modify, prefix, or transform the cursor value in any way. \|
\| \`first\` \| integer \| No \| Number of issues to return. Maximum 250 per page. To retrieve all issues, loop using page\_info.hasNextPage and pass page\_info.endCursor as after until hasNextPage is false. \|
\| \`project\_id\` \| string \| No \| ID of the project to filter issues by. If provided, only issues belonging to this project will be returned. Must be a valid project ID that exists and is accessible to the authenticated user. \|
\| \`assignee\_id\` \| string \| No \| UUID of the user to filter issues by assignee. Use 'me' to filter by the current authenticated user, or provide a valid Linear user UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx). Use LINEAR\_GET\_CURRENT\_USER to get your own ID, or LINEAR\_LIST\_LINEAR\_USERS to retrieve other user UUIDs. Note: 'me', '@me', and email addresses are NOT accepted; only a valid UUID or the literal string 'me' if supported — use LINEAR\_GET\_CURRENT\_USER to obtain your UUID. \|
\| \`original\_cursor\` \| string \| No \| The original cursor value before it was reset. \|
\| \`include\_transitions\` \| boolean \| No \| When true, includes the full status transition history for each issue, along with timestamps and computed time-in-state durations. When false (default), the tool returns the standard limited issue object with no transition data. Enabling this increases response size and GraphQL query complexity — when true, \`first\` is internally capped at 25 and values above 50 return a structured error. \|
\| \`cursor\_was\_corrupted\` \| boolean \| No \| Indicates whether the pagination cursor was corrupted and reset. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get labels

\*\*Slug:\*\* \`LINEAR\_LIST\_LINEAR\_LABELS\`

Retrieves labels from Linear. If team\_id is provided, returns labels for that specific team; if omitted, returns all labels across the workspace. Label names are not unique across teams — always use returned IDs, not names, and track each label ID with its team ID. In large workspaces, results may paginate; follow pageInfo.hasNextPage and pageInfo.endCursor to retrieve all labels.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination. Use the \`endCursor\` value from the previous response's \`page\_info\` to fetch the next page. \|
\| \`first\` \| integer \| No \| Number of labels to return per page. Maximum 250. Use with \`after\` to paginate through all labels. \|
\| \`team\_id\` \| string \| No \| The unique identifier of the team for which to retrieve labels. If provided, returns labels scoped to that specific team. If omitted, returns all labels across the workspace. Workspace-wide label IDs (returned when team\_id is omitted) may not be valid for team-scoped mutations like LINEAR\_CREATE\_LINEAR\_ISSUE or LINEAR\_UPDATE\_ISSUE; pass the relevant team\_id to get labels valid for that team. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List linear projects

\*\*Slug:\*\* \`LINEAR\_LIST\_LINEAR\_PROJECTS\`

Retrieves all projects from the Linear account. Returns a flat array (not a GraphQL connection) with fields id and name; use LINEAR\_RUN\_QUERY\_OR\_MUTATION for progress, state, issues, or team linkage. No server-side filtering: all workspace projects are returned regardless of team or name — filter client-side. Multiple projects can share identical names; always confirm project\_id before downstream use. Results are permission-scoped to the connected user. Pagination: loop while page\_info.hasNextPage is true, passing page\_info.endCursor as after, or results will be silently truncated. HTTP 429 may occur in large workspaces; apply exponential backoff between calls.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination. Use the \`endCursor\` from the previous response's \`page\_info\` to fetch the next page. \|
\| \`first\` \| integer \| No \| Number of projects to return per page. Use with \`after\` to paginate through all projects. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Linear states

\*\*Slug:\*\* \`LINEAR\_LIST\_LINEAR\_STATES\`

Retrieves all workflow states for a specified team in Linear, representing the stages an issue progresses through in that team's workflow. Returned state IDs are team-scoped — never reuse a stateId across different teams, as this causes validation errors or 'Entity not found' failures in tools like LINEAR\_UPDATE\_ISSUE. State names (e.g., 'Done', 'In Progress') are non-unique across teams; always resolve names to IDs via this tool for the specific team\_id before using them in filters or mutations. Uses cursor-based pagination via pageInfo.hasNextPage and endCursor; iterate until hasNextPage is false to avoid missing states in large workspaces. Always fetch fresh state IDs rather than hardcoding or reusing stale values.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination. Use the \`endCursor\` value from the previous response's \`page\_info\` to fetch the next page. \|
\| \`first\` \| integer \| No \| Number of states to return per page. Maximum 250. Use with \`after\` to paginate through all states. \|
\| \`team\_id\` \| string \| Yes \| UUID of a team in your Linear workspace. Must be a valid UUID (e.g., '2a6e9b1b-19cd-4e30-b5bd-7b34dc491c7e'). To find valid team IDs, first use the 'Get all teams' or 'Get teams' action to list teams in your workspace. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get teams

\*\*Slug:\*\* \`LINEAR\_LIST\_LINEAR\_TEAMS\`

Retrieves all teams with their members and projects. Use stable team IDs or keys (not display names) for subsequent operations — names are non-unique. Results reflect only teams visible to the authenticated token scope; missing teams or members indicate permission limits. Large workspaces paginate via pageInfo.hasNextPage/endCursor — incomplete pagination silently drops teams or members. Members may belong to multiple teams; deduplicate user IDs when aggregating. Use LINEAR\_GET\_ALL\_LINEAR\_TEAMS instead when only identifiers are needed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination. Use the \`endCursor\` value from the previous response's \`page\_info\` to fetch the next page. \|
\| \`first\` \| integer \| No \| Number of teams to return per page. Maximum 250. Use with \`after\` to paginate through all teams. \|
\| \`project\_id\` \| string \| No \| Optional project ID to filter teams' associated projects. If provided, only projects matching this ID will be included in each team's 'projects' list. If not provided, all projects for each team will be returned. Filtering is applied per-team after fetch; a project\_id belonging to a different team silently returns an empty projects list rather than an error. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Linear users

\*\*Slug:\*\* \`LINEAR\_LIST\_LINEAR\_USERS\`

Lists all workspace users (not team-scoped) with their IDs, names, emails, and active status. Display names are non-unique — use email to disambiguate before extracting an ID. Only assign users with \`active: true\`. Returned IDs are UUID strings; pass them as-is to fields like \`assignee\_id\` — never substitute names, emails, or tokens. When joining with other tools, always join on IDs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination. Use the \`endCursor\` from the previous response's \`page\_info\` to fetch the next set of users. \|
\| \`first\` \| integer \| No \| Number of users to return. In large workspaces, check \`page\_info.hasNextPage\` and paginate using \`after\`; omitting pagination silently drops users beyond this limit. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List project updates

\*\*Slug:\*\* \`LINEAR\_LIST\_PROJECT\_UPDATES\`

Retrieves all project updates from the Linear workspace. Project updates are status posts written by team members to communicate project progress, blockers, and health. Use when you need to fetch project update history, track project health over time, or review team communication. Returns a paginated list with fields including id, body, health, createdAt, url, user, and project. Results are permission-scoped to the connected user — only updates from accessible projects are returned. Pagination: loop while page\_info.hasNextPage is true, passing page\_info.endCursor as after, or results will be silently truncated. HTTP 429 may occur in large workspaces; apply exponential backoff between calls.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination. Use the \`endCursor\` from the previous response's \`page\_info\` to fetch the next page. \|
\| \`first\` \| integer \| No \| Number of project updates to return per page. Use with \`after\` to paginate through all updates. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove label from Linear issue

\*\*Slug:\*\* \`LINEAR\_REMOVE\_ISSUE\_LABEL\`

Removes a specified label from an existing Linear issue using their IDs; successful even if the label isn't on the issue. Operation is irreversible — obtain explicit user approval before executing. Use this tool instead of LINEAR\_UPDATE\_ISSUE to avoid replacing the entire label set.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`issue\_id\` \| string \| Yes \| Identifier of the Linear issue from which to remove the label. Verify this is the correct issue before executing; wrong IDs can silently remove labels from unintended issues without error. \|
\| \`label\_id\` \| string \| Yes \| Identifier of the label to remove. The operation is successful without change if this label isn't on the issue. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove reaction from comment

\*\*Slug:\*\* \`LINEAR\_REMOVE\_REACTION\`

Tool to remove a reaction on a comment. Use when you have a reaction ID and need to delete it.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`reaction\_id\` \| string \| Yes \| Identifier of the reaction to delete. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Resolve comment

\*\*Slug:\*\* \`LINEAR\_RESOLVE\_COMMENT\`

Marks a Linear comment as resolved. This action is used when a comment thread or discussion has been addressed and should be marked as complete. Use this action when you need to resolve a comment after addressing the feedback or discussion it represents. The comment remains visible but is marked as resolved with a timestamp and the resolving user's information.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The ID of the comment to resolve. Must be a valid UUID format (e.g., 'c5ac5ead-ae3b-4d54-8c5b-9ca103896021'). Use LIST\_LINEAR\_ISSUES or GET\_LINEAR\_ISSUE to retrieve issue comments and their IDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Run Query or Mutation

\*\*Slug:\*\* \`LINEAR\_RUN\_QUERY\_OR\_MUTATION\`

Execute any GraphQL query or mutation against Linear's API. USE WHEN: No dedicated action exists, need complex filtering, custom fields, or schema discovery. \*\*\* INTROSPECTION FIRST - NEVER GUESS FIELD NAMES \*\*\* Run introspection before unknown operations: - query { \_\_type(name: "Issue") { fields { name } } } - query { \_\_type(name: "Mutation") { fields { name } } } Linear uses nested objects (project { id }), NOT scalar IDs (projectId). KEY: All IDs are UUIDs. Filter: { field: { eq: value } }. Pagination: nodes\[\] + pageInfo.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`variables\` \| object \| No \| Variables for the GraphQL operation as a JSON object. Optional - omit this field or use {} if no variables are needed. RULES: - Keys must match variable names in query (without '$' prefix) - Types must align with query definition (String/Int/Boolean/ID/DateTime/arrays) - ID-type variables: Declare as ID in query ($projectId: ID!), but pass as string in variables dict Example: query has "$teamId: ID!" -> variables {"teamId": "TEAM\_UUID"} - ID-type variables (e.g., issueId, teamId, stateId) must not be empty strings ERROR RECOVERY: - If query with variables fails, test with variables={} first to confirm query syntax is valid - Verify IDs exist by querying for them before using in mutations \|
\| \`query\_or\_mutation\` \| string \| Yes \| GraphQL query or mutation for Linear's API. Must be a non-empty, valid GraphQL query or mutation string. RULES (each prevents a silent failure or hard-to-debug error): 1. INTROSPECTION FIRST: Never guess field/mutation names. Run \_\_type introspection before any uncertain operation. 2. INPUT vs OUTPUT naming: Query outputs use nested objects (lead { id name }), but mutation inputs use scalar ID fields (leadId: "UUID"). Using lead: { id: "..." } in input causes "Did you mean leadId?" errors. 3. POLYMORPHIC TYPES: Interfaces/unions (e.g., Notification) require inline fragments for subtype-specific fields. Use ... on IssueNotification { issue { id } } instead of querying issue directly on Notification. 4. NO totalCount: Connection types have only nodes and pageInfo. totalCount does not exist (unlike GitHub/GitLab). 5. DEPRECATED issueSearch: Use issues(filter: {...}) or searchIssues(term: "text") instead. issueSearch returns INPUT\_ERROR. 6. FILTER OPERATORS: Use nin (NOT notIn) for "not in array". Use eq/neq/in/nin/contains/gt/gte/lt/lte. STRING CASE SENSITIVITY (CRITICAL): ALL string operators (eq, neq, contains, startsWith, endsWith, etc.) are case-sensitive. Linear provides NO case-insensitive operators (eqCaseInsensitive, containsCaseInsensitive, etc. do NOT exist). For state name matching, query exact state names or use state.type field. For user/entity search, prefer contains with exact casing or query first then filter. 7. SORT vs ORDERBY (MUTUALLY EXCLUSIVE - use ONE or the OTHER, NEVER both): - orderBy: Simple enum values for common sorting (createdAt, updatedAt). Example: orderBy: createdAt - sort: Complex objects for manual ordering with granular control. Example: sort: \[{ manual: { order: Ascending } }\] - CRITICAL: Using both simultaneously causes INPUT\_ERROR: "Cannot use both sort and orderBy options" - Use Ascending/Descending (capitalized) for sort enums, NOT asc/desc 8. LABELS ARE TEAM-SCOPED: No root-level labels query. Access via teams { nodes { labels { nodes { ... } } } }. Never use isGroup:true labels directly. 9. LABEL FILTERS: No 'none' operator. Use labels: { length: { eq: 0 } } for issues with no labels. Available: some (default), every, length, null. 10. SEARCH: searchIssues(term: "text") - term is required String!, NOT 'query'. 11. DATE TYPES: Date filters use DateTimeOrDuration! (not DateTime!). TimelessDate="YYYY-MM-DD" for project dates. DateTime="2024-01-15T10:30:00Z". 12. ID EXCEPTIONS: team(id:), project(id:), issue(id:), issueUpdate(id:) use String!, not ID!. Entity IDs in filters use ID! type. 13. PROJECT.LEAD: Singular User object (nullable), NOT a connection. Use lead { id name }, NOT leads { nodes { ... } }. 14. PROJECT.STATE: Scalar String ("planned", "started", etc.), not an object. Use statusId (not 'state') in ProjectCreateInput/ProjectUpdateInput. 15. PROJECT FILTER: Use accessibleTeams.some, NOT 'team'. Example: { accessibleTeams: { some: { key: { eq: "ENG" } } } } 16. CYCLE.PROGRESS: Scalar Float (0.0-1.0), NOT an object. Use currentProgress for detailed scope data. 17. INTEGRATION FIELDS: Only id, service, createdAt, updatedAt, archivedAt, organization, team, creator. No key/name/type/url/description fields. 18. DOCUMENTCONTENT vs DOCUMENTS: documentContent is inline content body (no title field). documents is the connection with title/summary metadata. 19. DELETE PAYLOADS: Most return DeletePayload { success entityId }. Issue/project deletes return ArchivePayload { success entity { id } }. Use introspection if unsure. 20. DOCUMENT CREATE: Requires at least one relation field (projectId, issueId, teamId, etc.) or you get INVALID\_INPUT. 21. FILE UPLOAD: uploadUrl/assetUrl are nested under uploadFile, NOT direct fields on UploadPayload. 22. WEBHOOKS: webhookCreate requires EITHER teamId OR allPublicTeams: true. 23. COMMENTS: commentCreate uses issueId (NOT projectId). Use parentId for replies. 24. QUERY COMPLEXITY: Max 10,000 points. Use first: 10-25 with nested connections. "Query too complex" = reduce pagination or nesting. 25. CONNECTIONS: \*Connection/\*SearchPayload types need nodes wrapper. Other Payloads don't. 26. FILTER SYNTAX: { field: { eq: value } }, { or: \[...\] } (lowercase 'or'). NULL checks: { field: { eq: null } } or { neq: null }. 27. INITIATIVE STATUS: Use bare enum in mutations (status: Active), quoted string in filters (status: { eq: "Active" }). 28. CUSTOMVIEW: Has NO 'url' field (unlike Issue). Use slugId for identification. ERROR RECOVERY: On field errors, run \_\_type introspection. On enum errors, introspect the enum. On complexity errors, reduce pagination. Docs: https://developers.linear.app/docs/graphql/working-with-the-graphql-api \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search Linear issues

\*\*Slug:\*\* \`LINEAR\_SEARCH\_ISSUES\`

Search Linear issues using full-text search across identifier, title, and description. Use when you need to find issues by keywords or specific identifiers. Note: This endpoint only supports full-text search; for structured filtering by team, project, assignee, state, or labels, use LIST\_ISSUES\_BY\_TEAM\_ID instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| string \| No \| Cursor for pagination. Use the endCursor from the previous response's page\_info to fetch the next page of results. \|
\| \`first\` \| integer \| No \| Number of issues to return per page. Must be between 1 and 50. Defaults to 25. \|
\| \`query\` \| string \| Yes \| The search query text. Searches across issue identifier (e.g., 'ENG-123'), title, and description fields. This is a full-text search only; structured filtering by team, project, assignee, state, or labels is NOT supported on this endpoint. Use LIST\_ISSUES\_BY\_TEAM\_ID for filtered queries. \|
\| \`include\_archived\` \| boolean \| No \| Whether to include archived issues in search results. Defaults to false (only active issues). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Unarchive Project Update

\*\*Slug:\*\* \`LINEAR\_UNARCHIVE\_PROJECT\_UPDATE\`

Unarchive a previously archived project update in Linear. Use this action when you need to restore an archived project update to make it visible and active again. Archived project updates are hidden from normal views but can be restored using this action. Use when a project update was archived by mistake or needs to be brought back into active use.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier (UUID) of the project update to unarchive. Must be a valid Linear project update UUID in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Unresolve a comment

\*\*Slug:\*\* \`LINEAR\_UNRESOLVE\_COMMENT\`

Unresolves a previously resolved Linear comment, marking it as requiring attention again. Use this action when you need to reopen a comment thread that was previously marked as resolved. This is useful when additional discussion is needed or the resolution was premature.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`comment\_id\` \| string \| Yes \| Unique identifier of the comment to unresolve. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update issue

\*\*Slug:\*\* \`LINEAR\_UPDATE\_ISSUE\`

Updates an existing Linear issue using its \`issue\_id\`; requires at least one other attribute for modification, and all provided entity IDs (for state, assignee, labels, etc.) must be valid UUIDs — only \`issueId\` accepts key format (e.g., 'ENG-123'). All updated fields are fully overwritten, not merged; omit any field you do not intend to change.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| No \| New title for the issue. \|
\| \`teamId\` \| string \| No \| UUID of the team to move the issue to. Use this to transfer an issue from one team to another. The team must exist in your workspace and you must have access to it. Use the GET\_ALL\_LINEAR\_TEAMS or LIST\_LINEAR\_TEAMS action to get valid team IDs. \|
\| \`cycleId\` \| string \| No \| UUID of the cycle (sprint) to assign this issue to. Must be a valid UUID in the format 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'. IMPORTANT: Cycles are team-scoped in Linear. The cycle must belong to the same team as the issue, otherwise the API will reject the request with an error. Use GET\_CYCLES\_BY\_TEAM\_ID with the issue's team\_id to get valid cycle IDs. \|
\| \`dueDate\` \| string \| No \| New due date in ISO8601 datetime format or YYYY-MM-DD TimelessDate format (e.g., '2024-12-31' or '2024-12-31T23:59:59Z') \|
\| \`issueId\` \| string \| Yes \| Identifier of the issue to update. Accepts either UUID format (e.g., 'd282c513-3265-4513-9099-abc0123def45') or issue key format (e.g., 'ENG-123', 'BLA-456'). \|
\| \`stateId\` \| string \| No \| UUID of the workflow state to transition the issue to. Must be a valid UUID in the format 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' (e.g., 'f47ac10b-58cc-4372-a567-0e02b2c3d479'). Do NOT use state names like 'To Do', 'In Progress', or 'Done'. IMPORTANT: Workflow states are team-scoped in Linear. The state must belong to the same team as the issue, otherwise the API will reject the request with an error. Use LIST\_LINEAR\_STATES with the issue's team\_id to get valid state IDs. \|
\| \`estimate\` \| integer \| No \| Estimate points for the issue (e.g., 1, 2, 3, 5, 8). Teams may use different estimation types: exponential, fibonacci, linear, or t-shirt sizing. \|
\| \`labelIds\` \| array \| No \| List of label identifiers to set; replaces all existing labels. An empty list removes all labels. \|
\| \`parentId\` \| string \| No \| UUID of an existing issue to set as this issue's parent (making this issue a sub-issue). The parent issue must not create a circular dependency (e.g., the parent cannot be this issue itself or one of its descendants), and you must have access to it. Sub-issues can be assigned to any team in the workspace. \|
\| \`priority\` \| integer \| No \| Priority: 0 (No), 1 (Urgent), 2 (High), 3 (Normal), 4 (Low). \|
\| \`projectId\` \| string \| No \| UUID of the project to associate the issue with. Must be a valid UUID in the format 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'. IMPORTANT: Projects are team-scoped in Linear. The project must belong to the same team as the issue, otherwise the API will reject the request with an error. Use LINEAR\_LIST\_LINEAR\_PROJECTS action to get valid project IDs and LINEAR\_GET\_LINEAR\_PROJECT with include\_teams=true to verify a project's team. \|
\| \`assigneeId\` \| string \| No \| UUID of the user to assign to the issue. Must be a valid user UUID from your Linear workspace (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx). Use LIST\_LINEAR\_USERS to get valid user IDs. Do NOT use placeholder values like '' or '{USER\_ID}'. \|
\| \`description\` \| string \| No \| New Markdown description for the issue. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update a comment

\*\*Slug:\*\* \`LINEAR\_UPDATE\_LINEAR\_COMMENT\`

Tool to update an existing Linear comment's body text. Use when you need to edit or modify the content of a previously created comment.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`body\` \| string \| Yes \| New comment content, in plain text or Markdown format. \|
\| \`comment\_id\` \| string \| Yes \| Unique identifier of the comment to update. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Project

\*\*Slug:\*\* \`LINEAR\_UPDATE\_LINEAR\_PROJECT\`

Tool to update an existing Linear project. Use when you need to modify project properties like name, description, state, dates, or lead. All fields except project\_id are optional - only provide the fields you want to update.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`icon\` \| string \| No \| Icon identifier for the project. \|
\| \`name\` \| string \| No \| New name for the project. \|
\| \`color\` \| string \| No \| Color for the project (hex color code). \|
\| \`state\` \| string \| No \| The state of the project. Standard values: 'backlog', 'planned', 'started', 'completed', 'canceled'. Note: Some workspaces may have custom states configured. \|
\| \`lead\_id\` \| string \| No \| The UUID of the user who will lead this project. Must be a valid Linear user UUID. Use the LIST\_LINEAR\_USERS action to get valid user IDs. \|
\| \`priority\` \| integer \| No \| Priority level of the project. 0 = No priority, 1 = Urgent, 2 = High, 3 = Normal, 4 = Low. \|
\| \`status\_id\` \| string \| No \| The UUID of the project status to set. Must be a valid Linear project status UUID. \|
\| \`project\_id\` \| string \| Yes \| The unique identifier (UUID) of the project to update. This is the internal Linear ID, not the project slug or name. \|
\| \`start\_date\` \| string \| No \| New planned start date. Accepts various formats including YYYY-MM-DD, ISO datetime strings (e.g., 2024-01-15T10:30:00Z), or Unix timestamps. Will be normalized to YYYY-MM-DD format for the API. \|
\| \`description\` \| string \| No \| New description for the project. Supports plain text. \|
\| \`target\_date\` \| string \| No \| New planned completion date. Accepts various formats including YYYY-MM-DD, ISO datetime strings (e.g., 2024-06-30T23:59:59Z), or Unix timestamps. Will be normalized to YYYY-MM-DD format for the API. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Project Update

\*\*Slug:\*\* \`LINEAR\_UPDATE\_PROJECT\_UPDATE\`

Tool to update an existing Linear project update post. Use this action when you need to modify a project update's content, health status, or diff visibility settings. All fields except the update ID are optional - only provide the fields you want to update. Changes are immediately visible to all team members viewing the project.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier (UUID) of the project update to update. Must be a valid Linear project update UUID in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. \|
\| \`body\` \| string \| No \| The new body content of the project update. Supports markdown formatting. This is the main content describing the project status, progress, blockers, and next steps. \|
\| \`health\` \| string ("onTrack" \| "atRisk" \| "offTrack") \| No \| Health status for a project update in Linear. \|
\| \`is\_diff\_hidden\` \| boolean \| No \| Optional flag to control whether the diff (changes since last update) should be hidden in the update. If true, the diff will not be displayed. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Team

\*\*Slug:\*\* \`LINEAR\_UPDATE\_TEAM\`

Updates an existing Linear team's settings and configuration. Use when you need to modify team properties like name, description, key, cycle settings, workflow states, or other team-level configurations. All fields except team\_id are optional - only provide the fields you want to update.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`key\` \| string \| No \| New unique key/slug for the team. This is used in issue identifiers (e.g., 'ENG' for 'ENG-123'). Must be uppercase letters only, typically 2-5 characters. \|
\| \`icon\` \| string \| No \| New icon identifier for the team. Must be a valid Linear icon name (e.g., 'Chip', 'Database', 'Rocket', 'Code', 'Palette'), not an emoji. \|
\| \`name\` \| string \| No \| New name for the team. \|
\| \`color\` \| string \| No \| New color for the team (hex color code). \|
\| \`private\` \| boolean \| No \| Whether the team is private (visible only to members) or public (visible to all workspace members). \|
\| \`team\_id\` \| string \| Yes \| The unique identifier (UUID) of the team to update. This is the internal Linear team ID, not the team key or name. Use LINEAR\_GET\_ALL\_LINEAR\_TEAMS or LINEAR\_LIST\_LINEAR\_TEAMS to get valid team IDs. \|
\| \`timezone\` \| string \| No \| Timezone for the team (e.g., 'America/Los\_Angeles', 'Europe/London', 'UTC'). \|
\| \`description\` \| string \| No \| New description for the team. Supports plain text. \|
\| \`cycleDuration\` \| integer \| No \| Duration of cycles (sprints) in weeks for this team. \|
\| \`cycleStartDay\` \| integer \| No \| Day of the week when cycles (sprints) start for this team. 0 = Monday, 1 = Tuesday, ..., 6 = Sunday. \|
\| \`triageEnabled\` \| boolean \| No \| Whether triage mode is enabled for this team. When enabled, new issues go into a triage state first. \|
\| \`autoClosePeriod\` \| number \| No \| Number of months after which inactive issues in certain states are automatically closed. Set to 0 to disable auto-closing. \|
\| \`autoCloseStateId\` \| string \| No \| UUID of the workflow state to transition issues to when they are auto-closed. \|
\| \`autoArchivePeriod\` \| number \| No \| Number of months after which completed issues are automatically archived. Set to 0 to disable auto-archiving. \|
\| \`cycleCooldownTime\` \| integer \| No \| Cooldown period in minutes at the end of each cycle before the next cycle starts. \|
\| \`cycleLockToActive\` \| boolean \| No \| Whether to lock issues to the active cycle, preventing them from being moved to other cycles. \|
\| \`upcomingCycleCount\` \| integer \| No \| Number of upcoming cycles to create automatically. Must be one of: 1, 2, 3, 4, 6, 8, 10, 12, 15. \|
\| \`draftWorkflowStateId\` \| string \| No \| UUID of the workflow state for draft issues in this team. \|
\| \`mergeWorkflowStateId\` \| string \| No \| UUID of the workflow state for merged issues. \|
\| \`startWorkflowStateId\` \| string \| No \| UUID of the workflow state that marks when work on an issue starts. \|
\| \`reviewWorkflowStateId\` \| string \| No \| UUID of the workflow state for issues under review. \|
\| \`cycleIssueAutoAssignStarted\` \| boolean \| No \| Whether to automatically assign started issues to the current cycle. \|
\| \`cycleIssueAutoAssignCompleted\` \| boolean \| No \| Whether to automatically assign completed issues to the current cycle. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Validate credential

\*\*Slug:\*\* \`LINEAR\_VALIDATE\_CREDENTIAL\`

Validates the Linear API credentials by checking if the authentication token can successfully query the current user. Use this action when you need to verify that API credentials are valid before performing other operations, or to confirm that authentication is working correctly. This is particularly useful for connection testing, credential verification flows, or troubleshooting authentication issues.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\## Triggers

\### Comment Received Trigger

\*\*Slug:\*\* \`LINEAR\_COMMENT\_EVENT\_TRIGGER\`

\*\*Type:\*\* webhook

Triggered when a comment is received.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\_id\` \| string \| Yes \| ID of the team to filter issues by \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`action\` \| string \| Yes \| Action that triggered the webhook \|
\| \`data\` \| object \| Yes \| Data of the issue \|
\| \`type\` \| string \| Yes \| Type of the issue \|
\| \`url\` \| string \| Yes \| URL of the issue \|

\### Issue Created Trigger

\*\*Slug:\*\* \`LINEAR\_ISSUE\_CREATED\_TRIGGER\`

\*\*Type:\*\* webhook

Triggered when a new issue is created.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\_id\` \| string \| Yes \| ID of the team to filter issues by \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`action\` \| string \| Yes \| Action that triggered the webhook \|
\| \`data\` \| object \| Yes \| Data of the issue \|
\| \`type\` \| string \| Yes \| Type of the issue \|
\| \`url\` \| string \| Yes \| URL of the issue \|

\### Issue Updated Trigger

\*\*Slug:\*\* \`LINEAR\_ISSUE\_UPDATED\_TRIGGER\`

\*\*Type:\*\* webhook

Triggered when an issue is updated. For example labels are changed, issue status is changed, etc.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\_id\` \| string \| Yes \| ID of the team to filter issues by \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`action\` \| string \| Yes \| Action that triggered the webhook \|
\| \`data\` \| object \| Yes \| Data of the issue \|
\| \`type\` \| string \| Yes \| Type of the issue \|
\| \`url\` \| string \| Yes \| URL of the issue \|

\### Private Team Comment Created

\*\*Slug:\*\* \`LINEAR\_PRIVATE\_TEAM\_COMMENT\_CREATED\`

\*\*Type:\*\* poll

Fires when a new comment is posted on an issue in a private Linear team (polled with the connected user's token).

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`team\_id\` \| string \| Yes \| UUID of the private Linear team to monitor. The connected user must be a member. Use \`LINEAR\_LIST\_LINEAR\_TEAMS\` to discover valid team UUIDs. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`body\` \| string \| Yes \| Comment body in markdown. \|
\| \`createdAt\` \| string \| Yes \| ISO 8601 timestamp. \|
\| \`id\` \| string \| Yes \| Comment UUID. \|
\| \`issue\` \| object \| Yes \| Issue the comment was posted on. \|
\| \`parent\` \| object \| No \| Lightweight reference to a parent comment. Linear's GraphQL \`\`Comment.parent\`\` is itself a full \`\`Comment\`\` type (carries \`\`body\`\`, \`\`user\`\`, \`\`createdAt\`\`, …); we only query \`\`id\`\` today because that's what current customer use-cases need. Kept as a relation object — not flattened to a scalar — so a future need to surface the parent's body or author can extend this class + \`\`\_TEAM\_COMMENTS\_QUERY\`\` without breaking the canonical model. \|
\| \`updatedAt\` \| string \| Yes \| ISO 8601 timestamp. \|
\| \`url\` \| string \| No \| Comment URL. \|
\| \`user\` \| object \| No \| Reference to a Linear workspace member (assignee, creator, comment author). \|

\### Private Team Issue Created

\*\*Slug:\*\* \`LINEAR\_PRIVATE\_TEAM\_ISSUE\_CREATED\`

\*\*Type:\*\* poll

Fires when a new issue appears in a private Linear team (polled with the connected user's token).

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`team\_id\` \| string \| Yes \| UUID of the private Linear team to monitor. The connected user must be a member. Use \`LINEAR\_LIST\_LINEAR\_TEAMS\` to discover valid team UUIDs. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`assignee\` \| object \| No \| Reference to a Linear workspace member (assignee, creator, comment author). \|
\| \`createdAt\` \| string \| Yes \| ISO 8601 creation timestamp. \|
\| \`creator\` \| object \| No \| Reference to a Linear workspace member (assignee, creator, comment author). \|
\| \`description\` \| string \| No \| Issue description in markdown; may be empty. \|
\| \`estimate\` \| number \| No \| Issue point estimate. \|
\| \`id\` \| string \| Yes \| Issue UUID. \|
\| \`identifier\` \| string \| Yes \| Human-readable Linear identifier, e.g. \`ENG-123\`. \|
\| \`labels\` \| array \| Yes \| Labels attached to the issue. \|
\| \`number\` \| integer \| No \| Sequential issue number within the team. \|
\| \`priority\` \| integer \| Yes \| Priority value (0=No priority, 1=Urgent, 2=High, 3=Medium, 4=Low). \|
\| \`priorityLabel\` \| string \| No \| Human-readable priority label. \|
\| \`project\` \| object \| No \| Lightweight reference to a project. \|
\| \`state\` \| object \| Yes \| Current workflow state. \|
\| \`team\` \| object \| Yes \| Team the issue belongs to. \|
\| \`title\` \| string \| Yes \| Issue title. \|
\| \`updatedAt\` \| string \| Yes \| ISO 8601 last-update timestamp. \|
\| \`url\` \| string \| Yes \| Linear web URL of the issue. \|

\### Private Team Issue Properties Updated

\*\*Slug:\*\* \`LINEAR\_PRIVATE\_TEAM\_ISSUE\_PROPERTIES\_UPDATED\`

\*\*Type:\*\* poll

Fires when properties on an issue change in a private Linear team (polled with the connected user's token).

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`team\_id\` \| string \| Yes \| UUID of the private Linear team to monitor. The connected user must be a member. Use \`LINEAR\_LIST\_LINEAR\_TEAMS\` to discover valid team UUIDs. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`assignee\` \| object \| No \| Reference to a Linear workspace member (assignee, creator, comment author). \|
\| \`createdAt\` \| string \| Yes \| ISO 8601 creation timestamp. \|
\| \`creator\` \| object \| No \| Reference to a Linear workspace member (assignee, creator, comment author). \|
\| \`description\` \| string \| No \| Issue description in markdown; may be empty. \|
\| \`estimate\` \| number \| No \| Issue point estimate. \|
\| \`id\` \| string \| Yes \| Issue UUID. \|
\| \`identifier\` \| string \| Yes \| Human-readable Linear identifier, e.g. \`ENG-123\`. \|
\| \`labels\` \| array \| Yes \| Labels attached to the issue. \|
\| \`number\` \| integer \| No \| Sequential issue number within the team. \|
\| \`priority\` \| integer \| Yes \| Priority value (0=No priority, 1=Urgent, 2=High, 3=Medium, 4=Low). \|
\| \`priorityLabel\` \| string \| No \| Human-readable priority label. \|
\| \`project\` \| object \| No \| Lightweight reference to a project. \|
\| \`state\` \| object \| Yes \| Current workflow state. \|
\| \`team\` \| object \| Yes \| Team the issue belongs to. \|
\| \`title\` \| string \| Yes \| Issue title. \|
\| \`updatedAt\` \| string \| Yes \| ISO 8601 last-update timestamp. \|
\| \`url\` \| string \| Yes \| Linear web URL of the issue. \|

\### Project Created

\*\*Slug:\*\* \`LINEAR\_PROJECT\_CREATED\`

\*\*Type:\*\* poll

Fires when a new Linear project is created. Covers projects in both public and private teams — polls with the connected user's token, so visibility matches what the connected user can see in Linear.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`color\` \| string \| No \| Hex color of the project. \|
\| \`createdAt\` \| string \| Yes \| ISO 8601 timestamp. \|
\| \`creator\` \| object \| No \| Reference to a Linear workspace member (assignee, creator, comment author). \|
\| \`description\` \| string \| No \| Project description; may be empty. \|
\| \`id\` \| string \| Yes \| Project UUID. \|
\| \`lead\` \| object \| No \| Reference to a Linear workspace member (assignee, creator, comment author). \|
\| \`name\` \| string \| Yes \| Project name. \|
\| \`priority\` \| integer \| No \| Priority value, same scale as issues (0=None…4=Low). \|
\| \`startDate\` \| string \| No \| Planned start date (YYYY-MM-DD). \|
\| \`state\` \| string \| No \| High-level lifecycle state (\`backlog\`, \`planned\`, \`started\`, \`paused\`, \`completed\`, \`canceled\`). \|
\| \`targetDate\` \| string \| No \| Planned target date (YYYY-MM-DD). \|
\| \`teams\` \| array \| Yes \| Teams the project spans (one or more). \|
\| \`updatedAt\` \| string \| Yes \| ISO 8601 timestamp. \|
\| \`url\` \| string \| Yes \| Linear web URL of the project. \|

\### Project Properties Updated

\*\*Slug:\*\* \`LINEAR\_PROJECT\_PROPERTIES\_UPDATED\`

\*\*Type:\*\* poll

Fires when properties on a Linear project change (status, lead, target date, priority, etc.). Covers projects in both public and private teams — polls with the connected user's token.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`project\_id\` \| string \| No \| Optional Linear project UUID. When set, polls only this project. Use \`LINEAR\_LIST\_LINEAR\_PROJECTS\` to discover valid project UUIDs. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`color\` \| string \| No \| Hex color of the project. \|
\| \`createdAt\` \| string \| Yes \| ISO 8601 timestamp. \|
\| \`creator\` \| object \| No \| Reference to a Linear workspace member (assignee, creator, comment author). \|
\| \`description\` \| string \| No \| Project description; may be empty. \|
\| \`id\` \| string \| Yes \| Project UUID. \|
\| \`lead\` \| object \| No \| Reference to a Linear workspace member (assignee, creator, comment author). \|
\| \`name\` \| string \| Yes \| Project name. \|
\| \`priority\` \| integer \| No \| Priority value, same scale as issues (0=None…4=Low). \|
\| \`startDate\` \| string \| No \| Planned start date (YYYY-MM-DD). \|
\| \`state\` \| string \| No \| High-level lifecycle state (\`backlog\`, \`planned\`, \`started\`, \`paused\`, \`completed\`, \`canceled\`). \|
\| \`targetDate\` \| string \| No \| Planned target date (YYYY-MM-DD). \|
\| \`teams\` \| array \| Yes \| Teams the project spans (one or more). \|
\| \`updatedAt\` \| string \| Yes \| ISO 8601 timestamp. \|
\| \`url\` \| string \| Yes \| Linear web URL of the project. \|

\### Project Update Posted

\*\*Slug:\*\* \`LINEAR\_PROJECT\_UPDATE\_POSTED\`

\*\*Type:\*\* poll

Fires when a project status update is posted on the Linear project's Updates tab. Covers projects in both public and private teams — polls with the connected user's token.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`project\_id\` \| string \| No \| Optional Linear project UUID. When set, polls only this project. Use \`LINEAR\_LIST\_LINEAR\_PROJECTS\` to discover valid project UUIDs. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`body\` \| string \| Yes \| Project update body in markdown. \|
\| \`createdAt\` \| string \| Yes \| ISO 8601 timestamp. \|
\| \`health\` \| string \| Yes \| Project health label (\`onTrack\`, \`atRisk\`, \`offTrack\`). \|
\| \`id\` \| string \| Yes \| Project update UUID. \|
\| \`project\` \| object \| Yes \| Parent project reference. \|
\| \`updatedAt\` \| string \| Yes \| ISO 8601 timestamp. \|
\| \`user\` \| object \| No \| Reference to a Linear workspace member (assignee, creator, comment author). \|

\### Public Team Comment Created

\*\*Slug:\*\* \`LINEAR\_PUBLIC\_TEAM\_COMMENT\_CREATED\`

\*\*Type:\*\* webhook

Fires when a new comment is posted on a \*public-team\* Linear issue. For private teams (lock icon in Linear's sidebar) use \`LINEAR\_PRIVATE\_TEAM\_COMMENT\_CREATED\`.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\_id\` \| string \| No \| Optional Linear team UUID. Leave unset to fire workspace-wide. Use \`LINEAR\_LIST\_LINEAR\_TEAMS\` to discover valid team UUIDs. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`actor\` \| object \| No \| User, app, or system actor that produced the event. \|
\| \`createdAt\` \| string \| Yes \| ISO 8601 event timestamp. \|
\| \`data\` \| object \| Yes \| Typed inner payload — see trigger docstring. \|
\| \`organizationId\` \| string \| Yes \| Linear organization UUID. \|
\| \`url\` \| string \| Yes \| Linear URL of the resource. \|

\### Public Team Issue Created

\*\*Slug:\*\* \`LINEAR\_PUBLIC\_TEAM\_ISSUE\_CREATED\`

\*\*Type:\*\* webhook

Fires when a new issue is created in a Linear \*public\* team. For private teams (lock icon in Linear's sidebar) use \`LINEAR\_PRIVATE\_TEAM\_ISSUE\_CREATED\`.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\_id\` \| string \| No \| Optional Linear team UUID. Leave unset to fire workspace-wide. Use \`LINEAR\_LIST\_LINEAR\_TEAMS\` to discover valid team UUIDs. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`actor\` \| object \| No \| User, app, or system actor that produced the event. \|
\| \`createdAt\` \| string \| Yes \| ISO 8601 event timestamp. \|
\| \`data\` \| object \| Yes \| Typed inner payload — see trigger docstring. \|
\| \`organizationId\` \| string \| Yes \| Linear organization UUID. \|
\| \`url\` \| string \| Yes \| Linear URL of the resource. \|

\### Public Team Issue Properties Updated

\*\*Slug:\*\* \`LINEAR\_PUBLIC\_TEAM\_ISSUE\_PROPERTIES\_UPDATED\`

\*\*Type:\*\* webhook

Fires when properties on a \*public-team\* Linear issue change (status, assignee, priority, labels, etc.). For private teams (lock icon in Linear's sidebar) use \`LINEAR\_PRIVATE\_TEAM\_ISSUE\_PROPERTIES\_UPDATED\`.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\_id\` \| string \| No \| Optional Linear team UUID. Leave unset to fire workspace-wide. Use \`LINEAR\_LIST\_LINEAR\_TEAMS\` to discover valid team UUIDs. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`actor\` \| object \| No \| User, app, or system actor that produced the event. \|
\| \`createdAt\` \| string \| Yes \| ISO 8601 event timestamp. \|
\| \`data\` \| object \| Yes \| Typed inner payload — see trigger docstring. \|
\| \`organizationId\` \| string \| Yes \| Linear organization UUID. \|
\| \`url\` \| string \| Yes \| Linear URL of the resource. \|
