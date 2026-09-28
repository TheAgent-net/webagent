// Package core defines the web-agent template spine: the slot interfaces every agent is
// assembled from, independent of any concrete business or provider.
//
// Each interface here is a SPI slot (see package spi). Providers — built-in or from
// partner companies — implement these and register in the slot's registry; a business's
// spec picks one per slot. The Brain (LLM + instruction) is an interface too, so the
// framework builds and tests without a live model.
package core

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"time"
)

// ---------------------------------------------------------------------------
// Retrieval slot — the knowledge/discovery layer (interface interoperability).
// ---------------------------------------------------------------------------

// Query is a retrieval request: the user's need plus structured filters.
type Query struct {
	Text    string
	Filters map[string]string
	UserID  string
}

// Candidate is a discovery result. STABLE fields only — volatile facts (live price, stock,
// offers) are re-verified via the action tools before use ("index for recall, live for truth").
type Candidate struct {
	ID    string
	Title string
	Text  string
	Attrs map[string]string
	Score float64
}

// Retriever discovers candidates for a query.
type Retriever interface {
	Name() string
	Retrieve(ctx context.Context, q Query, k int) ([]Candidate, error)
}

// ---------------------------------------------------------------------------
// Memory slot — per-user, cross-session memory (a partner-provided slot).
// ---------------------------------------------------------------------------

// Scope identifies whose memory this is. Every memory operation is scoped, so a provider
// (built-in or partner) never mixes tenants or users.
type Scope struct {
	UserID    string
	SessionID string
	AgentID   string
}

// MemoryItem is one stored/recalled memory.
type MemoryItem struct {
	ID    string
	Text  string
	Attrs map[string]string
	Score float64
}

// Memory persists and recalls facts across sessions, scoped by user/session/agent.
type Memory interface {
	Name() string
	Remember(ctx context.Context, s Scope, items []MemoryItem) error
	Recall(ctx context.Context, s Scope, query string, k int) ([]MemoryItem, error)
}

// ---------------------------------------------------------------------------
// Guardrail slot — deterministic, code-enforced safety (a partner-provided slot).
// ---------------------------------------------------------------------------

// Stage is where in a turn a guardrail runs.
type Stage string

const (
	StageInput  Stage = "input"  // the user's message, before reasoning
	StageOutput Stage = "output" // the agent's reply, before it is sent
	StageAction Stage = "action" // a tool/action about to be executed
)

// GuardInput is what a guardrail inspects.
type GuardInput struct {
	Stage   Stage
	Content string // message or reply text
	Action  string // action name, when Stage == StageAction
	Meta    map[string]string
}

// Decision is a guardrail's verdict. Allow=false blocks; Content (when set) is a
// redacted/rewritten replacement to use instead of the original.
type Decision struct {
	Allow   bool
	Reason  string
	Content string
}

// Guardrail inspects input, output, and actions and returns an allow/deny/redact decision.
type Guardrail interface {
	Name() string
	Inspect(ctx context.Context, in GuardInput) (Decision, error)
}

// ---------------------------------------------------------------------------
// Secrets slot — the multi-tenant credential vault.
// ---------------------------------------------------------------------------

// ErrSecretNotFound is returned by a Secrets provider when a key has no value.
var ErrSecretNotFound = errors.New("secret not found")

// Secrets resolves named credentials for a tenant. Every provider that needs a credential
// (channel tokens, MCP keys, model keys) goes through this slot rather than reading process
// state directly, so a deployment can swap an env-var lookup for a real vault without any
// provider changing. Values are never stored in a spec — a spec names the key, not the secret.
//
// tenant scopes the lookup (a business/agent id); an empty tenant means the deployment-wide
// default. Implementations MUST NOT leak one tenant's secrets to another.
type Secrets interface {
	Name() string
	Get(ctx context.Context, tenant, key string) (string, error)
}

// ---------------------------------------------------------------------------
// Action slot — grounded capabilities (typically an MCP tool).
// ---------------------------------------------------------------------------

// Tool is a callable capability exposed to the brain.
type Tool interface {
	Name() string
	Call(ctx context.Context, args map[string]any) (map[string]any, error)
}

// ToolSource is an optional source of tools resolved for each turn, using its
// request context. Implementations must isolate identities, honor cancellation,
// and be safe for concurrent turns. Errors abort the turn before memory or reasoning.
// Returned tools must remain bound to their original identity when called.
type ToolSource interface {
	Tools(context.Context) ([]Tool, error)
}

// ToolSchema is an optional capability a Tool may implement to advertise a description and a
// JSON schema for its arguments, so the model can call it precisely. Tools that don't
// implement it are offered with a permissive object schema. Wrappers (e.g. the action guard)
// forward this capability so it survives wrapping.
type ToolSchema interface {
	Description() string
	Schema() map[string]any
}

// ---------------------------------------------------------------------------
// Channel + Presenter slots — transport and rendering (information interoperability).
// ---------------------------------------------------------------------------

// ElementKind tags a rich element in a reply; presenters decide how to render each.
type ElementKind string

