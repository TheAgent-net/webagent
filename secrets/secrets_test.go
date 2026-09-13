package secrets

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"testing"

	"github.com/TheAgent-net/webagent/conformance"
	"github.com/TheAgent-net/webagent/core"
)

func TestEnvProviderIsDefaultAndPrefersTenantScope(t *testing.T) {
	v, err := Registry.Get("", nil) // empty pick -> default
	if err != nil {
		t.Fatal(err)
	}
	if v.Name() != "env" {
		t.Fatalf("default secrets provider should be env, got %s", v.Name())
	}
	conformance.Secrets(t, v)

	t.Setenv("SHARED_KEY", "global-value")
	t.Setenv("ACME_CORP_SHARED_KEY", "tenant-value")

	got, err := v.Get(context.Background(), "acme corp", "SHARED_KEY")
	if err != nil {
		t.Fatal(err)
	}
	if got != "tenant-value" {
		t.Fatalf("tenant-scoped variable should win, got %q", got)
	}

	got, err = v.Get(context.Background(), "other", "SHARED_KEY")
	if err != nil {
		t.Fatal(err)
	}
	if got != "global-value" {
		t.Fatalf("expected fallback to the bare variable, got %q", got)
	}

	if _, err := v.Get(context.Background(), "", "NOT_SET_ANYWHERE"); !errors.Is(err, core.ErrSecretNotFound) {
		t.Fatalf("expected ErrSecretNotFound, got %v", err)
	}
}

func TestFileProviderIsolatesTenants(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "secrets.json")
	data := map[string]map[string]string{
		"":      {"SHARED": "default-value"},
		"acme":  {"TOKEN": "acme-token"},
		"globe": {"TOKEN": "globe-token"},
	}
	b, _ := json.Marshal(data)
	if err := os.WriteFile(path, b, 0o600); err != nil {
		t.Fatal(err)
	}

	v, err := Registry.Get("file", map[string]any{"path": path})
	if err != nil {
		t.Fatal(err)
	}
	conformance.Secrets(t, v)

	acme, err := v.Get(context.Background(), "acme", "TOKEN")
	if err != nil || acme != "acme-token" {
		t.Fatalf("acme token: %q %v", acme, err)
	}
	globe, err := v.Get(context.Background(), "globe", "TOKEN")
	if err != nil || globe != "globe-token" {
		t.Fatalf("globe token: %q %v", globe, err)
	}
	// The multi-tenant guarantee: one tenant never sees another's value.
	if acme == globe {
		t.Fatal("tenants must not share secret values")
	}
	// Deployment-wide defaults are still reachable.
	shared, err := v.Get(context.Background(), "acme", "SHARED")
	if err != nil || shared != "default-value" {
		t.Fatalf("shared default: %q %v", shared, err)
	}
	// A tenant with no entry gets not-found, never another tenant's secret.
	if _, err := v.Get(context.Background(), "stranger", "TOKEN"); !errors.Is(err, core.ErrSecretNotFound) {
		t.Fatalf("expected ErrSecretNotFound for an unknown tenant, got %v", err)
	}
}

func TestFileProviderRequiresPath(t *testing.T) {
	if _, err := Registry.Get("file", map[string]any{}); err == nil {
		t.Fatal("file provider must require a path")
	}
}

func TestStaticProvider(t *testing.T) {
	v := NewStatic(map[string]map[string]string{"acme": {"K": "v1"}})
	conformance.Secrets(t, v)
	got, err := v.Get(context.Background(), "acme", "K")
	if err != nil || got != "v1" {
		t.Fatalf("got %q %v", got, err)
	}
	v.Set("acme", "K2", "v2")
	if got, _ := v.Get(context.Background(), "acme", "K2"); got != "v2" {
		t.Fatalf("Set/Get round trip failed, got %q", got)
	}
	if _, err := v.Get(context.Background(), "nobody", "K"); !errors.Is(err, core.ErrSecretNotFound) {
		t.Fatalf("expected ErrSecretNotFound, got %v", err)
	}
}
