import type { Metadata } from "next";
import Link from "next/link";
import {
  additional,
  argument,
  barStatus,
  contact,
  education,
  experience,
  type Explanation,
  type Role,
} from "@/content/resume";
import { DownloadPdf } from "./DownloadPdf";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Shawn Oakley builds legal-AI software, and the résumé that explains it.",
};

function ProjectName({ item }: { item: Explanation }) {
  return item.href ? (
    <Link href={item.href}>{item.label}</Link>
  ) : (
    <span>{item.label}</span>
  );
}

function RoleItem({ role }: { role: Role }) {
  const where = [role.organization, role.location].filter(Boolean).join(", ");
  return (
    <li className={styles.role}>
      <div className={styles.roleHead}>
        <span className={styles.roleTitle}>{role.title}</span>
        <span className={styles.dates}>{role.dates}</span>
      </div>
      {where && <p className={styles.place}>{where}</p>}
      <p className={styles.outcome}>{role.outcome}</p>
      {role.explains && (
        <p className={styles.explains}>
          Explains <ProjectName item={role.explains} />.
        </p>
      )}
    </li>
  );
}

export default function AboutPage() {
  return (
    <>
      <p className={`${styles.pdfRow} ${styles.screenOnly}`}>
        <DownloadPdf />
      </p>
      <header className={styles.printOnly} aria-hidden="true">
        <p className={styles.printName}>{contact.name}</p>
        <p className={styles.printContact}>
          {contact.place}
          {" · "}
          {contact.phone}
          {" · "}
          {contact.email}
          {" · "}
          {contact.github.replace("https://", "")}
        </p>
      </header>
      <h1 className={styles.screenOnly}>About</h1>
      <p className={`lede ${styles.screenOnly}`}>
        I trained and practiced as a lawyer, then spent ten years as a software
        engineer. These are the parts of that work the tools come from.
      </p>
      <ul className={`${styles.argument} ${styles.screenOnly}`}>
        {argument.map((item) => (
          <li key={item.explains.label}>
            <p className={styles.project}>
              <ProjectName item={item.explains} />
            </p>
            <p className={styles.because}>{item.text}</p>
          </li>
        ))}
      </ul>

      <h2 className={styles.section}>Experience</h2>
      <ul className={styles.list}>
        {experience.map((role) => (
          <RoleItem key={`${role.organization}-${role.dates}`} role={role} />
        ))}
      </ul>

      <h2 className={styles.section}>Additional</h2>
      <ul className={styles.list}>
        {additional.map((role) => (
          <RoleItem key={`${role.organization}-${role.dates}`} role={role} />
        ))}
      </ul>

      <h2 className={styles.section}>Education</h2>
      <ul className={styles.schools}>
        {education.map((school) => (
          <li key={school.institution} className={styles.school}>
            <span>
              {school.institution}
              <span className={styles.credential}> — {school.credential}</span>
            </span>
            <span className={styles.dates}>{school.year}</span>
          </li>
        ))}
      </ul>

      <p className={styles.bar}>{barStatus}</p>

      <h2 className={styles.section}>Contact</h2>
      <p className={styles.contact}>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <a href={contact.phoneHref}>{contact.phone}</a>
        <a href={contact.github}>GitHub</a>
        <span> {contact.place}</span>
      </p>
    </>
  );
}
