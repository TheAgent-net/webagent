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
	"strconv"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	"github.com/TheAgent-net/webagent/core"
)

const testSigningSecret = "s3cr3t-signing"

// signSlack produces a valid Slack signature for a body at a given time.
func signSlack(t *testing.T, secret string, body []byte, ts time.Time) (string, string) {
	t.Helper()
	tsStr := strconv.FormatInt(ts.Unix(), 10)
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte("v0:" + tsStr + ":"))
	mac.Write(body)
	return "v0=" + hex.EncodeToString(mac.Sum(nil)), tsStr
}

func newTestSlack(t *testing.T, apiBase string) *slackChannel {
	t.Helper()
	c, err := newSlack(map[string]any{
		"addr": ":0", "botToken": "xoxb-test", "signingSecret": testSigningSecret, "apiBase": apiBase,
	})
	if err != nil {
		t.Fatal(err)
	}
	return c.(*slackChannel)
}

// Signature verification: the security boundary. Valid signatures pass; tampering, a wrong
// secret, a stale timestamp, and missing headers are all rejected.
func TestVerifySlackSignature(t *testing.T) {
	body := []byte(`{"type":"event_callback"}`)
	now := time.Now()
	sig, ts := signSlack(t, testSigningSecret, body, now)

	valid := http.Header{}
	valid.Set("X-Slack-Signature", sig)
	valid.Set("X-Slack-Request-Timestamp", ts)
	if err := verifySlackSignature(testSigningSecret, valid, body, now); err != nil {
		t.Fatalf("valid signature rejected: %v", err)
	}

	// Tampered body.
	if err := verifySlackSignature(testSigningSecret, valid, []byte(`{"type":"evil"}`), now); err == nil {
		t.Fatal("tampered body must be rejected")
	}
	// Wrong signing secret.
	if err := verifySlackSignature("wrong-secret", valid, body, now); err == nil {
		t.Fatal("wrong secret must be rejected")
	}
	// Replay outside the 5-minute window.
	if err := verifySlackSignature(testSigningSecret, valid, body, now.Add(6*time.Minute)); err == nil {
		t.Fatal("stale timestamp must be rejected")
	}
	// Missing headers.
	if err := verifySlackSignature(testSigningSecret, http.Header{}, body, now); err == nil {
		t.Fatal("missing headers must be rejected")
	}
}

func TestSlackRejectsUnsignedRequest(t *testing.T) {
	s := newTestSlack(t, "http://unused")
	srv := httptest.NewServer(s.handler(context.Background(), func(context.Context, core.Turn) (core.Payload, error) {
		t.Error("dispatch must not run for an unsigned request")
		return core.Payload{}, nil
	}))
	defer srv.Close()

	resp, err := http.Post(srv.URL+"/slack/events", "application/json", strings.NewReader(`{"type":"event_callback"}`))
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("want 401 for an unsigned request, got %d", resp.StatusCode)
	}
}

// The URL-verification handshake echoes the challenge.
func TestSlackURLVerification(t *testing.T) {
	s := newTestSlack(t, "http://unused")
	srv := httptest.NewServer(s.handler(context.Background(), nil))
	defer srv.Close()

	body := []byte(`{"type":"url_verification","challenge":"abc123"}`)
	sig, ts := signSlack(t, testSigningSecret, body, time.Now())
	req, _ := http.NewRequest(http.MethodPost, srv.URL+"/slack/events", strings.NewReader(string(body)))
	req.Header.Set("X-Slack-Signature", sig)
	req.Header.Set("X-Slack-Request-Timestamp", ts)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = resp.Body.Close() }()
	got, _ := io.ReadAll(resp.Body)
	if string(got) != "abc123" {
		t.Fatalf("challenge not echoed, got %q", got)
	}
}

