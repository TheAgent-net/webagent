---
url: https://docs.composio.dev/reference/sdk-reference/typescript/toolkits
title: Toolkits | Composio
description: Toolkits class  Toolkits are a collection of tools that can be used to perform various tasks. This is similar/replacement of `apps` in the Composio API.
status: 200
---

SDK Reference [TypeScript SDK](https://docs.composio.dev/reference/sdk-reference/typescript)

# Toolkits

Copy page

## [Usage](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits\#usage)

Access this class through the `composio.toolkits` property:

```
const composio = new Composio({ apiKey: 'your-api-key' });
const result = await composio.toolkits.list();
```

## [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits\#methods)

### [authorize()](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits\#authorize)

Authorizes a user to use a toolkit.
This method will create an auth config if one doesn't exist and initiate a connection request.

```
async authorize(userId: string, toolkitSlug: string, authConfigId?: string, requestOptions?: ComposioRequestOptions): Promise<ConnectionRequest>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `userId` | `string` | The user id of the user to authorize |
| `toolkitSlug` | `string` | The slug of the toolkit to authorize |
| `authConfigId?` | `string` |  |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ConnectionRequest>` — The connection request object

**Example**

```
const connectionRequest = await composio.toolkits.authorize(userId, 'github');
```

* * *

### [get()](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits\#get)

Retrieves a specific toolkit by its slug identifier.

**Overload 1**

```
async get(slug: string, requestOptions?: ComposioRequestOptions): Promise<ToolkitRetrieveResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `slug` | `string` | The unique slug identifier of the toolkit to retrieve |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ToolkitRetrieveResponse>` — The toolkit object with detailed information

**Overload 2**

```
async get(query?: ToolkitListParams, requestOptions?: ComposioRequestOptions): Promise<ToolKitListResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `query?` | `ToolkitListParams` | The query parameters to filter toolkits |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ToolKitListResponse>` — A paginated list of toolkits matching the query criteria

**Example**

```
// Get a specific toolkit
const githubToolkit = await composio.toolkits.get('github');
console.log(githubToolkit.name); // GitHub
console.log(githubToolkit.authConfigDetails); // Authentication configuration details
```

* * *

### [getAuthConfigCreationFields()](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits\#getauthconfigcreationfields)

Retrieves the fields required for creating an auth config for a toolkit.

```
async getAuthConfigCreationFields(toolkitSlug: string, authScheme: AuthSchemeType, options: { requiredOnly?: boolean }): Promise<ToolkitAuthFieldsResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `toolkitSlug` | `string` | The slug of the toolkit to retrieve the fields for |
| `authScheme` | `AuthSchemeType` | The auth scheme to retrieve the fields for |
| `options` | `\{ requiredOnly?: boolean \}` |  |

**Returns**

`Promise<ToolkitAuthFieldsResponse>` — The fields required for creating an auth config

* * *

### [getConnectedAccountInitiationFields()](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits\#getconnectedaccountinitiationfields)

Retrieves the fields required for initiating a connected account for a toolkit.

```
async getConnectedAccountInitiationFields(toolkitSlug: string, authScheme: AuthSchemeType, options: { requiredOnly?: boolean }): Promise<ToolkitAuthFieldsResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `toolkitSlug` | `string` | The slug of the toolkit to retrieve the fields for |
| `authScheme` | `AuthSchemeType` | The auth scheme to retrieve the fields for |
| `options` | `\{ requiredOnly?: boolean \}` |  |

**Returns**

`Promise<ToolkitAuthFieldsResponse>` — The fields required for initiating a connected account

* * *

### [listCategories()](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits\#listcategories)

Retrieves all toolkit categories available in the Composio SDK.

This method fetches the complete list of categories from the Composio API
and transforms the response to use camelCase property naming.

```
async listCategories(requestOptions?: ComposioRequestOptions): Promise<ToolkitRetrieveCategoriesResponse>
```

**Parameters**

| Name | Type |
| --- | --- |
| `requestOptions?` | `ComposioRequestOptions` |

**Returns**

`Promise<ToolkitRetrieveCategoriesResponse>` — The list of toolkit categories

**Example**

```
// Get all toolkit categories
const categories = await composio.toolkits.listCategories();
console.log(categories.items); // Array of category objects
```

* * *

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/sdk-reference/typescript/toolkits.mdx)

### On this page

[Usage](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits#usage) [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits#methods) [authorize()](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits#authorize) [get()](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits#get) [getAuthConfigCreationFields()](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits#getauthconfigcreationfields) [getConnectedAccountInitiationFields()](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits#getconnectedaccountinitiationfields) [listCategories()](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits#listcategories)
