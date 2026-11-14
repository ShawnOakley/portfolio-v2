import styles from "./Figure.module.css";

export function Figure({
  caption,
  children,
}: {
  caption: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <figure className={styles.figure}>
      <div className={styles.body}>{children}</div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
