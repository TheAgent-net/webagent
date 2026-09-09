---
url: https://docs.composio.dev/kb/guide/platform-rate-limits
title: Platform API Rate Limits | Composio
description: Public guidance for organization-level Composio API limits and 429 handling.
status: 200
---

Guides

Browse Knowledge Base

# Platform API Rate Limits

Copy page

## [Organization API limits and 429 handling](https://docs.composio.dev/kb/guide/platform-rate-limits\#organization-api-limits-and-429-handling)

Composio applies a shared API budget per organization across authenticated endpoints. Current published limits are Starter and Hobby: 2,000 requests per minute; Growth: 10,000 per minute; Enterprise: custom. Check the [current rate-limit documentation](https://docs.composio.dev/reference/rate-limits) before quoting a plan limit, and do not describe Enterprise as unlimited.

Rate-limit responses include remaining/window information, and a 429 includes `Retry-After`. Honor `Retry-After` before retrying. Provider quotas such as Google API limits are separate and can throttle a tool even when the Composio organization has capacity.

If an upgraded organization still sees its old 2,000-per-minute ceiling, share the error time and response rate-limit headers with support.

Last verified Aug 12, 2026

Feedback

### On this page

[Organization API limits and 429 handling](https://docs.composio.dev/kb/guide/platform-rate-limits#organization-api-limits-and-429-handling)
