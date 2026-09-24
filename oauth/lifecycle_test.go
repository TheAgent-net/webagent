package oauth

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"
)

func expiredConnection(t *testing.T, x *flowFixture) Tokens {
	t.Helper()
	tokens := Tokens{ConnectionID: "original-connection", AccessToken: "access-secret", RefreshToken: "refresh-secret", ExpiresAt: time.Now().Add(-time.Minute), Scopes: []string{"notes:read"}}
	if err := x.store.Save(x.ctx, x.flow.cfg.Binding, tokens); err != nil {
		t.Fatal(err)
	}
	return tokens
}

func TestLifecycleConcurrentRefreshRotatesOnce(t *testing.T) {
	for _, method := range []string{"none", "client_secret_basic"} {
		t.Run(method, func(t *testing.T) {
			x := newFlowFixture(t, method)
			expiredConnection(t, x)
			var wg sync.WaitGroup
			for i := 0; i < 12; i++ {
				wg.Add(1)
				go func() {
					defer wg.Done()
					tokens, err := x.flow.currentTokens(x.ctx)
					if err != nil || tokens.AccessToken != "access-new" || tokens.RefreshToken != "rotated-refresh" || tokens.ConnectionID != "original-connection" {
						t.Error("concurrent refresh lost credentials or connection identity")
					}
				}()
			}
			wg.Wait()
			if x.refreshCalls.Load() != 1 {
				t.Fatal("rotating refresh token exchanged more than once")
			}
		})
	}
}

func TestLifecyclePreservesOmittedRefreshToken(t *testing.T) {
	x := newFlowFixture(t, "none")
	expiredConnection(t, x)
	x.refreshBody = `{"access_token":"access-new","token_type":"Bearer","expires_in":3600}`
	got, err := x.flow.currentTokens(x.ctx)
	if err != nil || got.RefreshToken != "refresh-secret" || len(got.Scopes) != 1 || got.Scopes[0] != "notes:read" {
		t.Fatal("refresh dropped unchanged token/scopes")
	}
}

func TestLifecycleFailedRefreshRequiresReconnect(t *testing.T) {
	for _, kind := range []string{"invalid grant", "server failure", "scope expansion", "storage failure", "canceled"} {
		t.Run(kind, func(t *testing.T) {
			x := newFlowFixture(t, "none")
			expiredConnection(t, x)
			switch kind {
			case "invalid grant":
				x.refreshStatus = 400
				x.refreshBody = `{"error":"invalid_grant"}`
			case "server failure":
				x.refreshStatus = 503
			case "scope expansion":
				x.refreshBody = `{"access_token":"access-new","token_type":"Bearer","scope":"admin"}`
			case "storage failure":
				x.flow.store = failingFlowStore{x.store}
			}
			ctx := x.ctx
			if kind == "canceled" {
				x.refreshStarted, x.refreshRelease = make(chan struct{}), make(chan struct{})
				var cancel context.CancelFunc
				ctx, cancel = context.WithCancel(ctx)
				defer cancel()
				go func() { <-x.refreshStarted; cancel() }()
			}
			if _, err := x.flow.currentTokens(ctx); !errors.Is(err, ErrReconnectRequired) {
				t.Fatalf("got %v", err)
			}
			if _, err := x.store.Load(x.ctx, x.flow.cfg.Binding); !errors.Is(err, ErrNotConnected) {
				t.Fatal("uncertain rotating token retained")
			}
			if _, err := x.flow.currentTokens(x.ctx); !errors.Is(err, ErrNotConnected) || x.refreshCalls.Load() != 1 {
				t.Fatal("failed exchange retried")
			}
		})
	}
}

