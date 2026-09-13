package channels

import (
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/TheAgent-net/webagent/core"
)

func TestHTTPChannelServesTurn(t *testing.T) {
	h := &httpChannel{name: "web", addr: ":0", path: "/chat"}
	dispatch := func(_ context.Context, turn core.Turn) (core.Payload, error) {
		return core.Payload{ContentType: "text/plain", Body: "hi " + turn.ChannelUserID + ":" + turn.Text}, nil
	}
	srv := httptest.NewServer(h.handler(dispatch))
	defer srv.Close()

	resp, err := http.Post(srv.URL+"/chat", "application/json", strings.NewReader(`{"user":"u1","text":"world"}`))
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = resp.Body.Close() }()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status %d", resp.StatusCode)
	}
	if string(body) != "hi u1:world" {
		t.Fatalf("got %q", string(body))
	}
}

func TestHTTPChannelRejectsBadJSON(t *testing.T) {
	h := &httpChannel{name: "web", addr: ":0", path: "/chat"}
	dispatch := func(context.Context, core.Turn) (core.Payload, error) { return core.Payload{}, nil }
	srv := httptest.NewServer(h.handler(dispatch))
	defer srv.Close()

	resp, err := http.Post(srv.URL+"/chat", "application/json", strings.NewReader(`{bad`))
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("want 400 on bad JSON, got %d", resp.StatusCode)
	}
}
