/** A proportion with its 95% Wilson score interval. */
export type Proportion = {
  successes: number;
  n: number;
  value: number;
  low: number;
  high: number;
};

const Z95 = 1.959963984540054;

/**
 * Wilson score interval. Preferred over the normal approximation because it
 * behaves at small n and near 0 or 1, which is where eval sets live.
 */
export function wilson(successes: number, n: number, z = Z95): Proportion {
  if (!Number.isInteger(successes) || !Number.isInteger(n)) {
    throw new RangeError("successes and n must be integers");
  }
  if (n <= 0 || successes < 0 || successes > n) {
    throw new RangeError("need 0 <= successes <= n and n > 0");
  }
  const p = successes / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  return {
    successes,
    n,
    value: p,
    // At the edges the bound is exactly 0 or 1; say so without float error.
    low: successes === 0 ? 0 : Math.max(0, center - half),
    high: successes === n ? 1 : Math.min(1, center + half),
  };
}

export function percent(x: number, digits = 0): string {
  return `${(x * 100).toFixed(digits)}%`;
}
