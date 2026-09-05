# Security Policy

## Reporting a vulnerability

Please report security issues privately. Do **not** open a public issue for a vulnerability.

- Use GitHub's **private vulnerability reporting** ("Report a vulnerability" on the Security
  tab), or
- email the maintainers at the address listed in the repository's organization profile.

Include a description, affected version/commit, and reproduction steps. We aim to acknowledge
within a few business days and to coordinate a fix and disclosure timeline with you.

## Design notes

- **Policy fails closed.** Dangerous tool names (`transfer_funds`, `delete_account`, `wipe`,
  `drop_database`) never execute. A hook `deny` also blocks the call.
- **The model cannot bypass policy.** Tool execution is gated in the loop, not in the prompt.
- **No hidden default model.** A run with no binding fails instead of picking one for you.
- Keys are read from the environment (`OPENROUTER_API_KEY`). Do not commit secrets.
