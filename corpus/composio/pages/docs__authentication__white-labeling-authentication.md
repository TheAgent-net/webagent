---
url: https://docs.composio.dev/docs/authentication/white-labeling-authentication
title: White-labeling authentication | Composio
description: Remove Composio branding from your auth flows
status: 200
---

[Authentication](https://docs.composio.dev/docs/authentication)

# White-labeling authentication

Copy page

There are four places where Composio branding shows up during authentication:

| Where | What users see | How to fix |
| --- | --- | --- |
| [**Connect Link page**](https://docs.composio.dev/docs/authentication/white-labeling-authentication#customizing-the-connect-link) | Composio logo, name, and styling on the hosted auth page | Set your logo, app title, and theme in the dashboard |
| [**OAuth consent screen**](https://docs.composio.dev/docs/authentication/white-labeling-authentication#using-your-own-oauth-apps) | "Composio wants to access your account" on Google, GitHub, etc. | Use your own OAuth app |
| [**Browser address bar**](https://docs.composio.dev/docs/authentication/white-labeling-authentication#routing-the-callback-through-your-domain) | `backend.composio.dev` flashes during OAuth redirect-back | Proxy the redirect through your domain |
| [**Post-auth success page**](https://docs.composio.dev/docs/authentication/white-labeling-authentication#redirecting-users-after-authentication) | Composio-branded success page after OAuth completes | Pass a `callbackUrl` when initiating the connection |

## [Customizing the Connect Link](https://docs.composio.dev/docs/authentication/white-labeling-authentication\#customizing-the-connect-link)

The Connect Link is the hosted page your users see when connecting their accounts. By default it shows Composio branding on a neutral light theme. You can swap in your logo and name, then restyle the whole page to match your product.

Everything here lives in **Project Settings** → [**White Labeling**](https://dashboard.composio.dev/~/project/settings/auth-screen?utm_source=docs&utm_medium=content&utm_campaign=docs-white-labeling-authentication). Changes apply to every Connect Link flow across all toolkits, for both [in-chat](https://docs.composio.dev/docs/authentication#in-chat-authentication) and [manual](https://docs.composio.dev/docs/authentication/manually-authenticating) authentication. Each project has one branding and one theme, so if you need a different look per product, use separate projects.

### [Logo and name](https://docs.composio.dev/docs/authentication/white-labeling-authentication\#logo-and-name)

1. Go to **Project Settings** → **White Labeling**, and open the **Branding** tab.
2. Set your **App Title** and upload your **Logo** (a square JPEG or PNG, 256×256 to 1024×1024 pixels).

The logo replaces the Composio mark at the top of the page, and the app title replaces "Composio" in the "...wants to connect to your account" heading.

This only changes the Composio-hosted page. For OAuth toolkits like Gmail, Google Sheets, GitHub, and Slack, users still see a consent screen saying "Composio wants to access your account." To change that, and to remove the "Secured by Composio" badge, set up your own OAuth app as described [below](https://docs.composio.dev/docs/authentication/white-labeling-authentication#using-your-own-oauth-apps).

### [Colors, fonts, and per-element styling](https://docs.composio.dev/docs/authentication/white-labeling-authentication\#colors-fonts-and-per-element-styling)

Open the **Styling** tab to restyle the entire Connect Link page. A live preview sits beside the controls and updates as you edit, and you can preview each state of the flow with the **Welcome**, **Form**, **Success**, and **Error** tabs.

![The White Labeling editor with a live preview on the left and styling controls on the right](https://docs.composio.dev/_next/image?url=%2Fimages%2Fauth-screen-theme-editor.png&w=1920&q=75&dpl=dpl_5Fa4ZnHdwLH3so7fdEGNiQ6h7C2a)

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

- **"Secured by Composio" badge won't go away:** this badge is removed when you use your own OAuth app. See [Using your own OAuth apps](https://docs.composio.dev/docs/authentication/white-labeling-authentication#using-your-own-oauth-apps).
- **Logo doesn't appear after uploading:** clear your browser cache or try incognito.
- **Upload fails with "failed to fetch":** retry or use a smaller image.
- **You see the Branding tab but no Styling tab:** theming is still rolling out. If it isn't enabled for your project yet, reach out. The logo and app title keep working in the meantime.

## [Using your own OAuth apps](https://docs.composio.dev/docs/authentication/white-labeling-authentication\#using-your-own-oauth-apps)

OAuth toolkits like Google and GitHub show a consent screen that says which app is requesting access. By default this reads "Composio wants to connect to your account." To show your app name instead, create a custom auth config with your own OAuth credentials and pass that auth config when creating a session.

You don't need this for every toolkit

Only white-label toolkits where users see a consent screen (Google, GitHub, Slack, etc.). Toolkits that use API keys don't show consent screens, so there's nothing to white-label. You can mix and match freely.

[**Managed vs custom auth** \\
Decide when to use custom credentials, create an auth config, and pass it to sessions.](https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app)

### [Switching from Composio-managed to your own OAuth app](https://docs.composio.dev/docs/authentication/white-labeling-authentication\#switching-from-composio-managed-to-your-own-oauth-app)

Existing connected accounts are tied to the auth config they were created with. Switching to a custom auth config affects new connections for that toolkit; existing users keep using their current connected accounts until they re-authenticate or you import/migrate their credentials.

- To use the custom config for new connections, pass `authConfigs` when creating or updating the session.
- Existing connections continue refreshing with their original auth config.
- To fully migrate an existing user, delete the old connected account and have them re-authenticate with the new auth config, or import their credentials into the new config where supported.

## [Routing the callback through your domain](https://docs.composio.dev/docs/authentication/white-labeling-authentication\#routing-the-callback-through-your-domain)

During OAuth, the browser briefly redirects through `backend.composio.dev` so Composio can capture the auth token. Some toolkits also display this URL on the consent screen.

If you need to hide Composio's domain, you can proxy the redirect through your own domain instead.

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

![Auth Config Settings](https://docs.composio.dev/_next/image?url=%2Fimages%2Fcustom-redirect-uri.png&w=1920&q=75&dpl=dpl_5Fa4ZnHdwLH3so7fdEGNiQ6h7C2a)

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

## [Redirecting users after authentication](https://docs.composio.dev/docs/authentication/white-labeling-authentication\#redirecting-users-after-authentication)

By default, after OAuth completes, users land on a Composio-hosted success page that shows Composio branding. To bypass this page and send users to your own domain instead, pass a `callbackUrl` when calling `session.authorize()`:

PythonTypeScript

```
connection_request = session.authorize(
    "gmail",
    callback_url="https://your-app.com/callback"
)
```

After authentication, Composio redirects the user to your callback URL instead of the default success page. For full details on the parameters appended to your callback URL, see [Manually authenticating users → Redirecting users after authentication](https://docs.composio.dev/docs/authentication/manually-authenticating#redirecting-users-after-authentication).

## [Next](https://docs.composio.dev/docs/authentication/white-labeling-authentication\#next)

[**Managed vs custom auth** \\
Set up auth configs for OAuth apps, API keys, and toolkits without managed auth](https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/authentication/white-labeling-authentication.mdx)

### On this page

[Customizing the Connect Link](https://docs.composio.dev/docs/authentication/white-labeling-authentication#customizing-the-connect-link) [Logo and name](https://docs.composio.dev/docs/authentication/white-labeling-authentication#logo-and-name) [Colors, fonts, and per-element styling](https://docs.composio.dev/docs/authentication/white-labeling-authentication#colors-fonts-and-per-element-styling) [Using your own OAuth apps](https://docs.composio.dev/docs/authentication/white-labeling-authentication#using-your-own-oauth-apps) [Switching from Composio-managed to your own OAuth app](https://docs.composio.dev/docs/authentication/white-labeling-authentication#switching-from-composio-managed-to-your-own-oauth-app) [Routing the callback through your domain](https://docs.composio.dev/docs/authentication/white-labeling-authentication#routing-the-callback-through-your-domain) [Redirecting users after authentication](https://docs.composio.dev/docs/authentication/white-labeling-authentication#redirecting-users-after-authentication) [Next](https://docs.composio.dev/docs/authentication/white-labeling-authentication#next)
