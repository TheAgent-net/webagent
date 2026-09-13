package action

import (
	"context"
	"fmt"
	"os"

	"github.com/TheAgent-net/webagent/core"
	"github.com/TheAgent-net/webagent/internal/mcp"
	"github.com/TheAgent-net/webagent/spi"
)

func init() {
	Registry.Register(spi.Descriptor{
		Name:    "mcp",
		Summary: "connect to an MCP server (Streamable HTTP) and expose its tools to the agent",
	}, newMCP)
}

// mcpConfig is the mcp provider's config. url comes from action.mcpUrl (merged in by build) or
// config.url; apiKeyEnv names the env var holding a bearer token (the key is never in the spec).
type mcpConfig struct {
	URL       string `json:"url"`
	APIKey    string `json:"apiKey"`
	APIKeyEnv string `json:"apiKeyEnv"`
}

type mcpProvider struct{ client *mcp.Client }

func newMCP(cfg map[string]any) (Provider, error) {
	var c mcpConfig
	if err := core.Decode(cfg, &c); err != nil {
		return nil, fmt.Errorf("mcp provider config: %w", err)
	}
	if c.URL == "" {
		return nil, fmt.Errorf("mcp provider: a server url is required (set action.mcpUrl or action.config.url)")
	}
	key := c.APIKey
	if key == "" && c.APIKeyEnv != "" {
		key = os.Getenv(c.APIKeyEnv)
	}
	return &mcpProvider{client: mcp.NewClient(c.URL, key)}, nil
}

func (m *mcpProvider) Name() string { return "mcp" }

// Tools connects, lists the server's tools, and wraps each as a core.Tool (carrying its schema).
func (m *mcpProvider) Tools(ctx context.Context) ([]core.Tool, error) {
	listed, err := m.client.ListTools(ctx)
	if err != nil {
		return nil, err
	}
	tools := make([]core.Tool, 0, len(listed))
	for _, t := range listed {
		tools = append(tools, &mcpTool{client: m.client, name: t.Name, desc: t.Description, schema: t.InputSchema})
	}
	return tools, nil
}

// mcpTool adapts one MCP tool to core.Tool (+ core.ToolSchema so the model sees its arguments).
type mcpTool struct {
	client *mcp.Client
	name   string
	desc   string
	schema map[string]any
}

func (t *mcpTool) Name() string           { return t.name }
func (t *mcpTool) Description() string    { return t.desc }
func (t *mcpTool) Schema() map[string]any { return t.schema }
func (t *mcpTool) Call(ctx context.Context, args map[string]any) (map[string]any, error) {
	return t.client.CallTool(ctx, t.name, args)
}
