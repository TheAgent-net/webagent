# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Marketing site: static HTML/CSS in `web/`, self-hosted fonts, no build step, served by the Bun cloud at `/`.
Dashboard: server-rendered HTML in core (`src/admin/`), no framework, no external scripts.
Widget: one self-contained script (`src/widget/widget.ts`) that runs inside the customer's site.

## Users

- **Buyer:** founders and growth or developer-relations leads at AI and developer-tool startups. Their sites are docs-heavy. Both developers and AI agents visit them.
- **Dashboard user:** the same team after install. They read conversations, check agent traffic, and fix knowledge gaps once a week.
- **Site visitors (served, not sold to):** people who want an answer fast, and AI agents (assistants, agent browsers) that act for a person.

## Product Purpose

agentnet gives a website one agent for both kinds of visitor.

- People get short answers that show the site's own page elements in the chat, not long text.
- AI agents get a front door: `llms.txt`, an agent card, `POST /chat`, and MCP.
- The company sees every conversation and how many real agents came, separated from crawlers and scripts.

Success: a company installs one script tag in an afternoon, then sees agent traffic and conversations it could not see before.

## Positioning

Main message: agentnet gives every visitor the best personalised experience, people and AI agents alike.

- One agent answers humans and machines from the same knowledge.
- Answers render the site's real elements in place (tables, charts, diagrams), chosen by meaning.
- Agent analytics separates intelligent agents from bots without changes to the customer's site: signed requests (Web Bot Auth), published IP ranges, in-page agent-browser signals, and conversation scoring.

## Operating Context

- Onboarding: the company gives a URL, reviews the agent in a preview, pastes one script tag, optionally allows our origin in its CSP, and optionally connects Cloudflare read-only.
- Hosted multi-tenant service at `/t/<site>/…` or a custom domain.
- The dashboard is the weekly working surface: overview funnel, conversations, agent traffic, questions and knowledge gaps, install and settings.

## Capabilities and Constraints

- Built: multi-tenant cloud, stored conversations, visitor classification, in-chat visuals, GEPA prompt tuning, starter evals.
- In build: agent verification and scoring, dashboard, rate limits and caps, handoff, onboarding CLI, Supermemory retrieval provider.
- Undecided: pricing, public domain, sign-up flow. The site uses "Request access" until these exist.
- Naming in code follows `AGENTS.md` (ASD-STE100). User-facing copy uses short, plain, active sentences.

## Brand Commitments

- Name: **agentnet** (lowercase).
- Voice: cheerful, warm, and plain. Friendly, never hype. No contractions in product strings.
- The website must be professional, tasteful, and clean (user-confirmed), with a warm, optimistic tone. It must not read as gimmicky, themed, or loud.
- Tagline (user-supplied): "Enabling businesses to sell to AI agents."
- Logo (user-supplied): a plus split into two interlocking pieces by an S-shaped gap, white on a blue tile. Working SVG: `web/brand/mark.svg`, `web/brand/logo.svg` (redrawn; replace with the official file when available).
- Theme (user-supplied): a pixel-mosaic of square tiles graded from deep cobalt #0140CB through #0265F1, #227EFD, #529CFD, #80B6FC to pale #A0C8FB; brand blue #0A67FE; white, heavy, wide uppercase grotesk for the tagline.

## Evidence on Hand

- A working demo agent exists (built on a real AI company's site). It may be linked as a live demo but must stay unnamed. No customer names or logos.
- No testimonials, customer counts, benchmarks, or traffic numbers exist. Do not invent them. Charts on the site use clearly labeled example data.

## Product Principles

1. Answer first. The first two lines carry the answer.
2. Show, do not tell. Use the site's own elements before prose.
3. Both visitors are first-class. Humans and agents get the same truth.
4. Count only what is proven. Verified beats claimed. Label estimates.
5. No change to the customer's flow beyond one tag.

## Accessibility & Inclusion

WCAG 2.2 AA for the site, the dashboard, and the widget. Respect reduced motion. Full keyboard use.
