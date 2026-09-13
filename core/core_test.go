package core

import (
	"context"
	"errors"
	"strings"
	"sync"
	"sync/atomic"
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

// --- graceful shutdown / in-flight draining ---

// handoffChannel exposes the Dispatch it is given so tests can drive turns directly.
type handoffChannel struct{ disp chan Dispatch }

func (c handoffChannel) Name() string { return "handoff" }
func (c handoffChannel) Start(ctx context.Context, d Dispatch) error {
	c.disp <- d
	<-ctx.Done()
	return nil
}

type passPresenter struct{}

func (passPresenter) Name() string { return "pass" }
func (passPresenter) Render(m AgentMessage) Payload {
	return Payload{Body: m.Text}
}

// gatedBrain blocks in Respond until released, proving a turn is mid-flight.
type gatedBrain struct {
	entered chan struct{}
	once    sync.Once
	release chan struct{}
}

func (b *gatedBrain) Name() string { return "gated" }
func (b *gatedBrain) Respond(_ context.Context, _ BrainInput) (AgentMessage, error) {
	b.once.Do(func() { close(b.entered) })
	<-b.release
	return AgentMessage{Text: "done"}, nil
}

// passCtxChannel exposes both the context Run handed it and the Dispatch, so tests can drive
// turns with the very context real channels use.
type passCtxChannel struct {
	ctxCh chan context.Context
	disp  chan Dispatch
}

func (c passCtxChannel) Name() string { return "passthrough" }
func (c passCtxChannel) Start(ctx context.Context, d Dispatch) error {
	c.ctxCh <- ctx
	c.disp <- d
	<-ctx.Done()
	return nil
}

// During the drain window the context a turn is running under must stay live — the whole
// point of draining is that a customer mid-answer keeps their reply. Cancelling Run's context
// must not cancel baseCtx until the drain completes.
func TestRunKeepsTurnContextAliveWhileDraining(t *testing.T) {
	b := &gatedBrain{entered: make(chan struct{}), release: make(chan struct{})}
	dispCh := make(chan Dispatch, 1)
	ctxCh := make(chan context.Context, 1)
	a := &Agent{
		Brain:    b,
		Bindings: []ChannelBinding{{Channel: passCtxChannel{ctxCh: ctxCh, disp: dispCh}, Presenter: passPresenter{}}},
	}
	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan error, 1)
	go func() { done <- a.Run(ctx) }()

	runCtx := <-ctxCh
	d := <-dispCh
	turn := make(chan Payload, 1)
	go func() { p, _ := d(runCtx, Turn{Text: "hi"}); turn <- p }()
	<-b.entered // the turn is now in-flight inside the brain

	cancel()
	// The turn's context must survive the cancellation — it is draining.
	select {
	case <-runCtx.Done():
		t.Fatal("turn context was cancelled while draining; the turn would lose its reply")
	default:
	}

	close(b.release)
	select {
	case err := <-done:
		if !errors.Is(err, context.Canceled) {
			t.Fatalf("want context.Canceled, got %v", err)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("Run did not return after the turn drained")
	}
	if p := <-turn; p.Body != "done" {
		t.Fatalf("drained turn lost its reply: %+v", p)
	}
	// Only after the drain completes does the channel's context end.
	select {
	case <-runCtx.Done():
	default:
		t.Fatal("channel context should be cancelled after the drain completes")
	}
}

// An in-flight turn must finish after the context is cancelled: Run blocks until the turn
// drains and the turn keeps its (live) context.
func TestRunDrainsInFlightTurn(t *testing.T) {
	b := &gatedBrain{entered: make(chan struct{}), release: make(chan struct{})}
	handoff := make(chan Dispatch, 1)
	a := &Agent{
		Brain:    b,
		Bindings: []ChannelBinding{{Channel: handoffChannel{disp: handoff}, Presenter: passPresenter{}}},
	}
	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan error, 1)
	go func() { done <- a.Run(ctx) }()

	d := <-handoff
	turn := make(chan Payload, 1)
	go func() { p, _ := d(context.Background(), Turn{Text: "hi"}); turn <- p }()
	<-b.entered // the turn is now in-flight inside the brain

	cancel()
	// Run must NOT return while the turn is in flight — it is draining.
	select {
	case err := <-done:
		t.Fatalf("Run returned (%v) before the in-flight turn finished", err)
	case <-time.After(100 * time.Millisecond):
	}

	close(b.release)
	select {
	case err := <-done:
		if !errors.Is(err, context.Canceled) {
			t.Fatalf("want context.Canceled, got %v", err)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("Run did not return after the turn drained")
	}
	if p := <-turn; p.Body != "done" {
		t.Fatalf("drained turn lost its reply: %+v", p)
	}
}

// When a turn outlives DrainTimeout, Run abandons it and returns rather than hanging.
func TestRunDrainTimeoutAbandonsTurn(t *testing.T) {
	b := &gatedBrain{entered: make(chan struct{}), release: make(chan struct{})} // never released
	handoff := make(chan Dispatch, 1)
	a := &Agent{
		Brain:        b,
		Bindings:     []ChannelBinding{{Channel: handoffChannel{disp: handoff}, Presenter: passPresenter{}}},
		DrainTimeout: 100 * time.Millisecond,
	}
	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan error, 1)
	go func() { done <- a.Run(ctx) }()

	d := <-handoff
	go func() { _, _ = d(context.Background(), Turn{Text: "hi"}) }()
	<-b.entered

	cancel()
	select {
	case err := <-done:
		if !errors.Is(err, context.Canceled) {
			t.Fatalf("want context.Canceled, got %v", err)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("Run did not return within the drain timeout")
	}
}

// Once draining begins, new turns are rejected with ErrShuttingDown.
func TestRunRejectsNewTurnsWhileDraining(t *testing.T) {
	b := &gatedBrain{entered: make(chan struct{}), release: make(chan struct{})}
	handoff := make(chan Dispatch, 1)
	a := &Agent{
		Brain:        b,
		Bindings:     []ChannelBinding{{Channel: handoffChannel{disp: handoff}, Presenter: passPresenter{}}},
		DrainTimeout: 5 * time.Second,
	}
	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan error, 1)
	go func() { done <- a.Run(ctx) }()

	d := <-handoff
	go func() { _, _ = d(context.Background(), Turn{Text: "first"}) }()
	<-b.entered // first turn in flight

	cancel()
	// New turns must be rejected once draining has begun. Dispatch polls happen in their own
	// goroutines: one admitted just before draining is set would otherwise block the test in
	// the brain until release.
	var rejected atomic.Bool
	deadline := time.Now().Add(2 * time.Second)
	for !rejected.Load() && time.Now().Before(deadline) {
		errCh := make(chan error, 1)
		go func() { _, err := d(context.Background(), Turn{Text: "second"}); errCh <- err }()
		select {
		case err := <-errCh:
			if errors.Is(err, ErrShuttingDown) {
				rejected.Store(true)
			}
		case <-time.After(20 * time.Millisecond):
			// The turn was admitted and is draining; keep polling.
		}
	}
	if !rejected.Load() {
		t.Fatal("dispatch did not reject new turns while draining")
	}

	close(b.release)
	select {
	case <-done:
	case <-time.After(2 * time.Second):
		t.Fatal("Run did not return after the turn drained")
	}
}
