import { priorityColor, reportStatusColor } from "@/lib/dataviz/tokens";
import type { PriorityLevel, ReportStatus } from "@/lib/supabase/types";

const STATUS_LABEL: Record<ReportStatus, string> = {
  new: "New",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const PRIORITY_LABEL: Record<PriorityLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium"
      style={{
        color,
        borderColor: `${color}40`,
        backgroundColor: `${color}1a`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ReportStatus }) {
  return <Pill color={reportStatusColor[status]}>{STATUS_LABEL[status]}</Pill>;
}

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  return <Pill color={priorityColor[priority]}>{PRIORITY_LABEL[priority]}</Pill>;
}
