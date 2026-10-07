---
url: https://docs.composio.dev/docs/extending-sessions/custom-mcp
title: Custom MCP | Composio
description: Use tools from a remote MCP server in Composio sessions
status: 200
---

Extend sessions

Experimental

# Custom MCP

Copy page

Custom MCP lets you use tools from your remote MCP server in the same session as Composio's built-in toolkits. Register the server, connect it if authentication is required, then add its synced `CUSTOM_*` toolkit slug to a session.

Custom MCP is experimental. Its setup flow, authentication options, and API contracts may change while we work with early customers.

This is different from [Custom Tools and Toolkits](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits). Custom tools run inside your application. A custom MCP server runs outside Composio and exposes its tools over a public HTTPS endpoint.

## [Custom MCP lifecycle](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#custom-mcp-lifecycle)

A Custom MCP moves through this lifecycle:

1. **Deploy** your MCP server at a public HTTPS URL.
2. **Register** its URL and authentication scheme. Composio creates a project-scoped `CUSTOM_*` toolkit.
3. **Connect** an account if the server uses an API key or DCR OAuth. No-auth servers skip this step.
4. **Sync** its tools. The first sync starts automatically; later tool changes require a manual sync.
5. **Use** the toolkit in a session. For authenticated servers, explicitly select the connected account.

API-only while Custom MCP is experimental

Use the lifecycle endpoints below to register, sync, and delete Custom MCP toolkits. The SDKs don't expose these endpoints yet, and their contracts may change while Custom MCP is experimental. The API reference has the full request and response schemas for [upsert](https://docs.composio.dev/reference/api-reference/toolkits/postCustomToolkitsUpsert), [sync](https://docs.composio.dev/reference/api-reference/toolkits/postCustomToolkitsSync), and [delete](https://docs.composio.dev/reference/api-reference/toolkits/deleteCustomToolkitsBySlug). Dashboard management is coming soon for customers who prefer a UI.

## [Register a Custom MCP](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#register-a-custom-mcp)

Call `POST /api/v3.1/custom/toolkits/upsert` with your public server URL and authentication scheme. Authenticate the request with your Composio project API key.

No authAPI keyDCR OAuth

```
curl --request POST \
  --url https://backend.composio.dev/api/v3.1/custom/toolkits/upsert \
  --header "x-api-key: $COMPOSIO_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "slug": "ACME",
    "toolkit_config": {
      "name": "Acme",
      "app_url": "https://mcp.example.com/mcp",
      "auth_schemes": [\
        {\
          "mode": "NO_AUTH"\
        }\
      ]
    }
  }'
```

Composio adds the `CUSTOM_` prefix and returns the normalized toolkit slug:

```
{
  "slug": "CUSTOM_ACME"
}
```

app\_url and auth\_schemes are immutable

Re-registering a slug your project already owns updates the toolkit in place: mutable fields like the name and logo take the new values, and an identical config is a harmless no-op. Two fields can't change after registration: `app_url` and `auth_schemes`. Changing either returns `409 Conflict`; [delete the existing toolkit](https://docs.composio.dev/docs/extending-sessions/custom-mcp#delete-or-replace-a-custom-mcp), then register it again.

## [Add a toolkit logo](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#add-a-toolkit-logo)

Without a logo, your toolkit shows the Composio logo in the dashboard and on end-user connect screens. To ship your own branding, include `toolkit_config.logo_file` when you register: the image itself, base64-encoded. Composio validates it, stores it on Composio-hosted asset storage, and renders it everywhere the toolkit appears. You don't host anything, and the logo keeps working even if your own site changes or goes down.

```
curl --request POST \
  --url https://backend.composio.dev/api/v3.1/custom/toolkits/upsert \
  --header "x-api-key: $COMPOSIO_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "slug": "ACME",
    "toolkit_config": {
      "name": "Acme",
      "app_url": "https://mcp.example.com/mcp",
      "logo_file": {
        "content": "iVBORw0KGgoAAAANSUhEUgAA...",
        "mime_type": "image/png"
      },
      "auth_schemes": [\
        {\
          "mode": "NO_AUTH"\
        }\
      ]
    }
  }'
```

Set `content` to your image encoded as base64: a single line, with no line breaks or whitespace. The image must be:

- **PNG or JPEG** (`mime_type` of `image/png` or `image/jpeg`)
- **Square**, between 256 and 1024 pixels
- **At most 3MB** before encoding

Omit `logo_file` to keep the Composio default. To change a logo later, re-register the same slug with the new image: the upsert updates the toolkit in place.

## [Complete setup for your authentication mode](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#complete-setup-for-your-authentication-mode)

Choose the mode that matches your server, then complete any required connection:

| Authentication | Use it when | After registration |
| --- | --- | --- |
| No auth | The server accepts requests without credentials. | No connection is required. Initial sync runs automatically. |
| API key | Each connected account supplies an API key. | Create an active connection. Initial sync then starts in the background. |
| DCR OAuth | The server supports OAuth Dynamic Client Registration. | Authorize a connection. Initial sync starts when it becomes active. |

