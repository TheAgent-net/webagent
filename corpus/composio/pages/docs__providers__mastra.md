---
url: https://docs.composio.dev/docs/providers/mastra
title: Mastra | Composio
description: Build an agent with Mastra and enable it to use 1000+ tools with Composio.
status: 200
---

[SDKs and frameworks](https://docs.composio.dev/docs/providers)

# Mastra

Copy page

The Mastra provider transforms Composio tools into [Mastra's tool format](https://mastra.ai/en/docs/tools-mcp/overview#creating-tools) with built-in execution. Pass the wrapped tools to a Mastra `Agent`, and the agent calls them automatically. Each tool gets both an input and an output schema, so Mastra can validate tool results as well as arguments.

**Install**

```
npm install @composio/core @composio/mastra @mastra/core @ai-sdk/openai
```

**Configure API Keys**

Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs&utm_medium=content&utm_campaign=docs-providers-mastra) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

.env

```
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```

**Create session and run**

```
import { Composio } from "@composio/core";
import { MastraProvider } from "@composio/mastra";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

const composio = new Composio({
  provider: new MastraProvider(),
});

// Create a session for your user
const session = await composio.create("user_123");
const tools = await session.tools();

const agent = new Agent({
  id: "my-agent",
  name: "My Agent",
  instructions: "You are a helpful assistant.",
  model: openai("gpt-5.2"),
  tools,
});

const { text } = await agent.generate([\
  { role: "user", content: "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'" },\
]);

console.log(text);
```

## [Provider specifics](https://docs.composio.dev/docs/providers/mastra\#provider-specifics)

**Strict mode.** Pass `strict: true` to normalize each tool's input schema for OpenAI structured outputs before Mastra compiles it: every object lists all of its properties in `required` and is closed, and optional properties stay available but accept `null`. A `null` is dropped before the tool runs unless the tool's own schema accepts `null` for that parameter, so nullable fields still receive an explicit `null`. Tools whose schema cannot be expressed in strict mode, such as objects that accept arbitrary keys, `allOf`, `prefixItems`, or unresolved `$ref`s, keep their original schema and log a warning:

```
import { Composio } from "@composio/core";
import { MastraProvider } from "@composio/mastra";

const composio = new Composio({ provider: new MastraProvider({ strict: true }) });
```

The provider runs each tool's JSON Schema through Mastra's schema-compat layer and inlines internal `$ref` pointers first. A few Composio tools reference `$defs` entries that the upstream API does not emit. Rather than crash `tools.get`, the provider falls back to a permissive object schema for that property and logs one warning per tool, so the affected field validates loosely.

## [Next](https://docs.composio.dev/docs/providers/mastra\#next)

[**What is a session?** \\
How sessions scope users, tools, and auth, and how to reuse them across requests.](https://docs.composio.dev/docs/how-composio-works)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/providers/mastra.mdx)

### On this page

[Provider specifics](https://docs.composio.dev/docs/providers/mastra#provider-specifics) [Next](https://docs.composio.dev/docs/providers/mastra#next)