// End to end: a signed user message runs the turn and the reply is posted to chat.postMessage
// in the right channel and thread.
func TestSlackMessageRoundTrip(t *testing.T) {
	posted := make(chan map[string]any, 1)
	api := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasSuffix(r.URL.Path, "/chat.postMessage") {
			http.NotFound(w, r)
			return
		}
		if got := r.Header.Get("Authorization"); got != "Bearer xoxb-test" {
			t.Errorf("bot token not sent, got %q", got)
		}
		var body map[string]any
		_ = json.NewDecoder(r.Body).Decode(&body)
		posted <- body
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"ok":true}`))
	}))
	defer api.Close()

	s := newTestSlack(t, api.URL)
	srv := httptest.NewServer(s.handler(context.Background(), func(_ context.Context, turn core.Turn) (core.Payload, error) {
		if turn.ChannelUserID != "U123" || turn.Text != "hello there" {
			t.Errorf("unexpected turn: %+v", turn)
		}
		return core.Payload{ContentType: "text/plain", Body: "hi back"}, nil
	}))
	defer srv.Close()

	body := []byte(`{"type":"event_callback","event_id":"Ev1","event":{"type":"message","user":"U123","text":"hello there","channel":"C1","ts":"1.1"}}`)
	sig, ts := signSlack(t, testSigningSecret, body, time.Now())
	req, _ := http.NewRequest(http.MethodPost, srv.URL+"/slack/events", strings.NewReader(string(body)))
	req.Header.Set("X-Slack-Signature", sig)
	req.Header.Set("X-Slack-Request-Timestamp", ts)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	_ = resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("want a fast 200 ack, got %d", resp.StatusCode)
	}

	select {
	case got := <-posted:
		if got["channel"] != "C1" || got["text"] != "hi back" || got["thread_ts"] != "1.1" {
			t.Fatalf("unexpected postMessage payload: %+v", got)
		}
	case <-time.After(3 * time.Second):
		t.Fatal("no reply posted to Slack")
	}
}

// A bot's own message must never start a turn — otherwise the agent talks to itself forever.
func TestSlackIgnoresBotMessages(t *testing.T) {
	s := newTestSlack(t, "http://unused")
	srv := httptest.NewServer(s.handler(context.Background(), func(context.Context, core.Turn) (core.Payload, error) {
		t.Error("dispatch must not run for a bot message")
		return core.Payload{}, nil
	}))
	defer srv.Close()

	body := []byte(`{"type":"event_callback","event_id":"Ev2","event":{"type":"message","user":"U9","bot_id":"B1","text":"loop?","channel":"C1","ts":"1.1"}}`)
	sig, ts := signSlack(t, testSigningSecret, body, time.Now())
	req, _ := http.NewRequest(http.MethodPost, srv.URL+"/slack/events", strings.NewReader(string(body)))
	req.Header.Set("X-Slack-Signature", sig)
	req.Header.Set("X-Slack-Request-Timestamp", ts)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	_ = resp.Body.Close()
	time.Sleep(100 * time.Millisecond) // give a wrongly-spawned goroutine time to fail the test
}

// A retried delivery (same event_id) must run the turn only once.
func TestSlackDeduplicatesRetries(t *testing.T) {
	var runs atomic.Int32
	done := make(chan struct{}, 2)
	api := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"ok":true}`))
		done <- struct{}{}
	}))
	defer api.Close()

	s := newTestSlack(t, api.URL)
	srv := httptest.NewServer(s.handler(context.Background(), func(context.Context, core.Turn) (core.Payload, error) {
		runs.Add(1)
		return core.Payload{Body: "ok"}, nil
	}))
	defer srv.Close()

	body := []byte(`{"type":"event_callback","event_id":"EvDup","event":{"type":"message","user":"U1","text":"hi","channel":"C1","ts":"1.1"}}`)
	for range 2 {
		sig, ts := signSlack(t, testSigningSecret, body, time.Now())
		req, _ := http.NewRequest(http.MethodPost, srv.URL+"/slack/events", strings.NewReader(string(body)))
		req.Header.Set("X-Slack-Signature", sig)
		req.Header.Set("X-Slack-Request-Timestamp", ts)
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatal(err)
		}
		_ = resp.Body.Close()
	}
	<-done
	time.Sleep(150 * time.Millisecond)
	if n := runs.Load(); n != 1 {
		t.Fatalf("retried delivery should run once, ran %d times", n)
	}
}

func TestSlackRequiresCredentials(t *testing.T) {
	if _, err := newSlack(map[string]any{"signingSecret": "x"}); err == nil {
		t.Fatal("slack must require a bot token")
	}
	if _, err := newSlack(map[string]any{"botToken": "x"}); err == nil {
		t.Fatal("slack must require a signing secret")
	}
}

func TestVerifySlackSignatureCaseInsensitive(t *testing.T) {
	body := []byte(`{"type":"event_callback"}`)
	now := time.Now()
	sig, ts := signSlack(t, testSigningSecret, body, now)
	upperSig := "v0=" + strings.ToUpper(strings.TrimPrefix(sig, "v0="))

	valid := http.Header{}
	valid.Set("X-Slack-Signature", upperSig)
	valid.Set("X-Slack-Request-Timestamp", ts)
	if err := verifySlackSignature(testSigningSecret, valid, body, now); err != nil {
		t.Fatalf("uppercase signature hex must be accepted: %v", err)
	}
}

func TestSlackPostMessageReportsHTTPError(t *testing.T) {
	api := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		http.Error(w, "rate_limited", http.StatusTooManyRequests)
	}))
	defer api.Close()

	s := newTestSlack(t, api.URL)
	err := s.postMessage(context.Background(), "C1", "", "hello")
	if err == nil {
		t.Fatal("expected error on non-200 HTTP status")
	}
	if !strings.Contains(err.Error(), "429") || !strings.Contains(err.Error(), "rate_limited") {
		t.Fatalf("expected status code 429 and response body in error, got: %v", err)
	}
}
