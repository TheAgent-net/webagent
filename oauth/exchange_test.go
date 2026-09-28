package oauth

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"sync/atomic"
	"testing"
	"time"
)

func tokenResponse(t *testing.T, access string) string {
	t.Helper()
	body, err := json.Marshal(map[string]any{
		"access_token": access, "refresh_token": "refresh-secret",
		"token_type": "Bearer", "expires_in": 3600, "scope": "notes:read",
	})
	if err != nil {
		t.Fatal(err)
	}
	return string(body)
}

func TestFlowOpaqueAccessTokenPreserved(t *testing.T) {
	for name, access := range map[string]string{
		"colon delimited": "user:grant:opaque-secret",
		"punctuation":     "opaque!#$%&'()*+,-./:;<=>?@[\\]^_`{|}~secret",
		"base64":          "opaque+secret/==",
		"jwt shaped":      "header.payload.signature",
	} {
		t.Run(name, func(t *testing.T) {
			x := newFlowFixture(t, "none")
			x.body = tokenResponse(t, access)
			x.refreshBody = tokenResponse(t, "refreshed:"+access)
			var expected atomic.Value
			expected.Store("Bearer " + access)
			backend := &personalMCP{}
			x.mcpHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if r.Header.Get("Authorization") != expected.Load().(string) {
					t.Error("provider token changed before transmission")
					http.Error(w, "incorrect credential", http.StatusUnauthorized)
					return
				}
				// Reuse the MCP protocol fixture after verifying the exact wire value.
				r.Header.Set("Authorization", "Bearer access-secret")
				backend.ServeHTTP(w, r)
			})
			u, cookie := x.start(t)
			w := x.callback(x.ctx, x.approve(t, u), cookie)
			if w.Code != http.StatusOK || strings.Contains(w.Body.String(), "secret") {
				t.Fatalf("opaque token consent failed: status %d", w.Code)
			}
			tokens, err := x.store.Load(x.ctx, x.flow.cfg.Binding)
			if err != nil || tokens.AccessToken != access {
				t.Fatal("encrypted storage changed the access token")
			}
			source, err := x.flow.ToolSource()
			if err != nil {
				t.Fatal(err)
			}
			source.httpc.Transport = x.server.Client().Transport
			t.Cleanup(source.CloseIdleConnections)
			tools, err := source.Tools(x.ctx)
			if err != nil || len(tools) == 0 {
				t.Fatalf("opaque token discovery failed: %v", err)
			}
			// Force expiry to exercise the same validation during refresh, then use
			// an already discovered tool to check the rotated credential on the wire.
			tokens.ExpiresAt = time.Now().Add(-time.Minute)
			if err := x.store.Save(x.ctx, x.flow.cfg.Binding, tokens); err != nil {
				t.Fatal(err)
			}
			expected.Store("Bearer refreshed:" + access)
			if _, err := tools[0].Call(x.ctx, nil); err != nil {
				t.Fatal(err)
			}
			if x.refreshCalls.Load() != 1 || backend.calls.Load() != 1 {
				t.Fatal("refresh or authenticated tool execution did not complete")
			}
			refreshed, err := x.store.Load(x.ctx, x.flow.cfg.Binding)
			if err != nil || refreshed.AccessToken != "refreshed:"+access || refreshed.ConnectionID != tokens.ConnectionID {
				t.Fatal("refresh changed token bytes or connection identity")
			}
		})
	}
}

func TestFlowUnsafeAccessTokenRejected(t *testing.T) {
	for name, access := range map[string]string{
		"empty": "", "space": "opaque secret", "leading space": " secret",
		"trailing space": "secret ", "tab": "opaque\tsecret", "newline": "secret\nInjected:x",
		"carriage return": "secret\rInjected:x", "null": "opaque\x00secret",
		"control": "opaque\x1fsecret", "delete": "opaque\x7fsecret", "unicode": "opaque\u00a0secret",
	} {
		t.Run(name, func(t *testing.T) {
			x := newFlowFixture(t, "none")
			x.body = tokenResponse(t, access)
			u, cookie := x.start(t)
			w := x.callback(x.ctx, x.approve(t, u), cookie)
			if w.Code != http.StatusBadGateway || strings.Contains(w.Body.String(), "secret") {
				t.Fatal("unsafe credential accepted or exposed")
			}
			if _, err := x.store.Load(x.ctx, x.flow.cfg.Binding); !errors.Is(err, ErrNotConnected) {
				t.Fatal("unsafe credential persisted")
			}
		})
	}
}
