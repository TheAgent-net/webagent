---
url: https://docs.composio.dev/docs/providers/crewai
title: CrewAI | Composio
description: Build an agent with CrewAI and enable it to use 1000+ tools with Composio.
status: 200
---

[SDKs and frameworks](https://docs.composio.dev/docs/providers)

# CrewAI

Copy page

The CrewAI provider turns Composio tools into CrewAI [`BaseTool`](https://docs.crewai.com/concepts/tools) objects that execute themselves. You connect an account, fetch the tools, pass them to an `Agent`, and CrewAI runs the task end to end.

**Install**

```
uv add composio composio_crewai crewai
```

**Configure API Keys**

Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs&utm_medium=content&utm_campaign=docs-providers-crewai) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

.env

```
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```

**Create session and run**

```
from crewai import Agent, Crew, Task
from composio import Composio
from composio_crewai import CrewAIProvider

composio = Composio(provider=CrewAIProvider())

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

agent = Agent(
    role="Email Agent",
    goal="Send emails on behalf of the user",
    backstory="You are an AI agent that sends emails using Gmail.",
    tools=tools,
    llm="gpt-5.2",
)

task = Task(
    description="Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'",
    agent=agent,
    expected_output="Confirmation that the email was sent",
)

crew = Crew(agents=[agent], tasks=[task])
result = crew.kickoff()
print(result)
```

## [Provider specifics](https://docs.composio.dev/docs/providers/crewai\#provider-specifics)

Each Composio tool becomes a CrewAI `BaseTool` whose `args_schema` is built from the tool's input schema, so CrewAI validates arguments before running anything.

Object arguments that declare no properties accept and preserve arbitrary nested keys. For objects that declare named properties, undeclared keys are rejected unless the schema allows them with `additionalProperties`. Schemas that use `patternProperties` or schema-valued `additionalProperties` also validate dynamic keys before execution.

The provider preserves whether an optional argument was omitted or explicitly set to `None`. By default, declared defaults are included, while optional arguments without defaults stay absent. Set `schema_config={"skip_defaults": True}` when creating the provider to leave declared defaults absent too.

When validation fails, the tool does not raise. It returns a structured result instead:

```
{"successful": False, "error": "<validation message>", "data": None}
```

Check `successful` in your task output rather than wrapping calls in `try`/`except`.

## [Next](https://docs.composio.dev/docs/providers/crewai\#next)

[**What is a session?** \\
How sessions scope users, tools, and auth, and how to reuse them across requests.](https://docs.composio.dev/docs/how-composio-works)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/providers/crewai.mdx)

### On this page

[Provider specifics](https://docs.composio.dev/docs/providers/crewai#provider-specifics) [Next](https://docs.composio.dev/docs/providers/crewai#next)
