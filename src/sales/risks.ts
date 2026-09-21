/**
 * Grounded risk notes from the Corgi public site. The model must not invent these.
 */
export interface RiskAsk {
  category: string;
  does: string;
  stage?: string;
  headcount?: number;
}

export interface Vulnerability {
  risk: string;
  likelihood: "high" | "medium" | "low";
  pctChance: string;
  coverageLine: string;
  typicalLimit: string;
}

export interface RiskNote {
  category: string;
  does: string;
  stage?: string;
  risks: string[];
  penalties: string[];
  vulnerabilities: Vulnerability[];
  proof: { kind: "customer" | "story" | "none"; name: string; why: string };
  offer: string;
  lines: string[];
  costBand: string;
  estimatedPremium: string;
  next: { label: string; url: string };
}

const DEMO = "https://www.corgi.insure/book-a-demo";
const INSURE = "https://www.corgi.insure";

interface RowDef {
  match: RegExp;
  note: Omit<RiskNote, "category" | "does" | "stage">;
}

const ROWS: RowDef[] = [
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
      vulnerabilities: [
        {
          risk: "AI output causes customer harm or bad advice",
          likelihood: "medium",
          pctChance: "15–25% over 3 years for AI startups with production deployments",
          coverageLine: "Tech E&O / AI Liability",
          typicalLimit: "$1M–$2M per occurrence",
        },
        {
          risk: "IP or copyright claim from training data",
          likelihood: "medium",
          pctChance: "10–20% as regulatory scrutiny increases",
          coverageLine: "Tech E&O",
          typicalLimit: "$1M aggregate",
        },
        {
          risk: "Data breach exposing customer or training data",
          likelihood: "high",
          pctChance: "25–35% over 3 years (industry average for tech startups)",
          coverageLine: "Cyber",
          typicalLimit: "$1M–$3M",
        },
        {
          risk: "Vendor or enterprise customer requires COI to proceed",
          likelihood: "high",
          pctChance: "70–90% of enterprise deals require proof of insurance",
          coverageLine: "CGL + E&O",
          typicalLimit: "$1M/$2M",
        },
        {
          risk: "Founder or board sued over company decisions",
          likelihood: "low",
          pctChance: "5–10% per year for funded startups",
          coverageLine: "D&O",
          typicalLimit: "$1M–$5M",
        },
      ],
      proof: {
        kind: "customer",
        name: "Imagine AI",
        why: "Corgi customer story in the same AI category (corgi.insure/customers/imagine-ai).",
      },
      offer: "Seed or Series A stack plus AI-aware E&O / cyber",
      lines: ["CGL", "D&O", "Tech E&O", "Cyber", "AI liability if listed"],
      costBand: "About $2k–$4k/yr early; $10k–$25k as you add EPLI / more D&O. Not a bind.",
      estimatedPremium: "$2,500–$4,000/yr for a seed AI startup; $8,000–$15,000/yr at Series A",
      next: { label: "Book a demo", url: DEMO },
    },
  },
  {
    match: /saas|software|b2b|platform/i,
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
      vulnerabilities: [
        {
          risk: "Product outage causing customer revenue loss",
          likelihood: "medium",
          pctChance: "15–20% of SaaS startups face an E&O claim within 5 years",
          coverageLine: "Tech E&O",
          typicalLimit: "$1M per occurrence",
        },
        {
          risk: "Customer data breach or unauthorized access",
          likelihood: "high",
          pctChance: "25–30% over 3 years for B2B SaaS handling PII",
          coverageLine: "Cyber",
          typicalLimit: "$1M–$2M",
        },
        {
          risk: "D&O claim from investors or co-founders",
          likelihood: "low",
          pctChance: "5–8% per year for venture-backed startups",
          coverageLine: "D&O",
          typicalLimit: "$1M–$5M",
        },
        {
          risk: "Slip-and-fall or property damage at office/event",
          likelihood: "low",
          pctChance: "3–5% per year",
          coverageLine: "CGL",
          typicalLimit: "$1M/$2M",
        },
      ],
      proof: {
        kind: "customer",
        name: "Intryc",
        why: "SaaS / software customer on Corgi (corgi.insure/customers/intryc).",
      },
      offer: "Pre-seed & Seed package",
      lines: ["CGL", "D&O", "Tech E&O", "Cyber"],
      costBand: "About $2,000–$4,000/yr for ~$1M core limits on an eligible early startup.",
      estimatedPremium: "$2,000–$3,500/yr at seed; $6,000–$12,000/yr at Series A",
      next: { label: "Get a quote path", url: INSURE },
    },
  },
  {
    match: /crypto|web3|token|defi|nft/i,
    note: {
      risks: [
        "Key / protocol loss, crime, and cyber.",
        "Customer or investor claims if an asset path fails.",
        "Banking and venue COIs.",
      ],
      penalties: [
        "Venues and banks refuse you without crime/cyber paper.",
        "A hack without coverage can end the company.",
      ],
      vulnerabilities: [
        {
          risk: "Smart contract exploit or protocol hack",
          likelihood: "high",
          pctChance: "20–35% of DeFi protocols experience an exploit within 2 years",
          coverageLine: "Cyber / Crime",
          typicalLimit: "$1M–$5M",
        },
        {
          risk: "Regulatory action or securities classification",
          likelihood: "high",
          pctChance: "25–40% given evolving regulatory landscape",
          coverageLine: "D&O",
          typicalLimit: "$1M–$5M",
        },
        {
          risk: "Investor or token-holder lawsuit",
          likelihood: "medium",
          pctChance: "10–20% for token-issuing projects",
          coverageLine: "D&O",
          typicalLimit: "$1M–$3M",
        },
      ],
      proof: {
        kind: "story",
        name: "Crypto & Web3 page",
        why: "Corgi has a dedicated crypto page (corgi.insure/crypto).",
      },
      offer: "Custom / growth-aware stack",
      lines: ["CGL", "D&O", "Cyber", "Crime if discussed on-site"],
      costBand: "Site gives stage bands only. Say if crypto-specific price is not on the page.",
      estimatedPremium: "$4,000–$8,000/yr at seed; premiums vary significantly by protocol risk",
      next: { label: "Book a demo", url: DEMO },
    },
  },
  {
    match: /fintech|payment|bank|lend|money/i,
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
      vulnerabilities: [
        {
          risk: "Fraudulent transaction or funds misrouting",
          likelihood: "high",
          pctChance: "30–40% of fintech startups face a fraud-related incident within 3 years",
          coverageLine: "Crime / Cyber",
          typicalLimit: "$1M–$5M",
        },
        {
          risk: "Regulatory enforcement or compliance failure",
          likelihood: "medium",
          pctChance: "15–25% depending on jurisdiction and product type",
          coverageLine: "D&O / Tech E&O",
          typicalLimit: "$1M–$3M",
        },
        {
          risk: "Data breach of financial records or PII",
          likelihood: "high",
          pctChance: "30–35% over 3 years for startups handling financial data",
          coverageLine: "Cyber",
          typicalLimit: "$2M–$5M",
        },
        {
          risk: "Partner or bank requires COI to integrate",
          likelihood: "high",
          pctChance: "80–95% of banking partners require proof of insurance",
          coverageLine: "CGL + E&O + Cyber",
          typicalLimit: "$1M/$2M each",
        },
      ],
      proof: {
        kind: "story",
        name: "Fintech industry page",
        why: "Corgi publishes a fintech startup insurance page (corgi.insure/fintech).",
      },
      offer: "Seed or Series A stack, cyber-heavy",
      lines: ["CGL", "D&O", "Tech E&O", "Cyber"],
      costBand: "Use the site cost-by-stage bands. Do not invent a fintech surcharge.",
      estimatedPremium: "$3,000–$5,000/yr at seed; $12,000–$25,000/yr at Series A",
      next: { label: "Book a demo", url: DEMO },
    },
  },
  {
    match: /health|med|bio|clinical|pharma/i,
    note: {
      risks: [
        "PHI / cyber.",
        "Product or workflow harm (E&O).",
        "Hospital or payor vendor packets.",
      ],
      penalties: [
        "A health system will not pilot without cyber + COI.",
        "A privacy event without cyber is a reportable hit.",
      ],
      vulnerabilities: [
        {
          risk: "HIPAA violation or PHI data breach",
          likelihood: "high",
          pctChance: "25–35% for health-tech startups handling PHI",
          coverageLine: "Cyber",
          typicalLimit: "$1M–$3M",
        },
        {
          risk: "Clinical workflow error causing patient harm",
          likelihood: "medium",
          pctChance: "10–15% for startups in clinical decision support",
          coverageLine: "Tech E&O / Professional Liability",
          typicalLimit: "$1M–$2M",
        },
        {
          risk: "Hospital or payor refuses to pilot without COI",
          likelihood: "high",
          pctChance: "90–95% of health system procurement requires insurance proof",
          coverageLine: "CGL + E&O + Cyber",
          typicalLimit: "$1M/$2M each",
        },
      ],
      proof: {
        kind: "story",
        name: "Health-tech page",
        why: "Corgi health-tech insurance page (corgi.insure/health-tech).",
      },
      offer: "Seed stack + cyber emphasis",
      lines: ["CGL", "D&O", "Tech E&O", "Cyber"],
      costBand: "Site cost-by-stage bands. No invented clinical premium.",
      estimatedPremium: "$3,000–$5,000/yr at seed; $10,000–$20,000/yr at Series A",
      next: { label: "Book a demo", url: DEMO },
    },
  },
  {
    match: /ecommerce|e-commerce|marketplace|retail|shop/i,
    note: {
      risks: [
        "Product liability from third-party sellers on the platform.",
        "Customer data breach (cyber).",
        "Delivery or fulfillment disputes (E&O / CGL).",
      ],
      penalties: [
        "Payment processors and logistics partners require COI.",
        "A product injury claim without CGL hits the marketplace operator.",
      ],
      vulnerabilities: [
        {
          risk: "Product liability claim from a marketplace transaction",
          likelihood: "medium",
          pctChance: "10–20% for marketplaces with physical goods",
          coverageLine: "CGL / Products Liability",
          typicalLimit: "$1M/$2M",
        },
        {
          risk: "Customer PII or payment data breach",
          likelihood: "high",
          pctChance: "25–30% over 3 years",
          coverageLine: "Cyber",
          typicalLimit: "$1M–$3M",
        },
      ],
      proof: {
        kind: "none",
        name: "",
        why: "",
      },
      offer: "Pre-seed & Seed + products/completed operations",
      lines: ["CGL", "D&O", "Tech E&O", "Cyber", "Products Liability"],
      costBand: "Site cost-by-stage: about $2k–$4k early.",
      estimatedPremium: "$2,500–$4,500/yr at seed; $8,000–$15,000/yr at Series A",
      next: { label: "Book a demo", url: DEMO },
    },
  },
];

