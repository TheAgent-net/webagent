package channels

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	"github.com/TheAgent-net/webagent/core"
)

const testSecretToken = "tg-secret-token"

func newTestTelegram(t *testing.T, apiBase string) *telegramChannel {
	t.Helper()
	c, err := newTelegram(map[string]any{
		"addr": ":0", "botToken": "123456:test-token", "secretToken": testSecretToken, "apiBase": apiBase,
	})
	if err != nil {
		t.Fatal(err)
	}
	return c.(*telegramChannel)
}

func postTelegram(t *testing.T, url, token, body string) *http.Response {
	t.Helper()
	req, _ := http.NewRequest(http.MethodPost, url, strings.NewReader(body))
	if token != "" {
		req.Header.Set("X-Telegram-Bot-Api-Secret-Token", token)
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = resp.Body.Close() })
	return resp
}

// The secret token is the webhook's only credential: correct passes, wrong/empty fails.
func TestVerifyTelegramToken(t *testing.T) {
	if !verifyTelegramToken(testSecretToken, testSecretToken) {
		t.Fatal("correct token must verify")
	}
	if verifyTelegramToken(testSecretToken, "wrong") {
		t.Fatal("wrong token must be rejected")
	}
	if verifyTelegramToken(testSecretToken, "") {
		t.Fatal("missing token must be rejected")
	}
	if verifyTelegramToken("", "anything") {
		t.Fatal("an empty configured secret must reject everything")
	}
}

func TestTelegramRejectsUntokenizedRequest(t *testing.T) {
	s := newTestTelegram(t, "http://unused")
	srv := httptest.NewServer(s.handler(context.Background(), func(context.Context, core.Turn) (core.Payload, error) {
		t.Error("dispatch must not run without a valid secret token")
		return core.Payload{}, nil
	}))
	defer srv.Close()

	resp := postTelegram(t, srv.URL+"/telegram/webhook", "wrong", `{"update_id":1,"message":{"text":"hi"}}`)
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("want 401 without a valid secret token, got %d", resp.StatusCode)
	}
}

// End to end: a tokenized human message runs the turn and the reply is posted to sendMessage.
func TestTelegramMessageRoundTrip(t *testing.T) {
	posted := make(chan map[string]any, 1)
	api := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasSuffix(r.URL.Path, "/bot123456:test-token/sendMessage") {
			http.NotFound(w, r)
			return
		}
		var body map[string]any
		_ = json.NewDecoder(r.Body).Decode(&body)
		posted <- body
		_, _ = w.Write([]byte(`{"ok":true}`))
	}))
	defer api.Close()

	s := newTestTelegram(t, api.URL)
	srv := httptest.NewServer(s.handler(context.Background(), func(_ context.Context, turn core.Turn) (core.Payload, error) {
		if turn.ChannelUserID != "555" || turn.Text != "hello there" || turn.Meta["session"] != "555" {
			t.Errorf("unexpected turn: %+v", turn)
		}
		return core.Payload{ContentType: "text/plain", Body: "hi back"}, nil
	}))
	defer srv.Close()

	body := `{"update_id":7,"message":{"message_id":11,"from":{"id":555,"is_bot":false},"chat":{"id":555},"text":"hello there"}}`
	resp := postTelegram(t, srv.URL+"/telegram/webhook", testSecretToken, body)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("want a fast 200 ack, got %d", resp.StatusCode)
	}

	select {
	case got := <-posted:
		if got["chat_id"] != "555" || got["text"] != "hi back" {
			t.Fatalf("unexpected sendMessage payload: %+v", got)
		}
	case <-time.After(3 * time.Second):
		t.Fatal("no reply posted to Telegram")
	}
}

// A bot's own message must never start a turn — otherwise the agent talks to itself forever.
func TestTelegramIgnoresBotMessages(t *testing.T) {
	s := newTestTelegram(t, "http://unused")
	srv := httptest.NewServer(s.handler(context.Background(), func(context.Context, core.Turn) (core.Payload, error) {
		t.Error("dispatch must not run for a bot message")
		return core.Payload{}, nil
	}))
	defer srv.Close()

	body := `{"update_id":8,"message":{"message_id":12,"from":{"id":999,"is_bot":true},"chat":{"id":555},"text":"loop?"}}`
	resp := postTelegram(t, srv.URL+"/telegram/webhook", testSecretToken, body)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("want 200 ack, got %d", resp.StatusCode)
	}
	time.Sleep(100 * time.Millisecond) // give a wrongly-spawned goroutine time to fail the test
}

