---
url: https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts
title: ConnectedAccounts | Composio
description: ConnectedAccounts class  This class is used to manage connected accounts in the Composio SDK. Connected accounts are used to authenticate with third-party services.
status: 200
---

SDK Reference [TypeScript SDK](https://docs.composio.dev/reference/sdk-reference/typescript)

# ConnectedAccounts

Copy page

## [Usage](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#usage)

Access this class through the `composio.connectedAccounts` property:

```
const composio = new Composio({ apiKey: 'your-api-key' });
const result = await composio.connectedAccounts.list();
```

## [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#methods)

### [delete()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#delete)

Deletes a connected account.

This method permanently removes a connected account from the Composio platform.
This action cannot be undone and will revoke any access tokens associated with the account.

```
async delete(nanoid: string, requestOptions?: ComposioRequestOptions): Promise<ConnectedAccountDeleteResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nanoid` | `string` | The unique identifier of the connected account to delete |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ConnectedAccountDeleteResponse>` — The deletion response

**Example**

```
// Delete a connected account
await composio.connectedAccounts.delete('conn_abc123');
```

* * *

### [disable()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#disable)

Disable a connected account

```
async disable(nanoid: string, requestOptions?: ComposioRequestOptions): Promise<ConnectedAccountUpdateStatusResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nanoid` | `string` | Unique identifier of the connected account |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ConnectedAccountUpdateStatusResponse>` — Updated connected account details

**Example**

```
// Disable a connected account
const disabledAccount = await composio.connectedAccounts.disable('conn_abc123');
console.log(disabledAccount.isDisabled); // true

// You can also use updateStatus with a reason
// const disabledAccount = await composio.connectedAccounts.updateStatus('conn_abc123', {
//   enabled: false,
//   reason: 'No longer needed'
// });
```

* * *

### [enable()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#enable)

Enable a connected account

```
async enable(nanoid: string, requestOptions?: ComposioRequestOptions): Promise<ConnectedAccountUpdateStatusResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nanoid` | `string` | Unique identifier of the connected account |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ConnectedAccountUpdateStatusResponse>` — Updated connected account details

**Example**

```
// Enable a previously disabled connected account
const enabledAccount = await composio.connectedAccounts.enable('conn_abc123');
console.log(enabledAccount.isDisabled); // false
```

* * *

### [get()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#get)

Retrieves a specific connected account by its ID.

This method fetches detailed information about a single connected account
and transforms the response to the SDK's standardized format.

```
async get(nanoid: string, requestOptions?: ComposioRequestOptions): Promise<ConnectedAccountRetrieveResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nanoid` | `string` | The unique identifier of the connected account |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ConnectedAccountRetrieveResponse>` — The connected account details

**Example**

```
// Get a connected account by ID
const account = await composio.connectedAccounts.get('conn_abc123');
console.log(account.status); // e.g., 'ACTIVE'
console.log(account.toolkit.slug); // e.g., 'github'
```

* * *

### [initiate()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#initiate)

Compound function to create a new connected account.
This function creates a new connected account and returns a connection request.
Users can then wait for the connection to be established using the `waitForConnection` method.

**Deprecated for Composio-managed OAuth (OAuth1, OAuth2, DCR\_OAUTH).**
The legacy `POST /api/v3/connected_accounts` endpoint that this method
wraps is being retired for Composio-managed auth configs on redirectable
schemes. The cutover is **2026-05-08** for new organizations and
**2026-07-03** for all remaining organizations. After your org's cutover,
this method will throw ComposioLegacyConnectedAccountsEndpointRetiredError
for that specific combination.

Use ConnectedAccounts.link for Composio-managed OAuth — it works for
every redirectable scheme regardless of whether the auth config is
Composio-managed or custom, and the return shape is the same.

Custom auth configs (your own OAuth app) and non-OAuth schemes (API key,
bearer token, basic auth) are unaffected and continue to work on
`initiate()`. See [https://docs.composio.dev/docs/changelog/2026/04/24](https://docs.composio.dev/docs/changelog/2026/04/24)

```
async initiate(userId: string, authConfigId: string, options?: CreateConnectedAccountOptions, requestOptions?: ComposioRequestOptions): Promise<ConnectionRequest>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `userId` | `string` | User ID of the connected account |
| `authConfigId` | `string` | Auth config ID of the connected account |
| `options?` | `CreateConnectedAccountOptions` | Options for creating a new connected account |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ConnectionRequest>` — Connection request object

**Example**

```
// For OAuth2 authentication
const connectionRequest = await composio.connectedAccounts.initiate(
  'user_123',
  'auth_config_123',
  {
    callbackUrl: 'https://your-app.com/callback',
    config: AuthScheme.OAuth2({
      access_token: 'your_access_token',
      token_type: 'Bearer'
    })
  }
);

// For API Key authentication
const connectionRequest = await composio.connectedAccounts.initiate(
  'user_123',
  'auth_config_123',
  {
    config: AuthScheme.ApiKey({
      api_key: 'your_api_key'
    })
  }
);

// For Basic authentication
const connectionRequest = await composio.connectedAccounts.initiate(
  'user_123',
  'auth_config_123',
  {
    config: AuthScheme.Basic({
      username: 'your_username',
      password: 'your_password'
    })
  }
);
```

* * *

### [link()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#link)

```
async link(userId: string, authConfigId: string, options?: CreateConnectedAccountLinkOptions, requestOptions?: ComposioRequestOptions): Promise<ConnectionRequest>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `userId` | `string` | {string} - The external user ID to create the connected account for. |
| `authConfigId` | `string` | {string} - The auth config ID to create the connected account for. |
| `options?` | `CreateConnectedAccountLinkOptions` | {CreateConnectedAccountLinkOptions} - Options for creating a new connected account link. |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ConnectionRequest>` — Connection request object

**Example**

```
// create a connection request and redirect the user to the redirect url
const connectionRequest = await composio.connectedAccounts.link('user_123', 'auth_config_123');
const redirectUrl = connectionRequest.redirectUrl;
console.log(`Visit: ${redirectUrl} to authenticate your account`);

// Wait for the connection to be established
const connectedAccount = await connectionRequest.waitForConnection()
```

```
// create a connection request and redirect the user to the redirect url
const connectionRequest = await composio.connectedAccounts.link('user_123', 'auth_config_123', {
  callbackUrl: 'https://your-app.com/callback'
});
const redirectUrl = connectionRequest.redirectUrl;
console.log(`Visit: ${redirectUrl} to authenticate your account`);

// Wait for the connection to be established
const connectedAccount = await composio.connectedAccounts.waitForConnection(connectionRequest.id);
```

* * *

### [list()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#list)

Lists all connected accounts based on provided filter criteria.

This method retrieves connected accounts from the Composio API with optional filtering.

```
async list(query?: ConnectedAccountListParams, requestOptions?: ComposioRequestOptions): Promise<ConnectedAccountListResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `query?` | `ConnectedAccountListParams` | Optional query parameters for filtering connected accounts |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ConnectedAccountListResponse>` — A paginated list of connected accounts

**Example**

```
// List all connected accounts
const allAccounts = await composio.connectedAccounts.list();

// List accounts for a specific user
const userAccounts = await composio.connectedAccounts.list({
  userIds: ['user123']
});

// List accounts for a specific toolkit
const githubAccounts = await composio.connectedAccounts.list({
  toolkitSlugs: ['github']
});
```

* * *

### [refresh()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#refresh)

Refreshes a connected account's authentication credentials.

This method attempts to refresh OAuth tokens or other credentials associated with
the connected account. This is useful when a token has expired or is about to expire.

```
async refresh(nanoid: string, options?: ConnectedAccountRefreshOptions, requestOptions?: ComposioRequestOptions): Promise<ConnectedAccountRefreshResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nanoid` | `string` | The unique identifier of the connected account to refresh |
| `options?` | `ConnectedAccountRefreshOptions` |  |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ConnectedAccountRefreshResponse>` — The response containing the refreshed account details

**Example**

```
// Refresh a connected account's credentials
const refreshedAccount = await composio.connectedAccounts.refresh('conn_abc123');
```

* * *

### [update()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#update)

Enable or disable a connected account. Accepts `{ enabled: boolean }`.

Use `updateAcl()` for ACL writes on SHARED connections.

```
async update(nanoid: string, params: UpdateConnectedAccountParams, requestOptions?: ComposioRequestOptions): Promise<ConnectedAccountUpdateStatusResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nanoid` | `string` | The unique identifier of the connected account |
| `params` | `UpdateConnectedAccountParams` | The update parameters |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ConnectedAccountUpdateStatusResponse>` — The update response

**Example**

```
// Disable an account
await composio.connectedAccounts.update('ca_abc123', { enabled: false });
```

* * *

### [updateAcl()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#updateacl)

Update the per-user ACL on a SHARED connected account.
**Experimental — shape may change in future releases.**

Only meaningful for SHARED connections — calling this on a PRIVATE
connection raises `ComposioAclOnlyForSharedError` (400). ACL writes
require the connection's creator or an API key.

PATCH semantics: omit a field to leave it unchanged; pass an empty
array to clear an allow/deny list. At least one field must be
provided.

```
async updateAcl(nanoid: string, params: UpdateConnectedAccountAclParams): Promise<ConnectedAccountPatchResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nanoid` | `string` | The unique identifier of the connected account |
| `params` | `UpdateConnectedAccountAclParams` | The ACL fields to patch |

**Returns**

`Promise<ConnectedAccountPatchResponse>` — The PATCH response

**Example**

```
// Allow every userId to use this SHARED connection
await composio.connectedAccounts.updateAcl('ca_abc123', { allowAllUsers: true });

// Targeted allow list
await composio.connectedAccounts.updateAcl('ca_abc123', {
  allowedUserIds: ['user_alice', 'user_bob'],
});

// Clear the allow list (back to deny-by-default unless allowAllUsers is true)
await composio.connectedAccounts.updateAcl('ca_abc123', { allowedUserIds: [] });
```

* * *

### [updateStatus()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#updatestatus)

Update the status of a connected account

```
async updateStatus(nanoid: string, params: ConnectedAccountUpdateStatusParams, requestOptions?: ComposioRequestOptions): Promise<ConnectedAccountUpdateStatusResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nanoid` | `string` | Unique identifier of the connected account |
| `params` | `ConnectedAccountUpdateStatusParams` | Parameters for updating the status |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ConnectedAccountUpdateStatusResponse>` — Updated connected account details

**Example**

```
// Enable a connected account
const updatedAccount = await composio.connectedAccounts.updateStatus('conn_abc123', {
  enabled: true
});

// Disable a connected account with a reason
const disabledAccount = await composio.connectedAccounts.updateStatus('conn_abc123', {
  enabled: false,
  reason: 'Token expired'
});
```

* * *

### [waitForConnection()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts\#waitforconnection)

Waits for a connection request to complete and become active.

This method continuously polls the Composio API to check the status of a connection
until it either becomes active, enters a terminal error state, or times out.

```
async waitForConnection(connectedAccountId: string, timeout?: number): Promise<ConnectedAccountRetrieveResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `connectedAccountId` | `string` | The ID of the connected account to wait for |
| `timeout?` | `number` | Maximum time to wait in milliseconds (default: 60 seconds) |

**Returns**

`Promise<ConnectedAccountRetrieveResponse>` — The finalized connected account data

**Example**

```
// Wait for a connection to complete with default timeout
const connectedAccount = await composio.connectedAccounts.waitForConnection('conn_123abc');

// Wait with a custom timeout of 2 minutes
const connectedAccount = await composio.connectedAccounts.waitForConnection('conn_123abc', 120000);
```

* * *

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/sdk-reference/typescript/connected-accounts.mdx)

### On this page

[Usage](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#usage) [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#methods) [delete()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#delete) [disable()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#disable) [enable()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#enable) [get()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#get) [initiate()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#initiate) [link()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#link) [list()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#list) [refresh()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#refresh) [update()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#update) [updateAcl()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#updateacl) [updateStatus()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#updatestatus) [waitForConnection()](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts#waitforconnection)
