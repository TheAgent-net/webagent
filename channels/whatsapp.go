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
	"strings"
	"time"

	"github.com/TheAgent-net/webagent/core"
	"github.com/TheAgent-net/webagent/spi"
)

// whatsappChannel is a live WhatsApp Cloud API adapter: it answers Meta's verification
// handshake, receives signed message webhooks, runs the turn, and replies through the Graph API.
//
// Config (secrets come from the vault via "<name>Secret" references, never inline):
//
//	addr               listen address                      (default ":8081")
//	path               webhook path                        (default "/whatsapp/webhook")
//	accessTokenSecret  names the Graph API access token     required
//	appSecretSecret    names the app secret (signatures)    required
//	verifyTokenSecret  names the webhook verify token       required
//	phoneNumberId      the sending phone number id          required
//	apiBase            Graph API base                       (default https://graph.facebook.com/v21.0)
type whatsappChannel struct {
	addr          string
	path          string
	accessToken   string
	appSecret     string
	verifyToken   string
	phoneNumberID string
	apiBase       string
	httpc         *http.Client
	dedupe        *dedupe
}

type whatsappConfig struct {
	Addr          string `json:"addr"`
	Path          string `json:"path"`
	AccessToken   string `json:"accessToken"`
	AppSecret     string `json:"appSecret"`
	VerifyToken   string `json:"verifyToken"`
	PhoneNumberID string `json:"phoneNumberId"`
	APIBase       string `json:"apiBase"`
}

func newWhatsApp(cfg map[string]any) (core.Channel, error) {
	var c whatsappConfig
	if err := core.Decode(cfg, &c); err != nil {
		return nil, fmt.Errorf("whatsapp channel config: %w", err)
	}
	if c.AccessToken == "" {
		return nil, fmt.Errorf("whatsapp channel: access token is required (set accessTokenSecret)")
	}
	if c.AppSecret == "" {
		return nil, fmt.Errorf("whatsapp channel: app secret is required (set appSecretSecret) — " +
			"without it request signatures cannot be verified")
	}
	if c.VerifyToken == "" {
		return nil, fmt.Errorf("whatsapp channel: verify token is required (set verifyTokenSecret)")
	}
	if c.PhoneNumberID == "" {
		return nil, fmt.Errorf("whatsapp channel: phoneNumberId is required")
	}
	if c.Addr == "" {
		c.Addr = ":8081"
	}
	if c.Path == "" {
		c.Path = "/whatsapp/webhook"
	}
	if c.APIBase == "" {
		c.APIBase = "https://graph.facebook.com/v21.0"
	}
	return &whatsappChannel{
		addr: c.Addr, path: c.Path, accessToken: c.AccessToken, appSecret: c.AppSecret,
		verifyToken: c.VerifyToken, phoneNumberID: c.PhoneNumberID,
		apiBase: strings.TrimRight(c.APIBase, "/"),
		httpc:   &http.Client{Timeout: 30 * time.Second},
		dedupe:  newDedupe(1024),
	}, nil
}

func (wa *whatsappChannel) Name() string { return "whatsapp" }

func (wa *whatsappChannel) Start(ctx context.Context, d core.Dispatch) error {
	return serveHTTP(ctx, wa.addr, wa.handler(ctx, d))
}

// whatsappPayload is the subset of Meta's webhook body this adapter uses.
type whatsappPayload struct {
	Entry []struct {
		Changes []struct {
			Value struct {
				Messages []struct {
					ID   string `json:"id"`
					From string `json:"from"`
					Type string `json:"type"`
					Text struct {
						Body string `json:"body"`
					} `json:"text"`
				} `json:"messages"`
			} `json:"value"`
		} `json:"changes"`
	} `json:"entry"`
}

func (wa *whatsappChannel) handler(runCtx context.Context, d core.Dispatch) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc(wa.path, func(w http.ResponseWriter, r *http.Request) {
		// Meta's one-time subscription handshake.
		if r.Method == http.MethodGet {
			q := r.URL.Query()
			if q.Get("hub.mode") == "subscribe" && q.Get("hub.verify_token") == wa.verifyToken {
				w.Header().Set("Content-Type", "text/plain")
				_, _ = w.Write([]byte(q.Get("hub.challenge")))
				return
			}
			http.Error(w, "verification failed", http.StatusForbidden)
			return
		}

		body, err := io.ReadAll(io.LimitReader(r.Body, 1<<20))
		if err != nil {
			http.Error(w, "read error", http.StatusBadRequest)
			return
		}
		if err := verifyMetaSignature(wa.appSecret, r.Header.Get("X-Hub-Signature-256"), body); err != nil {
			http.Error(w, "invalid signature", http.StatusUnauthorized)
			return
		}

		var p whatsappPayload
		if err := json.Unmarshal(body, &p); err != nil {
			http.Error(w, "bad payload", http.StatusBadRequest)
			return
		}

		// Ack immediately; Meta retries anything it does not get a prompt 200 for.
		w.WriteHeader(http.StatusOK)

		for _, entry := range p.Entry {
			for _, change := range entry.Changes {
				for _, m := range change.Value.Messages {
					// Only text messages carry a prompt; status callbacks have no messages at all.
					if m.Type != "text" || m.From == "" || m.Text.Body == "" {
						continue
					}
					if !wa.dedupe.firstTime(m.ID) {
						continue
					}
					go wa.process(runCtx, d, m.From, m.Text.Body)
				}
			}
		}
	})
	return mux
}

func (wa *whatsappChannel) process(ctx context.Context, d core.Dispatch, from, text string) {
	out, err := d(ctx, core.Turn{
		ChannelUserID: from,
		Text:          text,
		Meta:          map[string]string{"channel": "whatsapp", "session": from},
	})
	if err != nil || out.Body == "" {
		return
	}
	_ = wa.sendText(ctx, from, out.Body)
}

func (wa *whatsappChannel) sendText(ctx context.Context, to, text string) error {
	b, _ := json.Marshal(map[string]any{
		"messaging_product": "whatsapp",
		"to":                to,
		"type":              "text",
		"text":              map[string]any{"body": text},
	})
	url := fmt.Sprintf("%s/%s/messages", wa.apiBase, wa.phoneNumberID)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(b))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+wa.accessToken)
	resp, err := wa.httpc.Do(req)
	if err != nil {
		return err
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode >= 300 {
		msg, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
		return fmt.Errorf("whatsapp send: %s: %s", resp.Status, strings.TrimSpace(string(msg)))
	}
	return nil
}

// verifyMetaSignature implements Meta's X-Hub-Signature-256: HMAC-SHA256 of the raw body keyed
// by the app secret, hex-encoded with a "sha256=" prefix, compared in constant time.
func verifyMetaSignature(appSecret, header string, body []byte) error {
	if header == "" {
		return fmt.Errorf("missing X-Hub-Signature-256")
	}
	sig, ok := strings.CutPrefix(header, "sha256=")
	if !ok {
		return fmt.Errorf("unexpected signature format")
	}
	gotBytes, err := hex.DecodeString(sig)
	if err != nil {
		return fmt.Errorf("invalid signature encoding: %w", err)
	}
	mac := hmac.New(sha256.New, []byte(appSecret))
	mac.Write(body)
	if !hmac.Equal(mac.Sum(nil), gotBytes) {
		return fmt.Errorf("signature mismatch")
	}
	return nil
}

func init() {
	Registry.Register(spi.Descriptor{
		Name:    "whatsapp",
		Summary: "WhatsApp Cloud API: signed webhooks in, Graph API messages out",
	}, newWhatsApp)
}
