import { describe, expect, it } from "vitest";
import { percent, wilson } from "./stats";

describe("wilson", () => {
  it("matches the published value for 45 of 50", () => {
    const r = wilson(45, 50);
    expect(r.value).toBeCloseTo(0.9, 10);
    expect(r.low).toBeCloseTo(0.7864, 3);
    expect(r.high).toBeCloseTo(0.9565, 3);
  });

  it("stays inside [0, 1] at the edges", () => {
    expect(wilson(0, 10).low).toBe(0);
    expect(wilson(0, 10).high).toBeGreaterThan(0);
    expect(wilson(10, 10).high).toBe(1);
    expect(wilson(10, 10).low).toBeLessThan(1);
  });

  it("narrows as n grows", () => {
    const small = wilson(45, 50);
    const large = wilson(450, 500);
    expect(large.high - large.low).toBeLessThan(small.high - small.low);
  });

  it("rejects impossible counts", () => {
    expect(() => wilson(5, 0)).toThrow(RangeError);
    expect(() => wilson(6, 5)).toThrow(RangeError);
    expect(() => wilson(1.5, 5)).toThrow(RangeError);
  });
});

describe("percent", () => {
  it("formats proportions", () => {
    expect(percent(0.9)).toBe("90%");
    expect(percent(0.7864, 1)).toBe("78.6%");
  });
});
