---
url: https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/schema-modifiers
title: Schema Modifiers | Composio
description: Customize how tools appear to agents
status: 200
---

Direct executionModify tool behavior

Legacy

# Schema Modifiers

Copy page

If you're building an agent, we recommend using [sessions](https://docs.composio.dev/docs/configuring-sessions) instead. See [Tools and toolkits](https://docs.composio.dev/docs/how-composio-works#meta-tools) for how sessions handle tool discovery and execution automatically.

Schema modifiers are part of Composio SDK's powerful middleware capabilities that allow you to customize and extend the behavior of tools.

Schema modifiers transform a tool's schema before the tool is seen by an agent.

![Schema Modifier](https://docs.composio.dev/_next/image?url=%2Fimages%2Fschema-modifier.png&w=1920&q=75&dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)

**Useful for:**

- Modifying or rewriting the tool description to better fit your use case
- Adding arguments to the tool (e.g., adding a `thought` argument to prompt the agent to explain reasoning)
- Hiding arguments from the tool when they're irrelevant
- Adding extra arguments for custom use cases
- Adding default values to tool arguments

Below we modify the schema of `HACKERNEWS_GET_LATEST_POSTS` to make the `size` argument required and remove the `page` argument.

PythonTypeScript

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

With the modified tool schema, the `page` argument is removed and `size` is required.

### Full example with LLM

## [Example: Modifying the tool description](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/schema-modifiers\#example-modifying-the-tool-description)

Sometimes you need to provide additional context to help the agent understand how to use a tool correctly. This example demonstrates modifying the description of `GITHUB_LIST_REPOSITORY_ISSUES` to specify a default repository.

This approach is useful when you want to guide the agent's behavior without changing the tool's underlying functionality.

In this example:

- We append additional instructions to the tool's description
- The modified description tells the agent to use `composiohq/composio` as the default repository
- This helps prevent errors when the agent forgets to specify a repository parameter

PythonTypeScript

```
from composio import Composio, schema_modifier
from composio.types import Tool
from composio_google import GoogleProvider
from google import genai
from uuid import uuid4

composio = Composio(provider=GoogleProvider())
client = genai.Client()
user_id = uuid4()

@schema_modifier(tools=["GITHUB_LIST_REPOSITORY_ISSUES"])
def append_repository(
    tool: str,
    toolkit: str,
    schema: Tool,
) -> Tool:
    schema.description += " When not specified, use the `composiohq/composio` repository"
    return schema

tools = composio.tools.get(
    user_id=user_id,
    tools=["GITHUB_LIST_REPOSITORY_ISSUES"],
    modifiers=[append_repository]
)

print(tools)
```

## [Next](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/schema-modifiers\#next)

[**Before execution modifiers** \\
Modify tool arguments before execution](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/tools-direct/modify-tool-behavior/schema-modifiers.mdx)

### On this page

[Example: Modifying the tool description](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/schema-modifiers#example-modifying-the-tool-description) [Next](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/schema-modifiers#next)
