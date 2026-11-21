import type { Metadata } from "next";
import { CheckFlow } from "@/components/notes/CheckFlow";
import { BackLink } from "@/components/site/BackLink";
import { IndexItem, IndexList } from "@/components/site/IndexList";
import { listNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Citation Checker Implementation Notes",
  description:
    "Short notes on why the citation checker is built the way it is.",
};

export default async function DesignNotesPage() {
  const notes = await listNotes();
  return (
    <>
      <BackLink href="/notes" label="Back to Notes" />
      <h1>Citation Checker Implementation Notes</h1>
      <p className="lede">
        Short notes on why the checker is built the way it is.
      </p>
      <IndexList>
        {notes.map((note) => (
          <IndexItem
            key={note.slug}
            href={`/notes/${note.slug}`}
            title={note.title}
            summary={note.summary}
          />
        ))}
      </IndexList>
      <CheckFlow />
    </>
  );
}
