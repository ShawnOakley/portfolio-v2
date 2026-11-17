import type { Metadata } from "next";
import { Callout } from "@/components/ui/Callout";
import { CitationPassage } from "./CitationPassage";

export const metadata: Metadata = {
  title: "Citation anatomy",
  description:
    "The parts of one real citation, and how a short cite points back at it.",
};

export default function CitationAnatomyPage() {
  return (
    <>
      <h1>Citation anatomy</h1>
      <p className="lede">
        A full citation names the case and the page where it is printed. A short
        cite points back at that full citation instead of repeating it.
      </p>
      <Callout kind="illustration">
        Written by hand to show the parts. It is not a result from the
        cite-checker.
      </Callout>
      <CitationPassage />
      <p className="mt-site-6 text-ink-soft">
        The court is written again in the parentheses so it can be selected. In
        the form lawyers usually write, the reporter U.S. already names the
        Supreme Court, and the parentheses hold only the year.
      </p>
    </>
  );
}
