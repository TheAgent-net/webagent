# Compatibility & Versioning Policy

`webagent` exposes a **Service Provider Interface (SPI)** that partner companies and businesses
build providers against. Those providers are code we do not control, so the stability of the
interfaces is a contract, not a courtesy. This document states what that contract is.

## Semantic versioning

The module follows [Semantic Versioning 2.0](https://semver.org) and Go's
[module compatibility rules](https://go.dev/blog/module-compatibility).

- **Patch** (`v1.2.x`): bug fixes, no API change.
- **Minor** (`v1.x.0`): backward-compatible additions (new providers, new options, new optional
  interfaces, new struct fields).
- **Major** (`vX.0.0`): backward-incompatible changes. A new major version is a new module path
  (`.../webagent/v2`) so existing importers are never silently broken.

## Pre-1.0 (`v0.x`)

While the module is `v0.x`, the API is **stabilizing**: minor releases may still contain
breaking changes, called out in [CHANGELOG.md](CHANGELOG.md). We keep breakage rare and
documented. `v1.0.0` marks the first frozen public API.

## The "add, don't change" rule

Go makes some changes impossible to do compatibly. We hold to these rules so a provider built
today keeps compiling tomorrow:

- **Never change an exported function or method signature.** Add a new function/method instead.
  This is why `build.Build` takes functional `Option`s — new knobs are added without touching
  the signature.
- **Never remove or rename an exported identifier** within a major version. Deprecate instead.
- **Never add a method to an exported interface** that providers implement (`core.Retriever`,
  `core.Memory`, `core.Guardrail`, `core.Channel`, `core.Presenter`, `core.Brain`,
  `core.Tool`, `action.Provider`) — that breaks every existing implementation. New capabilities
  go through **optional interfaces** (see below), never by widening a required one.
- **Adding a struct field is compatible** and is the preferred way to extend config types like
  `spec.AgentSpec` and `spec.ComponentSpec`. Keep structs extensible; construct them with field
  names, not positional literals.

## Optional capabilities (how interfaces grow)

New, non-universal behavior is exposed as a **separate optional interface** that a provider may
also implement. Callers detect it with a type assertion and fall back gracefully when absent.
Examples already in the codebase:

- `core.ToolSchema` — a `Tool` may also advertise a description + JSON schema.
- `core.ToolSource` — a host may supply tools resolved per turn through
  `build.WithToolSource`, without changing `Tool`, `Brain`, or `action.Provider`.
- `spi.Capable` — a provider may advertise runtime `Capabilities`, so a consumer can branch on
  what a specific provider supports without changing the slot's required interface.

This is the mechanism that lets, say, the `Memory` slot fit multiple partners with different
strengths without dumbing the core interface down to a lowest common denominator.

## Deprecation

When something must go, it is:

1. marked `// Deprecated:` in the doc comment (surfaced by `go doc`, editors, and linters),
2. kept working for at least one minor release with a documented replacement,
3. removed only in a subsequent major version.

## Conformance

A provider is considered compatible only if it passes the relevant suite in
[`conformance/`](conformance/conformance.go). Run it in your adapter's tests. See
[docs/PROVIDER_GUIDE.md](docs/PROVIDER_GUIDE.md).
