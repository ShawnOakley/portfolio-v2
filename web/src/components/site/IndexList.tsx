import Link from "next/link";

/** Ruled index shared by Learn, Graphics, and the design notes. */
export const indexTitle = "font-serif text-step-1 font-semibold";
export const indexSummary = "mt-site-1 text-ink-soft";

export function IndexList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-site-6 list-none border-t border-rule p-0">{children}</ul>
  );
}

export function IndexItem({
  href,
  title,
  summary,
  external = false,
}: {
  href: string;
  title: string;
  summary?: string;
  external?: boolean;
}) {
  const link = external ? (
    <a className={indexTitle} href={href}>
      {title}
    </a>
  ) : (
    <Link className={indexTitle} href={href}>
      {title}
    </Link>
  );
  return (
    <li className="border-b border-rule py-site-4">
      {link}
      {summary ? <p className={indexSummary}>{summary}</p> : null}
    </li>
  );
}
