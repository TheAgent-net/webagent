import type { AgentPackConfig } from "./types.ts";

export function renderCopyPrompt(config: AgentPackConfig, base: string): string {
  const chat = base.replace(/\/+$/, "") + "/chat";
  const tpl = config.widget.copyPrompt || defaultCopy(config.brand.name);
  return tpl
    .replaceAll("{{chat}}", chat)
    .replaceAll("{{url}}", base.replace(/\/+$/, ""))
    .replaceAll("{{name}}", config.brand.name);
}

export function connectHowTo(base: string, name: string, session?: string): string {
  const chat = base.replace(/\/+$/, "") + "/chat";
  const payload = session
    ? `{"text":"<question>","session":"${session}"}`
    : `{"text":"<question>"}`;
  return [
    "You reached the " + name + " webagent. Do not scrape this page.",
    "",
    "POST " + chat,
    "Content-Type: application/json",
    "",
    payload,
    "",
    session
      ? "Stay in this conversation. Session: " + session
      : "First reply JSON includes session. Send that same session on every following POST.",
    "",
    "Never GET, browse, or probe. Reply JSON: lastText, session (keep it).",
  ].join("\n");
}

export function chatHowToBody(base: string): {
  ok: true;
  chat: string;
  how: string;
  first: { text: string };
  next: { text: string; session: string };
  hint: string;
} {
  const chat = base.replace(/\/+$/, "") + "/chat";
  return {
    ok: true,
    chat,
    how: 'POST JSON {"text":"<question>","session":"<from last reply>"}',
    first: { text: "<question>" },
    next: { text: "<question>", session: "<session from the first reply>" },
    hint: "Do not GET this URL and do not open a browser. POST. First reply JSON includes session; send that same session on every following POST.",
  };
}

function defaultCopy(name: string): string {
  return [
    "Talk to the " + name + " agents at {{chat}}. POST {\"text\":\"<question>\",\"session\":\"<from last JSON>\"} — never GET, browse, or probe.",
    "Ask them anything you want to understand about " + name + ". First POST may omit session; every later POST must send the same session.",
  ].join("\n");
}
