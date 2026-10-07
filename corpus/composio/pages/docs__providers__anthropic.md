---
url: https://docs.composio.dev/docs/providers/anthropic
title: Anthropic | Composio
description: Build an agent with Claude and enable it to use 1000+ tools with Composio.
status: 200
---

[SDKs and frameworks](https://docs.composio.dev/docs/providers)

# Anthropic

Copy page

The Anthropic provider formats Composio tools for Claude and executes the tool calls Claude returns. It works two ways:

- The [Claude Messages API](https://docs.anthropic.com/en/api/messages), where you run the tool-call loop yourself.
- The [Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview), where the SDK runs the loop and Composio tools are exposed as an in-process MCP server.

Pick the tab that matches your integration.

Messages APIClaude Agent SDK

The `AnthropicProvider` transforms Composio tools into the format the Claude Messages API expects, then executes the tool calls Claude requests and shapes the results back into Messages API content blocks.

**Install**

PythonTypeScript

```
uv add composio composio_anthropic anthropic
```

**Configure API Keys**

Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs&utm_medium=content&utm_campaign=docs-providers-anthropic) and `ANTHROPIC_API_KEY` with your [Anthropic API key](https://console.anthropic.com/settings/keys).

.env

```
COMPOSIO_API_KEY=xxxxxxxxx
ANTHROPIC_API_KEY=xxxxxxxxx
```

**Create session and run**

Passing a session to `handle_tool_calls` / `handleToolCalls` requires `composio` newer than 0.19.0 (Python) or `@composio/core` ≥ 0.17.0 with `@composio/anthropic` ≥ 0.11.0 (TypeScript). On earlier versions, execute session tools with [`session.execute()`](https://docs.composio.dev/docs/how-composio-works#executing-session-tools).

PythonTypeScript

```
import json

import anthropic
from composio import Composio
from composio_anthropic import AnthropicProvider

composio = Composio(provider=AnthropicProvider())
client = anthropic.Anthropic()

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

messages = [\
    {"role": "user", "content": "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"}\
]

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    tools=tools,
    messages=messages,
)

# Agentic loop: keep executing tool calls until the model responds with text
while response.stop_reason == "tool_use":
    tool_use_blocks = [block for block in response.content if block.type == "tool_use"]
    results = composio.provider.handle_tool_calls(response=response, session=session)
    messages.append({"role": "assistant", "content": response.content})
    messages.append({
        "role": "user",
        "content": [\
            {"type": "tool_result", "tool_use_id": tool_use_blocks[i].id, "content": json.dumps(result)}\
            for i, result in enumerate(results)\
        ],
    })
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=4096,
        tools=tools,
        messages=messages,
    )

# Print final response
for block in response.content:
    if block.type == "text":
        print(block.text)
```

Pass the session to `handleToolCalls` / `handle_tool_calls` when the model received tools from `session.tools()`. The helper preserves Anthropic input normalization and restored schema aliases before executing every call through that session. For tools fetched via [`tools.get`](https://docs.composio.dev/docs/tools-direct/executing-tools), pass the user ID instead.

## [Provider specifics](https://docs.composio.dev/docs/providers/anthropic\#provider-specifics)

A few things are specific to the Anthropic provider:

- **Tool caching.** Pass `cacheTools: true` to the constructor (`new AnthropicProvider({ cacheTools: true })`) to attach Anthropic's ephemeral `cache_control` to every tool definition and tool-result block. This lets Claude reuse cached tool schemas across requests and can cut prompt cost when you send the same large tool set on every turn.
- **`handleToolCalls` returns Messages API content, not raw strings.** TypeScript returns a ready-to-append `user` message of `tool_result` blocks. Python returns raw results in model-call order, which the sample wraps into `tool_result` blocks.
- **String-encoded tool inputs are handled for you.** Claude occasionally emits a tool's `input` as a JSON string instead of an object. The provider normalizes it before both direct and session execution.
- **`cacheTools` only.** The constructor takes no other options. There is no agentic execution in this provider; you run the loop (Messages API) or hand the loop to the Claude Agent SDK (Agent SDK tab).

## [Next](https://docs.composio.dev/docs/providers/anthropic\#next)

[**What is a session?** \\
How sessions scope users, tools, and auth, and how to reuse them across requests.](https://docs.composio.dev/docs/how-composio-works)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/providers/anthropic.mdx)

### On this page

[Provider specifics](https://docs.composio.dev/docs/providers/anthropic#provider-specifics) [Next](https://docs.composio.dev/docs/providers/anthropic#next)
