---
url: https://docs.composio.dev/docs/providers/openai
title: OpenAI | Composio
description: Build an agent with OpenAI and enable it to use 1000+ tools with Composio.
status: 200
---

[SDKs and frameworks](https://docs.composio.dev/docs/providers)

# OpenAI

Copy page

The OpenAI provider formats Composio tools for OpenAI's function-calling and executes the tool calls the model returns. It works three ways:

- The [Responses API](https://platform.openai.com/docs/api-reference/responses), the recommended way to build agentic flows, where you run the tool-call loop yourself.
- The [Chat Completions API](https://platform.openai.com/docs/api-reference/chat), the classic message-based interface, where you also run the loop.
- The [Agents SDK](https://openai.github.io/openai-agents-python/), where the SDK runs the loop and executes Composio tools for you.

The OpenAI provider is the default provider for the Composio SDK, so you get it without configuring anything. Pick the tab that matches your integration.

Responses APIChat CompletionsAgents SDK

The `OpenAIResponsesProvider` transforms Composio tools into OpenAI's function-calling format for the Responses API, then executes the tool calls the model returns and shapes the results into `function_call_output` items you feed back in.

**Install**

PythonTypeScript

```
uv add composio composio_openai openai
```

**Configure API Keys**

Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs&utm_medium=content&utm_campaign=docs-providers-openai) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

.env

```
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```

**Create session and run**

The [Responses API](https://platform.openai.com/docs/api-reference/responses) is the recommended way to build agentic flows with OpenAI. You pass `previous_response_id` on each turn so the model keeps the prior context, and you send back only the new `function_call_output` items.

Passing a session to `handle_tool_calls` / `handleToolCalls` requires `composio` newer than 0.19.0 (Python) or `@composio/core` ≥ 0.17.0 with `@composio/openai` ≥ 0.12.0 (TypeScript). On earlier versions, execute session tools with [`session.execute()`](https://docs.composio.dev/docs/how-composio-works#executing-session-tools).

PythonTypeScript

```
import json
from openai import OpenAI
from composio import Composio
from composio_openai import OpenAIResponsesProvider

composio = Composio(provider=OpenAIResponsesProvider())
client = OpenAI()

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

response = client.responses.create(
    model="gpt-5.2",
    tools=tools,
    input=[\
        {\
            "role": "user",\
            "content": "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"\
        }\
    ]
)

# Agentic loop: keep executing tool calls until the model responds with text
while True:
    tool_calls = [o for o in response.output if o.type == "function_call"]
    if not tool_calls:
        break
    results = composio.provider.handle_tool_calls(response=response, session=session)
    response = client.responses.create(
        model="gpt-5.2",
        tools=tools,
        previous_response_id=response.id,
        input=[\
            {\
                "type": "function_call_output",\
                "call_id": call.call_id,\
                "output": json.dumps(results[i]),\
            }\
            for i, call in enumerate(tool_calls)\
        ]
    )

# Print final response
for item in response.output:
    if item.type == "message":
        print(item.content[0].text)
```

## [Provider specifics](https://docs.composio.dev/docs/providers/openai\#provider-specifics)

The OpenAI integration ships three providers, one per API surface:

- **`OpenAIResponsesProvider`** for the Responses API. `handleToolCalls` executes each `function_call` and returns `function_call_output` items keyed by `call_id`, paired with `previous_response_id` so you only resend new outputs each turn.
- **`OpenAIProvider`** for the Chat Completions API. This is the SDK default, so `new Composio()` with no provider uses it. You keep the full message list and append each assistant message plus its `tool` results yourself.
- **`OpenAIAgentsProvider`** for the Agents SDK. Tools come with execution wired in, so the SDK runs the loop for you.

**Strict mode.** Pass `strict: true` or `strict=True` to `OpenAIResponsesProvider`, or pass `strict: true` to the TypeScript `OpenAIAgentsProvider`, to normalize each tool's input schema for [structured outputs](https://platform.openai.com/docs/guides/structured-outputs). The Python Agents SDK provider does not support strict mode yet. Every object lists all of its properties in `required` and is closed, while optional properties stay available but accept `null`. A `null` is dropped before the tool runs unless the tool's own schema accepts `null` for that parameter. Tools whose schema strict mode cannot express, such as objects that accept arbitrary keys, `allOf`, `prefixItems`, or unresolved `$ref`s, are sent without strict mode and log a warning.

PythonTypeScript

```
from composio import Composio
from composio_openai import OpenAIResponsesProvider

composio = Composio(provider=OpenAIResponsesProvider(strict=True))
```

Pass the session to `handleToolCalls` / `handle_tool_calls` when the model received tools from `session.tools()`. The helper preserves the provider's argument normalization and executes every call through that session. For tools fetched via [`tools.get`](https://docs.composio.dev/docs/tools-direct/executing-tools), pass the user ID instead.

Use the Responses or Agents provider for new agentic flows; reach for Chat Completions when you are extending an existing Chat Completions codebase.

## [Next](https://docs.composio.dev/docs/providers/openai\#next)

[**What is a session?** \\
How sessions scope users, tools, and auth, and how to reuse them across requests.](https://docs.composio.dev/docs/how-composio-works)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/providers/openai.mdx)

### On this page

[Provider specifics](https://docs.composio.dev/docs/providers/openai#provider-specifics) [Next](https://docs.composio.dev/docs/providers/openai#next)
