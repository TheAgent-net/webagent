package core

import (
	"context"
	"errors"
	"slices"
)

func (a *Agent) turnTools(ctx context.Context) ([]Tool, error) {
	if a.ToolSource == nil {
		return a.Tools, nil
	}
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	additional, err := a.ToolSource.Tools(ctx)
	if err != nil {
		return nil, err
	}
	// Never mutate the agent's shared static slice or retain another turn's tools.
	tools := slices.Concat(a.Tools, additional)
	names := make(map[string]bool, len(tools))
	for _, tool := range tools {
		if tool == nil || tool.Name() == "" || names[tool.Name()] {
			return nil, errors.New("core: invalid or duplicate per-turn tool name")
		}
		names[tool.Name()] = true
	}
	return tools, nil
}
