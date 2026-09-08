/**
 * Logged-in quote app on app.corgi.insure.
 * Walked once after sign-in. Not a public Firecrawl page.
 */
import type { SiteFlow } from "./types.ts";

export const APP_QUOTE_ID = "app_quote";
export const APP_QUOTE_ORIGIN = "https://app.corgi.insure";
export const APP_QUOTE_PACK = APP_QUOTE_ORIGIN + "/quote/package-selection";
export const APP_QUOTE_PRODUCTS = APP_QUOTE_ORIGIN + "/quote/{id}/products";
export const APP_QUOTE_ADDRESS = APP_QUOTE_ORIGIN + "/quote/{id}/company/business-address";

export const APP_QUOTE: SiteFlow = {
  id: APP_QUOTE_ID,
  name: "App quote",
  purpose: "Pick a stage package, then choose products, then enter the company",
  steps: [
    {
      url: APP_QUOTE_ORIGIN + "/sign-up",
      title: "Sign in or sign up",
      hint: "The products page is behind an account wall",
    },
    {
      url: APP_QUOTE_PACK,
      title: "Package selection",
      hint: "Answer: What stage is your company at?",
    },
    {
      url: APP_QUOTE_PRODUCTS,
      title: "Choose products",
      hint: "Toggle lines, then continue with the selected coverages",
    },
    {
      url: APP_QUOTE_ADDRESS,
      title: "Business address",
      hint: "Street, city, state, zip. Then organization, finance, and structure",
    },
  ],
};

/** True for corgi.insure and its subdomains. */
export function isCorgi(origin: string): boolean {
  try {
    const host = new URL(origin.includes("://") ? origin : "https://" + origin).hostname;
    return host === "corgi.insure" || host.endsWith(".corgi.insure");
  } catch {
    return /corgi\.insure/i.test(origin);
  }
}

/** Append the app quote flow on a Corgi pack. Skip if it is already there. */
export function addAppQuote(flows: SiteFlow[], origin: string): SiteFlow[] {
  if (!isCorgi(origin)) return flows;
  if (flows.some((f) => f.id === APP_QUOTE.id)) return flows;
  return [...flows, APP_QUOTE];
}

/** Full product walk for the sales system prompt. No account names. */
export function appQuoteText(): string {
  return [
    "App quote flow (logged-in app.corgi.insure, not the public marketing site):",
    "1. Sign in or sign up at " + APP_QUOTE_ORIGIN + "/sign-up. The products page is behind that wall.",
    "2. Package selection at " + APP_QUOTE_PACK + " asks: What stage is your company at?",
    "   - Pre-Seed & Seed: CGL, D&O, Tech E&O, Cyber.",
    "   - Series A: those lines plus Media Liability and EPLI.",
    "   - Growth: those lines plus Fiduciary.",
    "3. Products at " + APP_QUOTE_PRODUCTS + " asks: Which insurance suits your business?",
    "   Tabs: Pre-Seed & Seed | Series A | Growth Stage | Custom.",
    "   Instant coverage: bind online in minutes. Toggle products. Continue with N coverages.",
    "   Core (instant quote): CGL, D&O, Tech E&O, Cyber, Fiduciary, Hired & Non-Owned Auto, Media Liability, EPLI.",
    "   Specialized: Liquor (instant). Commercial Auto, Workers Comp, Excess, Medical Malpractice, Kidnap & Ransom (1–14 days).",
    "4. Next page is company business address at " + APP_QUOTE_ADDRESS + " (street, apt, city, state, zip).",
    "5. Full nav: Welcome → Package Selection → Choose Product(s) → Company (Business Address, Organization, Financial Details, Structure) → Coverage Forms → Claims History → Notices & Signatures → Extra Coverages → Endorsements → Summary.",
    "When you send Do this next, point at the quote app (package selection, then products). Do not invent a quote id.",
  ].join("\n");
}
