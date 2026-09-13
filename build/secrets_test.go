package build

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/TheAgent-net/webagent/core"
	"github.com/TheAgent-net/webagent/secrets"
	"github.com/TheAgent-net/webagent/spec"
)

// A spec names secrets; the vault supplies the values at build time. Here a live Slack channel
// is configured entirely through "<name>Secret" references — no credential appears in the spec.
func TestBuildResolvesChannelSecretsFromVault(t *testing.T) {
	vault := secrets.NewStatic(map[string]map[string]string{
		"Acme": {
			"SLACK_BOT_TOKEN":      "xoxb-from-vault",
			"SLACK_SIGNING_SECRET": "signing-from-vault",
		},
	})
	s := &spec.AgentSpec{
		Name: "Acme",
		Channels: []spec.ChannelSpec{{
			Type:      "slack",
			Presenter: "text",
			Config: map[string]any{
				"addr":                ":0",
				"botTokenSecret":      "SLACK_BOT_TOKEN",
				"signingSecretSecret": "SLACK_SIGNING_SECRET",
			},
		}},
	}

	a, err := Build(context.Background(), s, WithSecrets(vault))
	if err != nil {
		t.Fatalf("build with vault-resolved secrets: %v", err)
	}
	if len(a.Bindings) != 1 || a.Bindings[0].Channel.Name() != "slack" {
		t.Fatalf("slack channel not built: %+v", a.Bindings)
	}
	// The spec itself still holds only references, never the values.
	cfg := s.Channels[0].Config
	if cfg["botTokenSecret"] != "SLACK_BOT_TOKEN" || cfg["botToken"] != nil {
		t.Fatalf("spec must keep references, not resolved values: %+v", cfg)
	}
}

// An unresolvable reference fails the build rather than silently starting a channel with no
// credential.
func TestBuildFailsOnMissingSecret(t *testing.T) {
	vault := secrets.NewStatic(nil)
	s := &spec.AgentSpec{
		Name: "Acme",
		Channels: []spec.ChannelSpec{{
			Type:   "slack",
			Config: map[string]any{"botTokenSecret": "ABSENT", "signingSecretSecret": "ALSO_ABSENT"},
		}},
	}
	_, err := Build(context.Background(), s, WithSecrets(vault))
	if err == nil {
		t.Fatal("expected the build to fail when a secret cannot be resolved")
	}
	if !strings.Contains(err.Error(), "ABSENT") {
		t.Fatalf("error should name the missing secret, got %v", err)
	}
}

// A secret reference must name a key (a non-empty string).
func TestBuildRejectsMalformedSecretReference(t *testing.T) {
	s := &spec.AgentSpec{
		Name:     "Acme",
		Model:    spec.ComponentSpec{Type: "echo", Config: map[string]any{"apiKeySecret": 42}},
		Channels: []spec.ChannelSpec{{Type: "web"}},
	}
	if _, err := Build(context.Background(), s, WithSecrets(secrets.NewStatic(nil))); err == nil {
		t.Fatal("expected an error for a non-string secret reference")
	}
}

func TestBuildResolvesModelAndActionSecretsFromVault(t *testing.T) {
	vault := secrets.NewStatic(map[string]map[string]string{
		"Acme": {
			"OPENROUTER_KEY": "sk-or-vault-secret",
			"MCP_KEY":        "mcp-vault-secret",
		},
	})

	mcpAuth := ""
	mcpSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mcpAuth = r.Header.Get("Authorization")
		w.Header().Set("Content-Type", "application/json")
		var req struct {
			ID     any    `json:"id"`
			Method string `json:"method"`
		}
		_ = json.NewDecoder(r.Body).Decode(&req)
		if req.Method == "initialize" {
			_ = json.NewEncoder(w).Encode(map[string]any{
				"jsonrpc": "2.0", "id": req.ID,
				"result": map[string]any{"protocolVersion": "2025-06-18", "capabilities": map[string]any{}},
			})
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"jsonrpc": "2.0", "id": req.ID,
			"result": map[string]any{"tools": []any{}},
		})
	}))
	defer mcpSrv.Close()

	brainAuth := ""
	brainSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		brainAuth = r.Header.Get("Authorization")
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"choices": []map[string]any{{"message": map[string]any{"role": "assistant", "content": "hello"}}},
		})
	}))
	defer brainSrv.Close()

	s := &spec.AgentSpec{
		Name: "Acme",
		Model: spec.ComponentSpec{
			Type: "gateway",
			Config: map[string]any{
				"baseUrl":      brainSrv.URL,
				"model":        "test-model",
				"apiKeySecret": "OPENROUTER_KEY",
			},
		},
		Action: spec.ActionSpec{
			Provider: "mcp",
			MCPURL:   mcpSrv.URL,
			Config: map[string]any{
				"apiKeySecret": "MCP_KEY",
			},
		},
		Channels: []spec.ChannelSpec{{Type: "web"}},
	}

	a, err := Build(context.Background(), s, WithSecrets(vault))
	if err != nil {
		t.Fatalf("Build failed: %v", err)
	}

	if mcpAuth != "Bearer mcp-vault-secret" {
		t.Errorf("expected MCP Authorization 'Bearer mcp-vault-secret', got %q", mcpAuth)
	}

	_, err = a.Brain.Respond(context.Background(), core.BrainInput{Text: "hi"})
	if err != nil {
		t.Fatalf("Brain.Respond: %v", err)
	}

	if brainAuth != "Bearer sk-or-vault-secret" {
		t.Errorf("expected Brain Authorization 'Bearer sk-or-vault-secret', got %q", brainAuth)
	}
}
