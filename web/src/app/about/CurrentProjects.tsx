"use client";

import Link from "next/link";
import { useState } from "react";
import type { Explanation } from "@/content/resume";
import styles from "./about.module.css";

type Item = { text: string; explains: Explanation };

function ProjectName({ item }: { item: Explanation }) {
  return item.href ? (
    <Link href={item.href}>{item.label}</Link>
  ) : (
    <span>{item.label}</span>
  );
}

/** Own section, larger than the career rows, closed until opened. */
export function CurrentProjects({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-site-7 border-y border-rule-strong print:hidden">
      <h2>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between gap-x-site-4 px-site-4 py-site-5 text-left font-serif text-step-2 font-semibold hover:bg-paper-raised"
          aria-expanded={open}
          aria-controls="current-projects"
          onClick={() => setOpen((value) => !value)}
        >
          Current Projects
          <span
            aria-hidden
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-site border border-rule-strong font-sans text-step-1 leading-none font-normal text-ink"
          >
            {open ? "−" : "+"}
          </span>
        </button>
      </h2>
      {open ? (
        <ul
          id="current-projects"
          className={`${styles.argument} list-none border-t border-rule p-0`}
        >
          {items.map((item) => (
            <li
              key={item.explains.label}
              className="border-b border-rule px-site-4 py-site-4 last:border-b-0"
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
      ) : (
        <div id="current-projects" hidden />
      )}
    </section>
  );
}
