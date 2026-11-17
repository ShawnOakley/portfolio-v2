export function Figure({
  caption,
  children,
}: {
  caption: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <figure className="m-0">
      <div className="rounded-site border border-rule bg-paper-raised p-site-5">
        {children}
      </div>
      <figcaption className="mt-site-2 font-sans text-step-small text-ink-soft">
        {caption}
      </figcaption>
    </figure>
  );
}
