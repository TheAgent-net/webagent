---
url: https://docs.composio.dev/docs/extending-sessions/shared-connections.md
title: https://docs.composio.dev/docs/extending-sessions/shared-connections.md
description: 
status: 200
---

\# Shared connections (/docs/extending-sessions/shared-connections)

By default, a connected account is \*\*PRIVATE\*\*: only the \`userID\` that created it can use it. A \*\*SHARED\*\* connection can be reached by other \`userID\`s, subject to a per-connection access control list (ACL).

You use a shared connection by \[pinning it into a session\](#using-a-shared-connection): the session's \`userID\` doesn't own the connection, but the pin makes it available. A SHARED connection is never resolved implicitly, so a session reaches one only when you pin it explicitly.

Typical use cases:

\\* \*\*Org-managed credentials.\*\* One Gmail, Salesforce, or GitHub connection that every user in your app can call against, without each user having to authenticate separately.
\\* \*\*Background agents acting on behalf of multiple users.\*\* The agent runs as a single service account but executes work for many \`userID\`s.
\\* \*\*Team mailboxes.\*\* \`support@\` or \`sales@\` accounts where any teammate can send and read mail through your app.

\## SHARED vs PRIVATE \[#shared-vs-private\]

\| \| PRIVATE (default) \| SHARED \|
\| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \*\*Who can use it\*\* \| Only the owning \`userID\` \| The creator plus every \`userID\` permitted by the ACL \|
\| \*\*Default access for other users\*\* \| Always denied \| Deny-by-default (the creator must grant access explicitly) \|
\| \*\*How it's used\*\* \| Implicit lookup by \`userID\` \| Must be \*\*explicitly pinned\*\* in a session \|
\| \*\*ACL fields\*\* \| Ignored \| \`allowAllUsers\`, \`allowedUserIds\`, \`notAllowedUserIds\` (inside the \`experimental\` block) \|

\## Creating a SHARED connection \[#creating-a-shared-connection\]

Pass an \`experimental\` block to \`link()\` (\`accountType\` in TypeScript, \`account\_type\` in Python) set to \`"SHARED"\`, and optionally an initial ACL. Omit the ACL block to keep the default deny-by-default state (only the creator can use it until you grant access).

\*\*Python:\*\*

\`\`\`python
\# Create a SHARED Gmail connection that any userId can use,
\# except \`user\_bob\`.
connection\_request = composio.connected\_accounts.link(
 user\_id="user\_admin",
 auth\_config\_id="ac\_gmail\_shared",
 experimental={
 "account\_type": "SHARED",
 "acl\_config\_for\_shared": {
 "allow\_all\_users": True,
 "not\_allowed\_user\_ids": \["user\_bob"\],
 },
 },
)
print(connection\_request.redirect\_url)

\# Have user\_admin complete the OAuth flow at the redirect URL,
\# then wait for the connection to become ACTIVE.
connected = connection\_request.wait\_for\_connection()
print(f"Shared connection ready: {connected.id}")
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
// Create a SHARED Gmail connection that any userId can use,
// except \`user\_bob\`.
const connectionRequest = await composio.connectedAccounts.link(
 "user\_admin",
 "ac\_gmail\_shared",
 {
 experimental: {
 accountType: "SHARED",
 aclConfigForShared: {
 allowAllUsers: true,
 notAllowedUserIds: \["user\_bob"\],
 },
 },
 },
);
console.log(connectionRequest.redirectUrl);

// Have user\_admin complete the OAuth flow at the redirect URL,
// then wait for the connection to become ACTIVE.
const connected = await connectionRequest.waitForConnection();
console.log(\`Shared connection ready: ${connected.id}\`);
\`\`\`

The returned \`connectedAccountId\` (\`ca\_...\`) is the ID you'll pin into other users' sessions.

\> ACL fields are only valid on SHARED connections. Sending an \`experimental.acl\_config\_for\_shared\` block on a PRIVATE connection raises \`ComposioAclOnlyForSharedError\`.

\## Using a shared connection \[#using-a-shared-connection\]

Pin the SHARED connection into a session through \`connectedAccounts\`. The session belongs to a \*different\* \`userID\` than the creator, and the pin is what makes the SHARED connection visible to that session.

The session config itself is \*\*not\*\* experimental. You pin the connection by ID exactly as you would a PRIVATE one.

\*\*Python:\*\*

\`\`\`python
\# user\_alice starts a session that pins the shared Gmail connection.
\# Gmail tools loaded from this session will resolve to that connection
\# even though user\_alice did not create it.
session = composio.sessions.create(
 user\_id="user\_alice",
 connected\_accounts={
 "gmail": \["ca\_gmail\_shared"\],
 },
)

tools = session.tools()
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
// user\_alice starts a session that pins the shared Gmail connection.
// Gmail tools loaded from this session will resolve to that connection
// even though user\_alice did not create it.
const session = await composio.create("user\_alice", {
 connectedAccounts: {
 gmail: \["ca\_gmail\_shared"\],
 },
});

const tools = await session.tools();
\`\`\`

\> A session may pin \*\*at most one SHARED connection per toolkit\*\*. Pinning two SHARED Gmail connections in the same session is rejected at session create time. Mixing one SHARED with multiple PRIVATE pins is allowed.

\## ACL resolution rule \[#acl-resolution-rule\]

When a non-creator \`userID\` attempts to use a SHARED connection, the ACL is evaluated in this order:

1\. \`userId\` ∈ \`notAllowedUserIds\` → \*\*DENY\*\*
2\. \`allowAllUsers === true\` → \*\*ALLOW\*\*
3\. \`userId\` ∈ \`allowedUserIds\` → \*\*ALLOW\*\*
4\. otherwise → \*\*DENY\*\* \*(deny-by-default)\*

Deny wins on conflict, which lets you express \*"share with everyone except a few people"\* by setting \`allowAllUsers: true\` and naming the exceptions in \`notAllowedUserIds\`.

The creator can always use their own connection. The ACL only governs other \`userID\`s.

\### Common ACL patterns \[#common-acl-patterns\]

The table below shows the inner shape of the ACL block (\`aclConfigForShared\` in TypeScript, \`acl\_config\_for\_shared\` in Python). Wrap it inside the \`experimental\` block at the call site. Field names are camelCase in the TypeScript samples; Python callers translate to snake\\\_case (\`allow\_all\_users\`, \`allowed\_user\_ids\`, \`not\_allowed\_user\_ids\`).

\| Goal \| ACL block \|
\| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \*\*Only the creator\*\* (default) \| \`{}\` (or omit the block) \|
\| \*\*Allow every \`userId\`\*\* \| \`{ allowAllUsers: true }\` \|
\| \*\*Targeted allow list\*\* \| \`{ allowedUserIds: \["user\_alice", "user\_bob"\] }\` \|
\| \*\*Everyone except a few users\*\* \| \`{ allowAllUsers: true, notAllowedUserIds: \["user\_bob"\] }\` \|
\| \*\*Combined: open + targeted deny\*\* \| \`{ allowAllUsers: true, notAllowedUserIds: \["user\_bob"\], allowedUserIds: \["user\_alice"\] }\` (Bob still denied, deny wins) \|

Each list accepts up to 1000 entries; each \`userID\` is 1..256 characters.

\## Updating the ACL \[#updating-the-acl\]

Call \`updateAcl()\` on the connected accounts namespace to change access after creation. It follows PATCH semantics: pass only the fields you want to change, omit a field to leave it unchanged, and pass an empty array to clear an allow or deny list.

\*\*Python:\*\*

\`\`\`python
\# Open access to everyone.
composio.connected\_accounts.update\_acl(
 "ca\_gmail\_shared",
 allow\_all\_users=True,
)

\# Add a targeted allow list (without touching the wildcard or deny list).
composio.connected\_accounts.update\_acl(
 "ca\_gmail\_shared",
 allowed\_user\_ids=\["user\_alice", "user\_bob"\],
)

\# Revoke the allow list; only the creator can use it again
\# (unless allow\_all\_users is True).
composio.connected\_accounts.update\_acl(
 "ca\_gmail\_shared",
 allowed\_user\_ids=\[\],
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
// Open access to everyone.
await composio.connectedAccounts.updateAcl("ca\_gmail\_shared", {
 allowAllUsers: true,
});

// Add a targeted allow list (without touching the wildcard or deny list).
await composio.connectedAccounts.updateAcl("ca\_gmail\_shared", {
 allowedUserIds: \["user\_alice", "user\_bob"\],
});

// Revoke the allow list; only the creator can use it again
// (unless allowAllUsers is true).
await composio.connectedAccounts.updateAcl("ca\_gmail\_shared", {
 allowedUserIds: \[\],
});
\`\`\`

\> Passing \`notAllowedUserIds: \[\]\` \*\*clears the deny list\*\*, which silently re-grants access to users you previously blocked. Always audit the allow side when clearing a deny list.

ACL writes are restricted to the connection's creator or an API key caller. Other callers get a permission error.

\## Listing SHARED connections \[#listing-shared-connections\]

By default \`list()\` returns \*\*PRIVATE only\*\*, so shared accounts must be requested explicitly. Pass an \`account\_type\` (Python) or \`accountType\` (TypeScript) filter to scope the query.

\| Value \| Returns \|
\| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`'PRIVATE'\` \*(default when omitted)\* \| Only PRIVATE connections \|
\| \`'SHARED'\` \| Only SHARED connections \|
\| \`'ALL'\` \| PRIVATE + SHARED \|

The filter is a flat query param on the wire (\`?account\_type=...\`), so it stays flat in both SDKs, unlike the create and update surfaces, which nest under \`experimental\`.

\*\*Python:\*\*

\`\`\`python
\# List every SHARED connection the caller has visibility into.
shared = composio.connected\_accounts.list(account\_type="SHARED")

for item in shared.items:
 print(item.id, item.toolkit.slug)

\# Scope to a single user's SHARED connections.
shared\_for\_alice = composio.connected\_accounts.list(
 account\_type="SHARED",
 user\_ids=\["user\_alice"\],
)
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
// List every SHARED connection the caller has visibility into.
const shared = await composio.connectedAccounts.list({ accountType: "SHARED" });

for (const item of shared.items) {
 console.log(item.id, item.toolkit.slug);
}

// Scope to a single user's SHARED connections.
const sharedForAlice = await composio.connectedAccounts.list({
 accountType: "SHARED",
 userIds: \["user\_alice"\],
});
\`\`\`

\## Inspecting the ACL \[#inspecting-the-acl\]

\`get()\` and \`list()\` responses surface \`accountType\` and \`aclConfigForShared\` under the same \`experimental\` block as the request shape. The \`aclConfigForShared\` field is populated only when the caller is the connection's creator or is using an API key. Other callers see the \`experimental\` block without that field.

\*\*Python:\*\*

\`\`\`python
account = composio.connected\_accounts.get("ca\_gmail\_shared")

if account.experimental:
 print(f"Type: {account.experimental.account\_type}") # "PRIVATE" or "SHARED"

 if account.experimental.acl\_config\_for\_shared:
 acl = account.experimental.acl\_config\_for\_shared
 print(f"Allow all users: {acl.allow\_all\_users}")
 print(f"Allowed: {acl.allowed\_user\_ids}")
 print(f"Denied: {acl.not\_allowed\_user\_ids}")
 else:
 # You're not authorised to see the ACL on this connection.
 print("ACL hidden")
\`\`\`

\*\*TypeScript:\*\*

\`\`\`typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your\_api\_key' });
const account = await composio.connectedAccounts.get("ca\_gmail\_shared");

if (account.experimental) {
 console.log("Type:", account.experimental.accountType); // "PRIVATE" or "SHARED"

 if (account.experimental.aclConfigForShared) {
 const acl = account.experimental.aclConfigForShared;
 console.log("Allow all users:", acl.allowAllUsers);
 console.log("Allowed:", acl.allowedUserIds);
 console.log("Denied:", acl.notAllowedUserIds);
 } else {
 // You're not authorised to see the ACL on this connection.
 console.log("ACL hidden");
 }
}
\`\`\`

\## Error handling \[#error-handling\]

\| Error \| When \|
\| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \| \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \|
\| \`ComposioAclOnlyForSharedError\` (400) \| ACL fields sent on a PRIVATE connection (at create or update time). \|
\| \`ComposioSharedAccessDeniedError\` (403) \| Direct execute with a SHARED \`connectedAccountId\` that the requesting \`userId\` isn't permitted to use. \|
\| \`ComposioSharedConnectionNotAccessibleError\` (400) \| A session pinned a SHARED connection that the session's \`userID\` cannot use. The error is raised at session create time, so the session never enters a state that fails mid-execution. \|

The access errors are caught the same way as any other Composio exception (\`ComposioAclOnlyForSharedError\` and \`ComposioSharedAccessDeniedError\` are exported from \`@composio/core\`, and live under \`composio.exceptions\` in Python).

\## Next \[#next\]

\- \[Configuring sessions\](/docs/configuring-sessions): Pin connected accounts, auth configs, and toolkit restrictions into a session

\-\-\-

📚 \*\*More documentation:\*\* \[View all docs\](https://docs.composio.dev/llms.txt) \| \[Glossary\](https://docs.composio.dev/llms.mdx/reference/glossary) \| \[Examples\](https://docs.composio.dev/llms.mdx/examples) \| \[API Reference\](https://docs.composio.dev/llms.mdx/reference)

\-\-\-

\# Composio SDK — Instructions for AI Code Generators

\*\*Context:\*\* This page documents the \*\*direct tool execution API\*\*. For most applications, the session-based pattern (\`composio.create(user\_id)\` + \`session.tools()\`) is simpler — but if the user is here, they likely want direct execution.

\-\-\-

\## Key Patterns

\### Authenticating Users

Create an \*\*Auth Config\*\* on \[dashboard.composio.dev\](https://dashboard.composio.dev?utm\_source=docs&utm\_medium=llm-guardrails&utm\_campaign=direct-execution), then use the auth config ID to generate a hosted auth URL:

\`\`\`python
from composio import Composio

composio = Composio()
connection = composio.connected\_accounts.link(
 user\_id="user\_123",
 auth\_config\_id="ac\_...", # from platform dashboard
)
print(connection.redirect\_url) # send user here to authenticate
\`\`\`

\`\`\`typescript
import { Composio } from "@composio/core";

const composio = new Composio();
const connection = await composio.connectedAccounts.link("user\_123", "ac\_...", {
 callbackUrl: "https://your-app.com/callback",
});
console.log(connection.redirectUrl); // send user here to authenticate
\`\`\`

\### Executing Tools

A toolkit version is \*\*required\*\* for direct execution — \`tools.execute()\` without one raises \`ToolVersionRequiredError\`, and \`"latest"\` alone is NOT accepted for manual execution. Either pass \`dangerously\_skip\_version\_check=True\` (TS: \`dangerouslySkipVersionCheck: true\`) on the execute call to run the newest version, or pin a dated version from \`composio.toolkits.get(slug).meta.version\` when outputs are parsed programmatically.

\`\`\`python
composio = Composio(toolkit\_versions={"github": "latest"})
tools = composio.tools.get("user\_123", tools=\["GITHUB\_CREATE\_ISSUE"\])

result = composio.tools.execute(
 "GITHUB\_CREATE\_ISSUE",
 {"owner": "org", "repo": "repo", "title": "Bug report"},
 user\_id="user\_123",
 dangerously\_skip\_version\_check=True, # required when running "latest"
)
\`\`\`

\`\`\`typescript
const composio = new Composio({ toolkitVersions: { github: "latest" } });
const tools = await composio.tools.get("user\_123", { tools: \["GITHUB\_CREATE\_ISSUE"\] });

const result = await composio.tools.execute("GITHUB\_CREATE\_ISSUE", {
 userId: "user\_123",
 arguments: { owner: "org", repo: "repo", title: "Bug report" },
 dangerouslySkipVersionCheck: true, // required when running "latest"
});
\`\`\`

\-\-\-

\## Rules

1\. \*\*\`user\_id\` is required\*\* — pass it to \`tools.get()\`, \`tools.execute()\`, and \`provider.handle\_tool\_calls()\`.
2\. \*\*\`tools.execute()\` signature\*\* — Python: \`execute(slug, arguments\_dict, \*, user\_id=..., version=...)\` (arguments is the second positional param). TypeScript: \`execute(slug, { userId, arguments, version })\`.
3\. \*\*A toolkit version is required\*\* — configure \`toolkit\_versions\` (Python) / \`toolkitVersions\` (TypeScript) at SDK init, or pass \`version\` per execute call; omitting both raises \`ToolVersionRequiredError\`. \`"latest"\` is rejected for manual execution unless the execute call also passes \`dangerously\_skip\_version\_check=True\` / \`dangerouslySkipVersionCheck: true\`.
4\. \*\*Provider at init\*\* — \`Composio(provider=OpenAIProvider())\` in Python, \`new Composio({ provider: new OpenAIProvider() })\` in TypeScript. Defaults to OpenAI if omitted.
5\. \*\*Correct provider imports\*\* — \`composio\_\` for Python, \`@composio/\` for TypeScript. For OpenAI Agents SDK use \`composio\_openai\_agents\` / \`@composio/openai-agents\`.
6\. \*\*Finding toolkit and tool slugs\*\* — browse the Toolkits catalog at https://docs.composio.dev/toolkits (each toolkit page lists tool slugs and versions), or search by task with the CLI: \`composio search ""\`.

\-\-\-

\# Calling the REST API directly

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
