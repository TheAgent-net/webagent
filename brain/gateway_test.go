package brain

import (
	"context"
	"encoding/json"
	"io"
	"net"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"syscall"
	"testing"
	"time"

	"github.com/TheAgent-net/webagent/core"
	"github.com/TheAgent-net/webagent/internal/backoff"
)

// fakeTool records that it was called and echoes an argument back.
type fakeTool struct{ called *bool }

func (fakeTool) Name() string { return "get_weather" }
func (f fakeTool) Call(_ context.Context, args map[string]any) (map[string]any, error) {
	*f.called = true
	return map[string]any{"tempC": 22, "city": args["city"]}, nil
}

// Drives the full model-agnostic tool-calling loop against a mock OpenAI-compatible gateway:
// round 1 asks to call the tool, round 2 (after the tool result is fed back) returns the
// final answer. Proves the brain executes tools and threads results back — no network/keys.
func TestGatewayBrainToolLoop(t *testing.T) {
	step := 0
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if step == 0 {
			step++
			_ = json.NewEncoder(w).Encode(map[string]any{
				"choices": []map[string]any{{"message": map[string]any{
					"role": "assistant",
					"tool_calls": []map[string]any{{
						"id": "call_1", "type": "function",
						"function": map[string]any{"name": "get_weather", "arguments": `{"city":"Bangalore"}`},
					}},
				}}},
			})
			return
		}
		var body struct {
			Messages []map[string]any `json:"messages"`
		}
		_ = json.NewDecoder(r.Body).Decode(&body)
		sawToolResult := false
		for _, m := range body.Messages {
			if m["role"] == "tool" {
				sawToolResult = true
			}
		}
		if !sawToolResult {
			t.Errorf("expected the tool result to be threaded back to the model")
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"choices": []map[string]any{{"message": map[string]any{
				"role": "assistant", "content": "It's 22C in Bangalore.",
			}}},
		})
	}))
	defer srv.Close()

	b, err := Registry.Get("gateway", map[string]any{"baseUrl": srv.URL, "model": "test-model"})
	if err != nil {
		t.Fatal(err)
	}
	called := false
	msg, err := b.Respond(context.Background(), core.BrainInput{
		Text:        "weather in Bangalore?",
		Instruction: "You are a weather bot.",
		Tools:       []core.Tool{fakeTool{called: &called}},
	})
	if err != nil {
		t.Fatal(err)
	}
	if !called {
		t.Fatal("tool was not executed")
	}
	if msg.Text != "It's 22C in Bangalore." {
		t.Fatalf("unexpected final answer: %q", msg.Text)
	}
}

// A no-tool reply returns directly.
func TestGatewayBrainPlainReply(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"choices": []map[string]any{{"message": map[string]any{"role": "assistant", "content": "hello there"}}},
		})
	}))
	defer srv.Close()

	b, _ := Registry.Get("gateway", map[string]any{"baseUrl": srv.URL, "model": "test-model"})
	msg, err := b.Respond(context.Background(), core.BrainInput{Text: "hi", Instruction: "be nice"})
	if err != nil {
		t.Fatal(err)
	}
	if msg.Text != "hello there" {
		t.Fatalf("got %q", msg.Text)
	}
}

// openrouter is preset: it needs only a model (endpoint defaults to OpenRouter), while the
// generic gateway requires an explicit baseUrl.
func TestBrainProviderDefaults(t *testing.T) {
	if _, err := Registry.Get("openrouter", map[string]any{"model": "anthropic/claude-sonnet-5"}); err != nil {
		t.Fatalf("openrouter should construct with just a model: %v", err)
	}
	if _, err := Registry.Get("gateway", map[string]any{"model": "x"}); err == nil {
		t.Fatal("gateway should require an explicit baseUrl")
	}
}

// The constructor must apply the declared production retry policy — the zero-value fallback
// would clamp Retry-After hints to the backoff package's 4s default instead of 60s.
func TestGatewayBrainUsesDeclaredRetryPolicy(t *testing.T) {
	b, err := Registry.Get("openrouter", map[string]any{"model": "m"})
	if err != nil {
		t.Fatal(err)
	}
	if got := b.(*gatewayBrain).retry; got != gatewayRetryPolicy {
		t.Fatalf("constructor did not apply gatewayRetryPolicy, got %+v", got)
	}
}

// fastRetry shrinks the retry backoff so retry tests don't sleep. Max stays at the production
// cap so Retry-After behavior is exercised as configured.
func fastRetry(b core.Brain) {
	b.(*gatewayBrain).retry = backoff.Policy{Attempts: 3, Base: time.Millisecond, Max: time.Minute}
}

// failTransport fails every request with a fixed error and counts attempts, so transport
// failure classification can be tested without a real network.
type failTransport struct {
	err  error
	hits atomic.Int32
}

func (f *failTransport) RoundTrip(*http.Request) (*http.Response, error) {
	f.hits.Add(1)
	return nil, f.err
}

