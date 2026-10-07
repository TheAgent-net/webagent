---
url: https://docs.composio.dev/toolkits/fireflies.md
title: https://docs.composio.dev/toolkits/fireflies.md
description: 
status: 200
---

\# Fireflies

Fireflies.ai helps your team transcribe, summarize, search, and analyze voice conversations.

\- \*\*Category:\*\* ai meeting assistants
\- \*\*Auth:\*\* API\_KEY
\- \*\*Composio-managed OAuth available?\*\* N/A
\- \*\*Tools:\*\* 26
\- \*\*Triggers:\*\* 1
\- \*\*Slug:\*\* \`FIREFLIES\`
\- \*\*Version:\*\* 20260826\_00

\## Tools

\### Add to Live Meeting

\*\*Slug:\*\* \`FIREFLIES\_ADD\_TO\_LIVE\`

The AddToLive Action allows you to add the Fireflies.ai bot to an ongoing meeting. Note: This action requires a paid Fireflies plan to add bots to meetings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`title\` \| string \| No \| Title or name of the meeting, this will be used to identify the transcribed file. If title is not provided, a default title will be set automatically \|
\| \`duration\` \| integer \| No \| Meeting duration in minutes. Minimum of 15 and maximum of 120 minutes. Defaults to 60 minutes if param is not provided \|
\| \`language\` \| string \| No \| Language code for the meeting (max 5 characters). Defaults to 'en' (English). Common codes: en, en-US, en-GB, fr, de, es, zh, ja, pt, ar. For a complete list of language codes, please view Fireflies Language Codes documentation. \|
\| \`attendees\` \| array \| No \| Array of Attendees for expected meeting participants. \|
\| \`meeting\_link\` \| string \| Yes \| A valid http URL for the meeting link, i.e. Google Meet, Zoom, etc \|
\| \`meeting\_password\` \| string \| No \| Password for the meeting, if applicable. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Continue AskFred Thread

\*\*Slug:\*\* \`FIREFLIES\_CONTINUE\_ASK\_FRED\_THREAD\`

Tool to continue an existing AskFred conversation thread with follow-up questions. This action CANNOT create new threads - it only works with existing thread IDs. Use when you need to maintain context from previous exchanges and ask additional questions about meeting data in the same conversation. To start a new thread, use FIREFLIES\_CREATE\_ASK\_FRED\_THREAD instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| Yes \| Follow-up question or query to ask in the context of the existing thread. Maximum 2000 characters. \|
\| \`thread\_id\` \| string \| Yes \| The ID of an existing AskFred thread obtained from a previous AskFred interaction (via FIREFLIES\_CREATE\_ASK\_FRED\_THREAD or FIREFLIES\_GET\_ASK\_FRED\_THREADS). Must be a real thread ID - placeholder values like 'new' or 'latest' are not valid. To start a new conversation, use FIREFLIES\_CREATE\_ASK\_FRED\_THREAD instead. \|
\| \`format\_mode\` \| string \| No \| Response format mode. Use 'markdown' for rich formatting with structure, or 'plaintext' for simple text output. \|
\| \`response\_language\` \| string \| No \| Language code for the response (e.g., 'en' for English, 'es' for Spanish). If not specified, defaults to English. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create AskFred Thread

\*\*Slug:\*\* \`FIREFLIES\_CREATE\_ASK\_FRED\_THREAD\`

Tool to start a new AskFred conversation thread with a question about meetings. Use when you need to query meeting transcripts using natural language, either for a specific meeting or across multiple meetings with filters. Supports time-based queries and participant-focused queries.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| Yes \| Your question or query about the meeting(s). Maximum 2000 characters. Examples: 'What were the action items?', 'Who attended the meeting?', 'What were the main topics discussed?' \|
\| \`filters\` \| object \| No \| Filters to search across multiple meetings. \|
\| \`format\_mode\` \| string ("markdown" \| "plaintext") \| No \| Response format - 'markdown' for rich formatting or 'plaintext' for plain text. \|
\| \`transcript\_id\` \| string \| No \| ID of a specific transcript/meeting to query. If provided, filters parameter is ignored. Use this for single-meeting queries. Transcript IDs are alphanumeric strings (e.g., '01JYH3WSWW2DVA72GFPQXC6ST0'). Use FIREFLIES\_GET\_TRANSCRIPTS to retrieve valid transcript IDs from your account. \|
\| \`response\_language\` \| string \| No \| Language code for response (e.g., 'en' for English, 'es' for Spanish, 'fr' for French). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Bite

\*\*Slug:\*\* \`FIREFLIES\_CREATE\_BITE\`

Tool to create a bite (short video or audio clip) from a transcript segment. Use when you need to extract a specific portion of a meeting recording with defined start and end times.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| Name for the bite. Maximum 256 characters. \|
\| \`summary\` \| string \| No \| Summary for the bite. Maximum 500 characters. \|
\| \`end\_time\` \| number \| Yes \| End time of the bite in seconds. Must be greater than start\_time. \|
\| \`privacies\` \| array \| No \| Visibility settings for the bite. Array can contain 'public', 'team', or 'participants'. \|
\| \`media\_type\` \| string ("video" \| "audio") \| No \| Type of bite to create. Must be either 'video' or 'audio'. If not specified, defaults to 'video'. \|
\| \`start\_time\` \| number \| Yes \| Start time of the bite in seconds. Must be non-negative and less than end\_time. \|
\| \`transcript\_id\` \| string \| Yes \| The ID of the transcript from which to create the bite. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Transcript by ID

\*\*Slug:\*\* \`FIREFLIES\_DELETE\_TRANSCRIPT\_BY\_ID\`

Permanently delete a transcript from the Fireflies account by its unique ID. This is a destructive action that cannot be undone. The transcript, along with its associated audio/video files and summaries, will be permanently removed. Rate limited to 10 requests per minute across all user tiers. Verify the target transcript via FIREFLIES\_GET\_TRANSCRIPTS and obtain explicit user confirmation before calling this tool.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique ID of the transcript to delete. This is a required field. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Fetch AI App Outputs

\*\*Slug:\*\* \`FIREFLIES\_FETCH\_AI\_APP\_OUTPUTS2\`

Tool to fetch AI App outputs for specific apps or transcripts. Use when you need to retrieve AI-generated results from Fireflies AI Apps for meetings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`skip\` \| integer \| No \| Number of records to skip over for pagination. \|
\| \`limit\` \| integer \| No \| Maximum number of apps outputs to fetch (default: 10, max: 10). \|
\| \`app\_id\` \| string \| No \| Retrieves all outputs against a specific AI App. If not provided, returns outputs for all AI Apps. \|
\| \`transcript\_id\` \| string \| No \| Retrieves all outputs against a specific meeting/transcript. If not provided, returns outputs for all meetings. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get AskFred Thread

\*\*Slug:\*\* \`FIREFLIES\_GET\_ASK\_FRED\_THREAD\`

Tool to get a specific AskFred conversation thread with full history. Use when retrieving a particular AskFred thread along with all its messages and conversation details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier of the AskFred thread to retrieve. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get AskFred Threads

\*\*Slug:\*\* \`FIREFLIES\_GET\_ASK\_FRED\_THREADS\`

Tool to retrieve a summary of all AskFred conversation threads for the current user. Use when you need to browse or list available AskFred conversations without fetching full message history.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`transcript\_id\` \| string \| No \| Filter threads to only those associated with a specific transcript ID. If not provided, returns all threads for the current user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Bite by ID

\*\*Slug:\*\* \`FIREFLIES\_GET\_BITE\_BY\_ID\`

Fetches details for a specific bite by ID. Requires a Fireflies plan that supports Bites and appropriate API scope. If the bite is not found, use FIREFLIES\_GET\_TRANSCRIPT\_BY\_ID to retrieve full transcript context instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The ID of the bite to fetch. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Transcripts

\*\*Slug:\*\* \`FIREFLIES\_GET\_BITES\`

Fetches a list of bites (highlights) against input arguments. Bites are generated asynchronously after transcript completion — only call this after FIREFLIES\_GET\_TRANSCRIPT\_BY\_ID reports \`status=completed\`. Empty results are possible for valid meetings; use FIREFLIES\_GET\_TRANSCRIPT\_BY\_ID for full transcript context when bites are unavailable.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mine\` \| boolean \| No \| Filter to include only the user's own bites. At least one of mine, transcript\_id, or my\_team must be provided. \|
\| \`skip\` \| integer \| No \| Number of bites to skip. \|
\| \`limit\` \| integer \| No \| Maximum number of bites to fetch. \|
\| \`my\_team\` \| boolean \| No \| Filter to include bites from the user's team. At least one of mine, transcript\_id, or my\_team must be provided. \|
\| \`transcript\_id\` \| string \| No \| The ID of the transcript to fetch bites for. At least one of mine, transcript\_id, or my\_team must be provided. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Meeting Analytics

\*\*Slug:\*\* \`FIREFLIES\_GET\_MEETING\_ANALYTICS\`

Retrieves comprehensive meeting analytics including team-level conversation metrics, sentiment analysis, and individual user performance data. Requires a Fireflies Business plan or higher to access analytics data. Use this action when you need to analyze meeting patterns, track engagement metrics, or generate reports on team collaboration effectiveness. Admin privileges are required to access team-level analytics.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`end\_time\` \| string \| No \| Filter results up to this datetime (ISO 8601 format, e.g., '2024-01-31T23:59:59Z'). If omitted, analytics will include data up to the current time. \|
\| \`start\_time\` \| string \| No \| Filter results from this datetime onwards (ISO 8601 format, e.g., '2024-01-01T00:00:00Z'). If omitted, analytics will include all historical data up to end\_time. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Meeting Participants

\*\*Slug:\*\* \`FIREFLIES\_GET\_MEETING\_PARTICIPANTS\`

Retrieves the list of participants who attended a specific Fireflies meeting along with their attendance details. Returns participant emails, detailed attendee information (names, emails, phone numbers), join/leave timestamps, speaker identifications, and meeting metadata. Use this action when you need to know who attended a meeting, when they joined/left, or which speakers were identified in the transcript. Only works with completed transcripts - incomplete transcripts may return partial or missing participant data.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`transcript\_id\` \| string \| Yes \| The unique identifier of the transcript/meeting to fetch participants for. This is the Fireflies transcript ID. Only works with completed transcripts. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Meeting Topics

\*\*Slug:\*\* \`FIREFLIES\_GET\_MEETING\_TOPICS\`

Retrieves AI-extracted topics, keywords, and meeting type for a specific Fireflies transcript. This action returns only topic-related metadata from the transcript summary, making it more efficient than fetching the entire transcript. Use this action when you need to understand what topics were discussed in a meeting without retrieving the full transcript content, sentences, or attendee details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`transcript\_id\` \| string \| Yes \| The unique identifier of the transcript to fetch topics for. This is the Fireflies transcript ID returned when listing transcripts or from the transcript\_url. Only call with IDs whose transcript status is 'completed'; incomplete transcripts may return empty or missing topics. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Transcript by ID

\*\*Slug:\*\* \`FIREFLIES\_GET\_TRANSCRIPT\_BY\_ID\`

Fetches details for a specific Fireflies transcript ID. Requires a paid Fireflies plan. Response is nested at data.outputs.data.transcript; fields like sentences and attendees can be null — handle gracefully. transcript.summary.action\_items may be a single newline-delimited string rather than an array — split by line breaks instead of iterating as an array. Limit concurrent calls to ~3 and apply exponential backoff on 429 responses, respecting Retry-After headers.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier of the transcript to fetch. This is the Fireflies transcript ID returned when listing transcripts or from the transcript\_url. Only call with IDs whose transcript status is 'completed'; incomplete transcripts return partial or missing content. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Transcripts

\*\*Slug:\*\* \`FIREFLIES\_GET\_TRANSCRIPTS\`

Fetches a list of transcripts against input filters. Metadata filters (title, host\_email, organizers, participants) match transcript metadata only, not spoken content. Pagination via skip/limit may trigger HTTP 429 on rapid requests; use backoff between pages.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`skip\` \| integer \| No \| Number of transcripts to skip. Use with limit for pagination; stop when returned count is less than limit. \|
\| \`limit\` \| integer \| No \| Maximum number of transcripts to fetch. Maximum allowed value is 50. \|
\| \`title\` \| string \| No \| Title of the meeting. Matches meeting metadata title only, not spoken content. \|
\| \`to\_date\` \| string \| No \| End date for filtering transcripts. Must be in ISO 8601 datetime format with timezone (e.g., '2024-08-26T23:59:59Z' or '2024-08-26T23:59:59+00:00'). Date-only formats are not accepted. \|
\| \`user\_id\` \| string \| No \| The User ID to fetch the transcripts of. \|
\| \`from\_date\` \| string \| No \| Start date for filtering transcripts. Must be in ISO 8601 datetime format with timezone (e.g., '2024-08-16T00:00:00Z' or '2024-08-16T00:00:00+00:00'). Date-only formats are not accepted. Must be earlier than to\_date. Filters are evaluated in UTC — convert local date ranges to UTC to avoid silently omitting meetings. \|
\| \`host\_email\` \| string \| No \| Email address of the host of the meeting. Must be a plain email address without markup or 'mailto:' prefix. Example: 'user@example.com'. \|
\| \`organizers\` \| array \| No \| List of organizer email addresses to filter transcripts by. \|
\| \`participants\` \| array \| No \| List of participant email addresses to filter transcripts by. \|
\| \`include\_summary\` \| boolean \| No \| Whether to include AI-generated summary (action items, keywords, overview, notes, etc.) in response. Can significantly increase response size. summary.action\_items may be a single formatted string rather than a list — split by newline rather than iterating as an array. \|
\| \`organizer\_email\` \| string \| No \| DEPRECATED: Use 'organizers' instead. Email of the organizer of the meeting. \|
\| \`include\_analytics\` \| boolean \| No \| Whether to include analytics data (sentiments, categories, speaker stats) in response. Requires Pro+ plan. If your plan doesn't support this, the request may fail with a generic error. \|
\| \`include\_audio\_url\` \| boolean \| No \| Whether to include audio\_url field in response. Requires Pro+ plan. If your plan doesn't support this, the request may fail with a generic error. \|
\| \`include\_sentences\` \| boolean \| No \| Whether to include sentences array (transcript text with speaker/timing info) in response. Can produce very large responses - a single transcript may contain hundreds of sentences. Each sentence object contains speaker\_name, text, start\_time, end\_time fields. Some transcripts may return null or empty sentences array. \|
\| \`include\_video\_url\` \| boolean \| No \| Whether to include video\_url field in response. Requires Business+ plan. If your plan doesn't support this, the request may fail with a generic error. \|
\| \`participant\_email\` \| string \| No \| DEPRECATED: Use 'participants' instead. Email of a participant in the meeting. \|
\| \`include\_apps\_preview\` \| boolean \| No \| Whether to include apps\_preview (AI app outputs) in response. \|
\| \`include\_user\_details\` \| boolean \| No \| Whether to include detailed user information with nested user\_groups and members. When False, only basic user fields (user\_id, email, name) are returned. \|
\| \`include\_meeting\_attendees\` \| boolean \| No \| Whether to include detailed meeting\_attendees array (display names, emails, phone numbers) in response. \|
\| \`include\_meeting\_attendance\` \| boolean \| No \| Whether to include meeting\_attendance array (join/leave timestamps for participants) in response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User by ID

\*\*Slug:\*\* \`FIREFLIES\_GET\_USER\_BY\_ID\`

The GetUser Action is designed to fetch details associated with a specific user id.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The User ID to the details of. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User Groups

\*\*Slug:\*\* \`FIREFLIES\_GET\_USER\_GROUPS\`

Tool to fetch a list of all user groups within the team with information about user groups including their members. Use when you need to retrieve team user groups, optionally filtering to only groups the current user belongs to with the mine parameter.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mine\` \| boolean \| No \| Filters results to return only user groups the current user belongs to when set to true. Returns all team user groups when false or omitted. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Users

\*\*Slug:\*\* \`FIREFLIES\_GET\_USERS\`

Fetches a list of all users within the team, including their full email addresses. Use to resolve complete email addresses from user names before passing to tools that require exact email addresses (no partial addresses or domain-only values).

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Execute GraphQL Query

\*\*Slug:\*\* \`FIREFLIES\_GRAPHQL\_QUERY\`

Execute an authenticated, read-only Fireflies GraphQL operation (query) and return the full raw GraphQL response (data+errors) for reliable fallback and debugging. Use when higher-level tools fail due to schema mismatches or to access raw error details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| Yes \| GraphQL query document (read-only operations only). Must contain only 'query' operations. Mutations and subscriptions are not allowed. \|
\| \`variables\` \| object \| No \| GraphQL variables as a JSON object. Used to pass dynamic values to parameterized queries. \|
\| \`operationName\` \| string \| No \| Operation name to execute when multiple operations are present in the query document. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Channels

\*\*Slug:\*\* \`FIREFLIES\_LIST\_CHANNELS\`

Fetches a list of all channels accessible to the authenticated user, including both public channels and private channels where the user is a member. Use this action when you need to discover available channels, retrieve channel IDs for organizing meetings, or check channel membership before assigning meetings to a specific channel.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search Transcripts

\*\*Slug:\*\* \`FIREFLIES\_SEARCH\_TRANSCRIPTS\`

Search transcripts using keyword-based full-text search across meeting titles and/or spoken content. Unlike GetTranscripts which only filters by metadata (title, participants, dates), this action performs semantic search within the actual transcript text using the 'keyword' parameter. Use this action when you need to find meetings where specific topics, phrases, or keywords were discussed during the conversation. Combine with 'scope' to control search boundaries (title-only, content-only, or both) and with standard filters (dates, participants) to narrow results.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mine\` \| boolean \| No \| Show only meetings owned by the API key owner. When true, returns only transcripts associated with the authenticated user. \|
\| \`skip\` \| integer \| No \| Number of transcripts to skip. Use with limit for pagination; stop when returned count is less than limit. \|
\| \`limit\` \| integer \| No \| Maximum number of transcripts to fetch. Maximum allowed value is 50. \|
\| \`scope\` \| string ("title" \| "sentences" \| "all") \| No \| Determines the scope of the keyword search. \|
\| \`keyword\` \| string \| Yes \| Search for keywords in meeting title and/or words spoken during the meeting. Maximum 255 characters. Use with 'scope' to control where to search. \|
\| \`to\_date\` \| string \| No \| End date for filtering transcripts. Must be in ISO 8601 datetime format with timezone (e.g., '2024-08-26T23:59:59Z' or '2024-08-26T23:59:59+00:00'). Date-only formats are not accepted. \|
\| \`user\_id\` \| string \| No \| The User ID to fetch the transcripts of. \|
\| \`from\_date\` \| string \| No \| Start date for filtering transcripts. Must be in ISO 8601 datetime format with timezone (e.g., '2024-08-16T00:00:00Z' or '2024-08-16T00:00:00+00:00'). Date-only formats are not accepted. Must be earlier than to\_date. Filters are evaluated in UTC — convert local date ranges to UTC to avoid silently omitting meetings. \|
\| \`channel\_id\` \| string \| No \| Filter transcripts by specific channel ID. \|
\| \`host\_email\` \| string \| No \| Email address of the host of the meeting. Must be a plain email address without markup or 'mailto:' prefix. Example: 'user@example.com'. \|
\| \`organizers\` \| array \| No \| List of organizer email addresses to filter transcripts by. \|
\| \`participants\` \| array \| No \| List of participant email addresses to filter transcripts by. \|
\| \`include\_summary\` \| boolean \| No \| Whether to include AI-generated summary (action items, keywords, overview, notes, etc.) in response. Can significantly increase response size. summary.action\_items may be a single formatted string rather than a list — split by newline rather than iterating as an array. \|
\| \`include\_analytics\` \| boolean \| No \| Whether to include analytics data (sentiments, categories, speaker stats) in response. Requires Pro+ plan. If your plan doesn't support this, the request may fail with a generic error. \|
\| \`include\_audio\_url\` \| boolean \| No \| Whether to include audio\_url field in response. Requires Pro+ plan. If your plan doesn't support this, the request may fail with a generic error. \|
\| \`include\_sentences\` \| boolean \| No \| Whether to include sentences array (transcript text with speaker/timing info) in response. Can produce very large responses - a single transcript may contain hundreds of sentences. Each sentence object contains speaker\_name, text, start\_time, end\_time fields. Some transcripts may return null or empty sentences array. \|
\| \`include\_video\_url\` \| boolean \| No \| Whether to include video\_url field in response. Requires Business+ plan. If your plan doesn't support this, the request may fail with a generic error. \|
\| \`include\_apps\_preview\` \| boolean \| No \| Whether to include apps\_preview (AI app outputs) in response. \|
\| \`include\_user\_details\` \| boolean \| No \| Whether to include detailed user information with nested user\_groups and members. When False, only basic user fields (user\_id, email, name) are returned. \|
\| \`include\_meeting\_attendees\` \| boolean \| No \| Whether to include detailed meeting\_attendees array (display names, emails, phone numbers) in response. \|
\| \`include\_meeting\_attendance\` \| boolean \| No \| Whether to include meeting\_attendance array (join/leave timestamps for participants) in response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Set User Role

\*\*Slug:\*\* \`FIREFLIES\_SET\_USER\_ROLE\`

Tool to update a user's role within a team. Use when you need to grant or revoke admin privileges. Only team administrators can execute this action. Teams must maintain at least one admin member at all times.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`role\` \| string ("admin" \| "user") \| Yes \| Role assignment to set for the user. Valid options are 'admin' (grants administrative privileges) and 'user' (standard user permissions). \|
\| \`user\_id\` \| string \| Yes \| Unique identifier of the target user whose role will be updated. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Meeting Channel

\*\*Slug:\*\* \`FIREFLIES\_UPDATE\_MEETING\_CHANNEL\`

Tool to batch update channel assignments for 1-5 meeting transcripts. Use when you need to assign meetings to a specific channel. Requires meeting owner or team admin privileges. All-or-nothing semantics: if any transcript fails validation, none are updated.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`channel\_id\` \| string \| Yes \| The channel identifier to assign to all specified transcripts. A meeting can only belong to one channel at a time. \|
\| \`transcript\_ids\` \| array \| Yes \| Array of transcript IDs to assign to the channel. Must contain between 1 and 5 transcript IDs. All specified meetings must be owned by users in your team. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Meeting Privacy

\*\*Slug:\*\* \`FIREFLIES\_UPDATE\_MEETING\_PRIVACY\`

Tool to update the privacy setting of a meeting transcript. Use when you need to change meeting access permissions. Only meeting owners and team admins can update privacy settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The transcript identifier to update privacy settings for. \|
\| \`privacy\` \| string ("link" \| "owner" \| "participants" \| "teammatesandparticipants" \| "teammates") \| Yes \| New privacy level setting. Available values: 'link' (anyone with link can access), 'owner' (only meeting owner), 'participants' (meeting participants only), 'teammatesandparticipants' (teammates and participants), 'teammates' (team members only). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Meeting Title

\*\*Slug:\*\* \`FIREFLIES\_UPDATE\_MEETING\_TITLE\`

Tool to update the title of a meeting transcript. Use when you need to rename a meeting. Requires admin privileges and the meeting owner must be in your team.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier of the meeting transcript to update. \|
\| \`title\` \| string \| Yes \| The new title to assign to the meeting transcript. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upload Audio

\*\*Slug:\*\* \`FIREFLIES\_UPLOAD\_AUDIO\`

The UploadAudio Action allows you to upload audio files to Fireflies.ai for transcription. Transcription is asynchronous — after submission, results may take several minutes to become available; use transcript retrieval tools to poll for completion. Note: This action requires a paid Fireflies plan to upload and transcribe audio files.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| Yes \| The url of media file to be transcribed. It MUST be a valid https string and publicly accessible to enable us download the audio / video file. Double check to see if the media file is downloadable and that the link is not a preview link before making the request. The media file must be either of these formats - mp3, mp4, wav, m4a, ogg \|
\| \`title\` \| string \| No \| Title or name of the meeting, this will be used to identify the transcribed file \|
\| \`webhook\` \| string \| No \| URL for the webhook that receives notifications when transcription completes \|
\| \`attendees\` \| array \| No \| An array of objects containing Attendee objects. This is relevant if you have active integrations like Salesforce, Hubspot etc. Fireflies uses the attendees value to push meeting notes to your active CRM integrations where notes are added to an existing contact or a new contact is created. Each object contains - displayName, email, phoneNumber, client\_reference\_id \|
\| \`save\_video\` \| boolean \| No \| Specify whether the video should be saved or not. \|
\| \`download\_auth\` \| object \| No \| Authentication details for accessing protected media files. \|
\| \`custom\_language\` \| string \| No \| Specify a custom language code for your meeting, e.g. es for Spanish or de for German. For a complete list of language codes, please view Language Codes \|
\| \`bypass\_size\_check\` \| boolean \| No \| Set to true to bypass the 50kb minimum file size validation. Useful for processing smaller audio files. \|
\| \`client\_reference\_id\` \| string \| No \| The client reference id of the attendee \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\## Triggers

\### Transcription Complete Trigger

\*\*Slug:\*\* \`FIREFLIES\_TRANSCRIPTION\_COMPLETE\`

\*\*Type:\*\* poll

Triggers when a transcription is complete. Polls the Fireflies API over a
window anchored to Fireflies' own transcript dates (not our wall clock) and
emits each transcript once (deduped by id), so late, back-dated transcripts
are not missed. Handles rate limiting gracefully.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| No \| Type of transcript event \|
\| \`transcript\` \| object \| Yes \| The transcript that was completed \|
