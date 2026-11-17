import Link from "next/link";

const questions = [
  "Does the case exist?",
  "Is it the case the brief names?",
  "Is the quotation accurate at the cited page?",
  "Does the case support the sentence it is cited for?",
];

export default function Home() {
  return (
    <>
      <h1 className="max-w-[18ch] text-step-5 leading-[1.08] tracking-[-0.02em]">
        Software that checks a brief&rsquo;s citations and shows its evidence.
      </h1>
      <p className="lede mt-site-5">
        I trained and practiced as a lawyer, then spent ten years as a software
        engineer. I build open-source tools that ask of every citation in a
        filing:
      </p>
      <ul className="mt-site-7 list-none border-t border-rule p-0">
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
        The first tool, a cite-checker, is in progress. Until it ships, the{" "}
        <Link href="/notes">design notes</Link> record the decisions behind it.{" "}
        <Link href="/learn">Learn</Link> is separate, and it does not describe
        the tool.
      </p>
    </>
  );
}
