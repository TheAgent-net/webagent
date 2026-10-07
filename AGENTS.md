# Agent instructions

This file is mandatory for every coding agent that works in this repository.

## Nomenclature — ASD-STE100

Name every file, module, type, class, function, method, variable, constant, parameter, property, component, CLI verb, MCP tool, test, and comment with [ASD-STE100](https://www.asd-ste100.org/) Simplified Technical English (Issue 9).

Goal: one reader, one meaning, no guesswork.

Do not copy the STE dictionary into this repo. Apply the writing rules to identifiers. Keep TypeScript spelling (camelCase, PascalCase, SCREAMING_SNAKE). The English words inside those identifiers must obey STE.

### Word rules (Section 1)

- Use short, common American English words. One word has one meaning and one part of speech.
- A noun stays a noun. A verb stays a verb. Do not use `model` as a verb if `model` is the noun for an LLM adapter. Do not use `start` as a noun if `start` is the verb that runs the loop.
- Prefer one short technical noun over a long description. Example: `Run`, not `agentExecutionSession`.
- Do not use slang, jargon, or regional words (`brick`, `magic`, `foo`, `handleThingy`).
- Do not use two names for the same thing. If the type is `Harness`, do not also call it `engine`, `runtime`, or `kit` in new code.
- When this project already has an approved name, use that name. Do not invent a synonym.

### Compound names (Section 2)

- Keep a compound name to **three words or fewer** (`useModel`, `blockedAction`, `toolCall`).
- If the idea needs more than three words, write the full phrase in a comment once, then use a shorter approved name in code.
- The last word is the head: `ModelShelf` is a shelf. `ToolCall` is a call.

### Verbs and voice (Section 3)

- Functions and methods start with an approved verb: `start`, `stop`, `pause`, `cancel`, `fork`, `merge`, `inject`, `add`, `get`, `list`, `clear`.
- Describe an action with a verb, not a noun (`start()`, not `doStart()` or `startOperation()`).
- Use the active voice in names and comments (`guardTool`, not `toolGuarding`).

### Consistency (Rule 9.4)

- After you select a name, use that same name in the file, the type, the tests, the CLI, and the MCP tool.
- Match existing public names. `startAll`, `stepOnce`, `useModel`, and `getAvailableModels` are approved. Do not rename them unless a human asks.

## How to encode names in this repo

| Kind | Form | Rule |
| --- | --- | --- |
| File / module | one lowercase noun, `*.ts` | `run.ts`, `loop.ts`, `policy.ts`. Not `runManager.ts`. |
| Class / type / interface | PascalCase technical noun | `Harness`, `Run`, `Context`, `Assembler`. |
| Function / method | camelCase verb, optional noun | `start`, `useModel`, `blockedAction`. |
| Variable / parameter | camelCase noun | `run`, `modelId`, `toolCalls`. |
| Constant | SCREAMING_SNAKE of the same words | `PHASE_IDLE`, `MCP_PROTOCOL`. |
| Boolean | `is` / `has` + adjective, or a clear adjective | `shared`, `done`. Not `flag1`. |
| Test name | short, one behavior | `"no model bound fails closed"`. |
| CLI / MCP verb | same word as the TypeScript method | `pause` stays `pause`. |

Do not use:

- Abbreviations that a new reader cannot expand (`ex`, `tc`, `fn`, `h`, `a`) except as a **local** loop index (`i`) or a well-known protocol token (`id`, `url`, `mcp`).
- Metaphor names (`cake`, `slot`, `magic`, `wizard`).
- Prefix noise (`IRun`, `AbstractHarness`, `tmpUtilHelper`).
- Dual terms for one concept (`cancel` vs `abort` vs `kill` — this project uses `cancel` and `stop` with distinct meanings. Keep both. Do not add a third).

## Approved technical nouns (this project)

Use these names. Do not replace them with synonyms.

| Noun | Meaning |
| --- | --- |
| `Harness` | Shelf of models and tools, plus the run registry. |
| `Run` | One perceive → reason → act cycle with public controls. |
| `Context` | Copy-on-write message log. |
| `Message` | One frame in that log. |
| `Assembler` | Stream collector. Parses tool JSON once at `end()`. |
| `Scheduler` | In-flight cap. Wait-queue. No polling. |
| `Model` | Adapter that streams into an assembler. |
| `Tool` | Named function a run can call. |
| `Policy` | Fail-closed name check around tools. |
| `Hook` | Verdict around reason or tool (`allow`, `deny`, `redirect`). |
| `Intake` | HTTP edge. No reasoning. |
| `Loop` | One step: reason, then tools. |
| `Shelf` | Registry (`ModelShelf`, `ToolShelf`). |
| `Explain` | Snapshot of a run (`id`, `state`, `phase`, `step`, `model`, `lastText`). |

## Approved technical verbs (this project)

| Verb | Meaning |
| --- | --- |
| `create` | Make a new run. |
| `start` / `resume` | Run the loop until a reply, pause, or cancel. |
| `pause` | Finish the current step, then freeze. |
| `stop` | End the run. |
| `cancel` | Abort in-flight I/O. |
| `fork` | Child shares the context spine until a write. |
| `merge` | Absorb source into target. Stop source. |
| `inject` | Add user text, messages, model, or pinned vars. |
| `useModel` / `clearModel` | Bind or unbind the model for the next reason step. |
| `useTool` / `removeTool` | Attach or drop a tool on this run. |
| `stepOnce` / `retryStep` / `skipStep` | One cycle, or advance the counter. |
| `reason` | Model writes into the assembler. |
| `guard` | Wrap a tool so policy can block it. |

New names must follow the same pattern: short verb, one meaning, no synonym for a verb that already exists.

## Comments, logs, and docs

Write comments and user-facing strings in STE:

- Short sentences. One instruction per sentence.
- Active voice. Command form for instructions.
- No contractions (`do not`, not `don't`).
- No semicolon as a clause joiner.
- Prefer a vertical list when a sentence would pack several facts.

## When you add or rename something

1. Search the glossary above and the current module for an existing name.
2. If a name exists, use it.
3. If you must add a name, pick a short STE word (three words or fewer).
4. Use that same name in the type, the file, the test, and any HTTP/MCP/CLI surface.
5. After code changes, run `graphify update .` so the knowledge graph stays current.
