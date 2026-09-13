package brain

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

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

func TestGatewayBrainUsesDirectAPIKey(t *testing.T) {
	authReceived := ""
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authReceived = r.Header.Get("Authorization")
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"choices": []map[string]any{{"message": map[string]any{"role": "assistant", "content": "hi"}}},
		})
	}))
	defer srv.Close()

	b, err := Registry.Get("gateway", map[string]any{
		"baseUrl": srv.URL,
		"model":   "test-model",
		"apiKey":  "test-secret-key",
	})
	if err != nil {
		t.Fatal(err)
	}
	_, err = b.Respond(context.Background(), core.BrainInput{Text: "hi"})
	if err != nil {
		t.Fatal(err)
	}
	if authReceived != "Bearer test-secret-key" {
		t.Fatalf("expected Authorization 'Bearer test-secret-key', got %q", authReceived)
	}
}
