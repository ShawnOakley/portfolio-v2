/** One process allows two citation checks in any 15-minute stretch. */
export const CHECK_LIMIT = 2;
export const CHECK_WINDOW_MS = 15 * 60 * 1000;

export type Admission =
  | { ok: true; stamps: number[] }
  | { ok: false; stamps: number[]; retryInMs: number };

/** Sliding window. A refused check does not take a slot. */
export function admit(
  stamps: number[],
  now: number,
  limit = CHECK_LIMIT,
  windowMs = CHECK_WINDOW_MS,
): Admission {
  const open = stamps.filter((stamp) => now - stamp < windowMs);
  if (open.length >= limit) {
    return { ok: false, stamps: open, retryInMs: open[0] + windowMs - now };
  }
  return { ok: true, stamps: [...open, now] };
}

let stamps: number[] = [];

export function claimCheck(now = Date.now()): Admission {
  const result = admit(stamps, now);
  stamps = result.stamps;
  return result;
}

export function waitMessage(retryInMs: number): string {
  const totalSeconds = Math.max(1, Math.ceil(retryInMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const minuteLabel = minutes === 1 ? "minute" : "minutes";
  const secondLabel = seconds === 1 ? "second" : "seconds";
  const time =
    minutes === 0
      ? `${seconds} ${secondLabel}`
      : seconds === 0
        ? `${minutes} ${minuteLabel}`
        : `${minutes} ${minuteLabel} ${seconds} ${secondLabel}`;
  return `Two checks are allowed every 15 minutes. Try again in ${time}.`;
}
