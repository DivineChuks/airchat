"use client";

import { useState } from "react";
import { chart } from "@/lib/dataviz/tokens";

export interface RankedBarDatum {
  label: string;
  value: number;
}

export function RankedBarChart({
  data,
  emptyLabel = "No data yet",
}: {
  data: RankedBarDatum[];
  emptyLabel?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));

  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-neutral-500">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-3">
      {data.map((d, i) => {
        const widthPct = Math.max(2, (d.value / max) * 100);
        const isHovered = hovered === i;
        return (
          <li key={d.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="truncate text-neutral-600">{d.label}</span>
              <span className="tabular-nums font-medium text-neutral-900">{d.value}</span>
            </div>
            <div
              className="relative h-3.5 w-full rounded-full bg-neutral-100"
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              role="img"
              aria-label={`${d.label}: ${d.value}`}
            >
              <div
                className="h-3.5 rounded-full transition-[width]"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: chart.seriesBlue,
                  opacity: isHovered ? 1 : 0.85,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
