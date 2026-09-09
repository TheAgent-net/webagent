---
url: https://docs.composio.dev/toolkits/googleads.md
title: https://docs.composio.dev/toolkits/googleads.md
description: 
status: 200
---

\# Google Ads

Google Ads, is an online advertising platform developed by Google, where advertisers bid to display brief advertisements, service offerings, product listings, and videos to web users.

\- \*\*Category:\*\* ads & conversion
\- \*\*Auth:\*\* OAUTH2
\- \*\*Composio-managed OAuth available?\*\* Yes
\- \*\*Tools:\*\* 22
\- \*\*Triggers:\*\* 0
\- \*\*Slug:\*\* \`GOOGLEADS\`
\- \*\*Version:\*\* 20260721\_00

\## Frequently Asked Questions

\### Google Ads developer token now belongs on the auth config, not connection initiation

Google Ads was changed so the developer token lives on the auth config itself, not on each connection initiation request. Older auth configs created before this change do not have the developer token field, and new connections through those auth configs can fail because the token is no longer accepted at the connection level. Create a new Google Ads authConfig with the developer token included, then create a fresh connection through that authConfig.

!\[Google Ads auth config form showing the developer token field under custom developer credentials.\](/images/kb/toolkits/googleads/google-ads-developer-token-auth-config.png)

\### What can cause Google Ads 429s?

A Google Ads 429 / \`RESOURCE\_EXHAUSTED\` is an upstream Google Ads API limit, not a Composio billing-plan or tool-call quota. Google Ads enforces limits on the underlying developer token, account, request pattern, service, and resource usage.

This can happen with Composio-managed credentials or with custom Google Ads credentials. Reduce request volume, add backoff, simplify expensive queries, and use an owned Google Ads OAuth app/developer token for production isolation where possible.

\### Google Ads MCC/sub-account targeting

For Google Ads manager-account (MCC) setups, \`GOOGLEADS\_LIST\_ACCESSIBLE\_CUSTOMERS\` can succeed while GAQL/reporting or campaign calls against a child account fail. Two common Google errors are:

\- 403 \`USER\_PERMISSION\_DENIED\` with guidance that, when accessing a client customer, the manager customer ID must be set in the \`login-customer-id\` header.
\- \`REQUESTED\_METRICS\_FOR\_MANAGER\` when metric fields are queried directly from the MCC manager account instead of a child/customer account.

Treat this as MCC targeting/account-context, not OAuth. Reconnecting alone does not fix it unless the user had connected the wrong account context.

Correct call shape:

\- target child/customer account ID in the request path, for example \`/customers/{child\_customer\_id}/googleAds:searchStream\`
\- manager/MCC customer ID in the \`login-customer-id\` header

\### Google Ads OAuth callback token-exchange failures usually point to bad credentials

The \`OAuth callback failed during token exchange\` error usually means the credentials used to complete the auth flow are incorrect, most often the client secret. Re-enter or update the client secret in the Google Ads auth config, make sure there are no leading/trailing spaces, and initiate a new connection.

\### What do custom Google OAuth apps need for white-label consent?

For Google toolkits, creating a new authConfig with the user's OAuth app credentials is not enough for full white-label consent. They also need to route the callback through their own domain using their own redirect URI so Google displays the configured consent screen for that OAuth app.

\## Tools

\### Add or remove to customer list

\*\*Slug:\*\* \`GOOGLEADS\_ADD\_OR\_REMOVE\_TO\_CUSTOMER\_LIST\`

Adds or removes contacts from a Google Ads customer list (UserList/audience/remarketing list), not a Google Ads customer account. Note: It takes 6 to 12 hours for changes to be reflected in the customer list. Email addresses must comply with Google Ads policies and applicable privacy/consent laws.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`emails\` \| array \| Yes \| Array of emails of contacts to add to or remove from the customer list. Emails must be valid, normalized strings (lowercase, trimmed); malformed addresses reduce match rates. \|
\| \`operation\` \| string ("create" \| "remove") \| No \| Operation to perform on the customer list (UserList/audience list). Either create or remove. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`resource\_name\` \| string \| Yes \| Resource name of the customer list (UserList/audience list), not an account. For example: customers/1234567890/userLists/1234567890. For account-owned resources, use the same customer ID as the tool call's customer\_id; in MCC workflows, this is the child/sub-account ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Callout Asset

\*\*Slug:\*\* \`GOOGLEADS\_CREATE\_CALLOUT\_ASSET\`

Create an immutable account asset containing a validated callout. Associate the returned resource using Mutate Customer Assets with field\_type CALLOUT. Cleanup removes that association; Google does not allow deleting the asset.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| Optional internal name for the immutable callout asset. \|
\| \`callout\` \| object \| Yes \| Validated callout content and optional schedule. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create customer list

\*\*Slug:\*\* \`GOOGLEADS\_CREATE\_CUSTOMER\_LIST\`

Creates a Google Ads customer list (UserList/audience/remarketing list), not a Google Ads customer account. Note: Requires an authenticated Google Ads connection with customer\_id configured. Email-based lists must comply with Google Ads policies and applicable privacy/consent laws. Membership updates can take many hours to propagate; targeting eligibility is not immediate after creation.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Name of the Google Ads customer list (UserList/audience list), not an account. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`description\` \| string \| No \| Description of the Google Ads customer list (UserList/audience list), not an account. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Campaign By Id

\*\*Slug:\*\* \`GOOGLEADS\_GET\_CAMPAIGN\_BY\_ID\`

GetCampaignById Tool returns details of a campaign in Google Ads. Requires an active Google Ads OAuth connection with the correct customer\_id configured; missing or mismatched customer\_id will cause empty results.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| id of the campaign to search on GoogleAds. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get campaign by name

\*\*Slug:\*\* \`GOOGLEADS\_GET\_CAMPAIGN\_BY\_NAME\`

Queries Google Ads via SQL to retrieve a campaign by its exact name. Requires an active Google Ads connection with valid customer\_id and appropriate OAuth scopes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Name of the campaign to search on Google Ads. Matched using exact GAQL equality. Unicode and punctuation are supported except quotes, backslashes, NUL, and line breaks, which cannot be safely embedded in the query literal. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Conversion Action Tag Snippets

\*\*Slug:\*\* \`GOOGLEADS\_GET\_CONVERSION\_ACTION\_TAG\_SNIPPETS\`

Retrieve provider-generated website or call conversion tag snippets after creating a conversion action. Markup is returned exactly as Google provides it.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`conversion\_action\_id\` \| string \| Yes \| Numeric Google Ads conversion action ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get customer lists

\*\*Slug:\*\* \`GOOGLEADS\_GET\_CUSTOMER\_LISTS\`

GetCustomerLists Tool lists all customer lists (audience/remarketing lists) in Google Ads. These are user segments for targeting, not Google Ads accounts — list IDs are distinct from account IDs. When multiple lists share similar names, review all returned results before selecting one for downstream operations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_token\` \| string \| No \| Pagination token from a previous response's next\_page\_token. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Required Google Ads Report

\*\*Slug:\*\* \`GOOGLEADS\_GET\_RMF\_REPORT\`

Run a prominent, bounded Google Ads report template for Customer, Campaign, Ad, Keyword, Search Term, Dynamic Search Ads Search Term, or Bidding Strategy. Official required columns are always selected; dates default to LAST\_30\_DAYS.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`report\` \| string ("CUSTOMER" \| "CAMPAIGN" \| "AD\_GROUP\_AD" \| "KEYWORD" \| "SEARCH\_TERM" \| "DYNAMIC\_SEARCH\_AD\_SEARCH\_TERM" \| "BIDDING\_STRATEGY") \| Yes \| Required Google Ads report template. Each template always includes its official RMF columns plus useful identity columns. \|
\| \`end\_date\` \| string \| No \| Optional inclusive report end date in YYYY-MM-DD format. \|
\| \`max\_rows\` \| integer \| No \| Maximum rows returned. The action queries one extra row and reports truncated=true instead of silently dropping results. \|
\| \`start\_date\` \| string \| No \| Optional inclusive report start date in YYYY-MM-DD format. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`optional\_metrics\` \| array \| No \| Additional v23 metrics compatible with the selected report, such as metrics.ctr. Required columns cannot be removed. Google validates resource compatibility. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Accessible Customers

\*\*Slug:\*\* \`GOOGLEADS\_LIST\_ACCESSIBLE\_CUSTOMERS\`

List Google Ads customer resource names directly accessible to the authenticated OAuth user. Google determines the complete result from the OAuth credentials and ignores customer\_id and login-customer-id; this action does not filter the response. For MCC child account names, status, and direct hierarchy, use List Sub Accounts.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`customer\_id\` \| string \| No \| Deprecated compatibility parameter. Google ignores this value and returns customer resource names directly accessible with the current OAuth credentials; it does not filter by this customer ID. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Sub Accounts

\*\*Slug:\*\* \`GOOGLEADS\_LIST\_SUB\_ACCOUNTS\`

List direct child/sub-accounts under a Google Ads manager (MCC) account. Use this before account-scoped read or mutate calls when a user needs to choose which child account to target. The returned customer\_id values can be passed to other Google Ads tools as their customer\_id.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`page\_token\` \| string \| No \| Pagination token from a previous response's next\_page\_token. \|
\| \`customer\_id\` \| string \| No \| Manager/MCC Google Ads customer ID whose direct sub-accounts should be listed; hyphens and spaces are stripped. Defaults to the connection customer\_id. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Ad Group Ads

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_AD\_GROUP\_ADS\`

Create, update, or remove ads in Google Ads ad groups, including responsive search ads. Use this after creating campaigns, budgets, ad groups, and keywords so the ad group has creative that can serve.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| AdGroupAd operations. For responsive search ads, create payloads usually include ad\_group, status, and ad.responsive\_search\_ad with headlines/descriptions, plus ad.final\_urls. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Ad Group Assets

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_AD\_GROUP\_ASSETS\`

Create, update, or remove links between assets and ad groups. Use this after creating assets to attach sitelinks, callouts, snippets, images, and other asset types at ad group level.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| AdGroupAsset operations for linking assets to ad groups. Create payloads commonly include ad\_group, asset, field\_type, and status. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Ad Group Bid Modifiers

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_AD\_GROUP\_BID\_MODIFIERS\`

Create, update, or remove ad group bid modifiers, such as device bid adjustments or hotel-specific bid modifier criteria.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| AdGroupBidModifier operations. Common create fields include ad\_group, bid\_modifier, and exactly one criterion such as device or hotel-specific bid modifier criteria. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Ad Group Criteria

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_AD\_GROUP\_CRITERIA\`

Create, update, or remove criteria attached to a Google Ads ad group in a single batch request. Supports keywords (positive and negative), audience targeting (user lists, custom audiences, combined audiences, in-market/affinity), demographics (age range, gender, parental status, income range), placements (websites, mobile apps, YouTube channels/videos), topics, webpages (for Dynamic Search Ads), and listing groups (for Shopping). Use this to programmatically manage keyword bids and match types, build audience targeting, or prune underperforming criteria. Remove operations are irreversible — deleted criteria cannot be recovered. For testing, set validate\_only=true to dry-run without committing changes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| List of ad group criterion operations to apply atomically (unless partial\_failure=true). Each operation MUST contain exactly one of: create, update, or remove. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, the request is validated but no changes are applied. Useful for dry runs. Mutually exclusive with partial\_failure (cannot both be true). \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when others in the batch fail. Errors are returned in partial\_failure\_error. If false, the entire batch is atomic — any failure rolls back all changes. \|
\| \`response\_content\_type\` \| string ("UNSPECIFIED" \| "RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of the mutated resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Ad Groups

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_AD\_GROUPS\`

Create, update, or remove ad groups within Google Ads campaigns. Supports batch operations with multiple ad group changes in a single request. Use when you need to manage ad groups programmatically, such as creating new ad groups for campaigns, updating ad group settings or status, or removing ad groups that are no longer needed. This action is irreversible for remove operations — deleted ad groups cannot be recovered once removed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| List of ad group operations (create, update, or remove). At least one operation is required. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without executing. Useful for testing before making actual changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even if other operations fail. Defaults to false. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Assets

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_ASSETS\`

Create or update supported Google Ads assets such as sitelinks, structured snippets, text assets, lead forms, promotions, calls, price assets, and media assets. Use Create Callout Asset for validated immutable callouts. Google Ads does not allow removing assets; cleanup removes their resource associations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| Asset operations. Supported asset payloads include text\_asset, callout\_asset, structured\_snippet\_asset, sitelink\_asset, lead\_form\_asset, promotion\_asset, call\_asset, price\_asset, youtube\_video\_asset, media\_bundle\_asset, and other Google Ads Asset fields. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Bidding Strategies

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_BIDDING\_STRATEGIES\`

Create, update, or remove portfolio bidding strategies such as Target CPA, Target ROAS, Target Spend, Maximize Conversions, Maximize Conversion Value, and Target Impression Share.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| BiddingStrategy operations. Create payloads include name and one bidding scheme such as target\_cpa, target\_roas, target\_spend, maximize\_conversions, maximize\_conversion\_value, or target\_impression\_share. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Campaign Assets

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_CAMPAIGN\_ASSETS\`

Create, update, or remove links between assets and campaigns. Use this after creating assets to attach sitelinks, callouts, snippets, and other asset types at campaign level.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| CampaignAsset operations for linking assets to campaigns. Create payloads commonly include campaign, asset, field\_type, and status. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Campaign Budgets

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_CAMPAIGN\_BUDGETS\`

Create, update, or remove Google Ads campaign budgets. Use this before creating campaigns because campaign creation requires an existing campaign\_budget resource name.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| CampaignBudget operations. Common create/update fields include name, amount\_micros, total\_amount\_micros, delivery\_method, explicitly\_shared, period, type, and resource\_name for updates. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Campaign Criteria

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_CAMPAIGN\_CRITERIA\`

Create, update, or remove campaign-level targeting criteria such as locations, languages, campaign-level negative keywords, devices, schedules, audiences, and IP exclusions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| CampaignCriterion operations for campaign-level targeting or exclusions. Common create fields include campaign, negative, status, bid\_modifier, and exactly one criterion field such as location, language, keyword, device, ad\_schedule, or ip\_block. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Campaign Labels

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_CAMPAIGN\_LABELS\`

Create or remove relationships between campaigns and labels. Use this after creating labels to organize campaigns for filtering and reporting.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| CampaignLabel operations. Create payloads include campaign and label resource names. Remove uses customers/{customer\_id}/campaignLabels/{campaign\_id}~{label\_id}. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Campaigns

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_CAMPAIGNS\`

Create, update, or remove Google Ads campaigns in batch. Supports multiple operations (create, update, remove) in a single request. Use when managing campaign lifecycle, applying bulk changes, or automating campaign management workflows. This action is irreversible for remove operations — deleted campaigns cannot be recovered. Plan accordingly and consider using validate\_only=true to test changes before applying them.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| List of campaign operations to perform. Each operation can be create, update, or remove. At least one operation is required. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without executing. Useful for testing before making actual changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even if others fail. Partial failures will be reported in the response. \|
\| \`response\_content\_type\` \| string \| No \| Whether to return full resource or just resource name. Options: 'RESOURCE\_NAME\_ONLY' or 'MUTABLE\_RESOURCE'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Campaigns V2

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_CAMPAIGNS\_V2\`

Create, update, or remove Google Ads campaigns in batch. Supports multiple operations (create, update, remove) in a single request. Use when managing campaign lifecycle, applying bulk changes, or automating campaign management workflows. This action is irreversible for remove operations — deleted campaigns cannot be recovered. Plan accordingly and consider using validate\_only=true to test changes before applying them.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| List of campaign operations to perform. Each operation can be create, update, or remove. At least one operation is required. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without executing. Useful for testing before making actual changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even if others fail. Partial failures will be reported in the response. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Conversion Actions

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_CONVERSION\_ACTIONS\`

Create, update, or remove Google Ads conversion actions for conversion tracking configuration. This manages Google Ads conversion action resources; installing website/app tags remains outside this action.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| ConversionAction operations. Common fields include name, status, type, category, primary\_for\_goal, lookback windows, value\_settings, counting\_type, and attribution\_model\_settings. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Customer Assets

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_CUSTOMER\_ASSETS\`

Create or remove customer-level asset associations. Removal irreversibly removes the current association; recreate it to restore the link. Use this after creating assets to attach callouts, sitelinks, snippets, and other asset types across a Google Ads customer account.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| CustomerAsset operations for associating assets with a customer or removing existing customer-level associations. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Labels

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_LABELS\`

Create, update, or remove Google Ads labels. Pair this with campaign label mutations to organize campaigns and support filtering.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| Label operations. Common fields include name and text\_label with background\_color and description. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mutate Portfolio Bidding Strategies

\*\*Slug:\*\* \`GOOGLEADS\_MUTATE\_PORTFOLIO\_BIDDING\_STRATEGIES\`

Create, edit, or remove typed Target CPA and Target ROAS portfolio strategies. Attach with Mutate Campaigns, read with Get Required Google Ads Report, and transition all campaigns before removal. Budget alignment is not exposed because Google requires the bidding strategy and campaign budget to be changed atomically with GoogleAdsService.Mutate, while this action uses the resource-specific mutate endpoint. currency\_code can be set on create only for manager-account strategies.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`operations\` \| array \| Yes \| Typed Target CPA or Target ROAS portfolio strategy operations. \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`validate\_only\` \| boolean \| No \| If true, validates the request without applying changes. \|
\| \`partial\_failure\` \| boolean \| No \| If true, valid operations succeed even when other operations fail. Invalid operations are returned in partial\_failure\_error. \|
\| \`response\_content\_type\` \| string ("RESOURCE\_NAME\_ONLY" \| "MUTABLE\_RESOURCE") \| No \| Controls how much of each mutated Google Ads resource is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search Stream GAQL

\*\*Slug:\*\* \`GOOGLEADS\_SEARCH\_STREAM\_GAQL\`

Execute a Google Ads Query Language (GAQL) query and aggregate every streamed response batch in order. For very large reports, select only needed fields and use WHERE and LIMIT because action responses are returned inline and are not automatically offloaded.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| Yes \| The Google Ads Query Language (GAQL) query string. Must follow SELECT ... FROM ... WHERE ... format. Example: SELECT campaign.name, campaign.id, metrics.impressions FROM campaign WHERE campaign.status = 'ENABLED' \|
\| \`customer\_id\` \| string \| No \| Target Google Ads customer ID for this tool call; hyphens and spaces are stripped. For MCC workflows, pass the child/sub-account ID. Defaults to the connection customer\_id. \|
\| \`summary\_row\_setting\` \| string ("UNSPECIFIED" \| "NO\_SUMMARY\_ROW" \| "SUMMARY\_ROW\_ONLY" \| "SUMMARY\_ROW\_WITH\_RESULTS") \| No \| Whether to include a summary row with aggregated metrics. Valid values are 'UNSPECIFIED', 'NO\_SUMMARY\_ROW', 'SUMMARY\_ROW\_ONLY', and 'SUMMARY\_ROW\_WITH\_RESULTS'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|
