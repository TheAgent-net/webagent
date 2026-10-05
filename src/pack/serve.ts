import { defaultHarness, type Harness } from "../harness.ts";
import { listen, type Hosted, type ListenOpts } from "../host/listen.ts";
import { openaiModel } from "../models.ts";
import { attachAgent, attachPackTools } from "./attach.ts";
import { openPack, type BuildAgentOpts } from "./build.ts";
import { embedVisuals, pickVisual } from "./docs.ts";
import type { PackRuntime } from "./types.ts";

export interface ServePackOpts extends BuildAgentOpts {
  port?: number;
  hostname?: string;
  publicUrl?: string;
  harness?: Harness;
}

/** A pack, ready to mount: its harness, runtime, and listen options. Binds no port. */
export interface ReadyPack {
  harness: Harness;
  runtime: PackRuntime;
  modelName: string;
  listen: ListenOpts;
}

/** Open a pack and attach its agent. The cloud mounts many of these. `servePack` binds one. */
export async function readyPack(dir: string, opts: ServePackOpts = {}): Promise<ReadyPack> {
  const h = opts.harness ?? defaultHarness();
  const runtime = await openPack(dir, opts);
  try {
    const n = await embedVisuals(runtime, opts.embed);
    if (n) console.error("indexed " + n + " visual descriptions");
  } catch (err) {
    console.error("visual embeddings skipped:", err instanceof Error ? err.message : err);
  }
  const pin = runtime.config.model?.id;
  const hasKey = !!process.env.OPENAI_API_KEY;
  if (hasKey && pin) {
    h.addModel(
      openaiModel({
        id: "openai",
        baseUrl: runtime.config.model?.apiBase || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
        model: pin,
        apiKeyEnv: "OPENAI_API_KEY",
        reasoningEffort: runtime.config.model?.reasoningEffort,
      }),
    );
  }
  const modelId = hasKey && pin ? "openai" : "echo";
  const modelName = hasKey && pin ? pin : "echo";
  const run = attachAgent(h, runtime, { model: modelId });
  await attachPackTools(h, run, runtime);
  return {
    harness: h,
    runtime,
    modelName,
    listen: {
      port: opts.port ?? runtime.config.host?.port ?? 8787,
      hostname: opts.hostname ?? "0.0.0.0",
      run,
      model: modelId,
      publicUrl: opts.publicUrl || runtime.config.host?.publicUrl || process.env.WEBAGENT_PUBLIC_URL,
      pack: runtime.config,
      finish: runtime.config.visuals?.length ? (said, reply) => pickVisual(runtime, said, reply) : undefined,
      card: {
        name: runtime.config.brand.name,
        description: runtime.config.card?.description || runtime.config.brand.tagline,
        instructions: runtime.config.card?.instructions,
      },
    },
  };
}

export async function servePack(dir: string, opts: ServePackOpts = {}): Promise<{ hosted: Hosted; runtime: PackRuntime; modelName: string }> {
  const ready = await readyPack(dir, opts);
  const hosted = listen(ready.harness, ready.listen);
  return { hosted, runtime: ready.runtime, modelName: ready.modelName };
}
