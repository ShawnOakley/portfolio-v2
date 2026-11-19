/** The cite-checker report. Field names match POST /v1/check. */

export type Cite = {
  id: number;
  kind: string;
  text: string;
  status: string;
  note: string;
  plaintiff: string;
  defendant: string;
  volume: string;
  reporter: string;
  page: string;
  pin_pages: number[];
  parent_id: number | null;
  case_names: string[];
  urls: string[];
};

export type Quote = {
  id: number;
  text: string;
  status: string;
  note: string;
  cite_id: number | null;
  how: string;
  omits: boolean;
  score: number | null;
  found_on: number[];
};

export type Verdict = {
  cite_id: number;
  sentence: string;
  signal: string;
  verdict: string;
  evidence: string;
  score: number;
  page: string;
  on_pin_page: boolean;
  reason: string;
};

export type Report = {
  cites: Cite[];
  quotes: Quote[];
  verdicts: Verdict[];
};

export type CheckModel = {
  id: string;
  label: string;
  available: boolean;
};

const EXTRACT_ERRORS: Record<string, string> = {
  "a PDF is required": "The file is not a PDF.",
  "the PDF could not be read": "The file is damaged.",
  "no text could be read from this PDF":
    "The pages were blank, or the page range is past the end.",
  "pages must look like 11-56": "The page range is not that form.",
  "PDF is larger than 20 MB": "The file is over the limit.",
};

/** The words the page shows for a failed POST /v1/extract. */
export function extractError(detail: string): string {
  return EXTRACT_ERRORS[detail] ?? "The checker could not read that PDF.";
}

export const MAX_PDF_BYTES = 20 * 1024 * 1024;

/** Citation checks omit the model. Support checks name the selected one. */
export function checkPayload(
  text: string,
  verdicts: boolean,
  model: string | null,
): { text: string; verdicts: boolean; model?: string } {
  if (!verdicts) return { text, verdicts: false };
  return { text, verdicts: true, model: model ?? "" };
}

const FINE_CITE = new Set(["found", "found_by_name", "not_checkable"]);

const QUOTE_FINE = new Set(["verified"]);
const QUOTE_SKIP = new Set(["too_short", "not_a_case"]);

const CITE_LABEL: Record<string, string> = {
  found: "Found",
  found_by_name: "Found by name",
  not_checkable: "Not a case citation",
  not_found: "Not found",
  name_mismatch: "Name mismatch",
  citation_mismatch: "Citation mismatch",
  unrecognized: "Unrecognized",
  ambiguous: "Ambiguous",
  bad_reporter: "Bad reporter",
  unresolved_short_form: "Short cite unresolved",
};

const VERDICT_LABEL: Record<string, string> = {
  supports: "Supports",
  partly: "Partly supports",
  does_not_support: "Does not support",
  unclear: "Unclear",
  no_answer: "No answer",
};

export function verdictLabel(verdict: string): string {
  return VERDICT_LABEL[verdict] ?? verdict;
}

export function verdictTone(verdict: string): "fine" | "problem" | "quiet" {
  if (verdict === "supports") return "fine";
  if (verdict === "does_not_support") return "problem";
  return "quiet";
}

const QUOTE_LABEL: Record<string, string> = {
  verified: "Verified",
  altered: "Altered",
  wrong_page: "Wrong page",
  not_in_opinion: "Not in the opinion",
  case_unverified: "Case not confirmed",
  too_short: "Too short to check",
  not_a_case: "Not a case",
  unattributed: "Needs a person",
};

export function citeLabel(status: string): string {
  return CITE_LABEL[status] ?? status;
}

export function quoteLabel(status: string): string {
  return QUOTE_LABEL[status] ?? status;
}

/** A citation the reader has to look at. Unknown statuses count, so a new one is not hidden. */
export function isProblemCite(status: string): boolean {
  return !FINE_CITE.has(status);
}

export type QuoteTone = "fine" | "skip" | "problem";

export function quoteTone(status: string): QuoteTone {
  if (QUOTE_FINE.has(status)) return "fine";
  if (QUOTE_SKIP.has(status)) return "skip";
  return "problem";
}

export function courtListenerUrl(url: string): string {
  if (url.startsWith("/")) return `https://www.courtlistener.com${url}`;
  return url;
}

export type CiteGroup = {
  cite: Cite;
  children: Cite[];
  quotes: Quote[];
};

/** Short forms sit under the full citation they point at. A missing parent stays its own row. */
export function groupCites(report: Report): CiteGroup[] {
  const byId = new Map(report.cites.map((cite) => [cite.id, cite]));
  const children = new Map<number, Cite[]>();
  const roots: Cite[] = [];
  for (const cite of report.cites) {
    if (cite.parent_id != null && byId.has(cite.parent_id)) {
      const list = children.get(cite.parent_id) ?? [];
      list.push(cite);
      children.set(cite.parent_id, list);
    } else {
      roots.push(cite);
    }
  }
  return roots.map((cite) => {
    const nested = children.get(cite.id) ?? [];
    const ids = new Set([cite.id, ...nested.map((child) => child.id)]);
    return {
      cite,
      children: nested,
      quotes: report.quotes.filter(
        (quote) => quote.cite_id != null && ids.has(quote.cite_id),
      ),
    };
  });
}

