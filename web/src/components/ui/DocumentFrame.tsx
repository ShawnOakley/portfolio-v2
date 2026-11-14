import styles from "./DocumentFrame.module.css";

/**
 * Sets text the way a filing is set: document serif, numbered lines in the
 * margin. Line numbers are a real reference system in pleadings, so they
 * appear only around document text, never as decoration.
 */
export function DocumentFrame({
  lines,
  label,
}: {
  lines: React.ReactNode[];
  label: string;
}) {
  return (
    <ol className={styles.frame} aria-label={label}>
      {lines.map((line, i) => (
        <li key={i} className={styles.line}>
          <span>{line}</span>
        </li>
      ))}
    </ol>
  );
}
