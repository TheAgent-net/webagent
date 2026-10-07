---
url: https://docs.composio.dev/kb/toolkit/resend
title: Resend
description: 
status: 200
---

# Resend

The universal API for sending emails.

- **Category:** email
- **Auth:** API_KEY
- **Composio-managed OAuth available?** N/A
- **Tools:** 66
- **Triggers:** 0
- **Slug:** `RESEND`
- **Version:** 20260903_00

## Tools

### Add Contact To Segment

**Slug:** `RESEND_ADD_CONTACT_TO_SEGMENT`

Add an existing contact to a segment in Resend. Use when you need to organize contacts into specific segments for targeted communication.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contact_id` | string | Yes | The ID of the contact to add to the segment. |
| `segment_id` | string | Yes | The ID of the segment to add the contact to. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Cancel Email

**Slug:** `RESEND_CANCEL_EMAIL`

Cancel a scheduled email.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The id of the email to cancel. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create API Key

**Slug:** `RESEND_CREATE_API_KEY`

Create a new API key to authenticate communications with Resend. Use when you need to generate a new authentication token for API access.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The API key name. Maximum 50 characters. |
| `domain_id` | string | No | Restrict an API key to send emails only from a specific domain. Only used when the permission is 'sending_access'. |
| `permission` | string ("full_access" | "sending_access") | No | API key permission levels. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Audience

**Slug:** `RESEND_CREATE_AUDIENCE`

Create a list of contacts.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The name of the audience you want to create. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Contact

**Slug:** `RESEND_CREATE_CONTACT`

Create a contact in Resend.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address of the contact. Must be a valid RFC-compliant email address. |
| `lastName` | string | No | The last name of the contact. |
| `firstName` | string | No | The first name of the contact. |
| `audienceId` | string | Yes | The Audience ID. |
| `unsubscribed` | boolean | No | The subscription status. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Contact Property

**Slug:** `RESEND_CREATE_CONTACT_PROPERTY`

Tool to create a new contact property in Resend. Use when you need to define custom fields for contacts.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | string | Yes | The key of the contact property. Must be alphanumeric and underscore only, max 50 characters. Case sensitive. |
| `type` | string ("string" | "number") | Yes | The type of the contact property. |
| `fallbackValue` | string | No | The fallback value for the property. Must match the type of the property. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Contact V2

**Slug:** `RESEND_CREATE_CONTACT_V2`

Tool to create a new contact in Resend. Use when you need to add a contact to Resend without specifying an audience.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address of the contact. |
| `topics` | array | No | List of topic subscriptions with ID and subscription status (opt_in or opt_out). |
| `segments` | array | No | List of segment IDs to enroll the contact in. |
| `last_name` | string | No | The last name of the contact. |
| `first_name` | string | No | The first name of the contact. |
| `properties` | array | No | Custom key-value pairs for the contact. Each property must have a key and value. |
| `unsubscribed` | boolean | No | Contact's global subscription status; when true, the contact opts out of all broadcasts. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Domain

**Slug:** `RESEND_CREATE_DOMAIN`

Create a domain through the Resend Email API. The domain is created in a pending/unverified state and cannot be used for sending emails until DNS verification is completed.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The name of the domain to be created. |
| `region` | string ("us-east-1" | "eu-west-1" | "sa-east-1" | "ap-northeast-1") | No | The region where emails will be sent from. Supported values: 'us-east-1', 'eu-west-1', 'sa-east-1'. Unsupported values cause validation errors. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Draft Broadcast

**Slug:** `RESEND_CREATE_DRAFT_BROADCAST`

Create a broadcast and leave it as an unsent draft. Use when you want to stage a campaign for review; this action never sends or schedules the broadcast, so a separate send step is always required.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | string | Yes | The sender email address. To include a friendly name, use the format 'Your Name <sender@domain.com>'. |
| `html` | string | No | The HTML version of the message. May include contact properties such as {{{contact.first_name&#124;there}}} and the {{{RESEND_UNSUBSCRIBE_URL}}} placeholder. |
| `name` | string | No | The friendly name of the broadcast. Only used for internal reference. |
| `text` | string | No | The plain text version of the message. If omitted, Resend generates it from the HTML. |
| `subject` | string | Yes | The subject line of the email. |
| `reply_to` | array | No | The email addresses to which replies should be sent. |
| `topic_id` | string | No | The ID of the topic the broadcast will be scoped to. |
| `segment_id` | string | Yes | The ID of the segment the broadcast will be addressed to. Audiences are now called segments, so an audience ID is accepted here. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Segment

**Slug:** `RESEND_CREATE_SEGMENT`

Create a new segment for contacts to be added to. Use when you need a fresh list of contacts to target; segments are the modern replacement for audiences.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The name of the segment you want to create. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Template

**Slug:** `RESEND_CREATE_TEMPLATE`

Tool to create a new email template in Resend. Use when you need to define reusable email templates with optional variables.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | string | No | Sender email address. To include a friendly name, use the format 'Your Name <sender@domain.com>'. |
| `html` | string | Yes | The HTML version of the template. Use {{VARIABLE_NAME}} syntax to reference template variables. |
| `name` | string | Yes | The name of the template. |
| `text` | string | No | The plain text version of the template. If omitted, Resend will auto-generate from HTML. |
| `alias` | string | No | The alias of the template. This is an optional identifier that can be used instead of the template ID. |
| `subject` | string | No | Email subject for the template. |
| `reply_to` | string | No | Reply-to email address. For multiple addresses, send as an array of strings. |
| `variables` | array | No | Template variables. Up to 50 variables can be defined per template. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Topic

**Slug:** `RESEND_CREATE_TOPIC`

Tool to create a new topic to segment your audience. Use when you need to create a topic for organizing contacts by interests or preferences.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The topic name. Max length is 50 characters. |
| `visibility` | string ("public" | "private") | No | Topic visibility on the unsubscribe page. |
| `description` | string | No | The topic description. Max length is 200 characters. |
| `defaultSubscription` | string ("opt_in" | "opt_out") | Yes | The default subscription preference for new contacts. Accepts opt_in or opt_out. This value cannot be modified afterwards. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Webhook

**Slug:** `RESEND_CREATE_WEBHOOK`

Tool to create a webhook to receive real-time notifications about email events. Use when you need to set up automated notifications for email status changes.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `events` | array | Yes | Array of event types to subscribe to. Common events include: 'email.sent', 'email.delivered', 'email.delivery_delayed', 'email.complained', 'email.bounced', 'email.opened', 'email.clicked'. Must include at least one event. |
| `endpoint` | string | Yes | The URL where webhook events will be sent. Must be a valid HTTPS endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete API Key

**Slug:** `RESEND_DELETE_API_KEY`

Remove an existing API key from Resend. Use when you need to revoke or delete an API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key_id` | string | Yes | The API key ID to delete. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete Audience

