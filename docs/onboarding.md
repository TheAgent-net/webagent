# Onboarding: company checklist

This page tells a company what to do to put our agent on its site. Send it to the company after `webagent onboard`.

In the snippets, replace these values:

- `{PUBLIC}`: our service URL, for example `https://cloud.agentnet.it.com`.
- `<id>`: your tenant id, for example `acme`.

## Required

Do these steps before the agent goes live. Total time: about one hour.

| Step | Who | Time |
| --- | --- | --- |
| 1. Send your site URL and the emails of the people who get the dashboard. | You | 2 min |
| 2. Review the agent in the preview at `{PUBLIC}/t/<id>/`. Ask the questions your customers ask. Note each wrong or weak reply. | You | 30 min |
| 3. Fill the [facts sheet](facts-sheet.md). | You | 15 min |
| 4. Paste the script tag on every page. | Your web team | 5 min |
| 5. Allow our origin in your Content Security Policy (CSP), if your site has one. | Your web team | 5 min |
| 6. Give a handoff target: an email address, a Slack channel, or a webhook URL. The agent sends a visitor here when the visitor asks for a person. | You | 2 min |
| 7. Legal: add the privacy line, put the agent in a cookie category, and sign the DPA. | Your legal team | varies |

### 4. Script tag

Paste this tag before `</body>` on every page:

```html
<script src="{PUBLIC}/t/<id>/widget.js" async></script>
```

#### Google Tag Manager

If you use Google Tag Manager, add a **Custom HTML** tag. Use the trigger **All Pages**.

```html
<script>
  (function () {
    var s = document.createElement("script");
    s.src = "{PUBLIC}/t/<id>/widget.js";
    s.async = true;
    document.head.appendChild(s);
  })();
</script>
```

### 5. CSP

Add our origin to these directives. Keep your current values.

```text
script-src  {PUBLIC}
connect-src {PUBLIC}
img-src     {PUBLIC}
style-src   {PUBLIC}
font-src    {PUBLIC}
```

Example header:

```text
Content-Security-Policy: script-src 'self' {PUBLIC}; connect-src 'self' {PUBLIC}; img-src 'self' data: {PUBLIC}; style-src 'self' 'unsafe-inline' {PUBLIC}; font-src 'self' {PUBLIC}
```

The widget puts styles inline. If your `style-src` does not allow `'unsafe-inline'`, tell us.

### 7. Legal

- Privacy policy: add the paragraph from [legal/privacy.md](legal/privacy.md).
- Cookie banner: the widget keeps one session id in the browser session storage. It sets no cookie. The id goes away when the tab closes. Put it in the **functional** category.
- DPA: we send the agreement from [legal/dpa.md](legal/dpa.md). Your legal team signs it.

## Optional

| Step | What you get | Time |
| --- | --- | --- |
| Connect Cloudflare with a **read-only** API token (Analytics: Read, Logs: Read). | We count AI agents and crawlers that visit your site, not only the ones that talk to the widget. | 10 min |
| Add a line to your `/llms.txt`. | AI assistants find the agent and ask it direct questions. | 2 min |
| Review the weekly gap report. | A list of questions the agent could not answer. Add the answers to your site or the facts sheet. | 15 min each week |
| Use your own model or retrieval keys. | Your own billing and limits. | 10 min |

### `/llms.txt` line

Add this line to the `/llms.txt` file at the root of your site. Create the file if it does not exist.

```markdown
- [Ask our agent]({PUBLIC}/t/<id>/chat): POST {"text": "your question"} to get an answer from our site agent.
```

## What we do

- We crawl your public pages and build the agent from them.
- We host the agent, the widget, and the dashboard.
- We fetch your site again on a schedule. Changed pages update the agent.
- We send each handoff to your target.
- We store chats so that you can review them. See the retention in [legal/privacy.md](legal/privacy.md).
- We never store a raw visitor IP. We store a salted hash.
- We fix wrong replies that you report. Send the question and the correct answer.
