---
url: https://docs.composio.dev/docs/security/data-retention
title: Data retention | Composio
description: What Composio stores from tool calls, how long logs and files are retained, how to stop storing payloads, and where your data flows.
status: 200
---

Security and data

# Data retention

Copy page

Composio stores audit logs for tool executions so you can observe and debug your agents. You control whether the request and response payloads for each call are stored.

## [Customer data vs. your end users' data](https://docs.composio.dev/docs/security/data-retention\#customer-data-vs-your-end-users-data)

Throughout this guide, _you_ are the Composio customer. _Your end users_ are the people your agent acts on behalf of. Each end user is identified by the `user_id` you provide. Composio stores this value as supplied and uses it to associate connected accounts, sessions, and execution logs.

Tool requests and responses may contain additional end-user data. The **Log storage** setting controls whether these payloads are retained; it does not remove the `user_id` or other audit metadata.

## [What Composio stores](https://docs.composio.dev/docs/security/data-retention\#what-composio-stores)

Composio creates logs for tool executions and trigger events. These logs contain:

- For tool executions, the toolkit and action, execution status, connection and auth-config IDs, supplied `user_id`, timing, and runtime/source.
- By default, the **request arguments** and **response data** for each tool execution.
- For trigger events, similar audit metadata and, by default, the trigger payloads.

## [How long logs are retained](https://docs.composio.dev/docs/security/data-retention\#how-long-logs-are-retained)

Tool execution logs and trigger event logs are retained for up to **one year**, after which they are automatically deleted.

## [How long files are available](https://docs.composio.dev/docs/security/data-retention\#how-long-files-are-available)

When a tool uses or returns a file (an attachment, image, document, export, and so on), Composio stages it in temporary object storage and shares it through a presigned URL. The URL is valid for **1 hour by default**. You can configure this URL TTL per project in **Project Settings**, up to 24 hours.

Presigned URL expiry and file deletion are separate. When the URL expires, the link stops resolving, but that does not delete the underlying object. Files staged for tool execution are automatically deleted from temporary object storage after **24 hours**.

Workbench storage has two separate lifecycles:

- Files written to `/mnt/files` are backed by temporary object storage and are automatically deleted after **24 hours**.
- Other sandbox files, variables, and runtime state are temporary and may be cleared after approximately **12 hours** of inactivity.

## [Choose what we store: the Log storage setting](https://docs.composio.dev/docs/security/data-retention\#choose-what-we-store-the-log-storage-setting)

You control whether call payloads are stored for each project in **Settings → General → Log storage**:

- **Store all logs** (default) — Composio stores the full request and response payloads in the execution log.
- **Don't store data** — Composio does not store the request arguments or response data from your tool calls. It keeps only the audit record: which tool ran, when it ran, whether it succeeded, the relevant IDs, and timing information.

With **Don't store data**, Composio keeps an audit trail but does not retain your tool-call payloads (including your end users' data) in its logs. This setting also applies to [Proxy Execute](https://docs.composio.dev/docs/extending-sessions/proxy-execute). If Composio cannot retrieve your project's log-storage setting, Proxy Execute does not store the request or response payload.

![Log storage set to "Don't store data" in Project Settings, General](https://docs.composio.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flog-storage-dont-store-data.37v400hxoceyd.png&w=1920&q=75&dpl=dpl_76rwzowp1MpBYGBtr8eKScDoHaGu)

To stop storing payloads, open the Dashboard, choose your project, go to **Settings → General → Log storage**, and select **Don't store data**.

### [Changing the setting affects new calls](https://docs.composio.dev/docs/security/data-retention\#changing-the-setting-affects-new-calls)

You can switch between the two log-storage options at any time. Each change applies only to new calls:

- Selecting **Don't store data** stops Composio from storing payloads for new calls. It does **not** delete payloads that were already stored: existing logs stay available until they age out under the one-year retention window.
- Selecting **Store all logs** again resumes storing payloads for new calls. It does **not** backfill the period while payload storage was disabled.

Payloads for calls made while storage was disabled were never stored and cannot be recovered later.

## [Where your data goes](https://docs.composio.dev/docs/security/data-retention\#where-your-data-goes)

Choosing **Don't store data** stops Composio from persisting your payloads, but data may still pass through the following locations during execution:

- The **destination provider** that receives the tool call.
- **Composio's execution infrastructure** while the call runs.
- **Temporary object storage** for files used or returned by tool calls. Presigned URL expiry is configurable per project, while the underlying staged file is deleted after 24 hours. See [How long files are available](https://docs.composio.dev/docs/security/data-retention#how-long-files-are-available).
- Your configured **trigger destinations**, which receive trigger events in real time.
- An isolated third-party **code sandbox**, if you use Workbench or remote code execution. Ordinary Python or shell execution does not inherently send code or sandbox files to an LLM provider. Model-provider processing occurs only in the cases described below.

### [When Workbench uses an LLM](https://docs.composio.dev/docs/security/data-retention\#when-workbench-uses-an-llm)

When a task requires advanced processing, the agent or MCP client may use Workbench and call `invoke_llm` from the submitted code—for example, to summarize, analyze, extract, or generate content. Only the information passed to `invoke_llm` is sent to the model provider; sandbox files and previous results are not sent unless the submitted code includes them.

There is one separate case: if submitted Python contains a syntax error and automatic repair is enabled, Composio may send the code and error details to the configured model provider to fix it before execution. Valid Python and ordinary shell commands do not trigger this repair.

So "Don't store data" controls what Composio retains, not whether data is processed during execution. For the current list of our sub-processors and our data-handling terms, see the [Composio Trust Center](https://trust.composio.dev/subprocessors).

## [Stronger guarantees](https://docs.composio.dev/docs/security/data-retention\#stronger-guarantees)

If your organization needs a contractual zero-data-retention arrangement or shorter retention windows, [contact sales](https://composio.dev/contact?utm_source=docs). For our data-handling policies and sub-processor list, see the [Composio Trust Center](https://trust.composio.dev/).

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/docs/security/data-retention.mdx)

### On this page

[Customer data vs. your end users' data](https://docs.composio.dev/docs/security/data-retention#customer-data-vs-your-end-users-data) [What Composio stores](https://docs.composio.dev/docs/security/data-retention#what-composio-stores) [How long logs are retained](https://docs.composio.dev/docs/security/data-retention#how-long-logs-are-retained) [How long files are available](https://docs.composio.dev/docs/security/data-retention#how-long-files-are-available) [Choose what we store: the Log storage setting](https://docs.composio.dev/docs/security/data-retention#choose-what-we-store-the-log-storage-setting) [Changing the setting affects new calls](https://docs.composio.dev/docs/security/data-retention#changing-the-setting-affects-new-calls) [Where your data goes](https://docs.composio.dev/docs/security/data-retention#where-your-data-goes) [When Workbench uses an LLM](https://docs.composio.dev/docs/security/data-retention#when-workbench-uses-an-llm) [Stronger guarantees](https://docs.composio.dev/docs/security/data-retention#stronger-guarantees)