**Slug:** `RESEND_DELETE_AUDIENCE`

Remove an existing audience.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `audience_id` | string | Yes | The ID of the audience to delete. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete Contact

**Slug:** `RESEND_DELETE_CONTACT`

Delete a contact in Resend.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | No | The Contact ID. Either id or email must be provided. |
| `email` | string | No | The Contact email. Either id or email must be provided. |
| `audienceId` | string | Yes | The Audience ID. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete Contact By ID

**Slug:** `RESEND_DELETE_CONTACT_BY_ID`

Tool to remove an existing contact by its ID. Use when you need to delete a contact directly without specifying an audience.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The Contact ID to delete. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete Contact Property

**Slug:** `RESEND_DELETE_CONTACT_PROPERTY`

Remove an existing contact property from Resend.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contact_property_id` | string | Yes | The Contact Property ID. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete Domain

**Slug:** `RESEND_DELETE_DOMAIN`

Delete a domain through the Resend Email API. Deletion is irreversible; ensure no active email traffic or DNS configurations depend on the domain before calling.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain_id` | string | Yes | The id of the domain to delete. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete Segment

**Slug:** `RESEND_DELETE_SEGMENT`

Remove an existing segment. Use when you need to permanently delete a segment by its ID.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `segment_id` | string | Yes | The ID of the segment to delete. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete Template

**Slug:** `RESEND_DELETE_TEMPLATE`

Remove an existing template. Use this action when you need to delete a template from Resend.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `template_id` | string | Yes | The Template ID or alias. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete Topic

**Slug:** `RESEND_DELETE_TOPIC`

Tool to remove an existing topic in Resend. Use when you need to delete a topic.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The Topic ID. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete Webhook

**Slug:** `RESEND_DELETE_WEBHOOK`

Remove an existing webhook. Use this to delete a webhook configuration when you no longer need to receive event notifications at that endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `webhook_id` | string | Yes | The Webhook ID. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Duplicate Template

