"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteName } from "@/lib/site";
import { ThemeControl } from "./ThemeControl";

/** Only routes that have real content appear here. */
const NAV = [
  { href: "/about", label: "About" },
  { href: "/cite-checker", label: "Legal AI" },
  { href: "/graphics", label: "Graphics" },
  { href: "/learn", label: "Learn" },
  { href: "/notes", label: "Notes" },
];

const navLink =
  "inline-block py-site-1 text-ink no-underline decoration-ink decoration-2 underline-offset-[0.22em]";

function isCurrent(pathname: string, href: string): boolean {
  if (href === "/notes") {
    return (
      pathname === "/colophon" ||
      pathname === "/notes" ||
      pathname.startsWith("/notes/")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-site-5 gap-y-site-2 border-b border-rule px-gutter py-site-4 print:hidden">
      <a
        className="absolute top-site-2 left-gutter -translate-y-[200%] rounded-site bg-accent px-site-3 py-site-2 text-accent-ink focus:translate-y-0"
        href="#main"
      >
        Skip to content
      </a>
      <Link
        className="inline-block py-site-1 font-serif text-step-1 font-semibold text-ink no-underline"
        href="/"
      >
        {siteName}
      </Link>
      <nav
        className="flex flex-wrap items-center gap-x-site-5 gap-y-site-2"
        aria-label="Site"
      >
        <ul className="m-0 flex list-none flex-wrap gap-x-site-5 gap-y-site-2 p-0">
          {NAV.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  className={
                    current
                      ? `${navLink} underline`
                      : `${navLink} hover:underline`
                  }
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <ThemeControl />
      </nav>
    </header>
  );
}
