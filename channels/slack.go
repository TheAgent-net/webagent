package channels

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/TheAgent-net/webagent/core"
	"github.com/TheAgent-net/webagent/spi"
)

// slackChannel is a live Slack Events API adapter: it receives signed event webhooks, runs the
// turn, and replies with chat.postMessage.
//
// Config (secrets come from the vault via "<name>Secret" references, never inline):
//
//	addr           listen address                       (default ":8080")
//	path           webhook path                         (default "/slack/events")
//	botTokenSecret names the bot token (xoxb-...)        required
//	signingSecret… names the app signing secret          required
//	apiBase        Slack API base                        (default https://slack.com/api)
type slackChannel struct {
	addr          string
	path          string
	botToken      string
	signingSecret string
	apiBase       string
	httpc         *http.Client
	dedupe        *dedupe
}

type slackConfig struct {
	Addr          string `json:"addr"`
	Path          string `json:"path"`
	BotToken      string `json:"botToken"`
	SigningSecret string `json:"signingSecret"`
	APIBase       string `json:"apiBase"`
}

func newSlack(cfg map[string]any) (core.Channel, error) {
	var c slackConfig
	if err := core.Decode(cfg, &c); err != nil {
		return nil, fmt.Errorf("slack channel config: %w", err)
	}
	// Fail at build time rather than serving an unauthenticated or mute endpoint.
	if c.BotToken == "" {
		return nil, fmt.Errorf("slack channel: bot token is required (set botTokenSecret)")
	}
	if c.SigningSecret == "" {
		return nil, fmt.Errorf("slack channel: signing secret is required (set signingSecretSecret) — " +
			"without it request signatures cannot be verified")
	}
	if c.Addr == "" {
		c.Addr = ":8080"
	}
	if c.Path == "" {
		c.Path = "/slack/events"
	}
	if c.APIBase == "" {
		c.APIBase = "https://slack.com/api"
	}
	return &slackChannel{
		addr: c.Addr, path: c.Path, botToken: c.BotToken, signingSecret: c.SigningSecret,
		apiBase: strings.TrimRight(c.APIBase, "/"),
		httpc:   &http.Client{Timeout: 30 * time.Second},
		dedupe:  newDedupe(1024),
	}, nil
}

func (s *slackChannel) Name() string { return "slack" }

func (s *slackChannel) Start(ctx context.Context, d core.Dispatch) error {
	return serveHTTP(ctx, s.addr, s.handler(ctx, d))
}

// slackEnvelope is the subset of the Events API payload this adapter uses.
type slackEnvelope struct {
	Type      string `json:"type"`
	Challenge string `json:"challenge"`
	EventID   string `json:"event_id"`
	Event     struct {
		Type     string `json:"type"`
		User     string `json:"user"`
		Text     string `json:"text"`
		Channel  string `json:"channel"`
		TS       string `json:"ts"`
		ThreadTS string `json:"thread_ts"`
		BotID    string `json:"bot_id"`
		Subtype  string `json:"subtype"`
	} `json:"event"`
}

func (s *slackChannel) handler(runCtx context.Context, d core.Dispatch) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc(s.path, func(w http.ResponseWriter, r *http.Request) {
		body, err := io.ReadAll(io.LimitReader(r.Body, 1<<20))
		if err != nil {
			http.Error(w, "read error", http.StatusBadRequest)
			return
		}
		// Verify before parsing: an unsigned request is never trusted.
		if err := verifySlackSignature(s.signingSecret, r.Header, body, time.Now()); err != nil {
			http.Error(w, "invalid signature", http.StatusUnauthorized)
			return
		}

		var env slackEnvelope
		if err := json.Unmarshal(body, &env); err != nil {
			http.Error(w, "bad payload", http.StatusBadRequest)
			return
		}

		// One-time endpoint handshake.
		if env.Type == "url_verification" {
			w.Header().Set("Content-Type", "text/plain")
			_, _ = w.Write([]byte(env.Challenge))
			return
		}

		// Ignore anything that isn't a human message, and never react to our own (or any bot's)
		// messages — that is how webhook agents end up in infinite loops.
		e := env.Event
		isMessage := e.Type == "message" || e.Type == "app_mention"
		if env.Type != "event_callback" || !isMessage || e.BotID != "" || e.Subtype != "" || e.User == "" || e.Text == "" {
			w.WriteHeader(http.StatusOK)
			return
		}
		// Slack retries un-acked deliveries; process each event once.
		if !s.dedupe.firstTime(env.EventID) {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Ack immediately (Slack requires a response within 3s), then do the work and reply
		// through the Web API.
		w.WriteHeader(http.StatusOK)
		go s.process(runCtx, d, e.User, e.Text, e.Channel, threadOf(e.ThreadTS, e.TS))
	})
	return mux
}

