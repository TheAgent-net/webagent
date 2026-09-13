# Changelog

All notable changes are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project follows
[Semantic Versioning](https://semver.org). See [COMPATIBILITY.md](COMPATIBILITY.md).

## [Unreleased]

### Added

- **Live Telegram channel adapter** (Bot API): authenticates webhook deliveries with the secret
  token (`X-Telegram-Bot-Api-Secret-Token`, constant-time compare), acknowledges immediately and
  replies through `sendMessage`, skips bot and non-text updates so the agent cannot loop, and
  de-duplicates retried deliveries by `update_id`. `examples/support-live-channels.json` shows it
  configured by secret reference.

### Changed

- Telegram reply delivery failures are recorded on the standard `slog` logger seam (hosts
  redirect it with `slog.SetDefault`) instead of being silently discarded after the webhook is
  acknowledged.
- The generic stub channel mechanism is gone (no registered channel is inert); the exported
  `ErrNotConfigured` sentinel is retained as deprecated so downstream references keep compiling.

## [0.3.0] - 2026-08-07

### Added

- **Live Slack channel adapter** (Events API): verifies `X-Slack-Signature` (HMAC-SHA256 over
  `v0:{ts}:{body}`, constant-time compare, 5-minute replay window), answers the
  `url_verification` handshake, acknowledges within Slack's 3-second budget and replies through
  `chat.postMessage` (threaded), ignores bot/own messages so the agent cannot loop, and
  de-duplicates retried deliveries.
- **Live WhatsApp channel adapter** (Cloud API): answers Meta's `hub.challenge` subscription
  handshake, verifies `X-Hub-Signature-256` against the app secret, acknowledges immediately and
  replies via the Graph API, skips status callbacks, and de-duplicates by message id.
- **Secrets slot (multi-tenant vault)**: `core.Secrets` with `env` (default), `file` (per-tenant
  JSON, 0600) and `static` (in-memory) providers. Any config key ending in `Secret` is a
  *reference* that `build` resolves through the vault (`botTokenSecret` -> `botToken`), so specs
  name credentials instead of containing them. Scoped per tenant; `build.WithSecrets` lets a host
  supply its own vault. An unresolvable reference fails the build.
- `examples/support-live-channels.json` showing both live channels configured by reference only.

### Changed

- Example specs use only offline channels so `validate`/`serve` still run without credentials;
  the live-channel configuration lives in its own example.
- Slack and WhatsApp are no longer inert stubs — they now require credentials and fail fast
  without them (only `telegram` remains a stub).

## [0.2.0] - 2026-08-07

### Added

- **`mcp` action provider**: connects to any MCP server over the Streamable HTTP transport
  (spec 2025-06-18), lists its tools, and exposes each to the agent (with its JSON schema,
  guarded). Handles both `application/json` and single-response `text/event-stream` replies,
  session ids, and the protocol-version header. Bearer/api-key auth via an env var; OAuth is a
  follow-up. Verified against a spec-compliant mock server (JSON + SSE paths).
- `build` now merges `action.mcpUrl` / `action.authBaseUrl` into the action provider config, so
  the mcp provider reads the endpoint the spec already declares.

### Changed

- `spec.Validate` no longer requires `action.mcpUrl` globally — the chosen action provider
  validates its own config (the mcp provider requires a url; `none`/`demo` do not).
- `validate` prints the resolved action provider + tool count instead of the raw url.
- Memory `Scope` now carries `AgentID` (isolates a shared backend per agent) and `SessionID`
  (from Turn metadata), not just `UserID`.

### Fixed

- `Agent.Run` no longer tears down when a channel returns cleanly (a stub channel returning nil
  used to stop the whole agent).
- Refreshed a stale CLI comment; added channels HTTP tests; golangci-lint findings resolved.

## [0.1.0] - 2026-08-07

### Added

- SPI foundation: capability-aware provider registry with default/override resolution, and
  slots for model, action, retrieval, memory, guardrail, channel, presenter, and observability.
- Model-agnostic brain: `openrouter` and `gateway` OpenAI-compatible providers with a
  tool-calling loop; `echo` default.
- Pluggable action-provider slot; every tool call is routed through the guardrail before it
  executes (deterministic, code-enforced safety).
- Per-turn observability (`TurnTrace`, OpenTelemetry GenAI-aligned) with `none`/`log`/`memory`
  observers, and an evaluation harness (`eval`).
- Conformance kit for certifying providers; two example businesses (Zomato, a bakery).
- `build.Build` functional options (`WithTools`, `WithLogger`); injected `*slog.Logger` seam.
- CLI `keys set/list/rm` to store model API keys in the OS config dir (mode `0600`, hidden
  prompt), auto-applied on `serve`; an exported env var still takes precedence.
- Project hygiene: Apache-2.0 license, CI (fmt/vet/race/coverage/govulncheck/golangci-lint),
  and a compatibility policy.

### Security

- Guardrails fail **closed** on error: input is blocked, output is withheld, and actions are
  refused if the guardrail itself errors.
