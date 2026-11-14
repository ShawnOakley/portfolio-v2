import styles from "./Callout.module.css";

type Kind = "note" | "limit" | "illustration";

const TITLES: Record<Kind, string> = {
  note: "Note",
  limit: "Limit",
  illustration: "Illustration, not a result",
};

/**
 * "illustration" is for explainers: it tells the reader the example was
 * written by hand and is not output from the tools.
 */
export function Callout({
  kind = "note",
  children,
}: {
  kind?: Kind;
  children: React.ReactNode;
}) {
  return (
    <aside className={styles.callout} data-kind={kind}>
      <p className={styles.title}>{TITLES[kind]}</p>
      <div>{children}</div>
    </aside>
  );
}
