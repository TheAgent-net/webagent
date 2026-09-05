import type { SitePack } from "../site/types.ts";

/**
 * Grounded risk notes from the Corgi public site. The model must not invent these.
 */
export interface RiskAsk {
  category: string;
  does: string;
}

export interface RiskNote {
  category: string;
  does: string;
  risks: string[];
  penalties: string[];
  proof: { kind: "customer" | "story" | "none"; name: string; why: string };
  offer: string;
  lines: string[];
  costBand: string;
  next: { label: string; url: string };
}

const DEMO = "https://www.corgi.insure/book-a-demo";
const INSURE = "https://www.corgi.insure";

const ROWS: { match: RegExp; note: Omit<RiskNote, "category" | "does"> }[] = [
  {
    match: /ai|llm|agent|ml|model/i,
    note: {
      risks: [
        "A model output or agent action harms a customer (AI / tech E&O).",
        "Training data or generated content triggers an IP or privacy fight.",
        "A vendor asks for cyber + coverage language before they connect an API.",
      ],
      penalties: [
        "Enterprise deal stalls or dies in security review.",
        "Legal defense on IP or discrimination claims can outrun a seed round (D&O / E&O pages).",
      ],
      proof: {
        kind: "customer",
        name: "Imagine AI",
        why: "Corgi customer story in the same AI category (corgi.insure/customers/imagine-ai).",
      },
      offer: "Seed or Series A stack plus AI-aware E&O / cyber",
      lines: ["CGL", "D&O", "Tech E&O", "Cyber", "AI liability if listed"],
      costBand: "Site cost-by-stage: about $2k–$4k early; $10k–$25k as you add EPLI / more D&O. Not a bind.",
      next: { label: "Book a demo", url: DEMO },
    },
  },
  {
    match: /saas|software|b2b/i,
    note: {
      risks: [
        "Product outage or bad advice → customer claim (tech E&O).",
        "A breach of customer data (cyber).",
        "A board or investor suit if a deal or fundraise goes wrong (D&O).",
      ],
      penalties: [
        "First enterprise contract asks for a COI and walks if you have none.",
        "A claim without E&O or D&O can hit founders personally (D&O blog on the site).",
      ],
      proof: {
        kind: "customer",
        name: "Intryc",
        why: "SaaS / software customer on Corgi (corgi.insure/customers/intryc).",
      },
      offer: "Pre-seed & Seed package",
      lines: ["CGL", "D&O", "Tech E&O", "Cyber"],
      costBand: "Site cost-by-stage: about $2,000–$4,000 / year for ~$1M core limits on an eligible early startup.",
      next: { label: "Get a quote path", url: INSURE },
    },
  },
  {
    match: /fintech|payment|bank|lend/i,
    note: {
      risks: [
        "Funds movement, crime, and cyber events.",
        "Reg and vendor reviews that expect E&O + cyber.",
        "D&O if a partner or investor alleges a miss.",
      ],
      penalties: [
        "A processor or bank partner will not go live without a COI.",
        "Crime / cyber loss without a policy is a balance-sheet event.",
      ],
      proof: {
        kind: "story",
        name: "Fintech industry page",
        why: "Corgi publishes a fintech startup insurance page (corgi.insure/fintech).",
      },
      offer: "Seed or Series A stack, cyber-heavy",
      lines: ["CGL", "D&O", "Tech E&O", "Cyber"],
      costBand: "Use the site cost-by-stage bands. Do not invent a fintech surcharge.",
      next: { label: "Book a demo", url: DEMO },
    },
  },
  {
    match: /crypto|web3|token/i,
    note: {
      risks: ["Key / protocol loss, crime, and cyber.", "Customer or investor claims if an asset path fails.", "Banking and venue COIs."],
      penalties: ["Venues and banks refuse you without crime/cyber paper.", "A hack without coverage can end the company."],
      proof: {
        kind: "story",
        name: "Crypto & Web3 page",
        why: "Corgi has a dedicated crypto page (corgi.insure/crypto).",
      },
      offer: "Custom / growth-aware stack",
      lines: ["CGL", "D&O", "Cyber", "Crime if discussed on-site"],
      costBand: "Site gives stage bands only. Say if crypto-specific price is not on the page.",
      next: { label: "Book a demo", url: DEMO },
    },
  },
  {
    match: /health|med|bio/i,
    note: {
      risks: ["PHI / cyber.", "Product or workflow harm (E&O).", "Hospital or payor vendor packets."],
      penalties: ["A health system will not pilot without cyber + COI.", "A privacy event without cyber is a reportable hit."],
      proof: {
        kind: "story",
        name: "Health-tech page",
        why: "Corgi health-tech insurance page (corgi.insure/health-tech).",
      },
      offer: "Seed stack + cyber emphasis",
      lines: ["CGL", "D&O", "Tech E&O", "Cyber"],
      costBand: "Site cost-by-stage bands. No invented clinical premium.",
      next: { label: "Book a demo", url: DEMO },
    },
  },
];

