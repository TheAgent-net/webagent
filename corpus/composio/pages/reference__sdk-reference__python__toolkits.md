---
url: https://docs.composio.dev/reference/sdk-reference/python/toolkits
title: Toolkits | Composio
description: Toolkits are a collectiono of tools that can be used to perform various tasks. They're conceptualized as a set of tools. Ex: Github toolkit can per...
status: 200
---

SDK Reference [Python SDK](https://docs.composio.dev/reference/sdk-reference/python)

# Toolkits

Copy page

## [Methods](https://docs.composio.dev/reference/sdk-reference/python/toolkits\#methods)

### [list()](https://docs.composio.dev/reference/sdk-reference/python/toolkits\#list)

List all toolkits.

```
def list(category: str | None = ..., cursor: str | None = ..., limit: float | None = ..., sort_by: Literal['usage', 'alphabetically' | None] = ..., managed_by: Literal['composio', 'all', 'project' | None] = ...) -> toolkit_list_response.ToolkitListResponse
```

**Parameters**

| Name | Type |
| --- | --- |
| `category?` | `str | None` |
| `cursor?` | `str | None` |
| `limit?` | `float | None` |
| `sort_by?` | `Literal['usage', 'alphabetically' | None]` |
| `managed_by?` | `Literal['composio', 'all', 'project' | None]` |

**Returns**

`toolkit_list_response.ToolkitListResponse`

* * *

### [get()](https://docs.composio.dev/reference/sdk-reference/python/toolkits\#get)

```
def get(slug: str | None = ..., query: toolkit_list_params.ToolkitListParams | None = ...) -> Union[toolkit_retrieve_response.ToolkitRetrieveResponse, ...\
```\
\
**Parameters**\
\
| Name | Type |\
| --- | --- |\
| `slug?` | `str | None` |\
| `query?` | `toolkit_list_params.ToolkitListParams | None` |\
\
**Returns**\
\
`Union[toolkit_retrieve_response.ToolkitRetrieveResponse, ...`\
\
* * *\
\
### [list\_categories()](https://docs.composio.dev/reference/sdk-reference/python/toolkits\#list_categories)\
\
List all categories of toolkits.\
\
```\
def list_categories()\
```\
\
* * *\
\
### [authorize()](https://docs.composio.dev/reference/sdk-reference/python/toolkits\#authorize)\
\
Authorize a user to a toolkit If auth config is not found, it will be created using composio managed auth.\
\
```\
def authorize(user_id: str, toolkit: str)\
```\
\
**Parameters**\
\
| Name | Type |\
| --- | --- |\
| `user_id` | `str` |\
| `toolkit` | `str` |\
\
* * *\
\
### [get\_connected\_account\_initiation\_fields()](https://docs.composio.dev/reference/sdk-reference/python/toolkits\#get_connected_account_initiation_fields)\
\
Get the required property for a given toolkit and auth scheme.\
\
```\
def get_connected_account_initiation_fields(toolkit: str, auth_scheme: AuthSchemeL, required_only: bool = ...) -> AuthFieldsT\
```\
\
**Parameters**\
\
| Name | Type |\
| --- | --- |\
| `toolkit` | `str` |\
| `auth_scheme` | `AuthSchemeL` |\
| `required_only?` | `bool` |\
\
**Returns**\
\
`AuthFieldsT`\
\
* * *\
\
### [get\_auth\_config\_creation\_fields()](https://docs.composio.dev/reference/sdk-reference/python/toolkits\#get_auth_config_creation_fields)\
\
Get the required property for a given toolkit and auth scheme.\
\
```\
def get_auth_config_creation_fields(toolkit: str, auth_scheme: AuthSchemeL, required_only: bool = ...) -> AuthFieldsT\
```\
\
**Parameters**\
\
| Name | Type |\
| --- | --- |\
| `toolkit` | `str` |\
| `auth_scheme` | `AuthSchemeL` |\
| `required_only?` | `bool` |\
\
**Returns**\
\
`AuthFieldsT`\
\
* * *\
\
[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/toolkits.py#L26)\
\
[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/sdk-reference/python/toolkits.mdx)\
\
### On this page\
\
[Methods](https://docs.composio.dev/reference/sdk-reference/python/toolkits#methods) [list()](https://docs.composio.dev/reference/sdk-reference/python/toolkits#list) [get()](https://docs.composio.dev/reference/sdk-reference/python/toolkits#get) [list\_categories()](https://docs.composio.dev/reference/sdk-reference/python/toolkits#list_categories) [authorize()](https://docs.composio.dev/reference/sdk-reference/python/toolkits#authorize) [get\_connected\_account\_initiation\_fields()](https://docs.composio.dev/reference/sdk-reference/python/toolkits#get_connected_account_initiation_fields) [get\_auth\_config\_creation\_fields()](https://docs.composio.dev/reference/sdk-reference/python/toolkits#get_auth_config_creation_fields)
