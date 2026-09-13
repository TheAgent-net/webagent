// Package backoff is a small bounded exponential-backoff retry helper shared by the network
// providers (the model gateway and the MCP client). Nothing is retried unless the caller marks
// the error retryable — everything else fails fast, so a 4xx auth failure is never replayed.
package backoff

import (
	"context"
	"errors"
	"math/rand/v2"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// Policy bounds a retry loop: up to Attempts tries in total (the first counts) with
// exponential backoff starting at Base and capped at Max. Delays use full jitter (a random
// value in [0, delay)) so many clients retrying together don't stampede the same moment.
// Max also caps any provider-supplied Retry-After hint (untrusted input — see Do). Zero
// fields take the defaults.
type Policy struct {
	Attempts int
	Base     time.Duration
	Max      time.Duration
}

const (
	defaultAttempts = 3
	defaultBase     = 500 * time.Millisecond
	defaultMax      = 4 * time.Second
)

// Do calls fn repeatedly until it succeeds, fails with a non-retryable error, or the attempts
// are exhausted. fn's error is retryable unless wrapped with Terminal; WithAfter hints a
// specific sleep before the next attempt (e.g. a Retry-After header). The last error is
// returned. If ctx is cancelled between attempts, Do returns ctx.Err().
func Do(ctx context.Context, p Policy, fn func() error) error {
	attempts, base, max := p.Attempts, p.Base, p.Max
	if attempts <= 0 {
		attempts = defaultAttempts
	}
	if base <= 0 {
		base = defaultBase
	}
	if max <= 0 || max < base {
		max = defaultMax
	}
	if err := ctx.Err(); err != nil {
		return err
	}

	var err error
	for attempt := 0; attempt < attempts; attempt++ {
		err = fn()
		if err == nil {
			return nil
		}
		var t *terminalError
		if errors.As(err, &t) {
			return t.Err
		}
		if attempt == attempts-1 {
			break
		}

		delay := base * time.Duration(1<<uint(attempt))
		if delay > max {
			delay = max
		}
		delay = time.Duration(rand.Int64N(int64(delay) + 1))
		var hinted interface{ RetryAfter() time.Duration }
		if errors.As(err, &hinted) && hinted.RetryAfter() > 0 {
			// A provider-supplied hint replaces the schedule but is still clamped to Max:
			// a remote Retry-After is untrusted input and must never suspend work unboundedly.
			delay = min(hinted.RetryAfter(), max)
		}

		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(delay):
		}
	}
	return err
}

// terminalError marks an error as not worth retrying: Do returns it immediately.
type terminalError struct{ Err error }

func (t *terminalError) Error() string { return t.Err.Error() }
func (t *terminalError) Unwrap() error { return t.Err }

// Terminal wraps err so Do returns it without retrying (e.g. a 4xx auth failure).
func Terminal(err error) error { return &terminalError{Err: err} }

// afterError carries a Retry-After hint: Do sleeps the hinted duration instead of the
// backoff schedule before the next attempt.
type afterError struct {
	err   error
	after time.Duration
}

func (a *afterError) Error() string             { return a.err.Error() }
func (a *afterError) Unwrap() error             { return a.err }
func (a *afterError) RetryAfter() time.Duration { return a.after }

// WithAfter wraps err with a retry hint. If d is non-positive the backoff schedule applies;
// otherwise the hinted delay is used, clamped to the policy's Max.
func WithAfter(err error, d time.Duration) error { return &afterError{err: err, after: d} }

// RetryAfterDelay parses an HTTP Retry-After header value: integer seconds, or an HTTP date.
// A zero result means no usable hint.
func RetryAfterDelay(h string) time.Duration {
	h = strings.TrimSpace(h)
	if h == "" {
		return 0
	}
	if secs, err := strconv.Atoi(h); err == nil {
		return time.Duration(secs) * time.Second
	}
	if t, err := http.ParseTime(h); err == nil {
		if d := time.Until(t); d > 0 {
			return d
		}
	}
	return 0
}
