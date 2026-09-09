---
url: https://docs.composio.dev/reference/api-reference/files
title: Files | Composio
description: File management
status: 200
---

API Reference

# Files

Copy page

These endpoints handle files that tools read and write during execution. When a tool produces or consumes a file, Composio stores it in object storage and exchanges it through presigned URLs rather than streaming bytes through the API.

You reach for these endpoints to:

- **List files** that tools have generated, optionally filtered by app and action.
- **Request an upload**: get a presigned S3 URL, `PUT` your file to it, then pass the returned reference into a tool's input.

This keeps large payloads out of request bodies. Tools receive a file reference and resolve the underlying object on their side.

File uploads are a two-step flow. Call the upload-request endpoint to mint a presigned URL, then upload the file contents directly to that URL. The API never receives the raw bytes.

If your agent works with files inside a session, prefer the session file mount, where the sandbox exposes uploaded files to running code. See the [remote sandbox](https://docs.composio.dev/docs/sandbox/remote) for the sandbox helpers (`upload_local_file`, `smart_file_extract`) that build on this storage.

These endpoints use your project API key in the `x-api-key` header.

## [Endpoints](https://docs.composio.dev/reference/api-reference/files\#endpoints)

| Endpoint | Quick Link |
| --- | --- |
| `GET /api/v3.1/files/list` | [List files with optional app and action filters](https://docs.composio.dev/reference/api-reference/files/getFilesList) Legacy |
| `POST /api/v3.1/files/upload/request` | [Create presigned URL for request file upload to S3](https://docs.composio.dev/reference/api-reference/files/postFilesUploadRequest) |

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/api-reference/files/index.mdx)

### On this page

[Endpoints](https://docs.composio.dev/reference/api-reference/files#endpoints)
