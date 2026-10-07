---
url: https://docs.composio.dev/docs/providers/llamaindex
title: LlamaIndex | Composio
description: Build an agent with LlamaIndex and enable it to use 1000+ tools with Composio.
status: 200
---

[SDKs and frameworks](https://docs.composio.dev/docs/providers)

# LlamaIndex

Copy page

The LlamaIndex provider turns Composio tools into LlamaIndex [`FunctionTool`](https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/) objects that execute themselves. You connect an account, fetch the tools, hand them to a `FunctionAgent`, and LlamaIndex drives the calls. The provider ships for both Python and TypeScript.

**Install**

PythonTypeScript

```
uv add composio composio_llamaindex llama-index llama-index-llms-openai
```

**Configure API Keys**

Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs&utm_medium=content&utm_campaign=docs-providers-llamaindex) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

.env

```
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```

**Create session and run**

PythonTypeScript

```
import asyncio
from composio import Composio
from composio_llamaindex import LlamaIndexProvider
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.llms.openai import OpenAI

composio = Composio(provider=LlamaIndexProvider())
llm = OpenAI(model="gpt-5.2")

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

agent = FunctionAgent(tools=tools, llm=llm)

async def main():
    result = await agent.run(
        user_msg="Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"
    )
    print(result)

asyncio.run(main())
```

## [Next](https://docs.composio.dev/docs/providers/llamaindex\#next)

[**What is a session?** \\
How sessions scope users, tools, and auth, and how to reuse them across requests.](https://docs.composio.dev/docs/how-composio-works)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/providers/llamaindex.mdx)

### On this page

[Next](https://docs.composio.dev/docs/providers/llamaindex#next)
