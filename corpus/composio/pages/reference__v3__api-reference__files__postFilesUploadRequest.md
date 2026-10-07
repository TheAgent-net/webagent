---
url: https://docs.composio.dev/reference/v3/api-reference/files/postFilesUploadRequest
title: Create presigned URL for request file upload to S3 | Composio
description: Generates a presigned URL for uploading a file to S3. This endpoint handles deduplication by checking if a file with the same MD5 hash already exists.
status: 200
---

API Reference [Files](https://docs.composio.dev/reference/v3/api-reference/files)

# Create presigned URL for request file upload to S3v3.0

Copy page

Server URL`https://backend.composio.dev/`

POST

``/`api`/`v3`/`files`/`upload`/`request`

Send

Authorization

Body

Generates a presigned URL for uploading a file to S3. This endpoint handles deduplication by checking if a file with the same MD5 hash already exists.

## [Authorization](https://docs.composio.dev/reference/v3/api-reference/files/postFilesUploadRequest\#authorization)

`ApiKeyAuth`

x-api-key<token>

Project API key authentication

In: `header`

## [Request Body](https://docs.composio.dev/reference/v3/api-reference/files/postFilesUploadRequest\#request-body)

`application/json`

toolkit\_slugstringRequired

Slug of the app where this file belongs to. Example: "gmail", "slack", "github"

tool\_slugstringRequired

Slug of the action where this file belongs to. Example: "GMAIL\_SEND\_EMAIL", "SLACK\_UPLOAD\_FILE"

filenamestringRequired

Name of the original file. Example: "quarterly\_report.pdf"

mimetypestringRequired

Mime type of the original file. Example: "application/pdf", "image/png"

md5stringRequired

MD5 hash of the file for deduplication and integrity verification. Example: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"

## [Response Body](https://docs.composio.dev/reference/v3/api-reference/files/postFilesUploadRequest\#response-body)

### 200  `application/json`

### 400  `application/json`

### 401  `application/json`

### 403  `application/json`

### 404  `application/json`

### 410  `application/json`

### 429  `application/json`

### 500  `application/json`

### 501  `application/json`

Gmail Email Attachment

cURL

JavaScript

Go

Python

Java

C#

Rust

```
curl -X POST "https://backend.composio.dev/api/v3/files/upload/request" \  -H "x-api-key: " \  -H "Content-Type: application/json" \  -d '{    "toolkit_slug": "gmail",    "tool_slug": "GMAIL_SEND_EMAIL",    "filename": "quarterly_report.pdf",    "mimetype": "application/pdf",    "md5": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"  }'
```

200400401403404410429500501

```
{  "id": "string",  "key": "string",  "new_presigned_url": "string",  "newPresignedUrl": "string",  "type": "new",  "metadata": {    "storage_backend": "s3"  }}
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/v3/api-reference/files/postFilesUploadRequest.mdx)
