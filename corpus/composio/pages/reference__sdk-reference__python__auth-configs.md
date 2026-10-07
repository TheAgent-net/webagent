---
url: https://docs.composio.dev/reference/sdk-reference/python/auth-configs
title: AuthConfigs | Composio
description: Manage authentication configurations.
status: 200
---

SDK Reference [Python SDK](https://docs.composio.dev/reference/sdk-reference/python)

# AuthConfigs

Copy page

## [Methods](https://docs.composio.dev/reference/sdk-reference/python/auth-configs\#methods)

### [list()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs\#list)

Lists authentication configurations based on provided filter criteria.

```
def list(query: auth_config_list_params.AuthConfigListParams = ...) -> auth_config_list_response.AuthConfigListResponse
```

**Parameters**

| Name | Type |
| --- | --- |
| `query?` | `auth_config_list_params.AuthConfigListParams` |

**Returns**

`auth_config_list_response.AuthConfigListResponse`

* * *

### [create()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs\#create)

Create a new auth config

```
def create(toolkit: str, options: auth_config_create_params.AuthConfig) -> auth_config_create_response.AuthConfig
```

**Parameters**

| Name | Type |
| --- | --- |
| `toolkit` | `str` |
| `options` | `auth_config_create_params.AuthConfig` |

**Returns**

`auth_config_create_response.AuthConfig` — The created auth config.

* * *

### [get()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs\#get)

Retrieves a specific authentication configuration by its ID

```
def get(nanoid: str) -> auth_config_retrieve_response.AuthConfigRetrieveResponse
```

**Parameters**

| Name | Type |
| --- | --- |
| `nanoid` | `str` |

**Returns**

`auth_config_retrieve_response.AuthConfigRetrieveResponse` — The retrieved auth config.

* * *

### [update()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs\#update)

Updates an existing authentication configuration. This method allows you to modify properties of an auth config such as credentials, scopes, or tool restrictions. The update type (custom or default) determines which fields can be updated.

```
def update(nanoid: str, options: auth_config_update_params.AuthConfigUpdateParams) -> Dict
```

**Parameters**

| Name | Type |
| --- | --- |
| `nanoid` | `str` |
| `options` | `auth_config_update_params.AuthConfigUpdateParams` |

**Returns**

`Dict` — The updated auth config.

* * *

### [delete()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs\#delete)

Deletes an existing authentication configuration.

```
def delete(nanoid: str) -> Dict
```

**Parameters**

| Name | Type |
| --- | --- |
| `nanoid` | `str` |

**Returns**

`Dict` — The deleted auth config.

* * *

### [enable()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs\#enable)

Enables an existing authentication configuration.

```
def enable(nanoid: str) -> Dict
```

**Parameters**

| Name | Type |
| --- | --- |
| `nanoid` | `str` |

**Returns**

`Dict` — The enabled auth config.

* * *

### [disable()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs\#disable)

Disables an existing authentication configuration.

```
def disable(nanoid: str) -> Dict
```

**Parameters**

| Name | Type |
| --- | --- |
| `nanoid` | `str` |

**Returns**

`Dict` — The disabled auth config.

* * *

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/auth_configs.py#L18)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/sdk-reference/python/auth-configs.mdx)

### On this page

[Methods](https://docs.composio.dev/reference/sdk-reference/python/auth-configs#methods) [list()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs#list) [create()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs#create) [get()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs#get) [update()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs#update) [delete()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs#delete) [enable()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs#enable) [disable()](https://docs.composio.dev/reference/sdk-reference/python/auth-configs#disable)
