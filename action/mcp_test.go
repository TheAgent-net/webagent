package action

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/TheAgent-net/webagent/core"
)

// mockMCP implements the subset of Streamable HTTP MCP the client uses. It requires the session
// id on non-initialize requests (validating the client threads it), and sse toggles whether
// tools/call replies as a JSON object or a single-response SSE stream.
func mockMCP(sse bool) http.Handler {
	const session = "test-session-123"
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			ID     json.RawMessage `json:"id"`
			Method string          `json:"method"`
			Params json.RawMessage `json:"params"`
		}
		body, _ := io.ReadAll(r.Body)
		_ = json.Unmarshal(body, &req)

		if len(req.ID) == 0 { // notification
			w.WriteHeader(http.StatusAccepted)
			return
		}
		if req.Method != "initialize" && r.Header.Get("Mcp-Session-Id") != session {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		writeJSON := func(result any) {
			w.Header().Set("Content-Type", "application/json")
			_ = json.NewEncoder(w).Encode(map[string]any{"jsonrpc": "2.0", "id": req.ID, "result": result})
		}

		switch req.Method {
		case "initialize":
			w.Header().Set("Mcp-Session-Id", session)
			writeJSON(map[string]any{
				"protocolVersion": "2025-06-18",
				"capabilities":    map[string]any{"tools": map[string]any{}},
				"serverInfo":      map[string]any{"name": "mock", "version": "1"},
			})
		case "tools/list":
			writeJSON(map[string]any{"tools": []map[string]any{{
				"name":        "greet",
				"description": "greet someone by name",
				"inputSchema": map[string]any{"type": "object", "properties": map[string]any{"name": map[string]any{"type": "string"}}},
			}}})
		case "tools/call":
			var p struct {
				Arguments map[string]any `json:"arguments"`
			}
			_ = json.Unmarshal(req.Params, &p)
			result := map[string]any{
				"content": []map[string]any{{"type": "text", "text": fmt.Sprintf("hello %v", p.Arguments["name"])}},
				"isError": false,
			}
			if sse {
				w.Header().Set("Content-Type", "text/event-stream")
				b, _ := json.Marshal(map[string]any{"jsonrpc": "2.0", "id": req.ID, "result": result})
				_, _ = fmt.Fprintf(w, "event: message\ndata: %s\n\n", b)
			} else {
				writeJSON(result)
			}
		default:
			w.WriteHeader(http.StatusBadRequest)
		}
	})
}

func TestMCPProviderListsAndCallsTools(t *testing.T) {
	for _, sse := range []bool{false, true} {
		name := "json"
		if sse {
			name = "sse"
		}
		t.Run(name, func(t *testing.T) {
			srv := httptest.NewServer(mockMCP(sse))
			defer srv.Close()

			p, err := Registry.Get("mcp", map[string]any{"url": srv.URL})
			if err != nil {
				t.Fatal(err)
			}
			tools, err := p.Tools(context.Background())
			if err != nil {
				t.Fatalf("Tools: %v", err)
			}
			if len(tools) != 1 || tools[0].Name() != "greet" {
				t.Fatalf("want one 'greet' tool, got %+v", tools)
			}
			ts, ok := tools[0].(core.ToolSchema)
			if !ok || ts.Description() == "" {
				t.Fatal("tool schema not exposed through the provider")
			}
			out, err := tools[0].Call(context.Background(), map[string]any{"name": "Ada"})
			if err != nil {
				t.Fatalf("Call: %v", err)
			}
			b, _ := json.Marshal(out)
			if !strings.Contains(string(b), "hello Ada") {
				t.Fatalf("unexpected tool result: %s", b)
			}
		})
	}
}

func TestMCPProviderRequiresURL(t *testing.T) {
	if _, err := Registry.Get("mcp", map[string]any{}); err == nil {
		t.Fatal("mcp provider should require a server url")
	}
}

func TestMCPProviderUsesDirectAPIKey(t *testing.T) {
	authReceived := ""
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authReceived = r.Header.Get("Authorization")
		w.Header().Set("Content-Type", "application/json")
		var req struct {
			ID     any    `json:"id"`
			Method string `json:"method"`
		}
		_ = json.NewDecoder(r.Body).Decode(&req)
		if req.Method == "initialize" {
			_ = json.NewEncoder(w).Encode(map[string]any{
				"jsonrpc": "2.0", "id": req.ID,
				"result": map[string]any{"protocolVersion": "2025-06-18", "capabilities": map[string]any{}},
			})
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"jsonrpc": "2.0", "id": req.ID,
			"result": map[string]any{"tools": []any{}},
		})
	}))
	defer srv.Close()

	p, err := Registry.Get("mcp", map[string]any{
		"url":    srv.URL,
		"apiKey": "test-mcp-key",
	})
	if err != nil {
		t.Fatal(err)
	}
	_, err = p.Tools(context.Background())
	if err != nil {
		t.Fatalf("Tools: %v", err)
	}
	if authReceived != "Bearer test-mcp-key" {
		t.Fatalf("expected Authorization 'Bearer test-mcp-key', got %q", authReceived)
	}
}
