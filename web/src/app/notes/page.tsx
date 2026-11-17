import type { Metadata } from "next";
import { IndexItem, IndexList } from "@/components/site/IndexList";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Design notes record decisions. The colophon records how the site is built.",
};

export default function NotesPage() {
  return (
    <>
      <h1>Notes</h1>
      <p className="lede">
        Design notes record one decision and what was rejected. The colophon
        records how the site is built.
      </p>
      <IndexList>
        <IndexItem
          href="/notes/design"
          title="Design notes"
          summary="One decision, why it was made, and what was rejected."
        />
        <IndexItem
          href="/colophon"
          title="Colophon"
          summary="Stack, type, color, and tests."
        />
      </IndexList>
    </>
  );
}
