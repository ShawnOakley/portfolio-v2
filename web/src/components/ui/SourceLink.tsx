import styles from "./SourceLink.module.css";

/** A fact's source. Shows the host, so the reader sees where a link leads. */
export function SourceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  let host = "";
  try {
    host = new URL(href).hostname.replace(/^www\./, "");
  } catch {
    // Relative links have no host to show.
  }
  return (
    <a className={styles.source} href={href} rel="noreferrer">
      {children}
      {host && <span className={styles.host}>({host})</span>}
    </a>
  );
}
