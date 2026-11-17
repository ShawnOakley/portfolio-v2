"use client";

import { useState } from "react";
import { Metric } from "@/components/ui/Metric";
import { scaledCount } from "@/lib/evaluation";

const FIELDS = [
  { key: "tp", label: "Actual yes, predicted yes" },
  { key: "fn", label: "Actual yes, predicted no" },
  { key: "fp", label: "Actual no, predicted yes" },
  { key: "tn", label: "Actual no, predicted no" },
] as const;

type Key = (typeof FIELDS)[number]["key"];

export function Matrix() {
  const [cells, setCells] = useState<Record<Key, number>>({
    tp: 45,
    fp: 5,
    fn: 5,
    tn: 45,
  });

  function setCell(key: Key, raw: string) {
    const next = Number(raw);
    if (!Number.isInteger(next) || next < 0) return;
    setCells((current) => ({ ...current, [key]: next }));
  }

  const predictedYes = cells.tp + cells.fp;
  const actualYes = cells.tp + cells.fn;
  const precisionN = predictedYes;
  const recallN = actualYes;
  const at50 = scaledCount(cells.tp, precisionN, 50);
  const at500 = scaledCount(cells.tp, precisionN, 500);

  return (
    <div>
      <table className="mt-site-6 border-collapse font-sans [&_caption]:mt-site-3 [&_caption]:caption-bottom [&_caption]:text-left [&_caption]:text-ink-soft [&_td]:py-site-2 [&_td]:pr-site-3 [&_td]:text-left [&_td]:font-normal [&_th]:py-site-2 [&_th]:pr-site-3 [&_th]:text-left [&_th]:font-normal">
        <caption>Illustrative counts. These are not measured results.</caption>
        <thead>
          <tr>
            <th />
            <th scope="col">Predicted yes</th>
            <th scope="col">Predicted no</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Actual yes</th>
            <Cell
              id="tp"
              label={FIELDS[0].label}
              value={cells.tp}
              onChange={setCell}
            />
            <Cell
              id="fn"
              label={FIELDS[1].label}
              value={cells.fn}
              onChange={setCell}
            />
          </tr>
          <tr>
            <th scope="row">Actual no</th>
            <Cell
              id="fp"
              label={FIELDS[2].label}
              value={cells.fp}
              onChange={setCell}
            />
            <Cell
              id="tn"
              label={FIELDS[3].label}
              value={cells.tn}
              onChange={setCell}
            />
          </tr>
        </tbody>
      </table>
      <div className="mt-site-6 flex flex-wrap gap-site-5">
        {precisionN > 0 ? (
          <Metric label="Precision" successes={cells.tp} n={precisionN} />
        ) : (
          <p>Precision needs at least one predicted yes.</p>
        )}
        {recallN > 0 ? (
          <Metric label="Recall" successes={cells.tp} n={recallN} />
        ) : (
          <p>Recall needs at least one actual yes.</p>
        )}
      </div>
      {precisionN > 0 && (
        <div className="mt-site-6 flex flex-wrap gap-site-5">
          <Metric label="Same precision at 50 items" successes={at50} n={50} />
          <Metric
            label="Same precision at 500 items"
            successes={at500}
            n={500}
          />
        </div>
      )}
    </div>
  );
}

function Cell({
  id,
  label,
  value,
  onChange,
}: {
  id: Key;
  label: string;
  value: number;
  onChange: (key: Key, raw: string) => void;
}) {
  return (
    <td>
      <input
        aria-label={label}
        className="w-20 rounded-site border border-rule bg-paper-raised p-site-2 font-[inherit] text-ink"
        inputMode="numeric"
        min={0}
        type="number"
        value={value}
        onChange={(event) => onChange(id, event.target.value)}
      />
    </td>
  );
}
