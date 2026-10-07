---
url: https://docs.composio.dev/toolkits/calendly.md
title: https://docs.composio.dev/toolkits/calendly.md
description: 
status: 200
---

\# Calendly

Calendly is an appointment scheduling tool that automates meeting invitations, availability checks, and reminders, helping individuals and teams avoid email back-and-forth

\- \*\*Category:\*\* scheduling & booking
\- \*\*Auth:\*\* OAUTH2
\- \*\*Composio-managed OAuth available?\*\* Yes
\- \*\*Tools:\*\* 56
\- \*\*Triggers:\*\* 0
\- \*\*Slug:\*\* \`CALENDLY\`
\- \*\*Version:\*\* 20260721\_00

\## Frequently Asked Questions

\### Why can't I configure individual scopes for Calendly?

Calendly does not let end users selectively approve individual scopes during the OAuth connection flow. The scopes configured in your Calendly OAuth app are the scopes that will be requested during authorization, and the resulting access token will include that configured permission set.

To change Calendly permissions, update the scopes in your OAuth app/auth config and reconnect the account so a new token is issued with the updated scopes.

\## Tools

\### Cancel scheduled event

\*\*Slug:\*\* \`CALENDLY\_CANCEL\_SCHEDULED\_EVENT\`

Tool to cancel a scheduled Calendly event by creating a cancellation record. Use when you need to permanently cancel an existing, active event. The cancellation will trigger notifications to all invitees.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`reason\` \| string \| No \| Optional text explanation for why the event is being canceled. This reason will be included in the cancellation notification sent to invitees. \|
\| \`event\_uuid\` \| string \| Yes \| The unique identifier (UUID) of the scheduled event to cancel. This can be extracted from the scheduled\_events URI or event details. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create event invitee (Deprecated)

\*\*Slug:\*\* \`CALENDLY\_CREATE\_EVENT\_INVITEE\`

DEPRECATED: Use CALENDLY\_POST\_INVITEE instead. Tool to programmatically schedule Calendly meetings without UI redirects. Use when you need to book a meeting on behalf of an invitee via API. Requires a paid Calendly plan.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`invitee\` \| object \| Yes \| Details of the attendee being scheduled for the meeting \|
\| \`location\` \| object \| Yes \| Meeting location details. Required unless the event type omits location specification. \|
\| \`tracking\` \| object \| No \| UTM parameters and tracking information for marketing attribution. \|
\| \`event\_type\` \| string \| Yes \| The event type to book. Accepts either the full URI (e.g., 'https://api.calendly.com/event\_types/AAAAAAAAAAAAAAAA') or just the UUID (e.g., 'AAAAAAAAAAAAAAAA'). Use list\_user\_s\_event\_types action to get available event types. \|
\| \`start\_time\` \| string \| Yes \| Meeting start time in ISO 8601 UTC format (e.g., '2025-10-02T18:30:00Z'). Use list\_event\_type\_available\_times action to check available slots before booking. \|
\| \`event\_guests\` \| array \| No \| List of additional email addresses to include as guests in the meeting \|
\| \`questions\_and\_answers\` \| array \| No \| List of custom question responses from the booking form. Include only if the event type has custom questions. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Event Type

\*\*Slug:\*\* \`CALENDLY\_CREATE\_EVENT\_TYPE\`

Tool to create a new one-on-one event type (kind: solo) in Calendly. Use when you need to programmatically create a new event type for scheduling meetings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| The event type name that will be displayed to invitees \|
\| \`color\` \| string \| No \| Hexadecimal color value for the scheduling page. Must match pattern ^#\[a-f\\d\]{6}$ (e.g., '#fff200') \|
\| \`owner\` \| string \| Yes \| The owner URI for this event type (e.g., 'https://api.calendly.com/users/AAAAAAAAAAAAAAAA'). Must be a valid user URI. \|
\| \`active\` \| boolean \| No \| Indicates if the event type is active and available for booking. Defaults to false if not provided. \|
\| \`locale\` \| string ("de" \| "en" \| "es" \| "fr" \| "it" \| "nl" \| "pt" \| "uk") \| No \| Locale for the event type's scheduling page language \|
\| \`duration\` \| integer \| No \| Length of sessions in minutes. Must be between 1 and 720 minutes. Should be one of the duration\_options if both are provided. \|
\| \`locations\` \| array \| No \| Configuration information for each possible location where the event can take place \|
\| \`description\` \| string \| No \| The event type description that will be shown on the scheduling page \|
\| \`duration\_options\` \| array \| No \| Alternative duration choices for flexible meetings. Maximum 4 unique values allowed. Each must be between 1 and 720 minutes. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create One-Off Event Type

\*\*Slug:\*\* \`CALENDLY\_CREATE\_ONE\_OFF\_EVENT\_TYPE\`

Creates a temporary Calendly one-off event type for unique meetings outside regular availability, requiring valid host/co-host URIs, a future date/range for \`date\_setting\`, and a positive \`duration\`.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`host\` \| string \| Yes \| The URI of the user who will be the host of the one-off event (e.g., 'https://api.calendly.com/users/xxx') \|
\| \`name\` \| string \| Yes \| Name of the one-off event type \|
\| \`duration\` \| integer \| Yes \| Duration of the event in minutes. Note: Pass this as 'duration', not 'duration\_minutes'. \|
\| \`location\` \| object \| No \| Location configuration for the event. \|
\| \`timezone\` \| string \| No \| IANA timezone identifier for the event scheduling. Determines how times are interpreted and displayed to invitees. \|
\| \`date\_setting\` \| string \| Yes \| Date & time availability for this one-off event. Must be an object with a \`type\` key equal to ONE of: \`'date\_range'\`, \`'days\_in\_future'\`, or \`'spots'\`. • \`date\_range\` → include \`start\_date\` & \`end\_date\` (YYYY-MM-DD). • \`days\_in\_future\` → include \`days\` (int) and \`only\_weekdays\` (bool). • \`spots\` → include \`spots\` – list of objects with \`start\_time\` and \`end\_time\` (ISO 8601 datetime strings). Do NOT use values like \`'available\_moving'\` – that pertains to Shares, not one-off events. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create scheduling link

\*\*Slug:\*\* \`CALENDLY\_CREATE\_SCHEDULING\_LINK\`

Create a single-use scheduling link. Creates a scheduling link that can be used to book an event. The link allows invitees to schedule up to the specified maximum number of events. Once the limit is reached, the link becomes inactive.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`owner\` \| string \| Yes \| Event type URI (e.g., 'https://api.calendly.com/event\_types/...') \|
\| \`owner\_type\` \| string \| No \| Type of owner, typically 'EventType' \|
\| \`max\_event\_count\` \| integer \| No \| The max number of events that can be scheduled using this scheduling link. Must be exactly 1 for single-use scheduling links. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create share

\*\*Slug:\*\* \`CALENDLY\_CREATE\_SHARE\`

Creates a customizable, one-time share link for a Calendly event type, allowing specific overrides to its settings (e.g., duration, availability, location) without altering the original event type.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| Custom name for the shared link; defaults to event type name if unspecified. \|
\| \`duration\` \| integer \| No \| Custom event duration in minutes, overriding event type default. \|
\| \`end\_date\` \| string \| No \| End date (YYYY-MM-DD) for shared link availability; required if \`period\_type\` is 'fixed'. \|
\| \`event\_type\` \| string \| Yes \| URI of the event type to base this share on. \|
\| \`start\_date\` \| string \| No \| Start date (YYYY-MM-DD) for shared link availability; required if \`period\_type\` is 'fixed'. \|
\| \`period\_type\` \| string ("available\_moving" \| "moving" \| "fixed" \| "unlimited") \| No \| Availability period type: 'available\_moving' (shows actual available slots for \`max\_booking\_time\` days), 'moving' (available for \`max\_booking\_time\` days), 'fixed' (within \`start\_date\`/\`end\_date\`), 'unlimited'. \|
\| \`hide\_location\` \| boolean \| No \| If true, hides event location until booking (only if event type has a single custom location). \|
\| \`duration\_options\` \| array \| No \| Alternative selectable durations in minutes, overriding event type options. \|
\| \`max\_booking\_time\` \| integer \| No \| Max days in advance an invitee can book; required if \`period\_type\` is 'moving' or 'available\_moving'. \|
\| \`location\_configurations\` \| array \| No \| Custom location settings that override the event type's default locations. Each configuration specifies a location type and associated details. \|
\| \`availability\_\_rule\_\_rules\` \| array \| No \| List of custom availability rules that override the event type's default schedule. Provide an array of objects EACH containing: \`type\`=\`'wday'\`, \`wday\` (weekday), and \`intervals\` (list of \`{from, to}\` times). Field names are case-sensitive – use \*\*\`wday\`, \`from\`, \`to\`\*\* exactly. Must be combined with \`availability\_rule\_timezone\`. \|
\| \`availability\_\_rule\_\_timezone\` \| string \| No \| IANA timezone (e.g., 'America/New\_York') for custom availability rules. Required with \`availability\_rule\_rules\`. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create single use scheduling link

\*\*Slug:\*\* \`CALENDLY\_CREATE\_SINGLE\_USE\_SCHEDULING\_LINK\`

Creates a one-time, single-use scheduling link for an active Calendly event type, expiring after one booking.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`owner\` \| string \| Yes \| The URI of the Calendly Event Type that will own this single-use scheduling link. This Event Type's settings (e.g., duration, availability) will apply to the scheduled meeting. \|
\| \`owner\_type\` \| string ("EventType") \| Yes \| Identifies the owner resource type, which is 'EventType'. \|
\| \`max\_event\_count\` \| integer \| Yes \| The maximum number of events that can be scheduled using this link. For a single-use link, this value must be 1. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create webhook subscription

\*\*Slug:\*\* \`CALENDLY\_CREATE\_WEBHOOKS\`

Tool to create a webhook subscription for receiving Calendly event notifications. Use when you need to set up automated notifications for events like meeting bookings or cancellations. Organization scope triggers webhooks for all events organization-wide, while user/group scopes limit triggering to specific users or groups.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| Yes \| The publicly accessible HTTPS callback URL where webhook events will be sent via POST requests. Must be active and able to receive POST requests. \|
\| \`user\` \| string \| No \| URI reference to the user for user-scoped webhooks (e.g., 'https://api.calendly.com/users/AAAAAAAAAAAAAAAA'). Required when scope is 'user', otherwise omit. \|
\| \`group\` \| string \| No \| URI reference to the group for group-scoped webhooks (e.g., 'https://api.calendly.com/groups/AAAAAAAAAAAAAAAA'). Required when scope is 'group', otherwise omit. \|
\| \`scope\` \| string ("organization" \| "user" \| "group") \| Yes \| Subscription scope determining which events trigger the webhook. 'organization' triggers for all events in the organization, 'user' triggers only for a specific user's events, 'group' triggers only for a specific group's events. \|
\| \`events\` \| array \| Yes \| List of event types to subscribe to. Valid values: 'invitee.created', 'invitee.canceled', 'invitee\_no\_show.created', 'invitee\_no\_show.deleted', 'routing\_form\_submission.created', 'event\_type.created', 'event\_type.deleted', 'event\_type.updated'. At least one event must be specified. \|
\| \`signing\_key\` \| string \| No \| Optional secret key (6-24 characters) used to generate signatures for webhook security validation. Helps verify that webhook POST requests are genuinely from Calendly. \|
\| \`organization\` \| string \| Yes \| URI reference to the organization that owns this webhook subscription (e.g., 'https://api.calendly.com/organizations/AAAAAAAAAAAAAAAA'). Required for all webhook subscriptions. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete invitee data

\*\*Slug:\*\* \`CALENDLY\_DELETE\_INVITEE\_DATA\`

Permanently removes all invitee data associated with the provided emails from past organization events, for data privacy compliance (requires Enterprise subscription; deletion may take up to one week).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`emails\` \| array \| Yes \| Invitee email addresses for whom all associated data will be permanently removed. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete invitee no show

\*\*Slug:\*\* \`CALENDLY\_DELETE\_INVITEE\_NO\_SHOW\`

Deletes an Invitee No-Show record by its \`uuid\` to reverse an invitee's 'no-show' status; the \`uuid\` must refer to an existing record.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| The unique identifier (UUID) of the Invitee No-Show record to be removed. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete organization membership

\*\*Slug:\*\* \`CALENDLY\_DELETE\_ORGANIZATION\_MEMBERSHIP\`

Tool to remove a user from a Calendly organization by membership UUID. Use when you need to revoke a user's access to an organization. Requires admin rights; organization owners cannot be removed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| The unique identifier of the organization membership to be removed. This is the membership UUID, not the user UUID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete scheduled event data

\*\*Slug:\*\* \`CALENDLY\_DELETE\_SCHEDULED\_EVENT\_DATA\`

For Enterprise users, initiates deletion of an organization's scheduled event data between a \`start\_time\` and \`end\_time\` (inclusive, where \`start\_time\` must be <= \`end\_time\`); actual data deletion may take up to 7 days to complete.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`end\_time\` \| string \| Yes \| Defines the end of the data deletion period (UTC). Events ending at or before this time will be included. Must be within the past 24 months. \|
\| \`start\_time\` \| string \| Yes \| Defines the start of the data deletion period (UTC). Events starting at or after this time will be included. Must be within the past 24 months. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete webhook subscription

\*\*Slug:\*\* \`CALENDLY\_DELETE\_WEBHOOK\_SUBSCRIPTION\`

Deletes an existing webhook subscription to stop Calendly sending event notifications to its registered callback URL; this operation is idempotent.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`webhook\_uuid\` \| string \| Yes \| The unique identifier (UUID) of the webhook subscription to be deleted. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get current user (Deprecated)

\*\*Slug:\*\* \`CALENDLY\_GET\_CURRENT\_USER\`

DEPRECATED: Use CALENDLY\_GET\_USER instead. Retrieves detailed information about the currently authenticated Calendly user.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get event

\*\*Slug:\*\* \`CALENDLY\_GET\_EVENT\`

Use to retrieve a specific Calendly scheduled event by its UUID, provided the event exists in the user's Calendly account.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| Unique identifier (UUID) of the Calendly event. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get event invitee

\*\*Slug:\*\* \`CALENDLY\_GET\_EVENT\_INVITEE\`

Retrieves detailed information about a specific invitee of a scheduled event, using their unique UUIDs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_uuid\` \| string \| Yes \| The unique identifier (UUID) of the scheduled event. \|
\| \`invitee\_uuid\` \| string \| Yes \| The unique identifier (UUID) of the invitee for the specified event. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get event type

\*\*Slug:\*\* \`CALENDLY\_GET\_EVENT\_TYPE\`

Retrieves details for a specific Calendly event type, identified by its UUID, which must be valid and correspond to an existing event type.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| No \| Unique identifier (UUID) for the event type. This is a required path parameter - extract the UUID from the event type URI (e.g., for 'https://api.calendly.com/event\_types/abc123', use 'abc123'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get event type availability

\*\*Slug:\*\* \`CALENDLY\_GET\_EVENT\_TYPE\_AVAILABILITY\`

Tool to retrieve availability schedules configured for a specific Calendly event type. Use when you need to get the availability rules including day-of-week schedules and date-specific overrides.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| string \| No \| URI of the user associated with the event type. Optional parameter to filter by user. \|
\| \`event\_type\` \| string \| Yes \| URI of the event type whose availability schedules are to be listed. Must be a valid Calendly event type URI. Retrieve this URI from CALENDLY\_LIST\_EVENT\_TYPES; using a URI not owned by the authenticated user returns a 403 error. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get group

\*\*Slug:\*\* \`CALENDLY\_GET\_GROUP\`

Retrieves all attributes of a specific Calendly group by its UUID; the group must exist.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| Unique identifier (UUID) of the Calendly group. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get group relationship

\*\*Slug:\*\* \`CALENDLY\_GET\_GROUP\_RELATIONSHIP\`

Retrieves a specific Calendly group relationship by its valid and existing UUID, providing details on user-group associations and membership.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| The unique identifier (UUID) of the group relationship to be retrieved. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get invitee no show

\*\*Slug:\*\* \`CALENDLY\_GET\_INVITEE\_NO\_SHOW\`

Retrieves details for a specific Invitee No Show record by its UUID; an Invitee No Show is marked when an invitee does not attend a scheduled event.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| The unique identifier (UUID) of the Invitee No Show record to retrieve. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get organization

\*\*Slug:\*\* \`CALENDLY\_GET\_ORGANIZATION\`

Tool to retrieve information about a specific Calendly organization. Use when you need to get organization details such as name, slug, or timestamps.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| The unique identifier (UUID) of the organization to retrieve. This is the alphanumeric string at the end of the organization URI. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get organization invitation

\*\*Slug:\*\* \`CALENDLY\_GET\_ORGANIZATION\_INVITATION\`

Retrieves a specific Calendly organization invitation using its UUID and the parent organization's UUID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| The unique identifier (UUID) of the specific organization invitation to retrieve. \|
\| \`org\_uuid\` \| string \| Yes \| The unique identifier (UUID) of the Calendly organization to which the invitation belongs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get organization membership

\*\*Slug:\*\* \`CALENDLY\_GET\_ORGANIZATION\_MEMBERSHIP\`

Retrieves a specific Calendly organization membership by its UUID, returning all its attributes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| The unique identifier (UUID) of the organization membership to retrieve. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get routing form

\*\*Slug:\*\* \`CALENDLY\_GET\_ROUTING\_FORM\`

Retrieves a specific routing form by its UUID, providing its configuration details including questions and routing logic.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| The unique identifier (UUID) of the routing form to retrieve. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get routing form submission

\*\*Slug:\*\* \`CALENDLY\_GET\_ROUTING\_FORM\_SUBMISSION\`

Tool to retrieve details about a specific routing form submission by its UUID. Use when you need submission details including questions, answers, and routing results.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| The unique identifier (UUID) of the routing form submission to retrieve. Extract from submission URI or webhook payload. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get sample webhook data

\*\*Slug:\*\* \`CALENDLY\_GET\_SAMPLE\_WEBHOOK\_DATA\`

Tool to retrieve sample webhook payload data for testing webhook subscriptions. Use when you need to verify webhook setup and understand the data structure before creating actual webhook subscriptions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| string \| No \| The URI of the user to retrieve sample webhook data for. Required when scope is 'user', optional when scope is 'organization'. Format: https://api.calendly.com/users/{user\_uuid} \|
\| \`event\` \| string ("invitee.created" \| "invitee.canceled" \| "routing\_form\_submission.created") \| Yes \| The webhook event type to retrieve sample data for. Valid values: 'invitee.created', 'invitee.canceled', 'routing\_form\_submission.created' \|
\| \`scope\` \| string ("user" \| "organization") \| Yes \| The scope level for the webhook data. Valid values: 'user' or 'organization'. Note: routing\_form\_submission.created events require 'organization' scope. \|
\| \`organization\` \| string \| Yes \| The URI of the organization to retrieve sample webhook data for. This parameter is always required. Format: https://api.calendly.com/organizations/{organization\_uuid} \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get user

\*\*Slug:\*\* \`CALENDLY\_GET\_USER\`

Retrieves comprehensive details for an existing Calendly user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| No \| The unique identifier (UUID) of the user. Alternatively, use the literal string "me" to refer to the currently authenticated user (the caller). Defaults to "me" (current user) if not specified. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get user availability schedule

\*\*Slug:\*\* \`CALENDLY\_GET\_USER\_AVAILABILITY\_SCHEDULE\`

Retrieves an existing user availability schedule by its UUID; this schedule defines the user's default hours of availability.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| Unique identifier (UUID) of the availability schedule. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get webhook subscription

\*\*Slug:\*\* \`CALENDLY\_GET\_WEBHOOK\_SUBSCRIPTION\`

Retrieves the details of an existing webhook subscription, identified by its UUID, including its callback URL, subscribed events, scope, and state.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`webhook\_uuid\` \| string \| Yes \| Unique identifier (UUID) of the webhook subscription to retrieve. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mark invitee as no-show

\*\*Slug:\*\* \`CALENDLY\_INVITEE\_NO\_SHOW\`

Tool to mark an invitee as a no-show for a scheduled event. Use when an invitee fails to attend their scheduled meeting and you need to record their absence in Calendly.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`invitee\` \| string \| Yes \| URI of the Invitee to be marked as a no-show. This must be a valid URI referencing an existing invitee from a scheduled event (e.g., 'https://api.calendly.com/scheduled\_events/GBGBDCAADAEDCRZ2/invitees/AAAAAAAAAAAAAAAA'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List activity log entries

\*\*Slug:\*\* \`CALENDLY\_LIST\_ACTIVITY\_LOG\_ENTRIES\`

Retrieves a list of activity log entries for a specified Calendly organization (requires an active Enterprise subscription), supporting filtering, sorting, and pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sort\` \| array \| No \| Specifies the sort order for the results. Provide a list of sort criteria strings, each in the format 'field:direction' (e.g., 'occurred\_at:asc'). Valid fields and directions are defined by SortEnm. \|
\| \`actor\` \| array \| No \| Filters activity log entries by the users who performed the actions. Provide a list of user URIs. \|
\| \`count\` \| integer \| No \| The maximum number of activity log entries to return per page. \|
\| \`action\` \| array \| No \| Filters entries by the specific action performed (e.g., 'user.created', 'event\_type.updated'). Provide a list of action strings. \|
\| \`namespace\` \| array \| No \| Filters entries by their category or domain (namespace). Provide a list of namespace strings. Common examples include 'user\_management' or 'event\_type\_management'. \|
\| \`page\_token\` \| string \| No \| Token for pagination, used to fetch the next page of results if the collection spans multiple pages. \|
\| \`search\_term\` \| string \| No \| Filters entries based on the search term. Supported operators: \`\|\` (OR, e.g., \`user.created \| group.created\`), \`+\` (AND, e.g., \`user.created + user.invited\`), \`" "\` (exact phrase, e.g., \`"John Doe"\`), \`-\` (exclude term, e.g., \`user.created -admin\`), \`()\` (precedence, e.g., \`(user.created \| user.invited) + team1\`), and \`\*\` (prefix search, e.g., \`user.email\_address:\*@example.com\`). \|
\| \`organization\` \| string \| Yes \| URI of the Calendly organization for which to retrieve activity log entries. \|
\| \`max\_occurred\_at\` \| string \| No \| Timestamp in ISO 8601 UTC format (e.g., '2020-01-02T03:04:05.678Z'). Filters entries to include only those that occurred at or before this time. \|
\| \`min\_occurred\_at\` \| string \| No \| Timestamp in ISO 8601 UTC format (e.g., '2020-01-02T03:04:05.678Z'). Filters entries to include only those that occurred at or after this time. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List event invitees

\*\*Slug:\*\* \`CALENDLY\_LIST\_EVENT\_INVITEES\`

Retrieves a list of invitees for a specified Calendly event UUID, with options to filter by status or email, and sort by creation time.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sort\` \| string \| No \| Order results by the \`created\_at\` field; use 'created\_at:asc' for ascending or 'created\_at:desc' for descending. \|
\| \`uuid\` \| string \| Yes \| The unique identifier (UUID) of the event for which to list invitees. \|
\| \`count\` \| integer \| No \| The number of invitees to return per page. Default is 20. \|
\| \`email\` \| string \| No \| Filter results by a specific invitee's email address. \|
\| \`status\` \| string ("active" \| "canceled") \| No \| Filter invitees by their status. Can be 'active' or 'canceled'. \|
\| \`page\_token\` \| string \| No \| A token to retrieve the next or previous page of results in a paginated collection. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List events (Deprecated)

\*\*Slug:\*\* \`CALENDLY\_LIST\_EVENTS\`

DEPRECATED: Use CALENDLY\_LIST\_SCHEDULED\_EVENTS instead. Retrieves a list of scheduled Calendly events. Exactly one of \`user\`, \`organization\`, or \`group\` must be provided to scope the query. The \`invitee\_email\` parameter is a filter and cannot be used as a scope. Admin rights may be needed when filtering by \`organization\` or \`group\`.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sort\` \| string \| No \| Sort order for the results. Accepts comma-separated \`field:direction\` values. Supported field: \`start\_time\`. Supported directions: \`asc\` (ascending), \`desc\` (descending). \|
\| \`user\` \| string \| No \| Full Calendly API URI of the user whose events you want to list. MUST be a complete URI in the format 'https://api.calendly.com/users/{uuid}'. Shortcuts like 'me' are NOT supported - use CALENDLY\_GET\_CURRENT\_USER to get the user URI first. Exactly ONE of \`user\`, \`organization\`, or \`group\` must be supplied to scope the query. \|
\| \`count\` \| integer \| No \| The number of events to return per page. \|
\| \`group\` \| string \| No \| Full Calendly API URI of the group (team) whose events you want to list. MUST be a complete URI in the format 'https://api.calendly.com/groups/{uuid}'. Exactly ONE of \`user\`, \`organization\`, or \`group\` must be provided to scope the query. \|
\| \`status\` \| string ("active" \| "canceled") \| No \| Filter events by their status. \|
\| \`page\_token\` \| string \| No \| Token for pagination to retrieve the next or previous set of results from the collection. \|
\| \`organization\` \| string \| No \| Full Calendly API URI of the organization whose events you want to list. MUST be a complete URI in the format 'https://api.calendly.com/organizations/{uuid}'. Exactly ONE of \`user\`, \`organization\`, or \`group\` is required. Admin privileges may be required. \|
\| \`invitee\_email\` \| string \| No \| Invitee's email address to filter events by. This is a filter parameter and cannot be used as a scope. Exactly one of \`user\`, \`organization\`, or \`group\` must be provided to scope the query. \|
\| \`max\_start\_time\` \| string \| No \| Include events with start times at or before this UTC timestamp (e.g., '2020-01-02T03:04:05.678123Z'). \|
\| \`min\_start\_time\` \| string \| No \| Include events with start times at or after this UTC timestamp (e.g., '2020-01-02T03:04:05.678123Z'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List event type available times

\*\*Slug:\*\* \`CALENDLY\_LIST\_EVENT\_TYPE\_AVAILABLE\_TIMES\`

Fetches available time slots for a Calendly event type within a specified time range; results are not paginated.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`end\_time\` \| string \| Yes \| End datetime (exclusive) of the requested availability range, in UTC ISO 8601 format (e.g., 'YYYY-MM-DDTHH:MM:SSZ'). The duration between start\_time and end\_time cannot exceed 7 days. \|
\| \`event\_type\` \| string \| Yes \| The URI of the event type for which to find available times. This can be obtained by listing event types or from an event type object. \|
\| \`start\_time\` \| string \| Yes \| Start datetime (inclusive) of the requested availability range, in UTC ISO 8601 format (e.g., 'YYYY-MM-DDTHH:MM:SSZ'). Must be in the future. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List event type hosts

\*\*Slug:\*\* \`CALENDLY\_LIST\_EVENT\_TYPE\_MEMBERSHIPS\`

Tool to retrieve a list of event type hosts (memberships) for a specific event type. Use when you need to see which users are configured as hosts for an event type.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`count\` \| integer \| No \| Number of results to return per page. Must be a positive integer. \|
\| \`event\_type\` \| string \| Yes \| URI of the event type to retrieve memberships for. Format: 'https://api.calendly.com/event\_types/{uuid}'. Pass the complete URI, not just the UUID. \|
\| \`page\_token\` \| string \| No \| Pagination token to retrieve a specific page of results. Use the 'next\_page\_token' from a previous response to get the next page. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Event Types

\*\*Slug:\*\* \`CALENDLY\_LIST\_EVENT\_TYPES\`

Tool to list all Event Types associated with a specified User or Organization. Use when you need to retrieve event types for a user or organization. Use scheduling\_url from results directly; do not manually construct event type URLs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sort\` \| string \| No \| Order results by field(s) and direction. Accepts comma-separated list of field:direction values (e.g., 'name:asc,created\_at:desc'). Default: name:asc \|
\| \`user\` \| string \| No \| URI of the user whose event types to list. Exactly one of 'user' or 'organization' must be provided (mutually exclusive). \|
\| \`count\` \| integer \| No \| Number of results per page. \|
\| \`active\` \| boolean \| No \| Filter by active status. Return only active event types if true, only inactive if false, or all event types if omitted. \|
\| \`page\_token\` \| string \| No \| Pagination token for retrieving subsequent pages. Check pagination.next\_page\_token in the response; if non-null, pass it as page\_token in the next call. Repeat until next\_page\_token is null. \|
\| \`organization\` \| string \| No \| URI of the organization whose event types to list. Exactly one of 'organization' or 'user' must be provided (mutually exclusive). \|
\| \`admin\_managed\` \| boolean \| No \| Filter by admin management status. True for admin-managed only, false to exclude admin-managed, or omitted to include all. \|
\| \`user\_availability\_schedule\` \| string \| No \| URI of the user's availability schedule. Used with 'user' parameter to filter event types by primary availability schedule. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List group relationships

\*\*Slug:\*\* \`CALENDLY\_LIST\_GROUP\_RELATIONSHIPS\`

Retrieves a list of group relationships defining an owner's role (e.g., member, admin) within a group; an owner can have one membership per group but multiple admin roles across different groups.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`count\` \| integer \| No \| Number of records per page (max 100). \|
\| \`group\` \| string \| No \| Filter results by group URI. \|
\| \`owner\` \| string \| No \| Filter results by owner URI (Organization Membership or Invitation URI). \|
\| \`page\_token\` \| string \| No \| Token for retrieving a specific page of results, obtained from \`next\_page\_token\` or \`previous\_page\_token\` in a previous response. \|
\| \`organization\` \| string \| No \| Filter results by organization URI. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List groups

\*\*Slug:\*\* \`CALENDLY\_LIST\_GROUPS\`

Returns a list of groups for a specified Calendly organization URI, supporting pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`count\` \| integer \| No \| The maximum number of groups to return per page. The value can range from 1 to 100. \|
\| \`page\_token\` \| string \| No \| A token to retrieve a specific page of results. Pass this value from a previous response's 'next\_page\_token' to fetch the next set of groups, or 'previous\_page\_token' for the previous set. \|
\| \`organization\` \| string \| Yes \| The URI of the organization to filter groups by. For example, 'https://api.calendly.com/organizations/ORGANIZATION\_UUID'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List organization invitations

\*\*Slug:\*\* \`CALENDLY\_LIST\_ORGANIZATION\_INVITATIONS\`

Retrieves a list of invitations for a specific organization, identified by its UUID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sort\` \| string \| No \| Order of results by field(s) and direction (asc/desc); e.g., 'created\_at:asc' or 'email:desc,status:asc'. \|
\| \`uuid\` \| string \| Yes \| Unique identifier (UUID) of the organization. \|
\| \`count\` \| integer \| No \| Number of results to return per page. \|
\| \`email\` \| string \| No \| Filter by the recipient's email address. \|
\| \`status\` \| string ("pending" \| "accepted" \| "declined") \| No \| Filter by invitation status. \|
\| \`page\_token\` \| string \| No \| Pagination token to access a specific page of results. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List organization memberships

\*\*Slug:\*\* \`CALENDLY\_LIST\_ORGANIZATION\_MEMBERSHIPS\`

Retrieves a list of organization memberships.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| string \| No \| Filter memberships by the URI of the user. At least one of 'organization' or 'user' is required. \|
\| \`count\` \| integer \| No \| The number of membership records to return per page. Must be an integer between 1 and 100, inclusive. \|
\| \`email\` \| string \| No \| Filter memberships by the email address of the user. Must be used with 'organization' or 'user'. \|
\| \`page\_token\` \| string \| No \| The token to retrieve the next or previous page of results in a paginated collection. \|
\| \`organization\` \| string \| No \| Filter memberships by the URI of the organization. At least one of 'organization' or 'user' is required. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List outgoing communications

\*\*Slug:\*\* \`CALENDLY\_LIST\_OUTGOING\_COMMUNICATIONS\`

Retrieves a list of outgoing SMS communications for a specified organization; requires an Enterprise subscription and if filtering by creation date, both \`min\_created\_at\` and \`max\_created\_at\` must be provided to form a valid range.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`count\` \| integer \| No \| The number of records to return per page. Must be between 1 and 100, inclusive. \|
\| \`page\_token\` \| string \| No \| The token to retrieve the next page of results. Provided in the \`next\_page\_token\` field of a previous response. \|
\| \`organization\` \| string \| Yes \| The URI of the organization whose outgoing communications are to be retrieved. \|
\| \`max\_created\_at\` \| string \| No \| Include outgoing communications that were created before this timestamp. Formatted as "YYYY-MM-DDTHH:MM:SS.sssZ" in UTC. \|
\| \`min\_created\_at\` \| string \| No \| Include outgoing communications that were created after this timestamp. Formatted as "YYYY-MM-DDTHH:MM:SS.sssZ" in UTC. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List routing forms

\*\*Slug:\*\* \`CALENDLY\_LIST\_ROUTING\_FORMS\`

Retrieves routing forms for a specified organization; routing forms are questionnaires used to direct invitees to appropriate booking pages or external URLs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sort\` \| string \| No \| Specifies the order of results. Use a comma-separated list of \`field:direction\` pairs. Supported field: \`created\_at\`. Supported directions: \`asc\` (ascending), \`desc\` (descending). \|
\| \`count\` \| integer \| No \| The number of routing forms to return per page. \|
\| \`page\_token\` \| string \| No \| Token to retrieve a specific page of results, usually from a previous response's pagination details. \|
\| \`organization\` \| string \| Yes \| The URI of the organization for which to retrieve routing forms. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List routing form submissions

\*\*Slug:\*\* \`CALENDLY\_LIST\_ROUTING\_FORM\_SUBMISSIONS\`

Tool to list all submissions associated with a specific routing form. Returns questions, answers, routing results, and tracking data for each submission. Use this action when you need to retrieve multiple routing form submissions for analysis or processing. To fetch details of a single submission, use GetRoutingFormSubmission instead.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`form\` \| string \| Yes \| The URI of the routing form whose submissions you want to retrieve. Required to identify which form's submissions to list. \|
\| \`sort\` \| string \| No \| Order results by field and direction. Format: 'field:direction'. Supported field: 'created\_at'. Directions: 'asc', 'desc'. \|
\| \`count\` \| integer \| No \| Number of submissions to return per page. Defaults to 25 to keep responses manageable. \|
\| \`page\_token\` \| string \| No \| Pagination token for retrieving subsequent pages. Check pagination.next\_page\_token in the response; if non-null, pass it as page\_token in the next call. Repeat until next\_page\_token is null. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List scheduled events

\*\*Slug:\*\* \`CALENDLY\_LIST\_SCHEDULED\_EVENTS\`

Tool to retrieve a list of scheduled Calendly events. Use when you need to view events for a specific user, organization, or group. Requires exactly one of user, organization, or group parameter to scope the query.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sort\` \| string \| No \| Order results by the specified field and direction. Format: 'field:direction'. Supported field: 'start\_time'. Supported directions: 'asc' (ascending), 'desc' (descending). \|
\| \`user\` \| string \| No \| Full Calendly API URI of the user whose events you want to list. MUST be a complete URI in the format 'https://api.calendly.com/users/{uuid}'. Shortcuts like 'me' are NOT supported - use CALENDLY\_GET\_CURRENT\_USER to get the user URI first. Exactly ONE of \`user\`, \`organization\`, or \`group\` must be provided to scope the query. \|
\| \`count\` \| integer \| No \| Number of events to return per page. Must be a positive integer. \|
\| \`group\` \| string \| No \| Full Calendly API URI of the group (team) whose events you want to list. MUST be a complete URI in the format 'https://api.calendly.com/groups/{uuid}'. Exactly ONE of \`user\`, \`organization\`, or \`group\` must be provided to scope the query. \|
\| \`status\` \| string ("active" \| "canceled") \| No \| Filter events by their status. Can be 'active' for active events or 'canceled' for canceled events. \|
\| \`page\_token\` \| string \| No \| Pagination token to retrieve a specific page of results. Use the 'next\_page\_token' from a previous response to get the next page. \|
\| \`organization\` \| string \| No \| Full Calendly API URI of the organization whose events you want to list. MUST be a complete URI in the format 'https://api.calendly.com/organizations/{uuid}'. Exactly ONE of \`user\`, \`organization\`, or \`group\` is required. Admin privileges may be required. \|
\| \`invitee\_email\` \| string \| No \| Return events that are scheduled with the invitee associated with this email address. This is a filter parameter and must be used together with one of the scope parameters (user, organization, or group). \|
\| \`max\_start\_time\` \| string \| No \| Include events with start times prior to this time. Must be in UTC format (ISO 8601). \|
\| \`min\_start\_time\` \| string \| No \| Include events with start times after this time. Must be in UTC format (ISO 8601). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List user availability schedules

\*\*Slug:\*\* \`CALENDLY\_LIST\_USER\_AVAILABILITY\_SCHEDULES\`

Retrieves all availability schedules for the specified Calendly user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| string \| Yes \| URI of the user whose availability schedules are to be listed; must be a valid Calendly user URI. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List user busy times

\*\*Slug:\*\* \`CALENDLY\_LIST\_USER\_BUSY\_TIMES\`

Fetches a user's busy time intervals (internal and external calendar events) in ascending order for a period up to 7 days; keyset pagination is not supported.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| string \| Yes \| The URI of the user whose busy times are being queried. This is typically the user's Calendly API URI. \|
\| \`end\_time\` \| string \| Yes \| The end of the time range for which to fetch busy times, in RFC3339 format (e.g., '2023-10-26T11:00:00Z'). Must be after start\_time. \|
\| \`start\_time\` \| string \| Yes \| The start of the time range for which to fetch busy times, in RFC3339 format (e.g., '2023-10-26T10:00:00Z'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List User Meeting Locations

\*\*Slug:\*\* \`CALENDLY\_LIST\_USER\_LOCATIONS\`

Tool to retrieve configured meeting location information for a given Calendly user. Use when you need to see all available location options configured by a user for their meetings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| string \| Yes \| URI of the user whose locations to list. This should be the full Calendly user URI (e.g., 'https://api.calendly.com/users/AAAAAAAAAAAAAAAA'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List user event types (Deprecated)

\*\*Slug:\*\* \`CALENDLY\_LIST\_USER\_S\_EVENT\_TYPES\`

DEPRECATED: Use CALENDLY\_LIST\_EVENT\_TYPES instead. Retrieves event types for a user or organization; requires either the \`user\` or \`organization\` URI.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sort\` \| string \| No \| Order results by field(s) and direction ('asc' or 'desc'), e.g., 'name:asc,created\_at:desc'. Supported fields: name, position, created\_at, updated\_at. Defaults to 'name:asc' if omitted. \|
\| \`user\` \| string \| No \| URI of the \*\*user\*\* whose event types to list. Provide \*\*either\*\* \`user\` \*\*or\*\* \`organization\` (exactly one is required). \*\*IMPORTANT:\*\* Must be the actual resolved user URI (e.g., https://api.calendly.com/users/5dc7b7a8-1d8c-4fcc-8b63-5f5a17eea4a3). The shorthand 'https://api.calendly.com/users/me' is NOT accepted by this endpoint. Use the 'Get Current User' action first to obtain the actual user URI. \|
\| \`count\` \| integer \| No \| Number of event types per page (max 100). \|
\| \`active\` \| boolean \| No \| Filter by active status (true for active, false for inactive). If omitted, all event types are returned. \|
\| \`page\_token\` \| string \| No \| Token for retrieving the next or previous page of event types. \|
\| \`organization\` \| string \| No \| URI of the \*\*organization\*\* whose event types to list. Provide \*\*either\*\* \`organization\` \*\*or\*\* \`user\` (exactly one is required). \|
\| \`admin\_managed\` \| boolean \| No \| Filter by admin management: true for admin-managed only, false to exclude admin-managed. If omitted, all types are returned (respecting other filters). \|
\| \`user\_availability\_schedule\` \| string \| No \| URI of the user's availability schedule; use with \`user\` to filter event types by this primary schedule. Example: 'https://api.calendly.com/user\_availability\_schedules/SCHEDULE\_UUID'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List webhook subscriptions

\*\*Slug:\*\* \`CALENDLY\_LIST\_WEBHOOK\_SUBSCRIPTIONS\`

Retrieves webhook subscriptions for a Calendly organization; \`scope\` determines if \`user\` or \`group\` URI is also required for filtering.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sort\` \| string \| No \| Sort order for results (e.g., 'created\_at:asc'). Supported fields: \`created\_at\`, \`updated\_at\`. Supported directions: \`asc\`, \`desc\`. \|
\| \`user\` \| string \| No \| URI of the Calendly user; required if \`scope\` is 'user'. \|
\| \`count\` \| integer \| No \| Number of results per page (maximum 100). \|
\| \`group\` \| string \| No \| URI of the Calendly group; required if \`scope\` is 'group'. \|
\| \`scope\` \| string ("organization" \| "user" \| "group") \| Yes \| Scope of the webhook subscriptions: 'organization', 'user', or 'group'. \|
\| \`page\_token\` \| string \| No \| Token for paginating to the next or previous page of results. \|
\| \`organization\` \| string \| Yes \| URI of the Calendly organization for which to list webhook subscriptions. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Invite user to organization

\*\*Slug:\*\* \`CALENDLY\_ORGANIZATION\_INVITATION\`

Tool to invite a user to a Calendly organization via email. Use when you need to send an organization invitation to a new user. Requires organization owner or admin privileges.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`email\` \| string \| Yes \| The email address of the user to invite to the organization. An invitation email will be automatically sent to this address. \|
\| \`org\_uuid\` \| string \| Yes \| The unique identifier (UUID) of the organization to invite the user to. This is extracted from the organization URI. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Event Invitee

\*\*Slug:\*\* \`CALENDLY\_POST\_INVITEE\`

Tool to create a new Event Invitee with standard notifications, calendar invites, reschedules, and workflows. Use when programmatically scheduling meetings via API. Requires paid Calendly plan (Standard+).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`invitee\` \| object \| Yes \| Details of the invitee being scheduled \|
\| \`location\` \| object \| No \| Meeting location configuration. \|
\| \`tracking\` \| object \| No \| UTM and tracking parameters for marketing attribution. \|
\| \`event\_type\` \| string \| Yes \| URI reference to the event type being scheduled (e.g., 'https://api.calendly.com/event\_types/AAAAAAAAAAAAAAAA') \|
\| \`start\_time\` \| string \| Yes \| Start time of the scheduled event in ISO 8601 UTC format (e.g., '2025-12-16T10:00:00Z') \|
\| \`event\_guests\` \| array \| No \| List of email addresses for additional invitee guests (max 10) \|
\| \`questions\_and\_answers\` \| array \| No \| Custom question responses from the booking form \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove user from organization

\*\*Slug:\*\* \`CALENDLY\_REMOVE\_USER\_FROM\_ORGANIZATION\`

Removes a user (who is not an owner) from an organization by their membership UUID, requiring administrative privileges.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| The UUID of the organization membership to remove. This is the unique identifier from the membership URI (e.g., from 'https://api.calendly.com/organization\_memberships/UUID'). Get membership UUIDs by calling list\_organization\_memberships. Note: Cannot remove organization owners - use this for admin or user roles only. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Revoke a user's organization invitation

\*\*Slug:\*\* \`CALENDLY\_REVOKE\_USER\_S\_ORGANIZATION\_INVITATION\`

Revokes a pending and revokable (not yet accepted or expired) organization invitation using its UUID and the organization's UUID, rendering the invitation link invalid.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uuid\` \| string \| Yes \| The unique identifier of the organization invitation to be revoked. \|
\| \`org\_uuid\` \| string \| Yes \| The unique identifier of the organization. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Event Type

\*\*Slug:\*\* \`CALENDLY\_UPDATE\_EVENT\_TYPE\`

Tool to update an existing one-on-one event type (kind: solo) in Calendly. Use when you need to modify event type settings such as name, duration, location, or description. NOTE: Currently only supports one-on-one event types.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| The event type name that will be displayed to invitees \|
\| \`uuid\` \| string \| Yes \| Unique identifier (UUID) of the event type to update. Can be provided as either the full event type URI (e.g., 'https://api.calendly.com/event\_types/AAAAAAAAAAAAAAAA') or just the UUID portion (e.g., 'AAAAAAAAAAAAAAAA'). Supports both alphanumeric format (e.g., 'GBGBDCAADAEDCRZ2') and standard UUID format (e.g., 'cdeba4c3-5adb-477d-8972-7317836eb40d'). Use LIST\_USER\_S\_EVENT\_TYPES action to retrieve valid event type URIs. \|
\| \`color\` \| string \| No \| Hexadecimal color value for the scheduling page. Must match pattern ^#\[a-f\\d\]{6}$ (e.g., '#fff200') \|
\| \`active\` \| boolean \| No \| Indicates if the event type is active and available for booking \|
\| \`locale\` \| string ("de" \| "en" \| "es" \| "fr" \| "it" \| "nl" \| "pt" \| "uk") \| No \| Locale for the event type's scheduling page language \|
\| \`duration\` \| integer \| No \| Length of sessions in minutes. Must be between 1 and 720 minutes. Should be one of the duration\_options if both are provided. \|
\| \`locations\` \| array \| No \| Configuration information for each possible location where the event can take place \|
\| \`description\` \| string \| No \| The event type description that will be shown on the scheduling page (plain text format) \|
\| \`duration\_options\` \| array \| No \| Alternative duration choices for flexible meetings. Maximum 4 unique values allowed. Each must be between 1 and 720 minutes. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Event Type Availability

\*\*Slug:\*\* \`CALENDLY\_UPDATE\_EVENT\_TYPE\_AVAILABILITY\`

Tool to update an event type availability schedule in Calendly. Use when you need to change the timezone or availability rules for an event type. WARNING: Updating rules will overwrite all existing rules - retrieve existing rules first using GET /event\_type\_availability\_schedules.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\` \| string \| No \| URI of the user associated with the event type. Required when an admin or org owner is updating a specific user's schedule. \|
\| \`event\_type\` \| string \| Yes \| URI of the event type whose availability schedule is to be updated. Must follow the pattern https://api.calendly.com/event\_types/{uuid} and contain '/event\_types/' in the path. Other Calendly URIs (e.g., user\_availability\_schedules, scheduling\_links, users) are NOT valid for this field. \|
\| \`availability\_rule\` \| object \| Yes \| Availability rule configuration containing timezone and rules for when the event type is available. WARNING: Rules will overwrite all existing rules. \|
\| \`availability\_setting\` \| string ("host" \| "all") \| No \| Indicates how availability is determined. Valid values: 'host' or 'all'. Default: 'host'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|
