import type { Metadata } from "next";
import Link from "next/link";
import { explainers } from "@/content/explainers";
import styles from "./learn.module.css";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Pages that explain citations and evaluation. They do not describe the tools.",
};

export default function LearnPage() {
  return (
    <>
      <h1>Learn</h1>
      <p className="lede">
        These pages explain the subject. They do not say what the tools do.
      </p>
      <ul className={styles.list}>
        {explainers.map((page) => (
          <li key={page.href} className={styles.item}>
            <Link className={styles.title} href={page.href}>
              {page.title}
            </Link>
            <p className={styles.summary}>{page.summary}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
