/** A fact's source. Shows the host, so the reader sees where a link leads. */
export function SourceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  let host = "";
  try {
    host = new URL(href).hostname.replace(/^www\./, "");
  } catch {
    // Relative links have no host to show.
  }
  return (
    <a className="font-sans" href={href} rel="noreferrer">
      {children}
      {host && (
        <span className="ml-[0.3em] inline-block text-[0.9em] text-ink-soft no-underline">
          ({host})
        </span>
      )}
    </a>
  );
}
