import type { Metadata } from "next";
import { listNotes } from "@/lib/notes";
import { IndexItem, IndexList } from "@/components/site/IndexList";

export const metadata: Metadata = {
  title: "Design notes",
  description: "Short records of design decisions, with what was rejected.",
};

export default async function NotesPage() {
  const notes = await listNotes();
  return (
    <>
      <h1>Design notes</h1>
      <p className="lede">
        Each note records one decision, the reason for it, and what I rejected.
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
