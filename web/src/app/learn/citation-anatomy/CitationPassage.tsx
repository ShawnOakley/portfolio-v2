"use client";

import { useState } from "react";
import { AnnotatedText } from "@/components/ui/AnnotatedText";
import {
  citationSpans,
  citationText,
  partLabels,
} from "@/content/citation-anatomy";

export function CitationPassage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = citationSpans.find((span) => span.id === selectedId);
  const pointsAtFull = selected?.linksTo === "brown";

  return (
    <div>
      <p className="mt-site-6 font-serif text-[1.0625rem] leading-[1.65]">
        <AnnotatedText
          text={citationText}
          spans={citationSpans}
          selectedId={selectedId}
          onSelect={setSelectedId}
          label="Citation with its short forms"
        />
      </p>
      <p className="mt-site-4 min-h-6 text-ink-soft" role="status">
        {selected
          ? `${partLabels[selected.kind] ?? selected.kind}.${
              pointsAtFull ? " This points at the full citation." : ""
            }`
          : "Select a part of the citation."}
      </p>
    </div>
  );
}
