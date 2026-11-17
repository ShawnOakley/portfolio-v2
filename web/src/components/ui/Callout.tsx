type Kind = "note" | "limit" | "illustration";

const TITLES: Record<Kind, string> = {
  note: "Note",
  limit: "Limit",
  illustration: "Illustration, not a result",
};

const BORDERS: Record<Kind, string> = {
  note: "border-solid border-l-rule-strong",
  limit: "border-solid border-l-ambiguous",
  illustration: "border-dashed border-l-rule-strong",
};

/**
 * "illustration" is for explainers: it tells the reader the example was
 * written by hand and is not output from the tools.
 */
export function Callout({
  kind = "note",
  children,
}: {
  kind?: Kind;
  children: React.ReactNode;
}) {
  return (
    <aside
      className={`border-l-[3px] bg-paper-raised px-site-4 py-site-3 font-sans text-[0.95rem] ${BORDERS[kind]}`}
    >
      <p className="mb-site-1 font-[650]">{TITLES[kind]}</p>
      <div>{children}</div>
    </aside>
  );
}