func threadOf(threadTS, ts string) string {
	if threadTS != "" {
		return threadTS
	}
	return ts
}

func (s *slackChannel) process(ctx context.Context, d core.Dispatch, user, text, channel, thread string) {
	out, err := d(ctx, core.Turn{
		ChannelUserID: user,
		Text:          text,
		Meta:          map[string]string{"channel": "slack", "slack_channel": channel, "session": channel},
	})
	if err != nil || out.Body == "" {
		return
	}
	_ = s.postMessage(ctx, channel, thread, out.Body)
}

func (s *slackChannel) postMessage(ctx context.Context, channel, thread, text string) error {
	payload := map[string]any{"channel": channel, "text": text}
	if thread != "" {
		payload["thread_ts"] = thread
	}
	b, _ := json.Marshal(payload)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, s.apiBase+"/chat.postMessage", bytes.NewReader(b))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	req.Header.Set("Authorization", "Bearer "+s.botToken)
	resp, err := s.httpc.Do(req)
	if err != nil {
		return err
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode >= 300 {
		msg, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
		return fmt.Errorf("slack chat.postMessage: %s: %s", resp.Status, strings.TrimSpace(string(msg)))
	}
	// Slack reports application errors in a 200 body.
	var res struct {
		OK    bool   `json:"ok"`
		Error string `json:"error"`
	}
	_ = json.NewDecoder(resp.Body).Decode(&res)
	if !res.OK {
		if res.Error == "" {
			res.Error = "unknown slack error"
		}
		return fmt.Errorf("slack chat.postMessage: %s", res.Error)
	}
	return nil
}

// verifySlackSignature implements Slack's request-signing scheme: HMAC-SHA256 over
// "v0:{timestamp}:{raw body}" keyed by the signing secret, hex-encoded and prefixed "v0=",
// compared in constant time, with a five-minute replay window.
func verifySlackSignature(secret string, h http.Header, body []byte, now time.Time) error {
	got := h.Get("X-Slack-Signature")
	tsStr := h.Get("X-Slack-Request-Timestamp")
	if got == "" || tsStr == "" {
		return fmt.Errorf("missing signature headers")
	}
	ts, err := strconv.ParseInt(tsStr, 10, 64)
	if err != nil {
		return fmt.Errorf("bad timestamp")
	}
	if d := now.Sub(time.Unix(ts, 0)); d > 5*time.Minute || d < -5*time.Minute {
		return fmt.Errorf("stale timestamp (replay window exceeded)")
	}
	sig, ok := strings.CutPrefix(got, "v0=")
	if !ok {
		return fmt.Errorf("unexpected signature format")
	}
	gotBytes, err := hex.DecodeString(sig)
	if err != nil {
		return fmt.Errorf("invalid signature encoding: %w", err)
	}
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte("v0:" + tsStr + ":"))
	mac.Write(body)
	if !hmac.Equal(mac.Sum(nil), gotBytes) {
		return fmt.Errorf("signature mismatch")
	}
	return nil
}

func init() {
	Registry.Register(spi.Descriptor{
		Name:    "slack",
		Summary: "Slack Events API: signed webhooks in, chat.postMessage out",
	}, newSlack)
}
