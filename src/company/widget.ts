import { packWidget } from "../widget/widget.ts";
import type { AgentPackConfig } from "../pack/types.ts";
import { companyCopyPrompt } from "./card.ts";
import type { CompanyPack } from "./types.ts";

export function companyWidget(publicUrl: string, runId: string, pack: CompanyPack): string {
  return packWidget(publicUrl, runId, companyAgentConfig(pack, publicUrl));
}

export function companyAgentConfig(pack: CompanyPack, publicUrl = ""): AgentPackConfig {
  const name = pack.profile.name;
  const chips = pack.site.starterQuestions.slice(0, 4);
  return {
    id: "company",
    origin: pack.profile.origin,
    brand: {
      name,
      tagline: pack.profile.tagline,
      colors: {
        ink: "#191919",
        paper: "#ffffff",
        muted: "#6f6f6f",
        line: "#e5e5e5",
        wash: "#f5f5f5",
        accent: "#191919",
        fab: "#191919",
        fabText: "#ffffff",
      },
      fonts: { display: "system-ui, sans-serif", body: "system-ui, sans-serif" },
      fabLabel: name.length > 22 ? "Ask" : "Ask " + name,
      wordmark: name,
    },
    widget: {
      welcomeTitle: "How can I help?",
      welcomeBody: pack.profile.tagline,
      chips,
      copyHeadline: "Talk to " + name + " agents",
      copyPrompt: companyCopyPrompt(publicUrl, name),
      placeholder: "What do you need?",
      markdown: true,
    },
  };
}
