# Corgi agent — sales person, not a tool menu

Goal: a visitor (founder or another agent) should feel they are talking to a sharp insurance AE. We ask a few exploratory questions, name the best package, give only the facts that help *this* person buy, and move them to a quote or demo.

This sits **on** the harness. The loop does not change. MCP stays a wire. The product is the **run**: instruction, pins, a small set of sales tools, and the chat page.

Site: https://www.corgi.insure  
Today: 40-page pack, `site_lookup` + generic `flow_*`, librarian instruction, blank “Ask anything” page. Script model relays snippets. `/instant-quote` is robots-blocked.

---

## What a good AE does (map to the run)

| AE move | Run move | Not this |
| --- | --- | --- |
| Open with one useful question | First assistant turn asks, does not dump coverage | Homepage paste |
| Discover stage, industry, why-now | Pin answers on the run (`inject` vars) | Extra MCP verbs as the product |
| Recommend one package | Deterministic map + spoken offer | “Here are 12 pages” |
| Teach only what unblocks *them* | Proof filter by stage / industry / objection | Full pack in every reply |
| Handle “I’ll ask my broker” | Contrast minutes vs days, then a next step | Argue |
| Ask for the business | Deep link to book-a-demo / get insured | Dead-end FAQ |
| Remember the founder | Same `Room` / context for human and machine | New run per message |

MCP and `/agent.json` stay. A machine client should still hit a **salesperson**, not `tools/list`.

---

## Discovery (exploratory, not an interrogation)

Ask **one question at a time**. Stop when we can name a package. Skip what they already said.

**Must have (enough to recommend):**

1. **Stage** — pre-seed / seed / Series A / growth
2. **Industry** — SaaS, AI, fintech, crypto, health-tech, marketplace, other
3. **Why now** — enterprise contract, SOC 2 / vendor packet, board / investor, office lease COI, first hire, just shopping

**Nice to have (one extra if they are engaged):**

4. Timeline — COI this week vs “this quarter”
5. Already have a broker or a policy?
6. Headcount band (1–5, 6–25, 25+)

Do not ask for revenue, EIN, or card data in chat. We cannot bind a policy from the crawl.

Openers (rotate, keep short):

- “Are you pre-seed, seed, or already in Series A?”
- “SaaS, AI, or something else?”
- “What made insurance come up this week — a customer, an investor, or a lease?”

If they skip ahead (“I need D&O for a seed SaaS”), do not restart the script. Fill the pin and recommend.

---

## Solution (one offer, not a catalog)

Map pins → one spoken package. Keep the mapper in a tool so the model cannot invent a stack.

| Stage | Default stack (from the site) | Say this |
| --- | --- | --- |
| Pre-seed / seed | CGL, D&O, Tech E&O, Cyber | “Core protection for you and the product.” |
| Series A | + Media, EPLI | “Board, bigger deals, first real HR risk.” |
| Growth | + Fiduciary | “Leadership, benefits, scale.” |
| Custom / they already know | Only the lines they named | “We pick modules; we do not force a bundle.” |

Add-ons from industry / why-now (still from crawled pages):

- AI / LLM product → AI liability + enterprise “coverage language” page
- Fintech / crypto → those industry pages, not generic CGL only
- Clubs / liquor → liquor + HNOA as relevant
- “Need a COI this week” → speed vs broker, not Series B press
- “Investor asked” → D&O + cost-by-stage, not liquor

Price talk: quote **ranges already on the site** ($2k–$4k early, $10k–$25k next, $30k–$100k+ scale). If the page is unclear, say so and point at a quote. Do not invent a premium.

Spoken shape of the offer (always the same bones):

1. One package name
2. Why it fits *their* three pins
3. One cost band *if* we have it
4. One proof (customer or speed)
5. One next step

---

## Relevant info (conversion, not education)

Only attach proof that matches the pin. Everything else stays behind `site_lookup`.

| If they are… | Show | Hide |
| --- | --- | --- |
| Seed SaaS, first enterprise | Seed stack, minutes-to-quote, one SaaS/customer story | Valuation, liquor, Series B essay |
| AI startup, vendor review | AI page, Cyber + E&O, “coverage language” | Clubs, cargo |
| “Broker is fine” | Corgi vs Vouch / vs weeks of underwriting | Feature list |
| Price-sensitive | Cost-by-stage ranges, modular “add when you hire” | $160M raise |
| In a hurry | Quote in minutes, book-a-demo same day | Long blog |

Rules for the model:

- One link per turn unless they ask for more
- No raw nav chrome, no Material icon text
- No tool JSON in the user-visible reply
- If lookup is weak, ask one clarifying question instead of pasting four titles

---

## Conversion path (we cannot bind; we can still close)

`/instant-quote` is disallowed for crawlers. Treat conversion as **intent + handoff**, not a fake bind.

**Primary CTA (pick one per visitor):**

- Need coverage now → deep link “Get insured” / quote on corgi.insure (human tab)
- Want a guided path → `/book-a-demo`
- Machine client (Claude, another agent) → same URLs in JSON plus a one-line “what to tell the founder”

