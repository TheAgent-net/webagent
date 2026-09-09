---
url: https://docs.composio.dev/reference/sdk-reference/typescript/remote-file
title: RemoteFile | Composio
description: Represents a file stored in a tool router session's file mount. Provides methods to fetch, save, and work with the file content.
status: 200
---

SDK Reference [TypeScript SDK](https://docs.composio.dev/reference/sdk-reference/typescript)

# RemoteFile

Copy page

## [Usage](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file\#usage)

Access this class through the `composio.remoteFile` property:

```
const composio = new Composio({ apiKey: 'your-api-key' });
const result = await composio.remoteFile.list();
```

## [Properties](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file\#properties)

| Name | Type | Description |
| --- | --- | --- |
| `downloadUrl` | `string` | Presigned URL for downloading the file |
| `expiresAt` | `string` | ISO 8601 timestamp when the download URL expires |
| `mountRelativePath` | `string` | Relative path within the mount (e.g. "report.pdf") |
| `sandboxMountPrefix` | `string` | Absolute mount path inside the sandbox (e.g. /mnt/files) |

## [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file\#methods)

### [blob()](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file\#blob)

Fetches the file content as a Blob.

```
async blob(): Promise<Blob>
```

**Returns**

`Promise<Blob>` — The file content as a Blob

* * *

### [buffer()](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file\#buffer)

Fetches the file content as a buffer.

```
async buffer(): Promise<Uint8Array>
```

**Returns**

`Promise<Uint8Array>` — The file content as a Uint8Array

* * *

### [save()](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file\#save)

Downloads and saves the file to the local filesystem.
Requires a Node.js runtime with file system support (not available in Cloudflare Workers/Edge).

```
async save(path?: string): Promise<string>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `path?` | `string` | Local path to save the file. If omitted, saves to the Composio temp directory using the filename from the mount path. |

**Returns**

`Promise<string>` — The absolute path where the file was saved

* * *

### [text()](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file\#text)

Fetches the file content as UTF-8 text.

```
async text(): Promise<string>
```

**Returns**

`Promise<string>` — The file content as a string

* * *

### [parse()](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file\#parse)

Parses an API response (snake\_case) and returns a RemoteFile instance.

```
parse(data: unknown): RemoteFile
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `unknown` | Raw API response with snake\_case keys |

**Returns**

`RemoteFile` — A RemoteFile instance

* * *

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/sdk-reference/typescript/remote-file.mdx)

### On this page

[Usage](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file#usage) [Properties](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file#properties) [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file#methods) [blob()](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file#blob) [buffer()](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file#buffer) [save()](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file#save) [text()](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file#text) [parse()](https://docs.composio.dev/reference/sdk-reference/typescript/remote-file#parse)
