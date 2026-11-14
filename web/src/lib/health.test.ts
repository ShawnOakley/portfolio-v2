import { describe, expect, it } from "vitest";
import { describeEngine, isHealth } from "./health";

describe("isHealth", () => {
  it("accepts the API's response shape", () => {
    expect(
      isHealth({ status: "ok", engine: "citecheck", engine_version: "0.1.0" }),
    ).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isHealth(null)).toBe(false);
    expect(isHealth({ status: "ok" })).toBe(false);
    expect(isHealth({ status: "down", engine: "x", engine_version: "1" })).toBe(
      false,
    );
  });
});

describe("describeEngine", () => {
  it("shows name and version", () => {
    expect(
      describeEngine({
        status: "ok",
        engine: "citecheck",
        engine_version: "0.1.0",
      }),
    ).toBe("citecheck 0.1.0");
  });

  it("degrades when the API is unreachable", () => {
    expect(describeEngine(null)).toBe("engine: unavailable");
  });
});
