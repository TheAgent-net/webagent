# Data processing agreement (outline)

> **Template. Legal review is necessary.** This outline is not a contract and not legal advice. Both legal teams must review it and complete it before anyone signs.

Replace each `[value]`. Each section below becomes one clause.

## 1. Parties

- **Controller:** [Company legal name], [address], [registration number]. The "Customer".
- **Processor:** [Provider legal name], [address], [registration number]. The "Provider".

## 2. Subject and duration

- Subject: the Provider hosts an AI assistant on the Customer website and stores its conversations.
- Duration: the same as the main service agreement dated [date].

## 3. Processing scope

| Item | Value |
| --- | --- |
| Nature of processing | Collect, store, analyze, transmit, and delete. |
| Purpose | Answer visitor questions. Send handoff requests. Show conversation analytics to the Customer. Protect the service from abuse. |
| Data subjects | Visitors to the Customer website who use the assistant. Automated agents that call the assistant. |
| Data categories | Questions and replies. Page URL. Session id. User agent. Salted hash of the IP address. Feedback votes and notes. Contact data only when a visitor types it. |
| Special categories | None intended. The assistant tells visitors not to enter them. |

## 4. Customer instructions

- The Provider processes personal data only on documented instructions from the Customer.
- This agreement and the dashboard settings are the instructions.
- The Provider tells the Customer when an instruction breaks data protection law.

## 5. Subprocessors

The Customer gives general approval for these subprocessors. The Provider tells the Customer [30] days before it adds or changes one. The Customer can object.

| Subprocessor | Purpose | Location |
| --- | --- | --- |
| [Cloud host, for example Amazon Web Services] | Hosting and storage | [region] |
| [Cloudflare] | Network edge, TLS, and protection | [global] |
| [AI model provider, for example OpenAI] | Write replies and embeddings | [region] |
| [Supermemory, only when the Customer uses it] | Search over site pages | [region] |
| [Mail or chat service for handoff] | Send handoff messages | [region] |

## 6. Retention

- Conversations, turns, and feedback: [90] days after the last message. Then the Provider deletes them.
- Traffic events: [30] days. The IP address is only a salted hash.
- Counts without personal data: kept for the term of the agreement.
- Backups: deleted within [30] days after the source data.

## 7. Deletion and return

- On request, the Provider deletes the conversations of one visitor within [30] days.
- At the end of the agreement, the Provider returns the data in JSON or deletes it, as the Customer selects, within [30] days.
- The Provider confirms each deletion in writing.

## 8. Security measures

- TLS for all traffic between the visitor, the edge, and the host.
- The raw IP address is not stored. The Provider stores a salted one-way hash.
- Secrets live only in environment files with owner-only access. They are not in source code or logs.
- Access to the dashboard needs a key or a signed session. Each Customer sees only its own data.
- Least access for staff. Access logs on the host.
- Model and retrieval providers receive only the text that they need to answer.
- Security updates on the host within [14] days of release.

## 9. Personal data breach

- The Provider tells the Customer within [48] hours after it finds a breach.
- The notice says what happened, which data, how many people, and what the Provider does about it.

## 10. Assistance and audit

- The Provider helps the Customer answer requests from data subjects.
- The Provider helps with data protection impact assessments when the Customer asks.
- The Customer can audit once each year with [30] days notice, or receive a third-party report instead.

## 11. International transfers

- Transfers outside [the EEA / the UK] use [Standard Contractual Clauses, module 2 or 3].

## 12. Signatures

| | Customer | Provider |
| --- | --- | --- |
| Name | | |
| Title | | |
| Date | | |
| Signature | | |