**Slug:** `RESEND_DUPLICATE_TEMPLATE`

Duplicate an existing template through the Resend Email API. Use when you need to create a copy of an existing template.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `template_id` | string | Yes | The Template ID or alias to duplicate. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Broadcast

**Slug:** `RESEND_GET_BROADCAST`

Retrieve a single broadcast by its ID. Use when you need to read back a broadcast's content, recipient segment, schedule and status before sending it.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `broadcast_id` | string | Yes | The ID of the broadcast to retrieve. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Contact

**Slug:** `RESEND_GET_CONTACT`

Tool to retrieve a single contact from Resend by ID or email. Use when you need to get details of a specific contact using the global contacts endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contact_id` | string | Yes | The Contact ID or email address to retrieve. Can be either a UUID (e.g., 'e169aa45-1ecf-4183-9955-b1499d5701d3') or an email address (e.g., 'user@example.com'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Contact Property

**Slug:** `RESEND_GET_CONTACT_PROPERTY`

Tool to retrieve a single contact property from Resend. Use when you need to get details about a specific contact property by its ID.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contact_property_id` | string | Yes | The Contact Property ID. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Email Attachment

**Slug:** `RESEND_GET_EMAIL_ATTACHMENT`

Retrieve a single attachment from a sent email. Use when you need to access attachment metadata and download URL.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email_id` | string | Yes | The ID of the email. |
| `attachment_id` | string | Yes | The ID of the attachment. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Segment

**Slug:** `RESEND_GET_SEGMENT`

Retrieve a single segment by its ID. Use when you need to get detailed information about a specific segment.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `segment_id` | string | Yes | The ID of the segment to retrieve. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Template

**Slug:** `RESEND_GET_TEMPLATE`

Retrieve a single template by ID or alias from Resend. Use when you need to view template details.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `template_id` | string | Yes | The Template ID or alias to retrieve. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Topic

**Slug:** `RESEND_GET_TOPIC`

Tool to retrieve a single topic by its ID in Resend. Use when you need to fetch details of a specific topic.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The Topic ID. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Webhook

**Slug:** `RESEND_GET_WEBHOOK`

Retrieve a single webhook for the authenticated user. Use this to get details about a specific webhook configuration including its endpoint, subscribed events, and signing secret.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `webhook_id` | string | Yes | The Webhook ID. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List All Contacts

**Slug:** `RESEND_LIST_ALL_CONTACTS`

Tool to retrieve a list of all contacts from Resend. Use when you need to fetch contacts across all audiences with optional pagination, or only the contacts of a single segment by passing segment_id.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Pagination cursor - retrieves contacts after this ID (the ID itself is excluded). Cannot be used with 'before' parameter. |
| `limit` | integer | No | Number of contacts to retrieve per request. Minimum 1, maximum 100. If not provided, defaults to 20. |
| `before` | string | No | Pagination cursor - retrieves contacts before this ID (the ID itself is excluded). Cannot be used with 'after' parameter. |
| `segment_id` | string | No | Optional segment ID to filter by. When provided, only contacts belonging to this segment are returned; otherwise contacts across all segments are returned. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List API Keys

**Slug:** `RESEND_LIST_API_KEYS`

Tool to retrieve a list of API keys for the authenticated user. Use when you need to view all API keys associated with the account, including pagination support for large result sets.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | The ID after which we'll retrieve more API keys (for pagination). This ID will not be included in the returned list. Cannot be used with the 'before' parameter. |
| `limit` | integer | No | Number of API keys to retrieve. If omitted, all keys are returned in a single response. |
| `before` | string | No | The ID before which we'll retrieve more API keys (for pagination). This ID will not be included in the returned list. Cannot be used with the 'after' parameter. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Audiences

**Slug:** `RESEND_LIST_AUDIENCES`

List all audiences.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Cursor ID for forward pagination. |
| `limit` | integer | No | Maximum number of results to return. Max: 100. |
| `before` | string | No | Cursor ID for backward pagination. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Broadcasts

**Slug:** `RESEND_LIST_BROADCASTS`

Tool to retrieve a list of broadcasts. Use when you need to fetch all broadcasts or paginate through them.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | The ID after which we'll retrieve more broadcasts (for pagination). This ID will not be included in the returned list. Cannot be used with the before parameter. |
| `limit` | integer | No | Number of broadcasts to retrieve. If not provided, all broadcasts will be returned. |
| `before` | string | No | The ID before which we'll retrieve more broadcasts (for pagination). This ID will not be included in the returned list. Cannot be used with the after parameter. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Contact Properties

**Slug:** `RESEND_LIST_CONTACT_PROPERTIES`

Tool to retrieve a list of contact properties from Resend. Use when you need to view available contact property definitions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Return items after this cursor. |
| `limit` | integer | No | Number of items to return. |
| `before` | string | No | Return items before this cursor. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Contacts

**Slug:** `RESEND_LIST_CONTACTS`

List contacts in Resend.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Cursor ID for forward pagination. |
| `limit` | integer | No | Maximum number of results to return. Max: 100. |
| `before` | string | No | Cursor ID for backward pagination. |
| `audienceId` | string | Yes | The Audience ID. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Contact Segments

**Slug:** `RESEND_LIST_CONTACT_SEGMENTS`

Retrieve a list of segments that a contact is part of. Use when you need to determine which segments a specific contact belongs to.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The ID of the contact. |
| `after` | string | No | Cursor ID for forward pagination. |
| `limit` | integer | No | Maximum number of results to return. Max: 100. |
| `before` | string | No | Cursor ID for backward pagination. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Contact Topics

**Slug:** `RESEND_LIST_CONTACT_TOPICS`

Retrieve a list of topic subscriptions for a contact in Resend. Use when you need to check which topics a specific contact is subscribed to.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Cursor ID for forward pagination. |
| `limit` | integer | No | Maximum number of results to return. Max: 100. |
| `before` | string | No | Cursor ID for backward pagination. |
| `contact_id` | string | Yes | The ID of the contact. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Domains

**Slug:** `RESEND_LIST_DOMAINS`

List all domains. Use the returned domain IDs as inputs for tools like RESEND_VERIFY_DOMAIN that require a domain_id.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Email Attachments

**Slug:** `RESEND_LIST_EMAIL_ATTACHMENTS`

Tool to retrieve a list of attachments from a sent email. Use when you need to get information about files attached to an email sent via Resend.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Pagination cursor to fetch results after this attachment ID. Cannot be used with 'before'. |
| `limit` | integer | No | Maximum number of attachments to return. Use for pagination. |
| `before` | string | No | Pagination cursor to fetch results before this attachment ID. Cannot be used with 'after'. |
| `email_id` | string | Yes | The ID of the email to retrieve attachments from. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Emails

**Slug:** `RESEND_LIST_EMAILS`

Tool to retrieve a list of emails sent by your team. Use when you need to fetch outbound emails from your account. Supports pagination with limit, after, and before parameters.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Pagination cursor to fetch results after this email ID. Cannot be used with 'before'. |
| `limit` | integer | No | Maximum number of emails to return. Default 20, max 100, min 1. |
| `before` | string | No | Pagination cursor to fetch results before this email ID. Cannot be used with 'after'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Received Emails

**Slug:** `RESEND_LIST_RECEIVED_EMAILS`

Tool to retrieve a list of received emails for the authenticated user. Use when you need to fetch incoming emails from the receiving endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Pagination cursor to fetch results after this email ID. Cannot be used with 'before'. |
| `limit` | integer | No | Maximum number of received emails to return. |
| `before` | string | No | Pagination cursor to fetch results before this email ID. Cannot be used with 'after'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Segments

**Slug:** `RESEND_LIST_SEGMENTS`

Tool to retrieve a list of segments from Resend. Use when you need to view all available segments for audience management.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Return items after this cursor for pagination. |
| `limit` | integer | No | Number of items to return. |
| `before` | string | No | Return items before this cursor for pagination. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Templates

**Slug:** `RESEND_LIST_TEMPLATES`

Tool to retrieve a list of templates from Resend. Use when you need to get all available templates with optional pagination support.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Return items after this cursor. |
| `limit` | integer | No | Number of items to return. |
| `before` | string | No | Return items before this cursor. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Topics

**Slug:** `RESEND_LIST_TOPICS`

Tool to retrieve a list of topics for the authenticated user. Use when you need to fetch available topics with optional pagination support.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Return items after this cursor. |
| `limit` | integer | No | Number of items to return. |
| `before` | string | No | Return items before this cursor. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Webhooks

**Slug:** `RESEND_LIST_WEBHOOKS`

Retrieve a list of webhooks for the authenticated user. Use this to view all configured webhooks with their endpoints, event types, and status.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Pagination cursor to fetch results after this webhook ID. Cannot be used with 'before'. |
| `limit` | integer | No | Maximum number of webhooks to return. |
| `before` | string | No | Pagination cursor to fetch results before this webhook ID. Cannot be used with 'after'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Publish Template

**Slug:** `RESEND_PUBLISH_TEMPLATE`

Publish a template through the Resend Email API. Use when you need to make a template publicly available.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `template_id` | string | Yes | The Template ID or alias to publish. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Remove Contact From Segment

**Slug:** `RESEND_REMOVE_CONTACT_FROM_SEGMENT`

Remove an existing contact from a segment. Use when you need to disassociate a contact from a specific segment.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contact_id` | string | Yes | The ID of the contact to remove from the segment. |
| `segment_id` | string | Yes | The ID of the segment to remove the contact from. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve Audience

