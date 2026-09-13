# webagent

An **AgentNet** project: a framework any business uses to stand up a production-grade
web/business agent from a **declarative spec** — pick a provider for each slot from a menu,
get a running agent. See [DESIGN.md](DESIGN.md) for the full architecture and roadmap.

## The model: slots, providers, picks

An agent is one **Brain** (LLM + instruction) over a set of pluggable **slots**, defined in
[`core/`](core/core.go). Each slot is a Service Provider Interface with a registry of
providers ([`spi/`](spi/spi.go)) and a default. A business's spec picks one provider per slot;
partner companies and businesses add providers by registering against the same interfaces —
nobody forks the core.

| Slot | Interface | Built-in providers | Default |
|------|-----------|--------------------|---------|
| Retrieval | `Retriever` | live, keyword, hybrid | live |
| Memory | `Memory` | session (+ partner adapters) | session |
| Guardrail | `Guardrail` | basic, off (+ partner adapters) | basic |
| Channel | `Channel` | a2a, web, slack, whatsapp, telegram (all live) | a2a |
| Secrets | `Secrets` | env, file, static (managed vaults to come) | env |
| Presenter | `Presenter` | text, terminal (QR), web | text |
| Model | `Brain` | echo, openrouter, gateway (any OpenAI-compatible) | echo |
| Action | `Provider` / `Tool` | none, demo, **mcp** (browser to come) | none |
| Observability | `Observer` | none, log, memory (OTel exporter to come) | none |

Every tool the agent holds — from the action provider or injected by the host — is wrapped by
`action.Guard`, which runs the chosen guardrail on the action **before** it executes. The model
cannot bypass it: action safety is code-enforced, not prompt-enforced.

Three audiences, one contract: businesses that **configure** (pick from the menu), businesses
that **extend** (register a custom provider), and partner companies that **provide** (ship an
adapter, some as defaults). The SPI is the stable, versioned contract all three depend on.

## Two example businesses, zero shared code

Both examples use the offline-friendly `demo` action provider (no network) so
`validate`/`serve` work without credentials or a live MCP. Swap in `"provider": "mcp"`
and an `mcpUrl` when you have a real server (see below).

- [`examples/zomato.json`](examples/zomato.json) — food delivery: `live` retrieval, `a2a`
  channel.
- [`examples/bakery.json`](examples/bakery.json) — a bakery: `keyword` retrieval over its own
  catalog, `web` channel.

## CLI

```sh
webagent options            # the menu a business picks from (* = default)
webagent validate <spec>    # load a spec and resolve every chosen provider
webagent serve <spec>       # build the agent and run its channels
webagent keys set openrouter  # store an API key (hidden prompt; 0600 in your config dir)
webagent keys list | rm <name>
```

By default the CLI runs with the model-free `echo` brain and no live tools, so the template is
demonstrable without credentials. To drive a real model, store a key and point the spec's
`model` slot at it:

```sh
webagent keys set openrouter        # paste your OpenRouter key at the prompt
# in the spec: "model": { "type": "openrouter", "config": { "model": "anthropic/claude-sonnet-5" } }
webagent serve myspec.json
```

Keys are read from the environment at runtime (an exported env var always wins); `keys set`
simply stores them in your OS config dir (mode `0600`) so you don't re-export each run. Keys
are never written into a spec.

## Connect your MCP

A business that already has an MCP server turns it into an acting agent with one spec block —
no code. The `mcp` action provider connects, lists the server's tools, and hands them to the
agent (each guarded):

```json
"action": {
  "provider": "mcp",
  "mcpUrl": "https://your-server/mcp",
  "config": { "apiKeyEnv": "YOUR_MCP_KEY" }
}
```

`validate`/`serve` perform the MCP handshake at build time, so `validate` reports the real tool
count. Streamable HTTP (JSON and SSE) and bearer/api-key auth are supported; OAuth-gated servers
are a follow-up.

## Reach your customers: Slack, WhatsApp, and Telegram

Live channel adapters put the same agent where customers already are. All three verify every
inbound webhook, acknowledge immediately (then reply through the platform API), ignore their
own messages, and de-duplicate retried deliveries. Slack and WhatsApp use HMAC request
signatures; Telegram authenticates its webhook with a secret token header.

```json
"channels": [
  { "type": "slack", "presenter": "text", "config": {
      "botTokenSecret": "SLACK_BOT_TOKEN",
      "signingSecretSecret": "SLACK_SIGNING_SECRET" } },
  { "type": "whatsapp", "presenter": "text", "config": {
      "phoneNumberId": "1234567890",
      "accessTokenSecret": "WHATSAPP_ACCESS_TOKEN",
      "appSecretSecret": "WHATSAPP_APP_SECRET",
      "verifyTokenSecret": "WHATSAPP_VERIFY_TOKEN" } },
  { "type": "telegram", "presenter": "text", "config": {
      "botTokenSecret": "TELEGRAM_BOT_TOKEN",
      "secretTokenSecret": "TELEGRAM_SECRET_TOKEN" } }
]
```

See [`examples/support-live-channels.json`](examples/support-live-channels.json). Point Slack's
Request URL at `/slack/events`, Meta's callback URL at `/whatsapp/webhook`, and set Telegram's
webhook (via `setWebhook` with the same secret token) at `/telegram/webhook`.

## Secrets: a spec names them, never contains them

Any config key ending in `Secret` is a **reference**: `"botTokenSecret": "SLACK_BOT_TOKEN"`
resolves through the selected vault into `botToken` at build time. So a spec is safe to commit,
and moving from environment variables to a managed vault is a one-line change (`"secrets":
{"type": "file", "config": {"path": "..."}}`) with no provider modifications. Secrets are scoped
per tenant, and a reference that cannot be resolved **fails the build** rather than starting a
channel with no credential.

## Provider conformance

Every provider — built-in or partner — must pass its slot's conformance suite
([`conformance/`](conformance/conformance.go)) to be certified (and to qualify as a default).
The built-in providers pass it in their own tests.

## Status

Complete and green (build/vet/test):

- **Phase 1 — SPI foundation:** slots, capability-aware registry (default/override), Memory +
  Guardrail partner slots, conformance kit, spec v1, two example businesses.
- **Phase 2 — model-agnostic brain:** `openrouter`/`gateway` OpenAI-compatible providers with a
  tool-calling loop; `echo` default.
- **Phase 3 — action layer:** pluggable action-provider slot (`none` / `demo` / `mcp`), and every
  tool call routed through the guardrail before it executes (deterministic, code-enforced safety).
- **Phase 4 — observability + eval:** per-turn `TurnTrace` (OTel GenAI-aligned) to a pluggable
  observer (none/log/memory), and an [`eval/`](eval/eval.go) harness (scenarios + checks).

- **Phase 5 — reach + credentials:** live **Slack**, **WhatsApp**, and **Telegram** channel
  adapters (signed webhooks, fast ack, loop-safe, de-duplicated) and a multi-tenant **secrets
  vault** that resolves `<name>Secret` references for every slot.

**Works today:** echo/openrouter/gateway brains; `mcp` over Streamable HTTP (JSON + SSE,
bearer/api-key); HTTP `a2a`/`web` channels; live Slack + WhatsApp + Telegram; secrets vault
(env/file/static); GuardAll; TurnTrace; `keys` CLI.

**Not yet:** browser action provider; OAuth-gated MCP; OTel exporter; partner memory/guardrail
adapters; AgentNet identity forwarding + billing. See [DESIGN.md](DESIGN.md).
