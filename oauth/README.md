# OAuth connections for embedded hosts

This package provides consent, encrypted per-user token storage, and a per-turn MCP
tool source for authenticated embedding hosts. The built-in web channel still does
not authenticate users or mount consent routes; the static MCP action provider is
unchanged. Flow-managed sources refresh tokens and coordinate reconnect/local
disconnect within one process. Application login, remote revocation, distributed
coordination, and dynamic client registration are not implemented here.

## Host integration

1. Register an OAuth application with the approved issuer. Configure authorization
   code flow with PKCE S256, and register the exact callback URI. Supported token
   endpoint authentication methods are `none` and `client_secret_basic`.
2. Obtain a persistent random 32-byte encryption key from the host's secret store.
   Keep it separate from the token directory. Create one `oauth.NewFileStore` per
   directory and share it within one process, or provide your own `oauth.Store`.
3. Construct one flow per configured integration during host startup:

   ```go
   flow, err := oauth.NewFlow(ctx, oauth.FlowConfig{
       Binding: oauth.Binding{
           IntegrationID: "notes",
           Resource:      configuredMCPURL,
           Issuer:        approvedIssuerURL,
           ClientID:      registeredClientID,
       },
       RedirectURI:               "https://app.example/oauth/notes/callback",
       Scopes:                    []string{"notes:read"},
       TokenEndpointAuthMethod:   "client_secret_basic",
       ClientSecret:              secretFromHostVault,
   }, store)
   if err != nil {
       return err
   }
   defer flow.CloseIdleConnections() // Run when the host shuts down.

   mux.HandleFunc("/oauth/notes/connect", flow.Start)
   mux.HandleFunc("/oauth/notes/callback", flow.Callback)
   mux.HandleFunc("/oauth/notes/disconnect", flow.Disconnect)
   ```

   For a registered public client, choose `none` and omit `ClientSecret`.
   The scope list is configured by the operator; server challenges never expand it.
   Startup performs resource and issuer discovery using public HTTPS endpoints.
   Token requests have the same public-IP and no-redirect restrictions. Endpoint
   query strings and cross-origin authorization/token endpoints are unsupported.

4. Protect **all three** routes with the host's authenticated browser-session middleware.
   After verifying the session, attach its stable tenant/user via
   `core.WithIdentity`, then pass `r.WithContext(ctx)` to the handler. Do not derive
   identity from the body, query, or arbitrary headers. Existing `/chat` user values
   do not prove identity. The host session must survive the top-level GET callback
   from the issuer. Use a distinct registered callback for each issuer.
5. Add a same-origin HTML form that POSTs to `/oauth/notes/connect`. The handler
   checks the browser's `Origin` against the configured callback origin and redirects
   to consent. It ignores supplied scopes, user IDs, and return URLs. Reverse proxies
   must preserve the configured public Host; forwarded identity/host headers are
   not interpreted by this package.

The callback exchanges the code and saves tokens only after verifying the identity,
browser cookie, single-use state, and issuer (required when advertised; validated
whenever supplied). The browser receives a fixed success/error message, never tokens.
The same callback URI and MCP `resource` appear in authorization and token requests.

Do not log callback query strings, authorization redirect URLs, cookies, client
secrets, or token responses in the host or reverse proxy. Handler responses disable
caching and referrer transmission. Pending attempts expire after five minutes;
process restart loses them. Failed exchanges are not retried: start consent again.
Only the newest attempt for a given callback in one browser can finish. Starting
again with its binding cookie removes that identity's superseded attempt. Pending
consent is limited to eight attempts per tenant/user and 1024 per Flow; additional
attempts receive HTTP 429 until capacity is released or attempts expire. Dropping
cookies does not bypass the per-identity limit. The host should additionally rate
limit requests according to its own account and tenant admission policy.

## Personal MCP tools

Create the source from the **same Flow instance** used for consent and disconnect,
then inject it at build time. The application's spec should use `action.provider: "none"` for
this integration, rather than configuring a second static MCP client.

```go
source, err := flow.ToolSource()
if err != nil {
    return err
}
defer source.CloseIdleConnections() // Run when the host shuts down.
agent, err := build.Build(ctx, agentSpec, build.WithToolSource(source))
if err != nil {
    return err
}
// Pass the host-authenticated request context, containing core.Identity.
reply, err := agent.Handle(request.Context(), core.Turn{Text: message})
```

No personal credentials are needed at build time. After the input guardrail accepts
a turn, its verified identity selects the stored connection. The source initializes
a fresh MCP session and lists that user's tools. The builder applies the action
guardrail to each returned tool, preserving its schema. Names must be unique across
static and per-turn tools. Lists and sessions are never cached in shared agent state.

Token lookup runs again before each MCP request, including tool calls. Missing,
deleted, or invalid credentials fail closed. Known expiry within 30 seconds triggers
refresh when a refresh token exists. Concurrent requests share the saved result;
refresh-token rotation is persisted, and omission preserves the previous refresh
token. Granted scopes cannot expand. Unknown expiry is not guessed.

A connection identifier survives refresh and changes on reconnect. Old tools cannot
run under a replacement account (`ErrConnectionChanged`), even if its access token
happens to be identical. Scope changes also require a fresh turn/catalog. A 401/403
becomes `ErrAuthorizationRequired`; MCP tool calls are never automatically replayed.

Refresh failures (including uncertain network results or failure to save rotated
tokens) discard the local connection and require consent again. This conservative
policy avoids replaying a potentially consumed rotating token. If cleanup itself
fails, the connection is blocked in this Flow until consent/disconnect succeeds;
the block is in memory, so the host must resolve storage failures before restarting.

The authenticated same-origin POST disconnect handler deletes credentials and
cancels pending consent attempts. It waits for an admitted Start or active
refresh/callback mutation to finish, preventing late writes from restoring access
after successful deletion.
Already-sent MCP calls may finish. Disconnect does not revoke the provider-side grant.
Use one Flow per binding/store; bypassing it with direct store writes or additional
Flow instances forfeits coordination. A fixed set of lock stripes bounds lock memory;
unrelated identities that hash to the same stripe may briefly wait for each other.
Start is admitted when it acquires the lifecycle lock. Disconnect cancels starts
ordered before it; a new Start admitted after disconnect can begin fresh consent.

The lower-level `NewMCPToolSource(binding, store)` remains available for hosts with
their own lifecycle management. It does not refresh; changing the access token
invalidates its old tools until a new turn.

Authenticated turns use an opaque tenant-qualified UserID for conversation memory,
retrieval and reasoning, ignoring the channel's claimed user name. Legacy providers
can read original tenant/user values through `core.IdentityFromContext`. Existing
memory under old channel IDs is not migrated. The host must authenticate every
personal-agent route; these helpers do not turn `/chat` into a login system.

## Verification

Run from the repository root:

```sh
go test ./oauth -run '^TestFlow' -v -count=1
go test ./oauth -run 'TestPersonal|TestConsentToPersonalToolExecution' -v -count=1
go test ./oauth -run '^TestLifecycle' -v -count=1
go test -cover ./...
go vet ./...
```

`TestFlowConsentPersistsTokens` uses a local TLS authorization server to verify PKCE,
client authentication, resource and callback binding, and storage. Only the test
replaces the network transport to permit a private fixture. The public constructor
does not expose this bypass. These tests exercise HTTP handlers, not a browser UI
or real provider compatibility. `TestConsentToPersonalToolExecution` continues from
consent through encrypted storage, `build.Build`, `Agent.Handle`, and an MCP tool
call. It uses a test brain rather than a paid model. Isolation tests cover concurrent
users, tenant-qualified history, credential replacement, and action guardrails.

For a manual test in an authenticated embedding host:

1. Configure the registered application, issuer, resource, scopes, and encrypted store
   as above. For local hosting, an exact callback such as
   `http://127.0.0.1:19090/oauth/notes/callback` is supported if the issuer permits it.
   HTTP callbacks on remote hosts and the hostname `localhost` are rejected. The
   issuer and resource still need publicly reachable HTTPS discovery endpoints.
2. Sign in to the host as user A. Submit the Connect form, sign in to the provider,
   and approve access. Expect `Account connected` at the callback.
3. Verify that `store.Load` succeeds using A's verified context and the configured
   binding; inspect presence/expiry/scopes only, never print credentials.
4. Restart the host with the same store directory and encryption key. Verify that
   A's connection remains readable. An unfinished consent attempt must be restarted.
5. Sign in as user B and verify `ErrNotConnected` for the same binding until B
   independently connects. Try returning A's pending callback while signed in as B;
   it must fail without saving anything for B.
6. Start again and deny permission, replay a completed callback, clear the binding
   cookie, and let an attempt expire. Each must fail without another token exchange
   or overwriting a previously stored connection.

7. With `WithToolSource` wired as above, ask for a fact from A's connected account.
   Repeat as B and check each user gets only their own tools, results, and history.
   An unconnected user must fail before personal reasoning; no shared token is used.
8. Allow a known access-token expiry to approach, then start concurrent turns. Verify
   one successful refresh is persisted and subsequent requests use it. When testing
   a provider without refresh support, expect reconnect after expiry.
9. POST the Disconnect form while refresh is active. After disconnect succeeds,
   another tool request must report a missing connection. Returning an older pending
   consent callback must not reconnect it. Start fresh consent to reconnect.

Local disconnect is not provider-side revocation. File storage is single-process and
does not provide key rotation, rollback protection, or Windows crash-atomic writes;
protect its directory with OS access controls, including Windows ACLs.
