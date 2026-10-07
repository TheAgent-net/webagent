---
url: https://docs.composio.dev/kb/guide/platform-compliance-data-handling
title: Compliance, Data Retention, and Model Training | Composio
description: Public guidance for data retention, model training, compliance, and enterprise security reviews.
status: 200
---

Guides

Browse Knowledge Base

# Compliance, Data Retention, and Model Training

Copy page

## [Canonical public sources](https://docs.composio.dev/kb/guide/platform-compliance-data-handling\#canonical-public-sources)

- The [security overview](https://docs.composio.dev/docs/security/overview) describes Composio's security controls, including organization and project isolation, encryption for credentials and keys, TLS in transit, token redaction, and webhook signing.
- The [data-retention documentation](https://docs.composio.dev/docs/security/data-retention) explains tool-call log retention, per-project log-storage controls, returned-file URL lifetime, and where data flows during execution.
- The [Composio Trust Center](https://trust.composio.dev/) provides current compliance reports and sub-processor information.

## [Zero data retention and no-training requirements](https://docs.composio.dev/kb/guide/platform-compliance-data-handling\#zero-data-retention-and-no-training-requirements)

Standard plans do not guarantee end-to-end zero data retention or zero training. The per-project **Don't store data** setting reduces what Composio stores, but it does not govern data retained or processed by third-party providers.

Customers who require contractual zero-data-retention, no-training, DPA, or security-review terms should use the Enterprise track so the requirements can be scoped explicitly.

## [Model training](https://docs.composio.dev/kb/guide/platform-compliance-data-handling\#model-training)

Do not infer a blanket no-training guarantee. Features that use third-party providers are also governed by those providers' terms. For an end-to-end contractual no-training requirement, use the Enterprise track.

## [FedRAMP](https://docs.composio.dev/kb/guide/platform-compliance-data-handling\#fedramp)

Composio is not FedRAMP authorized.

## [Third-party providers](https://docs.composio.dev/kb/guide/platform-compliance-data-handling\#third-party-providers)

Some toolkit executions and browser automation rely on third-party providers or sub-processors. Data can flow to those providers during execution, and their data and training terms can differ. Use the Trust Center and data-retention documentation for current public details.

Last verified Aug 12, 2026

Feedback

### On this page

[Canonical public sources](https://docs.composio.dev/kb/guide/platform-compliance-data-handling#canonical-public-sources) [Zero data retention and no-training requirements](https://docs.composio.dev/kb/guide/platform-compliance-data-handling#zero-data-retention-and-no-training-requirements) [Model training](https://docs.composio.dev/kb/guide/platform-compliance-data-handling#model-training) [FedRAMP](https://docs.composio.dev/kb/guide/platform-compliance-data-handling#fedramp) [Third-party providers](https://docs.composio.dev/kb/guide/platform-compliance-data-handling#third-party-providers)
