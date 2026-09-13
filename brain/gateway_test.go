package brain

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"
	"time"

	"github.com/TheAgent-net/webagent/core"
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

// Token usage is accumulated across every round of the tool-calling loop and returned on the
// reply itself (scoped to the turn) — the raw material for the per-tenant cost meter.
func TestGatewayBrainReportsUsage(t *testing.T) {
	step := 0
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if step == 0 {
			step++
			_ = json.NewEncoder(w).Encode(map[string]any{
				"choices": []map[string]any{{"message": map[string]any{
					"role":       "assistant",
					"tool_calls": []map[string]any{{"id": "call_1", "type": "function", "function": map[string]any{"name": "get_weather", "arguments": `{"city":"Bangalore"}`}}},
				}}},
				"usage": map[string]any{"prompt_tokens": 10, "completion_tokens": 20},
			})
			return
		}
		// Second round reports the newer input_tokens/output_tokens spelling.
		_ = json.NewEncoder(w).Encode(map[string]any{
			"choices": []map[string]any{{"message": map[string]any{"role": "assistant", "content": "It's 22C."}}},
			"usage":   map[string]any{"input_tokens": 30, "output_tokens": 5},
		})
	}))
	defer srv.Close()

	b, _ := Registry.Get("gateway", map[string]any{"baseUrl": srv.URL, "model": "test-model"})
	msg, err := b.Respond(context.Background(), core.BrainInput{Text: "weather?", Instruction: "x"})
	if err != nil {
		t.Fatal(err)
	}
	if msg.Usage == nil {
		t.Fatal("usage should be reported")
	}
	if msg.Usage.InputTokens != 40 || msg.Usage.OutputTokens != 25 {
		t.Fatalf("usage should accumulate across tool rounds, got %+v", msg.Usage)
	}

	// A fresh turn starts a fresh meter: the counts above must not leak into it.
	msg2, err := b.Respond(context.Background(), core.BrainInput{Text: "again?", Instruction: "x"})
	if err != nil {
		t.Fatal(err)
	}
	if msg2.Usage == nil || msg2.Usage.InputTokens != 30 || msg2.Usage.OutputTokens != 5 {
		t.Fatalf("usage should be scoped to the turn, got %+v", msg2.Usage)
	}
}

// Concurrent turns must each report their own usage: the shared brain can serve many turns at
// once and token counts may never mix between them.
func TestGatewayBrainUsageScopedPerTurn(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var body struct {
			Messages []struct {
				Content string `json:"content"`
			} `json:"messages"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || len(body.Messages) < 2 {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}
		var n int
		_, _ = fmt.Sscanf(body.Messages[1].Content, "hi-%d", &n)
		time.Sleep(time.Duration(n%3) * time.Millisecond) // encourage interleaving
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"choices": []map[string]any{{"message": map[string]any{"role": "assistant", "content": fmt.Sprintf("reply-%d", n)}}},
			"usage":   map[string]any{"prompt_tokens": n, "completion_tokens": 2 * n},
		})
	}))
	defer srv.Close()

	b, _ := Registry.Get("gateway", map[string]any{"baseUrl": srv.URL, "model": "test-model"})

	const turns = 8
	var wg sync.WaitGroup
	errs := make(chan error, turns)
	for i := 0; i < turns; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			msg, err := b.Respond(context.Background(), core.BrainInput{Text: fmt.Sprintf("hi-%d", i), Instruction: "x"})
			if err != nil {
				errs <- fmt.Errorf("turn %d: %w", i, err)
				return
			}
			if msg.Usage == nil || msg.Usage.InputTokens != i || msg.Usage.OutputTokens != 2*i {
				errs <- fmt.Errorf("turn %d: usage mixed between concurrent turns: %+v", i, msg.Usage)
			}
			if want := fmt.Sprintf("reply-%d", i); msg.Text != want {
				errs <- fmt.Errorf("turn %d: got %q", i, msg.Text)
			}
		}(i)
	}
	wg.Wait()
	close(errs)
	for err := range errs {
		t.Error(err)
	}
}

// A provider that omits the usage block means "not reported": the reply carries nil, never a
// fabricated zero.
func TestGatewayBrainNilUsageWhenUnreported(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"choices": []map[string]any{{"message": map[string]any{"role": "assistant", "content": "hello"}}},
		})
	}))
	defer srv.Close()

	b, _ := Registry.Get("gateway", map[string]any{"baseUrl": srv.URL, "model": "test-model"})
	msg, err := b.Respond(context.Background(), core.BrainInput{Text: "hi", Instruction: "x"})
	if err != nil {
		t.Fatal(err)
	}
	if msg.Usage != nil {
		t.Fatalf("an unreported usage must stay nil, got %+v", msg.Usage)
	}
}

// A decoded response with billable usage but no choices still reports the usage alongside the
// error: a failed turn's partial usage is still cost.
func TestGatewayBrainKeepsUsageOnError(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"choices": []map[string]any{},
			"usage":   map[string]any{"prompt_tokens": 17, "completion_tokens": 0},
		})
	}))
	defer srv.Close()

	b, _ := Registry.Get("gateway", map[string]any{"baseUrl": srv.URL, "model": "test-model"})
	msg, err := b.Respond(context.Background(), core.BrainInput{Text: "hi", Instruction: "x"})
	if err == nil {
		t.Fatal("expected an error for an empty choices response")
	}
	if msg.Usage == nil || msg.Usage.InputTokens != 17 {
		t.Fatalf("billed usage must survive the error, got %+v", msg.Usage)
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
