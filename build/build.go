// Package build assembles a runnable core.Agent from a declarative spec by resolving each
// chosen provider from its slot registry. Empty picks resolve to slot defaults. This is the
// step that turns "a business filled in the template" into "a running web agent."
package build

import (
	"context"
	"fmt"
	"log/slog"
	"slices"
	"strings"

	"github.com/TheAgent-net/webagent/action"
	"github.com/TheAgent-net/webagent/brain"
	"github.com/TheAgent-net/webagent/channels"
	"github.com/TheAgent-net/webagent/core"
	"github.com/TheAgent-net/webagent/guardrail"
	"github.com/TheAgent-net/webagent/memory"
	"github.com/TheAgent-net/webagent/observability"
	"github.com/TheAgent-net/webagent/present"
	"github.com/TheAgent-net/webagent/retrieval"
	"github.com/TheAgent-net/webagent/secrets"
	"github.com/TheAgent-net/webagent/spec"
)

// Option configures Build. Using functional options keeps Build's signature stable as new
// knobs are added over time (Go forbids compatible changes to an existing function signature).
type Option func(*options)

type options struct {
	tools      []core.Tool
	logger     *slog.Logger
	secrets    core.Secrets
	toolSource core.ToolSource
}

// WithTools injects extra tools in addition to the action provider's — e.g. a live MCP client
// built with per-user auth the framework can't construct from a spec. All tools are guarded.
func WithTools(tools ...core.Tool) Option {
	return func(o *options) { o.tools = append(o.tools, tools...) }
}

// WithToolSource adds tools resolved for each turn, after the input guardrail and
// before retrieval, memory, or reasoning. These tools also receive the action
// guardrail. The source is not called at build time. The host must authenticate
// requests before attaching core.Identity for a personal connection source.
func WithToolSource(source core.ToolSource) Option {
	return func(o *options) { o.toolSource = source }
}

// WithLogger sets the framework's structured logger. Without it, the framework logs nothing.
func WithLogger(l *slog.Logger) Option {
	return func(o *options) { o.logger = l }
}

// WithSecrets overrides the vault used to resolve secret references, ignoring the spec's
// secrets pick. Useful when a host already has its own credential system.
func WithSecrets(s core.Secrets) Option {
	return func(o *options) { o.secrets = s }
}

// secretSuffix marks a config key as a reference to a secret rather than a literal value:
// {"botTokenSecret": "SLACK_BOT_TOKEN"} resolves to {"botToken": "<value from the vault>"}.
// This keeps credentials out of specs while requiring no change to any provider's constructor.
const secretSuffix = "Secret"

// resolveSecrets returns a copy of cfg with every "<name>Secret" reference replaced by the
// resolved "<name>" value. An unresolvable reference is an error: a provider silently starting
// without its credential is worse than failing to build.
func resolveSecrets(ctx context.Context, vault core.Secrets, tenant string, cfg map[string]any) (map[string]any, error) {
	out := make(map[string]any, len(cfg))
	for k, v := range cfg {
		out[k] = v
	}
	for k, v := range cfg {
		name, isRef := strings.CutSuffix(k, secretSuffix)
		if !isRef || name == "" {
			continue
		}
		key, ok := v.(string)
		if !ok || key == "" {
			return nil, fmt.Errorf("config %q must name a secret (a non-empty string)", k)
		}
		val, err := vault.Get(ctx, tenant, key)
		if err != nil {
			return nil, fmt.Errorf("resolve %q via %s vault: %w", key, vault.Name(), err)
		}
		delete(out, k)
		out[name] = val
	}
	return out, nil
}

