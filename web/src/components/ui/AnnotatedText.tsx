"use client";

import { useState } from "react";
import { layoutText, type LayoutNode, type TextSpan } from "./annotated-text";
import styles from "./AnnotatedText.module.css";

export type { TextSpan } from "./annotated-text";

type Props = {
  text: string;
  spans: readonly TextSpan[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  label: string;
};

export function AnnotatedText({
  text,
  spans,
  selectedId,
  onSelect,
  label,
}: Props) {
  const [ownId, setOwnId] = useState<string | null>(null);
  const selected = selectedId === undefined ? ownId : selectedId;
  const linkedId = spans.find((span) => span.id === selected)?.linksTo ?? null;
  const seen = new Set<string>();

  function select(id: string) {
    setOwnId(id);
    onSelect?.(id);
  }

  return (
    <span className={styles.root} aria-label={label}>
      {layoutText(text, spans).map((node, index) =>
        renderNode(node, index, { selected, linkedId, seen, select }),
      )}
    </span>
  );
}

function renderNode(
  node: LayoutNode,
  key: number,
  state: {
    selected: string | null;
    linkedId: string | null;
    seen: Set<string>;
    select: (id: string) => void;
  },
): React.ReactNode {
  if (node.type === "text") return node.text;
  const first = !state.seen.has(node.span.id);
  state.seen.add(node.span.id);
  const pressed = node.span.id === state.selected;
  const pointed = node.span.id === state.linkedId;
  // A button cannot contain another button. Only the innermost span is one.
  const leaf = !node.children.some((child) => child.type === "span");
  const interactive = first && leaf;
  return (
    <span
      key={key}
      className={styles.mark}
      data-span={node.span.id}
      data-kind={node.span.kind}
      data-pointed={pointed ? "true" : undefined}
      data-selected={pressed ? "true" : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? pressed : undefined}
      onClick={(event) => {
        event.stopPropagation();
        state.select(node.span.id);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          state.select(node.span.id);
        }
      }}
    >
      {node.children.map((child, index) => renderNode(child, index, state))}
    </span>
  );
}
