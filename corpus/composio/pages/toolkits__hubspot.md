---
url: https://docs.composio.dev/toolkits/hubspot
title: HubSpot
description: 
status: 200
---

# HubSpot

HubSpot is an inbound marketing, sales, and customer service platform integrating CRM, email automation, and analytics to facilitate lead nurturing and seamless customer experiences

- **Category:** crm
- **Auth:** OAUTH2, API_KEY
- **Composio-managed OAuth available?** Yes
- **Tools:** 245
- **Triggers:** 2
- **Slug:** `HUBSPOT`
- **Version:** 20260826_00

## Frequently Asked Questions

### Why do users see a "Connecting an unverified app" warning?

HubSpot shows this warning because the default Composio-managed HubSpot OAuth app is still awaiting HubSpot approval. The connection can still work, but HubSpot asks the user to explicitly accept the warning before continuing.

Composio is working on getting the default HubSpot OAuth app approved, but there is no concrete ETA because the final review timeline depends on HubSpot.

If this warning blocks your rollout, use your own HubSpot OAuth app credentials in a custom Composio auth config. That lets you control the app identity, review status, and consent screen shown to your users.

### Should I use Composio-managed auth or my own HubSpot OAuth app?

Use Composio-managed auth when you want the fastest setup and the default Composio HubSpot app covers the permissions you need.

With Composio-managed HubSpot auth, you can only remove optional scopes that are already available on the Composio-managed HubSpot app.

You cannot add new scopes to the managed app, and you cannot remove scopes that are non-optional for that managed auth config. If you need a different scope set, create a custom HubSpot OAuth app and configure those scopes there.

