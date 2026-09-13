// Package conformance is the provider certification kit. Every provider — built-in or from
// a partner company — must pass the relevant conformance function to be a certified provider
// for its slot (and to qualify as a default). A partner's adapter test calls these with a
// live instance and *testing.T; green means it honors the SPI contract.
package conformance

import (
	"context"
	"errors"
	"strings"

	"github.com/TheAgent-net/webagent/core"
)

// T is the minimal slice of *testing.T the kit needs, so callers pass *testing.T directly.
type T interface {
	Helper()
	Fatalf(format string, args ...any)
}

// Retriever asserts a Retriever honors the contract: a stable name and no error on a
// benign query.
func Retriever(t T, r core.Retriever) {
	t.Helper()
	if r.Name() == "" {
		t.Fatalf("Retriever.Name() must be non-empty")
	}
	if _, err := r.Retrieve(context.Background(), core.Query{Text: "hello"}, 3); err != nil {
		t.Fatalf("Retrieve returned error on a benign query: %v", err)
	}
}

// Memory asserts a Memory round-trips within a scope AND isolates across scopes — the
// non-negotiable multi-tenant guarantee.
func Memory(t T, m core.Memory) {
	t.Helper()
	if m.Name() == "" {
		t.Fatalf("Memory.Name() must be non-empty")
	}
	ctx := context.Background()
	alice := core.Scope{UserID: "alice"}
	bob := core.Scope{UserID: "bob"}

	if err := m.Remember(ctx, alice, []core.MemoryItem{{Text: "alice likes tea"}}); err != nil {
		t.Fatalf("Remember: %v", err)
	}
	got, err := m.Recall(ctx, alice, "tea", 5)
	if err != nil {
		t.Fatalf("Recall: %v", err)
	}
	if len(got) == 0 {
		t.Fatalf("Recall returned nothing for a just-remembered item")
	}
	other, err := m.Recall(ctx, bob, "tea", 5)
	if err != nil {
		t.Fatalf("Recall(other scope): %v", err)
	}
	for _, it := range other {
		if strings.Contains(it.Text, "alice likes tea") {
			t.Fatalf("scope isolation violated: a different user recalled alice's memory")
		}
	}
}

// Guardrail asserts a Guardrail has a stable name and allows benign input. (What each
// guardrail blocks is provider-specific and validated in the provider's own tests.)
func Guardrail(t T, g core.Guardrail) {
	t.Helper()
	if g.Name() == "" {
		t.Fatalf("Guardrail.Name() must be non-empty")
	}
	d, err := g.Inspect(context.Background(), core.GuardInput{Stage: core.StageInput, Content: "hello"})
	if err != nil || !d.Allow {
		t.Fatalf("benign input should be allowed (allow=%v err=%v)", d.Allow, err)
	}
}

// Secrets asserts a Secrets provider honors the contract: a non-empty name and returning
// core.ErrSecretNotFound when an unconfigured secret is requested.
func Secrets(t T, s core.Secrets) {
	t.Helper()
	if s.Name() == "" {
		t.Fatalf("Secrets.Name() must be non-empty")
	}
	if _, err := s.Get(context.Background(), "nonexistent_tenant", "NONEXISTENT_KEY_12345"); !errors.Is(err, core.ErrSecretNotFound) {
		t.Fatalf("expected core.ErrSecretNotFound for absent secret, got %v", err)
	}
}
