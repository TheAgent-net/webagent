---
url: https://docs.composio.dev/docs/setting-up-triggers/subscribing-to-events.md
title: https://docs.composio.dev/docs/setting-up-triggers/subscribing-to-events.md
description: 
status: 200
---

\# Receiving events (/docs/setting-up-triggers/subscribing-to-events)

Once a trigger is active, its events come to you as the same payload, whether you're testing locally or running in production. Develop against your local handler first, then point Composio at your production URL when you ship.

\## Receive events locally \[#receive-events-locally\]

While developing, you want trigger events on your machine. The best option forwards them to the real webhook handler you'll run in production, so you test the exact path (including \`parse()\` and signature verification) before you ship.

\### Quick look with \`subscribe()\` \[#quick-look-with-subscribe\]

\`subscribe()\` streams events straight to your process over a WebSocket, with no webhook URL, no tunnel, and no signing. It's the fastest way to eyeball what a trigger sends, but it bypasses your real webhook handler. Use it only for basic prototyping; for anything you intend to ship, forward events to your handler with one of the options below.

\> Under the hood \`subscribe()\` opens the WebSocket via \[Pusher\](https://pusher.com/). This is an implementation detail, but worth knowing if your runtime restricts WebSocket clients — prefer the webhook/forwarding options below for anything you ship.

\*\*Python:\*\*

\`\`\`python
from composio import Composio

composio = Composio()

subscription = composio.triggers.subscribe()

@subscription.handle(trigger\_id="your\_trigger\_id")
def handle\_event(data):
 print(f"Event received: {data}")

subscription.wait\_forever()
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';

const composio = new Composio();

await composio.triggers.subscribe(
 data => {
 console.log('Event received:', data);
 },
 { triggerId: 'your\_trigger\_id' }
);
\`\`\`

Filter the stream by \`triggerId\`, \`triggerSlug\`, \`connectedAccountId\`, \`toolkits\`, or \`userId\`, or pass no filters to receive every trigger event in the project.

\### Forward to your local handler with the CLI (recommended) \[#forward-to-your-local-handler-with-the-cli-recommended\]

The Composio CLI streams realtime events and forwards each one to your local URL, signed exactly like production. No public URL, no tunnel, and it runs your real handler (and \[\`parse()\`\](#handling-events)) end to end.

\`\`\`bash
composio dev triggers listen --forward "http://localhost:8000/webhooks/composio"
\`\`\`

Events are signed with \`COMPOSIO\_WEBHOOK\_SECRET\` if it's set, otherwise the CLI prints a generated secret to verify against. Filter the stream with \`--toolkits\`, \`--trigger-slug\`, or \`--trigger-id\`, and tee events to a file with \`--out events.jsonl\`.

\### Cloudflare Tunnel \[#cloudflare-tunnel\]

Expose your local server with \[Cloudflare Tunnel\](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/), no account needed for quick runs:

\`\`\`bash
cloudflared tunnel --url http://localhost:8000
\`\`\`

Register the printed \`trycloudflare.com\` URL as your \[webhook URL\](#receive-events-in-production), then events reach your handler at \`http://localhost:8000/webhooks/composio\`.

\### ngrok \[#ngrok\]

Expose your local server with \[ngrok\](https://ngrok.com):

\`\`\`bash
ngrok http 8000
\`\`\`

Register the printed \`ngrok-free.app\` URL as your \[webhook URL\](#receive-events-in-production) the same way.

\## Receive events in production \[#receive-events-in-production\]

Register your webhook URL once per project. Composio then \`POST\`s every trigger event to it. Set it from the SDK:

\*\*Python:\*\*

\`\`\`python
from composio import Composio

composio = Composio()

subscription = composio.triggers.set\_webhook\_subscription(
 webhook\_url="https://your-app.com/webhooks/composio",
)
print(f"Delivering events to {subscription\['webhook\_url'\]}")
\# Store subscription\['secret'\] to verify signatures
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';

const composio = new Composio();

const subscription = await composio.triggers.setWebhookSubscription({
 webhookUrl: 'https://your-app.com/webhooks/composio',
});
console.log(\`Delivering events to ${subscription.webhookUrl}\`);
// Store subscription.secret to verify signatures
\`\`\`

Your webhook endpoint must be publicly reachable. Composio's outbound IPs are dynamic, so IP allowlists and VPN-only endpoints won't work. Authenticate payloads with \[signature verification\](#verifying-signatures) instead.

\## Handling events \[#handling-events\]

In your handler, pass the incoming request to \`parse()\`. It returns the typed, normalized payload. Pass \`verifySecret\` and it verifies the signature first, so one call both authenticates and parses.

\*\*Python:\*\*

\`\`\`python
import os
from composio import Composio

composio = Composio()

@app.post("/webhooks/composio")
async def webhook\_handler(request: Request):
 # On async frameworks (FastAPI) read the raw body and pass body=/headers=.
 # On sync frameworks (Flask, Django) you can pass the request directly.
 # Use the raw body so the signature verifies. Omit verify\_secret to skip it.
 result = composio.triggers.parse(
 body=await request.body(),
 headers=request.headers,
 verify\_secret=os.environ\["COMPOSIO\_WEBHOOK\_SECRET"\],
 )

 if result\["raw\_payload"\]\["type"\] == "composio.trigger.message":
 event = result\["payload"\]
 if event\["trigger\_slug"\] == "GITHUB\_COMMIT\_EVENT":
 data = event\["payload"\]
 print(f"New commit by {data\['author'\]}: {data\['message'\]}")

 return {"status": "ok"}
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';

const composio = new Composio();

// Next.js App Router, Hono, or any Fetch-style handler
export async function POST(request: Request) {
 // parse() takes a Fetch Request (shown) or an Express-style { body, headers }.
 // Pass the raw body so the signature verifies; omit verifySecret to skip it.
 const result = await composio.triggers.parse(request, {
 verifySecret: process.env.COMPOSIO\_WEBHOOK\_SECRET,
 });

 if (result.rawPayload.type === 'composio.trigger.message') {
 const event = result.payload;
 if (event.triggerSlug === 'GITHUB\_COMMIT\_EVENT') {
 const data = event.payload;
 console.log(\`New commit by ${data.author}: ${data.message}\`);
 }
 }

 return Response.json({ status: 'ok' });
}
\`\`\`

\> Composio delivers other project events (like \[connection expiry\](/docs/authentication#connection-lifecycle)) to this same URL. \`parse()\` returns those too. Route on \`result.payload.triggerSlug\` and ignore what you don't handle.

\### Inspecting trigger payload schemas \[#inspecting-trigger-payload-schemas\]

Each trigger type declares the shape of the \`data\` it sends. Inspect it before you write your handler:

\*\*Python:\*\*

\`\`\`python
from composio import Composio

composio = Composio()

trigger\_type = composio.triggers.get\_type("GITHUB\_COMMIT\_EVENT")
print(trigger\_type.payload)
\# {"properties": {"author": {...}, "id": {...}, "message": {...}, "timestamp": {...}, "url": {...}}}
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';

const composio = new Composio();

const triggerType = await composio.triggers.getType('GITHUB\_COMMIT\_EVENT');
console.log(triggerType.payload);
// {"properties": {"author": {...}, "id": {...}, "message": {...}, "timestamp": {...}, "url": {...}}}
\`\`\`

From the CLI, inspect a single trigger type's config and payload schema:

\`\`\`bash
composio triggers info "GITHUB\_COMMIT\_EVENT"
\`\`\`

Or generate typed stubs for your project (scope to the toolkits you use with \`--toolkits\`), so your handler is type-checked against the trigger's payload:

\`\`\`bash
composio generate --toolkits github # auto-detects TypeScript or Python
\`\`\`

\### Webhook payload shape \[#webhook-payload-shape\]

Every trigger event arrives in the same envelope. \`metadata\` tells you where the event came from; \`data\` holds the event itself, in the shape the trigger type declares.

\`\`\`json
{
 "id": "msg\_abc123",
 "type": "composio.trigger.message",
 "metadata": {
 "log\_id": "log\_abc123",
 "trigger\_slug": "GITHUB\_COMMIT\_EVENT",
 "trigger\_id": "ti\_xyz789",
 "connected\_account\_id": "ca\_def456",
 "auth\_config\_id": "ac\_xyz789",
 "user\_id": "user-id-123435"
 },
 "data": {
 "commit\_sha": "a1b2c3d",
 "message": "fix: resolve null pointer",
 "author": "jane"
 },
 "timestamp": "2026-01-15T10:30:00Z"
}
\`\`\`

\| \`metadata\` field \| What it tells you \|
\| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`trigger\_id\` \| Which trigger instance fired this event \|
\| \`trigger\_slug\` \| The trigger type (for example \`GITHUB\_COMMIT\_EVENT\`) \|
\| \`connected\_account\_id\` \| Which connected account it belongs to \|
\| \`user\_id\` \| Which user it's for \|
\| \`auth\_config\_id\` \| Which auth config was used \|

\> This is the V3 payload, the default for new organizations. See \[webhook payload versions\](#webhook-payload-versions) for V2 and V1.

\## Verifying signatures \[#verifying-signatures\]

Composio signs every webhook request. \`parse({ verifySecret })\` verifies the signature for you (and \`verifyWebhook()\` does the same at a lower level), so most handlers need nothing more. You only need this section if you're \*\*not\*\* using the Composio SDK.

\> Store the webhook secret securely as \`COMPOSIO\_WEBHOOK\_SECRET\`. Fetch it from the \[webhook subscription\](/reference/api-reference/webhook-subscriptions/getWebhookSubscriptionsById) any time, or \[rotate it\](/reference/api-reference/webhook-subscriptions/postWebhookSubscriptionsByIdRotateSecret) if it leaks.

Every request includes \`webhook-signature\`, \`webhook-id\`, and \`webhook-timestamp\` headers. Compute \`HMAC-SHA256\` over \`{webhook-id}.{webhook-timestamp}.{rawBody}\` with your secret and compare it against the signature:

\*\*Python:\*\*

\`\`\`python
import hmac
import hashlib
import base64
import json
import os

def verify\_webhook(webhook\_id: str, webhook\_timestamp: str, body: str, signature: str) -> dict:
 secret = os.getenv("COMPOSIO\_WEBHOOK\_SECRET", "")
 signing\_string = f"{webhook\_id}.{webhook\_timestamp}.{body}"
 expected = base64.b64encode(
 hmac.new(secret.encode(), signing\_string.encode(), hashlib.sha256).digest()
 ).decode()
 received = signature.split(",", 1)\[1\] if "," in signature else signature
 if not hmac.compare\_digest(expected, received):
 raise ValueError("Invalid webhook signature")

 payload = json.loads(body)
 # V3 payload
 return {
 "trigger\_slug": payload\["metadata"\]\["trigger\_slug"\],
 "data": payload\["data"\],
 }
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import crypto from 'crypto';
function verifyWebhook(
 webhookId: string,
 webhookTimestamp: string,
 body: string,
 signature: string
) {
 const secret = process.env.COMPOSIO\_WEBHOOK\_SECRET ?? '';
 const signingString = \`${webhookId}.${webhookTimestamp}.${body}\`;
 const expected = crypto
 .createHmac('sha256', secret)
 .update(signingString)
 .digest('base64');
 const received = signature.split(',')\[1\] ?? signature;
 if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received))) {
 throw new Error('Invalid webhook signature');
 }

 const payload = JSON.parse(body);
 // V3 payload
 return {
 triggerSlug: payload.metadata.trigger\_slug,
 data: payload.data,
 };
}
\`\`\`

\> Reject requests whose \`webhook-timestamp\` is too old to block replays. The SDK's \`parse()\` and \`verifyWebhook()\` enforce a 300-second tolerance by default; pass \`tolerance\` to change it, or \`0\` to disable the check.

\## Webhook payload versions \[#webhook-payload-versions\]

\`parse()\` and \`verifyWebhook()\` auto-detect the version. If you process payloads manually, here are the formats:

\*\*V3 (default):\*\*

Metadata is separated from event data. New organizations receive V3 payloads by default.

\`\`\`json
{
 "id": "msg\_abc123",
 "type": "composio.trigger.message",
 "metadata": {
 "log\_id": "log\_abc123",
 "trigger\_slug": "GITHUB\_COMMIT\_EVENT",
 "trigger\_id": "ti\_xyz789",
 "connected\_account\_id": "ca\_def456",
 "auth\_config\_id": "ac\_xyz789",
 "user\_id": "user-id-123435"
 },
 "data": {
 "commit\_sha": "a1b2c3d",
 "message": "fix: resolve null pointer",
 "author": "jane"
 },
 "timestamp": "2026-01-15T10:30:00Z"
}
\`\`\`

\*\*V2 (legacy):\*\*

Metadata fields are mixed into the \`data\` object alongside event data.

\`\`\`json
{
 "type": "github\_commit\_event",
 "data": {
 "commit\_sha": "a1b2c3d",
 "message": "fix: resolve null pointer",
 "author": "jane",
 "connection\_id": "ca\_def456",
 "connection\_nano\_id": "cn\_abc123",
 "trigger\_nano\_id": "tn\_xyz789",
 "trigger\_id": "ti\_xyz789",
 "user\_id": "user-id-123435"
 },
 "timestamp": "2026-01-15T10:30:00Z",
 "log\_id": "log\_abc123"
}
\`\`\`

\*\*V1 (legacy):\*\*

\`\`\`json
{
 "trigger\_name": "github\_commit\_event",
 "trigger\_id": "ti\_xyz789",
 "connection\_id": "ca\_def456",
 "payload": {
 "commit\_sha": "a1b2c3d",
 "message": "fix: resolve null pointer",
 "author": "jane"
 },
 "log\_id": "log\_abc123"
}
\`\`\`

\## Next \[#next\]

\- \[Managing triggers\](/docs/setting-up-triggers/managing-triggers): List, enable, disable, and delete trigger instances

\-\-\-

📚 \*\*More documentation:\*\* \[View all docs\](https://docs.composio.dev/llms.txt) \| \[Glossary\](https://docs.composio.dev/llms.mdx/reference/glossary) \| \[Examples\](https://docs.composio.dev/llms.mdx/examples) \| \[API Reference\](https://docs.composio.dev/llms.mdx/reference)

\-\-\-

\# Composio SDK — Notes for AI Code Generators

\*\*Purpose:\*\* Reference for generating current (v3) \[Composio\](https://composio.dev/) integration code.
\*\*Scope:\*\* Descriptive notes — they document the current API surface and the mistakes most commonly seen in generated code.

\-\-\-

\## 1\. Recommended Integration: Sessions

Composio supports two integration modes: \*\*Native Tools\*\* (with a provider package) and \*\*MCP\*\* (no provider package needed).

\### Native Tools

\`\`\`python
\# ✅ CORRECT — Python (defaults to OpenAI)
from composio import Composio

composio = Composio()
session = composio.create(user\_id="user\_123")
tools = session.tools()
\# Pass tools to your agent/LLM framework
\`\`\`

\`\`\`typescript
// ✅ CORRECT — TypeScript (defaults to OpenAI)
import { Composio } from "@composio/core";

const composio = new Composio();
const session = await composio.create("user\_123");
const tools = await session.tools();
// Pass tools to your agent/LLM framework
\`\`\`

For other providers, pass the provider explicitly. Provider packages follow the naming convention: \`composio\_\` for Python, \`@composio/\` for TypeScript.

\### MCP

Use \`session.mcp.url\` and \`session.mcp.headers\` with any MCP-compatible client (Claude Desktop, Cursor, OpenAI Agents, etc.). No provider package needed.

\-\-\-

\## 2\. Integration Notes

\- \`composio.create(user\_id)\` is the standard entry point for agent integrations. Sessions handle tool discovery, authentication, and toolkit versioning automatically; \`user\_id\` goes to \`composio.create()\` — individual tool calls in session mode don't take one.
\- Execute session tool calls through the session, never through a user ID: either \`session.execute(tool\_slug, arguments=...)\` / \`session.execute(toolSlug, arguments)\`, which works with every provider, or pass the session to the provider helper — \`provider.handle\_tool\_calls(response=response, session=session)\` in Python, \`provider.handleToolCalls(session, response)\` in TypeScript. Only the OpenAI and Anthropic helpers accept a session; with other providers, use \`session.execute()\`. Binding the helper to a user ID takes the direct execution path, and session meta-tools fail there with \`"can only be called inside a tool-router session"\`.
\- Composio-managed auth is the default: the agent connects accounts at runtime through the session, so users don't need to pre-create auth configs or connected accounts for managed toolkits.
\- Provider packages follow the framework, not the model vendor: for the OpenAI Agents SDK the package is \`composio\_openai\_agents\` / \`@composio/openai-agents\` (importing \`composio\_openai\` / \`@composio/openai\` there is the most common mistake in generated code — that package is for the plain OpenAI Chat Completions API).
\- \*\*Direct execution\*\* (\`composio.tools.get()\`, \`composio.tools.execute()\`, \`provider.handle\_tool\_calls()\` with a user ID) is a fully supported lower-level interface: your code picks the tool, no runtime discovery. It fits deterministic workflows and scripts; sessions fit agents that decide at runtime. The tradeoffs are documented at https://docs.composio.dev/docs/sessions-vs-direct-execution. Note that direct execution requires a toolkit version (https://docs.composio.dev/docs/tools-direct/toolkit-versioning).

\-\-\-

\# 3\. Calling the REST API directly

\## REST API version

The current REST API version is \*\*v3.1\*\*, served at \`https://backend.composio.dev/api/v3.1\`. Prefer it for new code and new examples.

\`https://backend.composio.dev/api/v3\` is the previous version. It is frozen with pinned tool-version defaults and remains supported — existing v3 integrations keep working and do not need to migrate.

\## Tool-endpoint version defaults on v3.1

On v3.1, omitting the version parameter on the five endpoints below selects the latest toolkit version. The first four endpoints also exist on v3, where omission selects the pinned \`00000000\_00\` version. \`POST /tools/scopes/required\` is v3.1-only.

\| Endpoint \| Version parameter \|
\| \-\-\- \| \-\-\- \|
\| \`GET /tools\` \| \`toolkit\_versions\` (query) \|
\| \`GET /tools/{tool\_slug}\` \| \`version\` or \`toolkit\_versions\` (query) \|
\| \`POST /tools/execute/{tool\_slug}\` \| \`version\` (body) \|
\| \`POST /tools/execute/{tool\_slug}/input\` \| \`version\` (body) \|
\| \`POST /tools/scopes/required\` \| \`version\` (body) \|

A v3.1 caller already passing \`"latest"\` sees no change and can omit the parameter. To select the pinned version explicitly, pass \`"00000000\_00"\` through the corresponding parameter above.

This version-default change is limited to the five endpoints above.

\-\-\-

\## Terminology Migration (old → current)

If you encounter these terms in error messages, old documentation, or user prompts, translate them to the current equivalents. \*\*Do not use the old terms in generated code or explanations.\*\*

\| Old term (v1/v2) \| Current term (v3) \| In code \|
\|---\|---\|---\|
\| entity ID \| user ID \| \`user\_id\` parameter \|
\| actions \| tools \| e.g., \`GITHUB\_CREATE\_ISSUE\` is a \*tool\* \|
\| apps / appType \| toolkits \| e.g., \`github\` is a \*toolkit\* \|
\| integration / integration ID \| auth config / auth config ID \| \`auth\_config\_id\` parameter \|
\| connection \| connected account \| \`connected\_accounts\` namespace \|
\| ComposioToolSet / OpenAIToolSet \| \`Composio\` class with a provider \| \`Composio(provider=...)\` \|
\| toolset \| provider \| e.g., \`OpenAIProvider\` \|

If a user says "entity ID", they mean \`user\_id\`. If they say "integration", they mean "auth config". Always respond using the current terminology.