const FALLBACK: Omit<RiskNote, "category" | "does" | "stage"> = {
  risks: [
    "General liability if someone is hurt in an office or event (CGL).",
    "Leadership claims (D&O).",
    "Product / professional mistake (tech E&O) and a breach (cyber).",
  ],
  penalties: [
    "A customer or landlord asks for a COI and you stall the deal.",
    "A suit without D&O can reach founders (site D&O articles).",
  ],
  vulnerabilities: [
    {
      risk: "General liability incident (office, event, property)",
      likelihood: "low",
      pctChance: "3–5% per year",
      coverageLine: "CGL",
      typicalLimit: "$1M/$2M",
    },
    {
      risk: "Founder or board sued over business decisions",
      likelihood: "low",
      pctChance: "5–10% per year for funded startups",
      coverageLine: "D&O",
      typicalLimit: "$1M–$5M",
    },
    {
      risk: "Professional error or service failure",
      likelihood: "medium",
      pctChance: "10–15% over 3 years",
      coverageLine: "Tech E&O",
      typicalLimit: "$1M",
    },
    {
      risk: "Data breach or cyber incident",
      likelihood: "medium",
      pctChance: "20–25% over 3 years for any tech company",
      coverageLine: "Cyber",
      typicalLimit: "$1M–$2M",
    },
  ],
  proof: {
    kind: "customer",
    name: "Artisan / Eragon / Sorcerer",
    why: "Public Corgi customer stories. Name one only if the pack still has that page.",
  },
  offer: "Pre-seed & Seed core package",
  lines: ["CGL", "D&O", "Tech E&O", "Cyber"],
  costBand: "Site cost-by-stage: about $2k–$4k early. Confirm on a quote.",
  estimatedPremium: "$2,000–$4,000/yr for a seed-stage startup",
  next: { label: "Get insured / demo", url: DEMO },
};

