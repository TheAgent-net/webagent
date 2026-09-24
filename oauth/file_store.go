package oauth

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io"
	"os"
	"path/filepath"
	"sync"
)

const (
	recordVersion byte = 1
	maxTokenBytes      = 64 << 10
)

// FileStore encrypts each connection in a separate file using AES-256-GCM. Use
// NewFileStore; the zero value is not usable. Share one instance per directory in
// a single process. Calls are serialized, but multiple instances/processes and
// read-modify-write sequences are not coordinated. Distributed hosts should supply
// a Store backed by their credential service instead.
//
// The directory must be owned exclusively by the host, with protected parent paths
// and OS access controls (including Windows ACLs). Unix modes alone do not secure
// Windows directories. Encryption does not protect against a compromised host, file
// deletion, or rollback to an older authentic record. Delete is not secure erasure.
// Records reveal their sizes and stable hashed identifiers, but contain no cleartext
// tokens. Rotate the key before 2^32 writes; key rotation/migration is not implemented.
type FileStore struct {
	dir  string
	aead cipher.AEAD
	mu   sync.Mutex
}

var _ Store = (*FileStore)(nil)

// NewFileStore opens or creates a directory using a 32-byte random encryption key
// supplied by the host. Keep the key in the host's secrets manager, separately from
// this directory; reuse it across restarts. Do not use a password as the key. Opening
// an existing directory does not authenticate its records; Load checks each record.
func NewFileStore(dir string, key []byte) (*FileStore, error) {
	if dir == "" || len(key) != 32 {
		return nil, errors.New("oauth: directory and 32-byte encryption key required")
	}
	abs, err := filepath.Abs(dir)
	if err != nil {
		return nil, errors.New("oauth: invalid connection directory")
	}
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, errors.New("oauth: cannot initialize encryption")
	}
	aead, err := cipher.NewGCM(block)
	if err != nil {
		return nil, errors.New("oauth: cannot initialize encryption")
	}
	if err := os.MkdirAll(abs, 0700); err != nil {
		return nil, errors.New("oauth: cannot create connection directory")
	}
	info, err := os.Lstat(abs)
	if err != nil || !info.IsDir() || info.Mode()&os.ModeSymlink != 0 {
		return nil, errors.New("oauth: connection directory must be a real directory")
	}
	if err := os.Chmod(abs, 0700); err != nil {
		return nil, errors.New("oauth: cannot protect connection directory")
	}
	return &FileStore{dir: abs, aead: aead}, nil
}

func (s *FileStore) path(key []byte) string {
	hash := sha256.Sum256(key)
	return filepath.Join(s.dir, hex.EncodeToString(hash[:])+".oauth")
}

// Load decrypts only the exact identity/binding record. Corruption, substitution,
// and wrong encryption keys are errors, never anonymous or shared-token fallback.
func (s *FileStore) Load(ctx context.Context, binding Binding) (Tokens, error) {
	key, err := connectionKey(ctx, binding)
	if err != nil {
		return Tokens{}, err
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	if err := ctx.Err(); err != nil {
		return Tokens{}, err
	}
	path := s.path(key)
	info, err := os.Lstat(path)
	if errors.Is(err, os.ErrNotExist) {
		return Tokens{}, ErrNotConnected
	}
	if err != nil {
		return Tokens{}, errors.New("oauth: cannot inspect connection record")
	}
	if !info.Mode().IsRegular() {
		return Tokens{}, ErrInvalidRecord
	}
	f, err := os.Open(path)
	if err != nil {
		return Tokens{}, errors.New("oauth: cannot read connection record")
	}
	defer func() { _ = f.Close() }()
	maxSize := 1 + s.aead.NonceSize() + maxTokenBytes + s.aead.Overhead()
	data, err := io.ReadAll(io.LimitReader(f, int64(maxSize)+1))
	if err != nil {
		return Tokens{}, errors.New("oauth: cannot read connection record")
	}
	if err := ctx.Err(); err != nil {
		return Tokens{}, err
	}
	start := 1 + s.aead.NonceSize()
	if len(data) < start+s.aead.Overhead() || len(data) > maxSize || data[0] != recordVersion {
		return Tokens{}, ErrInvalidRecord
	}
	plain, err := s.aead.Open(nil, data[1:start], data[start:], key)
	if err != nil {
		return Tokens{}, ErrInvalidRecord
	}
	var tokens Tokens
	if err := json.Unmarshal(plain, &tokens); err != nil {
		return Tokens{}, ErrInvalidRecord
	}
	if err := validateTokens(tokens); err != nil {
		return Tokens{}, ErrInvalidRecord
	}
	return tokens, nil
}

// Save encrypts the complete record before writing it. A fresh random nonce is
// generated for every write. The identity and binding are authenticated additional
// data, so moving another owner's ciphertext into this slot will not decrypt.
// A temporary file is synced and closed before rename; the old file is never
// truncated first. Rename/power-loss durability depends on the OS and filesystem;
// this implementation does not promise crash-atomic replacement on Windows.
func (s *FileStore) Save(ctx context.Context, binding Binding, tokens Tokens) error {
	key, err := connectionKey(ctx, binding)
	if err != nil {
		return err
	}
	if err := validateTokens(tokens); err != nil {
		return err
	}
	plain, err := json.Marshal(tokens)
	if err != nil || len(plain) > maxTokenBytes {
		return errors.New("oauth: invalid or oversized token record")
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	if err := ctx.Err(); err != nil {
		return err
	}
	nonce := make([]byte, s.aead.NonceSize())
	if _, err := rand.Read(nonce); err != nil {
		return errors.New("oauth: cannot generate encryption nonce")
	}
	data := append([]byte{recordVersion}, nonce...)
	data = s.aead.Seal(data, nonce, plain, key)
	f, err := os.CreateTemp(s.dir, ".oauth-*")
	if err != nil {
		return errors.New("oauth: cannot create connection record")
	}
	temp := f.Name()
	defer func() { _ = os.Remove(temp) }()
	if _, err := f.Write(data); err != nil {
		_ = f.Close()
		return errors.New("oauth: cannot write connection record")
	}
	if err := f.Sync(); err != nil {
		_ = f.Close()
		return errors.New("oauth: cannot sync connection record")
	}
	if err := f.Close(); err != nil {
		return errors.New("oauth: cannot close connection record")
	}
	if err := ctx.Err(); err != nil {
		return err
	}
	if err := os.Rename(temp, s.path(key)); err != nil {
		return errors.New("oauth: cannot replace connection record")
	}
	return nil
}

// Delete removes the exact identity/binding record, if present. It does not call
// the issuer's revocation endpoint or coordinate with an in-flight token refresh.
func (s *FileStore) Delete(ctx context.Context, binding Binding) error {
	key, err := connectionKey(ctx, binding)
	if err != nil {
		return err
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	if err := ctx.Err(); err != nil {
		return err
	}
	if err := os.Remove(s.path(key)); err != nil && !errors.Is(err, os.ErrNotExist) {
		return errors.New("oauth: cannot remove connection record")
	}
	return nil
}
