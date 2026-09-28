package mcp

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/netip"
	"net/url"
	"strings"
	"sync/atomic"
	"testing"
)

func discoveryFixture(t *testing.T) (*Discovery, map[string]any, map[string]any, *atomic.Int32) {
	t.Helper()
	resource := map[string]any{}
	issuer := map[string]any{}
	calls := &atomic.Int32{}
	server := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		calls.Add(1)
		if r.Header.Get("Authorization") != "" || r.Header.Get("Cookie") != "" {
			t.Error("credentials sent to metadata endpoint")
		}
		w.Header().Set("Content-Type", "application/json")
		var body any
		switch r.URL.Path {
		case "/.well-known/oauth-protected-resource/mcp", "/metadata":
			body = resource
		case "/.well-known/oauth-authorization-server/tenant":
			body = issuer
		default:
			t.Errorf("unexpected discovery path: %s", r.URL.Path)
			w.WriteHeader(http.StatusNotFound)
			return
		}
		if err := json.NewEncoder(w).Encode(body); err != nil {
			t.Error(err)
		}
	}))
	t.Cleanup(server.Close)
	resource["resource"] = server.URL + "/mcp"
	resource["authorization_servers"] = []string{"https://unapproved.example", server.URL + "/tenant"}
	resource["scopes_supported"] = []string{"notes:read"}
	issuer["issuer"] = server.URL + "/tenant"
	issuer["authorization_endpoint"] = server.URL + "/authorize"
	issuer["token_endpoint"] = server.URL + "/token"
	issuer["response_types_supported"] = []string{"code"}
	issuer["code_challenge_methods_supported"] = []string{"S256"}
	issuer["token_endpoint_auth_methods_supported"] = []string{"none", "client_secret_basic"}
	issuer["authorization_response_iss_parameter_supported"] = true
	d, err := NewDiscovery(server.URL+"/mcp", server.URL+"/tenant")
	if err != nil {
		t.Fatal(err)
	}
	// Only tests replace the public-address dialer, retaining TLS verification and
	// the production redirect policy. Production does not expose this override.
	d.httpc.Transport = server.Client().Transport
	t.Cleanup(d.CloseIdleConnections)
	return d, resource, issuer, calls
}

func TestDiscoveryResolvesApprovedIssuer(t *testing.T) {
	for _, useChallenge := range []bool{false, true} {
		d, _, _, calls := discoveryFixture(t)
		var failure *HTTPError
		if useChallenge {
			failure = &HTTPError{StatusCode: http.StatusUnauthorized, WWWAuthenticate: []string{
				`Basic realm="other", Bearer resource_metadata="` + d.resource.Scheme + "://" + d.resource.Host + `/metadata", scope="notes:read"`,
			}}
		}
		got, err := d.Discover(context.Background(), failure)
		if err != nil {
			t.Fatal(err)
		}
		if got.Resource != d.resource.String() || got.Issuer != d.issuer.String() || got.AuthorizationEndpoint == "" || got.TokenEndpoint == "" {
			t.Fatalf("unexpected discovery result: %+v", got)
		}
		if len(got.ScopesSupported) != 1 || (useChallenge && got.RequestedScope != "notes:read") {
			t.Fatal("scope hints were not preserved")
		}
		if len(got.TokenEndpointAuthMethodsSupported) != 2 || !got.AuthorizationResponseIssuerSupported {
			t.Fatal("client authentication or issuer-response metadata was lost")
		}
		if calls.Load() != 2 {
			t.Fatalf("want exactly two metadata requests, got %d", calls.Load())
		}
	}
}

func TestDiscoveryRejectsMetadataMismatch(t *testing.T) {
	for _, tc := range []struct {
		name   string
		mutate func(map[string]any, map[string]any)
	}{
		{"resource", func(r, _ map[string]any) { r["resource"] = "https://different.example/mcp" }},
		{"unapproved issuer", func(r, _ map[string]any) { r["authorization_servers"] = []string{"https://different.example"} }},
		{"issuer mismatch", func(_, a map[string]any) { a["issuer"] = "https://different.example" }},
		{"authorization endpoint", func(_, a map[string]any) { a["authorization_endpoint"] = "https://different.example/authorize" }},
		{"token endpoint", func(_, a map[string]any) { a["token_endpoint"] = "https://different.example/token" }},
		{"insecure endpoint", func(_, a map[string]any) { a["token_endpoint"] = "http://example.com/token" }},
		{"response type", func(_, a map[string]any) { a["response_types_supported"] = []string{"token"} }},
		{"PKCE downgrade", func(_, a map[string]any) { a["code_challenge_methods_supported"] = []string{"plain"} }},
		{"missing PKCE", func(_, a map[string]any) { delete(a, "code_challenge_methods_supported") }},
		{"grant type", func(_, a map[string]any) { a["grant_types_supported"] = []string{"client_credentials"} }},
	} {
		t.Run(tc.name, func(t *testing.T) {
			d, resource, issuer, _ := discoveryFixture(t)
			tc.mutate(resource, issuer)
			if _, err := d.Discover(context.Background(), nil); err == nil {
				t.Fatal("accepted incompatible or untrusted metadata")
			}
		})
	}
}

