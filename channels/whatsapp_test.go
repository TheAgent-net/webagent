package channels

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/TheAgent-net/webagent/core"
)

const (
	testAppSecret   = "app-s3cret"
	testVerifyToken = "verify-me"
)

func signMeta(secret string, body []byte) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(body)
	return "sha256=" + hex.EncodeToString(mac.Sum(nil))
}

func newTestWhatsApp(t *testing.T, apiBase string) *whatsappChannel {
	t.Helper()
	c, err := newWhatsApp(map[string]any{
		"addr": ":0", "accessToken": "tok-test", "appSecret": testAppSecret,
		"verifyToken": testVerifyToken, "phoneNumberId": "PN1", "apiBase": apiBase,
	})
	if err != nil {
		t.Fatal(err)
	}
	return c.(*whatsappChannel)
}

func TestVerifyMetaSignature(t *testing.T) {
	body := []byte(`{"entry":[]}`)
	if err := verifyMetaSignature(testAppSecret, signMeta(testAppSecret, body), body); err != nil {
		t.Fatalf("valid signature rejected: %v", err)
	}
	if err := verifyMetaSignature(testAppSecret, signMeta(testAppSecret, body), []byte(`{"entry":["evil"]}`)); err == nil {
		t.Fatal("tampered body must be rejected")
	}
	if err := verifyMetaSignature("other-secret", signMeta(testAppSecret, body), body); err == nil {
		t.Fatal("wrong secret must be rejected")
	}
	if err := verifyMetaSignature(testAppSecret, "", body); err == nil {
		t.Fatal("missing header must be rejected")
	}
	if err := verifyMetaSignature(testAppSecret, "md5=abc", body); err == nil {
		t.Fatal("unexpected signature format must be rejected")
	}
	// Uppercase hex in signature must be accepted.
	sig := signMeta(testAppSecret, body)
	upperSig := "sha256=" + strings.ToUpper(strings.TrimPrefix(sig, "sha256="))
	if err := verifyMetaSignature(testAppSecret, upperSig, body); err != nil {
		t.Fatalf("uppercase signature hex must be accepted: %v", err)
	}
}

// Meta's subscription handshake: echo hub.challenge only when the verify token matches.
func TestWhatsAppVerificationHandshake(t *testing.T) {
	wa := newTestWhatsApp(t, "http://unused")
	srv := httptest.NewServer(wa.handler(context.Background(), nil))
	defer srv.Close()

	resp, err := http.Get(srv.URL + "/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=" + testVerifyToken + "&hub.challenge=42")
	if err != nil {
		t.Fatal(err)
	}
	got, _ := io.ReadAll(resp.Body)
	_ = resp.Body.Close()
	if string(got) != "42" {
		t.Fatalf("challenge not echoed, got %q", got)
	}

	bad, err := http.Get(srv.URL + "/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=42")
	if err != nil {
		t.Fatal(err)
	}
	_ = bad.Body.Close()
	if bad.StatusCode != http.StatusForbidden {
		t.Fatalf("want 403 for a wrong verify token, got %d", bad.StatusCode)
	}
}

func TestWhatsAppRejectsUnsignedRequest(t *testing.T) {
	wa := newTestWhatsApp(t, "http://unused")
	srv := httptest.NewServer(wa.handler(context.Background(), func(context.Context, core.Turn) (core.Payload, error) {
		t.Error("dispatch must not run for an unsigned request")
		return core.Payload{}, nil
	}))
	defer srv.Close()

	resp, err := http.Post(srv.URL+"/whatsapp/webhook", "application/json", strings.NewReader(`{"entry":[]}`))
	if err != nil {
		t.Fatal(err)
	}
	_ = resp.Body.Close()
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("want 401 for an unsigned request, got %d", resp.StatusCode)
	}
}

// End to end: a signed inbound text runs the turn and the reply is sent via the Graph API to
// the right recipient.
func TestWhatsAppMessageRoundTrip(t *testing.T) {
	sent := make(chan map[string]any, 1)
	api := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasSuffix(r.URL.Path, "/PN1/messages") {
			t.Errorf("unexpected send path %q", r.URL.Path)
		}
		if got := r.Header.Get("Authorization"); got != "Bearer tok-test" {
			t.Errorf("access token not sent, got %q", got)
		}
		var body map[string]any
		_ = json.NewDecoder(r.Body).Decode(&body)
		sent <- body
		w.WriteHeader(http.StatusOK)
	}))
	defer api.Close()

	wa := newTestWhatsApp(t, api.URL)
	srv := httptest.NewServer(wa.handler(context.Background(), func(_ context.Context, turn core.Turn) (core.Payload, error) {
		if turn.ChannelUserID != "919812345678" || turn.Text != "is my order ready?" {
			t.Errorf("unexpected turn: %+v", turn)
		}
		return core.Payload{ContentType: "text/plain", Body: "Yes — ready in 10 minutes."}, nil
	}))
	defer srv.Close()

	body := []byte(`{"entry":[{"changes":[{"value":{"messages":[{"id":"wamid.1","from":"919812345678","type":"text","text":{"body":"is my order ready?"}}]}}]}]}`)
	req, _ := http.NewRequest(http.MethodPost, srv.URL+"/whatsapp/webhook", strings.NewReader(string(body)))
	req.Header.Set("X-Hub-Signature-256", signMeta(testAppSecret, body))
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	_ = resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("want a fast 200 ack, got %d", resp.StatusCode)
	}

	select {
	case got := <-sent:
		if got["to"] != "919812345678" || got["messaging_product"] != "whatsapp" {
			t.Fatalf("unexpected send payload: %+v", got)
		}
		text, _ := got["text"].(map[string]any)
		if text["body"] != "Yes — ready in 10 minutes." {
			t.Fatalf("unexpected reply text: %+v", text)
		}
	case <-time.After(3 * time.Second):
		t.Fatal("no reply sent to WhatsApp")
	}
}

// Status callbacks carry no messages and must not start a turn.
func TestWhatsAppIgnoresStatusCallbacks(t *testing.T) {
	wa := newTestWhatsApp(t, "http://unused")
	srv := httptest.NewServer(wa.handler(context.Background(), func(context.Context, core.Turn) (core.Payload, error) {
		t.Error("dispatch must not run for a status callback")
		return core.Payload{}, nil
	}))
	defer srv.Close()

	body := []byte(`{"entry":[{"changes":[{"value":{"statuses":[{"id":"wamid.9","status":"delivered"}]}}]}]}`)
	req, _ := http.NewRequest(http.MethodPost, srv.URL+"/whatsapp/webhook", strings.NewReader(string(body)))
	req.Header.Set("X-Hub-Signature-256", signMeta(testAppSecret, body))
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	_ = resp.Body.Close()
	time.Sleep(100 * time.Millisecond)
}

func TestWhatsAppRequiresCredentials(t *testing.T) {
	base := map[string]any{
		"accessToken": "a", "appSecret": "b", "verifyToken": "c", "phoneNumberId": "d",
	}
	for _, missing := range []string{"accessToken", "appSecret", "verifyToken", "phoneNumberId"} {
		cfg := map[string]any{}
		for k, v := range base {
			if k != missing {
				cfg[k] = v
			}
		}
		if _, err := newWhatsApp(cfg); err == nil {
			t.Fatalf("whatsapp must require %s", missing)
		}
	}
}
