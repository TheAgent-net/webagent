package oauth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"net/http"
	"net/netip"
	"net/url"
	"slices"
	"strings"
	"sync"
	"time"
	"unicode/utf8"

	"github.com/TheAgent-net/webagent/core"
	"github.com/TheAgent-net/webagent/internal/mcp"
)

const (
	attemptLifetime        = 5 * time.Minute
	maxAttempts            = 1024
	maxAttemptsPerIdentity = 8
)

// FlowConfig configures one preregistered OAuth client and integration. Scopes are
// an explicit operator-approved list; discovery hints never expand that list.
// TokenEndpointAuthMethod must be "none" for a public client or
// "client_secret_basic" with a host-resolved ClientSecret for a confidential client.
// RedirectURI must exactly match the registered callback: HTTPS, or HTTP with a
// literal loopback IP for local development. Query strings/fragments are unsupported.
type FlowConfig struct {
	Binding                 Binding
	RedirectURI             string
	Scopes                  []string
	TokenEndpointAuthMethod string
	ClientSecret            string
}

type authorizationAttempt struct {
	identity    core.Identity
	verifier    string
	browserHash [32]byte
	expires     time.Time
}

// Flow handles consent and code exchange for one integration. The host must mount
// Start and Callback behind the SAME authenticated browser session, attaching
// core.Identity on both requests. Each issuer needs a distinct registered callback.
// Start requires a same-origin POST; Callback accepts a query-mode GET.
// Do not log callback queries, authorization URLs, cookies, or token responses.
//
// Pending attempts are held in memory for five minutes, capped at eight per
// tenant/user and 1024 overall, and consumed once before exchange. Restarting
// requires starting consent again. Use one shared instance per integration in a
// single process. Start, ToolSource, Callback and Disconnect share lifecycle
// coordination; distributed coordination is not provided. Starting again in the
// same browser replaces that identity's previous attempt and binding cookie.
type Flow struct {
	cfg        FlowConfig
	metadata   mcp.AuthorizationMetadata
	redirect   *url.URL
	store      Store
	httpc      *http.Client
	cookieName string
	mu         sync.Mutex
	pending    map[string]authorizationAttempt
	blocked    map[string]bool // Refresh failed and storage cleanup could not complete.
	// Fixed lock stripes bound memory use while serializing connection mutations.
	lifecycle [64]chan struct{}
}

// NewFlow validates configuration and performs authorization metadata discovery.
// It never opens a browser or sends credentials during discovery. The supplied
// Store must protect tokens at rest and require verified identity.
func NewFlow(ctx context.Context, cfg FlowConfig, store Store) (*Flow, error) {
	if _, err := validateFlowConfig(cfg, store); err != nil {
		return nil, err
	}
	discovery, err := mcp.NewDiscovery(cfg.Binding.Resource, cfg.Binding.Issuer)
	if err != nil {
		return nil, err
	}
	defer discovery.CloseIdleConnections()
	metadata, err := discovery.Discover(ctx, nil)
	if err != nil {
		return nil, err
	}
	return newFlow(cfg, store, *metadata, mcp.NewAuthorizationHTTPClient())
}

