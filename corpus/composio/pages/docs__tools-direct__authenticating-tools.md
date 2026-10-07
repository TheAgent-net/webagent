---
url: https://docs.composio.dev/docs/tools-direct/authenticating-tools
title: Authenticating Tools | Composio
description: Create auth configs and connect user accounts
status: 200
---

Direct execution

Legacy

# Authenticating Tools

Copy page

If you're building an agent, we recommend using [sessions](https://docs.composio.dev/docs/configuring-sessions) instead. Sessions handle authentication automatically via [in-chat authentication](https://docs.composio.dev/docs/authentication#in-chat-authentication) or [manual authentication](https://docs.composio.dev/docs/authentication/manually-authenticating).

The first step in authenticating your users is to create an **Auth Config**. Every toolkit has its own authentication method such as `OAuth`, `API key`, `Basic Auth`, or custom schemes.

An **Auth Config** is a blueprint that defines how authentication works for a toolkit across all your users. It defines:

1. **Authentication method** \- `OAuth2`, `Bearer token`, `API key`, or `Basic Auth`
2. **Scopes** \- what actions your tools can perform
3. **Credentials** \- whether you'll use your own app credentials or Composio's managed auth

## [Creating an auth config](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#creating-an-auth-config)

### [Using the Dashboard](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#using-the-dashboard)

Selecting a toolkit

