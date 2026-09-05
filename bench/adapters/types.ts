export interface ListenOpts {
  providerUrl: string;
  maxInflight: number;
}

export interface BenchServer {
  url: string;
  close: () => Promise<void>;
}

/** Swap this file’s implementers to compare harnesses on the same workload. */
export interface HarnessAdapter {
  id: string;
  listen(opts: ListenOpts): Promise<BenchServer>;
}

export type TurnEvent =
  | { t: "token"; d: string }
  | { t: "tool"; d: string }
  | { t: "queued"; ms: number }
  | { t: "done" }
  | { t: "error"; d: string };