export function looseQuotes(report: Report): Quote[] {
  const ids = new Set(report.cites.map((cite) => cite.id));
  return report.quotes.filter(
    (quote) => quote.cite_id == null || !ids.has(quote.cite_id),
  );
}

export function groupNeedsAttention(group: CiteGroup): boolean {
  if (isProblemCite(group.cite.status)) return true;
  if (group.children.some((child) => isProblemCite(child.status))) return true;
  return group.quotes.some((quote) => quoteTone(quote.status) === "problem");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isNumberArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "number")
  );
}

function parseCite(value: unknown): Cite | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "number") return null;
  if (typeof value.kind !== "string" || typeof value.text !== "string")
    return null;
  if (typeof value.status !== "string" || typeof value.note !== "string")
    return null;
  if (!isStringArray(value.case_names) || !isStringArray(value.urls))
    return null;
  if (!isNumberArray(value.pin_pages)) return null;
  if (value.parent_id !== null && typeof value.parent_id !== "number")
    return null;
  const text = (key: string) =>
    typeof value[key] === "string" ? value[key] : "";
  return {
    id: value.id,
    kind: value.kind,
    text: value.text,
    status: value.status,
    note: value.note,
    plaintiff: text("plaintiff"),
    defendant: text("defendant"),
    volume: text("volume"),
    reporter: text("reporter"),
    page: text("page"),
    pin_pages: value.pin_pages,
    parent_id: value.parent_id,
    case_names: value.case_names,
    urls: value.urls,
  };
}

function parseVerdict(value: unknown): Verdict | null {
  if (!isRecord(value)) return null;
  if (typeof value.cite_id !== "number") return null;
  if (typeof value.sentence !== "string" || typeof value.signal !== "string")
    return null;
  if (typeof value.verdict !== "string" || typeof value.evidence !== "string")
    return null;
  if (typeof value.score !== "number" || typeof value.page !== "string")
    return null;
  if (
    typeof value.on_pin_page !== "boolean" ||
    typeof value.reason !== "string"
  )
    return null;
  return {
    cite_id: value.cite_id,
    sentence: value.sentence,
    signal: value.signal,
    verdict: value.verdict,
    evidence: value.evidence,
    score: value.score,
    page: value.page,
    on_pin_page: value.on_pin_page,
    reason: value.reason,
  };
}

export function parseModels(value: unknown): CheckModel[] | null {
  if (!isRecord(value) || !Array.isArray(value.models)) return null;
  const models: CheckModel[] = [];
  for (const item of value.models) {
    if (!isRecord(item)) return null;
    if (typeof item.id !== "string" || typeof item.label !== "string")
      return null;
    if (typeof item.available !== "boolean") return null;
    models.push({
      id: item.id,
      label: item.label,
      available: item.available,
    });
  }
  return models;
}

function parseQuote(value: unknown): Quote | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "number" || typeof value.text !== "string")
    return null;
  if (typeof value.status !== "string" || typeof value.note !== "string")
    return null;
  if (value.cite_id !== null && typeof value.cite_id !== "number") return null;
  if (typeof value.how !== "string" || typeof value.omits !== "boolean")
    return null;
  if (value.score !== null && typeof value.score !== "number") return null;
  if (!isNumberArray(value.found_on)) return null;
  return {
    id: value.id,
    text: value.text,
    status: value.status,
    note: value.note,
    cite_id: value.cite_id,
    how: value.how,
    omits: value.omits,
    score: value.score,
    found_on: value.found_on,
  };
}

export function parseReport(value: unknown): Report | null {
  if (
    !isRecord(value) ||
    !Array.isArray(value.cites) ||
    !Array.isArray(value.quotes)
  ) {
    return null;
  }
  const cites: Cite[] = [];
  for (const item of value.cites) {
    const cite = parseCite(item);
    if (!cite) return null;
    cites.push(cite);
  }
  const quotes: Quote[] = [];
  for (const item of value.quotes) {
    const quote = parseQuote(item);
    if (!quote) return null;
    quotes.push(quote);
  }
  const verdicts: Verdict[] = [];
  if (value.verdicts !== undefined) {
    if (!Array.isArray(value.verdicts)) return null;
    for (const item of value.verdicts) {
      const verdict = parseVerdict(item);
      if (!verdict) return null;
      verdicts.push(verdict);
    }
  }
  return { cites, quotes, verdicts };
}
