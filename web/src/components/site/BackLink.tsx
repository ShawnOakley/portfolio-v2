import Link from "next/link";

/** A parent link for a page the header tab already marks as current. */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <p className="mb-site-5 print:hidden">
      <Link
        href={href}
        className="inline-flex items-center gap-x-site-2 rounded-site border border-rule-strong bg-paper-raised px-site-3 py-site-1 text-step-small text-ink no-underline hover:border-ink"
      >
        <span aria-hidden="true">←</span>
        {label}
      </Link>
    </p>
  );
}
