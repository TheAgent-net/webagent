package channels

import (
	"bytes"
	"context"
	"crypto/hmac"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/TheAgent-net/webagent/core"
	"github.com/TheAgent-net/webagent/spi"
)

// telegramChannel is a live Telegram Bot API adapter: it receives webhook updates (each signed
// by the secret token Telegram includes with every delivery), runs the turn, and replies
// through the sendMessage API. Unlike Slack/Meta, Telegram does not HMAC-sign its bodies — the
// secret token in the X-Telegram-Bot-Api-Secret-Token header IS the webhook's credential.
//
// Config (secrets come from the vault via "<name>Secret" references, never inline):
//
//	addr               listen address                         (default ":8082")
//	path               webhook path                           (default "/telegram/webhook")
//	botTokenSecret     names the bot token (123456:ABC...)     required
//	secretTokenSecret  names the webhook secret token           required
//	apiBase            Telegram Bot API base                   (default https://api.telegram.org)
type telegramChannel struct {
	addr        string
	path        string
	botToken    string
	secretToken string
	apiBase     string
	httpc       *http.Client
	dedupe      *dedupe
}

type telegramConfig struct {
	Addr        string `json:"addr"`
	Path        string `json:"path"`
	BotToken    string `json:"botToken"`
	SecretToken string `json:"secretToken"`
	APIBase     string `json:"apiBase"`
}

func newTelegram(cfg map[string]any) (core.Channel, error) {
	var c telegramConfig
	if err := core.Decode(cfg, &c); err != nil {
		return nil, fmt.Errorf("telegram channel config: %w", err)
	}
	// Fail at build time rather than serving an unauthenticated or mute endpoint.
	if c.BotToken == "" {
		return nil, fmt.Errorf("telegram channel: bot token is required (set botTokenSecret)")
	}
	if c.SecretToken == "" {
		return nil, fmt.Errorf("telegram channel: secret token is required (set secretTokenSecret) — " +
			"without it any client could post forged updates")
	}
	if c.Addr == "" {
		c.Addr = ":8082"
	}
	if c.Path == "" {
		c.Path = "/telegram/webhook"
	}
	if c.APIBase == "" {
		c.APIBase = "https://api.telegram.org"
	}
	return &telegramChannel{
		addr: c.Addr, path: c.Path, botToken: c.BotToken, secretToken: c.SecretToken,
		apiBase: strings.TrimRight(c.APIBase, "/"),
		httpc:   &http.Client{Timeout: 30 * time.Second},
		dedupe:  newDedupe(1024),
	}, nil
}

func (t *telegramChannel) Name() string { return "telegram" }

func (t *telegramChannel) Start(ctx context.Context, d core.Dispatch) error {
	return serveHTTP(ctx, t.addr, t.handler(ctx, d))
}

// telegramUpdate is the subset of Telegram's webhook body this adapter uses. One delivery may
// carry one update; update_id is the de-duplication key.
type telegramUpdate struct {
	UpdateID int64           `json:"update_id"`
	Message  telegramMessage `json:"message"`
}

// telegramMessage is the subset of Telegram's Message object this adapter uses.
type telegramMessage struct {
	MessageID int64 `json:"message_id"`
	From      struct {
		ID    int64 `json:"id"`
		IsBot bool  `json:"is_bot"`
	} `json:"from"`
	Chat struct {
		ID int64 `json:"id"`
	} `json:"chat"`
	Text string `json:"text"`
}

func (t *telegramChannel) handler(runCtx context.Context, d core.Dispatch) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc(t.path, func(w http.ResponseWriter, r *http.Request) {
		body, err := io.ReadAll(io.LimitReader(r.Body, 1<<20))
		if err != nil {
			http.Error(w, "read error", http.StatusBadRequest)
			return
		}
		// Verify before parsing: the secret token is the only thing standing between the
		// endpoint and anyone who can reach it.
		if !verifyTelegramToken(t.secretToken, r.Header.Get("X-Telegram-Bot-Api-Secret-Token")) {
			http.Error(w, "invalid secret token", http.StatusUnauthorized)
			return
		}

		var upd telegramUpdate
		if err := json.Unmarshal(body, &upd); err != nil {
			http.Error(w, "bad payload", http.StatusBadRequest)
			return
		}

		// Only human text messages start a turn — never our own (or any bot's) messages, and
		// never non-text updates (stickers, edits, statuses): that is how webhook agents loop.
		m := upd.Message
		if m.From.ID == 0 || m.From.IsBot || m.Text == "" {
			w.WriteHeader(http.StatusOK)
			return
		}
		// Telegram retries un-acked deliveries; process each update once.
		if !t.dedupe.firstTime(strconv.FormatInt(upd.UpdateID, 10)) {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Ack immediately, then do the work and reply through the Bot API.
		w.WriteHeader(http.StatusOK)
		go t.process(runCtx, d, m)
	})
	return mux
}

func (t *telegramChannel) process(ctx context.Context, d core.Dispatch, m telegramMessage) {
	chatID := strconv.FormatInt(m.Chat.ID, 10)
	out, err := d(ctx, core.Turn{
		ChannelUserID: strconv.FormatInt(m.From.ID, 10),
		Text:          m.Text,
		Meta:          map[string]string{"channel": "telegram", "session": chatID},
	})
	if err != nil || out.Body == "" {
		return
	}
	if err := t.sendMessage(ctx, chatID, out.Body); err != nil {
		// The webhook was already acknowledged, so a delivery failure leaves the user
		// without a reply and this goroutine has nobody to return the error to. Record it
		// on the standard library logger seam — hosts redirect it with slog.SetDefault —
		// so operators see the failed delivery instead of silence.
		slog.Warn("telegram reply delivery failed", "chat_id", chatID, "err", err)
	}
}

func (t *telegramChannel) sendMessage(ctx context.Context, chatID, text string) error {
	b, _ := json.Marshal(map[string]any{"chat_id": chatID, "text": text})
	url := fmt.Sprintf("%s/bot%s/sendMessage", t.apiBase, t.botToken)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(b))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := t.httpc.Do(req)
	if err != nil {
		return err
	}
	defer func() { _ = resp.Body.Close() }()
	// Telegram reports application errors in a 200 body.
	var res struct {
		OK          bool   `json:"ok"`
		Description string `json:"description"`
	}
	_ = json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&res)
	if !res.OK {
		return fmt.Errorf("telegram sendMessage: %s", res.Description)
	}
	return nil
}

// verifyTelegramToken checks the webhook's secret token in constant time. Telegram delivers it
// in the X-Telegram-Bot-Api-Secret-Token header on every webhook request.
func verifyTelegramToken(secret, got string) bool {
	if got == "" || secret == "" {
		return false
	}
	return hmac.Equal([]byte(got), []byte(secret))
}

func init() {
	Registry.Register(spi.Descriptor{
		Name:    "telegram",
		Summary: "Telegram Bot API: secret-token webhooks in, sendMessage out",
	}, newTelegram)
}
