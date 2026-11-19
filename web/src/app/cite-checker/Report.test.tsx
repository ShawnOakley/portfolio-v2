import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ReportView } from "./Report";
import type { Report } from "@/lib/citecheck";

const report: Report = {
  cites: [
    {
      id: 1,
      kind: "full_case",
      text: "347 U.S. 483",
      status: "found",
      note: "",
      plaintiff: "Brown",
      defendant: "Board of Education",
      volume: "347",
      reporter: "U.S.",
      page: "483",
      pin_pages: [],
      parent_id: null,
      case_names: ["Brown v. Board of Education"],
      urls: ["/opinion/105221/brown-v-board-of-education/"],
    },
    {
      id: 2,
      kind: "full_case",
      text: "999 U.S. 999",
      status: "not_found",
      note: "No case at this citation.",
      plaintiff: "",
      defendant: "",
      volume: "999",
      reporter: "U.S.",
      page: "999",
      pin_pages: [],
      parent_id: null,
      case_names: [],
      urls: [],
    },
  ],
  quotes: [
    {
      id: 1,
      text: "separate educational facilities are inherently unequal",
      status: "verified",
      note: "",
      cite_id: 1,
      how: "follows",
      omits: false,
      score: 100,
      found_on: [],
    },
  ],
};

afterEach(() => cleanup());

describe("ReportView", () => {
  it("puts a missing case in Problems and links the found case", () => {
    render(<ReportView report={report} />);
    expect(screen.getByRole("heading", { name: "Problems" }).textContent).toBe(
      "Problems",
    );
    expect(screen.getByText("999 U.S. 999")).toBeTruthy();
    expect(screen.getByText("No case at this citation.")).toBeTruthy();
    const link = screen.getByRole("link", {
      name: "Brown v. Board of Education",
    });
    expect(link.getAttribute("href")).toBe(
      "https://www.courtlistener.com/opinion/105221/brown-v-board-of-education/",
    );
    expect(
      screen.getByText(
        "separate educational facilities are inherently unequal",
      ),
    ).toBeTruthy();
    expect(screen.queryByText(/failure/i)).toBeNull();
  });

  it("says when nothing could be checked", () => {
    render(<ReportView report={{ cites: [], quotes: [] }} />);
    expect(screen.getByText("Nothing checkable was found.").textContent).toBe(
      "Nothing checkable was found.",
    );
  });
});
