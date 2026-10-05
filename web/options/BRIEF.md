# agentnet homepage: shared brief for every design option

Every option uses this same content, so the options differ only in design.

## Top rule

The page must be very clean and must make the product clear at once.

- Within 5 seconds a visitor knows three things:
  - what agentnet is: one agent on your website, for people and for AI agents;
  - why it matters: every visitor gets an answer made for them;
  - what to do next: give us your site.
- The page has generous white space and one idea per section. Nothing decorative may compete with the message.
- The tone is cheerful, warm, and plain. It is friendly, never hype.

## Product truth (read `/home/user/webagent/PRODUCT.md`)

- agentnet adds one agent to a company's website.
- **People** get short answers. The first two lines answer the question. The answers show the site's own page elements (tables, charts, diagrams) inside the chat, not long text. "Explain more" gives more detail on request. A visitor can ask for a person on the team.
- **AI agents** get a front door: `/llms.txt`, an agent card at `/.well-known/agent-card.json`, `POST /chat` with sessions (JSON in, JSON out), and MCP with one `ask` tool. Signed agents are verified with Web Bot Auth (RFC 9421 HTTP message signatures) and published IP ranges.
- **The company** sees every conversation in a dashboard. It also sees how many real AI agents came, separated from crawlers and scripts.
- **Install:** give us your URL, review your agent in a preview, then paste one script tag. No other change to the site is needed.
- **Never invent** customers, logos, testimonials, prices, user counts, or benchmarks. Label every example "Example". The example site is "Acme Docs" and the example person is "Maya".

## Sections, in order

Copy below is a base. Adjust the words to fit your direction, but keep the facts. Use short sentences and no contractions.

1. **Nav:** agentnet wordmark · How it works · For agents · Analytics · Install · "Sign in" (link `/admin`) · primary button "Get your agent" (anchors to the form).
2. **Hero:**
   - One headline that carries the main message (every visitor gets an experience made for them).
   - One short line that says what agentnet is: "agentnet adds one agent to your website. It answers every person and every AI agent with what fits them, from your own pages."
   - The **working action**: a form with "Your website" (url) and "Work email" (email), and the button "Get your agent".
     - On submit, POST JSON `{site, email}` to `/access`.
     - Show a friendly inline thank-you on success, and a clear error with a retry on failure. Validate both fields first.
   - The **proof** (the product working, as real HTML):
     - Maya asks "Which plan fits a team of five?" The agent answers in two lines plus a small plan table rebuilt in the chat.
     - A verified ChatGPT agent sends `POST /chat {"text": "Compare plans for a five-person team"}` and gets clean JSON back.
     - Mark it "Example".
3. **How it works:** three parts, for people, for agents, and for you, each in one or two sentences. Do not use three identical icon cards. Show each part through your direction's own form.
4. **Made for each visitor:** the same question answered two ways.
   - Left or first: a generic chatbot's wall of text.
   - Right or second: agentnet's two-line answer with the table.
   - Caption: "Same question. One answer is made for the person asking."
5. **For agents:**
   - A short code sample: a `curl` of `POST https://agentnet.it.com/t/acme/chat` and the JSON reply (`lastText`, `session`, `visuals`).
   - One line about MCP (`ask` tool) and `llms.txt`.
   - One line about verification (signed requests and published IP ranges).
6. **Analytics:** an excerpt of the dashboard with example data.
   - The agent funnel: agents seen (129) → read llms.txt or agent card (77) → talked (69) → intelligent multi-turn (32).
   - A short list of agent families: ChatGPT, Claude, Perplexity, agent browsers.
   - Label it "Example data".
7. **Install:** three steps.
   1. Give us your URL. We build your agent from your pages.
   2. Review it in a preview.
   3. Paste one tag: `<script src="https://agentnet.it.com/t/your-site/widget.js" async></script>`.

   Add a working "Copy" button with "Copied" feedback.
8. **Trust:** short facts only.
   - Raw IP addresses are never stored.
   - Answers come only from your own pages.
   - You set rate limits and a monthly cap, and you can pause any time.
   - Visitors can ask for a person on your team.
9. **Close:** one short cheerful line and the same form again (or a button that scrolls to it). Add a "See a live agent" link to `https://supermemory.agentnet.it.com/` with the label "See a live agent on a developer docs site". Do not name the company.
10. **Footer:** agentnet, a small link set, and © 2026 agentnet.

## Build rules

- **Files:** plain static HTML, CSS, and a little vanilla JS, with no framework and no build step. Put the files only in your folder: `web/options/<your-folder>/index.html`, plus `style.css`, `site.js`, and `fonts/`.
- **Fonts:** self-hosted woff2, latin subset, in your `fonts/` folder. Never load fonts.googleapis.com at runtime. You may download from Google Fonts once with curl and a Chrome user agent to get woff2.
- **No external scripts or images.** Draw every illustration and icon as inline SVG, in one consistent stroke and style. No emoji or Unicode glyphs as icons.
- **Accessibility:** WCAG 2.2 AA contrast, real focus rings, full keyboard use, `prefers-reduced-motion`, and semantic landmarks and headings.
- **Responsive:** check 1440 wide and 390 wide, with no horizontal scroll and a 16px side gutter on phones.
- **Before you write any page code,** read and follow:
  - `/tmp/claude-0/-home-user-webagent/59a10893-4cf0-5880-8610-66d869b4d509/scratchpad/impeccable/.claude/skills/impeccable/reference/craft-floor.md`
  - `/tmp/claude-0/-home-user-webagent/59a10893-4cf0-5880-8610-66d869b4d509/scratchpad/impeccable/.claude/skills/impeccable/reference/mode-persuade.md`
- **The bans in particular:**
  - no kicker or eyebrow label above a heading;
  - no 01/02/03 section numbers (the install steps are a real sequence, so numbers are fine there);
  - no same-size icon-card grids;
  - no hero-metric template;
  - no gradient text, no glass, no colored side borders, no hard offset shadows;
  - no mono as costume (mono only for code, paths, and numbers);
  - theme the text selection, focus rings, caret, and scrollbars from your palette.
- **Motion:** one authored signature moment, done well. Content is visible by default.
