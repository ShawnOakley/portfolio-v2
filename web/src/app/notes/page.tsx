import type { Metadata } from "next";
import { listNotes } from "@/lib/notes";
import { IndexItem, IndexList } from "@/components/site/IndexList";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Design notes record decisions. The colophon records how the site is built.",
};

export default async function NotesPage() {
  const notes = await listNotes();
  return (
    <>
      <h1>Notes</h1>
      <p className="lede">
        Design notes record one decision and what was rejected. The colophon
        records how the site is built.
      </p>
      <IndexList>
        <IndexItem
          href="/colophon"
          title="Colophon"
          summary="Stack, type, color, and tests."
        />
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
