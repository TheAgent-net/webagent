/** Numeric states — no string compares on the hot path. */
export const CREATED = 0;
export const RUNNING = 1;
export const PAUSED = 2;
export const STOPPED = 3;
export const CANCELLED = 4;

export type RunState = 0 | 1 | 2 | 3 | 4;

export const STATE_NAME = ["created", "running", "paused", "stopped", "cancelled"] as const;

export const PHASE_IDLE = 0;
export const PHASE_REASON = 1;
export const PHASE_TOOL = 2;
export type Phase = 0 | 1 | 2;
export const PHASE_NAME = ["idle", "reason", "tool"] as const;
