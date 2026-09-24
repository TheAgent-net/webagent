package mcp

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"
)

func TestTokenSourceUsesCurrentTokenForEveryRequest(t *testing.T) {
	var received atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		n := received.Add(1)
		want := fmt.Sprintf("Bearer test-token-%d", n)
		if r.Header.Get("Authorization") != want {
			t.Error("request did not carry the current token")
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}
		var req struct {
			ID     json.RawMessage `json:"id"`
			Method string          `json:"method"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			t.Error(err)
			return
		}
		if req.Method == "notifications/initialized" {
			w.WriteHeader(http.StatusAccepted)
			return
		}
		var result any = map[string]any{}
		if req.Method == "tools/list" {
			result = map[string]any{"tools": []any{}}
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]any{"jsonrpc": "2.0", "id": req.ID, "result": result}); err != nil {
			t.Error(err)
		}
	}))
	defer server.Close()

	var issued atomic.Int32
	client, err := NewClientWithTokenSource(server.URL, func(context.Context) (string, error) {
		// A new value simulates an OAuth manager replacing an expired token.
		return fmt.Sprintf("test-token-%d", issued.Add(1)), nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := client.ListTools(context.Background()); err != nil {
		t.Fatal(err)
	}
	if _, err := client.CallTool(context.Background(), "read_note", map[string]any{}); err != nil {
		t.Fatal(err)
	}
	// initialize, initialized notification, tools/list, tools/call.
	if received.Load() != 4 || issued.Load() != 4 {
		t.Fatalf("want 4 token lookups and requests; got %d lookups and %d requests", issued.Load(), received.Load())
	}
}

func TestTokenSourceFailureDoesNotSendRequest(t *testing.T) {
	sourceErr := errors.New("connection needs authorization")
	for _, tc := range []struct {
		name  string
		token string
		err   error
	}{
		{name: "error", token: "must-not-be-sent", err: sourceErr},
		{name: "empty"},
		{name: "whitespace", token: "  "},
	} {
		t.Run(tc.name, func(t *testing.T) {
			var received atomic.Int32
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
				received.Add(1)
				w.WriteHeader(http.StatusInternalServerError)
			}))
			defer server.Close()
			client, err := NewClientWithTokenSource(server.URL, func(context.Context) (string, error) {
				return tc.token, tc.err
			})
			if err != nil {
				t.Fatal(err)
			}
			if _, err = client.ListTools(context.Background()); err == nil {
				t.Fatal("expected token failure")
			}
			if tc.err != nil && !errors.Is(err, tc.err) {
				t.Fatalf("source error not preserved: %v", err)
			}
			if received.Load() != 0 {
				t.Fatal("request sent despite unavailable credentials")
			}
		})
	}
}

func TestTokenSourceRequiresSource(t *testing.T) {
	if _, err := NewClientWithTokenSource("http://unused.invalid", nil); err == nil {
		t.Fatal("nil source accepted")
	}
}

func TestTokenSourceDisconnectPreventsToolCall(t *testing.T) {
	var received atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		received.Add(1)
		var req struct {
			ID     json.RawMessage `json:"id"`
			Method string          `json:"method"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			t.Error(err)
			return
		}
		if r.Header.Get("Authorization") != "Bearer connected-token" {
			t.Error("connected request missing token")
		}
		if req.Method == "notifications/initialized" {
			w.WriteHeader(http.StatusAccepted)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]any{
			"jsonrpc": "2.0", "id": req.ID, "result": map[string]any{},
		}); err != nil {
			t.Error(err)
		}
	}))
	defer server.Close()
	var disconnected atomic.Bool
	sourceErr := errors.New("connection disconnected")
	client, err := NewClientWithTokenSource(server.URL, func(context.Context) (string, error) {
		if disconnected.Load() {
			return "", sourceErr
		}
		return "connected-token", nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := client.ListTools(context.Background()); err != nil {
		t.Fatal(err)
	}
	if received.Load() != 3 {
		t.Fatalf("want handshake and discovery, got %d requests", received.Load())
	}
	disconnected.Store(true)
	if _, err := client.CallTool(context.Background(), "read_note", map[string]any{}); !errors.Is(err, sourceErr) {
		t.Fatalf("want disconnect error, got %v", err)
	}
	if received.Load() != 3 {
		t.Fatal("tool request sent after connection became unavailable")
	}
}

func TestTokenSourceReceivesCancellation(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	client, err := NewClientWithTokenSource("http://unused.invalid", func(got context.Context) (string, error) {
		if got != ctx {
			t.Fatal("request context was not passed to token source")
		}
		cancel()
		return "", got.Err()
	})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := client.ListTools(ctx); !errors.Is(err, context.Canceled) {
		t.Fatalf("want cancellation, got %v", err)
	}
}

func TestTokenFailureDuringHandshakeLeavesClientUninitialized(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Mcp-Session-Id", "incomplete-session")
		if _, err := w.Write([]byte(`{"jsonrpc":"2.0","id":1,"result":{}}`)); err != nil {
			t.Error(err)
		}
	}))
	defer server.Close()
	sourceErr := errors.New("connection disconnected")
	calls := 0
	client, err := NewClientWithTokenSource(server.URL, func(context.Context) (string, error) {
		calls++
		if calls == 1 {
			return "initial-token", nil
		}
		return "", sourceErr
	})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := client.ListTools(context.Background()); !errors.Is(err, sourceErr) {
		t.Fatalf("want source error, got %v", err)
	}
	if client.initDone || client.sessionID != "" {
		t.Fatal("failed handshake retained initialized state")
	}
}
