import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <h1 className={styles.statement}>
        Software that checks a brief&rsquo;s citations and shows its evidence.
      </h1>
      <p className={`lede ${styles.lede}`}>
        I trained and practiced as a lawyer, then spent ten years as a software
        engineer. I build open-source tools that ask of every citation in a
        filing:
      </p>
      <ul className={styles.checks}>
        <li>Does the case exist?</li>
        <li>Is it the case the brief names?</li>
        <li>Is the quotation accurate at the cited page?</li>
        <li>Does the case support the sentence it is cited for?</li>
      </ul>
      <p className={styles.status}>
        The first tool, a cite-checker, is in progress. Until it ships, the{" "}
        <Link href="/notes">design notes</Link> record the decisions behind it.{" "}
        <Link href="/learn">Learn</Link> is separate, and it does not describe
        the tool.
      </p>
    </>
  );
}
