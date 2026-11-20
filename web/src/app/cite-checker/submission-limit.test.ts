import { describe, expect, it } from "vitest";
import { CHECK_WINDOW_MS, admit, waitMessage } from "./submission-limit";

describe("admit", () => {
  it("allows two checks and names the wait until the oldest expires", () => {
    const first = admit([], 0);
    const second = admit(first.stamps, 1_000);
    const third = admit(second.stamps, 2_000);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(third.ok).toBe(false);
    if (!third.ok) {
      expect(third.retryInMs).toBe(CHECK_WINDOW_MS - 2_000);
    }
  });

  it("frees a slot when the oldest check leaves the window", () => {
    const first = admit([], 0);
    const second = admit(first.stamps, 1_000);
    const later = admit(second.stamps, CHECK_WINDOW_MS);

    expect(later.ok).toBe(true);
    if (later.ok) expect(later.stamps).toEqual([1_000, CHECK_WINDOW_MS]);
  });
});

describe("waitMessage", () => {
  it("states the cap and the remaining time", () => {
    expect(waitMessage(12 * 60 * 1000 + 4 * 1000)).toBe(
      "Two checks are allowed every 15 minutes. Try again in 12 minutes 4 seconds.",
    );
    expect(waitMessage(60_000)).toBe(
      "Two checks are allowed every 15 minutes. Try again in 1 minute.",
    );
    expect(waitMessage(1_000)).toBe(
      "Two checks are allowed every 15 minutes. Try again in 1 second.",
    );
  });
});
