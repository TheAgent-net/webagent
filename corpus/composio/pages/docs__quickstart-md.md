---
url: https://docs.composio.dev/docs/quickstart.md
title: https://docs.composio.dev/docs/quickstart.md
description: 
status: 200
---

# Quickstart (/docs/quickstart)

Build an agent that chooses Composio tools at runtime. Type a task, connect an app if needed, and continue in the same conversation.

Pick your framework below. A Composio [session](/docs/how-composio-works) gives your agent tool discovery, account connections, and execution across [1000+ apps](/toolkits). It exposes only a small set of meta tools, so app schemas are loaded when the agent needs them.

> The TypeScript SDK is ESM-only and requires Node.js 22.22.3 or newer. Use `import` syntax rather than CommonJS `require()`.

## OpenAI Agents

#### Install

**Python:**

The Composio Python SDK requires **Python 3.10 or newer**.

> **Do not install composio-core**: The current Python package is `composio`. The package `composio-core` is the legacy v1 SDK — it calls deprecated APIs and does not work with sessions. If an older tutorial or an AI coding assistant suggests it, install `composio` instead. See the [migration guide](/docs/migration-guide/new-sdk).

**TypeScript:**

#### Configure API Keys

> Get your `COMPOSIO_API_KEY` from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=docs-quickstart) and `OPENAI_API_KEY` from [OpenAI](https://platform.openai.com/api-keys).

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
OPENAI_API_KEY=your_openai_api_key
```
#### Create session and run agent

**Python:**

```python
from dotenv import load_dotenv
from composio import Composio
from agents import Agent, Runner, SQLiteSession
from composio_openai_agents import OpenAIAgentsProvider

load_dotenv()

# Initialize Composio with OpenAI Agents provider
composio = Composio(provider=OpenAIAgentsProvider())

# Create a session for your user
user_id = "user_123"
session = composio.sessions.create(user_id=user_id)
tools = session.tools()

# For multi-turn, store the session ID in your db and reuse instead of creating another session:
# session_id = session.session_id
# session = composio.use(session_id)

agent = Agent(
    name="Personal Assistant",
    instructions=(
        "Use Composio tools to complete the request. "
        "If a connection is required, share its Connect Link and wait. "
        "Ask for confirmation before creating, updating, or deleting data."
    ),
    model="gpt-5.2",
    tools=tools,
)

# Memory for multi-turn conversation
memory = SQLiteSession("conversation")

print("""
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository'
""")

while True:
    user_input = input("You: ").strip()
    if user_input.lower() == "exit":
        break

    print("Assistant: ", end="", flush=True)
    result = Runner.run_sync(starting_agent=agent, input=user_input, session=memory)
    print(f"{result.final_output}\n")
```
**TypeScript:**

```typescript
import "dotenv/config";
import { Composio } from "@composio/core";
import { Agent, run, MemorySession } from "@openai/agents";
import { OpenAIAgentsProvider } from "@composio/openai-agents";
import { createInterface } from "readline/promises";

// Initialize Composio with OpenAI Agents provider
const composio = new Composio({ provider: new OpenAIAgentsProvider() });

// Create a session for your user
const userId = "user_123";
const session = await composio.create(userId);
const tools = await session.tools();

// For multi-turn, store the session ID in your db and reuse instead of calling create() again:
// const sessionId = session.sessionId;
// const session = await composio.use(sessionId);

const agent = new Agent({
  name: "Personal Assistant",
  instructions:
    "Use Composio tools to complete the request. " +
    "If a connection is required, share its Connect Link and wait. " +
    "Ask for confirmation before creating, updating, or deleting data.",
  model: "gpt-5.2",
  tools,
});

const memory = new MemorySession();
const readline = createInterface({ input: process.stdin, output: process.stdout });

console.log(`
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository'
`);

while (true) {
  const input = (await readline.question("You: ")).trim();
  if (input.toLowerCase() === "exit") break;

  process.stdout.write("Assistant: ");
  const result = await run(agent, input, { session: memory });
  process.stdout.write(`${result.finalOutput}\n`);
}
readline.close();
```
## Claude Agent SDK

#### Install

**Python:**

> **Do not install composio-core**: The current Python package is `composio`. The package `composio-core` is the legacy v1 SDK — it calls deprecated APIs and does not work with sessions. If an older tutorial or an AI coding assistant suggests it, install `composio` instead. See the [migration guide](/docs/migration-guide/new-sdk).

**TypeScript:**

#### Configure API Keys

> Get your `COMPOSIO_API_KEY` from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=docs-quickstart) and `ANTHROPIC_API_KEY` from [Anthropic](https://console.anthropic.com/settings/keys).

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```
#### Create session and run agent

**Python:**

```python
import asyncio
from dotenv import load_dotenv
from composio import Composio
from composio_claude_agent_sdk import ClaudeAgentSDKProvider
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, create_sdk_mcp_server, AssistantMessage, TextBlock

load_dotenv()

# Initialize Composio with Claude Agent SDK provider
composio = Composio(provider=ClaudeAgentSDKProvider())

# Create a session for your user
user_id = "user_123"
session = composio.sessions.create(user_id=user_id)
tools = session.tools()

# For multi-turn, store the session ID in your db and reuse instead of creating another session:
# session_id = session.session_id
# session = composio.use(session_id)

custom_server = create_sdk_mcp_server(name="composio", version="1.0.0", tools=tools)

async def main():
    options = ClaudeAgentOptions(
        system_prompt=(
            "Use Composio tools to complete the request. "
            "If a connection is required, share its Connect Link and wait. "
            "Ask for confirmation before creating, updating, or deleting data."
        ),
        permission_mode="bypassPermissions",
        mcp_servers={"composio": custom_server},
    )

    async with ClaudeSDKClient(options=options) as client:
        print("""
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository'
""")

        while True:
            user_input = input("You: ").strip()
            if user_input.lower() == "exit":
                break

            await client.query(user_input)
            print("Claude: ", end="", flush=True)
            async for message in client.receive_response():
                if isinstance(message, AssistantMessage):
                    for block in message.content:
                        if isinstance(block, TextBlock):
                            print(block.text, end="", flush=True)
            print()

asyncio.run(main())
```
**TypeScript:**

```typescript
import "dotenv/config";
import { Composio } from "@composio/core";
import { ClaudeAgentSDKProvider } from "@composio/claude-agent-sdk";
import { createSdkMcpServer, query } from "@anthropic-ai/claude-agent-sdk";
import { createInterface } from "readline/promises";

// Initialize Composio with Claude Agent SDK provider
const composio = new Composio({ provider: new ClaudeAgentSDKProvider() });

// Create a session for your user
const userId = "user_123";
const session = await composio.create(userId);
const tools = await session.tools();

// For multi-turn, store the session ID in your db and reuse instead of calling create() again:
// const sessionId = session.sessionId;
// const session = await composio.use(sessionId);

const customServer = createSdkMcpServer({
  name: "composio",
  version: "1.0.0",
  tools: tools,
});

const readline = createInterface({ input: process.stdin, output: process.stdout });

console.log(`
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository and create a Google Sheet with the issues'
`);

let isFirstQuery = true;
const options = {
  systemPrompt:
    "Use Composio tools to complete the request. " +
    "If a connection is required, share its Connect Link and wait. " +
    "Ask for confirmation before creating, updating, or deleting data.",
  mcpServers: { composio: customServer },
  permissionMode: "bypassPermissions" as const,
};

while (true) {
  const input = (await readline.question("You: ")).trim();
  if (input.toLowerCase() === "exit") break;

  const queryOptions = isFirstQuery ? options : { ...options, continue: true };
  isFirstQuery = false;

  process.stdout.write("Claude: ");
  for await (const stream of query({ prompt: input, options: queryOptions })) {
    if (stream.type === "assistant") {
      for (const block of stream.message.content) {
        if (block.type === "text") {
          process.stdout.write(block.text);
        }
      }
    }
  }
  console.log();
}

readline.close();
```
## Vercel AI SDK

#### Install

#### Configure API Keys

> Get your `COMPOSIO_API_KEY` from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=docs-quickstart) and `ANTHROPIC_API_KEY` from [Anthropic](https://console.anthropic.com/settings/keys).

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```
#### Create session and run agent

```typescript
import "dotenv/config";
import { anthropic } from "@ai-sdk/anthropic";
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";
import { streamText, stepCountIs, type ModelMessage } from "ai";
import { createInterface } from "readline/promises";

// Initialize Composio with Vercel provider
const composio = new Composio({ provider: new VercelProvider() });

// Create a session for your user
const userId = "user_123";
const session = await composio.create(userId);
const tools = await session.tools();

// For multi-turn, store the session ID in your db and reuse instead of calling create() again:
// const sessionId = session.sessionId;
// const session = await composio.use(sessionId);

const readline = createInterface({ input: process.stdin, output: process.stdout });

console.log(`
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository'
`);

const messages: ModelMessage[] = [];

while (true) {
  const input = (await readline.question("You: ")).trim();
  if (input.toLowerCase() === "exit") break;

  messages.push({ role: "user", content: input });
  process.stdout.write("Assistant: ");

  const result = await streamText({
    system:
      "Use Composio tools to complete the request. " +
      "If a connection is required, share its Connect Link and wait. " +
      "Ask for confirmation before creating, updating, or deleting data.",
    model: anthropic("claude-sonnet-4-6"),
    messages,
    stopWhen: stepCountIs(10),
    onStepFinish: (step) => {
      for (const toolCall of step.toolCalls) {
        process.stdout.write(`\n[Using tool: ${toolCall.toolName}]`);
      }
    },
    tools,
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
  console.log();

  messages.push(...(await result.response).messages);
}

readline.close();
```

Ask for any task that needs an app tool: `Summarize my unread emails from today`, or `List all open issues on the composio github repository`. If a task needs access to an account, the agent gives you a Connect Link. Open it, approve the connection, and tell the agent to continue.

## What just happened? [#what-just-happened]

* The provider you picked formats Composio tools for your framework and wires in execution.
* `composio.sessions.create()` creates a Composio session for `user_123`. The session scopes connections and tool calls to that ID.
* Composio sessions persist. In an application, store the session ID (`session.session_id` in Python, `session.sessionId` in TypeScript) and restore it with `composio.use(session_id)` instead of creating a new session for every turn. See [Reusing a session](/docs/how-composio-works#how-sessions-behave).
* `session.tools()` gives the agent a small set of meta tools for finding, connecting, and running app tools. It does not load thousands of tool schemas into the model context.

> **Use your application's user ID in production**: `user_123` is only for this local example. Replace it with a stable ID from your database. Each ID gets separate connections and tool calls.

You can inspect the selected tools, inputs, responses, and timing with the [Logs API](/reference/api-reference/logs).

## Adapt the example [#adapt-the-example]

- [Use another framework](/docs/providers): Choose OpenAI, Anthropic, Vercel AI SDK, LangChain, CrewAI, or another supported provider.

- [Configure the session](/docs/configuring-sessions): Restrict toolkits, preload tools, or select connected accounts.

- [Design authentication](/docs/authentication): Add Connect Links and per-user connections to your application.

- [Expose an MCP endpoint](/docs/sessions-via-mcp): Use the same Composio session from an MCP-compatible application.

---

📚 **More documentation:** [View all docs](https://docs.composio.dev/llms.txt) | [Glossary](https://docs.composio.dev/llms.mdx/reference/glossary) | [Examples](https://docs.composio.dev/llms.mdx/examples) | [API Reference](https://docs.composio.dev/llms.mdx/reference)

---

# Composio SDK — Notes for AI Code Generators

**Purpose:** Reference for generating current (v3) [Composio](https://composio.dev/) integration code.
**Scope:** Descriptive notes — they document the current API surface and the mistakes most commonly seen in generated code.

---

## 1. Recommended Integration: Sessions

Composio supports two integration modes: **Native Tools** (with a provider package) and **MCP** (no provider package needed).

### Native Tools

```python
# ✅ CORRECT — Python (defaults to OpenAI)
from composio import Composio

composio = Composio()
session = composio.create(user_id="user_123")
tools = session.tools()
# Pass tools to your agent/LLM framework
```

```typescript
// ✅ CORRECT — TypeScript (defaults to OpenAI)
import { Composio } from "@composio/core";

const composio = new Composio();
const session = await composio.create("user_123");
const tools = await session.tools();
// Pass tools to your agent/LLM framework
```

For other providers, pass the provider explicitly. Provider packages follow the naming convention: `composio_<provider>` for Python, `@composio/<provider>` for TypeScript.

### MCP

Use `session.mcp.url` and `session.mcp.headers` with any MCP-compatible client (Claude Desktop, Cursor, OpenAI Agents, etc.). No provider package needed.

---

## 2. Integration Notes

- `composio.create(user_id)` is the standard entry point for agent integrations. Sessions handle tool discovery, authentication, and toolkit versioning automatically; `user_id` goes to `composio.create()` — individual tool calls in session mode don't take one.
- Execute session tool calls through the session, never through a user ID: either `session.execute(tool_slug, arguments=...)` / `session.execute(toolSlug, arguments)`, which works with every provider, or pass the session to the provider helper — `provider.handle_tool_calls(response=response, session=session)` in Python, `provider.handleToolCalls(session, response)` in TypeScript. Only the OpenAI and Anthropic helpers accept a session; with other providers, use `session.execute()`. Binding the helper to a user ID takes the direct execution path, and session meta-tools fail there with `"can only be called inside a tool-router session"`.
- Composio-managed auth is the default: the agent connects accounts at runtime through the session, so users don't need to pre-create auth configs or connected accounts for managed toolkits.
- Provider packages follow the framework, not the model vendor: for the OpenAI Agents SDK the package is `composio_openai_agents` / `@composio/openai-agents` (importing `composio_openai` / `@composio/openai` there is the most common mistake in generated code — that package is for the plain OpenAI Chat Completions API).
- **Direct execution** (`composio.tools.get()`, `composio.tools.execute()`, `provider.handle_tool_calls()` with a user ID) is a fully supported lower-level interface: your code picks the tool, no runtime discovery. It fits deterministic workflows and scripts; sessions fit agents that decide at runtime. The tradeoffs are documented at https://docs.composio.dev/docs/sessions-vs-direct-execution. Note that direct execution requires a toolkit version (https://docs.composio.dev/docs/tools-direct/toolkit-versioning).

---

# 3. Calling the REST API directly

## REST API version

The current REST API version is **v3.1**, served at `https://backend.composio.dev/api/v3.1`. Prefer it for new code and new examples.

`https://backend.composio.dev/api/v3` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.

## Tool-endpoint version defaults on v3.1

On v3.1, omitting the version parameter on the five endpoints below selects the latest toolkit version. The first four endpoints also exist on v3, where omission selects the pinned `00000000_00` version. `POST /tools/scopes/required` is v3.1-only.

| Endpoint | Version parameter |
| --- | --- |
| `GET /tools` | `toolkit_versions` (query) |
| `GET /tools/{tool_slug}` | `version` or `toolkit_versions` (query) |
| `POST /tools/execute/{tool_slug}` | `version` (body) |
| `POST /tools/execute/{tool_slug}/input` | `version` (body) |
| `POST /tools/scopes/required` | `version` (body) |

A v3.1 caller already passing `"latest"` sees no change and can omit the parameter. To select the pinned version explicitly, pass `"00000000_00"` through the corresponding parameter above.

This version-default change is limited to the five endpoints above.


---

## Terminology Migration (old → current)

If you encounter these terms in error messages, old documentation, or user prompts, translate them to the current equivalents. **Do not use the old terms in generated code or explanations.**

| Old term (v1/v2) | Current term (v3) | In code |
|---|---|---|
| entity ID | user ID | `user_id` parameter |
| actions | tools | e.g., `GITHUB_CREATE_ISSUE` is a *tool* |
| apps / appType | toolkits | e.g., `github` is a *toolkit* |
| integration / integration ID | auth config / auth config ID | `auth_config_id` parameter |
| connection | connected account | `connected_accounts` namespace |
| ComposioToolSet / OpenAIToolSet | `Composio` class with a provider | `Composio(provider=...)` |
| toolset | provider | e.g., `OpenAIProvider` |

If a user says "entity ID", they mean `user_id`. If they say "integration", they mean "auth config". Always respond using the current terminology.
