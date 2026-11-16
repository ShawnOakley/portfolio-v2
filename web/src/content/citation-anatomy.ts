import type { TextSpan } from "@/components/ui/annotated-text";

/**
 * Hand-written. The court is repeated in the parentheses so it can be
 * selected on its own. In the usual form, the reporter U.S. already names
 * the Supreme Court.
 */
export const citationText =
  "Brown v. Board of Education, 347 U.S. 483, 495 (U.S. 1954). Brown, supra, at 495. See id.";

const full = "Brown v. Board of Education, 347 U.S. 483, 495 (U.S. 1954)";

function range(needle: string, from = 0): { start: number; end: number } {
  const start = citationText.indexOf(needle, from);
  if (start < 0) throw new Error(`Missing ${needle}`);
  return { start, end: start + needle.length };
}

const citation = range(full);
const reporter = range("U.S.");
const court = range("U.S.", reporter.end);
const pin = range("495");

export const citationSpans: TextSpan[] = [
  { ...citation, kind: "citation", id: "brown" },
  { ...range("Brown v. Board of Education"), kind: "case", id: "case" },
  { ...range("347"), kind: "volume", id: "volume" },
  { ...reporter, kind: "reporter", id: "reporter" },
  { ...range("483"), kind: "page", id: "page" },
  { ...pin, kind: "pin", id: "pin" },
  { ...court, kind: "court", id: "court" },
  { ...range("1954"), kind: "year", id: "year" },
  { ...range("Brown, supra"), kind: "short", id: "short", linksTo: "brown" },
  { ...range("supra"), kind: "supra", id: "supra", linksTo: "brown" },
  { ...range("id."), kind: "id", id: "id", linksTo: "brown" },
];

export const partLabels: Record<string, string> = {
  citation: "Full citation",
  case: "Case name",
  volume: "Volume",
  reporter: "Reporter",
  page: "First page",
  pin: "Pin cite",
  court: "Court",
  year: "Year",
  short: "Short cite",
  supra: "Supra",
  id: "Id.",
};
