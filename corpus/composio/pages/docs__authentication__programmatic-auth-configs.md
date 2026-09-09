---
url: https://docs.composio.dev/docs/authentication/programmatic-auth-configs
title: Programmatic auth configs | Composio
description: Create auth configs in code and pass them to a session
status: 200
---

[Authentication](https://docs.composio.dev/docs/authentication)

# Programmatic auth configs

Copy page

An [auth config](https://docs.composio.dev/docs/authentication#behind-the-scenes) is a blueprint for how a toolkit authenticates: the method, scopes, and credentials. Most of the time you create one in the [dashboard](https://dashboard.composio.dev/~/project/auth-configs?utm_source=docs&utm_medium=content&utm_campaign=docs-programmatic-auth-configs) and reuse it. Create them in code when you provision auth dynamically: a config per customer, per environment, or spun up and torn down as part of your app's lifecycle.

`composio.authConfigs.create()` returns an auth config ID like `ac_xxxxxxxx`. Store that ID, then [pass it to a session](https://docs.composio.dev/docs/authentication/programmatic-auth-configs#use-the-auth-config-in-a-session) so the session authenticates with it.

## [Composio managed auth](https://docs.composio.dev/docs/authentication/programmatic-auth-configs\#composio-managed-auth)

For OAuth2 toolkits, Composio maintains a managed app so you can create an auth config without bringing your own credentials. This is the fastest way to start.

PythonTypeScript

```
from composio import Composio

composio = Composio()

auth_config = composio.auth_configs.create(
    toolkit="github",
    options={"type": "use_composio_managed_auth", "name": "GitHub"},
)

print(auth_config.id)  # ac_xxxxxxxx
```

## [Your own OAuth2 credentials](https://docs.composio.dev/docs/authentication/programmatic-auth-configs\#your-own-oauth2-credentials)

Bring your own OAuth app to show your branding on consent screens, request custom scopes, or get a dedicated rate-limit quota. Register the app in the provider's developer portal, set its authorized redirect URI to Composio's callback, then pass the client ID and secret.

```
https://backend.composio.dev/api/v1/auth-apps/add
```

PythonTypeScript

```
import os
from composio import Composio

composio = Composio()

auth_config = composio.auth_configs.create(
    toolkit="notion",
    options={
        "type": "use_custom_auth",
        "auth_scheme": "OAUTH2",
        "name": "Notion",
        "credentials": {
            "client_id": os.environ["NOTION_CLIENT_ID"],
            "client_secret": os.environ["NOTION_CLIENT_SECRET"],
            "oauth_redirect_uri": "https://backend.composio.dev/api/v1/auth-apps/add",
        },
    },
)
```

Omit `oauth_redirect_uri` to use Composio's default callback. Set it only when you [route the callback through your own domain](https://docs.composio.dev/docs/authentication/white-labeling-authentication#routing-the-callback-through-your-domain).

## [Other auth types](https://docs.composio.dev/docs/authentication/programmatic-auth-configs\#other-auth-types)

Toolkits that use API keys, bearer tokens, basic auth, or no auth follow the same call. Set `auth_scheme` to the toolkit's scheme and put the required fields in `credentials`. For a toolkit whose key the user supplies at connect time, pass empty `credentials`.

PythonTypeScript

```
auth_config = composio.auth_configs.create(
    toolkit="perplexityai",
    options={
        "type": "use_custom_auth",
        "auth_scheme": "API_KEY",
        "name": "Perplexity AI",
        "credentials": {},
    },
)
```

## [Use the auth config in a session](https://docs.composio.dev/docs/authentication/programmatic-auth-configs\#use-the-auth-config-in-a-session)

Creating an auth config does not change which credentials a session uses. Pass the auth config ID to `authConfigs` (keyed by toolkit) when you create the session, and the session authenticates that toolkit with your config. Toolkits you leave out keep using Composio managed auth.

PythonTypeScript

```
session = composio.sessions.create(
    user_id="user_123",
    auth_configs={"notion": auth_config.id},
)
```

See [Configuring sessions](https://docs.composio.dev/docs/configuring-sessions#custom-auth-configs) for how `authConfigs` interacts with account selection and precedence.

## [Find auth configs](https://docs.composio.dev/docs/authentication/programmatic-auth-configs\#find-auth-configs)

In TypeScript, filter `authConfigs.list()` by name or ID with `search`. Disabled configs are excluded by default; set `showDisabled` to include them. Auth config responses use `id` as their canonical identifier.

```
const configs = await composio.authConfigs.list({
  search: 'github',
  showDisabled: true,
});

for (const config of configs.items) {
  console.log(config.id);
}
```

## [Discover the required fields](https://docs.composio.dev/docs/authentication/programmatic-auth-configs\#discover-the-required-fields)

Different schemes need different credential fields. To build the `credentials` object dynamically, ask the toolkit which fields it requires for a given scheme before you create the config.

PythonTypeScript

```
fields = composio.toolkits.get_auth_config_creation_fields(
    toolkit="notion",
    auth_scheme="OAUTH2",
    required_only=True,
)
print(fields)
```

## [Next](https://docs.composio.dev/docs/authentication/programmatic-auth-configs\#next)

[**Controlling scopes** \\
Override the default OAuth scopes Composio requests for a toolkit](https://docs.composio.dev/docs/authentication/controlling-scopes)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/authentication/programmatic-auth-configs.mdx)

### On this page

[Composio managed auth](https://docs.composio.dev/docs/authentication/programmatic-auth-configs#composio-managed-auth) [Your own OAuth2 credentials](https://docs.composio.dev/docs/authentication/programmatic-auth-configs#your-own-oauth2-credentials) [Other auth types](https://docs.composio.dev/docs/authentication/programmatic-auth-configs#other-auth-types) [Use the auth config in a session](https://docs.composio.dev/docs/authentication/programmatic-auth-configs#use-the-auth-config-in-a-session) [Find auth configs](https://docs.composio.dev/docs/authentication/programmatic-auth-configs#find-auth-configs) [Discover the required fields](https://docs.composio.dev/docs/authentication/programmatic-auth-configs#discover-the-required-fields) [Next](https://docs.composio.dev/docs/authentication/programmatic-auth-configs#next)
