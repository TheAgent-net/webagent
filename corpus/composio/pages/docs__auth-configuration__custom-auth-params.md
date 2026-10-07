---
url: https://docs.composio.dev/docs/auth-configuration/custom-auth-params
title: Custom Auth Parameters | Composio
description: Inject custom credentials in headers or parameters
status: 200
---

Direct auth

Legacy

# Custom Auth Parameters

Copy page

If you're building an agent, we recommend using [sessions](https://docs.composio.dev/docs/configuring-sessions) instead. Sessions handle authentication automatically via [in-chat authentication](https://docs.composio.dev/docs/authentication#in-chat-authentication) or [manual authentication](https://docs.composio.dev/docs/authentication/manually-authenticating).

If you already manage OAuth tokens or API keys yourself and want Composio to execute tools using your credentials, you can pass them directly at execution time — no connected account or redirect flow required.

## [Passing credentials directly](https://docs.composio.dev/docs/auth-configuration/custom-auth-params\#passing-credentials-directly)

Pass `customAuthParams` in the `tools.execute()` call to inject your own token as a header or query parameter.

PythonTypeScript

```
from composio import Composio

composio = Composio(toolkit_versions={"googlecalendar": "latest"})

result = composio.tools.execute(
    slug="GOOGLECALENDAR_LIST_EVENTS",
    user_id="user_123",
    arguments={},
    dangerously_skip_version_check=True,  # required when running "latest"
    custom_auth_params={
        "parameters": [\
            {\
                "name": "Authorization",\
                "value": "Bearer YOUR_ACCESS_TOKEN",\
                "in": "header",\
            }\
        ],
    },
)
print(result)
```

This bypasses Composio's automatic token refresh. You are responsible for refreshing expired tokens yourself.

### [Parameter options](https://docs.composio.dev/docs/auth-configuration/custom-auth-params\#parameter-options)

Each entry in the `parameters` array accepts:

| Field | Description |
| --- | --- |
| `name` | The parameter name (e.g., `Authorization`, `X-API-Key`) |
| `value` | The credential value |
| `in` | Where to inject — `"header"` or `"query"` |

You can also set `base_url` (Python) / `baseURL` (TypeScript) to override the default API base URL for the toolkit.

## [Using a beforeExecute modifier](https://docs.composio.dev/docs/auth-configuration/custom-auth-params\#using-a-beforeexecute-modifier)

For more control — such as conditionally injecting credentials based on toolkit or tool — use a `beforeExecute` modifier.

[**This is a Before Execute Modifier!** \\
\\
Before Execute Modifiers are a way to modify the parameters of a tool before it is executed. In this case, they are useful for adding custom authentication headers or parameters to a tool.](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers)

PythonTypeScript

```
from composio import Composio, before_execute
from composio.types import ToolExecuteParams

composio = Composio(toolkit_versions={"notion": "latest"})

@before_execute(toolkits=["NOTION"])
def add_custom_auth(
    tool: str,
    toolkit: str,
    params: ToolExecuteParams,
) -> ToolExecuteParams:
    if params["custom_auth_params"] is None:
        params["custom_auth_params"] = {"parameters": []}

    params["custom_auth_params"]["parameters"].append(
        {
            "name": "x-api-key",
            "value": os.getenv("NOTION_API_KEY"),
            "in": "header",
        }
    )
    return params

result = composio.tools.execute(
    slug="NOTION_GET_DATABASE_ITEMS",
    user_id="user_123",
    arguments={},
    dangerously_skip_version_check=True,  # required when running "latest"
    modifiers=[\
        add_custom_auth,\
    ],
)
print(result)
```

## [Next](https://docs.composio.dev/docs/auth-configuration/custom-auth-params\#next)

[**Before execution modifiers** \\
Modify tool arguments before execution](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/auth-configuration/custom-auth-params.mdx)

### On this page

[Passing credentials directly](https://docs.composio.dev/docs/auth-configuration/custom-auth-params#passing-credentials-directly) [Parameter options](https://docs.composio.dev/docs/auth-configuration/custom-auth-params#parameter-options) [Using a beforeExecute modifier](https://docs.composio.dev/docs/auth-configuration/custom-auth-params#using-a-beforeexecute-modifier) [Next](https://docs.composio.dev/docs/auth-configuration/custom-auth-params#next)
