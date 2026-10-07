/**
 * GEPA-style prompt search for the Composio public agent.
 * Score seeds on a Pareto set, reflect, mutate the front, keep the winner.
 */
export interface AppsGoalScore {
  probe: number;
  a2a: number;
  usecase: number;
  flow: number;
  pinpoint: number;
  grounded: number;
  short: number;
}

export interface AppsPromptCand {
  id: string;
  gen: number;
  text: string;
  score: AppsGoalScore;
  mean: number;
}

const GOALS: (keyof AppsGoalScore)[] = [
  "probe",
  "a2a",
  "usecase",
  "flow",
  "pinpoint",
  "grounded",
  "short",
];

export function scoreAppsPrompt(text: string): AppsGoalScore {
  const t = text.toLowerCase();
  return {
    probe: hit(t, [
      /ask (a few |few )?questions/,
      /one or two questions per turn|one question per turn/,
      /what (are you|it is|they are) (already )?(doing|building|working)/,
      /if they already said it/,
    ]),
    a2a: hit(t, [
      /a2a/,
      /peer agent/,
      /probe (that |the peer )?agent/,
      /working on/,
    ]),
    usecase: hit(t, [
      /use case/,
      /choose composio/,
      /why (this |composio )?fits/,
      /managed auth|session\.tools/,
    ]),
    flow: hit(t, [
      /\*\*flow:\*\*|flow:/,
      /trigger/,
      /\*\*settings:\*\*|settings:/,
      /composio\.create \+ session\.tools/,
    ]),
    pinpoint: hit(t, [
      /pinpoint/,
      /not semantically close|semantically close apps/,
      /entire flow/,
      /pinpointed implementation/,
    ]),
    grounded: hit(t, [
      /recommend_app/,
      /debug_docs/,
      /do not invent/,
      /graph has no match|if the graph has no match/,
    ]),
    short: hit(t, [
      /220 words|under 220/,
      /catalog dump/,
      /one next step/,
      /no tool json/,
    ]),
  };
}

function hit(text: string, rules: RegExp[]): number {
  let n = 0;
  for (const r of rules) if (r.test(text)) n++;
  return n / rules.length;
}

export function meanAppsScore(s: AppsGoalScore): number {
  let t = 0;
  for (const k of GOALS) t += s[k];
  return t / GOALS.length;
}

export function onAppsFront(cands: AppsPromptCand[]): AppsPromptCand[] {
  return cands.filter((a) => !cands.some((b) => b.id !== a.id && dominates(b.score, a.score)));
}

function dominates(a: AppsGoalScore, b: AppsGoalScore): boolean {
  let better = false;
  for (const k of GOALS) {
    if (a[k] < b[k] - 1e-9) return false;
    if (a[k] > b[k] + 1e-9) better = true;
  }
  return better;
}

export function runAppsGepa(seeds: { id: string; text: string }[]): {
  winner: AppsPromptCand;
  all: AppsPromptCand[];
  front: AppsPromptCand[];
} {
  const gen0 = seeds.map((s) => cand(s.id, 0, s.text));
  const notes = reflect(gen0);
  const mutated = notes.map((n, i) => cand("m" + (i + 1), 1, n.text));
  const all = [...gen0, ...mutated];
  const front = onAppsFront(all);
  const winner = front
    .slice()
    .sort((a, b) => b.mean - a.mean || b.score.a2a - a.score.a2a || b.score.usecase - a.score.usecase)[0]!;
  return { winner, all, front };
}

function cand(id: string, gen: number, text: string): AppsPromptCand {
  const score = scoreAppsPrompt(text);
  return { id, gen, text, score, mean: meanAppsScore(score) };
}

function reflect(cands: AppsPromptCand[]): { id: string; text: string }[] {
  const best = cands.slice().sort((a, b) => b.mean - a.mean)[0]!;
  const missing = GOALS.filter((g) => best.score[g] < 1);
  const extra = missing
    .map((g) => {
      if (g === "probe") {
        return "Ask a few questions back. One or two questions per turn. Ask what they are already doing. If they already said it, do not re-ask.";
      }
      if (g === "a2a") {
        return "A2A is the main use case. Probe the peer agent for different things it is working on.";
      }
      if (g === "usecase") {
        return "Come up with a use case that makes them choose Composio. Say why this fits: managed auth and session.tools, specific to their work.";
      }
      if (g === "flow") {
        return "**Flow:** trigger → connect account → tools → next action. **Settings:** auth type, scopes, composio.create + session.tools.";
      }
      if (g === "pinpoint") {
        return "Give a pinpointed implementation. Do not answer with semantically close apps. Reply with one entire flow.";
      }
      if (g === "grounded") {
        return "Call recommend_app then debug_docs on errors. Do not invent a tool slug. If the graph has no match, say so.";
      }
      return "Keep the whole flow under 220 words. You are not a catalog dump. One next step. No tool JSON in the user-visible reply.";
    })
    .join("\n");
  return [
    { id: "reflect-fill", text: best.text + "\n\n" + extra },
    {
      id: "reflect-tight",
      text: [
        best.text,
        "The only user-visible reply after probing is the pinpointed flow. Under 220 words.",
        "A2A: probe the peer agent. Do not dump semantically close apps.",
      ].join("\n"),
    },
  ];
}
