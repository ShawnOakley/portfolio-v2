import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listNotes } from "@/lib/notes";
import styles from "../notes.module.css";

// Only the notes that exist are routes; anything else is a real 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await listNotes()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const note = (await listNotes()).find((n) => n.slug === slug);
  return note ? { title: note.title, description: note.summary } : {};
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  const known = (await listNotes()).some((n) => n.slug === slug);
  if (!known) notFound();
  const { default: Note } = await import(`@/content/notes/${slug}.mdx`);
  return (
    <>
      <p className={styles.back}>
        <Link href="/notes">All design notes</Link>
      </p>
      <Note />
    </>
  );
}
