package backoff

import (
	"context"
	"errors"
	"net/http"
	"sync/atomic"
	"testing"
	"time"
)

var fastPolicy = Policy{Attempts: 3, Base: time.Millisecond, Max: 2 * time.Millisecond}

func TestDoSucceedsFirstTry(t *testing.T) {
	var calls atomic.Int32
	err := Do(context.Background(), fastPolicy, func() error {
		calls.Add(1)
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if calls.Load() != 1 {
		t.Fatalf("want 1 call, got %d", calls.Load())
	}
}

func TestDoRetriesThenSucceeds(t *testing.T) {
	var calls atomic.Int32
	err := Do(context.Background(), fastPolicy, func() error {
		if calls.Add(1) < 3 {
			return errors.New("flaky")
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if calls.Load() != 3 {
		t.Fatalf("want 3 calls, got %d", calls.Load())
	}
}

func TestDoReturnsLastErrorAfterExhaustion(t *testing.T) {
	var calls atomic.Int32
	err := Do(context.Background(), Policy{Attempts: 2, Base: time.Millisecond}, func() error {
		calls.Add(1)
		return errors.New("still down")
	})
	if err == nil || err.Error() != "still down" {
		t.Fatalf("want the last error, got %v", err)
	}
	if calls.Load() != 2 {
		t.Fatalf("want 2 calls, got %d", calls.Load())
	}
}

// A terminal error is returned immediately — never retried.
func TestDoTerminalFailsFast(t *testing.T) {
	var calls atomic.Int32
	err := Do(context.Background(), fastPolicy, func() error {
		calls.Add(1)
		return Terminal(errors.New("bad key"))
	})
	if err == nil || err.Error() != "bad key" {
		t.Fatalf("want the terminal error, got %v", err)
	}
	if calls.Load() != 1 {
		t.Fatalf("terminal errors must not retry, made %d calls", calls.Load())
	}
}

// A wrapped terminal error is recognized through the chain.
func TestDoTerminalUnwraps(t *testing.T) {
	inner := errors.New("auth failed")
	err := Do(context.Background(), fastPolicy, func() error {
		return errors.Join(Terminal(inner), errors.New("context"))
	})
	if !errors.Is(err, inner) {
		t.Fatalf("want the underlying terminal error, got %v", err)
	}
}

// ctx cancellation aborts the retry loop and returns ctx.Err().
func TestDoStopsOnContextCancel(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	var calls atomic.Int32
	done := make(chan error, 1)
	go func() {
		done <- Do(ctx, Policy{Attempts: 10, Base: time.Second}, func() error {
			calls.Add(1)
			return errors.New("down")
		})
	}()
	time.Sleep(20 * time.Millisecond) // let the first attempt happen
	cancel()
	select {
	case err := <-done:
		if !errors.Is(err, context.Canceled) {
			t.Fatalf("want context.Canceled, got %v", err)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("Do did not stop after ctx cancellation")
	}
	if calls.Load() == 0 {
		t.Fatal("first attempt should have run")
	}
}

// A cancelled ctx fails before any attempt.
func TestDoFailsImmediatelyOnCanceledContext(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	var calls atomic.Int32
	err := Do(ctx, fastPolicy, func() error { calls.Add(1); return nil })
	if !errors.Is(err, context.Canceled) {
		t.Fatalf("want context.Canceled, got %v", err)
	}
	if calls.Load() != 0 {
		t.Fatal("no attempt should run on an already-cancelled ctx")
	}
}

// WithAfter overrides the backoff schedule for the next attempt.
func TestDoHonorsRetryAfterHint(t *testing.T) {
	start := time.Now()
	var calls atomic.Int32
	err := Do(context.Background(), Policy{Attempts: 3, Base: time.Millisecond, Max: time.Second}, func() error {
		if calls.Add(1) == 1 {
			return WithAfter(errors.New("rate limited"), 100*time.Millisecond)
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	elapsed := time.Since(start)
	if elapsed < 100*time.Millisecond {
		t.Fatalf("Retry-After hint ignored: only slept %v", elapsed)
	}
}

// A provider-supplied hint is untrusted input: it is clamped to the policy's Max, so a remote
// value can never suspend the caller unboundedly.
func TestDoCapsRetryAfterHint(t *testing.T) {
	start := time.Now()
	var calls atomic.Int32
	err := Do(context.Background(), Policy{Attempts: 3, Base: time.Millisecond, Max: 5 * time.Millisecond}, func() error {
		if calls.Add(1) == 1 {
			return WithAfter(errors.New("rate limited"), time.Hour)
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if elapsed := time.Since(start); elapsed > 500*time.Millisecond {
		t.Fatalf("Retry-After hint was not clamped: slept %v", elapsed)
	}
	if calls.Load() != 2 {
		t.Fatalf("want 2 calls, got %d", calls.Load())
	}
}

func TestRetryAfterDelay(t *testing.T) {
	if got := RetryAfterDelay("5"); got != 5*time.Second {
		t.Fatalf("integer seconds: got %v", got)
	}
	future := time.Now().Add(30 * time.Second).UTC().Format(http.TimeFormat)
	if got := RetryAfterDelay(future); got <= 0 || got > 31*time.Second {
		t.Fatalf("HTTP date: got %v", got)
	}
	if got := RetryAfterDelay(""); got != 0 {
		t.Fatalf("empty header: got %v", got)
	}
	if got := RetryAfterDelay("not-a-date"); got != 0 {
		t.Fatalf("garbage header: got %v", got)
	}
}

func TestDoZeroPolicyUsesDefaults(t *testing.T) {
	var calls atomic.Int32
	err := Do(context.Background(), Policy{}, func() error {
		if calls.Add(1) < 2 {
			return errors.New("flaky")
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if calls.Load() != 2 {
		t.Fatalf("want 2 calls, got %d", calls.Load())
	}
}
