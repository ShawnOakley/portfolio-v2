import { describe, expect, it } from "vitest";
import { careerLanes, education, roles } from "@/content/resume";
import { groupRoles, laneSpan, layoutCareer, parseDates } from "./career";

const asOf = new Date(Date.UTC(2026, 10, 17));

describe("career dates", () => {
  it("parses a month range as whole months", () => {
    const range = parseDates("Jun 2025 – Apr 2026", asOf);
    expect(range.start.toISOString()).toBe("2025-06-01T00:00:00.000Z");
    expect(range.end.toISOString()).toBe("2026-05-01T00:00:00.000Z");
  });

  it("treats a year range as full years and present as through the current month", () => {
    const years = parseDates("2014 – 2015", asOf);
    expect(years.start.toISOString()).toBe("2014-01-01T00:00:00.000Z");
    expect(years.end.toISOString()).toBe("2016-01-01T00:00:00.000Z");
    const ongoing = parseDates("Aug 2026 – present", asOf);
    expect(ongoing.end.toISOString()).toBe("2026-12-01T00:00:00.000Z");
  });

  it("gives every role a lane and stacks work that overlaps", () => {
    for (const role of roles) {
      expect(careerLanes).toContain(role.lane);
    }
    const layout = layoutCareer(roles, education, asOf);
    const sabbatical = layout.placed.find(
      (item) => item.role.title === "Personal sabbatical",
    );
    const emt = layout.placed.find(
      (item) => item.role.title === "Emergency medical technician",
    );
    expect(sabbatical?.lane).toBe("Other");
    expect(emt?.lane).toBe("Other");
    expect(sabbatical?.row).not.toBe(emt?.row);
    const software = layout.placed.filter((item) => item.lane === "Software");
    expect(software.every((item) => item.row === 0)).toBe(true);
    expect(layout.lanes[0]?.lane).toBe("Education");
    const lawDegree = layout.placed.find(
      (item) => item.role.title === "J.D. and LL.M.",
    );
    expect(lawDegree?.start.toISOString()).toBe("2006-01-01T00:00:00.000Z");
    expect(lawDegree?.end.toISOString()).toBe("2010-01-01T00:00:00.000Z");
    const bioinformatics = layout.placed.find(
      (item) => item.role.title === "M.S., Bioinformatics",
    );
    expect(lawDegree?.row).not.toBe(bioinformatics?.row);
    const brown = layout.placed.find(
      (item) => item.role.title === "B.S., Neuroscience",
    );
    expect(brown?.start.toISOString()).toBe("2002-01-01T00:00:00.000Z");
    expect(brown?.end.toISOString()).toBe("2006-01-01T00:00:00.000Z");
    expect(layout.domain[0].toISOString()).toBe("2002-01-01T00:00:00.000Z");
    expect(
      layout.placed.find((item) => item.role.organization === "Thinkful")?.lane,
    ).toBe("Teaching");
  });

  it("groups every role into a lane, newest first", () => {
    const groups = groupRoles(roles);
    expect(groups.map((group) => group.lane)).toEqual([...careerLanes]);
    expect(groups.flatMap((group) => group.roles)).toHaveLength(roles.length);
    const law = groups[0];
    expect(law?.roles.map((role) => role.organization)).toEqual([
      "Community Legal Aid SoCal",
      "Consilio",
      "Paul Hastings LLP",
      "Morrison & Foerster LLP",
    ]);
    expect(laneSpan(law?.roles ?? [])).toBe("2009 – present");
    expect(
      laneSpan(groups.find((group) => group.lane === "Software")?.roles ?? []),
    ).toBe("2013 – 2024");
    expect(
      laneSpan(groups.find((group) => group.lane === "Other")?.roles ?? []),
    ).toBe("2024 – present");
  });
});
