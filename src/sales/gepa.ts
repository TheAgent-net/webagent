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
  cover: number;
  readme: number;
  teach: number;
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
  "cover",
  "readme",
  "teach",
];

export function scorePrompt(text: string): GoalScore {
  const t = text.toLowerCase();
  return {
    discover: hit(t, [/company name/, /founder name/, /field|categor(y|ies)/, /one question/, /do not recommend|until you have/]),
    risks: hit(t, [/risk factor/, /risks:/, /map_risks|highlight/, /site_lookup/]),
    penalty: hit(t, [/penalt/, /if (you )?skip insurance|uninsured|not insured/, /lawsuit|lost deal|coi/]),
    social: hit(t, [/customer|intryc|competitor|similar (problem|company)/, /using corgi|already uses/]),
    report: hit(t, [/pinpoint report|for you:/, /best fit:/, /do this next/, /founder|company/]),
    grounded: hit(t, [/do not invent|from the pack|from the files|only from/, /no (fake|invented) (price|customer|lawsuit)/]),
    short: hit(t, [/180 words|short/, /no tool (names|json)/, /one link/]),
    cover: hit(t, [/liabilit/, /how much we cover|limit|\$1m|per claim/, /cgl|tech e&o|cyber/]),
    readme: hit(t, [/# for |readme|short read/, /personal/, /what can go wrong|what pays/]),
    teach: hit(t, [/situation|problem|implication|need-payoff/, /insight|reframe|challenger|spin/, /simple|snap|one link/]),
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
      if (g === "discover") return "Ask company name, founder name, field, and what they sell. One question per turn. Do not recommend until you have those facts.";
      if (g === "risks") return "After those answers, call site_lookup then map_risks and highlight those risk factors.";
      if (g === "penalty") return "Show penalties if they are not insured: lost deal, lawsuit, delayed COI. Pack only.";
      if (g === "social") return "Name one similar company with that problem, or a competitor-category customer already using Corgi. Pack only.";
      if (g === "report") return "Reply with one short pinpoint report: For you / Risks / If you skip insurance / Who / Best fit / Do this next.";
      if (g === "grounded") return "Do not invent prices, customers, lawsuits, or penalties. If the pack has no match, say so.";
      if (g === "cover") return "For each product, name one liability case and how much we cover (site limits, often $1M per claim). CGL, D&O, Tech E&O, Cyber.";
      if (g === "readme") return "Write the reply as a brief personal readme: # For {founder} — {company}. What can go wrong and what pays. Short read they can share.";
      if (g === "teach") return "Use SPIN (situation, problem, implication, need-payoff). Teach one Challenger insight. Keep it SNAP: simple, one link.";
      return "Keep the whole report under 180 words. No tool names. No JSON. One link.";
    })
    .join("\n");
  return [
    { id: "reflect-fill", text: best.text + "\n\n" + extra },
    {
      id: "reflect-tight",
      text: [
        best.text,
        "The only user-visible reply after discovery is the pinpoint report. 180 words or fewer.",
        "Do not invent. One similar company or one Corgi customer from the pack.",
      ].join("\n"),
    },
  ];
}
