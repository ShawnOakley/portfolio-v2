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
    <li className={`${styles.role} border-b border-rule py-site-3`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-site-4 gap-y-site-1">
        <span className={`${styles.roleTitle} font-serif font-semibold`}>
          {role.title}
        </span>
        <span className="text-step-small text-ink-soft tabular-nums">
          {role.dates}
        </span>
      </div>
      {where && (
        <p
          className={`${styles.place} mt-site-1 text-step-small text-ink-soft`}
        >
          {where}
        </p>
      )}
      <p className={`${styles.outcome} mt-site-2 font-serif`}>{role.outcome}</p>
      {role.explains && (
        <p className="mt-site-2 text-step-small">
          Explains <ProjectName item={role.explains} />.
        </p>
      )}
    </li>
  );
}

const ruledList = "mt-site-4 list-none border-t border-rule p-0";

export default function AboutPage() {
  return (
    <>
      <p className="mb-site-5 print:hidden">
        <DownloadPdf />
      </p>
      <header className="mb-3 hidden print:block" aria-hidden="true">
        <p className={styles.printName}>{contact.name}</p>
        <p className={styles.printContact}>
          {contact.place}
          {" · "}
          {contact.phone}
          {" · "}
          {contact.email}
          {" · "}
          {contact.github.replace("https://", "")}
          {" · "}
          {contact.linkedin.replace("https://www.", "")}
        </p>
      </header>
      <h1 className="print:hidden">About</h1>
      <p className="lede print:hidden">
        I trained and practiced as a lawyer, then spent ten years as a software
        engineer. These are the parts of that work the tools come from.
      </p>
      <ul
        className={`${styles.argument} mt-site-6 list-none border-t border-rule p-0 print:hidden`}
      >
        {argument.map((item) => (
          <li
            key={item.explains.label}
            className="border-b border-rule py-site-3"
          >
            <p
              className={`${styles.project} font-serif text-step-1 font-semibold`}
            >
              <ProjectName item={item.explains} />
            </p>
            <p
              className={`${styles.because} mt-site-1 font-serif text-ink-soft`}
            >
              {item.text}
            </p>
          </li>
        ))}
      </ul>

      <h2 className={`${styles.section} mt-site-7 text-step-2`}>Experience</h2>
      <ul className={ruledList}>
        {experience.map((role) => (
          <RoleItem key={`${role.organization}-${role.dates}`} role={role} />
        ))}
      </ul>

      <h2 className={`${styles.section} mt-site-7 text-step-2`}>Additional</h2>
      <ul className={ruledList}>
        {additional.map((role) => (
          <RoleItem key={`${role.organization}-${role.dates}`} role={role} />
        ))}
      </ul>

      <h2 className={`${styles.section} mt-site-7 text-step-2`}>Education</h2>
      <ul className={ruledList}>
        {education.map((school) => (
          <li
            key={school.institution}
            className={`${styles.school} flex flex-wrap items-baseline justify-between gap-x-site-4 gap-y-site-1 border-b border-rule py-site-3`}
          >
            <span>
              {school.institution}
              <span className="text-ink-soft"> — {school.credential}</span>
            </span>
            <span className="text-step-small text-ink-soft tabular-nums">
              {school.year}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-site-5">{barStatus}</p>

      <h2 className={`${styles.section} mt-site-7 text-step-2`}>Contact</h2>
      <p className="mt-site-4 [&_a+a]:ml-site-4">
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <a href={contact.phoneHref}>{contact.phone}</a>
        <a href={contact.github}>GitHub</a>
        <a href={contact.linkedin}>LinkedIn</a>
        <span> {contact.place}</span>
      </p>
    </>
  );
}
