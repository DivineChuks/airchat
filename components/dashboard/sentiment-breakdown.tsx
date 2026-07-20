import { Smile, Meh, Frown } from "lucide-react";
import { sentimentColor } from "@/lib/dataviz/tokens";

const ORDER: { key: "positive" | "neutral" | "negative"; label: string; icon: typeof Smile }[] = [
  { key: "positive", label: "Positive", icon: Smile },
  { key: "neutral", label: "Neutral", icon: Meh },
  { key: "negative", label: "Negative", icon: Frown },
];

export function SentimentBreakdown({
  data,
}: {
  data: { sentiment: string; count: number }[];
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;
  const byKey = Object.fromEntries(data.map((d) => [d.sentiment, d.count]));

  return (
    <div className="grid grid-cols-3 gap-3">
      {ORDER.map(({ key, label, icon: Icon }) => {
        const count = byKey[key] ?? 0;
        const pct = Math.round((count / total) * 100);
        const color = sentimentColor[key];
        return (
          <div
            key={key}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-4 text-center"
          >
            <Icon className="h-5 w-5" style={{ color }} aria-hidden />
            <span className="text-lg font-semibold tabular-nums text-neutral-900">{count}</span>
            <span className="text-xs text-neutral-500">
              {label} · {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
