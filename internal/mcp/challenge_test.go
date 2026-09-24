package mcp

import (
	"reflect"
	"strings"
	"testing"
)

func TestParseBearerChallenge(t *testing.T) {
	for _, tc := range []struct {
		name   string
		values []string
		want   *BearerChallenge
	}{
		{name: "absent"},
		{name: "other scheme", values: []string{`Basic realm="private"`}},
		{name: "bare", values: []string{"Bearer"}, want: &BearerChallenge{}},
		{
			name:   "mixed schemes and quoted commas",
			values: []string{`Basic realm="legacy, internal", Bearer resource_metadata="https://service.example/meta?a=1,b=2", scope="notes:read notes:write", error="invalid_token", Negotiate YWJjZA==`},
			want:   &BearerChallenge{ResourceMetadata: "https://service.example/meta?a=1,b=2", Scope: "notes:read notes:write", ErrorCode: "invalid_token"},
		},
		{
			name:   "multiple header values and case insensitive names",
			values: []string{`Basic realm="other"`, `bEaReR RESOURCE_METADATA = "https://service.example/meta", scope=read`},
			want:   &BearerChallenge{ResourceMetadata: "https://service.example/meta", Scope: "read"},
		},
		{
			name:   "quoted pairs",
			values: []string{`Bearer scope="notes:read", error_description="a \"quoted\" value, with comma"`},
			want:   &BearerChallenge{Scope: "notes:read"},
		},
		{
			name:   "parameters across header fields",
			values: []string{`Bearer scope="read"`, `resource_metadata="https://service.example/meta"`},
			want:   &BearerChallenge{Scope: "read", ResourceMetadata: "https://service.example/meta"},
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			got, err := ParseBearerChallenge(tc.values)
			if err != nil {
				t.Fatal(err)
			}
			if !reflect.DeepEqual(got, tc.want) {
				t.Fatalf("got %#v, want %#v", got, tc.want)
			}
		})
	}
}

func TestParseBearerChallengeRejectsAmbiguousOrMalformedValues(t *testing.T) {
	for _, value := range []string{
		`Bearer scope="read", SCOPE="write"`,
		`Bearer scope="read", Bearer scope="write"`,
		`Bearer resource_metadata=""`,
		`Bearer scope="unterminated`,
		`Bearer scope="read"trailing`,
		`Bearer scope=`,
		`Bearer scope=read/write`,
		`Bearer: scope="read"`,
		`Bearer =`,
		`scope="read"`,
		"Bearer scope=\"read\"\r\nInjected: secret",
		"Bearer scope=\"" + strings.Repeat("x", 16<<10) + "\"",
	} {
		if _, err := ParseBearerChallenge([]string{value}); err == nil {
			t.Fatal("accepted invalid challenge")
		} else if strings.Contains(err.Error(), "secret") {
			t.Fatal("challenge content exposed in error")
		}
	}
	if _, err := ParseBearerChallenge([]string{"Bearer", "Bearer"}); err == nil {
		t.Fatal("accepted competing Bearer headers")
	}
}

func FuzzParseBearerChallenge(f *testing.F) {
	f.Add(`Bearer resource_metadata="https://example.com/meta", scope="read"`)
	f.Add(`Basic realm="a,b", Bearer error="invalid_token"`)
	f.Add("Bearer scope=\"\\")
	f.Fuzz(func(t *testing.T, value string) {
		_, _ = ParseBearerChallenge([]string{value})
	})
}
