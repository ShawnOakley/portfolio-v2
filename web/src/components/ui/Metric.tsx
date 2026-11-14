import { percent, wilson } from "@/lib/stats";
import styles from "./Metric.module.css";

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
    <figure className={styles.metric}>
      <figcaption className={styles.label}>{label}</figcaption>
      <p className={styles.value}>{percent(p.value)}</p>
      <div className={styles.track} aria-hidden="true">
        <span
          className={styles.interval}
          style={{
            left: percent(p.low, 2),
            width: percent(p.high - p.low, 2),
          }}
        />
        <span className={styles.point} style={{ left: percent(p.value, 2) }} />
      </div>
      <p className={styles.detail}>
        {successes} of {n}. 95% interval {range}.
      </p>
    </figure>
  );
}
