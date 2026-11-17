import { STATUSES, type Status } from "@/lib/status";

/** Each status has its own shape, so meaning never rests on color alone. */
const ICONS: Record<Status, React.ReactNode> = {
  found: <path d="M2.5 6.5 5 9l4.5-6" />,
  not_found: <circle cx="6" cy="6" r="4" strokeDasharray="2 1.6" />,
  ambiguous: <path d="M6 10V6.5M6 6.5 3 2.5M6 6.5l3-4" />,
  quote_mismatch: <path d="M2.5 4.5h7M2.5 7.5h7M8 2 4 10" />,
  support_questionable: (
    <path d="M4 4.2a2 2 0 1 1 3 1.7c-.7.4-1 .8-1 1.6M6 9.6v.2" />
  ),
  negative_treatment: <path d="M3 10.5v-9M3 2h6l-1.5 2L9 6H3" />,
  unchecked: <path d="M3 6h6" />,
};

const TONES: Record<Status, string> = {
  found: "bg-found-tint text-found shadow-[inset_2px_0_0_var(--found)]",
  not_found:
    "bg-not-found-tint text-not-found shadow-[inset_2px_0_0_var(--not-found)]",
  ambiguous:
    "bg-ambiguous-tint text-ambiguous shadow-[inset_2px_0_0_var(--ambiguous)]",
  quote_mismatch:
    "bg-mismatch-tint text-mismatch shadow-[inset_2px_0_0_var(--mismatch)]",
  support_questionable:
    "bg-questionable-tint text-questionable shadow-[inset_2px_0_0_var(--questionable)]",
  negative_treatment:
    "bg-treatment-tint text-treatment shadow-[inset_2px_0_0_var(--treatment)]",
  unchecked:
    "bg-unchecked-tint text-unchecked shadow-[inset_2px_0_0_var(--unchecked)]",
};

export function StatusChip({ status }: { status: Status }) {
  const { label, description } = STATUSES[status];
  return (
    <span
      className={`inline-flex items-center gap-[0.4em] rounded-site py-[0.15em] pr-[0.6em] pl-[0.45em] font-sans text-step-small leading-[1.4] font-semibold whitespace-nowrap ${TONES[status]}`}
      title={description}
    >
      <svg
        className="size-[0.85em] shrink-0"
        viewBox="0 0 12 12"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[status]}
      </svg>
      {label}
    </span>
  );
}
