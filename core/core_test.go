package core

import (
	"context"
	"errors"
	"strings"
	"testing"
	"time"
)

type stubBrain struct{ reply string }

func (stubBrain) Name() string { return "stub" }
func (b stubBrain) Respond(context.Context, BrainInput) (AgentMessage, error) {
	return AgentMessage{Text: b.reply}, nil
}

type recObserver struct{ last TurnTrace }

func (*recObserver) Name() string                             { return "rec" }
func (o *recObserver) Observe(_ context.Context, t TurnTrace) { o.last = t }

type errGuard struct{}

func (errGuard) Name() string { return "errguard" }
func (errGuard) Inspect(context.Context, GuardInput) (Decision, error) {
	return Decision{}, errors.New("guardrail down")
}

type denyInputGuard struct{}

func (denyInputGuard) Name() string { return "deny" }
func (denyInputGuard) Inspect(_ context.Context, in GuardInput) (Decision, error) {
	if in.Stage == StageInput {
		return Decision{Allow: false, Reason: "nope"}, nil
	}
	return Decision{Allow: true}, nil
}

type errRetriever struct{}

func (errRetriever) Name() string { return "errret" }
func (errRetriever) Retrieve(context.Context, Query, int) ([]Candidate, error) {
	return nil, errors.New("index down")
}

func spanErr(spans []Span, name string) bool {
	for _, s := range spans {
		if s.Name == name && s.Err != "" {
			return true
		}
	}
	return false
}

func TestHandleNormalEmitsTrace(t *testing.T) {
	obs := &recObserver{}
	a := &Agent{Brain: stubBrain{reply: "hello"}, Observer: obs}
	msg, err := a.Handle(context.Background(), Turn{Text: "hi"})
	if err != nil {
		t.Fatal(err)
	}
	if msg.Text != "hello" {
		t.Fatalf("got %q", msg.Text)
	}
	if obs.last.Model != "stub" || obs.last.Output != "hello" || len(obs.last.Spans) == 0 {
		t.Fatalf("trace incomplete: %+v", obs.last)
	}
}

// meteredBrain reports a fixed usage on its reply.
type meteredBrain struct{ usage Usage }

func (meteredBrain) Name() string { return "metered" }
func (m meteredBrain) Respond(context.Context, BrainInput) (AgentMessage, error) {
	return AgentMessage{Text: "ok", Usage: &m.usage}, nil
}

// A brain that reports usage on its reply has it recorded on the turn trace.
func TestHandleRecordsUsage(t *testing.T) {
	obs := &recObserver{}
	a := &Agent{Brain: meteredBrain{usage: Usage{InputTokens: 12, OutputTokens: 7}}, Observer: obs}
	if _, err := a.Handle(context.Background(), Turn{Text: "hi"}); err != nil {
		t.Fatal(err)
	}
	u := obs.last.Usage
	if u == nil || u.InputTokens != 12 || u.OutputTokens != 7 {
		t.Fatalf("usage not recorded on the trace: %+v", u)
	}
}

// failingMeteredBrain errors but still carries the usage its provider billed.
type failingMeteredBrain struct{ usage Usage }

func (failingMeteredBrain) Name() string { return "failing-metered" }
func (f failingMeteredBrain) Respond(context.Context, BrainInput) (AgentMessage, error) {
	return AgentMessage{Usage: &f.usage}, errors.New("model down")
}

// A failed turn keeps its partial usage on the trace (a failed turn's usage is still cost).
func TestHandleRecordsUsageOnError(t *testing.T) {
	obs := &recObserver{}
	a := &Agent{Brain: failingMeteredBrain{usage: Usage{InputTokens: 5}}, Observer: obs}
	if _, err := a.Handle(context.Background(), Turn{Text: "hi"}); err == nil {
		t.Fatal("expected the brain error to surface")
	}
	u := obs.last.Usage
	if u == nil || u.InputTokens != 5 {
		t.Fatalf("partial usage must survive a failed turn: %+v", u)
	}
}

// A brain without a usage meter leaves the trace usage nil rather than fabricating zero.
func TestHandleLeavesUsageNilWithoutReporter(t *testing.T) {
	obs := &recObserver{}
	a := &Agent{Brain: stubBrain{reply: "ok"}, Observer: obs}
	if _, err := a.Handle(context.Background(), Turn{Text: "hi"}); err != nil {
		t.Fatal(err)
	}
	if obs.last.Usage != nil {
		t.Fatalf("no reporter should mean nil usage, got %+v", obs.last.Usage)
	}
}

// Fail-closed: an input guardrail that errors must block before the brain runs.
func TestHandleFailsClosedOnInputGuardError(t *testing.T) {
	obs := &recObserver{}
	a := &Agent{Brain: stubBrain{reply: "LEAKED"}, Guardrail: errGuard{}, Observer: obs}
	msg, err := a.Handle(context.Background(), Turn{Text: "hi"})
	if err != nil {
		t.Fatal(err)
	}
	if strings.Contains(msg.Text, "LEAKED") {
		t.Fatal("must not reach the brain when the input guardrail errors (fail-closed)")
	}
	if !obs.last.Blocked {
		t.Fatal("trace should mark the turn blocked")
	}
	if !spanErr(obs.last.Spans, "guard.input") {
		t.Fatal("guard.input span should record the guardrail error")
	}
}

