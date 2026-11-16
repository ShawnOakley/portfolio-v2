"use client";

import styles from "./about.module.css";

export function DownloadPdf() {
  return (
    <button type="button" className={styles.pdf} onClick={() => window.print()}>
      Download PDF
    </button>
  );
}
