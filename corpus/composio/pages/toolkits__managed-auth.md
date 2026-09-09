---
url: https://docs.composio.dev/toolkits/managed-auth
title: Managed OAuth apps | Composio
description: Check whether Composio provides the OAuth app for a toolkit or you need to register your own
status: 200
---

[← All Toolkits](https://docs.composio.dev/toolkits)

# Managed OAuth apps

Copy page

Composio can provide the OAuth app that your users authorize when they connect a toolkit. You do not need to register an OAuth app or supply its client ID and client secret.

Your users still authorize their accounts through a [Connect Link](https://docs.composio.dev/docs/tools-direct/authenticating-tools#hosted-authentication-connect-link). Composio stores and refreshes the resulting tokens. See [Authentication](https://docs.composio.dev/docs/authentication) for the full connection flow.

This page covers only toolkits that support OAuth. It does not list toolkits that use only API keys, bearer tokens, Basic auth, or no authentication.

## [When Composio provides the OAuth app](https://docs.composio.dev/toolkits/managed-auth\#when-composio-provides-the-oauth-app)

For a toolkit with managed OAuth, Composio maintains the OAuth app registration, client credentials, and redirect URI. Your users sign in to the provider and approve the requested permissions.

## [When you provide the OAuth app](https://docs.composio.dev/toolkits/managed-auth\#when-you-provide-the-oauth-app)

Register your own OAuth app when a toolkit does not have managed OAuth. Then create a custom auth config with the app's client ID and client secret.

You can also provide your own OAuth app to show your app name on the consent screen, request custom scopes, or use a separate rate-limit quota.

See [Managed vs custom auth](https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app) for setup steps and trade-offs.

## [Find an OAuth toolkit](https://docs.composio.dev/toolkits/managed-auth\#find-an-oauth-toolkit)

Search for a toolkit to check whether Composio provides a managed OAuth app.

- **Composio-managed OAuth available** means that you can use Composio's OAuth app.
- **Bring your own OAuth app** means that you must register an OAuth app with the provider and create a custom auth config.

Some toolkits support more than one authentication method. A toolkit appears under **Composio-managed OAuth available** when Composio manages at least one OAuth method. Open the toolkit page to check each method.

Loading toolkits...

## [Check with the API](https://docs.composio.dev/toolkits/managed-auth\#check-with-the-api)

Call the toolkit endpoint and read `composio_managed_auth_schemes`:

```
curl 'https://backend.composio.dev/api/v3.1/toolkits/gmail' \
  -H 'x-api-key: YOUR_API_KEY'
```

If `composio_managed_auth_schemes` contains the toolkit's OAuth method, Composio provides the OAuth app. If the field does not contain that method, register your own OAuth app and supply its client ID and client secret.

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/toolkits/managed-auth.mdx)
