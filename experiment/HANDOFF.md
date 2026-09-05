# Host a sales run

Stand up one public sales run. A visiting agent talks to that run. Same `runId` for the whole chain.

## Host

1. Copy `.env.example` to `.env`. Set `OPENROUTER_API_KEY`.
2. Run:

```sh
bun src/cli.ts pair https://www.corgi.insure --keep --turns 0
```

3. Give the visiting agent one URL. Same machine: `http://127.0.0.1:8787`. Other laptop: the printed LAN URL.
4. The visitor asks a question. Do not send a second prompt. The URL teaches the visiting agent.

The seller binds `0.0.0.0`. Print has two addresses: `http://127.0.0.1:8787` (same machine) and `http://<lan-ip>:8787` (other laptop). `WEBAGENT_PUBLIC_URL` overrides the second if a tunnel is set.

A Cursor sandbox often blocks the LAN IP. A same-machine agent must use `127.0.0.1`. For a public tunnel, set `WEBAGENT_PUBLIC_URL` (ngrok or similar). This repo does not start a tunnel.

`--turns 0` skips the canned buyer script. The host stays up. One run.

Default model is `openai/gpt-4o-mini`. Override with `OPENROUTER_MODEL`. `auto` picks cursor, then openrouter, then script.

Run this on the machine that will hand out the URL. Do not treat a Cloud Build VM URL as the handoff.

## Visitor

See [customer-prompt.md](customer-prompt.md). The visitor pastes the URL into an agent and asks a question.
