---
url: https://docs.composio.dev/kb/toolkit/sendgrid
title: SendGrid
description: 
status: 200
---

# SendGrid

SendGrid is a cloud-based email delivery platform providing transactional and marketing email services, with APIs for integration, analytics, and scalability

- **Category:** transactional email
- **Auth:** API_KEY
- **Composio-managed OAuth available?** N/A
- **Tools:** 364
- **Triggers:** 0
- **Slug:** `SENDGRID`
- **Version:** 20260813_00

## Tools

### Activate template version

**Slug:** `SENDGRID_ACTIVATE_TEMPLATE_VERSION`

Activates a specific version of a transactional template, making it the default version used when sending emails. Only one version can be active at a time per template. When you activate a version, any previously active version becomes inactive. The activated version's content (HTML, plain text, subject) will be used for all emails sent using this template until a different version is activated. Use this endpoint to switch between template versions for A/B testing, rollbacks, or deploying new email designs.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `version_id` | string | Yes | The UUID of the template version to activate. This version will become the active version used when sending emails with this template. |
| `template_id` | string | Yes | The ID of the transactional template. For dynamic templates, this typically starts with 'd-' followed by a UUID (e.g., 'd-d3042f1547dd4fceb765aadfc07c24f8'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Add a batch of ips to an ip pool

**Slug:** `SENDGRID_ADD_A_BATCH_OF_IPS_TO_AN_IP_POOL`

Adds a batch of IP addresses to a specified IP Pool in SendGrid. This operation appends multiple IPs to an existing IP Pool. All IP assignments must succeed for the operation to complete - if any single IP assignment fails, the entire operation will return an error. Requirements: - A SendGrid account with dedicated IP addresses (Pro or Premier plan) - API key with 'IP Address Management' permissions - Valid pool ID and IP addresses that exist in your SendGrid account - Each IP Pool can have a maximum of 100 IPs Note: This endpoint is part of the IP Address Management API which is currently in public beta.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ips` | array | Yes | An array of IP addresses to assign to the specified IP Pool. Each IP should be in standard IPv4 format (e.g., '192.168.1.1'). All IP assignments must succeed for the operation to complete. The IPs must exist in your SendGrid account and not already be assigned to this pool. |
| `poolid` | string | Yes | The unique identifier for the IP Pool to add IPs to. You can obtain pool IDs using the 'Get All IP Pools' or 'Get All IP Pools That Have Associated IPs' endpoints. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Add an ip address to a pool

**Slug:** `SENDGRID_ADD_AN_IP_ADDRESS_TO_A_POOL`

Adds a dedicated IP address to an IP pool in your SendGrid account. **Prerequisites:** - You must have a SendGrid Pro or Premier plan with dedicated IP addresses - The IP address must be activated in your SendGrid account (Settings > IP Addresses > Edit > "Allow my account to send mail using this IP address") - A reverse DNS record must be set up for the IP address - The IP pool must already exist (create one first if needed) **Key Features:** - An IP address can be added to multiple pools simultaneously - Changes may take up to 60 seconds to propagate - Returns the IP's warmup status and all pools it's assigned to **Common Use Cases:** - Segregate transactional and marketing email to different IP pools - Organize IPs by brand, customer, or email type for reputation management - Set up dedicated sending infrastructure for high-volume senders

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip` | string | Yes | The IP address to add to the pool (e.g., '192.0.2.1'). Must be a dedicated IP address that has been activated in your SendGrid account. The IP must have a reverse DNS record configured. Use RETRIEVE_ALL_IP_ADDRESSES or GET_DETAILS_FOR_AN_IP_ADDRESS to find available IPs. |
| `pool_name` | string | Yes | The name of the IP pool to add the IP address to. Must be an existing pool name. If the name contains spaces, they must be URL encoded (e.g., 'Test Pool' becomes 'Test%20Pool'). Use CREATE_AN_IP_POOL action if you need to create a new pool first. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Add an ip to an authenticated domain

**Slug:** `SENDGRID_ADD_AN_IP_TO_AN_AUTHENTICATED_DOMAIN`

Add an IP address to an authenticated domain for custom SPF configuration. This endpoint associates a dedicated IP address with an authenticated domain, which is useful for manually specifying IPs in your custom SPF record. The authenticated domain (formerly called 'domain whitelabel') allows you to remove the 'via' or 'sent on behalf of' message from your emails. **Prerequisites:** - The domain must already be authenticated (created via Authenticate a Domain endpoint) - The IP must be a dedicated IP address belonging to your SendGrid account - Your API key must have 'whitelabel.update' and appropriate IP permissions **Returns:** The updated authenticated domain object with the IP added to the 'ips' array.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The numeric ID of the authenticated domain. You can retrieve this ID by listing all authenticated domains using the List All Authenticated Domains endpoint. |
| `ip` | string | Yes | The IP address to associate with this domain for custom SPF configuration. Must be a valid dedicated IP address that belongs to your SendGrid account. Example: '192.168.1.1'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Add a single recipient to a list

**Slug:** `SENDGRID_ADD_A_SINGLE_RECIPIENT_TO_A_LIST`

Adds a single recipient to a contact list in SendGrid's Legacy Contact Database. IMPORTANT: This uses the deprecated Legacy API (/v3/contactdb/). Many accounts no longer have access and will receive 403 errors. Use PUT /v3/marketing/contacts instead. Prerequisites: The recipient and list must already exist in your database. Parameters: - list_id: Numeric list ID from 'create_a_list' or 'retrieve_all_lists' - recipient_id: Base64-encoded lowercase email (e.g., 'test@example.com' → 'dGVzdEBleGFtcGxlLmNvbQ==') Returns: Empty dict {} on success (HTTP 201), or error details with status_code, message, and hint for troubleshooting.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `list_id` | integer | Yes | The numeric ID of the contact list to add the recipient to. This must be an existing list in your SendGrid account. To get available list IDs, use the 'create_a_list' action to create a new list (which returns the list ID) or 'retrieve_all_lists' to see existing lists. Example: 29985569 |
| `recipient_id` | string | Yes | The unique identifier of the recipient to add to the list. This is the URL-safe Base64-encoded lowercase email address. The recipient must already exist in your contact database. To encode an email: (1) convert to lowercase, (2) Base64 encode. Examples: 'test@example.com' → 'dGVzdEBleGFtcGxlLmNvbQ==', 'john.doe@example.com' → 'am9obi5kb2VAZXhhbXBsZS5jb20='. You can use online Base64 encoders or the 'search_recipients' action to find existing recipient IDs. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Add a twilio sendgrid ip address

**Slug:** `SENDGRID_ADD_A_TWILIO_SEND_GRID_IP_ADDRESS`

Provisions a new Twilio SendGrid IP address to your account. This endpoint adds (purchases) a dedicated IP address to your SendGrid account. You can optionally: - Enable automatic warmup to gradually increase sending volume - Assign the IP to the parent account for sending email - Assign up to 100 Subusers to the IP address at creation - Specify the region (global/US or EU) for the IP address Important Requirements: - Requires a Pro or Premier SendGrid account (not available for Free/Essential plans) - Requires API key with Billing permissions (mutually exclusive from other permissions) - Additional IPs cost $30/month per IP - Parent must be assigned before the IP can be added to IP pools or used for sending Note: This is a billing operation that will incur charges on your SendGrid account.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `region` | string ("global" | "eu") | No | Optional. The region where the IP address should be provisioned. Use 'global' for US/global region or 'eu' for European Union region. If not specified, defaults to global. |
| `subusers` | array | No | Optional. Array of Subuser usernames (not IDs) to assign to this IP address. Maximum 100 subusers can be assigned at creation. Example: ['subuser1', 'subuser2'] |
| `include_region` | boolean | No | When set to True, includes the IP address's region information in the response. Defaults to False. |
| `is_auto_warmup` | boolean | Yes | Required. Set to True to enable automatic IP warmup, which gradually increases sending volume to establish sender reputation. Set to False to manually manage warmup. Recommended: True for new IPs to avoid deliverability issues. |
| `is_parent_assigned` | boolean | Yes | Required. Set to True to allow the parent account to send email from this IP address. The parent MUST be assigned before the IP can send mail or be added to IP pools. Recommended: True unless you only want subusers to use this IP. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Add ips

**Slug:** `SENDGRID_ADD_IPS`

Add dedicated IP addresses to your SendGrid account. This endpoint provisions new dedicated IP addresses for sending emails. Dedicated IPs give you full control over your sender reputation and are recommended for high-volume senders. Note: This endpoint requires the 'ips.create' API key scope and may require an appropriate SendGrid plan that supports dedicated IPs.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `count` | integer | Yes | The number of dedicated IP addresses to add to the account. Must be a positive integer. |
| `warmup` | boolean | No | Set to true to automatically warmup the IPs being added. IP warmup gradually increases sending volume to build a good sender reputation. Recommended for new IPs. |
| `subusers` | array | No | List of subuser usernames to be assigned the new send IP addresses. Each subuser will be able to send emails from the newly added IPs. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Add one or more ips to the allow list

**Slug:** `SENDGRID_ADD_ONE_OR_MORE_IPS_TO_THE_ALLOW_LIST`

Adds one or more IPv4 addresses to your SendGrid account's IP access management allow list. Once enabled, only requests from these IPs can access SendGrid UI, API, and SMTP relay. Each IP is assigned a unique ID for future removal. Supports single IPs, CIDR notation (e.g., '192.168.1.0/24'), and wildcards (e.g., '192.*.*.*'). SendGrid limits the total allowed IPs to 1000. Note: IPv6 addresses are not supported. Warning: Be careful not to add IPs that exclude your own, as this could block your access.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ips` | array | Yes | An array of IP address entries to add to the allow list. Each entry must contain an 'ip' field with the IP address. Example: [{'ip': '192.168.1.1'}, {'ip': '10.0.0.0/24'}]. SendGrid limits the total allowed IPs to 1000. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Add or update a contact

**Slug:** `SENDGRID_ADD_OR_UPDATE_A_CONTACT`

Adds or updates contacts in SendGrid Marketing Campaigns. This is an asynchronous operation that queues contacts for processing. Returns a job_id to track the import status. Contacts are matched by identifier (email, phone_number_id, external_id, or anonymous_id) - existing contacts are updated, new ones are created. Email addresses are automatically lowercased. Max 30,000 contacts or 6MB per request.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contacts` | array | Yes | An array of contact objects to add or update (max 30,000 contacts or 6MB). Each contact MUST include at least one identifier: `email`, `phone_number_id`, `external_id`, or `anonymous_id`. Common optional fields include: `first_name`, `last_name`, `address_line_1`, `address_line_2`, `city`, `state_province_region`, `postal_code`, `country`. Custom fields can also be included if pre-defined in SendGrid. Example: [{"email": "user@example.com", "first_name": "John", "last_name": "Doe"}] |
| `list_ids` | array | No | Optional array of SendGrid List IDs (UUIDs) to add the contacts to. Use the 'Get all lists' action to retrieve available list IDs. Example: ["ca7a3796-e8a8-4029-9ccb-df8937940562"] |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Add suppressions to a suppression group

**Slug:** `SENDGRID_ADD_SUPPRESSIONS_TO_A_SUPPRESSION_GROUP`

**This endpoint allows you to add email addresses to an unsubscribe group.** If you attempt to add suppressions to a group that has been deleted or does not exist, the suppressions will be added to the global suppressions list.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `group_id` | string | Yes | The id of the unsubscribe group that you are adding suppressions to. |
| `recipient_emails` | array | Yes | The list of email addresses to add to the suppression group. These addresses will be prevented from receiving emails associated with this unsubscribe group. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Add recipient addresses to the global suppression group

**Slug:** `SENDGRID_ADD_TO_GLOBAL_SUPPRESSIONS_GROUP`

Adds one or more email addresses to the global suppression group. Email addresses added to this group will no longer receive any emails from your SendGrid account. This is useful for managing recipients who have opted out of all communications or for ensuring certain addresses never receive emails. The action is idempotent - adding an email that is already suppressed will succeed without error. Returns the list of email addresses that were processed.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `recipient_emails` | array | Yes | A list of valid email addresses to add to the global suppression group. Email addresses in this list will no longer receive any emails from your SendGrid account. At least one email address is required. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Approve access request

**Slug:** `SENDGRID_APPROVE_ACCESS_REQUEST`

**This endpoint allows you to approve an access attempt.** **Note:** Only teammate admins may approve another teammate’s access request.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `request_id` | string | Yes | The ID of the request that you want to approve. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Assign a batch of subusers to an ip

**Slug:** `SENDGRID_ASSIGN_A_BATCH_OF_SUBUSERS_TO_AN_IP`

Assigns multiple subusers to a specified IP address in a single operation. All subuser assignments must succeed; if any assignment fails, the entire operation returns an error. Requires IP Address Management permissions. Note: This API is part of the IP Address Management API which is in public beta.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip` | string | Yes | The IP address to assign subusers to. Must be a valid IPv4 address that belongs to your SendGrid account (e.g., '149.72.123.45').  |
| `subusers` | array | Yes | An array of subuser usernames to be assigned to the specified IP address. All subuser assignments must succeed; if any assignment fails, the entire operation will return an error. Example: ['subuser1', 'subuser2'].  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Associate a branded link with a subuser

**Slug:** `SENDGRID_ASSOCIATE_A_BRANDED_LINK_WITH_A_SUBUSER`

Associate a branded link with a subuser account for email link tracking. This allows a subuser to use the parent account's branded link (link branding/ whitelabel) for link tracking in their emails, ensuring tracked links appear to come from your domain rather than SendGrid's domain. Prerequisites: - A validated branded link must exist in the parent account - The subuser account must already exist - API key must have link branding and subuser management permissions - Requires SendGrid Pro plan or higher with subuser feature enabled Notes: - A subuser can only have one branded link associated at a time - If the subuser already has a branded link, it will be replaced - The association does not transfer ownership; parent maintains control

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `link_id` | integer | Yes | The ID of the branded link you want to associate with the subuser. You can obtain this ID from the 'Retrieve all branded links' endpoint or from the response when creating a branded link. The branded link must be owned by the parent account. |
| `username` | string | Yes | The username of the subuser account that you want to associate the branded link with. This must be an existing subuser in your SendGrid account. Once associated, the subuser will use this branded link for all link tracking in their emails. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Associate an authenticated domain with a given user

**Slug:** `SENDGRID_ASSOCIATE_AN_AUTHENTICATED_DOMAIN_WITH_A_GIVEN_USER`

Associate an authenticated domain with a subuser, allowing the subuser to send emails using the parent account's domain authentication. The parent account must first authenticate and validate the domain before associating it. Prerequisites: - The domain must be authenticated by the parent account - The subuser must exist and belong to the parent account - Use 'list_all_authenticated_domains' to find available domain IDs - Use 'list_all_subusers' to find valid subuser usernames Note: The subuser will default to using the assigned domain but cannot see or modify it. If the subuser authenticates their own domain, it will overwrite the assigned domain. To associate multiple domains with a subuser, use the 'bind_authenticated_domains_to_user' action instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | The username of the subuser to associate with the authenticated domain. This must be a valid subuser username belonging to the parent account. Use 'list_all_subusers' to obtain a list of available subuser usernames. |
| `domain_id` | integer | Yes | The numeric ID of an authenticated domain to associate with the subuser. Obtain this ID from the 'list_all_authenticated_domains' action or the 'retrieve_an_authenticated_domain' action. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Authenticate a domain

**Slug:** `SENDGRID_AUTHENTICATE_A_DOMAIN`

The endpoint enables domain authentication for users or subusers, offering two methods—'username' parameter for visibility and modification, or the Association workflow for a fixed, non-editable domain assignment.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ips` | array | No | The IP addresses that will be included in the custom SPF record for this authenticated domain.  |
| `domain` | string | Yes | Domain being authenticated. |
| `region` | string ("global" | "eu") | No | The region where the domain will be authenticated. Use 'global' for worldwide or 'eu' for European Union regions. Defaults to 'global' if not specified. |
| `default` | boolean | No | Whether to use this authenticated domain as the fallback if no authenticated domains match the sender"s domain.  |
| `username` | string | No | The username associated with this domain. |
| `subdomain` | string | No | The subdomain to use for this authenticated domain. |
| `custom_spf` | boolean | No | Specify whether to use a custom SPF or allow SendGrid to manage your SPF. This option is only available to authenticated domains set up for manual security.  |
| `automatic_security` | boolean | No | Whether to allow SendGrid to manage your SPF records, DKIM keys, and DKIM key rotation.  |
| `custom_dkim_selector` | string | No | Add a custom DKIM selector. Accepts three letters or numbers. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Authenticate an account with single sign on

**Slug:** `SENDGRID_AUTHENTICATE_AN_ACCOUNT_WITH_SINGLE_SIGN_ON`

Generates a one-time SSO authentication URL for logging into a customer's Twilio SendGrid account. IMPORTANT: This endpoint is only available to Twilio SendGrid reseller partners with a formal partnership agreement. Standard SendGrid accounts will receive a 403 Forbidden error. The returned redirect_url contains a one-time authorization code that: - Is valid for 60 seconds after generation - Can only be used once for security (prevents replay attacks) - Authenticates the user as an Admin Teammate with full account management permissions - Only works for the base Admin Teammate (not for additional teammates or subusers) Use Case: This is typically used by partner platforms to provide seamless SSO access for their customers into their respective SendGrid accounts. Prerequisites: - Partner-level API credentials with appropriate scopes - IP whitelisting configured for your partner account - Valid accountID from a customer account under your partner organization

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accountID` | string | Yes | The unique identifier of the Twilio SendGrid account to authenticate. This ID can be obtained from the Get All Accounts endpoint (/v3/partners/accounts). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Bind authenticated domains to user

**Slug:** `SENDGRID_BIND_AUTHENTICATED_DOMAINS_TO_USER`

Associates an additional authenticated domain with a subuser. A subuser can have up to 5 authenticated domains linked to it. This endpoint is used to add domains beyond the first one (use 'Associate an authenticated domain with a given user' for the initial association). The parent account must first authenticate and validate the domain before associating it with a subuser. Requires Subuser Management permissions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | The username of the subuser to associate with the authenticated domain. A subuser can have up to 5 authenticated domains associated with it. |
| `domain_id` | integer | Yes | The numeric ID of the authenticated domain to associate with the subuser. Retrieve this ID using the List All Authenticated Domains endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Bulk delete single sends

**Slug:** `SENDGRID_BULK_DELETE_SINGLE_SENDS`

Permanently deletes multiple Single Sends in a single operation by providing their IDs. You can delete up to 1000 Single Sends per request. Single Send IDs can be retrieved using the 'Get all single sends' action or from the SendGrid Marketing Campaigns UI. WARNING: This operation is irreversible - deleted Single Sends cannot be recovered. All associated data including statistics, configurations, and scheduled sends will be permanently removed. Returns 204 No Content on successful deletion with an empty response body.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | array | Yes | A list of Single Send IDs to delete (maximum 1000 IDs per request). You can retrieve Single Send IDs by using the 'Get all single sends' action or from the SendGrid Marketing Campaigns UI. Each ID must be a valid UUID string. This field is required and cannot be empty. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Cancel or pause a scheduled send

**Slug:** `SENDGRID_CANCEL_OR_PAUSE_A_SCHEDULED_SEND`

Cancel or pause a group of scheduled email sends by their batch_id. Use 'pause' to temporarily hold sends (resumable via 'update_a_scheduled_send' or deletable via 'delete_a_cancellation_or_pause_from_a_scheduled_send') or 'cancel' to permanently discard them. Limits: max 10 paused/cancelled batches at a time; must be set at least 10 minutes before the scheduled send_at time. Returns a 400 error if the batch already has a status set or limits are exceeded.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string ("pause" | "cancel") | Yes | The action to take: 'pause' to temporarily hold scheduled sends (they can be resumed later) or 'cancel' to permanently discard them when send time arrives. Paused sends expire after 72 hours past their scheduled time. |
| `batch_id` | string | Yes | The batch ID that identifies the scheduled mail sends to cancel or pause. Obtain this ID by first calling the 'create_a_batch_id' action, then using it when sending emails via the Mail Send API. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Completed steps

**Slug:** `SENDGRID_COMPLETED_STEPS`

Retrieves the verification status of a SendGrid account, checking if Domain Authentication and Single Sender Verification have been completed. Returns two boolean values: - `domain_verified`: True if Domain Authentication is complete - `sender_verified`: True if Single Sender Verification is complete This is a read-only endpoint that requires no parameters.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a batch id

**Slug:** `SENDGRID_CREATE_A_BATCH_ID`

Generate a new mail batch ID to group multiple email sends together. The batch ID allows you to: - Group related email sends for bulk operations - Pause all scheduled sends associated with the batch ID - Cancel all scheduled sends associated with the batch ID Use the returned batch_id when sending emails via the Mail Send API by including it in your send request. Later, you can manage these grouped sends using the Scheduled Sends API endpoints (pause, cancel, or resume). This endpoint requires no input parameters and generates a unique batch ID on each call.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a branded link

**Slug:** `SENDGRID_CREATE_A_BRANDED_LINK`

Create a new branded link by specifying the root domain, which must align with your FROM email, and an optional unique subdomain. Subusers can request using the `on-behalf-of` header.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain` | string | Yes | The root domain for the subdomain that you are creating the link branding for. This should match your FROM email address. |
| `region` | string ("global" | "eu") | No | The region where the branded link will be used. Use 'eu' for EU regional sending (links will point to eu.sendgrid.net), or 'global' for global sending (links will point to sendgrid.net). Defaults to 'global' if not specified. |
| `default` | boolean | No | Whether this branded link should be set as the default for the account. When set to true, this link branding will be used for all sending unless another is specified. |
| `subdomain` | string | No | The subdomain to create the link branding for. Must be different from the subdomain you used for authenticating your domain. If not provided, SendGrid will generate one automatically (e.g., 'url1234'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a campaign

**Slug:** `SENDGRID_CREATE_A_CAMPAIGN`

This endpoint enables campaign creation, requiring a subject, sender ID, content (HTML and text suggested), and a list or segment ID for sending or scheduling, but not for initial creation.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | The display title of your campaign. This will be viewable by you in the Marketing Campaigns UI.  |
| `editor` | string ("code" | "design") | No | The editor type used to create the campaign. Either 'code' for raw HTML editing or 'design' for the visual design editor. |
| `ip_pool` | string | No | The pool of IPs that you would like to send this email from. |
| `subject` | string | No | The subject of your campaign that your recipients will see. |
| `list_ids` | array | No | The IDs of the lists you are sending this campaign to. You can have both segment IDs and list IDs  |
| `sender_id` | integer | No | The ID of the "sender" identity that you have created. Your recipients will see this as the "from" on your marketing emails.  |
| `categories` | array | No | The categories you would like associated to this campaign. |
| `segment_ids` | array | No | The segment IDs that you are sending this list to. You can have both segment IDs and list IDs. Segments are limited to 10 segment IDs.  |
| `html_content` | string | No | The HTML of your marketing email. |
| `plain_content` | string | No | The plain text content of your emails. |
| `suppression_group_id` | integer | No | The suppression group that this marketing email belongs to, allowing recipients to opt-out of emails of this type.  |
| `custom_unsubscribe_url` | string | No | This is the url of the custom unsubscribe page that you provide for customers to unsubscribe from your suppression groups.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a custom field

**Slug:** `SENDGRID_CREATE_A_CUSTOM_FIELD`

Creates a custom field for storing additional contact information in SendGrid. Custom fields allow you to store additional data about your contacts beyond the default fields. You can create up to 120 custom fields per account. **Valid field types:** - `text`: For string/text values - `number`: For numeric values - `date`: For date values (use MM/DD/YYYY format or epoch timestamp) **Naming constraints:** - Field names must be unique - Cannot use reserved field names: first_name, last_name, email, created_at, updated_at, last_emailed, last_clicked, last_opened - Names should contain only alphanumeric characters, underscores, and hyphens **Note:** Once a custom field is created with a specific type, the type cannot be changed. To use a different type, you must delete the field and create a new one.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The unique name for the custom field. Must contain only alphanumeric characters and underscores (no hyphens allowed). Cannot match reserved field names (first_name, last_name, email, created_at, updated_at, last_emailed, last_clicked, last_opened). |
| `type` | string | Yes | The data type of the custom field. Must be one of: 'text' (for string values), 'number' (for numeric values), or 'date' (for date values in MM/DD/YYYY format or epoch timestamp). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a list

**Slug:** `SENDGRID_CREATE_A_LIST`

Create a new contact list in SendGrid's Marketing Campaigns. This endpoint creates a list that can be used to organize and segment your contacts for targeted email campaigns. Once created, you can add recipients to the list using the 'Add a Single Recipient to a List' action. Note: List names must be unique within your account. Attempting to create a list with a duplicate name will result in a 400 error.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The name of the contact list to create. Must be unique across all lists in your account. Supports alphanumeric characters, spaces, and special characters. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create an account

**Slug:** `SENDGRID_CREATE_AN_ACCOUNT`

Creates a new customer account under your organization using the Account Provisioning API. IMPORTANT: This endpoint is only available to Twilio SendGrid reseller partners with a formal partnership agreement. Standard SendGrid accounts will receive a 403 Forbidden error. The response includes the account_id which must be stored for all subsequent Account Provisioning API operations on this customer account.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `offerings` | array | Yes | List of offering objects to assign to the account. Each offering object must contain a 'name' field with the offering identifier (e.g., 'org.ei.free.v1', 'essentials_40k'). Each offering may optionally include 'type' (e.g., 'package', 'ip', 'addon') and 'quantity' fields. Use the GET_ALL_AVAILABLE_OFFERINGS action to retrieve valid offering names for your partner account. Example: [{'name': 'org.ei.free.v1'}] or [{'name': 'essentials_40k', 'type': 'package', 'quantity': 1}] |
| `profile__email` | string | No | Email address of the account holder. Optional - customer will be prompted at first login if not provided. |
| `profile__phone` | string | No | Phone number formatted using E.164 standard: [+][country code][subscriber number including area code]. Maximum 15 digits. Example: +14155551234. Optional - customer will be prompted at first login if not provided. |
| `profile__timezone` | string | No | Timezone as listed in the IANA Time Zone database (e.g., 'America/New_York', 'Europe/London'). See https://www.iana.org/time-zones for valid values. Optional - customer will be prompted at first login if not provided. |
| `profile__last__name` | string | No | Last name of the account holder. Optional - customer will be prompted at first login if not provided. |
| `profile__first__name` | string | No | First name of the account holder. Optional - customer will be prompted at first login if not provided. |
| `profile__company__name` | string | No | Company name of the account holder. Optional - customer will be prompted at first login if not provided. |
| `profile__company__website` | string | No | Company website URL of the account holder. Optional - customer will be prompted at first login if not provided. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a new alert

**Slug:** `SENDGRID_CREATE_A_NEW_ALERT`

Create a new SendGrid alert. Supports two alert types: - **usage_limit**: Notifies when email usage reaches a percentage threshold (requires `percentage` param). - **stats_notification**: Sends periodic email statistics (requires `frequency` param: daily/weekly/monthly).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string ("usage_limit" | "stats_notification") | Yes | The type of alert to create. 'usage_limit': Sends alert when email usage reaches the specified percentage threshold (requires 'percentage' parameter). 'stats_notification': Sends periodic email statistics summary (requires 'frequency' parameter). |
| `email_to` | string | Yes | The email address the alert will be sent to. Example: test@example.com |
| `frequency` | string ("daily" | "weekly" | "monthly") | No | Frequency for stats_notification alerts. |
| `percentage` | integer | No | Required for usage_limit alerts. The percentage of email usage threshold (0-100) that must be reached before the alert will be sent. Example: 90 means alert at 90% usage. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a new event webhook

**Slug:** `SENDGRID_CREATE_A_NEW_EVENT_WEBHOOK`

Set up an Event Webhook by providing a URL, choosing events for POST requests, and receive a unique ID. After creation, you can add names, OAuth, and signature verification.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | Set this property to the URL where you want the Event Webhook to send event data.  |
| `open` | boolean | No | Set this property to `true` to receive open events. Open events occur when a recipient has opened the HTML message. You must [enable Open Tracking](https://docs.sendgrid.com/ui/account-and-settings/tracking#open-tracking) to receive this type of event.  |
| `click` | boolean | No | Set this property to `true` to receive click events. Click events occur when a recipient clicks on a link within the message. You must [enable Click Tracking](https://docs.sendgrid.com/ui/account-and-settings/tracking#click-tracking) to receive this type of event.  |
| `bounce` | boolean | No | Set this property to `true` to receive bounce events. A bounce occurs when a receiving server could not or would not accept a message.  |
| `dropped` | boolean | No | Set this property to `true` to receive dropped events. Dropped events occur when your message is not delivered by Twilio SendGrid. Dropped events are accomponied by a `reason` property, which indicates why the message was dropped. Reasons for a dropped message include: Invalid SMTPAPI header, Spam Content (if spam checker app enabled), Unsubscribed Address, Bounced Address, Spam Reporting Address, Invalid, Recipient List over Package Quota.  |
| `enabled` | boolean | No | Set this property to `true` to enable the Event Webhook or `false` to disable it.  |
| `deferred` | boolean | No | Set this property to `true` to receive deferred events. Deferred events occur when a recipient"s email server temporarily rejects a message.  |
| `delivered` | boolean | No | Set this property to `true` to receive delivered events. Delivered events occur when a message has been successfully delivered to the receiving server.  |
| `processed` | boolean | No | Set this property to `true` to receive processed events. Processed events occur when a message has been received by Twilio SendGrid and the message is ready to be delivered.  |
| `spam_report` | boolean | No | Set this property to `true` to receive spam report events. Spam reports occur when recipients mark a message as spam.  |
| `unsubscribe` | boolean | No | Set this property to `true` to receive unsubscribe events. Unsubscribes occur when recipients click on a message"s subscription management link. You must [enable Subscription Tracking](https://docs.sendgrid.com/ui/account-and-settings/tracking#subscription-tracking) to receive this type of event.  |
| `friendly_name` | string | No | Optionally set this property to a friendly name for the Event Webhook. A friendly name may be assigned to each of your webhooks to help you differentiate them. The friendly name is for convenience only. You should use the webhook `id` property for any programmatic tasks.  |
| `oauth_client_id` | string | No | Set this property to the OAuth client ID that SendGrid will pass to your OAuth server or service provider to generate an OAuth access token. When passing data in this property, you must also include the `oauth_token_url` property.  |
| `oauth_token_url` | string | No | Set this property to the URL where SendGrid will send the OAuth client ID and client secret to generate an OAuth access token. This should be your OAuth server or service provider. When passing data in this field, you must also include the `oauth_client_id` property.  |
| `group_resubscribe` | boolean | No | Set this property to `true` to receive group resubscribe events. Group resubscribes occur when recipients resubscribe to a specific [unsubscribe group](https://docs.sendgrid.com/ui/sending-email/create-and-manage-unsubscribe-groups) by updating their subscription preferences. You must [enable Subscription Tracking](https://docs.sendgrid.com/ui/account-and-settings/tracking#subscription-tracking) to receive this type of event.  |
| `group_unsubscribe` | boolean | No | Set this property to `true` to receive group unsubscribe events. Group unsubscribes occur when recipients unsubscribe from a specific [unsubscribe group](https://docs.sendgrid.com/ui/sending-email/create-and-manage-unsubscribe-groups) either by direct link or by updating their subscription preferences. You must [enable Subscription Tracking](https://docs.sendgrid.com/ui/account-and-settings/tracking#subscription-tracking) to receive this type of event.  |
| `oauth_client_secret` | string | No | Set this property to the OAuth client secret that SendGrid will pass to your OAuth server or service provider to generate an OAuth access token. This secret is needed only once to create an access token. SendGrid will store the secret, allowing you to update your client ID and Token URL without passing the secret to SendGrid again. When passing data in this field, you must also include the `oauth_client_id` and `oauth_token_url` properties.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a new suppression group

**Slug:** `SENDGRID_CREATE_A_NEW_SUPPRESSION_GROUP`

Create a new suppression group (unsubscribe group) to allow recipients to opt out of specific types of emails. Suppression groups are specific categories of email (like newsletters, promotions, or alerts) that recipients can individually unsubscribe from. You can create up to 200 suppression groups per account. **Important Notes:** - The name and description will be visible to recipients when they manage their email preferences - Wait at least one minute after creating a group before using it in email sends - To add email addresses to the suppression group, use the "Add suppressions to a suppression group" action **Example use cases:** - Daily newsletters - Weekly digests - Marketing promotions - System alerts - Event invitations

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | The name of the suppression group. This will be visible to recipients when they manage their email preferences. Use a clear, recipient-friendly name. Required field. |
| `is_default` | boolean | No | Whether this should be the default suppression group. When true, this group will be used as the default unsubscribe option. Optional field, defaults to false if not specified. |
| `description` | string | No | A brief description of the suppression group explaining what type of emails it covers. This will be visible to recipients when they manage their email preferences. Required field. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a new transactional template version

**Slug:** `SENDGRID_CREATE_A_NEW_TRANSACTIONAL_TEMPLATE_VERSION`

**This endpoint allows you to create a new version of a template.**

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Name of the transactional template version. This helps identify different versions of the same template (e.g., 'Version 1', 'Holiday Update'). |
| `active` | integer | No | Set to 1 to make this version the active version of the template. Set to 0 or omit to create an inactive version. Only one version can be active at a time. |
| `editor` | string ("code" | "design") | No | The editor type used to create the template version. 'code' for Code Editor, 'design' for Design Editor. Defaults to 'code' if not specified. |
| `subject` | string | Yes | Subject line of the email. Supports Handlebars substitution syntax for dynamic content (e.g., 'Hello {{first_name}}'). |
| `test_data` | string | No | For dynamic templates only. A JSON string containing mock data for template preview and test sends. Example: '{"first_name": "John", "order_id": "12345"}'. |
| `template_id` | string | Yes | The ID of the transactional template to add a version to. Format: 'd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' for dynamic templates or UUID for legacy templates. |
| `html_content` | string | No | The HTML content of the email template. Supports Handlebars substitution syntax for dynamic content (e.g., '{{first_name}}'). Maximum of 1048576 bytes (1MB) allowed. |
| `plain_content` | string | No | Text/plain content of the transactional template version. If not provided and generate_plain_content is true, it will be automatically generated from html_content. Maximum of 1048576 bytes allowed. |
| `generate_plain_content` | boolean | No | If true, plain_content is always generated from html_content. If false, plain_content is not altered.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create an ip pool

**Slug:** `SENDGRID_CREATE_AN_IP_POOL`

Creates a new IP pool in your SendGrid account. IP pools allow you to group your dedicated SendGrid IP addresses together. For example, you could create separate pools for transactional and marketing emails to maintain separate reputations. Requires a SendGrid account with dedicated IP addresses (Pro or Premier plan). You can create up to 100 IP pools per account.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The name for the new IP pool. Must be unique. Cannot begin with a space or period. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create an ip pool with a name and ip assignments

**Slug:** `SENDGRID_CREATE_AN_IP_POOL_WITH_A_NAME_AND_IP_ASSIGNMENTS`

Creates a new IP Pool in your SendGrid account using the IP Address Management API. IP Pools allow you to group your dedicated SendGrid IP addresses together (e.g., separate pools for transactional vs marketing emails to maintain separate reputations). This endpoint creates the pool AND optionally assigns IPs in a single atomic operation. If any IP assignment fails, the entire operation fails and no pool is created. Requirements: - SendGrid Pro or Premier plan with dedicated IP addresses - IP Address Management API access (beta feature) - Maximum 100 IP pools per account - Maximum 100 IPs per pool

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ips` | array | No | An optional array of IP addresses to assign to the IP Pool. All assignments must succeed or the entire creation fails. Each IP must be a valid dedicated IP from your account. A pool can have up to 100 IPs. |
| `name` | string | Yes | The name to assign to the IP Pool. Must be unique across your account. Cannot begin with a space or period. Maximum 64 characters. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create an sso certificate

**Slug:** `SENDGRID_CREATE_AN_SSO_CERTIFICATE`

Create an SSO certificate for SAML 2.0 Single Sign-On authentication. This endpoint creates an SSO certificate that allows SendGrid to verify SAML requests from your Identity Provider (IdP). The certificate is used in the SAML authentication flow to establish trust between SendGrid and your IdP. Note: SSO functionality requires a SendGrid Email API Pro, Premier, or Marketing Campaigns Advanced plan.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enabled` | boolean | No | Indicates if the certificate is enabled. Defaults to false if not specified. |
| `integration_id` | string | Yes | The ID of the SSO integration to associate this certificate with. This ID can be obtained from the 'Get All SSO Integrations' endpoint response. |
| `public_certificate` | string | Yes | The X.509 public certificate in PEM format that allows SendGrid to verify SAML requests are signed by a recognized Identity Provider (IdP). This certificate is typically exported from your IdP (e.g., Okta, Azure AD). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create an sso integration

**Slug:** `SENDGRID_CREATE_AN_SSO_INTEGRATION`

Create a new Single Sign-On (SSO) integration for your SendGrid account. This endpoint allows you to configure SAML 2.0 SSO with your Identity Provider (IdP) such as Okta, Azure AD, or Duo. SSO enables your team members to authenticate using your organization's identity management system. **Note**: SSO is available only for SendGrid Email API Pro, Premier, and Marketing Campaigns Advanced plans. Requires appropriate SSO permissions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The name of your SSO integration. This name can be anything that makes sense for your organization (e.g., 'Okta SSO', 'Azure AD'). |
| `enabled` | boolean | Yes | Indicates if the SSO integration is enabled. Set to true to activate the integration, false to disable it. |
| `entity_id` | string | Yes | A unique identifier provided by your Identity Provider (IdP) to identify Twilio SendGrid in the SAML interaction. Also known as 'SAML Issuer ID' in the Twilio SendGrid UI. Typically a URL or URN format. |
| `signin_url` | string | Yes | The IdP's SAML POST endpoint URL. This endpoint should receive requests and initiate an SSO login flow. Also known as the 'Embed Link' in the Twilio SendGrid UI. Must be a valid HTTPS URL. |
| `signout_url` | string | Yes | The IdP's logout URL for IdP-initiated authentication flows. When a user authenticates from their IdP and logs out, they will be redirected to this URL. Must be a valid HTTPS URL. |
| `completed_integration` | boolean | No | Optional. Indicates if the SSO integration setup is complete. Set to true when all configuration steps are finished. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create an sso teammate

**Slug:** `SENDGRID_CREATE_AN_SSO_TEAMMATE`

Creates a Single Sign-On (SSO) Teammate in SendGrid. SSO Teammates authenticate via your Identity Provider (IdP) instead of username/password. Requires: Enterprise SendGrid account with SSO integration enabled. Permission assignment (choose ONE approach): - Set `is_admin=true` for full admin access - Set `persona` for predefined permission sets (accountant/developer/marketer/observer) - Set `scopes` array for custom granular permissions For Subuser-restricted access, set `has_restricted_subuser_access=true` and provide `subuser_access` array.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The Teammate's email address. This will also function as their username and must match the address assigned to the user in your Identity Provider (IdP). Cannot be changed after creation. |
| `scopes` | array | No | Add or remove permissions from a Teammate using this `scopes` property. See [**Teammate Permissions**](https://docs.sendgrid.com/ui/account-and-settings/teammate-permissions) for a complete list of available scopes. You should not include this property in the request when using the `persona` property or when setting the `is_admin` property to `true`—assigning a `persona` or setting `is_admin` to `true` will allocate a group of permissions to the Teammate.  |
| `persona` | string ("accountant" | "developer" | "marketer" | "observer") | No | Predefined permission sets that can be assigned to teammates. |
| `is_admin` | boolean | No | Set this property to `true` if the Teammate has admin permissions. You should not include the `scopes` or `persona` properties when setting the `is_admin` property to `true`—an admin will be allocated all scopes. See [**Teammate Permissions**](https://docs.sendgrid.com/ui/account-and-settings/teammate-permissions) for a complete list of scopes.  |
| `last_name` | string | Yes | The Teammate's last name. |
| `first_name` | string | Yes | The Teammate's first name. |
| `subuser_access` | array | No | Specify which Subusers the Teammate may access and act on behalf of with this property. If this property is populated, you must set the `has_restricted_subuser_access` property to `true`. Each item should specify Subuser ID, disabled status, permission_type, and scopes. |
| `has_restricted_subuser_access` | boolean | No | Set this property to `true` to give the Teammate permissions to operate only on behalf of a Subuser. This property value must be `true` if the `subuser_access` property is not empty. The `subuser_access` property determines which Subusers the Teammate may act on behalf of. If this property is set to `true`, you cannot specify individual `scopes`, assign a `persona`, or set `is_admin` to `true`—a Teammate cannot specify scopes for the parent account and have restricted Subuser access.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a parse setting

**Slug:** `SENDGRID_CREATE_A_PARSE_SETTING`

Creates a new Inbound Parse Webhook setting to receive and parse incoming emails. **Prerequisites:** 1. The hostname must be part of a domain that is authenticated via SendGrid Domain Authentication. 2. Your domain's MX records must point to `mx.sendgrid.net` (priority 10). 3. The receiving URL must be publicly accessible and return HTTP 200 on success. **Parameters:** - `hostname`: Required. A subdomain of your authenticated domain (e.g., `parse.yourdomain.com`). - `url`: Required. Public webhook URL to receive parsed emails via HTTP POST. - `send_raw`: Optional. Set to `true` to receive raw MIME content. - `spam_check`: Optional. Set to `true` to enable spam filtering (emails ≤2.5MB). **Returns:** The created parse setting with hostname, url, send_raw, and spam_check values.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | Required. The public URL where SendGrid will POST the parsed email data via HTTP POST. Must be publicly accessible and return a 200 status code. SendGrid will not follow redirects. Example: `https://yourapp.com/webhook/inbound-email`. |
| `hostname` | string | Yes | Required. A domain or subdomain that will receive incoming emails to parse. Must be a subdomain of a SendGrid-authenticated domain in your account with valid DNS records. Example: `parse.yourdomain.com`. The domain must first be authenticated via SendGrid's Domain Authentication. |
| `send_raw` | boolean | No | Optional. When set to `true`, SendGrid posts the original MIME-type content of the email as a raw payload instead of parsed fields. Useful when you need the original email format. Defaults to `false`. |
| `spam_check` | boolean | No | Optional. When set to `true`, SendGrid checks the parsed email content for spam before POSTing to your URL. Includes spam_report and spam_score in the payload. Only works for emails 2.5 MB or smaller. Defaults to `false`. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create api keys

**Slug:** `SENDGRID_CREATE_API_KEYS`

Creates a new SendGrid API key with specified permissions. The first API key must be created in the SendGrid App UI; subsequent keys can be created via this endpoint. Limit: 100 keys per account. If no scopes are specified, the key receives Full Access permissions. The API key string is only returned once in the response - store it securely. Requires 'api_keys.create' scope on the authenticating API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The name for this API Key. Used to identify the key in the SendGrid UI and API responses. |
| `scopes` | array | No | List of permission scopes for this API Key (e.g., 'mail.send', 'alerts.read'). If omitted, the key gets Full Access permissions. Use GET /v3/scopes to see available scopes. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a segment

**Slug:** `SENDGRID_CREATE_A_SEGMENT`

Creates a new segment in SendGrid's Contact Database (Legacy Marketing Campaigns). Segments group contacts based on specified conditions for targeted email campaigns. Conditions support various operators: 'eq' (equals), 'ne' (not equals), 'contains', 'not_contains', 'gt', 'lt', 'ge', 'le' for text/date/number fields. Multiple conditions can be combined using 'and'/'or' logical operators.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | A unique name for this segment (required). |
| `list_id` | integer | No | The ID of an existing list to create this segment from. If omitted, the segment will be created from the main contactdb. |
| `conditions` | array | Yes | An array of condition objects that define segment membership criteria. Each condition must have: 'field' (e.g., 'first_name', 'last_name', 'email', 'created_at', 'updated_at', 'last_emailed', 'last_clicked', 'last_opened'), 'operator' (e.g., 'eq', 'ne', 'contains', 'not_contains', 'gt', 'lt', 'ge', 'le'), and 'value' (string). For multiple conditions, include 'and_or' field set to 'and' or 'or' (first condition should have empty 'and_or'). Example: [{'field': 'last_name', 'value': 'Smith', 'operator': 'eq', 'and_or': ''}] |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a sender

**Slug:** `SENDGRID_CREATE_A_SENDER`

Creates a new Sender identity for use in SendGrid Marketing Campaigns. You may create up to 100 unique Senders. Senders must be verified before use - if your domain is authenticated the Sender will auto-verify, otherwise a verification email will be sent to the from_email address. Required fields: nickname, from_email, from_name, address, city, and country.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `zip` | string | No | The postal or ZIP code for the Sender's address. Example: '94105'. |
| `city` | string | Yes | The city where the Sender is located. Required for CAN-SPAM compliance. Example: 'San Francisco'. |
| `state` | string | No | The state or province where the Sender is located. Example: 'CA' or 'California'. |
| `address` | string | Yes | The physical street address of the Sender. Required for CAN-SPAM compliance. Example: '123 Main Street'. |
| `country` | string | Yes | The country where the Sender is located. Required for CAN-SPAM compliance. Example: 'United States' or 'USA'. |
| `nickname` | string | Yes | A unique nickname for this Sender identity. Used internally to identify the sender, not displayed to email recipients. Example: 'Marketing Team' or 'Support'. |
| `address_2` | string | No | Additional address information such as suite, apartment, or unit number. Example: 'Suite 100' or 'Apt 4B'. |
| `from__name` | string | Yes | The display name shown alongside the from email address. Typically your name or company name. Example: 'Your Company Marketing'. |
| `from__email` | string | Yes | The email address that will appear in the 'From' field of sent emails. A verification email will be sent to this address unless the domain is already authenticated. Example: 'marketing@yourcompany.com'. |
| `reply__to__name` | string | No | The display name for the reply-to address. If not provided, defaults to the from_name. Example: 'Your Company Support'. |
| `reply__to__email` | string | Yes | The email address where replies from recipients will be sent. This is required by the API. Example: 'support@yourcompany.com'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a sender identity

**Slug:** `SENDGRID_CREATE_A_SENDER_IDENTITY`

**Create a new sender identity in SendGrid.** A sender identity is required to send email through SendGrid. It represents the "from" information that recipients will see. You may create up to 100 unique sender identities. **Verification**: Newly created senders must be verified before use: - If your domain is authenticated with SendGrid, the sender will auto-verify - Otherwise, a verification email will be sent to the from_email address - Only verified senders can be used to send emails **Required fields**: address, city, country, from_email, from_name, nickname, reply_to_email **Optional fields**: address_2, state, zip, reply_to_name **Use cases**: - Set up sender identities for different teams or campaigns - Configure transactional email senders - Manage multiple brand identities

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `zip` | string | No | The postal or ZIP code of the sender's location. Example: '94105'. |
| `city` | string | Yes | The city where the sender is located. Example: 'San Francisco'. |
| `state` | string | No | The state or province where the sender is located. Example: 'CA' or 'California'. |
| `address` | string | Yes | The physical street address of the sender (required for CAN-SPAM compliance). Example: '123 Main Street'. |
| `country` | string | Yes | The country where the sender is located. Example: 'United States'. |
| `nickname` | string | Yes | A friendly name to identify this sender identity in the SendGrid dashboard. Not displayed to recipients. Example: 'Marketing Team'. |
| `address_2` | string | No | Additional address information such as suite or apartment number. Example: 'Suite 100'. |
| `from__name` | string | Yes | The display name that will appear alongside the from email address. Typically your name or company name. Example: 'John Smith' or 'Acme Corp'. |
| `from__email` | string | Yes | The email address that will appear in the 'From' field of sent emails. This email will need to be verified. Example: 'sender@example.com'. |
| `reply__to__name` | string | No | The display name for the reply-to address. If not provided, the from_name may be used. Example: 'Customer Support'. |
| `reply__to__email` | string | Yes | The email address where recipient replies will be sent. Example: 'support@example.com'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a transactional template

**Slug:** `SENDGRID_CREATE_A_TRANSACTIONAL_TEMPLATE`

Create a new transactional email template in SendGrid. Transactional templates allow you to create reusable email templates for sending transactional emails. Each account and subuser can create up to 300 templates. Templates are not shared between parent accounts and subusers. You can create either: - Legacy templates: Use substitution tags like -name- for variable replacement - Dynamic templates: Use Handlebars syntax like {{name}} for more powerful templating After creating a template, you'll need to add a version with content before it can be used to send emails.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The name for the new transactional template. |
| `generation` | string ("legacy" | "dynamic") | No | The generation of the transactional template. 'legacy' uses substitution tags (e.g., -name-), while 'dynamic' uses Handlebars syntax (e.g., {{name}}). If not specified, defaults to 'legacy'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create custom field definition

**Slug:** `SENDGRID_CREATE_CUSTOM_FIELD_DEFINITION`

Create unique case-insensitive custom fields with alphanumeric/underscore names starting with a letter/underscore. Save the ID for edits/deletes. Limited to 500 fields of type date, text, or number. Avoid starting with numbers to prevent campaign issues.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The name of the custom field. Must be unique (case-insensitive), contain only alphanumeric characters and underscores, and start with a letter or underscore. Max 100 characters. Cannot start with a number. |
| `field_type` | string ("Text" | "Number" | "Date") | Yes | The data type for the custom field. Use 'Text' for string values, 'Number' for numeric values, or 'Date' for date values. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create design

**Slug:** `SENDGRID_CREATE_DESIGN`

Creates a new email design in the SendGrid Design Library. The design can be used for Single Sends, Automations, and Dynamic Templates. Requires at minimum an html_content parameter with valid HTML. Returns the created design with its unique ID, thumbnail URL, and timestamps.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | The name of the design. Provide a descriptive name to identify this email design in your Design Library. |
| `editor` | string ("code" | "design") | No | The editor type for the design. Use 'code' for raw HTML editing or 'design' for the drag-and-drop visual editor. Defaults to 'code' if not specified. |
| `html_content` | string | Yes | The HTML content of the Design. |
| `plain_content` | string | No | Plain text version of the email content. If not provided, SendGrid can auto-generate this from the HTML content. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Marketing Integration

**Slug:** `SENDGRID_CREATE_INTEGRATION`

Create a SendGrid Marketing Integration for email event forwarding to Segment. This action creates an integration that automatically forwards specified email events (like opens, clicks, bounces, etc.) from SendGrid Marketing Campaigns to your Segment account for analytics and customer data management. **Prerequisites:** - A Segment account with a configured Source - The write key from your Segment Source - API key with Marketing permissions (Full Access or Custom Access with Marketing scope) **Limits:** - Maximum of 10 Segment integrations per user **Common Use Cases:** - Track email engagement in your customer data platform - Trigger automated workflows based on email events - Build unified customer profiles with email interaction data

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `label` | string | No | A friendly name/nickname for this integration to help identify it. Defaults to 'Untitled Integration' if not specified. |
| `destination` | string ("Segment") | Yes | The third-party application to forward email events to. Currently only 'Segment' is supported. |
| `filters__email__events` | array | Yes | List of SendGrid email event types to forward to the integration destination. Available events: 'processed', 'delivered', 'open', 'click', 'bounce', 'deferred', 'drop', 'spam_report', 'unsubscribe', 'group_unsubscribe', 'group_resubscribe', 'ab_variation', 'ab_phase'. Select the events relevant to your analytics needs. This field is required. |
| `properties__write__key` | string | Yes | The write key from your Segment Source that will receive the forwarded events. You can find this in your Segment workspace under Sources > Your Source > Settings. Must be between 6 and 51 characters. This field is required for Segment integrations. |
| `properties__destination__region` | string ("EU" | "US") | Yes | The Segment workspace region where your Source write key is located. Must be either 'EU' (Europe) or 'US' (United States). This field is required for Segment integrations. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create list

**Slug:** `SENDGRID_CREATE_LIST`

Create a new contact list in SendGrid Marketing Campaigns. Lists are static collections of contacts used for organizing and targeting email campaigns. Once created, you can add contacts to the list using the Contacts API or configure automations to trigger when new contacts are added. Note: You can create a maximum of 1000 lists per account. List names must be unique within your account. Requires the Marketing Campaigns API scope (marketing.lists.create).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The name for the new contact list. Must be unique within your account. Maximum 100 characters. Example: 'Newsletter Subscribers' or 'Premium Customers'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create segment

**Slug:** `SENDGRID_CREATE_SEGMENT`

Creates a new contact segment using SendGrid's Marketing Campaigns Segmentation V2 API. Segments allow you to group contacts based on SQL queries against contact data and engagement events. Segment names must be unique. Contacts matching the query criteria are automatically added within 15-30 minutes. Use engagement data (opens, clicks) for behavioral targeting or contact fields (email, name, custom fields) for demographic segments.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | A unique name for the segment. Segment names must be unique within the account - creating a segment with an existing name will fail. |
| `query_dsl` | string | Yes | SQL query defining segment membership criteria. Must select 'contact_id' and 'updated_at' from 'contact_data' table. Optionally join with 'event_data' for engagement-based segments. Example: 'SELECT contact_id, updated_at FROM contact_data WHERE first_name = "John"'. Supports operators: =, !=, >, <, >=, <=, AND, OR, NOT, IN, IS NULL, IS NOT NULL. Functions: current_timestamp, timestampadd(), array_contains(). |
| `parent_list_ids` | array | No | Optional list of parent list IDs to filter contacts from when building this segment. Currently supports only one list ID. If omitted, the segment will be created from all contacts in the account. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create single send

**Slug:** `SENDGRID_CREATE_SINGLE_SEND`

The endpoint lets you create a Single Send draft without needing a template ID; it now uses `email_config`. A set `send_at` doesn't schedule it; it must be done through another endpoint or UI.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The name of the Single Send. This is used to identify the Single Send in the SendGrid UI and must be unique. |
| `send_at` | string | No | Set this property to an ISO 8601 formatted date-time when you would like to send the Single Send. Please note that any `send_at` property value set with this endpoint will prepopulate the send date in the SendGrid user interface (UI). However, the Single Send will remain an unscheduled draft until it"s updated with the [**Schedule Single Send**](https://docs.sendgrid.com/api-reference/single-sends/schedule-single-send) endpoint or SendGrid application UI. Additionally, the `now` keyword is a valid `send_at` value only when using the Schedule Single Send endpoint. Setting this property to `now` with this endpoint will cause an error.  |
| `categories` | array | No | The categories to associate with this Single Send. |
| `send__to__all` | boolean | No | Set to `true` to send to All Contacts. If set to `false`, at least one `list_ids` or `segment_ids` value must be provided before the Single Send is scheduled to be sent to recipients.  |
| `send__to__list__ids` | array | No | The recipient List IDs that will receive the Single Send. |
| `email__config__editor` | string ("code" | "design") | No | The editor type used to create the email. Use 'code' for the code editor or 'design' for the design editor in the Marketing Campaigns App. |
| `email__config__subject` | string | No | The subject line of the Single Send. Do not include this field when using a `design_id`.  |
| `send__to__segment__ids` | array | No | The recipient Segment IDs that will receive the Single Send. |
| `email__config__ip__pool` | string | No | The name of the IP Pool from which the Single Send emails are sent. |
| `email__config__design__id` | string | No | A `design_id` can be used in place of `html_content`, `plain_content`, and/or `subject`. You can retrieve a design"s ID from the ["List Designs" endpoint](https://docs.sendgrid.com/api-reference/designs-api/list-designs) or by pulling it from the design"s detail page URL in the Marketing Campaigns App.  |
| `email__config__sender__id` | integer | No | The ID of the verified Sender. You can retrieve a verified Sender"s ID from the ["Get Verified Senders" endpoint](https://www.twilio.com/docs/sendgrid/api-reference/sender-verification/get-all-verified-senders) or by pulling it from the Sender"s detail page URL in the SendGrid App.  |
| `email__config__html__content` | string | No | The HTML content of the Single Send. Do not include this field when using a `design_id`.  |
| `email__config__plain__content` | string | No | The plain text content of the Single Send. Do not include this field when using a `design_id`.  |
| `email__config__suppression__group__id` | integer | No | The ID of the Suppression Group to allow recipients to unsubscribe — you must provide this or the `custom_unsubscribe_url`.  |
| `email__config__custom__unsubscribe__url` | string | No | The URL allowing recipients to unsubscribe — you must provide this or the `suppression_group_id`.  |
| `email__config__generate__plain__content` | boolean | No | If set to `true`, `plain_content` is always generated from `html_content`. If set to false, `plain_content` is not altered.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create subuser

**Slug:** `SENDGRID_CREATE_SUBUSER`

**This endpoint allows you to create a new subuser.** Subusers allow you to segment your email sending and API activity. They are typically available on Pro plans or above. Your API key must have proper 'subuser' permissions to use this endpoint. The requester's IP address must be whitelisted in your SendGrid account settings if IP access management is enabled.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ips` | array | Yes | The IP addresses that should be assigned to this subuser. Can be an empty array if no IPs are assigned initially. Use the 'Get all IP addresses' action to retrieve available IPs on your account. |
| `email` | string | Yes | The email address of the subuser. |
| `region` | string ("global" | "eu") | No | The region this Subuser should be assigned to. Can be 'global' or 'eu'. (Regional email is in Public Beta and requires SendGrid Pro plan or above.) |
| `password` | string | Yes | The password this subuser will use when logging into SendGrid. Must be a strong password meeting SendGrid's security requirements. |
| `username` | string | Yes | The username for this subuser. |
| `include_region` | boolean | No | A flag that determines if the subuser's region should be returned in the response. (Regional email is in Public Beta and requires SendGrid Pro plan or above.) |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create verified sender request

**Slug:** `SENDGRID_CREATE_VERIFIED_SENDER_REQUEST`

This endpoint creates a new sender identity via `POST`, sends a verification email to `from_email`, and requires email verification. To resend, use `/resend/{id}`. For domain authentication, refer to the Domain Authentication API.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `zip` | string | Yes | The postal or ZIP code for the sender's address. Required for CAN-SPAM compliance. Example: '94105'. |
| `city` | string | Yes | The city where the sender is located. Required for CAN-SPAM compliance. Example: 'San Francisco'. |
| `state` | string | Yes | The state or province where the sender is located. Required for CAN-SPAM compliance. Example: 'CA' or 'California'. |
| `address` | string | Yes | The physical street address of the sender. Required for CAN-SPAM compliance. Example: '1234 Fake St'. |
| `country` | string | Yes | The country where the sender is located. Required for CAN-SPAM compliance. Example: 'USA'. |
| `address2` | string | No | Additional address information such as suite, apartment, or PO Box number. Example: 'PO Box 1234'. |
| `nickname` | string | Yes | A friendly identifier for this sender identity. Used internally to organize senders, not shown to email recipients. Example: 'Orders' or 'Marketing Team'. |
| `reply_to` | string | Yes | The email address where replies from recipients will be sent. Can be the same as from_email or a different address. Example: 'support@example.com'. |
| `from_name` | string | No | The display name that appears alongside the from email address. Typically your name or company name. Example: 'Example Orders'. |
| `from_email` | string | Yes | The email address that will appear in the 'From' field of sent emails. A verification email will be sent to this address. Avoid using addresses from domains with strict DMARC policies (gmail.com, yahoo.com, aol.com). Example: 'orders@example.com'. |
| `reply_to_name` | string | No | The display name for the reply-to address. Example: 'Example Support'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a batch of ips from an ip pool

**Slug:** `SENDGRID_DELETE_A_BATCH_OF_IPS_FROM_AN_IP_POOL`

Removes a batch of IP addresses from a specified IP Pool in SendGrid. This operation unassigns the specified IPs from the pool but does NOT delete the IPs from your SendGrid account - they remain available for assignment to other pools. Requirements: - A SendGrid account with dedicated IP addresses (Pro or Premier plan) - API key with 'IP Address Management' permissions - Valid pool ID and IP addresses that are currently assigned to that pool Note: This endpoint is part of the IP Address Management API which is currently in public beta.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ips` | array | Yes | An array of IP addresses to remove from the specified IP Pool. Each IP should be in standard IPv4 format (e.g., '192.168.1.1'). The IPs must currently be assigned to the specified pool. |
| `poolid` | string | Yes | The unique identifier for the IP Pool from which to remove IPs. You can obtain pool IDs using the 'Get All IP Pools' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a batch of subusers from an ip

**Slug:** `SENDGRID_DELETE_A_BATCH_OF_SUBUSERS_FROM_AN_IP`

Removes multiple subusers from a specified IP address in a single batch operation. This action unassigns subusers from an IP address, preventing them from sending email through that IP. This is useful for managing IP reputation or reallocating IP resources. All removals must succeed; if any subuser removal fails, the entire operation returns an error. Requires IP Address Management permissions. Use GET_A_LIST_OF_SUBUSERS_ASSIGNED_TO_AN_IP first to verify which subusers are currently assigned to the IP address. Note: This API is part of the IP Address Management API which is in public beta.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip` | string | Yes | The IP address from which to remove subuser assignments. Must be a valid IPv4 address (e.g., '149.72.123.45') that exists on your SendGrid account and currently has subusers assigned to it. Use GET_A_LIST_OF_SUBUSERS_ASSIGNED_TO_AN_IP to verify assignments first. |
| `subusers` | array | Yes | An array of subuser usernames (not IDs) to be removed from the specified IP address. Each username must be a string representing an existing subuser that is currently assigned to the IP. All removals must succeed; if any fails, the entire operation returns an error. Example: ['subuser1', 'subuser2']. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a bounce

**Slug:** `SENDGRID_DELETE_A_BOUNCE`

Removes an email address from your SendGrid bounce suppression list. Use this to manually clear a bounced email, allowing future delivery attempts. Bounces occur when an email cannot be delivered due to permanent failures (e.g., invalid address, mailbox full). SendGrid automatically adds these to your bounce list. **When to use:** After verifying the email is now valid, fixing issues that caused the bounce, or when the recipient confirms they want to receive emails again. **Response codes:** 204 (success), 404 (email not in bounce list), 403 (insufficient permissions). **Caution:** Repeatedly sending to addresses that bounce negatively impacts sender reputation. Only remove bounces when you have valid reason to believe the address is now deliverable.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address to remove from the bounce suppression list. Must be a valid email address format (e.g., 'user@example.com'). The email must exist in your bounce list; otherwise the API returns 404 Not Found. After successful removal, future emails to this address will be attempted for delivery. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a branded link

**Slug:** `SENDGRID_DELETE_A_BRANDED_LINK`

Permanently delete a branded link from your SendGrid account. A successful deletion returns HTTP 204 No Content. The operation is irreversible - once deleted, the branded link cannot be recovered. If you need to record the link's details, use the 'Retrieve a branded link' endpoint before deletion. Note: Links will only break if you remove the associated DNS CNAME records from your DNS host after deletion. Subusers can delete branded links using the `on-behalf-of` header with their ID.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The unique identifier of the branded link to delete. This ID can be obtained from the 'Retrieve all branded links' endpoint. Once deleted, the branded link cannot be recovered. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a campaign

**Slug:** `SENDGRID_DELETE_A_CAMPAIGN`

Permanently deletes a specific marketing campaign from your SendGrid account. **Note**: This endpoint is part of the Legacy Marketing Campaigns API. The campaign cannot be recovered once deleted. Ensure you have the correct campaign ID before calling this endpoint. Returns HTTP 204 No Content on successful deletion.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `campaign_id` | integer | Yes | The unique numeric ID of the campaign to delete. You can obtain campaign IDs by listing all campaigns using the 'Retrieve all campaigns' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a contact identifier

**Slug:** `SENDGRID_DELETE_A_CONTACT_IDENTIFIER`

Removes a specific identifier (EMAIL, PHONENUMBERID, EXTERNALID, or ANONYMOUSID) from a contact without deleting the entire contact. The operation runs asynchronously and returns a job_id to track progress. Note: This will fail if you try to remove the contact's only identifier - contacts must have at least one identifier.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contact_id` | string | Yes | The unique ID of the contact from which to remove an identifier. You can get this ID using the 'Get Contacts by Identifiers' or 'Search Contacts' endpoints. |
| `identifier_type` | string ("EMAIL" | "PHONENUMBERID" | "EXTERNALID" | "ANONYMOUSID") | Yes | The type of identifier to remove from the contact. Must be one of: EMAIL, PHONENUMBERID, EXTERNALID, or ANONYMOUSID. |
| `identifier_value` | string | Yes | The value of the identifier you want to remove from the contact. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a custom field

**Slug:** `SENDGRID_DELETE_A_CUSTOM_FIELD`

Permanently deletes a custom field from your SendGrid contact database. **Important:** - This uses the Legacy Marketing Campaigns Contacts API - Only custom fields can be deleted; reserved fields cannot be deleted - Deleting a custom field will remove all data stored in that field for all contacts - This action cannot be undone **How to get the custom_field_id:** - Use 'Retrieve all custom fields' action to list all custom fields and their IDs - The ID is returned when creating a custom field via 'Create a custom field' - Custom field IDs are integers (e.g., 182757801, 182757802) Returns HTTP 204 (No Content) on successful deletion.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `custom_field_id` | integer | Yes | The unique integer ID of the custom field to delete. This ID is returned when creating a custom field via 'Create a custom field' action or when listing custom fields via 'Retrieve all custom fields'. Example: 182757801 |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a global suppression

**Slug:** `SENDGRID_DELETE_A_GLOBAL_SUPPRESSION`

This endpoint removes an email from suppressions, allowing future emails to be sent to it. Use with consent or bypass filters for one-off emails.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address to remove from the global suppression list. After removal, this address will be able to receive emails from your SendGrid account again. Must be a valid email address format. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete an account

**Slug:** `SENDGRID_DELETE_AN_ACCOUNT`

Permanently deletes a customer account under your organization using the Account Provisioning API. **WARNING:** This action is IRREVERSIBLE and will: - Revoke all API keys and SSO access (user can no longer log in) - Remove all SendGrid resources including dedicated IPs - Cancel billing effective immediately **ACCESS REQUIREMENTS:** This endpoint is only available to Twilio SendGrid reseller partners with a formal partnership agreement. Standard SendGrid accounts will receive a 403 Forbidden error. **PARAMETERS:** - accountID: The unique account identifier (UUID format) from Create Account or List Accounts **RESPONSES:** - HTTP 200: Account successfully deleted - HTTP 403: Forbidden - requires partner/reseller API credentials - HTTP 404: Account ID not found

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accountID` | string | Yes | The unique Twilio SendGrid account ID to delete. This ID is returned when creating an account via the Account Provisioning API (Create Account endpoint) and can also be retrieved using the List Accounts endpoint. Format is typically a UUID-like string. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete an alert

**Slug:** `SENDGRID_DELETE_AN_ALERT`

Delete a SendGrid alert by its ID. Permanently removes an alert from your account. Alerts allow you to receive notifications regarding email usage or statistics: - **Usage alerts**: Notify when email usage reaches a percentage threshold - **Stats notifications**: Periodic email statistics reports (daily/weekly/monthly) Returns HTTP 204 No Content on successful deletion.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `alert_id` | integer | Yes | The ID of the alert you would like to delete. You can obtain alert IDs by using the 'Retrieve all alerts' action. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete an authenticated domain

**Slug:** `SENDGRID_DELETE_AN_AUTHENTICATED_DOMAIN`

Delete an authenticated domain (formerly known as domain whitelabel) by its ID. Deleting an authenticated domain removes the domain authentication, which means recipients may see 'via sendgrid.net' or 'sent on behalf of' messages again when receiving emails from that domain. **Important Notes:** - This action is irreversible; the domain's DNS records will need to be set up again if you want to re-authenticate the domain later. - Returns HTTP 204 No Content on successful deletion. - Requires the 'whitelabel.domains.delete' API scope. **Use Case:** Call this endpoint when you no longer need domain authentication for a specific sending domain, such as when decommissioning a domain or cleaning up test domains.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain_id` | string | Yes | The unique numeric ID of the authenticated domain to delete. This ID can be retrieved from the list authenticated domains endpoint. Example: '12345678' |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete an IP Pool

**Slug:** `SENDGRID_DELETE_AN_IP_POOL`

Delete an IP pool by its name using the legacy IP Pools API. IP pools allow you to group your dedicated SendGrid IP addresses together. For example, you could create separate pools for transactional and marketing email to maintain separate reputations. Important notes: - This operation is irreversible - the pool will be permanently deleted - IP addresses in the deleted pool will be unassigned but remain in your account - Requires a SendGrid Pro or Premier plan with dedicated IP addresses - IP pools can only be used with IP addresses that have reverse DNS configured Returns: - HTTP 204: Pool successfully deleted (empty response body) - HTTP 404: Pool not found (returns error message) - HTTP 403: API key lacks required permissions

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pool_name` | string | Yes | The name of the IP pool to delete. Pool names are case-sensitive and must match exactly. You can retrieve available pool names using the 'Retrieve all IP pools' action. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete an SSO Certificate

**Slug:** `SENDGRID_DELETE_AN_SSO_CERTIFICATE`

Delete an SSO certificate by its unique identifier. This endpoint permanently removes an SSO (Single Sign-On) certificate from your SendGrid account. SSO certificates are used to verify SAML requests between your Identity Provider (IdP) and SendGrid. **Important Notes:** - This action is irreversible - the certificate cannot be recovered after deletion. - Deleting a certificate may break SSO authentication if the certificate is in use. - SSO features require SendGrid Email API Pro, Premier, or Marketing Campaigns Advanced plans. - You can retrieve certificate IDs using the 'Get All SSO Certificates by Integration' endpoint. **Returns:** HTTP 204 No Content on success with an empty response body.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cert_id` | string | Yes | The unique identifier of the SSO certificate to delete. You can retrieve certificate IDs from the 'Get All SSO Certificates by Integration' endpoint or from the response when creating a certificate. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete an SSO Integration

**Slug:** `SENDGRID_DELETE_AN_SSO_INTEGRATION`

Delete an SSO (Single Sign-On) integration by ID. This endpoint permanently removes an IdP (Identity Provider) configuration from your SendGrid account. Once deleted, users will no longer be able to authenticate using this SSO integration. **Important Notes:** - This is a destructive operation and cannot be undone. - SSO functionality is only available for SendGrid Email API Pro, Premier, and Marketing Campaigns Advanced plans. - You can retrieve SSO integration IDs from the 'Get All SSO Integrations' endpoint. **Response:** - On success, returns HTTP 204 No Content with an empty response body. - Returns HTTP 403 Forbidden if your account lacks SSO permissions. - Returns HTTP 404 Not Found if the integration ID does not exist.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique ID of the SSO integration to delete. You can retrieve SSO integration IDs by calling the 'Get All SSO Integrations' endpoint (GET /v3/sso/integrations). The ID is a string value returned in the 'id' field of each integration object. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a parse setting

**Slug:** `SENDGRID_DELETE_A_PARSE_SETTING`

Deletes a specific inbound parse webhook setting by hostname. **Use Case:** Remove an inbound parse configuration when you no longer want SendGrid to receive and process emails for a particular hostname. **Prerequisites:** - The hostname must exist as a configured parse setting - Use 'Retrieve all parse settings' to find valid hostnames to delete **Returns:** - HTTP 204 No Content on successful deletion (empty response body) - HTTP 404 if the hostname doesn't exist - HTTP 403 if the API key lacks Parse Webhook permissions

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hostname` | string | Yes | Required. The hostname (domain or subdomain) of the inbound parse setting to delete. This should match the hostname used when creating the parse setting (e.g., 'parse.yourdomain.com'). Use the 'Retrieve all parse settings' action to list all configured hostnames. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete api keys

**Slug:** `SENDGRID_DELETE_API_KEYS`

**This endpoint allows you to revoke an existing API Key using an `api_key_id`** Authentications using a revoked API Key will fail after after some small propogation delay. If the API Key ID does not exist, a `404` status will be returned.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key_id` | string | Yes | The unique identifier (ID) of the API key to delete. This is NOT the API key string itself, but the ID returned when creating or listing API keys (e.g., 'abc123xyz'). You can find API key IDs by using the List API Keys endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a recipient

**Slug:** `SENDGRID_DELETE_A_RECIPIENT`

**[LEGACY API - DEPRECATED]** Deletes a single recipient from the Legacy Marketing Campaigns contact database. This endpoint is part of SendGrid's deprecated Contact Database API (contactdb) and is NOT accessible on accounts created after July 2020. **IMPORTANT**: Modern SendGrid accounts should use the 'Delete Contacts' action (`/v3/marketing/contacts`) instead, which is part of the current Marketing Campaigns API. For accounts with legacy access, this permanently removes the recipient from all contact lists and segments, which may be required for data privacy compliance.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `recipient_id` | string | Yes | The unique identifier of the recipient to delete from the Legacy Marketing Campaigns contact database. This ID is returned when recipients are created or retrieved using the legacy /v3/contactdb/recipients endpoints. Note: Treat recipient IDs as opaque values - pass them exactly as returned by the API. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a reverse dns record

**Slug:** `SENDGRID_DELETE_A_REVERSE_DNS_RECORD`

This endpoint deletes a reverse DNS record, returning a 204 code on success. Retrieve record IDs using the "Retrieve all reverse DNS records" endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The ID of the reverse DNS record to delete. Retrieve record IDs using the 'Retrieve all reverse DNS records' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a segment

**Slug:** `SENDGRID_DELETE_A_SEGMENT`

Permanently deletes a segment from the SendGrid Contact Database (Legacy Marketing Campaigns). This endpoint allows you to delete a segment from your recipients database. You also have the option to delete all the contacts from your Marketing Campaigns recipient database who were in this segment. Important notes: - This is part of the Legacy Marketing Campaigns API (Contact Database) - Use delete_contacts=true to also remove contacts belonging to this segment - If delete_contacts is false or omitted, contacts remain in other segments and the main database - This operation cannot be undone - Returns HTTP 204 No Content on successful deletion - Returns HTTP 404 if the segment ID does not exist To get segment IDs, use the 'Retrieve All Segments' endpoint (GET /v3/contactdb/segments).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `segment_id` | integer | Yes | The numeric ID of the segment to delete. Retrieve segment IDs using the 'Retrieve All Segments' endpoint (GET /v3/contactdb/segments). |
| `delete_contacts` | boolean | No | Set to true to also permanently delete all contacts that belong to this segment from the recipient database. If false or omitted, only the segment definition is removed and contacts remain in the database. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a sender

**Slug:** `SENDGRID_DELETE_A_SENDER`

Permanently delete an existing Marketing Campaigns Sender identity from your SendGrid account. Senders are the 'from' addresses (sender identities) used in Marketing Campaigns emails. This endpoint removes a specific sender by its unique numeric ID. **Important notes:** - This action is IRREVERSIBLE - the deleted Sender cannot be recovered. - You cannot delete a Sender that is currently being used by an active campaign. - After deletion, any campaigns referencing this Sender ID will fail to send. - Returns HTTP 204 (No Content) with empty body on successful deletion. - Returns HTTP 404 if the sender ID does not exist. - Returns HTTP 403 if the API key lacks permissions or IP is not whitelisted.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The unique numeric identifier (sender_id) of the Marketing Campaigns Sender to delete. Obtain this ID from the 'Get a list of all senders' (GET /v3/marketing/senders) endpoint or from the response when creating a sender. Example: 12345. WARNING: This action permanently deletes the Sender and cannot be undone. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a sender identity

**Slug:** `SENDGRID_DELETE_A_SENDER_IDENTITY`

Permanently deletes a sender identity from your SendGrid account. **Important:** This action is irreversible. The deleted sender identity cannot be recovered. Sender identities are used for marketing campaigns and transactional emails. Ensure the sender identity is not in active use before deletion. **Returns:** HTTP 204 No Content on successful deletion (empty response body).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sender_id` | integer | Yes | The unique numeric ID of the sender identity to delete. You can retrieve sender IDs using the 'Get all sender identities' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a single event webhook by id

**Slug:** `SENDGRID_DELETE_A_SINGLE_EVENT_WEBHOOK_BY_ID`

Delete a specific Event Webhook by ID with this endpoint. Unlike other endpoints which default to the oldest webhook, this requires an ID, else it errors to prevent accidental deletions. To disable, not delete, use `enabled` property to `false`.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique ID of the Event Webhook you want to delete. This ID is returned when creating a webhook or can be retrieved using the 'Retrieve all of your event webhooks' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a single recipient from a single list

**Slug:** `SENDGRID_DELETE_A_SINGLE_RECIPIENT_FROM_A_SINGLE_LIST`

Remove a single recipient from a SendGrid contact list. This endpoint is part of the Legacy Marketing Campaigns API (contactdb). Note: This API has been deprecated by SendGrid and may not be available for newer accounts. Consider using the newer Marketing Contacts API (/v3/marketing/contacts) for new implementations. On success, returns an empty response with HTTP 204 status. If the recipient is not on the list, the operation still succeeds (idempotent).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `list_id` | integer | Yes | The ID of the list from which to remove the recipient. Obtain list IDs from the 'Retrieve all lists' endpoint. |
| `recipient_id` | string | Yes | The ID of the recipient to remove from the list. This is a base64-encoded string derived from the recipient's email address. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a specific block

**Slug:** `SENDGRID_DELETE_A_SPECIFIC_BLOCK`

Deletes a specific email address from your SendGrid blocks list. Blocked emails are addresses that have been rejected by a receiving server or flagged for issues like ISP blocking, content filtering, or server rejection. Unlike bounces, SendGrid does not automatically suppress future messages to blocked addresses, so you may want to remove them manually using this endpoint. Returns HTTP 204 (No Content) on successful deletion. Returns HTTP 404 if the email address is not found in the blocks list.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address to remove from your blocks list. This email was previously blocked due to issues like server rejection, ISP blocking, or content filtering. Must be a valid email address format. |
| `on-behalf-of` | string | No | The subuser's username to make this API call on behalf of. This allows you to make API calls from the parent account on behalf of subusers. Use format: 'subuser-username' for subusers or 'account-id <account-id>' for customer accounts. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a specific invalid email

**Slug:** `SENDGRID_DELETE_A_SPECIFIC_INVALID_EMAIL`

Removes a specific email address from SendGrid's invalid emails suppression list. Invalid emails are addresses that are formatted incorrectly according to internet email standards or do not exist at the recipient's mail server. When SendGrid attempts to deliver to these addresses, they result in permanent delivery failures. This endpoint removes the suppression, allowing SendGrid to attempt delivery again. **Use Cases**: - Email address was corrected by the recipient - Address was temporarily invalid but is now active - Testing email delivery after fixing recipient's email configuration **Important**: Only remove invalid emails when you have confirmed the address is now valid. Repeatedly attempting to send to genuinely invalid addresses can impact your sender reputation. **Returns**: Empty response (HTTP 204) on success, 404 if email not found in invalid emails list, 403 if insufficient API key permissions. **Required Permission**: API key must have `suppression.invalid_emails.delete` scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address to remove from the invalid emails suppression list. This address was previously marked as invalid due to improper formatting or non-existence at the recipient's mail server. Must be a valid email address format. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a specific spam report

**Slug:** `SENDGRID_DELETE_A_SPECIFIC_SPAM_REPORT`

Removes a specific spam report from SendGrid's suppression list by email address. When an email recipient marks your message as spam, SendGrid adds their email to the spam reports suppression list to protect your sender reputation. This endpoint removes that suppression, allowing future emails to be sent to the address. **Use with caution**: Only remove spam reports when you have explicit consent from the recipient to send them emails again. Repeatedly sending to addresses that marked you as spam can damage your sender reputation. **Alternatives**: Consider using bypass filters for one-off exceptions rather than permanently removing spam reports. **Returns**: Empty response (HTTP 204) on success, 404 if email not found in spam reports, 403 if insufficient permissions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address of a specific spam report to delete. This will remove the suppression and allow emails to be sent to this address again. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a subuser

**Slug:** `SENDGRID_DELETE_A_SUBUSER`

Permanently delete a subuser from your SendGrid account. **WARNING**: This is a permanent, irreversible action. Once deleted, the subuser account cannot be retrieved and all access to Twilio SendGrid is immediately revoked. The subuser's email sending history and statistics will also be removed. On success, returns HTTP 204 No Content with an empty response body.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `subuser_name` | string | Yes | The username of the Subuser to delete. This is the unique identifier used when the subuser was created. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a suppression from a suppression group

**Slug:** `SENDGRID_DELETE_A_SUPPRESSION_FROM_A_SUPPRESSION_GROUP`

Remove an email address from a suppression group (unsubscribe group). This re-enables email delivery to the specified address for the given group. Use this only when recipients explicitly opt back in to receiving emails. Note: The API returns HTTP 204 No Content on success with an empty response body.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address to remove from the suppression group. This address will be able to receive emails associated with this group again after removal. |
| `group_id` | string | Yes | The numeric ID of the suppression group (unsubscribe group) from which to remove the email address. You can get group IDs from the 'Get suppression groups' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a suppression group

**Slug:** `SENDGRID_DELETE_A_SUPPRESSION_GROUP`

This API endpoint deletes email suppression groups. Deleted group members get globally suppressed if they unsubscribe. Use with caution, only if recipients want to resubscribe. Bypass filters available for exceptions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `group_id` | string | Yes | The unique ID of the suppression group to delete. This ID is returned when creating or listing suppression groups. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a template

**Slug:** `SENDGRID_DELETE_A_TEMPLATE`

Permanently deletes a transactional template from your SendGrid account. **Important:** This action is irreversible. The deleted template and all its versions cannot be recovered. Ensure the template is not actively being used in any email campaigns or automated sends before deletion. Templates can be either dynamic (ID starts with 'd-') or legacy (standard UUID format). Deleting a template removes all its versions and associated metadata. **Returns:** HTTP 204 No Content on successful deletion (empty response body).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `template_id` | string | Yes | The ID of the transactional template to delete. For dynamic templates, the ID starts with 'd-' (e.g., 'd-22171633557b454ab8e3c884e3319b7b'). For legacy templates, use the standard UUID format. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a transactional template version

**Slug:** `SENDGRID_DELETE_A_TRANSACTIONAL_TEMPLATE_VERSION`

**Delete a specific version of a transactional template.** This endpoint permanently removes a template version. Once deleted, the version cannot be recovered. If you want to delete all versions of a template at once, use the delete template endpoint instead. Note: Deleting the active version will not automatically activate another version. Returns HTTP 204 No Content on success with an empty response body.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `version_id` | string | Yes | The unique ID (UUID) of the template version to delete. You can obtain this from the template's version list or from the response when creating a template version. |
| `template_id` | string | Yes | The unique ID of the transactional template. For dynamic templates, this is in the format 'd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'. For legacy templates, this is a standard UUID. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete blocks

**Slug:** `SENDGRID_DELETE_BLOCKS`

Delete blocked email addresses from your SendGrid suppression list. Blocked emails are addresses that have been rejected by the receiving server. This endpoint provides two ways to delete blocks: 1. Delete ALL blocks: Set `delete_all=true` to remove all blocked addresses 2. Delete specific blocks: Provide an `emails` array with specific addresses to remove Note: Use either `delete_all` OR `emails`, not both. On success, returns an empty response (HTTP 204).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `emails` | array | No | A list of specific blocked email addresses to delete from your suppression list. Use this parameter OR 'delete_all', not both. Example: ['blocked@example.com', 'spam@domain.com'] |
| `delete_all` | boolean | No | Set to true to delete ALL blocked email addresses from your suppression list. Use this parameter OR 'emails', not both. When true, the 'emails' parameter is ignored. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete bounces

**Slug:** `SENDGRID_DELETE_BOUNCES`

Delete bounced email addresses from your SendGrid bounce suppression list. Use this action to remove email addresses from your bounce list, allowing you to attempt sending to them again. You can either delete all bounces at once by setting `delete_all` to true, or delete specific email addresses by providing them in the `emails` list. Note: You must provide exactly one of `delete_all` or `emails` - they cannot be used together.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `emails` | array | No | List of specific email addresses to delete from your bounce list. Cannot be used with the 'delete_all' parameter. Either 'delete_all' or 'emails' must be provided. |
| `delete_all` | boolean | No | Set to true to delete **all** emails in your bounce list. Cannot be used with the 'emails' parameter. Either 'delete_all' or 'emails' must be provided. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Bulk Delete Integrations

**Slug:** `SENDGRID_DELETE_BULK_INTEGRATION`

Bulk delete multiple Integrations by providing their IDs as a query parameter. Integrations are used for email event forwarding to third-party applications (e.g., Segment). Integration IDs can be retrieved by making a GET request to `/v3/marketing/integrations`. This operation is irreversible - deleted integrations cannot be recovered. Returns 204 No Content on success.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | array | Yes | A list of Integration IDs to delete. Integration IDs can be retrieved by making a GET request to `/v3/marketing/integrations`. Each ID should be a valid UUID string representing an existing integration. At least one ID is required. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete a cancellation or pause from a scheduled send

**Slug:** `SENDGRID_DELETE_CANCELLATION_OR_PAUSE_FROM_SCHEDULED_SEND`

Resume a paused or cancelled scheduled send by removing its pause/cancel status. This action deletes the cancellation or pause status from a batch of scheduled sends, effectively resuming them. Use this when you want to: - Resume a paused scheduled send that you previously stopped - Undo a cancel action (if done before the emails are discarded) **Important notes:** - The batch_id must have an existing pause or cancel status - Paused sends that are more than 72 hours past their scheduled time will be discarded as Expired (cannot be resumed) - Cancelled sends are discarded when their send_at time arrives - Returns HTTP 204 No Content on success (empty response body) - Returns HTTP 404 if the batch_id doesn't exist or has no status set **Workflow:** First use 'cancel_or_pause_a_scheduled_send' to pause/cancel, then use this action to resume if needed.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The unique identifier for a batch of scheduled sends that has been previously paused or cancelled. This batch_id must have an existing pause/cancel status set via the 'cancel_or_pause_a_scheduled_send' action. You can obtain batch IDs from 'retrieve_all_scheduled_sends' or by creating one with 'create_a_batch_id' and then setting its status. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete contacts

**Slug:** `SENDGRID_DELETE_CONTACTS`

Deletes contacts from your SendGrid Marketing Campaigns account. This is a destructive, irreversible operation. Deletions are processed asynchronously - a job_id is returned immediately that can be used to track progress. IMPORTANT: You must provide EITHER 'ids' (comma-separated contact UUIDs) to delete specific contacts, OR 'delete_all_contacts' set to "true" to delete all contacts. Do not use both. Requires Marketing Campaigns permissions (marketing.write scope). Twilio SendGrid recommends regularly exporting your contacts as a backup before deletion.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | string | No | A comma-separated list of contact IDs (UUIDs) to delete. Example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890,b2c3d4e5-f6a7-8901-bcde-f12345678901'. Use 'Search Contacts' or 'Get Contacts by Emails' actions to find contact IDs. You must specify either this parameter OR 'delete_all_contacts', but not both. |
| `delete_all_contacts` | string | No | Set to "true" to delete ALL contacts from your account. WARNING: This is irreversible and will remove all contacts. You must specify either this parameter OR 'ids', but not both. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete custom field definition

**Slug:** `SENDGRID_DELETE_CUSTOM_FIELD_DEFINITION`

Permanently deletes a custom field definition from SendGrid Marketing Campaigns. **Important notes:** - Only custom fields can be deleted; reserved fields (first_name, last_name, email, etc.) cannot be deleted. - Custom fields that are used by active segments cannot be deleted until the segments are removed or modified. - This action is irreversible - all contact data stored in the deleted custom field will be lost. - On success, returns HTTP 204 No Content with empty response body. **Use case:** Use this endpoint when you need to clean up unused custom fields or restructure your contact data schema. **Getting custom_field_id:** Use 'Get All Field Definitions' to list all custom fields and their IDs before deletion.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `custom_field_id` | string | Yes | The unique identifier of the custom field to delete. This ID is returned when creating a custom field via the 'Create Custom Field Definition' endpoint (e.g., 'e1_T', 'e2_N', 'e3_D' where the suffix indicates type: T=Text, N=Number, D=Date). Reserved fields (like 'first_name', 'last_name', 'email') cannot be deleted. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete design

**Slug:** `SENDGRID_DELETE_DESIGN`

**This endpoint allows you to delete a single design**. Be sure to check the ID of the design you intend to delete before making this request; deleting a design is a permanent action.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (ID) of the Design you want to delete (e.g., '250d8a0c-b190-41de-b6e7-364a11b0946a'). You can obtain design IDs from the 'Create Design' or 'List Designs' endpoints. This deletion action is permanent and cannot be undone. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete invalid emails

**Slug:** `SENDGRID_DELETE_INVALID_EMAILS`

Delete email addresses from your SendGrid invalid emails suppression list. Invalid emails are addresses that have hard bounced or have been identified as invalid. Removing addresses from this list allows SendGrid to attempt delivery to them again. Use cases: - Remove specific addresses that you want to retry sending to (use 'emails' parameter) - Clear the entire invalid emails list (use 'delete_all=true') WARNING: Deleting addresses from the suppression list is destructive and cannot be undone. Returns an empty response (HTTP 204) on success.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `emails` | array | No | A list of specific email addresses to remove from the invalid emails suppression list. Example: ['user1@example.com', 'user2@example.com']. This parameter is ignored if 'delete_all' is set to true. |
| `delete_all` | boolean | No | Set to true to delete ALL email addresses from the invalid emails suppression list. WARNING: This is a destructive operation that cannot be undone. Use with caution. If set to true, the 'emails' parameter is ignored. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete ip pool

**Slug:** `SENDGRID_DELETE_IP_POOL`

Delete an IP Pool from your SendGrid account using the IP Address Management API. This operation permanently deletes the specified IP Pool and automatically unassigns all IP addresses that were associated with the pool. The unassigned IP addresses will remain in your SendGrid account and can be reassigned to other pools. Note: This endpoint is part of the newer IP Address Management API (/v3/send_ips/pools) which may require specific API key permissions. For the legacy IP Pools API that uses pool names instead of IDs, see the 'Delete an IP pool' action at /v3/ips/pools/{pool_name}. Returns HTTP 204 No Content on successful deletion. Returns HTTP 404 if the specified pool does not exist.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `poolid` | string | Yes | The unique identifier (UUID) for the IP Pool to delete. This ID can be obtained from the 'Get all IP pools' endpoint in the IP Address Management API. Example format: '550e8400-e29b-41d4-a716-446655440000'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete pending teammate

**Slug:** `SENDGRID_DELETE_PENDING_TEAMMATE`

Delete a pending teammate invitation that hasn't yet been accepted. This endpoint cancels an outstanding invitation to join your SendGrid account as a teammate. Teammate invitations expire after 7 days if not accepted. Use this endpoint to revoke access before the invitee accepts. Once accepted, use 'Delete teammate' endpoint instead. Returns HTTP 204 No Content on successful deletion. Requires 'teammates.write' scope or full access API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | string | Yes | The unique token identifier for the pending teammate invitation to delete. This token can be obtained from the 'Retrieve all pending teammates' endpoint response. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete single send by id

**Slug:** `SENDGRID_DELETE_SINGLE_SEND_BY_ID`

Permanently deletes a Single Send by its unique ID. You can obtain the Single Send ID from the GET `/v3/marketing/singlesends` endpoint or the SendGrid Marketing Campaigns UI. Warning: This deletion is irreversible - the Single Send and all associated data will be permanently removed. Returns 204 No Content on successful deletion.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier of the Single Send to delete. You can obtain this ID from the GET `/v3/marketing/singlesends` endpoint or the SendGrid UI. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete single send schedule

**Slug:** `SENDGRID_DELETE_SINGLE_SEND_SCHEDULE`

Cancel a scheduled Single Send by deleting its scheduled send time. This action removes the schedule but preserves the Single Send as a draft - all campaign content (subject, body, recipients, etc.) remains intact and can be rescheduled or edited later. **Important distinctions:** - This endpoint removes only the *schedule*, not the Single Send itself - After deletion, the Single Send status changes from 'scheduled' to 'draft' - To permanently delete the entire Single Send, use DELETE /v3/marketing/singlesends/{id} **Success response:** HTTP 204 No Content (empty body) **Common errors:** - 404: Single Send ID not found - 422: Single Send is not currently scheduled (cannot unschedule a draft or sent campaign)

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the Single Send whose schedule you want to delete. This ID can be obtained from the 'Get All Single Sends' endpoint (GET /v3/marketing/singlesends), from the response when creating a Single Send, or from the Single Send's detail page URL in SendGrid Marketing Campaigns. Note: The Single Send must currently have a scheduled send time to delete. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete spam reports

**Slug:** `SENDGRID_DELETE_SPAM_REPORTS`

Delete spam reports from your SendGrid spam report suppression list. Use this action to remove email addresses from your spam reports list, allowing you to attempt sending to them again. You can either delete all spam reports at once by setting `delete_all` to true, or delete specific email addresses by providing them in the `emails` list. Note: You must provide exactly one of `delete_all` or `emails` - they cannot be used together. Use with caution - only delete spam reports when recipients explicitly request to receive emails again.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `emails` | array | No | A list of specific email addresses to remove from the spam report suppression list. Example: ['user1@example.com', 'user2@example.com']. Cannot be used together with 'delete_all' parameter. Either 'delete_all' or 'emails' must be provided. |
| `delete_all` | boolean | No | Set to true to delete ALL email addresses from the spam report suppression list. Use with caution as this removes all spam report suppressions. Cannot be used together with 'emails' parameter. Either 'delete_all' or 'emails' must be provided. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete teammate

**Slug:** `SENDGRID_DELETE_TEAMMATE`

Permanently delete a teammate from your SendGrid account. This endpoint removes a teammate's access to your account. Only the parent user or an admin teammate can delete another teammate. This action cannot be undone. **Important Notes:** - Deleted teammates cannot be recovered - Templates, campaigns, contacts, and API keys created by the teammate are NOT removed - Returns HTTP 204 No Content on successful deletion - Requires 'teammates.write' scope or full access API key

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | The username (email address) of the teammate to delete. This is the email address that was used when the teammate was invited. Must be an existing teammate in your SendGrid account. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete verified sender

**Slug:** `SENDGRID_DELETE_VERIFIED_SENDER`

Deletes a Verified Sender Identity from your SendGrid account. Use this endpoint to permanently remove a Verified Sender by providing its unique `id`. You can find Sender Identity IDs by using the "Get All Verified Senders" endpoint. On successful deletion, the API returns HTTP 204 No Content. Note: This action is destructive and cannot be undone. The sender will need to be re-created and re-verified if needed again.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier of the Verified Sender to delete. Use the 'Get All Verified Senders' endpoint to retrieve a list of sender IDs. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Deny access request

**Slug:** `SENDGRID_DENY_ACCESS_REQUEST`

Denies a teammate's pending access request. This action removes the request without granting the requested permissions. Only teammate admins can deny access requests. Use this to reject requests from teammates who are asking for additional permissions or scope access that you don't want to grant. Note: A successful denial returns HTTP 204 No Content with an empty response body.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `request_id` | string | Yes | The unique ID of the teammate's access request to deny. Access request IDs can be retrieved using the 'Retrieve access requests' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Disassociate a branded link from a subuser

**Slug:** `SENDGRID_DISASSOCIATE_A_BRANDED_LINK_FROM_A_SUBUSER`

Remove a branded link association from a subuser account. This endpoint allows parent accounts to disassociate a branded link from a subuser. After disassociation, the subuser will no longer be able to use the parent's branded link for email tracking. Prerequisites: - The subuser must have a branded link currently associated with it - The API key must have whitelabel permissions and subuser management access - This operation requires a SendGrid Pro plan or higher with subusers enabled Note: The API returns HTTP 204 No Content on success with an empty response body.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | The username of the subuser account that you want to disassociate a branded link from. The subuser must have a branded link currently associated with it. You can check a subuser's associated branded link using the 'Retrieve a subuser's branded link' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Domain warn list

**Slug:** `SENDGRID_DOMAIN_WARN_LIST`

Retrieves a list of domains known to implement DMARC (Domain-based Message Authentication, Reporting & Conformance) policies, categorized by failure type. DMARC failures affect email deliverability: - Hard failures: Emails using these domains as sender identities will NOT be delivered. - Soft failures: Emails may be delivered but could be marked as spam or have reduced deliverability. Use this endpoint to check if a domain you want to use as a sender identity has DMARC policies that could impact email delivery. Note: This endpoint requires the 'sender_verification' API scope.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Email Activity CSV Download URL

**Slug:** `SENDGRID_DOWNLOAD_CSV`

Retrieves a presigned S3 URL to download a CSV file of email activity data (up to 1M events, last 30 days). **Workflow:** 1. Use SENDGRID_REQUEST_CSV to initiate CSV generation 2. Wait for SendGrid email with download link containing the UUID 3. Extract UUID from the email's download link 4. Use this action with the UUID to get the presigned S3 URL (valid for 3 days) 5. Make GET request to the presigned URL to download the CSV **Requirements:** Pro/Premier plan with "30 Days Additional Email Activity History" add-on. **Limitations:** One CSV request per 12 hours. Returns 403 if add-on not enabled.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `download_uuid` | string | Yes | The unique identifier (UUID) for the CSV download request. This UUID is provided in the email sent to you by SendGrid when your CSV file is ready to download. The UUID can be extracted from the download link in that email. Example format: '6b2e1c1b-3c4d-5e6f-7a8b-9c0d1e2f3a4b'. Note: This endpoint requires a SendGrid Pro or Premier plan with Email Activity enabled. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Duplicate a transactional template

**Slug:** `SENDGRID_DUPLICATE_A_TRANSACTIONAL_TEMPLATE`

Duplicate an existing transactional template to create a new template with the same content. Each parent account and Subuser can create up to 300 different transactional templates. Templates are specific to the parent account or Subuser and cannot be shared between them.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | The name for the new duplicated transactional template. If not provided, the new template will have the same name as the original. |
| `template_id` | string | Yes | The ID of the transactional template to duplicate. Dynamic template IDs start with 'd-' (e.g., 'd-abc123'), while legacy template IDs are UUIDs. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Duplicate design

**Slug:** `SENDGRID_DUPLICATE_DESIGN`

Duplicates an existing email design in the SendGrid Design Library. Creates a copy of the specified design with a new unique ID. The duplicate can be customized with a new name, otherwise it will be named 'Duplicate: <original design name>'. Use this to quickly create variations of existing email templates for Single Sends, Automations, or Dynamic Templates.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique ID of the existing design you want to duplicate. Use the List Designs endpoint to find design IDs. |
| `name` | string | No | The name for the duplicated design. If not specified, the name will be 'Duplicate: <original design name>'. |
| `editor` | string ("code" | "design") | No | The editor type for the duplicated design. Use 'code' for raw HTML editing or 'design' for the drag-and-drop visual editor. If not specified, inherits from the original design. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Duplicate sendgrid pre built design

**Slug:** `SENDGRID_DUPLICATE_SEND_GRID_PRE_BUILT_DESIGN`

Duplicates a pre-built SendGrid email design template from the SendGrid Design Library. Pre-built designs are professionally designed email templates provided by SendGrid that can be duplicated and customized. The duplicate will be created in your personal Design Library with a unique ID. Use the 'List SendGrid Pre-built Designs' action first to retrieve available pre-built design IDs. Note: You cannot edit pre-built designs directly; you must duplicate them first and then modify your copy.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The ID of the pre-built Design you want to duplicate. |
| `name` | string | No | The name for the new duplicated design. If not specified, defaults to 'Duplicate: <original design name>'. |
| `editor` | string ("code" | "design") | No | The editor type for the duplicated design. Use 'code' for raw HTML editing or 'design' for the drag-and-drop visual editor. If not specified, defaults to the original design's editor type. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Duplicate Single Send

**Slug:** `SENDGRID_DUPLICATE_SINGLE_SEND`

Duplicates an existing Single Send by its ID, creating a new draft that can be edited via the Update Single Send endpoint (PATCH). The duplicate inherits all settings from the original including email content, recipients, and sender configuration. If no name is provided, the duplicate is automatically named 'Copy of [original name]' (limited to 100 characters). Use this to quickly create variations of successful campaigns without starting from scratch.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique ID of the Single Send to duplicate. You can retrieve Single Send IDs from the Get All Single Sends endpoint or from the Single Send detail page URL in the SendGrid Marketing Campaigns UI. |
| `name` | string | No | The name of the duplicate Single Send. If left blank, the duplicate will be named "Copy of [original name]". Names are limited to 100 characters and will be trimmed if they exceed this limit. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Edit an SSO Teammate

**Slug:** `SENDGRID_EDIT_AN_SSO_TEAMMATE`

Updates an existing SSO Teammate's permissions and profile in SendGrid. **Requirements**: Enterprise SendGrid account with SSO integration enabled. Only parent users or Teammates with admin permissions can update another Teammate. **Permission Assignment** (choose ONE approach): - Set `is_admin=true` for full admin access (do not use with scopes/persona) - Set `persona` for predefined permission sets (accountant/developer/marketer/observer) - Set `scopes` array for custom granular permissions **Subuser Access**: To restrict a Teammate to specific Subusers, set `has_restricted_subuser_access=true` and provide `subuser_access` array. **Note**: The `username` parameter is the Teammate's email address from your IdP.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scopes` | array | No | Custom list of permission scopes for granular access control. See SendGrid Teammate Permissions documentation for available scopes. Do not use with `persona` or when `is_admin=true`. |
| `persona` | string ("accountant" | "developer" | "marketer" | "observer") | No | Predefined permission sets that can be assigned to SSO teammates. |
| `is_admin` | boolean | No | Set to `true` to grant admin permissions (full access to all scopes). When `is_admin=true`, do NOT set `scopes` or `persona` as they will be ignored. |
| `username` | string | Yes | The SSO Teammate's email address (also their username). This must match the address assigned to the Teammate in your Identity Provider (IdP). Used as the path parameter to identify which teammate to edit. |
| `last_name` | string | No | The Teammate's last name. Provide to update the existing value. |
| `first_name` | string | No | The Teammate's first name. Provide to update the existing value. |
| `subuser_access` | array | No | List of Subusers the Teammate can access. Each item should include: 'id' (Subuser ID), 'permission_type' ('admin' or 'restricted'), and optionally 'scopes' for restricted access. Requires `has_restricted_subuser_access=true`. |
| `has_restricted_subuser_access` | boolean | No | Set to `true` to restrict the Teammate to only operate on behalf of specific Subusers. Must be `true` if `subuser_access` is provided. When `true`, cannot use `scopes`, `persona`, or `is_admin=true`. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Edit a transactional template

**Slug:** `SENDGRID_EDIT_A_TRANSACTIONAL_TEMPLATE`

Updates the name of an existing transactional template. This endpoint allows you to rename a transactional template without affecting its content or versions. To modify the actual template content (HTML, subject line, etc.), use the template versions API instead. Requires a valid template_id which can be obtained from the 'Retrieve paged transactional templates' or 'Create a transactional template' endpoints.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | The new name for the transactional template. When provided, must be a non-empty string. This only updates the template's name; to modify template content, use the template versions API. |
| `template_id` | string | Yes | The unique identifier of the transactional template to edit. For dynamic templates, this starts with 'd-' (e.g., 'd-22171633557b454ab8e3c884e3319b7b'). For legacy templates, it's a UUID format (e.g., 'dbc2c27d-b978-4840-aa2e-b7235745e37a'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Edit a transactional template version

**Slug:** `SENDGRID_EDIT_A_TRANSACTIONAL_TEMPLATE_VERSION`

Edit a transactional template version in SendGrid. This endpoint allows you to update the content, subject, name, and other properties of an existing template version. Use this to modify email templates used for transactional emails like password resets, order confirmations, or notifications. You can update: - HTML and plain text content - Subject line - Version name - Active status (to make this version the primary one) - Test data for previewing dynamic content Note: Both template_id and version_id are required to identify the specific version to edit.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | Name of the transactional template version. Used to identify different versions of the same template (e.g., 'Version 1', 'Holiday Update'). |
| `active` | integer | No | Set to 1 to make this version the active version of the template. Set to 0 to make it inactive. Only one version can be active at a time. |
| `editor` | string ("code" | "design") | No | The editor type used for this template version. 'code' for Code Editor (raw HTML), 'design' for Design Editor (drag-and-drop). |
| `subject` | string | No | Subject line of the email. Supports Handlebars substitution syntax for dynamic content (e.g., 'Hello {{first_name}}'). |
| `test_data` | string | No | For dynamic templates only. A JSON string containing mock data for template preview and test sends. Example: '{"first_name": "John", "order_id": "12345"}'. |
| `version_id` | string | Yes | The ID of the template version to edit. This is a UUID returned when creating or listing template versions. |
| `template_id` | string | Yes | The ID of the transactional template. Format: 'd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' for dynamic templates or UUID for legacy templates. |
| `html_content` | string | No | The HTML content of the email template. Supports Handlebars substitution syntax for dynamic content (e.g., '{{first_name}}'). Maximum of 1048576 bytes (1MB) allowed. |
| `plain_content` | string | No | Text/plain content of the transactional template version for email clients that don't support HTML. Maximum of 1048576 bytes (1MB) allowed. Auto-generated from html_content if generate_plain_content is true. |
| `generate_plain_content` | boolean | No | If true, plain_content is automatically generated from html_content. If false, plain_content is not altered and must be provided manually. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Edit verified sender

**Slug:** `SENDGRID_EDIT_VERIFIED_SENDER`

Updates an existing verified sender identity in SendGrid. This action allows partial updates - only the fields you specify will be modified, while all other fields remain unchanged. Use this to update sender display names, addresses, or contact information. Note: Changing the from_email address will require re-verification. First retrieve sender IDs using the 'Get All Verified Senders' action, then pass the ID along with the fields you want to update.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier of the verified sender to update. Retrieve IDs via the Get All Verified Senders endpoint. |
| `zip` | string | No | The postal or ZIP code of the sender's address (e.g., '94105'). |
| `city` | string | No | The city where the sender is located (e.g., 'San Francisco'). |
| `state` | string | No | The state or province where the sender is located (e.g., 'CA', 'California'). |
| `address` | string | No | The physical street address of the sender (e.g., '123 Main Street'). Required for CAN-SPAM compliance. |
| `country` | string | No | The country where the sender is located (e.g., 'USA', 'United States'). |
| `address2` | string | No | Additional address information such as suite, apartment, or floor number (e.g., 'Suite 100'). |
| `nickname` | string | No | A friendly name to identify this sender identity in the SendGrid UI (e.g., 'Marketing Campaigns', 'Support Notifications'). |
| `reply_to` | string | No | The email address where replies to sent emails should be directed. |
| `from_name` | string | No | The display name that will appear in the 'From' field alongside the email address (e.g., 'John Smith', 'Marketing Team'). |
| `from_email` | string | No | The email address that will appear in the 'From' field of sent emails. Note: Changing this requires re-verification. |
| `reply_to_name` | string | No | The display name for the reply-to email address (e.g., 'Customer Support'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Email dns records to a co worker

**Slug:** `SENDGRID_EMAIL_DNS_RECORDS_TO_A_CO_WORKER`

Email DNS records to a co-worker for domain authentication or link branding setup. This action sends an email containing the DNS records needed to configure domain authentication (DKIM, SPF) or link branding in your DNS provider. - With Automated Security enabled: Sends 3 CNAME records - With Automated Security disabled: Sends 2 TXT records and 1 MX record Provide `domain_id` for domain authentication records, `link_id` for link branding records, or both to send all required DNS records in one email. Use SENDGRID_LIST_ALL_AUTHENTICATED_DOMAINS to get valid domain_id values. Use SENDGRID_RETRIEVE_ALL_BRANDED_LINKS to get valid link_id values.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address of the co-worker who will receive the DNS records. This person should have access to configure DNS records in your domain's DNS provider. |
| `link_id` | integer | No | The ID of the branded link to send DNS records for. Get this from SENDGRID_RETRIEVE_ALL_BRANDED_LINKS. At least one of domain_id or link_id must be provided. |
| `message` | string | No | A custom message to include in the email body along with the DNS records. Use this to provide context or instructions to the recipient. |
| `domain_id` | integer | No | The ID of the authenticated domain to send DNS records for. Get this from SENDGRID_LIST_ALL_AUTHENTICATED_DOMAINS. At least one of domain_id or link_id must be provided. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Enable disable a subuser

**Slug:** `SENDGRID_ENABLE_DISABLE_A_SUBUSER`

Enable or disable a SendGrid subuser account. Use this endpoint to control whether a subuser can send emails: - Set `disabled=true` to disable the subuser (prevents email sending) - Set `disabled=false` to enable the subuser (allows email sending) Note: This only affects the subuser's ability to send emails via API. For website access control, use the separate website access endpoint. Requires 'Subuser Management' API permissions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `disabled` | boolean | Yes | Set to `true` to disable the subuser (prevent them from sending emails), or `false` to enable the subuser (allow them to send emails). |
| `subuser_name` | string | Yes | The username of the Subuser to enable or disable. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Enable disable website access for a subuser

**Slug:** `SENDGRID_ENABLE_DISABLE_WEBSITE_ACCESS_FOR_A_SUBUSER`

Enable or disable website portal access for a SendGrid subuser while preserving their email sending capabilities. Use this to control whether a subuser can log into the SendGrid web interface without affecting their ability to send emails via the API. Requires the 'subuser_admin' scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `disabled` | boolean | Yes | Controls website portal access for the subuser. Set to `true` to disable website access (subuser cannot log into SendGrid portal), or `false` to enable website access. Note: Email sending functionality remains unaffected regardless of this setting. |
| `subuser_name` | string | Yes | The username of the subuser whose website access you want to modify. This is the unique identifier for the subuser account. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Erase recipients email data

**Slug:** `SENDGRID_ERASE_RECIPIENTS_EMAIL_DATA`

Permanently erases recipients' personal email data from SendGrid for GDPR/privacy compliance. This operation removes PII (names, email addresses, subject lines, categories, IP addresses) for up to 5,000 email addresses per request (or 256KB payload limit). The erasure job runs asynchronously after a 202 Accepted response. IMPORTANT: - Deletions are irreversible and account-specific (does not affect Subusers) - Invalid email formats return an error - Rate limited to 100 requests/minute - Requires 'recipients.erasejob.create' scope Use this for data privacy compliance (GDPR, CCPA) when users request data deletion.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email_addresses` | array | Yes | List of unique recipient email addresses whose PII will be erased. You may include a maximum of 5,000 addresses or a maximum payload size of 256Kb, whichever comes first.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Export contacts

**Slug:** `SENDGRID_EXPORT_CONTACTS`

Initiates an asynchronous job to export Marketing Campaigns contacts to CSV or JSON. **Use Cases:** - Export all contacts from your SendGrid Marketing Campaigns database - Export contacts from specific lists by providing list_ids - Export contacts from specific segments by providing segment_ids - Create backups of your contact data (recommended regularly) **Workflow:** 1. Call this endpoint to start an export job (returns a job ID) 2. Poll the 'Export Contacts Status' endpoint with the job ID to check progress 3. When status is 'ready', download files from the returned URLs **Important Notes:** - Exports are asynchronous and may take time for large contact lists - Download URLs expire 72 hours after export completion - If notifications_email is true, download links are sent via email instead - Without list_ids or segment_ids, all contacts are exported

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `list_ids` | array | No | IDs of the contact lists to export. Provide one or more list UUIDs to export only contacts from those specific lists. If omitted along with segment_ids, all contacts will be exported. |
| `file_type` | string ("csv" | "json") | No | Export file format options. |
| `segment_ids` | array | No | IDs of the contact segments to export. Provide one or more segment UUIDs to export only contacts from those specific segments. If omitted along with list_ids, all contacts will be exported. |
| `max_file_size` | integer | No | Maximum size of each export file in MB (default: 5000 MB). When a single export exceeds this size, SendGrid will split it into multiple files. Valid range: 1-5000. |
| `notifications__email` | boolean | No | If true, sends an email with the download link to the account's notification email address when the export completes. If false or omitted, you must poll the 'Export Contacts Status' endpoint to retrieve download URLs. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Export contacts status

**Slug:** `SENDGRID_EXPORT_CONTACTS_STATUS`

Retrieves the status of a contact export job and provides download URLs when ready. Use this endpoint with an export job ID (returned by the 'Export Contacts' endpoint) to check the export status and get pre-signed URLs for downloading your contact CSV files. **Workflow:** 1. First, initiate an export using 'Export Contacts' (POST /v3/marketing/contacts/exports) 2. Use the returned job ID with this endpoint to poll for completion 3. When status is 'ready', use the URLs in the response to download CSV files **Status values:** - 'pending': Export is still being processed - 'ready': Export is complete and download URLs are available - 'failure': Export failed (check 'message' field for details) **Note:** Export files expire 72 hours after creation. Regular exports are recommended as a backup strategy.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the export job. This ID is returned by the 'Export Contacts' endpoint (POST /v3/marketing/contacts/exports) when initiating a contact export. Example format: '6b2e1c1b-3c4d-5e6f-7a8b-9c0d1e2f3a4b'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Export single send stats

**Slug:** `SENDGRID_EXPORT_SINGLE_SEND_STATS`

Exports Single Send campaign statistics in CSV format. This endpoint allows you to export stats for one or more Single Sends from SendGrid Marketing Campaigns. The exported CSV data includes engagement metrics such as opens, clicks, bounces, unsubscribes, and more. Use cases: - Export all Single Send stats when no IDs are specified - Export stats for specific Single Sends by providing their IDs - Adjust timezone for localized timestamp presentation Note: Requires Marketing Campaigns access in your SendGrid plan.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | array | No | The IDs of Single Sends for which to export stats. You can specify one or multiple Single Send IDs. If not provided, stats for all Single Sends will be exported. Use SENDGRID_GET_ALL_SINGLE_SENDS to retrieve available Single Send IDs. |
| `timezone` | string | No | The IANA Area/Region timezone string for presenting stats timestamps. Examples: 'America/Chicago', 'Europe/London', 'Asia/Tokyo', 'UTC'. This only affects the timezone format of timestamps in the exported data; it does not filter which stats are returned. Defaults to 'UTC' if not specified. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Filter all messages

**Slug:** `SENDGRID_FILTER_ALL_MESSAGES`

Filter and retrieve email activity from the SendGrid Email Activity Feed API. This action queries email messages sent through SendGrid and returns activity data based on the provided filter criteria. You can search by recipient, sender, subject, status, message ID, template ID, and date ranges. **IMPORTANT**: This endpoint requires the "30 Days Additional Email Activity History" paid add-on to be purchased and configured on your SendGrid account. Without this add-on, requests will return a 403 Forbidden error. Additionally, the API key must have "Email Activity" permissions enabled. Query examples: - Filter by status: `status="delivered"` - Filter by recipient: `to_email="user@example.com"` - Compound query: `status="delivered" AND to_email="user@example.com"` - Date range: `last_event_time BETWEEN TIMESTAMP "2024-01-01T00:00:00.000Z" AND TIMESTAMP "2024-01-31T23:59:59.999Z"` For more information, see: https://www.twilio.com/docs/sendgrid/for-developers/sending-email/getting-started-email-activity-api

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | The number of messages to return. Must be between 1 and 1000 (inclusive). Default is 10. |
| `query` | string | Yes | Query string to filter email activity. Supports fields like: to_email (recipient), from_email (sender), subject (email subject), status (delivered/not_delivered/processing), msg_id (message ID), template_id (template ID), last_event_time (timestamp). Examples: 'status="delivered"', 'to_email="user@example.com"', 'status="delivered" AND to_email="user@example.com"'. Use BETWEEN for date ranges: 'last_event_time BETWEEN TIMESTAMP "2024-01-01T00:00:00.000Z" AND TIMESTAMP "2024-01-31T23:59:59.999Z"'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Filter messages by message id

**Slug:** `SENDGRID_FILTER_MESSAGES_BY_MESSAGE_ID`

Retrieve detailed information about a specific email message by its unique message ID. This endpoint returns comprehensive details including sender, recipient, subject, delivery status, template ID, and a list of events associated with the message. **Requirements:** - The "30 Days Additional Email Activity History" paid add-on must be purchased - API key must have "Email Activity" permission enabled - Available on Pro plans and higher **Note:** For Regional (EU) subusers, no data will be generated. If these requirements are not met, the API will return a 403 Forbidden error.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `msg_id` | string | Yes | The unique message ID assigned by SendGrid to the email. This ID is returned in the X-Message-Id header when sending an email or can be retrieved from the Email Activity Feed API (GET /v3/messages). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get account offerings

**Slug:** `SENDGRID_GET_ACCOUNT_OFFERINGS`

Retrieves the offerings (email packages and add-ons) assigned to a specific customer account. IMPORTANT: This endpoint is part of the Account Provisioning API and is only available to Twilio SendGrid reseller partners with a formal partnership agreement. Standard SendGrid accounts will receive a 403 Forbidden error. Offerings include base email packages (e.g., Free, Essentials, Pro) and add-ons (e.g., Marketing Campaigns, Dedicated IPs, Expert Services). The available offerings depend on your reseller agreement with Twilio SendGrid. Use this endpoint to check what features are currently assigned to a customer account before making updates via the Update Account Offerings endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accountID` | string | Yes | The unique Twilio SendGrid account ID for the customer account. This is returned when creating an account via the Account Provisioning API or can be retrieved from the Get All Accounts endpoint. Format is typically a 20-character alphanumeric string (e.g., 'ZGkrHSypTsudrGkmdpJJ'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get a contact by id

**Slug:** `SENDGRID_GET_A_CONTACT_BY_ID`

Retrieves the full details of a single contact by their unique ID from SendGrid Marketing Campaigns. Returns all standard fields (email, name, address, etc.) and any custom fields defined for the contact. Use 'Get Contacts by Emails' or 'Search Contacts' endpoints to find a contact's ID first. Requires Marketing Campaigns permissions on your API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the contact to retrieve. You can obtain a contact's ID using the 'Get Contacts by Emails' or 'Search Contacts' endpoints. Example: 'ca7a3796-e8a8-4029-9ccb-df8937940562' |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get a list of all ip addresses on your account

**Slug:** `SENDGRID_GET_A_LIST_OF_ALL_IP_ADDRESSES_ON_YOUR_ACCOUNT`

Fetches your account's IP addresses with details such as pool association and warm-up status. 'is_parent_assigned' and 'pool' must be exclusive. Pagination needs 'limit' and 'before_key' or 'after_key'.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip` | string | No | Specifies an IP address. The `ip` query parameter can be used to filter results by IP address.  |
| `pool` | string | No | Specifies the unique ID for an IP Pool. When included, only IP addresses belonging to the specified Pool will be returned.  |
| `limit` | integer | No | Specifies the number of results to be returned by the API. This parameter can be used in combination with the `before_key` or `after_key` parameters to iterate through paginated results.  |
| `region` | string ("all" | "eu" | "us") | No | Allowed values are `all`, `eu`, and `us`. If you provide a specific region, results will include all pools that have at least one IP in the filtered region. If `all`, pools with at least one IP (regardless of region) will be returned. If the `region` filter is not provided, the query returns all pools, including empty ones.  |
| `after_key` | integer | No | Specifies which items to be returned by the API. When the `after_key` is specified, the API will return items beginning from the first item after the item specified. This parameter can be used in combination with `limit` to iterate through paginated results.  |
| `is_leased` | boolean | No | Indicates whether an IP address is leased from Twilio SendGrid. If `false`, the IP address is not a Twilio SendGrid IP; it is a customer"s own IP that has been added to their Twilio SendGrid account.  |
| `before_key` | string | No | Specifies which items to be returned by the API. When the `before_key` is specified, the API will return items beginning from the first item before the item specified. This parameter can be used in combination with `limit` to iterate through paginated results.  |
| `is_enabled` | boolean | No | Indicates if the IP address is billed and able to send email. This parameter applies to non-Twilio SendGrid APIs that been added to your Twilio SendGrid account. This parameter"s value is `null` for Twilio SendGrid IP addresses.  |
| `end_added_at` | integer | No | The `start_added_at` and `end_added_at` parameters are used to set a time window. IP addresses that were added to your account in the specified time window will be returned. The `end_added_at` parameter sets the end of the time window.  |
| `include_region` | boolean | No | Boolean indicating whether or not to return the IP Pool"s region information in the response.  |
| `start_added_at` | integer | No | The `start_added_at` and `end_added_at` parameters are used to set a time window. IP addresses that were added to your account in the specified time window will be returned. The `start_added_at` parameter sets the beginning of the time window.  |
| `is_parent_assigned` | boolean | No | A parent must be assigned to an IP address before the parent can send mail from the IP and before the address can be assigned to an IP pool. Set this parameter value to true to allow the parent to send mail from the IP and make the IP eligible for IP pool assignment using the IP pool endpoints.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get a list of all senders

**Slug:** `SENDGRID_GET_A_LIST_OF_ALL_SENDERS`

Retrieves a list of all Sender identities associated with your SendGrid account. Sender identities are used in Marketing Campaigns to define the 'from' information for your emails. This endpoint supports pagination through query parameters. **Pagination:** Use the `limit` parameter to control page size (default 500 if not specified). Use `lastSeenID` for cursor-based pagination by passing the ID of the last sender from the previous page to get the next page of results. **Filtering:** Use the `id` parameter to retrieve information about a specific sender identity. **Verification:** Only verified senders can be used to send emails. Check the `verified.status` field in the response to determine if a sender is ready for use. **Note:** Senders may be locked if they are associated with a campaign in Draft, Scheduled, or In Progress status.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | No | Returns information about only the specific Sender Identity with this ID. Use this to filter results to a single sender. |
| `limit` | integer | No | The maximum number of Sender identities to return. Default is 500 if not specified. Use this to control page size when paginating through results. |
| `lastSeenID` | integer | No | Returns senders with an ID number occurring after the passed in ID. Use this for cursor-based pagination - pass the ID of the last sender from the previous page to get the next page of results. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get a list of subusers assigned to an ip

**Slug:** `SENDGRID_GET_A_LIST_OF_SUBUSERS_ASSIGNED_TO_AN_IP`

Retrieves a list of Subuser IDs assigned to a specific IP address in your SendGrid account. Returns up to 100 subuser IDs per request. Use pagination parameters ('after_key' and 'limit') to iterate through large result sets. The response includes subuser IDs only; use the Subusers API to get detailed information about each subuser.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip` | string | Yes | The IP address to query for assigned subusers. Must be a valid IPv4 address that exists in your SendGrid account (e.g., '149.72.123.45'). |
| `limit` | integer | No | Maximum number of subuser IDs to return per request. Valid range is 1-100. If not specified, the API uses its default limit. Use with 'after_key' for pagination. |
| `after_key` | integer | No | Pagination cursor for retrieving the next page of results. When specified, the API returns items starting from the first item after this key. Use the 'after_key' value from the previous response's '_metadata' to get subsequent pages. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get all accounts

**Slug:** `SENDGRID_GET_ALL_ACCOUNTS`

Retrieves all accounts under the organization.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | The number of items to return |
| `offset` | string | No | The last item successfully retrieved |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get all automation stats

**Slug:** `SENDGRID_GET_ALL_AUTOMATION_STATS`

Retrieve email statistics for SendGrid Marketing Automations (automated email workflows). Returns performance metrics including delivery rates, opens, unique_opens, clicks, unique_clicks, bounces, unsubscribes, and spam_reports for each Automation. Supports filtering by specific Automation IDs and pagination for large result sets. Requirements: - API key must have the 'marketing.read' or 'marketing.automation.read' scope - Account must have Advanced Marketing Campaigns subscription - If IP whitelisting is enabled, the requestor's IP must be whitelisted Note: This endpoint may return empty results if no Marketing Automations exist in the account.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page_size` | integer | No | Number of Automation stat records to return per page. Valid range: 1-50. Default: 25. |
| `page_token` | string | No | Pagination token to retrieve a specific page of results. Obtained from the '_metadata.next' or '_metadata.prev' URLs in previous responses. Omit for the first page. |
| `automation_ids` | array | No | Optional list of Automation IDs to filter statistics. If omitted, returns stats for all Automations. Use this to retrieve statistics for specific marketing automation workflows. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get all available offerings

**Slug:** `SENDGRID_GET_ALL_AVAILABLE_OFFERINGS`

Retrieves all available SendGrid offerings for account provisioning. This is a Partner/Reseller API endpoint that lists all the SendGrid product offerings that can be assigned to customer accounts. These include email packages, dedicated IPs, Marketing Campaigns, and other add-on features. Note: This endpoint is only available to SendGrid reseller partners with a formal partnership agreement. Access requires: - Valid partner API credentials - IP address whitelisting on SendGrid's partner API The returned offerings can be used when creating or updating customer accounts via the Account Provisioning API.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get All Single Sends Categories

**Slug:** `SENDGRID_GET_ALL_CATEGORIES`

Retrieve all categories associated with your Marketing Campaigns Single Sends. This endpoint returns up to your latest 1,000 categories that have been used to organize and tag your Single Sends in SendGrid's Marketing Campaigns. Categories help you filter and track your Single Sends by topic, campaign type, or any custom grouping you define. **Use cases**: - List all existing categories before creating a new Single Send - Verify category names for filtering Single Sends searches - Audit category usage across your marketing campaigns **Limitations**: - Returns up to 1,000 most recent categories - Paid plans: 1,000 categories daily limit - Free plans: 100 categories daily limit **Note**: This endpoint requires Marketing Campaigns API access. The API key must have the appropriate marketing scopes (marketing.read) and the requestor's IP address may need to be whitelisted for Marketing API access. **Response**: Returns a list of category name strings.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get all existing exports

**Slug:** `SENDGRID_GET_ALL_EXISTING_EXPORTS`

Retrieves all existing contact export jobs from SendGrid Marketing Campaigns. Returns an array of export jobs with their status, type, creation/completion timestamps, and download URLs for ready exports. Use this endpoint when you need to check the status of exports but don't have the export IDs. Export files are available for download for 72 hours after creation. Possible status values: 'pending', 'ready', or 'failure'.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get all field definitions

**Slug:** `SENDGRID_GET_ALL_FIELD_DEFINITIONS`

Retrieve all field definitions including custom and reserved fields from Marketing Campaigns. This action returns complete information about all field definitions in your SendGrid account: - **Custom Fields**: User-created fields (up to 500) with Text, Number, or Date types. Can be edited/deleted. - **Reserved Fields**: System-defined fields (email, first_name, last_name, etc.). Read-only, cannot be modified. Each field includes its unique ID (used in API calls), name, type, and metadata with management URLs. Useful for discovering field IDs needed for contact management operations. No parameters required - simply call to get all field definitions.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get all ip pools that have associated ips

**Slug:** `SENDGRID_GET_ALL_IP_POOLS_THAT_HAVE_ASSOCIATED_IPS`

The function lists your IP Pools and samples up to 10 IPs from each. For more IPs per pool, use "Get IPs Assigned to an IP Pool." Max of 100 IP Pools per user.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip` | string | No | Specifies an IP address. The `ip` query parameter can be used to filter results by IP address.  |
| `limit` | integer | No | Specifies the number of results to be returned by the API. This parameter can be used in combination with the `before_key` or `after_key` parameters to iterate through paginated results.  |
| `region` | string ("all" | "eu" | "us") | No | Allowed values are `all`, `eu`, and `us`. If you provide a specific region, results will include all pools that have at least one IP in the filtered region. If `all`, pools with at least one IP (regardless of region) will be returned. If the `region` filter is not provided, the query returns all pools, including empty ones.  |
| `after_key` | integer | No | Specifies which items to be returned by the API. When the `after_key` is specified, the API will return items beginning from the first item after the item specified. This parameter can be used in combination with `limit` to iterate through paginated results.  |
| `include_region` | boolean | No | Boolean indicating whether or not to return the IP Pool"s region information in the response.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get all sender identities

**Slug:** `SENDGRID_GET_ALL_SENDER_IDENTITIES`

**This endpoint allows you to retrieve a list of all sender identities that have been created for your account.**

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get all single sends

**Slug:** `SENDGRID_GET_ALL_SINGLE_SENDS`

Retrieve a list of your Single Sends with brief details, including their IDs. For in-depth information on a specific Single Send, use its ID at the `/marketing/singlesends/{id}` endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page_size` | integer | No | Page Size |
| `page_token` | string | No | Page Token |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get all single sends stats

**Slug:** `SENDGRID_GET_ALL_SINGLE_SENDS_STATS`

Retrieve email statistics for SendGrid Single Sends (one-time marketing email campaigns). Returns performance metrics including delivery rates, opens, clicks, bounces, and unsubscribes for each Single Send. Supports filtering by specific Single Send IDs and pagination for large result sets. Use this action to analyze the performance of your marketing email campaigns and track engagement metrics over time. Requires the 'marketing.read' API scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page_size` | integer | No | Number of Single Send stat records to return per page. Valid range: 1-50. Default: 25. |
| `page_token` | string | No | Pagination token to retrieve a specific page of results. Obtained from the '_metadata.next' or '_metadata.prev' URLs in previous responses. Omit for the first page. |
| `singlesend_ids` | array | No | Optional list of Single Send IDs to filter statistics. If omitted, returns stats for all Single Sends. Use this to retrieve statistics for specific marketing email campaigns. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get All SSO Certificates by Integration

**Slug:** `SENDGRID_GET_ALL_SSO_CERTIFICATES_BY_INTEGRATION`

Retrieves all SSO (Single Sign-On) certificates associated with a specific IdP integration. The `integration_id` parameter should be obtained from the 'Get All SSO Integrations' endpoint. Each certificate contains the X509 public certificate used to verify SAML authentication requests. Note: This endpoint requires an account with SSO features enabled.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `integration_id` | string | Yes | The unique ID of the SSO integration whose certificates to retrieve. Obtain this ID from the 'Get All SSO Integrations' endpoint response. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get all sso integrations

**Slug:** `SENDGRID_GET_ALL_SSO_INTEGRATIONS`

**This endpoint allows you to retrieve all SSO integrations tied to your Twilio SendGrid account.** The IDs returned by this endpoint can be used by the APIs additional endpoints to modify your SSO integrations.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `si` | boolean | No | If this parameter is set to `true`, the response will include the `completed_integration` field.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get all verified senders

**Slug:** `SENDGRID_GET_ALL_VERIFIED_SENDERS`

Retrieve all Sender Identities (verified/unverified) for an account via an endpoint. Customize results using `limit`, `lastSeenID`, and `id` parameters to define the results scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | No | Returns information about only the Sender Identity passed in the request.  |
| `limit` | integer | No | Specifies the number of results to be returned by the API. This parameter can be used to limit the results returned or in combination with the `lastSeenID` parameter to iterate through paginated results.  |
| `lastSeenID` | integer | No | Returns senders with an ID number occurring after the passed in ID. In other words, the `lastSeenID` provides a starting point from which SendGrid will iterate to find Sender Identities associated with your account.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Account State

**Slug:** `SENDGRID_GET_AN_ACCOUNT_S_STATE`

Retrieve the current state of a customer account using the Account Provisioning API. IMPORTANT: This endpoint is only available to Twilio SendGrid reseller partners with a formal partnership agreement. Standard SendGrid accounts will receive a 403 Forbidden error. The account state indicates whether the customer can send email: - 'activated': Account is active and can send email - 'deactivated': Account is deactivated and cannot send email - 'suspended': Account is temporarily suspended - 'banned': Account is permanently banned - 'indeterminate': Unknown state - contact SendGrid support if encountered

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accountID` | string | Yes | The unique Twilio SendGrid account ID for the customer account whose state you want to retrieve. This ID is returned when creating an account via the SENDGRID_CREATE_AN_ACCOUNT action or can be retrieved using SENDGRID_GET_ALL_ACCOUNTS. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get an SSO Certificate

**Slug:** `SENDGRID_GET_AN_SSO_CERTIFICATE`

Retrieve an individual SSO certificate by its ID. SSO (Single Sign-On) certificates are X509 certificates used by SendGrid to verify that SAML requests are coming from your Identity Provider (IdP) such as Okta, Azure AD, or other SAML-compatible providers. Note: This endpoint requires SSO to be enabled on your SendGrid account (typically available on Pro or higher plans) and appropriate API key permissions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cert_id` | string | Yes | The unique ID of the SSO certificate to retrieve. This ID is returned when creating a certificate or can be obtained from the 'Get All SSO Certificates by Integration' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get an sso integration

**Slug:** `SENDGRID_GET_AN_SSO_INTEGRATION`

**This endpoint allows you to retrieve an SSO integration by ID.** You can retrieve the IDs for your configurations from the response provided by the "Get All SSO Integrations" endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier of the SSO integration to retrieve. You can obtain this ID from the 'Get All SSO Integrations' endpoint response. |
| `si` | boolean | No | If this parameter is set to `true`, the response will include the `completed_integration` field indicating whether the integration setup is complete. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get a specific sender

**Slug:** `SENDGRID_GET_A_SPECIFIC_SENDER`

Retrieves the details of a specific Marketing Sender by its unique ID. Returns comprehensive sender information including: - Sender identification (ID, nickname) - Email configuration (from email/name, reply-to email/name) - Physical address details (address, city, state, zip, country) - Status flags (verified, locked) - Timestamps (created_at, updated_at) Note: Only verified Senders can be used to send emails. A Sender becomes locked when associated with a campaign in Draft, Scheduled, or In Progress status.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The unique numeric identifier of the Marketing Sender to retrieve. This ID is returned when creating a sender or listing all senders. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get a User's Account Information

**Slug:** `SENDGRID_GET_A_USER_S_ACCOUNT_INFORMATION`

Retrieves the authenticated user's SendGrid account details including account type (e.g., 'free', 'paid') and sender reputation score (0-100). This is a read-only endpoint that requires no parameters. The response includes the account type which indicates the user's subscription level, and the reputation score which reflects the sender's email deliverability standing. Required scope: user.account.read

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get User Profile

**Slug:** `SENDGRID_GET_A_USER_S_PROFILE`

Retrieve the authenticated user's profile details. This endpoint returns the current user's profile information including their name, contact details, company, and address. No parameters are required - the profile is retrieved for the authenticated user based on the API key used. **Required API Scope:** user.profile.read

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Automation Click Tracking Stats

**Slug:** `SENDGRID_GET_AUTOMATION_CLICK_TRACKING_STATS_BY_ID`

Retrieve click-tracking statistics for a specific SendGrid Marketing Automation. Returns detailed link click statistics including the URL of each link, its position in the email, and the total number of clicks received. Results can be grouped by automation step for multi-step automations. Use this endpoint to analyze which links in your automation emails are performing best and optimize your email content accordingly. Requires the 'marketing.read' API scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier of the Automation to retrieve click tracking stats for. This ID is returned when creating an automation or listing automations. |
| `group_by` | array | No | Group the results by additional dimensions. Use ['step_id'] to get per-step granularity for automations with multiple steps. |
| `step_ids` | array | No | Filter results to only include specific automation steps. Provide a list of step IDs to retrieve link stats for those steps only. |
| `page_size` | integer | No | Number of link stat records to return per page. Valid range: 1-50. Default: 25. |
| `page_token` | string | No | Pagination token to retrieve a specific page of results. Obtained from the '_metadata.next' or '_metadata.prev' URLs in previous responses. Omit for the first page. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get automation stats by id

**Slug:** `SENDGRID_GET_AUTOMATION_STATS_BY_ID`

Retrieve detailed stats for a specific Automation by ID, with optional date and aggregation filters, or use another endpoint to get stats for multiple Automations.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the Marketing Campaigns Automation for which you want to retrieve statistics. Use the 'Get All Automation Stats' endpoint to list available automation IDs. |
| `end_date` | string | No | Format: `YYYY-MM-DD`. The end date for filtering statistics. If not provided, defaults to today's date. |
| `group_by` | array | No | Automations can have multiple steps. Including `step_id` as a `group_by` metric allows further granularity of stats for each step. |
| `step_ids` | array | No | List of specific step IDs to filter stats. Only returns stats for the specified automation steps. |
| `timezone` | string | No | [IANA Area/Region](https://en.wikipedia.org/wiki/Tz_database#Names_of_timezones) string representing the timezone in which the stats are to be presented, e.g., "America/Chicago".  |
| `page_size` | integer | No | The number of elements you want returned on each page. |
| `page_token` | string | No | Token for pagination. Use the value from `_metadata.next` in the response to get the next page. If `_metadata.prev` is absent, you are at the first page. If `_metadata.next` is absent, you are at the last page. |
| `start_date` | string | No | Format: `YYYY-MM-DD`. The start date for filtering statistics. If not provided, defaults to the automation's creation date. |
| `aggregated_by` | string ("total" | "day" | "week" | "month") | No | Dictates how the stats are time-sliced. Supported values: 'total', 'day', 'week', or 'month'. Use 'day' for daily breakdowns, 'week' for weekly, 'month' for monthly, or 'total' for aggregate stats. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get batched contacts by ids

**Slug:** `SENDGRID_GET_BATCHED_CONTACTS_BY_IDS`

Retrieves multiple SendGrid Marketing Contacts by their IDs in a single batch request. This is more efficient than making individual GET requests when you need to fetch multiple contacts at once. You can supply up to 100 contact IDs per request. Use cases: - Fetch contact details for a list of known contact IDs - Verify contact existence before performing operations - Bulk retrieve contact data for reporting or sync purposes Note: Contact IDs can be obtained from 'Search Contacts', 'Get Contacts by Emails', or 'Add or Update a Contact' actions. For backup purposes, consider using the Export Contacts feature to regularly backup your contacts.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | array | Yes | A list of SendGrid contact IDs (UUIDs) to retrieve. You can specify up to 100 IDs per request. Contact IDs can be obtained from actions like 'Search Contacts', 'Get Contacts by Emails', or 'Add or Update a Contact'. Example: ["d3a4f1b2-1234-5678-90ab-cdef12345678", "a1b2c3d4-5678-90ab-cdef-123456789012"] |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get bounce statistics by classification

**Slug:** `SENDGRID_GET_BOUNCE_CLASS_STATS`

Retrieve daily bounce statistics filtered by a specific classification type. Returns the number of bounces for the specified classification (e.g., 'Invalid Address', 'Reputation', 'Technical Failure') in descending order for each day within the given date range. Use this to analyze bounce patterns by classification over time. Classifications help categorize SMTP bounce responses into meaningful groups like: - Content: Issues with email content - Invalid Address: Hard bounces from non-existent addresses - Mailbox Unavailable: Temporary mailbox issues - Reputation: Sender reputation problems - Technical Failure: Server/connection issues - Frequency or Volume Too High: Rate limiting - Unclassified: Ambiguous responses

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `end_date` | string | No | The end of the time range, in YYYY-MM-DD format, when a bounce was created (inclusive).  |
| `start_date` | string | No | The start of the time range, in YYYY-MM-DD format, when a bounce was created (inclusive).  |
| `classification` | string | Yes | The classification you want to filter by. Possible values are: `Content`, `Frequency or Volume Too High`, `Invalid Address`, `Mailbox Unavailable`, `Reputation`, `Technical Failure`, `Unclassified`.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Bulk Email Validation Job by ID

**Slug:** `SENDGRID_GET_BULK_VALIDATION_JOB`

Retrieves the details of a specific Bulk Email Address Validation Job by its ID. Use this endpoint to check the status and progress of a bulk email validation job. You can track whether a job is pending, processing, or completed, and when results are available for download. **Prerequisites:** - This feature requires a Pro or Premier SendGrid account with Email Address Validation enabled. - The API key must have the 'Email Address Validation' scope. **Job Statuses:** - `Pending`: Job created but file not yet uploaded - `Ready`: File uploaded, waiting to process - `Processing`: Validation in progress - `Done`: Validation complete, results available - `Error` or `Failed`: Job encountered an error

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `job_id` | string | Yes | The unique identifier of the Bulk Email Address Validation Job to retrieve. This ID is returned when you create a bulk validation job via the upload endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Contacts by Emails

**Slug:** `SENDGRID_GET_CONTACTS_BY_EMAILS`

Search for Marketing Campaigns contacts by their email addresses. This endpoint retrieves up to 100 contacts matching the provided emails, with case-insensitive matching that ignores whitespace. Returns 200 on success with matching contacts, 404 if no contacts match, or 400 for invalid email formats. This is simpler than using SGQL queries when you have specific email addresses to look up.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `emails` | array | Yes | A list of email addresses to search for in your Marketing Campaigns contacts. Supports up to 100 email addresses. Both primary and alternate emails are matched. The search is case-insensitive and ignores leading/trailing whitespace. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get contacts by identifiers

**Slug:** `SENDGRID_GET_CONTACTS_BY_IDENTIFIERS`

Retrieves up to 100 Marketing Campaigns contacts by searching for specific identifier values. Choose one identifier_type (email, phone_number_id, external_id, or anonymous_id) and provide a list of values to search. Returns a mapping of each searched identifier to its corresponding contact data. Found contacts include full details; not-found identifiers return empty objects. Returns 200 on success, 404 if no contacts match, 400 for invalid requests.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `identifiers` | array | Yes | A list of identifier values to search for (maximum 100). The values must match the chosen identifier_type. For email: provide email addresses; for phone_number_id: provide phone number IDs; for external_id: provide external IDs; for anonymous_id: provide anonymous IDs. |
| `identifier_type` | string | Yes | The type of identifier to search for. Valid values are: email, phone_number_id, external_id, anonymous_id. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get design

**Slug:** `SENDGRID_GET_DESIGN`

Retrieves a specific design's details from your Design Library by its ID. Returns the full design object including HTML content, plain text content, editor type, timestamps, and thumbnail URL. Useful for inspecting design details before making updates via the update design endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the Design you want to retrieve from your Design Library. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get details for an ip address

**Slug:** `SENDGRID_GET_DETAILS_FOR_AN_IP_ADDRESS`

Retrieves detailed information about a specific IP address on your SendGrid account. Returns information including: - Parent assignment status (whether the parent can send mail from this IP) - Automatic warmup settings - Associated IP Pools (with IDs and names) - Creation and modification timestamps - Billing and enablement status - Lease status (whether it's a SendGrid IP or customer-owned) - Region information (if include_region=True) Note: This endpoint is part of the IP Address Management API (beta) and requires appropriate IP management permissions. For Subuser information, use a different endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip` | string | Yes | The IP address to retrieve details for (e.g., '149.72.123.45'). Must be a valid IPv4 address that exists on your SendGrid account. |
| `include_region` | boolean | No | When set to True, includes the IP Pool's region information ('us' or 'eu') in the response. Defaults to False. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get details for an ip pool

**Slug:** `SENDGRID_GET_DETAILS_FOR_AN_IP_POOL`

This operation retrieves details of an IP Pool, such as name, ID, some sample IPs (up to 10), and the total IP count. For more IPs, use "Get IPs Assigned to an IP Pool."

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `poolid` | string | Yes | The unique identifier for the IP Pool to retrieve details for. |
| `include_region` | boolean | No | When set to true, includes regional information (e.g., 'us' or 'eu') for the IP Pool in the response. Defaults to false. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all suppression groups for an email address

**Slug:** `SENDGRID_GET_EMAIL_SUPPRESSION_GROUPS`

**Retrieve all suppression groups for a specific email address.** This endpoint returns a list of all suppression groups in your SendGrid account, along with the suppression status of the specified email address in each group. Suppressed emails will not receive content sent under their respective suppression groups. **Use cases:** - Check which groups an email address is suppressed in - Verify email subscription status across all groups - Debug delivery issues for a specific recipient **Note:** The API requires the `asm.groups.suppressions.read` scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address to retrieve suppression group memberships for. Must be a valid email format (e.g., 'user@example.com'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get engagement quality scores

**Slug:** `SENDGRID_GET_ENGAGEMENT_QUALITY_SCORES`

Retrieve SendGrid Engagement Quality (SEQ) scores for a specified date range. SEQ is a composite deliverability score (1-5) based on engagement metrics from mailbox providers. Higher scores indicate better engagement and inbox placement. Returns 200 with scores if available, or 202 if scores are still being calculated. Requirements for scores: - Open tracking must be enabled - Account must have sent at least 1,000 messages in the past 30 days Note: SEQ scores are stored for a maximum of 90 days.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `to` | string | Yes | The ending date in YYYY-MM-DD format (UTC) for the date range. Example: '2024-01-31'. Must be on or after the 'from' date. |
| `from` | string | Yes | The starting date in YYYY-MM-DD format (UTC) for the date range. Example: '2024-01-01'. Note: SEQ scores are stored for a maximum of 90 days. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve email statistics by country and state province

**Slug:** `SENDGRID_GET_GEO_STATS`

Retrieves email engagement statistics (opens, clicks) segmented by geographic location (country and state/province). Currently supports US and Canada statistics only. Use this endpoint to analyze how your emails perform in different geographic regions. Note: SendGrid stores up to 7 days of email activity, and returns max 500 items by default. Requires 'geo.stats.read' API permission scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum number of results to return. Defaults to 500 if not specified. Note: SendGrid stores only up to 7 days of email activity. |
| `offset` | integer | No | The index position to start retrieving results from (0-based pagination). Use with 'limit' for paging through large result sets. |
| `country` | string ("US" | "CA") | No | Filter statistics by country. Currently only 'US' (United States) and 'CA' (Canada) are supported. If not provided, returns statistics for all supported countries. |
| `end_date` | string | No | The ending date for the statistics query in YYYY-MM-DD format. Defaults to today's date if not specified. |
| `start_date` | string | Yes | Required. The beginning date for the statistics query in YYYY-MM-DD format (e.g., '2024-01-15'). |
| `aggregated_by` | string ("day" | "week" | "month") | No | Time period to aggregate statistics by. Options: 'day' (daily stats), 'week' (weekly stats), or 'month' (monthly stats). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get information on a single suppression group

**Slug:** `SENDGRID_GET_INFORMATION_ON_A_SINGLE_SUPPRESSION_GROUP`

Retrieves details for a single suppression group (also known as an unsubscribe group). A suppression group allows recipients to unsubscribe from specific types of emails (e.g., newsletters, alerts) rather than all emails. Use this endpoint to get the group's name, description, default status, and the count of unsubscribed addresses. Note: You can create up to 200 suppression groups per SendGrid account.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `group_id` | string | Yes | The unique numeric ID of the suppression group to retrieve. You can find group IDs via the 'Get suppression groups' endpoint or in the SendGrid UI under Unsubscribe Groups. |
| `on-behalf-of` | string | No | The subuser's username to make the API call on behalf of. This allows parent accounts to access subuser resources. Format: 'subuser_username' |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Marketing Integration

**Slug:** `SENDGRID_GET_INTEGRATION`

Retrieve a specific Marketing Integration by its unique ID. An Integration is a connection from SendGrid Marketing Campaigns to a supported third-party application (currently only Segment is supported). This allows you to customize and automate email event forwarding to your Segment account. Returns the full Integration object including its configuration settings, email event filters, and destination properties.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the Marketing Integration to retrieve. This ID is returned when creating an integration or can be obtained from the List Integrations endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get ips assigned to an ip pool

**Slug:** `SENDGRID_GET_IPS_ASSIGNED_TO_AN_IP_POOL`

Retrieves IP addresses assigned to a specific IP Pool. This endpoint is part of the IP Address Management API (beta) and requires dedicated IP addresses and appropriate API permissions. The response includes IP address details and optionally region information. Use pagination parameters (limit, after_key) for large result sets. Note: This feature requires a SendGrid Pro plan or higher with dedicated IP addresses.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | The maximum number of IP addresses to return per request. Use this with `after_key` for pagination through large result sets. |
| `poolid` | string | Yes | The unique identifier for an IP Pool. This ID can be obtained from the 'Get all IP Pools' endpoint. |
| `after_key` | integer | No | A pagination cursor. When specified, returns IP addresses starting after this key. Use the value from the previous response's pagination metadata to fetch the next page of results. |
| `include_region` | boolean | No | When set to true, includes the region information (e.g., 'us' or 'eu') for each IP address in the response. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve the warmup status for a specific ip address

**Slug:** `SENDGRID_GET_IP_WARMUP_STATUS`

Retrieve the warmup status for a specific dedicated IP address. IP warmup is the process of gradually increasing email sending volume through a new IP to build sender reputation. This endpoint returns the IP address and when it entered warmup mode. Use 'Retrieve all IPs currently in warmup' endpoint first to get a list of IPs that are currently warming up. Requires a SendGrid account with dedicated IP addresses and appropriate API permissions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip_address` | string | Yes | The dedicated IP address to retrieve warmup status for. Must be a valid IPv4 address (e.g., '149.72.86.14') that belongs to your SendGrid account and is currently in the warmup process. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get list contact count

**Slug:** `SENDGRID_GET_LIST_CONTACT_COUNT`

Retrieve the contact count and billable contact count for a specific marketing list. Returns both the total number of contacts currently stored in the list and the number of billable contacts (those that count toward your billing quota). This is useful for monitoring list growth, validating contact additions, and tracking billing-relevant metrics without retrieving full contact details. The list ID must be a valid UUID from the new Marketing Campaigns API. Legacy contactdb list IDs (numeric format) are not compatible with this endpoint. Required API scope: 'marketing.read' (provides access to Marketing Campaigns API). Note: If IP Access Management is enabled on your SendGrid account, ensure the requesting server's IP address is whitelisted to avoid 403 Forbidden errors.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the marketing list whose contact count you want to retrieve. Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 characters including hyphens). Use the 'Get All Lists' or 'Create List' action to obtain valid list IDs. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get list of segments

**Slug:** `SENDGRID_GET_LIST_OF_SEGMENTS`

Retrieves a filtered list of contact segments from SendGrid Marketing Campaigns V2. Segments group contacts based on SQL queries for targeted email campaigns. Use filters to retrieve specific segments by ID, segments associated with particular lists, or segments without parent list restrictions. Filter options (applied in order of precedence): 1. 'ids' - Get specific segments by UUID (ignores other filters) 2. 'parent_list_ids' - Get segments filtered by specific contact lists 3. 'no_parent_list_id' - Get segments without list filters (global segments) Returns empty list if no segments match criteria. Contact counts refresh hourly. Newly created segments may show 0 contacts initially, populating within 15-30 minutes.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | array | No | List of segment IDs (UUIDs) to retrieve. When specified, only these segments are returned and other filter parameters (parent_list_ids, no_parent_list_id) are ignored. Maximum 50 IDs. Example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'] |
| `parent_list_ids` | string | No | Comma-separated list of list IDs to filter segments. Returns segments that were created with any of these lists as parent filters. Maximum 50 list IDs. Example: 'list-id-1,list-id-2'. Ignored if 'ids' parameter is provided. |
| `no_parent_list_id` | boolean | No | When true, returns only segments without parent list filters (segments built from all contacts). When false (default), returns segments with parent lists. Ignored if 'ids' parameter is provided. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Open Tracking Settings

**Slug:** `SENDGRID_GET_OPEN_TRACKING_SETTINGS`

Retrieves the current open tracking settings for your SendGrid account. Open tracking works by inserting an invisible image (tracking pixel) at the end of HTML emails. When a recipient opens the email and their email client loads images, SendGrid logs an 'open' event. The response indicates whether open tracking is enabled. Open event data is available in SendGrid's Statistics portal and can be received via Event Webhook. Note: Open tracking only works with HTML emails where images are enabled. Plain text emails cannot be tracked for opens. Required scope: tracking_settings.open.read

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Recipient Upload Status (Legacy)

**Slug:** `SENDGRID_GET_RECIPIENT_UPLOAD_STATUS`

Retrieves the upload status for recipients in the Legacy Marketing Campaigns contacts database (contactdb). Use this endpoint to monitor the progress of recipient data being processed after bulk uploads via the Add Recipients endpoint. **IMPORTANT - Legacy API:** This is a Legacy Marketing Campaigns API endpoint. It may not be accessible for newer SendGrid accounts created after the migration to Marketing Campaigns. For newer accounts, use the Import Contacts Status endpoint (`import_contacts_status`) instead. **No parameters required** - simply call this endpoint to get the current upload status for all pending recipient upload operations. **Common use case:** After calling `add_recipients` to bulk upload contacts, use this endpoint to check if the upload has completed processing.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get remaining ips count

**Slug:** `SENDGRID_GET_REMAINING_IPS_COUNT`

**This endpoint gets amount of IP Addresses that can still be created during a given period and the price of those IPs.**

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get sample contacts

**Slug:** `SENDGRID_GET_SAMPLE_CONTACTS`

Retrieves a sample of up to 50 contacts from your Marketing Contacts database, sorted by email address. Includes the total contact count. This endpoint is useful for quickly previewing contacts without pagination. For full contact exports, use the Export Contacts endpoint instead. Requires Marketing Campaigns read access.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get SendGrid Pre-built Design

**Slug:** `SENDGRID_GET_SEND_GRID_PRE_BUILT_DESIGN`

Retrieves details of a specific SendGrid pre-built design template by ID. Pre-built designs are professional email templates provided by SendGrid that you can duplicate and customize. Use this to inspect a design's HTML content, subject line, and metadata before duplicating it via the 'Duplicate SendGrid Pre-built Design' endpoint. Requires Marketing Campaigns access.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the SendGrid pre-built design to retrieve. Use the 'List SendGrid Pre-built Designs' endpoint to get available design IDs. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get signed event webhook's public key

**Slug:** `SENDGRID_GET_SIGNED_EVENT_WEBHOOK_S_PUBLIC_KEY`

Retrieves the public key for a specific Event Webhook by ID. The public key is used to verify the signature of incoming webhook requests (found in the X-Twilio-Email-Event-Webhook-Signature header). Use this endpoint after enabling signature verification to get the key needed for validation. Webhook IDs can be found using the 'Retrieve all of your event webhooks' action.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The ID of the Event Webhook whose public key you want to retrieve. Use the 'Retrieve all of your event webhooks' action to get a list of webhook IDs. The ID is a UUID string (e.g., '2e8e8159-0fa9-4e45-bd38-950ea9527a05'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get single send by id

**Slug:** `SENDGRID_GET_SINGLE_SEND_BY_ID`

**This endpoint allows you to retrieve details about one Single Send using a Single Send ID.** You can retrieve all of your Single Sends by making a GET request to the `/marketing/singlesends` endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the Single Send to retrieve. You can get Single Send IDs by calling the GET /marketing/singlesends endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get single send click tracking stats by id

**Slug:** `SENDGRID_GET_SINGLE_SEND_CLICK_TRACKING_STATS_BY_ID`

**This endpoint lets you retrieve click-tracking stats for one Single Send**. The stats returned list the URLs embedded in the specified Single Send and the number of clicks each one received.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The ID of Single Send for which you want to retrieve link stats. |
| `group_by` | array | No | A/B Single Sends have multiple variation IDs and phase IDs. Including these additional fields allows further granularity of stats by these fields.  |
| `page_size` | integer | No | The number of elements you want returned on each page. |
| `page_token` | string | No | The stats endpoints are paginated. To get the next page, call the passed `_metadata.next` URL. If `_metadata.prev` does not exist, you are at the first page. Similarly, if `_metadata.next` is not present, you are at the last page. |
| `ab_phase_id` | string ("test" | "send") | No | The phase ID of an A/B test. Use 'test' to get stats from the test phase, or 'send' to get stats from the final send phase. |
| `ab_variation_id` | string | No | The ID of an A/B test variation. Use this to filter stats for a specific variation of an A/B Single Send. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get single sends search

**Slug:** `SENDGRID_GET_SINGLE_SENDS_SEARCH`

Search for Single Sends (marketing email campaigns) by name, status, and/or categories. Use this endpoint to find specific Single Sends when you have many campaigns. - Search by name using partial/wildcard matching - Filter by status: 'draft', 'scheduled', or 'triggered' - Filter by categories (returns campaigns matching ANY specified category) Results are paginated. Use page_token from the response to retrieve additional pages. Requires Marketing Campaigns API access (marketing.singlesends.read scope).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | Search for Single Sends by name using wildcard matching. The search is case-insensitive and matches partial names. Example: 'welcome' matches 'Welcome Email', 'welcome-new-users', etc. |
| `status` | array | No | Filter by Single Send status. Accepts multiple values: 'draft' (not yet sent), 'scheduled' (queued for future send), 'triggered' (already sent). Example: ['draft', 'scheduled']. |
| `page_size` | integer | No | Number of Single Sends to return per page. Controls pagination size for the search results. |
| `categories` | array | No | Filter by categories. Returns Single Sends that match ANY of the specified categories (OR logic). Example: ['Newsletter', 'Promotion']. |
| `page_token` | string | No | Token for retrieving the next page of results. Returned in the response metadata when more results are available. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get single send stats by id

**Slug:** `SENDGRID_GET_SINGLE_SEND_STATS_BY_ID`

Retrieve individual Single Send stats using its ID. For multiple IDs, use "Get All Single Sends Stats". Filter results by date or refine with `group_by` and `aggregated_by` parameters.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The ID of Single Send for which you want to retrieve stats. |
| `end_date` | string | No | Format: YYYY-MM-DD. The end date for the stats search period. If not specified, defaults to the current date. |
| `group_by` | array | No | For A/B Single Sends, allows grouping stats by 'ab_variation' or 'ab_phase' to see performance metrics for each variation or test phase separately. |
| `timezone` | string | No | [IANA Area/Region](https://en.wikipedia.org/wiki/Tz_database#Names_of_timezones) string representing the timezone in which the stats are to be presented, e.g., "America/Chicago".  |
| `page_size` | integer | No | The number of elements you want returned on each page. |
| `page_token` | string | No | Token for pagination. To get the next page, use the value from `_metadata.next` in the response. If `_metadata.prev` doesn't exist, you're at the first page. If `_metadata.next` is not present, you're at the last page. |
| `start_date` | string | No | Format: YYYY-MM-DD. The start date for the stats search period. If not specified, defaults to the Single Send's creation date. |
| `aggregated_by` | string ("total" | "day" | "week" | "month") | No | Dictates how the stats are time-sliced. Supported values: 'total', 'day', 'week', 'month'. Use 'total' for aggregate stats or 'day'/'week'/'month' for time-series data. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get subuser monthly stats

**Slug:** `SENDGRID_GET_SUBUSER_MONTHLY_STATS`

Retrieves monthly email statistics for a specific subuser. Returns metrics such as blocks, bounces, clicks, delivered emails, opens, requests, unique clicks/opens, and unsubscribes. **Note**: This endpoint requires the `subusers.stats.monthly.read` API scope and is only available for SendGrid Pro plans and above that have subusers configured. **Important**: Sort operations are not available for: bounce_drops, deferred, invalid_emails, processed, spam_report_drops, spam_reports, or unsubscribe_drops metrics.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | string | Yes | The date of the month to retrieve statistics for. Must be formatted YYYY-MM-DD. For example, '2025-01-01' retrieves statistics for January 2025. |
| `limit` | integer | No | The maximum number of results to return. Defaults to 5. |
| `offset` | integer | No | The starting point in the result list for pagination. Defaults to 0. |
| `subuser_name` | string | Yes | The username of the Subuser whose monthly email statistics you want to retrieve. |
| `sort_by_metric` | string ("blocks" | "bounces" | "clicks" | "delivered" | "opens" | "requests" | "unique_clicks" | "unique_opens" | "unsubscribes") | No | The metric to sort results by. Valid values are: 'blocks', 'bounces', 'clicks', 'delivered', 'opens', 'requests', 'unique_clicks', 'unique_opens', 'unsubscribes'. Default is 'delivered'. |
| `sort_by_direction` | string ("desc" | "asc") | No | Sort direction for ordering results. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get subusers engagement quality scores

**Slug:** `SENDGRID_GET_SUBUSERS_ENGAGEMENT_QUALITY_SCORES`

Retrieve SendGrid Engagement Quality (SEQ) scores for all subusers on a specific date. Returns engagement scores (1-5 scale, higher is better) that measure email deliverability based on recipient engagement metrics like open rates, bounce rates, and spam complaints. Requirements: Subusers must have open tracking enabled and sent 1,000+ messages in the past 30 days to receive a score. Response codes: 200 (scores available), 202 (scores being calculated - retry later). Note: This endpoint requires parent account access with subuser management permissions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | string | Yes | Required. The date in YYYY-MM-DD format (UTC) for which to retrieve engagement quality scores. Example: '2025-01-20'. Scores are stored for a maximum of 90 days. |
| `limit` | integer | No | Maximum number of subuser results to return per request. Use with 'after_key' for pagination through large result sets. Default: 1000. |
| `after_key` | integer | No | Pagination cursor from a previous response. When specified, returns results starting after this position. Use the 'after_key' value from the previous response to iterate through paginated results. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get suppression groups

**Slug:** `SENDGRID_GET_SUPPRESSION_GROUPS`

This endpoint provides a list of user-created suppression groups and can return info for multiple groups when their IDs are added to the request with `?id=123456`.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | No | The ID of the suppression group(s) you want to retrieve. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get teammate subuser access

**Slug:** `SENDGRID_GET_TEAMMATE_SUBUSER_ACCESS`

Retrieve Subusers accessible to a specified Teammate, including their permission levels and scopes. Admin Teammates have access to all Subusers. For restricted Teammates, only returns Subusers they have explicit access to. Supports pagination via after_subuser_id and filtering by username.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum number of Subusers to return per request. Default is 100. |
| `username` | string | No | Filter results by a specific Subuser username. |
| `teammate_name` | string | Yes | The username of the Teammate for whom you want to retrieve Subuser access information. |
| `after_subuser_id` | integer | No | The Subuser ID from which the API request will begin retrieving Subusers. Use this for pagination to retrieve additional Subusers in successive API calls. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get the credits for a subuser

**Slug:** `SENDGRID_GET_THE_CREDITS_FOR_A_SUBUSER`

Retrieves credit information for a specific Subuser account, including the credit type (unlimited, recurring, or nonrecurring), reset frequency, remaining credits, total allowable credits, and used credits. **Note**: This endpoint requires parent account credentials with subuser management permissions. Subuser accounts cannot access this endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `subuser_name` | string | Yes | The username of the Subuser to retrieve credits for. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get the default authentication

**Slug:** `SENDGRID_GET_THE_DEFAULT_AUTHENTICATION`

Retrieves the default domain authentication configuration for your SendGrid account. The default domain is used to send all mail unless overridden by a matching authenticated domain for the 'From' address. Returns domain details (id, subdomain, domain, username, IPs, DNS records, validation status) if a default is set. Required scope: whitelabel.read

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain` | string | No | Optional domain name to filter the default authentication lookup. If provided, returns the default authentication that matches this domain. If omitted, returns the account's global default domain authentication. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get the settings for a single event webhook

**Slug:** `SENDGRID_GET_THE_SETTINGS_FOR_A_SINGLE_EVENT_WEBHOOK`

Retrieves the configuration and settings for a single Event Webhook by its ID. Returns the webhook URL, enabled status, subscribed event types (bounce, click, delivered, open, etc.), and OAuth/signature settings if configured. Use 'Get All Event Webhooks' endpoint first to obtain webhook IDs.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique ID of the Event Webhook to retrieve. This is a UUID string returned when creating the webhook or from the 'Get All Event Webhooks' endpoint. |
| `include` | string | No | Optional parameter to include additional fields in the response. The only valid value is 'account_status_change', which adds the `account_status_change` field to the response payload (defaults to false). This field indicates whether the webhook receives account status change events related to compliance actions taken by SendGrid. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get total contact count

**Slug:** `SENDGRID_GET_TOTAL_CONTACT_COUNT`

Retrieve the total number of contacts stored in your SendGrid Marketing Campaigns account. This endpoint returns: - The total contact count across all lists and segments - The billable contact count for the current billing period - A breakdown of billable contacts by subuser (if applicable) Use this to monitor your contact database size and track billing-relevant metrics. No parameters are required - simply call this endpoint to get your current counts. Requires the 'marketing.read' API scope.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a list of scopes for which this user has access

**Slug:** `SENDGRID_GET_USER_SCOPES`

Retrieve a list of scopes for which this user has access

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Import contacts

**Slug:** `SENDGRID_IMPORT_CONTACTS`

Initiates a bulk contact import by requesting an upload URL for a CSV file. This is step 1 of a two-step process: 1. Call this action with field mappings to get an upload_uri and upload_headers 2. PUT your CSV file to the upload_uri with the required headers Supports up to 1 million contacts or 5GB per import (whichever is smaller). CSV files may be gzip-compressed. The import runs asynchronously - use the returned job_id with the 'Import Contacts Status' action to track progress. Requires at least one contact identifier in field_mappings: email, phone_number_id, external_id, or anonymous_id. Contacts are upserted - existing contacts (matched by identifier) are updated, new ones are created.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `list_ids` | array | No | Optional list of SendGrid Marketing List IDs (UUIDs) to add all imported contacts to. Use the 'Get All Lists' action to retrieve available list IDs. Example: ['ca7a3796-e8a8-4029-9ccb-df8937940562'] |
| `file_type` | string ("csv") | Yes | The type of file being uploaded. Currently only 'csv' is supported. The CSV file can optionally be gzip-compressed. |
| `field_mappings` | array | Yes | A list that maps CSV columns to SendGrid contact fields. Each element corresponds to a column in the CSV file. Use reserved field IDs (e.g., 'email', 'first_name', 'last_name', 'address_line_1', 'city', 'country') or custom field IDs for custom fields. Use null to skip a column. At least one identifier field is required: 'email', 'phone_number_id', 'external_id', or 'anonymous_id'. Example: ['email', 'first_name', 'last_name', null, 'custom_field_id'] maps columns 1-3 to standard fields, skips column 4, and maps column 5 to a custom field. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Import contacts status

**Slug:** `SENDGRID_IMPORT_CONTACTS_STATUS`

Check the status of a contact import, update, or delete job in SendGrid Marketing Campaigns. Use this endpoint to monitor asynchronous contact operations by providing the job_id returned from contact modification endpoints. Returns the job status ('pending', 'completed', 'errored', or 'failed'), processing counts (created, updated, deleted, errored), and timestamps. If errors occurred, an errors_url is provided to download detailed error information.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The job_id (UUID) of the contact import operation to check. This ID is returned from the 'Add or Update a Contact' (PUT /v3/marketing/contacts), 'Import Contacts' (PUT /v3/marketing/contacts/imports), or 'Delete Contacts' (DELETE /v3/marketing/contacts) endpoints. Example: 'abc12345-1234-5678-abcd-1234567890ab' |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Invite teammate

**Slug:** `SENDGRID_INVITE_TEAMMATE`

Invite teammates to your account through email with this endpoint, assigning initial permissions via the `scopes` array. Invites expire after 7 days but can be resent.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | New teammate"s email |
| `scopes` | array | Yes | Set to specify list of scopes that teammate should have. Should be empty if teammate is an admin.  |
| `is_admin` | boolean | No | Set to true if teammate should be an admin user |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List all authenticated domains

**Slug:** `SENDGRID_LIST_ALL_AUTHENTICATED_DOMAINS`

Retrieve authenticated domain lists in pages using the `limit` parameter for page size and `offset` to start from specific list positions. Multiple requests handle large lists.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | `limit` sets the page size, i.e. maximum number of items from the list to be returned for a single API request. If omitted, the default page size is used.  |
| `domain` | string | No | Search for authenticated domains. |
| `offset` | integer | No | The number of items in the list to skip over before starting to retrieve the items for the requested page. The default `offset` of `0` represents the beginning of the list, i.e. the start of the first page. To request the second page of the list, set the `offset` to the page size as determined by `limit`. Use multiples of the page size as your `offset` to request further consecutive pages. E.g. assume your page size is set to `10`. An `offset` of `10` requests the second page, an `offset` of `20` requests the third page and so on, provided there are sufficiently many items in your list.  |
| `username` | string | No | The username associated with an authenticated domain. |
| `exclude_subusers` | boolean | No | Exclude subuser domains from the result. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List all subusers

**Slug:** `SENDGRID_LIST_ALL_SUBUSERS`

Retrieve a paginated list of subusers with filtering options. Use `username` to filter, `limit` to set page size, and `offset` to navigate through the list.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | `limit` sets the page size, i.e. maximum number of items from the list to be returned for a single API request. If omitted, the default page size is used.  |
| `offset` | integer | No | The number of items in the list to skip over before starting to retrieve the items for the requested page. The default `offset` of `0` represents the beginning of the list, i.e. the start of the first page. To request the second page of the list, set the `offset` to the page size as determined by `limit`. Use multiples of the page size as your `offset` to request further consecutive pages. E.g. assume your page size is set to `10`. An `offset` of `10` requests the second page, an `offset` of `20` requests the third page and so on, provided there are sufficiently many items in your list.  |
| `region` | string ("all" | "global" | "eu") | No | Filter for Subusers in this region. If not provided, all Subusers will be returned. All users can also be explicitly requested by using the filter `all`. Users who are not pinned to a region will be displayed as `global`.  |
| `username` | string | No | The username of this subuser. |
| `include_region` | boolean | No | Optional flag to include the regions of the Subusers in the response. If not provided, the region will be omitted from the response.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List api keys

**Slug:** `SENDGRID_LIST_API_KEYS`

Retrieve user's API key names and IDs with this endpoint; keys themself cannot be retrieved for security. Lost keys require recreation. Use 'api_key_id' to manage keys.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Limit |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Bulk Email Validation Jobs

**Slug:** `SENDGRID_LIST_BULK_EMAIL_VALIDATION_JOBS`

Retrieves a list of all Bulk Email Address Validation Jobs for the account. Bulk Email Validation allows you to upload a CSV file with up to 1 million email addresses to be validated asynchronously. Each job has a status indicating whether it is pending, processing, done, or has errors. **Note**: This feature requires a Pro or Premier SendGrid account with Email Address Validation enabled. The API key must have the 'Email Address Validation' scope.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List designs

**Slug:** `SENDGRID_LIST_DESIGNS`

List designs from the Design Library. Fetches user-created designs stored in the SendGrid Design Library (part of Marketing Campaigns). Returns up to 100 designs per request by default, with pagination support via page_token. Use summary=True for basic info or summary=False to include full HTML/plain content. Note: This endpoint requires the new Marketing Campaigns platform. Pre-built SendGrid designs are available at a different endpoint (/v3/designs/pre-builts). Required scope: design_library.read

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `summary` | boolean | No | Set to False to return all design fields; True returns summary information only (default: True) |
| `page_size` | integer | No | Number of results to return per page (default: 100, max: 100) |
| `page_token` | string | No | Token corresponding to a specific page of results, as provided by the _metadata field in previous responses. Used for pagination. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Listintegration

**Slug:** `SENDGRID_LIST_INTEGRATION`

This endpoint returns all the Integrations for the user making this call.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List sendgrid pre built designs

**Slug:** `SENDGRID_LIST_SEND_GRID_PRE_BUILT_DESIGNS`

The `designs/pre-builts` endpoint fetches a list of Twilio SendGrid's ready-made designs, not user-specific ones, with 100 results per request by default, adjustable with `page_size`. Useful for duplicating and editing design IDs.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `summary` | boolean | No | set to false to return all fields |
| `page_size` | integer | No | number of results to return |
| `page_token` | string | No | token corresponding to a specific page of results, as provided by metadata  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List the authenticated domain associated with the given user

**Slug:** `SENDGRID_LIST_USER_AUTH_DOMAINS`

Retrieves all authenticated domains that have been assigned to a specific subuser. Authenticated domains allow subusers to send email using their parent account's domain authentication. Requires the 'whitelabel.read' scope and is only available on Pro plan or higher.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | The username of the subuser whose authenticated domains you want to retrieve. This must be a valid subuser username belonging to the parent account making the API call. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Manually refresh a segment

**Slug:** `SENDGRID_MANUALLY_REFRESH_A_SEGMENT`

Manually refresh a Marketing Campaigns V2 segment to update its contact membership. This endpoint triggers an immediate refresh of the segment's contact list based on its query criteria. Normally, SendGrid refreshes segments hourly, but this allows you to force an update when needed. IMPORTANT LIMITATIONS: - Requires a Marketing Campaigns Basic or Advanced plan (returns 403 for free accounts) - Maximum 2 refreshes per segment per day (resets at midnight in user's timezone) - Minimum 1 hour between refreshes for the same segment - Maximum 10 refresh requests across all segments per day (resets at 0:00 UTC) After a successful refresh request, contacts matching the segment criteria will be updated within 15-30 minutes depending on segment complexity.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `segment_id` | string | Yes | The unique ID of the Marketing Campaigns V2 segment to refresh. This must be a segment created via the Segmenting Contacts V2 API (endpoint /v3/marketing/segments/2.0). You can obtain segment IDs by listing segments using the Get List of Segments endpoint. |
| `user_time_zone` | string | Yes | The user's timezone in IANA time zone format (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo'). This timezone is used to reset the daily refresh count at midnight in the user's local time. See the full list of valid timezone identifiers at https://en.wikipedia.org/wiki/List_of_tz_database_time_zones |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Request Presigned URL for Bulk Email Validation

**Slug:** `SENDGRID_PRESIGNED_URL_HEADERS_FOR_BULK_EMAIL_VALIDATION`

Request a presigned URL and headers to upload a file containing email addresses for bulk validation. This endpoint returns an upload URL (upload_uri), request headers (upload_headers), and a job ID (job_id) which can be used to track the validation progress. The file can contain up to 1 million email addresses or 50 MB of data. After uploading, SendGrid asynchronously validates the emails and sends results to the account's email address. Note: This feature requires a Pro or Premier level SendGrid account with Email Address Validation permissions enabled on the API key. Workflow: 1. Call this endpoint to get the presigned URL and headers 2. Use the returned upload_uri and upload_headers to PUT your CSV file 3. Use the job_id with the 'Get Bulk Email Validation Job' endpoint to track progress

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file_type` | string ("csv" | "zip") | No | The format of the file to upload for bulk email validation. Supported values: 'csv' for CSV files or 'zip' for ZIP archives containing CSV files with email addresses. The content-type header in the response upload_headers will match this file type. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Remove an ip address from a pool

**Slug:** `SENDGRID_REMOVE_AN_IP_ADDRESS_FROM_A_POOL`

Remove an IP address from an IP pool in your SendGrid account. This endpoint allows you to disassociate a dedicated IP address from an IP pool. After removal, the IP address will no longer be used when sending emails through that pool. The IP address remains in your account and can be added to another pool or used independently. Prerequisites: - The IP pool must exist in your SendGrid account - The IP address must be currently assigned to the specified pool - Your API key must have the 'ips.pools.ips.delete' scope Note: Each SendGrid account can have up to 100 IP pools.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip` | string | Yes | The IP address to remove from the pool in standard IPv4 format (e.g., '149.72.160.189'). This must be a dedicated SendGrid IP address that is currently assigned to the specified pool. |
| `pool_name` | string | Yes | The name of the IP pool from which to remove the IP address. Pool names are case-sensitive. If the name contains spaces, they must be URL encoded (e.g., 'My Pool' becomes 'My%20Pool'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Remove an ip from an authenticated domain

**Slug:** `SENDGRID_REMOVE_AN_IP_FROM_AN_AUTHENTICATED_DOMAIN`

Remove an IP address from an authenticated domain's custom SPF configuration. This endpoint dissociates a dedicated IP address from an authenticated domain, which is useful when you no longer want that IP to be included in your custom SPF record for the domain. **Prerequisites:** - The domain must already be authenticated (created via Authenticate a Domain endpoint) - The IP must currently be associated with the domain - Your API key must have 'whitelabel.delete' or 'whitelabel.update' permissions **Important Notes:** - Domain Authentication was formerly called 'Domain Whitelabel' - Returns HTTP 204 No Content on success (empty response body) - Returns HTTP 403 Forbidden if API key lacks required permissions - Returns HTTP 404 Not Found if the domain ID does not exist or IP is not associated - The IP must be a dedicated IP address currently associated with the domain

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The numeric ID of the authenticated domain from which to remove the IP address. You can retrieve this ID by listing all authenticated domains using the List All Authenticated Domains endpoint. |
| `ip` | string | Yes | The IP address to remove from this authenticated domain's custom SPF configuration. This must be an IP address that is currently associated with the domain. Example: '192.168.1.1'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Remove a specific ip from the allowed list

**Slug:** `SENDGRID_REMOVE_A_SPECIFIC_IP_FROM_THE_ALLOWED_LIST`

Removes a specific IP address from your SendGrid account's allow list. Use this to revoke access for an IP. Get the rule_id from the 'Retrieve a list of currently allowed IPs' endpoint. WARNING: Removing your own IP will block your account access, requiring a support ticket to resolve.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rule_id` | string | Yes | The unique ID of the allowed IP address rule to remove. Obtain this ID from the 'Retrieve a list of currently allowed IPs' endpoint. Example: '1427687285'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Remove contacts from a list

**Slug:** `SENDGRID_REMOVE_CONTACTS_FROM_A_LIST`

Remove contacts from a marketing list without deleting them from your account. This endpoint allows you to remove one or more contacts from a specified list. The contacts will not be deleted from your SendGrid account - only their membership in the specified list will be removed. They will remain available for use in other lists, segments, or campaigns. The removal operation is asynchronous and returns a job_id to track progress. This is useful when removing large numbers of contacts. Note: This uses the Marketing Campaigns API (/v3/marketing/lists). List IDs and contact IDs are UUIDs. For the legacy Contact Database API, use 'Delete a single recipient from a single list' instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the marketing list from which to remove contacts. Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 characters). Obtain this ID from the 'Get all lists' or 'Create list' endpoints in the Marketing Campaigns API. |
| `contact_ids` | string | Yes | A comma-separated string of contact IDs (UUIDs) to remove from the specified list. Example: 'id1,id2,id3'. Each contact ID should be a valid UUID. Contacts will remain in your SendGrid account but will no longer be members of this list. Obtain contact IDs from the 'Search contacts', 'Get contacts by emails', or 'Get contact by ID' endpoints. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Remove list and optional contacts

**Slug:** `SENDGRID_REMOVE_LIST_AND_OPTIONAL_CONTACTS`

Delete a marketing list from your SendGrid account. This endpoint permanently removes a specific list from your Marketing Campaigns. When delete_contacts is false (default), only the list is deleted and contacts remain in your account for use in other lists or segments. When delete_contacts is true, all contacts on the list are also permanently deleted via an asynchronous background job. A job_id is returned to track the deletion progress. Note: This uses the Marketing Campaigns API (/v3/marketing/lists). List IDs are UUIDs (e.g., 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'). For the legacy Contact Database API with integer list IDs, use 'Delete a list' instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the marketing list to delete. Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 characters). Obtain this ID from the 'Get all lists' or 'Create list' endpoints in the Marketing Campaigns API. |
| `delete_contacts` | boolean | No | When set to true, all contacts on the list will also be permanently deleted in addition to deleting the list. The deletion runs as an asynchronous background job - a job_id is returned to track progress. When false (default), only the list is deleted and contacts remain in your account. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Remove one or more ips from the allow list

**Slug:** `SENDGRID_REMOVE_ONE_OR_MORE_IPS_FROM_THE_ALLOW_LIST`

Removes one or more IP addresses from your SendGrid IP Access Management allow list. This endpoint accepts an array of IP rule IDs (integers) obtained from listing allowed IPs or from the response when adding IPs to the allow list. IDs can be retrieved using the 'retrieve_a_list_of_currently_allowed_ips' action. WARNING: Removing your own IP address will block access to your account. You will need to submit a support ticket to restore access. Double-check the IDs before calling this endpoint. On success, the API returns HTTP 204 with no content body.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | array | Yes | An array of the unique integer IDs of IP addresses to remove from the allow list. These IDs can be obtained from the 'retrieve_a_list_of_currently_allowed_ips' endpoint or from the response when adding IPs. Example: [1234567890, 9876543210]. Warning: Removing your own IP may block access to your account. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Remove segment without affecting contacts

**Slug:** `SENDGRID_REMOVE_SEGMENT_WITHOUT_AFFECTING_CONTACTS`

Permanently deletes a segment from SendGrid's Marketing Campaigns without affecting contacts. This endpoint removes only the segment definition - all contacts that were members of this segment remain in the database and in any other segments they belong to. This is useful when you want to reorganize your segmentation strategy without losing contact data. **Note**: This uses the Marketing Campaigns Segmentation v1 API path. For newer implementations, consider using the Segmentation v2 API endpoint at /v3/marketing/segments/2.0/{segment_id}. **Important**: - This action is destructive and cannot be undone - Returns HTTP 204 No Content on success with an empty response body - Returns HTTP 404 if the segment_id does not exist - Returns HTTP 403 if the API key lacks 'marketing.segments.delete' scope - Contacts in the segment are NOT deleted - only the segment definition is removed

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `segment_id` | string | Yes | The unique identifier (UUID) of the segment to delete. This is the 'id' field returned when creating a segment or listing segments via the Marketing Campaigns Segmentation API. Example format: '12345678-abcd-1234-abcd-1234567890ab'. Use the 'Get List of Segments' endpoint to retrieve available segment IDs. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Disassociate an authenticated domain from a given user

**Slug:** `SENDGRID_REMOVE_USER_DOMAIN`

Disassociate ALL authenticated domains from a subuser. This endpoint removes any authenticated domain associations that have been assigned to the specified subuser. After this operation, the subuser will no longer be able to send emails using the parent account's authenticated domains. Requirements: - The subuser must exist and belong to the parent account - The API key must have appropriate subuser management permissions - Use 'list_all_subusers' to find valid subuser usernames Note: This action removes ALL domain associations for the subuser. To remove a specific domain from a subuser with multiple domains, use the 'unlink_subuser_domain' action instead (DELETE /v3/whitelabel/domains/{domain_id}/subuser). On success, returns HTTP 204 No Content with an empty response body.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | The username of the subuser to disassociate authenticated domain(s) from. This operation removes ALL authenticated domains that have been associated with this subuser. Use 'list_all_subusers' to find valid subuser usernames. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Rename an ip pool

**Slug:** `SENDGRID_RENAME_AN_IP_POOL`

Renames an existing IP pool in your SendGrid account. IP pools allow you to group your dedicated SendGrid IP addresses together. For example, you might have separate pools for 'transactional' and 'marketing' emails to maintain different sending reputations. Requirements: - SendGrid account with dedicated IP addresses (Pro or Premier plan) - API key with 'ips.pools.update' scope - The IP pool must already exist (use 'Retrieve All IP Pools' to list existing pools) Note: The new name must be unique across all your IP pools and cannot start with a space or period (.).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The new name for the IP pool. Must be unique across all your IP pools and cannot begin with a space or period (.). Example: 'marketing-v2' or 'promo-emails'. |
| `pool_name` | string | Yes | The current name of the IP pool to rename. You can find existing pool names using the 'Retrieve All IP Pools' action. Example: 'marketing' or 'transactional'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Request csv

**Slug:** `SENDGRID_REQUEST_CSV`

Initiating a backend process creates a CSV file of up to 1 million events from the last 30 days, emailed to the user with a 3-day expiry link. Limited to one request per 12 hours, it's similar to the GET Single Message but for CSV downloads.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | No | Uses a SQL like syntax to indicate which messages to include in the CSV |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Resend a sender verification

**Slug:** `SENDGRID_RESEND_A_SENDER_VERIFICATION`

Resends the verification email for a Marketing Campaigns Sender identity. Use this when the original verification email was lost, expired, or needs to be resent. The sender must have been created via the Marketing Senders API (/v3/marketing/senders) and must not yet be verified. To get valid sender IDs, use the 'Get a list of all senders' endpoint first. Returns an empty response on success. Note: This endpoint requires Marketing Campaigns API permissions. For Verified Senders (created via /v3/verified_senders), use the 'Resend Verified Sender Request' endpoint instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The unique numeric identifier of the Marketing Sender to resend verification for. This ID is returned when creating a sender via the 'Create a Sender' endpoint (POST /v3/marketing/senders) or can be retrieved using the 'Get a list of all senders' endpoint (GET /v3/marketing/senders). Note: This is different from Verified Senders which use a separate API (/v3/verified_senders). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Resend sender identity verification

**Slug:** `SENDGRID_RESEND_SENDER_IDENTITY_VERIFICATION`

Resends the verification email to a sender identity's 'from' email address. Use this when the original verification email was not received, expired, or needs to be resent. The sender identity must have been created via the Sender Identities API (POST /v3/senders) and must not yet be verified. Returns an empty response on success. Note: This endpoint is part of the legacy Sender Identities API. For the newer Verified Senders API, use the 'Resend Verified Sender Request' endpoint (/v3/verified_senders/resend/{id}).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sender_id` | integer | Yes | The unique numeric ID of the sender identity for which to resend the verification email. This ID is returned when creating a sender identity via the 'Create a Sender Identity' endpoint (POST /v3/senders), or can be retrieved using the 'Get All Sender Identities' endpoint (GET /v3/senders). Note: This is for the legacy Sender Identities API, not the newer Verified Senders API (/v3/verified_senders). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Resend teammate invite

**Slug:** `SENDGRID_RESEND_TEAMMATE_INVITE`

Resend a pending teammate invitation to refresh its expiration date. Teammate invitations expire after 7 days. Use this endpoint to resend an invitation that hasn't been accepted yet, which will reset the expiration date to 7 days from now. The token parameter can be obtained from the 'Retrieve all pending teammates' endpoint. Requires 'teammates.write' scope or full access API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | string | Yes | The unique token identifier for the pending teammate invitation to resend. This token can be obtained from the 'Retrieve all pending teammates' endpoint response. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Resend verified sender request

**Slug:** `SENDGRID_RESEND_VERIFIED_SENDER_REQUEST`

Resends the verification email to a Sender Identity's 'from_email' address. Use this when the original verification email was lost, expired, or needs to be resent. The sender must have been created via 'Create Verified Sender Request' and must not yet be verified. Retrieve the sender ID using 'Get All Verified Senders' endpoint. Returns empty response on success.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The unique numeric identifier of the Sender Identity to resend the verification email for. This ID is returned when creating a sender via the 'Create Verified Sender Request' endpoint or can be retrieved using the 'Get All Verified Senders' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a bounce

**Slug:** `SENDGRID_RETRIEVE_A_BOUNCE`

Retrieves details about a specific bounced email address from the SendGrid suppression list. Use this endpoint to look up bounce information for a particular email address, including: - When the bounce occurred (created timestamp) - Why the email bounced (reason with bounce codes) - The bounce status code (enhanced SMTP status) Bounces occur when an email cannot be delivered to a recipient and the receiving mail server returns a bounce response. SendGrid automatically adds bounced addresses to your suppression list to prevent future delivery attempts. Returns HTTP 200 with bounce details on success, or HTTP 404 if the email address is not found in the bounce suppression list. Requires the 'Suppressions' read scope to be enabled for your API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address to retrieve bounce information for. Must be a valid email address format (e.g., 'user@example.com'). The email must exist in your bounce suppression list to return results; otherwise returns 404. |
| `on-behalf-of` | string | No | The subuser's username to make this API call on behalf of. This allows you to make API calls from the parent account on behalf of subusers. Use format: 'subuser-username' for subusers or 'account-id <account-id>' for customer accounts. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a branded link

**Slug:** `SENDGRID_RETRIEVE_A_BRANDED_LINK`

Retrieves a specific branded link by its ID. Branded links (formerly 'Link Whitelabel') allow click-tracked links, opens, and images in your emails to be served from your domain rather than sendgrid.net. Use the 'Retrieve all branded links' endpoint first to get valid IDs. You can make this request on behalf of a subuser by including their ID in the 'on-behalf-of' header.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The unique ID of the branded link to retrieve. You can find this ID by first calling the 'Retrieve all branded links' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve access requests

**Slug:** `SENDGRID_RETRIEVE_ACCESS_REQUESTS`

Retrieve a list of recent access requests using pagination with `limit` for page size and `offset` to control the start position for additional items.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | `limit` sets the page size, i.e. maximum number of items from the list to be returned for a single API request. If omitted, the default page size is used.  |
| `offset` | integer | No | The number of items in the list to skip over before starting to retrieve the items for the requested page. The default `offset` of `0` represents the beginning of the list, i.e. the start of the first page. To request the second page of the list, set the `offset` to the page size as determined by `limit`. Use multiples of the page size as your `offset` to request further consecutive pages. E.g. assume your page size is set to `10`. An `offset` of `10` requests the second page, an `offset` of `20` requests the third page and so on, provided there are sufficiently many items in your list.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a count of recipients

**Slug:** `SENDGRID_RETRIEVE_A_COUNT_OF_RECIPIENTS`

Retrieve the total count of recipients in the Legacy Marketing Campaigns contact database. **IMPORTANT: This is a Legacy API endpoint.** The contactdb API (`/v3/contactdb/*`) is part of the Legacy Marketing Campaigns and is not available to newer SendGrid accounts. If you receive a 403 Forbidden error, your account likely does not have access to the legacy API. For accounts using the new Marketing Campaigns, use the 'Get Total Contact Count' action (`/v3/marketing/contacts/count`) instead to get the count of contacts. This endpoint requires the 'marketing.read' scope (for legacy accounts only).

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a custom field

**Slug:** `SENDGRID_RETRIEVE_A_CUSTOM_FIELD`

Retrieves a single custom field definition by its ID from SendGrid Marketing Campaigns. Custom fields store additional information about your contacts beyond the reserved fields (email, first_name, last_name, etc.). This endpoint returns the field's ID, name, and data type. **Response includes:** - `id`: Unique string identifier for the custom field (e.g., 'e1_T') - `name`: The field name (e.g., 'company', 'loyalty_points') - `field_type`: Data type - 'Text', 'Number', or 'Date' **Common errors:** - 404: Custom field with the specified ID does not exist - 401: Invalid or missing API key

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `custom_field_id` | string | Yes | The unique string ID of the custom field to retrieve (e.g., 'e1_T'). Custom field IDs can be obtained from the 'Get all field definitions' endpoint or from the response when creating a custom field definition. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve address whitelist mail settings

**Slug:** `SENDGRID_RETRIEVE_ADDRESS_WHITELIST_MAIL_SETTINGS`

Retrieves your current address whitelist mail settings from SendGrid. The Address Whitelist setting allows you to specify email addresses or domains for which mail should never be suppressed. For example, if you whitelist 'example.com', all bounces, blocks, and unsubscribes logged for that domain will be ignored and mail will be sent as if under normal sending conditions. This is useful when you want to ensure delivery to specific addresses or domains regardless of previous suppression events. Note: For Regional (EU) subusers, utilizing this feature will cause customer personal information to be stored outside of the EU. Required scope: mail_settings.address_whitelist.read

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a global suppression

**Slug:** `SENDGRID_RETRIEVE_A_GLOBAL_SUPPRESSION`

Checks if an email address is in the global suppression list. Globally suppressed emails will not receive any emails from your SendGrid account. Returns the email address if found in the global suppression list, or an empty response if not suppressed. This is useful for verifying if a recipient has opted out globally before attempting to send emails. Requires the 'asm.suppressions.global.read' scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address to check in the global suppression list. This can be any valid email address format (e.g., 'user@example.com'). The email is case-insensitive. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a list of currently allowed ips

**Slug:** `SENDGRID_RETRIEVE_A_LIST_OF_CURRENTLY_ALLOWED_IPS`

This endpoint provides a list of authorized IP addresses for your account, each with creation, update dates, and a unique ID for potential removal.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all alerts

**Slug:** `SENDGRID_RETRIEVE_ALL_ALERTS`

Retrieve all SendGrid alerts configured for your account. Returns a list of alert configurations including: - **usage_limit alerts**: Notify when email usage reaches a specified percentage threshold (0-100%). - **stats_notification alerts**: Send periodic email statistics at daily, weekly, or monthly intervals. Each alert includes the recipient email address, timestamps, and type-specific settings. Requires 'alerts.read' API scope.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all assigned ips

**Slug:** `SENDGRID_RETRIEVE_ALL_ASSIGNED_IPS`

Retrieves all IP addresses that are currently assigned to your account. This endpoint returns a list of IP addresses that have been assigned to your account for sending emails. Each IP address includes information about: - The IP address itself - The IP pools it belongs to - Whether it's currently in warmup mode - The warmup start date (if applicable) A single IP address or a range of IP addresses may be dedicated to an account to send email for multiple domains. The reputation of an IP is based on the aggregate performance of all the senders who use it. Note: This endpoint requires the 'ips.assigned.read' permission scope.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all blocks

**Slug:** `SENDGRID_RETRIEVE_ALL_BLOCKS`

Retrieves a paginated list of all blocked email addresses from your SendGrid account. Blocks occur when a recipient's email server rejects a message for reasons related to the message itself (not the recipient address), such as: - Your sending IP being blocked by an ISP - Message content flagged by spam filters - Server rejection due to policy violations Unlike bounces, SendGrid does NOT automatically suppress future messages to blocked addresses. Use this endpoint to identify problematic deliveries. Returns HTTP 200 with a list of block records, or an empty list if no blocks exist. Supports pagination via limit/offset and filtering by time range or email pattern.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | No | Filter blocks by email address pattern. Matches from the start of the email. Example: 'sales' matches 'sales@example.com'. Use '%25' as wildcard: '%25market' matches any email containing 'market'. Reserved characters must be percent-encoded (e.g., '@' as '%40'). |
| `limit` | integer | No | Maximum number of block records to return per page. Valid range: 1-500. If omitted, the API default page size is used. Useful for pagination. |
| `offset` | integer | No | Number of records to skip before returning results. Default is 0 (start from beginning). For pagination, use offset = page_number * limit. Example: with limit=10, offset=20 returns the third page of results. |
| `end_time` | integer | No | Filter blocks created on or before this time. Unix timestamp (seconds since epoch). Example: 1672531199 for Dec 31, 2022. Use with start_time for a date range. |
| `start_time` | integer | No | Filter blocks created on or after this time. Unix timestamp (seconds since epoch). Example: 1640995200 for Jan 1, 2022. Use with end_time for a date range. |
| `on-behalf-of` | string | No | The subuser's username to make this API call on behalf of. This allows parent accounts to access subuser data. Use format: 'subuser-username' for subusers or 'account-id <account-id>' for customer accounts. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all bounces

**Slug:** `SENDGRID_RETRIEVE_ALL_BOUNCES`

This endpoint retrieves a paginated list of all your bounces, allowing customization of page size with `limit` and starting position with `offset` for multiple requests.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | No | Specifies which records to return based on the records" associated email addresses. For example, `sales` returns records with email addresses that start with "sales", such as `salesdepartment@example.com` or `sales@example.com`.  You can also use `%25` as a wildcard. For example, `%25market` returns records containing email addresses with the string "market" anywhere in the email address, and `%25market%25tree` returns records containing email addresses with the string "market" followed by the string "tree". Any reserved characters should be [percent-encoded](https://en.wikipedia.org/wiki/Percent-encoding#Reserved_characters), e.g., the `@` symbol should be encoded as `%40`.  |
| `limit` | integer | No | `limit` sets the page size, i.e. maximum number of items from the list to be returned for a single API request. If omitted, the default page size is used. The maximum page size for this endpoint is 500 items per page.  |
| `offset` | integer | No | The number of items in the list to skip over before starting to retrieve the items for the requested page. The default `offset` of `0` represents the beginning of the list, i.e. the start of the first page. To request the second page of the list, set the `offset` to the page size as determined by `limit`. Use multiples of the page size as your `offset` to request further consecutive pages. E.g. assume your page size is set to `10`. An `offset` of `10` requests the second page, an `offset` of `20` requests the third page and so on, provided there are sufficiently many items in your list.  |
| `end_time` | integer | No | Refers end of the time range in unix timestamp when a bounce was created (inclusive).  |
| `start_time` | integer | No | Refers start of the time range in unix timestamp when a bounce was created (inclusive).  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all branded links

**Slug:** `SENDGRID_RETRIEVE_ALL_BRANDED_LINKS`

**This endpoint allows you to retrieve all branded links**. You can submit this request as one of your subusers if you include their ID in the `on-behalf-of` header in the request.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Limits the number of results returned per page. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all campaigns

**Slug:** `SENDGRID_RETRIEVE_ALL_CAMPAIGNS`

Retrieve a paginated list of campaigns in reverse creation order with the API endpoint. If none exist, get an empty array. Adjust page size with `limit`, and fetch more with `offset`.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | `limit` sets the page size, i.e. maximum number of items from the list to be returned for a single API request. If omitted, the default page size is used.  |
| `offset` | integer | No | The number of items in the list to skip over before starting to retrieve the items for the requested page. The default `offset` of `0` represents the beginning of the list, i.e. the start of the first page. To request the second page of the list, set the `offset` to the page size as determined by `limit`. Use multiples of the page size as your `offset` to request further consecutive pages. E.g. assume your page size is set to `10`. An `offset` of `10` requests the second page, an `offset` of `20` requests the third page and so on, provided there are sufficiently many items in your list.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all categories

**Slug:** `SENDGRID_RETRIEVE_ALL_CATEGORIES`

Retrieve all email categories used for tracking and organizing email statistics. Categories are user-defined labels that can be assigned to emails when sending. They help organize email statistics and enable filtering/grouping of metrics by category. This is useful for tracking different email campaigns, types of communications, or any custom grouping. **Note**: Category statistics are available for the previous 13 months only. Free plans are limited to 100 categories daily, paid plans allow 1,000 categories. **Required scope**: `categories.read` Returns a paginated list of categories. Use `limit` and `offset` parameters for pagination through large category lists.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum number of categories to return per request (page size). Use with 'offset' for pagination. Default is 50. |
| `offset` | integer | No | Number of categories to skip for pagination. Default is 0 (start from the beginning). To get page 2 with limit=50, use offset=50. |
| `category` | string | No | Filter categories by prefix. Only categories starting with this string will be returned. Example: 'marketing' returns 'marketing', 'marketing_email', etc. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all custom fields

**Slug:** `SENDGRID_RETRIEVE_ALL_CUSTOM_FIELDS`

Retrieve all custom field definitions for contacts. Returns a list of all custom fields that have been created for your contacts. Custom fields allow you to store additional information about your contacts beyond the default fields (first_name, last_name, email, etc.). Each custom field includes: - id: Unique integer identifier - name: The field name (alphanumeric and underscores only) - type: The field type (text, number, or date) You can create up to 120 custom fields per account.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all global suppressions

**Slug:** `SENDGRID_RETRIEVE_ALL_GLOBAL_SUPPRESSIONS`

Retrieves a paginated list of all email addresses that are globally suppressed from receiving any emails from your SendGrid account. Global suppressions are recipients who have unsubscribed from all your emails, not just specific groups. Each suppression includes the email address and when it was added. Use `limit` and `offset` parameters for pagination. Filter by time range with `start_time` and `end_time`, or by email pattern with the `email` parameter. Maximum 500 records per request. This is useful for auditing unsubscribes, compliance reporting, or re-engagement campaigns where you need to identify globally suppressed users.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | No | Filter results by email address pattern. Supports prefix matching and wildcards. Examples: 'sales' returns emails starting with 'sales' like salesdepartment@example.com; '%25market' (where %25 is URL-encoded %) returns emails containing 'market' anywhere; '%25market%25tree' returns emails with 'market' followed by 'tree'. Note: Special characters like @ must be percent-encoded (@ becomes %40). Leave empty to retrieve all suppressions without filtering. |
| `limit` | integer | No | Maximum number of suppression records to return in a single response. If not specified, SendGrid's default page size is used. Maximum allowed value is 500. Use this with `offset` for pagination through large result sets. For example, set to 100 to retrieve records in batches of 100. |
| `offset` | integer | No | Number of records to skip before returning results, used for pagination. Default is 0 (start from the beginning). To paginate, set this to `limit * page_number`. For example, with limit=100: offset=0 gets page 1 (records 1-100), offset=100 gets page 2 (records 101-200), offset=200 gets page 3 (records 201-300), etc. |
| `end_time` | integer | No | Filter results to only include suppressions created on or before this time. Provide as a Unix timestamp (seconds since epoch). For example, 1640995199 represents December 31, 2021 23:59:59 UTC. Inclusive - records created at exactly this timestamp will be included. |
| `start_time` | integer | No | Filter results to only include suppressions created on or after this time. Provide as a Unix timestamp (seconds since epoch). For example, 1609459200 represents January 1, 2021 00:00:00 UTC. Inclusive - records created at exactly this timestamp will be included. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all invalid emails

**Slug:** `SENDGRID_RETRIEVE_ALL_INVALID_EMAILS`

Retrieve paginated lists of invalid emails with 'limit' for page size and 'offset' to start from a specific position for lists exceeding the limit.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | No | This parameter allows you to filter results by email address. Only invalid addresses matching an address passed in this parameter will be returned.  |
| `limit` | integer | No | `limit` sets the page size, i.e. maximum number of items from the list to be returned for a single API request. If omitted, the default page size is used. The maximum page size for this endpoint is 500 items per page.  |
| `offset` | integer | No | The number of items in the list to skip over before starting to retrieve the items for the requested page. The default `offset` of `0` represents the beginning of the list, i.e. the start of the first page. To request the second page of the list, set the `offset` to the page size as determined by `limit`. Use multiples of the page size as your `offset` to request further consecutive pages. E.g. assume your page size is set to `10`. An `offset` of `10` requests the second page, an `offset` of `20` requests the third page and so on, provided there are sufficiently many items in your list.  |
| `end_time` | integer | No | Refers end of the time range in unix timestamp when an invalid email was created (inclusive).  |
| `start_time` | integer | No | Refers start of the time range in unix timestamp when an invalid email was created (inclusive).  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all ip addresses

**Slug:** `SENDGRID_RETRIEVE_ALL_IP_ADDRESSES`

Retrieve a paginated list of assigned/unassigned IPs with warmup status, pools, subusers, and DNS info. IP reputation is based on email traffic. Use `limit` and `offset` parameters to control pagination.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip` | string | No | The IP address to get |
| `limit` | integer | No | `limit` sets the page size, i.e. maximum number of items from the list to be returned for a single API request. If omitted, the default page size is used.  |
| `offset` | integer | No | The number of items in the list to skip over before starting to retrieve the items for the requested page. The default `offset` of `0` represents the beginning of the list, i.e. the start of the first page. To request the second page of the list, set the `offset` to the page size as determined by `limit`. Use multiples of the page size as your `offset` to request further consecutive pages. E.g. assume your page size is set to `10`. An `offset` of `10` requests the second page, an `offset` of `20` requests the third page and so on, provided there are sufficiently many items in your list.  |
| `subuser` | string | No | The subuser you are requesting for. |
| `sort_by_direction` | string ("desc" | "asc") | No | The direction to sort the results. |
| `exclude_whitelabels` | boolean | No | Should we exclude reverse DNS records (whitelabels)? |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all ip pools

**Slug:** `SENDGRID_RETRIEVE_ALL_IP_POOLS`

**This endpoint allows you to get all of your IP pools.**

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all ip pools an ip address belongs to

**Slug:** `SENDGRID_RETRIEVE_ALL_IP_POOLS_AN_IP_ADDRESS_BELONGS_TO`

Retrieves details for a specific IP address including all IP pools it belongs to, subusers that can use it, warmup status, and reverse DNS record. The same IP address can belong to multiple IP pools. Requires the 'ips.read' API scope and a dedicated IP address on your SendGrid account.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip_address` | string | Yes | The IP address to retrieve pool membership for. Must be a valid IPv4 address that belongs to your SendGrid account (e.g., '167.89.21.3'). Use the 'Retrieve all IP addresses' action to get valid IPs for your account. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve All IPs Currently in Warmup

**Slug:** `SENDGRID_RETRIEVE_ALL_IPS_CURRENTLY_IN_WARMUP`

Retrieve all IP addresses currently in the warmup process. IP warmup is the process of gradually increasing sending volume through a new IP address to build a positive sending reputation. This endpoint returns all IPs that are actively being warmed up. The response includes: - ip: The IP address being warmed up - start_date: Unix timestamp when the warmup process began Returns an empty array if no IPs are currently in warmup. Note: Requires IP Management permissions on your SendGrid API key.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all lists

**Slug:** `SENDGRID_RETRIEVE_ALL_LISTS`

Retrieve all contact lists from your SendGrid account. Lists are static collections of Marketing Campaigns contacts. Returns an array of all lists with their IDs, names, and contact counts. If no lists exist, returns an empty array.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page_size` | integer | No | Maximum number of elements to return. Defaults to 100, maximum 1000. |
| `page_token` | string | No | Token for pagination to retrieve the next page of results. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all mail settings

**Slug:** `SENDGRID_RETRIEVE_ALL_MAIL_SETTINGS`

Retrieve a paginated list of mail settings with their `enabled` status and descriptions. Control page size with `limit` and list position with `offset` for multiple requests.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum number of mail settings to return per request (page size). If omitted, the default page size is used. |
| `offset` | integer | No | Number of items to skip before returning results. Use 0 for the first page. For subsequent pages, set offset to (page_number - 1) * limit. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all of your event webhooks

**Slug:** `SENDGRID_RETRIEVE_ALL_OF_YOUR_EVENT_WEBHOOKS`

The endpoint fetches all Event Webhooks as objects in an array, showing each webhook's configuration and ID, used to update, delete, or manage signature verification and OAuth settings.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include` | string | No | Use this to include optional fields in the response payload. When this is set to `include=account_status_change`, the `account_status_change` field will be part of the response payload and set to `false` by default. See [Update an event webhook](https://docs.sendgrid.com/api-reference/webhooks/update-an-event-webhook) for enabling this webhook notification which lets you subscribe to account status change events related to compliance action taken by SendGrid.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all parse settings

**Slug:** `SENDGRID_RETRIEVE_ALL_PARSE_SETTINGS`

**This endpoint allows you to retrieve all of your current inbound parse settings.**

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all pending teammates

**Slug:** `SENDGRID_RETRIEVE_ALL_PENDING_TEAMMATES`

**This endpoint allows you to retrieve a list of all pending Teammate invitations.** Each teammate invitation is valid for 7 days. Users may resend the invitation to refresh the expiration date.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all recent access attempts

**Slug:** `SENDGRID_RETRIEVE_ALL_RECENT_ACCESS_ATTEMPTS`

Retrieves a list of all IP addresses that have recently attempted to access your SendGrid account, either through the User Interface or the API. This endpoint is part of SendGrid's IP Access Management feature, which helps monitor and secure account access. Each access attempt record includes the IP address, authentication method used, timestamps, and geographic location. **Important Notes:** - Requires the 'access_settings.activity.read' scope on your API key. - IP Access Management must be enabled in your SendGrid account settings (Settings > IP Access Management) before this endpoint will return data. - Returns up to the specified limit of most recent access attempts. **Use Cases:** - Security auditing: Monitor who is accessing your account - Identify suspicious access patterns from unexpected locations - Verify access from known IP addresses

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum number of recent access attempt records to return. Valid range is 1-500. Default is 20. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all recipients on a list

**Slug:** `SENDGRID_RETRIEVE_ALL_RECIPIENTS_ON_A_LIST`

Retrieves all recipients (contacts) belonging to a specific list in SendGrid's Legacy Marketing Campaigns. **IMPORTANT**: This endpoint is part of SendGrid's legacy Contacts API (`/v3/contactdb/`). Some SendGrid accounts may not have access to this legacy API. For newer accounts, consider using the newer Marketing Campaigns API endpoints under `/v3/marketing/`. The response contains an array of recipient objects with details such as email, first name, last name, and timestamps. Results are paginated - use the `page` and `page_size` parameters to iterate through large lists. Example use cases: - Export contacts from a specific marketing list - Verify which contacts are subscribed to a list - Audit list membership before sending a campaign

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | The page number of results to return (1-indexed). Use for pagination when the list has many recipients. Defaults to 1. |
| `list_id` | integer | Yes | The unique integer ID of the list from which to retrieve recipients. You can obtain list IDs from the 'Retrieve all lists' endpoint. |
| `page_size` | integer | No | The number of recipients to return per page. Must be between 1 and 1000. Defaults to 100. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all reverse dns records

**Slug:** `SENDGRID_RETRIEVE_ALL_REVERSE_DNS_RECORDS`

The endpoint provides a paginated list of Reverse DNS records, with optional IP prefix search and adjustable page size using 'limit' and 'offset' parameters.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip` | string | No | The IP address segment that you"d like to use in a prefix search. |
| `limit` | integer | No | `limit` sets the page size, i.e. maximum number of items from the list to be returned for a single API request. If omitted, the default page size is used.  |
| `offset` | integer | No | The number of items in the list to skip over before starting to retrieve the items for the requested page. The default `offset` of `0` represents the beginning of the list, i.e. the start of the first page. To request the second page of the list, set the `offset` to the page size as determined by `limit`. Use multiples of the page size as your `offset` to request further consecutive pages. E.g. assume your page size is set to `10`. An `offset` of `10` requests the second page, an `offset` of `20` requests the third page and so on, provided there are sufficiently many items in your list.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all scheduled sends

**Slug:** `SENDGRID_RETRIEVE_ALL_SCHEDULED_SENDS`

The endpoint provides details of cancelled or paused scheduled sends but only if they have a `batch_id`. Sends scheduled without a `batch_id` via `/mail/send` won't be listed and can't be paused or cancelled later through this endpoint.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all spam reports

**Slug:** `SENDGRID_RETRIEVE_ALL_SPAM_REPORTS`

Retrieve spam reports in pages using `limit` for page size and `offset` to continue from a specific list position. Multiple requests handle larger lists.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | No | Specifies which records to return based on the records" associated email addresses. For example, `sales` returns records with email addresses that start with "sales", such as `salesdepartment@example.com` or `sales@example.com`.  You can also use `%25` as a wildcard. For example, `%25market` returns records containing email addresses with the string "market" anywhere in the email address, and `%25market%25tree` returns records containing email addresses with the string "market" followed by the string "tree". Any reserved characters should be [percent-encoded](https://en.wikipedia.org/wiki/Percent-encoding#Reserved_characters), e.g., the `@` symbol should be encoded as `%40`.  |
| `limit` | integer | No | `limit` sets the page size, i.e. maximum number of items from the list to be returned for a single API request. If omitted, the default page size is used. The maximum page size for this endpoint is 500 items per page.  |
| `offset` | integer | No | The number of items in the list to skip over before starting to retrieve the items for the requested page. The default `offset` of `0` represents the beginning of the list, i.e. the start of the first page. To request the second page of the list, set the `offset` to the page size as determined by `limit`. Use multiples of the page size as your `offset` to request further consecutive pages. E.g. assume your page size is set to `10`. An `offset` of `10` requests the second page, an `offset` of `20` requests the third page and so on, provided there are sufficiently many items in your list.  |
| `end_time` | integer | No | The end of the time range when a spam report was created (inclusive). This is a unix timestamp.  |
| `start_time` | integer | No | The start of the time range when a spam report was created (inclusive). This is a unix timestamp.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all suppressions

**Slug:** `SENDGRID_RETRIEVE_ALL_SUPPRESSIONS`

Retrieve a list of all suppressions across all suppression groups. Suppressions are recipient email addresses that have been added to unsubscribe groups. Once a recipient's address is on the suppressions list for an unsubscribe group, they will not receive any emails that are tagged with that unsubscribe group. This endpoint returns all suppressed email addresses with their associated group IDs, group names, and the timestamp when the suppression was created. **Note:** This endpoint requires the `asm.groups.suppressions.read` scope. If you need to retrieve suppressions for a specific group, use the endpoint `/v3/asm/groups/{group_id}/suppressions` instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `on-behalf-of` | string | No | The `on-behalf-of` header allows you to make API calls from a parent account on behalf of the parent's Subusers or customer accounts. When making a call on behalf of a customer account, the property value should be 'account-id' followed by the customer account's ID (e.g., 'account-id <account-id>'). When making a call on behalf of a Subuser, the property value should be the Subuser's username (e.g., '<subuser-username>'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all suppressions for a suppression group

**Slug:** `SENDGRID_RETRIEVE_ALL_SUPPRESSIONS_FOR_A_SUPPRESSION_GROUP`

**This endpoint allows you to retrieve all suppressed email addresses belonging to the given group.**

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `group_id` | string | Yes | The ID of the suppression group (unsubscribe group) from which to retrieve suppressed email addresses. This must be a valid numeric group ID that exists in your SendGrid account. You can obtain group IDs from the 'create_a_new_suppression_group' or 'get_suppression_groups' actions. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all teammates

**Slug:** `SENDGRID_RETRIEVE_ALL_TEAMMATES`

Retrieve a paginated list of Teammates with the `limit` parameter to set page size and `offset` to specify the starting point for additional items. Make multiple requests if needed.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | `limit` sets the page size, i.e. maximum number of items from the list to be returned for a single API request. If omitted, the default page size is used. The maximum page size for this endpoint is 500 items per page.  |
| `offset` | integer | No | The number of items in the list to skip over before starting to retrieve the items for the requested page. The default `offset` of `0` represents the beginning of the list, i.e. the start of the first page. To request the second page of the list, set the `offset` to the page size as determined by `limit`. Use multiples of the page size as your `offset` to request further consecutive pages. E.g. assume your page size is set to `10`. An `offset` of `10` requests the second page, an `offset` of `20` requests the third page and so on, provided there are sufficiently many items in your list.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve all the ips in a specified pool

**Slug:** `SENDGRID_RETRIEVE_ALL_THE_IPS_IN_A_SPECIFIED_POOL`

Retrieves all IP addresses that are assigned to a specific IP pool. IP pools allow you to group your dedicated SendGrid IP addresses together (e.g., separate pools for transactional and marketing emails). This endpoint requires the 'ips.pools.read' scope and a SendGrid account with dedicated IP addresses (typically Pro or Premier plan). Returns the pool name and a list of IP addresses with their warmup status and start dates. Returns 404 if the pool does not exist, or 403 if the API key lacks the required permissions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pool_name` | string | Yes | The name of the IP pool to retrieve. This is a unique identifier for the pool (e.g., 'transactional', 'marketing'). You can get a list of available pools using the 'Retrieve all IP pools' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve an authenticated domain

**Slug:** `SENDGRID_RETRIEVE_AN_AUTHENTICATED_DOMAIN`

Retrieves details of a specific authenticated domain by its unique ID. An authenticated domain (formerly called "Domain Whitelabel") allows you to remove the "via" or "sent on behalf of" message that recipients see when they read your emails. It replaces sendgrid.net with your personal sending domain. The response includes the domain's DNS records (CNAME/TXT/MX), validation status, whether it uses automatic or manual security, and associated user/subdomain information. Use SENDGRID_LIST_ALL_AUTHENTICATED_DOMAINS to get available domain IDs.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain_id` | string | Yes | The unique numeric ID of the authenticated domain to retrieve. This ID is returned when creating or listing authenticated domains. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve an existing api key

**Slug:** `SENDGRID_RETRIEVE_AN_EXISTING_API_KEY`

Retrieves the details of an existing SendGrid API key by its unique identifier. Returns the API key's name and permission scopes. Note: The actual API key string cannot be retrieved after creation for security reasons - only the name and scopes are returned. Returns 404 if the API key ID does not exist. This endpoint requires 'api_keys.read' scope and may be subject to IP Access Management restrictions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key_id` | string | Yes | The unique identifier of the API key to retrieve. This ID is returned when creating an API key or can be obtained by listing all API keys via the /v3/api_keys endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a reverse DNS record

**Slug:** `SENDGRID_RETRIEVE_A_REVERSE_DNS_RECORD`

Retrieves a specific reverse DNS (formerly IP Whitelabel) record by its ID. Reverse DNS allows mailbox providers to verify the sender of an email by performing a reverse DNS lookup. This endpoint returns details about a specific reverse DNS record including its IP address, domain, subdomain, validation status, and A record configuration. **Prerequisites:** - Account must have dedicated IP addresses (reverse DNS is not available for shared IPs) - API key must have the 'whitelabel.read' scope **Related endpoints:** - Use 'Retrieve all reverse DNS records' to get the list of record IDs - Use 'Validate a reverse DNS record' to validate the DNS configuration - Use 'Set up reverse DNS' to create a new reverse DNS record

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique ID of the reverse DNS record to retrieve. You can obtain this ID by using the 'Retrieve all reverse DNS records' endpoint. Note: Reverse DNS is only available for accounts with dedicated IP addresses. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a single campaign

**Slug:** `SENDGRID_RETRIEVE_A_SINGLE_CAMPAIGN`

Retrieves a specific campaign from SendGrid's Legacy Marketing Campaigns by its ID. Returns campaign details including title, subject, content, recipients, and status. Note: This is part of the Legacy Marketing Campaigns API. For new implementations, consider using the Marketing Campaigns Single Sends API instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `campaign_id` | integer | Yes | The unique identifier (ID) of the campaign to retrieve. This ID is returned when creating a campaign or can be obtained from the 'Retrieve all campaigns' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a single list

**Slug:** `SENDGRID_RETRIEVE_A_SINGLE_LIST`

Retrieve detailed information about a specific marketing list by its unique ID. This endpoint returns the list's name, contact count, and metadata. When the optional `contact_sample` parameter is set to true, it also includes up to 50 of the most recent contacts in the list. Lists are static collections of contacts used for organizing and targeting email campaigns in SendGrid Marketing Campaigns. Note: This action uses the new Marketing Campaigns API. The legacy Contact Database API (/v3/contactdb/lists) is deprecated and not accessible for newer SendGrid accounts.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the marketing list to retrieve. Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. |
| `contact_sample` | boolean | No | When set to true, includes up to 50 of the most recent contacts in the response along with the total contact count. Default is false. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a single recipient

**Slug:** `SENDGRID_RETRIEVE_A_SINGLE_RECIPIENT`

Retrieve a single recipient by ID from the Legacy Marketing Campaigns contact database. **IMPORTANT**: This is a Legacy Marketing Campaigns API endpoint (/v3/contactdb/). Newer SendGrid accounts may not have access to this deprecated API. For modern accounts, use the 'Get a Contact by ID' action (/v3/marketing/contacts/{id}) instead. The recipient_id is a URL-safe base64 encoding of the recipient's lowercase email address. For example, 'user@example.com' becomes 'dXNlckBleGFtcGxlLmNvbQ=='. Returns the recipient's profile including email, name, engagement timestamps (last_clicked, last_emailed, last_opened), and any custom fields defined in your account. Requires 'marketing.read' or equivalent scope on your API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `recipient_id` | string | Yes | The unique identifier of the recipient to retrieve. This is a URL-safe base64 encoding of the recipient's lowercase email address. For example, if the email is 'user@example.com', the recipient_id would be 'dXNlckBleGFtcGxlLmNvbQ=='. You can obtain recipient IDs from the 'Retrieve recipients' or 'Search recipients' endpoints, or compute it by base64-encoding the lowercase email address. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a single transactional template

**Slug:** `SENDGRID_RETRIEVE_A_SINGLE_TRANSACTIONAL_TEMPLATE`

Retrieves a single transactional template by its ID, including all associated template versions. Transactional templates are used for sending personalized emails with dynamic content replacement using Handlebars syntax. This endpoint returns the template's metadata and all versions, allowing you to identify which version is currently active. Use this endpoint to: - View template details before sending emails - Check which template versions exist - Verify which version is currently active - Get version IDs needed for the 'Retrieve a specific transactional template version' endpoint

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `template_id` | string | Yes | The unique identifier of the transactional template to retrieve. For dynamic templates, this ID starts with 'd-' followed by a UUID (e.g., 'd-f43daab504504148b3bbb5f438d76155'). You can find template IDs in the SendGrid UI under Email API > Dynamic Templates, or by using the 'Retrieve paged transactional templates' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a specific alert

**Slug:** `SENDGRID_RETRIEVE_A_SPECIFIC_ALERT`

Retrieve details for a specific SendGrid alert by its ID. Alerts notify you about email usage limits or provide periodic email statistics. Use this endpoint to get full details of a single alert including its type, recipient email, and configuration (percentage threshold or frequency). To get alert IDs, first use the 'Retrieve all alerts' endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `alert_id` | integer | Yes | The unique numeric ID of the alert to retrieve. You can get alert IDs from the 'Retrieve all alerts' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a specific allowed ip

**Slug:** `SENDGRID_RETRIEVE_A_SPECIFIC_ALLOWED_IP`

Retrieves details of a specific IP address from your SendGrid account's IP Access Management allow list using its unique rule ID. Returns the IP address, creation timestamp, and last update timestamp. Use 'Retrieve a list of currently allowed IPs' or check the response from 'Add one or more IPs to the allow list' to obtain rule IDs. Note: Removing your own IP from the allow list can lock you out of your account.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rule_id` | string | Yes | The unique numeric ID of the allowed IP address rule to retrieve. Obtain this ID from the 'Retrieve a list of currently allowed IPs' endpoint or from the response when adding IPs to the allow list. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a specific block

**Slug:** `SENDGRID_RETRIEVE_A_SPECIFIC_BLOCK`

Retrieves details for a specific email address from your SendGrid blocks list. Blocks occur when a recipient's email server rejects the message for a reason related to the message itself, not the recipient address. This could be due to your sending IP being blocked by an ISP, or the message content being flagged by a spam filter. Unlike bounces, SendGrid does not automatically suppress future messages to blocked addresses. Use this endpoint to check if a specific email is blocked and understand why. Returns HTTP 200 with block details on success, or HTTP 404 if the email address is not found in the blocks list.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address to look up in the blocks list. Must be a valid email address format (e.g., 'user@example.com'). This is a required path parameter. |
| `on-behalf-of` | string | No | The subuser's username to make this API call on behalf of. This allows you to make API calls from the parent account on behalf of subusers. Use format: 'subuser-username' for subusers or 'account-id <account-id>' for customer accounts. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a specific invalid email

**Slug:** `SENDGRID_RETRIEVE_A_SPECIFIC_INVALID_EMAIL`

Retrieves details about a specific email address from SendGrid's invalid email suppression list. Invalid emails are addresses that have bounced because of a permanent error such as an invalid mailbox or non-existent domain. This action allows you to check if a specific email exists in your suppression list and get details about why it was added. Returns the email address, the Unix timestamp when it was added, and the reason it was marked as invalid. Returns an empty list if the email is not in the invalid email suppression list. Note: Requires the 'suppression.invalid_emails.read' scope on your API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address to look up in SendGrid's invalid email suppression list. Must be a valid email format (e.g., 'user@example.com'). This email must already exist in your invalid email list to return a result. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a specific parse setting

**Slug:** `SENDGRID_RETRIEVE_A_SPECIFIC_PARSE_SETTING`

Retrieves a specific inbound parse webhook setting by hostname. This endpoint returns the configuration details for an inbound parse setting, which defines how SendGrid handles incoming emails for a particular hostname. **Prerequisites:** - The hostname must already be configured as a parse setting in your account. - Use the 'Retrieve all parse settings' endpoint to list available hostnames. **Parameters:** - `hostname`: Required. The unique domain or subdomain of the parse setting (e.g., `parse.yourdomain.com`). **Returns:** - `hostname`: The domain/subdomain configured for email parsing. - `url`: The webhook URL where parsed email data is POSTed. - `send_raw`: Whether raw MIME content is sent instead of parsed fields. - `spam_check`: Whether spam filtering is enabled. **Error Cases:** - 404: Parse setting not found for the specified hostname. - 403: Insufficient permissions to access parse settings.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hostname` | string | Yes | The hostname of the inbound parse setting to retrieve. This must be a unique domain or subdomain configured for inbound email parsing (e.g., `parse.yourdomain.com`). Use the 'Retrieve all parse settings' endpoint to get a list of available hostnames in your account. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a specific spam report

**Slug:** `SENDGRID_RETRIEVE_A_SPECIFIC_SPAM_REPORT`

Retrieves a specific spam report by email address from SendGrid's suppression list. Spam reports are generated when a recipient marks an email as spam. This action allows you to check if a specific email address has been reported as spam. **Use cases:** - Check if a recipient has marked your emails as spam - Verify spam report details before removing a suppression - Audit spam complaints for a specific email address **Returns:** An array of spam report objects containing the email address, Unix timestamp when reported, and the IP address that sent the email. Returns an empty array if the email has no spam reports.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address of the spam report to retrieve. This should be a valid email address that has been reported as spam in your SendGrid account. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a specific transactional template version

**Slug:** `SENDGRID_RETRIEVE_A_SPECIFIC_TRANSACTIONAL_TEMPLATE_VERSION`

Retrieves a specific version of a transactional template by its template ID and version ID. Transactional templates in SendGrid can have multiple versions, allowing for A/B testing, localization, or iterative improvements. Each version contains the email content (HTML and plain text), subject line, and metadata. Use this endpoint to: - Inspect the content and settings of a specific template version - Compare different versions of a template - Retrieve template content for preview or debugging purposes - Verify which version is currently active **Required scope:** templates.read **Note:** The template_id for dynamic templates follows the format 'd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'. The version_id is a UUID returned when creating a version via the API or visible in the SendGrid UI.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `version_id` | string | Yes | The unique ID of the template version to retrieve. This is a UUID string returned when a version is created. |
| `template_id` | string | Yes | The unique ID of the transactional template. Format: 'd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' for dynamic templates or UUID for legacy templates. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve a subuser's branded link

**Slug:** `SENDGRID_RETRIEVE_A_SUBUSER_S_BRANDED_LINK`

Retrieve the branded link associated with a specific subuser. Email link branding (formerly 'Link Whitelabel') allows click-tracked links, opens, and images in emails to be served from your domain rather than sendgrid.net. This endpoint retrieves the branded link that has been associated with a subuser by the parent account. Prerequisites: - The parent account must have created and validated a branded link - The branded link must be associated with the subuser (via API or Subuser Management page) - The API key must have link branding read permissions Note: This operation requires a SendGrid Pro plan or higher with subusers enabled.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | The username of the subuser to retrieve the associated branded link for. This must be an existing subuser in your SendGrid account that has a branded link associated with it. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve bounce classification totals

**Slug:** `SENDGRID_RETRIEVE_BOUNCE_CLASSIFICATION_TOTALS`

This endpoint will return the total number of bounces by classification in descending order for each day. You can retrieve the bounce classification totals in CSV format by specifying `"text/csv"` in the Accept header.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `end_date` | string | No | The end of the time range, in YYYY-MM-DD format, when a bounce was created (inclusive).  |
| `start_date` | string | No | The start of the time range, in YYYY-MM-DD format, when a bounce was created (inclusive).  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve bounce purge mail settings

**Slug:** `SENDGRID_RETRIEVE_BOUNCE_PURGE_MAIL_SETTINGS`

Retrieve your current Bounce Purge mail settings. This setting configures the maximum age (in days) of contacts in your hard and soft bounce suppression lists before they are automatically purged. Note: This only affects suppression lists, not Marketing Campaigns contacts.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `on_behalf_of` | string | No | Make API calls on behalf of a Subuser or customer account. For Subusers, use the Subuser's username (e.g., 'subuser-name'). For customer accounts, use 'account-id <account-id>' format. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve click track settings

**Slug:** `SENDGRID_RETRIEVE_CLICK_TRACK_SETTINGS`

Retrieves your current click tracking settings from SendGrid. Click tracking monitors user engagement by redirecting links in your emails through SendGrid's servers, allowing you to track when recipients click on links. Returns: - enabled: Whether click tracking is active for HTML emails - enable_text: Whether click tracking is active for plain text emails Note: SendGrid can track up to 1000 links per email. Requires the 'tracking_settings.click.read' scope.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve Current Enforced TLS Settings

**Slug:** `SENDGRID_RETRIEVE_CURRENT_ENFORCED_TLS_SETTINGS`

Retrieve the current Enforced TLS settings for your SendGrid account. Enforced TLS settings control whether recipients must support TLS encryption and have valid certificates to receive your emails. By default, SendGrid uses Opportunistic TLS, meaning emails are sent with TLS but fall back to unencrypted delivery if the recipient doesn't support TLS. When Enforced TLS is enabled: - If 'require_tls' is true, recipients must support TLS 1.1 or higher - If 'require_valid_cert' is true, recipients must have a valid certificate - If conditions aren't met, messages are dropped with a block event This endpoint requires the 'user.settings.enforced_tls.read' API scope. Note: This feature may not be available on all SendGrid plans.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve email statistics by browser

**Slug:** `SENDGRID_RETRIEVE_EMAIL_STATISTICS_BY_BROWSER`

Retrieve email statistics segmented by browser type (Chrome, Firefox, Safari, etc.). This endpoint is part of the Advanced Stats API and requires the 'browsers.stats.read' permission. Note: SendGrid only stores up to 7 days of browser-type statistics data. The response provides email click metrics (clicks, unique_clicks) grouped by date and browser type, useful for understanding how recipients interact with email links across different browsers.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | The number of results to return. Default is 500 (maximum per request). Use with offset for pagination. |
| `offset` | integer | No | The point in the list to begin retrieving results. Use with limit for pagination. Default is 0. |
| `browsers` | string | No | Filter statistics for specific browsers (e.g., 'Chrome', 'Firefox', 'Safari'). You can include up to 10 different browsers by including this parameter multiple times. |
| `end_date` | string | No | The end date of the statistics to retrieve. Format: YYYY-MM-DD (e.g., '2024-01-31'). Defaults to today if not specified. |
| `start_date` | string | Yes | The starting date of the statistics to retrieve (required). Format: YYYY-MM-DD (e.g., '2024-01-01'). Note: SendGrid only stores up to 7 days of browser statistics. |
| `aggregated_by` | string ("day" | "week" | "month") | No | Aggregation period for email statistics. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve email statistics by client type

**Slug:** `SENDGRID_RETRIEVE_EMAIL_STATISTICS_BY_CLIENT_TYPE`

Retrieve email statistics segmented by client type (Webmail, Desktop, Phone, Tablet, Other). This endpoint is part of the Advanced Stats API and requires the 'clients.stats.read' permission. Note: SendGrid only stores up to 7 days of client-type statistics data and returns a maximum of 500 items per request. The response provides email engagement metrics (opens, unique_opens) grouped by date and client type, useful for understanding how recipients interact with emails across different email clients.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | The number of results to return. Default is 500 (maximum per request). Use with offset for pagination. |
| `offset` | integer | No | The point in the list to begin retrieving results. Use with limit for pagination. Default is 0. |
| `end_date` | string | No | The end date of the statistics to retrieve. Format: YYYY-MM-DD (e.g., '2024-01-31'). Defaults to today if not specified. |
| `start_date` | string | Yes | The starting date of the statistics to retrieve (required). Format: YYYY-MM-DD (e.g., '2024-01-01'). Note: SendGrid only stores up to 7 days of client statistics. |
| `aggregated_by` | string ("day" | "week" | "month") | No | Aggregation period for email statistics. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve email statistics by device type

**Slug:** `SENDGRID_RETRIEVE_EMAIL_STATISTICS_BY_DEVICE_TYPE`

Retrieve email statistics segmented by device type (Desktop, Webmail, Phone, Tablet, Other). This endpoint is part of the Advanced Stats API and requires the 'stats.read' permission. Note: SendGrid only stores up to 7 days of device-type statistics data. The response provides email engagement metrics (opens, unique_opens) grouped by date and device type, useful for understanding how recipients interact with emails across different devices.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | The number of results to return. Default is 500 (maximum per request). Use with offset for pagination. |
| `offset` | integer | No | The point in the list to begin retrieving results. Use with limit for pagination. Default is 0. |
| `end_date` | string | No | The end date of the statistics to retrieve. Format: YYYY-MM-DD (e.g., '2024-01-31'). Defaults to today if not specified. |
| `start_date` | string | Yes | The starting date of the statistics to retrieve (required). Format: YYYY-MM-DD (e.g., '2024-01-01'). Note: SendGrid only stores up to 7 days of device statistics. |
| `aggregated_by` | string ("day" | "week" | "month") | No | Aggregation period for email statistics. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve email statistics by mailbox provider

**Slug:** `SENDGRID_RETRIEVE_EMAIL_STATISTICS_BY_MAILBOX_PROVIDER`

Retrieve email statistics segmented by recipient mailbox provider (e.g., Gmail, Yahoo, Microsoft Outlook). This endpoint is part of the Advanced Stats API and requires the 'stats.read' permission. Note: SendGrid only stores up to 7 days of mailbox provider statistics data. The response provides email delivery and engagement metrics grouped by date and mailbox provider, useful for understanding deliverability performance across different email service providers. Common mailbox providers include: Gmail, Yahoo, Microsoft Outlook (includes hotmail.com, outlook.com, live.com), AOL, and Apple Mail. SendGrid offers groupings for over 200 mailbox providers.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | The number of results to return. Default is 500 (maximum per request). Use with offset for pagination. |
| `offset` | integer | No | The point in the list to begin retrieving results. Use with limit for pagination. Default is 0. |
| `end_date` | string | No | The end date of the statistics to retrieve. Format: YYYY-MM-DD (e.g., '2024-01-31'). Defaults to today if not specified. |
| `start_date` | string | Yes | The starting date of the statistics to retrieve (required). Format: YYYY-MM-DD (e.g., '2024-01-01'). Note: SendGrid only stores up to 7 days of mailbox provider statistics. |
| `aggregated_by` | string ("day" | "week" | "month") | No | Aggregation period for email statistics. |
| `mailbox_providers` | string | No | The mailbox provider to filter statistics by (e.g., 'Gmail', 'Yahoo', 'Microsoft Outlook'). IMPORTANT: The first character must be capitalized (e.g., 'Gmail' works, 'gmail' does not). Common providers include: Gmail, Yahoo, Microsoft Outlook, AOL, Apple Mail. Note: You can pass multiple providers by specifying this parameter multiple times in raw API calls. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve email statistics for categories

**Slug:** `SENDGRID_RETRIEVE_EMAIL_STATISTICS_FOR_CATEGORIES`

Retrieve email statistics for specific categories within a date range. This endpoint returns detailed email metrics (delivered, opens, clicks, bounces, spam reports, etc.) for the specified categories, grouped by date. **Use Cases:** - Monitor email performance for specific campaign categories - Compare statistics across different email categories - Track trends over time with day/week/month aggregation **Limitations:** - Category statistics are available for the previous 13 months only - Free plans: limited to 100 categories daily - Paid plans: limited to 1,000 categories daily - Maximum 10 categories per request **Required Scope:** `categories.stats.read`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum number of results to return per page. Default is 500. |
| `offset` | integer | No | Number of results to skip for pagination. Default is 0. |
| `end_date` | string | No | The end date of the statistics to retrieve. Must follow format YYYY-MM-DD (e.g., '2024-01-31'). Defaults to today if not specified. |
| `categories` | string | Yes | The category name(s) to retrieve statistics for. For multiple categories, this can be a comma-separated list (e.g., 'marketing,transactional'). Maximum 10 categories per request. |
| `start_date` | string | Yes | The starting date of the statistics to retrieve. Must follow format YYYY-MM-DD (e.g., '2024-01-01'). Category statistics are only available for the previous 13 months. |
| `aggregated_by` | string ("day" | "week" | "month") | No | Aggregation period for email statistics. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve email statistics for your subusers

**Slug:** `SENDGRID_RETRIEVE_EMAIL_STATISTICS_FOR_YOUR_SUBUSERS`

Retrieves email statistics for specified subusers over a date range. Returns metrics including: blocks, bounces, clicks, delivered, opens, requests, unique_clicks, unique_opens, unsubscribes, and more. **Requirements:** - SendGrid Pro plan or higher with subusers configured - API key with `subusers.stats.read` scope **Usage Notes:** - Statistics are available for the last 3 years - Use `aggregated_by` to group results by day, week, or month - Results can be paginated using `limit` and `offset` parameters

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum number of results to return per page. Use with 'offset' for pagination through large result sets. |
| `offset` | integer | No | The starting index for pagination. Use with 'limit' to page through results. Example: offset=10, limit=10 returns results 11-20. |
| `end_date` | string | No | The end date of the statistics to retrieve. Must be in YYYY-MM-DD format. Example: '2024-01-31'. Defaults to today if not specified. |
| `subusers` | string | Yes | The username of the subuser to retrieve statistics for. Example: 'my_subuser'. Note: To retrieve statistics for multiple subusers (up to 10), make separate API calls for each subuser. |
| `start_date` | string | Yes | The starting date of the statistics to retrieve. Must be in YYYY-MM-DD format. Example: '2024-01-01'. Statistics are available for the last 3 years. |
| `aggregated_by` | string ("day" | "week" | "month") | No | Aggregation period for statistics grouping. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve footer mail settings

**Slug:** `SENDGRID_RETRIEVE_FOOTER_MAIL_SETTINGS`

Retrieve your current Footer mail settings from SendGrid. The Footer setting allows you to insert a custom footer at the bottom of all text and HTML email message bodies sent via the SendGrid v3 API or SMTP Relay. This endpoint returns the current enabled status and the configured HTML and plain text footer content.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `on_behalf_of` | string | No | Make API calls on behalf of a Subuser or customer account. For Subusers, use the Subuser's username (e.g., 'subuser-name'). For customer accounts, use 'account-id <account-id>' format. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve forward bounce mail settings

**Slug:** `SENDGRID_RETRIEVE_FORWARD_BOUNCE_MAIL_SETTINGS`

Retrieves the current forward bounce mail settings for your SendGrid account. Forward bounce mail settings allow you to specify an email address to which bounce reports will be forwarded. When enabled, you will receive notifications at the configured email address whenever a bounce event occurs. Note: This setting only forwards 'Bounce' events (permanent delivery failures). 'Block' events (temporary failures) are not included in the forwarding. Requires the 'mail_settings.read' scope on the API key.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve forward spam mail settings

**Slug:** `SENDGRID_RETRIEVE_FORWARD_SPAM_MAIL_SETTINGS`

Retrieves the current forward spam mail settings for your SendGrid account. Forward spam mail settings allow you to specify email address(es) to which spam reports will be forwarded. When enabled, you will receive notifications at the configured email address(es) whenever a spam report is filed against your emails. You can set multiple addresses by configuring a comma-separated list of emails in the email field. The Forward Spam setting may also be used to receive emails sent to abuse@ and postmaster@ role addresses if you have authenticated your domain. Requires the 'mail_settings.forward_spam.read' scope on the API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `on_behalf_of` | string | No | Make API calls on behalf of a Subuser or customer account. For Subusers, use the Subuser's username (e.g., 'subuser-name'). For customer accounts, use 'account-id <account-id>' format. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve global email statistics

**Slug:** `SENDGRID_RETRIEVE_GLOBAL_EMAIL_STATISTICS`

Retrieve global email statistics for your SendGrid account within a specific date range. Returns aggregated email metrics including: requests, delivered, bounces, blocks, opens, unique_opens, clicks, unique_clicks, spam_reports, and unsubscribes. Parent accounts can view their own stats or a subuser's aggregated data via the `on-behalf-of` header. Subusers see only their own stats. Requires 'stats.read' permission.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | The number of results to return. Default is 500 (maximum per request). Use with offset for pagination when retrieving large date ranges. |
| `offset` | integer | No | The point in the list to begin retrieving results. Use with limit for pagination. Default is 0. |
| `end_date` | string | No | The end date of the statistics to retrieve. Format: YYYY-MM-DD (e.g., '2024-01-31'). Defaults to today if not specified. |
| `start_date` | string | Yes | The starting date of the statistics to retrieve (required). Format: YYYY-MM-DD (e.g., '2024-01-01'). Statistics are available for the last 3 years. |
| `aggregated_by` | string ("day" | "week" | "month") | No | Aggregation period for email statistics. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve Google Analytics Settings

**Slug:** `SENDGRID_RETRIEVE_GOOGLE_ANALYTICS_SETTINGS`

Retrieves the current Google Analytics tracking settings for your SendGrid account. Google Analytics tracking adds UTM parameters to links in your emails to help you track user behavior and campaign performance in Google Analytics. Returns settings including enabled status and UTM parameters (source, medium, campaign, term, content). Requires 'tracking_settings.google_analytics.read' or 'tracking_settings.read' scope.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve legacy template mail settings

**Slug:** `SENDGRID_RETRIEVE_LEGACY_TEMPLATE_MAIL_SETTINGS`

Retrieves your current legacy email template mail settings. The legacy template setting wraps an HTML template around your email content, useful for marketing emails and HTML-formatted messages. Note: SendGrid now recommends using the more advanced Dynamic Transactional Templates instead of legacy templates. This endpoint requires the 'mail_settings.template.read' scope. Returns the 'enabled' status and 'html_content' of the configured legacy template.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve monthly stats for all subusers

**Slug:** `SENDGRID_RETRIEVE_MONTHLY_STATS_FOR_ALL_SUBUSERS`

Retrieves monthly email statistics for all subusers. Returns metrics such as blocks, bounces, clicks, delivered emails, opens, requests, unique clicks/opens, and unsubscribes. **Note**: This endpoint requires the `subusers.stats.monthly.read` API scope and is only available for SendGrid Pro plans and above that have subusers configured. **Important**: Sort operations are not available for: bounce_drops, deferred, invalid_emails, processed, spam_report_drops, spam_reports, or unsubscribe_drops metrics.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | string | Yes | The date of the month to retrieve statistics for. Must be formatted YYYY-MM-DD. For example, '2025-01-01' retrieves statistics for January 2025. |
| `limit` | integer | No | The maximum number of subuser results to return. Defaults to 5. |
| `offset` | integer | No | The starting point in the result list for pagination. Defaults to 0. |
| `subuser` | string | No | A substring to filter subusers by username. Only subusers with usernames containing this string will be included in the results. |
| `sort_by_metric` | string ("blocks" | "bounces" | "clicks" | "delivered" | "opens" | "requests" | "unique_clicks" | "unique_opens" | "unsubscribes") | No | Valid metrics for sorting subuser statistics. |
| `sort_by_direction` | string ("desc" | "asc") | No | Sort direction for ordering results. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve paged transactional templates

**Slug:** `SENDGRID_RETRIEVE_PAGED_TRANSACTIONAL_TEMPLATES`

**This endpoint allows you to retrieve all transactional templates.**

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page_size` | integer | Yes | The number of templates to be returned in each page of results |
| `page_token` | string | No | A token corresponding to a specific page of results, as provided by metadata  |
| `generations` | string ("legacy" | "dynamic" | "legacy,dynamic") | No | Comma-delimited list specifying which generations of templates to return. Options are `legacy`, `dynamic` or `legacy,dynamic`.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve recipients

**Slug:** `SENDGRID_RETRIEVE_RECIPIENTS`

Retrieve all marketing campaign recipients via this endpoint. Use batch deletion carefully, as it may lead to empty pages. Continue iterating pages until a 404 error occurs to ensure complete retrieval.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page index of first recipients to return (must be a positive integer) |
| `page_size` | integer | No | Number of recipients to return at a time (must be a positive integer between 1 and 1000)  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve recipients on a segment

**Slug:** `SENDGRID_RETRIEVE_RECIPIENTS_ON_A_SEGMENT`

Retrieves all recipients (contacts) in a specified segment from SendGrid's Legacy Marketing Campaigns Contact Database. This endpoint returns recipient data including: - Contact info: id, email, first_name, last_name - Timestamps: created_at, updated_at (in Unix time) - Engagement data: last_clicked, last_emailed, last_opened - Any custom fields defined in your contact database Note: This uses the Legacy Contacts API (/v3/contactdb). Segments must be created via the legacy 'create_a_segment' action, not the newer Marketing Campaigns v2 API segments. Supports pagination via 'page' and 'page_size' parameters for segments with many recipients.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page index to return (1-indexed). Defaults to 1 if not specified. Use with page_size for pagination through large recipient lists. |
| `page_size` | integer | No | Number of recipients to return per page. Defaults to 100 if not specified. Maximum value is 1000. |
| `segment_id` | integer | Yes | The numeric ID of the segment from which to retrieve recipients. Use the 'create_a_segment' or 'retrieve_all_segments' actions to obtain valid segment IDs. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve reserved fields

**Slug:** `SENDGRID_RETRIEVE_RESERVED_FIELDS`

**Retrieve all reserved fields from the Legacy Marketing Campaigns Contact Database.** This endpoint returns a list of fields that are reserved by SendGrid and cannot be used as custom field names. Reserved fields include: - **Text fields**: first_name, last_name, email - **Date fields**: created_at, updated_at, last_emailed, last_clicked, last_opened - **Set fields**: lists, campaigns **Note**: This is part of the Legacy Marketing Campaigns API. For new implementations, consider using the newer Marketing Campaigns API endpoint `/v3/marketing/field_definitions` which returns both custom and reserved fields. **Required API Scope**: Legacy Marketing Campaigns access (contactdb permissions)

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve scheduled send

**Slug:** `SENDGRID_RETRIEVE_SCHEDULED_SEND`

Retrieve the cancel/pause status of a scheduled email batch by its batch_id. Use this action to check whether a batch of scheduled emails has been paused or cancelled. The batch_id must have been created via 'create_a_batch_id' and then assigned a status via 'cancel_or_pause_a_scheduled_send'. Returns the batch_id and its status ('pause' or 'cancel'). If the batch has no pause/cancel status (i.e., emails were scheduled normally without being paused or cancelled), this endpoint may return empty data. Note: Only scheduled sends created with a batch_id can be retrieved. Emails scheduled via /mail/send with only send_at (no batch_id) cannot be queried.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The unique identifier for a batch of scheduled email sends. This batch_id must have been previously created using the 'create_a_batch_id' action and then assigned a pause or cancel status using 'cancel_or_pause_a_scheduled_send'. Only batches with an active pause/cancel status will return data. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieves inbound parse webhook statistics

**Slug:** `SENDGRID_RETRIEVES_INBOUND_PARSE_WEBHOOK_STATISTICS`

Retrieve statistics for emails processed by SendGrid's Inbound Parse Webhook. This endpoint returns metrics about the number of emails received and processed by the Inbound Parse Webhook within a specified date range. The Inbound Parse Webhook allows you to receive incoming emails, parse them, and have their contents (headers, body, attachments) POSTed to a URL you specify. **Access Control:** - Parent accounts see aggregated stats for their account and all subusers - Subusers see only their own stats - Use the 'on-behalf-of' header to retrieve stats for a specific subuser **Required Scope:** user.webhooks.parse.stats.read

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | The number of statistics to return per page. Use with offset for pagination. Default is 500 (maximum per request). |
| `offset` | integer | No | The number of statistics to skip. Use with limit for pagination. Default is 0. |
| `end_date` | string | No | The end date for the statistics to retrieve. Format: YYYY-MM-DD (e.g., '2024-01-31'). Defaults to today if not specified. |
| `start_date` | string | Yes | The starting date for the statistics to retrieve (required). Format: YYYY-MM-DD (e.g., '2024-01-01'). |
| `aggregated_by` | string ("day" | "week" | "month") | No | Aggregation period for Inbound Parse Webhook statistics. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve single segment endpoint

**Slug:** `SENDGRID_RETRIEVE_SINGLE_SEGMENT_ENDPOINT`

Retrieves detailed information about a specific Marketing Campaigns segment by its unique ID. Returns segment metadata including the SQL query defining membership criteria (query_dsl), contact count, query validation status, and timestamps. Optionally returns the parsed SQL query as a JSON AST when query_json=true. Note: This uses the Marketing Campaigns V2 Segmentation API. Contact counts are refreshed approximately every hour. Segments using engagement data may take 30 minutes to populate.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query_json` | boolean | No | Set to true to include the parsed SQL query as a JSON AST in the 'query_json' field of the response. Defaults to false. Useful for programmatic analysis of segment query structure. |
| `segment_id` | string | Yes | The unique identifier (UUID) of the segment to retrieve. You can obtain segment IDs from the 'Get List of Segments' endpoint (GET /v3/marketing/segments/2.0) or from the response when creating a segment. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve specific teammate

**Slug:** `SENDGRID_RETRIEVE_SPECIFIC_TEAMMATE`

Retrieves details of a specific SendGrid teammate by username. Returns teammate information including email, name, user type, admin status, and permission scopes. Use 'Retrieve all teammates' first to get valid usernames. Requires 'teammates.read' API scope for access.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | The username of the teammate to retrieve. You can retrieve usernames via the 'Retrieve all teammates' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve stats by a specific client type

**Slug:** `SENDGRID_RETRIEVE_STATS_BY_A_SPECIFIC_CLIENT_TYPE`

Retrieve email statistics for a specific client type (phone, tablet, webmail, or desktop). This endpoint is part of the Advanced Stats API and provides email engagement metrics (opens, unique_opens) filtered by a specific email client type. Use this to understand how recipients interact with emails on different devices/platforms. Requirements: - Requires 'stats.read' or 'clients.{client_type}.stats.read' permission - SendGrid only stores up to 7 days of client-type statistics data - Maximum 500 items per request

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `end_date` | string | No | The end date of the statistics to retrieve. Format: YYYY-MM-DD (e.g., '2024-01-31'). Defaults to today if not specified. |
| `start_date` | string | Yes | The starting date of the statistics to retrieve (required). Format: YYYY-MM-DD (e.g., '2024-01-01'). Note: SendGrid only stores up to 7 days of client-type statistics. |
| `client_type` | string ("phone" | "tablet" | "webmail" | "desktop") | Yes | The type of email client to retrieve statistics for. Options: 'phone' (mobile phone email apps), 'tablet' (tablet email apps), 'webmail' (browser-based email clients like Gmail), or 'desktop' (desktop email applications like Outlook). |
| `aggregated_by` | string ("day" | "week" | "month") | No | Aggregation period for email statistics. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve subscription tracking settings

**Slug:** `SENDGRID_RETRIEVE_SUBSCRIPTION_TRACKING_SETTINGS`

Retrieves the current subscription tracking settings for your SendGrid account. Subscription tracking automatically adds unsubscribe/subscribe links to the bottom of your emails, allowing recipients to manage their email preferences. This endpoint returns the current configuration including whether tracking is enabled and the customizable HTML/text content for the tracking links. No parameters required. Returns the enabled status, custom HTML content, plain text content, and optional custom landing page URL for subscription management.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve subuser reputations

**Slug:** `SENDGRID_RETRIEVE_SUBUSER_REPUTATIONS`

Retrieves sender reputation scores (0-100) for subusers. Reputation reflects email delivery performance based on recipient engagement, bounces, spam reports, and other negative actions. Higher scores indicate better sender behavior. Requires the 'subusers.reputations.read' API permission scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `usernames` | string | No | A comma-separated list of subuser usernames to filter the results. If not provided, returns reputations for all subusers. Example: 'subuser1,subuser2' or a single username like 'mysubuser'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve sums of email stats for each category

**Slug:** `SENDGRID_RETRIEVE_SUMS_OF_EMAIL_STATS_FOR_EACH_CATEGORY`

Retrieve aggregated email statistics sums for each category over a date range. This action returns the total sum of each email statistic metric (delivered, opens, clicks, bounces, etc.) for every category used in your SendGrid account. Categories help you organize and track different types of emails you send. **Key Features:** - Get stats across all categories or paginate through them - Sort by any metric (delivered, opens, clicks, etc.) - Aggregate by day, week, or month for trend analysis - Results are returned sorted by your chosen metric **Limitations:** - Statistics are only available for the previous 13 months - Paid accounts: 1,000 categories daily limit - Free accounts: 100 categories daily limit **Required Scope:** categories.stats.sums.read **Example Use Cases:** - Find your highest-performing email categories by delivery rate - Identify categories with high bounce or spam report rates - Track engagement trends across different email types

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum number of category results to return. Default: 5. Use higher values to retrieve more categories. |
| `offset` | integer | No | Number of results to skip for pagination. Default: 0. |
| `end_date` | string | No | The end date for statistics retrieval in YYYY-MM-DD format. Defaults to today if not specified. |
| `start_date` | string | Yes | Required. The starting date for statistics retrieval in YYYY-MM-DD format. Note: Category statistics are only available for the previous 13 months. |
| `aggregated_by` | string ("day" | "week" | "month") | No | How to group the statistics over time. Options: 'day', 'week', or 'month'. If not specified, returns total sums for the entire date range. |
| `sort_by_metric` | string ("delivered" | "requests" | "opens" | "unique_opens" | "clicks" | "unique_clicks" | "bounces" | "spam_reports" | "unsubscribes" | "invalid_emails" | "blocks") | No | Valid metrics to sort by. |
| `sort_by_direction` | string ("desc" | "asc") | No | The sort direction. Use 'desc' for descending (highest first) or 'asc' for ascending (lowest first). Default: desc. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve the count of billable recipients (Legacy)

**Slug:** `SENDGRID_RETRIEVE_THE_COUNT_OF_BILLABLE_RECIPIENTS`

Retrieves the count of billable recipients for SendGrid Legacy Marketing Campaigns. This endpoint returns the number of Marketing Campaigns recipients you will be billed for. You are billed for marketing campaigns based on the highest number of recipients you have had in your account at one time. **Important Notes:** - This is a Legacy Marketing Campaigns API endpoint (`/v3/contactdb/*`). - A 403 Forbidden error indicates your account does not have access to the Legacy Marketing Campaigns API. Newer SendGrid accounts may not have access to these endpoints. - For the current Marketing Campaigns API, use the `get_total_contact_count` action (`/v3/marketing/contacts/count`) instead. **Required Scopes:** Marketing Campaigns read permissions (contactdb.read). **Response:** - `recipient_count` (integer): The number of billable recipients.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve the default branded link

**Slug:** `SENDGRID_RETRIEVE_THE_DEFAULT_BRANDED_LINK`

Retrieves the default branded link for message sending. Branded links (formerly 'Link Whitelabel') allow click-tracked links, opens, and images in your emails to be served from your domain rather than sendgrid.net. The priority for default branded link is: 1. User-set default branded link 2. Legacy branded link 3. SendGrid's default link (100.ct.sendgrid.net) You can make this request on behalf of a subuser by including their ID in the 'on-behalf-of' header.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain` | string | No | Optional domain to filter results. When specified, returns the default branded link that matches this domain. If not specified, returns the account's default branded link. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve the lists that a recipient is on

**Slug:** `SENDGRID_RETRIEVE_THE_LISTS_THAT_A_RECIPIENT_IS_ON`

Retrieves all marketing campaign lists that a specific recipient belongs to. NOTE: This is a Legacy Marketing Campaigns API endpoint (/v3/contactdb/). For new implementations, consider using the new Marketing Campaigns API which uses different contact and list management endpoints. Each recipient can be on multiple lists. Use this endpoint to find all lists that a recipient has been added to. The recipient must exist in your Legacy Marketing Campaigns contact database.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `recipient_id` | string | Yes | The unique identifier of the recipient in the Legacy Marketing Campaigns contact database. This is the URL-safe Base64 encoding of the recipient's lowercased email address. For example, 'foo@example.com' becomes 'Zm9vQGV4YW1wbGUuY29t'. Treat recipient IDs as opaque values - pass them exactly as returned by other recipient API endpoints (like 'Retrieve recipients' or 'Add recipients'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve tracking settings

**Slug:** `SENDGRID_RETRIEVE_TRACKING_SETTINGS`

**This endpoint allows you to retrieve a list of all tracking settings on your account.**

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve User's Authenticated Domains

**Slug:** `SENDGRID_RETRIEVE_USER_S_AUTHENTICATED_DOMAINS`

Retrieve authenticated domains (up to five) assigned to a specific subuser. Parent accounts use this to view domains their subusers can use for sending emails. Requires 'Subuser Management' and 'Domain Authentication' API permissions. Must provide a valid subuser username - use 'list_all_subusers' to find usernames. Returns domain objects with id, subdomain, domain, validation status, and DNS records.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | The username of the subuser to retrieve authenticated domains for. This must be a valid subuser username belonging to the parent account. Use 'list_all_subusers' to get available subuser usernames. Domains can be associated with subusers via 'associate_an_authenticated_domain_with_a_given_user' or 'bind_authenticated_domains_to_user' actions. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve your account email address

**Slug:** `SENDGRID_RETRIEVE_YOUR_ACCOUNT_EMAIL_ADDRESS`

Retrieves the email address currently on file for your SendGrid account. This endpoint returns the primary email address associated with your account, which is used for account-related communications from SendGrid. **Required scope**: `user.email.read` **Returns**: An object containing the `email` field with your account email address.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve your credit balance

**Slug:** `SENDGRID_RETRIEVE_YOUR_CREDIT_BALANCE`

Retrieves the current email credit balance for your SendGrid account. This endpoint returns information about your account's email sending credits, including the total number of credits, remaining credits, used credits, and overage (if any). Credits determine how many emails you can send before incurring per-email overage charges. Response includes: - remain: Remaining credits available - total: Total credits assigned to your account - overage: Number of overdrawn credits (if applicable) - used: Number of credits consumed - last_reset: Date of last credit reset - next_reset: Date of next credit reset - reset_frequency: How often credits reset (e.g., 'monthly') Note: This endpoint requires the 'user.credits.read' scope.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Retrieve your username

**Slug:** `SENDGRID_RETRIEVE_YOUR_USERNAME`

Retrieve your current SendGrid account username and user ID. This endpoint returns your account username and user ID. **Required Scope**: user.username.read **Returns**: - username (str): Your SendGrid account username - user_id (int): Your SendGrid account user ID

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Returns a list of all partner settings

**Slug:** `SENDGRID_RETURNS_A_LIST_OF_ALL_PARTNER_SETTINGS`

Retrieve a paginated list of all partner settings that can be enabled for your SendGrid account. Partner settings allow integration with third-party services. Note: As of August 30, 2022, Twilio SendGrid removed the New Relic integration. Use Deliverability Insights instead. Requires 'partner_settings.read' API scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum number of partner settings to return per page. If omitted, the API default page size is used. |
| `offset` | integer | No | Number of items to skip before returning results. Use 0 for the first page, then increment by 'limit' value for subsequent pages. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Schedule a campaign

**Slug:** `SENDGRID_SCHEDULE_A_CAMPAIGN`

Schedules a Legacy Marketing Campaigns email for delivery at a specific time. The campaign must have subject, sender_id, content (HTML and plain text with [unsubscribe] tag), and at least one list or segment ID configured before scheduling. For better delivery rates, schedule at off-peak times (e.g., 10:53) rather than on the hour. Note: You cannot schedule a campaign that has already been sent or scheduled - use the update endpoint to modify a scheduled campaign.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `send_at` | integer | Yes | The unix timestamp (seconds since epoch) for when the campaign should be sent. Must be a future time. For better delivery rates, schedule at off-peak times (e.g., 10:53) rather than on the hour to avoid server congestion. |
| `campaign_id` | integer | Yes | The unique numeric ID of the campaign to schedule. The campaign must have a subject, sender_id, content (both HTML and plain text with [unsubscribe] tag), and at least one list_id or segment_id configured before it can be scheduled. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Schedule single send

**Slug:** `SENDGRID_SCHEDULE_SINGLE_SEND`

Schedule a Single Send for immediate or future delivery. Use `send_at: 'now'` to send immediately, or provide an ISO 8601 date-time for scheduled delivery. The Single Send must be fully configured with sender_id, recipients (list_ids, segment_ids, or send_to_all), and an unsubscribe option (suppression_group_id or custom_unsubscribe_url) before scheduling.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the Single Send to schedule. You can obtain Single Send IDs by calling GET /marketing/singlesends or from the response when creating a new Single Send. |
| `send_at` | string | Yes | When to send the Single Send. Use the string 'now' to send immediately, or provide a future date-time in ISO 8601 format (yyyy-MM-ddTHH:mm:ssZ). Example: '2025-12-31T23:59:59Z'. The Single Send must be fully configured (sender_id, recipients, unsubscribe option) before scheduling. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Search contacts

**Slug:** `SENDGRID_SEARCH_CONTACTS`

Find contacts using this endpoint with a body containing a `query` in SGQL. Searches must use lowercase, and only the first 50 matches are returned. Queries over 20s will timeout. Dates are in ISO format, not Unix timestamps.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | An SGQL search string or other pattern. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Search for suppressions within a group

**Slug:** `SENDGRID_SEARCH_FOR_SUPPRESSIONS_WITHIN_A_GROUP`

**This endpoint allows you to search a suppression group for multiple suppressions.** When given a list of email addresses and a group ID, this endpoint will only return the email addresses that have been unsubscribed from the given group.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `group_id` | string | Yes | The numeric ID of the suppression group (unsubscribe group) to search within. This must be a valid group ID that exists in your SendGrid account. You can obtain group IDs from the 'get_suppression_groups' or 'create_a_new_suppression_group' actions. |
| `recipient_emails` | array | Yes | A list of email addresses to search for within the suppression group. The API will return only those email addresses from this list that are currently suppressed (unsubscribed) in the specified group. Example: ['user1@example.com', 'user2@example.com'] |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Search recipients

**Slug:** `SENDGRID_SEARCH_RECIPIENTS`

Search for recipients in the Legacy Marketing Campaigns contact database by field value. This endpoint allows searching recipients by any field (email, first_name, last_name, or custom fields). It performs an exact match search equivalent to using 'eq' operator. For date fields (created_at, updated_at), searches are performed at day granularity. A Unix timestamp like 1422835600 searches the entire day containing that timestamp. **IMPORTANT**: This is a Legacy Marketing Campaigns API endpoint (/v3/contactdb/). It requires Legacy Marketing Campaigns access. Newer accounts may not have access and should use the new Marketing Campaigns Search Contacts API instead. Returns a list of matching recipients with their details including email, names, custom fields, and metadata like created_at/updated_at timestamps.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `field_name` | string | Yes | The field name to search by. Common fields: 'email', 'first_name', 'last_name', 'created_at', 'updated_at', or any custom field name you have defined. |
| `field_value` | string | Yes | The value to search for. For text fields (email, names), provide the exact value. For date fields (created_at, updated_at), provide a Unix timestamp in seconds (e.g., '1422835600' for Feb 2, 2015). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Send a campaign

**Slug:** `SENDGRID_SEND_A_CAMPAIGN`

Immediately sends an existing marketing campaign to its configured recipients. **IMPORTANT**: This is a Legacy Marketing Campaigns API endpoint. You may only send a campaign when it is in 'draft' status. The campaign must have: - A subject line - A sender_id (verified sender identity) - At least one list_id or segment_id for recipients Once sent, the campaign cannot be unsent. This action triggers immediate delivery to all recipients in the configured lists/segments. **Note**: This endpoint requires the 'marketing_campaigns.create' or 'marketing_campaigns.update' API scope. The Legacy Marketing Campaigns feature may require specific account access.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `campaign_id` | integer | Yes | The unique numeric identifier of the campaign to send immediately. The campaign must be in 'draft' status and must have a subject, sender_id, and at least one list_id or segment_id configured. Use the 'Retrieve all campaigns' or 'Create a campaign' action to obtain a valid campaign_id. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Send a test campaign

**Slug:** `SENDGRID_SEND_A_TEST_CAMPAIGN`

Sends a test version of a marketing campaign to specified email addresses for review before sending to your full recipient list. **IMPORTANT:** This is part of the Legacy Marketing Campaigns API which is being deprecated. For new implementations, consider using the Marketing Campaigns Single Sends API with the 'Send a Test Marketing Email' endpoint instead. **Requirements:** - The API key must have the 'marketing_campaigns.create' scope enabled - The campaign must exist and be in draft or scheduled status - The account must have Legacy Marketing Campaigns feature enabled **Use cases:** - Preview how your campaign will appear in recipients' inboxes - Test email rendering across different email clients - Verify personalization and dynamic content before sending **Multiple recipients:** Provide an array: ["one@example.com", "two@example.com"] Maximum of 10 test recipients allowed per request.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `to` | string | Yes | The email address(es) that should receive the test campaign. Can be a single email address (string) or multiple addresses (array of strings, e.g., ["one@example.com", "two@example.com"]). Maximum of 10 email addresses. |
| `campaign_id` | integer | Yes | The unique identifier of the campaign to send a test email for. This ID is returned when creating a campaign via the Create a Campaign endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Send a test marketing email

**Slug:** `SENDGRID_SEND_A_TEST_MARKETING_EMAIL`

Send a test marketing email before launching a campaign. This endpoint allows you to test your marketing email by sending it to up to 10 email addresses. The test email uses a Dynamic Transactional Template that you specify. **Requirements:** - A valid `template_id` for a Dynamic Transactional Template (Legacy templates not supported) - Either a `from_address` (verified email) OR a `sender_id` (verified sender identity) - At least one recipient email in the `emails` array (max 10) **Use Case:** Test your email template content, formatting, and delivery before sending to your full contact list.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `emails` | array | Yes | An array of email addresses to send the test message to. Maximum of 10 email addresses allowed. |
| `sender_id` | integer | No | The ID of a verified sender identity to use as the sender. Either this or `from_address` must be provided. You can retrieve sender IDs using the Senders API. |
| `template_id` | string | Yes | The ID of the Dynamic Transactional Template to use. Format: 'd-' followed by a 32-character hex string (e.g., 'd-1234567890abcdef1234567890abcdef'). Note: Legacy templates are not supported - only Dynamic Transactional Templates work with this endpoint. |
| `from_address` | string | No | The email address to use as the sender. Either this or `sender_id` must be provided. This should be a verified sender email address in your SendGrid account. |
| `version_id_override` | string | No | Override the active template version with a specific version ID. If not provided, the currently active template version will be used. |
| `suppression_group_id` | integer | No | The ID of the suppression group to associate with this email. This controls the unsubscribe group for recipients. |
| `custom_unsubscribe_url` | string | No | A custom unsubscribe URL to use instead of the default SendGrid unsubscribe link. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Send email with twilio sendgrid

**Slug:** `SENDGRID_SEND_EMAIL_WITH_TWILIO_SEND_GRID`

The Mail Send operation uses SendGrid's v3 API to send emails. Visit the provided link for an overview, features, limitations, quickstarts, and helper libraries.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `content` | array | No | An array of objects, each containing a message body"s content and [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types). You must specify at least one MIME type and may include multiple. To include more than one MIME type, add an object for each type to the array.  |
| `send_at` | integer | No | A [unix timestamp](https://en.wikipedia.org/wiki/Unix_time) allowing you to specify when your email should be sent. A send cannot be scheduled more than 72 hours in advance. This property may be overridden by the `send_at` property set at the personalizations level.  |
| `subject` | string | No | The global or _message level_ subject of your email. Subject lines set in personalizations objects will override this global subject line. See line length limits specified in [RFC 2822](https://www.rfc-editor.org/rfc/rfc2822#section-2.1.1) for guidance on subject line character limits.  |
| `batch_id` | string | No | An ID representing a batch of emails to be sent at the same time. Including a `batch_id` in your request allows you to include this email in that batch. It also enables you to cancel or pause the delivery of that batch. See the [Scheduled Sends API](https://sendgrid.com/docs/api-reference/) for more information about scheduling your email.  |
| `categories` | array | No | An array of category names assigned to this message. Categories allow you to group messages by categories you define. Categories should be used sparingly to create general groups that are relevant to you. Categories are not meant to be used to track individual mail sends. For more granular categorization and tracking, use the `custom_args` property. A category name cannot exceed 255 characters. See [**Working with Categories**](https://docs.sendgrid.com/for-developers/sending-email/categories) for more information.  |
| `from__name` | string | No | A name or title associated with the email address such as "Support" or "Alex".  |
| `attachments` | array | No | An array of objects where you can define any attachments to be included with the message. Each object contains a `content` property, which must be a Base64 encoded string of the attachment itself, and `type`, `filename`, `disposition`, and `content_id` properties that tell SendGrid how to handle the attachment.  |
| `custom_args` | string | No | Values that are specific to the entire send that will be carried along with the email and its activity data. Substitutions will not be made on custom arguments, so any string that is assigned to this property will be assumed to be the custom argument that you would like to be used. This parameter is overridden by `custom_args` set at the personalizations level. Total `custom_args` size may not exceed 10,000 bytes.  |
| `from__email` | string | No | The email address from which messages are sent. This address should be a verified sender in your Twilio SendGrid account. Email addresses specified in `personalizations` will override addresses set at the message level outside of the `personalizations` object.  |
| `template_id` | string | No | An email template ID. A template that contains a subject and content—either text or html—will override any subject and content values specified at the `personalizations` or message level. If a template ID begins with `d-`, it is a dynamic template and will work with the `dynamic_template_data` property. If the template ID does not begin with `d-`, it is a standard SendGrid template and will work with the `substitutions` property. See [**How to Send an Email with Dynamic Templates**](https://docs.sendgrid.com/ui/sending-email/how-to-send-an-email-with-dynamic-templates) for more information about working with templates.  |
| `ip_pool_name` | string | No | The IP Pool that you would like to send this email from. IP Pools allow you to group your dedicated Twilio SendGrid IP addresses in order to have more control over your deliverability. See [**IP Pools**](https://docs.sendgrid.com/ui/account-and-settings/ip-pools) for more information.  |
| `reply_to_list` | array | No | An array of recipients to whom replies will be sent. Each object in this array must contain a recipient"s email address. Each object in the array may optionally contain a recipient"s name. You can use either the `reply_to` property or `reply_to_list` property but not both.  |
| `asm__group__id` | integer | No | The unsubscribe group to associate with this email. See the [Suppressions API](https://docs.sendgrid.com/api-reference/suppressions/) to manage unsubscribe group IDs.  |
| `reply__to__name` | string | No | A name or title associated with the email address such as "Alex". |
| `personalizations` | array | Yes | An array of messages and their metadata. Each object within the `personalizations` array can be thought of as a mail envelope—it defines who should receive an individual message and how that message should be handled. See [**Personalizations**](https://sendgrid.com/docs/for-developers/sending-email/personalizations/) for more information.  |
| `reply__to__email` | string | No | An email address to which a message is sent. Email addresses specified in `personalizations` will override addresses set at the message level outside of the `personalizations` object.  |
| `asm__groups__to__display` | array | No | An array containing the unsubscribe groups that you would like to be displayed to a recipient on the unsubscribe preferences page. This page is displayed in the recipient"s browser when they click the unsubscribe link in your message.  |
| `mail__settings__footer__html` | string | No | The HTML content of your footer. |
| `mail__settings__footer__text` | string | No | The plain text content of your footer. |
| `mail__settings__footer__enable` | boolean | No | Indicates if this setting is enabled. |
| `mail__settings__sandbox__mode__enable` | boolean | No | Indicates if this setting is enabled. |
| `tracking__settings__ganalytics__enable` | boolean | No | Indicates if this setting is enabled. |
| `tracking__settings__ganalytics__utm__term` | string | No | Used to identify any paid keywords. |
| `tracking__settings__open__tracking__enable` | boolean | No | Indicates if this setting is enabled. |
| `tracking__settings__click__tracking__enable` | boolean | No | Indicates if this setting is enabled. |
| `tracking__settings__ganalytics__utm__medium` | string | No | Name of the marketing medium. (e.g., Email) |
| `tracking__settings__ganalytics__utm__source` | string | No | Name of the referrer source. (e.g., Google, SomeDomain.com, or Marketing Email)  |
| `tracking__settings__ganalytics__utm__content` | string | No | Used to differentiate your campaign from advertisements. |
| `tracking__settings__ganalytics__utm__campaign` | string | No | The name of the campaign. |
| `mail__settings__bypass__list__management__enable` | boolean | No | Indicates if this setting is enabled. |
| `mail__settings__bypass__spam__management__enable` | boolean | No | Indicates if this setting is enabled. |
| `tracking__settings__subscription__tracking__html` | string | No | HTML to be appended to the email with the subscription tracking link. |
| `tracking__settings__subscription__tracking__text` | string | No | Text to be appended to the email with the subscription tracking link. |
| `tracking__settings__click__tracking__enable__text` | boolean | No | Indicates if this setting should be included in the `text/plain` portion of your email.  |
| `mail__settings__bypass__bounce__management__enable` | boolean | No | Indicates if this setting is enabled. |
| `tracking__settings__subscription__tracking__enable` | boolean | No | Indicates if this setting is enabled. |
| `tracking__settings__open__tracking__substitution__tag` | string | No | Allows you to specify a substitution tag that you can insert in the body of your email at a location that you desire. This tag will be replaced by the open tracking pixel.  |
| `mail__settings__bypass__unsubscribe__management__enable` | boolean | No | Indicates if this setting is enabled. |
| `tracking__settings__subscription__tracking__substitution__tag` | string | No | A tag that will be replaced with the unsubscribe URL. If this property is used, it will override both the `text` and `html` properties. The URL of the link will be placed at the substitution tag"s location in the message body with no additional formatting.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Set up reverse dns

**Slug:** `SENDGRID_SET_UP_REVERSE_DNS`

Set up reverse DNS (rDNS) for a dedicated IP address. Reverse DNS allows mailbox providers to verify the sender by performing a reverse DNS lookup when receiving emails. This improves email deliverability by establishing trust between your sending IP and your domain. **Prerequisites:** - Your SendGrid account must have a dedicated IP address (not a shared IP) - You must own and control the domain being configured - After setup, you'll need to add the provided A record to your DNS provider **How it works:** 1. Call this endpoint with your domain and dedicated IP 2. SendGrid returns an A record configuration 3. Add the A record to your DNS provider 4. Use the validate endpoint to verify the configuration **Note:** Reverse DNS is only available for dedicated IP addresses which require a Pro plan or higher, or can be purchased as an add-on ($30/month per IP).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip` | string | Yes | The dedicated IP address for which you want to set up reverse DNS. Must be a valid IPv4 address assigned to your SendGrid account (e.g., '149.72.xxx.xxx'). Note: Reverse DNS is only available for dedicated IP addresses, not shared IPs. |
| `domain` | string | Yes | The root, or sending, domain that will be used to send messages from the IP address (e.g., 'example.com'). This domain must be one you own and control. |
| `subdomain` | string | No | Optional subdomain that will be used for reverse DNS lookups (e.g., 'mail' or 'em'). If not provided, SendGrid will generate one automatically. This should match the subdomain used when setting up domain authentication. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Start warming up an ip address

**Slug:** `SENDGRID_START_WARMING_UP_AN_IP_ADDRESS`

Put a dedicated IP address into warmup mode. IP warmup gradually increases the sending volume from an IP address to build a positive sending reputation. SendGrid automatically limits the hourly email volume during warmup to prevent deliverability issues. The IP must be a dedicated IP assigned to your account and must have at least one other warm IP to handle overflow traffic. Warmup typically completes in 30-60 days depending on email volume.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip` | string | Yes | The dedicated IP address to begin warming up. Must be a valid IPv4 address assigned to your SendGrid account (e.g., '149.72.123.45'). The IP must not already be in warmup mode. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Stop warming up an ip address

**Slug:** `SENDGRID_STOP_WARMING_UP_AN_IP_ADDRESS`

Stop warming up a dedicated IP address and remove automatic sending limits. When an IP is in warmup mode, SendGrid automatically limits the hourly email volume to gradually build sender reputation. This action removes those limits and takes the IP out of warmup mode. **Important Notes:** - Returns 204 No Content on success (empty response body) - The IP must be a dedicated IP assigned to your SendGrid account - The IP must currently be in warmup mode - Requires IP Management permissions on the API key - Only stop warmup when the IP has completed its warmup schedule (typically 30+ days) **Related Actions:** - Use 'Retrieve all IPs currently in warmup' to see which IPs are warming up - Use 'Start warming up an IP address' to begin warmup for a new IP - Use 'Retrieve the warmup status for a specific IP address' to check warmup progress

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip_address` | string | Yes | The IP address to remove from warmup mode. Must be a valid IPv4 address (e.g., '192.0.2.1') that is a dedicated IP assigned to your SendGrid account and currently in warmup. Use 'Retrieve all IPs currently in warmup' to get a list of IPs that can be stopped. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Sum email stats for subusers

**Slug:** `SENDGRID_SUM_EMAIL_STATS_FOR_SUBUSERS`

Retrieves summed email statistics for all subusers over a date range. Returns aggregated metrics including: blocks, bounces, clicks, delivered, opens, requests, unique_clicks, unique_opens, unsubscribes, and more for each subuser. **Requirements:** - SendGrid Pro plan or higher with subusers configured - API key with `subusers.stats.sums.read` scope **Usage Notes:** - Statistics are available for the last 3 years - Use `aggregated_by` to group results by day, week, or month - Results can be sorted by metric using `sort_by_metric` and `sort_by_direction` - Results can be paginated using `limit` and `offset` parameters

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum number of subuser results to return per page. Use with 'offset' for pagination through large result sets. |
| `offset` | integer | No | The starting index for pagination. Use with 'limit' to page through results. Example: offset=10, limit=5 returns results 11-15. |
| `end_date` | string | No | The end date of the statistics to retrieve. Must be in YYYY-MM-DD format. Example: '2024-12-31'. Defaults to today if not specified. |
| `start_date` | string | Yes | The starting date of the statistics to retrieve. Must be in YYYY-MM-DD format. Example: '2024-01-01'. Statistics are available for the last 3 years. |
| `aggregated_by` | string ("day" | "week" | "month") | No | Aggregation period for statistics grouping. |
| `sort_by_metric` | string | No | The metric to sort results by. Valid values include: 'delivered', 'blocks', 'bounces', 'clicks', 'opens', 'requests', 'unique_clicks', 'unique_opens', 'unsubscribes'. If not specified, results are returned in default order. Note: Cannot sort by 'bounce_drops', 'deferred', 'invalid_emails', 'processed', 'spam_report_drops', 'spam_reports', or 'unsubscribe_drops'. |
| `sort_by_direction` | string ("desc" | "asc") | No | Sort direction for statistics results. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Test an Event Webhook's Settings

**Slug:** `SENDGRID_TEST_AN_EVENT_WEBHOOK_S_SETTINGS`

Sends a test event notification to a specified URL to verify your webhook endpoint is properly configured to receive SendGrid events. The test sends a POST request with a JSON array containing sample event data. Optionally test OAuth authentication by providing OAuth credentials or referencing an existing webhook's saved credentials via its ID. Returns HTTP 204 on success.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | No | The UUID of an existing Event Webhook. When provided, SendGrid will use the saved OAuth credentials (oauth_client_id and oauth_token_url) for this webhook when testing. Obtain this ID from 'Retrieve all of your event webhooks' or 'Create a new event webhook' endpoints. |
| `url` | string | Yes | The URL where you want SendGrid to send the test event notification. This URL should be publicly accessible and ready to receive a POST request containing a JSON array of sample event data. |
| `oauth_client_id` | string | No | The OAuth client ID that SendGrid will send to your OAuth server to obtain an access token. Required when testing OAuth authentication for a new configuration. Must be provided together with `oauth_token_url`. |
| `oauth_token_url` | string | No | The URL of your OAuth server or service provider where SendGrid sends the client ID and secret to obtain an access token. Required when testing OAuth authentication. Must be provided together with `oauth_client_id`. |
| `oauth_client_secret` | string | No | The OAuth client secret for generating an access token. Required only when testing a new OAuth configuration that hasn't been saved to SendGrid. Must be provided together with `oauth_client_id` and `oauth_token_url`. For existing webhooks, SendGrid uses the stored secret. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Toggle signature verification for a single event webhook by id

**Slug:** `SENDGRID_TOGGLE_WEBHOOK_SIGNATURE`

Enable or disable signature verification for a single Event Webhook by its ID. When signature verification is enabled, SendGrid generates an ECDSA key pair and signs all webhook payloads using the private key. The signature is included in the `X-Twilio-Email-Event-Webhook-Signature` header of each webhook request. You can verify authenticity of incoming webhook requests using the public key returned by this endpoint. This helps ensure webhook requests genuinely originate from SendGrid and haven't been tampered with. Requires a valid webhook ID from the 'Get All Event Webhooks' endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique ID (UUID) of the Event Webhook for which to toggle signature verification. Obtain this ID from the 'Get All Event Webhooks' endpoint or when creating a new webhook. |
| `enabled` | boolean | Yes | Set to `true` to enable signature verification for this webhook, or `false` to disable it. When enabled, SendGrid will sign webhook payloads using ECDSA, and you can verify requests using the returned public key. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Unlink subuser domain

**Slug:** `SENDGRID_UNLINK_SUBUSER_DOMAIN`

Disassociate an authenticated domain from a subuser. This removes the link between a domain authentication and a specific subuser, preventing the subuser from sending emails using that domain. Prerequisites: - The domain must be authenticated and associated with the subuser - You must have the subuser's username - You must have the domain_id of the authenticated domain Use 'list_the_authenticated_domain_associated_with_the_given_user' to find domains linked to a specific subuser before calling this endpoint. Note: Each subuser can have up to 5 authenticated domains associated with them. This endpoint is for users with multiple domain associations.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | The username of the subuser to disassociate from the authenticated domain. This is a required parameter. Use 'list_all_subusers' to get a list of valid subuser usernames. |
| `domain_id` | integer | Yes | The numeric ID of the authenticated domain to disassociate from the subuser. Use 'list_all_authenticated_domains' or 'list_the_authenticated_domain_associated_with_the_given_user' to find domain IDs associated with a subuser. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Unschedule a scheduled campaign

**Slug:** `SENDGRID_UNSCHEDULE_A_SCHEDULED_CAMPAIGN`

Unschedule a campaign that has already been scheduled to be sent. **Note**: This endpoint is part of the Legacy Marketing Campaigns API. SendGrid recommends migrating to the new Marketing Campaigns for new implementations. A successful unschedule operation returns HTTP 204 No Content. The campaign must be in a 'Scheduled' state to be unscheduled. If the campaign is already being sent, you must use the cancel campaign endpoint instead. Common error scenarios: - 404: Campaign not found or not scheduled - 403: Insufficient permissions or IP not whitelisted - 400: Campaign cannot be unscheduled (e.g., already sent or in progress)

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `campaign_id` | integer | Yes | The unique numeric identifier for the campaign to unschedule. This ID is returned when creating a campaign via the Create Campaign endpoint, or can be retrieved using the Retrieve All Campaigns endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update a branded link

**Slug:** `SENDGRID_UPDATE_A_BRANDED_LINK`

Update a specific branded link's default status. Link branding (formerly 'Link Whitelabel') allows all click-tracked links in your emails to be served from your domain rather than sendgrid.net. Use this endpoint to change which branded link is the default for your account. You can submit this request as one of your subusers by including their ID in the `on-behalf-of` header.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The unique identifier of the branded link you want to update. You can obtain this ID from the 'Retrieve all branded links' action. |
| `default` | boolean | No | Set to true to make this the default branded link for your account. When setting a new default, the existing default link branding will automatically have its default status removed. Set to false to remove the default status from this branded link. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update a campaign

**Slug:** `SENDGRID_UPDATE_A_CAMPAIGN`

Updates an existing marketing campaign. You can modify the campaign's title, subject line, HTML content, plain text content, and categories. Note: You can only update campaigns that are in draft status - campaigns that have been scheduled or sent cannot be modified. This is part of the Legacy Marketing Campaigns API.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | No | The display title of the campaign. This is only visible to you in the SendGrid Marketing Campaigns UI, not to recipients. |
| `subject` | string | No | The subject line of the campaign email that recipients will see in their inbox. |
| `categories` | array | No | A list of category tags to associate with this campaign for organization and filtering purposes. |
| `campaign_id` | integer | Yes | The unique identifier of the campaign to update. You can only update campaigns that are in draft status. |
| `html_content` | string | No | The HTML content of the campaign email. This is the main body of the email that recipients will see. |
| `plain_content` | string | No | The plain text version of the campaign email. Used as fallback for email clients that don't support HTML. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update account offerings

**Slug:** `SENDGRID_UPDATE_ACCOUNT_OFFERINGS`

Updates the offerings (email packages and add-ons) assigned to a customer account. IMPORTANT: This endpoint is part of the Account Provisioning API and is only available to Twilio SendGrid reseller partners with a formal partnership agreement. Standard SendGrid accounts will receive a 403 Forbidden error. This is a PUT operation that completely replaces all offerings on the account. You must include ALL offerings you want the account to retain in each request. Offerings not included will be removed from the account. Available offerings include: - Base email packages (e.g., Free, Essentials, Pro) - Each account requires exactly one - Marketing Campaigns add-ons - Dedicated IP addresses - Expert Services Use the List Offerings endpoint to see all available offerings, and the Get Account Offerings endpoint to see what's currently assigned before making updates. When removing IP addresses, the API removes the most recently added IP. Contact SendGrid support if you need to remove a specific IP address.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accountID` | string | Yes | The unique Twilio SendGrid account ID for the customer account to update. This is a 20-character alphanumeric string (e.g., 'ZGkrHSypTsudrGkmdpJJ') returned when creating an account or retrievable via the Get All Accounts endpoint. |
| `offerings` | array | Yes | List of offering objects to assign to the account. Each offering requires 'name' (offering identifier), 'type' (package/addon/ip), and optionally 'quantity' (default 1). IMPORTANT: This replaces ALL existing offerings - include everything you want retained. Example: [{'name': 'org.ei.free.v1', 'type': 'package', 'quantity': 1}] |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update address whitelist mail settings

**Slug:** `SENDGRID_UPDATE_ADDRESS_WHITELIST_MAIL_SETTINGS`

Updates the address whitelist mail settings for your SendGrid account. The Address Whitelist setting allows you to specify email addresses or domains for which mail should never be suppressed due to bounces, blocks, or unsubscribes. For example, if you whitelist 'example.com', all bounces, blocks, and unsubscribes logged for that domain will be ignored and mail will be sent as normal. Key behaviors: - Use 'enabled' to turn the whitelist on/off - The 'list' parameter REPLACES the entire whitelist (not appends) - Include all addresses/domains you want whitelisted in a single request - For CAN-SPAM compliance, avoid whitelisting generic domains Note: For Regional (EU) subusers, utilizing this feature will cause customer personal information to be stored outside of the EU. Required scope: mail_settings.address_whitelist.update

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `list` | array | No | An array of email addresses or domains to whitelist. Each entry can be either a specific email address (e.g., 'user@example.com') or a domain (e.g., 'example.com') to whitelist all addresses for that domain. This completely replaces the existing whitelist - include all desired entries. For CAN-SPAM compliance, avoid whitelisting generic domains. |
| `enabled` | boolean | No | Set to true to enable the address whitelist, or false to disable it. When enabled, emails sent to addresses or domains in the whitelist will bypass suppression rules (bounces, blocks, unsubscribes). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update a list

**Slug:** `SENDGRID_UPDATE_A_LIST`

Updates the name of an existing recipient list in the Marketing Campaigns. This action allows you to rename a contact list. Lists are static collections of contacts in SendGrid Marketing Campaigns that can be used for email campaigns and segmentation. **Prerequisites**: - The list_id must be obtained from an existing list - Use 'Retrieve All Lists' action to get available list IDs - Requires SendGrid Marketing Campaigns API access **Note**: This uses the Marketing Campaigns Contact Database API (/v3/contactdb/lists/). This is a legacy endpoint that SendGrid maintains for backwards compatibility. For new implementations using UUID-based list IDs, use the 'Update List' action instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The new name for the list. This will replace the existing list name. |
| `list_id` | integer | Yes | The unique numeric ID of the recipient list to update. Obtain this from the 'Retrieve All Lists' action or when creating a list. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Account State

**Slug:** `SENDGRID_UPDATE_AN_ACCOUNT_S_STATE`

Update the state of a customer account using the Account Provisioning API. IMPORTANT: This endpoint is ONLY available to Twilio SendGrid reseller partners with a formal partnership agreement and proper IP whitelisting. Standard SendGrid accounts will receive a 403 Forbidden error. Use this endpoint to: - Activate a customer account to enable email sending (state='activated') - Deactivate a customer account to disable email sending (state='deactivated') Account states: - 'activated': Account is active and can send email - 'deactivated': Account is deactivated and cannot send email Prerequisites: - Valid SendGrid Partner/Reseller credentials - IP address must be whitelisted with SendGrid - Customer account must exist (created via SENDGRID_CREATE_AN_ACCOUNT)

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `state` | string ("activated" | "deactivated") | Yes | The new state to set for the customer account. Set to 'activated' to enable the account to send email, or 'deactivated' to disable the account from sending email. Use deactivation to temporarily suspend a customer's email sending ability. |
| `accountID` | string | Yes | The unique Twilio SendGrid account ID for the customer account whose state you want to update. This ID is returned when creating an account via the Create Account endpoint (SENDGRID_CREATE_AN_ACCOUNT). Format: alphanumeric string. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update an alert

**Slug:** `SENDGRID_UPDATE_AN_ALERT`

Update an existing SendGrid alert's settings. Supports updating two types of alerts: - **usage_limit**: Update the percentage threshold (0-100) or email recipient. - **stats_notification**: Update the frequency (daily/weekly/monthly) or email recipient. Note: You can only update fields relevant to the alert's type. Use 'Retrieve all alerts' to get the alert ID and current settings before updating.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `alert_id` | integer | Yes | The unique ID of the alert to update. Use 'Retrieve all alerts' action to get available alert IDs. |
| `email_to` | string | No | The new email address for alert notifications. Must be a valid email format. Example: alerts@example.com |
| `frequency` | string ("daily" | "weekly" | "monthly") | No | Frequency options for stats_notification alerts. |
| `percentage` | integer | No | The new percentage threshold (0-100) for usage_limit alerts. When email usage reaches this percentage, an alert will be sent. Only applicable to alerts of type 'usage_limit'. Example: 90 |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update an authenticated domain

**Slug:** `SENDGRID_UPDATE_AN_AUTHENTICATED_DOMAIN`

Updates the settings for an authenticated domain in SendGrid. Use this endpoint to modify the `custom_spf` and `default` settings for an existing authenticated domain. To get the domain_id, first use the 'List all authenticated domains' endpoint. **Parameters:** - `domain_id` (required): The numeric ID of the authenticated domain to update. - `custom_spf` (optional): Set to true for manual SPF configuration, false for automatic. - `default` (optional): Set to true to make this the default sending domain. **Note:** If you enable `custom_spf`, automatic security will be disabled and you'll need to configure your own SPF, DKIM, and MX records manually.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `default` | boolean | No | Set to true to make this the default authenticated domain for sending emails. Only one domain can be the default at a time. |
| `domain_id` | string | Yes | The unique numeric ID of the authenticated domain to update. You can get this from the 'List all authenticated domains' endpoint. |
| `custom_spf` | boolean | No | Set to true to generate a custom SPF record for manual security configuration. When false, SendGrid manages SPF automatically. Only set this if you need manual control over SPF records. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update an IP Pool Name

**Slug:** `SENDGRID_UPDATE_AN_IP_POOL_NAME`

Updates the name of an existing IP Pool in your SendGrid account. IP Pools allow you to group your dedicated SendGrid IP addresses together for better management of email sending reputation. For example, you might have separate pools named 'transactional' and 'marketing' to maintain separate reputations for different email types. Requirements: - SendGrid account with dedicated IP addresses (Pro or Premier plan) - API key with 'IP Address Management' scope or 'ips.pools.update' permission - The IP Pool must already exist (use 'Get All IP Pools' to find pool IDs) Note: This API endpoint is part of the IP Address Management API (public beta). The pool name must be unique and cannot start with a period (.) or space.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The new name to assign to the IP Pool. Must be unique across all your IP pools. The name cannot begin with a space or period (.). Example: 'marketing-emails' or 'transactional-pool'. |
| `poolid` | string | Yes | The unique identifier (UUID) of the IP Pool to rename. This can be obtained from the 'Get All IP Pools' or 'Get Details for an IP Pool' actions. Example: '5f2d3a4b-6c7d-8e9f-0123-456789abcdef'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update an SSO Integration

**Slug:** `SENDGRID_UPDATE_AN_SSO_INTEGRATION`

Update an existing Single Sign-On (SSO) integration for your SendGrid account. This endpoint allows you to modify SAML 2.0 SSO configuration settings for an integration with your Identity Provider (IdP) such as Okta, Azure AD, or Duo. You can update the integration name, enable/disable status, and IdP URLs. **Note**: SSO is available only for SendGrid Email API Pro, Premier, and Marketing Campaigns Advanced plans. The integration ID can be retrieved from the 'Get All SSO Integrations' endpoint.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique ID of the SSO integration to update. This ID can be retrieved from the 'Get All SSO Integrations' endpoint response. |
| `si` | boolean | No | If set to true, the response will include the 'completed_integration' field which indicates whether all required SSO configuration steps are complete. |
| `name` | string | No | A human-readable name for your SSO integration. Use a descriptive name that identifies your IdP (e.g., 'Okta SSO', 'Azure AD', 'Corporate SAML'). |
| `enabled` | boolean | No | Indicates if the SSO integration is enabled. Set to true to activate SSO authentication for your organization, false to disable it. |
| `entity_id` | string | No | The SAML Issuer ID provided by your Identity Provider (IdP) to identify Twilio SendGrid in the SAML interaction. This is typically a URL or URN format (e.g., 'https://idp.example.com/saml/sendgrid'). |
| `signin_url` | string | No | The IdP's SAML POST endpoint URL that receives authentication requests and initiates the SSO login flow. Also known as the 'Embed Link' or 'SSO URL' in the Twilio SendGrid UI. Must be a valid HTTPS URL. |
| `signout_url` | string | No | The IdP's logout URL for IdP-initiated authentication flows. When a user authenticates from their IdP and logs out, they will be redirected to this URL. Must be a valid HTTPS URL. |
| `completed_integration` | boolean | No | Indicates if the SSO integration setup is complete. Set to true when all configuration steps (including certificate upload) are finished. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update a parse setting

**Slug:** `SENDGRID_UPDATE_A_PARSE_SETTING`

Updates an existing Inbound Parse Webhook setting by hostname. **Prerequisites:** 1. The hostname must already exist as a configured parse setting. 2. Use 'Retrieve all parse settings' to list available hostnames. **Parameters:** - `hostname`: Required. The hostname of the parse setting to update. - `url`: Optional. New webhook URL to receive parsed emails via HTTP POST. - `send_raw`: Optional. Set to `true` to receive raw MIME content instead of parsed fields. - `spam_check`: Optional. Set to `true` to enable spam filtering (emails ≤2.5MB). - `on_behalf_of`: Optional. Subuser username to make the call on their behalf. **Returns:** The updated parse setting with hostname, url, send_raw, and spam_check values. **Note:** Only include the fields you want to update. Omitted fields remain unchanged.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | No | Optional. The public URL where SendGrid will POST the parsed email data. Must be publicly accessible and return HTTP 200 on success. SendGrid will not follow redirects. Example: `https://yourapp.com/webhook/inbound-email`. |
| `hostname` | string | Yes | Required. The hostname of the existing inbound parse setting to update. This must match a hostname that was previously configured via 'Create a parse setting'. Example: `parse.yourdomain.com`. Use 'Retrieve all parse settings' to list existing hostnames. |
| `send_raw` | boolean | No | Optional. When set to `true`, SendGrid posts the original MIME-type content of the parsed email as a raw payload. When `false`, SendGrid sends parsed fields (from, to, subject, text, html, attachments, etc.). Useful when you need to process the original email format. |
| `spam_check` | boolean | No | Optional. When set to `true`, SendGrid checks the parsed email content for spam before POSTing to your URL. Adds spam_report and spam_score fields to the payload. Only works for emails 2.5 MB or smaller. |
| `on_behalf_of` | string | No | Optional. Allows you to make API calls from a parent account on behalf of a Subuser or customer account. Use the subuser's username or 'account-id <account-id>' for customer accounts. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update API Key Name

**Slug:** `SENDGRID_UPDATE_API_KEY_NAME`

Updates the name of an existing SendGrid API key. This endpoint only modifies the key's display name and does not change its permissions/scopes. Use this to rename API keys for better organization. To update both name and scopes, use the 'Update API Key Name and Scopes' endpoint instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The new name for the API key. Use a descriptive name to easily identify the key's purpose. |
| `api_key_id` | string | Yes | The unique identifier of the API key to update. This ID is returned when creating an API key or can be obtained by listing all API keys via the List API Keys endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update api key name and scopes

**Slug:** `SENDGRID_UPDATE_API_KEY_NAME_AND_SCOPES`

Updates both the name and permission scopes of an existing SendGrid API key. IMPORTANT: The scopes array completely replaces the key's existing permissions. To preserve existing permissions while adding new ones, first retrieve the key's current scopes using 'Retrieve an existing API Key', then include all desired scopes in this request. To update only the name without changing scopes, use 'Update API key name' (PATCH) endpoint instead. Requires 'api_keys.update' scope on the authenticating API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The new display name for the API key. This name is used to identify the key in the SendGrid UI. |
| `scopes` | array | Yes | The complete list of permission scopes to assign to the API key. IMPORTANT: This replaces all existing scopes - include ALL desired scopes (e.g., ['mail.send', 'alerts.read']). Use 'Retrieve a list of scopes' endpoint to see available scopes. |
| `api_key_id` | string | Yes | The unique identifier of the API key to update. This can be retrieved from the 'Retrieve all API Keys' endpoint. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update a scheduled campaign

**Slug:** `SENDGRID_UPDATE_A_SCHEDULED_CAMPAIGN`

Updates the scheduled send time for a Legacy Marketing Campaigns email. The campaign must already be scheduled before using this endpoint. Use the Schedule a Campaign endpoint first to initially schedule a draft campaign. This endpoint changes only the send_at timestamp. Note: Legacy Marketing Campaigns require the 'marketing_campaigns.update' scope on your API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `send_at` | integer | Yes | The new Unix timestamp (seconds since epoch) for when the campaign should be sent. Must be a future time. For better delivery rates, schedule at off-peak times (e.g., 10:53) rather than on the hour to avoid server congestion. |
| `campaign_id` | integer | Yes | The unique numeric ID of the campaign whose schedule you want to update. The campaign must already be scheduled (not in draft status). Use the Retrieve All Campaigns endpoint to find campaign IDs. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update a scheduled send

**Slug:** `SENDGRID_UPDATE_A_SCHEDULED_SEND`

Update the status of a scheduled send batch that already has a pause or cancel status. Use to change between 'pause' and 'cancel' on batches that have an existing status (set via 'cancel_or_pause_a_scheduled_send'). To set initial status, use that action instead. To remove status entirely (resume), use 'delete_a_cancellation_or_pause_from_a_scheduled_send'. Notes: - Paused sends expire 72 hours after their send_at time - Cancelled sends are discarded at send_at time - Max 10 paused/cancelled batches allowed at once

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string ("cancel" | "pause") | Yes | The new status to set for this scheduled send batch. 'pause' temporarily holds scheduled sends (can be resumed within 72 hours after send_at time). 'cancel' permanently discards messages when their scheduled time arrives. This updates an existing status that was previously set. |
| `batch_id` | string | Yes | The unique identifier for the batch of scheduled sends to update. This batch_id must already have a pause or cancel status set via 'cancel_or_pause_a_scheduled_send'. You can find batch IDs using 'retrieve_all_scheduled_sends' or 'retrieve_scheduled_send'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update a segment

**Slug:** `SENDGRID_UPDATE_A_SEGMENT`

Updates an existing segment in SendGrid's Marketing Campaigns using the Segmentation V2 API. You can update the segment's name and/or the SQL query that defines membership criteria. At least one of 'name' or 'query_dsl' should be provided for the update. Important notes: - Segment names must be unique within your account - The query_dsl must select 'contact_id' and 'updated_at' from the 'contact_data' table - Segment counts are refreshed approximately once per hour, not immediately - For engagement-based segments (opens, clicks), population takes about 30 minutes Use the create_segment or get_list_of_segments endpoints to obtain valid segment IDs.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | The new name for the segment. Segment names must be unique within the account - providing a name that already exists will cause the request to fail. |
| `query_dsl` | string | No | SQL query that defines segment membership criteria. Must include 'contact_id' and 'updated_at' in the primary SELECT clause from the 'contact_data' table. Optionally join with 'event_data' for engagement-based segments. Supported operators: =, !=, >, <, >=, <=, AND, OR, NOT, IN, IS NULL, IS NOT NULL. Functions: current_timestamp, timestampadd(), array_contains(). Example: "SELECT contact_id, updated_at FROM contact_data WHERE first_name = 'John' AND last_name = 'Doe'" |
| `segment_id` | string | Yes | The unique ID of the segment to update. This is a UUID string obtained from create_segment or get_list_of_segments endpoints. Example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update a sender

**Slug:** `SENDGRID_UPDATE_A_SENDER`

Updates an existing Sender identity for use in SendGrid Marketing Campaigns. **Important Notes:** - Partial updates are supported - only include fields you want to change. - Changes to `from_email` require re-verification of the Sender. - If your domain is authenticated, new from_email addresses will auto-verify. - The required fields (nickname, from_email, address, city, country) must not be empty if included in the update. **Use Cases:** - Update physical address information for CAN-SPAM compliance. - Change the reply-to email address for a campaign. - Update the display name for branding purposes. - Modify the nickname for better organization in the dashboard.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The unique identifier of the Sender to update. Obtain this ID from the 'Get a list of all Senders' endpoint or from the response when creating a sender. Example: 12345. |
| `zip` | string | No | The postal or ZIP code for the Sender's address. Example: '94105' or 'M5V 3A8'. |
| `city` | string | No | The city where the Sender is located. Example: 'San Francisco'. |
| `state` | string | No | The state or province where the Sender is located. Example: 'CA' or 'California'. |
| `address` | string | No | The physical street address of the Sender (required for CAN-SPAM compliance). Example: '123 Main Street'. |
| `country` | string | No | The country where the Sender is located. Example: 'United States' or 'USA'. |
| `nickname` | string | No | A friendly name to identify this Sender in the SendGrid dashboard. Not displayed to email recipients. Example: 'Marketing Team' or 'Newsletter Sender'. |
| `address_2` | string | No | Additional address information such as suite, apartment, or unit number. Example: 'Suite 100' or 'Apt 4B'. |
| `from__name` | string | No | The display name shown alongside the from email address. Typically your name or company name. Example: 'John Smith' or 'Acme Corp Marketing'. |
| `from__email` | string | No | The email address that will appear in the 'From' field of sent emails. IMPORTANT: Changing this email requires re-verification. Example: 'marketing@example.com'. |
| `reply__to__name` | string | No | The display name for the reply-to address. Example: 'Customer Support' or 'Sales Team'. |
| `reply__to__email` | string | No | The email address where recipient replies will be sent. Example: 'support@example.com'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update a sender identity

**Slug:** `SENDGRID_UPDATE_A_SENDER_IDENTITY`

Updates an existing sender identity in SendGrid. This action allows partial updates - only the fields you provide will be modified, while all other fields remain unchanged. **Important Notes:** - Changing the from_email address requires re-verification of the sender identity. - Fields marked as "required" in the create endpoint must not be set to empty strings if included in the update request. - First retrieve sender IDs using the 'Get all sender identities' action. Use this to update sender display names, addresses, or reply-to information.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `zip` | string | No | The postal or ZIP code of the sender's address. Example: '94105'. |
| `city` | string | No | The city where the sender is located. Example: 'San Francisco'. |
| `state` | string | No | The state or province where the sender is located. Example: 'CA' or 'California'. |
| `address` | string | No | The physical street address of the sender (required for CAN-SPAM compliance). Example: '123 Main Street'. |
| `country` | string | No | The country where the sender is located. Example: 'United States' or 'USA'. |
| `nickname` | string | No | A friendly name to identify this sender in the SendGrid dashboard. Not displayed to email recipients. Example: 'Marketing Team'. |
| `address_2` | string | No | Additional address information such as suite, apartment, or unit number. Example: 'Suite 100'. |
| `sender_id` | integer | Yes | The unique identifier of the sender identity to update. Obtain this ID from the 'Get all sender identities' endpoint. Example: 12345. |
| `from__name` | string | No | The display name shown alongside the from email address. Typically your name or company name. Example: 'Acme Corp Marketing'. |
| `from__email` | string | No | The email address that will appear in the 'From' field of sent emails. IMPORTANT: Changing this requires re-verification. Example: 'marketing@example.com'. |
| `reply__to__name` | string | No | The display name for the reply-to address. Example: 'Customer Support'. |
| `reply__to__email` | string | No | The email address where recipient replies will be sent. Example: 'support@example.com'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update a single event webhook by id

**Slug:** `SENDGRID_UPDATE_A_SINGLE_EVENT_WEBHOOK_BY_ID`

Updates the configuration of a specific Event Webhook by its ID. You can modify the webhook URL, enable/disable it, subscribe to specific event types (bounce, click, delivered, open, etc.), set a friendly name, and configure OAuth settings. Only include fields you want to update - unspecified fields remain unchanged. For signature verification settings, use the separate 'Toggle Signature Verification' endpoint. The webhook ID is required and can be obtained from the 'Retrieve all event webhooks' or 'Create a new event webhook' endpoints.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique ID (UUID) of the Event Webhook to update. Obtain this ID from the 'Retrieve all of your event webhooks' or 'Create a new event webhook' endpoints. |
| `url` | string | No | Set this property to the URL where you want the Event Webhook to send event data.  |
| `open` | boolean | No | Set this property to `true` to receive open events. Open events occur when a recipient has opened the HTML message. You must [enable Open Tracking](https://docs.sendgrid.com/ui/account-and-settings/tracking#open-tracking) to receive this type of event.  |
| `click` | boolean | No | Set this property to `true` to receive click events. Click events occur when a recipient clicks on a link within the message. You must [enable Click Tracking](https://docs.sendgrid.com/ui/account-and-settings/tracking#click-tracking) to receive this type of event.  |
| `bounce` | boolean | No | Set this property to `true` to receive bounce events. A bounce occurs when a receiving server could not or would not accept a message.  |
| `dropped` | boolean | No | Set this property to `true` to receive dropped events. Dropped events occur when your message is not delivered by Twilio SendGrid. Dropped events are accomponied by a `reason` property, which indicates why the message was dropped. Reasons for a dropped message include: Invalid SMTPAPI header, Spam Content (if spam checker app enabled), Unsubscribed Address, Bounced Address, Spam Reporting Address, Invalid, Recipient List over Package Quota.  |
| `enabled` | boolean | No | Set this property to `true` to enable the Event Webhook or `false` to disable it.  |
| `include` | string | No | Use this to include optional fields in the response payload. When this is set to `include=account_status_change`, the `account_status_change` field will be part of the response payload and set to `false` by default. See [Update an event webhook](https://docs.sendgrid.com/api-reference/webhooks/update-an-event-webhook) for enabling this webhook notification which lets you subscribe to account status change events related to compliance action taken by SendGrid.  |
| `deferred` | boolean | No | Set this property to `true` to receive deferred events. Deferred events occur when a recipient"s email server temporarily rejects a message.  |
| `delivered` | boolean | No | Set this property to `true` to receive delivered events. Delivered events occur when a message has been successfully delivered to the receiving server.  |
| `processed` | boolean | No | Set this property to `true` to receive processed events. Processed events occur when a message has been received by Twilio SendGrid and the message is ready to be delivered.  |
| `spam_report` | boolean | No | Set this property to `true` to receive spam report events. Spam reports occur when recipients mark a message as spam.  |
| `unsubscribe` | boolean | No | Set this property to `true` to receive unsubscribe events. Unsubscribes occur when recipients click on a message"s subscription management link. You must [enable Subscription Tracking](https://docs.sendgrid.com/ui/account-and-settings/tracking#subscription-tracking) to receive this type of event.  |
| `friendly_name` | string | No | Optionally set this property to a friendly name for the Event Webhook. A friendly name may be assigned to each of your webhooks to help you differentiate them. The friendly name is for convenience only. You should use the webhook `id` property for any programmatic tasks.  |
| `oauth_client_id` | string | No | Set this property to the OAuth client ID that SendGrid will pass to your OAuth server or service provider to generate an OAuth access token. When passing data in this property, you must also include the `oauth_token_url` property.  |
| `oauth_token_url` | string | No | Set this property to the URL where SendGrid will send the OAuth client ID and client secret to generate an OAuth access token. This should be your OAuth server or service provider. When passing data in this field, you must also include the `oauth_client_id` property.  |
| `group_resubscribe` | boolean | No | Set this property to `true` to receive group resubscribe events. Group resubscribes occur when recipients resubscribe to a specific [unsubscribe group](https://docs.sendgrid.com/ui/sending-email/create-and-manage-unsubscribe-groups) by updating their subscription preferences. You must [enable Subscription Tracking](https://docs.sendgrid.com/ui/account-and-settings/tracking#subscription-tracking) to receive this type of event.  |
| `group_unsubscribe` | boolean | No | Set this property to `true` to receive group unsubscribe events. Group unsubscribes occur when recipients unsubscribe from a specific [unsubscribe group](https://docs.sendgrid.com/ui/sending-email/create-and-manage-unsubscribe-groups) either by direct link or by updating their subscription preferences. You must [enable Subscription Tracking](https://docs.sendgrid.com/ui/account-and-settings/tracking#subscription-tracking) to receive this type of event.  |
| `oauth_client_secret` | string | No | Set this property to the OAuth client secret that SendGrid will pass to your OAuth server or service provider to generate an OAuth access token. This secret is needed only once to create an access token. SendGrid will store the secret, allowing you to update your client ID and Token URL without passing the secret to SendGrid again. When passing data in this field, you must also include the `oauth_client_id` and `oauth_token_url` properties.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update a suppression group

**Slug:** `SENDGRID_UPDATE_A_SUPPRESSION_GROUP`

Updates an existing suppression group (also known as an unsubscribe group). A suppression group allows recipients to unsubscribe from specific types of emails (e.g., newsletters, promotions, alerts) rather than all emails from your account. You can update the group's name, description, or set it as the default suppression group. The name and description are visible to recipients when they manage their email subscriptions. Note: Only one suppression group can be the default at a time. Setting is_default=true will remove the default status from any other group. Requires the 'Unsubscribe Groups' permission scope on your API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | The new name for the suppression group. This name is visible to recipients when managing their email subscriptions. Maximum 30 characters. |
| `group_id` | string | Yes | The unique numeric ID of the suppression group to update. Can be obtained from the 'Create a new suppression group' or 'Get suppression groups' endpoints. |
| `is_default` | boolean | No | Set to true to make this the default suppression group for the account. Only one suppression group can be the default at a time. |
| `description` | string | No | A brief description of the suppression group. This description is visible to recipients when managing their email subscriptions. Maximum 100 characters. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update a User's Profile

**Slug:** `SENDGRID_UPDATE_A_USER_S_PROFILE`

Updates the authenticated user's profile information in SendGrid. **Important:** At least one parameter must be provided. You can update any combination of profile fields including name, company, address, phone, and website. **Use Cases:** - Update contact information when user details change - Add or modify company affiliation - Update address for account management purposes - Set or change website URL **Required API Scope:** user.profile.update **Note:** This endpoint may require IP whitelisting to be configured in your SendGrid account settings if access restrictions are enabled.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `zip` | string | No | The ZIP or postal code for the user's address. Example: '94105' or 'M5V 3A8'. |
| `city` | string | No | The city for the user's profile. Example: 'San Francisco' or 'New York'. |
| `phone` | string | No | The user's phone number. Example: '+1-555-123-4567'. |
| `state` | string | No | The state or province for the user's profile. Example: 'CA' or 'California'. |
| `address` | string | No | The street address for the user's profile. Example: '123 Main Street'. |
| `company` | string | No | The company name associated with the user's profile. Example: 'Acme Corporation'. |
| `country` | string | No | The country for the user's profile. Example: 'United States' or 'Canada'. |
| `website` | string | No | The website URL associated with the user. Example: 'https://example.com'. |
| `address2` | string | No | An optional second line for the street address, such as suite or apartment number. Example: 'Suite 100' or 'Apt 4B'. |
| `last_name` | string | No | The user's last name. Example: 'Smith'. |
| `first_name` | string | No | The user's first name. Example: 'John'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update bounce purge mail settings

**Slug:** `SENDGRID_UPDATE_BOUNCE_PURGE_MAIL_SETTINGS`

Update your Bounce Purge mail settings in SendGrid. This setting configures automatic purging of contacts from your hard and soft bounce suppression lists based on a specified number of days (1-3650). Note: This only affects suppression lists, not Marketing Campaigns contacts. Only provide values for the bounce types you want to configure; empty values will be ignored.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enabled` | boolean | No | Indicates if the bounce purge mail setting is enabled. When enabled, contacts will be automatically purged from suppression lists based on the configured hard_bounces and soft_bounces day thresholds. |
| `hard_bounces` | integer | No | The number of days after which SendGrid will purge all contacts from your hard bounces suppression lists. Valid range: 1-3650 days. Any hard bounces older than this value will be purged. |
| `on_behalf_of` | string | No | Make API calls on behalf of a Subuser or customer account. For Subusers, use the Subuser's username (e.g., 'subuser-name'). For customer accounts, use 'account-id <account-id>' format. |
| `soft_bounces` | integer | No | The number of days after which SendGrid will purge all contacts from your soft bounces suppression lists. Valid range: 1-3650 days. Any soft bounces older than this value will be purged. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update click tracking settings

**Slug:** `SENDGRID_UPDATE_CLICK_TRACKING_SETTINGS`

Updates click tracking settings for your SendGrid account. Click tracking monitors email engagement by redirecting links through SendGrid's servers (or your branded domain), allowing you to track when recipients click links. Parameters: - enabled: Enable/disable click tracking for HTML emails - enable_text: Enable/disable click tracking for plain text emails Note: SendGrid can track up to 1000 links per email. Consider privacy implications as tracking may require recipient consent depending on their location. Requires the 'tracking_settings.click.update' scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enabled` | boolean | No | Set to true to enable click tracking for HTML emails, or false to disable. When enabled, links in emails are redirected through SendGrid for tracking engagement. |
| `enable_text` | boolean | No | Set to true to enable click tracking for plain text emails, or false to disable. Only applicable when click tracking is enabled. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update custom field definition

**Slug:** `SENDGRID_UPDATE_CUSTOM_FIELD_DEFINITION`

Updates the name of an existing custom field in SendGrid Marketing Contacts. Only custom fields can be modified; Reserved Fields (like email, first_name, last_name) cannot be updated. The field_type cannot be changed after creation. Requires a valid custom_field_id obtained from 'Create Custom Field Definition' or 'Get All Field Definitions'.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | The new name for the custom field. Must be unique (case-insensitive), contain only alphanumeric characters (A-Z, 0-9) and underscores (_), and start with a letter or underscore. Maximum 100 characters. Cannot use reserved field names (email, first_name, last_name, etc.). |
| `custom_field_id` | string | Yes | The unique identifier of the custom field to update. Obtain this from 'Create Custom Field Definition' or 'Get All Field Definitions'. Format: 'e{number}_{type}' where type is T (Text), N (Number), or D (Date). Example: 'e1_T', 'e2_N'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update design

**Slug:** `SENDGRID_UPDATE_DESIGN`

Updates an existing email design in the SendGrid Design Library using PATCH. Only fields provided in the request will be updated; other fields remain unchanged. Use this to modify design name, HTML content, subject, categories, or plain text content. Requires the design ID which can be obtained from list_designs or create_design actions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique ID (UUID) of the design to update. Obtain this from the list_designs or create_design actions. |
| `name` | string | No | The name of the design. If provided, updates the design's display name in the Design Library. |
| `subject` | string | No | The email subject line for the design. |
| `categories` | array | No | List of category names to organize the design in the Design Library. |
| `html_content` | string | No | The HTML content of the design. Should be valid HTML for email rendering. |
| `plain_content` | string | No | Plain text version of the email content. If not provided and generate_plain_content is true, it will be auto-generated from html_content. |
| `generate_plain_content` | boolean | No | If true, plain_content is auto-generated from html_content. If false, plain_content remains unchanged. Defaults to true if not specified. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update details for an ip address

**Slug:** `SENDGRID_UPDATE_DETAILS_FOR_AN_IP_ADDRESS`

Updates settings for a dedicated IP address in your SendGrid account. This endpoint allows you to modify: - Auto warmup status: Enable/disable automatic IP warmup to build sender reputation - Parent assignment: Allow/revoke parent account access to send from this IP - Enabled status: Enable/disable the IP for sending email (non-Twilio IPs only) At least one of `is_auto_warmup`, `is_parent_assigned`, or `is_enabled` must be provided. Note: This API is part of the IP Address Management API which is in public beta. Requires a Pro Email API or Advanced Marketing Campaigns plan with dedicated IPs.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ip` | string | Yes | The dedicated IP address to update (e.g., '149.72.xx.xxx'). Must be a valid IP address assigned to your SendGrid account. |
| `is_enabled` | boolean | No | Set to true to enable the IP for sending email, or false to disable it. This applies to non-Twilio SendGrid IPs added to your account. For Twilio SendGrid IP addresses, this value is null. |
| `is_auto_warmup` | boolean | No | Set to true to enable automatic IP warmup, which throttles email volume to build sender reputation. Set to false to disable automatic warmup. |
| `is_parent_assigned` | boolean | No | Set to true to allow the parent account to send email from this IP address and make it eligible for IP pool assignment. Set to false to revoke parent access. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update enforced tls settings

**Slug:** `SENDGRID_UPDATE_ENFORCED_TLS_SETTINGS`

Update the Enforced TLS settings for your SendGrid account. Enforced TLS controls whether recipients must support TLS encryption and have valid certificates to receive your emails. By default, SendGrid uses Opportunistic TLS, meaning emails are sent with TLS but fall back to unencrypted delivery if the recipient doesn't support TLS. When Enforced TLS is enabled: - If 'require_tls' is true, recipients must support TLS 1.1 or higher - If 'require_valid_cert' is true, recipients must have a valid certificate - If conditions aren't met, messages are dropped with a block event This is an account-wide setting that applies to all emails sent through the account. Requires the 'user.settings.enforced_tls.update' API scope. Note: This feature may not be available on all SendGrid plans.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `version` | number | No | The minimum TLS version required for recipients. Common values: 1.1 (TLS 1.1), 1.2 (TLS 1.2), 1.3 (TLS 1.3). SendGrid enforces TLS 1.1 as the minimum supported version. |
| `require_tls` | boolean | No | When true, recipients must support TLS 1.1 or higher to receive emails. Messages to recipients without TLS support are dropped with a 'TLS required but not supported' block event. |
| `require_valid_cert` | boolean | No | When true, recipients must have a valid SSL/TLS certificate to receive emails. Messages to recipients with invalid or expired certificates are dropped. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update footer mail settings

**Slug:** `SENDGRID_UPDATE_FOOTER_MAIL_SETTINGS`

Update your Footer mail settings in SendGrid. This endpoint allows you to configure a custom footer that will be appended to the bottom of all outgoing text and HTML email bodies sent via the SendGrid v3 API or SMTP Relay. You can set the HTML and plain text versions of the footer content, and enable or disable the setting. Only provide the fields you want to update; omitted fields will retain their current values.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enabled` | boolean | No | Set to true to enable the footer mail setting, or false to disable it. When enabled, the configured footer content will be appended to all outgoing emails sent via the SendGrid v3 API or SMTP Relay. |
| `html_content` | string | No | The custom HTML content to insert at the bottom of HTML email bodies. Supports standard HTML tags for formatting. Example: '<p>Best regards,<br>The Team</p>' |
| `on_behalf_of` | string | No | Make API calls on behalf of a Subuser or customer account. For Subusers, use the Subuser's username (e.g., 'subuser-name'). For customer accounts, use 'account-id <account-id>' format. |
| `plain_content` | string | No | The plain text content to insert at the bottom of plain text email bodies. This is used for email clients that do not render HTML. Example: 'Best regards, The Team' |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update forward bounce mail settings

**Slug:** `SENDGRID_UPDATE_FORWARD_BOUNCE_MAIL_SETTINGS`

Updates the forward bounce mail settings for your SendGrid account. Forward bounce mail settings allow you to specify an email address to which bounce reports (permanent delivery failures) will be forwarded. This is useful for monitoring email delivery issues and maintaining list hygiene. Note: This setting only forwards 'Bounce' events. 'Block' events (temporary failures like rate limits) are not included in the forwarding. Requires the 'mail_settings.forward_bounce.update' scope on the API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | No | The email address to which bounce reports will be forwarded. Must be a valid email address. Required when enabling bounce forwarding. |
| `enabled` | boolean | No | Set to true to enable bounce forwarding, or false to disable it. When enabled, bounce reports (permanent delivery failures) will be sent to the specified email address. Note: 'Block' events (temporary failures) are not included. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update forward spam mail settings

**Slug:** `SENDGRID_UPDATE_FORWARD_SPAM_MAIL_SETTINGS`

Updates the Forward Spam mail settings for your SendGrid account. When enabled, spam reports will be forwarded to the specified email address(es). You can configure multiple forwarding addresses by providing a comma-separated list of email addresses. This setting can also be used to receive emails sent to abuse@ and postmaster@ role addresses if you have authenticated your domain. Requires the 'mail_settings.forward_spam.update' scope on the API key.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | No | The email address(es) where spam reports will be forwarded. You can specify multiple addresses as a comma-separated list (e.g., 'user1@example.com,user2@example.com'). This setting also allows receiving emails sent to abuse@ and postmaster@ role addresses if your domain is authenticated. |
| `enabled` | boolean | No | Set to true to enable forwarding spam reports to the specified email address(es), or false to disable this feature. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Google Analytics Settings

**Slug:** `SENDGRID_UPDATE_GOOGLE_ANALYTICS_SETTINGS`

Updates Google Analytics tracking settings for your SendGrid account. When enabled, UTM parameters are automatically appended to all links in your emails, allowing you to track email campaign performance in Google Analytics. You can configure the utm_source, utm_medium, utm_campaign, utm_term, and utm_content parameters that will be added to links. Requires 'tracking_settings.google_analytics.update' scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enabled` | boolean | No | Set to true to enable Google Analytics tracking for all emails sent. When enabled, UTM parameters will be appended to all links in your emails. |
| `utm_term` | string | No | Keywords associated with the campaign, typically used for paid search campaigns (e.g., 'running+shoes', 'discount'). Optional for email campaigns. |
| `utm_medium` | string | No | The marketing medium through which traffic is coming (e.g., 'email', 'cpc', 'social'). Typically set to 'email' for SendGrid. |
| `utm_source` | string | No | The source of traffic (e.g., 'sendgrid', 'newsletter', 'promo'). Identifies which site or platform sent the traffic to your property. |
| `utm_content` | string | No | Used to differentiate similar content or links within the same ad/email (e.g., 'header_link', 'footer_cta'). Helps identify which link was clicked. |
| `utm_campaign` | string | No | The name of the campaign for Google Analytics tracking (e.g., 'spring_sale', 'newsletter_jan'). Used to identify specific marketing campaigns. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Marketing Integration

**Slug:** `SENDGRID_UPDATE_INTEGRATION`

Update an existing Marketing Integration by its unique ID. An Integration is a connection from SendGrid Marketing Campaigns to a supported third-party application (currently only Segment is supported). This allows you to customize and automate email event forwarding to your Segment account. You can update the label, email event filters, and destination properties. Only the fields you provide will be updated; other fields remain unchanged.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the Marketing Integration to update. This ID is returned when creating an integration or can be obtained from the List Integrations endpoint (GET /v3/marketing/integrations). |
| `label` | string | No | A human-readable nickname for the Integration (e.g., 'My Segment Integration'). Omit this field if you don't want to change the label. |
| `destination` | string ("Segment") | No | Supported third-party integration destinations for email event forwarding. |
| `filters__email__events` | array | No | List of SendGrid email event types to forward to the Integration's destination. Valid values: ab_variation, ab_phase, drop, processed, deferred, group_unsubscribe, bounce, delivered, click, unsubscribe, open, group_resubscribe, spam_report. Omit this field if you don't want to change the event filters. |
| `properties__write__key` | string | No | The write key provided by the Segment Source you'd like to have events forwarded to. Must be between 6 and 51 characters. Omit this field if you don't want to change the write key. |
| `properties__destination__region` | string ("EU" | "US") | No | Segment workspace region where the Source write key is located. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update list

**Slug:** `SENDGRID_UPDATE_LIST`

Update the name of an existing contact list in SendGrid Marketing Campaigns. This endpoint allows you to rename a contact list. The list must already exist and you need its UUID to perform the update. **Note**: This action uses the Marketing Campaigns API (/v3/marketing/lists/). List IDs must be in UUID format (e.g., 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'). For legacy Contact Database lists (numeric IDs), use the 'Update a List' action instead. **Prerequisites**: Obtain the list ID from 'Get All Lists' or 'Create List' actions. Requires the Marketing Campaigns API scope (marketing.lists.update).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the list to update. Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. Obtain this from the 'Get All Lists' or 'Create List' actions. |
| `name` | string | No | The new name for the list. Required for updates. Must be unique within your account. Maximum 100 characters. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update open tracking settings

**Slug:** `SENDGRID_UPDATE_OPEN_TRACKING_SETTINGS`

Updates open tracking settings for your SendGrid account. Open tracking monitors email engagement by inserting an invisible 1x1 pixel image (tracking pixel) at the end of HTML emails. When a recipient opens the email and their email client loads images, SendGrid logs an 'open' event. Open tracking data is available in SendGrid's Statistics portal, Email Activity interface, and can be received via Event Webhook. Note: Open tracking only works with HTML emails where images are enabled by the recipient's email client. Plain text emails cannot be tracked for opens. Requires the 'tracking_settings.open.update' scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enabled` | boolean | No | Set to true to enable open tracking, or false to disable. When enabled, a transparent 1x1 pixel image is inserted at the end of HTML emails to track when recipients open them. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update single send

**Slug:** `SENDGRID_UPDATE_SINGLE_SEND`

Update a Single Send draft by its ID. This endpoint allows you to modify specific properties of a Single Send without affecting other fields. Note: Setting 'send_at' prepopulates the send date in the UI but does not schedule the Single Send. To schedule it, use the Schedule Single Send endpoint or the SendGrid UI.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier (UUID) of the Single Send to update. You can retrieve Single Send IDs from the 'Get All Single Sends' endpoint. |
| `name` | string | No | The name of the Single Send. This is used to identify the Single Send in the SendGrid UI. |
| `send_at` | string | No | Set this property to an ISO 8601 formatted date-time when you would like to send the Single Send. Please note that any `send_at` property value set with this endpoint will prepopulate the send date in the SendGrid user interface (UI). However, the Single Send will remain an unscheduled draft until it"s updated with the [**Schedule Single Send**](https://docs.sendgrid.com/api-reference/single-sends/schedule-single-send) endpoint or SendGrid application UI. Additionally, the `now` keyword is a valid `send_at` value only when using the Schedule Single Send endpoint. Setting this property to `now` with this endpoint will cause an error.  |
| `categories` | array | No | The categories to associate with this Single Send. |
| `send__to__all` | boolean | No | Set to `true` to send to All Contacts. If set to `false`, at least one `list_ids` or `segment_ids` value must be provided before the Single Send is scheduled to be sent to recipients.  |
| `send__to__list__ids` | array | No | The recipient List IDs that will receive the Single Send. |
| `email__config__editor` | string ("code" | "design") | No | The editor type used to create the email. Use 'code' for the code editor or 'design' for the design editor. |
| `email__config__subject` | string | No | The subject line of the Single Send. Do not include this field when using a `design_id`.  |
| `send__to__segment__ids` | array | No | The recipient Segment IDs that will receive the Single Send. |
| `email__config__ip__pool` | string | No | The name of the IP Pool from which the Single Send emails are sent. |
| `email__config__design__id` | string | No | A `design_id` can be used in place of `html_content`, `plain_content`, and/or `subject`. You can retrieve a design's ID from the List Designs endpoint (https://docs.sendgrid.com/api-reference/designs-api/list-designs) or by pulling it from the design's detail page URL in the Marketing Campaigns App. |
| `email__config__sender__id` | integer | No | The ID of the verified Sender. You can retrieve a verified Sender's ID from the Get Verified Senders endpoint (https://www.twilio.com/docs/sendgrid/api-reference/sender-verification/get-all-verified-senders) or by pulling it from the Sender's detail page URL in the SendGrid App. |
| `email__config__html__content` | string | No | The HTML content of the Single Send. Do not include this field when using a `design_id`.  |
| `email__config__plain__content` | string | No | The plain text content of the Single Send. Do not include this field when using a `design_id`.  |
| `email__config__suppression__group__id` | integer | No | The ID of the Suppression Group to allow recipients to unsubscribe — you must provide this or the `custom_unsubscribe_url`.  |
| `email__config__custom__unsubscribe__url` | string | No | The URL allowing recipients to unsubscribe — you must provide this or the `suppression_group_id`.  |
| `email__config__generate__plain__content` | boolean | No | If set to `true`, `plain_content` is always generated from `html_content`. If set to false, `plain_content` is not altered.  |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update SSO Certificate

**Slug:** `SENDGRID_UPDATE_SSO_CERTIFICATE`

Update an existing SSO (Single Sign-On) certificate by its ID. This endpoint allows you to modify the properties of an SSO certificate used for SAML 2.0 authentication. You can update the public certificate, enable/disable the certificate, or change its integration association. The certificate ID can be obtained from the 'Get All SSO Certificates by Integration' endpoint or from the response when creating a new certificate. Note: This endpoint requires SSO to be enabled on your SendGrid account (typically available on Pro, Premier, or Marketing Campaigns Advanced plans) and appropriate API key permissions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cert_id` | string | Yes | The unique ID of the SSO certificate to update. This ID is assigned by SendGrid when the certificate is created and can be obtained from the 'Get All SSO Certificates by Integration' endpoint. |
| `enabled` | boolean | No | Indicates whether the certificate is enabled for SAML authentication. Set to true to enable, false to disable. |
| `integration_id` | string | No | The ID of the SSO integration to associate this certificate with. This ID can be obtained from the 'Get All SSO Integrations' endpoint. |
| `public_certificate` | string | No | The X.509 public certificate in PEM format used for SAML 2.0 authentication. This certificate allows SendGrid to verify that SAML requests are signed by a recognized Identity Provider (IdP) such as Okta, Azure AD, or OneLogin. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update subscription tracking settings

**Slug:** `SENDGRID_UPDATE_SUBSCRIPTION_TRACKING_SETTINGS`

Updates subscription tracking settings for your SendGrid account. Subscription tracking automatically adds unsubscribe links to the bottom of your emails, allowing recipients to opt out of future communications. You can customize the HTML content, plain text content, landing page, replacement tags, and custom URL for unsubscribe handling. Requires 'tracking_settings.subscription.update' scope.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | No | A custom URL where users are redirected for unsubscribe handling. Use this if you want to handle unsubscribes on your own server instead of SendGrid's default landing page. |
| `enabled` | boolean | No | Set to true to enable subscription tracking (unsubscribe links) in emails, or false to disable. When enabled, unsubscribe links are added to emails allowing recipients to opt out. |
| `landing` | string | No | The HTML content for the unsubscribe confirmation landing page displayed after a recipient clicks the unsubscribe link. This page is hosted by SendGrid. |
| `replace` | string | No | A custom replacement tag for placing unsubscribe content anywhere in your email templates. If set, this tag will be replaced with the unsubscribe link instead of appending to the email footer. Example: '[unsubscribe]' |
| `html_content` | string | No | The HTML content for the unsubscribe section in HTML emails. Must include the '<% %>' tag which will be replaced with the unsubscribe URL. Example: '<p>Click <a href="<% %>">here</a> to unsubscribe.</p>' |
| `plain_content` | string | No | The plain text content for the unsubscribe section in text-only emails. Must include the '<% %>' tag which will be replaced with the unsubscribe URL. Example: 'To unsubscribe, visit: <% %>' |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Teammate's Permissions

**Slug:** `SENDGRID_UPDATE_TEAMMATE_S_PERMISSIONS`

Updates a teammate's permissions in your SendGrid account. To grant full admin access: set `is_admin` to True and `scopes` to an empty array []. To assign specific permissions: set `is_admin` to False and provide the desired scopes. Only the parent account owner or teammates with admin privileges can update permissions. Requires the 'teammates.update' API scope. Note: SSO teammates should be updated using the 'Edit SSO Teammate' action instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scopes` | array | Yes | List of permission scopes to assign to the teammate. Must be an empty array [] if is_admin is True. Common scopes include: 'user.profile.read', 'user.profile.update', 'mail.send', 'templates.read', 'templates.create', 'stats.read', 'stats.global.read', 'marketing.read', 'api_keys.read'. Use 'Retrieve scopes' action to get all available scopes. |
| `is_admin` | boolean | Yes | Set to True to grant this teammate full admin privileges (they will have access to all features). When True, the 'scopes' parameter must be an empty array []. Set to False to assign specific permission scopes instead. |
| `username` | string | Yes | The username of the teammate whose permissions you want to update. Use the 'Retrieve all teammates' action to get valid usernames. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update template mail settings

**Slug:** `SENDGRID_UPDATE_TEMPLATE_MAIL_SETTINGS`

Updates the legacy email template mail settings for your SendGrid account. When enabled, this template wraps around all emails sent via the SendGrid API. Note: SendGrid now recommends using Dynamic Transactional Templates instead of legacy templates for more advanced templating features. The html_content must include the '<% body %>' tag to indicate where the email body content will be inserted. Required scope: mail_settings.template.update

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enabled` | boolean | No | Set to true to enable the legacy email template mail setting, or false to disable it. When enabled, the html_content template wraps around all emails sent via the API. |
| `html_content` | string | No | The HTML content for your legacy email template. Must include the '<% body %>' tag where your email content will be inserted. Example: '<html><body><% body %></body></html>'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update the credits for a subuser

**Slug:** `SENDGRID_UPDATE_THE_CREDITS_FOR_A_SUBUSER`

Update the credit allocation settings for a SendGrid Subuser. This action allows you to configure how many email credits a Subuser can use and how those credits are managed. Credits control the number of emails a Subuser can send. **Credit Types:** - `unlimited`: Subuser has no credit limit (no restrictions on sending). - `recurring`: Credits reset periodically (daily/weekly/monthly) to a fixed amount. - `nonrecurring`: One-time credit allocation that does not automatically reset. **Usage Examples:** - Set unlimited credits: type='unlimited' (omit total and reset_frequency) - Set 1000 monthly recurring credits: type='recurring', total=1000, reset_frequency='monthly' - Set 500 one-time credits: type='nonrecurring', total=500 (omit reset_frequency) **Note:** Requires a SendGrid parent account with Subuser management capabilities.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string ("unlimited" | "recurring" | "nonrecurring") | Yes | Determines how credits are reset for a Subuser. 'unlimited': No limit to the Subuser's credits (do NOT include 'total' or 'reset_frequency'). 'recurring': Credits reset periodically according to 'reset_frequency' (requires 'total' and 'reset_frequency'). 'nonrecurring': One-time credit allocation with no automatic reset (requires 'total', do NOT include 'reset_frequency'). |
| `total` | integer | No | Total number of credits to allocate to the Subuser. Required if 'type' is 'nonrecurring' (one-time allocation) or 'recurring' (reset periodically to this value). Do NOT include this field if 'type' is 'unlimited'. |
| `subuser_name` | string | Yes | The username of the Subuser. |
| `reset_frequency` | string ("monthly" | "weekly" | "daily") | No | The frequency with which a Subuser's credits are reset when 'type' is set to 'recurring'. Valid values: 'daily', 'weekly', 'monthly'. Required if type is 'recurring'. Do NOT include this field if type is 'unlimited' or 'nonrecurring'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update the remaining credits for a subuser

**Slug:** `SENDGRID_UPDATE_THE_REMAINING_CREDITS_FOR_A_SUBUSER`

Updates the remaining credits for a specific Subuser account by adding or subtracting from the current credit balance. Use a positive `allocation_update` value to increase credits or a negative value to decrease credits. Returns the updated credit information including the new remaining balance, total credits, and credit type. **Note**: This endpoint requires parent account credentials with subuser management permissions. Only available on Pro or Premier SendGrid plans.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `subuser_name` | string | Yes | The username of the Subuser whose remaining credits will be updated. |
| `allocation_update` | integer | Yes | The number of credits to add to or subtract from the current remaining credits for the Subuser. Use a positive number to increase the remaining credits or a negative number to reduce the remaining credits. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update your account email address

**Slug:** `SENDGRID_UPDATE_YOUR_ACCOUNT_EMAIL_ADDRESS`

Updates the email address currently on file for your SendGrid account. This endpoint modifies the primary email address associated with your account, which is used for account-related communications from SendGrid. **Required scope**: `user.email.update` **Request body**: Requires an `email` field with the new email address. **Returns**: An object containing the `email` field with the updated account email address.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The new email address to set for your SendGrid account. Must be a valid email address format (e.g., 'user@example.com'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update your password

**Slug:** `SENDGRID_UPDATE_YOUR_PASSWORD`

Update the password for your SendGrid account. **Important**: This endpoint requires username/password authentication and cannot be accessed using API key authentication. API keys do not have the `user.password.update` scope. This is a security measure to protect account credentials. This is a destructive operation that changes account access credentials.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `new_password` | string | Yes | The new password to set for the SendGrid account. Must meet SendGrid's password requirements (typically at least 8 characters with a mix of letters, numbers, and special characters). |
| `old_password` | string | Yes | The current password for the SendGrid account. Required to verify identity before allowing password change. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update your username

**Slug:** `SENDGRID_UPDATE_YOUR_USERNAME`

Update the username for your SendGrid account. This endpoint allows you to change the username associated with your account. The username must be unique across all SendGrid accounts. **Required scope:** `user.username.update` Note: Updating your username may affect how you log into the SendGrid dashboard.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | The new username you would like to use for your SendGrid account. Must be unique across all SendGrid accounts. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Validate a batch ID

**Slug:** `SENDGRID_VALIDATE_A_BATCH_ID`

Validate whether a mail batch ID exists in SendGrid's system. This endpoint checks if a batch ID has been created and is valid. A successful response (HTTP 200) indicates the batch ID exists. An invalid batch ID returns HTTP 400. **Important**: A valid batch ID simply means it has been created via the 'Create a batch ID' endpoint. It does NOT indicate whether any emails have been sent using this batch ID or whether it's assigned to a scheduled send. Use this endpoint to verify batch IDs before using them with the Cancel Scheduled Sends API (pause, cancel, or resume scheduled sends). Required scope: `mail.batch.read`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch ID to validate. This is a base64-encoded string obtained from the 'Create a batch ID' endpoint. Example: 'YTBhNGZjNDctZmE3MS0xMWYwLTk5NzktNzY4NmM0YzU5MWNl'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Validate a branded link

**Slug:** `SENDGRID_VALIDATE_A_BRANDED_LINK`

**This endpoint allows you to validate a branded link.** It checks that the required DNS CNAME records are correctly configured for your branded link domain. The validation verifies: - **domain_cname**: The CNAME record for your branded link subdomain (e.g., links.yourdomain.com) - **owner_cname**: The CNAME record that verifies ownership of the branded link You can submit this request as one of your subusers if you include their ID in the `on-behalf-of` header in the request. **Note**: You should configure your DNS records before calling this endpoint. The validation will fail if the CNAME records are not properly set up with your DNS provider.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The ID of the branded link that you want to validate. You can retrieve branded link IDs using the 'Retrieve all branded links' endpoint. |
| `on-behalf-of` | string | No | The username of the subuser to make the request on behalf of. This allows parent accounts to validate branded links for their subusers. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Validate a domain authentication

**Slug:** `SENDGRID_VALIDATE_A_DOMAIN_AUTHENTICATION`

**This endpoint allows you to validate an authenticated domain.** It checks that the required DNS records are correctly configured for your sending domain. The validation verifies different records based on your domain's security setting: **When automatic_security is enabled (default):** - **mail_cname**: The CNAME record for your mail subdomain - **dkim1**: The first DKIM CNAME record - **dkim2**: The second DKIM CNAME record **When automatic_security is disabled:** - **mail_server**: The MX record pointing to SendGrid - **subdomain_spf**: The SPF TXT record for your subdomain - **dkim**: The DKIM TXT record containing your public key If validation fails, the response includes detailed reasons for each failed record, helping you identify which DNS entries need to be corrected. **Note**: Configure your DNS records with your domain provider before calling this endpoint. Validation will fail if records are not properly set up. DNS changes may take up to 48 hours to propagate.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The unique identifier of the authenticated domain to validate. You can retrieve domain IDs using the 'List all authenticated domains' endpoint. |
| `on-behalf-of` | string | No | The username of the subuser to make the request on behalf of. This allows parent accounts to validate authenticated domains for their subusers. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Validate an email

**Slug:** `SENDGRID_VALIDATE_AN_EMAIL`

Validates an email address and returns a verdict on its validity. This endpoint checks if an email address is valid, risky, or invalid by analyzing: - Email syntax and format - Domain DNS records (MX/A records) - Disposable email detection - Role-based email detection (e.g., admin@, hr@) - Known and suspected bounce history Returns a score from 0-1 indicating validity likelihood and a verdict of 'Valid', 'Risky', or 'Invalid'. Also detects potential typos and provides domain suggestions. **Note**: This is a premium feature available only to Email API Pro and Premier level accounts. Rate limited to 600 requests per minute.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email address to validate. Must be a properly formatted email address (e.g., user@example.com). |
| `source` | string | No | A one-word classifier for where this validation originated (e.g., 'signup', 'newsletter', 'import'). Used for categorizing validation requests. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Validate a reverse dns record

**Slug:** `SENDGRID_VALIDATE_A_REVERSE_DNS_RECORD`

Validate a reverse DNS (rDNS) record to check if DNS is properly configured. This endpoint verifies that the A record for reverse DNS has been correctly added to your DNS provider. After setting up reverse DNS, you must add the provided A record to your DNS, then use this endpoint to validate the configuration. **Response Interpretation:** - `valid: true` in `validation_results.a_record` means the A record is properly configured - `valid: false` means validation could not confirm the record - check the `reason` field - A false result indicates undetermined status, not necessarily invalid configuration **Prerequisites:** - A reverse DNS record must already exist (created via 'Set up reverse DNS') - The A record must be added to your DNS provider before validation - Requires a dedicated IP address (not available for shared IPs) - Requires 'whitelabel.update' API scope **Note:** DNS propagation can take up to 48 hours. If validation fails immediately after adding DNS records, wait and try again later.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique numeric ID of the reverse DNS record to validate. This ID can be obtained from the 'Retrieve all reverse DNS records' endpoint or from the response when setting up reverse DNS. Example: '123456'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Verify sender request

**Slug:** `SENDGRID_VERIFY_SENDER_REQUEST`

Verifies a sender identity using a token from the verification email. When you create a sender identity via 'Create Verified Sender Request', SendGrid sends a verification email to that address. The email contains a verification link with a unique token. Use this endpoint with that token to complete verification. After verification, the sender can be used to send emails. Note: The token is only available in the verification email and cannot be retrieved via API.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | string | Yes | The verification token from the email sent to the sender's email address. This token is generated by SendGrid and included in the verification email when a sender identity is created via the 'Create Verified Sender Request' endpoint. The token is typically a URL-safe string. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### View a sender identity

**Slug:** `SENDGRID_VIEW_A_SENDER_IDENTITY`

Retrieves the details of a specific Legacy Sender Identity by its unique ID. Returns comprehensive sender information including: - Sender identification (ID, nickname) - Email configuration (from email/name, reply-to email/name) - Physical address details (address, city, state, zip, country) - Status flags (verified, locked) - Timestamps (created_at, updated_at) Note: This endpoint is for Legacy Sender Identities (used with Legacy Marketing Campaigns). For Marketing Senders (used with new Marketing Campaigns), use the 'Get a specific sender' action instead. Only verified Senders can be used to send emails. A Sender becomes locked when associated with an active campaign.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sender_id` | integer | Yes | The unique numeric identifier of the Legacy Sender Identity to retrieve. You can obtain sender IDs by listing all sender identities using the 'Get all Sender Identities' action. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### View scheduled time of a campaign

**Slug:** `SENDGRID_VIEW_SCHEDULED_TIME_OF_A_CAMPAIGN`

Retrieves the scheduled send date and time for a Legacy Marketing Campaign. Use this endpoint to check when a campaign is scheduled to be sent. Note: This endpoint is part of the Legacy Marketing Campaigns API. For newer implementations, consider using the Single Sends API. The campaign must be scheduled (not in draft or already sent status) for this endpoint to return schedule data. Returns a 404 error if the campaign is not found or not scheduled.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `campaign_id` | integer | Yes | The unique numeric ID of the Legacy Marketing Campaign to retrieve the schedule for. This ID is returned when creating a campaign or can be obtained from the 'Retrieve All Campaigns' endpoint. The campaign must have already been scheduled for this endpoint to return schedule data. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | string | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |
