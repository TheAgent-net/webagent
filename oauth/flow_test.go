package oauth

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/TheAgent-net/webagent/internal/mcp"
)

type flowFixture struct {
	refreshCalls         atomic.Int32
	refreshBody          string
	refreshStatus        int
	refreshStarted       chan struct{}
	refreshRelease       chan struct{}
	authorizationStarted chan struct{}
	authorizationRelease chan struct{}
	mcpHandler           http.Handler
	flow                 *Flow
	store                *FileStore
	ctx                  context.Context
	server               *httptest.Server
	calls                atomic.Int32
	leaks                atomic.Int32
	body                 string
	status               int
	contentType          string
}

func newFlowFixture(t *testing.T, method string) *flowFixture {
	t.Helper()
	store, _, ctx, binding, _ := storeFixture(t)
	x := &flowFixture{store: store, ctx: ctx, status: 200, contentType: "application/json",
		body: `{"access_token":"access-secret","refresh_token":"refresh-secret","token_type":"Bearer","expires_in":3600,"scope":"notes:read"}`}
	var mu sync.Mutex
	codes := map[string]url.Values{}
	x.server = httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/mcp":
			if x.mcpHandler == nil {
				http.NotFound(w, r)
				return
			}
			x.mcpHandler.ServeHTTP(w, r)
		case "/authorize":
			q := r.URL.Query()
			if q.Get("response_type") != "code" || q.Get("code_challenge_method") != "S256" || len(q.Get("code_challenge")) != 43 || q.Get("scope") != "notes:read" || q.Get("resource") != x.flow.cfg.Binding.Resource || q.Get("client_id") != x.flow.cfg.Binding.ClientID || q.Get("redirect_uri") != x.flow.cfg.RedirectURI {
				t.Error("authorization parameters do not match the configured flow")
			}
			if q.Has("client_secret") || q.Has("code_verifier") {
				t.Error("secret exposed in authorization URL")
			}
			code := "code-" + q.Get("state")
			mu.Lock()
			codes[code] = q
			mu.Unlock()
			callback, _ := url.Parse(q.Get("redirect_uri"))
			callback.RawQuery = url.Values{"code": {code}, "state": {q.Get("state")}, "iss": {x.flow.cfg.Binding.Issuer}}.Encode()
			http.Redirect(w, r, callback.String(), http.StatusFound)
		case "/token":
			x.calls.Add(1)
			if err := r.ParseForm(); err != nil {
				t.Error("invalid exchange form")
			}
			if r.Form.Get("grant_type") == "refresh_token" {
				x.refreshCalls.Add(1)
				if r.Form.Get("refresh_token") != "refresh-secret" || r.Form.Get("resource") != x.flow.cfg.Binding.Resource || r.Form.Has("scope") || r.Header.Get("Cookie") != "" {
					t.Error("incorrect refresh binding or credentials")
				}
				if method == "none" && r.Form.Get("client_id") != x.flow.cfg.Binding.ClientID {
					t.Error("refresh missing client identity")
				}
				if method == "client_secret_basic" {
					user, pass, ok := r.BasicAuth()
					if !ok || user != url.QueryEscape(x.flow.cfg.Binding.ClientID) || pass != url.QueryEscape(x.flow.cfg.ClientSecret) {
						t.Error("refresh missing client authentication")
					}
				}
				if x.refreshStarted != nil {
					close(x.refreshStarted)
					select {
					case <-x.refreshRelease:
					case <-r.Context().Done():
						return
					}
				}
				w.Header().Set("Content-Type", "application/json")
				if x.refreshStatus != 0 {
					w.WriteHeader(x.refreshStatus)
				}
				body := x.refreshBody
				if body == "" {
					body = `{"access_token":"access-new","refresh_token":"rotated-refresh","token_type":"Bearer","expires_in":3600}`
				}
				_, _ = w.Write([]byte(body))
				return
			}
			mu.Lock()
			q, ok := codes[r.Form.Get("code")]
			delete(codes, r.Form.Get("code"))
			mu.Unlock()
			sum := sha256.Sum256([]byte(r.Form.Get("code_verifier")))
			if !ok || r.Method != http.MethodPost || r.Form.Get("grant_type") != "authorization_code" || len(r.Form.Get("code_verifier")) != 43 || base64.RawURLEncoding.EncodeToString(sum[:]) != q.Get("code_challenge") || r.Form.Get("redirect_uri") != q.Get("redirect_uri") || r.Form.Get("resource") != q.Get("resource") {
				t.Error("exchange failed code/PKCE/resource/redirect verification")
			}
			if r.Header.Get("Cookie") != "" {
				t.Error("browser cookie forwarded to token endpoint")
			}
			if method == "none" {
				if r.Form.Get("client_id") != x.flow.cfg.Binding.ClientID || r.Header.Get("Authorization") != "" {
					t.Error("incorrect public client authentication")
				}
			} else {
				user, pass, ok := r.BasicAuth()
				if !ok || user != url.QueryEscape(x.flow.cfg.Binding.ClientID) || pass != url.QueryEscape(x.flow.cfg.ClientSecret) || r.Form.Has("client_secret") {
					t.Error("incorrect confidential client authentication")
				}
			}
			if x.authorizationStarted != nil {
				close(x.authorizationStarted)
				select {
				case <-x.authorizationRelease:
				case <-r.Context().Done():
					return
				}
			}
			w.Header().Set("Content-Type", x.contentType)
			w.Header().Set("Location", x.server.URL+"/leak")
			w.WriteHeader(x.status)
			_, _ = w.Write([]byte(x.body))
		case "/leak":
			x.leaks.Add(1)
		default:
			http.NotFound(w, r)
		}
	}))
	t.Cleanup(x.server.Close)
	binding.Resource = x.server.URL + "/mcp"
	binding.Issuer = x.server.URL
	binding.ClientID = "client:id with spaces"
	cfg := FlowConfig{Binding: binding, RedirectURI: "https://app.example/oauth/notes/callback", Scopes: []string{"notes:read"}, TokenEndpointAuthMethod: method}
	if method == "client_secret_basic" {
		cfg.ClientSecret = "secret:with spaces"
	}
	metadata := mcp.AuthorizationMetadata{Resource: binding.Resource, Issuer: binding.Issuer,
		AuthorizationEndpoint: x.server.URL + "/authorize", TokenEndpoint: x.server.URL + "/token",
		TokenEndpointAuthMethodsSupported: []string{method}, AuthorizationResponseIssuerSupported: true,
		RequestedScope: "admin:write"} // Untrusted discovery hints must not widen consent.
	client := mcp.NewAuthorizationHTTPClient()
	// Test-only transport permits the TLS fixture. Production uses the public-IP dialer.
	client.Transport = x.server.Client().Transport
	var err error
	x.flow, err = newFlow(cfg, store, metadata, client)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(x.flow.CloseIdleConnections)
	return x
}

func (x *flowFixture) start(t *testing.T) (*url.URL, *http.Cookie) {
	t.Helper()
	req := httptest.NewRequest(http.MethodPost, "https://app.example/oauth/notes/connect?scope=admin", nil).WithContext(x.ctx)
	req.Header.Set("Origin", "https://app.example")
	w := httptest.NewRecorder()
	x.flow.Start(w, req)
	if w.Code != http.StatusSeeOther {
		t.Fatalf("start status %d", w.Code)
	}
	authorize, err := url.Parse(w.Header().Get("Location"))
	if err != nil {
		t.Fatal(err)
	}
	response := w.Result()
	defer func() { _ = response.Body.Close() }()
	cookies := response.Cookies()
	if len(cookies) != 1 || !cookies[0].HttpOnly || !cookies[0].Secure || cookies[0].SameSite != http.SameSiteLaxMode || cookies[0].Path != "/" || !strings.HasPrefix(cookies[0].Name, "__Host-") {
		t.Fatal("invalid browser-binding cookie")
	}
	return authorize, cookies[0]
}

func (x *flowFixture) approve(t *testing.T, authorize *url.URL) *url.URL {
	t.Helper()
	resp, err := x.flow.httpc.Get(authorize.String())
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != http.StatusFound {
		t.Fatal("fixture did not redirect after approval")
	}
	callback, err := url.Parse(resp.Header.Get("Location"))
	if err != nil {
		t.Fatal(err)
	}
	return callback
}

func (x *flowFixture) callback(ctx context.Context, u *url.URL, cookie *http.Cookie) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodGet, u.String(), nil).WithContext(ctx)
	if cookie != nil {
		req.AddCookie(cookie)
	}
	w := httptest.NewRecorder()
	x.flow.Callback(w, req)
	return w
}

func TestFlowConsentPersistsTokens(t *testing.T) {
	for _, method := range []string{"none", "client_secret_basic"} {
		t.Run(method, func(t *testing.T) {
			x := newFlowFixture(t, method)
			u, cookie := x.start(t)
			callback := x.approve(t, u)
			w := x.callback(x.ctx, callback, cookie)
			if w.Code != http.StatusOK || x.calls.Load() != 1 || strings.Contains(w.Body.String(), "secret") || w.Header().Get("Cache-Control") != "no-store" || w.Header().Get("Referrer-Policy") != "no-referrer" {
				t.Fatalf("callback did not complete safely: status %d", w.Code)
			}
			tokens, err := x.store.Load(x.ctx, x.flow.cfg.Binding)
			if err != nil || tokens.AccessToken != "access-secret" || tokens.RefreshToken != "refresh-secret" || len(tokens.Scopes) != 1 || !tokens.ExpiresAt.After(time.Now().Add(59*time.Minute)) {
				t.Fatalf("tokens were not saved correctly: %v", err)
			}
			if w := x.callback(x.ctx, callback, cookie); w.Code != http.StatusBadRequest || x.calls.Load() != 1 {
				t.Fatal("callback replay performed another exchange")
			}
		})
	}
}

func TestFlowRejectsUnboundCallbacks(t *testing.T) {
	for _, kind := range []string{"user", "tenant", "anonymous", "cookie", "missing cookie", "state", "issuer", "missing issuer", "duplicate", "missing code", "both code and error", "path", "host", "expired"} {
		t.Run(kind, func(t *testing.T) {
			x := newFlowFixture(t, "none")
			u, cookie := x.start(t)
			callback := x.approve(t, u)
			q := callback.Query()
			ctx := x.ctx
			switch kind {
			case "user":
				ctx = identityContext(t, "tenant-a", "other")
			case "tenant":
				ctx = identityContext(t, "other", "user-a")
			case "anonymous":
				ctx = context.Background()
			case "cookie":
				cookie.Value = strings.Repeat("x", 43)
			case "missing cookie":
				cookie = nil
			case "state":
				q.Set("state", strings.Repeat("x", 43))
			case "issuer":
				q.Set("iss", "https://evil.example")
			case "missing issuer":
				q.Del("iss")
			case "duplicate":
				q.Add("state", q.Get("state"))
			case "missing code":
				q.Del("code")
			case "both code and error":
				q.Set("error", "denied")
			case "path":
				callback.Path = "/wrong"
			case "host":
				callback.Host = "evil.example"
			case "expired":
				x.flow.mu.Lock()
				attempt := x.flow.pending[q.Get("state")]
				attempt.expires = time.Now().Add(-time.Second)
				x.flow.pending[q.Get("state")] = attempt
				x.flow.mu.Unlock()
			}
			callback.RawQuery = q.Encode()
			w := x.callback(ctx, callback, cookie)
			if w.Code < 400 || x.calls.Load() != 0 {
				t.Fatal("unbound callback reached token exchange")
			}
			if _, err := x.store.Load(x.ctx, x.flow.cfg.Binding); !errors.Is(err, ErrNotConnected) {
				t.Fatal("unbound callback saved credentials")
			}
		})
	}
}

func TestFlowDenialConsumesAttempt(t *testing.T) {
	x := newFlowFixture(t, "none")
	u, cookie := x.start(t)
	callback := x.approve(t, u)
	q := callback.Query()
	q.Del("code")
	q.Set("error", "access_denied")
	q.Set("error_description", "secret provider detail")
	callback.RawQuery = q.Encode()
	w := x.callback(x.ctx, callback, cookie)
	if w.Code != 400 || strings.Contains(w.Body.String(), "secret") || x.calls.Load() != 0 {
		t.Fatal("denial was not handled safely")
	}
	if len(x.flow.pending) != 0 {
		t.Fatal("denied attempt can be reused")
	}
}

func TestFlowUnboundRequestDoesNotConsumeValidAttempt(t *testing.T) {
	x := newFlowFixture(t, "none")
	u, cookie := x.start(t)
	callback := x.approve(t, u)
	other := identityContext(t, "tenant-a", "other-user")
	if w := x.callback(other, callback, cookie); w.Code != http.StatusBadRequest {
		t.Fatal("another user was accepted")
	}
	wrongCookie := *cookie
	wrongCookie.Value = strings.Repeat("x", 43)
	if w := x.callback(x.ctx, callback, &wrongCookie); w.Code != http.StatusBadRequest {
		t.Fatal("another browser was accepted")
	}
	if w := x.callback(x.ctx, callback, cookie); w.Code != http.StatusOK || x.calls.Load() != 1 {
		t.Fatal("unbound requests consumed the legitimate user's attempt")
	}
}