// A retried delivery (same update_id) must run the turn only once.
func TestTelegramDeduplicatesRetries(t *testing.T) {
	var runs atomic.Int32
	done := make(chan struct{}, 2)
	api := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		_, _ = w.Write([]byte(`{"ok":true}`))
		done <- struct{}{}
	}))
	defer api.Close()

	s := newTestTelegram(t, api.URL)
	srv := httptest.NewServer(s.handler(context.Background(), func(context.Context, core.Turn) (core.Payload, error) {
		runs.Add(1)
		return core.Payload{Body: "ok"}, nil
	}))
	defer srv.Close()

	body := `{"update_id":42,"message":{"message_id":13,"from":{"id":555,"is_bot":false},"chat":{"id":555},"text":"hi"}}`
	for range 2 {
		resp := postTelegram(t, srv.URL+"/telegram/webhook", testSecretToken, body)
		if resp.StatusCode != http.StatusOK {
			t.Fatalf("want 200 ack, got %d", resp.StatusCode)
		}
	}
	select {
	case <-done:
	case <-time.After(3 * time.Second):
		t.Fatal("no reply posted to Telegram")
	}
	time.Sleep(150 * time.Millisecond)
	if n := runs.Load(); n != 1 {
		t.Fatalf("retried delivery should run once, ran %d times", n)
	}
}

func TestTelegramRequiresCredentials(t *testing.T) {
	if _, err := newTelegram(map[string]any{"secretToken": "x"}); err == nil {
		t.Fatal("telegram must require a bot token")
	}
	if _, err := newTelegram(map[string]any{"botToken": "x"}); err == nil {
		t.Fatal("telegram must require a secret token")
	}
}

// Non-text updates (edits, stickers, statuses) carry no prompt and never start a turn.
func TestTelegramSkipsNonTextUpdates(t *testing.T) {
	s := newTestTelegram(t, "http://unused")
	srv := httptest.NewServer(s.handler(context.Background(), func(context.Context, core.Turn) (core.Payload, error) {
		t.Error("dispatch must not run for a non-text update")
		return core.Payload{}, nil
	}))
	defer srv.Close()

	body := `{"update_id":9,"message":{"message_id":14,"from":{"id":555,"is_bot":false},"chat":{"id":555},"sticker":{"emoji":"x"}}}`
	resp := postTelegram(t, srv.URL+"/telegram/webhook", testSecretToken, body)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("want 200 ack, got %d", resp.StatusCode)
	}
	if _, err := io.Copy(io.Discard, resp.Body); err != nil {
		t.Fatal(err)
	}
}

// A failed sendMessage is recorded on the standard logger seam: the webhook is already acked,
// so without a log line the failed delivery would be invisible to operators.
func TestTelegramRecordsDeliveryFailure(t *testing.T) {
	api := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		http.Error(w, "too many requests", http.StatusTooManyRequests)
	}))
	defer api.Close()

	s := newTestTelegram(t, api.URL)
	var buf bytes.Buffer
	prev := slog.Default()
	slog.SetDefault(slog.New(slog.NewTextHandler(&buf, nil)))
	defer slog.SetDefault(prev)

	var m telegramMessage
	if err := json.Unmarshal([]byte(`{"message_id":15,"from":{"id":555,"is_bot":false},"chat":{"id":555},"text":"hi"}`), &m); err != nil {
		t.Fatal(err)
	}
	s.process(context.Background(), func(context.Context, core.Turn) (core.Payload, error) {
		return core.Payload{Body: "hi back"}, nil
	}, m)

	if !strings.Contains(buf.String(), "telegram reply delivery failed") {
		t.Fatalf("delivery failure not recorded: %q", buf.String())
	}
}

// ErrNotConfigured was an exported symbol before every channel became live; it is retained as
// deprecated so downstream references keep compiling (COMPATIBILITY.md: deprecate, don't remove).
func TestErrNotConfiguredRetained(t *testing.T) {
	if ErrNotConfigured == nil || ErrNotConfigured.Error() == "" {
		t.Fatal("ErrNotConfigured must remain a valid exported sentinel")
	}
}