**Slug:** `RESEND_RETRIEVE_AUDIENCE`

Retrieve a single audience.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `audience_id` | string | Yes | The ID of the audience to retrieve. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve Contact

**Slug:** `RESEND_RETRIEVE_CONTACT`

Retrieve a contact in Resend.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The Contact ID. |
| `audienceId` | string | Yes | The Audience ID. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve Domain

**Slug:** `RESEND_RETRIEVE_DOMAIN`

Retrieve a single domain.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain_id` | string | Yes | The id of the domain to retrieve. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve Email

**Slug:** `RESEND_RETRIEVE_EMAIL`

Retrieve a single email.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email_id` | string | Yes | The id of the email to retrieve. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Send Batch Emails

**Slug:** `RESEND_SEND_BATCH_EMAILS`

Trigger up to 100 batch emails at once. Use when you need to send multiple emails in a single API request.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `emails` | array | Yes | List of email items to send in batch. Maximum 100 emails per batch. |
| `Idempotency-Key` | string | No | A unique identifier for the request to ensure emails are only sent once. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Send Email

**Slug:** `RESEND_SEND_EMAIL`

Send an email using Resend. Confirm recipients and content with the user before invoking — sends are irreversible. All recipients must be listed explicitly via `to`, `cc`, or `bcc`; audience-based sending is unsupported. Render HTML or plain text externally before passing via `html` or `text`.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cc` | string | No | Cc recipient email address. For multiple addresses, send as an array of strings. |
| `to` | string | Yes | Recipient email address. For multiple addresses, send as an array of strings. Max 50. |
| `bcc` | string | No | Bcc recipient email address. For multiple addresses, send as an array of strings. Use `bcc` instead of `to` when sending to multiple recipients to prevent them from seeing each other's addresses. |
| `from` | string | Yes | Sender email address. To include a name, use the format 'Your Name <sender@domain.com>'. |
| `html` | string | No | The HTML version of the message. At least one of 'html' or 'text' must be provided. |
| `text` | string | No | The plain text version of the message. At least one of 'html' or 'text' must be provided. |
| `react` | string | No | The React version of the message. Only available in the Node.js SDK. |
| `headers` | object | No | Custom headers to add to the email. Must be a dictionary/object with key-value pairs (e.g., {'X-Custom-Header': 'value'}). Pass None or omit to exclude. |
| `subject` | string | Yes | Email subject. |
| `reply_to` | string | No | Reply-to email address. For multiple addresses, send as an array of strings. |
| `scheduled_at` | string | No | Schedule email to be sent later. The date should be in ISO 8601 format (e.g., '2024-08-05T11:52:01.858Z'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Broadcast

**Slug:** `RESEND_UPDATE_BROADCAST`

Update an existing broadcast in Resend. Use when you need to modify broadcast details like name, subject, content, or recipients.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The Broadcast ID to update. |
| `from` | string | No | The email address of the sender. |
| `html` | string | No | The HTML version of the message. |
| `name` | string | No | Name of the broadcast. |
| `text` | string | No | The plain text version of the message. |
| `subject` | string | No | The subject line of the email. |
| `reply_to` | array | No | The email addresses to which replies should be sent. |
| `segment_id` | string | No | Unique identifier of the segment this broadcast will be sent to. |
| `audience_id` | string | No | Unique identifier of the audience this broadcast will be sent to. |
| `preview_text` | string | No | The preview text of the email. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Contact

**Slug:** `RESEND_UPDATE_CONTACT`

Tool to update an existing contact in Resend by ID or email. Use when you need to modify contact details such as name or subscription status.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `last_name` | string | No | The last name of the contact. |
| `first_name` | string | No | The first name of the contact. |
| `id_or_email` | string | Yes | The Contact ID or email address to update. Can be either the unique contact ID (UUID format) or the contact's email address. |
| `unsubscribed` | boolean | No | The subscription status of the contact. When true, unsubscribes the contact from all broadcasts. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Contact Property

**Slug:** `RESEND_UPDATE_CONTACT_PROPERTY`

Update an existing contact property in Resend. Only the fallback_value can be updated; the key and type fields cannot be changed after creation.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fallback_value` | string | No | The default value to use when the property is not set for a contact. Must match the type specified in the contact property's type field. Can be a string or number. |
| `contact_property_id` | string | Yes | The Contact Property ID to update. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Domain

