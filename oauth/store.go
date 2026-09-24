// Package oauth provides consent handlers and encrypted storage for user-authorized
// MCP connections. The embedding host authenticates requests and attaches core.Identity.
// Flow coordinates refresh/reconnect/disconnect within one process and supplies
// personal MCP tools through the optional core.ToolSource interface.
package oauth

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/TheAgent-net/webagent/core"
)

var (
	// ErrIdentityRequired means the host did not attach a verified identity.
	ErrIdentityRequired = errors.New("oauth: verified identity required")
	// ErrNotConnected means no record exists for this identity and binding.
	ErrNotConnected = errors.New("oauth: connection not found")
	// ErrInvalidRecord means stored data is malformed or could not be authenticated.
	// A wrong encryption key also produces this error; it must not be treated as absence.
	ErrInvalidRecord = errors.New("oauth: invalid encrypted connection")
)

// Binding identifies an operator-configured integration and its authorization setup.
// Every field participates in the storage key; changing any field requires a separate
// connection. Values must come from trusted configuration and validated discovery,
// never tool arguments or an arbitrary request. This type performs no URL discovery.
type Binding struct {
	IntegrationID string
	Resource      string
	Issuer        string
	ClientID      string
}

// Tokens contains credentials from a validated Bearer token response. ExpiresAt is
// zero when the expiry is unknown; Scopes contains granted scopes, not discovery
// hints. Load does not refresh tokens or establish that they are still usable.
// AccessToken and RefreshToken are secrets and must not be logged or sent to a model.
type Tokens struct {
	// ConnectionID changes on consent/reconnect and survives refresh. It prevents
	// an old tool/session being reused after the external account is replaced.
	ConnectionID string    `json:"connection_id,omitempty"`
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token,omitempty"`
	ExpiresAt    time.Time `json:"expires_at"`
	Scopes       []string  `json:"scopes,omitempty"`
}

// Store persists one connection per verified identity and binding. Implementations
// must require core.Identity, isolate exact keys without tenant/user/default fallback,
// and protect credentials at rest. Save replaces the complete record; callers must
// preserve an existing refresh token when a refresh response omits a replacement.
// Delete is idempotent and removes local credentials; it does not revoke them remotely.
// Methods must be safe for concurrent use. A Load/Save sequence is not a transaction;
// refresh and disconnect coordination belongs to the connection manager.
type Store interface {
	Load(context.Context, Binding) (Tokens, error)
	Save(context.Context, Binding, Tokens) error
	Delete(context.Context, Binding) error
}

// JSON encodes fields separately, avoiding collisions from concatenating IDs with
// a delimiter. The same bytes bind the ciphertext to its owner and configuration.
func connectionKey(ctx context.Context, binding Binding) ([]byte, error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	identity, ok := core.IdentityFromContext(ctx)
	if !ok {
		return nil, ErrIdentityRequired
	}
	fields := []string{"webagent.oauth.v1", identity.TenantID, identity.UserID,
		binding.IntegrationID, binding.Resource, binding.Issuer, binding.ClientID}
	for _, field := range fields {
		if !utf8.ValidString(field) || strings.TrimSpace(field) == "" || len(field) > 4096 {
			return nil, errors.New("oauth: invalid connection identity or binding")
		}
	}
	return json.Marshal(fields)
}

func validateTokens(tokens Tokens) error {
	if strings.TrimSpace(tokens.AccessToken) == "" || !utf8.ValidString(tokens.AccessToken) || !utf8.ValidString(tokens.RefreshToken) {
		return errors.New("oauth: invalid token record")
	}
	for _, scope := range tokens.Scopes {
		if strings.TrimSpace(scope) == "" || !utf8.ValidString(scope) {
			return errors.New("oauth: invalid token scope")
		}
	}
	return nil
}
