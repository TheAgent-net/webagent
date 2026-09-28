package oauth

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/TheAgent-net/webagent/build"
	"github.com/TheAgent-net/webagent/core"
	"github.com/TheAgent-net/webagent/spec"
)

type personalMCP struct {
	mu       sync.Mutex
	sessions map[string]string
	requests atomic.Int32
	calls    atomic.Int32
	status   int
}

func (m *personalMCP) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	m.requests.Add(1)
	if m.status != 0 {
		w.Header().Set("WWW-Authenticate", `Bearer error_description="credential-secret"`)
		http.Error(w, "credential-secret", m.status)
		return
	}
	owner := map[string]string{"Bearer access-secret": "a", "Bearer access-b": "b", "Bearer access-c": "c", "Bearer access-new": "a"}[r.Header.Get("Authorization")]
	if owner == "" {
		http.Error(w, "authorization required", http.StatusUnauthorized)
		return
	}
	var req struct {
		ID     json.RawMessage `json:"id"`
		Method string          `json:"method"`
		Params struct {
			Name string `json:"name"`
		} `json:"params"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid RPC", 400)
		return
	}
	var result any
	if req.Method == "initialize" {
		m.mu.Lock()
		if m.sessions == nil {
			m.sessions = make(map[string]string)
		}
		sid := fmt.Sprintf("session-%d", len(m.sessions)+1)
		m.sessions[sid] = owner
		m.mu.Unlock()
		w.Header().Set("Mcp-Session-Id", sid)
		result = map[string]any{"protocolVersion": "2025-06-18", "capabilities": map[string]any{}}
	} else {
		m.mu.Lock()
		sessionOwner := m.sessions[r.Header.Get("Mcp-Session-Id")]
		m.mu.Unlock()
		if sessionOwner != owner {
			http.Error(w, "session crossed users", http.StatusForbidden)
			return
		}
		switch req.Method {
		case "notifications/initialized":
			w.WriteHeader(http.StatusAccepted)
			return
		case "tools/list":
			result = map[string]any{"tools": []map[string]any{
				{"name": "read_" + owner, "description": "Read personal notes", "inputSchema": map[string]any{"type": "object"}},
				{"name": "delete_account", "description": "Delete account", "inputSchema": map[string]any{"type": "object"}},
			}}
		case "tools/call":
			m.calls.Add(1)
			if req.Params.Name != "read_"+owner {
				http.Error(w, "tool not authorized", http.StatusForbidden)
				return
			}
			result = map[string]any{"content": []map[string]any{{"type": "text", "text": "private notes for " + owner}}}
		default:
			http.Error(w, "unknown method", 400)
			return
		}
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]any{"jsonrpc": "2.0", "id": req.ID, "result": result})
}

func personalSourceFixture(t *testing.T) (*MCPToolSource, *FileStore, context.Context, *personalMCP) {
	t.Helper()
	store, _, ctx, binding, tokens := storeFixture(t)
	backend := &personalMCP{}
	server := httptest.NewTLSServer(backend)
	t.Cleanup(server.Close)
	binding.Resource = server.URL + "/mcp"
	source, err := NewMCPToolSource(binding, store)
	if err != nil {
		t.Fatal(err)
	}
	// Only the test replaces the public-IP transport; production has no bypass option.
	source.httpc.Transport = server.Client().Transport
	t.Cleanup(source.CloseIdleConnections)
	tokens.AccessToken = "access-secret"
	tokens.ExpiresAt = time.Now().Add(time.Hour)
	if err := store.Save(ctx, binding, tokens); err != nil {
		t.Fatal(err)
	}
	return source, store, ctx, backend
}

type personalBrain struct {
	owners map[core.Identity]string
	calls  atomic.Int32
}

func (*personalBrain) Name() string { return "personal-test" }
func (b *personalBrain) Respond(ctx context.Context, in core.BrainInput) (core.AgentMessage, error) {
	b.calls.Add(1)
	id, _ := core.IdentityFromContext(ctx)
	owner := b.owners[id]
	if owner == "" || len(in.Tools) != 2 || in.Tools[0].Name() != "read_"+owner {
		return core.AgentMessage{}, errors.New("wrong user's tool catalog reached brain")
	}
	if in.UserID == "spoofed" {
		return core.AgentMessage{}, errors.New("untrusted channel name used as identity")
	}
	for _, memory := range in.Memories {
		if strings.Contains(memory.Text, "private notes for ") && !strings.Contains(memory.Text, "private notes for "+owner) {
			return core.AgentMessage{}, errors.New("another user's memory reached brain")
		}
	}
	schema, ok := in.Tools[0].(core.ToolSchema)
	if !ok || schema.Schema()["type"] != "object" {
		return core.AgentMessage{}, errors.New("guard wrapper lost tool schema")
	}
	result, err := in.Tools[0].Call(ctx, map[string]any{"user": "victim", "token": "not-a-credential"})
	if err != nil {
		return core.AgentMessage{}, err
	}
	encoded, _ := json.Marshal(result)
	if !strings.Contains(string(encoded), "private notes for "+owner) {
		return core.AgentMessage{}, errors.New("incorrect personal tool result")
	}
	blocked, err := in.Tools[1].Call(ctx, nil)
	if err != nil || blocked["error"] != "blocked_by_guardrail" {
		return core.AgentMessage{}, errors.New("dynamic tool bypassed action guardrail")
	}
	return core.AgentMessage{Text: "private notes for " + owner}, nil
}

func personalAgent(t *testing.T, source *MCPToolSource, owners map[core.Identity]string) (*core.Agent, *personalBrain) {
	t.Helper()
	agent, err := build.Build(context.Background(), &spec.AgentSpec{Name: "Personal notes", Action: spec.ActionSpec{Provider: "none"}}, build.WithToolSource(source))
	if err != nil {
		t.Fatal(err)
	}
	brain := &personalBrain{owners: owners}
	agent.Brain = brain
	return agent, brain
}

func TestPersonalToolsIsolateUsersAndMemory(t *testing.T) {
	source, store, ctxA, backend := personalSourceFixture(t)
	ctxB := identityContext(t, "tenant-a", "user-b")
	ctxC := identityContext(t, "tenant-b", "user-a")
	owners := map[core.Identity]string{}
	for i, ctx := range []context.Context{ctxA, ctxB, ctxC} {
		id, _ := core.IdentityFromContext(ctx)
		owners[id] = []string{"a", "b", "c"}[i]
		if i > 0 {
			if err := store.Save(ctx, source.binding, Tokens{AccessToken: "access-" + owners[id]}); err != nil {
				t.Fatal(err)
			}
		}
	}
	agent, brain := personalAgent(t, source, owners)
	if backend.requests.Load() != 0 {
		t.Fatal("build contacted MCP before a user turn")
	}
	// All turns deliberately claim the same channel name; verified identities govern access.
	for _, ctx := range []context.Context{ctxA, ctxB, ctxC, ctxA} {
		if _, err := agent.Handle(ctx, core.Turn{ChannelUserID: "spoofed", Text: "read notes"}); err != nil {
			t.Fatal(err)
		}
	}
	var wg sync.WaitGroup
	for _, ctx := range []context.Context{ctxA, ctxB, ctxC} {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if _, err := agent.Handle(ctx, core.Turn{ChannelUserID: "spoofed", Text: "read notes"}); err != nil {
				t.Error(err)
			}
		}()
	}
	wg.Wait()
	if backend.calls.Load() != 7 || len(agent.Tools) != 0 {
		t.Fatal("tools leaked into shared state or bypassed guards")
	}
	before := brain.calls.Load()
	if _, err := agent.Handle(context.Background(), core.Turn{ChannelUserID: "spoofed", Text: "read notes"}); !errors.Is(err, ErrIdentityRequired) || brain.calls.Load() != before {
		t.Fatal("anonymous turn reached personal reasoning")
	}
	backend.mu.Lock()
	defer backend.mu.Unlock()
	if len(backend.sessions) != 7 {
		t.Fatal("MCP sessions were shared across turns")
	}
}

func TestPersonalToolsRecheckConnectionBeforeCall(t *testing.T) {
	for _, kind := range []string{"deleted", "expired", "changed", "other user", "anonymous", "canceled"} {
		t.Run(kind, func(t *testing.T) {
			source, store, ctx, backend := personalSourceFixture(t)
			tools, err := source.Tools(ctx)
			if err != nil {
				t.Fatal(err)
			}
			before := backend.requests.Load()
			callCtx := ctx
			var want error
			switch kind {
			case "deleted":
				if err := store.Delete(ctx, source.binding); err != nil {
					t.Fatal(err)
				}
				want = ErrNotConnected
			case "expired":
				if err := store.Save(ctx, source.binding, Tokens{AccessToken: "access-secret", ExpiresAt: time.Now().Add(-time.Second)}); err != nil {
					t.Fatal(err)
				}
				want = ErrTokenExpired
			case "changed":
				if err := store.Save(ctx, source.binding, Tokens{AccessToken: "access-new"}); err != nil {
					t.Fatal(err)
				}
				want = ErrConnectionChanged
			case "other user":
				callCtx = identityContext(t, "tenant-a", "user-b")
				want = ErrIdentityMismatch
			case "anonymous":
				callCtx = context.Background()
				want = ErrIdentityRequired
			case "canceled":
				var cancel context.CancelFunc
				callCtx, cancel = context.WithCancel(ctx)
				cancel()
				want = context.Canceled
			}
			if _, err := tools[0].Call(callCtx, nil); !errors.Is(err, want) {
				t.Fatalf("got %v, want %v", err, want)
			}
			if backend.requests.Load() != before {
				t.Fatal("rejected tool call reached MCP")
			}
			if kind == "changed" {
				fresh, err := source.Tools(ctx)
				if err != nil {
					t.Fatal(err)
				}
				if _, err := fresh[0].Call(ctx, nil); err != nil {
					t.Fatal("new turn did not use replacement credentials")
				}
			}
		})
	}
}

func TestPersonalToolsRejectMissingConnectionAndUnsafeTransport(t *testing.T) {
	source, store, ctx, backend := personalSourceFixture(t)
	for _, missingCtx := range []context.Context{context.Background(), identityContext(t, "tenant-a", "unconnected")} {
		if _, err := source.Tools(missingCtx); err == nil {
			t.Fatal("missing connection accepted")
		}
	}
	if backend.requests.Load() != 0 {
		t.Fatal("missing credentials contacted MCP")
	}
	production, err := NewMCPToolSource(source.binding, store)
	if err != nil {
		t.Fatal(err)
	}
	defer production.CloseIdleConnections()
	if _, err := production.Tools(ctx); err == nil || backend.requests.Load() != 0 {
		t.Fatal("production transport contacted a private server")
	}
	bad := source.binding
	bad.Resource = "http://notes.example/mcp"
	if _, err := NewMCPToolSource(bad, store); err == nil {
		t.Fatal("unencrypted MCP destination accepted")
	}
}

func TestPersonalToolsSanitizeServerErrors(t *testing.T) {
	for _, status := range []int{401, 403, 500} {
		t.Run(fmt.Sprint(status), func(t *testing.T) {
			source, _, ctx, backend := personalSourceFixture(t)
			backend.status = status
			_, err := source.Tools(ctx)
			if err == nil || strings.Contains(err.Error(), "credential-secret") || backend.requests.Load() != 1 {
				t.Fatal("server error leaked or was retried")
			}
			if status != 500 && !errors.Is(err, ErrAuthorizationRequired) {
				t.Fatal("authorization failure was not classified")
			}
		})
	}
}

func TestConsentToPersonalToolExecution(t *testing.T) {
	x := newFlowFixture(t, "none")
	backend := &personalMCP{}
	x.mcpHandler = backend
	u, cookie := x.start(t)
	if w := x.callback(x.ctx, x.approve(t, u), cookie); w.Code != http.StatusOK {
		t.Fatal("consent failed")
	}
	source, err := NewMCPToolSource(x.flow.cfg.Binding, x.store)
	if err != nil {
		t.Fatal(err)
	}
	source.httpc.Transport = x.server.Client().Transport
	defer source.CloseIdleConnections()
	id, _ := core.IdentityFromContext(x.ctx)
	agent, _ := personalAgent(t, source, map[core.Identity]string{id: "a"})
	msg, err := agent.Handle(x.ctx, core.Turn{ChannelUserID: "spoofed", Text: "read notes"})
	if err != nil || msg.Text != "private notes for a" || backend.calls.Load() != 1 || x.calls.Load() != 1 {
		t.Fatalf("consent-to-tool flow failed: %v", err)
	}
}
