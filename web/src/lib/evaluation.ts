/** Scale a count to another sample size, for the illustrative interval comparison. */
export function scaledCount(
  successes: number,
  n: number,
  target: number,
): number {
  if (n <= 0 || target <= 0) return 0;
  return Math.round((successes / n) * target);
}
