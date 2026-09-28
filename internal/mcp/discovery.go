package mcp

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime"
	"net"
	"net/http"
	"net/netip"
	"net/url"
	"slices"
	"strings"
	"time"
)

const maxMetadataBytes = 64 << 10

// AuthorizationMetadata describes the configured resource and its approved issuer.
// Scope values are discovery hints, not grants. Endpoints have been checked against
// the configured origins; this result does not establish a user connection.
type AuthorizationMetadata struct {
	Resource                             string
	Issuer                               string
	AuthorizationEndpoint                string
	TokenEndpoint                        string
	ScopesSupported                      []string
	RequestedScope                       string
	TokenEndpointAuthMethodsSupported    []string
	AuthorizationResponseIssuerSupported bool
}

// Discovery resolves metadata for one operator-configured MCP resource and issuer.
// It supports HTTPS public endpoints and RFC 8414 metadata. Cross-origin resource
// metadata, issuer changes, cross-origin OAuth endpoints, and redirects are rejected.
// It never forwards MCP credentials or cookies to metadata endpoints.
type Discovery struct {
	resource *url.URL
	issuer   *url.URL
	httpc    *http.Client
}

// NewDiscovery configures the trust boundary from operator-supplied URLs. The issuer
// must be approved independently of the server's challenge; never copy an arbitrary
// advertised issuer into this argument. Client registration is handled separately.
func NewDiscovery(resourceURL, issuerURL string) (*Discovery, error) {
	resource, err := discoveryURL(resourceURL)
	if err != nil {
		return nil, err
	}
	issuer, err := discoveryURL(issuerURL)
	if err != nil {
		return nil, err
	}
	if issuer.RawQuery != "" || issuer.ForceQuery {
		return nil, fmt.Errorf("mcp: issuer URL must not contain a query")
	}
	return &Discovery{resource: resource, issuer: issuer, httpc: NewAuthorizationHTTPClient()}, nil
}

