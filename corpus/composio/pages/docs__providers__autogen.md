---
url: https://docs.composio.dev/docs/providers/autogen
title: AutoGen | Composio
description: Build an agent with AutoGen and enable it to use 1000+ tools with Composio.
status: 200
---

[SDKs and frameworks](https://docs.composio.dev/docs/providers)

# AutoGen

Copy page

The AutoGen provider turns Composio tools into AutoGen [`FunctionTool`](https://microsoft.github.io/autogen/) objects and registers them with your agents. You connect an account, fetch the tools, register them with a caller and executor agent, and AutoGen handles the conversation and tool calls.

The provider runs on the [`ag2`](https://github.com/ag2ai/ag2) distribution, the community-maintained continuation of AutoGen 0.2, so it works for AG2 projects out of the box.

**Install**

```
uv add composio composio_autogen 'ag2[openai]'
```

**Configure API Keys**

Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs&utm_medium=content&utm_campaign=docs-providers-autogen) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

.env

```
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```

**Create session and run**

```
import os

from autogen import AssistantAgent, LLMConfig, UserProxyAgent
from composio import Composio
from composio_autogen import AutogenProvider

composio = Composio(provider=AutogenProvider())

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

chatbot = AssistantAgent(
    "chatbot",
    system_message="Reply TERMINATE when the task is done or when user's content is empty",
    llm_config=LLMConfig({
        "api_type": "openai",
        "model": "gpt-5.2",
        "api_key": os.environ["OPENAI_API_KEY"],
    }),
)

user_proxy = UserProxyAgent(
    "user_proxy",
    is_termination_msg=lambda msg: "TERMINATE" in (msg.get("content", "") or ""),
    human_input_mode="NEVER",
    code_execution_config={"use_docker": False},
)

# Register tools with both agents
composio.provider.register_tools(caller=chatbot, executor=user_proxy, tools=tools)

response = user_proxy.initiate_chat(
    chatbot,
    message="Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'",
)

print(response.chat_history)
```

## [Provider specifics](https://docs.composio.dev/docs/providers/autogen\#provider-specifics)

AutoGen needs tools registered with two agents, not passed once. Call `composio.provider.register_tools(caller=..., executor=..., tools=tools)`: the `caller` decides which tool to invoke, and the `executor` runs it.

Each tool comes back as an AutoGen `FunctionTool` with a generated `name`. AutoGen caps function names at 64 characters, so the provider hashes and truncates long tool slugs to stay under the limit. The registered name will not always match the original Composio slug.

`register_tools` is unique to the AutoGen provider. Other providers pass tools straight into the agent constructor, so don't expect this method elsewhere.

## [Next](https://docs.composio.dev/docs/providers/autogen\#next)

[**What is a session?** \\
How sessions scope users, tools, and auth, and how to reuse them across requests.](https://docs.composio.dev/docs/how-composio-works)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/providers/autogen.mdx)

### On this page

[Provider specifics](https://docs.composio.dev/docs/providers/autogen#provider-specifics) [Next](https://docs.composio.dev/docs/providers/autogen#next)
