package channels

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/TheAgent-net/webagent/core"
)

// The probe represents the point where a future connection-aware tool will require
// a host-verified identity before reading credentials.
type identityProbeTool struct {
	t       *testing.T
	want    core.Identity
	present bool
	called  bool
}

func (*identityProbeTool) Name() string { return "identity-probe" }

func (p *identityProbeTool) Call(ctx context.Context, _ map[string]any) (map[string]any, error) {
	p.called = true
	got, ok := core.IdentityFromContext(ctx)
	if got != p.want || ok != p.present {
		p.t.Fatalf("tool identity = %+v, present = %v; want %+v, %v", got, ok, p.want, p.present)
	}
	return nil, nil
}

type identityProbeBrain struct{}

func (identityProbeBrain) Name() string { return "identity-probe" }

func (identityProbeBrain) Respond(ctx context.Context, in core.BrainInput) (core.AgentMessage, error) {
	_, err := in.Tools[0].Call(ctx, nil)
	return core.AgentMessage{Text: "ok"}, err
}

func TestHTTPUserCannotAssertConnectionIdentity(t *testing.T) {
	for _, authenticated := range []bool{false, true} {
		name := "anonymous"
		if authenticated {
			name = "host authenticated"
		}
		t.Run(name, func(t *testing.T) {
			ctx := context.Background()
			probe := &identityProbeTool{t: t, present: authenticated}
			if authenticated {
				probe.want = core.Identity{TenantID: "verified-tenant", UserID: "verified-user"}
				var err error
				ctx, err = core.WithIdentity(ctx, probe.want)
				if err != nil {
					t.Fatal(err)
				}
			}
			agent := &core.Agent{Brain: identityProbeBrain{}, Tools: []core.Tool{probe}}
			channel := &httpChannel{path: "/chat"}
			handler := channel.handler(func(ctx context.Context, turn core.Turn) (core.Payload, error) {
				// Even caller-supplied turn metadata must not establish an identity.
				turn.Meta = map[string]string{"tenant": "victim-tenant", "user": "victim-user"}
				msg, err := agent.Handle(ctx, turn)
				return core.Payload{ContentType: "text/plain", Body: msg.Text}, err
			})
			req := httptest.NewRequest(http.MethodPost, "/chat", strings.NewReader(`{"user":"victim-user","tenant":"victim-tenant","text":"read notes"}`)).WithContext(ctx)
			req.Header.Set("X-User-ID", "victim-user")
			req.Header.Set("X-Tenant-ID", "victim-tenant")
			response := httptest.NewRecorder()
			handler.ServeHTTP(response, req)
			if response.Code != http.StatusOK || !probe.called {
				t.Fatalf("request did not reach the tool: status %d, called %v", response.Code, probe.called)
			}
		})
	}
}
