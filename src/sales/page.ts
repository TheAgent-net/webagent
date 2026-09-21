import type { Room } from "../host/room.ts";
import { gzipBody, hasCorgiSnapshot, readCorgiIndex } from "./site.ts";
import { corgiWidget } from "./widget.ts";

export { hasCorgiSnapshot } from "./site.ts";

export function corgiChatPage(room: Room, publicUrl: string, req?: Request): Response {
  const html = hasCorgiSnapshot()
    ? inject(readCorgiIndex(), corgiWidget(publicUrl, room.run.id))
    : corgiLandingPage(room, publicUrl);
  const packed = gzipBody(html, req);
  const headers: Record<string, string> = {
    "Content-Type": "text/html; charset=utf-8",
    Link: `<${publicUrl}/.well-known/agent-card.json>; rel="describedby"; type="application/json"`,
    "Cache-Control": "public, max-age=60",
  };
  if (packed.encoding) {
    headers["Content-Encoding"] = packed.encoding;
    headers.Vary = "Accept-Encoding";
  }
  return new Response(packed.body as BodyInit, { headers });
}

function inject(html: string, widget: string): string {
  if (html.includes("</body>")) return html.replace("</body>", widget + "</body>");
  return html + widget;
}

/** Faithful clone of corgi.insure homepage when the snapshot is not on disk. */
function corgiLandingPage(room: Room, publicUrl: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Corgi Insurance: Startup Insurance, Quoted in Minutes</title>
  <link rel="icon" href="/images/corgi logo vector.svg"/>
  <style>
    :root {
      --cream: #FDFBF6;
      --ink: #191919;
      --muted: #4E4E4E;
      --line: #E8E4DC;
      --orange: #ff5c00;
      --orange-brand: #FF5C00;
      --orange-hot: #ff7d33;
      --paper: #FFFFFF;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: var(--cream); color: var(--ink); }
    body {
      font-family: "f37Bolton", Geist, ui-sans-serif, system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; }
    .wrap { max-width: 1120px; margin: 0 auto; padding: 0 1.5rem; }
    nav {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.1rem 1.5rem; max-width: 1200px; margin: 0 auto;
    }
    .logo { display: flex; align-items: center; gap: .55rem; text-decoration: none; font-weight: 700; letter-spacing: -.02em; }
    .logo img { height: 28px; width: auto; }
    .nav-links { display: flex; gap: 1.5rem; font-size: .92rem; color: var(--muted); }
    .nav-links a { text-decoration: none; }
    .pressable-smooth-corner { corner-shape: superellipse(1.6); border-radius: 16px; }
    .pressable-button {
      --pressable-depth: 4px;
      display: inline-flex;
      padding-bottom: var(--pressable-depth);
      transition-property: padding, margin;
      transition-duration: 75ms;
      transition-timing-function: cubic-bezier(.4, 0, .2, 1);
      user-select: none;
    }
    .pressable-button:active { margin-top: var(--pressable-depth); padding-bottom: 0; }
    .pressable-orange { background: #cc4a00; }
    .pressable-black { background: #626262; }
    .pressable-white { background: #e1e1e1; }
    .pressable-face {
      display: inline-flex; align-items: center; justify-content: center;
      width: 100%; border: 1px solid transparent;
      height: 35px; min-width: 112px; padding: 0 16px;
      font-weight: 400; font-size: 16px; line-height: 1.2; letter-spacing: -0.21px;
      text-decoration: none; white-space: nowrap;
    }
    .pressable-face-orange { background: #ff5c00; color: #fff; }
    .pressable-face-orange:hover { background: #ff7d33; }
    .pressable-face-orange:active { background: #ff9d66; }
    .pressable-face-black { background: #191919; color: #fff; }
    .pressable-face-black:hover { background: #4a4a4a; }
    .pressable-face-black:active { background: #7b7b7b; }
    .pressable-face-white { background: #fff; color: #191919; border-color: #e1e1e1; }
    .pressable-face-white:hover { background: #f9f9f9; }
    .pressable-face-white:active { background: #ededed; }
    .hero { padding: 4.5rem 1.5rem 3rem; text-align: center; }
    .hero h1 {
      font-family: georgia, "Times New Roman", serif;
      font-size: clamp(2.4rem, 6vw, 4.4rem);
      font-weight: 400; letter-spacing: -.03em; line-height: 1.05;
      max-width: 16ch; margin: 0 auto .9rem;
    }
    .hero p { color: var(--muted); font-size: 1.08rem; line-height: 1.6; max-width: 38rem; margin: 0 auto 1.6rem; }
    .hero-ctas { display: flex; gap: .75rem; justify-content: center; flex-wrap: wrap; align-items: flex-end; }
    .sub { padding: 0 1.5rem 4rem; text-align: center; color: var(--muted); max-width: 46rem; margin: 0 auto; line-height: 1.65; }
    h2 {
      font-family: georgia, "Times New Roman", serif;
      font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 400;
      letter-spacing: -.02em; text-align: center; margin-bottom: 2rem;
    }
    .packages { padding: 1rem 1.5rem 4rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; max-width: 1120px; margin: 0 auto; }
    .card {
      background: var(--paper); border: 1px solid var(--line); border-radius: 16px;
      padding: 1.25rem 1.2rem 1.4rem; text-align: left; min-height: 12rem;
    }
    .card h3 { font-size: 1.05rem; margin-bottom: .4rem; }
    .card p { color: var(--muted); font-size: .9rem; line-height: 1.5; margin-bottom: .85rem; }
    .pills { display: flex; flex-wrap: wrap; gap: .35rem; }
    .pill {
      border: 1px solid var(--line); border-radius: 999px; padding: .2rem .55rem;
      font-size: .72rem; color: var(--muted);
    }
    .quote {
      max-width: 720px; margin: 0 auto 4rem; padding: 0 1.5rem;
      font-family: georgia, serif; font-size: 1.35rem; line-height: 1.45; text-align: center;
    }
    .quote cite { display: block; margin-top: 1rem; font-style: normal; font-family: inherit; font-size: .85rem; color: var(--muted); }
    .policies { padding: 0 1.5rem 4rem; }
    .faq { padding: 0 1.5rem 4rem; max-width: 720px; margin: 0 auto; }
    details { border-bottom: 1px solid var(--line); padding: .9rem 0; }
    summary { cursor: pointer; font-weight: 600; }
    details p { color: var(--muted); margin-top: .55rem; line-height: 1.55; font-size: .92rem; }
    footer {
      border-top: 1px solid var(--line); padding: 2rem 1.5rem 6rem;
      color: #7B7B7B; font-size: .75rem; line-height: 1.55; text-align: center;
    }
    footer a { color: var(--ink); }
    @media (max-width: 720px) { .nav-links { display: none; } }
  </style>
</head>
<body>
  <nav>
    <a class="logo" href="/"><img src="/images/corgi logo vector.svg" alt="Corgi"/>Corgi</a>
    <div class="nav-links">
      <a href="https://www.corgi.insure">Products</a>
      <a href="https://www.corgi.insure">Solutions</a>
      <a href="https://www.corgi.insure">Resources</a>
      <a href="https://www.corgi.insure">Company</a>
    </div>
    <div class="pressable-button pressable-smooth-corner pressable-orange" style="--pressable-depth:4px" data-pressable-variant="orange">
      <a class="pressable-smooth-corner pressable-face pressable-face-orange" href="https://www.corgi.insure">Get a quote</a>
    </div>
  </nav>
  <section class="hero">
    <h1>Business Insurance at the Speed of Compute.</h1>
    <p>No confusion, no waiting. Get a quote in minutes. Modular coverage, built for founders by founders.</p>
    <div class="hero-ctas">
      <div class="pressable-button pressable-smooth-corner pressable-orange" style="--pressable-depth:4px" data-pressable-variant="orange">
        <a class="pressable-smooth-corner pressable-face pressable-face-orange" href="https://www.corgi.insure">Get a quote</a>
      </div>
      <div class="pressable-button pressable-smooth-corner pressable-white" style="--pressable-depth:4px" data-pressable-variant="white">
        <a class="pressable-smooth-corner pressable-face pressable-face-white" href="https://www.corgi.insure/book-a-demo">Book a demo</a>
      </div>
    </div>
  </section>
  <p class="sub">Corgi is an AI-native, full-stack insurance platform built for technology companies. That means fast quotes, competitive pricing, and a team that understands your business.</p>
  <blockquote class="quote">
    “The minute I hit submit, documents come back, a Slack channel gets created, and the founding team messages me. It’s beautiful.”
    <cite>Alex Marantelos · Co-founder CEO @ Intryc</cite>
  </blockquote>
  <section class="packages">
    <h2>Coverage Designed Around Your Startup’s Journey</h2>
    <div class="grid">
      <article class="card"><h3>Pre-Seed &amp; Seed</h3><p>Core protection for you and your product</p><div class="pills"><span class="pill">CGL</span><span class="pill">D&amp;O</span><span class="pill">Tech E&amp;O</span><span class="pill">Cyber</span></div></article>
      <article class="card"><h3>Series A</h3><p>Protects you, your board, and helps you close bigger deals</p><div class="pills"><span class="pill">CGL</span><span class="pill">D&amp;O</span><span class="pill">Tech E&amp;O</span><span class="pill">Cyber</span><span class="pill">Media</span><span class="pill">EPLI</span></div></article>
      <article class="card"><h3>Growth Stage</h3><p>Protection for leadership risk, transactions, and scale</p><div class="pills"><span class="pill">CGL</span><span class="pill">D&amp;O</span><span class="pill">Tech E&amp;O</span><span class="pill">Cyber</span><span class="pill">Media</span><span class="pill">EPLI</span><span class="pill">Fiduciary</span></div></article>
      <article class="card"><h3>Custom Package</h3><p>Know exactly what you need? Pick the policies that fit your business best</p></article>
    </div>
  </section>
  <section class="policies">
    <h2>Explore Our Main Policies</h2>
    <div class="grid">
      <article class="card"><h3>Commercial General Liability (CGL)</h3><p>Protects your business against third-party claims for bodily injury, property damage, and personal or advertising injury.</p></article>
      <article class="card"><h3>Cyber Liability</h3><p>Protects against losses and claims from data breaches, cyberattacks, and network security failures.</p></article>
      <article class="card"><h3>Tech E&amp;O</h3><p>Covers claims alleging your technology products or services failed to perform as intended.</p></article>
      <article class="card"><h3>Directors &amp; Officers</h3><p>Covers claims made against company leaders for alleged wrongful acts in managing the business.</p></article>
    </div>
  </section>
  <section class="faq">
    <h2>How much does startup insurance cost?</h2>
    <details open><summary>How much does startup insurance cost?</summary><p>Eligible pre-seed and seed startups often pay $2,000 to $5,000 per year for basic coverage, while Series A companies may pay $5,000 to $15,000 annually. Get an instant quote online, no sales call required.</p></details>
    <details><summary>Which coverages do I actually need?</summary><p>Pre-seed and seed usually need General Liability, D&amp;O, Tech E&amp;O, and Cyber. Series A adds Media and EPLI. Growth-stage companies add Fiduciary.</p></details>
    <details><summary>How is Corgi different from a traditional broker?</summary><p>No middlemen: Corgi is a full-stack insurance platform. Instant quotes, same-day binding, and one team managing every policy.</p></details>
  </section>
  <footer>
    Coverage may be underwritten through affiliated or partner carriers, including Corgi Insurance Company, Inc.<br/>
    <a href="${esc(publicUrl)}/agent.json">Agent card</a> · <a href="${esc(publicUrl)}/llms.txt">Connect prompt</a>
  </footer>
  ${corgiWidget(publicUrl, room.run.id)}
</body>
</html>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
