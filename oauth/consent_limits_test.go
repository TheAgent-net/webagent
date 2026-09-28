package oauth

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"sync"
	"testing"
	"time"
)

func startConsent(f *Flow, ctx context.Context, cookie *http.Cookie) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodPost, "https://app.example/connect", nil).WithContext(ctx)
	req.Header.Set("Origin", "https://app.example")
	if cookie != nil {
		req.AddCookie(cookie)
	}
	w := httptest.NewRecorder()
	f.Start(w, req)
	return w
}

func TestFlowConsentQuotaIsolatesIdentities(t *testing.T) {
	x := newFlowFixture(t, "none")
	// Deliberately drop cookies on every request, as an abusive client can do.
	for i := 0; i < maxAttempts+1; i++ {
		want := http.StatusTooManyRequests
		if i < maxAttemptsPerIdentity {
			want = http.StatusSeeOther
		}
		if w := startConsent(x.flow, x.ctx, nil); w.Code != want {
			t.Fatalf("request %d: got %d, want %d", i, w.Code, want)
		}
	}
	for _, ctx := range []context.Context{
		identityContext(t, "tenant-a", "user-b"),
		identityContext(t, "tenant-b", "user-a"),
	} {
		if w := startConsent(x.flow, ctx, nil); w.Code != http.StatusSeeOther {
			t.Fatalf("another identity lost consent capacity: %d", w.Code)
		}
	}
	if len(x.flow.pending) != maxAttemptsPerIdentity+2 {
		t.Fatal("pending capacity not bounded per tenant/user")
	}
	// Expiry releases capacity without requiring a process restart.
	for state, attempt := range x.flow.pending {
		attempt.expires = time.Now().Add(-time.Second)
		x.flow.pending[state] = attempt
	}
	if w := startConsent(x.flow, x.ctx, nil); w.Code != http.StatusSeeOther || len(x.flow.pending) != 1 {
		t.Fatal("expired attempts did not release capacity")
	}
}

func TestFlowConcurrentStartsRespectIdentityQuota(t *testing.T) {
	x := newFlowFixture(t, "none")
	const requests = 32
	statuses := make(chan int, requests)
	var wg sync.WaitGroup
	for i := 0; i < requests; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			statuses <- startConsent(x.flow, x.ctx, nil).Code
		}()
	}
	wg.Wait()
	close(statuses)
	accepted := 0
	for status := range statuses {
		switch status {
		case http.StatusSeeOther:
			accepted++
		case http.StatusTooManyRequests:
		default:
			t.Fatalf("unexpected start status: %d", status)
		}
	}
	if accepted != maxAttemptsPerIdentity || len(x.flow.pending) != accepted {
		t.Fatalf("concurrent starts bypassed quota: accepted %d", accepted)
	}
}

func TestFlowStartReplacesBrowserAttempt(t *testing.T) {
	x := newFlowFixture(t, "none")
	u, cookie := x.start(t)
	oldCallback := x.approve(t, u)
	oldCookie := cookie
	var latest *httptest.ResponseRecorder
	for i := 0; i < maxAttempts+1; i++ {
		latest = startConsent(x.flow, x.ctx, cookie)
		if latest.Code != http.StatusSeeOther {
			t.Fatalf("browser replacement exhausted consent capacity: %d", latest.Code)
		}
		response := latest.Result()
		cookie = response.Cookies()[0]
		_ = response.Body.Close()
	}
	if len(x.flow.pending) != 1 {
		t.Fatal("superseded browser attempts retained")
	}
	if w := x.callback(x.ctx, oldCallback, oldCookie); w.Code != http.StatusBadRequest || x.calls.Load() != 0 {
		t.Fatal("superseded consent performed a token exchange")
	}
	// Presenting another identity's binding cookie cannot delete its attempt.
	other := identityContext(t, "tenant-a", "user-b")
	if w := startConsent(x.flow, other, cookie); w.Code != http.StatusSeeOther || len(x.flow.pending) != 2 {
		t.Fatal("browser replacement affected another identity")
	}
	latestURL, err := url.Parse(latest.Header().Get("Location"))
	if err != nil {
		t.Fatal(err)
	}
	if w := x.callback(x.ctx, x.approve(t, latestURL), cookie); w.Code != http.StatusOK {
		t.Fatalf("latest consent failed: %d", w.Code)
	}
}

type consentRedirectWriter struct {
	*httptest.ResponseRecorder
	beforeRedirect func()
}

func (w consentRedirectWriter) WriteHeader(status int) {
	if status == http.StatusSeeOther {
		w.beforeRedirect()
	}
	w.ResponseRecorder.WriteHeader(status)
}

func TestLifecycleDisconnectWaitsForStart(t *testing.T) {
	x := newFlowFixture(t, "none")
	expiredConnection(t, x)
	req := httptest.NewRequest(http.MethodPost, "https://app.example/connect", nil).WithContext(x.ctx)
	req.Header.Set("Origin", "https://app.example")
	w := httptest.NewRecorder()
	checked := false
	x.flow.Start(consentRedirectWriter{w, func() {
		checked = true
		// Pause Start while it sends the redirect. Disconnect must wait for it,
		// even though its pending entry has already been inserted.
		ctx, cancel := context.WithTimeout(x.ctx, 20*time.Millisecond)
		defer cancel()
		if err := x.flow.DisconnectConnection(ctx); !errors.Is(err, context.DeadlineExceeded) {
			t.Fatalf("disconnect bypassed active Start: %v", err)
		}
	}}, req)
	if !checked || w.Code != http.StatusSeeOther {
		t.Fatal("Start did not reach its redirect")
	}
	if err := x.flow.DisconnectConnection(x.ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := x.store.Load(x.ctx, x.flow.cfg.Binding); !errors.Is(err, ErrNotConnected) || len(x.flow.pending) != 0 {
		t.Fatal("disconnect retained credentials or consent")
	}
	u, err := url.Parse(w.Header().Get("Location"))
	if err != nil {
		t.Fatal(err)
	}
	response := w.Result()
	defer func() { _ = response.Body.Close() }()
	if callback := x.callback(x.ctx, x.approve(t, u), response.Cookies()[0]); callback.Code != http.StatusBadRequest || x.calls.Load() != 0 {
		t.Fatal("a Start ordered before disconnect restored credentials")
	}
	// Fresh consent remains possible after a completed disconnect.
	u, cookie := x.start(t)
	if callback := x.callback(x.ctx, x.approve(t, u), cookie); callback.Code != http.StatusOK {
		t.Fatal("fresh consent after disconnect was rejected")
	}
}

func TestFlowStartLockCancellationCreatesNoAttempt(t *testing.T) {
	x := newFlowFixture(t, "none")
	unlock, err := x.flow.lockConnection(x.ctx)
	if err != nil {
		t.Fatal(err)
	}
	defer unlock()
	ctx, cancel := context.WithTimeout(x.ctx, 20*time.Millisecond)
	defer cancel()
	if w := startConsent(x.flow, ctx, nil); w.Code != http.StatusRequestTimeout || len(x.flow.pending) != 0 {
		t.Fatal("canceled Start created pending consent")
	}
}
