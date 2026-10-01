import { describe, expect, test } from "bun:test";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  ensureDemoClone,
  injectWidget,
  isPixelClone,
  localAssetPath,
  rewriteCaptured,
} from "../src/pack/clone.ts";
import { serveDemoSite } from "../src/pack/demo-site.ts";

const STUB = `<!doctype html><html><body>
<h1>supermemory</h1>
<p>This is a demo site. The webagent is the widget — not this page.</p>
<script src="{{WIDGET_JS}}"></script>
</body></html>`;

describe("rewrite + inject", () => {
  test("maps origin to relative and captured CDN to /_ext", () => {
    const src = [
      '<link href="https://supermemory.ai/_astro/index.css"/>',
      '<img src="https://cdn.example.com/hero.webp"/>',
      '<a href="https://x.com/supermemory">x</a>',
    ].join("\n");
    const out = rewriteCaptured(src, "https://supermemory.com", ["https://supermemory.ai"], ["cdn.example.com"]);
    expect(out).toContain('href="/_astro/index.css"');
    expect(out).toContain('src="/_ext/cdn.example.com/hero.webp"');
    expect(out).toContain('href="https://x.com/supermemory"');
    expect(out).not.toContain("https://supermemory.ai");
    expect(out).not.toContain("https://cdn.example.com");
  });

  test("strips trackers and CSP", () => {
    const src = `<html><head>
<meta http-equiv="Content-Security-Policy" content="default-src 'self'"/>
<script src="https://www.googletagmanager.com/gtm.js"></script>
<script src="/app.js" integrity="sha256-abc"></script>
</head><body></body></html>`;
    const out = rewriteCaptured(src, "https://acme.test");
    expect(out).not.toContain("Content-Security-Policy");
    expect(out).not.toContain("googletagmanager");
    expect(out).not.toContain("integrity=");
  });

  test("injects widget hook once, before </body>", () => {
    const once = injectWidget("<html><body><h1>hi</h1></body></html>");
    expect(once).toContain('<script src="{{WIDGET_JS}}"></script>');
    expect(once).toMatch(/{{WIDGET_JS}}[\s\S]*<\/body>/);
    const twice = injectWidget(once);
    expect(twice.split("{{WIDGET_JS}}").length).toBe(2);
  });
});

describe("localAssetPath", () => {
  test("keeps origin files on the root and skips trackers", () => {
    expect(localAssetPath("https://supermemory.ai/fonts/Geist-var.woff2", "https://supermemory.com", ["https://supermemory.ai"])).toBe(
      "fonts/Geist-var.woff2",
    );
    expect(localAssetPath("https://supermemory.ai/blog", "https://supermemory.com", ["https://supermemory.ai"])).toBe(
      "blog/index.html",
    );
    expect(localAssetPath("https://framerusercontent.com/img.png?width=20", "https://smallest.ai")).toBe(
      "_ext/framerusercontent.com/img.png__q_width%3D20",
    );
    expect(localAssetPath("https://www.googletagmanager.com/gtm.js", "https://supermemory.com")).toBeNull();
    expect(localAssetPath("https://www.redditstatic.com/ads/pixel.js", "https://supermemory.com")).toBeNull();
  });
});

describe("isPixelClone rejects stubs", () => {
  test("hand-written demo page is not a pixel clone", () => {
    const dir = join(tmpdir(), "wa-stub-" + Date.now());
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), STUB);
    const check = isPixelClone(dir);
    expect(check.ok).toBe(false);
    expect(check.reason).toMatch(/stub|missing manifest/i);
    rmSync(dir, { recursive: true, force: true });
  });

  test("current demo/supermemory stub is rejected until cloned", () => {
    const check = isPixelClone("demo/supermemory/site");
    if (check.ok) return;
    expect(check.ok).toBe(false);
    expect(check.reason).toMatch(/stub|manifest|widget|files/i);
  });

  test("manifest + big html + widget + assets pass", () => {
    const dir = join(tmpdir(), "wa-pixel-" + Date.now());
    mkdirSync(join(dir, "_ext", "cdn.test"), { recursive: true });
    const html = "<!doctype html><html><body>" + "x".repeat(9000) + '<script src="{{WIDGET_JS}}"></script></body></html>';
    writeFileSync(join(dir, "index.html"), html);
    writeFileSync(join(dir, "app.css"), "body{color:#000}");
    writeFileSync(join(dir, "app.js"), "console.log(1)");
    writeFileSync(join(dir, "_ext/cdn.test/a.png"), "png");
    writeFileSync(join(dir, "font.woff2"), "woff");
    writeFileSync(
      join(dir, "manifest.json"),
      JSON.stringify({
        origin: "https://acme.test",
        pixel: true,
        files: [
          ["https://acme.test/", "index.html"],
          ["https://acme.test/app.css", "app.css"],
          ["https://acme.test/app.js", "app.js"],
          ["https://cdn.test/a.png", "_ext/cdn.test/a.png"],
          ["https://acme.test/font.woff2", "font.woff2"],
        ],
      }),
    );
    const check = isPixelClone(dir);
    expect(check.ok).toBe(true);
    expect(check.files).toBeGreaterThanOrEqual(5);
    rmSync(dir, { recursive: true, force: true });
  });
});

describe("ensureDemoClone", () => {
  test("refuses to fall back to a stub when Chrome is missing", async () => {
    const dir = join(tmpdir(), "wa-nochrome-" + Date.now());
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), STUB);
    await expect(ensureDemoClone({ origin: "https://supermemory.com", out: dir, chrome: false, refresh: true })).rejects.toThrow(
      /Chrome/,
    );
    rmSync(dir, { recursive: true, force: true });
  });
});

describe("serveDemoSite", () => {
  test("replaces widget hook, serves _ext and query-string assets", async () => {
    const dir = join(tmpdir(), "wa-serve-" + Date.now());
    mkdirSync(join(dir, "_ext", "cdn.test"), { recursive: true });
    writeFileSync(join(dir, "index.html"), '<html><body><script src="{{WIDGET_JS}}"></script></body></html>');
    writeFileSync(join(dir, "app.css"), "body{color:red}");
    writeFileSync(join(dir, "favicon.ico__q_v%3D2"), "ico-bytes");
    writeFileSync(join(dir, "_ext/cdn.test/hero.webp"), "webp-bytes");
    const served = serveDemoSite(dir, 0, "http://127.0.0.1:8791");
    try {
      const html = await (await fetch("http://127.0.0.1:" + served.port + "/")).text();
      expect(html).toContain("http://127.0.0.1:8791/widget.js");
      expect(html).not.toContain("{{WIDGET_JS}}");
      const css = await fetch("http://127.0.0.1:" + served.port + "/app.css");
      expect(css.headers.get("content-type")).toMatch(/text\/css/);
      expect(await css.text()).toBe("body{color:red}");
      const ico = await fetch("http://127.0.0.1:" + served.port + "/favicon.ico?v=2");
      expect(ico.status).toBe(200);
      expect(await ico.text()).toBe("ico-bytes");
      const ext = await fetch("http://127.0.0.1:" + served.port + "/_ext/cdn.test/hero.webp");
      expect(ext.status).toBe(200);
      expect(await ext.text()).toBe("webp-bytes");
    } finally {
      served.stop();
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
