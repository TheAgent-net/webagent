---
url: https://docs.composio.dev/toolkits/whatsapp
title: WhatsApp
description: 
status: 200
---

# WhatsApp

Enables interaction with customers through the WhatsApp Business API for messaging and automation. Only supports WhatsApp Business accounts, not WhatsApp Personal accounts.

- **Category:** phone & sms
- **Auth:** OAUTH2, API_KEY
- **Composio-managed OAuth available?** Yes
- **Tools:** 57
- **Triggers:** 1
- **Slug:** `WHATSAPP`
- **Version:** 20260815_00

## Frequently Asked Questions

### Why isn't my WhatsApp message being delivered?

WhatsApp has a 24-hour customer service window. Recipients only receive messages within 24 hours of their last message to you. To message outside this window, use a template message.

### Can I use a personal WhatsApp account with the WhatsApp toolkit?

No. The WhatsApp toolkit is for WhatsApp Business API flows, so the connected account needs to be backed by a WhatsApp Business Account (WABA). Personal WhatsApp accounts are not supported for these API flows.

If you need to send or receive WhatsApp messages through the toolkit, set up or connect the relevant WABA-backed business account in Meta first.

### What is a WABA ID?

The WABA ID, or WhatsApp Business Account ID, is required because the WhatsApp Business API needs it to identify the business account. Users can find it in Meta Developers under the app's WhatsApp API Setup section, or fetch it programmatically by calling `GET /me/businesses` and then `GET /{business_id}/owned_whatsapp_business_accounts` with an access token.

### WhatsApp template messages require an existing template before sending

Sending a WhatsApp template message requires a template to already exist in WhatsApp/Meta. The send-template tool sends an existing template by name/language and parameters; it does not remove the need to create and approve the template first.

### Why is my WhatsApp connection failing with "Missing required fields"?

Ensure all required fields are provided when initiating the connection. See the [WhatsApp authentication details](https://docs.composio.dev/toolkits/whatsapp#authentication-details).

## Tools

- `WHATSAPP_BLOCK_USERS`
- `WHATSAPP_CONFIGURE_CONVERSATIONAL_AUTOMATION`
- `WHATSAPP_CREATE_FLOW`
- `WHATSAPP_CREATE_MAX_PRICE_AGREEMENTS`
- `WHATSAPP_CREATE_MESSAGE_TEMPLATE`
- `WHATSAPP_CREATE_QR_CODE`
- `WHATSAPP_CREATE_UPLOAD_SESSION`
- `WHATSAPP_DELETE_MEDIA`
- `WHATSAPP_DELETE_MESSAGE_TEMPLATE`
- `WHATSAPP_DELETE_QR_CODE`
- `WHATSAPP_DEREGISTER_PHONE`
- `WHATSAPP_GET_ACTIVITIES`
- `WHATSAPP_GET_BUSINESS_ACCOUNT_DETAILS`
- `WHATSAPP_GET_BUSINESS_COMPLIANCE_INFO`
- `WHATSAPP_GET_BUSINESS_ENCRYPTION`
- `WHATSAPP_GET_BUSINESS_PROFILE`
- `WHATSAPP_GET_CLIENT_BUSINESS_ACCOUNTS`
- `WHATSAPP_GET_COMMERCE_SETTINGS`
- `WHATSAPP_GET_FLOW_ASSETS`
- `WHATSAPP_GET_JOIN_REQUESTS`
- `WHATSAPP_GET_MEDIA_INFO`
- `WHATSAPP_GET_MESSAGE_HISTORY`
- `WHATSAPP_GET_MESSAGE_TEMPLATES`
- `WHATSAPP_GET_OWNED_BUSINESS_ACCOUNTS`
- `WHATSAPP_GET_PHONE_NUMBER`
- `WHATSAPP_GET_PHONE_NUMBERS`
- `WHATSAPP_GET_SCHEDULES`
- `WHATSAPP_GET_SETTINGS`
- `WHATSAPP_GET_SUBSCRIBED_APPS`
- `WHATSAPP_GET_TEMPLATE_LIBRARY`
- `WHATSAPP_GET_TEMPLATE_STATUS`
- `WHATSAPP_LIST_FLOWS`
- `WHATSAPP_LIST_GROUPS`
- `WHATSAPP_LIST_QR_CODES`
- `WHATSAPP_LIST_SOLUTIONS`
- `WHATSAPP_PUBLISH_FLOW`
- `WHATSAPP_REGISTER_PHONE`
- `WHATSAPP_REMOVE_ASSIGNED_USER`
- `WHATSAPP_SEND_CONTACTS`
- `WHATSAPP_SEND_INTERACTIVE_BUTTONS`
- `WHATSAPP_SEND_INTERACTIVE_LIST`
- `WHATSAPP_SEND_LOCATION`
- `WHATSAPP_SEND_MEDIA`
- `WHATSAPP_SEND_MEDIA_BY_ID`
- `WHATSAPP_SEND_MESSAGE`
- `WHATSAPP_SEND_TEMPLATE_MESSAGE`
- `WHATSAPP_SET_TWO_STEP_VERIFICATION`
- `WHATSAPP_SUBSCRIBE_APP`
- `WHATSAPP_UNSUBSCRIBE_APP`
- `WHATSAPP_UPDATE_BUSINESS_ACCOUNT`
- `WHATSAPP_UPDATE_BUSINESS_PROFILE`
- `WHATSAPP_UPDATE_COMMERCE_SETTINGS`
- `WHATSAPP_UPDATE_FLOW_JSON`
- `WHATSAPP_UPDATE_SETTINGS`
- `WHATSAPP_UPLOAD_MEDIA`
- `WHATSAPP_UPSERT_MESSAGE_TEMPLATE`
- `WHATSAPP_VERIFY_CODE`
- `WHATSAPP_MESSAGE_STATUS_UPDATED_TRIGGER`
