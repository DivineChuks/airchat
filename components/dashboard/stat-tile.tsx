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

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-neutral-400" />}
      </div>
      <div className={`mt-2 text-2xl font-semibold ${valueColor}`}>
        {formatCompact(value)}
        {suffix && <span className="ml-1 text-sm font-normal text-neutral-400">{suffix}</span>}
      </div>
    </div>
  );
}
