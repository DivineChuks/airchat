"use client";

import { useTransition } from "react";
import { updateReportStatusAction } from "./actions";
import type { ReportStatus } from "@/lib/supabase/types";
import { reportStatusColor } from "@/lib/dataviz/tokens";

const OPTIONS: { value: ReportStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export function StatusSelect({ id, status }: { id: string; status: ReportStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as ReportStatus;
        startTransition(() => {
          updateReportStatusAction(id, next);
        });
      }}
      onClick={(e) => e.stopPropagation()}
      style={{ color: reportStatusColor[status] }}
      className="rounded-lg border border-neutral-300 bg-white px-2 py-1 text-xs font-medium outline-none disabled:opacity-50"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value} className="text-neutral-900">
          {opt.label}
        </option>
      ))}
    </select>
  );
}
