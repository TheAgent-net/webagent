---
url: https://docs.composio.dev/docs/providers/langchain
title: LangChain | Composio
description: Build an agent with LangChain or LangGraph and enable it to use 1000+ tools with Composio.
status: 200
---

[SDKs and frameworks](https://docs.composio.dev/docs/providers)

# LangChain

Copy page

The LangChain provider formats Composio tools for [LangChain](https://python.langchain.com/) and [LangGraph](https://langchain-ai.github.io/langgraph/) agents. Pick the tab that matches your setup.

LangChainLangGraph

The LangChain provider transforms each Composio tool into a LangChain [`DynamicStructuredTool`](https://js.langchain.com/docs/concepts/tools/) with built-in execution. You can hand the tools to `create_agent` in Python or wire them into a graph node in TypeScript, and the framework runs the tool loop for you.

**Install**

PythonTypeScript

```
uv add composio composio_langchain langchain langchain_openai
```

**Configure API Keys**

Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs&utm_medium=content&utm_campaign=docs-providers-langchain) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

.env

```
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```

**Create session and run**

PythonTypeScript

```
from composio import Composio
from composio_langchain import LangchainProvider
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI

composio = Composio(provider=LangchainProvider())
llm = ChatOpenAI(model="gpt-5.2")

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

agent = create_agent(tools=tools, model=llm)
result = agent.invoke({"messages": [("user", "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'")]})

print(result["messages"][-1].content)
```

## [Python argument validation](https://docs.composio.dev/docs/providers/langchain\#python-argument-validation)

The Python LangChain and LangGraph providers build a Pydantic argument model from each tool's JSON Schema. Object arguments that declare no properties accept and preserve arbitrary nested keys. For objects that declare named properties, undeclared keys are rejected unless the schema allows them with `additionalProperties`.

Schemas that use `patternProperties` or schema-valued `additionalProperties` validate dynamic keys before execution. The providers also preserve whether an optional argument was omitted or explicitly set to `None`. By default, declared defaults are included, while optional arguments without defaults stay absent. Set `schema_config={"skip_defaults": True}` when creating the provider to leave declared defaults absent too.

When validation fails, the tool does not run. LangChain surfaces the failure as a tool error observation so the agent can correct its arguments and retry.

## [Next](https://docs.composio.dev/docs/providers/langchain\#next)

[**What is a session?** \\
How sessions scope users, tools, and auth, and how to reuse them across requests.](https://docs.composio.dev/docs/how-composio-works)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/providers/langchain.mdx)

### On this page

[Python argument validation](https://docs.composio.dev/docs/providers/langchain#python-argument-validation) [Next](https://docs.composio.dev/docs/providers/langchain#next)
