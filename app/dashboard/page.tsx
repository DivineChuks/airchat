import {
  Users,
  MessageSquareText,
  MapPin,
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { getDashboardStats } from "@/lib/data/reports";
import { StatTile } from "@/components/dashboard/stat-tile";
import { TrendChart } from "@/components/dashboard/charts/trend-chart";
import { BreakdownCard } from "@/components/dashboard/charts/breakdown-card";
import { SentimentBreakdown } from "@/components/dashboard/sentiment-breakdown";
import { StatusBadge, PriorityBadge } from "@/components/dashboard/badges";
import Link from "next/link";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default async function OverviewPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Executive Brief</h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-neutral-500">
          {stats.reportsReceived} reports received across {stats.communitiesCovered}{" "}
          communities. {stats.criticalCases} case{stats.criticalCases === 1 ? "" : "s"} flagged
          critical.{" "}
          {stats.topLga && (
            <>
              Most affected area: <span className="text-neutral-800">{stats.topLga}</span>.{" "}
            </>
          )}
          {stats.topIssue && (
            <>
              Top issue category: <span className="text-neutral-800">{stats.topIssue}</span>.
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Citizens Engaged" value={stats.citizensEngaged} icon={Users} />
        <StatTile label="Reports Received" value={stats.reportsReceived} icon={MessageSquareText} />
        <StatTile label="Communities Covered" value={stats.communitiesCovered} icon={MapPin} />
        <StatTile label="Open Cases" value={stats.openCases} icon={FolderOpen} />
        <StatTile label="Closed Cases" value={stats.closedCases} icon={CheckCircle2} tone="good" />
        <StatTile label="Critical Cases" value={stats.criticalCases} icon={AlertTriangle} tone="critical" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-sm font-medium text-neutral-700">Reports by day (last 14 days)</h2>
          <TrendChart data={stats.reportsByDay} />
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-sm font-medium text-neutral-700">Citizen sentiment</h2>
          <SentimentBreakdown data={stats.sentimentBreakdown} />
          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
            <Clock className="h-3.5 w-3.5" />
            Avg. resolution time: {stats.avgResponseHours}h
          </div>
        </div>
      </div>

      <BreakdownCard
        datasets={[
          {
            key: "category",
            label: "Category",
            data: stats.reportsByCategory.map((c) => ({ label: c.category, value: c.count })),
          },
          {
            key: "lga",
            label: "LGA",
            data: stats.reportsByLga.map((l) => ({ label: l.lga, value: l.count })),
          },
        ]}
      />

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral-700">Recent activity</h2>
          <Link href="/dashboard/reports" className="text-xs font-medium text-blue-700 hover:text-blue-600">
            View all reports →
          </Link>
        </div>
        <ul className="divide-y divide-neutral-100">
          {stats.recentActivity.map((r) => (
            <li
              key={r.id}
              className="-mx-2 flex items-center justify-between gap-4 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-blue-50/40"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-neutral-800">{r.summary ?? r.message}</p>
                <p className="mt-0.5 text-xs text-neutral-400">
                  {r.reference_number} · {r.community ?? r.lga ?? "Unknown"} · {timeAgo(r.created_at)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <PriorityBadge priority={r.priority} />
                <StatusBadge status={r.status} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
