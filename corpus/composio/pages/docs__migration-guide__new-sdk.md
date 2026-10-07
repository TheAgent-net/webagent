---
url: https://docs.composio.dev/docs/migration-guide/new-sdk
title: Our next generation SDKs | Composio
description: Learn more about Composio's next generation SDKs and how to migrate
status: 200
---

[Migration guides](https://docs.composio.dev/docs/migration-guide)

LegacyWritten December 2025

# Our next generation SDKs

Copy page

This guide covers migrating from the legacy SDK (v1) — `composio-core` on PyPI and npm — to the current SDK (v3): `composio` on PyPI, `@composio/core` on npm. Provider packages such as `composio-openai` kept their names across the rewrite: current releases work with v3, v1-era releases don't. The recommended way to use Composio is now through **sessions** — see [Migrating from Direct Tools to Sessions](https://docs.composio.dev/docs/migration-guide/direct-to-sessions) or [Configuring Sessions](https://docs.composio.dev/docs/configuring-sessions) if you're starting fresh.

In the last few months, we have experienced very rapid growth in usage of our platform. As such, our team has been working hard to radically improve the performance and developer experience of our platform.

A lot of these changes have happened in the background, but we are excited to finally share our new SDKs with you that complement our new infra.

The new API features improved usability, enhanced stability, and better scalability. The SDKs built on top of it simplify the developer experience, making it easier than ever to build useful agents.

## [What's new?](https://docs.composio.dev/docs/migration-guide/new-sdk\#whats-new)

A lot of the changes are on the infra side, but from the SDK point of view, here is what you can expect:

- Faster and more reliable tool execution
- A simpler but more opinionated SDK
- Much more intuitive and consistent naming conventions
- A vastly improved TypeScript SDK that is meaningfully more type-safe and has full feature parity with the Python SDK

There aren't too many new flashy features here (yet) mainly because we wanted to get the bones right — but we feel we have a solid foundation to ship incredible new experiences on top very quickly.

## [State of the new SDK and what is happening with the old SDKs?](https://docs.composio.dev/docs/migration-guide/new-sdk\#state-of-the-new-sdk-and-what-is-happening-with-the-old-sdks)

Currently, the new SDKs are in a preview release. These new SDKs come almost fully formed, we do not expect many breaking changes to them but are releasing them in a preview state to get feedback and make necessary changes before locking them in.

As we lock the new SDKs in place, we will deprecate support for the old SDKs. They will continue to work for the foreseeable future but are no longer actively maintained. We will continue to push security updates and fix any critical bugs but will not support any new functionality in them.

We urge you to upgrade to the new SDKs as soon as possible.

## [Nomenclature](https://docs.composio.dev/docs/migration-guide/new-sdk\#nomenclature)

We have updated several key terms in the SDK and API to improve clarity and consistency. The following table summarizes these changes:

| Previous Term | Current Term | Definition |
| --- | --- | --- |
| Actions | Tools | Individual operations or capabilities that can be performed by an LLM agent |
| Apps | Toolkits | A collection of tools grouped under a single application |
| Integration | Auth Config | Configuration containing developer credentials and application-level settings such as scopes and API endpoints. Scoped to a toolkit. |
| Connection | Connected accounts | User-linked accounts associated with a toolkit |
| Entity ID | userID | The identifier of the user performing the action (UUID or email) |
| Trigger | Trigger | An event that can be subscribed to |
| Toolsets | Providers | LLM or agent framework that can be used with Composio to create agents |

## [Switch to nano IDs from UUIDs](https://docs.composio.dev/docs/migration-guide/new-sdk\#switch-to-nano-ids-from-uuids)

We have transitioned from UUIDs to nano IDs throughout the platform for the following reasons:

- **Improved readability**: UUIDs are lengthy and difficult to read
- **Better usability**: Easier to copy with a single double-click
- **Better organization**: Nano IDs allow us to distinguish between different resource types through prefixes

| Feature | Nano ID Prefix | Example |
| --- | --- | --- |
| Connected Account | `ca_` | `ca_8x9w2l3k5m` |
| Auth Config | `ac_` | `ac_1234567890` |
| Trigger | `ti_` | `ti_So9EQf8XnAcy` |

Nano IDs are short, unique, and prefixed to indicate the resource type.

## [SDK Changes](https://docs.composio.dev/docs/migration-guide/new-sdk\#sdk-changes)

Upgrade to the latest SDK version using the appropriate package manager:

PythonTypeScript

```
pip install -U composio
```

Both SDKs now implement proper namespacing for each concept.

### [UserID scoping](https://docs.composio.dev/docs/migration-guide/new-sdk\#userid-scoping)

The concept of `entity_id` has been expanded and renamed to `user_id`.

All operations are now scoped to a userID, including:

- Fetching tools
- Initiating connections
- Executing tools
- Managing triggers

This change provides explicit specification of the user for whom the action is being performed. When a user may have multiple accounts (such as work and personal Gmail connections), you can use the more specific connected account ID.

### [Replacing ToolSets with Providers](https://docs.composio.dev/docs/migration-guide/new-sdk\#replacing-toolsets-with-providers)

We have deprecated "toolsets" in favor of "providers". This change allows Composio to provide deeper standardization for tool implementation across different frameworks.

Previously, you needed to import and use a framework-specific `ComposioToolSet` class:

Python (previous)TypeScript (previous)

```
from composio_openai import ComposioToolSet, Action, App
from openai import OpenAI

toolset = ComposioToolSet()
```

The SDK structure is now framework-agnostic and includes the OpenAI provider out of the box:

Python (current)TypeScript (current)

```
from composio import Composio
# from composio_langchain import LangchainProvider

composio = Composio()
# composio = Composio(provider=LangchainProvider())

tools = composio.tools.get(
    user_id="0001",
    tools=["LINEAR_CREATE_LINEAR_ISSUE", "GITHUB_CREATE_COMMIT"]
)
# tools returned is formatted for the provider. by default, OpenAI.
```

You can now use the same tools across any framework with our unified interface, or create custom toolsets for frameworks we don't yet support.

Read more about [providers in our documentation](https://docs.composio.dev/docs/providers/openai) and explore the [complete list of available providers](https://docs.composio.dev/docs/providers/openai).

### [Fetching and filtering tools](https://docs.composio.dev/docs/migration-guide/new-sdk\#fetching-and-filtering-tools)

Previously, you could filter tools by:

- Apps
- Action names (tool names)
- Tags

You could also specify an `important` flag to retrieve the most important tools:

Python (previous)TypeScript (previous)

```
from composio_openai import ComposioToolSet, Action, App
from openai import OpenAI

toolset = ComposioToolSet()
client = OpenAI()

tools = toolset.get_tools(
    actions=[Action.GITHUB_GET_THE_AUTHENTICATED_USER], check_connected_accounts=True
)

tools = toolset.get_tools(apps=[App.GITHUB, App.LINEAR, App.SLACK], check_connected_accounts=True)
```

You can now filter tools by:

- Toolkits
- Tool slugs
- Limit parameter
- Search query

The `important` flag has been removed. Instead, tools are returned in order of importance by default:

Since `user_id` is now explicitly required, the `check_connected_accounts` flag is no longer necessary.

Python (current)TypeScript (current)

```
from composio import Composio

composio = Composio()

user_id = "user@acme.org"

tools_1 = composio.tools.get(user_id=user_id, toolkits=["GITHUB", "LINEAR"])

tools_2 = composio.tools.get(user_id=user_id, toolkits=["SLACK"], limit=5)  # Default limit=20

tools_3 = composio.tools.get(
    user_id=user_id,
    tools=["GITHUB_CREATE_AN_ISSUE", "GITHUB_CREATE_AN_ISSUE_COMMENT", "GITHUB_CREATE_A_COMMIT"],
)

tools_4 = composio.tools.get(user_id="john", search="hackernews posts")
```

### [Fetching raw tool data](https://docs.composio.dev/docs/migration-guide/new-sdk\#fetching-raw-tool-data)

To examine the raw schema definition of a tool for understanding input/output parameters or building custom logic around tool definitions, use the following methods:

Python (current)TypeScript (current)

```
from composio import Composio

composio = Composio()

tool = composio.tools.get_raw_composio_tool_by_slug("HACKERNEWS_GET_LATEST_POSTS")

print(tool.model_dump_json())
```

### [Executing tools](https://docs.composio.dev/docs/migration-guide/new-sdk\#executing-tools)

Tool execution remains largely unchanged, with `user_id` now explicitly required.

For agentic frameworks, the tool object returned from `tools.get` is now the respective framework's native tool object. Tool call execution is handled by the agentic framework itself.

For non-agentic frameworks, Composio provides a helper function to execute tool calls.

Python v3TypeScript v3

```
from composio import Composio
from openai import OpenAI

openai_client = OpenAI()
composio = Composio()

tools = composio.tools.get(user_id="user@acme.com", tools=["GITHUB_GET_THE_ZEN_OF_GITHUB"])
response = openai_client.chat.completions.create(
    model="gpt-4.1",
    messages=[{"role": "user", "content": "gimme some zen."}],
    tools=tools,
)

result = composio.provider.handle_tool_calls(user_id="user@acme.com", response=response)
print(result)
```

For more information on executing tools for different frameworks, see [Replacing ToolSets with Providers](https://docs.composio.dev/docs/migration-guide/new-sdk#replacing-toolsets-with-providers).

### [Tool Modifiers (formerly Tool Processors)](https://docs.composio.dev/docs/migration-guide/new-sdk\#tool-modifiers-formerly-tool-processors)

Tool processors have been renamed to _tool modifiers_ and now provide an improved developer experience. The implementation is now available in TypeScript too! (previously Python-only).

Python (previous)

```
from composio_openai import ComposioToolSet, Action

toolset = ComposioToolSet()

def my_schema_processor(schema: dict) -> dict: ...
def my_preprocessor(inputs: dict) -> dict: ...
def my_postprocessor(result: dict) -> dict: ...

# Get tools with the modified schema
processed_tools = toolset.get_tools(
    actions=[Action.GMAIL_SEND_EMAIL],
    processors={
        # Applied BEFORE the LLM sees the schema
        "schema": {Action.SOME_ACTION: my_schema_processor},
        # Applied BEFORE the tool executes
        "pre": {Action.SOME_ACTION: my_preprocessor},
        # Applied AFTER the tool executes, BEFORE the result is returned
        "post": {Action.SOME_ACTION: my_postprocessor},
    },
)
```

| Previous | Current |
| --- | --- |
| `pre` processor | `beforeExecute` modifier |
| `post` processor | `afterExecute` modifier |
| `schema` processor | `schema` modifier |

The modifiers now leverage language-specific features to provide a more natural developer experience.

While tool processors could previously be applied during SDK initialization, tool fetching, and tool execution, we have restructured them as follows:

- **Chat Completion providers**: Modifiers are specified and applied during tool execution
- **Agentic frameworks**: Modifiers are specified and applied during tool fetching

#### [Schema Modifiers](https://docs.composio.dev/docs/migration-guide/new-sdk\#schema-modifiers)

The following example demonstrates schema modifier usage, applicable across all providers:

Python (current)TypeScript (current)

```
from composio import Composio, schema_modifier
from composio.types import Tool

user_id = "your@email.com"

@schema_modifier(tools=["HACKERNEWS_GET_LATEST_POSTS"])
def modify_schema(
    tool: str,
    toolkit: str,
    schema: Tool,
) -> Tool:
    _ = schema.input_parameters["properties"].pop("page", None)
    schema.input_parameters["required"] = ["size"]
    return schema

tools = composio.tools.get(
    user_id=user_id,
    tools=["HACKERNEWS_GET_LATEST_POSTS", "HACKERNEWS_GET_USER"],
    modifiers=[\
        modify_schema,\
    ]
)
```

#### [Before Modifiers](https://docs.composio.dev/docs/migration-guide/new-sdk\#before-modifiers)

The following example shows creating and using a before modifier for a Chat Completion provider. For agentic frameworks, view the [complete before modifier documentation](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers):

Python (current)TypeScript (current)

```
@before_execute(tools=["HACKERNEWS_GET_LATEST_POSTS"])
def before_execute_modifier(
    tool: str,
    toolkit: str,
    params: ToolExecuteParams,
) -> ToolExecuteParams:
    params["arguments"]["size"] = 1
    return params

# Get tools
tools = composio.tools.get(user_id=user_id, slug="HACKERNEWS_GET_LATEST_POSTS")
```

#### [After Modifiers](https://docs.composio.dev/docs/migration-guide/new-sdk\#after-modifiers)

The following example shows creating and using an after modifier for a Chat Completion provider. For agentic frameworks, view the [complete after modifier documentation](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/after-execution-modifiers):

Python (current)TypeScript (current)

```
@after_execute(tools=["HACKERNEWS_GET_USER"])
def after_execute_modifier(
    tool: str,
    toolkit: str,
    response: ToolExecutionResponse,
) -> ToolExecutionResponse:
    return {
        **response,
        "data": {
            "karma": response["data"]["karma"],
        },
    }

tools = composio.tools.get(user_id=user_id, slug="HACKERNEWS_GET_USER")
```

### [Custom Tools](https://docs.composio.dev/docs/migration-guide/new-sdk\#custom-tools)

Custom tools are now session-scoped. Define local tools with the experimental custom-tools API and attach them when creating or reusing a session.

PythonTypeScript

```
from composio import Composio
from pydantic import BaseModel, Field

composio = Composio()

class GetIssueInfoInput(BaseModel):
    issue_number: int = Field(..., description="The issue number")

@composio.experimental.tool(extends_toolkit="github")
def get_issue_info(input: GetIssueInfoInput, ctx) -> dict:
    """Get information about a GitHub issue."""
    result = ctx.proxy_execute(
        toolkit="github",
        endpoint=f"/repos/composiohq/composio/issues/{input.issue_number}",
        method="GET",
    )
    return {"data": result["data"]}

session = composio.create(
    user_id="default",
    experimental={"custom_tools": [get_issue_info]},
)
```

For more information, see [Custom Tools and Toolkits](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits).

### [Auth configs (formerly integrations)](https://docs.composio.dev/docs/migration-guide/new-sdk\#auth-configs-formerly-integrations)

Integrations are now called _auth configs_. While the terminology has changed, the underlying concept remains the same.

Auth configs store the configuration required for authentication with a given toolkit, including OAuth developer credentials, configurable base URLs, and scopes.

Auth configs now use nano IDs instead of UUIDs:

| Previous (UUID) Example | Current (Nano ID) Example |
| --- | --- |
| `b7a9c1e2-3f4d-4a6b-8c2e-1d2f3a4b5c6d` | `ac_8x9w2l3k5m` |

We recommend storing auth config nano IDs in your database for connecting users to the appropriate auth configuration.

For most use cases, you will create auth configs through the dashboard, and this process remains unchanged. Read more about [creating auth configs](https://docs.composio.dev/docs/tools-direct/authenticating-tools#creating-an-auth-config) and [customizing auth configs](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs).

Creating auth configs programmatically in the previous SDK:

Python (previous)TypeScript (previous)

```
from composio_openai import App, ComposioToolSet

toolset = ComposioToolSet()

integration = toolset.create_integration(
    app=App.GITHUB,
    auth_mode="OAUTH2",
    use_composio_oauth_app=True,
    # For use_composio_oauth_app=False, you can provide your own OAuth app credentials here
    # auth_config={
    #     "client_id": "123456",
    #     "client_secret": "123456"
    # }

)
print(integration.id)
```

Creating auth configs programmatically in the current SDK:

Python (current)TypeScript (current)

```
from composio import Composio

composio = Composio()

# Use composio managed auth
auth_config = composio.auth_configs.create(
    toolkit="notion",
    options={
        "type": "use_composio_managed_auth",
        # "type": "use_custom_auth",
        # "auth_scheme": "OAUTH2",
        # "credentials": {
        #     "client_id": "1234567890",
        #     "client_secret": "1234567890",
        #     "oauth_redirect_uri": "https://backend.composio.dev/api/v3/toolkits/auth/callback",
        # },
    },
)
print(auth_config)
```

For using custom authentication credentials, refer to the [Programmatic Auth Configs](https://docs.composio.dev/docs/authentication/programmatic-auth-configs) documentation.

The callback URL for creating custom OAuth configs is now `https://backend.composio.dev/api/v3/toolkits/auth/callback`. The previous URL was `https://backend.composio.dev/api/v1/auth-apps/add`.

### [Connected accounts / User IDs](https://docs.composio.dev/docs/migration-guide/new-sdk\#connected-accounts--user-ids)

The primary change in connected accounts and user IDs is that user IDs are now a more prominent concept compared to entities in previous versions.

We have simplified the process of connecting a user to a toolkit. Instead of multiple methods and parameters for initiating a connection, both the SDK and API now require only a `user_id` and `auth_config_id` to initiate a connection.

This approach is more explicit and works well with the ability for developers to have multiple auth configs for a given toolkit.

Connected accounts now use nano IDs instead of UUIDs:

| Previous (UUID) Example | Current (Nano ID) Example |
| --- | --- |
| `b7a9c1e2-3f4d-4a6b-8c2e-1d2f3a4b5c6d` | `ca_8x9w2l3k5m` |

Previously, you might have initiated a connection like this:

Python (previous)TypeScript (previous)

```
from composio_openai import ComposioToolSet

toolset = ComposioToolSet()
user_id = "your_user_unique_id"
google_integration_id = "0000-0000"

entity = toolset.get_entity(id=user_id)

try:
    print(f"Initiating OAuth connection for entity {entity.id}...")
    connection_request = toolset.initiate_connection(
        integration_id=google_integration_id,
        entity_id=user_id,
        # Optionally add: redirect_url="https://yourapp.com/final-destination"
        # if you want user sent somewhere specific *after* Composio finishes.
    )

    # Check if a redirect URL was provided (expected for OAuth)
    if connection_request.redirectUrl:
        print(f"Received redirect URL: {connection_request.redirectUrl}")
    else:
        print("Error: Expected a redirectUrl for OAuth flow but didn't receive one.")

except Exception as e:
    print(f"Error initiating connection: {e}")
```

The current process for initiating a connection is as follows:

Python (current)TypeScript (current)

```
from composio import Composio

linear_auth_config_id = "ac_1234"
user_id = "user@email.com"
composio = Composio()

# Create a new connected account
connection_request = composio.connected_accounts.initiate(
    user_id=user_id,
    auth_config_id=linear_auth_config_id,
)
print(connection_request.redirect_url)

# Wait for the connection to be established
connected_account = connection_request.wait_for_connection()
print(connected_account)
```

### [Triggers](https://docs.composio.dev/docs/migration-guide/new-sdk\#triggers)

Composio continues to support listening to application events using triggers through WebSockets and webhooks.

#### [Creating triggers](https://docs.composio.dev/docs/migration-guide/new-sdk\#creating-triggers)

The process for creating triggers and specifying their configuration has been redesigned for improved clarity and intuitiveness.

Some triggers require configuration, such as repository names for GitHub triggers or channel names for Slack triggers. The process usually follows the pattern of fetching the trigger type and then creating the trigger with the appropriate configuration.

Python (current)TypeScript (current)

```
from composio import Composio

composio = Composio()

user_id = "user@example.com"
trigger_config = composio.triggers.get_type("GITHUB_COMMIT_EVENT")
print(trigger_config.config)
### Trigger Config
# {
#     "properties": {
#         "owner": {
#             "description": "Owner of the repository",
#             "title": "Owner",
#             "type": "string"
#         },
#         "repo": {
#             "description": "Repository name",
#             "title": "Repo",
#             "type": "string"
#         }
#     },
#     "required": ["owner", "repo"],
#     "title": "WebhookConfigSchema",
#     "type": "object"

trigger = composio.triggers.create(
    slug="GITHUB_COMMIT_EVENT",
    user_id=user_id,
    trigger_config={"repo": "composiohq", "owner": "composio"},
)
print(trigger)

# Managing triggers

composio.triggers.enable(id="ti_abcd123")
```

#### [Enabling/Disabling triggers](https://docs.composio.dev/docs/migration-guide/new-sdk\#enablingdisabling-triggers)

You can enable or disable triggers through either the SDK or the dashboard. The dashboard process remains unchanged.

Managing triggers with the SDK:

PythonTypeScript

```
# Disable a trigger instance
disabled_instance = composio.triggers.disable(trigger_id="ti_abcd123")
print(disabled_instance)
```

If needed, the trigger can be enabled again.

PythonTypeScript

```
# Enable a trigger instance
enabled_instance = composio.triggers.enable(trigger_id="ti_abcd123")
print(enabled_instance)
```

#### [Listening to triggers](https://docs.composio.dev/docs/migration-guide/new-sdk\#listening-to-triggers)

We recommend listening to triggers through webhooks. The following are example routes for Next.js and FastAPI.

For development, you can also [listen to triggers through the SDK](https://docs.composio.dev/docs/setting-up-triggers/subscribing-to-events#receive-events-locally).

FastAPINext.js

app/route.py

```
from fastapi import FastAPI, Request, HTTPException
from typing import Dict, Any
import uvicorn
import json
import hmac
import hashlib
import base64
import os

def verify_webhook_signature(request: Request, body: bytes) -> bool:
    """Verify Composio webhook signature"""
    webhook_signature = request.headers.get("webhook-signature")
    webhook_id = request.headers.get("webhook-id")
    webhook_timestamp = request.headers.get("webhook-timestamp")
    webhook_secret = os.getenv("COMPOSIO_WEBHOOK_SECRET")

    if not all([webhook_signature, webhook_id, webhook_timestamp, webhook_secret]):
        raise HTTPException(status_code=400, detail="Missing required webhook headers or secret")

    if not webhook_signature.startswith("v1,"):
        raise HTTPException(status_code=401, detail="Invalid signature format")

    received = webhook_signature[3:]
    signing_string = f"{webhook_id}.{webhook_timestamp}.{body.decode()}"
    expected = base64.b64encode(
        hmac.new(webhook_secret.encode(), signing_string.encode(), hashlib.sha256).digest()
    ).decode()

    if not hmac.compare_digest(received, expected):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    return True

@app.post("/webhook")
async def webhook_handler(request: Request):
    payload = await request.json()

    trigger_type = payload.get("type")
    event_data = payload.get("data", {})

    if trigger_type == "github_star_added_event":
        repo_name = event_data.get("repository_name")
        starred_by = event_data.get("starred_by")
        print(f"Repository {repo_name} starred by {starred_by}")
        # Add your business logic here

    return {"status": "success", "message": "Webhook processed"}
```

## [Coming Soon](https://docs.composio.dev/docs/migration-guide/new-sdk\#coming-soon)

### [Local tools](https://docs.composio.dev/docs/migration-guide/new-sdk\#local-tools)

Previously, the Python SDK included _[local tools](https://github.com/ComposioHQ/composio/tree/0.5.0%2Bpost.1/python/composio/tools/local)_. These were tools defined within the SDK and consisted of local shell and code-related tools such as "clipboard", "sqltool", and "shelltool".

This feature is currently in development for both Python and TypeScript SDKs, with newly created tools built for improved agent accuracy.

This feature is currently in development for both Python and TypeScript SDKs.

## [API Endpoints](https://docs.composio.dev/docs/migration-guide/new-sdk\#api-endpoints)

The following table lists important API endpoints that have changed. You can use this reference to quickly find the new v3 API endpoint for migration:

This list is not exhaustive. Please refer to the [API Reference](https://docs.composio.dev/reference) for the complete list of endpoints.

### [Toolkits (formerly Apps)](https://docs.composio.dev/docs/migration-guide/new-sdk\#toolkits-formerly-apps)

| Previous Endpoint | Current Endpoint |
| --- | --- |
| `GET /api/v1/apps` | `GET /api/v3/toolkits` |
| `GET /api/v1/apps/list/categories` | `GET /api/v3/toolkits/categories` |
| `GET /api/v1/apps/{appName}` | `GET /api/v3/toolkits/{slug}` |

### [Tools (formerly Actions)](https://docs.composio.dev/docs/migration-guide/new-sdk\#tools-formerly-actions)

| Previous Endpoint | Current Endpoint |
| --- | --- |
| `GET /api/v2/actions` | `GET /api/v3/tools` |
| `GET /api/v2/actions/list/enums` | `GET /api/v3/tools/enum` |
| `GET /api/v2/actions/{actionId}` | `GET /api/v3/tools/{tool_slug}` |
| `POST /api/v2/actions/{actionId}/execute` | `POST /api/v3/tools/execute/{tool_slug}` |
| `POST /api/v2/actions/{actionId}/execute/get.inputs` | `POST /api/v3/tools/execute/{tool_slug}/input` |
| `POST /api/v2/actions/proxy` | `POST /api/v3/tools/execute/proxy` |

### [Auth Configs (formerly Integrations/Connectors)](https://docs.composio.dev/docs/migration-guide/new-sdk\#auth-configs-formerly-integrationsconnectors)

| Previous Endpoint | Current Endpoint |
| --- | --- |
| `GET /api/v1/integrations` | `GET /api/v3/auth_configs` |
| `POST /api/v1/integrations` | `POST /api/v3/auth_configs` |
| `GET /api/v1/integrations/{integrationId}` | `GET /api/v3/auth_configs/{nanoid}` |
| `PATCH /api/v1/integrations/{integrationId}` | `PATCH /api/v3/auth_configs/{nanoid}` |
| `DELETE /api/v1/integrations/{integrationId}` | `DELETE /api/v3/auth_configs/{nanoid}` |
| `POST /api/v2/integrations/create` | `POST /api/v3/auth_configs` |

### [Connected Accounts (formerly Connections)](https://docs.composio.dev/docs/migration-guide/new-sdk\#connected-accounts-formerly-connections)

| Previous Endpoint | Current Endpoint |
| --- | --- |
| `GET /api/v1/connectedAccounts` | `GET /api/v3/connected_accounts` |
| `POST /api/v1/connectedAccounts` | `POST /api/v3/connected_accounts` |
| `POST /api/v2/connectedAccounts/initiateConnection` | `POST /api/v3/connected_accounts` |
| `GET /api/v1/connectedAccounts/{connectedAccountId}` | `GET /api/v3/connected_accounts/{nanoid}` |
| `DELETE /api/v1/connectedAccounts/{connectedAccountId}` | `DELETE /api/v3/connected_accounts/{nanoid}` |
| `POST /api/v1/connectedAccounts/{connectedAccountId}/disable` | `PATCH /api/v3/connected_accounts/{nanoId}/status` |
| `POST /api/v1/connectedAccounts/{connectedAccountId}/enable` | `PATCH /api/v3/connected_accounts/{nanoId}/status` |
| `POST /api/v1/connectedAccounts/{connectedAccountId}/reinitiate` | `POST /api/v3/connected_accounts/{nanoid}/refresh` |

### [Triggers](https://docs.composio.dev/docs/migration-guide/new-sdk\#triggers-1)

| Previous Endpoint | Current Endpoint |
| --- | --- |
| `GET /api/v1/triggers` | `GET /api/v3/triggers_types` |
| `GET /api/v1/triggers/list/enums` | `GET /api/v3/triggers_types/list/enum` |
| `GET /api/v2/triggers/{triggerName}` | `GET /api/v3/triggers_types/{slug}` |
| `GET /api/v1/triggers/active_triggers` | `GET /api/v3/trigger_instances/active` |
| `POST /api/v1/triggers/enable/{connectedAccountId}/{triggerName}` | `POST /api/v3/trigger_instances/{slug}/upsert` |
| `DELETE /api/v1/triggers/instance/{triggerInstanceId}` | `DELETE /api/v3/trigger_instances/manage/{triggerId}` |
| `PATCH /api/v1/triggers/instance/{triggerId}/status` | `PATCH /api/v3/trigger_instances/manage/{triggerId}` |

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/migration-guide/new-sdk.mdx)

### On this page

[What's new?](https://docs.composio.dev/docs/migration-guide/new-sdk#whats-new) [State of the new SDK and what is happening with the old SDKs?](https://docs.composio.dev/docs/migration-guide/new-sdk#state-of-the-new-sdk-and-what-is-happening-with-the-old-sdks) [Nomenclature](https://docs.composio.dev/docs/migration-guide/new-sdk#nomenclature) [Switch to nano IDs from UUIDs](https://docs.composio.dev/docs/migration-guide/new-sdk#switch-to-nano-ids-from-uuids) [SDK Changes](https://docs.composio.dev/docs/migration-guide/new-sdk#sdk-changes) [UserID scoping](https://docs.composio.dev/docs/migration-guide/new-sdk#userid-scoping) [Replacing ToolSets with Providers](https://docs.composio.dev/docs/migration-guide/new-sdk#replacing-toolsets-with-providers) [Fetching and filtering tools](https://docs.composio.dev/docs/migration-guide/new-sdk#fetching-and-filtering-tools) [Fetching raw tool data](https://docs.composio.dev/docs/migration-guide/new-sdk#fetching-raw-tool-data) [Executing tools](https://docs.composio.dev/docs/migration-guide/new-sdk#executing-tools) [Tool Modifiers (formerly Tool Processors)](https://docs.composio.dev/docs/migration-guide/new-sdk#tool-modifiers-formerly-tool-processors) [Schema Modifiers](https://docs.composio.dev/docs/migration-guide/new-sdk#schema-modifiers) [Before Modifiers](https://docs.composio.dev/docs/migration-guide/new-sdk#before-modifiers) [After Modifiers](https://docs.composio.dev/docs/migration-guide/new-sdk#after-modifiers) [Custom Tools](https://docs.composio.dev/docs/migration-guide/new-sdk#custom-tools) [Auth configs (formerly integrations)](https://docs.composio.dev/docs/migration-guide/new-sdk#auth-configs-formerly-integrations) [Connected accounts / User IDs](https://docs.composio.dev/docs/migration-guide/new-sdk#connected-accounts--user-ids) [Triggers](https://docs.composio.dev/docs/migration-guide/new-sdk#triggers) [Creating triggers](https://docs.composio.dev/docs/migration-guide/new-sdk#creating-triggers) [Enabling/Disabling triggers](https://docs.composio.dev/docs/migration-guide/new-sdk#enablingdisabling-triggers) [Listening to triggers](https://docs.composio.dev/docs/migration-guide/new-sdk#listening-to-triggers) [Coming Soon](https://docs.composio.dev/docs/migration-guide/new-sdk#coming-soon) [Local tools](https://docs.composio.dev/docs/migration-guide/new-sdk#local-tools) [API Endpoints](https://docs.composio.dev/docs/migration-guide/new-sdk#api-endpoints) [Toolkits (formerly Apps)](https://docs.composio.dev/docs/migration-guide/new-sdk#toolkits-formerly-apps) [Tools (formerly Actions)](https://docs.composio.dev/docs/migration-guide/new-sdk#tools-formerly-actions) [Auth Configs (formerly Integrations/Connectors)](https://docs.composio.dev/docs/migration-guide/new-sdk#auth-configs-formerly-integrationsconnectors) [Connected Accounts (formerly Connections)](https://docs.composio.dev/docs/migration-guide/new-sdk#connected-accounts-formerly-connections) [Triggers](https://docs.composio.dev/docs/migration-guide/new-sdk#triggers-1)
