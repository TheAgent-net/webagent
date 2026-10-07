---
url: https://docs.composio.dev/kb/guide/platform-file-storage
title: File Download Storage and Expiry | Composio
description: Public guidance for staged files, signed download URLs, retention, and size questions.
status: 200
---

Guides

Browse Knowledge Base

# File Download Storage and Expiry

Copy page

## [Composio file URLs are short-lived staged downloads](https://docs.composio.dev/kb/guide/platform-file-storage\#composio-file-urls-are-short-lived-staged-downloads)

When a hosted tool returns a file URL such as `data.file.s3url`, Composio normally stages the bytes in Composio-managed object storage and returns a signed download URL rather than the provider's original URL.

The default signed-URL lifetime is one hour and can be configured for a project through its File TTL setting. Staged files are cleaned up after 24 hours. URL expiry and file cleanup are separate: rerun the tool or download the file again to obtain a fresh URL.

There is no single customer-facing maximum that applies to every tool. Provider limits, the action implementation, runtime memory, and timeouts can impose lower limits, so check the exact action before quoting a hard cap.

Last verified Aug 12, 2026

Feedback

### On this page

[Composio file URLs are short-lived staged downloads](https://docs.composio.dev/kb/guide/platform-file-storage#composio-file-urls-are-short-lived-staged-downloads)
