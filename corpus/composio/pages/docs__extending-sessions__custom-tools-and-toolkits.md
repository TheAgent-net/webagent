---
url: https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits
title: Custom Tools and Toolkits | Composio
description: Define local tools that run in-process alongside remote Composio tools
status: 200
---

Extend sessions

Experimental

# Custom Tools and Toolkits

Copy page

Custom tools let you define tools that run in-process alongside remote Composio tools within a session. You have three patterns:

- **Standalone tools**: internal app logic that doesn't need Composio auth (DB lookups, in-memory data, business rules).
- **Extension tools**: wrap a Composio toolkit's API with custom business logic via `extendsToolkit` / `extends_toolkit`, using `ctx.proxyExecute()` / `ctx.proxy_execute()` for authenticated requests.
- **Custom toolkits**: group related standalone tools under a namespace.

Standalone ToolExtension ToolCustom Toolkit

**Install**

TypeScriptPython

```
npm install @composio/core zod
```

**Initialize the client**

TypeScriptPython

```
import { Composio } from "@composio/core";

const composio = new Composio({ apiKey: "your_api_key" });
```

**Create the tool**

A standalone tool handles internal app logic that doesn't need Composio auth. `ctx.userId` identifies which user's session is running.

TypeScriptPython

```

const profiles: Record<string, { name: string; email: string; tier: string }> = {
  "user_1": { name: "Alice Johnson", email: "alice@myapp.com", tier: "enterprise" },
  "user_2": { name: "Bob Smith", email: "bob@myapp.com", tier: "free" },
};

const getUserProfile = experimental_createTool("GET_USER_PROFILE", {
  name: "Get user profile",
  description: "Retrieve the current user's profile from the internal directory",
  inputParams: z.object({}),
  execute: async (_input, ctx) => {
    const profile = profiles[ctx.userId];
    if (!profile) throw new Error(`No profile found for user "${ctx.userId}"`);
    return profile;
  },
});
```

**Bind to a session**

Pass custom tools via the `experimental` option. `session.tools()` returns both remote Composio tools and your custom tools.

TypeScriptPython

```

const session = await composio.create("user_1", {
  experimental: {
    customTools: [getUserProfile],
  },
});

const tools = await session.tools();
```

## [Preloading custom tools](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits\#preloading-custom-tools)

Custom tools are searchable by default. Set `preload: true` / `preload=True` on a
custom tool when it should be returned directly from `session.tools()`. Toolkit
preload applies to all tools in that toolkit; set `preload: false` /
`preload=False` on one tool to opt it out.

TypeScriptPython

```
import { Composio, experimental_createTool } from "@composio/core";
import { OpenAIAgentsProvider } from "@composio/openai-agents";
import { z } from "zod/v3";

const composio = new Composio({
  apiKey: "your_api_key",
  provider: new OpenAIAgentsProvider(),
});

const replyGuide = experimental_createTool("GET_REPLY_STYLE_GUIDE", {
  name: "Get reply style guide",
  description: "Return the team's email reply style guide",
  preload: true,
  inputParams: z.object({
    topic: z.string().describe("Email topic"),
  }),
  execute: async ({ topic }) => ({ topic, tone: "concise and helpful" }),
});

const session = await composio.create("user_1", {
  experimental: {
    customTools: [replyGuide],
  },
});

const tools = await session.tools();
console.log(tools.map((tool) => tool.name));
// LOCAL_GET_REPLY_STYLE_GUIDE
// COMPOSIO_SEARCH_TOOLS
// ... other default meta tools
```

## [Meta tools integration](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits\#meta-tools-integration)

Custom tools work automatically with Composio's meta tools:

| Meta tool | Behavior |
| --- | --- |
| `COMPOSIO_SEARCH_TOOLS` | Includes custom tools in search results, with slight priority for tools that don't require auth |
| `COMPOSIO_GET_TOOL_SCHEMAS` | Returns schemas for custom tools alongside remote tools |
| `COMPOSIO_MULTI_EXECUTE_TOOL` | Runs custom tools in-process while remote tools go to the backend, merging results transparently |
| `COMPOSIO_MANAGE_CONNECTIONS` | Handles auth for extension tools. If a tool extends `gmail`, the agent can prompt the user to connect Gmail |

