// Package mcp is a minimal client for the Model Context Protocol over the Streamable HTTP
// transport (spec 2025-06-18). It covers exactly what the action layer needs: initialize,
// tools/list, and tools/call. It handles both response shapes the spec allows
// (application/json and a single-response text/event-stream), session ids, and the protocol
// version header. Credentials may be static or supplied for each request. Authorization
// metadata discovery is available separately; consent, token refresh, and user connection
// management are not implemented here.
package mcp

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

const protocolVersion = "2025-06-18"

// Client talks to one MCP endpoint over Streamable HTTP.
type Client struct {
	url         string
	apiKey      string
	tokenSource TokenSource
	httpc       *http.Client

	id        int64
	mu        sync.Mutex
	initDone  bool
	sessionID string
}

// Tool is an MCP tool descriptor.
type Tool struct {
	Name        string
	Description string
	InputSchema map[string]any
}

// NewClient returns a client for the given MCP endpoint URL. apiKey, if non-empty, is sent as
// a Bearer token.
func NewClient(url, apiKey string) *Client {
	return &Client{url: url, apiKey: apiKey, httpc: &http.Client{Timeout: 60 * time.Second}}
}

// TokenSource supplies a non-empty bearer token before each MCP request, including
// initialization and notifications. It must respect ctx and be safe for concurrent calls.
// Any caching, refresh, and expiry checks belong to the source. Errors must not contain
// credentials because callers may log them.
//
// A source must remain bound to one user connection and MCP resource for the client's
// lifetime: refresh may replace that connection's token, but must not switch users.
type TokenSource func(ctx context.Context) (string, error)

// NewClientWithTokenSource creates a client that obtains credentials for each request.
// A missing source is a configuration error. An empty token or source error prevents
// the request; there is no anonymous fallback or automatic tool-call retry.
func NewClientWithTokenSource(url string, source TokenSource) (*Client, error) {
	if source == nil {
		return nil, fmt.Errorf("mcp: token source is required")
	}
	c := NewClient(url, "")
	c.tokenSource = source
	return c, nil
}

// NewClientWithTokenSourceAndHTTPClient uses a caller-owned transport. The caller
// is responsible for destination validation, redirect policy and client lifetime.
// This internal seam lets connection-scoped clients share a restricted transport
// while keeping their MCP session IDs and tool catalogs separate.
func NewClientWithTokenSourceAndHTTPClient(url string, source TokenSource, httpc *http.Client) (*Client, error) {
	if httpc == nil {
		return nil, fmt.Errorf("mcp: HTTP client is required")
	}
	c, err := NewClientWithTokenSource(url, source)
	if err != nil {
		return nil, err
	}
	c.httpc = httpc
	return c, nil
}

type rpcError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type rpcResponse struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      json.RawMessage `json:"id"`
	Result  json.RawMessage `json:"result"`
	Error   *rpcError       `json:"error"`
}

func (c *Client) nextID() int64 { return atomic.AddInt64(&c.id, 1) }

// send posts a single JSON-RPC message. id == 0 means a notification (no id, no parsed result).
func (c *Client) send(ctx context.Context, method string, params any, id int64) (json.RawMessage, http.Header, error) {
	if err := ctx.Err(); err != nil {
		return nil, nil, err
	}
	body := map[string]any{"jsonrpc": "2.0", "method": method}
	if id != 0 {
		body["id"] = id
	}
	if params != nil {
		body["params"] = params
	}
	buf, _ := json.Marshal(body)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.url, bytes.NewReader(buf))
	if err != nil {
		return nil, nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json, text/event-stream")
	token := c.apiKey
	if c.tokenSource != nil {
		token, err = c.tokenSource(ctx)
		if err != nil {
			return nil, nil, fmt.Errorf("mcp %s: obtain access token: %w", method, err)
		}
		if strings.TrimSpace(token) == "" {
			return nil, nil, fmt.Errorf("mcp %s: token source returned an empty token", method)
		}
	}
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	if c.sessionID != "" {
		req.Header.Set("Mcp-Session-Id", c.sessionID)
	}
	if c.initDone {
		req.Header.Set("MCP-Protocol-Version", protocolVersion)
	}

	resp, err := c.httpc.Do(req)
	if err != nil {
		return nil, nil, err
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, resp.Header, &HTTPError{
			Method:          method,
			StatusCode:      resp.StatusCode,
			WWWAuthenticate: append([]string(nil), resp.Header.Values("WWW-Authenticate")...),
		}
	}
	if id == 0 { // notification: any 2xx is success, nothing to parse
		return nil, resp.Header, nil
	}

	var rr rpcResponse
	if strings.HasPrefix(resp.Header.Get("Content-Type"), "text/event-stream") {
		rr, err = readSSEResponse(resp.Body)
	} else {
		err = json.NewDecoder(resp.Body).Decode(&rr)
	}
	if err != nil {
		return nil, resp.Header, fmt.Errorf("mcp %s: decode: %w", method, err)
	}
	if rr.Error != nil {
		return nil, resp.Header, fmt.Errorf("mcp %s: %s (code %d)", method, rr.Error.Message, rr.Error.Code)
	}
	return rr.Result, resp.Header, nil
}

