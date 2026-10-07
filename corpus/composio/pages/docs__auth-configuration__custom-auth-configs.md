---
url: https://docs.composio.dev/docs/auth-configuration/custom-auth-configs
title: Custom Auth Configs | Composio
description: Customize auth configs for any toolkit
status: 200
---

Direct auth

Legacy

# Custom Auth Configs

Copy page

If you're building an agent, we recommend using [sessions](https://docs.composio.dev/docs/configuring-sessions) instead. See [Managed vs custom auth](https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app) for how to use custom credentials with sessions.

Auth configs control how users authenticate with a toolkit. By default, Composio provides managed credentials for many toolkits. You create a custom auth config when the defaults don't fit your needs.

## [When to create a custom auth config](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs\#when-to-create-a-custom-auth-config)

| Reason | Example |
| --- | --- |
| **Toolkit has no managed auth** | PostHog, Tavily, Perplexity: you must provide your own credentials |
| **White-labeling** | Show your app name on OAuth consent screens instead of "Composio". See [White-labeling](https://docs.composio.dev/docs/auth-configuration/white-labeling) |
| **Rate limits and quota** | Composio's default OAuth app shares quota across all users. Your own app gets a dedicated quota |
| **Custom scopes** | You need permissions beyond what Composio's default app has approved |
| **Custom instance or subdomain** | Connecting to a self-hosted or regional variant (e.g., custom Salesforce subdomain) |

## [Creating a custom auth config](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs\#creating-a-custom-auth-config)

To create a custom auth config, click **Create Auth Config** in your dashboard, then navigate to **Authentication management** → **Manage authentication with custom credentials**.

You'll need to customize the auth config when you want to use different values than the defaults - such as your own subdomain, base URL, client ID, client secret, etc.

Example: PostHogExample: Hubspot

You may change the subdomain for the PostHog toolkit to match your own instance.

![PostHog Auth Config Settings](https://docs.composio.dev/_next/image?url=%2Fimages%2Fcustom-auth-posthog.png&w=1920&q=75&dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)

PostHog Auth Config Settings

Toolkits that support OAuth2 allow using your own developer app. This is the recommended approach for most cases.

Use your own developer app!

We recommend using your own developer app for the OAuth2 scheme as it is more suited for production usage with many users and more granular control over scopes.

However, getting OAuth approvals takes time, so Composio provides a default developer app!

## [OAuth2 Auth Configs](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs\#oauth2-auth-configs)

Generate the OAuth Client ID and Client Secret

To set up a custom OAuth config, you'll need the OAuth Client ID and Client Secret.

You can generate the client ID and client secret from the toolkit's OAuth configuration page.

Examples for Google and GitHub:

GoogleGitHub

![Google OAuth Configuration](https://docs.composio.dev/_next/image?url=%2Fimages%2Fgoogle-oauth-config.png&w=1920&q=75&dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)

Google OAuth Configuration

Set the Authorized Redirect URI

When creating your OAuth app, make sure to configure the Authorized Redirect URI to point to the Composio callback URL below:

```
https://backend.composio.dev/api/v1/auth-apps/add
```

Create the auth config

Once you have the OAuth credentials, you can add them to the auth config in the dashboard.

1. Select the OAuth2 scheme.
2. Toggle on **Use your own developer credentials**.
3. Enter the OAuth client ID and client secret for your developer app.
4. Click Create!

![Auth Config Settings](https://docs.composio.dev/_next/image?url=%2Fimages%2Fintegration-step-3-0.png&w=1920&q=75&dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)

Auth Config Settings

This auth config is now ready to be used in your application!

PythonTypeScript

```
# Create a new connected account
connection_request = composio.connected_accounts.initiate(
    user_id="user_id",
    auth_config_id="ac_1234",
)
print(connection_request)

# Wait for the connection to be established
connected_account = connection_request.wait_for_connection()
print(connected_account)
```

## [Next](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs\#next)

[**Connected accounts** \\
Manage and monitor user connections to toolkits](https://docs.composio.dev/docs/auth-configuration/connected-accounts)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/auth-configuration/custom-auth-configs.mdx)

### On this page

[When to create a custom auth config](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs#when-to-create-a-custom-auth-config) [Creating a custom auth config](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs#creating-a-custom-auth-config) [OAuth2 Auth Configs](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs#oauth2-auth-configs) [Next](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs#next)
