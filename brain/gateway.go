package brain

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/TheAgent-net/webagent/core"
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
		return &gatewayBrain{name: name, cfg: c, http: &http.Client{Timeout: 60 * time.Second}}, nil
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

	// usage is scoped to this Respond call — concurrent turns each accumulate their own, so
	// the token counts returned here can never be mixed with another turn's. It stays nil
	// until a response actually reports a usage block (nil = "not reported", not "zero").
	var usage *core.Usage
	addUsage := func(u *usageBlock) {
		if u == nil {
			return
		}
		if usage == nil {
			usage = &core.Usage{}
		}
		usage.InputTokens += u.input()
		usage.OutputTokens += u.output()
	}

	for step := 0; step < g.cfg.MaxSteps; step++ {
		reply, u, err := g.complete(ctx, msgs, tools)
		addUsage(u)
		if err != nil {
			// A failed turn keeps the partial usage its provider already billed.
			return core.AgentMessage{Usage: usage}, err
		}
		if len(reply.ToolCalls) == 0 {
			return core.AgentMessage{Text: reply.Content, Usage: usage}, nil
		}
		// record the assistant turn (carrying its tool calls), then each tool's result
		msgs = append(msgs, reply)
		for _, tc := range reply.ToolCalls {
			msgs = append(msgs, chatMessage{Role: "tool", ToolCallID: tc.ID, Content: runTool(ctx, byName, tc)})
		}
	}
	return core.AgentMessage{Text: "(stopped: reached max tool steps)", Usage: usage}, nil
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

func (g *gatewayBrain) complete(ctx context.Context, msgs []chatMessage, tools []map[string]any) (chatMessage, *usageBlock, error) {
	body := map[string]any{"model": g.cfg.Model, "messages": msgs}
	if len(tools) > 0 {
		body["tools"] = tools
	}
	buf, _ := json.Marshal(body)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, strings.TrimRight(g.cfg.BaseURL, "/")+"/chat/completions", bytes.NewReader(buf))
	if err != nil {
		return chatMessage{}, nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	if key := os.Getenv(g.cfg.APIKeyEnv); key != "" {
		req.Header.Set("Authorization", "Bearer "+key)
	}

	resp, err := g.http.Do(req)
	if err != nil {
		return chatMessage{}, nil, err
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode >= 300 {
		b, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return chatMessage{}, nil, fmt.Errorf("gateway %s: %s", resp.Status, strings.TrimSpace(string(b)))
	}
	var out struct {
		Choices []struct {
			Message chatMessage `json:"message"`
		} `json:"choices"`
		Usage *usageBlock `json:"usage"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return chatMessage{}, nil, err
	}
	if len(out.Choices) == 0 {
		// The provider may still have billed this response: report the usage alongside the
		// error rather than dropping it.
		return chatMessage{}, out.Usage, fmt.Errorf("gateway returned no choices")
	}
	return out.Choices[0].Message, out.Usage, nil
}

// usageBlock covers both spellings of the OpenAI-compatible usage object: the classic
// prompt_tokens/completion_tokens and the newer input_tokens/output_tokens.
type usageBlock struct {
	PromptTokens     int `json:"prompt_tokens"`
	CompletionTokens int `json:"completion_tokens"`
	InputTokens      int `json:"input_tokens"`
	OutputTokens     int `json:"output_tokens"`
}

func (u *usageBlock) input() int {
	if u.PromptTokens > 0 {
		return u.PromptTokens
	}
	return u.InputTokens
}

func (u *usageBlock) output() int {
	if u.CompletionTokens > 0 {
		return u.CompletionTokens
	}
	return u.OutputTokens
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
