---
url: https://docs.composio.dev/reference/rate-limits
title: Rate Limits | Composio
description: Composio API rate limits by plan, rate limit headers, and best practices
status: 200
---

# Rate Limits

Copy page

Composio enforces rate limits **per organization** over a fixed one-minute window. Every authenticated endpoint draws from the same budget — tool execution, connected accounts, triggers, and the rest — so the limit below is your organization's total across all API calls.

## [Rate limits by plan](https://docs.composio.dev/reference/rate-limits\#rate-limits-by-plan)

| Plan | Rate limit | Window |
| --- | --- | --- |
| Hobby | 2,000 requests | 1 minute |
| Pro | 10,000 requests | 1 minute |
| Enterprise | Custom | - |

## [Rate limit headers](https://docs.composio.dev/reference/rate-limits\#rate-limit-headers)

Every response includes headers so you can track usage without guessing:

| Header | Description |
| --- | --- |
| `X-RateLimit` | Total requests allowed in the current window |
| `X-RateLimit-Remaining` | Requests remaining in the current window |
| `X-RateLimit-Window-Size` | Window size (e.g., `60s` for 60 seconds) |
| `Retry-After` | Seconds until the window resets (only on 429 responses) |

## [Rate limit response](https://docs.composio.dev/reference/rate-limits\#rate-limit-response)

When you exceed the rate limit, you'll receive a `429 Too Many Requests` response:

```
{
  "message": "Rate limit exceeded. Limit: 10000 requests per 1 minutes"
}
```

## [Best practices](https://docs.composio.dev/reference/rate-limits\#best-practices)

1. **Watch `X-RateLimit-Remaining`** — read it on each response to know how much headroom you have left in the window.

2. **Honor `Retry-After`** — on a `429`, wait the number of seconds it gives you before retrying instead of hammering the endpoint.

3. **Cache what doesn't change** — keep tool definitions and other static data client-side so you don't spend requests re-fetching them.


## [Need higher limits?](https://docs.composio.dev/reference/rate-limits\#need-higher-limits)

If you hit these limits regularly, upgrade your plan or [talk to us](https://calendly.com/composiohq/enterprise) about custom limits for your use case.

[**Errors** \\
\\
Understanding API error responses](https://docs.composio.dev/reference/errors) [**Pricing** \\
\\
Compare plans and limits](https://composio.dev/pricing)

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/rate-limits.mdx)

### On this page

[Rate limits by plan](https://docs.composio.dev/reference/rate-limits#rate-limits-by-plan) [Rate limit headers](https://docs.composio.dev/reference/rate-limits#rate-limit-headers) [Rate limit response](https://docs.composio.dev/reference/rate-limits#rate-limit-response) [Best practices](https://docs.composio.dev/reference/rate-limits#best-practices) [Need higher limits?](https://docs.composio.dev/reference/rate-limits#need-higher-limits)
