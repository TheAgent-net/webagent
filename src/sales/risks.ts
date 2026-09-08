/**
 * Grounded risk notes from the Corgi public site. The model must not invent these.
 */
export interface RiskAsk {
  category: string;
  does: string;
  company?: string;
  founder?: string;
  stage?: string;
}

export interface CoverNote {
  line: string;
  case: string;
  limit: string;
}

export interface RiskNote {
  category: string;
  does: string;
  company: string;
  founder: string;
  stage: string;
  risks: string[];
  penalties: string[];
  proof: { kind: "customer" | "story" | "none"; name: string; why: string };
  offer: string;
  lines: string[];
  covers: CoverNote[];
  costBand: string;
  next: { label: string; url: string };
}

const LIMIT_CLAIM = "up to $1M per claim / $2M aggregate";
const LIMIT_CGL = "up to $1M per occurrence / $2M aggregate";

const CORE_COVERS: CoverNote[] = [
  { line: "Tech E&O", case: "Your product is down or gives bad advice and a customer sues", limit: LIMIT_CLAIM },
  { line: "Cyber", case: "Customer data leaks and they sue you", limit: LIMIT_CLAIM },
  { line: "D&O", case: "A board or investor sues over a deal or fundraise", limit: LIMIT_CLAIM },
  { line: "CGL", case: "Someone is hurt at your office or an event", limit: LIMIT_CGL },
];

const AI_COVERS: CoverNote[] = [
  { line: "Tech E&O", case: "A model or agent output harms a customer", limit: LIMIT_CLAIM },
  { line: "Cyber", case: "Training data or customer data leaks", limit: LIMIT_CLAIM },
  { line: "D&O", case: "A board or investor sues over an AI miss", limit: LIMIT_CLAIM },
  { line: "CGL", case: "Someone is hurt at your office or an event", limit: LIMIT_CGL },
];

const FINTECH_COVERS: CoverNote[] = [
  { line: "Cyber", case: "A funds or data event, then a vendor or customer claim", limit: LIMIT_CLAIM },
  { line: "Tech E&O", case: "A payments or workflow miss costs a partner money", limit: LIMIT_CLAIM },
  { line: "D&O", case: "A partner or investor alleges a miss", limit: LIMIT_CLAIM },
  { line: "CGL", case: "Someone is hurt at your office or an event", limit: LIMIT_CGL },
];

const DEMO = "https://www.corgi.insure/book-a-demo";
const QUOTE = "https://app.corgi.insure/quote/package-selection";

const ROWS: { match: RegExp; note: Omit<RiskNote, "category" | "does" | "company" | "founder" | "stage"> }[] = [
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
      covers: AI_COVERS,
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
      covers: CORE_COVERS,
      costBand: "Site cost-by-stage: about $2,000–$4,000 / year for ~$1M core limits on an eligible early startup.",
      next: { label: "Open the quote app", url: QUOTE },
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
      covers: FINTECH_COVERS,
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
      covers: [
        { line: "Cyber", case: "Key, protocol, or customer data loss", limit: LIMIT_CLAIM },
        { line: "D&O", case: "An investor claim if an asset path fails", limit: LIMIT_CLAIM },
        { line: "CGL", case: "Someone is hurt at your office or an event", limit: LIMIT_CGL },
        { line: "Crime", case: "Theft of funds or keys, if the site lists crime for this stack", limit: "site band only; confirm on a quote" },
      ],
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
      covers: [
        { line: "Cyber", case: "PHI or patient data leaks", limit: LIMIT_CLAIM },
        { line: "Tech E&O", case: "A workflow miss harms a clinic or patient process", limit: LIMIT_CLAIM },
        { line: "D&O", case: "A board or payor packet fight", limit: LIMIT_CLAIM },
        { line: "CGL", case: "Someone is hurt at your office or an event", limit: LIMIT_CGL },
      ],
      costBand: "Site cost-by-stage bands. No invented clinical premium.",
      next: { label: "Book a demo", url: DEMO },
    },
  },
];

const FALLBACK: Omit<RiskNote, "category" | "does" | "company" | "founder" | "stage"> = {
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
  covers: CORE_COVERS,
  costBand: "Site cost-by-stage: about $2k–$4k early. Confirm on a quote.",
  next: { label: "Get insured / demo", url: DEMO },
};

export function mapRisks(ask: RiskAsk): RiskNote {
  const hay = [ask.category, ask.does, ask.stage].filter(Boolean).join(" ");
  const who = {
    company: (ask.company ?? "").trim(),
    founder: (ask.founder ?? "").trim(),
    stage: (ask.stage ?? "").trim(),
  };
  for (const row of ROWS) {
    if (row.match.test(hay)) {
      return { category: ask.category, does: ask.does, ...who, ...row.note };
    }
  }
  return { category: ask.category, does: ask.does, ...who, ...FALLBACK };
}

export function reportText(note: RiskNote): string {
  const who =
    note.founder && note.company
      ? note.founder + " — " + note.company
      : note.company || note.founder || "your startup";
  const sell = note.does || "this product";
  const tag = [note.category, note.stage].filter(Boolean).join(", ");
  const proof =
    note.proof.kind === "none"
      ? "No close match on the crawled pages."
      : note.proof.name + " — " + note.proof.why;
  const covers = (note.covers ?? CORE_COVERS).slice(0, 4);
  return [
    "# For " + who,
    "",
    "You sell " + sell + (tag ? " (" + tag + ")" : "") + ". This is your short read.",
    "",
    "The first enterprise buyer will ask for a COI before they care about the product.",
    "",
    "## What can go wrong — and what pays",
    ...covers.map((c) => "- " + c.case + " → **" + c.line + "**, typically " + c.limit + "."),
    "",
    "## Best fit",
    note.offer + ": " + note.lines.join(", ") + ".",
    note.costBand,
    "",
    "## If you skip insurance",
    ...note.penalties.slice(0, 2).map((r) => "- " + r),
    "",
    "## Who already did this",
    proof,
    "",
    "## Next",
    note.next.label + " — " + note.next.url,
  ].join("\n");
}
