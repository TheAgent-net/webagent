---
url: https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs
title: AuthConfigs | Composio
description: AuthConfigs class  This class is used to manage authentication configurations in the Composio SDK. Auth configs are used to configure authentication providers and settings.
status: 200
---

SDK Reference [TypeScript SDK](https://docs.composio.dev/reference/sdk-reference/typescript)

# AuthConfigs

Copy page

## [Usage](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs\#usage)

Access this class through the `composio.authConfigs` property:

```
const composio = new Composio({ apiKey: 'your-api-key' });
const result = await composio.authConfigs.list();
```

## [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs\#methods)

### [create()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs\#create)

Create a new auth config

```
async create(toolkit: string, options: CreateAuthConfigParams, requestOptions?: ComposioRequestOptions): Promise<CreateAuthConfigResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `toolkit` | `string` | Unique identifier of the toolkit |
| `options` | `CreateAuthConfigParams` | Options for creating a new auth config |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<CreateAuthConfigResponse>` — Created auth config

**Example**

```
const authConfig = await authConfigs.create('my-toolkit', {
  type: AuthConfigTypes.CUSTOM,
  name: 'My Custom Auth Config',
  authScheme: AuthSchemeTypes.API_KEY,
  credentials: {
    apiKey: '1234567890',
  },
});
```

* * *

### [delete()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs\#delete)

Deletes an authentication configuration.

This method permanently removes an auth config from the Composio platform.
This action cannot be undone and will prevent any connected accounts that use
this auth config from functioning.

```
async delete(nanoid: string, requestOptions?: ComposioRequestOptions): Promise<AuthConfigDeleteResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nanoid` | `string` | The unique identifier of the auth config to delete |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<AuthConfigDeleteResponse>` — The deletion response

**Example**

```
// Delete an auth config
await composio.authConfigs.delete('auth_abc123');
```

* * *

### [disable()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs\#disable)

Disables an authentication configuration.

This is a convenience method that calls updateStatus with 'DISABLED'.
When disabled, the auth config cannot be used to create new connected accounts
or authenticate with third-party services, but existing connections may continue to work.

```
async disable(nanoid: string, requestOptions?: ComposioRequestOptions): Promise<AuthConfigUpdateStatusResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nanoid` | `string` | The unique identifier of the auth config to disable |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<AuthConfigUpdateStatusResponse>` — The updated auth config details

**Example**

```
// Disable an auth config
await composio.authConfigs.disable('auth_abc123');
```

* * *

### [enable()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs\#enable)

Enables an authentication configuration.

This is a convenience method that calls updateStatus with 'ENABLED'.
When enabled, the auth config can be used to create new connected accounts
and authenticate with third-party services.

```
async enable(nanoid: string, requestOptions?: ComposioRequestOptions): Promise<AuthConfigUpdateStatusResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nanoid` | `string` | The unique identifier of the auth config to enable |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<AuthConfigUpdateStatusResponse>` — The updated auth config details

**Example**

```
// Enable an auth config
await composio.authConfigs.enable('auth_abc123');
```

* * *

### [get()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs\#get)

Retrieves a specific authentication configuration by its ID.

This method fetches detailed information about a single auth config
and transforms the response to the SDK's standardized format.

```
async get(nanoid: string, requestOptions?: ComposioRequestOptions): Promise<AuthConfigRetrieveResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nanoid` | `string` | The unique identifier of the auth config to retrieve |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<AuthConfigRetrieveResponse>` — The auth config details

**Example**

```
// Get an auth config by ID
const authConfig = await composio.authConfigs.get('auth_abc123');
console.log(authConfig.name); // e.g., 'GitHub Auth'
console.log(authConfig.toolkit.slug); // e.g., 'github'
```

* * *

### [list()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs\#list)

Lists authentication configurations based on provided filter criteria.

This method retrieves auth configs from the Composio API, transforms them to the SDK format,
and supports filtering by various parameters.

```
async list(query?: AuthConfigListParams, requestOptions?: ComposioRequestOptions): Promise<AuthConfigListResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `query?` | `AuthConfigListParams` | Optional query parameters for filtering auth configs |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<AuthConfigListResponse>` — A paginated list of auth configurations

**Example**

```
// List all auth configs
const allConfigs = await composio.authConfigs.list();

// List auth configs for a specific toolkit
const githubConfigs = await composio.authConfigs.list({
  toolkit: 'github'
});

// Search auth configs by name or id
const searchedConfigs = await composio.authConfigs.list({
  search: 'github',
  showDisabled: true
});

// List Composio-managed auth configs
const managedConfigs = await composio.authConfigs.list({
  isComposioManaged: true
});
```

* * *

### [update()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs\#update)

Updates an existing authentication configuration.

This method allows you to modify properties of an auth config such as credentials,
scopes, or tool restrictions. The update type (custom or default) determines which
fields can be updated.

```
async update(nanoid: string, data: AuthConfigUpdateParams, requestOptions?: ComposioRequestOptions): Promise<AuthConfigUpdateResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nanoid` | `string` | The unique identifier of the auth config to update |
| `data` | `AuthConfigUpdateParams` | The data to update, which can be either custom or default type |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<AuthConfigUpdateResponse>` — The updated auth config

**Example**

```
// Update a custom auth config with new credentials
const updatedConfig = await composio.authConfigs.update('auth_abc123', {
  type: 'custom',
  credentials: {
    apiKey: 'new-api-key-value'
  }
});

// Update a default auth config with new scopes
const updatedConfig = await composio.authConfigs.update('auth_abc123', {
  type: 'default',
  scopes: ['read:user', 'repo']
});
```

* * *

### [updateStatus()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs\#updatestatus)

Updates the status of an authentication configuration.

This method allows you to enable or disable an auth config. When disabled,
the auth config cannot be used to create new connected accounts or authenticate
with third-party services.

```
async updateStatus(status: 'ENABLED' | 'DISABLED', nanoid: string, requestOptions?: ComposioRequestOptions): Promise<AuthConfigUpdateStatusResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `status` | `'ENABLED' | 'DISABLED'` | The status to set ('ENABLED' or 'DISABLED') |
| `nanoid` | `string` | The unique identifier of the auth config |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<AuthConfigUpdateStatusResponse>` — The updated auth config details

**Example**

```
// Disable an auth config
await composio.authConfigs.updateStatus('DISABLED', 'auth_abc123');

// Enable an auth config
await composio.authConfigs.updateStatus('ENABLED', 'auth_abc123');
```

* * *

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/sdk-reference/typescript/auth-configs.mdx)

### On this page

[Usage](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs#usage) [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs#methods) [create()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs#create) [delete()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs#delete) [disable()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs#disable) [enable()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs#enable) [get()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs#get) [list()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs#list) [update()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs#update) [updateStatus()](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs#updatestatus)
