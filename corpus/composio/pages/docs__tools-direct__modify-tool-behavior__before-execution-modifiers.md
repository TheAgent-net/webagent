---
url: https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers
title: Before Execution Modifiers | Composio
description: Modify tool arguments before execution
status: 200
---

Direct executionModify tool behavior

Legacy

# Before Execution Modifiers

Copy page

If you're building an agent, we recommend using [sessions](https://docs.composio.dev/docs/configuring-sessions) instead. See [Tools and toolkits](https://docs.composio.dev/docs/how-composio-works#meta-tools) for how sessions handle tool discovery and execution automatically.

Before execution modifiers are part of Composio SDK's powerful middleware capabilities that allow you to customize and extend the behavior of tools.

These modifiers are called before the tool is executed by the LLM. This allows you to modify the arguments called by the LLM before they are executed by Composio.

**Useful for:**

- Injecting an argument into the tool execution
- Overriding the arguments emitted by the LLM

![Before Execution Modifier](https://docs.composio.dev/_next/image?url=%2Fimages%2Fbefore-execute.png&w=1920&q=75&dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)

Below we use the `beforeExecute` modifier to modify the number of posts returned by `HACKERNEWS_GET_LATEST_POSTS`.

## [With Chat Completions](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers\#with-chat-completions)

Since completion providers don't have a function execution step, Composio executes the tool call directly. The modifier is configured on the `tools.execute` method.

PythonTypeScript

```
from openai import OpenAI
from composio import Composio, before_execute
from composio.types import ToolExecuteParams

composio = Composio(toolkit_versions={"hackernews": "latest"})
openai_client = OpenAI()
user_id = "user@email.com"

@before_execute(tools=["HACKERNEWS_GET_LATEST_POSTS"])
def before_execute_modifier(
    tool: str,
    toolkit: str,
    params: ToolExecuteParams,
) -> ToolExecuteParams:
    params["arguments"]["size"] = 1
    return params

# Get tools
tools = composio.tools.get(user_id=user_id, slug="HACKERNEWS_GET_LATEST_POSTS")

# Get response from the LLM
response = openai_client.chat.completions.create(
    model="gpt-5.4",
    tools=tools,
    messages=[{"role": "user", "content": "Fetch latest posts from hackernews"}],
)
print(response)

# Execute the function calls
result = composio.provider.handle_tool_calls(
    response=response,
    user_id="default",
    modifiers=[\
        before_execute_modifier,\
    ],
)
print(result)
```

## [With Agentic Frameworks](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers\#with-agentic-frameworks)

Agentic providers have a function execution step. The modifier is configured on the `tools.get` method which modifies the execution logic within the framework.

PythonTypeScript

```
from composio import Composio, before_execute
from composio.types import ToolExecuteParams
from composio_crewai import CrewAIProvider

composio = Composio(provider=CrewAIProvider())

@before_execute(tools=["LINEAR_CREATE_LINEAR_ISSUE"])
def modify_linear_project_id(
    tool: str,
    toolkit: str,
    params: ToolExecuteParams,
) -> ToolExecuteParams:
    params["arguments"]["project_id"] = "1234567890"
    return params

tools = composio.tools.get(
    user_id="default",
    tools=[\
        "HACKERNEWS_GET_LATEST_POSTS",\
        "HACKERNEWS_GET_USER",\
        "LINEAR_CREATE_LINEAR_ISSUE",\
    ],
    modifiers=[\
        modify_linear_project_id,\
    ]
)
```

## [Before file upload (Python)](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers\#before-file-upload-python)

For tools with `file_uploadable` parameters, the SDK can read a local path and upload the file before calling the Composio API. To audit, rewrite, or block those paths, use the [`@before_file_upload`](https://docs.composio.dev/reference/sdk-reference/python/index#before_file_upload) decorator and pass the decorated callables in `modifiers` to `tools.get`, `tools.execute`, or a tool router session’s `tools(modifiers=...)`.

See [Executing tools: security for local file paths](https://docs.composio.dev/docs/tools-direct/executing-tools#security-for-local-file-paths) for constructor options, errors, and a full tabbed example.

The hook takes either a single `context` argument (preferred) or the legacy
3-arg `(path, tool, toolkit)` form. The context object exposes
`context["source"]` — `"path"` for local filesystem inputs and `"url"` for
`http(s)://...` inputs — so you can scope audits to just local paths:

```
from composio import Composio, before_file_upload

@before_file_upload(tools=["GOOGLEDRIVE_UPLOAD_FILE"])
def audit_path(ctx) -> str | bool:
    # ctx = {"path": ..., "source": "path" | "url", "tool": ..., "toolkit": ...}
    if ctx["source"] != "path":
        return ctx["path"]  # let URLs through untouched
    # return a new path string, or False to abort the upload
    return ctx["path"]

composio = Composio(toolkit_versions={"googledrive": "latest"})
composio.tools.execute(
    "GOOGLEDRIVE_UPLOAD_FILE",
    {"file_to_upload": "/path/to/document.pdf"},
    user_id="user_123",
    dangerously_skip_version_check=True,  # required when running "latest"
    modifiers=[audit_path],
)
```

- **Composition:**`before_file_upload`-type modifiers in the `modifiers` list are applied in **list order** (after filtering by each modifier’s `tools` / `toolkits` scope). Chaining works like a pipeline: each hook receives the path produced by the previous one.
- **Relative to `before_execute`:** automatic file substitution runs **before**`before_execute` modifiers, matching TypeScript behavior (including tool router `execute_meta`).

## [Next](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers\#next)

[**After execution modifiers** \\
Transform tool results after execution](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/after-execution-modifiers)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/tools-direct/modify-tool-behavior/before-execution-modifiers.mdx)

### On this page

[With Chat Completions](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers#with-chat-completions) [With Agentic Frameworks](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers#with-agentic-frameworks) [Before file upload (Python)](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers#before-file-upload-python) [Next](https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers#next)
