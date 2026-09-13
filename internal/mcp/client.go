// Package mcp is a minimal client for the Model Context Protocol over the Streamable HTTP
// transport (spec 2025-06-18). It covers exactly what the action layer needs: initialize,
// tools/list, and tools/call. It handles both response shapes the spec allows
// (application/json and a single-response text/event-stream), session ids, and the protocol
// version header. OAuth-gated servers are out of scope for this client (bearer/api-key only).
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

	"github.com/TheAgent-net/webagent/internal/backoff"
)

const protocolVersion = "2025-06-18"

// mcpRetryPolicy bounds retries of a JSON-RPC round trip: 3 attempts with 500ms-4s backoff;
// provider-supplied Retry-After hints are honored up to the 60s cap.
var mcpRetryPolicy = backoff.Policy{Attempts: 3, Base: 500 * time.Millisecond, Max: 60 * time.Second}

// Client talks to one MCP endpoint over Streamable HTTP.
type Client struct {
	url    string
	apiKey string
	httpc  *http.Client

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
//
// retryable controls whether transient failures (transport errors, 429, 5xx) are retried with
// bounded exponential backoff. Only idempotent requests may pass true — a tools/call may
// already have executed server-side when its response was lost, and this client has no way to
// know, so it never replays one. Reusing the same request id across retries lets a server that
// does implement de-duplication collapse them. Client faults (other 4xx), undecodable replies,
// and JSON-RPC application errors always fail fast.
func (c *Client) send(ctx context.Context, method string, params any, id int64, retryable bool) (json.RawMessage, http.Header, error) {
	body := map[string]any{"jsonrpc": "2.0", "method": method}
	if id != 0 {
		body["id"] = id
	}
	if params != nil {
		body["params"] = params
	}
	buf, _ := json.Marshal(body)

	var result json.RawMessage
	var hdr http.Header
	// retry wraps an error per the request's idempotency: when retries are disallowed (e.g.
	// tools/call), every failure is terminal.
	retry := func(err error) error {
		if !retryable {
			return backoff.Terminal(err)
		}
		return err
	}
	// retryRateLimit additionally honors a provider-supplied Retry-After hint (clamped by the
	// policy's Max).
	retryRateLimit := func(err error, h string) error {
		if !retryable {
			return backoff.Terminal(err)
		}
		return backoff.WithAfter(err, backoff.RetryAfterDelay(h))
	}

	err := backoff.Do(ctx, mcpRetryPolicy, func() error {
		// A fresh reader per attempt: an HTTP request consumes its body.
		req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.url, bytes.NewReader(buf))
		if err != nil {
			return backoff.Terminal(err)
		}
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Accept", "application/json, text/event-stream")
		if c.apiKey != "" {
			req.Header.Set("Authorization", "Bearer "+c.apiKey)
		}
		if c.sessionID != "" {
			req.Header.Set("Mcp-Session-Id", c.sessionID)
		}
		if c.initDone {
			req.Header.Set("MCP-Protocol-Version", protocolVersion)
		}

		resp, err := c.httpc.Do(req)
		if err != nil {
			return retry(err) // transport failure
		}
		defer func() { _ = resp.Body.Close() }()
		hdr = resp.Header.Clone()

		if id == 0 { // notification: any 2xx is success, nothing to parse
			if resp.StatusCode >= 300 {
				b, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
				err := fmt.Errorf("mcp %s: %s: %s", method, resp.Status, strings.TrimSpace(string(b)))
				if resp.StatusCode == http.StatusTooManyRequests {
					return retryRateLimit(err, resp.Header.Get("Retry-After"))
				}
				if retryableStatus(resp.StatusCode) {
					return retry(err)
				}
				return backoff.Terminal(err)
			}
			return nil
		}
		if resp.StatusCode >= 300 {
			b, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
			err := fmt.Errorf("mcp %s: %s: %s", method, resp.Status, strings.TrimSpace(string(b)))
			if resp.StatusCode == http.StatusTooManyRequests {
				return retryRateLimit(err, resp.Header.Get("Retry-After"))
			}
			if retryableStatus(resp.StatusCode) {
				return retry(err)
			}
			return backoff.Terminal(err)
		}

		var rr rpcResponse
		if strings.HasPrefix(resp.Header.Get("Content-Type"), "text/event-stream") {
			rr, err = readSSEResponse(resp.Body)
		} else {
			err = json.NewDecoder(resp.Body).Decode(&rr)
		}
		if err != nil {
			return backoff.Terminal(fmt.Errorf("mcp %s: decode: %w", method, err))
		}
		if rr.Error != nil {
			return backoff.Terminal(fmt.Errorf("mcp %s: %s (code %d)", method, rr.Error.Message, rr.Error.Code))
		}
		result = rr.Result
		return nil
	})
	if err != nil {
		return nil, hdr, err
	}
	return result, hdr, nil
}

// retryableStatus reports whether an HTTP status is worth another attempt (rate limits and
// server faults) as opposed to client faults like auth (other 4xx).
func retryableStatus(code int) bool {
	return code == http.StatusTooManyRequests || code >= 500
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
	_, hdr, err := c.send(ctx, "initialize", params, c.nextID(), true)
	if err != nil {
		return err
	}
	if sid := hdr.Get("Mcp-Session-Id"); sid != "" {
		c.sessionID = sid
	}
	c.initDone = true // subsequent requests carry the protocol-version header
	if _, _, err := c.send(ctx, "notifications/initialized", nil, 0, true); err != nil {
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
		res, _, err := c.send(ctx, "tools/list", params, c.nextID(), true)
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
	// tools/call is never retried: the server may already have executed the first attempt
	// when its response was lost, and this client cannot tell — replaying it could run a
	// side-effecting tool twice.
	res, _, err := c.send(ctx, "tools/call", map[string]any{"name": name, "arguments": args}, c.nextID(), false)
	if err != nil {
		return nil, err
	}
	var out map[string]any
	if err := json.Unmarshal(res, &out); err != nil {
		return nil, fmt.Errorf("mcp tools/call: %w", err)
	}
	return out, nil
}
