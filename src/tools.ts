export interface Tool {
  name: string;
  description?: string;
  schema?: Record<string, unknown>;
  call(args: Record<string, unknown>, signal?: AbortSignal): Promise<Record<string, unknown>>;
  preview?(args: Record<string, unknown>): Promise<Record<string, unknown>>;
}

export interface ToolInfo {
  name: string;
  description?: string;
  schema?: Record<string, unknown>;
}

export class ToolShelf {
  private readonly byName = new Map<string, Tool>();

  add(tool: Tool): void {
    this.byName.set(tool.name, tool);
  }

  remove(name: string): void {
    this.byName.delete(name);
  }

  get(name: string): Tool | undefined {
    return this.byName.get(name);
  }

  list(): ToolInfo[] {
    const out: ToolInfo[] = [];
    for (const t of this.byName.values()) {
      out.push({ name: t.name, description: t.description, schema: t.schema });
    }
    return out;
  }

  /** Snapshot names for a run (small array, not the map). */
  snapshot(): Tool[] {
    return [...this.byName.values()];
  }
}
