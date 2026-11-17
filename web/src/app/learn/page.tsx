import type { Metadata } from "next";
import { explainers } from "@/content/explainers";
import { IndexItem, IndexList } from "@/components/site/IndexList";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Pages that explain citations and evaluation. They do not describe the tools.",
};

export default function LearnPage() {
  return (
    <>
      <h1>Learn</h1>
      <p className="lede">
        These pages explain the subject. They do not say what the tools do.
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
