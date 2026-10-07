---
url: https://docs.composio.dev/toolkits/zoom.md
title: https://docs.composio.dev/toolkits/zoom.md
description: 
status: 200
---

\# Zoom

Zoom is a video conferencing and online meeting platform featuring breakout rooms, screen sharing, and integrations with various enterprise tools

\- \*\*Category:\*\* video conferencing
\- \*\*Auth:\*\* OAUTH2
\- \*\*Composio-managed OAuth available?\*\* Yes
\- \*\*Tools:\*\* 105
\- \*\*Triggers:\*\* 11
\- \*\*Slug:\*\* \`ZOOM\`
\- \*\*Version:\*\* 20260826\_00

\## Frequently Asked Questions

\### How do I set up custom OAuth credentials for Zoom?

For a step-by-step guide on creating and configuring your own Zoom OAuth credentials with Composio, see \[How to create OAuth credentials for Zoom\](https://composio.dev/auth/zoom).

\## Tools

\### Add a meeting registrant

\*\*Slug:\*\* \`ZOOM\_ADD\_A\_MEETING\_REGISTRANT\`

Registers a participant for a Zoom meeting that has registration enabled. \*\*Prerequisites:\*\* - The meeting host must have a \*\*licensed (paid) Zoom account\*\* - this will NOT work with free/basic accounts - The meeting must have registration enabled (approval\_type = 0 for automatic or 1 for manual approval) - Maximum of 4,999 registrants per meeting \*\*Required fields:\*\* meeting\_id, first\_name, last\_name, email \*\*Optional fields:\*\* address, city, state, zip, country, phone, comments, industry, job\_title, org, language, auto\_approve \*\*Common errors:\*\* - "Only available for paid users" - The meeting host needs a licensed Zoom account - "Registration has not been enabled" - Enable registration via update\_a\_meeting with approval\_type = 0 or 1 - "Meeting not found" - Invalid meeting ID or meeting has ended

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`org\` \| string \| No \| The registrant's organization. \|
\| \`zip\` \| string \| No \| The registrant's ZIP or postal code. \|
\| \`city\` \| string \| No \| The registrant's city. \|
\| \`email\` \| string \| Yes \| The registrant's email address. \|
\| \`phone\` \| string \| No \| The registrant's phone number. \|
\| \`state\` \| string \| No \| The registrant's state or province. \|
\| \`address\` \| string \| No \| The registrant's address. \|
\| \`country\` \| string \| No \| The registrant's two-letter \[country code\](https://marketplace.zoom.us/docs/api-reference/other-references/abbreviation-lists#countries). \|
\| \`comments\` \| string \| No \| The registrant's questions and comments. \|
\| \`industry\` \| string \| No \| The registrant's industry. \|
\| \`language\` \| string ("en-US" \| "de-DE" \| "es-ES" \| "fr-FR" \| "jp-JP" \| "pt-PT" \| "ru-RU" \| "zh-CN" \| "zh-TW" \| "ko-KO" \| "it-IT" \| "vi-VN" \| "pl-PL" \| "Tr-TR") \| No \| The registrant's language preference for confirmation emails: \* \`en-US\` — English (US) \* \`de-DE\` — German (Germany) \* \`es-ES\` — Spanish (Spain) \* \`fr-FR\` — French (France) \* \`jp-JP\` — Japanese \* \`pt-PT\` — Portuguese (Portugal) \* \`ru-RU\` — Russian \* \`zh-CN\` — Chinese (PRC) \* \`zh-TW\` — Chinese (Taiwan) \* \`ko-KO\` — Korean \* \`it-IT\` — Italian (Italy) \* \`vi-VN\` — Vietnamese \* \`pl-PL\` — Polish \* \`Tr-TR\` — Turkish \|
\| \`job\_title\` \| string \| No \| The registrant's job title. \|
\| \`last\_name\` \| string \| Yes \| The registrant's last name. \|
\| \`first\_name\` \| string \| Yes \| The registrant's first name. \|
\| \`meeting\_id\` \| string \| Yes \| The meeting's ID as a string (e.g., "1234567890"). Zoom meeting IDs can exceed 10 digits and must be represented as strings to avoid JavaScript Number precision issues (IDs may exceed 2^53). \|
\| \`auto\_approve\` \| boolean \| No \| If a meeting was scheduled with the \`approval\_type\` field value of \`1\` (manual approval) but you want to automatically approve meeting registrants, set the value of this field to \`true\`. \*\*Note:\*\* You cannot use this field to change approval setting for a meeting originally scheduled with the \`approval\_type\` field value of \`0\` (automatic approval). \|
\| \`occurrence\_ids\` \| string \| No \| A comma-separated list of meeting occurrence IDs. You can get this value with the \[Get a meeting\](https://developers.zoom.us) API. \|
\| \`no\_of\_employees\` \| string ("" \| "1-20" \| "21-50" \| "51-100" \| "101-500" \| "500-1,000" \| "1,001-5,000" \| "5,001-10,000" \| "More than 10,000") \| No \| The registrant's number of employees: \* \`1-20\` \* \`21-50\` \* \`51-100\` \* \`101-500\` \* \`500-1,000\` \* \`1,001-5,000\` \* \`5,001-10,000\` \* \`More than 10,000\` \|
\| \`custom\_questions\` \| array \| No \| Information about custom questions. \|
\| \`purchasing\_time\_frame\` \| string ("" \| "Within a month" \| "1-3 months" \| "4-6 months" \| "More than 6 months" \| "No timeframe") \| No \| The registrant's purchasing time frame: \* \`Within a month\` \* \`1-3 months\` \* \`4-6 months\` \* \`More than 6 months\` \* \`No timeframe\` \|
\| \`role\_in\_purchase\_process\` \| string ("" \| "Decision Maker" \| "Evaluator/Recommender" \| "Influencer" \| "Not involved") \| No \| The registrant's role in the purchase process: \* \`Decision Maker\` \* \`Evaluator/Recommender\` \* \`Influencer\` \* \`Not involved\` \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add a webinar registrant

\*\*Slug:\*\* \`ZOOM\_ADD\_A\_WEBINAR\_REGISTRANT\`

Registers a participant for a Zoom webinar that has registration enabled. \*\*Prerequisites:\*\* - The webinar host must have a \*\*Pro or higher plan with Webinar add-on\*\* - this will NOT work with basic/free accounts - The webinar must have registration enabled (approval\_type = 0 for automatic or 1 for manual approval) - Registration type must be properly configured (1=once for all, 2=each occurrence, 3=choose occurrences) \*\*Required fields:\*\* webinarId, first\_name, email \*\*Optional fields:\*\* last\_name, address, city, state, zip, country, phone, comments, industry, job\_title, org, language, occurrence\_ids, source\_id \*\*Common errors:\*\* - "Webinar plan is missing" - The host needs a Zoom webinar license/add-on - "Registration has not been enabled" - Enable registration via webinar settings with approval\_type = 0 or 1 - "Webinar not found" (404) - Invalid webinar ID or webinar has ended - "Host cannot register" - The webinar host cannot register themselves as an attendee

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`org\` \| string \| No \| The registrant's organization. \|
\| \`zip\` \| string \| No \| The registrant's ZIP or postal code. \|
\| \`city\` \| string \| No \| The registrant's city. \|
\| \`email\` \| string \| Yes \| The registrant's email address. \|
\| \`phone\` \| string \| No \| The registrant's phone number. \|
\| \`state\` \| string \| No \| The registrant's state or province. \|
\| \`address\` \| string \| No \| The registrant's address. \|
\| \`country\` \| string \| No \| The registrant's two-letter \[country code\](https://developers.zoom.us/docs/api/rest/other-references/abbreviation-lists/#countries). \|
\| \`comments\` \| string \| No \| The registrant's questions and comments. \|
\| \`industry\` \| string \| No \| The registrant's industry. \|
\| \`language\` \| string ("en-US" \| "de-DE" \| "es-ES" \| "fr-FR" \| "jp-JP" \| "pt-PT" \| "ru-RU" \| "zh-CN" \| "zh-TW" \| "ko-KR" \| "it-IT" \| "vi-VN" \| "pl-PL" \| "tr-TR") \| No \| The registrant's language preference for confirmation emails: \* \`en-US\` - English (US) \* \`de-DE\` - German (Germany) \* \`es-ES\` - Spanish (Spain) \* \`fr-FR\` - French (France) \* \`jp-JP\` - Japanese \* \`pt-PT\` - Portuguese (Portugal) \* \`ru-RU\` - Russian \* \`zh-CN\` - Chinese (PRC) \* \`zh-TW\` - Chinese (Taiwan) \* \`ko-KR\` - Korean \* \`it-IT\` - Italian (Italy) \* \`vi-VN\` - Vietnamese \* \`pl-PL\` - Polish \* \`tr-TR\` - Turkish \|
\| \`job\_title\` \| string \| No \| The registrant's job title. \|
\| \`last\_name\` \| string \| No \| The registrant's last name. \|
\| \`source\_id\` \| string \| No \| The tracking source's unique identifier. \|
\| \`first\_name\` \| string \| Yes \| The registrant's first name. \|
\| \`webinar\_id\` \| string \| Yes \| The webinar's ID. \|
\| \`occurrence\_ids\` \| string \| No \| A comma-separated list of webinar occurrence IDs. Get this value with the \[Get a webinar\](https://developers.zoom.us) API. Make sure the \`registration\_type\` is 3 if updating multiple occurrences with this API. \|
\| \`no\_of\_employees\` \| string ("" \| "1-20" \| "21-50" \| "51-100" \| "101-500" \| "500-1,000" \| "1,001-5,000" \| "5,001-10,000" \| "More than 10,000") \| No \| The registrant's number of employees: \* \`1-20\` \* \`21-50\` \* \`51-100\` \* \`101-500\` \* \`500-1,000\` \* \`1,001-5,000\` \* \`5,001-10,000\` \* \`More than 10,000\` \|
\| \`custom\_questions\` \| array \| No \| Information about custom questions. \|
\| \`purchasing\_time\_frame\` \| string ("" \| "Within a month" \| "1-3 months" \| "4-6 months" \| "More than 6 months" \| "No timeframe") \| No \| The registrant's purchasing time frame: \* \`Within a month\` \* \`1-3 months\` \* \`4-6 months\` \* \`More than 6 months\` \* \`No timeframe\` \|
\| \`role\_in\_purchase\_process\` \| string ("" \| "Decision Maker" \| "Evaluator/Recommender" \| "Influencer" \| "Not involved") \| No \| The registrant's role in the purchase process: \* \`Decision Maker\` \* \`Evaluator/Recommender\` \* \`Influencer\` \* \`Not involved\` \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add project collaborators

\*\*Slug:\*\* \`ZOOM\_ADD\_PROJECT\_COLLABORATORS\`

Adds one or more collaborators to a whiteboard project. Use this action when you want to invite team members or external users to collaborate on a specific whiteboard project. Project owners or authorized users can add collaborators with different permission levels (owner, editor, or viewer). \*\*Prerequisites:\*\* - The user must be the project owner or have admin permissions - The target user must have a Zoom account - The whiteboard project must exist and be accessible \*\*Required fields:\*\* project\_id, collaborators (list with at least one user) \*\*Optional fields:\*\* skip\_notifications, invite\_message \*\*Common errors:\*\* - "Whiteboard plan is missing" - Whiteboard add-on is required - "User not found" - The collaborator's email is not associated with a Zoom account - "Project not found" - Invalid project ID - "Invalid collaborator role" - Role value must be 1, 2, or 3

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`project\_id\` \| string \| Yes \| The unique identifier of the whiteboard project. \|
\| \`collaborators\` \| array \| Yes \| List of users to add as collaborators with their email addresses and roles. \|
\| \`invite\_message\` \| string \| No \| A custom message to include with the project invitation. Maximum 280 characters. \|
\| \`skip\_notifications\` \| boolean \| No \| If set to true, collaborators will not receive email notifications about the invitation. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add whiteboard collaborator

\*\*Slug:\*\* \`ZOOM\_ADD\_WHITEBOARD\_COLLABORATOR\`

Adds one or more collaborators to a whiteboard. Use this action when you need to invite users or team chat channels to collaborate on a specific whiteboard. Supports individual user invites (via email) and team chat channel invites (via channel\_id). Collaborators are assigned a role that determines their permission level. On success, returns the list of collaborators that were added. Use this action when you want to share a whiteboard to new users or team chat channels and assign them specific permission levels (owner, co-owner, editor, commenter, or viewer).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`collaborators\` \| array \| Yes \| List of users or channels to add as collaborators. Supports 1-100 collaborators per request. Each item must have either email (for individual users) or channel\_id (for team chat channels), but not both. \|
\| \`whiteboard\_id\` \| string \| Yes \| The unique identifier of the whiteboard. \|
\| \`invite\_message\` \| string \| No \| A custom message to include with the collaborator invitation. Maximum 280 characters. \|
\| \`skip\_notifications\` \| boolean \| No \| If true, collaborators will not receive email or in-app notifications about the invitation. Defaults to false (notifications are sent). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Apply classification to whiteboard

\*\*Slug:\*\* \`ZOOM\_APPLY\_CLASSIFICATION\_TO\_WHITEBOARD\`

Applies or updates a classification label on a whiteboard. Use this action when you need to assign or change a security classification label on an existing whiteboard. Each whiteboard can only have one classification label at a time — if the whiteboard already has a label, it will be replaced with the new one. Rate limit: Light. Required scopes: whiteboard:write:admin, whiteboard:write, whiteboard:update:whiteboard\_classification, or whiteboard:update:whiteboard\_classification:admin.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`whiteboard\_id\` \| string \| Yes \| The whiteboard's unique identifier. \|
\| \`classification\_id\` \| string \| Yes \| The unique identifier of the classification label to apply to the whiteboard. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create a meeting

\*\*Slug:\*\* \`ZOOM\_CREATE\_A\_MEETING\`

Enable Zoom meeting creation via user-level apps with "me". "Start\_url" for hosts expires in 2 hours, or 90 days for "custCreate" users. Renew via API, capped at 100 requests/day. Requires "meeting:write" permission, subject to medium rate limit.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| integer \| No \| The type of meeting. \* \`1\` - An instant meeting. \* \`2\` - A scheduled meeting. \* \`3\` - A recurring meeting with no fixed time. \* \`8\` - A recurring meeting with fixed time. \|
\| \`topic\` \| string \| No \| The meeting's topic. \|
\| \`agenda\` \| string \| No \| The meeting's agenda. This value has a maximum length of 2,000 characters. \|
\| \`user\_id\` \| string \| No \| The user's user ID or email address. For user-level apps, pass the \`me\` value. Defaults to \`me\` for user-level apps. \|
\| \`duration\` \| integer \| No \| The meeting's scheduled duration, in minutes. This field is only used for scheduled meetings (\`2\`). Ignored for all other meeting types. \|
\| \`password\` \| string \| No \| The passcode required to join the meeting. By default, a passcode can \*\*only\*\* have a maximum length of 10 characters and only contain alphanumeric characters and the \`@\`, \`-\`, \`\_\`, and \`\*\` characters. \* If the account owner or administrator has configured \[minimum passcode requirement settings\](https://support.zoom.us/hc/en-us/articles/360033559832-Meeting-and-webinar-passwords#h\_a427384b-e383-4f80-864d-794bf0a37604), the passcode \*\*must\*\* meet those requirements. \* If passcode requirements are enabled, use the \[\*\*Get user settings\*\*\](https://developers.zoom.us/docs/api-reference/zoom-api/methods#operation/userSettings) API or the \[\*\*Get account settings\*\*\](https://developers.zoom.us/docs/api-reference/zoom-api/ma#operation/accountSettings) API to get the requirements. \|
\| \`timezone\` \| string \| No \| The timezone to assign to the \`start\_time\` value. This field is only used for scheduled or recurring meetings with a fixed time. For a list of supported timezones and their formats, see our \[timezone list\](https://developers.zoom.us/docs/api/rest/other-references/abbreviation-lists/#timezones). Omitting this silently falls back to the account's timezone, which may shift meeting times for participants. \|
\| \`start\_time\` \| string \| No \| The meeting's start time. This field is only used for scheduled or recurring meetings with a fixed time. This supports local time and GMT formats. \* To set a meeting's start time in GMT, use the \`yyyy-MM-ddTHH:mm:ssZ\` date-time format. For example, \`2020-03-31T12:02:00Z\`. \* To set a meeting's start time using a specific timezone, use the \`yyyy-MM-ddTHH:mm:ss\` date-time format and specify the \[timezone ID\](https://developers.zoom.us/docs/api/rest/other-references/abbreviation-lists/#timezones) in the \`timezone\` field. If you do not specify a timezone, the \`timezone\` value defaults to your Zoom account's timezone. You can also use \`UTC\` for the \`timezone\` value. \*\*Note:\*\* If no \`start\_time\` is set for a scheduled meeting, the \`start\_time\` is set at the current time and the meeting type changes to an instant meeting, which expires after 30 days. \|
\| \`template\_id\` \| string \| No \| The account admin meeting template ID used to schedule a meeting using a \[meeting template\](https://support.zoom.us/hc/en-us/articles/360036559151-Meeting-templates). For a list of account admin-provided meeting templates, use the \[\*\*List meeting templates\*\*\](https://developers.zoom.us/docs/api-reference/zoom-api/methods#operation/listMeetingTemplates) API. \* At this time, this field \*\*only\*\* accepts account admin meeting template IDs. \* To enable the account admin meeting templates feature, \[contact Zoom support\](https://support.zoom.us/hc/en-us). \|
\| \`pre\_schedule\` \| boolean \| No \| Whether to create a prescheduled meeting via the \[GSuite app\](https://support.zoom.us/hc/en-us/articles/360020187492-Zoom-for-GSuite-add-on). This \*\*only\*\* supports the meeting \`type\` value of \`2\` (scheduled meetings) and \`3\` (recurring meetings with no fixed time). \* \`true\` - Create a prescheduled meeting. \* \`false\` - Create a regular meeting. \|
\| \`schedule\_for\` \| string \| No \| The email address or user ID of the user to schedule a meeting for. \|
\| \`settings\_\_audio\` \| string ("both" \| "telephony" \| "voip" \| "thirdParty") \| No \| How participants join the audio portion of the meeting. \* \`both\` - Both telephony and VoIP. \* \`telephony\` - Telephony only. \* \`voip\` - VoIP only. \* \`thirdParty\` - Third party audio conference. \|
\| \`tracking\_fields\` \| array \| No \| Information about the meeting's tracking fields. \|
\| \`default\_password\` \| boolean \| No \| Whether to generate a default passcode using the user's settings. This value defaults to \`false\`. If this value is \`true\` and the user has the PMI setting enabled with a passcode, then the user's meetings will use the PMI passcode. It will \*\*not\*\* use a default passcode. \|
\| \`recurrence\_\_type\` \| integer \| No \| Recurrence meeting types. \`1\` - Daily. \`2\` - Weekly. \`3\` - Monthly. \|
\| \`settings\_\_use\_\_pmi\` \| boolean \| No \| Whether to use a \[Personal Meeting ID (PMI)\](https://developers.zoom.us/docs/api/rest/using-zoom-apis/#understanding-personal-meeting-id-pmi) instead of a generated meeting ID. This field is only used for scheduled meetings (\`2\`), instant meetings (\`1\`), or recurring meetings with no fixed time (\`3\`). This value defaults to \`false\`. \|
\| \`settings\_\_jbh\_\_time\` \| integer \| No \| If the value of the \`join\_before\_host\` field is \`true\`, this field indicates the time limits when a participant can join a meeting before the meeting's host. \* \`0\` - Allow the participant to join the meeting at anytime. \* \`5\` - Allow the participant to join 5 minutes before the meeting's start time. \* \`10\` - Allow the participant to join 10 minutes before the meeting's start time. \|
\| \`settings\_\_resources\` \| array \| No \| The meeting's resources. Each resource must include resource\_id and resource\_type fields. \|
\| \`settings\_\_watermark\` \| boolean \| No \| Whether to add a watermark when viewing a shared screen. \|
\| \`settings\_\_cn\_\_meeting\` \| boolean \| No \| Whether to host the meeting in China (CN). This value defaults to \`false\`. \|
\| \`settings\_\_focus\_\_mode\` \| boolean \| No \| Whether to enable the \[\*\*Focus Mode\*\* feature\](https://support.zoom.us/hc/en-us/articles/360061113751-Using-focus-mode) when the meeting starts. \|
\| \`settings\_\_host\_\_video\` \| boolean \| No \| Whether to start meetings with the host video on. \|
\| \`settings\_\_in\_\_meeting\` \| boolean \| No \| Whether to host the meeting in India (IN). This value defaults to \`false\`. \|
\| \`recurrence\_\_end\_\_times\` \| integer \| No \| Select how many times the meeting should recur before it is canceled. If \`end\_times\` is set to 0, it means there is no end time. The maximum number of recurring is 60. Cannot be used with \`end\_date\_time\`. \|
\| \`settings\_\_contact\_\_name\` \| string \| No \| The contact name for meeting registration. \|
\| \`settings\_\_waiting\_\_room\` \| boolean \| No \| Whether to enable the \[\*\*Waiting Room\*\* feature\](https://support.zoom.us/hc/en-us/articles/115000332726-Waiting-Room). If this value is \`true\`, this \*\*disables\*\* the \`join\_before\_host\` setting. \|
\| \`recurrence\_\_monthly\_\_day\` \| integer \| No \| Use this field \*\*only if you're scheduling a recurring meeting of type\*\* \`3\` to state the day in a month when the meeting should recur. The value range is from 1 to 31. For the meeting to recur on 23rd of each month, provide \`23\` as this field's value and \`1\` as the \`repeat\_interval\` field's value. Instead, if you would like the meeting to recur every three months, on 23rd of the month, change the value of the \`repeat\_interval\` field to \`3\`. \|
\| \`recurrence\_\_weekly\_\_days\` \| string ("1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7") \| No \| This field is required if you're scheduling a recurring meeting of type \`2\` to state the days of the week when the meeting should repeat. The value must be a single number between \`1\` to \`7\` in string format. For instance, if the meeting should recur on Sunday, provide \`1\` as this field's value. To set the meeting to occur on multiple days, you must call the API multiple times or use a different recurrence pattern. \`1\` - Sunday. \`2\` - Monday. \`3\` - Tuesday. \`4\` - Wednesday. \`5\` - Thursday. \`6\` - Friday. \`7\` - Saturday. \|
\| \`settings\_\_approval\_\_type\` \| integer \| No \| Enable meeting registration approval. \* \`0\` - Automatically approve registration. \* \`1\` - Manually approve registration. \* \`2\` - No registration required. This value defaults to \`2\`. \|
\| \`settings\_\_contact\_\_email\` \| string \| No \| The contact email address for meeting registration. \|
\| \`recurrence\_\_monthly\_\_week\` \| integer \| No \| Use this field \*\*only if you're scheduling a recurring meeting of type\*\* \`3\` to state the week of the month when the meeting should recur. If you use this field, you must also use the \`monthly\_week\_day\` field to state the day of the week when the meeting should recur. \`-1\` - Last week of the month. \`1\` - First week of the month. \`2\` - Second week of the month. \`3\` - Third week of the month. \`4\` - Fourth week of the month. \|
\| \`settings\_\_auto\_\_recording\` \| string ("local" \| "cloud" \| "none") \| No \| The automatic recording settings. \* \`local\` - Record the meeting locally. \* \`cloud\` - Record the meeting to the cloud. \* \`none\` - Auto-recording disabled. This value defaults to \`none\`. \|
\| \`settings\_\_encryption\_\_type\` \| string ("enhanced\_encryption" \| "e2ee") \| No \| The type of \[end-to-end (E2EE) encryption\](https://support.zoom.us/hc/en-us/articles/360048660871) to use for the meeting. \* \`enhanced\_encryption\` - Enhanced encryption. Encryption is stored in the cloud when you enable this option. \* \`e2ee\` - End-to-end encryption. The encryption key is stored on your local device and \*\*cannot\*\* be obtained by anyone else. When you use E2EE encryption, \[certain features\](https://support.zoom.us/hc/en-us/articles/360048660871), such as cloud recording or phone and SIP/H.323 dial-in, are \*\*disabled\*\*. \|
\| \`settings\_\_private\_\_meeting\` \| boolean \| No \| Whether to set the meeting as private. \|
\| \`recurrence\_\_end\_\_date\_\_time\` \| string \| No \| Select the final date when the meeting will recur before it is canceled. Should be in UTC time, such as 2017-11-25T12:00:00Z. Cannot be used with \`end\_times\`. \|
\| \`settings\_\_internal\_\_meeting\` \| boolean \| No \| Whether to set the meeting as an internal meeting. \|
\| \`settings\_\_meeting\_\_invitees\` \| array \| No \| A list of the meeting's invitees. \|
\| \`settings\_\_mute\_\_upon\_\_entry\` \| boolean \| No \| Whether to mute participants upon entry. \|
\| \`recurrence\_\_repeat\_\_interval\` \| integer \| No \| Define the interval when the meeting should recur. For instance, to schedule a meeting that recurs every two months, set this field's value as \`2\` and the value of the \`type\` parameter as \`3\`. For a daily meeting, the maximum interval you can set is \`90\` days. For a weekly meeting the maximum interval that you can set is of \`12\` weeks. For a monthly meeting, there is a maximum of \`3\` months. \|
\| \`settings\_\_alternative\_\_hosts\` \| string \| No \| A semicolon-separated list of the meeting's alternative hosts" email addresses or IDs. \|
\| \`settings\_\_join\_\_before\_\_host\` \| boolean \| No \| Whether participants can join the meeting before its host. This field is only used for scheduled meetings (\`2\`) or recurring meetings (\`3\` and \`8\`). This value defaults to \`false\`. If the \[\*\*Waiting Room\*\* feature\](https://support.zoom.us/hc/en-us/articles/115000332726-Waiting-Room) is enabled, this setting is \*\*disabled\*\*. \|
\| \`settings\_\_participant\_\_video\` \| boolean \| No \| Whether to start meetings with the participant video on. \|
\| \`settings\_\_registration\_\_type\` \| integer \| No \| The meeting's registration type. \* \`1\` - Attendees register once and can attend any meeting occurrence. \* \`2\` - Attendees must register for each meeting occurrence. \* \`3\` - Attendees register once and can select one or more meeting occurrences to attend. This field is only for recurring meetings with fixed times (\`8\`). This value defaults to \`1\`. \|
\| \`settings\_\_close\_\_registration\` \| boolean \| No \| Whether to close registration after the event date. This value defaults to \`false\`. \|
\| \`settings\_\_email\_\_notification\` \| boolean \| No \| Whether to send email notifications to \[alternative hosts\](https://support.zoom.us/hc/en-us/articles/208220166) and \[users with scheduling privileges\](https://support.zoom.us/hc/en-us/articles/201362803-Scheduling-privilege). This value defaults to \`true\`. \|
\| \`settings\_\_show\_\_share\_\_button\` \| boolean \| No \| Whether to include social media sharing buttons on the meeting's registration page. This setting is only applied to meetings with registration enabled. \|
\| \`recurrence\_\_monthly\_\_week\_\_day\` \| integer \| No \| Use this field \*\*only if you're scheduling a recurring meeting of type\*\* \`3\` to state a specific day in a week when the monthly meeting should recur. To use this field, you must also use the \`monthly\_week\` field. \`1\` - Sunday. \`2\` - Monday. \`3\` - Tuesday. \`4\` - Wednesday. \`5\` - Thursday. \`6\` - Friday. \`7\` - Saturday. \|
\| \`settings\_\_breakout\_\_room\_\_rooms\` \| array \| No \| Information about the breakout rooms. \|
\| \`settings\_\_authentication\_\_option\` \| string \| No \| If the \`meeting\_authentication\` value is \`true\`, the type of authentication required for users to join a meeting. To get this value, use the \`authentication\_options\` array's \`id\` value in the \[\*\*Get user settings\*\*\](https://developers.zoom.us/docs/api-reference/zoom-api/methods#operation/userSettings) API response. \|
\| \`settings\_\_breakout\_\_room\_\_enable\` \| boolean \| No \| Whether to enable the \[\*\*Breakout Room pre-assign\*\*\](https://support.zoom.us/hc/en-us/articles/360032752671-Pre-assigning-participants-to-breakout-rooms) option. \|
\| \`settings\_\_audio\_\_conference\_\_info\` \| string \| No \| Third party audio conference info. \|
\| \`settings\_\_authentication\_\_domains\` \| string \| No \| The meeting's authenticated domains. Only Zoom users whose email address contains an authenticated domain can join the meeting. Comma-separate multiple domains or use a wildcard for listing domains. \|
\| \`settings\_\_meeting\_\_authentication\` \| boolean \| No \| If true, only \[authenticated\](https://support.zoom.us/hc/en-us/articles/360037117472-Authentication-Profiles-for-Meetings-and-Webinars) users can join the meeting. \|
\| \`settings\_\_allow\_\_multiple\_\_devices\` \| boolean \| No \| Whether to allow attendees to join a meeting from multiple devices. This setting is only applied to meetings with registration enabled. \|
\| \`settings\_\_host\_\_save\_\_video\_\_order\` \| boolean \| No \| Whether the \*\*Allow host to save video order\*\* feature is enabled. \|
\| \`settings\_\_authentication\_\_exception\` \| array \| No \| A list of participants that can bypass meeting authentication. These participants will receive a unique meeting invite. Each exception must include name and email fields. \|
\| \`settings\_\_push\_\_change\_\_to\_\_calendar\` \| boolean \| No \| Whether to push meeting changes to the calendar. To enable this feature, configure the \*\*Configure Calendar and Contacts Service\*\* in the user's profile page of the Zoom web portal and enable the \*\*Automatically sync Zoom calendar events information bi-directionally between Zoom and integrated calendars.\*\* setting in the \*\*Settings\*\* page of the Zoom web portal. \* \`true\` - Push meeting changes to the calendar. \* \`false\` - Do not push meeting changes to the calendar. \|
\| \`settings\_\_global\_\_dial\_\_in\_\_countries\` \| array \| No \| A list of available global dial-in countries. \|
\| \`settings\_\_auto\_\_start\_\_meeting\_\_summary\` \| boolean \| No \| Whether to automatically start a meeting summary. \|
\| \`settings\_\_participant\_\_focused\_\_meeting\` \| boolean \| No \| Whether to set the meeting as a participant focused meeting. \|
\| \`settings\_\_alternative\_\_host\_\_update\_\_polls\` \| boolean \| No \| Whether the \*\*Allow alternative hosts to add or edit polls\*\* feature is enabled. This requires Zoom version 5.8.0 or higher. \|
\| \`settings\_\_language\_\_interpretation\_\_enable\` \| boolean \| No \| Whether to enable \[language interpretation\](https://support.zoom.us/hc/en-us/articles/360034919791-Language-interpretation-in-meetings-and-webinars) for the meeting. \|
\| \`settings\_\_registrants\_\_confirmation\_\_email\` \| boolean \| No \| Whether to send registrants an email confirmation. \* \`true\` - Send a confirmation email. \* \`false\` - Do not send a confirmation email. \|
\| \`settings\_\_registrants\_\_email\_\_notification\` \| boolean \| No \| Whether to send registrants email notifications about their registration approval, cancellation, or rejection. \* \`true\` - Send an email notification. \* \`false\` - Do not send an email notification. Set this value to \`true\` to also use the \`registrants\_confirmation\_email\` parameter. \|
\| \`settings\_\_additional\_\_data\_\_center\_\_regions\` \| array \| No \| Add additional meeting \[data center regions\](https://support.zoom.us/hc/en-us/articles/360042411451-Selecting-data-center-regions-for-hosted-meetings-and-webinars). Provide this value as an array of \[country codes\](https://developers.zoom.us/docs/api/rest/other-references/abbreviation-lists/#countries) for the countries available as data center regions in the \[\*\*Account Profile\*\*\](https://zoom.us/account/setting) interface but have been opted out of in the \[user settings\](https://zoom.us/profile). For example, the data center regions selected in your \[\*\*Account Profile\*\*\](https://zoom.us/account) are \`Europe\`, \`Hong Kong SAR\`, \`Australia\`, \`India\`, \`Japan\`, \`China\`, \`United States\`, and \`Canada\`. However, in the \[\*\*My Profile\*\*\](https://zoom.us/profile) settings, you did \*\*not\*\* select \`India\` and \`Japan\` for meeting and webinar traffic routing. To include \`India\` and \`Japan\` as additional data centers, use the \`\[IN, TY\]\` value for this field. \|
\| \`settings\_\_continuous\_\_meeting\_\_chat\_\_enable\` \| boolean \| No \| Whether to enable the \*\*Enable continuous meeting chat\*\* setting. \|
\| \`settings\_\_approved\_denied\_regions\_\_denied\_\_list\` \| array \| No \| The list of blocked countries or regions. \|
\| \`settings\_\_auto\_\_start\_\_ai\_\_companion\_\_questions\` \| boolean \| No \| Whether to automatically start AI Companion questions. \|
\| \`settings\_\_language\_\_interpretation\_\_interpreters\` \| array \| No \| Information about the meeting's language interpreters. Each interpreter must include email and languages fields. \|
\| \`settings\_\_sign\_\_language\_\_interpretation\_\_enable\` \| boolean \| No \| Whether to enable \[sign language interpretation\](https://support.zoom.us/hc/en-us/articles/9644962487309-Using-sign-language-interpretation-in-a-meeting-or-webinar) for the meeting. \|
\| \`settings\_\_alternative\_\_hosts\_\_email\_\_notification\` \| boolean \| No \| Whether to send email notifications to alternative hosts. This value defaults to \`true\`. \|
\| \`settings\_\_approved\_denied\_regions\_\_approved\_\_list\` \| array \| No \| The list of approved countries or regions. \|
\| \`settings\_\_meeting\_\_chat\_\_auto\_\_add\_\_external\_\_users\` \| boolean \| No \| Whether to enable the \*\*Automatically add invited external users\*\* setting. \|
\| \`settings\_\_sign\_\_language\_\_interpretation\_\_interpreters\` \| array \| No \| Information about the meeting's sign language interpreters. Each interpreter must include email and sign\_language fields. \|
\| \`settings\_\_approved\_\_or\_\_denied\_\_countries\_\_or\_\_regions\_\_enable\` \| boolean \| No \| Whether to enable the \[\*\*Approve or block entry for users from specific countries/regions\*\*\](https://support.zoom.us/hc/en-us/articles/360060086231-Approve-or-block-entry-for-users-from-specific-countries-regions) setting. \|
\| \`settings\_\_approved\_\_or\_\_denied\_\_countries\_\_or\_\_regions\_\_method\` \| string ("approve" \| "deny") \| No \| Whether to allow or block users from specific countries or regions. \* \`approve\` - Allow users from specific countries or regions to join the meeting. If you select this setting, include the approved countries or regions in the \`approved\_list\` field. \* \`deny\` - Block users from specific countries or regions from joining the meeting. If you select this setting, include the blocked countries or regions in the \`denied\_list\` field. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create IQ conversation

\*\*Slug:\*\* \`ZOOM\_CREATE\_IQ\_CONVERSATION\`

DEPRECATED: Use ZOOM\_CREATE\_ZRA\_CONVERSATION instead (Zoom rebranded IQ to ZRA). Tool to create a Zoom Revenue Accelerator (formerly Zoom IQ) conversation. Use when you need to create a new conversation entry, typically after uploading recording files, transcripts, and metadata.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`topic\` \| string \| No \| Topic or title of the conversation. \|
\| \`host\_id\` \| string \| No \| User ID of the conversation host. If not provided, defaults to the authenticated user. \|
\| \`duration\` \| integer \| No \| Duration of the conversation in seconds. \|
\| \`meeting\_id\` \| string \| No \| Meeting ID to associate with this conversation. \|
\| \`start\_time\` \| string \| No \| Conversation start time in ISO 8601 date-time format (e.g., 2024-01-15T10:30:00Z). \|
\| \`primary\_language\` \| string \| No \| Primary language code for the conversation (e.g., 'en', 'es', 'fr'). \|
\| \`conversation\_type\` \| string \| No \| Type of conversation (e.g., 'meeting', 'phone', 'external'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create IQ conversation comment

\*\*Slug:\*\* \`ZOOM\_CREATE\_IQ\_CONVERSATION\_COMMENT\`

DEPRECATED: Use ZOOM\_CREATE\_ZRA\_CONVERSATION\_COMMENT instead (Zoom rebranded IQ to ZRA). Tool to create a comment on a Zoom IQ conversation. Use when you need to add comments, replies, or annotations to IQ conversation recordings or transcripts.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`comment\` \| string \| Yes \| The text content of the comment to add to the conversation. \|
\| \`is\_private\` \| boolean \| No \| Whether the comment is private (visible only to specific users) or public (visible to all conversation participants). \|
\| \`conversation\_id\` \| string \| Yes \| The conversation's unique identifier. \|
\| \`mention\_team\_ids\` \| array \| No \| Array of team IDs to mention in the comment. Team members will be notified. \|
\| \`mention\_user\_ids\` \| array \| No \| Array of user IDs to mention in the comment. These users will be notified. \|
\| \`parent\_comment\_id\` \| string \| No \| Parent comment ID for threaded replies. Leave empty for top-level comments. \|
\| \`time\_in\_recording\` \| string \| No \| Timestamp in the recording where the comment should be anchored. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create IQ user conversation

\*\*Slug:\*\* \`ZOOM\_CREATE\_IQ\_USER\_CONVERSATION\`

DEPRECATED: Use ZOOM\_CREATE\_ZRA\_USER\_CONVERSATION instead (Zoom rebranded IQ to ZRA). Tool to create a Zoom IQ conversation for a user. Use when you need to create a new conversation entry in Zoom Revenue Accelerator for a specific user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| No \| The user ID or email address of the user. Use 'me' to create a conversation for the authenticated user. Defaults to 'me'. \|
\| \`type\` \| string \| No \| The type of conversation (e.g., 'meeting', 'phone\_call'). \|
\| \`topic\` \| string \| No \| The topic or title of the conversation. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create whiteboard project

\*\*Slug:\*\* \`ZOOM\_CREATE\_PROJECT\`

Creates a new whiteboard project in Zoom. Use when you need to organize and group whiteboards together, optionally adding collaborators and initializing the project with existing whiteboards.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`owner\_email\` \| string \| No \| Email address of the project owner. Only usable with admin scope. \|
\| \`project\_name\` \| string \| Yes \| The name of the whiteboard project. Must be between 1 and 50 characters. \|
\| \`collaborators\` \| array \| No \| List of collaborators to add to the project. Each collaborator must have an email and role. \|
\| \`invite\_message\` \| string \| No \| The invite message to send to collaborators. Maximum 280 characters. \|
\| \`whiteboard\_ids\` \| array \| No \| List of whiteboard IDs to add to the project. Whiteboards must belong to the same account. \|
\| \`skip\_notifications\` \| boolean \| No \| If set to true, collaborators will not receive notifications when added to the project. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create a whiteboard

\*\*Slug:\*\* \`ZOOM\_CREATE\_WHITEBOARD\`

Creates a new whiteboard for the authenticated user. Use when you need to create a blank whiteboard that can be shared and collaborated on with others. The whiteboard will be associated with the user making the API call. \*\*Required scope:\*\* whiteboard:write or whiteboard:write:whiteboard \*\*Notes:\*\* - If no name is provided, the whiteboard will be named "Untitled" - After creation, the whiteboard can be shared with collaborators using share settings

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| The whiteboard name. If not provided, the default name 'Untitled' will be used. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create whiteboard export

\*\*Slug:\*\* \`ZOOM\_CREATE\_WHITEBOARD\_EXPORT\`

Creates an export task to generate PDF exports and audit logs for specified whiteboards. The exported content is bundled into a ZIP file containing the whiteboard PDFs and audit logs. Use when you need to export one or more whiteboards for archival, sharing, or compliance purposes. Use this action when you want to export whiteboard content as a downloadable ZIP file containing PDF exports and audit logs. After creating the export task, poll the GetWhiteboardExportStatus action using the returned task\_id until the status changes to 'successed', then download the export using the DownloadWhiteboardExport action. Note: This action only initiates the export process. The export is processed asynchronously. You must poll GetWhiteboardExportStatus to check when the export is ready, then use DownloadWhiteboardExport to retrieve the actual ZIP file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`whiteboard\_ids\` \| array \| Yes \| The list of whiteboard IDs to export. The list must contain between 1 and 50 unique whiteboard IDs. If more than 50 IDs are provided, only the first 50 will be processed. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create ZRA conversation

\*\*Slug:\*\* \`ZOOM\_CREATE\_ZRA\_CONVERSATION\`

Tool to create a new conversation in Zoom Revenue Accelerator (ZRA). Use when uploading meeting recordings or phone calls for AI-powered analytics, including transcription, sentiment analysis, and engagement scoring.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`deal\_id\` \| string \| No \| Zoom deal ID to associate this conversation with a specific deal in your CRM. \|
\| \`file\_id\` \| string \| No \| IQ file's unique identifier for uploading a recording file that was already uploaded to Zoom IQ. \|
\| \`host\_id\` \| string \| No \| Host user ID or email address. If not provided, the OAuth token owner will be set as the default host. \|
\| \`timeline\` \| array \| No \| Speech timeline showing when each participant spoke during the recording. Helps with speaker diarization and analytics. \|
\| \`timezone\` \| string \| No \| Time zone for formatting timestamps in the conversation analytics (e.g., 'America/New\_York', 'Europe/London'). \|
\| \`download\_url\` \| string \| No \| Third-party download URL for the recording file. Use this to directly upload a file from an external file service. \|
\| \`participants\` \| array \| No \| List of participants in the conversation. Maximum 200 participants. Each participant must have a display\_name and optionally an email. \|
\| \`meeting\_end\_time\` \| string \| No \| End time of the meeting or call in ISO-8601 format. Optional but recommended for accurate duration tracking. \|
\| \`primary\_language\` \| string ("en" \| "es" \| "fr" \| "de" \| "it" \| "zh" \| "ru" \| "uk" \| "ja" \| "ko" \| "vi" \| "pt" \| "nl" \| "hi") \| No \| Supported primary languages for conversation analysis \|
\| \`conversation\_type\` \| string ("meeting" \| "phone") \| Yes \| Type of conversation to create. Use 'meeting' for Zoom meetings or video calls, 'phone' for phone calls. \|
\| \`conversation\_topic\` \| string \| No \| Topic or title of the meeting or phone call. Helps identify the conversation in analytics. \|
\| \`meeting\_start\_time\` \| string \| Yes \| Start time of the meeting or call in ISO-8601 format (e.g., '2026-02-17T10:00:00Z'). Required for all conversations. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create ZRA conversation comment

\*\*Slug:\*\* \`ZOOM\_CREATE\_ZRA\_CONVERSATION\_COMMENT\`

Tool to create a comment on a Zoom Revenue Accelerator conversation. Use when you need to add comments, replies, or annotations to ZRA conversation recordings or transcripts.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The conversation identifier for the Zoom Revenue Accelerator conversation. \|
\| \`comment\` \| string \| Yes \| The text content of the comment to add to the conversation. \|
\| \`is\_private\` \| boolean \| No \| Whether the comment is private (visible only to specific users) or public (visible to all conversation participants). \|
\| \`mention\_team\_ids\` \| array \| No \| Array of team IDs to mention in the comment. Team members will be notified. \|
\| \`mention\_user\_ids\` \| array \| No \| Array of user IDs to mention in the comment. These users will be notified. \|
\| \`parent\_comment\_id\` \| string \| No \| Parent comment ID for nested replies. Leave empty for top-level comments. \|
\| \`time\_in\_recording\` \| string \| No \| Timestamp in the recording where the comment should be anchored (format: HH:MM:SS). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create ZRA CRM accounts

\*\*Slug:\*\* \`ZOOM\_CREATE\_ZRA\_CRM\_ACCOUNTS\`

Tool to create or update CRM accounts in Zoom Revenue Accelerator (ZRA). Use when you need to sync CRM account data to Zoom IQ. Supports up to 2000 accounts per request and returns an async task ID for polling status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| array \| Yes \| Array of CRM account objects to create or update. Maximum 2000 accounts per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create ZRA CRM contacts

\*\*Slug:\*\* \`ZOOM\_CREATE\_ZRA\_CRM\_CONTACTS\`

Tool to bulk import or delete CRM contacts in Zoom Revenue Accelerator. Use when syncing contacts from external CRM systems. Accepts up to 2,000 contacts per request and returns a task ID for async status tracking.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| array \| Yes \| Array of CRM contact objects. Up to 2,000 contacts can be submitted per request \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create ZRA CRM deals

\*\*Slug:\*\* \`ZOOM\_CREATE\_ZRA\_CRM\_DEALS\`

Tool to bulk import or delete CRM deals in Zoom Revenue Accelerator (ZRA). Use when you need to synchronize deals from an external CRM to Zoom's ZRA system. Supports up to 2000 deals per request and processes asynchronously.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| array \| Yes \| List of CRM deal objects for bulk import or deletion. Maximum of 2000 deals per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Bulk import ZRA CRM leads

\*\*Slug:\*\* \`ZOOM\_CREATE\_ZRA\_CRM\_LEADS\`

Tool to bulk import CRM leads into Zoom Revenue Accelerator (ZRA). Use when you need to import or update multiple leads asynchronously. Supports up to 2000 leads per request and returns a task\_id to track import progress.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| array \| Yes \| Array of CRM lead objects to bulk import. Maximum of 2000 leads per request. Each lead must include crm\_lead\_id, lead\_name, and modify\_time. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create ZRA CRM settings

\*\*Slug:\*\* \`ZOOM\_CREATE\_ZRA\_CRM\_SETTINGS\`

Tool to register a new CRM API integration for Zoom Revenue Accelerator (ZRA). Use when you need to configure CRM settings including type, name, currency, deal stages, and URL patterns for accessing CRM records.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`crm\_name\` \| string \| No \| Display name for the CRM type. If not provided, defaults to the value of crm\_type. \|
\| \`crm\_type\` \| string \| Yes \| CRM type identifier, 1-16 alphanumeric characters, must start with letter (e.g., 'oracle', 'salesforce'). \|
\| \`deal\_stages\` \| array \| Yes \| Array of deal stage definitions. Must include at least one stage for each type: OPEN, CLOSED\_WON, and CLOSED\_LOST. \|
\| \`currency\_type\` \| string \| No \| Currency unit to use (e.g., 'USD', 'EUR', 'JPY'). Defaults to 'USD' if not specified. \|
\| \`url\_pattern\_deal\` \| string \| No \| URL pattern template for opening deal objects in the CRM. Use {id} as placeholder for the deal ID (e.g., 'https://example.com/deals/{id}'). \|
\| \`url\_pattern\_lead\` \| string \| No \| URL pattern template for opening lead objects in the CRM. Use {id} as placeholder (e.g., 'https://example.com/leads/{id}'). \|
\| \`url\_pattern\_account\` \| string \| No \| URL pattern template for opening account objects in the CRM. Use {id} as placeholder (e.g., 'https://example.com/accounts/{id}'). \|
\| \`url\_pattern\_contact\` \| string \| No \| URL pattern template for opening contact objects in the CRM. Use {id} as placeholder (e.g., 'https://example.com/contacts/{id}'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create ZRA user conversation

\*\*Slug:\*\* \`ZOOM\_CREATE\_ZRA\_USER\_CONVERSATION\`

Tool to create a new conversation in Zoom Revenue Accelerator for a specific user. Use when you need to initiate a ZRA conversation entry with topic and start time.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The user ID or 'me' to create a conversation for. Use 'me' for the authenticated user. \|
\| \`topic\` \| string \| Yes \| The conversation title/topic. Specifies the name or subject of the conversation. \|
\| \`start\_time\` \| string \| Yes \| Meeting start timestamp in ISO 8601 format (e.g., '2026-02-17T10:00:00Z'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete a meeting

\*\*Slug:\*\* \`ZOOM\_DELETE\_A\_MEETING\`

Delete or cancel a scheduled Zoom meeting. Use occurrence\_id to delete a specific occurrence of a recurring meeting. Supports notification options for hosts and registrants. Returns HTTP 204 on success. Rate limit: Light. Required scopes: meeting:write or meeting:write:admin.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`meeting\_id\` \| string \| Yes \| The meeting ID or meeting UUID to delete/cancel. When storing this value in your database, store it as a long format integer and not an integer. Meeting IDs can be more than 10 digits. \|
\| \`occurrence\_id\` \| string \| No \| The meeting occurrence ID to delete a specific occurrence of a recurring meeting. If provided, only that occurrence will be deleted. If not provided and the meeting is recurring, all occurrences will be deleted. \|
\| \`schedule\_for\_reminder\` \| boolean \| No \| Whether to send a notification to the host and alternative hosts about the meeting cancellation. Set to true to notify the meeting host and alternative hosts. \|
\| \`cancel\_meeting\_reminder\` \| boolean \| No \| Whether to send a cancellation notification to meeting registrants. Set to true to notify all registrants that the meeting has been cancelled. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete IQ conversation

\*\*Slug:\*\* \`ZOOM\_DELETE\_IQ\_CONVERSATION\`

DEPRECATED: Use ZOOM\_DELETE\_ZRA\_CONVERSATION instead (Zoom rebranded IQ to ZRA). Tool to delete a Zoom IQ conversation by its ID. Use when you need to permanently remove a specific Zoom IQ conversation from the system. Returns HTTP 200 with empty body on success.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The conversation ID to delete. This is the unique identifier for the Zoom IQ conversation that you want to remove. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete IQ conversation comment

\*\*Slug:\*\* \`ZOOM\_DELETE\_IQ\_CONVERSATION\_COMMENT\`

DEPRECATED: Use ZOOM\_DELETE\_ZRA\_CONVERSATION\_COMMENT instead (Zoom rebranded IQ to ZRA). Tool to delete a comment from a Zoom IQ (Revenue Accelerator) conversation. Use when you need to remove a specific comment from a conversation. The endpoint uses idempotent DELETE behavior, returning success regardless of whether the comment exists.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`commentId\` \| string \| Yes \| The comment's unique identifier within that conversation. \|
\| \`conversationId\` \| string \| Yes \| The conversation's unique identifier. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete IQ deal activities

\*\*Slug:\*\* \`ZOOM\_DELETE\_IQ\_DEAL\_ACTIVITIES\`

DEPRECATED: Use ZOOM\_DELETE\_ZRA\_DEAL\_ACTIVITIES instead (Zoom rebranded IQ to ZRA). Tool to delete activities associated with a Zoom IQ deal. Use when you need to remove activity records from a specific deal. Can delete all activities or specific ones by providing activity IDs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier of the deal whose activities should be deleted. \|
\| \`activity\_ids\` \| string \| No \| Comma-separated list of activity IDs to delete. If not provided, all activities for the deal will be deleted. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete meeting recordings

\*\*Slug:\*\* \`ZOOM\_DELETE\_MEETING\_RECORDINGS\`

Deletes all cloud recordings for a meeting or webinar. Requires the account to have Cloud Recording enabled. Rate limit: Light. Required scopes: cloud\_recording:delete:meeting\_recording or cloud\_recording:delete:meeting\_recording:admin.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`action\` \| string ("trash" \| "delete") \| No \| The delete action to perform: 'trash' (default) moves recordings to trash where they can be recovered; 'delete' permanently removes recordings and cannot be undone. \|
\| \`meetingId\` \| string \| Yes \| The meeting ID or meeting UUID whose cloud recordings you want to delete. If a numeric meeting ID is provided, recordings from the latest meeting instance are deleted. Also accepts webinar ID or UUID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete whiteboard project

\*\*Slug:\*\* \`ZOOM\_DELETE\_PROJECT\`

Deletes a whiteboard project by its ID. Deleting a project removes all associated whiteboards from the project. Use when you need to permanently remove a whiteboard project and all its contents from Zoom. This action is irreversible — once the project is deleted, it cannot be recovered, and all associated whiteboards will be removed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`projectId\` \| string \| Yes \| The project ID of the whiteboard project to delete. Deleting a project removes all associated whiteboards from the project. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove project collaborator

\*\*Slug:\*\* \`ZOOM\_DELETE\_PROJECT\_COLLABORATOR\`

Removes a collaborator from a whiteboard project. Use this action when you need to revoke a user's access to a specific whiteboard project. This action is irreversible — once a collaborator is removed, they will no longer have access to the project's whiteboards unless re-added. \*\*Note:\*\* The authenticated user must be the project owner, co-owner, or have admin permissions to remove collaborators.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`project\_id\` \| string \| Yes \| The unique identifier of the whiteboard project. \|
\| \`collaborator\_id\` \| string \| Yes \| The unique identifier of the collaborator to remove from the project. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete recording file

\*\*Slug:\*\* \`ZOOM\_DELETE\_RECORDING\_FILE\`

Deletes a specific cloud recording file from a meeting or webinar. This action is irreversible when using the 'delete' action - the file cannot be recovered once permanently removed. Use this action when you need to remove an individual recording file (such as a specific video, audio, transcript, or chat file) rather than all recordings for a meeting. Requires the account to have Cloud Recording enabled. Rate limit: Light.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`action\` \| string ("trash" \| "delete") \| No \| The delete action to perform: 'trash' (default) moves the recording file to trash where it can be recovered; 'delete' permanently removes the recording file and cannot be undone. \|
\| \`meetingId\` \| string \| Yes \| The meeting ID or meeting UUID that contains the recording file you want to delete. If a numeric meeting ID is provided, the recording from the latest meeting instance is targeted. Also accepts webinar ID or UUID. \|
\| \`recordingId\` \| string \| Yes \| The unique identifier of the specific recording file to delete. This ID can be obtained from the Get Meeting Recordings endpoint. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete whiteboard

\*\*Slug:\*\* \`ZOOM\_DELETE\_WHITEBOARD\`

Deletes a whiteboard by its unique identifier. Use when you need to permanently remove a specific whiteboard from Zoom. This action is irreversible — once deleted, the whiteboard cannot be recovered. Requires the user to have whiteboard delete permissions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`whiteboardId\` \| string \| Yes \| The ID of the whiteboard to delete. This is the unique identifier assigned to the whiteboard when it was created. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete whiteboard collaborator

\*\*Slug:\*\* \`ZOOM\_DELETE\_WHITEBOARD\_COLLABORATOR\`

Removes a collaborator from a whiteboard. Use this action when you need to revoke a user's access to a specific whiteboard by removing them as a collaborator. This action is irreversible for the collaborator's access — the collaborator will no longer be able to view or edit the whiteboard unless added back. Requires the user to have whiteboard admin or owner permissions. \*\*Prerequisites:\*\* - The authenticated user must be the whiteboard owner, co-owner, or have admin permissions - The collaborator must currently have access to the whiteboard \*\*Common errors:\*\* - "Whiteboard not found" - Invalid whiteboard ID - "Collaborator not found" - The specified collaborator does not have access to the whiteboard - "Insufficient permissions" - User lacks permission to remove collaborators

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`whiteboardId\` \| string \| Yes \| The unique identifier of the whiteboard from which to remove the collaborator. This is the unique identifier assigned to the whiteboard when it was created. \|
\| \`collaboratorId\` \| string \| Yes \| The unique identifier of the collaborator to remove from the whiteboard. This is the email address or user ID of the collaborator. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete ZRA conversation

\*\*Slug:\*\* \`ZOOM\_DELETE\_ZRA\_CONVERSATION\`

Deletes a ZRA (Zoom Revenue Accelerator) conversation by ID. Use when you need to remove a conversation from the Revenue Accelerator system. This is an undocumented endpoint that returns HTTP 200 on success.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The ZRA (Zoom Revenue Accelerator) conversation ID to delete. This is a unique identifier for the conversation in Zoom's Revenue Accelerator system. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete ZRA conversation comment

\*\*Slug:\*\* \`ZOOM\_DELETE\_ZRA\_CONVERSATION\_COMMENT\`

Tool to delete a comment from a Zoom Revenue Accelerator conversation. Use when you need to remove a specific comment from a ZRA conversation.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`comment\_id\` \| string \| Yes \| The ID of the comment to delete from the conversation. \|
\| \`conversation\_id\` \| string \| Yes \| The ID of the Zoom Revenue Accelerator conversation containing the comment to delete. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete ZRA CRM settings

\*\*Slug:\*\* \`ZOOM\_DELETE\_ZRA\_CRM\_SETTINGS\`

Deletes CRM settings for Zoom Revenue Accelerator (ZRA). Use when you need to remove CRM configuration from the account.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete ZRA deal activities

\*\*Slug:\*\* \`ZOOM\_DELETE\_ZRA\_DEAL\_ACTIVITIES\`

Tool to delete activities from a Zoom Revenue Accelerator (ZRA) deal. Use when you need to remove one or more activities associated with a specific deal by providing the deal ID and comma-separated activity IDs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The deal ID for which to delete activities. This is the unique identifier of the deal in Zoom Revenue Accelerator. \|
\| \`activity\_ids\` \| string \| Yes \| Comma-separated list of activity IDs to delete from the deal. For example: 'activity-1,activity-2,activity-3'. All specified activities will be removed from the deal. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Download imported whiteboard file

\*\*Slug:\*\* \`ZOOM\_DOWNLOAD\_IMPORTED\_WHITEBOARD\_FILE\`

Downloads a specific file that was imported into a whiteboard, including images, PDFs, DOCX, and other supported file formats. Use this action when you need to retrieve the actual file content of an imported whiteboard attachment. This action streams the file content directly from Zoom's servers.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fileId\` \| string \| Yes \| The unique identifier of the file to download. This is the file ID assigned when the file was imported into the whiteboard. \|
\| \`whiteboardId\` \| string \| Yes \| The unique identifier of the whiteboard from which to download the file. This is the whiteboard's unique ID, not the session ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Download whiteboard export

\*\*Slug:\*\* \`ZOOM\_DOWNLOAD\_WHITEBOARD\_EXPORT\`

Downloads the exported whiteboard content for a completed whiteboard export task. The task must have completed successfully before calling this action. Use when you need to retrieve the actual whiteboard content (drawings, annotations, images) that was exported using the Create whiteboard export API. Returns a ZIP archive containing the whiteboard files. This action is read-only and does not modify any whiteboard data. Use this action when you have created a whiteboard export task and want to download the resulting ZIP file containing the exported content.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`taskId\` \| string \| Yes \| The unique identifier of the whiteboard export task. Use the task\_id returned from the Create whiteboard export API once the export task has completed. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Download whiteboard session activity

\*\*Slug:\*\* \`ZOOM\_DOWNLOAD\_WHITEBOARD\_SESSION\_ACTIVITY\`

Downloads the activity archive file for a whiteboard archiving session. This action retrieves the PDF file containing whiteboard session activity data based on the provided file path. Use when you need to retrieve the archived activity file for a completed whiteboard session. Use this action when you have obtained a file path from the List whiteboard sessions activities endpoint and want to download the actual activity archive file. The file is returned as a PDF stream. This action is read-only and does not modify any data. Note: Files may expire and return 404 if the download URL has expired.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| Yes \| The file path to the activity archive file. Obtain this path from the 'List whiteboard sessions activities' endpoint in the download\_url field of each activity record. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get a meeting

\*\*Slug:\*\* \`ZOOM\_GET\_A\_MEETING\`

Retrieves detailed information about a Zoom meeting by its ID. Returns comprehensive meeting data including topic, schedule, URLs, passwords, settings, and for recurring meetings, occurrence details and recurrence patterns. For recurring meetings, defaults to the latest occurrence unless occurrence\_id or show\_previous\_occurrences is specified. Returned start\_time must be interpreted using the meeting's timezone field. Requires meeting:read scope. Rate limit: LIGHT.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`meeting\_id\` \| string \| Yes \| The meeting's ID. When storing this value in your database, store it as a long format integer and \*\*not\*\* an integer. Meeting IDs can be more than 10 digits. UUID-style meeting IDs containing a leading '/' or '//' must be double-URL-encoded before use. \|
\| \`occurrence\_id\` \| string \| No \| Meeting occurrence ID. Provide this field to view meeting details of a particular occurrence of the \[recurring meeting\](https://support.zoom.us/hc/en-us/articles/214973206-Scheduling-Recurring-Meetings). \|
\| \`show\_previous\_occurrences\` \| boolean \| No \| Set this field's value to \`true\` to view meeting details of all previous occurrences of a \[recurring meeting\](https://support.zoom.us/hc/en-us/articles/214973206-Scheduling-Recurring-Meetings). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get a meeting summary (Paid accounts only)

\*\*Slug:\*\* \`ZOOM\_GET\_A\_MEETING\_SUMMARY\`

IMPORTANT: This action requires a PAID Zoom account (Pro, Business, or Enterprise plan). Free Zoom accounts cannot use this feature and will receive a 400 error. Additionally requires: - AI Companion feature enabled in account settings - Meeting must not be end-to-end encrypted (E2EE) - Meeting summary must be enabled and generated for the meeting Rate limit: LIGHT. Response fields such as \`summary\_details\` and \`next\_steps\` are optional and may be absent or empty arrays.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`meetingId\` \| string \| Yes \| The meeting’s past instance UUID (e.g. ‘aDYlohsHRtCd4ii1uC2+hA==’). This endpoint only accepts instance UUIDs from list\_past\_meeting\_instances or past\_meetings — the definition UUID from list\_meetings will NOT work. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get a webinar

\*\*Slug:\*\* \`ZOOM\_GET\_A\_WEBINAR\`

Access Zoom Webinar details requires Pro or higher plan and Webinar add-on. Scopes include \`webinar:read:admin\` and \`webinar:read\`. Granular scopes and a 'LIGHT' rate limit also apply.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`webinar\_id\` \| string \| Yes \| The webinar's ID or universally unique ID (UUID). \|
\| \`occurrence\_id\` \| string \| No \| Unique identifier for an occurrence of a recurring webinar. \[Recurring webinars\](https://support.zoom.us/hc/en-us/articles/216354763-How-to-Schedule-A-Recurring-Webinar) can have a maximum of 50 occurrences. When you create a recurring Webinar using \[\*\*Create a webinar\*\*\](https://developers.zoom.us) API, you can retrieve the Occurrence ID from the response of the API call. \|
\| \`show\_previous\_occurrences\` \| boolean \| No \| Set the value of this field to \`true\` if you would like to view Webinar details of all previous occurrences of a recurring Webinar. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get daily usage report

\*\*Slug:\*\* \`ZOOM\_GET\_DAILY\_USAGE\_REPORT\`

The daily report provides Zoom service usage details, like new users, meetings, participants, and minutes per day for a month, requiring a Pro plan or higher. It has a 'Heavy' rate limit.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`year\` \| integer \| No \| Year for this report. Defaults to the current year if not provided. \|
\| \`month\` \| integer \| No \| Month for this report (1-12). Defaults to the current month if not provided. \|
\| \`group\_id\` \| string \| No \| The group ID to filter results. Use the List groups API to retrieve group IDs. When specified, the response only includes users who are members of the queried group. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IQ conversation comments

\*\*Slug:\*\* \`ZOOM\_GET\_IQ\_CONVERSATION\_COMMENTS\`

DEPRECATED: Use ZOOM\_GET\_ZRA\_CONVERSATION\_COMMENTS instead (Zoom rebranded IQ to ZRA). Tool to retrieve all comments for a specific Zoom IQ conversation. Use when you need to access comments, replies, and discussion threads within a conversation. Returns comment content, timestamps, user information, and mentions. Supports pagination for large comment sets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_size\` \| integer \| No \| Number of records per API call. Default is 30. \|
\| \`conversation\_id\` \| string \| Yes \| The conversation's ID. If the ID begins with a \`/\` character or contains \`//\` characters, you must double encode the ID value. \|
\| \`next\_page\_token\` \| string \| No \| For pagination through large result sets with 15-minute expiration. Use this token to retrieve the next page of results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IQ conversation content analysis

\*\*Slug:\*\* \`ZOOM\_GET\_IQ\_CONVERSATION\_CONTENT\_ANALYSIS\`

Tool to retrieve content analysis for a Zoom IQ conversation by its ID. Use when you need to get AI-generated insights and analysis from a Revenue Accelerator conversation. Returns structured analysis data including conversation insights and extracted content.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The conversation ID to analyze. This identifies the specific conversation for which content analysis is requested. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IQ conversation interactions

\*\*Slug:\*\* \`ZOOM\_GET\_IQ\_CONVERSATION\_INTERACTIONS\`

DEPRECATED: Use ZOOM\_GET\_ZRA\_CONVERSATION\_INTERACTIONS instead (Zoom rebranded IQ to ZRA). Tool to retrieve interactions for a specific Zoom IQ (Revenue Accelerator) conversation. Use when you need to fetch conversation interaction data, including participant interactions and transcript details. Supports pagination for large result sets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier of the conversation for which to retrieve interactions. \|
\| \`page\_size\` \| integer \| No \| The number of records to return per page. Default is 30. \|
\| \`next\_page\_token\` \| string \| No \| Token to retrieve the next page of results. Use the token returned in the previous response to paginate through large result sets. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IQ conversation scorecards

\*\*Slug:\*\* \`ZOOM\_GET\_IQ\_CONVERSATION\_SCORECARDS\`

DEPRECATED: Use ZOOM\_GET\_ZRA\_CONVERSATION\_SCORECARDS instead (Zoom rebranded IQ to ZRA). Tool to retrieve scorecards for a specific Zoom IQ conversation by conversation ID. Use when you need to access scorecard data associated with a conversation. Note: There is a known issue where the API may return an empty scorecards list even when scorecards exist in the UI.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The conversation ID to retrieve scorecards for. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IQ deal

\*\*Slug:\*\* \`ZOOM\_GET\_IQ\_DEAL\`

Tool to get details of a specific deal in Zoom Revenue Accelerator (formerly Zoom IQ). Returns deal information for the specified deal ID including name, amount, stage, owner, and dates.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier of the deal to retrieve. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IQ deal activities

\*\*Slug:\*\* \`ZOOM\_GET\_IQ\_DEAL\_ACTIVITIES\`

DEPRECATED: Use ZOOM\_GET\_ZRA\_DEAL\_ACTIVITIES instead (Zoom rebranded IQ to ZRA). Tool to retrieve activities associated with a Zoom Revenue Accelerator (formerly Zoom IQ) deal. Use when you need to list all activities for a specific deal.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier of the deal whose activities to retrieve. \|
\| \`page\_size\` \| integer \| No \| Number of records to return per page. Default is 30, maximum is 100. \|
\| \`next\_page\_token\` \| string \| No \| Token for pagination to fetch the next page of results. Use the token returned in the previous response to get the next page. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get IQ user conversation playlists

\*\*Slug:\*\* \`ZOOM\_GET\_IQ\_USER\_CONVERSATIONS\_PLAYLISTS\`

DEPRECATED: Use ZOOM\_LIST\_ZRA\_USER\_CONVERSATION\_PLAYLISTS instead (Zoom rebranded IQ to ZRA). Tool to retrieve conversation playlists for a Zoom IQ (Revenue Accelerator) user. Returns playlist information or an empty response when no playlists exist.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The user ID for which to retrieve conversation playlists. Use 'me' to get playlists for the authenticated user. \|
\| \`page\_size\` \| integer \| No \| Number of records to return per page. Maximum 300. \|
\| \`next\_page\_token\` \| string \| No \| Token for fetching the next page of results. Obtained from the previous response's next\_page\_token field. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get marketplace user apps

\*\*Slug:\*\* \`ZOOM\_GET\_MARKETPLACE\_USER\_APPS\`

Retrieves a paginated list of Zoom Marketplace apps installed for a specific user. Returns app details including app ID, name, type, and installation status. Use when you need to check which marketplace apps a user has access to.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The user ID. Can be retrieved using GET /users/me or GET /users endpoints. \|
\| \`page\_size\` \| integer \| No \| Number of records returned per page. \|
\| \`next\_page\_token\` \| string \| No \| Token for retrieving the next page of results. Use the token returned from the previous response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get marketplace user entitlements

\*\*Slug:\*\* \`ZOOM\_GET\_MARKETPLACE\_USER\_ENTITLEMENTS\`

Retrieves marketplace entitlements for a specific Zoom user by ID or 'me'. Returns list of entitlements associated with the user's account. Use when you need to check user marketplace subscriptions or permissions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The user ID or email address of the user. For user-level apps, pass the \`me\` value to fetch the authenticated user's entitlements. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get meeting recordings

\*\*Slug:\*\* \`ZOOM\_GET\_MEETING\_RECORDINGS\`

To download meeting recordings, use \`download\_url\`. Include OAuth token in the header for passcode-protected ones. Supports \`recording:read\` and \`phone\_recording:read:admin\` scopes, with a \`LIGHT\` rate limit. Requires a paid Zoom plan with cloud recording enabled; missing entitlements return empty results or entitlement errors, not system failures. Error code 3301 means no cloud recording exists for the meeting — an expected empty-result case.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ttl\` \| integer \| No \| The \`download\_access\_token\` Time to Live (TTL) value. This parameter is only valid if the \`include\_fields\` query parameter contains the \`download\_access\_token\` value. \|
\| \`meeting\_id\` \| string \| Yes \| To get a meeting's cloud recordings, provide the meeting ID or UUID. If providing the meeting ID instead of UUID, the response will be for the latest meeting instance. To get a webinar's cloud recordings, provide the webinar's ID or UUID. If providing the webinar ID instead of UUID, the response will be for the latest webinar instance. \|
\| \`include\_fields\` \| string \| No \| Set to 'download\_access\_token' to include a JWT token for downloading the meeting's recordings. This token can be appended to download URLs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get past meeting participants

\*\*Slug:\*\* \`ZOOM\_GET\_PAST\_MEETING\_PARTICIPANTS\`

Retrieves the list of participants who attended a past (ended) Zoom meeting. Requires a paid Zoom account (Pro or higher). Meeting must have ended with at least one participant (excluding solo meetings). Use meeting ID for the latest instance, or instance UUID for a specific occurrence.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_size\` \| integer \| No \| The number of records returned within a single API call. \|
\| \`meeting\_id\` \| string \| Yes \| The meeting's numeric ID or instance UUID. If you provide a numeric meeting ID, the API returns participants for the latest meeting instance. If you provide a UUID, it must be an \*instance\* UUID (from list\_past\_meeting\_instances), not the series UUID from list\_meetings. \|
\| \`next\_page\_token\` \| string \| No \| Use the next page token to paginate through large result sets. A next page token is returned whenever the set of available results exceeds the current page size. This token's expiration period is 15 minutes. Exhaust all pages by repeatedly calling with the returned token until it is absent; stopping early silently omits remaining participants. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get whiteboard project

\*\*Slug:\*\* \`ZOOM\_GET\_PROJECT\`

Retrieves detailed information about a specific whiteboard project by its ID. Returns project metadata including name, description, owner, sharing settings, and timestamps. Use this action when you need to view details about a Zoom Whiteboard project or retrieve its configuration.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`project\_id\` \| string \| Yes \| The unique identifier of the whiteboard project to retrieve. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get a user

\*\*Slug:\*\* \`ZOOM\_GET\_USER\`

Retrieves detailed information about a specific Zoom user by ID, email, or 'me'. Returns user type, role, license info, and account metadata. Use when you need to check user type/license or retrieve user profile details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| Yes \| The user ID or email address of the user. For user-level apps, pass the \`me\` value to fetch the authenticated user. \|
\| \`login\_type\` \| integer \| No \| The user's login method: \`0\` - Facebook OAuth, \`1\` - Google OAuth, \`24\` - Apple OAuth, \`27\` - Microsoft OAuth, \`97\` - Mobile device, \`98\` - RingCentral OAuth, \`99\` - API user, \`100\` - Zoom Work email, \`101\` - Single Sign-On (SSO). The following login methods are only available in China: \`11\` - Phone number, \`21\` - WeChat, \`23\` - Alipay. \|
\| \`encrypted\_email\` \| boolean \| No \| Whether the email address in the response should be encrypted. Set to \`true\` to encrypt the email in the response. \|
\| \`search\_by\_unique\_id\` \| boolean \| No \| Whether to search for the user by their unique ID (UID). Set to \`true\` to search by the user's unique ID instead of their user ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get a whiteboard

\*\*Slug:\*\* \`ZOOM\_GET\_WHITEBOARD\`

Retrieves details about a specific whiteboard document. Returns comprehensive whiteboard information including name, creation/modification dates, share settings, and classification. Use this action when you need to fetch metadata for a specific whiteboard by its ID. Requires whiteboard:read or whiteboard:read:admin scope.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`whiteboardId\` \| string \| Yes \| The unique identifier of the whiteboard. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get whiteboard export status

\*\*Slug:\*\* \`ZOOM\_GET\_WHITEBOARD\_EXPORT\_STATUS\`

Retrieves the status of a whiteboard export task by its task ID. This action queries the current state of an export request initiated via the create whiteboard export action. Use this action when you need to check whether a whiteboard export has completed processing, is still being generated, or has failed. Poll this endpoint until status changes from 'processing' to either 'successed' or 'failed'. The export is processed asynchronously, so you should poll this endpoint periodically to check for completion before attempting to download the exported file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`task\_id\` \| string \| Yes \| The unique identifier of the whiteboard export task. This ID is returned when you create a whiteboard export. Example: adcc655d3a3549e692959737fe2a7a0d \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get a whiteboard session

\*\*Slug:\*\* \`ZOOM\_GET\_WHITEBOARD\_SESSION\`

Retrieves detailed information about a specific whiteboard session by its session ID. Returns session metadata including start/end times, whiteboard info, and a list of activities performed during the session. Use this action when you need to retrieve session details, activity logs, or participant information for a Zoom Whiteboard session. For large result sets, use pagination with next\_page\_token.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_size\` \| integer \| No \| The number of records returned within a single API call. If not specified, defaults to 30. Maximum value is 300. \|
\| \`session\_id\` \| string \| Yes \| The session unique ID. You can get this ID from the session list API or from webhook payloads when sessions are created or updated. \|
\| \`next\_page\_token\` \| string \| No \| The next page token is used to paginate through a large set of results. Provided in the response when there are more records available. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get ZRA conversation comments

\*\*Slug:\*\* \`ZOOM\_GET\_ZRA\_CONVERSATION\_COMMENTS\`

Tool to retrieve comments for a specific Zoom Revenue Accelerator (ZRA) conversation. Use when you need to access user comments, replies, and annotations associated with a conversation recording or transcript.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The conversation identifier for which to retrieve comments. \|
\| \`page\_size\` \| integer \| No \| Number of records to return per API call. Maximum value is 300, default is 30. \|
\| \`next\_page\_token\` \| string \| No \| Token for pagination to retrieve the next page of results. This token expires after 15 minutes. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get ZRA conversation interactions

\*\*Slug:\*\* \`ZOOM\_GET\_ZRA\_CONVERSATION\_INTERACTIONS\`

Retrieves interaction details for a specific Zoom Revenue Accelerator (ZRA) conversation. Returns interaction data including speakers, timestamps, content, and metadata for conversation analysis. Use when you need detailed interaction-level data from ZRA conversations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The conversation ID for which to retrieve interactions. This ID can be obtained from the list conversations endpoint. Note: If the conversation ID contains special characters like '+', ensure proper URL encoding. \|
\| \`page\_size\` \| integer \| No \| Number of records to return per page. Maximum 300. \|
\| \`next\_page\_token\` \| string \| No \| Token for fetching the next page of results. Obtained from the previous response's next\_page\_token field. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get ZRA conversation scorecards

\*\*Slug:\*\* \`ZOOM\_GET\_ZRA\_CONVERSATION\_SCORECARDS\`

Tool to retrieve scorecards for a specific conversation in Zoom Revenue Accelerator. Use when you need to get scorecard data and performance metrics for a particular conversation.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| Conversation ID for which to retrieve scorecards. Obtain this ID from the list\_zra\_conversations action. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get ZRA deal activities

\*\*Slug:\*\* \`ZOOM\_GET\_ZRA\_DEAL\_ACTIVITIES\`

Tool to retrieve activities associated with a Zoom Revenue Accelerator (ZRA) deal. Use when you need to list all activities for a specific deal in ZRA.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier of the deal whose activities to retrieve. \|
\| \`page\_size\` \| integer \| No \| Number of records to return per page. Default is 30, maximum is 100. \|
\| \`next\_page\_token\` \| string \| No \| Token for pagination to fetch the next page of results. Use the token returned in the previous response to get the next page. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Import whiteboard

\*\*Slug:\*\* \`ZOOM\_IMPORT\_WHITEBOARD\`

Initiates an import of a whiteboard from an external source (Miro, Mural, or Visio files). The import is processed asynchronously and returns a task\_id for tracking progress. Use this task\_id to poll for import completion and retrieve the resulting whiteboard. Use this action when you need to convert an externally created whiteboard into a Zoom whiteboard. The file must already be uploaded to Zoom before initiating the import.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| integer ("1" \| "2" \| "3") \| Yes \| The original file format of the file being imported. Use 1 for Miro boards, 2 for Microsoft Visio files, or 3 for Mural workspaces. \|
\| \`file\_id\` \| string \| Yes \| The ID of the file to convert to a whiteboard. This file must have been previously uploaded to Zoom. \|
\| \`project\_id\` \| string \| No \| The ID of the project to add the whiteboard to. The whiteboard will be organized under this project in Zoom. \|
\| \`owner\_email\` \| string \| No \| The email address of the user who should be set as the whiteboard owner. Only usable with admin-level scopes. \|
\| \`collaborators\` \| array \| No \| List of users or team chat channels to add as collaborators on the whiteboard. Each entry should contain an email address. \|
\| \`whiteboard\_name\` \| string \| No \| The name to assign to the newly created whiteboard. \|
\| \`skip\_notifications\` \| boolean \| No \| If set to true, collaborators will not receive email notifications when the whiteboard is shared with them. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List all recordings

\*\*Slug:\*\* \`ZOOM\_LIST\_ALL\_RECORDINGS\`

This text details how to list Zoom cloud recordings for a user, notably by using "me" for user-level apps and requiring an OAuth token for access. It requires a Pro plan, Cloud Recording enabled, and has a MEDIUM rate limit.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`mc\` \| string \| No \| The query metadata of the recording if using an on-premise meeting connector for the meeting. \|
\| \`to\` \| string \| No \| The end date in "yyyy-mm-dd" UTC format. Maximum date range from start is 1 month. If no value is provided, defaults to the day after the 'from' date. \|
\| \`from\` \| string \| No \| The start date in "yyyy-mm-dd" UTC format. Maximum date range is 1 month - if a larger range is requested, the API will adjust the 'from' date to be 1 month before the 'to' date. If no value is provided, defaults to current date. Note: trash files cannot be filtered by date range. \|
\| \`trash\` \| boolean \| No \| The query trash. \* \`true\` - List recordings from trash. \* \`false\` - Do not list recordings from the trash. The default value is \`false\`. If you set it to \`true\`, you can use the \`trash\_type\` property to indicate the type of Cloud recording that you need to retrieve. \|
\| \`user\_id\` \| string \| Yes \| The user's ID or email address. For user-level apps, pass the \`me\` value. Using another user's ID instead of \`me\` requires admin-level permissions. \|
\| \`page\_size\` \| integer \| No \| The number of records returned within a single API call. \|
\| \`meeting\_id\` \| string \| No \| The meeting ID as a string (e.g., "1234567890"). Zoom meeting IDs can exceed 10 digits and must be represented as strings to avoid JavaScript Number precision issues (IDs may exceed 2^53). \|
\| \`trash\_type\` \| string \| No \| The type of cloud recording to retrieve from the trash. \* \`meeting\_recordings\`: List all meeting recordings from the trash. \* \`recording\_file\`: List all individual recording files from the trash. \|
\| \`next\_page\_token\` \| string \| No \| The next page token paginates through a large set of results. A next page token returns whenever the set of available results exceeds the current page size. The expiration period for this token is 15 minutes. Loop calls until \`next\_page\_token\` is empty to retrieve all records; results are silently truncated at \`page\_size\` per call. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List archived files

\*\*Slug:\*\* \`ZOOM\_LIST\_ARCHIVED\_FILES\`

Lists archived meeting and webinar files within a specified date range (max 7 days). Requires the 'Meeting and Webinar Archiving' feature to be enabled by Zoom Support. Use this to retrieve compliance recordings archived to third-party storage platforms.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`to\` \| string \| No \| The query end date, in \`yyyy-MM-dd"T"HH:mm:ssZ\` format. This value and the \`from\` query parameter value cannot exceed seven days. \|
\| \`from\` \| string \| No \| The query start date, in \`yyyy-MM-dd"T"HH:mm:ssZ\` format. This value and the \`to\` query parameter value cannot exceed seven days. \|
\| \`group\_id\` \| string \| No \| The group ID. To get a group ID, use the \[List groups\](https://developers.zoom.us/docs/api/rest/reference/scim-api/methods/#operation/groupSCIM2List) API. \|
\| \`page\_size\` \| integer \| No \| The number of records returned within a single API call. \|
\| \`next\_page\_token\` \| string \| No \| Use the next page token to paginate through large result sets. A next page token is returned whenever the set of available results exceeds the current page size. This token's expiration period is 15 minutes. \|
\| \`query\_date\_type\` \| string ("meeting\_start\_time" \| "archive\_complete\_time") \| No \| The type of query date. \* \`meeting\_start\_time\` \* \`archive\_complete\_time\` This value defaults to \`meeting\_start\_time\`. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List devices

\*\*Slug:\*\* \`ZOOM\_LIST\_DEVICES\`

Lists devices in your Zoom account managed through Zoom Device Management (ZDM). Returns information about Zoom Room devices including computers, controllers, scheduling displays, and whiteboards. \*\*Scopes:\*\* \`device:read:admin\`, \`device:write:admin\`, \`device:read:list\_zdm\_devices:admin\` \*\*\[Rate Limit Label\](https://marketplace.zoom.us/docs/api-reference/rate-limits#rate-limits):\*\* \`HEAVY\`

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_size\` \| integer \| No \| The number of records returned within a single API call. \|
\| \`device\_type\` \| integer \| No \| Filter devices by device type. Device Type: \`-1\` - All Zoom Room devices, \`0\` - Zoom Rooms Computer, \`1\` - Zoom Rooms Controller, \`2\` - Zoom Rooms Scheduling Display, \`3\` - Zoom Rooms Control System, \`4\` - Zoom Rooms Whiteboard, \`5\` - Zoom Phone Appliance, \`6\` - Zoom Rooms Computer (with Controller). Leave empty to include all device types. \|
\| \`platform\_os\` \| string ("win" \| "mac" \| "ipad" \| "iphone" \| "android" \| "linux") \| No \| Filter devices by platform operating system. \|
\| \`search\_text\` \| string \| No \| Filter devices by name or serial number. \|
\| \`device\_model\` \| string \| No \| Filter devices by model. \|
\| \`device\_status\` \| integer \| No \| Filter devices by status. Device Status: \`0\` - offline, \`1\` - online, \`-1\` - unlinked. Leave empty to include all devices regardless of status. \|
\| \`device\_vendor\` \| string \| No \| Filter devices by vendor. \|
\| \`next\_page\_token\` \| string \| No \| Use the next page token to paginate through large result sets. A next page token is returned whenever the set of available results exceeds the current page size. This token's expiration period is 15 minutes. \|
\| \`is\_enrolled\_in\_zdm\` \| boolean \| No \| Filter devices by enrollment in Zoom Device Management (ZDM). Set to true to show only ZDM-enrolled devices, false to show only non-enrolled devices, or leave empty to include all devices. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List IQ conversations

\*\*Slug:\*\* \`ZOOM\_LIST\_IQ\_CONVERSATIONS\`

DEPRECATED: Use ZOOM\_LIST\_ZRA\_CONVERSATIONS instead (Zoom rebranded IQ to ZRA). Tool to list Zoom Revenue Accelerator (formerly Zoom IQ) conversations. Use when you need to retrieve conversation metadata including meeting and phone conversations from Zoom Revenue Accelerator.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_size\` \| integer \| No \| Number of records to return per page. Default is 30, maximum is 100. \|
\| \`next\_page\_token\` \| string \| No \| Token for pagination to fetch the next page of results. Use the token returned in the previous response to get the next page. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List IQ deals

\*\*Slug:\*\* \`ZOOM\_LIST\_IQ\_DEALS\`

DEPRECATED: Use ZOOM\_LIST\_ZRA\_DEALS instead (Zoom rebranded IQ to ZRA). Tool to list deals from Zoom Revenue Accelerator (IQ). Returns deal information including name, amount, stage, and owner details. Use when you need to retrieve CRM deal data from Zoom IQ.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_size\` \| integer \| No \| The number of records returned within a single API call. Maximum 300, default 30. \|
\| \`next\_page\_token\` \| string \| No \| Use the next page token to paginate through large result sets. A next page token is returned whenever the set of available results exceeds the current page size. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List marketplace app custom fields

\*\*Slug:\*\* \`ZOOM\_LIST\_MARKETPLACE\_APP\_CUSTOM\_FIELDS\`

Tool to retrieve custom fields configured for a Zoom Marketplace app. Use when you need to list all custom fields available for the marketplace app.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List meetings

\*\*Slug:\*\* \`ZOOM\_LIST\_MEETINGS\`

This Zoom API lists a user's scheduled meetings using the \`me\` value for user-level apps, excluding instant meetings and only showing unexpired ones. Requires specific scopes and has a \`MEDIUM\` rate limit. No server-side filtering by topic, agenda, or text fields; all such filtering must be done client-side. \`meetingId\` values exceed 32-bit integer range; treat as full-length numeric or string identifiers.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`to\` \| string \| No \| The end date. \|
\| \`from\` \| string \| No \| The start date. \|
\| \`type\` \| string ("scheduled" \| "live" \| "upcoming" \| "upcoming\_meetings" \| "previous\_meetings") \| No \| The type of meeting. \* \`scheduled\` - All valid previous (unexpired) meetings, live meetings, and upcoming scheduled meetings. \* \`live\` - All the ongoing meetings. \* \`upcoming\` - All upcoming meetings, including live meetings. \* \`upcoming\_meetings\` - All upcoming meetings, including live meetings. \* \`previous\_meetings\` - All the previous meetings. \|
\| \`user\_id\` \| string \| Yes \| The user's user ID or email address. For user-level apps, pass the \`me\` value. \|
\| \`timezone\` \| string \| No \| The timezone to assign to the \`from\` and \`to\` value. For a list of supported timezones and their formats, see our \[timezone list\](https://developers.zoom.us/docs/api/rest/other-references/abbreviation-lists/#timezones). \|
\| \`page\_size\` \| integer \| No \| The number of records returned within a single API call. \|
\| \`page\_number\` \| integer \| No \| The page number of the current page in the returned records. \|
\| \`next\_page\_token\` \| string \| No \| Use the next page token to paginate through large result sets. A next page token is returned whenever the set of available results exceeds the current page size. This token's expiration period is 15 minutes. Iterate until \`next\_page\_token\` is empty/null to avoid missing meetings. Do not introduce long delays between paginated requests as the token expires after 15 minutes. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List meeting summary templates

\*\*Slug:\*\* \`ZOOM\_LIST\_MEETING\_SUMMARY\_TEMPLATES\`

Tool to retrieve a list of meeting summary templates for a specified user. Use when you need to view available meeting summary templates or select a template for meeting summaries.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`userId\` \| string \| Yes \| The user ID or email address of the user. Use 'me' for the authenticated user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List past meeting instances

\*\*Slug:\*\* \`ZOOM\_LIST\_PAST\_MEETING\_INSTANCES\`

Tool to retrieve all UUIDs for past instances of a given meeting. Use when you need to get the list of all occurrences (instances) of a recurring meeting that have already ended. Each instance has a unique UUID that can be used to query specific details about that occurrence.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`meetingId\` \| string \| Yes \| The meeting's numeric ID (e.g. '83767991819'). This endpoint only accepts numeric meeting IDs, not UUIDs. Use the numeric meeting ID to retrieve the list of all past instance UUIDs for a recurring meeting. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List project collaborators

\*\*Slug:\*\* \`ZOOM\_LIST\_PROJECT\_COLLABORATORS\`

Lists all collaborators for a whiteboard project, including their roles and permissions. Use this action when you need to view who has access to a whiteboard project and what permission level each collaborator has. This action is read-only and does not modify any data. \*\*Note\*\*: This action requires the whiteboard project to exist and the authenticated user to have appropriate permissions (project owner, co-owner, or admin).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_size\` \| integer \| No \| Number of collaborators to return per page. Maximum: 300. \|
\| \`project\_id\` \| string \| Yes \| The unique identifier of the whiteboard project. \|
\| \`next\_page\_token\` \| string \| No \| Token to retrieve the next page of results. Use this from previous response's next\_page\_token. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List whiteboard projects

\*\*Slug:\*\* \`ZOOM\_LIST\_PROJECTS\`

Lists all whiteboard projects accessible to the user. Returns project metadata including ID, name, owner, and timestamps. Use this action when you need to retrieve whiteboard projects with optional filtering by owner or name search. Supports pagination through the next\_page\_token parameter.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| No \| The email address or user ID of the project owner. Use 'me' to refer to the current user. \|
\| \`page\_size\` \| integer \| No \| The number of records returned from a single API call. The maximum value is 50. If not specified, defaults to 10. \|
\| \`search\_key\` \| string \| No \| The name of a project to search for. This filters results to projects whose names contain the specified value. \|
\| \`next\_page\_token\` \| string \| No \| The next page token for pagination. Use this value when paginating through large result sets. The token expires after 15 minutes. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List user collaboration devices

\*\*Slug:\*\* \`ZOOM\_LIST\_USERS\_COLLABORATION\_DEVICES\`

Tool to list collaboration devices associated with a user. Use when you need to retrieve information about a user's collaboration devices. For user-level apps, pass 'me' instead of the userId parameter to get devices for the authenticated user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`userId\` \| string \| Yes \| The user ID or email address of the user. For user-level apps, pass the \`me\` value to fetch the authenticated user's collaboration devices. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get user settings

\*\*Slug:\*\* \`ZOOM\_LIST\_USERS\_SETTINGS\`

Tool to retrieve a user's settings including meeting scheduling, in-meeting features, email notifications, recording, telephony, and security preferences. Use when you need to check or display a user's Zoom configuration settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`option\` \| string ("meeting\_authentication" \| "recording\_authentication" \| "security" \| "meeting\_security" \| "schedule\_meeting" \| "in\_meeting" \| "email\_notification" \| "recording" \| "telephony" \| "feature" \| "tsp" \| "profile" \| "audio\_conferencing") \| No \| Options for filtering the response fields \|
\| \`user\_id\` \| string \| Yes \| The user ID or email address of the user. For user-level apps, pass the 'me' value to fetch the authenticated user's settings. \|
\| \`login\_type\` \| integer \| No \| The user's login method. Use this parameter to filter settings for users with a specific login type: \`0\` - Facebook OAuth, \`1\` - Google OAuth, \`24\` - Apple OAuth, \`27\` - Microsoft OAuth, \`97\` - Mobile device, \`98\` - RingCentral OAuth, \`99\` - API user, \`100\` - Zoom Work email, \`101\` - Single Sign-On (SSO). \|
\| \`custom\_query\_fields\` \| string \| No \| Comma-separated list of custom field names to include in the response. Use this to request specific custom attributes for the user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List webinar participants

\*\*Slug:\*\* \`ZOOM\_LIST\_WEBINAR\_PARTICIPANTS\`

Get a list of past webinar participants with a Pro plan or above plus an add-on. Requires specific scopes and has a medium rate limit.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_size\` \| integer \| No \| The number of records returned within a single API call. \|
\| \`webinar\_id\` \| string \| Yes \| The webinar's ID or universally unique ID (UUID). If you provide a webinar ID, the API returns a response for the latest webinar instance. \|
\| \`next\_page\_token\` \| string \| No \| Use the next page token to paginate through large result sets. A next page token is returned whenever the set of available results exceeds the current page size. This token's expiration period is 15 minutes. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List webinar registrants

\*\*Slug:\*\* \`ZOOM\_LIST\_WEBINAR\_REGISTRANTS\`

Retrieves the list of registrants for a webinar with registration enabled. This endpoint returns registrants (people who registered for the webinar), not participants (people who attended). Use this action when you need to view registrant details for CRM sync, reporting, or managing approvals for registration-based webinars. Supports filtering by occurrence, status (approved/pending/denied), and tracking source for targeted queries.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`status\` \| string ("approved" \| "pending" \| "denied") \| No \| Status filter for webinar registrants \|
\| \`page\_size\` \| integer \| No \| The number of records returned within a single API call. Maximum is 300. \|
\| \`webinar\_id\` \| string \| Yes \| The webinar's ID or universally unique ID (UUID). When storing this value in your database, store it as a long format integer. \|
\| \`occurrence\_id\` \| string \| No \| The webinar occurrence ID for which to list registrants. Use this to filter registrants for a specific occurrence of a recurring webinar. \|
\| \`next\_page\_token\` \| string \| No \| Use the next page token to paginate through large result sets. A next page token is returned whenever the set of available results exceeds the current page size. This token's expiration period is 15 minutes. \|
\| \`tracking\_source\_id\` \| string \| No \| Filter registrants by tracking source ID. Use this to get registrants attributed to a specific campaign or source. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List webinars

\*\*Slug:\*\* \`ZOOM\_LIST\_WEBINARS\`

The API lists all scheduled webinars for Zoom users with a webinar plan, using \`me\` for user-level apps. It only shows unexpired webinars for hosts broadcasting to up to 10,000 attendees. Requires Pro plan upwards and specific scopes. Rate limit: MEDIUM.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string ("scheduled" \| "upcoming") \| No \| The type of webinar. \* \`scheduled\` - All valid previous (unexpired) webinars, live webinars, and upcoming scheduled webinars. \* \`upcoming\` - All upcoming webinars, including live webinars. \|
\| \`user\_id\` \| string \| Yes \| The user's user ID or email address. For user-level apps, pass the \`me\` value. \|
\| \`page\_size\` \| integer \| No \| The number of records returned within a single API call. \|
\| \`page\_number\` \| integer \| No \| \*\*Deprecated\*\* We will no longer support this field in a future release. Instead, use the \`next\_page\_token\` for pagination. \|
\| \`next\_page\_token\` \| string \| No \| Token for fetching the next page of results. Received from the previous response's next\_page\_token field. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List whiteboards

\*\*Slug:\*\* \`ZOOM\_LIST\_WHITEBOARDS\`

Lists all whiteboards accessible to the user. Returns whiteboard metadata including ID, name, owner, and timestamps. Use this action when you need to retrieve whiteboards with optional filtering by owner, date range, project, or name search. Supports pagination through the next\_page\_token parameter.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`to\` \| string \| No \| The queried end date and time in UTC format. Use 'yyyy-MM-dd'T'HH:mm:ss'Z'' format, for example: '2024-12-31T23:59:59Z'. \|
\| \`from\` \| string \| No \| The queried start date and time in UTC format. Use 'yyyy-MM-dd'T'HH:mm:ss'Z'' format, for example: '2024-01-01T00:00:00Z'. \|
\| \`user\_id\` \| string \| No \| The email address or user ID of the whiteboard owner. Use 'me' to refer to the current user. \|
\| \`page\_size\` \| integer \| No \| The number of records returned from a single API call. The maximum value is 50. If not specified, defaults to 10. \|
\| \`project\_id\` \| string \| No \| Filter whiteboards by project ID. Only returns whiteboards that belong to the specified project. \|
\| \`search\_key\` \| string \| No \| Search for whiteboards by name. This filters results to whiteboards whose names contain the specified value. \|
\| \`next\_page\_token\` \| string \| No \| The next page token for pagination. Use this value when paginating through large result sets. The token expires after 15 minutes. \|
\| \`date\_filter\_type\` \| string ("created\_date" \| "modified\_date") \| No \| Date filter type for whiteboard listing \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List ZRA conversations

\*\*Slug:\*\* \`ZOOM\_LIST\_ZRA\_CONVERSATIONS\`

Tool to list all conversations in Zoom Revenue Accelerator. Use when you need to retrieve analytics data from Revenue Accelerator conversations, including engagement scores, sentiment analysis, and meeting metrics.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`to\` \| string \| No \| End date for filtering conversations in ISO 8601 format (e.g., '2024-01-31T23:59:59Z'). Use with 'from' parameter to define a date range. \|
\| \`from\` \| string \| No \| Start date for filtering conversations in ISO 8601 format (e.g., '2024-01-01T00:00:00Z'). Use with 'to' parameter to define a date range. \|
\| \`deal\_id\` \| string \| No \| Filter conversations by deal ID. Use this to see conversations linked to a specific deal. \|
\| \`host\_id\` \| string \| No \| Filter conversations by host ID. Use this to see only conversations hosted by a specific user. \|
\| \`team\_id\` \| string \| No \| Filter conversations by team ID. Use this to see conversations associated with a specific team. \|
\| \`page\_size\` \| integer \| No \| Number of records to return per page. Maximum 300. \|
\| \`period\_type\` \| string ("meetingStartTime" \| "iqProcessedTime") \| No \| Period type for filtering conversations \|
\| \`participant\_id\` \| string \| No \| Filter conversations by participant ID. Use this to find conversations involving a specific participant. \|
\| \`next\_page\_token\` \| string \| No \| Token for fetching the next page of results. Obtained from the previous response's next\_page\_token field. This token expires in 15 minutes. \|
\| \`conversation\_type\` \| string ("all" \| "meeting" \| "phone") \| No \| Conversation type filter \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List ZRA CRM accounts

\*\*Slug:\*\* \`ZOOM\_LIST\_ZRA\_CRM\_ACCOUNTS\`

Lists CRM accounts from Zoom Revenue Accelerator by account IDs. Use when you need to retrieve CRM account information for specific account identifiers (up to 100 IDs).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`crm\_account\_ids\` \| string \| Yes \| Comma-separated list of CRM account IDs, up to a maximum of 100 IDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List ZRA CRM contacts

\*\*Slug:\*\* \`ZOOM\_LIST\_ZRA\_CRM\_CONTACTS\`

Tool to retrieve CRM contact information from Zoom IQ Revenue Accelerator (ZRA). Use when you need to fetch detailed contact information for specific CRM contacts. Supports up to 100 contact IDs per request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`crm\_contact\_ids\` \| string \| Yes \| Comma-separated list of CRM contact IDs to retrieve. Maximum of 100 IDs per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List ZRA CRM deals

\*\*Slug:\*\* \`ZOOM\_LIST\_ZRA\_CRM\_DEALS\`

Tool to retrieve CRM deal information from Zoom Revenue Accelerator (ZRA). Use when you need to fetch detailed deal information for specific CRM deals. Supports up to 100 deal IDs per request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`crm\_deal\_ids\` \| string \| Yes \| Comma-separated list of CRM deal IDs to retrieve. Maximum of 100 IDs per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List ZRA CRM leads

\*\*Slug:\*\* \`ZOOM\_LIST\_ZRA\_CRM\_LEADS\`

Tool to retrieve CRM lead information from Zoom IQ Revenue Accelerator (ZRA). Use when you need to fetch detailed lead information for specific CRM leads. Supports up to 100 lead IDs per request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`crm\_lead\_ids\` \| string \| Yes \| Comma-separated list of CRM lead IDs to retrieve. Maximum of 100 IDs per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List ZRA CRM settings

\*\*Slug:\*\* \`ZOOM\_LIST\_ZRA\_CRM\_SETTINGS\`

Tool to retrieve the current CRM API registration information for Zoom Revenue Accelerator (ZRA). Use when you need to view the configured CRM settings including type, name, currency, deal stages, and URL patterns.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List ZRA deals

\*\*Slug:\*\* \`ZOOM\_LIST\_ZRA\_DEALS\`

Tool to list deals from Zoom Revenue Accelerator (ZRA). Returns deal information including name, amount, stage, and owner details. Use when you need to retrieve CRM deal data from Zoom ZRA.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_size\` \| integer \| No \| The number of records returned within a single API call. Maximum 300, default 30. \|
\| \`next\_page\_token\` \| string \| No \| Use the next page token to paginate through large result sets. A next page token is returned whenever the set of available results exceeds the current page size. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List ZRA scheduled items

\*\*Slug:\*\* \`ZOOM\_LIST\_ZRA\_SCHEDULED\`

Tool to list scheduled Zoom Revenue Accelerator (ZRA) items. Use when you need to retrieve scheduled ZRA-related data. Returns an empty list when no scheduled items are available for the authenticated account.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_size\` \| integer \| No \| Number of records to return per page. Use this to control pagination. \|
\| \`next\_page\_token\` \| string \| No \| Token for fetching the next page of results. Obtained from the previous response's next\_page\_token field. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List ZRA settings indicators

\*\*Slug:\*\* \`ZOOM\_LIST\_ZRA\_SETTINGS\_INDICATORS\`

Tool to retrieve account indicator settings for Zoom Revenue Accelerator (ZRA). Use when you need to view configured indicators that identify specific words, phrases, or sentences in conversations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string ("basic" \| "advanced" \| "guiding\_sentences") \| No \| Type of indicator to filter by \|
\| \`page\_size\` \| integer \| No \| Number of records to return per API call. Must be between 1 and 300 \|
\| \`category\_id\` \| string \| No \| Filter indicators by category ID to show only indicators belonging to a specific category \|
\| \`next\_page\_token\` \| string \| No \| Token for retrieving the next page of results. This token expires after 15 minutes \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List ZRA user conversation playlists

\*\*Slug:\*\* \`ZOOM\_LIST\_ZRA\_USER\_CONVERSATION\_PLAYLISTS\`

Tool to list conversation playlists for a specific user in Zoom Revenue Accelerator. Use when you need to retrieve playlists containing conversation clips for coaching or sharing purposes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The user ID to retrieve playlists for. Use 'me' to refer to the authenticated user. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Move whiteboards to project

\*\*Slug:\*\* \`ZOOM\_MOVE\_WHITEBOARDS\_TO\_PROJECT\`

Moves one or more whiteboards to a specified Zoom Whiteboard project. Use when you need to organize whiteboards by assigning them to a specific project for better management and access control. The maximum number of whiteboards that can be moved in a single request is 50.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`project\_id\` \| string \| Yes \| The Project ID. This is a path parameter identifying the target project. \|
\| \`whiteboard\_ids\` \| array \| Yes \| List of whiteboard IDs to move to the specified project. Maximum 50 whiteboards per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove whiteboard classification

\*\*Slug:\*\* \`ZOOM\_REMOVE\_WHITEBOARD\_CLASSIFICATION\`

Removes the classification label from a whiteboard. Use this action when you need to unassign or clear a security classification label from an existing whiteboard. Not supported in Gov cluster. Each whiteboard can only have one classification label at a time — calling this action removes the currently applied classification, if any. This action is reversible — you can apply a new classification label afterward using the ApplyClassificationToWhiteboard action.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`whiteboardId\` \| string \| Yes \| The whiteboard's unique identifier. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove whiteboards from project

\*\*Slug:\*\* \`ZOOM\_REMOVE\_WHITEBOARDS\_FROM\_PROJECT\`

Removes one or more whiteboards from a specified Zoom Whiteboard project. This action is irreversible — once whiteboards are removed from a project, they cannot be automatically restored to that project. Use when you need to clean up whiteboards from a project or reassign them to a different project.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`project\_id\` \| string \| Yes \| The project ID from which to remove the whiteboards. \|
\| \`whiteboard\_ids\` \| array \| Yes \| The list of whiteboard IDs to remove from the project. Maximum of 50 IDs allowed. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search company contacts

\*\*Slug:\*\* \`ZOOM\_SEARCH\_COMPANY\_CONTACTS\`

Tool to search company contacts in Zoom by first name, last name, or email. Use when you need to find specific contacts within the organization. Supports pagination for large result sets and optionally includes presence status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_size\` \| integer \| No \| The number of records to be returned with a single API call. Default value is 30, maximum is 50. \|
\| \`search\_key\` \| string \| Yes \| Provide the keyword - either first name, last name or email of the contact whom you have to search for. \|
\| \`next\_page\_token\` \| string \| No \| The next page token is used to paginate through large result sets. A next page token will be returned whenever the set of available results exceeds the current page size. The expiration period for this token is 15 minutes. \|
\| \`query\_presence\_status\` \| boolean \| No \| Set \`query\_presence\_status\` to \`true\` in order to include the presence status of a contact in the response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update a meeting

\*\*Slug:\*\* \`ZOOM\_UPDATE\_A\_MEETING\`

To update a meeting via API, ensure \`start\_time\` is future-dated; \`recurrence\` is needed. Limit: 100 requests/day, 100 updates/meeting in 24 hrs. Requires \`meeting:write\` and \`meeting:write:admin\` scopes, with a \`LIGHT\` rate limit.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| integer \| No \| Meeting types. \`1\` - Instant meeting. \`2\` - Scheduled meeting. \`3\` - Recurring meeting with no fixed time. \`8\` - Recurring meeting with a fixed time. \|
\| \`topic\` \| string \| No \| Meeting topic. \|
\| \`agenda\` \| string \| No \| Meeting description. \|
\| \`duration\` \| integer \| No \| Meeting duration in minutes. Used for scheduled meetings only. \|
\| \`password\` \| string \| No \| Meeting passcode. Passcodes may only contain these characters \[a-z A-Z 0-9 @ - \_ \*\] and can have a maximum of 10 characters. \*\*Note\*\* If the account owner or the admin has configured \[minimum passcode requirement settings\](https://support.zoom.us/hc/en-us/articles/360033559832-Meeting-and-webinar-passwords#h\_a427384b-e383-4f80-864d-794bf0a37604), the passcode value provided here must meet those requirements. If the requirements are enabled, view those requirements by calling either the \[\*\*Get user settings\*\*\](https://developers.zoom.us) API or the \[\*\*Get account settings\*\*\](https://developers.zoom.us) API. \|
\| \`timezone\` \| string \| No \| The timezone to assign to the \`start\_time\` value. Only use this field ifor scheduled or recurring meetings with a fixed time. For a list of supported timezones and their formats, see our \[timezone list\](https://developers.zoom.us/docs/api/rest/other-references/abbreviation-lists/#timezones). \|
\| \`meeting\_id\` \| string \| Yes \| The meeting's ID as a string (e.g., "1234567890"). Zoom meeting IDs can be greater than 10 digits and must be represented as strings to avoid JavaScript Number precision issues (IDs may exceed 2^53). \|
\| \`start\_time\` \| string \| No \| Meeting start time. When using a format like \`yyyy-MM-dd"T"HH:mm:ss"Z"\`, always use GMT time. When using a format like \`yyyy-MM-dd"T"HH:mm:ss\`, use local time and specify the time zone. Only used for scheduled meetings and recurring meetings with a fixed time. \|
\| \`template\_id\` \| string \| No \| Unique identifier of the meeting template. \[Schedule the meeting from a meeting template\](https://support.zoom.us/hc/en-us/articles/360036559151-Meeting-templates#h\_86f06cff-0852-4998-81c5-c83663c176fb). Retrieve this field's value by calling the \[List meeting templates\](https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/listMeetingTemplates) API. \|
\| \`pre\_schedule\` \| boolean \| No \| Whether to create a prescheduled meeting through the \[GSuite app\](https://support.zoom.us/hc/en-us/articles/360020187492-Zoom-for-GSuite-add-on). This \*\*only\*\* supports the meeting \`type\` value of \`2\` - scheduled meetings- and \`3\` - recurring meetings with no fixed time. \* \`true\` - Create a prescheduled meeting. \* \`false\` - Create a regular meeting. \|
\| \`schedule\_for\` \| string \| No \| The email address or \`userId\` of the user to schedule a meeting for. \|
\| \`occurrence\_id\` \| string \| No \| Meeting occurrence ID. Support change of agenda, \`start\_time\`, duration, or settings {\`host\_video\`, \`participant\_video\`, \`join\_before\_host\`, \`mute\_upon\_entry\`, \`waiting\_room\`, \`watermark\`, \`auto\_recording\`}. Omitting this field applies changes to the entire recurring series. \|
\| \`settings\_\_audio\` \| string ("both" \| "telephony" \| "voip" \| "thirdParty") \| No \| Determine how participants can join the audio portion of the meeting. \`both\` - Both Telephony and VoIP. \`telephony\` - Telephony only. \`voip\` - VoIP only. \`thirdParty\` - Third party audio conference. \|
\| \`tracking\_fields\` \| array \| No \| Tracking fields. \|
\| \`recurrence\_\_type\` \| integer \| No \| Recurrence meeting types. \*\*Required when meeting type is 3 (recurring with no fixed time) or 8 (recurring with fixed time).\*\* \`1\` - Daily. \`2\` - Weekly. \`3\` - Monthly. \|
\| \`settings\_\_use\_\_pmi\` \| boolean \| No \| Use a \[personal meeting ID (PMI)\](https://developers.zoom.us/docs/api/rest/using-zoom-apis/#understanding-personal-meeting-id-pmi). Only used for scheduled meetings and recurring meetings with no fixed time. \|
\| \`settings\_\_jbh\_\_time\` \| integer \| No \| If the value of \`join\_before\_host\` field is set to true, use this field to indicate time limits for a participant to join a meeting before a host. \* \`0\` - Allow participant to join anytime. \* \`5\` - Allow participant to join 5 minutes before meeting start time. \* \`10\` - Allow participant to join 10 minutes before meeting start time. \|
\| \`settings\_\_resources\` \| array \| No \| The meeting's resources. Each resource must include resource\_id and resource\_type fields. \|
\| \`settings\_\_watermark\` \| boolean \| No \| Add a watermark when viewing a shared screen. \|
\| \`settings\_\_cn\_\_meeting\` \| boolean \| No \| Host the meeting in China. \|
\| \`settings\_\_focus\_\_mode\` \| boolean \| No \| Whether the \[\*\*Focus Mode\*\* feature\](https://support.zoom.us/hc/en-us/articles/360061113751-Using-focus-mode) is enabled when the meeting starts. \|
\| \`settings\_\_host\_\_video\` \| boolean \| No \| Start video when the host joins the meeting. \|
\| \`settings\_\_in\_\_meeting\` \| boolean \| No \| Host meeting in India. \|
\| \`recurrence\_\_end\_\_times\` \| integer \| No \| Select how many times the meeting should recur before it is canceled. If \`end\_times\` is set to 0, it means there is no end time. The maximum number of recurrences is 60. Cannot be used with \`end\_date\_time\`. \|
\| \`settings\_\_custom\_\_keys\` \| array \| No \| Custom keys and values assigned to the meeting. \|
\| \`settings\_\_contact\_\_name\` \| string \| No \| Contact name for registration. \|
\| \`settings\_\_waiting\_\_room\` \| boolean \| No \| Enable waiting room. \|
\| \`recurrence\_\_monthly\_\_day\` \| integer \| No \| Use this field \*\*only if you're scheduling a recurring meeting of type\*\* \`3\` to state the day in a month when the meeting should recur. The value range is from 1 to 31. For instance, if the meeting should recur on 23rd of each month, provide \`23\` as this field's value and \`1\` as the \`repeat\_interval\` field's value. If the meeting should recur every three months on 23rd of the month, change the \`repeat\_interval\` field's value to \`3\`. \|
\| \`recurrence\_\_weekly\_\_days\` \| string ("1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7") \| No \| This field is required if you're scheduling a recurring meeting of type \`2\`, to state which days of the week the meeting should repeat. The value must be a single number between \`1\` to \`7\` in string format. For instance, if the meeting should recur on Sunday, provide \`1\` as this field's value. To set the meeting to occur on multiple days, you must call the API multiple times or use a different recurrence pattern. \`1\` - Sunday. \`2\` - Monday. \`3\` - Tuesday. \`4\` - Wednesday. \`5\` - Thursday. \`6\` - Friday. \`7\` - Saturday. \|
\| \`settings\_\_approval\_\_type\` \| integer \| No \| Enable registration and set approval for the registration. Note that this feature requires the host to be of \*\*Licensed\*\* user type. \*\*Registration cannot be enabled for a basic user.\*\* \`0\` - Automatically approve. \`1\` - Manually approve. \`2\` - No registration required. \|
\| \`settings\_\_calendar\_\_type\` \| integer \| No \| The type of calendar integration used to schedule the meeting. \* \`1\` - \[Zoom Outlook add-in\](https://support.zoom.us/hc/en-us/articles/360031592971-Getting-started-with-Outlook-plugin-and-add-in) \* \`2\` - \[Zoom for Google Workspace add-on\](https://support.zoom.us/hc/en-us/articles/360020187492-Using-the-Zoom-for-Google-Workspace-add-on) Works with the \`private\_meeting\` field to determine whether to share details of meetings. \|
\| \`settings\_\_contact\_\_email\` \| string \| No \| Contact email for registration. \|
\| \`settings\_\_enforce\_\_login\` \| boolean \| No \| Only signed in users can join this meeting. \*\*This field is deprecated and will not be supported in the future.\*\* As an alternative, use the \`meeting\_authentication\`, \`authentication\_option\`, and \`authentication\_domains\` fields to understand the \[authentication configurations\](https://support.zoom.us/hc/en-us/articles/360037117472-Authentication-Profiles-for-Meetings-and-Webinars) set for the meeting. \|
\| \`recurrence\_\_monthly\_\_week\` \| integer \| No \| Use this field \*\*only if you're scheduling a recurring meeting of type\*\* \`3\` to state the week of the month when the meeting should recur. If you use this field, you must also use the \`monthly\_week\_day\` field to state the day of the week when the meeting should recur. \`-1\` - Last week of the month. \`1\` - First week of the month. \`2\` - Second week of the month. \`3\` - Third week of the month. \`4\` - Fourth week of the month. \|
\| \`settings\_\_auto\_\_recording\` \| string ("local" \| "cloud" \| "none") \| No \| Automatic recording. \`local\` - Record on local. \`cloud\` - Record on cloud. \`none\` - Disabled. \|
\| \`settings\_\_encryption\_\_type\` \| string ("enhanced\_encryption" \| "e2ee") \| No \| Choose between enhanced encryption and \[end-to-end encryption\](https://support.zoom.us/hc/en-us/articles/360048660871) when starting or a meeting. When using end-to-end encryption, several features such cloud recording and phone/SIP/H.323 dial-in, will be \*\*automatically disabled\*\*. \`enhanced\_encryption\` - Enhanced encryption. Encryption is stored in the cloud if you enable this option. \`e2ee\` - \[End-to-end encryption\](https://support.zoom.us/hc/en-us/articles/360048660871). The encryption key is stored in your local device and can not be obtained by anyone else. Enabling this setting also \*\*disables\*\* the features join before host, cloud recording, streaming, live transcription, breakout rooms, polling, 1:1 private chat, and meeting reactions. \|
\| \`settings\_\_private\_\_meeting\` \| boolean \| No \| Whether the meeting is set as private. \|
\| \`recurrence\_\_end\_\_date\_\_time\` \| string \| No \| Select the final date when the meeting recurs before it is canceled. Should be in UTC time, such as 2017-11-25T12:00:00Z. Cannot be used with \`end\_times\`. \|
\| \`settings\_\_internal\_\_meeting\` \| boolean \| No \| Whether to set the meeting as an internal meeting. \|
\| \`settings\_\_meeting\_\_invitees\` \| array \| No \| A list of the meeting's invitees. \|
\| \`settings\_\_mute\_\_upon\_\_entry\` \| boolean \| No \| Mute participants upon entry. \|
\| \`recurrence\_\_repeat\_\_interval\` \| integer \| No \| Define the interval when the meeting should recur. For instance, to schedule a meeting that recurs every two months, set this field's value as \`2\` and the \`type\` parameter's value to \`3\`. For a daily meeting, the maximum interval is \`90\` days. For a weekly meeting, the maximum interval is \`12\` weeks. For a monthly meeting, the maximum value is \`3\` months. \|
\| \`settings\_\_alternative\_\_hosts\` \| string \| No \| A semicolon-separated list of the meeting's alternative hosts" email addresses or IDs. \|
\| \`settings\_\_join\_\_before\_\_host\` \| boolean \| No \| Allow participants to join the meeting before the host starts the meeting. Only used for scheduled or recurring meetings. \|
\| \`settings\_\_participant\_\_video\` \| boolean \| No \| Start video when participants join the meeting. \|
\| \`settings\_\_registration\_\_type\` \| integer \| No \| Registration type. Used for recurring meeting with fixed time only. \`1\` - Attendees register once and can attend any of the occurrences. \`2\` - Attendees need to register for each occurrence to attend. \`3\` - Attendees register once and can choose one or more occurrences to attend. \|
\| \`settings\_\_close\_\_registration\` \| boolean \| No \| Close registration after the event date. \|
\| \`settings\_\_email\_\_notification\` \| boolean \| No \| Whether to send email notifications to \[alternative hosts\](https://support.zoom.us/hc/en-us/articles/208220166) and \[users with scheduling privileges\](https://support.zoom.us/hc/en-us/articles/201362803-Scheduling-privilege). This value defaults to \`true\`. \|
\| \`settings\_\_show\_\_share\_\_button\` \| boolean \| No \| Show social share buttons on the meeting registration page. This setting only works for meetings that require \[registration\](https://support.zoom.us/hc/en-us/articles/211579443-Setting-up-registration-for-a-meeting). \|
\| \`recurrence\_\_monthly\_\_week\_\_day\` \| integer \| No \| Use this field only if you"re scheduling a recurring meeting of type \`3\` to state a specific day in a week when a monthly meeting should recur. To use this field, you must also use the \`monthly\_week\` field. \`1\` - Sunday. \`2\` - Monday. \`3\` - Tuesday. \`4\` - Wednesday. \`5\` - Thursday. \`6\` - Friday. \`7\` - Saturday. \|
\| \`settings\_\_authentication\_\_name\` \| string \| No \| Authentication name set in the \[authentication profile\](https://support.zoom.us/hc/en-us/articles/360037117472-Authentication-Profiles-for-Meetings-and-Webinars#h\_5c0df2e1-cfd2-469f-bb4a-c77d7c0cca6f). \|
\| \`settings\_\_breakout\_\_room\_\_rooms\` \| array \| No \| Create room(s). \|
\| \`settings\_\_authentication\_\_option\` \| string \| No \| Meeting authentication option ID. \|
\| \`settings\_\_breakout\_\_room\_\_enable\` \| boolean \| No \| Set this field's value to \`true\` to enable the \[breakout room pre-assign\](https://support.zoom.us/hc/en-us/articles/360032752671-Pre-assigning-participants-to-breakout-rooms#h\_36f71353-4190-48a2-b999-ca129861c1f4) option. \|
\| \`settings\_\_audio\_\_conference\_\_info\` \| string \| No \| Third party audio conference info. \|
\| \`settings\_\_authentication\_\_domains\` \| string \| No \| If user has configured \[Sign Into Zoom with Specified Domains\](https://support.zoom.us/hc/en-us/articles/360037117472-Authentication-Profiles-for-Meetings-and-Webinars#h\_5c0df2e1-cfd2-469f-bb4a-c77d7c0cca6f) option, this will list the domains that are authenticated. \|
\| \`settings\_\_enforce\_\_login\_\_domains\` \| string \| No \| Only signed in users with specified domains can join meetings. \*\*This field is deprecated and will not be supported in the future.\*\* As an alternative, use the \`meeting\_authentication\`, \`authentication\_option\`. and \`authentication\_domains\` fields to understand the \[authentication configurations\](https://support.zoom.us/hc/en-us/articles/360037117472-Authentication-Profiles-for-Meetings-and-Webinars) set for the meeting. \|
\| \`settings\_\_meeting\_\_authentication\` \| boolean \| No \| \`true\`- Only authenticated users can join meetings. \|
\| \`settings\_\_allow\_\_multiple\_\_devices\` \| boolean \| No \| Allow attendees to join the meeting from multiple devices. This setting only works for meetings that require \[registration\](https://support.zoom.us/hc/en-us/articles/211579443-Setting-up-registration-for-a-meeting). \|
\| \`settings\_\_host\_\_save\_\_video\_\_order\` \| boolean \| No \| Whether the \*\*Allow host to save video order\*\* feature is enabled. \|
\| \`settings\_\_authentication\_\_exception\` \| array \| No \| The participants added here will receive unique meeting invite links and bypass authentication. Each exception must include name and email fields. \|
\| \`settings\_\_global\_\_dial\_\_in\_\_numbers\` \| array \| No \| Global dial-in countries or regions \|
\| \`settings\_\_global\_\_dial\_\_in\_\_countries\` \| array \| No \| List of global dial-in countries \|
\| \`settings\_\_auto\_\_start\_\_meeting\_\_summary\` \| boolean \| No \| Whether to automatically start meeting summary. \|
\| \`settings\_\_participant\_\_focused\_\_meeting\` \| boolean \| No \| Whether to set the meeting as a participant focused meeting. \|
\| \`settings\_\_alternative\_\_host\_\_update\_\_polls\` \| boolean \| No \| Whether the \*\*Allow alternative hosts to add or edit polls\*\* feature is enabled. This requires Zoom version 5.8.0 or higher. \|
\| \`settings\_\_language\_\_interpretation\_\_enable\` \| boolean \| No \| Whether to enable \[language interpretation\](https://support.zoom.us/hc/en-us/articles/360034919791-Language-interpretation-in-meetings-and-webinars) for the meeting. \|
\| \`settings\_\_registrants\_\_confirmation\_\_email\` \| boolean \| No \| Whether to send registrants an email confirmation. \* \`true\` - Send a confirmation email. \* \`false\` - Do not send a confirmation email. \|
\| \`settings\_\_registrants\_\_email\_\_notification\` \| boolean \| No \| Whether to send registrants email notifications about their registration approval, cancellation, or rejection. \* \`true\` - Send an email notification. \* \`false\` - Do not send an email notification. Set this value to \`true\` to also use the \`registrants\_confirmation\_email\` parameter. \|
\| \`settings\_\_continuous\_\_meeting\_\_chat\_\_enable\` \| boolean \| No \| Whether to enable the \*\*Enable continuous meeting chat\*\* setting. \|
\| \`settings\_\_approved\_denied\_regions\_\_denied\_\_list\` \| array \| No \| List of countries or regions from where participants can not join this meeting. \|
\| \`settings\_\_auto\_\_start\_\_ai\_\_companion\_\_questions\` \| boolean \| No \| Whether to automatically start AI Companion questions. \|
\| \`settings\_\_language\_\_interpretation\_\_interpreters\` \| array \| No \| Information about the meeting's language interpreters. Each interpreter must include email and languages fields. \|
\| \`settings\_\_sign\_\_language\_\_interpretation\_\_enable\` \| boolean \| No \| Whether to enable \[sign language interpretation\](https://support.zoom.us/hc/en-us/articles/9644962487309-Using-sign-language-interpretation-in-a-meeting-or-webinar) for the meeting. \|
\| \`settings\_\_alternative\_\_hosts\_\_email\_\_notification\` \| boolean \| No \| Flag to determine whether to send email notifications to alternative hosts, default value is true. \|
\| \`settings\_\_approved\_denied\_regions\_\_approved\_\_list\` \| array \| No \| List of countries or regions from where participants can join this meeting. \|
\| \`settings\_\_meeting\_\_chat\_\_auto\_\_add\_\_external\_\_users\` \| boolean \| No \| Whether to enable the \*\*Automatically add invited external users\*\* setting. \|
\| \`settings\_\_sign\_\_language\_\_interpretation\_\_interpreters\` \| array \| No \| Information about the meeting's sign language interpreters. Each interpreter must include email and sign\_language fields. \|
\| \`settings\_\_approved\_\_or\_\_denied\_\_countries\_\_or\_\_regions\_\_enable\` \| boolean \| No \| \`true\` - Setting enabled to either allow users or block users from specific regions to join your meetings. \`false\` - Setting disabled. \|
\| \`settings\_\_approved\_\_or\_\_denied\_\_countries\_\_or\_\_regions\_\_method\` \| string ("approve" \| "deny") \| No \| Specify whether to allow users from specific regions to join this meeting, or block users from specific regions from joining this meeting. \`approve\` - Allow users from specific regions or countries to join this meeting. If this setting is selected, include the approved regions or countries in the \`approved\_list\`. \`deny\` - Block users from specific regions or countries from joining this meeting. If this setting is selected, include the approved regions or countries in the \`denied\_list\` \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update classification label

\*\*Slug:\*\* \`ZOOM\_UPDATE\_CLASSIFICATION\_LABEL\`

Updates an existing classification label in Zoom Whiteboard. Use this action when you need to modify the name, color, sensitivity level, description, guideline URL, or default status of an existing classification label. Only the fields provided in the request body will be updated. Changes are saved as a draft and may need to be published separately. Use this action when you need to rename a classification label to better reflect its purpose, update the color coding for visibility, adjust sensitivity levels to match your organization's security policies, or change which label is set as the default for new whiteboards. Note: This action modifies existing data but is not destructive — the classification label and all associated whiteboards remain intact even after updates.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| The display name of the classification label. The name must be between 1 and 30 characters. \|
\| \`color\` \| string \| No \| The hex color code for the label. Must be in the format: # followed by 6 hexadecimal characters (e.g., #FF5733). \|
\| \`is\_default\` \| boolean \| No \| Whether this label should be automatically applied to new whiteboards. Only one label can be the default. If setting this to true, ensure no other label is currently set as default. \|
\| \`description\` \| string \| No \| A description of what this classification label represents. The description can have a maximum of 1000 characters. \|
\| \`guideline\_url\` \| string \| No \| An HTTPS URL linking to classification guidelines or policies. The URL must be a valid HTTPS URL with a maximum of 512 characters. \|
\| \`classification\_id\` \| string \| Yes \| The unique identifier of the classification label to update. This ID is returned when you create or list classification labels. \|
\| \`sensitivity\_level\` \| integer \| No \| The sensitivity rank of the label. This value must be between 1 and 5, where higher values indicate higher sensitivity. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update IQ conversation comment

\*\*Slug:\*\* \`ZOOM\_UPDATE\_IQ\_CONVERSATION\_COMMENT\`

DEPRECATED: Use ZOOM\_UPDATE\_ZRA\_CONVERSATION\_COMMENT instead (Zoom rebranded IQ to ZRA). Tool to update a comment in a Zoom IQ conversation. Use when you need to modify an existing comment's text, mentions, or recording timestamp.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`comment\` \| string \| No \| The updated text content of the comment. \|
\| \`comment\_id\` \| string \| Yes \| The comment's unique identifier within that conversation. \|
\| \`conversation\_id\` \| string \| Yes \| The conversation's unique identifier. \|
\| \`mention\_team\_ids\` \| array \| No \| List of team IDs mentioned in the comment. \|
\| \`mention\_user\_ids\` \| array \| No \| List of user IDs mentioned in the comment. \|
\| \`time\_in\_recording\` \| string \| No \| The time in the recording where the comment should be anchored. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update IQ conversation host

\*\*Slug:\*\* \`ZOOM\_UPDATE\_IQ\_CONVERSATION\_HOST\`

DEPRECATED: Use ZOOM\_UPDATE\_ZRA\_CONVERSATION\_HOST instead (Zoom rebranded IQ to ZRA). Tool to update the host of a Zoom IQ (Revenue Accelerator) conversation. Use when you need to transfer conversation ownership to a different user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The conversation's unique identifier. \|
\| \`host\_id\` \| string \| Yes \| The email address or user ID of the new host for the conversation. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update a whiteboard project

\*\*Slug:\*\* \`ZOOM\_UPDATE\_PROJECT\`

Updates the name of an existing whiteboard project in Zoom. This action allows you to rename a project to better reflect its content or purpose. The project\_id is required to identify which project to update. This action is commonly used when reorganizing whiteboard content or updating project names to reflect new themes. Use this action when you need to rename a whiteboard project to better organize your Zoom whiteboards, update project names to reflect new topics or purposes, or batch-rename projects as part of a larger content management workflow. Note: This action modifies existing data but is not destructive — the project and all its associated whiteboards remain intact even after a name change.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`project\_id\` \| string \| Yes \| The unique identifier of the whiteboard project you want to update. This ID is returned when you create or list projects. \|
\| \`project\_name\` \| string \| No \| The new name for the whiteboard project. The name must be between 1 and 50 characters. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update project collaborators

\*\*Slug:\*\* \`ZOOM\_UPDATE\_PROJECT\_COLLABORATORS\`

Updates collaborator permissions for a whiteboard project. Use this action when you need to change the permission level of one or more collaborators on a whiteboard project. This allows reassigning roles such as changing a viewer to an editor or promoting a collaborator to owner status. \*\*Prerequisites:\*\* - The user must be the project owner or have admin permissions - The whiteboard project must exist and be accessible \*\*Required fields:\*\* project\_id, collaborators (list with collaborator\_id and role for each) \*\*Common errors:\*\* - "User not found" - The collaborator ID does not match a Zoom user - "Project not found" - Invalid project ID - "Invalid collaborator role" - Role value must be 0, 1, 2, 3, or 4

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`project\_id\` \| string \| Yes \| The unique identifier of the whiteboard project. \|
\| \`collaborators\` \| array \| Yes \| List of collaborators to update with their new roles. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update whiteboard collaborator

\*\*Slug:\*\* \`ZOOM\_UPDATE\_WHITEBOARD\_COLLABORATOR\`

Updates collaborator settings for a whiteboard. Changes the permission role for one or more collaborators on the whiteboard. Use this action when you need to modify what access levels collaborators have, such as promoting a viewer to editor or demoting an owner to co-owner. Note: When assigning a new Owner or Co-owner, the user must belong to the same account as the original Owner. If ownership is transferred, the original owner automatically becomes a Co-owner. This action is irreversible once the role changes are saved.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`whiteboardId\` \| string \| Yes \| The unique identifier of the whiteboard. This is the unique identifier assigned to the whiteboard when it was created. \|
\| \`collaborators\` \| array \| Yes \| List of collaborators to update. Each collaborator must have a collaborator\_id and a role. Minimum 1 collaborator, maximum 100 collaborators per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update whiteboard share settings

\*\*Slug:\*\* \`ZOOM\_UPDATE\_WHITEBOARD\_SHARE\_SETTINGS\`

Updates the sharing settings for a whiteboard, controlling who can access and edit the whiteboard. Use this action when you need to change the share permissions, visibility scope, or access role for a specific whiteboard. The API returns HTTP 204 No Content on success.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`whiteboard\_id\` \| string \| Yes \| The ID of the whiteboard. This is the unique identifier assigned to the whiteboard when it was created. \|
\| \`share\_link\_setting\` \| object \| No \| Share link settings for the whiteboard. \|
\| \`advanced\_share\_setting\` \| object \| No \| Advanced share settings for the whiteboard. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update ZRA conversation comment

\*\*Slug:\*\* \`ZOOM\_UPDATE\_ZRA\_CONVERSATION\_COMMENT\`

Tool to update a comment in a Zoom Revenue Accelerator conversation. Use when you need to modify the text, mentions, or timestamp of an existing comment.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`comment\` \| string \| No \| The updated comment text. Provide this to change the comment content. \|
\| \`comment\_id\` \| string \| Yes \| The ID of the comment to update within the conversation. \|
\| \`conversation\_id\` \| string \| Yes \| The ID of the Zoom Revenue Accelerator conversation containing the comment to update. \|
\| \`mention\_team\_ids\` \| array \| No \| List of team IDs to mention in the updated comment. \|
\| \`mention\_user\_ids\` \| array \| No \| List of user IDs to mention in the updated comment. \|
\| \`time\_in\_recording\` \| string \| No \| The timestamp in the recording to associate with this comment (format: HH:MM:SS). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update ZRA conversation host

\*\*Slug:\*\* \`ZOOM\_UPDATE\_ZRA\_CONVERSATION\_HOST\`

Tool to update the host of a Zoom Revenue Accelerator (ZRA) conversation. Use when you need to transfer conversation ownership to a different user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The conversation's unique identifier. \|
\| \`host\_id\` \| string \| Yes \| The email address or user ID of the new host for the conversation. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Upload Whiteboard File

\*\*Slug:\*\* \`ZOOM\_UPLOAD\_WHITEBOARD\_FILE\`

Uploads a file to be used in Zoom Whiteboard. Supports PDF and Visio (.vsdx) file formats. Use when you need to import external documents into Zoom Whiteboard for collaboration and editing. The file upload uses a separate file API endpoint (fileapi.zoom.us).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`file\` \| object \| Yes \| The file to upload to the whiteboard. Supported formats: .pdf, .vsdx (Visio). The file name should match the whiteboard file filename (for example, 'document.pdf' or 'diagram.vsdx'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Validate marketplace app manifest

\*\*Slug:\*\* \`ZOOM\_VALIDATE\_MARKETPLACE\_APP\_MANIFEST\`

Tool to validate a Zoom Marketplace app manifest before submission or update. Use when you need to verify that an app manifest configuration is valid and meets Zoom's requirements.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`app\_id\` \| string \| No \| Optional app ID to validate the manifest against an existing marketplace app. If provided, validates compatibility with the specified app. \|
\| \`manifest\` \| object \| Yes \| The complete app manifest object to validate. Must include display\_information, oauth\_information, and features sections. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\## Triggers

\### Daily Usage Report Changed

\*\*Slug:\*\* \`ZOOM\_DAILY\_USAGE\_REPORT\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when the Zoom daily usage report changes for a selected year/month.
This trigger monitors daily usage statistics including:
\- New users added
\- Number of meetings held
\- Participant counts
\- Meeting minutes consumed

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`group\_id\` \| string \| No \| Optional group ID to filter results. When specified, only includes users who are members of the queried group. Use the List groups API to retrieve group IDs. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`month\` \| integer \| No \| Month for the report (1-12). If not provided, defaults to the current month. \|
\| \`year\` \| integer \| No \| Year for the report. If not provided, defaults to the current year. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`changed\_dates\` \| array \| No \| List of dates that had changes in their statistics \|
\| \`event\_type\` \| string \| No \| Type of change detected (report\_updated) \|
\| \`report\` \| object \| Yes \| Current state of the daily usage report \|

\### Meeting Details Changed

\*\*Slug:\*\* \`ZOOM\_MEETING\_DETAILS\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a specific meeting's details change.
Detects changes such as:
\- Meeting topic changes
\- Agenda updates
\- Schedule changes (timezone, duration)
\- Settings modifications (waiting room, recording, video, etc.)
\- Password changes
\- Recurrence pattern updates

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`meeting\_id\` \| integer \| Yes \| The meeting ID to monitor for details changes. Use the numeric meeting ID from your Zoom meeting. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`changed\_fields\` \| array \| No \| List of field names that changed \|
\| \`event\_type\` \| string \| Yes \| Type of change detected (meeting\_updated, settings\_changed) \|
\| \`meeting\_details\` \| object \| Yes \| Current state of the meeting details \|

\### Meeting Recording Changed

\*\*Slug:\*\* \`ZOOM\_MEETING\_RECORDING\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a specific meeting's cloud recordings change.
Detects changes such as:
\- New recording files appearing
\- Recording processing completion (status changes)
\- Recording metadata changes (count, size, etc.)
\- New participant audio files

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`include\_download\_token\` \| boolean \| No \| Whether to include download access token in the response. Set to True if you need to download recordings. \|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`meeting\_id\` \| string \| Yes \| The meeting ID or UUID to monitor for recording changes. Use the meeting ID for the latest instance or UUID for a specific instance. \|
\| \`token\_ttl\` \| integer \| No \| Time to live (in seconds) for the download access token. Only used when include\_download\_token is True. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`changes\_detected\` \| object \| No \| Dictionary describing what changed (e.g., new files, status changes, metadata updates) \|
\| \`event\_type\` \| string \| Yes \| Type of change detected (recording\_added, recording\_updated, recording\_processing\_completed) \|
\| \`meeting\_recording\` \| object \| Yes \| Current state of the meeting recording \|

\### Meeting Summary Created or Updated

\*\*Slug:\*\* \`ZOOM\_MEETING\_SUMMARY\_UPDATED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a meeting summary is created or updated for a specific meeting.

IMPORTANT: This trigger requires a PAID Zoom account (Pro, Business, or Enterprise plan).
Free Zoom accounts cannot use this feature.

Additionally requires:
\- AI Companion feature enabled in account settings
\- Meeting must not be end-to-end encrypted (E2EE)
\- Meeting summary must be enabled and generated for the meeting

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`meeting\_id\` \| string \| Yes \| The unique ID of the meeting to monitor for summary changes. This is the meeting UUID or meeting ID from your Zoom account. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`changed\_fields\` \| array \| No \| List of fields that changed (for updates) \|
\| \`event\_type\` \| string \| Yes \| Type of event that occurred (created/updated) \|
\| \`summary\` \| object \| Yes \| The meeting summary that was created or updated \|

\### New Cloud Recording

\*\*Slug:\*\* \`ZOOM\_NEW\_CLOUD\_RECORDING\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new cloud recording meeting instance appears for a user.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`page\_size\` \| integer \| No \| Number of recordings to fetch per page (1-300) \|
\| \`user\_id\` \| string \| No \| The user's ID or email address. Use 'me' for the authenticated user. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| No \| Type of event \|
\| \`meeting\` \| object \| Yes \| The meeting with new cloud recording \|

\### New Meeting Created

\*\*Slug:\*\* \`ZOOM\_NEW\_MEETING\_CREATED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new Zoom meeting is created for a user.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`meeting\_type\` \| string \| No \| Type of meetings to monitor: 'scheduled', 'live', 'upcoming', 'upcoming\_meetings', or 'previous\_meetings' \|
\| \`page\_size\` \| integer \| No \| Number of meetings to fetch per page (1-300) \|
\| \`user\_id\` \| string \| No \| The user's ID or email address. Use 'me' for the authenticated user. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| No \| Type of event that occurred \|
\| \`meeting\` \| object \| Yes \| The newly created meeting \|

\### New Meeting Participant

\*\*Slug:\*\* \`ZOOM\_NEW\_MEETING\_PARTICIPANT\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new participant appears in a past meeting's participant report.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`meeting\_id\` \| string \| Yes \| The meeting's ID or universally unique ID (UUID). If you provide a meeting ID, the API returns a response for the latest meeting instance. If you provide a meeting UUID that begins with a \`/\` character or contains the \`//\` characters, you must double encode the meeting UUID before making an API request. \|
\| \`page\_size\` \| integer \| No \| The number of participants to fetch per API call (max 300). \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`customer\_key\` \| string \| No \| The customer key associated with the participant. \|
\| \`duration\` \| integer \| No \| Duration the participant was in the meeting, in seconds. \|
\| \`failover\` \| boolean \| No \| Whether failover occurred during the meeting for this participant. \|
\| \`id\` \| string \| No \| Unique identifier for the participant in UUID format. \|
\| \`join\_time\` \| string \| No \| The date and time when the participant joined the meeting (ISO 8601 format). \|
\| \`leave\_time\` \| string \| No \| The date and time when the participant left the meeting (ISO 8601 format). \|
\| \`name\` \| string \| No \| Participant's display name shown during the meeting. \|
\| \`registrant\_id\` \| string \| No \| The participant's unique registrant ID if they registered for the meeting. \|
\| \`status\` \| string \| No \| The participant's attendance status: 'in\_meeting' or 'in\_waiting\_room'. \|
\| \`user\_email\` \| string \| No \| The participant's email address. May be empty for external attendees. \|
\| \`user\_id\` \| string \| No \| The participant's Zoom user ID. Empty for external participants not in your account. \|

\### New Webinar Created

\*\*Slug:\*\* \`ZOOM\_NEW\_WEBINAR\_CREATED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new webinar is created for a user.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`page\_size\` \| integer \| No \| The number of webinars to fetch per API call (1-300). \|
\| \`user\_id\` \| string \| No \| The user's user ID or email address. Use 'me' for user-level apps to monitor your own webinars. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`agenda\` \| string \| No \| Agenda or description of the webinar. \|
\| \`created\_at\` \| string \| No \| Timestamp when the webinar was created in date-time format (ISO 8601). \|
\| \`duration\` \| integer \| No \| Duration of the webinar in minutes. \|
\| \`host\_id\` \| string \| No \| User ID of the webinar host. \|
\| \`id\` \| integer \| No \| Webinar ID, also known as the webinar number. \|
\| \`join\_url\` \| string \| No \| URL for participants to join the webinar. \|
\| \`occurrences\` \| array \| No \| Array of occurrence objects for recurring webinars. \|
\| \`settings\` \| object \| No \| Webinar settings object containing various configuration options. \|
\| \`start\_time\` \| string \| No \| Scheduled start time of the webinar in date-time format (ISO 8601). \|
\| \`start\_url\` \| string \| No \| URL for the host to start the webinar. Expiration time is two hours for regular users and 90 days for API users. \|
\| \`timezone\` \| string \| No \| Timezone in which the webinar is scheduled. \|
\| \`topic\` \| string \| No \| Topic or title of the webinar. \|
\| \`type\` \| integer \| No \| Webinar type. Values: 5 (Webinar), 6 (Recurring webinar with no fixed time), 9 (Recurring webinar with fixed time). \|
\| \`uuid\` \| string \| No \| Unique identifier for the webinar instance. \|

\### New Webinar Participant

\*\*Slug:\*\* \`ZOOM\_NEW\_WEBINAR\_PARTICIPANT\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new participant appears in a past webinar's participant list.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`page\_size\` \| integer \| No \| The number of participants to fetch per API call (max 300). \|
\| \`webinar\_id\` \| string \| Yes \| The webinar's ID or universally unique ID (UUID). If you provide a webinar ID, the API returns a response for the latest webinar instance. If you provide a webinar UUID that begins with a \`/\` character or contains the \`//\` characters, you must double encode the webinar UUID before making an API request. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`attentiveness\_score\` \| string \| No \| Participant's attentiveness score. Can be an empty string or a percentage value. \|
\| \`bo\_mtg\_id\` \| string \| No \| Breakout room ID for participants in breakout rooms. \|
\| \`duration\` \| integer \| No \| Participant duration in seconds. \|
\| \`id\` \| string \| No \| Participant UUID. Unique identifier for the participant. \|
\| \`join\_time\` \| string \| No \| The time at which the participant joined the webinar. ISO 8601 date-time format. \|
\| \`leave\_time\` \| string \| No \| The time at which the participant left the webinar. ISO 8601 date-time format. \|
\| \`name\` \| string \| No \| Participant display name. \|
\| \`registrant\_id\` \| string \| No \| The unique identifier for the registrant. Used to identify external participants. \|
\| \`user\_email\` \| string \| No \| Email address of the participant. \|
\| \`user\_id\` \| string \| No \| Participant ID. User ID of the participant if they are an authenticated Zoom user. \|

\### User Information Changed

\*\*Slug:\*\* \`ZOOM\_USER\_INFORMATION\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a Zoom user's information changes.
Detects changes such as:
\- Profile information updates (name, email, display name)
\- Role or type changes
\- Department, job title, or location updates
\- Contact information changes (phone, timezone)
\- Status changes (active, inactive, pending)
\- Settings updates (language, pronouns, etc.)

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`login\_type\` \| integer \| No \| The user's login method to filter by (e.g., 1 for Google OAuth, 100 for Zoom Work email). \|
\| \`user\_id\` \| string \| Yes \| The user ID or email address of the user to monitor. Use 'me' for the authenticated user. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`changes\_detected\` \| object \| No \| Dictionary describing what changed (field names to old/new values) \|
\| \`event\_type\` \| string \| Yes \| Type of change detected (user\_updated) \|
\| \`user\` \| object \| Yes \| Current state of the user information \|

\### Webinar Details Changed

\*\*Slug:\*\* \`ZOOM\_WEBINAR\_DETAILS\_CHANGED\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a Zoom webinar's details change.
Detects changes such as:
\- Topic updates
\- Start time changes
\- Agenda modifications
\- Duration changes
\- Settings updates (host video, registration type, audio options, etc.)
\- Status changes
\- Occurrence updates for recurring webinars
\- Recurrence pattern changes

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`occurrence\_id\` \| string \| No \| Unique identifier for an occurrence of a recurring webinar. Leave blank for non-recurring webinars. \|
\| \`show\_previous\_occurrences\` \| boolean \| No \| Set to True to view webinar details of all previous occurrences of a recurring webinar. \|
\| \`webinar\_id\` \| string \| Yes \| The webinar's ID or universally unique ID (UUID) to monitor for changes. \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`changes\_detected\` \| object \| No \| Dictionary describing what changed (field names to old/new values) \|
\| \`event\_type\` \| string \| Yes \| Type of change detected (webinar\_updated) \|
\| \`webinar\` \| object \| Yes \| Current state of the webinar details \|
