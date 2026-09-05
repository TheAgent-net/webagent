import type { Room } from "./room.ts";

export function chatPage(room: Room, publicUrl: string): Response {
  const q = room.run.getContext().length
    ? ""
    : "<p class=\"hint\">Ask anything. Machines hit the same agent at this URL.</p>";
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>webagent</title>
  <style>
    :root { color-scheme: light dark; font-family: ui-sans-serif, system-ui, sans-serif; }
    body { max-width: 40rem; margin: 2rem auto; padding: 0 1rem; }
    #log { min-height: 12rem; }
    .row { margin: .6rem 0; }
    .human { color: #1565c0; }
    .machine { color: #6a1b9a; }
    .agent { white-space: pre-wrap; }
    form { display: flex; gap: .5rem; margin-top: 1rem; }
    input { flex: 1; padding: .5rem .6rem; }
    button { padding: .5rem .8rem; }
    .hint, .meta { opacity: .65; font-size: .85rem; }
    code { font-size: .8rem; }
  </style>
</head>
<body>
  <h1>webagent</h1>
  <p class="meta">Run <code>${room.run.id}</code> · machines: <code>${publicUrl}/mcp</code></p>
  ${q}
  <div id="log"></div>
  <form id="f"><input id="t" autocomplete="off" placeholder="Message"/><button>Send</button></form>
  <script>
    const log = document.getElementById("log");
    const add = (cls, text) => {
      const d = document.createElement("div");
      d.className = "row " + cls;
      d.textContent = text;
      log.appendChild(d);
    };
    const es = new EventSource("/live");
    es.onmessage = (e) => {
      const ev = JSON.parse(e.data);
      if (ev.t === "say") add(ev.from || "", (ev.from || "") + ": " + ev.text);
      if (ev.t === "reply") add("agent", ev.text || "");
    };
    document.getElementById("f").onsubmit = async (e) => {
      e.preventDefault();
      const input = document.getElementById("t");
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      await fetch("/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
    };
  </script>
</body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
