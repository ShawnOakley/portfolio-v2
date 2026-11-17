import type { Metadata } from "next";
import Link from "next/link";
import {
  argument,
  contact,
  education,
  roles,
  type Explanation,
} from "@/content/resume";
import { CareerChart } from "./CareerChart";
import { DownloadPdf } from "./DownloadPdf";
import { RoleGroups } from "./RoleGroups";
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
      <section className="mt-site-7 print:hidden">
        <h2 className="text-step-2">Career and Education</h2>
        <CareerChart roles={roles} schools={education} />
      </section>

      <RoleGroups roles={roles} schools={education} />

      <ul
        className={`${styles.argument} mt-site-7 list-none border-t border-rule p-0 print:hidden`}
      >
        {argument.map((item) => (
          <li
            key={item.explains.label}
            className="border-b border-rule py-site-4"
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

      <h2 className={`${styles.section} mt-site-7 text-step-2`}>Contact</h2>
      <p className="mt-site-4 [&_a+a]:ml-site-4">
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <a href={contact.phoneHref}>{contact.phone}</a>
        <a href={contact.github}>GitHub</a>
        <a href={contact.linkedin}>LinkedIn</a>
      </p>
    </>
  );
}
