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
        "this version of the opinion has no page numbers, so the page wasn't checked",
      ),
    ).toBeTruthy();
    expect(screen.queryByText(/Found on page/)).toBeNull();
  });

  it("says when nothing could be checked", () => {
    render(<ReportView report={{ cites: [], quotes: [] }} />);
    expect(screen.getByText("Nothing checkable was found.").textContent).toBe(
      "Nothing checkable was found.",
    );
  });
});
