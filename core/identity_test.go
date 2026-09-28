package core_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/TheAgent-net/webagent/core"
)

func TestIdentityRequiresExplicitTenantAndUser(t *testing.T) {
	if _, ok := core.IdentityFromContext(context.Background()); ok {
		t.Fatal("anonymous context has an identity")
	}
	for _, identity := range []core.Identity{
		{}, {TenantID: "tenant"}, {UserID: "user"},
		{TenantID: " \t", UserID: "user"}, {TenantID: "tenant", UserID: "\n"},
		{TenantID: "tenant", UserID: string([]byte{0xff})},
	} {
		ctx, err := core.WithIdentity(context.Background(), identity)
		if err == nil || ctx != nil {
			t.Fatal("accepted incomplete identity")
		}
	}
}

func TestIdentityContextsRemainIndependent(t *testing.T) {
	parent := context.Background()
	for _, identity := range []core.Identity{
		{TenantID: "tenant-a", UserID: "user"},
		{TenantID: "tenant-b", UserID: "user"},
		{TenantID: "tenant-a", UserID: "other-user"},
		{TenantID: " Tenant-A ", UserID: "User"},
	} {
		t.Run(identity.TenantID+"/"+identity.UserID, func(t *testing.T) {
			t.Parallel()
			want := identity
			ctx, err := core.WithIdentity(parent, identity)
			if err != nil {
				t.Fatal(err)
			}
			identity.UserID = "changed"
			got, ok := core.IdentityFromContext(ctx)
			if !ok || got != want {
				t.Fatalf("identity = %+v, present = %v; want %+v", got, ok, want)
			}
			got.TenantID = "changed"
			if again, _ := core.IdentityFromContext(ctx); again != want {
				t.Fatal("reading the identity exposed mutable state")
			}
			if _, ok := core.IdentityFromContext(parent); ok {
				t.Fatal("identity leaked into the parent context")
			}
		})
	}
}

func TestIdentityPreservesRequestCancellation(t *testing.T) {
	deadline := time.Now().Add(time.Minute)
	parent, cancel := context.WithDeadline(context.Background(), deadline)
	defer cancel()
	ctx, err := core.WithIdentity(parent, core.Identity{TenantID: "tenant", UserID: "user"})
	if err != nil {
		t.Fatal(err)
	}
	if got, ok := ctx.Deadline(); !ok || !got.Equal(deadline) {
		t.Fatal("request deadline was lost")
	}
	cancel()
	if !errors.Is(ctx.Err(), context.Canceled) {
		t.Fatal("request cancellation was lost")
	}
}
