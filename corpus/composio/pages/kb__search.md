---
url: https://docs.composio.dev/kb/search?q=Enhanced%20Control
title: Search Composio knowledge | Composio
description: Search all public Composio product knowledge.
status: 200
---

[Knowledge Base](https://docs.composio.dev/kb)

# Search Composio support knowledge

Find public troubleshooting answers, setup guidance, exact errors, and toolkit-specific fixes.

Search support knowledge

Search

## Results for “Enhanced Control”

20 results

01. [Support\\
    **Tool Router Sessions**\\
    \\
    EnhancedControl requires client support for MCP elicitation\\
    \\
    For You's EnhancedControl approval flow relies on MCP elicitation. It works only with clients that advertise and implement that capability. If a client does not support elicitation, use a support…](https://docs.composio.dev/kb/guide/mcp-tool-router-sessions)
02. [Changelog\\
    **MCP (Model Control Protocol) & Experimental ToolRouter**\\
    \\
    Migration Benefits\\
    \\
    Better Security: User-specific sessions with isolated access - EnhancedControl: Fine-grained toolkit and tool management - Framework Integration: Native support for modern AI frameworks - Scalability: Better resource management and use…](https://docs.composio.dev/docs/changelog/2025/09/26)
03. [Documentation\\
    **Custom MCP**\\
    \\
    What you manage and what Composio handles\\
    \| Area \| You manage \| Composio handles \| \| --- \| --- \| --- \| \| Server \| Deploying and operating the remote MCP server at a public HTTPS URL. \| Connecting to the URL for tool discovery and execution. Composio does no…](https://docs.composio.dev/docs/extending-sessions/custom-mcp)
04. [Documentation\\
    **Shared connections**\\
    \\
    Common ACL patterns\\
    \\
    The table below shows the inner shape of the ACL block (aclConfigForShared in TypeScript, acl\_config\_for\_shared in Python). Wrap it inside the experimental block at the call site. Field names are camelCase in the TypeScript samples; Pyth…](https://docs.composio.dev/docs/extending-sessions/shared-connections)
05. [Documentation\\
    **Controlling scopes**\\
    \\
    Use the auth config in a session\\
    \\
    Setting scopes on an auth config does nothing until a session uses it. Pass the auth config ID to authConfigs (keyed by toolkit) when you create the session, and the session requests your scopes when the user connects that t…](https://docs.composio.dev/docs/authentication/controlling-scopes)
06. [Support\\
    **Create Read-Only and Restricted Composio Sessions**\\
    \\
    Combine provider scopes with session tool restrictions\\
    \\
    OAuth scopes control what the provider grants to a connected account. Session filters control which Composio tools the agent can discover and execute. Use both layers for least privilege: request only t…](https://docs.composio.dev/kb/guide/platform-session-tool-policies)
07. [API Reference\\
    **MCP**\\
    \> Deprecated: Use a session's MCP endpoint instead: composio.create(user\_id, mcp=True) returns a session that exposes session.mcp.url / session.mcp.headers. MCP is now opt-in per session; this standalone composio.mcp server-management API is kept only for b…](https://docs.composio.dev/reference/sdk-reference/python/mcp)
08. [Documentation\\
    **Configuring Sessions**\\
    \\
    Filtering tools by tags\\
    \\
    Tools carry behavior tags that you can filter on. The available tags are: \| Tag \| Description \| \|-----\|-------------\| \| readOnlyHint \| Tools that only read data \| \| destructiveHint \| Tools that modify or delete data \| \| idempotentHin…](https://docs.composio.dev/docs/configuring-sessions)
09. [Documentation\\
    **Custom Tools and Toolkits**\\
    \\
    Extension Tool\\
    \\
    Install TypeScript: Python: Initialize the client TypeScript: typescript import { Composio } from "@composio/core"; const composio = new Composio({ apiKey: "your\_api\_key" }); Python: python from composio import Composio composio = Composio(ap…](https://docs.composio.dev/docs/extending-sessions/custom-tools-and-toolkits)
10. [Documentation\\
    **Eve**\\
    \\
    Require approval\\
    \\
    Map Composio tools onto eve's durable approval flow with needsApproval. The callback receives the original Composio tool plus eve's approval context: typescript // @noErrors import { EveProvider, requireApprovalForTools } from '@composio/ex…](https://docs.composio.dev/docs/providers/eve)
11. [Support\\
    **Compliance, Data Retention, and Model Training**\\
    \\
    FedRAMP\\
    \\
    Composio is not FedRAMP authorized.](https://docs.composio.dev/kb/guide/platform-compliance-data-handling)
12. [Support\\
    **Supabase**\\
    \\
    Configure Supabase tools and endpoints\\
    \\
    Add the SQL tool to the MCP server when needed. SUPABASE\_BETA\_RUN\_SQL\_QUERY is still supported. Create a Supabase integration/MCP server and explicitly configure the Supabase SQL tool in that MCP server if it is not sh…](https://docs.composio.dev/kb/guide/toolkits-supabase)
13. [Support\\
    **Confluence**\\
    \\
    Execute Confluence tools with the correct account\\
    \\
    Pass the connected account ID, not the auth config ID. For Confluence tool execution, pass the connected account ID. Do not pass the auth config ID/integration ID in the connected account field. Older SDK ve…](https://docs.composio.dev/kb/guide/toolkits-confluence)
14. [Support\\
    **SharePoint**\\
    \\
    Disable destructive SharePoint tools with destructiveHint or explicit tool filters\\
    \\
    At session creation, disable tools carrying destructiveHint globally or for selected toolkits such as SharePoint and OneDrive. For finer control, explicitly allow or deny des…](https://docs.composio.dev/kb/guide/toolkits-sharepoint)
15. [Documentation\\
    **LangChain**\\
    \\
    The LangChain provider transforms each Composio tool into a LangChain DynamicStructuredTool with built-in execution. You can hand the tools to create\_agent in Python or wire them into a graph node in TypeScript, and the framework runs the tool loo…](https://docs.composio.dev/docs/providers/langchain)
16. [Documentation\\
    **Using sessions via MCP**\\
    \\
    Wire it into your framework\\
    \\
    Pass session.mcp.url and session.mcp.headers to your framework's MCP client. OpenAI Agents (Python): python from agents import Agent, HostedMCPTool agent = Agent( name="Assistant", tools=\[ HostedMCPTool( tool\_config={ "type": "mc…](https://docs.composio.dev/docs/sessions-via-mcp)\
17. [Documentation\\
    **Migrating from Direct Tools to Sessions**\\
    \\
    Restricting toolkits\\
    \\
    If you were fetching tools from specific toolkits, you can restrict the session to only those toolkits: Python: python session = composio.create( user\_id="user\_123", toolkits=\["github", "gmail", "slack"\], auth\_configs={ "github": "ac\_yo…](https://docs.composio.dev/docs/migration-guide/direct-to-sessions)\
18. [Support\\
    **Jira**\\
    \\
    Keep Jira OAuth scopes within Atlassian's supported set\\
    \\
    Jira/Atlassian limits an OAuth app to 50 scopes, and unsupported or mismatched scopes can make consent fail. For a customer-owned app, keep the auth config aligned with the scopes approved on that Atla…](https://docs.composio.dev/kb/guide/toolkits-jira)\
19. [Support\\
    **OneDrive**\\
    \\
    Use current OneDrive tools and file inputs\\
    \\
    Pass version=latest when folder behavior looks stale. If OneDrive folder listing or related tool behavior appears stale, pass version: "latest" in the tool execution request so the call uses the latest toolkit vers…](https://docs.composio.dev/kb/guide/toolkits-one-drive)\
20. [Support\\
    **Intercom**\\
    \\
    Use External Pages or a custom agent when connecting MCP knowledge to Intercom Fin\\
    \\
    Composio does not control how Intercom Fin retrieves knowledge inside Intercom. For this use case, either push MCP-derived content into Fin's Content Library by creating and…](https://docs.composio.dev/kb/guide/toolkits-intercom)
