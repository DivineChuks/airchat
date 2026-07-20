"use client";

import { useId, useState } from "react";
import { chart } from "@/lib/dataviz/tokens";

export interface TrendDatum {
  date: string; // ISO yyyy-mm-dd
  count: number;
}

const WIDTH = 700;
const HEIGHT = 200;
const PAD_LEFT = 28;
const PAD_RIGHT = 8;
const PAD_TOP = 12;
const PAD_BOTTOM = 24;

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatShortDate(iso: string) {
  // Fixed, locale-independent formatting — toLocaleDateString(undefined, ...)
  // resolves to whatever locale the runtime defaults to, which can differ
  // between the Node server and the browser and causes hydration mismatches.
  const d = new Date(iso + "T00:00:00");
  return `${MONTH_ABBR[d.getMonth()]} ${d.getDate()}`;
}

export function TrendChart({ data }: { data: TrendDatum[] }) {
  const gradientId = useId();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-neutral-500">No data yet</p>;
  }

  const max = Math.max(1, ...data.map((d) => d.count));
  const yMax = Math.ceil(max / 5) * 5 || 5;
  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const xFor = (i: number) =>
    PAD_LEFT + (data.length === 1 ? plotWidth / 2 : (i / (data.length - 1)) * plotWidth);
  const yFor = (v: number) => PAD_TOP + plotHeight - (v / yMax) * plotHeight;

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i).toFixed(1)} ${yFor(d.count).toFixed(1)}`)
    .join(" ");
  const areaPath =
    linePath +
    ` L ${xFor(data.length - 1).toFixed(1)} ${(PAD_TOP + plotHeight).toFixed(1)}` +
    ` L ${xFor(0).toFixed(1)} ${(PAD_TOP + plotHeight).toFixed(1)} Z`;

  const yTicks = [0, yMax / 2, yMax];
  const hovered = hoveredIndex !== null ? data[hoveredIndex] : null;
  const labelStep = Math.ceil(data.length / 7);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Reports received per day over the last 14 days"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chart.seriesBlue} stopOpacity={0.18} />
            <stop offset="100%" stopColor={chart.seriesBlue} stopOpacity={0} />
          </linearGradient>
        </defs>

        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke={chart.gridline}
              strokeWidth={1}
            />
            <text x={0} y={yFor(t) + 3} fontSize={9} fill={chart.textMuted}>
              {t}
            </text>
          </g>
        ))}

        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path d={linePath} fill="none" stroke={chart.seriesBlue} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {data.map((d, i) =>
          i % labelStep === 0 ? (
            <text
              key={d.date}
              x={xFor(i)}
              y={HEIGHT - 6}
              fontSize={9}
              textAnchor="middle"
              fill={chart.textMuted}
            >
              {formatShortDate(d.date)}
            </text>
          ) : null
        )}

        {hoveredIndex !== null && (
          <line
            x1={xFor(hoveredIndex)}
            x2={xFor(hoveredIndex)}
            y1={PAD_TOP}
            y2={PAD_TOP + plotHeight}
            stroke={chart.baseline}
            strokeWidth={1}
          />
        )}

        {data.map((d, i) => (
          <g key={d.date}>
            {hoveredIndex === i && (
              <circle
                cx={xFor(i)}
                cy={yFor(d.count)}
                r={5}
                fill={chart.seriesBlue}
                stroke={chart.surface}
                strokeWidth={2}
              />
            )}
            <rect
              x={xFor(i) - plotWidth / data.length / 2}
              y={PAD_TOP}
              width={plotWidth / data.length}
              height={plotHeight}
              fill="transparent"
              onPointerEnter={() => setHoveredIndex(i)}
              onPointerLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
              tabIndex={0}
              aria-label={`${formatShortDate(d.date)}: ${d.count} reports`}
            />
          </g>
        ))}
      </svg>

      {hovered && hoveredIndex !== null && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 -translate-y-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs shadow-md"
          style={{ left: `${(xFor(hoveredIndex) / WIDTH) * 100}%` }}
        >
          <div className="font-semibold text-neutral-900 tabular-nums">{hovered.count} reports</div>
          <div className="text-neutral-500">{formatShortDate(hovered.date)}</div>
        </div>
      )}
    </div>
  );
}