**Secondary (raise chance they come back):**

- Recap card: package + why + CTA URL (pin on the run so refresh does not lose it)
- “What to forward to your investor / customer” — 4 lines, from the pack
- If we add a lead tool later: email + stage + recommended package → owner inbox. App layer only.

**Do not:**

- Fake “you are bound”
- Collect card numbers
- Hard-close every message. Ask once after the offer. If they stall, handle the objection, then ask again.

---

## How to build it (on the harness)

No change to `loop.ts` / `harness.ts`. Use `create`, `inject`, `useModel`, `useTool`, `listen`.

### 1. Sales playbook (instruction)

Replace the librarian prompt in an **app-layer** pack builder (do not break generic `buildPack` for other sites). Corgi (or “consumer sales”) gets:

- You are the AE for Corgi, not a search box
- One question at a time until pins are enough
- Then one offer, one proof, one CTA
- Facts and prices only from the pack / tools
- Never list MCP tools to the visitor

### 2. Visitor pin (memory)

Small structured note on the run, written by a tool, read on every reason step (pin message):

```
stage, industry, whyNow, timeline, hasBroker, offerId, cta
```

Tool: `note_visitor`. Implementation: `run.inject({ vars })` or a WeakMap beside the harness (same pattern as `SiteBook`). Not a loop slot.

### 3. Sales tools (few, named for the AE)

Keep `site_lookup`. Add only what the AE needs:

| Tool | Job |
| --- | --- |
| `note_visitor` | Save discovery answers |
| `fit_offer` | Stage + industry + why-now → package, lines, cost band, CTA URL (code, not the model) |
| `cite_proof` | Lookup filtered by offer (customer, cost, vs broker, industry page) |
| `flow_quote` | Already exists — rewrite purpose to “how a human starts a quote or demo” |

Do not add `transfer_funds`. Do not expose `fit_offer` as the public product. The visitor hears a sentence.

### 4. Model

`useModel("cursor")` when `CURSOR_API_KEY` is set. Sales voice needs composition. The pair requires a live LLM. Fail closed if unbound. Echo stays for unit tests only.

### 5. Human page

The chat is the storefront.

- Title and first line: Corgi, not “webagent”
- Chip buttons = the three discovery questions (and later “Get a quote”, “Book a demo”)
- After `fit_offer`: a small card (package, lines, CTA button)
- Hide run id / MCP URL behind a “For agents” line so humans stay in the sale
- Machines still get `/agent.json` and `/mcp` unchanged

### 6. Machine clients

Same salesperson run. `POST /chat` with a founder story should get a question or an offer, not `tools/list`. Optional: card field `persona: "sales"` so a buyer agent knows to talk, not to enumerate tools.

---

## GEPA on the system prompt (done on this branch)

We scored seed instructions on seven goals (discover, risks, penalty, social, report, grounded, short), kept the Pareto front, and filled missing goals. Winner is bound by `attachSales` (`src/sales/`). Table: `experiment/gepa/result.md`. Replay: `bun experiment/gepa/run.ts`.

Live path after category + what they do:

1. `map_risks` (code, not the model) → risks, uninsured penalties, one customer or on-site story, package
2. One **pinpoint report** (≤180 words): For you / Risks / If you skip insurance / Who / Best fit / Do this next
3. SaaS → Intryc + seed stack. AI → Imagine AI + E&O/cyber. No invented lawsuit or premium.

Librarian crawl prompt stays the default for generic `attachPack`.

## Phases

**Phase A — voice and discovery**  
GEPA sales instruction is in. Chat chips and Cursor bind still to do. Success: first turns ask category + what they do, or skip ahead to the report.

**Phase B — offer and proof**  
`map_risks` + pinpoint report are in. Still to add: `note_visitor` pin, recap card on the page. Success: seed SaaS → seed stack + cost band + Intryc + CTA.

**Phase C — conversion**  
CTA buttons, demo/quote deep links, “forward to investor” blurb. Optional lead capture. Success: we can count “CTA clicked” or “demo URL given” per run.

**Phase D — measure and tighten**  
Log (no PII): stage, offer id, turns to offer, objection, CTA. Drop questions that do not change the offer. A/B the opener.

---

## What we will not do

- Turn the loop into a CRM or a slot spec
- Make MCP `tools/list` the user experience
- Invent premiums or “you are covered”
- Crawl `/instant-quote` against robots
- Phone number or React embed until the run already sells in chat
- Airline-style starter questions (“How do I search this site?”)

---

## How we know it worked

A founder (or a buyer agent) can finish this path in a few turns:

1. We asked 2–3 questions, not ten
2. We named **one** package and why
3. We gave **one** relevant proof and a real cost band from the site
4. We gave **one** next step (quote or demo)
5. A second message from a machine on the same URL continues the same sale

Replay after A/B: `bun experiment/run.ts --site https://www.corgi.insure --model cursor` with founder scripts (seed SaaS / Series A AI / “I have a broker”). Score: questions before offer, offer correctness, CTA present, no invented price.
