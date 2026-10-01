/** Chat-safe markdown → HTML. Nested helpers so .toString() is self-contained for the widget. */
export function renderChatMarkdown(raw: string): string {
  function esc(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function safeHref(href: string): string {
    const t = href.trim().replace(/&amp;/g, "&");
    if (/^https?:\/\//i.test(t)) return t.replace(/"/g, "");
    return "";
  }
  function inline(s: string): string {
    const codes: string[] = [];
    s = s.replace(/`([^`]+)`/g, function (_m, c) {
      codes.push('<code class="wa-inline-code">' + c + "</code>");
      return "%%C" + (codes.length - 1) + "%%";
    });
    s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, function (_m, t, u) {
      const href = safeHref(u);
      if (!href) return t;
      return '<a class="wa-md-link" href="' + href + '" target="_blank" rel="noopener">' + t + "</a>";
    });
    s = s.replace(/(^|[^"'>])(https?:\/\/[^\s<]+)/g, function (_m, p, u) {
      const trail = u.match(/[.,;:!?)]+$/);
      const clean = trail ? u.slice(0, u.length - trail[0].length) : u;
      const rest = trail ? trail[0] : "";
      const href = safeHref(clean);
      if (!href) return p + u;
      return p + '<a class="wa-md-link" href="' + href + '" target="_blank" rel="noopener">' + clean + "</a>" + rest;
    });
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*(?!\*)([^*]+)\*(?!\*)/g, "$1<em>$2</em>");
    s = s.replace(/%%C(\d+)%%/g, function (_m, n) {
      return codes[Number(n)] || "";
    });
    return s;
  }
  function blocks(s: string): string {
    const lines = s.replace(/\n$/, "").split("\n");
    const out: string[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i] || "";
      if (/^#{1,3} /.test(line)) {
        const n = (line.match(/^#+/) || ["#"])[0].length;
        const tag = n === 1 ? "h3" : n === 2 ? "h4" : "h5";
        out.push("<" + tag + ' class="wa-md-h">' + inline(line.replace(/^#+\s+/, "")) + "</" + tag + ">");
        i++;
        continue;
      }
      if (/^[-*] /.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^[-*] /.test(lines[i] || "")) {
          items.push("<li>" + inline((lines[i] || "").replace(/^[-*] /, "")) + "</li>");
          i++;
        }
        out.push('<ul class="wa-md-ul">' + items.join("") + "</ul>");
        continue;
      }
      if (/^\d+\. /.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\. /.test(lines[i] || "")) {
          items.push("<li>" + inline((lines[i] || "").replace(/^\d+\. /, "")) + "</li>");
          i++;
        }
        out.push('<ol class="wa-md-ol">' + items.join("") + "</ol>");
        continue;
      }
      if (!line.trim()) {
        i++;
        continue;
      }
      const para: string[] = [];
      while (
        i < lines.length &&
        (lines[i] || "").trim() &&
        !/^#{1,3} /.test(lines[i] || "") &&
        !/^[-*] /.test(lines[i] || "") &&
        !/^\d+\. /.test(lines[i] || "")
      ) {
        para.push(lines[i] || "");
        i++;
      }
      out.push("<p>" + para.map(inline).join("<br>") + "</p>");
    }
    return out.join("");
  }

  let s = esc(String(raw ?? ""));
  const parts: string[] = [];
  const fence = /```([^\n]*)\n([\s\S]*?)```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = fence.exec(s))) {
    if (m.index > last) parts.push(blocks(s.slice(last, m.index)));
    const lang = (m[1] || "").trim();
    const code = (m[2] || "").replace(/\n$/, "");
    const header = lang ? '<div class="wa-code-lang">' + lang + "</div>" : "";
    parts.push('<div class="wa-code-wrap">' + header + '<pre class="wa-code"><code>' + code + "</code></pre></div>");
    last = m.index + m[0].length;
  }
  if (last < s.length) parts.push(blocks(s.slice(last)));
  return parts.join("") || "<p></p>";
}
