package brain

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"strings"
	"syscall"
	"time"

	"github.com/TheAgent-net/webagent/core"
	"github.com/TheAgent-net/webagent/internal/backoff"
	"github.com/TheAgent-net/webagent/spi"
)

// gatewayBrain reasons via any OpenAI-compatible Chat Completions endpoint. Because
// OpenRouter, LiteLLM, a local vLLM, and OpenAI itself all speak this one wire format, a
// single implementation makes the framework model-agnostic — the model is just config.
// It runs a full tool-calling loop against the agent's tools.
//
// Registered under two names (see registry.go): "openrouter" (preset to OpenRouter — one
// key, 300+ models, the recommended start) and "gateway" (any endpoint, e.g. self-hosted
// LiteLLM). Both share this type; only their defaults differ.
type gatewayBrain struct {
	name string
	cfg  gatewayConfig
	http *http.Client
	// retry bounds the completion retries. Zero uses the defaults (see backoff.Policy).
	retry backoff.Policy
}

type gatewayConfig struct {
	BaseURL   string `json:"baseUrl"`   // OpenAI-compatible base, e.g. https://openrouter.ai/api/v1
	Model     string `json:"model"`     // provider/model id, e.g. "anthropic/claude-sonnet-5"
	APIKeyEnv string `json:"apiKeyEnv"` // env var holding the key (keys never live in a spec)
	MaxSteps  int    `json:"maxSteps"`  // tool-call rounds before giving up
}

// newGateway builds a constructor for one named flavor with its own default endpoint/key.
func newGateway(name, defaultBaseURL, defaultKeyEnv string) spi.Constructor[core.Brain] {
	return func(raw map[string]any) (core.Brain, error) {
		var c gatewayConfig
		if err := core.Decode(raw, &c); err != nil {
			return nil, fmt.Errorf("%s brain config: %w", name, err)
		}
		if c.BaseURL == "" {
			c.BaseURL = defaultBaseURL
		}
		if c.BaseURL == "" {
			return nil, fmt.Errorf("%s brain: baseUrl is required (your OpenAI-compatible endpoint)", name)
		}
		if c.Model == "" {
			return nil, fmt.Errorf("%s brain: model is required", name)
		}
		if c.APIKeyEnv == "" {
			c.APIKeyEnv = defaultKeyEnv
		}
		if c.MaxSteps == 0 {
			c.MaxSteps = 6
		}
		return &gatewayBrain{
			name: name, cfg: c,
			http:  &http.Client{Timeout: 60 * time.Second},
			retry: gatewayRetryPolicy,
		}, nil
	}
}

func (g *gatewayBrain) Name() string { return g.name }

// Capabilities advertises tool-calling for runtime negotiation.
func (g *gatewayBrain) Capabilities() spi.Capabilities { return spi.Capabilities{"tools": true} }

func (g *gatewayBrain) Respond(ctx context.Context, in core.BrainInput) (core.AgentMessage, error) {
	msgs := []chatMessage{
		{Role: "system", Content: systemPrompt(in)},
		{Role: "user", Content: in.Text},
	}
	tools := openAITools(in.Tools)
	byName := make(map[string]core.Tool, len(in.Tools))
	for _, t := range in.Tools {
		byName[t.Name()] = t
	}

	for step := 0; step < g.cfg.MaxSteps; step++ {
		reply, err := g.complete(ctx, msgs, tools)
		if err != nil {
			return core.AgentMessage{}, err
		}
		if len(reply.ToolCalls) == 0 {
			return core.AgentMessage{Text: reply.Content}, nil
		}
		// record the assistant turn (carrying its tool calls), then each tool's result
		msgs = append(msgs, reply)
		for _, tc := range reply.ToolCalls {
			msgs = append(msgs, chatMessage{Role: "tool", ToolCallID: tc.ID, Content: runTool(ctx, byName, tc)})
		}
	}
	return core.AgentMessage{Text: "(stopped: reached max tool steps)"}, nil
}

// --- OpenAI-compatible Chat Completions wire types ---

type chatMessage struct {
	Role       string     `json:"role"`
	Content    string     `json:"content"`
	ToolCalls  []toolCall `json:"tool_calls,omitempty"`
	ToolCallID string     `json:"tool_call_id,omitempty"`
}

type toolCall struct {
	ID       string `json:"id"`
	Type     string `json:"type"`
	Function struct {
		Name      string `json:"name"`
		Arguments string `json:"arguments"`
	} `json:"function"`
}

// gatewayRetryPolicy bounds completion retries. Retries are deliberately conservative: a
// completion is billable, so only failures that cannot duplicate it are retried — 429s (the
// provider rejected the request before processing it) and dial-time failures (the request
// never left this process). Max also caps provider-supplied Retry-After hints.
var gatewayRetryPolicy = backoff.Policy{Attempts: 3, Base: 500 * time.Millisecond, Max: 60 * time.Second}