Navigate to [Auth Configs](https://dashboard.composio.dev/~/project/auth-configs?utm_source=docs&utm_medium=content&utm_campaign=docs-tools-direct-authenticating-tools) tab in your dashboard and click " **Create Auth Config**". Find and select the toolkit you want to integrate (e.g., **Gmail**, **Slack**, **GitHub**).

Selecting the Authentication method

Each toolkit supports different authentication methods such as **OAuth**, **API Key**, **Bearer Token**. Select from the available options for your toolkit.

Configure scopes

Depending on your authentication method, you may need to configure scopes:

- **OAuth2**: Configure scopes for what data and actions your app can access.
- **API Key/Bearer Token**: Permissions are typically fixed based on the key's access level.

Authentication Management

**For OAuth toolkits:**

- **Development/Testing**: Use Composio's managed authentication (no setup required)
- **Production**: Generate your own OAuth credentials from the toolkit's developer portal

**For custom authentication schemes:**

You must provide your own credentials regardless of environment.

Want to remove Composio branding from OAuth screens? See [White-labeling](https://docs.composio.dev/docs/auth-configuration/white-labeling) for details.

You are all set!

Click " **Create Auth Configuration**" button and you have completed your first step! Now you can move ahead to authenticating your users by [Connecting an Account](https://docs.composio.dev/docs/tools-direct/authenticating-tools#connecting-an-account).

Auth configs are reusable

Auth configs contain your developer credentials and app-level settings ( _scopes_, _authentication method_, etc.). Once created, you can reuse the same auth config for all your users.

### [When to create multiple auth configs?](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#when-to-create-multiple-auth-configs)

You should create multiple auth configs for the same toolkit when you need:

- **Different authentication methods** \- One OAuth config and one API key config
- **Different scopes** \- Separate configs for read-only vs full access
- **Different OAuth apps** \- Using separate client credentials for different environments
- **Different permission levels** \- Limiting actions for specific use cases

[**Programmatic creation** \\
\\
For managing auth configs across multiple projects, you can create them programmatically via the API](https://docs.composio.dev/docs/authentication/programmatic-auth-configs) [**Production white-labeling** \\
\\
Remove Composio branding from OAuth screens for a fully white-labeled authentication experience](https://docs.composio.dev/docs/auth-configuration/white-labeling)

## [Connecting an account](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#connecting-an-account)

With an auth config created, you're ready to authenticate your users!

You can either use [**Connect Link**](https://docs.composio.dev/docs/tools-direct/authenticating-tools#hosted-authentication-connect-link) for a hosted authentication flow, or use [**Direct SDK Setup**](https://docs.composio.dev/docs/tools-direct/authenticating-tools#direct-sdk-setup).

User authentication requires a userID - a unique identifier that groups connected accounts together. Learn more about [User scoping](https://docs.composio.dev/docs/how-composio-works) to understand how to structure userIDs for your application.

**Choose the section below that matches your toolkit's authentication method:**

### [Hosted Authentication (Connect Link)](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#hosted-authentication-connect-link)

Redirect users to a Composio-hosted URL that handles the entire authentication process—OAuth flows, API key collection, or custom fields like subdomain. You can specify a callback URL to control where users return after authentication.

![Connect Link authentication screen](https://docs.composio.dev/_next/image?url=%2Fimages%2Fauth-screen-example.png&w=1920&q=75&dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)

Connect Link authentication screen

PythonTypeScript

```
from composio import Composio

composio = Composio(api_key="your_api_key")

# Use the "AUTH CONFIG ID" from your dashboard
auth_config_id = "your_auth_config_id"

# Use a unique identifier for each user in your application
user_id = 'user-1349-129-12'

connection_request = composio.connected_accounts.link(
    user_id=user_id,
    auth_config_id=auth_config_id,
    callback_url='https://your-app.com/callback'
)

redirect_url = connection_request.redirect_url
print(f"Visit: {redirect_url} to authenticate your account")
```

By default, `link()` refuses to create a second active connection for the same user and auth config. If your user intentionally needs another account on that auth config, pass `allow_multiple=True` in Python or `allowMultiple: true` in TypeScript. Enable [multi-account mode](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts) when a session needs to use those accounts together.

#### [Customizing Connect Link](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#customizing-connect-link)

You can customize the Connect Link with your logo and app title, or fully white-label OAuth consent screens with your own developer apps.

[**White-labeling** \\
Remove Composio branding from OAuth screens and auth flows](https://docs.composio.dev/docs/auth-configuration/white-labeling)

#### [Redirecting users after authentication](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#redirecting-users-after-authentication)

You can include custom query parameters in your callback URL to carry context through the auth flow, such as identifying which user or session triggered the connection. Composio preserves your parameters and appends its own after authentication completes.

| Parameter | Description |
| --- | --- |
| `status` | `success` or `failed` |
| `connected_account_id` | The ID of the newly created connected account |

For example, if your callback URL is `https://your-app.com/callback?user_id=user_123`, the redirect after successful auth will be:

```
https://your-app.com/callback?user_id=user_123&status=success&connected_account_id=ca_abc123
```

### [Direct SDK Setup](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#direct-sdk-setup)

**Choose the section below that matches your toolkit's authentication method:**

#### [OAuth Connections](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#oauth-connections)

**`initiate()` is being retired for Composio-managed OAuth.** If your auth config is Composio-managed (the default — you didn't bring your own OAuth client credentials), `initiate()` will start returning `400 BadRequest` on **2026-05-08** for new organizations and **2026-07-03** for all remaining organizations. Use [Hosted Authentication (Connect Link)](https://docs.composio.dev/docs/tools-direct/authenticating-tools#hosted-authentication-connect-link) above with `composio.connectedAccounts.link()` (TS) / `composio.connected_accounts.link()` (Python) instead — same return shape, same `redirectUrl` / `redirect_url` field, and it works for every redirectable scheme.

Custom auth configs (your own OAuth app) and non-OAuth schemes (API key, bearer token, basic) continue to work on `initiate()` unchanged. See the [migration guide](https://docs.composio.dev/docs/auth-configuration/migrating-initiate-to-link) and the [changelog entry](https://docs.composio.dev/docs/changelog/2026/04/24).

For OAuth flows, you'll redirect users to complete authorization. You can specify a callback URL to control where users return after authentication:

PythonTypeScript

```
from composio import Composio

composio = Composio(api_key="YOUR_COMPOSIO_API_KEY")

# Use the "AUTH CONFIG ID" from your dashboard
auth_config_id = "your_auth_config_id"

# Use a unique identifier for each user in your application
user_id = "user-1349-129-12"

connection_request = composio.connected_accounts.initiate(
  user_id=user_id,
  auth_config_id=auth_config_id,
  config={"auth_scheme": "OAUTH2"},
  callback_url="https://www.yourapp.com/callback"
)
print(f"Redirect URL: {connection_request.redirect_url}")

connected_account = connection_request.wait_for_connection()

# Alternative: if you only have the connection request ID
# connected_account = composio.connected_accounts.wait_for_connection(
#  connection_request.id)
# Recommended when the connection_request object is no longer available

print(f"Connection established: {connected_account.id}")
```

When using callback URLs with `initiate()`, the appended query parameters use camelCase (`connectedAccountId`, `appName`) instead of snake\_case. See [Redirecting users after authentication](https://docs.composio.dev/docs/tools-direct/authenticating-tools#redirecting-users-after-authentication).

#### [Services with Additional Parameters](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#services-with-additional-parameters)

Some services like Zendesk require additional parameters such as `subdomain`:

PythonTypeScript

```
# For Zendesk - include subdomain
connection_request = composio.connected_accounts.initiate(
  user_id=user_id,
  auth_config_id=auth_config_id,
  config=auth_scheme.oauth2(subdomain="mycompany")  # For mycompany.zendesk.com
)
```

#### [API Key Connections](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#api-key-connections)

For API key authentication, you can either collect API keys from each user or use your own API key for all users. Popular toolkits that use API keys include Stripe, Perplexity, etc.

Here is how to initiate the flow:

PythonTypeScript

```
from composio import Composio

composio = Composio(api_key="your_api_key")

# Use the "AUTH CONFIG ID" from your dashboard
auth_config_id = "your_auth_config_id"

# Use a unique identifier for each user in your application
user_id = "user_12323"

# API key provided by the user (collected from your app's UI)
# or use your own key
user_api_key = "user_api_key_here"

connection_request = composio.connected_accounts.initiate(
  user_id=user_id,
  auth_config_id=auth_config_id,
  config={
    "auth_scheme": "API_KEY", "val": {"api_key": user_api_key}
  }
)

print(f"Connection established: {connection_request.id}")
```

## [Fetching the required config parameters for an Auth Config](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#fetching-the-required-config-parameters-for-an-auth-config)

When working with any toolkit, you can inspect an auth config to understand its authentication requirements and expected parameters.

Here is how you would fetch the authentication method and input fields:

PythonTypeScript

```
from composio import Composio

composio = Composio(api_key="your_api_key")

# Use the "AUTH CONFIG ID" from your dashboard
auth_config_id = "your_auth_config_id"

# Fetch the auth configuration details
auth_config = composio.auth_configs.get(auth_config_id)

# Check what authentication method this config uses
print(f"Authentication method: {auth_config.auth_scheme}")

# See what input fields are required
print(f"Required fields: {auth_config.expected_input_fields}")
```

## [Other Authentication Methods](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#other-authentication-methods)

Composio also supports a wide range of other auth schemas:

**Bearer Token** \- Similar to API keys, provide the user's bearer token directly when creating the connection.

**Basic Auth** \- Provide username and password credentials for services that use HTTP Basic Authentication.

**Custom Schemes** \- Some toolkits use their own custom authentication methods. Follow the toolkit-specific requirements for such cases.

Fetching auth config

For any of these methods, [fetch the config parameter](https://docs.composio.dev/docs/tools-direct/authenticating-tools#fetching-the-required-config-parameters-for-an-auth-config) to determine the exact fields required. Every toolkit has its own requirements, and understanding these is essential for successfully creating connections.

Learn how to [Manage connected accounts](https://docs.composio.dev/docs/auth-configuration/connected-accounts) after users authenticate.

## [Connection Statuses](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#connection-statuses)

After creating a connection, it will have one of the following statuses that indicates its current state:

| Status | What it means | What to do |
| --- | --- | --- |
| **ACTIVE** | Connection is working. Tools can be executed. | Nothing — you're good. |
| **INITIATED** | OAuth flow started but the user hasn't completed authentication yet. Auto-expires after 10 minutes. | Redirect the user to the Connect Link to finish authentication. |
| **EXPIRED** | Credentials are no longer valid and Composio cannot refresh them automatically. See [common causes](https://docs.composio.dev/docs/tools-direct/authenticating-tools#why-connections-expire) below. | [Subscribe to expiry events](https://docs.composio.dev/docs/authentication#connection-lifecycle) to detect this proactively, and [re-authenticate the user](https://docs.composio.dev/docs/authentication#connection-lifecycle) to refresh the connection. |
| **FAILED** | The authentication attempt did not succeed. Common causes: user denied consent during OAuth, invalid authorization code, or misconfigured auth config. | Check the `status_reason` field for details and retry the connection. |
| **INACTIVE** | Manually disabled via the API. The connection is preserved but cannot be used to execute tools. | Re-enable it via the API or dashboard to restore access. |

### [Why connections expire](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#why-connections-expire)

Composio automatically refreshes OAuth tokens before they expire. A connection is only marked as **EXPIRED** after refresh attempts have failed. Common reasons:

- **User revoked access** — The user went to the provider's settings (e.g., Google Account > Security > Third-party apps) and removed your app's access.
- **OAuth app deleted or disabled** — The OAuth application credentials were deleted or disabled in the provider's developer console.
- **Refresh token expired** — Some providers (e.g., Google with test/unverified apps) expire refresh tokens after a set period. Once expired, a new OAuth consent flow is required.
- **Provider-side revocation** — The provider revoked tokens due to policy changes, security events, or account-level restrictions.
- **Repeated transient failures** — If token refresh fails multiple times consecutively (e.g., due to prolonged provider outages), Composio marks the connection as expired after a threshold of failures.

In all cases, the user must [re-authenticate](https://docs.composio.dev/docs/authentication#connection-lifecycle) to restore the connection. Check the `status_reason` field on the connected account for the specific reason. You can also [subscribe to connection expiry events](https://docs.composio.dev/docs/authentication#connection-lifecycle) to detect this proactively.

### [Waiting for Connection Establishment](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#waiting-for-connection-establishment)

The `waitForConnection` method allows you to poll for a connection to become active after initiating authentication. This is useful when you need to ensure a connection is ready before proceeding.

PythonTypeScript

```
# Wait for the connection to be established
connected_account = connection_request.wait_for_connection()
print(connected_account.id)

# Alternative: Wait with custom timeout
# connected_account = connection_request.wait_for_connection(120)  # 2 minute timeout

# Alternative: If you only have the connection request ID (e.g., stored in database)
# connection_id = connection_request.id  # You can store this ID in your database
# connected_account = composio.connected_accounts.wait_for_connection(connection_id, 60)
```

The method continuously polls the Composio API until the connection:

- Becomes **ACTIVE** (returns the connected account)
- Enters a terminal state like **FAILED** or **EXPIRED** (throws an error)
- Exceeds the specified timeout (throws a timeout error)

### [Checking Connection Status](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#checking-connection-status)

You can check the status of a connected account programmatically:

PythonTypeScript

```
# Get a specific connected account
connected_account = composio.connected_accounts.get("your_connected_account_id")
print(f"Status: {connected_account.status}")

# Filter connections by user_id, auth_config_id, and status (only active accounts)
filtered_connections = composio.connected_accounts.list(
    user_ids=["user_123"],
    auth_config_ids=["your_auth_config_id"],
    statuses=["ACTIVE"]
)
for connection in filtered_connections.items:
    print(f"{connection.id}: {connection.status}")
```

Only connections with **ACTIVE** status can be used to execute tools. If a connection is in any other state, you'll need to take appropriate action (re-authenticate, wait for processing, etc.) before using it.

## [Next](https://docs.composio.dev/docs/tools-direct/authenticating-tools\#next)

[**Executing tools** \\
Run tools with providers, agentic frameworks, or direct execution](https://docs.composio.dev/docs/tools-direct/executing-tools)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/tools-direct/authenticating-tools.mdx)

### On this page

[Creating an auth config](https://docs.composio.dev/docs/tools-direct/authenticating-tools#creating-an-auth-config) [Using the Dashboard](https://docs.composio.dev/docs/tools-direct/authenticating-tools#using-the-dashboard) [When to create multiple auth configs?](https://docs.composio.dev/docs/tools-direct/authenticating-tools#when-to-create-multiple-auth-configs) [Connecting an account](https://docs.composio.dev/docs/tools-direct/authenticating-tools#connecting-an-account) [Hosted Authentication (Connect Link)](https://docs.composio.dev/docs/tools-direct/authenticating-tools#hosted-authentication-connect-link) [Customizing Connect Link](https://docs.composio.dev/docs/tools-direct/authenticating-tools#customizing-connect-link) [Redirecting users after authentication](https://docs.composio.dev/docs/tools-direct/authenticating-tools#redirecting-users-after-authentication) [Direct SDK Setup](https://docs.composio.dev/docs/tools-direct/authenticating-tools#direct-sdk-setup) [OAuth Connections](https://docs.composio.dev/docs/tools-direct/authenticating-tools#oauth-connections) [Services with Additional Parameters](https://docs.composio.dev/docs/tools-direct/authenticating-tools#services-with-additional-parameters) [API Key Connections](https://docs.composio.dev/docs/tools-direct/authenticating-tools#api-key-connections) [Fetching the required config parameters for an Auth Config](https://docs.composio.dev/docs/tools-direct/authenticating-tools#fetching-the-required-config-parameters-for-an-auth-config) [Other Authentication Methods](https://docs.composio.dev/docs/tools-direct/authenticating-tools#other-authentication-methods) [Connection Statuses](https://docs.composio.dev/docs/tools-direct/authenticating-tools#connection-statuses) [Why connections expire](https://docs.composio.dev/docs/tools-direct/authenticating-tools#why-connections-expire) [Waiting for Connection Establishment](https://docs.composio.dev/docs/tools-direct/authenticating-tools#waiting-for-connection-establishment) [Checking Connection Status](https://docs.composio.dev/docs/tools-direct/authenticating-tools#checking-connection-status) [Next](https://docs.composio.dev/docs/tools-direct/authenticating-tools#next)
