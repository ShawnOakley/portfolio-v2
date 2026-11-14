import { describe, expect, it } from "vitest";
import { parseNote } from "./notes";

describe("parseNote", () => {
  it("reads the title and the decision paragraph", () => {
    const src =
      "# Why X\n\n**Decision.** Do `X`,\nnot Y.\n\n**Why.** Because.\n";
    expect(parseNote("why-x", src)).toEqual({
      slug: "why-x",
      title: "Why X",
      summary: "Do X, not Y.",
    });
  });

  it("falls back to the slug when there is no heading", () => {
    expect(parseNote("untitled", "text")).toEqual({
      slug: "untitled",
      title: "untitled",
      summary: "",
    });
  });
});
