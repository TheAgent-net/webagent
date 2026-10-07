---
url: https://docs.composio.dev/docs/extending-sessions/proxy-execute
title: Proxy execute | Composio
description: Call any API endpoint on a toolkit from a session and let Composio inject the authenticated credentials for you
status: 200
---

Extend sessions

# Proxy execute

Copy page

`session.proxyExecute()` calls any HTTP endpoint on a toolkit your session can already reach, and Composio injects the authentication (OAuth token, API key, basic auth, and so on) on the server side. Your code never handles raw credentials.

The session is already scoped to a [userID](https://docs.composio.dev/docs/how-composio-works), so you pass a `toolkit` slug rather than an account ID. Composio resolves the user's connected account for that toolkit and signs the request with it.

Proxy execute is a building block, not just a fallback. Use it to build experiences on top of Composio that reach past predefined tools, like the [Pi + Slack bot example](https://docs.composio.dev/examples/general-agent-with-pi#reach-the-gaps-with-the-proxy), which drops down to the proxy for the Slack Web API calls the toolkit doesn't wrap as tools. We'll link more examples here as we add them.

Use a scoped API key

Proxy execute is gated behind its own permission. Authenticate with a [scoped project API key](https://docs.composio.dev/reference/authenticating-to-composio/project-api-key-permissions) that has the **Proxy execute** permission granted. Default full-access keys already include it.

## [When to use it](https://docs.composio.dev/docs/extending-sessions/proxy-execute\#when-to-use-it)

- **Endpoints with no predefined tool.** You need a specific endpoint (an unusual GitHub, LinkedIn, or Notion route) that isn't exposed as a Composio tool. Send it through the proxy instead of extracting the raw token and calling the API yourself.
- **Request shapes a tool can't express.** Custom query parameters, partial field masks, or advanced filters on Gmail, Drive, Sheets, and similar. The proxy gives you the full HTTP surface of the upstream API while Composio keeps managing auth.

## [Quick start](https://docs.composio.dev/docs/extending-sessions/proxy-execute\#quick-start)

PythonTypeScript

```
from composio import Composio

composio = Composio(api_key="your_api_key")
session = composio.create("user_123", toolkits=["github"])

response = session.proxy_execute(
    toolkit="github",
    endpoint="/repos/composiohq/composio/issues/1",
    method="GET",
    parameters=[\
        {"name": "Accept", "value": "application/vnd.github.v3+json", "in": "header"},\
    ],
)

print(response["status"])
print(response["data"])
```

The `endpoint` is a path relative to the toolkit's base URL (`/repos/...` resolves against `api.github.com`). Pass an absolute URL only when you need a host that isn't the toolkit's standard API, such as a regional Salesforce or Zendesk domain.

Proxy execute rejects cross-domain requests. The `endpoint` must resolve to the same domain as the toolkit's connected account (a GitHub connection can only call `api.github.com` paths). This is an intentional security boundary, not a quota, so you can't work around it by reshaping the request.

## [Parameters](https://docs.composio.dev/docs/extending-sessions/proxy-execute\#parameters)

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `toolkit` | Yes | `string` | Toolkit slug (`github`, `gmail`, and so on). Composio uses the session user's connected account for this toolkit. |
| `endpoint` | Yes | `string` | Path relative to the toolkit's base URL, or an absolute URL. |
| `method` | Yes | `"GET" | "POST" | "PUT" | "PATCH" | "DELETE"` | HTTP verb. |
| `body` | No | `object` | JSON request body. Used with `POST`, `PUT`, and `PATCH`. |
| `parameters` | No | `Array<{ name, value, in }>` | Extra headers or query parameters. `in` is `"header"` or `"query"`. |

## [Response shape](https://docs.composio.dev/docs/extending-sessions/proxy-execute\#response-shape)

The call forwards the upstream response's status, headers, and parsed body.
Both SDKs expose the same fields; each spells them the way its language does, so
TypeScript reads them as properties and Python as dictionary keys.

| TypeScript | Python | Type | Description |
| --- | --- | --- | --- |
| `status` | `status` | `number` / `int` | HTTP status code from the upstream API. |
| `data` | `data` | `unknown` / `Any` | Parsed JSON body the API returned. Optional in TypeScript; in Python the key is always present but may be `None`. |
| `headers` | `headers` | `Record<string, string>` / `dict[str, str] | None` | Response headers. Optional in TypeScript; in Python the key is always present but may be `None`. |
| `binaryData` | `binary_data` | `object` / `dict` | Present only when the upstream returns a file. |

When the upstream returns a file, the binary entry carries `url`, `contentType`,
`size`, and `expiresAt` in TypeScript, and `url`, `content_type`, `size`, and
`expires_at` in Python. `expires_at` may be absent in TypeScript and `None` in
Python when the upstream gives no expiry. The key is absent entirely when the
response is not a file, so check for it before reading:

PythonTypeScript

```
if "binary_data" in response:
    print(response["binary_data"]["url"])
```

Don't set the `Authorization` header yourself through `parameters`. Composio injects the correct one from the connected account's auth scheme, and setting it manually overrides that credential and usually produces a `401`.

## [Error handling](https://docs.composio.dev/docs/extending-sessions/proxy-execute\#error-handling)

`status` and `data` reflect exactly what the toolkit API returned, so check `status` and branch on the common failures.

| Status | Typical cause | How to resolve |
| --- | --- | --- |
| `400 Bad Request` | Malformed endpoint path, invalid body, or unsupported `method`. | Check the upstream API docs for the expected shape. The proxy doesn't validate upstream schemas. |
| `401 Unauthorized` | The connected account's token expired or was revoked. | Re-authenticate the user, or [import fresh credentials](https://docs.composio.dev/docs/authentication/importing-existing-connections). |
| `403 Forbidden` | The user's OAuth scopes or API key don't cover this endpoint. | Update the [auth config scopes](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs) and have the user re-consent. |
| `429 Too Many Requests` | Upstream rate limit (GitHub, Google, and so on). | Honor the `Retry-After` header and back off. Composio doesn't retry automatically. |

## [Next](https://docs.composio.dev/docs/extending-sessions/proxy-execute\#next)

[**Custom tools and toolkits** \\
Define in-process tools and toolkits that run alongside Composio tools](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/extending-sessions/proxy-execute.mdx)

### On this page

[When to use it](https://docs.composio.dev/docs/extending-sessions/proxy-execute#when-to-use-it) [Quick start](https://docs.composio.dev/docs/extending-sessions/proxy-execute#quick-start) [Parameters](https://docs.composio.dev/docs/extending-sessions/proxy-execute#parameters) [Response shape](https://docs.composio.dev/docs/extending-sessions/proxy-execute#response-shape) [Error handling](https://docs.composio.dev/docs/extending-sessions/proxy-execute#error-handling) [Next](https://docs.composio.dev/docs/extending-sessions/proxy-execute#next)