// NewAuthorizationHTTPClient shares the discovery network restrictions with token
// exchanges: public addresses, bounded waits, no proxy, cookies, or redirects.
// Callers must validate HTTPS endpoint URLs before sending credentials.
func NewAuthorizationHTTPClient() *http.Client {
	transport := &http.Transport{
		DialContext:            dialPublic,
		TLSHandshakeTimeout:    5 * time.Second,
		ResponseHeaderTimeout:  5 * time.Second,
		IdleConnTimeout:        30 * time.Second,
		MaxIdleConns:           4,
		MaxResponseHeaderBytes: maxMetadataBytes,
	}
	return &http.Client{
		Transport: transport,
		Timeout:   10 * time.Second,
		CheckRedirect: func(*http.Request, []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}
}

// Discover fetches protected-resource and authorization-server metadata. A nil
// failure uses the resource's well-known URI; otherwise only 401/403 responses are
// accepted. No consent, token exchange, or failed tool execution is started here.
func (d *Discovery) Discover(ctx context.Context, failure *HTTPError) (*AuthorizationMetadata, error) {
	metadataURL := wellKnownURL(d.resource, "oauth-protected-resource")
	requestedScope := ""
	if failure != nil {
		if failure.StatusCode != http.StatusUnauthorized && failure.StatusCode != http.StatusForbidden {
			return nil, fmt.Errorf("mcp: authorization discovery requires a 401 or 403 response")
		}
		challenge, err := ParseBearerChallenge(failure.WWWAuthenticate)
		if err != nil {
			return nil, err
		}
		if challenge != nil {
			requestedScope = challenge.Scope
			if challenge.ResourceMetadata != "" {
				metadataURL = challenge.ResourceMetadata
			}
		}
	}
	if err := sameDiscoveryOrigin(metadataURL, d.resource); err != nil {
		return nil, err
	}
	var resource struct {
		Resource             string   `json:"resource"`
		AuthorizationServers []string `json:"authorization_servers"`
		ScopesSupported      []string `json:"scopes_supported"`
	}
	if err := d.fetch(ctx, metadataURL, &resource); err != nil {
		return nil, err
	}
	if resource.Resource != d.resource.String() {
		return nil, fmt.Errorf("mcp: resource metadata does not match the configured resource")
	}
	if !slices.Contains(resource.AuthorizationServers, d.issuer.String()) {
		return nil, fmt.Errorf("mcp: resource does not advertise the approved issuer")
	}
	var issuer struct {
		Issuer                string   `json:"issuer"`
		AuthorizationEndpoint string   `json:"authorization_endpoint"`
		TokenEndpoint         string   `json:"token_endpoint"`
		ResponseTypes         []string `json:"response_types_supported"`
		GrantTypes            []string `json:"grant_types_supported"`
		ChallengeMethods      []string `json:"code_challenge_methods_supported"`
		AuthMethods           []string `json:"token_endpoint_auth_methods_supported"`
		ResponseIssuer        bool     `json:"authorization_response_iss_parameter_supported"`
	}
	if err := d.fetch(ctx, wellKnownURL(d.issuer, "oauth-authorization-server"), &issuer); err != nil {
		return nil, err
	}
	if issuer.Issuer != d.issuer.String() {
		return nil, fmt.Errorf("mcp: authorization metadata does not match the approved issuer")
	}
	if err := sameDiscoveryOrigin(issuer.AuthorizationEndpoint, d.issuer); err != nil {
		return nil, err
	}
	if err := sameDiscoveryOrigin(issuer.TokenEndpoint, d.issuer); err != nil {
		return nil, err
	}
	if !slices.Contains(issuer.ResponseTypes, "code") || !slices.Contains(issuer.ChallengeMethods, "S256") {
		return nil, fmt.Errorf("mcp: issuer must advertise authorization code and PKCE S256 support")
	}
	if issuer.GrantTypes != nil && !slices.Contains(issuer.GrantTypes, "authorization_code") {
		return nil, fmt.Errorf("mcp: issuer does not support the authorization code grant")
	}
	return &AuthorizationMetadata{
		Resource:                             resource.Resource,
		Issuer:                               issuer.Issuer,
		AuthorizationEndpoint:                issuer.AuthorizationEndpoint,
		TokenEndpoint:                        issuer.TokenEndpoint,
		ScopesSupported:                      resource.ScopesSupported,
		RequestedScope:                       requestedScope,
		TokenEndpointAuthMethodsSupported:    issuer.AuthMethods,
		AuthorizationResponseIssuerSupported: issuer.ResponseIssuer,
	}, nil
}

// CloseIdleConnections releases the metadata client's idle connections.
func (d *Discovery) CloseIdleConnections() { d.httpc.CloseIdleConnections() }

func (d *Discovery) fetch(ctx context.Context, endpoint string, out any) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return discoveryError(ctx, "invalid metadata request")
	}
	req.Header.Set("Accept", "application/json")
	resp, err := d.httpc.Do(req)
	if err != nil {
		return discoveryError(ctx, "metadata request failed")
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("mcp: metadata endpoint returned HTTP %d", resp.StatusCode)
	}
	mediaType, _, err := mime.ParseMediaType(resp.Header.Get("Content-Type"))
	if err != nil || mediaType != "application/json" {
		return fmt.Errorf("mcp: metadata endpoint must return application/json")
	}
	body, err := io.ReadAll(io.LimitReader(resp.Body, maxMetadataBytes+1))
	if err != nil {
		return discoveryError(ctx, "metadata response could not be read")
	}
	if len(body) > maxMetadataBytes {
		return fmt.Errorf("mcp: metadata response exceeds size limit")
	}
	if err := json.Unmarshal(body, out); err != nil {
		return fmt.Errorf("mcp: invalid metadata JSON")
	}
	return nil
}

