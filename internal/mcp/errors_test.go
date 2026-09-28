package mcp

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"strings"
	"sync/atomic"
	"testing"
)

func TestHTTPErrorPreservesStatusAndChallenges(t *testing.T) {
	for _, tc := range []struct {
		method string
		status int
		calls  int32
	}{
		{method: "initialize", status: http.StatusUnauthorized, calls: 1},
		{method: "notifications/initialized", status: http.StatusUnauthorized, calls: 2},
		{method: "tools/list", status: http.StatusUnauthorized, calls: 3},
		{method: "tools/call", status: http.StatusUnauthorized, calls: 4},
		{method: "tools/call", status: http.StatusForbidden, calls: 4},
		{method: "tools/list", status: http.StatusServiceUnavailable, calls: 3},
	} {
		t.Run(fmt.Sprintf("%s/%d", tc.method, tc.status), func(t *testing.T) {
			challenges := []string{
				`Basic realm="legacy, internal"`,
				`Bearer resource_metadata="https://example.invalid/.well-known/oauth-protected-resource", scope="notes:read", error_description="sensitive-challenge"`,
			}
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
				if req.Method == tc.method {
					for _, challenge := range challenges {
						w.Header().Add("WWW-Authenticate", challenge)
					}
					// Non-JSON error content must not obscure status or leak into errors.
					http.Error(w, "sensitive-response-body", tc.status)
					return
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

			client := NewClient(server.URL, "static-test-token")
			_, err := client.ListTools(context.Background())
			if tc.method == "tools/call" {
				if err != nil {
					t.Fatal(err)
				}
				_, err = client.CallTool(context.Background(), "read_note", map[string]any{})
			}
			if err == nil {
				t.Fatal("expected HTTP failure")
			}
			// Build and provider layers wrap errors; structured details must survive.
			wrapped := fmt.Errorf("action provider: %w", err)
			var httpErr *HTTPError
			if !errors.As(wrapped, &httpErr) {
				t.Fatalf("want HTTPError, got %v", wrapped)
			}
			if httpErr.StatusCode != tc.status || httpErr.Method != tc.method {
				t.Fatalf("wrong status/method: %v", httpErr)
			}
			if !reflect.DeepEqual(httpErr.WWWAuthenticate, challenges) {
				t.Fatal("challenge header values were not preserved")
			}
			want := fmt.Sprintf("mcp %s: %d %s", tc.method, tc.status, http.StatusText(tc.status))
			if err.Error() != want || strings.Contains(wrapped.Error(), "sensitive-") {
				t.Fatal("HTTP error exposed response data or changed its safe description")
			}
			if received.Load() != tc.calls {
				t.Fatalf("want %d requests without retries, got %d", tc.calls, received.Load())
			}
			if tc.method == "notifications/initialized" && client.initDone {
				t.Fatal("rejected initialization notification left the client ready")
			}
		})
	}
}

func TestHTTPErrorWithoutChallenge(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusUnauthorized)
	}))
	defer server.Close()
	_, err := NewClient(server.URL, "").ListTools(context.Background())
	var httpErr *HTTPError
	if !errors.As(err, &httpErr) || httpErr.StatusCode != http.StatusUnauthorized {
		t.Fatalf("want HTTP 401, got %v", err)
	}
	if len(httpErr.WWWAuthenticate) != 0 {
		t.Fatal("missing challenge should remain absent")
	}
}

func TestTransportFailureIsNotHTTPError(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))
	server.Close()
	_, err := NewClient(server.URL, "").ListTools(context.Background())
	if err == nil {
		t.Fatal("want transport failure")
	}
	var httpErr *HTTPError
	if errors.As(err, &httpErr) {
		t.Fatal("transport failure classified as HTTP response")
	}
}
