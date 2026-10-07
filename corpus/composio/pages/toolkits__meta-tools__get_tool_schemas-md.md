---
url: https://docs.composio.dev/toolkits/meta-tools/get_tool_schemas.md
title: https://docs.composio.dev/toolkits/meta-tools/get_tool_schemas.md
description: 
status: 200
---

\# Get Tool Schemas

\*\*Slug:\*\* \`COMPOSIO\_GET\_TOOL\_SCHEMAS\`
\*\*Tags:\*\* readOnlyHint

\## Input Parameters

\- \`tool\_slugs\` (array) \*(required)\*: Array of tool slugs to retrieve schemas for. Pass valid tool slugs; never invent.
\- \`include\` (array): Schema fields to include. Defaults to \["input\_schema"\]. Include "output\_schema" when calling tools in the workbench to validate response structure. (default: \`input\_schema\`)
\- \`session\_id\` (string): Pass the session\_id if you received one from a prior COMPOSIO\_SEARCH\_TOOLS call.

\## Response

\- \`data\` (object) \*(required)\*: Data from the action execution
 \- \`success\` (boolean) \*(required)\*: Whether all requested tool schemas were found
 \- \`tool\_schemas\` (object) \*(required)\*: Tool definitions keyed by tool\_slug for O(1) lookup. Same format as tool\_schemas in search response.
 \- \`not\_found\` (array): Tool slugs that were not found
 \- \`suggestions\` (object): For each not-found slug, a list of similar existing tool slugs (up to 3). Call again with the correct slugs to get their schemas.
 \- \`not\_found\_message\` (string): Action message when slugs are not found. Check suggestions for possible matches and call again with correct slugs.
\- \`error\` (string): Error if any occurred during the execution of the action
\- \`successful\` (boolean) \*(required)\*: Whether or not the action execution was successful or not

\-\-\-

📚 \*\*More documentation:\*\* \[View all docs\](https://docs.composio.dev/llms.txt) \| \[Glossary\](https://docs.composio.dev/llms.mdx/reference/glossary) \| \[Examples\](https://docs.composio.dev/llms.mdx/examples) \| \[API Reference\](https://docs.composio.dev/llms.mdx/reference)
