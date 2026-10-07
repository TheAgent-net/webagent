---
url: https://docs.composio.dev/docs/auth-configuration/white-labeling
title: White-labeling (direct execution) | Composio
description: Remove Composio branding from your auth flows
status: 200
---

Direct auth

Legacy

# White-labeling (direct execution)

Copy page

If you're building an agent with sessions, see [White-labeling authentication](https://docs.composio.dev/docs/authentication/white-labeling-authentication) instead.

There are four places where Composio branding shows up during authentication:

| Where | What users see | How to fix |
| --- | --- | --- |
| [**Connect Link page**](https://docs.composio.dev/docs/auth-configuration/white-labeling#customizing-the-connect-link) | Composio logo, name, and styling on the hosted auth page | Set your logo, app title, and theme in the dashboard |
| [**OAuth consent screen**](https://docs.composio.dev/docs/auth-configuration/white-labeling#using-your-own-oauth-apps) | "Composio wants to access your account" on Google, GitHub, etc. | Use your own OAuth app |
| [**Outgoing redirect**](https://docs.composio.dev/docs/auth-configuration/white-labeling#sending-users-directly-to-the-oauth-provider) | `backend.composio.dev` in browser before reaching OAuth provider | Use `long_redirect_url` option |
| [**Return redirect**](https://docs.composio.dev/docs/auth-configuration/white-labeling#routing-the-callback-through-your-domain) | `backend.composio.dev` flashes when OAuth provider redirects back | Proxy the redirect through your domain |

## [Customizing the Connect Link](https://docs.composio.dev/docs/auth-configuration/white-labeling\#customizing-the-connect-link)

The Connect Link is the hosted page your users see when connecting their accounts. By default it shows Composio branding on a neutral light theme. You can swap in your logo and name, then restyle the whole page to match your product.

Everything here lives in **Project Settings** → [**White Labeling**](https://dashboard.composio.dev/~/project/settings/auth-screen?utm_source=docs&utm_medium=content&utm_campaign=docs-auth-configuration-white-labeling). Changes apply to every Connect Link flow across all toolkits. Each project has one branding and one theme, so if you need a different look per product, use separate projects.

### [Logo and name](https://docs.composio.dev/docs/auth-configuration/white-labeling\#logo-and-name)

1. Go to **Project Settings** → **White Labeling**, and open the **Branding** tab.
2. Set your **App Title** and upload your **Logo** (a square JPEG or PNG, 256×256 to 1024×1024 pixels).

The logo replaces the Composio mark at the top of the page, and the app title replaces "Composio" in the "...wants to connect to your account" heading.

This only changes the Composio-hosted page. For OAuth toolkits like Gmail, Google Sheets, GitHub, and Slack, users still see a consent screen saying "Composio wants to access your account." To change that, and to remove the "Secured by Composio" badge, set up your own OAuth app as described [below](https://docs.composio.dev/docs/auth-configuration/white-labeling#using-your-own-oauth-apps).

### [Colors, fonts, and per-element styling](https://docs.composio.dev/docs/auth-configuration/white-labeling\#colors-fonts-and-per-element-styling)

Open the **Styling** tab to restyle the entire Connect Link page. A live preview sits beside the controls and updates as you edit, and you can preview each state of the flow with the **Welcome**, **Form**, **Success**, and **Error** tabs.

![The White Labeling editor with a live preview on the left and styling controls on the right](https://docs.composio.dev/_next/image?url=%2Fimages%2Fauth-screen-theme-editor.png&w=1920&q=75&dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)

Editing colors, fonts, and per-element styling with a live preview of the Connect Link

Set the page-wide defaults first:

- **Seed colours** for the page background, card, foreground text, and primary accent, plus secondary and tertiary accents for decorative touches.
- **Typefaces**: a display font for headings and a body font, each chosen from a curated set. The default is ABC Diatype.
- **Geometry**: corner radius and border width, which set the roundness and outline weight of cards, buttons, and inputs.

For finer control, select any element in the preview to style just that element. Editable elements cover the page and card surfaces, the heading, body, and field labels, the primary and secondary buttons, the input, the error notice, links, and the logo. Depending on the element you can set its colour, background, border, corner radius, shadow, and text size, weight, letter spacing, and case.

Contrast is enforced

Text has to stay legible against its background. The editor shows the contrast ratio for each text element and disables **Save Changes** until every element passes, so you can't ship an unreadable page by accident.

Prefer to work in code? Flip the **JSON** toggle to edit the theme as a single object you can paste, review, or generate. Your logo and app title stay in the **Branding** tab, since the logo has no JSON representation.

Troubleshooting

- **"Secured by Composio" badge won't go away:** this badge is removed when you use your own OAuth app. See [Using your own OAuth apps](https://docs.composio.dev/docs/auth-configuration/white-labeling#using-your-own-oauth-apps).
- **Logo doesn't appear after uploading:** clear your browser cache or try incognito.
- **Upload fails with "failed to fetch":** retry or use a smaller image.
- **You see the Branding tab but no Styling tab:** theming is still rolling out. If it isn't enabled for your project yet, reach out. The logo and app title keep working in the meantime.

## [Using your own OAuth apps](https://docs.composio.dev/docs/auth-configuration/white-labeling\#using-your-own-oauth-apps)

OAuth toolkits like Google and GitHub show a consent screen that says which app is requesting access. By default this reads "Composio wants to connect to your account." To show your app name instead, register your own OAuth app and tell Composio to use it. This is done by creating a [custom auth config](https://docs.composio.dev/docs/auth-configuration/custom-auth-configs) with your own credentials. See [when to use your own OAuth apps](https://docs.composio.dev/docs/auth-configuration/white-labeling#when-to-use-your-own-oauth-apps).

You don't need this for every toolkit

Only white-label toolkits where users see a consent screen (Google, GitHub, Slack, etc.). Toolkits that use API keys don't show consent screens, so there's nothing to white-label. You can mix and match freely.

Create an OAuth app in the toolkit's developer portal

Register a new OAuth app with the toolkit. Set the callback URL to:

```
https://backend.composio.dev/api/v1/auth-apps/add
```

You'll get a **Client ID** and **Client Secret**.

Step-by-step guides: [Google](https://composio.dev/auth/googleapps) \| [Slack](https://composio.dev/auth/slack) \| [HubSpot](https://composio.dev/auth/hubspot) \| [All toolkits](https://composio.dev/auth)

Create an auth config in Composio

In the [Composio dashboard](https://dashboard.composio.dev/?utm_source=docs&utm_medium=content&utm_campaign=docs-auth-configuration-white-labeling):

1. Go to **Authentication management** → **Create Auth Config**
2. Select the toolkit (e.g., GitHub)
3. Choose **OAuth2** scheme
4. Toggle on **Use your own developer credentials**
5. Enter your **Client ID** and **Client Secret**
6. Click **Create**

Copy the auth config ID (e.g., `ac_1234abcd`).

Pass the auth config ID when initiating a connection

Pass your custom auth config ID when initiating a connection:

PythonTypeScript

```
from composio import Composio

composio = Composio(api_key="your_api_key")

# White-labeled: users see your brand on the consent screen
github_conn = composio.connected_accounts.initiate(
    user_id="user_123",
    auth_config_id="ac_your_github_config",
)
print(f"Redirect to: {github_conn.redirect_url}")
```

For toolkits you haven't white-labeled, use the auth config ID from **Authentication management** in your dashboard.

### [When to use your own OAuth apps](https://docs.composio.dev/docs/auth-configuration/white-labeling\#when-to-use-your-own-oauth-apps)

- **Production apps** where end users see consent screens. They should see your brand, not Composio's.
- **Enterprise customers** who require your branding end-to-end.
- **Toolkits where you need custom scopes** beyond what Composio's default app provides.

For development and testing, Composio's managed auth works fine. No OAuth app setup required.

### [Switching from Composio-managed to your own OAuth app](https://docs.composio.dev/docs/auth-configuration/white-labeling\#switching-from-composio-managed-to-your-own-oauth-app)

Existing connected accounts are permanently tied to the auth config they were created with. Switching to a custom auth config does not affect them.

- Existing connections keep working. Tokens continue refreshing using the original auth config's credentials.
- New connections use your custom auth config. Users who connect after the switch will see your app name on the consent screen.
- To fully migrate a user, delete their old connected account and have them re-authenticate through your OAuth app.

## [Sending users directly to the OAuth provider](https://docs.composio.dev/docs/auth-configuration/white-labeling\#sending-users-directly-to-the-oauth-provider)

By default, when you initiate a connection, Composio returns a shortened redirect URL (`backend.composio.dev/api/v3/s/...`). The user's browser hits this URL first, then gets redirected to the OAuth provider. This means `backend.composio.dev` briefly appears in the browser.

To skip this and send users directly to the OAuth provider, pass `long_redirect_url: true` when initiating the connection:

PythonTypeScript

```
from composio import Composio

composio = Composio(api_key="your_api_key")

github_conn = composio.connected_accounts.initiate(
    user_id="user_123",
    auth_config_id="ac_your_github_config",
    config={
        "auth_scheme": "OAUTH2",
        "val": {"status": "INITIALIZING", "long_redirect_url": True},
    },
)
print(f"Redirect to: {github_conn.redirect_url}")
```

The redirect URL returned will point directly to the OAuth provider (e.g., `accounts.google.com/o/oauth2/auth?...`) instead of going through Composio first.

## [Routing the callback through your domain](https://docs.composio.dev/docs/auth-configuration/white-labeling\#routing-the-callback-through-your-domain)

After the user authorizes, the OAuth provider redirects back through `backend.composio.dev` so Composio can capture the auth token. Some toolkits also display this URL on the consent screen.

If you need to hide Composio's domain from this return redirect, you can proxy it through your own domain.

Set the redirect URI to your domain

In your OAuth app's settings, set the authorized redirect URI to your own endpoint:

```
https://yourdomain.com/api/composio-redirect
```

Create a proxy endpoint

This endpoint receives the OAuth callback and immediately 302-redirects it to Composio:

PythonTypeScript

```
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse

app = FastAPI()

@app.get("/api/composio-redirect")
def composio_redirect(request: Request):
    composio_url = "https://backend.composio.dev/api/v1/auth-apps/add"
    return RedirectResponse(url=f"{composio_url}?{request.url.query}")
```

Your endpoint must return a **302 redirect**. Do not follow the redirect server-side or make a fetch call to Composio. The user's browser needs to be redirected so the OAuth flow completes correctly.

Update your auth config

In the Composio dashboard, update your auth config to use your custom redirect URI.

![Auth Config Settings](https://docs.composio.dev/_next/image?url=%2Fimages%2Fcustom-redirect-uri.png&w=1920&q=75&dpl=dpl_FxDdGrpGc3guBWPQvhpW9JexWTb7)

Setting the custom redirect URI in your auth config

Here's how the redirect flow works. Your proxy just forwards the browser redirect to Composio. It never touches the authorization code or token.

oauth.redirectbrowser hops only

`Your app`user starts here

→ user connects

`OAuth toolkit`Google, GitHub, …

→ redirects user

`yourdomain.com`your proxy endpoint

→ forwards redirect

`backend.composio.dev`captures the token

Composio redirects the user back to`your app`. Your proxy never sees the token

For FAQs and setup guides for individual toolkits, browse the [toolkits page](https://docs.composio.dev/toolkits).

## [Next](https://docs.composio.dev/docs/auth-configuration/white-labeling\#next)

[**Connected accounts** \\
Manage and monitor user connections to toolkits](https://docs.composio.dev/docs/auth-configuration/connected-accounts)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/auth-configuration/white-labeling.mdx)

### On this page

[Customizing the Connect Link](https://docs.composio.dev/docs/auth-configuration/white-labeling#customizing-the-connect-link) [Logo and name](https://docs.composio.dev/docs/auth-configuration/white-labeling#logo-and-name) [Colors, fonts, and per-element styling](https://docs.composio.dev/docs/auth-configuration/white-labeling#colors-fonts-and-per-element-styling) [Using your own OAuth apps](https://docs.composio.dev/docs/auth-configuration/white-labeling#using-your-own-oauth-apps) [When to use your own OAuth apps](https://docs.composio.dev/docs/auth-configuration/white-labeling#when-to-use-your-own-oauth-apps) [Switching from Composio-managed to your own OAuth app](https://docs.composio.dev/docs/auth-configuration/white-labeling#switching-from-composio-managed-to-your-own-oauth-app) [Sending users directly to the OAuth provider](https://docs.composio.dev/docs/auth-configuration/white-labeling#sending-users-directly-to-the-oauth-provider) [Routing the callback through your domain](https://docs.composio.dev/docs/auth-configuration/white-labeling#routing-the-callback-through-your-domain) [Next](https://docs.composio.dev/docs/auth-configuration/white-labeling#next)
