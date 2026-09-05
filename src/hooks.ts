export type Verdict = "allow" | "deny" | { redirect: { model?: string; tool?: string } };

export interface HookBag {
  beforeReason?: (runId: string, modelId: string | null) => Verdict | void | Promise<Verdict | void>;
  afterReason?: (runId: string, text: string) => void;
  beforeTool?: (runId: string, name: string, args: Record<string, unknown>) => Verdict | void | Promise<Verdict | void>;
  afterTool?: (runId: string, name: string, result: Record<string, unknown>) => void;
  onToken?: (runId: string, chunk: string) => void;
  onPause?: (runId: string) => void;
  onStop?: (runId: string) => void;
  onFork?: (parent: string, child: string) => void;
  onMerge?: (source: string, target: string) => void;
  onError?: (runId: string, err: unknown) => void;
}

export async function decide(
  fn: ((...a: never[]) => Verdict | void | Promise<Verdict | void>) | undefined,
  ...args: unknown[]
): Promise<Verdict> {
  if (!fn) return "allow";
  const v = await (fn as (...a: unknown[]) => Verdict | void | Promise<Verdict | void>)(...args);
  return v ?? "allow";
}
