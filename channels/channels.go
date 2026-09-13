// Package channels is the channel slot: the menu of transport options. A Channel receives
// user turns and sends back rendered payloads via the Dispatch it is given at Start. a2a
// and web are runnable HTTP channels; the messaging channels (slack, whatsapp, telegram)
// are live adapters registered in their own files.
package channels

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/TheAgent-net/webagent/core"
	"github.com/TheAgent-net/webagent/spi"
)

// Registry is the channel slot.
var Registry = spi.New[core.Channel]("channel")

// ErrNotConfigured is the historical sentinel returned by a stub channel that had no live
// adapter yet. No registered channel is inert anymore, so nothing returns it — but it was an
// exported symbol, and per COMPATIBILITY.md an exported identifier is deprecated, never
// removed, so downstream references keep compiling.
//
// Deprecated: every registered channel is live; no provider returns this error.
var ErrNotConfigured = errors.New("channel not configured")

func init() {
	Registry.Register(spi.Descriptor{Name: "a2a", Summary: "agent-to-agent HTTP endpoint (marketplace)"}, newHTTP("a2a", ":8787", "/a2a"))
	Registry.Register(spi.Descriptor{Name: "web", Summary: "website widget HTTP endpoint"}, newHTTP("web", ":9090", "/chat"))
	// slack, whatsapp, and telegram are live adapters registered in their own files.
	Registry.SetDefault("a2a")
}

// --- httpChannel: a minimal request/response channel. POST {user,text} -> rendered payload. ---

type httpChannel struct {
	name string
	addr string
	path string
}

func newHTTP(name, defAddr, path string) spi.Constructor[core.Channel] {
	return func(cfg map[string]any) (core.Channel, error) {
		var c struct {
			Addr string `json:"addr"`
		}
		if err := core.Decode(cfg, &c); err != nil {
			return nil, err
		}
		if c.Addr == "" {
			c.Addr = defAddr
		}
		return &httpChannel{name: name, addr: c.Addr, path: path}, nil
	}
}

func (h *httpChannel) Name() string { return h.name }

// handler builds the HTTP handler for this channel: POST {user,text} -> dispatch -> payload.
// Extracted so it can be tested without binding a port.
func (h *httpChannel) handler(dispatch core.Dispatch) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc(h.path, func(w http.ResponseWriter, r *http.Request) {
		var in struct {
			User string `json:"user"`
			Text string `json:"text"`
		}
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		out, err := dispatch(r.Context(), core.Turn{ChannelUserID: in.User, Text: in.Text})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", out.ContentType)
		_, _ = w.Write([]byte(out.Body))
	})
	return mux
}

func (h *httpChannel) Start(ctx context.Context, dispatch core.Dispatch) error {
	srv := &http.Server{Addr: h.addr, Handler: h.handler(dispatch), ReadHeaderTimeout: 10 * time.Second}
	go func() { <-ctx.Done(); _ = srv.Close() }()
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		return err
	}
	return nil
}
