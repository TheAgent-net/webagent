package oauth

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"mime"
	"net/http"
	"net/url"
	"slices"
	"strings"
	"time"
)

func validScope(scope string) bool {
	if scope == "" {
		return false
	}
	for i := 0; i < len(scope); i++ {
		b := scope[i]
		if b < 0x21 || b > 0x7e || b == '"' || b == '\\' {
			return false
		}
	}
	return true
}

func (f *Flow) exchange(ctx context.Context, code, verifier string) (Tokens, error) {
	form := url.Values{"grant_type": {"authorization_code"}, "code": {code},
		"redirect_uri": {f.cfg.RedirectURI}, "resource": {f.cfg.Binding.Resource}, "code_verifier": {verifier}}
	return f.requestTokens(ctx, form, f.cfg.Scopes)
}

func (f *Flow) requestTokens(ctx context.Context, form url.Values, allowedScopes []string) (Tokens, error) {
	if f.cfg.TokenEndpointAuthMethod == "none" {
		form.Set("client_id", f.cfg.Binding.ClientID)
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, f.metadata.TokenEndpoint, strings.NewReader(form.Encode()))
	if err != nil {
		return Tokens{}, errors.New("oauth: invalid token request")
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")
	if f.cfg.TokenEndpointAuthMethod == "client_secret_basic" {
		req.SetBasicAuth(url.QueryEscape(f.cfg.Binding.ClientID), url.QueryEscape(f.cfg.ClientSecret))
	}
	started := time.Now()
	resp, err := f.httpc.Do(req)
	if err != nil {
		if ctx.Err() != nil {
			return Tokens{}, ctx.Err()
		}
		return Tokens{}, errors.New("oauth: token request failed")
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != http.StatusOK {
		return Tokens{}, errors.New("oauth: token endpoint rejected exchange")
	}
	mediaType, _, err := mime.ParseMediaType(resp.Header.Get("Content-Type"))
	if err != nil || mediaType != "application/json" {
		return Tokens{}, errors.New("oauth: token response must be JSON")
	}
	body, err := io.ReadAll(io.LimitReader(resp.Body, maxTokenBytes+1))
	if err != nil || len(body) > maxTokenBytes {
		return Tokens{}, errors.New("oauth: invalid token response size")
	}
	var response struct {
		AccessToken  string  `json:"access_token"`
		RefreshToken string  `json:"refresh_token"`
		TokenType    string  `json:"token_type"`
		ExpiresIn    *int64  `json:"expires_in"`
		Scope        *string `json:"scope"`
		Error        string  `json:"error"`
	}
	if !uniqueJSONFields(body) {
		return Tokens{}, errors.New("oauth: ambiguous token response")
	}
	if err := json.Unmarshal(body, &response); err != nil || response.Error != "" || !strings.EqualFold(response.TokenType, "Bearer") || !validBearerToken(response.AccessToken) {
		return Tokens{}, errors.New("oauth: invalid token response")
	}
	tokens := Tokens{AccessToken: response.AccessToken, RefreshToken: response.RefreshToken, Scopes: slices.Clone(allowedScopes)}
	// An omitted scope means the requested scopes were granted (RFC 6749 section 5.1).
	if response.Scope != nil {
		tokens.Scopes = nil
		if *response.Scope != "" {
			for _, scope := range strings.Split(*response.Scope, " ") {
				if !validScope(scope) || !slices.Contains(allowedScopes, scope) || slices.Contains(tokens.Scopes, scope) {
					return Tokens{}, errors.New("oauth: token response has unexpected scopes")
				}
				tokens.Scopes = append(tokens.Scopes, scope)
			}
		}
	}
	if response.ExpiresIn != nil {
		// Keep conversion to time.Duration within its range; absent expiry stays unknown.
		if *response.ExpiresIn <= 0 || *response.ExpiresIn > int64((1<<63-1)/time.Second) {
			return Tokens{}, errors.New("oauth: invalid token expiry")
		}
		tokens.ExpiresAt = started.Add(time.Duration(*response.ExpiresIn) * time.Second)
	}
	if err := validateTokens(tokens); err != nil {
		return Tokens{}, err
	}
	return tokens, nil
}

// Reject repeated fields, including case variants that encoding/json otherwise
// maps onto the same struct field. Unknown extension fields remain supported.
func uniqueJSONFields(body []byte) bool {
	d := json.NewDecoder(bytes.NewReader(body))
	first, err := d.Token()
	if err != nil || first != json.Delim('{') {
		return false
	}
	seen := map[string]bool{}
	for d.More() {
		field, err := d.Token()
		if err != nil {
			return false
		}
		name, ok := field.(string)
		name = strings.ToLower(name)
		if !ok || seen[name] {
			return false
		}
		seen[name] = true
		var value json.RawMessage
		if err := d.Decode(&value); err != nil {
			return false
		}
		if bytes.Equal(bytes.TrimSpace(value), []byte("null")) && slices.Contains([]string{"access_token", "refresh_token", "token_type", "scope", "expires_in", "error"}, name) {
			return false
		}
	}
	last, err := d.Token()
	if err != nil || last != json.Delim('}') {
		return false
	}
	_, err = d.Token()
	return errors.Is(err, io.EOF)
}

func validBearerToken(token string) bool {
	if token == "" || token[0] == '=' {
		return false
	}
	padding := false
	for i := 0; i < len(token); i++ {
		b := token[i]
		if b == '=' {
			padding = true
			continue
		}
		allowed := (b >= 'a' && b <= 'z') || (b >= 'A' && b <= 'Z') || (b >= '0' && b <= '9') || strings.ContainsRune("-._~+/", rune(b))
		if padding || !allowed {
			return false
		}
	}
	return true
}
