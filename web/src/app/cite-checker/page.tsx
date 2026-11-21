import type { Metadata } from "next";
import Link from "next/link";
import { Metric } from "@/components/ui/Metric";
import { CheckForm } from "./CheckForm";

const questions = [
  "Does the case exist?",
  "Is it the case the brief names?",
  "Is the quotation accurate at the cited page?",
  "Does the case support the sentence it is cited for?",
];

/** A support check can take minutes. The host may still cut a longer call off. */
export const maxDuration = 300;

export const metadata: Metadata = {
  title: "Legal AI",
  description:
    "Software that checks a brief’s citations and shows its evidence. In progress.",
};

export default function CiteCheckerPage() {
  return (
    <>
      <h1>Legal AI</h1>
      <p className="lede">
        Software that checks a brief’s citations and shows its evidence.
      </p>
      <p className="mt-site-5">
        It is in progress. It asks of every citation in a filing:
      </p>
      <ul className="mt-site-6 list-none border-t border-rule p-0">
        {questions.map((question) => (
          <li
            key={question}
            className="border-b border-rule py-site-3 font-serif text-step-1"
          >
            {question}
          </li>
        ))}
      </ul>
      <p className="mt-site-6 text-ink-soft">
        Paste the text of a brief, or drop a PDF. The basic check verifies each
        case and each quotation. Checking whether the case supports the sentence
        is optional, uses a language model, and takes several minutes. The{" "}
        <Link href="/notes/design">design notes</Link> record the decisions
        behind it.
      </p>
      <h2 className="mt-site-7 text-step-2">Results so far</h2>
      <p className="mt-site-3">
        The filing sanctioned in <i>Mata v. Avianca</i> cited seven cases that
        do not exist. The checker flags five of them. The other two are Westlaw
        citations, which it reports as not checkable.
      </p>
      <p className="mt-site-3">
        A separate test set of 50 sentences was scored once, with the prompt
        frozen beforehand.
      </p>
      <div className="mt-site-5 flex flex-wrap gap-site-6">
        <Metric label="Altered quotations flagged" successes={12} n={12} />
        <Metric
          label="Support verdicts matching the label"
          successes={10}
          n={15}
        />
      </div>
      <p className="mt-site-4 text-ink-soft">
        All five support misses were the same error: the model rated partial
        support as full support. Every verdict quoted its evidence from the
        opinion. <Link href="/learn/evaluation">Evaluation</Link> explains the
        intervals.
      </p>
      <CheckForm />
    </>
  );
}
