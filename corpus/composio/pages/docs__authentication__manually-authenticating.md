---
url: https://docs.composio.dev/docs/authentication/manually-authenticating
title: Manual auth management | Composio
description: Authenticate and manage user connections to toolkits outside of chat
status: 200
---

[Authentication](https://docs.composio.dev/docs/authentication)

# Manual auth management

Copy page

Manual authentication lets you connect users to toolkits outside the chat flow. Reach for it when you want to:

- Pre-authenticate users before they start chatting.
- Build a custom connections UI in your app.

## [Authorize a toolkit](https://docs.composio.dev/docs/authentication/manually-authenticating\#authorize-a-toolkit)

Call `session.authorize()` to generate a [Connect Link](https://docs.composio.dev/docs/tools-direct/authenticating-tools#hosted-authentication-connect-link) URL, redirect the user, and wait for them to finish:

PythonTypeScript

```
session = composio.create(user_id="user_123")

connection_request = session.authorize("gmail")

print(connection_request.redirect_url)
# https://connect.composio.dev/link/ln_abc123

connected_account = connection_request.wait_for_connection(60000)
print(f"Connected: {connected_account.id}")
```

Redirect the user to the `redirectUrl`. After they authenticate, they'll return to your callback URL. The connection request polls until the user completes authentication (default timeout: 60 seconds).

If the user closes the Connect Link without completing auth, the connection remains in `INITIATED` status until it expires.

## [Redirecting users after authentication](https://docs.composio.dev/docs/authentication/manually-authenticating\#redirecting-users-after-authentication)

Pass a `callbackUrl` to control where users land after authenticating. You can include query parameters to carry context through the flow, for example to identify which `userID` or session triggered the connection.

PythonTypeScript

```
connection_request = session.authorize(
    "gmail",
    callback_url="https://your-app.com/callback?user_id=user_123&source=onboarding"
)

print(connection_request.redirect_url)
```

After authentication, Composio redirects the user to your callback URL with the following parameters appended, while preserving your existing ones:

| Parameter | Description |
| --- | --- |
| `status` | `success` or `failed` |
| `connected_account_id` | The ID of the newly created connected account |

```
https://your-app.com/callback?user_id=user_123&source=onboarding&status=success&connected_account_id=ca_abc123
```

## [Check connection status](https://docs.composio.dev/docs/authentication/manually-authenticating\#check-connection-status)

Use `session.toolkits()` to see all toolkits in the session and their connection status:

PythonTypeScript

```
toolkits = session.toolkits()

for toolkit in toolkits.items:
    status = toolkit.connection.connected_account.id if toolkit.connection.is_active else "Not connected"
    print(f"{toolkit.name}: {status}")
```

## [Disabling in-chat auth](https://docs.composio.dev/docs/authentication/manually-authenticating\#disabling-in-chat-auth)

By default, sessions include the `COMPOSIO_MANAGE_CONNECTIONS` meta-tool that prompts users to authenticate during chat. To turn it off and handle auth entirely in your own UI, set `manage_connections` to `False`:

PythonTypeScript

```
session = composio.create(
    user_id="user_123",
    manage_connections=False,
)
```

## [Putting it together](https://docs.composio.dev/docs/authentication/manually-authenticating\#putting-it-together)

A common pattern is to verify all required connections before starting the agent:

PythonTypeScript

```
from composio import Composio

composio = Composio(api_key="your-api-key")

required_toolkits = ["gmail", "github"]

session = composio.create(
    user_id="user_123",
    manage_connections=False,  # Disable in-chat auth prompts
)

toolkits = session.toolkits()

connected = {t.slug for t in toolkits.items if t.connection.is_active}
pending = [slug for slug in required_toolkits if slug not in connected]

print(f"Connected: {connected}")
print(f"Pending: {pending}")

for slug in pending:
    connection_request = session.authorize(slug)
    print(f"Connect {slug}: {connection_request.redirect_url}")
    connection_request.wait_for_connection()

print("All toolkits connected!")
```

## [Next](https://docs.composio.dev/docs/authentication/manually-authenticating\#next)

[**Managing multiple connected accounts** \\
Let a user connect work and personal accounts for the same toolkit, then pick which one runs](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/authentication/manually-authenticating.mdx)

### On this page

[Authorize a toolkit](https://docs.composio.dev/docs/authentication/manually-authenticating#authorize-a-toolkit) [Redirecting users after authentication](https://docs.composio.dev/docs/authentication/manually-authenticating#redirecting-users-after-authentication) [Check connection status](https://docs.composio.dev/docs/authentication/manually-authenticating#check-connection-status) [Disabling in-chat auth](https://docs.composio.dev/docs/authentication/manually-authenticating#disabling-in-chat-auth) [Putting it together](https://docs.composio.dev/docs/authentication/manually-authenticating#putting-it-together) [Next](https://docs.composio.dev/docs/authentication/manually-authenticating#next)
