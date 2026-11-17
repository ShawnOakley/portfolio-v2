import { percent, wilson } from "@/lib/stats";

/**
 * A measured proportion. It takes counts, not a percentage, so it cannot
 * show a number without its sample size and interval.
 */
export function Metric({
  label,
  successes,
  n,
}: {
  label: string;
  successes: number;
  n: number;
}) {
  const p = wilson(successes, n);
  const range = `${percent(p.low)} to ${percent(p.high)}`;
  return (
    <figure className="m-0 min-w-48 font-sans">
      <figcaption className="text-step-small text-ink-soft">{label}</figcaption>
      <p className="font-serif text-step-4 leading-[1.1] font-semibold tabular-nums lining-nums">
        {percent(p.value)}
      </p>
      <div
        className="relative my-site-2 h-3 bg-[linear-gradient(var(--rule),var(--rule))] bg-size-[100%_1px] bg-center bg-no-repeat"
        aria-hidden="true"
      >
        <span
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-[2px] bg-accent"
          style={{
            left: percent(p.low, 2),
            width: percent(p.high - p.low, 2),
          }}
        />
        <span
          className="absolute top-0 h-full w-0.5 -translate-x-px bg-ink"
          style={{ left: percent(p.value, 2) }}
        />
      </div>
      <p className="text-step-small text-ink-soft tabular-nums">
        {successes} of {n}. 95% interval {range}.
      </p>
    </figure>
  );
}