For DCR OAuth, the server must support the standard authorization-code flow. Other OAuth grant types aren't supported.

### [Create the auth config for automatic account matching](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#create-the-auth-config-for-automatic-account-matching)

Registering a toolkit does not create an auth config. For API-key and DCR OAuth servers, creating one yourself is a _required_ separate step: without an auth config there is nothing for end users to connect to, and the toolkit's tools can't authenticate. Create it right after registration, with `is_enabled_for_tool_router` set to `true` so sessions can match connected accounts by `user_id`:

```
curl --request POST \
  --url https://backend.composio.dev/api/v3.1/auth_configs \
  --header "x-api-key: $COMPOSIO_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "toolkit": { "slug": "CUSTOM_ACME" },
    "auth_config": {
      "type": "use_custom_auth",
      "authScheme": "API_KEY",
      "credentials": {},
      "is_enabled_for_tool_router": true
    }
  }'
```

This flag is what lets sessions find the toolkit's connected accounts by `user_id` automatically. Without it, session executions fail with `NoActiveConnection` even when an active account exists, and you must [select the account explicitly](https://docs.composio.dev/docs/extending-sessions/custom-mcp#use-an-authenticated-server) in every session. If you already created the config without the flag, patch it:

```
curl --request PATCH \
  --url https://backend.composio.dev/api/v3.1/auth_configs/ac_xxxxxxxx \
  --header "x-api-key: $COMPOSIO_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{ "type": "custom", "is_enabled_for_tool_router": true }'
```

## [Sync and resync tools](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#sync-and-resync-tools)

Call `POST /api/v3.1/custom/toolkits/sync` to fetch the server's current tools:

```
curl --request POST \
  --url https://backend.composio.dev/api/v3.1/custom/toolkits/sync \
  --header "x-api-key: $COMPOSIO_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "slug": "CUSTOM_ACME",
    "connected_account_id": "ca_custom_acme"
  }'
```

For an API-key or DCR OAuth server, `connected_account_id` must identify an active account from the same toolkit and project. For a no-auth server, omit it:

```
curl --request POST \
  --url https://backend.composio.dev/api/v3.1/custom/toolkits/sync \
  --header "x-api-key: $COMPOSIO_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "slug": "CUSTOM_ACME"
  }'
```

A successful sync returns the toolkit version and the number of tools discovered:

```
{
  "slug": "CUSTOM_ACME",
  "version": "20260728_00",
  "synced_count": 12
}
```

When to sync manually

Composio starts the initial sync automatically:

- **No auth:** during registration
- **API key or DCR OAuth:** when the first connected account becomes active

Call the sync endpoint only if the initial sync fails or the server's tool definitions change. Later connections don't resync a toolkit that already has tools.

A Custom MCP toolkit can contain at most 500 tools. If the server returns more than 500, the sync fails without importing a partial tool list. The last successful version stays available.

## [Delete or replace a Custom MCP](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#delete-or-replace-a-custom-mcp)

Re-registering a slug updates mutable fields like the name and logo, but `app_url` and `auth_schemes` can't change after registration. To replace either, delete the toolkit and register it again.

Call `DELETE /api/v3.1/custom/toolkits/{slug}`:

```
curl --request DELETE \
  --url https://backend.composio.dev/api/v3.1/custom/toolkits/CUSTOM_ACME \
  --header "x-api-key: $COMPOSIO_API_KEY"
```

```
{
  "slug": "CUSTOM_ACME",
  "deleted": true,
  "revoke_job_ids": ["job_123"],
  "auth_configs_soft_deleted": 1,
  "connected_accounts_soft_deleted": 1
}
```

Deletion also removes connections

Deletion removes the custom toolkit and its tools. It also revokes and removes the toolkit's auth configurations and connected accounts. Any replacement starts with new connections.

## [Use Custom MCP in a session](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#use-custom-mcp-in-a-session)

Once the toolkit is synced, add its `CUSTOM_*` slug to a session.

### [Use a no-auth server](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#use-a-no-auth-server)

Pass the toolkit slug when you create the session:

PythonTypeScript

```
from composio import Composio

composio = Composio(api_key="your_api_key")

session = composio.sessions.create(
    user_id="user_123",
    toolkits=["CUSTOM_ACME"],
)

tools = session.tools()
```

With the default search-first session, your agent can discover the custom tools through `COMPOSIO_SEARCH_TOOLS` and execute them through the Tool Router.

### [Use an authenticated server](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#use-an-authenticated-server)

Sessions match a connected account by `user_id` automatically when the toolkit's auth config was [created with `is_enabled_for_tool_router: true`](https://docs.composio.dev/docs/extending-sessions/custom-mcp#create-the-auth-config-for-automatic-account-matching). If your auth config doesn't have that flag, explicitly select the connected account in the session config instead:

PythonTypeScript

```
from composio import Composio

composio = Composio(api_key="your_api_key")

session = composio.sessions.create(
    user_id="user_123",
    toolkits=["CUSTOM_ACME"],
    connected_accounts={
        "CUSTOM_ACME": ["ca_custom_acme"],
    },
)
```

