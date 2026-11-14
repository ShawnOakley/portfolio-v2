/**
 * The site's status vocabulary. One place, so wording stays consistent and
 * the honesty rule holds: a missing case is "Not found in CourtListener",
 * never "fake".
 */
export const STATUSES = {
  found: {
    label: "Found",
    description: "CourtListener has a case at this citation.",
  },
  not_found: {
    label: "Not found in CourtListener",
    description:
      "CourtListener has no case at this citation. That is a reason to check, not proof the case does not exist.",
  },
  ambiguous: {
    label: "Ambiguous",
    description: "This citation matches more than one case.",
  },
  quote_mismatch: {
    label: "Quote differs",
    description: "The quoted words do not match the opinion's text.",
  },
  support_questionable: {
    label: "Support questionable",
    description:
      "An AI model read the opinion and did not find support for the sentence.",
  },
  negative_treatment: {
    label: "Negative treatment found",
    description: "A later opinion may have limited or overruled this case.",
  },
  unchecked: {
    label: "Not checked",
    description: "This citation was found but not looked up.",
  },
} as const;

export type Status = keyof typeof STATUSES;

export const STATUS_KEYS = Object.keys(STATUSES) as Status[];