func (g *gatewayBrain) complete(ctx context.Context, msgs []chatMessage, tools []map[string]any) (chatMessage, error) {
	body := map[string]any{"model": g.cfg.Model, "messages": msgs}
	if len(tools) > 0 {
		body["tools"] = tools
	}
	buf, _ := json.Marshal(body)
	url := strings.TrimRight(g.cfg.BaseURL, "/") + "/chat/completions"

	var reply chatMessage
	err := backoff.Do(ctx, g.retry, func() error {
		// A fresh reader per attempt: an HTTP request consumes its body.
		req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(buf))
		if err != nil {
			return backoff.Terminal(err)
		}
		req.Header.Set("Content-Type", "application/json")
		if key := os.Getenv(g.cfg.APIKeyEnv); key != "" {
			req.Header.Set("Authorization", "Bearer "+key)
		}

		resp, err := g.http.Do(req)
		if err != nil {
			if requestNeverSent(err) {
				// DNS failure or refused connection: the request never reached the provider,
				// so a retry cannot bill twice.
				return err
			}
			// Timeouts, resets, and body-read failures are ambiguous: the provider may have
			// processed and billed the completion already. Do not replay it.
			return backoff.Terminal(err)
		}
		defer func() { _ = resp.Body.Close() }()

		if resp.StatusCode == http.StatusTooManyRequests {
			b, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
			err := fmt.Errorf("gateway %s: %s", resp.Status, strings.TrimSpace(string(b)))
			// A 429 means the provider rejected the request before executing it: retrying is
			// safe. The hint is clamped by the policy.
			return backoff.WithAfter(err, backoff.RetryAfterDelay(resp.Header.Get("Retry-After")))
		}
		if resp.StatusCode >= 300 {
			// 5xx is ambiguous too: the provider may have billed the completion. Fail fast.
			b, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
			return backoff.Terminal(fmt.Errorf("gateway %s: %s", resp.Status, strings.TrimSpace(string(b))))
		}
		var out struct {
			Choices []struct {
				Message chatMessage `json:"message"`
			} `json:"choices"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
			return backoff.Terminal(err)
		}
		if len(out.Choices) == 0 {
			return backoff.Terminal(fmt.Errorf("gateway returned no choices"))
		}
		reply = out.Choices[0].Message
		return nil
	})
	if err != nil {
		return chatMessage{}, err
	}
	return reply, nil
}

// requestNeverSent reports whether a transport error definitely occurred before the request
// reached the provider — DNS resolution failures and refused connections. Anything past the
// dial (timeouts, resets, body-read failures) is ambiguous and must not be replayed, because
// the provider may have processed the request before the failure surfaced.
func requestNeverSent(err error) bool {
	var dns *net.DNSError
	if errors.As(err, &dns) {
		return true
	}
	return errors.Is(err, syscall.ECONNREFUSED)
}

func openAITools(tools []core.Tool) []map[string]any {
	out := make([]map[string]any, 0, len(tools))
	for _, t := range tools {
		desc := ""
		params := map[string]any{"type": "object", "properties": map[string]any{}}
		if d, ok := t.(core.ToolSchema); ok {
			desc = d.Description()
			if s := d.Schema(); s != nil {
				params = s
			}
		}
		out = append(out, map[string]any{
			"type": "function",
			"function": map[string]any{
				"name":        t.Name(),
				"description": desc,
				"parameters":  params,
			},
		})
	}
	return out
}

func runTool(ctx context.Context, byName map[string]core.Tool, tc toolCall) string {
	t, ok := byName[tc.Function.Name]
	if !ok {
		return fmt.Sprintf("error: unknown tool %q", tc.Function.Name)
	}
	var args map[string]any
	if strings.TrimSpace(tc.Function.Arguments) != "" {
		if err := json.Unmarshal([]byte(tc.Function.Arguments), &args); err != nil {
			return fmt.Sprintf("error: bad arguments: %v", err)
		}
	}
	res, err := t.Call(ctx, args)
	if err != nil {
		return fmt.Sprintf("error: %v", err)
	}
	b, _ := json.Marshal(res)
	return string(b)
}

func systemPrompt(in core.BrainInput) string {
	var b strings.Builder
	b.WriteString(in.Instruction)
	if len(in.Memories) > 0 {
		b.WriteString("\n\nWhat you remember about this user:")
		for _, m := range in.Memories {
			fmt.Fprintf(&b, "\n- %s", m.Text)
		}
	}
	if len(in.Candidates) > 0 {
		b.WriteString("\n\nCandidates from discovery (verify live via tools before proposing):")
		for _, c := range in.Candidates {
			fmt.Fprintf(&b, "\n- %s: %s", c.Title, c.Text)
		}
	}
	return b.String()
}