// Build resolves the spec's picks across every slot — including the model (brain) and the
// action provider — and wires them together. Empty picks resolve to slot defaults.
func Build(ctx context.Context, s *spec.AgentSpec, opts ...Option) (*core.Agent, error) {
	var o options
	for _, opt := range opts {
		opt(&o)
	}

	// The vault resolves every "<name>Secret" reference in a provider's config. It is itself a
	// slot (env by default), and WithSecrets overrides the spec's pick.
	vault := o.secrets
	if vault == nil {
		var err error
		if vault, err = secrets.Registry.Get(s.Secrets.Type, s.Secrets.Config); err != nil {
			return nil, wrap(s, err)
		}
	}
	// Secrets are scoped by tenant; the agent name identifies the business by default.
	cfg := func(slot string, c map[string]any) (map[string]any, error) {
		out, err := resolveSecrets(ctx, vault, s.Name, c)
		if err != nil {
			return nil, fmt.Errorf("%s: %s: %w", s.Name, slot, err)
		}
		return out, nil
	}

	modelCfg, err := cfg("model", s.Model.Config)
	if err != nil {
		return nil, err
	}
	br, err := brain.Registry.Get(s.Model.Type, modelCfg)
	if err != nil {
		return nil, wrap(s, err)
	}
	retrievalCfg, err := cfg("retrieval", s.Retrieval.Config)
	if err != nil {
		return nil, err
	}
	r, err := retrieval.Registry.Get(s.Retrieval.Type, retrievalCfg)
	if err != nil {
		return nil, wrap(s, err)
	}
	memoryCfg, err := cfg("memory", s.Memory.Config)
	if err != nil {
		return nil, err
	}
	mem, err := memory.Registry.Get(s.Memory.Type, memoryCfg)
	if err != nil {
		return nil, wrap(s, err)
	}
	guardCfg, err := cfg("guardrail", s.Guardrail.Config)
	if err != nil {
		return nil, err
	}
	guard, err := guardrail.Registry.Get(s.Guardrail.Type, guardCfg)
	if err != nil {
		return nil, wrap(s, err)
	}

	// Merge the top-level action endpoint fields into the provider config so a provider (e.g.
	// mcp) reads action.mcpUrl without the spec author restating it under config.
	actionCfg := map[string]any{}
	for k, v := range s.Action.Config {
		actionCfg[k] = v
	}
	if _, ok := actionCfg["url"]; !ok && s.Action.MCPURL != "" {
		actionCfg["url"] = s.Action.MCPURL
	}
	if _, ok := actionCfg["authBaseUrl"]; !ok && s.Action.AuthBaseURL != "" {
		actionCfg["authBaseUrl"] = s.Action.AuthBaseURL
	}
	if actionCfg, err = cfg("action", actionCfg); err != nil {
		return nil, err
	}
	ap, err := action.Registry.Get(s.Action.Provider, actionCfg)
	if err != nil {
		return nil, wrap(s, err)
	}
	provTools, err := ap.Tools(ctx)
	if err != nil {
		return nil, fmt.Errorf("%s: action provider %q: %w", s.Name, ap.Name(), err)
	}
	tools := slices.Concat(provTools, o.tools)

	obsCfg, err := cfg("observability", s.Observability.Config)
	if err != nil {
		return nil, err
	}
	obs, err := observability.Registry.Get(s.Observability.Type, obsCfg)
	if err != nil {
		return nil, wrap(s, err)
	}

	var bindings []core.ChannelBinding
	for i, cs := range s.Channels {
		p, err := present.Registry.Get(cs.Presenter, nil)
		if err != nil {
			return nil, fmt.Errorf("%s: channels[%d]: %w", s.Name, i, err)
		}
		chCfg, err := cfg(fmt.Sprintf("channels[%d]", i), cs.Config)
		if err != nil {
			return nil, err
		}
		ch, err := channels.Registry.Get(cs.Type, chCfg)
		if err != nil {
			return nil, fmt.Errorf("%s: channels[%d]: %w", s.Name, i, err)
		}
		bindings = append(bindings, core.ChannelBinding{Channel: ch, Presenter: p})
	}

	var toolSource core.ToolSource
	if o.toolSource != nil {
		toolSource = guardedToolSource{source: o.toolSource, guard: guard}
	}
	return &core.Agent{
		Name:        s.Name,
		Instruction: s.Instruction,
		Brain:       br,
		Retriever:   r,
		Memory:      mem,
		Guardrail:   guard,
		// Every tool is wrapped so the guardrail inspects the action before it executes —
		// the model cannot bypass this (it is code-enforced, not prompt-enforced).
		Tools:      action.GuardAll(tools, guard),
		ToolSource: toolSource,
		Bindings:   bindings,
		Observer:   obs,
		Logger:     o.logger,
	}, nil
}

type guardedToolSource struct {
	source core.ToolSource
	guard  core.Guardrail
}

func (s guardedToolSource) Tools(ctx context.Context) ([]core.Tool, error) {
	tools, err := s.source.Tools(ctx)
	if err != nil {
		return nil, err
	}
	for _, tool := range tools {
		if tool == nil {
			return nil, fmt.Errorf("build: tool source returned a nil tool")
		}
	}
	return action.GuardAll(tools, s.guard), nil
}

func wrap(s *spec.AgentSpec, err error) error { return fmt.Errorf("%s: %w", s.Name, err) }
