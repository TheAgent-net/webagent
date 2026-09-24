package core

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
	"unicode/utf8"
)

// Identity identifies a user within a tenant, as verified by the embedding host.
// IDs must be stable and tenant-scoped; they are not display names or credentials.
// Keep tenant and user separate when using them as a connection-store key.
type Identity struct {
	TenantID string
	UserID   string
}

type identityContextKey struct{}

// WithIdentity attaches a copy of the host-verified identity to a request context.
// It does not authenticate the user. Call it only after verifying the host's session
// or credentials, never with IDs taken directly from a request body, arbitrary
// headers, Turn.ChannelUserID, or Turn.Meta. Both IDs must be nonblank; their exact
// values are preserved without trimming or case folding.
// Agent.Handle uses an opaque tenant-qualified key for legacy UserID fields and
// conversation memory; providers can read the original identifiers from this context.
func WithIdentity(ctx context.Context, identity Identity) (context.Context, error) {
	if strings.TrimSpace(identity.TenantID) == "" || strings.TrimSpace(identity.UserID) == "" || !utf8.ValidString(identity.TenantID) || !utf8.ValidString(identity.UserID) {
		return nil, errors.New("core: identity requires a tenant and user")
	}
	return context.WithValue(ctx, identityContextKey{}, identity), nil
}

// Authenticated turns expose an opaque tenant-qualified user key to legacy
// providers that only accept a single UserID. Encoding prevents delimiter collisions
// with the built-in memory provider's agent/user/session key. Providers can retrieve
// the original identifiers through IdentityFromContext when they need them.
func identityUserKey(identity Identity) string {
	data, _ := json.Marshal([]string{identity.TenantID, identity.UserID})
	return "identity:" + base64.RawURLEncoding.EncodeToString(data)
}

// IdentityFromContext returns the identity explicitly attached by the host.
// It never derives an identity from channel fields or deployment defaults.
// Operations using per-user credentials must reject a missing identity.
func IdentityFromContext(ctx context.Context) (Identity, bool) {
	identity, ok := ctx.Value(identityContextKey{}).(Identity)
	return identity, ok
}
