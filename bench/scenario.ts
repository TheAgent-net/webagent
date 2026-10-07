/** Fixed script so two harnesses see the same work. */

export const PHASE1_WORDS = words(80, "plan the trip pick dates check fares");
export const PHASE2_WORDS = words(40, "rank the options after the cpu pass");
export const PHASE3_WORDS = words(60, "here is the cheapest return with a change option");

export function toolCount(messages: { role?: string }[]): number {
  let n = 0;
  for (let i = 0; i < messages.length; i++) if (messages[i]!.role === "tool") n++;
  return n;
}

/** 1 = first stream + cpu_spin, 2 = mid stream + io_lookup, 3 = final text. */
export function phaseOf(messages: { role?: string }[]): 1 | 2 | 3 {
  const n = toolCount(messages);
  if (n >= 2) return 3;
  if (n === 1) return 2;
  return 1;
}

export function toolForPhase(phase: 1 | 2 | 3): { name: string; args: string } | null {
  if (phase === 1) return { name: "cpu_spin", args: '{"n":4096}' };
  if (phase === 2) return { name: "io_lookup", args: '{"ms":80}' };
  return null;
}

export function textForPhase(phase: 1 | 2 | 3): string[] {
  if (phase === 1) return PHASE1_WORDS;
  if (phase === 2) return PHASE2_WORDS;
  return PHASE3_WORDS;
}

function words(n: number, seed: string): string[] {
  const base = seed.split(/\s+/).filter(Boolean);
  const out: string[] = new Array(n);
  for (let i = 0; i < n; i++) out[i] = base[i % base.length]! + (i === n - 1 ? "." : "");
  return out;
}
