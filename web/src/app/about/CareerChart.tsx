"use client";

import { AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleUtc } from "@visx/scale";
import { Bar } from "@visx/shape";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Role, School } from "@/content/resume";
import {
  AXIS_H,
  BAR_H,
  barY,
  LANE_GAP,
  laneBlock,
  laneColor,
  layoutCareer,
  type PlacedRole,
} from "@/lib/career";

function whereOf(role: Role): string {
  return [role.organization, role.location].filter(Boolean).join(", ");
}

type Tip = {
  item: PlacedRole;
  left: number;
  top: number;
  above: boolean;
};

function tipAt(rect: DOMRect): Omit<Tip, "item"> {
  const width = 288;
  const margin = 12;
  let left = rect.left;
  if (left + width > window.innerWidth - margin) {
    left = Math.max(margin, window.innerWidth - width - margin);
  }
  const below = rect.bottom + 8;
  const above = below + 150 > window.innerHeight;
  return { left, top: above ? rect.top - 8 : below, above };
}

function ChartSvg({
  width,
  placed,
  laneTop,
  plotHeight,
  domain,
  selectedId,
  onSelect,
  onTip,
}: {
  width: number;
  placed: PlacedRole[];
  laneTop: Map<PlacedRole["lane"], number>;
  plotHeight: number;
  domain: [Date, Date];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onTip: (tip: Tip | null) => void;
}) {
  const xScale = scaleUtc({
    domain,
    range: [0, Math.max(0, width - 8)],
  });
  const ordered = [...placed].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );

  return (
    <svg width={width} height={plotHeight + AXIS_H} role="group">
      <Group>
        {ordered.map((item) => {
          const x = xScale(item.start);
          const widthPx = Math.max(xScale(item.end) - x, 4);
          const y = barY(laneTop.get(item.lane) ?? 0, item.row);
          const selected = selectedId === item.id;
          const where = whereOf(item.role);
          const label = [item.role.title, where, item.role.dates, item.lane]
            .filter(Boolean)
            .join(", ");
          return (
            <Bar
              key={item.id}
              className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              x={x}
              y={y}
              width={widthPx}
              height={BAR_H}
              rx={3}
              fill={laneColor[item.lane]}
              fillOpacity={selectedId && !selected ? 0.28 : 0.9}
              stroke={selected ? "var(--ink)" : "transparent"}
              strokeWidth={2}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={label}
              onMouseEnter={(event) =>
                onTip({
                  item,
                  ...tipAt(event.currentTarget.getBoundingClientRect()),
                })
              }
              onMouseLeave={() => onTip(null)}
              onFocus={(event) =>
                onTip({
                  item,
                  ...tipAt(event.currentTarget.getBoundingClientRect()),
                })
              }
              onBlur={() => onTip(null)}
              onClick={() => onSelect(item.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(item.id);
                }
              }}
            />
          );
        })}
      </Group>
      <AxisBottom
        top={plotHeight}
        scale={xScale}
        stroke="var(--rule)"
        tickStroke="var(--rule)"
        numTicks={8}
        tickFormat={(value) => {
          const date = value instanceof Date ? value : new Date(Number(value));
          return String(date.getUTCFullYear());
        }}
        tickLabelProps={() => ({
          fill: "var(--ink-soft)",
          fontSize: 12,
          fontFamily: "var(--font-ui)",
          textAnchor: "middle",
        })}
      />
    </svg>
  );
}

function useElementWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setWidth(element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}

export function CareerChart({
  roles,
  schools,
}: {
  roles: Role[];
  schools: School[];
}) {
  const asOf = useMemo(() => new Date(), []);
  const layout = useMemo(
    () => layoutCareer(roles, schools, asOf),
    [roles, schools, asOf],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const selected = layout.placed.find((item) => item.id === selectedId) ?? null;
  const { ref, width } = useElementWidth();
  const height = layout.plotHeight + AXIS_H;

  return (
    <div className="mt-site-4">
      <div className="overflow-x-auto">
        <div className="flex min-w-[40rem] gap-site-4">
          <div className="w-28 shrink-0">
            {layout.lanes.map((lane) => (
              <div
                key={lane.lane}
                className="flex items-center gap-site-2 text-step-small"
                style={{
                  height: laneBlock(lane.rows) - LANE_GAP,
                  marginBottom: LANE_GAP,
                }}
              >
                <span
                  aria-hidden
                  className="inline-block h-3 w-3 shrink-0 rounded-site"
                  style={{ background: laneColor[lane.lane] }}
                />
                {lane.lane}
              </div>
            ))}
          </div>
          <div ref={ref} className="min-w-0 flex-1" style={{ height }}>
            {width > 0 && (
              <ChartSvg
                width={width}
                placed={layout.placed}
                laneTop={layout.laneTop}
                plotHeight={layout.plotHeight}
                domain={layout.domain}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onTip={setTip}
              />
            )}
          </div>
        </div>
      </div>
      {tip && (
        <div
          className="pointer-events-none fixed z-20 w-72 rounded-site border border-rule bg-paper-raised p-site-3"
          style={{
            left: tip.left,
            top: tip.top,
            transform: tip.above ? "translateY(-100%)" : undefined,
          }}
        >
          <p className="font-serif font-semibold">{tip.item.role.title}</p>
          <p className="mt-site-1 text-step-small text-ink-soft tabular-nums">
            {[whereOf(tip.item.role), tip.item.role.dates]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p className="mt-site-2 text-step-small">{tip.item.role.outcome}</p>
        </div>
      )}
      <div className="mt-site-4">
        <div
          className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ gridTemplateRows: selected ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {selected && (
              <div
                key={selected.id}
                role="status"
                className="animate-career-rise"
              >
                <p className="font-serif text-step-1 font-semibold">
                  {selected.role.title}
                </p>
                <p className="mt-site-1 text-step-small text-ink-soft tabular-nums">
                  {[whereOf(selected.role), selected.role.dates]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="mt-site-2 max-w-[62ch] font-serif">
                  {selected.role.outcome}
                </p>
                {selected.role.explains && (
                  <p className="mt-site-2 text-step-small text-ink-soft">
                    Explains{" "}
                    {selected.role.explains.href ? (
                      <Link href={selected.role.explains.href}>
                        {selected.role.explains.label}
                      </Link>
                    ) : (
                      selected.role.explains.label
                    )}
                    .
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
