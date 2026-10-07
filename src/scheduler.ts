/**
 * I/O-bound fan-out. No polling. Caps in-flight work so we don't blow memory.
 * Each run's loop is independent — never a single global turn queue.
 */

export class Scheduler {
  inflight = 0;
  constructor(readonly max = 1024) {}

  async run<T>(fn: () => Promise<T>): Promise<T> {
    if (this.inflight >= this.max) {
      await this.waitSlot();
    }
    this.inflight++;
    try {
      return await fn();
    } finally {
      this.inflight--;
      this.wake();
    }
  }

  private waiters: (() => void)[] = [];

  private waitSlot(): Promise<void> {
    return new Promise((r) => this.waiters.push(r));
  }

  private wake(): void {
    const w = this.waiters.shift();
    if (w) w();
  }
}
