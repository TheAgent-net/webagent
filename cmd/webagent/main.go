// Command webagent runs any business's web agent from its declarative spec.
//
//	webagent options            list the slot menus (the palette a business picks from)
//	webagent validate <spec>    load a spec and resolve every chosen provider
//	webagent serve <spec>       build the agent and run its channels
//
// By default this CLI runs the model-free echo brain and the built-in providers, so the
// template is demonstrable without credentials. A real deployment selects a model provider
// (e.g. openrouter) and an action provider (e.g. mcp) in the spec, and may inject extra tools
// via build.WithTools.
package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"log/slog"
	"os"
	"os/signal"

	"github.com/TheAgent-net/webagent/action"
	"github.com/TheAgent-net/webagent/brain"
	"github.com/TheAgent-net/webagent/build"
	"github.com/TheAgent-net/webagent/channels"
	"github.com/TheAgent-net/webagent/guardrail"
	"github.com/TheAgent-net/webagent/memory"
	"github.com/TheAgent-net/webagent/observability"
	"github.com/TheAgent-net/webagent/present"
	"github.com/TheAgent-net/webagent/retrieval"
	"github.com/TheAgent-net/webagent/secrets"
	"github.com/TheAgent-net/webagent/spec"
	"github.com/TheAgent-net/webagent/spi"
)

func main() {
	log.SetFlags(0)
	if len(os.Args) < 2 {
		usage()
	}
	switch os.Args[1] {
	case "keys":
		runKeys(os.Args[2:])
	case "options":
		printSlot("model", brain.Registry.Options(), brain.Registry.Default())
		printSlot("action", action.Registry.Options(), action.Registry.Default())
		printSlot("retrieval", retrieval.Registry.Options(), retrieval.Registry.Default())
		printSlot("memory", memory.Registry.Options(), memory.Registry.Default())
		printSlot("guardrail", guardrail.Registry.Options(), guardrail.Registry.Default())
		printSlot("channel", channels.Registry.Options(), channels.Registry.Default())
		printSlot("presenter", present.Registry.Options(), present.Registry.Default())
		printSlot("observability", observability.Registry.Options(), observability.Registry.Default())
		printSlot("secrets", secrets.Registry.Options(), secrets.Registry.Default())
	case "validate":
		s := mustLoad()
		a, err := build.Build(context.Background(), s)
		if err != nil {
			log.Fatalf("build: %v", err)
		}
		prov := s.Action.Provider
		if prov == "" {
			prov = action.Registry.Default()
		}
		sec := s.Secrets.Type
		if sec == "" {
			sec = secrets.Registry.Default()
		}
		fmt.Printf("OK  %s (%s)\n", a.Name, s.Business)
		fmt.Printf("  action    : provider=%s (%d tools)\n", prov, len(a.Tools))
		fmt.Printf("  model     : %s\n", a.Brain.Name())
		fmt.Printf("  retrieval : %s\n", a.Retriever.Name())
		fmt.Printf("  memory    : %s\n", a.Memory.Name())
		fmt.Printf("  guardrail : %s\n", a.Guardrail.Name())
		fmt.Printf("  observ.   : %s\n", a.Observer.Name())
		fmt.Printf("  secrets   : %s\n", sec)
		for _, b := range a.Bindings {
			fmt.Printf("  channel   : %s (presenter=%s)\n", b.Channel.Name(), b.Presenter.Name())
		}
	case "serve":
		s := mustLoad()
		applyKeys() // load stored API keys into the environment (real exports still win)
		ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
		defer stop()
		logger := slog.New(slog.NewTextHandler(os.Stderr, nil))
		a, err := build.Build(ctx, s, build.WithLogger(logger))
		if err != nil {
			log.Fatalf("build: %v", err)
		}
		logger.Info("serving", "agent", a.Name, "channels", len(a.Bindings))
		if err := a.Run(ctx); err != nil && !errors.Is(err, context.Canceled) {
			log.Fatalf("run: %v", err)
		}
	default:
		usage()
	}
}

func printSlot(slot string, opts []spi.Descriptor, def string) {
	fmt.Printf("%s:\n", slot)
	for _, d := range opts {
		mark := "  "
		if d.Name == def {
			mark = "* " // default
		}
		tag := ""
		if d.Partner {
			tag = " [partner]"
		}
		fmt.Printf("  %s%-10s %s%s\n", mark, d.Name, d.Summary, tag)
	}
}

func mustLoad() *spec.AgentSpec {
	if len(os.Args) < 3 {
		usage()
	}
	s, err := spec.Load(os.Args[2])
	if err != nil {
		log.Fatalf("spec: %v", err)
	}
	return s
}

func usage() {
	fmt.Fprintln(os.Stderr, "usage:")
	fmt.Fprintln(os.Stderr, "  webagent options                 list the provider menu per slot")
	fmt.Fprintln(os.Stderr, "  webagent validate <spec.json>    resolve every chosen provider")
	fmt.Fprintln(os.Stderr, "  webagent serve <spec.json>       build the agent and run its channels")
	fmt.Fprintln(os.Stderr, "  webagent keys set <provider>     store an API key (e.g. openrouter)")
	fmt.Fprintln(os.Stderr, "  webagent keys list | rm <name>   manage stored keys")
	os.Exit(2)
}
