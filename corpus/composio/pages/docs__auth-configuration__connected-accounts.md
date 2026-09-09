---
url: https://docs.composio.dev/docs/auth-configuration/connected-accounts
title: Connected Accounts | Composio
description: Manage and monitor user connections to toolkits
status: 200
---

Direct auth

Legacy

# Connected Accounts

Copy page

If you're building an agent, we recommend using [sessions](https://docs.composio.dev/docs/configuring-sessions) instead. See [Managing multiple connected accounts](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts) for how sessions handle account selection automatically.

Connected accounts are authenticated connections between your users and toolkits. After users authenticate (see [Authenticating tools](https://docs.composio.dev/docs/tools-direct/authenticating-tools)), you can manage these accounts throughout their lifecycle.

Composio automatically handles token refresh and credential management. This guide covers manual operations: listing, retrieving, refreshing, enabling, disabling, and deleting accounts.

## [List accounts](https://docs.composio.dev/docs/auth-configuration/connected-accounts\#list-accounts)

Retrieve all connected accounts with optional filters:

PythonTypeScript

```
# List all accounts for a user
accounts = composio.connected_accounts.list(
    user_ids=[user_id]
)

# Filter by status
active_accounts = composio.connected_accounts.list(
    user_ids=[user_id],
    statuses=["ACTIVE"]
)
```

## [Get account details](https://docs.composio.dev/docs/auth-configuration/connected-accounts\#get-account-details)

Retrieve a connected account by ID:

PythonTypeScript

```
account = composio.connected_accounts.get(connected_account_id)

print(f"Status: {account.status}")
print(f"Toolkit: {account.toolkit.slug}")
```

### [Get account credentials](https://docs.composio.dev/docs/auth-configuration/connected-accounts\#get-account-credentials)

Get account credentials for use with your own tools:

PythonTypeScript

```
# Get the connected account's authentication state
if account.state:
    # The state contains the auth scheme and credentials
    auth_scheme = account.state.auth_scheme
    credentials = account.state.val

    print(f"Auth scheme: {auth_scheme}")
    print(f"Credentials: {credentials}")
```

## [Refresh credentials](https://docs.composio.dev/docs/auth-configuration/connected-accounts\#refresh-credentials)

Manually refresh credentials for a connected account:

PythonTypeScript

```
try:
    refreshed = composio.connected_accounts.refresh(connected_account_id)
    print(f"Redirect URL: {refreshed.redirect_url}")

    # Wait for the connection to be established
    composio.connected_accounts.wait_for_connection(refreshed.id)
except Exception as e:
    print(f"Failed to refresh tokens: {e}")
```

## [Enable and disable accounts](https://docs.composio.dev/docs/auth-configuration/connected-accounts\#enable-and-disable-accounts)

Change account status without deleting. Set to INACTIVE to pause access, or ACTIVE to restore. Useful for:

- Pausing access during subscription lapses
- Temporary disconnection

PythonTypeScript

```
# Disable an account
disabled = composio.connected_accounts.disable(connected_account_id)
print(f"Account disabled status: {disabled.success}")

# Re-enable when needed
enabled = composio.connected_accounts.enable(connected_account_id)
print(f"Account enabled status: {enabled.success}")
```

INACTIVE accounts cannot execute tools. Tool execution will fail until the status is changed.

## [Delete accounts](https://docs.composio.dev/docs/auth-configuration/connected-accounts\#delete-accounts)

Permanently remove a connected account:

PythonTypeScript

```
# Delete a connected account
composio.connected_accounts.delete(connected_account_id)
print("Account deleted successfully")
```

Deletion is permanent and cannot be undone.

## [Credential masking](https://docs.composio.dev/docs/auth-configuration/connected-accounts\#credential-masking)

By default, sensitive fields in connected account responses are partially masked for security. This affects fields like `access_token`, `refresh_token`, `api_key`, `bearer_token`, `password`, and other secrets.

Instead of returning full values, the API returns the first 4 characters followed by `...`:

```
{
  "access_token": "gho_...",
  "refresh_token": "ghr_...",
  "api_key": "sk-l..."
}
```

Values shorter than 4 characters are replaced with `REDACTED`.

This applies to the Get Connected Account and List Connected Accounts endpoints.

If your use case requires calling a provider API directly, use [Proxy execute](https://docs.composio.dev/docs/extending-sessions/proxy-execute). Composio injects the connected account's credentials server-side.

## [Multiple accounts](https://docs.composio.dev/docs/auth-configuration/connected-accounts\#multiple-accounts)

Users can connect multiple accounts for the same toolkit (e.g., personal and work Gmail).

**For Composio-managed OAuth, prefer `link()`.** The `initiate()` examples below will stop working for Composio-managed OAuth auth configs starting **2026-05-08** (new orgs) / **2026-07-03** (all orgs). `link()` provides hosted authentication and is unaffected by the rollout. Like `initiate()`, it refuses to create a second active connection for the same user and auth config unless you pass `allow_multiple=True` (Python) or `allowMultiple: true` (TypeScript). See [Connect Link authentication](https://docs.composio.dev/docs/tools-direct/authenticating-tools#hosted-authentication-connect-link), the [migration guide](https://docs.composio.dev/docs/auth-configuration/migrating-initiate-to-link), or the [changelog entry](https://docs.composio.dev/docs/changelog/2026/04/24).

The `initiate()` examples remain accurate for **custom auth configs** (your own OAuth app) and **non-OAuth schemes** (API key, bearer, basic) — those are unaffected.

PythonTypeScript

```
# First account
try:
    first_account = composio.connected_accounts.initiate(
        user_id=user_id,
        auth_config_id=auth_config_id
    )
    print(f"First account redirect URL: {first_account.redirect_url}")
    connected_first_account = first_account.wait_for_connection()
    print(f"First account status: {connected_first_account.status}")
except Exception as e:
    print(f"Error initiating first account: {e}")

# Second account - must explicitly allow multiple
try:
    second_account = composio.connected_accounts.initiate(
        user_id=user_id,
        auth_config_id=auth_config_id,
        allow_multiple=True  # Required for additional accounts
    )
    print(f"Second account redirect URL: {second_account.redirect_url}")
    connected_second_account = second_account.wait_for_connection()
    print(f"Second account status: {connected_second_account.status}")
except Exception as e:
    print(f"Error initiating second account: {e}")
```

For session-based apps, see [Managing multiple connected accounts](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts) for how to pass a specific account to a session.

### [Execute with a specific account](https://docs.composio.dev/docs/auth-configuration/connected-accounts\#execute-with-a-specific-account)

When you have multiple accounts, specify which one to use with `connected_account_id`:

PythonTypeScript

```
# Execute tool with a specific connected account
result = composio.tools.execute(
    "GMAIL_GET_PROFILE",
    user_id=user_id,
    connected_account_id=connected_account_id,  # Specify which account to use
    version="20251111_00",
    arguments={}
)
print(f"Tool executed: {result}")
```

## [Next](https://docs.composio.dev/docs/auth-configuration/connected-accounts\#next)

[**Authenticating tools** \\
Create auth configs and connect user accounts](https://docs.composio.dev/docs/tools-direct/authenticating-tools)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/auth-configuration/connected-accounts.mdx)

### On this page

[List accounts](https://docs.composio.dev/docs/auth-configuration/connected-accounts#list-accounts) [Get account details](https://docs.composio.dev/docs/auth-configuration/connected-accounts#get-account-details) [Get account credentials](https://docs.composio.dev/docs/auth-configuration/connected-accounts#get-account-credentials) [Refresh credentials](https://docs.composio.dev/docs/auth-configuration/connected-accounts#refresh-credentials) [Enable and disable accounts](https://docs.composio.dev/docs/auth-configuration/connected-accounts#enable-and-disable-accounts) [Delete accounts](https://docs.composio.dev/docs/auth-configuration/connected-accounts#delete-accounts) [Credential masking](https://docs.composio.dev/docs/auth-configuration/connected-accounts#credential-masking) [Multiple accounts](https://docs.composio.dev/docs/auth-configuration/connected-accounts#multiple-accounts) [Execute with a specific account](https://docs.composio.dev/docs/auth-configuration/connected-accounts#execute-with-a-specific-account) [Next](https://docs.composio.dev/docs/auth-configuration/connected-accounts#next)
