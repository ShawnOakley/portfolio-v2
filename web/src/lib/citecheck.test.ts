import { describe, expect, it } from "vitest";
import {
  checkPayload,
  courtListenerUrl,
  groupCites,
  groupNeedsAttention,
  isProblemCite,
  looseQuotes,
  parseModels,
  parseReport,
  quoteTone,
  type Report,
} from "./citecheck";

const live: Report = {
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
      note: "",
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
    {
      id: 3,
      kind: "id",
      text: "Id. at 486",
      status: "found",
      note: "",
      plaintiff: "",
      defendant: "",
      volume: "",
      reporter: "",
      page: "",
      pin_pages: [486],
      parent_id: 1,
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
  verdicts: [],
};

describe("parseReport", () => {
  it("reads the live check shape", () => {
    expect(parseReport({ ...live, verdicts: [] })).toEqual(live);
  });

  it("rejects a report that is missing a citation field", () => {
    expect(parseReport({ cites: [{ id: 1 }], quotes: [] })).toBeNull();
  });
});

describe("courtListenerUrl", () => {
  it("prefixes a path and leaves an absolute URL alone", () => {
    expect(courtListenerUrl("/opinion/105221/")).toBe(
      "https://www.courtlistener.com/opinion/105221/",
    );
    expect(
      courtListenerUrl(
        "https://www.courtlistener.com/opinion/105221/brown-v-board-of-education/",
      ),
    ).toBe(
      "https://www.courtlistener.com/opinion/105221/brown-v-board-of-education/",
    );
  });
});

describe("grouping", () => {
  it("nests a short cite under its parent and keeps the quote with that parent", () => {
    const [brown, fake] = groupCites(live);
    expect(brown?.cite.id).toBe(1);
    expect(brown?.children.map((cite) => cite.id)).toEqual([3]);
    expect(brown?.quotes.map((quote) => quote.id)).toEqual([1]);
    expect(fake?.cite.id).toBe(2);
    expect(groupNeedsAttention(brown!)).toBe(false);
    expect(groupNeedsAttention(fake!)).toBe(true);
  });

  it("keeps a quote with no citation on its own", () => {
    const report: Report = {
      cites: [],
      quotes: [
        {
          ...live.quotes[0]!,
          cite_id: null,
          status: "unattributed",
        },
      ],
      verdicts: [],
    };
    expect(looseQuotes(report)).toHaveLength(1);
    expect(quoteTone("unattributed")).toBe("problem");
    expect(quoteTone("verified")).toBe("fine");
    expect(quoteTone("too_short")).toBe("skip");
    expect(isProblemCite("found")).toBe(false);
    expect(isProblemCite("not_found")).toBe(true);
  });
});

describe("checkPayload", () => {
  it("omits the model unless support was asked", () => {
    expect(checkPayload("brief", false, "qwen3.5-9b")).toEqual({
      text: "brief",
      verdicts: false,
    });
    expect(checkPayload("brief", true, "qwen3.5-9b")).toEqual({
      text: "brief",
      verdicts: true,
      model: "qwen3.5-9b",
    });
  });
});

describe("parseModels", () => {
  it("reads the model list", () => {
    expect(
      parseModels({
        models: [{ id: "qwen3.5-9b", label: "Qwen3.5 9B", available: true }],
      }),
    ).toEqual([{ id: "qwen3.5-9b", label: "Qwen3.5 9B", available: true }]);
  });
});
