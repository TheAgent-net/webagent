package observability

import (
	"bytes"
	"context"
	"encoding/json"
	"log"
	"testing"

	"github.com/TheAgent-net/webagent/core"
)

func TestRecorderCapturesTraces(t *testing.T) {
	r := NewRecorder()
	r.Observe(context.Background(), core.TurnTrace{Model: "echo", Output: "hi"})
	r.Observe(context.Background(), core.TurnTrace{Model: "echo", Output: "bye"})
	recs := r.Records()
	if len(recs) != 2 {
		t.Fatalf("expected 2 records, got %d", len(recs))
	}
	if recs[0].Model != "echo" || recs[1].Output != "bye" {
		t.Fatalf("unexpected records: %+v", recs)
	}
}

func TestDefaultIsNone(t *testing.T) {
	o, err := Registry.Get("", nil)
	if err != nil {
		t.Fatal(err)
	}
	if o.Name() != "none" {
		t.Fatalf("default observability should be none, got %s", o.Name())
	}
}

func TestLogObserverDoesNotPanic(t *testing.T) {
	o, err := Registry.Get("log", nil)
	if err != nil {
		t.Fatal(err)
	}
	// Should serialize and emit without error.
	o.Observe(context.Background(), core.TurnTrace{Model: "echo", Spans: []core.Span{{Name: "reason"}}})
}

// The log observer emits token usage under the OTel GenAI field names when present.
func TestLogObserverEmitsUsage(t *testing.T) {
	var buf bytes.Buffer
	o := &logObserver{l: log.New(&buf, "", 0)}
	o.Observe(context.Background(), core.TurnTrace{
		Model: "openrouter",
		Usage: &core.Usage{InputTokens: 41, OutputTokens: 9},
	})
	var rec map[string]any
	if err := json.Unmarshal(buf.Bytes(), &rec); err != nil {
		t.Fatalf("emitted line is not JSON: %v", err)
	}
	if rec["gen_ai.usage.input_tokens"] != float64(41) || rec["gen_ai.usage.output_tokens"] != float64(9) {
		t.Fatalf("usage not emitted: %s", buf.String())
	}
}

// Without a usage meter the log line carries no usage fields.
func TestLogObserverOmitsUsageWhenAbsent(t *testing.T) {
	var buf bytes.Buffer
	o := &logObserver{l: log.New(&buf, "", 0)}
	o.Observe(context.Background(), core.TurnTrace{Model: "echo"})
	if bytes.Contains(buf.Bytes(), []byte("gen_ai.usage")) {
		t.Fatalf("no usage should be emitted: %s", buf.String())
	}
}
