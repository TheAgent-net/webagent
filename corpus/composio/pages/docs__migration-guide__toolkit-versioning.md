---
url: https://docs.composio.dev/docs/migration-guide/toolkit-versioning
title: Toolkit versioning migration | Composio
description: Migrate to the new toolkit versioning system
status: 200
---

[Migration guides](https://docs.composio.dev/docs/migration-guide)

Written October 2025

# Toolkit versioning migration

Copy page

Starting with Python SDK v0.9.0 and TypeScript SDK v0.2.0, manual tool execution requires explicit version specification. This is a breaking change from earlier versions where toolkit versioning was optional.

## [Breaking change](https://docs.composio.dev/docs/migration-guide/toolkit-versioning\#breaking-change)

Manual tool execution now requires explicit version specification. The `tools.execute()` method will fail without a version.

### [Before (will fail)](https://docs.composio.dev/docs/migration-guide/toolkit-versioning\#before-will-fail)

PythonTypeScript

```
# Raises ToolVersionRequiredError
result = composio.tools.execute(
    "GITHUB_CREATE_ISSUE",
    {"user_id": "user-123", "arguments": {...}}
)
```

### [After (required)](https://docs.composio.dev/docs/migration-guide/toolkit-versioning\#after-required)

Choose one of three migration strategies:

#### [Option 1: Configure version at SDK level](https://docs.composio.dev/docs/migration-guide/toolkit-versioning\#option-1-configure-version-at-sdk-level)

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

#### [Option 2: Pass version with each execution](https://docs.composio.dev/docs/migration-guide/toolkit-versioning\#option-2-pass-version-with-each-execution)

PythonTypeScript

```
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

#### [Option 3: Use environment variables](https://docs.composio.dev/docs/migration-guide/toolkit-versioning\#option-3-use-environment-variables)

```
export COMPOSIO_TOOLKIT_VERSION_GITHUB="20251027_00"
```

## [Migration checklist](https://docs.composio.dev/docs/migration-guide/toolkit-versioning\#migration-checklist)

1. **Audit your code**: Find all `tools.execute()` calls in your codebase
2. **Choose a strategy**: Select one of the three options above based on your needs
3. **Test thoroughly**: Verify tools work correctly with pinned versions
4. **Deploy gradually**: Roll out changes incrementally to minimize risk

## [Temporary workaround](https://docs.composio.dev/docs/migration-guide/toolkit-versioning\#temporary-workaround)

During migration, you can temporarily skip version checks (not recommended for production):

PythonTypeScript

```
result = composio.tools.execute(
    "GITHUB_CREATE_ISSUE",
    {
        "user_id": "user-123",
        "arguments": {...}
    },
    dangerously_skip_version_check=True
)
```

The `dangerouslySkipVersionCheck` flag is only for migration or debugging. Never use in production.

## [Next](https://docs.composio.dev/docs/migration-guide/toolkit-versioning\#next)

[**Migrate to sessions** \\
Move from older tool execution patterns to sessions](https://docs.composio.dev/docs/migration-guide/direct-to-sessions)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/migration-guide/toolkit-versioning.mdx)

### On this page

[Breaking change](https://docs.composio.dev/docs/migration-guide/toolkit-versioning#breaking-change) [Before (will fail)](https://docs.composio.dev/docs/migration-guide/toolkit-versioning#before-will-fail) [After (required)](https://docs.composio.dev/docs/migration-guide/toolkit-versioning#after-required) [Option 1: Configure version at SDK level](https://docs.composio.dev/docs/migration-guide/toolkit-versioning#option-1-configure-version-at-sdk-level) [Option 2: Pass version with each execution](https://docs.composio.dev/docs/migration-guide/toolkit-versioning#option-2-pass-version-with-each-execution) [Option 3: Use environment variables](https://docs.composio.dev/docs/migration-guide/toolkit-versioning#option-3-use-environment-variables) [Migration checklist](https://docs.composio.dev/docs/migration-guide/toolkit-versioning#migration-checklist) [Temporary workaround](https://docs.composio.dev/docs/migration-guide/toolkit-versioning#temporary-workaround) [Next](https://docs.composio.dev/docs/migration-guide/toolkit-versioning#next)
