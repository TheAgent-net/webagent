---
url: https://docs.composio.dev/toolkits/fathom.md
title: https://docs.composio.dev/toolkits/fathom.md
description: 
status: 200
---

\# Fathom

AI meeting assistant that records, transcribes, and summarizes meetings

\- \*\*Category:\*\* ai meeting assistants
\- \*\*Auth:\*\* OAUTH2, API\_KEY
\- \*\*Composio-managed OAuth available?\*\* Yes
\- \*\*Tools:\*\* 7
\- \*\*Triggers:\*\* 0
\- \*\*Slug:\*\* \`FATHOM\`
\- \*\*Version:\*\* 20260724\_00

\## Tools

\### Create webhook for meeting content

\*\*Slug:\*\* \`FATHOM\_CREATE\_WEBHOOK\`

Tool to create a webhook to receive new meeting content from Fathom. Use when you need to set up notifications for meeting recordings. At least one of transcript, CRM matches, summary, or action items must be included in the webhook payload.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`triggered\_for\` \| array \| Yes \| Recording types to monitor. Valid values: 'my\_recordings', 'shared\_external\_recordings', 'my\_shared\_with\_team\_recordings', 'shared\_team\_recordings'. Must provide at least one type. \|
\| \`destination\_url\` \| string \| Yes \| The endpoint URL where webhook events will be sent. Must be a valid HTTPS URL. \|
\| \`include\_summary\` \| boolean \| No \| Whether to include meeting summaries in webhook payloads. At least one of include\_transcript, include\_summary, include\_action\_items, or include\_crm\_matches must be True. \|
\| \`include\_transcript\` \| boolean \| No \| Whether to include meeting transcripts in webhook payloads. At least one of include\_transcript, include\_summary, include\_action\_items, or include\_crm\_matches must be True. \|
\| \`include\_crm\_matches\` \| boolean \| No \| Whether to include CRM data matches in webhook payloads. At least one of include\_transcript, include\_summary, include\_action\_items, or include\_crm\_matches must be True. \|
\| \`include\_action\_items\` \| boolean \| No \| Whether to include extracted action items in webhook payloads. At least one of include\_transcript, include\_summary, include\_action\_items, or include\_crm\_matches must be True. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Webhook

\*\*Slug:\*\* \`FATHOM\_DELETE\_WEBHOOK\`

Tool to delete an existing webhook by its ID. Use when you need to remove a webhook that is no longer needed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique ID of the webhook to delete \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Recording Summary

\*\*Slug:\*\* \`FATHOM\_GET\_RECORDING\_SUMMARY\`

Tool to retrieve the AI-generated summary for a specific recording. Use when you need to access the summary of a meeting recording. Supports both synchronous mode (returns summary directly) and asynchronous mode (delivers summary to webhook URL specified in destination\_url parameter).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`recording\_id\` \| integer \| Yes \| The identifier for the specific meeting recording. \|
\| \`destination\_url\` \| string \| No \| Webhook URL for asynchronous delivery of the summary. If provided, the endpoint behaves asynchronously and returns a confirmation. If omitted, returns the summary directly (synchronous mode). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Recording Transcript

\*\*Slug:\*\* \`FATHOM\_GET\_RECORDING\_TRANSCRIPT\`

Tool to retrieve the full transcript for a specific recording. Use when you need to access the complete meeting transcript with speaker information and timestamps. Can operate synchronously (returns transcript directly) or asynchronously (posts transcript to a destination URL). In the response, speaker is an object — access speaker.display\_name rather than treating speaker as a string. Prefer this tool over fetching transcripts via list-meetings calls with include\_transcript=true, which produces extremely large responses when many meetings are returned.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`recording\_id\` \| integer \| Yes \| The ID of the meeting recording to fetch the transcript for. \|
\| \`destination\_url\` \| string \| No \| Optional destination URL for asynchronous transcript delivery via POST. If provided, the transcript will be posted to this URL instead of being returned directly. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Meetings

\*\*Slug:\*\* \`FATHOM\_LIST\_MEETINGS\`

Tool to retrieve a paginated list of meeting recordings for the authenticated user or organization. Use when you need to fetch meetings with optional filtering by dates, domains, meeting type, or recorder. Supports data enrichment via include\_\* parameters.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`teams\` \| array \| No \| Filter by team names. Provide a list of team names. \|
\| \`cursor\` \| string \| No \| Pagination cursor for fetching the next page of results. The response includes a \`next\_cursor\` field; paginate through all pages when filtering by date range to avoid missing older recordings. \|
\| \`recorded\_by\` \| array \| No \| Filter by recorder email addresses. Provide a list of email addresses. \|
\| \`created\_after\` \| string \| No \| Filter meetings created after this ISO 8601 timestamp (e.g., '2024-01-01T00:00:00Z'). \|
\| \`created\_before\` \| string \| No \| Filter meetings created before this ISO 8601 timestamp (e.g., '2024-12-31T23:59:59Z'). \|
\| \`include\_summary\` \| boolean \| No \| NOT SUPPORTED FOR OAUTH USERS. This parameter is only available with API key authentication. OAuth authenticated users cannot use this flag on the list endpoint and must fetch summaries via the dedicated GET\_RECORDING\_SUMMARY action for individual recordings. Default is false. \|
\| \`include\_transcript\` \| boolean \| No \| NOT SUPPORTED FOR OAUTH USERS. This parameter is only available with API key authentication. OAuth authenticated users cannot use this flag on the list endpoint and must fetch transcripts via the dedicated GET\_RECORDING\_TRANSCRIPT action for individual recordings. Default is false. \|
\| \`include\_crm\_matches\` \| boolean \| No \| Include linked CRM data in the response. Default is false. \|
\| \`include\_action\_items\` \| boolean \| No \| Include action items data in the response. Default is false. \|
\| \`calendar\_invitees\_domains\` \| array \| No \| Filter by company domains (exact match). Provide a list of domains. \|
\| \`calendar\_invitees\_domains\_type\` \| string ("all" \| "only\_internal" \| "one\_or\_more\_external") \| No \| Filter by domain type. Options: 'all' (default), 'only\_internal', 'one\_or\_more\_external'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Team Members

\*\*Slug:\*\* \`FATHOM\_LIST\_TEAM\_MEMBERS\`

Tool to retrieve a paginated list of all team members in the organization. Use when you need to view team members, optionally filtered by team name or paginated using a cursor.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`team\` \| string \| No \| Team name to filter by. Allows filtering results by specific team. \|
\| \`cursor\` \| string \| No \| Cursor for pagination. Used for retrieving subsequent pages of results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Teams

\*\*Slug:\*\* \`FATHOM\_LIST\_TEAMS\`

Tool to retrieve a paginated list of all teams in the organization. Use when you need to get information about teams accessible through the API.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cursor\` \| string \| No \| Cursor for pagination. Use the next\_cursor value from a previous response to get the next page of results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|
