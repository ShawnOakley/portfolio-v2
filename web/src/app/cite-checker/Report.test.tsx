import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { parseReport } from "@/lib/citecheck";
import { ReportView } from "./Report";

const golden = parseReport(
  JSON.parse(
    readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "fixtures",
        "check-brown-2026-11-19.json",
      ),
      "utf8",
    ),
  ),
);

afterEach(() => cleanup());

describe("ReportView", () => {
  it("renders the recorded Brown check", () => {
    expect(golden).not.toBeNull();
    if (!golden) return;
    render(<ReportView report={golden} />);

    expect(screen.getByRole("heading", { name: "Problems" }).textContent).toBe(
      "Problems",
    );
    expect(screen.getByText("Nobody v. Nowhere")).toBeTruthy();
    expect(screen.getByText("999 U.S. 999")).toBeTruthy();
    expect(
      screen.getByText(
        "nothing at this citation, and no case by this name in CourtListener from 2019 to 2021",
      ),
    ).toBeTruthy();

    const link = screen.getByRole("link", {
      name: "Brown v. Board of Education",
    });
    expect(link.getAttribute("href")).toBe(
      "https://www.courtlistener.com/opinion/105221/brown-v-board-of-education/",
    );
    expect(
      screen.getByText(
        "separate educational facilities are inherently unequal.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("Verified")).toBeTruthy();
    expect(
      screen.getByText(
        "This version of the opinion has no page numbers, so the page wasn't checked.",
      ),
    ).toBeTruthy();
    expect(screen.queryByText(/Found on page/)).toBeNull();
  });

  it("lists each name-search hit on its own line", () => {
    const report = parseReport({
      cites: [
        {
          id: 0,
          kind: "full_case",
          text: "999 U.S. 999",
          status: "citation_mismatch",
          note: "CourtListener has Fahy v. Board of Education (N.Y. App. Div. 1955) at 286 A.D. 1001; Board of Education v. Cooper (Cal. Ct. App. 1955) at 136 Cal. App. 2d 513",
          plaintiff: "Brown",
          defendant: "Board of Education",
          volume: "999",
          reporter: "U.S.",
          page: "999",
          pin_pages: [],
          parent_id: null,
          case_names: [
            "Fahy v. Board of Education",
            "Board of Education v. Cooper",
          ],
          urls: [
            "https://www.courtlistener.com/opinion/1/fahy/",
            "https://www.courtlistener.com/opinion/2/cooper/",
          ],
        },
      ],
      quotes: [],
      verdicts: [],
    });
    expect(report).not.toBeNull();
    if (!report) return;
    render(<ReportView report={report} />);

    expect(screen.getByText("Brown v. Board of Education")).toBeTruthy();
    expect(screen.getByText("999 U.S. 999")).toBeTruthy();
    expect(screen.getByText("Citation mismatch")).toBeTruthy();
    expect(
      screen.queryByText(/Fahy v. Board of Education; Board of Education/),
    ).toBeNull();
    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Fahy v. Board of Education (N.Y. App. Div. 1955) at 286 A.D. 1001",
      "Board of Education v. Cooper (Cal. Ct. App. 1955) at 136 Cal. App. 2d 513",
    ]);
  });

  it("says when nothing could be checked", () => {
    render(<ReportView report={{ cites: [], quotes: [], verdicts: [] }} />);
    expect(screen.getByText("Nothing checkable was found.").textContent).toBe(
      "Nothing checkable was found.",
    );
  });
});
