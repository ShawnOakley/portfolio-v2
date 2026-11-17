import { describe, expect, it } from "vitest";
import { argument, barStatus, roles } from "./resume";

describe("resume", () => {
  it("gives every role a year and a single outcome line", () => {
    for (const role of roles) {
      expect(role.dates).toMatch(/\d{4}/);
      expect(role.outcome).not.toMatch(/\n/);
      expect(role.outcome.length).toBeGreaterThan(20);
    }
  });

  it("keeps bar status to one sentence", () => {
    expect(barStatus).toBe("New York bar admission: inactive.");
    expect(barStatus.match(/\./g)).toHaveLength(1);
  });

  it("ties the four practices to the work they explain", () => {
    expect(argument.map((item) => item.explains.label)).toEqual([
      "Hatch-Waxman tracker",
      "Cite-checker",
      "Sourcing every fact",
      "This site",
    ]);
    const linked = new Set(
      roles.flatMap((role) => (role.explains ? [role.explains.label] : [])),
    );
    expect(linked).toEqual(
      new Set([
        "This site",
        "Hatch-Waxman tracker",
        "Sourcing every fact",
        "Gaussian splats",
      ]),
    );
  });
});
