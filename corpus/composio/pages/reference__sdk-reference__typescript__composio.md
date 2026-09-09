---
url: https://docs.composio.dev/reference/sdk-reference/typescript/composio
title: Composio | Composio
description: This is the core class for Composio. It is used to initialize the Composio SDK and provide a global configuration.
status: 200
---

SDK Reference [TypeScript SDK](https://docs.composio.dev/reference/sdk-reference/typescript)

# Composio

Copy page

## [Constructor](https://docs.composio.dev/reference/sdk-reference/typescript/composio\#constructor)

### [constructor()](https://docs.composio.dev/reference/sdk-reference/typescript/composio\#constructor-1)

Creates a new instance of the Composio SDK.

The constructor initializes the SDK with the provided configuration options,
sets up the API client, and initializes all core models (tools, toolkits, etc.).

```
constructor(config?: ComposioConfig): Composio
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `config?` | `ComposioConfig` | Configuration options for the Composio SDK |

**Returns**

`Composio`

**Example**

```
// Initialize with default configuration
const composio = new Composio();

// Initialize with custom API key and base URL
const composio = new Composio({
  apiKey: 'your-api-key',
  baseURL: 'https://api.composio.dev'
});

// Initialize with custom provider
const composio = new Composio({
  apiKey: 'your-api-key',
  provider: new CustomProvider()
});
```

* * *

## [Properties](https://docs.composio.dev/reference/sdk-reference/typescript/composio\#properties)

| Name | Type | Description |
| --- | --- | --- |
| `authConfigs` | `AuthConfigs` | Manage authentication configurations for toolkits |
| `connectedAccounts` | `ConnectedAccounts` | Manage authenticated connections |
| `create` | `(userId: string, config: \{ authConfigs?: Record<string, string>; connectedAccounts?: Record<string, string | ...[]>; experimental?: \{ assistivePrompt?: \{ userTimezone?: string \}; customToolkits?: CustomToolkit[]; customTools?: CustomTool[] \}; manageConnections?: boolean | \{ callbackUrl?: string; enable?: boolean; waitForConnections?: boolean \}; mcp?: boolean; multiAccount?: \{ enable: boolean; maxAccountsPerToolkit?: number; requireExplicitSelection?: boolean \}; preload?: \{ tools?: ...[] | 'all' \}; sandbox?: \{ autoOffloadThreshold?: number; enable: boolean; enableProxyExecution?: boolean; sandboxSize?: 'standard' | 'medium' | 'large' | 'xlarge' \}; sessionPreset?: 'direct_tools'; tags?: ... | ... | ... | ...[] | \{ disable?: ...[]; enable?: ...[] \}; toolkits?: string[] | \{ disable: ...[] \} | \{ enable: ...[] \}; tools?: Record<string, ...[] | \{ enable: ... \} | \{ disable: ... \} | \{ tags: ... \}>; workbench?: \{ autoOffloadThreshold?: number; enable: boolean; enableProxyExecution?: boolean; sandboxSize?: 'standard' | 'medium' | 'large' | 'xlarge' \} \} & \{ mcp: true \}, requestOptions: ComposioRequestOptions) => Promise<Session>` | Creates a new tool router session for a user. |
| Use `sessionPreset: SessionPreset.DIRECT_TOOLS` when all needed tools |  |  |
| should be exposed directly; see `ToolRouterCreateSessionConfig`. |  |  |
| `experimental` | `Experimental` | Experimental SDK methods whose shape may change in future releases. |
| Prefer domain-specific mounts (for example |  |  |
| `composio.connectedAccounts.updateAcl(...)`) when available; this |  |  |
| namespace keeps compatibility aliases while APIs are experimental. |  |  |
| Stateless experimental factories (e.g. `experimental_createTool`) stay |  |  |
| at the top level. |  |  |
| `files` | `Files` | Upload and download files |
| `mcp` | `MCP` | Model Context Protocol server management. |
| `provider` | `TProvider` | The tool provider instance used for wrapping tools in framework-specific formats |
| `sessions` | `Sessions` | Create and reuse Composio sessions. |

Prefer `composio.sessions.create(...)` for new code. The top-level
`composio.create(...)` method is kept as an alias. \|
\| `toolkits` \| `Toolkits` \| Retrieve toolkit metadata and authorize user connections \|
\| `toolRouter` \| `ToolRouter` \| Legacy alias for `composio.sessions`. \|
\| `tools` \| `Tools` \| List, retrieve, and execute tools \|
\| `triggers` \| `Triggers` \| Manage webhook triggers and event subscriptions \|
\| `use` \| `(id: string, options: \{ customToolkits?: CustomToolkit[]; customTools?: CustomTool[]; mcp: true \}, requestOptions: ComposioRequestOptions) => Promise<Session>` \| Use an existing tool router session \|

## [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/composio\#methods)

### [createSession() (deprecated)](https://docs.composio.dev/reference/sdk-reference/typescript/composio\#createsession-deprecated)

Deprecated

Will be removed in a future version of the SDK. Instead, construct a new
instance directly with the headers you need: `new Composio(\{ ...existingConfig, defaultHeaders \})`.
For one-off overrides, pass per-call `requestOptions` where supported.

Creates a new instance of the Composio SDK with custom request options while preserving the existing configuration.
This method is particularly useful when you need to:

- Add custom headers for specific requests
- Track request contexts with unique identifiers
- Override default request behavior for a subset of operations

The new instance inherits all configuration from the parent instance (apiKey, baseURL, provider, etc.)
but allows you to specify custom request options that will be used for all API calls made through this session.

```
createSession(options?: { headers?: ComposioRequestHeaders }): Composio
```

**Parameters**

| Name | Type |
| --- | --- |
| `options?` | `\{ headers?: ComposioRequestHeaders \}` |

**Returns**

`Composio` — A new Composio instance with the custom request options applied.

**Example**

```
// Create a base Composio instance
const composio = new Composio({
  apiKey: 'your-api-key'
});

// Create a session with request tracking headers
const composioWithCustomHeaders = composio.createSession({
  headers: {
    'x-request-id': '1234567890',
    'x-correlation-id': 'session-abc-123',
    'x-custom-header': 'custom-value'
  }
});

// Use the session for making API calls with the custom headers
await composioWithCustomHeaders.tools.list();
```

* * *

### [flush()](https://docs.composio.dev/reference/sdk-reference/typescript/composio\#flush)

Flush any pending telemetry and wait for it to complete.

In Node.js-compatible environments, telemetry is automatically flushed on process exit.
However, in environments like Cloudflare Workers that don't support process exit events,
you should call this method manually to ensure all telemetry is sent.

```
async flush(): Promise<void>
```

**Returns**

`Promise<void>` — A promise that resolves when all pending telemetry has been sent.

**Example**

```
// In a Cloudflare Worker, use ctx.waitUntil to ensure telemetry is flushed
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const composio = new Composio({ apiKey: env.COMPOSIO_API_KEY });

    // Do your work...
    const result = await composio.tools.execute(...);

    // Ensure telemetry flushes before worker terminates
    ctx.waitUntil(composio.flush());

    return new Response(JSON.stringify(result));
  }
};
```

* * *

### [getClient()](https://docs.composio.dev/reference/sdk-reference/typescript/composio\#getclient)

Get the Composio SDK client.

```
getClient(): ComposioClient
```

**Returns**

`ComposioClient` — The Composio API client.

* * *

### [getConfig()](https://docs.composio.dev/reference/sdk-reference/typescript/composio\#getconfig)

Get the configuration SDK is initialized with.

Returns a frozen shallow clone — the SDK has already snapshotted
configuration values such as `dangerouslyAllowAutoUploadDownloadFiles`,
`fileUploadDirs`, and `fileDownloadDir` into its internal models, so
mutating the live config object would silently no-op. Freezing makes
that contract visible at the call site instead of letting the mutation
appear successful.

```
getConfig(): Readonly<ComposioConfig>
```

**Returns**

`Readonly<ComposioConfig>` — The frozen configuration
the SDK is initialized with.

* * *

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/sdk-reference/typescript/composio.mdx)

### On this page

[Constructor](https://docs.composio.dev/reference/sdk-reference/typescript/composio#constructor) [constructor()](https://docs.composio.dev/reference/sdk-reference/typescript/composio#constructor-1) [Properties](https://docs.composio.dev/reference/sdk-reference/typescript/composio#properties) [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/composio#methods) [createSession() (deprecated)](https://docs.composio.dev/reference/sdk-reference/typescript/composio#createsession-deprecated) [flush()](https://docs.composio.dev/reference/sdk-reference/typescript/composio#flush) [getClient()](https://docs.composio.dev/reference/sdk-reference/typescript/composio#getclient) [getConfig()](https://docs.composio.dev/reference/sdk-reference/typescript/composio#getconfig)