func newFlow(cfg FlowConfig, store Store, metadata mcp.AuthorizationMetadata, client *http.Client) (*Flow, error) {
	redirect, err := validateFlowConfig(cfg, store)
	if err != nil {
		return nil, err
	}
	if metadata.Resource != cfg.Binding.Resource || metadata.Issuer != cfg.Binding.Issuer {
		return nil, errors.New("oauth: discovery does not match configured binding")
	}
	methods := metadata.TokenEndpointAuthMethodsSupported
	if methods == nil {
		methods = []string{"client_secret_basic"} // RFC 8414 default.
	}
	if !slices.Contains(methods, cfg.TokenEndpointAuthMethod) {
		return nil, errors.New("oauth: issuer does not support configured client authentication")
	}
	issuer, err := url.Parse(cfg.Binding.Issuer)
	if err != nil || issuer.Scheme != "https" || issuer.Hostname() == "" || issuer.User != nil || issuer.RawQuery != "" || issuer.Fragment != "" {
		return nil, errors.New("oauth: invalid issuer")
	}
	for _, raw := range []string{metadata.AuthorizationEndpoint, metadata.TokenEndpoint} {
		u, err := url.Parse(raw)
		if err != nil || u.Scheme != "https" || !strings.EqualFold(u.Hostname(), issuer.Hostname()) || httpsPort(u) != httpsPort(issuer) || u.User != nil || u.RawQuery != "" || u.ForceQuery || u.Fragment != "" || strings.Contains(raw, "#") {
			return nil, errors.New("oauth: unsupported authorization endpoint")
		}
	}
	cfg.Scopes = slices.Clone(cfg.Scopes)
	sum := sha256.Sum256([]byte(cfg.RedirectURI))
	name := "webagent_oauth_" + hex.EncodeToString(sum[:8])
	if redirect.Scheme == "https" {
		name = "__Host-" + name
	}
	f := &Flow{cfg: cfg, metadata: metadata, redirect: redirect, store: store,
		httpc: client, cookieName: name, pending: make(map[string]authorizationAttempt), blocked: make(map[string]bool)}
	for i := range f.lifecycle {
		f.lifecycle[i] = make(chan struct{}, 1)
	}
	return f, nil
}

func httpsPort(u *url.URL) string {
	if u.Port() == "" {
		return "443"
	}
	return u.Port()
}

func validateFlowConfig(cfg FlowConfig, store Store) (*url.URL, error) {
	if store == nil || strings.TrimSpace(cfg.Binding.IntegrationID) == "" || strings.TrimSpace(cfg.Binding.ClientID) == "" {
		return nil, errors.New("oauth: store, integration and registered client are required")
	}
	for _, field := range []string{cfg.Binding.IntegrationID, cfg.Binding.ClientID, cfg.Binding.Resource, cfg.Binding.Issuer} {
		if !utf8.ValidString(field) || strings.TrimSpace(field) == "" || len(field) > 4096 {
			return nil, errors.New("oauth: invalid configured connection binding")
		}
	}
	if cfg.TokenEndpointAuthMethod != "none" && cfg.TokenEndpointAuthMethod != "client_secret_basic" {
		return nil, errors.New("oauth: unsupported client authentication method")
	}
	if (cfg.TokenEndpointAuthMethod == "none" && cfg.ClientSecret != "") || (cfg.TokenEndpointAuthMethod == "client_secret_basic" && strings.TrimSpace(cfg.ClientSecret) == "") {
		return nil, errors.New("oauth: client secret does not match authentication method")
	}
	if len(cfg.Scopes) == 0 || len(strings.Join(cfg.Scopes, " ")) > 4096 {
		return nil, errors.New("oauth: explicit bounded scopes are required")
	}
	seen := map[string]bool{}
	for _, scope := range cfg.Scopes {
		if !validScope(scope) || seen[scope] {
			return nil, errors.New("oauth: invalid or duplicate configured scope")
		}
		seen[scope] = true
	}
	u, err := url.Parse(cfg.RedirectURI)
	if err != nil || len(cfg.RedirectURI) > 4096 || u.Hostname() == "" || u.User != nil || u.Path == "" || u.RawQuery != "" || u.ForceQuery || u.Fragment != "" || strings.Contains(cfg.RedirectURI, "#") {
		return nil, errors.New("oauth: invalid registered callback URL")
	}
	if u.Scheme != "https" {
		ip, err := netip.ParseAddr(u.Hostname())
		if u.Scheme != "http" || err != nil || !ip.IsLoopback() {
			return nil, errors.New("oauth: callback requires HTTPS or a literal loopback HTTP address")
		}
	}
	return u, nil
}

// CloseIdleConnections releases idle token-endpoint connections.
func (f *Flow) CloseIdleConnections() { f.httpc.CloseIdleConnections() }

