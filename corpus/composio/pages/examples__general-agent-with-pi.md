---
url: https://docs.composio.dev/examples/general-agent-with-pi
title: Build a Slack bot that can do work with you and your team | Composio
description: Build a general-purpose agent with Pi and Composio, then drop it into Slack so a whole team can use it. Triggers, per-user sessions, a shared workspace connection, redirected auth links, and raw API access.
status: 200
---

# Build a Slack bot that can do work with you and your team

Copy page

The agent is the easy part. [Pi](https://github.com/earendil-works/pi/tree/main/packages/coding-agent) does the reasoning; Composio gives it 1000+ apps to act on. In three lines you have an agent that can open a PR, check a calendar, or search a Notion workspace for one user.

The work is everything around it: putting that agent in Slack, where a whole team talks to it, and making it act as _each_ person while posting as one bot. That's a handful of Composio pieces:

1. **Triggers** deliver every Slack message to your server as a webhook.
2. **Sessions** give each user their own scoped toolset, so the agent acts as _them_.
3. **A shared connection** lets the bot speak as the workspace bot, with one install for everyone.
4. **Redirected auth links** keep OAuth out of the channel: when an app isn't connected, the bot DMs the user a link and resumes on approval.
5. **The proxy** reaches the Slack Web API endpoints the toolkit doesn't wrap as tools.

slackbot.runtimelistening in Slack

Slack

![](https://logos.composio.dev/api/slack)

Message

@mention or DM

trigger → webhook

Your server

{ }

Pi agent

verifies + loops

Verifies the webhook signature, then calls the session's tools.

Session

scoped to userslack:T09:alice

- ![](https://logos.composio.dev/api/slack)Slackworkspace botshared
- ![](https://logos.composio.dev/api/github)GitHubAlicelinked
- ![](https://logos.composio.dev/api/gmail)GmailAlicelinked

Posts to Slack as the workspace bot; acts in every other app as the user.

message → trigger → agent → session (shared slack + user apps) → reply

Below you build the whole thing from scratch: a basic agent first, then a piece at a time up to the full server, then a browse of the real source. You bring a Composio API key and an agent runtime. Composio brings the workspace.

## [Setup](https://docs.composio.dev/examples/general-agent-with-pi\#setup)

You need a [Composio API key](https://dashboard.composio.dev/?utm_source=docs&utm_medium=content&utm_campaign=examples-general-agent-with-pi), a publicly reachable URL for your server, and [Bun](https://bun.sh/).

### No public URL? Use a Cloudflare tunnel

```
bun add @composio/core @composio/experimental @earendil-works/pi-coding-agent
```

## [Install the bot](https://docs.composio.dev/examples/general-agent-with-pi\#install-the-bot)

A Slack bot needs a Slack app to authenticate as and a stream of events. Composio gives you both, so you never register a webhook with Slack or hold a bot token. The `slackbot` toolkit ships with Composio-managed OAuth, and you install it as one **[shared connection](https://docs.composio.dev/docs/extending-sessions/shared-connections)** for the whole workspace.

This is `install.ts`, run once, built up three steps at a time:

1Declare the scopesinstall.ts

Create a Composio-managed auth config for the slackbot toolkit. No Slack app of your own to register.

install.ts

+14

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14

import { Composio } from '@composio/core';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

// The scopes the bot needs. The slackbot toolkit ships Composio-managed OAuth,
// so you never register your own Slack app.
const authConfig = await composio.authConfigs.create('slackbot', {
  type: 'use_composio_managed_auth',
  name: 'workspace-bot',
  credentials: {
    scopes: ['app_mentions:read', 'channels:history', 'chat:write', 'reactions:write', 'users:read'],
    user_scopes: ['search:read'],
  },
});
```

2Authorize one shared connectioninstall.ts

Start a setup session and authorize slackbot as a SHARED connection, so a single approval serves every user.

install.ts

+12

```
10 unmodified lines

11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26

10 unmodified lines

    scopes: ['app_mentions:read', 'channels:history', 'chat:write', 'reactions:write', 'users:read'],
    user_scopes: ['search:read'],
  },
});

// One connection for the whole workspace: authorize it as SHARED.
const setup = await composio.create('setup:workspace-bot', {
  toolkits: ['slackbot'],
  authConfigs: { slackbot: authConfig.id },
  manageConnections: true,
});
const request = await setup.authorize('slackbot', {
  callbackUrl: `${process.env.APP_URL}/setup/callback`,
  experimental: { accountType: 'SHARED' },
});
console.log('Approve the install:', request.redirectUrl);
```

3Open it up and wire eventsinstall.ts

On the callback, open the ACL to the workspace, subscribe your webhook, and create the message triggers.

install.ts

+9

```
22 unmodified lines

23
24
25
26
27
28
29
30
31
32
33
34
35

22 unmodified lines

  callbackUrl: `${process.env.APP_URL}/setup/callback`,
  experimental: { accountType: 'SHARED' },
});
console.log('Approve the install:', request.redirectUrl);

// On the OAuth callback: open the ACL, subscribe your webhook, create triggers.
// Persist connectedAccountId as SLACK_CONNECTION_ID for the bot server.
export async function onSetupCallback(connectedAccountId: string) {
  await composio.connectedAccounts.updateAcl(connectedAccountId, { allowAllUsers: true });
  await composio.triggers.setWebhookSubscription({ webhookUrl: `${process.env.APP_URL}/webhooks/composio` });
  await composio.triggers.create('setup:workspace-bot', 'SLACKBOT_CHANNEL_MESSAGE_RECEIVED', { triggerConfig: { is_bot_message: false } });
  await composio.triggers.create('setup:workspace-bot', 'SLACKBOT_DIRECT_MESSAGE_RECEIVED', { triggerConfig: {} });
}
```

A webhook subscription is the _pipe_; each trigger is a _tap_. Together they stream channel messages and DMs to your server. The connected account id that comes back from the OAuth callback is the `SLACK_CONNECTION_ID` the server pins into every session.

## [Build the bot](https://docs.composio.dev/examples/general-agent-with-pi\#build-the-bot)

`bot.ts` starts as a bare three-line agent and grows into the server, one Composio concept at a time. Each diff below is exactly what that concept adds.

### [Start with a basic agent](https://docs.composio.dev/examples/general-agent-with-pi\#start-with-a-basic-agent)

The whole idea, before any Slack: create a session for a user, hand the Pi provider the session so it can search and execute, and run a prompt. This already acts across every app that user has connected.

bot.ts

+35

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35

import { Composio } from '@composio/core';
import { PiProvider } from '@composio/experimental';
import { createAgentSession, SessionManager } from '@earendil-works/pi-coding-agent';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const piProvider = new PiProvider();

// Run the Pi agent over a session's tools and return its final text.
async function runPi(tools: unknown, prompt: string) {
  const { session: pi } = await createAgentSession({
    sessionManager: SessionManager.inMemory(process.cwd()),
    customTools: tools,
    tools: ['composio_search_tools', 'composio_manage_connections', 'composio_execute_tool'],
  });
  let reply = '';
  pi.subscribe((e) => {
    if (e.type === 'message_update' && e.assistantMessageEvent.type === 'text_delta') {
      reply += e.assistantMessageEvent.delta;
    }
  });
  await pi.prompt(prompt);
  pi.dispose();
  return reply;
}

// The smallest agent: one session, its tools, one prompt.
export async function runAgent(userId: string, prompt: string) {
  const session = await composio.create(userId);
  const tools = piProvider.createSessionTools({
    sessionId: session.sessionId,
    search: (params) => session.search(params),
    execute: (slug, args, options) => session.execute(slug, args, options),
  });
  return runPi(tools, prompt);
}
```

### [Put it in a Slack thread](https://docs.composio.dev/examples/general-agent-with-pi\#put-it-in-a-slack-thread)

Turn the one-shot agent into a handler. Each Slack thread gets its own [session](https://docs.composio.dev/docs/configuring-sessions), reused so the agent keeps context, and the reply goes back with the `SLACKBOT_SEND_MESSAGE` tool. The session is keyed to the Slack user, so when Alice asks for a GitHub issue it opens as _Alice_, against her GitHub connection.

bot.ts

-8+50

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
10 unmodified lines

60
61
62
63
26
27
28
29
30
31
32
64
65
66
67
68
69
70
71
72
73
74
75
34
76
77

import { Composio } from '@composio/core';
import type { IncomingTriggerPayload } from '@composio/core';
import { PiProvider } from '@composio/experimental';
import { createAgentSession, SessionManager } from '@earendil-works/pi-coding-agent';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const piProvider = new PiProvider();
const callbackUrl = `${process.env.APP_URL}/connections/callback`;

// One session per Slack thread, reused so the agent keeps context, with a short
// transcript for memory across turns.
const threads = new Map<string, { sessionId: string; history: { role: string; content: string }[] }>();
const threadKey = (event: IncomingTriggerPayload) =>
  `${event.payload?.channel}:${event.payload?.thread_ts ?? event.payload?.ts}`;

async function sessionForThread(event: IncomingTriggerPayload) {
  const key = threadKey(event);
  const existing = threads.get(key);
  if (existing) return { session: await composio.use(existing.sessionId), memory: existing };

  const session = await composio.create(event.userId, {
    manageConnections: { enable: true, callbackUrl, waitForConnections: true },
  });
  const memory = { sessionId: session.sessionId, history: [] as { role: string; content: string }[] };
  threads.set(key, memory);
  return { session, memory };
}

function toolsForSession(session) {
  return piProvider.createSessionTools({
    sessionId: session.sessionId,
    callbackUrl,
    search: (params) => session.search(params),
    execute: (slug, args, options) => session.execute(slug, args, options),
    connections: {
      getToolkitStates: (toolkits) => session.toolkits({ toolkits }),
      authorizeToolkit: async (toolkit) => {
        const request = await session.authorize(toolkit, { callbackUrl });
        return { status: 'needs_connection', redirectUrl: request.redirectUrl };
      },
      isConnected: (state) => state.connection?.isActive ?? false,
    },
  });
}

// Run the Pi agent over a session's tools and return its final text.
async function runPi(tools: unknown, prompt: string) {
  const { session: pi } = await createAgentSession({
    sessionManager: SessionManager.inMemory(process.cwd()),
10 unmodified lines

  pi.dispose();
  return reply;
}

// The smallest agent: one session, its tools, one prompt.
export async function runAgent(userId: string, prompt: string) {
  const session = await composio.create(userId);
  const tools = piProvider.createSessionTools({
    sessionId: session.sessionId,
    search: (params) => session.search(params),
    execute: (slug, args, options) => session.execute(slug, args, options),
// Reply to one Slack message as the user who sent it.
async function handleSlackMessage(event: IncomingTriggerPayload) {
  const { session, memory } = await sessionForThread(event);
  const prompt = [...memory.history.map((m) => `${m.role}: ${m.content}`), `user: ${event.payload?.text}`].join('\n');

  const reply = await runPi(toolsForSession(session), prompt);

  await session.execute('SLACKBOT_SEND_MESSAGE', {
    channel: event.payload?.channel,
    thread_ts: event.payload?.thread_ts,
    text: reply,
  });
  return runPi(tools, prompt);
  memory.history.push({ role: 'user', content: event.payload?.text ?? '' }, { role: 'assistant', content: reply });
}
```

### [Share one workspace connection](https://docs.composio.dev/examples/general-agent-with-pi\#share-one-workspace-connection)

By default a connected account is **PRIVATE**: only its creator can use it. The install authorized the Slack connection as **SHARED**, so you pin it into every session. Now Alice's session has _her_ GitHub connection but _the workspace's_ Slack connection. It posts as the bot, and acts everywhere else as Alice.

bot.ts

+7

```
5 unmodified lines

6
7
8
9
10
11
12
13
14
15
16
17
4 unmodified lines

22
23
24
25
26
27
28
29
30
31
32

5 unmodified lines

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const piProvider = new PiProvider();
const callbackUrl = `${process.env.APP_URL}/connections/callback`;

// One Slack connection, shared by the whole workspace. The bot posts as this
// identity while acting in every other app as the individual user.
const SHARED_SLACK_CONNECTION_ID = process.env.SLACK_CONNECTION_ID;

// One session per Slack thread, reused so the agent keeps context, with a short
// transcript for memory across turns.
const threads = new Map<string, { sessionId: string; history: { role: string; content: string }[] }>();
const threadKey = (event: IncomingTriggerPayload) =>
4 unmodified lines

  const existing = threads.get(key);
  if (existing) return { session: await composio.use(existing.sessionId), memory: existing };

  const session = await composio.create(event.userId, {
    // Pin the shared Slack connection; the session still resolves every other
    // toolkit against this user's own connections.
    connectedAccounts: { slackbot: [SHARED_SLACK_CONNECTION_ID] },
    manageConnections: { enable: true, callbackUrl, waitForConnections: true },
  });
  const memory = { sessionId: session.sessionId, history: [] as { role: string; content: string }[] };
  threads.set(key, memory);
```

### [Reach the gaps with the proxy](https://docs.composio.dev/examples/general-agent-with-pi\#reach-the-gaps-with-the-proxy)

Most Slack actions are `SLACKBOT_*` tools. The few that aren't, like the typing indicator and opening a DM channel, drop down to `session.proxyExecute`, which calls the Slack Web API with the pinned connection's auth so you never touch a token.

bot.ts

-1+25

```
31 unmodified lines

32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
30 unmodified lines

93
94
95
96
74
97
98
99
100
101
102
103

31 unmodified lines

  threads.set(key, memory);
  return { session, memory };
}

// Anything the toolkit doesn't wrap as a tool, reach via the proxy: it calls the
// Slack Web API with the pinned connection's auth, so you never touch a token.
async function setStatus(session, event: IncomingTriggerPayload, status: string) {
  await session
    .proxyExecute({
      toolkit: 'slackbot',
      endpoint: 'https://slack.com/api/assistant.threads.setStatus',
      method: 'POST',
      body: { channel_id: event.payload?.channel, thread_ts: event.payload?.thread_ts, status },
    })
    .catch(() => {});
}

async function openDm(session, userId: string): Promise<string> {
  const res = await session.proxyExecute({
    toolkit: 'slackbot',
    endpoint: 'https://slack.com/api/conversations.open',
    method: 'POST',
    body: { users: userId },
  });
  return res.data?.channel?.id;
}

function toolsForSession(session) {
  return piProvider.createSessionTools({
    sessionId: session.sessionId,
    callbackUrl,
30 unmodified lines

// Reply to one Slack message as the user who sent it.
async function handleSlackMessage(event: IncomingTriggerPayload) {
  const { session, memory } = await sessionForThread(event);
  const prompt = [...memory.history.map((m) => `${m.role}: ${m.content}`), `user: ${event.payload?.text}`].join('\n');
  await setStatus(session, event, 'Working on it…');

  const prompt = [...memory.history.map((m) => `${m.role}: ${m.content}`), `user: ${event.payload?.text}`].join('\n');
  const reply = await runPi(toolsForSession(session), prompt);

  await session.execute('SLACKBOT_SEND_MESSAGE', {
    channel: event.payload?.channel,
```

### [Redirect auth links](https://docs.composio.dev/examples/general-agent-with-pi\#redirect-auth-links)

The payoff. When the agent reaches for an app the user hasn't connected, the tool result carries a one-time Composio connect URL. You never want it in the channel or in the model's context. The bot extracts it, **redacts** it from the tool output, DMs it to the user privately, and the run resumes the moment they approve, because the session was created with `waitForConnections`.

bot.ts

-3+35

```
54 unmodified lines

55
56
57
58
59
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
64
93
94
95
96
97
98
99
100
101
102
103
104
23 unmodified lines

128
129
130
131
100
132
133
134
135
136

54 unmodified lines

  });
  return res.data?.channel?.id;
}

function toolsForSession(session) {
// Redirect auth links. When a tool hits an app the user hasn't connected, the
// result carries a one-time Composio connect URL. Never let the model or the
// channel see it: redact it from the tool output and DM the user privately. The
// session's manageConnections + waitForConnections resumes the run on approval.
const CONNECT_LINK = /https:\/\/(?:connect\.composio\.dev|[^\s"']*composio[^\s"']*\/link)\/[^\s"')]+/gi;

function redactLinks<T>(value: T): T {
  if (typeof value === 'string') return value.replace(CONNECT_LINK, '[connection link sent via DM]') as T;
  if (Array.isArray(value)) return value.map(redactLinks) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, redactLinks(v)])) as T;
  }
  return value;
}

async function handleAuthLinks<T>(session, event: IncomingTriggerPayload, value: T): Promise<T> {
  const links = [...new Set([...JSON.stringify(value ?? '').matchAll(CONNECT_LINK)].map((m) => m[0]))];
  if (links.length > 0) {
    const dm = await openDm(session, event.userId);
    for (const url of links) {
      await session.execute('SLACKBOT_SEND_MESSAGE', {
        channel: dm,
        text: `*Connection needed.* Approve access and I'll continue automatically:\n<${url}|Connect>`,
      });
    }
  }
  return redactLinks(value); // hand the model a result with the raw URL stripped
}

function toolsForSession(session, event: IncomingTriggerPayload) {
  return piProvider.createSessionTools({
    sessionId: session.sessionId,
    callbackUrl,
    search: (params) => session.search(params),
    execute: (slug, args, options) => session.execute(slug, args, options),
    // Every tool result passes through handleAuthLinks: connect URLs get DM'd to
    // the user and redacted before the model ever sees them.
    execute: async (slug, args, options) => handleAuthLinks(session, event, await session.execute(slug, args, options)),
    connections: {
      getToolkitStates: (toolkits) => session.toolkits({ toolkits }),
      authorizeToolkit: async (toolkit) => {
        const request = await session.authorize(toolkit, { callbackUrl });
        await handleAuthLinks(session, event, request.redirectUrl);
        return { status: 'needs_connection', redirectUrl: request.redirectUrl };
      },
      isConnected: (state) => state.connection?.isActive ?? false,
    },
23 unmodified lines

  const { session, memory } = await sessionForThread(event);
  await setStatus(session, event, 'Working on it…');

  const prompt = [...memory.history.map((m) => `${m.role}: ${m.content}`), `user: ${event.payload?.text}`].join('\n');
  const reply = await runPi(toolsForSession(session), prompt);
  const reply = await runPi(toolsForSession(session, event), prompt);

  await session.execute('SLACKBOT_SEND_MESSAGE', {
    channel: event.payload?.channel,
    thread_ts: event.payload?.thread_ts,
```

### [Serve the webhook](https://docs.composio.dev/examples/general-agent-with-pi\#serve-the-webhook)

Verify each trigger's signature with `composio.triggers.verifyWebhook`, then hand the payload to `handleSlackMessage` off the response path so a slow handler doesn't get retried. That's the whole server.

bot.ts

+19

```
136 unmodified lines

137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159

136 unmodified lines

    text: reply,
  });
  memory.history.push({ role: 'user', content: event.payload?.text ?? '' }, { role: 'assistant', content: reply });
}

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    if (req.method === 'POST' && url.pathname === '/webhooks/composio') {
      const { payload } = await composio.triggers.verifyWebhook({
        payload: await req.text(),
        secret: process.env.COMPOSIO_WEBHOOK_SECRET,
        id: req.headers.get('webhook-id'),
        timestamp: req.headers.get('webhook-timestamp'),
        signature: req.headers.get('webhook-signature'),
      });
      void handleSlackMessage(payload);
      return Response.json({ ok: true });
    }
    return new Response('Not found', { status: 404 });
  },
});
```

## [The whole project](https://docs.composio.dev/examples/general-agent-with-pi\#the-whole-project)

The two files above are the spine. The real project rounds them out with grouped auth-link DMs, per-user routing, message chunking, reaction acks, and durable storage. Here's a slice of the actual source, with the Composio touch-points highlighted. Browse the tree, read the files:

a slice of the real project, the Composio files do the work

…

src

src

age

age

…

…

nt

nt

slack-composio-agent.

slack-composio-agent.

…

…

ts

ts

…

api

api

composio-webhook.

composio-webhook.

…

…

ts

ts

comp

comp

…

…

osio

osio

routing-with-pi-provider.

routing-with-pi-provider.

…

…

ts

ts

slackbot-setup.

slackbot-setup.

…

…

ts

ts

con

con

…

…

fig

fig

env.

env.

…

…

ts

ts

sla

sla

…

…

ck

ck

acl.

acl.

…

…

ts

ts

transport.

transport.

…

…

ts

ts

index.

index.

…

…

ts

ts

src/index.ts

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28

import { Composio } from '@composio/core';

import { createAuthCallbackHandler } from './api/auth-callback';
import { createComposioWebhookHandler } from './api/composio-webhook';
import { createApiHandler } from './api/router';
import { createSlackComposioAgent } from './agent/slack-composio-agent';
import { createSlackbotSetupService } from './composio/slackbot-setup';
import { loadConfig } from './config/env';
import { createSlackTransport } from './slack/transport';
import { createFileStore } from './store/file-store';

const config = loadConfig();
const store = await createFileStore(config.dataDir);
const composio = new Composio({ apiKey: config.composioApiKey });
const slack = createSlackTransport({ config, store });
const agent = createSlackComposioAgent({ config, slack, store });
const slackbotSetup = createSlackbotSetupService({ composio, config, store });
const composioWebhook = createComposioWebhookHandler({ agent, config, store });
const authCallback = createAuthCallbackHandler({ agent, slack, store });

const server = Bun.serve({
  hostname: config.host,
  port: config.port,
  fetch: createApiHandler({ authCallback, composioWebhook, slackbotSetup }),
});

console.log(`Composio Slack Pi bot listening on http://${server.hostname}:${server.port}`);
console.log(`Setup URL: ${config.appUrl}/setup/slackbot/start`);
```

## [Run it](https://docs.composio.dev/examples/general-agent-with-pi\#run-it)

Run `bun install.ts` once to set up the bot, start the server with `bun bot.ts`, then `@mention` the bot in any channel. It opens a session as you, finds the tool it needs, runs it against your connections, and replies in thread as the workspace bot, usually within a few seconds. Ask it to do something in an app you haven't connected yet and it DMs you a link first, then continues once you approve.

[**Configuring sessions** \\
Everything a session can scope: toolkits, tools, connections, and limits](https://docs.composio.dev/docs/configuring-sessions) [**Shared connections** \\
SHARED vs PRIVATE accounts and the per-user ACL](https://docs.composio.dev/docs/extending-sessions/shared-connections)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/general-agent-with-pi.mdx)
