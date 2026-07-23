import type { LucideIcon } from "lucide-react";

function formatCompact(value: number): string {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(value);
}

export function StatTile({
  label,
  value,
  suffix,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: number;
  suffix?: string;
  icon?: LucideIcon;
  tone?: "default" | "critical" | "good";
}) {
  const valueColor =
    tone === "critical"
      ? "text-red-600"
      : tone === "good"
        ? "text-emerald-600"
        : "text-neutral-900";

  const iconChipColor =
    tone === "critical"
      ? "bg-red-50 text-red-500"
      : tone === "good"
        ? "bg-emerald-50 text-emerald-500"
        : "bg-blue-50 text-blue-600";

  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500">{label}</span>
        {Icon && (
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconChipColor}`}>
            <Icon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <div className={`mt-2.5 text-2xl font-semibold tracking-tight ${valueColor}`}>
        {formatCompact(value)}
        {suffix && <span className="ml-1 text-sm font-normal text-neutral-400">{suffix}</span>}
      </div>
    </div>
  );
}