func TestFlowOptionalResponseFields(t *testing.T) {
	x := newFlowFixture(t, "client_secret_basic")
	x.body = `{"access_token":"access-secret","token_type":"bearer"}`
	metadata := x.flow.metadata
	metadata.TokenEndpointAuthMethodsSupported = nil // Defaults to basic authentication.
	metadata.AuthorizationResponseIssuerSupported = false
	f, err := newFlow(x.flow.cfg, x.store, metadata, x.flow.httpc)
	if err != nil {
		t.Fatal(err)
	}
	x.flow = f
	u, cookie := x.start(t)
	callback := x.approve(t, u)
	q := callback.Query()
	q.Del("iss")
	callback.RawQuery = q.Encode()
	if w := x.callback(x.ctx, callback, cookie); w.Code != http.StatusOK {
		t.Fatal("valid response with omitted optional fields was rejected")
	}
	tokens, err := x.store.Load(x.ctx, x.flow.cfg.Binding)
	if err != nil || !tokens.ExpiresAt.IsZero() || tokens.RefreshToken != "" || len(tokens.Scopes) != 1 || tokens.Scopes[0] != "notes:read" {
		t.Fatal("omitted response fields were interpreted incorrectly")
	}
}

func TestFlowRejectsUnsafeStart(t *testing.T) {
	for _, kind := range []string{"get", "anonymous", "no origin", "foreign origin", "foreign host", "capacity"} {
		t.Run(kind, func(t *testing.T) {
			x := newFlowFixture(t, "none")
			req := httptest.NewRequest(http.MethodPost, "https://app.example/connect", nil).WithContext(x.ctx)
			req.Header.Set("Origin", "https://app.example")
			switch kind {
			case "get":
				req.Method = http.MethodGet
			case "anonymous":
				req = req.WithContext(context.Background())
			case "no origin":
				req.Header.Del("Origin")
			case "foreign origin":
				req.Header.Set("Origin", "https://evil.example")
			case "foreign host":
				req.Host = "evil.example"
			case "capacity":
				for i := 0; i < maxAttempts; i++ {
					x.flow.pending[string(rune(i))] = authorizationAttempt{expires: time.Now().Add(time.Minute)}
				}
			}
			w := httptest.NewRecorder()
			x.flow.Start(w, req)
			if w.Code < 400 || w.Header().Get("Location") != "" {
				t.Fatal("unsafe start redirected to authorization")
			}
		})
	}
}

func TestFlowRejectsInvalidTokenResponses(t *testing.T) {
	for _, kind := range []string{"redirect", "provider error", "html", "oversized", "invalid JSON", "duplicate", "wrong type", "empty token", "header injection", "negative expiry", "overflow expiry", "scope expansion", "null scope", "null expiry"} {
		t.Run(kind, func(t *testing.T) {
			x := newFlowFixture(t, "none")
			switch kind {
			case "redirect":
				x.status = 307
			case "provider error":
				x.status = 400
				x.body = `{"error":"invalid_grant","error_description":"secret"}`
			case "html":
				x.contentType = "text/html"
			case "oversized":
				x.body = strings.Repeat("x", maxTokenBytes+1)
			case "invalid JSON":
				x.body = `{`
			case "duplicate":
				x.body = `{"access_token":"secret","ACCESS_TOKEN":"other","token_type":"Bearer"}`
			case "wrong type":
				x.body = `{"access_token":"secret","token_type":"MAC"}`
			case "empty token":
				x.body = `{"access_token":"","token_type":"Bearer"}`
			case "header injection":
				x.body = `{"access_token":"secret\r\nInjected:x","token_type":"Bearer"}`
			case "negative expiry":
				x.body = `{"access_token":"secret","token_type":"Bearer","expires_in":-1}`
			case "overflow expiry":
				x.body = `{"access_token":"secret","token_type":"Bearer","expires_in":9223372036854775807}`
			case "scope expansion":
				x.body = `{"access_token":"secret","token_type":"Bearer","scope":"admin"}`
			case "null scope":
				x.body = `{"access_token":"secret","token_type":"Bearer","scope":null}`
			case "null expiry":
				x.body = `{"access_token":"secret","token_type":"Bearer","expires_in":null}`
			}
			u, cookie := x.start(t)
			callback := x.approve(t, u)
			w := x.callback(x.ctx, callback, cookie)
			if w.Code != 502 || strings.Contains(w.Body.String(), "secret") || x.calls.Load() != 1 || x.leaks.Load() != 0 {
				t.Fatal("token failure leaked details, followed redirect, or reported success")
			}
			if _, err := x.store.Load(x.ctx, x.flow.cfg.Binding); !errors.Is(err, ErrNotConnected) {
				t.Fatal("invalid tokens persisted")
			}
			if w := x.callback(x.ctx, callback, cookie); w.Code != 400 || x.calls.Load() != 1 {
				t.Fatal("failed exchange was retried")
			}
		})
	}
}

