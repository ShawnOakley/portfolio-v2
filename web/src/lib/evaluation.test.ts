import { describe, expect, it } from "vitest";
import { scaledCount } from "./evaluation";

describe("scaledCount", () => {
  it("keeps a 45 of 50 rate when the sample grows to 500", () => {
    expect(scaledCount(45, 50, 500)).toBe(450);
  });

  it("returns 0 when there is nothing to scale", () => {
    expect(scaledCount(0, 0, 500)).toBe(0);
  });
});