// readSSEResponse parses a single-response SSE stream and returns the first event that decodes
// to a JSON-RPC response with a result or error.
func readSSEResponse(r io.Reader) (rpcResponse, error) {
	sc := bufio.NewScanner(r)
	sc.Buffer(make([]byte, 0, 64*1024), 4*1024*1024)
	var data strings.Builder
	flush := func() (rpcResponse, bool) {
		if data.Len() == 0 {
			return rpcResponse{}, false
		}
		var rr rpcResponse
		if err := json.Unmarshal([]byte(data.String()), &rr); err == nil && (rr.Result != nil || rr.Error != nil) {
			return rr, true
		}
		data.Reset()
		return rpcResponse{}, false
	}
	for sc.Scan() {
		line := sc.Text()
		if line == "" {
			if rr, ok := flush(); ok {
				return rr, nil
			}
			continue
		}
		if v, ok := strings.CutPrefix(line, "data:"); ok {
			data.WriteString(strings.TrimPrefix(v, " "))
		}
	}
	if rr, ok := flush(); ok {
		return rr, nil
	}
	if err := sc.Err(); err != nil {
		return rpcResponse{}, err
	}
	return rpcResponse{}, fmt.Errorf("no JSON-RPC response in SSE stream")
}

// initialize performs the MCP handshake once: initialize request, capture the session id, then
// the initialized notification.
func (c *Client) initialize(ctx context.Context) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.initDone {
		return nil
	}
	params := map[string]any{
		"protocolVersion": protocolVersion,
		"capabilities":    map[string]any{},
		"clientInfo":      map[string]any{"name": "webagent", "version": "0.2.0"},
	}
	_, hdr, err := c.send(ctx, "initialize", params, c.nextID())
	if err != nil {
		return err
	}
	if sid := hdr.Get("Mcp-Session-Id"); sid != "" {
		c.sessionID = sid
	}
	c.initDone = true // subsequent requests carry the protocol-version header
	if _, _, err := c.send(ctx, "notifications/initialized", nil, 0); err != nil {
		c.initDone = false
		c.sessionID = ""
		return err
	}
	return nil
}

// ListTools returns every tool the server exposes (following pagination).
func (c *Client) ListTools(ctx context.Context) ([]Tool, error) {
	if err := c.initialize(ctx); err != nil {
		return nil, err
	}
	var out []Tool
	cursor := ""
	for {
		params := map[string]any{}
		if cursor != "" {
			params["cursor"] = cursor
		}
		res, _, err := c.send(ctx, "tools/list", params, c.nextID())
		if err != nil {
			return nil, err
		}
		var page struct {
			Tools []struct {
				Name        string         `json:"name"`
				Description string         `json:"description"`
				InputSchema map[string]any `json:"inputSchema"`
			} `json:"tools"`
			NextCursor string `json:"nextCursor"`
		}
		if err := json.Unmarshal(res, &page); err != nil {
			return nil, fmt.Errorf("mcp tools/list: %w", err)
		}
		for _, t := range page.Tools {
			out = append(out, Tool{Name: t.Name, Description: t.Description, InputSchema: t.InputSchema})
		}
		if page.NextCursor == "" {
			break
		}
		cursor = page.NextCursor
	}
	return out, nil
}

// CallTool invokes a tool and returns the raw MCP result (content array, isError, ...).
func (c *Client) CallTool(ctx context.Context, name string, args map[string]any) (map[string]any, error) {
	if err := c.initialize(ctx); err != nil {
		return nil, err
	}
	res, _, err := c.send(ctx, "tools/call", map[string]any{"name": name, "arguments": args}, c.nextID())
	if err != nil {
		return nil, err
	}
	var out map[string]any
	if err := json.Unmarshal(res, &out); err != nil {
		return nil, fmt.Errorf("mcp tools/call: %w", err)
	}
	return out, nil
}