func TestDiscoveryRejectsChallengeBeforeNetwork(t *testing.T) {
	for _, failure := range []*HTTPError{
		{StatusCode: http.StatusServiceUnavailable},
		{StatusCode: http.StatusUnauthorized, WWWAuthenticate: []string{`Bearer resource_metadata="https://untrusted.example/meta"`}},
		{StatusCode: http.StatusUnauthorized, WWWAuthenticate: []string{`Bearer resource_metadata="http://169.254.169.254/metadata"`}},
		{StatusCode: http.StatusUnauthorized, WWWAuthenticate: []string{`Bearer resource_metadata="https://user:password@example.com/meta"`}},
		{StatusCode: http.StatusUnauthorized, WWWAuthenticate: []string{`Bearer scope="read", scope="write"`}},
	} {
		d, _, _, calls := discoveryFixture(t)
		if _, err := d.Discover(context.Background(), failure); err == nil {
			t.Fatal("accepted invalid discovery input")
		}
		if calls.Load() != 0 {
			t.Fatal("contacted metadata endpoint before rejecting challenge")
		}
	}
}

func TestDiscoveryRejectsInvalidResponsesAndRedirects(t *testing.T) {
	for _, tc := range []struct {
		name        string
		status      int
		contentType string
		body        string
	}{
		{"redirect", http.StatusFound, "application/json", ""},
		{"server failure", http.StatusServiceUnavailable, "text/plain", "secret-response"},
		{"HTML", http.StatusOK, "text/html", "secret-response"},
		{"oversized", http.StatusOK, "application/json", strings.Repeat("x", maxMetadataBytes+1)},
		{"invalid JSON", http.StatusOK, "application/json", "secret-response"},
		{"trailing JSON", http.StatusOK, "application/json", "{} {}"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			var calls atomic.Int32
			server := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				calls.Add(1)
				w.Header().Set("Content-Type", tc.contentType)
				w.Header().Set("Location", "/unexpected")
				w.WriteHeader(tc.status)
				if _, err := w.Write([]byte(tc.body)); err != nil {
					t.Error(err)
				}
			}))
			defer server.Close()
			d, err := NewDiscovery(server.URL+"/mcp", server.URL)
			if err != nil {
				t.Fatal(err)
			}
			d.httpc.Transport = server.Client().Transport
			defer d.CloseIdleConnections()
			if _, err := d.Discover(context.Background(), nil); err == nil || strings.Contains(err.Error(), "secret-response") {
				t.Fatal("invalid response accepted or exposed in error")
			}
			if calls.Load() != 1 {
				t.Fatal("metadata request redirected or retried")
			}
		})
	}
}

func TestDiscoveryRejectsPrivateNetworkAndHonorsCancellation(t *testing.T) {
	var calls atomic.Int32
	server := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		calls.Add(1)
		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()
	d, err := NewDiscovery(server.URL+"/mcp", server.URL)
	if err != nil {
		t.Fatal(err)
	}
	defer d.CloseIdleConnections()
	// Exercise the production dialer, without the fixture's TLS transport override.
	if _, err := d.Discover(context.Background(), nil); err == nil {
		t.Fatal("production discovery contacted loopback")
	}
	if calls.Load() != 0 {
		t.Fatal("loopback server received a request")
	}
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if _, err := d.Discover(ctx, nil); !errors.Is(err, context.Canceled) {
		t.Fatalf("want cancellation, got %v", err)
	}
	if conn, err := dialPublic(context.Background(), "tcp", "127.0.0.1:443"); err == nil {
		_ = conn.Close()
		t.Fatal("loopback dial permitted")
	}
}

func TestPublicMetadataAddress(t *testing.T) {
	for _, address := range []string{"127.0.0.1", "10.0.0.1", "172.16.0.1", "192.168.0.1", "169.254.169.254", "0.0.0.0", "100.64.0.1", "192.0.2.1", "198.18.0.1", "224.0.0.1", "240.0.0.1", "::1", "::ffff:127.0.0.1", "fd00::1", "fe80::1", "64:ff9b::a9fe:a9fe", "2001:db8::1"} {
		if publicMetadataAddress(netip.MustParseAddr(address)) {
			t.Errorf("accepted non-public address %s", address)
		}
	}
	for _, address := range []string{"8.8.8.8", "2606:4700:4700::1111"} {
		if !publicMetadataAddress(netip.MustParseAddr(address)) {
			t.Errorf("rejected public address %s", address)
		}
	}
}

func TestDiscoveryURLValidationAndWellKnownPath(t *testing.T) {
	for _, raw := range []string{"", "http://example.com", "https://user:secret@example.com", "https://example.com/#fragment", "https://example.com/#", "/relative"} {
		if _, err := NewDiscovery(raw, "https://issuer.example"); err == nil {
			t.Fatal("accepted invalid resource URL")
		}
	}
	if _, err := NewDiscovery("https://resource.example", "https://issuer.example?query=1"); err == nil {
		t.Fatal("accepted issuer query")
	}
	for _, tc := range []struct{ base, want string }{
		{"https://example.com", "https://example.com/.well-known/oauth-authorization-server"},
		{"https://example.com/", "https://example.com/.well-known/oauth-authorization-server"},
		{"https://example.com/tenant", "https://example.com/.well-known/oauth-authorization-server/tenant"},
		{"https://example.com/a%2Fb", "https://example.com/.well-known/oauth-authorization-server/a%2Fb"},
	} {
		u, err := url.Parse(tc.base)
		if err != nil {
			t.Fatal(err)
		}
		if got := wellKnownURL(u, "oauth-authorization-server"); got != tc.want {
			t.Fatalf("got %s, want %s", got, tc.want)
		}
	}
	// Explicit default ports and case variations represent the same origin.
	u, err := url.Parse("https://example.com")
	if err != nil {
		t.Fatal(err)
	}
	if err := sameDiscoveryOrigin("https://EXAMPLE.COM:443/meta", u); err != nil {
		t.Fatal(err)
	}
	if err := sameDiscoveryOrigin("https://example.com:8443/meta", u); err == nil {
		t.Fatal("accepted a different origin port")
	}
}