func flowHeaders(w http.ResponseWriter) {
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("Referrer-Policy", "no-referrer")
	w.Header().Set("X-Content-Type-Options", "nosniff")
}

func randomValue() (string, error) {
	var raw [32]byte
	if _, err := rand.Read(raw[:]); err != nil {
		return "", errors.New("oauth: cannot generate authorization randomness")
	}
	return base64.RawURLEncoding.EncodeToString(raw[:]), nil
}

func (f *Flow) cookie(value string, age int) *http.Cookie {
	return &http.Cookie{Name: f.cookieName, Value: value, Path: "/", MaxAge: age,
		HttpOnly: true, Secure: f.redirect.Scheme == "https", SameSite: http.SameSiteLaxMode}
}

// Start begins consent after an authenticated, same-origin POST, ignoring body and
// query parameters. Requested scopes, resource, client, and callback are fixed by
// configuration. A browser form POST can follow the returned 303 redirect.
func (f *Flow) Start(w http.ResponseWriter, r *http.Request) {
	flowHeaders(w)
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		http.Error(w, "POST required", http.StatusMethodNotAllowed)
		return
	}
	if _, err := connectionKey(r.Context(), f.cfg.Binding); err != nil {
		http.Error(w, "Verified identity required", http.StatusUnauthorized)
		return
	}
	if len(r.Header.Values("Origin")) != 1 || r.Header.Get("Origin") != f.redirect.Scheme+"://"+f.redirect.Host || !strings.EqualFold(r.Host, f.redirect.Host) {
		http.Error(w, "Same-origin request required", http.StatusForbidden)
		return
	}
	// Admit consent under the same lock as callback persistence and disconnect.
	// A disconnect ordered after this Start must remove its pending attempt, even
	// when Start is still generating randomness or sending the browser redirect.
	unlock, err := f.lockConnection(r.Context())
	if err != nil {
		http.Error(w, "Connection request canceled", http.StatusRequestTimeout)
		return
	}
	defer unlock()
	state, err1 := randomValue()
	verifier, err2 := randomValue()
	browser, err3 := randomValue()
	if err1 != nil || err2 != nil || err3 != nil {
		http.Error(w, "Could not start connection", http.StatusInternalServerError)
		return
	}
	identity, _ := core.IdentityFromContext(r.Context())
	previous, cookieErr := r.Cookie(f.cookieName)
	var previousHash [32]byte
	replacePrevious := cookieErr == nil && len(previous.Value) == 43
	if replacePrevious {
		previousHash = sha256.Sum256([]byte(previous.Value))
	}
	now := time.Now()
	f.mu.Lock()
	ownedAttempts := 0
	for key, attempt := range f.pending {
		if !now.Before(attempt.expires) || (attempt.identity == identity && replacePrevious && subtle.ConstantTimeCompare(attempt.browserHash[:], previousHash[:]) == 1) {
			delete(f.pending, key)
			continue
		}
		if attempt.identity == identity {
			ownedAttempts++
		}
	}
	if ownedAttempts >= maxAttemptsPerIdentity || len(f.pending) >= maxAttempts {
		f.mu.Unlock()
		http.Error(w, "Too many pending connections", http.StatusTooManyRequests)
		return
	}
	f.pending[state] = authorizationAttempt{identity: identity, verifier: verifier, browserHash: sha256.Sum256([]byte(browser)), expires: now.Add(attemptLifetime)}
	f.mu.Unlock()
	u, _ := url.Parse(f.metadata.AuthorizationEndpoint) // Validated at construction.
	q := u.Query()
	q.Set("response_type", "code")
	q.Set("client_id", f.cfg.Binding.ClientID)
	q.Set("redirect_uri", f.cfg.RedirectURI)
	q.Set("resource", f.cfg.Binding.Resource)
	q.Set("scope", strings.Join(f.cfg.Scopes, " "))
	q.Set("state", state)
	challenge := sha256.Sum256([]byte(verifier))
	q.Set("code_challenge", base64.RawURLEncoding.EncodeToString(challenge[:]))
	q.Set("code_challenge_method", "S256")
	u.RawQuery = q.Encode()
	http.SetCookie(w, f.cookie(browser, int(attemptLifetime.Seconds())))
	http.Redirect(w, r, u.String(), http.StatusSeeOther)
}

