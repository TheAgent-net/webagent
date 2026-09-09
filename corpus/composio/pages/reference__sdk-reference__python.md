---
url: https://docs.composio.dev/reference/sdk-reference/python
title: Python SDK Reference | Composio
description: API reference for the Composio Python SDK
status: 200
---

SDK Reference

# Python SDK Reference

Copy page

# [Python SDK Reference](https://docs.composio.dev/reference/sdk-reference/python\#python-sdk-reference)

Complete API reference for the `composio` Python package.

## [Installation](https://docs.composio.dev/reference/sdk-reference/python\#installation)

```
uv add composio
```

## [Classes](https://docs.composio.dev/reference/sdk-reference/python\#classes)

| Class | Description |
| --- | --- |
| [`Composio`](https://docs.composio.dev/reference/sdk-reference/python/composio) | Composio SDK for Python. Generic parameters: TTool: The individual tool type re... |
| [`Tools`](https://docs.composio.dev/reference/sdk-reference/python/tools) | Tools class definition This class is used to manage tools in the Composio SDK. ... |
| [`Toolkits`](https://docs.composio.dev/reference/sdk-reference/python/toolkits) | Toolkits are a collectiono of tools that can be used to perform various tasks. T... |
| [`Triggers`](https://docs.composio.dev/reference/sdk-reference/python/triggers) | Triggers (instance) class |
| [`ConnectedAccounts`](https://docs.composio.dev/reference/sdk-reference/python/connected-accounts) | Manage connected accounts. This class is used to manage connected accounts in t... |
| [`AuthConfigs`](https://docs.composio.dev/reference/sdk-reference/python/auth-configs) | Manage authentication configurations. |
| [`MCP`](https://docs.composio.dev/reference/sdk-reference/python/mcp) | MCP (Model Control Protocol) class. Provides enhanced MCP server operations Thi... |
| [`Session`](https://docs.composio.dev/reference/sdk-reference/python/session) | A Composio session — the object returned by `composio.create(...)` / \`\`composi... |

## [Quick Start](https://docs.composio.dev/reference/sdk-reference/python\#quick-start)

```
from composio import Composio

composio = Composio(api_key="your-api-key")

# Get tools for a user
tools = composio.tools.get("user-123", toolkits=["github"])

# Execute a tool
result = composio.tools.execute(
    "GITHUB_GET_REPOS",
    arguments={"owner": "composio"},
    user_id="user-123"
)
```

## [Decorators](https://docs.composio.dev/reference/sdk-reference/python\#decorators)

### [before\_execute](https://docs.composio.dev/reference/sdk-reference/python\#before_execute)

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/_modifiers.py#L280)

```
@before_execute(modifier: BeforeExecute | None = ..., tools: List[str | None] = ..., toolkits: List[str | None] = ...)
def my_modifier(...):
    ...
```

### [after\_execute](https://docs.composio.dev/reference/sdk-reference/python\#after_execute)

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/_modifiers.py#L241)

```
@after_execute(modifier: AfterExecute | None = ..., tools: List[str | None] = ..., toolkits: List[str | None] = ...)
def my_modifier(...):
    ...
```

### [before\_file\_upload](https://docs.composio.dev/reference/sdk-reference/python\#before_file_upload)

Build a `Modifier` for the file-upload hook (same scoping pattern as :func:`before_execute`). Your callable may take **either**: \- a single `context` argument (:class:`BeforeFileUploadContext`) — the preferred form, exposes `context["source"]` (`"path"` or `"url"`), or - three positional arguments `(path, tool, toolkit)` — legacy form, kept for back-compat. Return a new path/URL string to substitute, or `False` to abort the upload (raises :class:`~composio.exceptions.FileUploadAbortedError`). Pass the returned `Modifier` in `modifiers=[...]` on :meth:`composio.core.models.tools.Tools.execute` or `tools.get`. Multiple such modifiers are composed in list order.

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/_modifiers.py#L319)

```
@before_file_upload(modifier: BeforeFileUploadLike | None = ..., tools: List[str | None] = ..., toolkits: List[str | None] = ...)
def my_modifier(...):
    ...
```

### [schema\_modifier](https://docs.composio.dev/reference/sdk-reference/python\#schema_modifier)

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/_modifiers.py#L377)

```
@schema_modifier(modifier: SchemaModifier | None = ..., tools: List[str | None] = ..., toolkits: List[str | None] = ...)
def my_modifier(...):
    ...
```

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/sdk-reference/python/index.mdx)

### On this page

[Python SDK Reference](https://docs.composio.dev/reference/sdk-reference/python#python-sdk-reference) [Installation](https://docs.composio.dev/reference/sdk-reference/python#installation) [Classes](https://docs.composio.dev/reference/sdk-reference/python#classes) [Quick Start](https://docs.composio.dev/reference/sdk-reference/python#quick-start) [Decorators](https://docs.composio.dev/reference/sdk-reference/python#decorators) [before\_execute](https://docs.composio.dev/reference/sdk-reference/python#before_execute) [after\_execute](https://docs.composio.dev/reference/sdk-reference/python#after_execute) [before\_file\_upload](https://docs.composio.dev/reference/sdk-reference/python#before_file_upload) [schema\_modifier](https://docs.composio.dev/reference/sdk-reference/python#schema_modifier)
