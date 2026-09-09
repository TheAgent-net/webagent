---
url: https://docs.composio.dev/docs/tools-direct/executing-tools
title: Executing tools directly | Composio
description: Maintain legacy code that calls composio.tools.execute() and other direct tool APIs
status: 200
---

Direct execution

Legacy

# Executing tools directly

Copy page

If you're building an agent, we recommend using [sessions](https://docs.composio.dev/docs/configuring-sessions) instead. Sessions handle tool fetching, authentication, and execution automatically. See [Sessions vs Direct Execution](https://docs.composio.dev/docs/sessions-vs-direct-execution) to understand the tradeoffs.

LLMs on their own can only do generation. Tool calling changes that by letting them interact with external services. Instead of just drafting an email, the model can call `GMAIL_SEND_EMAIL` to actually send it. The tool's results feed back to the LLM, closing the loop so it can decide, act, observe, and adapt.

In Composio, every **tool** is a single API action—fully described with schema, parameters, and return type. Tools live inside **toolkits** like Gmail, Slack, or GitHub, and Composio handles authentication and user scoping.

## [Canceling TypeScript requests](https://docs.composio.dev/docs/tools-direct/executing-tools\#canceling-typescript-requests)

TypeScript SDK methods accept an `AbortSignal` in their trailing request options. Aborted requests throw `ComposioRequestCancelledError`, so cancellation can be handled separately from execution failures:

```
import { Composio, ComposioRequestCancelledError } from '@composio/core';

const composio = new Composio({ apiKey: 'your_composio_api_key' });

try {
  await composio.toolkits.get({}, { signal: AbortSignal.timeout(5_000) });
} catch (error) {
  if (error instanceof ComposioRequestCancelledError) {
    console.log('Request canceled');
  }
}
```

Use an `AbortController` when application code decides when to cancel. Custom tools receive the same signal as `ctx.signal` and should pass it to cancellable work.

**User Scoping**: All tools are scoped to a specific user - that's why every example includes a `user_id`. Learn how to structure User IDs in [User scoping](https://docs.composio.dev/docs/how-composio-works). Each user must authenticate with their respective services (Gmail, Calendar, etc.) - see [Authentication](https://docs.composio.dev/docs/tools-direct/authenticating-tools).

## [Using Chat Completions](https://docs.composio.dev/docs/tools-direct/executing-tools\#using-chat-completions)