Use your own HubSpot OAuth app when you need a different scope set, your own app name and branding on the consent screen, tighter control over app review and rollout, or a production setup owned by your team. For setup steps, see [How to create OAuth credentials for HubSpot](https://composio.dev/auth/hubspot).

### How do scopes work in HubSpot?

The scope category must match between Composio and your HubSpot developer app.

- Scopes in Composio `scopes` must be configured in HubSpot as **Required** or **Conditionally required**.
- Scopes in Composio `optional_scopes` must be configured in HubSpot as **Optional**.
- Do not request a scope from Composio unless that same scope is enabled in the HubSpot developer app.

If you use the API, pass the fields in the auth config credentials:

```json
{
  "credentials": {
    "scopes": "oauth crm.objects.contacts.read",
    "optional_scopes": "crm.objects.companies.read crm.objects.deals.read"
  }
}
```

Use the [Create Auth Config API](/reference/api-reference/auth-configs/postAuthConfigs) to create the auth config, the [Get Auth Config API](/reference/api-reference/auth-configs/getAuthConfigsByNanoid) to inspect what Composio will request, and the [Update Auth Config API](/reference/api-reference/auth-configs/patchAuthConfigsByNanoid) to change the scope fields.

When reading an auth config through the API, check both `credentials.scopes` and `credentials.optional_scopes`. Together, they represent the HubSpot permissions Composio can request for that auth config.

HubSpot's docs may refer to the authorization URL parameter as `optional_scope`; in Composio, the editable auth config field is named `optional_scopes`.

### What is the recommended custom HubSpot OAuth scope setup?

For custom auth, we usually recommend keeping the required list minimal:

```text
oauth
```

Then put tool-specific HubSpot permissions in `optional_scopes`, and mark those same permissions as optional in your HubSpot developer app.

The main reason is flexibility. HubSpot requires the scopes in the OAuth URL to match how those scopes are categorized in the HubSpot developer app. If you add a new permission as required in HubSpot, every Composio auth config that uses that app must also request it through `scopes`; otherwise new installs can fail. Keeping tool-specific permissions optional makes it easier to add permissions over time without forcing every auth config to move in lockstep.

If a permission is mandatory for your product to work, keep it required. Just make sure it is required in HubSpot and sent through Composio `scopes`.

Example A: all selected permissions are required in HubSpot:

```json
{
  "credentials": {
    "scopes": "oauth crm.objects.contacts.read crm.objects.companies.read crm.objects.deals.read",
    "optional_scopes": ""
  }
}
```

Example B: only `oauth` is required in HubSpot and the selected tool permissions are optional:

```json
{
  "credentials": {
    "scopes": "oauth",
    "optional_scopes": "crm.objects.contacts.read crm.objects.contacts.write crm.objects.companies.read crm.objects.companies.write crm.objects.deals.read crm.objects.deals.write tickets timeline"
  }
}
```

Both are valid. What matters is that Composio and HubSpot agree on which scopes are required and which scopes are optional.

After changing scopes, reconnect affected HubSpot accounts. Existing connected accounts keep the scopes granted during the original authorization. Optional scopes can let a connection succeed even when a portal cannot grant every permission, but a tool can still fail later if that tool needs a permission the user did not grant.

### What are common HubSpot troubleshooting checks?

- **Scope mismatch or callback errors:** confirm every requested scope is enabled in HubSpot and is in the same category in both HubSpot and Composio.
- **Missing-scope tool errors:** add the missing scope to the auth config and HubSpot developer app, then reconnect the account.
- **Contact list/search limit errors:** `HUBSPOT_SEARCH_CONTACTS_BY_CRITERIA` and `HUBSPOT_LIST_CONTACTS_PAGE` support a maximum `limit` of 100 results per request.
- **Webhook setup errors:** HubSpot webhooks require a public app with an App ID and Developer API Key. Private or internal apps cannot receive webhooks.
- **Refresh or expiry errors:** Common causes include the user revoking the app in HubSpot, HubSpot app credentials changing, the refresh token being invalidated, or the connected account being reauthorized with a different app configuration. After rotating custom OAuth credentials or changing the HubSpot developer app, reconnect affected HubSpot accounts.

### HubSpot auth loops can be caused by HubSpot-side workspace/login state

If the HubSpot flow loops while Composio works on its side, retry while logged into the correct HubSpot workspace and confirm the OAuth app is public/configured correctly.

### HubSpot triggers require each user’s own app ID and developer API key

HubSpot webhook APIs need the specific HubSpot app that should receive webhook notifications. For user HubSpot triggers, `app_id` and developer API key are required because each user needs their own HubSpot app for webhook delivery.

## Tools

- `HUBSPOT_SEARCH_CONTACTS_BY_CRITERIA`
- `HUBSPOT_LIST_CONTACTS_PAGE`
- `HUBSPOT_ADD_ASSET_ASSOCIATION`
- `HUBSPOT_ADD_TOKEN_TO_EVENT_TEMPLATE`
- `HUBSPOT_ARCHIVE_BATCH_OF_FEEDBACK_SUBMISSIONS`
- `HUBSPOT_ARCHIVE_BATCH_OF_LINE_ITEMS`
- `HUBSPOT_ARCHIVE_BATCH_OF_OBJECTS`
- `HUBSPOT_ARCHIVE_BATCH_OF_PROPERTIES`
- `HUBSPOT_ARCHIVE_BATCH_OF_QUOTES`
- `HUBSPOT_ARCHIVE_COMPANIES`
- `HUBSPOT_ARCHIVE_COMPANY`
- `HUBSPOT_ARCHIVE_CONTACT`
- `HUBSPOT_ARCHIVE_CONTACTS`
- `HUBSPOT_ARCHIVE_CRM_OBJECT_BY_ID`
- `HUBSPOT_ARCHIVE_DEALS`
- `HUBSPOT_ARCHIVE_EMAIL`
- `HUBSPOT_ARCHIVE_EMAILS`
- `HUBSPOT_ARCHIVE_FEEDBACK_SUBMISSION`
- `HUBSPOT_ARCHIVE_LINE_ITEM`
- `HUBSPOT_ARCHIVE_PRODUCT`
- `HUBSPOT_ARCHIVE_PRODUCTS`
- `HUBSPOT_ARCHIVE_PROPERTY_BY_OBJECT_TYPE_AND_NAME`
- `HUBSPOT_ARCHIVE_PROPERTY_GROUP`
- `HUBSPOT_ARCHIVE_QUOTE`
- `HUBSPOT_ARCHIVE_TICKET`
- `HUBSPOT_ARCHIVE_TICKETS`
- `HUBSPOT_AUDIT_PIPELINE_CHANGES`
- `HUBSPOT_BATCH_READ_COMPANIES_BY_PROPERTIES`
- `HUBSPOT_BATCH_UPDATE_QUOTES`
- `HUBSPOT_CANCEL_IMPORT`
- `HUBSPOT_CLONE_MARKETING_EMAIL`
- `HUBSPOT_CONFIGURE_CALLING_EXTENSION_SETTINGS`
- `HUBSPOT_CREATE_AB_TEST_VARIATION`
- `HUBSPOT_CREATE_AND_RETURN_A_NEW_PROPERTY_GROUP`
- `HUBSPOT_CREATE_A_NEW_MARKETING_EMAIL`
- `HUBSPOT_CREATE_ASSOCIATION`
- `HUBSPOT_CREATE_BATCH_OF_FEEDBACK_SUBMISSIONS`
- `HUBSPOT_CREATE_BATCH_OF_OBJECTS`
- `HUBSPOT_CREATE_BATCH_OF_PROPERTIES`
- `HUBSPOT_CREATE_BATCH_OF_QUOTES`
- `HUBSPOT_CREATE_CAMPAIGN`
- `HUBSPOT_CREATE_CAMPAIGNS`
- `HUBSPOT_CREATE_COMPANIES`
- `HUBSPOT_CREATE_COMPANY`
- `HUBSPOT_CREATE_CONTACT`
- `HUBSPOT_CREATE_CONTACT_FROM_NL`
- `HUBSPOT_CREATE_CONTACTS`
- `HUBSPOT_CREATE_CRM_OBJECT_FROM_NL`
- `HUBSPOT_CREATE_CRM_OBJECT_WITH_PROPERTIES`
- `HUBSPOT_CREATE_DEAL`
- `HUBSPOT_CREATE_DEAL_FROM_NL`
- `HUBSPOT_CREATE_DEALS`
- `HUBSPOT_CREATE_EMAIL`
- `HUBSPOT_CREATE_EMAILS`
- `HUBSPOT_CREATE_EVENT_TEMPLATE_FOR_APP`
- `HUBSPOT_CREATE_FEEDBACK_SUBMISSION`
- `HUBSPOT_CREATE_LINE_ITEM`
- `HUBSPOT_CREATE_LINE_ITEMS`
- `HUBSPOT_CREATE_MEETING`
- `HUBSPOT_CREATE_NOTE`
- `HUBSPOT_CREATE_OBJECT_ASSOCIATION`
- `HUBSPOT_CREATE_OBJECT_SCHEMA`
- `HUBSPOT_CREATE_OR_UPDATE_DRAFT_VERSION`
- `HUBSPOT_CREATE_PIPELINE`
- `HUBSPOT_CREATE_PIPELINE_STAGE`
- `HUBSPOT_CREATE_PRODUCT`
- `HUBSPOT_CREATE_PRODUCTS`
- `HUBSPOT_CREATE_PROPERTY_FOR_SPECIFIED_OBJECT_TYPE`
- `HUBSPOT_CREATE_QUOTE_OBJECT`
- `HUBSPOT_CREATE_TASK`
- `HUBSPOT_CREATE_TICKET`
- `HUBSPOT_CREATE_TICKETS`
- `HUBSPOT_CREATE_TIMELINE_EVENT`
- `HUBSPOT_CREATE_TIMELINE_EVENTS_BATCH`
- `HUBSPOT_CREATE_WORKFLOW`
- `HUBSPOT_DELETE_CALL`
- `HUBSPOT_DELETE_CALLING_EXTENSION_SETTINGS`
- `HUBSPOT_DELETE_CAMPAIGN`
- `HUBSPOT_DELETE_CAMPAIGNS_BATCH`
- `HUBSPOT_DELETE_COMPANY_GDPR`
