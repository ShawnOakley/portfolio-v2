import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const NOTES_DIR = path.join(process.cwd(), "src/content/notes");

export type NoteMeta = { slug: string; title: string; summary: string };

/** Title is the first `# ` heading; summary is the "Decision." paragraph. */
export function parseNote(slug: string, source: string): NoteMeta {
  const title = /^#\s+(.+)$/m.exec(source)?.[1]?.trim() ?? slug;
  const summary =
    /\*\*Decision\.\*\*\s+([\s\S]*?)(?:\n\s*\n|$)/
      .exec(source)?.[1]
      ?.replace(/\s+/g, " ")
      .replace(/[`*]/g, "")
      .trim() ?? "";
  return { slug, title, summary };
}

export async function listNotes(): Promise<NoteMeta[]> {
  const files = (await readdir(NOTES_DIR)).filter((f) => f.endsWith(".mdx"));
  const notes = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      return parseNote(
        slug,
        await readFile(path.join(NOTES_DIR, file), "utf8"),
      );
    }),
  );
  return notes.sort((a, b) => a.title.localeCompare(b.title));
}
