import type { Metadata } from "next";
import Link from "next/link";
import { listNotes } from "@/lib/notes";
import styles from "./notes.module.css";

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
      <ul className={styles.list}>
        {notes.map((note) => (
          <li key={note.slug} className={styles.item}>
            <Link className={styles.title} href={`/notes/${note.slug}`}>
              {note.title}
            </Link>
            {note.summary && <p className={styles.summary}>{note.summary}</p>}
          </li>
        ))}
      </ul>
    </>
  );
}
