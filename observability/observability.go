// Package observability is the observability slot: where each turn's TurnTrace is recorded
// or exported. Built-ins: none (default, zero overhead), log (a structured line per turn),
// and memory (an introspectable buffer). An OpenTelemetry exporter and partner backends
// register here as they are built — the TurnTrace already follows the OTel GenAI conventions.
package observability

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"sync"

	"github.com/TheAgent-net/webagent/core"
	"github.com/TheAgent-net/webagent/spi"
)

// Registry is the observability slot.
var Registry = spi.New[core.Observer]("observability")

func init() {
	Registry.Register(spi.Descriptor{
		Name:    "none",
		Summary: "no-op tracing (zero overhead; default)",
	}, func(map[string]any) (core.Observer, error) { return none{}, nil })
	Registry.Register(spi.Descriptor{
		Name:    "log",
		Summary: "one structured JSON line per turn to stderr (OTel GenAI-flavored)",
	}, func(map[string]any) (core.Observer, error) { return &logObserver{l: log.New(os.Stderr, "", 0)}, nil })
	Registry.Register(spi.Descriptor{
		Name:    "memory",
		Summary: "in-process buffer of recent turns (introspection/tests)",
	}, func(map[string]any) (core.Observer, error) { return NewRecorder(), nil })
	Registry.SetDefault("none")
}

type none struct{}

func (none) Name() string                            { return "none" }
func (none) Observe(context.Context, core.TurnTrace) {}

// logObserver emits one compact, OTel-GenAI-flavored JSON line per turn.
type logObserver struct{ l *log.Logger }

func (*logObserver) Name() string { return "log" }

func (o *logObserver) Observe(_ context.Context, t core.TurnTrace) {
	spans := make(map[string]int64, len(t.Spans))
	for _, s := range t.Spans {
		spans[s.Name] = s.Duration.Milliseconds()
	}
	rec := map[string]any{
		"gen_ai.request.model": t.Model,
		"user":                 t.UserID,
		"latency_ms":           t.Total.Milliseconds(),
		"blocked":              t.Blocked,
		"spans_ms":             spans,
	}
	if t.Usage != nil {
		rec["gen_ai.usage.input_tokens"] = t.Usage.InputTokens
		rec["gen_ai.usage.output_tokens"] = t.Usage.OutputTokens
	}
	if t.Err != "" {
		rec["error"] = t.Err
	}
	b, _ := json.Marshal(rec)
	o.l.Println(string(b))
}

// Recorder keeps recent traces in memory for introspection and tests.
type Recorder struct {
	mu  sync.Mutex
	buf []core.TurnTrace
	max int
}

// NewRecorder returns an in-memory observer that keeps the last ~1000 turns.
func NewRecorder() *Recorder { return &Recorder{max: 1000} }

func (r *Recorder) Name() string { return "memory" }

func (r *Recorder) Observe(_ context.Context, t core.TurnTrace) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.buf = append(r.buf, t)
	if len(r.buf) > r.max {
		r.buf = r.buf[len(r.buf)-r.max:]
	}
}

// Records returns a copy of the buffered traces.
func (r *Recorder) Records() []core.TurnTrace {
	r.mu.Lock()
	defer r.mu.Unlock()
	out := make([]core.TurnTrace, len(r.buf))
	copy(out, r.buf)
	return out
}
