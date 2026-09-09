/** Skip catalog lookup on greetings and meta asks. Any other phrasing is a job. */

const GENERIC_ASK =
  /\b(how can (you|this|it|composio) (help|be)|what (can|do) you (do|offer)|who are you|what is (composio|this|that)|tell me about|beneficial|personalised to our work|personalized to our work|be useful to us|how does this work|help me)\b/i;

const GREETING = /^(hi|hello|hey|thanks|thank you|ok|okay|yo)[\s!.?]*$/i;

const STOP = new Set([
  "a",
  "an",
  "the",
  "to",
  "for",
  "my",
  "our",
  "me",
  "us",
  "in",
  "on",
  "of",
  "and",
  "or",
  "is",
  "it",
  "i",
  "we",
  "you",
  "this",
  "that",
  "can",
  "do",
  "does",
  "please",
  "just",
  "really",
  "need",
  "want",
  "from",
  "with",
]);

const META = new Set([
  "help",
  "hello",
  "hi",
  "hey",
  "thanks",
  "thank",
  "info",
  "information",
  "what",
  "who",
  "how",
  "why",
  "composio",
  "agent",
  "useful",
  "beneficial",
  "personalised",
  "personalized",
  "work",
  "short",
  "fully",
  "tell",
  "about",
  "yourself",
  "figure",
  "out",
  "talk",
]);

export function jobIsConcrete(request: string): boolean {
  const t = request.trim();
  if (!t) return false;
  if (GREETING.test(t)) return false;
  if (GENERIC_ASK.test(t)) return false;
  const words = t
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
  if (!words.length) return false;
  if (words.every((w) => META.has(w))) return false;
  return true;
}
