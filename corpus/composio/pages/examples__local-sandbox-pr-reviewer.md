---
url: https://docs.composio.dev/examples/local-sandbox-pr-reviewer
title: Review pull requests in a sandbox you own | Composio
description: Composio usually runs your tools for you. A local sandbox is for when you need to run them yourself, on your filesystem, in your shell, inside your security boundary. Build a GitHub PR reviewer that runs checks in a sandbox you own and posts one grounded comment.
status: 200
---

# Review pull requests in a sandbox you own

Copy page

Composio usually runs your tools for you. A **local sandbox** is for the times you need to run them yourself: your filesystem, your shell, your security boundary. You still get [managed auth](https://docs.composio.dev/docs/authentication) and 1000+ apps; you just keep the code execution.

This example builds a GitHub PR reviewer that does exactly that: it clones a pull request into a sandbox _you_ own, runs the repo's real checks there, and posts one grounded comment. The sandbox here is E2B, but E2B is just the sample. The same pattern works with your own VM, container, Kubernetes job, or internal sandbox service.

It comes down to a handful of Composio pieces:

1. **A local sandbox session** is a [Composio session](https://docs.composio.dev/docs/how-composio-works) with [code execution turned off](https://docs.composio.dev/docs/configuring-sessions#disabling-the-sandbox). Composio still does [discovery](https://docs.composio.dev/docs/how-composio-works#meta-tools) and auth; it just won't run code for you.
2. **The helper contract** is what comes back: a Python helper exposing the same [`run_composio_tool`, `invoke_llm`, and `web_search`](https://docs.composio.dev/docs/sandbox/remote) tools Composio's managed sandbox runs for you, plus the `env` it needs. You inject it into your sandbox and the agent calls it.
3. **Your sandbox is the boundary.** Tool _execution_ happens in a box you control. E2B is the replaceable sample runner; the contract it honors is the real interface.

The sandbox holds your project API key

The `env` that `experimental_createLocalWorkbenchSession` returns includes your **project**`COMPOSIO_API_KEY`, and you inject that `env` into the sandbox. Anything running there can read it, including the untrusted PR code you clone and build. Treat the sandbox as your trust boundary: run it on infrastructure you control, give the reviewer a key scoped to only what it needs, and rotate the key if a run could have leaked it.

local-sandbox.runtimecode runs in your box

Host

Your orchestrator

src/runner.ts

Creates the session with`workbench.enable: false`, then starts a sandbox you own.

helper + env → sandbox

Sandbox · yours

Reviewer agent

your filesystem + shell

Clones the PR, installs deps, runs the repo's real checks, all inside your boundary.

run\_composio\_tool → Composio

Composio

Session![](https://logos.composio.dev/api/github)

Resolves the right GitHub action, runs it under the user's connection, and returns the result to the sandbox.

- · search + schema discovery
- · managed GitHub auth
- · tool execution + result

host (session, execution off) → your sandbox (runs checks) → run\_composio\_tool→ Composio (resolve + execute) → grounded PR comment

Below you build the host orchestration from scratch: a bare client first, then a piece at a time up to the full run loop, then a browse of the real source. You bring a Composio API key and a place to run code. Composio brings the tools.

## [Setup](https://docs.composio.dev/examples/local-sandbox-pr-reviewer\#setup)

You need a [Composio API key](https://dashboard.composio.dev/?utm_source=docs&utm_medium=content&utm_campaign=examples-local-sandbox-pr-reviewer), an OpenAI API key for the reviewer agent, a GitHub connection for your `COMPOSIO_USER_ID`, and [Bun](https://bun.sh/).

### No sandbox provider? Use the E2B sample runner

```
bun add @composio/core @composio/experimental e2b @openai/agents
```

Connect GitHub once for the user id you'll review as, then keep that same id for the review run:

```
bun run connect
```

## [Build the host](https://docs.composio.dev/examples/local-sandbox-pr-reviewer\#build-the-host)

`src/runner.ts` is the host: it owns orchestration, never tool execution. It starts as a bare Composio client and grows into the full run loop, one concept at a time. Each diff below is exactly what that concept adds.

### [Create the Composio client](https://docs.composio.dev/examples/local-sandbox-pr-reviewer\#create-the-composio-client)

The whole thing acts as one stable user, against the connections they own. Start there.

src/runner.ts

+6

```
1
2
3
4
5
6

import { Composio } from '@composio/core';
import { experimental_createLocalWorkbenchSession } from '@composio/experimental/workbench';
import { createE2bSandbox } from './sandbox/e2b';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const userId = process.env.COMPOSIO_USER_ID ?? 'local-pr-reviewer-user';
```

### [Check the GitHub connection](https://docs.composio.dev/examples/local-sandbox-pr-reviewer\#check-the-github-connection)

A local sandbox still leans on Composio for auth and [tool discovery](https://docs.composio.dev/docs/how-composio-works#meta-tools); only code execution moves to your side. So before booting any infrastructure, confirm this user actually has [GitHub connected](https://docs.composio.dev/docs/authentication), and hand them a connect link if not.

src/runner.ts

+14

```
2 unmodified lines

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

2 unmodified lines

import { createE2bSandbox } from './sandbox/e2b';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const userId = process.env.COMPOSIO_USER_ID ?? 'local-pr-reviewer-user';

// Composio runs tools as a user. Before anything else, make sure this user has
// an active GitHub connection. There's no point booting a sandbox without one.
async function requireGithubConnection() {
  const list = await composio.connectedAccounts.list({
    userIds: [userId],
    toolkitSlugs: ['github'],
    statuses: ['ACTIVE'],
  });
  if (list.items?.[0]) return;

  const request = await composio.toolkits.authorize(userId, 'github');
  throw new Error(`Connect GitHub first: ${request.redirectUrl}`);
}
```

### [Create the local sandbox session](https://docs.composio.dev/examples/local-sandbox-pr-reviewer\#create-the-local-sandbox-session)

The core of the integration. You create a [Composio session](https://docs.composio.dev/docs/configuring-sessions#creating-a-session) yourself with code execution off (`workbench.enable: false`, so Composio will not run code for you), then hand that session to `experimental_createLocalWorkbenchSession`. The helper validates the session is local (it errors if the session has the remote workbench enabled, because the managed workbench and a local sandbox can't both run for one session) and returns the pieces you run yourself: a `helperSource` (a Python helper with `run_composio_tool`, `invoke_llm`, and `web_search`) and the `env` that helper needs to reach Composio from inside your box.

src/runner.ts

+15

```
16 unmodified lines

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

16 unmodified lines

  const request = await composio.toolkits.authorize(userId, 'github');
  throw new Error(`Connect GitHub first: ${request.redirectUrl}`);
}

// The local sandbox session. Create a normal Composio session yourself with
// `workbench.enable: false` (Composio won't run code for you), then hand that
// session to the helper, which validates it's local and gives you the pieces to
// run code yourself, wherever you choose.
async function createWorkbench() {
  const session = await composio.create(userId, {
    toolkits: ['github'],
    workbench: { enable: false },
  });
  return experimental_createLocalWorkbenchSession(composio, session);
  // returns { helperSource, env }:
  //   helperSource: a Python helper exposing run_composio_tool / invoke_llm / web_search
  //   env:          the variables that helper needs to reach Composio from inside your box
}
```

### [Start your sandbox, inject the helper](https://docs.composio.dev/examples/local-sandbox-pr-reviewer\#start-your-sandbox-inject-the-helper)

Boot a box you control, write `helperSource` into it as `composio_helper.py`, and pass `env` to the process. That helper is the _only_ Composio-specific thing your sandbox has to carry. E2B is the sample runner; swap it for anything that honors the same contract.

src/runner.ts

+14

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

31 unmodified lines

  // returns { helperSource, env }:
  //   helperSource: a Python helper exposing run_composio_tool / invoke_llm / web_search
  //   env:          the variables that helper needs to reach Composio from inside your box
}

export async function runReview(repo: string, pr: number) {
  await requireGithubConnection();
  const workbench = await createWorkbench();

  // Start a sandbox you own, inject the helper, and pass the env. E2B is just
  // the sample runner; swap createE2bSandbox for any box that honors the same
  // contract: write a file, set env, run a command, stream output, tear down.
  const sandbox = await createE2bSandbox({
    apiKey: process.env.E2B_API_KEY,
    helperSource: workbench.helperSource, // written as composio_helper.py
    env: workbench.env,
  });
}
```

### [Run the reviewer and stream output](https://docs.composio.dev/examples/local-sandbox-pr-reviewer\#run-the-reviewer-and-stream-output)

Run the agent inside the sandbox and stream its output back. Whenever the agent calls `run_composio_tool`, the helper routes that GitHub action back through Composio under this user's connection. Tool _execution_ happens in your box; discovery and auth stay managed.

src/runner.ts

+14

```
44 unmodified lines

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
63

44 unmodified lines

    apiKey: process.env.E2B_API_KEY,
    helperSource: workbench.helperSource, // written as composio_helper.py
    env: workbench.env,
  });

  // Run the reviewer agent inside the sandbox and stream its output back. The
  // agent calls run_composio_tool from composio_helper.py, which routes GitHub
  // actions back through Composio under this user's connection.
  const task = `Review PR #${pr} on ${repo}. Run the repo's real checks in this sandbox.`;
  try {
    await sandbox.run('npx --yes tsx agent.ts', {
      env: { ...workbench.env, TASK: task, OPENAI_API_KEY: process.env.OPENAI_API_KEY },
      onStdout: (chunk) => process.stdout.write(chunk),
      onStderr: (chunk) => process.stderr.write(chunk),
    });
  } finally {
    await sandbox.teardown();
  }
}
```

## [The whole project](https://docs.composio.dev/examples/local-sandbox-pr-reviewer\#the-whole-project)

The file above is the spine. The real project rounds it out with a CLI, a smoke/dry-run path, the E2B runner behind the sandbox contract, the reviewer agent and its review policy, and the `composio_helper.py` the helper source compiles to. Here's a slice of the actual source, with the Composio touch-points highlighted. Browse the tree, read the files:

a slice of the real project, the Composio files do the work

age

age

…

…

nt

nt

agent.

agent.

…

…

ts

ts

instructions.

instructions.

…

…

md

md

…

src

src

revi

revi

…

…

ewer

ewer

runner.

runner.

…

…

ts

ts

sand

sand

…

…

box

box

e2b.

e2b.

…

…

ts

ts

config.

config.

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

runner.

runner.

…

…

ts

ts

workbench.

workbench.

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
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139

import { loadConfig, requireLiveConfig } from './config.js';
import { buildReviewTask, runReview, type ReviewTarget } from './runner.js';
import { createComposioClient, createGithubConnectUrl, getActiveGithubConnection } from './workbench.js';

type Command = 'review' | 'connect-github' | 'help';

interface CliOptions {
  command: Command;
  repo?: string;
  pr?: number;
  userId?: string;
  dryRun: boolean;
}

function usage(): string {
  return `Local PR Reviewer

Usage:
  bun run review -- --repo <owner/repo> --pr <number>
  bun run connect
  bun run smoke

Options:
  --repo <owner/repo>   GitHub repository to review
  --pr <number>         Pull request number
  --user-id <id>        Override COMPOSIO_USER_ID for this run
  --dry-run             Validate inputs and print the planned local-workbench flow
  --help                Show this message`;
}

function parseArgs(argv: string[]): CliOptions {
  const args = [...argv];
  const command = (args[0] && !args[0].startsWith('--') ? args.shift() : 'review') as Command;
  const options: CliOptions = {
    command: command === 'connect-github' || command === 'review' || command === 'help' ? command : 'help',
    dryRun: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === '--repo') {
      options.repo = next;
      index += 1;
    } else if (arg === '--pr') {
      options.pr = Number(next);
      index += 1;
    } else if (arg === '--user-id') {
      options.userId = next;
      index += 1;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      options.command = 'help';
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function parseTarget(options: CliOptions): ReviewTarget {
  if (!options.repo || !/^[^/\s]+\/[^/\s]+$/.test(options.repo)) {
    throw new Error('--repo must be in owner/repo format');
  }
  const pr = options.pr;
  if (!Number.isInteger(pr) || (pr ?? 0) <= 0) {
    throw new Error('--pr must be a positive integer');
  }
  return { repo: options.repo, pr: pr as number };
}

async function connectGithub(options: CliOptions): Promise<void> {
  const config = loadConfig();
  if (options.userId) config.userId = options.userId;
  if (!config.composioApiKey) throw new Error('COMPOSIO_API_KEY is required to create a GitHub connect URL');

  const composio = createComposioClient(config);
  const existing = await getActiveGithubConnection(composio, config.userId);
  if (existing) {
    console.log(`GitHub is already connected for ${config.userId} (${existing.id}).`);
    return;
  }

  const url = await createGithubConnectUrl(composio, config.userId);
  console.log(`Open this URL to connect GitHub for ${config.userId}:`);
  console.log(url);
}

function dryRun(target: ReviewTarget, userId: string): void {
  console.log('Dry run OK.');
  console.log(`User: ${userId}`);
  console.log(`Task: ${buildReviewTask(target)}`);
  console.log('Flow: create Tool Router session with workbench.enable=false, boot E2B, upload helper + reviewer, run checks, post one grounded PR comment.');
}

async function review(options: CliOptions): Promise<void> {
  const config = loadConfig();
  if (options.userId) config.userId = options.userId;
  const target = parseTarget(options);

  if (options.dryRun) {
    dryRun(target, config.userId);
    return;
  }

  requireLiveConfig(config);
  const result = await runReview({
    config,
    target,
    onEvent: (event) => console.log(`[${event.type}] ${event.detail}`),
  });
  console.log('\nReview result:\n');
  console.log(result);
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.command === 'help') {
    console.log(usage());
    return;
  }

  if (options.command === 'connect-github') {
    await connectGithub(options);
    return;
  }

  await review(options);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
```

## [Run it](https://docs.composio.dev/examples/local-sandbox-pr-reviewer\#run-it)

Dry-run first to validate your input with no credentials, network calls, or sandbox startup, then run it for real:

```
bun run review -- --repo ComposioHQ/composio --pr 123 --dry-run
bun run review -- --repo ComposioHQ/composio --pr 123
```

The host opens a local sandbox session, boots the sandbox, and runs the repo's real checks inside it, then posts one grounded comment, or nothing if it can't build the PR.

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/local-sandbox-pr-reviewer.mdx)
