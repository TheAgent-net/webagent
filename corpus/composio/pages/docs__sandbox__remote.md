---
url: https://docs.composio.dev/docs/sandbox/remote
title: Remote sandbox | Composio
description: A persistent Python sandbox where your agent writes code, calls tools programmatically, and processes data
status: 200
---

Sandboxes

# Remote sandbox

Copy page

The **sandbox** is a persistent Python environment where your agent writes and executes code. It has programmatic access to all Composio tools, plus helper functions for calling LLMs, uploading files, and making API requests. State persists across calls within a [session](https://docs.composio.dev/docs/how-composio-works). Your agent runs code in it through the `COMPOSIO_REMOTE_WORKBENCH` meta tool, and shell commands through `COMPOSIO_REMOTE_BASH_TOOL`.

Renamed from workbench

This feature used to be called the **workbench**. The preferred session config key is now `sandbox`, but `workbench` still works as a fully supported alias, in both SDKs and on the wire. It isn't deprecated, so existing code keeps running unchanged. The `COMPOSIO_REMOTE_WORKBENCH` and `COMPOSIO_REMOTE_BASH_TOOL` meta tools keep their names.

Composio doesn't run or replace your agent

Your agent and its model stay entirely yours — Composio never proxies your LLM or runs an agent on your behalf. It discovers, authenticates, and executes tools. The one place Composio itself can call a model is _inside the sandbox_, and only when your code opts in — most directly through the [`invoke_llm`](https://docs.composio.dev/docs/sandbox/remote#built-in-helpers) helper. That optional, sandbox-only usage is the sole source of any Composio-side **LLM tokens**. The sandbox is opt-in per [session](https://docs.composio.dev/docs/configuring-sessions) via `sandbox: { enable: true }` — don't enable it (or simply never call `invoke_llm`) and Composio uses no LLM tokens at all.

## [Where it fits](https://docs.composio.dev/docs/sandbox/remote\#where-it-fits)

Use the sandbox when a task is too complex for individual tool calls. Your agent starts with [`SEARCH_TOOLS` to find the right tools, then uses `MULTI_EXECUTE`](https://docs.composio.dev/docs/how-composio-works#meta-tools) for straightforward calls. When the task involves bulk operations, data transformations, or multi-step logic, the agent reaches for `COMPOSIO_REMOTE_WORKBENCH` instead.

session.sandboxmeta tools

U

“Triage my emails, label the urgent ones, and log them to a Google Sheet.”

01

`SEARCH_TOOLS`

Discovers the Gmail and Sheets tools

02

`MULTI_EXECUTE`

Fetches the unread emails

03

`REMOTE_WORKBENCH`

Classifies, labels, and logs to the sheet in parallel

emails triaged, labeled, and logged

## [What the sandbox provides](https://docs.composio.dev/docs/sandbox/remote\#what-the-sandbox-provides)

### [Built-in helpers](https://docs.composio.dev/docs/sandbox/remote\#built-in-helpers)

These functions are pre-initialized in every sandbox, so your agent can call them without any setup:

| Helper | What it does |
| --- | --- |
| `run_composio_tool` | Execute any Composio tool (e.g., `GMAIL_SEND_EMAIL`, `SLACK_SEND_MESSAGE`) and get structured results |
| `invoke_llm` | Call an LLM for classification, summarization, content generation, or data extraction |
| `upload_local_file` | Upload generated files (reports, CSVs, images) to cloud storage and get a download URL |
| `proxy_execute` | Make direct API calls to connected services when no pre-built tool exists |
| `web_search` | Search the web and return results for research or data enrichment |
| `smart_file_extract` | Extract text from PDFs, images, and other file formats in the sandbox |

### [Libraries](https://docs.composio.dev/docs/sandbox/remote\#libraries)

The sandbox ships with common packages pre-installed: `pandas`, `numpy`, `matplotlib`, `Pillow`, `PyTorch`, and `reportlab`. Beyond these, the sandbox maintains a list of supported packages and their dependencies. If the agent uses a package that isn't already installed, the sandbox installs it automatically.

### [Error correction](https://docs.composio.dev/docs/sandbox/remote\#error-correction)

The sandbox corrects common mistakes in the code your agent generates. For example, if a script accesses `result["apiKey"]` but the actual field name is `api_key`, the sandbox resolves the mismatch instead of failing.

### [Persistent state](https://docs.composio.dev/docs/sandbox/remote\#persistent-state)

The sandbox runs as a persistent Jupyter notebook. Variables, imports, files, and in-memory state from one call are available in the next.

### [Compute tier](https://docs.composio.dev/docs/sandbox/remote\#compute-tier)

Sandboxes default to `standard` (1 vCPU, 1 GB RAM). For heavier workloads (large dataframes, ML preprocessing, or big bulk operations), pick a larger tier when creating the session via `sandbox.sandboxSize` (TypeScript) or `sandbox.sandbox_size` (Python).

Available tiers:

- `standard` (1 vCPU, 1 GB RAM)
- `medium` (2 vCPU, 2 GB)
- `large` (4 vCPU, 4 GB)
- `xlarge` (8 vCPU, 8 GB)

Larger tiers require `@composio/core` ≥ `0.8.1` or `composio` ≥ `0.12.1`. See [Configuring sessions → Sandbox compute tier](https://docs.composio.dev/docs/configuring-sessions#sandbox-compute-tier) for examples.

**Pricing:** Sandboxes are not billed today. Composio plans to begin billing for sandbox usage soon (metered by tier and runtime).

## [Files and mounts](https://docs.composio.dev/docs/sandbox/remote\#files-and-mounts)

The sandbox has a persistent file mount at `/mnt/files/`. Code running in the sandbox reads and writes files there, and the mount survives sandbox restarts: changing the [compute tier](https://docs.composio.dev/docs/sandbox/remote#compute-tier) recreates the sandbox and clears in-memory state, but `/mnt/files/` persists.

Move files between your app and the mount with `session.experimental.files`. Upload an input file and the agent reads it at `/mnt/files/<path>`. When the agent writes a result, download it from your app.

The files API ships under `session.experimental`, so the surface may change in a future release.

PythonTypeScript

```
session = composio.create("user_123")

# Upload a local file; the sandbox sees it at /mnt/files/sales.csv
uploaded = session.experimental.files.upload("./sales.csv")
print(uploaded.sandbox_mount_prefix, uploaded.mount_relative_path)
# /mnt/files sales.csv

# After the agent writes a result in the sandbox, download it
report = session.experimental.files.download("/report.pdf")
report.save("./report.pdf")
```

The mount exposes four methods:

| Method | What it does |
| --- | --- |
| `upload(input, options?)` | Upload from a local path, URL, `File`, or buffer. Returns a `RemoteFile`. |
| `list(options?)` | List files under `path` on the mount, with `cursor` and `limit` pagination. |
| `download(path, options?)` | Fetch a file from the mount as a `RemoteFile`. |
| `delete(path, options?)` | Remove a file or directory from the mount. |

A `RemoteFile` carries the file's bytes and a presigned `downloadUrl`. Read it with `text()` or `buffer()`, or write it to disk with `save(path)`. Its `expiresAt` is when that download link expires, not a TTL on the file: the mount itself has no expiry you set.

Every file lives on the session's default `files` mount, surfaced at `/mnt/files/`. Each method takes a `mountId` to address a mount by ID, but there's no SDK call to create custom mounts today, so you'll normally work with `files`.

## [Next](https://docs.composio.dev/docs/sandbox/remote\#next)

[**Local sandbox** \\
Run the same tool calls in a sandbox you own, while Composio keeps managed auth and discovery.](https://docs.composio.dev/docs/sandbox/local)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/sandbox/remote.mdx)

### On this page

[Where it fits](https://docs.composio.dev/docs/sandbox/remote#where-it-fits) [What the sandbox provides](https://docs.composio.dev/docs/sandbox/remote#what-the-sandbox-provides) [Built-in helpers](https://docs.composio.dev/docs/sandbox/remote#built-in-helpers) [Libraries](https://docs.composio.dev/docs/sandbox/remote#libraries) [Error correction](https://docs.composio.dev/docs/sandbox/remote#error-correction) [Persistent state](https://docs.composio.dev/docs/sandbox/remote#persistent-state) [Compute tier](https://docs.composio.dev/docs/sandbox/remote#compute-tier) [Files and mounts](https://docs.composio.dev/docs/sandbox/remote#files-and-mounts) [Next](https://docs.composio.dev/docs/sandbox/remote#next)
