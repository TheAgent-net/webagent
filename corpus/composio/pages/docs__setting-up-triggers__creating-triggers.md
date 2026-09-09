---
url: https://docs.composio.dev/docs/setting-up-triggers/creating-triggers
title: Creating triggers | Composio
description: Activate a trigger for a user so events start flowing
status: 200
---

Set up triggers

# Creating triggers

Copy page

A trigger watches for one event (like `GITHUB_COMMIT_EVENT`) on one user's connected account. Create one, and events start flowing to your [subscription or webhook URL](https://docs.composio.dev/docs/setting-up-triggers/subscribing-to-events). For the bigger picture, see [Triggers](https://docs.composio.dev/docs/triggers).

The user needs a [connected account](https://docs.composio.dev/docs/authentication) for the toolkit you want to monitor. See [Authentication](https://docs.composio.dev/docs/authentication) if you haven't set that up.

## [Inspect the trigger type](https://docs.composio.dev/docs/setting-up-triggers/creating-triggers\#inspect-the-trigger-type)

Each trigger type declares the config it needs. Check it before you create, so you pass the right fields.

PythonTypeScript

```
from composio import Composio

composio = Composio()

trigger_type = composio.triggers.get_type("GITHUB_COMMIT_EVENT")
print(trigger_type.config)
# {"properties": {"owner": {...}, "repo": {...}}, "required": ["owner", "repo"]}
```

## [Create the trigger](https://docs.composio.dev/docs/setting-up-triggers/creating-triggers\#create-the-trigger)

Pass the user, the trigger slug, and the config the type requires.

PythonTypeScript

```
from composio import Composio

composio = Composio()
user_id = "user-id-123435"

# The user needs a connected account for this toolkit before this runs.
# Set it up first. See /docs/authentication.
trigger = composio.triggers.create(
    slug="GITHUB_COMMIT_EVENT",
    user_id=user_id,
    trigger_config={"owner": "your-repo-owner", "repo": "your-repo-name"},
)
print(f"Trigger created: {trigger.trigger_id}")
```

You only pass a `user_id`. Composio resolves that user's connected account for the toolkit automatically.

### [Targeting a specific connected account](https://docs.composio.dev/docs/setting-up-triggers/creating-triggers\#targeting-a-specific-connected-account)

If a user has more than one connected account for the toolkit, Composio uses the first active connection for the user and the trigger's toolkit. Pass a connected account ID to pick exactly which account the trigger watches.

PythonTypeScript

```
trigger = composio.triggers.create(
    slug="GITHUB_COMMIT_EVENT",
    user_id=user_id,
    connected_account_id="ca_def456",
    trigger_config={"owner": "your-repo-owner", "repo": "your-repo-name"},
)
```

Trigger instances default to the `'latest'` toolkit version. If you parse payloads against a fixed schema, [pin a version](https://docs.composio.dev/docs/tools-direct/toolkit-versioning#choosing-between-latest-and-a-pinned-version) at SDK initialization.

That's it. The trigger is active. Next, [receive its events](https://docs.composio.dev/docs/setting-up-triggers/subscribing-to-events).

## [Next](https://docs.composio.dev/docs/setting-up-triggers/creating-triggers\#next)

[**Receiving events** \\
Get trigger events locally with the SDK or in production over your webhook URL](https://docs.composio.dev/docs/setting-up-triggers/subscribing-to-events)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/setting-up-triggers/creating-triggers.mdx)

### On this page

[Inspect the trigger type](https://docs.composio.dev/docs/setting-up-triggers/creating-triggers#inspect-the-trigger-type) [Create the trigger](https://docs.composio.dev/docs/setting-up-triggers/creating-triggers#create-the-trigger) [Targeting a specific connected account](https://docs.composio.dev/docs/setting-up-triggers/creating-triggers#targeting-a-specific-connected-account) [Next](https://docs.composio.dev/docs/setting-up-triggers/creating-triggers#next)