// Return fixed diagnostics so untrusted URLs, query strings, and bodies cannot
// enter logs through an HTTP or JSON error. Preserve request cancellation.
func discoveryError(ctx context.Context, message string) error {
	if err := ctx.Err(); err != nil {
		return err
	}
	return fmt.Errorf("mcp: %s", message)
}

func discoveryURL(raw string) (*url.URL, error) {
	u, err := url.Parse(raw)
	if err != nil || len(raw) > 4096 || u.Scheme != "https" || u.Hostname() == "" || u.User != nil || u.Fragment != "" || strings.Contains(raw, "#") || u.Opaque != "" {
		return nil, fmt.Errorf("mcp: discovery requires an absolute HTTPS URL without userinfo or fragment")
	}
	return u, nil
}

func sameDiscoveryOrigin(raw string, expected *url.URL) error {
	u, err := discoveryURL(raw)
	if err != nil {
		return err
	}
	port := func(v *url.URL) string {
		if v.Port() == "" {
			return "443"
		}
		return v.Port()
	}
	if !strings.EqualFold(u.Hostname(), expected.Hostname()) || port(u) != port(expected) {
		return fmt.Errorf("mcp: metadata or OAuth endpoint is outside the configured origin")
	}
	return nil
}

func wellKnownURL(base *url.URL, kind string) string {
	u := *base
	u.RawQuery, u.ForceQuery = "", false
	if u.Path == "/" {
		u.Path, u.RawPath = "", ""
	}
	u.Path = "/.well-known/" + kind + u.Path
	if u.RawPath != "" {
		u.RawPath = "/.well-known/" + kind + u.RawPath
	}
	return u.String()
}

func dialPublic(ctx context.Context, network, address string) (net.Conn, error) {
	host, port, err := net.SplitHostPort(address)
	if err != nil {
		return nil, fmt.Errorf("mcp: invalid metadata address")
	}
	ips, err := net.DefaultResolver.LookupNetIP(ctx, "ip", host)
	if err != nil || len(ips) == 0 || len(ips) > 16 {
		return nil, discoveryError(ctx, "metadata hostname resolution failed")
	}
	for _, ip := range ips {
		if !publicMetadataAddress(ip) {
			return nil, fmt.Errorf("mcp: metadata address is not public")
		}
	}
	// Dial validated IPs directly, preventing a second DNS lookup from rebinding
	// the request to an internal host. The HTTP transport still verifies TLS names.
	dialer := net.Dialer{Timeout: 5 * time.Second}
	for _, ip := range ips {
		conn, err := dialer.DialContext(ctx, network, net.JoinHostPort(ip.String(), port))
		if err == nil {
			return conn, nil
		}
	}
	return nil, discoveryError(ctx, "metadata connection failed")
}

func publicMetadataAddress(ip netip.Addr) bool {
	ip = ip.Unmap()
	if !ip.IsGlobalUnicast() || ip.IsPrivate() || ip.IsLoopback() || ip.IsLinkLocalUnicast() {
		return false
	}
	for _, prefix := range nonPublicMetadataRanges {
		if prefix.Contains(ip) {
			return false
		}
	}
	return true
}

var nonPublicMetadataRanges = []netip.Prefix{
	netip.MustParsePrefix("0.0.0.0/8"),
	netip.MustParsePrefix("100.64.0.0/10"),
	netip.MustParsePrefix("192.0.0.0/24"),
	netip.MustParsePrefix("192.0.2.0/24"),
	netip.MustParsePrefix("198.18.0.0/15"),
	netip.MustParsePrefix("198.51.100.0/24"),
	netip.MustParsePrefix("203.0.113.0/24"),
	netip.MustParsePrefix("240.0.0.0/4"),
	netip.MustParsePrefix("64:ff9b::/96"),
	netip.MustParsePrefix("64:ff9b:1::/48"),
	netip.MustParsePrefix("100::/64"),
	netip.MustParsePrefix("2001::/23"),
	netip.MustParsePrefix("2001:db8::/32"),
	netip.MustParsePrefix("2002::/16"),
}
