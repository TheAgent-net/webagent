---
url: https://docs.composio.dev/reference/sdk-reference/typescript
title: TypeScript SDK Reference | Composio
description: Complete API reference for the Composio TypeScript SDK (@composio/core).
status: 200
---

SDK Reference

# TypeScript SDK Reference

Copy page

## [Installation](https://docs.composio.dev/reference/sdk-reference/typescript\#installation)

```
npm install @composio/core
```

## [Classes](https://docs.composio.dev/reference/sdk-reference/typescript\#classes)

| Class | Description |
| --- | --- |
| [`Composio`](https://docs.composio.dev/reference/sdk-reference/typescript/composio) | This is the core class for Composio. |
| [`AuthConfigs`](https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs) | AuthConfigs class |
| [`ConnectedAccounts`](https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts) | ConnectedAccounts class |
| [`Experimental`](https://docs.composio.dev/reference/sdk-reference/typescript/experimental) | Experimental API |
| [`MCP`](https://docs.composio.dev/reference/sdk-reference/typescript/mcp) | MCP (Model Control Protocol) class |
| [`RemoteFile`](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file) | Represents a file stored in a tool router session's file mount. |
| [`Sessions`](https://docs.composio.dev/reference/sdk-reference/typescript/sessions) | First-class API for creating and reusing Composio sessions. |
| [`Toolkits`](https://docs.composio.dev/reference/sdk-reference/typescript/toolkits) | Toolkits class |
| [`Session`](https://docs.composio.dev/reference/sdk-reference/typescript/session) | A Composio session — the object returned by `composio.sessions.create(...)` |
| [`Session files`](https://docs.composio.dev/reference/sdk-reference/typescript/session-files) | File mount for a Composio session, reached via `session.experimental.files` |
| [`Tools`](https://docs.composio.dev/reference/sdk-reference/typescript/tools) | This class is used to manage tools in the Composio SDK. |
| [`Triggers`](https://docs.composio.dev/reference/sdk-reference/typescript/triggers) | Trigger (Instance) class |

## [Quick Start](https://docs.composio.dev/reference/sdk-reference/typescript\#quick-start)

```
import { Composio } from '@composio/core';

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY
});

// Get tools for a user
const tools = await composio.tools.get('user-123', {
  toolkits: ['github']
});

// Execute a tool
const result = await composio.tools.execute('GITHUB_GET_REPOS', {
  userId: 'user-123',
  arguments: { owner: 'composio' }
});
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/sdk-reference/typescript/index.mdx)

### On this page

[Installation](https://docs.composio.dev/reference/sdk-reference/typescript#installation) [Classes](https://docs.composio.dev/reference/sdk-reference/typescript#classes) [Quick Start](https://docs.composio.dev/reference/sdk-reference/typescript#quick-start)
