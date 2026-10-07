---
url: https://docs.composio.dev/toolkits/heyreach.md
title: https://docs.composio.dev/toolkits/heyreach.md
description: 
status: 200
---

\# Heyreach

HeyReach is a multichannel outreach platform designed to help businesses and professionals engage with their audience effectively.

\- \*\*Category:\*\* marketing automation
\- \*\*Auth:\*\* API\_KEY
\- \*\*Composio-managed OAuth available?\*\* N/A
\- \*\*Tools:\*\* 19
\- \*\*Triggers:\*\* 0
\- \*\*Slug:\*\* \`HEYREACH\`
\- \*\*Version:\*\* 20260615\_00

\## Tools

\### Add Leads To List V2

\*\*Slug:\*\* \`HEYREACH\_ADD\_LEADS\_TO\_LIST\_V2\`

Tool to add leads to a lead list in HeyReach for LinkedIn campaigns. Accepts up to 100 leads per request and returns counts of added, updated, and failed leads.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`leads\` \| array \| Yes \| Array of lead objects to add. Maximum 100 leads per request. \|
\| \`listId\` \| integer \| Yes \| The ID of the list to add leads to. Must be an existing list ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check API Key

\*\*Slug:\*\* \`HEYREACH\_CHECK\_API\_KEY\`

Tool to check if the API key is valid. Use before making other API calls to confirm authentication.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Empty List

\*\*Slug:\*\* \`HEYREACH\_CREATE\_EMPTY\_LIST\`

Tool to create an empty list. Use after deciding on the list name and type.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| The name of the list to create. \|
\| \`type\` \| string ("COMPANY\_LIST" \| "USER\_LIST") \| No \| The type of list to create. Use 'USER\_LIST' for leads and 'COMPANY\_LIST' for companies. Defaults to 'USER\_LIST'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Tags

\*\*Slug:\*\* \`HEYREACH\_CREATE\_TAGS\`

Tool to create one or multiple tags for your workspace. Use when you need to organize leads with custom labels.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tags\` \| array \| Yes \| Array of tag objects to create. Each tag must have a displayName and color. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Webhook

\*\*Slug:\*\* \`HEYREACH\_CREATE\_WEBHOOK\`

Tool to create a new webhook. Use when you need programmatic callbacks for HeyReach events after confirming a valid API key.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`eventType\` \| string ("CONNECTION\_REQUEST\_SENT" \| "CONNECTION\_REQUEST\_ACCEPTED" \| "MESSAGE\_SENT" \| "MESSAGE\_REPLY\_RECEIVED" \| "INMAIL\_SENT" \| "INMAIL\_REPLY\_RECEIVED" \| "FOLLOW\_SENT" \| "LIKED\_POST" \| "VIEWED\_PROFILE" \| "CAMPAIGN\_COMPLETED" \| "LEAD\_TAG\_UPDATED") \| Yes \| Type of event that triggers the webhook. \|
\| \`webhookUrl\` \| string \| Yes \| Destination URL where HeyReach will send POST event payloads. \|
\| \`campaignIds\` \| array \| No \| List of campaign IDs to filter events. If empty, listens for the eventType across all campaigns. \|
\| \`webhookName\` \| string \| Yes \| Descriptive name for the webhook, used for identification. Maximum 25 characters. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Webhook

\*\*Slug:\*\* \`HEYREACH\_DELETE\_WEBHOOK\`

Tool to delete an existing webhook. Use when you need to remove callbacks for outdated or unwanted webhooks.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`webhookId\` \| string \| Yes \| Unique identifier of the webhook to delete. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get All Campaigns

\*\*Slug:\*\* \`HEYREACH\_GET\_ALL\_CAMPAIGNS\`

Tool to retrieve all campaigns. Use when you need a paginated list of campaigns for management or reporting.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of campaigns to return (1-100) \|
\| \`offset\` \| integer \| No \| Number of campaigns to skip \|
\| \`keyword\` \| string \| No \| Keyword to filter campaigns by name \|
\| \`statuses\` \| array \| No \| Filter campaigns by statuses, e.g., \['DRAFT','PAUSED'\] \|
\| \`accountIds\` \| array \| No \| Filter campaigns by LinkedIn account IDs \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get All Leads

\*\*Slug:\*\* \`HEYREACH\_GET\_ALL\_LEADS\`

Tool to retrieve all leads in a HeyReach list. Use when you need paginated collection of leads after confirming a valid API key.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The maximum number of records to return, between 1 and 1000. \|
\| \`listId\` \| integer \| Yes \| The ID of the lead list. \|
\| \`offset\` \| integer \| No \| The number of records to skip for pagination. \|
\| \`keyword\` \| string \| No \| Search term to filter leads by name or other relevant fields. \|
\| \`createdTo\` \| string \| No \| ISO 8601 end date for filtering leads by creation time. \|
\| \`createdFrom\` \| string \| No \| ISO 8601 start date for filtering leads by creation time. \|
\| \`leadLinkedInId\` \| string \| No \| LinkedIn ID to filter leads. \|
\| \`leadProfileUrl\` \| string \| No \| LinkedIn profile URL to filter leads. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get All LinkedIn Accounts

\*\*Slug:\*\* \`HEYREACH\_GET\_ALL\_LINKEDIN\_ACCOUNTS\`

Tool to retrieve all LinkedIn accounts. Use when you need a paginated list of LinkedIn accounts after confirming a valid API key.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of accounts to return (1-100) \|
\| \`offset\` \| integer \| No \| Number of accounts to skip \|
\| \`keyword\` \| string \| No \| Keyword to filter accounts by name \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get All Lists

\*\*Slug:\*\* \`HEYREACH\_GET\_ALL\_LISTS\`

Tool to retrieve all lists. Use when you need a paginated list of lists after confirming a valid API key.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of lists to return. \|
\| \`offset\` \| integer \| No \| Number of lists to skip for pagination. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get All Webhooks

\*\*Slug:\*\* \`HEYREACH\_GET\_ALL\_WEBHOOKS\`

Tool to retrieve all webhooks. Use when you need a paginated collection of webhooks after confirming a valid API key.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of webhooks to return \|
\| \`offset\` \| integer \| No \| Number of webhooks to skip for pagination \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Companies From List

\*\*Slug:\*\* \`HEYREACH\_GET\_COMPANIES\_FROM\_LIST\`

Tool to get companies from a company list. Use when you need a paginated list of companies after specifying a list ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of companies to return. \|
\| \`listId\` \| integer \| Yes \| The ID of the company list to retrieve companies from. \|
\| \`offset\` \| integer \| No \| Number of companies to skip for pagination. \|
\| \`keyword\` \| string \| No \| Keyword to filter companies by name or description. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Conversations V2

\*\*Slug:\*\* \`HEYREACH\_GET\_CONVERSATIONS\_V2\`

Tool to retrieve paginated LinkedIn conversations with advanced filters. Use when you need to fetch inbox conversations filtered by lead or profile details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of items to return (1-100) \|
\| \`offset\` \| integer \| No \| Number of items to skip for pagination \|
\| \`filters\` \| object \| Yes \| Filtering criteria for the conversations \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Lead

\*\*Slug:\*\* \`HEYREACH\_GET\_LEAD\`

Tool to retrieve detailed information for a lead by profile URL. Use after obtaining the exact LinkedIn profile URL to fetch full lead details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`profileUrl\` \| string \| Yes \| The LinkedIn profile URL of the lead. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Lists For Lead

\*\*Slug:\*\* \`HEYREACH\_GET\_LISTS\_FOR\_LEAD\`

Tool to retrieve all lists that contain a specific lead by profile URL. Use when you need to find which lists a lead belongs to.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of lists to return. \|
\| \`offset\` \| integer \| No \| Number of lists to skip for pagination. \|
\| \`profileUrl\` \| string \| Yes \| The LinkedIn profile URL of the lead to find lists for. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get My Network for Sender

\*\*Slug:\*\* \`HEYREACH\_GET\_MY\_NETWORK\_FOR\_SENDER\`

Tool to get the LinkedIn network for a specified sender account. Use when you need to retrieve paginated connections for a sender.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`pageSize\` \| integer \| Yes \| Number of items per page (must be positive) \|
\| \`senderId\` \| integer \| Yes \| ID of the LinkedIn sender account for which to retrieve the network \|
\| \`pageNumber\` \| integer \| Yes \| Zero-based index of the page to retrieve \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Overall Stats

\*\*Slug:\*\* \`HEYREACH\_GET\_OVERALL\_STATS\`

Tool to get overall statistics for LinkedIn accounts and campaigns. Use when you need performance metrics including connection requests, messages, replies, and engagement rates for specified date ranges.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`dateTo\` \| string \| No \| End date for statistics in ISO 8601 format (YYYY-MM-DD) \|
\| \`dateFrom\` \| string \| No \| Start date for statistics in ISO 8601 format (YYYY-MM-DD) \|
\| \`accountIds\` \| array \| No \| Filter by specific LinkedIn account IDs (empty array returns stats for all accounts) \|
\| \`campaignIds\` \| array \| No \| Filter by specific campaign IDs (empty array returns stats for all campaigns) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Webhook By ID

\*\*Slug:\*\* \`HEYREACH\_GET\_WEBHOOK\_BY\_ID\`

Tool to retrieve a webhook by its ID. Use when you need detailed configuration of a specific webhook after listing or creating it.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`webhookId\` \| integer \| Yes \| The unique identifier of the webhook to retrieve (positive integer) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Webhook

\*\*Slug:\*\* \`HEYREACH\_UPDATE\_WEBHOOK\`

Tool to update an existing webhook’s configuration. Use when you need to modify a webhook's name, URL, event type, campaigns, or activation status after confirming the webhookId.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`isActive\` \| boolean \| No \| Activation status of the webhook. True to enable, False to disable, if omitted or null, the existing status is retained. \|
\| \`eventType\` \| string ("CONNECTION\_REQUEST\_SENT" \| "CONNECTION\_REQUEST\_ACCEPTED" \| "MESSAGE\_SENT" \| "MESSAGE\_REPLY\_RECEIVED" \| "INMAIL\_SENT" \| "INMAIL\_REPLY\_RECEIVED" \| "FOLLOW\_SENT" \| "LIKED\_POST" \| "VIEWED\_PROFILE" \| "CAMPAIGN\_COMPLETED" \| "LEAD\_TAG\_UPDATED") \| No \| New event type to trigger the webhook. If omitted or null, the existing eventType is retained. \|
\| \`webhookId\` \| string \| Yes \| Unique identifier of the existing webhook to update. \|
\| \`webhookUrl\` \| string \| No \| New destination URL where HeyReach will send POST event payloads. If omitted or null, the existing URL is retained. \|
\| \`campaignIds\` \| array \| No \| List of campaign IDs to scope the webhook. If omitted or null, retains existing campaigns; if empty list, listens for the eventType across all campaigns. \|
\| \`webhookName\` \| string \| No \| New name for the webhook. If omitted or null, the existing name is retained. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|