**Slug:** `RESEND_UPDATE_DOMAIN`

Update an existing domain.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tls` | string ("opportunistic" | "enforced") | No | TLS setting for email communication. 'opportunistic': Always attempts to make a secure connection. 'enforced': Requires TLS for email communication. |
| `domain_id` | string | Yes | The id of the domain to update. |
| `open_tracking` | boolean | No | Track the open rate of each email. |
| `click_tracking` | boolean | No | Track clicks within the body of each HTML email. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Draft Broadcast

**Slug:** `RESEND_UPDATE_DRAFT_BROADCAST`

Update a broadcast that is still an unsent draft. Use when you need to revise a staged campaign; the broadcast is read back first and the update is refused unless its status is 'draft' and it has no scheduled send time.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | string | No | The sender email address. To include a friendly name, use the format 'Your Name <sender@domain.com>'. |
| `html` | string | No | The HTML version of the message. |
| `name` | string | No | The friendly name of the broadcast. Only used for internal reference. |
| `text` | string | No | The plain text version of the message. |
| `subject` | string | No | The subject line of the email. |
| `reply_to` | array | No | The email addresses to which replies should be sent. |
| `topic_id` | string | No | The ID of the topic the broadcast will be scoped to. |
| `segment_id` | string | No | The ID of the segment the broadcast will be addressed to. |
| `broadcast_id` | string | Yes | The ID of the draft broadcast to update. |
| `preview_text` | string | No | The preview text shown by email clients. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Email

**Slug:** `RESEND_UPDATE_EMAIL`

Update a scheduled email.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The ID of the email to update. |
| `scheduled_at` | string | Yes | Schedule email to be sent later. The date should be in ISO 8601 format (e.g: 2024-08-05T11:52:01.858Z). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Template

**Slug:** `RESEND_UPDATE_TEMPLATE`

Tool to update an existing email template in Resend. Use when you need to modify template properties such as name, subject, HTML content, or variables.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The Template ID or alias to update. |
| `from` | string | No | Sender email address. To include a friendly name, use the format "Your Name <sender@domain.com>". |
| `html` | string | No | The HTML version of the template. |
| `name` | string | No | The name of the template. |
| `text` | string | No | The plain text version of the template. |
| `alias` | string | No | The alias of the template. |
| `subject` | string | No | Email subject. |
| `reply_to` | array | No | Reply-to email addresses. |
| `variables` | array | No | Template variables with their types and optional fallback values. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Topic

**Slug:** `RESEND_UPDATE_TOPIC`

Tool to update an existing topic in Resend. Use when you need to modify the name of a topic.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The Topic ID to update. |
| `name` | string | Yes | The name of the topic to update. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Webhook

**Slug:** `RESEND_UPDATE_WEBHOOK`

Tool to update an existing webhook configuration. Use when you need to modify the endpoint URL, change event subscriptions, or enable/disable a webhook.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `events` | array | No | Array of event types to subscribe to. Must contain at least one event if provided. |
| `status` | string ("enabled" | "disabled") | No | The status of the webhook. Set to 'enabled' to activate or 'disabled' to deactivate. |
| `endpoint` | string | No | The URL where webhook events will be sent. |
| `webhook_id` | string | Yes | The ID of the webhook to update. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Verify Domain

**Slug:** `RESEND_VERIFY_DOMAIN`

Verify a domain through the Resend Email API. DNS records must fully propagate before verification succeeds; avoid immediate retries after DNS setup.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain_id` | string | Yes | The id of the domain to verify. Must match an existing registered domain; use RESEND_LIST_DOMAINS to retrieve valid IDs. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |
