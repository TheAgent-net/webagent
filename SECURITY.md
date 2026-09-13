# Security Policy

## Reporting a vulnerability

Please report security issues privately. Do **not** open a public issue for a vulnerability.

- Use GitHub's **private vulnerability reporting** ("Report a vulnerability" on the Security
  tab), or
- email the maintainers at the address listed in the repository's organization profile.

Include a description, affected version/commit, and reproduction steps. We aim to acknowledge
within a few business days and to coordinate a fix and disclosure timeline with you.

## Scope and design notes

Security-relevant properties of the framework that reviewers should know:

- **Guardrails fail closed.** If a guardrail's `Inspect` returns an error, the framework denies
  (blocks input, withholds output, refuses the action) rather than proceeding. See
  [`core`](core/core.go) and [`action`](action/action.go).
- **Action safety is code-enforced.** Every tool call is routed through the guardrail *before*
  execution by `action.Guard`; the model cannot bypass it.
- **Secrets are never read from a spec.** A spec *names* a credential — any config key ending in
  `Secret` is a reference resolved through the [secrets vault](secrets/secrets.go) at build time,
  scoped per tenant. A reference that cannot be resolved fails the build rather than starting a
  provider without its credential. The `webagent keys` command stores keys in the OS user config
  dir (mode `0600`), outside the repo; an exported env var always takes precedence.
- **Inbound webhooks are authenticated before they are parsed.** The Slack adapter verifies
  `X-Slack-Signature` (HMAC-SHA256 over `v0:{timestamp}:{raw body}`) in constant time and rejects
  timestamps outside a five-minute replay window; the WhatsApp adapter verifies
  `X-Hub-Signature-256` against the app secret in constant time. A channel refuses to start
  without its signing credential, so an unauthenticated endpoint cannot be exposed by
  misconfiguration.
- **Webhook channels are loop-safe and idempotent at the delivery layer.** Bot/own messages never
  start a turn, and retried deliveries are de-duplicated by event/message id — so a platform
  retry cannot cause the agent to act twice.
- **Traces may contain user content.** `core.TurnTrace` carries input/output text. Observers
  that export traces are responsible for redaction/retention appropriate to their environment;
  the built-in `log` observer does not emit input/output text.

## Supply chain

CI runs `govulncheck` on every push and pull request. Dependencies are pinned via `go.sum`.

## Known deferred hardening

Tracked in [DESIGN.md](DESIGN.md) §13: per-slot fallback/circuit-breaker, PII/secret redaction in
traces and memory, idempotency keys for side-effecting *tools* (the webhook layer is already
de-duplicated), and rate limits / cost caps. Graceful in-flight draining has landed
(`Agent.Run` + `Agent.DrainTimeout`). The multi-tenant credential vault has landed (see
[`secrets/`](secrets/secrets.go)); managed/cloud vault providers are still to come.
