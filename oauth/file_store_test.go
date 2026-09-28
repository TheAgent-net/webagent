package oauth

import (
	"bytes"
	"context"
	"crypto/rand"
	"errors"
	"os"
	"path/filepath"
	"reflect"
	"runtime"
	"strings"
	"testing"
	"time"

	"github.com/TheAgent-net/webagent/core"
)

func storeFixture(t *testing.T) (*FileStore, []byte, context.Context, Binding, Tokens) {
	t.Helper()
	key := make([]byte, 32)
	if _, err := rand.Read(key); err != nil {
		t.Fatal(err)
	}
	store, err := NewFileStore(t.TempDir(), key)
	if err != nil {
		t.Fatal(err)
	}
	ctx := identityContext(t, "tenant-a", "user-a")
	binding := Binding{IntegrationID: "notes", Resource: "https://notes.example/mcp", Issuer: "https://login.example", ClientID: "webagent"}
	tokens := Tokens{AccessToken: "secret-access", RefreshToken: "secret-refresh", ExpiresAt: time.Now().UTC().Truncate(time.Second), Scopes: []string{"notes:read"}}
	return store, key, ctx, binding, tokens
}

func identityContext(t *testing.T, tenant, user string) context.Context {
	t.Helper()
	ctx, err := core.WithIdentity(context.Background(), core.Identity{TenantID: tenant, UserID: user})
	if err != nil {
		t.Fatal(err)
	}
	return ctx
}

func recordPath(t *testing.T, store *FileStore, ctx context.Context, binding Binding) string {
	t.Helper()
	key, err := connectionKey(ctx, binding)
	if err != nil {
		t.Fatal(err)
	}
	return store.path(key)
}

func readRecord(t *testing.T, path string) []byte {
	t.Helper()
	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return data
}

func TestFileStoreEncryptedPersistence(t *testing.T) {
	store, key, ctx, binding, want := storeFixture(t)
	if err := store.Save(ctx, binding, want); err != nil {
		t.Fatal(err)
	}
	path := recordPath(t, store, ctx, binding)
	first := readRecord(t, path)
	for _, secret := range []string{want.AccessToken, want.RefreshToken, want.Scopes[0], "tenant-a", "user-a"} {
		if bytes.Contains(first, []byte(secret)) {
			t.Fatal("record contains plaintext credentials or identity")
		}
	}
	if err := store.Save(ctx, binding, want); err != nil {
		t.Fatal(err)
	}
	if bytes.Equal(first, readRecord(t, path)) {
		t.Fatal("repeated save reused ciphertext")
	}
	reopened, err := NewFileStore(store.dir, key)
	if err != nil {
		t.Fatal(err)
	}
	got, err := reopened.Load(ctx, binding)
	if err != nil || !reflect.DeepEqual(got, want) {
		t.Fatalf("persisted tokens did not round trip: %v", err)
	}
	got.Scopes[0] = "changed"
	again, err := reopened.Load(ctx, binding)
	if err != nil || !reflect.DeepEqual(again, want) {
		t.Fatal("modifying returned tokens changed the stored record")
	}
	entries, err := os.ReadDir(store.dir)
	if err != nil || len(entries) != 1 {
		t.Fatal("save left temporary files behind")
	}
	if runtime.GOOS != "windows" {
		for _, item := range []struct {
			path string
			mode os.FileMode
		}{{store.dir, 0700}, {path, 0600}} {
			info, err := os.Stat(item.path)
			if err != nil || info.Mode().Perm() != item.mode {
				t.Fatal("incorrect storage permissions")
			}
		}
	}
}

