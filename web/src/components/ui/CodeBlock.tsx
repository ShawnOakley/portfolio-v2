export function CodeBlock({
  children,
  label,
}: {
  children: string;
  label?: string;
}) {
  return (
    <figure className="m-0 rounded-site border border-rule bg-paper-raised">
      {label && (
        <figcaption className="border-b border-rule px-site-4 py-site-2 font-sans text-step-small text-ink-soft">
          {label}
        </figcaption>
      )}
      {/* tabIndex lets keyboard users scroll long lines. */}
      <pre
        className="m-0 overflow-x-auto p-site-4 leading-[1.55] tab-2"
        tabIndex={0}
      >
        <code>{children}</code>
      </pre>
    </figure>
  );
}