export function mapRisks(ask: RiskAsk): RiskNote {
  const hay = ask.category + " " + ask.does;
  for (const row of ROWS) {
    if (row.match.test(hay)) {
      return { category: ask.category, does: ask.does, stage: ask.stage, ...row.note };
    }
  }
  return { category: ask.category, does: ask.does, stage: ask.stage, ...FALLBACK };
}

function whyCorgi(note: RiskNote): string {
  if (note.proof.kind === "none") {
    return "Founders like you already buy this stack on Corgi. Quote in minutes. No broker wait.";
  }
  return `${note.proof.name} is in the same boat and already uses Corgi. Quote in minutes. No broker wait.`;
}

function billIfUninsured(limit: string): string {
  return limit.replace(/\s*per occurrence/i, "").replace(/\s*aggregate/i, "").replace(/\s*each$/i, "").trim();
}

function skipCosts(note: RiskNote): string[] {
  const lines = note.penalties.slice(0, 2);
  if (lines.length > 0) return lines.map((p) => `- ${p}`);
  return ["- A customer can stall the deal until you show a COI, and a claim can hit you personally."];
}

function riskBullets(note: RiskNote): string[] {
  const fromVuln = note.vulnerabilities.slice(0, 3).map((v) => {
    const bill = billIfUninsured(v.typicalLimit);
    return `- ${v.risk}. Usually ${v.pctChance}. If you are not insured, that can cost you ${bill}.`;
  });
  if (fromVuln.length > 0) return fromVuln;
  return note.risks.slice(0, 3).map((r) => `- ${r}`);
}

/** Short pitch the model should copy: risks + chance + uninsured cost, cover, why, contact. */
export function reportText(note: RiskNote): string {
  return [
    "What's at risk:",
    ...riskBullets(note),
    "If you are not insured:",
    ...skipCosts(note),
    `How Corgi covers it: ${note.lines.join(", ")}. About ${note.estimatedPremium}.`,
    `Why Corgi: ${whyCorgi(note)}`,
    "What's your name and best email? I'll have someone send the quote.",
    note.next.url,
  ].join("\n");
}

export function vulnerabilityReport(note: RiskNote): string {
  return reportText(note);
}