const (
	ElementLink   ElementKind = "link"
	ElementButton ElementKind = "button"
	ElementImage  ElementKind = "image"
	ElementQR     ElementKind = "qr"
)

// Element is one rich piece of a reply.
type Element struct {
	Kind  ElementKind
	Label string
	Value string
}

// AgentMessage is a channel-agnostic reply. The brain speaks this; a Presenter lowers it
// into a channel's native format.
type AgentMessage struct {
	Text     string
	Elements []Element
}

// Turn is an inbound message from a user on some channel.
type Turn struct {
	ChannelUserID string
	Text          string
	Meta          map[string]string
}

// Payload is a channel-native rendering of an AgentMessage.
type Payload struct {
	ContentType string
	Body        string
}

// Presenter renders a channel-agnostic reply into a channel-native payload. This is where
// per-channel rendering fidelity lives (the QR problem).
type Presenter interface {
	Name() string
	Render(m AgentMessage) Payload
}

// Dispatch handles one inbound turn end to end and returns a payload ready to send. The
// build layer constructs a Dispatch per channel that closes over the agent + the channel's
// chosen presenter — so channels transport payloads and never depend on a presenter directly.
type Dispatch func(ctx context.Context, t Turn) (Payload, error)

// Channel is the transport layer: it receives turns and sends rendered payloads.
type Channel interface {
	Name() string
	Start(ctx context.Context, d Dispatch) error
}

// ChannelBinding pairs a channel with the presenter that renders its replies.
type ChannelBinding struct {
	Channel   Channel
	Presenter Presenter
}

// ---------------------------------------------------------------------------
// Brain slot — the reasoning layer (LLM + instruction).
// ---------------------------------------------------------------------------

// BrainInput is everything the reasoning layer needs for one turn.
type BrainInput struct {
	UserID      string
	Text        string
	Instruction string
	Candidates  []Candidate
	Memories    []MemoryItem
	Tools       []Tool
}

// Brain produces a reply. Pluggable so the framework runs without a live model, and so a
// business can pick its model provider from the menu like any other slot.
type Brain interface {
	Name() string
	Respond(ctx context.Context, in BrainInput) (AgentMessage, error)
}

// ---------------------------------------------------------------------------
// Observability slot — a per-turn trace emitted to an Observer.
// ---------------------------------------------------------------------------

// Span is one timed step within a turn (e.g. "retrieve", "reason", "guard.output"). Err is
// non-empty when that step errored — so a step failure is observable rather than swallowed.
type Span struct {
	Name     string
	Duration time.Duration
	Err      string
}

// TurnTrace is the observable record of one Handle call. Field names align with the
// OpenTelemetry GenAI semantic conventions where applicable (e.g. Model = gen_ai.request.model),
// so an OTel exporter provider maps cleanly without changing this type.
type TurnTrace struct {
	UserID  string
	Model   string
	Input   string
	Output  string
	Blocked bool   // a guardrail blocked the turn (at input or output)
	Err     string // non-empty if the turn errored
	Spans   []Span
	Total   time.Duration
}

// Observer receives a TurnTrace after each turn. Providers record or export it (log, memory,
// OpenTelemetry, a partner). A nil Observer disables tracing at zero cost.
type Observer interface {
	Name() string
	Observe(ctx context.Context, t TurnTrace)
}

// ---------------------------------------------------------------------------
// Agent — the assembled runtime.
// ---------------------------------------------------------------------------

// Agent ties one brain + the chosen slot providers together and serves them over channels.
type Agent struct {
	Name        string
	Instruction string
	Brain       Brain
	Retriever   Retriever
	Memory      Memory
	Guardrail   Guardrail
	Tools       []Tool
	Bindings    []ChannelBinding
	Observer    Observer
	// ToolSource supplies additional per-turn tools. Like Tools, these must be
	// guarded by the assembler. build.WithToolSource applies that wrapper.
	ToolSource ToolSource
	// Logger is the framework's structured logger. When nil, the framework logs nothing
	// (a library must not impose output). Applications inject one to see operational logs.
	Logger *slog.Logger
}

// discardLogger drops all records; used when no Logger is injected.
var discardLogger = slog.New(slog.NewTextHandler(io.Discard, nil))

func (a *Agent) logger() *slog.Logger {
	if a.Logger != nil {
		return a.Logger
	}
	return discardLogger
}

