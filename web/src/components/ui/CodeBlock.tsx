import styles from "./CodeBlock.module.css";

export function CodeBlock({
  children,
  label,
}: {
  children: string;
  label?: string;
}) {
  return (
    <figure className={styles.block}>
      {label && <figcaption className={styles.label}>{label}</figcaption>}
      {/* tabIndex lets keyboard users scroll long lines. */}
      <pre className={styles.pre} tabIndex={0}>
        <code>{children}</code>
      </pre>
    </figure>
  );
}
