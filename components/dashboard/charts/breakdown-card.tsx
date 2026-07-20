"use client";

import { useState } from "react";
import { RankedBarChart, type RankedBarDatum } from "@/components/dashboard/charts/ranked-bar-chart";

export interface BreakdownDataset {
  key: string;
  label: string;
  data: RankedBarDatum[];
}

export function BreakdownCard({ datasets }: { datasets: BreakdownDataset[] }) {
  const [activeKey, setActiveKey] = useState(datasets[0]?.key);
  const active = datasets.find((d) => d.key === activeKey) ?? datasets[0];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-700">Reports by {active?.label.toLowerCase()}</h2>
        <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
          {datasets.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setActiveKey(d.key)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                d.key === active?.key
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
      <RankedBarChart data={active?.data ?? []} />
    </div>
  );
}
