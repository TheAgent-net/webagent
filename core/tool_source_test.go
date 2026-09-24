package core

import (
	"context"
	"errors"
	"testing"
)

type turnSourceFunc func(context.Context) ([]Tool, error)

func (f turnSourceFunc) Tools(ctx context.Context) ([]Tool, error) { return f(ctx) }

type turnBrainFunc func(context.Context, BrainInput) (AgentMessage, error)

func (turnBrainFunc) Name() string { return "turn-brain" }
func (f turnBrainFunc) Respond(ctx context.Context, in BrainInput) (AgentMessage, error) {
	return f(ctx, in)
}

type turnNamedTool string

func (t turnNamedTool) Name() string                                               { return string(t) }
func (turnNamedTool) Call(context.Context, map[string]any) (map[string]any, error) { return nil, nil }

type turnMemoryProbe struct{ accessed bool }

func (*turnMemoryProbe) Name() string { return "probe" }
func (m *turnMemoryProbe) Recall(context.Context, Scope, string, int) ([]MemoryItem, error) {
	m.accessed = true
	return nil, nil
}
func (m *turnMemoryProbe) Remember(context.Context, Scope, []MemoryItem) error {
	m.accessed = true
	return nil
}

func TestToolSourceFailureStopsBeforeMemoryAndBrain(t *testing.T) {
	failed := errors.New("connection required")
	memory := &turnMemoryProbe{}
	observer := &recObserver{}
	brainCalled := false
	agent := &Agent{Memory: memory, Observer: observer,
		ToolSource: turnSourceFunc(func(context.Context) ([]Tool, error) { return nil, failed }),
		Brain: turnBrainFunc(func(context.Context, BrainInput) (AgentMessage, error) {
			brainCalled = true
			return AgentMessage{}, nil
		}),
	}
	if _, err := agent.Handle(context.Background(), Turn{}); !errors.Is(err, failed) {
		t.Fatal("source error was hidden")
	}
	if brainCalled || memory.accessed {
		t.Fatal("failed source allowed memory or reasoning")
	}
	if !spanErr(observer.last.Spans, "tools") {
		t.Fatal("tool resolution failure missing from trace")
	}
}

func TestInputGuardPrecedesToolSource(t *testing.T) {
	called := false
	agent := &Agent{Guardrail: denyInputGuard{}, Brain: stubBrain{}, ToolSource: turnSourceFunc(func(context.Context) ([]Tool, error) { called = true; return nil, nil })}
	if _, err := agent.Handle(context.Background(), Turn{Text: "denied"}); err != nil {
		t.Fatal(err)
	}
	if called {
		t.Fatal("denied input contacted tool source")
	}
}

func TestTurnToolsDoNotMutateStaticTools(t *testing.T) {
	static := make([]Tool, 1, 4)
	static[0] = turnNamedTool("static")
	next := "first"
	agent := &Agent{Tools: static, ToolSource: turnSourceFunc(func(context.Context) ([]Tool, error) { return []Tool{turnNamedTool(next)}, nil }),
		Brain: turnBrainFunc(func(_ context.Context, in BrainInput) (AgentMessage, error) {
			if len(in.Tools) != 2 || in.Tools[0].Name() != "static" || in.Tools[1].Name() != next {
				t.Fatal("incorrect per-turn tools")
			}
			in.Tools[0] = turnNamedTool("mutated")
			return AgentMessage{}, nil
		}),
	}
	for _, name := range []string{"first", "second"} {
		next = name
		if _, err := agent.Handle(context.Background(), Turn{}); err != nil {
			t.Fatal(err)
		}
	}
	if len(agent.Tools) != 1 || agent.Tools[0].Name() != "static" || static[:cap(static)][1] != nil {
		t.Fatal("shared tools were mutated")
	}
}

func TestTurnToolsRejectAmbiguousNames(t *testing.T) {
	for _, additional := range [][]Tool{{turnNamedTool("same")}, {turnNamedTool("")}, {nil}} {
		agent := &Agent{Tools: []Tool{turnNamedTool("same")}, ToolSource: turnSourceFunc(func(context.Context) ([]Tool, error) { return additional, nil })}
		if _, err := agent.Handle(context.Background(), Turn{}); err == nil {
			t.Fatal("invalid catalog reached reasoning")
		}
	}
}

func TestVerifiedConversationKeyIsExactAndTenantScoped(t *testing.T) {
	seen := map[string]bool{}
	for _, identity := range []Identity{{"a", "b|c"}, {"a|b", "c"}, {"other", "b|c"}, {"A", "b|c"}} {
		ctx, err := WithIdentity(context.Background(), identity)
		if err != nil {
			t.Fatal(err)
		}
		var user string
		agent := &Agent{Brain: turnBrainFunc(func(_ context.Context, in BrainInput) (AgentMessage, error) {
			user = in.UserID
			return AgentMessage{}, nil
		})}
		if _, err := agent.Handle(ctx, Turn{ChannelUserID: "spoofed"}); err != nil {
			t.Fatal(err)
		}
		if user == "spoofed" || user == "" || seen[user] {
			t.Fatal("verified conversation keys collided")
		}
		seen[user] = true
		previous := user
		if _, err := agent.Handle(ctx, Turn{ChannelUserID: "different"}); err != nil || user != previous {
			t.Fatal("channel user changed verified conversation key")
		}
	}
}
