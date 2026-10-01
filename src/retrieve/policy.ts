import type { RetrievePolicy, RetrievePolicyJson } from "./types.ts";

export const DEFAULT_POLICY: RetrievePolicy = compilePolicy({});

export function compilePolicy(json: RetrievePolicyJson = {}): RetrievePolicy {
  const aliases = (json.aliases ?? []).map((a) => ({ re: new RegExp(a.match, "i"), terms: a.terms }));
  const extraRules = (json.extraRules ?? []).map((r) => ({ re: new RegExp(r.match, "i"), terms: r.terms }));
  const kindRules = (json.kindRules ?? []).map((r) => ({ re: new RegExp(r.match, "i"), kind: r.kind }));
  const integrationKind = json.integrationKind ?? "integration";
  const platformKind = json.platformKind ?? "platform";
  const guideKind = json.guideKind ?? "guide";
  const defaultKind = json.defaultKind ?? "page";
  const integrationRe = json.integrationMatch ? new RegExp(json.integrationMatch, "i") : undefined;
  const priorityPaths = json.priorityPaths ?? [];
  const kindPriority = json.kindPriority ?? {};
  const defaultPriority = json.defaultPriority ?? 1;
  const queryKindDefault = json.queryKindDefault ?? defaultKind;

  const wantsIntegration = (query: string) => (integrationRe ? integrationRe.test(query) : false);

  return {
    aliases,
    preferTerms: json.preferTerms ?? [],
    kindPriors: json.kindPriors ?? {},
    kindBoosts: json.kindBoosts ?? {},
    integrationKind,
    platformKind,
    guideKind,
    queryEmbedSkip: json.queryEmbedSkip ?? [],
    wantsIntegration,
    extraTerms(query) {
      const extra: string[] = [];
      for (const rule of extraRules) {
        if (rule.re.test(query)) extra.push(...rule.terms);
      }
      return extra;
    },
    kindOf(url) {
      const p = pathOf(url);
      for (const rule of kindRules) {
        if (rule.re.test(p) || rule.re.test(url)) return rule.kind;
      }
      return defaultKind;
    },
    priorityOf(url, kind) {
      const p = pathOf(url);
      const i = priorityPaths.findIndex((d) => p.includes(d));
      const base = kindPriority[kind] ?? defaultPriority;
      if (i >= 0 && kind !== integrationKind) return base + 2 - i * 0.04;
      return base;
    },
    queryKind(query) {
      return wantsIntegration(query) ? integrationKind : queryKindDefault;
    },
    focusExpand(focus, kind) {
      return focus === guideKind && (kind === platformKind || kind === guideKind);
    },
  };
}

export function pathOf(url: string): string {
  try {
    return new URL(url).pathname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}
