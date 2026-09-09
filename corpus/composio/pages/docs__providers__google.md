---
url: https://docs.composio.dev/docs/providers/google
title: Google | Composio
description: Build an agent with Gemini or Google ADK and enable it to use 1000+ tools with Composio.
status: 200
---

[SDKs and frameworks](https://docs.composio.dev/docs/providers)

# Google

Copy page

The Google provider formats Composio tools for [Gemini](https://ai.google.dev/) and the [Google Agent Development Kit (ADK)](https://google.github.io/adk-docs/). Pick the tab that matches your setup.

GeminiADK

In Python, the Gemini provider (`composio_gemini`) wraps Composio tools as typed callables, and the `google-genai` SDK's Automatic Function Calling executes tool calls inside the chat loop for you. In TypeScript, the Google provider transforms Composio tools into Gemini function declarations, and you run the loop: execute each call with `session.execute`, feed the result back, and repeat until the model replies with text.

Object arguments that declare no properties preserve arbitrary nested keys in both providers. The TypeScript provider also adds `type: "object"` to schema nodes that declare `properties` without a type, which is the shape Gemini expects for object schemas.

**Install**

PythonTypeScript

```
uv add composio composio_gemini google-genai
```

**Configure API Keys**

Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs&utm_medium=content&utm_campaign=docs-providers-google) and `GOOGLE_API_KEY` with your [Google API key](https://aistudio.google.com/apikey).

.env

```
COMPOSIO_API_KEY=xxxxxxxxx
GOOGLE_API_KEY=xxxxxxxxx
```

**Create session and run**

PythonTypeScript

```
from composio import Composio
from composio_gemini import GeminiProvider
from google import genai
from google.genai import types

composio = Composio(provider=GeminiProvider())
client = genai.Client()

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

config = types.GenerateContentConfig(tools=tools)
chat = client.chats.create(model="gemini-3-pro-preview", config=config)

# Automatic Function Calling executes tool calls inside the chat loop
response = chat.send_message(
    "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"
)
print(response.text)
```

In TypeScript, execute session tools with `session.execute(toolSlug, arguments)`, as shown above. The provider's `executeToolCall` helper executes tools through the direct path, which does not carry your session — session meta-tools (`COMPOSIO_SEARCH_TOOLS`, `COMPOSIO_MANAGE_CONNECTIONS`, …) are rejected there with `"can only be called inside a tool-router session"`. Use `executeToolCall` only with tools fetched via [`tools.get`](https://docs.composio.dev/docs/tools-direct/executing-tools), not with `session.tools()`. Unlike the [OpenAI](https://docs.composio.dev/docs/providers/openai) and [Anthropic](https://docs.composio.dev/docs/providers/anthropic) helpers, the Google provider's `executeToolCall` does not yet accept a session. (The Python Gemini tab is unaffected: Automatic Function Calling runs provider-wrapped callables, which carry the session.)

## [Next](https://docs.composio.dev/docs/providers/google\#next)

[**What is a session?** \\
How sessions scope users, tools, and auth, and how to reuse them across requests.](https://docs.composio.dev/docs/how-composio-works)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/providers/google.mdx)

### On this page

[Next](https://docs.composio.dev/docs/providers/google#next)
