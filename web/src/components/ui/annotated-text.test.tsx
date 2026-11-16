import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnnotatedText } from "./AnnotatedText";
import { layoutText, type TextSpan } from "./annotated-text";

const citation = "Brown 347.";
const nested: TextSpan[] = [
  { start: 0, end: citation.length, kind: "citation", id: "full" },
  { start: 0, end: 5, kind: "case", id: "case" },
  {
    start: citation.indexOf("347"),
    end: citation.indexOf("347") + 3,
    kind: "volume",
    id: "volume",
  },
];

afterEach(() => cleanup());

describe("layoutText", () => {
  it("nests a span inside the span that contains it", () => {
    const [full] = layoutText(citation, nested);
    expect(full).toMatchObject({ type: "span", span: { id: "full" } });
    if (full?.type !== "span") return;
    const ids = full.children
      .filter((node) => node.type === "span")
      .map((node) => node.span.id);
    expect(ids).toEqual(["case", "volume"]);
  });

  it("keeps every character when spans only overlap", () => {
    const nodes = layoutText("abcd", [
      { start: 0, end: 3, kind: "a", id: "a" },
      { start: 1, end: 4, kind: "b", id: "b" },
    ]);
    expect(flatten(nodes)).toBe("abcd");
  });

  it("drops a span that runs past the string", () => {
    expect(
      layoutText("ab", [{ start: 0, end: 4, kind: "x", id: "x" }]),
    ).toEqual([{ type: "text", text: "ab" }]);
  });
});

describe("AnnotatedText", () => {
  const text = `${citation} See id.`;
  const shortAt = text.indexOf("id.");
  const spans: TextSpan[] = [
    ...nested,
    {
      start: shortAt,
      end: shortAt + 3,
      kind: "id",
      id: "short",
      linksTo: "full",
    },
  ];

  it("renders the source text so it can be copied", () => {
    render(<AnnotatedText text={text} spans={spans} label="Citation" />);
    expect(screen.getByLabelText("Citation").textContent).toBe(text);
  });

  it("selects a span from the keyboard and reports its id", () => {
    const onSelect = vi.fn();
    render(
      <AnnotatedText
        text={text}
        spans={spans}
        label="Citation"
        onSelect={onSelect}
      />,
    );
    const volume = screen.getByRole("button", { name: "347" });
    fireEvent.keyDown(volume, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith("volume");
    expect(volume.getAttribute("aria-pressed")).toBe("true");
  });

  it("marks the span a short cite points at", () => {
    render(<AnnotatedText text={text} spans={spans} label="Citation" />);
    fireEvent.click(screen.getByRole("button", { name: "id." }));
    expect(
      document
        .querySelector('[data-span="full"]')
        ?.getAttribute("data-pointed"),
    ).toBe("true");
  });
});

function flatten(nodes: ReturnType<typeof layoutText>): string {
  return nodes
    .map((node) => (node.type === "text" ? node.text : flatten(node.children)))
    .join("");
}
