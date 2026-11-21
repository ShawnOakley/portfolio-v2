import type { Metadata } from "next";
import { BackLink } from "@/components/site/BackLink";
import { Callout } from "@/components/ui/Callout";
import { Metric } from "@/components/ui/Metric";
import { Matrix } from "./Matrix";

export const metadata: Metadata = {
  title: "Evaluation",
  description:
    "Precision, recall, and how the interval changes with the count, with the cite-checker’s measured results.",
};

export default function EvaluationPage() {
  return (
    <>
      <BackLink href="/learn" label="Back to Learn" />
      <h1>Evaluation</h1>
      <p className="lede">
        Precision is the share of predicted yeses that were actually yes. Recall
        is the share of actual yeses that were predicted yes. The same rate has
        a wider interval when the count is small.
      </p>
      <h2 className="mt-site-7 text-step-2">Measured on the cite-checker</h2>
      <p className="mt-site-3">
        Fifty test sentences, kept apart from the ten used to write the prompt,
        and scored once. Twelve were quotations altered by a word or two.
        Fifteen were support questions with a label written before the run.
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
        Fifteen is a small count, and the interval shows it. All five misses
        rated partial support as full support.
      </p>
      <h2 className="mt-site-7 text-step-2">Try the arithmetic</h2>
      <Callout kind="illustration">
        The counts below start at a made-up example. Move them.
      </Callout>
      <Matrix />
    </>
  );
}
