package mcp

import (
	"fmt"
	"net/http"
)

// HTTPError describes an unsuccessful HTTP response from an MCP endpoint. Callers
// can use errors.As to inspect StatusCode without parsing the error message:
// 401 indicates missing or invalid credentials; 403 indicates forbidden access.
// Neither status alone authorizes a refresh, consent flow, or tool-call retry.
type HTTPError struct {
	Method     string
	StatusCode int
	// WWWAuthenticate preserves each challenge header value, including multiple
	// schemes and quoted parameters. These values are untrusted server input;
	// validate them before following metadata URLs and do not log them verbatim.
	WWWAuthenticate []string
}

// Error returns the method and standard HTTP status description. Response bodies,
// challenge values, and server-supplied reason phrases are excluded because they
// may contain credentials or other sensitive data.
func (e *HTTPError) Error() string {
	return fmt.Sprintf("mcp %s: %d %s", e.Method, e.StatusCode, http.StatusText(e.StatusCode))
}
