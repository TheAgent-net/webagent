---
url: https://docs.composio.dev/docs/tools-direct/toolkit-versioning
title: Toolkit Versioning | Composio
description: Pin specific tool versions for consistent behavior in production
status: 200
---

Direct execution

Legacy

# Toolkit Versioning

Copy page

If you're building an agent, we recommend using [sessions](https://docs.composio.dev/docs/configuring-sessions) instead. Sessions handle toolkit versions automatically so you don't have to manage them yourself.

Toolkit versioning ensures your tools behave consistently across deployments. You can pin specific versions in production, test new releases in development, and roll back when needed.

To view available versions, go to [Dashboard](https://dashboard.composio.dev/?utm_source=docs&utm_medium=content&utm_campaign=docs-tools-direct-toolkit-versioning) \> **All Toolkits** \> select a toolkit. The version dropdown shows the latest and all available versions:

![Toolkit version selector on the Composio dashboard](https://docs.composio.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftoolkit-version-dashboard.20dg4q8qexd5s.png&w=1920&q=75&dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)

You can also find the latest version for each toolkit on the [Toolkits](https://docs.composio.dev/toolkits) page in the docs. Select a toolkit to see its current version and available tools.

Starting from Python SDK v0.9.0 and TypeScript SDK v0.2.0, specifying versions is required for manual tool execution — and `"latest"` is **not** accepted there on its own. To run the newest version with `tools.execute()`, pass `dangerously_skip_version_check=True` (TypeScript: `dangerouslySkipVersionCheck: true`) on the call; otherwise pin a dated version. `"latest"` works without the flag everywhere else (fetching tools, sessions).

## [Default version behavior](https://docs.composio.dev/docs/tools-direct/toolkit-versioning\#default-version-behavior)

The v3 API defaults to the base version (`00000000_00`) when you don't specify a version. This can return fewer tools than the [platform UI](https://dashboard.composio.dev/?utm_source=docs&utm_medium=content&utm_campaign=docs-tools-direct-toolkit-versioning). Pass `toolkit_versions=latest` or a specific version to select a newer version. The v3.1 tools API defaults to the latest version.

For example, a v3 tools-list request without `toolkit_versions` returns the base version:

```
# Without toolkit_versions: returns tools from the base version
curl 'https://backend.composio.dev/api/v3/tools?toolkit_slug=googledrive' \
  -H 'x-api-key: YOUR_API_KEY'

# With toolkit_versions=latest: returns tools from the latest version
curl 'https://backend.composio.dev/api/v3/tools?toolkit_slug=googledrive&toolkit_versions=latest' \
  -H 'x-api-key: YOUR_API_KEY'
```

## [Configuration methods](https://docs.composio.dev/docs/tools-direct/toolkit-versioning\#configuration-methods)

Configure toolkit versions using one of three methods:

### [SDK initialization](https://docs.composio.dev/docs/tools-direct/toolkit-versioning\#sdk-initialization)

PythonTypeScript

```
from composio import Composio

# Pin specific versions for each toolkit
composio = Composio(
    api_key="YOUR_API_KEY",
    toolkit_versions={
        "github": "20251027_00",
        "slack": "20251027_00",
        "gmail": "20251027_00"
    }
)
```

### [Environment variables](https://docs.composio.dev/docs/tools-direct/toolkit-versioning\#environment-variables)

```
# Set versions for specific toolkits
export COMPOSIO_TOOLKIT_VERSION_GITHUB="20251027_00"
export COMPOSIO_TOOLKIT_VERSION_SLACK="20251027_00"
export COMPOSIO_TOOLKIT_VERSION_GMAIL="20251027_00"
```

### [Per-execution override](https://docs.composio.dev/docs/tools-direct/toolkit-versioning\#per-execution-override)

PythonTypeScript

```
from composio import Composio

composio = Composio(api_key="YOUR_API_KEY")

# Specify version directly in execute call
result = composio.tools.execute(
    "GITHUB_LIST_STARGAZERS",
    arguments={
        "owner": "ComposioHQ",
        "repo": "composio"
    },
    user_id="user-k7334",
    version="20251027_00"  # Override version for this execution
)
print(result)
```

## [Version format](https://docs.composio.dev/docs/tools-direct/toolkit-versioning\#version-format)

Versions follow the format `YYYYMMDD_NN`:

- `YYYYMMDD`: Release date
- `NN`: Sequential release number

```
# Pin to a specific version
toolkit_versions = {"github": "20251027_00"}

# Always use the newest tools (manual execution additionally requires
# dangerously_skip_version_check=True on the execute call)
toolkit_versions = {"github": "latest"}
```

## [Choosing between `latest` and a pinned version](https://docs.composio.dev/docs/tools-direct/toolkit-versioning\#choosing-between-latest-and-a-pinned-version)

The right choice depends on how your application consumes tool outputs:

- **Use `latest`** when tool outputs are consumed by an LLM or AI agent. Agents interpret responses dynamically and adapt to changes in output structure. Using `latest` ensures your agent always has access to the newest tools and improvements without manual intervention. For manual execution (`tools.execute()`), `latest` requires the explicit opt-in `dangerously_skip_version_check=True` / `dangerouslySkipVersionCheck: true` on the call — the flag's name is the reminder that output schemas can change between releases.

- **Pin a specific version** when tool outputs are consumed programmatically — for example, if your code destructures specific fields from a response, maps outputs to a database schema, or feeds results into a typed pipeline. Schema changes in a new version could silently break these integrations.


As a rule of thumb: if an LLM reads the output, use `latest`. If your code parses the output, pin the version.

Most agentic applications — including all [session-based](https://docs.composio.dev/docs/configuring-sessions) workflows — use `latest` by default and benefit from always having the most up-to-date tools. If you're building structured data pipelines or integrations with fixed response parsing, pin to a tested version and upgrade on your own schedule.

## [Version resolution order](https://docs.composio.dev/docs/tools-direct/toolkit-versioning\#version-resolution-order)

1. Per-execution version (highest priority)
2. SDK initialization version
3. Environment variable (toolkit-specific)

## [Managing versions](https://docs.composio.dev/docs/tools-direct/toolkit-versioning\#managing-versions)

Check available versions using:

PythonTypeScript

```
# Get toolkit information including available versions
toolkit = composio.toolkits.get(slug="github")

# Extract and print version information
print(f"Toolkit: {toolkit.name}")
print(f"Current Version: {toolkit.meta.version}")
print(f"Available Versions: {toolkit.meta.available_versions}")
```

## [Next](https://docs.composio.dev/docs/tools-direct/toolkit-versioning\#next)

[**Fetching tools** \\
Fetch and filter tools, inspect schemas, and search semantically](https://docs.composio.dev/docs/tools-direct/fetching-tools)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/tools-direct/toolkit-versioning.mdx)

### On this page

[Default version behavior](https://docs.composio.dev/docs/tools-direct/toolkit-versioning#default-version-behavior) [Configuration methods](https://docs.composio.dev/docs/tools-direct/toolkit-versioning#configuration-methods) [SDK initialization](https://docs.composio.dev/docs/tools-direct/toolkit-versioning#sdk-initialization) [Environment variables](https://docs.composio.dev/docs/tools-direct/toolkit-versioning#environment-variables) [Per-execution override](https://docs.composio.dev/docs/tools-direct/toolkit-versioning#per-execution-override) [Version format](https://docs.composio.dev/docs/tools-direct/toolkit-versioning#version-format) [Choosing between `latest` and a pinned version](https://docs.composio.dev/docs/tools-direct/toolkit-versioning#choosing-between-latest-and-a-pinned-version) [Version resolution order](https://docs.composio.dev/docs/tools-direct/toolkit-versioning#version-resolution-order) [Managing versions](https://docs.composio.dev/docs/tools-direct/toolkit-versioning#managing-versions) [Next](https://docs.composio.dev/docs/tools-direct/toolkit-versioning#next)