Use the Composio SDK with providers like OpenAI, Anthropic, and Google AI. To learn how to set up these providers, see [Providers](https://docs.composio.dev/docs/providers/openai).

PythonTypeScript

```
from composio import Composio
from composio_openai import OpenAIProvider
from openai import OpenAI
from datetime import datetime

# Use a unique identifier for each user in your application
user_id = "user-k7334"

# Create composio client
composio = Composio(provider=OpenAIProvider(), api_key="your_composio_api_key")

# Create openai client
openai = OpenAI()

# Get calendar tools for this user
tools = composio.tools.get(
    user_id=user_id,
    tools=["GOOGLECALENDAR_EVENTS_LIST"]
)

# Ask the LLM to check calendar
result = openai.chat.completions.create(
    model="gpt-5.4",
    tools=tools,
    messages=[\
        {"role": "system", "content": "You are a helpful assistant."},\
        {"role": "user", "content": f"What's on my calendar for the next 7 days?"}\
    ]
)

# Handle tool calls
result = composio.provider.handle_tool_calls(user_id=user_id, response=result)
print(result)
```

## [Using Agentic Frameworks](https://docs.composio.dev/docs/tools-direct/executing-tools\#using-agentic-frameworks)

Agentic frameworks automatically handle the tool execution loop. Composio provides support for frameworks like this by making sure the tools are formatted into the correct objects for the agentic framework to execute.

PythonTypeScript

```
import asyncio
from agents import Agent, Runner
from composio import Composio
from composio_openai_agents import OpenAIAgentsProvider

# Use a unique identifier for each user in your application
user_id = "user-k7334"

# Initialize Composio toolset
composio = Composio(provider=OpenAIAgentsProvider(), api_key="your_composio_api_key")

# Get all tools for the user
tools = composio.tools.get(
    user_id=user_id,
    toolkits=["COMPOSIO_SEARCH"],
)

# Create an agent with the tools
agent = Agent(
    name="Deep Researcher",
    instructions="You are an investigative journalist.",
    tools=tools,
)

async def main():
    result = await Runner.run(
        starting_agent=agent,
        input=("Do a thorough DEEP research on Golden Gate Bridge"),
    )
    print(result.final_output)

# Run the agent
asyncio.run(main())
```

## [Direct Tool Execution](https://docs.composio.dev/docs/tools-direct/executing-tools\#direct-tool-execution)

If you just want to call a tool without using any framework or LLM provider, you can use the `execute` method directly.

**A toolkit version is required for direct execution** — calling `tools.execute()` without one raises `ToolVersionRequiredError`, and `"latest"` alone is not accepted here. Two ways to satisfy it:

- **An LLM or agent consumes the outputs:** keep `"latest"` and pass `dangerously_skip_version_check=True` (TypeScript: `dangerouslySkipVersionCheck: true`) on the execute call — you always run the newest tools, and the flag's name is the reminder that output schemas can change between releases.
- **Your code parses the outputs:** pin a dated version — look it up with `composio.toolkits.get(slug="...").meta.version` or in the [Toolkits catalog](https://docs.composio.dev/toolkits), and pass it at SDK initialization or per call via `version="..."`.

See [toolkit versioning](https://docs.composio.dev/docs/tools-direct/toolkit-versioning) for the full tradeoffs.

**Finding a toolkit and tool:** browse the [Toolkits catalog](https://docs.composio.dev/toolkits) — each toolkit page lists its tool slugs and current version — or search by task from the CLI: `composio search "send an email"`. You can also [search tools semantically](https://docs.composio.dev/docs/tools-direct/fetching-tools#by-search-experimental) from the SDK.

**Finding tool parameters and types:**

**Platform UI**: [Auth Configs](https://dashboard.composio.dev/~/project/auth-configs?utm_source=docs&utm_medium=content&utm_campaign=docs-tools-direct-executing-tools) → Select your toolkit → Tools & Triggers → Select the tool to see its required and optional parameters

**CLI**: For Python and TypeScript projects, run `composio generate` to generate types. [Learn more →](https://docs.composio.dev/docs/cli#generate-type-definitions)

PythonTypeScript

```
from composio import Composio

user_id = "user-k7334"
# Configure toolkit versions at SDK level for every toolkit you execute.
# Use "latest", or pin a version — find them with composio.toolkits.get(slug="github").meta.available_versions
composio = Composio(
    api_key="your_composio_key",
    toolkit_versions={"github": "latest"}
)

# Find available arguments for any tool in the Composio dashboard
result = composio.tools.execute(
    "GITHUB_LIST_STARGAZERS",
    user_id=user_id,
    arguments={"owner": "ComposioHQ", "repo": "composio", "page": 1, "per_page": 5},
    # "latest" requires this opt-in; to pin instead, pass version=composio.toolkits.get(slug="github").meta.version
    dangerously_skip_version_check=True,
)
print(result)
```

The examples above configure toolkit versions at SDK initialization. You can also pass versions per-execution or use environment variables. See [toolkit versioning](https://docs.composio.dev/docs/tools-direct/toolkit-versioning) for all configuration options.

**Choosing a version strategy:** Use `latest` when tool outputs are consumed by an LLM or AI agent — agents adapt to schema changes dynamically. Pin to a specific version when your code parses outputs programmatically. See [choosing between `latest` and a pinned version](https://docs.composio.dev/docs/tools-direct/toolkit-versioning#choosing-between-latest-and-a-pinned-version).

### [Proxy Execute](https://docs.composio.dev/docs/tools-direct/executing-tools\#proxy-execute)

You can proxy requests to any supported toolkit API and let Composio inject the authentication state. This is useful when you need an API endpoint that isn't available as a predefined tool.

Proxy execute requires auth context. Pass `connected_account_id` / `connectedAccountId`, or provide `custom_connection_data` if you're supplying auth manually.

The `endpoint` can be a relative path or absolute URL. Relative paths are resolved against the connected account's base URL. Absolute URLs are only accepted when they use the same scheme and registrable domain as that base URL. Cross-subdomain requests on the same registrable domain still work.

Prefer relative endpoints when possible. They resolve against the connected account's base URL and avoid same-domain validation issues.

PythonTypeScript

```
# Send a proxy request to the endpoint
response = composio.tools.proxy(
    endpoint="/repos/composiohq/composio/issues/1",
    method="GET",
    connected_account_id="ca_jI6********",  # use connected account for github
    parameters=[\
        {\
            "name": "Accept",\
            "value": "application/vnd.github.v3+json",\
            "type": "header",\
        },\
    ],
)

print(response)
```

Need an API that isn't supported by any Composio toolkit, or want to extend an existing one? Learn how to [create session custom tools](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits).

## [Automatic File Handling](https://docs.composio.dev/docs/tools-direct/executing-tools\#automatic-file-handling)

Automatic file handling is **off by default**. Enable it with `dangerouslyAllowAutoUploadDownloadFiles: true` (TypeScript) or `dangerously_allow_auto_upload_download_files=True` (Python). Once enabled, pass file paths to tools that accept files and get local paths back from tools that return files.

### [File Upload](https://docs.composio.dev/docs/tools-direct/executing-tools\#file-upload)

Pass local file paths, URLs, or File objects to tools that accept files. The SDK uploads the file to Composio's storage and converts it to the format the tool expects — you don't need to construct the file metadata object (`s3key`, `name`, `mimetype`) yourself.

PythonTypeScript

```
composio = Composio(
    api_key="your_composio_key",
    toolkit_versions={"googledrive": "latest", "gmail": "latest"},
    dangerously_allow_auto_upload_download_files=True,
)

# Upload a local file to Google Drive
result = composio.tools.execute(
    slug="GOOGLEDRIVE_UPLOAD_FILE",
    user_id="user-1235***",
    arguments={"file_to_upload": os.path.join(os.getcwd(), "document.pdf")},
    dangerously_skip_version_check=True,  # required when running "latest"
)

print(result)  # Print Google Drive file details
```

This also works with public URLs. For example, to send a Gmail email with an attachment from a URL:

PythonTypeScript

```
result = composio.tools.execute(
    slug="GMAIL_SEND_EMAIL",
    user_id="user-1235***",
    arguments={
        "recipient_email": "recipient@example.com",
        "subject": "Report attached",
        "body": "Please find the report attached.",
        "attachment": "https://example.com/report.pdf",
    },
    dangerously_skip_version_check=True,  # required when running "latest"
)
```

### [File Download](https://docs.composio.dev/docs/tools-direct/executing-tools\#file-download)

When tools return files, Composio downloads them to the local directory and provides the file path in the response:

PythonTypeScript

```
composio = Composio(
    api_key="your_composio_key",
    toolkit_versions={"googledrive": "latest"},
    dangerously_allow_auto_upload_download_files=True,
    file_download_dir="./downloads",  # Optional: Specify download directory
)

result = composio.tools.execute(
    "GOOGLEDRIVE_DOWNLOAD_FILE",
    user_id="user-1235***",
    arguments={"file_id": "your_file_id"},
    dangerously_skip_version_check=True,  # required when running "latest"
)

# Result includes local file path
print(result)
```

## [Security for local file paths](https://docs.composio.dev/docs/tools-direct/executing-tools\#security-for-local-file-paths)

Automatic upload reads local paths (or uses them in `files.upload`) and sends file content to Composio storage. To reduce the chance of **accidentally uploading secrets** (SSH keys, cloud credentials, `.env` files, or assistant project folders), the SDK checks local paths against a **default denylist** of path segments and file-name patterns. **HTTP/HTTPS URLs and `File` objects are not matched like local path strings**; only local string paths go through this check.

Matching both path forms requires `@composio/core` 0.17.1 or later (TypeScript) or a `composio` release newer than 0.20.0 (Python). Earlier versions check only the symlink-resolved path. In those versions, a layout such as `~/.claude -> /state/claude` is not protected.

When `sensitiveFileUploadProtection` (TypeScript) or `sensitive_file_upload_protection` (Python) is enabled, each path is matched **twice**: once as written and once after resolving symlinks. A symlink can hide a denied name in either direction. For example, `~/link -> ~/nested/.aws/creds` hides `.aws` from the path you wrote, while `~/.claude -> /state/claude` hides `.claude` from the resolved target. Dotfile managers such as chezmoi, stow, and yadm can produce the second layout.

Matching both forms blocks these common single-symlink cases. Only the path as written and its fully resolved target are compared, so treat the denylist as a guardrail against accidental uploads, not a security boundary against a determined attacker.

Disabling protection or wiring a hook that always approves paths can allow **exfiltration of sensitive files** if an LLM or malicious input points at credential locations. Prefer keeping protection on, adding [`fileUploadPathDenySegments`](https://docs.composio.dev/reference/sdk-reference/typescript/composio#file-upload-security) (TypeScript) / `file_upload_path_deny_segments` (Python) for your own secret directories, and using a [`beforeFileUpload`](https://docs.composio.dev/reference/sdk-reference/typescript/composio#file-upload-security) / `before_file_upload` hook for auditing or strict allowlists. On Python, you can use the `@before_file_upload` decorator with `modifiers=[...]` the same way as `@before_execute` — see [Before file upload (Python)](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers#before-file-upload-python) on the before-execution modifiers page.

**Constructor options (defaults protect sensitive locations):**

TypeScriptPython

```
import { Composio } from '@composio/core';

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY!,
  // default true — block paths under built-in segments (e.g. .ssh, .aws) and risky basenames
  sensitiveFileUploadProtection: true,
  // optional: extra path *components* anywhere in the path (as written or symlink-resolved),
  // merged with the built-in list
  fileUploadPathDenySegments: ['internal-only-secrets'],
});
```

**Per-execution upload hook** (run after the path is chosen but before read/upload; return a new path, `false` to abort, or throw). TypeScript passes `beforeFileUpload` on the **third** argument to `tools.execute`. In Python, add **`@before_file_upload`** functions to the `modifiers` list for `get` / `execute` (see [Before file upload (Python)](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers#before-file-upload-python)).

TypeScriptPython

```
await composio.tools.execute(
  'GOOGLEDRIVE_UPLOAD_FILE',
  {
    userId: 'user-4235***',
    arguments: { file_to_upload: path.join(__dirname, 'document.pdf') },
    dangerouslySkipVersionCheck: true, // required when running "latest"
  },
  { beforeFileUpload }
);
```

**Errors:**`ComposioSensitiveFilePathBlockedError` / `SensitiveFilePathBlockedError` when a path is blocked; `ComposioFileUploadAbortedError` / `FileUploadAbortedError` when the hook returns `false` (or equivalent abort).

### [Automatic file handling (off by default)](https://docs.composio.dev/docs/tools-direct/executing-tools\#automatic-file-handling-off-by-default)

Both SDKs ship with automatic file handling **off**. Opt in with `dangerouslyAllowAutoUploadDownloadFiles: true` (TypeScript) or `dangerously_allow_auto_upload_download_files=True` (Python). Even with the flag enabled, **local paths must resolve inside an allowlisted directory** — see the matrix in the [legacy auto-upload removal changelog](https://docs.composio.dev/docs/changelog/2026/04/24) for the full `fileUploadDirs` / `file_upload_dirs` semantics.

When auto-handling is off, handle the staging yourself.

PythonTypeScript

The Python SDK does not expose a top-level manual-staging API. Either:

1. Enable auto-handling and configure `file_upload_dirs` to cover the directories your code reads from:

```
from composio import Composio

composio = Composio(
    api_key="your_composio_key",
    toolkit_versions={"googledrive": "latest"},
    dangerously_allow_auto_upload_download_files=True,
    file_upload_dirs=["/srv/agent/uploads", "~/.composio/temp"],
)
```

2. Or keep auto-handling off and pass an already-staged `{ "name", "mimetype", "s3key" }` dict directly into `tools.execute`. Pre-stage your files via your own pipeline (or an upstream tool) and inject the descriptor:

```
result = composio.tools.execute(
    "GOOGLEDRIVE_UPLOAD_FILE",
    user_id="user-1",
    arguments={"file_to_upload": prestaged_descriptor},
    dangerously_skip_version_check=True,  # required when running "latest"
)
```

## [Next](https://docs.composio.dev/docs/tools-direct/executing-tools\#next)

[**Fetching tools** \\
Fetch and filter tools, inspect schemas, and search semantically](https://docs.composio.dev/docs/tools-direct/fetching-tools)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/tools-direct/executing-tools.mdx)

### On this page

[Canceling TypeScript requests](https://docs.composio.dev/docs/tools-direct/executing-tools#canceling-typescript-requests) [Using Chat Completions](https://docs.composio.dev/docs/tools-direct/executing-tools#using-chat-completions) [Using Agentic Frameworks](https://docs.composio.dev/docs/tools-direct/executing-tools#using-agentic-frameworks) [Direct Tool Execution](https://docs.composio.dev/docs/tools-direct/executing-tools#direct-tool-execution) [Proxy Execute](https://docs.composio.dev/docs/tools-direct/executing-tools#proxy-execute) [Automatic File Handling](https://docs.composio.dev/docs/tools-direct/executing-tools#automatic-file-handling) [File Upload](https://docs.composio.dev/docs/tools-direct/executing-tools#file-upload) [File Download](https://docs.composio.dev/docs/tools-direct/executing-tools#file-download) [Security for local file paths](https://docs.composio.dev/docs/tools-direct/executing-tools#security-for-local-file-paths) [Automatic file handling (off by default)](https://docs.composio.dev/docs/tools-direct/executing-tools#automatic-file-handling-off-by-default) [Next](https://docs.composio.dev/docs/tools-direct/executing-tools#next)