func TestHandleBlocksDeniedInput(t *testing.T) {
	a := &Agent{Brain: stubBrain{reply: "x"}, Guardrail: denyInputGuard{}}
	msg, _ := a.Handle(context.Background(), Turn{Text: "hi"})
	if !strings.Contains(msg.Text, "nope") {
		t.Fatalf("expected the denial reason in the reply, got %q", msg.Text)
	}
}

// A retriever error is recorded on its span, not swallowed.
func TestHandleRecordsRetrieverError(t *testing.T) {
	obs := &recObserver{}
	a := &Agent{Brain: stubBrain{reply: "ok"}, Retriever: errRetriever{}, Observer: obs}
	if _, err := a.Handle(context.Background(), Turn{Text: "hi"}); err != nil {
		t.Fatal(err)
	}
	if !spanErr(obs.last.Spans, "retrieve") {
		t.Fatal("retrieve span should record the retriever error instead of swallowing it")
	}
}

type outputGuard struct{ err bool }

func (outputGuard) Name() string { return "outguard" }
func (g outputGuard) Inspect(_ context.Context, in GuardInput) (Decision, error) {
	if in.Stage == StageOutput {
		if g.err {
			return Decision{}, errors.New("output guard down")
		}
		return Decision{Allow: false, Reason: "bad output"}, nil
	}
	return Decision{Allow: true}, nil
}

// Fail-closed: an output guardrail that errors must withhold the reply.
func TestHandleFailsClosedOnOutputGuardError(t *testing.T) {
	a := &Agent{Brain: stubBrain{reply: "SECRET"}, Guardrail: outputGuard{err: true}}
	msg, _ := a.Handle(context.Background(), Turn{Text: "hi"})
	if strings.Contains(msg.Text, "SECRET") {
		t.Fatal("must withhold output when the output guardrail errors (fail-closed)")
	}
}

func TestHandleWithholdsDeniedOutput(t *testing.T) {
	a := &Agent{Brain: stubBrain{reply: "SECRET"}, Guardrail: outputGuard{err: false}}
	msg, _ := a.Handle(context.Background(), Turn{Text: "hi"})
	if strings.Contains(msg.Text, "SECRET") {
		t.Fatal("a denied output must be withheld")
	}
}

type errMemory struct{}

func (errMemory) Name() string                                                     { return "errmem" }
func (errMemory) Recall(context.Context, Scope, string, int) ([]MemoryItem, error) { return nil, nil }
func (errMemory) Remember(context.Context, Scope, []MemoryItem) error {
	return errors.New("write failed")
}

func TestHandleRecordsRememberError(t *testing.T) {
	obs := &recObserver{}
	a := &Agent{Brain: stubBrain{reply: "ok"}, Memory: errMemory{}, Observer: obs}
	if _, err := a.Handle(context.Background(), Turn{Text: "hi"}); err != nil {
		t.Fatal(err)
	}
	if !spanErr(obs.last.Spans, "persist") {
		t.Fatal("persist span should record the memory Remember error")
	}
}

// inertChannel returns nil immediately, like a stub channel.
type inertChannel struct{}

func (inertChannel) Name() string                          { return "inert" }
func (inertChannel) Start(context.Context, Dispatch) error { return nil }

// liveChannel blocks until ctx is cancelled, then stops cleanly (nil), like an HTTP channel.
type liveChannel struct{ started chan struct{} }

func (c liveChannel) Name() string { return "live" }
func (c liveChannel) Start(ctx context.Context, _ Dispatch) error {
	close(c.started)
	<-ctx.Done()
	return nil
}

// Regression: a stub channel returning nil immediately must NOT cause Run to tear down the
// still-serving live channel. Run should block until ctx is cancelled.
func TestRunStubDoesNotStopLiveChannel(t *testing.T) {
	started := make(chan struct{})
	a := &Agent{Bindings: []ChannelBinding{
		{Channel: inertChannel{}},
		{Channel: liveChannel{started: started}},
	}}
	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan error, 1)
	go func() { done <- a.Run(ctx) }()

	select {
	case <-started:
	case <-time.After(2 * time.Second):
		t.Fatal("live channel never started")
	}
	// Run must still be blocked even though the inert channel already returned nil.
	select {
	case err := <-done:
		t.Fatalf("Run returned early (%v) while a channel is still serving", err)
	case <-time.After(50 * time.Millisecond):
	}

	cancel()
	select {
	case <-done:
	case <-time.After(2 * time.Second):
		t.Fatal("Run did not return after ctx cancellation")
	}
}
