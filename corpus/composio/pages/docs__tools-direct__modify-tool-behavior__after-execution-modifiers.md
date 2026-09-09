---
url: https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/after-execution-modifiers
title: After Execution Modifiers | Composio
description: Transform tool results after execution
status: 200
---

Direct executionModify tool behavior

Legacy

# After Execution Modifiers

Copy page

If you're building an agent, we recommend using [sessions](https://docs.composio.dev/docs/configuring-sessions) instead. See [Tools and toolkits](https://docs.composio.dev/docs/how-composio-works#meta-tools) for how sessions handle tool discovery and execution automatically.

After execution modifiers are part of Composio SDK's powerful middleware capabilities that allow you to customize and extend the behavior of tools.

These modifiers are called after the tool is executed. This allows you to modify the result of the tool before it is returned to the agent.

**Useful for:**

- Modifying or truncating the output of the tool
- Converting the output to a different format before returning it to the agent

![After Execution Modifier](https://docs.composio.dev/_next/image?url=%2Fimages%2Fafter-execute.png&w=1920&q=75&dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)

Below we use the `afterExecute` modifier to truncate the output of `HACKERNEWS_GET_USER` and only return the karma of the user.

## [With Chat Completions](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/after-execution-modifiers\#with-chat-completions)

Since completion providers don't have a function execution step, Composio executes the tool call directly. The modifier is configured on the `tools.execute` method.

PythonTypeScript

```
from composio import Composio, after_execute
from composio.types import ToolExecutionResponse

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

# Get response from the LLM
response = openai_client.chat.completions.create(
    model="gpt-5.4",
    tools=tools,
    messages=messages,
)
print(response)

# Execute the function calls
result = composio.provider.handle_tool_calls(
  response=response,
  user_id="default",
  modifiers=[\
     after_execute_modifier,\
  ]
)
print(result)
```

## [With Agentic Frameworks](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/after-execution-modifiers\#with-agentic-frameworks)

Agentic providers have a function execution step. The modifier is configured on the `tools.get` method which modifies the execution logic within the framework.

PythonTypeScript

```
from composio import Composio, after_execute
from composio.types import ToolExecutionResponse
from composio_crewai import CrewAIProvider

composio = Composio(
    provider=CrewAIProvider(),
    toolkit_versions={"hackernews": "latest"},
)

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

tools = composio.tools.get(
    user_id="default",
    slug="HACKERNEWS_GET_USER",
    modifiers=[\
        after_execute_modifier,\
    ]
)
```

## [Next](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/after-execution-modifiers\#next)

[**Before execution modifiers** \\
Modify tool arguments before execution](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/tools-direct/modify-tool-behavior/after-execution-modifiers.mdx)

### On this page

[With Chat Completions](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/after-execution-modifiers#with-chat-completions) [With Agentic Frameworks](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/after-execution-modifiers#with-agentic-frameworks) [Next](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/after-execution-modifiers#next)
