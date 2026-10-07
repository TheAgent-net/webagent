---
url: https://docs.composio.dev/docs/providers/eve
title: Eve | Composio
description: Use Composio tools inside eve agents.
status: 200
---

[SDKs and frameworks](https://docs.composio.dev/docs/providers)

Experimental

# Eve

Copy page

The eve provider adapts Composio tools for the [eve](https://github.com/vercel/eve) agent framework. With `EveProvider` registered, `session.tools()` returns eve-native `defineTool`s, so an eve agent gets the Tool Router meta-tools and any preloaded custom toolkits from one call. The provider also ships a `(ctx, next)` hook interface to intercept, allow, deny, or rewrite meta-tool calls before the model sees the result.

The eve provider is experimental and currently ships from `@composio/experimental` for TypeScript
projects.

## [Usage](https://docs.composio.dev/docs/providers/eve\#usage)

eve owns the agent loop and discovers tools from files, so you register the provider on the Composio client and expose the session's tools from a file under `agent/tools/`.

**Install**

```
npm install @composio/core @composio/experimental eve @ai-sdk/openai
```

This walkthrough uses OpenAI directly as one concrete model provider. OpenAI is only an example:
you can use any model provider supported by eve by installing its AI SDK package and configuring
the corresponding credential.

**Configure credentials**

.env.local

```
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```

`COMPOSIO_API_KEY` authenticates Composio tools. `OPENAI_API_KEY` authenticates the model call
directly with OpenAI; this setup does not route through Vercel AI Gateway.

**Configure the eve model**

agent/agent.ts

```
import { openai } from '@ai-sdk/openai';
import { defineAgent } from 'eve';

export default defineAgent({
  model: openai('gpt-5.4-mini'),
});
```

To use another provider, replace `@ai-sdk/openai`, `OPENAI_API_KEY`, and `openai(...)` with the
equivalent package, credential, and model factory supported by eve. Passing a provider model object
calls that provider directly; an eve string model ID such as `openai/gpt-5.4-mini` uses Vercel AI
Gateway instead.

**Register the provider and create a session**

agent/session.ts

```
import { Composio } from '@composio/core';
import { EveProvider } from '@composio/experimental/eve';

const composio = new Composio({ provider: new EveProvider() });

export const session = composio.sessions.create('user_123', {
  toolkits: ['github', 'hackernews'], // optional: scope the session to specific apps
});
```

**Expose the tools to eve**

agent/tools/composio.ts

```
import { defineComposioTools } from '@composio/experimental/eve';
import { session } from '../session';

export default defineComposioTools(session);
```

`defineComposioTools(session)` returns a `step.started` dynamic resolver and memoizes `session.tools()`. It resolves on every step so a resolver form re-evaluates the current principal and a failed fetch can retry on the next step; the result is cached per resolved Composio session, so a fixed session's tool set stays stable. For a multi-user channel, pass a resolver instead: `defineComposioTools((ctx) => sessionFor(ctx.session.auth.current?.principalId))`.

Your agent now has the Tool Router meta-tools (`COMPOSIO_SEARCH_TOOLS`, `COMPOSIO_MULTI_EXECUTE_TOOL`, `COMPOSIO_MANAGE_CONNECTIONS`) plus any preloaded custom toolkits, with auth handled in chat.

eve's `defineTool` takes plain JSON Schema, so `EveProvider` passes Composio's `inputParameters`
straight through. It does not convert to a zod schema, which would trip eve's dynamic-tool
normalizer.

eve requires every dynamic tool to carry a durable descriptor for its callbacks, and its build transform only stamps one on tools authored in your own source. `EveProvider` stamps its own, so its tools are accepted as they are: each callback persists only the tool slug and an id for the resolve that produced it, and `EveProvider` re-attaches it to that resolve's Composio executor when a parked or replayed call resumes. The binding lives only in the process that resolved the tools, so a call parked across a process restart cannot be replayed: eve surfaces the error rather than running it against a different session.

## [Hooks](https://docs.composio.dev/docs/providers/eve\#hooks)

Pass a `hooks` object to the constructor to wrap the Tool Router meta-tools. Each hook is `(ctx, next)`: `await next()` runs the default behavior, returning a value replaces what the model sees, and `ctx.deny(reason)` blocks the call. `ctx.request` is mutable; `ctx.context` is read-only.

```
import { EveProvider } from '@composio/experimental/eve';

const provider = new EveProvider({
  hooks: {
    search: (ctx, next) => {
      ctx.request.args.toolkits = ['github'];
      return next();
    },
    remoteBash: async (ctx, next) => {
      if (String(ctx.request.args.command ?? '').includes('rm -rf')) {
        return ctx.deny('Destructive commands are blocked.');
      }
      return next();
    },
    onAuthLink: async (ctx, next) => {
      await sendConnectionLinkToUser(ctx.url);
      return next();
    },
  },
});
```

Available hooks, each keyed on `EveProviderHooks`:

| Hook | Wraps |
| --- | --- |
| `search` | `COMPOSIO_SEARCH_TOOLS` |
| `manageConnections` | `COMPOSIO_MANAGE_CONNECTIONS` |
| `execute` | `COMPOSIO_MULTI_EXECUTE_TOOL` and `COMPOSIO_EXECUTE_TOOL` |
| `remoteWorkbench` | `COMPOSIO_REMOTE_WORKBENCH` |
| `remoteBash` | `COMPOSIO_REMOTE_BASH_TOOL` |
| `onAuthLink` | Any auth link found in a result |

`ctx.request` carries the meta-tool's raw `{ slug, args }`, and `ctx.deny` is also exported as `denyEveToolCall(reason)`.

### [Require approval](https://docs.composio.dev/docs/providers/eve\#require-approval)

Map Composio tools onto eve's durable approval flow with `needsApproval`. The callback receives the original Composio tool plus eve's approval context:

```
import { EveProvider, requireApprovalForTools } from '@composio/experimental/eve';

const provider = new EveProvider({
  needsApproval: requireApprovalForTools('LOCAL_IMESSAGE_SEND'),
});
```

When this returns `true`, eve pauses before execution and asks the user to approve the call. `requireApprovalForTools` protects both direct calls and matching entries inside `COMPOSIO_MULTI_EXECUTE_TOOL`. Use an exact slug allowlist for side-effecting tools rather than approving every tool in a toolkit.

## [Next](https://docs.composio.dev/docs/providers/eve\#next)

[**iMessage on eve** \\
A full example: a custom toolkit for local iMessage plus the eve provider, on one session.](https://docs.composio.dev/examples/imessage-agent) [**What is a session?** \\
How sessions scope users, tools, and auth, and how to reuse them across requests.](https://docs.composio.dev/docs/how-composio-works)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/providers/eve.mdx)

### On this page

[Usage](https://docs.composio.dev/docs/providers/eve#usage) [Hooks](https://docs.composio.dev/docs/providers/eve#hooks) [Require approval](https://docs.composio.dev/docs/providers/eve#require-approval) [Next](https://docs.composio.dev/docs/providers/eve#next)