func TestFileStoreIsolatesEveryBindingField(t *testing.T) {
	store, _, ctx, binding, tokens := storeFixture(t)
	if err := store.Save(ctx, binding, tokens); err != nil {
		t.Fatal(err)
	}
	for _, field := range []string{"tenant", "user", "integration", "resource", "issuer", "client"} {
		t.Run(field, func(t *testing.T) {
			otherCtx, otherBinding := ctx, binding
			switch field {
			case "tenant":
				otherCtx = identityContext(t, "tenant-b", "user-a")
			case "user":
				otherCtx = identityContext(t, "tenant-a", "user-b")
			case "integration":
				otherBinding.IntegrationID += "-other"
			case "resource":
				otherBinding.Resource += "/other"
			case "issuer":
				otherBinding.Issuer += "/other"
			case "client":
				otherBinding.ClientID += "-other"
			}
			if _, err := store.Load(otherCtx, otherBinding); !errors.Is(err, ErrNotConnected) {
				t.Fatal("a different identity/binding found the original record")
			}
			if err := store.Delete(otherCtx, otherBinding); err != nil {
				t.Fatal(err)
			}
			if _, err := store.Load(ctx, binding); err != nil {
				t.Fatal("deleting another connection affected the original")
			}
			// Even copying a valid encrypted record into another slot must fail.
			data := readRecord(t, recordPath(t, store, ctx, binding))
			if err := os.WriteFile(recordPath(t, store, otherCtx, otherBinding), data, 0600); err != nil {
				t.Fatal(err)
			}
			if _, err := store.Load(otherCtx, otherBinding); !errors.Is(err, ErrInvalidRecord) {
				t.Fatal("accepted substituted ciphertext")
			}
		})
	}
}

func TestFileStoreRejectsUnauthenticatedAndCanceledOperations(t *testing.T) {
	store, _, ctx, binding, tokens := storeFixture(t)
	canceled, cancel := context.WithCancel(ctx)
	cancel()
	for _, tc := range []struct {
		name string
		ctx  context.Context
		want error
	}{{"anonymous", context.Background(), ErrIdentityRequired}, {"canceled", canceled, context.Canceled}} {
		t.Run(tc.name, func(t *testing.T) {
			if err := store.Save(tc.ctx, binding, tokens); !errors.Is(err, tc.want) {
				t.Fatalf("Save: %v", err)
			}
			if _, err := store.Load(tc.ctx, binding); !errors.Is(err, tc.want) {
				t.Fatalf("Load: %v", err)
			}
			if err := store.Delete(tc.ctx, binding); !errors.Is(err, tc.want) {
				t.Fatalf("Delete: %v", err)
			}
		})
	}
	entries, err := os.ReadDir(store.dir)
	if err != nil || len(entries) != 0 {
		t.Fatal("rejected operations changed storage")
	}
}

func TestFileStoreRejectsWrongKeyAndCorruption(t *testing.T) {
	store, key, ctx, binding, tokens := storeFixture(t)
	if err := store.Save(ctx, binding, tokens); err != nil {
		t.Fatal(err)
	}
	key[0] ^= 1
	wrong, err := NewFileStore(store.dir, key)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := wrong.Load(ctx, binding); !errors.Is(err, ErrInvalidRecord) {
		t.Fatal("wrong key did not fail closed")
	}
	// Mutating the caller's key slice must not change the original store's cipher.
	if _, err := store.Load(ctx, binding); err != nil {
		t.Fatal("store retained mutable key input")
	}
	path := recordPath(t, store, ctx, binding)
	original := readRecord(t, path)
	for _, kind := range []string{"empty", "truncated", "version", "nonce", "ciphertext", "oversized"} {
		t.Run(kind, func(t *testing.T) {
			data := bytes.Clone(original)
			switch kind {
			case "empty":
				data = nil
			case "truncated":
				data = data[:5]
			case "version":
				data[0]++
			case "nonce":
				data[1] ^= 1
			case "ciphertext":
				data[len(data)-1] ^= 1
			case "oversized":
				data = make([]byte, maxTokenBytes+100)
			}
			if err := os.WriteFile(path, data, 0600); err != nil {
				t.Fatal(err)
			}
			if _, err := store.Load(ctx, binding); !errors.Is(err, ErrInvalidRecord) {
				t.Fatal("accepted damaged record")
			}
		})
	}
}

func TestFileStoreReplaceAndDelete(t *testing.T) {
	store, _, ctx, binding, tokens := storeFixture(t)
	if err := store.Save(ctx, binding, tokens); err != nil {
		t.Fatal(err)
	}
	tokens.AccessToken = "replacement-access"
	tokens.RefreshToken = "replacement-refresh"
	if err := store.Save(ctx, binding, tokens); err != nil {
		t.Fatal(err)
	}
	got, err := store.Load(ctx, binding)
	if err != nil || !reflect.DeepEqual(got, tokens) {
		t.Fatal("replacement did not persist")
	}
	for i := 0; i < 2; i++ {
		if err := store.Delete(ctx, binding); err != nil {
			t.Fatal(err)
		}
	}
	reopened, err := NewFileStore(store.dir, bytes.Repeat([]byte{1}, 32))
	if err != nil {
		t.Fatal(err)
	}
	if _, err := reopened.Load(ctx, binding); !errors.Is(err, ErrNotConnected) {
		t.Fatal("deleted record survived reopening")
	}
}

