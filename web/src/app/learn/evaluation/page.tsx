import type { Metadata } from "next";
import { Callout } from "@/components/ui/Callout";
import { Matrix } from "./Matrix";

export const metadata: Metadata = {
  title: "Evaluation",
  description:
    "An illustrative confusion matrix, with precision, recall, and how the interval changes with the count.",
};

export default function EvaluationPage() {
  return (
    <>
      <h1>Evaluation</h1>
      <p className="lede">
        Precision is the share of predicted yeses that were actually yes. Recall
        is the share of actual yeses that were predicted yes. The same rate has
        a wider interval when the count is small.
      </p>
      <Callout kind="illustration">
        The counts start at a made-up example. Move them. Nothing here was
        measured on a tool.
      </Callout>
      <Matrix />
    </>
  );
}