The pinned account must belong to the custom toolkit and be active. Explicit selection ensures tool calls use its credentials.

## [What you manage and what Composio handles](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#what-you-manage-and-what-composio-handles)

| Area | You manage | Composio handles |
| --- | --- | --- |
| Server | Deploying and operating the remote MCP server at a public HTTPS URL. | Connecting to the URL for tool discovery and execution. Composio does not host the server. |
| Tools | Implementing tools and deciding when later definition changes are ready to sync. | Starting the initial sync, importing tool schemas, versioning them, and exposing them to sessions. |
| Authentication | Implementing the server's API-key or DCR OAuth behavior and completing each required connection. | Storing connected-account credentials and sending them when discovering or calling tools. |
| Lifecycle | Choosing when to resync, delete, or replace the toolkit. | Providing the project-scoped registration, sync, and deletion operations. |

## [Technical behavior](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#technical-behavior)

Each registered server becomes a custom toolkit scoped to your project:

- The toolkit has `type: "custom"` and the `CUSTOM` category.
- Its slug starts with `CUSTOM_`, such as `CUSTOM_ACME`.
- Its tools are available through Tool Router search and toolkit-filtered tool listing.
- Tool execution is proxied to your MCP server with the selected connected account's credentials.

On v3, `GET /api/v3/tools?toolkit_slug=CUSTOM_ACME` can return an empty list even after a successful sync. This is _not_ a sync failure: v3 reads from a pinned toolkit version by default, and custom tools only exist in the latest version. Add `toolkit_versions=latest` to the request, or use v3.1, which always resolves the latest version:

```
curl --request GET \
  --url "https://backend.composio.dev/api/v3/tools?toolkit_slug=CUSTOM_ACME&toolkit_versions=latest" \
  --header "x-api-key: $COMPOSIO_API_KEY"
```

Custom toolkits use dated registry versions. The v3.1 tools API selects the latest version by default. If you use v3 directly, select the latest version for each operation:

| v3 operation | Select the latest version |
| --- | --- |
| List tools | Add the `toolkit_versions=latest` query parameter. |
| Retrieve one tool | Add the `version=latest` query parameter. |
| Execute one tool | Set `"version": "latest"` in the request body. |

See [Toolkit Versioning](https://docs.composio.dev/docs/tools-direct/toolkit-versioning) for more examples.

## [Known gaps](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#known-gaps)

### Setup and lifecycle

### Sync and authentication

### Sessions and tool APIs

## [Related guides](https://docs.composio.dev/docs/extending-sessions/custom-mcp\#related-guides)

[**Using sessions via MCP** \\
Connect an MCP client to a Composio-hosted session](https://docs.composio.dev/docs/sessions-via-mcp) [**Custom Tools and Toolkits** \\
Run your own tools inside your application process](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits) [**Configuring Sessions** \\
Configure toolkit and tool filtering](https://docs.composio.dev/docs/configuring-sessions) [**Managing Multiple Connected Accounts** \\
Select a connected account explicitly](https://docs.composio.dev/docs/authentication/managing-multiple-connected-accounts)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/extending-sessions/custom-mcp.mdx)

### On this page

[Custom MCP lifecycle](https://docs.composio.dev/docs/extending-sessions/custom-mcp#custom-mcp-lifecycle) [Register a Custom MCP](https://docs.composio.dev/docs/extending-sessions/custom-mcp#register-a-custom-mcp) [Add a toolkit logo](https://docs.composio.dev/docs/extending-sessions/custom-mcp#add-a-toolkit-logo) [Complete setup for your authentication mode](https://docs.composio.dev/docs/extending-sessions/custom-mcp#complete-setup-for-your-authentication-mode) [Create the auth config for automatic account matching](https://docs.composio.dev/docs/extending-sessions/custom-mcp#create-the-auth-config-for-automatic-account-matching) [Sync and resync tools](https://docs.composio.dev/docs/extending-sessions/custom-mcp#sync-and-resync-tools) [Delete or replace a Custom MCP](https://docs.composio.dev/docs/extending-sessions/custom-mcp#delete-or-replace-a-custom-mcp) [Use Custom MCP in a session](https://docs.composio.dev/docs/extending-sessions/custom-mcp#use-custom-mcp-in-a-session) [Use a no-auth server](https://docs.composio.dev/docs/extending-sessions/custom-mcp#use-a-no-auth-server) [Use an authenticated server](https://docs.composio.dev/docs/extending-sessions/custom-mcp#use-an-authenticated-server) [What you manage and what Composio handles](https://docs.composio.dev/docs/extending-sessions/custom-mcp#what-you-manage-and-what-composio-handles) [Technical behavior](https://docs.composio.dev/docs/extending-sessions/custom-mcp#technical-behavior) [Known gaps](https://docs.composio.dev/docs/extending-sessions/custom-mcp#known-gaps) [Related guides](https://docs.composio.dev/docs/extending-sessions/custom-mcp#related-guides)
