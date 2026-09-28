package oauth

import (
	"context"
	"crypto/sha256"
	"errors"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/TheAgent-net/webagent/core"
)

// ErrReconnectRequired means consent must be repeated. Refresh failures discard
// the local connection: the issuer may already have consumed a rotating token, so
// retrying an ambiguous exchange with the old token is unsafe.
var ErrReconnectRequired = errors.New("oauth: reconnect this account")

func (f *Flow) lockConnection(ctx context.Context) (func(), error) {
	key, err := connectionKey(ctx, f.cfg.Binding)
	if err != nil {
		return nil, err
	}
	hash := sha256.Sum256(key)
	lock := f.lifecycle[int(hash[0])%len(f.lifecycle)]
	select {
	case lock <- struct{}{}:
		if err := ctx.Err(); err != nil {
			<-lock
			return nil, err
		}
		return func() { <-lock }, nil
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}

// ToolSource returns a runtime source sharing this Flow's refresh, reconnect, and
// disconnect coordination. Share one Flow per binding/store in a single process,
// and do not write directly to the Store while the flow is serving requests.
// The host owns this source's lifetime and must close its idle connections.
func (f *Flow) ToolSource() (*MCPToolSource, error) {
	source, err := NewMCPToolSource(f.cfg.Binding, f.store)
	if err != nil {
		return nil, err
	}
	source.flow = f
	return source, nil
}

func (f *Flow) currentTokens(ctx context.Context) (Tokens, error) {
	unlock, err := f.lockConnection(ctx)
	if err != nil {
		return Tokens{}, err
	}
	defer unlock()
	key, _ := connectionKey(ctx, f.cfg.Binding)
	f.mu.Lock()
	blocked := f.blocked[string(key)]
	f.mu.Unlock()
	if blocked {
		return Tokens{}, ErrReconnectRequired
	}
	tokens, err := f.store.Load(ctx, f.cfg.Binding)
	if err != nil {
		return Tokens{}, err
	}
	if tokens.ConnectionID == "" {
		tokens.ConnectionID, err = randomValue()
		if err != nil {
			return Tokens{}, err
		}
		if err := f.store.Save(ctx, f.cfg.Binding, tokens); err != nil {
			return Tokens{}, err
		}
	}
	if tokens.ExpiresAt.IsZero() || time.Now().Add(30*time.Second).Before(tokens.ExpiresAt) {
		return tokens, nil
	}
	if tokens.RefreshToken == "" {
		if time.Now().Before(tokens.ExpiresAt) {
			return tokens, nil
		}
		return Tokens{}, ErrReconnectRequired
	}
	refreshed, err := f.requestTokens(ctx, url.Values{
		"grant_type": {"refresh_token"}, "refresh_token": {tokens.RefreshToken},
		"resource": {f.cfg.Binding.Resource},
	}, tokens.Scopes)
	if err == nil {
		refreshed.ConnectionID = tokens.ConnectionID
		if refreshed.RefreshToken == "" {
			refreshed.RefreshToken = tokens.RefreshToken
		}
		err = f.store.Save(ctx, f.cfg.Binding, refreshed)
	}
	if err != nil {
		// The remote token may have rotated even on timeout or local save failure.
		// Cleanup must outlive cancellation of the requesting browser/tool, but is
		// bounded and retains the identity. Never report the old token as usable.
		cleanup, cancel := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
		defer cancel()
		if deleteErr := f.store.Delete(cleanup, f.cfg.Binding); deleteErr != nil {
			f.setBlocked(cleanup, true)
			return Tokens{}, errors.New("oauth: refresh failed and connection cleanup failed")
		}
		return Tokens{}, ErrReconnectRequired
	}
	return refreshed, nil
}

func (f *Flow) setBlocked(ctx context.Context, blocked bool) {
	key, err := connectionKey(context.WithoutCancel(ctx), f.cfg.Binding)
	if err != nil {
		return
	}
	f.mu.Lock()
	defer f.mu.Unlock()
	if blocked {
		f.blocked[string(key)] = true
	} else {
		delete(f.blocked, string(key))
	}
}

// DisconnectConnection deletes local credentials and cancels outstanding consent
// attempts for this identity. It waits for admitted Start, refresh and callback
// operations to finish, so they cannot restore the record after a successful
// disconnect. Already-sent MCP calls may finish. This is local disconnect, not
// issuer-side token revocation.
func (f *Flow) DisconnectConnection(ctx context.Context) error {
	unlock, err := f.lockConnection(ctx)
	if err != nil {
		return err
	}
	defer unlock()
	if err := f.store.Delete(ctx, f.cfg.Binding); err != nil {
		return errors.New("oauth: could not remove connection")
	}
	f.setBlocked(ctx, false)
	identity, _ := core.IdentityFromContext(ctx)
	f.mu.Lock()
	for state, attempt := range f.pending {
		if attempt.identity == identity {
			delete(f.pending, state)
		}
	}
	f.mu.Unlock()
	return nil
}

// Disconnect is an authenticated same-origin POST handler. It returns 204 after
// deleting the local connection; body/query parameters cannot select another user.
func (f *Flow) Disconnect(w http.ResponseWriter, r *http.Request) {
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
	if err := f.DisconnectConnection(r.Context()); err != nil {
		http.Error(w, "Could not disconnect account", http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, f.cookie("", -1))
	w.WriteHeader(http.StatusNoContent)
}
