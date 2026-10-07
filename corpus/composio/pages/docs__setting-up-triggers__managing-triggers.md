---
url: https://docs.composio.dev/docs/setting-up-triggers/managing-triggers
title: Managing triggers | Composio
description: List, enable, disable, and delete trigger instances
status: 200
---

Set up triggers

# Managing triggers

Copy page

After a trigger is created, you manage it over its lifecycle: list active instances, pause one with `disable()`, bring it back with `enable()`, or remove it for good with `delete()`.

## [Listing active triggers](https://docs.composio.dev/docs/setting-up-triggers/managing-triggers\#listing-active-triggers)

List the trigger instances you've created. Results are cursor-paginated.

PythonTypeScript

```
from composio import Composio

composio = Composio()

active = composio.triggers.list_active(
    connected_account_ids=["ca_def456"],
)

for trigger in active.items:
    print(f"{trigger.id} ({trigger.trigger_name}) - disabled: {trigger.disabled_at is not None}")

# Paginate with cursor
if active.next_cursor:
    next_page = composio.triggers.list_active(cursor=active.next_cursor)
```

| Filter | Description |
| --- | --- |
| `connected_account_ids` / `connectedAccountIds` | Array of connected account IDs |
| `trigger_ids` / `triggerIds` | Array of trigger instance IDs |
| `trigger_names` / `triggerNames` | Array of trigger type slugs |
| `auth_config_ids` / `authConfigIds` | Array of auth config IDs |
| `show_disabled` / `showDisabled` | Include disabled triggers (default: `false`) |

## [Enable / Disable triggers](https://docs.composio.dev/docs/setting-up-triggers/managing-triggers\#enable--disable-triggers)

Pause a trigger temporarily without deleting it:

PythonTypeScript

```
# Disable a trigger
composio.triggers.disable(trigger_id="ti_abcd123")

# Re-enable when needed
composio.triggers.enable(trigger_id="ti_abcd123")
```

## [Deleting triggers](https://docs.composio.dev/docs/setting-up-triggers/managing-triggers\#deleting-triggers)

Permanently remove a trigger instance:

PythonTypeScript

```
composio.triggers.delete(trigger_id="ti_abcd123")
```

Deleting a trigger is permanent. Use `disable()` instead to temporarily stop receiving events.

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/setting-up-triggers/managing-triggers.mdx)

### On this page

[Listing active triggers](https://docs.composio.dev/docs/setting-up-triggers/managing-triggers#listing-active-triggers) [Enable / Disable triggers](https://docs.composio.dev/docs/setting-up-triggers/managing-triggers#enable--disable-triggers) [Deleting triggers](https://docs.composio.dev/docs/setting-up-triggers/managing-triggers#deleting-triggers)