// Callback validates and consumes a browser-bound attempt, exchanges its code once,
// and persists the tokens. Tokens and provider error details never enter the response.
// Any failure after consumption requires a new consent attempt; exchange is not retried.
func (f *Flow) Callback(w http.ResponseWriter, r *http.Request) {
	flowHeaders(w)
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		http.Error(w, "GET required", http.StatusMethodNotAllowed)
		return
	}
	if _, err := connectionKey(r.Context(), f.cfg.Binding); err != nil {
		http.Error(w, "Verified identity required", http.StatusUnauthorized)
		return
	}
	if len(r.URL.RawQuery) > 16<<10 {
		http.Error(w, "Invalid connection callback", http.StatusBadRequest)
		return
	}
	q, err := url.ParseQuery(r.URL.RawQuery)
	valid := err == nil && r.URL.EscapedPath() == f.redirect.EscapedPath() && strings.EqualFold(r.Host, f.redirect.Host)
	for _, values := range q {
		if len(values) != 1 {
			valid = false
		}
	}
	if !valid || len(q.Get("state")) != 43 || (q.Get("code") == "") == (q.Get("error") == "") || len(q.Get("code")) > 4096 {
		http.Error(w, "Invalid connection callback", http.StatusBadRequest)
		return
	}
	if (f.metadata.AuthorizationResponseIssuerSupported && q.Get("iss") == "") || (q.Has("iss") && q.Get("iss") != f.cfg.Binding.Issuer) {
		http.Error(w, "Invalid connection issuer", http.StatusBadRequest)
		return
	}
	var cookie *http.Cookie
	for _, candidate := range r.Cookies() {
		if candidate.Name == f.cookieName {
			if cookie != nil {
				http.Error(w, "Invalid connection browser", http.StatusBadRequest)
				return
			}
			cookie = candidate
		}
	}
	if cookie == nil || len(cookie.Value) != 43 {
		http.Error(w, "Invalid connection browser", http.StatusBadRequest)
		return
	}
	unlock, err := f.lockConnection(r.Context())
	if err != nil {
		http.Error(w, "Connection request canceled", http.StatusRequestTimeout)
		return
	}
	defer unlock()
	identity, _ := core.IdentityFromContext(r.Context())
	browserHash := sha256.Sum256([]byte(cookie.Value))
	f.mu.Lock()
	attempt, ok := f.pending[q.Get("state")]
	valid = ok && time.Now().Before(attempt.expires) && attempt.identity == identity && subtle.ConstantTimeCompare(attempt.browserHash[:], browserHash[:]) == 1
	if valid || (ok && !time.Now().Before(attempt.expires)) {
		delete(f.pending, q.Get("state"))
	}
	f.mu.Unlock()
	if !valid {
		http.Error(w, "Invalid or expired connection attempt", http.StatusBadRequest)
		return
	}
	http.SetCookie(w, f.cookie("", -1))
	if q.Get("error") != "" {
		http.Error(w, "Authorization was not granted", http.StatusBadRequest)
		return
	}
	tokens, err := f.exchange(r.Context(), q.Get("code"), attempt.verifier)
	if err != nil {
		http.Error(w, "Token exchange failed; start a new connection", http.StatusBadGateway)
		return
	}
	tokens.ConnectionID, err = randomValue()
	if err != nil {
		http.Error(w, "Could not save connection", http.StatusInternalServerError)
		return
	}
	if err := f.store.Save(r.Context(), f.cfg.Binding, tokens); err != nil {
		http.Error(w, "Could not save connection; start a new connection", http.StatusInternalServerError)
		return
	}
	f.setBlocked(r.Context(), false)
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	_, _ = w.Write([]byte("Account connected. You can close this window.\n"))
}