// A 429 is an unambiguous rejection (the provider never executed the request), so it is
// retried and the turn completes once the provider recovers.
func TestGatewayBrainRetriesRateLimit(t *testing.T) {
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		if hits.Add(1) == 1 {
			http.Error(w, "slow down", http.StatusTooManyRequests)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"choices": []map[string]any{{"message": map[string]any{"role": "assistant", "content": "recovered"}}},
		})
	}))
	defer srv.Close()

	b, _ := Registry.Get("gateway", map[string]any{"baseUrl": srv.URL, "model": "test-model"})
	fastRetry(b)
	msg, err := b.Respond(context.Background(), core.BrainInput{Text: "hi", Instruction: "x"})
	if err != nil {
		t.Fatal(err)
	}
	if msg.Text != "recovered" {
		t.Fatalf("got %q", msg.Text)
	}
	if n := hits.Load(); n != 2 {
		t.Fatalf("want 2 attempts, got %d", n)
	}
}

// A 5xx is ambiguous: the provider may have processed and billed the completion already, so it
// is never replayed.
func TestGatewayBrainDoesNotRetryServerErrors(t *testing.T) {
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		hits.Add(1)
		http.Error(w, "boom", http.StatusInternalServerError)
	}))
	defer srv.Close()

	b, _ := Registry.Get("gateway", map[string]any{"baseUrl": srv.URL, "model": "test-model"})
	fastRetry(b)
	if _, err := b.Respond(context.Background(), core.BrainInput{Text: "hi", Instruction: "x"}); err == nil {
		t.Fatal("expected the 500 to surface as an error")
	}
	if n := hits.Load(); n != 1 {
		t.Fatalf("a 500 must not be replayed, made %d attempts", n)
	}
}

// A refused connection means the request never reached the provider: retrying cannot bill
// twice, so it is retried until the policy is exhausted.
func TestGatewayBrainRetriesUnsentRequests(t *testing.T) {
	tr := &failTransport{err: &net.OpError{Op: "dial", Net: "tcp", Err: syscall.ECONNREFUSED}}
	b, _ := Registry.Get("gateway", map[string]any{"baseUrl": "http://127.0.0.1:1", "model": "test-model"})
	b.(*gatewayBrain).http = &http.Client{Transport: tr}
	fastRetry(b)
	if _, err := b.Respond(context.Background(), core.BrainInput{Text: "hi", Instruction: "x"}); err == nil {
		t.Fatal("expected the connection failure to surface after exhausting retries")
	}
	if n := tr.hits.Load(); n != 3 {
		t.Fatalf("want 3 attempts, got %d", n)
	}
}

// A transport failure past the dial (here: a truncated response) is ambiguous — the provider
// may have billed the completion — so it fails fast.
func TestGatewayBrainDoesNotRetryAmbiguousTransport(t *testing.T) {
	tr := &failTransport{err: io.ErrUnexpectedEOF}
	b, _ := Registry.Get("gateway", map[string]any{"baseUrl": "http://127.0.0.1:1", "model": "test-model"})
	b.(*gatewayBrain).http = &http.Client{Transport: tr}
	fastRetry(b)
	if _, err := b.Respond(context.Background(), core.BrainInput{Text: "hi", Instruction: "x"}); err == nil {
		t.Fatal("expected the transport failure to surface")
	}
	if n := tr.hits.Load(); n != 1 {
		t.Fatalf("an ambiguous transport failure must not be replayed, made %d attempts", n)
	}
}

// A client fault (4xx) fails fast — the request is never replayed.
func TestGatewayBrainFailsFastOnClientError(t *testing.T) {
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		hits.Add(1)
		http.Error(w, "bad key", http.StatusUnauthorized)
	}))
	defer srv.Close()

	b, _ := Registry.Get("gateway", map[string]any{"baseUrl": srv.URL, "model": "test-model"})
	fastRetry(b)
	if _, err := b.Respond(context.Background(), core.BrainInput{Text: "hi", Instruction: "x"}); err == nil {
		t.Fatal("expected the 401 to surface as an error")
	}
	if n := hits.Load(); n != 1 {
		t.Fatalf("a 401 must not be retried, made %d attempts", n)
	}
}

// A 429 with Retry-After recovers after the hinted delay (capped by the policy's Max).
func TestGatewayBrainHonorsRetryAfter(t *testing.T) {
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		if hits.Add(1) == 1 {
			w.Header().Set("Retry-After", "1")
			http.Error(w, "slow down", http.StatusTooManyRequests)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"choices": []map[string]any{{"message": map[string]any{"role": "assistant", "content": "ok now"}}},
		})
	}))
	defer srv.Close()

	b, _ := Registry.Get("gateway", map[string]any{"baseUrl": srv.URL, "model": "test-model"})
	fastRetry(b)
	start := time.Now()
	msg, err := b.Respond(context.Background(), core.BrainInput{Text: "hi", Instruction: "x"})
	if err != nil {
		t.Fatal(err)
	}
	if msg.Text != "ok now" {
		t.Fatalf("got %q", msg.Text)
	}
	if elapsed := time.Since(start); elapsed < time.Second {
		t.Fatalf("Retry-After not honored: recovered after only %v", elapsed)
	}
}
