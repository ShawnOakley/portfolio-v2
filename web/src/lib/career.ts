import { careerLanes, type Role, type School } from "@/content/resume";

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export const BAR_H = 22;
export const BAR_GAP = 6;
export const LANE_GAP = 12;
export const AXIS_H = 32;

/** Education is drawn first. It is not a job lane. */
export const chartLanes = ["Education", ...careerLanes] as const;

export type ChartLane = (typeof chartLanes)[number];

/** Lane color. The lane name is the label; the color is a second cue. */
export const laneColor: Record<ChartLane, string> = {
  Education: "var(--mismatch)",
  Law: "var(--accent)",
  Software: "var(--ink)",
  Teaching: "var(--ambiguous)",
  Other: "var(--rule-strong)",
};

export type PlacedRole = {
  id: string;
  role: Role;
  start: Date;
  end: Date;
  lane: ChartLane;
  row: number;
};

export function monthAfter(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
}

function parseEdge(text: string, edge: "start" | "end", asOf: Date): Date {
  if (text.toLowerCase() === "present") return monthAfter(asOf);
  const monthYear = /^([A-Z][a-z]{2}) (\d{4})$/.exec(text);
  if (monthYear) {
    const monthName = monthYear[1];
    const yearText = monthYear[2];
    const month = monthName === undefined ? undefined : MONTHS[monthName];
    if (month === undefined || yearText === undefined) {
      throw new Error(`Bad month in "${text}"`);
    }
    const year = Number(yearText);
    return edge === "start"
      ? new Date(Date.UTC(year, month, 1))
      : new Date(Date.UTC(year, month + 1, 1));
  }
  const yearOnly = /^(\d{4})$/.exec(text);
  const yearText = yearOnly?.[1];
  if (yearText !== undefined) {
    const year = Number(yearText);
    return edge === "start"
      ? new Date(Date.UTC(year, 0, 1))
      : new Date(Date.UTC(year + 1, 0, 1));
  }
  throw new Error(`Bad date "${text}"`);
}

/** Inclusive of the named start and end months. `present` runs through the current month. */
export function parseDates(
  dates: string,
  asOf: Date,
): { start: Date; end: Date } {
  const parts = dates.split("–").map((part) => part.trim());
  const startText = parts[0];
  const endText = parts[1];
  if (parts.length !== 2 || startText === undefined || endText === undefined) {
    throw new Error(`Bad range "${dates}"`);
  }
  const start = parseEdge(startText, "start", asOf);
  let end = parseEdge(endText, "end", asOf);
  if (end <= start) end = monthAfter(start);
  return { start, end };
}

/** A shared handoff month is not a second row. A real overlap is. */
function overlaps(
  a: { start: Date; end: Date },
  b: { start: Date; end: Date },
): boolean {
  const overlap =
    Math.min(a.end.getTime(), b.end.getTime()) -
    Math.max(a.start.getTime(), b.start.getTime());
  return overlap > 1000 * 60 * 60 * 24 * 32;
}

export function laneBlock(rows: number): number {
  return rows * BAR_H + Math.max(0, rows - 1) * BAR_GAP + LANE_GAP;
}

export function layoutCareer(roles: Role[], schools: School[], asOf: Date) {
  const education = schools.map((school) => {
    const dates = school.span ?? school.year;
    return {
      role: {
        title: school.credential,
        organization: school.institution,
        location: "",
        dates,
        lane: "Law" as const,
        outcome: school.credential,
      },
      lane: "Education" as const,
      ...parseDates(school.span ?? `${school.year} – ${school.year}`, asOf),
    };
  });
  const parsed = [
    ...education,
    ...roles.map((role) => ({
      role,
      lane: role.lane,
      ...parseDates(role.dates, asOf),
    })),
  ];

  const placed: PlacedRole[] = [];
  const lanes = chartLanes.map((lane) => {
    const inLane = parsed
      .filter((item) => item.lane === lane)
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    const rows: { start: Date; end: Date }[][] = [];
    for (const item of inLane) {
      let row = rows.findIndex((occupied) =>
        occupied.every((other) => !overlaps(item, other)),
      );
      if (row === -1) {
        row = rows.length;
        rows.push([]);
      }
      const occupied = rows[row];
      if (!occupied) throw new Error(`Missing row ${row}`);
      occupied.push(item);
      placed.push({
        id: `${item.role.title}-${item.role.dates}`,
        role: item.role,
        start: item.start,
        end: item.end,
        lane,
        row,
      });
    }
    return { lane, rows: Math.max(1, rows.length) };
  });

  const laneTop = new Map<ChartLane, number>();
  let plotHeight = 0;
  for (const lane of lanes) {
    laneTop.set(lane.lane, plotHeight);
    plotHeight += laneBlock(lane.rows);
  }

  const domain: [Date, Date] = [
    new Date(Math.min(...placed.map((item) => item.start.getTime()))),
    new Date(Math.max(...placed.map((item) => item.end.getTime()))),
  ];

  return { placed, lanes, laneTop, plotHeight, domain };
}

export function barY(top: number, row: number): number {
  return top + row * (BAR_H + BAR_GAP);
}

const SORT_AS_OF = new Date(Date.UTC(2026, 10, 1));

/** Newest role first, in the same lane order as the chart. */
export function groupRoles(roles: Role[]) {
  return careerLanes
    .map((lane) => ({
      lane,
      roles: roles
        .filter((role) => role.lane === lane)
        .sort(
          (a, b) =>
            parseDates(b.dates, SORT_AS_OF).start.getTime() -
            parseDates(a.dates, SORT_AS_OF).start.getTime(),
        ),
    }))
    .filter((group) => group.roles.length > 0);
}

/** Outer years of a lane. A current role ends at “present”. */
export function laneSpan(roles: Role[]): string {
  const years: number[] = [];
  let present = false;
  for (const role of roles) {
    const parts = role.dates.split("–").map((part) => part.trim());
    const startYear = Number(/\d{4}/.exec(parts[0] ?? "")?.[0]);
    const endText = parts[1] ?? "";
    if (Number.isFinite(startYear)) years.push(startYear);
    if (/present/i.test(endText)) present = true;
    else {
      const endYear = Number(/\d{4}/.exec(endText)?.[0]);
      if (Number.isFinite(endYear)) years.push(endYear);
    }
  }
  const start = Math.min(...years);
  if (present) return `${start} – present`;
  const end = Math.max(...years);
  return start === end ? String(start) : `${start} – ${end}`;
}
