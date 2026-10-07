---
url: https://docs.composio.dev/reference/sdk-reference/typescript/session
title: Session | Composio
description: A Composio session — the object returned by `composio.sessions.create(...)` and `composio.sessions.use(...)` (also reachable via the top-level `composio.create(...)` / `composio.use(...)` aliases).  This is the canonical session surface. Use it to fetch session-scoped tools, authorize toolkits, search, and execute tools. The public return type is `Session` (with `mcp` surfaced, returned when `{ mcp: true }` is passed) or `SessionWithoutMcp` (the default, with `mcp` omitted from the type); this class is the concrete runtime form behind both.
status: 200
---

SDK Reference [TypeScript SDK](https://docs.composio.dev/reference/sdk-reference/typescript)

# Session

Copy page

## [Properties](https://docs.composio.dev/reference/sdk-reference/typescript/session\#properties)

| Name | Type | Description |
| --- | --- | --- |
| `configVersion` | `number` |  |
| `experimental` | `SessionExperimental` |  |
| `mcp` | `\{ headers?: Record<string, string>; type: 'http' | 'sse'; url: string \}` | Hosted MCP endpoint (`session.mcp.url` / `session.mcp.headers`). Exists on every session at runtime, but only surfaced in the type when the session is created with `\{ mcp: true \}` (which returns `Session`); the default `SessionWithoutMcp` omits `mcp`, so MCP is an explicit opt-in. See [https://docs.composio.dev/docs/sessions-via-mcp](https://docs.composio.dev/docs/sessions-via-mcp) |
| `preload` | `Preload` |  |
| `sandbox` | `Workbench` | Resolved sandbox (code-execution) config returned by the API. `enable` defaults to `true` server-side. |
| `sessionId` | `string` |  |
| `warnings` | `Warning[]` |  |

## [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/session\#methods)

### [authorize()](https://docs.composio.dev/reference/sdk-reference/typescript/session\#authorize)

Initiate an authorization flow for a toolkit.
Returns a ConnectionRequest with a redirect URL for the user.

Pass `experimental: { accountType: 'SHARED', aclConfigForShared }` to
create a SHARED connection with a per-user ACL in one flow. Default
behaviour (omit the block) creates a PRIVATE connection.

Experimental — shape may change in future releases.

`aclConfigForShared` is validated against the same caps as
`composio.connectedAccounts.link()` (≤1000 entries per list, each
`userId` 1..256 characters). Invalid input throws `ValidationError`
at the SDK boundary.

```
async authorize(toolkit: string, options?: { callbackUrl?: string; alias?: string; experimental?: { accountType?: ConnectedAccountType; aclConfigForShared?: ConnectedAccountAclConfig; }; }, requestOptions?: ComposioRequestOptions): Promise<ConnectionRequest>
```

**Parameters**

| Name | Type |
| --- | --- |
| `toolkit` | `string` |
| `options?` | `\{ callbackUrl?: string; alias?: string; experimental?: \{ accountType?: ConnectedAccountType; aclConfigForShared?: ConnectedAccountAclConfig; \}; \}` |
| `requestOptions?` | `ComposioRequestOptions` |

**Returns**

`Promise<ConnectionRequest>`

* * *

### [customToolkits()](https://docs.composio.dev/reference/sdk-reference/typescript/session\#customtoolkits)

List all custom toolkits registered in this session.
Returns toolkits with their tools showing final slugs.

```
customToolkits(): RegisteredCustomToolkit[]
```

**Returns**

`RegisteredCustomToolkit[]` — Array of registered custom toolkits

* * *

### [customTools()](https://docs.composio.dev/reference/sdk-reference/typescript/session\#customtools)

List all custom tools registered in this session.
Returns tools with their final slugs, schemas, and resolved toolkit.

```
customTools(options?: { toolkit?: string }): RegisteredCustomTool[]
```

**Parameters**

| Name | Type |
| --- | --- |
| `options?` | `\{ toolkit?: string \}` |

**Returns**

`RegisteredCustomTool[]` — Array of registered custom tools

* * *

### [delete()](https://docs.composio.dev/reference/sdk-reference/typescript/session\#delete)

Delete this session.

Deleted sessions immediately stop being retrievable or executable. Deleting
an already-deleted session surfaces the backend 404.

```
async delete(requestOptions?: ComposioRequestOptions): Promise<ToolRouterSessionDeleteResponse>
```

**Parameters**

| Name | Type |
| --- | --- |
| `requestOptions?` | `ComposioRequestOptions` |

**Returns**

`Promise<ToolRouterSessionDeleteResponse>`

* * *

### [execute()](https://docs.composio.dev/reference/sdk-reference/typescript/session\#execute)

Execute a tool within the session.

For custom tools, accepts the full slug (e.g. "LOCAL\_GREP") or the
original slug (e.g. "GREP") when that original slug is unique across
the session's custom tools and toolkits. Custom tools are executed
in-process; remote tools are sent to the Composio backend.

```
async execute(toolSlug: string, arguments_?: Record<string, unknown>, options?: ToolRouterSessionExecuteOptions, requestOptions?: ComposioRequestOptions): Promise<ToolRouterSessionExecuteResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `toolSlug` | `string` | The tool slug to execute |
| `arguments_?` | `Record<string, unknown>` | Optional tool arguments |
| `options?` | `ToolRouterSessionExecuteOptions` | Optional execution options |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ToolRouterSessionExecuteResponse>` — The tool execution result

* * *

### [proxyExecute()](https://docs.composio.dev/reference/sdk-reference/typescript/session\#proxyexecute)

Proxy an API call through Composio's auth layer using the session's connected account.
The backend resolves the connected account from the toolkit within the session.

```
async proxyExecute(params: SessionProxyExecuteParams, requestOptions?: ComposioRequestOptions): Promise<ToolRouterSessionProxyExecuteResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `params` | `SessionProxyExecuteParams` | Proxy request parameters (toolkit, endpoint, method, body, headers/query params) |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ToolRouterSessionProxyExecuteResponse>` — The proxied API response with status, data, headers

* * *

### [search()](https://docs.composio.dev/reference/sdk-reference/typescript/session\#search)

Search for tools by semantic use case.
Returns relevant tools for the given query with schemas and guidance.

```
async search(params: { query: string; toolkits?: string[]; }, requestOptions?: ComposioRequestOptions): Promise<ToolRouterSessionSearchResponse>
```

**Parameters**

| Name | Type |
| --- | --- |
| `params` | `\{ query: string; toolkits?: string[]; \}` |
| `requestOptions?` | `ComposioRequestOptions` |

**Returns**

`Promise<ToolRouterSessionSearchResponse>`

* * *

### [toolkits()](https://docs.composio.dev/reference/sdk-reference/typescript/session\#toolkits)

Query the connection state of toolkits in the session.
Supports pagination and filtering by toolkit slugs.

```
async toolkits(options?: ToolRouterToolkitsOptions, requestOptions?: ComposioRequestOptions): Promise<{ cursor: string | undefined; items: { connection?: { authConfig?: ... | ...; connectedAccount?: { id: ...; status: ... }; isActive: boolean }; isNoAuth: boolean; logo?: string; name: string; slug: string }[]; totalPages: number }>
```

**Parameters**

| Name | Type |
| --- | --- |
| `options?` | `ToolRouterToolkitsOptions` |
| `requestOptions?` | `ComposioRequestOptions` |

**Returns**

`Promise<\{ cursor: string \| undefined; items: \{ connection?: \{ authConfig?: ... \| ...; connectedAccount?: \{ id: ...; status: ... \}; isActive: boolean \}; isNoAuth: boolean; logo?: string; name: string; slug: string \}[]; totalPages: number \}>`

* * *

### [tools()](https://docs.composio.dev/reference/sdk-reference/typescript/session\#tools)

Get the tools available in the session, formatted for your AI framework.
Requires a provider to be configured in the Composio constructor.

When custom tools are bound to the session, execution of COMPOSIO\_MULTI\_EXECUTE\_TOOL
is intercepted: local tools are executed in-process, remote tools are sent to the backend.

```
async tools(modifiers?: SessionMetaToolOptions, requestOptions?: ComposioRequestOptions): Promise<ReturnType<TProvider['wrapTools']>>
```

**Parameters**

| Name | Type |
| --- | --- |
| `modifiers?` | `SessionMetaToolOptions` |
| `requestOptions?` | `ComposioRequestOptions` |

**Returns**

`Promise<ReturnType<TProvider['wrapTools']>>`

* * *

### [update()](https://docs.composio.dev/reference/sdk-reference/typescript/session\#update)

Partially update the session configuration.
Only the fields provided will be changed; omitted fields are preserved.
Mutates this session's `configVersion`, `preload`, and `warnings` in-place.

```
async update(config: ToolRouterUpdateSessionConfig, requestOptions?: ComposioRequestOptions): Promise<void>
```

**Parameters**

| Name | Type |
| --- | --- |
| `config` | `ToolRouterUpdateSessionConfig` |
| `requestOptions?` | `ComposioRequestOptions` |

**Returns**

`Promise<void>`

* * *

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/sdk-reference/typescript/session.mdx)

### On this page

[Properties](https://docs.composio.dev/reference/sdk-reference/typescript/session#properties) [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/session#methods) [authorize()](https://docs.composio.dev/reference/sdk-reference/typescript/session#authorize) [customToolkits()](https://docs.composio.dev/reference/sdk-reference/typescript/session#customtoolkits) [customTools()](https://docs.composio.dev/reference/sdk-reference/typescript/session#customtools) [delete()](https://docs.composio.dev/reference/sdk-reference/typescript/session#delete) [execute()](https://docs.composio.dev/reference/sdk-reference/typescript/session#execute) [proxyExecute()](https://docs.composio.dev/reference/sdk-reference/typescript/session#proxyexecute) [search()](https://docs.composio.dev/reference/sdk-reference/typescript/session#search) [toolkits()](https://docs.composio.dev/reference/sdk-reference/typescript/session#toolkits) [tools()](https://docs.composio.dev/reference/sdk-reference/typescript/session#tools) [update()](https://docs.composio.dev/reference/sdk-reference/typescript/session#update)
