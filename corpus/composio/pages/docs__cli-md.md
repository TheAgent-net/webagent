---
url: https://docs.composio.dev/docs/cli.md
title: https://docs.composio.dev/docs/cli.md
description: 
status: 200
---

\# Composio CLI (/docs/cli)

The Composio CLI gives coding agents and terminals a local tool surface. Codex, Claude Code, or a person at the terminal can connect apps, execute tools, inspect schemas, call authenticated APIs, and debug Composio projects. It is also the runtime underneath the native \[Composio agent plugins\](/docs/agent-plugins).

Reach for it when you want an agent to act in your connected apps directly, without building an SDK application or configuring MCP.

\## Install \[#install\]

Install the CLI with one command:

\`\`\`bash
curl -fsSL https://composio.dev/install \| sh
\`\`\`

The installer downloads and verifies the release bundle in \`~/.composio\`, creates the \`~/.local/bin/composio\` entry point, and configures your shell so future terminals find \`composio\` on \`PATH\`. It recognizes \`zsh\`, \`bash\`, and \`fish\` login shells from \`$SHELL\` and writes a managed \`# Composio CLI\` block to their startup files. \`bash\` also gets a login-mode startup file — the first existing of \`~/.bash\_profile\` or \`~/.bash\_login\`, or a newly created \`~/.bash\_profile\` — because a login bash, which macOS Terminal.app starts, never reads \`~/.bashrc\`. If your shell is not recognized, or shell setup fails, the CLI still installs and the installer prints a runnable command instead. It does not install agent plugins or log you in unless you ask it to. To skip shell configuration entirely, see \[Shell setup overrides\](#shell-setup-overrides).

Open a new terminal, then log in:

\`\`\`bash
composio login
\`\`\`

Install the native plugin for Codex or Claude Code:

\`\`\`bash
composio setup --target auto
\`\`\`

\`auto\` detects supported agents on your machine. Use \`--target codex\` or \`--target claude\` to configure only one. See \[Agent plugins\](/docs/agent-plugins) for manual plugin commands and host-specific details.

Setup asks before changing local files. Add \`--yes\` when you run it from an agent, script, CI job, or another non-interactive shell.

\`composio login\` installs the standalone \`composio-cli\` skill for Claude Code by default. For Codex, prefer \`composio setup --target codex\`; it installs the native plugin, which bundles the CLI skill.

If you explicitly need the standalone skill without the native plugin, install it manually for the agent host:

\`\`\`bash
composio --install-skill composio-cli claude
composio --install-skill composio-cli codex
\`\`\`

\### Install with options \[#install-with-options\]

Pin a version and opt in to agent plugin setup:

\`\`\`bash
curl -fsSL https://composio.dev/install \
 \| COMPOSIO\_INSTALL\_VERSION=0.3.1 COMPOSIO\_INSTALL\_PLUGINS=1 sh
\`\`\`

You can also pass a stable or beta release tag as the positional argument. The positional value takes precedence over \`COMPOSIO\_INSTALL\_VERSION\`:

\`\`\`bash
curl -fsSL https://composio.dev/install \| sh -s -- @composio/cli@0.3.1
\`\`\`

\| Variable or argument \| Description \| Default \|
\| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`COMPOSIO\_INSTALL\_DIR\` \| Directory that receives the complete CLI bundle and \`release-tag.txt\`. \| \`$HOME/.composio\` \|
\| \`COMPOSIO\_BIN\_DIR\` \| Directory that receives the \`composio\` entry-point symlink. Set it to \`COMPOSIO\_INSTALL\_DIR\` to use the legacy single-directory layout. Treat this as trusted input: anyone who can write to this directory can replace commands that future terminals run. \| \`$HOME/.local/bin\` \|
\| \`COMPOSIO\_INSTALL\_VERSION\` \| Stable or beta version to install, with or without the \`@composio/cli@\` prefix. \| Latest stable release \|
\| \`version-tag\` \| Positional stable or beta version. This overrides \`COMPOSIO\_INSTALL\_VERSION\`. \| None \|
\| \`COMPOSIO\_QUIET\` \| Set to \`1\` or \`true\` to hide progress output. Warnings and errors still print. \| Unset \|
\| \`COMPOSIO\_DEBUG\` \| Set to \`1\` or \`true\` to print download URLs and temporary paths. \| Unset \|
\| \`COMPOSIO\_INSTALL\_HELP\` \| Set to \`0\` to hide normal post-install guidance. Shell-setup failures still warn and print a recovery command to stderr. \| \`1\` \|
\| \`COMPOSIO\_INSTALL\_PLUGINS\` \| Set to \`1\` to run \`composio setup --target auto --yes --if-present\` after installation. \| \`0\` \|
\| \`COMPOSIO\_INSTALL\_SHELL\` \| Shell setup mode: \`auto\` infers your login shell from \`$SHELL\`, \`zsh\`, \`bash\`, or \`fish\` force a specific shell, and \`none\` skips shell configuration. See \[Shell setup overrides\](#shell-setup-overrides). \| \`auto\` \|
\| \`COMPOSIO\_GITHUB\_OWNER\` \| GitHub owner used to resolve releases. \| \`ComposioHQ\` \|
\| \`COMPOSIO\_GITHUB\_REPO\` \| GitHub repository used to resolve releases. \| \`composio\` \|
\| \`COMPOSIO\_GITHUB\_URL\` \| GitHub web and release-download base URL. \| \`https://github.com\` \|
\| \`COMPOSIO\_GITHUB\_API\_BASE\_URL\` \| GitHub API base URL. \| Derived from \`COMPOSIO\_GITHUB\_URL\` \|
\| \`--agent\` \| Log in as a Composio agent after installation. \| Off \|
\| \`--no-plugins\` \| Skip agent plugin setup. Kept for compatibility and now matches the default. \| Off \|

\### Shell setup overrides \[#shell-setup-overrides\]

By default the installer infers your login shell from \`$SHELL\` and configures it. Set \`COMPOSIO\_INSTALL\_SHELL\` to force a specific shell instead:

\*\*zsh:\*\*

\`\`\`bash
curl -fsSL https://composio.dev/install \| COMPOSIO\_INSTALL\_SHELL=zsh sh
\`\`\`

This configures \`~/.zshrc\` and delegates setup to \`composio install --shell zsh\`.

\*\*bash:\*\*

\`\`\`bash
curl -fsSL https://composio.dev/install \| COMPOSIO\_INSTALL\_SHELL=bash sh
\`\`\`

This configures \`~/.bashrc\` and delegates setup to \`composio install --shell bash\`. It also configures a login-mode startup file so \`bash -ilc\` can find \`composio\`: the first active login file (\`~/.bash\_profile\`, then \`~/.bash\_login\`), or a new \`~/.bash\_profile\` that sources your existing \`~/.profile\` when neither exists.

\*\*fish:\*\*

\`\`\`bash
curl -fsSL https://composio.dev/install \| COMPOSIO\_INSTALL\_SHELL=fish sh
\`\`\`

This configures \`~/.config/fish/config.fish\` and delegates setup to \`composio install --shell fish\`.

Set \`COMPOSIO\_INSTALL\_SHELL=none\` for an install-only run that changes no shell files. Use it in CI, Docker images, or when a dotfile manager owns your startup files:

\`\`\`bash
curl -fsSL https://composio.dev/install \| COMPOSIO\_INSTALL\_SHELL=none sh
\`\`\`

Shell-specific installer variants (\`zsh.sh\`, \`bash.sh\`, and \`fish.sh\` in the repository's \[\`install/\` directory\](https://github.com/ComposioHQ/composio/tree/next/install)) pin \`COMPOSIO\_INSTALL\_SHELL\` to their shell before delegating to the base installer.

Shell setup is idempotent: repeated installs keep exactly one managed PATH block per startup file and reconcile it when the bin directory changes. Setup falls back to writing the same PATH block inline when the installed CLI predates \`composio install --shell\`, delegated setup fails, or delegated setup leaves a stale block. Startup-file changes only affect future terminals; in the current one, either open a new terminal or run the absolute path the installer prints.

\### Verify the installation \[#verify-the-installation\]

\`\`\`bash
composio --version
which composio
\`\`\`

The installer supports Linux x64, Linux ARM64, macOS Intel, and macOS Apple Silicon. On Windows, install and run it inside \[WSL\](https://learn.microsoft.com/windows/wsl/install).

\### Update \[#update\]

\`\`\`bash
composio upgrade
\`\`\`

This replaces the bundle in \`~/.composio\` in place and leaves the \`~/.local/bin/composio\` entry point pointing at it. Pass a version to pin a specific release (\`composio upgrade 0.3.1\`), or \`--beta\` for the latest prerelease.

\### Install manually from GitHub Releases \[#install-manually-from-github-releases\]

Download the archive for your platform from \[GitHub Releases\](https://github.com/ComposioHQ/composio/releases), then install the complete bundle. Keep the support files beside the executable.

\`\`\`bash
bundle=composio-linux-x64
COMPOSIO\_INSTALL\_DIR=${COMPOSIO\_INSTALL\_DIR:-"$HOME/.composio"}
COMPOSIO\_BIN\_DIR=${COMPOSIO\_BIN\_DIR:-"$HOME/.local/bin"}

unzip "$bundle.zip"
mkdir -p "$COMPOSIO\_INSTALL\_DIR"
cp -Rp "$bundle"/. "$COMPOSIO\_INSTALL\_DIR/"
chmod +x "$COMPOSIO\_INSTALL\_DIR/composio"
mkdir -p "$COMPOSIO\_BIN\_DIR"
if \[ "$COMPOSIO\_BIN\_DIR" != "$COMPOSIO\_INSTALL\_DIR" \]; then
 ln -sf "$COMPOSIO\_INSTALL\_DIR/composio" "$COMPOSIO\_BIN\_DIR/composio"
fi
export PATH="$COMPOSIO\_BIN\_DIR:$PATH"
\`\`\`

\### Uninstall \[#uninstall\]

Remove only installer-owned entry points and release artifacts. This keeps your credentials, configuration, and cache data in \`~/.composio\`. The file list below matches the current release layout; if you installed a different version, compare it against the contents of that release's archive.

\`\`\`bash
install\_dir=${COMPOSIO\_INSTALL\_DIR:-"$HOME/.composio"}
bin\_dir=${COMPOSIO\_BIN\_DIR:-"$HOME/.local/bin"}

rm -f \
 "$bin\_dir/composio" \
 "$install\_dir/composio" \
 "$install\_dir/release-tag.txt" \
 "$install\_dir/run-helpers-runtime.mjs" \
 "$install\_dir/run-subagent-shared.mjs" \
 "$install\_dir/run-subagent-acp.mjs" \
 "$install\_dir/run-subagent-legacy.mjs" \
 "$install\_dir/run-subagent-output-mcp.mjs"
rm -rf \
 "$install\_dir/services" \
 "$install\_dir/acp-adapters" \
 "$install\_dir/local-tools-binaries"

for file in \
 "$HOME/.zshrc" \
 "$HOME/.bashrc" \
 "$HOME/.bash\_profile" \
 "$HOME/.bash\_login" \
 "$HOME/.config/fish/config.fish"; do
 \[ -f "$file" \] \|\| continue
 tmp=$(mktemp) \|\| continue
 if awk '
 $0 == "# Composio CLI" { in\_block = 1; next }
 in\_block && (/^export COMPOSIO\_INSTALL\_DIR=/ \|\| /^set --export COMPOSIO\_INSTALL\_DIR /) { next }
 in\_block && (/^export PATH=/ \|\| /^set --export PATH /) { in\_block = 0; next }
 { in\_block = 0; print }
 ' "$file" > "$tmp"; then
 if \[ "$file" = "$HOME/.bash\_profile" \] && ! grep -q '\[^\[:space:\]\]' "$tmp"; then
 rm -f "$file"
 else
 cat "$tmp" > "$file"
 fi
 fi
 rm -f "$tmp"
done
\`\`\`

The loop stages every rewrite in a \`mktemp\` scratch file — created with an unpredictable name and \`0600\` permissions, so startup-file contents never pass through a world-readable path — and writes the result back only when \`awk\` succeeds. A failed or missing \`awk\` leaves the startup file untouched, and the scratch file is always removed. Writing back with \`cat\` keeps a symlinked startup file intact: the symlink, its target's inode, owner, and mode all survive. The filter removes the current managed block and the three-line block written by older installers (marker plus \`export COMPOSIO\_INSTALL\_DIR=...\` or \`set --export COMPOSIO\_INSTALL\_DIR ...\`).

\`~/.bash\_profile\` gets one extra step: when removing the block leaves only blank lines, the file is deleted. The installer creates \`~/.bash\_profile\` on bash systems that had no login startup file, and bash prefers even an empty \`~/.bash\_profile\` over \`~/.profile\`, so leaving the empty file behind would silently override bash's normal startup-file selection forever. Note the edge case: a \`~/.bash\_profile\` you created yourself but left empty is also removed. If you had a \`~/.profile\` when you installed, the created \`~/.bash\_profile\` instead keeps a passthrough that sources it, so the file is not blank and survives the loop with only the block removed. It begins with \`# Created by the Composio CLI installer.\`; delete it too if you want bash to read \`~/.profile\` directly again.

\> \*\*Purge all CLI state\*\*

The command below also deletes saved credentials, configuration, and caches. Run it only when you want a complete reset.

\`\`\`bash
rm -rf "${COMPOSIO\_INSTALL\_DIR:-$HOME/.composio}"
\`\`\`

\## Agent and terminal workflows \[#agent-and-terminal-workflows\]

The CLI executes tools, connects accounts, scripts workflows, calls authenticated APIs, and inspects trigger events without you wiring up a custom integration first. Native Codex and Claude Code plugins expose these capabilities to the agent; the same commands work directly in your terminal.

\### Search, connect, and execute tools \[#search-connect-and-execute-tools\]

Use this flow when you or your agent needs to act in one of your connected apps:

\`\`\`bash
\# Find the right tool
composio search "summarize my unread gmail"

\# Inspect the required input schema
composio execute GMAIL\_FETCH\_EMAILS --get-schema

\# Connect the app if needed
composio link gmail

\# Execute the tool
composio execute GMAIL\_FETCH\_EMAILS \
 -d '{ query: "is:unread newer\_than:1d", max\_results: 10 }'
\`\`\`

The commands you'll reach for most:

\| Command \| Use it for \|
\| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`composio search\` \| Find relevant tools by natural language \|
\| \`composio execute\` \| Execute a known tool slug \|
\| \`composio link\` \| Connect an app account \|
\| \`composio proxy\` \| Call provider APIs with Composio-managed auth \|

Use \`composio proxy\` when the agent already knows the provider's API endpoint and just needs Composio to inject auth from your connected account:

\`\`\`bash
composio proxy https://gmail.googleapis.com/gmail/v1/users/me/profile --toolkit gmail
\`\`\`

\### Run scripts and sub-agents \[#run-scripts-and-sub-agents\]

Reach for \`composio run\` when the agent needs a multi-step workflow: loops, parallel fan-out, data transformation, or LLM-assisted summarization. It runs inline TS/JS or a file, with \`execute()\`, \`search()\`, \`proxy()\`, \`experimental\_subAgent()\`, \`result.prompt()\`, and \`z\` injected.

Run a single scripted workflow:

\`\`\`bash
composio run '
const messages = await execute("GMAIL\_FETCH\_EMAILS", {
 query: "is:unread newer\_than:1d",
 max\_results: 10,
});
console.log(messages);
'
\`\`\`

Fan out across multiple tools:

\`\`\`bash
composio run '
const \[emails, issues, events\] = await Promise.all(\[\
 execute("GMAIL\_FETCH\_EMAILS", { max\_results: 5 }),\
 execute("GITHUB\_LIST\_REPOSITORY\_ISSUES", { owner: "composiohq", repo: "composio", state: "open" }),\
 execute("GOOGLECALENDAR\_FIND\_EVENT", { calendar\_id: "primary" }),\
\]);
console.log({ emails: emails.data, issues: issues.data, events: events.data });
'
\`\`\`

Ask a sub-agent to summarize tool output and return structured data:

\`\`\`bash
composio run --logs-off '
const \[emails, issues\] = await Promise.all(\[\
 execute("GMAIL\_FETCH\_EMAILS", { max\_results: 5 }),\
 execute("GITHUB\_LIST\_REPOSITORY\_ISSUES", { owner: "composiohq", repo: "composio", state: "open" }),\
\]);

const brief = await experimental\_subAgent(
 \`Create a morning brief from these emails and issues.\\n\\n${emails.prompt()}\\n\\n${issues.prompt()}\`,
 {
 schema: z.object({
 brief: z.string(),
 urgentEmails: z.array(z.string()),
 urgentIssues: z.array(z.string()),
 }),
 }
);

console.log(brief.structuredOutput);
'
\`\`\`

Run a checked-in script:

\`\`\`bash
composio run --file ./workflow.ts -- --repo composiohq/composio
\`\`\`

\### Listen to trigger events \[#listen-to-trigger-events\]

Use trigger listening when the agent needs to wait for new events, inspect incoming payloads, or forward events while debugging. Event streaming lives in the developer namespace:

\`\`\`bash
\# Compact table view for matching events
composio dev listen --toolkits gmail --table

\# Raw JSON payloads, then stop after five events
composio dev listen --trigger-slug GMAIL\_NEW\_GMAIL\_MESSAGE --json --max-events 5

\# Forward each matching event to a local or hosted webhook
composio dev listen --toolkits github --forward https://example.com/webhook

\# Append matching events to a local file for an agent to inspect
composio dev listen --toolkits slack --out ./events.jsonl
\`\`\`

Filter by toolkit, trigger slug, trigger ID, connected account ID, or userID to focus Claude on a single event source.

\## Build on the Composio platform \[#build-on-the-composio-platform\]

Use these commands while building on the Composio developer platform. They initialize local project context, create auth configs, manage connected accounts, test tool execution, inspect logs, and debug trigger flows.

\### Initialize project context \[#initialize-project-context\]

\`\`\`bash
\# Initialize local project context
composio dev init

\# Toggle developer mode
composio dev --mode on
composio dev --mode off

\# Switch or inspect project scope
composio dev projects list
composio dev projects switch
\`\`\`

\### Inspect toolkits and versions \[#inspect-toolkits-and-versions\]

\`\`\`bash
composio dev toolkits list
composio dev toolkits search "email"
composio dev toolkits info github
composio dev toolkits version github
\`\`\`

\### Create and inspect auth configs \[#create-and-inspect-auth-configs\]

\`\`\`bash
\# List existing auth configs
composio dev auth-configs list
composio dev auth-configs list --toolkits github,gmail
composio dev auth-configs info ac\_xxx

\# Create an auth config from provider credentials
composio dev auth-configs create "GitHub OAuth" \
 --toolkit github \
 --auth-scheme OAUTH2 \
 --scopes "repo,user" \
 --custom-credentials '{ "client\_id": "...", "client\_secret": "..." }'
\`\`\`

\### Manage connected accounts \[#manage-connected-accounts\]

Top-level \`composio link\` is the fastest path for personal knowledge work. Use the developer connected-account commands when you're building against project users, auth configs, and playground flows.

\`\`\`bash
composio dev connected-accounts list
composio dev connected-accounts list --toolkits github --user-id user\_123
composio dev connected-accounts list --status ACTIVE --limit 20
composio dev connected-accounts info ca\_xxx
composio dev connected-accounts whoami ca\_xxx
composio dev connected-accounts link
\`\`\`

\### Execute and inspect logs \[#execute-and-inspect-logs\]

\`\`\`bash
\# Execute a tool through the developer playground path
composio dev playground-execute GMAIL\_SEND\_EMAIL \
 -d '{ recipient\_email: "you@example.com", subject: "Test", body: "Hello" }'

\# Inspect tool and trigger logs
composio dev logs tools --toolkit gmail --limit 20
composio dev logs tools log\_xxx
composio dev logs triggers --limit 20
\`\`\`

\### Work with triggers \[#work-with-triggers\]

\`\`\`bash
composio dev triggers list gmail
composio dev triggers info GMAIL\_NEW\_GMAIL\_MESSAGE
composio dev triggers status
composio dev triggers create
composio dev triggers enable ti\_xxx
composio dev listen --trigger-slug GMAIL\_NEW\_GMAIL\_MESSAGE --json --max-events 5
\`\`\`

\### Generate type definitions \[#generate-type-definitions\]

For legacy direct tool execution projects, generate local TypeScript or Python types from tool schemas:

\`\`\`bash
composio generate
composio generate ts --toolkits github,gmail
composio generate py --toolkits github,gmail
\`\`\`

Reach for this section when you're debugging auth configs, connected accounts, trigger delivery, or tool execution in a Composio project. For user-facing app development, start with the SDK and session docs and keep the CLI as a local debugging companion.

\## Building on top of the CLI \[#building-on-top-of-the-cli\]

\> Don't build a production integration on top of the CLI. It's in constant development, and Composio doesn't offer CLI-level SLAs as an application runtime contract. For a stable integration, build on the Composio SDKs and APIs instead.

That said, the CLI works well as a bootstrap or helper layer for agent-native products:

\\* Use \`composio connections list\` to inspect which connected accounts are available locally.
\\* Use \`composio run\` or \`composio proxy\` for internal automations where CLI churn is acceptable.

For an example of a product built around CLI-driven agent workflows, see \[Houston\](https://github.com/gethouston/houston).

\## Help \[#help\]

Use \`--help\` on the root command or any subcommand:

\`\`\`bash
composio --help
composio --help full
composio execute --help full
composio run --help full
composio dev --help full
\`\`\`

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
