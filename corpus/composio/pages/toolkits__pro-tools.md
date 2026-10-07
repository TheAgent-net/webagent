---
url: https://docs.composio.dev/toolkits/pro-tools
title: Premium Tools | Composio
description: Pricing and limits for premium tools in Composio
status: 200
---

[← All Toolkits](https://docs.composio.dev/toolkits)

# Premium Tools

Copy page

Some tool calls cost more to run — search APIs, code sandboxes, ML inference. We call those premium tools and price them separately.

## [What counts as a premium tool?](https://docs.composio.dev/toolkits/pro-tools\#what-counts-as-a-premium-tool)

[**Search APIs** \\
Composio Search, Perplexity, Exa, SerpAPI](https://docs.composio.dev/toolkits/composio_search) [**Code execution** \\
Sandboxed runtimes like E2B](https://docs.composio.dev/toolkits/codeinterpreter)

### Web scraping & data extraction

Crawlers and structured extraction

### AI/ML inference

Hosted model calls and embeddings

### Document processing & OCR

PDF, image, and document parsing

### Compute-intensive operations

Long-running or heavy transforms

## [Pricing](https://docs.composio.dev/toolkits/pro-tools\#pricing)

Premium tools run on paid third-party providers (web search, media generation, browser automation, and similar). Composio passes the provider's price through with a 5% platform fee — there is no markup on top of that. Approximate per-call prices for each provider are listed in the **Premium tools** section of the [pricing page](https://composio.dev/pricing).

- **Hobby** includes up to $2/month of premium tool usage.
- **Pro** includes everything in Hobby plus a $29 monthly usage credit, which also covers premium tool calls.
- Prices depend on the provider and can change with advance notice — check the [pricing page](https://composio.dev/pricing) for current rates.

## [Rate limits](https://docs.composio.dev/toolkits/pro-tools\#rate-limits)

Premium tools have their own, lower rate limits. These apply to premium tool executions only and are separate from your organization's overall API rate limit — see [Rate Limits](https://docs.composio.dev/reference/rate-limits) for that. If you need more, [contact us](mailto:billing@composio.dev).

| Plan | Premium Tool Calls Rate Limit |
| --- | --- |
| Hobby | 1,000/hour |
| Pro | 10,000/hour |
| Enterprise | Custom |

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/toolkits/pro-tools.mdx)