func TestFileStoreInvalidSavePreservesRecord(t *testing.T) {
	store, _, ctx, binding, tokens := storeFixture(t)
	if err := store.Save(ctx, binding, tokens); err != nil {
		t.Fatal(err)
	}
	for _, bad := range []Tokens{{}, {AccessToken: strings.Repeat("secret", maxTokenBytes)}, {AccessToken: "secret", Scopes: []string{""}}} {
		if err := store.Save(ctx, binding, bad); err == nil || strings.Contains(err.Error(), "secret") {
			t.Fatal("invalid token record was accepted or leaked in diagnostics")
		}
		got, err := store.Load(ctx, binding)
		if err != nil || !reflect.DeepEqual(got, tokens) {
			t.Fatal("invalid save damaged existing credentials")
		}
	}
}

func TestConnectionKeyPreservesExactFields(t *testing.T) {
	_, _, _, binding, _ := storeFixture(t)
	seen := map[string]bool{}
	for _, ids := range [][2]string{{"a:b", "c"}, {"a", "b:c"}, {"A", "b:c"}, {" a ", "b:c"}, {"../a", "../../b"}} {
		key, err := connectionKey(identityContext(t, ids[0], ids[1]), binding)
		if err != nil || seen[string(key)] {
			t.Fatal("distinct identities collided")
		}
		seen[string(key)] = true
	}
	invalidBinding := binding
	invalidBinding.ClientID = string([]byte{0xff})
	if _, err := connectionKey(identityContext(t, "tenant", "user"), invalidBinding); err == nil {
		t.Fatal("invalid UTF-8 binding accepted")
	}
	if _, err := connectionKey(identityContext(t, "tenant", "user"), Binding{}); err == nil {
		t.Fatal("empty binding accepted")
	}
}

func TestFileStoreConcurrentUsers(t *testing.T) {
	store, _, _, binding, _ := storeFixture(t)
	for _, user := range []string{"one", "two", "three", "four"} {
		t.Run(user, func(t *testing.T) {
			t.Parallel()
			ctx := identityContext(t, "tenant", user)
			want := Tokens{AccessToken: "access-" + user}
			if err := store.Save(ctx, binding, want); err != nil {
				t.Fatal(err)
			}
			got, err := store.Load(ctx, binding)
			if err != nil || !reflect.DeepEqual(got, want) {
				t.Fatal("concurrent user credentials were mixed or lost")
			}
		})
	}
}

func TestFileStoreConfigurationAndFailedWrite(t *testing.T) {
	for _, size := range []int{0, 16, 24, 31, 33} {
		if _, err := NewFileStore(t.TempDir(), make([]byte, size)); err == nil {
			t.Fatal("accepted invalid key length")
		}
	}
	store, key, ctx, binding, tokens := storeFixture(t)
	if _, err := NewFileStore("", key); err == nil {
		t.Fatal("accepted empty directory")
	}
	// A regular file cannot be used as the storage directory.
	blocked := filepath.Join(t.TempDir(), "file")
	if err := os.WriteFile(blocked, []byte("x"), 0600); err != nil {
		t.Fatal(err)
	}
	if _, err := NewFileStore(blocked, key); err == nil {
		t.Fatal("accepted a file as the directory")
	}
	// Force the final rename to fail without relying on platform-specific permissions.
	if err := os.Mkdir(recordPath(t, store, ctx, binding), 0700); err != nil {
		t.Fatal(err)
	}
	if err := store.Save(ctx, binding, tokens); err == nil {
		t.Fatal("failed replacement reported success")
	}
	entries, err := os.ReadDir(store.dir)
	if err != nil || len(entries) != 1 || !entries[0].IsDir() {
		t.Fatal("failed replacement left temporary files behind")
	}
}
