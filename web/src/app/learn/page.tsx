import type { Metadata } from "next";
import { explainers } from "@/content/explainers";
import { IndexItem, IndexList } from "@/components/site/IndexList";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Pages that explain how citations are built, how they fail, and how a checker is scored.",
};

export default function LearnPage() {
  return (
    <>
      <h1>Learn</h1>
      <p className="lede">
        How a citation is built, how one fails, and how a checker is scored.
      </p>
      <IndexList>
        {explainers.map((page) => (
          <IndexItem
            key={page.href}
            href={page.href}
            title={page.title}
            summary={page.summary}
          />
        ))}
      </IndexList>
    </>
  );
}
