package oauth

import (
	"context"
	"crypto/sha256"
	"errors"
	"net/http"
	"net/url"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/TheAgent-net/webagent/core"
	"github.com/TheAgent-net/webagent/internal/mcp"
)

var (
	// ErrTokenExpired means a known token expiry has passed. Refresh is not automatic.
	ErrTokenExpired = errors.New("oauth: access token expired")
	// ErrConnectionChanged means credentials changed after this turn's tool discovery.
	// Start a new turn to get a fresh session and catalog; never replay a tool call.
	ErrConnectionChanged = errors.New("oauth: connection changed; start a new turn")
	// ErrIdentityMismatch prevents tools listed for one user being used by another.
	ErrIdentityMismatch = errors.New("oauth: tool belongs to a different identity")
	// ErrAuthorizationRequired means the MCP server rejected the supplied credentials.
	ErrAuthorizationRequired = errors.New("oauth: MCP authorization required")
)

// MCPToolSource resolves one authenticated user's tools for a configured connection.
// Pass it to build.WithToolSource to retain action guardrails. Each Tools invocation
// creates a separate MCP session; neither tools nor sessions are cached across turns.
// The transport is shared, but has no cookie jar and never follows redirects.
// Tokens are reloaded before every MCP request. Sources obtained from Flow.ToolSource
// also coordinate refresh and local disconnect. Deleted/replaced connections fail
// closed; already-sent calls may complete. Issuer-side revocation is not implemented.
type MCPToolSource struct {
	binding Binding
	store   Store
	flow    *Flow
	httpc   *http.Client
}

var _ core.ToolSource = (*MCPToolSource)(nil)

// NewMCPToolSource configures runtime access to the same binding/store used by Flow.
// URLs and IDs must come from approved host configuration, never model arguments.
// Resource/issuer must be absolute HTTPS URLs. Public destination checks happen
// when requests are sent. Construction does not load credentials or contact MCP.
// This constructor does not refresh tokens; prefer Flow.ToolSource for managed use.
func NewMCPToolSource(binding Binding, store Store) (*MCPToolSource, error) {
	if store == nil {
		return nil, errors.New("oauth: connection store required")
	}
	for _, field := range []string{binding.IntegrationID, binding.Resource, binding.Issuer, binding.ClientID} {
		if !utf8.ValidString(field) || strings.TrimSpace(field) == "" || len(field) > 4096 {
			return nil, errors.New("oauth: invalid connection binding")
		}
	}
	for _, raw := range []string{binding.Resource, binding.Issuer} {
		u, err := url.Parse(raw)
		if err != nil || u.Scheme != "https" || u.Hostname() == "" || u.User != nil || u.Fragment != "" || strings.Contains(raw, "#") || u.Opaque != "" {
			return nil, errors.New("oauth: connection URLs must be absolute HTTPS URLs")
		}
	}
	client := mcp.NewAuthorizationHTTPClient()
	client.Timeout = 60 * time.Second
	return &MCPToolSource{binding: binding, store: store, httpc: client}, nil
}

// CloseIdleConnections releases the source's idle HTTP connections at host shutdown.
func (s *MCPToolSource) CloseIdleConnections() { s.httpc.CloseIdleConnections() }

func (s *MCPToolSource) token(ctx context.Context, owner core.Identity) (Tokens, error) {
	if err := ctx.Err(); err != nil {
		return Tokens{}, err
	}
	identity, ok := core.IdentityFromContext(ctx)
	if !ok {
		return Tokens{}, ErrIdentityRequired
	}
	if identity != owner {
		return Tokens{}, ErrIdentityMismatch
	}
	var tokens Tokens
	var err error
	if s.flow != nil {
		tokens, err = s.flow.currentTokens(ctx)
	} else {
		tokens, err = s.store.Load(ctx, s.binding)
	}
	if err != nil {
		for _, known := range []error{ErrReconnectRequired, ErrNotConnected, ErrIdentityRequired, ErrInvalidRecord, context.Canceled, context.DeadlineExceeded} {
			if errors.Is(err, known) {
				return Tokens{}, known
			}
		}
		return Tokens{}, errors.New("oauth: could not load connection")
	}
	if !tokens.ExpiresAt.IsZero() && !time.Now().Before(tokens.ExpiresAt) {
		return Tokens{}, ErrTokenExpired
	}
	if !validBearerToken(tokens.AccessToken) {
		return Tokens{}, ErrInvalidRecord
	}
	return tokens, nil
}

// Tools lists tools with the requesting user's connection. Missing identity or
// connection is an error; there is no fallback to static or deployment credentials.
func (s *MCPToolSource) Tools(ctx context.Context) ([]core.Tool, error) {
	owner, ok := core.IdentityFromContext(ctx)
	if !ok {
		return nil, ErrIdentityRequired
	}
	initial, err := s.token(ctx, owner)
	if err != nil {
		return nil, err
	}
	fingerprint := tokenFingerprint(initial, s.flow != nil)
	source := func(ctx context.Context) (string, error) {
		token, err := s.token(ctx, owner)
		if err != nil {
			return "", err
		}
		if tokenFingerprint(token, s.flow != nil) != fingerprint {
			return "", ErrConnectionChanged
		}
		return token.AccessToken, nil
	}
	client, err := mcp.NewClientWithTokenSourceAndHTTPClient(s.binding.Resource, source, s.httpc)
	if err != nil {
		return nil, err
	}
	listed, err := client.ListTools(ctx)
	if err != nil {
		return nil, runtimeMCPError(err)
	}
	tools := make([]core.Tool, 0, len(listed))
	names := map[string]bool{}
	for _, tool := range listed {
		if strings.TrimSpace(tool.Name) == "" || names[tool.Name] {
			return nil, errors.New("oauth: invalid MCP tool catalog")
		}
		names[tool.Name] = true
		tools = append(tools, &connectionTool{client: client, descriptor: tool})
	}
	return tools, nil
}

func tokenFingerprint(tokens Tokens, managed bool) [32]byte {
	if managed {
		// A refresh may replace the access token, but not its connection or grants.
		return sha256.Sum256([]byte(tokens.ConnectionID + "\x00" + strings.Join(tokens.Scopes, "\x00")))
	}
	return sha256.Sum256([]byte(tokens.AccessToken))
}

type connectionTool struct {
	client     *mcp.Client
	descriptor mcp.Tool
}

func (t *connectionTool) Name() string           { return t.descriptor.Name }
func (t *connectionTool) Description() string    { return t.descriptor.Description }
func (t *connectionTool) Schema() map[string]any { return t.descriptor.InputSchema }
func (t *connectionTool) Call(ctx context.Context, args map[string]any) (map[string]any, error) {
	result, err := t.client.CallTool(ctx, t.descriptor.Name, args)
	if err != nil {
		return nil, runtimeMCPError(err)
	}
	return result, nil
}

// Do not surface raw provider/transport errors to the model or observer. OAuth
// state errors remain actionable without exposing tokens or authentication headers.
func runtimeMCPError(err error) error {
	for _, known := range []error{ErrReconnectRequired, ErrIdentityRequired, ErrIdentityMismatch, ErrNotConnected, ErrInvalidRecord, ErrTokenExpired, ErrConnectionChanged, context.Canceled, context.DeadlineExceeded} {
		if errors.Is(err, known) {
			return known
		}
	}
	var response *mcp.HTTPError
	if errors.As(err, &response) && (response.StatusCode == http.StatusUnauthorized || response.StatusCode == http.StatusForbidden) {
		return ErrAuthorizationRequired
	}
	return errors.New("oauth: MCP request failed")
}
