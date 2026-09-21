/**
 * GEPA-style prompt search: score many instructions on a Pareto set.
 * Reflect, mutate the front, keep the winner. No loop change.
 */
export interface GoalScore {
  discover: number;
  risks: number;
  penalty: number;
  social: number;
  report: number;
  grounded: number;
  short: number;
  inquisitive: number;
}

export interface PromptCand {
  id: string;
  gen: number;
  text: string;
  score: GoalScore;
  mean: number;
}

const GOALS: (keyof GoalScore)[] = [
  "discover",
  "risks",
  "penalty",
  "social",
  "report",
  "grounded",
  "short",
  "inquisitive",
];

export function scorePrompt(text: string): GoalScore {
  const t = text.toLowerCase();
  return {
    discover: hit(t, [/categor(y|ies)/, /what (the |your )?startup does/, /saas|fintech|health-tech/, /one question/]),
    risks: hit(t, [/vulnerabilit/, /what'?s at risk|risks:/, /map_risks|highlight/, /chance|probabilit|usually/]),
    penalty: hit(t, [/penalt|skip insurance|uninsured|not insured/, /lawsuit|lost deal|coi/, /cost if|owe|typicalLimit|uninsured cost/]),
    social: hit(t, [
      /customer|intryc|competitor|similar (problem|company)/,
      /using corgi|already uses|why (choose|pick) corgi|quote in minutes/,
    ]),
    report: hit(t, [
      /what'?s at risk|short pitch/,
      /how corgi (will )?(cover|insure)/,
      /contact details|name and (best )?email/,
      /if you are not insured|uninsured|usual (chance|probability)/,
    ]),
    grounded: hit(t, [/do not invent|from the pack|only from/, /no (fake|invented) (price|customer|lawsuit)/]),
    short: hit(t, [/80 words|100 words|120 words|crisp|simplest|plain (words|language)|short/, /no tool (names|json)/, /one link/]),
    inquisitive: hit(t, [
      /one question per turn|ask one|ask smart/,
      /what (does|made|triggered)|why now|what stage/,
      /discovery sequence|discover first/,
      /last answer|do not re-ask|never re-ask|infer/,
    ]),
  };
}

function hit(text: string, rules: RegExp[]): number {
  let n = 0;
  for (const r of rules) if (r.test(text)) n++;
  return n / rules.length;
}

export function meanScore(s: GoalScore): number {
  let t = 0;
  for (const k of GOALS) t += s[k];
  return t / GOALS.length;
}

/** Keep A if it is not worse on every goal and better on at least one. */
export function onFront(cands: PromptCand[]): PromptCand[] {
  return cands.filter((a) => !cands.some((b) => b.id !== a.id && dominates(b.score, a.score)));
}

function dominates(a: GoalScore, b: GoalScore): boolean {
  let better = false;
  for (const k of GOALS) {
    if (a[k] < b[k] - 1e-9) return false;
    if (a[k] > b[k] + 1e-9) better = true;
  }
  return better;
}

export function runGepa(seeds: { id: string; text: string }[]): { winner: PromptCand; all: PromptCand[]; front: PromptCand[] } {
  const gen0 = seeds.map((s) => cand(s.id, 0, s.text));
  const notes = reflect(gen0);
  const mutated = notes.map((n, i) => cand("m" + (i + 1), 1, n.text));
  const all = [...gen0, ...mutated];
  const front = onFront(all);
  const winner = front.slice().sort((a, b) => b.mean - a.mean || b.score.report - a.score.report)[0]!;
  return { winner, all, front };
}

function cand(id: string, gen: number, text: string): PromptCand {
  const score = scorePrompt(text);
  return { id, gen, text, score, mean: meanScore(score) };
}

/** Reflect: copy the best, add any missing goal as a hard line. */
function reflect(cands: PromptCand[]): { id: string; text: string }[] {
  const best = cands.slice().sort((a, b) => b.mean - a.mean)[0]!;
  const missing = GOALS.filter((g) => best.score[g] < 1);
  const extra = missing
    .map((g) => {
      if (g === "discover") return "Ask category and what the startup does. One question per turn.";
      if (g === "risks") return "After both answers, call map_risks and name the vulnerabilities in plain words, with the usual chance and what it can cost if they are not insured.";
      if (g === "penalty")
        return "Show the cost if they are not insured: what they can owe, plus lost deal, lawsuit, delayed COI. Pack only.";
      if (g === "social") return "Name one similar company already using Corgi. Quote in minutes. Pack only.";
      if (g === "report")
        return "Reply with one short pitch: What's at risk (usual chance + cost if not insured) / If you are not insured / How Corgi covers it / Why Corgi / then ask for contact details (name and email).";
      if (g === "grounded") return "Do not invent prices, customers, lawsuits, or penalties. If the pack has no match, say so.";
      if (g === "inquisitive")
        return "Be inquisitive — ask one smart question per turn that considers their last answer. Never re-ask. Infer category. Discovery sequence: what they do, stage, category, why now.";
      return "Keep the whole pitch under 120 words. Crisp. Simplest language. No tool names. No JSON. One link.";
    })
    .join("\n");
  return [
    { id: "reflect-fill", text: best.text + "\n\n" + extra },
    {
      id: "reflect-tight",
      text: [
        best.text,
        "The only user-visible reply after discovery is the short pitch. 120 words or fewer. Simplest language.",
        "On each risk, say the usual chance it happens and what it can cost if they are not insured.",
        "Do not invent. One similar company or one Corgi customer from the pack.",
        "Be inquisitive — ask one smart question per turn that considers their last answer. Never re-ask what they already told you.",
        "Ask for contact details (name and email) at the end.",
      ].join("\n"),
    },
  ];
}
