# Graph Report - workspace  (2026-09-02)

## Corpus Check
- 24 files · ~10,559 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 202 nodes · 411 edges · 10 communities (7 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eb5cfcbf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- harness.ts
- run.ts
- Run
- index.ts
- package.json
- compilerOptions
- Agent instructions
- ModelShelf
- Context
- Tool

## God Nodes (most connected - your core abstractions)
1. `Run` - 37 edges
2. `Harness` - 22 edges
3. `Context` - 17 edges
4. `Tool` - 14 edges
5. `oneStep()` - 12 edges
6. `Assembler` - 11 edges
7. `Scheduler` - 10 edges
8. `ModelShelf` - 10 edges
9. `intake()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Harness` --references--> `Scheduler`  [EXTRACTED]
  src/harness.ts → src/scheduler.ts
- `ToolDef` --references--> `Harness`  [EXTRACTED]
  src/mcp.ts → src/harness.ts
- `CreateOpts` --references--> `Context`  [EXTRACTED]
  src/run.ts → src/context.ts
- `CreateOpts` --references--> `HookBag`  [EXTRACTED]
  src/run.ts → src/hooks.ts
- `CreateOpts` --references--> `Tool`  [EXTRACTED]
  src/run.ts → src/tools.ts

## Import Cycles
- None detected.

## Communities (10 total, 3 thin omitted)

### Community 0 - "harness.ts"
Cohesion: 0.10
Nodes (13): Assembled, Assembler, EMPTY, parseOnce(), Slot, ToolCall, Message, nextId() (+5 more)

### Community 1 - "run.ts"
Cohesion: 0.16
Nodes (20): decide(), HookBag, Verdict, findTool(), LoopHost, oneStep(), tokenTee(), blockedAction() (+12 more)

### Community 3 - "index.ts"
Cohesion: 0.09
Nodes (24): args, h, defaultHarness(), Harness, intake(), BY_NAME, dispatch(), ID (+16 more)

### Community 4 - "package.json"
Cohesion: 0.11
Nodes (18): bin, webagent, description, devDependencies, @types/bun, typescript, engines, bun (+10 more)

### Community 5 - "compilerOptions"
Cohesion: 0.13
Nodes (14): bun-types, src/**/*.ts, test/**/*.ts, compilerOptions, allowImportingTsExtensions, module, moduleResolution, noEmit (+6 more)

### Community 6 - "Agent instructions"
Cohesion: 0.17
Nodes (11): Agent instructions, Approved technical nouns (this project), Approved technical verbs (this project), Comments, logs, and docs, Compound names (Section 2), Consistency (Rule 9.4), How to encode names in this repo, Nomenclature — ASD-STE100 (+3 more)

### Community 9 - "Tool"
Cohesion: 0.12
Nodes (5): DANGER, guardTool(), Tool, ToolInfo, ToolShelf

## Knowledge Gaps
- **46 isolated node(s):** `Word rules (Section 1)`, `Compound names (Section 2)`, `Verbs and voice (Section 3)`, `Consistency (Rule 9.4)`, `How to encode names in this repo` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 75 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Run` connect `Run` to `harness.ts`, `run.ts`, `index.ts`, `Context`, `Tool`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Why does `Context` connect `Context` to `harness.ts`, `run.ts`, `Run`, `index.ts`, `Tool`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `Harness` connect `index.ts` to `harness.ts`, `Tool`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `oneStep()` (e.g. with `.end()` and `.get()`) actually correct?**
  _`oneStep()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Word rules (Section 1)`, `Compound names (Section 2)`, `Verbs and voice (Section 3)` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09915966386554621 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09176788124156546 - nodes in this community are weakly interconnected._