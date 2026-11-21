import type { Metadata } from "next";
import { argument, contact, education, roles } from "@/content/resume";
import { CareerChart } from "./CareerChart";
import { CurrentProjects } from "./CurrentProjects";
import { DownloadPdf } from "./DownloadPdf";
import { RoleGroups } from "./RoleGroups";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Shawn Oakley builds legal-AI software, and the résumé that explains it.",
};

export default function AboutPage() {
  return (
    <>
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
        I practiced law at Morrison &amp; Foerster and Paul Hastings, then spent
        over a decade as a software engineer. I now build legal AI tools,
        starting with a citation checker for briefs.
      </p>
      <section className="mt-site-7 print:hidden">
        <div className="flex flex-wrap items-center gap-x-site-4 gap-y-site-2">
          <h2 className="text-step-2">Career and Education</h2>
          <DownloadPdf />
        </div>
        <CareerChart roles={roles} schools={education} />
      </section>

      <RoleGroups roles={roles} schools={education} />

      <CurrentProjects items={argument} />

      <div className="mt-site-7 flex flex-wrap items-center gap-x-site-4 gap-y-site-2">
        <h2 className={`${styles.section} text-step-2`}>Contact</h2>
        <p className="translate-y-[2px] print:hidden [&_a+a]:ml-site-4">
          <a href={`mailto:${contact.email}`}>Email</a>
          <a href={contact.phoneHref}>{contact.phone}</a>
          <a href={contact.github}>GitHub</a>
          <a href={contact.linkedin}>LinkedIn</a>
        </p>
        <p className="hidden print:block">
          {contact.email}
          {" · "}
          {contact.phone}
          {" · GitHub · LinkedIn"}
        </p>
      </div>
    </>
  );
}
