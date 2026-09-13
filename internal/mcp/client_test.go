package mcp

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/TheAgent-net/webagent/internal/backoff"
)

// fastRetry shrinks the retry backoff so retry tests don't sleep. The package's tests run
// sequentially, so swapping the policy variable is safe.
func fastRetry(t *testing.T) {
	t.Helper()
	old := mcpRetryPolicy
	mcpRetryPolicy = backoff.Policy{Attempts: 3, Base: time.Millisecond, Max: 2 * time.Millisecond}
	t.Cleanup(func() { mcpRetryPolicy = old })
}

// Transient 5xx failures are retried with the same request id and the call completes once the
// server recovers.
func TestSendRetriesTransientFailures(t *testing.T) {
	fastRetry(t)
	var hits atomic.Int32
	var mu sync.Mutex
	var ids []int64
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var body struct {
			ID json.RawMessage `json:"id"`
		}
		_ = json.NewDecoder(r.Body).Decode(&body)
		var id int64
		_ = json.Unmarshal(body.ID, &id)
		mu.Lock()
		ids = append(ids, id)
		mu.Unlock()
		if hits.Add(1) < 3 {
			http.Error(w, "boom", http.StatusBadGateway)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{"jsonrpc": "2.0", "id": id, "result": map[string]any{"ok": true}})
	}))
	defer srv.Close()

	c := NewClient(srv.URL, "")
	res, _, err := c.send(context.Background(), "tools/list", nil, 7, true)
	if err != nil {
		t.Fatal(err)
	}
	var got map[string]any
	if err := json.Unmarshal(res, &got); err != nil {
		t.Fatal(err)
	}
	if n := hits.Load(); n != 3 {
		t.Fatalf("want 3 attempts, got %d", n)
	}
	mu.Lock()
	defer mu.Unlock()
	if len(ids) != 3 || ids[0] != 7 || ids[1] != 7 || ids[2] != 7 {
		t.Fatalf("the request id must be stable across retries, saw %v", ids)
	}
}

// A client fault (4xx) fails fast — never replayed.
func TestSendFailsFastOnClientError(t *testing.T) {
	fastRetry(t)
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		hits.Add(1)
		http.Error(w, "unauthorized", http.StatusUnauthorized)
	}))
	defer srv.Close()

	c := NewClient(srv.URL, "")
	if _, _, err := c.send(context.Background(), "tools/list", nil, 1, true); err == nil {
		t.Fatal("expected the 401 to surface as an error")
	}
	if n := hits.Load(); n != 1 {
		t.Fatalf("a 401 must not be retried, made %d attempts", n)
	}
}

// A JSON-RPC application error (a 200 with an error body) is not a transport problem — it
// fails fast.
func TestSendFailsFastOnRPCError(t *testing.T) {
	fastRetry(t)
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		hits.Add(1)
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"jsonrpc": "2.0", "id": 1,
			"error": map[string]any{"code": -32601, "message": "method not found"},
		})
	}))
	defer srv.Close()

	c := NewClient(srv.URL, "")
	if _, _, err := c.send(context.Background(), "tools/list", nil, 1, true); err == nil {
		t.Fatal("expected the RPC error to surface")
	}
	if n := hits.Load(); n != 1 {
		t.Fatalf("an RPC error must not be retried, made %d attempts", n)
	}
}

// Notifications (id == 0) are also retried on server faults.
func TestSendRetriesNotification(t *testing.T) {
	fastRetry(t)
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		if hits.Add(1) < 2 {
			http.Error(w, "boom", http.StatusServiceUnavailable)
			return
		}
		w.WriteHeader(http.StatusOK)
	}))
	defer srv.Close()

	c := NewClient(srv.URL, "")
	if _, _, err := c.send(context.Background(), "notifications/initialized", nil, 0, true); err != nil {
		t.Fatal(err)
	}
	if n := hits.Load(); n != 2 {
		t.Fatalf("want 2 attempts, got %d", n)
	}
}

// tools/call may already have executed server-side when its response was lost, so it is never
// replayed — not on a 5xx, not on a 429.
func TestCallToolDoesNotRetry(t *testing.T) {
	fastRetry(t)
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		hits.Add(1)
		http.Error(w, "boom", http.StatusBadGateway)
	}))
	defer srv.Close()

	c := NewClient(srv.URL, "")
	if _, _, err := c.send(context.Background(), "tools/call", map[string]any{"name": "order"}, 9, false); err == nil {
		t.Fatal("expected the 502 to surface")
	}
	if n := hits.Load(); n != 1 {
		t.Fatalf("tools/call must never be replayed, made %d attempts", n)
	}
}

// A 429 with Retry-After recovers on the hinted (policy-capped) delay for idempotent requests.
func TestSendHonorsRetryAfterOnRateLimit(t *testing.T) {
	fastRetry(t)
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if hits.Add(1) == 1 {
			w.Header().Set("Retry-After", "3600") // a hostile hint; clamped by the policy Max
			http.Error(w, "slow down", http.StatusTooManyRequests)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{"jsonrpc": "2.0", "id": 1, "result": map[string]any{"ok": true}})
	}))
	defer srv.Close()

	c := NewClient(srv.URL, "")
	start := time.Now()
	if _, _, err := c.send(context.Background(), "tools/list", nil, 1, true); err != nil {
		t.Fatal(err)
	}
	if elapsed := time.Since(start); elapsed > 500*time.Millisecond {
		t.Fatalf("hostile Retry-After was not clamped: took %v", elapsed)
	}
	if n := hits.Load(); n != 2 {
		t.Fatalf("want 2 attempts, got %d", n)
	}
}