Custom tools are not supported in the sandbox.

## [Context object (`ctx`)](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits\#context-object-ctx)

Every custom tool's `execute` function receives `(input, ctx)`. Use `ctx` to access the current user, make authenticated API requests, or call other Composio tools.

TypeScriptPython

| Property / Method | Description |
| --- | --- |
| `ctx.userId` | The userID for the current session |
| `ctx.proxyExecute({ toolkit, endpoint, method, body?, parameters? })` | Make an authenticated HTTP request via Composio's auth layer |
| `ctx.execute(toolSlug, args)` | Execute any Composio native tool from within your custom tool |

See the full API in the SDK reference: [TypeScript](https://docs.composio.dev/reference/sdk-reference/typescript/session-context-impl) \| [Python](https://docs.composio.dev/reference/sdk-reference/python/session-context-impl)

## [Verifying registration](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits\#verifying-registration)

Use these methods to list registered tools and toolkits. Slugs include their final `LOCAL_` prefix, and toolkit-scoped tools also include the toolkit slug.

TypeScriptPython

```
const customTools = session.customTools();
const customToolkits = session.customToolkits();
```

## [Reusing a session with custom tools](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits\#reusing-a-session-with-custom-tools)

When [reusing a session](https://docs.composio.dev/docs/how-composio-works#how-sessions-behave) via `composio.use()`, you can attach custom tools at the same time:

TypeScriptPython

```

const session = await composio.use("session_id", {
  customTools: [getUserProfile],
});
```

## [Programmatic execution](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits\#programmatic-execution)

Use `session.execute()` to run custom tools directly, outside of an agent loop. Custom tools execute in-process; remote tools are sent to the backend automatically.

TypeScriptPython

```
const result = await session.execute("GET_USER_PROFILE");
```

## [Best practices](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits\#best-practices)

### [Naming and descriptions](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits\#naming-and-descriptions)

The agent relies on your tool's name and description to decide when to call it. Be specific: "Send weekly promo email" is better than "Send email". Include what the tool does, when to use it, and what it returns.

In TypeScript, use uppercase slugs like `SEND_PROMO_EMAIL`. In Python, slugs are inferred from the function name, so `snake_case` produces clean defaults. You can also pass `slug` and `name` explicitly.

### [Accessing authenticated APIs](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits\#accessing-authenticated-apis)

If your tool calls an API that requires user credentials (Gmail, GitHub, and so on), set `extendsToolkit` / `extends_toolkit` to the toolkit name. Composio handles authentication automatically, and the agent can prompt users to connect their account when needed.

### [Defining inputs in Python](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits\#defining-inputs-in-python)

Your tool's first parameter must be a Pydantic `BaseModel`. The field descriptions become what the agent sees as the input schema, and the function's docstring becomes the tool description. You can override this by passing `description` explicitly.

### [Tool names get prefixed](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits\#tool-names-get-prefixed)

Slugs exposed to the agent are automatically prefixed with `LOCAL_` and the toolkit name (if applicable):

- `GET_USER_PROFILE` becomes `LOCAL_GET_USER_PROFILE`
- `ASSIGN_ROLE` in `USER_MANAGEMENT` becomes `LOCAL_USER_MANAGEMENT_ASSIGN_ROLE`

Your slugs cannot start with `LOCAL_`. This prefix is reserved.

## [Next](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits\#next)

[**Configuring sessions** \\
Filter toolkits and tools, set auth configs, and read tools with session.tools()](https://docs.composio.dev/docs/configuring-sessions)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/extending-sessions/custom-tools-and-toolkits.mdx)

### On this page

[Preloading custom tools](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits#preloading-custom-tools) [Meta tools integration](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits#meta-tools-integration) [Context object (`ctx`)](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits#context-object-ctx) [Verifying registration](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits#verifying-registration) [Reusing a session with custom tools](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits#reusing-a-session-with-custom-tools) [Programmatic execution](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits#programmatic-execution) [Best practices](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits#best-practices) [Naming and descriptions](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits#naming-and-descriptions) [Accessing authenticated APIs](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits#accessing-authenticated-apis) [Defining inputs in Python](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits#defining-inputs-in-python) [Tool names get prefixed](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits#tool-names-get-prefixed) [Next](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits#next)
