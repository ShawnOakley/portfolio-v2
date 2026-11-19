import type { Metadata } from "next";
import Link from "next/link";
import { CheckForm } from "./CheckForm";

const questions = [
  "Does the case exist?",
  "Is it the case the brief names?",
  "Is the quotation accurate at the cited page?",
  "Does the case support the sentence it is cited for?",
];

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
        It is open source and in progress. It asks of every citation in a
        filing:
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
        Paste the text of a brief. This check looks up the case and the
        quotation. It does not ask whether the case supports the sentence. The{" "}
        <Link href="/notes/design">design notes</Link> record the decisions
        behind it. <Link href="/learn">Learn</Link> is separate, and it does not
        describe the tool.
      </p>
      <CheckForm />
    </>
  );
}