// Handle runs one turn through the full pipeline: input guardrail → per-turn tools → retrieve + recall →
// reason → output guardrail → persist. Missing providers are simply skipped. Each step is
// timed and a single TurnTrace is emitted to the Observer when the turn returns.
func (a *Agent) Handle(ctx context.Context, t Turn) (msg AgentMessage, err error) {
	if identity, ok := IdentityFromContext(ctx); ok {
		// Channel user names are not authoritative for authenticated conversations.
		t.ChannelUserID = identityUserKey(identity)
	}
	start := time.Now()
	tr := TurnTrace{UserID: t.ChannelUserID, Input: t.Text}
	if a.Brain != nil {
		tr.Model = a.Brain.Name()
	}
	defer func() {
		tr.Total = time.Since(start)
		tr.Output = msg.Text
		if err != nil {
			tr.Err = err.Error()
		}
		if a.Observer != nil {
			a.Observer.Observe(ctx, tr)
		}
	}()

	// Scope memory by agent + user (+ session when the channel supplies one). AgentID keeps a
	// shared memory backend from mixing different agents; SessionID (from Turn metadata) lets a
	// channel separate concurrent conversations for the same user.
	scope := Scope{UserID: t.ChannelUserID, AgentID: a.Name, SessionID: t.Meta["session"]}

	// Input guardrail. Fail CLOSED: if the guardrail itself errors, deny rather than let
	// unvetted input through. A guardrail error is recorded on the span, not swallowed.
	if a.Guardrail != nil {
		s := time.Now()
		d, gerr := a.Guardrail.Inspect(ctx, GuardInput{Stage: StageInput, Content: t.Text, Meta: t.Meta})
		tr.Spans = append(tr.Spans, span("guard.input", s, gerr))
		if gerr != nil {
			tr.Blocked = true
			return AgentMessage{Text: "I can't process that safely right now."}, nil
		}
		if !d.Allow {
			tr.Blocked = true
			return AgentMessage{Text: "I can't help with that: " + d.Reason}, nil
		}
	}

	toolsStarted := time.Now()
	tools, err := a.turnTools(ctx)
	if a.ToolSource != nil {
		tr.Spans = append(tr.Spans, span("tools", toolsStarted, err))
	}
	if err != nil {
		return AgentMessage{}, err
	}

	var cands []Candidate
	if a.Retriever != nil {
		s := time.Now()
		var rerr error
		cands, rerr = a.Retriever.Retrieve(ctx, Query{Text: t.Text, UserID: t.ChannelUserID}, 8)
		tr.Spans = append(tr.Spans, span("retrieve", s, rerr))
	}
	var mems []MemoryItem
	if a.Memory != nil {
		s := time.Now()
		var merr error
		mems, merr = a.Memory.Recall(ctx, scope, t.Text, 8)
		tr.Spans = append(tr.Spans, span("recall", s, merr))
	}

	rs := time.Now()
	msg, err = a.Brain.Respond(ctx, BrainInput{
		UserID: t.ChannelUserID, Text: t.Text, Instruction: a.Instruction,
		Candidates: cands, Memories: mems, Tools: tools,
	})
	tr.Spans = append(tr.Spans, span("reason", rs, err))
	if err != nil {
		return AgentMessage{}, err
	}

	// Output guardrail. Fail CLOSED: on error, withhold the response rather than emit
	// something unvetted.
	if a.Guardrail != nil {
		s := time.Now()
		d, gerr := a.Guardrail.Inspect(ctx, GuardInput{Stage: StageOutput, Content: msg.Text, Meta: t.Meta})
		tr.Spans = append(tr.Spans, span("guard.output", s, gerr))
		if gerr != nil {
			tr.Blocked = true
			return AgentMessage{Text: "(response withheld)"}, nil
		}
		if !d.Allow {
			tr.Blocked = true
			return AgentMessage{Text: "(response withheld: " + d.Reason + ")"}, nil
		}
		if d.Content != "" {
			msg.Text = d.Content
		}
	}

	if a.Memory != nil {
		s := time.Now()
		rerr := a.Memory.Remember(ctx, scope, []MemoryItem{{Text: "user: " + t.Text}, {Text: "agent: " + msg.Text}})
		tr.Spans = append(tr.Spans, span("persist", s, rerr))
	}
	return msg, nil
}

// span builds a timed Span, recording err (if any) so a failed step is observable.
func span(name string, start time.Time, err error) Span {
	sp := Span{Name: name, Duration: time.Since(start)}
	if err != nil {
		sp.Err = err.Error()
	}
	return sp
}

// Run starts every channel binding concurrently and blocks until ctx is done or a channel
// fails with a non-nil error. Each channel gets a Dispatch that handles the turn and renders
// it via that binding's presenter.
//
// A channel that returns nil has stopped cleanly (an inert stub channel, or a live channel
// closed by ctx cancellation) and must NOT tear down the others — otherwise a single stub
// channel in the spec would kill the whole agent. Only a non-nil error aborts.
func (a *Agent) Run(ctx context.Context) error {
	errCh := make(chan error, len(a.Bindings))
	for _, b := range a.Bindings {
		b := b
		a.logger().Info("channel starting", "channel", b.Channel.Name())
		d := func(ctx context.Context, t Turn) (Payload, error) {
			msg, err := a.Handle(ctx, t)
			if err != nil {
				return Payload{}, err
			}
			return b.Presenter.Render(msg), nil
		}
		go func() { errCh <- b.Channel.Start(ctx, d) }()
	}
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case err := <-errCh:
			if err != nil {
				return err
			}
			// A channel stopped cleanly; keep serving the rest until ctx is done.
		}
	}
}

// Decode re-decodes a loosely-typed config map (the spec's per-provider `config`) into a
// typed struct — the passthrough that lets a provider declare its own config shape.
func Decode(cfg map[string]any, out any) error {
	b, err := json.Marshal(cfg)
	if err != nil {
		return err
	}
	return json.Unmarshal(b, out)
}
