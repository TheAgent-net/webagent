# web-agent — Design & Build Plan

An **AgentNet** project. Status: v0 (foundation in progress).
Audience: internal + partner companies.

---

## 1. What this is

A framework any business uses to stand up a production-grade **web/business agent** — an
agent that can actually *do* things for their customers (search, transact, support, operate)
over the business's systems, on whatever channels their customers already use.

The north-star finding from the research is the whole reason a framework exists:

> "Model capability does not limit agent performance; **architectural decisions determine
> success or failure**." — measured as 85% vs 50% task success on the *same models*, purely
> from better architecture (arXiv 2511.19477).

So the framework's job is to **own the production-grade architecture once**, so every
business's agent inherits it — reliability, safety, memory, observability, multi-tenancy —
instead of each business rebuilding it badly.

## 2. Three audiences, one contract

1. **Businesses that configure (Tier 1, no code).** Fill in a declarative spec; **pick a
   provider from the menu** for each slot (model, memory, guardrails, retrieval, channels);
   get a running agent. ~80% of businesses.
2. **Businesses that extend (Tier 2, SDK).** Implement a slot interface for something unusual
   (a custom retriever over their DB, a custom tool) and register it. They never fork.
3. **Partner companies that provide.** Collaborating companies implement a slot's **Service
   Provider Interface (SPI)** and ship an adapter for memory, guardrails, model routing,
   observability, etc. Some are marked as the zero-config default. **The business still picks
   from the lot** — defaults are a convenience, never a lock-in. (Partner roster per slot is a
   separate deliverable, TBD.)

The single artifact all three depend on is the **SPI**: the stable, versioned set of slot
interfaces. It is the most important thing in this repo and the most expensive to change once
partners build against it — so it is designed first, deliberately, and versioned.

## 3. The slots (pluggable pillars)

Each pillar is a **slot**: an interface + a registry of providers + a designated default. A
business's spec picks one provider per slot. Named partners are filled in from the partner
roster later; today each slot ships a safe built-in default.

| Slot | Interface | Providers (the menu) | Built-in default |
|------|-----------|----------------------|------------------|
| Model | `Brain` / `model.LLM` | Gemini + any via LiteLLM/OpenRouter adapter; partners | (Phase 2) |
| Action | `Tool` / ActionProvider | MCP, browser (a11y+vision), HAR-derived API | MCP |
| Retrieval | `Retriever` | live, keyword, hybrid (BM25+dense+rerank); partners | live |
| Memory | `Memory` | partner providers; self-host | session (built-in) |
| Guardrails | `Guardrail` | partner providers; self-host | basic (built-in) |
| Channels | `Channel` + `Presenter` | a2a, web, whatsapp, telegram, slack (via AG-UI) | a2a |
| Observability | exporter | OpenTelemetry GenAI; partners | otel |

## 4. The Provider SPI (centerpiece)

What makes a multi-partner, default-provider ecosystem *proper*:

1. **Adapters live outside the core.** The core defines the slot interface; each partner ships
   an adapter module mapping their API to it, versioned independently.
2. **Default + override resolution.** Empty pick → the slot's default; an explicit pick swaps
   it; `self-host` brings the business's own. Defaults never leak their semantics into core.
3. **Capability negotiation (no lowest-common-denominator).** A small required core interface
   + optional capability interfaces + a `config` passthrough. Providers *advertise*
   capabilities; the agent uses the rich path when present and degrades gracefully when not.
   (Same pattern as OpenTelemetry exporters / k8s CSI.)
4. **Conformance kit.** A shared test suite each adapter must pass to be a certified provider —
   and the quality bar for becoming a default.
5. **Per-tenant provider credentials + data-privacy by provider.** Keys stored per-business in
   the credential vault; provider choice doubles as a compliance/residency lever.
6. **Failure isolation + fallback.** Each slot has a circuit breaker + fallback (memory
   provider down → degrade to the built-in session memory, never crash the agent).
7. **Governance.** Interfaces are semver'd with published deprecation windows — once partners
   depend on them, a breaking change is a commercial event.

## 5. Model-agnosticism (resolves the ADK situation)

ADK Go's model layer is a 2-method interface (`Name`, `GenerateContent`) whose payloads are
Google `genai` types — so you're locked to the *schema*, not to Gemini-the-service; ADK just
ships only a Gemini impl. Resolution, two levels:

- **Framework level:** the `Brain` interface isolates the whole framework from ADK/genai.
- **ADK level:** one `model.LLM` adapter translating genai ⇄ OpenAI-chat, fronted by a
  self-hosted gateway → any model, with **per-key budgets = the multi-tenant billing meter**.
  Keeps all of ADK's orchestration; swaps only the leaf.

## 6. Action layer (the "web")

MCP where it exists (given). For sites without MCP, a browser/computer-use fallback — the
research is clear a serious product uses **more than one perception mode**:

