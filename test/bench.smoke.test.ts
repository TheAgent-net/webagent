import { describe, expect, test } from "bun:test";
import { webagentAdapter } from "../bench/adapters/webagent.ts";
import { oneTurn } from "../bench/loadgen.ts";
import { startProvider } from "../bench/provider.ts";

describe("bench smoke", () => {
  test("four users get tokens, both tools, and done", async () => {
    const provider = startProvider({ tps: 8000 });
    const adapter = webagentAdapter();
    const server = await adapter.listen({ providerUrl: provider.url, maxInflight: 8 });
    try {
      const turns = await Promise.all([0, 1, 2, 3].map((i) => oneTurn(server.url, "user-" + i)));
      expect(turns).toHaveLength(4);
      for (const t of turns) {
        expect(t.ok).toBe(true);
        expect(t.tokens).toBeGreaterThan(0);
        expect(t.tools).toContain("cpu_spin");
        expect(t.tools).toContain("io_lookup");
        expect(t.e2eMs).toBeGreaterThan(0);
      }
    } finally {
      await server.close();
      await provider.close();
    }
  });
});
