const TONES = {
  error: {
    role: "alert" as const,
    className: "bg-not-found-tint shadow-[inset_3px_0_0_var(--not-found)]",
  },
  progress: {
    role: "status" as const,
    className: "bg-paper-raised shadow-[inset_3px_0_0_var(--ink)]",
  },
  success: {
    role: "status" as const,
    className: "bg-found-tint shadow-[inset_3px_0_0_var(--found)]",
  },
};

function Spinner() {
  return (
    <span
      className="mt-[0.2em] inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-ink border-t-transparent"
      aria-hidden="true"
    />
  );
}

/** The site's error, progress, and success notice. Apps use this instead of their own alert markup. */
export function Notice({
  tone,
  children,
}: {
  tone: keyof typeof TONES;
  children: React.ReactNode;
}) {
  const style = TONES[tone];
  return (
    <p
      className={`mt-site-5 flex items-start gap-site-3 rounded-site px-site-3 py-site-3 text-ink ${style.className}`}
      role={style.role}
    >
      {tone === "progress" ? <Spinner /> : null}
      <span>{children}</span>
    </p>
  );
}