- accessibility tree (cheap, modern sites) primary, **vision selectively** for what it misses,
  runtime-DOM (extension, authed session) for enterprise/legacy.
- execution essentials: **versioned element refs** (stale-ref safety), `wait_for`, **bulk
  actions** (74% fewer calls), fresh snapshot after each action.
- Agent-E principles: **planner/executor split, DOM distillation + denoising, change
  observation, reusable primitive skills, self-improvement.**
- Build on existing OSS browser agents + managed browser infra — do not reimplement Playwright.

Unify MCP + browser + HAR behind one `Tool` interface; pick the cheapest reliable modality
per target.

## 7. Knowledge: retrieval + memory (two subsystems)

- **Retrieval (discovery):** hybrid BM25+dense+RRF+rerank; rule: *index for recall, live for
  truth* — never trust volatile facts from the index.
- **Memory (per-user, cross-session):** a dedicated component, not a longer prompt. Tiers
  working/episodic/semantic/procedural; extract facts → store scoped by user/session/agent →
  retrieve by semantic+recency+relevance → inject lean context; handle contradiction &
  staleness. This is the memory-partner slot.

## 8. Safety, observability, eval (the toy→production gap)

- **Safety is deterministic and code-enforced:** action allow/block lists, domain allowlists,
  least-privilege specialized agents, **human-in-loop confirm gates** (the checkout-gate
  pattern, generalized). "Even a 1% vulnerability rate is unacceptable." The framework
  *provides* these so a business can't ship an unsafe agent.
- **Observability built-in:** OpenTelemetry GenAI semantic conventions (LLM/agent spans,
  events, metrics), cost per request/user/model, circuit breakers, session replay. 85% of
  GenAI deployments have none — clearing that bar is table stakes here.
- **Eval harness** against WebVoyager/WebArena/WebGames from day one; a business tests before
  going live.

## 9. Multi-tenancy & marketplace identity (the moat)

Per-user OAuth linking + credential vault + identity forwarding (`X-Agentnet-User`) + the
**AgentNet** integration that makes a business's agent *hireable by other agents* with
escrow/billing. This is the layer none of the reused components have — the differentiator.

## 10. Build-on vs build

Reuse the ecosystem (partners + OSS) for the commoditized layers; the framework's own code is
the **spine + SPI + conformance kit + differentiators**: unified multi-modal action layer,
multi-tenant marketplace identity, deterministic safety, and the declarative spec/DX.

## 11. Roadmap

- **Phase 1 — SPI foundation (this PR):** generic capability-aware registry (default/override),
  slot interfaces incl. Memory + Guardrail, conformance-kit skeleton, spec v1, two example
  businesses. Green build/vet/test.
- **Phase 2 — Model-agnostic brain:** ADK `model.LLM` adapter + `Brain`, gateway fronting,
  routing/fallback/cost.
- **Phase 3 — Action layer:** MCP + browser fallback behind `Tool`; versioned refs; safety
  enforcer; domain firewall.
- **Phase 4 — Observability + eval harness:** OTel wiring, cost meter, WebVoyager eval.
- **Phase 5 — Memory/retrieval providers:** partner adapters via the conformance kit; hybrid
  retriever vector backend.
- **Phase 6 — Channels + identity hardening:** AG-UI/CopilotKit channels; per-tenant vault;
  AgentNet marketplace + billing.

## 12. Open decisions

- Module path is `github.com/TheAgent-net/webagent` (the AgentNet org). Confirm the final
  repo name; a different name is a one-command rename.
- Model provider: `openrouter` is the recommended start (one key, breadth); `gateway`
  fronts a self-hosted LiteLLM when per-tenant billing/routing is needed. Both are one
  OpenAI-compatible client; default stays `echo` (zero-config, no key).
- The comprehensive **partner roster per slot**, and the conformance bar to become a default.
- Spec format: JSON now (zero-dep); YAML for authoring ergonomics later.

## 13. Known deferred hardening (tracked, not yet built)

These are understood and scheduled, not overlooked. They are surfaced here (and in
[SECURITY.md](SECURITY.md)) so partners can see the roadmap:

- **Per-slot fallback / circuit-breaker.** When a partner provider errors or is unavailable,
  degrade to the built-in default (e.g. memory → session) instead of failing the turn.
- **PII / secret redaction in traces & memory.** `TurnTrace` carries input/output text and
  memory stores user content; add a redaction policy before any exporter ships user data.
- **Idempotency keys for side-effecting tools.** Order/payment-style actions need
  dedup/idempotency so a retry does not double-execute.
- **Rate limits, quotas, and cost caps** per tenant/user (the model gateway is the natural
  meter).
- **Multi-tenant credential vault** and per-tenant provider credentials, and the AgentNet
  identity-forwarding + escrow/billing integration.
