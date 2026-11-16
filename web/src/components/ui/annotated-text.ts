/** A range into `text`. `start` is inclusive and `end` is exclusive, in UTF-16 code units. */
export type TextSpan = {
  start: number;
  end: number;
  kind: string;
  id: string;
  /** Another span's id. Selecting this span also marks that one. */
  linksTo?: string;
};

export type LayoutNode =
  | { type: "text"; text: string }
  | { type: "span"; span: TextSpan; children: LayoutNode[] };

/**
 * Nest spans that contain each other. Spans that only overlap are split at
 * their boundaries so every fragment still carries each span that covers it.
 */
export function layoutText(
  text: string,
  spans: readonly TextSpan[],
  start = 0,
  end = text.length,
): LayoutNode[] {
  const usable = spans.filter(
    (span) =>
      span.start >= start &&
      span.end <= end &&
      span.start < span.end &&
      span.start >= 0 &&
      span.end <= text.length,
  );
  const exact = usable.filter(
    (span) => span.start === start && span.end === end,
  );
  const inner = usable.filter((span) => span.start > start || span.end < end);
  const body = layoutInner(text, inner, start, end);
  return exact.reduceRight<LayoutNode[]>(
    (children, span) => [{ type: "span", span, children }],
    body,
  );
}

function layoutInner(
  text: string,
  spans: readonly TextSpan[],
  start: number,
  end: number,
): LayoutNode[] {
  const top = spans
    .filter(
      (span) =>
        !spans.some(
          (other) =>
            other !== span &&
            other.start <= span.start &&
            other.end >= span.end &&
            (other.start < span.start || other.end > span.end),
        ),
    )
    .sort((a, b) => a.start - b.start || b.end - a.end);

  const overlaps = top.some(
    (span, index) => index > 0 && span.start < top[index - 1].end,
  );
  if (overlaps) return splitOverlaps(text, spans, start, end);

  const nodes: LayoutNode[] = [];
  let cursor = start;
  for (const span of top) {
    if (span.start > cursor) {
      nodes.push({ type: "text", text: text.slice(cursor, span.start) });
    }
    nodes.push({
      type: "span",
      span,
      children: layoutText(
        text,
        spans.filter((item) => item.id !== span.id),
        span.start,
        span.end,
      ),
    });
    cursor = span.end;
  }
  if (cursor < end) nodes.push({ type: "text", text: text.slice(cursor, end) });
  return nodes;
}

function splitOverlaps(
  text: string,
  spans: readonly TextSpan[],
  start: number,
  end: number,
): LayoutNode[] {
  const points = new Set<number>([start, end]);
  for (const span of spans) {
    if (span.start > start && span.start < end) points.add(span.start);
    if (span.end > start && span.end < end) points.add(span.end);
  }
  const cuts = [...points].sort((a, b) => a - b);
  const nodes: LayoutNode[] = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const from = cuts[i];
    const to = cuts[i + 1];
    const covering = spans
      .filter((span) => span.start <= from && span.end >= to)
      .sort((a, b) => a.end - a.start - (b.end - b.start));
    let node: LayoutNode = { type: "text", text: text.slice(from, to) };
    for (const span of covering) {
      node = { type: "span", span, children: [node] };
    }
    nodes.push(node);
  }
  return nodes;
}
