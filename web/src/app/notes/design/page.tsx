import type { Metadata } from "next";
import { BackLink } from "@/components/site/BackLink";
import { IndexItem, IndexList } from "@/components/site/IndexList";
import { listNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Design notes",
  description: "Short records of design decisions, with what was rejected.",
};

export default async function DesignNotesPage() {
  const notes = await listNotes();
  return (
    <>
      <BackLink href="/notes" label="Back to Notes" />
      <h1>Design notes</h1>
      <p className="lede">
        Each note records one decision, the reason for it, and what was
        rejected.
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
    </>
  );
}