func TestFlowConcurrentCallbackExchangesOnce(t *testing.T) {
	x := newFlowFixture(t, "none")
	u, cookie := x.start(t)
	callback := x.approve(t, u)
	results := make(chan int, 2)
	for i := 0; i < 2; i++ {
		go func() { results <- x.callback(x.ctx, callback, cookie).Code }()
	}
	a, b := <-results, <-results
	successAndReplay := (a == 200 && b == 400) || (a == 400 && b == 200)
	if !successAndReplay || x.calls.Load() != 1 {
		t.Fatal("concurrent callbacks did not consume state exactly once")
	}
}

type failingFlowStore struct{ Store }

func (failingFlowStore) Save(context.Context, Binding, Tokens) error {
	return errors.New("secret storage detail")
}

func TestFlowStorageFailureDoesNotReportConnected(t *testing.T) {
	x := newFlowFixture(t, "none")
	x.flow.store = failingFlowStore{x.store}
	u, cookie := x.start(t)
	w := x.callback(x.ctx, x.approve(t, u), cookie)
	if w.Code != 500 || strings.Contains(w.Body.String(), "secret") || len(x.flow.pending) != 0 {
		t.Fatal("storage failure reported success or leaked details")
	}
}

func TestFlowConfiguration(t *testing.T) {
	x := newFlowFixture(t, "none")
	for _, kind := range []string{"remote http", "callback query", "callback fragment", "missing scope", "invalid scope", "duplicate scope", "public secret", "missing secret", "method", "issuer mismatch", "endpoint origin", "metadata auth method"} {
		t.Run(kind, func(t *testing.T) {
			cfg, metadata := x.flow.cfg, x.flow.metadata
			switch kind {
			case "remote http":
				cfg.RedirectURI = "http://app.example/callback"
			case "callback query":
				cfg.RedirectURI += "?next=evil"
			case "callback fragment":
				cfg.RedirectURI += "#fragment"
			case "missing scope":
				cfg.Scopes = nil
			case "invalid scope":
				cfg.Scopes = []string{"notes:read admin"}
			case "duplicate scope":
				cfg.Scopes = []string{"read", "read"}
			case "public secret":
				cfg.ClientSecret = "secret"
			case "missing secret":
				cfg.TokenEndpointAuthMethod = "client_secret_basic"
			case "method":
				cfg.TokenEndpointAuthMethod = "client_secret_post"
			case "issuer mismatch":
				metadata.Issuer = "https://other.example"
			case "endpoint origin":
				metadata.TokenEndpoint = "https://other.example/token"
			case "metadata auth method":
				metadata.TokenEndpointAuthMethodsSupported = nil
			}
			if _, err := newFlow(cfg, x.store, metadata, x.flow.httpc); err == nil {
				t.Fatal("invalid configuration accepted")
			}
		})
	}
	cfg := x.flow.cfg
	cfg.RedirectURI = "http://127.0.0.1:19090/oauth/notes/callback"
	f, err := newFlow(cfg, x.store, x.flow.metadata, x.flow.httpc)
	if err != nil || f.cookie("x", 300).Secure || strings.HasPrefix(f.cookieName, "__Host-") {
		t.Fatal("loopback callback configuration failed")
	}
	// The public constructor retains discovery's protection against private servers.
	if _, err := NewFlow(context.Background(), x.flow.cfg, x.store); err == nil {
		t.Fatal("public constructor contacted a private authorization server")
	}
}