func TestLifecycleDisconnectWaitsForRefreshAndCancelsConsent(t *testing.T) {
	x := newFlowFixture(t, "none")
	expiredConnection(t, x)
	u, cookie := x.start(t)
	callback := x.approve(t, u)
	x.refreshStarted, x.refreshRelease = make(chan struct{}), make(chan struct{})
	refreshDone := make(chan error, 1)
	go func() { _, err := x.flow.currentTokens(x.ctx); refreshDone <- err }()
	select {
	case <-x.refreshStarted:
	case <-time.After(5 * time.Second):
		t.Fatal("refresh did not start")
	}
	disconnected := make(chan error, 1)
	go func() { disconnected <- x.flow.DisconnectConnection(x.ctx) }()
	close(x.refreshRelease)
	if err := <-refreshDone; err != nil {
		t.Fatal(err)
	}
	if err := <-disconnected; err != nil {
		t.Fatal(err)
	}
	if _, err := x.store.Load(x.ctx, x.flow.cfg.Binding); !errors.Is(err, ErrNotConnected) {
		t.Fatal("refresh resurrected disconnected credentials")
	}
	if w := x.callback(x.ctx, callback, cookie); w.Code != 400 {
		t.Fatal("old pending consent restored disconnected account")
	}
}

func TestLifecycleRuntimeRefreshAndReconnectInvalidateOldTools(t *testing.T) {
	x := newFlowFixture(t, "none")
	backend := &personalMCP{}
	x.mcpHandler = backend
	tokens := expiredConnection(t, x)
	tokens.ExpiresAt = time.Now().Add(time.Hour)
	if err := x.store.Save(x.ctx, x.flow.cfg.Binding, tokens); err != nil {
		t.Fatal(err)
	}
	source, err := x.flow.ToolSource()
	if err != nil {
		t.Fatal(err)
	}
	source.httpc.Transport = x.server.Client().Transport
	defer source.CloseIdleConnections()
	tools, err := source.Tools(x.ctx)
	if err != nil {
		t.Fatal(err)
	}
	// Simulate expiry without changing the connection generation.
	tokens.ExpiresAt = time.Now().Add(-time.Minute)
	if err := x.store.Save(x.ctx, x.flow.cfg.Binding, tokens); err != nil {
		t.Fatal(err)
	}
	if _, err := tools[0].Call(x.ctx, nil); err != nil || x.refreshCalls.Load() != 1 {
		t.Fatalf("runtime refresh failed: %v", err)
	}
	u, cookie := x.start(t)
	if w := x.callback(x.ctx, x.approve(t, u), cookie); w.Code != 200 {
		t.Fatal("reconnect failed")
	}
	before := backend.requests.Load()
	if _, err := tools[0].Call(x.ctx, nil); !errors.Is(err, ErrConnectionChanged) || backend.requests.Load() != before {
		t.Fatal("old session survived reconnect")
	}
	fresh, err := source.Tools(x.ctx)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := fresh[0].Call(x.ctx, nil); err != nil {
		t.Fatal(err)
	}
	if err := x.flow.DisconnectConnection(x.ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := fresh[0].Call(x.ctx, nil); !errors.Is(err, ErrNotConnected) {
		t.Fatal("disconnected tool remained usable")
	}
}

func TestLifecycleDisconnectHTTPRequiresIdentityAndOrigin(t *testing.T) {
	for _, kind := range []string{"get", "anonymous", "foreign origin", "valid"} {
		t.Run(kind, func(t *testing.T) {
			x := newFlowFixture(t, "none")
			expiredConnection(t, x)
			req := httptest.NewRequest(http.MethodPost, "https://app.example/disconnect?user=victim", strings.NewReader(`{"user":"victim"}`)).WithContext(x.ctx)
			req.Header.Set("Origin", "https://app.example")
			switch kind {
			case "get":
				req.Method = http.MethodGet
			case "anonymous":
				req = req.WithContext(context.Background())
			case "foreign origin":
				req.Header.Set("Origin", "https://evil.example")
			}
			w := httptest.NewRecorder()
			x.flow.Disconnect(w, req)
			_, err := x.store.Load(x.ctx, x.flow.cfg.Binding)
			if kind == "valid" {
				if w.Code != 204 || !errors.Is(err, ErrNotConnected) {
					t.Fatal("disconnect did not remove own connection")
				}
			} else if w.Code < 400 || err != nil {
				t.Fatal("untrusted disconnect changed credentials")
			}
		})
	}
}

func TestLifecycleLockHonorsCancellation(t *testing.T) {
	x := newFlowFixture(t, "none")
	unlock, err := x.flow.lockConnection(x.ctx)
	if err != nil {
		t.Fatal(err)
	}
	defer unlock()
	ctx, cancel := context.WithCancel(x.ctx)
	cancel()
	if _, err := x.flow.currentTokens(ctx); !errors.Is(err, context.Canceled) {
		t.Fatal("canceled lock acquisition blocked")
	}
}

type brokenLifecycleStore struct{ Store }

func (brokenLifecycleStore) Save(context.Context, Binding, Tokens) error {
	return errors.New("secret disk detail")
}
func (brokenLifecycleStore) Delete(context.Context, Binding) error {
	return errors.New("secret disk detail")
}

func TestLifecycleStorageCleanupFailureBlocksFurtherRefresh(t *testing.T) {
	x := newFlowFixture(t, "none")
	expiredConnection(t, x)
	x.flow.store = brokenLifecycleStore{x.store}
	if _, err := x.flow.currentTokens(x.ctx); err == nil || strings.Contains(err.Error(), "secret") {
		t.Fatal("cleanup failure was hidden or leaked")
	}
	if _, err := x.flow.currentTokens(x.ctx); !errors.Is(err, ErrReconnectRequired) || x.refreshCalls.Load() != 1 {
		t.Fatal("uncertain rotating token was retried after storage failure")
	}
	x.flow.store = x.store
	if err := x.flow.DisconnectConnection(x.ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := x.flow.currentTokens(x.ctx); !errors.Is(err, ErrNotConnected) {
		t.Fatal("successful disconnect did not clear the block")
	}
}

func TestLifecycleDisconnectWaitsForCallback(t *testing.T) {
	x := newFlowFixture(t, "none")
	u, cookie := x.start(t)
	callback := x.approve(t, u)
	x.authorizationStarted, x.authorizationRelease = make(chan struct{}), make(chan struct{})
	finished := make(chan int, 1)
	go func() { finished <- x.callback(x.ctx, callback, cookie).Code }()
	select {
	case <-x.authorizationStarted:
	case <-time.After(5 * time.Second):
		t.Fatal("callback did not reach exchange")
	}
	disconnected := make(chan error, 1)
	go func() { disconnected <- x.flow.DisconnectConnection(x.ctx) }()
	close(x.authorizationRelease)
	if status := <-finished; status != http.StatusOK {
		t.Fatalf("callback status %d", status)
	}
	if err := <-disconnected; err != nil {
		t.Fatal(err)
	}
	if _, err := x.store.Load(x.ctx, x.flow.cfg.Binding); !errors.Is(err, ErrNotConnected) {
		t.Fatal("callback resurrected disconnected credentials")
	}
}

func TestLifecycleReconnectSameTokenStillInvalidatesSession(t *testing.T) {
	x := newFlowFixture(t, "none")
	x.mcpHandler = &personalMCP{}
	u, cookie := x.start(t)
	if w := x.callback(x.ctx, x.approve(t, u), cookie); w.Code != http.StatusOK {
		t.Fatal("initial consent failed")
	}
	source, err := x.flow.ToolSource()
	if err != nil {
		t.Fatal(err)
	}
	source.httpc.Transport = x.server.Client().Transport
	defer source.CloseIdleConnections()
	tools, err := source.Tools(x.ctx)
	if err != nil {
		t.Fatal(err)
	}
	u, cookie = x.start(t)
	if w := x.callback(x.ctx, x.approve(t, u), cookie); w.Code != http.StatusOK {
		t.Fatal("reconnect failed")
	}
	if _, err := tools[0].Call(x.ctx, nil); !errors.Is(err, ErrConnectionChanged) {
		t.Fatal("same token let an old session survive reconnect")
	}
}