const FALLBACK: Omit<RiskNote, "category" | "does"> = {
  risks: [
    "General liability if someone is hurt in an office or event (CGL).",
    "Leadership claims (D&O).",
    "Product / professional mistake (tech E&O) and a breach (cyber).",
  ],
  penalties: [
    "A customer or landlord asks for a COI and you stall the deal.",
    "A suit without D&O can reach founders (site D&O articles).",
  ],
  proof: {
    kind: "customer",
    name: "Artisan / Eragon / Sorcerer",
    why: "Public Corgi customer stories. Name one only if the pack still has that page.",
  },
  offer: "Pre-seed & Seed core package",
  lines: ["CGL", "D&O", "Tech E&O", "Cyber"],
  costBand: "Site cost-by-stage: about $2k–$4k early. Confirm on a quote.",
  next: { label: "Get insured / demo", url: DEMO },
};

export function mapRisks(ask: RiskAsk, pack?: SitePack): RiskNote {
  const hay = ask.category + " " + ask.does;
  let note: RiskNote = { category: ask.category, does: ask.does, ...FALLBACK };
  for (const row of ROWS) {
    if (row.match.test(hay)) {
      note = { category: ask.category, does: ask.does, ...row.note };
      break;
    }
  }
  return pack ? ground(note, pack) : note;
}

function packBlob(pack: SitePack): string {
  return (
    pack.origin +
    "\n" +
    pack.facts.join("\n") +
    "\n" +
    pack.pages.map((p) => p.url + " " + p.title + " " + p.text).join("\n")
  ).toLowerCase();
}

function ground(note: RiskNote, pack: SitePack): RiskNote {
  const blob = packBlob(pack);
  const proofOk = note.proof.name !== "" && blob.includes(note.proof.name.toLowerCase());
  const costOk = [...note.costBand.matchAll(/\$[\d,]+|\d+k/gi)].some((m) => blob.includes(m[0].toLowerCase()));
  const nextOk = blob.includes(note.next.url.toLowerCase());
  return {
    ...note,
    proof: proofOk ? note.proof : { kind: "none", name: "", why: "not in crawled pack" },
    costBand: costOk ? note.costBand : "Cost not in crawled pack. Do not invent a price.",
    next: nextOk ? note.next : { label: "See crawled site", url: pack.origin },
  };
}

export function reportText(note: RiskNote): string {
  const proof =
    note.proof.kind === "none"
      ? "No close match on the crawled pages."
      : `${note.proof.name} — ${note.proof.why}`;
  return [
    `**For you:** ${note.does || "(what you build)"} · ${note.category || "(category)"}`,
    `**Risks:**`,
    ...note.risks.slice(0, 3).map((r) => `- ${r}`),
    `**If you skip insurance:**`,
    ...note.penalties.slice(0, 2).map((r) => `- ${r}`),
    `**Who:** ${proof}`,
    `**Best fit:** ${note.offer} (${note.lines.join(", ")})`,
    `**Cost band (site, not a bind):** ${note.costBand}`,
    `**Do this next:** ${note.next.label} — ${note.next.url}`,
  ].join("\n");
}
