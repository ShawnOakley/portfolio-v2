export type Explainer = {
  href: string;
  title: string;
  summary: string;
};

/** Domain pages. */
export const explainers: Explainer[] = [
  {
    href: "/learn/citation-anatomy",
    title: "Citation anatomy",
    summary:
      "The parts of one real citation, and how a short cite points back at it.",
  },
  {
    href: "/learn/citation-failures",
    title: "Citation failures",
    summary:
      "Four ways a citation can fail, including examples from the public Mata v. Avianca opinion.",
  },
  {
    href: "/learn/evaluation",
    title: "Evaluation",
    summary:
      "Precision and recall, why the same rate is wider at 50 items than at 500, and the cite-checker’s measured results.",
  },
];
