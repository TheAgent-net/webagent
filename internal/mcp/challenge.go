package mcp

import (
	"fmt"
	"strings"
)

// BearerChallenge contains the authorization hints from one Bearer challenge.
// Values are untrusted input, not permission to contact a URL or request scopes.
type BearerChallenge struct {
	ResourceMetadata string
	Scope            string
	ErrorCode        string
}

// ParseBearerChallenge reads WWW-Authenticate values without splitting quoted
// commas or combining parameters from different authentication schemes. Multiple
// Bearer challenges and duplicate parameters are rejected as ambiguous.
func ParseBearerChallenge(values []string) (*BearerChallenge, error) {
	total := 0
	for _, value := range values {
		total += len(value)
		if total > 16<<10 {
			return nil, fmt.Errorf("mcp: authentication challenge exceeds size limit")
		}
	}
	// Repeated header fields are one HTTP list; parameters may continue in the
	// next field, but must never be attached to a different authentication scheme.
	parts, err := challengeParts(strings.Join(values, ","))
	if err != nil {
		return nil, err
	}
	var params map[string]string
	bearer, haveScheme := false, false
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		name, rest := authToken(part)
		if name == "" {
			return nil, fmt.Errorf("mcp: malformed authentication challenge")
		}
		trimmed := strings.TrimLeft(rest, " \t")
		if strings.HasPrefix(trimmed, "=") && !haveScheme {
			return nil, fmt.Errorf("mcp: authentication parameter has no scheme")
		}
		if !strings.HasPrefix(trimmed, "=") {
			if rest != "" && rest[0] != ' ' && rest[0] != '\t' {
				return nil, fmt.Errorf("mcp: malformed authentication scheme")
			}
			bearer = strings.EqualFold(name, "Bearer")
			haveScheme = true
			if !bearer {
				continue
			}
			if params != nil {
				return nil, fmt.Errorf("mcp: multiple Bearer challenges")
			}
			params = map[string]string{}
			if trimmed == "" {
				continue
			}
			part = trimmed
		}
		if !bearer {
			continue
		}
		key, val, err := authParameter(part)
		if err != nil {
			return nil, err
		}
		if _, exists := params[key]; exists {
			return nil, fmt.Errorf("mcp: duplicate Bearer challenge parameter")
		}
		params[key] = val
	}
	if params == nil {
		return nil, nil
	}
	if metadata, present := params["resource_metadata"]; present && metadata == "" {
		return nil, fmt.Errorf("mcp: empty resource metadata URL")
	}
	return &BearerChallenge{
		ResourceMetadata: params["resource_metadata"],
		Scope:            params["scope"],
		ErrorCode:        params["error"],
	}, nil
}

func challengeParts(value string) ([]string, error) {
	var parts []string
	start := 0
	quoted, escaped := false, false
	for i := 0; i < len(value); i++ {
		b := value[i]
		if b == '\r' || b == '\n' || b == 127 || (b < 32 && b != '\t') {
			return nil, fmt.Errorf("mcp: invalid authentication challenge character")
		}
		if escaped {
			escaped = false
		} else if quoted && b == '\\' {
			escaped = true
		} else if b == '"' {
			quoted = !quoted
		} else if b == ',' && !quoted {
			parts = append(parts, value[start:i])
			start = i + 1
		}
	}
	if quoted || escaped {
		return nil, fmt.Errorf("mcp: unterminated authentication challenge value")
	}
	return append(parts, value[start:]), nil
}

func authToken(value string) (string, string) {
	i := 0
	for i < len(value) {
		b := value[i]
		if (b >= 'a' && b <= 'z') || (b >= 'A' && b <= 'Z') || (b >= '0' && b <= '9') || strings.ContainsRune("!#$%&'*+-.^_`|~", rune(b)) {
			i++
			continue
		}
		break
	}
	return value[:i], value[i:]
}

func authParameter(value string) (string, string, error) {
	name, rest := authToken(value)
	rest = strings.TrimLeft(rest, " \t")
	if name == "" || !strings.HasPrefix(rest, "=") {
		return "", "", fmt.Errorf("mcp: malformed Bearer challenge parameter")
	}
	rest = strings.TrimSpace(rest[1:])
	if strings.HasPrefix(rest, `"`) {
		var decoded strings.Builder
		for i := 1; i < len(rest); i++ {
			b := rest[i]
			if b == '"' {
				if strings.TrimSpace(rest[i+1:]) != "" {
					break
				}
				return strings.ToLower(name), decoded.String(), nil
			}
			if b == '\\' {
				i++
				if i == len(rest) {
					break
				}
				b = rest[i]
			}
			decoded.WriteByte(b)
		}
	} else if token, tail := authToken(rest); token != "" && strings.TrimSpace(tail) == "" {
		return strings.ToLower(name), token, nil
	}
	return "", "", fmt.Errorf("mcp: malformed Bearer challenge value")
}
