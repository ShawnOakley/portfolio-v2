import { describe, expect, it } from "vitest";
import { argument, roles } from "./resume";

describe("resume", () => {
  it("gives every role a year and a single outcome line", () => {
    for (const role of roles) {
      expect(role.dates).toMatch(/\d{4}/);
      expect(role.outcome).not.toMatch(/\n/);
      expect(role.outcome.length).toBeGreaterThan(20);
    }
  });

  it("ties the practices to the work they explain", () => {
    expect(argument.map((item) => item.explains.label)).toEqual([
      "Legal AI",
      "Graphics",
      "This site",
    ]);
    const linked = new Set(
      roles.flatMap((role) => (role.explains ? [role.explains.label] : [])),
    );
    expect(linked).toEqual(
      new Set(["This site", "Legal AI", "Graphics", "Gaussian splats"]),
    );
  });
});
