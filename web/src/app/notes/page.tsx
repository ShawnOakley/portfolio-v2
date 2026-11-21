import type { Metadata } from "next";
import { IndexItem, IndexList } from "@/components/site/IndexList";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Why the citation checker is built the way it is, and how this site is put together.",
};

export default function NotesPage() {
  return (
    <>
      <h1>Notes</h1>
      <p className="lede">
        Why the checker is built the way it is, and how this site is put
        together.
      </p>
      <IndexList>
        <IndexItem
          href="/notes/design"
          title="Citation Checker Implementation Notes"
          summary="The choices behind the checker, and what each one cost."
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
